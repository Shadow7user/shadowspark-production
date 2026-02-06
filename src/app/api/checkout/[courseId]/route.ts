import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ courseId: string }>;
}

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    const session = await auth();

    if (!session?.user?.email || !session?.user?.id) {
      // Redirect to login
      const url = new URL(req.url);
      return NextResponse.redirect(new URL("/login", url.origin));
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
      },
    });

    if (existingEnrollment) {
      const url = new URL(req.url);
      return NextResponse.redirect(
        new URL(`/courses/${course.slug}`, url.origin),
      );
    }

    // Initialize Paystack checkout
    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: Number(course.price) * 100, // Convert Naira to kobo
          currency: "NGN",
          callback_url: `${process.env.NEXTAUTH_URL}/api/checkout/verify`,
          metadata: {
            courseId: course.id,
            userId: session.user.id,
            courseName: course.title,
            custom_fields: [
              {
                display_name: "Course",
                variable_name: "course_name",
                value: course.title,
              },
            ],
          },
          channels: ["card", "bank", "ussd", "mobile_money", "bank_transfer"],
        }),
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      Sentry.captureMessage("Paystack initialization failed", {
        level: "error",
        extra: { courseId, response: paystackData },
      });
      throw new Error("Paystack initialization failed");
    }

    // Redirect to Paystack checkout page
    return NextResponse.redirect(paystackData.data.authorization_url);
  } catch (error) {
    Sentry.captureException(error, {
      extra: { route: "checkout", method: "POST" },
    });

    const url = new URL(req.url);
    return NextResponse.redirect(
      new URL("/courses?error=checkout_failed", url.origin),
    );
  }
}
