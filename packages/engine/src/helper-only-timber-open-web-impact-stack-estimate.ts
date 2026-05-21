import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import {
  ImpactCalculationSchema,
  type ExactFloorSystem,
  type FloorRole,
  type FloorSystemEstimateResult,
  type ImpactErrorBudget,
  type ImpactErrorBudgetTerm,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import {
  evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor,
  type BroadAccuracyFloorHelperOnlyBudgetTerm,
  type BroadAccuracyFloorHelperOnlyDesignMetrics,
  type BroadAccuracyFloorHelperOnlyErrorBudget,
  type BroadAccuracyFloorHelperOnlyMetricId,
  type BroadAccuracyFloorHelperOnlySupportFamily
} from "./broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor";
import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { round1 } from "./math";

export const HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";

type RuntimeSupportFamily = Exclude<BroadAccuracyFloorHelperOnlySupportFamily, "unknown">;

type SupportProfile = {
  readonly baseStructureMaterialId: "open_box_timber_slab" | "open_web_steel_floor" | "timber_frame_floor" | "timber_joist_floor";
  readonly candidateId: string;
  readonly carrierDepthMm: number;
  readonly carrierSpacingMm: number;
  readonly contextSourceIds: readonly string[];
  readonly sourceLabel: string;
  readonly structuralFamily: string;
  readonly supportFamily: RuntimeSupportFamily;
  readonly supportForm: "joist_or_purlin" | "open_box" | "open_web_or_rolled";
  readonly supportLossFactor: number;
  readonly surfaceMassKgM2: number;
};

type CavitySupportProfile = {
  readonly boardAttachmentClass: "direct_fixed" | "resilient_hanger" | "resilient_rail";
  readonly connectionSpacingMm: number;
  readonly shortCircuitRiskClass: "high" | "low" | "medium";
  readonly suspensionSupportClass: "direct_fixed" | "resilient_hanger" | "resilient_rail";
  readonly resilientDynamicStiffnessMNPerM3: number;
};

type DetectedHelperOnlyStack = {
  readonly absorberFlowResistivityClass: "high" | "low" | "medium";
  readonly ceilingCavityDepthMm: number;
  readonly ceilingFillDensityKgM3: number;
  readonly ceilingFillMaterialId: string;
  readonly ceilingFillThicknessMm: number;
  readonly lowerCeilingBoardLayerCount: number;
  readonly lowerCeilingBoardMaterialId: string;
  readonly lowerCeilingBoardSurfaceMassKgM2: number;
  readonly lowerCeilingBoardThicknessMm: number;
  readonly roleTopologyState: "safe_split_equivalent" | "source_equivalent";
  readonly support: SupportProfile;
  readonly supportProfile: CavitySupportProfile;
};

const RUNTIME_TARGET_OUTPUTS = new Set<RequestedOutputId>([
  "Rw",
  "C",
  "Ctr",
  "Ln,w",
  "CI",
  "CI,50-2500",
  "Ln,w+CI"
]);

const UPPER_PACKAGE_ROLES = new Set<FloorRole>([
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);

const OPEN_BOX_CONTEXT_SOURCE_IDS = [
  "tuas_r2a_open_box_timber_measured_2026",
  "tuas_r3a_open_box_timber_measured_2026",
  "tuas_r5b_open_box_timber_measured_2026"
] as const;

const TIMBER_JOIST_CONTEXT_SOURCE_IDS = [
  "knauf_ct2g_timber_r25_lab_2026",
  "dataholz_gdrnxa01a_timber_frame_lab_2026"
] as const;

const OPEN_WEB_CONTEXT_SOURCE_IDS = [
  "ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026",
  "ubiq_fl26_open_web_steel_300_19mm_bare_exact_lab_2026",
  "ubiq_fl28_open_web_steel_300_19mm_bare_exact_lab_2026"
] as const;

function uniqueRequestedOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function layersForRole(layers: readonly ResolvedLayer[], role: FloorRole): readonly ResolvedLayer[] {
  return layers.filter((layer) => layer.floorRole === role);
}

function totalThickness(layers: readonly ResolvedLayer[]): number {
  return round1(layers.reduce((sum, layer) => sum + layer.thicknessMm, 0));
}

function allSameMaterial(layers: readonly ResolvedLayer[]): string | null {
  const materialId = layers[0]?.material.id;

  if (!materialId || layers.some((layer) => layer.material.id !== materialId)) {
    return null;
  }

  return materialId;
}

function hasUpperPackage(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) => layer.floorRole && UPPER_PACKAGE_ROLES.has(layer.floorRole));
}

