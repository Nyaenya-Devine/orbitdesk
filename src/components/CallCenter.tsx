'use client';
import { useState, useEffect } from 'react';
import { Ticket } from '@/lib/ticketEngine';

interface Call {
  id: string;
  ticket: Ticket;
  clientName: string;
  userName: string;
  userEmail: string;
  status: 'incoming' | 'active' | 'on-hold' | 'ended';
  duration: number;
  transcript: { speaker: 'client' | 'you' | 'system'; text: string; time: string }[];
  sentiment: 'frustrated' | 'neutral' | 'calm';
}

interface Props {
  tickets: Ticket[];
  onAcceptCall: (ticket: Ticket) => void;
}

export default function CallCenter({ tickets, onAcceptCall }: Props) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<Ticket | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callInput, setCallInput] = useState('');

  // Simulate incoming calls for P1 tickets
  useEffect(() => {
    const p1Tickets = tickets.filter(t => t.priority === 'P1' && t.status === 'new');
    if (p1Tickets.length > 0 && !activeCall && !incomingCall && Math.random() < 0.3) {
      setIncomingCall(p1Tickets[0]);
      // Auto-play ringtone simulation via notification
    }
  }, [tickets, activeCall, incomingCall]);

  useEffect(() => {
    if (!activeCall || activeCall.status !== 'active') return;
    const timer = setInterval(() => {
      setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCall]);

  const acceptCall = () => {
    if (!incomingCall) return;
    const clientType = incomingCall.clientId;
    let initialTranscript: Call['transcript'] = [];
    let sentiment: Call['sentiment'] = 'frustrated';

    if (clientType === 'client-a') {
      // Enterprise tech - technical, formal, correlation IDs
      initialTranscript = [
        { speaker: 'system', text: `📞 Call connected with ${incomingCall.userEmail} • NovaTech Enterprises • 24/7 SLA 60min • Recording...`, time: '00:00' },
        { speaker: 'client', text: `Hi, this is ${incomingCall.userEmail.split('@')[0]} from Finance. We're blocked by Conditional Access policy, error 53000 DeviceNotCompliant. Correlation ID: ${Math.random().toString(36).substring(7)}-... I checked Service Health, it's green. Can you check Sign-in logs CA tab? We have payroll in 45 minutes, P1.`, time: '00:05' },
      ];
      sentiment = 'neutral';
    } else if (clientType === 'client-b') {
      // SMB non-tech - casual, friendly, emojis, simple
      initialTranscript = [
        { speaker: 'system', text: `📞 Call connected with ${incomingCall.userEmail} • Bloom & Co Studio • SMB • Recording...`, time: '00:00' },
        { speaker: 'client', text: `Heyy! 😅 It's ${incomingCall.userEmail.split('@')[0]} from Bloom. So my shared mailbox finance@bloomco.studio is not showing in Outlook? I can see it in webmail though, weird. I'm not super technical, can you help me in simple steps? I'm on a call with client in 20 mins!`, time: '00:06' },
      ];
      sentiment = 'frustrated';
    } else {
      // Regulated - formal, compliance, policy references
      initialTranscript = [
        { speaker: 'system', text: `📞 Call connected with ${incomingCall.userEmail} • Apex Financial Group • Regulated • Recording + Compliance log...`, time: '00:00' },
        { speaker: 'client', text: `Good morning, this is ${incomingCall.userEmail.split('@')[0]} from Risk & Compliance. Per policy SEC-2024-07, we require BitLocker compliance for all devices accessing financial data. My device shows Not Compliant, blocking Teams access. I need audit trail for this incident. Can you guide me through remediation and provide RCA?`, time: '00:08' },
      ];
      sentiment = 'calm';
    }

    setActiveCall({
      id: incomingCall.id,
      ticket: incomingCall,
      clientName: incomingCall.clientName,
      userName: incomingCall.userEmail.split('@')[0],
      userEmail: incomingCall.userEmail,
      status: 'active',
      duration: 0,
      transcript: initialTranscript,
      sentiment
    });
    setIncomingCall(null);
    onAcceptCall(incomingCall);
  };

  const declineCall = () => {
    setIncomingCall(null);
  };

  const sendCallMessage = () => {
    if (!callInput.trim() || !activeCall) return;
    
    const newTranscript = [
      ...activeCall.transcript,
      { speaker: 'you' as const, text: callInput, time: `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}` }
    ];

    // Simulate client response based on your message quality
    setTimeout(() => {
      let clientResponse = '';
      const lowerInput = callInput.toLowerCase();
      
      if (lowerInput.includes('sign-in logs') || lowerInput.includes('conditional access') || lowerInput.includes('message trace') || lowerInput.includes('intune') || lowerInput.includes('compliance')) {
        if (activeCall.ticket.clientId === 'client-a') {
          clientResponse = `Perfect, that's exactly what I needed - checking Sign-in logs CA tab. I see DeviceNotCompliant 53000, and Intune shows BitLocker failing. Should I enable BitLocker and sync Company Portal? What's ETA?`;
        } else if (activeCall.ticket.clientId === 'client-b') {
          clientResponse = `Ohh you checked logs! 😊 So it's not just my Outlook being weird? You said BitLocker? I don't know what that is, but if you guide me step by step I can do it. Like "Click Start → Settings → ..." ?`;
        } else {
          clientResponse = `Acknowledged. You've checked Sign-in logs and identified BitLocker non-compliance per policy SEC-2024-07. Please proceed with remediation and provide audit trail. I will need confirmation and documentation for compliance review.`;
        }
      } else if (lowerInput.includes('restart') || lowerInput.includes('reinstall') || lowerInput.includes('delete')) {
        clientResponse = activeCall.ticket.clientId === 'client-a' 
          ? `Wait, reinstall? That seems drastic without checking logs first. Can you confirm you checked Sign-in logs CA tab and Intune compliance? We need facts per your process.`
          : `Hmm reinstall sounds scary 😅 Is there a simpler fix? Like checking something first? I don't want to lose my files!`;
      } else {
        clientResponse = activeCall.ticket.clientId === 'client-a'
          ? `Can you be more specific? Which logs did you check? Sign-in logs? What did CA tab show? I need technical details for our IT team.`
          : `Sorry, I didn't quite understand that technical part. Can you explain like I'm 5? 😅 Like what should I click?`;
      }

      setActiveCall(prev => prev ? {
        ...prev,
        transcript: [...prev.transcript, { speaker: 'client', text: clientResponse, time: `${String(Math.floor(prev.duration / 60)).padStart(2,'0')}:${String(prev.duration % 60).padStart(2,'0')}` }]
      } : null);
    }, 1200 + Math.random() * 800);

    setActiveCall({ ...activeCall, transcript: newTranscript });
    setCallInput('');
  };

  const endCall = () => {
    if (!activeCall) return;
    setActiveCall({ ...activeCall, status: 'ended' });
    setTimeout(() => setActiveCall(null), 2000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  return (
    <>
      {/* Incoming Call Modal - Like Intercom + CloudTalk */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-3xl">📞</span>
              </div>
              <h3 className="font-bold text-lg">Incoming Call - {incomingCall.priority}</h3>
              <p className="text-sm opacity-90 mt-1">{incomingCall.clientName}</p>
              <p className="text-xs opacity-75 mt-1">{incomingCall.userEmail} • {incomingCall.title}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                SLA: {Math.floor(incomingCall.timeLeftMs/60000)}m left
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-50 rounded-xl p-3 text-sm mb-4">
                <div className="font-medium text-slate-900">"{incomingCall.userMessage}"</div>
                <div className="text-xs text-slate-500 mt-2 flex gap-2">
                  <span className="bg-slate-200 px-2 py-1 rounded-full">{incomingCall.code}</span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">{incomingCall.priority} • Live help needed</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={declineCall}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-full font-medium text-sm flex items-center justify-center gap-2"
                >
                  <span>✕</span> Decline
                </button>
                <button
                  onClick={acceptCall}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                >
                  <span>✓</span> Accept - Live Help
                </button>
              </div>

              <div className="text-[11px] text-slate-500 text-center mt-3">
                Client expects human, not AI • Prioritize listener • Focus on facts
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Bar - Like Superhuman + Linear */}
      {activeCall && activeCall.status === 'active' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-slate-900 rounded-[20px] shadow-2xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {activeCall.userName[0].toUpperCase()}
              </div>
              <div>
                <div className="text-white font-medium text-sm flex items-center gap-2">
                  {activeCall.userName} • {activeCall.clientName}
                  <span className={`w-2 h-2 rounded-full ${activeCall.sentiment === 'frustrated' ? 'bg-red-500' : activeCall.sentiment === 'calm' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></span>
                </div>
                <div className="text-xs text-slate-400">{activeCall.ticket.code} • {formatDuration(activeCall.duration)} • {isMuted ? 'Muted' : 'Live'} {isOnHold ? '• On Hold' : ''}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {isMuted ? '🔇' : '🎙️'}
              </button>
              <button
                onClick={() => setIsOnHold(!isOnHold)}
                className={`w-9 h-9 rounded-full flex items-center justify-center ${isOnHold ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                ⏸️
              </button>
              <button
                onClick={endCall}
                className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center"
              >
                📞
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-3 space-y-2 bg-slate-900">
            {activeCall.transcript.map((t, i) => (
              <div key={i} className={`flex ${t.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${t.speaker === 'you' ? 'bg-violet-600 text-white rounded-br-sm' : t.speaker === 'client' ? 'bg-slate-800 text-slate-100 rounded-bl-sm' : 'bg-amber-900/30 text-amber-200 text-xs'}`}>
                  <div>{t.text}</div>
                  <div className={`text-[10px] mt-1 ${t.speaker === 'you' ? 'text-violet-200' : 'text-slate-500'}`}>{t.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-800/50 flex gap-2">
            <input
              value={callInput}
              onChange={e => setCallInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendCallMessage()}
              placeholder={activeCall.ticket.clientId === 'client-b' ? "Explain in simple steps, no jargon..." : "Share facts: Sign-in logs CA tab, dsregcmd, Correlation ID..."}
              className="flex-1 bg-slate-700 text-white placeholder:text-slate-400 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={sendCallMessage}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-sm font-bold"
            >
              Send
            </button>
          </div>

          <div className="px-4 py-2 bg-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>💡 {activeCall.ticket.clientId === 'client-b' ? 'Bloom & Co: Use simple language, emojis, step-by-step' : activeCall.ticket.clientId === 'client-a' ? 'NovaTech: Share Correlation ID, CA tab, technical RCA' : 'Apex: Provide audit trail, policy reference, compliance proof'}</span>
            <span>🎙️ {isMuted ? 'Muted' : 'Live'} • Press Enter to send</span>
          </div>
        </div>
      )}
    </>
  );
}
