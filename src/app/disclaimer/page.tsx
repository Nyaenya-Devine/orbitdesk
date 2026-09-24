import Link from 'next/link';

export const metadata = { title: 'Simulation notice | OrbitDesk' };

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-12 text-zinc-900">
      <article className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Scope and safety</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">OrbitDesk is a training simulation.</h1>
        <p className="mt-5 leading-7 text-zinc-600">It models common identity, endpoint and service-desk workflows using fictional organizations, users, devices and incidents. It does not connect to a Microsoft tenant, remote computer, telephone network or production ticketing system.</p>

        <section className="mt-8 rounded-2xl bg-zinc-950 p-6 text-zinc-200">
          <h2 className="font-semibold text-white">Safe use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-400">
            <li>Do not enter real credentials, tenant identifiers, customer records or personal data.</li>
            <li>Validate production actions against current vendor documentation and your organization’s change controls.</li>
            <li>Treat generated scores and scenarios as learning feedback, not professional certification.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Independent product</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">OrbitDesk is independently developed and is not affiliated with or endorsed by Microsoft or any organization represented in a scenario. Product names and error codes are used only to identify the systems being taught. All trademarks belong to their respective owners.</p>
        </section>

        <section className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
          <p>The current source is available under the noncommercial terms in the repository license. Review the <Link className="font-medium text-violet-700 hover:underline" href="/terms">terms</Link> and <Link className="font-medium text-violet-700 hover:underline" href="/privacy">privacy notice</Link>.</p>
        </section>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white">Return to OrbitDesk</Link>
      </article>
    </main>
  );
}
