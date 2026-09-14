'use client';
import { useState, useEffect, useRef } from 'react';
import { Ticket } from '@/lib/ticketEngine';

interface CallMessage {
  id: string;
  speaker: 'client' | 'you' | 'system' | 'expert';
  expertName?: string;
  text: string;
  time: string;
  action?: { description: string; output?: string; success: boolean };
  isQuestion?: boolean;
}

interface Call {
  id: string;
  ticket: Ticket;
  status: 'incoming' | 'connecting' | 'active' | 'hold' | 'ended';
  duration: number;
  transcript: CallMessage[];
  clientPersona: 'enterprise' | 'smb' | 'regulated';
  experts: string[];
}

interface Props {
  tickets: Ticket[];
  onAcceptCall: (ticket: Ticket) => void;
}

const clientReplies: Record<string, string[]> = {
  'enterprise': [
    "Got it, I ran dsregcmd /status — AzureAdJoined YES, Compliance NO, DeviceId {id}. What next? Correlation ID {corr}.",
    "Checked Company Portal → Sync, Last sync 2m ago, BitLocker Not Compliant, Secure Boot Compliant. Should I enable BitLocker?",
    "Service Health green, no incidents. Payroll in 45 mins, P1. Can you check Sign-in logs CA tab?",
    "I also checked Audit logs — policy pushed at 08:02 by john.admin without Report-Only. What If shows block.",
  ],
  'smb': [
    "Um, where do I type that? 😅 Is it in Start menu? Says AzureAdJoined YES but Compliance NO — what does that mean?",
    "Company Portal? Blue icon with shopping bag? I clicked Sync, spins, says last sync just now but still Not compliant? 🥺",
    "Heyy! It works now! Thank you! You explained in simple steps, no jargon — perfect! ⭐⭐⭐⭐⭐",
    "Will I lose my unsaved Photoshop work if I restart? I have client call in 20 mins!",
  ],
  'regulated': [
    "Acknowledged. Executed dsregcmd /status per instruction. Output: AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need audit trail. Please advise remediation and provide RCA.",
    "Per policy SEC-2024-07, BitLocker required. Checked Get-BitLockerVolume: Protection Off, 0%. Need approved procedure and confirm key escrowed to Entra ID.",
    "Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy 'Require compliant device'. Please provide audit trail for compliance review.",
  ],
};

const expertReplies: Record<string, string> = {
  'Alex': "Alex here — Entra expert. For 53000, check Sign-in logs → CA tab → What If tool → Audit logs who pushed at 08:02. If P1 50 users, use Break Glass excluded from CA. Never push CA without Report-Only 24h.",
  'Priya': "Priya here — Intune expert. 0x80180024 is stale enrollment: Settings → Access work/school → Disconnect old, dsregcmd /leave, delete stale device in Entra, re-enroll via Company Portal. Device cap default 5, raise to 10 if needed.",
  'David': "David here — Exchange expert. Quarantine false positive: Message Trace → Quarantined, Reason Bulk High, Release + Allow Sender + Report Not Junk, tune Anti-spam if recurring. Provide audit trail per SEC-2024-07.",
};

