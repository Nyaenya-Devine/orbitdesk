'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StudentProgress, getBadges } from '@/lib/progressEngine';

interface Props {
 progress: StudentProgress;
 onReset: () => void;
}

export default function AssessmentReport({ progress, onReset }: Props) {
 const [showDetails, setShowDetails] = useState(false);
 
 const overallScore = Math.round(
 (progress.avgCSAT * 20 +
 progress.avgQA +
 progress.slaCompliance +
 (progress.communicationScores.empathy + progress.communicationScores.clarity + progress.communicationScores.technicalAccuracy + progress.communicationScores.fluency + progress.communicationScores.clientLanguage) / 5) / 4
 );

 const level = Math.floor(progress.xp / 100) + 1;
 const xpToNext = 100 - (progress.xp % 100);
 const badges = getBadges(progress);

 const getGrade = (score: number) => {
 if (score >= 90) return { grade: 'A+', color: 'emerald', desc: 'Ready for advanced operations — Strong performance' };
 if (score >= 80) return { grade: 'A', color: 'emerald', desc: 'Excellent — Senior Support Level' };
 if (score >= 70) return { grade: 'B+', color: 'blue', desc: 'Good — Ready with minor coaching' };
 if (score >= 60) return { grade: 'B', color: 'amber', desc: 'Satisfactory — Focus on communication and client adaptation' };
 return { grade: 'C', color: 'red', desc: 'Needs Improvement — Review logs and client communication' };
 }

 const gradeInfo = getGrade(overallScore);

 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden">
 <div className="p-6 bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-violet-700/20 border-b border-zinc-800/60">
  <div className="flex items-center justify-between">
  <div>
  <h2 className="text-[18px] font-bold text-zinc-100 flex items-center gap-2">
   Performance Assessment
   <span className={`text-[12px] px-3 py-1 rounded-full border font-bold ${
   gradeInfo.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
   gradeInfo.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
   gradeInfo.color === 'amber' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
   'bg-red-500/20 text-red-300 border-red-500/30'
   }`}>
   {gradeInfo.grade} • {overallScore}/100
   </span>
  </h2>
  <p className="text-[13px] text-zinc-400 mt-1">{gradeInfo.desc} • Session {progress.sessionId.substring(0,8)} • {new Date(progress.startTime).toLocaleDateString()}</p>
  <p className="text-[11px] text-zinc-500 mt-1">Progress saved automatically — review for interview preparation</p>
  </div>
  <div className="flex items-center gap-2">
  <button onClick={() => setShowDetails(!showDetails)} className="h-8 px-3 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[12px] text-zinc-300 transition">
   {showDetails ? 'Hide Details' : 'Show Details'}
  </button>
  <button onClick={onReset} className="h-8 px-3 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-[12px] text-red-300 transition">
   Reset Progress
  </button>
  </div>
  </div>

  <div className="grid grid-cols-12 gap-4 mt-6">
  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Level & XP</p>
  <p className="text-[28px] font-bold text-white mt-1">Level {level}</p>
  <div className="mt-2">
   <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
   <span>{progress.xp % 100} XP</span>
   <span>{xpToNext} to next</span>
   </div>
   <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
   <motion.div initial={{ width: 0 }} animate={{ width: `${(progress.xp % 100)}%` }} className="h-full bg-violet-500" />
   </div>
  </div>
  <p className="text-[11px] text-zinc-500 mt-2">{progress.streak} day streak • {progress.ticketsResolved} tickets</p>
  </div>

  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">CSAT & QA</p>
  <p className="text-[28px] font-bold text-white mt-1">{progress.avgCSAT.toFixed(1)}/5</p>
  <p className="text-[13px] text-zinc-400">QA {progress.avgQA}% • SLA {progress.slaCompliance}%</p>
  <div className="flex gap-1 mt-2">
   <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">{progress.ticketsResolved} resolved</span>
   <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">{progress.ticketsBreached} breached</span>
  </div>
  </div>

  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Communication</p>
  <p className="text-[28px] font-bold text-white mt-1">{Math.round((progress.communicationScores.empathy + progress.communicationScores.clarity + progress.communicationScores.technicalAccuracy + progress.communicationScores.fluency + progress.communicationScores.clientLanguage)/5)}/100</p>
  <p className="text-[11px] text-zinc-500">Empathy {progress.communicationScores.empathy} • Clarity {progress.communicationScores.clarity} • Tech {progress.communicationScores.technicalAccuracy}</p>
  <p className="text-[11px] text-zinc-500">Fluency {progress.communicationScores.fluency} • Adaptation {progress.communicationScores.clientLanguage}</p>
  </div>

  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Calls & Achievements</p>
  <p className="text-[28px] font-bold text-white mt-1">{progress.callsHandled} calls</p>
  <div className="flex flex-wrap gap-1 mt-2">
   {badges.slice(0,4).map(badge => (
   <span key={badge} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20">{badge}</span>
   ))}
   {badges.length > 4 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">+{badges.length - 4} more</span>}
  </div>
  </div>
  </div>
 </div>

 {showDetails && (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 space-y-6">
  <div className="grid grid-cols-12 gap-6">
  <div className="col-span-12 md:col-span-6">
   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">Communication Analysis</h3>
   <div className="space-y-3">
   {[
   { 
    label: 'Empathy', 
    value: progress.communicationScores.empathy, 
    desc: 'Acknowledgment, reassurance, and personalization', 
    tip: progress.communicationScores.empathy >= 80 ? 'Strong empathy — consistent acknowledgment and reassurance' : progress.communicationScores.empathy >= 50 ? 'Good foundation — add personalized impact statements' : 'Focus on opening with acknowledgment and offering clear next steps',
    detail: `Evaluates use of acknowledgment, reassurance, and gratitude. ${progress.communicationScores.empathy < 50 ? 'Messages benefit from more client-centered language.' : 'Demonstrates client-centered communication.'}`
   },
   { 
    label: 'Clarity', 
    value: progress.communicationScores.clarity, 
    desc: 'Structure, readability, and appropriate technical depth', 
    tip: progress.communicationScores.clarity >= 80 ? 'Clear and well-structured — effective use of steps' : progress.communicationScores.clarity >= 50 ? 'Add structured steps and match technical depth to client profile' : 'Use numbered steps and adapt language to client type',
    detail: `Checks structure, simple vs technical precision, and conciseness for the audience.`
   },
   { 
    label: 'Technical Accuracy', 
    value: progress.communicationScores.technicalAccuracy, 
    desc: 'Log review, correct tooling, root cause, and remediation', 
    tip: progress.communicationScores.technicalAccuracy >= 80 ? 'Strong technical approach — logs first, correct tool, clear remediation' : progress.communicationScores.technicalAccuracy >= 50 ? 'Include root cause and remediation steps' : 'Follow: Sign-in logs → Compliance → Portal action → RCA → Fix',
    detail: `Looks for diagnostics review, tool usage, root cause identification, and remediation documentation.`
   },
   { 
    label: 'Fluency', 
    value: progress.communicationScores.fluency, 
    desc: 'Confidence, conciseness, and professional tone', 
    tip: progress.communicationScores.fluency >= 80 ? 'Fluent and confident delivery' : progress.communicationScores.fluency >= 50 ? 'Avoid filler words and maintain confident tone' : 'Keep messages concise, avoid filler, use confident language',
    detail: `Reviews filler words, repetition, confidence markers, and message length.`
   },
   { 
    label: 'Client Adaptation', 
    value: progress.communicationScores.clientLanguage, 
    desc: 'Adaptation to client profile and communication style', 
    tip: progress.communicationScores.clientLanguage >= 80 ? 'Excellent adaptation to client profile' : progress.communicationScores.clientLanguage >= 50 ? 'Tailor language: simple for SMB, technical for Enterprise, formal for Regulated' : 'Match language to client: SMB simple, Enterprise technical, Regulated formal with audit references',
    detail: `Evaluates adaptation: simple and supportive for SMB, technical with correlation IDs for Enterprise, formal with policy references for Regulated.`
   },
   ].map(metric => (
   <div key={metric.label} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
    <div className="flex items-center justify-between mb-2">
    <p className="text-[12px] font-medium text-zinc-200">{metric.label}</p>
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${metric.value >= 80 ? 'bg-emerald-500/20 text-emerald-300' : metric.value >= 50 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>{metric.value}/100</span>
    </div>
    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
    <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} transition={{ duration: 0.8 }} className={`h-full ${metric.value >= 80 ? 'bg-emerald-500' : metric.value >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
    </div>
    <p className="text-[11px] text-zinc-500">{metric.desc}</p>
    <p className="text-[10px] text-zinc-400 mt-1 leading-[1.4]">{metric.detail}</p>
    <p className="text-[10px] text-violet-300 mt-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">{metric.tip}</p>
   </div>
   ))}
   </div>
  </div>

  <div className="col-span-12 md:col-span-6">
   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">Service Level Overview</h3>
   <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
   <p className="text-[12px] font-medium text-zinc-200 mb-2">SLA by Client Profile</p>
   <div className="space-y-2 text-[11px]">
   <div className="flex justify-between"><span className="text-zinc-400">NovaTech Enterprise 24/7</span><span className="text-zinc-200">P1 60min • P2 4h • P3 8h • P4 24h</span></div>
   <div className="flex justify-between"><span className="text-zinc-400">Bloom SMB 9-5 Mon-Fri</span><span className="text-zinc-200">P1 4h business • P2 8h • P3 24h • P4 48h</span></div>
   <div className="flex justify-between"><span className="text-zinc-400">Apex Regulated Strict</span><span className="text-zinc-200">P1 1h • P2 2h • P3 4h • P4 8h</span></div>
   </div>
   <p className="text-[10px] text-zinc-500 mt-3">Bloom tickets outside business hours queue for next business day. Escalation at 50% SLA.</p>
   </div>

   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">Achievements</h3>
   <div className="grid grid-cols-2 gap-2 mb-4">
   {badges.map(badge => (
   <div key={badge} className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300">{badge}</div>
   ))}
   {badges.length === 0 && <p className="text-[11px] text-zinc-500 col-span-2">No achievements yet — resolve a ticket to get started</p>}
   </div>

   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">Recent Activity</h3>
   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 max-h-[200px] overflow-y-auto">
   {progress.history.slice(-10).reverse().map((h, i) => (
   <div key={i} className="flex gap-2 text-[11px] py-1 border-b border-zinc-800/50 last:border-0">
    <span className="text-zinc-600 font-mono">{new Date(h.timestamp).toLocaleTimeString()}</span>
    <span className="text-zinc-300">{h.action}</span>
    {h.ticketCode && <span className="text-violet-300">{h.ticketCode}</span>}
    {h.score && <span className="text-emerald-300">{h.score}/100</span>}
   </div>
   ))}
   {progress.history.length === 0 && <p className="text-[11px] text-zinc-500">No history yet — start resolving tickets</p>}
   </div>
  </div>
  </div>

  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
  <h3 className="text-[13px] font-semibold text-zinc-200 mb-2">Training Environment Features</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
   <div>
   <p className="font-medium text-zinc-200">Voice Communication</p>
   <p className="text-zinc-400 mt-1">Real-time voice interaction with client personas, live transcription, and communication quality feedback for professional development.</p>
   </div>
   <div>
   <p className="font-medium text-zinc-200">Progress & Assessment</p>
   <p className="text-zinc-400 mt-1">XP, levels, and structured assessment with CSAT, QA, and SLA compliance tracking for interview preparation.</p>
   </div>
   <div>
   <p className="font-medium text-zinc-200">Operations Simulation</p>
   <p className="text-zinc-400 mt-1">Session management, audit logging, and realistic ticket workflows mirroring modern workplace support operations.</p>
   </div>
  </div>
  </div>
  </motion.div>
 )}
 </div>
 );
}
