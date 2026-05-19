import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const OPEN_BOX_TIMBER_SIMILARITY_BASIS =
  "broad_accuracy_floor_open_box_timber_similarity_package_transfer_formula_corridor";

export const OPEN_BOX_TIMBER_SIMILARITY_LABEL =
  "Open-box timber package-transfer corridor";

const SURFACE_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "C",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
]);

function basisMatches(impact: ImpactCalculation | null | undefined): boolean {
  if (!impact) {
    return false;
  }

  return (
    impact.basis === OPEN_BOX_TIMBER_SIMILARITY_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(OPEN_BOX_TIMBER_SIMILARITY_BASIS)
  );
}

export function isOpenBoxTimberSimilarityImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isOpenBoxTimberSimilarityResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isOpenBoxTimberSimilarityImpact(result) &&
      result.floorSystemRatings?.basis === OPEN_BOX_TIMBER_SIMILARITY_BASIS
  );
}

export function formatOpenBoxTimberSimilarityErrorBudgetSummary(budget: ImpactErrorBudget): string {
  return `${budget.estimate.toFixed(1)} dB range ${budget.min.toFixed(1)}-${budget.max.toFixed(1)} dB (+/-${budget.toleranceDb.toFixed(1)} dB open-box timber package-transfer budget); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatOpenBoxTimberSimilarityErrorBudgetTerms(budget: ImpactErrorBudget): string {
  return budget.terms.map((term) => `${term.termId} ${term.db.toFixed(1)} dB`).join("; ");
}

export function getOpenBoxTimberSimilarityOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isOpenBoxTimberSimilarityResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(0)}% fit` : "";
  const basisText =
    "Open-box timber package-transfer corridor is active inside the TUAS measured open-box timber packet family";
  const boundaryText =
    "Exact TUAS rows still win; raw bare carriers, exact-only hybrid packets, mixed staged packages, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw is carried from the same source-absent package-transfer estimate, not from the generic airborne screening curve. ${boundaryText}`;
    case "C":
      return `${basisText}${fitText}. C is carried as the Rw+C companion term from the same open-box timber packet-transfer lane. ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from the same-family TUAS packet-transfer estimate rather than an open-web steel row or broad low-confidence blend. ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same open-box timber package-transfer lane. ${boundaryText}`;
    case "CI,50-2500":
      return `${basisText}${fitText}. CI,50-2500 remains on the same lab open-box timber packet-transfer lane and is not an ASTM or field adapter. ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same package-transfer lane as Ln,w and CI. ${boundaryText}`;
    default:
      return null;
  }
}

export function getOpenBoxTimberSimilarityPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Open-box timber package-transfer corridor is a source-absent lab family estimate pinned to same-family TUAS measured open-box timber packets. Keep exact-source precedence, fit percentage, budgets, and non-lab boundaries visible.",
    label: "Open-box timber package transfer",
    tone: "accent"
  };
}
