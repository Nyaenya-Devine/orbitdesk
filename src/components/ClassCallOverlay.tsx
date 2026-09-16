'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { classCallEngine, ClassCall } from '@/lib/classCallEngine';

interface Props {
  classCode: string;
  currentUserId: string;
  currentUserProfile: any;
}

export default function ClassCallOverlay({ classCode, currentUserId, currentUserProfile }: Props) {
  const [incomingCall, setIncomingCall] = useState<ClassCall | null>(null);
  const [activeCall, setActiveCall] = useState<ClassCall | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Read class code from localStorage if available, fallback to prop
    const savedCode = typeof window !== 'undefined' ? localStorage.getItem('orbitdesk_class_code') : null;
    const effectiveCode = savedCode || classCode;
    classCallEngine.setClassCode(effectiveCode);
    classCallEngine.setCurrentUser(currentUserId, currentUserProfile);

    const unsub = classCallEngine.subscribe((calls) => {
      const incoming = calls.find(c => c.direction === 'incoming' && c.status === 'ringing');
      const active = calls.find(c => c.status === 'connected' || c.status === 'connecting');
      
      setIncomingCall(incoming || null);
      if (active && !incoming) {
        setActiveCall(active);
      } else if (!active) {
        setActiveCall(null);
      }
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

  return (
    <>
      {/* Incoming Call Toast — Compact, non-intrusive, top-right */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[68px] right-4 z-[90] w-[360px] rounded-2xl border border-violet-500/20 bg-[#0a0a0a] shadow-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {incomingCall.from.avatar}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0a]"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-zinc-100">{incomingCall.from.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 capitalize">{incomingCall.from.role}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Team call • Class {incomingCall.classCode} • {incomingCall.type === 'coaching' ? 'Coaching session' : incomingCall.type === 'escalation' ? 'Escalation help' : 'Internal team call'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500">Incoming • Same workforce</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => classCallEngine.declineCall(incomingCall.id)}
                  className="flex-1 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[12px] font-medium transition"
                >
                  Decline
                </button>
                <button
                  onClick={() => classCallEngine.answerCall(incomingCall.id)}
                  className="flex-1 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>📞</span>Answer
                </button>
              </div>

              <p className="text-[10px] text-zinc-600 text-center mt-2">WebRTC peer-to-peer • Encrypted • Class {classCode} only</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Call Mini Bar — Bottom, compact, non-intrusive */}
      <AnimatePresence>
        {activeCall && activeCall.status === 'connected' && !incomingCall && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] rounded-full border border-emerald-500/20 bg-[#0a0a0a] shadow-2xl px-4 h-12 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-[12px]">
              {activeCall.direction === 'outgoing' ? activeCall.to.avatar : activeCall.from.avatar}
            </div>
            <div>
              <p className="text-[12px] font-medium text-zinc-100 leading-none">
                {activeCall.direction === 'outgoing' ? activeCall.to.name : activeCall.from.name} • {formatDuration(duration)}
              </p>
              <p className="text-[10px] text-zinc-500 leading-none mt-1">● Live • {activeCall.type} • Mute/Hold available</p>
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => classCallEngine.toggleMute(activeCall.id)}
                className={`h-8 w-8 rounded-full border flex items-center justify-center text-[12px] transition ${activeCall.isMuted ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}
              >
                {activeCall.isMuted ? '🔇' : '🎤'}
              </button>
              <button
                onClick={() => classCallEngine.endCall(activeCall.id)}
                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
