import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse, type MessageHistory } from "@/lib/ai";
import { env } from "@/lib/env";
import { checkRateLimit, hashPhone } from "@/lib/observability";

const SYSTEM_PROMPT =
  "You are the ShadowSpark website assistant. Provide concise, friendly answers, and guide users to WhatsApp when appropriate.";
const ESCALATION_NUMBER = env.whatsappEscalationNumber || "+2349037621612";
const ESCALATION_URL = `https://wa.me/${ESCALATION_NUMBER.replace(/\D/g, "")}`;

export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: { message?: string; history?: MessageHistory };
  try {
    payload = (await req.json()) as { message?: string; history?: MessageHistory };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const message = payload.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const history = Array.isArray(payload.history) ? payload.history : [];

  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userHash = hashPhone(ip);
  const rateLimit = await checkRateLimit(`chat:${userHash}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please wait before sending again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.resetInMs / 1000)),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  const response = await generateAIResponse(SYSTEM_PROMPT, message, history);
  const conversationHistory: MessageHistory = [
    ...history,
    { role: "user", content: message },
    { role: "assistant", content: response },
  ];

  const userMessages = conversationHistory.filter((h) => h.role === "user").length;
  const whatsappCta =
    userMessages >= 3
      ? `\n\nPrefer WhatsApp? Message us at ${ESCALATION_URL} for faster replies.`
      : "";

  return NextResponse.json({
    response: `${response}${whatsappCta}`,
    history: conversationHistory,
  });
}
