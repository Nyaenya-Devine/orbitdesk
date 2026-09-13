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

## Security Controls Implemented
- Encrypted sessions (simulated)
- Audit logs (Entra Audit, Exchange, Intune, Remote)
- RBAC (Senior/Junior/Lead with max tickets and skills)
- Break Glass
- Compliance enforcement (BitLocker, Defender, OS version, Secure Boot, PIN)
- Zero Trust (CA, MFA, Trusted locations, Approved apps)
- Defender for Office 365 (Quarantine, Anti-spam, Anti-phish, DLP)
- Security headers (CSP, HSTS, X-Frame-Options)
- No real data, LocalStorage only, no tracking
- Input sanitization (command whitelist)

## Residual Risks
- Simulator may not reflect latest Microsoft changes — always check Microsoft Learn
- Simulated data, not real — do not use for production decisions without validation

© 2026 OrbitDesk • Threat model for training • Educational
