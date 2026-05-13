import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const HEAVY_CONCRETE_COMBINED_FORMULA_BASIS =
  "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate";

export function isHeavyConcreteCombinedFormulaCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return impact?.basis === HEAVY_CONCRETE_COMBINED_FORMULA_BASIS;
}

function formatDb(value: number): string {
  return value.toFixed(1);
}

export function getHeavyConcreteCombinedFormulaErrorBudget(
  impact: ImpactCalculation | null | undefined,
  output: RequestedOutputId
): ImpactErrorBudget | null {
  const metricId = output === "Ln,w" ? "Ln,w" : output === "DeltaLw" ? "DeltaLw" : null;

  if (!metricId) {
    return null;
  }

  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId) ?? null;
}

export function formatHeavyConcreteCombinedFormulaErrorBudgetSummary(
  budget: ImpactErrorBudget
): string {
  return `${formatDb(budget.estimate)} dB range ${formatDb(budget.min)}-${formatDb(budget.max)} dB (+/-${formatDb(budget.toleranceDb)} dB corridor tolerance); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatHeavyConcreteCombinedFormulaErrorBudgetTerms(
  budget: ImpactErrorBudget
): string {
  return budget.terms
    .map((term) => `${term.termId} ${formatDb(term.db)} dB`)
    .join("; ");
}

export function getHeavyConcreteCombinedFormulaCorridorOutputDetail(
  output: RequestedOutputId,
  impact?: ImpactCalculation | null
): string | null {
  if (!isHeavyConcreteCombinedFormulaCorridorImpact(impact)) {
    return null;
  }

  const budget = getHeavyConcreteCombinedFormulaErrorBudget(impact, output);
  const budgetDetail = budget
    ? ` Gate BE error budget: ${formatHeavyConcreteCombinedFormulaErrorBudgetSummary(budget)}. Terms: ${formatHeavyConcreteCombinedFormulaErrorBudgetTerms(budget)}.`
    : "";

  switch (output) {
    case "Ln,w":
      return `Lab-side Ln,w from the Gate BD heavy-concrete combined upper/lower formula corridor. Source-absent estimate with +/-6.5 dB corridor tolerance; exact measured rows still outrank it.${budgetDetail}`;
    case "DeltaLw":
      return `Total DeltaLw from upper floating treatment plus lower suspended ceiling minus bounded interaction penalty. Source-absent estimate with +/-5.5 dB corridor tolerance.${budgetDetail}`;
    default:
      return null;
  }
}

export function getHeavyConcreteCombinedFormulaCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent lab formula corridor using explicit reinforced-concrete slab mass, upper load basis, resilient dynamic stiffness, lower ceiling treatment, and bounded upper/lower coupling. Keep the +/-6.5 dB Ln,w and +/-5.5 dB DeltaLw budgets visible and do not treat them as measured evidence.",
    label: "Heavy concrete combined formula corridor",
    tone: "accent"
  };
}

export function getHeavyConcreteCombinedFormulaCorridorNarrative(): string {
  return "The current source-absent heavy-concrete floor is using the Gate BD combined upper/lower formula corridor. Exact measured rows still win on a true match; otherwise lab Ln,w and DeltaLw stay tied to explicit slab mass, load, dynamic stiffness, lower-ceiling owners, and +/-6.5 dB / +/-5.5 dB not-measured budgets.";
}
