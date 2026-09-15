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
import { StudentProgress, loadProgress, saveProgress, calculateLevel, getBadges, initialProgress, getLevelInfo } from '@/lib/progressEngine';
import Logo from '@/components/Logo';
import RemoteDesktopV2 from '@/components/RemoteDesktopV2';
import StudentModeGuide from '@/components/StudentModeGuide';
import LiveryBackground from '@/components/LiveryBackground';
import ThreadHumor from '@/components/ThreadHumor';
import AuthGate from '@/components/AuthGate';
import ClassCommandCenter from '@/components/ClassCommandCenter';
import GrowthStrategy from '@/components/GrowthStrategy';
import LevelUpCelebration from '@/components/LevelUpCelebration';
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt';
import OrbitPauseOverlay, { AwayWelcomeBack } from '@/components/OrbitPauseOverlay';
import ShiftStatus from '@/components/ShiftStatus';
import LinkedInChatDock from '@/components/LinkedInChatDock';

type Tab = 'overview' | 'queue' | 'comms' | 'clients' | 'class' | 'growth' | 'assessment';

export default function HomeV3() {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [userProfile, setUserProfile] = useState<any>(null);
 const [tickets, setTickets] = useState<Ticket[]>([]);
 const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
 const [activeTab, setActiveTab] = useState<Tab>('queue');
 const [agents, setAgents] = useState(initialAgents);
 const [showRemotePC, setShowRemotePC] = useState(false);
 const [selectedClientForPolicies, setSelectedClientForPolicies] = useState('client-a');
 const [toasts, setToasts] = useState<Toast[]>([]);
 const [checklist, setChecklist] = useState({ logs: false, tool: false, lang: false, confirm: false });
 const [portalActionLog, setPortalActionLog] = useState<string[]>([]);
 const [progress, setProgress] = useState<StudentProgress>(initialProgress);
 const [bitLockerFixed, setBitLockerFixed] = useState(false);
 const [syncDone, setSyncDone] = useState(false);
 const [studentMode, setStudentMode] = useState(true);
 const [showGuide, setShowGuide] = useState(true);
 const [levelUp, setLevelUp] = useState<{ oldLevel: number; newLevel: number } | null>(null);
 const [isPaused, setIsPaused] = useState(false);
 const [isManualPaused, setIsManualPaused] = useState(false);
 const [awayMinutes, setAwayMinutes] = useState(0);
 const [showAwayWelcome, setShowAwayWelcome] = useState<{ minutes: number; added: number } | null>(null);
 const [lastActive, setLastActive] = useState<number>(Date.now());

 useEffect(() => {
 const savedProfile = localStorage.getItem('orbitdesk_user_profile');
 if (savedProfile) {
 try { setUserProfile(JSON.parse(savedProfile)); setIsAuthenticated(true); } catch {}
 }
 }, []);

 useEffect(() => {
 if (!isAuthenticated) return;
 const saved = loadProgress();
 setProgress(saved);
 setTickets(generateInitialTickets(5, studentMode, saved.ticketsResolved, saved.level));
 }, [studentMode, isAuthenticated]);

 useEffect(() => { saveProgress(progress); }, [progress]);

 useEffect(() => {
 if (isPaused) return;
 const timer = setInterval(() => setTickets(prev => updateTicketTimers(prev)), 1000);
 const generator = setInterval(() => {
 setTickets(prev => {
  if (Math.random() < 0.2 && prev.length < 25) {
  const newTicket = generateTicket(studentMode, progress.ticketsResolved, progress.level);
  addToast(`New ${newTicket.priority}: ${newTicket.code} — ${newTicket.title.substring(0,40)}... [${newTicket.difficulty}]`, 'info', newTicket.priority === 'P1' ? 5000 : 4000, `new-${newTicket.priority}`);
  return [newTicket, ...prev];
  }
  return prev;
 });
 }, 6000);
 return () => { clearInterval(timer); clearInterval(generator); };
 }, [progress.ticketsResolved, progress.level, studentMode, isPaused]);

 useEffect(() => {
 if (!isAuthenticated) return;
 const storedLast = localStorage.getItem('orbitdesk_last_active');
 if (storedLast) {
  const last = parseInt(storedLast, 10);
  const now = Date.now();
  const diffMs = now - last;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin >= 1) {
   setTickets(prev => prev.map(t => ({ ...t, slaDeadline: new Date(t.slaDeadline.getTime() + diffMs), timeLeftMs: t.timeLeftMs + diffMs })));
   setAwayMinutes(diffMin);
   const added = diffMin >= 5 ? Math.min(3, Math.floor(diffMin / 10)) : 0;
   if (added > 0) {
    const newOnes = Array.from({ length: added }).map(() => generateTicket(studentMode, progress.ticketsResolved, progress.level));
    setTickets(prev => [...newOnes, ...prev]);
   }
   setShowAwayWelcome({ minutes: diffMin, added });
   addToast(`👋 Welcome back! Away ${diffMin}m — SLAs protected, ${added} new tickets`, 'info', 6000, 'welcome-back');
  }
 }
 const saveActive = () => { localStorage.setItem('orbitdesk_last_active', Date.now().toString()); setLastActive(Date.now()); };
 const activeInterval = setInterval(saveActive, 10000);
 const handleVisibility = () => {
  if (document.hidden) {
   if (!isManualPaused) { setIsPaused(true); saveActive(); document.title = '⏸️ Paused — OrbitDesk'; }
  } else {
   const stored = localStorage.getItem('orbitdesk_last_active');
   const now = Date.now();
   const last = stored ? parseInt(stored, 10) : lastActive;
   const diffMs = now - last;
   const diffMin = Math.floor(diffMs / 60000);
   if (diffMin >= 1 && isPaused && !isManualPaused) {
    setTickets(prev => prev.map(t => ({ ...t, slaDeadline: new Date(t.slaDeadline.getTime() + diffMs), timeLeftMs: t.timeLeftMs + diffMs })));
    setAwayMinutes(diffMin);
    const added = diffMin >= 5 ? Math.min(3, Math.floor(diffMin / 10)) : 0;
    if (added > 0) { const newOnes = Array.from({ length: added }).map(() => generateTicket(studentMode, progress.ticketsResolved, progress.level)); setTickets(prev => [...newOnes, ...prev]); }
    setShowAwayWelcome({ minutes: diffMin, added });
    addToast(`▶️ Resumed — away ${diffMin}m, SLAs protected`, 'success', 4000, 'resume');
   }
   if (!isManualPaused) { setIsPaused(false); document.title = 'OrbitDesk — Modern Workplace Operations Lab'; }
   saveActive();
  }
 };
 document.addEventListener('visibilitychange', handleVisibility);
 return () => { clearInterval(activeInterval); document.removeEventListener('visibilitychange', handleVisibility); };
 }, [isAuthenticated, isPaused, isManualPaused, lastActive, studentMode, progress.ticketsResolved, progress.level]);

 const addToast = (message: string, type: Toast['type'] = 'success', duration = 4000, groupKey?: string) => {
 const id = Date.now().toString() + Math.random().toString(36).substring(7);
 setToasts(prev => { const n = [...prev, { id, message, type, duration, groupKey: groupKey || message.substring(0,30) }]; return n.length > 10 ? n.slice(-10) : n; });
 };
 const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

 const handleSelectTicket = (ticket: Ticket) => {
 setSelectedTicket(ticket);
 setSelectedClientForPolicies(ticket.clientId);
 setChecklist({ logs: false, tool: false, lang: false, confirm: false });
 addToast(`Opened ${ticket.code} • ${ticket.clientName}`, 'info', 3000, `open-${ticket.code}`);
 };
 const handleAssign = (ticketId: string, agentId: string) => {
 setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignedTo: agentId, status: 'assigned' as const } : t));
 const agent = agents.find(a => a.id === agentId);
 const ticket = tickets.find(t => t.id === ticketId);
 if (ticket) setSelectedTicket({ ...ticket, assignedTo: agentId, status: 'assigned' });
 addToast(`Assigned to ${agent?.name || agentId}`, 'success', 3000, `assign-${ticketId}`);
 setAgents(prev => prev.map(a => a.id === agentId ? { ...a, currentTickets: Math.min(a.maxTickets, a.currentTickets + 1) } : a));
 setProgress(prev => ({ ...prev, history: [...prev.history, { timestamp: Date.now(), action: `Assigned ${ticketId.substring(0,8)} to ${agent?.name}`, ticketCode: ticketId.substring(0,8) }].slice(-50) }));
 };
 const handleResolve = () => {
 if (!selectedTicket) return;
 if (!checklist.logs) { addToast('Check logs first — Sign-in Logs CA tab', 'error', 4000, 'check-logs'); return; }
 if (!checklist.tool) { addToast('Use correct tool — Intune/Exchange', 'error', 4000, 'check-tool'); return; }
 const actions = { checkedLogsFirst: checklist.logs, usedCorrectTool: checklist.tool, usedClientLanguage: checklist.lang, confirmedResolution: checklist.confirm, documentedKB: false };
 const csat = calculateCSAT(selectedTicket, actions);
 const qa = checklist.logs && checklist.tool ? (checklist.lang ? 92 : 75) : 55;
 const isBreached = selectedTicket.slaBreach;
 setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: 'resolved' as const, csat, qaScore: qa } : t));
 setProgress(prev => {
 const newResolved = prev.ticketsResolved + 1;
 const newBreached = isBreached ? prev.ticketsBreached + 1 : prev.ticketsBreached;
 const newAvgCSAT = ((prev.avgCSAT * prev.ticketsResolved) + csat) / newResolved;
 const newAvgQA = ((prev.avgQA * prev.ticketsResolved) + qa) / newResolved;
 const difficultyXp = selectedTicket.difficulty === 'beginner' ? 10 : selectedTicket.difficulty === 'intermediate' ? 20 : selectedTicket.difficulty === 'advanced' ? 30 : 50;
 const baseXp = isBreached ? 5 : qa >= 90 ? difficultyXp + 10 : qa >= 75 ? difficultyXp : Math.floor(difficultyXp/2);
 const xpGain = baseXp + (checklist.lang ? 10 : 0);
 const newXp = prev.xp + xpGain;
 const oldLevel = prev.level;
 const newLevel = calculateLevel(newXp);
 if (newLevel > oldLevel) { setTimeout(() => setLevelUp({ oldLevel, newLevel }), 800); addToast(`🚀 LEVEL UP! ${oldLevel} → ${newLevel} — ${getLevelInfo(newLevel).title}`, 'success', 6000, `levelup-${newLevel}`); }
 return { ...prev, ticketsResolved: newResolved, ticketsBreached: newBreached, avgCSAT: newAvgCSAT, avgQA: newAvgQA, xp: newXp, level: newLevel, slaCompliance: Math.round((newResolved / (newResolved + newBreached)) * 100) || 100, communicationScores: { ...prev.communicationScores, technicalAccuracy: Math.round((prev.communicationScores.technicalAccuracy * prev.ticketsResolved + qa) / newResolved), clientLanguage: checklist.lang ? Math.min(100, prev.communicationScores.clientLanguage + 10) : prev.communicationScores.clientLanguage }, badges: getBadges({ ...prev, ticketsResolved: newResolved, avgCSAT: newAvgCSAT, avgQA: newAvgQA, xp: newXp } as any), history: [...prev.history, { timestamp: Date.now(), action: `Resolved ${selectedTicket.code} [${selectedTicket.difficulty}] +${xpGain} XP`, ticketCode: selectedTicket.code, score: Math.round((csat * 20 + qa) / 2) }].slice(-50) };
 });
 addToast(`Resolved ${selectedTicket.code} [${selectedTicket.difficulty}] +${selectedTicket.difficulty === 'expert' ? 50 : selectedTicket.difficulty === 'advanced' ? 30 : selectedTicket.difficulty === 'intermediate' ? 20 : 10} XP`, isBreached ? 'warning' : 'success', 5000, `resolve-${selectedTicket.code}`);
 setTimeout(() => { setTickets(prev => prev.filter(t => t.id !== selectedTicket.id)); setSelectedTicket(null); setChecklist({ logs: false, tool: false, lang: false, confirm: false }); }, 1200);
 };
 const handlePortalAction = (action: string) => {
 setPortalActionLog(prev => [`${new Date().toLocaleTimeString()} — ${action}`, ...prev].slice(0,10));
 addToast(action, 'success', 3000, action.substring(0,20));
 if (action.includes('BitLocker') || action.includes('Enable encryption')) { setChecklist(prev => ({ ...prev, tool: true })); setBitLockerFixed(true); }
 if (action.includes('Sign-in logs') || action.includes('Audit Logs') || action.includes('Message Trace')) { setChecklist(prev => ({ ...prev, logs: true })); }
 if (action.includes('Release') || action.includes('Sync')) { setChecklist(prev => ({ ...prev, tool: true })); setSyncDone(true); }
 setProgress(prev => ({ ...prev, history: [...prev.history, { timestamp: Date.now(), action, ticketCode: selectedTicket?.code }].slice(-50) }));
 };
 const handleResolveConflict = (agentId: string) => {
 setAgents(prev => prev.map(a => { if (a.id === agentId) return { ...a, mood: 'neutral' as const, conflictWith: undefined }; if (a.id === agents.find(x => x.id === agentId)?.conflictWith) return { ...a, mood: 'neutral' as const, conflictWith: undefined }; return a; }));
 addToast('Conflict resolved via SBI coaching', 'success', 4000, `conflict-${agentId}`);
 setProgress(prev => { const newXp = prev.xp + 15; const oldLevel = prev.level; const newLevel = calculateLevel(newXp); if (newLevel > oldLevel) setTimeout(() => setLevelUp({ oldLevel, newLevel }), 500); return { ...prev, xp: newXp, level: newLevel, history: [...prev.history, { timestamp: Date.now(), action: `Resolved conflict ${agentId}` }].slice(-50) }; });
 };
 const handleClientLanguageToggle = () => { setChecklist(prev => ({ ...prev, lang: !prev.lang })); };
 const handleResetProgress = () => { if (confirm('Reset progress?')) { const np = { ...initialProgress, sessionId: `sess_${Math.random().toString(36).substring(7)}_${Date.now()}`, startTime: Date.now() }; setProgress(np); saveProgress(np); } };
 const handleAuthenticated = (profile: any) => { setUserProfile(profile); setIsAuthenticated(true); localStorage.setItem('orbitdesk_user_profile', JSON.stringify(profile)); };
 const handleLogout = () => { if (confirm('Logout? Progress saved locally.')) { localStorage.removeItem('orbitdesk_user_profile'); setIsAuthenticated(false); setUserProfile(null); } };
 const toggleManualPause = () => {
 if (isPaused && isManualPaused) { setIsPaused(false); setIsManualPaused(false); document.title = 'OrbitDesk — Modern Workplace Operations Lab'; addToast('▶️ Resumed', 'success', 2000, 'resume'); const stored = localStorage.getItem('orbitdesk_last_active'); if (stored) { const diff = Date.now() - parseInt(stored, 10); if (diff > 10000) setTickets(prev => prev.map(t => ({ ...t, slaDeadline: new Date(t.slaDeadline.getTime() + diff), timeLeftMs: t.timeLeftMs + diff }))); } }
 else { setIsPaused(true); setIsManualPaused(true); localStorage.setItem('orbitdesk_last_active', Date.now().toString()); document.title = '⏸️ On Hold — OrbitDesk'; addToast('⏸️ On hold — break', 'info', 3000, 'pause'); }
 };
 const triggerManualCall = () => { if ((window as any).triggerIncomingCall) { (window as any).triggerIncomingCall(); addToast('Call triggered', 'info', 2000, 'call'); } };

 const pendingCount = tickets.filter(t => t.status !== 'resolved').length;
 const p1Count = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved').length;
 const breached = tickets.filter(t => t.slaBreach).length;

 if (!isAuthenticated) {
 return <div className="min-h-screen relative"><LiveryBackground /><AuthGate onAuthenticated={handleAuthenticated} existingProgress={progress} /></div>;
 }

 const tabs: any[] = [
 { id: 'overview', label: 'Overview', icon: '◍' },
 { id: 'queue', label: 'Queue', icon: '◐', badge: pendingCount },
 { id: 'comms', label: 'Comms', icon: '◑' },
 { id: 'clients', label: 'Clients', icon: '◒' },
 { id: 'class', label: 'Class', icon: '👥' },
 { id: 'growth', label: 'Growth', icon: '🚀' },
 { id: 'assessment', label: 'Report', icon: '📊', badge: progress.ticketsResolved },
 ];

 return (
 <div className="min-h-screen flex flex-col text-zinc-100 relative">
 <LiveryBackground />
 <ToastSystem toasts={toasts} onRemove={removeToast} />
 <PWAUpdatePrompt />
 <OrbitPauseOverlay isPaused={isPaused} isManual={isManualPaused} awayMinutes={awayMinutes} pendingCount={pendingCount} onResume={toggleManualPause} />
 {showAwayWelcome && <AwayWelcomeBack awayMinutes={showAwayWelcome.minutes} ticketsAdded={showAwayWelcome.added} onClose={() => setShowAwayWelcome(null)} />}

 {/* Modern Header — Single row, clean */}
 <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0a0a0a]/80 border-b border-zinc-800/50">
  <div className="max-w-[1600px] mx-auto px-5 h-[56px] flex items-center justify-between gap-4">
   <div className="flex items-center gap-4">
    <Logo variant="full" size={30} animated />
    <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-zinc-800">
     {tabs.map(tab => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`h-8 px-3.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all ${activeTab === tab.id ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'}`}>
       <span className="text-[11px]">{tab.icon}</span>{tab.label}{tab.badge ? <span className={`ml-1 h-4 min-w-[16px] px-1 rounded-full text-[10px] flex items-center justify-center ${activeTab === tab.id ? 'bg-zinc-900 text-white' : 'bg-red-500 text-white'}`}>{tab.badge}</span> : null}
      </button>
     ))}
    </div>
   </div>

   <div className="flex items-center gap-2">
    <div className="hidden md:flex items-center gap-2">
     <div className="flex items-center gap-2 h-8 px-3 rounded-full bg-zinc-900 border border-zinc-800">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">{progress.level}</div>
      <span className="text-[11px] text-zinc-300 font-medium">{getLevelInfo(progress.level).title}</span>
      <span className="text-[10px] text-zinc-500">• {progress.xp} XP</span>
      <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden ml-1"><div className="h-full bg-violet-500" style={{ width: `${progress.xp % 100}%` }} /></div>
     </div>
     <div className={`h-8 px-3 rounded-full border flex items-center gap-1.5 text-[11px] ${isPaused ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />{isPaused ? 'Paused' : `${pendingCount} • ${p1Count} P1 • Live`}
     </div>
    </div>
    <button onClick={toggleManualPause} className={`h-8 w-8 rounded-full border flex items-center justify-center transition ${isPaused ? 'bg-amber-500 text-zinc-900 border-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'}`} title={isPaused ? 'Resume' : 'Pause'}>{isPaused ? '▶️' : '⏸️'}</button>
    <button onClick={triggerManualCall} className="h-8 w-8 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 flex items-center justify-center transition" title="Simulate Call">📞</button>
    <div className="h-8 w-px bg-zinc-800 mx-1 hidden md:block" />
    <button onClick={() => setStudentMode(!studentMode)} className={`hidden md:flex h-8 px-3 rounded-full text-[11px] font-medium border transition ${studentMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>{studentMode ? 'Student' : 'Expert'}</button>
    <div className="flex items-center gap-2 h-8 pl-2 pr-1 rounded-full bg-zinc-900 border border-zinc-800">
     <span className="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-bold">{userProfile?.name?.[0] || 'U'}</span>
     <span className="hidden md:block text-[11px] text-zinc-300 max-w-[80px] truncate">{userProfile?.name}</span>
     <button onClick={handleLogout} className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-500">↪</button>
    </div>
   </div>
  </div>

  {/* Mobile tabs */}
  <div className="lg:hidden border-t border-zinc-800/50 px-3 h-10 flex items-center gap-1 overflow-x-auto">
   {tabs.map(tab => (
    <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={`h-7 px-3 rounded-full text-[12px] font-medium whitespace-nowrap flex items-center gap-1.5 border ${activeTab === tab.id ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'text-zinc-500 border-transparent'}`}>{tab.icon} {tab.label}{tab.badge ? <span className="bg-red-500 text-white h-4 min-w-[14px] px-1 rounded-full text-[10px] flex items-center justify-center">{tab.badge}</span> : null}</button>
   ))}
  </div>
 </header>

 {/* Main — flex-1, no calc, no overlapping footer */}
 <main className="flex-1 min-h-0 max-w-[1600px] mx-auto w-full px-4 py-4 flex flex-col pb-[80px]">
  <AnimatePresence mode="wait">
   {activeTab === 'overview' && (
    <motion.div key="overview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4 flex-1">
     <ShiftStatus isPaused={isPaused} isManual={isManualPaused} ticketsResolved={progress.ticketsResolved} level={progress.level} xp={progress.xp} pendingCount={pendingCount} awayMinutes={awayMinutes} onTogglePause={toggleManualPause} />
     <DashboardMetrics tickets={tickets} />
     <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8 space-y-4"><VoiceCallDemo /><ThreadHumor /></div>
      <div className="col-span-12 lg:col-span-4 space-y-4">
       <DesktopDownloadV2 />
       <div className="p-4 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur border border-zinc-800/60">
        <div className="flex items-center gap-3"><img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-8 w-8 rounded-full object-cover" /><div><h4 className="text-[13px] font-semibold text-zinc-100">Progress — Interview Ready</h4><p className="text-[11px] text-zinc-500">Tickets, calls, metrics</p></div></div>
        <div className="mt-4 grid grid-cols-2 gap-3">
         <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Resolved</p><p className="text-[20px] font-bold text-white">{progress.ticketsResolved}</p><p className="text-[10px] text-zinc-500">CSAT {progress.avgCSAT.toFixed(1)} • QA {progress.avgQA}%</p></div>
         <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Calls</p><p className="text-[20px] font-bold text-white">{progress.callsHandled}</p><p className="text-[10px] text-zinc-500">Lvl {progress.level} • {progress.xp} XP</p></div>
        </div>
       </div>
      </div>
     </div>
    </motion.div>
   )}

   {activeTab === 'queue' && (
    <motion.div key="queue" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
     {/* Left — Queue */}
     <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-3 min-h-0">
      <div className="flex-1 min-h-[400px]"><TicketQueue tickets={tickets} onSelectTicket={handleSelectTicket} onAssign={handleAssign} selectedTicketId={selectedTicket?.id} isPaused={isPaused} /></div>
      <div className="rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 p-3">
       <div className="flex items-center justify-between"><div><p className="text-[12px] font-medium text-zinc-200">Remote Access</p><p className="text-[11px] text-zinc-500">Win11 • Encrypted • MSP</p></div><button onClick={() => { if (selectedTicket) setShowRemotePC(true); }} className={`h-8 px-3 rounded-full text-[12px] font-semibold transition ${selectedTicket ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>Connect →</button></div>
       {portalActionLog.length > 0 && <div className="mt-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Recent Actions • Live</p><div className="mt-1 space-y-1">{portalActionLog.slice(0,3).map((l,i) => <p key={i} className="text-[11px] font-mono text-zinc-400 truncate">{l}</p>)}</div></div>}
       <p className="mt-2 text-[10px] text-zinc-600 text-center">💬 LinkedIn-style dock bottom-right → auto-opens live ticket</p>
      </div>
     </div>

     {/* Center — Ticket Detail */}
     <div className="w-full lg:w-[400px] flex-shrink-0 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 flex flex-col min-h-0 overflow-hidden">
      {selectedTicket ? (
       <>
        <div className="p-4 border-b border-zinc-800/50">
         <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${selectedTicket.priority === 'P1' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{selectedTicket.priority}</span>
          <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">{selectedTicket.code}</span>
          <span className={`text-[10px] px-2 py-1 rounded-full border ${(selectedTicket as any).difficulty === 'expert' ? 'bg-red-500/10 text-red-300 border-red-500/20' : (selectedTicket as any).difficulty === 'advanced' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : (selectedTicket as any).difficulty === 'intermediate' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>{(selectedTicket as any).difficulty}</span>
          <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{selectedTicket.clientName}</span>
         </div>
         <h2 className="text-[15px] font-semibold text-zinc-100 leading-tight">{selectedTicket.title}</h2>
         <p className="text-[13px] text-zinc-400 mt-2 leading-relaxed">"{selectedTicket.userMessage}"</p>
         <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
          <span className="font-mono bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">{selectedTicket.userEmail}</span>
          <span className="font-mono">{Math.floor(selectedTicket.timeLeftMs/60000)}m left</span>
         </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
         <div>
          <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-2">Tools</h4>
          <div className="space-y-2">{selectedTicket.requiredTools.map(t => <div key={t} className="text-[12px] bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-xl flex items-center justify-between"><span className="text-zinc-300">{t}</span><button onClick={() => handlePortalAction(`Opened ${t}`)} className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 border border-zinc-700">Open</button></div>)}</div>
         </div>
         <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"><p className="text-[11px] font-medium text-amber-300">Root Cause</p><p className="text-[12px] text-zinc-400 mt-1 leading-relaxed">{selectedTicket.rootCause}</p></div>
         <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
          <h4 className="text-[11px] font-semibold text-zinc-200 mb-3">Checklist • Lvl {progress.level} • {progress.xp} XP</h4>
          <div className="space-y-2">
           <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.logs} onChange={e => setChecklist(p => ({ ...p, logs: e.target.checked }))} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Checked logs first</p><p className="text-[11px] text-zinc-500">Sign-in Logs, Audit Logs</p></div></label>
           <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.tool} onChange={e => setChecklist(p => ({ ...p, tool: e.target.checked }))} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Used correct tool</p><p className="text-[11px] text-zinc-500">Intune / Exchange / What If</p></div></label>
           <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.lang} onChange={() => setChecklist(p => ({ ...p, lang: !p.lang }))} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Client language</p><p className="text-[11px] text-zinc-500">Simple for SMB, technical for Enterprise</p></div></label>
           <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer hover:border-zinc-700"><input type="checkbox" checked={checklist.confirm} onChange={e => setChecklist(p => ({ ...p, confirm: e.target.checked }))} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Confirmed resolution</p><p className="text-[11px] text-zinc-500">User confirmed + documented</p></div></label>
          </div>
          <button onClick={handleResolve} className={`w-full mt-4 h-10 rounded-full text-[13px] font-semibold transition ${checklist.logs && checklist.tool ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-800 text-zinc-500'}`}>Resolve Ticket →</button>
         </div>
        </div>
       </>
      ) : (
       <div className="flex-1 flex items-center justify-center p-8 text-center"><div><div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">◍</div><p className="text-[13px] font-medium text-zinc-300">Select a ticket</p><p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">Choose from queue left → investigate logs → fix in portals → resolve</p></div></div>
      )}
     </div>

     {/* Right — Portals */}
     <div className="flex-1 min-w-0 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 overflow-hidden flex flex-col min-h-[600px] lg:min-h-0"><MockPortals ticket={selectedTicket} onAction={handlePortalAction} /></div>
    </motion.div>
   )}

   {activeTab === 'comms' && <motion.div key="comms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-[600px]"><CommunicationChannel /></motion.div>}
   {activeTab === 'clients' && <motion.div key="clients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 grid lg:grid-cols-2 gap-4"><PolicyCenter selectedClientId={selectedClientForPolicies} onSelectClient={setSelectedClientForPolicies} /><AgentRoster agents={agents} onResolveConflict={handleResolveConflict} onAssign={(ticketId, agentId) => handleAssign(ticketId, agentId)} tickets={tickets} /></motion.div>}
   {activeTab === 'class' && <motion.div key="class" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-[600px]"><ClassCommandCenter myProgress={progress} userProfile={userProfile} /></motion.div>}
   {activeTab === 'growth' && <motion.div key="growth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto"><GrowthStrategy /></motion.div>}
   {activeTab === 'assessment' && <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto"><AssessmentReport progress={progress} onReset={handleResetProgress} /></motion.div>}
  </AnimatePresence>
 </main>

 {/* Clean Footer — No overlapping, simple, classy */}
 <footer className="mt-auto border-t border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
  <div className="max-w-[1600px] mx-auto px-5 h-11 flex items-center justify-between text-[11px] text-zinc-500">
   <div className="flex items-center gap-3">
    <span className="font-medium text-zinc-400">OrbitDesk</span>
    <span className="hidden md:inline w-px h-3 bg-zinc-800" />
    <span className="hidden md:inline">{getLevelInfo(progress.level).title} • {getLevelInfo(progress.level).orbitRings} rings</span>
    <span className="hidden md:inline w-px h-3 bg-zinc-800" />
    <span className="hidden md:inline">{progress.ticketsResolved < 5 ? 'Beginner' : progress.ticketsResolved < 10 ? 'Intermediate' : progress.ticketsResolved < 20 ? 'Advanced' : 'Expert'} • {isPaused ? 'Paused' : 'Live'}</span>
   </div>
   <div className="flex items-center gap-3 font-mono">
    <span>Lvl {progress.level} • {progress.xp} XP • {progress.ticketsResolved} ✓</span>
    <span className="hidden md:inline">• Grade {progress.ticketsResolved > 0 ? Math.round((progress.avgCSAT*20+progress.avgQA+progress.slaCompliance)/3) : 0}/100</span>
   </div>
  </div>
 </footer>

 {showGuide && <StudentModeGuide onClose={() => setShowGuide(false)} />}
 <VoiceCallCenter tickets={tickets} onAccept={handleSelectTicket} />
 <RemoteDesktopV2 ticket={selectedTicket} isOpen={showRemotePC} onClose={() => setShowRemotePC(false)} onAction={handlePortalAction} bitLockerFixed={bitLockerFixed} syncDone={syncDone} />
 {levelUp && <LevelUpCelebration oldLevel={levelUp.oldLevel} newLevel={levelUp.newLevel} xp={progress.xp} ticketsResolved={progress.ticketsResolved} onClose={() => setLevelUp(null)} />}
 <LinkedInChatDock ticket={selectedTicket} isPaused={isPaused} />
 </div>
 );
}
