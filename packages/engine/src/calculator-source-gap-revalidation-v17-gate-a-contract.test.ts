import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  frequentCombinationSentinelNamed: boolean;
  laneDriftWatchlistNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceOwnerNamed: boolean;
};

type V17Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing",
  latestClosedSlice: "floor_raw_role_inference_guardrail_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "common_combination_lane_misclassification_sentinel_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  selectedRouteFamily: "common_combination_lane_sentinel_no_runtime",
  selectionStatus:
    "selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring",
  sliceId: "calculator_source_gap_revalidation_v17",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts",
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts",
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts",
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_PLAN.md",
  "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const ALWAYS_ON_LANE_MONITORING_MANDATE = {
  actionWhenSuspicious: "note_test_document_or_easy_fix",
  appliesToEveryFutureCalculatorSlice: true,
  mandatoryToken: "standing_lane_misclassification_monitoring_mandate",
  minimumResponse: [
    "reproduce_with_focused_engine_or_web_test_when_possible",
    "record_route_family_source_lane_support_confidence_output_and_warning_snapshot",
    "document_as_active_risk_when_fix_is_not_bounded",
    "implement_easy_fix_immediately_only_when_small_bounded_and_test_backed",
    "keep_outputs_fail_closed_or_visibly_screening_until_exact_topology_source_and_tolerance_owners_exist"
  ],
  watchedFrequentCombinationFamilies: [
    "rockwool_like_triple_leaf_and_double_leaf_wall_stacks",
    "lsf_and_timber_stud_double_board_wall_stacks",
    "lined_masonry_and_masonry_boundary_wall_stacks",
    "aac_pumice_concrete_board_fill_gap_hybrid_stacks",
    "clt_and_open_box_floor_stacks",
    "raw_floor_order_and_duplicate_role_floor_stacks",
    "near_source_manufacturer_rows_with_stc_iic_astc_or_field_metrics",
    "hostile_api_or_import_layer_payloads"
  ]
} as const;

const POST_FLOOR_GUARD_SUMMARY = {
  rawFloorPromptGuardLanded: true,
  rawParityGreenRowsStillLive: true,
  roleTaggedExactRowsRemainPromotedPath: true,
  arbitraryRawReorderInvarianceClaimed: false,
  runtimeImportReadyNow: false,
  selectedNext: "calculator_source_gap_revalidation_v17"
} as const;

const ROCKWOOL_TRIPLE_LEAF_SOURCE_PACKET_STATUS = {
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  flatListWrongLaneSymptomGuarded: true,
  requiredBeforeRuntime: [
    "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload",
    "page_figure_table_locator",
    "band_vector_or_digitization_payload",
    "rating_derivation_and_uncertainty",
    "local_gypsum_board_rockwool_mlv_and_gypsum_plaster_mapping",
    "grouped_topology_runtime_guard",
    "paired_engine_and_web_visible_runtime_tests"
  ],
  runtimeImportReadyNow: false,
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  sourceValidatedNow: false
} as const;

const CLOSED_SOURCE_CONTEXT = {
  closedManufacturerFamilies: [
    "knauf_wall_systems_source_pack_extraction_v1",
    "british_gypsum_white_book_source_pack_extraction_v1",
    "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
    "usg_acoustical_assemblies_source_pack_extraction_v1",
    "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
    "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
    "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
    "certainteed_silentfx_nrc_astc_source_pack_extraction_v1"
  ],
  commonMissingRequirements: [
    "exact_live_topology_mapping",
    "direct_dyn_echo_metric_owner_or_explicit_rejection",
    "local_material_mapping",
    "tolerance_owner",
    "protected_negative_boundaries",
    "paired_engine_and_web_visible_tests"
  ],
  ga600CurrentRowPayloadAvailable: false,
  runtimeImportReadyNow: false
} as const;

