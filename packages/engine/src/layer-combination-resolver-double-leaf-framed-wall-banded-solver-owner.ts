import {
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildGateRDoubleLeafFramedBridgeScenarioPack } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS
} from "./layer-combination-resolver-post-single-leaf-mass-law-banded-matrix-refresh";
import type {
  LayerCombinationResolverBasis,
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE =
  "layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_solver_owner_landed_no_runtime_selected_formula_corridor";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_double_leaf_framed_wall_banded_formula_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL =
  "layer combination resolver double-leaf framed wall banded formula corridor";

export const LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS =
  "layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor";

type DoubleLeafFramedWallOwnerTermStatus =
  | "owned_for_formula_corridor"
  | "owned_for_negative_boundary"
  | "runtime_blocked_until_formula_corridor"
  | "runtime_existing_no_registry_movement";

export type LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTermId =
  | "astm_stc_rating_boundary_owner"
  | "banded_tl_curve_owner"
  | "cavity_depth_mass_air_mass_owner"
  | "exact_source_precedence_holdout_owner"
  | "field_building_boundary_owner"
  | "floor_impact_boundary_owner"
  | "hostile_topology_boundary_owner"
  | "iso717_airborne_rating_adapter_owner"
  | "leaf_surface_mass_partition_owner"
  | "porous_absorber_flow_resistivity_owner"
  | "resilient_side_count_owner"
  | "route_double_leaf_framed_topology_owner"
  | "source_absent_error_budget_owner"
  | "support_bridge_coupling_owner"
  | "triple_leaf_multicavity_boundary_owner";

export type LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTerm = {
  readonly id: LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTermId;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: DoubleLeafFramedWallOwnerTermStatus;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedRouteAdmissionId =
  | "wall.double_leaf_framed.direct_fixed.element_lab"
  | "wall.double_leaf_framed.independent_absorbed.element_lab"
  | "wall.double_leaf_framed.resilient_explicit.element_lab"
  | "wall.double_leaf_framed.resilient_missing_side_count.needs_input"
  | "wall.field_building_from_lab_double_leaf.blocked"
  | "wall.grouped_triple_leaf_or_multicavity.separate_owner";

export type LayerCombinationResolverDoubleLeafFramedWallBandedRouteAdmission = {
  readonly basis: LayerCombinationResolverBasis;
  readonly existingRuntimeCandidateId: string | null;
  readonly existingRuntimeMethod: string | null;
  readonly id: LayerCombinationResolverDoubleLeafFramedWallBandedRouteAdmissionId;
  readonly noRuntimeValueMovement: true;
  readonly ownedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly requiredOwnerTerms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTermId[];
  readonly route: LayerCombinationResolverRoute;
  readonly selectedForFormulaCorridor: boolean;
  readonly status:
    | "blocked_boundary"
    | "needs_input_boundary"
    | "selected_formula_scope"
    | "separate_owner_boundary";
  readonly visibleReason: string;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeProbeId =
  | "wall.direct_fixed_double_leaf_screening_boundary"
  | "wall.explicit_independent_absorbed_double_leaf_runtime"
  | "wall.grouped_triple_leaf_calibrated_boundary"
  | "wall.resilient_double_leaf_missing_side_count_needs_input"
  | "wall.resilient_double_leaf_runtime";

export type LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeProbe = {
  readonly currentErrorBudgetDb: number | null;
  readonly currentMethod: string | null;
  readonly currentRw: number | null;
  readonly currentStc: number | null;
  readonly id: LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeProbeId;
  readonly noRuntimeValueMovement: true;
  readonly selectedCandidateId: string;
  readonly status:
    | "existing_runtime_supported"
    | "needs_input"
    | "screening_boundary"
    | "separate_calibrated_owner";
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedBlockedActionId =
  | "astm_stc_alias_runtime"
  | "broad_source_crawl"
  | "direct_fixed_double_leaf_runtime"
  | "field_building_runtime_promotion"
  | "floor_impact_from_wall_airborne"
  | "registry_runtime_promotion_before_formula_corridor"
  | "tolerance_retune_without_holdouts"
  | "triple_leaf_runtime_reassignment";

export type LayerCombinationResolverDoubleLeafFramedWallBandedBlockedAction = {
  readonly id: LayerCombinationResolverDoubleLeafFramedWallBandedBlockedActionId;
  readonly reason: string;
  readonly selectedNow: false;
};

export type LayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract = {
  readonly blockedNextActions: readonly LayerCombinationResolverDoubleLeafFramedWallBandedBlockedAction[];
  readonly existingDynamicRuntimeCandidate: {
    readonly candidateId: typeof GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID;
    readonly currentRuntimeMethod: typeof GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD;
    readonly notYetRegisteredAsLayerCombinationResolverCandidate: true;
    readonly valuePins: readonly {
      readonly metric: LayerCombinationResolverMetricId;
      readonly scenario: "independent_absorbed" | "resilient_both_sides";
      readonly value: number;
    }[];
  };
  readonly gateRScenarioStatuses: readonly {
    readonly id: string;
    readonly status: string;
  }[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerTerms: readonly LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTerm[];
  readonly plannedFormulaCorridorBasis: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS;
  readonly previousPostSingleLeafMatrixRefresh: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS;
  };
  readonly routeAdmissions: readonly LayerCombinationResolverDoubleLeafFramedWallBandedRouteAdmission[];
  readonly runtimeProbeExpectations: readonly LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeProbe[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL;
  readonly selectedPostSingleLeafGapId: "double_leaf_framed_wall_banded_solver_owner";
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS;
  readonly singleLeafBoundary: {
    readonly candidateId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID;
    readonly runtimeBasisId: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS;
    readonly remainsSeparate: true;
  };
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly blockedActionCount: number;
    readonly gateRScenarioCount: number;
    readonly negativeOrSeparateBoundaryCount: number;
    readonly ownerTermCount: number;
    readonly routeAdmissionCount: number;
    readonly runtimeProbeCount: number;
    readonly selectedFormulaScopeCount: number;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
  };
};

const OWNER_TERMS = [
  {
    id: "route_double_leaf_framed_topology_owner",
    requiredPhysicalFields: [
      "route=wall",
      "wallTopology.topologyMode=double_leaf_framed",
      "sideALeafLayerIndices",
      "sideBLeafLayerIndices",
      "cavity1LayerIndices",
      "exactlyOnePrimaryCavity"
    ],
    runtimeRole: "admit only explicit wall double-leaf/framed topologies into the next formula corridor",
    status: "owned_for_formula_corridor"
  },
  {
    id: "leaf_surface_mass_partition_owner",
    requiredPhysicalFields: [
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "leafMassRatio",
      "layerSurfaceMassAggregationRule",
      "nonLeafLayerExclusionRule"
    ],
    runtimeRole: "own side-specific mass inputs before mass-air-mass and curve terms are calculated",
    status: "owned_for_formula_corridor"
  },
  {
    id: "cavity_depth_mass_air_mass_owner",
    requiredPhysicalFields: [
      "cavity1DepthMm",
      "airDensityKgM3",
      "soundSpeedMS",
      "massAirMassResonanceHz",
      "lowFrequencyResonancePenalty"
    ],
    runtimeRole: "define the mass-air-mass resonance input and formula corridor terms",
    status: "owned_for_formula_corridor"
  },
  {
    id: "porous_absorber_flow_resistivity_owner",
    requiredPhysicalFields: [
      "cavity1AbsorptionClass",
      "cavity1FillCoverage",
      "flowResistivityPaSM2",
      "propertySourceStatus",
      "porousDampingCreditDb"
    ],
    runtimeRole: "keep absorber damping explicit and widen budgets when engineering defaults are used",
    status: "owned_for_formula_corridor"
  },
  {
    id: "support_bridge_coupling_owner",
    requiredPhysicalFields: [
      "supportTopology",
      "connectionType",
      "frameBridgeClass",
      "studSpacingMm",
      "bridgeCouplingDeltaDb"
    ],
    runtimeRole: "separate independent, twin-frame, shared-stud, resilient, and direct-fixed bridge behavior",
    status: "owned_for_formula_corridor"
  },
  {
    id: "resilient_side_count_owner",
    requiredPhysicalFields: ["resilientBarSideCount", "resilientChannelSide", "sideCountUnknownPrompt"],
    runtimeRole: "prevent resilient-channel double-leaf cases from promoting when side count is omitted",
    status: "owned_for_formula_corridor"
  },
  {
    id: "banded_tl_curve_owner",
    requiredPhysicalFields: [
      "oneThirdOctaveBandSet",
      "transmissionLossCurve50To3150Hz",
      "resonanceNotchShape",
      "bridgeLossTilt",
      "curveAnchorMetric"
    ],
    runtimeRole: "make the formula corridor own the banded TL curve instead of only fixed single-number pins",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "iso717_airborne_rating_adapter_owner",
    requiredPhysicalFields: ["ISO717-1 referenceContour", "RwAdapter", "CAdapter", "CtrAdapter", "curveFitResidual"],
    runtimeRole: "derive Rw/C/Ctr from the owned double-leaf curve in the next corridor",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "astm_stc_rating_boundary_owner",
    requiredPhysicalFields: ["existingStcOutput", "ASTM E413 contour owner", "noRwToStcAliasPromotion"],
    runtimeRole: "keep current STC display compatible while blocking any new alias claim",
    status: "owned_for_negative_boundary"
  },
  {
    id: "exact_source_precedence_holdout_owner",
    requiredPhysicalFields: [
      "sameStackExactSourceId",
      "sameMetricBasis",
      "rightsSafeDoubleLeafHoldoutRows",
      "bridgeClassMatchedAnchorRows",
      "negativeNearMissRows"
    ],
    runtimeRole: "ensure exact rows and measured holdouts stay above source-absent formula predictions",
    status: "owned_for_formula_corridor"
  },
  {
    id: "source_absent_error_budget_owner",
    requiredPhysicalFields: [
      "sourceAbsentRwBudget",
      "sourceAbsentCBudget",
      "sourceAbsentCtrBudget",
      "bridgeClassBudget",
      "flowResistivityDefaultBudget",
      "massAirMassFitResidualBudget"
    ],
    runtimeRole: "publish not-measured budgets until double-leaf calibration residuals narrow them",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "hostile_topology_boundary_owner",
    requiredPhysicalFields: [
      "duplicateLeafGroupPolicy",
      "unsafeReorderBoundary",
      "manyLayerRolelessStackPolicy",
      "partialCavityPrompt",
      "splitAbsorberMergePolicy"
    ],
    runtimeRole: "keep hostile layer edits finite and prevent accidental double-leaf promotion",
    status: "owned_for_negative_boundary"
  },
  {
    id: "triple_leaf_multicavity_boundary_owner",
    requiredPhysicalFields: [
      "groupedTripleLeafTopology",
      "internalLeafLayerIndices",
      "twoCavityOwner",
      "doNotReassignTripleLeafRuntime"
    ],
    runtimeRole: "keep grouped triple-leaf and flat multicavity solvers separate from this two-leaf owner",
    status: "owned_for_negative_boundary"
  },
  {
    id: "field_building_boundary_owner",
    requiredPhysicalFields: ["roomContext", "partitionArea", "flankingContext", "junctionCoupling", "normalizationBasis"],
    runtimeRole: "block field/building promotion until direct, flanking, junction, and room owners exist",
    status: "owned_for_negative_boundary"
  },
  {
    id: "floor_impact_boundary_owner",
    requiredPhysicalFields: ["route=wall", "noFloorImpactTransfer", "noLnWFromWallAirborne", "impactOwnerRequired"],
    runtimeRole: "block floor impact outputs from borrowing wall double-leaf airborne curves",
    status: "owned_for_negative_boundary"
  }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedOwnerTerm[];

const ROUTE_ADMISSIONS = [
  {
    basis: "element_lab",
    existingRuntimeCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
    existingRuntimeMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
    id: "wall.double_leaf_framed.independent_absorbed.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: ["Rw", "C", "Ctr", "STC"],
    requiredOwnerTerms: [
      "route_double_leaf_framed_topology_owner",
      "leaf_surface_mass_partition_owner",
      "cavity_depth_mass_air_mass_owner",
      "porous_absorber_flow_resistivity_owner",
      "support_bridge_coupling_owner",
      "banded_tl_curve_owner",
      "iso717_airborne_rating_adapter_owner",
      "source_absent_error_budget_owner"
    ],
    route: "wall",
    selectedForFormulaCorridor: true,
    status: "selected_formula_scope",
    visibleReason:
      "complete independent absorbed wall double-leaf/framed stacks are the first selected formula-corridor scope"
  },
  {
    basis: "element_lab",
    existingRuntimeCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
    existingRuntimeMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
    id: "wall.double_leaf_framed.resilient_explicit.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: ["Rw", "C", "Ctr", "STC"],
    requiredOwnerTerms: [
      "route_double_leaf_framed_topology_owner",
      "leaf_surface_mass_partition_owner",
      "cavity_depth_mass_air_mass_owner",
      "porous_absorber_flow_resistivity_owner",
      "support_bridge_coupling_owner",
      "resilient_side_count_owner",
      "banded_tl_curve_owner",
      "iso717_airborne_rating_adapter_owner",
      "source_absent_error_budget_owner"
    ],
    route: "wall",
    selectedForFormulaCorridor: true,
    status: "selected_formula_scope",
    visibleReason:
      "resilient-channel double-leaf/framed stacks are admissible only when side count is explicit"
  },
  {
    basis: "element_lab",
    existingRuntimeCandidateId: "candidate_dynamic_needs_input",
    existingRuntimeMethod: null,
    id: "wall.double_leaf_framed.resilient_missing_side_count.needs_input",
    noRuntimeValueMovement: true,
    ownedMetrics: [],
    requiredOwnerTerms: ["resilient_side_count_owner", "hostile_topology_boundary_owner"],
    route: "wall",
    selectedForFormulaCorridor: false,
    status: "needs_input_boundary",
    visibleReason: "missing resilientBarSideCount remains a named input prompt, not a guessed bridge class"
  },
  {
    basis: "element_lab",
    existingRuntimeCandidateId: "candidate_multileaf_screening_fallback",
    existingRuntimeMethod: null,
    id: "wall.double_leaf_framed.direct_fixed.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: [],
    requiredOwnerTerms: ["support_bridge_coupling_owner", "hostile_topology_boundary_owner"],
    route: "wall",
    selectedForFormulaCorridor: false,
    status: "blocked_boundary",
    visibleReason: "direct-fixed bridge loss needs a separate owner before it can enter this corridor"
  },
  {
    basis: "element_lab",
    existingRuntimeCandidateId: "wall.multileaf_triple_leaf.calibrated_family_solver",
    existingRuntimeMethod: "broad_accuracy_wall_triple_leaf_nrc2024_calibrated_solver",
    id: "wall.grouped_triple_leaf_or_multicavity.separate_owner",
    noRuntimeValueMovement: true,
    ownedMetrics: ["Rw", "C", "Ctr"],
    requiredOwnerTerms: ["triple_leaf_multicavity_boundary_owner"],
    route: "wall",
    selectedForFormulaCorridor: false,
    status: "separate_owner_boundary",
    visibleReason: "triple-leaf and multicavity stacks keep their separate calibrated/topology owners"
  },
  {
    basis: "building_prediction",
    existingRuntimeCandidateId: "generic.lab_field_building_basis_boundary",
    existingRuntimeMethod: null,
    id: "wall.field_building_from_lab_double_leaf.blocked",
    noRuntimeValueMovement: true,
    ownedMetrics: [],
    requiredOwnerTerms: ["field_building_boundary_owner"],
    route: "wall",
    selectedForFormulaCorridor: false,
    status: "blocked_boundary",
    visibleReason: "lab double-leaf values do not become R'w or DnT,w without field/building owners"
  }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedRouteAdmission[];

const RUNTIME_PROBES = [
  {
    currentErrorBudgetDb: 7,
    currentMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
    currentRw: 45,
    currentStc: 45,
    id: "wall.explicit_independent_absorbed_double_leaf_runtime",
    noRuntimeValueMovement: true,
    selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
    status: "existing_runtime_supported"
  },
  {
    currentErrorBudgetDb: 8,
    currentMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
    currentRw: 46,
    currentStc: 46,
    id: "wall.resilient_double_leaf_runtime",
    noRuntimeValueMovement: true,
    selectedCandidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
    status: "existing_runtime_supported"
  },
  {
    currentErrorBudgetDb: null,
    currentMethod: null,
    currentRw: null,
    currentStc: null,
    id: "wall.resilient_double_leaf_missing_side_count_needs_input",
    noRuntimeValueMovement: true,
    selectedCandidateId: "candidate_dynamic_needs_input",
    status: "needs_input"
  },
  {
    currentErrorBudgetDb: null,
    currentMethod: null,
    currentRw: null,
    currentStc: null,
    id: "wall.direct_fixed_double_leaf_screening_boundary",
    noRuntimeValueMovement: true,
    selectedCandidateId: "candidate_multileaf_screening_fallback",
    status: "screening_boundary"
  },
  {
    currentErrorBudgetDb: null,
    currentMethod: "broad_accuracy_wall_triple_leaf_nrc2024_calibrated_solver",
    currentRw: 53,
    currentStc: 64,
    id: "wall.grouped_triple_leaf_calibrated_boundary",
    noRuntimeValueMovement: true,
    selectedCandidateId: "wall.multileaf_triple_leaf.calibrated_family_solver",
    status: "separate_calibrated_owner"
  }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedRuntimeProbe[];

const BLOCKED_NEXT_ACTIONS = [
  {
    id: "registry_runtime_promotion_before_formula_corridor",
    reason:
      "the existing Gate S runtime is acknowledged but must not be added to the layer-combination resolver registry before the formula corridor owns basis, budgets, and boundary rows",
    selectedNow: false
  },
  {
    id: "direct_fixed_double_leaf_runtime",
    reason:
      "direct-fixed double-leaf cases need a separate mechanical bridge-loss owner before runtime promotion",
    selectedNow: false
  },
  {
    id: "triple_leaf_runtime_reassignment",
    reason:
      "grouped triple-leaf and multicavity routes already have separate topology/calibrated owners and must not be reassigned to a two-leaf formula",
    selectedNow: false
  },
  {
    id: "field_building_runtime_promotion",
    reason:
      "field/building outputs require direct, flanking, junction, room, and normalization owners rather than lab-value aliasing",
    selectedNow: false
  },
  {
    id: "floor_impact_from_wall_airborne",
    reason: "wall double-leaf airborne curves cannot produce floor impact metrics or ISO 717-2 values",
    selectedNow: false
  },
  {
    id: "astm_stc_alias_runtime",
    reason: "current STC display remains compatibility output; no new Rw-to-STC alias or ASTM rating claim is selected",
    selectedNow: false
  },
  {
    id: "tolerance_retune_without_holdouts",
    reason: "double-leaf tolerance retune waits for rights-safe residual and holdout rows",
    selectedNow: false
  },
  {
    id: "broad_source_crawl",
    reason: "sources remain exact rows, anchors, holdouts, or negative boundaries for named solver lanes, not the product",
    selectedNow: false
  }
] as const satisfies readonly LayerCombinationResolverDoubleLeafFramedWallBandedBlockedAction[];

export function buildLayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract():
  LayerCombinationResolverDoubleLeafFramedWallBandedSolverOwnerContract {
  const postSingleLeaf = buildLayerCombinationResolverPostSingleLeafMassLawBandedMatrixRefreshContract();
  const selectedGap = postSingleLeaf.rankedResearchOnlyGaps.find(
    (gap) => gap.id === "double_leaf_framed_wall_banded_solver_owner" && gap.selected
  );

  if (!selectedGap) {
    throw new Error("Double-leaf/framed wall owner expected the post-single-leaf matrix to select its gap.");
  }

  const gateRScenarioStatuses = buildGateRDoubleLeafFramedBridgeScenarioPack().map((entry) => ({
    id: entry.id,
    status: entry.contract.readinessStatus
  }));

  return {
    blockedNextActions: BLOCKED_NEXT_ACTIONS,
    existingDynamicRuntimeCandidate: {
      candidateId: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_SELECTED_CANDIDATE_ID,
      currentRuntimeMethod: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      notYetRegisteredAsLayerCombinationResolverCandidate: true,
      valuePins: [
        { metric: "Rw", scenario: "independent_absorbed", value: 45 },
        { metric: "STC", scenario: "independent_absorbed", value: 45 },
        { metric: "C", scenario: "independent_absorbed", value: -1 },
        { metric: "Ctr", scenario: "independent_absorbed", value: -6.1 },
        { metric: "Rw", scenario: "resilient_both_sides", value: 46 },
        { metric: "STC", scenario: "resilient_both_sides", value: 46 }
      ]
    },
    gateRScenarioStatuses,
    landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerTerms: OWNER_TERMS,
    plannedFormulaCorridorBasis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_PLANNED_FORMULA_CORRIDOR_BASIS,
    previousPostSingleLeafMatrixRefresh: {
      landedGate: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_POST_SINGLE_LEAF_MASS_LAW_BANDED_MATRIX_REFRESH_SELECTION_STATUS
    },
    routeAdmissions: ROUTE_ADMISSIONS,
    runtimeProbeExpectations: RUNTIME_PROBES,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
    selectedPostSingleLeafGapId: "double_leaf_framed_wall_banded_solver_owner",
    selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTION_STATUS,
    singleLeafBoundary: {
      candidateId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      remainsSeparate: true,
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS
    },
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      blockedActionCount: BLOCKED_NEXT_ACTIONS.length,
      gateRScenarioCount: gateRScenarioStatuses.length,
      negativeOrSeparateBoundaryCount: ROUTE_ADMISSIONS.filter(
        (admission) =>
          admission.status === "blocked_boundary" ||
          admission.status === "needs_input_boundary" ||
          admission.status === "separate_owner_boundary"
      ).length,
      ownerTermCount: OWNER_TERMS.length,
      routeAdmissionCount: ROUTE_ADMISSIONS.length,
      runtimeProbeCount: RUNTIME_PROBES.length,
      selectedFormulaScopeCount: ROUTE_ADMISSIONS.filter((admission) => admission.selectedForFormulaCorridor).length,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION
    }
  };
}
