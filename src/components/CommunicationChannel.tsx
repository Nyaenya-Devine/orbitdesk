'use client';
import { useState, useEffect, useRef } from 'react';
import { calculateCommunicationScore } from '@/lib/progressEngine';

interface Message {
 id: string;
 channel: string;
 author: string;
 avatar: string;
 role: 'client' | 'agent' | 'lead' | 'system' | 'expert';
 message: string;
 timestamp: Date;
 type?: 'p1-alert' | 'csat' | 'conflict' | 'normal' | 'question';
 isTyping?: boolean;
 action?: string;
 sentiment?: 'urgent' | 'calm' | 'frustrated' | 'happy' | 'confused';
 mentions?: string[];
 file?: { name: string; size: string; type: string };
 reactions?: { emoji: string; count: number; users: string[] }[];
 feedback?: { empathy: number; clarity: number; technical: number; fluency: number; lang: number; tip: string };
}

const initialMessages: Message[] = [
 { 
 id: '1', 
 channel: 'client-a', 
 author: 'Sarah Finance', 
 avatar: 'S', 
 role: 'client', 
 message: "URGENT: Can't access Outlook, says device not compliant. Need payroll email! Correlation ID: a7f3c9e2 — checked Service Health green.", 
 timestamp: new Date(Date.now() - 1000*60*15), 
 type: 'p1-alert',
 sentiment: 'urgent',
 mentions: ['@you'],
 reactions: [{ emoji: '🚨', count: 2, users: ['Priya', 'You'] }],
 },
 { 
 id: '2', 
 channel: 'team-internal', 
 author: 'Alex Mwangi', 
 avatar: 'A', 
 role: 'agent', 
 message: "Jamal keeps escalating easy M365 tickets without checking logs — public shaming in #team-internal, wastes my time. 3 today that are just Message Trace.", 
 timestamp: new Date(Date.now() - 1000*60*10), 
 type: 'conflict',
 sentiment: 'frustrated',
 },
 { 
 id: '3', 
 channel: 'team-internal', 
 author: 'Priya Shah', 
 avatar: 'P', 
 role: 'expert', 
 message: "I can take Entra CA block for NovaTech — checked Sign-in logs CA tab, it's DeviceNotCompliant 53000, need Intune compliance check. What If shows safe with 15min expiry.", 
 timestamp: new Date(Date.now() - 1000*60*8),
 action: "Checked Sign-in logs CA tab — DeviceNotCompliant 53000",
 sentiment: 'calm',
 file: { name: 'signin-log-c4f2a9b1.json', size: '2.3KB', type: 'json' },
 },
 { 
 id: '4', 
 channel: 'client-b', 
 author: 'Emma Bloom', 
 avatar: 'E', 
 role: 'client', 
 message: "Heyy! 😅 My shared mailbox finance@bloomco.studio not showing in Outlook, but I see it in webmail. Simple steps please? 🥺", 
 timestamp: new Date(Date.now() - 1000*60*5),
 sentiment: 'confused',
 },
 { 
 id: '5', 
 channel: 'escalations', 
 author: 'Chokepoint', 
 avatar: '◍', 
 role: 'system', 
 message: "🚨 P1 ALERT: Client A — 50 users blocked by new CA policy 'Require compliant device' pushed at 08:02 by john.admin@novatech.com without Report-Only. SLA 60min. Correlation ID: b3e9d1a4", 
 timestamp: new Date(Date.now() - 1000*60*3), 
 type: 'p1-alert' 
 },
 { 
 id: '6', 
 channel: 'team-internal', 
 author: 'Jamal Otieno', 
 avatar: 'J', 
 role: 'agent', 
 message: "Sorry team, stuck on EXCH-001 quarantine release, not sure if allow sender. Can someone help? I checked Message Trace but not sure.", 
 timestamp: new Date(Date.now() - 1000*60*2),
 type: 'question',
 sentiment: 'confused',
 mentions: ['@Priya'],
 },
];