export default function CallCenter({ tickets, onAcceptCall }: Props) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<Ticket | null>(null);
  const [input, setInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showExperts, setShowExperts] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Ringtone — Web Audio API, not recording
  const playRingtone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const playTone = () => {
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.15;
        osc.start();
        setTimeout(() => {
          osc.stop();
          if (incomingCall) {
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

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeCall?.transcript, isTyping]);

  // Incoming calls — P1 triggers phone ring
  useEffect(() => {
    const interval = setInterval(() => {
      const p1 = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved');
      const pool = p1.length > 0 ? p1 : tickets.filter(t => t.status !== 'resolved');
      if (pool.length > 0 && !activeCall && !incomingCall && Math.random() < 0.12) {
        const ticket = pool[Math.floor(Math.random() * pool.length)];
        setIncomingCall(ticket);
        playRingtone();
      }
    }, 8000);
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
      firstMessage = `Heyy! 😅 It's ${incomingCall.userEmail.split('@')[0]} from Bloom & Co. Shared mailbox finance@bloomco.studio not showing in Outlook? I see it in webmail though. Simple steps please? Client call in 20 mins!`;
    } else {
      firstMessage = `Good morning, ${incomingCall.userEmail.split('@')[0]} from Risk & Compliance at Apex Financial. Per SEC-2024-07, require BitLocker compliance, device Not Compliant blocking Teams. Need audit trail + RCA for compliance review.`;
    }

    const newCall: Call = {
      id: incomingCall.id,
      ticket: incomingCall,
      status: 'active',
      duration: 0,
      transcript: [
        { id: '1', speaker: 'system', text: `📞 Call connected • ${incomingCall.userEmail} • ${incomingCall.clientName} • Session ${Math.random().toString(36).substring(7)} • 🔴 Recording • Encrypted`, time: now },
        { id: '2', speaker: 'client', text: firstMessage, time: '00:05' },
      ],
      clientPersona: persona,
      experts: [],
    };

    setActiveCall(newCall);
    setIncomingCall(null);
    onAcceptCall(incomingCall);
  };

  const declineCall = () => {
    stopRingtone();
    setIncomingCall(null);
  };

  const sendMessage = () => {
    if (!input.trim() || !activeCall) return;
    
    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const userMsg: CallMessage = { id: Date.now().toString(), speaker: 'you', text: input, time: now };
    
    setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, userMsg], status: 'active' } : null);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Client does action + replies — feels like real phone conversation, not recording
    setTimeout(() => {
      const persona = activeCall.clientPersona;
      const replies = clientReplies[persona];
      let replyText = replies[Math.floor(Math.random() * replies.length)];
      
      // Personalize with IDs
      replyText = replyText.replace('{id}', Math.random().toString(36).substring(7)).replace('{corr}', Math.random().toString(36).substring(7));

      // If user asked to run command, client does it
      const lower = userInput.toLowerCase();
      let action;
      if (lower.includes('dsregcmd') || lower.includes('status')) {
        action = { description: 'Ran dsregcmd /status', output: 'AzureAdJoined YES, Compliance NO, MdmUrl present', success: true };
        replyText = persona === 'enterprise' 
          ? `Ran dsregcmd /status — AzureAdJoined YES, DomainJoined NO, DeviceId ${Math.random().toString(36).substring(7)}, Compliance NO, MdmUrl https://enrollment.manage.microsoft.com. So not compliant. What next?`
          : persona === 'smb'
          ? `I tried dsregcmd, says AzureAdJoined YES but Compliance NO — what does that mean? Can you explain like I'm 5? 😅`
          : `Executed dsregcmd /status per instruction. AzureAdJoined YES, Compliance NO. Per SEC-2024-07, need remediation + audit trail.`;
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

      // Follow-up question — keeps conversation flowing
      if (Math.random() < 0.5) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const followUp: CallMessage = {
              id: (Date.now()+2).toString(),
              speaker: 'client',
              text: persona === 'smb' ? `Also, will I lose my work if I restart? 🥺` : persona === 'enterprise' ? `Quick question: What is ETA? Correlation ID ${Math.random().toString(36).substring(7)}` : `Additionally, per SEC-2024-07, need audit trail for compliance.`,
              time: `${String(Math.floor((activeCall.duration+5) / 60)).padStart(2,'0')}:${String((activeCall.duration+5) % 60).padStart(2,'0')}`,
              isQuestion: true,
            };
            setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, followUp] } : null);
            setIsTyping(false);
          }, 1000);
        }, 3000);
      }
    }, 1200 + Math.random() * 800);
  };

  const addExpert = (expertName: string) => {
    if (!activeCall) return;
    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const joinMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `👨‍💻 ${expertName} joined the call • Conference`, time: now };
    const expertMsg: CallMessage = { id: (Date.now()+1).toString(), speaker: 'expert', expertName, text: expertReplies[expertName] || `${expertName} here, how can I help?`, time: now };
    
    setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, joinMsg, expertMsg], experts: [...prev.experts, expertName] } : null);
    setShowExperts(false);
  };

  const endCall = () => {
    if (!activeCall) return;
    stopRingtone();
    const endMsg: CallMessage = { id: Date.now().toString(), speaker: 'system', text: `📞 Call ended • Duration ${formatDuration(activeCall.duration)} • Recording saved • Transcript saved • CSAT survey sent`, time: formatDuration(activeCall.duration) };
    setActiveCall(prev => prev ? { ...prev, status: 'ended', transcript: [...prev.transcript, endMsg] } : null);
    setTimeout(() => setActiveCall(null), 2500);
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  return (
    <>
      {/* Incoming Call — Phone rings, you pick up */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] rounded-[28px] shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-800 animate-in zoom-in-95">
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
              <div className="relative">
                <div className="w-24 h-24 bg-white/15 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse ring-4 ring-white/10">
                  <span className="text-4xl animate-bounce">📞</span>
                </div>
                <h3 className="font-bold text-[18px] tracking-tight">Incoming Call</h3>
                <p className="text-[14px] opacity-90 mt-1 font-medium">{incomingCall.clientName} • {incomingCall.priority}</p>
                <p className="text-[12px] opacity-70 mt-1 font-mono">{incomingCall.userEmail}</p>
                <p className="text-[11px] opacity-60 mt-1">{incomingCall.title.substring(0, 50)}...</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/10">
                  <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                  SLA {Math.floor(incomingCall.timeLeftMs/60000)}m left • Real-time call
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-[#0a0a0a]">
              <div className="bg-zinc-900 rounded-2xl p-4 text-[13px] mb-5 border border-zinc-800">
                <p className="text-zinc-200 leading-[1.4]">"{incomingCall.userMessage}"</p>
                <div className="flex gap-1.5 mt-3">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{incomingCall.code}</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">{incomingCall.priority} • Live</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">Real conversation</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-3 leading-[1.3]">📞 Phone rings → You pick up → Hold legit conversation where client talks, does actions on other side, asks questions back. Not recording — real-time.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={declineCall} className="flex-1 h-12 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-full font-medium text-[14px] flex items-center justify-center gap-2 transition">
                  ✕ Decline
                </button>
                <button onClick={acceptCall} className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition">
                  ✓ Accept — Talk Live
                </button>
              </div>

              <p className="text-[11px] text-zinc-600 text-center mt-4">Real-time phone scenario • Client does actions • Asks questions • No robotic recording</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Call — Real phone UI, not chat */}
      {activeCall && activeCall.status === 'active' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl bg-[#0a0a0a] rounded-[24px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[80vh]">
          {/* Header — phone call style */}
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
                </p>
                <p className="text-[11px] text-zinc-500">{activeCall.ticket.code} • {activeCall.clientPersona} • {isHold ? 'On Hold' : 'Live'} • 🔴 REC • Encrypted</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsMuted(!isMuted)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'}`}>🎙️</button>
              <button onClick={() => setIsHold(!isHold)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${isHold ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>⏸️</button>
              <button onClick={() => setShowExperts(!showExperts)} className={`h-9 w-9 rounded-full flex items-center justify-center border transition ${showExperts ? 'bg-violet-600 text-white border-violet-500' : 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>👨‍💻</button>
              <button onClick={endCall} className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition">📞</button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Transcript — feels like phone call, not chat */}
            <div className="flex-1 flex flex-col">
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
                {activeCall.transcript.map(m => (
                  <div key={m.id} className={`flex ${m.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.4] border ${m.speaker === 'you' ? 'bg-violet-600 border-violet-500 text-white rounded-br-sm' : m.speaker === 'client' ? 'bg-zinc-800 border-zinc-700 text-zinc-100 rounded-bl-sm' : m.speaker === 'expert' ? 'bg-blue-500/10 border-blue-500/20 text-blue-100 rounded-bl-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-500 text-[11px]'}`}>
                      {m.speaker === 'expert' && <p className="text-[11px] font-bold text-blue-300 mb-1">👨‍💻 {m.expertName}</p>}
                      <p>{m.text}</p>
                      {m.action && (
                        <div className="mt-2 p-2.5 rounded-xl bg-black/40 border border-white/10">
                          <p className="text-[11px] font-medium">⚡ Client doing action now: {m.action.description}</p>
                          {m.action.output && <p className="text-[11px] font-mono text-emerald-300 mt-1">{m.action.output}</p>}
                          <p className={`text-[10px] mt-1 ${m.action.success ? 'text-emerald-400' : 'text-amber-400'}`}>{m.action.success ? '✓ Success' : '⚠ Needs help'}</p>
                        </div>
                      )}
                      <p className="text-[10px] opacity-60 mt-1.5">{m.time} {m.isQuestion && '• Question'}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="text-[11px] text-zinc-500 ml-2">Client is typing and doing action...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input — phone call style */}
              <div className="p-3 bg-zinc-900 border-t border-zinc-800">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder={activeCall.clientPersona === 'smb' ? "Talk in simple steps, no jargon..." : "Share facts: Sign-in logs CA tab, dsregcmd, Correlation ID..."}
                    className="flex-1 h-10 px-4 rounded-full bg-zinc-800 border border-zinc-700 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50"
                  />
                  <button onClick={sendMessage} disabled={!input.trim()} className="h-10 px-5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-[13px] font-semibold transition">
                    Send
                  </button>
                </div>
                <div className="flex gap-1.5 mt-2 overflow-x-auto">
                  {[
                    "Can you run dsregcmd /status and share output?",
                    "Can you open Company Portal and click Sync?",
                    "Can you check BitLocker status?",
                    "What does the error mean in simple words?",
                    "Can you check Sign-in logs CA tab?",
                  ].map(q => (
                    <button key={q} onClick={() => setInput(q)} className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-400 whitespace-nowrap transition">
                      {q.substring(0, 30)}...
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">Real-time phone call • Client does actions on other side • Asks questions back • Not robotic recording • Hold legit conversation</p>
              </div>
            </div>

            {/* Experts — add to conference */}
            {showExperts && (
              <div className="w-[280px] border-l border-zinc-800 bg-zinc-900 p-3">
                <h4 className="text-[12px] font-semibold text-zinc-200 mb-3">Add Tech Expert to Call</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Alex', specialty: 'Entra ID & CA', color: 'violet' },
                    { name: 'Priya', specialty: 'Intune & Compliance', color: 'emerald' },
                    { name: 'David', specialty: 'Exchange & Defender', color: 'blue' },
                  ].map(expert => (
                    <div key={expert.name} className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700">
                      <p className="text-[12px] font-medium text-zinc-200">{expert.name}</p>
                      <p className="text-[11px] text-zinc-500">{expert.specialty}</p>
                      <button onClick={() => addExpert(expert.name)} className="mt-2 w-full h-7 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium transition">
                        Add to Call — Conference
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-3">Conference with client + expert + you • Real collaboration • Different voices • Human feel</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
