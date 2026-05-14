import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const STEEL_FLOOR_FORMULA_BASIS = "predictor_lightweight_steel_mass_spring_holdout_corridor_estimate";
export const STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS =
  "predictor_lightweight_steel_suspended_ceiling_corridor_estimate";
const STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE = "steel_suspended_ceiling_lower_reference";

export function isSteelFloorFormulaCorridorImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return (
    impact?.basis === STEEL_FLOOR_FORMULA_BASIS ||
    impact?.basis === STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS ||
    impact?.scope === "steel_floor_formula_corridor"
  );
}

function formatDb(value: number): string {
  return value.toFixed(1);
}

function isSuspendedCeilingReferencedSteelFormula(
  impact: ImpactCalculation | null | undefined
): boolean {
  return impact?.basis === STEEL_FLOOR_FORMULA_BASIS &&
    impact.referenceFloorType === STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE;
}

export function getSteelFloorFormulaErrorBudget(
  impact: ImpactCalculation | null | undefined,
  output: RequestedOutputId
): ImpactErrorBudget | null {
  const metricId =
    output === "Ln,w" ||
    output === "DeltaLw" ||
    output === "L'n,w" ||
    output === "L'nT,w" ||
    output === "L'nT,50"
      ? output
      : null;

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
      if (isSuspendedCeilingReferencedSteelFormula(impact)) {
        return `Lab-side Ln,w from the lightweight-steel suspended-ceiling DeltaLw formula corridor. The Gate BK lower suspended-ceiling reference is combined with the upper-package mass-spring reduction; exact measured rows still outrank it.${budgetDetail}`;
      }

      if (impact?.basis === STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS) {
        return `Lab-side Ln,w from the Gate BK lightweight-steel suspended-ceiling-only formula corridor. Source-absent estimate with +/-6.0 dB corridor tolerance; exact measured rows still outrank it.${budgetDetail}`;
      }
      return `Lab-side Ln,w from the Gate AD lightweight-steel formula corridor. Source-absent estimate with +/-4.5 dB corridor tolerance; exact measured rows still outrank it.${budgetDetail}`;
    case "DeltaLw":
      if (isSuspendedCeilingReferencedSteelFormula(impact)) {
        return `Upper-package DeltaLw from the steel mass-spring relation, applied against the Gate BK lower suspended-ceiling reference before carrier-transfer correction. Source-absent estimate with +/-2.0 dB corridor tolerance.${budgetDetail}`;
      }

      return `Upper-package DeltaLw from the steel mass-spring relation before carrier-transfer correction. Source-absent estimate with +/-2.0 dB corridor tolerance.${budgetDetail}`;
    case "L'n,w":
      return `Field-side L'n,w from the steel suspended-ceiling lab corridor plus explicit field K. This is source-absent field-adapter output, not measured field evidence.${budgetDetail}`;
    case "L'nT,w":
      return `Standardized field L'nT,w from the steel suspended-ceiling lab corridor, explicit field K, and receiving-room volume normalization. This is source-absent field-adapter output, not measured field evidence.${budgetDetail}`;
    case "L'nT,50":
      return `Low-frequency standardized field L'nT,50 from L'nT,w + CI,50-2500 on the steel suspended-ceiling route. This is source-absent field-adapter output, not measured field evidence.${budgetDetail}`;
    default:
      return null;
  }
}

export function getSteelFloorFormulaCorridorPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Source-absent lab formula corridor using explicit steel carrier geometry and lower isolation, with upper-package load and stiffness required for DeltaLw. Keep +/-4.5 dB Ln,w and +/-2.0 dB DeltaLw visible for Gate AD; Gate BK suspended-ceiling-only Ln,w uses +/-6.0 dB until source calibration tightens that lane.",
    label: "Steel formula corridor",
    tone: "accent"
  };
}

export function getSteelFloorFormulaCorridorNarrative(): string {
  return "The current source-absent steel floor is using a named steel formula corridor, not the broad steel-family blend. Exact measured rows still win on a true match; otherwise lab impact outputs stay tied to explicit carrier and lower-isolation owners, with upper-package load and stiffness required before DeltaLw can appear.";
}
