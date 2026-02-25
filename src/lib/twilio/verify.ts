import twilio from "twilio";
import { env } from "@/lib/env";

export type TwilioVerifyResult =
  | { valid: true }
  | { valid: false; reason: string };

export function verifyTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string,
): TwilioVerifyResult {
  if (!signature) {
    return { valid: false, reason: "Missing X-Twilio-Signature header" };
  }

  if (!env.twilioAuthToken) {
    return { valid: false, reason: "Twilio auth token is not configured" };
  }

  const isValid = twilio.validateRequest(
    env.twilioAuthToken,
    signature,
    url,
    params,
  );

  if (!isValid) {
    return { valid: false, reason: "Signature verification failed" };
  }

  return { valid: true };
}
