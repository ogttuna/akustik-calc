import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  boundedGuardReadyToSelect: boolean;
  curveProvenanceOwnerNamed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  fieldOutputPolicyOwnerNamed: boolean;
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

type V20Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt",
  latestClosedSlice: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "field_output_lab_screening_leakage_guard_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
  selectedRouteFamily: "field_output_lab_screening_leakage_guard_no_runtime",
  selectionStatus:
    "selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent",
  sliceId: "calculator_source_gap_revalidation_v20",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
  "packages/engine/src/wall-triple-leaf-source-packet-availability-gate-s.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md",
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
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const URIS_2006_GATE_U_ACQUISITION_CLOSEOUT_SUMMARY = {
  artifact: "uris_2006_gate_u_acquisition_closeout_summary",
  exactSourceValidatedNow: false,
  firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
  groupedSplitRockwoolAnswer: "Rw 41",
  groupedSplitRockwoolPosture: "low_confidence_multileaf_screening_blend_not_fixed_not_exact",
  runtimeImportReadyNow: false,
  sourceIdentityConfirmed: true,
  sourcePacketAvailableNow: false
} as const;

const SOURCE_PACKET_ABSENCE_AND_EXTERNAL_DEPENDENCY_CARRY_FORWARD = {
  artifact: "source_packet_absence_and_external_dependency_carry_forward",
  blockedPayloads: [
    "uris_2006_metadata_without_page_image_table_curve_or_band_vector",
    "elsevier_tdm_path_without_authorized_local_payload",
    "sciencedirect_locator_without_rights_safe_corpus_file",
    "nrc_2024_comparator_graph_rows_not_local_rockwool_runtime",
    "manufacturer_stc_iic_oitc_rows_not_uris_two_cavity_curve_payload"
  ],
  externalDependency: "manual_rights_safe_source_packet_or_authorized_tdm_payload_required",
  runtimeImportReadyNow: false,
  sourceAcquisitionReadyToSelectAgainNow: false
} as const;

const WRONG_LANE_AND_FREQUENT_COMBINATION_MONITORING_CARRY_FORWARD = {
  artifact: "wrong_lane_and_frequent_combination_monitoring_carry_forward",
  standingMandate: "reproduce_trace_document_or_easy_bounded_fix_before_any_value_or_lane_promotion",
  watchVariants: [
    "small_layer_reorder",
    "duplicate_or_many_layer_stack",
    "flat_list_triple_leaf_double_leaf_lined_massive_flip",
    "masonry_lined_massive_boundary",
    "raw_floor_role_inference",
    "near_source_and_material_alias",
    "hostile_api_import_input",
    "curve_digitization_provenance"
  ],
  runtimeImportReadyNow: false
} as const;

const FIELD_OUTPUT_ALIAS_HOSTILE_INPUT_CURVE_PROVENANCE_STATUS = {
  artifact: "field_output_alias_hostile_input_curve_provenance_status",
  curveProvenance: "axis_band_curve_identity_rating_derivation_and_uncertainty_required_before_curve_payload_runtime_use",
  fieldOutputLeakage:
    "field_style_outputs_can_be_live_from_lab_or_screening_basis_but_must_not_look_design_grade_without_field_overlay_owner",
  hostileInput: "api_import_unknown_non_finite_negative_and_empty_inputs_must_stay_fail_closed",
  materialAlias:
    "rockwool_glass_fiber_generic_gypsum_type_c_mlv_and_plaster_must_not_coalesce_without_source_tolerance_owner",
  nearSourceFalsePromotion:
    "knauf_british_gypsum_nrc_rockwool_usg_ng_gp_pabco_certainteed_context_rows_do_not_promote_runtime_without_exact_mapping",
  nextBoundedGuardSelected: "field_output_lab_screening_leakage_guard_v1",
  runtimeImportReadyNow: false
} as const;

