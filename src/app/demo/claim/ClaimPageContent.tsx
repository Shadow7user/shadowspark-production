"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClaimPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? "";
  const orgName = searchParams.get("organizationName") ?? "Your Organization";
  const initialized = useRef(false);
  const [, setClaimed] = useState(false);

  useEffect(() => {
    if (!initialized.current && sessionId) {
      initialized.current = true;
      fetch("/api/demo-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(() => setClaimed(true))
        .catch(() => setClaimed(true));
    }
  }, [sessionId]);

  const waMsg = encodeURIComponent(
    `Hello, I generated an AI demo for ${orgName} and want to deploy it.`
  );

  return (
    <main className="min-h-screen bg-[#050508] flex items-center justify-center px-6">
      <div className="max-w-xl w-full rounded-2xl border border-[#00FFD5]/20 bg-white/5 backdrop-blur-md p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#00FFD5] mb-3">
          ShadowSpark Technologies
        </p>
        <h1 className="text-3xl font-bold text-white mb-4">
          We&apos;ll build this system for you
        </h1>
        <p className="text-gray-400 mb-2">
          {orgName} can now deploy this AI system.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          ShadowSpark will configure and deploy everything — website, chatbot, and automation.
        </p>
        <div className="flex flex-col gap-4">
          <a
            href={`https://wa.me/2349045770572?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl font-semibold text-[#050508] bg-[#00FFD5] hover:opacity-90 transition"
          >
            Chat on WhatsApp
          </a>
          <a
            href="https://calendly.com/morontomornica7/audit"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl font-semibold text-[#00FFD5] border border-[#00FFD5]/40 hover:bg-[#00FFD5]/10 transition"
          >
            Book a Strategy Call
          </a>
        </div>
      </div>
    </main>
  );
}
