import type { RequestedOutputId } from "@dynecho/shared";

export type GateXNextSolverOrFieldContextCandidateId =
  | "astm_impact_rating_adapter"
  | "double_leaf_framed_calibration_holdout"
  | "floor_impact_field_context_adapter"
  | "floor_impact_input_surfacing"
  | "triple_multicavity_generalized_solver"
  | "wall_field_building_context_adapter";

export type GateXNextSafeMoveType =
  | "astm_impact_rating_adapter_contract"
  | "calibration_holdout_contract"
  | "floor_impact_field_context_contract"
  | "floor_impact_input_surface_contract"
  | "generalized_multicavity_transfer_contract"
  | "wall_field_building_context_contract";

export type GateXNextSolverOrFieldContextCandidate = {
  calibrationTighteningOnly: boolean;
  deferralReasons: readonly string[];
  id: GateXNextSolverOrFieldContextCandidateId;
  nextSafeMoveType: GateXNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  route: "floor" | "wall";
  runtimePromotionAllowedNow: false;
  scoring: {
    basisAliasPenalty: number;
    blockerPenalty: number;
    continuityScore: number;
    coverageScore: number;
    deterministicOrder: number;
    riskPenalty: number;
    score: number;
    sourceCatalogDriftPenalty: number;
  };
  selected: boolean;
  sourceRowsRequiredForNextMove: boolean;
  sourceRowsRequiredForRuntimeSelection: false;
  targetOutputs: readonly RequestedOutputId[];
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

export type GateXNextSolverOrFieldContextSelection = {
  candidateIds: readonly GateXNextSolverOrFieldContextCandidateId[];
  candidates: readonly GateXNextSolverOrFieldContextCandidate[];
  gateWCompletionEvidence: {
    fieldAndAstmStillBlocked: readonly RequestedOutputId[];
    labImpactRuntimeBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate";
    promotedLabOutputs: readonly RequestedOutputId[];
    promotedPins: {
      DeltaLw: 24.3;
      LnW: 50.3;
    };
    runtimeValueMovementInGateX: false;
  };
  landedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary";
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator";
  selectedCandidate: GateXNextSolverOrFieldContextCandidate;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts";
  selectionPolicy: readonly string[];
  selectionStatus: "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y";
};

type GateXScoringSeed = {
  basisAliasPenalty: number;
  blockerPenalty: number;
  calibrationTighteningOnly: boolean;
  continuityScore: number;
  coverageScore: number;
  deferralReasons: readonly string[];
  nextSafeMoveType: GateXNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  riskPenalty: number;
  route: GateXNextSolverOrFieldContextCandidate["route"];
  sourceRowsRequiredForNextMove: boolean;
  targetOutputs: readonly RequestedOutputId[];
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

const GATE_X_CANDIDATE_IDS = [
  "floor_impact_field_context_adapter",
  "floor_impact_input_surfacing",
  "wall_field_building_context_adapter",
  "triple_multicavity_generalized_solver",
  "astm_impact_rating_adapter",
  "double_leaf_framed_calibration_holdout"
] as const satisfies readonly GateXNextSolverOrFieldContextCandidateId[];

const GATE_X_SCORING_SEEDS = {
  floor_impact_field_context_adapter: {
    basisAliasPenalty: 0,
    blockerPenalty: 3,
    calibrationTighteningOnly: false,
    continuityScore: 6,
    coverageScore: 8,
    deferralReasons: [],
    nextSafeMoveType: "floor_impact_field_context_contract",
    requiredOwnersBeforeRuntime: [
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "impactFieldContext",
      "flankingPathOrJunctionPolicy",
      "ISO7172FieldImpactAdapter"
    ],
    riskPenalty: 3,
    route: "floor",
    sourceRowsRequiredForNextMove: false,
    targetOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
    whyNextCandidate: [
      "Gate_W_promoted_the_lab_floor_impact_lane_but_kept_field_impact_outputs_blocked",
      "L_prime_n_w_and_L_prime_nT_w_are_core_personal_use_floor_outputs_after_Ln_w_exists",
      "the_next_safe_move_is_input_and_basis_ownership_not_runtime_value_movement",
      "field_context_prompts_are_more_user_visible_than_another_source_or_calibration_pass"
    ],
    whyNotRuntimeYet: [
      "lab_Ln_w_must_not_be_relabelled_as_field_L_prime_outputs",
      "room_volume_area_RT60_and_flanking_context_must_be_explicit_before_field_values_promote",
      "field_output_cards_and_reports_need_positive_and_nearby_negative_parity_tests"
    ]
  },
  floor_impact_input_surfacing: {
    basisAliasPenalty: 0,
    blockerPenalty: 4,
    calibrationTighteningOnly: false,
    continuityScore: 4,
    coverageScore: 6,
    deferralReasons: [
      "Gate_W_already_accepts_the_core_floorImpactContext_schema",
      "field_context_selection_should_define_the_next_missing_input set before UI surfacing broadens"
    ],
    nextSafeMoveType: "floor_impact_input_surface_contract",
    requiredOwnersBeforeRuntime: [
      "workbenchFloorImpactInputFields",
      "apiValidationCopy",
      "reportSnapshotParity",
      "manyLayerFloorRolePromptStability"
    ],
    riskPenalty: 3,
    route: "floor",
    sourceRowsRequiredForNextMove: false,
    targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
    whyNextCandidate: [
      "user_flow_needs_the_floor_impact_inputs_visible_in_the_dynamic_calculator",
      "field_context_missing_inputs_should_be_consistent_across_api_workbench_and_reports"
    ],
    whyNotRuntimeYet: [
      "UI_surfacing_without_field_adapter_ownership_can_expose_inputs_that_do_not_yet_promote_outputs",
      "this_is_a_follow_on_after_the_selected_field_context_contract"
    ]
  },
  wall_field_building_context_adapter: {
    basisAliasPenalty: 1,
    blockerPenalty: 5,
    calibrationTighteningOnly: false,
    continuityScore: 2,
    coverageScore: 7,
    deferralReasons: [
      "wall_field_outputs_are_core_but_have_existing_partial_airborne_context_paths",
      "floor_impact_field_outputs_are_the_direct_unblocked_continuation_of_Gate_W"
    ],
    nextSafeMoveType: "wall_field_building_context_contract",
    requiredOwnersBeforeRuntime: [
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "buildingPredictionBasisOwner"
    ],
    riskPenalty: 5,
    route: "wall",
    sourceRowsRequiredForNextMove: false,
    targetOutputs: ["R'w", "DnT,w", "Dn,w", "DnT,A"],
    whyNextCandidate: [
      "R_prime_and_DnT_are_core_product_outputs",
      "field_context_should_reuse_element_predictions_only_through_named_room_and_flanking_owners"
    ],
    whyNotRuntimeYet: [
      "this_is_broader_than_the_floor_impact_context_gap_uncovered_by_Gate_W",
      "lab_Rw_must_not_be_relabelled_as_field_or_building_prediction_outputs"
    ]
  },
  triple_multicavity_generalized_solver: {
    basisAliasPenalty: 0,
    blockerPenalty: 6,
    calibrationTighteningOnly: false,
    continuityScore: 1,
    coverageScore: 7,
    deferralReasons: [
      "multi_cavity_wall_coverage_is_high_value",
      "generalized_transfer_or_impedance_network_scope_has_larger_runtime_blast_radius_than_field_context_selection"
    ],
    nextSafeMoveType: "generalized_multicavity_transfer_contract",
    requiredOwnersBeforeRuntime: [
      "generalGroupedLeafGraph",
      "multiCavityTransferOwner",
      "limpMassPositionOwner",
      "unsafeFlatListInternalLeafGuard"
    ],
    riskPenalty: 6,
    route: "wall",
    sourceRowsRequiredForNextMove: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "multicavity_walls_remain_important_for_unbounded_layer_combinations",
      "Gate_G_proved_a_narrow_grouped_two_cavity_path"
    ],
    whyNotRuntimeYet: [
      "general_graph_and_transfer_model_needs_a_larger_scoping_contract",
      "flat_list_internal_leaf_errors_can_create_large_value_drift"
    ]
  },
  astm_impact_rating_adapter: {
    basisAliasPenalty: 4,
    blockerPenalty: 5,
    calibrationTighteningOnly: false,
    continuityScore: 3,
    coverageScore: 5,
    deferralReasons: [
      "IIC_and_AIIC_are_requested_outputs_but_must_not_be_derived_by_aliasing_ISO_Ln_w",
      "ASTM_adapter_should_follow_the_ISO_floor_field_boundary_so_basis_separation_is_locked_first"
    ],
    nextSafeMoveType: "astm_impact_rating_adapter_contract",
    requiredOwnersBeforeRuntime: [
      "ASTME989IICAdapterBoundary",
      "ASTME1007FieldBasisBoundary",
      "impactBandSpectrumOwner",
      "IICAIICVisibleUnsupportedParity"
    ],
    riskPenalty: 6,
    route: "floor",
    sourceRowsRequiredForNextMove: false,
    targetOutputs: ["IIC", "AIIC"],
    whyNextCandidate: [
      "US_style_impact_ratings_are_relevant_for_coverage",
      "Gate_W_kept_IIC_and_AIIC_explicitly_unsupported"
    ],
    whyNotRuntimeYet: [
      "ASTM_ratings_need_band_or_adapter_ownership_not_a_one_number_ISO_alias",
      "field_context_for_ISO_impact_outputs_should_be_selected_first"
    ]
  },
  double_leaf_framed_calibration_holdout: {
    basisAliasPenalty: 0,
    blockerPenalty: 2,
    calibrationTighteningOnly: true,
    continuityScore: 1,
    coverageScore: 3,
    deferralReasons: [
      "Gate_S_already_promoted_the_source_absent_double_leaf_framed_runtime_lane",
      "holdout_rows_tighten_error_budget_but_do_not_expand_floor_or_field_output_coverage"
    ],
    nextSafeMoveType: "calibration_holdout_contract",
    requiredOwnersBeforeRuntime: [
      "rightsSafeSourceRows",
      "topologyEquivalentHoldouts",
      "metricToleranceOwner",
      "negativeNearbyRows"
    ],
    riskPenalty: 2,
    route: "wall",
    sourceRowsRequiredForNextMove: true,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "calibration_rows_are_useful_when_they_tighten_an_owned_solver",
      "nearby_negative_rows_can_reduce_error_budget"
    ],
    whyNotRuntimeYet: [
      "calibration_is_not_the_next_broadest_personal_use_gap_after_Gate_W",
      "source_rows_must_not_replace_algorithm_and_context_ownership"
    ]
  }
} as const satisfies Record<GateXNextSolverOrFieldContextCandidateId, GateXScoringSeed>;

