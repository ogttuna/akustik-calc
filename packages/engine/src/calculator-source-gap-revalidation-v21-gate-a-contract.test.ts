import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  boundedGuardReadyToSelect: boolean;
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  fieldOutputGuardConsumed: boolean;
  fieldOutputPolicyOwnerNamed: boolean;
  frequentCombinationSnapshotOwnerNamed: boolean;
  hostileInputOwnerNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceAcquisitionReadyToSelect: boolean;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V21Candidate = {
  currentPosture: string;
  docOwner: string;
  executableTestOwner: string;
  firstMissingRequirement: string;
  id: string;
  protectedNegativeBoundaries: readonly string[];
  rank: number;
  readiness: RuntimeReadiness;
  reason: string;
  runtimeBehaviorChange: false;
  selectedNext: boolean;
  targetFile: string;
  userVisibleRisk: string;
  validationScope: readonly string[];
};

const CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  fieldOutputGuardConsumed: true,
  landedGate: "gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker",
  latestClosedSlice: "field_output_lab_screening_leakage_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
  selectedPlanningSurface:
    "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  selectedRouteFamily: "company_internal_frequent_combination_lane_snapshot_guard_no_runtime",
  selectionStatus:
    "selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked",
  sliceId: "calculator_source_gap_revalidation_v21",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile:
    "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
  "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md",
  "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_GATE_B_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const FIELD_OUTPUT_GUARD_CONSUMED_AS_PREREQUISITE = {
  artifact: "field_output_guard_consumed_as_prerequisite",
  fieldCopyGuardLanded: true,
  fieldOutputsStillNeedOwnerForDesignGrade: true,
  noRuntimeMovement: true,
  selectedNextMustNotRepeatVisibleCopyOnlyWork: true,
  visibleCopySurfaceCovered: [
    "airborne_rprime_dnw_dntw_family",
    "impact_lprime_lprimet_family",
    "proposal_report_coverage_copy",
    "missing_room_volume_and_missing_field_k_boundaries"
  ]
} as const;

