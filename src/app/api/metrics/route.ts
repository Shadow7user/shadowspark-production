/**
 * Prometheus Metrics Endpoint
 *
 * GET /api/metrics
 *
 * Protected by METRICS_TOKEN header (Bearer token).
 * Returns Prometheus text format for scraping by Prometheus/Grafana.
 *
 * Example Prometheus scrape config:
 *   - job_name: 'shadowspark'
 *     static_configs:
 *       - targets: ['your-domain.com']
 *     metrics_path: '/api/metrics'
 *     bearer_token: '<METRICS_TOKEN>'
 */

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { generatePrometheusOutput, getTelemetrySnapshot } from "@/lib/observability";

export const dynamic = "force-dynamic";

interface ServiceSnapshot {
  requests_total: number;
  errors_total: number;
  latency: {
    p95_ms: number;
  };
}

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asServiceSnapshot(value: unknown): ServiceSnapshot {
  const obj = (value ?? {}) as Record<string, unknown>;
  const latency = (obj.latency ?? {}) as Record<string, unknown>;

  return {
    requests_total: toNumber(obj.requests_total),
    errors_total: toNumber(obj.errors_total),
    latency: {
      p95_ms: toNumber(latency.p95_ms),
    },
  };
}

function availabilityPct(service: ServiceSnapshot): number {
  if (service.requests_total <= 0) return 100;
  const success = Math.max(0, service.requests_total - service.errors_total);
  return Number(((success / service.requests_total) * 100).toFixed(3));
}

function errorRatePct(service: ServiceSnapshot): number {
  if (service.requests_total <= 0) return 0;
  return Number(((service.errors_total / service.requests_total) * 100).toFixed(3));
}

function buildSloSnapshot(snapshot: Record<string, unknown>): Record<string, unknown> {
  const webhook = asServiceSnapshot(snapshot.webhook);
  const openai = asServiceSnapshot(snapshot.openai);
  const redis = asServiceSnapshot(snapshot.redis);
  const database = asServiceSnapshot(snapshot.database);

  const objectives = {
    webhook_availability_pct: 99.9,
    webhook_p95_ms: 1200,
    openai_error_rate_pct: 2.0,
    redis_error_rate_pct: 1.0,
    database_error_rate_pct: 0.5,
  };

  const current = {
    webhook_availability_pct: availabilityPct(webhook),
    webhook_p95_ms: toNumber(webhook.latency.p95_ms),
    openai_error_rate_pct: errorRatePct(openai),
    redis_error_rate_pct: errorRatePct(redis),
    database_error_rate_pct: errorRatePct(database),
  };

  const status = {
    webhook_availability: current.webhook_availability_pct >= objectives.webhook_availability_pct,
    webhook_latency: current.webhook_p95_ms <= objectives.webhook_p95_ms,
    openai_reliability: current.openai_error_rate_pct <= objectives.openai_error_rate_pct,
    redis_reliability: current.redis_error_rate_pct <= objectives.redis_error_rate_pct,
    database_reliability: current.database_error_rate_pct <= objectives.database_error_rate_pct,
  };

  return { objectives, current, status };
}

function isAuthorized(req: NextRequest): boolean {
  const token = env.metricsToken;

  // If no token is configured, block all access in production
  if (!token) {
    return env.nodeEnv !== "production";
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    return authHeader === `Bearer ${token}`;
  }

  // Also accept as query param for convenience (e.g. Grafana datasource)
  const queryToken = new URL(req.url).searchParams.get("token");
  return queryToken === token;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide Authorization: Bearer <METRICS_TOKEN>" },
      { status: 401 },
    );
  }

  const accept = req.headers.get("accept") ?? "";

  // Return JSON snapshot if client prefers JSON (e.g. dashboards, health checks)
  if (accept.includes("application/json")) {
    const snapshot = getTelemetrySnapshot();
    return NextResponse.json(
      {
        ...snapshot,
        slo: buildSloSnapshot(snapshot),
      },
      { status: 200 },
    );
  }

  // Default: Prometheus text format
  const output = await generatePrometheusOutput();

  return new NextResponse(output, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
