import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { id: lessonId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const completion = await prisma.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
    });

    return NextResponse.json({
      completed: !!completion,
      completedAt: completion?.completedAt,
    });
  } catch (error) {
    console.error("Error fetching lesson completion:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson completion" },
      { status: 500 }
    );
  }
}
