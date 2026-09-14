'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket } from '@/lib/ticketEngine';
import { calculateCommunicationScore, saveProgress, loadProgress, StudentProgress } from '@/lib/progressEngine';

interface CallMessage {
  id: string;
  speaker: 'client' | 'you' | 'system' | 'expert';
  expertName?: string;
  text: string;
  time: string;
  action?: { description: string; output?: string; success: boolean };
  isQuestion?: boolean;
  audioUrl?: string;
  score?: {
    empathy: number;
    clarity: number;
    technical: number;
    fluency: number;
    clientLang: number;
  };
}

interface Call {
  id: string;
  ticket: Ticket;
  status: 'incoming' | 'active' | 'hold' | 'ended';
  duration: number;
  transcript: CallMessage[];
  clientPersona: 'enterprise' | 'smb' | 'regulated';
  experts: string[];
  scores: {
    avgEmpathy: number;
    avgClarity: number;
    avgTechnical: number;
    avgFluency: number;
    avgClientLang: number;
    overall: number;
  };
}

interface Props {
  tickets: Ticket[];
  onAcceptCall: (ticket: Ticket) => void;
  onCallScore?: (score: Call['scores'], duration: number) => void;
}

const clientVoices: Record<string, { rate: number; pitch: number; voiceName: string; lang: string }> = {
  enterprise: { rate: 1.0, pitch: 0.9, voiceName: 'Microsoft Guy', lang: 'en-US' },
  smb: { rate: 1.15, pitch: 1.2, voiceName: 'Microsoft Zira', lang: 'en-US' },
  regulated: { rate: 0.9, pitch: 0.8, voiceName: 'Microsoft David', lang: 'en-US' },
};

const clientReplies: Record<string, string[]> = {
  enterprise: [
    "Got it, I ran dsregcmd slash status — AzureAdJoined YES, Compliance NO, DeviceId {id}. What next? Correlation ID {corr}.",
    "Checked Company Portal, Sync, Last sync 2 minutes ago, BitLocker Not Compliant, Secure Boot Compliant. Should I enable BitLocker?",
    "Service Health green, no incidents. Payroll in 45 minutes, P1. Can you check Sign-in logs CA tab?",
    "I also checked Audit logs — policy pushed at 08:02 by john dot admin without Report-Only. What If shows block.",
  ],
  smb: [
    "Um, where do I type that? Is it in Start menu? Says AzureAdJoined YES but Compliance NO — what does that mean?",
    "Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant?",
    "Heyy! It works now! Thank you! You explained in simple steps, no jargon — perfect!",
    "Will I lose my unsaved Photoshop work if I restart? I have client call in 20 mins!",
  ],
  regulated: [
    "Acknowledged. Executed dsregcmd slash status per instruction. Output: AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need audit trail. Please advise remediation and provide RCA.",
    "Per policy SEC-2024-07, BitLocker required. Checked Get-BitLockerVolume: Protection Off, 0 percent. Need approved procedure and confirm key escrowed to Entra ID.",
    "Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy Require compliant device. Please provide audit trail for compliance review.",
  ],
};

const expertReplies: Record<string, string> = {
  Alex: "Alex here — Entra expert. For 53000, check Sign-in logs, CA tab, What If tool, Audit logs who pushed at 08:02. If P1 50 users, use Break Glass excluded from CA. Never push CA without Report-Only 24 hours.",
  Priya: "Priya here — Intune expert. 0x80180024 is stale enrollment: Settings, Access work or school, Disconnect old, dsregcmd slash leave, delete stale device in Entra, re-enroll via Company Portal. Device cap default 5, raise to 10 if needed.",
  David: "David here — Exchange expert. Quarantine false positive: Message Trace, Quarantined, Reason Bulk High, Release plus Allow Sender plus Report Not Junk, tune Anti-spam if recurring. Provide audit trail per SEC-2024-07.",
};

