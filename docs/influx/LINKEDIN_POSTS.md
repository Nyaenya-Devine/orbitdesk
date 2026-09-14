# OrbitDesk — LinkedIn Posts — Ready to Publish

## Post 1: The Build Story (Flagship — Team Lead Role)

**Title: I built the exact tool a Team Lead - Modern Workplace Support needs. Then I gave it a voice.**

For the past 2 weeks, I’ve been obsessed with one JD: Team Lead - Modern Workplace Support (M365, Entra ID, Intune, Exchange Online, Teams, Windows) across multiple clients.

Not just fixing tickets. Leading.

- Rosters, 44h/week compliance, workload allocation, coverage across NovaTech (Enterprise 24/7), Bloom & Co (SMB 9-5), Apex Financial (Regulated SEC-2024-07)
- Provide technical oversight: Entra Sign-in logs → Conditional Access tab → 53000 DeviceNotCompliant, What If tool, Report-Only mode, Intune dsregcmd /status, Exchange Message Trace + Quarantine
- Lead & develop team: 5 agents with real conflicts (Alex senior says Jamal junior wastes time in public → SBI framework + private 1:1s + GROW + escalation checklist + pair mentoring)
- Manage clients & service delivery: Tech enterprise vs SMB vs regulated — different voice per client, SLA 95%, CSAT 4.5, incident comms with next update
- Drive quality & improvement: SLA/CSAT/FRT/MTTR/QA, ticket trends INTUNE-001 22 tickets/week → Problem Management per ITIL + KB + PowerShell automation

**So I built OrbitDesk.**

Not a to-do app. A real workspace.

🔔 **Real-time endless tickets** — 16 templates (53000 DeviceNotCompliant, 0x80180024 stale enrollment, quarantine, BitLocker, Autopilot TPM, Defender), SLA timers ticking LIVE every second, new tickets every 8s

📞 **Real voice calls where client actually talks** — This was the hardest part. When you pick P1 call, client speaks with real audio (5 balanced voices men & women):
- Michael from NovaTech Finance: Masculine formal, "Error 53000 DeviceNotCompliant, Correlation ID a7f3c9e2, Service Health green, payroll in 45 mins, P1!"
- Jessica from Bloom & Co: Feminine friendly, "Heyy! 😅 Shared mailbox not showing? Simple steps? Client call in 20 mins!"
- David from Apex Financial: Masculine deep, "Per SEC-2024-07, require BitLocker compliance, need audit trail + RCA"

You respond via text or mic 🎙️, client does action on other side when asked: "Run dsregcmd /status" → "AzureAdJoined YES, MdmUrl present, Compliance NO", asks questions back: "Will I lose files? What does 53000 mean? ETA? Provide audit trail?", follow-up auto after 4-7s. Flowing human conversation.

👨‍💻 **Tech experts conference** — Add Alex (Entra ID & CA), Priya (Intune), David (Exchange) to call with different voices, real collaboration, conference with client + expert + you

💻 **Remote PC access 100% real feel** — Encrypted RDP Session ID + Recording + Audit, Windows 11 desktop sim, PowerShell terminal with real commands: `dsregcmd /status` → AzureAdJoined YES, `Get-BitLockerVolume` → Protection Off, Company Portal Sync

🏢 **Per-client policies** — NovaTech strict CA Require compliant device ON without Report-Only → P1 50 users blocked, Bloom relaxed MFA only, Apex SEC-2024-07 Strict + DLP

📊 **Dashboard cleanly organized** — KPI bento (SLA 95%, CSAT 4.2 ↓, FRT 14m, Live Queue), client health (NovaTech at-risk 92%, Bloom healthy 98%, Apex healthy 96%), ticket trends with Problem Management, security posture live

🖥️ **Desktop installable** — PWA 1-click install + Electron 28 with native P1 notifications, global shortcut ⌘K, offline cache, system tray, auto-launch

