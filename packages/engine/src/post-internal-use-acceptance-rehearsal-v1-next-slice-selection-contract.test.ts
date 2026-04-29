import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "internal_use_acceptance_rehearsal_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_a_company_internal_acceptance_rehearsal_matrix_no_runtime",
  nextExecutionAction: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  reportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "internal_use_pilot_handoff_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
  selectedRouteFamily: "company_internal_pilot_handoff_no_runtime",
  selectionStatus:
    "closed_internal_use_acceptance_rehearsal_no_runtime_and_selected_pilot_handoff_because_no_acceptance_defect_or_source_ready_accuracy_pack_exists",
  sliceId: "post_internal_use_acceptance_rehearsal_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts"
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_INTERNAL_USE_ACCEPTANCE_REHEARSAL_V1_PLAN.md",
  "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
  "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const ACCEPTANCE_REHEARSAL_GATE_A_MATRIX = {
  expectedScenarioCount: 20,
  minimumScenarioCount: 10,
  buckets: [
    "pilot_ready_with_standard_caveat",
    "pilot_allowed_with_visible_caveat",
    "not_defended_fail_closed_or_source_gated",
    "hostile_many_layer_reorder_and_missing_input_edges"
  ],
  scenarioIds: [
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
  ]
} as const;

const ACCEPTANCE_REHEARSAL_PRESERVED_SURFACES = [
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

const SOURCE_READY_ACCURACY_CANDIDATES = [
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

const INTERNAL_USE_PILOT_HANDOFF_GATE_A = {
  firstGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
  requiredArtifacts: [
    "company_internal_pilot_handoff_summary",
    "scenario_bucket_table_with_ready_caveated_and_blocked_lanes",
    "validation_evidence_map_and_command_log",
    "known_gap_and_source_gated_family_register",
    "operator_checklist_for_wall_floor_input_and_result_review"
  ],
  requiredPlanningSurfaces: [
    "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
    "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
  targetFirstGateFile: "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts"
} as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post internal-use acceptance rehearsal Gate C next-slice selection contract", () => {
  it("closes the acceptance rehearsal no-runtime and selects company internal pilot handoff", () => {
    expect(POST_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "internal_use_acceptance_rehearsal_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_a_company_internal_acceptance_rehearsal_matrix_no_runtime",
      nextExecutionAction: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      reportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "internal_use_pilot_handoff_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
      selectedRouteFamily: "company_internal_pilot_handoff_no_runtime",
      selectionStatus:
        "closed_internal_use_acceptance_rehearsal_no_runtime_and_selected_pilot_handoff_because_no_acceptance_defect_or_source_ready_accuracy_pack_exists",
      sliceId: "post_internal_use_acceptance_rehearsal_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts"
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the landed Gate A acceptance matrix as evidence, not as runtime-promotion permission", () => {
    const gateAContract = readRepoFile(
      "packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts"
    );
    const usageNote = readRepoFile("docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md");

    expect(ACCEPTANCE_REHEARSAL_GATE_A_MATRIX.expectedScenarioCount).toBe(20);
    expect(ACCEPTANCE_REHEARSAL_GATE_A_MATRIX.expectedScenarioCount).toBeGreaterThanOrEqual(
      ACCEPTANCE_REHEARSAL_GATE_A_MATRIX.minimumScenarioCount
    );

    for (const bucket of ACCEPTANCE_REHEARSAL_GATE_A_MATRIX.buckets) {
      expect(gateAContract).toContain(bucket);
      expect(usageNote).toContain(bucket);
    }

    for (const scenarioId of ACCEPTANCE_REHEARSAL_GATE_A_MATRIX.scenarioIds) {
      expect(gateAContract).toContain(scenarioId);
    }

    expect(gateAContract).toContain("runtimePromotionAllowed: false");
    expect(gateAContract).toContain("numericRuntimeBehaviorChange: false");
  });

  it("preserves every runtime and visible-surface contract frozen by Gate A", () => {
    expect(ACCEPTANCE_REHEARSAL_PRESERVED_SURFACES).toEqual([
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
    expect(POST_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT.numericRuntimeBehaviorChange).toBe(false);
    expect(POST_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT.runtimeImportSelectedNow).toBe(false);
    expect(POST_INTERNAL_USE_ACCEPTANCE_REHEARSAL_GATE_C_CLOSEOUT.reportCopyChange).toBe(false);
  });

  it("does not promote a source-ready accuracy pack from acceptance success alone", () => {
    expect(SOURCE_READY_ACCURACY_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "timber_double_board_stud_wall",
      "clt_mass_timber_wall",
      "lined_massive_heavy_core_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "historical_blocked_families"
    ]);
    expect(SOURCE_READY_ACCURACY_CANDIDATES.every((candidate) => candidate.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(SOURCE_READY_ACCURACY_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 40)).toBe(
      true
    );
  });

  it("defines the first gate of the selected internal-use pilot handoff slice", () => {
    expect(INTERNAL_USE_PILOT_HANDOFF_GATE_A).toEqual({
      firstGate: "gate_a_prepare_company_internal_pilot_handoff_pack_no_runtime",
      requiredArtifacts: [
        "company_internal_pilot_handoff_summary",
        "scenario_bucket_table_with_ready_caveated_and_blocked_lanes",
        "validation_evidence_map_and_command_log",
        "known_gap_and_source_gated_family_register",
        "operator_checklist_for_wall_floor_input_and_result_review"
      ],
      requiredPlanningSurfaces: [
        "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
        "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md",
      targetFirstGateFile: "packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts"
    });
  });
});