const V17_RERANK_CANDIDATES: readonly V17Candidate[] = [
  {
    currentPosture:
      "always_on_wrong_lane_monitoring_needed_after_wall_flat_list_and_floor_raw_role_guards_landed",
    docOwner: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
    executableTestOwner:
      "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
    firstMissingRequirement:
      "build_a_frequent_wall_floor_combination_sentinel_matrix_that_records_route_family_source_lane_support_confidence_output_values_warning_copy_small_reorder_duplicate_many_layer_boundary_and_hostile_input_variants_then_classifies_each_suspicious_result_as_note_test_document_or_easy_fix_before_any_future_runtime_or_source_promotion",
    id: "common_combination_lane_misclassification_sentinel",
    protectedNegativeBoundaries: [
      "standing_lane_misclassification_monitoring_mandate",
      "note_test_document_or_easy_fix",
      "frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk",
      "easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests"
    ],
    rank: 1,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      frequentCombinationSentinelNamed: true,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "after_floor_raw_role_prompt_guard_landed_the_user_reinforced_that_every_future_step_must_watch_common_wall_floor_combinations_for_wrong_route_family_wrong_source_lane_absurd_values_near_source_false_promotion_field_output_leakage_material_aliasing_and_hostile_input_failures_so_the_next_high_value_no_runtime_slice_is_a_dedicated_sentinel_matrix_that_keeps_this_behavior_executable",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
    userVisibleRisk:
      "a_frequently_used_wall_or_floor_stack_can_look_plausible_while_a_small_edit_or_import_payload_moved_it_into_the_wrong_solver_lane_or_wrong_source_confidence_posture",
    validationScope: [
      "common_combination_lane_sentinel_gate_a_contract",
      "route_source_risk_register_refresh",
      "source_ready_intake_backlog_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "documented_floor_exactness_edge_after_role_prompt_guard_landing",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner: "packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts",
    firstMissingRequirement:
      "selected_exact_floor_family_with_just_inside_just_outside_tolerance_corridor_tests_visible_support_wording_and_raw_role_negative_boundaries_before_new_exact_floor_support_or_confidence_promotion",
    id: "floor_tolerance_edge_promotion_guard",
    protectedNegativeBoundaries: [
      "new_exact_floor_rows_need_role_tagged_reorder_tests",
      "raw_order_and_duplicate_role_negatives_must_accompany_new_exact_floor_rows",
      "visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs"
    ],
    rank: 2,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      frequentCombinationSentinelNamed: false,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceOwnerNamed: false
    },
    reason:
      "floor_tolerance_edge_work_is_still_real_but_should_follow_the_global_frequent_combination_sentinel_so_future_exact_floor_rows_are_watched_in_the_same_wrong_lane_matrix_as_common_wall_families",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk:
      "tiny_floor_thickness_edits_can_change_exact_bound_or_screening_status_without_clear_role_and_tolerance_explanation",
    validationScope: ["floor_order_existing_matrices", "route_source_risk_register"]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t_and_floor_guard",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_with_rating_derivation_uncertainty_local_material_mapping_grouped_topology_runtime_guard_and_paired_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "gate_e_flat_list_guard_does_not_create_source_validated_triple_leaf_runtime",
      "manufacturer_stc_astc_iic_or_ga600_context_do_not_substitute_for_uris_two_cavity_curves"
    ],
    rank: 3,
    readiness: {
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      frequentCombinationSentinelNamed: true,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "the_original_rockwool_defect_remains_urgent_but_selecting_it_now_would_repeat_the_paused_source_packet_lane_without_new_rights_safe_payload",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "users_can_mistake_the_guarded_rw_41_screening_answer_for_a_fixed_source_validated_triple_leaf_solver",
    validationScope: ["gate_t_handoff_context", "gate_e_guard_context", "route_source_risk_register"]
  },
  {
    currentPosture: "official_or_authoritative_context_without_runtime_ready_mapping",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_rights_safe_current_row_payloads_with_exact_design_rows_dyn_echo_metric_owner_material_mapping_tolerance_negative_boundaries_and_visible_tests_before_source_extraction_or_runtime_selection",
    id: "closed_manufacturer_and_ga600_context",
    protectedNegativeBoundaries: [
      "closed_manufacturer_rows_remain_context_only",
      "ga600_current_manual_context_requires_rights_safe_row_payload_before_extraction_or_runtime",
      "near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006"
    ],
    rank: 4,
    readiness: {
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      frequentCombinationSentinelNamed: false,
      laneDriftWatchlistNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceOwnerNamed: false
    },
    reason:
      "closed_source_context_and_ga600_remain_useful_for_backlog_but_do_not_gain_import_readiness_from_the_floor_prompt_guard_or_user_monitoring_mandate",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "near_source_false_promotion_can_make_official_context_look_more_exact_than_the_live_stack_can_defend",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register"]
  }
] as const;

