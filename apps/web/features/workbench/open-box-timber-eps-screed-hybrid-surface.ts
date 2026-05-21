import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS =
  "broad_accuracy_floor_open_box_timber_eps_screed_hybrid_package_formula_corridor";

export const OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_LABEL =
  "Open-box timber EPS/screed hybrid package formula corridor";

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
    impact.basis === OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS)
  );
}

export function isOpenBoxTimberEpsScreedHybridImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isOpenBoxTimberEpsScreedHybridResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isOpenBoxTimberEpsScreedHybridImpact(result) &&
      result.floorSystemRatings?.basis === OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_BASIS
  );
}

export function formatOpenBoxTimberEpsScreedHybridErrorBudgetSummary(
  budget: ImpactErrorBudget
): string {
  return `${budget.estimate.toFixed(1)} dB range ${budget.min.toFixed(1)}-${budget.max.toFixed(1)} dB (+/-${budget.toleranceDb.toFixed(1)} dB open-box timber EPS/screed hybrid package budget); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatOpenBoxTimberEpsScreedHybridErrorBudgetTerms(
  budget: ImpactErrorBudget
): string {
  return budget.terms.map((term) => `${term.termId} ${term.db.toFixed(1)} dB`).join("; ");
}

export function getOpenBoxTimberEpsScreedHybridOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isOpenBoxTimberEpsScreedHybridResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(0)}% fit` : "";
  const basisText =
    "Open-box timber EPS/screed hybrid package formula corridor is active on a source-absent element-lab lane";
  const ownerText =
    "The lane owns the 35 mm EPS board, geotextile/screed mass, 3 mm EPS underlay, 8 mm laminate, mineral-wool fill, family-A ceiling cavity, and resilient ceiling board package.";
  const boundaryText =
    "Exact R7b still wins; dry package-transfer, raw-bare carriers, R8b/R9b/R2c/R10a sibling negatives, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw comes from the EPS/screed source-absent formula, not from dry package-transfer, raw-bare, or generic airborne screening. ${ownerText} ${boundaryText}`;
    case "C":
      return `${basisText}${fitText}. C is carried as the ISO 717-1 adaptation term from the same EPS/screed hybrid package formula. ${ownerText} ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from the EPS/screed hybrid package source-absent formula anchored to R7b, not from a measured row for this variant. ${ownerText} ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same EPS/screed hybrid package formula lane. ${ownerText} ${boundaryText}`;
    case "CI,50-2500":
      return `${basisText}${fitText}. CI,50-2500 remains on the same lab EPS/screed hybrid package lane and is not an ASTM or field adapter. ${ownerText} ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same EPS/screed hybrid package formula lane as Ln,w and CI. ${ownerText} ${boundaryText}`;
    default:
      return null;
  }
}

export function getOpenBoxTimberEpsScreedHybridPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Open-box timber EPS/screed hybrid package formula corridor is a source-absent lab estimate for the owned EPS board, wet screed, EPS underlay, laminate, mineral-wool fill, and resilient ceiling package. Keep exact-source precedence, budgets, and non-lab boundaries visible.",
    label: "EPS/screed hybrid formula",
    tone: "accent"
  };
}
