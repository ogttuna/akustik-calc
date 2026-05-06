import type { RequestedOutputId } from "@dynecho/shared";

import {
  evaluateGateTAllFamilyMaterialGapClosureReadiness,
  type GateTFamilyMaterialGapClosureReadiness,
  type GateTFamilyMaterialGapClosureScenarioId,
  type GateTFamilyMaterialGapClosureStatus
} from "./airborne-family-material-gap-closure";

export type GateUNextSolverOrCalibrationCandidateId =
  | "double_leaf_framed_calibration_holdout"
  | "field_building_prediction_context_solver"
  | "floor_impact_dynamic_stiffness_solver"
  | "lined_massive_masonry_clt_solver"
  | "single_leaf_massive_panel_calibration_holdout"
  | "triple_multicavity_generalized_solver";

export type GateUNextSafeMoveType =
  | "calibration_holdout_contract"
  | "field_building_context_contract"
  | "floor_impact_dynamic_stiffness_input_adapter_contract"
  | "generalized_multicavity_transfer_contract"
  | "lined_masonry_clt_boundary_contract";

export type GateUNextSolverOrCalibrationCandidate = {
  calibrationTighteningOnly: boolean;
  deferralReasons: readonly string[];
  id: GateUNextSolverOrCalibrationCandidateId;
  materialReadiness: {
    scenarioIds: readonly GateTFamilyMaterialGapClosureScenarioId[];
    statuses: readonly GateTFamilyMaterialGapClosureStatus[];
    status: GateTFamilyMaterialGapClosureStatus;
  };
  nextSafeMoveType: GateUNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  route: "floor" | "wall";
  runtimePromotionAllowedNow: false;
  scoring: {
    blockerPenalty: number;
    calibrationOnlyPenalty: number;
    coverageScore: number;
    deterministicOrder: number;
    materialReadinessScore: number;
    riskPenalty: number;
    score: number;
    sourceCatalogDriftPenalty: number;
  };
  selected: boolean;
  sourceRowsRequiredForNextMove: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  targetOutputs: readonly RequestedOutputId[];
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

export type GateUNextSolverOrCalibrationSelection = {
  candidateIds: readonly GateUNextSolverOrCalibrationCandidateId[];
  candidates: readonly GateUNextSolverOrCalibrationCandidate[];
  gateTMaterialGapClosureEvidence: readonly GateTFamilyMaterialGapClosureReadiness[];
  landedGate: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure";
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator";
  selectedCandidate: GateUNextSolverOrCalibrationCandidate;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts";
  selectionPolicy: readonly string[];
  selectionStatus: "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v";
};

type GateUScoringSeed = {
  blockerPenalty: number;
  calibrationTighteningOnly: boolean;
  coverageScore: number;
  deferralReasons: readonly string[];
  materialScenarioIds: readonly GateTFamilyMaterialGapClosureScenarioId[];
  nextSafeMoveType: GateUNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  riskPenalty: number;
  route: GateUNextSolverOrCalibrationCandidate["route"];
  sourceRowsRequiredForNextMove: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  targetOutputs: readonly RequestedOutputId[];
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

const GATE_U_CANDIDATE_IDS = [
  "floor_impact_dynamic_stiffness_solver",
  "field_building_prediction_context_solver",
  "triple_multicavity_generalized_solver",
  "lined_massive_masonry_clt_solver",
  "double_leaf_framed_calibration_holdout",
  "single_leaf_massive_panel_calibration_holdout"
] as const satisfies readonly GateUNextSolverOrCalibrationCandidateId[];

const MATERIAL_READINESS_SCORE: Record<GateTFamilyMaterialGapClosureStatus, number> = {
  complete: 4,
  complete_with_defaults: 2,
  needs_input: -8
};

const GATE_U_SCORING_SEEDS = {
  floor_impact_dynamic_stiffness_solver: {
    blockerPenalty: 2,
    calibrationTighteningOnly: false,
    coverageScore: 7,
    deferralReasons: [],
    materialScenarioIds: [
      "gate_t_floor_deck_screed_default_closure",
      "gate_t_limp_membrane_default_closure",
      "gate_t_resilient_impact_layer_default_closure"
    ],
    nextSafeMoveType: "floor_impact_dynamic_stiffness_input_adapter_contract",
    requiredOwnersBeforeRuntime: [
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ISO7172LnwAdapter",
      "fieldImpactContextBoundary",
      "ASTME989IICAdapterBoundary"
    ],
    riskPenalty: 2,
    route: "floor",
    sourceRowsRequiredForNextMove: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "IIC"],
    whyNextCandidate: [
      "floor_impact_is_a_first_order_personal_use_gap_after_wall_single_leaf_and_double_leaf_runtime_moves",
      "Gate_T_closed_the_resilient_layer_floor_deck_screed_and_limp_membrane_material_property_gaps",
      "dynamic_stiffness_is_the_right_physical_control_for_floating_floor_DeltaLw_instead_of_a_source_row_lookup",
      "the_next_safe_move_is_an_input_and_rating_adapter_contract_before_runtime_promotion"
    ],
    whyNotRuntimeYet: [
      "Ln_w_and_IIC_must_not_be_aliased",
      "field_impact_outputs_need_explicit_lab_or_field_basis_before_values_can_promote",
      "dynamic_stiffness_and_load_basis_need_positive_and_nearby_negative_contract_tests"
    ]
  },
  field_building_prediction_context_solver: {
    blockerPenalty: 4,
    calibrationTighteningOnly: false,
    coverageScore: 6,
    deferralReasons: [
      "field_and_building_outputs_are_core_but_need_room_area_RT60_and_flanking_context_before_value_ownership",
      "floor_lab_impact_basis_should_be_owned_before_extending_floor_values_to_field_impact_outputs"
    ],
    materialScenarioIds: [],
    nextSafeMoveType: "field_building_context_contract",
    requiredOwnersBeforeRuntime: [
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "labToFieldBasisDeltaOwner"
    ],
    riskPenalty: 4,
    route: "wall",
    sourceRowsRequiredForNextMove: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["R'w", "DnT,w", "Dn,w"],
    whyNextCandidate: [
      "R_prime_and_DnT_are_product_outputs",
      "field_context_can_reuse_element_predictions_only_when_basis_conversion_is_owned"
    ],
    whyNotRuntimeYet: [
      "lab_Rw_must_not_be_relabelled_as_R_prime_or_DnT",
      "room_and_flanking_context_inputs_are_still_the_first_owner_before_runtime_promotion"
    ]
  },
  triple_multicavity_generalized_solver: {
    blockerPenalty: 5,
    calibrationTighteningOnly: false,
    coverageScore: 5,
    deferralReasons: [
      "Gate_G_already_landed_a_narrow_grouped_two_cavity_runtime_move",
      "general_multicavity_transfer_or_impedance_network_scope_is_still_high_blast_radius"
    ],
    materialScenarioIds: [
      "gate_t_board_leaf_finish_default_closure",
      "gate_t_porous_absorber_default_closure",
      "gate_t_limp_membrane_default_closure"
    ],
    nextSafeMoveType: "generalized_multicavity_transfer_contract",
    requiredOwnersBeforeRuntime: [
      "generalGroupedLeafGraph",
      "limpMassPositionOwner",
      "multiCavityTransferOwner",
      "unsafeFlatListInternalLeafGuard"
    ],
    riskPenalty: 5,
    route: "wall",
    sourceRowsRequiredForNextMove: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "multicavity_walls_are_important_for_unbounded_layer_combinations",
      "Gate_T_closed_porous_and_limp_membrane_material_gaps_for_this_family"
    ],
    whyNotRuntimeYet: [
      "flat_list_internal_leaf_errors_can_create_large_value_drift",
      "general_transfer_matrix_contract_needs_more_boundaries_than_a_single_next_selection_gate"
    ]
  },
  lined_massive_masonry_clt_solver: {
    blockerPenalty: 4,
    calibrationTighteningOnly: false,
    coverageScore: 4,
    deferralReasons: [
      "lined_masonry_is_relevant_but_less_blocking_than_floor_impact_for_wall_floor_parity",
      "CLT_directional_properties_remain_outside_the_new_isotropic_material_defaults"
    ],
    materialScenarioIds: [
      "gate_t_masonry_core_finish_default_closure",
      "gate_t_board_leaf_finish_default_closure",
      "gate_t_porous_absorber_default_closure"
    ],
    nextSafeMoveType: "lined_masonry_clt_boundary_contract",
    requiredOwnersBeforeRuntime: [
      "coreMaterialClass",
      "liningCavityDepthMm",
      "liningAbsorptionClass",
      "cltDirectionalProperties"
    ],
    riskPenalty: 3,
    route: "wall",
    sourceRowsRequiredForNextMove: false,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "heavy_core_plus_lining_is_relevant_for_wall_coverage",
      "Gate_T_closed_many_masonry_and_finish_material_defaults"
    ],
    whyNotRuntimeYet: [
      "lined_masonry_and_CLT_need_family_boundary_tests_before runtime promotion",
      "CLT_orthotropy_cannot_be_inferred_from_generic_density_defaults"
    ]
  },
  double_leaf_framed_calibration_holdout: {
    blockerPenalty: 2,
    calibrationTighteningOnly: true,
    coverageScore: 2,
    deferralReasons: [
      "Gate_S_already_unlocked_the_source_absent_double_leaf_framed_runtime_lane",
      "calibration_tightens_error_budget_but_does_not_broaden_floor_or_wall_route_coverage"
    ],
    materialScenarioIds: [
      "gate_t_board_leaf_finish_default_closure",
      "gate_t_porous_absorber_default_closure"
    ],
    nextSafeMoveType: "calibration_holdout_contract",
    requiredOwnersBeforeRuntime: [
      "rightsSafeSourceRows",
      "topologyEquivalentHoldouts",
      "metricToleranceOwner",
      "negativeNearbyRows"
    ],
    riskPenalty: 1,
    route: "wall",
    sourceRowsRequiredForNextMove: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "Gate_S_error_budget_can_later_be_tightened_with_holdout_rows",
      "calibration_rows_are_useful_when_rights_safe_and_topology_owned"
    ],
    whyNotRuntimeYet: [
      "calibration_is_not_the_next_broadest_personal_use_gap",
      "source_rows_must_not_replace_the_floor_impact_solver_contract"
    ]
  },
  single_leaf_massive_panel_calibration_holdout: {
    blockerPenalty: 1,
    calibrationTighteningOnly: true,
    coverageScore: 1,
    deferralReasons: [
      "Gate_O_already_promoted_the_single_leaf_family_prediction_lane",
      "calibration_tightening_is_less_urgent_than_owning_floor_impact_inputs_and_adapters"
    ],
    materialScenarioIds: [
      "gate_t_board_leaf_finish_default_closure",
      "gate_t_masonry_core_finish_default_closure"
    ],
    nextSafeMoveType: "calibration_holdout_contract",
    requiredOwnersBeforeRuntime: [
      "rightsSafeSourceRows",
      "surfaceMassToleranceOwner",
      "coincidenceHoldoutRows",
      "negativeNearbyRows"
    ],
    riskPenalty: 1,
    route: "wall",
    sourceRowsRequiredForNextMove: true,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    whyNextCandidate: [
      "single_leaf_calibration_can_later_reduce_uncalibrated_error_budget",
      "source_holdouts_are_valuable_when_they_do_not_become_the_product"
    ],
    whyNotRuntimeYet: [
      "coverage_gain_is_small_because_Gate_O_already_landed_this_runtime_lane",
      "calibration_source_collection_should_not_preempt_floor_impact_algorithm_coverage"
    ]
  }
} as const satisfies Record<GateUNextSolverOrCalibrationCandidateId, GateUScoringSeed>;

