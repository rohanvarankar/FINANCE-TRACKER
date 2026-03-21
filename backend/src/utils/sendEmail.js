require("dotenv").config();
const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}


async function sendEmail(to, subject, text, html) {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"FinTrack 💰" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text, // fallback for non-HTML clients
      html: html || `<p>${text}</p>`,
    });
    console.log(`✅ ACTUAL EMAIL SENT to ${to} (Message ID: ${info.messageId})`);
  } catch (err) {
    console.error(`❌ NODEMAILER ERROR while sending to ${to}:`, err.message);
    throw err; // throw so the caller still knows it failed
  }
}

/**
 * Sends a beautifully formatted OTP email
 * @param {string} to
 * @param {string} otp
 * @param {"signup"|"reset-password"} purpose
 */
async function sendOtpEmail(to, otp, purpose = "signup") {
  // ALWAYS LOG TO CONSOLE (for development troubleshooting)
  console.log("\n-----------------------------------------");
  console.log(`🔑 [DEBUG] OTP for ${to}: ${otp} (${purpose})`);
  console.log("-----------------------------------------\n");

  const isReset = purpose === "reset-password";
  const subject = isReset ? "FinTrack – Password Reset OTP" : "FinTrack – Verify Your Account";
  const headline = isReset ? "Reset Your Password" : "Verify Your Email";
  // ... (rest of the template logic)

  const subtext = isReset
    ? "You requested to reset your FinTrack password. Use the OTP below. It expires in <strong>10 minutes</strong>."
    : "Thanks for signing up! Use the OTP below to verify your account. It expires in <strong>10 minutes</strong>.";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f0fdfb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:36px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:12px 20px;">
                <span style="font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Fin<span style="color:#99f6e4;">Track</span></span>
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:48px;">
              <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#0f172a;">${headline}</h1>
              <p style="margin:0 0 32px;color:#475569;font-size:15px;line-height:1.6;">${subtext}</p>

              <!-- OTP Box -->
              <div style="background:#f0fdfb;border:2px dashed #14b8a6;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:500;letter-spacing:1px;text-transform:uppercase;">Your One-Time Password</p>
                <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#0f766e;font-variant-numeric:tabular-nums;">${otp}</div>
              </div>

              <p style="margin:0 0 8px;color:#64748b;font-size:14px;">⏰ This OTP expires in <strong>10 minutes</strong>.</p>
              <p style="margin:0;color:#64748b;font-size:14px;">🔒 Never share this OTP with anyone. FinTrack will never ask for it.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 48px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                If you didn't request this, you can safely ignore this email.<br/>
                &copy; ${new Date().getFullYear()} FinTrack &mdash; Your smart money manager.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await sendEmail(to, subject, `Your FinTrack OTP is: ${otp} (expires in 10 minutes)`, html);
}

module.exports = { sendEmail, sendOtpEmail };
