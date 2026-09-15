'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, generateInitialTickets, generateTicket, updateTicketTimers, calculateCSAT } from '@/lib/ticketEngine';
import TicketQueue from '@/components/TicketQueue';
import MockPortals from '@/components/MockPortals';
import AgentRoster from '@/components/AgentRoster';
import CommunicationChannel from '@/components/CommunicationChannel';
import DashboardMetrics from '@/components/DashboardMetrics';
import VoiceCallCenter from '@/components/VoiceCallCenter';
import PolicyCenter from '@/components/PolicyCenter';
import VoiceCallDemo from '@/components/VoiceCallDemo';
import InstallPromptV2 from '@/components/InstallPromptV2';
import DesktopDownloadV2 from '@/components/DesktopDownloadV2';
import ToastSystem, { Toast } from '@/components/ToastSystem';
import AssessmentReport from '@/components/AssessmentReport';
import { agents as initialAgents } from '@/data/agents';
import { StudentProgress, loadProgress, saveProgress, calculateLevel, getBadges, initialProgress } from '@/lib/progressEngine';
import Logo from '@/components/Logo';
import RemoteDesktopV2 from '@/components/RemoteDesktopV2';
import StudentModeGuide from '@/components/StudentModeGuide';
import LiveryBackground from '@/components/LiveryBackground';
import ThreadHumor from '@/components/ThreadHumor';
import AuthGate from '@/components/AuthGate';
import ClassCommandCenter from '@/components/ClassCommandCenter';
import GrowthStrategy from '@/components/GrowthStrategy';

type Tab = 'overview' | 'queue' | 'comms' | 'clients' | 'class' | 'growth' | 'assessment';

