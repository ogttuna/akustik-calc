import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CloseoutCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

type ClosedWatchlistFinding = {
  currentPosture: string;
  id: string;
  nextOwner: string;
  protectedBoundary: string;
  runtimeImportReadyNow: false;
  sourceValidatedNow: false;
};

const POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "route_family_lane_drift_common_stack_watchlist_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateFNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
  latestRuntimeGuardStrategy: "multileaf_screening_blend_fail_closed_until_grouped_topology",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v16",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_lane_drift_guard",
  selectionStatus:
    "closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16",
  sliceId: "post_route_family_lane_drift_common_stack_watchlist_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts",
  "packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts",
  "apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const CLOSED_FINDINGS: readonly ClosedWatchlistFinding[] = [
  {
    currentPosture:
      "flat_list_split_rockwool_swap_guarded_low_confidence_multileaf_rw_42_not_source_validated",
    id: "split_rockwool_flat_list_wrong_lane_guarded",
    nextOwner: "calculator_source_gap_revalidation_v16",
    protectedBoundary: "paused_waiting_rights_safe_source_packet",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture:
      "flat_list_classic_triple_leaf_swap_guarded_low_confidence_multileaf_rw_33_not_source_validated",
    id: "classic_flat_list_wrong_lane_guarded",
    nextOwner: "calculator_source_gap_revalidation_v16",
    protectedBoundary: "ordinary_double_leaf_negative_boundary",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "aac_board_fill_gap_hybrid_remains_lined_massive_boundary_watch_item_not_guard_target",
    id: "masonry_lined_massive_boundary_drift_kept_negative",
    nextOwner: "calculator_source_gap_revalidation_v16",
    protectedBoundary: "lined_massive_boundary_hold_negative_boundary",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "raw_floor_near_source_field_output_alias_hostile_input_and_digitization_risks_remain_documented",
    id: "standing_lane_misclassification_monitoring_mandate_carries_forward",
    nextOwner: "calculator_source_gap_revalidation_v16",
    protectedBoundary: "note_test_document_or_easy_fix",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "calculator_source_gap_revalidation_v16",
    reason:
      "after_gate_e_guarded_the_rockwool_like_flat_list_wrong_lane_runtime_symptom_the_next_honest_accuracy_step_is_to_rerank_the_source_accuracy_backlog_against_the_new_guarded_posture_paused_uris_2006_source_packet_lane_closed_us_and_uk_manufacturer_rows_ga600_context_floor_wall_boundary_risks_and_remaining_common_stack_lane_misclassification_watch_items_before_any_source_import_or_exact_runtime_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_triple_leaf_accuracy_problem_remains_high_priority_but_gate_t_still_blocks_exact_runtime_reopen_until_a_rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "additional_route_family_guard_without_revalidation",
    reason:
      "gate_e_already_landed_the_bounded_flat_list_guard_for_reproduced_rockwool_like_flips_and_any_next_guard_must_be_reranked_against_source_readiness_common_stack_frequency_and_negative_boundary_risk_before_more_runtime_movement",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    id: "direct_ga600_or_manufacturer_source_import",
    reason:
      "ga600_and_closed_manufacturer_contexts_remain_non_runtime_until_rights_safe_current_payloads_exact_topology_metric_owner_material_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "private_use_and_productization_remain_important_but_accuracy_revalidation_stays_ahead_while_source_ready_runtime_candidates_are_absent_and_the_user_priority_is_correctness_on_common_wall_floor_stacks",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V16_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
  requiredArtifacts: [
    "gate_e_flat_list_guard_landing_summary",
    "post_guard_rockwool_triple_leaf_exact_source_packet_status",
    "post_guard_closed_manufacturer_and_ga600_source_context_rerank",
    "common_stack_lane_misclassification_watchlist_carry_forward",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts"
} as const;

const FROZEN_SURFACES = [
  "runtime import",
  "support promotion",
  "confidence promotion",
  "evidence promotion",
  "API shape",
  "output support",
  "proposal/report copy",
  "workbench input"
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function labSnapshot(layers: readonly LayerInput[], context: AirborneContext = WALL_LAB_CONTEXT) {
  const result = calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: ["Rw", "STC"]
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    strategy: result.dynamicAirborneTrace?.strategy,
    warnings: result.warnings.join("\n")
  };
}

describe("post route-family lane-drift common-stack watchlist Gate F next-slice selection contract", () => {
  it("closes the watchlist after Gate E and selects source-gap revalidation v16", () => {
    expect(POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "route_family_lane_drift_common_stack_watchlist_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateFNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries",
      latestRuntimeGuardStrategy: "multileaf_screening_blend_fail_closed_until_grouped_topology",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v16",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_lane_drift_guard",
      selectionStatus:
        "closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16",
      sliceId: "post_route_family_lane_drift_common_stack_watchlist_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses the guarded lane-drift findings as closeout evidence, not exact-source approval", () => {
    const splitGrouped = labSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const splitSwapped = labSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const classicSwapped = labSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));
    const heavyBoundary = labSnapshot(HEAVY_MULTILEAF_STACK);

    expect(splitGrouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 53,
      strategy: "broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor"
    });
    expect(splitSwapped).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(splitSwapped.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
    expect(classicSwapped).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 44,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(heavyBoundary).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(CLOSED_FINDINGS.every((finding) => finding.runtimeImportReadyNow === false)).toBe(true);
    expect(CLOSED_FINDINGS.every((finding) => finding.sourceValidatedNow === false)).toBe(true);
  });

  it("selects v16 revalidation before reopening Uris, adding more guards, importing GA600, or productization", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v16",
        reason:
          "after_gate_e_guarded_the_rockwool_like_flat_list_wrong_lane_runtime_symptom_the_next_honest_accuracy_step_is_to_rerank_the_source_accuracy_backlog_against_the_new_guarded_posture_paused_uris_2006_source_packet_lane_closed_us_and_uk_manufacturer_rows_ga600_context_floor_wall_boundary_risks_and_remaining_common_stack_lane_misclassification_watch_items_before_any_source_import_or_exact_runtime_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 130)).toBe(true);
  });

  it("defines the selected v16 Gate A scope before source import or exact promotion", () => {
    expect(SELECTED_V16_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing",
      requiredArtifacts: [
        "gate_e_flat_list_guard_landing_summary",
        "post_guard_rockwool_triple_leaf_exact_source_packet_status",
        "post_guard_closed_manufacturer_and_ga600_source_context_rerank",
        "common_stack_lane_misclassification_watchlist_carry_forward",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on Gate F closeout and v16 selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT.closedImplementationSlice);
      expect(doc).toContain(POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_ROUTE_FAMILY_LANE_DRIFT_WATCHLIST_GATE_F_CLOSEOUT.selectionStatus);
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
    }
  });

  it("keeps validation and frozen-surface requirements explicit", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(checkpoint).toContain(surface);
    }

    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
