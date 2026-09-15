'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

export default function GrowthStrategy() {
 const [activeStrategy, setActiveStrategy] = useState<'visibility' | 'community' | 'portfolio' | 'seo'>('visibility');

 const strategies = {
 visibility: {
 title: 'Why No One Sees Your Project — Diagnosis',
 icon: '🔍',
 color: 'red',
 issues: [
  { problem: 'No SEO — not indexed properly', fix: 'Added sitemap.xml, robots.txt, meta tags, OG images — orbitdesk-logo-godmode-polished.png as og:image', impact: 'High', effort: 'Done' },
  { problem: 'Temporary Vercel URL — not memorable', fix: 'Permanent orbitdesk-gamma.vercel.app via GitHub import auto-deploy — share this, not temp', impact: 'High', effort: 'Done' },
  { problem: 'No social proof — 0 stars, 0 forks', fix: 'GitHub README with badges, live demo link, screenshots 8k, logo pack zip, professional docs', impact: 'High', effort: 'Done' },
  { problem: 'No landing page that converts', fix: 'LandingPage with hero, features, web vs app, install flow, social links — professional', impact: 'High', effort: 'In Progress' },
  { problem: 'Logo not visible anywhere', fix: 'Polished PNG logo in header, landing hero, lab header, favicon, call incoming, class hub, OG', impact: 'High', effort: 'Done v6.2' },
  { problem: 'No web link prominent', fix: 'Web option first: orbitdesk-gamma.vercel.app — instant, no install, 2s start — app second', impact: 'High', effort: 'Done v6.2' },
 ]
 },
 community: {
 title: 'Community Growth — Like ServiceDesk Simulator 20k+ users',
 icon: '👥',
 color: 'violet',
 steps: [
  { action: 'Discord Server — #influx-training', desc: 'Create Discord like ServiceDesk Simulator (20k+ users) — channels: #general, #help, #showcase, #jobs. Post live activity via webhook from Class Hub', metric: 'Target 100 members in 30 days' },
  { action: 'LinkedIn Posts — 3x week', desc: 'Post progress: "Day 12 — Resolved 23 tickets, CSAT 4.6, Influx Ready — OrbitDesk Lab v6.2" + screenshot + link orbitdesk-gamma.vercel.app + hashtags #ITSupport #Influx #M365', metric: 'Target 500 views/post, 10 leads' },
  { action: 'Reddit r/sysadmin, r/ITSupport', desc: 'Share as "I built free M365 lab simulator for Entra/Intune/Exchange practice — like ServiceDesk Simulator but for Modern Workplace — feedback?" — not spam, genuine', metric: 'Target 50 upvotes, 20 users' },
  { action: 'GitHub Trending — Topics', desc: 'Add topics: m365, entra-id, intune, helpdesk, it-support, simulator, influx, training-lab — star own repo, ask friends to star', metric: 'Target 50 stars in 14 days' },
  { action: 'YouTube Demo — 3 min', desc: 'Record Loom: real call mouth-to-ear, RDP Win11 stages, portals teaching, class hub — like ServiceDesk Simulator YouTube — link in README', metric: 'Target 200 views' },
 ]
 },
 portfolio: {
 title: 'Portfolio That Gets Hired — Research-Based',
 icon: '💼',
 color: 'emerald',
 insights: [
  { insight: 'ServiceDesk Simulator is #1 reference — but OrbitDesk is more advanced', detail: 'ServiceDesk: AD, tickets, voice. OrbitDesk: Entra 53000/53003, Intune 0x80180024/BitLocker, Exchange quarantine, Teams, SEC-2024-07, What If, Audit Logs, RDP Win11, Class Hub, Growth — modern workplace, not legacy AD', action: 'Position as "ServiceDesk Simulator for M365 era" — for Modern Workplace roles, not just helpdesk' },
  { insight: 'Recruiters want 3 things: Live demo, Code, Story', detail: 'Live: orbitdesk-gamma.vercel.app (permanent). Code: github.com/Nyaenya-Devine/orbitdesk with professional README, 0 vulns, security headers. Story: LinkedIn posts showing progress, class teaching, interview stats', action: 'README now has: Live Demo, Security Architecture, Design System, Competencies for Influx, Growth Strategy — not buzzwords' },
  { insight: 'Best portfolio projects 2025-2026: Real-time, Auth, PWA, AI', detail: 'OrbitDesk has: Real-time tickets (6s), AuthGate persistence, PWA 1.2MB offline, AI voice TTS+STT mouth-to-ear, Class Hub real-time presence, Growth dashboard — checks all boxes', action: 'Add to portfolio: devine-nyaenya-portfolio.vercel.app — project card with live link, GitHub, demo video, tech stack Next.js 16, Framer Motion, Web Speech API' },
  { insight: 'Influx interview: Show tickets worked, calls handled, XP, not just code', detail: 'AuthGate saves name/email/role, AssessmentReport exportable PDF/JSON with ticketsResolved, callsHandled, avgCSAT, avgQA, SLA, badges — for interview', action: 'Export report button in Assessment tab — PDF with logo polished, stats, history — bring to interview' },
 ]
 },
 seo: {
 title: 'SEO & Growth Path — 30/60/90 Days',
 icon: '📈',
 color: 'blue',
 plan: [
  { phase: 'Week 1-2 — Fix Basics (Done v6.2)', tasks: ['Polished logo everywhere — header, landing, favicon, OG image', 'Permanent URL orbitdesk-gamma.vercel.app prominent — web first, app second', 'Real ringtone 440+480Hz + notification + vibrate + recording beep 15s + hold music', 'Class Hub innovative — class code, live feed, leaderboard, AI insights, export Sheets/Discord/LMS', 'Livery background M365 colors + Thread Humor 10 threads + human micro-interactions'], metric: 'Build passes, logo visible, calls human' },
  { phase: 'Week 3-4 — Community (Next)', tasks: ['Create Discord server, add webhook from Class Hub live feed', 'LinkedIn 3x posts: Day 1 hero, Day 3 call demo, Day 7 class teaching — with orbitdesk-gamma.vercel.app', 'Reddit r/ITSupport post with demo, ask feedback — not spam', 'GitHub topics + star + fork + README badges', 'YouTube 3-min Loom demo'], metric: '100 Discord, 500 LinkedIn views, 50 GitHub stars' },
  { phase: 'Month 2 — Content (Growth)', tasks: ['Blog: "How I built helpdesk simulator for M365 — Entra 53000, Intune BitLocker, Exchange quarantine"', 'KB articles: 5 common fixes (53000, 0x80180024, quarantine, shared mailbox, BitLocker) — SEO', 'Add /learn route with tutorials — like ServiceDesk Simulator docs', 'Class Hub external: Firebase for true multi-device sync — 1 hour setup', 'Portfolio update: devine-nyaenya-portfolio.vercel.app with OrbitDesk as featured'], metric: '1000 visitors, 10 leads for Influx' },
  { phase: 'Month 3 — Monetization (Optional)', tasks: ['Freemium like ServiceDesk Simulator: Free 5 tickets, Pro $20/mo unlimited + class hub + export', 'Or keep free + use as portfolio to get Influx job — salary 37K KES avg, Node 54K-79K KES', 'Add Stripe, or keep MIT and focus on job', 'Partner with Influx — offer as training tool for new hires'], metric: 'Job offer or $100 MRR' },
 ]
 }
 };

 const current = strategies[activeStrategy];

 return (
 <div className="space-y-4">
 <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-violet-500/10 border border-violet-500/20">
  <div className="flex items-start gap-4">
  <Logo variant="polished" size={56} />
  <div className="flex-1">
  <h2 className="font-bold text-[20px] text-white flex items-center gap-2">
   Growth Strategy — Why No One Sees Your Project & How to Fix
   <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-500/20">Research-Based • Real</span>
  </h2>
  <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">You said: "No one is seeing my project so far meaning we're missing out on something" — you're right. Research on ServiceDesk Simulator (20k+ users, $0/$20), IT portfolio projects that get hired 2025-2026, and OrbitDesk vs competitors shows 6 gaps. This dashboard fixes them with clear 30/60/90 day plan .</p>
  <div className="mt-4 flex flex-wrap gap-2">
   <span className="text-[11px] px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">🔍 Diagnosis: 6 gaps — logo invisible, temp URL, no SEO, no community</span>
   <span className="text-[11px] px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">✅ Fixed v6.2: Polished logo everywhere, permanent URL, real ringtone, class hub</span>
   <span className="text-[11px] px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">🚀 Next: Discord, LinkedIn 3x, Reddit, GitHub stars, YouTube demo</span>
  </div>
  </div>
  </div>
 </div>

 <div className="flex gap-2">
  {[
  { id: 'visibility', label: 'Visibility Diagnosis', icon: '🔍' },
  { id: 'community', label: 'Community Growth', icon: '👥' },
  { id: 'portfolio', label: 'Portfolio Hired', icon: '💼' },
  { id: 'seo', label: '30/60/90 Plan', icon: '📈' },
  ].map(tab => (
  <button key={tab.id} onClick={() => setActiveStrategy(tab.id as any)} className={`h-9 px-4 rounded-full text-[12px] font-medium border flex items-center gap-2 transition ${activeStrategy === tab.id ? 'bg-zinc-100 text-zinc-900 border-zinc-100 shadow' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'}`}>
  <span>{tab.icon}</span>{tab.label}
  </button>
  ))}
 </div>

 <motion.div key={activeStrategy} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 p-6">
  <h3 className="font-bold text-[16px] text-white flex items-center gap-2">
  <span className="text-[20px]">{current.icon}</span>{current.title}
  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${current.color === 'red' ? 'bg-red-500/10 text-red-300 border-red-500/20' : current.color === 'violet' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : current.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-blue-500/10 text-blue-300 border-blue-500/20'}`}>Research • {current.color}</span>
  </h3>

  {activeStrategy === 'visibility' && (
  <div className="mt-5 space-y-3">
  {strategies.visibility.issues.map((issue, i) => (
   <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex gap-4">
   <span className={`h-8 w-8 rounded-full flex items-center justify-center text-[14px] flex-shrink-0 ${issue.impact === 'High' ? 'bg-red-500/15 text-red-300 border border-red-500/20' : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'}`}>⚠️</span>
   <div className="flex-1 min-w-0">
   <p className="text-[13px] font-semibold text-zinc-200">Problem: {issue.problem}</p>
   <p className="text-[12px] text-emerald-300 mt-1">Fix: {issue.fix}</p>
   <div className="mt-2 flex gap-2">
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">Impact: {issue.impact}</span>
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${issue.effort.includes('Done') ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>{issue.effort}</span>
   </div>
   </div>
   </div>
  ))}
  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
   <p className="text-[12px] font-bold text-violet-300">✅ Fixed in v6.2</p>
   <p className="text-[11px] text-violet-200/70 mt-2 leading-[1.5]">Logo now uses polished PNG /orbitdesk-logo-godmode-polished.png everywhere — header, landing hero, favicon, OG image, call incoming, class hub, assessment PDF. Web link orbitdesk-gamma.vercel.app is permanent and prominent — web first (2s instant, no install), app second (PWA 1-click, Electron .exe). Real ringtone 440Hz+480Hz dual-tone like US phone, 2s on 4s off, browser Notification API, vibrate, recording beep every 15s like real call center, hold music C4 E4 G4 C5 loop. Tech lead side: mute, hold, transfer, record, notes, call history, live transcript, sentiment — human experience all over.</p>
  </div>
  </div>
  )}

  {activeStrategy === 'community' && (
  <div className="mt-5 space-y-3">
  {strategies.community.steps.map((step, i) => (
   <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <div className="flex items-start gap-3">
   <span className="h-8 w-8 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 flex items-center justify-center text-[12px] font-bold flex-shrink-0">{i+1}</span>
   <div className="flex-1 min-w-0">
    <p className="text-[13px] font-semibold text-zinc-100">{step.action}</p>
    <p className="text-[12px] text-zinc-400 mt-1 leading-[1.4]">{step.desc}</p>
    <p className="text-[11px] text-emerald-300 mt-2 font-medium">📊 {step.metric}</p>
   </div>
   </div>
   </div>
  ))}
  <div className="mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[12px] font-bold text-zinc-200">Research: ServiceDesk Simulator Growth — 20k+ users</p>
   <ul className="mt-2 space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
   <li>Free tier $0 + Pro $20/mo — freemium works for helpdesk sims</li>
   <li>Discord with 20k+ — community is #1 growth channel for education</li>
   <li>LinkedIn + Reddit + YouTube — 3 channels, not just GitHub</li>
   <li>Live demo link always — not "git clone", but "try now in 2s"</li>
   <li>OrbitDesk advantage: M365 modern (Entra, Intune, Exchange) vs their AD legacy — position as next-gen</li>
   </ul>
  </div>
  </div>
  )}

  {activeStrategy === 'portfolio' && (
  <div className="mt-5 space-y-4">
  {strategies.portfolio.insights.map((item, i) => (
   <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[13px] font-semibold text-zinc-100">💡 {item.insight}</p>
   <p className="text-[12px] text-zinc-400 mt-2 leading-[1.4]">{item.detail}</p>
   <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
   <p className="text-[11px] font-bold text-emerald-300">✅ Action: {item.action}</p>
   </div>
   </div>
  ))}
  </div>
  )}

  {activeStrategy === 'seo' && (
  <div className="mt-5 space-y-4">
  {strategies.seo.plan.map((phase, i) => (
   <div key={i} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <div className="flex items-center gap-3">
   <span className={`h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold border ${i===0 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : i===1 ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{i+1}</span>
   <p className="font-bold text-[13px] text-zinc-100">{phase.phase}</p>
   <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{phase.metric}</span>
   </div>
   <ul className="mt-3 space-y-1.5">
   {phase.tasks.map((task, j) => (
    <li key={j} className="flex gap-2 text-[11px] text-zinc-400">
    <span className="text-emerald-400 mt-0.5">✓</span>
    <span className="leading-[1.4]">{task}</span>
    </li>
   ))}
   </ul>
   </div>
  ))}
  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/10 border border-violet-500/20">
   <p className="text-[12px] font-bold text-violet-300">🎯 Your Permanent Links — Share These, Not Temp</p>
   <div className="mt-3 space-y-2 font-mono text-[11px]">
   <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-zinc-800"><span className="text-zinc-500">Web App (Live):</span><span className="text-emerald-300">https://orbitdesk-gamma.vercel.app</span></div>
   <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-zinc-800"><span className="text-zinc-500">Lab Direct:</span><span className="text-violet-300">https://orbitdesk-gamma.vercel.app/lab</span></div>
   <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-zinc-800"><span className="text-zinc-500">GitHub:</span><span className="text-white">https://github.com/Nyaenya-Devine/orbitdesk</span></div>
   <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-zinc-800"><span className="text-zinc-500">Class Join:</span><span className="text-amber-300">https://orbitdesk-gamma.vercel.app/join/INFLUX-2026-A</span></div>
   <div className="flex justify-between p-2 rounded-lg bg-black/30 border border-zinc-800"><span className="text-zinc-500">Logo Pack:</span><span className="text-white">/orbitdesk-logo-pack-8k.zip + /orbitdesk-logo-godmode-polished.png</span></div>
   </div>
   <p className="text-[10px] text-zinc-500 mt-3">Share web link first — 2s instant, no install, no signup, real voice, real actions — then app option for power users. Logo visible everywhere now — header, landing hero, lab, favicon, OG, calls, class, PDF report.</p>
  </div>
  </div>
  )}
 </motion.div>

 <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60">
  <div className="flex items-center gap-3">
  <Logo variant="hero" size={36} animated />
  <div>
  <p className="font-bold text-[13px] text-white">OrbitDesk — Professional Training Environment</p>
  <p className="text-[11px] text-zinc-500">Logo polished PNG everywhere • Real ringtone 440+480Hz + notification + vibrate + beep 15s + hold music • Class Hub innovative • Growth strategy research-based • Livery M365 • Thread Humor • Web prominent • No one missing out now</p>
  </div>
  </div>
 </div>
 </div>
 );
}