function maxMaterialStatus(
  statuses: readonly GateTFamilyMaterialGapClosureStatus[]
): GateTFamilyMaterialGapClosureStatus {
  if (statuses.includes("needs_input")) {
    return "needs_input";
  }

  if (statuses.includes("complete_with_defaults")) {
    return "complete_with_defaults";
  }

  return "complete";
}

function lookupMaterialReadiness(
  evidence: readonly GateTFamilyMaterialGapClosureReadiness[],
  scenarioIds: readonly GateTFamilyMaterialGapClosureScenarioId[]
): GateUNextSolverOrCalibrationCandidate["materialReadiness"] {
  const statuses = scenarioIds.map((scenarioId) => {
    const readiness = evidence.find((entry) => entry.scenarioId === scenarioId);
    if (!readiness) {
      throw new Error(`Gate U could not find Gate T material readiness scenario: ${scenarioId}`);
    }

    return readiness.status;
  });

  return {
    scenarioIds,
    statuses,
    status: statuses.length > 0 ? maxMaterialStatus(statuses) : "complete"
  };
}

function scoreSeed(input: {
  seed: GateUScoringSeed;
  materialReadinessStatus: GateTFamilyMaterialGapClosureStatus;
}): GateUNextSolverOrCalibrationCandidate["scoring"] {
  const calibrationOnlyPenalty = input.seed.calibrationTighteningOnly ? 4 : 0;
  const sourceCatalogDriftPenalty = input.seed.sourceRowsRequiredForNextMove ? 3 : 0;
  const materialReadinessScore = MATERIAL_READINESS_SCORE[input.materialReadinessStatus];
  const score =
    input.seed.coverageScore +
    materialReadinessScore -
    input.seed.blockerPenalty -
    input.seed.riskPenalty -
    calibrationOnlyPenalty -
    sourceCatalogDriftPenalty;

  return {
    blockerPenalty: input.seed.blockerPenalty,
    calibrationOnlyPenalty,
    coverageScore: input.seed.coverageScore,
    deterministicOrder: 0,
    materialReadinessScore,
    riskPenalty: input.seed.riskPenalty,
    score,
    sourceCatalogDriftPenalty
  };
}

