'use client';
import { useReducer, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInitialTickets, generateTicket, updateTicketTimers, calculateCSAT } from '@/lib/ticketEngine';
import { loadProgress, saveProgress, calculateLevel, getBadges, initialProgress, getLevelInfo, calculateCommunicationScore } from '@/lib/progressEngine';
import { orbitReducer, initialOrbitState } from '@/lib/orbitReducer';
import { logPowerShellCommand } from '@/components/PowerShellHistory';
import { agents as initialAgents } from '@/data/agents';
import { detectLanguage, getTranslation, Language } from '@/lib/i18n';

// Components — modular, not spaghetti
import TicketQueue from '@/components/TicketQueue';
import MockPortals from '@/components/MockPortals';
import AgentRoster from '@/components/AgentRoster';
import CommunicationChannel from '@/components/CommunicationChannel';
import DashboardMetrics from '@/components/DashboardMetrics';
import VoiceCallCenter from '@/components/VoiceCallCenter';
import PolicyCenter from '@/components/PolicyCenter';
import VoiceCallDemo from '@/components/VoiceCallDemo';
import ToastSystem, { Toast } from '@/components/ToastSystem';
import AssessmentReport from '@/components/AssessmentReport';
import Logo from '@/components/Logo';
import RemoteDesktopV2 from '@/components/RemoteDesktopV2';
import StudentModeGuide from '@/components/StudentModeGuide';
import LiveryBackground from '@/components/LiveryBackground';
import FieldNotes from '@/components/FieldNotes';
import AuthGate from '@/components/AuthGate';
import ClassCommandCenter from '@/components/ClassCommandCenter';
import LevelUpCelebration from '@/components/LevelUpCelebration';
import PWAUpdatePrompt from '@/components/PWAUpdatePrompt';
import OrbitPauseOverlay, { AwayWelcomeBack } from '@/components/OrbitPauseOverlay';
import ShiftStatus from '@/components/ShiftStatus';
import LinkedInChatDock from '@/components/LinkedInChatDock';
import ProfileMenu from '@/components/ProfileMenu';
import ShortcutsHelp from '@/components/ShortcutsHelp';
import ClassCallDock from '@/components/ClassCallDock';
import LanguageSelector from '@/components/LanguageSelector';
import OUTreeView from '@/components/OUTreeView';
import ADUserProperties from '@/components/ADUserProperties';
import PowerShellHistory from '@/components/PowerShellHistory';
import EntraIDCenter from '@/components/EntraIDCenter';
import GPOManagement from '@/components/GPOManagement';
import IntuneDeviceCenter from '@/components/IntuneDeviceCenter';
import DesktopDownloadV2 from '@/components/DesktopDownloadV2';

