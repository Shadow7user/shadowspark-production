import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!signature) return new Response("No signature", { status: 400 });

  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET || "")
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;
    const leadId = metadata.leadId;

    await prisma.$transaction([
      prisma.payment.create({
        data: {
          amount: event.data.amount / 100,
          status: "success",
          reference,
          leadId,
        },
      }),
      prisma.lead.update({
        where: { id: leadId },
        data: { demoApproved: true, status: "PAID" },
      }),
      prisma.demo.upsert({
        where: { leadId },
        update: { approved: true },
        create: {
          leadId,
          slug: `demo-${leadId}`,
          approved: true,
        },
      }),
    ]);
  }

  return NextResponse.json({ status: "ok" });
}
