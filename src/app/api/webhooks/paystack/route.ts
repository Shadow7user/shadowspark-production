import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let webhookEvent = null;
  
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    // 1. Verify HMAC signature
    if (hash !== signature) {
      console.warn("❌ Invalid Paystack signature");
      
      // Log failed signature verification
      await prisma.webhookEvent.create({
        data: {
          provider: "paystack",
          event: "signature_verification",
          status: "failed",
          payload: { error: "Invalid signature" },
          error: "HMAC signature mismatch",
        },
      });
      
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("✅ Paystack webhook received:", event.event);

    // 2. Log incoming webhook to WebhookEvent
    webhookEvent = await prisma.webhookEvent.create({
      data: {
        provider: "paystack",
        event: event.event,
        status: "pending",
        payload: event.data,
      },
    });

    // 3. Process logic
    if (event.event === "charge.success") {
      const { reference, amount, metadata } = event.data;

      // Handle invoice payments (B2B Sales)
      if (metadata?.invoiceNumber) {
        const invoice = await prisma.invoice.update({
          where: { invoiceNumber: reference },
          data: {
            paymentStatus: "paid",
            paidAt: new Date(),
          },
        });

        // Link webhook event to invoice
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { invoiceId: invoice.id },
        });

        // Update prospect status to "won"
        if (metadata.prospectId) {
          await prisma.prospect.update({
            where: { id: metadata.prospectId },
            data: { status: "won" },
          });
        }

        console.log("✅ Invoice payment processed:", reference);
        
        // 4. Update status to processed
        await prisma.webhookEvent.update({
          where: { id: webhookEvent.id },
          data: { status: "processed" },
        });

        // 5. Always return 200
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

    // 4. Update status to processed
    if (webhookEvent) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { status: "processed" },
      });
    }

    // 5. Always return 200
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    Sentry.captureException(error);
    
    // Update webhook event status to failed
    if (webhookEvent) {
      await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { 
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }

    // Still return 200 to prevent Paystack retries for processing errors
    return NextResponse.json({ received: true });
  }
}
