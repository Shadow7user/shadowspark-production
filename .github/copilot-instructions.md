# GITHUB OPERATIONS & AUTOMATION RULES

## DEPENDABOT CONFIGURATION
- Always use `pnpm` logic for dependency updates.
- Ecosystem: `npm`, Directory: `/`, Schedule: `weekly`.
- Reviewers & Assignees: `Shadow7user`.
- Commit prefix: `chore`.

## CI/CD DEPLOYMENT
- Deployment Target: Cloudflare Workers via `@opennextjs/cloudflare`.
- Primary Branch: `main`.
- Required Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `DATABASE_URL`, `DIRECT_URL`.

## SECURITY & PRISMA
- Monitor for `DATABASE_URL` leaks in PRs.
- Ensure Prisma 6 conventions (no adapters) are maintained in all code suggestions.
- Strict TypeScript: No `any` types in generated snippets.

## GITHUB ENTERPRISE VERIFICATION
- To check Copilot status, use: `gh api /user | grep -i copilot`.
- To check security status, look for Advanced Security license availability.
