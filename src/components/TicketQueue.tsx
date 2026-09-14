'use client';
import { Ticket, getSLAColor } from '@/lib/ticketEngine';
import { clients } from '@/data/clients';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onAssign: (ticketId: string, agentId: string) => void;
  selectedTicketId?: string;
}

const priorityConfig = {
  P1: { label: 'P1', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
  P2: { label: 'P2', bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
  P3: { label: 'P3', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
  P4: { label: 'P4', bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/20', dot: 'bg-zinc-500' },
};

export default function TicketQueue({ tickets, onSelectTicket, onAssign, selectedTicketId }: Props) {
  const [filter, setFilter] = useState<'all' | 'P1' | 'unassigned'>('all');
  const [search, setSearch] = useState('');

  const filtered = tickets.filter(t => {
    if (filter === 'P1' && t.priority !== 'P1') return false;
    if (filter === 'unassigned' && t.assignedTo) return false;
    if (search && !`${t.title} ${t.code} ${t.clientName} ${t.userEmail}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (a.priority === 'P1' && b.priority !== 'P1') return -1;
    if (b.priority === 'P1' && a.priority !== 'P1') return 1;
    if (a.slaBreach && !b.slaBreach) return -1;
    if (b.slaBreach && !a.slaBreach) return 1;
    return a.timeLeftMs - b.timeLeftMs;
  });

  const formatTimeLeft = (ms: number) => {
    if (ms < 0) {
      const mins = Math.abs(Math.floor(ms / 60000));
      return `${mins}m BREACH`;
    }
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    return `${mins}m`;
  };

  const breached = tickets.filter(t => t.slaBreach).length;
  const p1Count = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved').length;

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold tracking-[0.02em] text-zinc-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Queue
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">{filtered.length} total • {p1Count} P1</span>
          </h2>
          <span className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          </span>
        </div>
        
        <div className="flex gap-1.5 mb-3">
          {(['all', 'P1', 'unassigned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-6 px-2.5 rounded-full text-[11px] font-medium border transition-all ${filter === f ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-300'}`}
            >
              {f === 'all' ? 'All' : f === 'P1' ? 'P1 Only' : 'Unassigned'} {f === 'P1' && p1Count > 0 && <span className="ml-1 opacity-60">• {p1Count}</span>}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            placeholder="Search tickets, clients, codes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-[13px] text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
          />
          <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/40">
        <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center">
            <div className="h-8 w-8 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-500 text-sm">◍</span>
            </div>
            <p className="text-[13px] text-zinc-500">No tickets match filter</p>
            <p className="text-[11px] text-zinc-600 mt-1">Real-time engine will generate new ones</p>
          </motion.div>
        ) : (
          filtered.map((ticket, idx) => {
            const client = clients.find(c => c.id === ticket.clientId);
            const isSelected = selectedTicketId === ticket.id;
            const p = priorityConfig[ticket.priority as keyof typeof priorityConfig];
            const isExpiring = ticket.timeLeftMs < 2 * 60_000 && !ticket.slaBreach;
            
            return (
              <motion.button
                key={ticket.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectTicket(ticket)}
                className={`w-full text-left p-3.5 hover:bg-zinc-800/40 transition-colors group ${isSelected ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : 'border-l-2 border-l-transparent'} ${ticket.slaBreach ? 'bg-red-500/[0.04]' : isExpiring ? 'bg-amber-500/[0.04]' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`h-5 px-1.5 rounded text-[10px] font-bold flex items-center ${p.bg} ${p.text} border ${p.border}`}>
                        {p.label}
                      </span>
                      <span className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center">
                        <span className={`h-1.5 w-1.5 rounded-full ${p.dot} ${ticket.priority === 'P1' ? 'animate-pulse' : ''}`} />
                      </span>
                      <span className="text-[11px] font-medium text-zinc-300 truncate">{ticket.code}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700/30">
                        {ticket.clientName.split(' ')[0]}
                      </span>
                      {ticket.isRecurring && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Recurring</span>
                      )}
                    </div>
                    
                    <h3 className="text-[13px] font-medium text-zinc-100 leading-[1.3] line-clamp-2 group-hover:text-white">
                      {ticket.title}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1">"{ticket.userMessage.substring(0, 60)}..."</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400">
                        {client?.avatar || 'C'}
                      </div>
                      <span className="text-[11px] text-zinc-500">{ticket.clientName}</span>
                      <span className="text-[10px] text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-500">{ticket.userEmail.split('@')[0]}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full border ${ticket.slaBreach ? 'bg-red-500/10 text-red-400 border-red-500/20' : isExpiring ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'}`}>
                      {formatTimeLeft(ticket.timeLeftMs)}
                    </span>
                    {ticket.assignedTo && (
                      <span className="text-[10px] text-zinc-500">Assigned</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
            {filtered.length} in queue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-red-500" />
            {breached} breached
          </span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">Live • Endless • Real-time</span>
      </div>
    </div>
  );
}
