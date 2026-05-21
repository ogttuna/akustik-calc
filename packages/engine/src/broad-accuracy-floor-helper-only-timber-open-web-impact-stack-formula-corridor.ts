import type { RequestedOutputId } from "@dynecho/shared";

import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_runtime_corridor_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "floor helper-only timber/open-web impact stack runtime corridor";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_source_absent_formula_corridor";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_LANDED_GATE =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTION_STATUS =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_owner_landed_no_runtime_selected_formula_corridor";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_helper_only_timber_open_web_impact_stack_formula_corridor_plan";

export const BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-helper-only-timber-open-web-impact-stack-formula-corridor-contract.test.ts";

export type BroadAccuracyFloorHelperOnlyMetricId =
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "Ln,w"
  | "Ln,w+CI"
  | "Rw";

export type BroadAccuracyFloorHelperOnlySupportFamily =
  | "lightweight_steel_open_web"
  | "open_box_timber"
  | "timber_joists"
  | "unknown";

export type BroadAccuracyFloorHelperOnlySupportForm =
  | "joist_or_purlin"
  | "open_box"
  | "open_web_or_rolled"
  | "other_floor_carrier";

export type BroadAccuracyFloorHelperOnlyUpperPackageState =
  | "explicit_absent"
  | "partial_or_ambiguous"
  | "present";

export type BroadAccuracyFloorHelperOnlyRoleTopologyState =
  | "ambiguous_duplicate_or_overlap"
  | "safe_split_equivalent"
  | "source_equivalent"
  | "unsafe_reorder";

export type BroadAccuracyFloorHelperOnlySourceOrPhysicsBasis =
  | "missing"
  | "source_absent_physics_model"
  | "source_owned_helper_packet";

export type BroadAccuracyFloorHelperOnlyRequestedBasis =
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type BroadAccuracyFloorHelperOnlyStatus =
  | "blocked_basis_alias"
  | "blocked_exact_or_package_precedence"
  | "blocked_hostile_topology"
  | "blocked_missing_owner_fields"
  | "blocked_missing_source_or_physics_basis"
  | "blocked_nonfinite_geometry"
  | "blocked_upper_package_present"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type BroadAccuracyFloorHelperOnlyFormulaTermId =
  | "branch_specific_bare_carrier_reference"
  | "ceiling_board_mass_gain"
  | "cavity_absorber_gain"
  | "exact_package_and_lane_precedence"
  | "hostile_topology_and_safe_reorder_policy"
  | "iso717_helper_only_metric_adapters"
  | "package_absence_and_helper_only_scope"
  | "source_absent_budget_decomposition"
  | "suspension_and_short_circuit_adjustment";

export type BroadAccuracyFloorHelperOnlyBudgetTermId =
  | "branch_mobility_simplification"
  | "ceiling_schedule_model_gap"
  | "helper_only_holdout_absence"
  | "input_precision"
  | "iso717_adapter_uncertainty"
  | "lower_treatment_delta_curve_model_gap";

export type BroadAccuracyFloorHelperOnlyFormulaTerm = {
  readonly branch: "all" | BroadAccuracyFloorHelperOnlySupportFamily;
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: BroadAccuracyFloorHelperOnlyFormulaTermId;
};

