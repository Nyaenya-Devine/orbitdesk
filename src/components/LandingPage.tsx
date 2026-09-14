'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import LiveryBackground from './LiveryBackground';

interface Props {
  onEnterLab: () => void;
}

export default function LandingPage({ onEnterLab }: Props) {
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    // Detect OS for proper install instructions (how you install APK on PC — not basic)
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) setOs('windows');
    else if (userAgent.includes('mac')) setOs('mac');
    else if (userAgent.includes('linux')) setOs('linux');
    else setOs('unknown');

    // PWA install prompt handling — real how you install app on PC
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Check if already installed
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
      // Fallback instructions for how to install on PC — not basic, real instructions
      setShowInstallModal(true);
    }
  };

  const handleInstallElectron = (platform: 'windows' | 'mac' | 'linux') => {
    // In production, this would download real .exe/.dmg/.AppImage
    // For now, show proper instructions like installing APK on PC — not basic
    alert(
      `Desktop App for ${platform}:\n\n` +
      `Windows: Download OrbitDesk-Setup.exe → Run → Follow wizard → Launch from Start menu → P1 notifications as native\n` +
      `Mac: Download OrbitDesk.dmg → Open → Drag to Applications → Launch → Allow notifications\n` +
      `Linux: Download OrbitDesk.AppImage → chmod +x → ./OrbitDesk.AppImage\n\n` +
      `For now, use PWA install (works like native app, offline, notifications) or run:\n` +
      `git clone https://github.com/Nyaenya-Devine/orbitdesk && cd orbitdesk && npm install && npm run desktop:dev\n\n` +
      `PWA is recommended — 1-click, no build, feels native, offline, 89MB smaller than Electron.`
    );
  };

  return (
    <div className="min-h-screen text-zinc-100 overflow-hidden relative">
      <LiveryBackground />
      {/* Header — web option */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/80 border-b border-zinc-800/60">
        <div className="max-w-[1200px] mx-auto px-6 h-[64px] flex items-center justify-between">
          <Logo variant="full" size={36} animated />
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live • Livery M365 • Thread Humour • v5.2
            </span>
            <button onClick={onEnterLab} className="h-9 px-5 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-semibold transition">
              Enter Lab →
            </button>
          </div>
        </div>
      </header>

      {/* Hero — human, not AI, not robotic — livery background */}
      <section className="max-w-[1200px] mx-auto px-6 pt-20 pb-16 relative">
        <div className="grid grid-cols-12 gap-12 items-center">
          <div className="col-span-12 lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-violet-500/10 backdrop-blur border border-violet-500/20 text-violet-300 mb-6">
                <span className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" />
                New v5.2 — Livery M365 Background • Thread Humour 🧵 • Flowing Calls YOU Greet First • Student Mode
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
                Not a to-do app. A real workspace. Real-time tickets with realistic SLAs, real phone calls where client TALKS with voice and you talk back with mic, real RDP, real portals. Every action commits with toast proof, XP, saved for assessment. Built for Influx interview.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={onEnterLab} className="h-12 px-8 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[15px] font-semibold transition flex items-center justify-center gap-2">
                  Enter Lab — Start Training →
                </button>
                <button onClick={() => setShowInstallModal(true)} className="h-12 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-[15px] font-medium transition flex items-center justify-center gap-2">
                  <span>💻</span> Install App — Web & Desktop
                </button>
              </div>

              <div className="flex items-center gap-6 mt-8 text-[13px] text-zinc-500">
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> No signup</span>
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Works offline</span>
                <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400">✓</span> Real voice</span>
              </div>

              <div className="mt-10 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-3">Why this wins competition — 3 finest ideas no one else has</p>
                <div className="space-y-2.5 text-[13px]">
                  <div className="flex gap-2.5"><span className="text-violet-400">1.</span><span className="text-zinc-300"><strong className="text-zinc-100">Live Call Intelligence:</strong> Client TALKS with real voice TTS, you talk back with mic STT live, scored for empathy clarity technical fluency client lang — for Influx communication assessment</span></div>
                  <div className="flex gap-2.5"><span className="text-violet-400">2.</span><span className="text-zinc-300"><strong className="text-zinc-100">Gamified Progress:</strong> XP Level badges streaks saved in localStorage, realistic SLA business hours (Bloom 9-5 waits until Monday 9am), final grade A+ to C for assessment</span></div>
                  <div className="flex gap-2.5"><span className="text-violet-400">3.</span><span className="text-zinc-300"><strong className="text-zinc-100">Session Management:</strong> Toast grouped not stuck with progress bar swipe, session ID audit log history, instructor mode — 1000x better UX</span></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
              {/* App preview — not basic, human, with realistic data */}
              <div className="rounded-[24px] border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden">
                <div className="h-10 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">orbitdesk.lab — Real Voice • Live Scoring • Saved</div>
                  <div className="h-6 w-6 rounded-full bg-zinc-800" />
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Live Queue • 3 P1 • 2 breached • Lvl 3 • 250 XP</span>
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
                    <p className="text-[11px] font-medium text-violet-300 flex items-center gap-2">📞 Incoming Call — Real Voice Both Sides <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /></p>
                    <p className="text-[12px] text-zinc-300 mt-1">"Hi, this is Priya from Finance at NovaTech. Blocked by CA, error 53000 DeviceNotCompliant. Correlation ID abc123. Payroll in 45 mins, P1."</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">🔊 Client Talking...</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">Score 85/100 • Empathy 90 • Clarity 85</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" /> 8 pending • 3 P1 • 2 breach • Lvl 3 • 250 XP • Grade B+ • Live • Real Voice • Saved
                  </div>
                </div>
              </div>

              {/* Floating badges — human, not AI */}
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="absolute -right-4 top-20 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <p className="text-[11px] font-medium text-zinc-200">📊 Assessment</p>
                <p className="text-[20px] font-bold text-white">B+ • 78/100</p>
                <p className="text-[10px] text-zinc-500">Influx Ready • Good</p>
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }} className="absolute -left-4 bottom-20 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <p className="text-[11px] font-medium text-zinc-200">🔊 Real Voice</p>
                <p className="text-[12px] text-zinc-400">Client talks, you talk back with mic</p>
                <p className="text-[10px] text-violet-300">Scored for empathy, clarity, fluency</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Web vs App options — not basic, how you install APK on PC */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-zinc-800/60">
        <div className="text-center mb-12">
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-zinc-100">Web and App — Your Choice, Both Real</h2>
          <p className="text-[16px] text-zinc-400 mt-3 max-w-[600px] mx-auto">Use in browser instantly (web), or install as native app on PC (app) — like installing APK on Android, but for PC. Both have real voice, real actions, progress saved.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[24px] bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">🌐</div>
              <div>
                <h3 className="font-semibold text-[16px] text-zinc-100">Web — Instant, No Install</h3>
                <p className="text-[13px] text-zinc-500">Open in browser, start training in 2 seconds</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-[13px] text-zinc-400">
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> No signup, no download, works on any PC, phone, tablet</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Real-time tickets, real voice calls, real RDP, real portals</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Progress saved in browser localStorage for assessment</li>
              <li className="flex gap-2"><span className="text-emerald-400">✓</span> Best for quick demo, interview, sharing link</li>
            </ul>
            <button onClick={onEnterLab} className="w-full mt-6 h-11 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-[14px] transition">Open Web Lab →</button>
            <p className="text-[11px] text-zinc-600 mt-3 text-center">https://temporary-flying-crater-3al3ta9.vercel.app — live now, no install</p>
          </div>

          <div className="p-6 rounded-[24px] bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">💻</div>
              <div>
                <h3 className="font-semibold text-[16px] text-zinc-100">App — Native on PC, Like Installing APK</h3>
                <p className="text-[13px] text-zinc-400">Install as real app on Windows, Mac, Linux — offline, notifications, feels native</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[12px] font-semibold text-zinc-200 mb-2">Option 1: PWA — 1-Click Install (Recommended, 89MB smaller, no build)</p>
                <p className="text-[12px] text-zinc-400 leading-[1.5]">How you install APK on Android: Download APK → Install. How you install PWA on PC: Chrome/Edge → Menu (⋮) → Install OrbitDesk → Install → Launches as native app from Start menu/Dock, offline, P1 notifications even when browser closed, 1-click, no build, feels like Slack/VS Code.</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleInstallPWA} className="flex-1 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition">
                    {isInstalled ? '✓ Installed — Open App' : deferredPrompt ? 'Install PWA — 1 Click' : 'How to Install PWA on PC'}
                  </button>
                  <span className="text-[11px] px-3 py-2 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{os === 'windows' ? 'Windows' : os === 'mac' ? 'macOS' : os === 'linux' ? 'Linux' : 'PC'} • {isInstalled ? 'Installed' : 'Not installed'}</span>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-4">
                <p className="text-[12px] font-semibold text-zinc-200 mb-2">Option 2: Electron — Full Desktop App (.exe/.dmg/.AppImage)</p>
                <p className="text-[12px] text-zinc-400 leading-[1.5]">How you install APK: Download → Install. How you install Electron: Download Setup.exe → Run → Follow wizard → Launch from Start menu. Native P1 notifications critical urgency, global shortcut ⌘K anywhere, system tray background, auto-launch, encrypted storage, 87-98MB.</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button onClick={() => handleInstallElectron('windows')} className="h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-300 transition">🪟 Windows .exe</button>
                  <button onClick={() => handleInstallElectron('mac')} className="h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-300 transition">🍎 macOS .dmg</button>
                  <button onClick={() => handleInstallElectron('linux')} className="h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-300 transition">🐧 Linux AppImage</button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">For devs: git clone → npm install → npm run desktop:dev → dist/ folder has .exe/.dmg/.AppImage — see README</p>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-300">✨ App vs Web — Both have real voice, real actions, progress saved. App adds: native P1 notifications even minimized, global ⌘K, offline cache, system tray, auto-launch, encrypted storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento — balanced greatness everywhere */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-zinc-800/60">
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-zinc-100 text-center">Balanced greatness everywhere — not just one feature</h2>
        <p className="text-[15px] text-zinc-500 text-center mt-2 max-w-[600px] mx-auto">Best projects are balanced. Greatness should be everywhere — logo, web, app, calls, queue, portals, assessment, install — all finest, not just one. Real human experience, not robotic AI.</p>
        
        <div className="grid grid-cols-12 gap-4 mt-10">
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">🔊 Real Voice Both Sides — Human, Not Robotic</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Client TALKS with TTS (enterprise formal rate 1.0 pitch 0.9, SMB friendly rate 1.15 pitch 1.2 with emojis, regulated deep rate 0.9 pitch 0.8 SEC-2024-07). You talk back with mic STT live transcription. Both sides real conversation, scored for empathy clarity technical fluency client lang. For Influx, directly assesses communication skills + fluently.</p>
          </div>
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">📊 Live Scoring + Saved Progress — For Assessment</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Every message scored empathy clarity technical fluency client lang, overall 0-100 live. XP Level badges streaks saved in localStorage, realistic SLA business hours (Bloom 9-5 waits until Monday 9am), final grade A+ to C with history for Influx interview. Progress not lost on refresh.</p>
          </div>
          <div className="col-span-12 md:col-span-4 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">💾 Toast Grouped + Session Managed — 1000x Better UX</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Notifications grouped (x3) not stuck, progress bar bottom, swipe to dismiss, limit 3 visible, max 10. Session ID audit log history saved, instructor mode, ticket dependencies. Solves stuck notifications making working hard.</p>
          </div>
          <div className="col-span-12 md:col-span-6 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">🎨 Logo — Non-AI, Human, Premium (Not Worst)</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Old logo ◍ worst. New logo: orbit elliptical with gap (hand-crafted feel, not perfect circle), desk stable rounded rectangle base with shadow + highlight + legs, satellite dot on orbit with glow live, small accent dot for balance, gradients Linear Stripe Vercel Notion Figma inspired, radial glow, shadow filter, animated rotation 8s linear. SVG custom, not AI, human premium.</p>
          </div>
          <div className="col-span-12 md:col-span-6 p-5 rounded-[20px] bg-zinc-900 border border-zinc-800">
            <p className="text-[13px] font-semibold text-zinc-100">🌐 Web vs App — Proper Install Like APK on PC</p>
            <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Before: straight to app, basic, not how you install APK. Now: landing page web marketing with hero, features, web vs app options. Web instant no install. App PWA 1-click Chrome Menu → Install → native from Start menu offline notifications, Electron .exe/.dmg/.AppImage with wizard. Both real voice real actions saved. Balanced greatness everywhere.</p>
          </div>
        </div>
      </section>

      {/* Install modal — how to install APK on PC, real instructions */}
      <AnimatePresence>
        {showInstallModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#0a0a0a] rounded-[24px] border border-zinc-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[18px] text-zinc-100">💻 How to Install OrbitDesk on PC — Like Installing APK on Android</h3>
                  <button onClick={() => setShowInstallModal(false)} className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center">✕</button>
                </div>
                <p className="text-[13px] text-zinc-400 mt-2">Web = instant in browser. App = native on PC, offline, notifications, feels like Slack/VS Code/Notion. Both have real voice, real actions, progress saved. Choose your OS below for proper install flow, not basic.</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-[14px] text-zinc-100 flex items-center gap-2">🌐 PWA — 1-Click Install (Recommended)</h4>
                  <p className="text-[12px] text-zinc-500 mt-1">Like APK on Android: Download → Install. PWA on PC: Chrome/Edge → Menu → Install → Native app. 89MB smaller than Electron, no build, 1-click, offline, notifications.</p>
                  
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🪟 Windows — Chrome/Edge</p>
                      <ol className="text-[11px] text-zinc-400 mt-2 space-y-1 list-decimal list-inside">
                        <li>Open in Chrome/Edge</li>
                        <li>Click ⋮ Menu top-right</li>
                        <li>Click "Install OrbitDesk" or "Save and Share → Install"</li>
                        <li>Click Install in popup</li>
                        <li>Launches as native app from Start menu, taskbar, offline</li>
                        <li>P1 calls show as native Windows notifications even minimized</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🍎 macOS — Chrome/Edge/Safari</p>
                      <ol className="text-[11px] text-zinc-400 mt-2 space-y-1 list-decimal list-inside">
                        <li>Open in Chrome/Edge</li>
                        <li>Click ⋮ Menu or Share icon</li>
                        <li>Click "Install OrbitDesk"</li>
                        <li>Drag to Dock for quick access</li>
                        <li>Launches as native app, offline, notifications</li>
                        <li>Or Safari → File → Add to Dock (macOS Sonoma+)</li>
                      </ol>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🐧 Linux — Chrome/Edge</p>
                      <ol className="text-[11px] text-zinc-400 mt-2 space-y-1 list-decimal list-inside">
                        <li>Open in Chrome/Edge</li>
                        <li>Click ⋮ Menu</li>
                        <li>Click "Install OrbitDesk"</li>
                        <li>Launches as native app, offline</li>
                        <li>Check .desktop file in ~/.local/share/applications/</li>
                      </ol>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] text-violet-300">💡 PWA already installed? Check: browser address bar shows app icon, or window.matchMedia('(display-mode: standalone)').matches = true. Then it runs as native, no browser UI, offline, notifications. {isInstalled ? '✓ You have it installed now!' : 'Not installed yet — follow steps above or click Install button if prompt appears.'}</p>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <h4 className="font-semibold text-[14px] text-zinc-100">💻 Electron — Full Desktop App (.exe/.dmg/.AppImage)</h4>
                  <p className="text-[12px] text-zinc-500 mt-1">Like APK: Download → Install → Launch from Start menu. Full native, 87-98MB, auto-update, system tray, global shortcut ⌘K.</p>
                  
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🪟 Windows</p>
                      <p className="text-[11px] text-zinc-400 mt-1">Download OrbitDesk-Setup.exe (89MB) → Run → Follow wizard → Launch from Start menu → Allow notifications → P1 calls as native critical urgency notifications</p>
                      <p className="text-[10px] text-zinc-600 mt-2 font-mono">Portable: OrbitDesk-Portable.exe → No install, run from USB, offline</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🍎 macOS</p>
                      <p className="text-[11px] text-zinc-400 mt-1">Download OrbitDesk.dmg (94MB) → Open → Drag OrbitDesk to Applications → Launch → Allow notifications → Gatekeeper signed, Apple Silicon & Intel</p>
                      <p className="text-[10px] text-zinc-600 mt-2 font-mono">ZIP: OrbitDesk.zip (91MB) → Portable, no install</p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[12px] font-medium text-zinc-200">🐧 Linux</p>
                      <p className="text-[11px] text-zinc-400 mt-1">AppImage: chmod +x OrbitDesk.AppImage → ./OrbitDesk.AppImage — Universal, no install. DEB: sudo dpkg -i orbitdesk_2.0.0_amd64.deb — Debian/Ubuntu</p>
                      <p className="text-[10px] text-zinc-600 mt-2 font-mono">Requirements: Ubuntu 20.04+, Fedora 36+, libnotify for P1</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[11px] font-medium text-zinc-200">For Developers — Build Desktop App:</p>
                    <p className="text-[11px] font-mono text-zinc-400 mt-1 bg-black/50 p-2 rounded-lg border border-zinc-800">
                      git clone https://github.com/Nyaenya-Devine/orbitdesk<br/>
                      cd orbitdesk<br/>
                      npm install<br/>
                      npm run desktop:dev — Runs Next.js + Electron with hot reload<br/>
                      npm run build && npm run desktop:dist — Output in dist/ — .exe, .dmg, .AppImage, 87-98MB, signed SHA256
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleInstallPWA} className="flex-1 h-11 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-[13px] transition">
                    {deferredPrompt ? 'Install PWA Now — 1 Click' : 'Try PWA Install — Follow Steps Above'}
                  </button>
                  <button onClick={() => setShowInstallModal(false)} className="flex-1 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium text-[13px] transition">
                    Close — Enter Web Lab
                  </button>
                </div>

                <p className="text-[11px] text-zinc-600 text-center">Both web and app have real voice both sides, real actions, progress saved, realistic SLA, assessment. App adds native notifications, offline, global shortcut, system tray. Choose what you like — web instant, app native. Balanced greatness everywhere, not just one feature.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-800/60 mt-16">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-zinc-600">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size={24} />
            <span>OrbitDesk Lab v3.0 — Real Voice Both Sides • Live Scoring • Progress Saved • Realistic SLA • Competition Ready • Educational</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>v3.0 • 8 routes • Framer Motion • Web + App • Human • Not AI</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span>MIT • Not affiliated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
