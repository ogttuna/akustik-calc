import { BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD } from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";
import { HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS } from "./helper-only-timber-open-web-impact-stack-estimate";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB,
  LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";
import { OPEN_WEB_DIRECT_FIXED_LINING_BASIS } from "./lightweight-steel-open-web-direct-fixed-lining-estimate";
import { OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS } from "./lightweight-steel-open-web-supported-band-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

export const LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE =
  "layer_combination_resolver_registry_plan";

export const LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS =
  "layer_combination_resolver_registry_landed_no_runtime_selected_runtime_candidate_adapter";

export const LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION =
  "layer_combination_resolver_runtime_candidate_adapter_plan";

export const LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE =
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts";

export const LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_LABEL =
  "layer combination resolver runtime candidate adapter";

export type LayerCombinationResolverRoute = "floor" | "wall";

export type LayerCombinationResolverBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";

export type LayerCombinationResolverMetricId =
  | "AIIC"
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "DeltaLw"
  | "DnT,w"
  | "IIC"
  | "L'n,w"
  | "L'nT,w"
  | "L'nT,50"
  | "Ln,w"
  | "Ln,w+CI"
  | "R'w"
  | "Rw"
  | "STC";

export type LayerCombinationResolverCandidateKind =
  | "basis_boundary"
  | "calibrated_family_solver"
  | "exact_measured_override"
  | "field_building_adapter"
  | "needs_input_boundary"
  | "similarity_anchor"
  | "source_absent_family_solver"
  | "unsupported_boundary";

export type LayerCombinationResolverRuntimeSelectionState =
  | "active_runtime_existing"
  | "blocked_boundary_existing"
  | "declaration_only_no_runtime_movement";

export type LayerCombinationResolverCandidateDeclaration = {
  readonly basis: LayerCombinationResolverBasis;
  readonly errorBudgetTerms: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly notMeasuredEvidence: boolean;
    readonly toleranceDb: number;
  }[];
  readonly exactPrecedenceRules: readonly string[];
  readonly formulaTerms: readonly string[];
  readonly hardCompatibilityGates: readonly string[];
  readonly hostileInputCases: readonly string[];
  readonly id: string;
  readonly kind: LayerCombinationResolverCandidateKind;
  readonly label: string;
  readonly ownedRuntimeBasisId: string | null;
  readonly priorityRank: number;
  readonly rejectedMetricAliases: readonly string[];
  readonly requiredInputs: readonly string[];
  readonly route: LayerCombinationResolverRoute;
  readonly runtimeSelectionState: LayerCombinationResolverRuntimeSelectionState;
  readonly similarityAnchorRules: readonly string[];
  readonly supportedMetrics: readonly LayerCombinationResolverMetricId[];
  readonly surfaceRequirements: readonly string[];
  readonly valuePins: readonly {
    readonly metric: LayerCombinationResolverMetricId;
    readonly value: number;
  }[];
};

export type LayerCombinationResolverOrderEntry = {
  readonly kind: LayerCombinationResolverCandidateKind;
  readonly rank: number;
  readonly rule: string;
};

export type LayerCombinationResolverRegistryContract = {
  readonly blockedNextActions: readonly {
    readonly id:
      | "astm_iic_aiic_alias_runtime"
      | "broad_source_crawl"
      | "building_prediction_runtime"
      | "new_narrow_family_lane"
      | "tolerance_retune";
    readonly reason: string;
    readonly selectedNow: false;
  }[];
  readonly candidateDeclarations: readonly LayerCombinationResolverCandidateDeclaration[];
  readonly landedGate: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly previousPostHelperOnlyRevalidation: {
    readonly landedGate: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan";
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE;
    readonly selectedNextFile: "packages/engine/src/layer-combination-resolver-registry-contract.test.ts";
    readonly selectionStatus: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry";
  };
  readonly registryVersion: "2026-05-21.layer-combination-resolver.v1";
  readonly resolverOrder: readonly LayerCombinationResolverOrderEntry[];
  readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS;
  readonly sourceRowsAreEvidenceNotProduct: true;
  readonly summary: {
    readonly activeRuntimeCandidateCount: number;
    readonly basisCount: Record<LayerCombinationResolverBasis, number>;
    readonly candidateCount: number;
    readonly kindCount: Record<LayerCombinationResolverCandidateKind, number>;
    readonly routeCount: Record<LayerCombinationResolverRoute, number>;
    readonly selectedNextAction: typeof LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION;
  };
};

