'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPromptV2() {
 const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
 const [showPrompt, setShowPrompt] = useState(false);
 const [isInstalled, setIsInstalled] = useState(false);

 useEffect(() => {
 if (window.matchMedia('(display-mode: standalone)').matches) {
 setIsInstalled(true);
 }
 const handleBeforeInstall = (e: any) => {
 e.preventDefault();
 setDeferredPrompt(e);
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

 if (isInstalled) {
 return (
 <div className="flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
  Installed
 </div>
 );
 }

 return (
 <>
 {showPrompt && (
  <AnimatePresence>
  <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl flex items-center gap-3 max-w-[320px]"
  >
  <img src="/icon-512.png" alt="" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
  <div className="flex-1 min-w-0">
   <p className="font-medium text-[12px] text-white">Install OrbitDesk</p>
   <p className="text-[11px] text-zinc-500">Works offline, native notifications</p>
  </div>
  <button onClick={() => setShowPrompt(false)} className="h-7 px-2 rounded-full bg-zinc-800 text-zinc-400 text-[11px]">Later</button>
  <button onClick={handleInstall} className="h-7 px-3 rounded-full bg-white text-zinc-900 text-[11px] font-medium">Install</button>
  </motion.div>
  </AnimatePresence>
 )}
 </>
 );
}
