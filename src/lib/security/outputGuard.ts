import { BLOCKED_SAFE_REPLY } from "@/lib/security/policy";
import type { OutputGuardResult, RiskCategory } from "@/lib/security/types";

const REFUSAL_PATTERNS: ReadonlyArray<RegExp> = [
  /\bi can(?:not|'t)\b.{0,40}\b(help|assist|provide)\b/i,
  /\bi (?:won't|will not)\b.{0,40}\b(help|assist|provide)\b/i,
  /\bnot able to assist\b/i,
  /\brefuse\b/i,
];

const HARMFUL_GUIDANCE_PATTERNS: ReadonlyArray<{
  pattern: RegExp;
  reason: string;
  category: RiskCategory;
}> = [
  {
    pattern: /\b(create|build|craft|send|deploy)\b.{0,50}\b(phish(ing)?|fake login|spoof(ed|ing)?|credential lure)\b/i,
    reason: "Output contained phishing or fraud enablement.",
    category: "phishing_fraud",
  },
  {
    pattern: /\b(steal|harvest|collect|capture|dump|exfiltrat(e|ion))\b.{0,50}\b(passwords?|credentials?|tokens?|otp|2fa|mfa|session cookies?)\b/i,
    reason: "Output contained credential theft enablement.",
    category: "credential_theft",
  },
  {
    pattern: /\b(write|build|deploy|deliver|install)\b.{0,50}\b(malware|ransomware|keylogger|trojan|rat|payload|reverse shell)\b/i,
    reason: "Output contained malware or intrusion enablement.",
    category: "malware",
  },
  {
    pattern: /\b(bypass|exploit|launch|execute)\b.{0,50}\b(sql injection|xss|ddos|credential stuffing|intrusion)\b/i,
    reason: "Output contained offensive hacking enablement.",
    category: "malware",
  },
  {
    pattern: /\b(counterfeit|stolen cards?|money laundering|sanctions evasion)\b/i,
    reason: "Output contained illegal harmful enablement.",
    category: "illegal_activity",
  },
];

function containsRefusal(draft: string): boolean {
  return REFUSAL_PATTERNS.some((pattern) => pattern.test(draft));
}

export function inferOutputRiskCategories(draft: string): RiskCategory[] {
  if (!draft.trim() || containsRefusal(draft)) {
    return [];
  }

  return Array.from(
    new Set(
      HARMFUL_GUIDANCE_PATTERNS
        .filter(({ pattern }) => pattern.test(draft))
        .map(({ category }) => category),
    ),
  );
}

export function guardOutput(draft: string): OutputGuardResult {
  if (!draft.trim() || containsRefusal(draft)) {
    return { allowed: true, reasons: [] };
  }

  const reasons = HARMFUL_GUIDANCE_PATTERNS
    .filter(({ pattern }) => pattern.test(draft))
    .map(({ reason }) => reason);

  if (reasons.length > 0) {
    return {
      allowed: false,
      reasons,
      safeReply: BLOCKED_SAFE_REPLY,
    };
  }

  return {
    allowed: true,
    reasons: [],
  };
}
