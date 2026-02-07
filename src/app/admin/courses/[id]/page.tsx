import { CourseForm } from "@/components/admin/course-form";
import { ModuleLessonEditor } from "@/components/admin/module-lesson-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourse } from "@/lib/actions/admin";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const course = await getCourse(id);
  if (!course) notFound();

  const courseData = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    category: course.category,
    level: course.level,
    price: Number(course.price),
    thumbnail: course.thumbnail,
    published: course.published,
    featured: course.featured,
  };

  const modulesData = course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    description: module.description,
    order: module.order,
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      duration: lesson.duration,
      order: lesson.order,
      content: lesson.content,
      isFree: lesson.isFree,
    })),
  }));

  const totalLessons = modulesData.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">
              Edit course details, modules, and lessons
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-sm rounded ${
                course.published
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {course.published ? "Published" : "Draft"}
            </span>
            {course.featured && (
              <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{course._count.enrollments}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{modulesData.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalLessons}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₦{Number(course.price).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">
              Content ({modulesData.length} modules)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <CourseForm course={courseData} />
          </TabsContent>

          <TabsContent value="content">
            <ModuleLessonEditor courseId={course.id} modules={modulesData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
