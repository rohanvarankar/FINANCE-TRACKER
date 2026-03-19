const mongoose = require("mongoose");

/**
 * Holds signup data temporarily until OTP is verified.
 * MongoDB TTL index auto-deletes documents after otpExpiresAt.
 */
const pendingSignupSchema = new mongoose.Schema({
  username:     { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  otpHash:      { type: String, required: true },
  otpExpiresAt: { type: Date,   required: true },
}, { timestamps: true });

// MongoDB TTL: auto-delete document 10 minutes after otpExpiresAt
pendingSignupSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PendingSignup", pendingSignupSchema);