export type BroadAccuracyFloorHelperOnlyBudgetTerm = {
  readonly basis: "source_absent_helper_only_timber_open_web_formula_design_budget";
  readonly db: number;
  readonly termId: BroadAccuracyFloorHelperOnlyBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type BroadAccuracyFloorHelperOnlyErrorBudget = {
  readonly metricId: BroadAccuracyFloorHelperOnlyMetricId;
  readonly notMeasuredEvidence: true;
  readonly supportFamily: BroadAccuracyFloorHelperOnlySupportFamily;
  readonly terms: readonly BroadAccuracyFloorHelperOnlyBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type BroadAccuracyFloorHelperOnlyDesignMetrics = {
  readonly C: number | null;
  readonly CI: number | null;
  readonly CI50_2500: number | null;
  readonly Ctr: number | null;
  readonly LnW: number | null;
  readonly LnWPlusCI: number | null;
  readonly Rw: number | null;
};

export type BroadAccuracyFloorHelperOnlyFormulaComponents = {
  readonly airborne: readonly string[];
  readonly impact: readonly string[];
};

export type BroadAccuracyFloorHelperOnlyFormulaEvaluationInput = {
  readonly absorberFlowResistivityClass?: "high" | "low" | "medium";
  readonly baseStructureMaterialId?: string;
  readonly boardAttachmentClass?: "direct_fixed" | "resilient_hanger" | "resilient_rail";
  readonly carrierDepthMm?: number;
  readonly carrierSpacingMm?: number;
  readonly ceilingCavityDepthMm?: number;
  readonly ceilingFillDensityKgM3?: number;
  readonly ceilingFillMaterialId?: string;
  readonly ceilingFillThicknessMm?: number;
  readonly connectionSpacingMm?: number;
  readonly exactSourceId?: string;
  readonly lowerCeilingBoardLayerCount?: number;
  readonly lowerCeilingBoardMaterialId?: string;
  readonly lowerCeilingBoardSurfaceMassKgM2?: number;
  readonly lowerCeilingBoardThicknessMm?: number;
  readonly requestedBasis?: BroadAccuracyFloorHelperOnlyRequestedBasis;
  readonly resilientDynamicStiffnessMNPerM3?: number;
  readonly roleTopologyState: BroadAccuracyFloorHelperOnlyRoleTopologyState;
  readonly shortCircuitRiskClass?: "high" | "low" | "medium";
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorHelperOnlySourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorHelperOnlySupportFamily;
  readonly supportForm: BroadAccuracyFloorHelperOnlySupportForm;
  readonly supportLossFactor?: number;
  readonly surfaceMassKgM2?: number;
  readonly suspensionSupportClass?: "direct_fixed" | "resilient_hanger" | "resilient_rail";
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly upperPackageState: BroadAccuracyFloorHelperOnlyUpperPackageState;
};

export type BroadAccuracyFloorHelperOnlyFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly corridorStatus: BroadAccuracyFloorHelperOnlyStatus;
  readonly designMetrics: BroadAccuracyFloorHelperOnlyDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaComponents: BroadAccuracyFloorHelperOnlyFormulaComponents;
  readonly formulaTerms: readonly BroadAccuracyFloorHelperOnlyFormulaTerm[];
  readonly missingOwnerFields: readonly string[];
  readonly notMeasuredEvidence: true;
  readonly referenceBasis: string | null;
  readonly requestedBasis: BroadAccuracyFloorHelperOnlyRequestedBasis;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: BroadAccuracyFloorHelperOnlyDesignMetrics;
  readonly sourceOrPhysicsBasis: BroadAccuracyFloorHelperOnlySourceOrPhysicsBasis;
  readonly supportFamily: BroadAccuracyFloorHelperOnlySupportFamily;
  readonly supportForm: BroadAccuracyFloorHelperOnlySupportForm;
  readonly toleranceBudgets: readonly BroadAccuracyFloorHelperOnlyErrorBudget[];
};

export type BroadAccuracyFloorHelperOnlyFormulaCorridorContract = {
  readonly additionalSourceRowsRequiredForRuntimeSelection: false;
  readonly basisAliasBlocked: {
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldImpact: true;
    readonly labAirborneFieldAliases: true;
  };
  readonly candidateFormulaRows: readonly BroadAccuracyFloorHelperOnlyFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly BroadAccuracyFloorHelperOnlyFormulaTerm[];
  readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousOwner: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly toleranceBudgets: readonly BroadAccuracyFloorHelperOnlyErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]);

const NULL_DESIGN_METRICS = {
  C: null,
  CI: null,
  CI50_2500: null,
  Ctr: null,
  LnW: null,
  LnWPlusCI: null,
  Rw: null
} as const satisfies BroadAccuracyFloorHelperOnlyDesignMetrics;

