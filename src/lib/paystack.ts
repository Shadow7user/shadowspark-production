// Direct Paystack API calls to avoid electron dependency from paystack-node package

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    metadata: Record<string, any>;
  };
}

export async function createPaymentLink(params: {
  amount: number;
  email: string;
  reference: string;
  metadata: Record<string, any>;
}) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: params.amount * 100, // Convert to kobo
          email: params.email,
          reference: params.reference,
          metadata: params.metadata,
          channels: ["card", "bank", "ussd", "mobile_money", "bank_transfer"],
        }),
      },
    );

    const data: PaystackInitializeResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        paymentUrl: data.data.authorization_url,
        reference: data.data.reference,
      };
    }

    return { success: false, error: data.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyPayment(reference: string) {
  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data: PaystackVerifyResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        status: data.data.status,
        amount: data.data.amount / 100,
        paidAt: data.data.paid_at,
      };
    }

    return { success: false, error: data.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
