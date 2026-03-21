import { Prisma } from "@prisma/client";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";
import { mergeLeadMetadata } from "@/lib/leads/metadata";
import { logger } from "@/lib/observability";

type TwilioClient = ReturnType<typeof twilio>;

type SendLeadAlertInput = {
  leadId: string;
  message: string;
};

type SendWhatsAppInput = {
  body: string;
  to: string;
};

export type SendLeadAlertResult = {
  leadId: string;
  persistedToLead: boolean;
  sid: string;
  status: string | null;
  to: string;
};

export type SendWhatsAppResult = {
  sid: string;
  status: string | null;
  to: string;
};

const globalForTwilio = globalThis as {
  twilioClient?: TwilioClient;
};

function normalizePhoneToE164(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D+/g, "");

  if (!digits) {
    throw new Error("Lead phone number is invalid.");
  }

  if (trimmed.startsWith("+")) {
    return `+${digits}`;
  }

  if (digits.startsWith("234")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  return `+${digits}`;
}

function resolveTwilioNumber(): string {
  return (
    process.env.TWILIO_NUMBER?.trim() ||
    process.env.TWILIO_WHATSAPP_FROM?.trim() ||
    ""
  );
}

function resolveTwilioWhatsAppFrom(): string {
  const rawValue = resolveTwilioNumber();

  if (!rawValue) {
    throw new Error("Twilio WhatsApp sender number is not configured.");
  }

  if (rawValue.startsWith("whatsapp:")) {
    return rawValue;
  }

  return `whatsapp:${normalizePhoneToE164(rawValue)}`;
}

function getTwilioClient(): TwilioClient {
  if (globalForTwilio.twilioClient) {
    return globalForTwilio.twilioClient;
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured.");
  }

  const client = twilio(accountSid, authToken);
  globalForTwilio.twilioClient = client;
  return client;
}

export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      resolveTwilioNumber(),
  );
}

export function normaliseTwilioBody(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1_600);
}

export async function sendWhatsApp(
  input: SendWhatsAppInput,
): Promise<SendWhatsAppResult> {
  const destination = input.to.startsWith("whatsapp:")
    ? input.to
    : `whatsapp:${normalizePhoneToE164(input.to)}`;

  try {
    const message = await getTwilioClient().messages.create({
      body: normaliseTwilioBody(input.body),
      from: resolveTwilioWhatsAppFrom(),
      to: destination,
    });

    return {
      sid: message.sid,
      status: message.status ?? null,
      to: destination,
    };
  } catch (error) {
    logger.error("twilio.send_whatsapp_failed", {
      error: error instanceof Error ? error.message : "unknown",
      to: destination,
    });
    throw new Error("Unable to send the WhatsApp alert right now.");
  }
}

export async function sendLeadAlert(
  input: SendLeadAlertInput,
): Promise<SendLeadAlertResult> {
  let lead: {
    id: string;
    metadata: Prisma.JsonValue | null;
    phone: string | null;
  } | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id: input.leadId },
      select: {
        id: true,
        metadata: true,
        phone: true,
      },
    });
  } catch (error) {
    logger.error("twilio.load_lead_failed", {
      error: error instanceof Error ? error.message : "unknown",
      leadId: input.leadId,
    });
    throw new Error("Unable to load the lead before dispatch.");
  }

  if (!lead?.phone) {
    throw new Error("Lead is missing a WhatsApp-ready phone number.");
  }

  const delivery = await sendWhatsApp({
    body: input.message,
    to: lead.phone,
  });

  try {
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        metadata: mergeLeadMetadata(lead.metadata, {
          twilioMessageSid: delivery.sid,
          twilioMessageStatus: delivery.status,
          twilioSentAt: new Date().toISOString(),
        }),
      },
    });
  } catch (error) {
    logger.error("twilio.persist_delivery_failed", {
      error: error instanceof Error ? error.message : "unknown",
      leadId: lead.id,
      twilioMessageSid: delivery.sid,
    });

    return {
      leadId: lead.id,
      persistedToLead: false,
      sid: delivery.sid,
      status: delivery.status,
      to: delivery.to,
    };
  }

  return {
    leadId: lead.id,
    persistedToLead: true,
    sid: delivery.sid,
    status: delivery.status,
    to: delivery.to,
  };
}
