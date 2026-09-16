/**
 * © 2026 Devine Nyaenya Ngorwe — OrbitDesk Proprietary Flagship
 * Source-available Noncommercial — No competing use — See LICENSE
 * Trademark: OrbitDesk name and logo are trademarks of Devine Nyaenya
 * Commercial licensing: devinenyaenya@gmail.com
 */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classCallEngine, ClassCall, CallType } from '@/lib/classCallEngine';
import { detectLanguage, getTranslation, Language } from '@/lib/i18n';

interface Student {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  status: 'online' | 'offline' | 'in-call' | 'training';
  level: number;
  ticketsResolved: number;
}

interface Props {
  classCode: string;
  students: Student[];
  currentUserId: string;
  currentUserProfile: any;
  onCallAgent?: (studentId: string) => void;
}

export default function ClassCallCenter({ classCode, students, currentUserId, currentUserProfile, onCallAgent }: Props) {
  const [calls, setCalls] = useState<ClassCall[]>([]);
  const [activeCall, setActiveCall] = useState<ClassCall | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedType, setSelectedType] = useState<CallType>('team-internal');
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const detected = detectLanguage();
    setLang(detected);
    const handler = (e: any) => setLang(e.detail as Language);
    window.addEventListener('orbitdesk-language-change', handler);
    return () => window.removeEventListener('orbitdesk-language-change', handler);
  }, []);

  const t = (key: string) => getTranslation(lang, key);

  useEffect(() => {
    classCallEngine.setClassCode(classCode);
    classCallEngine.setCurrentUser(currentUserId, currentUserProfile);

    const unsub = classCallEngine.subscribe((allCalls) => {
      setCalls(allCalls);
      const active = allCalls.find(c => ['ringing', 'connecting', 'connected'].includes(c.status));
      setActiveCall(active || null);
    });

    // Request notification permission
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    return unsub;
  }, [classCode, currentUserId, currentUserProfile]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected' || !activeCall.connectedAt) {
      setCallDuration(0);
      return;
    }
    const interval = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - (activeCall.connectedAt || 0)) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  const onlineStudents = students.filter(s => s.id !== currentUserId && (s.status === 'online' || s.status === 'in-call'));
  const canCall = (student: Student) => {
    // Team lead can call anyone, others can call lead/senior
    const myRole = currentUserProfile?.role || 'student';
    if (myRole === 'team-lead') return true;
    if (myRole === 'senior' && student.role !== 'team-lead') return true;
    if (student.status === 'online') return true;
    return false;
  };

  const handleCall = async (student: Student) => {
    try {
      await classCallEngine.initiateCall(
        { id: student.id, name: student.name, role: student.role || 'student' },
        selectedType
      );
      onCallAgent?.(student.id);
    } catch (e) {
      console.error('Call failed', e);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getCallTypeInfo = (type: CallType) => {
    switch (type) {
      case 'coaching': return { label: 'Coaching', icon: '🎓', color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
      case 'escalation': return { label: 'Escalation', icon: '🚨', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      default: return { label: 'Team Call', icon: '◍', color: 'bg-violet-500/10 text-violet-300 border-violet-500/20' };
    }
  };

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800/60 bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-violet-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-zinc-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('classCalls.title')}
            </h3>
            <p className="text-[11px] text-zinc-500 mt-1">
              {classCode} • {onlineStudents.length} {t('common.online').toLowerCase()} • WebRTC peer-to-peer • {t('classCalls.subtitle').split('•').pop()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {calls.filter(c => c.status === 'connected').length} active
            </span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {calls.length} total
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {(['team-internal', 'coaching', 'escalation'] as CallType[]).map(type => {
            const info = getCallTypeInfo(type);
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`h-7 px-3 rounded-full text-[11px] font-medium border transition flex items-center gap-1.5 ${
                  selectedType === type ? info.color + ' ring-1 ring-current/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <span>{info.icon}</span>{info.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Call Banner */}
      <AnimatePresence>
        {activeCall && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-zinc-800 overflow-hidden"
          >
            <div className={`p-4 ${activeCall.status === 'ringing' ? 'bg-amber-500/5' : activeCall.status === 'connected' ? 'bg-emerald-500/5' : 'bg-violet-500/5'}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold border-2 ${activeCall.status === 'connected' ? 'bg-emerald-600 border-emerald-500' : 'bg-amber-600 border-amber-500 animate-pulse'}`}>
                    {activeCall.direction === 'outgoing' ? activeCall.to.avatar : activeCall.from.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-[10px] ${activeCall.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    {activeCall.status === 'connected' ? '●' : '◍'}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-zinc-100">
                      {activeCall.direction === 'outgoing' ? activeCall.to.name : activeCall.from.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getCallTypeInfo(activeCall.type).color}`}>
                      {getCallTypeInfo(activeCall.type).icon} {getCallTypeInfo(activeCall.type).label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${activeCall.status === 'connected' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}>
                      {activeCall.status === 'ringing' ? (activeCall.direction === 'outgoing' ? 'Ringing...' : 'Incoming') : activeCall.status === 'connecting' ? 'Connecting...' : `Connected • ${formatDuration(callDuration)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {activeCall.direction === 'outgoing' ? `Calling ${activeCall.to.role}` : `From ${activeCall.from.role}`} • Class {activeCall.classCode} • {activeCall.direction}
                  </p>
                  {activeCall.status === 'connected' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 max-w-[120px] bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-emerald-500" />
                      </div>
                      <span className="text-[10px] text-zinc-500">● Live audio • WebRTC</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {activeCall.status === 'ringing' && activeCall.direction === 'incoming' ? (
                    <>
                      <button
                        onClick={() => classCallEngine.declineCall(activeCall.id)}
                        className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                        title="Decline"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => classCallEngine.answerCall(activeCall.id)}
                        className="h-10 w-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition animate-pulse"
                        title="Answer"
                      >
                        📞
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => classCallEngine.toggleMute(activeCall.id)}
                        className={`h-9 w-9 rounded-full border flex items-center justify-center transition ${activeCall.isMuted ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                        title={activeCall.isMuted ? 'Unmute' : 'Mute'}
                      >
                        {activeCall.isMuted ? '🔇' : '🎤'}
                      </button>
                      <button
                        onClick={() => classCallEngine.toggleHold(activeCall.id)}
                        className={`h-9 w-9 rounded-full border flex items-center justify-center transition ${activeCall.isOnHold ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                        title={activeCall.isOnHold ? 'Resume' : 'Hold'}
                      >
                        {activeCall.isOnHold ? '⏸️' : '⏯️'}
                      </button>
                      <button
                        onClick={() => classCallEngine.endCall(activeCall.id)}
                        className="h-9 w-9 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                        title="End call"
                      >
                        📞
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 grid grid-cols-12 min-h-[400px]">
        {/* Online Agents */}
        <div className="col-span-7 border-r border-zinc-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Online in {classCode}</h4>
            <span className="text-[10px] text-zinc-600">{onlineStudents.length} available • Team Lead can call all</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {onlineStudents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-900/50 border border-zinc-800 border-dashed">
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-600">◍</div>
                <p className="text-[12px] text-zinc-400 mt-3">No agents online in this class</p>
                <p className="text-[11px] text-zinc-600 mt-1">Open another tab with same class code to test calling • BroadcastChannel works across tabs</p>
              </div>
            ) : (
              onlineStudents.map(student => {
                const isInCall = calls.some(c => (c.to.id === student.id || c.from.id === student.id) && ['ringing', 'connecting', 'connected'].includes(c.status));
                return (
                  <div key={student.id} className={`p-3 rounded-xl border flex items-center gap-3 transition ${isInCall ? 'bg-amber-500/5 border-amber-500/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">
                        {student.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 ${student.status === 'in-call' ? 'bg-violet-500 animate-pulse' : 'bg-emerald-500'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-zinc-100 truncate">{student.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700 capitalize">{student.role || 'student'}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${student.status === 'in-call' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'}`}>
                          {student.status === 'in-call' ? 'In call' : 'Online'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Lvl {student.level} • {student.ticketsResolved} tickets • {student.status === 'in-call' ? 'Busy' : 'Available for call'}</p>
                    </div>

                    <button
                      onClick={() => handleCall(student)}
                      disabled={!canCall(student) || isInCall}
                      className={`h-8 px-3 rounded-full text-[11px] font-medium border transition flex items-center gap-1.5 ${
                        !canCall(student) || isInCall
                          ? 'bg-zinc-800 text-zinc-600 border-zinc-700 cursor-not-allowed'
                          : 'bg-violet-600 hover:bg-violet-500 text-white border-violet-600'
                      }`}
                    >
                      <span>📞</span>{isInCall ? 'In Call' : 'Call'}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <p className="text-[11px] font-medium text-violet-300">How class calling works</p>
            <ul className="mt-2 space-y-1 text-[11px] text-zinc-500 leading-[1.4]">
              <li>• <strong>Team Lead</strong> (you) can call any agent in same class code — for coaching, escalation, huddle</li>
              <li>• <strong>WebRTC peer-to-peer</strong> — audio goes directly between browsers, no server recording</li>
              <li>• <strong>BroadcastChannel</strong> signaling — works across tabs/windows same origin. For production, replace with Ably/Pusher or Vercel WebSocket</li>
              <li>• <strong>Presence:</strong> Online, In-call, Offline — like Teams/Slack</li>
              <li>• <strong>Types:</strong> Team Call (general), Coaching (mentoring), Escalation (P1 help)</li>
            </ul>
          </div>
        </div>

        {/* Call History */}
        <div className="col-span-5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Call History • {classCode}</h4>
            <button onClick={() => classCallEngine.clearHistory()} className="text-[10px] text-zinc-600 hover:text-zinc-400">Clear</button>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {calls.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                <p className="text-[11px] text-zinc-600">No calls yet in this class</p>
                <p className="text-[10px] text-zinc-700 mt-1">Calls save locally • Exportable for coaching review</p>
              </div>
            ) : (
              calls.slice(0, 20).map(call => (
                <div key={call.id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${call.direction === 'outgoing' ? 'bg-violet-500/20 text-violet-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {call.direction === 'outgoing' ? '↑' : '↓'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-zinc-200 truncate">
                        {call.direction === 'outgoing' ? `To ${call.to.name}` : `From ${call.from.name}`} • {call.to.role || call.from.role}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {new Date(call.startedAt).toLocaleTimeString()} • {call.status}
                        {call.duration ? ` • ${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : ''}
                      </p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${getCallTypeInfo(call.type).color}`}>
                      {getCallTypeInfo(call.type).icon}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-[11px] font-medium text-zinc-300">Workforce integration</p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-[1.4]">
              Class code <span className="font-mono text-violet-300">{classCode}</span> links accounts. Team Lead sees all agents in same class, can call for:
            </p>
            <ul className="mt-2 space-y-1 text-[10px] text-zinc-600">
              <li>• Daily huddle — quick sync before shift</li>
              <li>• Coaching — guide junior through P1</li>
              <li>• Escalation — junior calls lead for approval</li>
              <li>• Handover — end of shift transfer</li>
            </ul>
            <p className="text-[10px] text-zinc-700 mt-2">Future: Add Ably for cross-device, recording consent, audit log integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
