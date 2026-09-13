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

type Tab = 'ticket' | 'chat' | 'dashboard' | 'policies' | 'training' | 'voice' | 'desktop';

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('ticket');
  const [agents, setAgents] = useState(initialAgents);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showConflictModal, setShowConflictModal] = useState<string | null>(null);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [showRemotePC, setShowRemotePC] = useState(false);
  const [selectedClientForPolicies, setSelectedClientForPolicies] = useState('client-a');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    setTickets(generateInitialTickets(10));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickets(prev => updateTicketTimers(prev));
    }, 1000);

    const generator = setInterval(() => {
      if (Math.random() < 0.25 && tickets.length < 15) {
        const newTicket = generateTicket();
        setTickets(prev => [...prev, newTicket]);
        addNotification(`🔔 New ${newTicket.priority} • ${newTicket.code} • ${newTicket.clientName}`);
        if (newTicket.priority === 'P1') {
          addNotification(`🚨 P1 • ${newTicket.clientName} • ${newTicket.title}`);
        }
      }
    }, 8000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      clearInterval(generator);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [tickets.length, commandPaletteOpen]);

  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.slice(0, -1));
    }, 5000);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setActiveTab('ticket');
    setSelectedClientForPolicies(ticket.clientId);
  };

  const handleAssign = (ticketId: string, agentId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: agentId, status: 'assigned' as const } : t));
    const agent = agents.find(a => a.id === agentId);
    addNotification(`✅ Assigned ${ticketId.split('-')[0]} → ${agent?.name}`);
  };

  const handleResolve = (ticketId: string, actions: any) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    const csat = calculateCSAT(ticket, actions);
    const qa = actions.checkedLogsFirst && actions.usedCorrectTool ? 92 : actions.checkedLogsFirst ? 75 : 45;
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'resolved' as const, csat, qaScore: qa } : t));
    setResolvedCount(c => c + 1);
    addNotification(`✅ Resolved ${ticket.code} • CSAT ${csat}⭐ QA ${qa}% • ${csat >= 4.5 ? 'Excellent!' : csat >= 3.5 ? 'Good' : 'Needs improvement'}`);
    setTimeout(() => {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
    }, 3000);
  };

  const handleResolveConflict = (agentId: string) => {
    setShowConflictModal(agentId);
  };

  const confirmConflictResolution = () => {
    if (!showConflictModal) return;
    const agent = agents.find(a => a.id === showConflictModal);
    const otherAgentId = agent?.conflictWith;
    setAgents(prev => prev.map(a => {
      if (a.id === showConflictModal || a.id === otherAgentId) {
        return { ...a, mood: 'neutral' as const, conflictWith: undefined };
      }
      return a;
    }));
    addNotification(`🤝 Conflict resolved: ${agent?.name} + ${agents.find(a => a.id === otherAgentId)?.name} • SBI + 1:1`);
    setShowConflictModal(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-[Inter,system-ui]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');`}</style>
      
      <div className="bg-[#0a0a0a] border-b border-zinc-800 px-5 py-2 text-[11px] text-zinc-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>◍ OrbitDesk Lab • Real Voice Calls • Desktop Installable • Training Simulator • Modern Workplace Operations</span>
          <span className="hidden md:inline-flex items-center gap-2 ml-3 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-full">
            <span>🎙️ 5 Voices</span>
            <span className="w-px h-3 bg-zinc-700"></span>
            <span>🖥️ PWA + Electron</span>
            <span className="w-px h-3 bg-zinc-700"></span>
            <span>🔒 Security Hardened</span>
          </span>
        </span>
        <span className="hidden md:flex items-center gap-2">
          <span className="text-zinc-500">v2.0 • Voice + Desktop</span>
          <span className="w-px h-3 bg-zinc-700"></span>
          <span>© 2026 OrbitDesk</span>
        </span>
      </div>

      <div className="px-3 pt-2">
        <InstallPrompt />
      </div>

      <header className="bg-[#0a0a0a] text-white px-5 py-3 flex items-center justify-between border-b border-[#1a1a1a] sticky top-0 z-30">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-violet-600/20">◍</div>
            <div>
              <h1 className="font-bold text-[15px] tracking-tight leading-none">OrbitDesk</h1>
              <p className="text-[11px] text-zinc-400 font-medium">Modern Workplace Lab • MSP • Multi-Client</p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <div className="flex items-center gap-2 bg-[#1a1a1a] border border-zinc-800 px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-zinc-300">{tickets.length} live</span>
              <span className="w-px h-3 bg-zinc-700"></span>
              <span className="text-zinc-400">{agents.filter(a => a.status === 'available').length} agents</span>
              <span className="w-px h-3 bg-zinc-700"></span>
              <span className="text-violet-400 font-medium">{resolvedCount} resolved</span>
            </div>
            
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-full text-xs text-zinc-400 hover:text-zinc-200 transition"
            >
              <span>⌘K</span>
              <span>Command</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-[11px] bg-[#1a1a1a] border border-zinc-800 px-3 py-1.5 rounded-full">
            <span className="text-zinc-500">Expectations:</span>
            <span className="text-zinc-300">SLA 95% • CSAT 4.5 • QA 85% • 44h/week</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-violet-600/20">DL</div>
        </div>
      </header>

      <div className="fixed top-[64px] right-4 z-50 space-y-2 w-[380px] pointer-events-none">
        {notifications.map((note, i) => (
          <div key={i} className="bg-[#0a0a0a] text-white text-xs p-3 rounded-2xl shadow-2xl border border-zinc-800 pointer-events-auto backdrop-blur-xl">
            {note}
          </div>
        ))}
      </div>

      {showConflictModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-bold text-lg mb-3">🤝 Resolve Conflict - SBI Framework</h3>
            <div className="text-sm text-zinc-600 space-y-3">
              <p><strong>Situation:</strong> In #team-internal, Alex said "Jamal wastes my time" publicly.</p>
              <p><strong>Behavior:</strong> Public shaming, not private coaching.</p>
              <p><strong>Impact:</strong> Jamal feels scared to ask, team sees tension, performance drops.</p>
              <div className="bg-violet-50 border border-violet-200 p-3 rounded-xl text-xs">
                <strong>Your Action as Team Lead:</strong><br/>
                1. Private 1:1 with Alex - SBI feedback + coach on coaching<br/>
                2. Private 1:1 with Jamal - Identify gap + escalation checklist<br/>
                3. Pair them: Alex mentors Jamal on Message Trace<br/>
                4. Follow-up in 1 week, document
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={confirmConflictResolution} className="flex-1 py-3 bg-[#0a0a0a] text-white rounded-full font-medium text-sm">Resolve with SBI + Coaching</button>
              <button onClick={() => setShowConflictModal(null)} className="px-5 py-3 bg-zinc-100 rounded-full text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <CallCenter tickets={tickets} onAcceptCall={handleSelectTicket} />
      <RemoteDesktop ticket={selectedTicket} isOpen={showRemotePC} onClose={() => setShowRemotePC(false)} />

      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] flex items-start justify-center pt-[20vh] p-4">
          <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-lg overflow-hidden border border-zinc-200">
            <div className="p-4 border-b flex items-center gap-3">
              <span className="text-zinc-400">⌘</span>
              <input autoFocus placeholder="Search tickets, clients, portals, actions..." className="flex-1 outline-none text-sm placeholder:text-zinc-400" />
              <button onClick={() => setCommandPaletteOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            <div className="p-2 text-xs">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-3 py-2">Quick Actions</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl cursor-pointer"><span>🎫 Go to P1 tickets</span><span className="text-zinc-400">↵</span></div>
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl cursor-pointer"><span>🔐 Open Entra Sign-in logs</span><span className="text-zinc-400">↵</span></div>
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl cursor-pointer"><span>📱 Open Intune Compliance</span><span className="text-zinc-400">↵</span></div>
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl cursor-pointer"><span>💻 Access Client PC (Remote)</span><span className="text-zinc-400">↵</span></div>
                <div className="flex items-center justify-between p-2.5 hover:bg-zinc-50 rounded-xl cursor-pointer"><span>📞 Simulate incoming call</span><span className="text-zinc-400">↵</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="w-full lg:w-[340px] flex-shrink-0 p-3 overflow-hidden flex flex-col gap-3">
          <TicketQueue tickets={tickets} onSelectTicket={handleSelectTicket} onAssign={handleAssign} selectedTicketId={selectedTicket?.id} />
          <div className="bg-[#0a0a0a] text-white rounded-2xl p-3 flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold">💻 Remote Access</div>
              <div className="text-[11px] text-zinc-400">Access client PC live</div>
            </div>
            <button
              onClick={() => selectedTicket ? setShowRemotePC(true) : addNotification('⚠️ Select a ticket first to access client PC')}
              className="px-3 py-1.5 bg-white text-black rounded-full text-xs font-bold hover:bg-zinc-100"
            >
              Connect →
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <div className="bg-white rounded-2xl p-1.5 flex gap-1 shadow-sm border border-zinc-200/60 overflow-x-auto">
            {[
              { id: 'ticket', label: 'Ticket + Portals', icon: '◍', desc: 'Entra, Intune, Exchange' },
              { id: 'voice', label: 'Voice Calls', icon: '🎙️', desc: 'Real Audio • Flowing Convos' },
              { id: 'chat', label: 'Comms', icon: '💬', desc: 'Slack-like • Client + Team' },
              { id: 'dashboard', label: 'Metrics', icon: '📊', desc: 'SLA, CSAT, Trends' },
              { id: 'policies', label: 'Policies', icon: '🏢', desc: 'Per-client CA & Compliance' },
              { id: 'desktop', label: 'Desktop App', icon: '🖥️', desc: 'PWA + Electron • Install' },
              { id: 'training', label: 'Training', icon: '🎓', desc: 'Learn + Quiz + Coach' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`flex-1 min-w-[110px] px-3 py-2.5 rounded-xl text-xs font-medium transition text-left ${activeTab === tab.id ? 'bg-[#0a0a0a] text-white shadow-sm' : 'hover:bg-zinc-50 text-zinc-600'}`}>
                <div className="font-semibold flex items-center gap-1.5"><span>{tab.icon}</span> {tab.label}</div>
                <div className="text-[11px] opacity-70 hidden xl:block mt-0.5">{tab.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'ticket' && (
              <div className="h-full flex flex-col lg:flex-row gap-3">
                <div className="w-full lg:w-[380px] bg-white rounded-2xl shadow-sm border border-zinc-200/60 flex flex-col overflow-hidden">
                  {selectedTicket ? (
                    <>
                      <div className="p-4 border-b border-zinc-100">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${selectedTicket.priority === 'P1' ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-100 text-zinc-700'}`}>{selectedTicket.priority}</span>
                          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-50 px-2 py-1 rounded-full">{selectedTicket.code}</span>
                          <span className="text-[11px] bg-violet-50 text-violet-700 px-2 py-1 rounded-full font-medium">{selectedTicket.clientName}</span>
                        </div>
                        <h2 className="font-semibold text-[15px] text-zinc-900 leading-tight">{selectedTicket.title}</h2>
                        <p className="text-[13px] text-zinc-600 mt-2.5 bg-zinc-50 p-3 rounded-xl border border-zinc-100">"{selectedTicket.userMessage}"</p>
                        <div className="mt-3 flex items-center gap-2 text-[11px]">
                          <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full font-mono">{selectedTicket.userEmail}</span>
                          <span className="text-zinc-500">{Math.floor(selectedTicket.timeLeftMs/60000)}m left • {selectedTicket.priority} SLA</span>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-[11px] uppercase tracking-wider text-zinc-500 mb-2.5">Required Tools</h4>
                          <div className="space-y-1.5">
                            {selectedTicket.requiredTools.map(tool => (
                              <div key={tool} className="text-xs bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl flex items-center gap-2 hover:border-zinc-200 transition">
                                <span className="w-5 h-5 bg-[#0a0a0a] text-white rounded-full flex items-center justify-center text-[10px]">✓</span> {tool}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-3.5">
                          <h4 className="font-semibold text-xs text-amber-900 mb-1.5">💡 Root Cause (Find via portals →)</h4>
                          <div className="text-xs text-amber-800 leading-relaxed">{selectedTicket.rootCause}</div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-[11px] uppercase tracking-wider text-zinc-500 mb-2.5">Correct Fix</h4>
                          <ol className="space-y-2">
                            {selectedTicket.correctFix.map((step, i) => (
                              <li key={i} className="text-xs flex gap-2.5">
                                <span className="w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                                <span className="text-zinc-700 leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-[#0a0a0a] text-white p-4 rounded-2xl">
                          <h4 className="font-semibold text-xs mb-3 flex items-center gap-2"><span className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">✓</span> Resolve - Team Lead Checklist</h4>
                          <div className="space-y-2.5 text-xs">
                            <label className="flex items-center gap-2.5 cursor-pointer group"><input type="checkbox" id="check-logs" className="rounded border-zinc-600 bg-zinc-800" /><span className="group-hover:text-zinc-200">Checked logs first (Sign-in logs CA tab / Message Trace)</span></label>
                            <label className="flex items-center gap-2.5 cursor-pointer group"><input type="checkbox" id="correct-tool" className="rounded border-zinc-600 bg-zinc-800" /><span className="group-hover:text-zinc-200">Used correct tool (What If / dsregcmd / Quarantine)</span></label>
                            <label className="flex items-center gap-2.5 cursor-pointer group"><input type="checkbox" id="client-lang" className="rounded border-zinc-600 bg-zinc-800" /><span className="group-hover:text-zinc-200">Used client language (tech vs non-tech)</span></label>
                            <label className="flex items-center gap-2.5 cursor-pointer group"><input type="checkbox" id="confirm" className="rounded border-zinc-600 bg-zinc-800" /><span className="group-hover:text-zinc-200">Confirmed resolution</span></label>
                            <label className="flex items-center gap-2.5 cursor-pointer group"><input type="checkbox" id="kb" className="rounded border-zinc-600 bg-zinc-800" /><span className="group-hover:text-zinc-200">Documented in KB</span></label>
                          </div>
                          <button
                            onClick={() => {
                              const actions = {
                                checkedLogsFirst: (document.getElementById('check-logs') as HTMLInputElement)?.checked || false,
                                usedCorrectTool: (document.getElementById('correct-tool') as HTMLInputElement)?.checked || false,
                                usedClientLanguage: (document.getElementById('client-lang') as HTMLInputElement)?.checked || false,
                                confirmedResolution: (document.getElementById('confirm') as HTMLInputElement)?.checked || false,
                                documentedKB: (document.getElementById('kb') as HTMLInputElement)?.checked || false,
                              };
                              handleResolve(selectedTicket.id, actions);
                            }}
                            className="w-full mt-4 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-100 transition"
                          >
                            Resolve → Get CSAT + QA
                          </button>
                          <div className="text-[11px] text-zinc-500 mt-2.5 text-center">Focus on facts. Logs first = +CSAT. Guessing = -CSAT</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8 text-center">
                      <div>
                        <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">◍</div>
                        <div className="font-medium text-sm">Select a ticket</div>
                        <div className="text-xs text-zinc-500 mt-1">Use portals on right to find root cause</div>
                        <div className="mt-4 text-[11px] bg-zinc-50 border border-zinc-100 rounded-full px-3 py-1.5 inline-block">⌘K for command palette</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <MockPortals ticket={selectedTicket} />
                </div>
              </div>
            )}

            {activeTab === 'voice' && (
              <div className="h-full overflow-y-auto space-y-4">
                <VoiceCallDemo />
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <h3 className="font-bold text-sm">🎧 How Voice Calls Work — Real Human Feel</h3>
                  <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">
                    <div className="bg-white border border-amber-200 rounded-xl p-3">
                      <div className="font-semibold">1. Incoming P1 Call Rings</div>
                      <div className="text-zinc-600 mt-1">P1 ticket triggers incoming call modal with ringtone (Web Audio beep). Client persona shows: NovaTech tech, Bloom casual, Apex regulated. Different voice per client.</div>
                    </div>
                    <div className="bg-white border border-amber-200 rounded-xl p-3">
                      <div className="font-semibold">2. Accept → Live Voice Conversation</div>
                      <div className="text-zinc-600 mt-1">Accept → Call bar appears. Client speaks with TTS voice (different per persona). You type or use mic 🎙️. Client responds intelligently, does actions on other side, asks questions back.</div>
                    </div>
                    <div className="bg-white border border-amber-200 rounded-xl p-3">
                      <div className="font-semibold">3. Add Tech Expert → Conference</div>
                      <div className="text-zinc-600 mt-1">Click 👨‍💻 → Add Alex (Entra), Priya (Intune), David (Exchange). Expert joins with different voice, provides guidance. Conference with client + expert + you. Real collaboration.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'desktop' && (
              <div className="h-full overflow-y-auto space-y-4">
                <DesktopDownload />
                <div className="bg-[#0a0a0a] text-white rounded-2xl p-5">
                  <h3 className="font-bold mb-3">Why Desktop App Gets You Hired — Team Lead Mindset</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-zinc-400">
                    <div>
                      <div className="font-semibold text-white">PWA Install (1 click):</div>
                      <div className="mt-1">• No build needed — Click Install in browser → App appears in dock/start menu<br/>• Works offline — tickets, audio, portals cached<br/>• Native P1 notifications even when browser closed<br/>• Feels like native app — standalone window, custom title bar</div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Electron Desktop (Production):</div>
                      <div className="mt-1">• npm run desktop:dist → .exe, .dmg, .AppImage in dist/<br/>• Global shortcuts ⌘K anywhere, system tray, auto-launch<br/>• Encrypted local storage for audit logs<br/>• File handlers, share target, window controls overlay<br/>• Interview: "I built desktop app for MSP operations — want to see P1 notification?"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'chat' && <div className="h-full"><CommunicationChannel /></div>}
            {activeTab === 'dashboard' && <div className="h-full overflow-y-auto"><DashboardMetrics tickets={tickets} /></div>}
            {activeTab === 'policies' && <div className="h-full overflow-hidden"><PolicyCenter selectedClientId={selectedClientForPolicies} onSelectClient={setSelectedClientForPolicies} /></div>}

            {activeTab === 'training' && (
              <div className="h-full overflow-y-auto bg-white rounded-2xl p-6 border border-zinc-200/60">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-lg tracking-tight">Training Lab</h2>
                  <span className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-full">Master Modern Workplace • SLA 95% • CSAT 4.5 • QA 85%</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-zinc-200/60 rounded-2xl p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">📚 Guided Paths</h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="p-3 bg-zinc-50 rounded-xl flex justify-between items-center border border-zinc-100"><span className="font-medium">Entra ID → Sign-in logs CA tab</span><span className="text-emerald-600 text-xs font-bold">✓ Done</span></div>
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl flex justify-between items-center hover:border-zinc-300 transition"><span>Intune → dsregcmd + Compliance</span><span className="text-zinc-900 font-medium text-xs">Start →</span></div>
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl flex justify-between items-center hover:border-zinc-300 transition"><span>Exchange → Message Trace + Quarantine</span><span className="text-zinc-900 font-medium text-xs">Start →</span></div>
                      <div className="p-3 bg-white border border-zinc-200 rounded-xl flex justify-between items-center hover:border-zinc-300 transition"><span>What If + Report-Only</span><span className="text-zinc-900 font-medium text-xs">Start →</span></div>
                    </div>
                  </div>

                  <div className="border border-zinc-200/60 rounded-2xl p-5">
                    <h3 className="font-semibold mb-3">🧠 Error Code Mastery</h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-medium text-sm">53003 BlockedByConditionalAccess?</div>
                        <div className="mt-2 space-y-2 text-xs">
                          <label className="flex gap-2.5 p-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer"><input type="radio" name="q1" /> Password expired</label>
                          <label className="flex gap-2.5 p-2.5 border border-violet-200 bg-violet-50 rounded-xl cursor-pointer"><input type="radio" name="q1" defaultChecked /> Blocked by CA - check CA tab + What If</label>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">Fix 0x80180024?</div>
                        <div className="mt-2 space-y-2 text-xs">
                          <label className="flex gap-2.5 p-2.5 border border-violet-200 bg-violet-50 rounded-xl cursor-pointer"><input type="radio" name="q2" defaultChecked /> Settings → Access work/school → Disconnect + dsregcmd /leave</label>
                          <label className="flex gap-2.5 p-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 cursor-pointer"><input type="radio" name="q2" /> Reinstall Windows</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-zinc-200/60 rounded-2xl p-5 md:col-span-2">
                    <h3 className="font-semibold mb-3">🎯 Real Scenarios from JD</h3>
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl">
                        <div className="font-semibold">Conflict: Alex vs Jamal</div>
                        <div className="mt-2 text-zinc-600 leading-relaxed">Senior says junior wastes time. Junior feels scared to ask. Performance drops.</div>
                        <div className="mt-3 text-[11px] font-bold bg-white border border-amber-200 px-2.5 py-1 rounded-full inline-block">Use: SBI + Private 1:1 + Escalation checklist</div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200/60 p-4 rounded-2xl">
                        <div className="font-semibold">Quality: CSAT 4.6→3.8</div>
                        <div className="mt-2 text-zinc-600 leading-relaxed">SLA green but CSAT red = rushing, sacrificing quality. Volume +30%.</div>
                        <div className="mt-3 text-[11px] font-bold bg-white border border-blue-200 px-2.5 py-1 rounded-full inline-block">Use: Low CSAT comments + QA reviews</div>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-2xl">
                        <div className="font-semibold">P1: 50 users blocked</div>
                        <div className="mt-2 text-zinc-600 leading-relaxed">New CA policy pushed without Report-Only. Audit logs show 08:02.</div>
                        <div className="mt-3 text-[11px] font-bold bg-white border border-emerald-200 px-2.5 py-1 rounded-full inline-block">Use: Service Health + What If + Report-Only</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-[#0a0a0a] text-white rounded-2xl p-5 flex gap-4">
                  <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">◍</div>
                  <div>
                    <h3 className="font-semibold mb-2">Why OrbitDesk gets you hired</h3>
                    <div className="text-sm text-zinc-400 space-y-1 leading-relaxed">
                      <div>✓ Built tooling that champions process improvement - from JD "Drive Quality & Improvement"</div>
                      <div>✓ Lead multi-client MSP: rosters, 44h/week, SLA, CSAT, QA, Problem Management (ITIL)</div>
                      <div>✓ Modern stack: Entra ID, Intune, Exchange, Teams, Defender, What If, Report-Only, dsregcmd, Message Trace</div>
                      <div>✓ Live demo: "I built this for Modern Workplace Team Lead - want to see me fix P1 + take a call + remote into PC?"</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[340px] flex-shrink-0 p-3 overflow-hidden hidden lg:flex flex-col gap-3">
          <AgentRoster onResolveConflict={handleResolveConflict} />
        </div>
      </div>

      <footer className="bg-[#0a0a0a] border-t border-zinc-800 px-6 py-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-violet-600/20">◍</div>
              <div>
                <div className="font-semibold text-zinc-200 text-sm flex items-center gap-2">OrbitDesk <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full">v2.0</span></div>
                <div className="text-[11px] text-zinc-500">Modern Workplace Operations Lab • Training Simulator</div>
              </div>
            </div>
            <span className="hidden md:inline w-px h-8 bg-zinc-800"></span>
            <div className="hidden md:block text-[11px] text-zinc-500 leading-relaxed">
              Built for Team Lead — Modern Workplace Support<br/>
              Real voice calls • Desktop app • Security hardened
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-[11px]">
            <div className="flex items-center gap-3">
              <a href="/terms" className="text-zinc-500 hover:text-zinc-300 transition">Terms</a>
              <span className="text-zinc-700">•</span>
              <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition">Privacy</a>
              <span className="text-zinc-700">•</span>
              <a href="/disclaimer" className="text-zinc-500 hover:text-zinc-300 transition">Legal & Disclaimer</a>
            </div>
            <span className="hidden md:inline w-px h-4 bg-zinc-800"></span>
            <div className="text-zinc-600 flex items-center gap-2">
              <span>© 2026 • MIT • Built by Devine Nyaenya</span>
              <span className="hidden md:inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Educational • Simulated data
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[10px] text-zinc-600">
          <div>OrbitDesk is an independent training simulator for Modern Workplace Support. All clients, agents, tickets, voice calls, and remote sessions are simulated. No real Microsoft tenant data. All trademarks property of respective owners.</div>
          <div className="flex items-center gap-2">
            <span>🎙️ 5 Voices</span>
            <span>•</span>
            <span>🖥️ PWA + Electron</span>
            <span>•</span>
            <span>🔒 Security Hardened</span>
            <span>•</span>
            <a href="https://github.com/Nyaenya-Devine/orbitdesk" target="_blank" className="hover:text-zinc-400 underline">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
