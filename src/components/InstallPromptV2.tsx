'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function InstallPromptV2() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [os, setOs] = useState<'windows' | 'mac' | 'linux' | 'unknown'>('unknown');

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('win')) setOs('windows');
    else if (ua.includes('mac')) setOs('mac');
    else if (ua.includes('linux')) setOs('linux');

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        if (!isInstalled) setShowPrompt(true);
      }, 4000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Show how to install like APK on PC — real instructions, not basic
      alert(
        `How to install OrbitDesk on ${os} like APK on Android:\n\n` +
        `Windows Chrome/Edge: Click ⋮ Menu → Install OrbitDesk → Install → Launches from Start menu, offline, native notifications\n` +
        `Mac Chrome: ⋮ Menu → Install → Drag to Dock\n` +
        `Mac Safari (Sonoma+): File → Add to Dock\n` +
        `Linux Chrome: ⋮ Menu → Install\n\n` +
        `PWA is 1-click, 89MB smaller than Electron, no build, feels like Slack/VS Code.`
      );
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Installed • PWA • Offline • Real Voice • {os}
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 flex items-center justify-between shadow-2xl max-w-md"
      >
        <div className="flex items-center gap-3">
          <Logo variant="icon" size={36} animated />
          <div>
            <div className="font-semibold text-[13px] text-zinc-100">Install OrbitDesk — Like APK on PC</div>
            <div className="text-[11px] text-zinc-500 leading-[1.3]">PWA 1-click • Offline • Native P1 notifications • Real voice • No build • 89MB smaller</div>
            <div className="text-[10px] text-zinc-600 mt-1">{os} • {deferredPrompt ? 'Ready to install' : 'Chrome/Edge → Menu → Install'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button onClick={() => setShowPrompt(false)} className="h-8 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-400 transition">Later</button>
          <button onClick={handleInstall} className="h-8 px-4 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[11px] font-semibold transition">Install →</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
