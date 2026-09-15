'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLevelInfo } from '@/lib/progressEngine';

interface Props {
 isPaused: boolean;
 isManual: boolean;
 ticketsResolved: number;
 level: number;
 xp: number;
 pendingCount: number;
 awayMinutes: number;
 onTogglePause: () => void;
}

export default function ShiftStatus({ isPaused, isManual, ticketsResolved, level, xp, pendingCount, awayMinutes, onTogglePause }: Props) {
 const [shiftTime, setShiftTime] = useState(0);
 const levelInfo = getLevelInfo(level);

 useEffect(() => {
 if (isPaused) return;
 const interval = setInterval(() => setShiftTime(s => s + 1), 1000);
 return () => clearInterval(interval);
 }, [isPaused]);

 const formatShift = (s: number) => {
 const h = Math.floor(s / 3600);
 const m = Math.floor((s % 3600) / 60);
 const sec = s % 60;
 if (h > 0) return `${h}h ${m}m ${sec}s`;
 return `${m}m ${sec}s`;
 };

 return (
 <div className="grid grid-cols-12 gap-3">
  {/* Shift Card */}
  <div className={`col-span-12 lg:col-span-5 rounded-2xl border p-4 ${isPaused ? 'bg-amber-500/5 border-amber-500/20' : 'bg-[#0a0a0a]/80 backdrop-blur border-zinc-800/60'}`}>
   <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5">
     <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${isPaused ? 'bg-amber-500/15 border-amber-500/20' : 'bg-emerald-500/15 border-emerald-500/20'}`}>
      <span className={`h-2 w-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
     </div>
     <div>
      <p className="text-[12px] font-bold text-white flex items-center gap-1.5">
       {isPaused ? '⏸️ Shift Paused' : '● Shift Active'} 
       <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${isPaused ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>
        {isPaused ? (isManual ? 'On Break' : `Away ${awayMinutes}m`) : 'Live'}
       </span>
      </p>
      <p className="text-[11px] text-zinc-500">{isPaused ? 'SLA paused • Team covering • No breach' : `On shift ${formatShift(shiftTime)} • Orbit ${levelInfo.orbitRings} rings • Real MSP`}</p>
     </div>
    </div>
    <button onClick={onTogglePause} className={`h-8 px-3 rounded-full text-[11px] font-bold border transition ${isPaused ? 'bg-amber-500 text-zinc-900 border-amber-500 hover:bg-amber-400' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}>
     {isPaused ? '▶️ Resume' : '⏸️ Break'}
    </button>
   </div>

   <div className="mt-3 grid grid-cols-3 gap-2">
    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
     <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Resolved Today</p>
     <p className="text-[16px] font-bold text-white mt-0.5">{ticketsResolved}</p>
     <p className="text-[10px] text-zinc-500">This shift</p>
    </div>
    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
     <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Pending</p>
     <p className="text-[16px] font-bold text-white mt-0.5">{pendingCount}</p>
     <p className="text-[10px] text-zinc-500">{isPaused ? 'On hold' : 'Live queue'}</p>
    </div>
    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
     <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Shift Time</p>
     <p className="text-[14px] font-bold text-white mt-0.5 font-mono">{formatShift(shiftTime)}</p>
     <p className="text-[10px] text-zinc-500">{isPaused ? 'Paused' : 'Counting'}</p>
    </div>
   </div>

   {isPaused && (
    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
     <p className="text-[11px] text-amber-200/80 leading-[1.4]">🔒 <strong>Realistic:</strong> When you step away, Orbit pauses. In real MSP, your lead would say "Take a break, we got coverage". Your SLAs don't breach while you're away — that's fair for learning. When you return, you get handover of what arrived.</p>
    </motion.div>
   )}
  </div>

  {/* Level Progress Orbit */}
  <div className="col-span-12 lg:col-span-7 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur border border-zinc-800/60 p-4">
   <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
     <div className="relative w-12 h-12">
      <div className="absolute inset-0 rounded-full border border-zinc-800" />
      {Array.from({ length: levelInfo.orbitRings }).map((_, i) => (
       <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
        <div className="absolute w-1.5 h-1.5 bg-violet-500 rounded-full" style={{ top: `${10 + i * 8}%`, left: '50%' }} />
       </motion.div>
      ))}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[11px]">Lvl {level}</div>
     </div>
     <div>
      <p className="text-[12px] font-bold text-white">{levelInfo.title} • Lvl {level}</p>
      <p className="text-[11px] text-zinc-500">{levelInfo.description} • {xp} XP • {ticketsResolved} solved</p>
     </div>
    </div>
    <div className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{levelInfo.orbitRings} orbit rings • {ticketsResolved < 5 ? 'Beginner' : ticketsResolved < 10 ? 'Intermediate' : ticketsResolved < 20 ? 'Advanced' : 'Expert'} pool</div>
   </div>

   <div className="space-y-2">
    <div className="flex justify-between text-[11px]">
     <span className="text-zinc-500">Level {level} → {level + 1}</span>
     <span className="text-zinc-300 font-mono">{xp % 100}/100 XP • {100 - (xp % 100)} to next</span>
    </div>
    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
     <motion.div initial={{ width: 0 }} animate={{ width: `${xp % 100}%` }} className="h-full bg-gradient-to-r from-violet-600 to-indigo-600" />
    </div>
    <div className="flex gap-1.5 flex-wrap">
     {levelInfo.unlocks.map((u, i) => (
      <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{u}</span>
     ))}
    </div>
   </div>

   <div className="mt-3 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
    <p className="text-[11px] font-bold text-zinc-300">Progression — Real MSP Growth</p>
    <div className="mt-2 grid grid-cols-4 gap-1.5 text-[10px]">
     <div className={`p-2 rounded-lg border text-center ${ticketsResolved < 5 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>0-4<br/>Beginner</div>
     <div className={`p-2 rounded-lg border text-center ${ticketsResolved >= 5 && ticketsResolved < 20 ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>5-19<br/>Inter + Adv</div>
     <div className={`p-2 rounded-lg border text-center ${ticketsResolved >= 20 && ticketsResolved < 35 ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>20-34<br/>Adv + Expert</div>
     <div className={`p-2 rounded-lg border text-center ${ticketsResolved >= 35 ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>35+<br/>Expert</div>
    </div>
    <p className="text-[10px] text-zinc-600 mt-2">Harder tickets, more P1s, tighter SLAs as you level — like real helpdesk. P1 3%→15%, SLA 100%→70%, recurring 20%→35%</p>
   </div>
  </div>
 </div>
 );
}
