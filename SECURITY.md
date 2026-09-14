# Security Policy — OrbitDesk

## Overview

OrbitDesk is an educational simulator, but it implements security controls modeled on production Modern Workplace environments. No real tenant data is used; all data is simulated in the browser.

## Architecture

### Remote Sessions
- Simulated RDP with Session ID (format `ABC123-RDP`), encrypted indicator, recording indicator, audit log
- No real RDP — Windows 11 desktop simulation with realistic outputs
- Client consent banner, actions logged, secure connection indicator

### Audit Logging
- **Entra Audit Logs:** Who changed CA policy at 08:02, Report-Only OFF → ON — root cause for P1
- **Exchange Audit:** Who released quarantine, who allowed sender
- **Intune Audit:** Who changed compliance policy, who deleted device
- **Remote Access Audit:** Every command (`dsregcmd`, `Get-BitLockerVolume`) logged with timestamp
- All logs include actor, activity, target, time — similar to Entra ID

### RBAC
- **Senior:** Max 5 tickets, skills 7-10, can handle Intune BitLocker, Exchange mail flow
- **Junior:** Max 3 tickets, skills 2-6, needs escalation checklist, cannot do Intune without senior approval
- **Team Lead:** Max 10 tickets, all skills 8, owns roster, escalations, quality
- UI enforces: Junior cannot assign P1 to another junior

### Break Glass
- Emergency admin excluded from all Conditional Access policies
- Prevents lockout when CA blocks all users (P1: 50 users blocked)
- Referenced in What If tool and audit logs — Microsoft best practice

### Compliance (Zero Trust)
- **BitLocker:** Required per compliance, key escrowed to Entra ID, 256-bit
- **Defender:** Real-time ON, Tamper protection, Definitions <7 days, Firewall ON
- **OS Version:** Minimum 10.0.19045 (NovaTech), 10.0.22621 (Apex SEC-2024-07)
- **Secure Boot:** ON for Apex Financial (regulated)
- **PIN:** Required, 6 digits iOS
- **Per-Client:** NovaTech Standard, Bloom Relaxed (BitLocker optional), Apex Critical (SEC-2024-07)

### Conditional Access
- Require compliant device, Require MFA, Trusted locations (Nairobi HQ + Mombasa), Approved client apps
- MFA: SMS + Authenticator, required for all users (Bloom) and admin roles (NovaTech)
- Location: Block outside Kenya (Bloom OFF for travel flexibility, NovaTech ON)
- Device: Compliant + Hybrid Joined for financial data (Apex)
- App: Only Outlook, Teams official (Apex)

### Email Security
- **Quarantine:** Bulk, Spam, High confidence phish — Release + Allow Sender + Report as Not Junk
- **Anti-spam:** Per-client tuning, allowed senders list
- **Anti-phish:** Impersonation protection for finance
- **Safe Attachments:** Simulated for invoice PDFs
- **DLP:** Block external sharing of financial docs with credit card/PII (Apex)

### Security Headers

`next.config.ts`:

```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'" }
    ]
  }]
}
```

Notes:
- `microphone=(self)` required for voice calls (Web Speech API STT), camera and geolocation blocked
- `unsafe-eval`/`unsafe-inline` required by Next.js Turbopack in dev; production CSP can be tightened further if needed
- `frame-ancestors 'none'` prevents clickjacking (equivalent to DENY)

### Privacy by Design
- 100% browser, LocalStorage only
- No real credentials, tenant IDs, or client data
- No tracking cookies, analytics, or third-party trackers
- Simulated tickets only (fictional users)
- Disclaimer: Educational simulator, not affiliated with Microsoft

### Threat Model
See `THREAT_MODEL.md`:
- CA misconfiguration → P1
- Stale enrollment → 0x80180024
- Quarantine false positives
- BitLocker key loss
- Mitigations: Report-Only + What If + peer review + break glass + audit logs + KB + automation

## Reporting

If you find a security issue (e.g., XSS in chat, data leak), report via GitHub Issues or portfolio contact. Do not use real credentials in reports.

## Development

- No hardcoded secrets, PATs, API keys (`grep -r ghp_` clean)
- No `eval()` or dangerous functions
- Terminal input sanitization: allowlist `dsregcmd`, `ipconfig`, `whoami`, `Get-BitLockerVolume`, `CompanyPortal Sync`
- External links use `rel="noopener noreferrer"`
- Dependencies:
  - `npm audit --omit=dev` → 0 vulnerabilities (production)
  - `npm audit` → 2 high in `electron@28` devDependency (GHSA extract-zip symlink traversal, ASAR integrity bypass). Mitigation: Electron not used in Vercel production, only desktop packaging; uses `contextIsolation`, `preload.js`. Upgrade path: `electron@41.7.1` breaking change, tracked for next major.

## Compliance

- Microsoft best practices: Entra ID, Intune, Defender
- ITIL Problem Management (recurring INTUNE-001 → Problem ticket)
- No personal data collection

© 2026 OrbitDesk — MIT — Educational — Not affiliated with Microsoft.
