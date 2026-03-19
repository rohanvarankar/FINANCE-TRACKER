const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// --------------------------------------
// AUTH ROUTES
// --------------------------------------

// Signup
router.post("/signup", authController.signup);

// UNIVERSAL OTP VERIFICATION (Signup + Reset Password)
router.post("/verify-otp", authController.verifyOtp);

// Signin
router.post("/signin", authController.signin);

// Forgot Password → Send OTP
router.post("/forgot-password", authController.forgotPassword);

// Reset Password → After OTP verification
router.post("/reset-password", authController.resetPassword);

// Change Password (Logged-in user)
router.put("/change-password", authMiddleware, authController.changePassword);

// Refresh Token
router.post("/refresh-token", authController.refreshAccessToken);

// Logout
router.post("/logout", authController.logout);

// Resend OTP
router.post("/resend-otp", authController.resendOtp);

module.exports = router;
