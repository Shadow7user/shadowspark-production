import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "Short-let Property Management Demo | ShadowSpark";
const description =
  "Live demo: bypass Airbnb fees, unified booking calendar, WhatsApp AI concierge for Port Harcourt short-let property managers.";
const canonical = "https://shadowspark-tech.org/demos/shortlet";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShadowSpark Property Portal",
  applicationCategory: "BusinessApplication",
  offers: { price: "2500000", priceCurrency: "NGN" },
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

export default function DemoShortletLayout({
  children,
}: {
  children: ReactNode;
}) {
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
