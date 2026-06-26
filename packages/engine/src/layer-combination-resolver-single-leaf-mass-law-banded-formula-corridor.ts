import type { RequestedOutputId } from "@dynecho/shared";

import {
  buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-solver-owner";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { clamp, log10Safe, round1 } from "./math";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE =
  "layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS =
  "layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_single_leaf_mass_law_banded_runtime_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "layer combination resolver single-leaf mass-law banded runtime corridor";

export {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const ONE_THIRD_OCTAVE_BANDS_HZ = [
  50,
  63,
  80,
  100,
  125,
  160,
  200,
  250,
  315,
  400,
  500,
  630,
  800,
  1000,
  1250,
  1600,
  2000,
  2500,
  3150,
  4000,
  5000
] as const;

export type LayerCombinationResolverSingleLeafMassLawFormulaMetricId = "C" | "Ctr" | "Rw" | "STC";

export type LayerCombinationResolverSingleLeafMassLawFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_cavity_or_framed_topology"
  | "blocked_exact_source_precedence"
  | "blocked_floor_impact_metric"
  | "blocked_hostile_topology"
  | "blocked_mass_timber_or_clt"
  | "blocked_missing_owner_fields"
  | "blocked_missing_source_or_physics_basis"
  | "blocked_nonfinite_geometry"
  | "blocked_stc_alias_promotion"
  | "blocked_wrong_route_scope"
  | "blocked_wrong_single_leaf_family"
  | "formula_corridor_defined_runtime_gate_required";

export type LayerCombinationResolverSingleLeafMassLawRoute = "floor" | "wall";

export type LayerCombinationResolverSingleLeafMassLawRequestedBasis =
  | "astm_e413_stc"
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type LayerCombinationResolverSingleLeafMassLawMaterialFamily =
  | "aac_or_aircrete"
  | "clt_mass_timber"
  | "concrete_or_masonry"
  | "gypsum_board"
  | "metal_sheet"
  | "unknown";

export type LayerCombinationResolverSingleLeafMassLawDynamicFamily =
  | "laminated_single_leaf"
  | "mass_timber"
  | "masonry_nonhomogeneous"
  | "rigid_massive_wall"
  | "single_leaf_panel"
  | "unknown";

export type LayerCombinationResolverSingleLeafMassLawLeafGrouping =
  | "framed_or_cavity"
  | "laminated_single_leaf"
  | "single_leaf"
  | "unknown";

export type LayerCombinationResolverSingleLeafMassLawTopologyState =
  | "ambiguous_duplicate_or_overlap"
  | "safe_laminated_split_equivalent"
  | "source_equivalent"
  | "unsafe_reorder";

export type LayerCombinationResolverSingleLeafMassLawSourceOrPhysicsBasis =
  | "exact_source_available"
  | "missing"
  | "source_absent_physics_model";

export type LayerCombinationResolverSingleLeafMassLawStcPolicy =
  | "astm_e413_requested"
  | "existing_display_compatibility"
  | "rw_alias_requested";

export type LayerCombinationResolverSingleLeafMassLawFormulaTermId =
  | "exact_source_precedence_and_holdouts"
  | "field_building_and_astm_boundary"
  | "floor_airborne_impact_boundary"
  | "hostile_topology_boundary"
  | "iso717_airborne_rating_adapter"
  | "one_third_octave_tl_curve_owner"
  | "single_visible_leaf_topology_filter"
  | "source_absent_budget_decomposition"
  | "stc_existing_display_boundary"
  | "stiffness_coincidence_delegate_selection"
  | "surface_mass_input_normalization";

export type LayerCombinationResolverSingleLeafMassLawFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: LayerCombinationResolverSingleLeafMassLawFormulaTermId;
};

export type LayerCombinationResolverSingleLeafMassLawBudgetTermId =
  | "banded_curve_fit_residual"
  | "coincidence_property_defaults"
  | "holdout_absence"
  | "input_mass_precision"
  | "iso717_adapter_uncertainty"
  | "material_family_classification";

export type LayerCombinationResolverSingleLeafMassLawBudgetTerm = {
  readonly basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget";
  readonly db: number;
  readonly termId: LayerCombinationResolverSingleLeafMassLawBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type LayerCombinationResolverSingleLeafMassLawErrorBudget = {
  readonly metricId: LayerCombinationResolverSingleLeafMassLawFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly LayerCombinationResolverSingleLeafMassLawBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type LayerCombinationResolverSingleLeafMassLawDesignMetrics = {
  readonly C: number | null;
  readonly Ctr: number | null;
  readonly Rw: number | null;
  readonly STCCompatibility: number | null;
};

export type LayerCombinationResolverSingleLeafMassLawFormulaComponentBreakdown = {
  readonly bandedCurveResidualDb: number;
  readonly coincidenceAdjustmentDb: number;
  readonly familyInterceptDb: number;
  readonly massLawRwSeedDb: number;
  readonly topologySimplificationPenaltyDb: number;
};

export type LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput = {
  readonly bendingStiffnessClass?: "flexible_board" | "massive_rigid" | "nonhomogeneous_masonry" | "sheet_metal";
  readonly cavityCount?: number;
  readonly criticalFrequencyHz?: number;
  readonly dampingLossFactor?: number;
  readonly densityKgM3?: number;
  readonly dynamicFamily: LayerCombinationResolverSingleLeafMassLawDynamicFamily;
  readonly exactSourceId?: string;
  readonly leafGrouping: LayerCombinationResolverSingleLeafMassLawLeafGrouping;
  readonly materialFamily: LayerCombinationResolverSingleLeafMassLawMaterialFamily;
  readonly porousLayerCount?: number;
  readonly requestedBasis?: LayerCombinationResolverSingleLeafMassLawRequestedBasis;
  readonly route: LayerCombinationResolverSingleLeafMassLawRoute;
  readonly sourceOrPhysicsBasis: LayerCombinationResolverSingleLeafMassLawSourceOrPhysicsBasis;
  readonly stcPolicy?: LayerCombinationResolverSingleLeafMassLawStcPolicy;
  readonly supportLayerCount?: number;
  readonly surfaceMassKgM2?: number;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly thicknessMm?: number;
  readonly topologyState: LayerCombinationResolverSingleLeafMassLawTopologyState;
  readonly visibleLeafCount?: number;
};

export type LayerCombinationResolverSingleLeafMassLawFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly compatibilityOnlyOutputs: readonly RequestedOutputId[];
  readonly componentBreakdown: LayerCombinationResolverSingleLeafMassLawFormulaComponentBreakdown | null;
  readonly corridorStatus: LayerCombinationResolverSingleLeafMassLawFormulaStatus;
  readonly designMetrics: LayerCombinationResolverSingleLeafMassLawDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaTerms: readonly LayerCombinationResolverSingleLeafMassLawFormulaTerm[];
  readonly missingOwnerFields: readonly string[];
  readonly oneThirdOctaveCurve: {
    readonly frequenciesHz: readonly number[];
    readonly transmissionLossDb: readonly number[];
  } | null;
  readonly requestedBasis: LayerCombinationResolverSingleLeafMassLawRequestedBasis;
  readonly route: LayerCombinationResolverSingleLeafMassLawRoute;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly C: null;
    readonly Ctr: null;
    readonly Rw: null;
    readonly STCCompatibility: null;
  };
  readonly sourceOrPhysicsBasis: LayerCombinationResolverSingleLeafMassLawSourceOrPhysicsBasis;
  readonly stcPolicy: LayerCombinationResolverSingleLeafMassLawStcPolicy;
  readonly toleranceBudgets: readonly LayerCombinationResolverSingleLeafMassLawErrorBudget[];
};

export type LayerCombinationResolverSingleLeafMassLawFormulaCorridorContract = {
  readonly basisAliasBlocked: {
    readonly astmE413Stc: true;
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldAirborne: true;
    readonly floorImpact: true;
  };
  readonly candidateFormulaRows: readonly LayerCombinationResolverSingleLeafMassLawFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly LayerCombinationResolverSingleLeafMassLawFormulaTerm[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousSingleLeafOwner: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly toleranceBudgets: readonly LayerCombinationResolverSingleLeafMassLawErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "C", "Ctr"]);
const STC_COMPATIBILITY_OUTPUTS = new Set<RequestedOutputId>(["STC"]);
const IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "CI",
  "CI,50-2500",
  "DeltaLw",
  "HIIC",
  "IIC",
  "ISR",
  "LIIC",
  "LIR",
  "Ln,w",
  "Ln,w+CI",
  "LnT,A",
  "L'nT,50",
  "L'nT,w",
  "L'n,w",
  "NISR"
]);

