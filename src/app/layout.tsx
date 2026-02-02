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
  metadataBase: new URL("https://shadowspark-technologies.com"),
  title: {
    default: "ShadowSpark Technologies | AI-Powered Digital Agency Nigeria",
    template: "%s | ShadowSpark Technologies",
  },
  description:
    "Build AI chatbots, custom Next.js websites, and automation systems for Nigerian businesses. Free audit. Fast results. Proven ROI.",
  keywords: [
    "AI chatbot Nigeria",
    "web development Lagos",
    "digital agency Nigeria",
    "business automation",
    "Next.js development",
    "AI agency Lagos",
    "chatbot development",
    "process automation Nigeria",
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
    url: "https://shadowspark-technologies.com",
    siteName: "ShadowSpark Technologies",
    title: "ShadowSpark Technologies | AI-Powered Digital Agency Nigeria",
    description:
      "Build AI chatbots, custom websites, and automation systems. Free audit. Fast results.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "ShadowSpark Technologies Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shadowspark",
    creator: "@shadowspark",
    title: "ShadowSpark Technologies | AI-Powered Digital Agency",
    description: "AI chatbots, websites, automation for Nigerian businesses",
    images: ["/logo.svg"],
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
    canonical: "https://shadowspark-technologies.com",
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