function scoreSeed(seed: GateXScoringSeed): GateXNextSolverOrFieldContextCandidate["scoring"] {
  const sourceCatalogDriftPenalty = seed.sourceRowsRequiredForNextMove ? 3 : 0;
  const score =
    seed.coverageScore +
    seed.continuityScore -
    seed.blockerPenalty -
    seed.riskPenalty -
    seed.basisAliasPenalty -
    sourceCatalogDriftPenalty;

  return {
    basisAliasPenalty: seed.basisAliasPenalty,
    blockerPenalty: seed.blockerPenalty,
    continuityScore: seed.continuityScore,
    coverageScore: seed.coverageScore,
    deterministicOrder: 0,
    riskPenalty: seed.riskPenalty,
    score,
    sourceCatalogDriftPenalty
  };
}

function buildCandidate(
  id: GateXNextSolverOrFieldContextCandidateId,
  deterministicOrder: number
): GateXNextSolverOrFieldContextCandidate {
  const seed = GATE_X_SCORING_SEEDS[id];
  const scoring = scoreSeed(seed);

  return {
    calibrationTighteningOnly: seed.calibrationTighteningOnly,
    deferralReasons: seed.deferralReasons,
    id,
    nextSafeMoveType: seed.nextSafeMoveType,
    requiredOwnersBeforeRuntime: seed.requiredOwnersBeforeRuntime,
    route: seed.route,
    runtimePromotionAllowedNow: false,
    scoring: {
      ...scoring,
      deterministicOrder
    },
    selected: false,
    sourceRowsRequiredForNextMove: seed.sourceRowsRequiredForNextMove,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: seed.targetOutputs,
    whyNextCandidate: seed.whyNextCandidate,
    whyNotRuntimeYet: seed.whyNotRuntimeYet
  };
}

