'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Toast {
 id: string;
 message: string;
 type: 'success' | 'info' | 'error' | 'warning';
 duration?: number;
 groupKey?: string; // For grouping similar notifications
}

interface Props {
 toasts: Toast[];
 onRemove: (id: string) => void;
}

export default function ToastSystem({ toasts, onRemove }: Props) {
 // Group similar toasts and limit to 3 visible
 const groupedToasts = toasts.reduce((acc, toast) => {
 const key = toast.groupKey || toast.message;
 if (!acc[key]) {
 acc[key] = { ...toast, count: 1, ids: [toast.id] };
 } else {
 acc[key].count += 1;
 acc[key].ids.push(toast.id);
 // Update message with count
 if (acc[key].count > 1) {
  acc[key].message = `${toast.message} (x${acc[key].count})`;
 }
 }
 return acc;
 }, {} as Record<string, Toast & { count: number; ids: string[] }>);

 const visibleToasts = Object.values(groupedToasts).slice(-3); // Only show last 3 groups

 return (
 <div className="fixed top-14 right-4 z-[200] space-y-2 w-[380px] pointer-events-none">
 <AnimatePresence>
  {visibleToasts.map(t => (
  <motion.div
  key={t.id}
  initial={{ opacity: 0, x: 80, scale: 0.9 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  exit={{ opacity: 0, x: 80, scale: 0.9 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
  className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl text-[12px] leading-[1.4] pointer-events-auto relative overflow-hidden group ${
   t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' :
   t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
   t.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' :
   'bg-zinc-800/90 border-zinc-700/50 text-zinc-100'
  }`}
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
   if (info.offset.x > 100) {
   // Swipe right to dismiss
   t.ids.forEach(id => onRemove(id));
   }
  }}
  >
  {/* Progress bar */}
  <motion.div
   initial={{ width: '100%' }}
   animate={{ width: '0%' }}
   transition={{ duration: (t.duration || 4000) / 1000, ease: 'linear' }}
   className={`absolute bottom-0 left-0 h-0.5 ${
   t.type === 'success' ? 'bg-emerald-500' :
   t.type === 'error' ? 'bg-red-500' :
   t.type === 'warning' ? 'bg-amber-500' : 'bg-violet-500'
   }`}
   onAnimationComplete={() => t.ids.forEach(id => onRemove(id))}
  />
  
  <div className="flex gap-2.5">
   <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 ${
   t.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' :
   t.type === 'error' ? 'bg-red-500/20 text-red-300' :
   t.type === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700 text-zinc-300'
   }`}>
   {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '◍'}
   </span>
   <div className="flex-1 min-w-0">
   <span className="break-words">{t.message}</span>
   {t.count > 1 && <span className="ml-2 text-[10px] opacity-60">Grouped — swipe to dismiss all</span>}
   </div>
   <button
   onClick={() => t.ids.forEach(id => onRemove(id))}
   className="h-5 w-5 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-[10px] opacity-60 hover:opacity-100 transition flex-shrink-0"
   >
   ✕
   </button>
  </div>
  
  {/* Swipe hint */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </motion.div>
  ))}
 </AnimatePresence>
 
 {toasts.length > 3 && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-zinc-500 text-center bg-zinc-800/50 backdrop-blur rounded-full px-3 py-1 border border-zinc-700/50">
  +{toasts.length - 3} more notifications grouped • Swipe to dismiss
  </motion.div>
 )}
 </div>
 );
}
