"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

/* ── Nav structure ──────────────────────────────────────── */
const platform = [
  { href: "/#solutions",     label: "Solutions" },
  { href: "/#architecture",  label: "Architecture" },
  { href: "/#case-studies",  label: "Case Studies" },
];

const company = [
  { href: "/security",  label: "Security" },
  { href: "/pricing",   label: "Pricing" },
  { href: "/blog",      label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === "/";

  /* Anchor links scroll on homepage; navigate + scroll elsewhere */
  function anchorHref(hash: string) {
    return isHome ? hash : `/${hash}`;
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0f1a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-bold gradient-text">
          ShadowSpark
        </Link>

        {/* ── Desktop nav ──────────────────────────────── */}
        <div className="hidden items-center gap-1 lg:flex">

          {/* Platform dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPlatformOpen(true)}
            onMouseLeave={() => setPlatformOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white">
              Platform <ChevronDown size={13} className={`transition-transform ${platformOpen ? "rotate-180" : ""}`} />
            </button>

            {platformOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="min-w-[200px] rounded-xl border border-slate-800 bg-[#0d1320] py-2 shadow-xl">
                  {platform.map(({ href, label }) => (
                    <a
                      key={href}
                      href={anchorHref(href)}
                      className="block px-4 py-2.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Company links */}
          {company.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="mx-3 h-4 w-px bg-slate-800" />

          {/* Sign In */}
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            Sign In
          </Link>

          {/* Primary CTA */}
          <Link
            href="/demo"
            className="ml-2 rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
          >
            Request Demo
          </Link>
        </div>

        {/* ── Mobile toggle ─────────────────────────────── */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          className="rounded-md p-1.5 text-slate-400 transition-colors hover:text-white lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile menu ───────────────────────────────────── */}
      {open && (
        <div className="border-t border-white/5 bg-[#0a0f1a]/95 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col p-4">

            {/* Platform group */}
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Platform
            </p>
            {platform.map(({ href, label }) => (
              <a
                key={href}
                href={anchorHref(href)}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-slate-400 hover:text-white"
              >
                {label}
              </a>
            ))}

            {/* Company group */}
            <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Company
            </p>
            {company.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-slate-400 hover:text-white"
              >
                {label}
              </Link>
            ))}

            {/* Auth / CTA */}
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-slate-400 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/demo"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-3 text-center text-sm font-semibold text-slate-900"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
