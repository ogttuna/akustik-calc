"use client";

import type { AssemblyCalculation } from "@dynecho/shared";
import { Pill, SurfacePanel } from "@dynecho/ui";
import { ResponseCurveFigureCard } from "./response-curve-figure-card";
import { buildWorkbenchResponseCurveFigures } from "./response-curve-model";

type ResponseCurvesPanelProps = {
  result: AssemblyCalculation | null;
};

export function ResponseCurvesPanel({ result }: ResponseCurvesPanelProps) {
  const figures = buildWorkbenchResponseCurveFigures(result);

  if (!result) {
    return null;
  }

  return (
    <SurfacePanel className="px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--ink)]">Response curves</h2>
        <div className="flex flex-wrap gap-2">
          <Pill tone="accent">Solver band data</Pill>
          {figures.some((figure) => figure.id === "impact") ? <Pill tone="success">Impact live</Pill> : <Pill tone="neutral">Impact unavailable</Pill>}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {figures.map((figure) => {
          return (
            <ResponseCurveFigureCard figure={figure} key={figure.id} />
          );
        })}

        {!figures.some((figure) => figure.id === "impact") ? (
          <div className="rounded border border-dashed border-[color:var(--line)] px-4 py-3 text-[0.82rem] text-[color:var(--ink-soft)]">
            Impact band data not available on this lane.
          </div>
        ) : null}
      </div>
    </SurfacePanel>
  );
}
