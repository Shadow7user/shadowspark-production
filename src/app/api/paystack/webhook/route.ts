import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

async function notifySlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url || url.includes("T00000000")) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (error) {
    console.error("Slack notification failed:", error);
  }
}

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

    try {
      const [payment, lead, demo] = await prisma.$transaction([
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

      // Fire-and-forget notification
      const audit = (lead.miniAuditData as any) || {};
      notifySlack(
        `🚀 *New ShadowSpark Sale!*\n*Lead:* ${lead.phoneNumber}\n*Business:* ${audit.companyName || 'Unknown'}\n*Amount:* $10 (Demo Fee)\n*Approve now:* https://shadowspark-tech.org/operator`
      );

    } catch (error) {
      console.error("Transaction failed:", error);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ok" });
}
