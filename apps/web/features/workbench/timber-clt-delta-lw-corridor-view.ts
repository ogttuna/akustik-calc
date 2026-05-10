import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const TIMBER_JOIST_DELTA_LW_FORMULA_BASIS =
  "predictor_timber_joist_delta_lw_formula_corridor_estimate";
export const MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS =
  "predictor_mass_timber_clt_delta_lw_formula_corridor_estimate";

export function getTimberCltDeltaLwFormulaBasis(
  impact: ImpactCalculation | null | undefined
): typeof MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS | typeof TIMBER_JOIST_DELTA_LW_FORMULA_BASIS | null {
  const basis = impact?.metricBasis?.DeltaLw;

  if (basis === TIMBER_JOIST_DELTA_LW_FORMULA_BASIS || basis === MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS) {
    return basis;
  }

  return null;
}

export function isTimberCltDeltaLwFormulaCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return getTimberCltDeltaLwFormulaBasis(impact) !== null;
}

function formatDb(value: number): string {
  return value.toFixed(1);
}

function getFamilyLabel(impact: ImpactCalculation | null | undefined): string {
  return getTimberCltDeltaLwFormulaBasis(impact) === MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS
    ? "Mass-timber CLT"
    : "Timber joist";
}

export function getTimberCltDeltaLwFormulaErrorBudget(
  impact: ImpactCalculation | null | undefined
): ImpactErrorBudget | null {
  return impact?.errorBudgets?.find((budget) => budget.metricId === "DeltaLw") ?? null;
}

export function formatTimberCltDeltaLwFormulaErrorBudgetSummary(budget: ImpactErrorBudget): string {
  return `${formatDb(budget.estimate)} dB range ${formatDb(budget.min)}-${formatDb(budget.max)} dB (+/-${formatDb(budget.toleranceDb)} dB corridor tolerance); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatTimberCltDeltaLwFormulaErrorBudgetTerms(budget: ImpactErrorBudget): string {
  return budget.terms
    .map((term) => `${term.termId} ${formatDb(term.db)} dB`)
    .join("; ");
}

export function getTimberCltDeltaLwFormulaCorridorOutputDetail(
  output: RequestedOutputId,
  impact?: ImpactCalculation | null
): string | null {
  if (output !== "DeltaLw" || !isTimberCltDeltaLwFormulaCorridorImpact(impact)) {
    return null;
  }

  const budget = getTimberCltDeltaLwFormulaErrorBudget(impact);
  const budgetDetail = budget
    ? ` Error budget: ${formatTimberCltDeltaLwFormulaErrorBudgetSummary(budget)}. Terms: ${formatTimberCltDeltaLwFormulaErrorBudgetTerms(budget)}.`
    : "";

  return `${getFamilyLabel(impact)} DeltaLw from the timber/CLT formula corridor. Source-absent lab estimate with +/-7.5 dB corridor tolerance; Ln,w stays on its exact or published-family metric basis.${budgetDetail}`;
}

export function getTimberCltDeltaLwFormulaCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent lab DeltaLw formula corridor using explicit load basis, resilient dynamic stiffness, lower assembly coupling, and structural-family correction. Keep the +/-7.5 dB DeltaLw tolerance visible and do not treat it as measured evidence.",
    label: "Timber/CLT DeltaLw formula",
    tone: "accent"
  };
}
