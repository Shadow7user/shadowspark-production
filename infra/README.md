# LOGISTICORE Infrastructure

This directory contains infrastructure configuration for deploying LOGISTICORE applications.

## Structure

```
infra/
├── docker/          # Docker configurations
│   └── Dockerfile.api
├── k8s/            # Kubernetes manifests (future)
│   └── deployment.yaml
└── README.md
```

## Deployment Targets

### Development
- Local development using npm workspaces
- Hot reload for all applications

### Staging
- Vercel preview deployments
- Automatic PR previews
- Staging database instance

### Production
- Vercel production deployment
- CDN for static assets
- Production database
- Monitoring and alerts

## Docker Support

Docker configurations are provided for containerized deployments:

```bash
# Build demo API image
docker build -f infra/docker/Dockerfile.api -t logisticore-api .

# Run container
docker run -p 4000:4000 logisticore-api
```

## Kubernetes (Future)

Kubernetes manifests for orchestrated deployments will be added in later phases.

## Environment Variables

Each environment requires specific configuration:

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/logisticore_dev
```

### Staging
```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging.db/logisticore
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod.db/logisticore
```

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- `ci.yml`: Run tests and linting on PRs
- `deploy-staging.yml`: Deploy to staging on merge to develop
- `deploy-production.yml`: Deploy to production on merge to main

---

**Status**: 🚧 Week 0-1 Scaffolding Phase
