import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RuntimeReadiness = {
  commonCombinationSentinelClosed: boolean;
  exactLiveTopologyMappingNamed: boolean;
  exactSourceRowsNamed: boolean;
  floorRolePromptPolicyNamed: boolean;
  frequentCombinationSentinelNamed: boolean;
  localMaterialMappingNamed: boolean;
  metricOwnerNamed: boolean;
  pairedEngineVisibleTestsNamed: boolean;
  pairedWebVisibleTestsNamed: boolean;
  protectedNegativeBoundariesNamed: boolean;
  rightsSafeCurrentPayloadAvailable: boolean;
  runtimeImportReadyNow: false;
  sourceLocatorConcrete: boolean;
  toleranceCorridorOwnerNamed: boolean;
};

type V18Candidate = {
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

const CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
  latestClosedSlice: "common_combination_lane_misclassification_sentinel_v1",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "floor_tolerance_edge_promotion_guard_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
  selectedRouteFamily: "floor_exact_tolerance_edge_guard_no_runtime",
  selectionStatus:
    "selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed",
  sliceId: "calculator_source_gap_revalidation_v18",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts",
  "packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts",
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
  "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const COMMON_COMBINATION_GATE_B_REPROBE_SUMMARY = {
  gateBFindingsToken: "gate_b_reprobe_findings",
  groupedSplitRockwool: {
    currentPosture: "split_rockwool_grouped_rw41_blocked_source_packet",
    rw: 41,
    sourceValidatedNow: false,
    strategy: "multileaf_screening_blend"
  },
  flatListSplitRockwool: {
    currentPosture: "split_rockwool_flat_swap_fail_closed_guard_green",
    rw: 42,
    strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
  },
  classicFramedFlatList: {
    currentPosture: "classic_framed_adjacent_swap_fail_closed_guard_green",
    rw: 33,
    strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
  },
  rawFloorCarryForward: [
    "raw_floor_role_inference",
    "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed"
  ],
  runtimeImportReadyNow: false,
  selectedNextInput: "common_combination_gate_b_reprobe_summary"
} as const;

const SENTINEL_GUARD_GREEN_AND_FAIL_CLOSED_BOUNDARY_CARRY_FORWARD = {
  standingMandate: "standing_lane_misclassification_monitoring_mandate",
  responseRule: "note_test_document_or_easy_fix",
  guardGreenBoundaries: [
    "split_rockwool_flat_swap_fail_closed_guard_green",
    "classic_framed_adjacent_swap_fail_closed_guard_green",
    "raw_floor_open_box_parity_green",
    "raw_floor_clt_role_prompt_guard_green"
  ],
  documentedFailClosedBoundaries: [
    "split_rockwool_grouped_rw41_blocked_source_packet",
    "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
    "near_source_alias_context_only_watch",
    "field_output_copy_leakage_watch",
    "hostile_api_import_fail_closed_green",
    "curve_digitization_provenance_blocked_source_qc"
  ],
  selectedNextInput: "sentinel_guard_green_and_fail_closed_boundary_carry_forward"
} as const;

const ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS = {
  currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
  exactSourceValidatedNow: false,
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
  selectedGateAArtifact: "rockwool_uris_2006_source_packet_status",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
} as const;

const FLOOR_RAW_ROLE_FIELD_NEAR_SOURCE_HOSTILE_INPUT_AND_CURVE_STATUS = {
  fieldOutputLeakage: "field_output_leakage_policy_still_required_before_new_rw_dnt_or_lprime_copy_promotion",
  floorRolePromptGuardLanded: true,
  hostileInputGuardRequired: "hostile_api_input",
  materialAliasPolicyRequired: "material_alias_coalescing",
  nearSourceFalsePromotion: "near_source_false_promotion",
  provenanceRequired: "curve_digitization_provenance",
  rawFloorRoleInference: "raw_floor_role_inference",
  selectedGateAArtifact:
    "floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status"
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
  exactFloorRowsAvailable: EXACT_FLOOR_SYSTEMS.length,
  boundFloorRowsAvailable: BOUND_FLOOR_SYSTEMS.length,
  commonMissingRequirements: [
    "exact_live_topology_mapping",
    "dyn_echo_metric_owner_or_explicit_rejection",
    "local_material_mapping",
    "tolerance_corridor_owner",
    "protected_negative_boundaries",
    "paired_engine_and_web_visible_tests"
  ],
  runtimeImportReadyNow: false
} as const;

