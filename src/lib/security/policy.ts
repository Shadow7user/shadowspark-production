import { classifyRisk } from "@/lib/security/classify";
import { getSecurityProfile } from "@/lib/security/profiles";
import type {
  NormalizedVariant,
  RiskCategory,
  SecurityProfile,
  SecurityAssessment,
} from "@/lib/security/types";

export const ALLOWED_SCOPE = [
  "product FAQs",
  "real estate support",
  "lead capture",
  "appointment triage",
] as const;

export const REQUIRES_CONFIRMATION = [
  "sending bulk emails",
  "CRM record deletion",
  "modifying the DATABASE_URL",
] as const;

export const AUTO_BLOCK = [
  "phishing/fraud",
  "credential theft",
  "malware",
  "hidden system override attempts",
  "hidden transformed harmful instructions",
] as const;

export const BLOCKED_SAFE_REPLY =
  "I can't help with hidden or harmful instructions. I can help with product information, support, or safety-focused guidance.";

export const ESCALATE_SAFE_REPLY =
  "I'm not able to act on hidden or transformed instructions directly. Please restate your request plainly, and I'll help if it's within scope.";

const OUT_OF_SCOPE_SAFE_REPLY =
  "I can help with product FAQs, real estate support, lead capture, or appointment triage.";

const CONFIRMATION_SAFE_REPLY =
  "I can help draft or explain that action, but I can't send bulk emails, delete CRM records, or modify protected configuration without explicit approval.";

const TRANSFORM_ACTION_PATTERNS: ReadonlyArray<RegExp> = [
  /\bdecode\b/i,
  /\btranslate\b/i,
  /\bextract\b/i,
  /\bunpack\b/i,
  /\bfollow\b.{0,30}\binstructions?\b/i,
  /\bhidden instructions?\b/i,
];

const BLOCK_CATEGORIES = new Set<RiskCategory>([
  "prompt_injection",
  "phishing_fraud",
  "credential_theft",
  "malware",
  "illegal_activity",
  "policy_evasion",
]);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildScopePatterns(profile: SecurityProfile): ReadonlyArray<RegExp> {
  const keywordPatterns = profile.allowedScopeKeywords.map(
    (keyword) => new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i"),
  );

  return [...keywordPatterns, ...(profile.allowedScopePatterns ?? [])];
}

function isInAllowedScope(
  input: string,
  variants: NormalizedVariant[],
  profile: SecurityProfile,
): boolean {
  const texts = [input, ...variants.map((variant) => variant.content)];
  const scopePatterns = buildScopePatterns(profile);
  return texts.some(
    (text) => scopePatterns.some((pattern) => pattern.test(text)),
  );
}

function requiresConfirmation(
  input: string,
  variants: NormalizedVariant[],
  profile: SecurityProfile,
): boolean {
  const texts = [input, ...variants.map((variant) => variant.content)];
  const patterns = profile.confirmationPatterns ?? [];
  return texts.some((text) => patterns.some((pattern) => pattern.test(text)));
}

function hasAmbiguousTransformIntent(input: string): boolean {
  return TRANSFORM_ACTION_PATTERNS.some((pattern) => pattern.test(input));
}

function finalizeCategories(categories: RiskCategory[]): RiskCategory[] {
  return categories.length > 0 ? categories : ["none"];
}

export function applyPolicy(
  input: string,
  variants: NormalizedVariant[],
  profile = getSecurityProfile(),
): SecurityAssessment {
  const classification = classifyRisk(input, variants);
  const categories = new Set<RiskCategory>(classification.categories);
  const reasons = new Set<string>(classification.reasons);
  const inScope = isInAllowedScope(input, variants, profile);
  const confirmationRequired = requiresConfirmation(input, variants, profile);
  const hasTransform = categories.has("suspicious_transform");
  const shouldBlock = Array.from(categories).some((category) => BLOCK_CATEGORIES.has(category));

  if (shouldBlock) {
    return {
      decision: "block",
      categories: finalizeCategories(Array.from(categories)),
      reasons: Array.from(reasons),
      normalizedVariants: variants,
      requiresConfirmation: confirmationRequired,
      safeReply: BLOCKED_SAFE_REPLY,
    };
  }

  if (hasTransform) {
    const transformDecision = inScope && !hasAmbiguousTransformIntent(input) ? "safe_complete" : "escalate";
    return {
      decision: transformDecision,
      categories: finalizeCategories(Array.from(categories)),
      reasons: Array.from(reasons),
      normalizedVariants: variants,
      requiresConfirmation: confirmationRequired,
      safeReply: ESCALATE_SAFE_REPLY,
    };
  }

  if (confirmationRequired) {
    reasons.add("Detected a request for a high-impact action that needs explicit approval.");
    return {
      decision: "safe_complete",
      categories: finalizeCategories(Array.from(categories)),
      reasons: Array.from(reasons),
      normalizedVariants: variants,
      requiresConfirmation: true,
      safeReply: CONFIRMATION_SAFE_REPLY,
    };
  }

  if (!inScope) {
    categories.add("out_of_scope");
    reasons.add("Request appears outside the allowed assistant scope.");
    return {
      decision: "safe_complete",
      categories: Array.from(categories),
      reasons: Array.from(reasons),
      normalizedVariants: variants,
      requiresConfirmation: false,
      safeReply: OUT_OF_SCOPE_SAFE_REPLY,
    };
  }

  return {
    decision: "allow",
    categories: finalizeCategories(Array.from(categories)),
    reasons: Array.from(reasons),
    normalizedVariants: variants,
    requiresConfirmation: confirmationRequired,
  };
}