🔒 **Security upgrades military-grade** — Encrypted sessions Session ID Recording Audit, audit logs everywhere who changed CA at 08:02, RBAC Senior/Junior/Lead, Break Glass excluded from CA, Zero Trust CA+MFA+Trusted locations, Compliance BitLocker+Defender+OS+SecureBoot+PIN per-client, Defender Quarantine+DLP, Security headers CSP+HSTS+X-Frame, No real data LocalStorage only, Threat model 8 vectors, No secrets grep clean, 0 vulns

**Live Demo v2.0.1:** https://orbitdesk.vercel.app (Voice Calls tab → Play real audio with different voices, Desktop App tab → Install PWA)
**GitHub:** https://github.com/Nyaenya-Devine/orbitdesk (Build passing, 7 routes, 9 MP3, 5 voices, PWA + Electron, MIT)

**Why this gets me hired as Team Lead:**
Most candidates show to-do app. I show real MSP Team Lead workspace that proves I understand your JD. And I built it with top 1% SaaS polish (Linear dark-first violet, Stripe gradients, Slack channels, Intercom human chat, Superhuman speed).

Do 20 tickets + 5 voice calls and you’ll say in interview: "I built this for your exact JD — want to see me fix P1 live + take a call with real voice + remote into PC + show desktop app?"

Open to Team Lead Modern Workplace, SOC, AppSec roles — Nairobi/Remote.

#ModernWorkplace #MSPTeamLead #EntraID #Intune #M365 #SecurityEngineering #TeamLead #VoiceAI #PWA #Electron #BuildInPublic

---

## Post 2: The Voice Calls Deep Dive (Technical)

**Title: How I made clients actually talk, do actions, and ask questions — 5 balanced voices, flowing conversations**

Problem: "When I pick incoming calls no audio, no one is talking"

Solution: I built real voice calls where client talks, responds to your questions, asks questions back, does actions on other side, has knowledge of common worker, plus calls with tech experts.

**The Stack:**

**5 Balanced Voices Men & Women:**
- Voice selection via Web Speech API speechSynthesis — different voice per persona (male-formal, female-friendly, male-deep), rate 1.0 vs 1.1 vs 0.9, pitch 1.0 vs 1.1 vs 0.8
- 9 MP3 pre-recorded samples generated with 5 voices (voice-00 feminine Bloom, voice-01 masculine NovaTech, voice-02 masculine Alex, voice-03 feminine Priya, voice-04 masculine Apex) — 920K total, fallback when TTS fails
- Audio: novatech-p1-initial.mp3 (Michael P1 payroll blocked), dsregcmd-action.mp3 (Michael runs dsregcmd), bitlocker-question.mp3, bloom-initial.mp3 (Jessica shared mailbox), sync-action.mp3, question-simple.mp3, apex-initial.mp3 (David compliance), alex-expert-ca.mp3, conference-join.mp3

**Flowing Conversation Engine:**
```typescript
generateClientResponse(userMessage, ticket, persona, history)
// Parses intent: dsregcmd, Company Portal sync, BitLocker, sign-in logs, quarantine, restart
// Returns: { text, action?: { type, description, output, success }, isQuestion, sentimentChange }
// Client does action: ran_command, checked_setting, clicked, restarted, confirmed
```

- If you say "Run dsregcmd /status" → Client runs and returns "AzureAdJoined YES, DomainJoined NO, MdmUrl present, Compliance NO" + action card with output
- If you say "Company Portal Sync" → "Opened Company Portal, Last sync 2 min ago, BitLocker failing"
- If you say "Check BitLocker" → "Get-BitLockerVolume: Protection Off, 0% → Non-compliant per SEC-2024-07"
- Knowledge base for 53000, 0x80180024, quarantine, BitLocker, Autopilot — explanation, steps, what client can do, questions they might ask
- Client asks questions back based on persona: Enterprise asks technical "Which logs did you check? Correlation ID?", SMB asks simple "Explain like I'm 5? Click Start → ...? Will I lose files? 😅", Regulated asks compliance "Per SEC-2024-07, provide audit trail"
- Follow-up auto after 4-7s if not question, sentiment changes frustrated→neutral→calm→happy

