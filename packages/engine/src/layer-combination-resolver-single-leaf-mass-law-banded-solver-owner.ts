import {
  buildLayerCombinationResolverCompanyInternalV0RehearsalContract,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS
} from "./layer-combination-resolver-company-internal-v0-rehearsal";
import type {
  LayerCombinationResolverBasis,
  LayerCombinationResolverMetricId,
  LayerCombinationResolverRoute
} from "./layer-combination-resolver-registry";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE =
  "layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS =
  "layer_combination_resolver_single_leaf_mass_law_banded_solver_owner_landed_no_runtime_selected_formula_corridor";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_single_leaf_mass_law_banded_formula_corridor_plan";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-formula-corridor-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL =
  "layer combination resolver single-leaf mass-law banded formula corridor";

type SingleLeafOwnerTermStatus =
  | "owned_for_formula_corridor"
  | "owned_for_negative_boundary"
  | "runtime_blocked_until_formula_corridor";

export type LayerCombinationResolverSingleLeafMassLawOwnerTermId =
  | "astm_rating_alias_boundary_owner"
  | "banded_tl_curve_owner"
  | "exact_source_precedence_holdout_owner"
  | "field_building_boundary_owner"
  | "floor_airborne_scope_owner"
  | "hostile_topology_boundary_owner"
  | "impact_metric_boundary_owner"
  | "iso717_airborne_rating_adapter_owner"
  | "material_mass_input_owner"
  | "route_single_visible_leaf_topology_owner"
  | "source_absent_error_budget_owner"
  | "stc_existing_display_policy_owner"
  | "stiffness_coincidence_family_owner";

export type LayerCombinationResolverSingleLeafMassLawOwnerTerm = {
  readonly id: LayerCombinationResolverSingleLeafMassLawOwnerTermId;
  readonly requiredPhysicalFields: readonly string[];
  readonly runtimeRole: string;
  readonly status: SingleLeafOwnerTermStatus;
};

export type LayerCombinationResolverSingleLeafMassLawRouteAdmissionId =
  | "floor.single_leaf_airborne_direct.element_lab"
  | "floor.single_leaf_impact.element_lab"
  | "wall.single_leaf_airborne_direct.element_lab";

export type LayerCombinationResolverSingleLeafMassLawRouteAdmission = {
  readonly basis: LayerCombinationResolverBasis;
  readonly existingCompatibilityMetrics: readonly LayerCombinationResolverMetricId[];
  readonly id: LayerCombinationResolverSingleLeafMassLawRouteAdmissionId;
  readonly noRuntimeValueMovement: true;
  readonly ownedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly requiredOwnerTerms: readonly LayerCombinationResolverSingleLeafMassLawOwnerTermId[];
  readonly route: LayerCombinationResolverRoute;
  readonly selectedForFormulaCorridor: boolean;
  readonly status: "blocked_boundary" | "selected_formula_scope";
  readonly visibleReason: string;
};

export type LayerCombinationResolverSingleLeafMassLawRuntimeProbeId =
  | "wall.concrete_150_single_leaf"
  | "wall.gypsum_board_12_5_single_leaf"
  | "wall.gypsum_board_25_laminated_single_leaf";

export type LayerCombinationResolverSingleLeafMassLawRuntimeProbe = {
  readonly currentBasisOrigin: "family_physics_prediction";
  readonly currentCalculationStandard: "engine_mass_law";
  readonly currentErrorBudgetDb: number;
  readonly currentFamily: "laminated_single_leaf" | "rigid_massive_wall" | "single_leaf_panel";
  readonly currentMethod: string;
  readonly currentRw: number;
  readonly currentStc: number;
  readonly id: LayerCombinationResolverSingleLeafMassLawRuntimeProbeId;
  readonly noRuntimeValueMovement: true;
};

export type LayerCombinationResolverSingleLeafMassLawBlockedActionId =
  | "astm_iic_aiic_alias_runtime"
  | "broad_source_crawl"
  | "field_building_runtime_promotion"
  | "floor_impact_from_airborne_mass_law"
  | "stc_from_rw_alias_promotion"
  | "tolerance_retune_without_holdouts";

export type LayerCombinationResolverSingleLeafMassLawBlockedAction = {
  readonly id: LayerCombinationResolverSingleLeafMassLawBlockedActionId;
  readonly reason: string;
  readonly selectedNow: false;
};

