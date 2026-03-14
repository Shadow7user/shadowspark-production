# ShadowSpark — Marketing Site Rewrite Scope
# For Codex: read this alongside PROJECT_CONTEXT.md before touching any file.

---

## What this is
This is NOT a visual redesign.
This is a funnel clarification + productization rewrite.
The site already looks serious and premium.
The problem is clarity and conversion — not aesthetics.

---

## Business objective
Turn shadowspark-tech.org into the highest-converting
funnel for Nigerian SME automation demos.

Convert visitors into:
- Demo requests (primary)
- WhatsApp conversations (secondary)
- Qualified automation leads

Why WhatsApp is the right secondary CTA — not email, not a form:
- 98% open rate on WhatsApp vs 20% for email
- WhatsApp campaigns convert at 45-60% vs email at 2-5%
- WhatsApp chatbots increase lead generation by 500%+ vs static forms
- Nigerian users reply to WhatsApp messages within 45 seconds on average
- 95% of Nigeria's digital population uses WhatsApp daily
- Businesses using AI chatbots on WhatsApp report 2-4x higher conversion rates
  and average ROI of 148-200% within 12 months

These stats are not decoration — they are the reason every page ends
with "Chat on WhatsApp" and not "Send us an email."

---

## CTA system — enforce across every page

Primary CTA (one per page, above the fold):
  Book Demo
  Link: https://calendly.com/morontomornica7/audit

Secondary CTA:
  Chat on WhatsApp
  Link: https://wa.me/2349045770572

Demote from top-level marketing prominence (keep Sign In in nav only):
  Create Account
  Start Free Trial
  Sign In

Rule: Every marketing page must have exactly ONE primary CTA.
Multiple competing CTAs kill conversion.

---

