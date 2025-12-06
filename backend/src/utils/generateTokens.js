const jwt = require("jsonwebtoken");

function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }   // access tokens are short-lived
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
