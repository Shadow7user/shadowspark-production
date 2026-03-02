import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { formDataToStringRecord, getClientIp } from "@/lib/http/request";
import { verifyTwilioSignature } from "@/lib/twilio/verify";
import { getTwilioClient } from "@/lib/twilio/client";
import { checkRateLimit, hashPhone, logger } from "@/lib/observability";

const TwilioWebhookSchema = z.object({
  Body: z.string().min(1).max(1600),
  From: z.string().startsWith("whatsapp:+"),
  To: z.string().startsWith("whatsapp:+"),
  MessageSid: z.string().startsWith("SM"),
  ProfileName: z.string().optional(),
  NumMedia: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(request);

  const rateCheck = await checkRateLimit(`ip:${clientIp}`);
  if (!rateCheck.allowed) {
    logger.warn("Rate limit exceeded on webhook", {
      ip: clientIp,
      remaining: rateCheck.remaining,
    });
    return NextResponse.json(
      { error: "Too Many Requests", retryAfter: 60 },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      },
    );
  }

  const formData = await request.formData();
  const params = formDataToStringRecord(formData);
  const signature = request.headers.get("x-twilio-signature") ?? "";
  const requestUrl = `${request.nextUrl.origin}${request.nextUrl.pathname}`;
  const configuredUrl = `${env.nextPublicBaseUrl}/api/webhook`;

  let verification = verifyTwilioSignature(requestUrl, params, signature);
  if (!verification.valid && configuredUrl !== requestUrl) {
    verification = verifyTwilioSignature(configuredUrl, params, signature);
  }

  if (!verification.valid) {
    logger.warn("Twilio signature verification failed", {
      reason: verification.reason,
      request_url: requestUrl,
      configured_url: configuredUrl,
      ip: clientIp,
    });
    return NextResponse.json(
      { error: "Forbidden", message: "Invalid request signature" },
      { status: 403 },
    );
  }

  const parsed = TwilioWebhookSchema.safeParse(params);
  if (!parsed.success) {
    logger.warn("Invalid webhook payload structure", {
      issues: parsed.error.issues,
      ip: clientIp,
    });
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid payload" },
      { status: 400 },
    );
  }

  const { Body, From, To, MessageSid } = parsed.data;
  logger.info("Twilio webhook accepted", {
    ip: clientIp,
    from_hash: hashPhone(From),
    to: To,
    message_sid: MessageSid,
    body_length: Body.length,
  });

  // ── Send outbound reply via Twilio Messages API ──────────────────────────
  const twilioClient = getTwilioClient();
  const fromNumber = env.twilioWhatsappNumber
    ? `whatsapp:${env.twilioWhatsappNumber}`
    : To; // fall back to the number that received the message

  if (twilioClient) {
    try {
      await twilioClient.messages.create({
        body: "Thank you for your message. Our team will get back to you shortly.",
        from: fromNumber,
        to: From,
      });
    } catch (err) {
      logger.warn("Twilio outbound reply failed", {
        from_hash: hashPhone(From),
        error: err instanceof Error ? err.message : String(err),
      });
      // Non-critical — still return 200 to Twilio so it doesn't retry
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
