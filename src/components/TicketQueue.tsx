'use client';
import { Ticket, getSLAColor } from '@/lib/ticketEngine';
import { clients } from '@/data/clients';
import { useState, useEffect } from 'react';

interface Props {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onAssign: (ticketId: string, agentId: string) => void;
  selectedTicketId?: string;
}

export default function TicketQueue({ tickets, onSelectTicket, onAssign, selectedTicketId }: Props) {
  const [filter, setFilter] = useState<'all' | 'P1' | 'my' | 'unassigned'>('all');
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
      return `-${mins}m BREACH`;
    }
    const mins = Math.floor(ms / 60000);
    const hours = Math.floor(mins / 60);
    if (hours > 0) return `${hours}h ${mins % 60}m`;
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Queue ({filtered.length})
          </h2>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{tickets.filter(t => t.slaBreach).length} breached</span>
        </div>
        
        <div className="flex gap-2 mb-3">
          {(['all', 'P1', 'unassigned'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {f === 'all' ? 'All' : f === 'P1' ? '🔥 P1 Only' : 'Unassigned'}
            </button>
          ))}
        </div>

        <input
          placeholder="Search tickets, clients, codes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.map(ticket => {
          const client = clients.find(c => c.id === ticket.clientId);
          const isSelected = selectedTicketId === ticket.id;
          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`p-4 cursor-pointer hover:bg-slate-50 transition border-l-4 ${isSelected ? 'bg-violet-50 border-l-violet-600' : ticket.priority === 'P1' ? 'border-l-red-500' : ticket.slaBreach ? 'border-l-red-600' : 'border-l-transparent'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ticket.priority === 'P1' ? 'bg-red-600 text-white' : ticket.priority === 'P2' ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{ticket.code}</span>
                  {ticket.isRecurring && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Recurring</span>}
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getSLAColor(ticket.timeLeftMs, ticket.priority)}`}>
                  {formatTimeLeft(ticket.timeLeftMs)}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 mb-1">{ticket.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2">"{ticket.userMessage}"</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${client?.color || 'bg-slate-400'}`}>
                    {client?.avatar}
                  </span>
                  <span className="text-xs text-slate-700 font-medium">{ticket.clientName}</span>
                </div>
                <span className="text-[11px] text-slate-500">{ticket.userEmail.split('@')[0]}</span>
              </div>

              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {ticket.errorCodes.slice(0,2).map(code => (
                  <span key={code} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">{code.split(' ')[0]}</span>
                ))}
                {ticket.assignedTo && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Assigned</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
