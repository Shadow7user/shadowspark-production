"use client";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import {
  grantConsent,
  denyConsent,
  getStoredConsent,
  setUserRegionProperties,
} from "@/lib/analytics";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === "granted") {
      grantConsent();
      setUserRegionProperties();
    } else if (stored === "denied") {
      denyConsent();
    } else {
      // No stored preference — show banner
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    grantConsent();
    setUserRegionProperties();
    setVisible(false);
  }

  function handleDecline() {
    denyConsent();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-white/5 bg-[#0f1521]/95 px-4 py-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Shield size={20} className="mt-0.5 shrink-0 text-[#d4a843]" />
          <p className="text-sm text-slate-400">
            We use cookies and analytics to improve your experience. In
            compliance with Nigeria&apos;s NDPR, we need your consent to collect
            analytics data.{" "}
            <a href="/about" className="text-[#d4a843] hover:text-[#e8c56d]">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-300"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-2 text-sm font-semibold text-white transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
