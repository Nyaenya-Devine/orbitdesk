'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAUpdatePrompt() {
 const [showUpdate, setShowUpdate] = useState(false);
 const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
 const refreshing = useRef(false);

 useEffect(() => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  let updateTimer: ReturnType<typeof setInterval> | undefined;
  let registration: ServiceWorkerRegistration | undefined;

  const onUpdateFound = () => {
   const newWorker = registration?.installing;
   if (!newWorker) return;
   newWorker.addEventListener('statechange', () => {
    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
     setWaitingWorker(newWorker);
     setShowUpdate(true);
    }
   });
  };

  const onControllerChange = () => {
   if (refreshing.current) return;
   refreshing.current = true;
   window.location.reload();
  };

  const checkOnReturn = () => {
   if (document.visibilityState === 'visible') registration?.update().catch(() => {});
  };

  navigator.serviceWorker.register('/sw.js').then((reg) => {
   registration = reg;
   reg.addEventListener('updatefound', onUpdateFound);
   updateTimer = setInterval(() => reg.update().catch(() => {}), 60_000);
   if (reg.waiting) {
    setWaitingWorker(reg.waiting);
    setShowUpdate(true);
   }
  }).catch(() => {});

  navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
  document.addEventListener('visibilitychange', checkOnReturn);

  return () => {
   if (updateTimer) clearInterval(updateTimer);
   registration?.removeEventListener('updatefound', onUpdateFound);
   navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
   document.removeEventListener('visibilitychange', checkOnReturn);
  };
 }, []);

 const applyUpdate = () => {
  if (waitingWorker) waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  else window.location.reload();
  setShowUpdate(false);
 };

 return (
  <AnimatePresence>
   {showUpdate && (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[150] max-w-[420px] w-[92%] bg-[#0a0a0a] border border-violet-500/30 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
     <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0"><span className="text-white">↻</span></div>
     <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-white">OrbitDesk update ready</p>
      <p className="text-[11px] text-zinc-400 mt-0.5">Reload to use the latest workspace. Your local progress is preserved.</p>
     </div>
     <div className="flex flex-col gap-1.5 flex-shrink-0">
      <button onClick={applyUpdate} className="h-8 px-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-bold transition">Reload</button>
      <button onClick={() => setShowUpdate(false)} className="h-6 px-3 rounded-full bg-zinc-800 text-zinc-400 text-[10px] hover:bg-zinc-700">Later</button>
     </div>
    </motion.div>
   )}
  </AnimatePresence>
 );
}
