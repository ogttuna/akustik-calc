import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "internal_use_pilot_handoff_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
  nextExecutionAction: "gate_a_build_source_intake_backlog_cleanup_matrix_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_intake_backlog_cleanup_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
  selectedRouteFamily: "source_intake_backlog_cleanup_no_runtime",
  selectionStatus:
    "closed_internal_use_pilot_handoff_no_runtime_and_selected_source_intake_backlog_cleanup_because_no_pilot_defect_or_source_ready_accuracy_pack_exists",
  sliceId: "post_internal_use_pilot_handoff_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts",
  "docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const HANDOFF_ACCEPTANCE_BUCKETS = [
  "pilot_ready_with_standard_caveat",
  "pilot_allowed_with_visible_caveat",
  "not_defended_fail_closed_or_source_gated",
  "hostile_many_layer_reorder_and_missing_input_edges"
] as const;

const HANDOFF_ACCEPTANCE_SCENARIOS = [
  "wall_lsf_exact_preset",
  "wall_aac_single_leaf_benchmark",
  "wall_masonry_single_leaf_benchmark",
  "floor_pliteq_exact_source_corridor",
  "floor_ubiq_bound_source_corridor",
  "wall_timber_double_board_generated",
  "wall_clt_local_generated",
  "wall_lined_heavy_core_screening",
  "floor_steel_fallback_generated",
  "floor_many_layer_exact_split_stack",
  "floor_many_layer_raw_fail_or_screening_stack",
  "floor_role_defined_reorder_exact_stack",
  "floor_raw_reorder_support_boundary",
  "wall_field_missing_geometry_needs_input",
  "invalid_thickness_all_callers_fail_closed",
  "api_missing_layers_next_field",
  "unsupported_target_output_partition",
  "wall_no_stud_double_leaf_source_gated",
  "historical_blocked_floor_families",
  "mixed_study_mode_save_load_replay_owner"
] as const;

const PRESERVED_SURFACES = [
  "acoustic_formula_values",
  "support_classes",
  "confidence_classes",
  "evidence_tiers",
  "api_shape",
  "route_card_values",
  "output_card_statuses",
  "proposal_report_copy",
  "workbench_input_behavior"
] as const;

const SOURCE_READY_BLOCKERS = [
  {
    id: "timber_double_board_stud_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "direct_double_board_timber_topology_row_or_bounded_formula_tolerance_owner"
  },
  {
    id: "clt_mass_timber_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "wall_specific_clt_nlt_dlt_row_pack_or_laminated_leaf_tolerance_owner"
  },
  {
    id: "lined_massive_heavy_core_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule"
  },
  {
    id: "no_stud_double_leaf_wall",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_tolerance_owner"
  },
  {
    id: "generated_floor_fallback",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule"
  },
  {
    id: "historical_blocked_families",
    runtimeImportReadyNow: false,
    firstMissingRequirement: "new_source_evidence_for_gdmtxa04a_c11c_or_true_bare_carrier_impact_behavior"
  }
] as const;

