'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Check if desktop via Electron
    if ((window as any).orbitdesk?.isDesktop) {
      setIsDesktop(true);
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after 3 seconds if not installed
      setTimeout(() => {
        if (!isInstalled) setShowPrompt(true);
      }, 3000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('orbitdesk-installable', (e: any) => {
      setDeferredPrompt(e.detail);
      setShowPrompt(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Show again after 1 hour
    setTimeout(() => {
      if (!isInstalled && deferredPrompt) setShowPrompt(true);
    }, 3600000);
  };

  if (isInstalled) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="font-medium text-emerald-800">
          {isDesktop ? '🖥️ Desktop App • OrbitDesk v2.0 • Voice Calls • Encrypted RDP • Offline Ready' : '📱 Installed • PWA • Offline • Voice Calls • Desktop-like'}
        </span>
      </div>
    );
  }

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl p-3 flex items-center justify-between shadow-lg shadow-violet-600/20 animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">◍</div>
        <div>
          <div className="font-bold text-sm">Install OrbitDesk — Desktop App</div>
          <div className="text-xs opacity-90">Real voice calls, remote PC, offline, notifications for P1, ⌘K — Feels like native app</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleDismiss} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs">Later</button>
        <button onClick={handleInstall} className="px-4 py-1.5 bg-white text-violet-700 rounded-full text-xs font-bold hover:bg-zinc-100">Install →</button>
      </div>
    </div>
  );
}