export default function OrbitDeskV7() {
  // One reducer keeps lab state predictable.
  const [state, dispatch] = useReducer(orbitReducer, { ...initialOrbitState, progress: initialProgress });
  const [agents, setAgents] = useState(initialAgents);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [studentMode, setStudentMode] = useState(true);
  const [timeSpent, setTimeSpent] = useState(2);
  const [weaknesses, setWeaknesses] = useState<Record<string, number>>({ BitLocker: 2, Entra: 1, GPO: 0 });

  const t = (key: string) => getTranslation(lang, key);

  // Language
  useEffect(() => {
    setLang(detectLanguage());
    const h = (e: any) => setLang(e.detail);
    window.addEventListener('orbitdesk-language-change', h);
    return () => window.removeEventListener('orbitdesk-language-change', h);
  }, []);

  // Auth — load profile + progress
  useEffect(() => {
    const saved = localStorage.getItem('orbitdesk_user_profile');
    if (saved) try { const p = JSON.parse(saved); dispatch({ type: 'AUTHENTICATE', profile: p }); } catch {}
  }, []);

  useEffect(() => {
    if (!state.isAuthenticated) return;
    const saved = loadProgress();
    dispatch({ type: 'SET_PROGRESS', progress: saved });
    dispatch({ type: 'SET_TICKETS', tickets: generateInitialTickets(5, studentMode, saved.ticketsResolved, saved.level) });
    const hasProgress = saved.ticketsResolved > 0 || saved.xp > 20;
    const hasSeenGuide = localStorage.getItem('orbitdesk_guide_seen');
    if (!hasProgress && !hasSeenGuide) dispatch({ type: 'SET_SHOW_GUIDE', show: true });
  }, [state.isAuthenticated, studentMode]);

  useEffect(() => { if (state.progress) saveProgress(state.progress); }, [state.progress]);

  // Record simulated PowerShell activity.
  useEffect(() => {
    const h = (e: any) => dispatch({ type: 'ADD_PS_COMMAND', command: e.detail });
    window.addEventListener('orbitdesk-powershell', h as any);
    return () => window.removeEventListener('orbitdesk-powershell', h as any);
  }, []);

  // Keyboard shortcuts — accessibility
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key >= '1' && e.key <= '8') {
        const tabs = ['overview', 'queue', 'directory', 'comms', 'clients', 'class', 'assessment'] as const;
        const idx = parseInt(e.key) - 1;
        if (tabs[idx]) dispatch({ type: 'SET_ACTIVE_TAB', tab: tabs[idx] });
      }
      if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); togglePause(); }
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); (window as any).triggerIncomingCall?.(); }
      if (e.key === 'Escape') dispatch({ type: 'SELECT_TICKET', ticket: null });
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [state.isPaused]);

  // Update SLA timers and generate the next training case.
  useEffect(() => {
    if (state.isPaused || !state.isAuthenticated) return;
    const timer = setInterval(() => dispatch({ type: 'UPDATE_TICKET_TIMERS', updater: updateTicketTimers }), 1000);
    const generator = setInterval(() => {
      if (Math.random() < 0.2 && state.tickets.length < 25) {
        const newTicket = generateTicket(studentMode, state.progress.ticketsResolved, state.progress.level);
        addToast(`New ${newTicket.priority}: ${newTicket.code} — ${newTicket.title.substring(0,40)}... [${newTicket.difficulty}]`, 'info', newTicket.priority === 'P1' ? 5000 : 4000);
        dispatch({ type: 'ADD_TICKETS', tickets: [newTicket] });
      }
    }, 6000);
    return () => { clearInterval(timer); clearInterval(generator); };
  }, [state.tickets.length, state.progress?.ticketsResolved, state.progress?.level, studentMode, state.isPaused, state.isAuthenticated]);

  // Away handling — relativity clocks
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const storedLast = localStorage.getItem('orbitdesk_last_active');
    if (storedLast) {
      const diffMs = Date.now() - parseInt(storedLast, 10);
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin >= 1) {
        dispatch({ type: 'UPDATE_TICKET_TIMERS', updater: (prev) => prev.map(t => ({ ...t, slaDeadline: new Date(t.slaDeadline.getTime() + diffMs), timeLeftMs: t.timeLeftMs + diffMs })) });
        const added = diffMin >= 5 ? Math.min(3, Math.floor(diffMin / 10)) : 0;
        if (added > 0) {
          const newOnes = Array.from({ length: added }).map(() => generateTicket(studentMode, state.progress.ticketsResolved, state.progress.level));
          dispatch({ type: 'ADD_TICKETS', tickets: newOnes });
        }
        dispatch({ type: 'SET_AWAY', minutes: diffMin, welcome: { minutes: diffMin, added } });
        addToast(`👋 Welcome back! Away ${diffMin}m — SLAs protected, ${added} new tickets`, 'info', 6000);
      }
    }
    const saveActive = () => { localStorage.setItem('orbitdesk_last_active', Date.now().toString()); dispatch({ type: 'SET_LAST_ACTIVE', timestamp: Date.now() }); };
    const activeInterval = setInterval(saveActive, 10000);
    const handleVisibility = () => {
      if (document.hidden) {
        if (!state.isManualPaused) { dispatch({ type: 'SET_PAUSED', paused: true, manual: false }); saveActive(); document.title = '⏸️ Paused — OrbitDesk'; }
      } else {
        const stored = localStorage.getItem('orbitdesk_last_active');
        const now = Date.now();
        const last = stored ? parseInt(stored, 10) : state.lastActive;
        const diffMs = now - last;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin >= 1 && state.isPaused && !state.isManualPaused) {
          dispatch({ type: 'UPDATE_TICKET_TIMERS', updater: (prev) => prev.map(t => ({ ...t, slaDeadline: new Date(t.slaDeadline.getTime() + diffMs), timeLeftMs: t.timeLeftMs + diffMs })) });
          dispatch({ type: 'SET_AWAY', minutes: diffMin, welcome: { minutes: diffMin, added: Math.min(3, Math.floor(diffMin/10)) } });
        }
        if (!state.isManualPaused) { dispatch({ type: 'SET_PAUSED', paused: false, manual: false }); document.title = 'OrbitDesk — Modern Workplace Operations Lab'; }
        saveActive();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => { clearInterval(activeInterval); document.removeEventListener('visibilitychange', handleVisibility); };
  }, [state.isAuthenticated, state.isPaused, state.isManualPaused, state.lastActive]);

  // Toasts
  const addToast = (message: string, type: Toast['type'] = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type, duration, groupKey: message.substring(0,30) }].slice(-10));
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // Bounded state transitions for ticket actions.
  const handleSelectTicket = (ticket: any) => {
    dispatch({ type: 'SELECT_TICKET', ticket });
    dispatch({ type: 'SET_SELECTED_CLIENT', clientId: ticket.clientId });
    addToast(`Opened ${ticket.code} • ${ticket.clientName}`, 'info', 3000);
  };

  const handleAssign = (ticketId: string, agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    dispatch({ type: 'ASSIGN_TICKET', ticketId, agentId, agentName: agent?.name || agentId });
    addToast(`Assigned to ${agent?.name || agentId}`, 'success', 3000);
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, currentTickets: Math.min(a.maxTickets, a.currentTickets + 1) } : a));
  };

  const handleResolve = () => {
    if (!state.selectedTicket) return;
    if (!state.checklist.logs) { addToast('Check logs first — Sign-in Logs CA tab', 'error', 4000); return; }
    if (!state.checklist.tool) { addToast('Use correct tool — Intune/Exchange', 'error', 4000); return; }

    const actions = { checkedLogsFirst: state.checklist.logs, usedCorrectTool: state.checklist.tool, usedClientLanguage: state.checklist.lang, confirmedResolution: state.checklist.confirm, documentedKB: false };
    const csat = calculateCSAT(state.selectedTicket, actions);
    const clientPersona = state.selectedTicket.clientId === 'client-b' ? 'smb' as const : state.selectedTicket.clientId === 'client-c' ? 'regulated' as const : 'enterprise' as const;

    let syntheticMessage = '';
    if (clientPersona === 'smb') syntheticMessage = state.checklist.lang ? `Hi! I understand this is frustrating 😅 — sorry! Simple steps: 1. Company Portal 2. Check Status 3. Wait 2 mins sync. Happy to help!` : `Checked logs. Fixed. Try Company Portal.`;
    else if (clientPersona === 'regulated') syntheticMessage = state.checklist.lang ? `Per SEC-2024-07, checked Sign-in logs CA tab DeviceNotCompliant 53000, audit verified. RCA: policy without Report-Only. Remediation: reverted Report-Only What-If safe 15min expiry. Confirm escrow. Thank you.` : `Checked logs. Fixed policy.`;
    else syntheticMessage = state.checklist.lang ? `I understand payroll blocking — sorry. Checked Sign-in logs CA tab correlation ID ${state.selectedTicket.code} DeviceNotCompliant 53000. RCA: CA policy Require compliant without Report-Only. What-If safe revert. Fixed Intune sync. Confirm — appreciate patience!` : `Checked Sign-in logs. Fixed.`;

    if (state.portalActionLog.length > 0) syntheticMessage += ` Actions: ${state.portalActionLog.slice(0,3).join('; ')}`;

    const advancedScores = calculateCommunicationScore(syntheticMessage, clientPersona, { usedClientLanguage: state.checklist.lang, checkedLogs: state.checklist.logs, usedCorrectTool: state.checklist.tool });
    const qa = Math.round((advancedScores.technicalAccuracy * 0.4 + advancedScores.clarity * 0.25 + advancedScores.empathy * 0.15 + advancedScores.fluency * 0.1 + advancedScores.clientLanguage * 0.1));
    const isBreached = state.selectedTicket.slaBreach;
    const difficultyXp = state.selectedTicket.difficulty === 'beginner' ? 10 : state.selectedTicket.difficulty === 'intermediate' ? 20 : state.selectedTicket.difficulty === 'advanced' ? 30 : 50;
    const baseXp = isBreached ? 5 : qa >= 85 ? difficultyXp + 15 : qa >= 70 ? difficultyXp + 5 : Math.floor(difficultyXp/2);
    const xpGain = baseXp + (state.checklist.lang ? 10 : 0) + (advancedScores.empathy >= 70 ? 5 : 0);

    // Adapt later exercises to missed controls.
    const tool = state.selectedTicket.requiredTools[0] || 'general';
    if (qa < 70) setWeaknesses(prev => ({ ...prev, [tool]: (prev[tool] || 0) + 1 }));

    const newResolved = state.progress.ticketsResolved + 1;
    const newBreached = isBreached ? state.progress.ticketsBreached + 1 : state.progress.ticketsBreached;
    const newAvgCSAT = ((state.progress.avgCSAT * state.progress.ticketsResolved) + csat) / newResolved;
    const newAvgQA = ((state.progress.avgQA * state.progress.ticketsResolved) + qa) / newResolved;
    const newXp = state.progress.xp + xpGain;
    const oldLevel = state.progress.level;
    const newLevel = calculateLevel(newXp);
    const avg = (prevScore: number, newScore: number) => Math.round((prevScore * state.progress.ticketsResolved + newScore) / newResolved);

    const newProgress = {
      ...state.progress,
      ticketsResolved: newResolved,
      ticketsBreached: newBreached,
      avgCSAT: newAvgCSAT,
      avgQA: newAvgQA,
      xp: newXp,
      level: newLevel,
      slaCompliance: Math.round((newResolved / (newResolved + newBreached)) * 100) || 100,
      communicationScores: {
        empathy: avg(state.progress.communicationScores.empathy, advancedScores.empathy),
        clarity: avg(state.progress.communicationScores.clarity, advancedScores.clarity),
        technicalAccuracy: avg(state.progress.communicationScores.technicalAccuracy, advancedScores.technicalAccuracy),
        fluency: avg(state.progress.communicationScores.fluency, advancedScores.fluency),
        clientLanguage: avg(state.progress.communicationScores.clientLanguage, advancedScores.clientLanguage),
      },
      badges: getBadges({ ...state.progress, ticketsResolved: newResolved, avgCSAT: newAvgCSAT, avgQA: newAvgQA, xp: newXp } as any),
      history: [...state.progress.history, { timestamp: Date.now(), action: `Resolved ${state.selectedTicket.code} [${state.selectedTicket.difficulty}] +${xpGain} XP • Emp ${advancedScores.empathy} Clar ${advancedScores.clarity} Tech ${advancedScores.technicalAccuracy}`, ticketCode: state.selectedTicket.code, score: Math.round((csat * 20 + qa) / 2) }].slice(-50)
    };

    const levelUp = newLevel > oldLevel ? { oldLevel, newLevel } : null;
    if (levelUp) { setTimeout(() => dispatch({ type: 'SET_LEVEL_UP', levelUp }), 800); addToast(`🚀 LEVEL UP! ${oldLevel} → ${newLevel} — ${getLevelInfo(newLevel).title}`, 'success', 6000); }

    dispatch({ type: 'RESOLVE_TICKET', ticketId: state.selectedTicket.id, csat, qa, xpGain, newProgress, levelUp });
    addToast(`Resolved ${state.selectedTicket.code} • QA ${qa}% +${xpGain} XP`, isBreached ? 'warning' : 'success', 6000);
    setTimeSpent(prev => prev + 1);
    setTimeout(() => dispatch({ type: 'REMOVE_TICKET', ticketId: state.selectedTicket!.id }), 1200);
  };

  const togglePause = () => {
    if (state.isPaused && state.isManualPaused) {
      dispatch({ type: 'SET_PAUSED', paused: false, manual: false });
      document.title = 'OrbitDesk — Modern Workplace Operations Lab';
      addToast('▶️ Resumed', 'success', 2000);
    } else {
      dispatch({ type: 'SET_PAUSED', paused: true, manual: true });
      localStorage.setItem('orbitdesk_last_active', Date.now().toString());
      document.title = '⏸️ On Hold — OrbitDesk';
      addToast('⏸️ On hold — break', 'info', 3000);
    }
  };

  if (!state.isAuthenticated) {
    return <div className="min-h-screen relative"><LiveryBackground /><AuthGate onAuthenticated={(p) => { dispatch({ type: 'AUTHENTICATE', profile: p }); localStorage.setItem('orbitdesk_user_profile', JSON.stringify(p)); }} existingProgress={state.progress} /></div>;
  }

  const pendingCount = state.tickets.filter(t => t.status !== 'resolved').length;
  const p1Count = state.tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved').length;

  const tabs: { id: any; label: string; icon: string; badge?: any }[] = [
    { id: 'overview', label: t('header.overview'), icon: '◍' },
    { id: 'queue', label: t('header.queue'), icon: '◐', badge: pendingCount },
    { id: 'directory', label: 'Directory', icon: '🌳' },
    { id: 'comms', label: t('header.comms'), icon: '◑' },
    { id: 'clients', label: t('header.clients'), icon: '◒' },
    { id: 'class', label: t('header.class'), icon: '👥' },
    { id: 'assessment', label: t('header.report'), icon: '📊', badge: state.progress.ticketsResolved },
  ];

  return (
    <div className="min-h-screen flex flex-col text-zinc-100 relative">
      <LiveryBackground />
      <ToastSystem toasts={toasts} onRemove={removeToast} />
      <PWAUpdatePrompt />
      <OrbitPauseOverlay isPaused={state.isPaused} isManual={state.isManualPaused} awayMinutes={state.awayMinutes} pendingCount={pendingCount} onResume={togglePause} />
      {state.showAwayWelcome && <AwayWelcomeBack awayMinutes={state.showAwayWelcome.minutes} ticketsAdded={state.showAwayWelcome.added} onClose={() => dispatch({ type: 'SET_AWAY', minutes: 0, welcome: null })} />}

      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0a0a0a]/80 border-b border-zinc-800/50">
        <div className="max-w-[1600px] mx-auto px-5 h-[56px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo variant="full" size={30} animated />
            <div className="hidden xl:flex items-center gap-2 ml-6 pl-6 border-l border-zinc-800">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.id as any })} className={`h-8 px-3.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all ${state.activeTab === tab.id ? 'bg-zinc-100 text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'}`}>
                  <span className="text-[11px]">{tab.icon}</span>{tab.label}{tab.badge ? <span className={`ml-1 h-4 min-w-[16px] px-1 rounded-full text-[10px] flex items-center justify-center ${state.activeTab === tab.id ? 'bg-zinc-900 text-white' : 'bg-red-500 text-white'}`}>{tab.badge}</span> : null}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 h-8 px-3 rounded-full bg-zinc-900 border border-zinc-800">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">{state.progress.level}</div>
                <span className="text-[11px] text-zinc-300 font-medium">{getLevelInfo(state.progress.level).title}</span>
                <span className="text-[10px] text-zinc-500">• {state.progress.xp} XP</span>
              </div>
              <div className={`h-8 px-3 rounded-full border flex items-center gap-1.5 text-[11px] ${state.isPaused ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${state.isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />{state.isPaused ? 'Paused' : `${pendingCount} • ${p1Count} P1`}
              </div>
            </div>
            <button onClick={togglePause} className={`h-8 w-8 rounded-full border flex items-center justify-center transition ${state.isPaused ? 'bg-amber-500 text-zinc-900 border-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}>{state.isPaused ? '▶️' : '⏸️'}</button>
            <div className="relative"><VoiceCallCenter tickets={state.tickets} onAccept={handleSelectTicket} level={state.progress.level} /></div>
            <ClassCallDock classCode="ORBIT-2026-A" currentUserId="me" currentUserProfile={state.userProfile} />
            <LanguageSelector /><ShortcutsHelp />
            <div className="h-8 w-px bg-zinc-800 mx-1 hidden md:block" />
            <ProfileMenu profile={state.userProfile} progress={state.progress} onLogout={() => { if (confirm('Logout?')) { localStorage.removeItem('orbitdesk_user_profile'); dispatch({ type: 'LOGOUT' }); } }} onUpdateProfile={(p) => dispatch({ type: 'AUTHENTICATE', profile: p })} studentMode={studentMode} onToggleStudentMode={() => setStudentMode(!studentMode)} />
          </div>
        </div>
        <div className="xl:hidden border-t border-zinc-800/50 px-3 h-10 flex items-center gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.id as any })} className={`h-7 px-3 rounded-full text-[12px] font-medium whitespace-nowrap flex items-center gap-1.5 border ${state.activeTab === tab.id ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : 'text-zinc-500 border-transparent'}`}>{tab.icon} {tab.label}{tab.badge ? <span className={`ml-1 h-4 min-w-[14px] px-1 rounded-full text-[10px] flex items-center justify-center bg-red-500 text-white`}>{tab.badge}</span> : null}</button>
          ))}
        </div>
      </header>

      <main className="flex-1 min-h-0 max-w-[1600px] mx-auto w-full px-4 py-4 flex flex-col pb-[80px]">
        <AnimatePresence mode="wait">
          {state.activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="space-y-4 flex-1">
              <ShiftStatus isPaused={state.isPaused} isManual={state.isManualPaused} ticketsResolved={state.progress.ticketsResolved} level={state.progress.level} xp={state.progress.xp} pendingCount={pendingCount} awayMinutes={state.awayMinutes} onTogglePause={togglePause} />
              <DashboardMetrics tickets={state.tickets} />
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8 space-y-4"><VoiceCallDemo /><FieldNotes /></div>
                <div className="col-span-12 lg:col-span-4 space-y-4">
                  <DesktopDownloadV2 />
                  <div className="p-4 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur border border-zinc-800/60">
                    <h4 className="text-[13px] font-semibold text-zinc-100">Learning progress</h4>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Resolved</p><p className="text-[20px] font-bold text-white">{state.progress.ticketsResolved}</p><p className="text-[10px] text-zinc-500">CSAT {state.progress.avgCSAT.toFixed(1)} • QA {state.progress.avgQA}%</p></div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Quality score</p><p className="text-[20px] font-bold text-white">{Math.round((state.progress.communicationScores.empathy + state.progress.communicationScores.clarity + state.progress.communicationScores.technicalAccuracy)/3)}</p><p className="text-[10px] text-zinc-500">Communication and accuracy</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.activeTab === 'queue' && (
            <motion.div key="queue" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-3 min-h-0">
                <div className="flex-1 min-h-[400px]"><TicketQueue tickets={state.tickets} onSelectTicket={handleSelectTicket} onAssign={handleAssign} selectedTicketId={state.selectedTicket?.id} isPaused={state.isPaused} /></div>
                <div className="rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 p-3">
                  <div className="flex items-center justify-between"><div><p className="text-[12px] font-medium text-zinc-200">Remote Access</p><p className="text-[11px] text-zinc-500">Win11 • Encrypted • MSP</p></div><button onClick={() => { if (state.selectedTicket) dispatch({ type: 'SET_SHOW_REMOTE_PC', show: true }); }} className={`h-8 px-3 rounded-full text-[12px] font-semibold transition ${state.selectedTicket ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>Connect →</button></div>
                  {state.portalActionLog.length > 0 && <div className="mt-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800"><p className="text-[10px] tracking-widest text-zinc-500 uppercase">Recent actions</p><div className="mt-1 space-y-1">{state.portalActionLog.slice(0,3).map((l,i) => <p key={i} className="text-[11px] font-mono text-zinc-400 truncate">{l}</p>)}</div></div>}
                </div>
              </div>
              <div className="w-full lg:w-[400px] flex-shrink-0 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 flex flex-col min-h-0 overflow-hidden">
                {state.selectedTicket ? (
                  <>
                    <div className="p-4 border-b border-zinc-800/50">
                      <div className="flex items-center gap-2 flex-wrap mb-2.5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${state.selectedTicket.priority === 'P1' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{state.selectedTicket.priority}</span>
                        <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">{state.selectedTicket.code}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full border ${(state.selectedTicket as any).difficulty === 'expert' ? 'bg-red-500/10 text-red-300 border-red-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>{(state.selectedTicket as any).difficulty}</span>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">F={(() => { const m = {P1:100,P2:50,P3:20,P4:5}[state.selectedTicket.priority]||20; return (m / Math.max(1, state.selectedTicket.timeLeftMs/60000)).toFixed(1); })()}</span>
                      </div>
                      <h2 className="text-[15px] font-semibold text-zinc-100 leading-tight">{state.selectedTicket.title}</h2>
                      <p className="text-[13px] text-zinc-400 mt-2 leading-relaxed">"{state.selectedTicket.userMessage}"</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                        <p className="text-[11px] font-medium text-violet-300">Access decision: identity × device × policy</p>
                        <p className="text-[11px] text-zinc-500 mt-1">If any 0, blocked — like E=mc² simple</p>
                      </div>
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                        <h4 className="text-[11px] font-semibold text-zinc-200 mb-3">Checklist • Fix = Logs × Tool × Language • Lvl {state.progress.level}</h4>
                        <div className="space-y-2">
                          <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer"><input type="checkbox" checked={state.checklist.logs} onChange={e => dispatch({ type: 'SET_CHECKLIST', checklist: { logs: e.target.checked } })} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Checked sign-in and audit logs</p><p className="text-[11px] text-zinc-500">Sign-in Logs CA tab, Audit Logs</p></div></label>
                          <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer"><input type="checkbox" checked={state.checklist.tool} onChange={e => dispatch({ type: 'SET_CHECKLIST', checklist: { tool: e.target.checked } })} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Used correct tool — Turing computable</p><p className="text-[11px] text-zinc-500">Intune/Exchange/What-If bombe</p></div></label>
                          <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer"><input type="checkbox" checked={state.checklist.lang} onChange={() => dispatch({ type: 'SET_CHECKLIST', checklist: { lang: !state.checklist.lang } })} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Matched language to the client</p><p className="text-[11px] text-zinc-500">Simple for SMB, technical for Enterprise</p></div></label>
                          <label className="flex gap-2.5 p-2.5 rounded-xl bg-[#0a0a0a] border border-zinc-800 cursor-pointer"><input type="checkbox" checked={state.checklist.confirm} onChange={e => dispatch({ type: 'SET_CHECKLIST', checklist: { confirm: e.target.checked } })} className="mt-0.5" /><div><p className="text-[12px] text-zinc-200">Confirmed and documented resolution</p><p className="text-[11px] text-zinc-500">User confirmed + documented + PowerShell logged</p></div></label>
                        </div>
                        <button onClick={handleResolve} className={`w-full mt-4 h-10 rounded-full text-[13px] font-semibold transition ${state.checklist.logs && state.checklist.tool ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-800 text-zinc-500'}`}>Resolve ticket and record outcome</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center"><div><div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">◍</div><p className="text-[13px] font-medium text-zinc-300">Select a ticket to begin triage</p><p className="text-[11px] text-zinc-500 mt-1 max-w-[240px]">Balance business impact, priority and remaining SLA time.</p></div></div>
                )}
              </div>
              <div className="flex-1 min-w-0 rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 overflow-hidden flex flex-col min-h-[600px] lg:min-h-0"><MockPortals ticket={state.selectedTicket} onAction={(a) => dispatch({ type: 'ADD_PORTAL_ACTION', action: a })} /></div>
            </motion.div>
          )}

          {state.activeTab === 'directory' && (
            <motion.div key="directory" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex-1 min-h-0 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800">
                  <button onClick={() => dispatch({ type: 'SET_DIRECTORY_VIEW', view: 'ou' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.directoryView === 'ou' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Directory tree</button>
                  <button onClick={() => dispatch({ type: 'SET_DIRECTORY_VIEW', view: 'entra' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.directoryView === 'entra' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Entra ID</button>
                </div>
              </div>
              {state.directoryView === 'ou' ? (
                <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-[360px] flex-shrink-0 min-h-[500px]"><OUTreeView selectedId={state.selectedADObject?.id} onSelectObject={(obj) => { dispatch({ type: 'SET_SELECTED_AD_OBJECT', obj }); if (obj.type === 'user') logPowerShellCommand('Get-ADUser', `-Identity "${obj.name}"`, 'You', obj.name); }} onAction={(action, obj) => { if (action === 'unlock') logPowerShellCommand('Unlock-ADAccount', `-Identity "${obj.name}"`, 'You', obj.name); }} /></div>
                  <div className="flex-1 min-w-0 min-h-[500px]"><ADUserProperties object={state.selectedADObject} onAction={(action, obj) => { if (action === 'unlock') logPowerShellCommand('Unlock-ADAccount', `-Identity "${obj.name}"`, 'You', obj.name); }} onClose={() => dispatch({ type: 'SET_SELECTED_AD_OBJECT', obj: null })} /></div>
                  <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-4 min-h-[500px]"><div className="flex-1 min-h-[300px]"><PowerShellHistory commands={state.psHistory} onClear={() => dispatch({ type: 'CLEAR_PS_HISTORY' })} /></div></div>
                </div>
              ) : (
                <div className="flex-1 min-h-[600px]"><EntraIDCenter onAction={(a) => addToast(a, 'success', 4000)} /></div>
              )}
            </motion.div>
          )}

          {state.activeTab === 'comms' && <motion.div key="comms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-[600px]"><CommunicationChannel /></motion.div>}
          {state.activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800">
                  <button onClick={() => dispatch({ type: 'SET_POLICIES_VIEW', view: 'ca' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.policiesView === 'ca' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Conditional access</button>
                  <button onClick={() => dispatch({ type: 'SET_POLICIES_VIEW', view: 'gpo' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.policiesView === 'gpo' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Group Policy</button>
                  <button onClick={() => dispatch({ type: 'SET_POLICIES_VIEW', view: 'intune' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.policiesView === 'intune' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Endpoint management</button>
                  <button onClick={() => dispatch({ type: 'SET_POLICIES_VIEW', view: 'agents' })} className={`h-8 px-4 rounded-full text-[12px] font-medium transition ${state.policiesView === 'agents' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}>Team workload</button>
                </div>
              </div>
              {state.policiesView === 'ca' && <div className="flex-1 min-h-0 grid lg:grid-cols-2 gap-4"><PolicyCenter selectedClientId={state.selectedClientForPolicies} onSelectClient={(id) => dispatch({ type: 'SET_SELECTED_CLIENT', clientId: id })} /><AgentRoster agents={agents} onResolveConflict={(id) => { setAgents(prev => prev.map(a => a.id === id ? { ...a, mood: 'neutral' as const, conflictWith: undefined } : a)); addToast('Conflict resolved via SBI coaching', 'success', 4000); }} onAssign={handleAssign} tickets={state.tickets} /></div>}
              {state.policiesView === 'gpo' && <div className="flex-1 min-h-[600px]"><GPOManagement onAction={(a) => addToast(a, 'success', 4000)} /></div>}
              {state.policiesView === 'intune' && <div className="flex-1 min-h-[600px]"><IntuneDeviceCenter onAction={(a) => addToast(a, 'success', 4000)} /></div>}
              {state.policiesView === 'agents' && <div className="flex-1 min-h-0"><AgentRoster agents={agents} onResolveConflict={(id) => { setAgents(prev => prev.map(a => a.id === id ? { ...a, mood: 'neutral' as const, conflictWith: undefined } : a)); }} onAssign={handleAssign} tickets={state.tickets} /></div>}
            </motion.div>
          )}
          {state.activeTab === 'class' && <motion.div key="class" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-[600px]"><ClassCommandCenter myProgress={state.progress} userProfile={state.userProfile} /></motion.div>}
          {state.activeTab === 'assessment' && <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-h-0 overflow-y-auto"><AssessmentReport progress={state.progress} onReset={() => { if (confirm('Reset?')) { const np = { ...initialProgress, sessionId: `sess_${Math.random().toString(36).substring(7)}_${Date.now()}`, startTime: Date.now() }; dispatch({ type: 'SET_PROGRESS', progress: np }); saveProgress(np); } }} /></motion.div>}
        </AnimatePresence>
      </main>

      <footer className="mt-auto border-t border-zinc-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-5 h-11 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-medium text-zinc-300">© 2026 Devine Nyaenya • OrbitDesk</span>
            <span className="hidden md:inline text-zinc-500">Simulation only • Local learning data</span>
          </div>
          <div className="flex items-center gap-3 font-mono">

            <span>Lvl {state.progress.level} • {state.progress.xp} XP • {state.progress.ticketsResolved} ✓</span>
          </div>
        </div>
      </footer>

      {state.showGuide && <StudentModeGuide onClose={() => dispatch({ type: 'SET_SHOW_GUIDE', show: false })} />}
      <RemoteDesktopV2 ticket={state.selectedTicket} isOpen={state.showRemotePC} onClose={() => dispatch({ type: 'SET_SHOW_REMOTE_PC', show: false })} onAction={(a) => dispatch({ type: 'ADD_PORTAL_ACTION', action: a })} bitLockerFixed={state.bitLockerFixed} syncDone={state.syncDone} />
      {state.levelUp && <LevelUpCelebration oldLevel={state.levelUp.oldLevel} newLevel={state.levelUp.newLevel} xp={state.progress.xp} ticketsResolved={state.progress.ticketsResolved} onClose={() => dispatch({ type: 'SET_LEVEL_UP', levelUp: null })} />}
      <LinkedInChatDock ticket={state.selectedTicket || undefined} isPaused={state.isPaused} />
    </div>
  );
}
