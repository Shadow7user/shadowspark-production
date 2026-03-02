/**
 * WhatsApp Business API Webhook
 *
 * Handles:
 *  - GET  /api/webhook/whatsapp  — Meta verification challenge
 *  - POST /api/webhook/whatsapp  — Inbound message processing
 *
 * Observability:
 *  - Full request latency tracking (webhook, openai, redis, db)
 *  - Structured JSON logging (no PII — phone hashed, content redacted)
 *  - Error classification with auto-fallback responses
 *  - Per-user rate limiting with 60s burst detection
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { redisOp } from "@/lib/redis";
import { withRetry } from "@/lib/reliability/retry";
import {
  CircuitBreaker,
  CircuitBreakerOpenError,
} from "@/lib/reliability/circuitBreaker";
import { env } from "@/lib/env";
import {
  logger,
  hashPhone,
  startTimer,
  measureAsync,
  metricsStore,
  classifyError,
  isCritical,
  buildErrorResponse,
  checkRateLimit,
} from "@/lib/observability";

// ── OpenAI Client ──────────────────────────────────────────────────────────

const openai = env.openaiApiKey
  ? new OpenAI({ apiKey: env.openaiApiKey })
  : null;

const globalForWebhookReliability = globalThis as unknown as {
  _openaiBreaker?: CircuitBreaker;
  _redisBreaker?: CircuitBreaker;
};

if (!globalForWebhookReliability._openaiBreaker) {
  globalForWebhookReliability._openaiBreaker = new CircuitBreaker({
    failureThreshold: 4,
    resetTimeoutMs: 20_000,
  });
}

if (!globalForWebhookReliability._redisBreaker) {
  globalForWebhookReliability._redisBreaker = new CircuitBreaker({
    failureThreshold: 4,
    resetTimeoutMs: 10_000,
  });
}

const openaiBreaker = globalForWebhookReliability._openaiBreaker!;
const redisBreaker = globalForWebhookReliability._redisBreaker!;

function isRetryableByClassifier(error: unknown): boolean {
  return classifyError(error).retryable;
}

// ── Mode Detection ─────────────────────────────────────────────────────────

type MessageMode =
  | "technical"
  | "audit"
  | "enterprise"
  | "sme"
  | "sales"
  | "confused"
  | "default";

const MODE_KEYWORDS: Record<MessageMode, string[]> = {
  technical:  ["technical", "api", "integration", "code", "developer", "sdk"],
  audit:      ["audit", "compliance", "gdpr", "ndpr", "security", "report"],
  enterprise: ["enterprise", "company", "scale", "production", "contract"],
  sme:        ["small", "startup", "affordable", "budget", "cheap"],
  sales:      ["price", "cost", "demo", "show me", "how much", "pricing"],
  confused:   ["confused", "explain", "how does", "not understand", "help"],
  default:    [],
};

function detectMode(text: string): MessageMode {
  const lower = text.toLowerCase();
  for (const [mode, keywords] of Object.entries(MODE_KEYWORDS) as [MessageMode, string[]][]) {
    if (mode === "default") continue;
    if (keywords.some((kw) => lower.includes(kw))) return mode;
  }
  return "default";
}

// ── Signature Verification ─────────────────────────────────────────────────

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = env.whatsappAppSecret;
  if (!secret) {
    logger.warn("WHATSAPP_APP_SECRET not set — skipping signature verification");
    return true; // Allow in dev; enforce in production via env check
  }
  if (!signature) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const sigHex = signature.replace(/^sha256=/, "");

  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(sigHex, "hex"),
    );
  } catch {
    return false;
  }
}

// ── WhatsApp Message Types ─────────────────────────────────────────────────

interface WhatsAppTextMessage {
  from: string;
  id: string;
  timestamp: string;
  type: "text";
  text: { body: string };
}

interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: { display_phone_number: string; phone_number_id: string };
      messages?: WhatsAppTextMessage[];
      statuses?: unknown[];
    };
    field: string;
  }>;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

// ── GET — Meta Verification Challenge ─────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.whatsappVerifyToken) {
    logger.info("webhook.verified", { mode: "subscribe" });
    return new NextResponse(challenge, { status: 200 });
  }

  logger.warn("webhook.verification_failed", { mode, token_match: false });
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// ── POST — Inbound Message Processing ─────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const webhookTimer = startTimer();

  // ── 1. Read & verify body ────────────────────────────────────────────────
  let rawBody: string;
  let payload: WhatsAppWebhookPayload;

  try {
    rawBody = await req.text();
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch (err) {
    const classified = classifyError(err);
    logger.classifiedError("webhook.parse_failed", {
      type: "validation",
      severity: "low",
      error: err,
    });
    metricsStore.record("webhook", { duration_ms: webhookTimer(), error: true });
    return NextResponse.json(buildErrorResponse(classified), { status: 400 });
  }

  const signature = req.headers.get("x-hub-signature-256");
  if (!verifySignature(rawBody, signature)) {
    logger.warn("webhook.signature_invalid");
    metricsStore.record("webhook", { duration_ms: webhookTimer(), error: true });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Extract message ───────────────────────────────────────────────────
  if (payload.object !== "whatsapp_business_account") {
    return NextResponse.json({ status: "ignored" }, { status: 200 });
  }

  const messages = payload.entry
    .flatMap((e) => e.changes)
    .flatMap((c) => c.value.messages ?? [])
    .filter((m): m is WhatsAppTextMessage => m.type === "text");

  if (messages.length === 0) {
    // Status updates, read receipts, etc. — acknowledge silently
    return NextResponse.json({ status: "ok" }, { status: 200 });
  }

  // Process first message (queue-based systems would fan out here)
  const msg = messages[0]!;
  const userHash = hashPhone(msg.from);
  const mode = detectMode(msg.text.body);

  // Best-effort idempotency guard for duplicated webhook retries.
  const { result: dedupeResult } = await redisOp(async (client) => {
    const setResult = await client.set(
      `whatsapp:dedupe:${msg.id}`,
      "1",
      "EX",
      300,
      "NX",
    );
    return { setResult };
  });
  if (dedupeResult?.setResult === null) {
    logger.info("webhook.duplicate_ignored", {
      user_hash: userHash,
      mode,
      message_id: msg.id,
    });
    return NextResponse.json({ status: "duplicate" }, { status: 200 });
  }

  // ── 3. Rate limiting ─────────────────────────────────────────────────────
  const rateLimit = await checkRateLimit(`wa:${userHash}`);

  if (!rateLimit.allowed) {
    if (rateLimit.isAbuse) {
      metricsStore.incrementAbuseDetection();
      logger.warn("webhook.abuse_detected", {
        user_hash: userHash,
        mode,
        reset_in_ms: rateLimit.resetInMs,
      });
    } else {
      metricsStore.incrementRateLimit();
      logger.info("webhook.rate_limited", {
        user_hash: userHash,
        mode,
        remaining: rateLimit.remaining,
        reset_in_ms: rateLimit.resetInMs,
      });
    }

    metricsStore.record("webhook", { duration_ms: webhookTimer(), error: false });
    return NextResponse.json(
      { error: "Too many messages. Please wait before sending again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.resetInMs / 1000)),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  // ── 4. Database — persist message ────────────────────────────────────────
  let dbMs = 0;
  const dbTimer = startTimer();
  try {
    const { duration_ms } = await measureAsync(async () => {
      // Upsert conversation by phone hash (no raw phone stored)
      await prisma.$executeRaw`
        INSERT INTO messages (id, content, created_at)
        VALUES (gen_random_uuid(), '[REDACTED]', NOW())
        ON CONFLICT DO NOTHING
      `;
    });
    dbMs = duration_ms;
    metricsStore.record("database", { duration_ms, error: false });
  } catch (err) {
    const classified = classifyError(err);
    dbMs = dbTimer();
    metricsStore.record("database", { duration_ms: dbMs, error: true });
    logger.classifiedError("webhook.db_write_failed", {
      type: classified.type,
      severity: classified.severity,
      error: err,
      meta: { user_hash: userHash, mode },
    });
    // Non-critical: continue processing even if DB write fails
  }

  // ── 5. Redis — queue job ─────────────────────────────────────────────────
  let redisMs = 0;
  const redisTimer = startTimer();
  try {
    const { duration_ms } = await measureAsync(async () => {
      await redisBreaker.execute(async () => {
        await withRetry(
          async () => {
            const { result } = await redisOp(async (client) => {
              await client.lpush(
                "whatsapp:queue",
                JSON.stringify({ userHash, mode, timestamp: Date.now() }),
              );
              return true;
            });

            if (!result) {
              throw new Error("Redis queue unavailable");
            }
          },
          {
            retries: 1,
            baseDelayMs: 120,
            shouldRetry: isRetryableByClassifier,
          },
        );
      });
    });
    redisMs = duration_ms;
    metricsStore.record("redis", { duration_ms, error: false });
  } catch (err) {
    redisMs = redisTimer();
    metricsStore.record("redis", { duration_ms: redisMs, error: true });
    if (err instanceof CircuitBreakerOpenError) {
      logger.warn("webhook.redis_circuit_open", {
        user_hash: userHash,
        mode,
      });
    } else {
      const classified = classifyError(err);
      logger.classifiedError("webhook.redis_enqueue_failed", {
        type: classified.type,
        severity: classified.severity,
        error: err,
        meta: { user_hash: userHash, mode },
      });
    }
    // Non-critical: continue to OpenAI even if Redis is down
  }

  // ── 6. OpenAI — generate response ────────────────────────────────────────
  let openaiMs = 0;
  let aiResponse = "Thank you for your message. We'll get back to you shortly.";

  if (openai) {
    const openaiTimer = startTimer();
    try {
      const { result, duration_ms } = await measureAsync(async () => {
        return openaiBreaker.execute(async () => {
          return withRetry(
            async () => {
              const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                max_tokens: 300,
                temperature: 0.65,
                messages: [
                  {
                    role: "system",
                    content: `You are a helpful WhatsApp assistant for ShadowSpark Technologies. Mode: ${mode}. Be concise and professional.`,
                  },
                  {
                    role: "user",
                    // We pass the message content to OpenAI but never log it
                    content: msg.text.body,
                  },
                ],
              });
              const content = completion.choices[0]?.message?.content?.trim();
              if (!content) {
                throw new Error("Empty OpenAI completion");
              }
              return content;
            },
            {
              retries: 2,
              baseDelayMs: 250,
              shouldRetry: isRetryableByClassifier,
            },
          );
        });
      });

      openaiMs = duration_ms;
      aiResponse = result;
      metricsStore.record("openai", { duration_ms, error: false });
    } catch (err) {
      openaiMs = openaiTimer();
      metricsStore.record("openai", { duration_ms: openaiMs, error: true });
      if (err instanceof CircuitBreakerOpenError) {
        aiResponse = "We're experiencing high load. Please try again shortly.";
        logger.warn("webhook.openai_circuit_open", {
          user_hash: userHash,
          mode,
        });
      } else {
        const classified = classifyError(err);
        logger.classifiedError("webhook.openai_failed", {
          type: classified.type,
          severity: classified.severity,
          error: err,
          meta: { user_hash: userHash, mode },
        });

        if (isCritical(classified)) {
          aiResponse = classified.fallbackResponse;
        }
      }
    }
  }

  // ── 7. Send outbound reply via Meta Messages API ────────────────────────
  // Route sales-intent messages to the sales number; everything else to support.
  const salesModes: MessageMode[] = ["sales", "sme", "enterprise"];
  const phoneNumberId = salesModes.includes(mode)
    ? (env.waPhoneNumberIdSales || env.waPhoneNumberIdSupport)
    : (env.waPhoneNumberIdSupport || env.waPhoneNumberIdSales);

  if (phoneNumberId && env.whatsappAccessToken) {
    try {
      const metaRes = await fetch(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.whatsappAccessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: msg.from,
            type: "text",
            text: { body: aiResponse },
          }),
        },
      );
      if (!metaRes.ok) {
        logger.warn("webhook.meta_reply_failed", {
          user_hash: userHash,
          mode,
          status: metaRes.status,
        });
      }
    } catch (err) {
      logger.warn("webhook.meta_reply_error", {
        user_hash: userHash,
        mode,
        error: err instanceof Error ? err.message : String(err),
      });
      // Non-critical — continue to final log
    }
  }

  // ── 8. Final latency log ─────────────────────────────────────────────────
  const totalMs = webhookTimer();
  metricsStore.record("webhook", { duration_ms: totalMs, error: false });

  logger.webhook({
    service: "webhook",
    mode,
    user_hash: userHash,
    latency_ms: totalMs,
    openai_ms: openaiMs,
    redis_ms: redisMs,
    db_ms: dbMs,
    response_status: 200,
  });

  return NextResponse.json(
    {
      status: "ok",
      response: aiResponse,
      meta: {
        mode,
        latency_ms: totalMs,
      },
    },
    { status: 200 },
  );
}
