# ShadowSpark DNS Architecture

This document covers the complete DNS architecture, email infrastructure setup, troubleshooting protocol, domain consolidation strategy, and production verification commands for the ShadowSpark domains.

---

## 1. Full DNS Architecture Diagram

### Domain Structure

```
                         ┌─────────────────────────┐
                         │   shadowspark-tech.org  │
                         │   (Public Website)      │
                         └──────────┬──────────────┘
                                    │
                                    │ A / CNAME
                                    ▼
                         ┌─────────────────────────┐
                         │   Hosting Provider      │
                         │   (Railway / Vercel)    │
                         └─────────────────────────┘


                         ┌─────────────────────────┐
                         │   shadowspark-tech.site │
                         │   (Email Infrastructure)│
                         └──────────┬──────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
   MX → Google              TXT → SPF                  TXT → Verification
   TXT → DKIM               TXT → DMARC                Google Workspace
```

Separation is correct. No conflict. Clean routing.

---

## 2. Visual DNS Map (Complete Record Set)

### 🌐 shadowspark-tech.org (Website Domain)

| Type  | Host | Value                                                          |
| ----- | ---- | -------------------------------------------------------------- |
| A     | @    | Your hosting IP                                                |
| CNAME | www  | @                                                              |
| TXT   | @    | google-site-verification=... (optional, if needed for analytics) |

> **Note**: Do NOT add MX records here unless you want email on this domain.

---

### 📧 shadowspark-tech.site (Email Domain)

#### 1️⃣ Google Workspace Domain Verification

| Type | Host | Value                                                                                     |
| ---- | ---- | ----------------------------------------------------------------------------------------- |
| TXT  | @    | `google-site-verification=YOUR_VERIFICATION_TOKEN_HERE` |

---

#### 2️⃣ MX Records

Remove **all** existing MX records, then add:

| Priority | Mail Server                |
| -------- | -------------------------- |
| 1        | `ASPMX.L.GOOGLE.COM`       |
| 5        | `ALT1.ASPMX.L.GOOGLE.COM`  |
| 5        | `ALT2.ASPMX.L.GOOGLE.COM`  |
| 10       | `ALT3.ASPMX.L.GOOGLE.COM`  |
| 10       | `ALT4.ASPMX.L.GOOGLE.COM`  |

---

#### 3️⃣ SPF Record

| Type | Host | Value                              |
| ---- | ---- | ---------------------------------- |
| TXT  | @    | `v=spf1 include:_spf.google.com ~all` |

> **Hardening Note**: `~all` (soft fail) is safe to start with. After confirming all legitimate senders are covered, switch to `-all` (hard fail) to fully block unauthorized senders and prevent spoofing.

---

#### 4️⃣ DKIM Record

Generate the DKIM key inside Google Admin console, then add:

| Type | Host               | Value                        |
| ---- | ------------------ | ---------------------------- |
| TXT  | `google._domainkey` | *(value provided by Google)* |

---

#### 5️⃣ DMARC Record

| Type | Host    | Value                                                      |
| ---- | ------- | ---------------------------------------------------------- |
| TXT  | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@shadowspark-tech.site` |

**DMARC Hardening Path** (upgrade in stages):

1. Start: `p=none` (monitoring only)
2. Then: `p=quarantine`
3. Finally: `p=reject` (full enforcement)

---

## 3. 5-Minute Email Troubleshooting Protocol

If email fails, follow these steps in order:

### Step 1 — Verify MX Records

```bash
dig mx shadowspark-tech.site
```

Expected: Google mail servers listed. If not → DNS not propagated or wrong zone.

---

### Step 2 — Verify SPF Record

```bash
dig txt shadowspark-tech.site
```

Expected: SPF string `v=spf1 include:_spf.google.com ~all` present.

---

### Step 3 — Verify DKIM Record

```bash
dig txt google._domainkey.shadowspark-tech.site
```

Expected: DKIM public key. If missing → DKIM not added correctly.

---

### Step 4 — Verify DMARC Record

```bash
dig txt _dmarc.shadowspark-tech.site
```

Expected: `v=DMARC1; p=none; rua=mailto:admin@shadowspark-tech.site`

---

### Step 5 — Send a Test Email

1. Send a test email to a Gmail address.
2. In Gmail, click **Show Original** on the received message.
3. Verify all three pass:

```
SPF:   PASS
DKIM:  PASS
DMARC: PASS
```

---

## 4. Domain Consolidation Strategy (Authority Mode)

### Current State

| Purpose | Domain                   |
| ------- | ------------------------ |
| Website | `shadowspark-tech.org`   |
| Email   | `shadowspark-tech.site`  |

This split creates brand dilution. `.org` carries stronger credibility for enterprise and AI infrastructure companies.

### Recommended Authority Structure

| Purpose | Domain                              |
| ------- | ----------------------------------- |
| Primary | `shadowspark-tech.org`              |
| Email   | `hello@shadowspark-tech.org`        |
| Legacy  | `shadowspark-tech.site` → redirect to `.org` |

**Why unify under `.org`**:

- `.org` builds stronger enterprise credibility
- One domain = stronger SEO signal
- Cleaner brand memory for clients
- Better email trust score

### Consolidation Options

**Option A (Recommended) — Full Unification**:

Move Google Workspace to `shadowspark-tech.org` and redirect `.site` → `.org`.

**Option B — Partial (Infrastructure Split)**:

Keep `.site` for internal/transactional email infrastructure but use `.org` exclusively in all public-facing communications.

---

## 5. Final Production Verification Suite

Run the full DNS verification suite:

```bash
# Check MX routing
dig mx shadowspark-tech.site

# Check SPF + verification TXT
dig txt shadowspark-tech.site

# Check DKIM
dig txt google._domainkey.shadowspark-tech.site

# Check DMARC
dig txt _dmarc.shadowspark-tech.site

# Alternative MX check
nslookup -type=mx shadowspark-tech.site
```

---

## Final State Checklist

- [ ] Domain verified in Google Workspace
- [ ] MX records pointing to Google mail servers
- [ ] SPF record valid
- [ ] DKIM record authenticated
- [ ] DMARC configured (start with `p=none`)
- [ ] Test email passes SPF / DKIM / DMARC checks
- [ ] No duplicate MX records
- [ ] No Hostinger mail servers active

---

## Related Documentation

- [Setup Guide](./SETUP.md)
- [Diagnostics Reference](./DIAGNOSTICS.md)
- [GitHub Enterprise Guide](./GITHUB_ENTERPRISE.md)
