import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_WALL_TIMBER_STUD_CLT_GATE_C_NEXT_SLICE_SELECTION = {
  sliceId: "post_wall_timber_stud_clt_gate_c_next_slice_selection_v1",
  closedImplementationSlice: "wall_timber_stud_clt_accuracy_pass_v1",
  latestLandedGate: "wall_timber_stud_clt_accuracy_pass_v1_gate_c_no_runtime_closeout",
  selectedImplementationSlice: "floor_fallback_low_confidence_cleanup_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md",
  selectedRouteFamily: "floor_open_web_or_open_box_low_confidence_fallback",
  selectionStatus: "selected_after_common_wall_formula_lanes_closed_no_runtime_without_source_unlock",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  nextExecutionAction:
    "gate_a_audit_floor_steel_fallback_low_confidence_source_formula_surface_before_runtime_change"
} as const;

const WALL_TIMBER_STUD_CLT_CLOSEOUT_EVIDENCE = {
  posture: "no_runtime_gate_a_plus_two_gate_b_source_formula_contracts_closed",
  closedBecause: [
    "timber_stud_live_stack_has_no_verified_exact_or_lab_fallback_match",
    "timber_exact_rows_do_not_match_live_double_board_fill_cavity_topology",
    "clt_wall_live_stack_has_no_verified_exact_or_lab_fallback_match",
    "current_catalog_has_no_wall_specific_clt_exact_row",
    "dataholz_clt_rows_are_floor_source_truth_not_wall_exact_truth"
  ],
  keptRuntimePosture: {
    cltWall: {
      confidence: "medium",
      evidenceTier: "formula",
      fieldRwPrimeDb: 41,
      generatedCaseId: "wall-clt-local",
      labRwDb: 42,
      strategy: "laminated_leaf_sharp_delegate"
    },
    timberStud: {
      confidence: "low",
      evidenceTier: "formula",
      fieldRwPrimeDb: 42,
      generatedCaseId: "wall-timber-stud",
      labRwDb: 50,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    }
  },
  executableProof: [
    "packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts",
    "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
    "packages/engine/src/wall-clt-gate-b-source-contract.test.ts"
  ]
} as const;

const SELECTED_FLOOR_FALLBACK_CLEANUP_EVIDENCE = {
  candidateId: "floor.steel_fallback_low_confidence.field",
  generatedCaseId: "floor-steel-fallback",
  selectedBecause: [
    "wall_runtime_candidates_are_now_closed_or_blocked_without_new_source_evidence",
    "cartography_marks_the_steel_suspended_floor_as_the_remaining_runtime_widening_candidate",
    "the_lane_is_common_enough_for_private_use_but_currently_screening_and_low_confidence",
    "the_lane_has_visible_web_card_coverage_and_engine_origin_pins_that_can_be_audited_before_math_changes",
    "tightening_or_fail_closed_honesty_here_improves_personal_use_floor_coverage_after_wall_accuracy"
  ],
  currentPosture: {
    evidenceTier: "screening",
    estimateKind: "low_confidence",
    originBasisId: "predictor_floor_system_low_confidence_estimate",
    supportedFieldOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
    unsupportedFieldOutputs: ["L'nT,50"]
  },
  firstGate:
    "gate_a_pin_floor_steel_fallback_current_values_source_candidates_web_card_honesty_and_exact_precedence_no_runtime_change"
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "reopen_timber_stud_or_clt_wall_formula_values_without_new_source_evidence",
    "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
    "promote_floor_steel_fallback_from_low_confidence_without_exact_source_benchmark_or_bounded_family_rule",
    "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
    "resume_productization_route_integration_before_the_calculator_readiness_chain_closes"
  ]
} as const;

