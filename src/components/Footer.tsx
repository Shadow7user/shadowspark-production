import Link from "next/link";

const platform = [
  { href: "/#solutions",    label: "Solutions" },
  { href: "/#architecture", label: "Architecture" },
  { href: "/#case-studies", label: "Case Studies" },
  { href: "/#tech-stack",   label: "Tech Stack" },
];

const company = [
  { href: "/pricing",   label: "Pricing" },
  { href: "/security",  label: "Security" },
  { href: "/blog",      label: "Blog" },
  { href: "/about",     label: "About" },
];

const getStarted = [
  { href: "/demo",      label: "Request Demo" },
  { href: "/login",     label: "Sign In" },
  { href: "/register",  label: "Create Account" },
  {
    href: "https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20ShadowSpark",
    label: "WhatsApp Us",
    external: true,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080d18]">

      {/* ── Main grid ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <Link href="/" className="text-xl font-bold gradient-text">
              ShadowSpark
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Enterprise-structured AI automation for Nigerian businesses.
              Measurable ROI from day one.
            </p>
            {/* WhatsApp pill */}
            <a
              href="https://wa.me/2349037621612?text=Hi%2C%20I%27d%20like%20to%20request%20a%20demo%20of%20ShadowSpark"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-600/10 px-4 py-2 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-600/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.525 5.847L0 24l6.336-1.501A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.802 9.802 0 01-5.034-1.387l-.361-.214-3.74.885.934-3.617-.235-.374A9.786 9.786 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.431 0 9.818 4.388 9.818 9.818 0 5.431-4.387 9.818-9.818 9.818z"/>
              </svg>
              +234 903 762 1612
            </a>
          </div>

          {/* Platform column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Platform
            </p>
            <ul className="mt-4 space-y-3">
              {platform.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Company
            </p>
            <ul className="mt-4 space-y-3">
              {company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Get Started
            </p>
            <ul className="mt-4 space-y-3">
              {getStarted.map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#d4a843]"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} ShadowSpark Technologies. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-slate-600">
            <Link href="/security" className="hover:text-slate-400 transition-colors">
              Privacy &amp; Security
            </Link>
            <a href="/#demo" className="hover:text-slate-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
