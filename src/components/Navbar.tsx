"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#features", label: "Features" },
  { href: "#solutions", label: "Solutions" },
  { href: "#tech", label: "Tech Stack" },
  { href: "#stats", label: "Results" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold gradient-text">
          ShadowSpark
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-slate-400 transition-colors hover:text-cyan-400">
              {l.label}
            </a>
          ))}
          <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-cyan-600 hover:to-purple-700"
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
        <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 p-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-slate-400 hover:text-cyan-400">
                {l.label}
              </a>
            ))}
            <Link href="/login" className="text-slate-300 hover:text-white">Sign In</Link>
            <Link href="/register" className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-center font-semibold text-white">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
