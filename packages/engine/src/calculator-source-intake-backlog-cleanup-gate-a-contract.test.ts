import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ReadinessDimension =
  | "exactTopologyNamed"
  | "metricOwnerNamed"
  | "toleranceOwnerNamed"
  | "negativeBoundariesNamed"
  | "pairedEngineTestsNamed"
  | "pairedWebTestsNamed"
  | "runtimeImportReadyNow";

type SourcePointerScope = "context_only";

type SourcePointer = {
  locator: string;
  scope: SourcePointerScope;
};

type SourceReadyIntakeCandidate = {
  currentRuntimePosture: string;
  existingEvidenceOwners: readonly string[];
  firstMissingRequirement: string;
  id: string;
  negativeBoundaries: readonly string[];
  rank: number;
  readiness: Record<ReadinessDimension, boolean>;
  recommendedNextAction:
    | "close_slice_and_select_next_no_runtime_or_source_ready_gate"
    | "hold_until_direct_double_board_row_or_formula_tolerance_owner"
    | "hold_until_no_stud_row_or_local_formula_tolerance_owner"
    | "hold_until_floor_topology_delta_matrix_or_bounded_family_rule"
    | "hold_until_wall_specific_lined_heavy_row_or_bounded_lining_rule"
    | "keep_fail_closed_until_original_blocker_is_satisfied";
  runtimeBehaviorChange: false;
  sourcePointers: readonly SourcePointer[];
  userVisibleRisk: string;
};

const READINESS_DIMENSIONS: readonly ReadinessDimension[] = [
  "exactTopologyNamed",
  "metricOwnerNamed",
  "toleranceOwnerNamed",
  "negativeBoundariesNamed",
  "pairedEngineTestsNamed",
  "pairedWebTestsNamed",
  "runtimeImportReadyNow"
] as const;

