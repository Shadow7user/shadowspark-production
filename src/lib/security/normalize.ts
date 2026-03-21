import type { NormalizedVariant } from "@/lib/security/types";

const MAX_INPUT_CHARS = 12_000;
const MAX_VARIANT_CHARS = 4_000;
const MAX_VARIANTS = 8;
const MAX_CODE_BLOCKS = 4;
const MAX_JSON_STRINGS = 6;
const BASE64_MIN_LENGTH = 24;
const BASE64_MAX_LENGTH = 8_192;
const HEX_MIN_LENGTH = 16;
const HEX_MAX_LENGTH = 4_096;
const MAX_DECODE_DEPTH = 2;
const CODE_BLOCK_PATTERN = /```(?:[\w-]+\n)?([\s\S]*?)```/g;
const DATA_URI_BASE64_PREFIX = /^data:[^;]+;base64,/i;
const ZERO_WIDTH_PATTERN = /[\u200B-\u200D\uFEFF]/g;

function clampText(input: string, maxChars: number): string {
  return input.trim().slice(0, maxChars);
}

function normalizeUnicodeContent(input: string): string {
  return input.normalize("NFKC").replace(ZERO_WIDTH_PATTERN, "");
}

function isLikelyReadableText(input: string): boolean {
  if (!input.trim()) {
    return false;
  }

  const printableChars = Array.from(input).filter((char) => {
    const code = char.charCodeAt(0);
    return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
  }).length;

  const printableRatio = printableChars / input.length;
  return printableRatio >= 0.85 && /[A-Za-z]{3,}/.test(input);
}

function stripBase64Prefix(input: string): string {
  return input.replace(DATA_URI_BASE64_PREFIX, "");
}

function detectPercentEncodedLike(input: string): boolean {
  return /%(?:[0-9A-Fa-f]{2})/.test(input);
}

function tryDecodePercentEncoded(input: string): string | null {
  if (!detectPercentEncodedLike(input)) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(input.replace(/\+/g, "%20"));
    const normalized = normalizeUnicodeContent(decoded);
    if (normalized === input || !isLikelyReadableText(normalized)) {
      return null;
    }
    return clampText(normalized, MAX_VARIANT_CHARS);
  } catch {
    return null;
  }
}

function detectHexLike(input: string): boolean {
  const compact = input.replace(/\s+/g, "").replace(/^0x/i, "");

  if (compact.length < HEX_MIN_LENGTH || compact.length > HEX_MAX_LENGTH) {
    return false;
  }

  return compact.length % 2 === 0 && /^[0-9A-Fa-f]+$/.test(compact);
}

function tryDecodeHex(input: string): string | null {
  if (!detectHexLike(input)) {
    return null;
  }

  try {
    const compact = input.replace(/\s+/g, "").replace(/^0x/i, "");
    const decoded = Buffer.from(compact, "hex").toString("utf8");
    const normalized = normalizeUnicodeContent(decoded);

    if (!isLikelyReadableText(normalized)) {
      return null;
    }

    return clampText(normalized, MAX_VARIANT_CHARS);
  } catch {
    return null;
  }
}

