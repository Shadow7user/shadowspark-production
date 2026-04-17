import { prisma } from "../src/lib/prisma";
import { format } from "util";

async function watch() {
  console.log("\n[ShadowSpark CLI] Telemetry Pulse Watcher Active.\nScanning SystemEvents, Payments, and Leads...\n");
  
  let lastEventId = "";
  let lastPaymentId = "";

  setInterval(async () => {
    try {
      const events = await prisma.systemEvent.findMany({
        take: 3,
        orderBy: { createdAt: "desc" }
      });
      
      const payments = await prisma.payment.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { lead: true }
      });

      if (events.length > 0 && events[0].id !== lastEventId) {
        lastEventId = events[0].id;
        console.log(`[${events[0].createdAt.toISOString()}] 🚨 TRIPWIRE: ${events[0].digest} - ${events[0].message}`);
      }

      if (payments.length > 0 && payments[0].id !== lastPaymentId) {
        lastPaymentId = payments[0].id;
        console.log(`[${payments[0].createdAt.toISOString()}] 💰 REVENUE: ${payments[0].status.toUpperCase()} - Lead: ${payments[0].lead?.phoneNumber || 'Unknown'}`);
      }
    } catch (e) {
      // ignore transient db errors in watcher
    }
  }, 5000);
}

watch();
