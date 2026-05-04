import Link from "next/link";

type WorkbenchSessionBarProps = {
  username: string;
};

export function WorkbenchSessionBar({ username }: WorkbenchSessionBarProps) {
  return (
    <div className="shrink-0 border-b border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 flex-wrap items-center gap-3 text-[color:var(--ink-soft)]">
          <span className="inline-flex h-8 w-12 items-center justify-center rounded border border-[color:var(--line-strong)] bg-[color:var(--ink)] text-[0.72rem] font-semibold tracking-[0.14em] text-[color:var(--paper)]">
            DAC
          </span>
          <span className="font-semibold uppercase tracking-[0.08em] text-[color:var(--ink)]">
            DYNECHO ACOUSTIC CALCULATOR
          </span>
          <span>
            <span className="text-[color:var(--ink-faint)]">Signed in as </span>
            <span className="font-semibold text-[color:var(--ink)]">{username}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className="focus-ring touch-target rounded px-3 py-2 font-semibold hover:bg-[color:var(--panel)]" href="/">
            Overview
          </Link>
          <form action="/logout" method="post">
            <button
              className="focus-ring touch-target rounded border hairline px-3 py-2 font-semibold text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
              type="submit"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