function normaliseBase64Input(input: string): string {
  const compact = stripBase64Prefix(input)
    .replace(/\s+/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const padding = compact.length % 4 === 0 ? 0 : 4 - (compact.length % 4);
  return compact + "=".repeat(padding);
}

function collectJsonStrings(
  value: unknown,
  results: string[],
  remaining: { count: number },
): void {
  if (remaining.count <= 0) {
    return;
  }

  if (typeof value === "string") {
    const candidate = clampText(value, MAX_VARIANT_CHARS);
    if (candidate && isLikelyReadableText(candidate)) {
      results.push(candidate);
      remaining.count -= 1;
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (remaining.count <= 0) {
        return;
      }
      collectJsonStrings(item, results, remaining);
    }
    return;
  }

  if (typeof value === "object" && value !== null) {
    for (const item of Object.values(value)) {
      if (remaining.count <= 0) {
        return;
      }
      collectJsonStrings(item, results, remaining);
    }
  }
}

function pushVariant(
  variants: NormalizedVariant[],
  seen: Set<string>,
  kind: string,
  content: string,
): void {
  if (variants.length >= MAX_VARIANTS) {
    return;
  }

  const candidate = clampText(content, MAX_VARIANT_CHARS);
  if (!candidate) {
    return;
  }

  const key = `${kind}:${candidate}`;
  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  variants.push({ kind, content: candidate });
}

export function detectBase64Like(input: string): boolean {
  const compact = stripBase64Prefix(input).replace(/\s+/g, "");

  if (compact.length < BASE64_MIN_LENGTH || compact.length > BASE64_MAX_LENGTH) {
    return false;
  }

  if (!/^[A-Za-z0-9+/=_-]+$/.test(compact)) {
    return false;
  }

  const symbolRatio = compact.replace(/[A-Za-z0-9]/g, "").length / compact.length;
  return symbolRatio <= 0.15;
}

export function tryDecodeBase64(input: string): string | null {
  if (!detectBase64Like(input)) {
    return null;
  }

  try {
    const normalised = normaliseBase64Input(input);
    const decodedBuffer = Buffer.from(normalised, "base64");
    if (decodedBuffer.length === 0) {
      return null;
    }

    const reencoded = decodedBuffer.toString("base64").replace(/=+$/u, "");
    const comparable = normalised.replace(/=+$/u, "");
    if (reencoded !== comparable) {
      return null;
    }

    const decodedText = normalizeUnicodeContent(decodedBuffer.toString("utf8"));
    if (!isLikelyReadableText(decodedText)) {
      return null;
    }

    return clampText(decodedText, MAX_VARIANT_CHARS);
  } catch {
    return null;
  }
}

export function extractCodeBlocks(input: string): string[] {
  const blocks: string[] = [];
  const limitedInput = input.slice(0, MAX_INPUT_CHARS);

  for (const match of limitedInput.matchAll(CODE_BLOCK_PATTERN)) {
    if (blocks.length >= MAX_CODE_BLOCKS) {
      break;
    }

    const block = clampText(match[1] ?? "", MAX_VARIANT_CHARS);
    if (block) {
      blocks.push(block);
    }
  }

  return blocks;
}

export function extractJsonStrings(input: string): string[] {
  const limitedInput = input.trim().slice(0, MAX_INPUT_CHARS);
  if (!limitedInput) {
    return [];
  }

  const prefix = limitedInput[0];
  if (!prefix || !["{", "[", "\""].includes(prefix)) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(limitedInput);
    const results: string[] = [];
    collectJsonStrings(parsed, results, { count: MAX_JSON_STRINGS });
    return results;
  } catch {
    return [];
  }
}

export function normalizeInput(input: string): NormalizedVariant[] {
  const limitedInput = input.slice(0, MAX_INPUT_CHARS);
  const variants: NormalizedVariant[] = [];
  const seen = new Set<string>();
  const queue: Array<{ content: string; depth: number }> = [];

  pushVariant(variants, seen, "raw", limitedInput);
  queue.push({ content: limitedInput, depth: 0 });

  const unicodeNormalised = normalizeUnicodeContent(limitedInput);
  if (unicodeNormalised !== limitedInput) {
    pushVariant(variants, seen, "unicode_normalized", unicodeNormalised);
    queue.push({ content: unicodeNormalised, depth: 0 });
  }

  for (const block of extractCodeBlocks(limitedInput)) {
    pushVariant(variants, seen, "code_block", block);
    queue.push({ content: block, depth: 0 });

    for (const jsonString of extractJsonStrings(block)) {
      pushVariant(variants, seen, "json_string", jsonString);
      queue.push({ content: jsonString, depth: 0 });
    }
  }

  for (const jsonString of extractJsonStrings(limitedInput)) {
    pushVariant(variants, seen, "json_string", jsonString);
    queue.push({ content: jsonString, depth: 0 });
  }

  while (queue.length > 0 && variants.length < MAX_VARIANTS) {
    const current = queue.shift();
    if (!current || current.depth >= MAX_DECODE_DEPTH) {
      continue;
    }

    const decodedCandidates: Array<[string, string | null]> = [
      ["url_decoded", tryDecodePercentEncoded(current.content)],
      ["hex_decoded", tryDecodeHex(current.content)],
      ["base64_decoded", tryDecodeBase64(current.content)],
    ];

    for (const [kind, candidate] of decodedCandidates) {
      if (!candidate) {
        continue;
      }

      const previousCount = variants.length;
      pushVariant(variants, seen, kind, candidate);
      if (variants.length > previousCount) {
        queue.push({ content: candidate, depth: current.depth + 1 });
      }
    }
  }

  return variants;
}
