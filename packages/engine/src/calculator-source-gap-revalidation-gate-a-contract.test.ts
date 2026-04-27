import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A = {
  sliceId: "calculator_source_gap_revalidation_v1",
  landedGate: "gate_a_no_runtime_source_gap_revalidation",
  latestClosedRuntimeOrSourceSlice: "proposal_report_polish_v1",
  selectedImplementationSlice: "wall_coverage_expansion_planning_v2",
  selectedOutputSurface: "wall_coverage_expansion_v2_plan",
  selectedRouteFamily: "wall_acoustic_formula_and_source_gap_families",
  selectionStatus: "selected_no_runtime_wall_coverage_replan_after_source_gap_revalidation",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  runtimeTightening: false,
  nextExecutionAction: "wall_coverage_expansion_planning_v2_gate_a_current_wall_coverage_inventory",
  followUpPlanningAction: "post_wall_coverage_expansion_planning_v2_next_slice_selection_v1"
} as const;

const BLOCKED_SOURCE_FAMILY_REVALIDATION = [
  {
    id: "dataholz_gdmtxa04a_visible_exact_reopen",
    currentPosture: "closed_fail_closed",
    runtimeEligibleNow: false,
    evidenceOwner: "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
    reason:
      "the_visible_65mm_surface_still_represents_a_convenience_proxy_not_a_source_equivalent_composite_dry_screed_surface"
  },
  {
    id: "tuas_c11c_exact_import",
    currentPosture: "closed_fail_closed",
    runtimeEligibleNow: false,
    evidenceOwner: "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
    reason:
      "the_combined_wet_tuple_still_lacks_raw_spectrum_or_source_correction_evidence_for_an_honest_exact_import"
  },
  {
    id: "raw_bare_open_box_open_web_impact_widening",
    currentPosture: "closed_fail_closed",
    runtimeEligibleNow: false,
    evidenceOwner: "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
    reason:
      "the_landed_source_rows_still_describe_packaged_systems_not_true_bare_carrier_impact_behavior"
  },
  {
    id: "wall_selector_behavior_widening",
    currentPosture: "closed_fail_closed",
    runtimeEligibleNow: false,
    evidenceOwner: "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts",
    reason: "no_fresh_classified_wall_selector_red_exists_beyond_the_closed_trace_guard"
  }
] as const;

const RECENT_COMMON_COMBINATION_POSTURE = [
  {
    id: "wall_heavy_core_concrete",
    currentPosture: "screening",
    selectedNow: false,
    evidenceOwner: "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
    reason: "no_exact_row_direct_benchmark_or_topology_specific_tolerance_exists_for_the_selected_lining_stack"
  },
  {
    id: "wall_timber_stud",
    currentPosture: "formula_low_confidence",
    selectedNow: false,
    evidenceOwner: "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
    reason: "no_verified_exact_lab_fallback_or_bounded_family_rule_matches_the_live_double_board_stack"
  },
  {
    id: "wall_clt",
    currentPosture: "formula_medium_confidence",
    selectedNow: false,
    evidenceOwner: "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
    reason: "no_wall_specific_clt_exact_row_or_source_backed_wall_formula_tightening_exists"
  },
  {
    id: "floor_steel_fallback",
    currentPosture: "low_confidence_screening",
    selectedNow: false,
    evidenceOwner: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
    reason: "generated_stack_still_lacks_the_exact_pliteq_or_bounded_ubiq_topology_needed_for_promotion"
  }
] as const;

const SELECTED_WALL_COVERAGE_PLANNING_V2_EVIDENCE = {
  planningAnchors: [
    "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
    "docs/calculator/CHECKPOINT_2026-04-27_CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A_HANDOFF.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/SOURCE_GAP_LEDGER.md",
    "AGENTS.md"
  ],
  inheritedEvidence: [
    "packages/engine/src/post-dataholz-clt-calibration-tightening-second-pass-next-slice-selection-contract.test.ts",
    "docs/archive/analysis/WALL_COVERAGE_EXPANSION_PLAN.md",
    "packages/engine/src/wall-formula-family-widening-audit.test.ts",
    "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts"
  ],
  selectedBecause: [
    "the_blocked_source_queue_has_no_current_runtime_eligible_candidate_after_revalidation",
    "the_private_use_readiness_chain_is_closed_but_wall_coverage_remains_shallower_than_floor_coverage",
    "wall_formula_and_source_gap_work_can_expand_common_layer_combination_coverage_without_reopening_floor_source_blocks",
    "the_archived_wall_coverage_plan_is_stale_enough_that_a_v2_agent_ready_planning_slice_should_inventory_landed_prerequisites_before_the_first_new_runtime_cut"
  ]
} as const;

