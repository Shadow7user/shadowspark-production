"use client";
import { trackWhatsAppCTA } from "@/lib/analytics";

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
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackWhatsAppCTA(source);
        onClick?.();
      }}
      className={className}
    >
      {children}
    </a>
  );
}
