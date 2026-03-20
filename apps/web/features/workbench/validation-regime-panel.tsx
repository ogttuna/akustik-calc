"use client";

import { Anchor, Radar, ShieldAlert, ShieldCheck, ShieldQuestion, Waypoints } from "lucide-react";
import { Pill, SurfacePanel } from "@dynecho/ui";

import type { AssemblyCalculation } from "@dynecho/shared";

import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  formatFieldCoverageLabel,
  formatFloorCoverageLabel,
  formatValidationFamilyBenchmarkMix,
  formatImpactValidationTolerance,
  formatValidationModePostureLabel,
  getActiveValidationFamily,
  getActiveValidationMode,
  getValidationCoverageSnapshotRows,
  getValidationHardeningTasks,
  getValidationFamilyModeRows,
  IMPACT_VALIDATION_CORPUS_SUMMARY,
  IMPACT_VALIDATION_FAMILY_MATRIX,
  IMPACT_VALIDATION_MODE_MATRIX
} from "./validation-regime";

type ValidationRegimePanelProps = {
  result: AssemblyCalculation | null;
};

function getPostureTone(
  posture: "bound" | "estimate" | "exact" | "inactive" | "low_confidence"
): "accent" | "neutral" | "success" | "warning" {
  switch (posture) {
    case "exact":
      return "success";
    case "estimate":
      return "accent";
    case "bound":
      return "warning";
    case "low_confidence":
      return "warning";
    case "inactive":
      return "neutral";
  }
}

const VALIDATION_BANDS = [
  {
    detail: `${IMPACT_VALIDATION_CORPUS_SUMMARY.floorExactCases} exact, ${IMPACT_VALIDATION_CORPUS_SUMMARY.floorEstimateCases} estimate, ${IMPACT_VALIDATION_CORPUS_SUMMARY.floorBoundCases} bound family guards across concrete, timber, CLT, hollow-core, composite, and steel.`,
    icon: Radar,
    label: "Floor corpus",
    value: `${IMPACT_VALIDATION_CORPUS_SUMMARY.floorCases} guarded cases`
  },
  {
    detail: `${IMPACT_VALIDATION_CORPUS_SUMMARY.fieldLiveCases} live field continuations and ${IMPACT_VALIDATION_CORPUS_SUMMARY.fieldBoundCases} bound-only continuation keep L'n,w, L'nT,w, and L'nT,50 branches explicit.`,
    icon: Waypoints,
    label: "Field continuation corpus",
    value: `${IMPACT_VALIDATION_CORPUS_SUMMARY.fieldCases} guarded cases`
  },
  {
    detail: "Outside these guarded corridors the engine should fail closed, stay bounded, or remain obviously scoped instead of returning optimistic noise.",
    icon: Anchor,
    label: "Tolerance posture",
    value: formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)
  }
] as const;

