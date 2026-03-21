import { Prisma } from "@prisma/client";
import { z } from "zod";

const leadMetadataSchema = z.object({
  campaignId: z.string().trim().min(1).optional().nullable(),
  deliveryId: z.string().trim().min(1).optional().nullable(),
  deliveryProvider: z.enum(["meta", "twilio"]).optional().nullable(),
  deliveryStatus: z.string().trim().min(1).optional().nullable(),
  industry: z.string().trim().min(1).optional().nullable(),
  intent: z.string().trim().min(1).optional().nullable(),
  location: z.string().trim().min(1).optional().nullable(),
  marketingMessageId: z.string().trim().min(1).optional().nullable(),
  marketingMessageStatus: z.string().trim().min(1).optional().nullable(),
  marketingMessagesOnboardingStatus:
    z.string().trim().min(1).optional().nullable(),
  metaMessageId: z.string().trim().min(1).optional().nullable(),
  metaMessageStatus: z.string().trim().min(1).optional().nullable(),
  metaSentAt: z.string().datetime().optional().nullable(),
  organizationName: z.string().trim().min(1).optional().nullable(),
  sessionId: z.string().trim().min(1).optional().nullable(),
  twilioMessageSid: z.string().trim().min(1).optional().nullable(),
  twilioMessageStatus: z.string().trim().min(1).optional().nullable(),
  twilioSentAt: z.string().datetime().optional().nullable(),
  userAgent: z.string().trim().min(1).optional().nullable(),
});

export type LeadMetadata = z.infer<typeof leadMetadataSchema>;

export function parseLeadMetadata(metadata: unknown): LeadMetadata {
  const parsed = leadMetadataSchema.safeParse(metadata);

  if (!parsed.success) {
    return {};
  }

  return parsed.data;
}

export function mergeLeadMetadata(
  existing: unknown,
  patch: Partial<LeadMetadata>,
): Prisma.InputJsonValue {
  const merged = {
    ...parseLeadMetadata(existing),
    ...patch,
  };

  return Object.fromEntries(
    Object.entries(merged).filter((entry) => entry[1] !== undefined),
  ) as Prisma.InputJsonObject;
}