const FORMULA_TERMS = [
  {
    branch: "all",
    description: "Choose the branch-specific bare carrier reference before adding helper-only lower treatment gains.",
    owner: "helperOnlyBranchReferenceOwner",
    requiredInputs: [
      "supportFamily",
      "supportForm",
      "baseStructureMaterialId",
      "carrierDepthMm",
      "carrierSpacingMm",
      "surfaceMassKgM2",
      "supportLossFactor"
    ],
    runtimeOwnedInGate: false,
    termId: "branch_specific_bare_carrier_reference"
  },
  {
    branch: "all",
    description: "Convert lower board material, count, thickness, mass, and attachment into a bounded airborne/impact term.",
    owner: "helperOnlyCeilingBoardMassOwner",
    requiredInputs: [
      "lowerCeilingBoardMaterialId",
      "lowerCeilingBoardLayerCount",
      "lowerCeilingBoardThicknessMm",
      "lowerCeilingBoardSurfaceMassKgM2",
      "boardAttachmentClass"
    ],
    runtimeOwnedInGate: false,
    termId: "ceiling_board_mass_gain"
  },
  {
    branch: "all",
    description: "Own cavity depth and porous absorber terms separately from board mass and support class.",
    owner: "helperOnlyCavityAbsorberOwner",
    requiredInputs: [
      "ceilingCavityDepthMm",
      "ceilingFillMaterialId",
      "ceilingFillThicknessMm",
      "ceilingFillDensityKgM3",
      "absorberFlowResistivityClass"
    ],
    runtimeOwnedInGate: false,
    termId: "cavity_absorber_gain"
  },
  {
    branch: "all",
    description: "Apply resilient support benefit and short-circuit penalties without borrowing direct-fixed package rows.",
    owner: "helperOnlySuspensionSupportOwner",
    requiredInputs: [
      "suspensionSupportClass",
      "resilientDynamicStiffnessMNPerM3",
      "connectionSpacingMm",
      "shortCircuitRiskClass"
    ],
    runtimeOwnedInGate: false,
    termId: "suspension_and_short_circuit_adjustment"
  },
  {
    branch: "all",
    description: "Require explicit absence of floor coverings, resilient upper layers, fills, floating screeds, and INEX/firestop packages.",
    owner: "helperOnlyPackageAbsenceOwner",
    requiredInputs: ["upperPackageState=explicit_absent", "floorCoveringAbsence", "floatingScreedAbsence", "inexDeckAbsence"],
    runtimeOwnedInGate: false,
    termId: "package_absence_and_helper_only_scope"
  },
  {
    branch: "all",
    description: "Keep exact UBIQ, direct-fixed, supported-band, raw-bare, package-transfer, and EPS/screed lanes ahead of helper-only formulas.",
    owner: "helperOnlyExactAndLanePrecedenceOwner",
    requiredInputs: ["exactSourceId", "laneBasis", "sameMetricBasis", "sameSupportFamily"],
    runtimeOwnedInGate: false,
    termId: "exact_package_and_lane_precedence"
  },
  {
    branch: "all",
    description: "Keep helper-only formula outputs on element-lab ISO bases; field, building, and ASTM/IIC need separate owners.",
    owner: "helperOnlyIso717MetricAdapterOwner",
    requiredInputs: ["requestedBasis=element_lab", "iso717AirborneAdapter", "iso717ImpactAdapter"],
    runtimeOwnedInGate: false,
    termId: "iso717_helper_only_metric_adapters"
  },
  {
    branch: "all",
    description: "Fail closed for roleless, duplicate, split, partial-package, and unsafe reorder stacks until topology is owned.",
    owner: "helperOnlyHostileTopologyOwner",
    requiredInputs: ["roleTopologyState", "duplicateCarrierGuard", "safeReorderGuard", "missingBoardGuard"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_and_safe_reorder_policy"
  },
  {
    branch: "all",
    description: "Attach not-measured budgets until helper-only branch holdouts and frequency-band curves exist.",
    owner: "helperOnlySourceAbsentBudgetOwner",
    requiredInputs: [
      "RwToleranceBudgetOwner",
      "LnWToleranceBudgetOwner",
      "CIBudgetOwner",
      "inputPrecisionBudgetOwner",
      "topologySimplificationBudgetOwner"
    ],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  }
] as const satisfies readonly BroadAccuracyFloorHelperOnlyFormulaTerm[];

type BranchProfile = {
  readonly baseC: number;
  readonly baseCI: number;
  readonly baseCI50: number;
  readonly baseCtr: number;
  readonly baseLnW: number;
  readonly baseRw: number;
  readonly cavityReferenceMm: number;
  readonly carrierDepthReferenceMm: number;
  readonly carrierSpacingReferenceMm: number;
  readonly form: BroadAccuracyFloorHelperOnlySupportForm;
  readonly materialIds: readonly string[];
  readonly referenceBasis: string;
  readonly supportFamily: BroadAccuracyFloorHelperOnlySupportFamily;
  readonly supportMassReferenceKgM2: number;
};

const BRANCH_PROFILES: readonly BranchProfile[] = [
  {
    baseC: -1.4,
    baseCI: 1.8,
    baseCI50: 3.1,
    baseCtr: -5.8,
    baseLnW: 88.2,
    baseRw: 42.3,
    cavityReferenceMm: 100,
    carrierDepthReferenceMm: 370,
    carrierSpacingReferenceMm: 600,
    form: "open_box",
    materialIds: ["open_box_timber_slab"],
    referenceBasis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    supportFamily: "open_box_timber",
    supportMassReferenceKgM2: 82
  },
  {
    baseC: -2.4,
    baseCI: 1.5,
    baseCI50: 4.2,
    baseCtr: -8.2,
    baseLnW: 92,
    baseRw: 35.5,
    cavityReferenceMm: 100,
    carrierDepthReferenceMm: 250,
    carrierSpacingReferenceMm: 400,
    form: "joist_or_purlin",
    materialIds: ["timber_frame_floor", "timber_joist_floor"],
    referenceBasis: "source_absent_timber_joist_bare_carrier_reference_placeholder",
    supportFamily: "timber_joists",
    supportMassReferenceKgM2: 45
  },
  {
    baseC: -2.2,
    baseCI: 1.8,
    baseCI50: 5.2,
    baseCtr: -7.8,
    baseLnW: 96,
    baseRw: 32,
    cavityReferenceMm: 145,
    carrierDepthReferenceMm: 300,
    carrierSpacingReferenceMm: 600,
    form: "open_web_or_rolled",
    materialIds: ["open_web_steel_floor"],
    referenceBasis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    supportFamily: "lightweight_steel_open_web",
    supportMassReferenceKgM2: 28
  }
];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function log10Safe(value: number): number {
  return Math.log10(Math.max(value, 0.000001));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function splitOutputs(targetOutputs: readonly RequestedOutputId[] | undefined): {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
} {
  const requestedOutputs = targetOutputs && targetOutputs.length > 0 ? targetOutputs : (["Rw", "Ln,w"] as const);

  return {
    affectedFormulaOutputs: requestedOutputs.filter((output) => FORMULA_OUTPUTS.has(output)),
    blockedFormulaOutputs: requestedOutputs.filter((output) => !FORMULA_OUTPUTS.has(output))
  };
}

function getBranchProfile(
  input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput
): BranchProfile | null {
  const profile = BRANCH_PROFILES.find((candidate) => candidate.supportFamily === input.supportFamily);

  if (!profile) {
    return null;
  }

  if (profile.form !== input.supportForm) {
    return null;
  }

  if (!input.baseStructureMaterialId || !profile.materialIds.includes(input.baseStructureMaterialId)) {
    return null;
  }

  return profile;
}

function missingOwnerFields(input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput): readonly string[] {
  const fields = [
    "carrierDepthMm",
    "carrierSpacingMm",
    "surfaceMassKgM2",
    "supportLossFactor",
    "lowerCeilingBoardMaterialId",
    "lowerCeilingBoardLayerCount",
    "lowerCeilingBoardThicknessMm",
    "lowerCeilingBoardSurfaceMassKgM2",
    "boardAttachmentClass",
    "ceilingCavityDepthMm",
    "ceilingFillMaterialId",
    "ceilingFillThicknessMm",
    "ceilingFillDensityKgM3",
    "absorberFlowResistivityClass",
    "suspensionSupportClass",
    "resilientDynamicStiffnessMNPerM3",
    "connectionSpacingMm",
    "shortCircuitRiskClass"
  ] as const;

  return fields.filter((field) => {
    const value = input[field];

    if (typeof value === "number") {
      return !Number.isFinite(value);
    }

    return value === undefined || value === "";
  });
}

function geometryOutOfRange(input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput): boolean {
  return (
    (input.carrierDepthMm ?? 0) <= 0 ||
    (input.carrierDepthMm ?? 0) > 650 ||
    (input.carrierSpacingMm ?? 0) < 250 ||
    (input.carrierSpacingMm ?? 0) > 1200 ||
    (input.surfaceMassKgM2 ?? 0) <= 0 ||
    (input.supportLossFactor ?? 0) < 0.001 ||
    (input.supportLossFactor ?? 0) > 0.2 ||
    (input.lowerCeilingBoardLayerCount ?? 0) < 1 ||
    (input.lowerCeilingBoardLayerCount ?? 0) > 4 ||
    (input.lowerCeilingBoardThicknessMm ?? 0) <= 0 ||
    (input.lowerCeilingBoardSurfaceMassKgM2 ?? 0) <= 0 ||
    (input.ceilingCavityDepthMm ?? 0) < 15 ||
    (input.ceilingCavityDepthMm ?? 0) > 450 ||
    (input.ceilingFillThicknessMm ?? 0) < 0 ||
    (input.ceilingFillThicknessMm ?? 0) > 350 ||
    (input.ceilingFillDensityKgM3 ?? 0) < 5 ||
    (input.ceilingFillDensityKgM3 ?? 0) > 180 ||
    (input.resilientDynamicStiffnessMNPerM3 ?? 0) <= 0 ||
    (input.resilientDynamicStiffnessMNPerM3 ?? 0) > 300 ||
    (input.connectionSpacingMm ?? 0) < 200 ||
    (input.connectionSpacingMm ?? 0) > 1600
  );
}

function calculateDesignMetrics(
  input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput,
  profile: BranchProfile
): {
  readonly components: BroadAccuracyFloorHelperOnlyFormulaComponents;
  readonly designMetrics: BroadAccuracyFloorHelperOnlyDesignMetrics;
} {
  const boardMass = input.lowerCeilingBoardSurfaceMassKgM2 as number;
  const boardLayers = input.lowerCeilingBoardLayerCount as number;
  const cavityDepth = input.ceilingCavityDepthMm as number;
  const fillThickness = input.ceilingFillThicknessMm as number;
  const fillDensity = input.ceilingFillDensityKgM3 as number;
  const supportMass = input.surfaceMassKgM2 as number;
  const supportLossFactor = input.supportLossFactor as number;
  const dynamicStiffness = input.resilientDynamicStiffnessMNPerM3 as number;
  const connectionSpacing = input.connectionSpacingMm as number;

  const boardMassGain = clamp(3.5 * log10Safe(boardMass / 8) + (boardLayers - 1) * 1.6, 1, 8);
  const boardImpactReduction = clamp(5.5 * log10Safe(boardMass / 8) + (boardLayers - 1) * 3.2, 2, 15);
  const cavityGain = clamp(3.5 * log10Safe(cavityDepth / profile.cavityReferenceMm + 0.7), 0.5, 5);
  const absorberFillRatio = fillThickness / Math.max(1, cavityDepth);
  const absorberGain = clamp((absorberFillRatio * 3.5) + (fillDensity >= 30 ? 1.2 : 0), 0, 5);
  const supportGain =
    input.suspensionSupportClass === "direct_fixed"
      ? 0.8
      : input.suspensionSupportClass === "resilient_rail"
        ? 4.5
        : 6.2;
  const dynamicStiffnessPenalty = clamp(log10Safe(dynamicStiffness / 15) * 4, -2, 5);
  const shortCircuitPenalty =
    input.shortCircuitRiskClass === "high" ? 4 : input.shortCircuitRiskClass === "medium" ? 2 : 0.5;
  const spacingPenalty = clamp(log10Safe(profile.carrierSpacingReferenceMm / connectionSpacing) * -3, -1.5, 2.5);
  const depthAdjustment = clamp(3 * log10Safe((input.carrierDepthMm as number) / profile.carrierDepthReferenceMm), -3, 3);
  const spacingAdjustment = clamp(2 * log10Safe(profile.carrierSpacingReferenceMm / (input.carrierSpacingMm as number)), -2, 2);
  const massAdjustment = clamp(6 * log10Safe(supportMass / profile.supportMassReferenceKgM2), -5, 5);
  const lossAdjustment = clamp(3 * log10Safe(supportLossFactor / 0.015), -2, 2);
  const topologyPenalty = input.roleTopologyState === "safe_split_equivalent" ? 0.5 : 0;

  const airborneRw = round1(
    clamp(
      profile.baseRw +
        boardMassGain +
        cavityGain +
        absorberGain +
        supportGain +
        depthAdjustment +
        spacingAdjustment +
        massAdjustment +
        lossAdjustment -
        shortCircuitPenalty -
        topologyPenalty,
      25,
      75
    )
  );
  const impactLnW = round1(
    clamp(
      profile.baseLnW -
        boardImpactReduction -
        (absorberGain * 2.2) -
        (supportGain * 3.1) -
        depthAdjustment -
        (massAdjustment * 0.7) +
        dynamicStiffnessPenalty +
        shortCircuitPenalty +
        spacingPenalty +
        topologyPenalty,
      35,
      105
    )
  );
  const ci = round1(clamp(profile.baseCI - (absorberGain * 0.18) + (shortCircuitPenalty * 0.12), -3, 6));
  const ci50 = round1(clamp(profile.baseCI50 - (absorberGain * 0.2) + (dynamicStiffnessPenalty * 0.4), -3, 8));

  return {
    components: {
      airborne: [
        `bareCarrierRwReference=${profile.baseRw}`,
        `lowerBoardMassGain=${round1(boardMassGain)}`,
        `cavityAbsorberGain=${round1(cavityGain + absorberGain)}`,
        `resilientSupportGain=${round1(supportGain)}`,
        `carrierAdjustment=${round1(depthAdjustment + spacingAdjustment + massAdjustment + lossAdjustment)}`,
        `shortCircuitPenalty=${round1(shortCircuitPenalty)}`,
        `topologySimplificationPenalty=${round1(topologyPenalty)}`
      ],
      impact: [
        `bareCarrierLnWReference=${profile.baseLnW}`,
        `lowerTreatmentDeltaLnW=${round1(boardImpactReduction + absorberGain * 2.2 + supportGain * 3.1)}`,
        `branchMobilityPenalty=${round1(dynamicStiffnessPenalty + spacingPenalty)}`,
        `shortCircuitPenalty=${round1(shortCircuitPenalty)}`,
        `topologySimplificationPenalty=${round1(topologyPenalty)}`
      ]
    },
    designMetrics: {
      C: round1(clamp(profile.baseC + (supportGain * 0.08) - (shortCircuitPenalty * 0.05), -6, 1)),
      CI: ci,
      CI50_2500: ci50,
      Ctr: round1(clamp(profile.baseCtr - (topologyPenalty * 0.5) - (shortCircuitPenalty * 0.12), -14, -3)),
      LnW: impactLnW,
      LnWPlusCI: round1(impactLnW + ci),
      Rw: airborneRw
    }
  };
}

function buildBudget(
  supportFamily: BroadAccuracyFloorHelperOnlySupportFamily,
  metricId: BroadAccuracyFloorHelperOnlyMetricId,
  totalBudgetDb: number
): BroadAccuracyFloorHelperOnlyErrorBudget {
  return {
    metricId,
    notMeasuredEvidence: true,
    supportFamily,
    terms: [
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: 1,
        termId: "input_precision",
        tightenRequires: ["explicit_measured_layer_mass_spacing_depth_and_dynamic_stiffness"]
      },
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: 1.5,
        termId: "ceiling_schedule_model_gap",
        tightenRequires: ["source_owned_lower_board_schedule_holdout"]
      },
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: 1.5,
        termId: "lower_treatment_delta_curve_model_gap",
        tightenRequires: ["helper_only_lower_treatment_frequency_delta_curve"]
      },
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: 1.25,
        termId: "branch_mobility_simplification",
        tightenRequires: ["branch_specific_mobility_or_frequency_response_packet"]
      },
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: 0.75,
        termId: "iso717_adapter_uncertainty",
        tightenRequires: ["helper_only_frequency_band_curve_holdout"]
      },
      {
        basis: "source_absent_helper_only_timber_open_web_formula_design_budget",
        db: Math.max(0, totalBudgetDb - 6),
        termId: "helper_only_holdout_absence",
        tightenRequires: ["source_owned_helper_only_same_branch_lab_holdout"]
      }
    ],
    totalBudgetDb
  };
}

