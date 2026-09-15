'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getLevelInfo } from '@/lib/progressEngine';
import Logo from './Logo';

interface Props {
 oldLevel: number;
 newLevel: number;
 xp: number;
 ticketsResolved: number;
 onClose: () => void;
}

export default function LevelUpCelebration({ oldLevel, newLevel, xp, ticketsResolved, onClose }: Props) {
 const [showConfetti, setShowConfetti] = useState(true);
 const oldInfo = getLevelInfo(oldLevel);
 const newInfo = getLevelInfo(newLevel);

 useEffect(() => {
  const timer = setTimeout(() => setShowConfetti(false), 4000);
  return () => clearTimeout(timer);
 }, []);

 // Play level up sound via Web Audio
 useEffect(() => {
  try {
   const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
   const playTone = (freq: number, delay: number, duration: number) => {
    setTimeout(() => {
     try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
     } catch {}
    }, delay);
   };
   // OrbitDesk level up melody — C4 E4 G4 C5 E5 (ascending orbit)
   playTone(261.63, 0, 0.3);
   playTone(329.63, 150, 0.3);
   playTone(392.00, 300, 0.3);
   playTone(523.25, 450, 0.4);
   playTone(659.25, 600, 0.6);
   setTimeout(() => { try { ctx.close(); } catch {} }, 2000);
  } catch {}
 }, []);

 return (
  <AnimatePresence>
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
    onClick={onClose}
   >
    {/* Confetti */}
    {showConfetti && (
     <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
       <motion.div
        key={i}
        initial={{ y: -20, x: Math.random() * window.innerWidth, rotate: 0, opacity: 1 }}
        animate={{ y: window.innerHeight + 100, rotate: 360 * (Math.random() > 0.5 ? 1 : -1), opacity: 0 }}
        transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5, ease: "easeOut" }}
        className="absolute w-3 h-3 rounded-full"
        style={{
         background: ['#7c3aed', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 6)],
         left: `${Math.random() * 100}%`,
        }}
       />
      ))}
     </div>
    )}

    <motion.div
     initial={{ scale: 0.8, y: 40, opacity: 0 }}
     animate={{ scale: 1, y: 0, opacity: 1 }}
     exit={{ scale: 0.8, y: 40, opacity: 0 }}
     transition={{ type: "spring", damping: 20, stiffness: 300 }}
     className="relative bg-[#0a0a0a] rounded-[32px] shadow-2xl max-w-[440px] w-full overflow-hidden border border-zinc-800"
     onClick={(e) => e.stopPropagation()}
    >
     {/* Header gradient — M365 livery */}
     <div className="relative bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-center overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
       animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
       className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
      />
      <motion.div
       animate={{ scale: [1, 1.3, 1], x: [0, -15, 0] }}
       transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
       className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />

      <div className="relative">
       {/* Orbit animation — core OrbitDesk visual */}
       <div className="relative w-28 h-28 mx-auto mb-5">
        {/* Wooden stand base */}
        <motion.div
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ delay: 0.2, type: "spring" }}
         className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full shadow-lg"
        >
         <div className="absolute inset-x-1 top-0 h-[2px] bg-amber-700/50 rounded-full" />
        </motion.div>
        
        {/* PC Desk */}
        <motion.div
         initial={{ y: 20, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.3 }}
         className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg border border-zinc-700 shadow-xl flex items-center justify-center"
        >
         <div className="w-14 h-9 bg-[#050507] rounded border border-zinc-800 flex items-center justify-center">
          <span className="text-[10px]">🖥️</span>
         </div>
         {/* Wood grain */}
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900/30 via-amber-800/50 to-amber-900/30 rounded-b-lg" />
        </motion.div>

        {/* Orbit rings — based on level */}
        {Array.from({ length: newInfo.orbitRings }).map((_, i) => (
         <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 - i * 0.1 }}
          transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-violet-400/30 rounded-full"
          style={{
           width: `${48 + i * 18}px`,
           height: `${28 + i * 10}px`,
           transform: `translate(-50%, -50%) rotateX(65deg) rotateZ(${i * 15}deg)`,
          }}
         />
        ))}

        {/* Orbiting dots */}
        <motion.div
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="absolute top-1/2 left-1/2 w-[64px] h-[32px] -translate-x-1/2 -translate-y-1/2"
         style={{ transformOrigin: "center" }}
        >
         <div className="absolute -top-1 left-0 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow shadow-emerald-400/50 border border-white/20" />
         <div className="absolute -bottom-1 right-0 w-2 h-2 bg-violet-400 rounded-full shadow shadow-violet-400/50 border border-white/20" />
        </motion.div>

        <motion.div
         animate={{ rotate: -360 }}
         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         className="absolute top-1/2 left-1/2 w-[84px] h-[40px] -translate-x-1/2 -translate-y-1/2"
        >
         <div className="absolute top-0 right-1 w-2 h-2 bg-blue-400 rounded-full shadow shadow-blue-400/50" />
        </motion.div>

        {/* Center logo */}
        <motion.div
         initial={{ scale: 0 }}
         animate={{ scale: 1 }}
         transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
         className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
         <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center ring-4 ring-white/20">
          <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span className="absolute text-[10px]">◍</span>
         </div>
        </motion.div>
       </div>

       <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
       >
        <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/70 uppercase">Level Up!</h2>
        <div className="flex items-center justify-center gap-3 mt-2">
         <span className="text-[14px] px-2.5 py-1 rounded-full bg-white/15 border border-white/20 font-mono">Lvl {oldLevel}</span>
         <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-white/80"
         >
          →
         </motion.span>
         <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="text-[20px] font-black px-3 py-1 rounded-full bg-white text-violet-700 shadow-lg"
         >
          Lvl {newLevel}
         </motion.span>
        </div>
        <h3 className="text-[22px] font-bold text-white mt-3 tracking-tight">{newInfo.title}</h3>
        <p className="text-[13px] text-white/70 mt-1">{newInfo.description}</p>
       </motion.div>
      </div>
     </div>

     <div className="p-6 bg-[#0a0a0a] space-y-4">
      {/* XP Progress */}
      <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
       <div className="flex justify-between text-[11px] mb-2">
        <span className="text-zinc-500">Progress</span>
        <span className="text-zinc-300 font-mono">{xp} XP • {ticketsResolved} tickets solved</span>
       </div>
       <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
         initial={{ width: 0 }}
         animate={{ width: `${xp % 100}%` }}
         transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
         className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
        />
       </div>
       <p className="text-[10px] text-zinc-600 mt-2">{100 - (xp % 100)} XP to Level {newLevel + 1} • Orbit expanding</p>
      </div>

      {/* Unlocks */}
      <div>
       <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-2 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
        Unlocked at Lvl {newLevel}
       </p>
       <div className="space-y-2">
        {newInfo.unlocks.map((unlock, i) => (
         <motion.div
          key={i}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.1 }}
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10"
         >
          <div className="h-6 w-6 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
           <span className="text-[11px]">{i === 0 ? '🔓' : i === 1 ? '📈' : '🎯'}</span>
          </div>
          <span className="text-[12px] text-zinc-300">{unlock}</span>
         </motion.div>
        ))}
       </div>
      </div>

      {/* Difficulty scaling explanation */}
      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
       <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">⚡ OrbitDesk Progression — Real MSP</p>
       <p className="text-[11px] text-zinc-400 mt-1 leading-[1.4]">
        Tickets get harder as you solve more — like real helpdesk. 
        {newLevel < 3 ? ' Started with beginner (MFA, DeviceCap). Next: intermediate CA, BitLocker.' : 
         newLevel < 5 ? ' Now intermediate (CA, enrollment). Next: advanced location, account lock, MDM authority.' :
         newLevel < 8 ? ' Advanced unlocked! Next: expert SSO, Autopilot TPM, mail flow down, P1 10-15%.' :
         ' Expert mode! All tickets, recurring 35%, tighter SLAs, P1 15% — Team Lead pressure.'}
       </p>
      </div>

      <button
       onClick={onClose}
       className="w-full h-11 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-[13px] shadow-lg transition-colors flex items-center justify-center gap-2"
      >
       <span>Continue Orbit</span>
       <span className="h-5 w-5 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px]">→</span>
      </button>

      <p className="text-[10px] text-zinc-600 text-center">OrbitDesk — Your orbit expands with each level • {newInfo.orbitRings} orbit rings • {ticketsResolved} solved</p>
     </div>
    </motion.div>
   </motion.div>
  </AnimatePresence>
 );
}
