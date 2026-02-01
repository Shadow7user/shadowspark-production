"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name is required"),
  teamSize: z.string().optional(),
  message: z.string().optional(),
});

const AuditSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(5, "Please describe your challenge"),
  service: z.string().optional(),
});

export type LeadState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function submitFreeAudit(
  prevState: LeadState | undefined,
  formData: FormData,
): Promise<LeadState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("business"),
    phone: formData.get("phone"),
    message: formData.get("challenge"),
    service: formData.get("service"),
  };

  const validated = AuditSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0].message,
    };
  }

  try {
    await prisma.lead.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        company: validated.data.company,
        phone: validated.data.phone,
        message: validated.data.message,
        service: validated.data.service,
        status: "NEW",
      },
    });

    return { success: true, message: "Request received!" };
  } catch (e) {
    console.error("Audit submission failed", e);
    return { success: false, error: "Failed to submit. Please try again." };
  }
}

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

  // Persist to DB if possible, or fallback to log
  try {
    await prisma.lead.create({
      data: {
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        company: validatedFields.data.company,
        message:
          validatedFields.data.message ||
          `Team Size: ${validatedFields.data.teamSize}`,
        service: "Enterprise Inquiry",
        status: "NEW",
      },
    });
  } catch (e) {
    console.error("DB Save failed", e);
    // Fallback to log on DB error so user doesn't see error if DB is down/schema mismatch
    console.log("--- NEW ENTERPRISE LEAD (Fallback) ---");
    console.log(validatedFields.data);
  }

  return {
    success: true,
    message:
      "Thanks! We've received your inquiry and will be in touch shortly.",
  };
}