const FIELD_OR_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w"
]);

const NULL_DESIGN_METRICS = {
  C: null,
  Ctr: null,
  Rw: null,
  STCCompatibility: null
} as const satisfies LayerCombinationResolverSingleLeafMassLawDesignMetrics;

const NULL_RUNTIME_VALUES = {
  C: null,
  Ctr: null,
  Rw: null,
  STCCompatibility: null
} as const;

const FORMULA_TERMS = [
  {
    description: "Admit only true single-visible-leaf direct-airborne wall, floor, or ceiling stacks.",
    owner: "singleLeafVisibleTopologyOwner",
    requiredInputs: [
      "route=wall_floor_or_ceiling",
      "visibleLeafCount=1",
      "cavityCount=0",
      "supportLayerCount=0",
      "porousLayerCount=0",
      "leafGrouping=single_leaf_or_laminated_single_leaf"
    ],
    runtimeOwnedInGate: false,
    termId: "single_visible_leaf_topology_filter"
  },
  {
    description: "Normalize material density, thickness, and aggregate surface mass before any mass-law curve is evaluated.",
    owner: "singleLeafSurfaceMassInputOwner",
    requiredInputs: ["materialFamily", "densityKgM3", "thicknessMm", "surfaceMassKgM2"],
    runtimeOwnedInGate: false,
    termId: "surface_mass_input_normalization"
  },
  {
    description: "Select the Sharp, KS/massive, or masonry-family coincidence delegate from stiffness and damping fields.",
    owner: "singleLeafStiffnessCoincidenceOwner",
    requiredInputs: ["dynamicFamily", "bendingStiffnessClass", "criticalFrequencyHz", "dampingLossFactor"],
    runtimeOwnedInGate: false,
    termId: "stiffness_coincidence_delegate_selection"
  },
  {
    description: "Store the 50-5000 Hz one-third-octave TL curve rather than only a single Rw heuristic.",
    owner: "singleLeafBandedTransmissionLossCurveOwner",
    requiredInputs: ["oneThirdOctaveBandSet", "massLawRegion", "coincidenceDipRegion", "finiteSizeLowFrequencyPolicy"],
    runtimeOwnedInGate: false,
    termId: "one_third_octave_tl_curve_owner"
  },
  {
    description: "Rate Rw, C, and Ctr from the owned element-lab airborne curve on ISO 717-1 only.",
    owner: "singleLeafIso717AirborneAdapterOwner",
    requiredInputs: ["requestedBasis=element_lab", "ISO717-1 referenceContour", "RwAdapter", "CAdapter", "CtrAdapter"],
    runtimeOwnedInGate: false,
    termId: "iso717_airborne_rating_adapter"
  },
  {
    description: "Keep exact same-stack source rows and measured holdouts ahead of source-absent formula payloads.",
    owner: "singleLeafExactSourcePrecedenceOwner",
    requiredInputs: ["exactSourceId", "sameStackMetricBasis", "rightsSafeHoldoutRows", "negativeNearMissRows"],
    runtimeOwnedInGate: false,
    termId: "exact_source_precedence_and_holdouts"
  },
  {
    description: "Publish wide not-measured budgets until residuals exist for each material family and branch.",
    owner: "singleLeafSourceAbsentBudgetOwner",
    requiredInputs: ["RwBudget", "CBudget", "CtrBudget", "inputMassPrecision", "bandedCurveFitResidual"],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  },
  {
    description: "Preserve existing STC display compatibility without promoting a new Rw-to-STC or ASTM E413 alias.",
    owner: "singleLeafStcDisplayBoundaryOwner",
    requiredInputs: ["existingStcOutput", "noRwToStcAliasPromotion", "futureAstmE413CurveOwner"],
    runtimeOwnedInGate: false,
    termId: "stc_existing_display_boundary"
  },
  {
    description: "Block floor impact metrics because Ln,w, CI, DeltaLw, IIC, and AIIC need impact-curve owners.",
    owner: "singleLeafFloorImpactBoundaryOwner",
    requiredInputs: ["impactCurveOwner", "tappingMachineResponse", "ISO717-2 adapter", "ASTM E989 adapter"],
    runtimeOwnedInGate: false,
    termId: "floor_airborne_impact_boundary"
  },
  {
    description: "Reject CLT, framed, cavity, gap, duplicate, and unsafe reorder stacks from the single-leaf mass-law corridor.",
    owner: "singleLeafHostileTopologyBoundaryOwner",
    requiredInputs: ["topologyState", "massTimberExclusion", "gapOrCavityRejection", "unsafeReorderBoundary"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_boundary"
  },
  {
    description: "Block field, building, ASTM, and IIC/AIIC bases until separate adapters own those standards.",
    owner: "singleLeafFieldBuildingAstmBoundaryOwner",
    requiredInputs: ["fieldContextOwner", "buildingPredictionOwner", "ASTM E413 owner", "ASTM E989 owner"],
    runtimeOwnedInGate: false,
    termId: "field_building_and_astm_boundary"
  }
] as const satisfies readonly LayerCombinationResolverSingleLeafMassLawFormulaTerm[];

const TOLERANCE_BUDGETS = [
  buildBudget("Rw", 6),
  buildBudget("C", 2.5),
  buildBudget("Ctr", 4),
  buildBudget("STC", 6)
] as const satisfies readonly LayerCombinationResolverSingleLeafMassLawErrorBudget[];

const FAMILY_PROFILES = {
  laminated_single_leaf: {
    c: -2.1,
    ctr: -6.2,
    familyInterceptDb: 8,
    referenceCriticalFrequencyHz: 2200,
    referenceDampingLossFactor: 0.025
  },
  masonry_nonhomogeneous: {
    c: -1.4,
    ctr: -5.7,
    familyInterceptDb: 6.5,
    referenceCriticalFrequencyHz: 450,
    referenceDampingLossFactor: 0.018
  },
  rigid_massive_wall: {
    c: -1.1,
    ctr: -5.2,
    familyInterceptDb: 4,
    referenceCriticalFrequencyHz: 180,
    referenceDampingLossFactor: 0.015
  },
  single_leaf_panel: {
    c: -1.8,
    ctr: -5.8,
    familyInterceptDb: 11,
    referenceCriticalFrequencyHz: 2800,
    referenceDampingLossFactor: 0.02
  }
} as const;

type SupportedDynamicFamily = keyof typeof FAMILY_PROFILES;

function buildBudget(
  metricId: LayerCombinationResolverSingleLeafMassLawFormulaMetricId,
  totalBudgetDb: number
): LayerCombinationResolverSingleLeafMassLawErrorBudget {
  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: 0.8,
        termId: "input_mass_precision",
        tightenRequires: ["user_supplied_density_surface_mass_and_thickness_or_source_owned_material_properties"]
      },
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: 1.1,
        termId: "coincidence_property_defaults",
        tightenRequires: ["measured_bending_stiffness_critical_frequency_and_loss_factor"]
      },
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: 1,
        termId: "banded_curve_fit_residual",
        tightenRequires: ["one_third_octave_tl_curve_holdout_for_same_material_family"]
      },
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: 0.7,
        termId: "iso717_adapter_uncertainty",
        tightenRequires: ["same_curve_iso717_rating_residuals"]
      },
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: 0.9,
        termId: "material_family_classification",
        tightenRequires: ["material_family_specific_calibrated_delegate"]
      },
      {
        basis: "source_absent_single_leaf_mass_law_banded_formula_design_budget",
        db: Math.max(0, totalBudgetDb - 4.5),
        termId: "holdout_absence",
        tightenRequires: ["rights_safe_exact_or_nearby_single_leaf_holdout_rows"]
      }
    ],
    totalBudgetDb
  };
}