function buildCandidate(input: {
  deterministicOrder: number;
  evidence: readonly GateTFamilyMaterialGapClosureReadiness[];
  id: GateUNextSolverOrCalibrationCandidateId;
}): GateUNextSolverOrCalibrationCandidate {
  const seed = GATE_U_SCORING_SEEDS[input.id];
  const materialReadiness = lookupMaterialReadiness(input.evidence, seed.materialScenarioIds);
  const scoring = scoreSeed({ materialReadinessStatus: materialReadiness.status, seed });

  return {
    calibrationTighteningOnly: seed.calibrationTighteningOnly,
    deferralReasons: seed.deferralReasons,
    id: input.id,
    materialReadiness,
    nextSafeMoveType: seed.nextSafeMoveType,
    requiredOwnersBeforeRuntime: seed.requiredOwnersBeforeRuntime,
    route: seed.route,
    runtimePromotionAllowedNow: false,
    scoring: {
      ...scoring,
      deterministicOrder: input.deterministicOrder
    },
    selected: false,
    sourceRowsRequiredForNextMove: seed.sourceRowsRequiredForNextMove,
    sourceRowsRequiredForRuntimeSelection: seed.sourceRowsRequiredForRuntimeSelection,
    targetOutputs: seed.targetOutputs,
    whyNextCandidate: seed.whyNextCandidate,
    whyNotRuntimeYet: seed.whyNotRuntimeYet
  };
}

