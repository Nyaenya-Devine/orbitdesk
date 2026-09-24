import Link from 'next/link';

export const metadata = {
  title: 'Product demo | OrbitDesk',
  description: 'A recorded walkthrough of the live OrbitDesk training environment.',
};

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <nav className="mb-10 flex items-center justify-between" aria-label="Demo navigation">
          <Link href="/" className="text-sm font-semibold tracking-tight">OrbitDesk</Link>
          <div className="flex gap-3 text-sm">
            <Link href="/walkthrough" className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-300 hover:border-zinc-600">Read the workflow</Link>
            <Link href="/lab" className="rounded-full bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500">Open the lab</Link>
          </div>
        </nav>

        <header className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">Recorded in the live application</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">A support shift, from intake to evidence.</h1>
          <p className="mt-5 text-base leading-7 text-zinc-400">This browser recording uses the same interface available in the lab. It follows the learner through triage, directory investigation, policy analysis and operational handoff.</p>
        </header>

        <section className="mt-10 overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-violet-950/20">
          <video className="aspect-video w-full" controls preload="metadata" playsInline aria-label="OrbitDesk product walkthrough">
            <source src="/orbitdesk-demo.webm" type="video/webm" />
            Your browser does not support the embedded recording. Open the live lab instead.
          </video>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Triage', 'Prioritize by impact and SLA, then inspect the affected service and user context.'],
            ['Investigate', 'Use directory, identity and endpoint simulators before choosing a remediation.'],
            ['Prove', 'Capture the action trail, learner outcome and verification evidence.'],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