function buildBudgets(
  supportFamily: BroadAccuracyFloorHelperOnlySupportFamily
): readonly BroadAccuracyFloorHelperOnlyErrorBudget[] {
  const lnBudget =
    supportFamily === "timber_joists" ? 11.5 : supportFamily === "open_box_timber" ? 10.5 : 10;
  const rwBudget =
    supportFamily === "timber_joists" ? 9.5 : supportFamily === "open_box_timber" ? 8.5 : 9;

  return [
    buildBudget(supportFamily, "Rw", rwBudget),
    buildBudget(supportFamily, "C", 3),
    buildBudget(supportFamily, "Ctr", 4.5),
    buildBudget(supportFamily, "Ln,w", lnBudget),
    buildBudget(supportFamily, "CI", 4),
    buildBudget(supportFamily, "CI,50-2500", 5),
    buildBudget(supportFamily, "Ln,w+CI", lnBudget + 0.5)
  ];
}

function buildEvaluation(
  input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput,
  corridorStatus: BroadAccuracyFloorHelperOnlyStatus,
  profile: BranchProfile | null,
  missingFields: readonly string[],
  designMetrics: BroadAccuracyFloorHelperOnlyDesignMetrics = NULL_DESIGN_METRICS,
  components: BroadAccuracyFloorHelperOnlyFormulaComponents = { airborne: [], impact: [] }
): BroadAccuracyFloorHelperOnlyFormulaEvaluation {
  const requestedBasis = input.requestedBasis ?? "element_lab";
  const split = splitOutputs(input.targetOutputs);

  return {
    affectedFormulaOutputs: corridorStatus === "blocked_basis_alias" ? [] : split.affectedFormulaOutputs,
    basisId: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs:
      corridorStatus === "blocked_basis_alias" ? [...split.affectedFormulaOutputs, ...split.blockedFormulaOutputs] : split.blockedFormulaOutputs,
    corridorStatus,
    designMetrics,
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: input.exactSourceId ?? null,
    formulaComponents: components,
    formulaTerms: FORMULA_TERMS,
    missingOwnerFields: missingFields,
    notMeasuredEvidence: true,
    referenceBasis: profile?.referenceBasis ?? null,
    requestedBasis,
    runtimePromotionAllowedInGate: false,
    runtimeValues: NULL_DESIGN_METRICS,
    sourceOrPhysicsBasis: input.sourceOrPhysicsBasis,
    supportFamily: input.supportFamily,
    supportForm: input.supportForm,
    toleranceBudgets: buildBudgets(input.supportFamily)
  };
}

