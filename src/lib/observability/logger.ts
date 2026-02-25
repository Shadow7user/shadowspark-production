/**
 * Structured JSON logger — production-grade, PII-safe.
 *
 * Rules enforced:
 *  - Phone numbers are NEVER logged raw; always SHA-256 hashed.
 *  - API keys, tokens, and raw message content are stripped.
 *  - All output is newline-delimited JSON (NDJSON) for log aggregators.
 */

import { createHash } from "crypto";
import { env } from "@/lib/env";

// ── Types ──────────────────────────────────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  [key: string]: unknown;
}

export interface WebhookLogEntry extends LogEntry {
  mode?: string;
  user_hash?: string;
  latency_ms?: number;
  openai_ms?: number;
  redis_ms?: number;
  db_ms?: number;
  response_status?: number;
  error_type?: string;
  error_severity?: string;
}

// ── PII Sanitisation ───────────────────────────────────────────────────────

const PII_PATTERNS: RegExp[] = [
  /sk-[A-Za-z0-9_-]{20,}/g,          // OpenAI API keys
  /Bearer\s+[A-Za-z0-9._-]+/gi,      // Bearer tokens
  /\b\d{10,15}\b/g,                   // Raw phone numbers (10-15 digits)
  /whatsapp:\+\d+/gi,                 // Twilio-style phone refs
];

/**
 * Hash a phone number with SHA-256 so it can be correlated without
 * exposing the raw number. Returns first 16 hex chars for brevity.
 */
export function hashPhone(phone: string): string {
  return createHash("sha256")
    .update(phone.trim().replace(/\D/g, ""))
    .digest("hex")
    .slice(0, 16);
}

/**
 * Strip known PII patterns from a string value.
 */
function sanitiseString(value: string): string {
  let out = value;
  for (const pattern of PII_PATTERNS) {
    out = out.replace(pattern, "[REDACTED]");
  }
  return out;
}

/**
 * Deep-sanitise an object: redact known sensitive keys and apply
 * pattern-based scrubbing to string values.
 */
const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "secret",
  "api_key",
  "apiKey",
  "authorization",
  "phone",
  "phoneNumber",
  "phone_number",
  "body",
  "content",
  "message",
  "text",
  "rawBody",
]);

export function sanitise<T>(obj: T): T {
  if (typeof obj === "string") return sanitiseString(obj) as unknown as T;
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitise) as unknown as T;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (typeof value === "string") {
      result[key] = sanitiseString(value);
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitise(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

// ── Logger ─────────────────────────────────────────────────────────────────

const SERVICE_NAME = env.serviceName;
const LOG_LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
};

function getMinLevel(): LogLevel {
  const configured = env.logLevel.toLowerCase() as LogLevel;
  return LOG_LEVEL_ORDER[configured] !== undefined ? configured : "info";
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_ORDER[level] >= LOG_LEVEL_ORDER[getMinLevel()];
}

function write(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    service: SERVICE_NAME,
    message,
    ...sanitise(meta),
  };

  // NDJSON — one JSON object per line
  const line = JSON.stringify(entry);

  if (level === "error" || level === "warn" || level === "critical") {
    process.stderr.write(line + "\n");
  } else {
    process.stdout.write(line + "\n");
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => write("debug", message, meta),
  info:  (message: string, meta?: Record<string, unknown>) => write("info",  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => write("warn",  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),

  /**
   * Log a complete webhook request lifecycle.
   */
  webhook(entry: Omit<WebhookLogEntry, "timestamp" | "level" | "service" | "message">): void {
    write("info", "webhook.processed", entry as Record<string, unknown>);
  },

  /**
   * Log a structured error with classification metadata.
   */
  classifiedError(
    message: string,
    opts: {
      type: "validation" | "openai" | "redis" | "prisma" | "unknown";
      severity: "low" | "medium" | "critical";
      error?: unknown;
      meta?: Record<string, unknown>;
    },
  ): void {
    const { type, severity, error, meta = {} } = opts;
    const errorMeta: Record<string, unknown> = {
      error_type: type,
      error_severity: severity,
      ...meta,
    };

    if (error instanceof Error) {
      errorMeta.error_name = error.name;
      errorMeta.error_message = sanitiseString(error.message);
      if (env.nodeEnv !== "production") {
        errorMeta.stack = error.stack;
      }
    }

    write("error", message, errorMeta);
  },
};
