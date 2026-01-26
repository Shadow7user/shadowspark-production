#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Architecture validation rules
const RULES = [
  {
    name: 'No Prisma in Client Components',
    description: 'Never import or use prisma in client components',
    check: (content, filePath) => {
      if (!content.includes('use client')) return false;
      return /import.*prisma|const.*prisma|prisma\./.test(content);
    },
    suggestion: 'Use tRPC query/mutation or API routes instead'
  },
  {
    name: 'No async in client component body',
    description: 'Client components cannot be async functions',
    check: (content, filePath) => {
      if (!content.includes('use client')) return false;
      return /export\s+(default\s+)?async\s+function/.test(content);
    },
    suggestion: 'Move data fetching to server component or use tRPC hooks'
  },
  {
    name: 'No direct fetch in client components',
    description: 'Avoid direct fetch calls in client components',
    check: (content, filePath) => {
      if (!content.includes('use client')) return false;
      return /fetch\([^)]*\)/.test(content);
    },
    suggestion: 'Use tRPC or create dedicated API routes'
  }
];

function scanDirectory(dir, filePattern) {
  const files = [];
  
  function walk(currentPath) {
    try {
      const items = fs.readdirSync(currentPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item.name);
        
        if (item.isDirectory()) {
          if (!item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== '.next') {
            walk(fullPath);
          }
        } else if (filePattern.test(item.name)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  }
  
  walk(dir);
  return files;
}

function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const errors = [];
    
    for (const rule of RULES) {
      if (rule.check(content, filePath)) {
        errors.push({
          rule: rule.name,
          suggestion: rule.suggestion,
          file: filePath
        });
      }
    }
    
    return errors;
  } catch (e) {
    return [];
  }
}

function main() {
  console.log('🔍 ShadowSpark Architecture Validator');
  console.log('=====================================\n');
  
  const startDir = process.argv[2] || './src';
  const files = scanDirectory(startDir, /\.(ts|tsx|js|jsx)$/);
  
  console.log(`📁 Scanning ${files.length} files...\n`);
  
  let totalErrors = 0;
  
  for (const file of files) {
    const errors = validateFile(file);
    
    if (errors.length > 0) {
      console.log(`📄 ${file}`);
      for (const error of errors) {
        console.log(`  ❌ ${error.rule}`);
        console.log(`     💡 ${error.suggestion}`);
        totalErrors++;
      }
      console.log('');
    }
  }
  
  if (totalErrors === 0) {
    console.log('✅ All checks passed! Your code follows ShadowSpark architecture rules.');
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalErrors} violation(s)`);
    console.log('💡 Review the suggestions above to fix architecture issues.');
    process.exit(1);
  }
}

if (process.argv[1] === __filename) {
  main();
}

export { RULES, validateFile, scanDirectory };
