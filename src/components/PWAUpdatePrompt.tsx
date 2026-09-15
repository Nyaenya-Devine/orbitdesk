'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAUpdatePrompt() {
 const [showUpdate, setShowUpdate] = useState(false);
 const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

 useEffect(() => {
 if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

 const handleUpdate = () => {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
   // Check for updates every 60s + on visibility change
   setInterval(() => reg.update().catch(()=>{}), 60 * 1000);

   reg.addEventListener('updatefound', () => {
    const newWorker = reg.installing;
    if (!newWorker) return;
    newWorker.addEventListener('statechange', () => {
     if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
      // New version available
      console.log('[OrbitDesk] New version found');
      setWaitingWorker(newWorker);
      setShowUpdate(true);
     }
    });
   });

   // If there's already a waiting worker (user opened tab after deploy)
   if (reg.waiting) {
    setWaitingWorker(reg.waiting);
    setShowUpdate(true);
   }
  }).catch(()=>{});

  // Listen for controller change — reload when new SW takes over
  navigator.serviceWorker.addEventListener('controllerchange', () => {
   console.log('[OrbitDesk] New SW controlling — reloading');
   window.location.reload();
  });
 };

 handleUpdate();

 // Also check when tab becomes visible (user returns to app)
 document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
   navigator.serviceWorker.getRegistration().then((reg) => reg?.update().catch(()=>{}));
  }
 });
 }, []);

 const applyUpdate = () => {
 if (waitingWorker) {
  waitingWorker.postMessage({ type: 'SKIP_WAITING' });
 } else {
  // Fallback — hard reload
  window.location.reload();
 }
 // Also try to claim immediately
 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration().then((reg) => {
   reg?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
 }
 setShowUpdate(false);
 };

 return (
 <AnimatePresence>
  {showUpdate && (
   <motion.div
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] max-w-[420px] w-[92%] bg-[#0a0a0a] border border-violet-500/30 rounded-2xl shadow-2xl p-4 flex items-center gap-3"
   >
    <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
     <span className="text-white">🚀</span>
    </div>
    <div className="flex-1 min-w-0">
     <p className="text-[13px] font-semibold text-white">New OrbitDesk version available!</p>
     <p className="text-[11px] text-zinc-400 mt-0.5">We fixed call button + added difficulty progression + level up animation. Update now — no uninstall needed.</p>
    </div>
    <div className="flex flex-col gap-1.5 flex-shrink-0">
     <button onClick={applyUpdate} className="h-8 px-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-bold transition">
      Update Now
     </button>
     <button onClick={() => setShowUpdate(false)} className="h-6 px-3 rounded-full bg-zinc-800 text-zinc-400 text-[10px] hover:bg-zinc-700">
      Later
     </button>
    </div>
   </motion.div>
  )}
 </AnimatePresence>
 );
}
