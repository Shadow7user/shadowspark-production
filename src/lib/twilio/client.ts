import twilio from "twilio";
import { env } from "@/lib/env";

/**
 * Lazily-created Twilio REST client singleton.
 * Returns null when TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN are not set
 * so the app degrades gracefully in environments without Twilio configured.
 */

const globalForTwilio = globalThis as unknown as {
  _twilioClient?: ReturnType<typeof twilio> | null;
};

function createTwilioClient(): ReturnType<typeof twilio> | null {
  if (!env.twilioAccountSid || !env.twilioAuthToken) {
    return null;
  }
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
}

if (!("_twilioClient" in globalForTwilio)) {
  globalForTwilio._twilioClient = createTwilioClient();
}

export function getTwilioClient(): ReturnType<typeof twilio> | null {
  return globalForTwilio._twilioClient ?? null;
}
