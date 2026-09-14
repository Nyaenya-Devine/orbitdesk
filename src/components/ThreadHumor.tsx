'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Threading Humour — Recent Trending IT Support Humour
// Inspired by: Twitter/X threads, Reddit r/sysadmin, r/talesfromtechsupport, The IT Crowd, trending memes 2024-2026
// Adds human, relatable humour to OrbitDesk — not basic, real IT support life

interface Thread {
  id: string;
  category: 'P1 Horror' | 'User Logic' | 'DNS' | 'Cloud' | 'Password' | 'Ticket Hell' | 'Trending';
  setup: string;
  punchline: string;
  tags: string[];
  upvotes: number;
  time: string;
  author: string;
  isTrending?: boolean;
}

const threads: Thread[] = [
  {
    id: '1',
    category: 'P1 Horror',
    setup: 'P1 Ticket: "Entire company locked out, 50 users, payroll in 45 mins"',
    punchline: 'Root Cause: Someone pushed CA policy Require compliant device ON at 08:02 without Report-Only. The policy excluded Break Glass? No. Of course not. It\'s always the one thing you forget. 💀',
    tags: ['#ConditionalAccess', '#P1', '#53000', '#ReportOnlyMatters'],
    upvotes: 247,
    time: '2h ago',
    author: 'u/SysAdminNightmares',
    isTrending: true,
  },
  {
    id: '2',
    category: 'User Logic',
    setup: 'User: "My computer is slow"',
    punchline: 'Me: Checks Task Manager → 47 Chrome tabs, 12 Excel sheets, Teams, Outlook, Spotify, Photoshop, and "Why is my computer slow?" Google search open. User: "So is it the WiFi?"',
    tags: ['#ChromeTabs', '#TaskManager', '#UserLogic'],
    upvotes: 189,
    time: '4h ago',
    author: 'u/HelpdeskHero',
  },
  {
    id: '3',
    category: 'DNS',
    setup: 'It\'s never DNS...',
    punchline: '...except when it is DNS. And it\'s always DNS. Even when it\'s Conditional Access 53000 DeviceNotCompliant, it\'s somehow still DNS. Change my mind.',
    tags: ['#ItsAlwaysDNS', '#53000', '#SysAdminTruth'],
    upvotes: 423,
    time: '6h ago',
    author: 'u/DNS_Slayer',
    isTrending: true,
  },
  {
    id: '4',
    category: 'Password',
    setup: 'User: "My password is incorrect"',
    punchline: 'Me: "I know, you told me last time you changed it to Password123! and I told you it needs to be Password123$ this time." User: "But I liked the old one better"',
    tags: ['#Password123', '#MFA', '#Security'],
    upvotes: 156,
    time: '8h ago',
    author: 'u/PasswordPolice',
  },
  {
    id: '5',
    category: 'Cloud',
    setup: '"The cloud is just someone else\'s computer"',
    punchline: '...until that someone else\'s computer is in Conditional Access blocking your entire Finance team because BitLocker Compliance is NO and you forgot to enable it. Then the cloud is YOUR problem.',
    tags: ['#Cloud', '#BitLocker', '#Compliance'],
    upvotes: 298,
    time: '12h ago',
    author: 'u/CloudReality',
    isTrending: true,
  },
  {
    id: '6',
    category: 'Ticket Hell',
    setup: 'Ticket: "Outlook not working" Priority: P1',
    punchline: 'Description: "I can\'t see shared mailbox finance@bloomco.studio in Outlook, but I can see it in webmail. I have client call in 20 mins! Also, will I lose my unsaved Photoshop work if I restart? Explain like I\'m 5? 😅" — Me: *takes deep breath* "Click Start →..."',
    tags: ['#SMB', '#BloomCo', '#ExplainLikeIm5'],
    upvotes: 178,
    time: '1d ago',
    author: 'u/SMB_Support',
  },
  {
    id: '7',
    category: 'Trending',
    setup: 'We deleted prod...',
    punchline: '...said no one who used What If tool first. What If is the unsung hero of Conditional Access. Test your CA policy in What If before pushing to 50 users. This is the way. 🛡️',
    tags: ['#WhatIf', '#ConditionalAccess', '#WeDeletedProd'],
    upvotes: 512,
    time: '1d ago',
    author: 'u/WhatIfWarrior',
    isTrending: true,
  },
  {
    id: '8',
    category: 'P1 Horror',
    setup: 'Junior Admin: "I fixed Intune enrollment error 0x80180024!"',
    punchline: 'Senior: "How?" Junior: "I deleted the device from Entra and re-enrolled!" Senior: "Did you check device cap? Default is 5. User already has 5 devices. You just made it 6." Junior: "..." — Device cap strikes again.',
    tags: ['#0x80180024', '#DeviceCap', '#Intune'],
    upvotes: 203,
    time: '2d ago',
    author: 'u/IntunePain',
  },
  {
    id: '9',
    category: 'Trending',
    setup: 'Have you tried turning it off and on again?',
    punchline: 'User: "No, I thought you would do it remotely with your mind" — Me: *runs dsregcmd /leave and /join* — User: "Wow, it works! You ARE psychic!"',
    tags: ['#ITCrowd', '#dsregcmd', '#Magic'],
    upvotes: 367,
    time: '2d ago',
    author: 'u/ITCrowdIRL',
    isTrending: true,
  },
  {
    id: '10',
    category: 'User Logic',
    setup: 'User: "I didn\'t click anything, it just stopped working"',
    punchline: 'Audit Logs: "User pushed Conditional Access policy Require compliant device at 08:02 without Report-Only, affecting 50 users, no Break Glass exclusion" — User: "Oh, that click?"',
    tags: ['#AuditLogs', '#WhoChangedIt', '#08:02'],
    upvotes: 445,
    time: '3d ago',
    author: 'u/AuditLogTruth',
    isTrending: true,
  },
];

