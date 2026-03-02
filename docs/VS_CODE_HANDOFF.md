# VS Code Handoff: shadowspark-production

Concise steps to mirror this repo locally (path requested: `/home/shadowweaver/Downloads/Microsoft.VisualStudio.Services (3)`) and keep Copilot context-aware.

## 1) Get the code
```bash
mkdir -p "/home/shadowweaver/Downloads/Microsoft.VisualStudio.Services (3)"
cd "/home/shadowweaver/Downloads/Microsoft.VisualStudio.Services (3)"
git clone https://github.com/Shadow7user/shadowspark-production.git
cd shadowspark-production
```

## 2) VS Code + Copilot setup
- Install VS Code and extensions:
```bash
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
code --install-extension github.vscode-pull-request-github
code --install-extension eamodio.gitlens
code --install-extension Prisma.prisma
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
```
- Set Copilot model: `Ctrl+Shift+P` → **GitHub Copilot: Change Model** → select **Claude Sonnet 4.5 (Anthropic)**.

## 3) Environment file
```bash
cp .env.example .env.local
```
Then fill real values (DB URL, Twilio/WhatsApp numbers, OpenAI key, etc.). Keep phone numbers in env vars only.

## 4) Dependencies & health checks
```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 5) Database sync
```bash
npx prisma db push
```
Expected: “Your database is now in sync…”.

## 6) Make Copilot context-aware (per project)
```bash
mkdir -p .github
cat > .github/copilot-instructions.md <<'EOF'
# ShadowSpark Technologies — Copilot Instructions

## Project
Nigerian AI-powered digital agency. Port Harcourt, Nigeria.

## Team
- Architect: Okoronkwo Stephen Chijioke (+2349045770572)
- Co-Owner: Emmanuel (+2349040014125)
- Sales Lead: Reginald (+2348107677660)

## Stack
Next.js 15, TypeScript strict, Prisma, Neon Postgres, Tailwind, shadcn/ui,
NextAuth v5, Twilio, OpenAI, Cloudflare Workers, Railway, Firebase Analytics

## Rules
- TypeScript strict — no `any`
- Prices in Nigerian Naira (₦)
- Run `npx prisma db push` after schema changes
- Mobile-first; optimize for 3G
- Cyberpunk colors: cyan #00FFD5, purple #BD00FF
- Never hardcode phone numbers — use env vars
- Use pnpm (not npm)

## WhatsApp Channels
- Sales → Reginald: NEXT_PUBLIC_WA_SALES_NUMBER
- Support → Emmanuel: NEXT_PUBLIC_WA_SUPPORT_NUMBER
- Technical → Twilio US: NEXT_PUBLIC_WA_TECHNICAL_NUMBER

## Commands
- Dev server: pnpm dev
- Typecheck: pnpm typecheck
- Lint: pnpm lint
- Test: pnpm test
- Build: pnpm build
- DB push: npx prisma db push
EOF
```
Copilot will read this each session; update as needed.

## 7) Daily workflow
```bash
pnpm dev          # run locally at http://localhost:3000
pnpm lint         # quick sanity
pnpm typecheck    # before PRs
pnpm test         # targeted tests
pnpm build        # final confidence
```

## 8) If CI shows “action_required”
- Ensure branch is up to date: `git pull origin main`
- Re-run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Check GitHub Actions run logs; fix the first failure before re-running.
