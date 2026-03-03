import { BusinessLeadStatus } from "@prisma/client";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "ymail.com",
  "live.com",
]);

const HIGH_ROI_THRESHOLD = 1_000_000;
const HIGH_ROI_SCORE = 50;
const PRIORITY_INDUSTRY_SCORE = 30;
const CORPORATE_EMAIL_SCORE = 20;

// Industries with historically higher close rates (sales feedback).
const PRIORITY_INDUSTRIES = ["private education", "pharmacy"];
const PRIORITY_INDUSTRY_PATTERNS = PRIORITY_INDUSTRIES.map(
  (term) => new RegExp(`\\b${term.replace(/\s+/g, "\\s+")}\\b`, "i"),
);

export interface LeadScoreInput {
  calculatedRoi: number;
  industry: string;
  email: string;
}

function isCorporateEmail(email: string): boolean {
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (!domain) return false;
  const normalizedDomain = domain.toLowerCase();
  return !FREE_EMAIL_DOMAINS.has(normalizedDomain);
}

export function computeLeadScore({
  calculatedRoi,
  industry,
  email,
}: LeadScoreInput): number {
  let score = 0;

  if (calculatedRoi > HIGH_ROI_THRESHOLD) {
    score += HIGH_ROI_SCORE;
  }

  const trimmedIndustry = industry.trim();
  if (PRIORITY_INDUSTRY_PATTERNS.some((pattern) => pattern.test(trimmedIndustry))) {
    score += PRIORITY_INDUSTRY_SCORE;
  }

  if (isCorporateEmail(email)) {
    score += CORPORATE_EMAIL_SCORE;
  }

  return score;
}

export function deriveLeadStatus(score: number): BusinessLeadStatus {
  if (score >= 80) return BusinessLeadStatus.HOT;
  if (score >= 50) return BusinessLeadStatus.WARM;
  return BusinessLeadStatus.NEW;
}