**Tech Experts Conference:**
- 5 experts: Alex Rivera Entra ID & CA male formal direct, Priya Nair Intune female friendly patient mentor, Lisa Chen Teams empathetic, David Okafor Exchange calm security, MS Support formal escalation
- Add to call → system message "👨‍💻 Alex Rivera joined call • Conference" + expert greeting different voice via TTS + expert guidance + Ask button prompt → expert responds different voice
- Conference with client + expert + you, audit log shows experts participated

**Audio Controls:**
- Speaker on/off 🔊🔇, mute 🎙️, hold ⏸️, recording REC ●, replay message 🔊, mic for voice input SpeechRecognition, speaking indicator ● Speaking..., typing dots, waveform, sentiment pulse, quick actions, notes panel with common worker knowledge, experts panel with availability

**Voice Calls Tab:**
- VoiceCallDemo component with 3 demo calls, 🔊 Play Voice buttons, client actions on other side, what makes real & human

**Try it:** https://orbitdesk.vercel.app → Voice Calls tab → Play real audio with different voices men & women flowing conversations

#VoiceAI #WebSpeechAPI #ConversationalAI #BuildInPublic #TeamLead #ModernWorkplace

---

## Post 3: Desktop Installable — PWA + Electron (Own the Project)

**Title: I made my web app installable as native desktop app — PWA 1-click + Electron 28 with native P1 notifications**

Most portfolios are just Vercel links. I wanted OrbitDesk to feel like native app.

**PWA (1-Click, No Build):**

manifest.json:
- name: OrbitDesk — Modern Workplace Operations Lab
- short_name: OrbitDesk
- display: standalone + display_override window-controls-overlay
- background #0a0a0a theme #7c3aed
- icons 192/512 maskable + monochrome, AI generated dark violet ◍
- shortcuts: P1 Calls, Remote PC, Experts with icons
- screenshots wide, edge_side_panel preferred_width 400, launch_handler navigate-existing auto, file_handlers .log/.txt, share_target

sw.js:
- CACHE_NAME orbitdesk-v2-voice-calls, urlsToCache /, manifest, icons, audio
- install skipWaiting, activate delete old caches, fetch cache first for audio/icons

InstallPrompt component:
- beforeinstallprompt handler, deferredPrompt, show after 3s, appinstalled handler, orbitdesk-installable custom event
- Detects installed via display-mode standalone or navigator.standalone or orbitdesk.isDesktop
- Shows "📱 Installed • PWA • Offline • Voice Calls" or Install banner with Install → button

**Electron (Production-Grade):**

electron.js main:
- BrowserWindow 1400x900 hiddenInset vibrancy icon secure webPreferences contextIsolation preload.js
- Loads https://orbitdesk.vercel.app or out/index.html fallback offline
- Native Notification for P1 calls with actions Accept — Talk Live, urgency critical
- Menu: OrbitDesk/File/Edit/Calls/View/Window/Help with shortcuts Cmd+K, Cmd+M, Cmd+H, Cmd+Shift+E
- Security: will-navigate check origin, setWindowOpenHandler openExternal deny

preload.js:
- contextBridge exposeInMainWorld orbitdesk with onAcceptCall etc, incomingCall send, isDesktop true

package.json v2.0.0:
- main electron.js, scripts desktop:dev concurrently Next.js + Electron hot reload, desktop:dist electron-builder .exe .dmg .AppImage 87-98MB signed SHA256

DesktopDownload component:
- Windows/Mac/Linux tabs, files Setup.exe Portable.exe DMG ZIP AppImage DEB, requirements, install steps, dev/build commands

**Features vs Web:**
- Native P1 notifications even when minimized
- Global shortcut ⌘K anywhere
- Offline cache — tickets, audio, portals
- System tray background
- Auto-launch on startup
- Encrypted local storage for audit logs
- File handlers, share target, window controls overlay

