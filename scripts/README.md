# 🛠️ ShadowSpark Technologies - Automation Scripts

## 📋 Overview

This folder contains PowerShell and Node.js scripts for managing VSCode extensions and tracking project progress.

---

## ⚡ Scripts Reference

### 1️⃣ `audit-extensions.ps1`

**Purpose:** Lists all installed VSCode extensions and categorizes them (essential/deprecated/needs review)

**Safe:** ✅ Read-only, no modifications

**Run:**

```powershell
.\scripts\audit-extensions.ps1
```

**Output:** Creates `vscode-extension-audit-YYYY-MM-DD-HHMM.txt` in project root

---

### 2️⃣ `cleanup-extensions.ps1`

**Purpose:** Uninstalls deprecated/unnecessary extensions for Next.js 15 stack

**Safe:** ⚠️ **CAUTION** - Modifies VSCode installation

**What it removes:**

- Bracket Pair Colorizer (built into VSCode now)
- Rainbow Brackets (built into VSCode now)
- Trailing Spaces (Prettier handles this)
- Beautify (replaced by Prettier)
- TSLint (replaced by ESLint)
- npm-intellisense (built into VSCode now)
- Live Server (not needed for Next.js)

**Before running:**

1. Run `audit-extensions.ps1` first
2. Review the list manually
3. Backup your extensions list: `code --list-extensions > extensions-backup.txt`

**Run:**

```powershell
.\scripts\cleanup-extensions.ps1
```

**Restore if needed:**

```powershell
Get-Content extensions-backup.txt | ForEach-Object { code --install-extension $_ }
```

---

### 3️⃣ `profile-extensions.ps1`

**Purpose:** Opens VSCode Process Explorer to identify performance bottlenecks

**Safe:** ✅ Diagnostic tool, no modifications

**Run:**

```powershell
.\scripts\profile-extensions.ps1
```

**What to check:**

- Extension Host CPU% (should be <5% when idle)
- Extension Host Memory (should be <500MB)
- Extensions taking >1000ms to activate

**Troubleshooting:**
If Extension Host shows high usage, run Extension Bisect:

1. Press `Ctrl+Shift+P`
2. Type "Help: Start Extension Bisect"
3. Follow prompts to identify problematic extension

---

### 4️⃣ `check-project-phase.ps1`

**Purpose:** Automated project phase assessment (which features are complete)

**Safe:** ✅ Read-only, checks file existence

**Run:**

```powershell
.\scripts\check-project-phase.ps1
```

**Checks:**

- Phase 1: Database schema, auth setup
- Phase 2: UI components, marketing site
- Phase 3: Academy platform
- Phase 4: Client dashboard

**Output:** Progress percentage + next recommended actions

---

### 5️⃣ `validate-structure.js`

**Purpose:** Validates project structure against ShadowSpark requirements

**Safe:** ✅ Read-only, checks file existence

**Run:**

```bash
node scripts/validate-structure.js
```

**Validates:**

- Critical files (Prisma schema, env, configs)
- Optional files (components, pages)
- Reports missing files with exit code

**CI/CD Integration:**
Add to `package.json`:

```json
{
  "scripts": {
    "validate": "node scripts/validate-structure.js"
  }
}
```

Then run: `npm run validate`

---

## 🚀 Recommended Execution Order

### First Time Setup (After Fresh VSCode Install)

```powershell
# 1. Audit current extensions
.\scripts\audit-extensions.ps1

# 2. Review audit output, then cleanup
.\scripts\cleanup-extensions.ps1

# 3. Check performance
.\scripts\profile-extensions.ps1

# 4. Restart VSCode
# Press Ctrl+Shift+P → "Developer: Reload Window"
```

### Daily Development Workflow

```powershell
# Check project phase status
.\scripts\check-project-phase.ps1

# Validate structure before commits
node scripts/validate-structure.js
```

### Troubleshooting Slow VSCode

```powershell
# Identify performance issues
.\scripts\profile-extensions.ps1

# If issues found, audit and cleanup
.\scripts\audit-extensions.ps1
.\scripts\cleanup-extensions.ps1
```

---

## ⚠️ Safety Notes

### Before Running `cleanup-extensions.ps1`:

1. ✅ Backup extension list: `code --list-extensions > my-extensions.txt`
2. ✅ Close all VSCode windows
3. ✅ Review the uninstall list in the script
4. ✅ Run audit first: `.\scripts\audit-extensions.ps1`

### If Something Breaks:

```powershell
# Restore all extensions from backup
Get-Content my-extensions.txt | ForEach-Object { code --install-extension $_ }
```

### Extension Conflicts:

These extensions conflict with our stack:

- ❌ Bracket colorizers (use built-in)
- ❌ TSLint (use ESLint)
- ❌ Beautify (use Prettier)
- ❌ Live Server (use `npm run dev`)

---

## 📊 Understanding Output

### Extension Audit Categories:

**✅ ESSENTIAL** - Keep these (10 extensions)

- ESLint, Prettier, Prisma, Tailwind CSS
- GitHub Copilot, Error Lens, Path IntelliSense
- Auto Rename Tag, Pretty TS Errors, TypeScript Next

**⚠️ DEPRECATED** - Safe to remove

- Built into VSCode or replaced by better tools

**❓ REVIEW** - Manual decision needed

- Extensions not in essential/deprecated lists
- May be language-specific (Python, Java, etc.)
- Remove if not used in last 3 months

### Project Phase Percentages:

- **0-30%**: Foundation setup (database, configs)
- **30-60%**: Phase 1 complete (auth, UI components)
- **60-80%**: Phase 2-4 complete (marketing, academy, dashboard)
- **80-100%**: Phase 5-6 complete (admin CMS, production ready)

---

## 🔧 Customization

### Add Extensions to Essential List:

Edit `audit-extensions.ps1`, line 19:

```powershell
$essentialList = @(
    'your.new-extension',
    # ... existing extensions
)
```

### Modify Deprecated List:

Edit `cleanup-extensions.ps1`, line 9:

```powershell
$toUninstall = @(
    'extension.to-remove',
    # ... existing extensions
)
```

### Add Phase Checks:

Edit `check-project-phase.ps1`, line 9:

```powershell
$phases = @{
    "YourCustomPhase" = @{
        Files = @("path/to/file.tsx")
        Status = "Unknown"
    }
}
```

---

## 📞 Support

**Issues with scripts:**

- Check PowerShell execution policy: `Get-ExecutionPolicy`
- If restricted: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Node.js script errors:**

- Verify Node.js installed: `node --version` (should be 20.x)
- Install dependencies: `npm install`

**Extension conflicts:**

- Disable all extensions: `code --disable-extensions`
- Re-enable one by one to identify conflict

---

## 📝 Maintenance

**Weekly:**

- Run `audit-extensions.ps1` to check for bloat
- Review "Last Used" in VSCode Extensions panel
- Remove unused extensions

**Monthly:**

- Run `profile-extensions.ps1` to check performance
- Update extension list if workflow changes
- Clean up old audit reports

**Before Major Updates:**

- Backup extensions: `code --list-extensions > backup-YYYY-MM-DD.txt`
- Document custom settings
- Test scripts with `--help` flag (if implemented)

---

**Last Updated:** January 2025  
**Maintained By:** ShadowSpark Technologies
