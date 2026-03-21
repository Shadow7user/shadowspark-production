import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/observability";
import { prisma } from "@/lib/prisma";
import { assertSensitiveActionAllowed } from "@/lib/security";
import {
  leadSubmissionSchema,
  type LeadSubmissionInput,
} from "@/lib/landing/leadSubmission";

type RateLimitStatus = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

type CriticalLeadAlert = {
  leadId: string;
  industry: string;
  sessionId: string;
};

const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;
const ipBuckets = new Map<string, number[]>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string): RateLimitStatus {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = ipBuckets.get(ip)?.filter((timestamp) => timestamp > windowStart) ?? [];

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const resetAt = timestamps[0] ? timestamps[0] + WINDOW_MS : now + WINDOW_MS;
    ipBuckets.set(ip, timestamps);
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  timestamps.push(now);
  ipBuckets.set(ip, timestamps);

  return {
    allowed: true,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - timestamps.length),
    resetAt: now + WINDOW_MS,
  };
}

function buildRateLimitHeaders(rateLimit: RateLimitStatus): HeadersInit {
  return {
    "Cache-Control": "no-store",
    "X-RateLimit-Limit": String(MAX_REQUESTS_PER_WINDOW),
    "X-RateLimit-Remaining": String(rateLimit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
  };
}

function buildCorsHeaders(origin: string | null): HeadersInit {
  if (!origin) {
    return {
      Vary: "Origin",
    };
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.trim();
    const host = request.headers.get("host")?.trim();
    const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.trim();
    const allowedHosts = new Set<string>([
      request.nextUrl.hostname,
      forwardedHost || "",
      host || "",
      configuredOrigin ? new URL(configuredOrigin).hostname : "",
    ]);

    return allowedHosts.has(originUrl.hostname);
  } catch {
    return false;
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function notifyAdmin(alert: CriticalLeadAlert): void {
  logger.info("lead.critical_alert", alert);
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");

  if (!hasTrustedOrigin(request)) {
    return new NextResponse(null, {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
        ...buildCorsHeaders(null),
      },
    });
  }

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      ...buildCorsHeaders(origin),
    },
  });
}

async function resolveExistingLead(
  input: LeadSubmissionInput,
  origin: string | null,
): Promise<NextResponse | null> {
  let existingLead: { id: string } | null = null;

  try {
    existingLead = await prisma.lead.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      select: { id: true },
    });
  } catch {
    throw new Error("Unable to verify the lead deduplication key.");
  }

  if (!existingLead) {
    return null;
  }

  return NextResponse.json(
    {
      success: true,
      duplicate: true,
      leadId: existingLead.id,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        ...buildCorsHeaders(origin),
      },
    },
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");

  if (!hasTrustedOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Untrusted request origin." },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
          ...buildCorsHeaders(null),
        },
      },
    );
  }

  let parsedBody: LeadSubmissionInput | null = null;

  try {
    parsedBody = leadSubmissionSchema.parse(await request.json());
    const existingLeadResponse = await resolveExistingLead(parsedBody, origin);
    if (existingLeadResponse) {
      return existingLeadResponse;
    }

    const rateLimit = checkRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Try again later." },
        {
          status: 429,
          headers: {
            ...buildRateLimitHeaders(rateLimit),
            ...buildCorsHeaders(origin),
          },
        },
      );
    }

    const session = await prisma.demoSession.findUnique({
      where: { id: parsedBody.sessionId },
      select: {
        id: true,
        organizationName: true,
        industry: true,
        intent: true,
        location: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Strategy expired. Generate a new one." },
        {
          status: 404,
          headers: {
            ...buildRateLimitHeaders(rateLimit),
            ...buildCorsHeaders(origin),
          },
        },
      );
    }

    assertSensitiveActionAllowed({
      action: "create_record",
      explicitApproval: false,
      route: "/api/leads",
      source: "validated_public_request",
    });

    const lead = await prisma.lead.create({
      data: {
        name: parsedBody.name,
        email: parsedBody.email ?? null,
        phone: parsedBody.phone,
        status: "new",
        source: parsedBody.source ?? parsedBody.campaignId ?? "premium-reveal",
        notes: `Landing capture for ${session.organizationName} (${session.industry}).`,
        businessId: session.id,
        version: 1,
        idempotencyKey: parsedBody.idempotencyKey,
        metadata: {
          campaignId: parsedBody.campaignId ?? null,
          sessionId: session.id,
          organizationName: session.organizationName,
          industry: session.industry,
          intent: session.intent,
          location: session.location,
          userAgent: request.headers.get("user-agent")?.slice(0, 180) ?? null,
        },
      },
      select: { id: true },
    });

    notifyAdmin({
      leadId: lead.id,
      industry: session.industry,
      sessionId: session.id,
    });

    return NextResponse.json(
      {
        success: true,
        duplicate: false,
        leadId: lead.id,
      },
      {
        status: 201,
        headers: {
          ...buildRateLimitHeaders(rateLimit),
          ...buildCorsHeaders(origin),
        },
      },
    );
  } catch (error: unknown) {
    logger.error("lead.submission_failed", {
      message: getErrorMessage(error),
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      if (parsedBody) {
        const duplicate = await prisma.lead.findUnique({
          where: { idempotencyKey: parsedBody.idempotencyKey },
          select: { id: true },
        });

        if (duplicate) {
          return NextResponse.json(
            {
              success: true,
              duplicate: true,
              leadId: duplicate.id,
            },
            {
              status: 200,
              headers: {
                "Cache-Control": "no-store",
                ...buildCorsHeaders(origin),
              },
            },
          );
        }
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { success: false, error: "Unable to secure the lead right now." },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store",
            ...buildCorsHeaders(origin),
          },
        },
      );
    }

    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          ...buildCorsHeaders(origin),
        },
      },
    );
  }
}
