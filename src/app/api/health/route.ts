/**
 * Enhanced Health Endpoint
 *
 * GET /api/health
 *
 * Returns:
 * {
 *   status: "ok" | "degraded" | "down",
 *   redis: "connected" | "disconnected" | "disabled",
 *   database: "connected" | "disconnected",
 *   openai_key_loaded: boolean,
 *   uptime_seconds: number,
 *   version: string,
 *   checks: { ... latencies }
 * }
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pingRedis, getRedisStatus } from "@/lib/redis";
import { startTimer } from "@/lib/observability";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const PROCESS_START = Date.now();

type ServiceStatus = "connected" | "disconnected" | "disabled";
type HealthStatus = "ok" | "degraded" | "down";

interface HealthResponse {
  status: HealthStatus;
  redis: ServiceStatus;
  database: ServiceStatus;
  openai_key_loaded: boolean;
  uptime_seconds: number;
  version: string;
  timestamp: string;
  checks: {
    redis_latency_ms: number | null;
    db_latency_ms: number | null;
  };
}

async function checkDatabase(): Promise<{ status: ServiceStatus; latency_ms: number | null }> {
  const stop = startTimer();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "connected", latency_ms: stop() };
  } catch {
    return { status: "disconnected", latency_ms: null };
  }
}

export async function GET(): Promise<NextResponse> {
  const [dbCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    pingRedis(),
  ]);

  const redisRuntimeStatus = getRedisStatus();
  const redisStatus: ServiceStatus =
    redisRuntimeStatus === "disabled"
      ? "disabled"
      : redisCheck.ok
      ? "connected"
      : "disconnected";
  const openaiKeyLoaded = Boolean(env.openaiApiKey.startsWith("sk-"));

  // Determine overall health status
  let status: HealthStatus = "ok";

  if (dbCheck.status === "disconnected") {
    status = "down"; // DB is critical
  } else if (
    (redisStatus === "disconnected") ||
    !openaiKeyLoaded
  ) {
    status = "degraded"; // Redis/OpenAI are non-critical but degraded
  }

  const body: HealthResponse = {
    status,
    redis: redisStatus,
    database: dbCheck.status,
    openai_key_loaded: openaiKeyLoaded,
    uptime_seconds: Math.floor((Date.now() - PROCESS_START) / 1000),
    version: env.serviceVersion,
    timestamp: new Date().toISOString(),
    checks: {
      redis_latency_ms: redisCheck.latency_ms,
      db_latency_ms: dbCheck.latency_ms,
    },
  };

  const httpStatus = status === "down" ? 503 : 200;

  return NextResponse.json(body, { status: httpStatus });
}