const SOURCE_READY_INTAKE_BACKLOG_MATRIX: readonly SourceReadyIntakeCandidate[] = [
  {
    id: "clt_mass_timber_wall",
    rank: 1,
    currentRuntimePosture: "formula_owned_medium_confidence_source_gated",
    userVisibleRisk:
      "mass_timber_wall_formula_route_can_look_more_source_backed_than_the_current_metric_and_row_mapping_allow",
    existingEvidenceOwners: [
      "packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts",
      "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts",
      "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "woodworks_acoustically_tested_mass_timber_assemblies_wall_tables",
        scope: "context_only"
      },
      {
        locator: "woodworks_mass_timber_fire_and_acoustic_database",
        scope: "context_only"
      },
      {
        locator: "nrc_mass_timber_report_archive_e38fb723_6a4c_4a78_9e47_5a73c92c448f",
        scope: "context_only"
      },
      {
        locator: "nrc_nlt_addendum_archive_9e3b39be_e0ed_415b_9649_3e7ec228f52c",
        scope: "context_only"
      },
      {
        locator: "dataholz_clt_floor_rows_floor_only_rejection_context",
        scope: "context_only"
      }
    ],
    firstMissingRequirement:
      "exact_wall_table_or_report_row_plus_stc_fstc_astc_iic_to_iso_rw_policy_or_explicit_rejection",
    negativeBoundaries: [
      "dataholz_clt_floor_rows_remain_floor_only_source_truth",
      "stc_fstc_astc_iic_context_does_not_become_iso_rw_r_prime_w_or_dntw_truth_without_metric_policy",
      "woodworks_and_nrc_tables_are_source_reservoirs_not_runtime_rows_until_exact_topology_is_extracted"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: true,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "close_slice_and_select_next_no_runtime_or_source_ready_gate",
    runtimeBehaviorChange: false
  },
  {
    id: "timber_double_board_stud_wall",
    rank: 2,
    currentRuntimePosture: "formula_owned_low_confidence_source_gated",
    userVisibleRisk:
      "direct_double_board_timber_stack_can_look_over_precise_without_a_live_stack_row_or_bounded_formula_owner",
    existingEvidenceOwners: [
      "packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts",
      "packages/engine/src/wall-framed-facing-split-warning-stability-gate-b-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "knauf_uk_drywall_systems_performance_guide_april_2026",
        scope: "context_only"
      },
      {
        locator: "knauf_au_systems_plus_design_guide",
        scope: "context_only"
      },
      {
        locator: "adjacent_single_board_and_resilient_bar_exact_rows",
        scope: "context_only"
      }
    ],
    firstMissingRequirement: "direct_live_double_board_timber_row_or_bounded_formula_tolerance_owner",
    negativeBoundaries: [
      "single_board_rows_do_not_promote_double_board_routes",
      "resilient_bar_rows_do_not_promote_direct_connected_timber_routes",
      "steel_lsf_holdout_rows_do_not_become_timber_stud_truth"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "hold_until_direct_double_board_row_or_formula_tolerance_owner",
    runtimeBehaviorChange: false
  },
  {
    id: "no_stud_double_leaf_wall",
    rank: 3,
    currentRuntimePosture: "formula_owned_source_blocked",
    userVisibleRisk:
      "no_stud_or_no_rail_double_leaf_values_can_be_retuned_without_a_local_formula_tolerance_owner",
    existingEvidenceOwners: [
      "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
      "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "davy_sharp_formula_scope",
        scope: "context_only"
      },
      {
        locator: "nrc_context_only_not_no_stud_wall_truth",
        scope: "context_only"
      }
    ],
    firstMissingRequirement: "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_single_number_tolerance_owner",
    negativeBoundaries: [
      "framed_double_leaf_rows_do_not_promote_no_stud_no_rail_routes",
      "formula_context_does_not_move_values_without_local_inputs_and_tolerance",
      "mass_timber_context_does_not_supply_no_stud_double_leaf_truth"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "hold_until_no_stud_row_or_local_formula_tolerance_owner",
    runtimeBehaviorChange: false
  },
  {
    id: "generated_floor_fallback",
    rank: 4,
    currentRuntimePosture: "low_confidence_screening",
    userVisibleRisk:
      "generated_floor_fallback_can_overstate_accuracy_when_deck_ceiling_support_or_resilient_layer_topology_is_missing",
    existingEvidenceOwners: [
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
      "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "ubiq_inex_floor_fire_acoustic_tables",
        scope: "context_only"
      },
      {
        locator: "pliteq_exact_or_bound_floor_rows",
        scope: "context_only"
      }
    ],
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
    negativeBoundaries: [
      "ubiq_and_pliteq_rows_do_not_apply_without_live_stack_topology_match",
      "raw_open_web_and_open_box_impact_remain_fail_closed_without_true_bare_carrier_data",
      "ln_t_50_remains_unsupported_unless_source_evidence_names_it"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "hold_until_floor_topology_delta_matrix_or_bounded_family_rule",
    runtimeBehaviorChange: false
  },
  {
    id: "lined_massive_heavy_core_wall",
    rank: 5,
    currentRuntimePosture: "screening_no_wall_source_or_bounded_lining_rule",
    userVisibleRisk:
      "lined_concrete_or_heavy_core_wall_results_can_be_mistaken_for_wall_source_truth_from_adjacent_lining_context",
    existingEvidenceOwners: [
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "knauf_uk_lining_context_adjacent_only",
        scope: "context_only"
      },
      {
        locator: "knauf_au_lining_context_adjacent_only",
        scope: "context_only"
      }
    ],
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule",
    negativeBoundaries: [
      "floor_only_cc60_or_ceiling_rows_do_not_become_wall_truth",
      "presets_do_not_promote_source_truth",
      "old_heavy_concrete_parity_checks_do_not_reopen_the_route_by_themselves"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "hold_until_wall_specific_lined_heavy_row_or_bounded_lining_rule",
    runtimeBehaviorChange: false
  },
  {
    id: "historical_blocked_families",
    rank: 6,
    currentRuntimePosture: "fail_closed",
    userVisibleRisk:
      "old_exact_imports_can_reopen_from_nearby_green_tests_without_satisfying_the_original_closed_blocker",
    existingEvidenceOwners: [
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
      "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts"
    ],
    sourcePointers: [
      {
        locator: "dataholz_gdmtxa04a_exact_values_with_composite_surface_blocker",
        scope: "context_only"
      },
      {
        locator: "tuas_c11c_visible_schedule_with_anomalous_combined_wet_tuple",
        scope: "context_only"
      }
    ],
    firstMissingRequirement:
      "new_source_evidence_for_gdmtxa04a_c11c_true_bare_carrier_impact_or_wall_selector_defect",
    negativeBoundaries: [
      "source_schedules_alone_do_not_override_closed_blockers",
      "adjacent_package_rows_do_not_become_bare_carrier_rows",
      "historical_fail_closed_families_stay_closed_until_the_original_blocker_is_directly_satisfied"
    ],
    readiness: {
      exactTopologyNamed: false,
      metricOwnerNamed: false,
      toleranceOwnerNamed: false,
      negativeBoundariesNamed: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    recommendedNextAction: "keep_fail_closed_until_original_blocker_is_satisfied",
    runtimeBehaviorChange: false
  }
] as const;

const GATE_A_DECISION = {
  landedGate: "gate_a_source_ready_intake_backlog_matrix_no_runtime",
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  selectedNextFile:
    "packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts",
  runtimeBehaviorChange: false,
  runtimeImportSelectedNow: false,
  supportConfidenceEvidencePromotion: false
} as const;

const REQUIRED_ARTIFACT_KEYS = [
  "source_ready_intake_backlog_matrix",
  "stale_or_duplicate_source_doc_cleanup_notes",
  "per_family_runtime_import_prerequisites",
  "negative_boundary_and_near_miss_register",
  "next_candidate_selection_rules"
] as const;

const FROZEN_VISIBLE_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench input"
] as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const SELECTION_RULES = [
  "select_runtime_slice_only_when_exact_topology_metric_owner_tolerance_owner_boundaries_and_paired_tests_are_named",
  "select_no_runtime_extraction_when_source_locator_is_concrete_but_not_import_ready",
  "select_cleanup_when_planning_surfaces_disagree_or_hide_first_missing_requirement",
  "never_promote_low_confidence_screening_formula_or_source_gated_lanes_for_pilot_convenience"
] as const;