function selectCandidate(
  candidates: readonly GateXNextSolverOrFieldContextCandidate[]
): GateXNextSolverOrFieldContextCandidate {
  const [selected] = [...candidates].sort((left, right) => {
    const scoreDelta = right.scoring.score - left.scoring.score;
    return scoreDelta === 0
      ? left.scoring.deterministicOrder - right.scoring.deterministicOrder
      : scoreDelta;
  });

  if (!selected) {
    throw new Error("Gate X requires at least one solver or field-context candidate.");
  }

  return selected;
}

export function buildGateXNextSolverOrFieldContextSelection(): GateXNextSolverOrFieldContextSelection {
  const candidatesWithoutSelection = GATE_X_CANDIDATE_IDS.map((id, index) =>
    buildCandidate(id, index)
  );
  const selected = selectCandidate(candidatesWithoutSelection);
  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate X next solver/field-context selection did not mark a selected candidate.");
  }

  return {
    candidateIds: candidates.map((candidate) => candidate.id),
    candidates,
    gateWCompletionEvidence: {
      fieldAndAstmStillBlocked: ["L'n,w", "L'nT,w", "IIC", "AIIC"],
      labImpactRuntimeBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      promotedLabOutputs: ["Ln,w", "DeltaLw"],
      promotedPins: {
        DeltaLw: 24.3,
        LnW: 50.3
      },
      runtimeValueMovementInGateX: false
    },
    landedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
    selectedCandidate,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts",
    selectionPolicy: [
      "after Gate W, continue the floor-impact lane by owning field-context inputs before any field runtime value movement",
      "prefer source-absent adapter and input ownership over collecting a finite catalog of measured rows",
      "keep exact rows and calibration rows as later anchors or overrides when topology and metric basis truly match",
      "do not promote L'n,w, L'nT,w, IIC, or AIIC by relabelling the ISO 717-2 lab Ln,w result"
    ],
    selectionStatus:
      "gate_x_next_solver_or_field_context_selection_landed_no_runtime_selected_floor_impact_field_context_gate_y"
  };
}
