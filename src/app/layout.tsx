import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shadowspark-tech.org"),
  title: {
    default: "ShadowSpark Technologies | AI Chatbots & Web Development Nigeria",
    template: "%s | ShadowSpark Technologies",
  },
  description:
    "Build AI chatbots, custom websites & automation systems in 2-4 weeks. 60% cheaper than Lagos agencies. Trusted by 12+ Nigerian businesses.",
  keywords: [
    "AI chatbot Nigeria",
    "web development Lagos",
    "custom software Nigeria",
    "business automation Nigeria",
    "WhatsApp chatbot Nigeria",
    "digital agency Lagos",
    "web design Nigeria",
    "mobile app development Nigeria",
  ],
  authors: [{ name: "ShadowSpark Technologies" }],
  creator: "ShadowSpark Technologies",
  publisher: "ShadowSpark Technologies",
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: "/logo-icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://shadowspark-tech.org",
    siteName: "ShadowSpark Technologies",
    title: "AI-Powered Digital Agency | Nigeria",
    description:
      "Enterprise chatbots, websites & automation. 2-4 week delivery. 24/7 support.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "ShadowSpark Technologies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowSpark Technologies | AI Agency Nigeria",
    description: "Build AI chatbots & custom web apps in 2-4 weeks",
    images: ["/logo.svg"],
    creator: "@shadowspark",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shadowspark-tech.org",
  },
  verification: {
    google: "your-google-verification-code", // Add later
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ShadowSpark Technologies",
              url: "https://shadowspark-tech.org",
              logo: "https://shadowspark-tech.org/logo.svg",
              description:
                "AI-powered digital agency building chatbots, websites, and automation for Nigerian businesses",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Lagos",
                addressCountry: "NG",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Sales",
                email: "architect@shadowspark-technologies.com",
                availableLanguage: "English",
              },
              sameAs: [
                "https://linkedin.com/company/shadowspark-technologies",
                "https://twitter.com/shadowspark",
              ],
            }),
          }}
        />
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
