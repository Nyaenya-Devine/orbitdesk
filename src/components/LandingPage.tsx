'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function LandingPage({ onEnterLab }: { onEnterLab: () => void }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    window.addEventListener('beforeinstallprompt', capture);
    return () => window.removeEventListener('beforeinstallprompt', capture);
  }, []);

  const install = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const tickets = [
    { priority: 'P1', id: 'INC-1048', title: 'Payroll access blocked by Conditional Access', scope: '47 users', time: '00:18:42', tone: 'red' },
    { priority: 'P2', id: 'INC-1051', title: 'BitLocker compliance state has not refreshed', scope: '12 devices', time: '01:42:08', tone: 'amber' },
    { priority: 'P3', id: 'REQ-392', title: 'Shared mailbox delegation request', scope: '1 user', time: '05:12:31', tone: 'blue' },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07070a] text-zinc-100 selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_8%,rgba(124,58,237,0.13),transparent_28%),radial-gradient(circle_at_8%_58%,rgba(14,116,144,0.07),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <header className="relative z-40 border-b border-white/[0.07] bg-[#07070a]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-7">
          <Logo variant="full" size={34} />
          <nav className="hidden items-center gap-7 text-xs text-zinc-400 md:flex" aria-label="Primary">
            <a href="#workspace" className="hover:text-white">Workspace</a>
            <a href="#curriculum" className="hover:text-white">Curriculum</a>
            <Link href="/demo" className="hover:text-white">Product film</Link>
            <Link href="/walkthrough" className="hover:text-white">How it works</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button onClick={onEnterLab} className="h-9 rounded-lg bg-white px-4 text-xs font-semibold text-zinc-950 hover:bg-zinc-200">Enter workspace</button>
          </div>
        </div>
      </header>

      <section id="workspace" className="relative mx-auto max-w-[1440px] px-4 pb-12 pt-10 sm:px-7 lg:pb-16 lg:pt-14">
        <div className="grid items-start gap-9 lg:grid-cols-[0.74fr_1.26fr] lg:gap-12">
          <div className="pt-1 lg:pt-7">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.07] px-2.5 py-1 text-emerald-300">Local training environment</span>
              <span className="text-zinc-600">No tenant required</span>
            </div>
            <h1 className="max-w-[680px] text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-[58px] lg:text-[66px]">
              Run the shift.<br />Defend the change.<br /><span className="text-violet-400">Prove the outcome.</span>
            </h1>
            <p className="mt-6 max-w-[610px] text-[15px] leading-7 text-zinc-400 sm:text-base">
              OrbitDesk is a hands-on Modern Workplace operations lab. Triage incidents, inspect identity and endpoint evidence, apply a bounded remediation, and document what changed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={onEnterLab} className="h-11 rounded-xl bg-violet-600 px-6 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,.24)] hover:bg-violet-500">Start a training shift</button>
              <Link href="/demo" className="flex h-11 items-center rounded-xl border border-zinc-700 bg-zinc-900/70 px-5 text-sm font-medium text-zinc-200 hover:border-zinc-500">Watch the product film <span className="ml-2 text-zinc-500">01:03</span></Link>
            </div>
            <dl className="mt-9 grid max-w-[560px] grid-cols-3 border-y border-white/[0.07] py-5">
              <div><dt className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Scenario bank</dt><dd className="mt-1 text-xl font-semibold">16</dd></div>
              <div className="border-l border-white/[0.07] pl-5"><dt className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Control planes</dt><dd className="mt-1 text-xl font-semibold">5</dd></div>
              <div className="border-l border-white/[0.07] pl-5"><dt className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Data leaves device</dt><dd className="mt-1 text-xl font-semibold">0</dd></div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 -z-10 rounded-[36px] bg-violet-600/[0.08] blur-3xl" />
            <div className="overflow-hidden rounded-[22px] border border-white/[0.11] bg-[#0b0b0f] shadow-[0_35px_100px_rgba(0,0,0,.52)]">
              <div className="flex h-12 items-center justify-between border-b border-white/[0.07] bg-white/[0.025] px-4">
                <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.7)]" /><span className="text-xs font-semibold">Operations command</span><span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">SHIFT 07</span></div>
                <div className="font-mono text-[10px] text-zinc-600">NAIROBI · 07:28 EAT</div>
              </div>

              <div className="grid min-h-[510px] md:grid-cols-[1.18fr_.82fr]">
                <div className="border-b border-white/[0.07] p-4 md:border-b-0 md:border-r">
                  <div className="mb-3 flex items-end justify-between">
                    <div><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Priority queue</p><h2 className="mt-1 text-base font-semibold">Three decisions need attention</h2></div>
                    <span className="text-[10px] text-zinc-600">SLA clock</span>
                  </div>
                  <div className="space-y-2.5">
                    {tickets.map((ticket, index) => (
                      <article key={ticket.id} className={`rounded-xl border p-3.5 ${index === 0 ? 'border-violet-500/35 bg-violet-500/[0.07]' : 'border-white/[0.07] bg-white/[0.025]'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2"><span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${ticket.tone === 'red' ? 'bg-red-500/15 text-red-300' : ticket.tone === 'amber' ? 'bg-amber-500/15 text-amber-300' : 'bg-sky-500/15 text-sky-300'}`}>{ticket.priority}</span><span className="font-mono text-[9px] text-zinc-600">{ticket.id}</span></div>
                          <span className="font-mono text-[10px] text-zinc-500">{ticket.time}</span>
                        </div>
                        <h3 className="mt-2 text-[12px] font-medium leading-5 text-zinc-200">{ticket.title}</h3>
                        <div className="mt-2 flex items-center justify-between text-[9px] text-zinc-600"><span>{ticket.scope}</span><span>{index === 0 ? 'Identity + device context required' : 'Evidence pending'}</span></div>
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#07070a] p-3.5">
                    <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-zinc-300">Investigation sequence</span><span className="text-[9px] text-emerald-400">2 / 4 verified</span></div>
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {['Impact','Identity','Device','Policy'].map((step, i) => <div key={step}><div className={`h-1 rounded-full ${i < 2 ? 'bg-emerald-400' : 'bg-zinc-800'}`} /><p className="mt-1.5 text-[8px] uppercase tracking-wider text-zinc-600">{step}</p></div>)}
                    </div>
                  </div>
                </div>

                <aside className="p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-600">Evidence pane</p>
                  <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-3.5">
                    <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-red-200">Sign-in blocked</span><span className="font-mono text-[9px] text-red-300">53000</span></div>
                    <p className="mt-2 text-[10px] leading-5 text-zinc-400">Conditional Access requires a compliant device. User identity and MFA are valid.</p>
                  </div>
                  <div className="mt-2.5 space-y-2 text-[10px]">
                    {[['Identity','Verified','emerald'],['MFA','Satisfied','emerald'],['Device','Not compliant','red'],['Policy','CA-Require-Compliant','amber']].map(([k,v,c]) => <div key={k} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"><span className="text-zinc-500">{k}</span><span className={c === 'emerald' ? 'text-emerald-300' : c === 'red' ? 'text-red-300' : 'text-amber-300'}>{v}</span></div>)}
                  </div>
                  <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-3.5">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-violet-300">Bounded next action</p>
                    <p className="mt-2 text-[11px] leading-5 text-zinc-300">Sync compliance state, verify BitLocker escrow, then rerun What-If before changing policy.</p>
                    <button onClick={onEnterLab} className="mt-3 h-8 w-full rounded-lg bg-violet-600 text-[10px] font-semibold hover:bg-violet-500">Open investigation</button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="curriculum" className="relative border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto max-w-[1440px] px-4 py-11 sm:px-7">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['01','Triage under pressure','Balance impact, urgency and remaining SLA without skipping evidence.'],
              ['02','Inspect the control path','Move through directory, sign-in, device and policy state in the right order.'],
              ['03','Change the smallest thing','Use scoped remediation instead of broad exceptions or policy weakening.'],
              ['04','Verify and communicate','Confirm state, preserve an action trail and close with a useful explanation.'],
            ].map(([n,title,body]) => <article key={n} className="rounded-2xl border border-white/[0.07] bg-[#0a0a0e] p-5"><span className="font-mono text-[10px] text-violet-400">{n}</span><h2 className="mt-5 text-sm font-semibold">{title}</h2><p className="mt-2 text-xs leading-6 text-zinc-500">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1440px] gap-7 px-4 py-14 sm:px-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400">Designed for deliberate practice</p><h2 className="mt-3 text-2xl font-semibold tracking-tight">The interface gives you signals. The assessment checks your judgment.</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">Progress, missed controls and communication quality remain in your browser. Nothing connects to a production tenant or customer environment.</p></div>
        <div className="flex flex-wrap gap-3"><button onClick={install} className="h-10 rounded-xl border border-zinc-700 px-4 text-xs text-zinc-300 hover:border-zinc-500">Install workspace</button><button onClick={onEnterLab} className="h-10 rounded-xl bg-white px-5 text-xs font-semibold text-zinc-950">Begin shift</button></div>
      </section>

      <footer className="relative border-t border-white/[0.07] px-4 py-7 text-[10px] text-zinc-600 sm:px-7"><div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3"><span>© 2026 Devine Nyaenya · OrbitDesk</span><span>Educational simulation · Independent of Microsoft · Source-available, noncommercial</span></div></footer>

      {showInstallHelp && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="install-title"><div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.16em] text-violet-400">Install OrbitDesk</p><h2 id="install-title" className="mt-2 text-lg font-semibold">Use your browser’s install command</h2></div><button onClick={() => setShowInstallHelp(false)} aria-label="Close install instructions" className="rounded-lg border border-zinc-800 px-2 py-1 text-zinc-500">×</button></div><p className="mt-4 text-sm leading-6 text-zinc-400">Open the browser menu and choose <strong className="text-zinc-200">Install app</strong> or <strong className="text-zinc-200">Add to home screen</strong>. The installed workspace uses the same local progress and offline shell.</p></div></div>}
    </main>
  );
}
