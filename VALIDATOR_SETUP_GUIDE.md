# Validator Setup Guide

Quick guide to install and run the ShadowSpark Architecture Validator.

1. Install dev dependency used for watch mode (optional):

```bash
npm install --save-dev nodemon
```

2. Ensure scripts are present in `package.json`:

```json
"validate:architecture": "node scripts/validate-architecture.js",
"validate:watch": "nodemon --watch src --ext ts,tsx --exec npm run validate:architecture"
```

3. Make pre-commit hook executable (if created):

```bash
chmod +x .git/hooks/pre-commit
```

4. Run the validator:

```bash
npm run validate:architecture
```

If violations are found, fix them before committing. Use `npm run validate:watch` while developing to get instant feedback.
