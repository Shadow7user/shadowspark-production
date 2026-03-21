export type SecurityDecision = "allow" | "safe_complete" | "block" | "escalate";

export type RiskCategory =
  | "none"
  | "prompt_injection"
  | "phishing_fraud"
  | "credential_theft"
  | "malware"
  | "illegal_activity"
  | "policy_evasion"
  | "out_of_scope"
  | "suspicious_transform";

export interface NormalizedVariant {
  kind: string;
  content: string;
}

export interface SecurityAssessment {
  decision: SecurityDecision;
  categories: RiskCategory[];
  reasons: string[];
  normalizedVariants: NormalizedVariant[];
  requiresConfirmation: boolean;
  safeReply?: string;
}

export interface OutputGuardResult {
  allowed: boolean;
  reasons: string[];
  safeReply?: string;
}

export type SecurityProfileId =
  | "customer_support"
  | "lead_analysis"
  | "demo_generation"
  | "follow_up_writer";

export interface SecurityProfile {
  id: SecurityProfileId;
  description: string;
  allowedScopeKeywords: readonly string[];
  allowedScopePatterns?: ReadonlyArray<RegExp>;
  confirmationPatterns?: ReadonlyArray<RegExp>;
}

export interface SecurePrecheckOptions {
  profile?: SecurityProfileId;
}

export type SensitiveActionName =
  | "send_email"
  | "send_whatsapp"
  | "trigger_webhook"
  | "modify_record"
  | "create_record"
  | "crm_write";

export type SensitiveActionSource =
  | "admin_session"
  | "validated_public_request"
  | "validated_external_request"
  | "validated_webhook"
  | "system_process";

export interface SensitiveActionRequest {
  action: SensitiveActionName;
  actorRole?: string;
  explicitApproval?: boolean;
  route: string;
  source: SensitiveActionSource;
}

export interface SensitiveActionDecision {
  allowed: boolean;
  reasons: string[];
}

export interface PropagandaTechniqueRule {
  id: string;
  name: string;
  psychologicalTrigger: string;
  linguisticPatterns: ReadonlyArray<RegExp>;
  riskSignals: readonly string[];
  mappedCategories: readonly RiskCategory[];
  mitigation: string;
}

export interface PropagandaTechniqueMatch {
  id: string;
  name: string;
  mappedCategories: RiskCategory[];
  reasons: string[];
  mitigation: string;
}

export interface SecurityLogEntry {
  timestamp: string;
  stage: "precheck" | "postcheck";
  decision: SecurityDecision;
  categories: RiskCategory[];
  reasons: string[];
  textHash: string;
  normalizationOccurred: boolean;
  normalizedVariantKinds: string[];
  requiresConfirmation: boolean;
  route?: string;
  userHash?: string;
  model?: string;
}