function inferSupportProfile(baseLayers: readonly ResolvedLayer[]): SupportProfile | null {
  const baseStructureMaterialId = allSameMaterial(baseLayers);

  if (!baseStructureMaterialId) {
    return null;
  }

  const carrierDepthMm = totalThickness(baseLayers);

  if (baseStructureMaterialId === "open_box_timber_slab") {
    return {
      baseStructureMaterialId,
      candidateId: "source_absent_open_box_timber_helper_only_formula",
      carrierDepthMm,
      carrierSpacingMm: 600,
      contextSourceIds: OPEN_BOX_CONTEXT_SOURCE_IDS,
      sourceLabel: "Source-absent open-box timber helper-only formula",
      structuralFamily: "open-box timber helper-only lower treatment",
      supportFamily: "open_box_timber",
      supportForm: "open_box",
      supportLossFactor: 0.018,
      surfaceMassKgM2: round1(82 + (carrierDepthMm - 370) * 0.08)
    };
  }

  if (baseStructureMaterialId === "timber_joist_floor" || baseStructureMaterialId === "timber_frame_floor") {
    return {
      baseStructureMaterialId,
      candidateId: "source_absent_timber_joist_helper_only_formula",
      carrierDepthMm,
      carrierSpacingMm: 400,
      contextSourceIds: TIMBER_JOIST_CONTEXT_SOURCE_IDS,
      sourceLabel: "Source-absent timber-joist helper-only formula",
      structuralFamily: "timber joist helper-only lower treatment",
      supportFamily: "timber_joists",
      supportForm: "joist_or_purlin",
      supportLossFactor: 0.015,
      surfaceMassKgM2: round1(45 + (carrierDepthMm - 250) * 0.08)
    };
  }

  if (baseStructureMaterialId === "open_web_steel_floor") {
    return {
      baseStructureMaterialId,
      candidateId: "source_absent_open_web_helper_only_formula",
      carrierDepthMm,
      carrierSpacingMm: 600,
      contextSourceIds: OPEN_WEB_CONTEXT_SOURCE_IDS,
      sourceLabel: "Source-absent open-web steel helper-only formula",
      structuralFamily: "open-web steel helper-only lower treatment",
      supportFamily: "lightweight_steel_open_web",
      supportForm: "open_web_or_rolled",
      supportLossFactor: 0.015,
      surfaceMassKgM2: round1(28 + Math.max(0, carrierDepthMm - 300) * 0.08)
    };
  }

  return null;
}

function inferCavitySupportProfile(cavity: ResolvedLayer): CavitySupportProfile | null {
  switch (cavity.material.id) {
    case "ubiq_resilient_ceiling":
      return {
        boardAttachmentClass: "resilient_hanger",
        connectionSpacingMm: 600,
        resilientDynamicStiffnessMNPerM3: 12,
        shortCircuitRiskClass: "low",
        suspensionSupportClass: "resilient_hanger"
      };
    case "resilient_channel":
    case "resilient_stud_ceiling":
      return {
        boardAttachmentClass: "resilient_rail",
        connectionSpacingMm: 600,
        resilientDynamicStiffnessMNPerM3: 18,
        shortCircuitRiskClass: "low",
        suspensionSupportClass: "resilient_rail"
      };
    case "furring_channel":
      return {
        boardAttachmentClass: "direct_fixed",
        connectionSpacingMm: 450,
        resilientDynamicStiffnessMNPerM3: 80,
        shortCircuitRiskClass: "medium",
        suspensionSupportClass: "direct_fixed"
      };
    default:
      return null;
  }
}

function inferCavityDepthMm(input: {
  cavity: ResolvedLayer;
  fillThicknessMm: number;
  supportFamily: RuntimeSupportFamily;
}): number {
  if (input.cavity.material.id === "ubiq_resilient_ceiling") {
    return input.cavity.thicknessMm;
  }

  if (input.supportFamily === "timber_joists") {
    return Math.max(input.cavity.thicknessMm, input.fillThicknessMm, 120);
  }

  return Math.max(input.cavity.thicknessMm, input.fillThicknessMm);
}

function inferBoardSurfaceMass(input: {
  boardLayers: readonly ResolvedLayer[];
  supportFamily: RuntimeSupportFamily;
}): number {
  const materialId = input.boardLayers[0]?.material.id;
  const thicknessMm = totalThickness(input.boardLayers);

  if (materialId === "firestop_board" || materialId === "impactstop_board") {
    return round1(thicknessMm);
  }

  if (materialId === "gypsum_board" || materialId === "acoustic_gypsum_board" || materialId === "nrc_type_c_gypsum_board") {
    const canonicalMass = input.supportFamily === "timber_joists" ? 16.5 : 17.6;
    return round1(canonicalMass * (thicknessMm / 26));
  }

  return round1(input.boardLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));
}

