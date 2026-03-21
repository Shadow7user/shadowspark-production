import { Prisma } from "@prisma/client";
import { env } from "@/lib/env";
import { mergeLeadMetadata } from "@/lib/leads/metadata";
import { isMetaMarketingConfigured, sendMarketingMessage } from "@/lib/meta";
import { logger } from "@/lib/observability";
import { prisma } from "@/lib/prisma";
import {
  assertSensitiveActionAllowed,
  securePrecheck,
  type SensitiveActionRequest,
} from "@/lib/security";
import { sendWhatsApp as sendTwilioWhatsApp } from "@/lib/twilio";

type DirectTransport = "meta" | "twilio";

type DirectSendInput = {
  body: string;
  to: string;
};

export type DirectSendResult = {
  id: string;
  persistedToLead: boolean;
  provider: DirectTransport;
  status: string | null;
  to: string;
};

function normaliseMetaRecipient(value: string): string {
  return value.replace(/\D+/g, "");
}

export function isMetaConfigured(): boolean {
  return isMetaMarketingConfigured();
}

async function sendViaMeta(input: DirectSendInput): Promise<DirectSendResult> {
  if (!env.whatsappPhoneNumberId.trim() || !env.metaAccessToken.trim()) {
    throw new Error("Meta WhatsApp API is not configured.");
  }
  const delivery = await sendMarketingMessage(input);

  return {
    id: delivery.id,
    persistedToLead: false,
    provider: "meta",
    status: delivery.status,
    to: normaliseMetaRecipient(input.to),
  };
}

async function sendViaFallback(input: DirectSendInput): Promise<DirectSendResult> {
  const delivery = await sendTwilioWhatsApp({
    body: input.body,
    to: input.to,
  });

  return {
    id: delivery.sid,
    persistedToLead: false,
    provider: "twilio",
    status: delivery.status,
    to: delivery.to,
  };
}

export async function executeDirectSend(
  leadId: string,
  message: string,
  approvalContext: SensitiveActionRequest,
): Promise<DirectSendResult> {
  const precheck = securePrecheck(message, { profile: "follow_up_writer" });
  if (precheck.decision !== "allow") {
    logger.warn("whatsapp.direct_send_blocked_by_security", {
      decision: precheck.decision,
      categories: precheck.categories,
      leadId,
      reasons: precheck.reasons,
    });
    throw new Error("Message blocked by AI security policy before delivery.");
  }

  assertSensitiveActionAllowed({
    ...approvalContext,
    action: "send_whatsapp",
  });

  let lead: {
    id: string;
    metadata: Prisma.JsonValue | null;
    phone: string | null;
  } | null = null;

  try {
    lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        metadata: true,
        phone: true,
      },
    });
  } catch (error) {
    logger.error("whatsapp.load_lead_failed", {
      error: error instanceof Error ? error.message : "unknown",
      leadId,
    });
    throw new Error("Unable to load the lead for direct send.");
  }

  if (!lead?.phone) {
    throw new Error("Lead is missing a WhatsApp-ready phone number.");
  }

  let delivery: DirectSendResult;

  try {
    delivery = isMetaConfigured()
      ? await sendViaMeta({ body: message, to: lead.phone })
      : await sendViaFallback({ body: message, to: lead.phone });
  } catch (error) {
    logger.error("whatsapp.direct_send_failed", {
      error: error instanceof Error ? error.message : "unknown",
      leadId,
    });
    throw new Error("Unable to deliver the message through Meta or Twilio.");
  }

  try {
    assertSensitiveActionAllowed({
      ...approvalContext,
      action: "modify_record",
    });
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        metadata: mergeLeadMetadata(lead.metadata, {
          deliveryId: delivery.id,
          deliveryProvider: delivery.provider,
          deliveryStatus: delivery.status,
          marketingMessageId:
            delivery.provider === "meta" ? delivery.id : undefined,
          marketingMessageStatus:
            delivery.provider === "meta" ? delivery.status : undefined,
          metaMessageId: delivery.provider === "meta" ? delivery.id : undefined,
          metaMessageStatus:
            delivery.provider === "meta" ? delivery.status : undefined,
          metaSentAt:
            delivery.provider === "meta" ? new Date().toISOString() : undefined,
          twilioMessageSid:
            delivery.provider === "twilio" ? delivery.id : undefined,
          twilioMessageStatus:
            delivery.provider === "twilio" ? delivery.status : undefined,
          twilioSentAt:
            delivery.provider === "twilio"
              ? new Date().toISOString()
              : undefined,
        }),
      },
    });
  } catch (error) {
    logger.error("whatsapp.persist_delivery_failed", {
      error: error instanceof Error ? error.message : "unknown",
      leadId,
      provider: delivery.provider,
    });

    return delivery;
  }

  return {
    ...delivery,
    persistedToLead: true,
  };
}
