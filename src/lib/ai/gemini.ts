import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { hardenSystemPrompt } from "@/lib/security";

export const GEMINI_3_FLASH_MODEL = "gemini-3-flash-preview";

const GEMINI_2_FLASH_MODEL = "gemini-2.0-flash";
const CACHE_DISPLAY_NAME = "shadowweaver-v2-master-prompt-springbank-r20";
const CACHE_TTL = "86400s";
const CACHE_REFRESH_WINDOW_MS = 5 * 60 * 1000;
const DEFAULT_PROJECT_ID = "shadowspark-production-489115";
const DEFAULT_LOCATION = "global";

const SHADOWWEAVER_V2_MASTER_PROMPT = hardenSystemPrompt(
  [
    "You are Shadowweaver v2 inside ShadowSpark Technologies.",
    "Operate like a senior strategic operator and performance architect.",
    "Stay tactical, controlled, commercially useful, and measured.",
    "Do not invent facts, competitors, market signals, or product capabilities.",
    "If exact local competitors are uncertain, use truthful category-level archetypes tied to the location.",
    "Keep language premium, concise, execution-oriented, and grounded in the supplied context.",
    "When structured output is requested, return only the requested structure and never add markdown fences.",
  ].join("\n"),
);

type ContextCacheHandle = {
  expireAt: number;
  name: string | null;
};

type GlobalGeminiState = {
  shadowweaverContextCache: ContextCacheHandle | undefined;
  shadowweaverContextCachePromise: Promise<ContextCacheHandle> | undefined;
  shadowweaverVertexClient: GoogleGenAI | undefined;
};

export type GenerateGeminiTextOptions = {
  maxOutputTokens?: number;
  model?: string;
  prompt: string;
  useCachedContext?: boolean;
};

const globalForGemini = globalThis as typeof globalThis & GlobalGeminiState;

function getProjectId(): string {
  return (
    process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
    process.env.GCLOUD_PROJECT?.trim() ||
    process.env.GCP_PROJECT?.trim() ||
    DEFAULT_PROJECT_ID
  );
}

function getLocation(): string {
  return (
    process.env.GOOGLE_CLOUD_LOCATION?.trim() ||
    process.env.VERTEX_AI_LOCATION?.trim() ||
    process.env.GEMINI_VERTEX_LOCATION?.trim() ||
    DEFAULT_LOCATION
  );
}

function getGeminiClient(): GoogleGenAI {
  if (!globalForGemini.shadowweaverVertexClient) {
    globalForGemini.shadowweaverVertexClient = new GoogleGenAI({
      vertexai: true,
      project: getProjectId(),
      location: getLocation(),
    });
  }

  return globalForGemini.shadowweaverVertexClient;
}

function getContextFilePath(): string {
  return path.join(
    process.cwd(),
    "src",
    "lib",
    "ai",
    "context",
    "springbank-documentation.md",
  );
}

function buildPrompt(prompt: string): string {
  return [prompt.trim(), "", "Return only the requested output."].join("\n");
}

function parseExpireTime(value: Date | string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

async function loadSpringBankDocumentation(): Promise<string> {
  return readFile(getContextFilePath(), "utf8");
}

function isCacheReusable(handle: ContextCacheHandle | undefined): handle is ContextCacheHandle {
  return Boolean(
    handle?.name &&
      handle.expireAt > Date.now() + CACHE_REFRESH_WINDOW_MS,
  );
}

async function findExistingContextCache(): Promise<ContextCacheHandle | null> {
  const client = getGeminiClient();
  const pager = await client.caches.list({ config: { pageSize: 20 } });

  for await (const cache of pager) {
    if (cache.displayName !== CACHE_DISPLAY_NAME || !cache.name) {
      continue;
    }

    const expireAt = parseExpireTime(cache.expireTime);

    if (expireAt > Date.now() + CACHE_REFRESH_WINDOW_MS) {
      return { name: cache.name, expireAt };
    }

    const updatedCache = await client.caches.update({
      name: cache.name,
      config: { ttl: CACHE_TTL },
    });

    return {
      name: updatedCache.name ?? cache.name,
      expireAt: parseExpireTime(updatedCache.expireTime),
    };
  }

  return null;
}

async function createContextCache(): Promise<ContextCacheHandle> {
  const client = getGeminiClient();
  const springBankDocumentation = await loadSpringBankDocumentation();
  const cache = await client.caches.create({
    model: GEMINI_3_FLASH_MODEL,
    config: {
      displayName: CACHE_DISPLAY_NAME,
      ttl: CACHE_TTL,
      systemInstruction: SHADOWWEAVER_V2_MASTER_PROMPT,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: [
                "Reference documentation: SpringBank banking-grade demo foundation.",
                "",
                springBankDocumentation,
              ].join("\n"),
            },
          ],
        },
      ],
    },
  });

  return {
    name: cache.name ?? null,
    expireAt: parseExpireTime(cache.expireTime),
  };
}

async function resolveContextCache(): Promise<ContextCacheHandle> {
  if (isCacheReusable(globalForGemini.shadowweaverContextCache)) {
    return globalForGemini.shadowweaverContextCache;
  }

  if (!globalForGemini.shadowweaverContextCachePromise) {
    globalForGemini.shadowweaverContextCachePromise = (async () => {
      const existingCache = await findExistingContextCache();
      const handle = existingCache ?? (await createContextCache());
      globalForGemini.shadowweaverContextCache = handle;
      globalForGemini.shadowweaverContextCachePromise = undefined;
      return handle;
    })().catch((error: unknown) => {
      globalForGemini.shadowweaverContextCachePromise = undefined;
      throw error;
    });
  }

  return globalForGemini.shadowweaverContextCachePromise;
}

export async function generateGeminiText({
  maxOutputTokens,
  model = GEMINI_3_FLASH_MODEL,
  prompt,
  useCachedContext = model === GEMINI_3_FLASH_MODEL,
}: GenerateGeminiTextOptions): Promise<string> {
  const client = getGeminiClient();
  const cacheHandle = useCachedContext ? await resolveContextCache() : null;
  const response = await client.models.generateContent({
    model,
    contents: buildPrompt(prompt),
    config: {
      ...(cacheHandle?.name ? { cachedContent: cacheHandle.name } : {}),
      ...(maxOutputTokens ? { maxOutputTokens } : {}),
    },
  });

  return response.text?.trim() ?? "";
}

export async function analyzeLeadWithGemini(prompt: string): Promise<string> {
  return generateGeminiText({
    model: GEMINI_2_FLASH_MODEL,
    prompt,
    useCachedContext: false,
  });
}
