import { TrustBadges } from "@/components/trust-badges";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.svg"
              alt="ShadowSpark Technologies"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">
              <span className="text-foreground">Shadow</span>
              <span className="text-cyan-400">Spark</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/services"
              className="text-muted-foreground hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/case-studies"
              className="text-muted-foreground hover:text-foreground"
            >
              Case Studies
            </Link>
            <Link
              href="/free-audit"
              className="text-muted-foreground hover:text-foreground"
            >
              Free Audit
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/investors"
              className="text-muted-foreground hover:text-foreground"
            >
              Investors
            </Link>
          </nav>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t py-12 mt-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <TrustBadges />
          <div className="flex flex-wrap justify-center gap-6 mt-8 mb-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact Us
            </Link>
            <Link
              href="/services"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Academy
            </Link>
            <Link
              href="/investors"
              className="text-sm text-muted-foreground hover:text-foreground md:hidden"
            >
              Investors
            </Link>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              © 2026
              <Image
                src="/logo-icon.svg"
                alt=""
                width={16}
                height={16}
                className="inline"
              />
              ShadowSpark Technologies. All rights reserved.
            </p>
            <p className="mt-2 italic text-cyan-400/70">
              The Spark is Lit. The Shadow is Secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
