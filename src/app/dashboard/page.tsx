import DashboardLayout from "@/components/dashboard/layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Courses | ShadowSpark Academy",
  description: "Track your learning progress and continue your AI education.",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?redirect=/dashboard");
  }

  // Fetch real enrollment data
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true,
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Get lesson completions for all enrolled courses
  const lessonCompletions = await prisma.lessonCompletion.findMany({
    where: {
      userId: session.user.id,
      lesson: {
        module: {
          courseId: {
            in: enrollments.map((e) => e.courseId),
          },
        },
      },
    },
  });

  // Calculate stats
  const stats = {
    totalCourses: enrollments.length,
    inProgress: enrollments.filter((e) => !e.completed).length,
    completed: enrollments.filter((e) => e.completed).length,
    totalHours: enrollments.reduce((sum, e) => {
      const courseMinutes = e.course.modules.reduce(
        (s, m) => s + m.lessons.reduce((ls, l) => ls + (l.duration || 0), 0),
        0,
      );
      return sum + Math.floor(courseMinutes / 60);
    }, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back,{" "}
            <span className="gradient-text">
              {session.user?.name?.split(" ")[0] || "Student"}
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground text-lg">
            Continue your AI learning journey
          </p>
        </div>

        {/* Stats Grid - Real Data */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={String(stats.totalCourses)}
            icon={<BookOpen className="h-6 w-6" />}
            trend={stats.totalCourses > 0 ? "Active" : "None yet"}
            trendType="up"
          />

          <StatsCard
            title="In Progress"
            value={String(stats.inProgress)}
            icon={<TrendingUp className="h-6 w-6" />}
            trend="Keep going!"
            trendType="up"
          />

          <StatsCard
            title="Completed"
            value={String(stats.completed)}
            icon={<CheckCircle className="h-6 w-6" />}
            trend={stats.completed > 0 ? "Great work!" : "Start learning"}
            trendType="up"
          />

          <StatsCard
            title="Content Hours"
            value={`${stats.totalHours}h`}
            icon={<Clock className="h-6 w-6" />}
            trend="Total available"
            trendType="up"
          />
        </div>

        {/* My Courses Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">My Courses</span>
            </h2>
            <p className="text-muted-foreground mt-1">
              {enrollments.length > 0
                ? "Pick up where you left off"
                : "Browse courses to start learning"}
            </p>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card/50">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-6">
                Start learning by enrolling in your first course
              </p>
              <Link
                href="/courses"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const totalLessons = course.modules.reduce(
                  (sum, m) => sum + m.lessons.length,
                  0,
                );
                const completedLessons = lessonCompletions.filter(
                  (lc: { lessonId: string }) =>
                    course.modules.some((m) =>
                      m.lessons.some((l) => l.id === lc.lessonId),
                    ),
                ).length;
                const progress =
                  totalLessons > 0
                    ? Math.round((completedLessons / totalLessons) * 100)
                    : 0;

                // Find next lesson to watch
                let nextLesson: {
                  lesson: { id: string; title: string };
                  moduleId: string;
                } | null = null;
                for (const module of course.modules) {
                  const incompleteLesson = module.lessons.find((lesson) => {
                    const isCompleted = lessonCompletions.some(
                      (lc: { lessonId: string }) => lc.lessonId === lesson.id,
                    );
                    return !isCompleted;
                  });
                  if (incompleteLesson) {
                    nextLesson = {
                      lesson: incompleteLesson,
                      moduleId: module.id,
                    };
                    break;
                  }
                }

                return (
                  <div
                    key={enrollment.id}
                    className="border border-border rounded-2xl overflow-hidden bg-card/50 backdrop-blur hover:border-cyan-500/30 transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-cyan-900/20 flex items-center justify-center">
                      <div className="text-4xl">🤖</div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-semibold text-cyan-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" />
                          {completedLessons}/{totalLessons} lessons
                        </span>
                        {enrollment.completed && (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>

                      {nextLesson ? (
                        <Link
                          href={`/courses/${course.slug}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lesson.id}`}
                          className="block w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-center rounded-lg text-sm font-semibold hover:scale-105 transition-transform"
                        >
                          Continue Learning
                        </Link>
                      ) : (
                        <Link
                          href={`/courses/${course.slug}`}
                          className="block w-full py-2 border border-cyan-500/30 text-center rounded-lg text-sm font-semibold hover:bg-cyan-500/10 transition-colors"
                        >
                          View Course
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Browse More CTA */}
        <div className="py-8 text-center border border-border rounded-2xl bg-gradient-to-br from-purple-900/10 to-cyan-900/10">
          <h2 className="text-xl font-bold mb-2">Ready to Learn More?</h2>
          <p className="text-muted-foreground mb-4">
            Explore our full course catalog and expand your AI skills
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Browse All Courses
          </Link>
        </div>

        {/* User Info Card */}
        <Card className="border-cyber-cyan/30 bg-card/40 backdrop-blur border-cyberpunk">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">
                  {session.user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge className="mt-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50">
                  {(session.user as { role?: string })?.role || "STUDENT"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
