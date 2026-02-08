import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shadowspark-tech.org";
  
  let courseUrls: MetadataRoute.Sitemap = [];
  
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    courseUrls = courses.map((course) => ({
      url: `${baseUrl}/courses/${course.slug}`,
      lastModified: course.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // During build, database might not be accessible
    // Continue with static routes only
    console.warn("Could not fetch courses for sitemap during build:", error);
  }

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...courseUrls,
  ];
}
