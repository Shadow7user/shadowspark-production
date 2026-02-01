"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(formData: FormData) {
  const validated = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { error: "Invalid fields" };
  }

  // Simulate email sending
  console.log("--- CONTACT FORM ---");
  console.log(validated.data);

  return { success: true };
}
