# OrbitDesk — Modern Workplace Operations Lab v6.7.2

![CI](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/security.yml/badge.svg)
![CodeQL](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/security.yml/badge.svg)
![Electron Release](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/electron-release.yml/badge.svg)
![SBOM](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/sbom.yml/badge.svg)
![SLSA](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/slsa.yml/badge.svg)
![Signed Commits](https://img.shields.io/badge/Commits-Signed%20Verified-brightgreen?logo=git)
![Electron](https://img.shields.io/badge/Electron-32.3.3-47848F?logo=electron)
![PWA](https://img.shields.io/badge/PWA-TWA%20Ready-5A0FC8?logo=pwa)
![Play Store](https://img.shields.io/badge/Play%20Store-TWA%20assetlinks.json-3DDC84?logo=googleplay)
![License](https://img.shields.io/badge/License-MIT-green)

Simulated MSP Team Lead environment for Entra ID, Intune, Exchange, Teams, and Windows troubleshooting — with LinkedIn-style messaging dock, real-time voice calls, remote PC access, per-client policies, audit trails, and Electron auto-update.

**Live:** https://orbitdesk-gamma.vercel.app · **GitHub:** https://github.com/Nyaenya-Devine/orbitdesk · **Portfolio:** https://devine-nyaenya-portfolio.vercel.app

---

## v6.7.1 — What's New (Signed Commits + SLSA + AssetLinks)

### Signed Commits + SLSA Provenance + Play Store AssetLinks (NEW)
- **Signed Commits Guide** `docs/SIGNED_COMMITS.md` — SSH (ed25519) or GPG, Verified badge, branch protection Require signed commits + status checks + CODEOWNERS, troubleshooting GPG_TTY
- **SLSA L3 Provenance** `.github/workflows/slsa.yml` — slsa-framework/slsa-github-generator generic SLSA3, builds Linux artifacts, generates SHA256 digests base64, provenance attests commit → workflow → artifact, verify via slsa-verifier, upload-assets true
- **AssetLinks** `public/.well-known/assetlinks.json` — TWA Play Store verification delegate_permission/common.handle_all_urls for com.orbitdesk.lab.twa + com.orbitdesk.lab, SHA256 fingerprints placeholder REPLACE_WITH_YOUR_KEYSTORE, served as application/json via next.config.ts headers + CORS
- **Version bump** 6.7.0 → 6.7.1 — badges CI Security CodeQL Electron Release SBOM SLSA Signed Verified Electron PWA Play Store MIT

## v6.6 — What's New (Essential Cybersecurity + GitHub)

### LinkedIn-Style Messaging Dock — Like Screenshot
Bottom-right 320px white rounded-t-xl shadow-2xl — Messaging header with avatar online dot, unread red badge, ••• ✎ ⌃ buttons, search #edf3f8 rounded-full, Focused emerald pill / Other, conversation list avatar+name+snippet+role+time+unread dot, footer OrbitDesk — Real MSP chat.

Chat windows 320x400 white, header avatar status, MONDAY separator, bubbles white border client rounded-bl-sm / violet you rounded-br-sm with name + time + ✓✓, typing dots, blue info "You haven't received a response yet. Learn more", input #f4f2ee rounded-full with 😊 📎, bottom icons 🖼️ 🎥 📎 + Send pill. Max 2 windows, auto-open live ticket, spring animation.

### Modern Toast + Orbit + Layout Fix
- Toast: bottom-left z-45 w-340 blur-2xl, max 2 visible, not covering StudentModeGuide z-100, thin gradient progress, swipe drag x dismiss, grouped
- Logo: restored rotating orbit rings 6s/8s/12s, dots, glow blur, pulse — Lab • v6.1 • Real Voice • Human with rotating ◍
- Layout: header 56px pill tabs, flex-1 min-h-0, footer mt-auto, pb-80px for dock, no calc overlap, z hierarchy toast 45 < dock 65 < guide 100 — Linear + Vercel + Stripe inspired

### Pause-When-Away (v6.5)
Auto-pause on visibilitychange, SLA push-forward, welcome-back 0-3 tickets, ShiftStatus, manual Pause/Resume

### Electron 32.3.3 + Auto-Update — Essential GitHub
- **Updated:** 28.0.0 → 32.3.3 (Chromium 128, Node 20) — CVE fixes GHSA extract-zip symlink traversal, ASAR integrity bypass
- **Auto-Update:** electron-updater 6.6.2 + electron-log 5.2.1 — GitHub Releases signed, user consent (autoDownload false — zero-trust), autoInstallOnAppQuit true
- **Flow:** checking → available (dialog Download Now/Later) → download progress → downloaded (Restart Now/On Next Launch) → quitAndInstall
- **Security:** contextIsolation true, sandbox true, nodeIntegration false, webSecurity true, permission handler mic only, singleInstanceLock, CSP session header, external nav blocked, preload whitelist only
- **Menu:** Check for Updates, Version, Security Policy, Threat Model, Audit Logs, Report Security Issue
- **Publish:** package.json build.publish → github owner Nyaenya-Devine repo orbitdesk, artifacts: exe nsis portable, dmg zip x64+arm64, AppImage deb, yml yaml, sbom.json
- **SBOM:** CycloneDX JSON + XML via @cyclonedx/cyclonedx-npm, upload to GitHub Dependency Graph

### GitHub Hardening — Cybersecurity Titles Essential
- **Dependabot:** weekly npm + github-actions, groups dev-deps + electron, labels security
- **CODEOWNERS:** Devine owns security critical files — SECURITY.md, THREAT_MODEL.md, electron.js, preload.js, next.config.ts, workflows
- **Workflows:**
  - `ci.yml`: Build, Lint, TypeCheck, secret grep ghp_/github_pat_, essential files verify, SBOM
  - `security.yml`: CodeQL SAST, Dependency Review fail high, TruffleHog verified, grep PAT leak, npm audit high, headers check, electron hardening check
  - `electron-release.yml`: Build win/mac/linux on tag v*.*.*, publish GitHub Releases with auto-update yml, release notes with LinkedIn dock + security
  - `sbom.yml`: CycloneDX JSON+XML, upload artifact + dependency submission
- **Issue Templates:** bug_report (area, severity, logs), feature_request (top 20 inspiration, security titles), security (private advisory)
- **PR Template:** security checklist zero-trust, audit logging, build verification, SBOM
- **Security Policy:** .github/SECURITY.md — supported versions, private disclosure via Security Advisory, response SLA 24h ack 72h triage 7d critical fix, Hall of Fame, architecture table, badges
- **Entitlements:** build/entitlements.mac.plist — hardened runtime, JIT, unsigned exec mem, network client, audio-input (mic) — no camera/geo
- **Branch Protection (Recommended):** Require CI + Security workflows, CODEOWNERS review, secret scanning, signed commits, SLSA provenance future

---

## Overview

OrbitDesk simulates day-to-day of Modern Workplace Support Team Lead. You triage tickets, investigate sign-in logs, test Conditional Access with What If, verify compliance with `dsregcmd`, handle Exchange quarantine, take live voice calls where you greet first and troubleshoot collaboratively, and message clients via LinkedIn-style dock.

Designed to train support engineers and team leads, not just demo technical knowledge. Each client different policies, each agent different skills, every action logged, pause when away like real shift.

**Current:** v6.6 — LinkedIn chat dock, orbit animation restored, modern toast bottom-left, layout no overlap, pause system, Electron 32 auto-update, SBOM, GitHub hardening.

---

## Demo Flow — Interview Ready

1. **Queue** — 5 tickets max 1 P1 Student Mode, 25 endless Expert. Open P1, review Service Health, sign-in logs CA tab 53000 DeviceNotCompliant, audit logs 08:02 change.
2. **LinkedIn Dock** — Bottom-right Messaging 320px — Focused/Other, search, conversation list. Click opens 320x400 chat window left of dock — MONDAY, bubbles, typing, "You haven't received a response yet", #f4f2ee input. Auto-opens live ticket when you select ticket — real client messaging.
3. **Remote PC** — Encrypted Session ID recording indicator. Run `dsregcmd /status`, sync Company Portal, verify BitLocker `Get-BitLockerVolume` — portal actions affect RDP green proof.
4. **Voice Calls v6.0** — Phone rings 800Hz Web Audio. Accept → hear greeting → you greet first mouth-to-ear (caller hears your voice) → client intro → problem → troubleshooting where client executes actions when asked and asks follow-up → resolution → scoring empathy clarity technical fluency.
5. **Tech Experts** — Add Entra, Intune, Exchange, Teams expert to call for conference.
6. **Clients & Agents** — Workload 44h/week, SBI coaching, escalation rules, RBAC Junior cannot handle Intune without senior.
7. **Pause** — Switch tab / minimize → auto-pause ⏸️ On Hold, SLA push-forward, welcome back 👋 away X min protected Y new tickets — like real shift.

Call state: `waiting_greeting` → `waiting_intro` → `problem` → `troubleshooting` → `resolution`

---

## Features

**LinkedIn Chat (NEW v6.6)**
- Dock: 320px white rounded-t-xl shadow-2xl, avatar online dot, Messaging, unread badge, ••• ✎ ⌃, search #edf3f8, Focused emerald / Other, list avatar+name+snippet+role+time+unread dot, footer OrbitDesk — Real MSP chat
- Windows: 320x400 white, header avatar status, MONDAY, bubbles white/violet, name time ✓✓, typing dots, blue info bar, #f4f2ee input 😊 📎, icons 🖼️ 🎥 📎 + Send pill, max 2, auto-open live ticket, spring

**Voice Interaction**
- 5 personas Enterprise/SMB/Regulated distinct rate/pitch vocabulary
- Web Speech API: TTS client, STT you with live interim transcript
- Hold-to-speak, no text in call — mouth-to-ear like real phone
- Audio level visualization, recording indicator

**Remote Access**
- Encrypted RDP Session ID, client consent, audit log
- Real linkage: BitLocker fix, Company Portal sync, compliance reflected in RDP
- Terminal allowlist: `dsregcmd`, `ipconfig`, `whoami`, `Get-BitLockerVolume`

**Policies & Tickets**
- 16 templates: Entra 53000/53003/500121, Intune 0x80180024/0x80180001/DeviceCapReached/BitLocker/Autopilot, Exchange quarantine, Teams, Defender
- Per-client: NovaTech 24/7 strict CA, Bloom SMB relaxed, Apex SEC-2024-07 strict + DLP
- Problem Management: recurring INTUNE-001 → Problem ticket, KB, automation

**Team & Operations**
- 5 agents skills 1-10, 44h/week, SLA/CSAT/QA/FRT/MTTR, mood, learning gaps
- Coaching: SBI + GROW, 1:1s, pair mentoring, conflict handling
- 6 mock portals: Entra sign-in logs CA tab, What If, Report-Only, Audit Logs, Service Health, Intune compliance drill-down, Exchange Message Trace/Quarantine

**Platform**
- PWA: manifest, icons 192/512 maskable, shortcuts P1 Calls/Remote PC/Experts, file handlers, share target, offline cache, TWA for Play Store via PWABuilder, MSIX for Windows Store
- Electron 32.3.3: 1400x900 hiddenInset vibrancy, contextIsolation sandbox preload, native notifications, menu with Security + Check for Updates, tray, single instance, auto-updater via GitHub Releases
- Student/Expert modes: balanced queue P1 3% student 15% expert, 7-step guide, progressive disclosure, XP leveling

---

## Security Architecture — Cybersecurity Titles

### Electron Hardening v6.6
| Control | Implementation | Status |
| ------- | -------------- | ------ |
| Version | 32.3.3 Chromium 128 Node 20 CVE fixes | ✅ |
| Auto-Update | electron-updater GitHub Releases signed user consent | ✅ |
| Sandbox | sandbox:true renderer isolated | ✅ |
| ContextIsolation | true no node in renderer | ✅ |
| NodeIntegration | false zero-trust | ✅ |
| WebSecurity | true + allowRunningInsecureContent false | ✅ |
| Permissions | mic allowed for voice STT logged, camera/geo blocked | ✅ |
| Single Instance | requestSingleInstanceLock prevents spoofing | ✅ |
| CSP | session header default-src self+vercel frame-ancestors none | ✅ |
| Preload | whitelist IPC only no direct node | ✅ |
| Entitlements | hardenedRuntime JIT network.client audio-input | ✅ |

### Headers — next.config.ts
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(self), geolocation=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
CSP: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'
```

### Supply Chain
- SBOM CycloneDX JSON+XML `npm run sbom` → sbom.json in release artifacts + GitHub Dependency Graph
- npm ci integrity lockfile pinned
- Dependabot weekly npm+github-actions groups
- CodeQL SAST security-and-quality, Dependency Review fail high allow MIT/Apache/BSD/ISC, TruffleHog verified secret scan + grep PAT, npm audit high fails, electron >=32 enforced
- Electron hardening check in CI

### MSP Security Model
- RBAC Senior max5 skills7-10 Junior max3 skills2-6 Lead max10 all8 UI enforces
- Break Glass emergency excluded all CA monitored prevents lockout P1
- Audit Logs Entra who changed CA 08:02 Report-Only OFF→ON Exchange who released quarantine Intune who changed compliance Remote every dsregcmd logged actor/time
- Compliance BitLocker required+escrowed Defender real-time tamper OS min 10.0.19045/22621 Secure Boot ON Apex SEC-2024-07 PIN 6 digits
- CA Require compliant device Require MFA SMS+Authenticator Trusted locations Nairobi HQ+Mombasa Approved apps Outlook/Teams only Apex
- Email Defender quarantine Bulk/Spam/Phish Release+Allow+Report Not Junk anti-spam per-client anti-phish impersonation finance Safe Attachments invoice PDFs DLP block external sharing PII

See SECURITY.md + .github/SECURITY.md + THREAT_MODEL.md

---

## Design System — Not AI-Basic

Inspired by Linear (dark-first violet accent bento rounded-2xl ⌘K), Stripe (gradients metrics), Slack (channels presence typing), Intercom (human chat), Superhuman (speed), Notion (warmth), Vercel (restraint), Figma (multiplayer), Gong (call analytics), Duolingo (gamification), LinkedIn (messaging dock).

- Framer Motion 13.2.0: spring 400/25 AnimatePresence wait y6 0.2s queue stagger idx*0.03 hover 1.01 tap 0.99 60fps
- Logo: polished PNG + orbit animation restored — rotating rings 6s/8s/12s dots glow blur pulse Lab • v6.1 • Real Voice • Human ◍ — hero variant scale+rotate
- Toast: bottom-left 340px blur-2xl max2 progress gradient swipe drag x grouped
- Chat: LinkedIn screenshot match — 320px white rounded-t-xl shadow-2xl search #edf3f8 Focused/Other list avatar+snippet+role+time unread dot footer OrbitDesk Real MSP chat + windows 320x400 MONDAY bubbles white/violet name time ✓✓ typing blue info #f4f2ee input
- Layout: header 56px pill tabs flex-1 min-h-0 footer mt-auto pb-80px dock z hierarchy 45<65<100 clean modern classy

---

## Tech Stack

- Next.js 16.3.5 Turbopack, React 19.2.1, Framer Motion 13.2.0, Tailwind 4
- Web Speech API TTS/STT, Web Audio 800Hz ringtone, MediaDevices mic
- PWA + Electron 32.3.3 + electron-builder 26.0.12 + electron-updater 6.6.2 + electron-log 5.2.1
- CycloneDX SBOM, Husky + lint-staged, Dependabot, CodeQL, TruffleHog
- LocalStorage only no backend no real credentials

---

## Getting Started

```bash
npm ci --ignore-scripts
npm run build   # 9/9 routes: /, /_not-found, /disclaimer, /lab, /privacy, /terms, /google...
npm run dev     # localhost:3000
npm run desktop:dev   # concurrently Next + Electron hot reload
npm run desktop:dist  # dist/ .exe .dmg .AppImage 87-98MB + yml yaml for auto-update
npm run desktop:publish # publish to GitHub Releases — auto-update via electron-updater
npm run sbom    # CycloneDX JSON SBOM for supply chain transparency
```

---

## Deployment — Vercel + Electron + Stores

- **Vercel:** Import Nyaenya-Devine/orbitdesk → name orbitdesk-gamma → Deploy. Auto-deploy on push main. Production orbitdesk-gamma.vercel.app aliased.
- **Electron:** Tag v6.6.0 → workflow electron-release.yml builds win/mac/linux → publishes to GitHub Releases with latest.yml + exe dmg AppImage + sbom.json → auto-update via electron-updater checks releases
- **Play Store — TWA via PWABuilder:** https://www.pwabuilder.com/ → package TWA → Play Console — manifest display standalone icons 512 shortcuts
- **Windows Store — MSIX via PWA:** PWABuilder → Windows package → MSIX → Partner Center OR electron-builder --win appx (requires cert)
- **Env:** No secrets required. All data simulated browser.

---

## Competencies — Titles Showcase

- **MSP Team Lead — Modern Workplace Operations Lab:** Entra ID sign-in logs CA tab 53000 DeviceNotCompliant What If Report-Only 24h Audit Logs Break Glass, Intune enrollment 0x80180024 stale DeviceCapReached Compliance BitLocker dsregcmd Company Portal Sync Get-BitLockerVolume, Exchange Message Trace Quarantined Bulk/High Release+Allow+Report Not Junk Anti-spam tuning, Teams/Windows Service Health FIRST Teams access blocked Windows BitLocker compliance, Operations SLA 95% CSAT 4.5 FRT MTTR ticket trends → Problem Management ITIL roster 44h/week QA coaching SBI/GROW RBAC
- **Cybersecurity:** Zero-Trust, Conditional Access, RBAC, Break Glass, Audit Logging, Device Compliance, Email Security Defender, DLP, Headers HSTS DENY nosniff CSP, Electron hardening sandbox contextIsolation singleInstance permission mic only, Supply Chain SBOM CycloneDX npm ci Dependabot CodeQL Dependency Review TruffleHog secret scan npm audit, Auto-Update signed GitHub Releases, Threat Model 8 vectors + mitigations
- **GitHub Essential:** Dependabot weekly groups, CODEOWNERS security critical, Workflows CI Security Electron Release SBOM, Issue Templates bug/feature/security private advisory, PR Template security checklist zero-trust audit build verification SBOM, Security Policy supported versions private disclosure SLA Hall of Fame, Branch protection CI+Security+CODEOWNERS+secret scanning+signed commits+SLSA provenance, Entitlements hardened runtime, Badges CI Security CodeQL Electron Release SBOM Electron PWA MIT
- **Desktop + PWA:** Electron 32.3.3 auto-update via GitHub Releases, PWA TWA Ready Play Store, MSIX Windows Store, PWABuilder, manifest icons maskable shortcuts file handlers share target offline cache

---

## Documentation

- `SECURITY.md` + `.github/SECURITY.md` — Security controls, audit, reporting, architecture table, badges, Hall of Fame
- `THREAT_MODEL.md` — 8 attack vectors CA misconfig→P1 stale enrollment→0x80180024 quarantine false positive BitLocker key loss XSS LinkedIn dock Electron IPC bypass auto-update tampering + mitigations
- `.github/workflows/` — CI, Security (CodeQL Dependency Review Secret Scan Audit Headers Electron Hardening), Electron Release (win/mac/linux publish), SBOM (CycloneDX)
- `.github/dependabot.yml` — weekly npm+github-actions groups dev-deps+electron
- `build/entitlements.mac.plist` — hardened runtime JIT network.client audio-input
- `docs/` — Additional notes, changelog
- `public/orbitdesk-logo-pack-8k.zip` — 8K assets god mode polished logo
- `sbom.json` — CycloneDX SBOM generated via `npm run sbom`

---

## License

MIT — Educational simulator, not affiliated with Microsoft. All trademarks property respective owners. 5 voices men & women.

© 2026 OrbitDesk v6.6 — LinkedIn chat dock + orbit animation + modern toast + pause + Electron 32 auto-update + SBOM + GitHub hardening — Devine Nyaenya — MSP Team Lead — Modern Workplace — Cybersecurity.

**Portfolio:** https://devine-nyaenya-portfolio.vercel.app (original) — **Chokepoint Demo:** https://chokepoint-demo.vercel.app (least-privilege dual-control tamper-evident security product OWASP ASI03 — separate product, not mixed)