function inferFillDensity(input: {
  fillLayers: readonly ResolvedLayer[];
  supportFamily: RuntimeSupportFamily;
}): number {
  const materialId = input.fillLayers[0]?.material.id;

  if (materialId === "high_density_rockwool") {
    return 90;
  }

  if (materialId === "rockwool") {
    return input.supportFamily === "lightweight_steel_open_web" ? 45 : 35;
  }

  return round1(
    input.fillLayers.reduce((sum, layer) => sum + layer.material.densityKgM3, 0) /
      Math.max(1, input.fillLayers.length)
  );
}

function inferAbsorberFlowResistivityClass(fillMaterialId: string): "high" | "low" | "medium" {
  if (fillMaterialId === "high_density_rockwool") {
    return "high";
  }

  return fillMaterialId === "rockwool" ? "medium" : "low";
}

function detectHelperOnlyStack(layers: readonly ResolvedLayer[]): DetectedHelperOnlyStack | null {
  if (layers.length === 0 || layers.some((layer) => !layer.floorRole) || hasUpperPackage(layers)) {
    return null;
  }

  const baseLayers = layersForRole(layers, "base_structure");
  const boardLayers = layersForRole(layers, "ceiling_board");
  const fillLayers = layersForRole(layers, "ceiling_fill");
  const cavityLayers = layersForRole(layers, "ceiling_cavity");

  if (baseLayers.length === 0 || boardLayers.length === 0 || fillLayers.length === 0 || cavityLayers.length !== 1) {
    return null;
  }

  const support = inferSupportProfile(baseLayers);
  const lowerCeilingBoardMaterialId = allSameMaterial(boardLayers);
  const ceilingFillMaterialId = allSameMaterial(fillLayers);
  const supportProfile = inferCavitySupportProfile(cavityLayers[0] as ResolvedLayer);

  if (!support || !lowerCeilingBoardMaterialId || !ceilingFillMaterialId || !supportProfile) {
    return null;
  }

  const ceilingFillThicknessMm = totalThickness(fillLayers);

  return {
    absorberFlowResistivityClass: inferAbsorberFlowResistivityClass(ceilingFillMaterialId),
    ceilingCavityDepthMm: inferCavityDepthMm({
      cavity: cavityLayers[0] as ResolvedLayer,
      fillThicknessMm: ceilingFillThicknessMm,
      supportFamily: support.supportFamily
    }),
    ceilingFillDensityKgM3: inferFillDensity({
      fillLayers,
      supportFamily: support.supportFamily
    }),
    ceilingFillMaterialId,
    ceilingFillThicknessMm,
    lowerCeilingBoardLayerCount: boardLayers.length,
    lowerCeilingBoardMaterialId,
    lowerCeilingBoardSurfaceMassKgM2: inferBoardSurfaceMass({
      boardLayers,
      supportFamily: support.supportFamily
    }),
    lowerCeilingBoardThicknessMm: round1(totalThickness(boardLayers) / boardLayers.length),
    roleTopologyState: baseLayers.length > 1 ? "safe_split_equivalent" : "source_equivalent",
    support,
    supportProfile
  };
}

function sourceRowsByIds(ids: readonly string[]): ExactFloorSystem[] {
  return ids.flatMap((id) => {
    const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

    return row ? [row] : [];
  });
}

function budgetTermReason(term: BroadAccuracyFloorHelperOnlyBudgetTerm): string {
  switch (term.termId) {
    case "branch_mobility_simplification":
      return "The helper-only branch mobility term is inferred from support family, depth, spacing, mass, and loss factor until branch response holdouts exist.";
    case "ceiling_schedule_model_gap":
      return "The lower board schedule is formula-owned from layer count, thickness, material, and surface mass rather than measured as this exact helper-only stack.";
    case "helper_only_holdout_absence":
      return "No same-branch helper-only lower-treatment lab holdout has been promoted as measured evidence yet.";
    case "input_precision":
      return "Runtime uses bounded owner defaults for spacing, loss factor, dynamic stiffness, and short-circuit risk where the UI has no explicit field yet.";
    case "iso717_adapter_uncertainty":
      return "The single-number ISO 717 adapter terms are derived from the helper-only source-absent curve model.";
    case "lower_treatment_delta_curve_model_gap":
      return "The ceiling board, cavity, absorber, and suspension delta curve is formula-owned until helper-only lower-treatment frequency data exists.";
  }
}

function metricEstimate(
  metricId: BroadAccuracyFloorHelperOnlyMetricId,
  metrics: BroadAccuracyFloorHelperOnlyDesignMetrics
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
  budget: BroadAccuracyFloorHelperOnlyErrorBudget,
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
  budgets: readonly BroadAccuracyFloorHelperOnlyErrorBudget[];
  metrics: BroadAccuracyFloorHelperOnlyDesignMetrics;
}): ImpactErrorBudget[] {
  return input.budgets.flatMap((budget) => {
    const estimate = metricEstimate(budget.metricId, input.metrics);

    return typeof estimate === "number" ? [toImpactErrorBudget(budget, estimate)] : [];
  });
}

