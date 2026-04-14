import { Firecrawl } from "@mendable/firecrawl-js";

import { requireEnv } from "@/lib/env";

let cached: Firecrawl | null = null;

/**
 * Retrieves a singleton instance of the Firecrawl client.
 * Requires the `FIRECRAWL_API_KEY` environment variable to be set.
 *
 * @returns A configured Firecrawl client instance.
 * @throws {Error} If `FIRECRAWL_API_KEY` is missing from the environment.
 */
export function getFirecrawlClient(): Firecrawl {
  if (cached) return cached;
  cached = new Firecrawl({
    apiKey: requireEnv("FIRECRAWL_API_KEY"),
  });
  return cached;
}

/**
 * Clears the cached Firecrawl instance (useful for testing).
 */
export function clearFirecrawlCache(): void {
  cached = null;
}
