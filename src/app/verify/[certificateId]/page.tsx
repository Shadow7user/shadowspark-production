import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

interface Props {
  params: Promise<{ certificateId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateId } = await params;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: certificateId },
    include: { user: true, course: true },
  });

  if (!enrollment || !enrollment.completed) {
    return { title: "Certificate Not Found | ShadowSpark Academy" };
  }

  return {
    title: `Certificate: ${enrollment.user.name ?? "Student"} - ${enrollment.course.title}`,
    description: `Verified certificate of completion for ${enrollment.course.title} issued by ShadowSpark AI Academy.`,
    openGraph: {
      title: `Certificate of Completion: ${enrollment.course.title}`,
      description: `Issued to ${enrollment.user.name} on ${new Date(enrollment.completedAt ?? new Date()).toLocaleDateString()}`,
      images: ["/api/og/certificate?id=" + certificateId], // Hypothetical OG image generator
    },
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificateId } = await params;

  // Find the enrollment/certificate by ID
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: certificateId,
      completed: true,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          category: true,
          level: true,
        },
      },
    },
  });

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Certificate Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            This certificate ID is invalid or the course has not been completed
            yet.
          </p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const studentName =
    enrollment.user.name || enrollment.user.email?.split("@")[0] || "Student";
  const completionDate = enrollment.completedAt
    ? new Date(enrollment.completedAt).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="min-h-screen bg-background">
      {/* Verification Header */}
      <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border-b border-green-500/30 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-lg">✓</span>
          </div>
          <span className="text-green-400 font-semibold">
            Verified Certificate from ShadowSpark AI Academy
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Certificate Display */}
        <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg border-4 border-cyan-500/50 p-8 md:p-12 shadow-2xl shadow-cyan-500/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-purple-500 mx-auto" />
            </div>
            <p className="text-cyan-400 font-bold text-sm tracking-widest mt-2">
              SHADOWSPARK TECHNOLOGIES
            </p>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 text-center mb-2">
            Certificate of Completion
          </h1>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8" />

          {/* Details */}
          <div className="text-center space-y-4 mb-8">
            <p className="text-gray-400">This certifies that</p>
            <p className="text-3xl font-bold text-white">{studentName}</p>
            <div className="w-64 h-px bg-cyan-500/30 mx-auto" />
            <p className="text-gray-400">has successfully completed</p>
            <p className="text-2xl font-bold text-purple-400">
              {enrollment.course.title}
            </p>
            <p className="text-gray-500">from ShadowSpark AI Academy</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 pt-8 border-t border-cyan-500/20">
            <div>
              <p>
                Certificate ID:{" "}
                <span className="font-mono text-cyan-400">{certificateId}</span>
              </p>
            </div>
            <div className="text-right">
              <p>Date: {completionDate}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">Course Category</p>
            <p className="font-semibold text-foreground">
              {enrollment.course.category.replace(/_/g, " ")}
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">Skill Level</p>
            <Badge className="mt-1">{enrollment.course.level}</Badge>
          </div>
          <div className="p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground">Completion Date</p>
            <p className="font-semibold text-foreground">{completionDate}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Want to earn your own certificate?
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-600"
            asChild
          >
            <Link href="/courses">Browse AI Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