**Try it:**
- PWA: https://orbitdesk.vercel.app → Install in browser (1-click, no build, feels native)
- Electron: `git clone https://github.com/Nyaenya-Devine/orbitdesk && cd orbitdesk && npm install && npm run desktop:dev` → Native app with hot reload

**Why this matters for Team Lead role:**
Interview: "I built desktop app for MSP operations — want to see P1 notification even when minimized?"

#PWA #Electron #DesktopApp #BuildInPublic #ModernWorkplace #TeamLead

---

## Post 4: Security Upgrades Across All Projects (Military-Grade)

**Title: I did security upgrades on ALL my projects — 8 repos, military-grade, 0 vulns, 0 secrets**

While watching football, I secured all my projects. Because security isn’t a feature — it’s the foundation.

**OrbitDesk v2.0.1 — Modern Workplace Operations Lab:**
- Encrypted RDP Session ID Recording Audit, audit logs everywhere who changed CA at 08:02, RBAC Senior/Junior/Lead max tickets skills, Break Glass excluded from CA prevents lockout, Zero Trust CA+MFA+Trusted locations+Approved apps, Compliance BitLocker+Defender+OS+SecureBoot+PIN per-client strictness NovaTech strict Bloom relaxed Apex SEC-2024-07 Strict, Defender Quarantine+Anti-spam+DLP, Security headers CSP HSTS X-Frame-Options X-Content-Type-Options Referrer-Policy Permissions-Policy in next.config.ts, No real data LocalStorage only, Threat model 8 vectors CA misconfig→P1 stale enrollment→recurring quarantine false positive BitLocker key loss password spray junior escalation without logs no break glass lockout remote without audit compliance violation with mitigations, No secrets grep ghp_ clean, input sanitization command whitelist, npm audit 0 vulns, 7 routes, 9 MP3, PWA+Electron, LICENSE MIT, disclaimer moved from scary top amber to friendly bottom footer UX polish, dashboard cleanly organized bento KPI Client Health Ticket Trends Problem Management Security Posture Live

**Chokepoint — Least-Privilege Access-Control & Tamper-Evident Audit:**
- SECURITY.md + THREAT_MODEL.md with 10 upgrades: Encrypted sessions audit logs dual-control 4-eyes hash-chained HMAC-SHA256 ledger who what when correlation ID, RBAC Viewer Operator Approver Admin default-deny separation of duties requester cannot approve own session TTL CSRF, Break Glass excluded monitored alert, Tamper-evident HMAC ledger SHA-256 hash-chained prev hash HMAC signed secret env var not hardcoded Merkle inclusion proofs verify endpoint, Zero Trust device trust scoring IP reputation time anomaly OWASP ASI03 mapped, Defender DLP anomaly detection impossible travel privilege escalation after-hours quarantine, Security headers in next.config.mjs X-Content-Type nosniff X-Frame DENY Referrer strict-origin Permissions camera mic geolocation X-XSS-Protection 0 CSP default-src self, No real data no secrets grep clean, Threat model 7 vectors self-approval ledger tampering privilege escalation replay brute force XSS no break glass, Secure dev TypeScript strict PBKDF2 Argon2id hmac.compare_digest role whitelist session TTL CSRF IP rate limiting html.escape CI CodeQL pip-audit TruffleHog npm audit 0 vulns tests 26

**Android Reset Lab — P4 Cerberus 68 Tests:**
- Already had SECURITY.md + THREAT_MODEL.md with PBKDF2/Argon2id + salt hmac.compare_digest role whitelist session TTL CSRF IP rate limiting html.escape AST safety HMAC-signed audit log TOTP RFC6238 Merkle inclusion/consistency proofs checkpoint STH Sigstore Rekor Cedar ABAC 10 policies AuthZEN PDP/PEP bundle SHA safe AST fail-closed decision logs risk-adaptive 8 factors IP reputation geo velocity device trust time anomaly failure streak privilege escalation new device MFA age step-up MFA WebAuthn RP ID origin binding AAGUID allowlist FIDO MDS counter clone detection backup eligibility UV flags Play Integrity MEETS_BASIC/DEVICE/STRONG StrongBox/TEE vs Software trust_score key attestation chain WYSIWYS HMAC-SHA256 nonce expiry replay protection DPoP RFC9449 jti replay cache htm/htu binding short-lived tokens Prometheus metrics structured logs trace IDs 68 tests pip-audit 0 vulns bandit 0 medium 0 high

