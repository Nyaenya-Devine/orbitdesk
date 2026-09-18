'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateCommunicationScore } from '@/lib/progressEngine';

function getIntelligentReplyDock(userMessage: string, chatId: string): string {
 const lower = userMessage.toLowerCase();
 if (chatId.includes('sarah') || chatId.includes('live-') && lower.includes('payroll') || lower.includes('outlook')) {
  if (lower.includes('dsregcmd')) return "Perfect — dsregcmd shows AzureADJoined YES but Compliant NO. Next: Open Company Portal (blue shopping bag) → Check Status → Wait 2 mins → Sync. Then dsregcmd again. Payroll unblocked in 3 mins. Thanks for checking!";
  if (lower.includes('company portal') || lower.includes('sync')) return "Company Portal syncing — last sync just now is good! Device compliance takes 2-3 mins after sync. Check Intune → Devices → Compliance — should show YES soon. Correlation ID will clear. You're doing great!";
  if (lower.includes('simple') || lower.includes('sorry') || lower.includes('understand')) return "Thanks! That explanation is much clearer — I appreciate you saying you understand payroll is urgent. Checking Sign-in logs CA tab now with empathy really helps. Five stars! ⭐⭐⭐⭐⭐";
  return "Thanks! I checked Company Portal — device not compliant, clicked Check Status. Still blocked, Correlation ID c4f2a9b1. Service Health green. Need payroll in 30 mins, P1! Your clear technical steps help a lot.";
 }
 if (chatId.includes('emma') || chatId.includes('bloom')) {
  if (lower.includes('simple') || lower.includes('click') || lower.includes('😅') || lower.includes('thanks')) return "Yes! It works now! Thank you! You explained in simple steps, no jargon, with emojis — perfect! I love that you used 😅 and simple clicks. ⭐⭐⭐⭐⭐ You really understand Bloom style!";
  if (lower.includes('outlook') || lower.includes('shared mailbox')) return "Shared mailbox not showing in Outlook but shows in webmail — that's normal! Webmail shows all automatically, Outlook needs manual add. Simple steps please? No jargon like DeviceNotCompliant? 😅";
  return "It works now! Thank you so much — simple steps really helped! No jargon, just clicks. Perfect for Bloom! 🙏⭐⭐⭐⭐⭐";
 }
 return "Got it! Trying now — shared my screen? Can you see Company Portal? I clicked Check Status — now says Syncing... what next? Thanks for simple steps! 🙏";
}

interface Message {
 id: string;
 author: string;
 avatar: string;
 text: string;
 time: string;
 isYou: boolean;
 type?: 'system';
}

interface ChatWindow {
 id: string;
 name: string;
 avatar: string;
 role: string;
 status: 'online' | 'away' | 'offline';
 messages: Message[];
 isTyping?: boolean;
 unread?: number;
}

const initialChats: ChatWindow[] = [
 {
 id: 'sarah',
 name: 'Sarah Finance',
 avatar: 'S',
 role: 'Finance • NovaTech Financial',
 status: 'online',
 unread: 1,
 messages: [
  { id: '1', author: 'Sarah Finance', avatar: 'S', text: "URGENT: Can't access Outlook, says device not compliant. Need payroll email! Correlation ID: a7f3c9e2", time: '1:37 PM', isYou: false },
  { id: '2', author: 'You', avatar: 'Y', text: "Hi Sarah, checking Entra sign-in logs now — can you run dsregcmd /status?", time: '1:38 PM', isYou: true },
 ],
 },
 {
 id: 'emma',
 name: 'Emma Bloom',
 avatar: 'E',
 role: 'Design • Bloom Studio',
 status: 'online',
 unread: 1,
 messages: [
  { id: '1', author: 'Emma Bloom', avatar: 'E', text: "Heyy! 😅 My shared mailbox finance@bloomco.studio not showing in Outlook, but I see it in webmail. Simple steps please?", time: '2:15 PM', isYou: false },
 ],
 },
 {
 id: 'team',
 name: 'Team Internal',
 avatar: '◍',
 role: '5 agents • 44h/week',
 status: 'online',
 unread: 2,
 messages: [
  { id: '1', author: 'Priya Shah', avatar: 'P', text: "I can take Entra CA block for NovaTech — checked Sign-in logs CA tab, DeviceNotCompliant 53000", time: '1:42 PM', isYou: false },
  { id: '2', author: 'Alex Mwangi', avatar: 'A', text: "Jamal keeps escalating easy tickets without checking logs", time: '1:45 PM', isYou: false },
 ],
 },
];

