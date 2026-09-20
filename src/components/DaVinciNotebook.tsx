'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ANATOMICAL_LAYERS, GOLDEN_RATIO_AGENT, calculateGoldenRatioScore, DAVINCI_NOTEBOOK_PROMPTS, generateDaVinciObservation } from '@/lib/daVinciEngine';

export default function DaVinciNotebook({ ticket, portalLog = [], scores }: { ticket?: any; portalLog?: string[]; scores?: any }) {
  const [activeLayer, setActiveLayer] = useState<'skeleton' | 'muscle' | 'nervous' | 'circulatory' | 'injury'>('skeleton');
  const layer = ANATOMICAL_LAYERS[activeLayer];
  const goldenScore = scores ? calculateGoldenRatioScore(scores) : null;

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h3 className="text-[13px] font-bold text-zinc-100 flex items-center gap-2">🎨 Da Vinci — Visual Anatomy & Notebook</h3>
        <p className="text-[11px] text-zinc-500 mt-1">You cannot fix what you cannot draw — OU tree is skeleton, CA is muscle, GPO is nervous system, tickets are injuries</p>
        
        <div className="mt-4 flex gap-1.5 flex-wrap">
          {Object.keys(ANATOMICAL_LAYERS).map(l => (
            <button key={l} onClick={() => setActiveLayer(l as any)} className={`h-7 px-3 rounded-full text-[11px] font-medium transition ${activeLayer === l ? 'bg-violet-600 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
              {l === 'skeleton' ? '🦴 Skeleton OU' : l === 'muscle' ? '💪 Muscle CA' : l === 'nervous' ? '🧠 Nervous GPO' : l === 'circulatory' ? '🫀 Circulatory Intune' : '🩹 Injury Ticket'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h4 className="text-[13px] font-semibold text-zinc-100">{layer.title}</h4>
        <p className="text-[12px] text-zinc-300 mt-2 leading-relaxed">{layer.description}</p>
        <p className="text-[11px] text-violet-300 mt-3">OrbitDesk: {layer.orbitdesk}</p>
        <div className="mt-3 p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800 border-dashed">
          <p className="text-[11px] font-mono text-zinc-500">Sketch prompt: {layer.drawing}</p>
        </div>
        <div className="mt-4 h-[160px] rounded-xl bg-[#050507] border border-zinc-800 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, #27272a 20px, #27272a 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, #27272a 20px, #27272a 21px)` }} />
          <p className="text-[11px] text-zinc-600 relative">Canvas — draw {activeLayer} anatomy here (Da Vinci notebook style)</p>
          <div className="absolute bottom-2 right-2 text-[9px] text-zinc-700 font-mono">{"Mirror: }oofnI-tseT{ → Test-Info"}</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Vitruvian Agent — Golden Ratio φ=1.618</h4>
        <p className="text-[11px] text-zinc-500 mt-1">{GOLDEN_RATIO_AGENT.description}</p>
        <p className="text-[10px] font-mono text-violet-300 mt-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">{GOLDEN_RATIO_AGENT.formula}</p>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {Object.entries(GOLDEN_RATIO_AGENT.perfectProportions).map(([k, v]) => (
            <div key={k} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">{k}</p>
              <p className="text-[14px] font-bold text-white mt-1">{v}%</p>
            </div>
          ))}
        </div>
        {goldenScore !== null && (
          <div className="mt-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <p className="text-[11px] text-violet-300">Your Golden Ratio Score: {goldenScore.toFixed(1)}/100 — distance from perfect Vitruvian proportions</p>
            <p className="text-[10px] text-zinc-500 mt-1">{GOLDEN_RATIO_AGENT.orbitdesk}</p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-zinc-800">
        <h4 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">Da Vinci Notebook — Observation / Sketch / Hypothesis</h4>
        {ticket ? (
          <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-[11px] text-zinc-300 leading-relaxed">{generateDaVinciObservation(ticket, portalLog)}</p>
          </div>
        ) : (
          <p className="text-[11px] text-zinc-500 mt-2">Select ticket to generate Da Vinci observation</p>
        )}
        <div className="mt-4 grid gap-3">
          <div>
            <p className="text-[11px] font-medium text-zinc-300">Observation — What did you see?</p>
            <ul className="mt-1 space-y-1">
              {DAVINCI_NOTEBOOK_PROMPTS.observation.map((q, i) => (
                <li key={i} className="text-[11px] text-zinc-500">• {q}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-300">Sketch — How does it work?</p>
            <ul className="mt-1 space-y-1">
              {DAVINCI_NOTEBOOK_PROMPTS.sketch.map((q, i) => (
                <li key={i} className="text-[11px] text-zinc-500">• {q}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium text-zinc-300">Hypothesis — Why did it break?</p>
            <ul className="mt-1 space-y-1">
              {DAVINCI_NOTEBOOK_PROMPTS.hypothesis.map((q, i) => (
                <li key={i} className="text-[11px] text-zinc-500">• {q}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-[10px] text-zinc-600 mt-3 font-mono">{DAVINCI_NOTEBOOK_PROMPTS.mirror}</p>
      </div>
    </div>
  );
}
