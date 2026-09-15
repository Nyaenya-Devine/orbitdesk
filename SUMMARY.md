# OrbitDesk — Modern Workplace Operations Lab
**Live:** https://orbitdesk-gamma.vercel.app | **GitHub:** Nyaenya-Devine/orbitdesk | **v6.3 Professional Polished**

### What It Is
OrbitDesk is a simulated MSP Team Lead environment that teaches how real Modern Workplace support actually works — not just theory.

You triage tickets, investigate Entra ID sign-in logs, test Conditional Access with What If, verify device compliance with real `dsregcmd` output, handle Exchange quarantine, take live voice calls where **you greet first with your voice**, and remotely access a Windows 11 PC with consent — all while managing a team of 5 agents.

**Designed for:** People who have never worked in IT support before, to feel 100% reality of helpdesk.

### Why It Exists
Most labs show buttons. Real helpdesk shows:
- Different clients have different policies (NovaTech 24/7 strict, Bloom SMB relaxed, Apex SEC-2024-07 regulated)
- Actions have consequences (portal action → RDP state changes)
- Every action is audited (who changed CA at 08:02, correlationId)
- You talk to humans, not text boxes

### What We Built (v6.3 Achievements)

**1. Human Voice Calls — Not Robotic**
- Real phone behavior: 440+480Hz dual-tone ringtone 2s on / 4s off, Notification API with logo, Vibrate, beep every 15s for recording, hold music C4-E4-G4-C5
- Flow: YOU greet first (mouth-to-ear), client introduces, problem → client executes commands when you ask (`dsregcmd`, `Get-BitLockerVolume`) and asks follow-up questions → resolution → scoring
- Controls: mute, hold, transfer, add Entra/Intune/Exchange/Teams expert, notes, recording
- 5 personas, Web Speech TTS/STT, hold-to-speak, audio level viz

**2. Remote PC That Feels Real**
- Windows 11 RDP V2: Stages Connecting → Auth → MFA → Consent → Connected
- Quick Assist consent dialog, File Explorer with 3 files, Terminal with real outputs: full `dsregcmd /status` (AzureAdJoined YES, DomainJoined NO), `ipconfig`, `whoami`, `Get-BitLockerVolume` escrowed
- Live linkage: Fix BitLocker in portal → RDP shows compliant (green proof)

**3. Admin Portals That Teach**
- 6 mock portals: Entra sign-in logs (with CA tab IP/policy), Intune compliance drill-down + BitLocker fix + Company Portal sync, Exchange quarantine release + Message Trace, Admin Service Health first (ITIL), What If simulation (Report-Only), Audit Logs RCA
- Searchable tables, correlationId, detail pane, What If before enforcement

**4. Team Lead Operations**
- 5 agents skills 1-10, 44h/week, SLA/CSAT/QA/FRT/MTTR, mood, learning gaps
- Coaching SBI+GROW, 1:1s, workload allocation, RBAC Senior/Junior/Lead
- 16 ticket templates: Entra 53000/53003/500121, Intune 0x80180024/DeviceCapReached/BitLocker/Autopilot, Exchange quarantine, Teams, Defender

**5. Live Collaboration**
- CommunicationChannel: Teams/Slack-style presence 🟢, typing indicator, @mentions, file share, compact 280px split view inside queue

**6. Class Command Center (Innovative)**
- Class code INFLUX-2026-A, shareable link `orbitdesk.app/join/CODE`
- Live presence, live feed, leaderboard 🥇🥈🥉, AI insights (who needs help), export CSV/JSON/Google Sheets/Discord/LMS
- Built for instructors grouping students

**7. Professional Polish & Brand**
- Logo: orbit on PC with walnut wooden stand, polished 1024px transparent everywhere (header, hero, favicon, OG, calls, footer)
- Livery: M365 colors Entra #0078D4 Intune #5C2D91 Teams #6264A7 + animated orbs + grid + F1 stripes — not black boring
- Thread Humor: 10 real r/sysadmin threads auto-rotates every 5s
- v6.3 cleanup: Removed all dev-only notes (v5.2 box, Human Premium...), title is now professional "OrbitDesk — Modern Workplace Operations Lab" only

**8. Security First**
- RBAC, Audit Logging, Break Glass emergency account, Conditional Access, Device Compliance (BitLocker escrowed, Defender tamper protection)
- Headers: HSTS 63072000 preload, X-Frame DENY, X-Content-Type nosniff, CSP, Permissions-Policy microphone=(self)
- 0 prod vulnerabilities (npm audit), no hardcoded secrets, fail-closed, terminal allowlist no eval()

**9. Store Ready**
- PWA: manifest 192/512 maskable icons, shortcuts, file_handlers, share_target, offline SW, screenshots
- Play Store: TWA via PWABuilder/Bubblewrap → .aab + assetlinks.json + STORE_PUBLISHING.md guide
- Windows Store: MSIX via PWA + Electron appx (1400x900, vibrancy, tray, auto-launch) — industry standard like Starbucks/Twitter

**10. Growth Strategy**
- Researched ServiceDesk Simulator 20k+ users $0/$20 and SysDesks 48 commands 122 scenarios
- Diagnosed 6 gaps, fixed in v6.2, 30/60/90 growth plan with Discord/LinkedIn/Reddit/YouTube playbook

### Metrics
- **Build:** Next.js 16.3.5 Turbopack 223ms, TS 2.4s, 9/9 static, 0 vulns
- **Deploy:** Vercel Production 22s, alias orbitdesk-gamma.vercel.app, 20 deployments
- **GitHub:** f41a9c4 v6.3, 35 files changed, pushed master→main
- **Live verified:** `<title>OrbitDesk — Modern Workplace Operations Lab</title>` — 0 Queen Elizabeth

### In One Sentence
**OrbitDesk is a browser-based Modern Workplace simulator where you take real voice calls, remotely fix Windows 11 PCs, manage Entra/Intune/Exchange portals that actually teach, and lead a team — built to make a beginner feel like a real IT Support Team Lead from day one, with security always first.**
