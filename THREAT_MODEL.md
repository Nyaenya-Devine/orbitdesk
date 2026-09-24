# Threat Model — OrbitDesk

## Overview
OrbitDesk simulates Modern Workplace Support Team Lead scenarios. Even as a simulator, we model real threats from JD: Conditional Access misconfig, Intune enrollment failures, Exchange quarantine, etc.

## Assets
- Simulated tickets (no real data)
- Simulated client policies (CA, Compliance)
- Simulated agent roster and metrics
- Training progress (LocalStorage)

## Threat Actors (Simulated)
- Malicious admin pushing CA policy without Report-Only
- User with non-compliant device trying to access financial data
- External vendor email flagged as phish
- Junior agent escalating without checking logs (knowledge gap)

## Attack Vectors & Mitigations (Real-World Mapping)

### 1. Conditional Access Policy Misconfiguration → P1 Outage (50 users blocked)
- **Vector**: Admin pushes "Require compliant device for M365" without Report-Only, blocks 50 users
- **Impact**: P1, SLA breach 60min, CSAT drop, payroll blocked
- **Mitigation in OrbitDesk**:
  - What If tool: Simulate before push
  - Report-Only mode: Watch 24h before ON
  - Audit logs: Who pushed at 08:02
  - Break Glass account: Excluded from CA, prevents lockout
  - Peer review + approval required
  - Post-incident review + KB update

### 2. Stale Device Enrollment → 0x80180024 Recurring (22 tickets/week)
- **Vector**: Old laptop record blocks new enrollment, MDM URL still present
- **Impact**: Recurring tickets, volume +30%, FRT up
- **Mitigation**:
  - Check Enrollment failures in Intune
  - dsregcmd /status shows MdmUrl
  - Settings → Access work or school → Disconnect
  - dsregcmd /leave + delete stale device in Entra
  - Problem Management: Create Problem ticket, PowerShell auto-cleanup script, raise device cap from 5 to 10

### 3. Email Quarantine False Positive → Invoice Blocked
- **Vector**: Defender quarantines legit vendor invoice as Bulk/High confidence phish
- **Impact**: Finance cannot pay, P1
- **Mitigation**:
  - Message Trace shows Quarantined
  - Quarantine portal shows reason (Bulk)
  - Release + Allow Sender + Report as Not Junk (train filter)
  - Add to allowed senders list with approval
  - Tune Anti-spam policy

### 4. BitLocker Key Loss → User Locked Out
- **Vector**: After BIOS update, BitLocker recovery key prompt, user doesn't have key
- **Impact**: User cannot work, data loss risk if wiped
- **Mitigation**:
  - Key escrowed to Entra ID → Devices → BitLocker keys
  - Also in Intune → Recovery keys
  - Guide user to enter key, ensure key escrowed after
  - Suspend BitLocker before BIOS update
  - KB: How to retrieve BitLocker key

### 5. Account Lockout → Password Spray Attack
- **Vector**: Attack from Brazil IP, smart lockout locks account
- **Impact**: User locked, possible breach
- **Mitigation**:
  - Sign-in logs shows failed attempts from unfamiliar IP
  - Risky sign-ins shows medium risk
  - Unlock + Force password reset + Enable MFA
  - Block attack IP in CA named location
  - Educate user

### 6. Junior Escalation Without Logs → Conflict
- **Vector**: Jamal escalates easy M365 tickets without checking Message Trace / Sign-in logs
- **Impact**: Senior Alex says "wasting my time" in public, conflict, tension, performance drop
- **Mitigation**:
  - Private 1:1s, SBI framework (Situation-Behavior-Impact)
  - Escalation checklist: Service Health → Logs → KB → What tried
  - Pair junior with senior mentor (Priya)
  - Shadowing 2 tickets/day
  - Publish escalation guideline in KB

### 7. No Break Glass → Admin Lockout
- **Vector**: CA policy blocks all users including admin, no emergency access
- **Impact**: Cannot fix P1, need Microsoft support
- **Mitigation**:
  - Break Glass account excluded from ALL CA policies
  - Monitored, alert on use, password in vault
  - Documented in What If tool

### 8. Remote Access Without Audit → Compliance Violation
- **Vector**: Access client PC without consent or logging, violates Apex SEC-2024-07
- **Impact**: Compliance violation, audit fail
- **Mitigation in OrbitDesk**:
  - Encrypted RDP with Session ID, Recording indicator, Audit log enabled
  - Client consent obtained banner
  - All commands logged (dsregcmd, Get-BitLockerVolume)
  - Session info shows client, user, compliance, policy

