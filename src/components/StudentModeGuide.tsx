'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface Props {
  onClose: () => void;
  currentStep?: number;
}

export default function StudentModeGuide({ onClose, currentStep = 0 }: Props) {
  const [step, setStep] = useState(currentStep);

  const steps = [
    {
      title: 'Welcome to OrbitDesk — Student Learning Mode',
      desc: 'This is not expert tool, this is learning tool. Like flight simulator for pilots, but for support agents. You practice without risk.',
      tip: 'You are in Student Mode: max 1 P1, 5 tickets total, guided hints, not overwhelming 18 total 9 P1. Expert mode has 25 tickets endless.',
      action: 'Start Tutorial →',
    },
    {
      title: 'Step 1: Pick a Ticket — Real Learning',
      desc: 'Left queue shows tickets. In student mode, max 1 P1 (real emergency), rest P2-P4 for learning. Click any ticket — it opens real detail with toast proof.',
      tip: 'Try: Click P3 Teams presence wrong — simple, not P1 payroll blocked 50 users. Learn simple first, then P1.',
      action: 'Try Clicking Ticket →',
    },
    {
      title: 'Step 2: Check Logs First — Always',
      desc: 'Every ticket needs logs checked first. Open Entra Sign-in Logs → CA tab → see 53000 DeviceNotCompliant. This is what Influx does in real job.',
      tip: 'Student hint: Always click "Check → Logs ✓" in Sign-in Logs tab first. Required for QA, gives +10 XP. If you skip, CSAT drops.',
      action: 'Check Logs →',
    },
    {
      title: 'Step 3: Use Correct Tool — Real Actions Update Real Machine',
      desc: 'Before: notification shows action committed but not showing on real machine, disjointed. Now: enabling BitLocker in Intune portal updates RDP live — Company Portal shows Compliant, Terminal Get-BitLockerVolume shows Protection On, Desktop Teams unblocked.',
      tip: 'Try: In Intune Compliance tab, click Enable → Fix BitLocker. Then open Remote Desktop → Terminal → Get-BitLockerVolume → see Protection On ✓ Escrowed — real linkage portal↔RDP, not disjointed.',
      action: 'Enable BitLocker → Check RDP →',
    },
    {
      title: 'Step 4: Talk Live — Real Voice Both Sides',
      desc: 'Before: when you pick calls no one talking. Now: client TALKS with real voice TTS (enterprise formal, SMB friendly, regulated deep SEC-2024-07), you talk back with mic 🎙️ STT live transcription, scored for empathy clarity technical fluency client lang.',
      tip: 'Wait for incoming call P1 ring 800Hz → Accept → Hear client talk 🔊 → Click mic 🎙️ → Say "I understand, can you run dsregcmd /status?" → Live transcript → Client replies voice + action → Score 85/100 live. For Influx, this assesses communication skills fluently.',
      action: 'Handle Live Call →',
    },
    {
      title: 'Step 5: Resolve + XP + Saved Progress for Assessment',
      desc: 'Check logs + correct tool required, then client language + confirm. Click Resolve → CSAT ⭐ QA % → XP → Level → saved for final assessment in Assessment tab. Progress not lost on refresh.',
      tip: 'Student: Check 2 boxes logs+tool required, then lang for +10 XP CSAT boost. Resolve → see toast grouped not stuck with progress bar swipe, XP, saved. Go Assessment tab → Grade B+ Good Ready for Influx.',
      action: 'Resolve Ticket → See Assessment →',
    },
    {
      title: 'Final: Protection, Viral, Earning — How to Get Something Out of It',
      desc: 'You worried about stealing, public, viral, earning. Here is how:',
      tip: 'Protection: MIT license + watermark Logo + personal story (you built it) + strong branding makes stealing hard — people hire you, not code. Public: Push to GitHub orbitdesk + claim Vercel https://temporary-sonic-apogee-zwkq6o7.vercel.app to orbitdesk-gamma.vercel.app. Viral: Record 60-sec Loom human not AI — show real voice both sides + live scoring + assessment + toast grouped not stuck — post LinkedIn with story, not poor AI videos. Earning: Way 1 BPO license KSh 150K, Way 2 Senior job KSh 260K/mo remote, Way 3 Rescue KSh 25K/incident — pick one, see SIMPLE_EARNING_PLAN.md',
      action: 'Finish Tutorial — Start Learning →',
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
                <h3 className="font-bold text-[16px] text-zinc-100">Student Learning Mode — Guided Tutorial</h3>
                <p className="text-[11px] text-zinc-500">Step {step + 1} of {steps.length} • Simple, not expert tool • For Influx application</p>
              </div>
            </div>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400">✕</button>
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
            <p className="text-[11px] font-medium text-violet-300">💡 Student Hint — Human, Not Robotic</p>
            <p className="text-[12px] text-violet-200/80 mt-1 leading-[1.4]">{current.tip}</p>
          </div>

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px] font-medium transition">← Back</button>
            )}
            <button
              onClick={() => {
                if (step < steps.length - 1) setStep(s => s + 1);
                else onClose();
              }}
              className="flex-1 h-10 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-semibold transition"
            >
              {current.action}
            </button>
          </div>

          <p className="text-[10px] text-zinc-600 mt-4 text-center">Student Mode: max 1 P1, 5 tickets, guided hints, simple not expert • Expert Mode: 25 tickets endless P1 flood • Toggle in header • Progress saved for assessment • Real human experience not AI</p>
        </div>
      </motion.div>
    </div>
  );
}
