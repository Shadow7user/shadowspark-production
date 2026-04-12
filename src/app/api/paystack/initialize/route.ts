import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const { email, amount, leadId } = await req.json();
    
    // In a real V1, we would fetch leadId from session or body
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack uses kobo
        callback_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
        metadata: {
          leadId,
        },
      }),
    });

    const data = await paystackResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Initialization failed" }, { status: 500 });
  }
}
