/**
 * WhatsApp Webhook Handler for ClawBot
 * Handles incoming WhatsApp messages from Meta Business API
 */

import { prisma } from "@/lib/prisma";
import { ClaudeService } from "@/lib/services/claude";
import { WhatsAppService } from "@/lib/services/whatsapp";
import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;

/**
 * GET /api/whatsapp/webhook
 * Webhook verification endpoint for Meta
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("🔍 WhatsApp webhook verification:", { mode, token });

  // Verify webhook subscription
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ WhatsApp webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("❌ WhatsApp webhook verification failed!");
  return new NextResponse("Verification failed", { status: 403 });
}

/**
 * POST /api/whatsapp/webhook
 * Handles incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📱 WhatsApp webhook received:", JSON.stringify(body, null, 2));

    // Extract message data
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    // Handle message status updates
    const status = value?.statuses?.[0];
    if (status) {
      console.log("📊 Message status:", status.id, status.status);
      // Update message status in database if needed
      return NextResponse.json({ status: "status_received" });
    }

    // Handle incoming messages
    if (messages && messages.length > 0) {
      const message = messages[0];
      const from = message.from; // User's WhatsApp number
      const messageId = message.id;
      const messageType = message.type;

      // Ignore non-text messages for now
      if (messageType !== "text") {
        console.log("⏭️ Ignoring non-text message type:", messageType);
        return NextResponse.json({ status: "ignored_non_text" });
      }

      const userMessage = message.text?.body;

      if (!userMessage) {
        console.error("❌ No message body found");
        return NextResponse.json({ error: "No message body" }, { status: 400 });
      }

      console.log(`💬 Message from ${from}: ${userMessage}`);

      // Log incoming message
      await prisma.whatsappMessage.create({
        data: {
          messageId,
          from,
          message: userMessage,
          type: "incoming",
          status: "received",
        },
      });

      // Process message with ClawBot (Claude AI)
      const claudeService = new ClaudeService();
      const botResponse = await claudeService.generateResponse(
        userMessage,
        from,
      );

      // Send response via WhatsApp
      const whatsappService = new WhatsAppService();
      await whatsappService.sendMessage(from, botResponse);

      // Log outgoing message
      await prisma.whatsappMessage.create({
        data: {
          messageId: `out_${messageId}`,
          from,
          message: botResponse,
          type: "outgoing",
          status: "sent",
        },
      });

      console.log(`✅ Response sent to ${from}`);
      return NextResponse.json({ status: "message_processed" });
    }

    return NextResponse.json({ status: "no_messages" });
  } catch (error) {
    console.error("❌ WhatsApp webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
