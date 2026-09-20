'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TURING_TEST_CRITERIA, ENIGMA_BREAKDOWN, COMPUTABILITY_ANALYSIS, calculateTuringTestScore, generateEnigmaVisualization, LEARNING_AI_COPILOT, CERT_MAPPING_TURING } from '@/lib/turingEngine';
import { Ticket } from '@/lib/ticketEngine';

export default function TuringLab({ ticket, history = [] }: { ticket?: Ticket; history?: any[] }) {
  const [activeCriteria, setActiveCriteria] = useState<'ticket' | 'persona' | 'voice'>('ticket');
  const criteria = TURING_TEST_CRITERIA[activeCriteria];
  const turingScore = ticket ? calculateTuringTestScore(ticket) : null;
  const enigma = ticket ? generateEnigmaVisualization(ticket) : null;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">🤖 Turing — Computability & Enigma & Learning AI</h3>
        <p className="text-[11px] text-zinc-500 mt-1">Can your simulation pass the Turing test? Troubleshooting as Enigma code-breaking, AI that learns</p>
        
        <div className="mt-4 flex gap-2">
          {(['ticket', 'persona', 'voice'] as const).map(c => (
            <button key={c} onClick={() => setActiveCriteria(c)} className={`h-7 px-3 rounded-full text-[11px] font-medium transition ${activeCriteria === c ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
              {c === 'ticket' ? '🎫 Ticket Test' : c === 'persona' ? '👥 Persona Test' : '📞 Voice Test'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-[12px] font-semibold text-zinc-100">{criteria.title}</h4>
        <p className="text-[11px] text-violet-300 mt-1">{criteria.orbitdeskScore}</p>
        <ul className="mt-3 space-y-1.5">
          {criteria.criteria.map((c, i) => (
            <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
              <span className="text-emerald-400">✓</span> {c}
            </li>
          ))}
        </ul>
        {'implementation' in criteria && (
          <p className="text-[10px] text-zinc-600 mt-2 font-mono">{(criteria as any).implementation}</p>
        )}
      </div>

      {turingScore !== null && (
        <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
          <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Turing Test Score — {ticket?.code}</h4>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-900 border-2 border-violet-500 flex items-center justify-center">
              <span className="text-[20px] font-bold text-white">{turingScore}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-zinc-100">{turingScore >= 80 ? 'Passes Turing Test' : turingScore >= 60 ? 'Almost Human' : 'Needs More Realism'}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{turingScore >= 80 ? 'Experts cannot distinguish from real Microsoft support case' : 'Add more real correlation IDs, error codes, user messages'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">{ENIGMA_BREAKDOWN.title}</h4>
        <p className="text-[11px] text-zinc-500 mt-1">{ENIGMA_BREAKDOWN.analogy}</p>
        <div className="mt-3 grid gap-2">
          {Object.entries(ENIGMA_BREAKDOWN.steps).map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <p className="text-[11px] font-medium text-zinc-300 capitalize">{k}</p>
              <p className="text-[11px] text-zinc-500 mt-1">{v}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-violet-300 mt-3">{ENIGMA_BREAKDOWN.orbitdesk}</p>
        <p className="text-[10px] text-zinc-600 mt-1 font-mono">{ENIGMA_BREAKDOWN.visualization}</p>
        {enigma && (
          <div className="mt-3 p-3 rounded-xl bg-[#050507] border border-zinc-800 font-mono text-[10px] text-zinc-400 whitespace-pre-wrap">
            {enigma}
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">{COMPUTABILITY_ANALYSIS.title}</h4>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-medium text-emerald-300">✓ Computable (Deterministic)</p>
            <ul className="mt-2 space-y-1">
              {COMPUTABILITY_ANALYSIS.computable.map((c, i) => (
                <li key={i} className="text-[11px] text-zinc-500">• {c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium text-amber-300">✦ Requires Human Intuition</p>
            <ul className="mt-2 space-y-1">
              {COMPUTABILITY_ANALYSIS.requiresHuman.map((c, i) => (
                <li key={i} className="text-[11px] text-zinc-500">• {c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-[11px] font-medium text-red-300">{COMPUTABILITY_ANALYSIS.haltingProblem.title}</p>
          <p className="text-[11px] text-zinc-400 mt-1">{COMPUTABILITY_ANALYSIS.haltingProblem.description}</p>
          <p className="text-[10px] text-zinc-600 mt-1">{COMPUTABILITY_ANALYSIS.haltingProblem.orbitdesk}</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-[12px] font-semibold text-zinc-100">{LEARNING_AI_COPILOT.title}</h4>
        <p className="text-[11px] text-zinc-500 mt-1">Before: {LEARNING_AI_COPILOT.before}</p>
        <p className="text-[11px] text-emerald-300 mt-1">After: {LEARNING_AI_COPILOT.after}</p>
        <ul className="mt-3 space-y-1.5">
          {LEARNING_AI_COPILOT.examples.map((ex, i) => (
            <li key={i} className="text-[11px] text-zinc-400">• {ex}</li>
          ))}
        </ul>
        <p className="text-[10px] text-zinc-600 mt-2">{LEARNING_AI_COPILOT.orbitdesk} — {LEARNING_AI_COPILOT.implementation}</p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Certification Mapping — Real Microsoft Certs</h4>
        <p className="text-[11px] text-zinc-500 mt-1">Turing would want verifiable skills mapping to real certs, not arbitrary levels</p>
        <div className="mt-3 grid gap-2">
          {Object.entries(CERT_MAPPING_TURING).map(([cert, desc]) => (
            <div key={cert} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-bold text-violet-300">{cert}</span>
              <span className="text-[11px] text-zinc-400 text-right max-w-[70%]">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
