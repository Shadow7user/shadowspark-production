import { createHash } from "node:crypto";
import { logger } from "@/lib/observability";
import type {
  NormalizedVariant,
  RiskCategory,
  SecurityDecision,
  SecurityLogEntry,
} from "@/lib/security/types";

type CreateSecurityLogEntryInput = {
  stage: "precheck" | "postcheck";
  text: string;
  decision: SecurityDecision;
  categories: RiskCategory[];
  reasons: string[];
  normalizedVariants?: NormalizedVariant[];
  requiresConfirmation?: boolean;
  route?: string;
  userHash?: string;
  model?: string;
};

function truncateReason(reason: string): string {
  return reason.slice(0, 160);
}

export function hashText(input: string): string {
  return createHash("sha256").update(input.trim()).digest("hex").slice(0, 16);
}

export function createSecurityLogEntry({
  stage,
  text,
  decision,
  categories,
  reasons,
  normalizedVariants = [],
  requiresConfirmation = false,
  route,
  userHash,
  model,
}: CreateSecurityLogEntryInput): SecurityLogEntry {
  return {
    timestamp: new Date().toISOString(),
    stage,
    decision,
    categories,
    reasons: reasons.slice(0, 4).map(truncateReason),
    textHash: hashText(text),
    normalizationOccurred: normalizedVariants.some((variant) => variant.kind !== "raw"),
    normalizedVariantKinds: normalizedVariants.map((variant) => variant.kind).slice(0, 8),
    requiresConfirmation,
    ...(route ? { route } : {}),
    ...(userHash ? { userHash } : {}),
    ...(model ? { model } : {}),
  };
}

export function logSecurityEvent(entry: SecurityLogEntry): void {
  const meta = {
    security_stage: entry.stage,
    security_decision: entry.decision,
    security_categories: entry.categories,
    security_reasons: entry.reasons,
    text_hash: entry.textHash,
    normalization_occurred: entry.normalizationOccurred,
    normalized_variant_kinds: entry.normalizedVariantKinds,
    requires_confirmation: entry.requiresConfirmation,
    route: entry.route,
    user_hash: entry.userHash,
    model: entry.model,
  };

  if (entry.decision === "allow") {
    logger.info("ai_security.check", meta);
    return;
  }

  logger.warn("ai_security.check", meta);
}
