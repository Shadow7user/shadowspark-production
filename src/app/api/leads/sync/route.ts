import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = req.headers.get("x-sync-secret");

  if (secret !== process.env.LEAD_SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phone, name, businessType, goals, source } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const lead = await prisma.lead.upsert({
      where: { phoneNumber: phone },
      update: {
        lastMessage: `Sync from ${source || 'external chatbot'}`,
        miniAuditData: {
          name,
          businessType,
          goals,
          source
        },
        status: "QUALIFIED"
      },
      create: {
        phoneNumber: phone,
        status: "QUALIFIED",
        intent: "SYNC",
        lastMessage: `Initial sync from ${source || 'external chatbot'}`,
        miniAuditData: {
          name,
          businessType,
          goals,
          source
        }
      }
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error("Lead sync error:", error);
    return NextResponse.json({ error: "Failed to sync lead" }, { status: 500 });
  }
}
