import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { id: projectId } = await params;
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

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { clientId: true, managerId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAuthorized =
      user.role === "ADMIN" ||
      project.clientId === user.id ||
      project.managerId === user.id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden - not authorized to view milestones" },
        { status: 403 }
      );
    }

    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { id: projectId } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can create milestones
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create milestones" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title || body.dueDate === undefined || body.order === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: title, dueDate, order" },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        title: body.title,
        description: body.description || "",
        dueDate: new Date(body.dueDate),
        order: body.order,
        completed: body.completed || false,
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}
