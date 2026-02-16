"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold gradient-text">
          ShadowSpark
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a key={l.href} href={l.href} className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]">
                {l.label}
              </Link>
            )
          )}
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/demo"
            className="rounded-lg border border-[#d4a843]/50 px-4 py-2 text-sm font-semibold text-[#d4a843] transition-all hover:border-[#d4a843] hover:bg-[#d4a843]/10"
          >
            Request a Demo
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:from-[#e8c56d] hover:to-[#d4a843]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="text-slate-400 md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-[#0a0f1a]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4 p-4">
            {links.map((l) =>
              l.href.startsWith("/#") ? (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-400 hover:text-[#d4a843]">
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-400 hover:text-[#d4a843]">
                  {l.label}
                </Link>
              )
            )}
            <Link href="/login" onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">Sign In</Link>
            <Link
              href="/demo"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-[#d4a843]/50 px-4 py-2 text-center font-semibold text-[#d4a843]"
            >
              Request a Demo
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#c0935a] px-4 py-2 text-center font-semibold text-slate-900">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