### 9. XSS in LinkedIn Chat Dock → Client Message Executes Script
- **Vector**: Malicious client sends `<img src=x onerror=alert(1)>` in chat, if rendered via innerHTML executes
- **Impact**: XSS, session hijack, LocalStorage theft (progress, profile)
- **Mitigation in OrbitDesk v6.6**:
  - React escapes by default — no `dangerouslySetInnerHTML`, no `innerHTML`
  - Chat messages rendered as text nodes `<p>{msg.text}</p>` — auto-escaped
  - CSP `script-src 'self'` blocks inline eval, `frame-ancestors 'none'` prevents clickjacking
  - Content sanitized — no HTML parsing, only plain text
  - Verified via CodeQL XSS query

### 10. Electron IPC Bypass → Preload → Main Process RCE
- **Vector**: Renderer compromises preload, calls ipcRenderer to execute arbitrary main process code
- **Impact**: RCE, file system access, auto-update tampering
- **Mitigation in OrbitDesk v6.6**:
  - `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` — no node in renderer
  - Preload whitelists only specific channels — `check-for-updates`, `download-update`, `install-update`, `get-app-version`, `incoming-call` — no generic invoke
  - `ipcMain.handle` validates input, no eval, no shell exec
  - `requestSingleInstanceLock` prevents spoofing second instance
  - CodeQL + electron hardening check in CI verifies

### 11. Auto-Update Tampering → Malicious Update via MITM
- **Vector**: Attacker intercepts GitHub Releases, serves malicious exe/dmg with same version
- **Impact**: Supply chain compromise, malware install
- **Mitigation in OrbitDesk v6.6**:
  - electron-updater verifies signature via GitHub Releases `latest.yml` + SHA512
  - `publish.provider: github` with private false, releaseType release — signed artifacts
  - Auto-download false — user consent via dialog Download Now/Later — zero-trust
  - HTTPS only — `https://github.com/Nyaenya-Devine/orbitdesk/releases` + HSTS
  - SBOM CycloneDX included in release — transparency
  - Log via electron-log — audit trail for update events

### 12. Toast Overlay Covering Guide → Social Engineering / Phishing
- **Vector**: Many toasts z-[200] covering StudentModeGuide z-[100] — user cannot see tutorial, misses security checklist logs+tool required
- **Impact**: User resolves without checking logs — QA drop, CSAT drop, insecure fix
- **Mitigation in OrbitDesk v6.6**:
  - Toast bottom-left z-45 w-340 max 2 visible, blur-2xl, progress bar, swipe dismiss
  - Guide z-100 > dock 65 > toast 45 — hierarchy prevents covering
  - Grouped toasts ×count, Clear all, drag x to dismiss
  - Modern spring animation 400/30 — a restrained spring transition

## Security Controls Implemented — v6.6 Hardened
- Encrypted sessions (simulated) + Session ID + Recording indicator + Audit log
- Audit logs (Entra Audit who changed CA 08:02, Exchange who released quarantine, Intune who changed compliance, Remote every dsregcmd)
- RBAC Senior/Junior/Lead max tickets skills UI enforces Junior cannot handle Intune without senior
- Break Glass emergency excluded all CA monitored
- Compliance BitLocker escrowed Defender real-time tamper OS version Secure Boot PIN
- Zero Trust CA Require compliant device MFA SMS+Authenticator Trusted locations Nairobi HQ+Mombasa Approved apps Outlook/Teams only Apex
- Defender for Office 365 Quarantine Bulk/Spam/Phish Release+Allow+Report Not Junk anti-spam/phish DLP block external PII
- Security headers CSP HSTS X-Frame-Options DENY X-Content-Type-Options nosniff Referrer-Policy Permissions-Policy microphone=self camera=() geolocation=()
- Electron 32.3.3 hardening sandbox contextIsolation nodeIntegration false webSecurity singleInstance permission mic only auto-updater signed
- Supply Chain SBOM CycloneDX npm ci lockfile pinned Dependabot weekly CodeQL Dependency Review TruffleHog secret scan npm audit
- No real data LocalStorage only no tracking
- Input sanitization command whitelist + React auto-escape no innerHTML

## Residual Risks
- Simulator may not reflect latest Microsoft changes — always check Microsoft Learn
- Simulated data, not real — do not use for production decisions without validation

© 2026 OrbitDesk • Threat model for training • Educational
