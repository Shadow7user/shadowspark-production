import twilio, { Twilio } from "twilio";
import { env } from "@/lib/env";

const accountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
const authToken = env.twilioAuthToken;

const client: Twilio | null =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

const defaultFrom =
  process.env.TWILIO_SMS_NUMBER ??
  process.env.TWILIO_WHATSAPP_NUMBER ??
  "";

export function getTwilioClient(): Twilio | null {
  return client;
}

export async function sendSms(to: string, body: string): Promise<void> {
  if (!client || !defaultFrom) return;

  await client.messages.create({
    to,
    from: defaultFrom,
    body,
  });
}
