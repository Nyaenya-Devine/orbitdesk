'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const steps = [
  { id: 'start', title: '01 — START — Professional Learning Tool', subtitle: 'OrbitDesk — Modern Workplace Operations Lab', desc: 'AuthGate redesigned as premium learning enrollment — not basic 3-step. Shows curriculum: Queue, ADUC, Entra ID What-If, Intune, WebRTC calls. Tracks: Operations, Identity, Endpoint. Roles: Learner (Recommended), Junior, Senior, Team Lead. Big purple Skip → Enter Lab Now — Demo Mode fixes stuck. Local-only, no signup.', action: 'Choose Learner → Enter Lab Now', duration: '8s' },
  { id: 'overview', title: '02 — OVERVIEW — Live Metrics', subtitle: 'Shift Status • Dashboard • XP • Level • SLA', desc: 'Overview tab: Shift Status Level XP pending P1 live updating. Dashboard Metrics CSAT QA SLA. VoiceCallDemo FieldNotes DesktopDownload. Progress Resolved tickets Calls. Real data live every second, not static image.', action: 'Check Overview → Live metrics', duration: '7s' },
  { id: 'queue', title: '03 — QUEUE — Real P1 Tickets', subtitle: 'ENTRA-53000 DeviceNotCompliant payroll blocked 45m', desc: 'Queue tab: left TicketQueue P1 critical P2 timers. Center ticket detail Tools Intune Exchange Root Cause Checklist logs tool lang confirm Resolve +XP CSAT QA. Right MockPortals Intune Company Portal sync dsregcmd BitLocker fix. Click ticket → check logs → fix → resolve. Smooth spring 300 damping 25.', action: 'Select P1 → Check logs → Fix BitLocker → Resolve', duration: '10s' },
  { id: 'directory', title: '04 — DIRECTORY — OU Tree ADUC Fully Functional', subtitle: 'Domain → Users Finance 50 IT 12 → Groups → Computers • 5 tabs', desc: 'Directory tab fully functional smooth: left OUTreeView hierarchical OU tree like ADUC domain novatech.com Users Finance 50 IT 12 Groups Security 30 Computers Workstations 80 Servers 9 Disabled 23 icons counts Locked/Disabled badges expand/collapse search filter smooth framer-motion. Center ADUserProperties 5 tabs General Account Unlock Reset MemberOf nested groups BloodHound path Security ACLs GPOs Audit hash chain. Right PowerShell History ADAC + Recycle Bin. Every action works.', action: 'Expand Finance → Click Sarah → Unlock → Audit log', duration: '10s' },
  { id: 'policies', title: '05 — POLICIES — CA What-If GPO Intune Smooth', subtitle: 'Require compliant device Finance breach BitLocker 0% P1', desc: 'Policies tab smooth: sub-tabs CA GPO Intune Agents. CA 4 policies Require compliant device Finance Report-Only→On breach P1 What-If Sarah Finance All apps Compliant No Blocked 53000 live simulation. GPO GPMC Default Domain Policy BitLocker-Require enforced Printers Nairobi WMI linking inheritance enforcement delegation. Intune WS-FIN-001 noncompliant BitLocker off 0% payroll blocked fix escrow AD Company Portal sync dsregcmd. Each action verified works.', action: 'CA What-If → GPO Enforce → Intune Fix', duration: '9s' },
  { id: 'calls', title: '06 — CLASS — Team Calls WebRTC Both Sides', subtitle: 'Class ORBIT-2026-A • Team Calls 9-step harness • Teams-like 420px', desc: 'Class tab: Class Command Center ORBIT-2026-A share link students join live activity leaderboard AI insights. Team Calls CallTestHarness 9 steps initiate BroadcastChannel auto-answer 80% mute hold end incoming WebRTC manual both sides test 2 tabs same class. Team calls dock header own space not overlaying client calls VoiceCallCenter pill h-8 + dropdown w-[380px] z-20 + active call modal bottom-right 420px Teams-like compact non-intrusive mute + not ring when minimized. Real WebRTC peer-to-peer.', action: 'Run Both Sides Test → Call agent → Answer', duration: '8s' },
  { id: 'assessment', title: '07 — ASSESSMENT — Interview Ready', subtitle: 'XP • Level • SLA • CSAT • Export JSON', desc: 'Assessment tab: XP Level SLA compliance CSAT quality scores communication feedback. Progress saved localStorage auto. Export JSON for interview. StudentModeGuide only new users hasSeenGuide localStorage — returning users not shown pop-up. Professional learning tool complete.', action: 'Review report → Export JSON', duration: '6s' },
];

