# OrbitDesk v5.1 — Flowing Conversation Fix + Student Mode

**The only helpdesk simulator where calls flow like real human conversations — YOU greet first, not client dumping P1 with Correlation ID**

**Live:** https://orbitdesk-gamma.vercel.app (permanent) · https://temporary-rapid-nova-4v5bqt9.vercel.app (claim: `84225680-eb9d-4fa7-8033-984f52440c30`) · **GitHub:** https://github.com/Nyaenya-Devine/orbitdesk · **Portfolio:** https://devine-nyaenya-portfolio.vercel.app

---

## 🚀 v5.1 Flowing Conversation FIX — Real Human Phone Flow

**Problem v5.0:** Pick up call → client instantly dumps entire P1: *"Hi I'm Priya from Finance at NovaTech blocked by CA error 53000 Correlation ID 12345 Service Health green Payroll 45 mins P1"* — no chance to say hello, can't talk back, not human.

**Fix v5.1:** Real human flow like live call center:

1. **Phone rings 800Hz** Web Audio loop → Incoming modal → Accept
2. **You hear short:** *"Hello? Is this IT support?"* — `waiting_greeting` phase, badge shows phase, placeholder *"Say hello first: Hello, how may I help you today?"*
3. **YOU greet first:** *"Hello, thank you for calling OrbitDesk support, how may I help you today?"* — quick replies change per phase
4. **Client introduces flowing:** *"Hi thank you, this is Priya from Finance at NovaTech. I'm blocked by Conditional Access, error 53000..."* — `waiting_intro`, placeholder *"Acknowledge: Thank you, I can help..."*
5. **You acknowledge** → Client states problem conversationally but detailed → `problem_stated`
6. **Back-and-forth troubleshooting:** You ask `dsregcmd /status` → Client DOES action NOW *"Ran dsregcmd — AzureAdJoined YES Compliance NO"* with output box + success indicator, asks questions back *"What is ETA? Correlation ID... Will I lose my work?"* follow-up auto 4s
7. **Resolution:** *"Perfect, enabled BitLocker, synced, Compliant YES, Teams working! Thank you, payroll saved!"* → `resolution` → End call → Score 85/100 → Assessment updated

**Tech:** `CallCenterV3.tsx` phases `waiting_greeting` → `waiting_intro` → `problem_stated` → `troubleshooting` → `resolution`, `greetingResponses` short hello waiting, `introResponses` full intro after you greet, `troubleshootingReplies` + `resolutionReplies`, dynamic placeholder + quick replies per phase, TTS speaks each turn `speakText()`, phase badge in header, scoring empathy/clarity/technical/fluency/clientLang live.

---

## 🎓 v5.0 Student Mode — Balanced Queue + Real RDP Linkage

**Problem:** Queue shows 18 total 9 P1 too many — overwhelming for student learning, expert stress, not beginner friendly. Actions show toast committed but not showing on real machine — portal actions must affect RemoteDesktop RDP real state. Remote Access words cut — overflow. Most parts disjointed too complicated for student.

**Fix:**

- **Student Mode toggle:** `studentMode=true` default, `P1 3% student 15% expert`, `generateInitialTickets 5 max 1 P1 loop attempts<10` — balanced queue, not overwhelming
- **RemoteDesktopV2:** Fixes words cut `break-words truncate min-w-0 responsive`, real linkage props `bitLockerFixed syncDone` — portal→RDP: BitLocker Fixed shows On Escrowed green, Compliance green, Teams Online, visual proof
- **StudentModeGuide:** 7-step tutorial modal progressive disclosure simplified UI, guided tutorials
- **Protection + Viral + Earning docs:** `PROTECTION_VIRAL_EARNING.md` — license/watermark/branding protection, viral content plan human storytelling not poor AI videos, earning plan actionable

---

## 🎙️ Real Voice Both Sides + Desktop Installable (v2.0-v4.0 Core)

