'use client';
import { useState, useEffect } from 'react';
import { Ticket, generateInitialTickets, generateTicket, updateTicketTimers, calculateCSAT } from '@/lib/ticketEngine';
import TicketQueue from '@/components/TicketQueue';
import MockPortals from '@/components/MockPortals';
import AgentRoster from '@/components/AgentRoster';
import CommunicationChannel from '@/components/CommunicationChannel';
import DashboardMetrics from '@/components/DashboardMetrics';
import CallCenter from '@/components/CallCenter';
import RemoteDesktop from '@/components/RemoteDesktop';
import PolicyCenter from '@/components/PolicyCenter';
import VoiceCallDemo from '@/components/VoiceCallDemo';
import InstallPrompt from '@/components/InstallPrompt';
import DesktopDownload from '@/components/DesktopDownload';
import { agents as initialAgents } from '@/data/agents';

type Tab = 'overview' | 'queue' | 'comms' | 'clients';

export default function HomeV2() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [agents, setAgents] = useState(initialAgents);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showRemotePC, setShowRemotePC] = useState(false);
  const [selectedClientForPolicies, setSelectedClientForPolicies] = useState('client-a');

  useEffect(() => {
    setTickets(generateInitialTickets(8));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickets(prev => updateTicketTimers(prev));
    }, 1000);

    const generator = setInterval(() => {
      if (Math.random() < 0.3 && tickets.length < 20) {
        const newTicket = generateTicket();
        setTickets(prev => [newTicket, ...prev]);
      }
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(generator);
    };
  }, [tickets.length]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActiveTab('queue');
    setSelectedClientForPolicies(ticket.clientId);
  };

  const handleAssign = (ticketId: string, agentId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: agentId, status: 'assigned' as const } : t));
  };

  const handleResolve = (ticketId: string, actions: any) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const csat = calculateCSAT(ticket, actions);
    const qa = actions.checkedLogsFirst && actions.usedCorrectTool ? 92 : actions.checkedLogsFirst ? 75 : 45;
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' as const, csat, qaScore: qa } : t));
    setResolvedCount(c => c + 1);
    setTimeout(() => {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
    }, 2000);
  };

  const pendingCount = tickets.filter(t => t.status !== 'resolved').length;
  const p1Count = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col">
      {/* Top — friendly dark #0a0a0a emerald pulse like Chokepoint v2.0 */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-zinc-800/60">
        <div className="max-w-[1600px] mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-[12px]">◍</span>
            </div>
            <span className="text-[14px] font-semibold tracking-[-0.01em]">OrbitDesk</span>
            <span className="h-4 w-px bg-zinc-800 hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">◍ OrbitDesk Lab • Real Voice Calls • Desktop Installable</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/50">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">{pendingCount} pending • {p1Count} P1 • Live</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">5 Voices</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">PWA+Electron</span>
            </div>
          </div>
        </div>

        {/* Tabs — 4 only, less complicated */}
        <div className="max-w-[1600px] mx-auto px-4 h-10 flex items-center gap-1 border-t border-zinc-800/40">
          {[
            { id: 'overview', label: 'Overview', icon: '◍', desc: 'Bento clean dashboard', badge: undefined },
            { id: 'queue', label: 'Live Queue', icon: '◐', desc: `${pendingCount} pending • Voice`, badge: pendingCount },
            { id: 'comms', label: 'Comms', icon: '◑', desc: 'Responsive • Auto-replies', badge: 3 },
            { id: 'clients', label: 'Clients', icon: '◒', desc: 'Per-client policies', badge: undefined },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`h-7 px-3 rounded-lg text-[12px] font-medium flex items-center gap-1.5 border transition-all ${activeTab === tab.id ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300'}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          ))}
          
          <div className="ml-auto flex items-center gap-2">
            <InstallPrompt />
            <span className="hidden md:block text-[11px] text-zinc-600">Linear • Stripe • Intercom • Superhuman • Notion • Vercel</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <DashboardMetrics tickets={tickets} />
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-8">
                <VoiceCallDemo />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <DesktopDownload />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
            <div className="col-span-12 lg:col-span-4 h-full flex flex-col gap-3">
              <TicketQueue tickets={tickets} onSelectTicket={handleSelectTicket} onAssign={handleAssign} selectedTicketId={selectedTicket?.id} />
              <div className="p-3 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium text-zinc-200">Remote Access</p>
                  <p className="text-[11px] text-zinc-500">Access client PC live • Encrypted</p>
                </div>
                <button
                  onClick={() => selectedTicket ? setShowRemotePC(true) : null}
                  className="h-8 px-3 rounded-full bg-zinc-100 text-zinc-900 text-[12px] font-semibold hover:bg-white transition"
                >
                  Connect →
                </button>
              </div>
            </div>
            
            <div className="col-span-12 lg:col-span-8 h-full grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-5 h-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex flex-col">
                {selectedTicket ? (
                  <>
                    <div className="p-4 border-b border-zinc-800/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${selectedTicket.priority === 'P1' ? 'bg-red-500/15 text-red-300 border border-red-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{selectedTicket.priority}</span>
                        <span className="text-[11px] font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">{selectedTicket.code}</span>
                        <span className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-full">{selectedTicket.clientName}</span>
                      </div>
                      <h2 className="text-[14px] font-semibold text-zinc-100 leading-tight">{selectedTicket.title}</h2>
                      <p className="text-[13px] text-zinc-400 mt-2 leading-[1.4]">"{selectedTicket.userMessage}"</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500">
                        <span className="font-mono bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">{selectedTicket.userEmail}</span>
                        <span>{Math.floor(selectedTicket.timeLeftMs/60000)}m left</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div>
                        <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-2">Required Tools</h4>
                        <div className="space-y-1.5">
                          {selectedTicket.requiredTools.map(tool => (
                            <div key={tool} className="text-[12px] bg-zinc-900/50 border border-zinc-800/50 p-2.5 rounded-xl flex items-center gap-2">
                              <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px]">✓</span> {tool}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="text-[11px] font-medium text-amber-300">Root Cause:</p>
                        <p className="text-[12px] text-zinc-400 mt-1 leading-[1.4]">{selectedTicket.rootCause}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800">
                        <h4 className="text-[11px] font-semibold text-zinc-200 mb-2">Resolve — Checklist</h4>
                        <div className="space-y-2 text-[12px] text-zinc-400">
                          <label className="flex items-center gap-2"><input type="checkbox" id="check-logs" className="rounded" /> Checked logs first</label>
                          <label className="flex items-center gap-2"><input type="checkbox" id="correct-tool" className="rounded" /> Used correct tool</label>
                          <label className="flex items-center gap-2"><input type="checkbox" id="client-lang" className="rounded" /> Used client language</label>
                        </div>
                        <button
                          onClick={() => {
                            const actions = {
                              checkedLogsFirst: (document.getElementById('check-logs') as HTMLInputElement)?.checked || false,
                              usedCorrectTool: (document.getElementById('correct-tool') as HTMLInputElement)?.checked || false,
                              usedClientLanguage: (document.getElementById('client-lang') as HTMLInputElement)?.checked || false,
                              confirmedResolution: true,
                              documentedKB: false,
                            };
                            handleResolve(selectedTicket.id, actions);
                          }}
                          className="w-full mt-3 h-9 rounded-xl bg-zinc-100 text-zinc-900 text-[13px] font-semibold hover:bg-white transition"
                        >
                          Resolve → CSAT + QA
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <div>
                      <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3">
                        <span className="text-zinc-500">◍</span>
                      </div>
                      <p className="text-[13px] font-medium text-zinc-300">Select a ticket</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Use portals on right to find root cause</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-12 lg:col-span-7 h-full">
                <MockPortals ticket={selectedTicket} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comms' && (
          <div className="h-[calc(100vh-120px)]">
            <CommunicationChannel />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
            <div className="col-span-12 lg:col-span-5 h-full">
              <PolicyCenter selectedClientId={selectedClientForPolicies} onSelectClient={setSelectedClientForPolicies} />
            </div>
            <div className="col-span-12 lg:col-span-7 h-full">
              <AgentRoster onResolveConflict={() => {}} />
            </div>
          </div>
        )}
      </div>

      <CallCenter tickets={tickets} onAcceptCall={handleSelectTicket} />
      <RemoteDesktop ticket={selectedTicket} isOpen={showRemotePC} onClose={() => setShowRemotePC(false)} />

      {/* Footer — 2 rows subtle legal like Chokepoint v2.0 */}
      <div className="border-t border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur mt-8">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-zinc-600">
          <span>OrbitDesk Lab — Educational simulation, not real MSP. HMAC-signed audit, What If verified, per-client policies, 5 voices, desktop PWA+Electron.</span>
          <span className="flex items-center gap-2">
            <span>Linear dark-first • Stripe mesh • Intercom bubbles • Superhuman ⌘K • Notion warmth • Vercel restraint</span>
            <span className="h-3 w-px bg-zinc-800" />
            <span className="font-mono">v2.1.0 • Responsive Comms • Bento Clean • 4 Tabs</span>
          </span>
        </div>
      </div>
    </div>
  );
}
