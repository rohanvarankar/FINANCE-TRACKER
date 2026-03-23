require("dotenv").config();

async function sendEmail(to, subject, text, html) {
  try {
    let frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const apiEndpoint = `${frontendUrl}/api/send-email`;

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        
        // ✅ ADDED: Helps email providers identify request properly
        "X-Mailer": "TrackFin-Mailer",
      },
      body: JSON.stringify({
        to,
        subject,
        
        // ✅ IMPROVED: Better plain text version (important for spam filters)
        text: text || `Your TrackFin verification code is ${html?.match(/\d+/)?.[0] || ""}. This code expires in 10 minutes.`,
        
        html: html || `<p>${text}</p>`,

        secret: process.env.EMAIL_API_SECRET,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

        // ✅ ADDED: Email metadata (important for spam reduction)
        headers: {
          "X-Priority": "1",
          "X-MSMail-Priority": "High",
          "Importance": "High",
        },

        // ✅ ADDED: Helps inbox placement
        replyTo: process.env.EMAIL_USER,
      }),
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Email Gateway Proxy Error: ${errText}`);
    }

    console.log(`✅ Email relayed successfully via Vercel to ${to}`);
  } catch (err) {
    console.error(`❌ Vercel Gateway Proxy Failure for ${to}:`, err.message);
    throw err;
  }
}

async function sendOtpEmail(to, otp, purpose = "signup") {
  console.log("\n-----------------------------------------");
  console.log(`🔑 [DEBUG] OTP for ${to}: ${otp} (${purpose})`);
  console.log("-----------------------------------------\n");

  const isReset = purpose === "reset-password";

  // ✅ IMPROVED SUBJECT (LESS SPAMMY)
  const subject = isReset 
    ? "Reset your TrackFin password – OTP inside" 
    : "Verify your TrackFin account – OTP inside";

  const headline = isReset ? "Reset Your Password" : "Verify Your Email";

  const subtext = isReset
    ? "You requested to reset your TrackFin password. Use the OTP below. It expires in <strong>10 minutes</strong>."
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
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:36px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:16px;padding:12px 20px;">
                <span style="font-size:28px;font-weight:900;color:#ffffff;">Fin<span style="color:#99f6e4;">Track</span></span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:48px;">
              <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#0f172a;">${headline}</h1>
              <p style="margin:0 0 32px;color:#475569;font-size:15px;line-height:1.6;">${subtext}</p>
              <div style="background:#f0fdfb;border:2px dashed #14b8a6;border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:500;">Your One-Time Password</p>
                <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#0f766e;">${otp}</div>
              </div>
              <p style="margin:0 0 8px;color:#64748b;font-size:14px;">⏰ This OTP expires in <strong>10 minutes</strong>.</p>
              <p style="margin:0;color:#64748b;font-size:14px;">🔒 Never share this OTP with anyone.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 48px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                If you didn't request this, ignore this email.<br/>
                &copy; ${new Date().getFullYear()} TrackFin
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await sendEmail(
    to,
    subject,
    `Your TrackFin verification code is ${otp}. It expires in 10 minutes. Do not share this code.`,
    html
  );
}

module.exports = { sendEmail, sendOtpEmail };