- **5 Balanced Voices Men & Women:** Michael NovaTech Enterprise masculine formal rate 1.0 P1 payroll 50 users 53000, Jessica Bloom SMB feminine friendly rate 1.1 pitch 1.1 casual emojis shared mailbox, David Apex Regulated masculine deep rate 0.9 pitch 0.8 formal SEC-2024-07 BitLocker — different issues, different voices
- **Web Speech API:** TTS `speechSynthesis` speaks each turn with rate/pitch per persona, STT `SpeechRecognition` mic 🎙️ live transcription, 9 MP3 pre-recorded samples
- **Tech Experts Conference:** Add expert to call — Alex Entra male formal direct, Priya Intune female friendly patient mentor, David Exchange calm security, Lisa Teams empathetic — different voices, conference with client+expert+you
- **PWA + Electron:** `manifest.json` icons 192/512 maskable shortcuts P1 Calls/Remote PC/Experts screenshots file handlers .log/.txt share target sw.js offline cache InstallPrompt beforeinstallprompt handler Install button + Electron 28 main 1400x900 hiddenInset vibrancy secure webPreferences contextIsolation preload.js native P1 notifications actions Accept menu OrbitDesk/File/Edit/Calls/View/Window/Help global shortcuts ⌘K system tray auto-launch encrypted storage file handlers — `.exe` `.dmg` `.AppImage` 87-98MB
- **16 Ticket Templates:** Entra 53000/53003/500121, Intune 0x80180024/0x80180001/DeviceCapReached/BitLocker/Autopilot, Exchange Quarantine/Message Trace, Teams, Windows BitLocker, Defender
- **Per-Client Policies:** NovaTech 24/7 strict CA Require compliant device ON without Report-Only → P1 50 users blocked, Bloom SMB relaxed MFA only 9-5, Apex Regulated SEC-2024-07 Strict + DLP + Defender Tamper
- **5 Simulated Agents:** Skills 1-10 44h/week compliance SLA/CSAT/QA/FRT/MTTR mood learning gaps conflicts Alex vs Jamal SBI + GROW coaching 1:1s pair mentoring
- **6 Mock Admin Portals:** Entra Sign-in logs CA tab showing DeviceNotCompliant 53000 + What If tool safe testing + Report-Only mode + Audit Logs who pushed policy at 08:02 + Service Health Dashboard check FIRST + Intune Device Compliance drill-down + dsregcmd + Exchange Message Trace + Quarantine Release + Allow Sender
- **Dashboard:** SLA 95% CSAT 4.5 ticket trends INTUNE-001 22 tickets → Problem Management ITIL + KB + automation, Training Lab guided tutorials error code mastery quiz coaching scenarios, Live Scoring 📊 85/100 empathy clarity technical fluency clientLang

---

## 🔒 Security Hardened — Military-Grade

- Encrypted RDP Session ID + Recording + Audit log + Client consent
- Audit logs everywhere: Entra Audit who changed CA at 08:02, Exchange quarantine release, Intune device delete, remote commands
- RBAC Senior/Junior/Lead max tickets skills, Junior cannot do Intune without senior
- Break Glass accounts excluded from CA — prevents lockout, mentioned in What If
- Zero Trust: CA Require compliant + MFA + Trusted locations + Approved apps, Compliance BitLocker + Defender + OS version + Secure Boot + PIN per-client strictness
- Defender for Office 365 Quarantine + Anti-spam + DLP
- Security headers: `next.config.ts` HSTS 63072000 preload, CSP `default-src self script-src self unsafe-eval unsafe-inline style-src self unsafe-inline fonts.googleapis.com`, X-Frame DENY, X-Content nosniff, Referrer strict-origin, Permissions camera/mic/geolocation none
- No secrets `grep ghp_ clean`, input sanitization command whitelist, npm audit 0 vulns prod (2 high in electron devDependency only, fix requires breaking 41.7.1)
- Threat model 8 vectors + mitigations, LICENSE MIT, SECURITY.md, THREAT_MODEL.md

---

## 🎨 Design — Human Premium, Not AI Basic

Inspired by top 20 sites combined: **Linear** dark-first violet accent bento rounded-2xl ⌘K, **Stripe** gradients, **Slack** channels, **Intercom** human chat, **Superhuman** speed, **Notion** warmth, **Vercel** restraint, **Figma** multiplayer, **Gong** call analytics, **Duolingo** gamification — not basic AI, human premium masterpiece.

