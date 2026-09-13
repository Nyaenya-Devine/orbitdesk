# OrbitDesk — Modern Workplace Operations Lab v2.0

**The finest MSP Team Lead Simulator — Real-time, Human Voice Calls, Desktop Installable, Secure, Production-Grade**

> Inspired by Linear, Stripe, Slack, Intercom, Superhuman, Notion, Vercel — but built for Modern Workplace Support Team Leads with REAL human conversations.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Security](https://img.shields.io/badge/Security-Hardened-green)](./SECURITY.md)
[![PWA](https://img.shields.io/badge/PWA-Installable-violet)](./public/manifest.json)
[![Desktop](https://img.shields.io/badge/Desktop-Electron%2028-black)](./electron.js)
[![Voice](https://img.shields.io/badge/Voice-5%20Voices%20Real%20Audio-orange)](./public/audio/calls/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

### 🎯 Live Demo
**https://orbitdesk.vercel.app** • **https://temporary-turbo-xenon-ebpbd59.vercel.app** (voice) • Local: http://localhost:3000
**Desktop:** `npm run desktop:dev` → Electron app with native P1 notifications

---

## ⚠️ Legal & Educational Disclaimer

**OrbitDesk is an independent educational training simulator. NOT affiliated with, endorsed by, or connected to Influx, Microsoft, or any client. All trademarks belong to their respective owners.**

- All clients (NovaTech Enterprises, Bloom & Co Studio, Apex Financial Group) are **fictional**
- All agents (Alex, Priya, Jamal, Lisa, David) are **fictional personas**
- All tickets, logs, policies are **simulated** — no real tenant data
- Error codes (53000 DeviceNotCompliant, 0x80180024, etc.) are real Microsoft codes used under **fair use for education**
- Voice calls use **Web Speech API + pre-recorded MP3 samples** — simulated, no real calls
- No real remote access — Windows 11 desktop is simulation
- Runs 100% in browser (LocalStorage), no tracking, no real data collection

See [Terms](./src/app/terms/page.tsx), [Privacy](./src/app/privacy/page.tsx), [Disclaimer](./src/app/disclaimer/page.tsx) for full legal protection.

---

## 💎 v2.0 NEW — Real Voice Calls + Desktop Installable (Not Basic)

### 🎙️ Real Voice Calls — Flowing Human Conversations (NEW v2.0)

**Problem before:** When I pick incoming calls no audio, no one is talking
**Solution now:** REAL voice calls where client actually talks, responds to your questions, asks questions back, does actions on other side, tech experts join conference

#### Different People, Different Issues, Balanced Voices (Men & Women)

**3 Client Personas with Real Audio MP3 + TTS:**

1. **Michael • NovaTech Enterprises (Enterprise Tech 24/7)**
   - Voice: Masculine formal, rate 1.0, deep, Correlation ID expert
   - Issue: P1 Payroll blocked 50 users — 53000 DeviceNotCompliant
   - Knows: Service Health, Sign-in logs CA tab, dsregcmd /status, Get-BitLockerVolume, Company Portal Sync
   - Can do: Runs dsregcmd when asked → "AzureAdJoined YES, MdmUrl present, Compliance NO"
   - Asks: "What does 53000 mean? What's ETA? Will enabling BitLocker affect perf? Provide RCA + audit trail?"
   - Audio: `/audio/calls/novatech-p1-initial.mp3` (real voice)

2. **Jessica • Bloom & Co Studio (SMB Casual 9-5)**
   - Voice: Feminine friendly, rate 1.1, pitch 1.1, casual emojis, simple steps
   - Issue: Shared mailbox finance@bloomco.studio not showing in Outlook
   - Knows: Beginner, needs "Click Start → Settings → ..." not "Run dsregcmd"
   - Can do: Opens Company Portal (blue shopping bag icon), clicks Sync, reports "Last sync just now"
   - Asks: "Will I lose files if disconnect? Can you explain like I'm 5? Client call in 20 mins! 😅"
   - Audio: `/audio/calls/bloom-initial.mp3` (real voice)

3. **David • Apex Financial Group (Regulated Formal)**
   - Voice: Masculine deep, rate 0.9, pitch 0.8, formal, SEC-2024-07 compliance
   - Issue: BitLocker compliance blocking Teams — SEC-2024-07 policy
   - Knows: Intermediate, needs audit trail, policy reference, key escrow confirmation
   - Can do: Checks BitLocker, provides compliance proof, captures logs for audit
   - Asks: "Per SEC-2024-07, provide audit trail, who changed policy, when, RCA, key escrow confirmation?"
   - Audio: `/audio/calls/apex-initial.mp3` (real voice)

**Flowing Conversation Engine:**
- Client talks with voice (Web Speech API TTS + MP3 fallback)
- You respond via text or mic 🎙️ (SpeechRecognition)
- Client does action on other side when asked: "Can you run dsregcmd?" → Client runs and returns output with success/failure
- Client asks questions back based on knowledge base (53000, 0x80180024, quarantine, BitLocker, Autopilot)
- Follow-up questions auto after 4-7s: ETA, data loss, affecting everyone, audit trail
- Sentiment changes: frustrated → neutral → calm → happy when resolved
- Visual: Speaking indicator ● Speaking..., typing dots, waveform, sentiment pulse

**Tech Experts Conference (NEW):**
- Click 👨‍💻 Add Expert → 5 experts with different voices, skills, availability
- **Alex Rivera (Entra ID & CA)**: Male formal, direct, "Check Sign-in logs CA tab, What If, Report-Only 24h, break glass excluded, need Tenant ID + Correlation ID"
- **Priya Nair (Intune & Compliance)**: Female friendly, patient mentor, "For 0x80180024 stale enrollment, Settings → Access work/school → Disconnect, dsregcmd /leave, delete stale device, check device cap 5→10, create Problem ticket"
- **Lisa Chen (Teams & M365)**: Female friendly, empathetic, non-tech language expert, great with SMB
- **David Okafor (Exchange & Defender)**: Male deep, calm, security-focused, "Quarantine false positive: Message Trace → Quarantined Bulk High, Release + Allow Sender + Report Not Junk, audit trail for SEC-2024-07"
- **Microsoft Support (Escalation)**: Formal, asks for Tenant ID, Correlation ID, HAR file, KB links
- Expert joins conference with different voice, provides guidance, speaks via TTS
- Conference: client + expert + you, both speak, real collaboration, audit log shows experts participated

**Audio Samples (9 MP3s generated with 5 balanced voices):**
- `/audio/calls/novatech-p1-initial.mp3` — Michael P1 payroll blocked
- `/audio/calls/novatech-dsregcmd-action.mp3` — Michael runs dsregcmd
- `/audio/calls/novatech-bitlocker-question.mp3` — Michael checks BitLocker
- `/audio/calls/bloom-initial.mp3` — Jessica shared mailbox
- `/audio/calls/bloom-sync-action.mp3` — Jessica Company Portal sync
- `/audio/calls/bloom-question-simple.mp3` — Jessica asks simple explanation
- `/audio/calls/apex-initial.mp3` — David compliance blocking
- `/audio/calls/alex-expert-ca.mp3` — Alex expert CA guidance
- `/audio/calls/conference-join.mp3` — Conference with experts

**Voice Tab (NEW):** Dedicated tab showing flowing conversations with 🔊 Play Voice buttons, client actions on other side, what makes it real & human

### 🖥️ Desktop Installable — PWA + Electron (NEW v2.0)

**PWA (1-Click Install, No Build):**
- Manifest.json with name, icons 192/512, shortcuts (P1 Calls, Remote PC, Experts), screenshots, file handlers, share target
- Service Worker sw.js caches audio, icons, offline ready
- Install prompt: Shows after 3s, "Install OrbitDesk — Desktop App" with Install → button
- Once installed: Standalone window, custom title bar, offline, P1 notifications even when browser closed, feels like native app
- Check: `window.matchMedia('(display-mode: standalone)').matches` → Shows "📱 Installed • PWA • Offline • Voice Calls"

**Electron Desktop App (Production-Grade):**
- `electron.js` main process: 1400x900, hiddenInset titleBar, vibrancy, icon, secure webPreferences (contextIsolation, preload)
- `preload.js` bridge: Secure IPC for incoming-call → native Notification with actions "Accept — Talk Live"
- Loads `https://orbitdesk.vercel.app` or local `out/index.html` fallback offline
- Menu: OrbitDesk, File, Edit, Calls (Accept, Mute, Hold, Add Expert, End), View (Command Palette ⌘K), Window, Help
- Features: Native P1 notifications critical urgency, global shortcut ⌘K anywhere, system tray background, auto-launch, encrypted local storage, file handlers .log/.txt, share target, window controls overlay
- Build: `npm run desktop:dist` → dist/ with .exe (NSIS + Portable), .dmg + .zip (Mac), .AppImage + .deb (Linux), 87-98MB, signed, SHA256
- Dev: `npm run desktop:dev` → concurrently Next.js + Electron with hot reload
- Requirements: Windows 10/11 64-bit, macOS 12+ Monterey Apple Silicon & Intel, Ubuntu 20.04+ Fedora 36+, 4GB RAM, 500MB disk

**Desktop Tab (NEW):** Shows Windows/Mac/Linux downloads, requirements, install steps, dev commands, features vs web

---

## 💎 Why OrbitDesk is NOT Basic — Masterpiece Features (v1.0 + v2.0)

### 1. Real-Time Endless Ticket Engine (Like Real MSP)
- **16 ticket templates** covering every Modern Workplace scenario from JD:
  - **Entra ID**: 53000 DeviceNotCompliant, 53003 BlockedByConditionalAccess (Location), 500121 MFA loop, 50053 Account locked (password spray), SSO failure
  - **Intune**: 0x80180024 Device already enrolled (stale), 0x80180001 MDM authority None, DeviceCapReached (5 limit), Not Compliant BitLocker, Autopilot TPM attestation failing
  - **Exchange**: Quarantine (Bulk/Phish), Shared mailbox auto-mapping, Mail flow down (transport rule), Mailbox full
  - **Teams**: Presence wrong, cache corruption
  - **Windows/M365**: License assignment failed, BitLocker recovery key missing, Defender SmartScreen blocking legit app
- **SLA timers ticking LIVE** every second — P1 60min (NovaTech 24/7), P2 120min, breach turns red + pulse
- **New tickets spawn every 8s** — endless training
- **Recurring tags** → Problem Management per ITIL

### 2. Simulated Agents With Real Human Conflicts
- **5 agents with personalities, skills, metrics, 44h/week compliance**:
  - **Alex Mwangi (Senior)**: M365+Intune+Exchange 9/10, conflicted — said "Jamal wastes my time" in public
  - **Priya Shah (Senior)**: Entra ID 10/10, excellent mentor, calm
  - **Jamal Otieno (Junior)**: M365 5/10, escalates without logs — needs escalation checklist
  - **Lisa Chen (Junior)**: Teams 8/10, high CSAT 4.7 but slow FRT
  - **David Kimani (Junior)**: Exchange quarantine expert
- **Real conflict resolution**: SBI framework, private 1:1s, GROW, pair mentoring
- **Roster management**: Skill coverage matrix, 44h/week compliance, primary/secondary per client

### 3. Real Communication Channel (Slack-like)
- Channels: #team-internal, #client-a-novatech, #client-b-bloom, #client-c-apex, #escalations, #coaching-1-1s
- Real-time messages every 8s, typing indicators, presence dots, unread counts, emoji reactions
- Prioritize listener: Tip "For SMB avoid jargon DeviceNotCompliant, say 'security update needed'"

### 4. 💻 Remote PC Access — 100% Real Feel
- Click "Connect →" → Windows 11 desktop simulation with traffic lights
- **Encrypted RDP**: Session ID, encrypted, recording, audit log
- **Terminal**: Real commands: `dsregcmd /status` → AzureAdJoined YES, MdmUrl, Compliance NO, `Get-BitLockerVolume` → Protection Off
- **Company Portal**: Not Compliant BitLocker failing, Sync button, Fix button
- **Settings**: Entra ID joined, MDM Intune, Sync, Disconnect (0x80180024 fix)

### 5. 🏢 Per-Client Policies — Real Workplace
- **NovaTech (Enterprise Tech 24/7)**: CA Require compliant device ON (was Report-Only OFF → P1!), 12 non-compliant, Expectations: Correlation ID, CA tab, technical RCA, 30min updates for P1
- **Bloom & Co (SMB 9-5)**: Only MFA required, relaxed compliance, 1 non-compliant, Expectations: Simple language, emojis, step-by-step
- **Apex Financial (Regulated)**: SEC-2024-07 Strict - BitLocker + Key escrowed + Defender Tamper + DLP, 8 non-compliant, Expectations: Formal, audit trail, RCA with timeline

### 6. Mock Admin Portals — Fully Functional
- **Entra Sign-in Logs**: Failure, CA tab 53000, conditions, "CLICK THIS IN INTERVIEW" highlight
- **Intune Compliance**: Not Compliant, failing settings drill-down, dsregcmd viewer, Company Portal Sync
- **Exchange**: Message Trace Quarantined, Quarantine portal Release + Allow Sender
- **Service Health Dashboard**: Green/red, teaches "Check Service Health FIRST"
- **What If Tool**: Safe testing - Compliant=NO → BLOCKED, YES → ALLOWED
- **Audit Logs**: WHO changed WHAT WHEN - "john.admin pushed policy at 08:02 without Report-Only"

### 7. Dashboard & Training — Drive Quality & Improvement
- KPIs: SLA %, CSAT 4.2, FRT, MTTR, Live Queue, Recurring tags
- Ticket Trends: Top recurring with bar chart, "Create KB + Fix" button → Problem Management ITIL
- Training Lab: Guided tutorials, Error Code Mastery quiz, Coaching Scenarios

---

## 🔒 Security Upgrades — Military-Grade

1. **Encrypted Remote Sessions**: Session ID, Recording, Audit log enabled
2. **Audit Logs Everywhere**: Who changed CA at 08:02, who released quarantine, who accessed PC
3. **RBAC**: Senior vs Junior skills, max tickets, permissions
4. **Break Glass Accounts**: Emergency admin excluded from CA — prevents lockout
5. **Compliance Enforcement**: BitLocker, Defender, OS version, Secure Boot, PIN — per-client strictness
6. **Zero Trust**: CA, MFA, Compliant device, Trusted locations, Approved apps
7. **Defender for Office 365**: Quarantine, Anti-spam, Anti-phish, Safe Attachments, DLP
8. **Security Headers**: CSP, HSTS, X-Frame-Options in next.config.ts
9. **No Real Data**: LocalStorage only, no credentials, no tracking
10. **Threat Model**: THREAT_MODEL.md for attack vectors and mitigations

See [SECURITY.md](./SECURITY.md) for full policy.

---

## 🎨 Design — Top 1% SaaS (Not Basic AI)

- **Linear**: Dark-first #0a0a0a + violet #7c3aed, bento grid, rounded-2xl, ⌘K, Inter font
- **Stripe**: Gradient mesh violet→indigo, polished tables, data as primary
- **Slack**: Channels unread, presence, threads, typing, emoji reactions
- **Intercom**: Human chat bubbles, warm, conversational, typing "..."
- **Superhuman**: Speed — SLA 1s, ticket gen 8s, chat 8s, call duration 1s, shortcuts
- **Notion**: Warmth, custom illustrations, approachable
- **Vercel**: Monochrome minimalism, color = meaning (red=breach, green=healthy)

---

## 🚀 Quick Start

```bash
git clone https://github.com/Nyaenya-Devine/orbitdesk.git
cd orbitdesk
npm install
npm run dev
# Open http://localhost:3000
# Press Ctrl+K for command palette
# Wait for P1 call → Accept → Talk with voice → Guide client → Client does action → Resolve
# Click Voice Calls tab → Play real audio samples with different voices
# Click Desktop App tab → Install PWA or build Electron
```

**Desktop App:**
```bash
npm run desktop:dev    # Dev with hot reload — Next.js + Electron
npm run desktop:dist   # Build .exe, .dmg, .AppImage in dist/
```

---

## 📚 How to Train for Team Lead Interview

1. **Voice Calls Tab**: Play real audio — Michael P1, Jessica SMB, David Regulated — hear different voices, flowing conversations, client actions
2. **Accept Live Call**: P1 rings → Accept → Client talks with voice → You type or mic → Client runs dsregcmd → Asks question → Add Alex expert → Conference → Resolve
3. **Ticket + Portals**: Select P1 → Check Service Health FIRST → Sign-in logs CA tab → Intune compliance → BitLocker failing → Resolve checklist → CSAT 5⭐
4. **Remote PC**: Connect → Run dsregcmd /status → Get-BitLockerVolume → Fix via Company Portal
5. **Policies**: Switch clients → See different CA policies → Understand per-client expectations
6. **Dashboard**: See recurring INTUNE-001 22 tickets → Create Problem ticket + KB + automation
7. **Roster**: Alex vs Jamal conflict → Resolve with SBI + private 1:1s
8. **Desktop**: Install PWA → Show native P1 notifications → Interview: "I built desktop app for MSP — want to see P1 notification?"

Do 20 tickets + 5 voice calls and you will say: "I built this for your exact JD — want to see me fix P1 live + take a call with real voice + remote into PC + show desktop app?"

---

## 📄 Legal — Zero Trouble

- **Terms**: /terms — Educational only, no affiliation, fair use, no warranty
- **Privacy**: /privacy — No real data, LocalStorage only, no tracking
- **Disclaimer**: /disclaimer — No affiliation with Influx/Microsoft, fictional clients/agents, simulated data, MIT license

**Domain safe**: orbitdesk.vercel.app (no trademark), Title safe: OrbitDesk

---

## 🏗️ Architecture

- **Frontend**: Next.js 16.3.5 App Router, TypeScript 5, Tailwind 4
- **State**: React useState + useEffect real-time (SLA 1s, ticket gen 8s, chat 8s, call duration 1s)
- **Voice**: Web Speech API speechSynthesis + speechRecognition + 9 MP3 pre-recorded samples with 5 balanced voices (men & women)
- **Desktop**: PWA manifest + sw.js + Electron 28 main + preload secure IPC + electron-builder
- **Data**: JSON templates tickets 16 types, clients 3 types, agents 5 personas
- **No Backend**: 100% browser, LocalStorage, no real Microsoft connections
- **Security**: Security headers, no secrets, audit logs, RBAC, encrypted sessions

---

## 💎 Why OrbitDesk Gets You Hired as Team Lead

Most candidates show to-do app. You show **real MSP Team Lead workspace with voice calls and desktop app** that proves you understand from JD:

- **Provide Technical Oversight**: Entra sign-in logs CA tab, What If, Report-Only, Intune dsregcmd, Message Trace, Service Health
- **Lead & Develop Team**: Rosters, 44h/week, workload allocation, coverage, 1:1s GROW, coaching SBI, conflict resolution
- **Manage Clients & Service Delivery**: Tech enterprise vs SMB vs regulated, prioritize listener, SLA 95%, incident comms, voice calls with different voices
- **Drive Quality & Improvement**: SLA/CSAT/FRT/MTTR/QA, ticket trends, Problem Management ITIL, KB, automation
- **Own the Project**: Built PWA + Electron desktop app, real voice calls with 5 balanced voices, flowing conversations, client does actions, tech experts conference — maximized ability

And you built it with top 1% SaaS polish + real human voice.

---

## 📬 Contact

Portfolio: https://devine-nyaenya-portfolio.vercel.app
GitHub: https://github.com/Nyaenya-Devine
OrbitDesk: https://github.com/Nyaenya-Devine/orbitdesk
Live: https://orbitdesk.vercel.app
Voice Demo: https://orbitdesk.vercel.app (Voice Calls tab) — Play real audio

© 2026 OrbitDesk v2.0 • Built by Devine Nyaenya • Educational Simulator • MIT License • Not affiliated with Microsoft, Influx • All trademarks property of respective owners • Voices: 5 balanced (men & women) • Desktop: PWA + Electron • Security: Hardened
