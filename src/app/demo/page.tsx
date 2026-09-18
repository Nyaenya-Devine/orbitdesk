'use client';
import { useState } from 'react';
import Link from 'next/link';

const features = [
  { id: 'queue', title: 'Queue Triage', desc: 'P1 critical • ENTRA-53000 DeviceNotCompliant • 45m SLA • Real checklist • Resolve +XP', icon: '◧', color: 'violet', detail: 'Select ticket → Check Sign-in Logs Correlation ID → Intune Company Portal sync dsregcmd → Fix BitLocker → Confirm logs tool lang → Resolve' },
  { id: 'directory', title: 'Directory — ADUC', desc: 'OU Tree hierarchical • Users Finance 50 • Groups • GPO • Audit hash chain', icon: '◨', color: 'emerald', detail: 'Domain novatech.com → Users Finance 50 IT 12 Groups Security 30 Computers Workstations 80 Servers 9 Disabled 23 • User Properties 5 tabs General Account Unlock Reset MemberOf BloodHound path Security ACLs GPOs Audit + PowerShell History + Recycle Bin' },
  { id: 'policies', title: 'Policies — CA What-If', desc: '4 CA policies • Require compliant Finance Report-Only breach • What-If 53000', icon: '◐', color: 'blue', detail: 'CA: Require compliant device Finance Report-Only→On breach P1 • What-If Sarah Finance All apps Compliant No Blocked 53000 • GPO GPMC Default Domain Policy BitLocker-Require enforced Printers Nairobi WMI • Intune WS-FIN-001 noncompliant BitLocker off 0% fix escrow AD' },
  { id: 'calls', title: 'Voice — WebRTC', desc: 'Team Calls WebRTC • BroadcastChannel both sides • Teams-like 420px compact', icon: '◍', color: 'amber', detail: 'Class ORBIT-2026-A share link students join live activity leaderboard AI insights • CallTestHarness 9 steps initiate auto-answer 80% mute hold end incoming WebRTC manual both sides test 2 tabs same class • Client calls pill h-8 + dropdown w-[380px] z-20 + active call modal bottom-right 420px Teams-like compact' },
];

