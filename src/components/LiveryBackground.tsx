'use client';
import { motion } from 'framer-motion';

// Livery Background — Good Nasty Work, Not Basic Black
// Inspired by: F1 livery (Red Bull Racing), M365 brand colors, Linear mesh, Stripe gradients
// Related to OrbitDesk: MSP Team Lead, Modern Workplace, M365, Entra, Intune, Exchange, Teams
// Black is turnoff — now: deep obsidian with M365 livery gradients, animated orbs, grid, noise, stripes

export default function LiveryBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050507]">
      {/* Base obsidian */}
      <div className="absolute inset-0 bg-[#050507]" />
      
      {/* Livery Gradient Mesh — M365 Colors */}
      {/* Entra ID Blue #0078D4 — top left */}
      <motion.div
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-[0.15]"
        style={{
          background: `radial-gradient(circle at 50% 50%, #0078D4 0%, #106EBE 20%, #5C2D91 50%, transparent 70%)`,
        }}
      />
      
      {/* Intune Purple #5C2D91 — top right */}
      <motion.div
        animate={{ 
          x: [0, -25, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -top-[20%] -right-[15%] w-[70%] h-[70%] rounded-full blur-[100px] opacity-[0.12]"
        style={{
          background: `radial-gradient(circle at 50% 50%, #7c3aed 0%, #5C2D91 30%, #6264A7 60%, transparent 70%)`,
        }}
      />
      
      {/* Teams Purple/Green — bottom right */}
      <motion.div
        animate={{ 
          x: [0, 20, 0],
          y: [0, -25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[25%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[110px] opacity-[0.10]"
        style={{
          background: `radial-gradient(circle at 50% 50%, #6264A7 0%, #00B294 20%, #0078D4 50%, transparent 70%)`,
        }}
      />
      
      {/* Exchange Orange + Windows Blue — bottom left */}
      <motion.div
        animate={{ 
          x: [0, -15, 0],
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-[20%] -left-[15%] w-[65%] h-[65%] rounded-full blur-[100px] opacity-[0.08]"
        style={{
          background: `radial-gradient(circle at 50% 50%, #D83B01 0%, #0078D4 30%, #00B294 60%, transparent 70%)`,
        }}
      />
      
      {/* Center Violet Glow — OrbitDesk brand */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full blur-[80px]"
        style={{
          background: `radial-gradient(circle at 50% 50%, #7c3aed 0%, #8b5cf6 30%, transparent 70%)`,
        }}
      />

      {/* Livery Stripes — F1 Inspired, Diagonal, M365 Related */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            #0078D4 20px,
            #0078D4 21px,
            transparent 21px,
            transparent 40px,
            #7c3aed 40px,
            #7c3aed 41px
          )`,
        }} />
      </div>
      
      {/* Grid Pattern — Subtle, Tech */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />
      </div>
      
      {/* Noise Texture — Premium, Not Basic */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* M365 Icons Watermark — Subtle, Related to Project */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute top-[15%] left-[10%] text-[120px] font-bold text-white rotate-[-12deg]">Entra</div>
        <div className="absolute top-[25%] right-[12%] text-[100px] font-bold text-white rotate-[8deg]">Intune</div>
        <div className="absolute bottom-[20%] left-[15%] text-[90px] font-bold text-white rotate-[-5deg]">Teams</div>
        <div className="absolute bottom-[30%] right-[18%] text-[110px] font-bold text-white rotate-[12deg]">M365</div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-[200px] font-black text-white opacity-[0.3] tracking-[-0.1em]">◍</div>
      </div>

      {/* Vignette — Focus center */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#050507]/80" style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(5,5,7,0.4) 80%, rgba(5,5,7,0.9) 100%)`,
      }} />

      {/* Top Highlight — Premium */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#7c3aed]/[0.03] to-transparent pointer-events-none" />
    </div>
  );
}
