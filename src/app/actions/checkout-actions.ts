"use server";
import { prisma } from "@/lib/prisma";

export async function processCheckout(leadId: string, data: { 
  companyName: string; 
  goal: string; 
  leadVolume: string;
  painPoint: string;
  packageId: string; 
  termsAccepted: boolean; 
}) {
  if (!data.termsAccepted) throw new Error("Terms must be accepted");

  // Fixed demo fee
  const demoFeeNGN = 1000;
  const mockPaystackLink = `https://checkout.paystack.com/test_${leadId}_${Date.now()}?amount=${demoFeeNGN * 100}`;

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      termsAccepted: true,
      miniAuditData: {
        companyName: data.companyName,
        goal: data.goal,
        leadVolume: data.leadVolume,
        painPoint: data.painPoint,
        selectedPackage: data.packageId,
        demoFee: demoFeeNGN,
        creditedToFinal: true
      },
      paymentRef: mockPaystackLink,
    }
  });

  return { paymentUrl: mockPaystackLink };
}
