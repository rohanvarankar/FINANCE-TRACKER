// Generates a 6-digit OTP as a string (000001 to 999999)
function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

module.exports = generateOtp;