const V18_RERANK_CANDIDATES: readonly V18Candidate[] = [
  {
    currentPosture:
      "raw_floor_role_prompt_guard_landed_and_common_combination_sentinel_closed_so_the_next_actionable_floor_accuracy_risk_is_exact_floor_near_tolerance_edge_support_confidence_and_visible_wording_before_any_new_exact_floor_promotion",
    docOwner: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
    executableTestOwner: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
    firstMissingRequirement:
      "inventory_representative_exact_floor_rows_bound_floor_rows_and_near_miss_thickness_edges_then_define_just_inside_just_outside_tolerance_corridor_tests_role_tagged_reorder_negatives_raw_role_prompt_negatives_visible_support_wording_and_no_field_output_copy_promotion_before_any_new_exact_floor_support_or_confidence_change",
    id: "floor_tolerance_edge_promotion_guard",
    protectedNegativeBoundaries: [
      "new_exact_floor_rows_need_role_tagged_reorder_tests",
      "raw_order_and_duplicate_role_negatives_must_accompany_new_exact_floor_rows",
      "visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs",
      "field_output_leakage_policy_required_before_rprime_dnt_lprime_copy"
    ],
    rank: 1,
    readiness: {
      commonCombinationSentinelClosed: true,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      floorRolePromptPolicyNamed: true,
      frequentCombinationSentinelNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceCorridorOwnerNamed: false
    },
    reason:
      "after_common_combination_gate_b_reprobes_are_documented_and_gate_c_kept_the_monitoring_mandate_active_the_source_backlog_still_has_no_runtime_ready_pack; floor_tolerance_edges_are_now_the_best_bounded_no_runtime_accuracy_slice_because exact and bound floor rows already exist while new promotions still need just_inside_just_outside_corridor_role_tagged_reorder_visible_support_and_field_output_negative_boundaries",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
    userVisibleRisk:
      "a_tiny_floor_thickness_edit_can_make_an_exact_or_bound_floor_answer_look_equally_certain_without_clear_tolerance_edge_and_support_wording",
    validationScope: [
      "floor_tolerance_edge_gate_a_contract",
      "floor_raw_role_prompt_guard_continuity",
      "common_combination_sentinel_carry_forward",
      "route_source_risk_register_refresh",
      "pnpm_calculator_gate_current",
      "git_diff_check"
    ]
  },
  {
    currentPosture: "paused_waiting_rights_safe_source_packet_after_gate_t_and_common_sentinel_closeout",
    docOwner: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    executableTestOwner: "packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts",
    firstMissingRequirement:
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_with_band_vector_rating_derivation_uncertainty_local_material_mapping_grouped_topology_runtime_guard_and_paired_visible_tests",
    id: "wall_triple_leaf_uris_2006_source_packet_lane",
    protectedNegativeBoundaries: [
      "rw_41_split_rockwool_screening_result_must_not_be_presented_as_fixed_or_source_validated",
      "multileaf_screening_blend_fail_closed_until_grouped_topology_does_not_create_exact_runtime",
      "manufacturer_stc_astc_iic_or_ga600_context_do_not_substitute_for_uris_two_cavity_curves"
    ],
    rank: 2,
    readiness: {
      commonCombinationSentinelClosed: true,
      exactLiveTopologyMappingNamed: true,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: false,
      frequentCombinationSentinelNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: true,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceCorridorOwnerNamed: false
    },
    reason:
      "the_original_rockwool_defect_remains_high_priority_but_gate_t_still_blocks_exact_runtime_and_v18_found_no_new_rights_safe_payload_so selecting it now would repeat the paused packet lane rather than unlock a fix",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
    userVisibleRisk:
      "users_can_mistake_the_rw_41_grouped_screening_answer_for_a_fixed_source_validated_triple_leaf_calculation",
    validationScope: ["gate_t_handoff_context", "common_combination_gate_b_reprobes", "route_source_risk_register"]
  },
  {
    currentPosture: "official_or_authoritative_context_without_runtime_ready_mapping_or_tolerance_owner",
    docOwner: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    executableTestOwner: "packages/engine/src/calculator-route-source-risk-register-contract.test.ts",
    firstMissingRequirement:
      "new_rights_safe_current_row_payloads_with_exact_design_rows_dyn_echo_metric_owner_material_mapping_tolerance_negative_boundaries_and_visible_tests_before_source_extraction_mapping_or_runtime_selection",
    id: "closed_manufacturer_and_current_manual_context",
    protectedNegativeBoundaries: [
      "near_source_false_promotion",
      "material_alias_coalescing",
      "field_output_leakage",
      "closed_manufacturer_rows_remain_context_only"
    ],
    rank: 3,
    readiness: {
      commonCombinationSentinelClosed: true,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: true,
      floorRolePromptPolicyNamed: true,
      frequentCombinationSentinelNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: false,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: true,
      toleranceCorridorOwnerNamed: false
    },
    reason:
      "closed_manufacturer_rows_and_manual_context_remain_useful_for_backlog_but_v18_has_no_new exact material metric tolerance or visible-test owner that would make a context row import-ready",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
    userVisibleRisk:
      "near_source_official_rows_can_look_runtime_ready_even_when_the_live_stack_lacks_exact_material_metric_and_tolerance_mapping",
    validationScope: ["source_ready_intake_backlog", "route_source_risk_register"]
  },
  {
    currentPosture: "masonry_lined_massive_boundary_drift_is_documented_fail_closed_after_sentinel_reprobes",
    docOwner: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    executableTestOwner:
      "packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
    firstMissingRequirement:
      "source_owned_boundary_scan_matrix_for_aac_pumice_concrete_board_fill_gap_hybrids_with_exact_lining_or_lined_massive_classification_tolerance_owner_negative_boundaries_and_visible_support_wording_before_any_smoothing_or_family_promotion",
    id: "masonry_lined_massive_boundary_guard",
    protectedNegativeBoundaries: [
      "masonry_lined_massive_boundary_drift",
      "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
      "family_boundary_hold_preferred_over_precise_unsupported_value"
    ],
    rank: 4,
    readiness: {
      commonCombinationSentinelClosed: true,
      exactLiveTopologyMappingNamed: false,
      exactSourceRowsNamed: false,
      floorRolePromptPolicyNamed: false,
      frequentCombinationSentinelNamed: true,
      localMaterialMappingNamed: false,
      metricOwnerNamed: false,
      pairedEngineVisibleTestsNamed: true,
      pairedWebVisibleTestsNamed: false,
      protectedNegativeBoundariesNamed: true,
      rightsSafeCurrentPayloadAvailable: false,
      runtimeImportReadyNow: false,
      sourceLocatorConcrete: false,
      toleranceCorridorOwnerNamed: false
    },
    reason:
      "the_boundary_row_is_real_but_gate_b_classified_it_as_documented_fail_closed_and_the_floor_tolerance_edge_slice_has a more bounded next action with existing exact and bound rows",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
    userVisibleRisk:
      "aac_pumice_concrete_board_fill_gap_hybrids_can_appear_to_jump_between_multileaf_lined_massive_and_masonry_lanes",
    validationScope: ["common_combination_gate_b_reprobes", "route_source_risk_register"]
  }
] as const;