export function evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor(
  input: BroadAccuracyFloorHelperOnlyFormulaEvaluationInput
): BroadAccuracyFloorHelperOnlyFormulaEvaluation {
  const requestedBasis = input.requestedBasis ?? "element_lab";

  if (requestedBasis !== "element_lab") {
    return buildEvaluation(input, "blocked_basis_alias", getBranchProfile(input), []);
  }

  if (input.exactSourceId) {
    return buildEvaluation(input, "blocked_exact_or_package_precedence", getBranchProfile(input), []);
  }

  if (input.upperPackageState !== "explicit_absent") {
    return buildEvaluation(input, "blocked_upper_package_present", getBranchProfile(input), []);
  }

  const profile = getBranchProfile(input);
  if (!profile) {
    return buildEvaluation(input, "blocked_wrong_support_family", null, []);
  }

  if (input.sourceOrPhysicsBasis === "missing") {
    return buildEvaluation(input, "blocked_missing_source_or_physics_basis", profile, []);
  }

  if (
    input.roleTopologyState === "ambiguous_duplicate_or_overlap" ||
    input.roleTopologyState === "unsafe_reorder"
  ) {
    return buildEvaluation(input, "blocked_hostile_topology", profile, []);
  }

  const missingFields = missingOwnerFields(input);
  if (missingFields.length > 0) {
    return buildEvaluation(input, "blocked_missing_owner_fields", profile, missingFields);
  }

  if (geometryOutOfRange(input)) {
    return buildEvaluation(input, "blocked_nonfinite_geometry", profile, []);
  }

  const metrics = calculateDesignMetrics(input, profile);

  return buildEvaluation(
    input,
    "formula_corridor_defined_runtime_gate_required",
    profile,
    [],
    metrics.designMetrics,
    metrics.components
  );
}

