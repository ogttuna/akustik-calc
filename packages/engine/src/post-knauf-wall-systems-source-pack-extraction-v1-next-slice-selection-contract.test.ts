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

const POST_KNAUF_WALL_SYSTEMS_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "knauf_wall_systems_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v5",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_knauf_source_pack_closeout",
  selectionStatus:
    "closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row",
  sliceId: "post_knauf_wall_systems_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_READINESS = [
  {
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25",
    runtimeImportReadyNow: false,
    firstMissingRequirement:
      "wallboard_acoustic_roll_stud_gauge_equivalence_and_row_specific_tolerance_owner",
    closeoutPosture: "roadmap_steel_stud_lab_row_reconciliation"
  },
  {
    systemCode: "TB.5A",
    runtimeImportReadyNow: false,
    firstMissingRequirement:
      "exact_stud_depth_column_sheetrock_one_ki75g11_mapping_and_timber_double_board_tolerance_owner",
    closeoutPosture: "roadmap_timber_double_board_exact_column_and_tolerance_research"
  },
  {
    systemCode: "TTF30.2A",
    runtimeImportReadyNow: false,
    firstMissingRequirement:
      "twin_frame_gap_side_asymmetry_fiberock_mapping_and_double_leaf_tolerance_owner",
    closeoutPosture: "roadmap_twin_timber_double_leaf_topology_research"
  },
  {
    systemCode: "MWI.2A",
    runtimeImportReadyNow: false,
    firstMissingRequirement:
      "substrate_mass_furring_cavity_coupling_sheetrock_mapping_and_lined_masonry_tolerance_owner",
    closeoutPosture: "roadmap_lined_masonry_substrate_and_coupling_research"
  },
  {
    systemCode: "TO120.1A",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "one_side_lined_row_is_not_two_sided_timber_wall_truth",
    closeoutPosture: "negative_boundary"
  },
  {
    systemCode: "TSF120.1A",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "staggered_stud_and_fiberock_topology_not_live_route_inputs",
    closeoutPosture: "adjacent_context_only"
  },
  {
    systemCode: "AAC.1A",
    runtimeImportReadyNow: false,
    firstMissingRequirement:
      "aac_density_gap_discontinuous_frame_and_panel_mapping_not_live_generic_aac_truth",
    closeoutPosture: "adjacent_context_only"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "knauf_runtime_import_or_confidence_promotion",
    reason:
      "gate_b_found_no_knauf_locator_row_with_complete_topology_metric_material_mapping_tolerance_owner_and_paired_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/knauf-wall-systems-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "timber_double_board_or_lined_masonry_direct_runtime_slice",
    reason:
      "tb5a_and_mwi2a_are_useful_research_tracks_but_still_lack_exact_column_material_mapping_field_output_policy_and_tolerance_ownership",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "calculator_source_gap_revalidation_v5",
    reason:
      "after_knauf_extraction_closed_no_runtime_the_next_honest_step_is_to_rerank_source_accuracy_candidates_before_any_runtime_import_or_productization_work",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts"
  },
  {
    id: "internal_pilot_confidence_or_support_promotion",
    reason:
      "internal_handoff_and_acceptance_evidence_allow_controlled_use_but_do_not_promote_source_gated_or_screening_families",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md"
  },
  {
    id: "productization_only_work",
    reason:
      "calculator_accuracy_and_scope_are_still_the_active_priority_so_productization_only_work_should_not_outrank_source_accuracy_revalidation",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V5_GATE_A_CONTRACT = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
  requiredCandidateFamilies: [
    "knauf_gate_b_closeout_rows_and_negative_boundaries",
    "timber_double_board_stud_wall",
    "clt_mass_timber_wall",
    "no_stud_double_leaf_wall",
    "generated_floor_fallback",
    "lined_massive_heavy_core_wall",
    "historical_blocked_families",
    "internal_use_acceptance_and_pilot_handoff_evidence",
    "productization_tracks_that_must_not_outrank_accuracy"
  ],
  requiredEvidenceFields: [
    "candidate_id_current_posture_and_user_visible_risk",
    "latest_executable_test_owner_and_doc_owner",
    "first_missing_source_metric_tolerance_material_or_visible_test_requirement",
    "negative_boundaries_and_near_misses_that_must_stay_closed",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts"
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

describe("post Knauf wall systems source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the Knauf source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_KNAUF_WALL_SYSTEMS_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "knauf_wall_systems_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v5",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_knauf_source_pack_closeout",
      selectionStatus:
        "closed_knauf_wall_systems_source_pack_no_runtime_and_selected_source_gap_revalidation_v5_because_gate_b_found_no_import_ready_row",
      sliceId: "post_knauf_wall_systems_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every Gate B Knauf row out of runtime import after closeout", () => {
    expect(GATE_B_CLOSEOUT_READINESS.map((row) => row.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TB.5A",
      "TTF30.2A",
      "MWI.2A",
      "TO120.1A",
      "TSF120.1A",
      "AAC.1A"
    ]);
    expect(GATE_B_CLOSEOUT_READINESS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_READINESS.every((row) => row.firstMissingRequirement.length > 40)).toBe(true);
    expect(GATE_B_CLOSEOUT_READINESS.find((row) => row.systemCode === "TO120.1A")).toMatchObject({
      closeoutPosture: "negative_boundary"
    });
  });

  it("selects source-gap revalidation v5 before runtime, pilot-promotion, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v5",
        reason:
          "after_knauf_extraction_closed_no_runtime_the_next_honest_step_is_to_rerank_source_accuracy_candidates_before_any_runtime_import_or_productization_work",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 80)).toBe(true);
  });

  it("defines the selected v5 Gate A contract as no-runtime reranking work", () => {
    expect(SELECTED_V5_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_knauf_source_pack_closeout",
      requiredCandidateFamilies: [
        "knauf_gate_b_closeout_rows_and_negative_boundaries",
        "timber_double_board_stud_wall",
        "clt_mass_timber_wall",
        "no_stud_double_leaf_wall",
        "generated_floor_fallback",
        "lined_massive_heavy_core_wall",
        "historical_blocked_families",
        "internal_use_acceptance_and_pilot_handoff_evidence",
        "productization_tracks_that_must_not_outrank_accuracy"
      ],
      requiredEvidenceFields: [
        "candidate_id_current_posture_and_user_visible_risk",
        "latest_executable_test_owner_and_doc_owner",
        "first_missing_source_metric_tolerance_material_or_visible_test_requirement",
        "negative_boundaries_and_near_misses_that_must_stay_closed",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V5_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v5-gate-a-contract.test.ts"
    });
  });

  it("keeps planning documents aligned on v5 as the next selected slice", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md"),
      readRepoFile("docs/calculator/SOURCE_GAP_LEDGER.md"),
      readRepoFile("docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V5_GATE_A_CONTRACT.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_KNAUF_WALL_SYSTEMS_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_KNAUF_WALL_SYSTEMS_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_KNAUF_WALL_SYSTEMS_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("pnpm check");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
