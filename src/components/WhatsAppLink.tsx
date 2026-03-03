"use client";
import type { MouseEvent, ReactNode } from "react";
import { trackWhatsAppCTA } from "@/lib/analytics";
import { useTrackEvent } from '@/hooks/useAnalytics';

export default function WhatsAppLink({
  href,
  source,
  className,
  children,
  onClick,
}: {
  href: string;
  source: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void | boolean | Promise<void | boolean>;
}) {
  const trackEvent = useTrackEvent();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    trackWhatsAppCTA(source);
    try {
      await trackEvent('whatsapp_cta_clicked', { source });
    } catch {
      // swallow
    }
    const allowNavigation = onClick ? (await onClick(event)) !== false : true;

    if (allowNavigation) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
