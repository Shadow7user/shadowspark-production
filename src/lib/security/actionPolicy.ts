import { logger } from "@/lib/observability";
import type {
  SensitiveActionDecision,
  SensitiveActionName,
  SensitiveActionRequest,
  SensitiveActionSource,
} from "@/lib/security/types";

type SensitiveActionPolicy = {
  allowedSources: ReadonlySet<SensitiveActionSource>;
  requiresExplicitApprovalFrom: ReadonlySet<SensitiveActionSource>;
};

const ACTION_POLICIES: Record<SensitiveActionName, SensitiveActionPolicy> = {
  send_email: {
    allowedSources: new Set(["admin_session"]),
    requiresExplicitApprovalFrom: new Set(["admin_session"]),
  },
  send_whatsapp: {
    allowedSources: new Set(["admin_session"]),
    requiresExplicitApprovalFrom: new Set(["admin_session"]),
  },
  trigger_webhook: {
    allowedSources: new Set(["admin_session"]),
    requiresExplicitApprovalFrom: new Set(["admin_session"]),
  },
  crm_write: {
    allowedSources: new Set(["admin_session"]),
    requiresExplicitApprovalFrom: new Set(["admin_session"]),
  },
  modify_record: {
    allowedSources: new Set([
      "admin_session",
      "validated_public_request",
      "validated_external_request",
      "validated_webhook",
      "system_process",
    ]),
    requiresExplicitApprovalFrom: new Set(),
  },
  create_record: {
    allowedSources: new Set([
      "admin_session",
      "validated_public_request",
      "validated_external_request",
      "validated_webhook",
      "system_process",
    ]),
    requiresExplicitApprovalFrom: new Set(),
  },
};

function buildDeniedDecision(reason: string): SensitiveActionDecision {
  return {
    allowed: false,
    reasons: [reason],
  };
}

export function authorizeSensitiveAction(
  request: SensitiveActionRequest,
): SensitiveActionDecision {
  const policy = ACTION_POLICIES[request.action];

  if (!policy.allowedSources.has(request.source)) {
    return buildDeniedDecision(
      `Action ${request.action} is not allowed from source ${request.source}.`,
    );
  }

  if (
    request.source === "admin_session" &&
    request.actorRole &&
    request.actorRole !== "ADMIN"
  ) {
    return buildDeniedDecision(
      `Action ${request.action} requires an ADMIN actor for admin-session approval.`,
    );
  }

  if (
    policy.requiresExplicitApprovalFrom.has(request.source) &&
    !request.explicitApproval
  ) {
    return buildDeniedDecision(
      `Action ${request.action} requires explicit human approval before execution.`,
    );
  }

  return {
    allowed: true,
    reasons: [],
  };
}

export function assertSensitiveActionAllowed(
  request: SensitiveActionRequest,
): void {
  const decision = authorizeSensitiveAction(request);

  if (decision.allowed) {
    logger.info("ai_security.action_allowed", {
      action: request.action,
      actor_role: request.actorRole,
      approval_source: request.source,
      explicit_approval: request.explicitApproval ?? false,
      route: request.route,
    });
    return;
  }

  logger.warn("ai_security.action_blocked", {
    action: request.action,
    actor_role: request.actorRole,
    approval_source: request.source,
    explicit_approval: request.explicitApproval ?? false,
    reasons: decision.reasons,
    route: request.route,
  });

  throw new Error(decision.reasons[0] ?? "Sensitive action blocked by security policy.");
}
