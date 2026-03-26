"use client";

import type { AssemblyCalculation } from "@dynecho/shared";

import { buildResultAnswerChartLanes, type ResultAnswerChartLane } from "./result-answer-chart-model";

type ResultAnswerChartProps = {
  result: AssemblyCalculation | null;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
};

function clampPercent(value: number, min: number, max: number): string {
  const span = max - min;
  if (!(span > 0)) {
    return "0%";
  }

  const ratio = (value - min) / span;
  return `${Math.max(0, Math.min(100, ratio * 100))}%`;
}

function getLanePalette(direction: ResultAnswerChartLane["direction"]) {
  if (direction === "higher_better") {
    return {
      accentClass: "text-[color:var(--accent-ink)]",
      gradient: "linear-gradient(90deg,color-mix(in_oklch,var(--warning)_88%,white),color-mix(in_oklch,var(--accent)_92%,white),color-mix(in_oklch,var(--success)_88%,white))",
      pillClass: "border-[color:color-mix(in_oklch,var(--accent)_22%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_10%,var(--paper))] text-[color:var(--accent-ink)]",
      referenceBands: [
        "rgba(188,108,37,0.11)",
        "rgba(201,115,66,0.09)",
        "rgba(42,157,143,0.11)"
      ]
    };
  }

  return {
    accentClass: "text-[color:var(--success-ink)]",
    gradient: "linear-gradient(90deg,color-mix(in_oklch,var(--success)_88%,white),color-mix(in_oklch,var(--accent)_92%,white),color-mix(in_oklch,var(--warning)_88%,white))",
    pillClass: "border-[color:color-mix(in_oklch,var(--success)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))] text-[color:var(--success-ink)]",
    referenceBands: [
      "rgba(42,157,143,0.11)",
      "rgba(201,115,66,0.09)",
      "rgba(188,108,37,0.11)"
    ]
  };
}

function getLaneStatus(lane: ResultAnswerChartLane): string | null {
  if (lane.target === null) {
    return null;
  }

  if (lane.direction === "higher_better") {
    return lane.value >= lane.target ? "On or above brief" : "Below brief";
  }

  return lane.value <= lane.target ? "On or below brief" : "Above brief";
}

export function ResultAnswerChart({ result, targetLnwDb, targetRwDb }: ResultAnswerChartProps) {
  const lanes = buildResultAnswerChartLanes({ result, targetLnwDb, targetRwDb });

  if (lanes.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lanes.map((lane) => {
        const palette = getLanePalette(lane.direction);
        const valueLeft = clampPercent(lane.value, lane.min, lane.max);
        const targetLeft = lane.target !== null ? clampPercent(lane.target, lane.min, lane.max) : null;
        const ticks = [lane.min, lane.min + (lane.max - lane.min) / 3, lane.min + ((lane.max - lane.min) * 2) / 3, lane.max];
        const statusLabel = getLaneStatus(lane);

        return (
          <article
            className="relative overflow-hidden rounded-[1.15rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_92%,white)_0%,color-mix(in_oklch,var(--panel)_56%,white)_100%)] px-4 py-4 shadow-[0_20px_50px_-38px_rgba(12,23,33,0.55)]"
            key={lane.id}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_68%)]" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Weighted headline</div>
                <h3 className="mt-1 text-[1rem] font-semibold tracking-[-0.02em] text-[color:var(--ink)]">{lane.label}</h3>
                <p className="mt-2 max-w-xl text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{lane.detail}</p>
              </div>
              <div className="grid justify-items-end gap-2 text-right">
                <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${palette.pillClass}`}>
                  {lane.direction === "higher_better" ? "Higher is better" : "Lower is better"}
                </div>
                <div className={`text-[2rem] font-semibold tabular-nums leading-none tracking-[-0.04em] text-[color:var(--ink)] ${palette.accentClass}`}>{lane.valueLabel}</div>
                {statusLabel ? <div className="text-[0.74rem] font-semibold text-[color:var(--ink-soft)]">{statusLabel}</div> : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 text-[0.66rem] font-medium text-[color:var(--ink-soft)]">
                Shared {lane.min}-{lane.max} dB scale
              </span>
              <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 text-[0.66rem] font-medium text-[color:var(--ink-soft)]">
                {lane.targetLabel ?? "No brief line armed"}
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--paper)_86%,white)_0%,color-mix(in_oklch,var(--panel)_72%,white)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Brief position</div>
                <div className="text-[0.72rem] text-[color:var(--ink-soft)]">{lane.targetLabel ?? "Track is reading without a project brief threshold."}</div>
              </div>

              <div className="relative pt-6">
                {palette.referenceBands.map((band, index) => (
                  <div
                    className="absolute inset-y-0 rounded-full"
                    key={`${lane.id}-band-${index}`}
                    style={{
                      background: band,
                      left: `${index * 33.3333}%`,
                      top: "24px",
                      width: "33.3333%",
                      height: "12px"
                    }}
                  />
                ))}
                <div className="relative h-3 rounded-full" style={{ background: palette.gradient }}>
                  {targetLeft ? (
                    <>
                      <div
                        className="absolute -top-5 -translate-x-1/2 rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2 py-0.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-soft)]"
                        style={{ left: targetLeft }}
                      >
                        Brief
                      </div>
                      <div
                        className="absolute inset-y-[-0.45rem] w-[2px] bg-[color:var(--ink)]/45"
                        style={{ left: `calc(${targetLeft} - 1px)` }}
                      />
                    </>
                  ) : null}
                  <div
                    className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-[3px] border-[color:var(--paper)] bg-[color:var(--ink)] shadow-[0_10px_22px_-14px_rgba(12,23,33,0.72)]"
                    style={{ left: `calc(${valueLeft} - 0.625rem)` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[0.72rem] font-semibold text-[color:var(--ink-faint)]">
                  {ticks.map((tick) => (
                    <span key={`${lane.id}-${tick}`}>{tick.toFixed(0)}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-[0.9rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/80 px-3 py-3">
                  <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Current read</div>
                  <div className="mt-2 text-[0.95rem] font-semibold tabular-nums text-[color:var(--ink)]">{lane.valueLabel}</div>
                  <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">{statusLabel ?? "Use the brief lane to arm a project threshold."}</div>
                </div>
                <div className="rounded-[0.9rem] border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)]/80 px-3 py-3">
                  <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Brief target</div>
                  <div className="mt-2 text-[0.95rem] font-semibold tabular-nums text-[color:var(--ink)]">{lane.targetLabel ?? "No target armed"}</div>
                  <div className="mt-1 text-[0.76rem] leading-5 text-[color:var(--ink-soft)]">
                    {lane.direction === "higher_better" ? "Higher targets read to the right." : "Lower targets read to the left."}
                  </div>
                </div>
              </div>
            </div>

            {lane.companions.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {lane.companions.map((companion) => (
                  <span
                    className="rounded-full border border-[color:color-mix(in_oklch,var(--ink)_8%,var(--line))] bg-[color:var(--paper)] px-2.5 py-1 text-[0.7rem] font-semibold tabular-nums text-[color:var(--ink-soft)]"
                    key={`${lane.id}-${companion.label}`}
                  >
                    {companion.label} {companion.valueLabel}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
