import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "ShadowSpark Technologies | Engineering Tomorrow's Digital Infrastructure",
    template: "%s | ShadowSpark Technologies",
  },
  description: "Nigeria's premier AI-powered digital agency. Web development, AI chatbots, design, SEO, and tech training.",
  keywords: ["AI agency Nigeria", "web development Lagos", "AI chatbots", "digital marketing Nigeria", "tech training"],
  authors: [{ name: "ShadowSpark Technologies" }],
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
    title: "ShadowSpark Technologies | Engineering Tomorrow's Digital Infrastructure",
    description: "The Spark is Lit. The Shadow is Secure.",
    images: [{ url: "/logo.svg", width: 400, height: 100 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowSpark Technologies",
    description: "Engineering Tomorrow's Digital Infrastructure",
    images: ["/logo.svg"],
  },
  robots: { index: true, follow: true },
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
