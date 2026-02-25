# Observability Layer — Setup & Reference

## New Environment Variables

Add these to your `.env` / Railway / Vercel environment:

```bash
# ── Redis (optional but recommended) ──────────────────────────────────────
# When set, enables Redis-backed rate limiting and job queuing.
# Without it, the app falls back to in-memory rate limiting.
REDIS_URL="redis://localhost:6379"
# or for Redis Cloud / Upstash:
# REDIS_URL="rediss://:<password>@<host>:<port>"

# ── OpenAI ────────────────────────────────────────────────────────────────
OPENAI_API_KEY="sk-..."

# ── WhatsApp Business API ─────────────────────────────────────────────────
# The token you set in Meta Developer Console → Webhooks → Verify Token
WHATSAPP_VERIFY_TOKEN="your-random-verify-token"

# The App Secret from Meta Developer Console → App Settings → Basic
# Used to verify X-Hub-Signature-256 on every inbound webhook
WHATSAPP_APP_SECRET="your-meta-app-secret"

# ── Observability ─────────────────────────────────────────────────────────
# Protects GET /api/metrics (Prometheus scrape endpoint)
METRICS_TOKEN="your-random-metrics-token"

# Log level: debug | info | warn | error  (default: info)
LOG_LEVEL="info"

# Service name tag in structured logs (default: shadowspark-platform)
SERVICE_NAME="shadowspark-platform"
```

---

## New API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/api/health` | Enhanced health check (Redis, DB, OpenAI key, uptime) |
| `GET`  | `/api/metrics` | Prometheus text format (requires `Authorization: Bearer <METRICS_TOKEN>`) |
| `GET`  | `/api/webhook/whatsapp` | Meta webhook verification challenge |
| `POST` | `/api/webhook/whatsapp` | Inbound WhatsApp message processing |

---

## Health Endpoint Response

```json
{
  "status": "ok",
  "redis": "connected",
  "database": "connected",
  "openai_key_loaded": true,
  "uptime_seconds": 1234,
  "version": "0.1.0",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "checks": {
    "redis_latency_ms": 2,
    "db_latency_ms": 8
  }
}
```

**Status values:**
- `ok` — all systems nominal
- `degraded` — Redis or OpenAI unavailable (non-critical)
- `down` — database unreachable (returns HTTP 503)

---

## Webhook Log Format

Every inbound WhatsApp message produces a structured NDJSON log line:

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "info",
  "service": "shadowspark-platform",
  "message": "webhook.processed",
  "mode": "technical",
  "user_hash": "a3f8c2d1e4b5f6a7",
  "latency_ms": 124,
  "openai_ms": 89,
  "redis_ms": 12,
  "db_ms": 8,
  "response_status": 200
}
```

**PII guarantees:**
- `user_hash` = first 16 hex chars of `SHA-256(phone_digits)` — never reversible
- Raw phone numbers, API keys, and message content are **never** logged

---

## Error Log Format

```json
{
  "timestamp": "2025-01-01T00:00:00.000Z",
  "level": "error",
  "service": "shadowspark-platform",
  "message": "webhook.openai_failed",
  "error_type": "openai",
  "error_severity": "medium",
  "error_name": "APIError",
  "error_message": "Rate limit exceeded",
  "user_hash": "a3f8c2d1e4b5f6a7",
  "mode": "technical"
}
```

**Error types:** `validation` | `openai` | `redis` | `prisma` | `unknown`  
**Severity:** `low` | `medium` | `critical`

---

## Rate Limiting

- **Window:** 60 seconds (sliding)
- **Limit:** 10 messages per user per window
- **Abuse threshold:** 20+ messages → flagged, logged, Redis-blocked for 1 hour
- **Response on limit:** HTTP 429 with `Retry-After` header

---

## Prometheus / Grafana Integration

### Scrape config (`prometheus.yml`)

```yaml
scrape_configs:
  - job_name: 'shadowspark'
    static_configs:
      - targets: ['your-domain.com']
    metrics_path: '/api/metrics'
    scheme: https
    authorization:
      credentials: '<METRICS_TOKEN>'
    scrape_interval: 15s
```

### Available Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `process_uptime_seconds` | Gauge | Process uptime |
| `process_memory_heap_used_bytes` | Gauge | Heap memory |
| `webhook_requests_total` | Counter | Total webhook requests |
| `webhook_errors_total` | Counter | Total webhook errors |
| `openai_requests_total` | Counter | Total OpenAI calls |
| `openai_errors_total` | Counter | Total OpenAI errors |
| `rate_limit_hits_total` | Counter | Rate limit hits |
| `abuse_detections_total` | Counter | Abuse detections |
| `requests_total{service}` | Counter | Per-service request counts |
| `errors_total{service}` | Counter | Per-service error counts |
| `latency_p50_ms{service}` | Gauge | P50 latency per service |
| `latency_p95_ms{service}` | Gauge | P95 latency per service |
| `latency_p99_ms{service}` | Gauge | P99 latency per service |
| `latency_bucket{service,le}` | Histogram | Latency distribution buckets |

---

## Files Modified / Created

### New Files
| File | Purpose |
|------|---------|
| `src/lib/redis.ts` | ioredis client with graceful fallback |
| `src/lib/observability/logger.ts` | Structured JSON logger, PII-safe |
| `src/lib/observability/metrics.ts` | Latency timers + in-memory store |
| `src/lib/observability/errorClassifier.ts` | Error type/severity + fallback responses |
| `src/lib/observability/rateLimit.ts` | Per-user burst detection (60s window) |
| `src/lib/observability/telemetry.ts` | Prometheus-ready counters/histograms |
| `src/lib/observability/index.ts` | Barrel export |
| `src/app/api/webhook/whatsapp/route.ts` | WhatsApp webhook with full observability |
| `src/app/api/health/route.ts` | Enhanced health endpoint |
| `src/app/api/metrics/route.ts` | Prometheus metrics endpoint |
| `src/lib/observability/observability.test.ts` | Unit tests |

### Modified Files
| File | Change |
|------|--------|
| `src/app/api/stats/route.ts` | Added `measureAsync`, structured error logging |
| `package.json` | Added `ioredis` + `@types/ioredis` |