function requestedOutputs(input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput): readonly RequestedOutputId[] {
  return input.targetOutputs && input.targetOutputs.length > 0 ? input.targetOutputs : (["Rw", "C", "Ctr"] as const);
}

function splitOutputs(input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput): {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  blockedFormulaOutputs: readonly RequestedOutputId[];
  compatibilityOnlyOutputs: readonly RequestedOutputId[];
} {
  const outputs = requestedOutputs(input);
  const stcIsCompatibility = (input.stcPolicy ?? "existing_display_compatibility") === "existing_display_compatibility";

  return {
    affectedFormulaOutputs: outputs.filter((output) => FORMULA_OUTPUTS.has(output)),
    blockedFormulaOutputs: outputs.filter(
      (output) => !FORMULA_OUTPUTS.has(output) && (!STC_COMPATIBILITY_OUTPUTS.has(output) || !stcIsCompatibility)
    ),
    compatibilityOnlyOutputs: stcIsCompatibility ? outputs.filter((output) => STC_COMPATIBILITY_OUTPUTS.has(output)) : []
  };
}

function missingOwnerFields(input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput): readonly string[] {
  const fields = [
    "visibleLeafCount",
    "cavityCount",
    "supportLayerCount",
    "porousLayerCount",
    "densityKgM3",
    "thicknessMm",
    "surfaceMassKgM2",
    "criticalFrequencyHz",
    "dampingLossFactor"
  ] as const;

  return fields.filter((field) => !Number.isFinite(input[field]));
}

