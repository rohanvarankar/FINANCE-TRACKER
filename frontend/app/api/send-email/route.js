import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, subject, text, html, secret, user, pass } = await request.json();

    // Verify Shared Secret (Security layer between backend and frontend)
    if (!process.env.EMAIL_API_SECRET) {
      return NextResponse.json({ message: "Vercel dashboard missing EMAIL_API_SECRET variable" }, { status: 500 });
    }
    
    if (secret !== process.env.EMAIL_API_SECRET) {
      return NextResponse.json({ message: "Unauthorized: Vercel secret mismatch" }, { status: 401 });
    }

    if (!user || !pass) {
      return NextResponse.json({ message: "Vercel received empty credentials from Backend" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user,
        pass: pass,
      },
    });

    await transporter.sendMail({
      from: `"TrackFin 💰" <${user}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    return NextResponse.json({ message: "Email relay successful" });
  } catch (error) {
    console.error("❌ Vercel Backend Email Gateway Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
