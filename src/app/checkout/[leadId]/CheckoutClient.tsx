"use client";
import { useState } from "react";
import { PRICING_PACKAGES } from "@/config/pricing";
import { processCheckout } from "@/app/actions/checkout-actions";
import { Button } from "@/components/ui/button";

export default function CheckoutClient({ leadId }: { leadId: string }) {
  const [companyName, setCompanyName] = useState("");
  const [goal, setGoal] = useState("");
  const [packageId, setPackageId] = useState(PRICING_PACKAGES[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await processCheckout(leadId, { companyName, goal, packageId, termsAccepted });
      window.location.href = result.paymentUrl;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Complete Setup</h2>
      <form onSubmit={handleCheckout} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">Company Name</label>
          <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">Main Goal</label>
          <textarea required value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white" rows={3}></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-black dark:text-white">Select Package</label>
          <select value={packageId} onChange={e => setPackageId(e.target.value)} className="w-full p-2 border rounded bg-transparent dark:text-white">
            {PRICING_PACKAGES.map(p => (
              <option key={p.id} value={p.id} className="text-black">{p.name} - ₦{p.priceNGN}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input required type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="terms" className="text-sm text-black dark:text-white">I accept the Terms and Privacy Policy</label>
        </div>
        <Button disabled={loading || !termsAccepted} type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded">
          {loading ? "Processing..." : "Pay with Paystack (Test)"}
        </Button>
      </form>
    </div>
  );
}
