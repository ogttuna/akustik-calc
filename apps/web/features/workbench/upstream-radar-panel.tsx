import { Activity, FolderSearch2, GitBranch, Radar, TestTube2 } from "lucide-react";

import { Pill, SurfacePanel } from "@dynecho/ui";

import { GENERATED_UPSTREAM_SNAPSHOT } from "./generated-upstream-snapshot";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function getWatchTone(line: string): "accent" | "warning" | "neutral" {
  if (/(impact|lnw|floor-system)/i.test(line)) {
    return "warning";
  }

  if (/(core\.js|app\.js|catalog)/i.test(line)) {
    return "accent";
  }

  return "neutral";
}

export function UpstreamRadarPanel() {
  const snapshot = GENERATED_UPSTREAM_SNAPSHOT;
  const dirtyCount = Number(snapshot.upstream.dirtyCount);

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <Radar className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Upstream radar</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">Read-only parity watch</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            DynEcho does not depend on the live upstream repo, but it should stay aware of where Acoustic2 is moving.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone="accent">{snapshot.upstream.branch}</Pill>
        <Pill tone="neutral">{snapshot.upstream.headShort}</Pill>
        <Pill tone={dirtyCount > 0 ? "warning" : "success"}>
          {dirtyCount} dirty file{dirtyCount === 1 ? "" : "s"}
        </Pill>
        <Pill tone="neutral">Snapshot {formatDate(snapshot.generatedAt)}</Pill>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <article className="rounded-lg border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <Activity className="h-4 w-4" />
            Inventory size
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {snapshot.core.calculatorCount} calculators, {snapshot.core.materialCount} materials, {snapshot.core.exportCount} exported core symbols.
          </p>
        </article>
        <article className="rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
            <TestTube2 className="h-4 w-4" />
            Impact watch
          </div>
          <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
            {snapshot.focus.impactOrLnwTestCount} impact / Ln,w tests and {snapshot.focus.benchmarkFileCount} benchmark JSON files tracked upstream.
          </p>
        </article>
      </div>

      <div className="mt-5 rounded-lg border hairline bg-[color:var(--panel)] px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
          <FolderSearch2 className="h-4 w-4" />
          Current watchlines
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {snapshot.upstream.watchLines.map((line) => (
            <Pill key={line} tone={getWatchTone(line)}>
              {line}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border hairline px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--ink)]">
          <GitBranch className="h-4 w-4" />
          Import stance
        </div>
        <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
          Keep ingesting upstream deliberately by commit, not by runtime dependency. The current watch suggests the
          next parity pressure remains in impact, Ln,w, floor-system mapping, and benchmark-backed validation.
        </p>
      </div>
    </SurfacePanel>
  );
}
