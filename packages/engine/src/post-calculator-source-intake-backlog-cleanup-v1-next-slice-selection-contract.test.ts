import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CandidateDecision = {
  firstMissingRequirement: string;
  id: string;
  rank: number;
  runtimeImportReadyNow: false;
  selectedAsNextSlice: boolean;
  selectionReason: string;
};

const POST_SOURCE_INTAKE_BACKLOG_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "calculator_source_intake_backlog_cleanup_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_source_ready_intake_backlog_matrix_no_runtime",
  nextExecutionAction: "gate_a_build_generated_floor_fallback_topology_delta_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "generated_floor_fallback_topology_delta_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
  selectedRouteFamily: "generated_floor_fallback_topology_delta_no_runtime",
  selectionStatus:
    "closed_source_intake_backlog_cleanup_no_runtime_and_selected_generated_floor_fallback_topology_delta_because_no_source_ready_runtime_pack_exists",
  sliceId: "post_calculator_source_intake_backlog_cleanup_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts",
  "packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
  "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const POST_GATE_C_CANDIDATE_DECISIONS: readonly CandidateDecision[] = [
  {
    id: "clt_mass_timber_wall",
    rank: 1,
    firstMissingRequirement:
      "exact_wall_table_or_report_row_plus_stc_fstc_astc_iic_to_iso_rw_policy_or_explicit_rejection",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: false,
    selectionReason: "clt_extraction_just_closed_and_metric_policy_tolerance_owner_are_still_missing"
  },
  {
    id: "timber_double_board_stud_wall",
    rank: 2,
    firstMissingRequirement: "direct_live_double_board_timber_row_or_bounded_formula_tolerance_owner",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: false,
    selectionReason: "no_direct_live_stack_row_or_formula_tolerance_owner_is_available_to_extract_now"
  },
  {
    id: "no_stud_double_leaf_wall",
    rank: 3,
    firstMissingRequirement:
      "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_single_number_tolerance_owner",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: false,
    selectionReason: "formula_scope_exists_but_local_single_number_tolerance_owner_is_still_missing"
  },
  {
    id: "generated_floor_fallback",
    rank: 4,
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: true,
    selectionReason:
      "concrete_pliteq_exact_and_ubiq_bound_source_topologies_exist_and_can_be_delta_mapped_without_runtime_movement"
  },
  {
    id: "lined_massive_heavy_core_wall",
    rank: 5,
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: false,
    selectionReason: "wall_specific_lined_heavy_source_row_or_bounded_lining_rule_is_still_missing"
  },
  {
    id: "historical_blocked_families",
    rank: 6,
    firstMissingRequirement:
      "new_source_evidence_for_gdmtxa04a_c11c_true_bare_carrier_impact_or_wall_selector_defect",
    runtimeImportReadyNow: false,
    selectedAsNextSlice: false,
    selectionReason: "historical_families_remain_fail_closed_until_original_blockers_are_directly_satisfied"
  }
] as const;

const GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A = {
  firstGate: "gate_a_build_generated_floor_fallback_topology_delta_matrix_no_runtime",
  requiredArtifacts: [
    "generated_floor_fallback_topology_delta_matrix",
    "pliteq_exact_match_delta_register",
    "ubiq_bound_match_delta_register",
    "exact_bound_precedence_and_near_miss_guards",
    "unsupported_output_low_confidence_visibility_guards",
    "many_layer_and_reorder_stability_guard_plan",
    "next_candidate_decision"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts"
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

const SELECTED_GATE_A_BOUNDARIES = [
  "live_floor_steel_fallback_stays_low_confidence_screening",
  "pliteq_exact_rows_apply_only_when_exact_topology_is_present",
  "ubiq_bound_rows_apply_only_when_bound_topology_is_present",
  "ln_t_50_lnw_plus_ci_and_delta_lw_stay_unsupported_without_source_evidence",
  "exact_and_bound_source_precedence_must_not_be_weakened_by_generated_fallback_logic",
  "many_layer_and_reorder_behavior_must_remain_finite_and_explicitly_caveated"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post calculator source-intake backlog cleanup Gate C next-slice selection contract", () => {
  it("closes the source-intake backlog cleanup slice without runtime movement", () => {
    expect(POST_SOURCE_INTAKE_BACKLOG_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "calculator_source_intake_backlog_cleanup_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_a_source_ready_intake_backlog_matrix_no_runtime",
      nextExecutionAction: "gate_a_build_generated_floor_fallback_topology_delta_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "generated_floor_fallback_topology_delta_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
      selectedRouteFamily: "generated_floor_fallback_topology_delta_no_runtime",
      selectionStatus:
        "closed_source_intake_backlog_cleanup_no_runtime_and_selected_generated_floor_fallback_topology_delta_because_no_source_ready_runtime_pack_exists",
      sliceId: "post_calculator_source_intake_backlog_cleanup_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every backlog candidate runtime-blocked while selecting exactly one no-runtime follow-up", () => {
    expect(POST_GATE_C_CANDIDATE_DECISIONS.map((candidate) => candidate.id)).toEqual([
      "clt_mass_timber_wall",
      "timber_double_board_stud_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "lined_massive_heavy_core_wall",
      "historical_blocked_families"
    ]);
    expect(POST_GATE_C_CANDIDATE_DECISIONS.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(POST_GATE_C_CANDIDATE_DECISIONS.every((candidate) => !candidate.runtimeImportReadyNow)).toBe(true);
    expect(POST_GATE_C_CANDIDATE_DECISIONS.every((candidate) => candidate.firstMissingRequirement.length > 50)).toBe(
      true
    );
    expect(POST_GATE_C_CANDIDATE_DECISIONS.filter((candidate) => candidate.selectedAsNextSlice)).toEqual([
      {
        id: "generated_floor_fallback",
        rank: 4,
        firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
        runtimeImportReadyNow: false,
        selectedAsNextSlice: true,
        selectionReason:
          "concrete_pliteq_exact_and_ubiq_bound_source_topologies_exist_and_can_be_delta_mapped_without_runtime_movement"
      }
    ]);
  });

  it("defines the generated floor fallback Gate A topology-delta contract", () => {
    expect(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A).toEqual({
      firstGate: "gate_a_build_generated_floor_fallback_topology_delta_matrix_no_runtime",
      requiredArtifacts: [
        "generated_floor_fallback_topology_delta_matrix",
        "pliteq_exact_match_delta_register",
        "ubiq_bound_match_delta_register",
        "exact_bound_precedence_and_near_miss_guards",
        "unsupported_output_low_confidence_visibility_guards",
        "many_layer_and_reorder_stability_guard_plan",
        "next_candidate_decision"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts"
    });
    expect(SELECTED_GATE_A_BOUNDARIES).toEqual([
      "live_floor_steel_fallback_stays_low_confidence_screening",
      "pliteq_exact_rows_apply_only_when_exact_topology_is_present",
      "ubiq_bound_rows_apply_only_when_bound_topology_is_present",
      "ln_t_50_lnw_plus_ci_and_delta_lw_stay_unsupported_without_source_evidence",
      "exact_and_bound_source_precedence_must_not_be_weakened_by_generated_fallback_logic",
      "many_layer_and_reorder_behavior_must_remain_finite_and_explicitly_caveated"
    ]);
  });

  it("keeps the source-ready backlog closed as selection evidence, not runtime import permission", () => {
    const backlog = readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md");

    expect(backlog).toContain("generated_floor_fallback");
    expect(backlog).toContain("exact Pliteq/UBIQ topology match or bounded steel/open-web family rule");
    expect(backlog).toContain("These are valid intake locators, not source-ready runtime packs");
    expect(backlog).toContain("No candidate can move `runtimeImportReadyNow` to `true`");
    expect(backlog).toContain(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A.targetFirstGateFile);
  });

  it("keeps the new selected slice docs aligned on the first file and frozen surfaces", () => {
    const docs = [
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain("generated_floor_fallback_topology_delta_v1");
      expect(doc).toContain(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A.targetFirstGateFile);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs.join("\n"), surface).toContain(surface);
    }
  });

  it("records the Gate C checkpoint and active-slice handoff surfaces", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const selectedPlan = readRepoFile(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A.selectedPlanningSurface);

    expect(checkpoint).toContain("LANDED / NO RUNTIME MOVEMENT");
    expect(checkpoint).toContain(POST_SOURCE_INTAKE_BACKLOG_GATE_C_CLOSEOUT.selectedImplementationSlice);
    expect(checkpoint).toContain(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A.targetFirstGateFile);
    expect(selectedPlan).toContain("No runtime import, value movement, confidence promotion");
    expect(selectedPlan).toContain("Pliteq exact rows");
    expect(selectedPlan).toContain("UBIQ INEX / FL-32 bound floor rows");
  });
});