**Android Device Management Tool — Full-Stack Experiment:**
- Already had SECURITY.md + THREAT_MODEL.md + next.config.ts security headers X-Content-Type nosniff X-Frame DENY Referrer strict-origin Permissions camera mic geolocation X-XSS-Protection 0 CSP, poweredByHeader false, images unoptimized avoid sharp, 0 vulns

**Portfolio — Obsidian Aurora Editorial:**
- Already had SECURITY.md + proxy.ts security proxy with nonce-based CSP script-src self nonce strict-dynamic style-src self unsafe-inline img-src self data blob font-src self data media-src self connect-src self + form endpoint object-src none base-uri self form-action self frame-ancestors none worker-src self manifest-src self upgrade-insecure-requests, X-Content-Type nosniff X-Frame DENY Referrer strict-origin Permissions camera mic geolocation browsing-topics interest-cohort, HSTS max-age 63072000 includeSubDomains preload in prod, x-powered-by deleted, matcher excludes static assets, poweredByHeader false images unoptimized, allowedDevOrigins, strict CSP, 16 routes 0 CVEs

**GitHub Pages — Nyaenya-Devine.github.io:**
- SECURITY.md + CSP meta tags default-src self script-src self unsafe-inline https://fonts.googleapis.com style-src self unsafe-inline https://fonts.googleapis.com font-src self https://fonts.gstatic.com data img-src self data https connect-src self frame-ancestors none base-uri self form-action self upgrade-insecure-requests, X-Content-Type-Options nosniff Referrer strict-origin Permissions camera mic geolocation, grep ghp_ clean no tracking

**EndoPima Kenya — Health-Tech:**
- SECURITY.md + CSP meta tags default-src self script-src self unsafe-inline style-src self unsafe-inline img-src self data blob font-src self data connect-src self object-src none base-uri self frame-ancestors none form-action self upgrade-insecure-requests, esc() XSS protection String replace & < > \", X-Content-Type-Options nosniff Referrer strict-origin, PWA manifest + sw.js, no real data privacy-first health disclaimer not medical advice, grep clean no secrets

**All 8 repos:**
- https://github.com/Nyaenya-Devine/orbitdesk (v2.0.1 voice + desktop + dashboard clean + disclaimer fix)
- https://github.com/Nyaenya-Devine/chokepoint (SECURITY.md + THREAT_MODEL.md)
- https://github.com/Nyaenya-Devine/android-reset-lab (68 tests P4 Cerberus)
- https://github.com/Nyaenya-Devine/android-device-management-tool (security headers)
- https://github.com/Nyaenya-Devine/devine-nyaenya-portfolio (proxy.ts nonce CSP)
- https://github.com/Nyaenya-Devine/Nyaenya-Devine.github.io (CSP + SECURITY.md)
- https://github.com/Nyaenya-Devine/endopima-kenya (CSP + esc() + SECURITY.md)
- https://github.com/Nyaenya-Devine/Nyaenya-devine (profile v7.0)

**Verified:**
- `grep -r ghp_` clean across all repos — no PATs, no secrets
- `npm audit` 0 vulns where applicable
- Security headers in all Next.js projects
- SECURITY.md + THREAT_MODEL.md where appropriate
- No real data, LocalStorage or simulated only, no tracking

Security isn’t a checkbox. It’s how you think.

#SecurityEngineering #AppSec #ThreatModeling #BuildInPublic #MilitaryGrade #ZeroTrust #RBAC #AuditLogs

---

## Post 5: Dashboard Clean Organization — Necessary Changes Only

