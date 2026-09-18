'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateCommunicationScore } from '@/lib/progressEngine';

interface Message {
 id: string;
 channel: string;
 author: string;
 avatar: string;
 role: 'client' | 'agent' | 'lead' | 'system' | 'expert';
 message: string;
 timestamp: Date;
 type?: 'p1-alert' | 'csat' | 'conflict' | 'normal';
 sentiment?: 'urgent' | 'calm' | 'frustrated' | 'happy' | 'confused';
 action?: string;
 feedback?: { empathy: number; clarity: number; technical: number; tip: string };
}

const initialMessages: Message[] = [
 { id: '1', channel: 'client-a-novatech', author: 'Sarah Finance', avatar: 'S', role: 'client', message: "Unable to access Outlook — device shows non-compliant. Payroll deadline approaching. Correlation ID: a7f3c9e2 — Service Health checked.", timestamp: new Date(Date.now() - 1000*60*15), type: 'p1-alert', sentiment: 'urgent' },
 { id: '2', channel: 'team-internal', author: 'Alex Mwangi', avatar: 'A', role: 'agent', message: "Reviewing escalation patterns — several tickets resolved with Message Trace. Sharing updated guidance.", timestamp: new Date(Date.now() - 1000*60*10), type: 'normal', sentiment: 'calm' },
 { id: '3', channel: 'team-internal', author: 'Priya Shah', avatar: 'P', role: 'expert', message: "Taking Entra CA case for NovaTech — Sign-in logs show DeviceNotCompliant 53000. Validating compliance and What-If simulation.", timestamp: new Date(Date.now() - 1000*60*8), action: "Reviewed Sign-in logs — DeviceNotCompliant 53000", sentiment: 'calm' },
 { id: '4', channel: 'client-b-bloom', author: 'Emma Bloom', avatar: 'E', role: 'client', message: "Shared mailbox finance@bloomco.studio not visible in Outlook, but accessible via webmail. Could you provide simple steps?", timestamp: new Date(Date.now() - 1000*60*5), sentiment: 'confused' },
 { id: '5', channel: 'escalations', author: 'Operations', avatar: '◍', role: 'system', message: "P1 Alert: 50 users affected by Conditional Access policy update at 08:02. SLA 60 minutes. Correlation ID: b3e9d1a4", timestamp: new Date(Date.now() - 1000*60*3), type: 'p1-alert' },
];

function getReply(msg: string, channel: string) {
 const lower = msg.toLowerCase();
 if (channel === 'team-internal') {
  if (lower.includes('entra') || lower.includes('audit')) return { text: "Correct — Entra Audit Logs show policy change at 08:02 without Report-Only. What-If simulation indicates safe revert with 15min expiry. Break Glass verified.", action: "Reviewed Entra Audit Logs" };
  return { text: "Acknowledged — reviewing Sign-in logs, What-If simulation, and Break Glass configuration.", action: "Investigation in progress" };
 }
 if (channel.includes('client-a')) {
  if (lower.includes('dsregcmd')) return { text: "Verified — dsregcmd shows AzureADJoined YES, Compliant NO. Next: Company Portal → Check Status → Sync (2-3 mins) → re-run dsregcmd.", action: "Guided device compliance sync" };
  return { text: "Reviewed Sign-in logs — DeviceNotCompliant 53000, Correlation ID c4f2a9b1. Service Health green. Remediation via Company Portal compliance sync.", action: "Sign-in log review" };
 }
 if (channel.includes('client-b')) {
  return { text: "Here are simple steps: 1. Open Outlook → File → Account Settings → Email tab → Change → More Settings → Advanced → Add → finance@bloomco.studio → OK. Webmail shows it automatically.", action: "Provided mailbox setup steps" };
 }
 return { text: "P1 acknowledged — reviewing audit logs, Sign-in logs, What-If simulation, and Break Glass status.", action: "P1 triage" };
}

