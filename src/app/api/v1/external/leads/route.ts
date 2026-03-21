import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { mergeLeadMetadata } from "@/lib/leads/metadata";
import { logger } from "@/lib/observability";
import { prisma } from "@/lib/prisma";
import { assertSensitiveActionAllowed } from "@/lib/security";

const externalLeadMetadataValueSchema = z.union([
  z.string().trim().max(500),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);

const externalLeadSchema = z.object({
  businessId: z.string().cuid().optional(),
  email: z.string().trim().email().optional(),
  location: z.string().trim().max(120).optional(),
  metadata: z.record(z.string(), externalLeadMetadataValueSchema).optional(),
  name: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(2_000).optional(),
  organizationName: z.string().trim().max(160).optional(),
  phone: z.string().trim().min(7).max(32),
  source: z.string().trim().min(2).max(80),
}).strict();

type ExternalLeadInput = z.infer<typeof externalLeadSchema>;

function normalisePhone(value: string): string {
  const digits = value.replace(/\D+/g, "");

  if (!digits) {
    throw new Error("Lead phone number is invalid.");
  }

  if (digits.startsWith("234")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  return `+${digits}`;
}

function hasValidGatewayToken(request: NextRequest): boolean {
  const expectedToken = env.externalIngestToken.trim();
  const bearerToken = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  const headerToken = request.headers.get("x-ingest-token")?.trim();

  return Boolean(
    expectedToken && (bearerToken === expectedToken || headerToken === expectedToken),
  );
}

function buildResponseHeaders(): HeadersInit {
  return {
    "Cache-Control": "no-store",
  };
}

function buildLeadMetadata(input: ExternalLeadInput): Prisma.InputJsonValue {
  return mergeLeadMetadata(input.metadata ?? {}, {
    location: input.location,
    organizationName: input.organizationName,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!hasValidGatewayToken(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized ingestion attempt." },
      {
        status: 401,
        headers: buildResponseHeaders(),
      },
    );
  }

  let input: ExternalLeadInput;

  try {
    input = externalLeadSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Invalid lead payload.",
      },
      {
        status: 400,
        headers: buildResponseHeaders(),
      },
    );
  }

  try {
    assertSensitiveActionAllowed({
      action: "create_record",
      explicitApproval: false,
      route: "/api/v1/external/leads",
      source: "validated_external_request",
    });

    const lead = await prisma.lead.create({
      data: {
        businessId: input.businessId ?? null,
        email: input.email ?? null,
        idempotencyKey: randomUUID(),
        metadata: buildLeadMetadata(input),
        name: input.name,
        notes: input.notes ?? null,
        phone: normalisePhone(input.phone),
        source: input.source,
        status: "new",
        version: 1,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
      },
      {
        status: 201,
        headers: buildResponseHeaders(),
      },
    );
  } catch (error) {
    logger.error("external.lead_ingest_failed", {
      error: error instanceof Error ? error.message : "unknown",
      source: input.source,
    });

    return NextResponse.json(
      { success: false, error: "Unable to ingest the lead right now." },
      {
        status: 500,
        headers: buildResponseHeaders(),
      },
    );
  }
}