export type LayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract = {
  readonly blockedNextActions: readonly LayerCombinationResolverSingleLeafMassLawBlockedAction[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerTerms: readonly LayerCombinationResolverSingleLeafMassLawOwnerTerm[];
  readonly previousV0Rehearsal: {
    readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS;
  };
  readonly routeAdmissions: readonly LayerCombinationResolverSingleLeafMassLawRouteAdmission[];
  readonly runtimeProbeExpectations: readonly LayerCombinationResolverSingleLeafMassLawRuntimeProbe[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL;
  readonly selectedV0GapId: "wall_floor_single_leaf_mass_law_banded_solver_owner";
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS;
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly blockedActionCount: number;
    readonly ownerTermCount: number;
    readonly routeAdmissionCount: number;
    readonly runtimeProbeCount: number;
    readonly selectedFormulaScopeCount: number;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION;
  };
};

const OWNER_TERMS = [
  {
    id: "route_single_visible_leaf_topology_owner",
    requiredPhysicalFields: [
      "route",
      "visibleLeafCount=1",
      "cavityCount=0",
      "supportLayerCount=0",
      "porousLayerCount=0",
      "explicitSingleLeafOrLaminatedLeafGrouping"
    ],
    runtimeRole: "admit only true single-visible-leaf direct-airborne stacks into the formula corridor",
    status: "owned_for_formula_corridor"
  },
  {
    id: "material_mass_input_owner",
    requiredPhysicalFields: [
      "materialClass",
      "densityKgM3",
      "thicknessMm",
      "surfaceMassKgM2",
      "layerSurfaceMassAggregationRule"
    ],
    runtimeRole: "own the mass-law input surface before a source-absent direct-airborne curve can run",
    status: "owned_for_formula_corridor"
  },
  {
    id: "stiffness_coincidence_family_owner",
    requiredPhysicalFields: [
      "bendingStiffnessClass",
      "criticalFrequencyHz",
      "dampingLossFactor",
      "coincidenceDipModel",
      "delegateMethodSelection"
    ],
    runtimeRole: "separate plain mass law from Sharp, Kurtovic/Cremer, KS, and other coincidence-aware delegates",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "banded_tl_curve_owner",
    requiredPhysicalFields: [
      "oneThirdOctaveBandSet",
      "transmissionLossCurve50To5000Hz",
      "finiteSizeLowFrequencyPolicy",
      "massLawSlopeRegion",
      "coincidenceRegion"
    ],
    runtimeRole: "make the shared resolver own banded TL curves instead of isolated single-number Rw heuristics",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "iso717_airborne_rating_adapter_owner",
    requiredPhysicalFields: ["ISO717-1 referenceContour", "RwAdapter", "CAdapter", "CtrAdapter", "curveFitResidual"],
    runtimeRole: "derive Rw/C/Ctr downstream from the owned banded curve",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "stc_existing_display_policy_owner",
    requiredPhysicalFields: ["existingStcOutput", "noRwToStcAliasPromotion", "futureAstmE413CurveOwner"],
    runtimeRole: "keep the existing STC display compatible without claiming a new Rw-to-STC alias owner",
    status: "owned_for_negative_boundary"
  },
  {
    id: "floor_airborne_scope_owner",
    requiredPhysicalFields: [
      "floorRouteDirectAirborneOnly",
      "floorSystemRwBasis",
      "noImpactMetricTransfer",
      "supportFamilyOrCarrierClass"
    ],
    runtimeRole: "allow floor direct-airborne scope to be designed while keeping impact metrics separate",
    status: "owned_for_formula_corridor"
  },
  {
    id: "impact_metric_boundary_owner",
    requiredPhysicalFields: ["impactCurveOwner", "tappingMachineResponse", "LnWAdapter", "CIBudgetOwner"],
    runtimeRole: "block Ln,w/CI/DeltaLw from being inferred from an airborne mass-law curve",
    status: "owned_for_negative_boundary"
  },
  {
    id: "exact_source_precedence_holdout_owner",
    requiredPhysicalFields: [
      "sameStackExactSourceId",
      "sameMetricBasis",
      "rightsSafeHoldoutRows",
      "compatibleSourceAnchorRows",
      "negativeNearMissRows"
    ],
    runtimeRole: "ensure exact rows and measured holdouts stay ahead of source-absent formulas",
    status: "owned_for_formula_corridor"
  },
  {
    id: "source_absent_error_budget_owner",
    requiredPhysicalFields: [
      "sourceAbsentRwBudget",
      "sourceAbsentCBudget",
      "sourceAbsentCtrBudget",
      "materialDefaultBudget",
      "bandFitResidualBudget"
    ],
    runtimeRole: "publish not-measured budgets until exact or calibrated residuals narrow them",
    status: "runtime_blocked_until_formula_corridor"
  },
  {
    id: "hostile_topology_boundary_owner",
    requiredPhysicalFields: [
      "manyLayerLaminatedLeafPolicy",
      "duplicateLayerMergePolicy",
      "unsafeReorderBoundary",
      "gapOrCavityRejection",
      "massTimberExclusion"
    ],
    runtimeRole: "keep hostile stacks finite and prevent cavity/framed/CLT stacks from leaking into single-leaf mass law",
    status: "owned_for_negative_boundary"
  },
  {
    id: "field_building_boundary_owner",
    requiredPhysicalFields: ["roomContext", "partitionArea", "flankingContext", "junctionCoupling", "normalizationBasis"],
    runtimeRole: "block field/building promotion until ISO 12354 direct, flanking, junction, and room owners exist",
    status: "owned_for_negative_boundary"
  },
  {
    id: "astm_rating_alias_boundary_owner",
    requiredPhysicalFields: ["astmRatingCurveOwner", "IICAIICContourOwner", "testStandardBasis", "aliasRejectionPolicy"],
    runtimeRole: "block ASTM/IIC/AIIC aliases and keep STC ownership separate from ISO Rw/C/Ctr",
    status: "owned_for_negative_boundary"
  }
] as const satisfies readonly LayerCombinationResolverSingleLeafMassLawOwnerTerm[];

const ROUTE_ADMISSIONS = [
  {
    basis: "element_lab",
    existingCompatibilityMetrics: ["STC"],
    id: "wall.single_leaf_airborne_direct.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: ["Rw", "C", "Ctr"],
    requiredOwnerTerms: [
      "route_single_visible_leaf_topology_owner",
      "material_mass_input_owner",
      "stiffness_coincidence_family_owner",
      "banded_tl_curve_owner",
      "iso717_airborne_rating_adapter_owner",
      "stc_existing_display_policy_owner",
      "exact_source_precedence_holdout_owner",
      "source_absent_error_budget_owner",
      "hostile_topology_boundary_owner"
    ],
    route: "wall",
    selectedForFormulaCorridor: true,
    status: "selected_formula_scope",
    visibleReason:
      "wall single-leaf direct-airborne stacks are the first selected V0 solver gap because current Gate O values already use a banded family-physics basis"
  },
  {
    basis: "element_lab",
    existingCompatibilityMetrics: [],
    id: "floor.single_leaf_airborne_direct.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: ["Rw", "C", "Ctr"],
    requiredOwnerTerms: [
      "route_single_visible_leaf_topology_owner",
      "material_mass_input_owner",
      "stiffness_coincidence_family_owner",
      "banded_tl_curve_owner",
      "iso717_airborne_rating_adapter_owner",
      "floor_airborne_scope_owner",
      "exact_source_precedence_holdout_owner",
      "source_absent_error_budget_owner",
      "hostile_topology_boundary_owner"
    ],
    route: "floor",
    selectedForFormulaCorridor: true,
    status: "selected_formula_scope",
    visibleReason:
      "floor single-leaf direct-airborne Rw can share the banded direct curve owner, but impact metrics remain separately blocked"
  },
  {
    basis: "element_lab",
    existingCompatibilityMetrics: [],
    id: "floor.single_leaf_impact.element_lab",
    noRuntimeValueMovement: true,
    ownedMetrics: [],
    requiredOwnerTerms: ["impact_metric_boundary_owner", "field_building_boundary_owner", "astm_rating_alias_boundary_owner"],
    route: "floor",
    selectedForFormulaCorridor: false,
    status: "blocked_boundary",
    visibleReason: "floor impact Ln,w/CI/DeltaLw cannot be inferred from an airborne mass-law TL curve"
  }
] as const satisfies readonly LayerCombinationResolverSingleLeafMassLawRouteAdmission[];

const RUNTIME_PROBE_EXPECTATIONS = [
  {
    currentBasisOrigin: "family_physics_prediction",
    currentCalculationStandard: "engine_mass_law",
    currentErrorBudgetDb: 5,
    currentFamily: "single_leaf_panel",
    currentMethod: "gate_o_single_leaf_massive_panel_sharp_single_leaf_panel_coincidence_delegate",
    currentRw: 31,
    currentStc: 31,
    id: "wall.gypsum_board_12_5_single_leaf",
    noRuntimeValueMovement: true
  },
  {
    currentBasisOrigin: "family_physics_prediction",
    currentCalculationStandard: "engine_mass_law",
    currentErrorBudgetDb: 5,
    currentFamily: "laminated_single_leaf",
    currentMethod: "gate_o_single_leaf_massive_panel_sharp_single_leaf_panel_coincidence_delegate",
    currentRw: 34,
    currentStc: 34,
    id: "wall.gypsum_board_25_laminated_single_leaf",
    noRuntimeValueMovement: true
  },
  {
    currentBasisOrigin: "family_physics_prediction",
    currentCalculationStandard: "engine_mass_law",
    currentErrorBudgetDb: 4,
    currentFamily: "rigid_massive_wall",
    currentMethod: "gate_o_single_leaf_massive_panel_ks_massive_wall_reference_curve_delegate",
    currentRw: 55,
    currentStc: 55,
    id: "wall.concrete_150_single_leaf",
    noRuntimeValueMovement: true
  }
] as const satisfies readonly LayerCombinationResolverSingleLeafMassLawRuntimeProbe[];

export function buildLayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract():
  LayerCombinationResolverSingleLeafMassLawBandedSolverOwnerContract {
  const v0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();
  const selectedGap = v0.rankedResearchOnlyGaps.find(
    (gap) => gap.id === "wall_floor_single_leaf_mass_law_banded_solver_owner" && gap.selected
  );

  if (!selectedGap) {
    throw new Error("Single-leaf mass-law banded solver owner requires the selected V0 research-only gap.");
  }

  return {
    blockedNextActions: [
      {
        id: "broad_source_crawl",
        reason:
          "not selected because this gate owns solver inputs first; sources may enter only as exact rows, anchors, or holdouts named by the formula corridor",
        selectedNow: false
      },
      {
        id: "floor_impact_from_airborne_mass_law",
        reason: "not selected because Ln,w/CI/DeltaLw require an impact curve owner, not an airborne TL curve",
        selectedNow: false
      },
      {
        id: "field_building_runtime_promotion",
        reason: "not selected because field/building outputs need direct, flanking, junction, and room-normalization owners",
        selectedNow: false
      },
      {
        id: "stc_from_rw_alias_promotion",
        reason: "not selected because the existing STC display is not a new Rw-to-STC alias owner",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_alias_runtime",
        reason: "not selected because ASTM/IIC/AIIC rating procedures require their own curve and contour owners",
        selectedNow: false
      },
      {
        id: "tolerance_retune_without_holdouts",
        reason: "not selected because no new measured residual set entered this no-runtime owner gate",
        selectedNow: false
      }
    ],
    landedGate: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerTerms: OWNER_TERMS,
    previousV0Rehearsal: {
      landedGate: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_LANDED_GATE,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTED_NEXT_FILE,
      selectionStatus: LAYER_COMBINATION_RESOLVER_COMPANY_INTERNAL_V0_REHEARSAL_SELECTION_STATUS
    },
    routeAdmissions: ROUTE_ADMISSIONS,
    runtimeProbeExpectations: RUNTIME_PROBE_EXPECTATIONS,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_LABEL,
    selectedV0GapId: "wall_floor_single_leaf_mass_law_banded_solver_owner",
    selectionStatus: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTION_STATUS,
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      blockedActionCount: 6,
      ownerTermCount: OWNER_TERMS.length,
      routeAdmissionCount: ROUTE_ADMISSIONS.length,
      runtimeProbeCount: RUNTIME_PROBE_EXPECTATIONS.length,
      selectedFormulaScopeCount: ROUTE_ADMISSIONS.filter((row) => row.selectedForFormulaCorridor).length,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_SOLVER_OWNER_SELECTED_NEXT_ACTION
    }
  };
}
