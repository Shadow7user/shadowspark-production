import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ClaimBody = {
  sessionId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ClaimBody;
    const sessionId = body.sessionId?.trim();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 }
      );
    }

    const session = await prisma.demoSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Demo session not found" },
        { status: 404 }
      );
    }

    await prisma.demoSession.update({
      where: { id: sessionId },
      data: { status: "claimed" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("demo-claim error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
