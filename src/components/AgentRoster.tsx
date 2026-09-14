'use client';
import { useState } from 'react';
import { Ticket } from '@/lib/ticketEngine';

interface Agent {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'available' | 'busy' | 'on-break' | 'offline' | 'sick';
  mood: 'happy' | 'neutral' | 'stressed' | 'conflicted';
  level: 'junior' | 'senior' | 'lead';
  weeklyHours: number;
  maxWeeklyHours: number;
  currentTickets: number;
  maxTickets: number;
  skills: string[];
  conflictWith?: string;
  metrics: { csat: number; sla: number; qa: number; frt: number; mttr: number };
  strengths: string[];
  skillLevel: Record<string, number>;
  coachingNotes: string[];
  learningGap?: string;
}

interface Props {
  agents: Agent[];
  onResolveConflict: (agentId: string) => void;
  onAssign?: (ticketId: string, agentId: string) => void;
  tickets: Ticket[];
}

export default function AgentRoster({ agents, onResolveConflict, onAssign, tickets }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'conflict'>('all');

  const filtered = agents.filter(a => {
    if (filter === 'available' && a.status !== 'available') return false;
    if (filter === 'conflict' && a.mood !== 'conflicted') return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-emerald-500';
      case 'busy': return 'bg-orange-500';
      case 'on-break': return 'bg-zinc-400';
      case 'offline': return 'bg-zinc-600';
      case 'sick': return 'bg-red-500';
      default: return 'bg-zinc-400';
    }
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/30">
        <h2 className="font-bold text-[13px] text-zinc-100 flex items-center gap-2">
          👥 Team Roster — Real Workload • 44h/week
        </h2>
        <p className="text-[11px] text-zinc-500 mt-1">Every assign/resolve commits real — workload updates, hours, CSAT</p>
        <div className="flex gap-1.5 mt-3">
          {(['all','available','conflict'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`h-6 px-2.5 rounded-full text-[11px] font-medium border transition ${filter===f ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'}`}>{f === 'all' ? 'All' : f === 'available' ? 'Available' : `Conflict • ${agents.filter(a=>a.mood==='conflicted').length}`}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/30">
        {filtered.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`p-3 cursor-pointer hover:bg-zinc-800/30 transition ${selectedAgent?.id === agent.id ? 'bg-violet-500/10' : ''} ${agent.mood === 'conflicted' ? 'bg-red-500/5 border-l-2 border-l-red-500' : 'border-l-2 border-l-transparent'}`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${agent.color}`}>
                  {agent.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${getStatusColor(agent.status)}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[13px] text-zinc-100">{agent.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${agent.level === 'senior' ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : agent.level === 'lead' ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{agent.level.toUpperCase()}</span>
                  {agent.conflictWith && <span className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-full">⚠️ Conflict</span>}
                </div>
                
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 bg-zinc-800 rounded-full h-1.5">
                    <div className="bg-violet-600 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100,(agent.weeklyHours / agent.maxWeeklyHours) * 100)}%` }}></div>
                  </div>
                  <span className="text-[11px] text-zinc-500">{agent.weeklyHours}h/{agent.maxWeeklyHours}h</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-zinc-500">{agent.currentTickets}/{agent.maxTickets} tickets • {agent.metrics.csat} ⭐ CSAT • {agent.metrics.sla}% SLA</span>
                </div>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {agent.skills.slice(0,3).map(skill => (
                    <span key={skill} className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700/50 px-1.5 py-0.5 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            {agent.mood === 'conflicted' && (
              <div className="mt-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-[11px]">
                <div className="font-bold text-red-300">⚠️ Conflict: {agents.find(a => a.id === agent.conflictWith)?.name}</div>
                <div className="text-zinc-400 mt-1 leading-[1.3]">{agent.id === 'agent-alex' ? 'Jamal keeps escalating easy tickets without checking logs — public shaming in #team-internal' : 'Alex is rude, doesn\'t explain, scared to ask'}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); onResolveConflict(agent.id); }}
                  className="mt-2 w-full h-7 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-semibold transition"
                >
                  Resolve Conflict → 1:1 SBI + Coaching (Real Action)
                </button>
              </div>
            )}

            {agent.learningGap && (
              <div className="mt-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[11px] text-amber-200">
                Learning Gap: {agent.learningGap}
              </div>
            )}

            {onAssign && tickets.filter(t=>t.status==='new').length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Assign Real Ticket →</p>
                <div className="flex gap-1 overflow-x-auto">
                  {tickets.filter(t=>t.status==='new').slice(0,2).map(t => (
                    <button key={t.id} onClick={(e) => { e.stopPropagation(); onAssign(t.id, agent.id); }} className="h-6 px-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300 whitespace-nowrap">
                      {t.code} {t.priority}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 text-[11px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-zinc-100">{selectedAgent.name} — Coaching (Real)</h3>
            <button onClick={() => setSelectedAgent(null)} className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 flex items-center justify-center">✕</button>
          </div>
          <div className="space-y-2 text-zinc-400">
            <div><strong className="text-zinc-200">Strengths:</strong> {selectedAgent.strengths.join(', ')}</div>
            <div><strong className="text-zinc-200">Metrics:</strong> SLA {selectedAgent.metrics.sla}% | CSAT {selectedAgent.metrics.csat} | QA {selectedAgent.metrics.qa}% | FRT {selectedAgent.metrics.frt}m</div>
            <div className="bg-[#0a0a0a] border border-zinc-800 p-2.5 rounded-xl">
              <strong className="text-zinc-200">Coaching Plan — Real Actions:</strong>
              <ul className="list-disc ml-4 mt-1 space-y-0.5">
                {selectedAgent.coachingNotes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onResolveConflict(selectedAgent.id)} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold">Start 1:1 GROW (Real)</button>
              <button className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px]">Quality Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
