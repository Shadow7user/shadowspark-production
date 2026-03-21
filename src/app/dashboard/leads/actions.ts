"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createDemoSession } from "@/lib/demo/generateDemoSession";
import { assertSensitiveActionAllowed } from "@/lib/security";
import {
  buildFollowUpDrafts,
  type FollowUpVariation,
} from "@/lib/notifications/followUp";
import { sendStrategyNotification } from "@/lib/notifications/whatsapp";
import { executeDirectSend } from "@/lib/whatsapp";

const regenerateInputSchema = z.object({
  organizationName: z.string().trim().min(1).max(120),
  industry: z.string().trim().min(1).max(120),
  whatsapp: z.string().trim().min(1).max(40),
  intent: z.string().trim().min(8).max(2000),
  location: z.string().trim().min(1).max(120),
  website: z.string().trim().max(240),
});

export type RegenerateStrategyResult = {
  success: boolean;
  sessionId?: string;
  error?: string;
};

const strategyNotificationInputSchema = z.object({
  leadId: z.string().cuid(),
  customMessage: z.string().trim().min(1).max(2000).optional(),
});

export type StrategyNotificationResult = {
  channel?: "meta" | "twilio";
  drafts?: FollowUpVariation[];
  persistedToLead?: boolean;
  deliveryId?: string;
  selectedTone?: FollowUpVariation["tone"];
  success: boolean;
  error?: string;
};

export type DraftFollowUpResult = {
  success: boolean;
  drafts?: FollowUpVariation[];
  error?: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export async function regenerateStrategyAction(
  rawInput: unknown,
): Promise<RegenerateStrategyResult> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" || !process.env.ADMIN_SECRET?.trim()) {
    return {
      success: false,
      error: "Unauthorized regenerate attempt.",
    };
  }

  try {
    const input = regenerateInputSchema.parse(rawInput);
    assertSensitiveActionAllowed({
      action: "create_record",
      actorRole: session.user.role,
      explicitApproval: true,
      route: "dashboard.regenerate_strategy",
      source: "admin_session",
    });
    const result = await createDemoSession(input);

    return {
      success: true,
      sessionId: result.sessionId,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function sendStrategyNotificationAction(
  rawInput: unknown,
): Promise<StrategyNotificationResult> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" || !process.env.ADMIN_SECRET?.trim()) {
    return {
      success: false,
      error: "Unauthorized notification attempt.",
    };
  }

  try {
    const input = strategyNotificationInputSchema.parse(rawInput);
    const payload = await sendStrategyNotification(input.leadId, input.customMessage);
    const delivery = await executeDirectSend(input.leadId, payload.message, {
      action: "send_whatsapp",
      actorRole: session.user.role,
      explicitApproval: true,
      route: "dashboard.send_strategy_notification",
      source: "admin_session",
    });

    return {
      channel: delivery.provider,
      deliveryId: delivery.id,
      persistedToLead: delivery.persistedToLead,
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function draftFollowUp(
  leadId: string,
): Promise<DraftFollowUpResult> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" || !process.env.ADMIN_SECRET?.trim()) {
    return {
      success: false,
      error: "Unauthorized draft attempt.",
    };
  }

  try {
    const id = z.string().cuid().parse(leadId);
    const drafts = await buildFollowUpDrafts(id);

    return {
      success: true,
      drafts,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function executeDirectSendAction(
  leadId: string,
): Promise<StrategyNotificationResult> {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" || !process.env.ADMIN_SECRET?.trim()) {
    return {
      success: false,
      error: "Unauthorized direct-send attempt.",
    };
  }

  try {
    const id = z.string().cuid().parse(leadId);
    const drafts = await buildFollowUpDrafts(id);
    const selectedDraft =
      drafts.find((draft) => draft.tone === "tactical") ?? drafts[0];

    if (!selectedDraft) {
      throw new Error("No follow-up draft was available for direct send.");
    }

    const delivery = await executeDirectSend(id, selectedDraft.message, {
      action: "send_whatsapp",
      actorRole: session.user.role,
      explicitApproval: true,
      route: "dashboard.execute_direct_send",
      source: "admin_session",
    });

    return {
      channel: delivery.provider,
      deliveryId: delivery.id,
      drafts,
      persistedToLead: delivery.persistedToLead,
      selectedTone: selectedDraft.tone,
      success: true,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
