"use server";

import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name is required"),
  teamSize: z.string().optional(),
  message: z.string().optional(),
});

export type LeadState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function submitEnterpriseLead(
  prevState: LeadState,
  formData: FormData,
): Promise<LeadState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const validatedFields = LeadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    teamSize: formData.get("teamSize"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Please check your inputs.",
      message: validatedFields.error.issues[0].message,
    };
  }

  // TODO: Integrate with CRM or Email Service (e.g., Resend, HubSpot)
  // For now, we log to console as per "Lead Magnet" MVP
  console.log("--- NEW ENTERPRISE LEAD ---");
  console.log(validatedFields.data);
  console.log("---------------------------");

  return {
    success: true,
    message:
      "Request received! Our corporate training team will contact you within 24 hours.",
  };
}
