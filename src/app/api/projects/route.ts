import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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

    // Clients see their own projects, Admins see all, Managers see projects they manage
    const projects = await prisma.project.findMany({
      where:
        user.role === "ADMIN"
          ? {}
          : user.role === "CUSTOMER"
            ? { clientId: user.id }
            : { managerId: user.id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        milestones: { orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN can create projects
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create projects" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.clientId || !body.managerId || !body.budget) {
      return NextResponse.json(
        { error: "Missing required fields: name, clientId, managerId, budget" },
        { status: 400 }
      );
    }

    // Verify client and manager exist
    const [clientExists, managerExists] = await Promise.all([
      prisma.user.findUnique({ where: { id: body.clientId } }),
      prisma.user.findUnique({ where: { id: body.managerId } }),
    ]);

    if (!clientExists || !managerExists) {
      return NextResponse.json(
        { error: "Client or manager not found" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || "",
        clientId: body.clientId,
        managerId: body.managerId,
        budget: body.budget,
        currency: body.currency || "NGN",
        status: body.status || "PLANNING",
        priority: body.priority || "MEDIUM",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
      include: {
        client: { select: { id: true, name: true, email: true } },
        manager: { select: { id: true, name: true, email: true } },
        milestones: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