const OPEN_BOX_HELPER_ONLY_CANDIDATE = {
  absorberFlowResistivityClass: "medium",
  baseStructureMaterialId: "open_box_timber_slab",
  boardAttachmentClass: "resilient_rail",
  carrierDepthMm: 370,
  carrierSpacingMm: 600,
  ceilingCavityDepthMm: 100,
  ceilingFillDensityKgM3: 35,
  ceilingFillMaterialId: "rockwool",
  ceilingFillThicknessMm: 100,
  connectionSpacingMm: 600,
  lowerCeilingBoardLayerCount: 2,
  lowerCeilingBoardMaterialId: "gypsum_board",
  lowerCeilingBoardSurfaceMassKgM2: 17.6,
  lowerCeilingBoardThicknessMm: 13,
  resilientDynamicStiffnessMNPerM3: 18,
  roleTopologyState: "source_equivalent",
  shortCircuitRiskClass: "low",
  sourceOrPhysicsBasis: "source_absent_physics_model",
  supportFamily: "open_box_timber",
  supportForm: "open_box",
  supportLossFactor: 0.018,
  surfaceMassKgM2: 82,
  suspensionSupportClass: "resilient_rail",
  targetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
  upperPackageState: "explicit_absent"
} as const satisfies BroadAccuracyFloorHelperOnlyFormulaEvaluationInput;

