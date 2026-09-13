# OrbitDesk — Modern Workplace Operations Lab

**The finest MSP Team Lead Simulator — Real-time, Human, Secure, Production-Grade**

> Inspired by Linear, Stripe, Slack, Intercom, Superhuman, Notion, Vercel — but built for Modern Workplace Support Team Leads.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Security](https://img.shields.io/badge/Security-Hardened-green)](./SECURITY.md)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)
[![Educational](https://img.shields.io/badge/Purpose-Educational-violet)](#)

### 🎯 Live Demo
**https://orbitdesk.vercel.app** (soon) • Local: http://localhost:3000

---

## ⚠️ Legal & Educational Disclaimer

**OrbitDesk is an independent educational training simulator. NOT affiliated with, endorsed by, or connected to Influx, Microsoft, or any client. All trademarks belong to their respective owners.**

- All clients (NovaTech Enterprises, Bloom & Co Studio, Apex Financial Group) are **fictional**
- All agents (Alex, Priya, Jamal, Lisa, David) are **fictional personas**
- All tickets, logs, policies are **simulated** — no real tenant data
- Error codes (53000 DeviceNotCompliant, 0x80180024, etc.) are real Microsoft codes used under **fair use for education**
- No real remote access, no real calls — all simulated in browser
- Runs 100% in browser (LocalStorage), no tracking, no real data collection

See [Terms](./src/app/terms/page.tsx), [Privacy](./src/app/privacy/page.tsx), [Disclaimer](./src/app/disclaimer/page.tsx) for full legal protection.

---

## 💎 Why OrbitDesk is NOT Basic — Masterpiece Features

### 1. Real-Time Endless Ticket Engine (Like Real MSP)
- **16 ticket templates** covering every Modern Workplace scenario from JD:
  - **Entra ID**: 53000 DeviceNotCompliant, 53003 BlockedByConditionalAccess (Location), 500121 MFA loop, 50053 Account locked (password spray), SSO failure
  - **Intune**: 0x80180024 Device already enrolled (stale), 0x80180001 MDM authority None, DeviceCapReached (5 limit), Not Compliant BitLocker, Autopilot TPM attestation failing
  - **Exchange**: Quarantine (Bulk/Phish), Shared mailbox auto-mapping, Mail flow down (transport rule), Mailbox full
  - **Teams**: Presence wrong, cache corruption
  - **Windows/M365**: License assignment failed, BitLocker recovery key missing, Defender SmartScreen blocking legit app
- **SLA timers ticking LIVE** every second — P1 60min (NovaTech 24/7), P2 120min, breach turns red + pulse animation
- **New tickets spawn every 8s** — endless training, even while you sleep
- **Recurring tags** → Problem Management per ITIL (e.g., INTUNE-001 22 tickets/week → propose automation)

### 2. Simulated Agents With Real Human Conflicts (Lead & Develop Team)
- **5 agents with personalities, skills, metrics, 44h/week compliance**:
  - **Alex Mwangi (Senior)**: M365+Intune+Exchange 9/10, but conflicted — said "Jamal wastes my time" in public Slack. Needs coaching on coaching (SBI).
  - **Priya Shah (Senior)**: Entra ID 10/10, excellent mentor, calm under pressure — role model
  - **Jamal Otieno (Junior)**: M365 5/10, eager but escalates easy tickets without checking logs — needs escalation checklist + Message Trace training
  - **Lisa Chen (Junior)**: Teams 8/10, high CSAT 4.7 but slow FRT 25m — needs time management
  - **David Kimani (Junior)**: Exchange quarantine expert, learning Intune BitLocker
- **Real conflict resolution**: Click "Resolve Conflict (1:1 + SBI)" → Private 1:1s with SBI framework (Situation-Behavior-Impact), co-create action, follow-up
- **Roster management**: Drag-drop, skill coverage matrix, 44h/week compliance (Employment type: 44 hours per week from JD), primary/secondary per client

### 3. Real Communication Channel (Slack-like, Like Influx Uses)
- **Channels**: #team-internal, #client-a-novatech (Enterprise Tech 24/7), #client-b-bloom (SMB 9-5), #client-c-apex (Regulated), #escalations (P1), #coaching-1-1s
- **Real-time messages every 8s**: Agents asking help, clients asking SLA updates, system alerts "Ticket Trend Alert: INTUNE-001 22 tickets - Create Problem ticket?"
- **Human-like**: Typing indicators, presence dots, unread counts, emoji reactions, read receipts
- **Prioritize listener**: Tip shows "For SMB avoid jargon DeviceNotCompliant, say 'security update needed'"

### 4. 📞 Call Center — Live Help on the Line (NEW - Human)
- **Incoming call modal** (like CloudTalk/Intercom) for P1 tickets — Accept/Decline with ringtone animation
- **Live call bar** at bottom (like Superhuman) with:
  - Call timer, mute, hold, end
  - **Live transcript that responds to YOUR words** — if you say "sign-in logs" → client says "Perfect!", if you say "reinstall" → "Wait, that's drastic without logs"
  - **Different voice per client** (voice inspiration):
    - NovaTech (Enterprise Tech): Technical, concise, Correlation IDs, formal: "Error 53000 DeviceNotCompliant, Correlation ID: a1b2c3..., checked Service Health green"
    - Bloom & Co (SMB): Casual, friendly, emojis, simple: "Heyy! 😅 My shared mailbox not showing? Simple steps?"
    - Apex Financial (Regulated): Formal, compliance, policy refs: "Per policy SEC-2024-07, require BitLocker compliance, need audit trail + RCA"
  - Sentiment indicator (frustrated/neutral/calm), SLA countdown, recording indicator

### 5. 💻 Remote PC Access — 100% Real Feel (NEW)
- Click "Connect →" → Opens **real Windows 11 desktop simulation** with macOS traffic lights
- **Encrypted RDP**: Session ID, encrypted, recording, audit log enabled
- **Sidebar**: Desktop, Terminal (PowerShell Admin), Company Portal, Settings → Accounts → Access work or school
- **Desktop**: Windows 11 Pro with File Explorer, Company Portal (1 update), Teams/Outlook blocked (Not Compliant), BitLocker Off warning with "Open Company Portal" button
- **Terminal**: Run REAL commands with realistic outputs:
  - `dsregcmd /status` → Full AzureAdJoined YES, MdmUrl, Compliance NO with BitLocker failing
  - `Get-BitLockerVolume` → Protection Off, Not Encrypted, needs fix per SEC-2024-07
  - `ipconfig`, `whoami`, `CompanyPortal Sync` → Realistic outputs
- **Company Portal**: Shows Not Compliant - BitLocker failing, Sync button, Fix button, Last Sync 2h ago
- **Settings**: Shows Entra ID joined, MDM Intune, Info → Sync, Disconnect (Error 0x80180024 fix lives here)

### 6. 🏢 Per-Client Policies — Real Workplace (NEW)
- New tab "Policies" — each client has DIFFERENT policies, just like real MSP:
  - **NovaTech (Enterprise Tech 24/7)**: CA "Require compliant device for M365" ON (was Report-Only OFF - caused P1!), Block legacy auth, 12 non-compliant, Expectations: Share Correlation ID, CA tab, technical RCA, update every 30min for P1
  - **Bloom & Co (SMB 9-5)**: Only MFA required, relaxed compliance (BitLocker optional), 1 non-compliant, Expectations: Simple language, no jargon, emojis, step-by-step
  - **Apex Financial (Regulated)**: SEC-2024-07 Strict - BitLocker + Key escrowed + Defender Tamper + DLP blocking external sharing, 8 non-compliant, Expectations: Formal, audit trail, RCA with timeline, compliance proof
- Shows risk level, last modified, who changed, mode (ON/OFF/Report-Only), non-compliant count

### 7. Mock Admin Portals — Fully Functional (Provide Technical Oversight)
- **Entra Sign-in Logs**: Filtered by user, shows Failure, Conditional Access tab with exact block reason 53000, conditions, "CLICK THIS IN INTERVIEW" highlight, Team Lead Tip: Always check logs FIRST
- **Intune Compliance**: Device Compliance State Not Compliant, failing settings drill-down (BitLocker, OS version, Defender), dsregcmd /status viewer, Company Portal Sync
- **Exchange**: Message Trace showing Quarantined, Quarantine portal with Release + Allow Sender, Defender Anti-spam policy
- **Service Health Dashboard**: Green/red, teaches "Check Service Health FIRST to rule out Microsoft outage"
- **What If Tool**: Safe testing - Test with Compliant=NO → BLOCKED, Compliant=YES → ALLOWED, Gold for interview: "Use What If BEFORE changing policy"
- **Audit Logs**: WHO changed WHAT WHEN - "john.admin pushed policy at 08:02 without Report-Only" - Root Cause Found

### 8. Dashboard & Training — Drive Quality & Improvement
- **KPIs**: SLA Compliance %, CSAT 4.2 (dropped from 4.6!), FRT (First Response Time), MTTR (Mean Time To Resolve), Live Queue, Recurring tags
- **Ticket Trends**: Top recurring issues with bar chart, trend %, "Create KB + Fix" button → Problem Management per ITIL
- **What Success Looks Like 6-12 months** tracker from JD
- **Training Lab**: Guided tutorials, Error Code Mastery quiz (53003, 0x80180024), Coaching Scenarios (Conflict Alex vs Jamal, CSAT drop, P1 50 users blocked)

---

## 🔒 Security Upgrades — Military-Grade (Emphasized)

OrbitDesk is built with security-first mindset, just like Chokepoint (4-eyes) and Android Reset Lab (RBAC):

### Security Features Implemented:
1. **Encrypted Remote Sessions**: All RDP sessions show Encrypted, Session ID, Recording, Audit log enabled
2. **Audit Logs Everywhere**: Every action logged - who changed CA policy at 08:02, who released quarantine, who accessed PC
3. **RBAC (Role-Based Access Control)**: Senior vs Junior skills, max tickets, permissions - Junior cannot do Intune BitLocker without senior approval
4. **Break Glass Accounts**: Emergency admin excluded from CA policies - prevents lockout, mentioned in What If tool
5. **Compliance Enforcement**: BitLocker, Defender, OS version, Secure Boot, PIN - per-client strictness (Apex SEC-2024-07)
6. **Zero Trust**: Conditional Access, MFA, Compliant device, Trusted locations, Approved client apps
7. **Defender for Office 365**: Quarantine, Anti-spam, Anti-phish, Safe Attachments, DLP
8. **Security Headers**: CSP, HSTS, X-Frame-Options in next.config.ts (see SECURITY.md)
9. **No Real Data**: Runs 100% browser, LocalStorage only, no credentials stored, no tracking
10. **Threat Model**: See THREAT_MODEL.md for attack vectors and mitigations

### Security in Code:
- No hardcoded secrets, no PATs in code (grep verified)
- All simulated data, no real tenant connections
- Input sanitization in terminal (no command injection)
- Audit trail for every fix

See [SECURITY.md](./SECURITY.md) for full security policy.

---

## 🎨 Design — Inspired by Top 1% SaaS (Not Basic AI)

**OrbitDesk looks human, not AI, because it's inspired by best combined:**

- **Linear**: Dark-first (#0a0a0a) with violet accent (#7c3aed), bento grid, rounded-2xl, command palette ⌘K, keyboard-first, quiet chrome, Inter font
- **Stripe**: Gradient mesh (violet→indigo), polished tables, data as primary, attention to detail, empty states with illustrations
- **Slack**: Channels with unread, presence dots, threads, typing indicators, emoji reactions
- **Intercom**: Human chat bubbles, warm, conversational, typing "...", read receipts
- **Superhuman**: Speed - SLA timers tick every second, 8s ticket spawn, instant command palette, shortcuts
- **Notion**: Warmth, custom illustrations, human scenes, approachable
- **Vercel**: Monochrome minimalism, extreme restraint, color = meaning (red = breach, green = healthy)

**Not basic**: Glassmorphism, backdrop-blur, micro-interactions, hover states, loading skeletons, optimistic updates, dark/light, responsive, accessible (Lighthouse 90+)

---

## 🚀 Quick Start

```bash
git clone https://github.com/Nyaenya-Devine/orbitdesk.git
cd orbitdesk
npm install
npm run dev
# Open http://localhost:3000
# Press Ctrl+K for command palette
# Wait for P1 call → Accept → Guide client → Resolve → Get CSAT
# Click Connect → Remote into PC → Run dsregcmd /status
```

---

## 📚 How to Train for Team Lead Interview

1. **Ticket + Portals Tab**: Select P1 → Check Service Health FIRST → Sign-in logs CA tab → Intune compliance → Find BitLocker failing → Resolve with checklist → Get CSAT 5⭐
2. **Comms Tab**: Reply to NovaTech with Correlation ID, to Bloom with simple steps + emojis
3. **Call Center**: Accept incoming P1 call → Guide while on call → Different voice per client
4. **Remote PC**: Connect → Run dsregcmd /status → Get-BitLockerVolume → Fix via Company Portal
5. **Policies Tab**: Switch clients → See different CA policies → Understand per-client expectations
6. **Dashboard**: See recurring INTUNE-001 22 tickets → Create Problem ticket + KB + automation script
7. **Roster**: See Alex vs Jamal conflict → Resolve with SBI + private 1:1s + escalation checklist
8. **Training**: Do quiz 53003, 0x80180024 → Practice SBI/GROW frameworks

Do 20 tickets and you will say in interview: "I built this for your exact JD - want to see me fix P1 live + take a call + remote into PC?"

---

## 📄 Legal — Zero Trouble

- **Terms**: /terms — Educational only, no affiliation, fair use, no warranty
- **Privacy**: /privacy — No real data, LocalStorage only, no tracking
- **Disclaimer**: /disclaimer — No affiliation with Influx/Microsoft, fictional clients/agents, simulated data, MIT license

**Domain safe**: orbitdesk.vercel.app (no trademark), not influx-lab. Title safe: OrbitDesk.

---

## 🏗️ Architecture

- **Frontend**: Next.js 16.3.5 App Router, TypeScript 5, Tailwind CSS 4
- **State**: React useState + useEffect for real-time (SLA timers 1s, ticket gen 8s, chat 8s, call duration 1s)
- **Data**: JSON templates for tickets (16 types), clients (3 types), agents (5 personas)
- **No Backend**: 100% browser, LocalStorage, no API calls to real Microsoft
- **Security**: Security headers, no secrets, audit logs, RBAC, encrypted session simulation

---

## 💎 Why OrbitDesk Gets You Hired as Team Lead

Most candidates show to-do app. You show **real MSP Team Lead workspace** that proves you understand from JD:

- **Provide Technical Oversight**: You know Entra sign-in logs CA tab, What If, Report-Only, Intune dsregcmd, Message Trace, Service Health
- **Lead & Develop Team**: You manage rosters, 44h/week compliance, workload allocation, coverage, 1:1s GROW, coaching SBI, conflict resolution
- **Manage Clients & Service Delivery**: You handle tech enterprise vs SMB vs regulated, prioritize listener, SLA 95%, incident comms with next update
- **Drive Quality & Improvement**: You monitor SLA/CSAT/FRT/MTTR/QA, ticket trends, Problem Management ITIL, KB, automation

And you built it with top 1% SaaS polish.

---

## 📬 Contact

Portfolio: https://devine-nyaenya-portfolio.vercel.app
GitHub: https://github.com/Nyaenya-Devine
OrbitDesk: https://github.com/Nyaenya-Devine/orbitdesk

© 2026 OrbitDesk • Built by Devine Nyaenya • Educational Simulator • MIT License • Not affiliated with Microsoft, Influx • All trademarks property of respective owners
