import { z } from "zod";

const envSchema = z.object({
  nodeEnv: z.string().default("development"),
  serviceName: z.string().default("shadowspark-platform"),
  logLevel: z.string().default("info"),
  metricsToken: z.string().default(""),
  twilioAuthToken: z.string().default(""),
  openaiApiKey: z.string().default(""),
  whatsappAppSecret: z.string().default(""),
  whatsappVerifyToken: z.string().default(""),
  nextPublicBaseUrl: z.string().default("http://localhost:3000"),
  serviceVersion: z.string().default("0.1.0"),
  waPhoneNumberIdTechnical: z.string().default(""),
  ownerPhone: z.string().default("+2349045770572"),
  emmanuelPhone: z.string().default("+2349040014125"),
  reginaldPhone: z.string().default("+2348107677660"),
  nextPublicWaSalesNumber: z.string().default("2348107677660"),
  nextPublicWaSupportNumber: z.string().default("2349040014125"),
  nextPublicWaTechnicalNumber: z.string().default(""),
});

export const env = envSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  serviceName: process.env.SERVICE_NAME,
  logLevel: process.env.LOG_LEVEL,
  metricsToken: process.env.METRICS_TOKEN,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
  whatsappAppSecret: process.env.WHATSAPP_APP_SECRET,
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
  nextPublicBaseUrl:
    process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXTAUTH_URL,
  serviceVersion: process.env.npm_package_version,
  waPhoneNumberIdTechnical: process.env.WA_PHONE_NUMBER_ID_TECHNICAL,
  ownerPhone: process.env.OWNER_PHONE,
  emmanuelPhone: process.env.EMMANUEL_PHONE,
  reginaldPhone: process.env.REGINALD_PHONE,
  nextPublicWaSalesNumber: process.env.NEXT_PUBLIC_WA_SALES_NUMBER,
  nextPublicWaSupportNumber: process.env.NEXT_PUBLIC_WA_SUPPORT_NUMBER,
  nextPublicWaTechnicalNumber: process.env.NEXT_PUBLIC_WA_TECHNICAL_NUMBER,
});
