
import crypto from "crypto";
import Paystack from "paystack-api";
import { prisma } from "@/lib/prisma";
import { createTransaction } from "@/server/actions/ledger.actions";
import {
  PaymentProvider,
  CreatePaymentIntentParams,
  CreatePaymentIntentResult,
} from "@/server/payments/core/provider";
import { PaymentProviderName, PaymentStatus } from "@prisma/client";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export class PaystackProvider implements PaymentProvider {
  name = "paystack";
  private paystack: any;

  constructor() {
    this.paystack = new Paystack(PAYSTACK_SECRET_KEY);
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<CreatePaymentIntentResult> {
    const { amount, currency, userEmail, userId, metadata } = params;

    // Paystack expects the amount in the smallest currency unit (kobo for NGN)
    const transaction = await this.paystack.transaction.initialize({
      email: userEmail,
      amount: Number(amount),
      currency,
      metadata: {
        user_id: userId,
        ...metadata,
      },
    });

    if (!transaction.status || !transaction.data) {
      throw new Error("Failed to create Paystack transaction");
    }

    // Create a corresponding payment record in our database
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        provider: PaymentProviderName.PAYSTACK,
        providerPaymentId: transaction.data.reference,
      },
    });

    return {
      clientSecret: transaction.data.access_code, // Not a client secret, but Paystack calls it this
      paymentId: payment.id,
    };
  }

  async handleWebhookEvent(payload: Buffer, signature: string): Promise<void> {
    this.verifyWebhookSignature(payload, signature);

    const event = JSON.parse(payload.toString());

    // Log the event for idempotency
    const existingEvent = await prisma.webhookEvent.findFirst({
      where: {
        provider: PaymentProviderName.PAYSTACK,
        eventId: event.id,
      },
    });

    if (existingEvent) {
      console.log(`Webhook event ${event.id} already processed.`);
      return;
    }

    await prisma.webhookEvent.create({
      data: {
        provider: PaymentProviderName.PAYSTACK,
        eventId: event.id,
        eventType: event.event,
        payload: event.data,
      },
    });

    // Process only successful charges
    if (event.event === "charge.success") {
      await this.processSuccessfulPayment(event.data);
    }
  }

  private verifyWebhookSignature(payload: Buffer, signature: string): void {
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (hash !== signature) {
      throw new Error("Invalid Paystack webhook signature");
    }
  }

  private async processSuccessfulPayment(data: any): Promise<void> {
    const reference = data.reference;

    const payment = await prisma.payment.findUnique({
      where: { providerPaymentId: reference },
      include: { user: true },
    });

    if (!payment) {
      // This could happen if the payment was initiated outside our system
      console.warn(`Payment with reference ${reference} not found.`);
      return;
    }

    if (payment.status === PaymentStatus.SUCCESSFUL) {
      console.log(`Payment ${payment.id} already processed.`);
      return;
    }

    // In a real application, you would need to find the correct user account
    // and the correct internal accounts for the ledger transaction.
    // For now, we'll use placeholder IDs.
    const userAccountId = "clx...."; // Placeholder for user's wallet account ID
    const revenueAccountId = "clx...."; // Placeholder for internal revenue account ID

    await prisma.$transaction(async (tx) => {
      // Update the payment status
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.SUCCESSFUL },
      });

      // Create the ledger transaction
      await createTransaction(
        {
          description: `Wallet funding via Paystack - ${reference}`,
          idempotencyKey: `paystack-charge-${reference}`,
          entries: [
            {
              accountId: userAccountId,
              direction: "DEBIT",
              amount: payment.amount,
            },
            {
              accountId: revenueAccountId,
              direction: "CREDIT",
              amount: payment.amount,
            },
          ],
        },
        tx as any // Pass the transaction client
      );
    });

    console.log(`Successfully processed payment ${payment.id}`);
  }
}
