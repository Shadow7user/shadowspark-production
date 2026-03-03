import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "School Management System Demo | ShadowSpark";
const description =
  "See a live demo of our school management portal. Auto-results, WhatsApp fee reminders, revenue dashboard. Built for Nigerian private schools.";
const canonical = "https://shadowspark-tech.org/demos/school";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShadowSpark School Portal",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "1200000",
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
  keywords: [
    "school management software Nigeria",
    "school portal Port Harcourt",
    "student result system",
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

export default function DemoSchoolLayout({ children }: { children: ReactNode }) {
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
