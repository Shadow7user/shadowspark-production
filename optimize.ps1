# 1. Close unused apps/browser tabs
# - Do this manually in Windows

# 2. Use Neon for Postgres instead of Docker
# - Already done based on schema.prisma

# 3. Reduce Next.js dev server memory
$nextConfig = @"
/** @type {import('next').NextConfig} */
const nextConfig = {    
  experimental: {
    serverComponents: true,
    maxServerGeneratedChars: 512 * 1024,
  },
}

module.exports = nextConfig
"@
Set-Content -Path "next.config.js" -Value $nextConfig

# 4. Monitor Postgres memory usage
# - Use Neon dashboard to track stats
# - Adjust connection counts if needed

# 5. Use path aliases
$tsConfig = @"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
"@
Set-Content -Path "tsconfig.json" -Value $tsConfig

# 6. Lazy-load non-critical code
# - Identify and update components as needed

# 7. Split large components
# - Refactor large components into smaller units

# 8. Memoize expensive logic 
# - Use useMemo/useCallback where appropriate

Write-Host "Memory optimizations applied. Next steps:"
Write-Host "- Close unused apps/browser tabs"
Write-Host "- Monitor Postgres memory via Neon dashboard"
Write-Host "- Lazy-load non-critical components (update code)"
Write-Host "- Split large components into sub-components"
Write-Host "- Memoize expensive calculations (useMemo/useCallback)"