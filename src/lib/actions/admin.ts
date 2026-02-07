"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ============================================================================
// AUTH HELPERS
// ============================================================================

async function requireAdmin(): Promise<{
  id: string;
  email: string;
  role: string;
}> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email)
    throw new Error("Unauthorized");
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
  };
}

// ============================================================================
// COURSE SCHEMAS
// ============================================================================

const CourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "AI_PROMPTING",
    "WEB_DEVELOPMENT",
    "AUTOMATION",
    "BUSINESS",
    "GRAPHIC_DESIGN",
    "PRODUCT_DESIGN",
    "SEO_MARKETING",
  ]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "PROFESSIONAL"]),
  price: z.number().min(0, "Price must be positive"),
  thumbnail: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const ModuleSchema = z.object({
  courseId: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  order: z.number().int().min(0),
});

const LessonSchema = z.object({
  moduleId: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(0),
  isFree: z.boolean().default(false),
  resources: z.any().optional(),
});

// ============================================================================
// BLOG SCHEMAS
// ============================================================================

const BlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  thumbnail: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

// ============================================================================
// USER SCHEMAS
// ============================================================================

const UpdateUserSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["ADMIN", "CUSTOMER", "STUDENT"]).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
});

// ============================================================================
// COURSE ACTIONS
// ============================================================================

