import Link from "next/link";
import { ArrowUpRight, ShieldEllipsis } from "lucide-react";

import { Pill } from "@dynecho/ui";

export function SiteHeader() {
  return (
    <header className="surface-shadow stage-enter flex flex-col gap-4 rounded-[2rem] border hairline bg-[color:var(--panel)]/90 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border hairline bg-black/[0.045] font-display text-lg">
          Dy
        </div>
        <div>
          <div className="font-display text-xl">DynEcho</div>
          <div className="text-sm text-[color:var(--ink-soft)]">portable acoustic engine, web-first product shell</div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone="accent">Phase 0 active</Pill>
        <nav className="flex items-center gap-2 text-sm text-[color:var(--ink-soft)]">
          <Link className="focus-ring touch-target rounded-full px-3 py-2 hover:bg-black/[0.04]" href="/">
            Overview
          </Link>
          <Link className="focus-ring touch-target rounded-full px-3 py-2 hover:bg-black/[0.04]" href="/workbench">
            Workbench
          </Link>
          <Link className="focus-ring touch-target rounded-full px-3 py-2 hover:bg-black/[0.04]" href="/#source-policy">
            <span className="inline-flex items-center gap-2">
              <ShieldEllipsis className="h-4 w-4" />
              Guardrails
            </span>
          </Link>
          <Link className="focus-ring touch-target rounded-full px-3 py-2 hover:bg-black/[0.04]" href="/#phase-plan">
            <span className="inline-flex items-center gap-2">
              Sequence
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