describe("post wall timber-stud + CLT Gate C next slice selection contract", () => {
  it("closes the timber stud + CLT wall slice and selects floor fallback cleanup next", () => {
    expect(POST_WALL_TIMBER_STUD_CLT_GATE_C_NEXT_SLICE_SELECTION).toEqual({
      sliceId: "post_wall_timber_stud_clt_gate_c_next_slice_selection_v1",
      closedImplementationSlice: "wall_timber_stud_clt_accuracy_pass_v1",
      latestLandedGate: "wall_timber_stud_clt_accuracy_pass_v1_gate_c_no_runtime_closeout",
      selectedImplementationSlice: "floor_fallback_low_confidence_cleanup_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md",
      selectedRouteFamily: "floor_open_web_or_open_box_low_confidence_fallback",
      selectionStatus: "selected_after_common_wall_formula_lanes_closed_no_runtime_without_source_unlock",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      nextExecutionAction:
        "gate_a_audit_floor_steel_fallback_low_confidence_source_formula_surface_before_runtime_change"
    });

    for (const path of [
      POST_WALL_TIMBER_STUD_CLT_GATE_C_NEXT_SLICE_SELECTION.selectedPlanningSurface,
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties closeout to the two no-runtime wall source/formula blockers", () => {
    expect(WALL_TIMBER_STUD_CLT_CLOSEOUT_EVIDENCE.posture).toBe(
      "no_runtime_gate_a_plus_two_gate_b_source_formula_contracts_closed"
    );
    expect(WALL_TIMBER_STUD_CLT_CLOSEOUT_EVIDENCE.closedBecause).toEqual([
      "timber_stud_live_stack_has_no_verified_exact_or_lab_fallback_match",
      "timber_exact_rows_do_not_match_live_double_board_fill_cavity_topology",
      "clt_wall_live_stack_has_no_verified_exact_or_lab_fallback_match",
      "current_catalog_has_no_wall_specific_clt_exact_row",
      "dataholz_clt_rows_are_floor_source_truth_not_wall_exact_truth"
    ]);
    expect(WALL_TIMBER_STUD_CLT_CLOSEOUT_EVIDENCE.keptRuntimePosture).toEqual({
      cltWall: {
        confidence: "medium",
        evidenceTier: "formula",
        fieldRwPrimeDb: 41,
        generatedCaseId: "wall-clt-local",
        labRwDb: 42,
        strategy: "laminated_leaf_sharp_delegate"
      },
      timberStud: {
        confidence: "low",
        evidenceTier: "formula",
        fieldRwPrimeDb: 42,
        generatedCaseId: "wall-timber-stud",
        labRwDb: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      }
    });
  });

  it("selects floor fallback cleanup because it is the remaining runtime widening candidate", () => {
    expect(SELECTED_FLOOR_FALLBACK_CLEANUP_EVIDENCE).toEqual({
      candidateId: "floor.steel_fallback_low_confidence.field",
      generatedCaseId: "floor-steel-fallback",
      selectedBecause: [
        "wall_runtime_candidates_are_now_closed_or_blocked_without_new_source_evidence",
        "cartography_marks_the_steel_suspended_floor_as_the_remaining_runtime_widening_candidate",
        "the_lane_is_common_enough_for_private_use_but_currently_screening_and_low_confidence",
        "the_lane_has_visible_web_card_coverage_and_engine_origin_pins_that_can_be_audited_before_math_changes",
        "tightening_or_fail_closed_honesty_here_improves_personal_use_floor_coverage_after_wall_accuracy"
      ],
      currentPosture: {
        evidenceTier: "screening",
        estimateKind: "low_confidence",
        originBasisId: "predictor_floor_system_low_confidence_estimate",
        supportedFieldOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
        unsupportedFieldOutputs: ["L'nT,50"]
      },
      firstGate:
        "gate_a_pin_floor_steel_fallback_current_values_source_candidates_web_card_honesty_and_exact_precedence_no_runtime_change"
    });
  });

  it("keeps exact-source, blocked-family, and productization boundaries closed for the new slice", () => {
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "reopen_timber_stud_or_clt_wall_formula_values_without_new_source_evidence",
      "borrow_dataholz_floor_clt_rows_as_wall_clt_truth",
      "promote_floor_steel_fallback_from_low_confidence_without_exact_source_benchmark_or_bounded_family_rule",
      "reopen_GDMTXA04A_C11c_raw_bare_open_box_open_web_or_wall_selector_blocked_sources",
      "resume_productization_route_integration_before_the_calculator_readiness_chain_closes"
    ]);
  });
});