export function deriveHelperOnlyTimberOpenWebImpactStackEstimate(input: {
  explicitFloorRoleStack?: boolean;
  layers: readonly ResolvedLayer[];
  targetOutputs?: readonly RequestedOutputId[];
}): FloorSystemEstimateResult | null {
  if (!input.explicitFloorRoleStack) {
    return null;
  }

  const requestedOutputs = input.targetOutputs && input.targetOutputs.length > 0
    ? input.targetOutputs
    : (["Rw", "Ln,w"] as const);

  if (!requestedOutputs.some((output) => RUNTIME_TARGET_OUTPUTS.has(output))) {
    return null;
  }

  const detected = detectHelperOnlyStack(input.layers);
  if (!detected) {
    return null;
  }

  const evaluation = evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
    absorberFlowResistivityClass: detected.absorberFlowResistivityClass,
    baseStructureMaterialId: detected.support.baseStructureMaterialId,
    boardAttachmentClass: detected.supportProfile.boardAttachmentClass,
    carrierDepthMm: detected.support.carrierDepthMm,
    carrierSpacingMm: detected.support.carrierSpacingMm,
    ceilingCavityDepthMm: detected.ceilingCavityDepthMm,
    ceilingFillDensityKgM3: detected.ceilingFillDensityKgM3,
    ceilingFillMaterialId: detected.ceilingFillMaterialId,
    ceilingFillThicknessMm: detected.ceilingFillThicknessMm,
    connectionSpacingMm: detected.supportProfile.connectionSpacingMm,
    lowerCeilingBoardLayerCount: detected.lowerCeilingBoardLayerCount,
    lowerCeilingBoardMaterialId: detected.lowerCeilingBoardMaterialId,
    lowerCeilingBoardSurfaceMassKgM2: detected.lowerCeilingBoardSurfaceMassKgM2,
    lowerCeilingBoardThicknessMm: detected.lowerCeilingBoardThicknessMm,
    resilientDynamicStiffnessMNPerM3: detected.supportProfile.resilientDynamicStiffnessMNPerM3,
    roleTopologyState: detected.roleTopologyState,
    shortCircuitRiskClass: detected.supportProfile.shortCircuitRiskClass,
    sourceOrPhysicsBasis: "source_absent_physics_model",
    supportFamily: detected.support.supportFamily,
    supportForm: detected.support.supportForm,
    supportLossFactor: detected.support.supportLossFactor,
    surfaceMassKgM2: detected.support.surfaceMassKgM2,
    suspensionSupportClass: detected.supportProfile.suspensionSupportClass,
    targetOutputs: uniqueRequestedOutputs(requestedOutputs),
    upperPackageState: "explicit_absent"
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

  const rows = sourceRowsByIds(detected.support.contextSourceIds);
  if (rows.length === 0) {
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
    basis: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    confidence: getImpactConfidenceForBasis(HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS),
    errorBudgets: buildRuntimeBudgets({
      budgets: evaluation.toleranceBudgets,
      metrics: evaluation.designMetrics
    }),
    estimateCandidateIds: [detected.support.candidateId],
    labOrField: "lab",
    metricBasis: buildUniformImpactMetricBasis(impactValues, HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS),
    notes: [
      "Helper-only timber/open-web impact stack runtime selected the source-absent formula corridor.",
      `Detected ${detected.support.structuralFamily} at ${detected.support.carrierDepthMm} mm carrier depth with ${detected.lowerCeilingBoardLayerCount} lower board layer(s), ${detected.ceilingFillThicknessMm} mm absorber, and ${detected.ceilingCavityDepthMm} mm owned cavity depth.`,
      `Owner defaults: ${detected.support.carrierSpacingMm} mm carrier spacing, ${detected.support.surfaceMassKgM2} kg/m2 carrier mass, ${detected.supportProfile.suspensionSupportClass.replaceAll("_", " ")} support, ${detected.supportProfile.resilientDynamicStiffnessMNPerM3} MN/m3 dynamic stiffness, ${detected.supportProfile.shortCircuitRiskClass} short-circuit risk.`,
      "This is an element-lab source-absent helper-only formula; exact/package/raw-bare lanes, field/building adapters, and ASTM/IIC aliases remain outside this runtime corridor."
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
      "Helper-only timber/open-web runtime selected the lower-treatment source-absent formula corridor.",
      `Topology ${detected.roleTopologyState.replaceAll("_", " ")}; complete package, raw-bare, exact, direct-fixed, and supported-band lanes still outrank this formula.`,
      "Runtime budgets are not measured evidence and stay attached to every promoted helper-only metric."
    ],
    sourceSystems: rows,
    structuralFamily: detected.support.structuralFamily
  };
}
