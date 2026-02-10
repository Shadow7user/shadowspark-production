/**
 * WhatsApp Webhook Handler
 * Receives and processes incoming WhatsApp messages from Meta
 */

import { whatsappService } from "@/lib/services/whatsapp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🔔 WhatsApp webhook GET request received");

  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log(`  Mode: ${mode}, Token present: ${!!token}`);

  const result = whatsappService.verifyWebhook(
    mode || "",
    token || "",
    challenge || "",
  );

  if (result) {
    return new NextResponse(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📨 WhatsApp webhook POST received");
    console.log("📊 Full webhook payload:", JSON.stringify(body, null, 2));

    // Check if this is a proper WhatsApp message
    if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
      console.log("⚠️ No messages in webhook payload");
      return NextResponse.json({ status: "ok" });
    }

    const messages = body.entry[0].changes[0].value.messages;

    for (const message of messages) {
      const messageId = message.id;
      const from = message.from;
      const messageBody = message.text?.body;

      if (!messageBody) {
        console.log(`⚠️ Message ${messageId} has no text body`);
        continue;
      }

      console.log(`📱 Processing message ${messageId} from ${from}`);

      // Process message and generate response
      const botResponse = await whatsappService.processIncomingMessage(
        from,
        messageBody,
        messageId,
      );

      // Send response back to user
      const sent = await whatsappService.sendTextMessage(from, botResponse);

      if (sent) {
        console.log(`✅ Response sent to ${from}`);
      } else {
        console.error(`❌ Failed to send response to ${from}`);
      }
    }

    return NextResponse.json({ status: "processed" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
