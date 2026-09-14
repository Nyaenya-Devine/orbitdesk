# Changelog — OrbitDesk

## v6.0 — God Mode + Voice-to-Voice Mouth-to-Ear

**Date:** 2026-09-15

**Highlights:**
- Voice-to-voice calls: mouth-to-ear, no texting, hold-to-speak, waveform visualization, TTS client voice you hear via ear, even baby understands flow
- God mode polished logo: orbit on top of PC with round wooden walnut stand, PC on wood, orbit fixing with enticing details (M365 Outlook/Teams, Entra shield, Intune check, BitLocker, Company Portal sync, voice waveform, remote cursor, hash-chain)
- 8K asset pack: dashboard bento clean, call center mouth-to-ear, remote 100% real PC feel, downloadable zip 13MB
- Link tab logo fixed: icon-192, icon-512, favicon now godmode polished, manifest + layout metadata updated
- Security headers: Permissions-Policy microphone=(self) for voice calls

**Commits:** `6f84156`

## v5.2 — Livery + Thread Humour

**Highlights:**
- M365 livery background: Entra blue #0078D4, Intune purple #5C2D91, Teams #6264A7, animated orbs, grid, noise, F1 stripes — not basic black
- ThreadHumor: 10 trending IT support threads r/sysadmin, auto-rotates 5s, upvote
- Overview tab includes humour, header v5.2

**Commits:** `9f133df`, `27ba023`

## v5.1 — Flowing Conversation Fix + Student Mode

**Problem v5.0:** Client instantly dumps entire P1 with Correlation ID, no chance to greet.

**Fix:**
- Real human flow: phone rings 800Hz → incoming modal → Accept → short greeting `waiting_greeting` → you greet first → client introduces flowing `waiting_intro` → problem → troubleshooting where client does actions when asked + asks questions back → resolution
- State machine: `waiting_greeting` → `waiting_intro` → `problem_stated` → `troubleshooting` → `resolution`
- Student Mode: P1 3% student, 15% expert, 5 tickets max 1 P1, balanced queue
- RemoteDesktopV2: real linkage portal→RDP, BitLocker fixed shows green proof
- StudentModeGuide: 7-step tutorial, progressive disclosure

**Commits:** `9d0e4b2`, `8bafe57`

## v5.0 — Student Mode + Real RDP Linkage

- Student Mode toggle, balanced queue
- RemoteDesktopV2 fixes words cut, real linkage bitLockerFixed syncDone
- StudentModeGuide tutorial
- Protection + Viral + Earning docs

## v2.0-v4.0 — Real Voice Both Sides + Desktop Installable

- 5 balanced voices men & women: Michael Enterprise, Jessica SMB, David Regulated
- Web Speech API TTS + STT mic live transcription, 9 MP3 samples
- Tech Experts Conference: Alex Entra, Priya Intune, David Exchange, Lisa Teams
- PWA + Electron: manifest icons 192/512 maskable shortcuts, sw.js offline, InstallPrompt, Electron 28 main 1400x900
- 16 ticket templates, per-client policies NovaTech/Bloom/Apex, 5 agents, 6 mock portals, dashboard SLA/CSAT/QA/FRT/MTTR, training lab, live scoring

## Security

- Prod: `npm audit --omit=dev` → 0 vulnerabilities
- Dev: `npm audit` → 2 high in electron@28 (extract-zip symlink traversal) — mitigation: Electron not used in production, contextIsolation, upgrade path to 41.7.1 breaking
- Headers: HSTS, CSP, X-Frame DENY, etc.
- See SECURITY.md, THREAT_MODEL.md
