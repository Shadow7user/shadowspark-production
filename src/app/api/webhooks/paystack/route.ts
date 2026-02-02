import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";

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

      // Handle invoice payments (B2B Sales)
      if (metadata?.invoiceNumber) {
        await prisma.invoice.update({
          where: { invoiceNumber: reference },
          data: {
            paymentStatus: "paid",
            paidAt: new Date(),
          },
        });

        // Update prospect status to "won"
        if (metadata.prospectId) {
          await prisma.prospect.update({
            where: { id: metadata.prospectId },
            data: { status: "won" },
          });
        }

        console.log("✅ Invoice payment processed:", reference);
        return NextResponse.json({ received: true });
      }

      // Handle course enrollment payments (EdTech)
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
            progressPercentage: 0,
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
      { status: 500 },
    );
  }
}
