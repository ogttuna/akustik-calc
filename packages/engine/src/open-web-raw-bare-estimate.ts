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
  evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor,
  type BroadAccuracyFloorOpenWebRawBareDesignMetrics,
  type BroadAccuracyFloorOpenWebRawBareErrorBudget,
  type BroadAccuracyFloorOpenWebRawBareErrorBudgetTerm
} from "./broad-accuracy-floor-open-web-raw-bare-formula-corridor";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { clamp, round1 } from "./math";

export const OPEN_WEB_RAW_BARE_FORMULA_BASIS =
  "broad_accuracy_floor_open_web_raw_bare_source_absent_formula_corridor";

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
  "ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026",
  "ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026",
  "ubiq_fl28_open_web_steel_300_19mm_bare_exact_lab_2026"
] as const;

type RawBareOpenWebCarrier = {
  readonly carrierDepthMm: number;
  readonly roleTopologyState: "safe_split_equivalent" | "source_equivalent";
};

type RawBareOpenWebFormulaInputs = {
  readonly bareCarrierSurfaceMassKgM2: number;
  readonly carrierGaugeOrMassKgM2: number;
  readonly carrierSpacingMm: 600;
  readonly chordWidthMm: number;
  readonly lossFactor: number;
  readonly openWebVoidRatio: number;
  readonly webDepthMm: number;
};

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

function isOpenWebSteelBaseLayer(layer: ResolvedLayer): boolean {
  return layer.material.id === "open_web_steel_floor" &&
    layer.floorRole === "base_structure";
}

function detectRawBareOpenWebCarrier(layers: readonly ResolvedLayer[]): RawBareOpenWebCarrier | null {
  if (layers.length === 0 || layers.some((layer) => !isOpenWebSteelBaseLayer(layer))) {
    return null;
  }

  const carrierDepthMm = round1(layers.reduce((sum, layer) => sum + layer.thicknessMm, 0));

  if (carrierDepthMm < 200 || carrierDepthMm > 400) {
    return null;
  }

  return {
    carrierDepthMm,
    roleTopologyState: layers.length > 1 ? "safe_split_equivalent" : "source_equivalent"
  };
}

function inferRawBareOpenWebFormulaInputs(carrierDepthMm: number): RawBareOpenWebFormulaInputs {
  const deepPosition = clamp((carrierDepthMm - 300) / 100, 0, 1);
  const shallowPosition = clamp((300 - carrierDepthMm) / 100, 0, 1);

  return {
    bareCarrierSurfaceMassKgM2: round1(28 + (14 * deepPosition) - (8 * shallowPosition)),
    carrierGaugeOrMassKgM2: round1(14 + (4 * deepPosition) - (4 * shallowPosition)),
    carrierSpacingMm: 600,
    chordWidthMm: round1(50 + (10 * deepPosition) - (10 * shallowPosition)),
    lossFactor: Math.round((0.015 + (0.005 * deepPosition) - (0.003 * shallowPosition)) * 1000) / 1000,
    openWebVoidRatio: Math.round((0.72 - (0.06 * deepPosition) + (0.06 * shallowPosition)) * 1000) / 1000,
    webDepthMm: round1(240 + (90 * deepPosition) - (80 * shallowPosition))
  };
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function budgetTermReason(term: BroadAccuracyFloorOpenWebRawBareErrorBudgetTerm): string {
  switch (term.termId) {
    case "bare_steel_walking_surface_model_gap":
      return "The bare steel walking-surface impact curve is formula-owned rather than measured for this exact raw carrier.";
    case "carrier_only_holdout_absence":
      return "No source-owned same-stack raw-bare open-web lab holdout has been admitted yet.";
    case "input_precision":
      return "Runtime inputs use bounded carrier defaults inferred from the bare open-web owner contract, not a measured shop drawing.";
    case "iso717_adapter_uncertainty":
      return "Single-number ISO 717 adapter terms are derived from the source-absent curve model until raw open-web band holdouts exist.";
    case "package_exclusion_uncertainty":
      return "The runtime route explicitly excludes INEX/firestop/finish packages; package-coupling uncertainty remains budgeted.";
    case "structural_mobility_simplification":
      return "Open-web structural mobility is simplified from depth, mass, chord, void ratio, and loss factor until response data exists.";
  }
}

function metricEstimate(
  metricId: BroadAccuracyFloorOpenWebRawBareErrorBudget["metricId"],
  metrics: BroadAccuracyFloorOpenWebRawBareDesignMetrics
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
  budget: BroadAccuracyFloorOpenWebRawBareErrorBudget,
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
  budgets: readonly BroadAccuracyFloorOpenWebRawBareErrorBudget[];
  metrics: BroadAccuracyFloorOpenWebRawBareDesignMetrics;
}): ImpactErrorBudget[] {
  return input.budgets.flatMap((budget) => {
    const estimate = metricEstimate(budget.metricId, input.metrics);

    return typeof estimate === "number" ? [toImpactErrorBudget(budget, estimate)] : [];
  });
}

export function deriveOpenWebRawBareEstimate(input: {
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => RUNTIME_TARGET_OUTPUTS.has(output))) {
    return null;
  }

  const carrier = detectRawBareOpenWebCarrier(input.layers);
  if (!carrier) {
    return null;
  }

  const formulaInputs = inferRawBareOpenWebFormulaInputs(carrier.carrierDepthMm);
  const evaluation = evaluateBroadAccuracyFloorOpenWebRawBareFormulaCorridor({
    ...formulaInputs,
    bareReferenceSurfaceState: "explicit_bare_steel_walking_surface",
    carrierDepthMm: carrier.carrierDepthMm,
    lowerTreatmentState: "explicit_none",
    packageEvidenceState: "no_package",
    roleTopologyState: carrier.roleTopologyState,
    sourceOrPhysicsBasis: "source_absent_physics_model",
    supportFamily: "lightweight_steel",
    supportForm: "open_web_or_rolled",
    supportMaterial: "open_web_steel_floor",
    targetOutputs: withFieldAnchorOutputs(requestedOutputs)
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
    basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    confidence: getImpactConfidenceForBasis(OPEN_WEB_RAW_BARE_FORMULA_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      metrics: evaluation.designMetrics
    }),
    estimateCandidateIds: ["source_absent_raw_bare_open_web_formula"],
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, OPEN_WEB_RAW_BARE_FORMULA_BASIS),
    notes: [
      `Raw-bare open-web formula corridor selected ${carrier.carrierDepthMm} mm total carrier depth.`,
      `Effective source-absent inputs: ${formulaInputs.bareCarrierSurfaceMassKgM2} kg/m2 carrier mass, ${formulaInputs.carrierGaugeOrMassKgM2} kg/m2 gauge/mass, ${formulaInputs.webDepthMm} mm web depth, ${formulaInputs.chordWidthMm} mm chord, ${formulaInputs.openWebVoidRatio} void ratio, ${formulaInputs.lossFactor} loss factor, 600 mm spacing.`,
      "Context UBIQ rows are INEX/firestop package rows only; they are not measured evidence for the raw-bare steel carrier.",
      "This is an element-lab source-absent formula corridor, not a package-transfer row, field/building adapter, or ASTM/IIC bridge."
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
      "Raw-bare open-web runtime selected the source-absent bare-carrier formula corridor.",
      `Carrier depth ${carrier.carrierDepthMm} mm; topology ${carrier.roleTopologyState.replaceAll("_", " ")}.`,
      "Exact source rows and complete INEX/firestop/open-web package routes still outrank this source-absent formula."
    ],
    sourceSystems: contextRows,
    structuralFamily: "open-web steel raw-bare"
  };
}
