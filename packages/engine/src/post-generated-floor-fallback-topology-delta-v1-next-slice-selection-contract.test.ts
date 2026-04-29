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

const POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "generated_floor_fallback_topology_delta_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateBSelected: false,
  latestLandedGate: "gate_a_generated_floor_fallback_topology_delta_matrix_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v4",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_generated_floor_topology_delta",
  selectionStatus:
    "closed_generated_floor_fallback_topology_delta_no_runtime_and_selected_source_gap_revalidation_v4_because_gate_a_found_near_misses_only",
  sliceId: "post_generated_floor_fallback_topology_delta_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
  "packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_A_CLOSEOUT_EVIDENCE = {
  gateAContract: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
  gateAResult: "topology_near_misses_only_no_source_ready_runtime_candidate",
  liveFallbackPosture: "low_confidence_screening",
  preservedBoundaries: [
    "pliteq_exact_rows_apply_only_to_exact_pliteq_topology",
    "ubiq_fl32_bound_rows_apply_only_to_bound_source_topology",
    "pliteq_exact_and_ubiq_bound_rows_are_not_blended_into_one_generated_family_rule",
    "ln_t_50_lnw_plus_ci_and_delta_lw_stay_unsupported_without_source_evidence",
    "split_live_stack_variants_remain_finite_without_exact_or_bound_promotion"
  ],
  runtimeImportReadyNow: false
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "floor_fallback_runtime_import_or_confidence_promotion",
    reason:
      "gate_a_found_exact_and_bound_topology_near_misses_only_so the generated floor fallback still lacks exact topology metric ownership tolerance ownership and paired visible tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts"
  },
  {
    id: "source_gated_wall_or_historical_runtime_reopen",
    reason:
      "source_ready_intake_backlog_still_marks_clt_timber_no_stud_lined_heavy_and_historical_blocked_families_as_runtime_import_ready_false",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "calculator_source_gap_revalidation_v4",
    reason:
      "after_closing_the_bounded_floor_topology_delta_without_runtime_movement_the_next_honest_step_is_to_rerank_source_accuracy_candidates_before_more_runtime_or_productization_work",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts"
  },
  {
    id: "internal_pilot_confidence_or_support_promotion",
    reason:
      "internal_handoff_and_operating_envelope_are_controlled_use_evidence_only_and_do_not_promote_low_confidence_screening_or_source_gated_families",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md"
  },
  {
    id: "productization_only_work",
    reason:
      "calculator_scope_and_accuracy_remain_the_active_priority_and_productization_should_not_resume_from_a_no_runtime_source_gap_closeout",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V4_GATE_A_CONTRACT = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
  requiredCandidateFamilies: [
    "generated_floor_fallback_topology_delta_closeout",
    "source_ready_backlog_wall_and_floor_candidates",
    "clt_mass_timber_timber_double_board_no_stud_and_lined_heavy_wall_holdouts",
    "historical_blocked_floor_and_wall_selector_families",
    "internal_use_handoff_acceptance_and_visibility_evidence",
    "fresh_source_acquisition_or_external_research_needed_before_runtime_import",
    "architecture_and_productization_tracks_that_do_not_outrank_calculator_accuracy"
  ],
  requiredEvidenceFields: [
    "candidate_id_current_posture_and_user_visible_risk",
    "latest_executable_evidence_owner_and_doc_owner",
    "first_missing_source_metric_tolerance_or_visible_test_requirement",
    "negative_boundaries_that_must_stay_closed",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts"
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

describe("post generated floor fallback topology-delta Gate C next-slice selection contract", () => {
  it("closes the topology-delta slice without runtime or visible-surface movement", () => {
    expect(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "generated_floor_fallback_topology_delta_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateBSelected: false,
      latestLandedGate: "gate_a_generated_floor_fallback_topology_delta_matrix_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v4",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_generated_floor_topology_delta",
      selectionStatus:
        "closed_generated_floor_fallback_topology_delta_no_runtime_and_selected_source_gap_revalidation_v4_because_gate_a_found_near_misses_only",
      sliceId: "post_generated_floor_fallback_topology_delta_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate A topology evidence as closeout evidence, not runtime import permission", () => {
    expect(GATE_A_CLOSEOUT_EVIDENCE).toEqual({
      gateAContract: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
      gateAResult: "topology_near_misses_only_no_source_ready_runtime_candidate",
      liveFallbackPosture: "low_confidence_screening",
      preservedBoundaries: [
        "pliteq_exact_rows_apply_only_to_exact_pliteq_topology",
        "ubiq_fl32_bound_rows_apply_only_to_bound_source_topology",
        "pliteq_exact_and_ubiq_bound_rows_are_not_blended_into_one_generated_family_rule",
        "ln_t_50_lnw_plus_ci_and_delta_lw_stay_unsupported_without_source_evidence",
        "split_live_stack_variants_remain_finite_without_exact_or_bound_promotion"
      ],
      runtimeImportReadyNow: false
    });
    expect(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT.runtimeImportSelectedNow).toBe(false);
    expect(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT.confidencePromotion).toBe(false);
    expect(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT.evidencePromotion).toBe(false);
  });

  it("selects source-gap revalidation v4 before runtime, pilot-promotion, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v4",
        reason:
          "after_closing_the_bounded_floor_topology_delta_without_runtime_movement_the_next_honest_step_is_to_rerank_source_accuracy_candidates_before_more_runtime_or_productization_work",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 80)).toBe(true);
  });

  it("defines the selected v4 Gate A contract as no-runtime reranking work", () => {
    expect(SELECTED_V4_GATE_A_CONTRACT).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_generated_floor_topology_delta",
      requiredCandidateFamilies: [
        "generated_floor_fallback_topology_delta_closeout",
        "source_ready_backlog_wall_and_floor_candidates",
        "clt_mass_timber_timber_double_board_no_stud_and_lined_heavy_wall_holdouts",
        "historical_blocked_floor_and_wall_selector_families",
        "internal_use_handoff_acceptance_and_visibility_evidence",
        "fresh_source_acquisition_or_external_research_needed_before_runtime_import",
        "architecture_and_productization_tracks_that_do_not_outrank_calculator_accuracy"
      ],
      requiredEvidenceFields: [
        "candidate_id_current_posture_and_user_visible_risk",
        "latest_executable_evidence_owner_and_doc_owner",
        "first_missing_source_metric_tolerance_or_visible_test_requirement",
        "negative_boundaries_that_must_stay_closed",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts"
    });
  });

  it("keeps current docs aligned on the selected next slice and frozen surfaces", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md"),
      readRepoFile(SELECTED_V4_GATE_A_CONTRACT.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(SELECTED_V4_GATE_A_CONTRACT.targetFirstGateFile);
      expect(doc).toContain("no-runtime");
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs.join("\n"), surface).toContain(surface);
    }
  });

  it("records the Gate C checkpoint and keeps source backlog candidates blocked", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const backlog = readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md");

    expect(checkpoint).toContain("LANDED / NO RUNTIME MOVEMENT");
    expect(checkpoint).toContain(POST_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_C_CLOSEOUT.selectedImplementationSlice);
    expect(checkpoint).toContain(SELECTED_V4_GATE_A_CONTRACT.targetFirstGateFile);
    expect(backlog).toContain("The generated fallback remains low-confidence");
    expect(backlog).toContain("not runtime-import-ready");
    expect(backlog).toContain("No candidate can move `runtimeImportReadyNow` to `true`");
  });
});
