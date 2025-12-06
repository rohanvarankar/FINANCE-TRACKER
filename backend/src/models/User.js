const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Salt rounds for hashing passwords and OTPs
const SALT_ROUNDS = 10;

// Create a new schema (structure of User document)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,         // Username must be provided
    minlength: 2,           // At least 2 characters
    maxlength: 50,
    trim: true              // Removes extra spaces from start & end
  },

  email: {
    type: String,
    required: true,
    unique: true,           // Prevents duplicate emails
    trim: true,
    lowercase: true         // Converts to lowercase for consistency
  },

  passwordHash: {
    type: String,
    required: true          // Store encrypted version of password
  },

  isVerified: {
    type: Boolean,
    default: false          // Becomes true only after OTP verification
  },

  otpHash: {
    type: String,
    default: null           // Stores hashed OTP during signup or forgot password
  },

  otpExpiresAt: {
    type: Date,
    default: null           // OTP expires after X minutes
  },

  createdAt: {
    type: Date,
    default: () => new Date()
  },

  updatedAt: {
    type: Date,
    default: () => new Date()
  }
});


// Automatically update "updatedAt" before saving to DB
UserSchema.pre("save", function () {
  this.updatedAt = new Date();
});


// Method to compare entered password with stored hashed password
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Static function for hashing password before saving
UserSchema.statics.hashPassword = async function (plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};



module.exports = mongoose.model("User", UserSchema);

