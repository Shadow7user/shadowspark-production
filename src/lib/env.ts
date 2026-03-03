export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  serviceName: process.env.SERVICE_NAME ?? "shadowspark-platform",
  logLevel: process.env.LOG_LEVEL ?? "info",
  metricsToken: process.env.METRICS_TOKEN ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-2.0-flash-exp",
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET ?? "",
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
  nextPublicBaseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000",
  serviceVersion: process.env.npm_package_version ?? "0.1.0",
} as const;
