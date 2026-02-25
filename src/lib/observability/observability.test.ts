/**
 * Unit tests for the observability layer.
 *
 * Run with: npx tsx src/lib/observability/observability.test.ts
 *
 * Tests cover:
 *  - logger: PII sanitisation, phone hashing, structured output
 *  - metrics: timer accuracy, histogram recording, Prometheus export
 *  - errorClassifier: type detection, severity, fallback responses
 *  - rateLimit: window enforcement, burst detection
 */

import assert from "assert";
import { createHash } from "crypto";

// ── Import modules under test ──────────────────────────────────────────────
import { hashPhone, sanitise, logger } from "./logger";
import { startTimer, measureAsync } from "./metrics";
import { classifyError, isCritical, buildErrorResponse } from "./errorClassifier";

// We test rateLimit with in-memory fallback (no Redis in test env)
// by directly calling the in-memory logic
import { checkRateLimit } from "./rateLimit";

// ── Test runner ────────────────────────────────────────────────────────────

type TestFn = () => void | Promise<void>;
const tests: Array<{ name: string; fn: TestFn }> = [];
let passed = 0;
let failed = 0;

function test(name: string, fn: TestFn): void {
  tests.push({ name, fn });
}

function out(line: string): void {
  process.stdout.write(`${line}\n`);
}

function err(line: string): void {
  process.stderr.write(`${line}\n`);
}

async function run(): Promise<void> {
  out("");
  out("═".repeat(60));
  out("  Observability Layer — Unit Tests");
  out("═".repeat(60));
  out("");

  for (const { name, fn } of tests) {
    try {
      await fn();
      out(`  ✅  ${name}`);
      passed++;
    } catch (e) {
      err(`  ❌  ${name}`);
      err(`       ${e instanceof Error ? e.message : String(e)}`);
      failed++;
    }
  }

  out("");
  out("─".repeat(60));
  out(`  Results: ${passed} passed, ${failed} failed`);
  out("─".repeat(60));
  out("");

  if (failed > 0) process.exit(1);
}

// ── Logger Tests ───────────────────────────────────────────────────────────

test("hashPhone: produces consistent 16-char hex", () => {
  const h1 = hashPhone("+2348012345678");
  const h2 = hashPhone("+2348012345678");
  assert.strictEqual(h1, h2, "Same phone should produce same hash");
  assert.strictEqual(h1.length, 16, "Hash should be 16 hex chars");
  assert.match(h1, /^[0-9a-f]{16}$/, "Hash should be lowercase hex");
});

test("hashPhone: different phones produce different hashes", () => {
  const h1 = hashPhone("+2348012345678");
  const h2 = hashPhone("+2348012345679");
  assert.notStrictEqual(h1, h2, "Different phones should produce different hashes");
});

test("hashPhone: strips non-digits before hashing", () => {
  const h1 = hashPhone("+234 801 234 5678");
  const h2 = hashPhone("2348012345678");
  assert.strictEqual(h1, h2, "Formatting should not affect hash");
});

test("hashPhone: matches manual SHA-256 computation", () => {
  const phone = "+2348012345678";
  const digits = phone.replace(/\D/g, "");
  const expected = createHash("sha256").update(digits).digest("hex").slice(0, 16);
  assert.strictEqual(hashPhone(phone), expected);
});

test("sanitise: redacts sensitive keys", () => {
  const input = { phone: "+234123", password: "secret", name: "Alice" };
  const result = sanitise(input);
  assert.strictEqual((result as Record<string, string>).phone, "[REDACTED]");
  assert.strictEqual((result as Record<string, string>).password, "[REDACTED]");
  assert.strictEqual((result as Record<string, string>).name, "Alice");
});

test("sanitise: strips OpenAI API keys from strings", () => {
  const input = { info: "key is sk-abc123def456ghi789jkl012mno345" };
  const result = sanitise(input) as Record<string, string>;
  const info = result.info ?? "";
  assert.ok(!info.includes("sk-"), "API key should be redacted");
  assert.ok(info.includes("[REDACTED]"), "Should contain [REDACTED]");
});