export default function HomeV3() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [userProfile, setUserProfile] = useState<any>(null);
 const [tickets, setTickets] = useState<Ticket[]>([]);
 const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
 const [activeTab, setActiveTab] = useState<Tab>('queue');
 const [agents, setAgents] = useState(initialAgents);
 const [resolvedCount, setResolvedCount] = useState(0);
 const [showRemotePC, setShowRemotePC] = useState(false);
 const [selectedClientForPolicies, setSelectedClientForPolicies] = useState('client-a');
 const [toasts, setToasts] = useState<Toast[]>([]);
 const [checklist, setChecklist] = useState({ logs: false, tool: false, lang: false, confirm: false });
 const [portalActionLog, setPortalActionLog] = useState<string[]>([]);
 const [progress, setProgress] = useState<StudentProgress>(initialProgress);
 const [showAssessment, setShowAssessment] = useState(false);
 const [bitLockerFixed, setBitLockerFixed] = useState(false);
 const [syncDone, setSyncDone] = useState(false);
 const [studentMode, setStudentMode] = useState(true);
 const [showGuide, setShowGuide] = useState(true);
 const [showLiveChat, setShowLiveChat] = useState(false);

 // Check auth persistence — login to keep data not start from scratch
 useEffect(() => {
 const savedProfile = localStorage.getItem('orbitdesk_user_profile');
 if (savedProfile) {
 try {
  const parsed = JSON.parse(savedProfile);
  setUserProfile(parsed);
  setIsAuthenticated(true);
 } catch {}
 }
 }, []);

 // Load progress from localStorage
 useEffect(() => {
 if (!isAuthenticated) return;
 const saved = loadProgress();
 setProgress(saved);
 setTickets(generateInitialTickets(5, studentMode));
 }, [studentMode, isAuthenticated]);

 // Save progress whenever it changes
 useEffect(() => {
 saveProgress(progress);
 }, [progress]);

 useEffect(() => {
 const timer = setInterval(() => setTickets(prev => updateTicketTimers(prev)), 1000);
 const generator = setInterval(() => {
 setTickets(prev => {
  if (Math.random() < 0.2 && prev.length < 25) {
  const newTicket = generateTicket();
  addToast(`New ${newTicket.priority}: ${newTicket.code} — ${newTicket.title.substring(0,40)}...`, 'info', newTicket.priority === 'P1' ? 5000 : 4000, `new-${newTicket.priority}`);
  return [newTicket, ...prev];
  }
  return prev;
 });
 }, 6000);
 return () => { clearInterval(timer); clearInterval(generator); };
 }, []);

 const addToast = (message: string, type: Toast['type'] = 'success', duration = 4000, groupKey?: string) => {
 const id = Date.now().toString() + Math.random().toString(36).substring(7);
 // Group similar toasts — if same groupKey exists, don't add duplicate immediately, group them
 setToasts(prev => {
 // Limit to 10 max, oldest removed
 const newToasts = [...prev, { id, message, type, duration, groupKey: groupKey || message.substring(0,30) }];
 if (newToasts.length > 10) return newToasts.slice(-10);
 return newToasts;
 });
 };

 const removeToast = (id: string) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 };

 const handleSelectTicket = (ticket: Ticket) => {
 setSelectedTicket(ticket);
 setSelectedClientForPolicies(ticket.clientId);
 setChecklist({ logs: false, tool: false, lang: false, confirm: false });
 addToast(`Opened ${ticket.code} — ${ticket.clientName} • ${ticket.userEmail} • ${ticket.tags.includes('business-hours') ? 'Business Hours' : '24/7'}`, 'info', 3000, `open-${ticket.code}`);
 };

 const handleAssign = (ticketId: string, agentId: string) => {
 setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: agentId, status: 'assigned' as const } : t));
 const agent = agents.find(a => a.id === agentId);
 const ticket = tickets.find(t => t.id === ticketId);
 if (ticket) setSelectedTicket({ ...ticket, assignedTo: agentId, status: 'assigned' });
 addToast(`Assigned ${ticketId.substring(0,8)} to ${agent?.name || agentId} — assigned`, 'success', 3000, `assign-${ticketId}`);
 setAgents(prev => prev.map(a => a.id === agentId ? { ...a, currentTickets: Math.min(a.maxTickets, a.currentTickets + 1), weeklyHours: a.weeklyHours + 1 } : a));
 
 setProgress(prev => ({
 ...prev,
 history: [...prev.history, { timestamp: Date.now(), action: `Assigned ${ticketId.substring(0,8)} to ${agent?.name}`, ticketCode: ticketId.substring(0,8) }].slice(-50),
 }));
 };

 const handleResolve = () => {
 if (!selectedTicket) return;
 if (!checklist.logs) { addToast('Check logs first — required for QA. Open Sign-in Logs CA tab.', 'error', 4000, 'check-logs'); return; }
 if (!checklist.tool) { addToast('Use correct tool — required. Check Intune/Exchange per ticket.', 'error', 4000, 'check-tool'); return; }
 
 const actions = { checkedLogsFirst: checklist.logs, usedCorrectTool: checklist.tool, usedClientLanguage: checklist.lang, confirmedResolution: checklist.confirm, documentedKB: false };
 const csat = calculateCSAT(selectedTicket, actions);
 const qa = checklist.logs && checklist.tool ? (checklist.lang ? 92 : 75) : 55;
 const isBreached = selectedTicket.slaBreach;
 
 setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'resolved' as const, csat, qaScore: qa } : t));
 setResolvedCount(c => c + 1);
 
 // Update progress — saved for assessment
 setProgress(prev => {
 const newResolved = prev.ticketsResolved + 1;
 const newBreached = isBreached ? prev.ticketsBreached + 1 : prev.ticketsBreached;
 const newAvgCSAT = ((prev.avgCSAT * prev.ticketsResolved) + csat) / newResolved;
 const newAvgQA = ((prev.avgQA * prev.ticketsResolved) + qa) / newResolved;
 const xpGain = isBreached ? 10 : qa >= 90 ? 30 : qa >= 75 ? 20 : 10;
 const newXp = prev.xp + xpGain + (checklist.lang ? 10 : 0);
 
 return {
  ...prev,
  ticketsResolved: newResolved,
  ticketsBreached: newBreached,
  avgCSAT: newAvgCSAT,
  avgQA: newAvgQA,
  xp: newXp,
  level: calculateLevel(newXp),
  slaCompliance: Math.round((newResolved / (newResolved + newBreached)) * 100) || 100,
  communicationScores: {
  ...prev.communicationScores,
  technicalAccuracy: Math.round((prev.communicationScores.technicalAccuracy * prev.ticketsResolved + qa) / newResolved),
  clientLanguage: checklist.lang ? Math.min(100, prev.communicationScores.clientLanguage + 10) : prev.communicationScores.clientLanguage,
  },
  badges: getBadges({ ...prev, ticketsResolved: newResolved, avgCSAT: newAvgCSAT, avgQA: newAvgQA, xp: newXp } as any),
  history: [...prev.history, { 
  timestamp: Date.now(), 
  action: `Resolved ${selectedTicket.code} — CSAT ${csat} QA ${qa}% ${isBreached ? 'BREACHED' : ''}`, 
  ticketCode: selectedTicket.code,
  score: Math.round((csat * 20 + qa) / 2),
  }].slice(-50),
 };
 });
 
 addToast(`Resolved ${selectedTicket.code} — CSAT ${csat} ⭐ QA ${qa}% ${isBreached ? '⚠️ BREACHED -10 XP' : `+${qa >= 90 ? 30 : 20} XP`} — ${checklist.lang ? 'Client language used ✓' : 'Use client language next time'}`, isBreached ? 'warning' : 'success', 5000, `resolve-${selectedTicket.code}`);
 
 setTimeout(() => { 
 setTickets(prev => prev.filter(t => t.id !== selectedTicket.id)); 
 setSelectedTicket(null); 
 setChecklist({ logs: false, tool: false, lang: false, confirm: false }); 
 }, 1800);
 };

 const handlePortalAction = (action: string) => {
 setPortalActionLog(prev => [`${new Date().toLocaleTimeString()} — ${action}`, ...prev].slice(0,10));
 const groupKey = action.includes('BitLocker') ? 'bitlocker' : action.includes('Sign-in logs') ? 'signin-logs' : action.includes('Sync') ? 'sync' : action.substring(0,20);
 addToast(action, 'success', 3000, groupKey);
 
 if (action.includes('BitLocker') || action.includes('Enable encryption')) { 
 setChecklist(prev => ({ ...prev, tool: true })); 
 setBitLockerFixed(true);
 if (!checklist.tool) addToast('BitLocker enabled — RDP now Compliant ✓ — real linkage portal↔RDP', 'success', 4000, 'checklist-tool');
 }
 if (action.includes('Sign-in logs') || action.includes('Audit Logs') || action.includes('Message Trace')) { 
 setChecklist(prev => ({ ...prev, logs: true })); 
 if (!checklist.logs) addToast('Logs checked — checklist: Checked logs first ✓', 'info', 3000, 'checklist-logs');
 }
 if (action.includes('Release') || action.includes('Sync')) { 
 setChecklist(prev => ({ ...prev, tool: true })); 
 setSyncDone(true);
 }

 setProgress(prev => ({
 ...prev,
 history: [...prev.history, { timestamp: Date.now(), action, ticketCode: selectedTicket?.code }].slice(-50),
 }));
 };

 const handleResolveConflict = (agentId: string) => {
 setAgents(prev => prev.map(a => {
 if (a.id === agentId) return { ...a, mood: 'neutral' as const, conflictWith: undefined, weeklyHours: Math.max(0, a.weeklyHours - 1) };
 if (a.id === agents.find(x => x.id === agentId)?.conflictWith) return { ...a, mood: 'neutral' as const, conflictWith: undefined };
 return a;
 }));
 addToast(`Conflict resolved via 1:1 SBI — coaching, shadowing 2 tickets/day. Culture improved.`, 'success', 4000, `conflict-${agentId}`);
 
 setProgress(prev => ({
 ...prev,
 xp: prev.xp + 15,
 level: calculateLevel(prev.xp + 15),
 history: [...prev.history, { timestamp: Date.now(), action: `Resolved conflict for ${agentId} — SBI coaching` }].slice(-50),
 }));
 };

 const handleClientLanguageToggle = () => {
 setChecklist(prev => ({ ...prev, lang: !prev.lang }));
 addToast(checklist.lang ? 'Client language: OFF — CSAT may drop' : 'Client language: ON — simple steps, no jargon, emojis for SMB ✓', 'info', 3000, 'client-lang');
 };

 const handleCallScore = (scores: any, duration: number) => {
 setProgress(prev => {
 const newCalls = prev.callsHandled + 1;
 const avgEmpathy = Math.round((prev.communicationScores.empathy * prev.callsHandled + scores.avgEmpathy) / newCalls);
 const avgClarity = Math.round((prev.communicationScores.clarity * prev.callsHandled + scores.avgClarity) / newCalls);
 const avgTechnical = Math.round((prev.communicationScores.technicalAccuracy * prev.callsHandled + scores.avgTechnical) / newCalls);
 const avgFluency = Math.round((prev.communicationScores.fluency * prev.callsHandled + scores.avgFluency) / newCalls);
 const avgClientLang = Math.round((prev.communicationScores.clientLanguage * prev.callsHandled + scores.avgClientLang) / newCalls);
 const xpGain = scores.overall >= 80 ? 40 : scores.overall >= 60 ? 25 : 10;
 
 return {
  ...prev,
  callsHandled: newCalls,
  communicationScores: {
  empathy: avgEmpathy,
  clarity: avgClarity,
  technicalAccuracy: avgTechnical,
  fluency: avgFluency,
  clientLanguage: avgClientLang,
  },
  xp: prev.xp + xpGain,
  level: calculateLevel(prev.xp + xpGain),
  callScores: [...prev.callScores, { duration, empathy: scores.avgEmpathy, resolution: scores.overall, clientSatisfaction: scores.overall }].slice(-20),
  badges: getBadges({ ...prev, callsHandled: newCalls, xp: prev.xp + xpGain } as any),
  history: [...prev.history, { timestamp: Date.now(), action: `Call handled — Score ${scores.overall}/100 — Duration ${Math.floor(duration/60)}:${String(duration%60).padStart(2,'0')}`, score: scores.overall }].slice(-50),
 };
 });
 
 addToast(`Call scored ${scores.overall}/100 — Empathy ${scores.avgEmpathy} Clarity ${scores.avgClarity} Tech ${scores.avgTechnical} — ${scores.overall >= 80 ? '+40 XP Influx Ready!' : '+${scores.overall >= 60 ? 25 : 10} XP'}`, scores.overall >= 80 ? 'success' : 'info', 5000, `call-${Date.now()}`);
 };

 const handleResetProgress = () => {
 if (confirm('Reset all progress? This will clear XP, levels, badges, history — for new assessment.')) {
 const newProgress = { ...initialProgress, sessionId: `sess_${Math.random().toString(36).substring(7)}_${Date.now()}`, startTime: Date.now() };
 setProgress(newProgress);
 saveProgress(newProgress);
 addToast('Progress reset — new session started', 'info', 3000, 'reset');
 }
 };

 const pendingCount = tickets.filter(t => t.status !== 'resolved').length;
 const p1Count = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved').length;
 const breached = tickets.filter(t => t.slaBreach).length;

 const handleAuthenticated = (profile: any) => {
 setUserProfile(profile);
 setIsAuthenticated(true);
 localStorage.setItem('orbitdesk_user_profile', JSON.stringify(profile));
 addToast(`Welcome ${profile.name} — ${profile.role} • ${profile.experience} • progress restored: ${progress.ticketsResolved} tickets, ${progress.callsHandled} calls, Lvl ${progress.level}`, 'success', 4000, 'auth');
 };

 const handleLogout = () => {
 if (confirm('Logout? Your progress stays saved locally (tickets, XP, calls). Login again to restore. Export report for interview before logout.')) {
 localStorage.removeItem('orbitdesk_user_profile');
 setIsAuthenticated(false);
 setUserProfile(null);
 }
 };

 const triggerManualCall = () => {
 // Use global exposed by VoiceCallCenter for manual simulate button in header
 if ((window as any).triggerIncomingCall) {
 (window as any).triggerIncomingCall();
 addToast('Manual call triggered — guaranteed ring, YOU greet first', 'info', 3000, 'manual-call');
 } else {
 addToast('Call system initializing... wait 2s then try again — countdown widget bottom-right also has Simulate Call Now', 'info', 3000, 'manual-call-wait');
 }
 };

 if (!isAuthenticated) {
 return (
 <div className="min-h-screen relative">
  <LiveryBackground />
  <AuthGate onAuthenticated={handleAuthenticated} existingProgress={progress} />
 </div>
 );
 }

 return (
 <div className="min-h-screen text-zinc-100 flex flex-col relative">
 <LiveryBackground />
 <ToastSystem toasts={toasts} onRemove={removeToast} />

 <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-zinc-800/60">
  <div className="max-w-[1600px] mx-auto px-4 h-11 flex items-center justify-between">
  <div className="flex items-center gap-3">
  <Logo variant="full" size={28} animated />
  <span className="h-4 w-px bg-zinc-800 hidden md:block" />
  <div className="hidden md:flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[11px] font-medium tracking-widest text-zinc-400 uppercase">Modern Workplace Operations • Entra ID • Intune • Exchange</span></div>
  </div>
  <div className="flex items-center gap-2">
  <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20"><span className="h-1 w-1 rounded-full bg-violet-500 animate-pulse" /><span className="text-violet-300">Lvl {progress.level} • {progress.xp} XP • {progress.ticketsResolved} resolved • {progress.callsHandled} calls</span></div>
  <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-zinc-800/60 border border-zinc-700/50"><span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /><span className="text-zinc-400">{pendingCount} pending • {p1Count} P1 • {breached} breach • Live</span></div>
  <button onClick={triggerManualCall} className="h-7 px-3 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-[11px] text-red-300 font-bold transition flex items-center gap-1.5">📞 Simulate Call Now</button>
  <div className="hidden md:flex items-center gap-2 text-[11px] px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700">
   <span className="h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-[10px]">{userProfile?.name?.[0] || 'U'}</span>
   <span className="text-zinc-300 max-w-[80px] truncate">{userProfile?.name}</span>
   <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300 ml-1">↪</button>
  </div>
  </div>
  </div>
  <div className="max-w-[1600px] mx-auto px-4 h-10 flex items-center gap-1 border-t border-zinc-800/40">
  {[
  { id: 'overview', label: 'Overview', icon: '◍', badge: undefined },
  { id: 'queue', label: 'Live Queue', icon: '◐', badge: pendingCount },
  { id: 'comms', label: 'Comms', icon: '◑', badge: 3 },
  { id: 'clients', label: 'Clients', icon: '◒', badge: undefined },
  { id: 'class', label: 'Class Hub', icon: '👥', badge: 5 },
  { id: 'growth', label: 'Growth', icon: '🚀', badge: undefined },
  { id: 'assessment', label: 'Assessment', icon: '📊', badge: progress.ticketsResolved },
  ].map(tab => (
  <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`h-7 px-3 rounded-lg text-[12px] font-medium flex items-center gap-1.5 border transition-all ${activeTab === tab.id ? 'bg-violet-500/15 text-violet-300 border-violet-500/30' : 'bg-transparent text-zinc-500 border-transparent hover:bg-zinc-800/50 hover:text-zinc-300'}`}>
   <span>{tab.icon}</span>{tab.label}{tab.badge !== undefined && tab.badge > 0 && <span className="ml-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{tab.badge}</span>}
  </button>
  ))}
  <div className="ml-auto flex items-center gap-2">
  <button onClick={() => setStudentMode(!studentMode)} className={`h-7 px-3 rounded-full text-[11px] font-medium border transition ${studentMode ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/15 text-amber-300 border-amber-500/20'}`}>{studentMode ? 'Student Mode' : 'Expert Mode'}</button>
  <button onClick={() => setShowGuide(true)} className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300 transition">📚 Tutorial</button>
  <button onClick={() => window.location.href = '/'} className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300 transition">← Web</button>
  <InstallPromptV2 />
  </div>
  </div>
 </div>

 <div className="flex-1 max-w-[1600px] mx-auto w-full p-4">
  <AnimatePresence mode="wait">
  {activeTab === 'overview' && (
  <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
   <DashboardMetrics tickets={tickets} />
   <div className="grid grid-cols-12 gap-4">
   <div className="col-span-12 lg:col-span-8 space-y-4">
   <VoiceCallDemo />
   <ThreadHumor />
   </div>
   <div className="col-span-12 lg:col-span-4 space-y-4">
   <DesktopDownloadV2 />
   <div className="p-4 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800/60">
    <div className="flex items-center gap-3">
    <img src="/orbitdesk-logo-godmode-polished.png" alt="OrbitDesk" className="h-8 w-8 rounded-full object-cover border border-zinc-800" />
    <div>
    <h4 className="text-[13px] font-semibold text-zinc-100">Your Progress — Ready for Interview</h4>
    <p className="text-[11px] text-zinc-500">Track tickets, calls, and performance metrics</p>
    </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Tickets Resolved</p>
    <p className="text-[20px] font-bold text-white mt-1">{progress.ticketsResolved}</p>
    <p className="text-[10px] text-zinc-500 mt-1">Avg CSAT {progress.avgCSAT.toFixed(1)} • QA {progress.avgQA}%</p>
    </div>
    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
    <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Calls Handled</p>
    <p className="text-[20px] font-bold text-white mt-1">{progress.callsHandled}</p>
    <p className="text-[10px] text-zinc-500 mt-1">Level {progress.level} • {progress.xp} XP</p>
    </div>
    </div>
    <div className="mt-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
    <p className="text-[11px] text-violet-300 font-medium">Professional training environment — practice real M365 scenarios with guided workflows and performance tracking.</p>
    </div>
   </div>
   </div>
   </div>
  </motion.div>
  )}
  {activeTab === 'queue' && (
  <motion.div key="queue" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
   <div className="col-span-12 lg:col-span-4 h-full flex flex-col gap-3">
   <TicketQueue tickets={tickets} onSelectTicket={handleSelectTicket} onAssign={handleAssign} selectedTicketId={selectedTicket?.id} />
   <div className="p-3 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60">
   <div className="flex items-center justify-between mb-2"><div><p className="text-[12px] font-medium text-zinc-200">Remote Access — Real RDP Win11</p><p className="text-[11px] text-zinc-500">Stages: Connecting→Auth→MFA→Consent→Connected</p></div>
    <button onClick={() => { if (selectedTicket) { setShowRemotePC(true); addToast(`RDP connecting to ${selectedTicket.userEmail.split('@')[0]}-LAPTOP — encrypted, recording ON`, 'info', 3000, `rdp-${selectedTicket.id}`); } else { addToast('Select a ticket first — then Connect to open real RDP', 'error', 3000, 'rdp-error'); } }} className={`h-8 px-3 rounded-full text-[12px] font-semibold transition ${selectedTicket ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-800 text-zinc-500'}`}>Connect →</button>
   </div>
   {portalActionLog.length > 0 && <div className="mt-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800"><p className="text-[10px] font-semibold text-zinc-500 uppercase">Recent Portal Actions — Grouped</p><div className="mt-1 space-y-0.5">{portalActionLog.slice(0,3).map((log,i) => <p key={i} className="text-[11px] font-mono text-zinc-400">{log}</p>)}</div></div>}
   <div className="mt-2 flex gap-2">
    <button onClick={() => setShowLiveChat(!showLiveChat)} className={`flex-1 h-8 rounded-full text-[11px] font-medium border transition ${showLiveChat ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'}`}>
    {showLiveChat ? '💬 Hide Live Chat' : '💬 Show Live Chat Workstation — Teams/Slack style'}
    </button>
   </div>
   {showLiveChat && (
    <div className="mt-3 h-[280px] rounded-xl border border-zinc-800 overflow-hidden">
    <CommunicationChannel compact ticket={selectedTicket} />
    </div>
   )}
   </div>
   </div>
   <div className="col-span-12 lg:col-span-8 h-full grid grid-cols-12 gap-4">
   <div className="col-span-12 lg:col-span-5 h-full bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex flex-col">
   {selectedTicket ? <>
    <div className="p-4 border-b border-zinc-800/60"><div className="flex items-center gap-2 mb-2"><span className={`text-[11px] font-bold px-2 py-1 rounded-full ${selectedTicket.priority === 'P1' ? 'bg-red-500/15 text-red-300 border border-red-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>{selectedTicket.priority}</span><span className="text-[11px] font-mono text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">{selectedTicket.code}</span><span className="text-[11px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-full">{selectedTicket.clientName}</span><span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{selectedTicket.tags.includes('business-hours') ? 'Business Hours' : '24/7'}</span></div><h2 className="text-[14px] font-semibold text-zinc-100 leading-tight">{selectedTicket.title}</h2><p className="text-[13px] text-zinc-400 mt-2 leading-[1.4]">"{selectedTicket.userMessage}"</p><div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-500"><span className="font-mono bg-zinc-800 px-2 py-1 rounded-full border border-zinc-700">{selectedTicket.userEmail}</span><span>{Math.floor(selectedTicket.timeLeftMs/60000)}m left • {selectedTicket.tags.includes('business-hours') ? '9-5 Mon-Fri' : '24/7'} • Realistic SLA</span>{selectedTicket.assignedTo && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Assigned to {agents.find(a=>a.id===selectedTicket.assignedTo)?.name}</span>}</div></div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
    <div><h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-2">Required Tools — Real Actions (Grouped Toasts)</h4><div className="space-y-1.5">{selectedTicket.requiredTools.map(tool => <div key={tool} className="text-[12px] bg-zinc-900/50 border border-zinc-800/50 p-2.5 rounded-xl flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px]">✓</span> {tool}</span><button onClick={() => handlePortalAction(`Opened ${tool} for ${selectedTicket.code} — checked logs`)} className="h-6 px-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300">Open →</button></div>)}</div></div>
    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"><p className="text-[11px] font-medium text-amber-300">Root Cause — Real:</p><p className="text-[12px] text-zinc-400 mt-1 leading-[1.4]">{selectedTicket.rootCause}</p></div>
    <div className="p-3 rounded-xl bg-[#0a0a0a] border border-zinc-800"><h4 className="text-[11px] font-semibold text-zinc-200 mb-3 flex items-center justify-between">Resolve — Real Checklist + XP + Saved Progress<span className="text-[10px] font-normal text-zinc-500">{Object.values(checklist).filter(Boolean).length}/4 checked • Lvl {progress.level} • {progress.xp} XP</span></h4><div className="space-y-2.5">
    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.logs} onChange={e => { setChecklist(prev => ({ ...prev, logs: e.target.checked })); if (e.target.checked) addToast('Checked logs first ✓ — QA higher', 'success', 3000, 'checklist-logs'); }} className="rounded h-4 w-4" /><div><p className="text-[12px] text-zinc-200">Checked logs first (Sign-in Logs CA tab, Audit Logs)</p><p className="text-[11px] text-zinc-500">Required — always check logs before fix +10 XP</p></div></label>
    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.tool} onChange={e => { setChecklist(prev => ({ ...prev, tool: e.target.checked })); if (e.target.checked) addToast('Used correct tool ✓ — Intune/Exchange', 'success', 3000, 'checklist-tool'); }} className="rounded h-4 w-4" /><div><p className="text-[12px] text-zinc-200">Used correct tool (Intune, Message Trace, What If)</p><p className="text-[11px] text-zinc-500">Required — wrong tool = QA drop +20 XP if QA≥75</p></div></label>
    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.lang} onChange={() => handleClientLanguageToggle()} className="rounded h-4 w-4" /><div><p className="text-[12px] text-zinc-200">Used client language (simple Bloom, technical NovaTech, SEC-2024-07 Apex)</p><p className="text-[11px] text-zinc-500">Boosts CSAT +10 XP — Bloom no jargon + emojis</p></div></label>
    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.confirm} onChange={e => setChecklist(prev => ({ ...prev, confirm: e.target.checked }))} className="rounded h-4 w-4" /><div><p className="text-[12px] text-zinc-200">Confirmed resolution with user + documented</p><p className="text-[11px] text-zinc-500">Ensures 5 stars, prevents reopen</p></div></label>
    </div><button onClick={handleResolve} className={`w-full mt-4 h-10 rounded-xl text-[13px] font-semibold transition ${checklist.logs && checklist.tool ? 'bg-zinc-100 text-zinc-900 hover:bg-white shadow' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>{checklist.logs && checklist.tool ? `Resolve → CSAT + QA + XP (Saved for Assessment)` : 'Check required boxes first — logs + tool required'}</button><p className="text-[10px] text-zinc-600 mt-2 text-center">Every resolve commits real CSAT ⭐ QA % → XP → Level → saved for final assessment → toast grouped not stuck</p></div>
    </div>
   </> : <div className="flex-1 flex items-center justify-center p-8 text-center"><div><div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-3"><span className="text-zinc-500">◍</span></div><p className="text-[13px] font-medium text-zinc-300">Select a ticket — action commits real + XP + saved</p><p className="text-[11px] text-zinc-500 mt-1">Click ticket in left queue → detail → portals → checklist → Resolve → toast grouped + CSAT + XP + saved progress</p></div></div>}
   </div>
   <div className="col-span-12 lg:col-span-7 h-full"><MockPortals ticket={selectedTicket} onAction={handlePortalAction} /></div>
   </div>
  </motion.div>
  )}
  {activeTab === 'comms' && <motion.div key="comms" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="h-[calc(100vh-120px)]"><CommunicationChannel /></motion.div>}
  {activeTab === 'clients' && <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]"><div className="col-span-12 lg:col-span-5 h-full"><PolicyCenter selectedClientId={selectedClientForPolicies} onSelectClient={setSelectedClientForPolicies} /></div><div className="col-span-12 lg:col-span-7 h-full"><AgentRoster agents={agents} onResolveConflict={handleResolveConflict} onAssign={(ticketId, agentId) => handleAssign(ticketId, agentId)} tickets={tickets} /></div></motion.div>}
  {activeTab === 'class' && <motion.div key="class" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="h-[calc(100vh-120px)]"><ClassCommandCenter myProgress={progress} userProfile={userProfile} /></motion.div>}
  {activeTab === 'growth' && <motion.div key="growth" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="h-[calc(100vh-120px)] overflow-y-auto"><GrowthStrategy /></motion.div>}
  {activeTab === 'assessment' && <motion.div key="assessment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="h-[calc(100vh-120px)] overflow-y-auto"><AssessmentReport progress={progress} onReset={handleResetProgress} /></motion.div>}
  </AnimatePresence>
 </div>
 {showGuide && <StudentModeGuide onClose={() => setShowGuide(false)} />}
 <VoiceCallCenter tickets={tickets} onAccept={handleSelectTicket} />
 <RemoteDesktopV2 ticket={selectedTicket} isOpen={showRemotePC} onClose={() => setShowRemotePC(false)} onAction={handlePortalAction} bitLockerFixed={bitLockerFixed} syncDone={syncDone} />
 <div className="border-t border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur mt-8"><div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[11px] text-zinc-600"><span>OrbitDesk — Modern Workplace Operations Lab</span><span className="font-mono">Lvl {progress.level} • {progress.xp} XP • {progress.ticketsResolved} resolved • {progress.callsHandled} calls • Grade {progress.ticketsResolved > 0 ? Math.round((progress.avgCSAT*20+progress.avgQA+progress.slaCompliance)/3) : 0}/100 • 7 routes • Livery + Humour</span></div></div>
 </div>
 );
}