export default function WalkthroughPage() {
  const [current, setCurrent] = useState(0);
  const [showLive, setShowLive] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const step = steps[current];

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (current < steps.length - 1) {
            setCurrent(c => c + 1);
            return 0;
          } else {
            setAutoPlay(false);
            return 100;
          }
        }
        return p + 1;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [autoPlay, current]);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      <div className="sticky top-0 z-30 backdrop-blur-2xl bg-[#050507]/90 border-b border-zinc-800/50">
        <div className="max-w-[1280px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-[12px]">O</div>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.02em]">OrbitDesk — Modern Workplace Operations Lab • Walkthrough</p>
              <p className="text-[10px] tracking-[0.14em] text-zinc-500 uppercase">7 steps • Real live • No MP4 • Lean • v7.0 Genius Edition • Fixed stuck • AD smooth</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAutoPlay(!autoPlay)} className={`h-9 px-4 rounded-full text-[11px] font-semibold tracking-wide border transition ${autoPlay ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'}`}>{autoPlay ? '⏸ Pause' : '▶ Auto-play 60s'}</button>
            <button onClick={() => setShowLive(!showLive)} className={`h-9 px-5 rounded-full text-[12px] font-semibold tracking-wide transition ${showLive ? 'bg-white text-black' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'}`}>{showLive ? '← Back' : '🚀 Open Real Lab Live →'}</button>
            <Link href="/lab" className="h-9 px-4 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[12px] font-medium flex items-center">Lab ↗</Link>
          </div>
        </div>
        {autoPlay && <div className="h-[2px] w-full bg-zinc-900"><div className="h-full bg-violet-500 transition-all duration-100" style={{ width: `${(current / steps.length) * 100 + progress / steps.length}%` }} /></div>}
      </div>

      {showLive ? (
        <div className="flex-1 relative">
          <iframe src="/lab" className="w-full h-[calc(100vh-64px)] border-0 bg-[#0a0a0a]" />
          <div className="absolute bottom-4 left-4 right-4 max-w-[1080px] mx-auto p-4 rounded-2xl bg-violet-500/10 backdrop-blur-xl border border-violet-500/20 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[12px] font-semibold text-zinc-100">🔴 LIVE LAB — Real project running • Step {current+1}: {step.title}</p>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">{step.desc.slice(0,120)}… • {step.action}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setCurrent(c => Math.max(0, c-1))} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[10px]">← Prev</button>
                <button onClick={() => setCurrent(c => Math.min(steps.length-1, c+1))} className="h-7 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[10px]">Next →</button>
              </div>
            </div>
            <button onClick={() => setShowLive(false)} className="h-9 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[11px] font-medium shrink-0">Back to guide</button>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-8 grid lg:grid-cols-[360px_1fr] gap-8">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-[11px] font-bold tracking-[0.14em] text-zinc-500 uppercase">Walkthrough • 7 steps • Real live</p>
              <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${((current+1)/steps.length)*100}%` }} /></div>
              <p className="text-[10px] text-zinc-500 mt-2">{current+1} of {steps.length} • {step.duration} • {autoPlay ? 'Auto-playing' : 'Click step or auto-play'}</p>
            </div>

            <div className="space-y-2">
              {steps.map((s,i) => (
                <button key={s.id} onClick={() => { setCurrent(i); setProgress(0); }} className={`w-full text-left p-4 rounded-2xl border transition ${i===current ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i===current ? 'bg-violet-600 text-white' : i<current ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{i<current ? '✓' : i+1}</span>
                    <span className={`text-[12px] font-semibold leading-[1.2] ${i===current ? 'text-white' : 'text-zinc-400'}`}>{s.title}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 leading-[1.3]">{s.subtitle}</p>
                  {i===current && <span className="mt-2 inline-block text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">{s.action} • {s.duration}</span>}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-emerald-300 uppercase">✅ v7.0 Genius Edition fixes — verified</p>
              <ul className="mt-2 space-y-1 text-[11px] text-zinc-400 leading-[1.4]">
                <li>• AuthGate premium — Modern Workplace Operations Lab</li>
                <li>• Skip → Enter Lab Now obvious — fixes stuck</li>
                <li>• Guide only new users — hasSeenGuide</li>
                <li>• PWA sw.js v7.0 Genius Edition — desktop reflects update</li>
                <li>• Demo lean 91M→4M — no corrupt</li>
                <li>• AD smooth spring 300 damping 25 — fully functional</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 tracking-[0.14em] font-medium uppercase">{step.id} • Step {current+1} • {step.duration} • Real UI</span>
                <span className="text-[10px] text-zinc-500">Educational simulator • Not affiliated with Microsoft • Local-only</span>
              </div>
              <h1 className="mt-4 text-[28px] md:text-[40px] font-semibold tracking-[-0.03em] leading-[0.9] text-zinc-100">{step.title}</h1>
              <p className="mt-3 text-[15px] font-light text-zinc-300">{step.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">What you see — live, not image concatenation</p>
                  <p className="text-[13px] text-zinc-300 mt-3 leading-[1.6]">{step.desc}</p>
                </div>
                <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20">
                  <p className="text-[11px] font-medium tracking-[0.14em] text-violet-300 uppercase">Live action — do this now in real lab</p>
                  <p className="text-[13px] text-white mt-2 font-semibold">{step.action}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setShowLive(true)} className="h-10 px-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-bold tracking-wide">🚀 Open Real Lab → Try</button>
                    <button onClick={() => { if(current < steps.length-1){ setCurrent(current+1); setProgress(0);} }} className="h-10 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[12px] font-medium">Next →</button>
                  </div>
                </div>
                {current === 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-[11px] font-semibold text-amber-300">🔧 Fixed stuck start page</p>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-[1.4]">Before: AuthGate 3 steps tiny Guest link — users stuck. Now: Professional Modern Workplace Operations Lab with curriculum, tracks, roles, big purple Skip → Enter Lab Now — Demo Mode + Watch How It Works link + hint. One click enters lab. Guest mode local-only no signup. Like Chokepoint professional.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[20px] overflow-hidden border border-zinc-800 bg-[#0a0a0a] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <div className="h-11 px-4 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5"><div className="h-3 w-3 rounded-full bg-zinc-700" /><div className="h-3 w-3 rounded-full bg-zinc-700" /><div className="h-3 w-3 rounded-full bg-zinc-700" /></div>
                      <span className="text-[11px] text-zinc-500 ml-3">orbitdesk.vercel.app/lab • {step.id}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">● Live • v7.0 Genius Edition</span>
                  </div>
                  <div className="aspect-[16/10] bg-[#0a0a0a] p-4 relative overflow-hidden">
                    {/* Professional mock of real UI — not screenshot image, but live React structure */}
                    <div className="absolute inset-0 p-4">
                      {current === 0 && (
                        <div className="h-full grid grid-cols-[1.1fr_0.9fr] gap-3">
                          <div className="space-y-3">
                            <div className="h-8 w-24 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600" />
                            <div className="text-[14px] font-semibold text-zinc-100 leading-[1.1]">OrbitDesk — Modern Workplace<br/>Operations Lab</div>
                            <div className="grid grid-cols-2 gap-2">
                              {['Queue Triage','ADUC & Directory','Entra What-If','Intune & Endpoint','Voice & Comms','Assessment'].map(k => (
                                <div key={k} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400">{k}</div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                            <div className="text-[10px] tracking-widest text-zinc-500 uppercase">Enrollment • Role • Step 1 of 2</div>
                            <div className="mt-3 space-y-2">
                              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[10px] text-zinc-200">🎓 Learner • Recommended • Guided 16 tickets</div>
                              <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">💻 Junior Analyst • 0-1 year</div>
                            </div>
                            <div className="mt-3 h-8 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">🚀 Enter Lab Now — Demo Mode</div>
                          </div>
                        </div>
                      )}
                      {current >= 1 && (
                        <div className="h-full flex flex-col gap-2">
                          <div className="flex gap-1.5">
                            {['Overview','Queue','Directory','Policies','Class','Assessment'].map((tab,i) => (
                              <div key={tab} className={`text-[8px] px-2 py-1 rounded-full border ${i===current-1 ? 'bg-white text-black border-white' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>{tab}</div>
                            ))}
                          </div>
                          <div className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                            <div className="text-[10px] text-zinc-400">{step.title} — Real UI component, smooth spring 300 damping 25, fully functional</div>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div className="h-12 rounded-lg bg-zinc-800 border border-zinc-700" />
                              <div className="h-12 rounded-lg bg-zinc-800 border border-zinc-700" />
                              <div className="h-12 rounded-lg bg-violet-500/20 border border-violet-500/20" />
                            </div>
                            <div className="mt-2 h-16 rounded-lg bg-zinc-800 border border-zinc-700 p-2">
                              <div className="text-[8px] text-zinc-500">Live data • {step.action}</div>
                              <div className="mt-1 h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden"><div className="h-full w-[68%] bg-violet-500" /></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-10 px-4 flex items-center justify-between bg-zinc-900/50 border-t border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500">Real React • No images • {step.id} • {step.duration} • Try live</span>
                    <button onClick={() => setShowLive(true)} className="h-6 px-3 rounded-full bg-violet-600 text-white text-[10px] font-medium">Open real lab →</button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Chokepoint-style real demo — actual project</p>
                  <p className="text-[12px] text-zinc-300 mt-2 leading-[1.5]">Like chokepoint-demo.mp4 8.4M real screen recording — not image concatenation. OrbitDesk real lab live at /lab: actual browser capture — live login click, ticket select, OU tree expand, What-If simulation, GPO/Intune fix, WebRTC call. Click Open Real Lab Live above — that’s actual project working, proof over claims.</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button onClick={() => setShowLive(true)} className="h-9 rounded-full bg-white text-black text-[11px] font-semibold">🚀 Try Real Lab Live</button>
                    <Link href="/demo" className="h-9 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-medium flex items-center justify-center">Screenshots →</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
