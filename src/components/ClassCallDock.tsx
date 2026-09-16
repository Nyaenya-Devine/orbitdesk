'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classCallEngine, ClassCall } from '@/lib/classCallEngine';

interface Props {
  classCode: string;
  currentUserId: string;
  currentUserProfile: any;
}

export default function ClassCallDock({ classCode, currentUserId, currentUserProfile }: Props) {
  const [calls, setCalls] = useState<ClassCall[]>([]);
  const [incomingCall, setIncomingCall] = useState<ClassCall | null>(null);
  const [activeCall, setActiveCall] = useState<ClassCall | null>(null);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedCode = typeof window !== 'undefined' ? localStorage.getItem('orbitdesk_class_code') : null;
    const effectiveCode = savedCode || classCode;
    classCallEngine.setClassCode(effectiveCode);
    classCallEngine.setCurrentUser(currentUserId, currentUserProfile);

    const unsub = classCallEngine.subscribe((allCalls) => {
      setCalls(allCalls);
      const incoming = allCalls.find(c => c.direction === 'incoming' && c.status === 'ringing');
      const active = allCalls.find(c => c.status === 'connected' || c.status === 'connecting' || (c.status === 'ringing' && c.direction === 'outgoing'));
      
      setIncomingCall(incoming || null);
      setActiveCall(active || incoming || null);
      if (incoming || active) setIsExpanded(true);
    });

    return unsub;
  }, [classCode, currentUserId, currentUserProfile]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected' || !activeCall.connectedAt) {
      setDuration(0);
      return;
    }
    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - (activeCall.connectedAt || 0)) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const hasActiveCall = calls.some(c => ['ringing', 'connecting', 'connected'].includes(c.status));
  const incomingCount = calls.filter(c => c.direction === 'incoming' && c.status === 'ringing').length;

  if (!hasActiveCall && !isExpanded) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 h-8 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
          No team calls • {classCode}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Collapsed pill — in header, own space, not overlaying */}
      {!isExpanded && hasActiveCall && (
        <button
          onClick={() => setIsExpanded(true)}
          className="h-8 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium flex items-center gap-2 transition"
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          {incomingCount > 0 ? `${incomingCount} incoming` : `${calls.filter(c => c.status === 'connected').length} active call`}
          <span className="text-[10px]">⌄</span>
        </button>
      )}

      {/* Expanded — inline dropdown, own space in header, not overlaying main content */}
      <AnimatePresence>
        {isExpanded && activeCall && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-10 z-20 w-[380px] rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] font-semibold text-zinc-100 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${activeCall.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                  {activeCall.status === 'ringing' && activeCall.direction === 'incoming' ? 'Incoming team call' : activeCall.status === 'ringing' ? 'Calling...' : 'Team call active'}
                </h4>
                <button onClick={() => setIsExpanded(false)} className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-500 text-[10px]">✕</button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="relative">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${activeCall.status === 'connected' ? 'bg-emerald-600' : 'bg-violet-600'}`}>
                    {activeCall.direction === 'outgoing' ? activeCall.to.avatar : activeCall.from.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[8px] ${activeCall.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                    ●
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-zinc-100 truncate">
                    {activeCall.direction === 'outgoing' ? activeCall.to.name : activeCall.from.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {activeCall.direction === 'outgoing' ? activeCall.to.role : activeCall.from.role} • {activeCall.type} • {activeCall.status === 'connected' ? formatDuration(duration) : activeCall.status}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">Class {activeCall.classCode} • {activeCall.direction} • WebRTC</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {activeCall.status === 'ringing' && activeCall.direction === 'incoming' ? (
                  <>
                    <button
                      onClick={() => { classCallEngine.declineCall(activeCall.id); setIsExpanded(false); }}
                      className="flex-1 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px] font-medium"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => classCallEngine.answerCall(activeCall.id)}
                      className="flex-1 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[13px] font-semibold"
                    >
                      Answer
                    </button>
                  </>
                ) : activeCall.status === 'connected' || activeCall.status === 'connecting' || activeCall.status === 'ringing' ? (
                  <>
                    <button
                      onClick={() => classCallEngine.toggleMute(activeCall.id)}
                      className={`flex-1 h-10 rounded-full border text-[13px] font-medium transition ${activeCall.isMuted ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}
                    >
                      {activeCall.isMuted ? '🔇 Unmute' : '🎤 Mute'}
                    </button>
                    <button
                      onClick={() => classCallEngine.toggleHold(activeCall.id)}
                      className={`h-10 w-10 rounded-full border flex items-center justify-center transition ${activeCall.isOnHold ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
                    >
                      {activeCall.isOnHold ? '⏸️' : '⏯️'}
                    </button>
                    <button
                      onClick={() => { classCallEngine.endCall(activeCall.id); setIsExpanded(false); }}
                      className="flex-1 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold"
                    >
                      End
                    </button>
                  </>
                ) : null}
              </div>

              {activeCall.status === 'connected' && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div animate={{ x: [-20, 120] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="h-full w-5 bg-emerald-500" />
                  </div>
                  <span className="text-[10px] text-emerald-400">● Live audio • Encrypted</span>
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-600">
                <span>Same class only • {activeCall.classCode}</span>
                <span>{calls.length} total calls</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming call badge — when collapsed but incoming */}
      <AnimatePresence>
        {incomingCount > 0 && !isExpanded && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse"
          >
            {incomingCount}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
