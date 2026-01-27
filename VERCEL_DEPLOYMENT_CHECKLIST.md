# ShadowSpark Vercel Deployment Checklist

## Pre-Deployment (Local)
```bash
# Verify build works locally
npm run build

# Run validator one final time
npm run validate:architecture

# Test all pages working
# - http://localhost:3000 (homepage)
# - http://localhost:3000/services (services page)
# - http://localhost:3000/contact (contact form)
```

## Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Connect GitHub account
4. Search for: `Shadow7user/shadowspark-production`
5. Click "Import"

### Step 2: Configure Project
- **Project Name:** shadowspark-production
- **Framework:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 3: Environment Variables
Add to Vercel project settings:
```
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
RESEND_API_KEY=re_xxxxxxxxxxxxx
FOUNDER_EMAIL=your_email@shadowspark.com
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Get production URL
4. Test all pages on production

### Step 5: Post-Deployment
```bash
# Test production URL
curl -I https://shadowspark.vercel.app

# Check analytics in Google Analytics dashboard
# Should see page views + form_submission events
```

## Vercel CLI Deployment (Alternative)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_GA_ID
vercel env add RESEND_API_KEY
vercel env add FOUNDER_EMAIL

# Redeploy with env vars
vercel --prod
```

## Environment Variables Reference

| Variable | Value | Required |
|----------|-------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID (G_...) | Yes |
| `RESEND_API_KEY` | Resend.com API key (re_...) | Optional (email stub works without) |
| `FOUNDER_EMAIL` | Contact form recipient email | Optional (defaults to founder@shadowspark.com) |

## Domain Setup (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add custom domain: shadowspark.com
3. Update DNS records as shown in Vercel
4. SSL certificate auto-renews

## Monitoring Post-Deploy
- **Performance:** Vercel Analytics (automatic)
- **Errors:** Vercel error reporting (automatic)
- **Analytics:** Google Analytics dashboard
- **Email leads:** Check FOUNDER_EMAIL inbox for form submissions

## Rollback (if needed)
```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback
```

## Demo Readiness Summary
**Status:** ✅ Production Ready
- Homepage with hero, services overview, stats, pricing teaser
- Services page with 7 offerings (₦100K–₦500K)
- Contact form with validation, NDPA compliance, Resend integration
- Google Analytics 4 tracking (page views + form submissions)
- Architecture compliance: 47 files, 0 violations
- Responsive design (mobile, tablet, desktop)
- Cyberpunk branding throughout
- Nigerian market localization (phone validation, naira formatting)

**Deployment time:** ~5 minutes
**Next steps after deploy:** Add testimonials page (optional enhancement)
