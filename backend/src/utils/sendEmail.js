const nodemailer = require("nodemailer");

// transporter configuration (use your Gmail/SMTP settings)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     // your email
    pass: process.env.EMAIL_PASS      // your app password
  }
});

// Send OTP or any message
async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"Finance Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}

module.exports = sendEmail;
