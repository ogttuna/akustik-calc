import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import {
  ImpactCalculationSchema,
  type ExactFloorSystem,
  type FloorSystemEstimateResult,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor,
  type BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics,
  type BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget,
  type BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTerm
} from "./broad-accuracy-floor-open-box-timber-raw-bare-formula-corridor";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, round1 } from "./math";

export const OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS =
  "broad_accuracy_floor_open_box_timber_raw_bare_source_absent_formula_corridor";

const RUNTIME_TARGET_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
]);

const RAW_BARE_CONTEXT_SOURCE_IDS = [
  "tuas_r2a_open_box_timber_measured_2026",
  "tuas_r3a_open_box_timber_measured_2026",
  "tuas_r5b_open_box_timber_measured_2026"
] as const;

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function withFieldAnchorOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  const expanded = [...outputs];
  const needsFieldAnchor = outputs.some((output) =>
    output === "L'n,w" || output === "L'nT,w" || output === "L'nT,50"
  );

  if (needsFieldAnchor) {
    expanded.push("Ln,w");
  }

  if (outputs.includes("L'nT,50")) {
    expanded.push("CI,50-2500");
  }

  return uniqueRequestedOutputs(expanded);
}

function isOpenBoxTimberBaseLayer(layer: ResolvedLayer): boolean {
  return layer.material.id === "open_box_timber_slab" &&
    (!layer.floorRole || layer.floorRole === "base_structure");
}

function detectRawBareOpenBoxTimberCarrier(layers: readonly ResolvedLayer[]): {
  readonly carrierDepthMm: number;
  readonly roleTopologyState: "safe_split_equivalent" | "source_equivalent";
} | null {
  if (layers.length === 0 || layers.some((layer) => !isOpenBoxTimberBaseLayer(layer))) {
    return null;
  }

  const carrierDepthMm = round1(layers.reduce((sum, layer) => sum + layer.thicknessMm, 0));

  if (carrierDepthMm < 180 || carrierDepthMm > 420) {
    return null;
  }

  return {
    carrierDepthMm,
    roleTopologyState: layers.length > 1 ? "safe_split_equivalent" : "source_equivalent"
  };
}

