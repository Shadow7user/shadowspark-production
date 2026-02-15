# ShadowSpark Platform

A modern, full-stack business management platform built with Next.js 15, featuring authentication, lead management, and AI-powered capabilities.

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Shadow7user/shadowspark-production.git
cd shadowspark-production

# Run the setup script
./setup-environment.sh

# Follow the prompts to configure your environment
```

### Manual Setup

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables** (see SETUP.md for details)
   - `DATABASE_URL` - Your Neon database connection string
   - `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Initialize database**
   ```bash
   pnpm prisma db push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Comprehensive setup guide with troubleshooting
- **[DIAGNOSTICS.md](./DIAGNOSTICS.md)** - Diagnostic commands quick reference
- **[GITHUB_ENTERPRISE.md](./GITHUB_ENTERPRISE.md)** - GitHub Enterprise features guide
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[Prisma Documentation](https://www.prisma.io/docs)** - Database ORM
- **[NextAuth.js Documentation](https://next-auth.js.org)** - Authentication

## 🛠 Tech Stack

- **Framework**: Next.js 15 with React 19
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript
- **Package Manager**: pnpm

## 📦 Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## 🔧 Troubleshooting

### Database Connection Issues

If you encounter Neon database connection errors:

1. **Verify project is active**: Free tier sleeps after inactivity
   - Visit [Neon Console](https://console.neon.tech) to wake up your project

2. **Test connectivity**:
   ```bash
   nslookup ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech
   nc -zv ep-calm-glade-aglkkal.c-2.eu-central-1.aws.neon.tech 5432 -w 5
   ```

3. **Check hostname for typos**: Common issue with `aglkkal` vs `aglkkkal`

See [DIAGNOSTICS.md](./DIAGNOSTICS.md) or [SETUP.md](./SETUP.md) for more troubleshooting tips.

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test locally
3. Run linting: `pnpm lint`
4. Build to verify: `pnpm build`
5. Commit and push your changes
6. Open a Pull Request

## 📄 License

Private repository - All rights reserved

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Contact: architect@shadowspark-technologies.com
