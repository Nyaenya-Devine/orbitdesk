'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  channel: string;
  author: string;
  avatar: string;
  role: 'client' | 'agent' | 'lead' | 'system';
  message: string;
  timestamp: Date;
  type?: 'p1-alert' | 'csat' | 'conflict' | 'normal';
}

const initialMessages: Message[] = [
  { id: '1', channel: 'client-a', author: 'Sarah Finance', avatar: 'SF', role: 'client', message: "URGENT: Can't access Outlook, says device not compliant. Need payroll email!", timestamp: new Date(Date.now() - 1000*60*15), type: 'p1-alert' },
  { id: '2', channel: 'team-internal', author: 'Alex Mwangi', avatar: 'AM', role: 'agent', message: "Jamal keeps escalating easy M365 tickets, wasting my time. He escalated 3 today that are just Message Trace.", timestamp: new Date(Date.now() - 1000*60*10), type: 'conflict' },
  { id: '3', channel: 'team-internal', author: 'Priya Shah', avatar: 'PS', role: 'agent', message: "I can take the Entra CA block for NovaTech, I checked Sign-in logs CA tab - it's DeviceNotCompliant 53000, need Intune check.", timestamp: new Date(Date.now() - 1000*60*8) },
  { id: '4', channel: 'client-b', author: 'Emma Bloom', avatar: 'EB', role: 'client', message: "Hi, my shared mailbox finance@bloomco.studio is not showing in Outlook, but I see it in webmail. Help?", timestamp: new Date(Date.now() - 1000*60*5) },
  { id: '5', channel: 'escalations', author: 'System', avatar: 'SYS', role: 'system', message: "🚨 P1 ALERT: Client A - 50 users blocked by new CA policy 'Require compliant device' pushed at 08:02 by john.admin@novatech.com. SLA 60min.", timestamp: new Date(Date.now() - 1000*60*3), type: 'p1-alert' },
  { id: '6', channel: 'team-internal', author: 'Jamal Otieno', avatar: 'JO', role: 'agent', message: "Sorry team, I'm stuck on EXCH-001 quarantine release, not sure if I should allow sender. Can someone help?", timestamp: new Date(Date.now() - 1000*60*2) },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CommunicationChannel() {
  const [activeChannel, setActiveChannel] = useState('team-internal');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const channels = [
    { id: 'team-internal', name: '#team-internal', desc: 'Team chat', icon: '💬', unread: 2, color: 'bg-slate-800' },
    { id: 'client-a', name: '#client-a-novatech', desc: 'Enterprise Tech - 24/7', icon: '🏢', unread: 1, color: 'bg-blue-600' },
    { id: 'client-b', name: '#client-b-bloom', desc: 'SMB - 9-5', icon: '🎨', unread: 1, color: 'bg-emerald-600' },
    { id: 'client-c', name: '#client-c-apex', desc: 'Regulated - Compliance', icon: '🏦', unread: 0, color: 'bg-purple-600' },
    { id: 'escalations', name: '#escalations', desc: 'P1 & Major Incidents', icon: '🚨', unread: 1, color: 'bg-red-600' },
    { id: 'coaching', name: '#coaching-1-1s', desc: 'Private coaching notes', icon: '🎯', unread: 0, color: 'bg-violet-600' },
  ];

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

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
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        const randomClients = ['client-a', 'client-b', 'team-internal'];
        const randomMessages = [
          { author: 'Client User', avatar: 'CU', role: 'client' as const, message: "Any update on my ticket? SLA is ticking!", channel: randomFrom(randomClients) },
          { author: 'Lisa Chen', avatar: 'LC', role: 'agent' as const, message: "I fixed Teams presence issue by clearing cache %appdata%\\Microsoft\\Teams - CSAT 5!", channel: 'team-internal' },
          { author: 'System', avatar: 'SYS', role: 'system' as const, message: "📊 Ticket Trend Alert: INTUNE-001 (0x80180024) - 22 tickets this week - Recurring issue detected - Create Problem ticket?", channel: 'team-internal' },
        ];
        const randomMsg = randomFrom(randomMessages);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          channel: randomMsg.channel,
          author: randomMsg.author,
          avatar: randomMsg.avatar,
          role: randomMsg.role,
          message: randomMsg.message,
          timestamp: new Date(),
        }]);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex h-full overflow-hidden">
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-bold text-sm">Influx Workspace</h3>
          <p className="text-xs text-slate-400">Modern Workplace Support</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition ${activeChannel === ch.id ? 'bg-violet-600' : 'hover:bg-slate-800'}`}
            >
              <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${ch.color}`}>{ch.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{ch.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{ch.desc}</div>
              </div>
              {ch.unread > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{ch.unread}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            5 agents online • 44hr/week tracking
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{channels.find(c => c.id === activeChannel)?.name}</h3>
            <p className="text-xs text-slate-500">{channels.find(c => c.id === activeChannel)?.desc}</p>
          </div>
          <div className="text-xs text-slate-500">
            {activeChannel.startsWith('client-') ? 'Client comms - Prioritize listener' : 'Internal - Focus on facts'}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {filteredMessages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'lead' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${msg.role === 'client' ? 'bg-blue-600' : msg.role === 'lead' ? 'bg-violet-600' : msg.role === 'system' ? 'bg-slate-800' : 'bg-slate-600'}`}>
                {msg.avatar}
              </div>
              <div className={`flex-1 ${msg.role === 'lead' ? 'items-end' : ''} flex flex-col`}>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{msg.author}</span>
                  <span className="text-[11px] text-slate-500">{msg.timestamp.toLocaleTimeString()}</span>
                  {msg.type === 'p1-alert' && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded">P1</span>}
                  {msg.type === 'conflict' && <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded">Conflict</span>}
                </div>
                <div className={`mt-1 p-2.5 rounded-xl text-sm max-w-[80%] ${msg.role === 'lead' ? 'bg-violet-600 text-white' : msg.role === 'client' ? 'bg-white border border-slate-200' : msg.role === 'system' ? 'bg-amber-100 border border-amber-200' : 'bg-white border border-slate-200'} ${msg.type === 'p1-alert' ? 'border-red-300 bg-red-50' : ''}`}>
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex gap-2">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={activeChannel.startsWith('client-') ? "Reply to client - prioritize listener, simple language..." : "Message team - focus on facts, logs, Correlation ID..."}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700"
            >
              Send
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {activeChannel.startsWith('client-') ? '💡 Tip: For SMB, avoid jargon like "DeviceNotCompliant 53000". Say "Your device needs security update".' : '💡 Tip: For internal, share facts: Sign-in logs CA tab, Message Trace ID, dsregcmd output.'}
          </div>
        </div>
      </div>
    </div>
  );
}
