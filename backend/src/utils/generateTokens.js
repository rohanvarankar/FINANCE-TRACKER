const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }   // Increased from 15m to 1d for better dev experience
  );
}

function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }   // refresh tokens last longer
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
