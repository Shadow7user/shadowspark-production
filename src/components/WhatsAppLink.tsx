"use client";
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
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const trackEvent = useTrackEvent();

  const handleClick = async () => {
    trackWhatsAppCTA(source);
    try {
      await trackEvent('whatsapp_cta_clicked', { source });
    } catch {
      // swallow
    }
    onClick?.();
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
