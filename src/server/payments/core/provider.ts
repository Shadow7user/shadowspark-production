
import { Payment } from "@prisma/client";

/**
 * Represents the information needed to create a new payment intent.
 */
export interface CreatePaymentIntentParams {
  amount: bigint;      // Amount in the smallest currency unit (e.g., kobo, cents)
  currency: string;     // ISO 4217 currency code
  userEmail: string;
  userId: string;
  metadata?: Record<string, any>; // Optional data to pass to the provider
}

/**
 * The response from creating a payment intent.
 */
export interface CreatePaymentIntentResult {
  clientSecret: string; // A secret used on the client-side to confirm the payment
  paymentId: string;    // The unique ID of the payment in our system
}

/**
 * The standard interface for all payment providers.
 */
export interface PaymentProvider {
  /**
   * The unique name of the provider.
   */
  name: string;

  /**
   * Creates a payment intent with the provider.
   * This is the first step in processing a payment.
   */
  createPaymentIntent(
    params: CreatePaymentIntentParams
  ): Promise<CreatePaymentIntentResult>;

  /**
   * Handles an incoming webhook event from the provider.
   */
  handleWebhookEvent(payload: Buffer, signature: string): Promise<void>;
}
