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
 message: "Unable to access Outlook — device shows non-compliant. Payroll deadline approaching. Correlation ID: a7f3c9e2 — Service Health checked.", 
 timestamp: new Date(Date.now() - 1000*60*15), 
 type: 'p1-alert',
 sentiment: 'urgent',
 mentions: ['@you'],
 },
 { 
 id: '2', 
 channel: 'team-internal', 
 author: 'Alex Mwangi', 
 avatar: 'A', 
 role: 'agent', 
 message: "Reviewing escalation patterns — several tickets resolved with Message Trace. Sharing updated guidance.", 
 timestamp: new Date(Date.now() - 1000*60*10), 
 type: 'normal',
 sentiment: 'calm',
 },
 { 
 id: '3', 
 channel: 'team-internal', 
 author: 'Priya Shah', 
 avatar: 'P', 
 role: 'expert', 
 message: "Taking Entra CA case for NovaTech — Sign-in logs show DeviceNotCompliant 53000. Validating compliance and What-If simulation.", 
 timestamp: new Date(Date.now() - 1000*60*8),
 action: "Reviewed Sign-in logs — DeviceNotCompliant 53000",
 sentiment: 'calm',
 },
 { 
 id: '4', 
 channel: 'client-b', 
 author: 'Emma Bloom', 
 avatar: 'E', 
 role: 'client', 
 message: "Shared mailbox finance@bloomco.studio not visible in Outlook, but accessible via webmail. Could you provide simple steps?", 
 timestamp: new Date(Date.now() - 1000*60*5),
 sentiment: 'confused',
 },
 { 
 id: '5', 
 channel: 'escalations', 
 author: 'Operations', 
 avatar: '◍', 
 role: 'system', 
 message: "P1 Alert: 50 users affected by Conditional Access policy update at 08:02. SLA 60 minutes. Correlation ID: b3e9d1a4", 
 timestamp: new Date(Date.now() - 1000*60*3), 
 type: 'p1-alert' 
 },
];

