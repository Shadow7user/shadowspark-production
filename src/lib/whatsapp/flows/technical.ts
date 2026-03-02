import OpenAI from "openai";
import { env } from "@/lib/env";
import { sendSms } from "@/lib/twilio/client";

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

type HistoryMessage = { role: "user" | "assistant"; content: string };

async function handleEmergency(from: string, description: string) {
  const alert = `🚨 EMERGENCY from ${from}: ${description}. Respond now.`;
  await Promise.all([
    sendSms(env.ownerPhone, alert),
    sendSms(env.emmanuelPhone, alert),
  ]);
}

export const persona =
  "You are Kelechi, ShadowSpark technical specialist under Stephen (The Architect). Developer-friendly, precise. Ask for error logs/stack. Emergency: alert Architect +2349045770572 + Emmanuel.";

export const welcomeMessage =
  "Hey! I'm Kelechi, ShadowSpark Tech 🔧 Reply: 1️⃣ API/webhook 2️⃣ Integration issue 3️⃣ Feature request 4️⃣ 🚨 EMERGENCY";

export const assignedTo = "architect";

export async function handleMessage(input: {
  message: string;
  from: string;
  history?: HistoryMessage[];
}) {
  const { message, from, history = [] } = input;
  const lower = message.toLowerCase();

  const isEmergency = lower.includes("emergency") || lower.includes("🚨");

  if (isEmergency) {
    await handleEmergency(from, message || "Emergency reported");
    return `Alerting Stephen (Architect) and Emmanuel now. They can also be reached at ${env.ownerPhone} and ${env.emmanuelPhone}.`;
  }

  if (lower.includes("human") || lower.includes("architect") || lower === "4") {
    return `I'll connect you with Stephen (Architect) or Emmanuel for hands-on help. WhatsApp: ${env.ownerPhone} or ${env.emmanuelPhone}.`;
  }

  if (lower === "1" || lower.includes("api") || lower.includes("webhook")) {
    return "API help: share endpoint, payload, and full error logs/stack trace. I’ll triage and loop in the architects.";
  }

  if (lower === "2" || lower.includes("integration")) {
    return "Integration issue noted. Which platform and error are you seeing? Share logs so we can reproduce quickly.";
  }

  if (lower === "3" || lower.includes("feature")) {
    return "Got a feature request! Briefly describe it and impact. I’ll review with Stephen.";
  }

  if (openai && message.trim()) {
    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: persona },
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
      max_output_tokens: 280,
    });

    const content = completion.output_text?.trim();

    if (content) {
      return content;
    }
  }

  return "Please share the API endpoint, request payload, and exact error so I can assist. If this is critical, reply 'EMERGENCY' to alert Stephen + Emmanuel.";
}
