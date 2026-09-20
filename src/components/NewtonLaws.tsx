'use client';
import { motion } from 'framer-motion';
import { NEWTON_LAWS, calculateForce, calculateGravityScore, breakdownFirstPrinciples } from '@/lib/newtonEngine';
import { Ticket } from '@/lib/ticketEngine';

export default function NewtonLaws({ ticket, allTickets }: { ticket?: Ticket; allTickets?: Ticket[] }) {
  if (!ticket) {
    return (
      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[14px] font-bold text-zinc-100 flex items-center gap-2">🍎 Newton — First Principles & Laws</h3>
        <p className="text-[11px] text-zinc-500 mt-2">Select a ticket to see Newton's laws applied: F=P×(1/t), gravity triage, predictive breach calculus</p>
        <div className="mt-4 grid gap-3">
          {Object.entries(NEWTON_LAWS).map(([key, law]) => (
            <div key={key} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[12px] font-semibold text-zinc-200">{law.title}</p>
              <p className="text-[11px] text-zinc-400 mt-1">{law.statement}</p>
              <p className="text-[10px] font-mono text-violet-300 mt-1">{law.formula}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const force = calculateForce(ticket);
  const gravity = calculateGravityScore(ticket, allTickets || []);
  const principles = breakdownFirstPrinciples(ticket);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">🍎 Newton — Laws Applied to {ticket.code}</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-[10px] tracking-widest text-violet-300 uppercase">Force F=P×(1/t)</p>
            <p className="text-[20px] font-bold text-white mt-1">{force.toFixed(1)}</p>
            <p className="text-[10px] text-zinc-500">Mass {ticket.priority} / {Math.floor(ticket.timeLeftMs/60000)}m</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[10px] tracking-widest text-emerald-300 uppercase">Gravity Score</p>
            <p className="text-[20px] font-bold text-white mt-1">{gravity.toFixed(2)}</p>
            <p className="text-[10px] text-zinc-500">(Mass×Impact)/Distance²</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-[10px] tracking-widest text-amber-300 uppercase">Predictive Breach</p>
            <p className="text-[20px] font-bold text-white mt-1">{Math.min(100, Math.round(force*2))}%</p>
            <p className="text-[10px] text-zinc-500">∫(P×C×Load)dt</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {Object.entries(NEWTON_LAWS).map(([key, law], idx) => (
          <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx*0.05, type: 'spring', stiffness: 300, damping: 25 }} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <p className="text-[12px] font-semibold text-zinc-100">{law.title}</p>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{law.statement}</p>
            <p className="text-[10px] font-mono text-violet-300 mt-2 p-2 rounded-lg bg-[#0a0a0a] border border-zinc-800">{law.formula}</p>
            <p className="text-[11px] text-zinc-500 mt-2">OrbitDesk: {law.orbitdesk}</p>
            <p className="text-[10px] text-zinc-600 mt-1 italic">Ex: {law.example}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">First Principles Breakdown — {ticket.code}</h4>
        <div className="mt-3 space-y-2">
          {Object.entries(principles).map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-300 capitalize">{k}</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