function selectCandidate(
  candidates: readonly GateUNextSolverOrCalibrationCandidate[]
): GateUNextSolverOrCalibrationCandidate {
  const [selected] = [...candidates].sort((left, right) => {
    const scoreDelta = right.scoring.score - left.scoring.score;
    return scoreDelta === 0
      ? left.scoring.deterministicOrder - right.scoring.deterministicOrder
      : scoreDelta;
  });

  if (!selected) {
    throw new Error("Gate U requires at least one solver or calibration candidate.");
  }

  return selected;
}

export function buildGateUNextSolverOrCalibrationSelection(): GateUNextSolverOrCalibrationSelection {
  const gateTMaterialGapClosureEvidence = evaluateGateTAllFamilyMaterialGapClosureReadiness();
  const candidatesWithoutSelection = GATE_U_CANDIDATE_IDS.map((id, index) =>
    buildCandidate({ deterministicOrder: index, evidence: gateTMaterialGapClosureEvidence, id })
  );
  const selected = selectCandidate(candidatesWithoutSelection);
  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate U next solver/calibration selection did not mark a selected candidate.");
  }

  return {
    candidateIds: candidates.map((candidate) => candidate.id),
    candidates,
    gateTMaterialGapClosureEvidence,
    landedGate: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure",
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_t_close_remaining_family_material_property_gaps_for_dynamic_calculator",
    selectedCandidate,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts",
    selectionPolicy: [
      "after Gate T, prefer the highest personal-use coverage gap whose required material properties are complete",
      "prefer a source-absent algorithm/input contract over collecting a finite catalog of measured rows",
      "keep calibration and exact-source rows as later override/holdout work when they tighten an already-owned solver",
      "do not promote Ln,w, L'n,w, L'nT,w, IIC, or AIIC until ISO 717-2 and ASTM E989 adapter boundaries are explicit"
    ],
    selectionStatus:
      "gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v"
  };
}
