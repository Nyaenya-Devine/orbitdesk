'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface UserProfile {
 name: string;
 email: string;
 role: 'student' | 'team-lead' | 'junior' | 'senior';
 experience: 'never' | '0-1' | '1-2' | '2+';
 goal: string;
 joinedAt: number;
}

interface Props {
 onAuthenticated: (profile: UserProfile) => void;
 existingProgress?: any;
}

export default function AuthGate({ onAuthenticated, existingProgress }: Props) {
 const [show, setShow] = useState(false);
 const [profile, setProfile] = useState<UserProfile>({
 name: '',
 email: '',
 role: 'student',
 experience: 'never',
 goal: 'Interview ready - show tickets worked',
 joinedAt: Date.now(),
 });

 useEffect(() => {
 const saved = localStorage.getItem('orbitdesk_user_profile');
 if (saved) {
 try {
  const parsed = JSON.parse(saved);
  onAuthenticated(parsed);
  return;
 } catch {}
 }
 // Show login after 1s if no profile
 setTimeout(() => setShow(true), 800);
 }, []);

 const handleLogin = () => {
 if (!profile.name.trim() || !profile.email.trim()) {
 alert('Enter name and email — this saves your progress locally for interview stats');
 return;
 }
 const fullProfile = { ...profile, joinedAt: Date.now() };
 localStorage.setItem('orbitdesk_user_profile', JSON.stringify(fullProfile));
 onAuthenticated(fullProfile);
 setShow(false);
 };

 const handleDemo = () => {
 const demoProfile: UserProfile = {
 name: 'Demo User',
 email: 'demo@orbitdesk.local',
 role: 'student',
 experience: 'never',
 goal: 'Learn IT support from scratch',
 joinedAt: Date.now(),
 };
 localStorage.setItem('orbitdesk_user_profile', JSON.stringify(demoProfile));
 onAuthenticated(demoProfile);
 setShow(false);
 };

 if (!show) return null;

 return (
 <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
 <motion.div
  initial={{ scale: 0.9, y: 20, opacity: 0 }}
  animate={{ scale: 1, y: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
  className="bg-[#0a0a0a] rounded-[24px] shadow-2xl w-full max-w-[480px] overflow-hidden border border-zinc-800"
 >
  <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 p-8 text-white relative overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15),transparent)]" />
  <div className="relative">
  <div className="flex items-center gap-3 mb-4">
   <Logo variant="icon" size={40} />
   <div>
   <h2 className="font-bold text-[20px]">Welcome to OrbitDesk</h2>
   <p className="text-[13px] opacity-90">Modern Workplace Operations Lab — Real IT Support Experience</p>
   </div>
  </div>
  <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
   <p className="text-[12px] leading-[1.4]">🔒 <strong>Secure & Private:</strong> Runs 100% in browser, no real credentials sent anywhere. Your progress (tickets resolved, calls handled, XP, level) saves locally so you can show interview stats — just like Netflix keeps your watch history.</p>
  </div>
  </div>
  </div>

  <div className="p-6 space-y-4">
  <div>
  <label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Your Name (for interview report)</label>
  <input
   value={profile.name}
   onChange={e => setProfile({ ...profile, name: e.target.value })}
   placeholder="Devine Nyaenya"
   className="mt-1.5 w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 text-[14px] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
  />
  </div>

  <div>
  <label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Email (local only, not sent)</label>
  <input
   value={profile.email}
   onChange={e => setProfile({ ...profile, email: e.target.value })}
   placeholder="you@orbitdesk.local"
   className="mt-1.5 w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 text-[14px] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
  />
  </div>

  <div className="grid grid-cols-2 gap-3">
  <div>
   <label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Role</label>
   <select
   value={profile.role}
   onChange={e => setProfile({ ...profile, role: e.target.value as any })}
   className="mt-1.5 w-full h-11 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[13px] focus:outline-none focus:border-violet-500/50"
   >
   <option value="student">🎓 Student (Never worked in IT)</option>
   <option value="junior">👶 Junior Support (0-1 year)</option>
   <option value="senior">👨‍💻 Senior Support (1-2 years)</option>
   <option value="team-lead">👑 Team Lead</option>
   </select>
  </div>
  <div>
   <label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Experience</label>
   <select
   value={profile.experience}
   onChange={e => setProfile({ ...profile, experience: e.target.value as any })}
   className="mt-1.5 w-full h-11 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[13px] focus:outline-none focus:border-violet-500/50"
   >
   <option value="never">Never worked in IT support</option>
   <option value="0-1">0-1 year</option>
   <option value="1-2">1-2 years</option>
   <option value="2+">2+ years</option>
   </select>
  </div>
  </div>

  <div>
  <label className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Goal (for interview)</label>
  <input
   value={profile.goal}
   onChange={e => setProfile({ ...profile, goal: e.target.value })}
   placeholder="Interview ready - show tickets worked"
   className="mt-1.5 w-full h-11 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 text-[13px] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
  />
  </div>

  {existingProgress && existingProgress.ticketsResolved > 0 && (
  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
   <p className="text-[12px] font-semibold text-emerald-300">📊 Existing Progress Found — For Interview</p>
   <p className="text-[11px] text-emerald-200/70 mt-1">
   {existingProgress.ticketsResolved} tickets resolved • {existingProgress.callsHandled} calls • Lvl {existingProgress.level} • {existingProgress.xp} XP • {existingProgress.slaCompliance}% SLA
   </p>
   <p className="text-[10px] text-zinc-500 mt-1">Your data is saved locally, not lost on refresh — like Netflix watch history</p>
  </div>
  )}

  <div className="flex gap-3 pt-2">
  <button
   onClick={handleDemo}
   className="flex-1 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium text-[13px] transition"
  >
   Try Demo (No Login)
  </button>
  <button
   onClick={handleLogin}
   className="flex-1 h-11 rounded-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-[13px] shadow-lg transition"
  >
   Save & Start Lab →
  </button>
  </div>

  <p className="text-[10px] text-zinc-600 text-center leading-[1.3]">
  🔒 Runs 100% in browser, LocalStorage only, no real credentials, no tracking, no backend. Your interview stats stay on your device, exportable as PDF/JSON for interview. Secure like Chrome/Netflix install flow.
  </p>
  </div>
 </motion.div>
 </div>
 );
}
