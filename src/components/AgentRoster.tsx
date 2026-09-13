'use client';
import { agents, Agent } from '@/data/agents';
import { useState } from 'react';

interface Props {
  onResolveConflict: (agentId: string) => void;
}

export default function AgentRoster({ onResolveConflict }: Props) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      case 'on-break': return 'bg-slate-400';
      case 'offline': return 'bg-slate-300';
      case 'sick': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'stressed': return '😰';
      case 'conflicted': return '😠';
      default: return '😐';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          👥 Team Roster - 44hr/week Compliance
        </h2>
        <p className="text-xs text-slate-500 mt-1">Manage workload, coverage, coaching</p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className={`p-3 cursor-pointer hover:bg-slate-50 transition ${selectedAgent?.id === agent.id ? 'bg-violet-50' : ''} ${agent.mood === 'conflicted' ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${agent.color}`}>
                  {agent.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agent.status)}`}></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">{agent.name}</span>
                  <span className="text-xs">{getMoodEmoji(agent.mood)}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${agent.level === 'senior' ? 'bg-slate-900 text-white' : agent.level === 'lead' ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {agent.level.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-violet-600 h-1.5 rounded-full" style={{ width: `${(agent.weeklyHours / agent.maxWeeklyHours) * 100}%` }}></div>
                  </div>
                  <span className="text-[11px] text-slate-600">{agent.weeklyHours}h/{agent.maxWeeklyHours}h</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-500">{agent.currentTickets}/{agent.maxTickets} tickets</span>
                  {agent.conflictWith && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">⚠️ Conflict</span>}
                  {agent.status === 'sick' && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded">SICK</span>}
                </div>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {agent.skills.slice(0,3).map(skill => (
                    <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-700">{agent.metrics.csat} ⭐ CSAT</div>
                <div className="text-[10px] text-slate-500">{agent.metrics.sla}% SLA</div>
                <div className="text-[10px] text-slate-500">{agent.metrics.qa}% QA</div>
              </div>
            </div>

            {agent.mood === 'conflicted' && (
              <div className="mt-2 bg-red-100 border border-red-200 rounded p-2 text-xs">
                <div className="font-bold text-red-800">⚠️ Conflict Detected: {agents.find(a => a.id === agent.conflictWith)?.name}</div>
                <div className="text-red-700 mt-1 text-[11px]">{agent.id === 'agent-alex' ? '"Jamal keeps escalating easy M365 tickets, wasting my time" - in #team-internal' : '"Alex is rude and doesn\'t explain, I feel scared to ask" - private DM to you'}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); onResolveConflict(agent.id); }}
                  className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-[11px] hover:bg-red-700"
                >
                  Resolve Conflict (1:1 + SBI)
                </button>
              </div>
            )}

            {agent.learningGap && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2 text-[11px]">
                <strong>Learning Gap:</strong> {agent.learningGap}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div className="p-4 bg-slate-900 text-white text-xs rounded-b-xl">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold">{selectedAgent.name} - Coaching Notes</h3>
            <button onClick={() => setSelectedAgent(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-2">
            <div><strong>Strengths:</strong> {selectedAgent.strengths.join(', ')}</div>
            <div><strong>Skills:</strong> {Object.entries(selectedAgent.skillLevel).map(([k,v]) => `${k}:${v}/10`).join(' | ')}</div>
            <div><strong>Metrics:</strong> SLA {selectedAgent.metrics.sla}% | CSAT {selectedAgent.metrics.csat} | QA {selectedAgent.metrics.qa}% | FRT {selectedAgent.metrics.frt}m | MTTR {selectedAgent.metrics.mttr}m</div>
            <div className="bg-slate-800 p-2 rounded mt-2">
              <strong>Coaching Plan:</strong>
              <ul className="list-disc ml-4 mt-1">
                {selectedAgent.coachingNotes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 bg-violet-600 rounded text-xs">Start 1:1 (GROW)</button>
              <button className="px-3 py-1 bg-slate-700 rounded text-xs">Quality Review</button>
              <button className="px-3 py-1 bg-slate-700 rounded text-xs">Assign Mentor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