type RequiredFormulaInputs = Required<
  Pick<
    LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput,
    | "cavityCount"
    | "criticalFrequencyHz"
    | "dampingLossFactor"
    | "densityKgM3"
    | "porousLayerCount"
    | "supportLayerCount"
    | "surfaceMassKgM2"
    | "thicknessMm"
    | "visibleLeafCount"
  >
>;

function getRequiredInputs(
  input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput
): RequiredFormulaInputs | null {
  if (missingOwnerFields(input).length > 0) {
    return null;
  }

  return {
    cavityCount: input.cavityCount as number,
    criticalFrequencyHz: input.criticalFrequencyHz as number,
    dampingLossFactor: input.dampingLossFactor as number,
    densityKgM3: input.densityKgM3 as number,
    porousLayerCount: input.porousLayerCount as number,
    supportLayerCount: input.supportLayerCount as number,
    surfaceMassKgM2: input.surfaceMassKgM2 as number,
    thicknessMm: input.thicknessMm as number,
    visibleLeafCount: input.visibleLeafCount as number
  };
}

function isSupportedDynamicFamily(
  family: LayerCombinationResolverSingleLeafMassLawDynamicFamily
): family is SupportedDynamicFamily {
  return family in FAMILY_PROFILES;
}

function geometryOutOfRange(input: RequiredFormulaInputs): boolean {
  return (
    input.visibleLeafCount !== 1 ||
    input.cavityCount !== 0 ||
    input.supportLayerCount !== 0 ||
    input.porousLayerCount !== 0 ||
    input.thicknessMm < 3 ||
    input.thicknessMm > 450 ||
    input.densityKgM3 < 80 ||
    input.densityKgM3 > 3200 ||
    input.surfaceMassKgM2 < 2 ||
    input.surfaceMassKgM2 > 900 ||
    input.criticalFrequencyHz < 20 ||
    input.criticalFrequencyHz > 8000 ||
    input.dampingLossFactor < 0.001 ||
    input.dampingLossFactor > 0.2
  );
}

