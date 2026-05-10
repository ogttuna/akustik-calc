import type {
  GateNFamilySolverUpgradeCandidate,
  GateNFamilySolverUpgradeCandidateId
} from "./dynamic-calculator-family-solver-upgrade-selection";
import { buildGateNDynamicCalculatorFamilySolverUpgradeSelection } from "./dynamic-calculator-family-solver-upgrade-selection";

export type GatePNextFamilySolverUpgradeCandidateId = Exclude<
  GateNFamilySolverUpgradeCandidateId,
  "single_leaf_massive_panel_solver"
>;

export type GatePNextSafeMoveType =
  | "double_leaf_bridge_input_and_benchmark_contract"
  | "field_building_context_contract"
  | "floor_impact_adapter_contract"
  | "generalized_multicavity_transfer_contract"
  | "lined_masonry_clt_boundary_contract";

export type GatePNextFamilySolverUpgradeCandidate = {
  acceptanceChecklist: readonly string[];
  baseCandidate: GateNFamilySolverUpgradeCandidate;
  baseCandidateId: GatePNextFamilySolverUpgradeCandidateId;
  deferralReasons: readonly string[];
  familySolverUpgradeGoal: string;
  id: GatePNextFamilySolverUpgradeCandidateId;
  nextSafeMoveType: GatePNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  routeBasisRisk: "field_context" | "impact_route" | "lab_element" | "lab_element_high_risk";
  runtimePromotionAllowedNow: false;
  scoring: {
    blockerPenalty: number;
    continuityScore: number;
    coverageScore: number;
    deterministicOrder: number;
    fieldOrFloorSeparationPenalty: number;
    riskPenalty: number;
    score: number;
  };
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: false;
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

export type GatePNextFamilySolverUpgradeSelection = {
  candidateIds: readonly GatePNextFamilySolverUpgradeCandidateId[];
  candidates: readonly GatePNextFamilySolverUpgradeCandidate[];
  landedGate: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion";
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator";
  selectedCandidate: GatePNextFamilySolverUpgradeCandidate;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts";
  selectionPolicy: readonly string[];
  selectionStatus: "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q";
  singleLeafGateOCompletionEvidence: {
    coveredFamilies: readonly string[];
    gateOSelectedOrigin: "family_physics_prediction";
    runtimeValueMovement: false;
    valuePinsRemainRequired: true;
  };
};

type GatePScoringSeed = {
  blockerPenalty: number;
  continuityScore: number;
  coverageScore: number;
  familySolverUpgradeGoal: string;
  fieldOrFloorSeparationPenalty: number;
  nextSafeMoveType: GatePNextSafeMoveType;
  requiredOwnersBeforeRuntime: readonly string[];
  riskPenalty: number;
  routeBasisRisk: GatePNextFamilySolverUpgradeCandidate["routeBasisRisk"];
  whyNextCandidate: readonly string[];
  whyNotRuntimeYet: readonly string[];
};

const REMAINING_CANDIDATE_IDS = [
  "double_leaf_framed_bridge_solver",
  "triple_multicavity_generalized_solver",
  "lined_massive_masonry_clt_solver",
  "floor_impact_dynamic_stiffness_solver",
  "field_building_prediction_context_solver"
] as const satisfies readonly GatePNextFamilySolverUpgradeCandidateId[];

const GATE_P_SCORING_SEEDS = {
  double_leaf_framed_bridge_solver: {
    blockerPenalty: 2,
    continuityScore: 5,
    coverageScore: 5,
    familySolverUpgradeGoal:
      "turn common double-leaf/stud wall stacks into physics-owned predictions by first owning bridge/cavity input contracts",
    fieldOrFloorSeparationPenalty: 0,
    nextSafeMoveType: "double_leaf_bridge_input_and_benchmark_contract",
    requiredOwnersBeforeRuntime: [
      "frameBridgeClass",
      "studSpacingMm",
      "resilientSideCount",
      "supportTopology",
      "porousCavityDampingOwner",
      "massAirMassResonanceOwner"
    ],
    riskPenalty: 1,
    routeBasisRisk: "lab_element",
    whyNextCandidate: [
      "double_leaf_and_stud_wall_systems_are_common_personal_use_wall_calculator_inputs",
      "Gate_N_already_named_the_bridge_and_cavity_physics_blockers",
      "Gate_I_material_defaults_include_the_absorbed_double_leaf_benchmark_materials",
      "the_next_safe_move_is_an_input_and_benchmark_contract_before_any_runtime_value_movement"
    ],
    whyNotRuntimeYet: [
      "frame_bridge_class_and_stud_spacing_are_not_yet_runtime_owned",
      "resilient_side_count_and_support_topology_need_visible_missing_input_prompts",
      "mass_air_mass_resonance_and_porous_cavity_damping_need_positive_and_negative_benchmarks"
    ]
  },
  triple_multicavity_generalized_solver: {
    blockerPenalty: 5,
    continuityScore: 3,
    coverageScore: 4,
    familySolverUpgradeGoal:
      "generalize the landed narrow grouped triple-leaf solver into a broader multileaf/multicavity graph",
    fieldOrFloorSeparationPenalty: 0,
    nextSafeMoveType: "generalized_multicavity_transfer_contract",
    requiredOwnersBeforeRuntime: [
      "generalGroupedLeafGraph",
      "limpMassPositionOwner",
      "multiCavityTransferOwner",
      "unsafeFlatListInternalLeafGuard"
    ],
    riskPenalty: 5,
    routeBasisRisk: "lab_element_high_risk",
    whyNextCandidate: [
      "Gate_G_proved_one_narrow_grouped_two_cavity_runtime_path",
      "the_family_is_important_for_multi_layer_wall_coverage"
    ],
    whyNotRuntimeYet: [
      "the_general_graph_and_transfer_matrix_contract_are_not_owned",
      "flat_list_internal_leaf_detection_is_still_a_high_risk_boundary",
      "limp_mass_position_and_cavity_sequence_errors_can_move_values_too_much"
    ]
  },
  lined_massive_masonry_clt_solver: {
    blockerPenalty: 3,
    continuityScore: 3,
    coverageScore: 3,
    familySolverUpgradeGoal:
      "separate heavy-core lining predictions from CLT/mass-timber boundaries without borrowing wrong family assumptions",
    fieldOrFloorSeparationPenalty: 0,
    nextSafeMoveType: "lined_masonry_clt_boundary_contract",
    requiredOwnersBeforeRuntime: [
      "coreMaterialClass",
      "liningCavityDepthMm",
      "liningAbsorptionClass",
      "cltDirectionalProperties"
    ],
    riskPenalty: 3,
    routeBasisRisk: "lab_element",
    whyNextCandidate: [
      "heavy_core_plus_lining_is_relevant_for_wall_coverage",
      "Gate_O_explicitly_kept_CLT_out_of_isotropic_single_leaf_runtime_promotion"
    ],
    whyNotRuntimeYet: [
      "lined_masonry_and_CLT_need_family_boundary_tests_before_runtime_promotion",
      "CLT_directional_properties_are_not_owned_enough_for_calibrated_or_family_prediction_origin"
    ]
  },
  floor_impact_dynamic_stiffness_solver: {
    blockerPenalty: 4,
    continuityScore: 2,
    coverageScore: 5,
    familySolverUpgradeGoal:
      "make floor impact prediction dynamic-stiffness driven while preserving ISO 717-2 and ASTM impact basis separation",
    fieldOrFloorSeparationPenalty: 2,
    nextSafeMoveType: "floor_impact_adapter_contract",
    requiredOwnersBeforeRuntime: [
      "dynamicStiffnessMNm3",
      "loadBasisKgM2",
      "impactRatingAdapterOwner",
      "ISO7172LnwAdapter",
      "ASTME989IICAdapterBoundary"
    ],
    riskPenalty: 4,
    routeBasisRisk: "impact_route",
    whyNextCandidate: [
      "floor_impact_is_required_for_personal_use_readiness",
      "dynamic_stiffness_is_the_right_physical_control_for_floating_floor_delta_Lw"
    ],
    whyNotRuntimeYet: [
      "floor_impact_needs_a_dedicated_rating_adapter_contract_before_wall_airborne_solver_work_can_share_selection_rules",
      "Ln_w_and_IIC_must_not_be_aliased_or_promoted_from_the_same_unlabelled_value"
    ]
  },
  field_building_prediction_context_solver: {
    blockerPenalty: 4,
    continuityScore: 2,
    coverageScore: 4,
    familySolverUpgradeGoal:
      "continue element predictions into field/apparent and building-prediction outputs only after room/flanking context is explicit",
    fieldOrFloorSeparationPenalty: 3,
    nextSafeMoveType: "field_building_context_contract",
    requiredOwnersBeforeRuntime: [
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "labToFieldBasisDeltaOwner"
    ],
    riskPenalty: 5,
    routeBasisRisk: "field_context",
    whyNextCandidate: [
      "R_prime_DnT_and_building_prediction_outputs_are_core_product_outputs",
      "field_context_can_reuse_element_solver_outputs_only_when_basis_conversion_is_owned"
    ],
    whyNotRuntimeYet: [
      "field_outputs_need_room_volume_RT60_area_and_flanking_context_before_value_ownership",
      "lab_Rw_must_not_be_relabelled_as_R_prime_or_DnT_without_a_named_context_delta"
    ]
  }
} as const satisfies Record<GatePNextFamilySolverUpgradeCandidateId, GatePScoringSeed>;

function scoreSeed(seed: GatePScoringSeed): number {
  return (
    seed.coverageScore +
    seed.continuityScore -
    seed.blockerPenalty -
    seed.riskPenalty -
    seed.fieldOrFloorSeparationPenalty
  );
}

function getBaseCandidate(
  candidates: readonly GateNFamilySolverUpgradeCandidate[],
  id: GatePNextFamilySolverUpgradeCandidateId
): GateNFamilySolverUpgradeCandidate {
  const candidate = candidates.find((entry) => entry.id === id);

  if (!candidate) {
    throw new Error(`Gate P could not find remaining Gate N candidate: ${id}`);
  }

  return candidate;
}

function buildCandidate(
  baseCandidates: readonly GateNFamilySolverUpgradeCandidate[],
  id: GatePNextFamilySolverUpgradeCandidateId,
  deterministicOrder: number
): GatePNextFamilySolverUpgradeCandidate {
  const baseCandidate = getBaseCandidate(baseCandidates, id);
  const seed = GATE_P_SCORING_SEEDS[id];

  return {
    acceptanceChecklist: baseCandidate.acceptanceChecklist,
    baseCandidate,
    baseCandidateId: id,
    deferralReasons: baseCandidate.deferralReasons,
    familySolverUpgradeGoal: seed.familySolverUpgradeGoal,
    id,
    nextSafeMoveType: seed.nextSafeMoveType,
    requiredOwnersBeforeRuntime: seed.requiredOwnersBeforeRuntime,
    routeBasisRisk: seed.routeBasisRisk,
    runtimePromotionAllowedNow: false,
    scoring: {
      blockerPenalty: seed.blockerPenalty,
      continuityScore: seed.continuityScore,
      coverageScore: seed.coverageScore,
      deterministicOrder,
      fieldOrFloorSeparationPenalty: seed.fieldOrFloorSeparationPenalty,
      riskPenalty: seed.riskPenalty,
      score: scoreSeed(seed)
    },
    selected: false,
    sourceRowsRequiredForRuntimeSelection: false,
    whyNextCandidate: seed.whyNextCandidate,
    whyNotRuntimeYet: seed.whyNotRuntimeYet
  };
}

function selectCandidate(
  candidates: readonly GatePNextFamilySolverUpgradeCandidate[]
): GatePNextFamilySolverUpgradeCandidate {
  const [selected] = [...candidates].sort((left, right) => {
    const scoreDelta = right.scoring.score - left.scoring.score;
    return scoreDelta === 0
      ? left.scoring.deterministicOrder - right.scoring.deterministicOrder
      : scoreDelta;
  });

  if (!selected) {
    throw new Error("Gate P requires at least one next family solver candidate.");
  }

  return selected;
}

export function buildGatePNextFamilySolverUpgradeSelection(): GatePNextFamilySolverUpgradeSelection {
  const gateNSelection = buildGateNDynamicCalculatorFamilySolverUpgradeSelection();
  const candidatesWithoutSelection = REMAINING_CANDIDATE_IDS.map((id, index) =>
    buildCandidate(gateNSelection.candidates, id, index)
  );
  const selected = selectCandidate(candidatesWithoutSelection);
  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Gate P next family solver selection did not mark a selected candidate.");
  }

  return {
    candidateIds: candidates.map((candidate) => candidate.id),
    candidates,
    landedGate: "gate_p_select_next_family_solver_upgrade_after_single_leaf_runtime_promotion",
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_o_promote_single_leaf_massive_panel_family_solver_runtime_for_dynamic_calculator",
    selectedCandidate,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      "gate_q_define_double_leaf_framed_bridge_input_and_benchmark_contract_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts",
    selectionPolicy: [
      "after Gate O, exclude the already-landed single-leaf family from the next-upgrade ranking",
      "select the next family whose input contract can unlock broad source-absent calculator coverage without moving runtime values yet",
      "prefer wall lab-element family physics before field/building continuation when room and flanking context are still unowned",
      "trusted source rows can override, calibrate, or hold out the selected family later, but they are not required for this solver contract"
    ],
    selectionStatus:
      "gate_p_next_family_solver_selection_landed_no_runtime_selected_double_leaf_framed_bridge_gate_q",
    singleLeafGateOCompletionEvidence: {
      coveredFamilies: ["single_leaf_panel", "laminated_single_leaf", "rigid_massive_wall"],
      gateOSelectedOrigin: "family_physics_prediction",
      runtimeValueMovement: false,
      valuePinsRemainRequired: true
    }
  };
}
