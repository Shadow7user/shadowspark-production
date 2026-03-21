import { env } from "@/lib/env";
import { logger } from "@/lib/observability";
import { normaliseTwilioBody } from "@/lib/twilio";

const META_GRAPH_VERSION = "v25.0";

const MARKETING_MESSAGES_READY_STATUSES = new Set([
  "ACTIVE",
  "COMPLETED",
  "ENABLED",
  "LIVE",
  "ONBOARDED",
  "READY",
]);

type GraphErrorPayload = {
  error?: {
    code?: number;
    message?: string;
  };
};

type MarketingMessagesStatusPayload = GraphErrorPayload & {
  marketing_messages_lite_api_status?: { status?: string } | string | null;
  marketing_messages_onboarding_status?: { status?: string } | string | null;
};

type MetaSendPayload = GraphErrorPayload & {
  messages?: Array<{
    id?: string;
    message_status?: string;
  }>;
};

export type MarketingMessagesOnboardingSummary = {
  checked: boolean;
  enabled: boolean;
  status: string | null;
};

export type SendMarketingMessageInput = {
  body: string;
  to: string;
};

export type SendMarketingMessageResult = {
  id: string;
  status: string | null;
  to: string;
};

function getAccessToken(): string {
  return env.metaAccessToken.trim();
}

function getMarketingAccessToken(): string {
  return env.metaMarketingAccessToken.trim();
}

function getPhoneNumberId(): string {
  return env.whatsappPhoneNumberId.trim();
}

function getMarketingTemplateName(): string {
  return env.metaMarketingTemplateName.trim();
}

function getMarketingTemplateLanguageCode(): string {
  return env.metaMarketingTemplateLanguageCode.trim() || "en_US";
}

function normaliseRecipient(value: string): string {
  return value.replace(/\D+/g, "");
}

function normaliseGraphStatus(
  value: { status?: string } | string | null | undefined,
): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (value && typeof value.status === "string") {
    const trimmed = value.status.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
}

function isReadyStatus(status: string | null): boolean {
  return Boolean(status && MARKETING_MESSAGES_READY_STATUSES.has(status.toUpperCase()));
}

async function metaGraphFetch<TPayload>(
  path: string,
  init?: RequestInit,
  accessTokenOverride?: string,
): Promise<TPayload> {
  const accessToken = (accessTokenOverride ?? getAccessToken()).trim();

  if (!accessToken) {
    throw new Error("Meta access token is not configured.");
  }

  const response = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as TPayload & GraphErrorPayload;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        `Meta Graph request failed with status ${response.status}.`,
    );
  }

  return payload;
}

async function sendCloudApiMessage(
  input: SendMarketingMessageInput,
): Promise<SendMarketingMessageResult> {
  const phoneNumberId = getPhoneNumberId();

  if (!phoneNumberId) {
    throw new Error("Meta WhatsApp phone number ID is not configured.");
  }

  const payload = await metaGraphFetch<MetaSendPayload>(`${phoneNumberId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: normaliseRecipient(input.to),
      type: "text",
      text: {
        body: normaliseTwilioBody(input.body),
        preview_url: false,
      },
    }),
  });

  const message = payload.messages?.[0];

  if (!message?.id) {
    throw new Error("Meta Cloud API did not return a message id.");
  }

  return {
    id: message.id,
    status: message.message_status ?? "accepted",
    to: normaliseRecipient(input.to),
  };
}

export function isMetaMarketingConfigured(): boolean {
  return Boolean(getAccessToken() && getPhoneNumberId());
}

export async function getMarketingMessagesOnboardingStatus(): Promise<MarketingMessagesOnboardingSummary> {
  const lookupId = getPhoneNumberId() || env.fbBusinessId.trim();

  if (!lookupId || !getAccessToken()) {
    return {
      checked: false,
      enabled: false,
      status: "unconfigured",
    };
  }

  try {
    const payload = await metaGraphFetch<MarketingMessagesStatusPayload>(
      `${lookupId}?fields=marketing_messages_onboarding_status,marketing_messages_lite_api_status`,
      {
        method: "GET",
      },
    );

    const status =
      normaliseGraphStatus(payload.marketing_messages_onboarding_status) ??
      normaliseGraphStatus(payload.marketing_messages_lite_api_status);

    return {
      checked: true,
      enabled: isReadyStatus(status),
      status,
    };
  } catch (error) {
    logger.error("meta.marketing_messages_status_failed", {
      error: error instanceof Error ? error.message : "unknown",
      lookupId,
    });

    return {
      checked: false,
      enabled: false,
      status: "unavailable",
    };
  }
}

export async function sendMarketingMessage(
  input: SendMarketingMessageInput,
): Promise<SendMarketingMessageResult> {
  const phoneNumberId = getPhoneNumberId();
  const templateName = getMarketingTemplateName();
  const templateLanguageCode = getMarketingTemplateLanguageCode();

  if (!phoneNumberId || !getAccessToken()) {
    throw new Error("Meta marketing messages are not configured.");
  }

  if (!templateName) {
    logger.warn("meta.marketing_message_template_missing", {
      to: normaliseRecipient(input.to),
    });
    return sendCloudApiMessage(input);
  }

  try {
    const payload = await metaGraphFetch<MetaSendPayload>(
      `${phoneNumberId}/marketing_messages`,
      {
        method: "POST",
        body: JSON.stringify({
          message_activity_sharing: true,
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: normaliseRecipient(input.to),
          type: "template",
          template: {
            name: templateName,
            language: {
              code: templateLanguageCode,
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: normaliseTwilioBody(input.body),
                  },
                ],
              },
            ],
          },
        }),
      },
      getMarketingAccessToken(),
    );

    const message = payload.messages?.[0];

    if (!message?.id) {
      throw new Error("Meta marketing messages did not return a message id.");
    }

    return {
      id: message.id,
      status: message.message_status ?? "accepted",
      to: normaliseRecipient(input.to),
    };
  } catch (error) {
    logger.error("meta.marketing_message_failed", {
      error: error instanceof Error ? error.message : "unknown",
      to: normaliseRecipient(input.to),
    });

    return sendCloudApiMessage(input);
  }
}
