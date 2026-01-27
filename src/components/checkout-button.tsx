"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  courseId: string;
  amount: number;
  email: string;
  title: string;
  userId: string;
}

export function CheckoutButton({ courseId, amount, email, title, userId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    
    const handler = (window as unknown as { PaystackPop: { setup: (config: {
      key: string | undefined;
      email: string;
      amount: number;
      currency: string;
      ref: string;
      metadata: { courseId: string; userId: string; title: string };
      callback: (response: { reference: string }) => Promise<void>;
      onClose: () => void;
    }) => { openIframe: () => void } } }).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100, // Convert to kobo
      currency: "NGN",
      ref: `SS-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      metadata: { courseId, userId, title },
      callback: async (response: { reference: string }) => {
        await fetch("/api/enrollments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, paymentReference: response.reference }),
        });
        window.location.href = `/courses/${courseId}/learn`;
      },
      onClose: () => setLoading(false),
    });
    
    handler.openIframe();
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full">
      {loading ? "Processing..." : `Enroll Now - ₦${amount.toLocaleString()}`}
    </Button>
  );
}
