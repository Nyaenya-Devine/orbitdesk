'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  name: string;
  role: string;
  experience: string;
  goal: string;
}

interface Props {
  profile: UserProfile | null;
  progress: any;
  onLogout: () => void;
  onUpdateProfile: (p: UserProfile) => void;
  studentMode: boolean;
  onToggleStudentMode: () => void;
}

export default function ProfileMenu({ profile, progress, onLogout, onUpdateProfile, studentMode, onToggleStudentMode }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');

  if (!profile) return null;

  const handleSave = () => {
    if (editName.trim().length < 2) return;
    const updated = { ...profile, name: editName.trim() };
    localStorage.setItem('orbitdesk_user_profile', JSON.stringify(updated));
    onUpdateProfile(updated);
    setEditing(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-8 pl-2 pr-1 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
      >
        <span className="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-bold">
          {profile.name?.[0]?.toUpperCase() || 'U'}
        </span>
        <span className="hidden md:block text-[11px] text-zinc-300 max-w-[80px] truncate">{profile.name}</span>
        <span className="h-5 w-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500">⌄</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 z-20 w-[300px] rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {profile.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editing ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSave()}
                          className="flex-1 h-7 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-[13px] text-white focus:outline-none focus:border-violet-500"
                        />
                        <button onClick={handleSave} className="h-7 px-2 rounded-lg bg-white text-zinc-900 text-[11px] font-medium">Save</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-[13px] font-medium text-zinc-100 truncate">{profile.name}</p>
                        <p className="text-[11px] text-zinc-500 capitalize">{profile.role.replace('-', ' ')} • {profile.experience}</p>
                      </>
                    )}
                  </div>
                </div>

                {!editing && (
                  <button onClick={() => { setEditName(profile.name); setEditing(true); }} className="mt-3 w-full h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] text-zinc-300">
                    Edit name
                  </button>
                )}
              </div>

              <div className="p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Level</p>
                    <p className="text-[14px] font-bold text-white">{progress.level} • {progress.xp} XP</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Resolved</p>
                    <p className="text-[14px] font-bold text-white">{progress.ticketsResolved} tickets</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <p className="text-[11px] font-medium text-zinc-300">Goal</p>
                  <p className="text-[11px] text-zinc-500 mt-1">{profile.goal}</p>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <p className="text-[11px] font-medium text-zinc-300">Learning mode</p>
                    <p className="text-[10px] text-zinc-500">{studentMode ? 'Guided, fewer P1s' : 'Full volume, realistic'}</p>
                  </div>
                  <button
                    onClick={() => { onToggleStudentMode(); setOpen(false); }}
                    className={`h-7 px-3 rounded-full text-[11px] font-medium border transition ${studentMode ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border-amber-500/20'}`}
                  >
                    {studentMode ? 'Student' : 'Expert'}
                  </button>
                </div>
              </div>

              <div className="p-3 border-t border-zinc-800 space-y-2">
                <button onClick={() => { setOpen(false); onLogout(); }} className="w-full h-9 rounded-full bg-zinc-800 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/20 border border-zinc-700 text-zinc-400 text-[12px] font-medium transition">
                  Sign out • Progress saved locally
                </button>
                <p className="text-[10px] text-zinc-600 text-center">Local-first • No tracking • Export in Report tab</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
