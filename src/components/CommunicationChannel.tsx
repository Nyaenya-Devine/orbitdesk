'use client';
import { useState, useEffect, useRef } from 'react';

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

const autoReplies: Record<string, { author: string; avatar: string; role: Message['role']; messages: string[]; actions?: string[] }> = {
 'team-internal': {
 author: 'Priya Shah',
 avatar: 'P',
 role: 'expert',
 messages: [
 "Checking Entra Audit Logs now — Correlation ID? What If shows safe with 15min expiry. @You need to confirm?",
 "For Message Trace: Go to Exchange Admin → Mail Flow → Message Trace → search sender → release after verification.",
 "Break Glass verified — excluded from CA, can still login if needed. Audit trail HMAC-signed.",
 "I can pair with Jamal — shadowing 2 tickets/day on Message Trace. Private 1:1 SBI for Alex vs Jamal conflict.",
 ],
 actions: [
 "Checked Entra Audit Logs — found policy modified by john.admin without Report-Only",
 "Ran Message Trace — found quarantined email, released after verification",
 "Verified Break Glass excluded from CA — Break Glass OK",
 ]
 },
 'client-a': {
 author: 'Sarah Finance',
 avatar: 'S',
 role: 'client',
 messages: [
 "Thanks! I checked Company Portal — device not compliant, clicked Check Status. Still blocked, Correlation ID c4f2a9b1.",
 "Service Health green, no incidents. Need payroll email in 30 mins, P1! Can you help in simple steps?",
 "I ran dsregcmd /status — Device State: AzureADJoined YES, DomainJoined NO, Compliant NO. What next?",
 ],
 actions: [
 "Checked Company Portal — device not compliant, clicked Check Status",
 "Ran dsregcmd /status — Device State: AzureADJoined YES, Compliant NO",
 "Checked Service Health — Exchange green, no incidents",
 ]
 },
 'client-b': {
 author: 'Emma Bloom',
 avatar: 'E',
 role: 'client',
 messages: [
 "Yes! It says shared mailbox not showing, I have presentation in 20 mins 😰 Simple steps please? No jargon like DeviceNotCompliant?",
 "I clicked Outlook → File → Account Settings → More Settings → Advanced → Add mailbox, but not showing? 🥺",
 "It works now! Thank you! You explained in simple steps, no jargon, with emojis — perfect! ⭐⭐⭐⭐⭐",
 ],
 actions: [
 "Opened Outlook → File → Account Settings → More Settings → Advanced",
 "Checked webmail — shared mailbox shows in webmail, not Outlook",
 ]
 },
 'escalations': {
 author: 'David Okafor',
 avatar: 'D',
 role: 'expert',
 messages: [
 "P1 acknowledged — Checking Entra Audit Logs, Sign-in Logs, What If, Break Glass. Correlation ID b3e9d1a4, Service Health green, 50 users blocked.",
 "What If simulation: If we revert CA policy to Report-Only, 50 users unblocked in 2 mins, audit shows who reverted, Break Glass still works. Safe to revert.",
 "Per SEC-2024-07 for Apex, need audit trail + RCA. Who changed policy, when, why without Report-Only? Provide confirmation.",
 ],
 },
};

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

 // Add live ticket messages if ticket provided
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

 const quickReplies = activeChannel === 'team-internal' 
 ? [
  "Checking Entra Audit Logs now, Correlation ID?",
  "What If shows safe with 15min expiry — approve?",
  "Break Glass verified, excluded from CA",
  "Message Trace: Exchange Admin → Mail Flow → Trace → release",
  "Per SEC-2024-07, need audit trail + key escrow",
 ]
 : activeChannel.startsWith('client-') || activeChannel.startsWith('live-')
 ? [
  "Simple steps: Click Start → Settings → Accounts...",
  "Can you share what you see on screen? @mention",
  "What If shows safe — I can fix in 2 mins",
  "Checked Service Health — all green, no incidents",
  "I'll explain without jargon, step-by-step 📎",
 ]
 : [
  "P1 acknowledged — checking audit logs + What If",
  "What If: If revert to Report-Only, 50 users unblocked",
  "Break Glass verified, can still login if needed",
  "Need RCA: who changed policy, when, why no Report-Only?",
 ];

 const sendMessage = () => {
 if (!newMessage.trim()) return;
 
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
 };
 setMessages(prev => [...prev, msg]);
 setNewMessage('');

 const replyConfig = autoReplies[activeChannel] || autoReplies['team-internal'];
 if (replyConfig && !activeChannel.startsWith('live-')) {
 setIsTyping({ author: replyConfig.author, channel: activeChannel });
 setTimeout(() => {
  setIsTyping(null);
  const replyMsg: Message = {
  id: (Date.now() + 1).toString(),
  channel: activeChannel,
  author: replyConfig.author,
  avatar: replyConfig.avatar,
  role: replyConfig.role,
  message: randomFrom(replyConfig.messages),
  timestamp: new Date(),
  action: replyConfig.actions ? randomFrom(replyConfig.actions) : undefined,
  sentiment: 'calm',
  };
  setMessages(prev => [...prev, replyMsg]);
 }, 1200 + Math.random() * 800);
 } else if (activeChannel.startsWith('live-')) {
 // Live client replies faster, like real chat
 setIsTyping({ author: ticket?.userEmail.split('@')[0] || 'Client', channel: activeChannel });
 setTimeout(() => {
  setIsTyping(null);
  const clientReplies = [
  "Got it! Trying now... shared my screen? Can you see Company Portal?",
  "Yes! I clicked Check Status — now says Syncing... what next?",
  "It works! Thank you so much — simple steps really helped! ⭐⭐⭐⭐⭐",
  "Quick question — will this happen again? How to prevent?",
  ];
  const replyMsg: Message = {
  id: (Date.now() + 1).toString(),
  channel: activeChannel,
  author: ticket?.userEmail.split('@')[0] || 'Client',
  avatar: ticket?.userEmail[0].toUpperCase() || 'C',
  role: 'client',
  message: randomFrom(clientReplies),
  timestamp: new Date(),
  sentiment: 'happy',
  };
  setMessages(prev => [...prev, replyMsg]);
 }, 800 + Math.random() * 600);
 }
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

 useEffect(() => {
 const interval = setInterval(() => {
 if (Math.random() < 0.12 && !compact) {
  const channelIds = ['team-internal', 'client-a', 'client-b'];
  const randomChannel = randomFrom(channelIds);
  const config = autoReplies[randomChannel];
  if (config && randomChannel !== activeChannel) {
  const randomMsg: Message = {
  id: Date.now().toString(),
  channel: randomChannel,
  author: config.author,
  avatar: config.avatar,
  role: config.role,
  message: randomFrom(config.messages),
  timestamp: new Date(),
  action: config.actions ? randomFrom(config.actions) : undefined,
  };
  setMessages(prev => [...prev, randomMsg]);
  }
 }
 }, 6000);
 return () => clearInterval(interval);
 }, [activeChannel, compact]);

 if (compact) {
 return (
 <div className="bg-[#050507] flex flex-col h-full">
  <div className="h-9 px-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
  <div className="flex items-center gap-2">
  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
  <span className="text-[11px] font-bold text-zinc-200">Live Chat Workstation — {activeChannel.includes('live-') ? ticket?.code : channels.find(c=>c.id===activeChannel)?.name}</span>
  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">Teams/Slack style</span>
  </div>
  <div className="flex items-center gap-1">
  <span className="text-[10px] text-zinc-500">Presence • Typing • @mentions • Files</span>
  </div>
  </div>
  <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
  {filteredMessages.slice(-8).map(msg => (
  <div key={msg.id} className={`flex gap-2 ${msg.role === 'lead' ? 'justify-end' : 'justify-start'}`}>
   {msg.role !== 'lead' && <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 border ${msg.role === 'client' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{msg.avatar}</div>}
   <div className={`max-w-[78%] rounded-xl px-2.5 py-1.5 border text-[11px] ${msg.role === 'lead' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-100'}`}>
   <p className="leading-[1.3]">{msg.message}</p>
   {msg.file && <div className="mt-1.5 p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-1.5"><span className="text-[10px]">📎</span><span className="text-[10px] font-mono truncate">{msg.file.name} • {msg.file.size}</span></div>}
   </div>
  </div>
  ))}
  {isTyping && <div className="flex gap-2"><div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">{isTyping.author[0]}</div><div className="rounded-xl px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-500">typing...</div></div>}
  <div ref={messagesEndRef} />
  </div>
  <div className="p-2 border-t border-zinc-800 bg-zinc-900/30">
  <div className="flex gap-1.5">
  <button onClick={handleFileShare} className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] hover:bg-zinc-700">📎</button>
  <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder={activeChannel.startsWith('live-') ? `Reply to ${ticket?.userEmail} — simple steps, Teams style...` : "Message — @mention, file, real chat..."} className="flex-1 h-7 px-2.5 rounded-full bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50" />
  <button onClick={sendMessage} className="h-7 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-medium">Send</button>
  </div>
  <p className="text-[9px] text-zinc-600 mt-1">Real workstation: client left, agent right, presence 🟢, typing, @mentions, file share, simultaneous internal + client — like Teams/Slack</p>
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
  <p className="text-[11px] text-zinc-500 mt-1">Real-time • Teams/Slack style • Presence • @mentions • Files</p>
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
   Presence — Teams/Slack style
  </div>
  <div className="mt-2 space-y-1">
   {Object.entries(presence).slice(0,5).map(([name, status]) => (
   <div key={name} className="flex items-center gap-1.5 text-[10px]">
   <span className={`h-2 w-2 rounded-full ${status==='online'?'bg-emerald-500':status==='away'?'bg-amber-500':status==='busy'?'bg-red-500':'bg-zinc-600'}`} />
   <span className="text-zinc-400 truncate">{name}</span>
   <span className="text-zinc-600">{status}</span>
   </div>
   ))}
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
   <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">Live • Teams/Slack</span>
  </h3>
  <p className="text-[11px] text-zinc-500">{channels.find(c => c.id === activeChannel)?.desc} • Presence 🟢 • Typing • @mentions • Files • Real workstation</p>
  </div>
  <div className="flex items-center gap-1.5">
  <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">Teams style</span>
  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Live Chat</span>
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
   <span className="text-[11px] text-zinc-500 ml-2">{isTyping.author} is typing... (real Teams/Slack)</span>
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
   {q.substring(0, 35)}...
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
   placeholder={activeChannel.startsWith('client-') || activeChannel.startsWith('live-') ? "Reply to client — simple language, @mention, file share... Teams style" : "Message team — facts, logs, @mention, file... Slack style"}
   className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
  />
  <button onClick={sendMessage} className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition-colors">Send</button>
  </div>
  <div className="flex items-center justify-between mt-2">
  <p className="text-[11px] text-zinc-500">
   {activeChannel.startsWith('client-') || activeChannel.startsWith('live-') ? '💡 Teams style: client + agent simultaneous, presence 🟢, typing, @mentions, file share, live workstation split view' : '💡 Slack style: internal + client separate, presence, @mentions, threads, file share, real helpdesk'}
  </p>
  <span className="text-[10px] text-zinc-600">Real workstation</span>
  </div>
  </div>
 </div>
 </div>
 );
}
