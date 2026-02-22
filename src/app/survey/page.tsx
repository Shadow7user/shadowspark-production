import type { Metadata } from "next";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your feedback with ShadowSpark. Help us improve our AI automation platform for Nigerian businesses.",
  alternates: {
    canonical: "https://shadowspark-tech.org/survey",
  },
  openGraph: {
    title: "Feedback | ShadowSpark",
    description:
      "Share your feedback with ShadowSpark. Help us improve our AI automation platform for Nigerian businesses.",
    url: "https://shadowspark-tech.org/survey",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Feedback | ShadowSpark",
    description:
      "Share your feedback to help us improve our AI automation platform.",
  },
};

export default function SurveyPage() {
  return (
    <div className={jetbrainsMono.variable}>
      <Navbar />
      <main className="min-h-screen bg-[#09090B] pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold uppercase tracking-widest text-[#06B6D4]">
            Your Voice Matters
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Share your{" "}
            <span className="text-[#06B6D4]">feedback</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Help us build better AI automation tools for Nigerian businesses.
            Your responses shape our product roadmap.
          </p>
        </section>

        {/* Survey embed container */}
        <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
          <div
            id="smcx-sdk"
            className="min-h-[500px] overflow-hidden rounded-2xl border border-[#06B6D4]/20 bg-[#0d1117]"
          />
        </section>
      </main>
      <Footer />

      {/* SurveyMonkey embed script — loads after page is interactive */}
      {/* Set NEXT_PUBLIC_SURVEYMONKEY_URL to your survey's embed script URL */}
      <Script
        src={
          process.env.NEXT_PUBLIC_SURVEYMONKEY_URL ??
          "https://widget.surveymonkey.com/collect/website/js/shadowspark.js"
        }
        strategy="lazyOnload"
      />
    </div>
  );
}
