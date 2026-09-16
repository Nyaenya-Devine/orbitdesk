'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { detectLanguage, getTranslation, Language, translations } from '@/lib/i18n';

interface UserProfile {
  name: string;
  role: 'student' | 'junior' | 'senior' | 'team-lead';
  experience: 'never' | '0-1' | '1-2' | '2+';
  goal: string;
  joinedAt: number;
}

interface Props {
  onAuthenticated: (profile: UserProfile) => void;
  existingProgress?: any;
}

type Step = 1 | 2 | 3;

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
  });

  useEffect(() => {
    const detected = detectLanguage();
    setLang(detected);
    const saved = localStorage.getItem('orbitdesk_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        onAuthenticated(parsed);
        return;
      } catch {}
    }
    const t = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(t);
  }, [onAuthenticated]);

  useEffect(() => {
    const handler = (e: any) => setLang(e.detail as Language);
    window.addEventListener('orbitdesk-language-change', handler);
    return () => window.removeEventListener('orbitdesk-language-change', handler);
  }, []);

  const t = (key: string) => getTranslation(lang, key);

  // Dynamic roles with translations
  const roles = [
    { id: 'student', label: t('auth.role.student'), desc: t('auth.role.student.desc'), icon: '🎓', level: lang === 'sw' ? 'Anza hapa' : 'Start here' },
    { id: 'junior', label: t('auth.role.junior'), desc: t('auth.role.junior.desc'), icon: '💻', level: lang === 'sw' ? 'Misingi' : 'Foundations' },
    { id: 'senior', label: t('auth.role.senior'), desc: t('auth.role.senior.desc'), icon: '🚀', level: lang === 'sw' ? 'Juu' : 'Advanced' },
    { id: 'team-lead', label: t('auth.role.teamLead'), desc: t('auth.role.teamLead.desc'), icon: '◍', level: 'Expert' },
  ] as const;

  const experiences = [
    { id: 'never', label: t('auth.experience.never'), desc: lang === 'sw' ? 'Hakuna uzoefu bado' : lang === 'es' ? 'Sin experiencia aún' : 'No professional experience yet' },
    { id: '0-1', label: t('auth.experience.0-1'), desc: lang === 'sw' ? 'Kazi ya mapema' : 'Early career' },
    { id: '1-2', label: t('auth.experience.1-2'), desc: lang === 'sw' ? 'Uzoefu, tiketi ngumu' : 'Experienced' },
    { id: '2+', label: t('auth.experience.2+'), desc: lang === 'sw' ? 'Mzoefu, kufundisha wengine' : 'Seasoned, mentoring' },
  ] as const;

  const goals = [
    t('auth.goal.interview'),
    t('auth.goal.learn'),
    t('auth.goal.practice'),
    t('auth.goal.lead'),
  ];

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (!profile.name.trim()) return;
    const full = { ...profile, joinedAt: Date.now(), name: profile.name.trim() };
    localStorage.setItem('orbitdesk_user_profile', JSON.stringify(full));
    onAuthenticated(full);
    setShow(false);
  };

  const handleGuest = () => {
    const guest: UserProfile = {
      name: 'Guest',
      role: 'student',
      experience: 'never',
      goal: 'Explore the lab',
      joinedAt: Date.now(),
    };
    localStorage.setItem('orbitdesk_user_profile', JSON.stringify(guest));
    onAuthenticated(guest);
    setShow(false);
  };

  const canContinue = () => {
    if (step === 3) return profile.name.trim().length >= 2;
    return true;
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#050507]/90 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.1),transparent_60%)]" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[520px] rounded-[24px] border border-zinc-800/80 bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        <div className="px-8 pt-8 pb-6 border-b border-zinc-800/60">
          <div className="flex items-center justify-between">
            <Logo variant="full" size={36} animated />
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === step ? 'w-6 bg-violet-500' : i < step ? 'w-1.5 bg-violet-500/60' : 'w-1.5 bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-zinc-100">{t('auth.welcome')}</h1>
                    <p className="text-[14px] leading-[1.5] text-zinc-400 mt-2">{t('auth.subtitle')}</p>
                  </>
                )}
                {step === 2 && (
                  <>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-zinc-100">{t('auth.experienceTitle')}</h1>
                    <p className="text-[14px] leading-[1.5] text-zinc-400 mt-2">{t('auth.experienceSubtitle')}</p>
                  </>
                )}
                {step === 3 && (
                  <>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-zinc-100">{t('auth.almostReady')}</h1>
                    <p className="text-[14px] leading-[1.5] text-zinc-400 mt-2">{t('auth.almostReadySubtitle')}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3"
              >
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setProfile({ ...profile, role: r.id as any })}
                    className={`group text-left p-4 rounded-2xl border transition-all ${
                      profile.role === r.id
                        ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-[14px] border ${profile.role === r.id ? 'bg-violet-500 text-white border-violet-500' : 'bg-zinc-800 text-zinc-400 border-zinc-700 group-hover:border-zinc-600'}`}>
                        {r.icon}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${profile.role === r.id ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>{r.level}</span>
                    </div>
                    <div className="mt-3">
                      <div className={`text-[13px] font-medium ${profile.role === r.id ? 'text-zinc-100' : 'text-zinc-300'}`}>{r.label}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{t('common.language') === 'Lugha' ? 'Uzoefu' : t('common.language') === 'Idioma' ? 'Experiencia' : 'Experience'}</label>
                  <div className="mt-3 grid gap-2">
                    {experiences.map(e => (
                      <button
                        key={e.id}
                        onClick={() => setProfile({ ...profile, experience: e.id as any })}
                        className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition ${
                          profile.experience === e.id
                            ? 'bg-zinc-900 border-violet-500/40 ring-1 ring-violet-500/20'
                            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className={`text-[13px] font-medium ${profile.experience === e.id ? 'text-zinc-100' : 'text-zinc-300'}`}>{e.label}</div>
                          <div className="text-[11px] text-zinc-500">{e.desc}</div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${profile.experience === e.id ? 'border-violet-500 bg-violet-500' : 'border-zinc-700'}`}>
                          {profile.experience === e.id && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{lang === 'sw' ? 'Lengo kuu' : lang === 'es' ? 'Objetivo principal' : lang === 'fr' ? 'Objectif principal' : lang === 'de' ? 'Hauptziel' : 'Primary goal'}</label>
                  <div className="mt-3 grid gap-2">
                    {goals.map(g => (
                      <button
                        key={g}
                        onClick={() => setProfile({ ...profile, goal: g })}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] transition ${
                          profile.goal === g
                            ? 'bg-zinc-900 border-violet-500/40 text-zinc-100 ring-1 ring-violet-500/20'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase">{t('auth.name.label')}</label>
                  <input
                    autoFocus
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && canContinue() && handleContinue()}
                    placeholder={t('auth.name.placeholder')}
                    className="mt-3 w-full h-12 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 text-[14px] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
                  />
                  <p className="text-[11px] text-zinc-500 mt-2">{t('auth.name.hint')}</p>
                </div>

                {existingProgress && existingProgress.ticketsResolved > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[12px] font-medium text-emerald-300">Previous progress found</p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2">
                      {existingProgress.ticketsResolved} tickets • {existingProgress.callsHandled} calls • Level {existingProgress.level} • {existingProgress.xp} XP • {existingProgress.slaCompliance}% SLA
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-[14px]">◍</div>
                    <div>
                      <p className="text-[12px] font-medium text-zinc-200">{t('auth.localFirst')}</p>
                      <p className="text-[11px] leading-[1.4] text-zinc-500 mt-1">{t('auth.localFirst.desc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 py-5 bg-zinc-900/50 border-t border-zinc-800/60 flex items-center justify-between">
          <button
            onClick={handleGuest}
            className="text-[13px] text-zinc-500 hover:text-zinc-300 transition"
          >
            {t('auth.guest')}
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="h-10 px-5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-[13px] font-medium transition"
              >
                {t('auth.back')}
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue()}
              className="h-10 px-6 rounded-full bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-900 font-semibold text-[13px] shadow-sm transition flex items-center gap-2"
            >
              {step === 3 ? t('auth.startLab') : t('auth.continue')}
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="px-8 py-3 bg-[#050507] border-t border-zinc-800/40 flex items-center justify-between text-[10px] text-zinc-600">
          <span>© 2026 OrbitDesk — Educational simulator • Not affiliated with Microsoft</span>
          <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-500" />Secure • Local-only • {lang.toUpperCase()}</span>
        </div>
      </motion.div>
    </div>
  );
}