// Advanced intelligent replies — context-aware, not random
function getIntelligentReply(userMessage: string, channel: string, persona: 'enterprise' | 'smb' | 'regulated'): { text: string; action?: string; sentiment: Message['sentiment'] } {
 const lower = userMessage.toLowerCase();
 
 // Team-internal intelligent coaching
 if (channel === 'team-internal') {
  if (lower.includes('entra') || lower.includes('audit') || lower.includes('sign-in') || lower.includes('correlation')) {
   return { text: "Nice — checking Entra Audit Logs first is correct. Found policy modified by john.admin without Report-Only at 08:02. What If shows reverting to Report-Only unblocks 50 users in 2 mins with 15min expiry, audit HMAC-signed. @You confirm? Break Glass verified excluded from CA.", action: "Checked Entra Audit Logs — policy modified without Report-Only", sentiment: 'calm' };
  }
  if (lower.includes('message trace') || lower.includes('quarantine') || lower.includes('exchange')) {
   return { text: "For Message Trace: Exchange Admin → Mail Flow → Message Trace → search sender in last 7 days → View details → Release after verifying sender is legitimate. Check Threat Explorer for phishing score. I can shadow you 2 tickets/day.", action: "Ran Message Trace — quarantine release procedure", sentiment: 'calm' };
  }
  if (lower.includes('break glass') || lower.includes('emergency')) {
   return { text: "Break Glass verified — excluded from CA policies, can still login if needed. Audit trail HMAC-signed per SEC-2024-07. Use only for P1 50-users blocked, document RCA.", action: "Verified Break Glass excluded from CA", sentiment: 'calm' };
  }
  if (lower.includes('conflict') || lower.includes('alex') || lower.includes('jamal') || lower.includes('sbi')) {
   return { text: "I can help — private 1:1 SBI for Alex vs Jamal: Situation-Behavior-Impact. Jamal shadowing 2 tickets/day on Message Trace, Alex coaching on escalation criteria. No public shaming — DM first. Let's resolve.", action: "Coaching conflict resolution SBI", sentiment: 'calm' };
  }
  return { text: "Got it — checking Sign-in logs CA tab, What If simulation shows safe with 15min expiry, Break Glass verified. Need Correlation ID and Service Health check. @You need to confirm RCA: who changed policy without Report-Only?", action: "Checked logs + What If + Break Glass", sentiment: 'calm' };
 }

 // Client-A Enterprise — technical, Correlation ID, Service Health
 if (channel === 'client-a' || channel.includes('client-a') || channel.includes('live-') && persona === 'enterprise') {
  if (lower.includes('dsregcmd') || lower.includes('azureadjoined') || lower.includes('compliant')) {
   return { text: "Perfect — dsregcmd shows AzureADJoined YES but Compliant NO. Next: Open Company Portal (blue shopping bag icon) → Check Status → Wait 2 mins → Sync. Then run dsregcmd /status again. Correlation ID c4f2a9b1 will clear. Payroll unblocked in 3 mins.", action: "Guided dsregcmd + Company Portal Sync", sentiment: 'happy' };
  }
  if (lower.includes('company portal') || lower.includes('sync') || lower.includes('intune')) {
   return { text: "Company Portal syncing now — last sync just now is good sign. Device compliance check takes 2-3 mins after sync. Check Intune portal → Devices → Compliance — should show Compliant YES soon. Correlation ID will update. Thanks for checking!", action: "Checked Company Portal sync status", sentiment: 'calm' };
  }
  if (lower.includes('service health') || lower.includes('green') || lower.includes('exchange')) {
   return { text: "Service Health green confirms no Microsoft incident — good check! This is CA policy blocking, not Exchange down. Sign-in logs CA tab shows DeviceNotCompliant 53000. Fix is local device compliance, not service side. You're doing right steps.", action: "Verified Service Health green", sentiment: 'calm' };
  }
  if (lower.includes('bitlocker')) {
   return { text: "BitLocker enable is safe — won't delete files, just encrypts drive for compliance per SEC-2024-07. Go to Settings → Privacy & Security → Device Encryption → Turn on. Key escrow to Entra ID automatically. Payroll access after BitLocker compliant.", action: "Guided BitLocker enable + key escrow", sentiment: 'calm' };
  }
  return { text: "Thanks! I checked Sign-in logs CA tab — DeviceNotCompliant 53000, Correlation ID c4f2a9b1. RCA: CA policy 'Require compliant device' without Report-Only. What If shows safe to sync compliance. Try Company Portal Check Status + dsregcmd /status. Payroll in 30 mins — I'll stay with you.", action: "Checked Sign-in logs CA tab + What If", sentiment: 'urgent' };
 }

 // Client-B SMB — simple language, emojis, no jargon
 if (channel === 'client-b' || channel.includes('client-b') || (channel.includes('live-') && persona === 'smb')) {
  if (lower.includes('simple') || lower.includes('step') || lower.includes('click') || lower.includes('outlook')) {
   return { text: "Yes! Super simple steps 😅: 1. Open Outlook → File → Account Settings → Account Settings → 2. Click Email tab → 3. Click Change → More Settings → Advanced → 4. Click Add → Type finance@bloomco.studio → OK! No jargon, just clicks. Let me know! 🙏", action: "Shared simple steps for shared mailbox", sentiment: 'happy' };
  }
  if (lower.includes('webmail') || lower.includes('works') || lower.includes('showing')) {
   return { text: "Webmail shows it because webmail always shows shared mailboxes automatically — Outlook needs manual add. That's normal! Not your fault 😊 Try steps above, takes 30 seconds. You got this!", action: "Explained webmail vs Outlook difference simply", sentiment: 'calm' };
  }
  if (lower.includes('presentation') || lower.includes('client call') || lower.includes('urgent')) {
   return { text: "I understand — presentation in 20 mins is stressful! 😰 Let's fix fast: Quick fix — use webmail for now (outlook.office.com) to access finance mailbox immediately, then fix Outlook after call. No stress! Want me to stay on chat?", action: "Provided quick workaround for urgent deadline", sentiment: 'urgent' };
  }
  return { text: "Heyy! 😅 Got it — shared mailbox not showing in Outlook but shows in webmail. Simple fix, no jargon! I know you have presentation — let's do quick steps: Outlook → File → Add mailbox. Takes 1 min! 🥺 Need simple steps?", action: "Acknowledged shared mailbox issue simply", sentiment: 'confused' };
 }

 // Escalations — What If, Break Glass, RCA
 if (channel === 'escalations') {
  if (lower.includes('what if') || lower.includes('report-only') || lower.includes('revert')) {
   return { text: "What If simulation: If we revert CA policy 'Require compliant device' to Report-Only, 50 users unblocked in 2 mins, no data loss, audit trail HMAC-signed shows who reverted, Break Glass still works. Risk: low (15min expiry). Recommend revert + monitor Sign-in logs.", action: "Ran What If simulation — safe to revert", sentiment: 'calm' };
  }
  if (lower.includes('rca') || lower.includes('sec-2024-07') || lower.includes('audit')) {
   return { text: "Per SEC-2024-07 for Apex, RCA required: Policy 'Require compliant device' pushed at 08:02 by john.admin@novatech.com without Report-Only mode, bypassing change management. No What If, no audit approval. Remediation: revert to Report-Only, enable approval workflow, document audit trail + key escrow.", action: "Documented RCA per SEC-2024-07 + audit trail", sentiment: 'calm' };
  }
  return { text: "P1 acknowledged — 50 users blocked, SLA 60min, Correlation ID b3e9d1a4. Checking Entra Audit Logs (who changed policy), Sign-in Logs CA tab (DeviceNotCompliant 53000), What If (safe to revert with 15min expiry), Break Glass (verified excluded). Service Health green — not Microsoft incident.", action: "P1 triage — audit logs + What If + Break Glass", sentiment: 'urgent' };
 }

 // Live ticket — personalized
 return { text: "Got it! Trying now... shared my screen? Can you see Company Portal? I clicked Check Status — now says Syncing... what next? Thanks for simple steps! 🙏", action: "Live troubleshooting with screen share", sentiment: 'happy' };
}