const TIMBER_JOIST_HELPER_ONLY_CANDIDATE = {
  ...OPEN_BOX_HELPER_ONLY_CANDIDATE,
  baseStructureMaterialId: "timber_joist_floor",
  carrierDepthMm: 250,
  carrierSpacingMm: 400,
  ceilingCavityDepthMm: 120,
  ceilingFillThicknessMm: 100,
  lowerCeilingBoardSurfaceMassKgM2: 16.5,
  roleTopologyState: "safe_split_equivalent",
  supportFamily: "timber_joists",
  supportForm: "joist_or_purlin",
  supportLossFactor: 0.015,
  surfaceMassKgM2: 45
} as const satisfies BroadAccuracyFloorHelperOnlyFormulaEvaluationInput;

const OPEN_WEB_HELPER_ONLY_CANDIDATE = {
  ...OPEN_BOX_HELPER_ONLY_CANDIDATE,
  baseStructureMaterialId: "open_web_steel_floor",
  boardAttachmentClass: "resilient_hanger",
  carrierDepthMm: 250,
  carrierSpacingMm: 600,
  ceilingCavityDepthMm: 65,
  ceilingFillDensityKgM3: 45,
  ceilingFillMaterialId: "rockwool",
  ceilingFillThicknessMm: 145,
  connectionSpacingMm: 600,
  lowerCeilingBoardMaterialId: "firestop_board",
  lowerCeilingBoardSurfaceMassKgM2: 32,
  lowerCeilingBoardThicknessMm: 16,
  resilientDynamicStiffnessMNPerM3: 12,
  roleTopologyState: "source_equivalent",
  supportFamily: "lightweight_steel_open_web",
  supportForm: "open_web_or_rolled",
  supportLossFactor: 0.015,
  surfaceMassKgM2: 28,
  suspensionSupportClass: "resilient_hanger"
} as const satisfies BroadAccuracyFloorHelperOnlyFormulaEvaluationInput;

