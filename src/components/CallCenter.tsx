'use client';
import { useState, useEffect, useRef } from 'react';
import { Ticket } from '@/lib/ticketEngine';
import { agents } from '@/data/agents';

interface CallMessage {
  id: string;
  speaker: 'client' | 'you' | 'system' | 'expert';
  expertName?: string;
  text: string;
  time: string;
  audioUrl?: string;
  action?: ClientAction;
  isQuestion?: boolean;
}

interface ClientAction {
  type: 'ran_command' | 'checked_setting' | 'clicked' | 'restarted' | 'confirmed';
  description: string;
  output?: string;
  success: boolean;
}

interface Call {
  id: string;
  ticket: Ticket;
  clientName: string;
  userName: string;
  userEmail: string;
  status: 'incoming' | 'active' | 'on-hold' | 'ended';
  duration: number;
  transcript: CallMessage[];
  sentiment: 'frustrated' | 'neutral' | 'calm' | 'happy';
  clientPersona: ClientPersona;
  expertsInCall: string[];
  isRecording: boolean;
  isClientTyping: boolean;
  isClientSpeaking: boolean;
}

interface ClientPersona {
  type: 'enterprise-tech' | 'smb-casual' | 'regulated-formal';
  name: string;
  knowledgeLevel: 'expert' | 'intermediate' | 'beginner';
  voicePref: 'male-formal' | 'female-friendly' | 'male-deep';
  traits: string[];
  canDoActions: string[];
}

interface TechExpert {
  id: string;
  name: string;
  specialty: string;
  skills: string[];
  voice: string;
  availability: 'available' | 'busy' | 'on-call';
  personality: string;
}

const techExperts: TechExpert[] = [
  { id: 'alex', name: 'Alex Rivera', specialty: 'Entra ID & Conditional Access', skills: ['Entra ID', 'CA Policies', 'Sign-in Logs', 'What If', 'Report-Only'], availability: 'available', voice: 'male-formal', personality: 'Direct, technical, says correlation ID, checks audit logs first' },
  { id: 'priya', name: 'Priya Nair', specialty: 'Intune & Device Compliance', skills: ['Intune', 'Compliance Policies', 'dsregcmd', 'BitLocker', 'Autopilot'], availability: 'available', voice: 'female-friendly', personality: 'Patient mentor, explains step-by-step, pairs with juniors' },
  { id: 'lisa', name: 'Lisa Chen', specialty: 'Teams & M365', skills: ['Teams', 'SharePoint', 'OneDrive', 'M365 Groups'], availability: 'on-call', voice: 'female-friendly', personality: 'Empathetic, non-technical language expert, great with SMB' },
  { id: 'david', name: 'David Okafor', specialty: 'Exchange & Defender', skills: ['Exchange', 'Message Trace', 'Quarantine', 'Defender', 'DLP'], availability: 'available', voice: 'male-deep', personality: 'Calm under pressure, security-focused, audit trail mindset' },
  { id: 'ms-support', name: 'Microsoft Support', specialty: 'Escalation Engineer', skills: ['Escalation', 'Backend Logs', 'Service Health', 'Break Glass'], availability: 'busy', voice: 'male-formal', personality: 'Formal, asks for Correlation ID, Tenant ID, provides KB links' },
];

interface Props {
  tickets: Ticket[];
  onAcceptCall: (ticket: Ticket) => void;
}

// Knowledge base for common worker
const commonWorkerKnowledge: Record<string, { explanation: string, steps: string[], clientCanDo: string, questionsClientMightAsk: string[] }> = {
  '53000': {
    explanation: 'DeviceNotCompliant - Blocked by Conditional Access because device is not compliant in Intune. Usually BitLocker, Defender, OS version, Secure Boot, or PIN missing.',
    steps: ['Check Sign-in logs → Conditional Access tab → Shows which policy blocked', 'Check Intune → Device compliance → See which compliance check failed', 'Use What If tool to test policy', 'Fix compliance (enable BitLocker, update Defender, etc.)', 'Company Portal → Sync'],
    clientCanDo: 'Check Company Portal, run dsregcmd /status, check BitLocker status, sync device',
    questionsClientMightAsk: ['What does DeviceNotCompliant mean?', 'Will enabling BitLocker delete my files?', 'How long after fix will it work?', 'Is this affecting everyone?']
  },
  '0x80180024': {
    explanation: 'Stale enrollment - Old device record blocks new enrollment. MdmUrl still present from old enrollment.',
    steps: ['Settings → Access work or school → Disconnect old account', 'dsregcmd /leave', 'Delete stale device in Entra ID', 'Re-enroll via Company Portal'],
    clientCanDo: 'Go to Settings → Access work or school, disconnect, restart, check dsregcmd',
    questionsClientMightAsk: ['Will disconnecting delete my files?', 'Why is there old device record?', 'Do I need admin rights?']
  },
  'quarantine': {
    explanation: 'Email quarantined by Defender - Anti-spam or Anti-phish policy flagged as Bulk or High confidence phish. Often false positive for invoices.',
    steps: ['Message Trace → Shows Quarantined', 'Quarantine portal → See reason (Bulk/Phish)', 'Release + Allow Sender + Report as Not Junk', 'Add to allowed senders with approval'],
    clientCanDo: 'Check Junk folder, check Quarantine portal if access, confirm sender is legit',
    questionsClientMightAsk: ['Is this email safe to release?', 'Will allowing sender affect security?', 'Why was legit invoice flagged?']
  },
  'bitlocker': {
    explanation: 'BitLocker recovery key prompt after BIOS update - Key escrowed to Entra ID and Intune.',
    steps: ['Get key from Entra ID → Devices → BitLocker keys or Intune → Recovery keys', 'Enter key', 'Suspend BitLocker before BIOS update next time', 'Verify key escrowed'],
    clientCanDo: 'Enter recovery key, check BitLocker status with Get-BitLockerVolume',
    questionsClientMightAsk: ['Where do I find recovery key?', 'Will I lose data?', 'Why did this happen after update?']
  },
  'autopilot': {
    explanation: 'Autopilot TPM attestation failed - Device not registered in Autopilot or TPM issue.',
    steps: ['Check Intune → Autopilot devices → Is device registered?', 'Check TPM: tpm.msc', 'Clear TPM if needed', 'Re-register with hardware hash'],
    clientCanDo: 'Check if device shows in Company Portal, restart, check TPM',
    questionsClientMightAsk: ['Is this new device?', 'Did we register it in Autopilot?', 'Do I need to wipe?']
  }
};

