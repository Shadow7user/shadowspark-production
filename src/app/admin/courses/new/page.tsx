import { CourseForm } from "@/components/admin/course-form";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewCoursePage() {
  const session = await auth();

  if (!session?.user?.email) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/courses"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-muted-foreground">
            Add a new course to your academy
          </p>
        </div>

        <CourseForm />
      </div>
    </div>
  );
}
