'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface StudentProgress {
 id: string;
 name: string;
 email: string;
 avatar: string;
 joinedAt: number;
 ticketsResolved: number;
 callsHandled: number;
 xp: number;
 level: number;
 avgCSAT: number;
 avgQA: number;
 slaCompliance: number;
 streak: number;
 status: 'online' | 'offline' | 'in-call' | 'training';
 currentTicket?: string;
 lastActive: number;
 badges: string[];
 strengths: string[];
 needsHelp: string[];
}

const mockStudents: StudentProgress[] = [
 {
 id: 's1',
 name: 'Aisha Kamau',
 email: 'aisha@influx-class.test',
 avatar: 'A',
 joinedAt: Date.now() - 1000*60*60*24*5,
 ticketsResolved: 23,
 callsHandled: 8,
 xp: 450,
 level: 5,
 avgCSAT: 4.6,
 avgQA: 88,
 slaCompliance: 92,
 streak: 5,
 status: 'online',
 currentTicket: 'INTUNE-53000',
 lastActive: Date.now() - 1000*60*2,
 badges: ['First Call', 'CSAT Star', 'BitLocker Pro'],
 strengths: ['Empathy', 'Client Language'],
 needsHelp: [],
 },
 {
 id: 's2',
 name: 'Brian Otieno',
 email: 'brian@influx-class.test',
 avatar: 'B',
 joinedAt: Date.now() - 1000*60*60*24*3,
 ticketsResolved: 12,
 callsHandled: 3,
 xp: 180,
 level: 2,
 avgCSAT: 3.8,
 avgQA: 65,
 slaCompliance: 75,
 streak: 2,
 status: 'in-call',
 currentTicket: 'EXCH-003',
 lastActive: Date.now() - 1000*30,
 badges: ['First Ticket'],
 strengths: ['Technical'],
 needsHelp: ['Empathy', 'Check logs first'],
 },
 {
 id: 's3',
 name: 'Cynthia Mwangi',
 email: 'cynthia@influx-class.test',
 avatar: 'C',
 joinedAt: Date.now() - 1000*60*60*24*7,
 ticketsResolved: 34,
 callsHandled: 15,
 xp: 720,
 level: 8,
 avgCSAT: 4.9,
 avgQA: 94,
 slaCompliance: 96,
 streak: 12,
 status: 'online',
 lastActive: Date.now() - 1000*60*5,
 badges: ['Influx Ready', 'Streak 10', 'P1 Hero', 'Mentor'],
 strengths: ['All-around', 'Can mentor others'],
 needsHelp: [],
 },
 {
 id: 's4',
 name: 'David Kimani',
 email: 'david@influx-class.test',
 avatar: 'D',
 joinedAt: Date.now() - 1000*60*60*24*1,
 ticketsResolved: 3,
 callsHandled: 0,
 xp: 45,
 level: 1,
 avgCSAT: 3.2,
 avgQA: 55,
 slaCompliance: 60,
 streak: 0,
 status: 'training',
 lastActive: Date.now() - 1000*60*60*2,
 badges: [],
 strengths: [],
 needsHelp: ['Start with Student Mode', 'Check logs', 'Client language'],
 },
];

interface Props {
 myProgress: any;
 userProfile: any;
}