const SOURCE_INTAKE_BACKLOG_GATE_A = {
  firstGate: "gate_a_build_source_intake_backlog_cleanup_matrix_no_runtime",
  requiredArtifacts: [
    "source_ready_intake_backlog_matrix",
    "stale_or_duplicate_source_doc_cleanup_notes",
    "per_family_runtime_import_prerequisites",
    "negative_boundary_and_near_miss_register",
    "next_candidate_selection_rules"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts"
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post internal-use pilot handoff Gate C next-slice selection contract", () => {
  it("closes the pilot handoff no-runtime and selects source-intake backlog cleanup", () => {
    expect(POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "internal_use_pilot_handoff_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
      nextExecutionAction: "gate_a_build_source_intake_backlog_cleanup_matrix_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_intake_backlog_cleanup_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
      selectedRouteFamily: "source_intake_backlog_cleanup_no_runtime",
      selectionStatus:
        "closed_internal_use_pilot_handoff_no_runtime_and_selected_source_intake_backlog_cleanup_because_no_pilot_defect_or_source_ready_accuracy_pack_exists",
      sliceId: "post_internal_use_pilot_handoff_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the pilot handoff as controlled company-use evidence, not certification or promotion", () => {
    const handoff = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_HANDOFF.md");

    for (const bucket of HANDOFF_ACCEPTANCE_BUCKETS) {
      expect(handoff).toContain(bucket);
    }

    for (const scenarioId of HANDOFF_ACCEPTANCE_SCENARIOS) {
      expect(handoff).toContain(scenarioId);
    }

    expect(handoff).toContain("Controlled company-internal use is allowed only inside the envelope");
    expect(handoff).toContain("not regulatory certification");
    expect(handoff).toContain("not ready for unreviewed");
    expect(handoff).toContain("external/client certification workflows");
    expect(handoff).toContain("release-candidate broad gate for company handoff");
  });

  it("preserves all runtime and visible surfaces through Gate C closeout", () => {
    expect(PRESERVED_SURFACES).toEqual([
      "acoustic_formula_values",
      "support_classes",
      "confidence_classes",
      "evidence_tiers",
      "api_shape",
      "route_card_values",
      "output_card_statuses",
      "proposal_report_copy",
      "workbench_input_behavior"
    ]);
    expect(POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT.numericRuntimeBehaviorChange).toBe(false);
    expect(POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT.proposalReportCopyChange).toBe(false);
    expect(POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT.workbenchInputBehaviorChange).toBe(false);
  });

  it("does not promote any source-gated family after a clean pilot handoff", () => {
    expect(SOURCE_READY_BLOCKERS.map((candidate) => candidate.id)).toEqual([
      "timber_double_board_stud_wall",
      "clt_mass_timber_wall",
      "lined_massive_heavy_core_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "historical_blocked_families"
    ]);
    expect(SOURCE_READY_BLOCKERS.every((candidate) => candidate.runtimeImportReadyNow === false)).toBe(true);
    expect(SOURCE_READY_BLOCKERS.every((candidate) => candidate.firstMissingRequirement.length > 40)).toBe(true);
    expect(POST_INTERNAL_USE_PILOT_HANDOFF_GATE_C_CLOSEOUT.sourceReadyAccuracyPackAvailable).toBe(false);
  });

  it("defines the next source-intake cleanup gate without opening runtime work", () => {
    expect(SOURCE_INTAKE_BACKLOG_GATE_A).toEqual({
      firstGate: "gate_a_build_source_intake_backlog_cleanup_matrix_no_runtime",
      requiredArtifacts: [
        "source_ready_intake_backlog_matrix",
        "stale_or_duplicate_source_doc_cleanup_notes",
        "per_family_runtime_import_prerequisites",
        "negative_boundary_and_near_miss_register",
        "next_candidate_selection_rules"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-intake-backlog-cleanup-gate-a-contract.test.ts"
    });
  });

  it("keeps current docs aligned on the selected next slice and first file", () => {
    const nextPlan = readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md");
    const currentState = readRepoFile("docs/calculator/CURRENT_STATE.md");
    const agents = readRepoFile("AGENTS.md");
    const selectedPlan = readRepoFile(SOURCE_INTAKE_BACKLOG_GATE_A.selectedPlanningSurface);

    for (const doc of [nextPlan, currentState, agents, selectedPlan]) {
      expect(doc).toContain("calculator_source_intake_backlog_cleanup_v1");
      expect(doc).toContain(SOURCE_INTAKE_BACKLOG_GATE_A.targetFirstGateFile);
      expect(doc).toContain("runtime/support/confidence/evidence/API/route-card/output-card");
    }

    expect(selectedPlan).toContain("source-ready intake backlog");
    expect(selectedPlan).toContain("No runtime import, confidence promotion, support promotion, or visible");
    expect(selectedPlan).toContain("card movement is allowed in this slice");
  });
});
