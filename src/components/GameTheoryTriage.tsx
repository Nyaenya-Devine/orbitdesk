'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PAYOFF_MATRIX, calculateExpectedPayoff, minimaxTriage, calculateNashEquilibrium, selfReplicatingTickets, VON_NEUMANN_ARCHITECTURE, CELLULAR_AUTOMATA_TEAM } from '@/lib/vonNeumannEngine';
import { Ticket } from '@/lib/ticketEngine';

export default function GameTheoryTriage({ tickets, agents, weaknesses }: { tickets: Ticket[]; agents: any[]; weaknesses?: Record<string, number> }) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0] || null);
  const expectedPayoff = selectedTicket ? calculateExpectedPayoff(selectedTicket, agents.filter(a => a.currentTickets > 0).length, 75) : 0;
  const allocations = minimaxTriage(tickets, agents);
  const nash = calculateNashEquilibrium(tickets, agents);
  const replicating = selfReplicatingTickets(10, weaknesses || { BitLocker: 2, Entra: 1 }, true);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">♟️ von Neumann — Game Theory & Architecture</h3>
        <p className="text-[11px] text-zinc-500 mt-1">Ticket queue is zero-sum game vs time — minimax, Nash equilibrium, self-replicating lab</p>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Payoff Matrix — Game vs Time</h4>
        <div className="mt-3 grid gap-2">
          {Object.entries(PAYOFF_MATRIX).map(([key, val]: any) => (
            <div key={key} className="p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-zinc-200">{key}</p>
                <p className="text-[10px] text-zinc-500">{val.description}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-mono text-emerald-300">{val.payoff !== undefined ? `+${val.payoff}` : `${val.noBreach} / ${val.breach}`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Minimax Triage — Strategic Allocation</h4>
        <p className="text-[11px] text-zinc-500 mt-1">Minimize maximum loss — best agent to highest risk ticket, like chess 2 moves ahead</p>
        <div className="mt-3 space-y-2">
          {allocations.slice(0,5).map((alloc, idx) => (
            <motion.div key={alloc.ticketId} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx*0.05 }} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-zinc-200">{alloc.ticketId.substring(0,8)} → {alloc.agentId}</p>
                <p className="text-[10px] text-zinc-500">Expected payoff: {alloc.expectedPayoff.toFixed(1)} XP — force + gravity</p>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full ${alloc.expectedPayoff > 20 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>
                {alloc.expectedPayoff > 20 ? 'Optimal' : 'Risky'}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
          <p className="text-[11px] text-violet-300">Nash: {nash}</p>
        </div>
      </div>

      {selectedTicket && (
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Selected Ticket Game Analysis — {selectedTicket.code}</h4>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Expected Payoff</p>
              <p className="text-[20px] font-bold text-white mt-1">{expectedPayoff.toFixed(1)} XP</p>
              <p className="text-[10px] text-zinc-500">Prob success × payoff + prob breach × penalty</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Strategy</p>
              <p className="text-[11px] text-zinc-300 mt-1">{expectedPayoff > 20 ? 'Fix now — high payoff, low risk' : 'Escalate or allocate best agent — low payoff, high breach risk'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Self-Replicating Lab — Weakness-Based Generation</h4>
        <p className="text-[11px] text-zinc-500 mt-1">Lab evolves like cellular automata — generates more tickets of types you fail</p>
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-[11px] text-amber-300">Weaknesses detected: {Object.entries(weaknesses || {}).map(([k,v]) => `${k}:${v}`).join(', ') || 'BitLocker:2, Entra:1'}</p>
          <p className="text-[11px] text-zinc-400 mt-2">Next tickets (self-replicating):</p>
          <ul className="mt-1 space-y-1">
            {replicating.map((t, i) => (
              <li key={i} className="text-[11px] text-zinc-500">• {t}</li>
            ))}
          </ul>
        </div>
        <p className="text-[10px] text-zinc-600 mt-2">{VON_NEUMANN_ARCHITECTURE.orbitdesk}</p>
      </div>

      <div className="grid gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-[12px] font-semibold text-zinc-100">{VON_NEUMANN_ARCHITECTURE.title}</p>
          <p className="text-[11px] text-zinc-400 mt-1">Before: {VON_NEUMANN_ARCHITECTURE.before}</p>
          <p className="text-[11px] text-emerald-300 mt-1">After: {VON_NEUMANN_ARCHITECTURE.after}</p>
          <ul className="mt-2 space-y-1">
            {VON_NEUMANN_ARCHITECTURE.benefits.map((b, i) => (
              <li key={i} className="text-[11px] text-zinc-500">• {b}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-[12px] font-semibold text-zinc-100">{CELLULAR_AUTOMATA_TEAM.title}</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{CELLULAR_AUTOMATA_TEAM.description}</p>
          <p className="text-[10px] text-zinc-600 mt-1">{CELLULAR_AUTOMATA_TEAM.orbitdesk}</p>
        </div>
      </div>
    </div>
  );
}
