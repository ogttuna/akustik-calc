import type { AirborneContext, RequestedOutputId, TransmissionLossCurve } from "@dynecho/shared";

import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import { anchorCurveToMetric } from "./dynamic-airborne-helpers";
import type { GateQDoubleLeafFrameBridgeClass } from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";
import {
  calculateGateRMassAirMassResonanceHz,
  type GateRDoubleLeafFramedBridgePhysicalInputs
} from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-solver-owner";
import { clamp, log10Safe, round1 } from "./math";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE =
  "layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_double_leaf_framed_wall_banded_runtime_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "layer combination resolver double-leaf framed wall banded runtime corridor";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS =
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS;

const ONE_THIRD_OCTAVE_BANDS_HZ = [
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
  4000
] as const;

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaMetricId = "C" | "Ctr" | "Rw" | "STC";

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaStatus =
  | "blocked_basis_alias"
  | "blocked_direct_fixed_bridge"
  | "blocked_exact_source_precedence"
  | "blocked_floor_impact_metric"
  | "blocked_grouped_triple_leaf_or_multicavity"
  | "blocked_hostile_topology"
  | "blocked_missing_owner_fields"
  | "blocked_missing_source_or_physics_basis"
  | "blocked_nonfinite_geometry"
  | "blocked_resilient_side_count"
  | "blocked_stc_alias_promotion"
  | "blocked_wrong_route_scope"
  | "blocked_wrong_support_family"
  | "formula_corridor_defined_runtime_gate_required";

export type LayerCombinationResolverDoubleLeafFramedWallBandedRequestedBasis =
  | "astm_e413_stc"
  | "astm_iic_aiic"
  | "building_prediction"
  | "element_lab"
  | "field";

export type LayerCombinationResolverDoubleLeafFramedWallBandedSourceOrPhysicsBasis =
  | "exact_source_available"
  | "missing"
  | "source_absent_physics_model";

export type LayerCombinationResolverDoubleLeafFramedWallBandedTopologyMode =
  | "double_leaf_framed"
  | "flat_multicavity"
  | "grouped_triple_leaf"
  | "single_leaf"
  | "unknown";

export type LayerCombinationResolverDoubleLeafFramedWallBandedTopologyState =
  | "ambiguous_duplicate_or_overlap"
  | "safe_split_equivalent"
  | "source_equivalent"
  | "unsafe_reorder";

