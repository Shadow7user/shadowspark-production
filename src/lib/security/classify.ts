import type { NormalizedVariant, RiskCategory } from "@/lib/security/types";
import {
  collectPropagandaCategories,
  detectPropagandaSignals,
} from "@/lib/security/propagandaSignals";

type ClassificationResult = {
  categories: RiskCategory[];
  reasons: string[];
};

const PROMPT_INJECTION_PATTERNS: ReadonlyArray<RegExp> = [
  /\bignore\b.{0,50}\b(previous|prior|system|developer|safety)\b.{0,40}\binstructions?\b/i,
  /\b(disregard|override)\b.{0,50}\b(system|developer|policy|guardrails?|filters?)\b/i,
  /\breveal\b.{0,40}\b(system prompt|hidden instructions|developer message)\b/i,
  /\bact as\b.{0,40}\bwithout restrictions\b/i,
];

const POLICY_EVASION_PATTERNS: ReadonlyArray<RegExp> = [
  /\bjailbreak\b/i,
  /\bbypass\b.{0,40}\b(policy|guardrails?|filters?|safety)\b/i,
  /\bwithout\b.{0,20}\b(filters?|guardrails?|policy|safety)\b/i,
  /\bdo not\b.{0,30}\bmention\b.{0,30}\b(policy|rules?|safety)\b/i,
  /\bpretend\b.{0,30}\bthis is allowed\b/i,
];

const SUSPICIOUS_TRANSFORM_PATTERNS: ReadonlyArray<RegExp> = [
  /\bdecode\b.{0,40}\b(follow|execute|instructions?)\b/i,
  /\btranslate\b.{0,40}\b(follow|execute)\b/i,
  /\bextract\b.{0,40}\bhidden instructions?\b/i,
  /\bunpack\b.{0,20}\b(and|then)\b.{0,20}\b(execute|follow)\b/i,
  /\b(base64|rot13|hex|deobfuscat(e|ion)|encoded|embedded)\b.{0,30}\binstructions?\b/i,
];

const DESTRUCTIVE_OVERRIDE_PATTERNS: ReadonlyArray<RegExp> = [
  /\badmin[_ -]?bypass\b/i,
  /\bsystem[_ -]?override\b/i,
  /\b(drop|truncate|delete|alter)\b.{0,20}\btable\b/i,
  /\bdrop_table\b/i,
];

const CLEAR_OUT_OF_SCOPE_PATTERNS: ReadonlyArray<RegExp> = [
  /\b(write|tell|make|generate)\b.{0,40}\b(poem|lyrics|song|joke|story)\b/i,
  /\b(recipe|horoscope|astrology|movie review|game cheat)\b/i,
  /\bsolve\b.{0,40}\b(homework|exam|assignment)\b/i,
];

const MALICIOUS_VERBS = /\b(steal|harvest|collect|capture|dump|exfiltrat(e|ion)|bypass|obtain|send|craft|build|create|generate|write|deploy|execute|follow|launch|deliver)\b/i;
const PHISHING_TARGETS = /\b(phish(ing)?|fake login|spoof(ed|ing)?|impersonat(e|ion)|social engineering|gift card scam|fraudulent invoice|credential lure)\b/i;
const CREDENTIAL_TARGETS = /\b(passwords?|credentials?|api keys?|access tokens?|session cookies?|otp|one[- ]time password|2fa|mfa|secret keys?|login details)\b/i;
const MALWARE_TARGETS = /\b(malware|ransomware|keylogger|trojan|rat|payload|reverse shell|botnet)\b/i;
const HACKING_TARGETS = /\b(sql injection|xss|ddos|credential stuffing|exploit|bypass authentication|intrusion|persistence)\b/i;
const ILLEGAL_TARGETS = /\b(counterfeit|stolen cards?|launder|money laundering|evade law enforcement|sanctions evasion|illegal scheme)\b/i;

function addCategory(
  categories: Set<RiskCategory>,
  reasons: Set<string>,
  category: RiskCategory,
  reason: string,
): void {
  categories.add(category);
  reasons.add(reason);
}

function matchesAny(texts: string[], patterns: ReadonlyArray<RegExp>): boolean {
  return texts.some((text) => patterns.some((pattern) => pattern.test(text)));
}

function matchesMaliciousTarget(texts: string[], targetPattern: RegExp): boolean {
  return texts.some((text) => MALICIOUS_VERBS.test(text) && targetPattern.test(text));
}

export function classifyRisk(input: string, variants: NormalizedVariant[]): ClassificationResult {
  const categories = new Set<RiskCategory>();
  const reasons = new Set<string>();
  const texts = variants.map((variant) => variant.content.toLowerCase());
  const hasDecodedVariant = variants.some((variant) => variant.kind === "base64_decoded");
  const propagandaMatches = detectPropagandaSignals(input, variants);

  if (matchesAny(texts, PROMPT_INJECTION_PATTERNS)) {
    addCategory(
      categories,
      reasons,
      "prompt_injection",
      "Detected an instruction that tries to override trusted system behavior.",
    );
  }

  if (matchesAny(texts, POLICY_EVASION_PATTERNS)) {
    addCategory(
      categories,
      reasons,
      "policy_evasion",
      "Detected language that attempts to bypass safety rules or guardrails.",
    );
  }

  if (matchesAny(texts, DESTRUCTIVE_OVERRIDE_PATTERNS)) {
    addCategory(
      categories,
      reasons,
      "policy_evasion",
      "Detected destructive system-override or admin-bypass instructions.",
    );
  }

  if (hasDecodedVariant || matchesAny(texts, SUSPICIOUS_TRANSFORM_PATTERNS)) {
    addCategory(
      categories,
      reasons,
      "suspicious_transform",
      hasDecodedVariant
        ? "Detected encoded content that required decoding for inspection."
        : "Detected instructions to decode, translate, or extract hidden content.",
    );
  }

  if (matchesMaliciousTarget(texts, PHISHING_TARGETS)) {
    addCategory(
      categories,
      reasons,
      "phishing_fraud",
      "Detected phishing or fraud-oriented intent.",
    );
  }

  if (matchesMaliciousTarget(texts, CREDENTIAL_TARGETS)) {
    addCategory(
      categories,
      reasons,
      "credential_theft",
      "Detected credential theft or account takeover intent.",
    );
  }

  if (
    matchesMaliciousTarget(texts, MALWARE_TARGETS) ||
    matchesMaliciousTarget(texts, HACKING_TARGETS)
  ) {
    addCategory(
      categories,
      reasons,
      "malware",
      "Detected malware, intrusion, or offensive abuse intent.",
    );
  }

  if (matchesMaliciousTarget(texts, ILLEGAL_TARGETS)) {
    addCategory(
      categories,
      reasons,
      "illegal_activity",
      "Detected illegal or evasive misuse intent.",
    );
  }

  if (matchesAny(texts, CLEAR_OUT_OF_SCOPE_PATTERNS)) {
    addCategory(
      categories,
      reasons,
      "out_of_scope",
      "Detected a request that is clearly outside approved business assistant scope.",
    );
  }

  for (const category of collectPropagandaCategories(propagandaMatches)) {
    categories.add(category);
  }

  for (const match of propagandaMatches) {
    for (const reason of match.reasons) {
      reasons.add(reason);
    }
  }

  return {
    categories: Array.from(categories),
    reasons: Array.from(reasons),
  };
}
