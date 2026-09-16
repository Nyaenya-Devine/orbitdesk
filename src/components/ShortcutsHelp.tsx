'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const shortcuts = [
    { keys: ['1-6'], desc: 'Switch tabs: Overview, Queue, Comms, Clients, Class, Report' },
    { keys: ['P'], desc: 'Pause / Resume shift' },
    { keys: ['C'], desc: 'Trigger incoming call simulation' },
    { keys: ['?'], desc: 'Toggle this help' },
    { keys: ['Esc'], desc: 'Close modals / deselect ticket' },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 flex items-center justify-center text-[12px] transition"
        title="Keyboard shortcuts (?)"
      >
        ?
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.96, y: 8, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.96, y: 8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-[400px] rounded-2xl border border-zinc-800 bg-[#0a0a0a] shadow-2xl overflow-hidden"
              >
                <div className="p-5 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-zinc-100">Keyboard shortcuts</h3>
                    <button onClick={() => setOpen(false)} className="h-7 w-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 text-[12px]">✕</button>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">Power user navigation for faster training</p>
                </div>

                <div className="p-4 space-y-2">
                  {shortcuts.map(s => (
                    <div key={s.desc} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                      <span className="text-[12px] text-zinc-300">{s.desc}</span>
                      <div className="flex gap-1">
                        {s.keys.map(k => (
                          <span key={k} className="h-6 px-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] font-mono text-zinc-300 flex items-center justify-center">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 text-[10px] text-zinc-600 text-center">
                  Press <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono">?</span> anytime to toggle • Esc to close
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
