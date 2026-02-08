# 🔍 VSCode Extension Manual Review Checklist

## 📊 Your Current Status

- **Total Installed:** 53 extensions
- **Essential (Keep):** 9 extensions
- **Deprecated (Remove):** 1 extension
- **Needs Review:** 43 extensions ← **YOU ARE HERE**

**Goal:** Reduce to 10-15 total extensions for optimal 8GB RAM performance

---

## ✅ Essential Extensions (Already Identified - KEEP THESE)

1. ✅ `dbaeumer.vscode-eslint` - ESLint
2. ✅ `esbenp.prettier-vscode` - Prettier
3. ✅ `prisma.prisma` - Prisma
4. ✅ `bradlc.vscode-tailwindcss` - Tailwind CSS IntelliSense
5. ✅ `GitHub.copilot` - GitHub Copilot
6. ✅ `GitHub.copilot-chat` - GitHub Copilot Chat
7. ✅ `usernamehw.errorlens` - Error Lens
8. ✅ `YoavBls.pretty-ts-errors` - Pretty TypeScript Errors
9. ✅ `formulahendry.auto-rename-tag` - Auto Rename Tag

**Keep count: 9/15 target**

---

## ❌ Deprecated/Unnecessary (AUTO-REMOVE)

### Already Removed by Cleanup Script:

- ❌ `christian-kohler.npm-intellisense` (built into VSCode)

### Common Deprecated Extensions (Check if You Have These):

```
❌ CoenraadS.bracket-pair-colorizer-2 (built into VSCode)
❌ CoenraadS.bracket-pair-colorizer (built into VSCode)
❌ 2gua.rainbow-brackets (built into VSCode)
❌ shardulm94.trailing-spaces (Prettier handles this)
❌ HookyQR.beautify (Prettier replaces this)
❌ ms-vscode.vscode-typescript-tslint-plugin (use ESLint)
❌ eg2.vscode-npm-script (built into VSCode)
❌ ritwickdey.LiveServer (not needed for Next.js)
❌ ms-vscode.live-server (not needed for Next.js)
```

---

## 🤔 Manual Review Questions (43 Extensions)

### Category 1: Language Support

**Ask yourself:** "Am I actively working with this language?"

**Languages NOT needed for ShadowSpark:**

- ❌ Python extensions (unless you use Python for scripts)
- ❌ Java/C++/C#/Go extensions
- ❌ PHP extensions
- ❌ Ruby/Rust extensions
- ❌ Dart/Flutter extensions

**Keep ONLY if you:**

- Use the language weekly
- Have active projects in that language
- Need it for client work

---

### Category 2: Themes & Icons

**Ask yourself:** "Do I use more than 1 theme?"

**Common culprits:**

- Multiple theme packs installed
- Icon theme you're not using
- Color themes you tried once

**Recommendation:**

- Keep 1 dark theme (e.g., Default Dark Modern)
- Keep 1 icon theme (e.g., Material Icon Theme or VS Code default)
- Remove all others

---

### Category 3: Duplicate Functionality

**Check for these duplicates:**

| Functionality     | Keep ONE, Remove Others                                              |
| ----------------- | -------------------------------------------------------------------- |
| Code formatting   | Prettier ✅ (remove Beautify, JS Beautifier)                         |
| Linting           | ESLint ✅ (remove JSHint, JSLint, TSLint)                            |
| Git visualization | GitLens (if you use it) OR Git Graph (pick one)                      |
| Snippets          | ES7+ React Snippets OR JavaScript Snippets (pick one)                |
| Spell checking    | Code Spell Checker (if you want it)                                  |
| Path completion   | Built-in ✅ (remove Path Autocomplete, Path IntelliSense duplicates) |

---

### Category 4: Rarely Used Tools

**Review these categories:**

**Database Tools** (if not using):

- MongoDB extensions
- SQL Server extensions
- PostgreSQL extensions (you use Prisma + Neon instead)

**Framework-Specific** (if not using):

- Angular extensions
- Vue extensions
- Svelte extensions
- Django/Flask extensions

**Docker/Container Tools** (if not using on 8GB RAM):

- Docker extensions
- Kubernetes extensions

**Cloud Provider Tools** (if not deploying with them):

- AWS Toolkit
- Azure Tools
- Google Cloud Tools

---

### Category 5: Performance-Heavy Extensions

**These can slow down VSCode:**

| Extension Type            | Impact     | Decision                          |
| ------------------------- | ---------- | --------------------------------- |
| Large language packs      | High RAM   | Remove if not using translation   |
| Code complexity analyzers | High CPU   | Remove unless actively analyzing  |
| Advanced debuggers        | Medium RAM | Keep only for languages you debug |
| Multiple Markdown preview | Medium     | Keep one (built-in is fine)       |

