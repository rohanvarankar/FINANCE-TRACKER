require("dotenv").config();
const sendEmail = require("./src/utils/sendEmail");

async function test() {
    console.log("Attempting to send test email...");
    console.log("Using EMAIL_USER:", process.env.EMAIL_USER);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
        return;
    }

    try {
        await sendEmail(process.env.EMAIL_USER, "Test Email", "This is a test email sent from the script.");
        console.log("Email sent successfully to", process.env.EMAIL_USER);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
}

test();
