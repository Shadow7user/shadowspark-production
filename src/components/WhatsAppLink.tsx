"use client";
import { trackWhatsAppCTA } from "@/lib/analytics";

export default function WhatsAppLink({
  href,
  source,
  className,
  children,
}: {
  href: string;
  source: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppCTA(source)}
      className={className}
    >
      {children}
    </a>
  );
}
