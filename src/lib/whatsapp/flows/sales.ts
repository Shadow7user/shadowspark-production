import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendSms } from "@/lib/twilio/client";

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

type HistoryMessage = { role: "user" | "assistant"; content: string };

function needsHuman(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("human") ||
    lower.includes("agent") ||
    lower.includes("someone") ||
    lower.includes("reginald") ||
    lower.includes("sales") ||
    lower === "3" ||
    lower.includes("talk")
  );
}

async function captureLead(
  from: string,
  details: Partial<{ name: string; businessType: string; challenge: string }>,
) {
  const name = details.name ?? "Prospect";
  const businessType = details.businessType ?? "Unknown";
  const challenge = details.challenge ?? "Not specified";

  await prisma.lead.upsert({
    where: { phone: from },
    update: {
      name: details.name ?? null,
      businessType: details.businessType ?? null,
      challenge: details.challenge ?? null,
      assignedTo: "reginald",
      channel: "sales",
    },
    create: {
      name,
      phone: from,
      businessType: businessType ?? null,
      challenge: challenge ?? null,
      assignedTo: "reginald",
      channel: "sales",
    },
  });

  await sendSms(
    env.reginaldPhone,
    `🔔 New Lead: ${name} (${businessType}), Challenge: ${challenge}. Phone: ${from}. Follow up!`,
  );
}

export const persona =
  "You are Chisom, ShadowSpark's friendly sales assistant working directly with Reginald (Sales Lead). Based in Port Harcourt, Nigeria. Speak professional English with natural Nigerian warmth. Guide conversations toward booking a free demo. Never quote pricing before qualifying needs. Replies under 280 chars for WhatsApp. If human needed: direct to Reginald +2348107677660";

export const welcomeMessage =
  "Hello! I'm Chisom from ShadowSpark 👋 We automate WhatsApp for businesses 24/7. Reply with: 1️⃣ What we do 2️⃣ Book FREE demo 3️⃣ Talk to Reginald";

export const assignedTo = "reginald";

export async function handleMessage(input: {
  message: string;
  from: string;
  history?: HistoryMessage[];
}) {
  const { message, from, history = [] } = input;
  const lower = message.toLowerCase();

  if (needsHuman(lower)) {
    return `Connecting you to Reginald (Sales Lead) at ${env.reginaldPhone}. You can also call/WhatsApp directly.`;
  }

  if (lower === "1") {
    return "We build WhatsApp + web AI assistants to automate sales, support and lead capture for Nigerian businesses. Want a free demo?";
  }

  if (lower === "2" || lower.includes("demo")) {
    await captureLead(from, { challenge: "Requested demo" });
    return "Great! I'll book a free demo. Please share your name and business type so Reginald can prepare.";
  }

  if (openai && message.trim()) {
    const completion = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: persona },
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
      max_output_tokens: 300,
    });

    const content = completion.output_text?.trim();

    if (content) {
      if (content.toLowerCase().includes("book")) {
        await captureLead(from, { challenge: "Booking request" });
      }
      return content;
    }
  }

  return "Thanks for reaching out! Can I get your name, business type, and challenge so Reginald can help with a free demo?";
}

export const flow = {
  persona,
  welcomeMessage,
  assignedTo,
  handleMessage,
};
