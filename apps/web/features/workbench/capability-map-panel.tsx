import { ArrowUpRight, EarthLock, FileSearch, Sparkles } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { CAPABILITY_ROWS, SYSTEM_TOOL_ROWS } from "./workbench-data";

export function CapabilityMapPanel() {
  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <EarthLock className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Capability map</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">What this tool should cover</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {CAPABILITY_ROWS.map((row) => (
          <article className="pointer-card rounded-[1.3rem] border hairline px-4 py-4" key={row.label}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[color:var(--ink)]">{row.family}</div>
              <Pill
                tone={
                  row.status === "live"
                    ? "success"
                    : row.status === "scoped"
                      ? "accent"
                      : row.status === "guided"
                        ? "neutral"
                      : row.status === "upstream"
                        ? "warning"
                        : "neutral"
                }
              >
                {row.status}
              </Pill>
            </div>
            <div className="mt-3 text-sm font-semibold text-[color:var(--ink)]">{row.label}</div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{row.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[1.3rem] border hairline bg-black/[0.025] px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
          <Sparkles className="h-4 w-4" />
          Acoustic calculators need more than formulas
        </div>
        <div className="mt-4 grid gap-3">
          {SYSTEM_TOOL_ROWS.map((row) => (
            <article className="rounded-[1.1rem] border hairline bg-[color:var(--paper)] px-4 py-4" key={row.title}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
                <FileSearch className="h-4 w-4" />
                {row.title}
              </div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{row.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--ink-soft)]">
          <ArrowUpRight className="h-4 w-4" />
          DynEcho should evolve from calculator to decision platform.
        </div>
      </div>
    </SurfacePanel>
  );
}
