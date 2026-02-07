import { CommentThread } from "@/components/projects/comment-thread";
import { FileUploader } from "@/components/projects/file-uploader";
import { MilestoneTracker } from "@/components/projects/milestone-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProject } from "@/lib/actions/projects";
import { auth } from "@/lib/auth";
import { formatFileSize } from "@/lib/cloudinary";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Download,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const statusColors: Record<string, string> = {
  PLANNING: "bg-blue-500/20 text-blue-400",
  IN_PROGRESS: "bg-yellow-500/20 text-yellow-400",
  REVIEW: "bg-purple-500/20 text-purple-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  ON_HOLD: "bg-orange-500/20 text-orange-400",
  CANCELLED: "bg-red-500/20 text-red-400",
};

const fileIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  video: VideoIcon,
  document: FileTextIcon,
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await getProject(projectId);
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold">{project.name}</h1>
              <Badge className={statusColors[project.status] ?? ""}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Client: {project.client.name ?? project.client.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">
              Milestones ({project.milestones.length})
            </TabsTrigger>
            <TabsTrigger value="files">
              Files ({project._count.files})
            </TabsTrigger>
            <TabsTrigger value="communication">
              Messages ({project._count.comments})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Activity feed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <div>
                        <p>
                          <span className="font-medium">
                            {activity.user.name}
                          </span>{" "}
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(activity.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {project.activities.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No activity yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                {project.milestones.length > 0 ? (
                  <MilestoneTracker
                    milestones={project.milestones}
                    isAdmin={isAdmin}
                  />
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No milestones defined
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <FileUploader projectId={projectId} />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.files.map((file) => {
                    const Icon = fileIcons[file.type] ?? FileIcon;
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} · {file.uploadedBy.name}{" "}
                            ·{" "}
                            {formatDistanceToNow(file.createdAt, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          asChild
                        >
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                  {project.files.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No files uploaded yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <CommentThread
                  projectId={projectId}
                  comments={project.comments}
                  currentUserId={session.user.id}
                  currentUserRole={session.user.role ?? ""}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
