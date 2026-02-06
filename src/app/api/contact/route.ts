import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, budget, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    // Log contact form submission (email integration later)
    console.log("=== New Contact Form Submission ===");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone || "Not provided");
    console.log("Company:", company || "Not provided");
    console.log("Service:", service || "Not specified");
    console.log("Budget:", budget || "Not specified");
    console.log("Message:", message);
    console.log("Timestamp:", new Date().toISOString());
    console.log("===================================");

    // TODO: Add email integration (e.g., Resend, SendGrid, Nodemailer)
    // await sendEmail({
    //   to: "architect@shadowspark-technologies.com",
    //   subject: `[${service}] Contact Form: ${name} - ${company}`,
    //   body: message,
    //   replyTo: email,
    // });

    // TODO: Save to database for CRM tracking
    // await prisma.contactSubmission.create({ data: { ... } })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
