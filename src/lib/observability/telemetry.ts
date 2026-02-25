/**
 * Telemetry — Prometheus/Grafana-ready structure.
 *
 * Exposes a registry of named counters, gauges, and histograms
 * that can be scraped by Prometheus via /api/metrics.
 *
 * This module is intentionally lightweight (zero external deps)
 * and designed to be swapped for prom-client when the team is
 * ready to add the dependency.
 */

import { metricsStore } from "./metrics";

// ── Gauge Registry ─────────────────────────────────────────────────────────

type GaugeValue = number | (() => number | Promise<number>);

interface GaugeDefinition {
  name: string;
  help: string;
  value: GaugeValue;
  labels?: Record<string, string>;
}

const gauges: GaugeDefinition[] = [];

export function registerGauge(def: GaugeDefinition): void {
  gauges.push(def);
}

// ── Counter Registry ───────────────────────────────────────────────────────

interface CounterDefinition {
  name: string;
  help: string;
  getValue: () => number;
  labels?: Record<string, string>;
}

const counters: CounterDefinition[] = [];

export function registerCounter(def: CounterDefinition): void {
  counters.push(def);
}

// ── Built-in Registrations ─────────────────────────────────────────────────

// These are registered once at module load time.
// Additional gauges/counters can be registered from anywhere in the app.

registerGauge({
  name: "process_uptime_seconds",
  help: "Number of seconds the process has been running",
  value: () => Math.floor(process.uptime()),
});

registerGauge({
  name: "process_memory_heap_used_bytes",
  help: "Heap memory used by the Node.js process",
  value: () => process.memoryUsage().heapUsed,
});

registerGauge({
  name: "process_memory_rss_bytes",
  help: "Resident set size of the Node.js process",
  value: () => process.memoryUsage().rss,
});

registerCounter({
  name: "webhook_requests_total",
  help: "Total number of webhook requests processed",
  getValue: () => metricsStore.snapshot().webhook.requests_total,
});

registerCounter({
  name: "webhook_errors_total",
  help: "Total number of webhook errors",
  getValue: () => metricsStore.snapshot().webhook.errors_total,
});

registerCounter({
  name: "openai_requests_total",
  help: "Total number of OpenAI API calls",
  getValue: () => metricsStore.snapshot().openai.requests_total,
});

registerCounter({
  name: "openai_errors_total",
  help: "Total number of OpenAI API errors",
  getValue: () => metricsStore.snapshot().openai.errors_total,
});

registerCounter({
  name: "rate_limit_hits_total",
  help: "Total number of rate limit hits",
  getValue: () => metricsStore.snapshot().rate_limit_hits,
});

registerCounter({
  name: "abuse_detections_total",
  help: "Total number of abuse pattern detections",
  getValue: () => metricsStore.snapshot().abuse_detections,
});

// ── Prometheus Text Export ─────────────────────────────────────────────────

function labelsToString(labels?: Record<string, string>): string {
  if (!labels || Object.keys(labels).length === 0) return "";
  const pairs = Object.entries(labels)
    .map(([k, v]) => `${k}="${v}"`)
    .join(",");
  return `{${pairs}}`;
}

/**
 * Generate the full Prometheus text format output.
 * Combines the built-in registry with the MetricsStore histograms.
 */
export async function generatePrometheusOutput(): Promise<string> {
  const lines: string[] = [];

  // Gauges
  for (const gauge of gauges) {
    const rawValue = typeof gauge.value === "function" ? gauge.value() : gauge.value;
    const value = rawValue instanceof Promise ? await rawValue : rawValue;
    const labelStr = labelsToString(gauge.labels);
    lines.push(`# HELP ${gauge.name} ${gauge.help}`);
    lines.push(`# TYPE ${gauge.name} gauge`);
    lines.push(`${gauge.name}${labelStr} ${value}`);
  }

  // Counters
  for (const counter of counters) {
    const value = counter.getValue();
    const labelStr = labelsToString(counter.labels);
    lines.push(`# HELP ${counter.name} ${counter.help}`);
    lines.push(`# TYPE ${counter.name} counter`);
    lines.push(`${counter.name}${labelStr} ${value}`);
  }

  // Histograms from MetricsStore
  lines.push("");
  lines.push("# HELP service_latency_ms Service latency histograms");
  lines.push("# TYPE service_latency_ms histogram");
  lines.push(metricsStore.toPrometheusText());

  return lines.join("\n") + "\n";
}

/**
 * Snapshot of all telemetry data as a plain object.
 * Useful for JSON-based monitoring dashboards.
 */
export function getTelemetrySnapshot(): Record<string, unknown> {
  const snap = metricsStore.snapshot();
  return {
    uptime_seconds: snap.uptime_seconds,
    memory: {
      heap_used_bytes: process.memoryUsage().heapUsed,
      rss_bytes: process.memoryUsage().rss,
    },
    webhook: snap.webhook,
    openai: snap.openai,
    redis: snap.redis,
    database: snap.database,
    rate_limit_hits: snap.rate_limit_hits,
    abuse_detections: snap.abuse_detections,
  };
}
