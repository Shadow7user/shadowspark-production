import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;

  try {
    const reference = url.searchParams.get("reference");

    if (!reference) {
      return NextResponse.redirect(
        new URL("/courses?error=no_reference", origin),
      );
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      Sentry.captureMessage("Payment verification failed", {
        level: "warning",
        extra: { reference, response: verifyData },
      });
      return NextResponse.redirect(
        new URL("/courses?error=payment_failed", origin),
      );
    }

    const { courseId, userId } = verifyData.data.metadata;

    if (!courseId || !userId) {
      Sentry.captureMessage("Missing metadata in Paystack response", {
        level: "error",
        extra: { reference, metadata: verifyData.data.metadata },
      });
      return NextResponse.redirect(
        new URL("/courses?error=invalid_metadata", origin),
      );
    }

    // Check if enrollment already exists (prevent duplicates)
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existingEnrollment) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });
      return NextResponse.redirect(
        new URL(`/courses/${course?.slug || ""}?already_enrolled=true`, origin),
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
        progressPercentage: 0,
        moduleProgress: {},
      },
      include: {
        course: true,
      },
    });

    // Log webhook event for audit trail
    await prisma.webhookEvent.create({
      data: {
        provider: "paystack",
        event: "charge.success",
        status: "success",
        payload: JSON.stringify({
          reference,
          amount: verifyData.data.amount,
          currency: verifyData.data.currency,
          courseId,
          userId,
          courseName: enrollment.course.title,
          paidAt: verifyData.data.paid_at,
        }),
      },
    });

    // Update course student count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentCount: { increment: 1 },
      },
    });

    // TODO: Send enrollment confirmation email via Resend
    // await sendEnrollmentEmail(userId, enrollment.course)

    return NextResponse.redirect(
      new URL(`/courses/${enrollment.course.slug}?enrolled=true`, origin),
    );
  } catch (error) {
    Sentry.captureException(error, {
      extra: { route: "checkout/verify", method: "GET" },
    });
    return NextResponse.redirect(
      new URL("/courses?error=enrollment_failed", origin),
    );
  }
}