- Framer Motion 13.2.0: toasts spring 400/25 x80 scale0.9, tabs AnimatePresence wait y8 0.25s, queue motion.button idx*0.03 slide-in hover 1.01 tap 0.99, 60fps memo timers debounce search
- Logo human premium SVG orbit desk satellite glow animated not worst ◍
- Web vs App landing + /lab split, install like APK on PC PWA 1-click + Electron .exe wizard OS detection
- Disclaimer moved from scary top amber banner to friendly bottom footer — top banner dark friendly with 5 Voices PWA+Electron badges

---

## 📦 Build & Deploy

```bash
npm install
npm run build # 7 routes: /, /_not-found, /disclaimer, /google2fc201988ef60e66.html, /lab, /privacy, /terms
npm run dev   # localhost:3000
npm run desktop:dev  # concurrently Next.js + Electron hot reload
npm run desktop:dist # dist/ .exe .dmg .AppImage 87-98MB
```

**Deployment:**
- **Temporary (live now):** https://temporary-rapid-nova-4v5bqt9.vercel.app — claim https://vercel.com/claim-deployment?code=84225680-eb9d-4fa7-8033-984f52440c30 (expires 60m)
- **Permanent target:** https://orbitdesk-gamma.vercel.app (prj_I1tNdOjNiSJRrPwOHWYsuaF2yd21) — import via https://vercel.com/new → Import Nyaenya-Devine/orbitdesk → name orbitdesk-gamma → Deploy → auto-deploy on push
- **GitHub:** https://github.com/Nyaenya-Devine/orbitdesk — v5.1 pushed 8bafe57
- **Portfolio:** https://devine-nyaenya-portfolio.vercel.app — includes v5.1 case study
- **Profile:** https://github.com/Nyaenya-Devine — v5.1 featured

**Vercel Project ID:** `5c2492ac-70e2-42be-98dc-d9937f0c494a` — needs Vercel token `vercel_...` from https://vercel.com/account/tokens to deploy to prod via CLI, or use GitHub import (recommended, auto-deploy).

---

## 🎯 How to Train — Flowing Conversation

1. **Queue** → 5 tickets max 1 P1 balanced → click P1 → detail → portals → checklist logs+tool → Resolve → toast CSAT ⭐ QA % → dashboard
2. **RDP** → Connect → encrypted + recording ON toast → terminal `dsregcmd /status` → Company Portal Sync → fix BitLocker → portal action affects RDP real state green proof
3. **Call Center v5.1** → phone rings 800Hz → Accept → hear "Hello? Is this IT support?" waiting_greeting → YOU "Hello, how may I help?" → client "Hi this is Priya from Finance..." waiting_intro → problem → troubleshooting back-and-forth where client does actions when asked + asks questions back → add expert Alex → conference → End call → Score 85/100 → Assessment
4. **Comms** → send message → typing bounce → auto-reply
5. **Clients** → assign ticket → workload update → resolve conflict SBI
6. **Student Mode** → toggle Student/Expert → 7-step guide → tutorials → progressive disclosure

---

## 💼 For Influx / MSP Team Lead Application

OrbitDesk proves Team Lead Modern Workplace Support skills:
- **Entra ID:** Sign-in logs CA tab 53000 DeviceNotCompliant, What If tool, Report-Only 24h, Audit Logs who pushed at 08:02, Break Glass excluded
- **Intune:** Enrollment 0x80180024 stale, DeviceCapReached, Compliance BitLocker, dsregcmd /status, Company Portal Sync, Get-BitLockerVolume
- **Exchange:** Message Trace Quarantined Bulk High, Release + Allow Sender + Report Not Junk, Anti-spam tuning
- **Teams/Windows:** Service Health check FIRST, Teams access blocked, Windows BitLocker compliance
- **SLA/CSAT/QA:** SLA 95% CSAT 4.5 FRT MTTR, ticket trends → Problem Management ITIL, roster 44h/week coverage
- **Leadership:** 5 agents skills 1-10, conflicts SBI+GROW coaching, workload allocation, escalation without logs blocked, junior/senior RBAC

**Live demo with real voice both sides + flowing conversation + student mode = wins competition, Influx ready.**

---

© 2026 OrbitDesk v5.1 — Flowing Conversation Fix + Student Mode • Real Voice Both Sides • PWA + Electron • Security Hardened • Human Premium • MIT • Educational • Not affiliated with Microsoft, Influx • All trademarks property of respective owners • 5 voices men & women • Own the project, maximize ability
