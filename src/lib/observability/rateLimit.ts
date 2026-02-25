/**
 * Rate limiting with per-user burst detection.
 *
 * Tracks message frequency per user (by phone hash) and detects
 * abuse patterns within a 60-second sliding window.
 *
 * Uses Redis for persistence when available; falls back to in-memory.
 */

import { getRedisClient, redisOp } from "@/lib/redis";
import type Redis from "ioredis";

// ── Types ──────────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
  isAbuse: boolean;
}

export interface UserActivity {
  messages: number;
  firstMessage: number; // timestamp
  lastMessage: number;
}

// ── Configuration ─────────────────────────────────────────────────────────

const WINDOW_MS = 60_000; // 60 seconds
const MAX_MESSAGES_PER_WINDOW = 10; // Allow 10 messages per minute
const ABUSE_THRESHOLD = 20; // Flag as abuse if >20 messages in window

// In-memory fallback store (survives hot-reloads in dev)
const globalForRateLimit = globalThis as unknown as {
  _inMemoryStore?: Map<string, UserActivity>;
};

if (!globalForRateLimit._inMemoryStore) {
  globalForRateLimit._inMemoryStore = new Map();
}

const inMemoryStore = globalForRateLimit._inMemoryStore;

// ── Redis Keys ─────────────────────────────────────────────────────────────

function userKey(userHash: string): string {
  return `ratelimit:user:${userHash}`;
}

function abuseKey(userHash: string): string {
  return `ratelimit:abuse:${userHash}`;
}

// ── Core Logic ─────────────────────────────────────────────────────────────

function checkRateLimitInMemory(userHash: string, now: number): RateLimitResult {
  const windowStart = now - WINDOW_MS;
  let activity = inMemoryStore.get(userHash);

  if (!activity || activity.firstMessage < windowStart) {
    activity = { messages: 0, firstMessage: now, lastMessage: now };
  }

  // Mirror Redis path semantics: every request increments the counter.
  activity.messages += 1;
  activity.lastMessage = now;
  if (activity.messages === 1) {
    activity.firstMessage = now;
  }
  inMemoryStore.set(userHash, activity);

  const allowed = activity.messages <= MAX_MESSAGES_PER_WINDOW;
  const isAbuse = activity.messages > ABUSE_THRESHOLD;
  const elapsedMs = now - activity.firstMessage;

  return {
    allowed,
    remaining: Math.max(0, MAX_MESSAGES_PER_WINDOW - activity.messages),
    resetInMs: Math.max(0, WINDOW_MS - elapsedMs),
    isAbuse,
  };
}

/**
 * Check if a user is rate-limited and detect abuse patterns.
 */
export async function checkRateLimit(userHash: string): Promise<RateLimitResult> {
  const now = Date.now();
  const windowSeconds = Math.ceil(WINDOW_MS / 1000);

  const redis = getRedisClient();

  if (redis) {
    // Redis-backed rate limiting with atomic increments.
    const { result } = await redisOp(async (client) => {
      const key = userKey(userHash);
      const count = await client.incr(key);

      // Ensure the counter key always has a rolling TTL.
      if (count === 1) {
        await client.expire(key, windowSeconds);
      } else {
        const ttl = await client.pttl(key);
        if (ttl < 0) {
          await client.expire(key, windowSeconds);
        }
      }

      const allowed = count <= MAX_MESSAGES_PER_WINDOW;
      const isAbuse = count > ABUSE_THRESHOLD;

      if (isAbuse) {
        await client.setex(abuseKey(userHash), 3600, "1"); // Flag for 1 hour
      }

      const resetMs = await client.pttl(key);

      return {
        allowed,
        remaining: Math.max(0, MAX_MESSAGES_PER_WINDOW - count),
        resetInMs: resetMs > 0 ? resetMs : WINDOW_MS,
        isAbuse,
      };
    });

    if (result) {
      return result;
    }
  }

  // In-memory fallback when Redis is disabled or temporarily unavailable.
  return checkRateLimitInMemory(userHash, now);
}

async function countKeysByScan(
  client: Redis,
  pattern: string,
): Promise<number> {
  let cursor = "0";
  let total = 0;

  do {
    const [nextCursor, keys] = await client.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      "200",
    );
    total += keys.length;
    cursor = nextCursor;
  } while (cursor !== "0");

  return total;
}

/**
 * Get abuse detection stats for monitoring.
 */
export async function getAbuseStats(): Promise<{ flaggedUsers: number; totalChecks: number }> {
  const redis = getRedisClient();

  if (redis) {
    const { result } = await redisOp(async (client) => {
      const flaggedUsers = await countKeysByScan(client, "ratelimit:abuse:*");
      return { flaggedUsers, totalChecks: 0 }; // totalChecks would need a counter
    });
    return result ?? { flaggedUsers: 0, totalChecks: 0 };
  } else {
    // In-memory: count users with high message counts
    let flagged = 0;
    for (const activity of inMemoryStore.values()) {
      if (activity.messages >= ABUSE_THRESHOLD) flagged++;
    }
    return { flaggedUsers: flagged, totalChecks: inMemoryStore.size };
  }
}