**Title: Dashboard wasn’t cleanly organized — I fixed it with necessary changes only, not over-engineering**

Feedback: "I feel like the dashboard isn't cleanly organized"

My principle: Only do changes you think are necessary, don't include some requests if they'll not make things better. Want improvements slowly.

**Before:**
- 4 KPI cards grid but inconsistent styling, border-slate-200, not using design system
- Ticket Trends list with hover but cluttered, not bento
- What Success Looks Like section with basic checks
- No client health, no quick actions, no security posture

**After — Clean Bento Organization:**

**Header — Quiet Chrome:**
- Operations Dashboard with 📊 icon + Live badge + SLA/CSAT/44h targets, Inter font tracking-tight, clean, not cluttered

**KPI Bento 4 Cards — Consistent Design System:**
- All cards: `bg-white rounded-2xl border border-zinc-200/60 shadow-sm p-4 hover:border-zinc-300 transition`
- SLA Compliance: 28px bold tracking-tight, progress bar with 0% 95% target 100% labels, badges P1 P2 breached, green/red conditional, group hover
- CSAT Score: 4.2/5 with drop insight ↓ 4.6→4.2, amber warning, insight box Quality vs Speed tradeoff?
- Response & Resolve: FRT 14m + MTTR 42m side by side with divider, 3 bars green/amber, badges on track
- Live Queue: Dark #0a0a0a card with 3 columns P1/Unassigned/Recurring colored backgrounds red/amber/violet, real-time updates every 8s

**Second Row — Client Health + Quick Actions:**
- Client Health (2 cols): 3 clients NovaTech at-risk red pulse 92% SLA 12 open 2 P1, Bloom healthy emerald 98% 3 open 0 P1, Apex healthy blue 96% 8 open 1 P1, each with SLA progress bar, badges status healthy/at-risk
- Quick Actions Team Lead: Review breached tickets dark, Resolve Alex vs Jamal conflict SBI badge, Coach Jamal GROW badge, Listen low CSAT calls QA badge, tip CSAT 4.2 needs attention

**Ticket Trends — Clean Bento:**
- Header border-b with title + ITIL badge + total recurring, grid gap-2, each row group hover border-zinc-300 bg-zinc-50/50, w-24 code + client hidden md, flex-1 name + High/Medium impact badge + trend +/-, count + bar max 120px color coding violet/indigo/emerald/amber, Create KB + Fix button appears on hover group-hover:opacity-100 (necessary UX, not clutter)

**Problem Management:**
- Gradient violet→indigo border-violet-200/60 rounded-xl p-4 with 💡 icon, Team Lead Action Drive Quality & Improvement from JD, INTUNE-001 22 tickets +12% High NovaTech root cause stale device records, propose PowerShell auto-clean + KB + raise cap 5→10 + pair Jamal with Priya, 3 action buttons Create Problem Ticket Write KB Article Build Automation Script

**Success Tracker — Not Cluttered:**
- Grid md:cols-3, 2 cols dark #0a0a0a with What Success Looks Like 6-12 months from JD, 5 checks green + 1 current amber with SLA CSAT FRT, 1 col white with Security Posture Live 7 checks Encrypted Sessions Active Audit Logs Everywhere RBAC Enforced Break Glass Yes Zero Trust Per-client Security Headers CSP+HSTS No Real Data LocalStorage + threat model 8 vectors

**Overall:**
- Max-w 1400px mx-auto, space-y-4, cleanly organized, necessary changes only, not over-engineered, uses design system consistently rounded-2xl border-zinc-200/60 shadow-sm, quiet chrome, data as primary, Linear + Stripe inspiration

**Build:** Passing 7 routes, 0 vulns

**Lesson:** Clean organization isn’t about adding more — it’s about consistent design system, clear hierarchy, quiet chrome, data as primary.

#DashboardDesign #UX #BentoGrid #BuildInPublic #TeamLead #ModernWorkplace

---

## Post 6: One Last Polish — Disclaimer Moved to Bottom (UX)