describe("calculator source-gap revalidation Gate A contract", () => {
  it("closes Gate A without runtime movement and selects wall coverage planning v2", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_GATE_A).toEqual({
      sliceId: "calculator_source_gap_revalidation_v1",
      landedGate: "gate_a_no_runtime_source_gap_revalidation",
      latestClosedRuntimeOrSourceSlice: "proposal_report_polish_v1",
      selectedImplementationSlice: "wall_coverage_expansion_planning_v2",
      selectedOutputSurface: "wall_coverage_expansion_v2_plan",
      selectedRouteFamily: "wall_acoustic_formula_and_source_gap_families",
      selectionStatus: "selected_no_runtime_wall_coverage_replan_after_source_gap_revalidation",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      runtimeTightening: false,
      nextExecutionAction: "wall_coverage_expansion_planning_v2_gate_a_current_wall_coverage_inventory",
      followUpPlanningAction: "post_wall_coverage_expansion_planning_v2_next_slice_selection_v1"
    });
  });

  it("keeps every historical blocked source family fail-closed after revalidation", () => {
    expect(BLOCKED_SOURCE_FAMILY_REVALIDATION.map((candidate) => candidate.id)).toEqual([
      "dataholz_gdmtxa04a_visible_exact_reopen",
      "tuas_c11c_exact_import",
      "raw_bare_open_box_open_web_impact_widening",
      "wall_selector_behavior_widening"
    ]);

    expect(BLOCKED_SOURCE_FAMILY_REVALIDATION.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(
      true
    );
    expect(BLOCKED_SOURCE_FAMILY_REVALIDATION.every((candidate) => candidate.currentPosture === "closed_fail_closed")).toBe(
      true
    );
  });

  it("does not promote nearby common-stack posture from green tests alone", () => {
    expect(RECENT_COMMON_COMBINATION_POSTURE).toEqual([
      {
        id: "wall_heavy_core_concrete",
        currentPosture: "screening",
        selectedNow: false,
        evidenceOwner: "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
        reason:
          "no_exact_row_direct_benchmark_or_topology_specific_tolerance_exists_for_the_selected_lining_stack"
      },
      {
        id: "wall_timber_stud",
        currentPosture: "formula_low_confidence",
        selectedNow: false,
        evidenceOwner: "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
        reason: "no_verified_exact_lab_fallback_or_bounded_family_rule_matches_the_live_double_board_stack"
      },
      {
        id: "wall_clt",
        currentPosture: "formula_medium_confidence",
        selectedNow: false,
        evidenceOwner: "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
        reason: "no_wall_specific_clt_exact_row_or_source_backed_wall_formula_tightening_exists"
      },
      {
        id: "floor_steel_fallback",
        currentPosture: "low_confidence_screening",
        selectedNow: false,
        evidenceOwner: "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
        reason: "generated_stack_still_lacks_the_exact_pliteq_or_bounded_ubiq_topology_needed_for_promotion"
      }
    ]);
  });

  it("ties the selected next slice to current docs and landed wall planning history", () => {
    const requiredPaths = [
      ...SELECTED_WALL_COVERAGE_PLANNING_V2_EVIDENCE.planningAnchors,
      ...SELECTED_WALL_COVERAGE_PLANNING_V2_EVIDENCE.inheritedEvidence,
      ...BLOCKED_SOURCE_FAMILY_REVALIDATION.map((candidate) => candidate.evidenceOwner),
      ...RECENT_COMMON_COMBINATION_POSTURE.map((candidate) => candidate.evidenceOwner)
    ];

    for (const path of requiredPaths) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("records why the next move is a wall planning slice rather than a source-family reopen", () => {
    expect(SELECTED_WALL_COVERAGE_PLANNING_V2_EVIDENCE.selectedBecause).toEqual([
      "the_blocked_source_queue_has_no_current_runtime_eligible_candidate_after_revalidation",
      "the_private_use_readiness_chain_is_closed_but_wall_coverage_remains_shallower_than_floor_coverage",
      "wall_formula_and_source_gap_work_can_expand_common_layer_combination_coverage_without_reopening_floor_source_blocks",
      "the_archived_wall_coverage_plan_is_stale_enough_that_a_v2_agent_ready_planning_slice_should_inventory_landed_prerequisites_before_the_first_new_runtime_cut"
    ]);
  });
});
