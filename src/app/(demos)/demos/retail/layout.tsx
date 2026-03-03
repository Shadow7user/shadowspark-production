import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "AI Retail & WhatsApp Commerce Demo | ShadowSpark";
const description =
  "Live demo: WhatsApp checkout, abandoned cart AI recovery, unified inventory. For Nigerian retail SMEs.";
const canonical = "https://shadowspark-tech.org/demos/retail";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShadowSpark Retail Hub",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "1500000",
    priceCurrency: "NGN",
    availability: "https://schema.org/InStock",
    url: canonical,
  },
  areaServed: "Nigeria",
  url: canonical,
};

export const metadata: Metadata = {
  title,
  description,
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

export default function DemoRetailLayout({ children }: { children: ReactNode }) {
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
