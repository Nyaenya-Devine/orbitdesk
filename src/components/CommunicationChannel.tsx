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
    isTyping: false,
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
  },
];

const autoReplies: Record<string, { author: string; avatar: string; role: Message['role']; messages: string[]; actions?: string[] }> = {
  'team-internal': {
    author: 'Priya Shah',
    avatar: 'P',
    role: 'expert',
    messages: [
      "Checking Entra Audit Logs now — Correlation ID? What If shows safe with 15min expiry.",
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
      "I ran dsregcmd /status — Device State: AzureADJoined YES, DomainJoined NO, Compliant NO.",
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

export default function CommunicationChannel() {
  const [activeChannel, setActiveChannel] = useState('team-internal');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<{ author: string; channel: string } | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'team-internal', name: '#team-internal', desc: 'Team chat • 5 agents • 44h/week', icon: '💬', unread: 2, color: 'violet', online: 5 },
    { id: 'client-a', name: '#client-a-novatech', desc: 'Enterprise 24/7 • P1 60min • Technical', icon: '🏢', unread: 1, color: 'violet', online: 1 },
    { id: 'client-b', name: '#client-b-bloom', desc: 'SMB 9-5 • P2 8h • Simple language', icon: '🎨', unread: 1, color: 'pink', online: 1 },
    { id: 'escalations', name: '#escalations', desc: 'P1 & Major • What If • Break Glass', icon: '🚨', unread: 1, color: 'red', online: 3 },
  ];

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

  const quickReplies = activeChannel === 'team-internal' 
    ? [
        "Checking Entra Audit Logs now, Correlation ID?",
        "What If shows safe with 15min expiry — approve?",
        "Break Glass verified, excluded from CA",
        "Message Trace: Exchange Admin → Mail Flow → Trace → release",
        "Per SEC-2024-07, need audit trail + key escrow",
      ]
    : activeChannel.startsWith('client-')
    ? [
        "Simple steps: Click Start → Settings → Accounts...",
        "Can you share what you see on screen?",
        "What If shows safe — I can fix in 2 mins",
        "Checked Service Health — all green, no incidents",
        "I'll explain without jargon, step-by-step",
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
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    // Simulate typing and auto-reply — makes comms responsive
    const replyConfig = autoReplies[activeChannel];
    if (replyConfig) {
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
      }, 1500 + Math.random() * 1000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.12) {
        const channelIds = ['team-internal', 'client-a', 'client-b'];
        const randomChannel = randomFrom(channelIds);
        const config = autoReplies[randomChannel];
        if (config && randomChannel !== activeChannel) {
          // Only add to other channels to avoid spam in active
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
  }, [activeChannel]);

  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 shadow-sm flex h-[600px] overflow-hidden">
      {/* Sidebar — Linear dark-first violet, quiet chrome */}
      <div className="w-[260px] bg-zinc-900/50 border-r border-zinc-800/60 flex flex-col">
        <div className="p-3.5 border-b border-zinc-800/60">
          <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            OrbitDesk Workspace
          </h3>
          <p className="text-[11px] text-zinc-500 mt-1">Real-time • 5 agents • 44h/week • Voice</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-all border ${activeChannel === ch.id ? 'bg-violet-500/10 border-violet-500/20 text-violet-200' : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700/30 text-zinc-400 hover:text-zinc-200'}`}
            >
              <span className={`h-7 w-7 rounded-lg flex items-center justify-center text-[13px] border ${ch.color === 'violet' ? 'bg-violet-500/15 border-violet-500/20' : ch.color === 'pink' ? 'bg-pink-500/15 border-pink-500/20' : 'bg-red-500/15 border-red-500/20'}`}>{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate">{ch.name}</div>
                <div className="text-[11px] opacity-60 truncate">{ch.desc}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                {ch.unread > 0 && <span className="h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{ch.unread}</span>}
                <span className="text-[10px] opacity-40">{ch.online} online</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800/60">
          <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/30">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              5 agents online • Live • Voice ready
            </div>
            <div className="flex gap-1 mt-2">
              {['N','A','P','D','L'].map(a => (
                <div key={a} className="h-5 w-5 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[10px] text-zinc-300">{a}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main chat — Intercom human bubbles, not basic AI */}
      <div className="flex-1 flex flex-col bg-[#050507]">
        <div className="h-12 px-4 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
              {channels.find(c => c.id === activeChannel)?.icon} {channels.find(c => c.id === activeChannel)?.name}
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">Live • Responsive</span>
            </h3>
            <p className="text-[11px] text-zinc-500">{channels.find(c => c.id === activeChannel)?.desc} • {activeChannel.startsWith('client-') ? 'Prioritize listener, simple language' : 'Focus on facts, logs, Correlation ID'}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">5 Voices</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">What If</span>
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
                  {msg.type === 'conflict' && <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500 text-white">Conflict</span>}
                  {msg.type === 'question' && <span className="text-[10px] px-1 py-0.5 rounded bg-violet-500 text-white">Q</span>}
                </div>
                <p className="text-[13px] leading-[1.4]">{msg.message}</p>
                {msg.action && (
                  <div className="mt-2 p-2 rounded-lg bg-black/30 border border-white/5">
                    <p className="text-[11px] font-mono opacity-70">Action: {msg.action}</p>
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
                  <span className="text-[11px] text-zinc-500 ml-2">{isTyping.author} is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies — like OrbitDesk human templates, makes less complicated */}
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
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={activeChannel.startsWith('client-') ? "Reply to client — simple language, no jargon, emojis okay..." : "Message team — facts, logs, Correlation ID, What If..."}
              className="flex-1 h-9 px-3 rounded-xl bg-zinc-800 border border-zinc-700/50 text-[13px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
            />
            <button
              onClick={sendMessage}
              className="h-9 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition-colors"
            >
              Send
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-zinc-500">
              {activeChannel.startsWith('client-') ? '💡 Tip: For SMB Bloom, avoid jargon "DeviceNotCompliant 53000". Say "Your device needs security update".' : '💡 Tip: For internal, share facts: Sign-in logs CA tab, Message Trace ID, dsregcmd output, What If.'}
            </p>
            <span className="text-[10px] text-zinc-600">Responsive • Auto-replies • Typing indicator • Human feel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
