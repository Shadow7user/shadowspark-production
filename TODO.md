# Observability Layer — Implementation Checklist

## Phase 1: Dependencies & Redis Client
- [x] Add `ioredis` to package.json
- [x] Create `src/lib/redis.ts` — Redis client wrapper with graceful fallback

## Phase 2: Observability Core (`src/lib/observability/`)
- [x] Create `src/lib/observability/logger.ts` — Structured JSON logger, PII-safe
- [x] Create `src/lib/observability/metrics.ts` — Latency timers + in-memory store
- [x] Create `src/lib/observability/errorClassifier.ts` — Error type/severity + fallback
- [x] Create `src/lib/observability/rateLimit.ts` — Per-user burst detection (60s window)
- [x] Create `src/lib/observability/telemetry.ts` — Prometheus-ready counters/histograms
- [x] Create `src/lib/observability/index.ts` — Barrel export

## Phase 3: API Routes
- [x] Create `src/app/api/webhook/whatsapp/route.ts` — Full webhook with observability
- [x] Create `src/app/api/health/route.ts` — Enhanced health endpoint
- [x] Create `src/app/api/metrics/route.ts` — Prometheus metrics endpoint (token-protected)

## Phase 4: Modify Existing Files
- [x] Update `src/app/api/stats/route.ts` — Add latency tracking + structured errors
- [x] Created `OBSERVABILITY.md` — Documents all new env vars (REDIS_URL, WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET, METRICS_TOKEN, LOG_LEVEL, SERVICE_NAME)

## Phase 5: Tests
- [x] Create `src/lib/observability/observability.test.ts` — 27/27 unit tests passed

## Phase 6: Verification
- [x] `pnpm install` — ioredis 5.9.3 + @types/ioredis 4.28.10 installed
- [x] `npx tsc --noEmit` — 0 errors in observability files (22 pre-existing errors in unrelated files)
- [x] `npx tsx observability.test.ts` — 27/27 passed