const ROCKWOOL_TRIPLE_LEAF_FIX_PATH_STATUS = {
  artifact: "rockwool_triple_leaf_fix_path_status",
  exactSourceValidatedNow: false,
  groupedScreeningAnswer: "Rw 41",
  localRuntimeFixReadyNow: false,
  requiredBeforeExact: [
    "rights_safe_uris_2006_or_equivalent_source_owned_band_curve_packet",
    "curve_identity_rating_derivation_uncertainty_and_tolerance_owner",
    "local_rockwool_gypsum_mlv_and_plaster_mapping",
    "grouped_topology_runtime_guard_and_negative_boundaries",
    "paired_engine_web_route_output_report_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
} as const;

const COMPANY_INTERNAL_HIGH_ACCURACY_BLOCKER_ALIGNMENT = {
  artifact: "company_internal_high_accuracy_blocker_alignment",
  companyInternalHighAccuracyOpeningAllowedNow: false,
  currentBlockingIds: [
    "rockwool_triple_leaf_source_packet_absent",
    "field_outputs_need_owner_before_design_grade",
    "frequent_combination_lane_snapshots_need_company_opening_matrix",
    "source_ready_runtime_candidate_absent",
    "hostile_api_import_guard_must_stay_green"
  ],
  nextSelectedWork:
    "company_internal_frequent_combination_lane_snapshot_guard_v1",
  preCompanyInternalExitCriteriaCarriedForward: true,
  runtimeImportReadyNow: false
} as const;

const FREQUENT_COMBINATION_LANE_SNAPSHOT_RISK_ORDER = {
  artifact: "frequent_combination_lane_snapshot_risk_order",
  selectedNextRiskFamily: "frequent_wall_floor_lane_snapshots_green",
  orderedRisks: [
    "rockwool_like_triple_leaf_and_flat_list_swaps",
    "ordinary_lsf_timber_double_board_layer_swaps",
    "masonry_lined_massive_boundary_hybrids",
    "raw_floor_role_inference_and_duplicate_floor_roles",
    "near_source_material_alias_rows",
    "hostile_api_import_payloads"
  ],
  requiredSnapshotFields: [
    "family",
    "strategy",
    "support",
    "confidence",
    "source_or_origin",
    "warnings",
    "visible_route_output_posture"
  ],
  runtimeImportReadyNow: false
} as const;

const V21_RERANK_CANDIDATES: readonly V21Candidate[] = [
  {
    currentPosture:
      "field_output_copy_guard_landed_but_company_internal_high_accuracy_opening_still_needs_a_current_frequent_combination_lane_snapshot_matrix",
    docOwner: "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
    executableTestOwner:
      "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
    firstMissingRequirement:
      "company_opening_matrix_for_frequent_wall_floor_family_strategy_support_confidence_source_warning_and_visible_posture_snapshots",
    id: "company_internal_frequent_combination_lane_snapshot_guard",
    protectedNegativeBoundaries: [
      "rw41_screening_answer_remains_not_fixed",
      "field_output_copy_guard_is_not_field_owner",
      "near_source_rows_do_not_promote_runtime",
      "hostile_api_import_payloads_fail_closed"
    ],
    rank: 1,
    readiness: {
      boundedGuardReadyToSelect: true,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: true,
      frequentCombinationSnapshotOwnerNamed: true,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "this_is_the_highest_value_bounded_no_runtime_step_after_field_copy_guard_because_it_directly_tests_the_company_internal_wrong_lane_opening_blocker",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile:
      "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
    userVisibleRisk:
      "a_common_wall_or_floor_stack_can_look_reliable_while_family_strategy_or_source_posture_is_only_screening_or_fail_closed",
    validationScope: [
      "company_internal_frequent_combination_lane_snapshot_guard_gate_a",
      "wall_triple_leaf_company_internal_acceptance_rehearsal",
      "field_output_gate_b_visible_copy",
      "route_source_risk_register",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture:
      "highest_user_reported_exact_fix_still_waits_for_rights_safe_uris_2006_or_equivalent_curve_packet",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
    firstMissingRequirement: "rights_safe_source_owned_curve_packet_with_local_material_mapping_and_tolerance_owner",
    id: "rockwool_triple_leaf_exact_source_packet_fix",
    protectedNegativeBoundaries: [
      "paused_waiting_rights_safe_source_packet",
      "nrc_2024_comparator_not_local_runtime",
      "manufacturer_stc_iic_rows_not_uris_two_cavity_curve_payload"
    ],
    rank: 2,
    readiness: {
      boundedGuardReadyToSelect: false,
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: false,
      frequentCombinationSnapshotOwnerNamed: true,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "must_remain_high_priority_but_cannot_be_selected_for_runtime_or_exact_fix_without_a_new_rights_safe_source_packet",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk: "rw41_can_still_be_misread_as_exact_if_screening_posture_is_not_kept_prominent",
    validationScope: ["triple_leaf_handoff_refresh", "future_source_packet_intake"]
  },
  {
    currentPosture:
      "field_output_visible_copy_guard_landed_but_field_overlay_owner_and_design_grade_policy_are_still_missing",
    docOwner: "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
    executableTestOwner: "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
    firstMissingRequirement: "field_overlay_owner_for_design_grade_rprime_dntw_lprime_metrics",
    id: "field_output_owner_and_overlay_policy",
    protectedNegativeBoundaries: [
      "visible_copy_guard_is_not_field_measurement",
      "missing_room_volume_and_field_k_stay_needs_input"
    ],
    rank: 3,
    readiness: {
      boundedGuardReadyToSelect: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: false,
      frequentCombinationSnapshotOwnerNamed: false,
      hostileInputOwnerNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "gate_b_consumed_the_visible_copy_guard; a_real_field_owner_is_larger_than_the_next_bounded_company_opening_snapshot_step",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
    userVisibleRisk: "finite_field_outputs_can_still_be_requested_but_must_not_be_design_grade_without_owner",
    validationScope: ["future_field_overlay_policy_slice"]
  },
  {
    currentPosture: "near_source_and_alias_rows_remain_context_only_after_recent_no_runtime_source_pack_slices",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement: "role_specific_material_mapping_metric_tolerance_and_negative_boundaries_for_each_source_row",
    id: "material_alias_and_near_source_false_promotion_guard",
    protectedNegativeBoundaries: [
      "rockwool_glass_fiber_not_global_alias",
      "generic_gypsum_type_c_not_global_alias",
      "manufacturer_context_rows_remain_no_runtime"
    ],
    rank: 4,
    readiness: {
      boundedGuardReadyToSelect: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: false,
      frequentCombinationSnapshotOwnerNamed: true,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "important_but_no_new_material_mapping_owner_arrived; include_it_inside_the_company_snapshot_guard_before_selecting_a_dedicated_alias_slice",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "official_or_similar_material_names_can_look_exact_without_mapping_and_tolerance",
    validationScope: ["route_source_risk_register_refresh"]
  },
  {
    currentPosture: "hostile_input_guards_are_green_but_must_stay_part_of_every_company_opening_snapshot",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement: "new_public_api_or_import_path_that_bypasses_existing_engine_boundary_guards",
    id: "hostile_api_import_guard",
    protectedNegativeBoundaries: [
      "unknown_material_no_supported_outputs",
      "nan_infinity_negative_thickness_fail_closed",
      "ui_normalization_does_not_replace_engine_guard"
    ],
    rank: 5,
    readiness: {
      boundedGuardReadyToSelect: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: false,
      frequentCombinationSnapshotOwnerNamed: true,
      hostileInputOwnerNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_as_a_standalone_slice_because_the_company_snapshot_guard_can_carry_it_as_a_required_cell",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "bad_import_payloads_can_create_trust_failures_even_when_ui_normalization_looks_safe",
    validationScope: ["future_hostile_api_import_slice"]
  },
  {
    currentPosture: "available_only_if_no_bounded_company_opening_guard_or_source_action_is_selected",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts",
    firstMissingRequirement: "use_only_if_every_candidate_above_lacks_a_target_file_or_validation_scope",
    id: "no_runtime_rerank_closeout",
    protectedNegativeBoundaries: [
      "no_runtime_closeout_must_not_hide_rockwool_or_company_opening_blockers",
      "no_runtime_closeout_must_name_target_file"
    ],
    rank: 6,
    readiness: {
      boundedGuardReadyToSelect: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputGuardConsumed: true,
      fieldOutputPolicyOwnerNamed: false,
      frequentCombinationSnapshotOwnerNamed: false,
      hostileInputOwnerNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason: "not_selected_because_the_company_internal_snapshot_guard_is_bounded_and_directly_targets_the_opening_blocker",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md",
    userVisibleRisk: "pure_rerank_closeout_would_delay_the_company_internal_wrong_lane_acceptance_matrix",
    validationScope: ["v21_gate_a_contract"]
  }
] as const;

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_OUTPUTS = ["Rw"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[], airborneContext: AirborneContext = WALL_LAB_CONTEXT) {
  const result = calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation v21 Gate A contract", () => {
  it("lands V21 Gate A no-runtime and selects the company-internal frequent-combination snapshot guard", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      fieldOutputGuardConsumed: true,
      landedGate: "gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker",
      latestClosedSlice: "field_output_lab_screening_leakage_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "company_internal_frequent_combination_lane_snapshot_guard_v1",
      selectedPlanningSurface:
        "docs/calculator/SLICE_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_PLAN.md",
      selectedRouteFamily: "company_internal_frequent_combination_lane_snapshot_guard_no_runtime",
      selectionStatus:
        "selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked",
      sliceId: "calculator_source_gap_revalidation_v21",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile:
        "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("consumes the field-output copy guard as prerequisite without claiming design-grade field ownership", () => {
    expect(FIELD_OUTPUT_GUARD_CONSUMED_AS_PREREQUISITE).toEqual({
      artifact: "field_output_guard_consumed_as_prerequisite",
      fieldCopyGuardLanded: true,
      fieldOutputsStillNeedOwnerForDesignGrade: true,
      noRuntimeMovement: true,
      selectedNextMustNotRepeatVisibleCopyOnlyWork: true,
      visibleCopySurfaceCovered: [
        "airborne_rprime_dnw_dntw_family",
        "impact_lprime_lprimet_family",
        "proposal_report_coverage_copy",
        "missing_room_volume_and_missing_field_k_boundaries"
      ]
    });
  });

  it("proves rockwool triple-leaf remains screening while flat-list swaps stay fail-closed", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4), WALL_LAB_CONTEXT);

    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw"]
    });
    expect(grouped.warnings).toContain("family physics prediction");
    expect(grouped.warnings).toContain("Dynamic airborne confidence is medium");

    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology",
      supported: ["Rw"]
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
  });

  it("keeps the exact rockwool fix path blocked on source packet, material mapping, tolerance, and visible tests", () => {
    expect(ROCKWOOL_TRIPLE_LEAF_FIX_PATH_STATUS).toEqual({
      artifact: "rockwool_triple_leaf_fix_path_status",
      exactSourceValidatedNow: false,
      groupedScreeningAnswer: "Rw 41",
      localRuntimeFixReadyNow: false,
      requiredBeforeExact: [
        "rights_safe_uris_2006_or_equivalent_source_owned_band_curve_packet",
        "curve_identity_rating_derivation_uncertainty_and_tolerance_owner",
        "local_rockwool_gypsum_mlv_and_plaster_mapping",
        "grouped_topology_runtime_guard_and_negative_boundaries",
        "paired_engine_web_route_output_report_tests"
      ],
      runtimeImportReadyNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
    });
  });

  it("aligns company-internal high-accuracy blockers with the selected snapshot guard", () => {
    expect(COMPANY_INTERNAL_HIGH_ACCURACY_BLOCKER_ALIGNMENT).toEqual({
      artifact: "company_internal_high_accuracy_blocker_alignment",
      companyInternalHighAccuracyOpeningAllowedNow: false,
      currentBlockingIds: [
        "rockwool_triple_leaf_source_packet_absent",
        "field_outputs_need_owner_before_design_grade",
        "frequent_combination_lane_snapshots_need_company_opening_matrix",
        "source_ready_runtime_candidate_absent",
        "hostile_api_import_guard_must_stay_green"
      ],
      nextSelectedWork:
        "company_internal_frequent_combination_lane_snapshot_guard_v1",
      preCompanyInternalExitCriteriaCarriedForward: true,
      runtimeImportReadyNow: false
    });
  });

  it("orders the frequent-combination lane snapshot risks that the next slice must pin", () => {
    expect(FREQUENT_COMBINATION_LANE_SNAPSHOT_RISK_ORDER).toEqual({
      artifact: "frequent_combination_lane_snapshot_risk_order",
      selectedNextRiskFamily: "frequent_wall_floor_lane_snapshots_green",
      orderedRisks: [
        "rockwool_like_triple_leaf_and_flat_list_swaps",
        "ordinary_lsf_timber_double_board_layer_swaps",
        "masonry_lined_massive_boundary_hybrids",
        "raw_floor_role_inference_and_duplicate_floor_roles",
        "near_source_material_alias_rows",
        "hostile_api_import_payloads"
      ],
      requiredSnapshotFields: [
        "family",
        "strategy",
        "support",
        "confidence",
        "source_or_origin",
        "warnings",
        "visible_route_output_posture"
      ],
      runtimeImportReadyNow: false
    });
  });

  it("ranks V21 candidates and selects exactly one bounded next slice", () => {
    expect(V21_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "company_internal_frequent_combination_lane_snapshot_guard",
      "rockwool_triple_leaf_exact_source_packet_fix",
      "field_output_owner_and_overlay_policy",
      "material_alias_and_near_source_false_promotion_guard",
      "hostile_api_import_guard",
      "no_runtime_rerank_closeout"
    ]);
    expect(V21_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(V21_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V21_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V21_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "company_internal_frequent_combination_lane_snapshot_guard",
        readiness: expect.objectContaining({
          boundedGuardReadyToSelect: true,
          fieldOutputGuardConsumed: true,
          frequentCombinationSnapshotOwnerNamed: true,
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false
        }),
        targetFile:
          "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts"
      })
    ]);
  });

  it("keeps active docs aligned with V21 and the selected company-internal snapshot guard", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A.targetFirstGateFile);
    }

    const v21Plan = readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_PLAN.md");
    expect(v21Plan).toContain("post_gate_b_source_gap_candidate_order");
    expect(v21Plan).toContain("rockwool_triple_leaf_fix_path_status");
    expect(v21Plan).toContain("frequent_combination_lane_snapshot_risk_order");
  });
});
