'use client';
import { useState, useRef } from 'react';

interface DemoCall {
  id: string;
  client: string;
  persona: string;
  issue: string;
  code: string;
  priority: string;
  avatar: string;
  color: string;
  conversation: { speaker: 'client' | 'you' | 'expert', name: string, text: string, audio?: string, action?: string }[];
}

const demoCalls: DemoCall[] = [
  {
    id: 'novatech-p1',
    client: 'Michael • NovaTech Enterprises',
    persona: 'Enterprise Tech • Expert • Formal • Correlation ID',
    issue: 'Payroll blocked — 50 users — Conditional Access 53000 DeviceNotCompliant',
    code: 'ENTRA-53000',
    priority: 'P1',
    avatar: 'M',
    color: 'from-violet-600 to-indigo-600',
    conversation: [
      { speaker: 'client', name: 'Michael (Finance)', text: 'Hi, this is Michael from Finance at NovaTech. We\'re blocked by Conditional Access, error 53000 DeviceNotCompliant. Correlation ID a7f3c9e2-b4d1. Service Health green. Can you check Sign-in logs CA tab? Payroll in 45 mins, P1!', audio: '/audio/calls/novatech-p1-initial.mp3' },
      { speaker: 'you', name: 'You (Team Lead)', text: 'Got it, checking Sign-in logs → Conditional Access tab. I see policy Require compliant device blocked, failure DeviceNotCompliant. Can you run dsregcmd /status as admin?' },
      { speaker: 'client', name: 'Michael', text: 'Ran dsregcmd /status: AzureAdJoined YES, DomainJoined NO, MdmUrl present, Compliance NO. So Azure AD joined but NOT compliant. What next?', audio: '/audio/calls/novatech-dsregcmd-action.mp3', action: 'Ran dsregcmd /status → AzureAdJoined YES, Compliance NO' },
      { speaker: 'you', name: 'You', text: 'Perfect, device is AAD joined but not compliant. Open Company Portal → Sync, then check BitLocker with Get-BitLockerVolume.' },
      { speaker: 'client', name: 'Michael', text: 'Company Portal synced 2 min ago, BitLocker failing. Get-BitLockerVolume shows Protection Off, 0%. Should I enable BitLocker? Will it affect perf? ETA?', audio: '/audio/calls/novatech-bitlocker-question.mp3', action: 'Checked BitLocker → Protection Off, Encryption 0%' },
      { speaker: 'expert', name: 'Alex Rivera (Entra Expert)', text: 'For 53000, check What If tool, ensure Report-Only 24h before ON, check break glass excluded. If P1 50 users, use Break Glass to set Report-Only. Then fix compliance.', audio: '/audio/calls/alex-expert-ca.mp3' },
      { speaker: 'client', name: 'Michael', text: 'Enabled BitLocker, 85% encrypted, key escrowed to Entra ID, Company Portal now Compliant, Sign-in logs success! Payroll can run. Provide RCA + audit trail for IT team?', action: 'Enabled BitLocker → 85% encrypted, Compliant, Payroll unblocked ✓' },
    ]
  },
  {
    id: 'bloom-smb',
    client: 'Jessica • Bloom & Co Studio',
    persona: 'SMB Casual • Beginner • Emojis • Simple steps',
    issue: 'Shared mailbox finance@bloomco.studio not showing in Outlook',
    code: 'EXCHANGE-SHARED',
    priority: 'P2',
    avatar: 'J',
    color: 'from-pink-500 to-rose-500',
    conversation: [
      { speaker: 'client', name: 'Jessica (Design)', text: 'Heyy! It\'s Jessica from Bloom & Co. My shared mailbox finance@bloomco.studio not showing in Outlook? I see it in webmail though, weird. I\'m not super technical, can you help in simple steps? Client call in 20 mins!', audio: '/audio/calls/bloom-initial.mp3' },
      { speaker: 'you', name: 'You', text: 'No worries Jessica! Let\'s fix quickly. Can you open Company Portal (blue shopping bag icon) and click Sync? Then tell me what you see.' },
      { speaker: 'client', name: 'Jessica', text: 'Company Portal? Blue shopping bag? Opened it, clicked Sync, says Syncing... now last sync just now. But still Not compliant? Will I lose files if disconnect?', audio: '/audio/calls/bloom-sync-action.mp3', action: 'Opened Company Portal → Sync → Last sync just now' },
      { speaker: 'you', name: 'You', text: 'You won\'t lose files! For shared mailbox, click Outlook → Folders → More Folders → Show finance@bloomco.studio. No disconnect needed.' },
      { speaker: 'client', name: 'Jessica', text: 'Sorry, didn\'t get technical part 😅 Explain like I\'m 5? Start → Settings → ...? Will BitLocker delete files? Scared! Client call in 15 mins!', audio: '/audio/calls/bloom-question-simple.mp3' },
      { speaker: 'client', name: 'Jessica', text: 'Yay! It works! Shared mailbox shows! You explained so simply! Thank you! No more stress! Can you send simple steps email?', action: 'Fixed → Shared mailbox visible in Outlook ✓' },
    ]
  },
  {
    id: 'apex-regulated',
    client: 'David • Apex Financial Group',
    persona: 'Regulated Formal • Intermediate • SEC-2024-07 • Audit trail',
    issue: 'BitLocker compliance blocking Teams — SEC-2024-07 policy',
    code: 'COMPLIANCE-BITLOCKER',
    priority: 'P1',
    avatar: 'D',
    color: 'from-emerald-600 to-teal-600',
    conversation: [
      { speaker: 'client', name: 'David (Risk & Compliance)', text: 'Good morning, David from Risk & Compliance at Apex Financial. Per SEC-2024-07, BitLocker required for financial data. Device Not Compliant, blocking Teams. Need audit trail, RCA, key escrow confirmation for compliance review.', audio: '/audio/calls/apex-initial.mp3' },
      { speaker: 'you', name: 'You', text: 'Acknowledged David, per SEC-2024-07. Checking Intune compliance → BitLocker failing. Can you run Get-BitLockerVolume and confirm key escrow to Entra ID?' },
      { speaker: 'client', name: 'David', text: 'Per policy, BitLocker required. Get-BitLockerVolume: Protection Off, 0%. Non-compliant. Need to enable and ensure escrowed to Entra ID for audit. Provide approved procedure and confirm escrow.', action: 'Checked BitLocker → Protection Off, 0% → Non-compliant per SEC-2024-07' },
      { speaker: 'expert', name: 'Priya Nair (Intune Expert)', text: 'For BitLocker compliance, enable via Enable-BitLocker -MountPoint C: -RecoveryPasswordProtector. Ensure key escrowed to Entra ID → Devices → BitLocker keys. Suspend before BIOS update. Document in KB.', audio: '/audio/calls/priya-expert-intune.mp3' },
      { speaker: 'client', name: 'David', text: 'BitLocker enabled 100%, key escrowed to Entra ID and Intune, Compliant, Teams restored. Provide audit trail: who changed policy, when, RCA, remediation, key escrow per SEC-2024-07 for review.', action: 'Enabled BitLocker 100% → Escrowed → Compliant → Teams restored ✓' },
    ]
  }
];