const ELEMENT_LAB_SURFACES = [
  "route_card",
  "output_cards",
  "dynamic_trace",
  "confidence_provenance",
  "calculator_api",
  "impact_only_api",
  "markdown_report"
] as const;

const FIELD_SURFACES = [
  "field_context_panel",
  "route_card",
  "output_cards",
  "method_dossier",
  "calculator_api",
  "impact_only_api",
  "markdown_report"
] as const;

const REQUIRED_ALIAS_REJECTIONS = [
  "lab_to_field_alias",
  "field_to_building_alias",
  "iso_to_astm_iic_alias",
  "rw_to_stc_alias",
  "lnw_to_iic_alias"
] as const;

const RESOLVER_ORDER = [
  {
    kind: "exact_measured_override",
    rank: 0,
    rule: "same route, same topology, same metric, and same basis exact rows win before every predicted candidate"
  },
  {
    kind: "similarity_anchor",
    rank: 1,
    rule: "nearby measured rows can anchor only after route, support family, topology, metric basis, and owned physical deltas pass"
  },
  {
    kind: "calibrated_family_solver",
    rank: 2,
    rule: "calibrated family solvers outrank source-absent formulas when their calibration family and basis match"
  },
  {
    kind: "source_absent_family_solver",
    rank: 3,
    rule: "source-absent family solvers are allowed only with explicit required inputs, formula terms, and not-measured budgets"
  },
  {
    kind: "field_building_adapter",
    rank: 4,
    rule: "field and building outputs require explicit room, normalization, junction, or flanking owners and never inherit lab values by alias"
  },
  {
    kind: "needs_input_boundary",
    rank: 5,
    rule: "missing physical owners return named needs-input fields instead of guessing"
  },
  {
    kind: "basis_boundary",
    rank: 6,
    rule: "basis mismatches are visible blockers so lab, field, building, and rating outputs do not leak into each other"
  },
  {
    kind: "unsupported_boundary",
    rank: 7,
    rule: "unsupported outputs remain value-less until a named owner and rating or calculation procedure exists"
  }
] as const satisfies readonly LayerCombinationResolverOrderEntry[];

