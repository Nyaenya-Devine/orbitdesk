'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface Props {
 onClose: () => void;
 currentStep?: number;
}

export default function StudentModeGuide({ onClose, currentStep = 0 }: Props) {
 const [step, setStep] = useState(currentStep);

 const steps = [
 {
 title: 'Welcome to OrbitDesk — Operations Training Lab',
 desc: 'Practice modern workplace support in a safe, realistic environment. Designed for learning and interview preparation.',
 tip: 'Student Mode provides guided learning with manageable ticket volume and helpful hints. Expert Mode offers higher volume and complexity.',
 action: 'Start Tutorial',
 },
 {
 title: 'Step 1: Select a Ticket',
 desc: 'The queue displays active tickets by priority and client. Select a ticket to view details, client context, and required investigation steps.',
 tip: 'Begin with lower priority tickets to learn the workflow, then progress to critical incidents.',
 action: 'Next',
 },
 {
 title: 'Step 2: Investigate Logs',
 desc: 'Effective troubleshooting starts with log analysis. Review Sign-in Logs, Audit Logs, and Service Health to identify root cause.',
 tip: 'Always check the Conditional Access tab and correlation IDs before applying fixes. This mirrors real operations.',
 action: 'Next',
 },
 {
 title: 'Step 3: Apply Resolution in Admin Portals',
 desc: 'Use the simulated admin centers to apply fixes. Actions in portals update the remote desktop view, demonstrating end-to-end resolution.',
 tip: 'For example, enabling BitLocker in Intune updates the remote device compliance status and verification commands.',
 action: 'Next',
 },
 {
 title: 'Step 4: Handle Voice Communication',
 desc: 'Respond to incoming calls with professional communication. Practice active listening, empathy, and clear technical guidance.',
 tip: 'Voice calls simulate real client interactions with varying communication styles and urgency levels.',
 action: 'Next',
 },
 {
 title: 'Step 5: Resolve and Track Progress',
 desc: 'Complete the checklist, resolve tickets, and review your performance metrics including CSAT, quality scores, and communication feedback.',
 tip: 'Progress is saved automatically and available in the assessment report for review and interview preparation.',
 action: 'Complete Tutorial',
 },
 ];

 const current = steps[step];

 return (
 <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
 <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-[#0a0a0a] rounded-[24px] border border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden">
  <div className="p-6 border-b border-zinc-800 bg-gradient-to-br from-violet-600/10 to-indigo-600/10">
  <div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
   <Logo variant="icon" size={32} animated />
   <div>
   <h3 className="font-bold text-[16px] text-zinc-100">Training Guide</h3>
   <p className="text-[11px] text-zinc-500">Step {step + 1} of {steps.length} • Structured learning path</p>
   </div>
  </div>
  <button onClick={() => { try { localStorage.setItem('orbitdesk_guide_seen', 'true'); } catch {}; onClose(); }} className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400">✕</button>
  </div>
  
  <div className="mt-4 flex gap-1">
  {steps.map((_, i) => (
   <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? 'bg-violet-500' : 'bg-zinc-800'}`} />
  ))}
  </div>
  </div>

  <div className="p-6">
  <h4 className="font-semibold text-[15px] text-zinc-100">{current.title}</h4>
  <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">{current.desc}</p>
  
  <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
  <p className="text-[11px] font-medium text-violet-300">Guidance</p>
  <p className="text-[12px] text-violet-200/80 mt-1 leading-[1.4]">{current.tip}</p>
  </div>

  <div className="flex gap-3 mt-6">
  {step > 0 && (
   <button onClick={() => setStep(s => s - 1)} className="flex-1 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px] font-medium transition">Back</button>
  )}
  <button
   onClick={() => {
   if (step < steps.length - 1) setStep(s => s + 1);
   else { try { localStorage.setItem('orbitdesk_guide_seen', 'true'); } catch {}; onClose(); }
   }}
   className="flex-1 h-10 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-semibold transition"
  >
   {current.action}
  </button>
  </div>

  <p className="text-[10px] text-zinc-500 mt-4 text-center">Student Mode: guided learning • Expert Mode: advanced scenarios • Progress saved automatically</p>
  </div>
 </motion.div>
 </div>
 );
}
