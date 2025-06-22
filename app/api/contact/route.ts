import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Pastikan variabel environment ada
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !recipientEmail) {
      console.error("Missing SMTP environment variables");
      return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }

    // Buat transporter untuk mengirim email
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: true, // true untuk port 465, false untuk port lain
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Opsi email
    const mailOptions = {
      from: `"${name}" <${smtpUser}>`, // Nama pengirim akan muncul, tapi emailnya adalah email Anda
      to: recipientEmail, // Email tujuan (email Anda)
      replyTo: email, // Alamat email untuk membalas
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <h2>Message:</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed to send message.' }, { status: 500 });
  }
} 