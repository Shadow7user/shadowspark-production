"use server";
import { prisma } from "@/lib/prisma";

export async function processCheckout(leadId: string, data: { companyName: string; goal: string; packageId: string; termsAccepted: boolean; }) {
  if (!data.termsAccepted) throw new Error("Terms must be accepted");

  // Mock Paystack link generation
  const mockPaystackLink = `https://checkout.paystack.com/test_${leadId}_${Date.now()}`;

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      termsAccepted: true,
      miniAuditData: {
        companyName: data.companyName,
        goal: data.goal,
        packageId: data.packageId,
      },
      paymentRef: mockPaystackLink,
    }
  });

  return { paymentUrl: mockPaystackLink };
}
