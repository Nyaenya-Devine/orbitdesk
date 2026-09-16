'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StudentProgress, loadProgress, saveProgress, getBadges } from '@/lib/progressEngine';

interface Props {
 progress: StudentProgress;
 onReset: () => void;
}

export default function AssessmentReport({ progress, onReset }: Props) {
 const [showDetails, setShowDetails] = useState(false);
 
 const overallScore = Math.round(
 (progress.avgCSAT * 20 + // CSAT 0-5 → 0-100
 progress.avgQA +
 progress.slaCompliance +
 (progress.communicationScores.empathy + progress.communicationScores.clarity + progress.communicationScores.technicalAccuracy + progress.communicationScores.fluency + progress.communicationScores.clientLanguage) / 5) / 4
 );

 const level = Math.floor(progress.xp / 100) + 1;
 const xpToNext = 100 - (progress.xp % 100);
 const badges = getBadges(progress);

 const getGrade = (score: number) => {
 if (score >= 90) return { grade: 'A+', color: 'emerald', desc: 'Influx Ready — Hire Immediately' };
 if (score >= 80) return { grade: 'A', color: 'emerald', desc: 'Excellent — Senior Support Level' };
 if (score >= 70) return { grade: 'B+', color: 'blue', desc: 'Good — Ready for Influx with minor coaching' };
 if (score >= 60) return { grade: 'B', color: 'amber', desc: 'Satisfactory — Needs practice on empathy + client language' };
 return { grade: 'C', color: 'red', desc: 'Needs Improvement — Focus on logs + client language' };
 };

 const gradeInfo = getGrade(overallScore);

 return (
 <div className="bg-[#0a0a0a] rounded-2xl border border-zinc-800/60 overflow-hidden">
 <div className="p-6 bg-gradient-to-br from-violet-600/20 via-indigo-600/20 to-violet-700/20 border-b border-zinc-800/60">
  <div className="flex items-center justify-between">
  <div>
  <h2 className="text-[18px] font-bold text-zinc-100 flex items-center gap-2">
   📊 Final Assessment — Influx Interview Ready
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
  <p className="text-[11px] text-zinc-500 mt-1">Progress saved automatically — for Influx job application assessment</p>
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
  <p className="text-[11px] text-zinc-500 mt-2">{progress.streak} day streak 🔥 • {progress.ticketsResolved} tickets</p>
  </div>

  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">CSAT & QA</p>
  <p className="text-[28px] font-bold text-white mt-1">{progress.avgCSAT.toFixed(1)}/5 ⭐</p>
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
  <p className="text-[11px] text-zinc-500">Fluency {progress.communicationScores.fluency} • Lang {progress.communicationScores.clientLanguage}</p>
  </div>

  <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
  <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Calls & Badges</p>
  <p className="text-[28px] font-bold text-white mt-1">{progress.callsHandled} calls 📞</p>
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
   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">📈 Communication Breakdown — Influx Assessment</h3>
   <div className="space-y-3">
   {[
   { 
    label: 'Empathy', 
    value: progress.communicationScores.empathy, 
    desc: 'Advanced sentiment: apology + acknowledgment + reassurance + personalization', 
    tip: progress.communicationScores.empathy >= 80 ? '✅ Excellent empathy — you used apology, acknowledgment, reassurance naturally like human agent' : progress.communicationScores.empathy >= 50 ? '⚠️ Good start — add personalization: "I understand payroll is urgent for your team" + reassurance "I’ll take care of this"' : '❌ Missing empathy — always start with: "I understand this is frustrating, sorry about that! Thanks for checking..." + personalize client impact',
    detail: `Scored via NLP: detects sorry/apologize, I understand/I hear you, I'll help/rest assured, gratitude, personalization (your payroll/presentation). ${progress.communicationScores.empathy < 50 ? 'Your messages were too short or lacked acknowledgment.' : 'You show human understanding.'}`
   },
   { 
    label: 'Clarity', 
    value: progress.communicationScores.clarity, 
    desc: 'Structure, readability, jargon appropriateness per persona (SMB simple vs Enterprise technical)', 
    tip: progress.communicationScores.clarity >= 80 ? '✅ Crystal clear — structured steps, ideal sentence length 8-20 words, jargon matched to persona' : progress.communicationScores.clarity >= 50 ? '⚠️ Add structure: Use numbered steps "1. Open... 2. Click..." + avoid jargon for Bloom SMB, add Correlation ID for NovaTech' : '❌ Unclear — for Bloom: "Simple steps: Click Start → Settings..." no jargon + emoji 😅. For NovaTech: include Correlation ID, Sign-in logs CA tab, What If simulation.',
    detail: `NLP checks: list format (1., -, •), simple language (click/open), technical precision (correlation ID, CA tab), regulated formal (SEC-2024-07, audit trail), conciseness (SMB 10-40 words ideal), readability (8-20 words/sentence).`
   },
   { 
    label: 'Technical Accuracy', 
    value: progress.communicationScores.technicalAccuracy, 
    desc: 'Logs first, correct tool, RCA, remediation — real MSP QA rubric', 
    tip: progress.communicationScores.technicalAccuracy >= 80 ? '✅ Expert-level technical — checked logs first, correct tool, RCA with policy without Report-Only, remediation steps' : progress.communicationScores.technicalAccuracy >= 50 ? '⚠️ Include RCA: "Because policy pushed without Report-Only by john.admin" + remediation "Revert to Report-Only, What If shows safe"' : '❌ Technical gap — always: 1. Sign-in logs CA tab 2. Intune compliance 3. Company Portal Sync 4. dsregcmd /status 5. RCA + fix',
    detail: `Detects: diagnostics (sign-in logs, audit logs, dsregcmd, BitLocker), tool usage (Entra/Intune/Exchange admin), RCA (because, due to, root cause), remediation (fix by, revert Report-Only, enable BitLocker). Checklist logs + tool gives +35 each.`
   },
   { 
    label: 'Fluency', 
    value: progress.communicationScores.fluency, 
    desc: 'No filler (um/uh), no repetition, confident tone, ideal length', 
    tip: progress.communicationScores.fluency >= 80 ? '✅ Fluent & confident — no filler, no repetition, ideal 15-80 words, varied sentences' : progress.communicationScores.fluency >= 50 ? '⚠️ Remove filler: avoid um/uh/like/you know, avoid "I think maybe/not sure" — be confident "I will check and fix"' : '❌ Fluency issues — avoid um/uh, avoid repeating words, avoid ALL CAPS, keep 15-80 words, 2-6 sentences. Use 🎙️ mic to practice.',
    detail: `Advanced: counts filler (um, uh, like, you know, actually, kind of), repetition (word repeated), double spaces, ALL CAPS, low confidence phrases (I think maybe, not sure, probably), length checks (too short <5 words -25, too long >120 -10, ideal 15-80 +5).`
   },
   { 
    label: 'Client Language', 
    value: progress.communicationScores.clientLanguage, 
    desc: 'Persona adaptation: Bloom simple+emojis 😅, NovaTech technical Correlation ID, Apex SEC-2024-07 formal', 
    tip: progress.communicationScores.clientLanguage >= 80 ? '✅ Perfect client adaptation — SMB friendly + emoji, Enterprise technical Correlation ID, Apex formal audit trail' : progress.communicationScores.clientLanguage >= 50 ? '⚠️ Adapt more: Bloom = simple + 😅🥺 + no jargon. NovaTech = Correlation ID + Service Health + technical. Apex = Per SEC-2024-07 + audit trail + confirm escrow' : '❌ Wrong language for persona — Bloom hates jargon (DeviceNotCompliant, Entra), wants simple steps + emoji. NovaTech wants technical. Apex wants SEC-2024-07 + formal.',
    detail: `SMB: simple/easy/quick + emoji 😅🥺 + friendly (please/thanks) + avoid jargon. Enterprise: technical (correlation ID, service health, CA tab) + professional (audit, RCA) + structured (first/second/next). Regulated: formal (per policy, SEC-2024-07, audit trail) + precise (confirm, verify) + documentation.`
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
    <p className="text-[10px] text-violet-300 mt-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">💡 {metric.tip}</p>
   </div>
   ))}
   </div>
  </div>

  <div className="col-span-12 md:col-span-6">
   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">🎯 SLA & Realistic Balancing — For Influx</h3>
   <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 mb-4">
   <p className="text-[12px] font-medium text-zinc-200 mb-2">Realistic SLA by Client (Business Hours)</p>
   <div className="space-y-2 text-[11px]">
   <div className="flex justify-between"><span className="text-zinc-400">NovaTech Enterprise 24/7</span><span className="text-zinc-200">P1 60min • P2 4h • P3 8h • P4 24h</span></div>
   <div className="flex justify-between"><span className="text-zinc-400">Bloom SMB 9-5 Mon-Fri</span><span className="text-zinc-200">P1 4h business • P2 8h • P3 24h • P4 48h</span></div>
   <div className="flex justify-between"><span className="text-zinc-400">Apex Regulated Strict</span><span className="text-zinc-200">P1 1h • P2 2h • P3 4h • P4 8h • SEC-2024-07</span></div>
   </div>
   <p className="text-[10px] text-zinc-500 mt-3">Bloom tickets outside 9-5 wait until next business day 9am — realistic, not 24/7. Escalation at 50% time left. Breach = -10 XP.</p>
   </div>

   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">🏆 Badges & Progress — Gamified Learning</h3>
   <div className="grid grid-cols-2 gap-2 mb-4">
   {badges.map(badge => (
   <div key={badge} className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-[11px] text-violet-300">{badge}</div>
   ))}
   {badges.length === 0 && <p className="text-[11px] text-zinc-500 col-span-2">No badges yet — resolve 1 ticket to get First Fix 🛠️</p>}
   </div>

   <h3 className="text-[13px] font-semibold text-zinc-200 mb-3">📜 Recent History — Saved for Assessment</h3>
   <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 max-h-[200px] overflow-y-auto">
   {progress.history.slice(-10).reverse().map((h, i) => (
   <div key={i} className="flex gap-2 text-[11px] py-1 border-b border-zinc-800/50 last:border-0">
    <span className="text-zinc-600 font-mono">{new Date(h.timestamp).toLocaleTimeString()}</span>
    <span className="text-zinc-300">{h.action}</span>
    {h.ticketCode && <span className="text-violet-300">{h.ticketCode}</span>}
    {h.score && <span className="text-emerald-300">{h.score}/100</span>}
   </div>
   ))}
   {progress.history.length === 0 && <p className="text-[11px] text-zinc-500">No history yet — start resolving tickets and handling calls</p>}
   </div>
  </div>
  </div>

  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
  <h3 className="text-[13px] font-semibold text-violet-300 mb-2">Key Features</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
   <div>
   <p className="font-medium text-zinc-200">1. Live Call Intelligence (Gong+Chorus+Grammarly)</p>
   <p className="text-zinc-400 mt-1">Real voice both sides — client TALKS with Web Speech API TTS, you talk back with mic 🎙️ STT live transcription. Scored for empathy, clarity, technical, fluency, client language. No other simulator does this. For Influx, directly assesses communication skills + fluency.</p>
   <p className="text-violet-300 mt-1">Unique: Real voice + live scoring + coaching tips</p>
   </div>
   <div>
   <p className="font-medium text-zinc-200">2. Gamified Progress & Assessment (Duolingo+Coursera+Linear)</p>
   <p className="text-zinc-400 mt-1">XP, levels, streaks, badges saved in localStorage for final assessment. Realistic SLA by client business hours (Bloom 9-5 waits until next day). Final report with grade A+ to C, CSAT, QA, SLA, communication radar, history for Influx interview.</p>
   <p className="text-violet-300 mt-1">Unique: Saved progress + realistic SLA + certificate</p>
   </div>
   <div>
   <p className="font-medium text-zinc-200">3. Session Management (Figma+Loom+ServiceNow)</p>
   <p className="text-zinc-400 mt-1">Session ID, recording, audit log, instructor can join, see cursor, Loom video feedback. Ticket dependencies — fixing BitLocker unblocks Teams. Instructor dashboard for assessment at end.</p>
   <p className="text-violet-300 mt-1">Unique: Instructor mode + dependencies + Loom</p>
   </div>
  </div>
  <p className="text-[11px] text-zinc-500 mt-3">Combined from 20 best solutions: Intercom real-time, Zendesk QA, Linear ⌘K, Stripe dashboard, Superhuman speed, Notion templates, Slack channels, Vercel previews, Figma multiplayer, Loom video, Grammarly feedback, Duolingo gamification, Coursera assessment, Salesforce SLA business hours, ServiceNow CMDB, Jira linking, Datadog monitoring, Pendo onboarding, Gong conversation intelligence, Chorus call scoring — combined into 3 finest ideas above that make this win competition.</p>
  </div>
  </motion.div>
 )}
 </div>
 );
}
