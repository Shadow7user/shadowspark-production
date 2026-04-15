#!/usr/bin/env bash
set -euo pipefail

: "${REDIS_URL:?REDIS_URL is required}"

node --input-type=module - <<'NODE'
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
try {
  const pong = await redis.ping();
  if (pong !== "PONG") {
    console.error(`Unexpected ping response: ${pong}`);
    process.exit(1);
  }
  console.log("Redis OK");
  process.exit(0);
} catch (e) {
  console.error("Redis check failed:", e instanceof Error ? e.message : String(e));
  process.exit(1);
} finally {
  redis.disconnect();
}
NODE

