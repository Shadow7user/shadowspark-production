# ShadowSpark — Codex Task Queue
# Status: [ ] todo | [x] done | [~] in progress

## RULE: Before every commit
# pnpm tsc --noEmit && pnpm lint && pnpm build
# All three must pass. No exceptions.

## RULE: Before touching any file
# Run: find src/app -type d | head -80
# Confirm actual paths before editing or creating anything.

## RULE: First prompt every Codex session
# "Read PROJECT_CONTEXT.md and CODEX_TASKLIST.md before touching any file."

---

## Phase 1 — Urgent conversion fixes (do these first, highest revenue impact)

[ ] 1. Inspect repo structure
      Run: find src/app -type d && find src/components -type d
      Report actual folder names, route groups, and component locations.
      Do not change any files in this step.

[ ] 2. Audit all CTA text across marketing pages
      Find every button and link with text like: "Get Started", "Start Free Trial",
      "Create Account", "Request Demo", "Try Now", "Sign Up"
      Report file paths and line numbers. Do not change yet.

[ ] 3. Remove zero-value metrics
      Find and remove any live stats showing 0 (e.g. "Leads Generated: 0",
      "Clients Served: 0", "Projects Completed: 0")
      Replace with static social proof copy or remove the section entirely.

[ ] 4. Standardize CTA system site-wide
      Primary CTA everywhere: "Book Demo"
      Secondary CTA everywhere: "Chat on WhatsApp"
      WhatsApp link format: https://wa.me/2349045770572
      Booking link format: https://calendly.com/morontomornica7/audit
      Demote "Create Account" and "Start Free Trial" from top-level marketing prominence.
      Keep "Sign In" in nav only — do not remove it from header.

[ ] 5. Rewrite homepage hero section
      Headline target: address Nigerian SME pain directly
      Example direction: "Stop losing leads in your WhatsApp inbox."
      Subheadline: explain ShadowSpark's core offer in one sentence
      Above the fold must show: headline + subheadline + "Book Demo" button + WhatsApp CTA
      Do not change visual design — only copy and CTA text.

[ ] 6. Verify all internal links resolve (no 404s on marketing pages)
      Check nav links, footer links, CTA buttons, and blog post links.

---

## Phase 2 — Page architecture (build after Phase 1 is committed and deployed)

[ ] 7. Solutions page (/solutions)
      Five solution categories:
      - WhatsApp AI Chatbots
      - Lead Qualification & Follow-Up Automation
      - Customer Support Automation
      - BI Dashboards & Business Reporting
      - Workflow & Back-Office Automation
      Each category: heading, 2-line outcome statement, "Book Demo" CTA
      Reuse existing section components wherever possible.

[ ] 8. Industries page (/industries)
      Lead with 3 primary verticals (full cards with pain + solution):
      - Real Estate & Property
      - Retail & E-commerce
      - Healthcare & Clinics
      Secondary verticals (smaller cards): Logistics, Education, Professional Services
      Each vertical links to a demo-site if one exists (check /demo-sites/* routes).

[ ] 9. Pricing page refactor
      Keep Naira-based pricing (never USD on this page)
      Reframe as "managed deployment plans" not SaaS self-serve
      Each plan card must include: price in ₦, what's included, who it's for,
      "Book Demo" CTA (not "Sign Up" or "Buy Now")
      Add: "All plans include setup + onboarding support"

[ ] 10. Security page improvement
       Add executive summary section at the very top (3-4 sentences, non-technical)
       Target reader: Nigerian business owner, not a CTO
       Keep all existing technical depth below it — do not remove any existing content
       Add: "Last reviewed: March 2026"

[ ] 11. Book Demo page (/book-demo or /demo if not already used)
       Sections: what happens in the demo, who it's for, what to prepare
       Primary: Calendly embed (https://calendly.com/morontomornica7/audit)
       Fallback: WhatsApp CTA (https://wa.me/2349045770572)
       Form fields if Calendly not used: Name, Company, Industry, WhatsApp number,
       Main problem to solve
       Trust line: "Response within 2 business hours"

---

## Phase 3 — Productization (after Phase 2)

[ ] 12. Move all marketing section components to src/components/marketing/
        (confirm this path exists first — if not, create it)
        Components to extract: Hero, TrustStrip, SolutionGrid, HowItWorks,
        IndustryCard, PricingCard, FAQBlock, CTABlock, DemoSiteCard

[ ] 13. Create industry config files
        Location: src/config/industries/
        Files: real-estate.ts, retail.ts, healthcare.ts, logistics.ts,
               education.ts, professional-services.ts
        Each file exports: name, headline, painPoints[], solutionSummary,
        demoSiteSlug (if exists), ctaText

[ ] 14. Create solution config files
        Location: src/config/solutions/
        Files: whatsapp-chatbots.ts, lead-automation.ts, customer-support.ts,
               bi-dashboards.ts, workflow-automation.ts
        Each exports: name, headline, outcomes[], integrationsExample[]

[ ] 15. Blog audit — internal linking
        Every existing blog post must link to:
        - One solutions page section
        - One industries page section
        - The /book-demo page
        Add a CTA block at the bottom of every post if one doesn't exist.

[ ] 16. Add sixth demo site: e-commerce vertical
        Route: /demo-sites/ecommerce
        Business name: ShopEase NG (fictional)
        Industry: Retail / E-commerce
        Follow exact same component structure as existing demo sites.

---

## Acceptance checklist (verify before ANY deploy)
[ ] pnpm tsc --noEmit passes
[ ] pnpm lint passes
[ ] pnpm build passes
[ ] No zero-value metrics visible on any public page
[ ] Every marketing page has exactly one primary CTA ("Book Demo")
[ ] WhatsApp CTA links to correct number: wa.me/2349045770572
[ ] /demo-sites/* all return 200 (run curl check)
[ ] /login works and redirects to /dashboard after auth
[ ] Mobile layout tested on all new/changed pages
[ ] No placeholder text or "Lorem ipsum" anywhere