function ChatWindowComponent({ chat, onClose, onMinimize, onSend }: { chat: ChatWindow; onClose: () => void; onMinimize: () => void; onSend: (text: string) => void }) {
 const [input, setInput] = useState('');
 const messagesEndRef = useRef<HTMLDivElement>(null);

 useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat.messages]);

 const handleSend = () => {
 if (!input.trim()) return;
 onSend(input);
 setInput('');
 };

 return (
 <motion.div
  initial={{ y: 20, opacity: 0, scale: 0.95 }}
  animate={{ y: 0, opacity: 1, scale: 1 }}
  exit={{ y: 20, opacity: 0, scale: 0.95 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
  className="w-[320px] h-[400px] bg-white rounded-t-xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden"
 >
  {/* Header — LinkedIn style */}
  <div className="h-12 px-3 bg-white border-b border-zinc-200 flex items-center justify-between flex-shrink-0">
   <div className="flex items-center gap-2.5 min-w-0">
    <div className="relative">
     <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[12px] font-bold">{chat.avatar}</div>
     <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${chat.status === 'online' ? 'bg-emerald-500' : chat.status === 'away' ? 'bg-amber-500' : 'bg-zinc-400'}`} />
    </div>
    <div className="min-w-0">
     <p className="text-[13px] font-semibold text-zinc-900 truncate flex items-center gap-1">{chat.name} {chat.status === 'online' && <span className="h-1 w-1 rounded-full bg-emerald-500" />}</p>
     <p className="text-[11px] text-zinc-500 truncate">{chat.role}</p>
    </div>
   </div>
   <div className="flex items-center gap-0.5">
    <button onClick={onMinimize} className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500">—</button>
    <button onClick={onClose} className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500">✕</button>
   </div>
  </div>

  {/* Date separator — LinkedIn style */}
  <div className="px-4 py-2 text-center">
   <span className="text-[11px] text-zinc-500 font-medium tracking-wide">MONDAY</span>
   <div className="h-px bg-zinc-100 mt-2" />
  </div>

  {/* Messages — LinkedIn bubble style */}
  <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 bg-[#f4f2ee]">
   {chat.messages.map(msg => (
    <div key={msg.id} className={`flex gap-2 ${msg.isYou ? 'justify-end' : 'justify-start'}`}>
     {!msg.isYou && <div className="h-7 w-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">{msg.avatar}</div>}
     <div className={`max-w-[75%] ${msg.isYou ? 'order-first' : ''}`}>
      <div className={`rounded-2xl px-3 py-2 text-[13px] leading-[1.4] ${msg.isYou ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-white border border-zinc-200 text-zinc-900 rounded-bl-sm shadow-sm'}`}>
       <p className="font-semibold text-[12px] mb-0.5 flex items-center gap-1.5">
        {msg.author} <span className="font-normal text-[11px] opacity-60">• {msg.time}</span>
        {msg.isYou && <span className="ml-1 text-[10px] opacity-70">✓✓</span>}
       </p>
       <p>{msg.text}</p>
      </div>
     </div>
    </div>
   ))}
   {chat.isTyping && (
    <div className="flex gap-2">
     <div className="h-7 w-7 rounded-full bg-zinc-700 flex items-center justify-center text-[11px] text-white">{chat.avatar}</div>
     <div className="bg-white border border-zinc-200 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
      <div className="flex gap-1"><span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" /><span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><span className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div>
     </div>
    </div>
   )}
   <div ref={messagesEndRef} />
   
   {/* LinkedIn info */}
   <div className="flex gap-2 items-start p-2 rounded-xl bg-blue-50 border border-blue-100 mt-3">
    <span className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] flex-shrink-0">i</span>
    <p className="text-[11px] text-zinc-600">You haven't received a response yet. <span className="text-blue-600 font-medium hover:underline cursor-pointer">Learn more</span></p>
   </div>
  </div>

  {/* Input — LinkedIn style */}
  <div className="p-2.5 bg-white border-t border-zinc-200 flex-shrink-0">
   <div className="flex items-center gap-2 bg-[#f4f2ee] rounded-full px-3 h-9 border border-zinc-200 focus-within:border-violet-300 focus-within:ring-1 focus-within:ring-violet-200 transition">
    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={`Write a message to ${chat.name.split(' ')[0]}...`} className="flex-1 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-500 focus:outline-none" />
    <button className="text-zinc-400 hover:text-zinc-600">😊</button>
    <button className="text-zinc-400 hover:text-zinc-600">📎</button>
   </div>
   <div className="flex items-center justify-between mt-2 px-1">
    <div className="flex gap-1">
     <button className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-[14px]">🖼️</button>
     <button className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-[14px]">🎥</button>
     <button className="h-7 w-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-[14px]">📎</button>
    </div>
    <button onClick={handleSend} disabled={!input.trim()} className="h-7 px-4 rounded-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white text-[12px] font-semibold transition">Send</button>
   </div>
  </div>
 </motion.div>
 );
}