function hasImpactTarget(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => IMPACT_OUTPUTS.has(output));
}

function hasFieldOrBuildingTarget(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => FIELD_OR_BUILDING_OUTPUTS.has(output));
}

function calculateDesignPayload(input: {
  dynamicFamily: SupportedDynamicFamily;
  inputs: RequiredFormulaInputs;
}): {
  readonly componentBreakdown: LayerCombinationResolverSingleLeafMassLawFormulaComponentBreakdown;
  readonly curve: LayerCombinationResolverSingleLeafMassLawFormulaEvaluation["oneThirdOctaveCurve"];
  readonly designMetrics: LayerCombinationResolverSingleLeafMassLawDesignMetrics;
} {
  const profile = FAMILY_PROFILES[input.dynamicFamily];
  const massLawRwSeedDb = (20 * log10Safe(input.inputs.surfaceMassKgM2)) + profile.familyInterceptDb;
  const coincidenceAdjustmentDb = clamp(
    (-0.6 * log10Safe(input.inputs.criticalFrequencyHz / profile.referenceCriticalFrequencyHz)) +
      (1.2 * log10Safe(input.inputs.dampingLossFactor / profile.referenceDampingLossFactor)),
    -2,
    2
  );
  const topologySimplificationPenaltyDb =
    input.dynamicFamily === "laminated_single_leaf" ? 0.1 : input.dynamicFamily === "masonry_nonhomogeneous" ? 0.4 : 0;
  const bandedCurveResidualDb = input.dynamicFamily === "rigid_massive_wall" ? 0.2 : 0.4;
  const rw = Math.round(
    clamp(massLawRwSeedDb + coincidenceAdjustmentDb - topologySimplificationPenaltyDb - bandedCurveResidualDb, 18, 78)
  );
  const c = round1(clamp(profile.c + (0.25 * coincidenceAdjustmentDb), -6, 1));
  const ctr = round1(clamp(profile.ctr - topologySimplificationPenaltyDb + (0.15 * coincidenceAdjustmentDb), -14, -2));

  return {
    componentBreakdown: {
      bandedCurveResidualDb,
      coincidenceAdjustmentDb: round1(coincidenceAdjustmentDb),
      familyInterceptDb: profile.familyInterceptDb,
      massLawRwSeedDb: round1(massLawRwSeedDb),
      topologySimplificationPenaltyDb
    },
    curve: buildBandedCurve(input.inputs, input.dynamicFamily, rw),
    designMetrics: {
      C: c,
      Ctr: ctr,
      Rw: rw,
      STCCompatibility: rw
    }
  };
}

