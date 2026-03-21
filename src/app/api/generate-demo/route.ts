import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { createDemoSession } from "@/lib/demo/generateDemoSession";
import { assertSensitiveActionAllowed } from "@/lib/security";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    assertSensitiveActionAllowed({
      action: "create_record",
      explicitApproval: false,
      route: "/api/generate-demo",
      source: "validated_public_request",
    });
    const result = await createDemoSession(await req.json());

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    console.error("generate-demo error", error);

    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 },
    );
  }
}
