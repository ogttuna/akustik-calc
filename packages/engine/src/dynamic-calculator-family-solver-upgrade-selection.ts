import type {
  AcousticInputFieldId,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  RequestedOutputId
} from "@dynecho/shared";

import {
  AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS,
  evaluateFamilyMaterialBenchmarkScenarioReadiness,
  type AirborneFamilyMaterialReadinessStatus
} from "./airborne-family-material-expansion";

export type GateNFamilySolverUpgradeCandidateId =
  | "double_leaf_framed_bridge_solver"
  | "field_building_prediction_context_solver"
  | "floor_impact_dynamic_stiffness_solver"
  | "lined_massive_masonry_clt_solver"
  | "single_leaf_massive_panel_solver"
  | "triple_multicavity_generalized_solver";

export type GateNImplementationBlastRadius = "low" | "medium" | "high";

export type GateNFamilySolverUpgradeCandidate = {
  acceptanceChecklist: readonly string[];
  currentRuntimePosture:
    | "field_context_needs_input_before_value_owner"
    | "needs_impact_rating_adapter_owner"
    | "needs_lineage_boundary_and_core_lining_owner"
    | "needs_topology_and_coupling_owner"
    | "narrow_family_prediction_already_landed"
    | "screening_selected_family_candidate_visible";
  deferralReasons: readonly string[];
  delegateMethods: readonly DynamicAirborneDelegateMethod[];
  dynamicAirborneFamilies: readonly DynamicAirborneFamily[];
  hardBlockersBeforeGate: readonly string[];
  id: GateNFamilySolverUpgradeCandidateId;
  implementationBlastRadius: GateNImplementationBlastRadius;
  materialReadinessStatus: AirborneFamilyMaterialReadinessStatus;
  materialScenarioIds: readonly string[];
  methodOwners: readonly string[];
  nearbyNegativeScenarioIds: readonly string[];
  positiveBenchmarkScenarioIds: readonly string[];
  ranking: {
    blastRadiusPenalty: number;
    deterministicOrder: number;
    score: number;
  };
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  route: "floor" | "wall";
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateNFamilySolverUpgradeSelection = {
  candidateIds: readonly GateNFamilySolverUpgradeCandidateId[];
  candidates: readonly GateNFamilySolverUpgradeCandidate[];
  landedGate: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator";
  numericRuntimeBehaviorChange: false;
  selectedCandidate: GateNFamilySolverUpgradeCandidate;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts";
  selectionPolicy: readonly string[];
  selectionStatus: "gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o";
};

type CandidateSeed = Omit<GateNFamilySolverUpgradeCandidate, "materialReadinessStatus" | "ranking" | "selected">;

const MATERIAL_STATUS_SCORE: Record<AirborneFamilyMaterialReadinessStatus, number> = {
  complete: 4,
  complete_with_defaults: 3,
  needs_input: -6
};

const BLAST_RADIUS_PENALTY: Record<GateNImplementationBlastRadius, number> = {
  high: 5,
  low: 0,
  medium: 2
};

function materialStatusFor(scenarioIds: readonly string[]): AirborneFamilyMaterialReadinessStatus {
  const statuses = scenarioIds.map((scenarioId) => {
    const scenario = AIRBORNE_FAMILY_MATERIAL_BENCHMARK_SCENARIOS.find(
      (entry) => entry.id === scenarioId
    );
    if (!scenario) {
      throw new Error(`Unknown Gate N material readiness scenario: ${scenarioId}`);
    }

    return evaluateFamilyMaterialBenchmarkScenarioReadiness(scenario).status;
  });

  if (statuses.includes("needs_input")) {
    return "needs_input";
  }

  if (statuses.includes("complete_with_defaults")) {
    return "complete_with_defaults";
  }

  return "complete";
}

function scoreCandidate(input: {
  blastRadius: GateNImplementationBlastRadius;
  currentRuntimePosture: GateNFamilySolverUpgradeCandidate["currentRuntimePosture"];
  delegateMethodCount: number;
  hardBlockerCount: number;
  materialReadinessStatus: AirborneFamilyMaterialReadinessStatus;
  sourceRowsRequiredForRuntimeSelection: boolean;
}): number {
  const postureScore =
    input.currentRuntimePosture === "screening_selected_family_candidate_visible"
      ? 5
      : input.currentRuntimePosture === "narrow_family_prediction_already_landed"
        ? 2
        : 0;
  const sourceScore = input.sourceRowsRequiredForRuntimeSelection ? -4 : 3;
  const methodScore = Math.min(input.delegateMethodCount, 4);
  const hardBlockerPenalty = input.hardBlockerCount * 4;

  return (
    postureScore +
    sourceScore +
    methodScore +
    MATERIAL_STATUS_SCORE[input.materialReadinessStatus] -
    hardBlockerPenalty -
    BLAST_RADIUS_PENALTY[input.blastRadius]
  );
}

const CANDIDATE_SEEDS = [
  {
    acceptanceChecklist: [
      "single_leaf_input_completeness_row_names_density_thickness_surface_mass_and_optional_stiffness_loss_factor",
      "family_physics_candidate_can_select_without_source_rows_when_physical_inputs_are_complete",
      "gypsum_board_laminated_board_and_concrete_values_remain_pinned_or_move_only_with_explicit_tolerance",
      "ISO_717_1_and_ASTM_E413_rating_adapter_basis_remains_visible_for_Rw_STC_C_Ctr",
      "visible_card_saved_replay_pdf_and_docx_basis_origin_parity_is_asserted"
    ],
    currentRuntimePosture: "screening_selected_family_candidate_visible",
    deferralReasons: [],
    delegateMethods: ["mass_law", "sharp", "kurtovic", "ks_rw_calibrated"],
    dynamicAirborneFamilies: ["single_leaf_panel", "laminated_single_leaf", "rigid_massive_wall"],
    hardBlockersBeforeGate: [],
    id: "single_leaf_massive_panel_solver",
    implementationBlastRadius: "low",
    materialScenarioIds: ["b3_single_leaf_massive_material_properties"],
    methodOwners: [
      "mass_law_surface_density_curve",
      "sharp_single_panel_coincidence_delegate",
      "kurtovic_cremer_coincidence_signal",
      "ks_massive_wall_reference_curve"
    ],
    nearbyNegativeScenarioIds: [
      "single_leaf_missing_density_or_layer_thickness_blocks_design_grade",
      "single_leaf_is_not_double_leaf_when_no_cavity_or_bridge_exists",
      "clt_orthotropy_stays_deferred_until_directional_properties_are_owned"
    ],
    positiveBenchmarkScenarioIds: [
      "single_leaf_mass_increase_monotonic_curve_sanity",
      "gypsum_single_board_current_value_pin",
      "rigid_concrete_current_value_pin"
    ],
    requiredPhysicalInputs: ["materialClass", "densityKgM3", "surfaceMassKgM2", "thicknessMm"],
    route: "wall",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    acceptanceChecklist: [
      "mass_air_mass_resonance_and_cavity_mode_transition_are_named",
      "frame_bridge_class_and_stud_spacing_are_required_inputs",
      "porous_absorber_changes_damping_not_simple_mass"
    ],
    currentRuntimePosture: "needs_topology_and_coupling_owner",
    deferralReasons: [
      "bridge_and_stud_coupling_inputs_are_not_yet_runtime_owned",
      "current_delegate_paths_mix_empty_cavity_and_surrogate_framed_behaviour"
    ],
    delegateMethods: ["sharp", "mass_law"],
    dynamicAirborneFamilies: ["double_leaf", "stud_wall_system", "double_stud_system"],
    hardBlockersBeforeGate: ["frameBridgeClass", "studSpacingMm", "resilientSideCount"],
    id: "double_leaf_framed_bridge_solver",
    implementationBlastRadius: "medium",
    materialScenarioIds: ["b4_double_leaf_framed_absorbed_cavity_properties"],
    methodOwners: [
      "mass_air_mass_resonance",
      "porous_cavity_damping",
      "frame_bridge_coupling"
    ],
    nearbyNegativeScenarioIds: ["unknown_frame_bridge_class_selects_needs_input_or_wide_uncertainty"],
    positiveBenchmarkScenarioIds: ["double_leaf_absorber_changes_damping_not_simple_mass"],
    requiredPhysicalInputs: [
      "sideALeafGroup",
      "cavity1DepthMm",
      "frameBridgeClass",
      "supportSpacingMm",
      "supportTopology"
    ],
    route: "wall",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    acceptanceChecklist: [
      "grouped_leaf_and_cavity_contract_is_required",
      "MLV_limp_mass_and_porous_cavity_properties_are_explicit",
      "transfer_matrix_or_impedance_network_generalization_has_nearby_negatives"
    ],
    currentRuntimePosture: "narrow_family_prediction_already_landed",
    deferralReasons: [
      "Gate_G_already_landed_the_narrow_grouped_Rockwool_two_cavity_runtime_move",
      "general_multi_cavity_solver_needs_transfer_matrix_or_impedance_network_scope_before_broad_promotion"
    ],
    delegateMethods: ["triple_leaf_two_cavity_frequency_solver", "mass_law"],
    dynamicAirborneFamilies: ["multileaf_multicavity"],
    hardBlockersBeforeGate: ["generalGroupedLeafGraph", "limpMassPositionOwner", "multiCavityTransferOwner"],
    id: "triple_multicavity_generalized_solver",
    implementationBlastRadius: "high",
    materialScenarioIds: ["b5_triple_leaf_limp_mass_porous_properties"],
    methodOwners: [
      "triple_leaf_two_cavity_frequency_solver",
      "limp_mass_membrane_surface_density",
      "transfer_matrix_generalization"
    ],
    nearbyNegativeScenarioIds: ["flat_list_internal_leaf_without_grouping_stays_guarded"],
    positiveBenchmarkScenarioIds: ["grouped_triple_leaf_two_cavity_solver_uses_material_property_basis"],
    requiredPhysicalInputs: [
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ],
    route: "wall",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    acceptanceChecklist: [
      "heavy_core_and_lining_roles_are_separate",
      "core_masonry_CLT_boundaries_do_not_borrow_each_other",
      "source_anchors_stay_inside_owned_topology"
    ],
    currentRuntimePosture: "needs_lineage_boundary_and_core_lining_owner",
    deferralReasons: [
      "lined_masonry_and_CLT_need family-boundary tests before runtime origin promotion",
      "CLT_orthotropy_is_explicitly_later_than_isotropic_single_leaf_work"
    ],
    delegateMethods: ["sharp", "ks_rw_calibrated", "mass_law"],
    dynamicAirborneFamilies: ["lined_massive_wall", "masonry_nonhomogeneous"],
    hardBlockersBeforeGate: ["coreMaterialClass", "liningCavityDepthMm", "cltDirectionalProperties"],
    id: "lined_massive_masonry_clt_solver",
    implementationBlastRadius: "medium",
    materialScenarioIds: [
      "b6_lined_masonry_finish_and_porous_lining_properties",
      "b7_clt_mass_timber_material_properties"
    ],
    methodOwners: ["heavy_core_plus_lining_solver", "masonry_nonhomogeneous_calibration", "clt_orthotropy_future"],
    nearbyNegativeScenarioIds: [
      "masonry_finish_density_or_core_class_mismatch_rejects_exact_borrowing",
      "isotropic_clt_default_cannot_promote_to_calibrated_without_holdout"
    ],
    positiveBenchmarkScenarioIds: [
      "lined_masonry_solver_preserves_core_mass_and_cavity_absorber_roles",
      "clt_mass_timber_default_keeps_uncalibrated_origin"
    ],
    requiredPhysicalInputs: ["materialClass", "cavityDepthMm", "densityKgM3", "surfaceMassKgM2"],
    route: "wall",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  },
  {
    acceptanceChecklist: [
      "dynamic_stiffness_and_load_basis_are_required",
      "ISO_717_2_and_ASTM_E989_adapters_do_not_alias_Lnw_to_IIC",
      "field_impact_context_is_separate_from_lab_impact"
    ],
    currentRuntimePosture: "needs_impact_rating_adapter_owner",
    deferralReasons: [
      "impact_dynamic_stiffness_route_exists_but_IIC_AIIC_adapter_owner_is_still_unsupported",
      "floor_runtime_move_should be separated from first airborne family promotion"
    ],
    delegateMethods: ["mass_law"],
    dynamicAirborneFamilies: [],
    hardBlockersBeforeGate: ["dynamicStiffnessMNm3", "loadBasisKgM2", "impactRatingAdapterOwner"],
    id: "floor_impact_dynamic_stiffness_solver",
    implementationBlastRadius: "medium",
    materialScenarioIds: ["b8_floating_floor_dynamic_stiffness_properties"],
    methodOwners: ["ISO_12354_2_impact_predictor", "ISO_717_2_rating_adapter", "ASTM_E989_adapter_future"],
    nearbyNegativeScenarioIds: ["floating_floor_missing_dynamic_stiffness_is_needs_input"],
    positiveBenchmarkScenarioIds: ["floating_floor_dynamic_stiffness_drives_delta_lw"],
    requiredPhysicalInputs: [
      "baseSlabOrFloor",
      "toppingOrFloatingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2"
    ],
    route: "floor",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Ln,w", "L'n,w", "L'nT,w"]
  },
  {
    acceptanceChecklist: [
      "room_volume_area_RT60_and_flanking_context_are_required",
      "lab_Rw_never_replaces_field_Rprime_or_DnT_without_context_delta",
      "simplified_ISO_12354_building_prediction_has_wider_uncertainty"
    ],
    currentRuntimePosture: "field_context_needs_input_before_value_owner",
    deferralReasons: [
      "field_and_building_outputs_require room and flanking context before a value owner can be promoted",
      "first runtime family gate should improve the element solver basis before field continuations"
    ],
    delegateMethods: ["mass_law", "sharp"],
    dynamicAirborneFamilies: ["single_leaf_panel", "double_leaf", "multileaf_multicavity"],
    hardBlockersBeforeGate: ["partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S", "flankingJunctionClass"],
    id: "field_building_prediction_context_solver",
    implementationBlastRadius: "high",
    materialScenarioIds: [],
    methodOwners: ["ISO_12354_1_field_continuation", "field_apparent_context_delta"],
    nearbyNegativeScenarioIds: ["field_output_missing_room_context_stays_needs_input"],
    positiveBenchmarkScenarioIds: ["field_context_delta_preserves_lab_element_basis"],
    requiredPhysicalInputs: [
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass"
    ],
    route: "wall",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["R'w", "DnT,w", "Dn,w"]
  }
] as const satisfies readonly CandidateSeed[];

function buildCandidate(seed: CandidateSeed, deterministicOrder: number): GateNFamilySolverUpgradeCandidate {
  const materialReadinessStatus = materialStatusFor(seed.materialScenarioIds);
  const score = scoreCandidate({
    blastRadius: seed.implementationBlastRadius,
    currentRuntimePosture: seed.currentRuntimePosture,
    delegateMethodCount: seed.delegateMethods.length,
    hardBlockerCount: seed.hardBlockersBeforeGate.length,
    materialReadinessStatus,
    sourceRowsRequiredForRuntimeSelection: seed.sourceRowsRequiredForRuntimeSelection
  });

  return {
    ...seed,
    materialReadinessStatus,
    ranking: {
      blastRadiusPenalty: BLAST_RADIUS_PENALTY[seed.implementationBlastRadius],
      deterministicOrder,
      score
    },
    selected: false
  };
}

function selectCandidate(
  candidates: readonly GateNFamilySolverUpgradeCandidate[]
): GateNFamilySolverUpgradeCandidate {
  const [selected] = [...candidates].sort((left, right) => {
    const scoreDelta = right.ranking.score - left.ranking.score;
    return scoreDelta === 0
      ? left.ranking.deterministicOrder - right.ranking.deterministicOrder
      : scoreDelta;
  });

  if (!selected) {
    throw new Error("Gate N requires at least one family solver upgrade candidate.");
  }

  return selected;
}

export function buildGateNDynamicCalculatorFamilySolverUpgradeSelection(): GateNFamilySolverUpgradeSelection {
  const unselectedCandidates = CANDIDATE_SEEDS.map((seed, index) => buildCandidate(seed, index));
  const selected = selectCandidate(unselectedCandidates);
  const candidates = unselectedCandidates.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate N family solver upgrade selection did not mark a selected candidate.");
  }

  return {
    candidateIds: candidates.map((candidate) => candidate.id),
    candidates,
    landedGate: "gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator",
    numericRuntimeBehaviorChange: false,
    selectedCandidate,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-o-single-leaf-massive-panel-runtime-contract.test.ts",
    selectionPolicy: [
      "pick the smallest source-independent family runtime move that improves calculator origin/basis correctness",
      "prefer an already-visible family candidate whose values can be pinned while support/origin metadata is upgraded",
      "defer families whose first safe runtime move depends on bridge, room, impact, or generalized multi-cavity topology owners",
      "trusted source rows remain calibration/override evidence, not the reason a source-absent physics solver exists"
    ],
    selectionStatus:
      "gate_n_family_solver_upgrade_selection_landed_no_runtime_selected_single_leaf_massive_panel_gate_o"
  };
}