function buildBandedCurve(
  inputs: RequiredFormulaInputs,
  dynamicFamily: SupportedDynamicFamily,
  rw: number
): LayerCombinationResolverSingleLeafMassLawFormulaEvaluation["oneThirdOctaveCurve"] {
  const profile = FAMILY_PROFILES[dynamicFamily];
  const values = ONE_THIRD_OCTAVE_BANDS_HZ.map((frequencyHz) => {
    const pureMassLaw = (20 * log10Safe(inputs.surfaceMassKgM2 * frequencyHz)) - 47;
    const finiteSizePenalty = frequencyHz < 125 ? clamp((125 - frequencyHz) / 45, 0, 3) : 0;
    const coincidenceDistance = Math.abs(log10Safe(frequencyHz / inputs.criticalFrequencyHz));
    const coincidenceDip = clamp((0.28 - coincidenceDistance) * 8, 0, 4.5);
    const dampingCredit = clamp(2 * log10Safe(inputs.dampingLossFactor / profile.referenceDampingLossFactor), -1.5, 1.5);
    const normalized = pureMassLaw - finiteSizePenalty - coincidenceDip + dampingCredit;

    return round1(clamp(normalized + (rw - 20 * log10Safe(inputs.surfaceMassKgM2) - profile.familyInterceptDb), 0, 95));
  });

  return {
    frequenciesHz: [...ONE_THIRD_OCTAVE_BANDS_HZ],
    transmissionLossDb: values
  };
}

