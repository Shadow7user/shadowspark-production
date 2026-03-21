import { normalizeInput } from "@/lib/security/normalize";
import { applyPolicy } from "@/lib/security/policy";
import { guardOutput } from "@/lib/security/outputGuard";
import { getSecurityProfile } from "@/lib/security/profiles";
import type {
  SecurePrecheckOptions,
  SecurityAssessment,
} from "@/lib/security/types";

export function securePrecheck(
  input: string,
  options?: SecurePrecheckOptions,
): SecurityAssessment {
  const variants = normalizeInput(input);
  const profile = getSecurityProfile(options?.profile);
  return applyPolicy(input, variants, profile);
}

export function securePostcheck(output: string): ReturnType<typeof guardOutput> {
  return guardOutput(output);
}

export { classifyRisk } from "@/lib/security/classify";
export { normalizeInput, detectBase64Like, tryDecodeBase64, extractCodeBlocks, extractJsonStrings } from "@/lib/security/normalize";
export { authorizeSensitiveAction, assertSensitiveActionAllowed } from "@/lib/security/actionPolicy";
export {
  PROPAGANDA_TECHNIQUE_RULES,
  detectPropagandaSignals,
  collectPropagandaCategories,
} from "@/lib/security/propagandaSignals";
export {
  ALLOWED_SCOPE,
  AUTO_BLOCK,
  BLOCKED_SAFE_REPLY,
  ESCALATE_SAFE_REPLY,
  REQUIRES_CONFIRMATION,
  applyPolicy,
} from "@/lib/security/policy";
export { SECURITY_PROFILES, getSecurityProfile } from "@/lib/security/profiles";
export { guardOutput, inferOutputRiskCategories } from "@/lib/security/outputGuard";
export { hashText, createSecurityLogEntry, logSecurityEvent } from "@/lib/security/audit";
export { SECURITY_FIXTURES } from "@/lib/security/fixtures";
export { SECURITY_PROMPT_FRAGMENT, hardenSystemPrompt, buildShadowSparkAssistantSystemPrompt } from "@/lib/security/prompt";
export type {
  NormalizedVariant,
  OutputGuardResult,
  PropagandaTechniqueMatch,
  PropagandaTechniqueRule,
  RiskCategory,
  SecurePrecheckOptions,
  SecurityProfile,
  SecurityProfileId,
  SecurityAssessment,
  SecurityDecision,
  SecurityLogEntry,
  SensitiveActionDecision,
  SensitiveActionName,
  SensitiveActionRequest,
  SensitiveActionSource,
} from "@/lib/security/types";
