import { NextResponse } from "next/server";
import { leadSyncQueue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobCounts = await leadSyncQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed"
    );

    const queueLength = jobCounts.waiting + jobCounts.active;
    
    let queueStatus = "IDLE";
    if (queueLength > 5) {
      queueStatus = "SURGE";
    } else if (queueLength > 0) {
      queueStatus = "PROCESSING";
    }

    return NextResponse.json({
      queueStatus,
      queueLength,
      jobCounts,
    });
  } catch (error) {
    console.error("Failed to fetch queue stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue stats" },
      { status: 500 }
    );
  }
}