const CANDIDATE_DECLARATIONS = [
  {
    basis: "element_lab",
    errorBudgetTerms: [],
    exactPrecedenceRules: [
      "same_topology_same_metric_same_basis_rank_zero",
      "measured_row_preserves_source_metric_scope",
      "predicted_candidates_remain_rejected_when_exact_row_matches"
    ],
    formulaTerms: [],
    hardCompatibilityGates: [
      "same_route",
      "same_metric_basis",
      "same_support_family",
      "same_layer_roles",
      "same_lab_or_field_basis"
    ],
    hostileInputCases: ["duplicates_require_same_role_merge", "unsafe_reorder_breaks_exact_match"],
    id: "floor.exact_measured_floor_system.same_topology_metric_basis",
    kind: "exact_measured_override",
    label: "Floor exact measured same-topology override",
    ownedRuntimeBasisId: "open_measured_floor_system_exact_match",
    priorityRank: 0,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["route", "layerFingerprint", "metricBasis", "sourceAssemblyId", "explicitLayerRoles"],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["not_applicable_exact_rank_zero"],
    supportedMetrics: ["Rw", "R'w", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "CI", "CI,50-2500"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: []
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [],
    exactPrecedenceRules: [
      "verified_wall_source_same_leaf_schedule_rank_zero",
      "do_not_blend_exact_rw_with_screening_fallback"
    ],
    formulaTerms: [],
    hardCompatibilityGates: [
      "same_route",
      "same_leaf_count",
      "same_cavity_count",
      "same_metric_basis",
      "same_opening_or_leak_state"
    ],
    hostileInputCases: ["flat_multicavity_input_requires_grouping", "duplicate_leaf_groups_require_needs_input"],
    id: "wall.exact_verified_airborne.same_leaf_schedule",
    kind: "exact_measured_override",
    label: "Wall exact verified airborne override",
    ownedRuntimeBasisId: "verified_airborne_exact_source",
    priorityRank: 0,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["route", "leafGrouping", "cavityGrouping", "metricBasis", "sourceAssemblyId"],
    route: "wall",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["not_applicable_exact_rank_zero"],
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: []
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 6 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 7 },
      { metric: "CI,50-2500", notMeasuredEvidence: true, toleranceDb: 2.5 }
    ],
    exactPrecedenceRules: ["exact_tuas_package_rows_win_before_package_transfer_formula"],
    formulaTerms: [
      "same_family_open_box_timber_package_delta",
      "finish_package_mass_delta",
      "resilient_layer_dynamic_stiffness_bucket",
      "lower_treatment_compatibility_gate"
    ],
    hardCompatibilityGates: [
      "floor_route",
      "open_box_timber_support",
      "complete_upper_package",
      "element_lab_metric_basis",
      "not_raw_bare"
    ],
    hostileInputCases: ["partial_upper_package_needs_input", "wrong_support_family_rejected"],
    id: "floor.open_box_timber.package_transfer_similarity",
    kind: "similarity_anchor",
    label: "Open-box timber package-transfer similarity",
    ownedRuntimeBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
    priorityRank: 1,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: [
      "supportFamily",
      "carrierDepthMm",
      "finishPackage",
      "floatingScreed",
      "resilientLayer",
      "lowerTreatmentState"
    ],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: [
      "same_support_family_required",
      "same_metric_basis_required",
      "owned_package_delta_terms_only"
    ],
    supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 66 },
      { metric: "Ln,w", value: 50.8 },
      { metric: "CI,50-2500", value: 3.3 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 4 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 4.5 }
    ],
    exactPrecedenceRules: ["exact_ubiq_inex_firestop_rows_win_before_supported_band_similarity"],
    formulaTerms: [
      "supported_band_package_anchor",
      "inex_deck_mass_bucket",
      "suspension_support_class",
      "absorber_depth_density_bucket"
    ],
    hardCompatibilityGates: [
      "floor_route",
      "open_web_steel_support",
      "complete_supported_band_package",
      "element_lab_metric_basis",
      "not_raw_bare"
    ],
    hostileInputCases: ["deck_only_package_rejected", "lower_only_partial_package_rejected"],
    id: "floor.open_web.supported_band_similarity",
    kind: "similarity_anchor",
    label: "Open-web steel supported-band similarity",
    ownedRuntimeBasisId: OPEN_WEB_SUPPORTED_BAND_SIMILARITY_BASIS,
    priorityRank: 1,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: [
      "supportFamily",
      "inexDeckLayer",
      "ceilingBoardMass",
      "absorberThicknessDensity",
      "supportBandClass"
    ],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: [
      "same_support_family_required",
      "same_package_topology_required",
      "field_outputs_require_separate_adapter"
    ],
    supportedMetrics: ["Rw", "Ln,w", "CI", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 61.5 },
      { metric: "Ln,w", value: 61.5 },
      { metric: "CI", value: -1.5 },
      { metric: "Ln,w+CI", value: 60 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [{ metric: "Rw", notMeasuredEvidence: false, toleranceDb: 4 }],
    exactPrecedenceRules: ["same_assembly_exact_wall_source_wins_before_calibrated_solver"],
    formulaTerms: [
      "leaf_mass_law_terms",
      "mass_air_mass_resonance",
      "cavity_absorption_correction",
      "calibrated_triple_leaf_residual"
    ],
    hardCompatibilityGates: [
      "wall_route",
      "explicit_leaf_groups",
      "two_cavity_or_triple_leaf_topology",
      "element_lab_metric_basis"
    ],
    hostileInputCases: ["flat_layer_list_requires_grouping", "duplicate_or_partial_leaf_groups_needs_input"],
    id: "wall.multileaf_triple_leaf.calibrated_family_solver",
    kind: "calibrated_family_solver",
    label: "Wall multileaf triple-leaf calibrated solver",
    ownedRuntimeBasisId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
    priorityRank: 2,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["leafGrouping", "cavityDepths", "leafSurfaceMasses", "absorberState", "metricBasis"],
    route: "wall",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["calibration_rows_define_residual_budget_not_exact_override"],
    supportedMetrics: ["Rw", "C", "Ctr"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: []
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      {
        metric: "Rw",
        notMeasuredEvidence: true,
        toleranceDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB
      },
      {
        metric: "STC",
        notMeasuredEvidence: true,
        toleranceDb: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_ERROR_BUDGET_DB
      }
    ],
    exactPrecedenceRules: [
      "verified_exact_single_leaf_rows_win_before_source_absent_mass_law_formula",
      "same_stack_source_rows_stay_rank_zero_when_rights_safe_evidence_exists"
    ],
    formulaTerms: [
      "surface_mass_input_normalization",
      "one_third_octave_mass_law_transmission_loss_curve",
      "stiffness_and_coincidence_delegate_selection",
      "iso_717_1_airborne_rating_adapter",
      "source_absent_design_budget"
    ],
    hardCompatibilityGates: [
      "wall_or_floor_direct_airborne_route",
      "single_visible_leaf",
      "zero_cavity_layers",
      "zero_framed_support_layers",
      "zero_porous_fill_layers",
      "element_lab_metric_basis",
      "not_floor_impact_not_field_not_building_not_astm_rating"
    ],
    hostileInputCases: [
      "duplicate_safe_laminated_single_leaf_merges_by_surface_mass",
      "split_or_reordered_layers_with_cavity_or_frame_support_rejected",
      "mass_timber_clt_family_rejected_until_separate_owner_exists",
      "many_layer_roleless_stack_requires_single_leaf_topology_guard"
    ],
    id: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    kind: "source_absent_family_solver",
    label: "Single-leaf mass-law banded source-absent solver",
    ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: [
      "route",
      "visibleLeafCount",
      "cavityCount",
      "supportLayerCount",
      "porousLayerCount",
      "densityKgM3",
      "surfaceMassKgM2",
      "thicknessMm",
      "stiffnessCoincidenceFamily",
      "oneThirdOctaveTransmissionLossCurve",
      "iso717AirborneRatingAdapter"
    ],
    route: "wall",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: [
      "exact_or_calibrated_rows_may_calibrate_later_but_are_not_required_for_source_absent_runtime",
      "floor_direct_airborne_uses_same_candidate_id_only_when_no_impact_metric_is_requested"
    ],
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 31 },
      { metric: "STC", value: 31 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 8 },
      { metric: "C", notMeasuredEvidence: true, toleranceDb: 2.5 },
      { metric: "Ctr", notMeasuredEvidence: true, toleranceDb: 4.5 },
      { metric: "STC", notMeasuredEvidence: true, toleranceDb: 8 }
    ],
    exactPrecedenceRules: [
      "verified_exact_double_leaf_framed_rows_win_before_source_absent_formula",
      "same_stack_source_rows_stay_rank_zero_when_rights_safe_topology_metric_evidence_exists"
    ],
    formulaTerms: [
      "side_leaf_surface_mass_partition",
      "mass_air_mass_resonance",
      "bridge_coupling_class",
      "porous_absorber_damping",
      "one_third_octave_double_leaf_tl_curve",
      "iso_717_1_airborne_rating_adapter",
      "stc_existing_display_boundary"
    ],
    hardCompatibilityGates: [
      "wall_route",
      "double_leaf_framed_topology",
      "single_primary_cavity",
      "non_direct_fixed_bridge_class",
      "complete_resilient_side_count_when_resilient_bridge",
      "element_lab_metric_basis",
      "not_floor_impact_not_field_not_building_not_astm_rating"
    ],
    hostileInputCases: [
      "grouped_triple_leaf_and_flat_multicavity_rejected_to_separate_owners",
      "duplicate_or_overlapping_leaf_groups_need_input",
      "unsafe_reorder_rejected",
      "direct_fixed_double_leaf_rejected_until_separate_owner_exists"
    ],
    id: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    kind: "source_absent_family_solver",
    label: "Double-leaf framed wall banded source-absent solver",
    ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: [
      "route=wall",
      "topologyMode=double_leaf_framed",
      "sideALeafMassKgM2",
      "sideBLeafMassKgM2",
      "cavity1DepthMm",
      "bridgeClass",
      "supportSpacingMm",
      "absorberFlowResistivityOrDefault",
      "resilientBarSideCountWhenResilient",
      "oneThirdOctaveTransmissionLossCurve",
      "iso717AirborneRatingAdapter"
    ],
    route: "wall",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: [
      "exact_or_calibrated_rows_may_calibrate_later_but_are_not_required_for_source_absent_runtime",
      "field_building_and_astm_requests_require_separate_basis_adapters_before_reuse"
    ],
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 45 },
      { metric: "STC", value: 45 },
      { metric: "C", value: -1 },
      { metric: "Ctr", value: -6.1 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 8 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 10 }
    ],
    exactPrecedenceRules: ["exact_tuas_package_rows_and_package_transfer_rows_win_before_raw_bare_formula"],
    formulaTerms: [
      "open_box_timber_carrier_depth",
      "bare_panel_mass_mobility",
      "no_finish_package",
      "iso_717_single_number_adapter"
    ],
    hardCompatibilityGates: ["floor_route", "open_box_timber_support", "raw_bare_only", "element_lab_metric_basis"],
    hostileInputCases: ["roleless_raw_probe_rejected", "upper_only_or_lower_only_package_rejected"],
    id: "floor.open_box_timber.raw_bare_source_absent",
    kind: "source_absent_family_solver",
    label: "Open-box timber raw-bare source-absent solver",
    ownedRuntimeBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["supportFamily", "carrierDepthMm", "finishAbsence", "lowerTreatmentAbsence"],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["not_similarity_anchored_until_raw_bare_holdouts_exist"],
    supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 42.3 },
      { metric: "Ln,w", value: 88.2 },
      { metric: "CI,50-2500", value: 3.1 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 9 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 12 }
    ],
    exactPrecedenceRules: ["ubiq_inex_firestop_package_rows_win_before_raw_bare_open_web_formula"],
    formulaTerms: [
      "open_web_steel_carrier_depth",
      "bare_steel_reference_surface",
      "structural_mobility_bucket",
      "iso_717_impact_adapter_boundary"
    ],
    hardCompatibilityGates: ["floor_route", "open_web_steel_support", "raw_bare_only", "element_lab_metric_basis"],
    hostileInputCases: ["deck_only_input_rejected", "partial_package_input_rejected"],
    id: "floor.open_web.raw_bare_source_absent",
    kind: "source_absent_family_solver",
    label: "Open-web steel raw-bare source-absent solver",
    ownedRuntimeBasisId: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["supportFamily", "carrierDepthMm", "deckAbsence", "packageAbsence"],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["ubiq_package_rows_are_not_raw_bare_similarity_anchors"],
    supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 32 },
      { metric: "Ln,w", value: 96 },
      { metric: "CI,50-2500", value: 5.2 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 9 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 10 }
    ],
    exactPrecedenceRules: ["exact_package_raw_bare_direct_fixed_and_supported_band_lanes_win_before_helper_only"],
    formulaTerms: [
      "base_support_family",
      "carrier_geometry",
      "lower_ceiling_board_mass",
      "cavity_depth",
      "absorber_thickness_density",
      "suspension_or_support_class"
    ],
    hardCompatibilityGates: [
      "floor_route",
      "helper_only_lower_treatment",
      "explicit_floor_roles",
      "complete_lower_board_and_absorber",
      "element_lab_metric_basis"
    ],
    hostileInputCases: ["roleless_stack_rejected", "missing_board_needs_input", "partial_upper_package_rejected"],
    id: "floor.helper_only_timber_open_web.source_absent",
    kind: "source_absent_family_solver",
    label: "Helper-only timber/open-web source-absent solver",
    ownedRuntimeBasisId: HELPER_ONLY_TIMBER_OPEN_WEB_IMPACT_STACK_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: [
      "baseSupportFamily",
      "carrierGeometry",
      "lowerCeilingBoardMass",
      "cavityDepth",
      "absorberThicknessDensity",
      "suspensionSupportClass",
      "packageAbsence"
    ],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["measured_helper_only_holdouts_can_calibrate_later_but_are_not_required_for_runtime"],
    supportedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 46.7 },
      { metric: "Ln,w", value: 59.6 },
      { metric: "CI,50-2500", value: 4 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [
      { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 4 },
      { metric: "Ln,w", notMeasuredEvidence: true, toleranceDb: 5 }
    ],
    exactPrecedenceRules: ["exact_direct_fixed_ubiq_rows_win_before_direct_fixed_formula"],
    formulaTerms: ["direct_fixed_ceiling_board_mass", "inex_deck_mass", "open_web_depth", "firestop_board_count"],
    hardCompatibilityGates: [
      "floor_route",
      "open_web_steel_support",
      "direct_fixed_lining",
      "complete_inex_or_firestop_package",
      "element_lab_metric_basis"
    ],
    hostileInputCases: ["suspended_ceiling_not_direct_fixed", "supported_band_package_rejected"],
    id: "floor.open_web.direct_fixed_lining.source_absent",
    kind: "source_absent_family_solver",
    label: "Open-web steel direct-fixed lining solver",
    ownedRuntimeBasisId: OPEN_WEB_DIRECT_FIXED_LINING_BASIS,
    priorityRank: 3,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["supportFamily", "directFixedBoardMass", "deckPackage", "carrierDepthMm"],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["direct_fixed_rows_do_not_anchor_suspended_or_helper_only_lower_treatments"],
    supportedMetrics: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    surfaceRequirements: ELEMENT_LAB_SURFACES,
    valuePins: [
      { metric: "Rw", value: 52 },
      { metric: "Ln,w", value: 77 },
      { metric: "CI", value: -0.5 }
    ]
  },
  {
    basis: "field_apparent",
    errorBudgetTerms: [{ metric: "L'nT,w", notMeasuredEvidence: true, toleranceDb: 3 }],
    exactPrecedenceRules: ["exact_field_continuation_rows_win_before_any_field_adapter"],
    formulaTerms: [
      "field_k_correction",
      "receiving_room_volume_normalization",
      "rt60_normalization",
      "lab_anchor_basis_guard"
    ],
    hardCompatibilityGates: [
      "field_context_present",
      "owned_lab_anchor",
      "same_support_family",
      "no_raw_bare_field_transfer",
      "no_building_prediction_transfer"
    ],
    hostileInputCases: ["partial_field_context_needs_input", "raw_bare_lab_impact_field_transfer_blocked"],
    id: "floor.open_web.field_building_adapter.exact_anchor_continuation",
    kind: "field_building_adapter",
    label: "Open-web field/building adapter with exact anchors",
    ownedRuntimeBasisId: "source_absent_field_building_adapter_error_budget",
    priorityRank: 4,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["impactFieldContext", "receivingRoomVolumeM3", "fieldKDb", "ownedLabAnchor"],
    route: "floor",
    runtimeSelectionState: "active_runtime_existing",
    similarityAnchorRules: ["field_values_stay_tied_to_exact_or_direct_fixed_supported_band_lab_anchor"],
    supportedMetrics: ["R'w", "DnT,w", "L'n,w", "L'nT,w", "L'nT,50"],
    surfaceRequirements: FIELD_SURFACES,
    valuePins: [
      { metric: "R'w", value: 77 },
      { metric: "DnT,w", value: 80 },
      { metric: "L'nT,w", value: 70.6 }
    ]
  },
  {
    basis: "element_lab",
    errorBudgetTerms: [],
    exactPrecedenceRules: ["not_a_value_candidate"],
    formulaTerms: [],
    hardCompatibilityGates: ["missing_required_inputs_short_circuit_before_formula"],
    hostileInputCases: ["missing_board", "missing_cavity", "missing_absorber", "flat_roleless_stack"],
    id: "generic.required_input_owner.needs_input_boundary",
    kind: "needs_input_boundary",
    label: "Named missing-input boundary",
    ownedRuntimeBasisId: null,
    priorityRank: 5,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["missingPhysicalInputIds", "inputSurfaceOwner", "messageSurfaceOwner"],
    route: "floor",
    runtimeSelectionState: "blocked_boundary_existing",
    similarityAnchorRules: ["similarity_is_not_attempted_until_required_inputs_exist"],
    supportedMetrics: [],
    surfaceRequirements: ["route_card", "input_panel", "calculator_api", "markdown_report"],
    valuePins: []
  },
  {
    basis: "building_prediction",
    errorBudgetTerms: [],
    exactPrecedenceRules: ["not_a_value_candidate"],
    formulaTerms: [],
    hardCompatibilityGates: [
      "building_prediction_requires_flanking_owner",
      "junction_context_required",
      "no_lab_to_building_alias"
    ],
    hostileInputCases: ["complete_looking_room_context_without_flanking_owner_remains_blocked"],
    id: "generic.lab_field_building_basis_boundary",
    kind: "basis_boundary",
    label: "Lab/field/building basis boundary",
    ownedRuntimeBasisId: null,
    priorityRank: 6,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["basisOwner", "flankingContext", "junctionCoupling", "roomNormalization"],
    route: "floor",
    runtimeSelectionState: "blocked_boundary_existing",
    similarityAnchorRules: ["field_or_building_similarity_requires_same_basis_and_owned_context"],
    supportedMetrics: [],
    surfaceRequirements: ["route_card", "method_dossier", "calculator_api", "markdown_report"],
    valuePins: []
  },
  {
    basis: "astm_rating_boundary",
    errorBudgetTerms: [],
    exactPrecedenceRules: ["not_a_value_candidate"],
    formulaTerms: [],
    hardCompatibilityGates: ["astm_rating_procedure_owner_required", "no_iso_to_astm_alias"],
    hostileInputCases: ["iic_or_aiic_request_with_only_iso_lnw_remains_unsupported"],
    id: "generic.astm_iic_aiic.unsupported_boundary",
    kind: "unsupported_boundary",
    label: "ASTM IIC/AIIC unsupported boundary",
    ownedRuntimeBasisId: null,
    priorityRank: 7,
    rejectedMetricAliases: REQUIRED_ALIAS_REJECTIONS,
    requiredInputs: ["astmRatingCurveOwner", "astmReferenceContour", "testStandardBasis"],
    route: "floor",
    runtimeSelectionState: "blocked_boundary_existing",
    similarityAnchorRules: ["iso_ln_w_ci_rows_are_not_astm_similarity_anchors"],
    supportedMetrics: [],
    surfaceRequirements: ["route_card", "calculator_api", "impact_only_api", "markdown_report"],
    valuePins: []
  }
] as const satisfies readonly LayerCombinationResolverCandidateDeclaration[];