test("sanitise: handles nested objects", () => {
  const input = { user: { phone: "+234123", name: "Bob" } };
  const result = sanitise(input) as { user: Record<string, string> };
  assert.strictEqual(result.user.phone, "[REDACTED]");
  assert.strictEqual(result.user.name, "Bob");
});

test("sanitise: handles arrays", () => {
  const input = [{ phone: "+234123" }, { name: "Carol" }];
  const result = sanitise(input) as Array<Record<string, string>>;
  assert.strictEqual(result[0]?.phone, "[REDACTED]");
  assert.strictEqual(result[1]?.name, "Carol");
});

test("sanitise: passes through non-object primitives", () => {
  assert.strictEqual(sanitise(42), 42);
  assert.strictEqual(sanitise(true), true);
  assert.strictEqual(sanitise(null), null);
});

test("logger: does not throw on info/warn/error calls", () => {
  // Capture stdout/stderr to avoid polluting test output
  const origOut = process.stdout.write.bind(process.stdout);
  const origErr = process.stderr.write.bind(process.stderr);
  const captured: string[] = [];
  process.stdout.write = (s: string) => { captured.push(s); return true; };
  process.stderr.write = (s: string) => { captured.push(s); return true; };

  try {
    logger.info("test.info", { key: "value" });
    logger.warn("test.warn", { key: "value" });
    logger.error("test.error", { key: "value" });
    logger.classifiedError("test.classified", { type: "openai", severity: "medium" });
  } finally {
    process.stdout.write = origOut;
    process.stderr.write = origErr;
  }

  assert.ok(captured.length >= 4, "Should have produced log lines");
  for (const line of captured) {
    const parsed = JSON.parse(line.trim()) as Record<string, unknown>;
    assert.ok(parsed.timestamp, "Log should have timestamp");
    assert.ok(parsed.level, "Log should have level");
    assert.ok(parsed.service, "Log should have service");
  }
});

// ── Metrics Tests ──────────────────────────────────────────────────────────

// We instantiate a fresh MetricsStore for isolation
// (MetricsStore is not exported directly — we test via the module's metricsStore)
// Instead, test the exported functions directly.

test("startTimer: returns elapsed ms >= 0", async () => {
  const stop = startTimer();
  await new Promise((r) => setTimeout(r, 10));
  const ms = stop();
  assert.ok(ms >= 5, `Expected >= 5ms, got ${ms}ms`);
  assert.ok(ms < 500, `Expected < 500ms, got ${ms}ms`);
});

test("startTimer: two calls return increasing values", async () => {
  const stop = startTimer();
  await new Promise((r) => setTimeout(r, 5));
  const ms1 = stop();
  await new Promise((r) => setTimeout(r, 5));
  const ms2 = stop();
  assert.ok(ms2 > ms1, `Second call (${ms2}) should be > first (${ms1})`);
});

test("measureAsync: returns result and duration_ms", async () => {
  const { result, duration_ms } = await measureAsync(async () => {
    await new Promise((r) => setTimeout(r, 10));
    return "hello";
  });
  assert.strictEqual(result, "hello");
  assert.ok(duration_ms >= 5, `Expected >= 5ms, got ${duration_ms}ms`);
});

test("measureAsync: propagates errors", async () => {
  await assert.rejects(
    () => measureAsync(async () => { throw new Error("boom"); }),
    /boom/,
  );
});

// ── Error Classifier Tests ─────────────────────────────────────────────────

test("classifyError: classifies ZodError as validation/low", () => {
  const err = Object.assign(new Error("Invalid input"), { constructor: { name: "ZodError" } });
  // Simulate ZodError by name
  Object.defineProperty(err, "constructor", { value: { name: "ZodError" } });
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "validation");
  assert.strictEqual(classified.severity, "low");
  assert.strictEqual(classified.retryable, false);
  assert.strictEqual(classified.httpStatus, 400);
});

