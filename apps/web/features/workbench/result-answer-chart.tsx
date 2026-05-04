"use client";

import React from "react";
import type { AssemblyCalculation } from "@dynecho/shared";

import { buildResultAnswerChartLanes, type ResultAnswerChartLane } from "./result-answer-chart-model";

type ResultAnswerChartProps = {
  layout?: "auto" | "stacked";
  result: AssemblyCalculation | null;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
};

function getLaneStatus(lane: ResultAnswerChartLane): string | null {
  if (lane.target === null) {
    return null;
  }

  if (lane.direction === "higher_better") {
    return lane.value >= lane.target ? "On or above brief" : "Below brief";
  }

  return lane.value <= lane.target ? "On or below brief" : "Above brief";
}

function getLaneMeaning(lane: ResultAnswerChartLane): string {
  return lane.direction === "higher_better"
    ? "This is an isolation rating. Higher dB means better separation."
    : "This is an impact-noise level. Lower dB means less transmitted impact sound.";
}

function getLaneRule(lane: ResultAnswerChartLane): string {
  if (lane.target === null) {
    return lane.direction === "higher_better" ? "Set a minimum target to compare this read." : "Set a maximum target to compare this read.";
  }

  return lane.direction === "higher_better"
    ? `${lane.valueLabel} should be at least ${lane.targetLabel?.replace("Brief minimum ", "") ?? "the brief target"}.`
    : `${lane.valueLabel} should be no more than ${lane.targetLabel?.replace("Brief maximum ", "") ?? "the brief target"}.`;
}

export function ResultAnswerChart({ layout = "auto", result, targetLnwDb, targetRwDb }: ResultAnswerChartProps) {
  const lanes = buildResultAnswerChartLanes({ result, targetLnwDb, targetRwDb });

  if (lanes.length === 0) {
    return null;
  }

  return (
    <div className={layout === "stacked" ? "grid gap-4" : "grid gap-4 2xl:grid-cols-2"}>
      {lanes.map((lane) => {
        const statusLabel = getLaneStatus(lane);
        const passing =
          lane.target === null ? null : lane.direction === "higher_better" ? lane.value >= lane.target : lane.value <= lane.target;
        const statusClass =
          passing === null
            ? "border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink-soft)]"
            : passing
              ? "border-[color:color-mix(in_oklch,var(--success)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))] text-[color:var(--success-ink)]"
              : "border-[color:color-mix(in_oklch,var(--warning)_30%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_12%,var(--paper))] text-[color:var(--warning-ink)]";

        return (
          <article
            className="rounded border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-4"
            key={lane.id}
          >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">Current result</div>
                <h3 className="mt-1 text-[1rem] font-semibold text-[color:var(--ink)]">{lane.label}</h3>
                <p className="mt-2 max-w-xl text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{lane.detail}</p>
              </div>
              <div className="grid justify-items-start gap-2 text-left sm:justify-items-end sm:text-right">
                <div className="text-[2rem] font-semibold tabular-nums leading-none text-[color:var(--ink)]">{lane.valueLabel}</div>
                <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${statusClass}`}>
                  {statusLabel ?? "No target"}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-3">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Target</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{lane.targetLabel ?? "No target set"}</div>
              </div>
              <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-3">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Rule</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {lane.direction === "higher_better" ? "Higher is better" : "Lower is better"}
                </div>
              </div>
              <div className="rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-3">
                <div className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Meaning</div>
                <div className="mt-2 text-sm leading-5 text-[color:var(--ink-soft)]">{getLaneMeaning(lane)}</div>
              </div>
            </div>

            <p className="mt-3 text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">{getLaneRule(lane)}</p>

            {lane.companions.length > 0 ? (
              <details className="mt-3 rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-2">
                <summary className="cursor-pointer text-[0.78rem] font-semibold text-[color:var(--ink)]">
                  Supporting values
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lane.companions.map((companion) => (
                    <span
                      className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-2.5 py-1 text-[0.7rem] font-semibold tabular-nums text-[color:var(--ink-soft)]"
                      key={`${lane.id}-${companion.label}`}
                    >
                      {companion.label} {companion.valueLabel}
                    </span>
                  ))}
                </div>
              </details>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
