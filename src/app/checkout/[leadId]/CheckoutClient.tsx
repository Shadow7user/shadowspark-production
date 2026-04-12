"use client";
import { useState } from "react";
import { PRICING_PACKAGES } from "@/config/pricing";
import { processCheckout } from "@/app/actions/checkout-actions";
import { Button } from "@/components/ui/button";

export default function CheckoutClient({ leadId }: { leadId: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [companyName, setCompanyName] = useState("");
  const [goal, setGoal] = useState("");
  const [leadVolume, setLeadVolume] = useState("0-50");
  const [painPoint, setPainPoint] = useState("");
  const [packageId, setPackageId] = useState(PRICING_PACKAGES[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPackage = PRICING_PACKAGES.find(p => p.id === packageId);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await processCheckout(leadId, { companyName, goal, leadVolume, painPoint, packageId, termsAccepted });
      window.location.href = result.paymentUrl;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Let's Audit Your Needs</h2>
        <p className="text-zinc-500 mb-6">Tell us about your operations so we can configure your personalized demo environment.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">Company Name</label>
            <input required type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white focus:ring-2 focus:ring-blue-500" placeholder="e.g. Acme Corp" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">Monthly Lead Volume</label>
              <select value={leadVolume} onChange={e => setLeadVolume(e.target.value)} className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white">
                <option value="0-50" className="text-black">0 - 50</option>
                <option value="51-200" className="text-black">51 - 200</option>
                <option value="200+" className="text-black">200+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black dark:text-white">Target Package</label>
              <select value={packageId} onChange={e => setPackageId(e.target.value)} className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white">
                {PRICING_PACKAGES.map(p => (
                  <option key={p.id} value={p.id} className="text-black">{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">Biggest Operational Pain Point</label>
            <textarea required value={painPoint} onChange={e => setPainPoint(e.target.value)} className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white" rows={2} placeholder="e.g. Slow response times, lost leads..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">Main Goal with AI</label>
            <textarea required value={goal} onChange={e => setGoal(e.target.value)} className="w-full p-3 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent dark:text-white" rows={2} placeholder="e.g. Automate qualification, 24/7 support..."></textarea>
          </div>
          
          <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 mt-4 rounded-md font-medium text-lg">
            Generate Audit & Continue
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Your Mini-Audit Summary</h2>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg mb-6 border border-blue-100 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Analysis for {companyName || "Your Company"}</h3>
        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
          Handling <strong>{leadVolume} leads/month</strong> with a primary pain point of <em>"{painPoint}"</em> means significant revenue is currently leaking. 
          The <strong>{selectedPackage?.name}</strong> package is positioned to directly resolve this and achieve your goal to <em>"{goal}"</em>.
        </p>
        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
          Next Step: Access your live sandbox environment tailored to this use case.
        </p>
      </div>

      <form onSubmit={handleCheckout} className="space-y-6">
        <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium dark:text-white">Live Demo Access Fee</span>
            <span className="text-xl font-bold dark:text-white">₦1,000</span>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            This fee secures your dedicated environment and is <strong>fully credited toward your final package</strong> ({selectedPackage?.name}) if you choose to proceed.
          </p>
          
          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <input required type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4" />
            <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400">
              I accept the <a href="#" className="underline hover:text-blue-600">Terms of Service</a> and <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>, and I understand this ₦1,000 fee is a credited deposit for the demo environment.
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" onClick={() => setStep(1)} className="w-1/3 bg-zinc-200 text-black hover:bg-zinc-300 py-3 rounded-md">
            Back
          </Button>
          <Button disabled={loading || !termsAccepted} type="submit" className="w-2/3 bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-md font-medium text-lg">
            {loading ? "Processing..." : "Pay ₦1,000 (Test Mode)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
