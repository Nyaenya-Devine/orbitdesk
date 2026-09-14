'use client';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'icon' | 'full' | 'wordmark';
  size?: number;
  animated?: boolean;
  className?: string;
}

// Masterpiece logo — non-AI, human, premium
// Inspired by Linear (precision), Stripe (gradient), Vercel (minimal), Notion (warm), Figma (playful)
// Orbit = elliptical orbit with gap, not perfect circle — hand-crafted feel
// Desk = stable rounded rectangle base, subtle shadow, representing desk
// Satellite = dot on orbit with glow, representing real-time, live
// Typography = custom OrbitDesk wordmark with Inter, slight custom kerning, not basic

export function LogoIcon({ size = 32, animated = false, className = '' }: { size?: number; animated?: boolean; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        {/* Subtle background glow for premium feel */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
          </filter>
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx="16" cy="16" r="16" fill="url(#glow)" className="opacity-60" />

        {/* Orbit — elliptical, not perfect circle, with gap for hand-crafted feel */}
        {/* Top orbit arc */}
        <path
          d="M 6 12 Q 8 6, 16 6 Q 24 6, 26 12"
          stroke="url(#orbitGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
        {/* Bottom orbit arc with gap */}
        <path
          d="M 26 20 Q 24 26, 16 26 Q 8 26, 6 20"
          stroke="url(#orbitGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="1 3"
          fill="none"
          opacity="0.5"
        />
        {/* Left and right orbit sides */}
        <path
          d="M 6 12 Q 4 16, 6 20"
          stroke="url(#orbitGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 26 12 Q 28 16, 26 20"
          stroke="url(#orbitGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Desk — stable base, rounded rectangle, not basic square */}
        <g filter="url(#shadow)">
          <rect x="10" y="14" width="12" height="8" rx="2" ry="2" fill="url(#deskGradient)" stroke="#27272a" strokeWidth="0.5" />
          {/* Desk surface highlight for premium feel */}
          <rect x="10.5" y="14.5" width="11" height="1.5" rx="1" fill="white" opacity="0.08" />
          {/* Desk legs subtle */}
          <rect x="11" y="22" width="1" height="2" rx="0.5" fill="#27272a" />
          <rect x="20" y="22" width="1" height="2" rx="0.5" fill="#27272a" />
        </g>

        {/* Satellite dot on orbit — live, real-time, with glow */}
        {animated ? (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '16px', originY: '16px' }}
          >
            <circle cx="26" cy="12" r="2.5" fill="#7c3aed" filter="url(#glowFilter)" />
            <circle cx="26" cy="12" r="1.5" fill="white" />
          </motion.g>
        ) : (
          <g>
            <circle cx="26" cy="12" r="2.5" fill="#7c3aed" opacity="0.3" filter="url(#glowFilter)" />
            <circle cx="26" cy="12" r="1.5" fill="white" />
            <circle cx="26" cy="12" r="1" fill="#7c3aed" />
          </g>
        )}

        {/* Small accent dot for balance */}
        <circle cx="8" cy="18" r="1" fill="#8b5cf6" opacity="0.6" />
      </svg>
    </div>
  );
}

export function LogoWordmark({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.02em] ${className}`} style={{ fontSize: size, fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <span className="text-zinc-100">Orbit</span>
      <span className="text-zinc-400">Desk</span>
    </span>
  );
}

export default function Logo({ variant = 'full', size = 32, animated = false, className = '' }: LogoProps) {
  if (variant === 'icon') {
    return <LogoIcon size={size} animated={animated} className={className} />;
  }

  if (variant === 'wordmark') {
    return <LogoWordmark size={size} className={className} />;
  }

  // Full logo — icon + wordmark, balanced, not basic
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} animated={animated} />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold tracking-[-0.03em] text-zinc-100" style={{ fontSize: size * 0.5, fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
            Orbit
          </span>
          <span className="font-medium tracking-[-0.02em] text-zinc-400" style={{ fontSize: size * 0.5 }}>
            Desk
          </span>
        </div>
        <span className="text-[9px] font-medium tracking-widest text-zinc-500 uppercase -mt-1">Lab • v3.0 • Real Voice</span>
      </div>
    </div>
  );
}

// Favicon and app icons — for PWA, Electron
export function Favicon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#09090b" />
      <path d="M 8 12 Q 10 8, 16 8 Q 22 8, 24 12" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 24 20 Q 22 24, 16 24 Q 10 24, 8 20" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" fill="none" opacity="0.5" />
      <rect x="11" y="14" width="10" height="6" rx="1.5" fill="#18181b" stroke="#27272a" strokeWidth="0.5" />
      <circle cx="24" cy="12" r="1.5" fill="white" />
      <circle cx="24" cy="12" r="1" fill="#7c3aed" />
    </svg>
  );
}
