import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function NewCheckoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
      <Suspense fallback={<div>Loading checkout...</div>}>
        <CheckoutClient />
      </Suspense>
    </div>
  );
}
