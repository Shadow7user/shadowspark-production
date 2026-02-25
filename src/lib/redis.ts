/**
 * Redis client wrapper with graceful fallback.
 * Uses ioredis when REDIS_URL is set; falls back to a no-op stub
 * so the app stays functional without Redis in development.
 */

import Redis from "ioredis";

export type RedisStatus = "connected" | "disconnected" | "disabled";

let _client: Redis | null = null;
let _status: RedisStatus = "disabled";

function createClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  // Upstash endpoints require TLS even when urls are provided as redis://.
  const shouldForceTls =
    /upstash\.io/i.test(url) && url.startsWith("redis://");
  const normalizedUrl = shouldForceTls
    ? url.replace(/^redis:\/\//, "rediss://")
    : url;

  const client = new Redis(normalizedUrl, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5_000,
    lazyConnect: true,
    enableOfflineQueue: false,
    ...(normalizedUrl.startsWith("rediss://") ? { tls: {} } : {}),
  });

  client.on("connect", () => {
    _status = "connected";
  });

  client.on("error", () => {
    _status = "disconnected";
  });

  client.on("close", () => {
    _status = "disconnected";
  });

  return client;
}

// Singleton — reuse across hot-reloads in dev
const globalForRedis = globalThis as unknown as { _redisClient?: Redis | null };

if (!globalForRedis._redisClient) {
  globalForRedis._redisClient = createClient();
}

_client = globalForRedis._redisClient ?? null;

if (_client) {
  // Eagerly connect so health checks work immediately
  _client.connect().catch(() => {
    _status = "disconnected";
  });
}

export function getRedisClient(): Redis | null {
  return _client;
}

export function getRedisStatus(): RedisStatus {
  if (!_client) return "disabled";
  return _status;
}

/**
 * Ping Redis and return latency in ms, or null if unavailable.
 */
export async function pingRedis(): Promise<{ ok: boolean; latency_ms: number | null }> {
  if (!_client) return { ok: false, latency_ms: null };
  const t0 = Date.now();
  try {
    await _client.ping();
    return { ok: true, latency_ms: Date.now() - t0 };
  } catch {
    _status = "disconnected";
    return { ok: false, latency_ms: null };
  }
}

/**
 * Thin wrapper: run a Redis operation and return { result, duration_ms }.
 * Returns { result: null, duration_ms: 0 } when Redis is unavailable.
 */
export async function redisOp<T>(
  fn: (client: Redis) => Promise<T>,
): Promise<{ result: T | null; duration_ms: number }> {
  if (!_client) return { result: null, duration_ms: 0 };
  const t0 = Date.now();
  try {
    const result = await fn(_client);
    return { result, duration_ms: Date.now() - t0 };
  } catch {
    return { result: null, duration_ms: Date.now() - t0 };
  }
}
