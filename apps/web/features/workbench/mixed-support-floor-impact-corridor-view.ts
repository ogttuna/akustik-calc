import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS =
  "predictor_mixed_support_primary_heavy_concrete_combined_owner_guarded_estimate";

export const MIXED_SUPPORT_FLOOR_IMPACT_LABEL =
  "Mixed-support single-primary carrier formula corridor";

const MIXED_SUPPORT_OUTPUTS = new Set<RequestedOutputId>([
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
]);

function formatDb(value: number): string {
  return value.toFixed(1);
}

function getImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): ImpactCalculation | null | undefined {
  if (!input) {
    return input;
  }

  return "impact" in input ? (input as AssemblyCalculation).impact : (input as ImpactCalculation);
}

export function isMixedSupportFloorImpactCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = getImpact(input);

  return Boolean(
    impact?.basis === MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS ||
      Object.values(impact?.metricBasis ?? {}).includes(MIXED_SUPPORT_FLOOR_IMPACT_FORMULA_BASIS)
  );
}

export function getMixedSupportFloorImpactCorridorErrorBudget(
  impact: ImpactCalculation | null | undefined,
  output: RequestedOutputId
): ImpactErrorBudget | null {
  const metricId = output === "Ln,w" ? "Ln,w" : output === "DeltaLw" ? "DeltaLw" : null;

  if (!metricId) {
    return null;
  }

  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId) ?? null;
}

export function formatMixedSupportFloorImpactErrorBudgetSummary(
  budget: ImpactErrorBudget
): string {
  return `${formatDb(budget.estimate)} dB range ${formatDb(budget.min)}-${formatDb(budget.max)} dB (+/-${formatDb(budget.toleranceDb)} dB corridor tolerance); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatMixedSupportFloorImpactErrorBudgetTerms(
  budget: ImpactErrorBudget
): string {
  return budget.terms
    .map((term) => `${term.termId} ${formatDb(term.db)} dB`)
    .join("; ");
}

export function getMixedSupportFloorImpactCorridorOutputDetail(
  output: RequestedOutputId,
  impact?: ImpactCalculation | null
): string | null {
  if (!MIXED_SUPPORT_OUTPUTS.has(output) || !isMixedSupportFloorImpactCorridorImpact(impact)) {
    return null;
  }

  const budget = getMixedSupportFloorImpactCorridorErrorBudget(impact, output);
  const budgetDetail = budget
    ? ` Gate BJ surface parity keeps the Gate BI error budget visible: ${formatMixedSupportFloorImpactErrorBudgetSummary(budget)}. Terms: ${formatMixedSupportFloorImpactErrorBudgetTerms(budget)}.`
    : "";

  switch (output) {
    case "Ln,w":
      return `Lab-side Ln,w from the Gate BI explicit single-primary-carrier mixed-support corridor. Exact measured rows still outrank it, and duplicate carrier ownership remains blocked.${budgetDetail}`;
    case "DeltaLw":
      return `DeltaLw from the Gate BI mixed-support corridor: primary reinforced-concrete carrier plus lower-treatment-only secondary owner, without double-counting the lower assembly as another carrier.${budgetDetail}`;
    case "L'n,w":
      return "Field-side L'n,w is carried from the mixed-support lab anchor through the explicit field K input. This is not an independent exact field measurement.";
    case "L'nT,w":
      return "Standardized L'nT,w is carried from the mixed-support lab anchor through explicit K and receiving-room volume. Keep it tied to the Gate BI field context.";
    case "L'nT,50":
      return "Low-frequency L'nT,50 is carried from the mixed-support standardized field result plus the explicit CI,50-2500 input.";
    default:
      return null;
  }
}

export function getMixedSupportFloorImpactCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent mixed-support formula corridor using an explicit single primary reinforced-concrete carrier, lower-treatment-only secondary owner, load basis, resilient dynamic stiffness, and duplicate-ownership guard. Keep the +/-7.5 dB Ln,w and +/-6.5 dB DeltaLw budgets visible and do not treat them as measured evidence.",
    label: MIXED_SUPPORT_FLOOR_IMPACT_LABEL,
    tone: "accent"
  };
}

export function getMixedSupportFloorImpactCorridorNarrative(): string {
  return "The current floor is using the Gate BI mixed-support single-primary carrier formula corridor. It increases coverage for mixed-support combined upper/lower stacks only when the primary carrier, transfer family, secondary owner, load basis, dynamic stiffness, and duplicate-ownership guard are explicit; unsafe duplicate-carrier partitions and ASTM aliases stay blocked.";
}