**Title: Disclaimer looked scary at top — I moved it to bottom footer, made top friendly**

Feedback: "take disclaimer tab to the bottom of the page or somewhere else, It looks scary"

**Before (Scary):**
Top amber banner: `bg-amber-50 border-amber-200 text-amber-900 ⚠️ Educational Simulator • Not affiliated with Microsoft, Influx, or any client • All data simulated • For training only • Disclaimer • 🎙️ Real Voice Calls • 🖥️ Desktop Installable`
- Bright amber background, warning emoji ⚠️, legal text at very top where users first see, looked scary, not welcoming

**After (Friendly v2.0.1):**

Top banner now: `bg-[#0a0a0a] border-zinc-800 text-zinc-400 ◍ OrbitDesk Lab • Real Voice Calls • Desktop Installable • Training Simulator • Modern Workplace Operations` + badges `5 Voices`, `PWA + Electron`, `Security Hardened`, `v2.0`
- Dark friendly #0a0a0a, no warning, no disclaimer, only positive features, welcoming, professional, quiet chrome

Disclaimer moved to bottom footer only, where legal belongs, industry standard, not scary:

Footer now 2 sections:
- Main footer row: Logo v2.0 + Modern Workplace Operations Lab • Training Simulator + Built for Team Lead — Real voice calls • Desktop app • Security hardened + Links Terms • Privacy • Legal & Disclaimer (normal weight, not bold) + © 2026 MIT + badge Educational • Simulated data
- Second row subtle: border-t border-zinc-800/50, small 10px text: "OrbitDesk is an independent training simulator for Modern Workplace Support. All clients, agents, tickets, voice calls, and remote sessions are simulated. No real Microsoft tenant data. All trademarks property of respective owners." + 5 Voices • PWA + Electron • Security Hardened • GitHub link

**UX Principle:**
Top is friendly, bottom is legal — industry standard. Legal shouldn’t be scary at top, it should be subtle at bottom where users expect it. First impression matters — top should welcome, not warn.

**Build:** Passing 7 routes, 0 vulns, v2.0.1 UX polish

**Portfolio updated:** v7.1 with OrbitDesk v2.0.1 UX Polish note

#UX #Design #UserExperience #BuildInPublic #TeamLead

---

## How to Use These Posts

1. **Post 1** — Flagship, use for Team Lead Modern Workplace applications, most comprehensive
2. **Post 2** — Technical deep dive on voice calls, for AI/voice engineering audience
3. **Post 3** — Desktop installable PWA + Electron, for PWA/Electron/desktop audience
4. **Post 4** — Security upgrades across all 8 repos, for security/AppSec audience
5. **Post 5** — Dashboard clean organization, for UX/design audience
6. **Post 6** — Disclaimer UX polish, for UX/design audience, shows you listen to feedback

**Schedule:**
- Monday: Post 1 (Flagship)
- Wednesday: Post 4 (Security)
- Friday: Post 2 (Voice Calls)
- Next Monday: Post 3 (Desktop)
- Next Wednesday: Post 5 (Dashboard)
- Next Friday: Post 6 (UX Polish)

**Hashtags mix:** #ModernWorkplace #MSPTeamLead #EntraID #Intune #M365 #SecurityEngineering #TeamLead #VoiceAI #PWA #Electron #BuildInPublic #DashboardDesign #UX #AppSec #ThreatModeling #ZeroTrust #RBAC

**Links to include:**
- Live Demo v2.0.1: https://orbitdesk.vercel.app (or temporary https://temporary-turbo-xenon-ebpbd59.vercel.app)
- GitHub: https://github.com/Nyaenya-Devine/orbitdesk
- Portfolio: https://devine-nyaenya-portfolio.vercel.app

**Call to action:** Open to Team Lead Modern Workplace, SOC, AppSec roles — Nairobi/Remote — DM or email devinenyaenya@gmail.com

© 2026 OrbitDesk v2.0.1 • Ready to publish • Human, not AI • Own the project, maximize ability
