'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallMessage {
  id: string;
  speaker: 'client' | 'you' | 'system';
  text: string;
  time: string;
  audioUrl?: string;
  isVoice: boolean;
}

interface Call {
  id: string;
  status: 'incoming' | 'active' | 'ended';
  duration: number;
  transcript: CallMessage[];
  persona: 'enterprise' | 'smb' | 'regulated';
  phase: 'waiting_greeting' | 'waiting_intro' | 'problem' | 'troubleshooting' | 'resolution';
}

const greetings = {
  enterprise: ["Hello? Is this IT support? I'm having an issue with my account.", "Hi, is this the helpdesk? I need assistance."],
  smb: ["Hello? Hi, is this IT? My Outlook is not working.", "Hey, is this support? Email trouble."],
  regulated: ["Good morning, is this IT support? Compliance issue.", "Hello, Risk and Compliance, need help with device compliance."],
};

const intros = {
  enterprise: (name: string, client: string) => `Hi, thank you. This is ${name} from Finance at ${client}. I'm blocked by Conditional Access, error 53000 DeviceNotCompliant. Payroll deadline in 45 minutes, P1. Could you help?`,
  smb: (name: string, client: string) => `Hi! So it's ${name} from ${client}. My shared mailbox finance at bloomco dot studio is not showing in Outlook? I can see it in webmail though. Client call in 20 minutes, could you help with simple steps?`,
  regulated: (name: string, client: string) => `Good morning. This is ${name} from Risk and Compliance at ${client}. Per policy SEC-2024-07, device Not Compliant blocking Teams. Need audit trail and RCA.`,
};

const troubleshooting = {
  enterprise: [
    "I checked Service Health, it's green. Should I check Sign-in logs CA tab?",
    "Ran dsregcmd status — AzureAdJoined YES, Compliance NO. What next? Correlation ID {id}",
    "Checked Company Portal Sync, last sync 2 mins ago, BitLocker Not Compliant. Should I enable?",
  ],
  smb: [
    "Where do I type that? Is it in Start menu? Says AzureAdJoined YES but Compliance NO — what does that mean?",
    "Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant?",
    "Will I lose my unsaved Photoshop work if I restart? I have client call in 20 mins!",
  ],
  regulated: [
    "Executed dsregcmd status per instruction. AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need audit trail.",
    "Per policy SEC-2024-07, BitLocker required. Checked Get-BitLockerVolume: Protection Off, 0 percent. Need approved procedure.",
    "Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy Require compliant device.",
  ],
};

