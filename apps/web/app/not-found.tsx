import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="ui-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-2xl rounded-[1.8rem] border hairline bg-[color:var(--panel)] px-6 py-8 sm:px-8">
        <div className="eyebrow">404</div>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.05em] text-[color:var(--ink)]">
          This route is not part of the current acoustic workspace.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--ink-soft)]">
          Return to the landing page or open the workbench. DynEcho keeps unsupported routes explicit rather than
          pretending they exist.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="focus-ring ink-button-solid inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold"
            href="/workbench"
          >
            Open workbench
          </Link>
          <Link
            className="focus-ring inline-flex items-center justify-center rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
            href="/"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
