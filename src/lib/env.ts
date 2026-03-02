export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  serviceName: process.env.SERVICE_NAME ?? "shadowspark-platform",
  logLevel: process.env.LOG_LEVEL ?? "info",
  metricsToken: process.env.METRICS_TOKEN ?? "",
  // ── Twilio ────────────────────────────────────────────────────────────
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioWhatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER ?? "",
  // ── Meta WhatsApp Business API ────────────────────────────────────────
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET ?? "",
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
  waPhoneNumberIdSales: process.env.WA_PHONE_NUMBER_ID_SALES ?? "",
  waPhoneNumberIdSupport: process.env.WA_PHONE_NUMBER_ID_SUPPORT ?? "",
  // ── Base URL / versioning ─────────────────────────────────────────────
  nextPublicBaseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000",
  serviceVersion: process.env.npm_package_version ?? "0.1.0",
} as const;