const V20_RERANK_CANDIDATES: readonly V20Candidate[] = [
  {
    currentPosture:
      "gate_u_confirmed_uris_identity_but_no_rights_safe_source_owned_curve_payload_or_authorized_local_tdm_payload_exists",
    docOwner: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
    firstMissingRequirement: "manual_rights_safe_uris_2006_packet_or_authorized_source_owned_band_curve_payload",
    id: "source_packet_absence_closeout_or_manual_external_dependency_hold",
    protectedNegativeBoundaries: [
      "metadata_only_not_source_packet",
      "tdm_link_without_payload_not_runtime",
      "nrc_2024_comparator_boundary_still_not_local_runtime",
      "rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests"
    ],
    rank: 1,
    readiness: {
      boundedGuardReadyToSelect: false,
      curveProvenanceOwnerNamed: false,
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: false,
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
      "gate_u_was_the_fresh_acquisition_attempt; without_a_packet_the_honest_next_step_is_to_hold_the_dependency_and_select_a_source_independent_guard",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
    userVisibleRisk: "rw41_can_still_be_misread_as_fixed_if_source_absence_is_not_kept_prominent",
    validationScope: ["gate_u_closeout_carry_forward", "triple_leaf_handoff_refresh"]
  },
  {
    currentPosture:
      "field_style_outputs_are_live_on_some_low_confidence_or_screening_lanes_and_can_look_more_design_grade_than_their_basis_allows",
    docOwner: "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
    executableTestOwner: "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
    firstMissingRequirement:
      "inventory_and_visible_wording_guard_for_rprime_dntw_lprimentw_lab_screening_and_field_overlay_basis",
    id: "field_output_lab_screening_leakage_guard",
    protectedNegativeBoundaries: [
      "lab_basis_does_not_make_rprime_or_dntw_design_grade",
      "screening_basis_does_not_make_rprime_dntw_or_lprimentw_exact",
      "missing_field_overlay_owner_blocks_design_grade_output_copy",
      "paired_engine_web_report_visible_tests_required_before_copy_or_support_movement"
    ],
    rank: 2,
    readiness: {
      boundedGuardReadyToSelect: true,
      curveProvenanceOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: true,
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
      "unlike_the_blocked_uris_packet_this_is_a_bounded_guard_slice_that_can_improve_result_honesty_without_source_or_value_promotion",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
    userVisibleRisk: "rprime_dntw_and_lprimentw_can_look_precise_even_when_the_underlying_route_is_lab_screening_or_low_confidence",
    validationScope: [
      "field_output_lab_screening_leakage_guard_gate_a",
      "engine_low_confidence_field_output_snapshots",
      "web_output_card_and_report_copy_inventory",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "material_aliases_and_near_source_rows_remain_context_only_after_uris_gate_u_found_no_packet",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "per_role_source_owned_material_mapping_and_tolerance_for_rockwool_vs_glass_fiber_generic_gypsum_vs_type_c_mlv_plaster",
    id: "material_alias_and_near_source_false_promotion_guard",
    protectedNegativeBoundaries: [
      "material_alias_coalescing",
      "near_source_false_promotion",
      "manufacturer_context_rows_remain_context_only"
    ],
    rank: 3,
    readiness: {
      boundedGuardReadyToSelect: false,
      curveProvenanceOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: false,
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
      "still_important_but_no_new_mapping_or_tolerance_owner_arrived_after_gate_u; keep_it_as_a_negative_boundary",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "similar_material_names_can_accidentally_make_context_rows_look_runtime_ready",
    validationScope: ["route_source_risk_register_refresh", "future_material_alias_guard"]
  },
  {
    currentPosture: "hostile_input_and_curve_provenance_guards_are_active_without_a_new_payload_or caller gap",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_source_payload_or_api_import_surface_that_needs_invalid_input_fail_closed_or_digitization_qc_movement",
    id: "hostile_input_and_curve_provenance_guard",
    protectedNegativeBoundaries: [
      "hostile_api_input",
      "curve_digitization_provenance",
      "unknown_non_finite_negative_inputs_do_not_yield_exact_support",
      "graph_rows_need_axis_band_rating_derivation_and_uncertainty"
    ],
    rank: 4,
    readiness: {
      boundedGuardReadyToSelect: false,
      curveProvenanceOwnerNamed: true,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: false,
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
      "standing_guard_remains_mandatory_but_v20_found_no_new_bounded_hostile_input_or_digitization_fix_ahead_of_field_output_honesty",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "invalid_imports_or_bad_digitized_curves_can_create_precise_looking_answers_without_source_truth",
    validationScope: ["route_source_risk_register_refresh", "future_source_packet_qc_gate"]
  },
  {
    currentPosture: "post_uris_rerank_found_no_concrete_source_ready_wall_or_floor_row_with_complete_ownership",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
    firstMissingRequirement:
      "complete_topology_metric_material_tolerance_negative_boundary_and_visible_test_chain_for_a_specific_row",
    id: "next_source_ready_wall_or_floor_row",
    protectedNegativeBoundaries: [
      "no_source_ready_candidate_must_not_force_runtime_promotion",
      "official_locator_is_not_enough_without_mapping_tolerance_and_visible_tests"
    ],
    rank: 5,
    readiness: {
      boundedGuardReadyToSelect: false,
      curveProvenanceOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: false,
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
    reason: "all_recent_source_rows_remain_context_mapping_or_tolerance_blocked",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk: "a_source_locator_can_be_mistaken_for_an_exact_dyn_echo_runtime_row",
    validationScope: ["source_ready_intake_backlog"]
  },
  {
    currentPosture: "available_only_if_no_actionable_source_or_bounded_guard_candidate_exists",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
    firstMissingRequirement: "use_only_if_every_candidate_above_lacks_a_next_file_with_validation_scope",
    id: "no_runtime_rerank_closeout",
    protectedNegativeBoundaries: [
      "no_runtime_closeout_must_still_name_target_file",
      "no_runtime_closeout_must_not_hide_uris_or_field_output_risks"
    ],
    rank: 6,
    readiness: {
      boundedGuardReadyToSelect: false,
      curveProvenanceOwnerNamed: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      fieldOutputPolicyOwnerNamed: false,
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
    reason: "not_selected_because_field_output_honesty_has_a_bounded_next_gate_without_runtime_value_movement",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md",
    userVisibleRisk: "pure_rerank_closeouts_can_delay_visible_honesty_guards_after_source_packet_blockers",
    validationScope: ["v20_gate_a_contract"]
  }
] as const;

const COMPLETE_TRIPLE_LEAF_BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
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

const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

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

function splitRockwoolBuildingFieldSnapshot() {
  const result = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
    airborneContext: COMPLETE_TRIPLE_LEAF_BUILDING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    dnTw: result.metrics.estimatedDnTwDb,
    family: result.dynamicAirborneTrace?.detectedFamily,
    fieldBasis: result.ratings.field?.basis,
    rwPrime: result.metrics.estimatedRwPrimeDb,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation v20 Gate A contract", () => {
  it("lands v20 Gate A no-runtime and selects the field-output leakage guard", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt",
      latestClosedSlice: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "field_output_lab_screening_leakage_guard_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
      selectedRouteFamily: "field_output_lab_screening_leakage_guard_no_runtime",
      selectionStatus:
        "selected_field_output_lab_screening_leakage_guard_after_v20_rerank_found_no_source_ready_runtime_candidate_and_uris_packet_absent",
      sliceId: "calculator_source_gap_revalidation_v20",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries Gate U source-packet absence forward as an external dependency, not a runtime lane", () => {
    expect(URIS_2006_GATE_U_ACQUISITION_CLOSEOUT_SUMMARY).toEqual({
      artifact: "uris_2006_gate_u_acquisition_closeout_summary",
      exactSourceValidatedNow: false,
      firstBlockingRequirement: "rights_safe_source_owned_curve_payload_absent",
      groupedSplitRockwoolAnswer: "Rw 41",
      groupedSplitRockwoolPosture: "low_confidence_multileaf_screening_blend_not_fixed_not_exact",
      runtimeImportReadyNow: false,
      sourceIdentityConfirmed: true,
      sourcePacketAvailableNow: false
    });

    expect(SOURCE_PACKET_ABSENCE_AND_EXTERNAL_DEPENDENCY_CARRY_FORWARD).toMatchObject({
      artifact: "source_packet_absence_and_external_dependency_carry_forward",
      externalDependency: "manual_rights_safe_source_packet_or_authorized_tdm_payload_required",
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelectAgainNow: false
    });
    expect(SOURCE_PACKET_ABSENCE_AND_EXTERNAL_DEPENDENCY_CARRY_FORWARD.blockedPayloads).toContain(
      "nrc_2024_comparator_graph_rows_not_local_rockwool_runtime"
    );
  });

  it("keeps wrong-lane monitoring active for frequent combinations after the Uris blocker", () => {
    expect(WRONG_LANE_AND_FREQUENT_COMBINATION_MONITORING_CARRY_FORWARD).toEqual({
      artifact: "wrong_lane_and_frequent_combination_monitoring_carry_forward",
      standingMandate: "reproduce_trace_document_or_easy_bounded_fix_before_any_value_or_lane_promotion",
      watchVariants: [
        "small_layer_reorder",
        "duplicate_or_many_layer_stack",
        "flat_list_triple_leaf_double_leaf_lined_massive_flip",
        "masonry_lined_massive_boundary",
        "raw_floor_role_inference",
        "near_source_and_material_alias",
        "hostile_api_import_input",
        "curve_digitization_provenance"
      ],
      runtimeImportReadyNow: false
    });
  });

  it("proves the next guard target: low-confidence screening can still expose precise-looking field outputs", () => {
    const snapshot = splitRockwoolBuildingFieldSnapshot();

    expect(snapshot).toMatchObject({
      confidence: "medium",
      dnTw: 52,
      family: "multileaf_multicavity",
      fieldBasis: "apparent_curve_overlay + 10log10(0.32V/S)",
      rwPrime: 50,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["R'w", "DnT,w"],
      unsupported: []
    });
    expect(snapshot.warnings).toContain("family physics prediction");
    expect(snapshot.warnings).toContain("Dynamic airborne confidence is medium");
  });

  it("keeps alias, near-source, hostile-input, and curve-provenance boundaries explicit", () => {
    expect(FIELD_OUTPUT_ALIAS_HOSTILE_INPUT_CURVE_PROVENANCE_STATUS).toEqual({
      artifact: "field_output_alias_hostile_input_curve_provenance_status",
      curveProvenance:
        "axis_band_curve_identity_rating_derivation_and_uncertainty_required_before_curve_payload_runtime_use",
      fieldOutputLeakage:
        "field_style_outputs_can_be_live_from_lab_or_screening_basis_but_must_not_look_design_grade_without_field_overlay_owner",
      hostileInput: "api_import_unknown_non_finite_negative_and_empty_inputs_must_stay_fail_closed",
      materialAlias:
        "rockwool_glass_fiber_generic_gypsum_type_c_mlv_and_plaster_must_not_coalesce_without_source_tolerance_owner",
      nearSourceFalsePromotion:
        "knauf_british_gypsum_nrc_rockwool_usg_ng_gp_pabco_certainteed_context_rows_do_not_promote_runtime_without_exact_mapping",
      nextBoundedGuardSelected: "field_output_lab_screening_leakage_guard_v1",
      runtimeImportReadyNow: false
    });
  });

  it("ranks v20 candidates and selects exactly one bounded next slice", () => {
    expect(V20_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "source_packet_absence_closeout_or_manual_external_dependency_hold",
      "field_output_lab_screening_leakage_guard",
      "material_alias_and_near_source_false_promotion_guard",
      "hostile_input_and_curve_provenance_guard",
      "next_source_ready_wall_or_floor_row",
      "no_runtime_rerank_closeout"
    ]);
    expect(V20_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(V20_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V20_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V20_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "field_output_lab_screening_leakage_guard",
        readiness: expect.objectContaining({
          boundedGuardReadyToSelect: true,
          fieldOutputPolicyOwnerNamed: true,
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false
        }),
        targetFile: "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts"
      })
    ]);
  });

  it("keeps active docs aligned with v20 and the selected field-output guard slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A.targetFirstGateFile);
    }

    const v20Plan = readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_PLAN.md");
    expect(v20Plan).toContain("source_packet_absence_closeout_or_manual_external_dependency_hold");
    expect(v20Plan).toContain("field_output_lab_screening_leakage_guard");
    expect(v20Plan).toContain("no_runtime_rerank_closeout");
  });
});
