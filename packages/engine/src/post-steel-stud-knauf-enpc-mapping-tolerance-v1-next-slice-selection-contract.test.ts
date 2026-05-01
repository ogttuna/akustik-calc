import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const POST_ENPC_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_rows_closed",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v7",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_all_concrete_knauf_mapping_closeouts",
  selectionStatus:
    "closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership",
  sliceId: "post_steel_stud_knauf_enpc_mapping_tolerance_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
  "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const ENPC_CLOSEOUT_EVIDENCE = {
  gateAContract: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts",
  gateAResult: "context_only_no_source_ready_runtime_candidate",
  liveRoutePosture: "exact_lab_anchor_for_lsf_lab_plus_formula_owned_field_route",
  preservedBoundaries: [
    "existing_knauf_lab_416889_acoustic_board_exact_anchor_stays_active_and_is_not_replaced_by_enpc_proximity",
    "existing_knauf_lab_416702_generic_gypsum_adjacent_anchor_does_not_match_enpc_25_mm_acoustic_roll",
    "lab_rw_context_does_not_supply_field_outputs_room_normalisation_flanking_or_building_prediction_policy",
    "tb5a_mwi2a_ttf302a_timber_masonry_and_twin_timber_rows_do_not_inherit_uk_steel_stud_wallboard_truth",
    "aac1a_tsf1201a_and_to1201a_remain_adjacent_or_negative_context_until_exact_local_mappings_exist"
  ],
  runtimeImportReadyNow: false,
  sourceContext: {
    liveAnchor: "knauf_lab_416889_primary_2026 Rw 55",
    metric: "lab Rw 49 context only",
    sourceTopology: "2x12.5 mm Wallboard each side, 50 mm 0.55 gauge C stud, 25 mm Acoustic Roll",
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
  },
  unresolvedRuntimePrerequisites: [
    "wallboard_to_live_acoustic_gypsum_board_mapping_is_context_only",
    "25_mm_acoustic_roll_to_70_mm_glasswool_plus_5_mm_air_gap_mapping_is_blocked",
    "50_mm_0p55_gauge_stud_depth_and_gauge_are_not_selectable_from_live_engine_inputs",
    "lab_rw_49_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership",
    "paired_engine_and_web_visible_tests_for_runtime_or_copy_movement_are_not_named"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "enpc_runtime_import_confidence_or_visible_promotion",
    reason:
      "gate_a_found_enpc_is_context_only_because_wallboard_acoustic_roll_stud_depth_gauge_field_output_policy_spectrum_terms_tolerance_and_paired_visible_tests_are_incomplete",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v7",
    reason:
      "tb5a_mwi2a_ttf302a_and_enpc_have_all_closed_no_runtime_so_the_next_honest_accuracy_step_is_to_rerank_remaining_knauf_adjacent_rows_clt_mass_timber_generated_floor_no_stud_and_historical_blocked_candidates_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts"
  },
  {
    id: "knauf_aac1a_or_tsf1201a_direct_followup",
    reason:
      "aac1a_and_tsf1201a_are_adjacent_context_only_after_knauf_gate_b_and_need_a_fresh_gap_revalidation_before_they_can_outrank_non_knauf_source_families",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "knauf_to1201a_one_side_lined_reopen",
    reason:
      "to1201a_is_a_protected_one_side_lined_negative_boundary_and_should_not_be_reopened_from_nearby_green_timber_or_steel_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "clt_mass_timber_generated_floor_or_no_stud_reopen",
    reason:
      "clt_mass_timber_generated_floor_fallback_and_no_stud_families_have_recent_no_runtime_boundaries_and_need_revalidation_against_the_post_knauf_state_before_a_narrow_followup_is_selected",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled_internal_use_and_productization_remain_lower_priority_than_source_accuracy_while_no_operator_defect_or_source_ready_runtime_pack_has_appeared",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md"
  }
] as const;

const SELECTED_V7_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_rows_closed",
  requiredArtifacts: [
    "post_knauf_tb5a_mwi2a_ttf302a_enpc_closeout_summary",
    "remaining_knauf_aac_tsf_to_negative_and_adjacent_boundary_rerank",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts"
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post EN-PC steel-stud mapping / tolerance Gate C next-slice selection contract", () => {
  it("closes the EN-PC slice without runtime or visible-surface movement", () => {
    expect(POST_ENPC_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "steel_stud_knauf_enpc_mapping_tolerance_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_a_map_knauf_enpc_steel_stud_topology_materials_tolerance_without_runtime_import",
      nextExecutionAction:
        "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_rows_closed",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v7",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_all_concrete_knauf_mapping_closeouts",
      selectionStatus:
        "closed_enpc_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v7_because_all_concrete_knauf_mapping_rows_lack_exact_material_metric_tolerance_ownership",
      sliceId: "post_steel_stud_knauf_enpc_mapping_tolerance_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses EN-PC Gate A evidence as closeout evidence, not import permission", () => {
    expect(ENPC_CLOSEOUT_EVIDENCE.runtimeImportReadyNow).toBe(false);
    expect(ENPC_CLOSEOUT_EVIDENCE.sourceContext).toMatchObject({
      liveAnchor: "knauf_lab_416889_primary_2026 Rw 55",
      metric: "lab Rw 49 context only",
      systemCode: "EN-PC-50-055-6-2-12.5-WB-25"
    });
    expect(ENPC_CLOSEOUT_EVIDENCE.unresolvedRuntimePrerequisites).toEqual([
      "wallboard_to_live_acoustic_gypsum_board_mapping_is_context_only",
      "25_mm_acoustic_roll_to_70_mm_glasswool_plus_5_mm_air_gap_mapping_is_blocked",
      "50_mm_0p55_gauge_stud_depth_and_gauge_are_not_selectable_from_live_engine_inputs",
      "lab_rw_49_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership",
      "paired_engine_and_web_visible_tests_for_runtime_or_copy_movement_are_not_named"
    ]);
    expect(ENPC_CLOSEOUT_EVIDENCE.preservedBoundaries.every((boundary) => boundary.length > 80)).toBe(true);
  });

  it("selects source-gap revalidation v7 as the next no-runtime source accuracy step", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v7",
        reason:
          "tb5a_mwi2a_ttf302a_and_enpc_have_all_closed_no_runtime_so_the_next_honest_accuracy_step_is_to_rerank_remaining_knauf_adjacent_rows_clt_mass_timber_generated_floor_no_stud_and_historical_blocked_candidates_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected v7 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V7_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_all_concrete_knauf_mapping_rows_closed",
      requiredArtifacts: [
        "post_knauf_tb5a_mwi2a_ttf302a_enpc_closeout_summary",
        "remaining_knauf_aac_tsf_to_negative_and_adjacent_boundary_rerank",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v7-gate-a-contract.test.ts"
    });
  });

  it("keeps docs aligned on the selected v7 next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_ENPC_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_ENPC_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_ENPC_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("EN-PC-50-055-6-2-12.5-WB-25");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V7_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_STEEL_STUD_KNAUF_ENPC_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-steel-stud-knauf-enpc-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
