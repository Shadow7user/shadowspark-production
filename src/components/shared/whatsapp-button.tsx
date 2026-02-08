"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "2349045770572"; // Real number for production
const PREFILLED_MESSAGE = encodeURIComponent(
  "Hi ShadowSpark, I'd like a free AI audit for my business",
);

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${PREFILLED_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ShadowSpark on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-3 text-white font-medium text-sm shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-105 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-4 sm:gap-3 sm:px-5 sm:py-3"
    >
      <MessageCircle className="h-6 w-6 shrink-0" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
