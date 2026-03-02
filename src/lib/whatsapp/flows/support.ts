import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { hashPhone } from "@/lib/observability";
import { sendSms } from "@/lib/twilio/client";

const openai = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

type HistoryMessage = { role: "user" | "assistant"; content: string };

function detectUrgency(message: string): "low" | "medium" | "high" {
  const lower = message.toLowerCase();
  if (lower.includes("urgent") || lower.includes("asap") || lower.includes("emergency")) {
    return "high";
  }
  if (lower.includes("low")) return "low";
  return "medium";
}

function needsHuman(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes("human") || lower.includes("someone") || lower === "4" || lower.includes("emmanuel");
}

async function createTicket(from: string, issue: string, message: string) {
  const urgency = detectUrgency(message);
  const userHash = hashPhone(from);

  const ticket = await prisma.supportTicket.create({
    data: {
      userHash,
      issue,
      urgency,
      channel: "support",
      assignedTo: "emmanuel",
      status: "OPEN",
    },
  });

  if (urgency === "high") {
    await sendSms(
      env.emmanuelPhone,
      `🚨 Urgent: ${issue} from ${from}`,
    );
  }

  return ticket;
}

export const persona =
  "You are Emeka, ShadowSpark support specialist under Emmanuel (Support Architect). Calm, precise. Acknowledge issue first. Escalate urgent to Emmanuel +2349040014125. Replies <280 chars.";

export const welcomeMessage =
  "Hi! I'm Emeka from ShadowSpark Support 🛠️ Reply: 1️⃣ Project update 2️⃣ Report issue 3️⃣ Billing 4️⃣ Speak to Emmanuel";

export const assignedTo = "emmanuel";

export async function handleMessage(input: {
  message: string;
  from: string;
  history?: HistoryMessage[];
}) {
  const { message, from, history = [] } = input;
  const lower = message.toLowerCase();

  if (needsHuman(lower)) {
    return `I'll loop in Emmanuel. You can also reach him directly on WhatsApp at ${env.emmanuelPhone}.`;
  }

  if (lower === "1") {
    return "Thanks! Share your project name and what you'd like to check on. I'll update Emmanuel.";
  }

  if (lower === "2" || lower.includes("issue") || lower.includes("bug")) {
    const issue = message.trim() || "Issue reported";
    await createTicket(from, issue, message);
    return "Thanks for reporting. Can you share steps to reproduce and any screenshots or error logs?";
  }

  if (lower === "3" || lower.includes("billing")) {
    return "Billing help is on it. Please share invoice or plan details and I'll route to Emmanuel.";
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

  return "Got it. Please describe the issue, urgency (low/medium/high), and any error logs. I’ll create a ticket and notify Emmanuel.";
}

export const flow = {
  persona,
  welcomeMessage,
  assignedTo,
  handleMessage,
};
