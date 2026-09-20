'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THOUGHT_EXPERIMENTS, EINSTEIN_FORMULAS, getRelativityClocks } from '@/lib/relativityEngine';

export default function EinsteinThoughtLab({ ticket, timeSpent = 2 }: { ticket?: any; timeSpent?: number }) {
  const [activeExperiment, setActiveExperiment] = useState<'policy' | 'device' | 'user'>('policy');
  const experiment = THOUGHT_EXPERIMENTS[activeExperiment];
  const clocks = ticket ? getRelativityClocks(ticket, timeSpent) : null;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">💡 Einstein — Thought Experiments & Relativity</h3>
        <p className="text-[11px] text-zinc-500 mt-1">Imagination is more important than knowledge — what if you ARE the CA policy, the device, the user?</p>
        
        <div className="mt-4 flex gap-2">
          {(['policy', 'device', 'user'] as const).map(exp => (
            <button key={exp} onClick={() => setActiveExperiment(exp)} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${activeExperiment === exp ? 'bg-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
              {exp === 'policy' ? '🛡️ You are CA Policy' : exp === 'device' ? '💻 You are Device' : '👤 You are Sarah'}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeExperiment} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
          <h4 className="text-[13px] font-semibold text-zinc-100">{experiment.title}</h4>
          <p className="text-[11px] text-violet-300 mt-1">Persona: {experiment.persona}</p>
          <p className="text-[12px] text-zinc-300 mt-3 leading-relaxed">{experiment.scenario}</p>
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[11px] font-medium text-amber-300">Question: {experiment.question}</p>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[11px] text-emerald-300">Insight: {experiment.insight}</p>
          </div>
          <div className="mt-3 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800">
            <p className="text-[11px] font-mono text-zinc-400">OrbitDesk: {experiment.orbitdeskAction}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {clocks && (
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Relativity of Time — 3 Clocks</h4>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {Object.entries(clocks).map(([key, clock]) => (
              <div key={key} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">{clock.label}</p>
                <p className="text-[14px] font-bold text-white mt-1">{clock.time}</p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{clock.feeling}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-600 mt-3">Einstein: User time, system time, admin time are relative — like relativity, different frames of reference</p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">E=mc² Simplicity — Complex Made Simple</h4>
        <div className="mt-3 grid gap-3">
          {Object.entries(EINSTEIN_FORMULAS).map(([key, f]) => (
            <div key={key} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[12px] font-semibold text-zinc-100">{f.title}</p>
              <p className="text-[11px] font-mono text-violet-300 mt-1 p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800">{f.formula}</p>
              <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">{f.breakdown}</p>
              <p className="text-[10px] text-zinc-600 mt-1">{f.orbitdesk}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