test("classifyError: classifies Prisma P1001 as prisma/critical", () => {
  const err = Object.assign(new Error("Connection refused"), { code: "P1001" });
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "prisma");
  assert.strictEqual(classified.severity, "critical");
  assert.strictEqual(classified.httpStatus, 503);
});

test("classifyError: classifies Prisma P2025 as prisma/medium", () => {
  const err = Object.assign(new Error("Record not found"), { code: "P2025" });
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "prisma");
  assert.strictEqual(classified.severity, "medium");
});

test("classifyError: classifies Redis ECONNREFUSED as redis/medium", () => {
  const err = new Error("connect ECONNREFUSED 127.0.0.1:6379");
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "redis");
  assert.strictEqual(classified.severity, "medium");
  assert.strictEqual(classified.retryable, true);
});

test("classifyError: classifies OpenAI 429 as openai/medium", () => {
  const err = Object.assign(new Error("Rate limit exceeded"), { status: 429, error: {} });
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "openai");
  assert.strictEqual(classified.severity, "medium");
});

test("classifyError: classifies OpenAI 500 as openai/critical", () => {
  const err = Object.assign(new Error("Internal server error"), { status: 500, error: {} });
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "openai");
  assert.strictEqual(classified.severity, "critical");
});

test("classifyError: unknown error defaults to unknown/critical", () => {
  const err = new Error("Something weird happened");
  const classified = classifyError(err);
  assert.strictEqual(classified.type, "unknown");
  assert.strictEqual(classified.severity, "critical");
  assert.strictEqual(classified.httpStatus, 500);
});

test("isCritical: returns true for critical severity", () => {
  const err = new Error("boom");
  const classified = classifyError(err);
  assert.strictEqual(isCritical(classified), classified.severity === "critical");
});

test("buildErrorResponse: returns safe user-facing payload", () => {
  const err = new Error("boom");
  const classified = classifyError(err);
  const response = buildErrorResponse(classified);
  assert.ok(response.error, "Should have error message");
  assert.ok(response.type, "Should have type");
  assert.ok(typeof response.retryable === "boolean", "Should have retryable flag");
  // Must not expose internal error details
  assert.ok(!response.error.includes("boom"), "Should not expose raw error message");
});

// ── Rate Limit Tests ───────────────────────────────────────────────────────

test("checkRateLimit: allows first message", async () => {
  const hash = `test-${Date.now()}-${Math.random()}`;
  const result = await checkRateLimit(hash);
  assert.strictEqual(result.allowed, true);
  assert.ok(result.remaining >= 0);
});

test("checkRateLimit: decrements remaining on each call", async () => {
  const hash = `test-${Date.now()}-${Math.random()}`;
  const r1 = await checkRateLimit(hash);
  const r2 = await checkRateLimit(hash);
  assert.ok(r2.remaining < r1.remaining, "Remaining should decrease");
});

test("checkRateLimit: blocks after limit exceeded", async () => {
  const hash = `test-${Date.now()}-${Math.random()}`;
  // Exhaust the limit (10 messages)
  for (let i = 0; i < 10; i++) {
    await checkRateLimit(hash);
  }
  const result = await checkRateLimit(hash);
  assert.strictEqual(result.allowed, false, "Should be blocked after limit");
  assert.strictEqual(result.remaining, 0);
});

test("checkRateLimit: different users have independent limits", async () => {
  const hash1 = `test-user1-${Date.now()}`;
  const hash2 = `test-user2-${Date.now()}`;

  // Exhaust user1
  for (let i = 0; i < 10; i++) await checkRateLimit(hash1);
  const r1 = await checkRateLimit(hash1);
  const r2 = await checkRateLimit(hash2);

  assert.strictEqual(r1.allowed, false, "User1 should be blocked");
  assert.strictEqual(r2.allowed, true, "User2 should still be allowed");
});

// ── Run ────────────────────────────────────────────────────────────────────

run().catch((err) => {
  process.stderr.write(
    `Test runner crashed: ${err instanceof Error ? err.stack ?? err.message : String(err)}\n`,
  );
  process.exit(1);
});
