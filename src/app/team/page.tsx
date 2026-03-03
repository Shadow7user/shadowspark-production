import type { Metadata } from "next";
import AboutPage from "../about/page";

const title = "Our Team | ShadowSpark Technologies";
const description =
  "Meet the team behind ShadowSpark: Okoronkwo Stephen Chijioke (Founder), Emmanuel (Co-Owner), and Reginald (Sales Lead). Port Harcourt's AI agency.";
const canonical = "https://shadowspark-tech.org/team";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShadowSpark Technologies",
  url: "https://shadowspark-tech.org",
  location: "Port Harcourt, Rivers State, Nigeria",
  founders: ["Okoronkwo Stephen Chijioke", "Emmanuel"],
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

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutPage />
    </>
  );
}
