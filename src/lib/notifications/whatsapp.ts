import { z } from "zod";
import { prisma } from "@/lib/prisma";

const leadIdSchema = z.string().cuid();

const generatedConfigSchema = z.object({
  assessment: z.string().trim().min(1).optional(),
  spark: z.string().trim().min(1).optional(),
  proposed_solution: z.string().trim().min(1).optional(),
});

export type StrategyNotificationPayload = {
  leadId: string;
  sessionId: string;
  phone: string;
  recipientName: string;
  organizationName: string;
  message: string;
  url: string;
};

function normalizePhoneToDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

function buildWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function resolveAppUrl(): string {
  const rawValue =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://shadowspark-tech.org";

  try {
    return new URL(rawValue).toString().replace(/\/$/, "");
  } catch {
    return "https://shadowspark-tech.org";
  }
}

function extractAssessment(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "A premium execution path is ready for your review.";
  }

  if (parsed.data.assessment) {
    return parsed.data.assessment;
  }

  if (parsed.data.proposed_solution) {
    const match = parsed.data.proposed_solution.match(
      /(?:^|\n)###\s+Strategic Assessment\s*\n([\s\S]*?)(?=\n###\s+|$)/i,
    );

    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }

  return "A premium execution path is ready for your review.";
}

function extractSpark(generatedConfig: unknown): string {
  const parsed = generatedConfigSchema.safeParse(generatedConfig);

  if (!parsed.success) {
    return "The immediate priority is disciplined follow-through.";
  }

  return parsed.data.spark || "The immediate priority is disciplined follow-through.";
}

function truncateSentence(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function sendStrategyNotification(
  leadId: string,
  customMessage?: string,
): Promise<StrategyNotificationPayload> {
  const id = leadIdSchema.parse(leadId);

  let lead: {
    businessId: string | null;
    id: string;
    name: string | null;
    phone: string | null;
  } | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        businessId: true,
      },
    });
  } catch {
    throw new Error("Unable to load the lead right now.");
  }

  if (!lead?.phone || !lead.businessId) {
    throw new Error("Lead is missing a phone number or linked strategy.");
  }

  let session: {
    generatedConfig: unknown;
    id: string;
    organizationName: string;
  } | null = null;

  try {
    session = await prisma.demoSession.findUnique({
      where: { id: lead.businessId },
      select: {
        id: true,
        organizationName: true,
        generatedConfig: true,
      },
    });
  } catch {
    throw new Error("Unable to load the linked strategy session.");
  }

  if (!session) {
    throw new Error("Linked strategy session was not found.");
  }

  const recipientName = lead.name?.trim() || "there";
  const landingUrl = new URL(`/land/${session.id}`, resolveAppUrl()).toString();
  const assessment = truncateSentence(extractAssessment(session.generatedConfig), 180);
  const spark = truncateSentence(extractSpark(session.generatedConfig), 140);
  const message = customMessage?.trim()
    ? customMessage.trim()
    : [
        `Hello ${recipientName},`,
        `I’ve prepared a strategic reveal for ${session.organizationName}.`,
        assessment,
        `Execution directive: ${spark}`,
        `Review it here: ${landingUrl}`,
        `Strategy ID: ${session.id}`,
      ].join("\n\n");

  const digits = normalizePhoneToDigits(lead.phone);

  if (!digits) {
    throw new Error("Lead phone number is invalid.");
  }

  return {
    leadId: lead.id,
    sessionId: session.id,
    phone: digits,
    recipientName,
    organizationName: session.organizationName,
    message,
    url: buildWhatsAppUrl(digits, message),
  };
}
