# SS-2026-01 — Auth Implementation Validation Checklist

**Document ID:** SS-2026-01  
**Version:** 1.0  
**Q1 Rollout Deadline:** 2026-03-31  
**Script:** `auth-implement.ps1` (Cursor agent / GitHub Actions §2.4)

---

## 1. Risk Mitigation Mapping

| Human Risk | Mitigation | Corresponding Control |
|------------|------------|----------------------|
| **Fear 1:** Dev team fears code conflicts | Direct agent execution (GitHub Actions clause §2.4) | `auth-implement.ps1` is non-interactive, CI-callable; no manual merge during run |
| **Fear 2:** Stakeholders doubt precision | Step-by-step validation (NIST SP 800-53 Rev5) | Phases Validate → Implement → SmokeTest with discrete, auditable steps |
| **Fear 3:** Execs worry downtime | Zero-interrupt rollout (AWS Well-Architected Framework 2024) | Validate + build before deploy; SmokeTest uses isolated port; no production DB or app changes in script |

---

## 2. Validation Steps (NIST SP 800-53 Rev5 — Stepwise Verification)

### Phase: Validate

| Step | ID | Description | Pass Criteria | Sign-off |
|------|-----|-------------|---------------|----------|
| Env and secrets | V1 | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `DATABASE_URL` present (or `NEXTAUTH_URL` defaulted) | No "Missing" error | [ ] |
| Auth and API files | V2 | `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/login/page.tsx`, `src/middleware.ts`, `prisma/schema.prisma` exist | All paths found | [ ] |
| Dependencies | V3 | `package.json` includes `next-auth`, `@prisma/client` | Both present in dependencies | [ ] |

### Phase: Implement

| Step | ID | Description | Pass Criteria | Sign-off |
|------|-----|-------------|---------------|----------|
| Install | I1 | `npm install` | Exit 0 | [ ] |
| Prisma client | I2 | `npx prisma generate` | Exit 0 | [ ] |
| Build | I3 | `npm run build` | Exit 0 | [ ] |

### Phase: SmokeTest

| Step | ID | Description | Pass Criteria | Sign-off |
|------|-----|-------------|---------------|----------|
| Build exists | S0 | `.next` exists (when not `-DryRun`) | Dir present | [ ] |
| Server start | S1 | `npx next start -p <SmokePort>` | Job started; no Fail state | [ ] |
| GET /login | S2 | HTTP 200 | Status 200 | [ ] |
| GET /api/auth/providers | S3 | HTTP 200 | Status 200 | [ ] |
| GET /api/auth/session | S4 | HTTP 200 or 401 | Status 200 or 401 | [ ] |

---

## 3. Script Usage (Alignment with Cursor Agent / GitHub Actions)

| Scenario | Command | Use Case |
|----------|---------|----------|
| Full run | `.\auth-implement.ps1 -Phase Full` | Pre-deploy and post-deploy check |
| Validate only | `.\auth-implement.ps1 -Phase Validate` | Pre-commit or CI pre-step |
| Implement only | `.\auth-implement.ps1 -Phase Implement` | Build and generate (no HTTP checks) |
| Smoke only | `.\auth-implement.ps1 -Phase SmokeTest -SmokePort 3002` | After deploy; avoids port clash with dev |
| Stakeholder preview | `.\auth-implement.ps1 -Phase Full -DryRun` | Log-only; no execution (Fear 2) |

**Exit codes:**  
`0` = all pass | `1` = Validate failed | `2` = Implement failed | `3` = SmokeTest failed

---

## 4. Approval Readiness

| Item | Status | Notes |
|------|--------|-------|
| Cursor agent script | [ ] | File: `auth-implement.ps1` |
| Validation checklist | [x] | Doc ID: SS-2026-01 (this document) |

---

## 5. References

- **NIST SP 800-53 Rev5** — Step-by-step validation and control assessment
- **AWS Well-Architected Framework 2024** — Operational excellence, zero-interrupt deployment
- **GitHub Actions** — Direct agent execution, non-interactive runs (§2.4)
- **Accenture Digital 2024** — Deployment error reduction benchmark
- **Forrester TEI 2023** — Dev cycle cost savings
- **Gartner MQ 2025** — Error rate and implementation-time targets
