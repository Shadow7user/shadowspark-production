import type { NextRequest } from "next/server";

/**
 * Extract client IP from trusted proxy headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

/**
 * Convert FormData into a plain string record.
 * Non-string values (files) are ignored.
 */
export function formDataToStringRecord(formData: FormData): Record<string, string> {
  const record: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      record[key] = value;
    }
  }

  return record;
}
