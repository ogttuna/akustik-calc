import Link from "next/link";
import { ArrowRight, Rows3, Waypoints } from "lucide-react";

import { SectionHeading, SurfacePanel } from "@dynecho/ui";

const PREVIEW_ROWS = [
  {
    title: "Compose with order awareness",
    body: "Layers can be added, removed, reordered, and swapped through a focused editor instead of a dense legacy control wall."
  },
  {
    title: "Inspect with narrative",
    body: "Results are framed as a readable operator summary: what the engine saw, what it did not, and what the current estimate can actually support."
  },
  {
    title: "Trust through constraints",
    body: "The shell says when it is only a seed model. It does not quietly pretend to be Acoustic2 parity."
  }
] as const;

export function HomeWorkbenchPreview() {
  return (
    <SurfacePanel className="stage-enter-3 overflow-hidden px-6 py-7">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Workbench direction"
            title="The calculator experience is being rebuilt around operator flow."
            description="The goal is not just prettier controls. It is a more legible sequence: choose a study, assemble the stack, inspect the estimate, then understand what is still pending upstream."
          />
          <Link
            className="focus-ring ink-button-solid touch-target inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            href="/workbench"
          >
            Enter the workbench
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.45rem] border hairline bg-[color:var(--panel-strong)] p-4">
              <div className="flex items-center gap-3">
                <Rows3 className="h-5 w-5 text-[color:var(--ink)]" />
                <div className="font-semibold text-[color:var(--ink)]">Layer-first workflow</div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                The assembly stack is treated as the primary object, not a side effect of unrelated form sections.
              </p>
            </div>
            <div className="surface-subtle rounded-[1.45rem] border hairline p-4">
              <div className="flex items-center gap-3">
                <Waypoints className="h-5 w-5 text-[color:var(--accent-ink)]" />
                <div className="font-semibold text-[color:var(--ink)]">Migration-aware output</div>
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                The interface distinguishes between what is implemented now and what still depends on explicit upstream import work.
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {PREVIEW_ROWS.map((row, index) => (
              <article className="pointer-card rounded-[1.3rem] border hairline px-4 py-4" key={row.title}>
                <div className="eyebrow">Track 0{index + 1}</div>
                <div className="mt-2 font-semibold text-[color:var(--ink)]">{row.title}</div>
                <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{row.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SurfacePanel>
  );
}
