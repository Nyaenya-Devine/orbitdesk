import Link from 'next/link';

const stages = [
  { n: '01', title: 'Enter the training workspace', detail: 'Choose a learning role or start in guest mode. Your progress remains on this device.' },
  { n: '02', title: 'Triage the queue', detail: 'Compare priority, business impact, age and SLA risk. Open a case only after establishing what changed.' },
  { n: '03', title: 'Inspect identity and endpoint state', detail: 'Use the directory tree, user properties, sign-in context, conditional-access simulator and device inventory.' },
  { n: '04', title: 'Apply a bounded remediation', detail: 'Choose the smallest safe action, record its rationale and avoid changes outside the ticket scope.' },
  { n: '05', title: 'Verify and communicate', detail: 'Confirm the expected state, document the evidence and close with a clear customer-facing summary.' },
  { n: '06', title: 'Review your assessment', detail: 'Use the local report to see missed controls, communication quality and scenario completion.' },
];

export const metadata = {
  title: 'Learning workflow | OrbitDesk',
  description: 'How to use the OrbitDesk Modern Workplace operations lab.',
};

export default function WalkthroughPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <nav className="mb-12 flex items-center justify-between" aria-label="Walkthrough navigation">
          <Link href="/" className="text-sm font-semibold">OrbitDesk</Link>
          <Link href="/lab" className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500">Start the lab</Link>
        </nav>
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Learning workflow</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Work the problem, not the interface.</h1>
          <p className="mt-5 text-base leading-7 text-zinc-400">OrbitDesk rewards a defensible support process: establish impact, inspect the right signals, make a limited change and verify the result.</p>
        </header>
        <ol className="mt-12 border-l border-zinc-800">
          {stages.map(stage => (
            <li key={stage.n} className="relative pb-10 pl-8 last:pb-0">
              <span className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-violet-500/40 bg-zinc-950 text-[11px] font-bold text-violet-300">{stage.n}</span>
              <h2 className="text-lg font-semibold">{stage.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{stage.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap gap-3 border-t border-zinc-800 pt-8">
          <Link href="/demo" className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-zinc-200 hover:border-zinc-500">Watch the recording</Link>
          <Link href="/lab" className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 hover:bg-zinc-200">Open OrbitDesk</Link>
        </div>
      </div>
    </main>
  );
}
