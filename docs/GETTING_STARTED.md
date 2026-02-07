# Getting Started with LOGISTICORE

This guide will help you set up the LOGISTICORE development environment and start contributing.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 20.x LTS or higher ([Download](https://nodejs.org/))
- **npm**: 10.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Code Editor**: VS Code, Cursor, or your preferred IDE

### Recommended Tools
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shadow7user/shadowspark-production.git
cd shadowspark-production
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies for the root workspace and all packages/applications.

### 3. Build Shared Packages

```bash
npm run build:packages
```

This builds the shared packages (@logisticore/data-models and @logisticore/sim-engine) that other applications depend on.

## Project Structure

```
logisticore/
├── apps/
│   ├── web/                    # Next.js web application
│   ├── demo-api/               # REST API service
│   └── admin/                  # Admin dashboard
├── packages/
│   ├── data-models/            # Shared TypeScript types
│   └── sim-engine/             # Simulation engine
├── docs/                       # Documentation
├── scripts/                    # Build/deployment scripts
├── infra/                      # Infrastructure configs
├── package.json                # Root workspace config
└── turbo.json                  # Turborepo configuration
```

## Development Workflow

### Running Applications

#### Run All Applications
```bash
npm run dev
```

#### Run Specific Applications
```bash
# Web application
npm run dev:web

# Demo API
npm run dev:api

# Admin dashboard
npm run dev:admin
```

### Building

#### Build All
```bash
npm run build
```

#### Build Specific Package
```bash
npm run build:data-models
npm run build:sim-engine
npm run build:web
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific package tests
npm run test:data-models
npm run test:sim-engine
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## Working with Packages

### Using Shared Packages

All applications can import from shared packages:

```typescript
// In any application
import { Shipment, Vehicle, Status } from '@logisticore/data-models';
import { optimizeRoute, simulateFleet } from '@logisticore/sim-engine';
```

### Modifying Packages

1. Make changes to package source code
2. Rebuild the package:
   ```bash
   cd packages/data-models
   npm run build
   ```
3. Changes will be available to all applications

### Adding Dependencies

#### To Root Workspace
```bash
npm install <package-name> -w root
```

#### To Specific Package/App
```bash
npm install <package-name> -w @logisticore/data-models
npm install <package-name> -w apps/web
```

## Creating a New Package

1. Create package directory:
   ```bash
   mkdir -p packages/new-package/src
   cd packages/new-package
   ```

2. Initialize package.json:
   ```json
   {
     "name": "@logisticore/new-package",
     "version": "1.0.0",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch"
     }
   }
   ```

3. Add tsconfig.json
4. Create src/index.ts
5. Update root package.json workspaces if needed

## Creating a New Application

1. Create app directory:
   ```bash
   mkdir -p apps/new-app
   cd apps/new-app
   ```

2. Initialize with your framework (Next.js, Express, etc.)
3. Add to root package.json scripts
4. Configure to use shared packages

## Environment Variables

Each application may require environment variables:

### apps/web
Create `.env.local`:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

### apps/demo-api
Create `.env`:
```env
PORT=4000
DATABASE_URL="postgresql://..."
API_KEY="your-api-key"
```

## Common Tasks

### Add a New Entity Type

1. Edit `packages/data-models/src/entities/newEntity.ts`:
   ```typescript
   export interface NewEntity {
     id: string;
     name: string;
     // ... other fields
   }
   ```

2. Export from `packages/data-models/src/index.ts`:
   ```typescript
   export * from './entities/newEntity';
   ```

3. Rebuild:
   ```bash
   npm run build:data-models
   ```

### Add a New Simulation Algorithm

1. Create `packages/sim-engine/src/algorithms/newAlgorithm.ts`:
   ```typescript
   export function newAlgorithm(input: InputType): OutputType {
     // Implementation
   }
   ```

2. Export from `packages/sim-engine/src/index.ts`
3. Rebuild:
   ```bash
   npm run build:sim-engine
   ```

### Add a New API Endpoint (demo-api)

1. Create route handler in `apps/demo-api/src/routes/`
2. Register route in main app file
3. Test locally:
   ```bash
   npm run dev:api
   curl http://localhost:4000/api/your-endpoint
   ```

## Troubleshooting

### Build Errors

**Problem**: Package not found errors  
**Solution**: Rebuild shared packages:
```bash
npm run build:packages
```

**Problem**: Type errors after updating data-models  
**Solution**: Restart TypeScript server in your editor

### Development Server Issues

**Problem**: Port already in use  
**Solution**: Kill process on port or change port in config:
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependency Issues

**Problem**: Module not found  
**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Git Workflow

### Feature Development

1. Create feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

3. Push and create pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in route optimizer
docs: update getting started guide
refactor: simplify load balancer
test: add tests for delivery simulator
chore: update dependencies
```

## Next Steps

- Read [Architecture Documentation](./ARCHITECTURE.md)
- Explore [API Reference](./API_REFERENCE.md)
- Check out [Contributing Guidelines](./CONTRIBUTING.md)
- Review existing code in packages/

## Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: Create GitHub issue for bugs/features
- **Questions**: Reach out to the team

---

**Happy Coding! 🚀**