function randomFrom<T>(arr: T[]): T {
 return arr[Math.floor(Math.random() * arr.length)];
}

interface Props {
 compact?: boolean;
 ticket?: any;
}

export default function CommunicationChannel({ compact = false, ticket }: Props) {
 const [activeChannel, setActiveChannel] = useState(ticket ? `client-${ticket.clientId || 'a'}` : 'team-internal');
 const [messages, setMessages] = useState<Message[]>(initialMessages);
 const [newMessage, setNewMessage] = useState('');
 const [isTyping, setIsTyping] = useState<{ author: string; channel: string } | null>(null);
 const [showQuickReplies, setShowQuickReplies] = useState(true);
 const [presence, setPresence] = useState<Record<string, 'online' | 'away' | 'busy' | 'offline'>>({
 'You': 'online', 'Alex Mwangi': 'online', 'Priya Shah': 'online', 'Jamal Otieno': 'away', 'David Okafor': 'busy', 'Sarah Finance': 'online', 'Emma Bloom': 'online'
 });
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const channels = [
 { id: 'team-internal', name: '#team-internal', desc: 'Team chat • 5 agents • 44h/week', icon: '💬', unread: 2, color: 'violet', online: 5 },
 { id: 'client-a', name: '#client-a-novatech', desc: 'Enterprise 24/7 • P1 60min • Technical', icon: '🏢', unread: 1, color: 'violet', online: 1 },
 { id: 'client-b', name: '#client-b-bloom', desc: 'SMB 9-5 • P2 8h • Simple language', icon: '🎨', unread: 1, color: 'pink', online: 1 },
 { id: 'escalations', name: '#escalations', desc: 'P1 & Major • What If • Break Glass', icon: '🚨', unread: 1, color: 'red', online: 3 },
 ...(ticket ? [{ id: `live-${ticket.code}`, name: `💬 ${ticket.code} Live`, desc: `${ticket.userEmail} • Live chat workstation`, icon: '🔴', unread: 0, color: 'emerald', online: 2 }] : []),
 ];

 useEffect(() => {
 if (ticket && !messages.find(m => m.channel === `live-${ticket.code}`)) {
 const liveMsg: Message = {
  id: `live-${ticket.code}`,
  channel: `live-${ticket.code}`,
  author: ticket.userEmail.split('@')[0],
  avatar: ticket.userEmail[0].toUpperCase(),
  role: 'client',
  message: ticket.userMessage + ` (I'm on Teams chat now — can you help live? Like real workstation split view — agent + client simultaneous)`,
  timestamp: new Date(),
  type: 'normal',
  mentions: ['@you'],
 };
 setMessages(prev => [...prev, liveMsg]);
 setActiveChannel(`live-${ticket.code}`);
 }
 }, [ticket]);

 const filteredMessages = messages.filter(m => m.channel === activeChannel);

 const getPersona = (channelId: string): 'enterprise' | 'smb' | 'regulated' => {
 if (channelId.includes('client-b') || channelId.includes('bloom')) return 'smb';
 if (channelId.includes('client-c') || channelId.includes('apex')) return 'regulated';
 return 'enterprise';
 };

 const quickReplies = activeChannel === 'team-internal' 
 ? [
  "Checking Entra Audit Logs now, Correlation ID?",
  "What If shows safe with 15min expiry — approve?",
  "Break Glass verified, excluded from CA",
  "Message Trace: Exchange Admin → Mail Flow → Trace → release",
  "Per SEC-2024-07, need audit trail + key escrow",
 ]
 : activeChannel.startsWith('client-') || activeChannel.startsWith('live-')
 ? getPersona(activeChannel) === 'smb' ? [
  "Hi! I understand 😅 Simple steps: Click Start → Settings...",
  "Thanks for checking! No jargon, step-by-step 🙏",
  "I know presentation is urgent — quick workaround via webmail?",
  "Perfect! It works? ⭐⭐⭐⭐⭐ Thanks!",
  "No worries — shared mailbox fix takes 1 min, simple clicks!",
 ] : getPersona(activeChannel) === 'regulated' ? [
  "Per SEC-2024-07, checked Sign-in logs CA tab — DeviceNotCompliant",
  "RCA: policy without Report-Only, audit trail HMAC-signed",
  "Remediation: revert to Report-Only, What If safe 15min expiry",
  "Confirm key escrow + attestation per policy?",
  "Audit trail + RCA documented, need confirmation",
 ] : [
  "I understand payroll is urgent — checked Sign-in logs CA tab",
  "Correlation ID a7f3c9e2 — DeviceNotCompliant 53000, Service Health green",
  "What If shows safe — Company Portal Sync + dsregcmd /status",
  "Checked Service Health — all green, not Microsoft incident",
  "RCA: CA policy without Report-Only, fix in 2 mins",
 ]
 : [
  "P1 acknowledged — checking audit logs + What If",
  "What If: If revert to Report-Only, 50 users unblocked",
  "Break Glass verified, can still login if needed",
  "Need RCA: who changed policy, when, why no Report-Only?",
 ];

 const sendMessage = () => {
 if (!newMessage.trim()) return;
 
 const persona = getPersona(activeChannel);
 // Advanced scoring — Gong/Chorus style
 const scores = calculateCommunicationScore(newMessage, persona, {
  usedClientLanguage: newMessage.toLowerCase().includes('simple') || newMessage.toLowerCase().includes('correlation') || newMessage.toLowerCase().includes('sec-2024-07') || /😅|🥺|🙏/u.test(newMessage),
  checkedLogs: /sign-in logs|audit logs|service health|message trace|dsregcmd|company portal/i.test(newMessage),
  usedCorrectTool: /entra|intune|exchange|company portal|what if|bitlocker/i.test(newMessage),
 });

 let tip = '';
 if (scores.empathy < 50) tip = `Add empathy: "I understand this is frustrating, sorry about that! Thanks for checking..."`;
 else if (scores.clarity < 50) tip = persona === 'smb' ? `SMB needs simple steps: "Click Start → Settings" no jargon + emoji 😅` : `Enterprise needs Correlation ID + Sign-in logs CA tab + What If`;
 else if (scores.technicalAccuracy < 50) tip = `Include RCA + tool: "Checked Sign-in logs CA tab, DeviceNotCompliant 53000, fixed via Company Portal Sync"`;
 else if (scores.clientLanguage < 50) tip = persona === 'smb' ? `Use Bloom language: simple + 😅 + no jargon` : persona === 'regulated' ? `Use Apex: Per SEC-2024-07, audit trail, confirm` : `Use NovaTech: Correlation ID, Service Health, technical`;
 else if (scores.fluency < 70) tip = `Avoid um/uh, be confident, 15-80 words ideal`;
 else tip = `✅ Excellent — ${scores.empathy >=80 ? 'empathetic' : ''} ${scores.clarity >=80 ? 'clear' : ''} ${scores.technicalAccuracy >=80 ? 'technical' : ''} — like human agent!`;

 const msg: Message = {
 id: Date.now().toString(),
 channel: activeChannel,
 author: 'You (Team Lead)',
 avatar: 'DL',
 role: 'lead',
 message: newMessage,
 timestamp: new Date(),
 mentions: newMessage.includes('@') ? newMessage.match(/@\w+/g) || [] : undefined,
 reactions: [],
 feedback: { empathy: scores.empathy, clarity: scores.clarity, technical: scores.technicalAccuracy, fluency: scores.fluency, lang: scores.clientLanguage, tip },
 };
 setMessages(prev => [...prev, msg]);
 setNewMessage('');

 // Intelligent reply based on content
 const replyData = getIntelligentReply(newMessage, activeChannel, persona);
 const replyAuthor = activeChannel === 'team-internal' ? { author: 'Priya Shah', avatar: 'P', role: 'expert' as const } : activeChannel === 'client-a' || activeChannel.includes('novatech') || (activeChannel.includes('live-') && persona === 'enterprise') ? { author: 'Sarah Finance', avatar: 'S', role: 'client' as const } : activeChannel === 'client-b' || persona === 'smb' ? { author: 'Emma Bloom', avatar: 'E', role: 'client' as const } : activeChannel === 'escalations' ? { author: 'David Okafor', avatar: 'D', role: 'expert' as const } : { author: ticket?.userEmail.split('@')[0] || 'Client', avatar: ticket?.userEmail[0].toUpperCase() || 'C', role: 'client' as const };

 setIsTyping({ author: replyAuthor.author, channel: activeChannel });
 setTimeout(() => {
  setIsTyping(null);
  const replyMsg: Message = {
  id: (Date.now() + 1).toString(),
  channel: activeChannel,
  author: replyAuthor.author,
  avatar: replyAuthor.avatar,
  role: replyAuthor.role,
  message: replyData.text,
  timestamp: new Date(),
  action: replyData.action,
  sentiment: replyData.sentiment,
  };
  setMessages(prev => [...prev, replyMsg]);
 }, 1000 + Math.random() * 600);
 };

 const handleFileShare = () => {
 const fakeFile = { name: `screenshot-${Date.now()}.png`, size: '1.2MB', type: 'image' };
 const msg: Message = {
 id: Date.now().toString(),
 channel: activeChannel,
 author: 'You (Team Lead)',
 avatar: 'DL',
 role: 'lead',
 message: `Shared file for troubleshooting — please check`,
 timestamp: new Date(),
 file: fakeFile,
 };
 setMessages(prev => [...prev, msg]);
 };

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [filteredMessages, isTyping]);

 if (compact) {
 return (
 <div className="bg-[#050507] flex flex-col h-full">
  <div className="h-9 px-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
  <div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
  <span className="text-[11px] font-bold text-zinc-200">Live Chat Workstation — {activeChannel.includes('live-') ? ticket?.code : channels.find(c=>c.id===activeChannel)?.name}</span>
  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">Advanced NLP</span>
  </div>
  <div className="flex items-center gap-1">
  <span className="text-[10px] text-zinc-500">Gong/Chorus-style scoring</span>
  </div>
  </div>
  <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
  {filteredMessages.slice(-10).map(msg => (
  <div key={msg.id} className={`flex gap-2 ${msg.role === 'lead' ? 'justify-end' : 'justify-start'}`}>
   {msg.role !== 'lead' && <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 border ${msg.role === 'client' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{msg.avatar}</div>}
   <div className={`max-w-[78%] rounded-xl px-2.5 py-1.5 border text-[11px] ${msg.role === 'lead' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-100'}`}>
   <p className="leading-[1.3]">{msg.message}</p>
   {msg.feedback && msg.role === 'lead' && (
    <div className="mt-1.5 p-1.5 rounded-lg bg-black/30 border border-white/10 text-[9px]">
     <div className="flex gap-1">Emp {msg.feedback.empathy} • Clar {msg.feedback.clarity} • Tech {msg.feedback.technical} • Flu {msg.feedback.fluency} • Lang {msg.feedback.lang}</div>
     <div className="text-violet-300 mt-0.5">💡 {msg.feedback.tip}</div>
    </div>
   )}
   {msg.file && <div className="mt-1.5 p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-1.5"><span className="text-[10px]">📎</span><span className="text-[10px] font-mono truncate">{msg.file.name} • {msg.file.size}</span></div>}
   </div>
  </div>
  ))}
  {isTyping && <div className="flex gap-2"><div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">{isTyping.author[0]}</div><div className="rounded-xl px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-500">typing... advanced NLP reply</div></div>}
  <div ref={messagesEndRef} />
  </div>
  <div className="p-2 border-t border-zinc-800 bg-zinc-900/30">
  <div className="flex gap-1.5">
  <button onClick={handleFileShare} className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] hover:bg-zinc-700">📎</button>
  <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder={activeChannel.startsWith('live-') ? `Reply to ${ticket?.userEmail} — advanced scoring...` : "Message — advanced NLP feedback..."} className="flex-1 h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50" />
  <button onClick={sendMessage} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">Send</button>
  </div>
  <p className="text-[9px] text-zinc-600 mt-1">Advanced: empathy (sorry/understand), clarity (steps/jargon), technical (RCA/logs), fluency (um/uh), client language (SMB emoji vs Enterprise Correlation ID) — Gong/Chorus/Grammarly style</p>
  </div>
 </div>
 );
 }

 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex h-[600px] overflow-hidden">
 <div className="w-[260px] bg-zinc-900/50 border-r border-zinc-800/60 flex flex-col">
  <div className="p-3.5 border-b border-zinc-800/60">
  <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
  OrbitDesk Workspace
  </h3>
  <p className="text-[11px] text-zinc-500 mt-1">Advanced NLP • Gong/Chorus • Grammarly</p>
  </div>
  
  <div className="flex-1 overflow-y-auto p-2 space-y-1">
  {channels.map(ch => (
  <button
   key={ch.id}
   onClick={() => setActiveChannel(ch.id)}
   className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-all border ${activeChannel === ch.id ? 'bg-violet-500/10 border-violet-500/20 text-violet-200' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/30 text-zinc-400 hover:text-zinc-200'}`}
  >
   <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-[13px] border ${ch.color === 'violet' ? 'bg-violet-500/15 border-violet-500/20' : ch.color === 'pink' ? 'bg-pink-500/15 border-pink-500/20' : ch.color === 'emerald' ? 'bg-emerald-500/15 border-emerald-500/20' : 'bg-red-500/15 border-red-500/20'}`}>{ch.icon}</span>
   <div className="flex-1 min-w-0">
   <div className="text-[12px] font-medium truncate flex items-center gap-1">{ch.name} {ch.id.startsWith('live-') && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}</div>
   <div className="text-[11px] opacity-60 truncate">{ch.desc}</div>
   </div>
   <div className="flex flex-col items-end gap-1">
   {ch.unread > 0 && <span className="h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{ch.unread}</span>}
   <span className="text-[10px] opacity-40">{ch.online} online 🟢</span>
   </div>
  </button>
  ))}
  </div>

  <div className="p-3 border-t border-zinc-800/60">
  <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
   Advanced NLP Scoring
  </div>
  <div className="mt-2 space-y-1 text-[10px] text-zinc-500">
   <div>• Empathy: sorry, understand, reassurance</div>
   <div>• Clarity: structure, jargon per persona</div>
   <div>• Technical: logs, RCA, remediation</div>
   <div>• Fluency: um/uh, confidence</div>
   <div>• Lang: SMB emoji vs Enterprise Corr ID</div>
  </div>
  </div>
  </div>
 </div>

 <div className="flex-1 flex flex-col bg-[#050507]">
  <div className="h-12 px-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
  <div>
  <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
   {channels.find(c => c.id === activeChannel)?.icon} {channels.find(c => c.id === activeChannel)?.name}
   <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
   <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">Advanced • Gong/Chorus</span>
  </h3>
  <p className="text-[11px] text-zinc-500">{channels.find(c => c.id === activeChannel)?.desc} • Advanced NLP scoring • Context-aware replies</p>
  </div>
  <div className="flex items-center gap-1.5">
  <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">Advanced NLP</span>
  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Human-like</span>
  </div>
  </div>

  <div className="flex-1 overflow-y-auto p-4 space-y-3">
  {filteredMessages.map(msg => (
  <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'lead' ? 'justify-end' : 'justify-start'}`}>
   {(msg.role === 'client' || msg.role === 'system' || msg.role === 'agent' || msg.role === 'expert') && (
   <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 border ${msg.role === 'client' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : msg.role === 'system' ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : msg.role === 'expert' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
   {msg.avatar}
   </div>
   )}
   
   <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 border ${msg.role === 'lead' ? 'bg-violet-600 border-violet-500 text-white' : msg.role === 'client' ? 'bg-zinc-800 border-zinc-700/50 text-zinc-100' : msg.role === 'system' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' : msg.role === 'expert' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-zinc-800 border-zinc-700/50 text-zinc-200'} ${msg.type === 'p1-alert' ? 'border-red-500/30 bg-red-500/10' : ''}`}>
   <div className="flex items-center gap-2 mb-1">
   <span className="text-[11px] font-semibold">{msg.author}</span>
   <span className="text-[10px] opacity-60">{msg.timestamp.toLocaleTimeString()}</span>
   {msg.type === 'p1-alert' && <span className="text-[10px] px-1 py-0.5 rounded bg-red-500 text-white">P1</span>}
   {msg.mentions && msg.mentions.map(m => <span key={m} className="text-[10px] px-1 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/20">{m}</span>)}
   </div>
   <p className="text-[13px] leading-[1.4]">{msg.message}</p>
   {msg.feedback && msg.role === 'lead' && (
    <div className="mt-2 p-2 rounded-xl bg-black/30 border border-white/10">
     <div className="flex gap-1.5 text-[10px] font-mono">
      <span className={msg.feedback.empathy >= 70 ? 'text-emerald-300' : msg.feedback.empathy >= 40 ? 'text-amber-300' : 'text-red-300'}>Emp {msg.feedback.empathy}</span>
      <span className={msg.feedback.clarity >= 70 ? 'text-emerald-300' : msg.feedback.clarity >= 40 ? 'text-amber-300' : 'text-red-300'}>Clar {msg.feedback.clarity}</span>
      <span className={msg.feedback.technical >= 70 ? 'text-emerald-300' : msg.feedback.technical >= 40 ? 'text-amber-300' : 'text-red-300'}>Tech {msg.feedback.technical}</span>
      <span className={msg.feedback.fluency >= 70 ? 'text-emerald-300' : msg.feedback.fluency >= 40 ? 'text-amber-300' : 'text-red-300'}>Flu {msg.feedback.fluency}</span>
      <span className={msg.feedback.lang >= 70 ? 'text-emerald-300' : msg.feedback.lang >= 40 ? 'text-amber-300' : 'text-red-300'}>Lang {msg.feedback.lang}</span>
     </div>
     <p className="text-[10px] text-violet-300 mt-1 leading-[1.3]">💡 {msg.feedback.tip}</p>
    </div>
   )}
   {msg.action && (
   <div className="mt-2 p-2 rounded-lg bg-black/30 border border-white/5">
    <p className="text-[11px] font-mono opacity-70">Action: {msg.action}</p>
   </div>
   )}
   {msg.file && (
   <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/10 flex items-center gap-2">
    <span className="h-8 w-8 rounded-lg bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-[14px]">📎</span>
    <div className="flex-1 min-w-0">
    <p className="text-[11px] font-medium truncate">{msg.file.name}</p>
    <p className="text-[10px] opacity-60">{msg.file.size} • {msg.file.type}</p>
    </div>
    <button className="h-6 px-2 rounded-full bg-zinc-700 text-[10px]">Download</button>
   </div>
   )}
   {msg.reactions && msg.reactions.length>0 && (
   <div className="mt-2 flex gap-1">
    {msg.reactions.map((r,i) => <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-700 border border-zinc-600">{r.emoji} {r.count}</span>)}
   </div>
   )}
   </div>

   {msg.role === 'lead' && (
   <div className="h-7 w-7 rounded-full bg-violet-600 border border-violet-500 flex items-center justify-center text-[11px] font-medium text-white flex-shrink-0">
   {msg.avatar}
   </div>
   )}
  </div>
  ))}

  {isTyping && isTyping.channel === activeChannel && (
  <div className="flex gap-2.5">
   <div className="h-7 w-7 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[11px] text-zinc-300">
   {isTyping.author[0]}
   </div>
   <div className="rounded-2xl px-3.5 py-2.5 bg-zinc-800 border border-zinc-700/50">
   <div className="flex items-center gap-1">
   <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
   <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
   <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
   <span className="text-[11px] text-zinc-500 ml-2">{isTyping.author} is typing... advanced NLP understanding</span>
   </div>
   </div>
  </div>
  )}

  <div ref={messagesEndRef} />
  </div>

  {showQuickReplies && (
  <div className="px-3 py-2 border-t border-zinc-800/40 bg-zinc-900/20">
  <div className="flex items-center gap-1.5 overflow-x-auto">
   {quickReplies.map(q => (
   <button
   key={q}
   onClick={() => setNewMessage(q)}
   className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 whitespace-nowrap transition-colors"
   >
   {q.substring(0, 40)}...
   </button>
   ))}
  </div>
  </div>
  )}

  <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30">
  <div className="flex gap-2">
  <button onClick={handleFileShare} className="h-9 w-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700" title="Share file — like Teams/Slack">📎</button>
  <input
   value={newMessage}
   onChange={e => setNewMessage(e.target.value)}
   onKeyDown={e => e.key === 'Enter' && sendMessage()}
   placeholder={activeChannel.startsWith('client-') || activeChannel.startsWith('live-') ? "Reply to client — advanced NLP scoring, context-aware..." : "Message team — advanced understanding..."}
   className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
  />
  <button onClick={sendMessage} className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition-colors">Send</button>
  </div>
  <div className="flex items-center justify-between mt-2">
  <p className="text-[11px] text-zinc-500">
   💡 Advanced: empathy (sorry/understand/thank + personalization), clarity (structure/jargon per persona), technical (logs/RCA), fluency (filler/confidence), client language (Bloom 😅 vs NovaTech Correlation ID vs Apex SEC-2024-07) — Gong/Chorus/Grammarly style
  </p>
  <span className="text-[10px] text-zinc-600">Real + Intelligent</span>
  </div>
  </div>
 </div>
 </div>
 );
}
