const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const generateOtp = require("../utils/generateOtp");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");


// ======================================================
// 1) SIGNUP
// ======================================================
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await User.hashPassword(password);

    user = await User.create({ username, email, passwordHash });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Your OTP Verification Code", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "Signup successful. OTP sent to email.", email });

  } catch (error) {
    console.log("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 2) UNIVERSAL OTP VERIFY  (Signup + Forgot Password)
// ======================================================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate OTP expiry
    if (!user.otpExpiresAt || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    // Clear OTP
    user.otpHash = null;
    user.otpExpiresAt = null;

    // ------------------------
    // RESET PASSWORD FLOW
    // ------------------------
    if (purpose === "reset-password") {
      user.isResetOTPVerified = true;
      await user.save();

      return res.json({
        message: "OTP verified for password reset",
        next: "reset-password"
      });
    }

    // ------------------------
    // SIGNUP FLOW
    // ------------------------
    user.isVerified = true;
    await user.save();

    return res.json({
      message: "Signup OTP verified. You can now sign in.",
      next: "signin"
    });

  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 3) SIGNIN
// ======================================================
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Account not verified. Please verify OTP." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Signin successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.log("SIGNIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ======================================================
// 4) FORGOT PASSWORD → SEND OTP
// ======================================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
    user.isResetOTPVerified = false;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

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

    if (!email || !newPassword)
      return res.status(400).json({ message: "Email and new password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.isResetOTPVerified)
      return res.status(400).json({ message: "OTP verification required before resetting password" });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

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

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

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
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