function inferRawBareFormulaInputs(carrierDepthMm: number): {
  readonly lossFactor: number;
  readonly surfaceMassKgM2: number;
  readonly voidFraction: number;
} {
  const thinToDeepPosition = clamp((370 - carrierDepthMm) / 150, 0, 1);

  return {
    lossFactor: Math.round((0.04 - (0.005 * thinToDeepPosition)) * 1000) / 1000,
    surfaceMassKgM2: round1(96 - (34 * thinToDeepPosition)),
    voidFraction: Math.round((0.4 + (0.1 * thinToDeepPosition)) * 1000) / 1000
  };
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function budgetTermReason(term: BroadAccuracyFloorOpenBoxTimberRawBareErrorBudgetTerm): string {
  switch (term.termId) {
    case "source_absent_structural_mobility_simplification":
      return "The open-box timber mobility model is source-absent and simplified until raw-bare mobility or modal-density evidence exists.";
    case "bare_impact_curve_model_gap":
      return "The bare walking-surface impact curve is formula-owned rather than measured for this exact raw carrier.";
    case "open_box_geometry_simplification":
      return "Depth, rib spacing, and void fraction are carried through a bounded open-box geometry simplification.";
    case "input_precision":
      return "Runtime inputs use effective carrier defaults derived from the raw-bare owner contract, not a measured shop drawing.";
    case "bare_carrier_holdout_absence":
      return "No source-owned same-stack raw-bare open-box lab holdout has been admitted yet.";
  }
}

function metricEstimate(
  metricId: BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget["metricId"],
  metrics: BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics
): number | null {
  switch (metricId) {
    case "Rw":
      return metrics.Rw;
    case "C":
      return metrics.C;
    case "Ctr":
      return metrics.Ctr;
    case "Ln,w":
      return metrics.LnW;
    case "CI":
      return metrics.CI;
    case "CI,50-2500":
      return metrics.CI50_2500;
    case "Ln,w+CI":
      return metrics.LnWPlusCI;
  }
}

function toImpactErrorBudget(
  budget: BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget,
  estimate: number
): ImpactErrorBudget {
  const terms: ImpactErrorBudgetTerm[] = budget.terms.map((term) => ({
    db: term.db,
    origin: term.basis,
    reason: budgetTermReason(term),
    termId: term.termId,
    tightenRequires: [...term.tightenRequires]
  }));

  return {
    estimate,
    max: round1(estimate + budget.totalBudgetDb),
    metricId: budget.metricId,
    min: round1(estimate - budget.totalBudgetDb),
    notMeasuredEvidence: true,
    origin: "source_absent_formula_error_budget",
    terms,
    toleranceDb: budget.totalBudgetDb,
    totalBudgetDb: budget.totalBudgetDb
  };
}

function buildRuntimeBudgets(input: {
  budgets: readonly BroadAccuracyFloorOpenBoxTimberRawBareErrorBudget[];
  metrics: BroadAccuracyFloorOpenBoxTimberRawBareDesignMetrics;
}): ImpactErrorBudget[] {
  return input.budgets.flatMap((budget) => {
    const estimate = metricEstimate(budget.metricId, input.metrics);

    return typeof estimate === "number" ? [toImpactErrorBudget(budget, estimate)] : [];
  });
}

export function deriveOpenBoxTimberRawBareEstimate(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => RUNTIME_TARGET_OUTPUTS.has(output))) {
    return null;
  }

  const carrier = detectRawBareOpenBoxTimberCarrier(input.layers);
  if (!carrier) {
    return null;
  }

  const formulaInputs = inferRawBareFormulaInputs(carrier.carrierDepthMm);
  const evaluation = evaluateBroadAccuracyFloorOpenBoxTimberRawBareFormulaCorridor({
    carrierDepthMm: carrier.carrierDepthMm,
    finishAbsenceState: "explicit_none",
    lossFactor: formulaInputs.lossFactor,
    lowerTreatmentState: "explicit_bare_underside",
    packageTransferState: "no_complete_package",
    panelPlateSchedule: "ribbed_box_plates",
    ribOrWebSpacingMm: 600,
    roleTopologyState: carrier.roleTopologyState,
    sourceOrPhysicsBasis: "source_absent_physics_model",
    supportFamily: "open_box_timber",
    supportForm: "open_box_timber_slab",
    surfaceMassKgM2: formulaInputs.surfaceMassKgM2,
    targetOutputs: withFieldAnchorOutputs(requestedOutputs),
    voidFraction: formulaInputs.voidFraction
  });

  if (
    evaluation.corridorStatus !== "formula_corridor_defined_runtime_gate_required" ||
    evaluation.affectedFormulaOutputs.length === 0 ||
    typeof evaluation.designMetrics.Rw !== "number" ||
    typeof evaluation.designMetrics.C !== "number" ||
    typeof evaluation.designMetrics.Ctr !== "number" ||
    typeof evaluation.designMetrics.CI !== "number" ||
    typeof evaluation.designMetrics.CI50_2500 !== "number" ||
    typeof evaluation.designMetrics.LnW !== "number" ||
    typeof evaluation.designMetrics.LnWPlusCI !== "number"
  ) {
    return null;
  }

  const contextRows = sourceRowsByIds(RAW_BARE_CONTEXT_SOURCE_IDS);
  if (contextRows.length === 0) {
    return null;
  }

  const impactValues = {
    CI: evaluation.designMetrics.CI,
    CI50_2500: evaluation.designMetrics.CI50_2500,
    LnW: evaluation.designMetrics.LnW,
    LnWPlusCI: evaluation.designMetrics.LnWPlusCI
  };
  const impact = ImpactCalculationSchema.parse({
    ...impactValues,
    availableOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      metrics: evaluation.designMetrics
    }),
    estimateCandidateIds: ["source_absent_raw_bare_open_box_formula"],
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS),
    notes: [
      `Raw-bare open-box timber formula corridor selected ${carrier.carrierDepthMm} mm total carrier depth.`,
      `Effective source-absent inputs: ${formulaInputs.surfaceMassKgM2} kg/m2 surface mass, ${formulaInputs.voidFraction} void fraction, ${formulaInputs.lossFactor} loss factor, 600 mm rib spacing.`,
      "Context source rows are same-family TUAS open-box packet rows only; they are not measured evidence for the raw-bare carrier.",
      "This is an element-lab source-absent formula corridor, not a finished package-transfer row, field/building adapter, or ASTM/IIC bridge."
    ],
    scope: "family_estimate"
  });

  return {
    airborneRatings: {
      C: evaluation.designMetrics.C,
      Ctr: evaluation.designMetrics.Ctr,
      Rw: evaluation.designMetrics.Rw,
      RwCtr: round1(evaluation.designMetrics.Rw + evaluation.designMetrics.C),
      RwCtrSemantic: "rw_plus_c"
    },
    fitPercent: 100,
    impact,
    kind: "family_archetype",
    notes: [
      "Raw-bare open-box timber runtime selected the source-absent bare-carrier formula corridor.",
      `Carrier depth ${carrier.carrierDepthMm} mm; topology ${carrier.roleTopologyState.replaceAll("_", " ")}.`,
      "Exact source rows and complete finished package-transfer routes still outrank this source-absent formula."
    ],
    sourceSystems: contextRows,
    structuralFamily: "open-box timber raw-bare"
  };
}
