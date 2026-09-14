'use client';
import { useState } from 'react';

export default function DesktopDownload() {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'mac' | 'linux'>('windows');

  const downloads = {
    windows: {
      name: 'Windows',
      icon: '🪟',
      files: [
        { name: 'OrbitDesk Setup.exe', size: '89 MB', type: 'Installer', desc: 'NSIS installer, auto-update, P1 notifications' },
        { name: 'OrbitDesk Portable.exe', size: '92 MB', type: 'Portable', desc: 'No install, run from USB, offline' },
      ],
      requirements: 'Windows 10/11 64-bit, 4GB RAM, 500MB disk',
      install: 'Download → Run Setup.exe → Follow wizard → Launch from Start menu → P1 calls show as native notifications',
    },
    mac: {
      name: 'macOS',
      icon: '🍎',
      files: [
        { name: 'OrbitDesk.dmg', size: '94 MB', type: 'DMG', desc: 'Drag to Applications, Gatekeeper signed' },
        { name: 'OrbitDesk.zip', size: '91 MB', type: 'ZIP', desc: 'Portable, no install' },
      ],
      requirements: 'macOS 12+ Monterey, Apple Silicon & Intel, 4GB RAM',
      install: 'Download DMG → Open → Drag OrbitDesk to Applications → Launch → Allow notifications for P1 calls',
    },
    linux: {
      name: 'Linux',
      icon: '🐧',
      files: [
        { name: 'OrbitDesk.AppImage', size: '98 MB', type: 'AppImage', desc: 'Universal, no install, chmod +x' },
        { name: 'orbitdesk_2.0.0_amd64.deb', size: '87 MB', type: 'DEB', desc: 'Debian/Ubuntu, apt install' },
      ],
      requirements: 'Ubuntu 20.04+, Fedora 36+, 4GB RAM, libnotify for P1 notifications',
      install: 'AppImage: chmod +x OrbitDesk.AppImage → ./OrbitDesk.AppImage — DEB: sudo dpkg -i orbitdesk.deb',
    },
  };

  const current = downloads[selectedOS];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">🖥️ Desktop Installable — PWA + Electron</h3>
            <p className="text-xs text-zinc-600 mt-1">Install as native app — Offline, P1 notifications, global shortcuts ⌘K, encrypted RDP, voice calls with real audio</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] bg-zinc-900 text-white px-2.5 py-1 rounded-full">Electron 28</span>
            <span className="text-[11px] bg-violet-100 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full">PWA Ready</span>
            <span className="text-[11px] bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">Offline</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {(Object.keys(downloads) as Array<keyof typeof downloads>).map(os => (
            <button
              key={os}
              onClick={() => setSelectedOS(os)}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-medium border transition flex items-center justify-center gap-2 ${selectedOS === os ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm' : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700'}`}
            >
              <span>{downloads[os].icon}</span> {downloads[os].name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-sm flex items-center gap-2">
            <span className="text-lg">{current.icon}</span> {current.name} Downloads
          </div>
          <div className="text-[11px] text-zinc-500">{current.requirements}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {current.files.map(file => (
            <div key={file.name} className="border border-zinc-200 rounded-xl p-3 hover:border-zinc-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {file.name}
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-full border">{file.type}</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{file.desc}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{file.size} • SHA256 verified • Signed</div>
                </div>
                <button
                  onClick={() => alert(`Desktop build: In production, this would download ${file.name}. For now, use PWA install (Install button in browser) or run: npm run desktop:dist:${selectedOS}. Build files in dist/ folder. See README for electron-builder.`)}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-black text-white rounded-full text-xs font-medium"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
          <div className="font-medium text-xs">📦 How to Install & Run:</div>
          <div className="text-[11px] text-zinc-600 mt-2 leading-relaxed font-mono bg-white border border-zinc-200 rounded-lg p-2.5">
            {current.install}
          </div>
          <div className="mt-3 grid md:grid-cols-2 gap-2 text-[11px]">
            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <div className="font-bold text-zinc-900">For Developers:</div>
              <div className="font-mono text-zinc-600 mt-1">git clone https://github.com/Nyaenya-Devine/orbitdesk<br/>cd orbitdesk<br/>npm install<br/>npm run desktop:dev<br/># Runs Next.js + Electron with hot reload</div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-2.5">
              <div className="font-bold text-zinc-900">Build Desktop App:</div>
              <div className="font-mono text-zinc-600 mt-1">npm run build<br/>npm run desktop:dist<br/># Output in dist/ — .exe, .dmg, .AppImage<br/># PWA: just install from browser (no build needed)</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl">
          <div className="font-medium text-xs text-violet-900">✨ Desktop App Features (vs Web):</div>
          <div className="grid md:grid-cols-3 gap-2 mt-2 text-[11px] text-violet-800">
            <div>✓ Native P1 notifications even when minimized</div>
            <div>✓ Global shortcut ⌘K / Ctrl+K anywhere</div>
            <div>✓ Offline cache — tickets, audio, portals</div>
            <div>✓ System tray — background with 1-click</div>
            <div>✓ Auto-launch on startup (optional)</div>
            <div>✓ Encrypted local storage for audit logs</div>
            <div>✓ File handlers — open .log, .txt in app</div>
            <div>✓ Share target — share to OrbitDesk</div>
            <div>✓ Window controls overlay — custom title bar</div>
          </div>
        </div>
      </div>
    </div>
  );
}
