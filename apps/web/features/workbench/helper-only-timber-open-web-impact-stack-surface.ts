import type {
  AssemblyCalculation,
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import type { SimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";

export const HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";

export const HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_LABEL =
  "Helper-only timber/open-web formula corridor";

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
    impact.basis === HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS ||
    Object.values(impact.metricBasis ?? {}).includes(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS)
  );
}

export function isHelperOnlyTimberOpenWebImpactStackImpact(
  input: AssemblyCalculation | ImpactCalculation | null | undefined
): boolean {
  const impact = input && "impact" in input ? input.impact : input;

  return basisMatches(impact);
}

export function isHelperOnlyTimberOpenWebImpactStackResult(
  result: AssemblyCalculation | null | undefined
): result is AssemblyCalculation {
  return Boolean(
    result &&
      isHelperOnlyTimberOpenWebImpactStackImpact(result) &&
      result.floorSystemRatings?.basis === HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS
  );
}

export function formatHelperOnlyTimberOpenWebImpactStackErrorBudgetSummary(
  budget: ImpactErrorBudget
): string {
  return `${budget.estimate.toFixed(1)} dB range ${budget.min.toFixed(1)}-${budget.max.toFixed(1)} dB (+/-${budget.toleranceDb.toFixed(1)} dB helper-only timber/open-web formula budget); origin ${budget.origin}; ${budget.notMeasuredEvidence ? "not measured evidence" : "measured evidence"}`;
}

export function formatHelperOnlyTimberOpenWebImpactStackErrorBudgetTerms(
  budget: ImpactErrorBudget
): string {
  return budget.terms.map((term) => `${term.termId} ${term.db.toFixed(1)} dB`).join("; ");
}

export function getHelperOnlyTimberOpenWebImpactStackOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  if (!SURFACE_OUTPUTS.has(output) || !isHelperOnlyTimberOpenWebImpactStackResult(result)) {
    return null;
  }

  const fit = result.dynamicImpactTrace?.fitPercent;
  const fitText = typeof fit === "number" ? ` at ${fit.toFixed(0)}% fit` : "";
  const familyText = result.floorSystemEstimate?.structuralFamily ?? "helper-only lower-treatment";
  const basisText =
    `Helper-only timber/open-web formula corridor is active on a source-absent element-lab lower-treatment lane for ${familyText}`;
  const boundaryText =
    "Exact/package, raw-bare, direct-fixed, supported-band, field, building, ASTM, and IIC outputs stay outside this lab lane.";

  switch (output) {
    case "Rw":
      return `${basisText}${fitText}. Companion floor-lane Rw comes from the helper-only lower-treatment formula, not from package-transfer, raw-bare, or generic screening rows. ${boundaryText}`;
    case "C":
      return `${basisText}${fitText}. C is carried as the ISO 717-1 adaptation term from the same helper-only formula lane. ${boundaryText}`;
    case "Ctr":
      return `${basisText}${fitText}. Ctr is carried as the traffic-noise adaptation term from the same helper-only formula lane. ${boundaryText}`;
    case "Ln,w":
      return `${basisText}${fitText}. Lab Ln,w comes from the helper-only source-absent formula with lower board, cavity, absorber, and suspension ownership attached. ${boundaryText}`;
    case "CI":
      return `${basisText}${fitText}. CI is the low-frequency companion term from the same helper-only formula lane. ${boundaryText}`;
    case "CI,50-2500":
      return `${basisText}${fitText}. CI,50-2500 remains on the helper-only lab formula lane and is not an ASTM or field adapter. ${boundaryText}`;
    case "Ln,w+CI":
      return `${basisText}${fitText}. Ln,w+CI is computed on the same helper-only formula lane as Ln,w and CI. ${boundaryText}`;
    default:
      return null;
  }
}

export function getHelperOnlyTimberOpenWebImpactStackPosture(): SimpleWorkbenchOutputPosture {
  return {
    detail:
      "Helper-only timber/open-web formula corridor is a source-absent element-lab estimate for complete explicit lower-treatment stacks. Keep exact/package/raw-bare precedence, fit percentage, budgets, and non-lab boundaries visible.",
    label: "Helper-only formula",
    tone: "accent"
  };
}
