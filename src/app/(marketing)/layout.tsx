import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">ShadowSpark</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
            <Link href="/courses" className="text-muted-foreground hover:text-foreground">Academy</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
          </nav>
          <Button asChild><Link href="/login">Login</Link></Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © 2026 ShadowSpark Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
