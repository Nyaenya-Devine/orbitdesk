'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface CallMessage {
  id: string;
  speaker: 'client' | 'you' | 'system';
  text: string;
  time: string;
  audioUrl?: string;
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

export default function VoiceCallCenter({ tickets, onAccept }: { tickets: any[], onAccept: (t: any) => void }) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incoming, setIncoming] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [clientAudioLevel, setClientAudioLevel] = useState(0);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringtoneIntervalRef = useRef<any>(null);
  const recordingBeepRef = useRef<any>(null);
  const holdMusicRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [nextCallIn, setNextCallIn] = useState(12);
  const [missedCalls, setMissedCalls] = useState<any[]>([]);
  const [callHistory, setCallHistory] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
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
      // Request notification permission for real call notification
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [activeCall?.transcript, liveTranscript]);

  // Guaranteed call + countdown + manual trigger
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      if (!activeCall && !incoming) {
        const fallbackTicket = tickets.length > 0 ? tickets[0] : {
          id: `call-${Date.now()}`,
          clientId: 'client-a',
          clientName: 'NovaTech Financial',
          priority: 'P1',
          userEmail: 'sarah.finance@novatech.com',
          userMessage: "Hello? Is this IT support? I'm blocked by Conditional Access, error 53000 DeviceNotCompliant. Payroll deadline in 45 minutes, P1. Could you help?",
          code: 'ENTRA-53000',
          title: 'Conditional Access Block - Payroll Urgent',
        };
        setIncoming(fallbackTicket);
        playRingtone();
        showBrowserNotification(fallbackTicket);
        setNextCallIn(30);
      }
    }, 12000);

    const countdown = setInterval(() => {
      setNextCallIn(prev => {
        if (prev <= 1) {
          if (!activeCall && !incoming) {
            const ticket = tickets.length > 0 ? tickets[Math.floor(Math.random() * tickets.length)] : {
              id: `call-${Date.now()}`,
              clientId: ['client-a', 'client-b', 'client-c'][Math.floor(Math.random()*3)],
              clientName: ['NovaTech Financial', 'Bloom Studio', 'Apex Financial'][Math.floor(Math.random()*3)],
              priority: Math.random() < 0.3 ? 'P1' : 'P2',
              userEmail: ['sarah.finance@novatech.com', 'emma@bloomco.studio', 'risk@apexfin.com'][Math.floor(Math.random()*3)],
              userMessage: "Hello? Is this IT support? Need help with my account.",
              code: 'CALL-' + Math.random().toString(36).substring(7).toUpperCase(),
              title: 'Live Call - Need Assistance',
            };
            setIncoming(ticket as any);
            playRingtone();
            showBrowserNotification(ticket as any);
          }
          return 30 + Math.floor(Math.random()*20);
        }
        return prev - 1;
      });
    }, 1000);

    const interval = setInterval(() => {
      if (!activeCall && !incoming && Math.random() < 0.18) {
        const ticket = tickets.length > 0 ? tickets[Math.floor(Math.random() * tickets.length)] : {
          id: `call-${Date.now()}`,
          clientId: 'client-a',
          clientName: 'NovaTech Financial',
          priority: 'P1',
          userEmail: 'sarah.finance@novatech.com',
          userMessage: "Hello? Is this IT support? I'm having an issue with my account.",
          code: 'CALL-' + Math.random().toString(36).substring(7).toUpperCase(),
          title: 'Live Call - Need Assistance',
        };
        setIncoming(ticket as any);
        playRingtone();
        showBrowserNotification(ticket as any);
        setNextCallIn(30);
      }
    }, 6000);

    (window as any).triggerIncomingCall = () => {
      if (!activeCall && !incoming) {
        const ticket = tickets.length > 0 ? tickets[Math.floor(Math.random() * tickets.length)] : {
          id: `call-${Date.now()}`,
          clientId: 'client-a',
          clientName: 'NovaTech Financial',
          priority: 'P1',
          userEmail: 'sarah.finance@novatech.com',
          userMessage: "Hello? Is this IT support? I'm blocked by Conditional Access, error 53000 DeviceNotCompliant. Payroll deadline in 45 minutes, P1. Could you help?",
          code: 'ENTRA-53000',
          title: 'Conditional Access Block - Payroll Urgent',
        };
        setIncoming(ticket as any);
        playRingtone();
        showBrowserNotification(ticket as any);
        setNextCallIn(30);
      }
    };

    return () => {
      clearTimeout(initialTimer);
      clearInterval(countdown);
      clearInterval(interval);
    };
  }, [tickets, activeCall, incoming]);

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

  const showBrowserNotification = (ticket: any) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`📞 Incoming Call — ${ticket.clientName}`, {
        body: `${ticket.userEmail} • ${ticket.priority} • ${ticket.title}\n"${ticket.userMessage.substring(0,60)}..."`,
        icon: '/orbitdesk-logo-godmode-polished.png',
        tag: 'orbitdesk-call',
        requireInteraction: true,
      });
    }
  };

  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      // Realistic phone ring — dual tone 440Hz + 480Hz like US ring
      const playTone = () => {
        if (!ctx || ctx.state === 'closed' || !incoming) return;
        // Create two oscillators for authentic ring
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.frequency.value = 440; // A4
        osc2.frequency.value = 480; // Slightly higher for ring
        filter.type = 'bandpass';
        filter.frequency.value = 460;
        gain.gain.value = 0.12;
        
        osc1.start();
        osc2.start();
        
        // Ring pattern: 2s on, 4s off (real phone)
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          if (incoming && ctx.state !== 'closed') {
            setTimeout(playTone, 4000);
          }
        }, 2000);
      };
      playTone();
      
      // Also vibrate if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([500, 300, 500, 300, 500]);
      }
    } catch {}
  };

  const stopRingtone = () => {
    try {
      audioContextRef.current?.close();
      audioContextRef.current = null;
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
      if ('vibrate' in navigator) navigator.vibrate(0);
    } catch {}
  };

  const playRecordingBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1000;
      gain.gain.value = 0.08;
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 200);
    } catch {}
  };

  const startRecordingBeep = () => {
    playRecordingBeep();
    recordingBeepRef.current = setInterval(playRecordingBeep, 15000); // Every 15s like real call recording
  };

  const stopRecordingBeep = () => {
    if (recordingBeepRef.current) {
      clearInterval(recordingBeepRef.current);
      recordingBeepRef.current = null;
    }
  };

  const playHoldMusic = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      holdMusicRef.current = ctx;
      const playNote = (freq: number, duration: number, delay: number) => {
        setTimeout(() => {
          if (!holdMusicRef.current || holdMusicRef.current.state === 'closed') return;
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
        }, delay);
      };
      // Simple hold music melody — like real hold
      const melody = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      let time = 0;
      const loopMelody = () => {
        if (!holdMusicRef.current || holdMusicRef.current.state === 'closed' || !isOnHold) return;
        melody.forEach((freq, i) => {
          playNote(freq, 0.8, time + i * 900);
        });
        time += melody.length * 900 + 1000;
        setTimeout(loopMelody, melody.length * 900 + 2000);
      };
      loopMelody();
    } catch {}
  };

  const stopHoldMusic = () => {
    try {
      holdMusicRef.current?.close();
      holdMusicRef.current = null;
    } catch {}
  };

  const speakClient = (text: string, persona: 'enterprise' | 'smb' | 'regulated') => {
    if (!synthRef.current || isMuted || isOnHold) return;
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = persona === 'smb' ? 1.15 : persona === 'regulated' ? 0.9 : 1.0;
    utter.pitch = persona === 'smb' ? 1.2 : persona === 'regulated' ? 0.8 : 0.9;
    utter.volume = 0.95;
    const voices = synthRef.current.getVoices();
    const match = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (match) utter.voice = match;
    utter.onstart = () => { setIsSpeaking(true); animateClientAudio(); };
    utter.onend = () => { setIsSpeaking(false); setClientAudioLevel(0); };
    synthRef.current.speak(utter);
  };

  const animateClientAudio = () => {
    const interval = setInterval(() => {
      if (!isSpeaking) { clearInterval(interval); return; }
      setClientAudioLevel(Math.random() * 100);
    }, 100);
  };

  const startMic = async () => {
    if (!recognitionRef.current) { alert('Use Chrome/Edge for mic 🎙️ — voice-to-voice call, no texting'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const animate = () => {
        if (!isListening) return;
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a,b) => a+b, 0) / dataArray.length;
        setUserAudioLevel(avg);
        requestAnimationFrame(animate);
      };
      animate();
    } catch (e) { console.log('mic error', e); }
    setLiveTranscript('');
    recognitionRef.current.start();
  };

  const stopMic = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setUserAudioLevel(0);
  };

  const handleUserVoice = (text: string) => {
    if (!text.trim() || !activeCall) return;
    const now = `${String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:${String(activeCall.duration%60).padStart(2,'0')}`;
    const prevPhase = activeCall.phase;
    let nextPhase: Call['phase'] = prevPhase;
    if (prevPhase === 'waiting_greeting') nextPhase = 'waiting_intro';
    else if (prevPhase === 'waiting_intro') nextPhase = 'problem';
    else if (prevPhase === 'problem') nextPhase = 'troubleshooting';

    const userMsg: CallMessage = { id: Date.now().toString(), speaker: 'you', text, time: now, isVoice: true };
    setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, userMsg], phase: nextPhase } : null);

    setTimeout(() => {
      let reply = '';
      const persona = activeCall.persona;
      if (prevPhase === 'waiting_greeting') {
        reply = intros[persona](activeCall.id.split('-')[0], activeCall.clientName);
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
      const clientMsg: CallMessage = { id: (Date.now()+1).toString(), speaker: 'client', text: reply, time: `${String(Math.floor((activeCall.duration+2)/60)).padStart(2,'0')}:${String((activeCall.duration+2)%60).padStart(2,'0')}`, isVoice: true, sentiment: prevPhase === 'waiting_greeting' ? 'calm' : 'urgent' };
      setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, clientMsg] } : null);
      speakClient(reply, persona);
    }, 800);
  };

  const acceptCall = () => {
    if (!incoming) return;
    stopRingtone();
    const persona = (incoming.clientId === 'client-a' ? 'enterprise' : incoming.clientId === 'client-b' ? 'smb' : 'regulated') as 'enterprise' | 'smb' | 'regulated';
    const greeting = greetings[persona][Math.floor(Math.random() * greetings[persona].length)];
    const newCall: Call = {
      id: incoming.id,
      status: 'active',
      duration: 0,
      holdDuration: 0,
      transcript: [
        { id: '1', speaker: 'system', text: `📞 Voice Call Connected • ${incoming.userEmail} • ${incoming.clientName} • 🔴 Recording ON • Encrypted TLS 1.3 • Mouth-to-Ear Voice, No Text • Beep every 15s`, time: '00:00', isVoice: false },
        { id: '2', speaker: 'client', text: greeting, time: '00:03', isVoice: true, sentiment: 'calm' },
      ],
      persona,
      phase: 'waiting_greeting',
      isRecording: true,
      clientName: incoming.clientName,
      userEmail: incoming.userEmail,
      priority: incoming.priority,
    };
    setActiveCall(newCall);
    setIncoming(null);
    onAccept(incoming);
    startRecordingBeep();
    setTimeout(() => speakClient(greeting, persona), 600);
  };

  const declineCall = () => { 
    if (incoming) {
      setMissedCalls(prev => [{ ...incoming, missedAt: Date.now() }, ...prev].slice(0,5));
      setCallHistory(prev => [{ ...incoming, status: 'missed', duration: 0, endedAt: Date.now() }, ...prev].slice(0,20));
    }
    stopRingtone(); 
    setIncoming(null); 
    setNextCallIn(20);
  };
  
  const endCall = () => { 
    if (activeCall) {
      setCallHistory(prev => [{ ...activeCall, status: 'ended', endedAt: Date.now() }, ...prev].slice(0,20));
    }
    stopRingtone(); 
    stopRecordingBeep();
    stopHoldMusic();
    if (synthRef.current) synthRef.current.cancel(); 
    stopMic(); 
    setActiveCall(null); 
    setIsOnHold(false);
    setNextCallIn(25); 
  };

  const toggleHold = () => {
    if (!activeCall) return;
    const newHold = !isOnHold;
    setIsOnHold(newHold);
    if (newHold) {
      setActiveCall(prev => prev ? { ...prev, status: 'on-hold' } : null);
      playHoldMusic();
      const holdMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `⏸️ Call placed on hold at ${String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:${String(activeCall.duration%60).padStart(2,'0')} — playing hold music for client`, time: `${String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:${String(activeCall.duration%60).padStart(2,'0')}`, isVoice: false };
      setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, holdMsg] } : null);
    } else {
      setActiveCall(prev => prev ? { ...prev, status: 'active' } : null);
      stopHoldMusic();
      const resumeMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `▶️ Call resumed at ${String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:${String(activeCall.duration%60).padStart(2,'0')} — hold duration ${activeCall.holdDuration}s`, time: `${String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:${String(activeCall.duration%60).padStart(2,'0')}`, isVoice: false };
      setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, resumeMsg] } : null);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel();
    }
  };

  useEffect(() => {
    const resumeAudio = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };
    window.addEventListener('click', resumeAudio);
    window.addEventListener('keydown', resumeAudio);
    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {incoming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] rounded-[28px] shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
                <div className="relative">
                  <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-24 h-24 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white/20 shadow-xl">
                    <span className="text-4xl">📞</span>
                  </motion.div>
                  <h3 className="font-bold text-[18px] flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    Incoming Voice Call
                  </h3>
                  <p className="text-[14px] opacity-90 mt-1">{incoming.clientName} • {incoming.priority} • {incoming.code}</p>
                  <p className="text-[12px] opacity-70 mt-1 font-mono">{incoming.userEmail}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/10 mx-auto">
                      <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                      🔔 Ringing • 440Hz+480Hz • Vibrate • Notification
                    </div>
                    <div className="text-[10px] opacity-60">Real phone: dual-tone ring, browser notification, vibrate, 2s on 4s off</div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#0a0a0a]">
                <div className="bg-zinc-900 rounded-2xl p-4 text-[13px] mb-5 border border-zinc-800">
                  <div className="flex items-start gap-3">
                    <img src="/orbitdesk-logo-godmode-polished.png" alt="OrbitDesk" className="h-8 w-8 rounded-full object-cover border border-violet-500/20 flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    <div>
                      <p className="text-zinc-200 leading-[1.4]">"{incoming.userMessage}"</p>
                      <p className="text-[11px] text-zinc-500 mt-3 leading-[1.3]">🔊 Real human: You pick → You greet "Hello, how may I help?" with mouth → Caller hears → Caller replies with voice → You hear via ear. No texting, like real phone. Recording beep every 15s, hold music, mute, transfer — tech lead experience.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={declineCall} className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[14px] flex items-center justify-center gap-2">
                    ✕ Decline
                  </button>
                  <button onClick={acceptCall} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-[14px] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    Accept — Speak Now
                  </button>
                </div>
                <p className="text-[10px] text-zinc-600 mt-3 text-center">📱 Real: Browser notification + vibrate + dual-tone 440/480Hz ring • Like Teams/Slack calls</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeCall && !incoming && (
        <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-800 rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl">
            <Logo variant="icon" size={20} animated />
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-zinc-400">Next call in {nextCallIn}s • Live • Human</span>
            <button onClick={() => (window as any).triggerIncomingCall?.()} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold">📞 Call Now</button>
            <button onClick={() => setShowCallHistory(!showCallHistory)} className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px]">📋 History</button>
          </div>
          {missedCalls.length > 0 && (
            <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-zinc-800 rounded-2xl p-3 shadow-2xl max-w-[320px]">
              <p className="text-[11px] font-bold text-zinc-300 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> Missed Calls ({missedCalls.length}) • Real notification</p>
              <div className="mt-2 space-y-1.5">
                {missedCalls.slice(0,3).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    <img src="/orbitdesk-logo-godmode-polished.png" alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
            <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-3 shadow-2xl max-w-[360px] max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-zinc-300">Call History — Tech Lead View</p>
                <button onClick={() => setShowCallHistory(false)} className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">✕</button>
              </div>
              <div className="mt-3 space-y-2">
                {callHistory.length === 0 ? <p className="text-[11px] text-zinc-500">No calls yet — first call in {nextCallIn}s</p> : callHistory.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${c.status === 'missed' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      <span className="text-[11px] font-medium text-zinc-200">{c.clientName || c.clientName} • {c.priority || 'P1'}</span>
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
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-6xl bg-[#0a0a0a] rounded-[24px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[88vh]">
          <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size={32} animated />
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-violet-500/20">{activeCall.id[0].toUpperCase()}</div>
              <div>
                <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
                  {activeCall.clientName} • {activeCall.priority} • {activeCall.id.substring(0,8)}
                  <span className={`h-2 w-2 rounded-full ${activeCall.status === 'on-hold' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                  <span className="text-[11px] text-emerald-400 font-mono">{String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:{String(activeCall.duration%60).padStart(2,'0')}</span>
                  {activeCall.status === 'on-hold' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">⏸️ On Hold {activeCall.holdDuration}s • Hold music playing</span>}
                  {isListening && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🎙️ You Speaking — Caller Hears</span>}
                  {isSpeaking && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">🔊 Client Speaking — You Hear</span>}
                  {activeCall.isRecording && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🔴 REC • Beep every 15s • Encrypted</span>}
                </p>
                <p className="text-[11px] text-zinc-500 flex items-center gap-2">
                  <span>{activeCall.userEmail} • Mouth-to-Ear • No Texting • {activeCall.phase}</span>
                  <span className="hidden md:inline">• Real: Hold, Mute, Record, Transfer, Notes — tech lead</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggleMute} className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 border text-[11px] font-medium ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`} title="Mute — real helpdesk">
                {isMuted ? '🔇 Muted' : '🎙️ Mute'}
              </button>
              <button onClick={toggleHold} className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 border text-[11px] font-medium ${isOnHold ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`} title="Hold with music — real">
                {isOnHold ? '▶️ Resume' : '⏸️ Hold + Music'}
              </button>
              <button onClick={() => { if (activeCall) setActiveCall({ ...activeCall, isRecording: !activeCall.isRecording }); if (activeCall?.isRecording) stopRecordingBeep(); else startRecordingBeep(); }} className={`h-9 w-9 rounded-full flex items-center justify-center border ${activeCall.isRecording ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`} title="Recording toggle — beep every 15s">
                🔴
              </button>
              <button onClick={endCall} className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg" title="End call — real">📞</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
                {activeCall.transcript.map(m => (
                  <div key={m.id} className={`flex ${m.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.4] border ${m.speaker === 'you' ? 'bg-violet-600 border-violet-500 text-white rounded-br-sm' : m.speaker === 'client' ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 text-[11px]'}`}>
                      <p className="text-[10px] opacity-70 mb-1 flex items-center gap-1.5">
                        {m.speaker === 'you' ? '🎙️ You (Voice — Caller Heard You)' : m.speaker === 'client' ? '🔊 Client (Voice — You Heard via Ear)' : '📋 System • Recording • Encrypted'} • {m.time} • {m.isVoice ? 'Voice Mouth-to-Ear' : 'System'} • {m.sentiment || 'calm'}
                      </p>
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
                {liveTranscript && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] border bg-violet-600/50 border-violet-500/50 text-white border-dashed">
                      <p className="text-[10px] mb-1">🎙️ You Speaking Live — Caller Hears You Now in Real Time...</p>
                      <p className="italic">{liveTranscript}</p>
                    </div>
                  </div>
                )}
                {isOnHold && (
                  <div className="flex justify-center">
                    <div className="rounded-full px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      🎵 Hold music playing for client — C4 E4 G4 C5 loop • Client hears music, you hear silence • Real helpdesk
                    </div>
                  </div>
                )}
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
                      <span className="text-[9px] text-zinc-600">Mic • Voice → Client Ear</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-zinc-700" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-2 w-2 rounded-full bg-emerald-500" />
                        <div className="h-px w-8 bg-zinc-700" />
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700">Voice Call • Mouth-to-Ear • Human • No Text</span>
                      <div className="flex items-center gap-1 text-[9px] text-zinc-600">
                        <span>🔴 REC</span>
                        <span>•</span>
                        <span>TLS 1.3</span>
                        <span>•</span>
                        <span>Beep 15s</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-violet-600/20" />
                        <span className="text-2xl relative">🔊</span>
                        {isSpeaking && <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 rounded-full border-2 border-violet-500/50" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">Client — Ear</span>
                      <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${clientAudioLevel}%` }} className="h-full bg-gradient-to-r from-violet-500 to-indigo-500" /></div>
                      <span className="text-[9px] text-zinc-600">Speaker • Client Mouth → Your Ear</span>
                    </div>
                  </div>

                  <button
                    onMouseDown={startMic}
                    onMouseUp={stopMic}
                    onTouchStart={startMic}
                    onTouchEnd={stopMic}
                    disabled={isOnHold}
                    className={`h-14 w-[320px] rounded-full font-bold text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg ${isOnHold ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : isListening ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 scale-105' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}
                  >
                    {isOnHold ? '⏸️ On Hold — Resume to Speak' : isListening ? '● Recording — Caller Hears You Real Time — Release to Send' : '🎙️ Hold to Speak — Human Voice Only, No Texting, Real Phone'}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center max-w-[520px] leading-[1.4]">
                    {activeCall.phase === 'waiting_greeting' ? '💡 Client said hello — YOU greet first: Hold mic and say "Hello, how may I help you today?" with your mouth, caller hears your voice in real time with tone' :
                     activeCall.phase === 'waiting_intro' ? '💡 Client introducing — listen via ear with notification tone, then hold mic to reply with voice — human, not robotic' :
                     '💡 Tech Lead controls: Mute (🔇), Hold + Music (⏸️🎵), Recording Beep every 15s (🔴), Transfer, Notes — real helpdesk phone system. Hold to speak — mouth-to-ear, human.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tech lead side panel — human experience */}
            <div className="hidden lg:flex w-[280px] bg-zinc-900/50 border-l border-zinc-800 flex-col p-3 gap-3 overflow-y-auto">
              <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                <p className="text-[11px] font-bold text-zinc-300 flex items-center gap-2"><Logo variant="icon" size={16} /> Tech Lead Controls — Human</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={toggleMute} className={`h-8 rounded-full text-[11px] font-medium border ${isMuted ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600'}`}>{isMuted ? '🔇 Unmute' : '🎙️ Mute'}</button>
                  <button onClick={toggleHold} className={`h-8 rounded-full text-[11px] font-medium border ${isOnHold ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-zinc-700 text-zinc-300 border-zinc-600 hover:bg-zinc-600'}`}>{isOnHold ? '▶️ Resume' : '⏸️ Hold'}</button>
                  <button className="h-8 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600 text-[11px] hover:bg-zinc-600">↗️ Transfer</button>
                  <button className="h-8 rounded-full bg-zinc-700 text-zinc-300 border border-zinc-600 text-[11px] hover:bg-zinc-600">📝 Notes</button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Real helpdesk: mute, hold with music, transfer to expert, add notes, recording beep</p>
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
                  <div className="flex justify-between"><span className="text-zinc-500">Recording:</span><span className="text-red-300">{activeCall.isRecording ? '🔴 ON • Beep 15s' : 'Off'}</span></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700">
                <p className="text-[11px] font-bold text-zinc-300">Quick Actions — Human</p>
                <div className="mt-2 space-y-1.5">
                  <button className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3">📋 Check Sign-in Logs CA tab</button>
                  <button className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3">🏢 Open Company Portal</button>
                  <button className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3">💻 Run dsregcmd /status</button>
                  <button className="w-full h-7 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-[11px] text-left px-3">🔐 Enable BitLocker</button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-[11px] font-bold text-emerald-300">💡 For Beginners — Real Flow</p>
                <p className="text-[10px] text-emerald-200/70 mt-1 leading-[1.4]">In real IT, you greet first, listen, check logs, guide simple steps, confirm fix, 5 stars. Recording beep every 15s reminds client call recorded. Hold music when you need to check something. Mute when you need to ask team. Human, not robotic.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