const SELECTED_COMMON_SENTINEL_SCOPE = {
  firstGate: "gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime",
  requiredArtifacts: [
    "frequent_wall_floor_combination_inventory",
    "route_family_source_lane_support_confidence_output_warning_snapshot_matrix",
    "small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants",
    "note_test_document_or_easy_fix_decision_log",
    "paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement",
    "next_closeout_or_bounded_easy_fix_decision"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  targetFirstGateFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts"
} as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_OUTPUTS: readonly RequestedOutputId[] = ["Rw"];
const FLOOR_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];

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

const RAW_OPEN_BOX_FLOOR_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 100 },
  { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { materialId: "laminate_flooring", thicknessMm: 8 },
  { materialId: "eps_underlay", thicknessMm: 3 },
  { materialId: "generic_fill", thicknessMm: 50 },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { materialId: "open_box_timber_slab", thicknessMm: 370 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function buildExactFloorLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactSystem(id).match, mode);
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function warningsContain(warnings: readonly string[], pattern: RegExp): boolean {
  return warnings.some((warning) => pattern.test(warning));
}

describe("calculator source-gap revalidation v17 Gate A contract", () => {
  it("lands v17 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing",
      latestClosedSlice: "floor_raw_role_inference_guardrail_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "common_combination_lane_misclassification_sentinel_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
      selectedRouteFamily: "common_combination_lane_sentinel_no_runtime",
      selectionStatus:
        "selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring",
      sliceId: "calculator_source_gap_revalidation_v17",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("turns the user's always-on wrong-lane rule into an executable mandate", () => {
    expect(ALWAYS_ON_LANE_MONITORING_MANDATE).toEqual({
      actionWhenSuspicious: "note_test_document_or_easy_fix",
      appliesToEveryFutureCalculatorSlice: true,
      mandatoryToken: "standing_lane_misclassification_monitoring_mandate",
      minimumResponse: [
        "reproduce_with_focused_engine_or_web_test_when_possible",
        "record_route_family_source_lane_support_confidence_output_and_warning_snapshot",
        "document_as_active_risk_when_fix_is_not_bounded",
        "implement_easy_fix_immediately_only_when_small_bounded_and_test_backed",
        "keep_outputs_fail_closed_or_visibly_screening_until_exact_topology_source_and_tolerance_owners_exist"
      ],
      watchedFrequentCombinationFamilies: [
        "rockwool_like_triple_leaf_and_double_leaf_wall_stacks",
        "lsf_and_timber_stud_double_board_wall_stacks",
        "lined_masonry_and_masonry_boundary_wall_stacks",
        "aac_pumice_concrete_board_fill_gap_hybrid_stacks",
        "clt_and_open_box_floor_stacks",
        "raw_floor_order_and_duplicate_role_floor_stacks",
        "near_source_manufacturer_rows_with_stc_iic_astc_or_field_metrics",
        "hostile_api_or_import_layer_payloads"
      ]
    });
  });

  it("verifies the floor prompt guard is landed but not a source-ready runtime import", () => {
    const rawParity = calculateAssembly(RAW_OPEN_BOX_FLOOR_STACK, { targetOutputs: FLOOR_OUTPUTS });
    const rawDrift = calculateAssembly(buildExactFloorLayers("tuas_x4_clt140_measured_2026", "raw"), {
      targetOutputs: FLOOR_OUTPUTS
    });

    expect(POST_FLOOR_GUARD_SUMMARY).toEqual({
      rawFloorPromptGuardLanded: true,
      rawParityGreenRowsStillLive: true,
      roleTaggedExactRowsRemainPromotedPath: true,
      arbitraryRawReorderInvarianceClaimed: false,
      runtimeImportReadyNow: false,
      selectedNext: "calculator_source_gap_revalidation_v17"
    });
    expect(rawParity.floorSystemMatch?.system.id).toBe("tuas_r5b_open_box_timber_measured_2026");
    expect(warningsContain(rawParity.warnings, /does not claim arbitrary raw floor reorder value invariance/i)).toBe(
      true
    );
    expect(rawDrift.floorSystemMatch ?? null).toBeNull();
    expect(rawDrift.supportedTargetOutputs).toEqual(["Rw"]);
    expect(warningsContain(rawDrift.warnings, /Floor roles needed before impact output promotion/i)).toBe(true);
  });

  it("keeps the rockwool triple-leaf exact lane paused while preserving the flat-list guard", () => {
    const grouped = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const swapped = calculateAssembly(swap(SPLIT_ROCKWOOL_STACK, 3, 4), {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });

    expect(ROCKWOOL_TRIPLE_LEAF_SOURCE_PACKET_STATUS).toMatchObject({
      currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
      flatListWrongLaneSymptomGuarded: true,
      runtimeImportReadyNow: false,
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      sourceValidatedNow: false
    });
    expect(ROCKWOOL_TRIPLE_LEAF_SOURCE_PACKET_STATUS.requiredBeforeRuntime).toContain(
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload"
    );
    expect(grouped.metrics.estimatedRwDb).toBe(41);
    expect(grouped.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(swapped.dynamicAirborneTrace?.strategy).toBe(
      "multileaf_screening_blend_fail_closed_until_grouped_topology"
    );
  });

  it("keeps closed manufacturer rows and GA-600 context out of runtime promotion", () => {
    expect(CLOSED_SOURCE_CONTEXT.closedManufacturerFamilies).toHaveLength(8);
    expect(CLOSED_SOURCE_CONTEXT.runtimeImportReadyNow).toBe(false);
    expect(CLOSED_SOURCE_CONTEXT.ga600CurrentRowPayloadAvailable).toBe(false);
    expect(CLOSED_SOURCE_CONTEXT.commonMissingRequirements).toContain("exact_live_topology_mapping");
    expect(CLOSED_SOURCE_CONTEXT.commonMissingRequirements).toContain("tolerance_owner");
    expect(CLOSED_SOURCE_CONTEXT.commonMissingRequirements).toContain("paired_engine_and_web_visible_tests");
  });

  it("reranks after the floor prompt guard with every source candidate fail-closed", () => {
    expect(V17_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "common_combination_lane_misclassification_sentinel",
      "floor_tolerance_edge_promotion_guard",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_manufacturer_and_ga600_context"
    ]);
    expect(V17_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4]);
    expect(new Set(V17_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V17_RERANK_CANDIDATES.length
    );
    expect(V17_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V17_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V17_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)).toBe(
      true
    );
    expect(V17_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 120)).toBe(true);
  });

  it("selects the common-combination lane sentinel because no source-ready runtime candidate exists", () => {
    expect(V17_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "common_combination_lane_misclassification_sentinel",
        rank: 1,
        readiness: expect.objectContaining({
          exactLiveTopologyMappingNamed: false,
          exactSourceRowsNamed: false,
          frequentCombinationSentinelNamed: true,
          laneDriftWatchlistNamed: true,
          pairedEngineVisibleTestsNamed: true,
          pairedWebVisibleTestsNamed: true,
          runtimeImportReadyNow: false,
          sourceLocatorConcrete: false,
          toleranceOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected sentinel scope before any future route or output movement", () => {
    expect(SELECTED_COMMON_SENTINEL_SCOPE).toEqual({
      firstGate: "gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime",
      requiredArtifacts: [
        "frequent_wall_floor_combination_inventory",
        "route_family_source_lane_support_confidence_output_warning_snapshot_matrix",
        "small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants",
        "note_test_document_or_easy_fix_decision_log",
        "paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement",
        "next_closeout_or_bounded_easy_fix_decision"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
      targetFirstGateFile: "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the selected no-runtime sentinel and monitoring mandate", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A.selectionStatus);
      expect(doc).toContain("frequent_wall_floor_combination_inventory");
      expect(doc).toContain("route_family_source_lane_support_confidence_output_warning_snapshot_matrix");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
