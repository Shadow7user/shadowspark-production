import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeLeadScore, deriveLeadStatus } from "@/lib/scoring";

interface LeadCaptureRequest {
  name: string;
  email: string;
  industry: string;
  painPoint: string;
  calculatedRoi: number;
}

function isValidPayload(body: unknown): body is LeadCaptureRequest {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Record<string, unknown>;

  return (
    typeof candidate.name === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.industry === "string" &&
    typeof candidate.painPoint === "string" &&
    typeof candidate.calculatedRoi === "number" &&
    Number.isFinite(candidate.calculatedRoi)
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 },
      );
    }

    const leadScore = computeLeadScore({
      calculatedRoi: body.calculatedRoi,
      email: body.email,
      industry: body.industry,
    });
    const status = deriveLeadStatus(leadScore);

    const lead = await prisma.businessLead.create({
      data: {
        name: body.name,
        email: body.email,
        industry: body.industry,
        painPoint: body.painPoint,
        calculatedRoi: body.calculatedRoi,
        leadScore,
        status,
      },
    });

    // eslint-disable-next-line no-console
    console.log("Lead Captured", { id: lead.id, score: leadScore });

    return NextResponse.json(
      { id: lead.id, leadScore, status },
      { status: 201 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      "Failed to capture lead",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      {
        error: "Failed to capture lead. Please try again.",
      },
      { status: 500 },
    );
  }
}