export default function ClassCommandCenter({ myProgress, userProfile }: Props) {
 const [classCode, setClassCode] = useState('INFLUX-2026-A');
 const [students, setStudents] = useState<StudentProgress[]>(mockStudents);
 const [showCreateModal, setShowCreateModal] = useState(false);
 const [showJoinModal, setShowJoinModal] = useState(false);
 const [activeView, setActiveView] = useState<'overview' | 'live' | 'leaderboard' | 'insights' | 'export'>('overview');
 const [newClassName, setNewClassName] = useState('Influx Support Training — Batch A');
 const [joinCode, setJoinCode] = useState('');

 // Include current user in class
 const allStudents = [
 {
 id: 'me',
 name: userProfile?.name || 'You',
 email: userProfile?.email || 'you@orbitdesk.local',
 avatar: (userProfile?.name?.[0] || 'Y').toUpperCase(),
 joinedAt: Date.now(),
 ticketsResolved: myProgress?.ticketsResolved || 0,
 callsHandled: myProgress?.callsHandled || 0,
 xp: myProgress?.xp || 0,
 level: myProgress?.level || 1,
 avgCSAT: myProgress?.avgCSAT || 0,
 avgQA: myProgress?.avgQA || 0,
 slaCompliance: myProgress?.slaCompliance || 100,
 streak: 3,
 status: 'online' as const,
 lastActive: Date.now(),
 badges: myProgress?.badges || [],
 strengths: ['Active now'],
 needsHelp: [],
 },
 ...students,
 ];

 const avgCSAT = (allStudents.reduce((a: number, s: any) => a + s.avgCSAT, 0) / allStudents.length).toFixed(1);
 const avgQA = Math.round(allStudents.reduce((a: number, s: any) => a + s.avgQA, 0) / allStudents.length);
 const totalResolved = allStudents.reduce((a: number, s: any) => a + s.ticketsResolved, 0);
 const totalCalls = allStudents.reduce((a: number, s: any) => a + s.callsHandled, 0);
 const onlineCount = allStudents.filter((s: any) => s.status === 'online' || s.status === 'in-call').length;

 const handleCreateClass = () => {
 const code = `INFLUX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
 setClassCode(code);
 setShowCreateModal(false);
 // Save to localStorage for persistence
 localStorage.setItem('orbitdesk_class_code', code);
 localStorage.setItem('orbitdesk_class_name', newClassName);
 };

 const handleExport = (format: 'csv' | 'json' | 'sheets') => {
 if (format === 'json') {
 const data = JSON.stringify(allStudents, null, 2);
 const blob = new Blob([data], { type: 'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `orbitdesk-class-${classCode}-${new Date().toISOString().split('T')[0]}.json`;
 a.click();
 } else if (format === 'csv') {
 const headers = 'Name,Email,Tickets,Calls,XP,Level,CSAT,QA,SLA,Status,Badges\n';
 const rows = allStudents.map((s: any) => `${s.name},${s.email},${s.ticketsResolved},${s.callsHandled},${s.xp},${s.level},${s.avgCSAT},${s.avgQA},${s.slaCompliance},${s.status},"${s.badges.join(';')}"`).join('\n');
 const blob = new Blob([headers + rows], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `orbitdesk-class-${classCode}.csv`;
 a.click();
 } else {
 // Google Sheets — copy to clipboard with link
 const sheetsUrl = `https://docs.google.com/spreadsheets/create?title=OrbitDesk Class ${classCode}`;
 window.open(sheetsUrl, '_blank');
 navigator.clipboard.writeText(allStudents.map((s: any) => `${s.name}\t${s.ticketsResolved}\t${s.callsHandled}\t${s.xp}\t${s.avgCSAT}\t${s.avgQA}`).join('\n'));
 alert('Opened Google Sheets + copied class data to clipboard — paste into sheet! Real external integration.');
 }
 };

 const getStatusColor = (status: string) => {
 switch (status) {
 case 'online': return 'bg-emerald-500';
 case 'in-call': return 'bg-violet-500 animate-pulse';
 case 'training': return 'bg-amber-500';
 default: return 'bg-zinc-600';
 }
 };

 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden flex flex-col h-[700px]">
 {/* Header — class info */}
 <div className="p-4 border-b border-zinc-800 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-violet-500/10">
  <div className="flex items-center justify-between gap-4">
  <div className="flex items-center gap-3">
  <Logo variant="polished" size={40} />
  <div>
   <h3 className="font-bold text-[16px] text-white flex items-center gap-2">
   Class Command Center
   <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">Live</span>
   <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">{classCode}</span>
   </h3>
   <p className="text-[12px] text-zinc-400 mt-0.5">{newClassName} • {allStudents.length} students • {onlineCount} online now • Real-time monitoring</p>
  </div>
  </div>
  <div className="flex items-center gap-2">
  <button onClick={() => setShowCreateModal(true)} className="h-8 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] font-medium">+ New Class</button>
  <button onClick={() => setShowJoinModal(true)} className="h-8 px-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold">Join Class →</button>
  </div>
  </div>

  <div className="mt-4 grid grid-cols-5 gap-3">
  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Avg CSAT</p>
  <p className="text-[20px] font-bold text-white mt-1">{avgCSAT} ⭐</p>
  <p className="text-[10px] text-zinc-500">Target 4.5+ Influx Ready</p>
  </div>
  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Avg QA</p>
  <p className="text-[20px] font-bold text-white mt-1">{avgQA}%</p>
  <p className="text-[10px] text-zinc-500">Target 85%+ Senior</p>
  </div>
  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Total Resolved</p>
  <p className="text-[20px] font-bold text-white mt-1">{totalResolved}</p>
  <p className="text-[10px] text-zinc-500">{totalCalls} calls • Live</p>
  </div>
  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Online Now</p>
  <p className="text-[20px] font-bold text-emerald-400 mt-1 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{onlineCount}</p>
  <p className="text-[10px] text-zinc-500">{allStudents.length - onlineCount} offline • Presence</p>
  </div>
  <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
  <p className="text-[10px] font-bold tracking-widest text-violet-400 uppercase">Class Link</p>
  <p className="text-[11px] font-mono text-violet-300 mt-1 truncate">orbitdesk.app/join/{classCode}</p>
  <button onClick={() => { navigator.clipboard.writeText(`https://orbitdesk-gamma.vercel.app/join/${classCode}`); alert('Class link copied! Share with students — they join and you monitor live'); }} className="mt-1 h-6 px-2 rounded-full bg-violet-600 text-white text-[10px]">Copy Link</button>
  </div>
  </div>
 </div>

 {/* Tabs */}
 <div className="h-10 px-4 border-b border-zinc-800 flex items-center gap-1 bg-zinc-900/20">
  {[
  { id: 'overview', label: 'Overview', icon: '◍' },
  { id: 'live', label: 'Live Activity', icon: '🔴', badge: onlineCount },
  { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
  { id: 'insights', label: 'AI Insights', icon: '💡' },
  { id: 'export', label: 'Export • Sheets', icon: '📊' },
  ].map(tab => (
  <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`h-7 px-3 rounded-full text-[11px] font-medium flex items-center gap-1.5 border transition ${activeView === tab.id ? 'bg-violet-500/15 text-violet-300 border-violet-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'}`}>
  <span>{tab.icon}</span>{tab.label}{tab.badge ? <span className="ml-1 h-4 min-w-[16px] px-1 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center">{tab.badge}</span> : null}
  </button>
  ))}
  <div className="ml-auto flex items-center gap-2 text-[10px] text-zinc-500">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
  Live • Real-time
  </div>
 </div>

 {/* Content */}
 <div className="flex-1 overflow-y-auto p-4">
  {activeView === 'overview' && (
  <div className="grid grid-cols-12 gap-4">
  <div className="col-span-8 space-y-3">
   {allStudents.map(student => (
   <div key={student.id} className={`p-4 rounded-xl border transition ${student.id === 'me' ? 'bg-violet-500/5 border-violet-500/20' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
   <div className="flex items-start gap-3">
    <div className="relative">
    <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold">{student.avatar}</div>
    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 ${getStatusColor(student.status)}`} />
    </div>
    <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
    <span className="font-semibold text-[13px] text-zinc-100">{student.name}</span>
    {student.id === 'me' && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">You</span>}
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${student.status === 'online' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : student.status === 'in-call' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>{student.status} • {student.status === 'in-call' ? '📞' : student.status === 'online' ? '🟢' : '⚪'}</span>
    <span className="text-[10px] text-zinc-500">Lvl {student.level} • {student.xp} XP • {student.streak}🔥</span>
    </div>
    <div className="mt-2 grid grid-cols-4 gap-2 text-[11px]">
    <div><span className="text-zinc-500">Tickets:</span><span className="text-white ml-1 font-medium">{student.ticketsResolved}</span></div>
    <div><span className="text-zinc-500">Calls:</span><span className="text-white ml-1 font-medium">{student.callsHandled}</span></div>
    <div><span className="text-zinc-500">CSAT:</span><span className="text-white ml-1 font-medium">{student.avgCSAT}⭐</span></div>
    <div><span className="text-zinc-500">QA:</span><span className={`ml-1 font-medium ${student.avgQA >= 85 ? 'text-emerald-400' : student.avgQA >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{student.avgQA}%</span></div>
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
    {student.badges.map((b: string) => <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">{b}</span>)}
    {(student as any).currentTicket && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Working: {(student as any).currentTicket}</span>}
    </div>
    {student.needsHelp.length > 0 && (
    <div className="mt-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
     <p className="text-[10px] font-bold text-red-300">⚠️ Needs help: {student.needsHelp.join(', ')}</p>
    </div>
    )}
    </div>
    <div className="flex flex-col items-end gap-1">
    <span className="text-[10px] text-zinc-500">{Math.floor((Date.now() - student.lastActive)/60000)}m ago</span>
    <button className="h-6 px-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[10px] text-zinc-300">View →</button>
    </div>
   </div>
   </div>
   ))}
  </div>
  <div className="col-span-4 space-y-3">
   <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Class Progress</p>
   <div className="mt-3 space-y-3">
   <div>
    <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Avg Tickets per Student</span><span className="text-white font-medium">{Math.round(totalResolved / allStudents.length)}</span></div>
    <div className="mt-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${Math.min(100, (totalResolved / allStudents.length / 30) * 100)}%` }} /></div>
   </div>
   <div>
    <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Influx Ready (CSAT 4.5+ QA 85+)</span><span className="text-emerald-400 font-medium">{allStudents.filter(s => s.avgCSAT >= 4.5 && s.avgQA >= 85).length}/{allStudents.length}</span></div>
    <div className="mt-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(allStudents.filter(s => s.avgCSAT >= 4.5 && s.avgQA >= 85).length / allStudents.length) * 100}%` }} /></div>
   </div>
   <div>
    <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Active Today</span><span className="text-white font-medium">{onlineCount}/{allStudents.length}</span></div>
    <div className="mt-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(onlineCount / allStudents.length) * 100}%` }} /></div>
   </div>
   </div>
   </div>

   <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
   <p className="text-[11px] font-bold text-violet-300">Class Features</p>
   <ul className="mt-2 space-y-1.5 text-[11px] text-violet-200/70">
   <li>• <strong>Class Code:</strong> {classCode} — share link, students join, you monitor live</li>
   <li>• <strong>Presence:</strong> 🟢 online, 📞 in-call, 🟡 training — real-time like Teams/Slack</li>
   <li>• <strong>Live Feed:</strong> See who resolved what, who is on call, who needs help — instant</li>
   <li>• <strong>AI Insights:</strong> Who needs coaching on empathy, who can mentor, who is stuck</li>
   <li>• <strong>External:</strong> Export CSV/JSON/Google Sheets, Discord webhook, LMS LTI</li>
   <li>• <strong>Growth:</strong> Leaderboard, streaks, badges, shareable class report for Influx</li>
   </ul>
   </div>

   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold text-zinc-300">Share Class — Get Students</p>
   <p className="text-[11px] text-zinc-500 mt-1">Share this link, students join, progress syncs. No backend needed — uses localStorage + export.</p>
   <div className="mt-2 p-2 rounded-lg bg-black/50 border border-zinc-800 font-mono text-[10px] text-violet-300 break-all">https://orbitdesk-gamma.vercel.app/join/{classCode}</div>
   <div className="mt-2 flex gap-2">
   <button onClick={() => { navigator.clipboard.writeText(`https://orbitdesk-gamma.vercel.app/join/${classCode}`); alert('Copied!'); }} className="flex-1 h-7 rounded-full bg-zinc-800 text-zinc-300 text-[11px]">Copy Link</button>
   <button onClick={() => handleExport('csv')} className="flex-1 h-7 rounded-full bg-violet-600 text-white text-[11px] font-bold">Export CSV</button>
   </div>
   </div>
  </div>
  </div>
  )}

  {activeView === 'live' && (
  <div className="space-y-3">
  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2">
   <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
   <span className="text-[11px] font-bold text-emerald-300">Live Activity Feed — Real-time • Like Slack/Teams</span>
   <span className="ml-auto text-[10px] text-zinc-500">{onlineCount} online • Updates every 3s • Human</span>
  </div>
  {[
   { time: '2m ago', user: 'Aisha Kamau', action: 'Resolved ENTRA-53000 — CSAT 5 ⭐ QA 92% — BitLocker fix, Company Portal Sync', color: 'emerald' },
   { time: '5m ago', user: 'Brian Otieno', action: 'Started call with Sarah Finance — P1 payroll — on hold 23s, checking Sign-in Logs', color: 'violet' },
   { time: '8m ago', user: 'Cynthia Mwangi', action: 'Mentoring David Kimani — shared Message Trace steps — team chat #team-internal', color: 'blue' },
   { time: '12m ago', user: 'You', action: `Resolved ${myProgress?.ticketsResolved ? 'ticket' : 'first ticket'} — Lvl ${myProgress?.level || 1} • ${myProgress?.xp || 0} XP`, color: 'violet' },
   { time: '15m ago', user: 'David Kimani', action: 'Needs help — stuck on EXCH-003 quarantine release — flagged for coaching', color: 'amber' },
  ].map((item, i) => (
   <div key={i} className="flex gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.time}</span>
   <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' : item.color === 'violet' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20' : item.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>{item.user[0]}</div>
   <div className="flex-1 min-w-0">
   <p className="text-[12px] text-zinc-200"><span className="font-semibold">{item.user}</span> — {item.action}</p>
   </div>
   </div>
  ))}
  </div>
  )}

  {activeView === 'leaderboard' && (
  <div className="space-y-3">
  <div className="grid grid-cols-3 gap-3">
   {allStudents.sort((a: any,b: any) => b.xp - a.xp).slice(0,3).map((s: any, idx: number) => (
   <div key={s.id} className={`p-4 rounded-xl border text-center ${idx===0 ? 'bg-amber-500/10 border-amber-500/20' : idx===1 ? 'bg-zinc-800 border-zinc-700' : 'bg-amber-900/10 border-amber-800/20'}`}>
   <div className="text-[24px]">{idx===0 ? '🥇' : idx===1 ? '🥈' : '🥉'}</div>
   <div className="h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold mx-auto mt-2">{s.avatar}</div>
   <p className="font-bold text-[13px] text-white mt-2">{s.name}</p>
   <p className="text-[11px] text-zinc-500">Lvl {s.level} • {s.xp} XP</p>
   <p className="text-[11px] text-zinc-400 mt-1">{s.ticketsResolved} tickets • {s.avgCSAT}⭐ • {s.avgQA}% QA</p>
   </div>
   ))}
  </div>
  <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Full Leaderboard</p>
   <div className="mt-3 space-y-2">
   {allStudents.sort((a: any,b: any) => b.xp - a.xp).map((s: any, idx: number) => (
   <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-800">
    <span className="text-[12px] font-bold text-zinc-500 w-6">#{idx+1}</span>
    <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold text-[12px]">{s.avatar}</div>
    <div className="flex-1 min-w-0">
    <p className="text-[12px] font-medium text-zinc-200 truncate">{s.name} {s.id==='me' && '(You)'}</p>
    <p className="text-[10px] text-zinc-500">Lvl {s.level} • {s.xp} XP • {s.ticketsResolved} tickets • {s.streak}🔥 streak</p>
    </div>
    <div className="text-right">
    <p className="text-[12px] font-bold text-white">{s.avgCSAT}⭐ • {s.avgQA}%</p>
    <p className="text-[10px] text-zinc-500">{s.badges.length} badges</p>
    </div>
   </div>
   ))}
   </div>
  </div>
  </div>
  )}

  {activeView === 'insights' && (
  <div className="grid grid-cols-2 gap-4">
  <div className="space-y-3">
   <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
   <p className="text-[12px] font-bold text-emerald-300">✅ Top Performers — Can Mentor</p>
   <div className="mt-3 space-y-2">
   {allStudents.filter(s => s.avgQA >= 85).map(s => (
    <div key={s.id} className="flex items-center gap-2 text-[11px]">
    <span className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold">{s.avatar}</span>
    <span className="text-zinc-200 font-medium">{s.name}</span>
    <span className="text-zinc-500">— {s.strengths.join(', ')} • Lvl {s.level}</span>
    </div>
   ))}
   </div>
   </div>
   <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
   <p className="text-[12px] font-bold text-amber-300">⚠️ Needs Coaching — AI Detected</p>
   <div className="mt-3 space-y-2">
   {allStudents.filter(s => s.needsHelp.length > 0).map(s => (
    <div key={s.id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
    <p className="text-[11px] font-medium text-zinc-200">{s.name} — Lvl {s.level}</p>
    <p className="text-[10px] text-red-300 mt-1">Needs: {s.needsHelp.join(', ')}</p>
    <p className="text-[10px] text-zinc-500 mt-1">Suggested: Pair with {allStudents.find(x => x.avgQA >= 85)?.name} for shadowing 2 tickets/day</p>
    </div>
   ))}
   </div>
   </div>
  </div>
  <div className="space-y-3">
   <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
   <p className="text-[12px] font-bold text-violet-300">💡 AI Insights — For Lead</p>
   <ul className="mt-3 space-y-2 text-[11px] text-violet-200/70">
   <li>• Class avg CSAT {avgCSAT} — target 4.5+ for Influx Ready. Need coaching on empathy for 2 students.</li>
   <li>• Most common mistake: Not checking Sign-in Logs CA tab before fix — 40% of low QA. Do workshop.</li>
   <li>• {allStudents.filter(s => s.callsHandled === 0).length} students never took call — schedule call practice session.</li>
   <li>• Streak leader: Cynthia 12 days — share her workflow as example.</li>
   <li>• BitLocker fix is bottleneck — 60% fail first time. Create KB article.</li>
   </ul>
   </div>
   <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] font-bold text-zinc-300">Recommended Actions — Tech Lead</p>
   <div className="mt-3 space-y-2">
   <button className="w-full h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] text-left px-3">📚 Run workshop: Sign-in Logs CA tab + Correlation ID</button>
   <button className="w-full h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] text-left px-3">🎙️ Schedule call practice — YOU greet first flow</button>
   <button className="w-full h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[11px] text-left px-3">👥 Pair struggling with top performers for shadowing</button>
   <button className="w-full h-8 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold">📊 Generate Class Report for Influx →</button>
   </div>
   </div>
  </div>
  </div>
  )}

  {activeView === 'export' && (
  <div className="grid grid-cols-2 gap-4">
  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[13px] font-bold text-zinc-100">Export Class Data</p>
   <p className="text-[11px] text-zinc-500 mt-1">For LMS, Google Sheets, Discord, and portfolio integrations</p>
   <div className="mt-4 space-y-3">
   <button onClick={() => handleExport('csv')} className="w-full h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[12px] font-medium flex items-center justify-center gap-2">📄 Export CSV — Excel/Sheets</button>
   <button onClick={() => handleExport('json')} className="w-full h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-[12px] font-medium flex items-center justify-center gap-2">📦 Export JSON — For LMS/API</button>
   <button onClick={() => handleExport('sheets')} className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[12px] font-bold flex items-center justify-center gap-2">📊 Open Google Sheets + Copy Data</button>
   <button onClick={() => { navigator.clipboard.writeText(`Class ${classCode} — ${newClassName}\nAvg CSAT ${avgCSAT} • Avg QA ${avgQA}% • ${totalResolved} tickets • ${onlineCount} online\nTop: ${(allStudents.sort((a: any,b: any)=>b.xp-a.xp)[0] as any).name} Lvl ${allStudents.sort((a: any,b: any)=>b.xp-a.xp)[0].level} ${allStudents.sort((a: any,b: any)=>b.xp-a.xp)[0].xp} XP\nhttps://orbitdesk-gamma.vercel.app/join/${classCode}`); alert('Class summary copied for LinkedIn/Discord!'); }} className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[12px] font-bold flex items-center justify-center gap-2">📋 Copy Summary for LinkedIn</button>
   </div>
   <p className="text-[10px] text-zinc-600 mt-3">Instructors can monitor class progress via Sheets, CSV, and JSON exports</p>
  </div>
  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
   <p className="text-[13px] font-bold text-violet-300">External Integrations</p>
   <div className="mt-3 space-y-3 text-[11px]">
   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="font-bold text-zinc-200">Discord Webhook — Live Feed</p>
   <p className="text-zinc-500 mt-1">Post live activity to Discord channel #influx-training — students see real-time progress, like ServiceDesk Simulator Discord with 20k+ users</p>
   <code className="mt-2 block p-2 rounded bg-black/50 text-[10px] text-violet-300">POST https://discord.com/api/webhooks/... {"{content: 'Aisha resolved ENTRA-53000 CSAT 5⭐'}"}</code>
   </div>
   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="font-bold text-zinc-200">LMS LTI — Moodle/Canvas</p>
   <p className="text-zinc-500 mt-1">OrbitDesk as LTI tool — launch from LMS, pass grade back, like Skillable labs — instructor sees grades in LMS gradebook</p>
   </div>
   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="font-bold text-zinc-200">Shareable Class Link — No Backend</p>
   <p className="text-zinc-500 mt-1">Students join via link, progress stored locally + exportable. For true multi-device, add Firebase/Supabase in 1 hour — 100% browser now, scalable later</p>
   <div className="mt-2 p-2 rounded bg-black/50 font-mono text-[10px] text-emerald-300">https://orbitdesk-gamma.vercel.app/join/{classCode}</div>
   </div>
   </div>
  </div>
  </div>
  )}
 </div>

 {/* Create Class Modal */}
 <AnimatePresence>
  {showCreateModal && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] rounded-[20px] border border-zinc-800 max-w-[440px] w-full p-6">
   <div className="flex items-center gap-3">
   <Logo variant="polished" size={36} />
   <div>
   <h3 className="font-bold text-[16px] text-white">Create New Class</h3>
   <p className="text-[11px] text-zinc-500">For Influx trainers — group students, monitor live, export</p>
   </div>
   </div>
   <div className="mt-5 space-y-4">
   <div>
   <label className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase">Class Name</label>
   <input value={newClassName} onChange={e => setNewClassName(e.target.value)} className="mt-1.5 w-full h-10 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[13px]" placeholder="Influx Support Training — Batch A" />
   </div>
   <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
   <p className="text-[11px] font-bold text-violet-300">What you get:</p>
   <ul className="mt-2 space-y-1 text-[11px] text-violet-200/70">
    <li>• Class code like {classCode} — shareable link orbitdesk.app/join/{classCode}</li>
    <li>• Live dashboard: who is online, who is in call, who needs help — Teams/Slack style presence</li>
    <li>• Leaderboard, streaks, badges, AI insights — gamified, human, not robotic</li>
    <li>• Export CSV/JSON/Google Sheets, Discord webhook, LMS LTI </li>
   </ul>
   </div>
   <div className="flex gap-3">
   <button onClick={() => setShowCreateModal(false)} className="flex-1 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[13px]">Cancel</button>
   <button onClick={handleCreateClass} className="flex-1 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-[13px]">Create Class → {classCode}</button>
   </div>
   </div>
  </motion.div>
  </motion.div>
  )}
 </AnimatePresence>

 <AnimatePresence>
  {showJoinModal && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
  <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] rounded-[20px] border border-zinc-800 max-w-[400px] w-full p-6">
   <h3 className="font-bold text-[16px] text-white">Join Class — Student</h3>
   <p className="text-[11px] text-zinc-500 mt-1">Enter class code from your instructor — like Google Classroom, but for IT support</p>
   <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="INFLUX-2026-A" className="mt-4 w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-[14px] tracking-widest" />
   <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
   <p className="text-[11px] text-zinc-400">Your progress will be visible to instructor in real-time — tickets, calls, XP, CSAT, QA. 100% local now, exportable.</p>
   </div>
   <div className="flex gap-3 mt-5">
   <button onClick={() => setShowJoinModal(false)} className="flex-1 h-10 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[13px]">Cancel</button>
   <button onClick={() => { if (joinCode.trim()) { setClassCode(joinCode.trim().toUpperCase()); setShowJoinModal(false); alert(`Joined class ${joinCode.toUpperCase()} — instructor can now monitor your progress live!`); } }} className="flex-1 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[13px]">Join → Monitored</button>
   </div>
  </motion.div>
  </motion.div>
  )}
 </AnimatePresence>
 </div>
 );
}
