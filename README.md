# OrbitDesk — Modern Workplace Operations Lab

![CI](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/ci.yml/badge.svg)
![Security](https://github.com/Nyaenya-Devine/orbitdesk/actions/workflows/security.yml/badge.svg)
![Electron](https://img.shields.io/badge/Electron-32.3.3-47848F?logo=electron)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)
![License](https://img.shields.io/badge/License-MIT-green)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNyaenya-Devine%2Forbitdesk)

**Live Demo:** https://orbitdesk-gamma.vercel.app · **Portfolio:** https://devine-nyaenya-portfolio.vercel.app · **Stars welcome ⭐**

Professional training environment for Modern Workplace operations — Entra ID, Intune, Exchange, and Teams troubleshooting with live tickets, voice communication, remote desktop, and team collaboration.

> **For IT Support, MSP Team Leads, and Modern Workplace Engineers** — practice Entra ID Conditional Access, Intune device compliance, Exchange quarantine, and SLA-driven ticket management in a safe, audited simulator.

---

## Overview

OrbitDesk simulates the day-to-day workflow of a Modern Workplace support team. You triage tickets, investigate sign-in logs, test Conditional Access policies with What-If analysis, verify device compliance, handle Exchange quarantine, manage voice calls, and collaborate via team messaging.

Built for IT support professionals, team leads, and interview preparation — emphasizing realistic policies, audit trails, and professional communication.

---

## Key Features

**Ticket Operations**
- Realistic incident queue with priority levels, SLA tracking, and client-specific policies
- Three client profiles: Enterprise 24/7, SMB business hours, Regulated with strict compliance
- Root cause analysis, audit logging, and What-If policy simulation

**Voice & Communication**
- Incoming calls with client personas, mute/hold controls, and professional call management
- Team and client messaging with quality feedback on empathy, clarity, technical accuracy, and adaptation
- Level-based call frequency — focused learning for beginners, realistic volume for advanced

**Remote Desktop**
- Secure remote session with encrypted session ID, audit logging, and consent flow
- Diagnostic commands: `dsregcmd /status`, `Get-BitLockerVolume`, Company Portal sync
- Portal actions reflect in remote view — demonstrating end-to-end resolution

**Learning & Assessment**
- Student and Expert modes with progressive difficulty
- XP, levels, and structured performance assessment (CSAT, QA, SLA, communication)
- Progress persistence for interview preparation

**Platform**
- PWA with offline support, installable on desktop and mobile
- Electron desktop build with hardened security and auto-update
- Packagable for Play Store via TWA and Microsoft Store via MSIX

---

## Demo Flow

1. **Queue** — Review active tickets, check priority and client context
2. **Investigate** — Open Sign-in logs (CA tab), Audit Logs, Service Health, Message Trace
3. **Remediate** — Apply fixes in admin portals, verify via remote desktop
4. **Communicate** — Respond to clients with appropriate language for their profile
5. **Resolve** — Complete checklist, document resolution, review quality feedback

---

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS + Framer Motion
- Web Speech API for voice, Web Audio for telephony
- PWA + Electron 32 with security hardening
- Local storage — no backend, no real credentials

---

## Security

- Content Security Policy, HSTS, X-Frame-Options, Permissions-Policy
- Electron: contextIsolation, sandbox, nodeIntegration disabled, single instance lock
- Supply chain: SBOM, Dependabot, CodeQL, secret scanning
- All data simulated locally — no external API calls with real credentials

See `SECURITY.md` and `THREAT_MODEL.md` for details.

---

## Getting Started

```bash
npm ci
npm run build
npm run dev    # http://localhost:3000
```

Desktop:

```bash
npm run desktop:dev   # Next + Electron with hot reload
npm run desktop:dist  # Build installers
```

---

## Deployment

**Vercel:** Import `Nyaenya-Devine/orbitdesk` → Deploy. Production URL: `orbitdesk-gamma.vercel.app`

**Electron:** Tag release → workflow builds Windows/macOS/Linux installers

**Stores:** PWABuilder for Play Store TWA and Windows Store MSIX packaging

---

## License

MIT — Educational simulator, not affiliated with Microsoft.

© 2026 OrbitDesk — Modern Workplace Operations Lab
