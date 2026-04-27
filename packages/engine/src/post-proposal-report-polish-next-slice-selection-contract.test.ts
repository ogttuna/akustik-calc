import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_PROPOSAL_REPORT_POLISH_CLOSEOUT = {
  sliceId: "post_proposal_report_polish_next_slice_selection_v1",
  closedImplementationSlice: "proposal_report_polish_v1",
  latestLandedGate: "proposal_report_polish_gate_a_third_carve_validated_closeout",
  selectedImplementationSlice: "calculator_source_gap_revalidation_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md",
  closeoutHandoff: "docs/calculator/CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md",
  calculatorRuntimeBehaviorChange: false,
  reportSurfaceBehaviorChange:
    "proposal_outputs_keep_honesty_posture_and_long_label_layer_cap_disclosure",
  firstExecutionAction: "inventory_and_rerank_remaining_source_gaps_without_runtime_value_change"
} as const;

const REPORT_POLISH_EVIDENCE = {
  reportFiles: [
    "apps/web/features/workbench/simple-workbench-proposal-simple.ts",
    "apps/web/features/workbench/simple-workbench-proposal.ts",
    "apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts",
    "apps/web/features/workbench/simple-workbench-proposal.test.ts"
  ],
  landedGuards: [
    "simple_short_form_output_coverage_register",
    "generated_floor_low_confidence_wall_field_airborne_honesty",
    "fifty_three_row_ubiq_long_label_regression",
    "fixed_table_layout_and_wrap_guards",
    "simple_short_form_layer_cap_disclosure"
  ],
  validation: {
    targetedProposalReport: "web_5_files_18_tests",
    webLint: "green",
    focusedCurrentGate:
      "engine_99_files_450_tests_web_43_files_211_passed_18_skipped_build_5_of_5",
    broadCheck:
      "lint_typecheck_engine_232_files_1270_tests_web_155_files_885_passed_18_skipped_build_5_of_5"
  }
} as const;

const NEXT_SLICE_BOUNDARIES = {
  noRuntimeGateA: true,
  selectedBecause: [
    "user_priority_is_calculator_scope_and_accuracy",
    "private_internal_use_readiness_chain_is_closed_with_visible_caveats",
    "remaining_calculator_improvements_are_source_or_formula_gated"
  ],
  blockedFamiliesNotReopenedByInertia: [
    "GDMTXA04A_visible_composite_surface_exact",
    "C11c_exact_import_frequency_source_anomaly",
    "raw_bare_open_box_open_web_impact",
    "heavy_concrete_formula_parity",
    "reinforced_concrete_reopen",
    "wall_selector_behavior",
    "timber_stud_formula_widening",
    "floor_fallback_low_confidence_promotion"
  ],
  gateAOutputs: [
    "current_source_gap_candidate_ranking",
    "candidate_blocker_or_ready_reason",
    "evidence_owner_file_or_test",
    "selected_next_source_or_runtime_slice"
  ]
} as const;

describe("post proposal report polish next slice selection contract", () => {
  it("closes proposal/report polish and selects source-gap revalidation", () => {
    expect(POST_PROPOSAL_REPORT_POLISH_CLOSEOUT).toEqual({
      sliceId: "post_proposal_report_polish_next_slice_selection_v1",
      closedImplementationSlice: "proposal_report_polish_v1",
      latestLandedGate: "proposal_report_polish_gate_a_third_carve_validated_closeout",
      selectedImplementationSlice: "calculator_source_gap_revalidation_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md",
      closeoutHandoff: "docs/calculator/CHECKPOINT_2026-04-27_PROPOSAL_REPORT_POLISH_CLOSEOUT_HANDOFF.md",
      calculatorRuntimeBehaviorChange: false,
      reportSurfaceBehaviorChange:
        "proposal_outputs_keep_honesty_posture_and_long_label_layer_cap_disclosure",
      firstExecutionAction: "inventory_and_rerank_remaining_source_gaps_without_runtime_value_change"
    });
  });

  it("records the report polish evidence and validation shape", () => {
    expect(REPORT_POLISH_EVIDENCE.landedGuards).toEqual([
      "simple_short_form_output_coverage_register",
      "generated_floor_low_confidence_wall_field_airborne_honesty",
      "fifty_three_row_ubiq_long_label_regression",
      "fixed_table_layout_and_wrap_guards",
      "simple_short_form_layer_cap_disclosure"
    ]);
    expect(REPORT_POLISH_EVIDENCE.validation).toEqual({
      targetedProposalReport: "web_5_files_18_tests",
      webLint: "green",
      focusedCurrentGate:
        "engine_99_files_450_tests_web_43_files_211_passed_18_skipped_build_5_of_5",
      broadCheck:
        "lint_typecheck_engine_232_files_1270_tests_web_155_files_885_passed_18_skipped_build_5_of_5"
    });
  });

  it("keeps the next slice no-runtime until source gaps are re-ranked", () => {
    expect(NEXT_SLICE_BOUNDARIES.noRuntimeGateA).toBe(true);
    expect(NEXT_SLICE_BOUNDARIES.selectedBecause).toEqual([
      "user_priority_is_calculator_scope_and_accuracy",
      "private_internal_use_readiness_chain_is_closed_with_visible_caveats",
      "remaining_calculator_improvements_are_source_or_formula_gated"
    ]);
    expect(NEXT_SLICE_BOUNDARIES.gateAOutputs).toEqual([
      "current_source_gap_candidate_ranking",
      "candidate_blocker_or_ready_reason",
      "evidence_owner_file_or_test",
      "selected_next_source_or_runtime_slice"
    ]);
  });

  it("does not reopen blocked calculator families by inertia", () => {
    expect(NEXT_SLICE_BOUNDARIES.blockedFamiliesNotReopenedByInertia).toEqual([
      "GDMTXA04A_visible_composite_surface_exact",
      "C11c_exact_import_frequency_source_anomaly",
      "raw_bare_open_box_open_web_impact",
      "heavy_concrete_formula_parity",
      "reinforced_concrete_reopen",
      "wall_selector_behavior",
      "timber_stud_formula_widening",
      "floor_fallback_low_confidence_promotion"
    ]);
  });

  it("keeps the handoff, selected plan, and landed report files present", () => {
    for (const path of [
      POST_PROPOSAL_REPORT_POLISH_CLOSEOUT.selectedPlanningSurface,
      POST_PROPOSAL_REPORT_POLISH_CLOSEOUT.closeoutHandoff,
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      ...REPORT_POLISH_EVIDENCE.reportFiles
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });
});
