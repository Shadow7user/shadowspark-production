import { KanbanBoard } from "@/components/projects/kanban-board";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/actions/projects";
import { auth } from "@/lib/auth";
import { ArrowLeft, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await getProjects();
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground text-sm">
              {projects.length} active project{projects.length !== 1 && "s"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="bg-primary/10">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/projects/list">
                <List className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {projects.length > 0 ? (
          <KanbanBoard projects={projects} isAdmin={isAdmin} />
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              {isAdmin
                ? "No projects yet. Create your first project to get started."
                : "No projects assigned to you yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