function countBy<T extends string>(values: readonly T[], allValues: readonly T[]): Record<T, number> {
  return Object.fromEntries(allValues.map((value) => [value, values.filter((candidate) => candidate === value).length])) as Record<
    T,
    number
  >;
}

export function buildLayerCombinationResolverRegistryContract(): LayerCombinationResolverRegistryContract {
  return {
    blockedNextActions: [
      {
        id: "new_narrow_family_lane",
        reason:
          "not selected because the registry should be adapted into the runtime candidate trace before another narrow solver lane is widened",
        selectedNow: false
      },
      {
        id: "broad_source_crawl",
        reason:
          "not selected because exact rows are evidence and holdouts; they are not a replacement for the shared calculator resolver",
        selectedNow: false
      },
      {
        id: "building_prediction_runtime",
        reason:
          "not selected because building prediction still needs direct, flanking, junction, and room-normalization owners",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_alias_runtime",
        reason:
          "not selected because ISO Ln,w/CI outputs still cannot become ASTM IIC/AIIC without a named rating procedure",
        selectedNow: false
      },
      {
        id: "tolerance_retune",
        reason:
          "not selected because no new measured holdout residuals entered this no-runtime registry gate",
        selectedNow: false
      }
    ],
    candidateDeclarations: CANDIDATE_DECLARATIONS,
    landedGate: LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
    noRuntimeValueMovement: true,
    previousPostHelperOnlyRevalidation: {
      landedGate: "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_plan",
      selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_LANDED_GATE,
      selectedNextFile: "packages/engine/src/layer-combination-resolver-registry-contract.test.ts",
      selectionStatus:
        "broad_accuracy_post_helper_only_timber_open_web_impact_stack_coverage_revalidation_landed_no_runtime_selected_layer_combination_resolver_registry"
    },
    registryVersion: "2026-05-21.layer-combination-resolver.v1",
    resolverOrder: RESOLVER_ORDER,
    selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION,
    selectedNextFile: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_FILE,
    selectedNextLabel: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_LABEL,
    selectionStatus: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTION_STATUS,
    sourceRowsAreEvidenceNotProduct: true,
    summary: {
      activeRuntimeCandidateCount: CANDIDATE_DECLARATIONS.filter(
        (candidate) => candidate.runtimeSelectionState === "active_runtime_existing"
      ).length,
      basisCount: countBy(
        CANDIDATE_DECLARATIONS.map((candidate) => candidate.basis),
        ["astm_rating_boundary", "building_prediction", "element_lab", "field_apparent"]
      ),
      candidateCount: CANDIDATE_DECLARATIONS.length,
      kindCount: countBy(
        CANDIDATE_DECLARATIONS.map((candidate) => candidate.kind),
        [
          "basis_boundary",
          "calibrated_family_solver",
          "exact_measured_override",
          "field_building_adapter",
          "needs_input_boundary",
          "similarity_anchor",
          "source_absent_family_solver",
          "unsupported_boundary"
        ]
      ),
      routeCount: countBy(
        CANDIDATE_DECLARATIONS.map((candidate) => candidate.route),
        ["floor", "wall"]
      ),
      selectedNextAction: LAYER_COMBINATION_RESOLVER_REGISTRY_SELECTED_NEXT_ACTION
    }
  };
}