const SELECTED_FLOOR_TOLERANCE_EDGE_SCOPE = {
  firstGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
  requiredArtifacts: [
    "role_tagged_exact_floor_tolerance_edge_inventory",
    "bound_floor_near_miss_and_exact_drop_snapshot_matrix",
    "just_inside_just_outside_thickness_corridor_tests",
    "raw_role_prompt_and_duplicate_role_negative_boundaries",
    "visible_exact_bound_screening_support_wording_requirements",
    "next_guard_or_closeout_decision_before_any_floor_support_promotion"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
  targetFirstGateFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts"
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
const FLOOR_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

function exactFloorSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function exactFloorLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactFloorSystem(id).match, mode);
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    airborneContext: WALL_LAB_CONTEXT,
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

function floorSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: FLOOR_OUTPUTS });

  return {
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation v18 Gate A contract", () => {
  it("lands v18 Gate A without runtime or visible-surface movement", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
      latestClosedSlice: "common_combination_lane_misclassification_sentinel_v1",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "floor_tolerance_edge_promotion_guard_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
      selectedRouteFamily: "floor_exact_tolerance_edge_guard_no_runtime",
      selectionStatus:
        "selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed",
      sliceId: "calculator_source_gap_revalidation_v18",
      sourceReadyRuntimePackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("carries forward common-combination Gate B reprobes as evidence, not approval", () => {
    const grouped = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const flatSwap = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const rawOpenBox = floorSnapshot(exactFloorLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const rawCltPrompt = floorSnapshot(exactFloorLayers("tuas_x4_clt140_measured_2026", "raw"));

    expect(COMMON_COMBINATION_GATE_B_REPROBE_SUMMARY).toMatchObject({
      gateBFindingsToken: "gate_b_reprobe_findings",
      runtimeImportReadyNow: false,
      selectedNextInput: "common_combination_gate_b_reprobe_summary"
    });
    expect(grouped).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(flatSwap).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 42,
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(flatSwap.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
    expect(rawOpenBox).toMatchObject({
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(rawOpenBox.warnings).toContain("does not claim arbitrary raw floor reorder value invariance");
    expect(rawCltPrompt).toMatchObject({
      floorSystemMatchId: null,
      impactBasis: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(rawCltPrompt.warnings).toContain("Floor roles needed before impact output promotion");
  });

  it("keeps the sentinel mandate and source-blocked rockwool lane active", () => {
    expect(SENTINEL_GUARD_GREEN_AND_FAIL_CLOSED_BOUNDARY_CARRY_FORWARD).toMatchObject({
      standingMandate: "standing_lane_misclassification_monitoring_mandate",
      responseRule: "note_test_document_or_easy_fix",
      selectedNextInput: "sentinel_guard_green_and_fail_closed_boundary_carry_forward"
    });
    expect(SENTINEL_GUARD_GREEN_AND_FAIL_CLOSED_BOUNDARY_CARRY_FORWARD.documentedFailClosedBoundaries).toContain(
      "split_rockwool_grouped_rw41_blocked_source_packet"
    );
    expect(ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS).toMatchObject({
      currentScreeningAnswer: "multileaf_screening_blend_rw_41_low_confidence",
      exactSourceValidatedNow: false,
      runtimeImportReadyNow: false,
      selectedGateAArtifact: "rockwool_uris_2006_source_packet_status",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet"
    });
    expect(ROCKWOOL_URIS_2006_SOURCE_PACKET_STATUS.requiredBeforeRuntime).toContain(
      "rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload"
    );
  });

  it("records floor-role, field-output, near-source, hostile-input, and curve-provenance status before promotion", () => {
    expect(FLOOR_RAW_ROLE_FIELD_NEAR_SOURCE_HOSTILE_INPUT_AND_CURVE_STATUS).toEqual({
      fieldOutputLeakage: "field_output_leakage_policy_still_required_before_new_rw_dnt_or_lprime_copy_promotion",
      floorRolePromptGuardLanded: true,
      hostileInputGuardRequired: "hostile_api_input",
      materialAliasPolicyRequired: "material_alias_coalescing",
      nearSourceFalsePromotion: "near_source_false_promotion",
      provenanceRequired: "curve_digitization_provenance",
      rawFloorRoleInference: "raw_floor_role_inference",
      selectedGateAArtifact:
        "floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status"
    });
    expect(CLOSED_SOURCE_CONTEXT.exactFloorRowsAvailable).toBeGreaterThan(150);
    expect(CLOSED_SOURCE_CONTEXT.boundFloorRowsAvailable).toBeGreaterThan(10);
    expect(CLOSED_SOURCE_CONTEXT.runtimeImportReadyNow).toBe(false);
    expect(CLOSED_SOURCE_CONTEXT.commonMissingRequirements).toContain("tolerance_corridor_owner");
  });

  it("reranks after the common-combination sentinel and keeps every candidate no-runtime", () => {
    expect(V18_RERANK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "floor_tolerance_edge_promotion_guard",
      "wall_triple_leaf_uris_2006_source_packet_lane",
      "closed_manufacturer_and_current_manual_context",
      "masonry_lined_massive_boundary_guard"
    ]);
    expect(V18_RERANK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4]);
    expect(new Set(V18_RERANK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      V18_RERANK_CANDIDATES.length
    );
    expect(V18_RERANK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(V18_RERANK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(V18_RERANK_CANDIDATES.every((candidate) => candidate.readiness.protectedNegativeBoundariesNamed)).toBe(
      true
    );
    expect(V18_RERANK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 130)).toBe(true);
  });

  it("selects the floor tolerance-edge guard as the next bounded no-runtime accuracy slice", () => {
    expect(V18_RERANK_CANDIDATES.filter((candidate) => candidate.selectedNext)).toEqual([
      expect.objectContaining({
        id: "floor_tolerance_edge_promotion_guard",
        rank: 1,
        readiness: expect.objectContaining({
          commonCombinationSentinelClosed: true,
          exactSourceRowsNamed: true,
          floorRolePromptPolicyNamed: true,
          frequentCombinationSentinelNamed: true,
          runtimeImportReadyNow: false,
          toleranceCorridorOwnerNamed: false
        }),
        selectedNext: true,
        targetFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts"
      })
    ]);
  });

  it("defines the selected floor tolerance-edge Gate A scope", () => {
    expect(SELECTED_FLOOR_TOLERANCE_EDGE_SCOPE).toEqual({
      firstGate: "gate_a_inventory_exact_floor_tolerance_edges_no_runtime",
      requiredArtifacts: [
        "role_tagged_exact_floor_tolerance_edge_inventory",
        "bound_floor_near_miss_and_exact_drop_snapshot_matrix",
        "just_inside_just_outside_thickness_corridor_tests",
        "raw_role_prompt_and_duplicate_role_negative_boundaries",
        "visible_exact_bound_screening_support_wording_requirements",
        "next_guard_or_closeout_decision_before_any_floor_support_promotion"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md",
      targetFirstGateFile: "packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v18 Gate A selection and required artifacts", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md"),
      readRepoFile(CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A.selectedPlanningSurface),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A.selectedImplementationSlice);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A.targetFirstGateFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A.selectionStatus);
      expect(doc).toContain("common_combination_gate_b_reprobe_summary");
      expect(doc).toContain("sentinel_guard_green_and_fail_closed_boundary_carry_forward");
      expect(doc).toContain("post_sentinel_source_ready_runtime_candidate_rerank");
      expect(doc).toContain("rockwool_uris_2006_source_packet_status");
      expect(doc).toContain(
        "floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status"
      );
      expect(doc).toContain("floor_tolerance_edge_promotion_guard");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
