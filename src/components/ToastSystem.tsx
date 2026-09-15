'use client';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
 id: string;
 message: string;
 type: 'success' | 'info' | 'error' | 'warning';
 duration?: number;
 groupKey?: string;
}

interface Props {
 toasts: Toast[];
 onRemove: (id: string) => void;
}

export default function ToastSystem({ toasts, onRemove }: Props) {
 // Group and limit to 2 visible — modern, not spamming
 const grouped = toasts.reduce((acc, toast) => {
 const key = toast.groupKey || toast.message;
 if (!acc[key]) acc[key] = { ...toast, count: 1, ids: [toast.id] };
 else { acc[key].count += 1; acc[key].ids.push(toast.id); }
 return acc;
 }, {} as Record<string, Toast & { count: number; ids: string[] }>);

 const visible = Object.values(grouped).slice(-2); // Only 2 max — less intrusive

 return (
 <div className="fixed bottom-4 left-4 z-[45] space-y-2 w-[340px] pointer-events-none">
 <AnimatePresence>
  {visible.map((t, idx) => (
  <motion.div
   key={t.id}
   initial={{ opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.95 }}
   animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
   exit={{ opacity: 0, y: 10, filter: 'blur(8px)', scale: 0.95 }}
   transition={{ type: 'spring', stiffness: 400, damping: 30, delay: idx * 0.05 }}
   className={`pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-3 flex gap-2.5 group ${
    t.type === 'success' ? 'bg-zinc-900/90 border-emerald-500/20' :
    t.type === 'error' ? 'bg-zinc-900/90 border-red-500/20' :
    t.type === 'warning' ? 'bg-zinc-900/90 border-amber-500/20' :
    'bg-zinc-900/90 border-zinc-700/50'
   }`}
   drag="x"
   dragConstraints={{ left: 0, right: 0 }}
   onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) t.ids.forEach(id => onRemove(id)); }}
  >
   {/* Modern progress — thin gradient line bottom */}
   <motion.div
    initial={{ scaleX: 1 }}
    animate={{ scaleX: 0 }}
    transition={{ duration: (t.duration || 4000) / 1000, ease: 'linear' }}
    className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${
     t.type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
     t.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-400' :
     t.type === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
     'bg-gradient-to-r from-violet-500 to-indigo-500'
    }`}
    onAnimationComplete={() => t.ids.forEach(id => onRemove(id))}
   />

   <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
    t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
    t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
    t.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
    'bg-violet-500/10 border-violet-500/20 text-violet-300'
   }`}>
    <span className="text-[13px]">{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '◍'}</span>
   </div>

   <div className="flex-1 min-w-0">
    <p className="text-[12px] leading-[1.4] text-zinc-100 break-words">{t.message}</p>
    {t.count > 1 && <p className="text-[10px] text-zinc-500 mt-0.5">Grouped ×{t.count} • Drag to dismiss</p>}
   </div>

   <button onClick={() => t.ids.forEach(id => onRemove(id))} className="h-6 w-6 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition flex-shrink-0 opacity-0 group-hover:opacity-100">
    <span className="text-[10px]">✕</span>
   </button>
  </motion.div>
  ))}
 </AnimatePresence>

 {toasts.length > 2 && (
  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-auto bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-full px-3 py-1.5 flex items-center justify-between">
   <span className="text-[11px] text-zinc-400">+{toasts.length - 2} more • Grouped</span>
   <button onClick={() => toasts.forEach(t => onRemove(t.id))} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-200">Clear all</button>
  </motion.div>
 )}
 </div>
 );
}
