import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params;
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

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        milestones: { orderBy: { order: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Authorization: User must be admin, client, or manager
    const isAuthorized =
      user.role === "ADMIN" ||
      project.clientId === user.id ||
      project.managerId === user.id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden - not authorized to view this project" },
        { status: 403 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const { id } = await params;
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

    const project = await prisma.project.findUnique({
      where: { id },
      select: { managerId: true, clientId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Authorization: Only admin or project manager can update
    const isAuthorized = user.role === "ADMIN" || project.managerId === user.id;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Forbidden - only admin or project manager can update" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        status: body.status,
        priority: body.priority,
        budget: body.budget,
        currency: body.currency,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        milestones: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can delete projects
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete projects" },
        { status: 403 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Soft delete
    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
      projectId: id,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