function getIntelligentReply(userMessage: string, channel: string, persona: 'enterprise' | 'smb' | 'regulated'): { text: string; action?: string; sentiment: Message['sentiment'] } {
 const lower = userMessage.toLowerCase();
 
 if (channel === 'team-internal') {
  if (lower.includes('entra') || lower.includes('audit') || lower.includes('sign-in')) {
   return { text: "Correct approach — Entra Audit Logs show policy change at 08:02 without Report-Only. What-If simulation indicates safe revert with 15-minute expiry. Break Glass verified.", action: "Reviewed Entra Audit Logs", sentiment: 'calm' };
  }
  if (lower.includes('message trace') || lower.includes('quarantine')) {
   return { text: "For Message Trace: Exchange Admin → Mail Flow → Message Trace → search last 7 days → verify sender legitimacy via Threat Explorer → Release with documented justification.", action: "Message Trace procedure", sentiment: 'calm' };
  }
  return { text: "Acknowledged — reviewing Sign-in logs, What-If simulation, and Break Glass configuration. Will confirm root cause and remediation.", action: "Investigation in progress", sentiment: 'calm' };
 }

 if (channel.includes('client-a') || persona === 'enterprise') {
  if (lower.includes('dsregcmd') || lower.includes('compliant')) {
   return { text: "Verified — dsregcmd shows AzureADJoined YES, Compliant NO. Next: Company Portal → Check Status → Sync (2-3 minutes) → re-run dsregcmd. Payroll access should restore.", action: "Guided device compliance sync", sentiment: 'calm' };
  }
  return { text: "Reviewed Sign-in logs — DeviceNotCompliant 53000, Correlation ID c4f2a9b1. Service Health green. Remediation via Company Portal compliance sync.", action: "Sign-in log review", sentiment: 'calm' };
 }

 if (channel.includes('client-b') || persona === 'smb') {
  if (lower.includes('outlook') || lower.includes('mailbox')) {
   return { text: "Here are simple steps: 1. Open Outlook → File → Account Settings → 2. Email tab → Change → More Settings → Advanced → 3. Add → finance@bloomco.studio → OK. Webmail shows it automatically, Outlook needs manual addition.", action: "Provided mailbox setup steps", sentiment: 'happy' };
  }
  return { text: "Understood — shared mailbox appears in webmail by design. Outlook requires manual addition. I can guide you through the steps.", action: "Acknowledged mailbox request", sentiment: 'calm' };
 }

 return { text: "P1 acknowledged — reviewing audit logs, Sign-in logs, What-If simulation, and Break Glass status. Service Health verified.", action: "P1 triage", sentiment: 'urgent' };
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
 const [showQuickReplies] = useState(true);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const channels = [
 { id: 'team-internal', name: '#team-internal', desc: 'Team coordination • Operations', icon: '💬', unread: 1, color: 'violet', online: 5 },
 { id: 'client-a', name: '#client-a-novatech', desc: 'Enterprise • P1 60min • Technical', icon: '🏢', unread: 1, color: 'violet', online: 1 },
 { id: 'client-b', name: '#client-b-bloom', desc: 'SMB • Support • Guided assistance', icon: '🎨', unread: 1, color: 'pink', online: 1 },
 { id: 'escalations', name: '#escalations', desc: 'Critical incidents • Review', icon: '🚨', unread: 1, color: 'red', online: 3 },
 ...(ticket ? [{ id: `live-${ticket.code}`, name: `${ticket.code} Live`, desc: `${ticket.userEmail} • Active`, icon: '🔴', unread: 0, color: 'emerald', online: 2 }] : []),
 ];

 useEffect(() => {
 if (ticket && !messages.find(m => m.channel === `live-${ticket.code}`)) {
 const liveMsg: Message = {
  id: `live-${ticket.code}`,
  channel: `live-${ticket.code}`,
  author: ticket.userEmail.split('@')[0],
  avatar: ticket.userEmail[0].toUpperCase(),
  role: 'client',
  message: ticket.userMessage,
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
  "Reviewing Entra Audit Logs — checking correlation ID",
  "What-If simulation shows safe with 15min expiry",
  "Break Glass verified and excluded from policy",
  "Message Trace procedure documented",
 ]
 : activeChannel.startsWith('client-') || activeChannel.startsWith('live-')
 ? getPersona(activeChannel) === 'smb' ? [
  "Simple steps: Outlook → File → Account Settings → Add mailbox",
  "Webmail shows shared mailboxes automatically — Outlook needs manual add",
  "Quick workaround: use webmail while we fix Outlook",
 ] : [
  "Reviewed Sign-in logs — DeviceNotCompliant 53000, Service Health green",
  "What-If simulation indicates safe remediation",
  "Company Portal sync plus dsregcmd verification",
 ]
 : [
  "P1 acknowledged — reviewing audit logs and What-If",
  "What-If indicates safe revert to Report-Only",
 ];

 const sendMessage = () => {
 if (!newMessage.trim()) return;
 
 const persona = getPersona(activeChannel);
 const scores = calculateCommunicationScore(newMessage, persona, {
  usedClientLanguage: /simple|correlation|policy/i.test(newMessage),
  checkedLogs: /sign-in logs|audit logs|service health|message trace|dsregcmd|company portal/i.test(newMessage),
  usedCorrectTool: /entra|intune|exchange|company portal|what if|bitlocker/i.test(newMessage),
 });

 let tip = '';
 if (scores.empathy < 50) tip = `Add acknowledgment: "I understand this impacts your work — let me help resolve this."`;
 else if (scores.clarity < 50) tip = persona === 'smb' ? `Use simple steps and avoid technical jargon for SMB clients` : `Include correlation ID, log review, and structured steps`;
 else if (scores.technicalAccuracy < 50) tip = `Include log review, tool used, and root cause`;
 else tip = `Strong communication — clear, empathetic, and technically accurate`;

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

 const replyData = getIntelligentReply(newMessage, activeChannel, persona);
 const replyAuthor = activeChannel === 'team-internal' ? { author: 'Priya Shah', avatar: 'P', role: 'expert' as const } : activeChannel === 'client-a' || activeChannel.includes('novatech') ? { author: 'Sarah Finance', avatar: 'S', role: 'client' as const } : activeChannel === 'client-b' || persona === 'smb' ? { author: 'Emma Bloom', avatar: 'E', role: 'client' as const } : activeChannel === 'escalations' ? { author: 'David Okafor', avatar: 'D', role: 'expert' as const } : { author: ticket?.userEmail.split('@')[0] || 'Client', avatar: ticket?.userEmail[0].toUpperCase() || 'C', role: 'client' as const };

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

 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [filteredMessages, isTyping]);

 if (compact) {
 return (
 <div className="bg-[#050507] flex flex-col h-full">
  <div className="h-9 px-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
  <div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
  <span className="text-[11px] font-bold text-zinc-200">{activeChannel.includes('live-') ? ticket?.code : channels.find(c=>c.id===activeChannel)?.name}</span>
  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Quality review</span>
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
     <div className="flex gap-1">Emp {msg.feedback.empathy} • Clar {msg.feedback.clarity} • Tech {msg.feedback.technical}</div>
     <div className="text-violet-300 mt-0.5">{msg.feedback.tip}</div>
    </div>
   )}
   </div>
  </div>
  ))}
  {isTyping && <div className="flex gap-2"><div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">{isTyping.author[0]}</div><div className="rounded-xl px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-500">Typing...</div></div>}
  <div ref={messagesEndRef} />
  </div>
  <div className="p-2 border-t border-zinc-800 bg-zinc-900/30">
  <div className="flex gap-1.5">
  <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message..." className="flex-1 h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50" />
  <button onClick={sendMessage} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">Send</button>
  </div>
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
  Operations Workspace
  </h3>
  <p className="text-[11px] text-zinc-500 mt-1">Team and client communication</p>
  </div>
  
  <div className="flex-1 overflow-y-auto p-2 space-y-1">
  {channels.map(ch => (
  <button key={ch.id} onClick={() => setActiveChannel(ch.id)} className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-all border ${activeChannel === ch.id ? 'bg-violet-500/10 border-violet-500/20 text-violet-200' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/30 text-zinc-400 hover:text-zinc-200'}`}>
   <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-[13px] border ${ch.color === 'violet' ? 'bg-violet-500/15 border-violet-500/20' : ch.color === 'pink' ? 'bg-pink-500/15 border-pink-500/20' : ch.color === 'emerald' ? 'bg-emerald-500/15 border-emerald-500/20' : 'bg-red-500/15 border-red-500/20'}`}>{ch.icon}</span>
   <div className="flex-1 min-w-0">
   <div className="text-[12px] font-medium truncate flex items-center gap-1">{ch.name} {ch.id.startsWith('live-') && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}</div>
   <div className="text-[11px] opacity-60 truncate">{ch.desc}</div>
   </div>
   <div className="flex flex-col items-end gap-1">
   {ch.unread > 0 && <span className="h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{ch.unread}</span>}
   </div>
  </button>
  ))}
  </div>

  <div className="p-3 border-t border-zinc-800/60">
  <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
   Quality Metrics
  </div>
  <div className="mt-2 space-y-1 text-[10px] text-zinc-500">
   <div>• Empathy and acknowledgment</div>
   <div>• Clarity and structure</div>
   <div>• Technical accuracy</div>
   <div>• Client adaptation</div>
  </div>
  </div>
  </div>
 </div>

 <div className="flex-1 flex flex-col bg-[#050507]">
  <div className="h-12 px-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
  <div>
  <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
   {channels.find(c => c.id === activeChannel)?.icon} {channels.find(c => c.id === activeChannel)?.name}
  </h3>
  <p className="text-[11px] text-zinc-500">{channels.find(c => c.id === activeChannel)?.desc}</p>
  </div>
  <div className="flex items-center gap-1.5">
  <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Professional communication</span>
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
   </div>
   <p className="text-[13px] leading-[1.4]">{msg.message}</p>
   {msg.feedback && msg.role === 'lead' && (
    <div className="mt-2 p-2 rounded-xl bg-black/30 border border-white/10">
     <div className="flex gap-1.5 text-[10px] font-mono">
      <span className={msg.feedback.empathy >= 70 ? 'text-emerald-300' : msg.feedback.empathy >= 40 ? 'text-amber-300' : 'text-red-300'}>Emp {msg.feedback.empathy}</span>
      <span className={msg.feedback.clarity >= 70 ? 'text-emerald-300' : msg.feedback.clarity >= 40 ? 'text-amber-300' : 'text-red-300'}>Clar {msg.feedback.clarity}</span>
      <span className={msg.feedback.technical >= 70 ? 'text-emerald-300' : msg.feedback.technical >= 40 ? 'text-amber-300' : 'text-red-300'}>Tech {msg.feedback.technical}</span>
     </div>
     <p className="text-[10px] text-violet-300 mt-1 leading-[1.3]">{msg.feedback.tip}</p>
    </div>
   )}
   {msg.action && (
   <div className="mt-2 p-2 rounded-lg bg-black/30 border border-white/5">
    <p className="text-[11px] font-mono opacity-70">{msg.action}</p>
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
   <span className="text-[11px] text-zinc-500 ml-2">{isTyping.author} typing</span>
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
   <button key={q} onClick={() => setNewMessage(q)} className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 whitespace-nowrap transition-colors">
   {q.substring(0, 40)}
   </button>
   ))}
  </div>
  </div>
  )}

  <div className="p-3 border-t border-zinc-800/60 bg-zinc-900/30">
  <div className="flex gap-2">
  <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20" />
  <button onClick={sendMessage} className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition-colors">Send</button>
  </div>
  <p className="text-[10px] text-zinc-500 mt-2">Professional communication guidance based on client profile and scenario</p>
  </div>
 </div>
 </div>
 );
}
