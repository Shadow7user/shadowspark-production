# 🤖 ClawBot - AI Customer Assistant

ClawBot is ShadowSpark's AI-powered customer assistant that helps Nigerian businesses understand our services 24/7.

## Features

- **24/7 Availability**: Always online to answer questions about services
- **Service Knowledge**: Trained on all ShadowSpark B2B offerings
- **Lead Qualification**: Guides prospects to book free audits
- **Nigerian Context**: Understands local business needs and pricing in Naira
- **Powered by Claude AI**: Uses Anthropic's Claude 3 Haiku for fast, accurate responses

## Quick Deploy

Run the deployment script:

```powershell
.\scripts\deploy-clawbot.ps1
```

Or configure manually:

1. Add `ANTHROPIC_API_KEY=sk-ant-xxxxx` to `.env`
2. Test locally with `npm run dev`
3. Deploy with `vercel --prod`

## Components

- **Widget**: `src/components/clawbot-widget.tsx` - Floating chat interface
- **API**: `src/app/api/clawbot/route.ts` - Claude AI integration
- **Docs**: This file

## Cost

~$15-25/month for 1,000 conversations/day using Claude 3 Haiku.

See full documentation for customization, monitoring, and future enhancements.
