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

const POST_TTF302A_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v6",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_knauf_mapping_chain_closeout",
  selectionStatus:
    "closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership",
  sliceId: "post_twin_timber_knauf_ttf302a_mapping_tolerance_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/post-timber-double-board-knauf-tb5a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/timber-double-board-knauf-tb5a-mapping-tolerance-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const TTF302A_CLOSEOUT_EVIDENCE = {
  gateAContract: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts",
  gateAResult: "context_only_no_source_ready_runtime_candidate",
  liveRoutePosture: "formula_owned_single_frame_wood_stud_route",
  preservedBoundaries: [
    "no_stud_double_leaf_formula_routes_stay_closed_because_ttf302a_has_twin_timber_studs",
    "raw_open_box_open_web_floor_routes_stay_closed_because_ttf302a_is_a_wall_twin_stud_row",
    "simple_timber_and_tb5a_direct_routes_do_not_inherit_twin_frame_gap_or_asymmetric_fiberock_truth",
    "tsf1201a_staggered_timber_and_to1201a_one_side_lined_context_stay_adjacent_or_negative",
    "steel_clt_masonry_context_does_not_promote_ttf302a_or_live_timber_values"
  ],
  runtimeImportReadyNow: false,
  sourceContext: {
    acousticRatingsBasis: "SLR-FB-T-DS-01",
    boardAndFrame: "1x13 mm side 1 / 2x13 mm side 2 FIBEROCK AQUA-TOUGH with twin timber frames and 20 mm gap",
    metric: "lab Rw plus Rw+Ctr context only",
    systemCode: "TTF30.2A",
    values: ["source Rw span 49-64", "source Rw+Ctr span 41-54"]
  },
  unresolvedRuntimePrerequisites: [
    "exact_70_or_90_mm_column_and_min_wall_width_are_not_selectable_from_live_engine_inputs",
    "fiberock_aqua_tough_to_generic_gypsum_board_mapping_is_blocked",
    "asymmetric_side_lining_and_twin_frame_20_mm_gap_coupling_are_not_live_route_inputs",
    "ki50g11_ki75g11_ki90g11_glasswool_placement_mapping_to_rockwool_plus_air_gap_is_blocked",
    "lab_rw_plus_ctr_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership"
  ]
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "ttf302a_runtime_import_confidence_or_visible_promotion",
    reason:
      "gate_a_found_ttf302a_is_context_only_because_twin_frame_gap_side_asymmetry_fiberock_glasswool_field_output_policy_tolerance_and_paired_visible_tests_are_incomplete",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v6",
    reason:
      "tb5a_mwi2a_and_ttf302a_have_all_closed_no_runtime_so_the_next_honest_accuracy_step_is_to_rerank_remaining_knauf_clt_floor_no_stud_and_historical_blocked_candidates_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts"
  },
  {
    id: "knauf_tsf1201a_or_to1201a_direct_followup",
    reason:
      "tsf1201a_is_adjacent_staggered_timber_context_and_to1201a_is_a_one_side_lined_negative_boundary_so neither should outrank a fresh source_gap_rerank after the concrete knauf mapping rows stayed blocked",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "knauf_steel_en_pc_or_aac_followup",
    reason:
      "the_steel_en_pc_and_aac_rows_remain_concrete_locators_but_still_lack_exact_local_material_stud_or_panel_mapping_metric_policy_tolerance_ownership_and_paired_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "clt_mass_timber_floor_fallback_or_no_stud_reopen",
    reason:
      "clt_mass_timber_generated_floor_and_no_stud_families_all_have_recent_no_runtime_boundaries_and_need_revalidation_against_the_post_knauf_state_before any narrow followup is selected",
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

const SELECTED_V6_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
  requiredArtifacts: [
    "post_knauf_tb5a_mwi2a_ttf302a_closeout_summary",
    "remaining_knauf_rows_and_negative_boundaries_rerank",
    "clt_mass_timber_metric_policy_floor_fallback_no_stud_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts"
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

describe("post TTF30.2A mapping / tolerance Gate C next-slice selection contract", () => {
  it("closes the TTF30.2A slice without runtime or visible-surface movement", () => {
    expect(POST_TTF302A_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "twin_timber_knauf_ttf302a_mapping_tolerance_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate:
        "gate_a_map_knauf_ttf302a_twin_timber_topology_materials_tolerance_without_runtime_import",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v6",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_knauf_mapping_chain_closeout",
      selectionStatus:
        "closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership",
      sliceId: "post_twin_timber_knauf_ttf302a_mapping_tolerance_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses TTF30.2A Gate A evidence as closeout evidence, not import permission", () => {
    expect(TTF302A_CLOSEOUT_EVIDENCE.runtimeImportReadyNow).toBe(false);
    expect(TTF302A_CLOSEOUT_EVIDENCE.sourceContext).toMatchObject({
      acousticRatingsBasis: "SLR-FB-T-DS-01",
      metric: "lab Rw plus Rw+Ctr context only",
      systemCode: "TTF30.2A"
    });
    expect(TTF302A_CLOSEOUT_EVIDENCE.unresolvedRuntimePrerequisites).toEqual([
      "exact_70_or_90_mm_column_and_min_wall_width_are_not_selectable_from_live_engine_inputs",
      "fiberock_aqua_tough_to_generic_gypsum_board_mapping_is_blocked",
      "asymmetric_side_lining_and_twin_frame_20_mm_gap_coupling_are_not_live_route_inputs",
      "ki50g11_ki75g11_ki90g11_glasswool_placement_mapping_to_rockwool_plus_air_gap_is_blocked",
      "lab_rw_plus_ctr_does_not_supply_field_outputs_dyn_echo_c_ctr_stc_or_tolerance_ownership"
    ]);
    expect(TTF302A_CLOSEOUT_EVIDENCE.preservedBoundaries.every((boundary) => boundary.length > 70)).toBe(true);
  });

  it("selects source-gap revalidation v6 as the next no-runtime source accuracy step", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v6",
        reason:
          "tb5a_mwi2a_and_ttf302a_have_all_closed_no_runtime_so_the_next_honest_accuracy_step_is_to_rerank_remaining_knauf_clt_floor_no_stud_and_historical_blocked_candidates_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected v6 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V6_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_mapping_chain_closeout",
      requiredArtifacts: [
        "post_knauf_tb5a_mwi2a_ttf302a_closeout_summary",
        "remaining_knauf_rows_and_negative_boundaries_rerank",
        "clt_mass_timber_metric_policy_floor_fallback_no_stud_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts"
    });
  });

  it("keeps docs aligned on the selected v6 next slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_TTF302A_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_TTF302A_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_TTF302A_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("TTF30.2A");
      expect(doc).toContain("no-runtime");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/SLICE_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V6_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
