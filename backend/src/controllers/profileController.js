const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// -------------------------
// GET PROFILE
// -------------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username email createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });

  } catch (err) {
    console.log("PROFILE ERROR:", err);
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};

// -------------------------
// UPDATE PROFILE (username/email)
// -------------------------
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      // Email changed → send OTP again for verification
      const otp = generateOtp();
      user.otpHash = await bcrypt.hash(otp, 10);
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      user.isVerified = false;

      await sendEmail(email, "Email Verification OTP", `Your OTP: ${otp}`);
      user.email = email;
    }

    if (username) user.username = username;

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// CHANGE PASSWORD
// -------------------------
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
