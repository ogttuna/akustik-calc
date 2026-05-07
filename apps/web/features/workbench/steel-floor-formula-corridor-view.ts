import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const STEEL_FLOOR_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";

export function isSteelFloorFormulaCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return impact?.basis === STEEL_FLOOR_FORMULA_BASIS;
}

function formatDb(value: number): string {
  return value.toFixed(1);
}

export function getSteelFloorFormulaErrorBudget(
  impact: ImpactCalculation | null | undefined,
  output: RequestedOutputId
): ImpactErrorBudget | null {
  const metricId = output === "Ln,w" ? "Ln,w" : output === "DeltaLw" ? "DeltaLw" : null;

  if (!metricId) {
    return null;
  }

  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId) ?? null;
}

export function formatSteelFloorFormulaErrorBudgetSummary(budget: ImpactErrorBudget): string {
  return `${formatDb(budget.estimate)} dB range ${formatDb(budget.min)}-${formatDb(budget.max)} dB (+/-${formatDb(budget.toleranceDb)} dB corridor tolerance); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatSteelFloorFormulaErrorBudgetTerms(budget: ImpactErrorBudget): string {
  return budget.terms
    .map((term) => `${term.termId} ${formatDb(term.db)} dB`)
    .join("; ");
}

export function getSteelFloorFormulaCorridorOutputDetail(
  output: RequestedOutputId,
  impact?: ImpactCalculation | null
): string | null {
  const budget = getSteelFloorFormulaErrorBudget(impact, output);
  const budgetDetail = budget
    ? ` Gate AN error budget: ${formatSteelFloorFormulaErrorBudgetSummary(budget)}. Terms: ${formatSteelFloorFormulaErrorBudgetTerms(budget)}.`
    : "";

  switch (output) {
    case "Ln,w":
      return `Lab-side Ln,w from the Gate AD lightweight-steel formula corridor. Source-absent estimate with +/-4.5 dB corridor tolerance; exact measured rows still outrank it.${budgetDetail}`;
    case "DeltaLw":
      return `Upper-package DeltaLw from the steel mass-spring relation before carrier-transfer correction. Source-absent estimate with +/-2.0 dB corridor tolerance.${budgetDetail}`;
    default:
      return null;
  }
}

export function getSteelFloorFormulaCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent lab formula corridor using explicit steel carrier geometry, load mass, resilient dynamic stiffness, and lower isolation. Keep the +/-4.5 dB Ln,w and +/-2.0 dB DeltaLw tolerances visible until source calibration tightens the lane.",
    label: "Steel formula corridor",
    tone: "accent"
  };
}

export function getSteelFloorFormulaCorridorNarrative(): string {
  return "The current source-absent steel floor is using the Gate AD mass-spring formula corridor, not the broad steel-family blend. Exact measured rows still win on a true match; otherwise the lab Ln,w and DeltaLw stay tied to explicit carrier, load, stiffness, and lower-isolation inputs with +/-4.5 dB and +/-2.0 dB tolerances.";
}
