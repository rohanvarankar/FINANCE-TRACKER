const User = require("../models/User");
const PendingSignup = require("../models/PendingSignup");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/sendEmail");
const generateOtp = require("../utils/generateOtp");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");


// ADD THIS AT TOP (after imports)
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


// ======================================================
// 1) SIGNUP  →  Store in PendingSignup (NOT in User yet)
// ======================================================
exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // Sanitize
    email = email.toLowerCase().trim();

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8+ chars, include uppercase, number & special character",
      });
    }

    // Block if a fully-verified account already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered. Please sign in." });

    const passwordHash = await User.hashPassword(password);

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 8);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert PendingSignup so re-signup with same email refreshes the OTP
    await PendingSignup.findOneAndUpdate(
      { email },
      { username, email, passwordHash, otpHash, otpExpiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send OTP email (non-blocking)
    sendOtpEmail(email, otp, "signup").catch(err => {
      console.error(`EMAIL ERROR (Signup): ${err.message}`);
    });

    res.status(201).json({ message: "OTP sent to your email. Verify to complete signup.", email });

  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 2) UNIVERSAL OTP VERIFY  (Signup + Forgot Password)
// ======================================================
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp, purpose } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    email = email.toLowerCase().trim();

    // ── SIGNUP FLOW ──────────────────────────────────────
    if (!purpose || purpose === "signup") {
      const pending = await PendingSignup.findOne({ email });

      if (!pending)
        return res.status(404).json({ message: "No pending signup found. Please sign up again." });

      if (pending.otpExpiresAt < new Date())
        return res.status(400).json({ message: "OTP expired. Please request a new one." });

      const isMatch = await bcrypt.compare(otp, pending.otpHash);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid OTP" });

      // OTP is valid → now create the real User
      await User.create({
        username:     pending.username,
        email:        pending.email,
        passwordHash: pending.passwordHash,
        isVerified:   true,
      });

      // Clean up pending record
      await PendingSignup.deleteOne({ email });

      return res.json({ message: "Email verified! You can now sign in.", next: "signin" });
    }

    // ── RESET PASSWORD FLOW ──────────────────────────────
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otpExpiresAt || user.otpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired. Please request a new one." });

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.otpHash = null;
    user.otpExpiresAt = null;
    user.isResetOTPVerified = true;
    await user.save();

    return res.json({ message: "OTP verified. You can now reset your password.", next: "reset-password" });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 3) SIGNIN
// ======================================================
exports.signin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validation & Input Cleanup
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    email = email.toLowerCase().trim();

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      // Check if they have a pending signup
      const pending = await PendingSignup.findOne({ email });
      if (pending) {
        return res.status(401).json({ 
          message: "Your account is not verified yet. Please check your email for the verification code.",
          needsVerification: true,
          email: pending.email
        });
      }
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check Verification
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: "Your account is not verified yet. Please check your email for the verification code.",
        needsVerification: true
      });
    }

    // Compare Password (using User model method)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Refresh Token Cookie Implementation
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Final Payload
    res.json({
      message: "Sign-in successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatarUrl
      }
    });

  } catch (error) {
    console.error(`[AUTH_SIGNIN_ERROR]: ${error.message}`);
    res.status(500).json({ message: "A server error occurred. Please try again later." });
  }
};



// ======================================================
// 4) FORGOT PASSWORD → SEND OTP
// ======================================================
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 8);

    user.otpHash = otpHash;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    user.isResetOTPVerified = false;
    await user.save();

    // Send beautiful OTP email
    sendOtpEmail(email, otp, "reset-password").catch(err => {
      console.error(`EMAIL ERROR (Forgot PWD): ${err.message}`);
    });

    res.json({ message: "OTP sent to email", email });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 5) RESET PASSWORD (After OTP Verified)
// ======================================================
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({
    message: "Password must be 8+ chars, include uppercase, number & special character",
  });
}

    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.isResetOTPVerified)
      return res.status(400).json({ message: "OTP verification required before resetting password" });

    user.passwordHash = await User.hashPassword(newPassword);

    user.isResetOTPVerified = false;
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ======================================================
// 6) CHANGE PASSWORD (Logged-in user)
// ======================================================
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    if (!passwordRegex.test(newPassword)) {
  return res.status(400).json({
    message: "Password must be 8+ chars, include uppercase, number & special character",
  });
}

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    user.passwordHash = await User.hashPassword(newPassword);

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ======================================================
// 7) REFRESH TOKEN
// ======================================================
exports.refreshAccessToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res.status(401).json({ message: "Refresh token missing" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken(decoded.userId);

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.log("REFRESH TOKEN ERROR:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};




// ======================================================
// 8) LOGOUT
// ======================================================
exports.logout = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};


// ======================================================
// 9) RESEND OTP
// ======================================================
exports.resendOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 8);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!purpose || purpose === "signup") {
      // Signup flow — update PendingSignup
      const pending = await PendingSignup.findOneAndUpdate(
        { email },
        { otpHash, otpExpiresAt },
        { new: true }
      );
      if (!pending) return res.status(404).json({ message: "No pending signup found. Please sign up again." });
    } else {
      // Reset-password flow — update User
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    sendOtpEmail(email, otp, purpose || "signup").catch(err => {
      console.error(`EMAIL ERROR (Resend): ${err.message}`);
    });

    res.json({ message: "New OTP sent to email" });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
