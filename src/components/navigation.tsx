"use client";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const services = [
    { name: "AI Chatbots", href: "/services/chatbots" },
    { name: "Website Development", href: "/services/websites" },
    { name: "Business Automation", href: "/services/automation" },
    { name: "Mobile Apps", href: "/services/mobile-apps" },
    { name: "iOS Apps", href: "/services/ios-apps" },
    { name: "SEO Services", href: "/services/seo" },
    { name: "Tech Consulting", href: "/services/consulting" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
          >
            ShadowSpark
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-cyan-400 transition-colors">
                Services
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-4 border border-border rounded-xl bg-card/95 backdrop-blur shadow-xl">
                  <div className="space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-4 py-2 text-sm rounded-lg hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              Contact
            </Link>

            <a
              href="https://calendly.com/morontomornica7/audit"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Book Audit Call
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold text-muted-foreground mb-2 px-4">
                  Services
                </div>
                <div className="space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium hover:text-cyan-400"
              >
                About
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium hover:text-cyan-400"
              >
                Portfolio
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium hover:text-cyan-400"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 text-sm font-medium hover:text-cyan-400"
              >
                Contact
              </Link>

              <a
                href="https://calendly.com/morontomornica7/audit"
                className="block mx-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-semibold rounded-lg text-center"
              >
                Book Audit Call
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
