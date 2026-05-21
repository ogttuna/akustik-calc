import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const OPEN_WEB_RAW_BARE_BASIS =
  "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor";

export const OPEN_WEB_RAW_BARE_LABEL =
  "Raw-bare open-web steel formula corridor";

const SURFACE_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "C",
  "Ctr",
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
    impact.basis === OPEN_WEB_RAW_BARE_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(OPEN_WEB_RAW_BARE_BASIS)
  );
}

export function isOpenWebRawBareImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isOpenWebRawBareResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isOpenWebRawBareImpact(result) &&
      result.floorSystemRatings?.basis === OPEN_WEB_RAW_BARE_BASIS
  );
}

export function formatOpenWebRawBareErrorBudgetSummary(budget: ImpactErrorBudget): string {
  return `${budget.estimate.toFixed(1)} dB range ${budget.min.toFixed(1)}-${budget.max.toFixed(1)} dB (+/-${budget.toleranceDb.toFixed(1)} dB raw-bare open-web steel formula budget); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatOpenWebRawBareErrorBudgetTerms(budget: ImpactErrorBudget): string {
  return budget.terms.map((term) => `${term.termId} ${term.db.toFixed(1)} dB`).join("; ");
}

export function getOpenWebRawBareOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isOpenWebRawBareResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(0)}% fit` : "";
  const basisText =
    "Raw-bare open-web steel formula corridor is active on a source-absent bare-carrier element-lab lane";
  const boundaryText =
    "Exact UBIQ package rows and direct-fixed INEX/firestop routes still win when they truly match; partial packages, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw comes from the bare open-web carrier formula, not from UBIQ INEX/firestop packages or generic airborne screening. ${boundaryText}`;
    case "C":
      return `${basisText}${fitText}. C is carried as the ISO 717-1 adaptation term from the same raw-bare open-web formula. ${boundaryText}`;
    case "Ctr":
      return `${basisText}${fitText}. Ctr is carried as the traffic-noise adaptation term from the same raw-bare open-web formula. ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from the raw-bare open-web source-absent formula rather than UBIQ finished-package, direct-fixed, or broad steel-family rows. ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same raw-bare open-web formula lane. ${boundaryText}`;
    case "CI,50-2500":
      return `${basisText}${fitText}. CI,50-2500 remains on the same lab raw-bare open-web formula lane and is not an ASTM or field adapter. ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same raw-bare open-web formula lane as Ln,w and CI. ${boundaryText}`;
    default:
      return null;
  }
}

export function getOpenWebRawBarePosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Raw-bare open-web steel formula corridor is a source-absent lab estimate for explicit bare steel carriers. Keep exact-source/package precedence, fit percentage, budgets, and non-lab boundaries visible.",
    label: "Raw-bare open-web formula",
    tone: "accent"
  };
}
