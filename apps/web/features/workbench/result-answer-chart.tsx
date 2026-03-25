"use client";

import type { AssemblyCalculation } from "@dynecho/shared";

import { buildResultAnswerChartLanes } from "./result-answer-chart-model";

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

export function ResultAnswerChart({ result, targetLnwDb, targetRwDb }: ResultAnswerChartProps) {
  const lanes = buildResultAnswerChartLanes({ result, targetLnwDb, targetRwDb });

  if (lanes.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lanes.map((lane) => {
        const gradient =
          lane.direction === "higher_better"
            ? "linear-gradient(90deg,var(--warning),var(--accent),var(--success))"
            : "linear-gradient(90deg,var(--success),var(--accent),var(--warning))";
        const valueLeft = clampPercent(lane.value, lane.min, lane.max);
        const targetLeft = lane.target !== null ? clampPercent(lane.target, lane.min, lane.max) : null;
        const ticks = [lane.min, lane.min + (lane.max - lane.min) / 3, lane.min + ((lane.max - lane.min) * 2) / 3, lane.max];

        return (
          <article className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-3" key={lane.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Active answer</div>
                <h3 className="mt-1 text-base font-semibold leading-tight text-[color:var(--ink)]">{lane.label}</h3>
                <p className="mt-2 max-w-xl text-[0.8rem] leading-5 text-[color:var(--ink-soft)]">{lane.detail}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {lane.direction === "higher_better" ? "Higher is better" : "Lower is better"}
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums leading-none tracking-[-0.03em] text-[color:var(--ink)]">{lane.valueLabel}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="relative h-3 rounded-sm" style={{ background: gradient }}>
                {targetLeft ? (
                  <div
                    className="absolute inset-y-[-0.25rem] w-[2px] bg-[color:var(--ink)]/50"
                    style={{ left: `calc(${targetLeft} - 1px)` }}
                  />
                ) : null}
                <div
                  className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-sm border-2 border-[color:var(--paper)] bg-[color:var(--ink)] shadow-[0_2px_6px_var(--shadow-color)]"
                  style={{ left: `calc(${valueLeft} - 0.625rem)` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-[color:var(--ink-faint)]">
                {ticks.map((tick) => (
                  <span key={`${lane.id}-${tick}`}>{tick.toFixed(0)}</span>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-[color:var(--ink-soft)]">{lane.targetLabel ?? "No brief limit armed for this lane."}</span>
                {lane.target !== null ? (
                  <span className="font-semibold text-[color:var(--ink)]">
                    {lane.direction === "higher_better"
                      ? lane.value >= lane.target
                        ? "On or above brief"
                        : "Below brief"
                      : lane.value <= lane.target
                        ? "On or below brief"
                        : "Above brief"}
                  </span>
                ) : null}
              </div>
            </div>

            {lane.companions.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {lane.companions.map((companion) => (
                  <span
                    className="rounded border border-[color:var(--line)] bg-[color:var(--panel-strong)] px-2 py-0.5 text-[0.7rem] font-semibold tabular-nums text-[color:var(--ink-soft)]"
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
