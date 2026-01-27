import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.warn("❌ Invalid Paystack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("✅ Paystack webhook received:", event.event);

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata } = event.data;

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          reference,
          amount: amount / 100, // Paystack sends amount in kobo
          currency: "NGN",
          status: "SUCCESS",
          provider: "PAYSTACK",
          userId: metadata?.userId || "",
          metadata: metadata || {},
        },
      });

      console.log("✅ Payment created:", payment.id);

      // Create enrollment if courseId and userId in metadata
      if (metadata?.courseId && metadata?.userId) {
        const enrollment = await prisma.enrollment.create({
          data: {
            userId: metadata.userId,
            courseId: metadata.courseId,
            paymentRef: reference,
            progress: 0,
            completed: false,
          },
        });

        console.log("✅ Enrollment created:", enrollment.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
