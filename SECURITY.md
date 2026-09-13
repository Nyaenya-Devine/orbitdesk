# Security Policy — OrbitDesk

## 🛡️ Security-First Design

OrbitDesk is built with military-grade security mindset, inherited from Chokepoint (4-eyes verification) and Android Reset Lab (RBAC + 52 tests). Even though it's an educational simulator, it implements real security principles.

### Security Upgrades Emphasized

#### 1. Encrypted Remote Sessions (RDP Simulation)
- All remote PC sessions show: Encrypted, Session ID, Recording enabled, Audit log
- Session ID format: `ABC123-RDP` - unique per session
- No real RDP - simulated Windows 11 desktop with realistic outputs
- Client consent obtained, actions logged, secure connection indicator

#### 2. Audit Logs Everywhere (Focus on Facts)
- **Entra Audit Logs**: Who changed CA policy at 08:02, from Report-Only OFF to ON - root cause for P1
- **Exchange Audit**: Who released quarantine, who allowed sender
- **Intune Audit**: Who changed compliance policy, who deleted device
- **Remote Access Audit**: Every command (dsregcmd, Get-BitLockerVolume) logged with timestamp
- All logs include actor, activity, target, time - just like real Entra ID

#### 3. RBAC (Role-Based Access Control)
- **Senior vs Junior**: Senior max 5 tickets, skills 7-10/10, can handle Intune BitLocker, Exchange mail flow
- **Junior**: Max 3 tickets, skills 2-6/10, needs escalation checklist, cannot do Intune without senior approval
- **Team Lead**: Max 10 tickets, all skills 8/10, owns roster, escalations, quality, client relationships
- Permissions enforced in UI: Junior cannot assign P1 to another junior

#### 4. Break Glass Accounts (Emergency Access)
- Emergency admin account excluded from ALL Conditional Access policies
- Prevents lockout when CA policy blocks everyone (P1 scenario: 50 users blocked)
- Mentioned in What If tool and Audit logs
- Best practice from Microsoft: Always have break glass

#### 5. Compliance Enforcement (Zero Trust)
- **BitLocker**: Required per compliance policy, key escrowed to Entra ID, 256-bit encryption
- **Defender**: Real-time protection ON, Tamper protection, Definitions up-to-date <7 days, Firewall ON
- **OS Version**: Minimum 10.0.19045 (NovaTech), 10.0.22621 (Apex SEC-2024-07 Strict)
- **Secure Boot**: ON for Apex Financial (regulated)
- **PIN**: Required, 6 digits for iOS
- **Per-Client Strictness**: NovaTech Standard, Bloom Relaxed (BitLocker optional), Apex Critical (SEC-2024-07)

#### 6. Zero Trust Architecture (Modern Workplace)
- **Conditional Access**: Require compliant device, Require MFA, Trusted locations (Nairobi HQ + Mombasa), Approved client apps only
- **MFA**: SMS + Authenticator, required for all users (Bloom) and admin roles (NovaTech)
- **Location**: Block outside Kenya (Bloom OFF for travel flexibility, NovaTech ON)
- **Device**: Compliant + Hybrid Joined for financial data (Apex)
- **App**: Only allow Outlook, Teams official apps (Apex)

#### 7. Defender for Office 365 (Email Security)
- **Quarantine**: Bulk, Spam, High confidence phish, with Release + Allow Sender + Report as Not Junk
- **Anti-spam Policy**: Per-client tuning, allowed senders list
- **Anti-phish Policy**: Impersonation protection for finance
- **Safe Attachments**: Simulated for invoice PDFs
- **DLP (Data Loss Prevention)**: Block external sharing of financial docs with credit card / PII (Apex)

#### 8. Security Headers (Next.js Hardening)
In `next.config.ts`:
```ts
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:" }
      ]
    }
  ]
}
```

#### 9. No Real Data — Privacy by Design
- Runs 100% in browser, LocalStorage only
- No real credentials, no tenant IDs, no client data stored
- No tracking cookies, no analytics, no third-party trackers
- Simulated tickets only — Sarah Finance, etc. are fictional
- Clear disclaimer: Educational simulator, not affiliated

#### 10. Threat Model
See THREAT_MODEL.md for:
- Attack vectors: CA policy misconfiguration causing P1, stale device enrollment blocking, quarantine false positives, BitLocker key loss
- Mitigations: Report-Only mode + What If tool + peer review + break glass + audit logs + KB + automation

### Reporting Security Issues
If you find a security issue in OrbitDesk simulator (e.g., XSS in chat, data leak), please report via GitHub Issues or portfolio contact. Do NOT use real credentials in reports.

### Security in Development
- No hardcoded secrets, PATs, or API keys in code (verified via `grep -r ghp_`)
- No `eval()` or dangerous functions
- Input sanitization in terminal (command whitelist: dsregcmd, ipconfig, whoami, Get-BitLockerVolume, CompanyPortal Sync)
- All external links use `rel="noopener noreferrer"`
- Dependencies audited via `npm audit` — 0 vulnerabilities

### Compliance
- Follows Microsoft best practices for Modern Workplace: Entra ID, Intune, Defender
- ITIL for Problem Management (recurring INTUNE-001 → Problem ticket)
- GDPR-friendly: No real personal data collection

© 2026 OrbitDesk • Security-first • Educational • MIT
