
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { PaystackProvider } = await import("@/server/payments/paystack/PaystackProvider");
    const paystackProvider = new PaystackProvider();

    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const payload = await req.text();
    await paystackProvider.handleWebhookEvent(Buffer.from(payload), signature);

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    console.error("Paystack webhook error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
