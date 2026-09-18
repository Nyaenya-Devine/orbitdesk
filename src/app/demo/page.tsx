'use client';
import { useState, useRef } from 'react';

export default function DemoVideo() {
  const [activeTab, setActiveTab] = useState<'how' | 'marketing'>('how');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold">O</div>
          <div>
            <p className="text-[13px] font-bold tracking-[0.2em]">ORBITDESK — HOW IT WORKS • REAL UI • HUMAN VOICE • DOWNLOADABLE</p>
            <p className="text-[10px] tracking-widest text-zinc-500">FIXED START PAGE STUCK • SKIP → ENTER LAB NOW • v6.16.2 • PROPRIETARY</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/lab" className="h-9 px-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold tracking-widest flex items-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">🚀 ENTER LAB NOW →</a>
          <a href="https://github.com/Nyaenya-Devine/orbitdesk" target="_blank" className="h-9 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[11px] tracking-widest flex items-center">GITHUB ★</a>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 flex items-center gap-2 border-b border-zinc-800/30 bg-zinc-900/20">
        <div className="flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800">
          <button onClick={() => setActiveTab('how')} className={`h-8 px-5 rounded-full text-[12px] font-bold tracking-widest transition ${activeTab === 'how' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>🎬 HOW IT WORKS — REAL UI • 209s • FIXES STUCK</button>
          <button onClick={() => setActiveTab('marketing')} className={`h-8 px-5 rounded-full text-[12px] font-bold tracking-widest transition ${activeTab === 'marketing' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>✨ MARKETING — 8K CINEMATIC • 140s • HUMAN VOICE</button>
        </div>
        <span className="text-[11px] text-zinc-500 ml-4">Got stuck at start page? Watch How It Works — shows Skip → Enter Lab Now button, no signup, local-only</span>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-violet-500/5 via-transparent to-indigo-500/5">
        <div className="w-full max-w-[1100px]">
          <div className="rounded-[20px] overflow-hidden border border-zinc-800 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            {activeTab === 'how' ? (
              <video
                ref={videoRef}
                controls
                playsInline
                poster="/walkthrough-01-overview.png"
                className="w-full aspect-video bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/orbitdesk-how-it-works-1080p.mp4" type="video/mp4" />
                <source src="/orbitdesk-how-it-works.mp4" type="video/mp4" />
              </video>
            ) : (
              <video
                controls
                playsInline
                poster="/demo-hero-8k.png"
                className="w-full aspect-video bg-black"
              >
                <source src="/orbitdesk-marketing-demo-1080p.mp4" type="video/mp4" />
                <source src="/orbitdesk-marketing-demo.mp4" type="video/mp4" />
              </video>
            )}
          </div>

          {activeTab === 'how' ? (
            <>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-[11px] tracking-[0.2em] text-emerald-300 font-bold">✅ FIXED START PAGE STUCK</p>
                  <p className="text-[13px] text-zinc-300 mt-2 leading-[1.4]"><strong>Problem:</strong> Got stuck at start page AuthGate 3 steps. <strong>Fix:</strong> Now big purple button 🚀 Skip → Enter Lab Now — Demo Mode + link Watch How It Works 2m + hint text Stuck? Click Skip. No signup, local-only.</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[11px] tracking-[0.2em] text-violet-300 font-bold">🎬 HOW IT WORKS — REAL UI • 209s</p>
                  <p className="text-[13px] text-zinc-300 mt-2 leading-[1.4]">5 scenes real OrbitDesk UI: Overview metrics, Queue P1 53000 payroll blocked Intune Company Portal dsregcmd, Directory OU Tree ADUC + User Properties 5 tabs + PowerShell History + Recycle Bin, Policies CA What-If GPO GPMC Intune BitLocker 0%, Calls Team Calls WebRTC both sides Teams-like compact.</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[11px] tracking-[0.2em] text-blue-300 font-bold">⬇️ DOWNLOADABLE VIDEO • HOW IT WORKS</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <a href="/orbitdesk-how-it-works-1080p.mp4" download className="h-8 px-4 rounded-full bg-white text-black text-[11px] font-bold tracking-widest flex items-center">DOWNLOAD 1080p 25MB HOW IT WORKS ↓</a>
                    <a href="/orbitdesk-how-it-works.mp4" download className="h-8 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold tracking-widest flex items-center">720p 15MB ↓</a>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">MP4 • H.264 • AAC • 24fps • Human voice voice-06 • 209s • Shows real lab working</p>
                </div>
              </div>

              <div className="mt-6 p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[12px] font-bold tracking-widest text-zinc-200">STEP-BY-STEP HOW ORBITDESK WORKS — FIXES START PAGE STUCK</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    { step: '01', title: 'Start Page', desc: 'AuthGate 3 steps — role, experience, name. Stuck? Click big purple Skip → Enter Lab Now. No signup. Guest mode. Local-only. Or click Watch How It Works.', color: 'violet' },
                    { step: '02', title: 'Queue — Real Tickets', desc: 'P1 critical ENTRA-53000 DeviceNotCompliant payroll blocked 45m. Select → check Sign-in Logs Correlation ID → Intune → Company Portal Sync → dsregcmd → fix BitLocker → checklist logs tool lang confirm → Resolve +XP CSAT QA.', color: 'red' },
                    { step: '03', title: 'Directory — ADUC', desc: 'OU Tree hierarchical novatech.com → Users Finance 50 IT 12 Groups Security Computers. Click user → Properties 5 tabs General Account Unlock Reset MemberOf nested groups BloodHound path Security ACLs GPOs Audit hash chain + PowerShell History + Recycle Bin.', color: 'emerald' },
                    { step: '04', title: 'Policies — CA GPO Intune', desc: 'CA 4 policies Require compliant device Finance Report-Only breach P1 What-If Sarah Finance All apps Compliant No Blocked 53000. GPO GPMC Default Domain Policy BitLocker-Require enforced Printers Nairobi WMI. Intune WS-FIN-001 noncompliant BitLocker off 0% fix escrow AD.', color: 'blue' },
                    { step: '05', title: 'Class — Team Calls', desc: 'Class INFLUX-2026-A share link students join live activity leaderboard AI insights. Team Calls WebRTC BroadcastChannel both sides tested CallTestHarness 9 steps. Header own space not overlaying. Client calls bottom-right 420px Teams-like compact mute hold end.', color: 'amber' },
                  ].map(s => (
                    <div key={s.step} className="p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800">
                      <div className="flex items-center gap-2"><span className={`h-6 w-6 rounded-full bg-${s.color}-600 text-white text-[10px] font-bold flex items-center justify-center`}>{s.step}</span><span className="text-[11px] font-bold text-zinc-200">{s.title}</span></div>
                      <p className="text-[11px] text-zinc-500 mt-2 leading-[1.4]">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[11px] tracking-[0.2em] text-violet-300 font-bold">8K VISUALS • CINEMATIC</p>
                  <p className="text-[13px] text-zinc-300 mt-2 leading-[1.4]">5 premium 8K images — OU Tree ADUC, Entra ID What-If 53000, GPO GPMC + Intune BitLocker 0% P1, Teams-like call — Ken Burns, grain film, vignette</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[11px] tracking-[0.2em] text-emerald-300 font-bold">HUMAN VOICE • ADVERTISING GRADE</p>
                  <p className="text-[13px] text-zinc-300 mt-2 leading-[1.4]">voice-06 masculine advertising — not AI basic. 140 seconds, 6 scenes, advanced language: Report-Only isn't optional. It's survival.</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[11px] tracking-[0.2em] text-blue-300 font-bold">DOWNLOADABLE • MARKETING</p>
                  <div className="mt-3 flex gap-2">
                    <a href="/orbitdesk-marketing-demo-1080p.mp4" download className="h-8 px-4 rounded-full bg-white text-black text-[11px] font-bold tracking-widest flex items-center">DOWNLOAD 1080p 20MB ↓</a>
                    <a href="/orbitdesk-marketing-demo.mp4" download className="h-8 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[11px] font-bold tracking-widest flex items-center">720p 12MB ↓</a>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">MP4 • H.264 • AAC 192k • 24fps • Human voice synced</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
