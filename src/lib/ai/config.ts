import { env } from "@/lib/env";

const DEFAULT_ESCALATION_NUMBER = "+2348107677660";
const DEFAULT_ESCALATION_NAME = "Reginald";

export function getEscalationContact(): {
  number: string;
  name: string;
  url: string;
} {
  const number = env.whatsappEscalationNumber || DEFAULT_ESCALATION_NUMBER;
  const name = env.whatsappEscalationName || DEFAULT_ESCALATION_NAME;
  const url = `https://wa.me/${number.replace(/\D/g, "")}`;

  return { number, name, url };
}