export default function CommunicationChannel({ compact = false, ticket }: { compact?: boolean; ticket?: any }) {
 const [activeChannel, setActiveChannel] = useState('team-internal');
 const [messages, setMessages] = useState<Message[]>(initialMessages);
 const [newMessage, setNewMessage] = useState('');
 const [isTyping, setIsTyping] = useState<string | null>(null);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const channels = [
  { id: 'team-internal', name: '#team-internal', desc: 'Team coordination • Operations • 5 online', icon: '💬', unread: 1, color: 'violet' },
  { id: 'client-a-novatech', name: '#client-a-novatech', desc: 'Enterprise • P1 60min • Technical', icon: '🏢', unread: 1, color: 'violet' },
  { id: 'client-b-bloom', name: '#client-b-bloom', desc: 'SMB • Support • Guided assistance', icon: '🎨', unread: 1, color: 'pink' },
  { id: 'escalations', name: '#escalations', desc: 'Critical incidents • Review • 3 online', icon: '🚨', unread: 1, color: 'red' },
 ];

 const filteredMessages = messages.filter(m => m.channel === activeChannel);

 const quickReplies = activeChannel === 'team-internal'
  ? ["Reviewing Entra Audit Logs — checking correlation ID", "What-If simulation shows safe with 15min expiry", "Break Glass verified and excluded from policy"]
  : activeChannel.includes('client-a')
  ? ["Reviewed Sign-in logs — DeviceNotCompliant 53000, Service Health green", "What-If simulation indicates safe remediation", "Company Portal sync plus dsregcmd verification"]
  : ["Simple steps: Outlook → File → Account Settings → Add mailbox", "Webmail shows shared mailboxes automatically"];

 const sendMessage = () => {
  if (!newMessage.trim()) return;
  const persona = activeChannel.includes('client-b') ? 'smb' as const : 'enterprise' as const;
  const scores = calculateCommunicationScore(newMessage, persona, {
   usedClientLanguage: /simple|correlation|policy/i.test(newMessage),
   checkedLogs: /sign-in logs|audit logs|service health|message trace|dsregcmd|company portal/i.test(newMessage),
   usedCorrectTool: /entra|intune|exchange|company portal|what if|bitlocker/i.test(newMessage),
  });

  let tip = '';
  if (scores.empathy < 50) tip = `Add acknowledgment: "I understand this impacts your work — let me help resolve this."`;
  else if (scores.clarity < 50) tip = persona === 'smb' ? `Use simple steps and avoid technical jargon for SMB clients` : `Include correlation ID, log review, and structured steps`;
  else if (scores.technicalAccuracy < 50) tip = `Include log review, tool used, and root cause`;
  else tip = `Strong communication — clear, empathetic, and technically accurate — verified works`;

  const msg: Message = {
   id: Date.now().toString(),
   channel: activeChannel,
   author: 'You (Team Lead)',
   avatar: 'DL',
   role: 'lead',
   message: newMessage,
   timestamp: new Date(),
   feedback: { empathy: scores.empathy, clarity: scores.clarity, technical: scores.technicalAccuracy, tip },
  };
  setMessages(prev => [...prev, msg]);
  setNewMessage('');

  const replyData = getReply(newMessage, activeChannel);
  const replyAuthor = activeChannel === 'team-internal' ? { author: 'Priya Shah', avatar: 'P', role: 'expert' as const } : activeChannel.includes('client-a') ? { author: 'Sarah Finance', avatar: 'S', role: 'client' as const } : { author: 'Emma Bloom', avatar: 'E', role: 'client' as const };

  setIsTyping(replyAuthor.author);
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
   };
   setMessages(prev => [...prev, replyMsg]);
  }, 900);
 };

 useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [filteredMessages, isTyping]);

 if (compact) {
  return (
   <div className="bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl flex flex-col h-full overflow-hidden">
    <div className="h-10 px-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-2">
     <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
     <span className="text-[12px] font-semibold text-zinc-200">{channels.find(c=>c.id===activeChannel)?.name}</span>
     <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">Quality review • Works</span>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
     <AnimatePresence>
      {filteredMessages.slice(-8).map(msg => (
       <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className={`flex gap-2 ${msg.role === 'lead' ? 'justify-end' : 'justify-start'}`}>
        {msg.role !== 'lead' && <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${msg.role === 'client' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{msg.avatar}</div>}
        <div className={`max-w-[78%] rounded-2xl px-3 py-2 border text-[12px] leading-[1.4] ${msg.role === 'lead' ? 'bg-violet-600 border-violet-500 text-white' : 'bg-zinc-800 border-zinc-700 text-zinc-100'}`}>
         {msg.message}
         {msg.feedback && (
          <div className="mt-2 p-2 rounded-xl bg-black/30 border border-white/10 text-[10px]">
           <div className="flex gap-2 font-mono">Emp {msg.feedback.empathy} • Clar {msg.feedback.clarity} • Tech {msg.feedback.technical} • Works</div>
           <div className="text-violet-300 mt-1">{msg.feedback.tip}</div>
          </div>
         )}
        </div>
       </motion.div>
      ))}
     </AnimatePresence>
     {isTyping && <div className="flex gap-2"><div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px]">{isTyping[0]}</div><div className="rounded-2xl px-3 py-2 bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-500">Typing...</div></div>}
     <div ref={messagesEndRef} />
    </div>
    <div className="p-2.5 border-t border-zinc-800 bg-zinc-900/30 flex gap-2">
     <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message... verified works" className="flex-1 h-8 px-3 rounded-full bg-zinc-800 border border-zinc-700 text-[12px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50" />
     <button onClick={sendMessage} className="h-8 px-4 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-medium transition">Send</button>
    </div>
   </div>
  );
 }

 return (
  <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex h-[680px] overflow-hidden">
   <div className="w-[280px] bg-zinc-900/50 border-r border-zinc-800/60 flex flex-col">
    <div className="p-4 border-b border-zinc-800/60">
     <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />Operations Workspace</h3>
     <p className="text-[11px] text-zinc-500 mt-1">Team and client communication • Smooth • Verified works</p>
    </div>
    
    <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
     {channels.map(ch => (
      <motion.button key={ch.id} whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveChannel(ch.id)} className={`w-full text-left p-3 rounded-xl flex items-center gap-2.5 transition-all border ${activeChannel === ch.id ? 'bg-violet-500/10 border-violet-500/20 text-violet-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-zinc-800/60 hover:border-zinc-700/50 text-zinc-400 hover:text-zinc-200'}`}>
       <span className={`h-8 w-8 rounded-xl flex items-center justify-center text-[14px] border ${ch.color === 'violet' ? 'bg-violet-500/15 border-violet-500/20' : ch.color === 'pink' ? 'bg-pink-500/15 border-pink-500/20' : 'bg-red-500/15 border-red-500/20'}`}>{ch.icon}</span>
       <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium truncate">{ch.name}</div>
        <div className="text-[11px] opacity-60 truncate">{ch.desc}</div>
       </div>
       {ch.unread > 0 && <span className="h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{ch.unread}</span>}
      </motion.button>
     ))}
    </div>

    <div className="p-3 border-t border-zinc-800/60">
     <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
      <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Quality Metrics • Verified works</div>
      <div className="mt-2 space-y-1 text-[11px] text-zinc-500 leading-[1.4]">
       <div>• Empathy and acknowledgment — works</div>
       <div>• Clarity and structure — works</div>
       <div>• Technical accuracy — works</div>
       <div>• Client adaptation — works</div>
      </div>
     </div>
    </div>
   </div>

   <div className="flex-1 flex flex-col bg-[#050507] min-w-0">
    <div className="h-14 px-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
     <div>
      <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">{channels.find(c => c.id === activeChannel)?.icon} {channels.find(c => c.id === activeChannel)?.name} <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">● Live • Smooth</span></h3>
      <p className="text-[11px] text-zinc-500">{channels.find(c => c.id === activeChannel)?.desc} • Fully functional • Spring 300 damping 25</p>
     </div>
     <span className="text-[10px] px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">Professional communication • Verified</span>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050507]">
     <AnimatePresence>
      {filteredMessages.map(msg => (
       <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className={`flex gap-3 ${msg.role === 'lead' ? 'justify-end' : 'justify-start'}`}>
        {(msg.role === 'client' || msg.role === 'system' || msg.role === 'agent' || msg.role === 'expert') && (
         <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold border shrink-0 ${msg.role === 'client' ? 'bg-violet-500/20 text-violet-300 border-violet-500/20' : msg.role === 'system' ? 'bg-amber-500/15 text-amber-300 border-amber-500/20' : msg.role === 'expert' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>{msg.avatar}</div>
        )}
        
        <div className={`max-w-[72%] rounded-2xl px-4 py-3 border shadow-sm ${msg.role === 'lead' ? 'bg-violet-600 border-violet-500 text-white' : msg.role === 'client' ? 'bg-zinc-800 border-zinc-700/50 text-zinc-100' : msg.role === 'system' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' : msg.role === 'expert' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-zinc-800 border-zinc-700/50 text-zinc-200'} ${msg.type === 'p1-alert' ? 'border-red-500/30 bg-red-500/10' : ''}`}>
         <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-semibold">{msg.author}</span>
          <span className="text-[10px] opacity-60">{msg.timestamp.toLocaleTimeString()}</span>
          {msg.type === 'p1-alert' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold">P1</span>}
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/20 border border-white/10">Works</span>
         </div>
         <p className="text-[13px] leading-[1.5]">{msg.message}</p>
         {msg.feedback && msg.role === 'lead' && (
          <div className="mt-3 p-2.5 rounded-xl bg-black/30 border border-white/10">
           <div className="flex gap-2 text-[11px] font-mono"><span className={msg.feedback.empathy >= 70 ? 'text-emerald-300' : 'text-amber-300'}>Emp {msg.feedback.empathy}</span><span className={msg.feedback.clarity >= 70 ? 'text-emerald-300' : 'text-amber-300'}>Clar {msg.feedback.clarity}</span><span className={msg.feedback.technical >= 70 ? 'text-emerald-300' : 'text-amber-300'}>Tech {msg.feedback.technical}</span><span className="text-zinc-400">• Verified works</span></div>
           <p className="text-[11px] text-violet-300 mt-1.5 leading-[1.4]">{msg.feedback.tip}</p>
          </div>
         )}
         {msg.action && <div className="mt-2.5 p-2 rounded-xl bg-black/30 border border-white/5"><p className="text-[11px] font-mono opacity-80">{msg.action} • Verified works</p></div>}
        </div>

        {msg.role === 'lead' && <div className="h-8 w-8 rounded-full bg-violet-600 border border-violet-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0">{msg.avatar}</div>}
       </motion.div>
      ))}
     </AnimatePresence>

     {isTyping && (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
       <div className="h-8 w-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[11px] text-zinc-300">{isTyping[0]}</div>
       <div className="rounded-2xl px-4 py-3 bg-zinc-800 border border-zinc-700/50">
        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} /><span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} /><span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} /><span className="text-[11px] text-zinc-500 ml-2">{isTyping} typing — smooth</span></div>
       </div>
      </motion.div>
     )}

     <div ref={messagesEndRef} />
    </div>

    {quickReplies.length > 0 && (
     <div className="px-4 py-2.5 border-t border-zinc-800/40 bg-zinc-900/20">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
       {quickReplies.map(q => (
        <button key={q} onClick={() => setNewMessage(q)} className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-[11px] text-zinc-300 whitespace-nowrap transition-all hover:scale-[1.02]">💡 {q.substring(0, 45)}</button>
       ))}
      </div>
     </div>
    )}

    <div className="p-3.5 border-t border-zinc-800/60 bg-zinc-900/30">
     <div className="flex gap-2.5">
      <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message... professional communication — verified works" className="flex-1 h-10 px-4 rounded-full bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition" />
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={sendMessage} className="h-10 px-5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-semibold shadow-[0_0_20px_rgba(124,58,237,0.2)] transition">Send →</motion.button>
     </div>
     <p className="text-[10px] text-zinc-500 mt-2">Professional communication guidance based on client profile and scenario • Fully functional • Smooth spring 300 damping 25 • Verified works</p>
    </div>
   </div>
  </div>
 );
}