export default function CallCenter({ tickets, onAcceptCall }: Props) {
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<Ticket | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [callInput, setCallInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showExperts, setShowExperts] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
        // Select best voice per persona later
        setSelectedVoice(voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices[0]);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Auto scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [activeCall?.transcript]);

  // Simulate incoming calls for P1 + random
  useEffect(() => {
    const interval = setInterval(() => {
      const p1Tickets = tickets.filter(t => t.priority === 'P1' && t.status !== 'resolved');
      const anyTickets = tickets.filter(t => t.status !== 'resolved');
      const pool = p1Tickets.length > 0 ? p1Tickets : anyTickets;
      if (pool.length > 0 && !activeCall && !incomingCall && Math.random() < 0.15) {
        const ticket = pool[Math.floor(Math.random() * pool.length)];
        setIncomingCall(ticket);
        // Play ringtone
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
          // Fallback: use Web Audio API beep
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.1;
          osc.start();
          setTimeout(() => osc.stop(), 500);
        } catch {}
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [tickets, activeCall, incomingCall]);

  // Call timer
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'active' || isOnHold) return;
    const timer = setInterval(() => {
      setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCall, isOnHold]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCallInput(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const speakText = (text: string, persona?: ClientPersona, isExpert?: boolean, expertId?: string) => {
    if (!isSpeakerOn || isMuted) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select voice based on persona
    let voice = selectedVoice;
    if (persona) {
      if (persona.voicePref === 'male-formal') {
        voice = availableVoices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('David') || v.name.includes('Mark')) || availableVoices.find(v => v.lang.startsWith('en')) || null;
      } else if (persona.voicePref === 'female-friendly') {
        voice = availableVoices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Zira')) || availableVoices.find(v => v.lang.startsWith('en')) || null;
      } else {
        voice = availableVoices.find(v => v.name.includes('Google UK English Male') || v.name.toLowerCase().includes('male')) || availableVoices[0] || null;
      }
    }
    if (isExpert && expertId) {
      const expert = techExperts.find(e => e.id === expertId);
      if (expert?.voice === 'female-friendly') {
        voice = availableVoices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha')) || voice;
      }
    }

    if (voice) utterance.voice = voice;
    utterance.rate = persona?.type === 'smb-casual' ? 1.1 : persona?.type === 'regulated-formal' ? 0.9 : 1.0;
    utterance.pitch = persona?.voicePref === 'female-friendly' ? 1.1 : persona?.voicePref === 'male-deep' ? 0.8 : 1.0;
    utterance.volume = 0.9;

    // Visual speaking indicator
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isClientSpeaking: true } : null);
      utterance.onend = () => {
        setActiveCall(prev => prev ? { ...prev, isClientSpeaking: false } : null);
      };
    }

    window.speechSynthesis.speak(utterance);
  };

  const getClientPersona = (ticket: Ticket): ClientPersona => {
    if (ticket.clientId === 'client-a') {
      return {
        type: 'enterprise-tech',
        name: 'NovaTech Enterprises',
        knowledgeLevel: 'expert',
        voicePref: 'male-formal',
        traits: ['Technical', 'Knows Correlation ID', 'Checks Service Health first', 'Formal', 'Understands CA, Intune, logs'],
        canDoActions: ['Run dsregcmd /status', 'Check Company Portal Sync', 'Get-BitLockerVolume', 'Check Sign-in logs', 'Run ipconfig', 'Check Event Viewer']
      };
    } else if (ticket.clientId === 'client-b') {
      return {
        type: 'smb-casual',
        name: 'Bloom & Co Studio',
        knowledgeLevel: 'beginner',
        voicePref: 'female-friendly',
        traits: ['Casual', 'Emojis', 'Non-technical', 'Needs simple steps', 'Friendly', 'Visual learner'],
        canDoActions: ['Open Settings', 'Click Start menu', 'Open Outlook', 'Restart computer', 'Check if app is open']
      };
    } else {
      return {
        type: 'regulated-formal',
        name: 'Apex Financial Group',
        knowledgeLevel: 'intermediate',
        voicePref: 'male-deep',
        traits: ['Formal', 'Compliance-focused', 'Needs audit trail', 'References policies', 'SEC-2024-07', 'Risk-aware'],
        canDoActions: ['Check compliance portal', 'Provide audit logs', 'Confirm BitLocker status', 'Check DLP policy', 'Document steps']
      };
    }
  };

  const generateClientResponse = (userMessage: string, ticket: Ticket, persona: ClientPersona, history: CallMessage[]): { text: string, action?: ClientAction, isQuestion?: boolean, sentimentChange?: Call['sentiment'] } => {
    const lower = userMessage.toLowerCase();
    const code = ticket.code.toLowerCase();
    const knowledge = commonWorkerKnowledge[ticket.code] || commonWorkerKnowledge[Object.keys(commonWorkerKnowledge).find(k => code.includes(k) || lower.includes(k)) || '53000'];

    // Client does action when asked
    if (lower.includes('dsregcmd') || lower.includes('dsreg') || lower.includes('status')) {
      if (persona.type === 'enterprise-tech') {
        return {
          text: `Got it, I ran dsregcmd /status on my machine. Here's output: AzureAdJoined: YES, EnterpriseJoined: NO, DomainJoined: NO, DeviceId: ${Math.random().toString(36).substring(7)}-... MdmUrl: https://enrollment.manage.microsoft.com/enrollmentserver/discovery.svc, MdmTouUrl: https://portal.manage.microsoft.com/TermsofUse.aspx, Compliance: NO, Compliant: NO, Previous Compliance: NO. So device is Azure AD joined but NOT compliant. What next?`,
          action: { type: 'ran_command', description: 'Ran dsregcmd /status', output: 'AzureAdJoined YES, Compliance NO, MdmUrl present', success: true },
          sentimentChange: 'neutral'
        };
      } else if (persona.type === 'smb-casual') {
        return {
          text: `Um, dsregcmd? 😅 Where do I type that? Is it in Start menu? Oh wait, you mean open Command Prompt? Okay I did... it shows a lot of text, says AzureAdJoined YES, but Compliance NO. Does that mean something is wrong? Can you explain like I'm 5?`,
          action: { type: 'ran_command', description: 'Tried to run dsregcmd, needs guidance', output: 'AzureAdJoined YES, Compliance NO - confused', success: false },
          isQuestion: true
        };
      } else {
        return {
          text: `Acknowledged. I executed dsregcmd /status per your instruction. Output: AzureAdJoined YES, Compliance NO, MdmUrl present. Per policy SEC-2024-07, device must be compliant. Please advise remediation and provide audit trail for compliance review. Should I also capture logs?`,
          action: { type: 'ran_command', description: 'Ran dsregcmd /status, captured output for audit', output: 'AzureAdJoined YES, Compliance NO', success: true }
        };
      }
    }

    if (lower.includes('company portal') || lower.includes('sync') || lower.includes('intune')) {
      if (persona.type === 'enterprise-tech') {
        return {
          text: `I opened Company Portal, clicked Devices → my device → Check compliance and Sync. It says Syncing... now Last sync: 2 minutes ago, Compliance state: Not compliant, BitLocker: Not compliant, Secure Boot: Compliant, OS version: Compliant. So only BitLocker failing. Should I enable BitLocker? I have admin rights.`,
          action: { type: 'clicked', description: 'Opened Company Portal → Sync', output: 'Last sync 2 min ago, BitLocker Not Compliant', success: true }
        };
      } else {
        return {
          text: `Company Portal? Is that the blue icon with shopping bag? 😅 Okay I opened it, I see my device, I clicked Sync... it spins and says Syncing... okay now it says last sync just now. But still shows Not compliant? What does that mean? Do I need to click something else?`,
          action: { type: 'clicked', description: 'Opened Company Portal and synced', output: 'Synced but still Not compliant - needs help', success: false },
          isQuestion: true
        };
      }
    }

    if (lower.includes('bitlocker') || lower.includes('get-bitlockervolume')) {
      return {
        text: persona.type === 'enterprise-tech'
          ? `I ran Get-BitLockerVolume -MountPoint C: in PowerShell as admin. Output: VolumeType OS, MountPoint C:, Capacity 237GB, VolumeStatus FullyDecrypted, EncryptionPercentage 0, KeyProtector: none, ProtectionStatus Off. So BitLocker is OFF, that's why compliance fails. Should I run Enable-BitLocker -MountPoint C: -RecoveryPasswordProtector? Will it encrypt now and affect performance?`
          : persona.type === 'smb-casual'
          ? `BitLocker? 😬 Is that encryption thing? I went to Settings → Privacy & security → Device encryption, it says Device encryption is off. Should I turn it on? Will it delete my files? I'm scared!`
          : `Per SEC-2024-07, BitLocker is required. I checked Get-BitLockerVolume: ProtectionStatus Off, Encryption 0%. Device is non-compliant per policy. I need to enable BitLocker and ensure key is escrowed to Entra ID for audit. Please provide approved procedure and confirm key escrow.`,
        action: { type: 'checked_setting', description: 'Checked BitLocker status', output: 'Protection Off, Encryption 0%', success: false }
      };
    }

    if (lower.includes('sign-in logs') || lower.includes('conditional access') || lower.includes('ca tab') || lower.includes('what if')) {
      if (persona.type === 'enterprise-tech') {
        return {
          text: `Perfect, you checked Sign-in logs → Conditional Access tab. I also checked on my side: Sign-in logs show Failure, CA policy 'Require compliant device for M365' applied, Result: Failure, DeviceNotCompliant 53000. What If tool shows same policy would block. So root cause is BitLocker non-compliance. What's ETA for fix? We have payroll in 45 mins, P1.`,
          sentimentChange: 'calm'
        };
      } else if (persona.type === 'smb-casual') {
        return {
          text: `Oh you checked logs! So it's not my Outlook being weird? 😊 You found something? Conditional Access? What does that mean in simple words? Is it like a security gate that blocks me because my device is not safe?`,
          isQuestion: true,
          sentimentChange: 'neutral'
        };
      } else {
        return {
          text: `Acknowledged. Sign-in logs CA tab shows BlockedByConditionalAccess 53000 DeviceNotCompliant per policy 'Require compliant device'. This aligns with SEC-2024-07. Please proceed with remediation, provide RCA, and ensure audit trail is captured in Entra Audit logs for compliance review.`,
          sentimentChange: 'calm'
        };
      }
    }

    if (lower.includes('quarantine') || lower.includes('message trace') || lower.includes('release')) {
      return {
        text: persona.type === 'enterprise-tech'
          ? `I checked Message Trace in Exchange admin, it shows email from vendor@invoices.com was Quarantined, Reason: Bulk, Confidence: High. I also checked Quarantine portal, it's there. Should I Release + Allow Sender + Report as Not Junk to train filter? Is sender legit per finance?`
          : `Message trace? 😅 Where is that? In Outlook? I checked my Junk folder, not there. Oh quarantine portal? I don't have access. Can you release it from your side? It's invoice from vendor, finance needs to pay today!`,
        action: { type: 'checked_setting', description: 'Checked Message Trace', output: 'Quarantined, Bulk, High confidence', success: true }
      };
    }

    if (lower.includes('restart') || lower.includes('reboot') || lower.includes('reinstall')) {
      return {
        text: persona.type === 'enterprise-tech'
          ? `Wait, restart/reinstall seems drastic without checking logs first. Per our process, we should check Service Health, Sign-in logs CA tab, Intune compliance first. Can you confirm you checked those? We need facts, not guessing. What's RCA?`
          : persona.type === 'smb-casual'
          ? `Restart? 😬 Will I lose my unsaved work? I have Photoshop open with client design! Is there way without restart? Can we try simple fix first? Like checking something?`
          : `Restart/reinstall requires change approval per SEC-2024-07. Please confirm root cause via logs first and provide audit trail. Is restart approved procedure for this error?`,
        isQuestion: true,
        sentimentChange: 'frustrated'
      };
    }

    if (lower.includes('what does') || lower.includes('explain') || lower.includes('mean')) {
      return {
        text: knowledge ? `${knowledge.explanation} For your case ${ticket.code}, client can do: ${knowledge.clientCanDo}. Steps: ${knowledge.steps.slice(0,3).join(', ')}. Want me to try any of those?` : `I don't fully understand this error, can you explain in ${persona.type === 'smb-casual' ? 'simple steps with clicks' : persona.type === 'enterprise-tech' ? 'technical details with correlation ID and logs' : 'formal RCA with audit trail and policy reference'}?`,
        isQuestion: false
      };
    }

    // Default responses with questions
    const questions = knowledge?.questionsClientMightAsk || ['What is ETA?', 'Will I lose data?', 'Is this affecting everyone?', 'What should I do next?'];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    if (persona.type === 'enterprise-tech') {
      return {
        text: `Can you be more specific? Which logs did you check? Sign-in logs CA tab? Intune compliance? What did What If show? Correlation ID is ${Math.random().toString(36).substring(7)}. I need technical RCA for our IT team. Also ${randomQuestion}`,
        isQuestion: true
      };
    } else if (persona.type === 'smb-casual') {
      return {
        text: `Sorry, I didn't quite get that technical part 😅 Can you explain like I'm 5? Like what should I click? Start → Settings → ...? Also ${randomQuestion} I have client call in 20 mins!`,
        isQuestion: true
      };
    } else {
      return {
        text: `Please clarify with audit trail. Per SEC-2024-07, we need documented RCA, remediation steps, and confirmation. ${randomQuestion} Please provide for compliance review.`,
        isQuestion: true
      };
    }
  };

  const generateExpertResponse = (expertId: string, userMessage: string, ticket: Ticket): string => {
    const expert = techExperts.find(e => e.id === expertId);
    if (!expert) return "Expert not found";

    const lower = userMessage.toLowerCase();

    if (expertId === 'alex') {
      if (lower.includes('53000') || lower.includes('conditional access') || lower.includes('ca')) {
        return `For 53000 DeviceNotCompliant, here's expert process: 1) Entra → Sign-in logs → Find user → Conditional Access tab → See which policy blocked + failure reason. 2) Use What If tool → Simulate user + device + app → Confirm policy. 3) Check if policy was pushed without Report-Only - audit logs show who pushed at 08:02. 4) If P1 50 users blocked, use Break Glass account excluded from CA to disable policy or set to Report-Only. 5) Then fix compliance. Never push CA without Report-Only 24h. Also check break glass excluded.`;
      }
      return `Alex here - Entra expert. ${ticket.code} - Check Sign-in logs first, then CA tab, then Audit logs for who changed policy. For ${ticket.title}, look for Correlation ID and use What If. Need Tenant ID? I can guide.`;
    }

    if (expertId === 'priya') {
      if (lower.includes('0x80180024') || lower.includes('enrollment') || lower.includes('stale') || lower.includes('dsregcmd')) {
        return `Priya here - Intune expert. 0x80180024 is stale enrollment: old MDM record blocks new. Steps: 1) Client: Settings → Access work or school → Disconnect old. 2) Run dsregcmd /leave as admin. 3) Entra → Devices → Delete stale device. 4) Intune → Devices → Clean enrollment failures. 5) Client re-enroll via Company Portal. Also check device cap - default 5, raise to 10 if needed. For recurring 22 tickets/week, create Problem ticket + PowerShell auto-cleanup script. Pair junior with shadowing 2 tickets/day.`;
      }
      if (lower.includes('bitlocker') || lower.includes('compliance')) {
        return `BitLocker compliance - Check Intune → Device compliance → Policy → See which check fails. Then client: Get-BitLockerVolume. If Protection Off, enable via Enable-BitLocker -MountPoint C: -RecoveryPasswordProtector. Ensure key escrowed to Entra ID → Devices → BitLocker keys. Also suspend BitLocker before BIOS update. Document in KB: How to retrieve key.`;
      }
      return `Priya here - For ${ticket.code}, check Intune compliance drill-down, dsregcmd /status, Company Portal sync. I can mentor junior on this. Want me to join call with client?`;
    }

    if (expertId === 'lisa') {
      return `Lisa here - Teams/M365 expert. For non-tech clients like Bloom, use simple language: "Click Start → Settings → ..." not "Run dsregcmd". Visual guide: "Blue icon with shopping bag = Company Portal". Empathy first: "I understand you have client call in 20 mins, let's fix quickly". Avoid jargon. For shared mailbox issue, check Exchange → Recipients → Shared → delegation.`;
    }

    if (expertId === 'david') {
      if (lower.includes('quarantine') || lower.includes('defender')) {
        return `David here - Exchange/Defender expert. Quarantine false positive: 1) Exchange → Message Trace → Find email → Status Quarantined. 2) Defender → Quarantine → See reason (Bulk/Phish/Spam) + confidence. 3) If legit, Release + Allow Sender + Report as Not Junk (trains filter). 4) Add to allowed senders with approval per DLP policy. 5) Tune Anti-spam policy if recurring. Always provide audit trail for Apex Financial SEC-2024-07.`;
      }
      return `David here - For ${ticket.code}, check audit logs, ensure break glass excluded, provide RCA with audit trail. Security mindset: Who changed policy? When? Correlation ID?`;
    }

    if (expertId === 'ms-support') {
      return `Microsoft Support Escalation Engineer. For P1, I need: Tenant ID, Correlation ID ${Math.random().toString(36).substring(7)}, Timestamp UTC, Affected users count, Service Health green? Also check if Break Glass works. If CA blocks admin, use Break Glass excluded from CA. Provide HAR file if needed. KB: https://learn.microsoft.com/en-us/troubleshoot/...`;
    }

    return `${expert.name} here - ${expert.specialty}. For ${ticket.code}, my approach: ${expert.skills.join(', ')}. ${expert.personality}`;
  };

  const acceptCall = () => {
    if (!incomingCall) return;
    const persona = getClientPersona(incomingCall);
    let initialTranscript: CallMessage[] = [];
    let sentiment: Call['sentiment'] = 'frustrated';

    const timeNow = '00:00';
    if (persona.type === 'enterprise-tech') {
      initialTranscript = [
        { id: '1', speaker: 'system', text: `📞 Call connected • ${incomingCall.userEmail} • ${persona.name} • 24/7 SLA 60min • 🔴 Recording • Session ID: ${Math.random().toString(36).substring(7)}-... • Encrypted`, time: timeNow },
        { id: '2', speaker: 'client', text: `Hi, this is ${incomingCall.userEmail.split('@')[0]} from Finance at ${persona.name}. We're blocked by Conditional Access, error 53000 DeviceNotCompliant. Correlation ID: ${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}. I checked Service Health, it's green. Can you check Sign-in logs CA tab? We have payroll in 45 minutes, this is P1. I can run dsregcmd /status if you need.`, time: '00:05' },
      ];
      sentiment = 'neutral';
    } else if (persona.type === 'smb-casual') {
      initialTranscript = [
        { id: '1', speaker: 'system', text: `📞 Call connected • ${incomingCall.userEmail} • ${persona.name} • SMB 9-5 • 🔴 Recording • Session: ${Math.random().toString(36).substring(7)}`, time: timeNow },
        { id: '2', speaker: 'client', text: `Heyy! 😅 It's ${incomingCall.userEmail.split('@')[0]} from ${persona.name}. So my shared mailbox finance@bloomco.studio is not showing in Outlook? I can see it in webmail though, weird. I'm not super technical, can you help me in simple steps? Like "Click Start, then..."? I'm on a call with client in 20 mins!`, time: '00:06' },
      ];
      sentiment = 'frustrated';
    } else {
      initialTranscript = [
        { id: '1', speaker: 'system', text: `📞 Call connected • ${incomingCall.userEmail} • ${persona.name} • Regulated • 🔴 Recording + Compliance log • SEC-2024-07 • Session: ${Math.random().toString(36).substring(7)}`, time: timeNow },
        { id: '2', speaker: 'client', text: `Good morning, this is ${incomingCall.userEmail.split('@')[0]} from Risk & Compliance at ${persona.name}. Per policy SEC-2024-07, we require BitLocker compliance for all devices accessing financial data. My device shows Not Compliant, blocking Teams access. I need audit trail for this incident. Can you guide remediation and provide RCA for compliance review?`, time: '00:08' },
      ];
      sentiment = 'calm';
    }

    const newCall: Call = {
      id: incomingCall.id,
      ticket: incomingCall,
      clientName: incomingCall.clientName,
      userName: incomingCall.userEmail.split('@')[0],
      userEmail: incomingCall.userEmail,
      status: 'active',
      duration: 0,
      transcript: initialTranscript,
      sentiment,
      clientPersona: persona,
      expertsInCall: [],
      isRecording: true,
      isClientTyping: false,
      isClientSpeaking: false
    };

    setActiveCall(newCall);
    setIncomingCall(null);
    onAcceptCall(incomingCall);
    setCallNotes(`Call started ${new Date().toLocaleTimeString()} - ${incomingCall.code} - ${persona.name}\n`);

    // Speak initial client message
    setTimeout(() => {
      speakText(initialTranscript[1].text, persona);
    }, 500);
  };

  const declineCall = () => {
    setIncomingCall(null);
  };

  const sendCallMessage = () => {
    if (!callInput.trim() || !activeCall) return;

    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const userMsg: CallMessage = {
      id: Date.now().toString(),
      speaker: 'you',
      text: callInput,
      time: now
    };

    const updatedTranscript = [...activeCall.transcript, userMsg];
    setActiveCall({ ...activeCall, transcript: updatedTranscript, isClientTyping: true });
    setCallNotes(prev => prev + `\n[${now}] You: ${callInput}`);
    const inputCopy = callInput;
    setCallInput('');

    // Generate client response after delay
    setTimeout(() => {
      const response = generateClientResponse(inputCopy, activeCall.ticket, activeCall.clientPersona, updatedTranscript);
      
      const clientMsg: CallMessage = {
        id: (Date.now()+1).toString(),
        speaker: 'client',
        text: response.text,
        time: `${String(Math.floor((activeCall.duration+2) / 60)).padStart(2,'0')}:${String((activeCall.duration+2) % 60).padStart(2,'0')}`,
        action: response.action,
        isQuestion: response.isQuestion
      };

      setActiveCall(prev => {
        if (!prev) return null;
        return {
          ...prev,
          transcript: [...prev.transcript, clientMsg],
          sentiment: response.sentimentChange || prev.sentiment,
          isClientTyping: false,
          isClientSpeaking: true
        };
      });

      setCallNotes(prev => prev + `\n[${clientMsg.time}] Client: ${response.text}${response.action ? ` [Action: ${response.action.description}]` : ''}`);
      
      // Speak client response
      speakText(response.text, activeCall.clientPersona);

      // Client asks follow-up question after some time if not already question
      if (!response.isQuestion && Math.random() < 0.4) {
        setTimeout(() => {
          const knowledge = commonWorkerKnowledge[activeCall.ticket.code] || Object.values(commonWorkerKnowledge)[0];
          const q = knowledge.questionsClientMightAsk[Math.floor(Math.random() * knowledge.questionsClientMightAsk.length)];
          const followUp: CallMessage = {
            id: (Date.now()+2).toString(),
            speaker: 'client',
            text: activeCall.clientPersona.type === 'smb-casual' ? `Also, ${q} 😅` : activeCall.clientPersona.type === 'enterprise-tech' ? `Quick question: ${q} Correlation ID is ${Math.random().toString(36).substring(7)}` : `Additionally, per SEC-2024-07, ${q} Please include in audit trail.`,
            time: `${String(Math.floor((activeCall.duration+5) / 60)).padStart(2,'0')}:${String((activeCall.duration+5) % 60).padStart(2,'0')}`,
            isQuestion: true
          };
          setActiveCall(prev => prev ? { ...prev, transcript: [...prev.transcript, followUp], isClientTyping: false } : null);
          speakText(followUp.text, activeCall.clientPersona);
        }, 4000 + Math.random() * 3000);
      }

    }, 1200 + Math.random() * 800);
  };

  const addExpertToCall = (expertId: string) => {
    if (!activeCall) return;
    const expert = techExperts.find(e => e.id === expertId);
    if (!expert) return;

    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const joinMsg: CallMessage = {
      id: Date.now().toString(),
      speaker: 'system',
      text: `👨‍💻 ${expert.name} (${expert.specialty}) joined the call • Conference • ${expert.availability}`,
      time: now
    };

    const expertGreeting: CallMessage = {
      id: (Date.now()+1).toString(),
      speaker: 'expert',
      expertName: expert.name,
      text: `Hi, ${expert.name} here, ${expert.specialty}. I see ${activeCall.ticket.code} - ${activeCall.ticket.title}. ${expert.personality}. How can I help?`,
      time: now
    };

    setActiveCall({
      ...activeCall,
      expertsInCall: [...activeCall.expertsInCall, expertId],
      transcript: [...activeCall.transcript, joinMsg, expertGreeting]
    });

    speakText(expertGreeting.text, undefined, true, expertId);
    setShowExperts(false);
    setCallNotes(prev => prev + `\n[${now}] Expert ${expert.name} joined`);
  };

  const askExpert = (expertId: string, question: string) => {
    if (!activeCall) return;
    const expert = techExperts.find(e => e.id === expertId);
    if (!expert) return;

    const now = `${String(Math.floor(activeCall.duration / 60)).padStart(2,'0')}:${String(activeCall.duration % 60).padStart(2,'0')}`;
    const expertResponse = generateExpertResponse(expertId, question, activeCall.ticket);

    const msg: CallMessage = {
      id: Date.now().toString(),
      speaker: 'expert',
      expertName: expert.name,
      text: expertResponse,
      time: now
    };

    setActiveCall({
      ...activeCall,
      transcript: [...activeCall.transcript, msg]
    });

    speakText(expertResponse, undefined, true, expertId);
  };

  const endCall = () => {
    if (!activeCall) return;
    window.speechSynthesis.cancel();
    const endMsg: CallMessage = {
      id: Date.now().toString(),
      speaker: 'system',
      text: `📞 Call ended • Duration ${formatDuration(activeCall.duration)} • Recording saved • Transcript + Notes saved • CSAT survey sent • Audit log: Session ${activeCall.id} • ${activeCall.expertsInCall.length} experts participated`,
      time: formatDuration(activeCall.duration)
    };
    setActiveCall({ ...activeCall, status: 'ended', transcript: [...activeCall.transcript, endMsg] });
    setCallNotes(prev => prev + `\n\nCall ended ${new Date().toLocaleTimeString()} - Duration ${formatDuration(activeCall.duration)}\nExperts: ${activeCall.expertsInCall.join(', ') || 'None'}\n`);
    setTimeout(() => setActiveCall(null), 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice input not supported in this browser. Use Chrome/Edge for voice.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const replayMessage = (text: string, persona?: ClientPersona, expertId?: string) => {
    if (expertId) {
      speakText(text, undefined, true, expertId);
    } else {
      speakText(text, persona || activeCall?.clientPersona);
    }
  };

  return (
    <>
      {/* Incoming Call Modal */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 border border-zinc-200">
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse ring-4 ring-white/10">
                  <span className="text-3xl">📞</span>
                </div>
                <h3 className="font-bold text-lg tracking-tight">Incoming Call — {incomingCall.priority}</h3>
                <p className="text-sm opacity-90 mt-1 font-medium">{incomingCall.clientName}</p>
                <p className="text-xs opacity-75 mt-1 font-mono">{incomingCall.userEmail} • {incomingCall.title}</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  SLA: {Math.floor(incomingCall.timeLeftMs/60000)}m left • 🔴 Live help needed
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-zinc-50 rounded-2xl p-4 text-sm mb-4 border border-zinc-100">
                <div className="font-medium text-zinc-900 leading-relaxed">"{incomingCall.userMessage}"</div>
                <div className="text-xs text-zinc-500 mt-3 flex gap-2 flex-wrap">
                  <span className="bg-zinc-900 text-white px-2.5 py-1 rounded-full font-mono text-[11px]">{incomingCall.code}</span>
                  <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[11px] font-medium">{incomingCall.priority} • Audio call</span>
                  <span className="bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full text-[11px]">{getClientPersona(incomingCall).type}</span>
                </div>
                <div className="mt-3 text-[11px] text-zinc-500">
                  💡 This client will <strong>talk with voice</strong>, respond to your questions, ask questions back, and <strong>do actions</strong> on their side (run dsregcmd, sync Company Portal, check BitLocker)
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={declineCall} className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition">
                  <span>✕</span> Decline
                </button>
                <button onClick={acceptCall} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition">
                  <span>✓</span> Accept — Talk Live
                </button>
              </div>

              <div className="text-[11px] text-zinc-500 text-center mt-4 space-y-1">
                <div>🎙️ Client will speak with voice • You can type or use mic</div>
                <div>👨‍💻 You can add tech experts to conference</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call — Superhuman + Intercom + CloudTalk */}
      {activeCall && activeCall.status === 'active' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-5xl bg-[#0a0a0a] rounded-[20px] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-zinc-900 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold ring-2 ring-violet-600/20">
                  {activeCall.userName[0].toUpperCase()}
                </div>
                {activeCall.isClientSpeaking && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[10px]">🎙️</span>}
              </div>
              <div>
                <div className="text-white font-medium text-sm flex items-center gap-2">
                  {activeCall.userName} • {activeCall.clientName}
                  <span className={`w-2 h-2 rounded-full ${activeCall.sentiment === 'frustrated' ? 'bg-red-500' : activeCall.sentiment === 'calm' ? 'bg-emerald-500' : activeCall.sentiment === 'happy' ? 'bg-blue-500' : 'bg-amber-500'} animate-pulse`}></span>
                  {activeCall.isClientSpeaking && <span className="text-emerald-400 text-xs animate-pulse">● Speaking...</span>}
                  {activeCall.isClientTyping && <span className="text-zinc-400 text-xs">Typing...</span>}
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>{activeCall.ticket.code} • {formatDuration(activeCall.duration)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-zinc-500'}`}>● {isRecording ? 'REC' : 'Not rec'}</span>
                  <span className="hidden md:inline">{activeCall.clientPersona.type} • {activeCall.clientPersona.knowledgeLevel}</span>
                  {activeCall.expertsInCall.length > 0 && <span className="bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30">{activeCall.expertsInCall.length} experts</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => setIsSpeakerOn(!isSpeakerOn)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isSpeakerOn ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`} title="Speaker">
                {isSpeakerOn ? '🔊' : '🔇'}
              </button>
              <button onClick={() => setIsMuted(!isMuted)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isMuted ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`} title="Mute">
                {isMuted ? '🔇' : '🎙️'}
              </button>
              <button onClick={() => setIsOnHold(!isOnHold)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isOnHold ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`} title="Hold">
                ⏸️
              </button>
              <button onClick={() => setIsRecording(!isRecording)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${isRecording ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`} title="Recording">
                ●
              </button>
              <button onClick={() => setShowExperts(!showExperts)} className={`w-9 h-9 rounded-full flex items-center justify-center transition ${showExperts ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'}`} title="Add Expert">
                👨‍💻
              </button>
              <button onClick={endCall} className="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition" title="End Call">
                📞
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Transcript */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div ref={transcriptRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0a]">
                {activeCall.transcript.map((t) => (
                  <div key={t.id} className={`flex ${t.speaker === 'you' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm group relative ${t.speaker === 'you' ? 'bg-violet-600 text-white rounded-br-sm' : t.speaker === 'client' ? 'bg-zinc-800 text-zinc-100 rounded-bl-sm border border-zinc-700' : t.speaker === 'expert' ? 'bg-blue-900/30 text-blue-100 border border-blue-800 rounded-bl-sm' : 'bg-amber-900/20 text-amber-200 text-xs border border-amber-800/30'}`}>
                      {t.speaker === 'expert' && <div className="text-[11px] font-bold text-blue-300 mb-1">👨‍💻 {t.expertName}</div>}
                      {t.speaker === 'client' && <div className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">{activeCall.clientName} • {activeCall.clientPersona.knowledgeLevel} {t.isQuestion && <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full">Question</span>}</div>}
                      <div className="leading-relaxed">{t.text}</div>
                      {t.action && (
                        <div className="mt-2 bg-black/30 rounded-xl p-2.5 border border-white/10 text-xs">
                          <div className="font-bold flex items-center gap-1.5">⚡ Client Action: {t.action.type.replace('_', ' ')}</div>
                          <div className="mt-1 text-zinc-300">{t.action.description}</div>
                          {t.action.output && <div className="mt-1 font-mono bg-black/50 p-2 rounded-lg text-[11px] text-emerald-300">{t.action.output}</div>}
                          <div className={`mt-1 text-[11px] ${t.action.success ? 'text-emerald-400' : 'text-amber-400'}`}>{t.action.success ? '✓ Success' : '⚠ Needs help'}</div>
                        </div>
                      )}
                      <div className={`text-[10px] mt-2 flex items-center justify-between ${t.speaker === 'you' ? 'text-violet-200' : 'text-zinc-500'}`}>
                        <span>{t.time}</span>
                        <button onClick={() => replayMessage(t.text, t.speaker === 'client' ? activeCall.clientPersona : undefined, t.speaker === 'expert' ? activeCall.expertsInCall[0] : undefined)} className="opacity-0 group-hover:opacity-100 hover:text-white transition text-[11px]">🔊 Replay</button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeCall.isClientTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-zinc-400">
                      <span className="flex gap-1"><span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></span><span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 bg-zinc-900 border-t border-zinc-800">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={callInput}
                      onChange={e => setCallInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendCallMessage()}
                      placeholder={activeCall.clientPersona.type === 'smb-casual' ? "Explain in simple steps, no jargon... (or use mic 🎙️)" : activeCall.clientPersona.type === 'enterprise-tech' ? "Share facts: Sign-in logs CA tab, dsregcmd, Correlation ID... (mic 🎙️)" : "Provide audit trail, policy reference, compliance proof... (mic 🎙️)"}
                      className="w-full bg-zinc-800 text-white placeholder:text-zinc-500 px-4 py-3 pr-12 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 border border-zinc-700"
                    />
                    <button onClick={toggleListening} className={`absolute right-1 top-1 w-9 h-9 rounded-full flex items-center justify-center transition ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>
                      {isListening ? '●' : '🎙️'}
                    </button>
                  </div>
                  <button onClick={sendCallMessage} disabled={!callInput.trim()} className="px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full text-sm font-bold transition">
                    Send
                  </button>
                </div>

                {/* Quick actions */}
                <div className="mt-3 flex gap-2 flex-wrap">
                  {[
                    { label: '🔍 Check Sign-in logs', action: 'Can you check Sign-in logs → Conditional Access tab and tell me what you see?' },
                    { label: '💻 Run dsregcmd', action: 'Can you run dsregcmd /status in Command Prompt as admin and share output?' },
                    { label: '🔄 Company Portal Sync', action: 'Can you open Company Portal and click Sync, then tell me what it shows?' },
                    { label: '🔐 Check BitLocker', action: 'Can you check BitLocker status? Run Get-BitLockerVolume or check Settings → Device encryption?' },
                    { label: '❓ Explain simply', action: 'Can you explain what you see in simple steps? What does the error mean?' },
                  ].map((qa) => (
                    <button key={qa.label} onClick={() => setCallInput(qa.action)} className="text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 transition">
                      {qa.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 px-1 text-[11px] text-zinc-500 flex flex-col md:flex-row justify-between gap-1">
                  <span>💡 {activeCall.clientPersona.type === 'smb-casual' ? 'Bloom: Use simple language, emojis, "Click Start →..."' : activeCall.clientPersona.type === 'enterprise-tech' ? 'NovaTech: Share Correlation ID, CA tab, technical RCA, dsregcmd' : 'Apex: Provide audit trail, SEC-2024-07, compliance proof'}</span>
                  <span className="flex gap-2"><span>🎙️ {isListening ? 'Listening...' : 'Mic for voice'} • 🔊 {isSpeakerOn ? 'Speaker on' : 'Muted'} • ⌨️ Enter to send</span></span>
                </div>
              </div>
            </div>

            {/* Experts Panel */}
            {showExperts && (
              <div className="w-[320px] border-l border-zinc-800 bg-zinc-900 flex flex-col">
                <div className="p-3 border-b border-zinc-800">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">👨‍💻 Tech Experts — Call for Help</h3>
                  <p className="text-[11px] text-zinc-400 mt-1">Add expert to conference, ask questions, get guidance</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {techExperts.map(expert => (
                    <div key={expert.id} className={`p-3 rounded-xl border transition ${activeCall.expertsInCall.includes(expert.id) ? 'bg-violet-500/10 border-violet-500/30' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-white text-sm flex items-center gap-2">
                            {expert.name}
                            <span className={`w-2 h-2 rounded-full ${expert.availability === 'available' ? 'bg-emerald-500' : expert.availability === 'on-call' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                          </div>
                          <div className="text-xs text-violet-300">{expert.specialty}</div>
                          <div className="text-[11px] text-zinc-400 mt-1">{expert.personality}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {expert.skills.slice(0,3).map(s => <span key={s} className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-full">{s}</span>)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {!activeCall.expertsInCall.includes(expert.id) ? (
                          <button onClick={() => addExpertToCall(expert.id)} className="flex-1 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs font-medium">
                            Add to Call
                          </button>
                        ) : (
                          <span className="flex-1 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs text-center">In Call ✓</span>
                        )}
                        <button onClick={() => {
                          const q = prompt(`Ask ${expert.name}:`, `For ${activeCall.ticket.code}, what's your expert advice?`);
                          if (q) askExpert(expert.id, q);
                        }} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-full text-xs">
                          Ask
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-zinc-800 bg-zinc-900">
                  <div className="text-[11px] text-zinc-500">
                    <div className="font-medium text-zinc-300">Conference Tips:</div>
                    <div>• Add Alex for CA 53000</div>
                    <div>• Add Priya for Intune 0x80180024</div>
                    <div>• Add David for Quarantine</div>
                    <div>• Experts speak with different voices</div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Panel - Desktop */}
            <div className="hidden xl:flex w-[280px] border-l border-zinc-800 bg-zinc-900 flex-col">
              <div className="p-3 border-b border-zinc-800">
                <h3 className="font-bold text-white text-sm">📝 Call Notes + Knowledge</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <textarea value={callNotes} onChange={e => setCallNotes(e.target.value)} placeholder="Notes during call..." className="w-full h-32 bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none" />
                
                <div className="bg-zinc-800 rounded-xl p-3 border border-zinc-700">
                  <div className="font-medium text-white text-xs">Common Worker Knowledge — {activeCall.ticket.code}</div>
                  <div className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {(commonWorkerKnowledge[activeCall.ticket.code] || Object.values(commonWorkerKnowledge)[0]).explanation}
                  </div>
                  <div className="mt-2 text-[11px]">
                    <div className="font-medium text-zinc-300">Steps:</div>
                    <ul className="list-disc list-inside text-zinc-400 mt-1 space-y-1">
                      {(commonWorkerKnowledge[activeCall.ticket.code] || Object.values(commonWorkerKnowledge)[0]).steps.slice(0,3).map((s,i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="mt-2 text-[11px]">
                    <div className="font-medium text-zinc-300">Client can do:</div>
                    <div className="text-zinc-400">{(commonWorkerKnowledge[activeCall.ticket.code] || Object.values(commonWorkerKnowledge)[0]).clientCanDo}</div>
                  </div>
                </div>

                <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
                  <div className="font-medium text-violet-300 text-xs">🎯 Client Persona</div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    <div>Type: {activeCall.clientPersona.type}</div>
                    <div>Level: {activeCall.clientPersona.knowledgeLevel}</div>
                    <div>Voice: {activeCall.clientPersona.voicePref}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {activeCall.clientPersona.traits.map(t => <span key={t} className="bg-zinc-800 px-1.5 py-0.5 rounded-full text-[10px]">{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
