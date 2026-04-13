import axios from "axios";

async function checkWhatsAppHealth() {
  console.log("--- ShadowSpark WhatsApp Health Audit ---");

  // 1. Check Webhook Availability
  const webhookUrl = "https://shadowspark-chatbot-524469712746.europe-central2.run.app/webhooks/whatsapp";
  const verifyToken = "shadowspark_meta_verify_2026";
  
  try {
    const res = await axios.get(`${webhookUrl}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=health_check`);
    if (res.data === "health_check") {
      console.log("✅ Webhook: Operational (Verification Challenge Passed)");
    } else {
      console.log("❌ Webhook: Unexpected response structure");
    }
  } catch (error: any) {
    console.log(`❌ Webhook: Offline or Error (${error.response?.status || error.message})`);
  }

  // 2. Check Meta API Token Validity
  // Note: In production, this would use GCP Secret Manager.
  // This is a template for the health check logic.
  const metaToken = process.env.META_ACCESS_TOKEN;
  const businessId = "91416205687214106";

  if (!metaToken) {
    console.log("⚠️ Meta Token: Not provided in environment (check Secret Manager)");
  } else {
    try {
      const res = await axios.get(`https://graph.facebook.com/v21.0/${businessId}`, {
        params: { access_token: metaToken, fields: "name,status" }
      });
      console.log(`✅ Meta API: Token Valid (Account: ${res.data.name})`);
    } catch (error: any) {
      const subcode = error.response?.data?.error?.error_subcode;
      if (subcode === 463 || subcode === 467) {
        console.log("❌ Meta API: Token EXPIRED");
      } else {
        console.log(`❌ Meta API: Error (${error.response?.data?.error?.message || error.message})`);
      }
    }
  }

  // 3. Check Chatbot Service Status via logs (Simulated here)
  console.log("ℹ️ Database Check: Requires log inspection for Prisma errors (P1001/P2028).");
}

checkWhatsAppHealth();
