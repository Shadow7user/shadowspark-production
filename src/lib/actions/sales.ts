"use server";

import { auth } from "@/lib/auth";
import { sendInvoiceEmail } from "@/lib/actions/emails";
import { createPaymentLink } from "@/lib/paystack";
import { generateInvoicePDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schemas
export const ProspectSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  industry: z.string(),
  painPoint: z.string(),
  estimatedValue: z.number().min(100000),
});

export const ProposalSchema = z.object({
  prospectId: z.string(),
  title: z.string().min(5),
  description: z.string(),
  amount: z.number().min(100000),
  timeline: z.string(),
  deliverables: z.array(z.string()),
});

// CREATE prospect (from audit form)
export async function createProspect(data: z.infer<typeof ProspectSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = ProspectSchema.parse(data);

    const prospect = await prisma.prospect.create({
      data: {
        ...validated,
        userId: session.user.id,
        status: "contacted",
      },
    });

    return { success: true, prospect };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// GET all prospects for dashboard
export async function getProspects() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const prospects = await prisma.prospect.findMany({
      where: { userId: session.user.id },
      include: {
        proposals: true,
        invoices: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, prospects };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// GET single prospect
export async function getProspect(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const prospect = await prisma.prospect.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        proposals: true,
        invoices: true,
      },
    });

    if (!prospect) {
      return { success: false, error: "Prospect not found" };
    }

    return { success: true, prospect };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// UPDATE prospect status
export async function updateProspectStatus(
  id: string,
  status: "contacted" | "qualified" | "proposed" | "won" | "lost",
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const prospect = await prisma.prospect.update({
      where: { id },
      data: { status },
    });

    return { success: true, prospect };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// CREATE proposal
export async function createProposal(data: z.infer<typeof ProposalSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const validated = ProposalSchema.parse(data);

    const proposal = await prisma.proposal.create({
      data: {
        ...validated,
        userId: session.user.id,
      },
    });

    return { success: true, proposal };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// GENERATE invoice from proposal
export async function generateInvoice(
  prospectId: string,
  amount: number,
  description: string,
  proposalId?: string,
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Get prospect details
    const prospect = await prisma.prospect.findUnique({
      where: { id: prospectId },
    });
    if (!prospect) throw new Error("Prospect not found");

    // Generate invoice number (INV-001, INV-002, etc.)
    const count = await prisma.invoice.count({
      where: { userId: session.user.id },
    });
    const invoiceNumber = `INV-${String(count + 1).padStart(3, "0")}`;

    // Create Paystack payment link
    const paymentResult = await createPaymentLink({
      amount,
      email: prospect.email,
      reference: invoiceNumber,
      metadata: {
        prospectId,
        invoiceNumber,
        userId: session.user.id,
      },
    });

    if (!paymentResult.success) throw new Error("Payment link creation failed");

    // Create invoice in database
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        prospectId,
        proposalId: proposalId || null,
        userId: session.user.id,
        amount,
        description,
        paymentUrl: paymentResult.paymentUrl!,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Generate PDF
    const pdfData = {
      invoiceNumber,
      date: new Date().toLocaleDateString(),
      dueDate: invoice.dueDate.toLocaleDateString(),
      prospect: {
        name: prospect.name,
        company: prospect.company,
        email: prospect.email,
        phone: prospect.phone,
      },
      items: [
        {
          description,
          quantity: 1,
          unitPrice: amount,
        },
      ],
      total: amount,
      paymentUrl: paymentResult.paymentUrl!,
    };

    const pdfBuffer = await generateInvoicePDF(pdfData);

    // Send email
    await sendInvoiceEmail({
      to: prospect.email,
      invoiceNumber,
      amount,
      paymentUrl: paymentResult.paymentUrl!,
      pdfBuffer,
    });

    return { success: true, invoice };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// GET dashboard stats
export async function getDashboardStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const [totalProspects, proposedCount, wonCount, totalInvoiced] =
      await Promise.all([
        prisma.prospect.count({ where: { userId: session.user.id } }),
        prisma.prospect.count({
          where: { userId: session.user.id, status: "proposed" },
        }),
        prisma.prospect.count({
          where: { userId: session.user.id, status: "won" },
        }),
        prisma.invoice.aggregate({
          where: { userId: session.user.id },
          _sum: { amount: true },
        }),
      ]);

    return {
      success: true,
      stats: {
        totalProspects,
        proposedCount,
        wonCount,
        totalInvoiced: totalInvoiced._sum.amount || 0,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// DOWNLOAD invoice PDF
export async function downloadInvoicePDF(
  invoiceId: string,
): Promise<{ success: boolean; pdfBuffer?: Buffer; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { prospect: true },
    });

    if (!invoice) throw new Error("Invoice not found");

    const pdfData = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.createdAt.toLocaleDateString(),
      dueDate: invoice.dueDate.toLocaleDateString(),
      prospect: {
        name: invoice.prospect.name,
        company: invoice.prospect.company,
        email: invoice.prospect.email,
        phone: invoice.prospect.phone,
      },
      items: [
        {
          description: invoice.description,
          quantity: 1,
          unitPrice: invoice.amount,
        },
      ],
      total: invoice.amount,
      paymentUrl: invoice.paymentUrl || "",
    };

    const pdfBuffer = await generateInvoicePDF(pdfData);
    return { success: true, pdfBuffer };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ADD activity note to prospect
export async function addActivity(prospectId: string, note: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const prospect = await prisma.prospect.findFirst({
      where: { id: prospectId, userId: session.user.id },
    });

    if (!prospect) throw new Error("Prospect not found");

    const activityNote = `[${new Date().toISOString()}] ${note}`;
    const updatedNotes = prospect.notes
      ? `${prospect.notes}\n${activityNote}`
      : activityNote;

    await prisma.prospect.update({
      where: { id: prospectId },
      data: {
        notes: updatedNotes,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