export function buildBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridorContract():
  BroadAccuracyFloorHelperOnlyFormulaCorridorContract {
  return {
    additionalSourceRowsRequiredForRuntimeSelection: false,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingPrediction: true,
      fieldImpact: true,
      labAirborneFieldAliases: true
    },
    candidateFormulaRows: [
      evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor(OPEN_BOX_HELPER_ONLY_CANDIDATE),
      evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor(TIMBER_JOIST_HELPER_ONLY_CANDIDATE),
      evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor(OPEN_WEB_HELPER_ONLY_CANDIDATE),
      evaluateBroadAccuracyFloorHelperOnlyTimberOpenWebImpactStackFormulaCorridor({
        ...OPEN_WEB_HELPER_ONLY_CANDIDATE,
        requestedBasis: "field",
        targetOutputs: ["R'w", "DnT,w", "L'n,w", "IIC"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "airborneRwDesign = bareCarrierRwReference + lowerBoardMassGain + cavityAbsorberGain + resilientSupportGain - shortCircuitPenalty - topologySimplificationPenalty",
      "impactLnWDesign = bareCarrierLnWReference - lowerTreatmentDeltaLnW + shortCircuitPenalty + missingPrecisionPenalty + branchMobilityPenalty",
      "formula payloads are source-absent design records only until the runtime corridor lands"
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousOwner: {
      landedGate: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_OWNER_SELECTION_STATUS
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_helper_only_formula_basis_not_generic_published_family_or_screening_basis",
      "runtime_must_require_complete_carrier_lower_board_cavity_absorber_suspension_and_package_absence_owners",
      "exact_direct_fixed_supported_band_raw_bare_package_transfer_and_eps_screed_lanes_must_precede_helper_only_formula",
      "formula_surface_must_show_not_measured_budgets_for_each_metric",
      "field_building_and_astm_outputs_must_remain_unpromoted"
    ],
    selectedNextAction:
      BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile:
      BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel:
      BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_FLOOR_HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    toleranceBudgets: [
      ...buildBudgets("open_box_timber"),
      ...buildBudgets("timber_joists"),
      ...buildBudgets("lightweight_steel_open_web")
    ]
  };
}
