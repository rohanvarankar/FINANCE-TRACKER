/**
 * Quick email test — run this directly to see exact error:
 * node src/test-email.js
 */
require("dotenv").config();
const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("=== EMAIL TEST ===");
console.log("EMAIL_USER:", EMAIL_USER || "❌ NOT SET");
console.log("EMAIL_PASS:", EMAIL_PASS ? `✓ Present (${EMAIL_PASS.length} chars)` : "❌ NOT SET");

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error("\n❌ Missing EMAIL_USER or EMAIL_PASS in .env — fix these first.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("\n❌ SMTP CONNECTION FAILED:");
    console.error(error.message);
    console.error("\n📋 COMMON FIXES:");
    console.error("  1. Make sure 2-Step Verification is ON for your Google account.");
    console.error("  2. Generate a fresh 16-char App Password at:");
    console.error("     https://myaccount.google.com/apppasswords");
    console.error("  3. Set EMAIL_PASS in .env to the 16-char code WITHOUT spaces.");
    console.error("     Example: EMAIL_PASS=mzosttptxgkpljxk");
    process.exit(1);
  } else {
    console.log("\n✅ SMTP connected! Sending test email to:", EMAIL_USER);

    transporter.sendMail({
      from: `"FinTrack Test" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: "✅ FinTrack Email Test",
      text: "This is a test email from your FinTrack backend. If you see this, OTP emails will work!",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;background:#f0fdfb;border-radius:16px;">
          <h2 style="color:#0d9488;">✅ Email is working!</h2>
          <p>Your FinTrack backend can send emails successfully.</p>
          <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#0f766e;text-align:center;">1 2 3 4 5 6</p>
          <p style="color:#64748b;font-size:13px;">This is how your OTP emails will look.</p>
        </div>`
    }, (err, info) => {
      if (err) {
        console.error("\n❌ SEND FAILED:", err.message);
      } else {
        console.log("\n✅ EMAIL SENT SUCCESSFULLY!");
        console.log("   Message ID:", info.messageId);
        console.log("   Check your inbox (and spam folder).");
      }
      process.exit(0);
    });
  }
});
