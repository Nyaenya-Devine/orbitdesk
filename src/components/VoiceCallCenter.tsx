'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface CallMessage {
 id: string;
 speaker: 'client' | 'you' | 'system';
 text: string;
 time: string;
 isVoice: boolean;
 sentiment?: 'urgent' | 'calm' | 'frustrated' | 'happy';
}

interface Call {
 id: string;
 status: 'incoming' | 'active' | 'on-hold' | 'ended';
 duration: number;
 holdDuration: number;
 transcript: CallMessage[];
 persona: 'enterprise' | 'smb' | 'regulated';
 phase: 'waiting_greeting' | 'waiting_intro' | 'problem' | 'troubleshooting' | 'resolution';
 isRecording: boolean;
 clientName: string;
 userEmail: string;
 priority: string;
}

const greetings = {
 enterprise: ["Hello? Is this IT support? I'm having an issue with my account.", "Hi, is this the helpdesk? I need assistance urgently."],
 smb: ["Hello? Hi, is this IT? My Outlook is not working.", "Hey, is this support? Email trouble, client call soon!"],
 regulated: ["Good morning, is this IT support? Compliance issue blocking Teams.", "Hello, Risk and Compliance, need help with device compliance per SEC-2024-07."],
};

const intros = {
 enterprise: (name: string, client: string) => `Hi, thank you for picking up. This is ${name} from Finance at ${client}. I'm blocked by Conditional Access, error 53000 DeviceNotCompliant. Payroll deadline in 45 minutes, P1. Could you help me?`,
 smb: (name: string, client: string) => `Hi! So it's ${name} from ${client}. My shared mailbox finance at bloomco dot studio is not showing in Outlook? I can see it in webmail though. Client call in 20 minutes, could you help with simple steps?`,
 regulated: (name: string, client: string) => `Good morning. This is ${name} from Risk and Compliance at ${client}. Per policy SEC-2024-07, device Not Compliant blocking Teams. Need audit trail and RCA. Can you assist?`,
};

const troubleshooting = {
 enterprise: [
 "I checked Service Health, it's green. Should I check Sign-in logs CA tab? Correlation ID {id}",
 "Ran dsregcmd status — AzureAdJoined YES, Compliance NO. What next?",
 "Checked Company Portal Sync, last sync 2 mins ago, BitLocker Not Compliant. Should I enable?",
 ],
 smb: [
 "Where do I type that? Is it in Start menu? Says AzureAdJoined YES but Compliance NO — what does that mean?",
 "Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant?",
 "Will I lose my unsaved Photoshop work if I restart? I have client call in 20 mins!",
 ],
 regulated: [
 "Executed dsregcmd status per instruction. AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need audit trail.",
 "Per policy SEC-2024-07, BitLocker required. Checked Get-BitLockerVolume: Protection Off. Need approved procedure.",
 "Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy Require compliant device.",
 ],
};

function getCallFrequencyForLevel(level: number) {
 // Beginner-friendly: phone is rare and only critical, scales with level
 if (level <= 1) {
  return {
   initialDelayMs: 5 * 60 * 1000, // 5 min before first call for lvl1
   countdownIntervalMs: 1000,
   autoCheckIntervalMs: 120 * 1000, // check every 2 min
   randomChance: 0, // no random auto-calls at lvl1 — only manual or P1 critical trigger
   minNextCallSec: 300, // 5 min
   maxNextCallSec: 600, // 10 min
   allowNonCritical: false,
   maxCallsPerHour: 1,
   description: "Level 1 — No auto calls, focus on tickets. Phone unlocks at Lvl 2. Use Call Now to practice.",
  };
 }
 if (level === 2) {
  return {
   initialDelayMs: 3 * 60 * 1000, // 3 min
   countdownIntervalMs: 1000,
   autoCheckIntervalMs: 90 * 1000,
   randomChance: 0.05, // 5% chance every check
   minNextCallSec: 240, // 4 min
   maxNextCallSec: 480, // 8 min
   allowNonCritical: false, // only P1 critical
   maxCallsPerHour: 2,
   description: "Level 2 — Rare P1 critical calls only, 1 per 4-8 min max. Learn basics first.",
  };
 }
 if (level === 3) {
  return {
   initialDelayMs: 2 * 60 * 1000, // 2 min
   countdownIntervalMs: 1000,
   autoCheckIntervalMs: 60 * 1000,
   randomChance: 0.10,
   minNextCallSec: 180,
   maxNextCallSec: 360,
   allowNonCritical: true, // allow P2 but prefer P1
   maxCallsPerHour: 3,
   description: "Level 3 — Occasional calls, P1 priority, 1 per 3-6 min.",
  };
 }
 if (level === 4) {
  return {
   initialDelayMs: 90 * 1000,
   countdownIntervalMs: 1000,
   autoCheckIntervalMs: 45 * 1000,
   randomChance: 0.12,
   minNextCallSec: 120,
   maxNextCallSec: 300,
   allowNonCritical: true,
   maxCallsPerHour: 4,
   description: "Level 4 — Moderate calls, real MSP pace.",
  };
 }
 // Level 5+
 return {
  initialDelayMs: 60 * 1000,
  countdownIntervalMs: 1000,
  autoCheckIntervalMs: 30 * 1000,
  randomChance: 0.15,
  minNextCallSec: 90,
  maxNextCallSec: 240,
  allowNonCritical: true,
  maxCallsPerHour: 6,
  description: `Level ${level} — Realistic MSP: calls when P1 critical or SLA breaching, max ${Math.min(8, 4 + level)} per hour.`,
 };
}

