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

 useEffect(() => {
 const handleBeforeInstallPrompt = (e: any) => {
 e.preventDefault();
 setDeferredPrompt(e);
 };
 window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
 if (window.matchMedia('(display-mode: standalone)').matches) setIsInstalled(true);
 window.addEventListener('appinstalled', () => {
 setIsInstalled(true);
 setDeferredPrompt(null);
 });
 return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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
  <Logo variant="full" size={36} animated />
  <div className="flex items-center gap-3">
  <span className="hidden md:flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
   Live Training Environment
  </span>
  <button onClick={onEnterLab} className="h-9 px-5 rounded-full bg-white text-zinc-900 text-[13px] font-semibold hover:bg-zinc-100 transition">
   Launch Lab
  </button>
  </div>
  </div>
 </header>

 <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 relative">
  <div className="grid grid-cols-12 gap-12 items-center">
  <div className="col-span-12 lg:col-span-6">
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
   <div className="inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-6">
   <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-4 w-4 rounded-full object-cover" />
   Modern Workplace • Microsoft 365 Training
   </div>
   
   <h1 className="text-[48px] md:text-[60px] font-bold tracking-[-0.04em] leading-[0.9] text-white">
   Real helpdesk
   <br />
   <span className="text-zinc-500">training,</span>
   <br />
   not simulations.
   </h1>
   
   <p className="text-[18px] leading-[1.5] text-zinc-400 mt-6 max-w-[480px]">
   Practice Entra ID, Intune, Exchange, and Teams troubleshooting with live tickets, voice calls, and remote desktop. Designed for IT support professionals.
   </p>

   <div className="flex gap-3 mt-8">
   <button onClick={onEnterLab} className="h-12 px-8 rounded-full bg-white text-zinc-900 text-[15px] font-semibold hover:bg-zinc-100 transition">
   Start Training
   </button>
   <button onClick={() => setShowInstallModal(true)} className="h-12 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-white text-[15px] font-medium hover:bg-zinc-800 transition">
   Install App
   </button>
   </div>

   <div className="flex items-center gap-6 mt-8 text-[12px] text-zinc-500">
   <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-500" />No signup required</span>
   <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-500" />Works offline</span>
   <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-500" />Free to use</span>
   </div>
  </motion.div>
  </div>

  <div className="col-span-12 lg:col-span-6">
  <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
   <div className="rounded-[24px] border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden">
   <div className="h-11 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
   <div className="flex items-center gap-2">
    <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-6 w-6 rounded-full object-cover" />
    <span className="text-[13px] font-semibold text-white">OrbitDesk</span>
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
   </div>
   <div className="text-[11px] text-zinc-500">orbitdesk-gamma.vercel.app</div>
   </div>
   
   <div className="p-4 space-y-3">
   <div className="flex items-center justify-between">
    <span className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">Active Tickets • 3 Priority</span>
    <span className="text-[11px] text-zinc-500">Live</span>
   </div>
   
   <div className="space-y-2">
    {[
    { code: 'ENTRA-53000', title: 'Conditional Access blocking payroll — 50 users affected', priority: 'P1', client: 'NovaTech' },
    { code: 'EXCH-003', title: 'Shared mailbox not appearing in Outlook', priority: 'P2', client: 'Bloom Studio' },
    { code: 'INTUNE-007', title: 'Device compliance failing — BitLocker required', priority: 'P1', client: 'Apex Financial' },
    ].map(ticket => (
    <div key={ticket.code} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
    <div className="flex items-center gap-2 mb-1">
     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.priority === 'P1' ? 'bg-red-500/10 text-red-400 border border-red-500/10' : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'}`}>{ticket.priority}</span>
     <span className="text-[11px] font-mono text-zinc-500">{ticket.code}</span>
     <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{ticket.client}</span>
    </div>
    <p className="text-[13px] text-zinc-200">{ticket.title}</p>
    </div>
    ))}
   </div>

   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
    <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
    <span className="text-[11px] font-medium text-zinc-300">Incoming call • Sarah Finance • NovaTech</span>
    </div>
    <p className="text-[12px] text-zinc-400 mt-2">"I'm blocked by Conditional Access, error 53000. Payroll deadline in 45 minutes."</p>
   </div>
   </div>
   </div>
  </motion.div>
  </div>
  </div>
 </section>

 <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-zinc-800/60">
  <div className="grid md:grid-cols-3 gap-6">
  <div className="p-6 rounded-[20px] bg-zinc-900 border border-zinc-800">
  <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[18px]">🎧</div>
  <h3 className="font-semibold text-[16px] text-white mt-4">Voice Calls</h3>
  <p className="text-[14px] text-zinc-400 mt-2 leading-[1.5]">Handle real-time calls with clients, practice communication, and manage call queue with professional controls.</p>
  </div>
  <div className="p-6 rounded-[20px] bg-zinc-900 border border-zinc-800">
  <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[18px]">🖥️</div>
  <h3 className="font-semibold text-[16px] text-white mt-4">Remote Desktop</h3>
  <p className="text-[14px] text-zinc-400 mt-2 leading-[1.5]">Connect to client workstations with secure remote desktop, run diagnostics, and resolve issues directly.</p>
  </div>
  <div className="p-6 rounded-[20px] bg-zinc-900 border border-zinc-800">
  <div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[18px]">📊</div>
  <h3 className="font-semibold text-[16px] text-white mt-4">Admin Portals</h3>
  <p className="text-[14px] text-zinc-400 mt-2 leading-[1.5]">Work with Entra ID, Intune, Exchange, and Teams admin centers with realistic data and workflows.</p>
  </div>
  </div>
 </section>

 <section className="max-w-[1200px] mx-auto px-6 py-16 border-t border-zinc-800/60">
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-8 rounded-[24px] bg-zinc-900 border border-zinc-800">
  <div className="flex items-center gap-4">
  <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-12 w-12 rounded-full object-cover border border-zinc-700" />
  <div>
   <h3 className="font-semibold text-[18px] text-white">Available everywhere</h3>
   <p className="text-[14px] text-zinc-400 mt-1">Use in browser or install as native app — Windows, macOS, Linux, Android</p>
  </div>
  </div>
  <div className="flex gap-3">
  <button onClick={onEnterLab} className="h-10 px-6 rounded-full bg-white text-zinc-900 font-semibold text-[14px]">Open in Browser</button>
  <button onClick={handleInstallPWA} className="h-10 px-6 rounded-full bg-zinc-800 border border-zinc-700 text-white text-[14px]">{isInstalled ? 'Installed' : 'Install'}</button>
  </div>
  </div>
 </section>

 <AnimatePresence>
  {showInstallModal && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
  <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-zinc-900 rounded-[20px] border border-zinc-800 shadow-2xl max-w-md w-full p-6">
   <div className="flex items-center gap-3">
   <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-10 w-10 rounded-full object-cover" />
   <div>
   <h3 className="font-semibold text-[16px] text-white">Install OrbitDesk</h3>
   <p className="text-[12px] text-zinc-500">Native app experience</p>
   </div>
   <button onClick={() => setShowInstallModal(false)} className="ml-auto h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✕</button>
   </div>
   
   <div className="mt-6 space-y-4">
   <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700">
   <h4 className="font-medium text-[14px] text-white">Web App</h4>
   <p className="text-[13px] text-zinc-400 mt-1">Install from browser — works offline, native notifications, no download needed.</p>
   <button onClick={handleInstallPWA} className="mt-3 w-full h-9 rounded-full bg-white text-zinc-900 font-medium text-[13px]">{isInstalled ? 'Installed' : 'Install'}</button>
   </div>
   <div className="p-4 rounded-xl bg-zinc-800 border border-zinc-700">
   <h4 className="font-medium text-[14px] text-white">Desktop & Mobile Stores</h4>
   <p className="text-[13px] text-zinc-400 mt-1">Available as PWA — can be packaged for Play Store (TWA) and Microsoft Store.</p>
   <div className="mt-3 grid grid-cols-2 gap-2">
    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 text-center">Google Play<br/>via PWABuilder</div>
    <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 text-center">Microsoft Store<br/>via PWA</div>
   </div>
   </div>
   </div>
  </motion.div>
  </motion.div>
  )}
 </AnimatePresence>

 <footer className="border-t border-zinc-800/60">
  <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between text-[12px] text-zinc-500">
  <div className="flex items-center gap-3">
  <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-6 w-6 rounded-full object-cover" />
  <span>OrbitDesk — Modern Workplace Operations Lab</span>
  </div>
  <span>© 2026 • Educational • Not affiliated with Microsoft</span>
  </div>
 </footer>
 </div>
 );
}