export function ValidationRegimePanel({ result }: ValidationRegimePanelProps) {
  const impactPosture = describeImpactValidationPosture(result);
  const airbornePosture = describeAirborneValidationPosture(result);
  const activeFamily = getActiveValidationFamily(result);
  const activeMode = getActiveValidationMode(result);
  const impactTone = getPostureTone(impactPosture.posture);
  const airborneTone = getPostureTone(airbornePosture.posture);
  const coverageSnapshotRows = getValidationCoverageSnapshotRows();
  const hardeningTasks = getValidationHardeningTasks();
  const StatusIcon =
    impactPosture.posture === "exact"
      ? ShieldCheck
      : impactPosture.posture === "inactive"
        ? ShieldQuestion
        : ShieldAlert;

  return (
    <SurfacePanel className="px-5 py-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={impactTone}>{impactPosture.label}</Pill>
        <Pill tone={airborneTone}>{airbornePosture.label}</Pill>
        <Pill tone="neutral">{formatImpactValidationTolerance(IMPACT_VALIDATION_CORPUS_SUMMARY.toleranceBandMaxDb)} tolerance band</Pill>
        {activeFamily ? <Pill tone="accent">{activeFamily.label}</Pill> : null}
        {activeMode ? <Pill tone="accent">{activeMode.label}</Pill> : null}
      </div>

      <div className="mt-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border hairline bg-[color:var(--panel-strong)]">
          <StatusIcon className="h-4 w-4 text-[color:var(--ink)]" />
        </div>
        <div>
          <div className="eyebrow">Validation posture</div>
          <h2 className="mt-1 font-display text-[1.9rem] leading-none tracking-[-0.04em]">
            What this result is allowed to claim
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
            Read this before exporting or comparing. It keeps exact rows, scoped estimates, and conservative bounds
            visibly separate so the interface does not blur solver confidence into false certainty.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.3rem] border hairline bg-[color:var(--panel-strong)] px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={impactTone}>Impact posture</Pill>
            {result?.dynamicImpactTrace ? <Pill tone="neutral">{result.dynamicImpactTrace.evidenceTierLabel}</Pill> : null}
          </div>
          <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[color:var(--ink)]">{impactPosture.label}</div>
          <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{impactPosture.detail}</p>
          <div className="mt-4 border-t border-black/8 pt-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Airborne posture
            </div>
            <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{airbornePosture.label}</div>
            <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{airbornePosture.detail}</p>
          </div>
        </section>

        <section className="rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            Benchmark guardrails
          </div>
          <div className="mt-4 grid gap-3">
            {VALIDATION_BANDS.map((band) => {
              const Icon = band.icon;

              return (
                <article className="rounded-[1.05rem] border hairline bg-black/[0.025] px-4 py-3" key={band.label}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white/70">
                        <Icon className="h-4 w-4 text-[color:var(--ink)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[color:var(--ink)]">{band.label}</div>
                        <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">{band.detail}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-black/8 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      {band.value}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Family tolerance matrix
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              This is the current real-world coverage map behind the floor-side dynamicCalc migration. Each family row shows
              whether the guarded corridor is exact, estimated, or bound and how much tolerance the live corpus allows.
            </p>
          </div>
          <Pill tone="neutral">{IMPACT_VALIDATION_CORPUS_SUMMARY.familiesTracked} families tracked</Pill>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {IMPACT_VALIDATION_FAMILY_MATRIX.map((entry) => {
            const isActive = activeFamily?.id === entry.id;

            return (
              <article
                className={`rounded-[1.1rem] border px-4 py-4 ${
                  isActive
                    ? "border-[color:var(--accent)]/35 bg-[color:var(--accent-soft)]/24"
                    : "hairline bg-black/[0.025]"
                }`}
                key={entry.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold capitalize text-[color:var(--ink)]">{entry.label}</div>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">{entry.note}</p>
                  </div>
                  {isActive ? <Pill tone="accent">Active family</Pill> : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone={entry.floorCoverage === "exact" ? "success" : entry.floorCoverage === "estimate" ? "accent" : "warning"}>
                    {formatFloorCoverageLabel(entry.floorCoverage)}
                  </Pill>
                  <Pill tone={entry.fieldCoverage === "live" ? "success" : entry.fieldCoverage === "bound" ? "warning" : "neutral"}>
                    {formatFieldCoverageLabel(entry.fieldCoverage)}
                  </Pill>
                  <Pill tone="neutral">
                    {entry.floorCaseCount} floor / {entry.fieldCaseCount} field
                  </Pill>
                  <Pill tone="neutral">{entry.benchmarkCaseCount} benchmark</Pill>
                  <Pill tone="neutral">{formatImpactValidationTolerance(entry.maxToleranceDb)}</Pill>
                </div>

                <div className="mt-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/70 px-3 py-3">
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    Benchmark mix
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[color:var(--ink-soft)]">
                    {formatValidationFamilyBenchmarkMix(entry)} across {entry.benchmarkCaseCount} family-backed benchmark
                    case{entry.benchmarkCaseCount === 1 ? "" : "s"}.
                  </p>
                  {isActive ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {getValidationFamilyModeRows(entry).map((row) => (
                        <Pill
                          key={`${entry.id}-${row.id}`}
                          tone={
                            row.posture === "exact"
                              ? "success"
                              : row.posture === "field"
                                ? "accent"
                                : row.posture === "low_confidence"
                                  ? "warning"
                                : row.posture === "bound"
                                  ? "warning"
                                  : "neutral"
                          }
                        >
                          {row.label} x{row.caseCount}
                        </Pill>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Coverage snapshot
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              This is the compact current-state table behind dynamic calc. It shows which family is broadly covered,
              which one is still estimate-led, and where the last true fallback or staged field gap still lives.
            </p>
          </div>
          <Pill tone="neutral">{coverageSnapshotRows.length} tracked families</Pill>
        </div>

        <div className="mt-4 overflow-hidden rounded-[1.1rem] border hairline">
          <div className="hidden gap-3 bg-black/[0.04] px-4 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)] xl:grid xl:grid-cols-[1.35fr_0.8fr_0.8fr_1.15fr]">
            <div>Family</div>
            <div>Floor</div>
            <div>Field</div>
            <div>Current focus</div>
          </div>
          {coverageSnapshotRows.map((row) => (
            <article
              className="grid gap-3 border-t border-black/8 px-4 py-3 first:border-t-0 xl:grid-cols-[1.35fr_0.8fr_0.8fr_1.15fr]"
              key={`coverage-${row.id}`}
            >
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)] xl:hidden">
                  Family
                </div>
                <div className="text-sm font-semibold capitalize text-[color:var(--ink)]">{row.label}</div>
                <p className="mt-1 text-xs leading-6 text-[color:var(--ink-soft)]">{row.benchmarkMix}</p>
              </div>
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)] xl:hidden">
                  Floor
                </div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">{row.floorCoverageLabel}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)] xl:hidden">
                  Field
                </div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">{row.fieldCoverageLabel}</div>
              </div>
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)] xl:hidden">
                  Current focus
                </div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">{row.focusLabel}</div>
                <p className="mt-1 text-xs leading-6 text-[color:var(--ink-soft)]">{row.focusDetail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Next hardening
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              These are the next engine jobs implied by the current validation matrix, not generic roadmap filler.
            </p>
          </div>
          <Pill tone="warning">{hardeningTasks.length} active tracks</Pill>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {hardeningTasks.map((task) => (
            <article className="rounded-[1.1rem] border hairline bg-black/[0.025] px-4 py-4" key={task.id}>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="warning">Next</Pill>
                <Pill tone="neutral">{task.familyLabels.length} families</Pill>
              </div>
              <div className="mt-3 text-sm font-semibold text-[color:var(--ink)]">{task.label}</div>
              <p className="mt-2 text-sm leading-7 text-[color:var(--ink-soft)]">{task.detail}</p>
              <p className="mt-3 text-xs leading-6 text-[color:var(--ink-faint)]">
                {task.familyLabels.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.3rem] border hairline bg-[color:var(--paper)] px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
              Benchmark mode ladder
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              This ladder is the benchmark-backed mode map behind the impact engine. It separates exact floor rows,
              heavy-floor formulas, family estimates, low-confidence fallbacks, conservative bounds, and field carry-over
              chains instead of collapsing them into one generic predictor label.
            </p>
          </div>
          <Pill tone="neutral">
            {IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkCases} cases / {IMPACT_VALIDATION_CORPUS_SUMMARY.benchmarkModesTracked} modes
          </Pill>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {IMPACT_VALIDATION_MODE_MATRIX.map((entry) => {
            const isActive = activeMode?.id === entry.id;
            const postureTone =
              entry.posture === "exact"
                ? "success"
                : entry.posture === "field"
                  ? "accent"
                  : entry.posture === "low_confidence"
                    ? "warning"
                  : entry.posture === "bound"
                    ? "warning"
                    : "neutral";

            return (
              <article
                className={`rounded-[1.1rem] border px-4 py-4 ${
                  isActive
                    ? "border-[color:var(--accent)]/35 bg-[color:var(--accent-soft)]/24"
                    : "hairline bg-black/[0.025]"
                }`}
                key={entry.id}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[color:var(--ink)]">{entry.label}</div>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--ink-soft)]">{entry.note}</p>
                  </div>
                  {isActive ? <Pill tone="accent">Active mode</Pill> : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill tone={postureTone}>{formatValidationModePostureLabel(entry.posture)}</Pill>
                  <Pill tone="neutral">{entry.caseCount} benchmark cases</Pill>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SurfacePanel>
  );
}