export default function LinkedInChatDock({ ticket, isPaused }: { ticket?: any; isPaused?: boolean }) {
 const [isOpen, setIsOpen] = useState(false);
 const [openChats, setOpenChats] = useState<ChatWindow[]>([]);
 const [chats, setChats] = useState<ChatWindow[]>(initialChats);

 // Auto-open live ticket chat when ticket selected
 useEffect(() => {
 if (ticket && !openChats.find(c => c.id === `live-${ticket.code}`)) {
  const liveChat: ChatWindow = {
   id: `live-${ticket.code}`,
   name: ticket.userEmail.split('@')[0],
   avatar: ticket.userEmail[0].toUpperCase(),
   role: `${ticket.code} • ${ticket.clientName}`,
   status: 'online',
   messages: [{ id: '1', author: ticket.userEmail.split('@')[0], avatar: ticket.userEmail[0].toUpperCase(), text: ticket.userMessage, time: 'Now', isYou: false }],
  };
  setOpenChats(prev => prev.length >= 2 ? [liveChat, ...prev.slice(0,1)] : [...prev, liveChat]);
  setIsOpen(true);
 }
 }, [ticket]);

 const openChat = (chatId: string) => {
 const chat = chats.find(c => c.id === chatId);
 if (!chat) return;
 if (openChats.find(c => c.id === chatId)) return;
 setOpenChats(prev => prev.length >= 2 ? [chat, ...prev.slice(0,1)] : [...prev, chat]);
 setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: 0 } : c));
 };

 const handleSend = (chatId: string, text: string) => {
 // Advanced scoring for dock messages too
 const persona = chatId.includes('emma') || chatId.includes('bloom') ? 'smb' as const : chatId.includes('apex') ? 'regulated' as const : 'enterprise' as const;
 const scores = calculateCommunicationScore(text, persona, {
  usedClientLanguage: /simple|correlation|sec-2024-07|😅|🥺|🙏/i.test(text),
  checkedLogs: /sign-in logs|audit logs|service health|dsregcmd|company portal/i.test(text),
  usedCorrectTool: /entra|intune|company portal|what if|bitlocker/i.test(text),
 });
 console.log(`[OrbitDesk Advanced] Chat ${chatId} — Emp ${scores.empathy} Clar ${scores.clarity} Tech ${scores.technicalAccuracy} Flu ${scores.fluency} Lang ${scores.clientLanguage}`);

 const newMsg: Message = { id: Date.now().toString(), author: 'You', avatar: 'Y', text, time: 'Now', isYou: true };
 setOpenChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c));
 setTimeout(() => {
  setOpenChats(prev => prev.map(c => c.id === chatId ? { ...c, isTyping: true } : c));
  setTimeout(() => {
   const intelligentReply = getIntelligentReplyDock(text, chatId);
   const reply: Message = { id: (Date.now()+1).toString(), author: openChats.find(c=>c.id===chatId)?.name || 'Client', avatar: openChats.find(c=>c.id===chatId)?.avatar || 'C', text: intelligentReply, time: 'Now', isYou: false };
   setOpenChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, reply], isTyping: false } : c));
  }, 900);
 }, 200);
 };

 const totalUnread = chats.reduce((a,b) => a + (b.unread || 0), 0);

 return (
 <>
  {/* Chat windows row */}
  <div className="fixed bottom-0 right-[360px] z-[60] flex gap-3 items-end pointer-events-none">
   <div className="flex gap-3 pointer-events-auto">
    <AnimatePresence>
     {openChats.map(chat => (
      <ChatWindowComponent key={chat.id} chat={chat} onClose={() => setOpenChats(prev => prev.filter(c => c.id !== chat.id))} onMinimize={() => setOpenChats(prev => prev.filter(c => c.id !== chat.id))} onSend={(text) => handleSend(chat.id, text)} />
     ))}
    </AnimatePresence>
   </div>
  </div>

  {/* Messaging Dock — LinkedIn style bottom-right — compact non-intrusive, doesn't overwrite, Teams-like 420px for calls only */}
  <div className="fixed bottom-0 right-4 z-[40] w-[300px] pointer-events-auto">
   <motion.div layout className="bg-white rounded-t-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-zinc-200 overflow-hidden">
    <button onClick={() => setIsOpen(!isOpen)} className="w-full h-10 px-3 bg-white hover:bg-zinc-50 flex items-center justify-between border-b border-zinc-200 transition">
     <div className="flex items-center gap-2">
      <div className="relative">
       <img src="/icon-512.png" alt="" className="h-7 w-7 rounded-full object-cover" />
       <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white" />
      </div>
      <span className="text-[13px] font-semibold text-zinc-900">Messaging</span>
      {totalUnread > 0 && <span className="h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{totalUnread}</span>}
      {isPaused && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Paused</span>}
     </div>
     <div className="flex items-center gap-0.5">
      <span className="h-6 w-6 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 text-[12px]">•••</span>
      <span className="h-6 w-6 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 text-[12px]">✎</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="h-6 w-6 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500 text-[12px]">⌃</motion.span>
     </div>
    </button>

    <AnimatePresence>
     {isOpen && (
      <motion.div initial={{ height: 0 }} animate={{ height: 360 }} exit={{ height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
       <div className="h-[360px] flex flex-col bg-white">
        <div className="p-2">
         <div className="h-8 bg-[#edf3f8] rounded-full flex items-center px-3 gap-2 border border-zinc-200">
          <span className="text-zinc-500">🔍</span>
          <input placeholder="Search messages" className="flex-1 bg-transparent text-[13px] placeholder:text-zinc-500 focus:outline-none" />
          <span className="text-zinc-400">⚙️</span>
         </div>
        </div>
        
        <div className="flex gap-1 px-2 pb-2 border-b border-zinc-100">
         <button className="h-7 px-3 rounded-full bg-emerald-600 text-white text-[12px] font-medium">Focused</button>
         <button className="h-7 px-3 rounded-full bg-zinc-100 text-zinc-600 text-[12px]">Other</button>
        </div>

        <div className="flex-1 overflow-y-auto">
         {chats.map(chat => (
          <button key={chat.id} onClick={() => openChat(chat.id)} className="w-full text-left p-2.5 hover:bg-zinc-50 flex gap-2.5 border-b border-zinc-50 transition">
           <div className="relative flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[13px] font-bold">{chat.avatar}</div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${chat.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
           </div>
           <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
             <p className="text-[13px] font-semibold text-zinc-900 truncate">{chat.name}</p>
             <span className="text-[11px] text-zinc-500">1:37 PM</span>
            </div>
            <p className="text-[12px] text-zinc-600 truncate">{chat.messages[chat.messages.length-1]?.text.substring(0,45)}...</p>
            <p className="text-[11px] text-zinc-500 truncate">{chat.role}</p>
           </div>
           {chat.unread ? <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" /> : null}
          </button>
         ))}
        </div>

        <div className="p-2 border-t border-zinc-200 bg-[#f4f2ee]">
         <p className="text-[11px] text-zinc-600 text-center">OrbitDesk — Real MSP chat • Presence • Typing • Files</p>
        </div>
       </div>
      </motion.div>
     )}
    </AnimatePresence>
   </motion.div>
  </div>
 </>
 );
}
