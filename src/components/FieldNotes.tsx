'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
 id: string;
 category: 'Identity' | 'Device' | 'Mail' | 'Collaboration' | 'Security';
 title: string;
 scenario: string;
 resolution: string;
 tags: string[];
}

const notes: Note[] = [
 {
 id: '1',
 category: 'Identity',
 title: 'Conditional Access blocking legitimate access',
 scenario: 'Finance team reports Outlook access blocked with error 53000 during payroll processing.',
 resolution: 'Verify Sign-in logs → CA tab shows DeviceNotCompliant. Check Intune compliance, Company Portal sync status, and validate What-If simulation before policy adjustment. Document audit trail.',
 tags: ['Entra ID', 'CA', '53000'],
 },
 {
 id: '2',
 category: 'Device',
 title: 'Enrollment failure with compliance check',
 scenario: 'New device fails enrollment, Company Portal shows non-compliant despite BitLocker enabled.',
 resolution: 'Run dsregcmd /status to verify AzureADJoined state. Confirm compliance policy includes BitLocker escrow verification and OS version requirements. Sync and re-evaluate.',
 tags: ['Intune', 'Compliance', 'BitLocker'],
 },
 {
 id: '3',
 category: 'Mail',
 title: 'Shared mailbox visibility in Outlook',
 scenario: 'Shared mailbox appears in webmail but not in Outlook desktop client.',
 resolution: 'Outlook requires manual addition: File → Account Settings → More Settings → Advanced → Add mailbox. Webmail auto-maps by design. Document steps for user enablement.',
 tags: ['Exchange', 'Outlook', 'Shared Mailbox'],
 },
 {
 id: '4',
 category: 'Security',
 title: 'Quarantined message requiring release decision',
 scenario: 'Legitimate invoice flagged by Defender, user requesting urgent release.',
 resolution: 'Review Message Trace and Threat Explorer for sender reputation. Verify via quarantine portal, apply Release + Allow with Report Not Junk, update anti-phish policy if pattern repeats.',
 tags: ['Defender', 'Quarantine', 'Mail Flow'],
 },
 {
 id: '5',
 category: 'Collaboration',
 title: 'Teams presence not updating',
 scenario: 'Presence stuck despite calendar availability, affecting client communications.',
 resolution: 'Check Teams Service Health first, then verify Exchange calendar sync, client version, and presence states. Document as known issue with workaround.',
 tags: ['Teams', 'Service Health', 'Presence'],
 },
];

export default function FieldNotes() {
 const [currentIndex, setCurrentIndex] = useState(0);
 const current = notes[currentIndex];

 return (
 <div className="rounded-2xl bg-[#0a0a0a] border border-zinc-800/60 overflow-hidden">
 <div className="h-11 px-4 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center justify-between">
  <div className="flex items-center gap-2.5">
  <div className="h-7 w-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[12px]">📘</div>
  <div>
  <p className="text-[13px] font-semibold text-zinc-100">Field Notes — Operations Reference</p>
  <p className="text-[11px] text-zinc-500">Common scenarios and resolution patterns</p>
  </div>
  </div>
  <span className="text-[11px] text-zinc-500">{currentIndex + 1} / {notes.length}</span>
 </div>

 <div className="p-4">
  <AnimatePresence mode="wait">
  <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
  <div className="flex items-center gap-2">
   <span className={`text-[10px] px-2 py-1 rounded-full font-medium border ${current.category === 'Identity' ? 'bg-violet-500/10 text-violet-300 border-violet-500/20' : current.category === 'Device' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' : current.category === 'Security' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{current.category}</span>
   <span className="text-[12px] font-medium text-zinc-200">{current.title}</span>
  </div>
  <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
   <p className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase mb-1">Scenario</p>
   <p className="text-[13px] text-zinc-300 leading-[1.5]">{current.scenario}</p>
  </div>
  <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
   <p className="text-[11px] font-medium tracking-widest text-violet-400 uppercase mb-1">Resolution Approach</p>
   <p className="text-[13px] text-zinc-200 leading-[1.5]">{current.resolution}</p>
  </div>
  <div className="flex flex-wrap gap-1.5">
   {current.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-700/50">{tag}</span>)}
  </div>
  </motion.div>
  </AnimatePresence>

  <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/40">
  <div className="flex gap-1.5">
  {notes.map((_, idx) => (
   <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-violet-500' : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'}`} />
  ))}
  </div>
  <div className="flex gap-1.5">
  <button onClick={() => setCurrentIndex(prev => (prev - 1 + notes.length) % notes.length)} className="h-7 w-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400">‹</button>
  <button onClick={() => setCurrentIndex(prev => (prev + 1) % notes.length)} className="h-7 w-7 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400">›</button>
  </div>
  </div>
 </div>
 </div>
 );
}