## What must NOT be touched under any circumstances
- /demo-sites/* routes (all 5 return 200 — do not break them)
- src/app/api/* (all API routes)
- prisma/schema.prisma
- src/lib/prisma.ts
- src/middleware.ts (auth scoping already correct)
- /dashboard, /admin, /finance, /support routes
- NextAuth configuration

---

## Phase 1 — Urgent conversion fixes
## Do these first. Highest revenue impact. Lowest risk.

### 1.1 Repo inspection (do this before any edit)
Run: find src/app -type d | head -80
Run: find src/components -type d | head -40
Report actual folder structure. Confirm route group names before using them.

### 1.2 Remove zero-value metrics
Find and remove any live counters showing 0:
- "Leads Generated: 0"
- "Workflows Active: 0"
- "Clients Served: 0"
- "Projects Completed: 0"
- Any demo stats with empty or zero values
Replace with static, honest social proof copy.
Example replacement: "Built for Nigerian businesses handling 50+ enquiries a week"

### 1.3 Standardize CTA text
Audit every button and link across all marketing pages.
Replace all variants with:
- Primary: "Book Demo" → https://calendly.com/morontomornica7/audit
- Secondary: "Chat on WhatsApp" → https://wa.me/2349045770572
Target variants to replace: "Get Started", "Request Demo", "Try Now",
"Start Free Trial", "Create Account", "Sign Up", "Learn More" (when used as CTA)

### 1.4 Rewrite homepage hero
The headline must address Nigerian SME pain directly.
Target pain points (pick the most relevant to current hero context):
- Manual follow-up eating staff time
- Leads going cold in WhatsApp inbox
- Missed enquiries after business hours
- No way to scale support without hiring

Approved headline directions:
Option A: "Stop losing leads in your WhatsApp inbox."
Option B: "Automate customer support, lead capture, and follow-up for your business."
Option C: "Your customers are on WhatsApp 24/7. Now your business can be too."

Subheadline must explain ShadowSpark's core offer in one sentence.
Above the fold must show: headline + subheadline + "Book Demo" + "Chat on WhatsApp"
Do not change visual layout or color system — copy and CTA only.

### 1.5 Fix internal links
Check all nav links, footer links, and in-page CTA buttons.
Report any that return 404 or point to non-existent routes.

---

## Phase 2 — Page architecture
## Build these after Phase 1 is committed and deployed.

### 2.1 Solutions page
Route: /solutions (confirm if exists, create if not)
Five sections — each must follow: solution name → outcome → who it helps → CTA

Sections:
1. WhatsApp AI Chatbots
   Outcome: "Respond to every enquiry instantly, 24/7 — without hiring"
   Stat to use: "70% of businesses using WhatsApp chatbots report improved customer satisfaction"

2. Lead Qualification & Follow-Up Automation
   Outcome: "Stop chasing cold leads. Qualify and follow up automatically"
   Stat to use: "WhatsApp chatbots increase lead generation by 500%+"

3. Customer Support Automation
   Outcome: "Handle FAQs, complaints, and bookings without manual intervention"

4. BI Dashboards & Business Reporting
   Outcome: "See your business performance in real time — no spreadsheets"

5. Workflow & Back-Office Automation
   Outcome: "Eliminate repetitive manual tasks across your operations"

Each section ends with: "Book Demo" CTA

### 2.2 Industries page
Route: /industries (confirm if exists, create if not)

Primary verticals (full cards — pain + solution + demo site link where available):
1. Real Estate & Property
   Pain: "Enquiries arrive at all hours. Most go unanswered."
   Link to: /demo-sites/logistics if no real estate demo exists yet

2. Retail & E-commerce
   Pain: "Abandoned carts, WhatsApp orders, no follow-up system"

3. Healthcare & Clinics
   Pain: "Appointment no-shows, patient enquiry overload"
   Link to: /demo-sites/hospital

Secondary verticals (smaller cards):
- Logistics → /demo-sites/logistics
- Education → /demo-sites/school
- Professional Services
- Restaurant / Food → /demo-sites/restaurant
- Religious Organisations → /demo-sites/church

Rule: Every industry card links to its demo site if one exists.

### 2.3 Pricing page refactor
Route: /pricing (confirm if exists)
- All prices must be in Naira (₦) — never USD on this page
- Frame as: "managed deployment plans" not SaaS self-serve
- Each plan card must include: price in ₦, what's included, who it's for
- CTA on each plan: "Book Demo" (not "Buy Now" or "Sign Up")
- Add: "All plans include setup, onboarding, and first-month support"
- Add FAQ section: "Do I need a technical team?" → "No."

### 2.4 Security page
Route: /security (confirmed existing, do not break it)
Add executive summary at the very top (3-4 sentences max):
  Target reader: Nigerian business owner, not a CTO
  Must answer: "Is my customer data safe with ShadowSpark?"
Keep all existing technical depth below — remove nothing.
Add at bottom: "Last reviewed: March 2026"

### 2.5 Book Demo page
Route: /book-demo (create if not exists — confirm /demo is not already used)
Sections:
1. What happens in the demo (3 bullet points max)
2. Who it's for (SME owners, ops managers, founders)
3. What to prepare (optional — keep brief)
4. Primary: Calendly embed (https://calendly.com/morontomornica7/audit)
5. Fallback: "Prefer WhatsApp?" → https://wa.me/2349045770572
6. Trust line: "Response within 2 business hours"

---

## Phase 3 — Productization
## Build these after Phase 2 is deployed and tested.

### 3.1 Extract reusable marketing components
Confirm actual component locations first (find src/components -type d).
Components to extract if not already standalone:
- Hero
- TrustStrip
- SolutionGrid
- HowItWorks
- IndustryCard
- PricingCard
- FAQBlock
- CTABlock
- DemoSiteCard

Target directory: src/components/marketing/ (create if not exists)

### 3.2 Industry config files
Location: src/config/industries/
Files: real-estate.ts, retail.ts, healthcare.ts, logistics.ts,
       education.ts, professional-services.ts, restaurant.ts, church.ts
Each file exports:
  name: string
  headline: string
  painPoints: string[]
  solutionSummary: string
  demoSiteSlug: string | null
  primaryCTA: string

### 3.3 Solution config files
Location: src/config/solutions/
Files: whatsapp-chatbots.ts, lead-automation.ts, customer-support.ts,
       bi-dashboards.ts, workflow-automation.ts
Each exports:
  name: string
  headline: string
  outcomes: string[]
  stat: string  ← use the market data stats from PROJECT_CONTEXT.md

### 3.4 Blog internal linking
Every existing blog post must link to:
- One /solutions section
- One /industries section
- /book-demo page
Add a CTA block at bottom of every post if one doesn't exist:
  "Ready to automate your business? Book a free demo."
  CTA: "Book Demo" → https://calendly.com/morontomornica7/audit

### 3.5 Sixth demo site — e-commerce vertical
Route: /demo-sites/ecommerce
Business name: ShopEase NG (fictional)
Industry: Retail / E-commerce
Pain focus: abandoned cart follow-up, order status automation
Follow exact same component structure as /demo-sites/restaurant
Confirm structure of existing demo sites first before building this.

---

## Design constraints — maintain exactly
- Background: #050508
- Primary: #00FFD5
- Accent: #BD00FF
- Style: dark, premium, cyberpunk glassmorphism, mobile-first
- Typography: high contrast, never pure white text
- CTA buttons: high contrast, #00FFD5 or strong contrast on dark bg
- Do not introduce new color variables without explicit instruction
- Do not change existing layout structure — copy and CTAs only in Phase 1

---

## Acceptance checklist — verify before every deploy
[ ] pnpm tsc --noEmit passes
[ ] pnpm lint passes
[ ] pnpm build passes
[ ] No zero-value metrics on any public page
[ ] Every marketing page has exactly one primary CTA ("Book Demo")
[ ] WhatsApp CTA links to: https://wa.me/2349045770572
[ ] Calendly CTA links to: https://calendly.com/morontomornica7/audit
[ ] /demo-sites/logistics returns 200
[ ] /demo-sites/school returns 200
[ ] /demo-sites/restaurant returns 200
[ ] /demo-sites/hospital returns 200
[ ] /demo-sites/church returns 200
[ ] /login works and redirects to /dashboard after auth
[ ] Mobile layout verified on all new/changed pages
[ ] No placeholder text or Lorem ipsum visible anywhere
[ ] No "Sign In" or "Create Account" buttons on pure marketing pages
