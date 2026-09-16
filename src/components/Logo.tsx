'use client';
import { motion } from 'framer-motion';

interface LogoProps {
 variant?: 'icon' | 'full' | 'wordmark' | 'polished' | 'hero';
 size?: number;
 animated?: boolean;
 className?: string;
}

function PolishedLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
 return (
 <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
 <img
  src="/orbitdesk-logo-godmode-polished.png"
  alt="OrbitDesk"
  width={size}
  height={size}
  className="w-full h-full object-contain rounded-full"
  style={{ filter: 'drop-shadow(0 2px 8px rgba(124, 58, 237, 0.3))' }}
  onError={(e) => {
  e.currentTarget.style.display = 'none';
  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
  if (fallback) fallback.style.display = 'block';
  }}
 />
 <div style={{ display: 'none' }} className="w-full h-full">
  <LogoIcon size={size} />
 </div>
 </div>
 );
}

export function LogoIcon({ size = 32, animated = false, className = '' }: { size?: number; animated?: boolean; className?: string }) {
 return (
 <div className={`relative ${className}`} style={{ width: size, height: size }}>
 <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
  <defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" /><stop offset="100%" stopColor="#7c3aed" stopOpacity="0" /></radialGradient>
  <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
  <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#18181b" /><stop offset="100%" stopColor="#09090b" /></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" /></filter>
  <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
  </defs>
  <circle cx="16" cy="16" r="16" fill="url(#glow)" className="opacity-60" />
  <path d="M 6 12 Q 8 6, 16 6 Q 24 6, 26 12" stroke="url(#orbitGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.9" />
  <path d="M 26 20 Q 24 26, 16 26 Q 8 26, 6 20" stroke="url(#orbitGradient)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" fill="none" opacity="0.5" />
  <path d="M 6 12 Q 4 16, 6 20" stroke="url(#orbitGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
  <path d="M 26 12 Q 28 16, 26 20" stroke="url(#orbitGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
  <g filter="url(#shadow)"><rect x="10" y="14" width="12" height="8" rx="2" ry="2" fill="url(#deskGradient)" stroke="#27272a" strokeWidth="0.5" /><rect x="10.5" y="14.5" width="11" height="1.5" rx="1" fill="white" opacity="0.08" /><rect x="11" y="22" width="1" height="2" rx="0.5" fill="#27272a" /><rect x="20" y="22" width="1" height="2" rx="0.5" fill="#27272a" /></g>
  {animated ? (<motion.g animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} style={{ originX: '16px', originY: '16px' }}><circle cx="26" cy="12" r="2.5" fill="#7c3aed" filter="url(#glowFilter)" /><circle cx="26" cy="12" r="1.5" fill="white" /></motion.g>) : (<g><circle cx="26" cy="12" r="2.5" fill="#7c3aed" opacity="0.3" filter="url(#glowFilter)" /><circle cx="26" cy="12" r="1.5" fill="white" /><circle cx="26" cy="12" r="1" fill="#7c3aed" /></g>)}
  <circle cx="8" cy="18" r="1" fill="#8b5cf6" opacity="0.6" />
 </svg>
 </div>
 );
}

export function LogoWordmark({ size = 14, className = '' }: { size?: number; className?: string }) {
 return <span className={`font-semibold tracking-[-0.02em] ${className}`} style={{ fontSize: size, fontFamily: 'Inter, system-ui, sans-serif' }}><span className="text-zinc-100">Orbit</span><span className="text-zinc-400">Desk</span></span>;
}

export default function Logo({ variant = 'full', size = 32, animated = false, className = '' }: LogoProps) {
 if (variant === 'icon') return <LogoIcon size={size} animated={animated} className={className} />;
 if (variant === 'wordmark') return <LogoWordmark size={size} className={className} />;
 if (variant === 'polished') return <PolishedLogo size={size} className={className} />;

 if (variant === 'hero') {
 return (
 <div className={`flex items-center gap-4 ${className}`}>
  <motion.div animate={animated ? { rotate: [0, 2, -2, 0], scale: [1, 1.02, 1] } : {}} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative">
  <PolishedLogo size={size} />
  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl -z-10" />
  </motion.div>
  <div className="flex flex-col">
  <div className="flex items-baseline gap-1">
   <span className="font-bold tracking-[-0.03em] text-zinc-100" style={{ fontSize: size * 0.55 }}>Orbit</span>
   <span className="font-medium tracking-[-0.02em] text-zinc-400" style={{ fontSize: size * 0.55 }}>Desk</span>
  </div>
  <span className="text-[11px] font-medium tracking-widest text-zinc-500 uppercase -mt-1 flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />Modern Workplace Operations</span>
  </div>
 </div>
 );
 }

 return (
 <div className={`flex items-center gap-2.5 ${className}`}>
  <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
   <PolishedLogo size={size} />
   {animated && (
    <>
     <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 pointer-events-none" style={{ width: size, height: size }}>
      <div className="absolute w-[3px] h-[3px] bg-violet-500 rounded-full shadow-[0_0_6px_rgba(124,58,237,0.8)]" style={{ top: '6%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="absolute w-[2px] h-[2px] bg-emerald-400 rounded-full" style={{ bottom: '10%', right: '18%' }} />
     </motion.div>
     <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="absolute pointer-events-none rounded-full border border-violet-500/25" style={{ width: size * 1.35, height: size * 1.35, left: `-${size * 0.175}px`, top: `-${size * 0.175}px` }} />
     <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} className="absolute pointer-events-none rounded-full border border-violet-500/10 border-dashed" style={{ width: size * 1.65, height: size * 1.65, left: `-${size * 0.325}px`, top: `-${size * 0.325}px` }} />
     <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-violet-500/15 blur-[8px] -z-10" />
    </>
   )}
  </div>
  <div className="flex flex-col">
   <div className="flex items-baseline gap-0.5">
    <span className="font-bold tracking-[-0.03em] text-zinc-100" style={{ fontSize: size * 0.5, fontFamily: 'Inter, sans-serif' }}>Orbit</span>
    <span className="font-medium tracking-[-0.02em] text-zinc-400" style={{ fontSize: size * 0.5 }}>Desk</span>
    {animated && <span className="ml-1 h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />}
   </div>
   <span className="text-[9px] font-medium tracking-widest text-zinc-500 uppercase -mt-0.5 flex items-center gap-1">
    <span>Operations Lab</span>
    {animated && <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="inline-block text-[8px]">◍</motion.span>}
   </span>
  </div>
 </div>
 );
}

export function Favicon() {
 return (
 <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#09090b" />
  <path d="M 8 12 Q 10 8, 16 8 Q 22 8, 24 12" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  <path d="M 24 20 Q 22 24, 16 24 Q 10 24, 8 20" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" fill="none" opacity="0.5" />
  <rect x="11" y="14" width="10" height="6" rx="1.5" fill="#18181b" stroke="#27272a" strokeWidth="0.5" />
  <circle cx="24" cy="12" r="1.5" fill="white" /><circle cx="24" cy="12" r="1" fill="#7c3aed" />
 </svg>
 );
}
