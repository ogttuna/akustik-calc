import Link from "next/link";

type WorkbenchSessionBarProps = {
  username: string;
};

export function WorkbenchSessionBar({ username }: WorkbenchSessionBarProps) {
  return (
    <div className="px-[clamp(0.75rem,1.6vw,1.5rem)] pt-4">
      <div className="surface-shadow flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border hairline bg-[color:var(--panel)]/92 px-4 py-3 text-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 text-[color:var(--ink-soft)]">
          <span className="rounded-full border hairline bg-black/[0.04] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
            Protected workspace
          </span>
          <span>
            Signed in as <span className="font-semibold text-[color:var(--ink)]">{username}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link className="focus-ring touch-target rounded-full px-3 py-2 font-semibold hover:bg-black/[0.04]" href="/">
            Overview
          </Link>
          <form action="/logout" method="post">
            <button
              className="focus-ring touch-target rounded-full border hairline px-3 py-2 font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
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
