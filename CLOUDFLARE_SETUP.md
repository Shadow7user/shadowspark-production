# ShadowSpark -> Cloudflare Workers Setup Guide

## Why Cloudflare Workers (not Pages)?
Cloudflare Pages breaks Prisma and Auth.js - no Node.js support.
Cloudflare Workers + @opennextjs/cloudflare = full Node.js support. Free.

## One-time manual steps for founder:

### 1. Create Cloudflare account
cloudflare.com -> sign up free

### 2. Get your Account ID
Right sidebar of any Cloudflare dashboard page

### 3. Create API Token
cloudflare.com/profile/api-tokens
Click "Create Token" -> use "Edit Cloudflare Workers" template

### 4. Add secrets to GitHub repo
github.com/Shadow7user/shadowspark-production/settings/secrets/actions
Add: CLOUDFLARE_API_TOKEN = [your token]
Add: CLOUDFLARE_ACCOUNT_ID = [your account ID]

### 5. Add environment variables to Cloudflare Workers
Run each command below in terminal (wrangler will prompt for value):
npx wrangler secret put AUTH_SECRET
npx wrangler secret put NEXTAUTH_URL
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put DATABASE_URL
npx wrangler secret put DIRECT_URL
npx wrangler secret put POSTGRES_URL_NON_POOLING
npx wrangler secret put PRISMA_CLIENT_ENGINE_TYPE
npx wrangler secret put PAYSTACK_SECRET_KEY
npx wrangler secret put PAYSTACK_PUBLIC_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put FOUNDER_EMAIL

### 6. Add custom domain
Cloudflare Dashboard -> Workers & Pages -> shadowspark-production
-> Custom Domains -> Add -> shadowspark-tech.org

### 7. Kill Vercel (after confirming site works on Cloudflare)
vercel.com -> delete shadowspark-production
vercel.com -> delete shadowspark-platform
vercel.com -> Settings -> Billing -> Downgrade to Hobby (free)
Saving: $20/month = $240/year
