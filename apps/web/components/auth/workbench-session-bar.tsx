import Link from "next/link";

import { ThemeModeToggle } from "@/components/theme-mode-toggle";

type WorkbenchSessionBarProps = {
  username: string;
};

export function WorkbenchSessionBar({ username }: WorkbenchSessionBarProps) {
  return (
    <div className="ui-topbar shrink-0 px-3 py-2">
      <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 flex-wrap items-center gap-3 text-[color:var(--ink-soft)]">
          <span className="ui-logo-mark">
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
          <ThemeModeToggle />
          <Link className="focus-ring ui-button ui-button-ghost touch-target" href="/">
            Overview
          </Link>
          <form action="/logout" method="post">
            <button
              className="focus-ring ui-button touch-target"
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