function makeEvaluation(
  input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput,
  corridorStatus: LayerCombinationResolverSingleLeafMassLawFormulaStatus,
  design: {
    readonly componentBreakdown: LayerCombinationResolverSingleLeafMassLawFormulaComponentBreakdown | null;
    readonly curve: LayerCombinationResolverSingleLeafMassLawFormulaEvaluation["oneThirdOctaveCurve"];
    readonly designMetrics: LayerCombinationResolverSingleLeafMassLawDesignMetrics;
  },
  missingOwnerFieldsForInput: readonly string[]
): LayerCombinationResolverSingleLeafMassLawFormulaEvaluation {
  const split = splitOutputs(input);
  const basisBlocked = corridorStatus === "blocked_basis_alias";
  const outputBlocked =
    basisBlocked || corridorStatus === "blocked_floor_impact_metric" || corridorStatus === "blocked_stc_alias_promotion";

  return {
    affectedFormulaOutputs: outputBlocked ? [] : split.affectedFormulaOutputs,
    basisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    blockedFormulaOutputs: outputBlocked
      ? [...split.affectedFormulaOutputs, ...split.compatibilityOnlyOutputs, ...split.blockedFormulaOutputs]
      : split.blockedFormulaOutputs,
    compatibilityOnlyOutputs: outputBlocked ? [] : split.compatibilityOnlyOutputs,
    componentBreakdown: design.componentBreakdown,
    corridorStatus,
    designMetrics: design.designMetrics,
    exactMeasuredRowsRemainPrecedence: true,
    exactSourceId: input.exactSourceId ?? null,
    formulaTerms: FORMULA_TERMS,
    missingOwnerFields: missingOwnerFieldsForInput,
    oneThirdOctaveCurve: design.curve,
    requestedBasis: input.requestedBasis ?? "element_lab",
    route: input.route,
    runtimePromotionAllowedInGate: false,
    runtimeValues: NULL_RUNTIME_VALUES,
    sourceOrPhysicsBasis: input.sourceOrPhysicsBasis,
    stcPolicy: input.stcPolicy ?? "existing_display_compatibility",
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}

export function evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor(
  input: LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput
): LayerCombinationResolverSingleLeafMassLawFormulaEvaluation {
  const outputs = requestedOutputs(input);
  const requestedBasis = input.requestedBasis ?? "element_lab";
  const stcPolicy = input.stcPolicy ?? "existing_display_compatibility";
  const missing = missingOwnerFields(input);
  const requiredInputs = getRequiredInputs(input);
  const supportedFamily = isSupportedDynamicFamily(input.dynamicFamily);
  const design =
    requiredInputs && supportedFamily && !geometryOutOfRange(requiredInputs)
      ? calculateDesignPayload({ dynamicFamily: input.dynamicFamily, inputs: requiredInputs })
      : { componentBreakdown: null, curve: null, designMetrics: NULL_DESIGN_METRICS };

  if (requestedBasis !== "element_lab" || hasFieldOrBuildingTarget(outputs)) {
    return makeEvaluation(input, "blocked_basis_alias", design, missing);
  }
  if (hasImpactTarget(outputs)) {
    return makeEvaluation(input, "blocked_floor_impact_metric", design, missing);
  }
  if (stcPolicy !== "existing_display_compatibility") {
    return makeEvaluation(input, "blocked_stc_alias_promotion", design, missing);
  }
  if (input.route !== "wall" && input.route !== "floor") {
    return makeEvaluation(input, "blocked_wrong_route_scope", design, missing);
  }
  if (input.exactSourceId || input.sourceOrPhysicsBasis === "exact_source_available") {
    return makeEvaluation(input, "blocked_exact_source_precedence", design, missing);
  }
  if (
    input.leafGrouping === "framed_or_cavity" ||
    (requiredInputs && (requiredInputs.cavityCount > 0 || requiredInputs.supportLayerCount > 0 || requiredInputs.porousLayerCount > 0))
  ) {
    return makeEvaluation(input, "blocked_cavity_or_framed_topology", design, missing);
  }
  if (input.materialFamily === "clt_mass_timber" || input.dynamicFamily === "mass_timber") {
    return makeEvaluation(input, "blocked_mass_timber_or_clt", design, missing);
  }
  if (input.topologyState === "ambiguous_duplicate_or_overlap" || input.topologyState === "unsafe_reorder") {
    return makeEvaluation(input, "blocked_hostile_topology", design, missing);
  }
  if (!supportedFamily) {
    return makeEvaluation(input, "blocked_wrong_single_leaf_family", design, missing);
  }
  if (missing.length > 0) {
    return makeEvaluation(input, "blocked_missing_owner_fields", { componentBreakdown: null, curve: null, designMetrics: NULL_DESIGN_METRICS }, missing);
  }
  if (!requiredInputs || geometryOutOfRange(requiredInputs)) {
    return makeEvaluation(input, "blocked_nonfinite_geometry", { componentBreakdown: null, curve: null, designMetrics: NULL_DESIGN_METRICS }, missing);
  }
  if (input.sourceOrPhysicsBasis === "missing") {
    return makeEvaluation(input, "blocked_missing_source_or_physics_basis", design, missing);
  }

  return makeEvaluation(input, "formula_corridor_defined_runtime_gate_required", design, missing);
}

const GYPSUM_12_5_REFERENCE = {
  bendingStiffnessClass: "flexible_board",
  cavityCount: 0,
  criticalFrequencyHz: 2800,
  dampingLossFactor: 0.02,
  densityKgM3: 800,
  dynamicFamily: "single_leaf_panel",
  leafGrouping: "single_leaf",
  materialFamily: "gypsum_board",
  porousLayerCount: 0,
  route: "wall",
  sourceOrPhysicsBasis: "source_absent_physics_model",
  stcPolicy: "existing_display_compatibility",
  supportLayerCount: 0,
  surfaceMassKgM2: 10,
  targetOutputs: ["Rw", "STC", "C", "Ctr"],
  thicknessMm: 12.5,
  topologyState: "source_equivalent",
  visibleLeafCount: 1
} as const satisfies LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput;

const LAMINATED_GYPSUM_25_REFERENCE = {
  ...GYPSUM_12_5_REFERENCE,
  criticalFrequencyHz: 2200,
  dampingLossFactor: 0.025,
  dynamicFamily: "laminated_single_leaf",
  leafGrouping: "laminated_single_leaf",
  surfaceMassKgM2: 20,
  thicknessMm: 25,
  topologyState: "safe_laminated_split_equivalent"
} as const satisfies LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput;

const CONCRETE_150_REFERENCE = {
  ...GYPSUM_12_5_REFERENCE,
  bendingStiffnessClass: "massive_rigid",
  criticalFrequencyHz: 180,
  dampingLossFactor: 0.015,
  densityKgM3: 2400,
  dynamicFamily: "rigid_massive_wall",
  leafGrouping: "single_leaf",
  materialFamily: "concrete_or_masonry",
  surfaceMassKgM2: 360,
  thicknessMm: 150
} as const satisfies LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput;

const FLOOR_CONCRETE_150_REFERENCE = {
  ...CONCRETE_150_REFERENCE,
  route: "floor",
  targetOutputs: ["Rw", "C", "Ctr"]
} as const satisfies LayerCombinationResolverSingleLeafMassLawFormulaEvaluationInput;

export function buildLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridorContract():
  LayerCombinationResolverSingleLeafMassLawFormulaCorridorContract {
  buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract();

  return {
    basisAliasBlocked: {
      astmE413Stc: true,
      astmIicAiic: true,
      buildingPrediction: true,
      fieldAirborne: true,
      floorImpact: true
    },
    candidateFormulaRows: [
      evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor(GYPSUM_12_5_REFERENCE),
      evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor(LAMINATED_GYPSUM_25_REFERENCE),
      evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor(CONCRETE_150_REFERENCE),
      evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor(FLOOR_CONCRETE_150_REFERENCE),
      evaluateLayerCombinationResolverSingleLeafMassLawBandedFormulaCorridor({
        ...GYPSUM_12_5_REFERENCE,
        requestedBasis: "field",
        targetOutputs: ["R'w", "DnT,w"]
      })
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "element_lab_Rw_uses_surface_mass_plus_family_intercept_plus_coincidence_adjustment",
      "C_and_Ctr_are_iso717_1_spectrum_adapter_terms_from_the_owned_banded_TL_curve",
      "STC_is_existing_display_compatibility_only_not_a_new_Rw_to_STC_alias",
      "floor_direct_airborne_Rw_may_share_the_curve_owner_but_floor_impact_metrics_stay_blocked",
      "runtime_values_remain_null_until_the_selected_runtime_corridor_owns_public_candidate_selection"
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousSingleLeafOwner: {
      landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_the_single_leaf_banded_formula_basis_not_unlabelled_mass_law_screening",
      "runtime_candidate_selection_must_preserve_exact_same_stack_source_precedence",
      "complete_material_density_thickness_surface_mass_stiffness_and_damping_inputs_must_be_finite",
      "formula_surface_must_show_not_measured_budgets_for_Rw_C_Ctr_and_STC_compatibility",
      "field_building_floor_impact_and_astm_outputs_must_remain_unpromoted",
      "hostile_cavity_framed_clt_duplicate_or_unsafe_reorder_topologies_must_fail_closed"
    ],
    selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    toleranceBudgets: TOLERANCE_BUDGETS
  };
}
