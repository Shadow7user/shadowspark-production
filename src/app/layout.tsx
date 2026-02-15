import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
              description:
                "AI-powered business solutions for Nigerian SMEs",
              areaServed: "NG",
              sameAs: [],
            }),
          }}
        />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
