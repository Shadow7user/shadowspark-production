import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "WhatsApp Chatbot Demos for Nigerian SMEs | ShadowSpark";
const description =
  "Explore ShadowSpark live demos tailored for Nigerian businesses. See WhatsApp chatbots, AI agents, and automation workflows built for Port Harcourt and across Nigeria.";
const canonical = "https://shadowspark-tech.org/demos";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ShadowSpark Technologies",
  url: canonical,
  description:
    "Port Harcourt AI agency delivering WhatsApp chatbots, automation, and demos for Nigerian SMEs.",
  areaServed: "Nigeria",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Port Harcourt",
    addressRegion: "Rivers State",
    addressCountry: "NG",
  },
  sameAs: ["https://shadowspark-tech.org"],
};

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "WhatsApp chatbot Nigeria",
    "AI agency Port Harcourt",
    "ShadowSpark demo",
    "automation demos Nigeria",
  ],
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "ShadowSpark Technologies",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function DemosLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
