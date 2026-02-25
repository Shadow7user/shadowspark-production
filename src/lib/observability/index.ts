/**
 * Observability layer — barrel export.
 *
 * Import from "@/lib/observability" to access all observability utilities.
 */

export { logger, hashPhone, sanitise } from "./logger";
export type { LogLevel, LogEntry, WebhookLogEntry } from "./logger";

export { startTimer, measureAsync, metricsStore } from "./metrics";
export type { LatencyHistogram, ServiceMetrics, MetricsSnapshot } from "./metrics";

export { classifyError, isCritical, buildErrorResponse } from "./errorClassifier";
export type { ErrorType, ErrorSeverity, ClassifiedError } from "./errorClassifier";

export { checkRateLimit, getAbuseStats } from "./rateLimit";
export type { RateLimitResult, UserActivity } from "./rateLimit";

export {
  registerGauge,
  registerCounter,
  generatePrometheusOutput,
  getTelemetrySnapshot,
} from "./telemetry";