export default function VoiceCallCenter({ tickets, onAccept }: { tickets: any[], onAccept: (t: any) => void }) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incoming, setIncoming] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [clientAudioLevel, setClientAudioLevel] = useState(0);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
    }
  }, []);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [activeCall?.transcript, liveTranscript]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (tickets.length > 0 && !activeCall && !incoming && Math.random() < 0.08) {
        const ticket = tickets[Math.floor(Math.random() * tickets.length)];
        setIncoming(ticket);
        playRingtone();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [tickets, activeCall, incoming]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== 'active') return;
    const timer = setInterval(() => setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null), 1000);
    return () => clearInterval(timer);
  }, [activeCall]);

  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const playTone = () => {
        if (!ctx || ctx.state === 'closed' || !incoming) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.15;
        osc.start();
        setTimeout(() => { osc.stop(); if (incoming && ctx.state !== 'closed') setTimeout(playTone, 1000); }, 400);
      };
      playTone();
    } catch {}
  };

  const stopRingtone = () => { try { audioContextRef.current?.close(); audioContextRef.current = null; } catch {} };

  const speakClient = (text: string, persona: 'enterprise' | 'smb' | 'regulated') => {
    if (!synthRef.current || isMuted) return;
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
      analyserRef.current = analyser;
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

    // Client hears you — simulate by having client respond contextually to your voice
    setTimeout(() => {
      let reply = '';
      const persona = activeCall.persona;
      if (prevPhase === 'waiting_greeting') {
        reply = intros[persona](activeCall.id.split('-')[0], 'ClientCo');
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
        else if (lower.includes('thank') || lower.includes('fixed') || lower.includes('working')) { reply = `Perfect, it works now! Thank you, you explained in simple steps! Five stars!`; setActiveCall(prev => prev ? { ...prev, phase: 'resolution' } : null); }
      }
      const clientMsg: CallMessage = { id: (Date.now()+1).toString(), speaker: 'client', text: reply, time: `${String(Math.floor((activeCall.duration+2)/60)).padStart(2,'0')}:${String((activeCall.duration+2)%60).padStart(2,'0')}`, isVoice: true };
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
      transcript: [
        { id: '1', speaker: 'system', text: `📞 Voice Call Connected • ${incoming.userEmail} • ${incoming.clientName} • 🔴 Recording • Encrypted • Mouth-to-Ear Voice, No Text`, time: '00:00', isVoice: false },
        { id: '2', speaker: 'client', text: greeting, time: '00:03', isVoice: true },
      ],
      persona,
      phase: 'waiting_greeting',
    };
    setActiveCall(newCall);
    setIncoming(null);
    onAccept(incoming);
    setTimeout(() => speakClient(greeting, persona), 600);
  };

  const declineCall = () => { stopRingtone(); setIncoming(null); };
  const endCall = () => { stopRingtone(); if (synthRef.current) synthRef.current.cancel(); stopMic(); setActiveCall(null); };

  return (
    <>
      <AnimatePresence>
        {incoming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] rounded-[28px] shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800">
              <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
                <div className="relative">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-white/10">
                    <span className="text-4xl">📞</span>
                  </motion.div>
                  <h3 className="font-bold text-[18px]">Incoming Voice Call — Mouth-to-Ear</h3>
                  <p className="text-[14px] opacity-90 mt-1">{incoming.clientName} • {incoming.priority}</p>
                  <p className="text-[12px] opacity-70 mt-1 font-mono">{incoming.userEmail}</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/10">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                    Voice-to-Voice • No Texting • You Speak, Caller Hears
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#0a0a0a]">
                <div className="bg-zinc-900 rounded-2xl p-4 text-[13px] mb-5 border border-zinc-800">
                  <p className="text-zinc-200 leading-[1.4]">"{incoming.userMessage}"</p>
                  <p className="text-[11px] text-zinc-500 mt-3 leading-[1.3]">🔊 Real phone call: You pick → You say "Hello, how may I help?" with your mouth → Caller hears your voice → Caller replies with voice → You hear via ear → No texting back after talk, like real phone.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={declineCall} className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[14px]">✕ Decline</button>
                  <button onClick={acceptCall} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-[14px] shadow-lg shadow-emerald-600/20">✓ Accept — Speak Now</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeCall && activeCall.status === 'active' && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-5xl bg-[#0a0a0a] rounded-[24px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="h-14 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">{activeCall.id[0].toUpperCase()}</div>
              <div>
                <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
                  {activeCall.id.substring(0,8)} • {activeCall.persona} • Voice Call
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-emerald-400">{String(Math.floor(activeCall.duration/60)).padStart(2,'0')}:{String(activeCall.duration%60).padStart(2,'0')}</span>
                  {isListening && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">🎙️ You Speaking — Caller Hears You</span>}
                  {isSpeaking && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">🔊 Client Speaking — You Hear</span>}
                </p>
                <p className="text-[11px] text-zinc-500">Mouth-to-Ear • No Texting • {activeCall.phase} • 🔴 REC</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMuted(!isMuted)} className={`h-9 w-9 rounded-full flex items-center justify-center border ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>🔊</button>
              <button onClick={endCall} className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center">📞</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col">
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
                {activeCall.transcript.map(m => (
                  <div key={m.id} className={`flex ${m.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.4] border ${m.speaker === 'you' ? 'bg-violet-600 border-violet-500 text-white rounded-br-sm' : m.speaker === 'client' ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 text-[11px]'}`}>
                      <p className="text-[10px] opacity-70 mb-1 flex items-center gap-1.5">
                        {m.speaker === 'you' ? '🎙️ You (Voice — Caller Heard)' : m.speaker === 'client' ? '🔊 Client (Voice — You Heard)' : 'System'} • {m.time} • {m.isVoice ? 'Voice' : 'System'}
                      </p>
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))}
                {liveTranscript && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] border bg-violet-600/50 border-violet-500/50 text-white border-dashed">
                      <p className="text-[10px] mb-1">🎙️ You Speaking Live — Caller Hears You Now...</p>
                      <p className="italic">{liveTranscript}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20" />
                        <span className="text-2xl relative">🎙️</span>
                        {isListening && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute inset-0 rounded-full border-2 border-red-500/50" />}
                      </div>
                      <span className="text-[10px] text-zinc-500">You</span>
                      <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-red-500 transition-all" style={{ width: `${userAudioLevel}%` }} /></div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="h-px w-12 bg-zinc-700" />
                      <span className="text-[10px] text-zinc-600 font-mono">Voice Call • Mouth-to-Ear • No Text</span>
                      <div className="h-px w-12 bg-zinc-700" />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="h-16 w-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-violet-600/20" />
                        <span className="text-2xl relative">🔊</span>
                        {isSpeaking && <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute inset-0 rounded-full border-2 border-violet-500/50" />}
                      </div>
                      <span className="text-[10px] text-zinc-500">Client</span>
                      <div className="h-1 w-12 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-violet-500 transition-all" style={{ width: `${clientAudioLevel}%` }} /></div>
                    </div>
                  </div>

                  <button
                    onMouseDown={startMic}
                    onMouseUp={stopMic}
                    onTouchStart={startMic}
                    onTouchEnd={stopMic}
                    className={`h-14 w-64 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-lg ${isListening ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20 scale-105' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}
                  >
                    {isListening ? '● Recording — Caller Hears You — Release to Send' : '🎙️ Hold to Speak — Voice Only, No Texting'}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center max-w-[400px] leading-[1.3]">
                    {activeCall.phase === 'waiting_greeting' ? 'Client said hello — hold mic and say: Hello, how may I help you today? with your mouth, caller hears your voice' :
                     activeCall.phase === 'waiting_intro' ? 'Client introducing — listen via ear, then hold mic to reply with voice' :
                     'Hold mic to speak — your mouth → caller ear, caller mouth → your ear, no texting back after talk, like real phone call from one person to another'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
