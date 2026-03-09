
import { NextResponse } from "next/server";
import { PaystackProvider } from "@/server/payments/paystack/PaystackProvider";

const paystackProvider = new PaystackProvider();

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const payload = await req.text();
    await paystackProvider.handleWebhookEvent(Buffer.from(payload), signature);

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 400 }
    );
  }
}
