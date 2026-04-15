import { Storage, type File } from "@google-cloud/storage";

import type { RagEmbeddingIndex } from "@/lib/rag/types";

const storage = new Storage();
const DEFAULT_BUCKET_NAME = "shadowspark-vault";

const PREFIX_CANDIDATES = [
  "audits",
  "reports",
  "intelligence",
  "crawls",
  "",
] as const;

type FileWithUpdatedAt = {
  file: File;
  updatedAt: number;
};

export type VaultInsight = {
  id: string;
  title: string;
  url?: string;
  excerpt: string;
  score: number;
};

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

function getBucketName() {
  return process.env.VAULT_BUCKET || process.env.GCS_BUCKET_NAME || DEFAULT_BUCKET_NAME;
}

export function getFallbackAudit(slug: string) {
  return `# Intelligence Stream: ${slug}

> **Status:** Awaiting fresh cloud audit sync
> **Source:** ShadowSpark Genesis Vault

## Infrastructure Audit
- Crawl artifacts have not been published for this slug yet.
- The live page is ready to ingest markdown as soon as the worker uploads the next report.
- GCS retrieval is active and targeting the latest matching \`.md\` object.

## Revenue Leaks
- Follow-up speed remains exposed until the latest crawl snapshot is available.
- Messaging and CTA pathways should be re-evaluated against the most recent site content.
- Qualification friction will remain estimated until the next indexed report lands.

## AI Proposals
1. Re-run the Firecrawl job for this domain or slug.
2. Verify the worker is uploading markdown into the configured vault bucket.
3. Refresh this page after the next successful sync to render the newest audit narrative.
`;
}

function getUpdatedAt(file: File) {
  return new Date(file.metadata.updated || file.metadata.timeCreated || 0).getTime();
}

function tokenize(input: string) {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function scoreFile(file: File, slug: string) {
  const normalizedName = file.name.toLowerCase();
  const normalizedSlug = normalizeSlug(slug);

  let score = 0;

  if (normalizedName.includes(`/${normalizedSlug}/`)) score += 5;
  if (normalizedName.includes(normalizedSlug)) score += 3;
  if (normalizedName.endsWith(".md")) score += 1;

  return score;
}

async function listMarkdownFilesForPrefix(prefix: string) {
  const [files] = await storage.bucket(getBucketName()).getFiles(prefix ? { prefix } : undefined);
  return files.filter((file) => file.name.endsWith(".md"));
}

async function readBucketFile(filePath: string) {
  const bucket = storage.bucket(getBucketName());
  const file = bucket.file(filePath);
  const [exists] = await file.exists();

  if (!exists) {
    return null;
  }

  const [contents] = await file.download();
  return contents.toString("utf8");
}

async function loadLatestVaultIndex() {
  const direct = await readBucketFile("indexes/latest.json");
  if (direct) {
    return JSON.parse(direct) as RagEmbeddingIndex;
  }

  const bucket = storage.bucket(getBucketName());
  const [files] = await bucket.getFiles({ prefix: "indexes/" });
  const indexFiles = files.filter((file) => file.name.endsWith("/index.json"));

  if (indexFiles.length === 0) {
    return null;
  }

  indexFiles.sort((left, right) => getUpdatedAt(right) - getUpdatedAt(left));
  const [contents] = await bucket.file(indexFiles[0].name).download();
  return JSON.parse(contents.toString("utf8")) as RagEmbeddingIndex;
}

function scoreChunk(text: string, tokens: string[], slug: string) {
  const normalizedText = text.toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (normalizedText.includes(token)) {
      score += token.length > 6 ? 3 : 2;
    }
  }

  if (slug && normalizedText.includes(slug)) {
    score += 4;
  }

  return score;
}

function buildExcerpt(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 220 ? `${normalized.slice(0, 217)}...` : normalized;
}

export async function fetchVaultInsights(args: {
  slug: string;
  businessName?: string;
  niche?: string;
  k?: number;
}): Promise<VaultInsight[]> {
  try {
    const index = await loadLatestVaultIndex();
    if (!index || index.chunks.length === 0) {
      return [];
    }

    const slug = normalizeSlug(args.slug);
    const queryTokens = Array.from(
      new Set(
        tokenize([args.slug, args.businessName, args.niche, "revenue leak infrastructure ai proposal"]
          .filter(Boolean)
          .join(" "))
      )
    );

    return index.chunks
      .map((chunk) => ({
        chunk,
        score: scoreChunk(`${chunk.title ?? ""}\n${chunk.text}`, queryTokens, slug),
      }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, args.k ?? 4)
      .map((entry) => ({
        id: entry.chunk.id,
        title: entry.chunk.title ?? "Indexed audit signal",
        url: entry.chunk.url,
        excerpt: buildExcerpt(entry.chunk.text),
        score: entry.score,
      }));
  } catch (error) {
    console.error("[gcs] failed to fetch vault insights", {
      bucket: getBucketName(),
      slug: args.slug,
      error,
    });
    return [];
  }
}

export async function fetchLatestAuditMarkdown(slug: string): Promise<string> {
  const normalizedSlug = normalizeSlug(slug);
  const bucket = storage.bucket(getBucketName());

  try {
    const candidateFiles = await Promise.all(
      PREFIX_CANDIDATES.map(async (rootPrefix) => {
        const slugPrefix = rootPrefix ? `${rootPrefix}/${normalizedSlug}` : normalizedSlug;
        const rootFiles = await listMarkdownFilesForPrefix(slugPrefix);

        if (rootFiles.length > 0) {
          return rootFiles;
        }

        if (!rootPrefix) {
          return listMarkdownFilesForPrefix("");
        }

        return listMarkdownFilesForPrefix(`${rootPrefix}/`);
      })
    );

    const rankedFiles = candidateFiles
      .flat()
      .filter((file, index, files) => files.findIndex((candidate) => candidate.name === file.name) === index)
      .filter((file) => file.name.toLowerCase().includes(normalizedSlug) || !normalizedSlug)
      .map<FileWithUpdatedAt>((file) => ({
        file,
        updatedAt: getUpdatedAt(file),
      }))
      .sort((left, right) => {
        const scoreDelta = scoreFile(right.file, normalizedSlug) - scoreFile(left.file, normalizedSlug);
        if (scoreDelta !== 0) return scoreDelta;
        return right.updatedAt - left.updatedAt;
      });

    const latestMatch = rankedFiles[0]?.file;

    if (!latestMatch) {
      return getFallbackAudit(slug);
    }

    const [contents] = await bucket.file(latestMatch.name).download();
    return contents.toString("utf8");
  } catch (error) {
    console.error("[gcs] failed to fetch latest audit markdown", {
      bucket: bucket.name,
      slug: normalizedSlug,
      error,
    });
    return getFallbackAudit(slug);
  }
}
