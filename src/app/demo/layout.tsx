import type { Metadata } from "next";

// Metadata lives here because demo/page.tsx is a client component ("use client").
// Next.js App Router reads metadata from server components only — layouts qualify.
export const metadata: Metadata = {
  title: "Request a Demo",
  description:
    "Request a free, custom demo of ShadowSpark's AI automation platform — scoped to your business, your workflow, and your data. No long-term commitment required.",
  alternates: {
    canonical: "https://shadowspark-tech.site/demo",
  },
  openGraph: {
    title: "Request a Demo | ShadowSpark",
    description:
      "Free custom demo scoped to your business. 30-min discovery call, baseline audit, live demo on your data. No commitment.",
    url: "https://shadowspark-tech.site/demo",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Request a Demo | ShadowSpark",
    description: "Free custom AI automation demo for your Nigerian business.",
  },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
