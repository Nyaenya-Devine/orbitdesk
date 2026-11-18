import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Page not found — OrbitDesk",
  description:
    "That page is not part of the OrbitDesk workspace. Return to the landing page or jump straight into the lab.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-x-hidden bg-[#07070a] px-6 py-20 text-center text-zinc-100 selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_8%,rgba(124,58,237,0.13),transparent_28%),radial-gradient(circle_at_8%_58%,rgba(14,116,144,0.07),transparent_30%)]" />
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <Logo variant="full" size={34} />

        <p className="mt-12 font-mono text-[64px] leading-none tracking-[-0.04em] text-violet-400 md:text-[88px]">
          404
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Ticket not found
        </h1>

        <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-zinc-400">
          This route isn&apos;t part of the workspace. It may have been moved, or
          the link may be incomplete — head back and pick up from the queue.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-lg bg-white px-5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Back to home
          </Link>
          <Link
            href="/lab"
            className="inline-flex h-10 items-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-5 text-xs font-medium text-zinc-200 backdrop-blur transition hover:bg-white/[0.08]"
          >
            Enter workspace
          </Link>
        </div>

        <nav
          aria-label="Helpful links"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-500"
        >
          <Link href="/walkthrough" className="transition hover:text-zinc-300">
            How it works
          </Link>
          <Link href="/demo" className="transition hover:text-zinc-300">
            Product film
          </Link>
          <Link href="/disclaimer" className="transition hover:text-zinc-300">
            Disclaimer
          </Link>
        </nav>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-600">
          OrbitDesk — Modern Workplace Operations Lab
        </p>
      </div>
    </main>
  );
}
