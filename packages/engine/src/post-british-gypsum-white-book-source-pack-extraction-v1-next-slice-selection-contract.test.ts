import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CloseoutCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

type RowCloseoutEvidence = {
  closeoutPosture:
    | "already_landed_exact_anchor_no_new_runtime"
    | "blocked_floor_context"
    | "blocked_lined_masonry_context"
    | "blocked_lsf_context"
    | "blocked_twin_frame_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  systemCode: string;
};

const POST_BRITISH_GYPSUM_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v9",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_british_gypsum_closeout",
  selectionStatus:
    "closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row",
  sliceId: "post_british_gypsum_white_book_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-30_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly RowCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_floor_context",
    firstMissingRequirement:
      "c204006_still_lacks_sif_channel_timber_joist_rb1_ceiling_soundbloc_plank_floor_metric_tolerance_and_paired_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "c204006_stays_floor_only_and_does_not_promote_wall_outputs_or_generic_generated_floor_fallback_truth",
    systemCode: "C204006"
  },
  {
    closeoutPosture: "blocked_floor_context",
    firstMissingRequirement:
      "c204003_still_lacks_separate_plank_fireline_floor_topology_mapping_tolerance_and_substitution_rejection_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "c204003_does_not_substitute_for_c204006_soundbloc_or_generic_generated_floor_truth",
    systemCode: "C204003"
  },
  {
    closeoutPosture: "blocked_lsf_context",
    firstMissingRequirement:
      "a206a290_still_lacks_acoustud_soundbloc_apr_cavity_knauf_anchor_precedence_metric_tolerance_and_paired_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "a206a290_does_not_override_existing_knauf_lsf_anchor_or_promote_field_outputs_by_proximity",
    systemCode: "A206A290"
  },
  {
    closeoutPosture: "already_landed_exact_anchor_no_new_runtime",
    firstMissingRequirement: "none_for_existing_exact_anchor_but_duplicate_import_and_direct_timber_promotion_remain_forbidden",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "a046006_remains_the_existing_resilient_timber_exact_anchor_and_is_not_reimported",
    systemCode: "A046006"
  },
  {
    closeoutPosture: "blocked_twin_frame_context",
    firstMissingRequirement:
      "a326017b_still_lacks_twin_92s10_frames_gab3_bracing_600mm_width_six_insulation_layers_metric_tolerance_and_negative_boundaries",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "a326017b_does_not_promote_no_stud_raw_open_box_simple_timber_or_generic_twin_frame_routes",
    systemCode: "A326017B"
  },
  {
    closeoutPosture: "blocked_lined_masonry_context",
    firstMissingRequirement:
      "b226010_still_lacks_103mm_solid_brick_density_plaster_gl1_channels_35mm_cavities_apr_metric_policy_tolerance_and_boundaries",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "b226010_does_not_promote_generic_lined_concrete_mwi2a_or_heavy_core_screening_routes",
    systemCode: "B226010"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "british_gypsum_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_new_british_gypsum_row_with_complete_live_topology_material_mapping_metric_owner_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v9",
    reason:
      "after_british_gypsum_gate_b_closed_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_british_gypsum_context_rows_closed_knauf_rows_clt_mass_timber_generated_floor_no_stud_lined_masonry_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_defect_remains_important_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "clt_mass_timber_generated_floor_or_no_stud_direct_followup",
    reason:
      "these_families_are_still_high_value_but_need_a_fresh_post_british_gypsum_rerank_against_the_closed_white_book_rows_and_paused_triple_leaf_source_lane_before_a_narrow_followup_is_selected",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled_internal_use_and_productization_remain_lower_priority_than_accuracy_revalidation_while_no_new_source_ready_runtime_pack_or_operator_defect_has_appeared",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V9_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
  requiredArtifacts: [
    "post_british_gypsum_gate_a_gate_b_gate_c_closeout_summary",
    "closed_british_gypsum_rows_and_negative_boundary_rerank",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_knauf_mapping_chain_and_remaining_near_source_boundaries",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts"
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

describe("post British Gypsum White Book source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the British Gypsum source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_BRITISH_GYPSUM_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "british_gypsum_white_book_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v9",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_british_gypsum_closeout",
      selectionStatus:
        "closed_british_gypsum_white_book_source_pack_no_runtime_and_selected_source_gap_revalidation_v9_because_gate_b_found_no_new_import_ready_row",
      sliceId: "post_british_gypsum_white_book_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.systemCode)).toEqual([
      "C204006",
      "C204003",
      "A206A290",
      "A046006",
      "A326017B",
      "B226010"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 80)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.systemCode === "A046006")).toMatchObject({
      closeoutPosture: "already_landed_exact_anchor_no_new_runtime"
    });
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.systemCode === "C204006")?.protectedBoundary).toContain(
      "floor_only"
    );
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.systemCode === "B226010")?.protectedBoundary).toContain(
      "heavy_core"
    );
  });

  it("selects source-gap revalidation v9 before runtime, direct family follow-up, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v9",
        reason:
          "after_british_gypsum_gate_b_closed_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_british_gypsum_context_rows_closed_knauf_rows_clt_mass_timber_generated_floor_no_stud_lined_masonry_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected v9 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V9_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_british_gypsum_source_pack_closeout",
      requiredArtifacts: [
        "post_british_gypsum_gate_a_gate_b_gate_c_closeout_summary",
        "closed_british_gypsum_rows_and_negative_boundary_rerank",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_knauf_mapping_chain_and_remaining_near_source_boundaries",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V9_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v9-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v9 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V9_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_BRITISH_GYPSUM_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_BRITISH_GYPSUM_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_BRITISH_GYPSUM_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("british_gypsum_gate_b_found_no_new_runtime_ready_row_kept_a046006_existing_anchor");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-02_BRITISH_GYPSUM_WHITE_BOOK_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain("pnpm --filter @dynecho/engine exec vitest run src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1");
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
