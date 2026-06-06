import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="ui-shell flex min-h-screen items-center justify-center bg-[color:var(--surface-app)] px-4 py-12 sm:px-6 lg:px-8">
      <section className="ui-panel w-full max-w-2xl px-6 py-8 sm:px-8">
        <div className="eyebrow">404</div>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[0.95] tracking-[0] text-[color:var(--text-primary)]">
          This route is not part of the current acoustic workspace.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Return to the public overview or open the staged calculator route.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="focus-ring ui-button ui-button-primary"
            href="/login?next=/workbench-v2"
          >
            Open calculator
          </Link>
          <Link
            className="focus-ring ui-button"
            href="/"
          >
            Back to overview
          </Link>
        </div>
      </section>
    </main>
  );
}