export default function DemoPage() {
  const [active, setActive] = useState('queue');
  const [showLive, setShowLive] = useState(false);
  const current = features.find(f => f.id === active) || features[0];

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-2xl bg-[#050507]/80 border-b border-zinc-800/50">
        <div className="max-w-[1280px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-[13px]">O</div>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em]">OrbitDesk — Modern Workplace Operations Lab</p>
              <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">Live Demo • Real UI • v6.16.3 • No MP4 • Lean</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowLive(!showLive)} className={`h-9 px-5 rounded-full text-[12px] font-semibold tracking-wide transition ${showLive ? 'bg-white text-black' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'}`}>{showLive ? '← Back to screenshots' : '🚀 Open Real Lab Live →'}</button>
            <Link href="/lab" className="h-9 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[12px] font-medium flex items-center">Lab ↗</Link>
            <Link href="/walkthrough" className="h-9 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-[12px] font-medium flex items-center">Walkthrough</Link>
          </div>
        </div>
      </div>

      {showLive ? (
        <div className="flex-1 relative">
          <iframe src="/lab" className="w-full h-[calc(100vh-64px)] border-0 bg-[#0a0a0a]" />
          <div className="absolute bottom-4 left-4 right-4 max-w-[960px] mx-auto p-4 rounded-2xl bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold text-amber-300">🔴 LIVE LAB RUNNING — Real project, not video • Try Queue, Directory, Policies, Class</p>
              <p className="text-[11px] text-zinc-400 mt-1">Click Skip → Enter Lab Now to bypass AuthGate • Select P1 ticket • Expand OU tree • Run What-If • Fix BitLocker • Answer call — all real React components</p>
            </div>
            <button onClick={() => setShowLive(false)} className="h-9 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[11px] font-medium shrink-0">Back to demo</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-8 grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-medium tracking-[0.14em] text-zinc-500 uppercase">What you’ll see live</p>
              <div className="mt-3 grid gap-2">
                {features.map(f => (
                  <button key={f.id} onClick={() => setActive(f.id)} className={`text-left p-4 rounded-2xl border transition ${active === f.id ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[12px] border ${active === f.id ? 'bg-violet-500 text-white border-violet-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{f.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[13px] font-medium truncate ${active === f.id ? 'text-zinc-100' : 'text-zinc-300'}`}>{f.title}</div>
                        <div className="text-[11px] text-zinc-500 leading-[1.3] mt-0.5 line-clamp-2">{f.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-emerald-300 uppercase">✅ Fixed issues v6.16.3</p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-zinc-400 leading-[1.4]">
                <li>• AuthGate professional learning-tool UX — Modern Workplace Operations Lab, not basic 3-step</li>
                <li>• Skip → Enter Lab Now obvious, one click, fixes stuck at start page</li>
                <li>• StudentModeGuide only new users — hasSeenGuide localStorage</li>
                <li>• PWA sw.js v6.16.3 skipWaiting clients.claim network-first — desktop reflects update</li>
                <li>• Demo page lean — removed 73MB MP4s, no corrupt, 4MB public</li>
                <li>• AD fully functional + smooth framer-motion spring 300 damping 25</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">Chokepoint-style real demo</p>
              <p className="text-[12px] text-zinc-300 mt-2 leading-[1.5]">Like chokepoint-demo.mp4 8.4M real screen recording — OrbitDesk real lab is live at /lab. Click Open Real Lab Live to see actual project working: live login click, ticket select, OU tree expand, What-If, GPO fix, WebRTC call.</p>
              <button onClick={() => setShowLive(true)} className="mt-3 w-full h-10 rounded-full bg-white text-black text-[12px] font-semibold">🚀 Open Real Lab Live — Real screen record</button>
              <p className="text-[10px] text-zinc-500 mt-2 text-center">No image concatenation — actual React app running</p>
            </div>
          </div>

          {/* Main preview */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 tracking-[0.14em] font-medium uppercase">{current.id} • Real UI • Live</span>
                <span className="text-[10px] text-zinc-500">OrbitDesk — Modern Workplace Operations Lab • Educational simulator</span>
              </div>
              <h1 className="mt-4 text-[28px] md:text-[36px] font-semibold tracking-[-0.03em] leading-[0.95] text-zinc-100">{current.title}</h1>
              <p className="mt-3 text-[14px] leading-[1.5] text-zinc-400 max-w-[720px]">{current.detail}</p>
            </div>

            {/* Real UI mock — professional, not screenshot image */}
            <div className="rounded-[20px] overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              <div className="h-11 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-zinc-700" /><div className="h-3 w-3 rounded-full bg-zinc-700" /><div className="h-3 w-3 rounded-full bg-zinc-700" /></div>
                  <span className="text-[11px] text-zinc-500 ml-3">orbitdesk.vercel.app/lab • {current.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Live • Local-only</div>
              </div>
              
              <div className="aspect-[16/9] bg-[#0a0a0a] relative overflow-hidden p-4">
                {active === 'queue' && (
                  <div className="grid grid-cols-[280px_1fr_260px] gap-3 h-full">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3 space-y-2">
                      <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Queue • 16 tickets</div>
                      {[
                        { id: 'ENTRA-53000', pri: 'P1', title: 'DeviceNotCompliant payroll blocked', time: '45m', color: 'red' },
                        { id: 'INTUNE-2041', pri: 'P2', title: 'BitLocker key missing', time: '2h', color: 'amber' },
                        { id: 'AD-1092', pri: 'P3', title: 'Account locked Finance', time: '4h', color: 'zinc' },
                      ].map(t => (
                        <div key={t.id} className={`p-2.5 rounded-xl border ${t.pri==='P1'?'bg-red-500/10 border-red-500/20':'bg-zinc-800/50 border-zinc-700/50'} text-left`}>
                          <div className="flex items-center gap-1.5"><span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${t.pri==='P1'?'bg-red-500 text-white':t.pri==='P2'?'bg-amber-500 text-black':'bg-zinc-700 text-zinc-300'}`}>{t.pri}</span><span className="text-[10px] font-mono text-zinc-400">{t.id}</span><span className="text-[9px] text-zinc-500 ml-auto">{t.time}</span></div>
                          <div className="text-[11px] text-zinc-200 mt-1 leading-[1.3]">{t.title}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                      <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-zinc-200">ENTRA-53000 • DeviceNotCompliant</span><span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">P1 • 45m SLA</span></div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">User</div><div className="text-zinc-200 mt-1">Sarah.Finance</div></div>
                        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">Device</div><div className="text-zinc-200 mt-1">WS-FIN-001</div></div>
                        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">Error</div><div className="text-zinc-200 mt-1">53000</div></div>
                      </div>
                      <div className="mt-3 p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <div className="text-[10px] font-medium text-violet-300">Root Cause Checklist</div>
                        <div className="mt-2 space-y-1 text-[10px] text-zinc-400">
                          <div>✓ Check Sign-in Logs Correlation ID</div>
                          <div>✓ Entra ID Conditional Access What-If</div>
                          <div>○ Intune Company Portal Sync dsregcmd</div>
                          <div>○ Fix BitLocker escrow AD</div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Intune • Mock Portal</div>
                      <div className="mt-2 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px]"><div className="text-zinc-500">WS-FIN-001</div><div className="text-amber-300 mt-1">Noncompliant • BitLocker off 0%</div><div className="mt-2 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-medium">Fix BitLocker →</div></div>
                    </div>
                  </div>
                )}
                {active === 'directory' && (
                  <div className="grid grid-cols-[260px_1fr_240px] gap-3 h-full">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="text-[10px] tracking-widest text-zinc-500 uppercase">OU Tree • ADUC</div>
                      <div className="mt-3 space-y-1 text-[11px] font-mono">
                        <div className="text-zinc-400">▼ novatech.com</div>
                        <div className="ml-3 text-zinc-400">▼ Users</div>
                        <div className="ml-6 text-emerald-300">▶ Finance 50</div>
                        <div className="ml-6 text-zinc-300">▼ IT 12</div>
                        <div className="ml-9 text-zinc-400">• Alex.IT • Devine.Admin</div>
                        <div className="ml-3 text-zinc-500">▶ Groups 30 • Computers 80</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
                      <div className="text-[11px] font-medium text-zinc-200">Sarah.Finance • Properties • 5 tabs</div>
                      <div className="mt-2 flex gap-1">
                        {['General','Account','MemberOf','Security','Audit'].map(tab => (
                          <div key={tab} className={`text-[9px] px-2 py-1 rounded-full border ${tab==='General'?'bg-white text-black border-white':'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{tab}</div>
                        ))}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><span className="text-zinc-500">Display</span><div className="text-zinc-200">Sarah Finance</div></div>
                        <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><span className="text-zinc-500">OU</span><div className="text-zinc-200">Finance</div></div>
                      </div>
                      <div className="mt-2 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px]"><span className="text-zinc-500">BloodHound Path</span><div className="text-violet-300 mt-1 font-mono">Finance → IT Admins → Domain Admins (3 hops)</div></div>
                    </div>
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="text-[10px] tracking-widest text-zinc-500 uppercase">PowerShell History • ADAC</div>
                      <div className="mt-2 p-2 rounded-lg bg-black border border-zinc-800 font-mono text-[9px] text-zinc-400 leading-[1.4]">Unlock-ADAccount Sarah<br/>Reset-ADAccountPassword -Identity Sarah<br/><span className="text-emerald-400">✓ Audit hash chain HMAC</span></div>
                    </div>
                  </div>
                )}
                {active === 'policies' && (
                  <div className="h-full flex flex-col gap-3">
                    <div className="flex gap-1.5"><div className="text-[9px] px-2.5 py-1 rounded-full bg-white text-black font-medium">CA • 4 policies</div><div className="text-[9px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">GPO • GPMC</div><div className="text-[9px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Intune</div></div>
                    <div className="flex-1 grid grid-cols-[1.2fr_0.8fr] gap-3">
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                        <div className="text-[10px] text-zinc-500">Require compliant device — Finance — Report-Only → On</div>
                        <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px]"><div className="text-amber-300 font-medium">⚠ Breach detected — P1 incident</div><div className="text-zinc-400 mt-1">What-If: Sarah Finance • All apps • Compliant No → Blocked 53000</div></div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-[9px]">
                          <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">User</div><div className="text-zinc-200">Sarah.Finance</div></div>
                          <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">App</div><div className="text-zinc-200">All cloud apps</div></div>
                          <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/20"><div className="text-red-300">Result</div><div className="text-red-200">Blocked 53000</div></div>
                        </div>
                      </div>
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                        <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Intune WS-FIN-001</div>
                        <div className="mt-2 text-[10px]"><div className="flex justify-between"><span className="text-zinc-500">Compliance</span><span className="text-amber-300">Noncompliant</span></div><div className="mt-1 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full w-[0%] bg-red-500" /></div><div className="text-[9px] text-zinc-500 mt-1">BitLocker off 0% • payroll blocked</div><div className="mt-2 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px] font-medium">Fix → Escrow AD → Sync</div></div>
                      </div>
                    </div>
                  </div>
                )}
                {active === 'calls' && (
                  <div className="h-full grid grid-cols-[1fr_320px] gap-3">
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Class Command Center • ORBIT-2026-A</div>
                      <div className="mt-2 flex gap-2"><div className="h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 flex items-center">Share link • influx-2026-a</div><div className="h-8 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] flex items-center">● Live 3 students</div></div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]"><div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">Leaderboard</div><div className="text-zinc-200 mt-1">Alex 420XP • Devine 380XP</div></div><div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">Activity</div><div className="text-zinc-200 mt-1">Queue triage live</div></div><div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700"><div className="text-zinc-500">AI Insights</div><div className="text-zinc-200 mt-1">Focus on CA What-If</div></div></div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3"><div className="text-[10px] tracking-widest text-zinc-500 uppercase">Team Calls • WebRTC</div><div className="mt-2 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center px-3 gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] text-zinc-300">CallTestHarness • 9 steps</span><span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500 text-white">Both sides</span></div></div>
                      <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3"><div className="text-[10px] font-medium text-violet-300">Active Call • Teams-like 420px</div><div className="mt-2 flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-zinc-700" /><div><div className="text-[11px] text-zinc-200">Sarah Finance</div><div className="text-[9px] text-zinc-500">02:34 • Muted</div></div><div className="ml-auto flex gap-1"><div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px]">🎤</div><div className="h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">✕</div></div></div></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-10 px-4 flex items-center justify-between bg-zinc-900/50 border-t border-zinc-800/80">
                <span className="text-[10px] text-zinc-500">Real React components • Not images • Try live at /lab • v6.16.3</span>
                <button onClick={() => setShowLive(true)} className="h-6 px-3 rounded-full bg-violet-600 text-white text-[10px] font-medium">Open real lab →</button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Professional learning tool</p>
                <p className="text-[12px] text-zinc-300 mt-2 leading-[1.5]">AuthGate redesigned as Modern Workplace Operations Lab enrollment — tracks, roles, curriculum. Not basic 3-step. Shows value before login. Skip obvious fixes stuck.</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Lean repo • No corrupt</p>
                <p className="text-[12px] text-zinc-300 mt-2 leading-[1.5]">Public 91M → 4M. Removed 73MB MP4s causing Vercel corrupt. sw.js v6.16.3 network-first + skipWaiting + clients.claim — desktop reflects update immediately.</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Chokepoint-style real demo</p>
                <p className="text-[12px] text-zinc-300 mt-2 leading-[1.5]">Like chokepoint-demo.mp4 8.4M real screen recording. OrbitDesk live iframe above is actual project — real login click, ticket select, OU expand, What-If, GPO fix, WebRTC call.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