export default function VoiceCallCenter({ tickets, onAccept, level = 1 }: { tickets: any[], onAccept: (t: any) => void, level?: number }) {
 const [activeCall, setActiveCall] = useState<Call | null>(null);
 const [incoming, setIncoming] = useState<any | null>(null);
 const [isListening, setIsListening] = useState(false);
 const [isSpeaking, setIsSpeaking] = useState(false);
 const [isMuted, setIsMuted] = useState(false);
 const [isOnHold, setIsOnHold] = useState(false);
 const [isRingMuted, setIsRingMuted] = useState(false);
 const [isAppHidden, setIsAppHidden] = useState(false);
 const [liveTranscript, setLiveTranscript] = useState('');
 const [userAudioLevel, setUserAudioLevel] = useState(0);
 const [clientAudioLevel, setClientAudioLevel] = useState(0);
 const [showCallHistory, setShowCallHistory] = useState(false);
 const [accepting, setAccepting] = useState(false);

 const transcriptRef = useRef<HTMLDivElement>(null);
 const transcriptEndRef = useRef<HTMLDivElement>(null);
 const recognitionRef = useRef<any>(null);
 const synthRef = useRef<SpeechSynthesis | null>(null);
 const audioContextRef = useRef<AudioContext | null>(null);
 const isRingingRef = useRef(false);
 const incomingRef = useRef<any>(null);
 const activeCallRef = useRef<Call | null>(null);
 const recordingBeepRef = useRef<any>(null);
 const holdMusicRef = useRef<AudioContext | null>(null);
 const holdMusicTimeoutRef = useRef<any>(null);
 const streamRef = useRef<MediaStream | null>(null);
 const micContextRef = useRef<AudioContext | null>(null);
 const micRafRef = useRef<number | null>(null);
 const vibrateTimeoutRef = useRef<any>(null);
 const ringOscillatorsRef = useRef<{ osc1?: OscillatorNode, osc2?: OscillatorNode, gain?: GainNode } | null>(null);

 const freqConfig = getCallFrequencyForLevel(level);
 const [nextCallIn, setNextCallIn] = useState(freqConfig.minNextCallSec);
 const [missedCalls, setMissedCalls] = useState<any[]>([]);
 const [callHistory, setCallHistory] = useState<any[]>([]);

 // Keep refs in sync
 useEffect(() => { incomingRef.current = incoming; }, [incoming]);
 useEffect(() => { activeCallRef.current = activeCall; }, [activeCall]);

 // Cleanup on unmount — harden all audio leaks
 useEffect(() => {
 return () => {
  isRingingRef.current = false;
  try {
   if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
  } catch {}
  audioContextRef.current = null;
  try {
   if (holdMusicRef.current && holdMusicRef.current.state !== 'closed') holdMusicRef.current.close();
  } catch {}
  holdMusicRef.current = null;
  if (holdMusicTimeoutRef.current) clearTimeout(holdMusicTimeoutRef.current);
  if (recordingBeepRef.current) clearInterval(recordingBeepRef.current);
  if (vibrateTimeoutRef.current) clearTimeout(vibrateTimeoutRef.current);
  if (micRafRef.current) cancelAnimationFrame(micRafRef.current);
  try {
   if (micContextRef.current && micContextRef.current.state !== 'closed') micContextRef.current.close();
  } catch {}
  if (streamRef.current) {
   try { streamRef.current.getTracks().forEach(t => t.stop()); } catch {}
   streamRef.current = null;
  }
  if ('vibrate' in navigator) {
   try { navigator.vibrate(0); } catch {}
  }
  if (synthRef.current) {
   try { synthRef.current.cancel(); } catch {}
  }
 };
 }, []);

 useEffect(() => {
 if (typeof window !== 'undefined') {
  synthRef.current = window.speechSynthesis;
  if (synthRef.current) {
   synthRef.current.getVoices();
   if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = () => synthRef.current?.getVoices();
   }
  }
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SpeechRecognition) {
   const rec = new SpeechRecognition();
   rec.continuous = false;
   rec.interimResults = true;
   rec.lang = 'en-US';
   rec.onstart = () => setIsListening(true);
   rec.onend = () => setIsListening(false);
   rec.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
     const t = event.results[i][0].transcript;
     if (event.results[i].isFinal) final += t + ' ';
     else interim += t;
    }
    if (final) {
     handleUserVoice(final.trim());
     setLiveTranscript('');
    } else setLiveTranscript(interim);
   };
   rec.onerror = () => setIsListening(false);
   recognitionRef.current = rec;
  }
  if ('Notification' in window && Notification.permission === 'default') {
   Notification.requestPermission();
  }
  try {
   const savedMute = localStorage.getItem('orbitdesk_ring_muted');
   if (savedMute === 'true') setIsRingMuted(true);
  } catch {}
  const handleVisibility = () => {
   const hidden = document.hidden;
   setIsAppHidden(hidden);
   if (hidden) {
    isRingingRef.current = false;
    try {
     if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
     }
     audioContextRef.current = null;
    } catch {}
    if (ringOscillatorsRef.current) {
     try {
      ringOscillatorsRef.current.osc1?.stop();
      ringOscillatorsRef.current.osc2?.stop();
     } catch {}
     ringOscillatorsRef.current = null;
    }
    if (vibrateTimeoutRef.current) {
     clearTimeout(vibrateTimeoutRef.current);
     vibrateTimeoutRef.current = null;
    }
    if ('vibrate' in navigator) {
     try { navigator.vibrate(0); } catch {}
    }
   }
  };
  document.addEventListener('visibilitychange', handleVisibility);
  const handleBlur = () => {
   setIsAppHidden(true);
   isRingingRef.current = false;
   try {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
     audioContextRef.current.close();
    }
    audioContextRef.current = null;
   } catch {}
   if (ringOscillatorsRef.current) {
    try {
     ringOscillatorsRef.current.osc1?.stop();
     ringOscillatorsRef.current.osc2?.stop();
    } catch {}
    ringOscillatorsRef.current = null;
   }
   if (vibrateTimeoutRef.current) {
    clearTimeout(vibrateTimeoutRef.current);
    vibrateTimeoutRef.current = null;
   }
   try { if ('vibrate' in navigator) navigator.vibrate(0); } catch {}
  };
  const handleFocus = () => setIsAppHidden(false);
  window.addEventListener('blur', handleBlur);
  window.addEventListener('focus', handleFocus);
  return () => {
   document.removeEventListener('visibilitychange', handleVisibility);
   window.removeEventListener('blur', handleBlur);
   window.removeEventListener('focus', handleFocus);
  };
 }
 }, []);

 // Transcript auto-scroll — hardened
 useEffect(() => {
 if (transcriptEndRef.current) {
  transcriptEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
 } else if (transcriptRef.current) {
  transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
 }
 }, [activeCall?.transcript, liveTranscript, isOnHold]);

 const showBrowserNotification = useCallback((ticket: any) => {
 if ('Notification' in window && Notification.permission === 'granted') {
  try {
   new Notification(`📞 Incoming Call — ${ticket.clientName}`, {
    body: `${ticket.userEmail} • ${ticket.priority} • ${ticket.title}\n"${ticket.userMessage.substring(0,60)}..."`,
    icon: '/icon-512.png',
    tag: 'orbitdesk-call',
    requireInteraction: true,
   });
  } catch {}
 }
 }, []);

 const stopRingtone = useCallback(() => {
 isRingingRef.current = false;
 if (vibrateTimeoutRef.current) {
  clearTimeout(vibrateTimeoutRef.current);
  vibrateTimeoutRef.current = null;
 }
 try {
  if (ringOscillatorsRef.current) {
   try {
    ringOscillatorsRef.current.osc1?.stop();
    ringOscillatorsRef.current.osc2?.stop();
   } catch {}
   ringOscillatorsRef.current = null;
  }
  if (audioContextRef.current) {
   if (audioContextRef.current.state !== 'closed') {
    audioContextRef.current.close();
   }
   audioContextRef.current = null;
  }
  if ('vibrate' in navigator) navigator.vibrate(0);
 } catch {}
 }, []);

 const playRingtone = useCallback(() => {
 if (isRingingRef.current) return;
 if (isRingMuted) return;
 if (typeof document !== 'undefined' && document.hidden) return;
 if (isAppHidden) return;
 // Ensure previous cleaned
 stopRingtone();
 isRingingRef.current = true;
 try {
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  audioContextRef.current = ctx;

  const playCycle = () => {
   if (!isRingingRef.current) return;
   if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
   if (isRingMuted) { stopRingtone(); return; }
   if (typeof document !== 'undefined' && document.hidden) { stopRingtone(); return; }
   if (isAppHidden) { stopRingtone(); return; }
   try {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc1.frequency.value = 440;
    osc2.frequency.value = 480;
    filter.type = 'bandpass';
    filter.frequency.value = 460;
    gain.gain.value = 0.12;
    ringOscillatorsRef.current = { osc1, osc2, gain };
    osc1.start();
    osc2.start();
    setTimeout(() => {
     try { 
      osc1.stop(); 
      osc2.stop(); 
     } catch {}
     ringOscillatorsRef.current = null;
     if (isRingingRef.current && !isRingMuted && !(typeof document !== 'undefined' && document.hidden) && !isAppHidden) {
      vibrateTimeoutRef.current = setTimeout(playCycle, 4000);
     }
    }, 2000);
   } catch {
    if (isRingingRef.current && !isRingMuted && !isAppHidden) {
     vibrateTimeoutRef.current = setTimeout(playCycle, 4000);
    }
   }
  };
  if (ctx.state === 'suspended') {
   ctx.resume().then(playCycle).catch(playCycle);
  } else {
   playCycle();
  }
  if ('vibrate' in navigator && !isRingMuted && !(typeof document !== 'undefined' && document.hidden) && !isAppHidden) {
   const vibrateLoop = () => {
    if (!isRingingRef.current || isRingMuted || isAppHidden) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    try { navigator.vibrate([500, 300, 500, 300, 500]); } catch {}
    vibrateTimeoutRef.current = setTimeout(vibrateLoop, 6000);
   };
   vibrateLoop();
  }
 } catch {}
 }, [isRingMuted, isAppHidden, stopRingtone]);

 const playRecordingBeep = useCallback(() => {
 // Use single-use context but close immediately — no leak
 try {
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = 1000;
  gain.gain.value = 0.08;
  osc.start();
  setTimeout(() => {
   try { osc.stop(); } catch {}
   try { if (ctx.state !== 'closed') ctx.close(); } catch {}
  }, 200);
 } catch {}
 }, []);

 const startRecordingBeep = useCallback(() => {
 if (recordingBeepRef.current) clearInterval(recordingBeepRef.current);
 playRecordingBeep();
 recordingBeepRef.current = setInterval(playRecordingBeep, 15000);
 }, [playRecordingBeep]);

 const stopRecordingBeep = useCallback(() => {
 if (recordingBeepRef.current) {
  clearInterval(recordingBeepRef.current);
  recordingBeepRef.current = null;
 }
 }, []);

 const playHoldMusic = useCallback(() => {
 // Clean previous first
 try {
  if (holdMusicRef.current && holdMusicRef.current.state !== 'closed') {
   holdMusicRef.current.close();
  }
 } catch {}
 holdMusicRef.current = null;
 if (holdMusicTimeoutRef.current) {
  clearTimeout(holdMusicTimeoutRef.current);
  holdMusicTimeoutRef.current = null;
 }
 try {
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  holdMusicRef.current = ctx;
  const playNote = (freq: number, duration: number, delay: number) => {
   holdMusicTimeoutRef.current = setTimeout(() => {
    if (!holdMusicRef.current || holdMusicRef.current.state === 'closed') return;
    if (!activeCallRef.current || activeCallRef.current.status !== 'on-hold') return;
    try {
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.frequency.value = freq;
     osc.type = 'sine';
     gain.gain.setValueAtTime(0, ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
     gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
     osc.start();
     osc.stop(ctx.currentTime + duration);
    } catch {}
   }, delay);
  };
  const melody = [261.63, 329.63, 392.00, 523.25];
  const loopMelody = () => {
   if (!holdMusicRef.current || holdMusicRef.current.state === 'closed') return;
   if (!activeCallRef.current || activeCallRef.current.status !== 'on-hold') return;
   let time = 0;
   melody.forEach((freq, i) => {
    playNote(freq, 0.8, time + i * 900);
   });
   time += melody.length * 900 + 1000;
   holdMusicTimeoutRef.current = setTimeout(loopMelody, melody.length * 900 + 2000);
  };
  loopMelody();
 } catch {}
 }, []);

 const stopHoldMusic = useCallback(() => {
 if (holdMusicTimeoutRef.current) {
  clearTimeout(holdMusicTimeoutRef.current);
  holdMusicTimeoutRef.current = null;
 }
 try {
  if (holdMusicRef.current) {
   if (holdMusicRef.current.state !== 'closed') {
    holdMusicRef.current.close();
   }
   holdMusicRef.current = null;
  }
 } catch {
  holdMusicRef.current = null;
 }
 }, []);

 const speakClient = useCallback((text: string, persona: 'enterprise' | 'smb' | 'regulated') => {
 if (!text) return;
 if (isMuted || isOnHold) return;
 try {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = synthRef.current || window.speechSynthesis;
  if (!synth) return;
  synthRef.current = synth as any;
  try { synth.cancel(); } catch {}
  const utter = new SpeechSynthesisUtterance(text.substring(0, 400));
  utter.rate = persona === 'smb' ? 1.15 : persona === 'regulated' ? 0.9 : 1.0;
  utter.pitch = persona === 'smb' ? 1.2 : persona === 'regulated' ? 0.8 : 0.9;
  utter.volume = 0.95;
  try {
   const voices = synth.getVoices?.() || [];
   const match = voices.find((v:any) => v.lang?.startsWith('en')) || voices[0];
   if (match) utter.voice = match;
  } catch {}
  utter.onstart = () => { try { setIsSpeaking(true); } catch {} };
  utter.onend = () => { try { setIsSpeaking(false); setClientAudioLevel(0); } catch {} };
  utter.onerror = () => { try { setIsSpeaking(false); setClientAudioLevel(0); } catch {} };
  synth.speak(utter);
  const interval = setInterval(() => {
   try {
    if (!synthRef.current?.speaking) { clearInterval(interval); setClientAudioLevel(0); return; }
    setClientAudioLevel(Math.random() * 80 + 20);
   } catch { clearInterval(interval); }
  }, 100);
  setTimeout(() => { try { clearInterval(interval); } catch {} }, 8000);
 } catch (e) {
  console.log('speakClient failed, fallback to text only', e);
  try { setIsSpeaking(false); } catch {}
 }
 }, [isMuted, isOnHold]);

 const startMic = async () => {
 if (!recognitionRef.current) { alert('Use Chrome/Edge for mic 🎙️ — voice-to-voice call, no texting'); return; }
 // Clean previous
 if (micRafRef.current) {
  cancelAnimationFrame(micRafRef.current);
  micRafRef.current = null;
 }
 try {
  if (micContextRef.current && micContextRef.current.state !== 'closed') {
   micContextRef.current.close();
  }
 } catch {}
 micContextRef.current = null;
 if (streamRef.current) {
  try { streamRef.current.getTracks().forEach(t => t.stop()); } catch {}
  streamRef.current = null;
 }
 try {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  streamRef.current = stream;
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();
  micContextRef.current = ctx;
  if (ctx.state === 'suspended') {
   await ctx.resume().catch(()=>{});
  }
  const analyser = ctx.createAnalyser();
  const source = ctx.createMediaStreamSource(stream);
  source.connect(analyser);
  analyser.fftSize = 256;
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  let running = true;
  const animate = () => {
   if (!running) return;
   if (!isListening && recognitionRef.current) {
    // Still animate level while listening state true, but check ref
   }
   try {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a,b) => a+b, 0) / dataArray.length;
    setUserAudioLevel(avg);
   } catch {}
   if (running) {
    micRafRef.current = requestAnimationFrame(animate);
   }
  };
  animate();
  // Store stop handler
  (stream as any)._stopAnimate = () => { running = false; };
 } catch (e) { console.log('mic error', e); }
 setLiveTranscript('');
 try { recognitionRef.current.start(); } catch {}
 };

 const stopMic = useCallback(() => {
 try {
  if (recognitionRef.current) {
   try { recognitionRef.current.stop(); } catch {}
  }
 } catch {}
 if (micRafRef.current) {
  cancelAnimationFrame(micRafRef.current);
  micRafRef.current = null;
 }
 try {
  if (micContextRef.current && micContextRef.current.state !== 'closed') {
   micContextRef.current.close();
  }
 } catch {}
 micContextRef.current = null;
 if (streamRef.current) {
  try {
   const s: any = streamRef.current;
   if (s._stopAnimate) s._stopAnimate();
   streamRef.current.getTracks().forEach(t => t.stop());
  } catch {}
  streamRef.current = null;
 }
 setUserAudioLevel(0);
 setIsListening(false);
 }, []);

 const handleUserVoice = (text: string) => {
 if (!text.trim()) return;
 const currentCall = activeCallRef.current;
 if (!currentCall) return;
 const now = `${String(Math.floor(currentCall.duration/60)).padStart(2,'0')}:${String(currentCall.duration%60).padStart(2,'0')}`;
 const prevPhase = currentCall.phase;
 let nextPhase: Call['phase'] = prevPhase;
 if (prevPhase === 'waiting_greeting') nextPhase = 'waiting_intro';
 else if (prevPhase === 'waiting_intro') nextPhase = 'problem';
 else if (prevPhase === 'problem') nextPhase = 'troubleshooting';

 const userMsg: CallMessage = { id: Date.now().toString(), speaker: 'you', text, time: now, isVoice: true };
 setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, userMsg], phase: nextPhase } : null);

 setTimeout(() => {
  let reply = '';
  const persona = currentCall.persona;
  if (prevPhase === 'waiting_greeting') {
   reply = intros[persona](currentCall.id.split('-')[0], currentCall.clientName);
   setActiveCall(prev => prev ? { ...prev, phase: 'waiting_intro' } : null);
  } else if (prevPhase === 'waiting_intro') {
   if (persona === 'enterprise') reply = `Yes, so I'm getting blocked by Conditional Access when trying to access Outlook and Teams. Error DeviceNotCompliant 53000. Could you check Sign-in logs CA tab? P1 payroll deadline 45 mins.`;
   else if (persona === 'smb') reply = `Yeah, shared mailbox finance at bloomco dot studio not showing in Outlook? I can see it in webmail though. Could you help with simple steps? Client call in 20 mins!`;
   else reply = `Thank you. Per SEC-2024-07, device Not Compliant blocking Teams. I checked Get-BitLockerVolume, Protection Off, 0 percent. Need audit trail and RCA.`;
   setActiveCall(prev => prev ? { ...prev, phase: 'problem' } : null);
  } else {
   const replies = troubleshooting[persona];
   reply = replies[Math.floor(Math.random() * replies.length)].replace('{id}', Math.random().toString(36).substring(7));
   const lower = text.toLowerCase();
   if (lower.includes('dsregcmd')) reply = `Okay, I ran dsregcmd status — AzureAdJoined YES, Compliance NO, DeviceId ${Math.random().toString(36).substring(7)}. What next?`;
   else if (lower.includes('company portal') || lower.includes('sync')) reply = `Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant?`;
   else if (lower.includes('bitlocker')) reply = `Oh, BitLocker? Is it safe? Will it delete my files? Will I lose my Photoshop work?`;
   else if (lower.includes('thank') || lower.includes('fixed') || lower.includes('working')) { reply = `Perfect, it works now! Thank you, you explained in simple steps! Five stars! ⭐⭐⭐⭐⭐`; setActiveCall(prev => prev ? { ...prev, phase: 'resolution' } : null); }
  }
  const clientMsg: CallMessage = { id: (Date.now()+1).toString(), speaker: 'client', text: reply, time: `${String(Math.floor((currentCall.duration+2)/60)).padStart(2,'0')}:${String((currentCall.duration+2)%60).padStart(2,'0')}`, isVoice: true, sentiment: prevPhase === 'waiting_greeting' ? 'calm' : 'urgent' };
  setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, clientMsg] } : null);
  speakClient(reply, persona);
 }, 800);
 };

 const acceptCall = useCallback((e?: any) => {
 if (e) { e.preventDefault(); e.stopPropagation(); }
 if (accepting) return;
 try {
  const ticketToAccept = incomingRef.current || incoming;
  if (!ticketToAccept) {
   console.log('No incoming call to accept');
   return;
  }
  setAccepting(true);
  console.log('Accepting call', ticketToAccept.id);
  try { stopRingtone(); } catch {}
  const persona = (ticketToAccept.clientId === 'client-a' ? 'enterprise' : ticketToAccept.clientId === 'client-b' ? 'smb' : 'regulated') as 'enterprise' | 'smb' | 'regulated';
  const greeting = greetings[persona]?.[Math.floor(Math.random() * greetings[persona].length)] || greetings.enterprise[0];
  const newCall: Call = {
   id: ticketToAccept.id || `call-${Date.now()}`,
   status: 'active',
   duration: 0,
   holdDuration: 0,
   transcript: [
    { id: '1', speaker: 'system', text: `📞 Voice Call Connected • ${ticketToAccept.userEmail || 'client'} • ${ticketToAccept.clientName || 'Client'} • 🔴 Recording ON • Encrypted TLS 1.3`, time: '00:00', isVoice: false },
    { id: '2', speaker: 'client', text: greeting, time: '00:03', isVoice: true, sentiment: 'calm' },
   ],
   persona,
   phase: 'waiting_greeting',
   isRecording: true,
   clientName: ticketToAccept.clientName || 'Client',
   userEmail: ticketToAccept.userEmail || 'client@example.com',
   priority: ticketToAccept.priority || 'P1',
  };
  setActiveCall(newCall);
  activeCallRef.current = newCall;
  setIncoming(null);
  incomingRef.current = null;
  try { onAccept(ticketToAccept); } catch (err) { console.error('onAccept error', err); }
  try { startRecordingBeep(); } catch {}
  setTimeout(() => {
   try { speakClient(greeting, persona); } catch {}
   setAccepting(false);
  }, 600);
 } catch (err) {
  console.error('acceptCall failed', err);
  setAccepting(false);
  // Fallback: ensure call still opens even if speech fails
  try {
   const ticketToAccept = incomingRef.current || incoming;
   if (ticketToAccept) {
    const fallbackCall: Call = {
     id: ticketToAccept.id || `call-${Date.now()}`,
     status: 'active',
     duration: 0,
     holdDuration: 0,
     transcript: [{ id: '1', speaker: 'system', text: '📞 Call connected — voice may be unavailable in this browser, use text fallback', time: '00:00', isVoice: false }],
     persona: 'enterprise',
     phase: 'problem',
     isRecording: false,
     clientName: ticketToAccept.clientName || 'Client',
     userEmail: ticketToAccept.userEmail || 'client@example.com',
     priority: ticketToAccept.priority || 'P1',
    };
    setActiveCall(fallbackCall);
    activeCallRef.current = fallbackCall;
    setIncoming(null);
    incomingRef.current = null;
   }
  } catch {}
 }
 }, [accepting, onAccept, speakClient, startRecordingBeep, stopRingtone, incoming]);

 const declineCall = useCallback((e?: any) => {
 if (e) { e.preventDefault(); e.stopPropagation(); }
 const ticket = incomingRef.current || incoming;
 if (ticket) {
  setMissedCalls(prev => [{ ...ticket, missedAt: Date.now() }, ...prev].slice(0,5));
  setCallHistory(prev => [{ id: ticket.id, clientName: ticket.clientName, userEmail: ticket.userEmail, priority: ticket.priority, status: 'missed', duration: 0, endedAt: Date.now(), persona: ticket.clientId === 'client-a' ? 'enterprise' : ticket.clientId === 'client-b' ? 'smb' : 'regulated' }, ...prev].slice(0,20));
 }
 stopRingtone();
 stopMic();
 setIncoming(null);
 incomingRef.current = null;
 const c = getCallFrequencyForLevel(level);
 setNextCallIn(c.minNextCallSec + Math.floor(Math.random()*(c.maxNextCallSec - c.minNextCallSec)));
 setAccepting(false);
 }, [incoming, stopRingtone, stopMic, level]);
 
 const endCall = useCallback(() => { 
 if (activeCallRef.current) {
  setCallHistory(prev => [{ id: activeCallRef.current!.id, clientName: activeCallRef.current!.clientName, userEmail: activeCallRef.current!.userEmail, priority: activeCallRef.current!.priority, status: 'ended', duration: activeCallRef.current!.duration, endedAt: Date.now(), persona: activeCallRef.current!.persona }, ...prev].slice(0,20));
 }
 stopRingtone(); 
 stopRecordingBeep();
 stopHoldMusic();
 stopMic();
 if (synthRef.current) {
  try { synthRef.current.cancel(); } catch {}
 }
 setIsSpeaking(false);
 setClientAudioLevel(0);
 setActiveCall(null); 
 activeCallRef.current = null;
 setIsOnHold(false);
 const c = getCallFrequencyForLevel(level);
 setNextCallIn(c.minNextCallSec + Math.floor(Math.random()*(c.maxNextCallSec - c.minNextCallSec)));
 }, [stopRingtone, stopRecordingBeep, stopHoldMusic, stopMic, level]);

 const toggleHold = useCallback(() => {
 const call = activeCallRef.current;
 if (!call) return;
 const newHold = !isOnHold;
 setIsOnHold(newHold);
 if (newHold) {
  setActiveCall(prev => prev ? { ...prev, status: 'on-hold' } : null);
  if (activeCallRef.current) activeCallRef.current.status = 'on-hold';
  playHoldMusic();
  const holdMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `⏸️ Call placed on hold at ${String(Math.floor(call.duration/60)).padStart(2,'0')}:${String(call.duration%60).padStart(2,'0')} — playing hold music for client`, time: `${String(Math.floor(call.duration/60)).padStart(2,'0')}:${String(call.duration%60).padStart(2,'0')}`, isVoice: false };
  setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, holdMsg] } : null);
 } else {
  setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
  if (activeCallRef.current) activeCallRef.current.status = 'active';
  stopHoldMusic();
  const resumeMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `▶️ Call resumed at ${String(Math.floor(call.duration/60)).padStart(2,'0')}:${String(call.duration%60).padStart(2,'0')} — hold duration ${call.holdDuration}s`, time: `${String(Math.floor(call.duration/60)).padStart(2,'0')}:${String(call.duration%60).padStart(2,'0')}`, isVoice: false };
  setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, resumeMsg] } : null);
 }
 }, [isOnHold, playHoldMusic, stopHoldMusic]);

 const toggleMute = useCallback(() => {
 setIsMuted(prev => {
  const newMuted = !prev;
  if (newMuted && synthRef.current) {
   try { synthRef.current.cancel(); } catch {}
   setIsSpeaking(false);
   setClientAudioLevel(0);
  }
  return newMuted;
 });
 }, []);

 const createRandomTicket = useCallback(() => {
 // Critical-only for beginners: prefer P1 and breaching tickets
 const cfg = getCallFrequencyForLevel(level);
 let pool = tickets;
 if (cfg.allowNonCritical === false) {
  // Only P1 or breaching
  const critical = tickets.filter((t:any) => t.priority === 'P1' || t.slaBreach || t.timeLeftMs < 5*60*1000);
  if (critical.length > 0) pool = critical;
  else {
   // No critical tickets — don't create call at low level (return null to suppress)
   if (level <= 2) return null;
  }
 }
 if (pool.length > 0) {
  // Prefer P1
  const p1s = pool.filter((t:any) => t.priority === 'P1');
  const chosen = p1s.length > 0 && Math.random() < 0.8 ? p1s[Math.floor(Math.random()*p1s.length)] : pool[Math.floor(Math.random()*pool.length)];
  return chosen;
 }
 // Fallback only if level allows non-critical
 if (!cfg.allowNonCritical && level <= 2) return null;
 return {
  id: `call-${Date.now()}`,
  clientId: ['client-a', 'client-b', 'client-c'][Math.floor(Math.random()*3)],
  clientName: ['NovaTech Financial', 'Bloom Studio', 'Apex Financial'][Math.floor(Math.random()*3)],
  priority: cfg.allowNonCritical ? (Math.random() < 0.4 ? 'P1' : 'P2') : 'P1',
  userEmail: ['sarah.finance@novatech.com', 'emma@bloomco.studio', 'risk@apexfin.com'][Math.floor(Math.random()*3)],
  userMessage: level <=2 ? "P1 CRITICAL: Can't access Outlook, device not compliant. Need payroll email! Correlation ID urgent — please help!" : "Hello? Is this IT support? Need help with my account.",
  code: 'CALL-' + Math.random().toString(36).substring(7).toUpperCase(),
  title: level <=2 ? 'P1 Critical Call - Needs Immediate Help' : 'Live Call - Need Assistance',
 };
 }, [tickets, level]);

 const triggerCall = useCallback((ticket?: any) => {
 if (activeCallRef.current || incomingRef.current) return;
 const cfg = getCallFrequencyForLevel(level);
 // For beginners lvl1, no auto calls unless explicitly triggered with ticket
 if (!ticket && level <=1) {
  console.log('Lvl1 — auto calls disabled, use Call Now button to practice');
  return;
 }
 const t = ticket || createRandomTicket();
 if (!t) {
  console.log('No critical ticket available for call at this level — suppressing');
  // Reschedule next check longer
  setNextCallIn(cfg.minNextCallSec + Math.floor(Math.random()*(cfg.maxNextCallSec - cfg.minNextCallSec)));
  return;
 }
 console.log(`Triggering incoming call [Lvl ${level} — ${cfg.description}]`, t.id);
 setIncoming(t);
 incomingRef.current = t;
 if (!isRingMuted && !(typeof document !== 'undefined' && document.hidden) && !isAppHidden) {
  playRingtone();
 } else {
  console.log('Ring suppressed — muted:', isRingMuted, 'hidden:', typeof document !== 'undefined' && document.hidden, 'appHidden:', isAppHidden);
 }
 showBrowserNotification(t);
 const nextSec = cfg.minNextCallSec + Math.floor(Math.random()*(cfg.maxNextCallSec - cfg.minNextCallSec));
 setNextCallIn(nextSec);
 }, [createRandomTicket, playRingtone, showBrowserNotification, isRingMuted, isAppHidden, level]);

 useEffect(() => {
 const cfg = getCallFrequencyForLevel(level);
 console.log(`[OrbitDesk Phone] Lvl ${level} config:`, cfg.description);
 // Initial delay based on level
 const initialTimer = setTimeout(() => {
  if (!activeCallRef.current && !incomingRef.current) {
   // Only auto-trigger if level >=2, lvl1 needs manual
   if (level >= 2) {
    triggerCall();
   }
  }
 }, cfg.initialDelayMs);

 const countdown = setInterval(() => {
  setNextCallIn(prev => {
   if (prev <= 1) {
    if (!activeCallRef.current && !incomingRef.current) {
     // Only trigger if level allows and critical exists
     if (level >= 2) {
      triggerCall();
     }
    }
    const c = getCallFrequencyForLevel(level);
    return c.minNextCallSec + Math.floor(Math.random()*(c.maxNextCallSec - c.minNextCallSec));
   }
   return prev - 1;
  });
 }, cfg.countdownIntervalMs);

 const interval = setInterval(() => {
  if (!activeCallRef.current && !incomingRef.current) {
   const c = getCallFrequencyForLevel(level);
   if (Math.random() < c.randomChance) {
    triggerCall();
   }
  }
 }, cfg.autoCheckIntervalMs);

 (window as any).triggerIncomingCall = (ticket?: any) => {
  console.log('Manual trigger call clicked — always allowed');
  if (ticket) triggerCall(ticket);
  else {
   // For manual, bypass level check and force create
   const t = createRandomTicket() || {
    id: `call-${Date.now()}`,
    clientId: 'client-a',
    clientName: 'NovaTech Financial',
    priority: 'P1',
    userEmail: 'sarah.finance@novatech.com',
    userMessage: "P1: Can't access Outlook, device not compliant. Need payroll email! Correlation ID urgent!",
    code: 'CALL-' + Math.random().toString(36).substring(7).toUpperCase(),
    title: 'Manual Call - Practice',
   };
   triggerCall(t);
  }
 };

 return () => {
  clearTimeout(initialTimer);
  clearInterval(countdown);
  clearInterval(interval);
  isRingingRef.current = false;
 };
 }, [triggerCall, level, createRandomTicket]);

 useEffect(() => {
 if (!activeCall || activeCall.status !== 'active') return;
 const timer = setInterval(() => setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null), 1000);
 return () => clearInterval(timer);
 }, [activeCall]);

 useEffect(() => {
 if (!activeCall || activeCall.status !== 'on-hold') return;
 const timer = setInterval(() => setActiveCall(prev => prev ? { ...prev, holdDuration: prev.holdDuration + 1 } : null), 1000);
 return () => clearInterval(timer);
 }, [activeCall?.status]);

 useEffect(() => {
 const resumeAudio = () => {
  if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
   audioContextRef.current.resume().catch(()=>{});
  }
  if (holdMusicRef.current && holdMusicRef.current.state === 'suspended') {
   holdMusicRef.current.resume().catch(()=>{});
  }
  if (micContextRef.current && micContextRef.current.state === 'suspended') {
   micContextRef.current.resume().catch(()=>{});
  }
 };
 window.addEventListener('click', resumeAudio);
 window.addEventListener('keydown', resumeAudio);
 return () => {
  window.removeEventListener('click', resumeAudio);
  window.removeEventListener('keydown', resumeAudio);
 };
 }, []);

 useEffect(() => {
  if (!incoming) {
   stopRingtone();
   return;
  }
  if (isRingMuted || isAppHidden || (typeof document !== 'undefined' && document.hidden)) {
   stopRingtone();
  } else {
   if (!isRingingRef.current) {
    playRingtone();
   }
  }
 }, [incoming, isRingMuted, isAppHidden, playRingtone, stopRingtone]);

 useEffect(() => {
  try {
   localStorage.setItem('orbitdesk_ring_muted', isRingMuted ? 'true' : 'false');
  } catch {}
 }, [isRingMuted]);

 return (
 <>
 <AnimatePresence>
  {incoming && (
  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-10 right-0 z-20 w-[360px] max-w-[92vw] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-zinc-800 bg-[#0a0a0a] overflow-hidden" onClick={(e) => e.stopPropagation()}>
   <motion.div className="overflow-hidden" onClick={(e) => e.stopPropagation()}>
    <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-4 text-white relative overflow-hidden">
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
     <div className="relative flex items-center gap-3">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-12 w-12 bg-white/15 backdrop-blur rounded-full flex items-center justify-center ring-2 ring-white/20 shadow-lg flex-shrink-0">
       <span className="text-xl">📞</span>
      </motion.div>
      <div className="flex-1 min-w-0">
       <h3 className="font-bold text-[14px] flex items-center gap-2 truncate">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
        Incoming Call
        {isRingMuted ? <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 border border-white/20">🔇 Muted</span> : <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 animate-pulse">🔔 Ringing</span>}
       </h3>
       <p className="text-[12px] opacity-90 truncate">{incoming.clientName} • {incoming.priority}</p>
       <p className="text-[10px] opacity-70 font-mono truncate">{incoming.userEmail}</p>
      </div>
      <div className="flex items-center gap-1">
       <button onClick={() => setIsRingMuted(!isRingMuted)} type="button" className={`h-8 w-8 rounded-full flex items-center justify-center border text-[14px] cursor-pointer transition-colors ${isRingMuted ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/15 text-white border-white/20 hover:bg-white/25'}`} title={isRingMuted ? 'Unmute ringing' : 'Mute ringing'}>
        {isRingMuted ? '🔇' : '🔔'}
       </button>
       <button onClick={declineCall} type="button" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 border border-white/10 text-white flex items-center justify-center text-[12px] cursor-pointer">✕</button>
      </div>
     </div>
     {isAppHidden && (
      <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200">App minimized — ringing paused, notification sent</div>
     )}
    </div>
    <div className="p-3 bg-[#0a0a0a]">
     <div className="bg-zinc-900 rounded-xl p-3 text-[12px] mb-3 border border-zinc-800">
      <p className="text-zinc-200 leading-[1.4] line-clamp-3">"{incoming.userMessage}"</p>
      <p className="text-[10px] text-zinc-500 mt-2">{incoming.code} • Real human flow: you greet first</p>
     </div>
     <div className="flex gap-2">
      <button onClick={declineCall} type="button" className="flex-1 h-10 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[13px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors">✕ Decline</button>
      <button onClick={acceptCall} type="button" disabled={accepting} className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold text-[13px] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all">
       {accepting ? <>⏳ Connecting...</> : <><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Accept</>}
      </button>
     </div>
     <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-600">
      <span>Teams-like • Own space in header</span>
      <span className="flex items-center gap-1">{isRingMuted ? '🔇 Ring muted' : '🔔 440Hz+480Hz'} • {isAppHidden ? '⏸️ Paused' : '🔊 Live'}</span>
     </div>
    </div>
   </motion.div>
  </motion.div>
  )}
 </AnimatePresence>

 {!activeCall && !incoming && (
  <div className="relative flex flex-col gap-2 items-end">
   <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-zinc-800 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xl h-8">
    <Logo variant="icon" size={16} animated />
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
    <span className="text-[11px] text-zinc-300 hidden lg:inline">Lvl {level} • {level <=1 ? '📵 Focus tickets' : level ===2 ? `📞 P1 only • ${nextCallIn}s` : `${nextCallIn}s • ${freqConfig.maxCallsPerHour}/hr`}</span>
    <span className="text-[11px] text-zinc-300 lg:hidden">Lvl {level} • {nextCallIn}s</span>
    <button onClick={() => (window as any).triggerIncomingCall?.()} type="button" className="h-6 px-2.5 rounded-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white text-[11px] font-bold cursor-pointer transition-colors">📞 Call</button>
    <button onClick={() => setShowCallHistory(!showCallHistory)} type="button" className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] cursor-pointer flex items-center justify-center">📋</button>
   </div>
   {level <=1 && showCallHistory === false && missedCalls.length === 0 && (
    <div className="absolute top-10 right-0 z-20 w-[300px] bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-xl px-3 py-2 text-[11px] text-amber-200 shadow-xl">
     💡 Phone training unlocks at Level 2 — focus on tickets first. Use Call to practice P1 critical calls manually. No spam.
    </div>
   )}
   {missedCalls.length > 0 && (
   <div className="absolute top-10 right-0 z-20 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 shadow-2xl w-[320px]">
    <p className="text-[11px] font-bold text-zinc-300 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Missed Calls ({missedCalls.length}) • Lvl {level} only critical</p>
    <div className="mt-2 space-y-1.5">
     {missedCalls.slice(0,3).map((c, i) => (
     <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
      <img src="/icon-512.png" alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
      <div className="flex-1 min-w-0">
       <p className="text-[11px] text-zinc-300 truncate">{c.clientName} • {c.priority}</p>
       <p className="text-[10px] text-zinc-500 truncate">{c.userEmail}</p>
      </div>
      <span className="text-[10px] text-zinc-600">{new Date(c.missedAt).toLocaleTimeString()}</span>
     </div>
     ))}
    </div>
   </div>
   )}
   {showCallHistory && (
   <div className="absolute top-10 right-0 z-20 bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-3 shadow-2xl w-[360px] max-h-[400px] overflow-y-auto">
    <div className="flex items-center justify-between">
     <p className="text-[11px] font-bold text-zinc-300">Call History — Lvl {level} • {freqConfig.description}</p>
     <button onClick={() => setShowCallHistory(false)} type="button" className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 cursor-pointer">✕</button>
    </div>
    <div className="mt-3 space-y-2">
     {callHistory.length === 0 ? <p className="text-[11px] text-zinc-500">{level <=1 ? 'Lvl1 — No auto calls. Phone unlocks at Lvl2. Use Call for P1 practice.' : `No calls yet — ${freqConfig.description} Next in ${nextCallIn}s`}</p> : callHistory.map((c, i) => (
     <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
      <div className="flex items-center gap-2">
       <span className={`h-2 w-2 rounded-full ${c.status === 'missed' ? 'bg-red-500' : 'bg-emerald-500'}`} />
       <span className="text-[11px] font-medium text-zinc-200">{c.clientName} • {c.priority}</span>
       <span className="ml-auto text-[10px] text-zinc-500">{c.duration ? `${Math.floor(c.duration/60)}:${String(c.duration%60).padStart(2,'0')}` : 'missed'}</span>
      </div>
      <p className="text-[10px] text-zinc-500 mt-1 truncate">{c.userEmail} • {c.status} • {c.endedAt ? new Date(c.endedAt).toLocaleTimeString() : ''}</p>
     </div>
     ))}
    </div>
   </div>
   )}
  </div>
 )}

 {activeCall && (activeCall.status === 'active' || activeCall.status === 'on-hold') && (
  <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[96%] max-w-6xl bg-[#0a0a0a] rounded-[24px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[88vh]">
   <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
    <div className="flex items-center gap-3">
     <Logo variant="icon" size={32} animated />
     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-violet-500/20">{(activeCall.id?.[0] || 'C').toUpperCase()}</div>
     <div>
      <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
       {activeCall.clientName || 'Client'} • {activeCall.priority || 'P1'} • {(activeCall.id || '').substring(0,8) || 'call'}
       <span className={`h-2 w-2 rounded-full ${activeCall.status === 'on-hold' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
       <span className="text-[11px] text-emerald-400 font-mono">{String(Math.floor((activeCall.duration||0)/60)).padStart(2,'0')}:{String((activeCall.duration||0)%60).padStart(2,'0')}</span>
       {activeCall.status === 'on-hold' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">⏸️ On Hold {(activeCall.holdDuration||0)}s • Music</span>}
       {isListening && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🎙️ You Speaking</span>}
       {isSpeaking && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">🔊 Client Speaking</span>}
       {activeCall.isRecording && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🔴 REC • 15s Beep</span>}
      </p>
      <p className="text-[11px] text-zinc-500 flex items-center gap-2">
       <span>{activeCall.userEmail || ''} • Mouth-to-Ear • No leaks • {activeCall.phase || ''}</span>
      </p>
     </div>
    </div>
    <div className="flex items-center gap-1.5">
     <button onClick={toggleMute} type="button" className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 border text-[11px] font-medium cursor-pointer ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`} title="Mute">
      {isMuted ? '🔇 Muted' : '🎙️ Mute'}
     </button>
     <button onClick={toggleHold} type="button" className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 border text-[11px] font-medium cursor-pointer ${isOnHold ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`} title="Hold with music">
      {isOnHold ? '▶️ Resume' : '⏸️ Hold + Music'}
     </button>
     <button onClick={() => { try { if (activeCall) setActiveCall({ ...activeCall, isRecording: !activeCall.isRecording }); if (activeCall?.isRecording) stopRecordingBeep(); else startRecordingBeep(); } catch {} }} type="button" className={`h-9 w-9 rounded-full flex items-center justify-center border cursor-pointer ${activeCall.isRecording ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`} title="Recording toggle">
      🔴
     </button>
     <button onClick={endCall} type="button" className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg cursor-pointer" title="End call">📞</button>
    </div>
   </div>

   <div className="flex flex-1 overflow-hidden">
    <div className="flex-1 flex flex-col">
     <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
      {(activeCall.transcript || []).map(m => (
      <div key={m.id || Math.random()} className={`flex ${m.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
       <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.4] border ${m.speaker === 'you' ? 'bg-violet-600 border-violet-500 text-white rounded-br-sm' : m.speaker === 'client' ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 text-[11px]'}`}>
        <p className="text-[10px] opacity-70 mb-1 flex items-center gap-1.5">
         {m.speaker === 'you' ? '🎙️ You' : m.speaker === 'client' ? '🔊 Client' : '📋 System'} • {m.time || '00:00'} • {m.isVoice ? 'Voice' : 'System'} • {m.sentiment || 'calm'}
        </p>
        <p>{m.text || ''}</p>
       </div>
      </div>
      ))}
      {liveTranscript && (
      <div className="flex justify-end">
       <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] border bg-violet-600/50 border-violet-500/50 text-white border-dashed">
        <p className="text-[10px] mb-1">🎙️ Live — Caller Hears...</p>
        <p className="italic">{liveTranscript}</p>
       </div>
      </div>
      )}
      {isOnHold && (
      <div className="flex justify-center">
       <div className="rounded-full px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        🎵 Hold music — C4 E4 G4 C5 • No leaks
       </div>
      </div>
      )}
      <div ref={transcriptEndRef} />
     </div>

     <div className="p-4 bg-zinc-900 border-t border-zinc-800">
      <div className="flex flex-col items-center gap-3">
       <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-1.5">
         <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20" />
          <span className="text-2xl relative">🎙️</span>
          {isListening && <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 rounded-full border-2 border-red-500/50" />}
         </div>
         <span className="text-[10px] text-zinc-500 font-medium">You — Mouth</span>
         <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${userAudioLevel}%` }} className="h-full bg-gradient-to-r from-red-500 to-orange-500" /></div>
        </div>

        <div className="flex flex-col items-center gap-2">
         <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-zinc-700" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-2 w-2 rounded-full bg-emerald-500" />
          <div className="h-px w-8 bg-zinc-700" />
         </div>
         <span className="text-[10px] text-zinc-600 font-mono px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700">Voice • No leaks • Human</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
         <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-violet-600/20" />
          <span className="text-2xl relative">🔊</span>
          {isSpeaking && <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 rounded-full border-2 border-violet-500/50" />}
         </div>
         <span className="text-[10px] text-zinc-500 font-medium">Client — Ear</span>
         <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${clientAudioLevel}%` }} className="h-full bg-gradient-to-r from-violet-500 to-indigo-500" /></div>
        </div>
       </div>

       <button
        onMouseDown={startMic}
        onMouseUp={stopMic}
        onTouchStart={startMic}
        onTouchEnd={stopMic}
        disabled={isOnHold}
        type="button"
        className={`h-14 w-[320px] rounded-full font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${isOnHold ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : isListening ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 scale-105' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}
       >
        {isOnHold ? '⏸️ On Hold — Resume to Speak' : isListening ? '● Recording — Release to Send' : '🎙️ Hold to Speak — No leaks'}
       </button>
       <p className="text-[11px] text-zinc-500 text-center max-w-[520px] leading-[1.4]">
        {activeCall.phase === 'waiting_greeting' ? '💡 Client said hello — YOU greet first: Hold mic and say "Hello, how may I help you?"' :
        activeCall.phase === 'waiting_intro' ? 'Client introducing — listen, then reply with voice' :
        '💡 Controls: Mute, Hold + Music, REC Beep 15s, Transfer, Notes — hardened no audio leaks.'}
       </p>
      </div>
     </div>
    </div>

    <div className="hidden lg:flex w-[280px] bg-zinc-900/50 border-l border-zinc-800 flex-col p-3 gap-3 overflow-y-auto">
     <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
      <p className="text-[11px] font-bold text-zinc-300 flex items-center gap-2"><Logo variant="icon" size={16} /> Controls — No leaks</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
       <button onClick={toggleMute} type="button" className={`h-8 rounded-full text-[11px] font-medium border cursor-pointer ${isMuted ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600'}`}>{isMuted ? '🔇 Unmute' : '🎙️ Mute'}</button>
       <button onClick={toggleHold} type="button" className={`h-8 rounded-full text-[11px] font-medium border cursor-pointer ${isOnHold ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600'}`}>{isOnHold ? '▶️ Resume' : '⏸️ Hold'}</button>
       <button type="button" className="h-8 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600 text-[11px] hover:bg-zinc-600 cursor-pointer">↗️ Transfer</button>
       <button type="button" className="h-8 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600 text-[11px] hover:bg-zinc-600 cursor-pointer">📝 Notes</button>
      </div>
     </div>

     <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
      <p className="text-[11px] font-bold text-violet-300">Call Info — Live</p>
      <div className="mt-2 space-y-1.5 text-[11px]">
       <div className="flex justify-between"><span className="text-zinc-500">Client:</span><span className="text-zinc-200 font-medium truncate">{activeCall.clientName}</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">User:</span><span className="text-zinc-200 truncate">{activeCall.userEmail.split('@')[0]}</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">Priority:</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeCall.priority === 'P1' ? 'bg-red-500/20 text-red-300 border border-red-500/20' : 'bg-amber-500/20 text-amber-300'}`}>{activeCall.priority}</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">Duration:</span><span className="text-zinc-200 font-mono">{String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:{String(activeCall.duration%60).padStart(2,'0')}</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">Hold:</span><span className="text-amber-300 font-mono">{activeCall.holdDuration}s</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">Phase:</span><span className="text-violet-300">{activeCall.phase}</span></div>
       <div className="flex justify-between"><span className="text-zinc-500">Recording:</span><span className="text-red-300">{activeCall.isRecording ? '🔴 ON' : 'Off'}</span></div>
      </div>
     </div>

     <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
      <p className="text-[11px] font-bold text-zinc-300">Quick Actions</p>
      <div className="mt-2 space-y-1.5">
       <button type="button" className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3 cursor-pointer">📋 Check Sign-in Logs CA tab</button>
       <button type="button" className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3 cursor-pointer">🏢 Open Company Portal</button>
       <button type="button" className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3 cursor-pointer">💻 Run dsregcmd /status</button>
       <button type="button" className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3 cursor-pointer">🔐 Enable BitLocker</button>
      </div>
     </div>
    </div>
   </div>
  </motion.div>
 )}
 </>
 );
}