---

## 📋 Review Workflow

### Step 1: List Your Extensions

```powershell
code --list-extensions > my-extensions.txt
notepad my-extensions.txt
```

### Step 2: Go Through Each Extension

For each extension in the "Needs Review" list, ask:

1. **Have I used this in the last 30 days?**
   - No → Uninstall
   - Yes → Keep (for now)

2. **Is this functionality built into VSCode now?**
   - Yes → Uninstall
   - No → Keep

3. **Do I have another extension that does the same thing?**
   - Yes → Uninstall the less-used one
   - No → Keep

### Step 3: Check "Last Used" in VSCode

1. Open VSCode Extensions panel (`Ctrl+Shift+X`)
2. Click the `...` menu → Sort By → Last Updated
3. Scroll through and identify extensions you haven't touched in months

### Step 4: Uninstall Manually

For each extension you want to remove:

```bash
code --uninstall-extension publisher.extension-name
```

Or use the Extensions panel:

1. Find extension
2. Click gear icon → Uninstall

---

## 🎯 Target Extension List (15 Total)

### Core Development (9 - Already Have)

1. ESLint
2. Prettier
3. Prisma
4. Tailwind CSS
5. GitHub Copilot
6. GitHub Copilot Chat
7. Error Lens
8. Pretty TypeScript Errors
9. Auto Rename Tag

### Optional (Pick 3-6 Max)

- [ ] GitLens (if you want advanced Git features)
- [ ] Code Spell Checker (if you want spell checking)
- [ ] ES7+ React Snippets (if you want React snippets)
- [ ] Todo Tree (if you track TODOs in code)
- [ ] Thunder Client (if you test APIs in VSCode)
- [ ] Markdown All in One (if you write lots of docs)

**Current: 9/15 → Add 3-6 optional → Stop at 15 total**

---

## ⚡ Quick Decision Matrix

```
Extension is for language I don't use → UNINSTALL
Extension duplicates built-in VSCode feature → UNINSTALL
Extension duplicates another extension I have → UNINSTALL (keep best one)
Haven't used in 60+ days → UNINSTALL
Theme/icon pack I don't use → UNINSTALL
Extension for framework I don't use → UNINSTALL

Extension used daily → KEEP
Extension saves significant time → KEEP
Extension is project-critical → KEEP
```

---

## 📊 Expected Performance Gains

| Extensions   | RAM Usage | Startup Time | Responsiveness |
| ------------ | --------- | ------------ | -------------- |
| 53 (current) | ~4.5GB    | 8-12s        | Laggy          |
| 30           | ~3.5GB    | 5-8s         | Better         |
| 15 (target)  | ~2.5GB    | 3-5s         | Fast ✅        |
| 10 (minimal) | ~2GB      | 2-3s         | Very Fast ✅   |

**With 8GB RAM, you want 2-3GB for VSCode, leaving 5-6GB for Chrome, Node.js, etc.**

---

## 🚀 After Review Actions

Once you've reduced to 10-15 extensions:

1. **Restart VSCode**

   ```
   Ctrl+Shift+P → "Developer: Reload Window"
   ```

2. **Check Performance**

   ```powershell
   .\scripts\profile-extensions.ps1
   ```

3. **Verify Extension Host**
   - Extension Host should be <500MB RAM
   - Extension Host should be <5% CPU when idle

4. **Backup Final List**
   ```powershell
   code --list-extensions > extensions-final.txt
   ```

---

## 📝 Review Log Template

Copy this to a text file to track your decisions:

```
EXTENSION REVIEW - [Date]

KEPT (Reason):
- extension.name (used daily for X)
- extension.name (project critical)

REMOVED (Reason):
- extension.name (haven't used in 6 months)
- extension.name (duplicate of Y)
- extension.name (built into VSCode now)

UNCERTAIN (Will Re-evaluate in 30 Days):
- extension.name
```

---

## ⚠️ Safety Tip

**Before mass-uninstalling, backup your current list:**

```powershell
code --list-extensions > extensions-backup-$(Get-Date -Format 'yyyy-MM-dd').txt
```

**To restore later (if needed):**

```powershell
Get-Content extensions-backup-YYYY-MM-DD.txt | ForEach-Object { code --install-extension $_ }
```

---

**Ready to review?**

Start by running:

```powershell
code --list-extensions | Sort-Object
```

Then go through each one using this checklist.

**Target:** Remove 38-43 extensions → Keep 10-15 total
