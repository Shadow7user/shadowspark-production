# GitHub Enterprise Features Guide

This document outlines the GitHub Enterprise features available and how to leverage them for the ShadowSpark platform.

## Available Enterprise Features

### 1. GitHub Actions (CI/CD)

**Status**: ✅ Configured (see `.github/workflows/ci.yml`)

GitHub Actions provides automated CI/CD pipelines for:
- Automated linting on every PR
- Build verification
- Type checking
- Automated deployments (can be extended)

**Current Workflows**:
- `ci.yml` - Runs on PRs and pushes to main, performs linting, building, and type checking

**To View Actions**:
```bash
# Via GitHub CLI
gh workflow list
gh run list --workflow=ci.yml
gh run view <run-id>
```

**To Extend**:
- Add testing workflows
- Add deployment to staging/production
- Add dependency updates with Dependabot
- Add code coverage reports

### 2. Code Scanning (CodeQL)

**Status**: ⚠️ Available but not configured

CodeQL performs automatic security analysis on your codebase.

**To Enable**:

1. Via GitHub UI:
   - Go to: Settings → Security → Code scanning
   - Click "Set up code scanning"
   - Select "CodeQL Analysis"
   - Commit the generated workflow file

2. Via CLI:
   ```bash
   gh api \
     --method PUT \
     -H "Accept: application/vnd.github+json" \
     /repos/Shadow7user/shadowspark-production/code-scanning/default-setup \
     -f state='configured' \
     -f languages='javascript-typescript'
   ```

3. Manual workflow (create `.github/workflows/codeql.yml`):
   ```yaml
   name: "CodeQL"
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
     schedule:
       - cron: '0 0 * * 1' # Weekly on Monday
   
   jobs:
     analyze:
       name: Analyze
       runs-on: ubuntu-latest
       permissions:
         actions: read
         contents: read
         security-events: write
       
       strategy:
         matrix:
           language: [ 'javascript-typescript' ]
       
       steps:
       - name: Checkout repository
         uses: actions/checkout@v4
       
       - name: Initialize CodeQL
         uses: github/codeql-action/init@v3
         with:
           languages: ${{ matrix.language }}
       
       - name: Autobuild
         uses: github/codeql-action/autobuild@v3
       
       - name: Perform CodeQL Analysis
         uses: github/codeql-action/analyze@v3
   ```

**Benefits**:
- Automatic vulnerability detection
- Security best practices enforcement
- Integration with GitHub Security tab

### 3. Protected Branches

**Status**: ⚠️ Recommended to configure

Protected branches enforce code quality and review processes.

**To Configure**:

Via GitHub UI:
1. Settings → Branches → Add branch protection rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass before merging
     - Check: CI/CD Pipeline / lint
     - Check: CI/CD Pipeline / build
     - Check: CI/CD Pipeline / type-check
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

Via CLI:
```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/Shadow7user/shadowspark-production/branches/main/protection \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_status_checks[strict]=true \
  -F required_status_checks[contexts][]="CI/CD Pipeline / lint" \
  -F required_status_checks[contexts][]="CI/CD Pipeline / build"
```

### 4. Environments (Deployment Targets)

**Status**: ⚠️ Available but not configured

Environments enable:
- Deployment tracking
- Environment-specific secrets
- Deployment protection rules
- Review requirements for production deploys

**To Configure**:

1. Via GitHub UI:
   - Settings → Environments → New environment
   - Create: `staging`, `production`

2. For each environment, configure:
   - **Deployment protection rules**: Required reviewers for production
   - **Environment secrets**: 
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `OPENAI_API_KEY` (if using)

3. Update deployment workflow (create `.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy-staging:
       name: Deploy to Staging
       runs-on: ubuntu-latest
       environment: staging
       steps:
         - name: Checkout code
           uses: actions/checkout@v4
         
         - name: Deploy to Vercel/hosting
           run: |
             # Add deployment commands here
             echo "Deploying to staging..."
     
     deploy-production:
       name: Deploy to Production
       runs-on: ubuntu-latest
       environment: production
       needs: deploy-staging
       steps:
         - name: Checkout code
           uses: actions/checkout@v4
         
         - name: Deploy to Vercel/hosting
           run: |
             # Add deployment commands here
             echo "Deploying to production..."
   ```

### 5. GitHub Copilot

**Status**: ✅ Available (if enabled on account)

GitHub Copilot provides AI-powered code completion.

**To Verify**:
```bash
gh api /user | grep -i copilot
```

**Usage**:
- Integrated in VS Code, IDEs
- Copilot Chat for code explanations
- Copilot CLI for terminal assistance

### 6. Dependabot

**Status**: ⚠️ Available but not configured

Dependabot automatically creates PRs for dependency updates.

**To Enable**:

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "Shadow7user"
    assignees:
      - "Shadow7user"
    commit-message:
      prefix: "chore"
      include: "scope"
  
  # Enable version updates for GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

### 7. Advanced Security Features

**Status**: ⚠️ May require GitHub Advanced Security license

- **Secret scanning**: Automatically detects committed secrets
- **Dependency review**: Reviews dependency changes in PRs
- **Security advisories**: Private vulnerability reporting

**To Check Availability**:
```bash
gh api /repos/Shadow7user/shadowspark-production | grep -i security
```

## Enterprise Plan Status

**To Check Your Current Plan**:
```bash
# Authenticate first
gh auth login

# Check user plan
gh api /user | jq '.plan'

# Check organization features (if applicable)
gh api /orgs/Shadow7user 2>/dev/null | jq '.plan'
```

## Recommended Setup Priority

1. **High Priority** (Do First):
   - ✅ Enable CI/CD (already done)
   - ⚠️ Enable Protected Branches
   - ⚠️ Enable CodeQL Code Scanning
   - ⚠️ Configure Dependabot

2. **Medium Priority**:
   - ⚠️ Set up Environments (staging/production)
   - ⚠️ Configure deployment workflows
   - ⚠️ Enable branch policies

3. **Low Priority** (Nice to Have):
   - Advanced security features
   - Custom integrations
   - Advanced automation

## Trial Expiration

If on a trial:
- Check expiration: `gh api /user | jq '.plan'`
- Key features to use before expiry: CodeQL, Advanced Security
- After expiry: Core features (Actions, basic security) remain on free tier

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
- [Protected Branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