export type LayerCombinationResolverDoubleLeafFramedWallBandedStcPolicy =
  | "astm_e413_requested"
  | "existing_display_compatibility"
  | "rw_alias_requested";

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTermId =
  | "banded_tl_curve_owner"
  | "bridge_coupling_formula_owner"
  | "double_leaf_framed_topology_filter"
  | "exact_source_precedence_and_holdouts"
  | "field_building_floor_impact_and_astm_boundary"
  | "hostile_topology_boundary"
  | "iso717_airborne_rating_adapter"
  | "leaf_surface_mass_partition"
  | "mass_air_mass_resonance_formula"
  | "porous_absorber_damping_formula"
  | "source_absent_budget_decomposition"
  | "stc_existing_display_boundary";

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTerm = {
  readonly description: string;
  readonly owner: string;
  readonly requiredInputs: readonly string[];
  readonly runtimeOwnedInGate: false;
  readonly termId: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTermId;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedBudgetTermId =
  | "absorber_flow_resistivity_default"
  | "banded_curve_fit_residual"
  | "bridge_coupling_class_uncertainty"
  | "cavity_depth_resonance_uncertainty"
  | "holdout_absence"
  | "input_leaf_mass_precision"
  | "iso717_adapter_uncertainty";

export type LayerCombinationResolverDoubleLeafFramedWallBandedBudgetTerm = {
  readonly basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget";
  readonly db: number;
  readonly termId: LayerCombinationResolverDoubleLeafFramedWallBandedBudgetTermId;
  readonly tightenRequires: readonly string[];
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget = {
  readonly metricId: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaMetricId;
  readonly notMeasuredEvidence: true;
  readonly terms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedBudgetTerm[];
  readonly totalBudgetDb: number;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics = {
  readonly C: number | null;
  readonly Ctr: number | null;
  readonly Rw: number | null;
  readonly STCCompatibility: number | null;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaComponentBreakdown = {
  readonly bridgeCouplingDeltaDb: number;
  readonly cavityDepthCreditDb: number;
  readonly massAirMassResonanceHz: number;
  readonly massLawRwSeedDb: number;
  readonly porousDampingCreditDb: number;
  readonly resonancePenaltyDb: number;
  readonly totalLeafMassKgM2: number;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput = {
  readonly absorberCoverageRatio?: number | null;
  readonly bridgeClass: GateQDoubleLeafFrameBridgeClass;
  readonly cavityAbsorptionClass?: "none" | "porous_absorptive" | "unknown";
  readonly cavityDepthMm?: number;
  readonly cavityFillCoverage?: "empty" | "full" | "partial" | "unknown";
  readonly exactSourceId?: string;
  readonly flowResistivityPaSM2?: number | null;
  readonly flowResistivitySource?: GateRDoubleLeafFramedBridgePhysicalInputs["flowResistivitySource"];
  readonly requestedBasis?: LayerCombinationResolverDoubleLeafFramedWallBandedRequestedBasis;
  readonly resilientBarSideCount?: AirborneContext["resilientBarSideCount"];
  readonly route: "floor" | "wall";
  readonly sideALeafMassKgM2?: number;
  readonly sideBLeafMassKgM2?: number;
  readonly sourceOrPhysicsBasis: LayerCombinationResolverDoubleLeafFramedWallBandedSourceOrPhysicsBasis;
  readonly stcPolicy?: LayerCombinationResolverDoubleLeafFramedWallBandedStcPolicy;
  readonly supportSpacingMm?: number;
  readonly targetOutputs?: readonly RequestedOutputId[];
  readonly topologyMode: LayerCombinationResolverDoubleLeafFramedWallBandedTopologyMode;
  readonly topologyState: LayerCombinationResolverDoubleLeafFramedWallBandedTopologyState;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation = {
  readonly affectedFormulaOutputs: readonly RequestedOutputId[];
  readonly basisId: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS;
  readonly blockedFormulaOutputs: readonly RequestedOutputId[];
  readonly compatibilityOnlyOutputs: readonly RequestedOutputId[];
  readonly componentBreakdown: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaComponentBreakdown | null;
  readonly corridorStatus: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaStatus;
  readonly designMetrics: LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics;
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly exactSourceId: string | null;
  readonly formulaTerms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTerm[];
  readonly missingOwnerFields: readonly string[];
  readonly oneThirdOctaveCurve: {
    readonly frequenciesHz: readonly number[];
    readonly transmissionLossDb: readonly number[];
  } | null;
  readonly requestedBasis: LayerCombinationResolverDoubleLeafFramedWallBandedRequestedBasis;
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimeValues: {
    readonly C: null;
    readonly Ctr: null;
    readonly Rw: null;
    readonly STCCompatibility: null;
  };
  readonly sourceOrPhysicsBasis: LayerCombinationResolverDoubleLeafFramedWallBandedSourceOrPhysicsBasis;
  readonly stcPolicy: LayerCombinationResolverDoubleLeafFramedWallBandedStcPolicy;
  readonly toleranceBudgets: readonly LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget[];
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract = {
  readonly basisAliasBlocked: {
    readonly astmE413Stc: true;
    readonly astmIicAiic: true;
    readonly buildingPrediction: true;
    readonly fieldAirborne: true;
    readonly floorImpact: true;
  };
  readonly candidateFormulaRows: readonly LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaStatement: readonly string[];
  readonly formulaTerms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTerm[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousDoubleLeafOwner: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS;
  };
  readonly runtimePromotionAllowedInGate: false;
  readonly runtimePromotionEntryCriteria: readonly string[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS;
  readonly sourceRowsRequiredForFormulaDesign: false;
  readonly toleranceBudgets: readonly LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget[];
};

const FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw", "C", "Ctr"]);
const STC_COMPATIBILITY_OUTPUTS = new Set<RequestedOutputId>(["STC"]);
const NOMINAL_POROUS_FLOW_RESISTIVITY_PA_SM2 = 15_000;
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

const FIELD_OR_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["Dn,A", "Dn,w", "DnT,A", "DnT,A,k", "DnT,w", "R'w"]);

const NULL_DESIGN_METRICS = {
  C: null,
  Ctr: null,
  Rw: null,
  STCCompatibility: null
} as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics;

const NULL_RUNTIME_VALUES = {
  C: null,
  Ctr: null,
  Rw: null,
  STCCompatibility: null
} as const;

const FORMULA_TERMS = [
  {
    description: "Admit only explicit wall double-leaf/framed topologies with one primary cavity.",
    owner: "doubleLeafFramedTopologyOwner",
    requiredInputs: [
      "route=wall",
      "topologyMode=double_leaf_framed",
      "sideALeafGroup",
      "sideBLeafGroup",
      "cavity1LayerGroup"
    ],
    runtimeOwnedInGate: false,
    termId: "double_leaf_framed_topology_filter"
  },
  {
    description: "Normalize side-specific leaf surface masses before mass-air-mass or bridge terms run.",
    owner: "doubleLeafSurfaceMassPartitionOwner",
    requiredInputs: ["sideALeafMassKgM2", "sideBLeafMassKgM2", "leafMassRatio"],
    runtimeOwnedInGate: false,
    termId: "leaf_surface_mass_partition"
  },
  {
    description: "Calculate the cavity resonance from leaf masses, air density, sound speed, and cavity depth.",
    owner: "doubleLeafMassAirMassOwner",
    requiredInputs: ["cavityDepthMm", "sideALeafMassKgM2", "sideBLeafMassKgM2", "massAirMassResonanceHz"],
    runtimeOwnedInGate: false,
    termId: "mass_air_mass_resonance_formula"
  },
  {
    description: "Apply support bridge coupling from independent, twin-frame, shared-stud, or resilient bridge class.",
    owner: "doubleLeafBridgeCouplingOwner",
    requiredInputs: ["bridgeClass", "supportTopology", "supportSpacingMm", "resilientBarSideCount"],
    runtimeOwnedInGate: false,
    termId: "bridge_coupling_formula_owner"
  },
  {
    description: "Apply bounded porous absorber damping from cavity coverage and numeric flow resistivity when owned.",
    owner: "doubleLeafPorousAbsorberOwner",
    requiredInputs: [
      "cavityFillCoverage",
      "cavityAbsorptionClass",
      "flowResistivitySource",
      "flowResistivityPaSM2",
      "absorberCoverageRatio"
    ],
    runtimeOwnedInGate: false,
    termId: "porous_absorber_damping_formula"
  },
  {
    description: "Store the 63-4000 Hz one-third-octave double-leaf TL curve rather than only a scalar Rw.",
    owner: "doubleLeafBandedTransmissionLossOwner",
    requiredInputs: ["oneThirdOctaveBandSet", "resonanceNotchShape", "bridgeLossTilt"],
    runtimeOwnedInGate: false,
    termId: "banded_tl_curve_owner"
  },
  {
    description: "Rate Rw, C, and Ctr from the element-lab airborne curve on ISO 717-1 only.",
    owner: "doubleLeafIso717AirborneAdapterOwner",
    requiredInputs: ["requestedBasis=element_lab", "ISO717-1 referenceContour", "RwAdapter", "CAdapter", "CtrAdapter"],
    runtimeOwnedInGate: false,
    termId: "iso717_airborne_rating_adapter"
  },
  {
    description: "Preserve STC as current display compatibility until an ASTM E413 curve owner lands.",
    owner: "doubleLeafStcDisplayBoundaryOwner",
    requiredInputs: ["existingStcOutput", "noRwToStcAliasPromotion", "futureAstmE413CurveOwner"],
    runtimeOwnedInGate: false,
    termId: "stc_existing_display_boundary"
  },
  {
    description: "Keep exact same-stack source rows and holdouts ahead of source-absent formula payloads.",
    owner: "doubleLeafExactSourcePrecedenceOwner",
    requiredInputs: ["exactSourceId", "sameStackMetricBasis", "rightsSafeHoldoutRows", "negativeNearMissRows"],
    runtimeOwnedInGate: false,
    termId: "exact_source_precedence_and_holdouts"
  },
  {
    description: "Publish wide not-measured budgets until same-family residuals exist for each bridge class.",
    owner: "doubleLeafSourceAbsentBudgetOwner",
    requiredInputs: ["RwBudget", "CBudget", "CtrBudget", "STCCompatibilityBudget", "holdoutResiduals"],
    runtimeOwnedInGate: false,
    termId: "source_absent_budget_decomposition"
  },
  {
    description: "Reject grouped triple-leaf, multicavity, duplicate, and unsafe reorder stacks from this corridor.",
    owner: "doubleLeafHostileTopologyBoundaryOwner",
    requiredInputs: ["topologyState", "singlePrimaryCavity", "unsafeReorderBoundary", "groupedTripleLeafBoundary"],
    runtimeOwnedInGate: false,
    termId: "hostile_topology_boundary"
  },
  {
    description: "Block field, building, floor-impact, ASTM, and IIC/AIIC bases until separate adapters own them.",
    owner: "doubleLeafFieldBuildingFloorImpactAstmBoundaryOwner",
    requiredInputs: ["fieldContextOwner", "buildingPredictionOwner", "ISO717-2 owner", "ASTM E413 owner", "ASTM E989 owner"],
    runtimeOwnedInGate: false,
    termId: "field_building_floor_impact_and_astm_boundary"
  }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedFormulaTerm[];

const DEFAULT_TOLERANCE_BUDGETS = buildBudgets(8);

function buildMetricBudget(
  metricId: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaMetricId,
  totalBudgetDb: number
): LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget {
  const fixedTerms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedBudgetTerm[] = [
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 0.8,
      termId: "input_leaf_mass_precision",
      tightenRequires: ["user_supplied_or_source_owned_side_leaf_masses"]
    },
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 0.9,
      termId: "cavity_depth_resonance_uncertainty",
      tightenRequires: ["verified_cavity_depth_and_mass_air_mass_resonance_holdout"]
    },
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 1.4,
      termId: "bridge_coupling_class_uncertainty",
      tightenRequires: ["same_bridge_class_calibration_rows_and_spacing_metadata"]
    },
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 0.9,
      termId: "absorber_flow_resistivity_default",
      tightenRequires: ["source_owned_or_user_supplied_flow_resistivity"]
    },
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 1.2,
      termId: "banded_curve_fit_residual",
      tightenRequires: ["one_third_octave_TL_holdouts_for_same_double_leaf_family"]
    },
    {
      basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
      db: 0.7,
      termId: "iso717_adapter_uncertainty",
      tightenRequires: ["same_curve_iso717_rating_residuals"]
    }
  ];

  return {
    metricId,
    notMeasuredEvidence: true,
    terms: [
      ...fixedTerms,
      {
        basis: "source_absent_double_leaf_framed_wall_banded_formula_design_budget",
        db: Math.max(0, round1(totalBudgetDb - 5.9)),
        termId: "holdout_absence",
        tightenRequires: ["rights_safe_exact_or_nearby_double_leaf_framed_holdout_rows"]
      }
    ],
    totalBudgetDb
  };
}

function buildBudgets(
  rwBudgetDb: number
): readonly LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget[] {
  return [
    buildMetricBudget("Rw", rwBudgetDb),
    buildMetricBudget("C", 2.5),
    buildMetricBudget("Ctr", 4.5),
    buildMetricBudget("STC", rwBudgetDb)
  ];
}

function requestedOutputs(
  input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput
): readonly RequestedOutputId[] {
  return input.targetOutputs && input.targetOutputs.length > 0 ? input.targetOutputs : (["Rw", "C", "Ctr"] as const);
}

function splitOutputs(input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput): {
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

function hasImpactTarget(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => IMPACT_OUTPUTS.has(output));
}

function hasFieldOrBuildingTarget(outputs: readonly RequestedOutputId[]): boolean {
  return outputs.some((output) => FIELD_OR_BUILDING_OUTPUTS.has(output));
}

function missingOwnerFields(
  input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput
): readonly string[] {
  const missing: string[] = [];

  if (!Number.isFinite(input.sideALeafMassKgM2)) {
    missing.push("sideALeafMassKgM2");
  }
  if (!Number.isFinite(input.sideBLeafMassKgM2)) {
    missing.push("sideBLeafMassKgM2");
  }
  if (!Number.isFinite(input.cavityDepthMm)) {
    missing.push("cavityDepthMm");
  }
  if (!Number.isFinite(input.supportSpacingMm)) {
    missing.push("supportSpacingMm");
  }
  if (input.bridgeClass === "unknown") {
    missing.push("bridgeClass");
  }
  if (!input.cavityFillCoverage) {
    missing.push("cavityFillCoverage");
  }
  if (!input.cavityAbsorptionClass) {
    missing.push("cavityAbsorptionClass");
  }
  if (!input.flowResistivitySource) {
    missing.push("flowResistivitySource");
  }
  if (input.bridgeClass === "resilient_bridge" && !input.resilientBarSideCount) {
    missing.push("resilientBarSideCount");
  }

  return missing;
}

type RequiredFormulaInputs = Required<
  Pick<
    LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput,
    | "bridgeClass"
    | "absorberCoverageRatio"
    | "cavityAbsorptionClass"
    | "cavityDepthMm"
    | "cavityFillCoverage"
    | "flowResistivityPaSM2"
    | "flowResistivitySource"
    | "sideALeafMassKgM2"
    | "sideBLeafMassKgM2"
    | "supportSpacingMm"
  >
> &
  Pick<LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput, "resilientBarSideCount">;

function getRequiredInputs(
  input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput
): RequiredFormulaInputs | null {
  if (missingOwnerFields(input).length > 0) {
    return null;
  }

  return {
    absorberCoverageRatio: input.absorberCoverageRatio ?? null,
    bridgeClass: input.bridgeClass,
    cavityAbsorptionClass: input.cavityAbsorptionClass as RequiredFormulaInputs["cavityAbsorptionClass"],
    cavityDepthMm: input.cavityDepthMm as number,
    cavityFillCoverage: input.cavityFillCoverage as RequiredFormulaInputs["cavityFillCoverage"],
    flowResistivityPaSM2: input.flowResistivityPaSM2 ?? null,
    flowResistivitySource: input.flowResistivitySource as RequiredFormulaInputs["flowResistivitySource"],
    resilientBarSideCount: input.resilientBarSideCount,
    sideALeafMassKgM2: input.sideALeafMassKgM2 as number,
    sideBLeafMassKgM2: input.sideBLeafMassKgM2 as number,
    supportSpacingMm: input.supportSpacingMm as number
  };
}

function geometryOutOfRange(input: RequiredFormulaInputs): boolean {
  return (
    input.sideALeafMassKgM2 < 2 ||
    input.sideALeafMassKgM2 > 120 ||
    input.sideBLeafMassKgM2 < 2 ||
    input.sideBLeafMassKgM2 > 120 ||
    input.cavityDepthMm < 20 ||
    input.cavityDepthMm > 300 ||
    input.supportSpacingMm < 200 ||
    input.supportSpacingMm > 1200
  );
}

function bridgeCouplingDeltaDb(input: RequiredFormulaInputs): number {
  switch (input.bridgeClass) {
    case "independent_frame":
      return 4;
    case "twin_frame_bridge":
      return 3;
    case "resilient_bridge":
      return input.resilientBarSideCount === "both_sides" ? 5.5 : 4.5;
    case "shared_stud_bridge":
      return 1;
    case "direct_fixed_bridge":
      return -5;
    case "unknown":
      return 0;
  }
}

function porousDampingCreditDb(input: RequiredFormulaInputs): number {
  if (
    input.cavityFillCoverage === "empty" ||
    input.cavityAbsorptionClass === "none" ||
    input.flowResistivitySource === "none"
  ) {
    return 0;
  }

  const nominalSourceCredit = (baseCreditDb: number): number => {
    if (!(input.flowResistivityPaSM2 && Number.isFinite(input.flowResistivityPaSM2))) {
      return baseCreditDb;
    }

    const logDistanceFromNominal = Math.abs(
      Math.log10(input.flowResistivityPaSM2 / NOMINAL_POROUS_FLOW_RESISTIVITY_PA_SM2)
    );
    const multiplier = clamp(1 - (logDistanceFromNominal * 0.65), 0.45, 1);

    return round1(baseCreditDb * multiplier);
  };
  const fullBaseCredit = input.flowResistivitySource === "engineering_default" ? 3 : 3.5;
  const partialBaseCredit = input.flowResistivitySource === "engineering_default" ? 1.5 : 2;
  const numericCoverageBaseCredit = (): number | null => {
    if (input.bridgeClass === "direct_fixed_bridge" || input.absorberCoverageRatio === null) {
      return null;
    }

    return fullBaseCredit * clamp(input.absorberCoverageRatio, 0, 1);
  };
  const numericCoverageCredit = numericCoverageBaseCredit();

  if (input.cavityFillCoverage === "full") {
    return nominalSourceCredit(numericCoverageCredit ?? fullBaseCredit);
  }

  if (input.cavityFillCoverage === "partial" || input.cavityFillCoverage === "unknown") {
    return nominalSourceCredit(numericCoverageCredit ?? partialBaseCredit);
  }

  return 0;
}

function resonancePenaltyDb(resonanceHz: number): number {
  if (resonanceHz < 63) {
    return 0.7;
  }

  if (resonanceHz <= 200) {
    return clamp(2.6 - Math.abs(resonanceHz - 100) * 0.01, 0.9, 2.6);
  }

  return 2.8;
}

function errorBudgetDb(input: RequiredFormulaInputs): number {
  let budget = 6;
  const leafMassRatio =
    Math.max(input.sideALeafMassKgM2, input.sideBLeafMassKgM2) /
    Math.min(input.sideALeafMassKgM2, input.sideBLeafMassKgM2);

  if (input.flowResistivitySource === "engineering_default" || input.flowResistivitySource === "unknown") {
    budget += 1;
  }
  if (input.bridgeClass === "shared_stud_bridge") {
    budget += 2;
  }
  if (input.bridgeClass === "resilient_bridge") {
    budget += 1;
  }
  if (leafMassRatio > 2.5) {
    budget += 1;
  }

  return budget;
}

function buildBandedCurve(input: {
  readonly componentBreakdown: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaComponentBreakdown;
  readonly targetRwDb: number;
}): TransmissionLossCurve {
  const baseCurve = buildCalibratedMassLawCurve(
    Math.max(input.componentBreakdown.totalLeafMassKgM2, 1),
    input.targetRwDb,
    ONE_THIRD_OCTAVE_BANDS_HZ
  );
  const shapedCurve: TransmissionLossCurve = {
    frequenciesHz: [...baseCurve.frequenciesHz],
    transmissionLossDb: baseCurve.transmissionLossDb.map((value, index) => {
      const frequency = baseCurve.frequenciesHz[index] ?? 1;
      const octaveDistance = Math.abs(Math.log2(Math.max(frequency, 1) / input.componentBreakdown.massAirMassResonanceHz));
      const resonanceNotchDb = Math.max(0, 2.4 * (1 - (octaveDistance / 1.35)));
      const bridgeLossTiltDb =
        input.componentBreakdown.bridgeCouplingDeltaDb < 0 && frequency >= 500
          ? Math.min(3, Math.log2(frequency / 400) * 0.9)
          : 0;

      return clamp(value - resonanceNotchDb - bridgeLossTiltDb, 0, 95);
    })
  };

  return anchorCurveToMetric(shapedCurve, input.targetRwDb).curve;
}

function calculateDesignPayload(input: RequiredFormulaInputs): {
  readonly componentBreakdown: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaComponentBreakdown;
  readonly curve: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation["oneThirdOctaveCurve"];
  readonly designMetrics: LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics;
  readonly toleranceBudgets: readonly LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget[];
} {
  const massAirMassResonanceHz = calculateGateRMassAirMassResonanceHz({
    cavityDepthMm: input.cavityDepthMm,
    sideALeafMassKgM2: input.sideALeafMassKgM2,
    sideBLeafMassKgM2: input.sideBLeafMassKgM2
  });
  const bridgeDeltaDb = bridgeCouplingDeltaDb(input);
  const dampingCreditDb = porousDampingCreditDb(input);
  const cavityDepthCreditDb = clamp((input.cavityDepthMm - 40) * 0.045, 0, 4.5);
  const resonancePenalty = resonancePenaltyDb(massAirMassResonanceHz);
  const totalLeafMassKgM2 = input.sideALeafMassKgM2 + input.sideBLeafMassKgM2;
  const massLawRwSeedDb = (20 * log10Safe(totalLeafMassKgM2)) + 12;
  const targetRwDb = Math.round(
    clamp(massLawRwSeedDb + bridgeDeltaDb + cavityDepthCreditDb + dampingCreditDb - resonancePenalty, 20, 75)
  );
  const componentBreakdown = {
    bridgeCouplingDeltaDb: round1(bridgeDeltaDb),
    cavityDepthCreditDb: round1(cavityDepthCreditDb),
    massAirMassResonanceHz,
    massLawRwSeedDb: round1(massLawRwSeedDb),
    porousDampingCreditDb: round1(dampingCreditDb),
    resonancePenaltyDb: round1(resonancePenalty),
    totalLeafMassKgM2: round1(totalLeafMassKgM2)
  };
  const curve = buildBandedCurve({
    componentBreakdown,
    targetRwDb
  });
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  const rwBudget = errorBudgetDb(input);

  return {
    componentBreakdown,
    curve: {
      frequenciesHz: [...curve.frequenciesHz],
      transmissionLossDb: curve.transmissionLossDb.map(round1)
    },
    designMetrics: {
      C: round1(ratings.iso717.C),
      Ctr: round1(ratings.iso717.Ctr),
      Rw: ratings.iso717.Rw,
      STCCompatibility: ratings.astmE413.STC
    },
    toleranceBudgets: buildBudgets(rwBudget)
  };
}

function makeEvaluation(
  input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput,
  corridorStatus: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaStatus,
  design: {
    readonly componentBreakdown: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaComponentBreakdown | null;
    readonly curve: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation["oneThirdOctaveCurve"];
    readonly designMetrics: LayerCombinationResolverDoubleLeafFramedWallBandedDesignMetrics;
    readonly toleranceBudgets: readonly LayerCombinationResolverDoubleLeafFramedWallBandedErrorBudget[];
  },
  missingOwnerFieldsForInput: readonly string[]
): LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation {
  const split = splitOutputs(input);
  const basisBlocked = corridorStatus === "blocked_basis_alias";
  const outputBlocked =
    basisBlocked || corridorStatus === "blocked_floor_impact_metric" || corridorStatus === "blocked_stc_alias_promotion";

  return {
    affectedFormulaOutputs: outputBlocked ? [] : split.affectedFormulaOutputs,
    basisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
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
    runtimePromotionAllowedInGate: false,
    runtimeValues: NULL_RUNTIME_VALUES,
    sourceOrPhysicsBasis: input.sourceOrPhysicsBasis,
    stcPolicy: input.stcPolicy ?? "existing_display_compatibility",
    toleranceBudgets: design.toleranceBudgets
  };
}

export function evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor(
  input: LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput
): LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluation {
  const outputs = requestedOutputs(input);
  const requestedBasis = input.requestedBasis ?? "element_lab";
  const stcPolicy = input.stcPolicy ?? "existing_display_compatibility";
  const missing = missingOwnerFields(input);
  const requiredInputs = getRequiredInputs(input);
  const design =
    requiredInputs && !geometryOutOfRange(requiredInputs)
      ? calculateDesignPayload(requiredInputs)
      : {
          componentBreakdown: null,
          curve: null,
          designMetrics: NULL_DESIGN_METRICS,
          toleranceBudgets: DEFAULT_TOLERANCE_BUDGETS
        };

  if (requestedBasis !== "element_lab" || hasFieldOrBuildingTarget(outputs)) {
    return makeEvaluation(input, "blocked_basis_alias", design, missing);
  }
  if (hasImpactTarget(outputs)) {
    return makeEvaluation(input, "blocked_floor_impact_metric", design, missing);
  }
  if (stcPolicy !== "existing_display_compatibility") {
    return makeEvaluation(input, "blocked_stc_alias_promotion", design, missing);
  }
  if (input.route !== "wall") {
    return makeEvaluation(input, "blocked_wrong_route_scope", design, missing);
  }
  if (input.exactSourceId || input.sourceOrPhysicsBasis === "exact_source_available") {
    return makeEvaluation(input, "blocked_exact_source_precedence", design, missing);
  }
  if (input.topologyMode === "grouped_triple_leaf" || input.topologyMode === "flat_multicavity") {
    return makeEvaluation(input, "blocked_grouped_triple_leaf_or_multicavity", design, missing);
  }
  if (input.topologyMode !== "double_leaf_framed") {
    return makeEvaluation(input, "blocked_wrong_support_family", design, missing);
  }
  if (input.topologyState === "ambiguous_duplicate_or_overlap" || input.topologyState === "unsafe_reorder") {
    return makeEvaluation(input, "blocked_hostile_topology", design, missing);
  }
  if (input.bridgeClass === "direct_fixed_bridge") {
    return makeEvaluation(input, "blocked_direct_fixed_bridge", design, missing);
  }
  if (input.bridgeClass === "unknown") {
    return makeEvaluation(input, "blocked_wrong_support_family", design, missing);
  }
  if (input.bridgeClass === "resilient_bridge" && missing.includes("resilientBarSideCount")) {
    return makeEvaluation(input, "blocked_resilient_side_count", design, missing);
  }
  if (missing.length > 0) {
    return makeEvaluation(input, "blocked_missing_owner_fields", design, missing);
  }
  if (!requiredInputs || geometryOutOfRange(requiredInputs)) {
    return makeEvaluation(input, "blocked_nonfinite_geometry", design, missing);
  }
  if (input.sourceOrPhysicsBasis === "missing") {
    return makeEvaluation(input, "blocked_missing_source_or_physics_basis", design, missing);
  }

  return makeEvaluation(input, "formula_corridor_defined_runtime_gate_required", design, missing);
}

const INDEPENDENT_ABSORBED_REFERENCE = {
  bridgeClass: "independent_frame",
  cavityAbsorptionClass: "porous_absorptive",
  cavityDepthMm: 90,
  cavityFillCoverage: "full",
  flowResistivitySource: "engineering_default",
  requestedBasis: "element_lab",
  route: "wall",
  sideALeafMassKgM2: 10.6,
  sideBLeafMassKgM2: 10.6,
  sourceOrPhysicsBasis: "source_absent_physics_model",
  stcPolicy: "existing_display_compatibility",
  supportSpacingMm: 600,
  targetOutputs: ["Rw", "STC", "C", "Ctr"],
  topologyMode: "double_leaf_framed",
  topologyState: "source_equivalent"
} as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput;

const RESILIENT_BOTH_SIDES_REFERENCE = {
  ...INDEPENDENT_ABSORBED_REFERENCE,
  bridgeClass: "resilient_bridge",
  cavityDepthMm: 75,
  resilientBarSideCount: "both_sides"
} as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput;

const RESILIENT_ONE_SIDE_REFERENCE = {
  ...RESILIENT_BOTH_SIDES_REFERENCE,
  resilientBarSideCount: "one_side"
} as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput;

const FIELD_BLOCKED_REFERENCE = {
  ...INDEPENDENT_ABSORBED_REFERENCE,
  requestedBasis: "field",
  targetOutputs: ["R'w", "DnT,w"]
} as const satisfies LayerCombinationResolverDoubleLeafFramedWallBandedFormulaEvaluationInput;

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract():
  LayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridorContract {
  buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract();

  return {
    basisAliasBlocked: {
      astmE413Stc: true,
      astmIicAiic: true,
      buildingPrediction: true,
      fieldAirborne: true,
      floorImpact: true
    },
    candidateFormulaRows: [
      evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor(INDEPENDENT_ABSORBED_REFERENCE),
      evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor(RESILIENT_BOTH_SIDES_REFERENCE),
      evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor(RESILIENT_ONE_SIDE_REFERENCE),
      evaluateLayerCombinationResolverDoubleLeafFramedWallBandedFormulaCorridor(FIELD_BLOCKED_REFERENCE)
    ],
    exactMeasuredRowsRemainPrecedence: true,
    formulaStatement: [
      "element_lab_Rw_uses_total_leaf_mass_plus_mass_air_mass_resonance_plus_bridge_coupling_plus_porous_damping",
      "C_and_Ctr_are_iso717_1_spectrum_adapter_terms_from_the_owned_banded_double_leaf_TL_curve",
      "STC_is_existing_display_compatibility_only_not_a_new_Rw_to_STC_or_ASTC_alias",
      "field_building_floor_impact_and_astm_iic_outputs_stay_blocked_until_their_own_adapters_land",
      "runtime_values_remain_null_until_the_selected_runtime_corridor_owns_public_candidate_selection"
    ],
    formulaTerms: FORMULA_TERMS,
    landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousDoubleLeafOwner: {
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS
    },
    runtimePromotionAllowedInGate: false,
    runtimePromotionEntryCriteria: [
      "public_runtime_must_use_the_double_leaf_framed_banded_formula_basis_not_the_older_gate_s_method_label",
      "runtime_candidate_selection_must_preserve_exact_same_stack_source_precedence",
      "complete_side_leaf_masses_cavity_depth_bridge_class_spacing_absorber_and_resilient_side_count_inputs_must_be_finite",
      "formula_surface_must_show_not_measured_budgets_for_Rw_C_Ctr_and_STC_compatibility",
      "field_building_floor_impact_and_astm_iic_outputs_must_remain_unpromoted",
      "direct_fixed_grouped_triple_leaf_multicavity_duplicate_or_unsafe_reorder_topologies_must_fail_closed"
    ],
    selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    toleranceBudgets: DEFAULT_TOLERANCE_BUDGETS
  };
}