export default function CallCenterV3({ tickets, onAcceptCall, onCallScore }: Props) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<Ticket | null>(null);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showExperts, setShowExperts] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [showScoring, setShowScoring] = useState(true);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      // Speech recognition for live talking
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              final += transcript + ' ';
            } else {
              interim += transcript;
            }
          }
          if (final) {
            setInput(prev => prev + final);
            setLiveTranscript('');
          } else {
            setLiveTranscript(interim);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const speakText = (text: string, persona: 'enterprise' | 'smb' | 'regulated') => {
    if (!synthRef.current || isMuted) return;
    
    // Stop any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceConfig = clientVoices[persona];
    
    utterance.rate = voiceConfig.rate;
    utterance.pitch = voiceConfig.pitch;
    utterance.volume = 0.9;
    utterance.lang = voiceConfig.lang;
    
    // Try to find matching voice
    const voices = synthRef.current.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (matchingVoice) utterance.voice = matchingVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const playTone = () => {
        if (!ctx || ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.15;
        osc.start();
        setTimeout(() => {
          osc.stop();
          if (incomingCall && ctx.state !== 'closed') {
            setTimeout(playTone, 1000);
          }
        }, 400);
      };
      playTone();
    } catch {}
  };

  const stopRingtone = () => {
    try {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    } catch {}
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeCall?.transcript, isTyping, liveTranscript]);

  useEffect(() => {
    const interval = setInterval(() => {
      const p1 = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved');
      const pool = p1.length > 0 ? p1 : tickets.filter(t => t.status !== 'resolved');
      if (pool.length > 0 && !activeCall && !incomingCall && Math.random() < 0.1) {
        const ticket = pool[Math.floor(Math.random() * pool.length)];
        setIncomingCall(ticket);
        playRingtone();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [tickets, activeCall, incomingCall]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== 'active' || isHold) return;
    const timer = setInterval(() => {
      setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCall, isHold]);

  const getPersona = (ticket: Ticket): 'enterprise' | 'smb' | 'regulated' => {
    if (ticket.clientId === 'client-a') return 'enterprise';
    if (ticket.clientId === 'client-b') return 'smb';
    return 'regulated';
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    stopRingtone();
    const persona = getPersona(incomingCall);
    const now = '00:00';
    
    let firstMessage = '';
    if (persona === 'enterprise') {
      firstMessage = `Hi, this is ${incomingCall.userEmail.split('@')[0]} from Finance at NovaTech. Blocked by CA, error 53000 DeviceNotCompliant. Correlation ID ${Math.random().toString(36).substring(7)}. Service Health green. Can you check Sign-in logs CA tab? Payroll in 45 mins, P1.`;
    } else if (persona === 'smb') {
      firstMessage = `Heyy! It's ${incomingCall.userEmail.split('@')[0]} from Bloom and Co. Shared mailbox finance at bloomco dot studio not showing in Outlook? I see it in webmail though. Simple steps please? Client call in 20 mins!`;
    } else {
      firstMessage = `Good morning, ${incomingCall.userEmail.split('@')[0]} from Risk and Compliance at Apex Financial. Per SEC-2024-07, require BitLocker compliance, device Not Compliant blocking Teams. Need audit trail plus RCA for compliance review.`;
    }

    const newCall: Call = {
      id: incomingCall.id,
      ticket: incomingCall,
      status: 'active',
      duration: 0,
      transcript: [
        { id: '1', speaker: 'system', text: `📞 Call connected • ${incomingCall.userEmail} • ${incomingCall.clientName} • Session ${Math.random().toString(36).substring(7)} • 🔴 Recording • Encrypted • Real Voice`, time: now },
        { id: '2', speaker: 'client', text: firstMessage, time: '00:05' },
      ],
      clientPersona: persona,
      experts: [],
      scores: { avgEmpathy: 0, avgClarity: 0, avgTechnical: 0, avgFluency: 0, avgClientLang: 0, overall: 0 },
    };

    setActiveCall(newCall);
    setIncomingCall(null);
    onAcceptCall(incomingCall);
    
    // Client TALKS live with real voice
    setTimeout(() => speakText(firstMessage, persona), 500);
  };

  const declineCall = () => {
    stopRingtone();
    stopSpeaking();
    setIncomingCall(null);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser. Use Chrome or Edge for live talking. You can still type.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setLiveTranscript('');
      recognitionRef.current.start();
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !activeCall) return;
    
    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    
    // Calculate communication score for this message
    const commScore = calculateCommunicationScore(input, activeCall.clientPersona, {
      usedClientLanguage: input.toLowerCase().includes('sec-2024-07') || input.toLowerCase().includes('simple') || input.includes('😅'),
      checkedLogs: input.toLowerCase().includes('sign-in') || input.toLowerCase().includes('audit') || input.toLowerCase().includes('logs'),
      usedCorrectTool: input.toLowerCase().includes('dsregcmd') || input.toLowerCase().includes('bitlocker') || input.toLowerCase().includes('company portal'),
    });

    const userMsg: CallMessage = { 
      id: Date.now().toString(), 
      speaker: 'you', 
      text: input, 
      time: now,
      score: {
        empathy: commScore.empathy,
        clarity: commScore.clarity,
        technical: commScore.technicalAccuracy,
        fluency: commScore.fluency,
        clientLang: commScore.clientLanguage,
      }
    };
    
    // Update call scores
    const newScores = {
      avgEmpathy: Math.round((activeCall.scores.avgEmpathy * activeCall.transcript.filter(m => m.speaker === 'you').length + commScore.empathy) / (activeCall.transcript.filter(m => m.speaker === 'you').length + 1)),
      avgClarity: Math.round((activeCall.scores.avgClarity * activeCall.transcript.filter(m => m.speaker === 'you').length + commScore.clarity) / (activeCall.transcript.filter(m => m.speaker === 'you').length + 1)),
      avgTechnical: Math.round((activeCall.scores.avgTechnical * activeCall.transcript.filter(m => m.speaker === 'you').length + commScore.technicalAccuracy) / (activeCall.transcript.filter(m => m.speaker === 'you').length + 1)),
      avgFluency: Math.round((activeCall.scores.avgFluency * activeCall.transcript.filter(m => m.speaker === 'you').length + commScore.fluency) / (activeCall.transcript.filter(m => m.speaker === 'you').length + 1)),
      avgClientLang: Math.round((activeCall.scores.avgClientLang * activeCall.transcript.filter(m => m.speaker === 'you').length + commScore.clientLanguage) / (activeCall.transcript.filter(m => m.speaker === 'you').length + 1)),
      overall: 0,
    };
    newScores.overall = Math.round((newScores.avgEmpathy + newScores.avgClarity + newScores.avgTechnical + newScores.avgFluency + newScores.avgClientLang) / 5);
    
    setActiveCall(prev => prev ? { 
      ...prev, 
      transcript: [...prev.transcript, userMsg], 
      status: 'active',
      scores: newScores,
    } : null);
    
    const userInput = input;
    setInput('');
    setLiveTranscript('');
    setIsTyping(true);

    // Client does action + replies with REAL VOICE
    setTimeout(() => {
      const persona = activeCall.clientPersona;
      const replies = clientReplies[persona];
      let replyText = replies[Math.floor(Math.random() * replies.length)];
      
      replyText = replyText.replace('{id}', Math.random().toString(36).substring(7)).replace('{corr}', Math.random().toString(36).substring(7));

      const lower = userInput.toLowerCase();
      let action;
      if (lower.includes('dsregcmd') || lower.includes('status')) {
        action = { description: 'Ran dsregcmd /status', output: 'AzureAdJoined YES, Compliance NO, MdmUrl present', success: true };
        replyText = persona === 'enterprise' 
          ? `Ran dsregcmd slash status — AzureAdJoined YES, DomainJoined NO, DeviceId ${Math.random().toString(36).substring(7)}, Compliance NO, MdmUrl https://enrollment.manage.microsoft.com. So not compliant. What next?`
          : persona === 'smb'
          ? `I tried dsregcmd, says AzureAdJoined YES but Compliance NO — what does that mean? Can you explain like I'm 5?`
          : `Executed dsregcmd slash status per instruction. AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need remediation plus audit trail.`;
      } else if (lower.includes('company portal') || lower.includes('sync')) {
        action = { description: 'Opened Company Portal → Sync', output: 'Last sync 2m ago, BitLocker Not Compliant', success: true };
      } else if (lower.includes('bitlocker')) {
        action = { description: 'Checked BitLocker status', output: 'Protection Off, Encryption 0%', success: false };
      }

      const clientMsg: CallMessage = {
        id: (Date.now()+1).toString(),
        speaker: 'client',
        text: replyText,
        time: `${String(Math.floor((activeCall.duration+2) / 60)).padStart(2,'0')}:${String((activeCall.duration+2) % 60).padStart(2,'0')}`,
        action,
        isQuestion: replyText.includes('?'),
      };

      setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, clientMsg] } : null);
      setIsTyping(false);
      
      // CLIENT TALKS LIVE WITH REAL VOICE
      speakText(replyText, persona);

      if (Math.random() < 0.4) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const followUp: CallMessage = {
              id: (Date.now()+2).toString(),
              speaker: 'client',
              text: persona === 'smb' ? `Also, will I lose my work if I restart?` : persona === 'enterprise' ? `Quick question: What is ETA? Correlation ID ${Math.random().toString(36).substring(7)}` : `Additionally, per SEC-2024-07, need audit trail for compliance.`,
              time: `${String(Math.floor((activeCall.duration+5) / 60)).padStart(2,'0')}:${String((activeCall.duration+5) % 60).padStart(2,'0')}`,
              isQuestion: true,
            };
            setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, followUp] } : null);
            setIsTyping(false);
            speakText(followUp.text, persona);
          }, 1000);
        }, 4000);
      }
    }, 1500);
  };

  const addExpert = (expertName: string) => {
    if (!activeCall) return;
    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const joinMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `👨‍💻 ${expertName} joined the call • Conference • Real Voice`, time: now };
    const expertMsg: CallMessage = { id: (Date.now()+1).toString(), speaker: 'expert', expertName, text: expertReplies[expertName] || `${expertName} here, how can I help?`, time: now };
    
    setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, joinMsg, expertMsg], experts: [...prev.experts, expertName] } : null);
    setShowExperts(false);
    
    // Expert talks with real voice
    setTimeout(() => speakText(expertReplies[expertName], 'enterprise'), 800);
  };

  const endCall = () => {
    if (!activeCall) return;
    stopRingtone();
    stopSpeaking();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    // Save call score to progress
    if (onCallScore) {
      onCallScore(activeCall.scores, activeCall.duration);
    }
    
    const endMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `📞 Call ended • Duration ${formatDuration(activeCall.duration)} • Score ${activeCall.scores.overall}/100 • Recording saved • Transcript saved • Assessment updated`, time: formatDuration(activeCall.duration) };
    setActiveCall(prev => prev ? { ...prev, status: 'ended', transcript: [...prev.transcript, endMsg] } : null);
    setTimeout(() => setActiveCall(null), 3000);
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  return (
    <>
      <AnimatePresence>
        {incomingCall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="bg-[#0a0a0a] rounded-[28px] shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
                <div className="relative">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white/10">
                    <span className="text-4xl">📞</span>
                  </motion.div>
                  <h3 className="font-bold text-[18px] tracking-tight">Incoming Call — Real Voice</h3>
                  <p className="text-[14px] opacity-90 mt-1 font-medium">{incomingCall.clientName} • {incomingCall.priority}</p>
                  <p className="text-[12px] opacity-70 mt-1 font-mono">{incomingCall.userEmail}</p>
                  <p className="text-[11px] opacity-60 mt-1">{incomingCall.title.substring(0, 50)}...</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/10">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    SLA {Math.floor(incomingCall.timeLeftMs/60000)}m left • Real Voice • Live Scoring
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-[#0a0a0a]">
                <div className="bg-zinc-900 rounded-2xl p-4 text-[13px] mb-5 border border-zinc-800">
                  <p className="text-zinc-200 leading-[1.4]">"{incomingCall.userMessage}"</p>
                  <div className="flex gap-1.5 mt-3">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{incomingCall.code}</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">{incomingCall.priority} • Live Voice</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">Scored</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-3 leading-[1.3]">🔊 Client will TALK with real voice (Web Speech API) — you can talk back with mic 🎙️ — both sides live, scored for empathy, clarity, technical, fluency.</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={declineCall} className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[14px] flex items-center justify-center gap-2 transition">
                    ✕ Decline
                  </button>
                  <button onClick={acceptCall} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition">
                    ✓ Accept — Talk Live 🔊
                  </button>
                </div>

                <p className="text-[11px] text-zinc-600 text-center mt-4">Real voice both sides • Live transcription • Scored for Influx assessment • Not robotic</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCall && activeCall.status === 'active' && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-5xl bg-[#0a0a0a] rounded-[24px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                {activeCall.ticket.userEmail[0].toUpperCase()}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
                  {activeCall.ticket.userEmail.split('@')[0]} • {activeCall.ticket.clientName}
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-emerald-400">{formatDuration(activeCall.duration)}</span>
                  {isSpeaking && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">🔊 Client Talking...</span>}
                  {isListening && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🎙️ Listening...</span>}
                </p>
                <p className="text-[11px] text-zinc-500">{activeCall.ticket.code} • {activeCall.clientPersona} • {isHold ? 'On Hold' : 'Live Voice'} • 🔴 REC • Score {activeCall.scores.overall}/100</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMuted(!isMuted)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}>🔊</button>
              <button onClick={() => setIsHold(!isHold)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${isHold ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>⏸️</button>
              <button onClick={() => setShowExperts(!showExperts)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${showExperts ? 'bg-violet-600 text-white border-violet-500' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>👨‍💻</button>
              <button onClick={() => setShowScoring(!showScoring)} className={`h-9 px-3 rounded-full flex items-center justify-center border text-[11px] transition ${showScoring ? 'bg-violet-600 text-white border-violet-500' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>📊 {activeCall.scores.overall}</button>
              <button onClick={endCall} className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition">📞</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
                {activeCall.transcript.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.4] border ${m.speaker === 'you' ? 'bg-violet-600 border-violet-500 text-white rounded-br-sm' : m.speaker === 'client' ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-sm' : m.speaker === 'expert' ? 'bg-blue-500/10 border-blue-500/20 text-blue-100 rounded-bl-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 text-[11px]'}`}>
                      {m.speaker === 'expert' && <p className="text-[11px] font-bold text-blue-300 mb-1">👨‍💻 {m.expertName}</p>}
                      {m.speaker === 'client' && <p className="text-[10px] text-violet-300 mb-1 flex items-center gap-1">🔊 Real Voice • {m.time}</p>}
                      {m.speaker === 'you' && m.score && <p className="text-[10px] text-violet-200 mb-1">You • Score {Math.round((m.score.empathy + m.score.clarity + m.score.technical + m.score.fluency + m.score.clientLang)/5)}/100 • {m.time}</p>}
                      <p>{m.text}</p>
                      {m.action && (
                        <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                          <p className="text-[11px] font-medium">⚡ Client doing action now: {m.action.description}</p>
                          {m.action.output && <p className="text-[11px] font-mono text-emerald-300 mt-1">{m.action.output}</p>}
                          <p className={`text-[10px] mt-1 ${m.action.success ? 'text-emerald-400' : 'text-amber-400'}`}>{m.action.success ? '✓ Success' : '⚠ Needs help'}</p>
                        </div>
                      )}
                      {m.speaker === 'you' && m.score && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${m.score.empathy > 60 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-700 text-zinc-400'}`}>Empathy {m.score.empathy}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${m.score.clarity > 60 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-700 text-zinc-400'}`}>Clarity {m.score.clarity}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${m.score.technical > 60 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-700 text-zinc-400'}`}>Tech {m.score.technical}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${m.score.fluency > 60 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-zinc-700 text-zinc-400'}`}>Fluency {m.score.fluency}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${m.score.clientLang > 60 ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'bg-zinc-700 text-zinc-400'}`}>Lang {m.score.clientLang}</span>
                        </div>
                      )}
                      <p className="text-[10px] opacity-60 mt-1.5">{m.time} {m.isQuestion && '• Question'}</p>
                    </div>
                  </motion.div>
                ))}
                {liveTranscript && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] leading-[1.4] border bg-violet-600/50 border-violet-500/50 text-white border-dashed">
                      <p className="text-[10px] text-violet-200 mb-1">🎙️ Live transcript...</p>
                      <p className="italic">{liveTranscript}</p>
                    </div>
                  </div>
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] text-zinc-500 ml-2">Client is typing, doing action, and will talk with voice...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-zinc-900 border-t border-zinc-800">
                <div className="flex gap-2">
                  <button onClick={toggleListening} className={`h-10 w-10 rounded-full flex items-center justify-center border transition ${isListening ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}>🎙️</button>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={activeCall.clientPersona === 'smb' ? "Talk in simple steps + click 🎙️ to talk live..." : "Share facts + click 🎙️ to talk live..."}
                    className="flex-1 h-10 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  <button onClick={sendMessage} disabled={!input.trim()} className="h-10 px-5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[13px] font-semibold transition">Send</button>
                  <button onClick={stopSpeaking} className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 flex items-center justify-center">🔇</button>
                </div>
                <div className="flex gap-1.5 mt-2 overflow-x-auto">
                  {[
                    "I understand, let me help you with that. Can you run dsregcmd /status?",
                    "Sorry about that! Can you open Company Portal and click Sync?",
                    "Thanks for checking! Per SEC-2024-07, can you confirm key escrowed?",
                  ].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-400 whitespace-nowrap transition">
                      {q.substring(0, 35)}...
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">🔊 Real voice both sides • 🎙️ Click mic to talk live (Chrome/Edge) • Live transcription • Scored for Influx assessment • Empathy, Clarity, Tech, Fluency, Client Lang</p>
              </div>
            </div>

            {showScoring && (
              <div className="w-[300px] border-l border-zinc-800 bg-zinc-900 p-3 overflow-y-auto">
                <h4 className="text-[12px] font-semibold text-zinc-200 mb-3 flex items-center gap-2">📊 Live Scoring — Influx Assessment <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">{activeCall.scores.overall}/100</span></h4>
                
                <div className="space-y-3">
                  {[
                    { label: 'Empathy', value: activeCall.scores.avgEmpathy, desc: 'Sorry, understand, thank you', color: 'emerald' },
                    { label: 'Clarity', value: activeCall.scores.avgClarity, desc: 'Simple for SMB, technical for Enterprise', color: 'blue' },
                    { label: 'Technical', value: activeCall.scores.avgTechnical, desc: 'Correct logs, tools, RCA', color: 'violet' },
                    { label: 'Fluency', value: activeCall.scores.avgFluency, desc: 'No um/uh, good pace', color: 'amber' },
                    { label: 'Client Lang', value: activeCall.scores.avgClientLang, desc: 'Bloom simple+emojis, Apex SEC-2024-07', color: 'pink' },
                  ].map(metric => (
                    <div key={metric.label} className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] font-medium text-zinc-200">{metric.label}</p>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${metric.value >= 80 ? 'bg-emerald-500/20 text-emerald-300' : metric.value >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{metric.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} className={`h-full ${metric.color === 'emerald' ? 'bg-emerald-500' : metric.color === 'blue' ? 'bg-blue-500' : metric.color === 'violet' ? 'bg-violet-500' : metric.color === 'amber' ? 'bg-amber-500' : 'bg-pink-500'}`} />
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">{metric.desc}</p>
                    </div>
                  ))}

                  <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-[11px] font-medium text-violet-300">Overall Communication</p>
                    <p className="text-[24px] font-bold text-white mt-1">{activeCall.scores.overall}/100</p>
                    <p className="text-[10px] text-violet-300/70 mt-1">{activeCall.scores.overall >= 80 ? 'Excellent — Influx ready!' : activeCall.scores.overall >= 60 ? 'Good — keep practicing empathy + client language' : 'Needs work — use sorry, understand, simple steps for SMB, SEC-2024-07 for Apex'}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                    <p className="text-[11px] font-medium text-zinc-200 mb-2">Tips for Influx Interview</p>
                    <ul className="text-[10px] text-zinc-400 space-y-1 list-disc list-inside">
                      <li>Always say "I understand" + "Sorry about that"</li>
                      <li>Bloom SMB: simple steps, no jargon, emojis okay</li>
                      <li>NovaTech Enterprise: Correlation ID, Sign-in logs CA tab, What If</li>
                      <li>Apex Regulated: SEC-2024-07, audit trail, RCA, key escrow</li>
                      <li>Click 🎙️ mic to talk live — shows fluency</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {showExperts && (
              <div className="w-[280px] border-l border-zinc-800 bg-zinc-900 p-3">
                <h4 className="text-[12px] font-semibold text-zinc-200 mb-3">Add Tech Expert to Call — Real Voice</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Alex', specialty: 'Entra ID & CA', color: 'violet' },
                    { name: 'Priya', specialty: 'Intune & Compliance', color: 'emerald' },
                    { name: 'David', specialty: 'Exchange & Defender', color: 'blue' },
                  ].map(expert => (
                    <div key={expert.name} className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                      <p className="text-[12px] font-medium text-zinc-200">{expert.name}</p>
                      <p className="text-[11px] text-zinc-500">{expert.specialty}</p>
                      <button onClick={() => addExpert(expert.name)} className="mt-2 w-full h-7 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition">Add to Call — Talks Live 🔊</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
}
