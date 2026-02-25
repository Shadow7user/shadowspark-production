/**
 * Structured error classification.
 *
 * Classifies errors by type and severity, and provides
 * auto-fallback responses for critical failures.
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type ErrorType = "validation" | "openai" | "redis" | "prisma" | "unknown";
export type ErrorSeverity = "low" | "medium" | "critical";

export interface ClassifiedError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  fallbackResponse: string;
  retryable: boolean;
  httpStatus: number;
}

// ── Fallback Responses ─────────────────────────────────────────────────────

const FALLBACK_RESPONSES: Record<ErrorType, string> = {
  validation:
    "I couldn't understand your message format. Please try again with a plain text message.",
  openai:
    "I'm having trouble generating a response right now. Please try again in a moment.",
  redis:
    "Our message queue is temporarily unavailable. Your message has been received and will be processed shortly.",
  prisma:
    "We're experiencing a brief database issue. Please try again in a few seconds.",
  unknown:
    "Something went wrong on our end. Our team has been notified. Please try again shortly.",
};

// ── Classification Rules ───────────────────────────────────────────────────

const PRISMA_ERROR_CODES = new Set([
  "P1000", "P1001", "P1002", "P1003", "P1008", "P1009", "P1010",
  "P2000", "P2001", "P2002", "P2003", "P2004", "P2005", "P2006",
  "P2025",
]);

function isPrismaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  return (
    typeof e.code === "string" && PRISMA_ERROR_CODES.has(e.code) ||
    e.constructor?.name === "PrismaClientKnownRequestError" ||
    e.constructor?.name === "PrismaClientUnknownRequestError" ||
    e.constructor?.name === "PrismaClientInitializationError"
  );
}

function isOpenAIError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  return (
    e.constructor?.name === "OpenAI" ||
    (typeof e.status === "number" && typeof e.error === "object") ||
    (typeof e.message === "string" && (
      (e.message as string).includes("openai") ||
      (e.message as string).includes("OpenAI") ||
      (e.message as string).includes("rate_limit") ||
      (e.message as string).includes("insufficient_quota")
    ))
  );
}

function isRedisError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  return (
    e.constructor?.name === "ReplyError" ||
    e.constructor?.name === "AbortError" ||
    (typeof e.message === "string" && (
      (e.message as string).includes("ECONNREFUSED") ||
      (e.message as string).includes("Redis") ||
      (e.message as string).includes("redis")
    ))
  );
}

function isValidationError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as Record<string, unknown>;
  return (
    e.constructor?.name === "ZodError" ||
    e.constructor?.name === "ValidationError" ||
    (typeof e.message === "string" && (
      (e.message as string).toLowerCase().includes("validation") ||
      (e.message as string).toLowerCase().includes("invalid")
    ))
  );
}

function determineSeverity(type: ErrorType, error: unknown): ErrorSeverity {
  if (type === "validation") return "low";

  if (type === "openai") {
    const e = error as Record<string, unknown>;
    // Rate limit or quota exhausted → medium; server error → critical
    if (typeof e.status === "number") {
      if (e.status === 429) return "medium";
      if (e.status >= 500) return "critical";
    }
    return "medium";
  }

  if (type === "redis") return "medium"; // Redis down is recoverable

  if (type === "prisma") {
    const e = error as Record<string, unknown>;
    // Connection errors are critical; query errors are medium
    if (typeof e.code === "string" && e.code.startsWith("P1")) return "critical";
    return "medium";
  }

  return "critical"; // unknown errors default to critical
}

// ── Main Classifier ────────────────────────────────────────────────────────

/**
 * Classify an error and return structured metadata + fallback response.
 */
export function classifyError(error: unknown): ClassifiedError {
  let type: ErrorType = "unknown";

  if (isValidationError(error)) type = "validation";
  else if (isOpenAIError(error))  type = "openai";
  else if (isRedisError(error))   type = "redis";
  else if (isPrismaError(error))  type = "prisma";

  const severity = determineSeverity(type, error);

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "An unexpected error occurred";

  const retryable = type !== "validation";

  const httpStatus =
    type === "validation" ? 400 :
    type === "openai"     ? 503 :
    type === "redis"      ? 503 :
    type === "prisma"     ? 503 :
    500;

  return {
    type,
    severity,
    message,
    fallbackResponse: FALLBACK_RESPONSES[type],
    retryable,
    httpStatus,
  };
}

/**
 * Returns true if the error is critical enough to warrant an immediate
 * fallback response without further processing.
 */
export function isCritical(classified: ClassifiedError): boolean {
  return classified.severity === "critical";
}

/**
 * Build a safe, user-facing error response payload.
 */
export function buildErrorResponse(classified: ClassifiedError): {
  error: string;
  type: ErrorType;
  retryable: boolean;
} {
  return {
    error: classified.fallbackResponse,
    type: classified.type,
    retryable: classified.retryable,
  };
}
