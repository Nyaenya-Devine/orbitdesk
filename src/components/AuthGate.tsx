/**
 * © 2026 Devine Nyaenya Ngorwe — OrbitDesk Proprietary Flagship
 * Source-available Noncommercial — No competing use — See LICENSE
 * Trademark: OrbitDesk name and logo are trademarks
 */
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { detectLanguage, getTranslation, Language } from '@/lib/i18n';

interface UserProfile {
  name: string;
  role: 'student' | 'junior' | 'senior' | 'team-lead';
  experience: 'never' | '0-1' | '1-2' | '2+';
  goal: string;
  joinedAt: number;
  track?: string;
}

interface Props {
  onAuthenticated: (profile: UserProfile) => void;
  existingProgress?: any;
}

type Step = 1 | 2;

export default function AuthGate({ onAuthenticated, existingProgress }: Props) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [lang, setLang] = useState<Language>('en');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    role: 'student',
    experience: 'never',
    goal: 'Interview preparation — show real work',
    joinedAt: Date.now(),
    track: 'operations',
  });

  useEffect(() => {
    const detected = detectLanguage();
    setLang(detected);
    const saved = localStorage.getItem('orbitdesk_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Auto-authenticate returning users — fixes stuck at start page
        onAuthenticated(parsed);
        return;
      } catch {}
    }
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, [onAuthenticated]);

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail as Language);
    window.addEventListener('orbitdesk-language-change', handler);
    return () => window.removeEventListener('orbitdesk-language-change', handler);
  }, []);

  const t = (key: string) => getTranslation(lang, key);

  const tracks = [
    { id: 'operations', label: 'Workplace Operations', icon: '◍', desc: 'Queue → ADUC → Entra ID → Intune → Calls', color: 'violet' },
    { id: 'identity', label: 'Identity & Access', icon: '◐', desc: 'Entra ID • Conditional Access • MFA • What-If', color: 'indigo' },
    { id: 'endpoint', label: 'Endpoint Management', icon: '◑', desc: 'Intune • BitLocker • Compliance • Autopilot', color: 'emerald' },
  ];

  const roles = [
    { id: 'student', label: 'Learner', sublabel: 'New to operations', desc: 'Guided • 16 tickets • Hints • Assessment', icon: '🎓', recommended: true },
    { id: 'junior', label: 'Junior Analyst', sublabel: '0–1 year', desc: 'Standard queue • Logs • Remote desktop', icon: '💻', recommended: false },
    { id: 'senior', label: 'Senior Analyst', sublabel: '2+ years', desc: 'High volume • P1 incidents • Multi-client', icon: '🚀', recommended: false },
    { id: 'team-lead', label: 'Team Lead', sublabel: 'Leadership', desc: 'Quality • SLA • Mentoring • Reports', icon: '◍', recommended: false },
  ] as const;

  const handleEnterLab = (useGuest = false) => {
    const finalProfile: UserProfile = useGuest
      ? { name: 'Guest Learner', role: 'student', experience: 'never', goal: 'Explore lab', joinedAt: Date.now(), track: profile.track }
      : { ...profile, joinedAt: Date.now(), name: profile.name.trim() || 'Learner', goal: profile.goal || 'Operations training' };
    
    localStorage.setItem('orbitdesk_user_profile', JSON.stringify(finalProfile));
    // Mark guide as not seen only for truly new users — returning users won't see pop-up
    const hasProgress = existingProgress && existingProgress.ticketsResolved > 0;
    if (!hasProgress && !localStorage.getItem('orbitdesk_guide_seen')) {
      // Will show guide for new users only — handled in lab page
    }
    onAuthenticated(finalProfile);
    setShow(false);
  };

  const canEnter = profile.name.trim().length >= 1 || step === 1;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#050507]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(124,58,237,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0)_0%,rgba(5,5,7,0.8)_100%)]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
      </div>

      <motion.div
        initial={{ scale: 0.97, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[1080px] grid lg:grid-cols-[1.1fr_0.9fr] rounded-[28px] border border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_32px_80px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* LEFT — Professional Learning Tool Overview */}
        <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800/60 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Logo variant="full" size={38} animated />
              <div className="mt-4">
                <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-zinc-100 leading-[1.1]">OrbitDesk — Modern Workplace<br/>Operations Lab</h1>
                <p className="text-[13px] leading-[1.5] text-zinc-400 mt-3 max-w-[420px]">Practice enterprise support in a safe, realistic environment. ADUC • Entra ID • Intune • Conditional Access • WebRTC calls — all local, no Microsoft tenant required.</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-[10px] text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Local-only • v7.0 Genius • Da Vinci • Newton • Einstein • von Neumann • Turing</span>
            </div>
          </div>

          {/* Curriculum */}
          <div className="mt-8 grid gap-3">
            <div className="text-[10px] font-medium tracking-[0.14em] text-zinc-500 uppercase">What you'll practice</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { k: 'Queue Triage', v: '16 tickets • P1→P4 • SLA', icon: '◧' },
                { k: 'ADUC & Directory', v: 'OU tree • Users • Groups • GPO', icon: '◨' },
                { k: 'Entra ID What-If', v: 'CA policies • MFA • Risk • Sign-ins', icon: '◐' },
                { k: 'Intune & Endpoint', v: 'BitLocker • Compliance • Autopilot', icon: '◑' },
                { k: 'Voice & Comms', v: 'WebRTC • CSAT • Professional comms', icon: '◍' },
                { k: 'Assessment', v: 'XP • Level • SLA • Interview report', icon: '⬔' },
              ].map(item => (
                <div key={item.k} className="group p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900 transition">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] text-zinc-400 group-hover:text-zinc-200">{item.icon}</div>
                    <div className="text-[12px] font-medium text-zinc-200">{item.k}</div>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1.5 leading-[1.3]">{item.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Track selector */}
          <div className="mt-8">
            <div className="text-[10px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Learning track</div>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {tracks.map(tr => (
                <button
                  key={tr.id}
                  onClick={() => setProfile({ ...profile, track: tr.id })}
                  className={`text-left p-3 rounded-xl border flex items-center justify-between transition ${profile.track === tr.id ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[13px] border ${profile.track === tr.id ? 'bg-violet-500 text-white border-violet-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>{tr.icon}</div>
                    <div>
                      <div className={`text-[12px] font-medium ${profile.track === tr.id ? 'text-zinc-100' : 'text-zinc-300'}`}>{tr.label}</div>
                      <div className="text-[11px] text-zinc-500">{tr.desc}</div>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${profile.track === tr.id ? 'border-violet-500 bg-violet-500' : 'border-zinc-700'}`}>
                    {profile.track === tr.id && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-8 flex items-center justify-between text-[10px] text-zinc-600">
            <span>© 2026 OrbitDesk • Educational simulator • Not affiliated with Microsoft</span>
            <span className="hidden lg:inline">Secure • Local-only • {lang.toUpperCase()}</span>
          </div>
        </div>

        {/* RIGHT — Enrollment / Enter Lab */}
        <div className="p-8 lg:p-10 bg-[#0f0f10] flex flex-col">
          {/* Progress dots */}
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium tracking-[0.14em] text-zinc-500 uppercase">Enrollment • {step === 1 ? 'Role' : 'Profile'} • Step {step} of 2</div>
            <div className="flex gap-1.5">
              {[1,2].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-violet-500' : i < step ? 'w-1.5 bg-violet-500/60' : 'w-1.5 bg-zinc-700'}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.24 }} className="mt-6 flex-1">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-zinc-100">Choose your learning path</h2>
                <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Select a role that matches your current level. You can switch anytime in settings. This tailors ticket volume and guidance.</p>

                <div className="mt-6 grid gap-2.5">
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setProfile({ ...profile, role: r.id as any })}
                      className={`group text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${profile.role === r.id ? 'bg-white/[0.04] border-violet-500/40 ring-1 ring-violet-500/20' : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}`}
                    >
                      {r.recommended && <div className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-violet-500 text-white font-medium tracking-wide">RECOMMENDED</div>}
                      <div className="flex items-start gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-[14px] border shrink-0 ${profile.role === r.id ? 'bg-violet-500 text-white border-violet-500 shadow-[0_0_16px_rgba(124,58,237,0.3)]' : 'bg-zinc-800 text-zinc-400 border-zinc-700 group-hover:border-zinc-600'}`}>{r.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`text-[13px] font-semibold ${profile.role === r.id ? 'text-zinc-100' : 'text-zinc-300'}`}>{r.label}</div>
                            <div className="text-[10px] text-zinc-500">{r.sublabel}</div>
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-1 leading-[1.3]">{r.desc}</div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${profile.role === r.id ? 'border-violet-500 bg-violet-500' : 'border-zinc-700'}`}>
                          {profile.role === r.id && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {existingProgress && existingProgress.ticketsResolved > 0 && (
                  <div className="mt-5 p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[12px] font-medium text-emerald-300">Previous progress detected — continue where you left off</p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 font-mono">{existingProgress.ticketsResolved} tickets • {existingProgress.callsHandled} calls • Lvl {existingProgress.level} • {existingProgress.xp} XP • {existingProgress.slaCompliance}% SLA</p>
                    <button onClick={() => handleEnterLab(false)} className="mt-3 h-9 px-4 rounded-full bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-[12px] font-medium transition">↩ Resume with saved progress</button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.24 }} className="mt-6 flex-1">
                <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-zinc-100">Create your learner profile</h2>
                <p className="text-[13px] text-zinc-400 mt-2 leading-[1.5]">Local-only, no signup, no tracking. Used for progress, XP, and assessment report. You can change this anytime.</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <label className="text-[11px] font-medium tracking-[0.12em] text-zinc-500 uppercase">Display name</label>
                    <input
                      autoFocus
                      value={profile.name}
                      onChange={e => setProfile({ ...profile, name: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleEnterLab(false)}
                      placeholder="e.g. Devine • Alex • Learner"
                      className="mt-2.5 w-full h-[48px] px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 text-[14px] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
                    />
                    <p className="text-[11px] text-zinc-500 mt-2">2+ characters • Local storage only • Not sent anywhere</p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-[14px]">◍</div>
                      <div>
                        <p className="text-[12px] font-medium text-zinc-200">Why local-only?</p>
                        <p className="text-[11px] leading-[1.5] text-zinc-500 mt-1">OrbitDesk is a learning lab — all data stays in your browser. No cloud, no Microsoft tenant, no API keys. Progress saved to localStorage, exportable as JSON for interviews.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15">
                    <p className="text-[11px] font-medium text-amber-300">Selected: {roles.find(r => r.id === profile.role)?.label} • {tracks.find(t => t.id === profile.track)?.label}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">{roles.find(r => r.id === profile.role)?.desc} • {tracks.find(t => t.id === profile.track)?.desc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            {step === 1 ? (
              <>
                <button
                  onClick={() => setStep(2)}
                  className="w-full h-[48px] rounded-full bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-[14px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_rgba(0,0,0,0.4)] transition flex items-center justify-center gap-2"
                >
                  Continue — Set up profile <span>→</span>
                </button>
                <button
                  onClick={() => handleEnterLab(true)}
                  className="w-full h-[48px] rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-[13px] tracking-wide shadow-[0_0_24px_rgba(124,58,237,0.35)] transition flex items-center justify-center gap-2"
                >
                  🚀 Enter Lab Now — Demo Mode (no setup)
                </button>
                <div className="flex gap-2">
                  <a href="/walkthrough" className="flex-1 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[12px] font-medium flex items-center justify-center gap-1.5 transition">📹 Watch real lab demo</a>
                  <a href="/demo" className="flex-1 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-[12px] font-medium flex items-center justify-center gap-1.5 transition">🖼 Screenshots</a>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="h-[44px] px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[13px] font-medium transition">← Back</button>
                  <button
                    onClick={() => handleEnterLab(false)}
                    disabled={!canEnter}
                    className="flex-1 h-[44px] rounded-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-semibold text-[14px] shadow-sm transition flex items-center justify-center gap-2"
                  >
                    Enter Lab — Start learning <span>→</span>
                  </button>
                </div>
                <button onClick={() => handleEnterLab(true)} className="w-full h-11 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-300 text-[12px] font-medium transition">Skip setup → Enter as Guest Learner</button>
              </>
            )}
            <p className="text-[10px] text-zinc-600 text-center leading-[1.4]">Stuck? Click “Enter Lab Now” — instant access, 16 tickets, ADUC + Entra ID + GPO + Intune + WebRTC • No signup • Educational simulator • Not affiliated with Microsoft</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
