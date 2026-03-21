export const env = {
  fbAppId: process.env.FB_APP_ID ?? "",
  fbBusinessId: process.env.FB_BUSINESS_ID ?? "",
  externalIngestToken:
    process.env.EXTERNAL_INGEST_TOKEN ?? process.env.ADMIN_SECRET ?? "",
  metaAccessToken: process.env.META_ACCESS_TOKEN ?? "",
  metaMarketingAccessToken:
    process.env.META_MARKETING_ACCESS_TOKEN ??
    process.env.META_ACCESS_TOKEN ??
    "",
  metaMarketingTemplateLanguageCode:
    process.env.META_MARKETING_TEMPLATE_LANGUAGE_CODE ?? "en_US",
  metaMarketingTemplateName:
    process.env.META_MARKETING_TEMPLATE_NAME ?? "",
  metaAppSecret:
    process.env.WHATSAPP_APP_SECRET ??
    process.env.META_APP_SECRET ??
    process.env.THREADS_APP_SECRET ??
    "",
  nodeEnv: process.env.NODE_ENV ?? "development",
  ownerWhatsappNumber: process.env.OWNER_WHATSAPP_NUMBER ?? "",
  serviceName: process.env.SERVICE_NAME ?? "shadowspark-platform",
  logLevel: process.env.LOG_LEVEL ?? "info",
  metricsToken: process.env.METRICS_TOKEN ?? "",
  metaVerificationToken:
    process.env.META_VERIFICATION_TOKEN ?? process.env.META_VERIFY_TOKEN ?? "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioWhatsappFrom:
    process.env.TWILIO_NUMBER ?? process.env.TWILIO_WHATSAPP_FROM ?? "",
  whatsappPhoneNumberId:
    process.env.WHATSAPP_PHONE_NUMBER_ID ??
    process.env.META_PHONE_NUMBER_ID ??
    "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  whatsappAppSecret:
    process.env.WHATSAPP_APP_SECRET ??
    process.env.META_APP_SECRET ??
    process.env.THREADS_APP_SECRET ??
    "",
  whatsappVerifyToken:
    process.env.WHATSAPP_VERIFY_TOKEN ??
    process.env.META_VERIFICATION_TOKEN ??
    process.env.META_VERIFY_TOKEN ??
    "",
  nextPublicBaseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000",
  serviceVersion: process.env.npm_package_version ?? "0.1.0",
} as const;
