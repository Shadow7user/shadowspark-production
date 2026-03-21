# SpringBank Documentation Snapshot

## Product Positioning
- SpringBank is a premium digital banking demo foundation built by ShadowSpark Technologies.
- The experience preserves the original public-facing SpringBank visual identity while running on a modern Next.js App Router stack.
- The product framing emphasizes trust, operational clarity, ledger awareness, and a controlled premium tone instead of startup hype.

## Technical Foundation
- Stack: Next.js App Router, TypeScript, Prisma ORM, PostgreSQL.
- Deployment assumptions: pooled `DATABASE_URL` for runtime, `DIRECT_URL` for migration-safe operations.
- The build is intended for hosted deployment and supports seeded evaluation users.

## Customer-Facing Experience
- The public website keeps the original SpringBank brand surface and legacy visual language.
- Sign-in flow: secure online access for customers and admins in an evaluation environment.
- Customer dashboard:
  - established customer profile since 2023
  - total balance visibility
  - masked account numbers
  - recent transaction activity
  - secure transfer submission
- Messaging tone: steady, credible, operational, and banking-grade.

## Operations & Admin
- Admin console is framed as "SpringBank Risk & Operations".
- Admins review large-value transfers, approve or reject them, and leave optional notes.
- Recent decisions are visible in a tabular audit-style view.
- The system models approval workflows, transaction review, and secure handoff between customer and operations roles.

## Demo Credentials & Evaluation Notes
- Demo environment credentials include seeded admin and customer accounts.
- Shared password in the evaluation environment: `DemoBank!123`.
- The environment is an evaluation simulation and does not connect to external payment rails.

## Strategic Cues Relevant To ShadowSpark
- SpringBank demonstrates premium trust cues that matter for fintech reveals:
  - secure sign-in and credential framing
  - masked financial identifiers
  - ledger and transfer awareness
  - approvals and operational oversight
  - mature account history and transaction review surfaces
- SpringBank is a reference build for:
  - banking-grade interface language
  - trust-centered conversion design
  - premium operational framing
  - enterprise-style execution proof
