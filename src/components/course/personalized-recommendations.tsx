"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecommendations } from "@/lib/actions/recommendations";

interface Recommendation {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  thumbnail: string | null;
  level: string;
  category: string;
  studentCount: number;
}

interface PersonalizedRecommendationsProps {
  excludeCourseId?: string;
  limit?: number;
}

export function PersonalizedRecommendations({
  excludeCourseId,
  limit = 3,
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations({ excludeCourseId, limit });

        if (data.recommendations) {
          // Type casting or better typing in action needed.
          // The action returns proper structure.
          setRecommendations(
            data.recommendations as unknown as Recommendation[],
          );
          setIsPersonalized(data.personalized);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [excludeCourseId, limit]);

  if (loading) {
    return (
      <section className="py-12 border-t border-cyan-500/20">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="py-12 border-t border-cyan-500/20">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          {isPersonalized ? "Recommended For You" : "Popular Courses"}
        </h2>
        {isPersonalized && (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400">
            AI Picked
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group relative block bg-gray-900/50 rounded-xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all hover:-translate-y-1"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-800 relative">
              {/* Simplified thumbnail handling */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-cyan-400 px-2 py-1 bg-cyan-950/50 rounded">
                  {course.category}
                </span>
                <span className="text-xs text-gray-400">
                  {course.studentCount} students
                </span>
              </div>

              <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {course.title}
              </h3>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-sm text-gray-400 capitalize">
                  {course.level}
                </span>
                <span className="font-bold text-cyan-200">
                  {typeof course.price === "number" && course.price === 0
                    ? "Free"
                    : `₦${Number(course.price).toLocaleString()}`}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
