import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend is initialized lazily to avoid build-time errors when API key is not set
let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

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

    // Log contact form submission
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

    // Send notification to your email (only if RESEND_API_KEY is configured)
    const resendClient = getResend();
    if (resendClient) {
      await resendClient.emails.send({
        from: "leads@shadowspark-tech.org",
        to: "architect@shadowspark-technologies.com",
        subject: `New Lead: ${name} - ${service}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Budget:</strong> ${budget || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      // Send confirmation to lead
      await resendClient.emails.send({
        from: "architect@shadowspark-technologies.com",
        to: email,
        subject: "Thanks for reaching out to ShadowSpark Technologies",
        html: `
          <h2>Hi ${name},</h2>
          <p>Thanks for your interest in our ${service} services.</p>
          <p>We've received your inquiry and will respond within 24 hours.</p>
          <p>In the meantime, feel free to book a free audit call: <a href="https://calendly.com/morontomornica7/audit">Book Now</a></p>
          <br>
          <p>Best regards,<br>ShadowSpark Technologies Team</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    Sentry.captureException(error, {
      extra: { context: "contact_form_submission" },
    });
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