export default function ThreadHumor() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % threads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = threads[currentIndex];

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800/60 overflow-hidden">
      {/* Header — Threading Humour */}
      <div className="h-12 px-4 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[14px]">🧵</div>
          <div>
            <p className="text-[13px] font-semibold text-zinc-100 flex items-center gap-2">
              Thread Humour — IT Support IRL
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">Trending</span>
            </p>
            <p className="text-[11px] text-zinc-500">r/sysadmin • r/talesfromtechsupport • Recent threads • Auto-rotates every 5s</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`h-7 px-3 rounded-full text-[11px] font-medium border transition ${isAutoPlaying ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}
          >
            {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <span className="text-[11px] text-zinc-500">{currentIndex + 1}/{threads.length}</span>
        </div>
      </div>

      {/* Thread Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Category + Trending */}
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${
                current.category === 'P1 Horror' ? 'bg-red-500/10 text-red-300 border-red-500/20' :
                current.category === 'DNS' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                current.category === 'Trending' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {current.category}
              </span>
              {current.isTrending && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1">
                  🔥 Trending • {current.upvotes} upvotes
                </span>
              )}
              <span className="text-[11px] text-zinc-500">• {current.time} • {current.author}</span>
            </div>

            {/* Setup */}
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <p className="text-[13px] font-medium text-zinc-200 leading-[1.4]">"{current.setup}"</p>
            </div>

            {/* Punchline */}
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-[13px] text-zinc-100 leading-[1.5]">{current.punchline}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {current.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/50">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => toggleLike(current.id)}
                className={`h-7 px-3 rounded-full text-[12px] font-medium flex items-center gap-1.5 border transition ${
                  liked.has(current.id) ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border-zinc-700'
                }`}
              >
                <span>{liked.has(current.id) ? '❤️' : '🤣'}</span>
                {liked.has(current.id) ? current.upvotes + 1 : current.upvotes} {liked.has(current.id) ? 'LOL' : 'Upvote'}
              </button>
              <button className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-400 transition">
                💬 Comment
              </button>
              <button className="h-7 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-400 transition">
                🔗 Share Thread
              </button>
              <span className="ml-auto text-[10px] text-zinc-600">Recent threading humour • Relatable IT support life • Not basic</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Thread Navigation Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {threads.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-violet-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>

        {/* All Threads List — Collapsible */}
        <div className="mt-4 pt-4 border-t border-zinc-800/40">
          <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">All Threads — Click to Jump</p>
          <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto">
            {threads.map((thread, idx) => (
              <button
                key={thread.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsAutoPlaying(false);
                }}
                className={`text-left p-2 rounded-xl border transition text-[12px] leading-[1.3] ${
                  idx === currentIndex ? 'bg-violet-500/10 border-violet-500/20 text-zinc-100' : 'bg-zinc-900/30 border-zinc-800/30 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                <span className="font-medium">{thread.category}:</span> {thread.setup.substring(0, 60)}... • {thread.upvotes}⬆️ {thread.isTrending && '🔥'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-zinc-900/30 border-t border-zinc-800/30 flex items-center justify-between text-[10px] text-zinc-600">
        <span>🧵 Thread Humour • Recent trending IT support threads • r/sysadmin • r/talesfromtechsupport • Human, not AI basic</span>
        <span className="font-mono">v5.1 • Flowing + Funny • Livery Background</span>
      </div>
    </div>
  );
}
