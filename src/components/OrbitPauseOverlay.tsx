'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

interface Props {
 isPaused: boolean;
 isManual: boolean;
 awayMinutes: number;
 pendingCount: number;
 onResume: () => void;
}

export default function OrbitPauseOverlay({ isPaused, isManual, awayMinutes, pendingCount, onResume }: Props) {
 if (!isPaused) return null;

 return (
 <AnimatePresence>
  <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
   className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
  >
   <motion.div
    initial={{ scale: 0.9, y: 20 }}
    animate={{ scale: 1, y: 0 }}
    className="bg-[#0a0a0a] rounded-[24px] border border-zinc-800 shadow-2xl max-w-[380px] w-full p-6 text-center"
   >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
     <Logo variant="icon" size={28} />
     <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 rounded-full border border-amber-500/30" />
    </div>
    
    <h3 className="text-[16px] font-bold text-white flex items-center justify-center gap-2">
     <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
     Orbit On Hold
    </h3>
    <p className="text-[12px] text-zinc-500 mt-1">
     {isManual ? 'You paused your shift — realistic MSP break' : `You were away ${awayMinutes}m — orbit paused automatically`}
    </p>

    <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-left space-y-2">
     <div className="flex justify-between text-[11px]"><span className="text-zinc-500">SLA Timers</span><span className="text-amber-300">⏸️ Paused</span></div>
     <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Ticket Generation</span><span className="text-amber-300">⏸️ Paused</span></div>
     <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Call Queue</span><span className="text-amber-300">⏸️ Paused</span></div>
     <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Pending Tickets</span><span className="text-zinc-200">{pendingCount} waiting for you</span></div>
     <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Team</span><span className="text-zinc-400">Covering — no breach while away</span></div>
    </div>

    <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10 text-left">
     <p className="text-[11px] font-bold text-violet-300">Real MSP Feel</p>
     <p className="text-[11px] text-zinc-400 mt-1 leading-[1.4]">
      In real helpdesk, when you go on break / close laptop, your queue is put on hold. Other agents cover, but your tickets don't breach unfairly. When you return, you get handover.
     </p>
    </div>

    <button onClick={onResume} className="w-full mt-4 h-10 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-[13px] transition">
     ▶️ Resume Orbit — Continue Shift
    </button>
    <p className="text-[10px] text-zinc-600 mt-2">Your SLAs were protected while away • No breach • Realistic</p>
   </motion.div>
  </motion.div>
 </AnimatePresence>
 );
}

export function AwayWelcomeBack({ awayMinutes, ticketsAdded, onClose }: { awayMinutes: number; ticketsAdded: number; onClose: () => void }) {
 const [show, setShow] = useState(true);
 useEffect(() => {
  const t = setTimeout(() => setShow(false), 8000);
  return () => clearTimeout(t);
 }, []);

 if (awayMinutes < 1) return null;

 return (
 <AnimatePresence>
  {show && (
   <motion.div
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -20, opacity: 0 }}
    className="fixed top-20 left-1/2 -translate-x-1/2 z-[130] bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-2xl p-4 max-w-[380px] w-[90%] flex gap-3"
   >
    <div className="h-10 w-10 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">👋</div>
    <div className="flex-1 min-w-0">
     <p className="text-[13px] font-semibold text-white">Welcome back! You were away {awayMinutes}m</p>
     <p className="text-[11px] text-zinc-400 mt-1">Orbit was on hold — {ticketsAdded} new tickets arrived while away, 0 breached. Your SLAs were protected. Ready to continue?</p>
     <div className="mt-2 flex gap-2">
      <button onClick={() => { setShow(false); onClose(); }} className="h-7 px-3 rounded-full bg-zinc-100 text-zinc-900 text-[11px] font-bold">Continue Shift →</button>
      <button onClick={() => setShow(false)} className="h-7 px-3 rounded-full bg-zinc-800 text-zinc-400 text-[11px]">Dismiss</button>
     </div>
    </div>
   </motion.div>
  )}
 </AnimatePresence>
 );
}
