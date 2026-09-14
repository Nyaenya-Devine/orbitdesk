# OrbitDesk — Modern Workplace Operations Lab

Simulated MSP Team Lead environment for Entra ID, Intune, Exchange, Teams, and Windows troubleshooting — with real-time voice calls, remote PC access, per-client policies, and audit trails.

**Live:** https://orbitdesk-gamma.vercel.app · **GitHub:** https://github.com/Nyaenya-Devine/orbitdesk · **Portfolio:** https://devine-nyaenya-portfolio.vercel.app

---

## Overview

OrbitDesk simulates the day-to-day of a Modern Workplace Support Team Lead. You triage tickets, investigate sign-in logs, test Conditional Access policies with What If, verify device compliance with `dsregcmd`, handle Exchange quarantine, and take live voice calls where you greet the client first and troubleshoot collaboratively.

It is designed to train support engineers and team leads, not just demonstrate technical knowledge. Each client has different policies, each agent has different skills, and every action is logged.

**Current:** v6.0 — Voice-to-voice calls (mouth-to-ear, no texting), Queen Elizabeth 👑 level polish, orbit on PC with wooden stand fixing, 8K asset pack.

---

## Demo Flow

1. **Queue** — 5 tickets, max 1 P1 (Student Mode). Open P1, review Service Health, sign-in logs, audit logs.
2. **Remote PC** — Encrypted session with Session ID and recording indicator. Run `dsregcmd /status`, sync Company Portal, verify BitLocker. Portal actions affect RDP state (green proof).
3. **Voice Calls v6.0** — Phone rings (800Hz Web Audio). Accept → hear short greeting → you greet first with your mouth (caller hears your voice) → client introduces → problem → troubleshooting where client executes actions when asked (`dsregcmd`, `Get-BitLockerVolume`) and asks follow-up questions → resolution → scoring.
4. **Tech Experts** — Add Entra, Intune, Exchange, or Teams expert to the call for conference troubleshooting.
5. **Clients & Agents** — Workload allocation, SBI coaching, escalation rules, RBAC.

Call state machine: `waiting_greeting` → `waiting_intro` → `problem` → `troubleshooting` → `resolution`

---

## Features

**Voice Interaction**
- 5 personas (Enterprise, SMB, Regulated) with distinct rate/pitch and vocabulary
- Web Speech API: TTS for client, STT for you with live interim transcript
- Hold-to-speak, no text input in call — mouth-to-ear like real phone
- Audio level visualization, recording indicator

**Remote Access**
- Encrypted RDP simulation with Session ID, client consent, audit log
- Real linkage: BitLocker fix, Company Portal sync, compliance state reflected in RDP
- Terminal with allowlisted commands: `dsregcmd`, `ipconfig`, `whoami`, `Get-BitLockerVolume`

**Policies & Tickets**
- 16 ticket templates: Entra 53000/53003/500121, Intune 0x80180024/0x80180001/DeviceCapReached/BitLocker/Autopilot, Exchange quarantine, Teams, Defender
- Per-client: NovaTech (24/7 strict CA), Bloom (SMB relaxed), Apex (SEC-2024-07 strict + DLP)
- Problem Management: recurring INTUNE-001 → Problem ticket, KB, automation

**Team & Operations**
- 5 agents with skills 1-10, 44h/week, SLA/CSAT/QA/FRT/MTTR, mood, learning gaps
- Coaching: SBI + GROW, 1:1s, pair mentoring, conflict handling
- 6 mock admin portals: Entra sign-in logs CA tab, What If, Report-Only, Audit Logs, Service Health, Intune compliance drill-down, Exchange Message Trace/Quarantine

**Platform**
- PWA: manifest, icons (192/512 maskable), shortcuts (P1 Calls, Remote PC, Experts), file handlers, share target, offline cache
- Electron: 28, main 1400x900, hiddenInset, vibrancy, contextIsolation, preload, native notifications, menu, tray, auto-launch
- Student/Expert modes: balanced queue (P1 3% student, 15% expert), 7-step guide, progressive disclosure

---

## Security Architecture

OrbitDesk implements controls modeled on production Modern Workplace environments:

