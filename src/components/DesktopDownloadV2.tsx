'use client';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function DesktopDownloadV2() {
 const [isInstalled, setIsInstalled] = useState(false);

 useEffect(() => {
 if (window.matchMedia('(display-mode: standalone)').matches) {
 setIsInstalled(true);
 }
 }, []);

 return (
 <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
 <div className="p-5">
  <div className="flex items-start gap-3">
  <Logo variant="icon" size={36} />
  <div>
  <h3 className="font-semibold text-[14px] text-white">Install as App</h3>
  <p className="text-[12px] text-zinc-500 mt-1">Works offline with native notifications. Available for Windows, macOS, Linux, and Android.</p>
  </div>
  <span className={`ml-auto text-[11px] px-2.5 py-1 rounded-full border ${isInstalled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
  {isInstalled ? 'Installed' : 'Browser'}
  </span>
  </div>

  <div className="mt-4 grid grid-cols-2 gap-2">
  <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
  <p className="text-[11px] font-medium text-white">PWA — Recommended</p>
  <p className="text-[11px] text-zinc-500 mt-1">1-click install from browser, 1.2MB, offline, auto-updates</p>
  </div>
  <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
  <p className="text-[11px] font-medium text-white">Stores</p>
  <p className="text-[11px] text-zinc-500 mt-1">Play Store via TWA, Microsoft Store via PWA</p>
  </div>
  </div>

  <div className="mt-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-800">
  <p className="text-[11px] text-zinc-400">For store publishing: Use PWABuilder.com to package PWA for Google Play (TWA) and Microsoft Store. Electron build available for Windows Store via MSIX.</p>
  </div>
 </div>
 </div>
 );
}
