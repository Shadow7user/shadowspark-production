/**
 * Latency tracking utilities + in-memory metrics store.
 *
 * Provides:
 *  - startTimer()      — high-resolution wall-clock timer
 *  - measureAsync()    — wraps an async fn and returns { result, duration_ms }
 *  - MetricsStore      — singleton accumulator for Prometheus export
 */

// ── Timer ──────────────────────────────────────────────────────────────────

/**
 * Returns a function that, when called, returns elapsed milliseconds.
 *
 * @example
 * const stop = startTimer();
 * await doWork();
 * const ms = stop(); // e.g. 124
 */
export function startTimer(): () => number {
  const start = Date.now();
  return () => Date.now() - start;
}

/**
 * Wraps an async function, measuring its wall-clock duration.
 *
 * @example
 * const { result, duration_ms } = await measureAsync(() => openai.chat(...));
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; duration_ms: number }> {
  const stop = startTimer();
  const result = await fn();
  return { result, duration_ms: stop() };
}

// ── In-memory Metrics Store ────────────────────────────────────────────────

export interface LatencyHistogram {
  count: number;
  sum_ms: number;
  min_ms: number;
  max_ms: number;
  p50_ms: number;   // approximate — updated via exponential moving average
  p95_ms: number;
  p99_ms: number;
  buckets: Record<string, number>; // "<= Xms" → count
}

export interface ServiceMetrics {
  requests_total: number;
  errors_total: number;
  latency: LatencyHistogram;
}

export interface MetricsSnapshot {
  uptime_seconds: number;
  webhook: ServiceMetrics;
  openai: ServiceMetrics;
  redis: ServiceMetrics;
  database: ServiceMetrics;
  rate_limit_hits: number;
  abuse_detections: number;
}

// Histogram bucket boundaries in ms
const BUCKETS_MS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

function emptyHistogram(): LatencyHistogram {
  const buckets: Record<string, number> = {};
  for (const b of BUCKETS_MS) buckets[`le_${b}`] = 0;
  buckets["le_inf"] = 0;
  return { count: 0, sum_ms: 0, min_ms: Infinity, max_ms: 0, p50_ms: 0, p95_ms: 0, p99_ms: 0, buckets };
}

function emptyServiceMetrics(): ServiceMetrics {
  return { requests_total: 0, errors_total: 0, latency: emptyHistogram() };
}

class MetricsStore {
  private readonly startedAt = Date.now();
  private data: Omit<MetricsSnapshot, "uptime_seconds"> = {
    webhook:  emptyServiceMetrics(),
    openai:   emptyServiceMetrics(),
    redis:    emptyServiceMetrics(),
    database: emptyServiceMetrics(),
    rate_limit_hits: 0,
    abuse_detections: 0,
  };

  // EMA smoothing factor for percentile approximation
  private readonly alpha = 0.1;

  private recordLatency(hist: LatencyHistogram, ms: number): void {
    hist.count++;
    hist.sum_ms += ms;
    hist.min_ms = Math.min(hist.min_ms, ms);
    hist.max_ms = Math.max(hist.max_ms, ms);

    // Exponential moving average approximation for percentiles
    hist.p50_ms = hist.count === 1 ? ms : hist.p50_ms * (1 - this.alpha) + ms * this.alpha;
    // p95 / p99 are approximated by weighting high values more
    if (ms > hist.p95_ms) hist.p95_ms = hist.p95_ms * 0.95 + ms * 0.05;
    if (ms > hist.p99_ms) hist.p99_ms = hist.p99_ms * 0.99 + ms * 0.01;

    // Bucket counts
    let placed = false;
    for (const b of BUCKETS_MS) {
      if (ms <= b) {
        hist.buckets[`le_${b}`] = (hist.buckets[`le_${b}`] ?? 0) + 1;
        placed = true;
        break;
      }
    }
    if (!placed) hist.buckets["le_inf"] = (hist.buckets["le_inf"] ?? 0) + 1;
  }

  record(
    service: keyof Pick<MetricsSnapshot, "webhook" | "openai" | "redis" | "database">,
    opts: { duration_ms: number; error?: boolean },
  ): void {
    const svc = this.data[service];
    svc.requests_total++;
    if (opts.error) svc.errors_total++;
    this.recordLatency(svc.latency, opts.duration_ms);
  }

  incrementRateLimit(): void {
    this.data.rate_limit_hits++;
  }

  incrementAbuseDetection(): void {
    this.data.abuse_detections++;
  }

  snapshot(): MetricsSnapshot {
    return {
      uptime_seconds: Math.floor((Date.now() - this.startedAt) / 1000),
      ...this.data,
    };
  }

  /** Prometheus text format export */
  toPrometheusText(): string {
    const snap = this.snapshot();
    const lines: string[] = [];

    const push = (name: string, value: number, labels = "") =>
      lines.push(`${name}${labels ? `{${labels}}` : ""} ${value}`);

    push("process_uptime_seconds", snap.uptime_seconds);
    push("rate_limit_hits_total", snap.rate_limit_hits);
    push("abuse_detections_total", snap.abuse_detections);

    for (const svc of ["webhook", "openai", "redis", "database"] as const) {
      const m = snap[svc];
      const l = `service="${svc}"`;
      push("requests_total",       m.requests_total,       l);
      push("errors_total",         m.errors_total,         l);
      push("latency_sum_ms",       m.latency.sum_ms,       l);
      push("latency_count",        m.latency.count,        l);
      push("latency_min_ms",       m.latency.min_ms === Infinity ? 0 : m.latency.min_ms, l);
      push("latency_max_ms",       m.latency.max_ms,       l);
      push("latency_p50_ms",       m.latency.p50_ms,       l);
      push("latency_p95_ms",       m.latency.p95_ms,       l);
      push("latency_p99_ms",       m.latency.p99_ms,       l);

      for (const [bucket, count] of Object.entries(m.latency.buckets)) {
        push("latency_bucket", count, `service="${svc}",le="${bucket}"`);
      }
    }

    return lines.join("\n") + "\n";
  }
}

// Singleton — survives hot-reloads in dev
const globalForMetrics = globalThis as unknown as { _metricsStore?: MetricsStore };
if (!globalForMetrics._metricsStore) {
  globalForMetrics._metricsStore = new MetricsStore();
}

export const metricsStore = globalForMetrics._metricsStore;