- **RBAC:** Senior/Junior/Lead roles, max tickets, skill requirements, Junior cannot handle Intune without senior
- **Audit Logging:** Entra audit (who changed CA at 08:02), Exchange quarantine release, Intune device delete, remote commands with actor/activity/target/time
- **Break Glass:** Emergency account excluded from all CA policies, monitored, prevents lockout
- **Conditional Access:** Require compliant device, Require MFA, Trusted locations, Approved apps, Report-Only mode + What If simulation
- **Device Compliance:** BitLocker (key escrowed), Defender (real-time, tamper protection), OS version, Secure Boot, PIN
- **Email Security:** Defender for Office 365 quarantine (Bulk/Spam/Phish), Release + Allow Sender + Report Not Junk, anti-spam/phish policies, DLP
- **Headers:** HSTS `max-age=63072000; includeSubDomains; preload`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(self), geolocation=()`, CSP `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'`
- **Input:** Terminal command allowlist, no `eval()`, no hardcoded secrets (`grep -r ghp_` clean), external links `rel="noopener noreferrer"`
- **Dependencies:** `npm audit --omit=dev` → 0 vulnerabilities. `npm audit` → 2 high in `electron@28` devDependency (GHSA extract-zip symlink traversal, ASAR integrity bypass). Mitigation: Electron not used in production Vercel deployment, only desktop packaging; uses `contextIsolation`, `preload.js`. Upgrade path: `electron@41.7.1` breaking change, tracked.

See `SECURITY.md` and `THREAT_MODEL.md` for details.

---

## Design System

Inspired by Linear (dark-first, violet accent, bento, rounded-2xl, ⌘K), Stripe (gradients, metrics), Slack (channels), Intercom (human chat), Superhuman (speed), Notion (warmth), Vercel (restraint), Figma (multiplayer), Gong (call analytics), Duolingo (gamification).

- Framer Motion 13.2.0: spring 400/25, AnimatePresence wait y8 0.25s, queue stagger idx*0.03, hover 1.01 tap 0.99, 60fps
- Logo: orbit on PC with round wooden walnut stand, PC on wood, orbit fixing with details (M365, Entra shield, Intune check, BitLocker, Company Portal sync, voice waveform, remote cursor, hash-chain)
- Assets: god mode polished transparent logo (1024), dashboard 8K bento, call center mouth-to-ear, remote 100% real feel, downloadable pack `/orbitdesk-logo-pack-8k.zip` (13MB, 8 images)

---

## Tech Stack

- Next.js 16.3.5 (Turbopack), React 19.2.1, Framer Motion 13.2.0, Tailwind CSS 4
- Web Speech API (TTS/STT), Web Audio API (ringtone 800Hz), MediaDevices (mic)
- PWA + Electron 28 + electron-builder 26.15.3
- LocalStorage only, no backend, no real credentials

---

## Getting Started

```bash
npm install
npm run build   # 7 routes: /, /_not-found, /disclaimer, /lab, /privacy, /terms, /google2fc201988ef60e66.html
npm run dev     # localhost:3000
npm run desktop:dev   # concurrently Next.js + Electron hot reload
npm run desktop:dist  # dist/ .exe .dmg .AppImage 87-98MB
```

---

## Deployment

- **Vercel:** Import `Nyaenya-Devine/orbitdesk` → name `orbitdesk-gamma` → Deploy. Auto-deploy on push to `main`. Production domain `orbitdesk-gamma.vercel.app` aliased.
- **Env:** No secrets required. All data simulated in browser.

---

## Competencies Demonstrated

OrbitDesk maps to Modern Workplace Support Team Lead responsibilities:

- **Entra ID:** Sign-in logs CA tab 53000 DeviceNotCompliant, What If, Report-Only 24h, Audit Logs, Break Glass
- **Intune:** Enrollment 0x80180024 stale, DeviceCapReached, Compliance BitLocker, `dsregcmd /status`, Company Portal Sync, `Get-BitLockerVolume`
- **Exchange:** Message Trace Quarantined Bulk/High, Release + Allow Sender + Report Not Junk, Anti-spam tuning
- **Teams/Windows:** Service Health check FIRST, Teams access blocked, Windows BitLocker compliance
- **Operations:** SLA 95% CSAT 4.5 FRT MTTR, ticket trends → Problem Management ITIL, roster 44h/week, QA, coaching SBI/GROW, RBAC

---

## Documentation

- `SECURITY.md` — Security controls, audit results, reporting
- `THREAT_MODEL.md` — 8 attack vectors (CA misconfig → P1, stale enrollment → 0x80180024, quarantine false positive, BitLocker key loss, etc.) + mitigations
- `docs/` — Additional notes, changelog
- `public/orbitdesk-logo-pack-8k.zip` — 8K assets, god mode polished logo

---

## License

MIT — Educational simulator, not affiliated with Microsoft. All trademarks property of respective owners. 5 voices men & women. See `LICENSE`.

© 2026 OrbitDesk v6.0 — Voice-to-voice, remote PC, per-client policies, audit trails.
