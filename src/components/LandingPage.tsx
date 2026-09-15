'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import LiveryBackground from './LiveryBackground';
import ThreadHumor from './ThreadHumor';

interface Props {
  onEnterLab: () => void;
}

export default function LandingPage({ onEnterLab }: Props) {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) setOs('windows');
    else if (userAgent.includes('mac')) setOs('mac');
    else if (userAgent.includes('linux')) setOs('linux');
    else setOs('unknown');

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 overflow-hidden relative">
      <LiveryBackground />
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/60">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Logo variant="hero" size={36} animated />
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live • Polished Logo 👑 • Real Ringtone 🔔 • Class Hub 👥 • v6.2
            </span>
            <a href="https://orbitdesk-gamma.vercel.app" target="_blank" className="hidden md:flex h-9 px-4 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300 items-center gap-2">
              🌐 orbitdesk-gamma.vercel.app
            </a>
            <button onClick={onEnterLab} className="h-9 px-5 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-semibold transition">
              Enter Lab → Web
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-16 relative">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-violet-500/10 backdrop-blur border border-violet-500/20 text-violet-300 mb-6">
                <img src="/orbitdesk-logo-godmode-polished.png" alt="logo" className="h-4 w-4 rounded-full object-cover" />
                New v6.2 — Polished Logo 👑 Everywhere • Real Ringtone 🔔 440+480Hz • Class Hub 👥 Innovative • Growth 🚀 Strategy
              </div>
              
              <h1 className="text-[48px] md:text-[56px] font-bold tracking-[-0.03em] leading-[0.95] text-zinc-100">
                The helpdesk
                <br />
                <span className="text-zinc-500">simulator where</span>
                <br />
                every button
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">actually works.</span>
              </h1>
              
              <p className="text-[18px] leading-[1.5] text-zinc-400 mt-6 max-w-[480px]">
                Not a to-do app. A real workspace with human feel. Real-time tickets, real phone calls with <strong className="text-zinc-200">real ringtone 440+480Hz + notification + vibrate + recording beep 15s + hold music</strong>, real RDP Win11 stages, real portals teaching, <strong className="text-zinc-200">class hub for instructors</strong> to monitor students live. Every action human, not robotic.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[12px] font-bold text-emerald-300 flex items-center gap-2">🌐 Web Link Prominent — No App Needed • 2s Start</p>
                <p className="text-[13px] text-zinc-300 mt-2 font-mono">https://orbitdesk-gamma.vercel.app</p>
                <p className="text-[11px] text-zinc-500 mt-1">Permanent URL, not temp. Open in browser, instant, no install, no signup, real voice, real actions, progress saved. Share this link — anyone can try in 2 seconds. App is optional for power users.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={onEnterLab} className="h-9 px-5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold">🌐 Try Web Now — 2s →</button>
                  <a href="https://orbitdesk-gamma.vercel.app" target="_blank" className="h-9 px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[12px] flex items-center">Open Permanent Link ↗</a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button onClick={onEnterLab} className="h-12 px-8 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[15px] font-semibold transition flex items-center justify-center gap-2">
                  <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-5 w-5 rounded-full object-cover" />
                  Enter Lab — Web Instant →
                </button>
                <button onClick={() => setShowInstallModal(true)} className="h-12 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-[15px] font-medium transition flex items-center justify-center gap-2">
                  <span>💻</span> Install App — Optional
                </button>
              </div>

              <div className="flex items-center gap-6 mt-6 text-[13px] text-zinc-500">
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Polished logo everywhere</span>
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Web link prominent</span>
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Human, not robotic</span>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-3">Why this wins — Human Premium, Not Robotic • v6.2</p>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex gap-2.5"><span className="text-violet-400">1.</span><span className="text-zinc-300"><strong className="text-zinc-100">Real Human Calls:</strong> Dual-tone ring 440+480Hz, browser notification, vibrate, recording beep every 15s, hold music C4-E4-G4-C5, mute, hold, transfer, notes, history — tech lead controls, human</span></div>
                  <div className="flex gap-2.5"><span className="text-violet-400">2.</span><span className="text-zinc-300"><strong className="text-zinc-100">Class Hub Innovative:</strong> Class code INFLUX-2026-A, shareable link orbitdesk.app/join/CODE, live presence 🟢📞, leaderboard, AI insights who needs help, export CSV/JSON/Sheets/Discord/LMS — for instructors teaching Influx batch</span></div>
                  <div className="flex gap-2.5"><span className="text-violet-400">3.</span><span className="text-zinc-300"><strong className="text-zinc-100">Growth Strategy Research:</strong> Fixed 6 visibility gaps (logo invisible, temp URL, no SEO) — now polished logo everywhere, permanent URL, sitemap, OG image, Discord/LinkedIn/Reddit plan, 30/60/90 day path — no one missing out</span></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              <div className="rounded-[24px] border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden">
                <div className="h-10 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/orbitdesk-logo-godmode-polished.png" alt="logo" className="h-6 w-6 rounded-full object-cover border border-violet-500/20" />
                    <span className="text-[11px] font-bold text-zinc-300">OrbitDesk</span>
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500">v6.2 • Human • Real</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">orbitdesk-gamma.vercel.app — Web</div>
                  <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">🌐</div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Live Queue • 5 online • 3 P1 • Lvl 5 • 450 XP • Class INFLUX-2026-A</span>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { code: 'INTUNE-001', title: 'DeviceNotCompliant 53000 — Payroll blocked 50 users', priority: 'P1', time: '12m left', client: 'NovaTech', color: 'red' },
                      { code: 'EXCH-003', title: 'Shared mailbox finance@ not showing in Outlook', priority: 'P2', time: '2h left • Business Hours', client: 'Bloom', color: 'amber' },
                      { code: 'SEC-007', title: 'BitLocker compliance blocking Teams — SEC-2024-07', priority: 'P1', time: '23m left • Strict', client: 'Apex', color: 'red' },
                    ].map(ticket => (
                      <div key={ticket.code} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition group">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ticket.color === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>{ticket.priority}</span>
                          <span className="text-[11px] font-mono text-zinc-500">{ticket.code}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{ticket.client}</span>
                          <span className="ml-auto text-[10px] font-mono text-zinc-500">{ticket.time}</span>
                        </div>
                        <p className="text-[12px] font-medium text-zinc-200 group-hover:text-white transition">{ticket.title}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] font-medium text-violet-300 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      📞 Incoming Call — Real Ringtone 🔔 440+480Hz • Notification • Vibrate
                    </p>
                    <p className="text-[12px] text-zinc-300 mt-1">"Hi, this is Sarah from Finance at NovaTech. Blocked by CA, error 53000 DeviceNotCompliant. Correlation ID a7f3c9e2. Payroll in 45 mins, P1."</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">🔔 Ring • 440+480Hz • 2s on 4s off</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">🔴 REC beep 15s • Hold music • Human</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[11px] font-bold text-zinc-300 flex items-center gap-2"><span>👥</span> Class Hub — INFLUX-2026-A • 5 students • Live</p>
                    <div className="mt-2 flex gap-1.5">
                      {['A', 'B', 'C', 'D', 'Y'].map((a, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-white font-bold relative">
                          {a}
                          <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-zinc-900 ${i < 3 ? 'bg-emerald-500' : i === 3 ? 'bg-violet-500 animate-pulse' : 'bg-emerald-500'}`} />
                        </div>
                      ))}
                      <span className="text-[10px] text-zinc-500 ml-2">3 online • 1 in-call • Live feed</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-4 w-4 rounded-full object-cover" />
                    <span>orbitdesk-gamma.vercel.app • Web • No install • Human • Lively • Not robotic</span>
                  </div>
                </div>
              </div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="absolute -right-4 top-20 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <div className="flex items-center gap-2">
                  <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-6 w-6 rounded-full object-cover" />
                  <div>
                    <p className="text-[11px] font-medium text-zinc-200">Class Hub</p>
                    <p className="text-[14px] font-bold text-white">INFLUX-2026-A</p>
                    <p className="text-[10px] text-emerald-400">5 students • Live</p>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }} className="absolute -left-4 bottom-20 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <p className="text-[11px] font-medium text-zinc-200 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Real Ringtone</p>
                <p className="text-[11px] text-zinc-400">440Hz+480Hz dual-tone</p>
                <p className="text-[10px] text-violet-300">Notification + vibrate + beep 15s + hold music</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 pb-8">
        <ThreadHumor />
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/orbitdesk-logo-godmode-polished.png" alt="OrbitDesk" className="h-12 w-12 rounded-full object-cover border-2 border-violet-500/20 shadow-lg" />
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-zinc-100">Web and App — Your Choice, Both Human</h2>
          </div>
          <p className="text-[16px] text-zinc-400 mt-3 max-w-[600px] mx-auto">Web is prominent — instant in 2s, no install, polished logo everywhere, human not robotic. App optional for power users. Both have real ringtone, real calls, class hub, growth.</p>
          <p className="text-[13px] font-mono text-emerald-300 mt-2">Permanent: https://orbitdesk-gamma.vercel.app — not temp, share this</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[24px] bg-gradient-to-br from-emerald-500/5 to-violet-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">🌐</div>
              <div>
                <h3 className="font-semibold text-[16px] text-zinc-100 flex items-center gap-2">Web — Instant, Prominent, Human <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">Recommended</span></h3>
                <p className="text-[13px] text-zinc-500">No app needed — open link, start in 2 seconds, polished logo, lively</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-[13px] text-zinc-400">
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> <strong className="text-zinc-200">Permanent URL:</strong> orbitdesk-gamma.vercel.app — not temporary-flying-crater, memorable, shareable</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Polished logo 👑 everywhere — header, hero, favicon, OG image, calls, class hub</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Real human calls — ringtone 440+480Hz, notification, vibrate, beep 15s, hold music, mute/hold/transfer</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Class Hub 👥 for instructors — group students, monitor live, leaderboard, export Sheets</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Livery M365 background + Thread Humor 10 threads — lively, not basic black, human</li>
            </ul>
            <button onClick={onEnterLab} className="w-full mt-6 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[14px] transition flex items-center justify-center gap-2">
              <span>🌐</span> Open Web Lab — orbitdesk-gamma.vercel.app — 2s →
            </button>
            <p className="text-[11px] text-zinc-500 mt-3 text-center font-mono">https://orbitdesk-gamma.vercel.app — live now, polished, human, growth ready</p>
          </div>

          <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">💻</div>
              <div>
                <h3 className="font-semibold text-[16px] text-zinc-100">App — Optional, For Power Users</h3>
                <p className="text-[13px] text-zinc-400">Install if you want native feel — offline, notifications, but web is enough</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-semibold text-zinc-200 mb-2">PWA — 1-Click (89MB smaller, no build, feels native)</p>
                <p className="text-[12px] text-zinc-400 leading-[1.5]">Chrome/Edge → Menu (⋮) → Install OrbitDesk → Install → Start menu/Dock, offline, P1 notifications even minimized, 1-click, no build, like Slack/VS Code.</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleInstallPWA} className="flex-1 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition">
                    {isInstalled ? '✓ Installed — Open App' : deferredPrompt ? 'Install PWA — 1 Click' : 'How to Install PWA'}
                  </button>
                  <span className="text-[11px] px-3 py-2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{os} • {isInstalled ? 'Installed' : 'Web is enough'}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-[12px] font-semibold text-zinc-200 mb-2">Electron — Full Desktop (.exe/.dmg)</p>
                <p className="text-[11px] text-zinc-500">For devs who want .exe — git clone → npm run desktop:dist — 87-98MB, signed SHA256, auto-update</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="flex items-center justify-center gap-3 mb-2">
          <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-8 w-8 rounded-full object-cover border border-violet-500/20" />
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-zinc-100 text-center">Human Premium Everywhere — Not Robotic • v6.2</h2>
        </div>
        <p className="text-[15px] text-zinc-500 text-center mt-2 max-w-[700px] mx-auto">Polished logo 👑 visible everywhere, real ringtone 🔔 440+480Hz + notification + vibrate + beep 15s + hold music, class hub 👥 innovative, growth 🚀 research-based, livery M365 🎨 + thread humor 🧵 lively, web link 🌐 prominent orbitdesk-gamma.vercel.app — perfect feeling at every spot, from start to finish, research + compare + combine.</p>
        
        <div className="grid grid-cols-12 gap-4 mt-10">
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2"><img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-5 w-5 rounded-full object-cover" /> Polished Logo Everywhere — Not Invisible</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Before: SVG only, not visible. Now: polished PNG /orbitdesk-logo-godmode-polished.png in header, landing hero, lab header, favicon, OG image, call incoming modal, call history, class hub, assessment PDF, growth dashboard — with fallback SVG, glow, animated. Logo pack 8k zip downloadable. Human premium, not AI basic.</p>
          </div>
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">🔔 Real Ringtone + Human Calls — Tech Lead</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Before: 800Hz beep, no notification. Now: dual-tone 440+480Hz like US phone, 2s on 4s off, browser Notification API with icon, vibrate API, recording beep every 15s like real call center, hold music C4-E4-G4-C5 loop, mute, hold, transfer, record toggle, notes, call history, live transcript, sentiment, tech lead side panel with controls — human, not robotic.</p>
          </div>
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">👥 Class Hub Innovative — For Influx Teaching</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Before: no class grouping. Now: class code INFLUX-2026-A, shareable link orbitdesk.app/join/CODE, 5 mock students + you, presence 🟢📞🟡, live feed, leaderboard 🥇🥈🥉, AI insights who needs help, strengths, export CSV/JSON/Sheets, Discord webhook, LMS LTI — innovative, not basic classroom, for lead to monitor progress as class.</p>
          </div>
          <div className="col-span-12 md:col-span-6 p-5 rounded-[20px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <p className="text-[13px] font-semibold text-violet-300">🌐 Web Link Prominent — No App Needed</p>
            <p className="text-[13px] text-violet-200/70 mt-2 leading-[1.5]">Before: temp URL temporary-flying-crater, app focused. Now: permanent orbitdesk-gamma.vercel.app prominent in header, hero, web card, OG, shareable class link. Web first: 2s instant, no install, no signup, polished logo, lively livery + humor, real calls, class hub — app optional for power users. Growth: SEO sitemap, robots, meta, OG image polished logo.</p>
          </div>
          <div className="col-span-12 md:col-span-6 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">🚀 Growth Strategy — No One Missing Out</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Research: ServiceDesk Simulator 20k+ users, $0/$20 freemium, Discord, LinkedIn, Reddit, YouTube. Diagnosis: 6 gaps fixed v6.2. Plan: Week 1-2 fix basics (done), Week 3-4 Discord 100 + LinkedIn 500 views + Reddit 50 upvotes + GitHub 50 stars + YouTube 200 views, Month 2 blog + KB SEO + /learn + Firebase sync + portfolio, Month 3 freemium or job. Permanent links: orbitdesk-gamma.vercel.app, /lab, /join/CODE, GitHub, logo pack.</p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showInstallModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0a0a0a] rounded-[24px] border border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-8 w-8 rounded-full object-cover border border-violet-500/20" />
                    <h3 className="font-bold text-[18px] text-zinc-100">How to Install — Web is Enough, App Optional</h3>
                  </div>
                  <button onClick={() => setShowInstallModal(false)} className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center">✕</button>
                </div>
                <p className="text-[13px] text-zinc-400 mt-2">Web is prominent: orbitdesk-gamma.vercel.app — 2s instant, polished logo, human, lively. App optional for power users who want offline + native notifications.</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-[13px] font-bold text-emerald-300">🌐 Web — Recommended • No Install • 2s • Human</p>
                  <p className="text-[12px] text-zinc-400 mt-2">Open https://orbitdesk-gamma.vercel.app in browser — instant, no install, polished logo, livery M365, thread humor, real calls with ringtone, class hub, growth. Share this link — anyone can try in 2s. This is prominent option.</p>
                  <button onClick={onEnterLab} className="mt-3 w-full h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px]">🌐 Open Web Lab Now — 2s →</button>
                </div>

                <div>
                  <h4 className="font-semibold text-[14px] text-zinc-100">💻 App — Optional • For Power Users</h4>
                  <p className="text-[12px] text-zinc-500 mt-1">PWA 1-click: Chrome Menu → Install OrbitDesk → Start menu, offline, notifications. Electron: .exe/.dmg 87-98MB.</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={handleInstallPWA} className="flex-1 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px]">{isInstalled ? '✓ Installed' : 'Install PWA — 1 Click'}</button>
                    <button onClick={() => setShowInstallModal(false)} className="flex-1 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-[13px]">Use Web — Enough</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-800/60 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-zinc-600">
          <div className="flex items-center gap-3">
            <img src="/orbitdesk-logo-godmode-polished.png" alt="OrbitDesk" className="h-8 w-8 rounded-full object-cover border border-violet-500/20" />
            <span>OrbitDesk Lab v6.2 — Polished Logo 👑 • Real Ringtone 🔔 • Class Hub 👥 • Growth 🚀 • Livery M365 🎨 • Thread Humor 🧵 • Human • Educational</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="hidden md:inline">🌐 orbitdesk-gamma.vercel.app • Web • Permanent</span>
            <span>v6.2 • Human • Not Robotic</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
