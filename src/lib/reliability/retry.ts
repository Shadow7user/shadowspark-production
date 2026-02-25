export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  jitter: boolean,
): number {
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  if (!jitter) return exp;
  return Math.floor(exp * (0.75 + Math.random() * 0.5));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions = {},
): Promise<T> {
  const retries = opts.retries ?? 2;
  const baseDelayMs = opts.baseDelayMs ?? 200;
  const maxDelayMs = opts.maxDelayMs ?? 2000;
  const jitter = opts.jitter ?? true;
  const shouldRetry =
    opts.shouldRetry ??
    ((error: unknown) =>
      error instanceof Error &&
      /(timeout|timed out|ECONNRESET|ECONNREFUSED|429|5\d\d)/i.test(
        error.message,
      ));

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const canRetry = attempt <= retries && shouldRetry(error, attempt);
      if (!canRetry) break;
      await sleep(backoffDelay(attempt, baseDelayMs, maxDelayMs, jitter));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Retry operation failed");
}
