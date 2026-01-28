import { z } from "zod";

const baseSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

const prodSchema = baseSchema.extend({
  PAYSTACK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().min(1),
});

const schema = process.env.NODE_ENV === "production" ? prodSchema : baseSchema;

export const env = schema.parse(process.env);