export async function getCourses() {
  await requireAdmin();

  return prisma.course.findMany({
    include: {
      _count: { select: { enrollments: true, modules: true } },
      modules: {
        include: { _count: { select: { lessons: true } } },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourse(id: string) {
  await requireAdmin();

  return prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        include: { lessons: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function createCourse(data: z.infer<typeof CourseSchema>) {
  await requireAdmin();

  const validated = CourseSchema.parse(data);

  // Check slug uniqueness
  const existing = await prisma.course.findUnique({
    where: { slug: validated.slug },
  });
  if (existing) throw new Error("A course with this slug already exists");

  const course = await prisma.course.create({
    data: {
      ...validated,
      price: validated.price,
    },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return { success: true, course };
}

export async function updateCourse(
  id: string,
  data: Partial<z.infer<typeof CourseSchema>>,
) {
  await requireAdmin();

  const validated = CourseSchema.partial().parse(data);

  // Check slug uniqueness if changing
  if (validated.slug) {
    const existing = await prisma.course.findFirst({
      where: { slug: validated.slug, NOT: { id } },
    });
    if (existing) throw new Error("A course with this slug already exists");
  }

  const course = await prisma.course.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${id}`);
  revalidatePath("/courses");
  revalidatePath(`/courses/${course.slug}`);

  return { success: true, course };
}

export async function deleteCourse(id: string) {
  await requireAdmin();

  await prisma.course.delete({ where: { id } });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return { success: true };
}

export async function toggleCoursePublished(id: string) {
  await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  const updated = await prisma.course.update({
    where: { id },
    data: { published: !course.published },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return { success: true, published: updated.published };
}

export async function toggleCourseFeatured(id: string) {
  await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new Error("Course not found");

  const updated = await prisma.course.update({
    where: { id },
    data: { featured: !course.featured },
  });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");

  return { success: true, featured: updated.featured };
}

// ============================================================================
// MODULE ACTIONS
// ============================================================================

export async function createModule(data: z.infer<typeof ModuleSchema>) {
  await requireAdmin();

  const validated = ModuleSchema.parse(data);

  const module = await prisma.module.create({ data: validated });

  revalidatePath(`/admin/courses/${validated.courseId}`);

  return { success: true, module };
}

export async function updateModule(
  id: string,
  data: Partial<z.infer<typeof ModuleSchema>>,
) {
  await requireAdmin();

  const validated = ModuleSchema.partial().parse(data);

  const module = await prisma.module.update({
    where: { id },
    data: validated,
  });

  revalidatePath(`/admin/courses/${module.courseId}`);

  return { success: true, module };
}

export async function deleteModule(id: string) {
  await requireAdmin();

  const module = await prisma.module.findUnique({ where: { id } });
  if (!module) throw new Error("Module not found");

  await prisma.module.delete({ where: { id } });

  revalidatePath(`/admin/courses/${module.courseId}`);

  return { success: true };
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  await requireAdmin();

  await Promise.all(
    moduleIds.map((id, index) =>
      prisma.module.update({ where: { id }, data: { order: index } }),
    ),
  );

  revalidatePath(`/admin/courses/${courseId}`);

  return { success: true };
}

// ============================================================================
// LESSON ACTIONS
// ============================================================================

export async function createLesson(data: z.infer<typeof LessonSchema>) {
  await requireAdmin();

  const validated = LessonSchema.parse(data);

  const lesson = await prisma.lesson.create({ data: validated });

  const module = await prisma.module.findUnique({
    where: { id: validated.moduleId },
  });
  if (module) revalidatePath(`/admin/courses/${module.courseId}`);

  return { success: true, lesson };
}

export async function updateLesson(
  id: string,
  data: Partial<z.infer<typeof LessonSchema>>,
) {
  await requireAdmin();

  const validated = LessonSchema.partial().parse(data);

  const lesson = await prisma.lesson.update({
    where: { id },
    data: validated,
    include: { module: true },
  });

  revalidatePath(`/admin/courses/${lesson.module.courseId}`);

  return { success: true, lesson };
}

export async function deleteLesson(id: string) {
  await requireAdmin();

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { module: true },
  });
  if (!lesson) throw new Error("Lesson not found");

  await prisma.lesson.delete({ where: { id } });

  revalidatePath(`/admin/courses/${lesson.module.courseId}`);

  return { success: true };
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  await requireAdmin();

  await Promise.all(
    lessonIds.map((id, index) =>
      prisma.lesson.update({ where: { id }, data: { order: index } }),
    ),
  );

  const module = await prisma.module.findUnique({ where: { id: moduleId } });
  if (module) revalidatePath(`/admin/courses/${module.courseId}`);

  return { success: true };
}

// ============================================================================
// BLOG POST ACTIONS
// ============================================================================

export async function getBlogPosts() {
  await requireAdmin();

  return prisma.blogPost.findMany({
    include: { author: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlogPost(id: string) {
  await requireAdmin();

  return prisma.blogPost.findUnique({
    where: { id },
    include: { author: { select: { name: true, email: true } } },
  });
}

export async function createBlogPost(data: z.infer<typeof BlogPostSchema>) {
  const admin = await requireAdmin();

  const validated = BlogPostSchema.parse(data);

  // Check slug uniqueness
  const existing = await prisma.blogPost.findUnique({
    where: { slug: validated.slug },
  });
  if (existing) throw new Error("A post with this slug already exists");

  const post = await prisma.blogPost.create({
    data: {
      ...validated,
      authorId: admin.id,
      publishedAt: validated.published ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true, post };
}

export async function updateBlogPost(
  id: string,
  data: Partial<z.infer<typeof BlogPostSchema>>,
) {
  await requireAdmin();

  const validated = BlogPostSchema.partial().parse(data);

  // Check slug uniqueness if changing
  if (validated.slug) {
    const existing = await prisma.blogPost.findFirst({
      where: { slug: validated.slug, NOT: { id } },
    });
    if (existing) throw new Error("A post with this slug already exists");
  }

  const currentPost = await prisma.blogPost.findUnique({ where: { id } });

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...validated,
      publishedAt:
        validated.published && !currentPost?.publishedAt
          ? new Date()
          : currentPost?.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return { success: true, post };
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();

  await prisma.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true };
}

export async function toggleBlogPublished(id: string) {
  await requireAdmin();

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: !post.published ? new Date() : post.publishedAt,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");

  return { success: true, published: updated.published };
}

// ============================================================================
// USER ACTIONS
// ============================================================================

export async function getUsers(search?: string, role?: UserRole) {
  await requireAdmin();

  return prisma.user.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(role && { role }),
    },
    include: {
      _count: {
        select: { enrollments: true, clientProjects: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUser(id: string) {
  await requireAdmin();

  return prisma.user.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: { course: { select: { title: true, slug: true } } },
      },
      clientProjects: {
        select: { id: true, name: true, status: true },
      },
      _count: {
        select: { lessonCompletions: true },
      },
    },
  });
}

export async function updateUser(
  id: string,
  data: z.infer<typeof UpdateUserSchema>,
) {
  const admin = await requireAdmin();

  // Prevent self-demotion from admin
  if (id === admin.id && data.role && data.role !== "ADMIN") {
    throw new Error("Cannot demote yourself from admin");
  }

  const validated = UpdateUserSchema.parse(data);

  const user = await prisma.user.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);

  return { success: true, user };
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();

  // Prevent self-deletion
  if (id === admin.id) {
    throw new Error("Cannot delete yourself");
  }

  // Soft delete by setting deletedAt
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/admin/users");

  return { success: true };
}

// ============================================================================
// STATS ACTIONS
// ============================================================================

export async function getAdminStats() {
  await requireAdmin();

  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalProjects,
    totalRevenue,
    recentEnrollments,
    popularCourses,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.project.count(),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.enrollment.findMany({
      take: 10,
      orderBy: { enrolledAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { studentCount: "desc" },
      select: { id: true, title: true, studentCount: true },
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    totalProjects,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentEnrollments,
    popularCourses,
  };
}
