import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    include: {
      client: { select: { id: true, name: true, email: true } },
      manager: { select: { id: true, name: true, email: true } },
      _count: { select: { milestones: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    PLANNING: "bg-gray-100 text-gray-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    REVIEW: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    ON_HOLD: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const priorityColors: Record<string, string> = {
    LOW: "text-gray-500",
    MEDIUM: "text-blue-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500",
  };

  // Stats
  const statusCounts = projects.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalBudget = projects.reduce((acc, p) => acc + Number(p.budget), 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">
              {projects.length} active projects
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            + New Project
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statusCounts.IN_PROGRESS || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statusCounts.COMPLETED || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                On Hold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statusCounts.ON_HOLD || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₦{totalBudget.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No projects yet</p>
                <Link
                  href="/admin/projects/new"
                  className="text-primary hover:underline mt-2 inline-block"
                >
                  Create your first project
                </Link>
              </CardContent>
            </Card>
          ) : (
            projects.map((project) => (
              <Card key={project.id} className="hover:border-primary/50 transition">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Client: {project.client.name || project.client.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded ${statusColors[project.status]}`}>
                        {project.status.replace("_", " ")}
                      </span>
                      <span className={`text-xs font-medium ${priorityColors[project.priority]}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span>Manager: {project.manager.name || project.manager.email}</span>
                      <span>{project._count.milestones} milestones</span>
                      <span>₦{Number(project.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6">
          <Link href="/admin" className="text-muted-foreground hover:underline text-sm">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
