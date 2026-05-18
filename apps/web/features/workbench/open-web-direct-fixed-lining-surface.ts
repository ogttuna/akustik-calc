import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const OPEN_WEB_DIRECT_FIXED_LINING_BASIS =
  "broad_accuracy_floor_open_web_direct_fixed_lining_direct_source_interpolation_formula_corridor";

export const OPEN_WEB_DIRECT_FIXED_LINING_LABEL =
  "Open-web steel direct-fixed lining interpolation";

const SURFACE_OUTPUTS = new Set<RequestedOutputId>(["Rw", "Ln,w", "CI", "Ln,w+CI"]);

function basisMatches(impact: ImpactCalculation | null | undefined): boolean {
  if (!impact) {
    return false;
  }

  return (
    impact.basis === OPEN_WEB_DIRECT_FIXED_LINING_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(OPEN_WEB_DIRECT_FIXED_LINING_BASIS)
  );
}

export function isOpenWebDirectFixedLiningImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isOpenWebDirectFixedLiningResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isOpenWebDirectFixedLiningImpact(result) &&
      result.floorSystemRatings?.basis === OPEN_WEB_DIRECT_FIXED_LINING_BASIS
  );
}

export function formatOpenWebDirectFixedLiningErrorBudgetSummary(budget: ImpactErrorBudget): string {
  return `${budget.estimate.toFixed(1)} dB range ${budget.min.toFixed(1)}-${budget.max.toFixed(1)} dB (+/-${budget.toleranceDb.toFixed(1)} dB direct-fixed interpolation budget); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatOpenWebDirectFixedLiningErrorBudgetTerms(budget: ImpactErrorBudget): string {
  return budget.terms.map((term) => `${term.termId} ${term.db.toFixed(1)} dB`).join("; ");
}

export function getOpenWebDirectFixedLiningOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isOpenWebDirectFixedLiningResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(0)}% fit` : "";
  const basisText =
    "Open-web steel direct-fixed lining interpolation is active inside the UBIQ FL-23/FL-25/FL-27 direct-fixed source grid";
  const boundaryText =
    "Exact source rows still win; resilient suspended-ceiling, out-of-band depth, duplicate carriers, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw is carried from the same source-absent direct-fixed interpolation, not from the generic airborne screening curve. ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from same-source direct-fixed anchor interpolation rather than the broad steel-family blend. ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same direct-fixed interpolation lane. ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same direct-fixed interpolation lane as Ln,w and CI. ${boundaryText}`;
    default:
      return null;
  }
}

export function getOpenWebDirectFixedLiningPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Open-web steel direct-fixed lining interpolation is a source-absent lab family estimate pinned to same-source UBIQ FL-23/FL-25/FL-27 direct-fixed anchors. Keep exact-source precedence, fit percentage, budgets, and non-lab boundaries visible.",
    label: "Direct-fixed open-web interpolation",
    tone: "accent"
  };
}