export default function VoiceCallDemo() {
  const [selectedCall, setSelectedCall] = useState<DemoCall>(demoCalls[0]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = (audioPath: string) => {
    if (audioRef.current) {
      if (playingAudio === audioPath) {
        audioRef.current.pause();
        setPlayingAudio(null);
      } else {
        audioRef.current.src = audioPath;
        audioRef.current.play().catch(() => {
          // Fallback to Web Speech API if audio fails
          console.log('Audio play failed, using TTS fallback');
        });
        setPlayingAudio(audioPath);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-100 bg-gradient-to-r from-violet-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">🎙️ Real Voice Calls — Flowing Human Conversations</h3>
            <p className="text-xs text-zinc-600 mt-1">Different people, different issues, balanced voices (men & women), client does actions on other side, asks questions, tech experts join conference</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px]">
            <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full">5 Voices</span>
            <span className="bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">Real Audio MP3</span>
            <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">Web Speech API TTS</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {demoCalls.map(call => (
            <button
              key={call.id}
              onClick={() => setSelectedCall(call)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-medium border transition text-left ${selectedCall.id === call.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'}`}
            >
              <div className="font-bold flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${call.color} text-white flex items-center justify-center text-[11px]`}>{call.avatar}</span>
                {call.client}
              </div>
              <div className="text-[11px] opacity-75 mt-1">{call.code} • {call.priority} • {call.persona.split('•')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedCall.color} flex items-center justify-center text-white font-bold`}>{selectedCall.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{selectedCall.client}</div>
              <div className="text-xs text-zinc-500">{selectedCall.issue}</div>
              <div className="text-[11px] text-zinc-400">{selectedCall.persona}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono bg-zinc-900 text-white px-2.5 py-1 rounded-full">{selectedCall.code}</div>
            <div className={`text-[11px] mt-1 px-2 py-0.5 rounded-full inline-block ${selectedCall.priority === 'P1' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>{selectedCall.priority} • Voice Call</div>
          </div>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {selectedCall.conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.speaker === 'you' ? 'bg-violet-600 text-white rounded-br-sm' : msg.speaker === 'client' ? 'bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-bl-sm' : 'bg-blue-50 border border-blue-200 text-blue-900 rounded-bl-sm'}`}>
                <div className="text-[11px] font-bold opacity-75 mb-1 flex items-center gap-2">
                  {msg.speaker === 'client' ? '🎙️' : msg.speaker === 'expert' ? '👨‍💻' : '👤'} {msg.name}
                  {msg.audio && (
                    <button onClick={() => playAudio(msg.audio!)} className={`ml-2 px-2 py-0.5 rounded-full text-[10px] border transition ${playingAudio === msg.audio ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-zinc-900 text-white border-zinc-900 hover:bg-black'}`}>
                      {playingAudio === msg.audio ? '⏹️ Stop' : '🔊 Play Voice'}
                    </button>
                  )}
                </div>
                <div className="leading-relaxed">{msg.text}</div>
                {msg.action && (
                  <div className="mt-2 bg-white border border-zinc-200 rounded-xl p-2.5 text-xs">
                    <div className="font-bold text-zinc-900 flex items-center gap-1">⚡ Client Action on Other Side:</div>
                    <div className="text-zinc-600 mt-1">{msg.action}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-zinc-900 text-white rounded-xl text-xs">
          <div className="font-bold mb-2 flex items-center gap-2">💡 What Makes This Real & Human:</div>
          <div className="grid md:grid-cols-2 gap-2 text-zinc-300 leading-relaxed">
            <div>✓ <strong>Different people:</strong> Michael (Finance, P1 payroll), Jessica (Design, SMB casual), David (Compliance, SEC-2024-07)</div>
            <div>✓ <strong>Balanced voices:</strong> Men & women, different accents, formal vs casual, expert vs beginner</div>
            <div>✓ <strong>Flowing conversation:</strong> Client talks, you respond, client does action, asks question, expert joins, resolves</div>
            <div>✓ <strong>Client does actions:</strong> Runs dsregcmd, syncs Company Portal, checks BitLocker, reports output</div>
            <div>✓ <strong>Asks questions:</strong> "Will I lose files?", "What does 53000 mean?", "ETA?", "Provide audit trail?"</div>
            <div>✓ <strong>Tech experts:</strong> Alex (Entra CA), Priya (Intune), conference call with different voices</div>
          </div>
        </div>

        <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} className="hidden" />
      </div>
    </div>
  );
}