function isRuntimeReady(candidate: SourceReadyIntakeCandidate): boolean {
  return READINESS_DIMENSIONS.every((dimension) => candidate.readiness[dimension]);
}

function readPlanningSurface(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator source intake backlog cleanup Gate A contract", () => {
  it("lands Gate A as a no-runtime source-ready backlog matrix", () => {
    expect(GATE_A_DECISION).toEqual({
      landedGate: "gate_a_source_ready_intake_backlog_matrix_no_runtime",
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      selectedNextFile:
        "packages/engine/src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts",
      runtimeBehaviorChange: false,
      runtimeImportSelectedNow: false,
      supportConfidenceEvidencePromotion: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every blocked family represented exactly once and runtime-blocked", () => {
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.map((candidate) => candidate.id)).toEqual([
      "clt_mass_timber_wall",
      "timber_double_board_stud_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "lined_massive_heavy_core_wall",
      "historical_blocked_families"
    ]);
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(SOURCE_READY_INTAKE_BACKLOG_MATRIX.map((candidate) => candidate.id)).size).toBe(
      SOURCE_READY_INTAKE_BACKLOG_MATRIX.length
    );
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(
      true
    );
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.every((candidate) => candidate.readiness.runtimeImportReadyNow)).toBe(
      false
    );
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.every((candidate) => isRuntimeReady(candidate) === false)).toBe(true);
    expect(SOURCE_READY_INTAKE_BACKLOG_MATRIX.every((candidate) => candidate.firstMissingRequirement.length > 50)).toBe(
      true
    );
  });

  it("allows source pointers only as context until topology metric tolerance and visible tests are ready", () => {
    for (const candidate of SOURCE_READY_INTAKE_BACKLOG_MATRIX) {
      expect(candidate.sourcePointers.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.sourcePointers.every((pointer) => pointer.scope === "context_only"), candidate.id).toBe(true);
      expect(candidate.readiness.exactTopologyNamed, candidate.id).toBe(false);
      expect(candidate.readiness.metricOwnerNamed, candidate.id).toBe(false);
      expect(candidate.readiness.toleranceOwnerNamed, candidate.id).toBe(false);
      expect(candidate.negativeBoundaries.length, candidate.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("documents required artifacts, family blockers, frozen surfaces, and the Gate C next file", () => {
    const backlog = readPlanningSurface("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md");

    for (const key of REQUIRED_ARTIFACT_KEYS) {
      expect(backlog, key).toContain(key);
    }
    for (const candidate of SOURCE_READY_INTAKE_BACKLOG_MATRIX) {
      expect(backlog, candidate.id).toContain(candidate.id);
    }
    expect(backlog).toContain("First missing requirement");
    for (const surface of FROZEN_VISIBLE_SURFACES) {
      expect(backlog, surface).toContain(surface);
    }
    expect(backlog).toContain(GATE_A_DECISION.selectedNextFile);
  });

  it("keeps selection rules conservative enough to prevent convenience promotions", () => {
    expect(SELECTION_RULES).toEqual([
      "select_runtime_slice_only_when_exact_topology_metric_owner_tolerance_owner_boundaries_and_paired_tests_are_named",
      "select_no_runtime_extraction_when_source_locator_is_concrete_but_not_import_ready",
      "select_cleanup_when_planning_surfaces_disagree_or_hide_first_missing_requirement",
      "never_promote_low_confidence_screening_formula_or_source_gated_lanes_for_pilot_convenience"
    ]);
    expect(GATE_A_DECISION.runtimeImportSelectedNow).toBe(false);
    expect(GATE_A_DECISION.supportConfidenceEvidencePromotion).toBe(false);
    expect(GATE_A_DECISION.selectedNextAction).toBe("gate_c_closeout_and_next_slice_selection_no_runtime");
  });

  it("keeps the tactical plan, current state, and agent notes aligned on Gate C next", () => {
    const docs = [
      readPlanningSurface("docs/calculator/SLICE_CALCULATOR_SOURCE_INTAKE_BACKLOG_CLEANUP_V1_PLAN.md"),
      readPlanningSurface("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readPlanningSurface("docs/calculator/CURRENT_STATE.md"),
      readPlanningSurface("AGENTS.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain("calculator_source_intake_backlog_cleanup_v1");
      expect(doc).toContain(GATE_A_DECISION.selectedNextFile);
      expect(doc).toContain("SOURCE_READY_INTAKE_BACKLOG.md");
      expect(doc).toContain("runtime/support/confidence/evidence/API/route-card/output-card");
    }
  });
});
