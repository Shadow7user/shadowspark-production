import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRedisClient, pingRedis } from "@/lib/redis";

function getRevisionLabel(): string {
  return (
    process.env.K_REVISION?.trim() ||
    process.env.GOOGLE_CLOUD_REVISION?.trim() ||
    "unknown"
  );
}

export async function GET(): Promise<NextResponse> {
  let databaseOk = false;
  let databaseError: string | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseOk = true;
  } catch (error) {
    databaseError = error instanceof Error ? error.message : "Database unavailable.";
  }

  const redisConfigured = Boolean(getRedisClient());
  let redisOk = !redisConfigured;
  let redisLatencyMs: number | null = null;

  if (redisConfigured) {
    const redisHealth = await pingRedis();
    redisOk = redisHealth.ok;
    redisLatencyMs = redisHealth.latency_ms;
  }

  const isOperational = databaseOk && redisOk;

  return NextResponse.json(
    {
      dependencies: {
        database: {
          error: databaseError,
          ok: databaseOk,
        },
        redis: {
          configured: redisConfigured,
          latency_ms: redisLatencyMs,
          ok: redisOk,
        },
      },
      revision: getRevisionLabel(),
      status: isOperational ? "operational" : "degraded",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
      status: isOperational ? 200 : 503,
    },
  );
}
