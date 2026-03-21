import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, text, html, secret } = await request.json();

    // Verify Shared Secret (Security layer between backend and frontend)
    if (!process.env.EMAIL_API_SECRET) {
      return NextResponse.json({ message: "Vercel missing EMAIL_API_SECRET in dashboard" }, { status: 500 });
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ message: "Vercel missing EMAIL_USER or EMAIL_PASS in dashboard" }, { status: 500 });
    }
    if (secret !== process.env.EMAIL_API_SECRET) {
      console.error("Vercel Security Failure: Key Mismatch.");
      return NextResponse.json({ message: "Unauthorized: Key Mismatch" }, { status: 401 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FinTrack 💰" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    return NextResponse.json({ message: "Email sent via Vercel Edge API successfully" });
  } catch (error) {
    console.error("❌ Vercel Backend Email Gateway Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
