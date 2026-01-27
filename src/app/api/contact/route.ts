import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Log contact form submission (email integration later)
    console.log("=== New Contact Form Submission ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    console.log("Timestamp:", new Date().toISOString());
    console.log("===================================");

    // TODO: Add email integration (e.g., Resend, SendGrid, Nodemailer)
    // await sendEmail({
    //   to: "info@shadowspark.tech",
    //   subject: `Contact Form: ${name}`,
    //   body: message,
    //   replyTo: email,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
