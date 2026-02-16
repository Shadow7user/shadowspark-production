import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css"; // Ensure CSS module declaration is recognized

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ShadowSpark Technologies | AI-Powered Business Solutions",
    template: "%s | ShadowSpark",
  },
  description:
    "AI chatbots, BI dashboards, and RPA automation for Nigerian businesses. Automate customer support, generate leads, and scale with ShadowSpark.",
  keywords: [
    "AI chatbot Nigeria",
    "WhatsApp business bot",
    "Nigerian SME automation",
    "business intelligence dashboard",
    "RPA Nigeria",
    "ShadowSpark",
    "customer support AI",
    "lead generation",
  ],
  authors: [{ name: "ShadowSpark Technologies" }],
  creator: "ShadowSpark Technologies",
  metadataBase: new URL("https://shadowspark-tech.org"),
  openGraph: {
    title: "ShadowSpark Technologies | AI-Powered Business Solutions",
    description:
      "AI chatbots, BI dashboards, and RPA automation for Nigerian businesses.",
    url: "https://shadowspark-tech.org",
    siteName: "ShadowSpark Technologies",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowSpark Technologies",
    description:
      "AI chatbots, BI dashboards, and RPA automation for Nigerian businesses.",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShadowSpark",
  },
  other: {
    "facebook-domain-verification": "b2i7hCpw3wbjkwjIhcsc5jok7xk",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ShadowSpark Technologies",
              url: "https://shadowspark-tech.org",
              description: "AI-powered business solutions for Nigerian SMEs",
              areaServed: "NG",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ShadowSpark Technologies",
              url: "https://shadowspark-tech.org",
              description:
                "Enterprise AI automation platform for Nigerian businesses — WhatsApp chatbots, workflow orchestration, and BI dashboards.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://shadowspark-tech.org/blog?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {GA_ID && (
          <>
            {/* Consent mode default — must fire before gtag */}
            <Script id="consent-default" strategy="beforeInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}', {
                'anonymize_ip': true,
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false,
                'user_properties': {
                  'region': Intl.DateTimeFormat().resolvedOptions().timeZone
                }
              });`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1a] text-slate-200`}
      >
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
