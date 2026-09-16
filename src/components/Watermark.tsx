'use client';
import { useEffect } from 'react';

export default function Watermark() {
  useEffect(() => {
    // Console attribution — deters silent cloning
    const style = 'color: #7c3aed; font-size: 12px; font-weight: bold;';
    const style2 = 'color: #71717a; font-size: 11px;';
    console.log('%c◍ OrbitDesk — Modern Workplace Operations Lab', style);
    console.log('%c© 2026 Devine Nyaenya Ngorwe — Proprietary flagship — All rights reserved', style2);
    console.log('%cSource-available Noncommercial — No competing use — See LICENSE file', style2);
    console.log('%cLive: https://orbitdesk-gamma.vercel.app • Portfolio: https://devine-nyaenya-portfolio.vercel.app', style2);
    console.log('%cCommercial licensing: devinenyaenya@gmail.com', style2);

    // Watermark in DOM for screenshot protection
    const el = document.createElement('div');
    el.setAttribute('data-orbitdesk-watermark', 'true');
    el.style.display = 'none';
    el.textContent = '© Devine Nyaenya • OrbitDesk • Proprietary • orbitdesk-gamma.vercel.app';
    document.body.appendChild(el);

    return () => {
      try { el.remove(); } catch {}
    };
  }, []);

  return null;
}

export function FooterWatermark() {
  return (
    <div className="flex items-center gap-2 text-[10px] text-zinc-600">
      <span className="hidden md:inline">© 2026 Devine Nyaenya</span>
      <span className="hidden md:inline w-px h-3 bg-zinc-800" />
      <span className="font-medium">OrbitDesk</span>
      <span className="w-px h-3 bg-zinc-800" />
      <span>Proprietary • Source-available</span>
    </div>
  );
}
