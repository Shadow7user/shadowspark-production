import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const BUSINESS_ID = "1416205687214106";
const WEBHOOK_URL = "https://shadowspark-chatbot-524469712746.europe-central2.run.app/webhooks/whatsapp";
const VERIFY_TOKEN = "ShadowSpark_2026_Final";

async function sendSlackAlert(message: string) {
  const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
  if (SLACK_WEBHOOK) {
    try {
      await fetch(SLACK_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: `🚨 *WhatsApp Bot Health Alert*\n*Status:* FAILED\n*Detail:* \${message}\n*Project:* shadowspark-production-489115` 
        })
      });
    } catch (e: any) {
      console.error("Failed to send Slack alert:", e.message);
    }
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")?.trim();
  const secret = process.env.CRON_SECRET?.trim();
  const expected = `Bearer \${secret}`;
  
  if (authHeader !== expected) {
    console.log("Auth Failure:", { 
      received: authHeader, 
      expected: expected,
      secretLength: secret?.length 
    });
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const status: any = {
    timestamp: new Date().toISOString(),
    webhook: "unknown",
    database: "unknown",
    meta_api: "unknown"
  };

  // 1. Webhook Challenge
  try {
    const res = await fetch(`\${WEBHOOK_URL}?hub.mode=subscribe&hub.verify_token=\${VERIFY_TOKEN}&hub.challenge=health_check`);
    const data = await res.text();
    if (data === "health_check") {
      status.webhook = "ok";
    } else {
      status.webhook = "failed";
      await sendSlackAlert("Webhook returned unexpected challenge response.");
    }
  } catch (error: any) {
    status.webhook = "error";
    await sendSlackAlert(`Webhook Unreachable: \${error.message}`);
  }

  // 2. Database Connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    status.database = "ok";
  } catch (error: any) {
    status.database = "error";
    await sendSlackAlert(`Database Connection Failed: \${error.message}`);
  }

  // 3. Meta API Token Validity
  const META_TOKEN = process.env.META_ACCESS_TOKEN;
  if (META_TOKEN) {
    try {
      const res = await fetch(`https://graph.facebook.com/v21.0/\${BUSINESS_ID}?access_token=\${META_TOKEN}&fields=name,status`);
      if (res.ok) {
        status.meta_api = "ok";
      } else {
        const errorData = await res.json();
        status.meta_api = "error";
        await sendSlackAlert(`Meta Token Issue: \${errorData.error?.message || "Unknown API error"}`);
      }
    } catch (error: any) {
      status.meta_api = "error";
      await sendSlackAlert(`Meta Token Issue: \${error.message}`);
    }
  }

  return NextResponse.json(status);
}
