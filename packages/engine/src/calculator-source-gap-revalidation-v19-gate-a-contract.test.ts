import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  boundedFixReadyNow: boolean;
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
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

type V19Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
  latestClosedSlice: "floor_tolerance_edge_promotion_guard_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
  selectedRouteFamily: "wall_triple_leaf_uris_2006_source_packet_acquisition_no_runtime",
  selectionStatus:
    "selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate",
  sliceId: "calculator_source_gap_revalidation_v19",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts",
  "packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md",
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
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const FLOOR_TOLERANCE_EDGE_GATE_B_CLOSEOUT_SUMMARY = {
  artifact: "floor_tolerance_edge_gate_b_closeout_summary",
  exactPlus2mmInside: true,
  exactPlus2p1mmOutside: true,
  boundPlus2mmInside: true,
  boundPlus2p1mmOutside: true,
  directOfficialFloorSystemIdBypassRemainsLayerMatchNegative: true,
  runtimeImportReadyNow: false,
  supportPromotionReadyNow: false
} as const;

const ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS = {
  artifact: "rockwool_uris_2006_source_packet_status",
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  exactSourceValidatedNow: false,
  formalSourceAcquisitionSelectedNow: true,
  requiredBeforeRuntime: [
    "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload",
    "source_identity_and_page_figure_table_locator",
    "curve_identity_map",
    "band_vector_or_reproducible_digitization_payload",
    "rating_derivation_and_uncertainty",
    "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping",
    "grouped_topology_runtime_guard",
    "paired_engine_and_web_visible_runtime_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const FIELD_OUTPUT_ALIAS_HOSTILE_INPUT_CURVE_PROVENANCE_STATUS = {
  artifact: "field_output_alias_hostile_input_curve_provenance_status",
  curveProvenance: "source_owned_axis_band_curve_identity_rating_derivation_and_uncertainty_required",
  fieldOutputLeakage:
    "lab_or_screening_basis_must_not_make_rprime_dntw_or_lprime_outputs_look_design_grade_without_overlay_owner",
  hostileInput: "api_import_unknown_non_finite_negative_and_empty_inputs_must_stay_fail_closed",
  materialAlias:
    "rockwool_glass_fiber_generic_gypsum_type_c_mlv_and_plaster_must_not_coalesce_without_source_tolerance_owner",
  nearSourceFalsePromotion:
    "manufacturer_stc_iic_rw_context_rows_do_not_promote_runtime_without_exact_dyn_echo_mapping",
  runtimeImportReadyNow: false
} as const;

const V19_RERANK_CANDIDATES: readonly V19Candidate[] = [
  {
    currentPosture:
      "highest_user_impact_defect_reproduced_and_guarded_but_still_waiting_for_rights_safe_uris_2006_or_equivalent_source_owned_two_cavity_curve_packet",
    docOwner: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_rockwool_two_cavity_curve_payload_with_band_vectors_rating_derivation_uncertainty_local_material_mapping_grouped_topology_guard_negative_boundaries_and_paired_engine_web_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "nrc_2024_graph_family_remains_comparator_not_local_rockwool_runtime",
      "manufacturer_stc_iic_or_context_rows_do_not_substitute_for_uris_two_cavity_curves",
      "flat_list_multileaf_fail_closed_guard_is_not_exact_runtime"
    ],
    rank: 1,
    readiness: {
      boundedFixReadyNow: false,
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceAcquisitionReadyToSelect: true,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "after_floor_tolerance_gate_b_closed_no_runtime_the_project_should_revisit_the_unfixed_user_reported_split_rockwool_defect_first; prior Gate T paused the lane because the packet was absent, so v19 selects a formal source_packet_acquisition_gate_not_runtime_promotion",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
    userVisibleRisk:
      "users_can_still_read_the_rw_41_grouped_screening_answer_as_a_fixed_triple_leaf_calculation_if_source_acquisition_does_not_remain_explicit",
    validationScope: [
      "wall_triple_leaf_uris2006_source_packet_acquisition_gate_u",
      "gate_t_manual_packet_handoff_continuity",
      "route_source_risk_register_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture:
      "field_outputs_are_guarded_but_can_still_look_too_precise_when_a_future_runtime_lane_reuses_lab_or_screening_basis",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "field_overlay_owner_for_rprime_dntw_lprime_outputs_with_room_geometry_reverberation_flanking_policy_metric_basis_copy_and_paired_visible_report_tests",
    id: "field_output_lab_screening_leakage_guard",
    protectedNegativeBoundaries: [
      "field_output_copy_leakage_watch",
      "lab_screening_basis_does_not_make_rprime_or_dntw_exact",
      "missing_room_geometry_and_flanking_policy_blocks_design_grade_field_output"
    ],
    rank: 2,
    readiness: {
      boundedFixReadyNow: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
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
      "v19_found_no_new_bounded_field_copy_bug_after_gate_b; keep_the_guard_active_but_do_not_select_it_ahead_of_the_unfixed_rockwool_packet_lane",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "field_style_outputs_can_look_design_grade_when_the_underlying_result_is_still_lab_or_screening",
    validationScope: ["route_source_risk_register_refresh", "future_visible_field_output_guard"]
  },
  {
    currentPosture:
      "material_aliases_and_near_source_rows_are_documented_context_only_after_rockwool_usg_national_gypsum_georgia_pacific_pabco_certainteed_and_floor_guard_passes",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "per_role_source_owned_material_mapping_and_tolerance_for_rockwool_vs_glass_fiber_generic_gypsum_vs_type_c_mlv_plaster_and_manufacturer_context_rows",
    id: "material_alias_and_near_source_false_promotion_guard",
    protectedNegativeBoundaries: [
      "material_alias_coalescing",
      "near_source_false_promotion",
      "closed_manufacturer_rows_remain_context_only",
      "generic_material_names_do_not_imply_source_equivalence"
    ],
    rank: 3,
    readiness: {
      boundedFixReadyNow: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
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
      "alias_and_near_source_guards_remain_required_but_no_new_exact_mapping_or_tolerance_owner_arrived_after_floor_gate_b",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk: "official_or_similar_material_names_can_look_runtime_ready_without_role_specific_mapping",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register_refresh"]
  },
  {
    currentPosture:
      "hostile_input_and_curve_provenance_guards_are_active_but_v19_found_no_new_bounded_fix_ready_before_source_packet_acquisition",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_public_caller_or_curve_payload_that_requires_invalid_input_fail_closed_tests_or_axis_band_curve_rating_uncertainty_qc_before_runtime_use",
    id: "hostile_input_and_curve_provenance_guard",
    protectedNegativeBoundaries: [
      "hostile_api_input",
      "curve_digitization_provenance",
      "unknown_non_finite_negative_inputs_do_not_yield_exact_support",
      "graph_rows_need_axis_band_rating_derivation_and_uncertainty"
    ],
    rank: 4,
    readiness: {
      boundedFixReadyNow: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
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
      "these_are_standing_guards_for_every_future_source_or_import_path_but_no_specific_v19_runtime_or_copy_movement_is_selected",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk: "invalid_inputs_or_bad_digitization_can_create_precise_looking_values_without_source_truth",
    validationScope: ["route_source_risk_register_refresh", "future_source_packet_qc_gate"]
  },
  {
    currentPosture: "available_if_v19_finds_no_source_acquisition_or_bounded_guard_candidate",
    docOwner: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
    executableTestOwner: "packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts",
    firstMissingRequirement:
      "use_only_if_every_candidate_above_lacks_source_acquisition_value_and_no_bounded_guard_or_copy_fix_is_justified",
    id: "no_runtime_source_gap_rerank_closeout",
    protectedNegativeBoundaries: [
      "no_source_ready_candidate_must_not_force_runtime_promotion",
      "rerank_closeout_must_still_name_target_file_and_validation_scope"
    ],
    rank: 5,
    readiness: {
      boundedFixReadyNow: false,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
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
    reason: "not_selected_because_the_uris_2006_source_packet_acquisition_lane_is_the_higher_value_next_step",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md",
    userVisibleRisk: "pure_rerank_closeouts_can_delay_the_highest_impact_user_reported_defect",
    validationScope: ["v19_gate_a_contract"]
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

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
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation v19 Gate A contract", () => {
  it("lands v19 Gate A no-runtime and selects Uris 2006 source-packet acquisition", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout",
      latestClosedSlice: "floor_tolerance_edge_promotion_guard_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md",
      selectedRouteFamily: "wall_triple_leaf_uris_2006_source_packet_acquisition_no_runtime",
      selectionStatus:
        "selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate",
      sliceId: "calculator_source_gap_revalidation_v19",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries floor tolerance-edge Gate B as protected evidence, not a promotion", () => {
    expect(FLOOR_TOLERANCE_EDGE_GATE_B_CLOSEOUT_SUMMARY).toEqual({
      artifact: "floor_tolerance_edge_gate_b_closeout_summary",
      exactPlus2mmInside: true,
      exactPlus2p1mmOutside: true,
      boundPlus2mmInside: true,
      boundPlus2p1mmOutside: true,
      directOfficialFloorSystemIdBypassRemainsLayerMatchNegative: true,
      runtimeImportReadyNow: false,
      supportPromotionReadyNow: false
    });
  });

  it("keeps grouped and flat-list split-rockwool behavior screening/fail-closed", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4), WALL_LAB_CONTEXT);

    expect(grouped).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
  });

  it("records the Uris packet status and blocks exact runtime until the packet and mappings exist", () => {
    expect(ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS).toMatchObject({
      artifact: "rockwool_uris_2006_source_packet_status",
      currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
      exactSourceValidatedNow: false,
      formalSourceAcquisitionSelectedNow: true,
      runtimeImportReadyNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
    expect(ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS.requiredBeforeRuntime).toEqual([
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload",
      "source_identity_and_page_figure_table_locator",
      "curve_identity_map",
      "band_vector_or_reproducible_digitization_payload",
      "rating_derivation_and_uncertainty",
      "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping",
      "grouped_topology_runtime_guard",
      "paired_engine_and_web_visible_runtime_tests"
    ]);
  });

  it("keeps field-output, material alias, hostile-input, and curve-provenance guards explicit", () => {
    expect(FIELD_OUTPUT_ALIAS_HOSTILE_INPUT_CURVE_PROVENANCE_STATUS).toEqual({
      artifact: "field_output_alias_hostile_input_curve_provenance_status",
      curveProvenance: "source_owned_axis_band_curve_identity_rating_derivation_and_uncertainty_required",
      fieldOutputLeakage:
        "lab_or_screening_basis_must_not_make_rprime_dntw_or_lprime_outputs_look_design_grade_without_overlay_owner",
      hostileInput: "api_import_unknown_non_finite_negative_and_empty_inputs_must_stay_fail_closed",
      materialAlias:
        "rockwool_glass_fiber_generic_gypsum_type_c_mlv_and_plaster_must_not_coalesce_without_source_tolerance_owner",
      nearSourceFalsePromotion:
        "manufacturer_stc_iic_rw_context_rows_do_not_promote_runtime_without_exact_dyn_echo_mapping",
      runtimeImportReadyNow: false
    });
  });

  it("ranks v19 candidates and selects exactly one next slice", () => {
    expect(V19_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane",
      "field_output_lab_screening_leakage_guard",
      "material_alias_and_near_source_false_promotion_guard",
      "hostile_input_and_curve_provenance_guard",
      "no_runtime_source_gap_rerank_closeout"
    ]);
    expect(V19_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5]);
    expect(V19_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V19_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V19_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane",
        readiness: expect.objectContaining({
          rightsSafeCurrentPayloadAvailable: false,
          runtimeImportReadyNow: false,
          sourceAcquisitionReadyToSelect: true
        }),
        targetFile: "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts"
      })
    ]);
  });

  it("keeps active docs aligned with v19 and the selected Gate U source-acquisition slice", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A.selectionStatus);
      expect(contents).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A.targetFirstGateFile);
    }

    const v19Plan = readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md");
    expect(v19Plan).toContain("Candidate Buckets To Evaluate");
    expect(v19Plan).toContain("wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane");
    expect(v19Plan).toContain("field_output_lab_screening_leakage_guard");
    expect(v19Plan).toContain("hostile_input_and_curve_provenance_guard");
  });
});
