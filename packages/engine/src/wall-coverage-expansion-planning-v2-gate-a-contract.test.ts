import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_COVERAGE_EXPANSION_GATE_A = {
  sliceId: "wall_coverage_expansion_planning_v2",
  landedGate: "gate_a_current_wall_coverage_inventory",
  latestClosedSlice: "calculator_source_gap_revalidation_v1",
  selectedImplementationSlice: "wall_single_leaf_mass_law_calibration_v1",
  selectedOutputSurface: "single_leaf_mass_law_wall_candidate_matrix",
  selectedPlanningSurface:
    "docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md",
  selectedRouteFamily: "wall_single_leaf_massive_formula_lane",
  selectionStatus:
    "selected_no_runtime_formula_owned_first_wall_runtime_source_slice",
  numericRuntimeBehaviorChange: false,
  runtimeWidening: false,
  runtimeTightening: false,
  nextExecutionAction:
    "wall_single_leaf_mass_law_calibration_v1_gate_a_source_formula_contract",
  followUpPlanningAction:
    "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection_contract"
} as const;

const WALL_ARCHETYPE_COVERAGE_INVENTORY = [
  {
    id: "verified_catalog_and_exact_wall_rows",
    currentPosture: "exact_or_lab_fallback",
    evidenceOwners: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ],
    runtimeRetuneEligibleInGateA: false
  },
  {
    id: "single_leaf_masonry_exact_anchor",
    currentPosture: "exact_precedence_plus_formula_trace",
    evidenceOwners: ["packages/engine/src/wall-formula-family-widening-audit.test.ts"],
    runtimeRetuneEligibleInGateA: false
  },
  {
    id: "heavy_core_concrete_lined_massive_wall",
    currentPosture: "screening_formula_components_present",
    evidenceOwners: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts"
    ],
    runtimeRetuneEligibleInGateA: false
  },
  {
    id: "timber_stud_double_board_wall",
    currentPosture: "formula_low_confidence_source_blocked",
    evidenceOwners: ["packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts"],
    runtimeRetuneEligibleInGateA: false
  },
  {
    id: "clt_wall_laminated_single_leaf",
    currentPosture: "formula_medium_confidence_source_blocked",
    evidenceOwners: ["packages/engine/src/wall-clt-gate-b-source-contract.test.ts"],
    runtimeRetuneEligibleInGateA: false
  },
  {
    id: "preset_and_live_route_card_wall_coverage",
    currentPosture: "workbench_preset_and_route_guarded",
    evidenceOwners: [
      "apps/web/features/workbench/wall-full-preset-contract-matrix.test.ts",
      "apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts",
      "apps/web/features/workbench/wall-preset-expansion-benchmarks.test.ts"
    ],
    runtimeRetuneEligibleInGateA: false
  }
] as const;

const COMMON_WALL_COMBINATION_POSTURE = [
  {
    id: "unmatched_single_leaf_concrete_masonry_dense_aac",
    currentPromotionStatus: "not_promoted",
    currentRisk: "coverage_gap_until_formula_coefficients_and_precedence_are_pinned",
    selectedForNextGate: true
  },
  {
    id: "wall_heavy_core_concrete_lined_massive",
    currentPromotionStatus: "not_promoted",
    currentRisk: "screening_until_source_row_or_bounded_family_rule_exists",
    selectedForNextGate: false
  },
  {
    id: "wall_timber_stud_double_board",
    currentPromotionStatus: "not_promoted",
    currentRisk: "low_confidence_until_exact_benchmark_or_bounded_rule_exists",
    selectedForNextGate: false
  },
  {
    id: "wall_clt_single_leaf",
    currentPromotionStatus: "not_promoted",
    currentRisk: "formula_owned_until_wall_specific_clt_source_or_solver_is_pinned",
    selectedForNextGate: false
  },
  {
    id: "generic_double_leaf_stud_cavity",
    currentPromotionStatus: "not_promoted",
    currentRisk: "needs_sharp_davy_scoping_before_runtime_widening",
    selectedForNextGate: false
  }
] as const;

const WALL_RUNTIME_GUARDRAILS = [
  {
    id: "raw_wall_hostile_many_layer_and_fail_closed_inputs",
    evidenceOwners: [
      "packages/engine/src/raw-wall-hostile-input-answer-matrix.test.ts",
      "apps/web/features/workbench/raw-wall-hostile-input-route-card-matrix.test.ts"
    ]
  },
  {
    id: "wall_reorder_invariance",
    evidenceOwners: ["apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts"]
  },
  {
    id: "wall_physical_invariants",
    evidenceOwners: ["apps/web/features/workbench/wall-physical-invariants-matrix.test.ts"]
  },
  {
    id: "wall_field_output_completeness_and_missing_input_honesty",
    evidenceOwners: [
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
    ]
  },
  {
    id: "all_caller_invalid_thickness_fail_closed",
    evidenceOwners: [
      "packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts"
    ]
  }
] as const;

const WALL_CANDIDATE_ORDER = [
  {
    id: "wall_single_leaf_mass_law_calibration_v1",
    order: 1,
    selectedNow: true,
    requiredGateBPrerequisites: [
      "positive_matrix_for_unmatched_single_leaf_concrete_masonry_dense_aac",
      "negative_matrix_for_catalog_exact_lsf_resilient_stud_double_leaf_and_lined_massive_heavy_core",
      "precedence_matrix_exact_and_lab_fallback_before_formula_lane",
      "source_formula_coefficient_contract_before_runtime_value_change",
      "ui_route_card_matrix_if_output_support_confidence_or_values_move"
    ]
  },
  {
    id: "wall_double_leaf_sharp_davy_scoping_v1",
    order: 2,
    selectedNow: false,
    requiredGateBPrerequisites: [
      "sharp_vs_davy_applicability_contract",
      "stud_metadata_cavity_fill_and_triple_leaf_negative_cases"
    ]
  },
  {
    id: "wall_clt_wall_formula_or_source_tightening_v1",
    order: 3,
    selectedNow: false,
    requiredGateBPrerequisites: [
      "wall_specific_clt_source_or_laminated_leaf_formula_tolerance"
    ]
  },
  {
    id: "wall_timber_stud_bounded_confidence_tightening_v1",
    order: 4,
    selectedNow: false,
    requiredGateBPrerequisites: ["exact_benchmark_or_bounded_stud_wall_rule"]
  },
  {
    id: "wall_source_catalog_acquisition_v1",
    order: 5,
    selectedNow: false,
    requiredGateBPrerequisites: ["ready_exact_wall_rows_and_schema_import_contract"]
  }
] as const;

function allEvidenceOwnerPaths(): string[] {
  return [
    "docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md",
    WALL_COVERAGE_EXPANSION_GATE_A.selectedPlanningSurface,
    "docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md",
    ...WALL_ARCHETYPE_COVERAGE_INVENTORY.flatMap((entry) => entry.evidenceOwners),
    ...WALL_RUNTIME_GUARDRAILS.flatMap((entry) => entry.evidenceOwners)
  ];
}

describe("wall coverage expansion planning v2 Gate A contract", () => {
  it("closes Gate A without runtime movement and selects single-leaf mass-law calibration", () => {
    expect(WALL_COVERAGE_EXPANSION_GATE_A).toEqual({
      sliceId: "wall_coverage_expansion_planning_v2",
      landedGate: "gate_a_current_wall_coverage_inventory",
      latestClosedSlice: "calculator_source_gap_revalidation_v1",
      selectedImplementationSlice: "wall_single_leaf_mass_law_calibration_v1",
      selectedOutputSurface: "single_leaf_mass_law_wall_candidate_matrix",
      selectedPlanningSurface:
        "docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md",
      selectedRouteFamily: "wall_single_leaf_massive_formula_lane",
      selectionStatus:
        "selected_no_runtime_formula_owned_first_wall_runtime_source_slice",
      numericRuntimeBehaviorChange: false,
      runtimeWidening: false,
      runtimeTightening: false,
      nextExecutionAction:
        "wall_single_leaf_mass_law_calibration_v1_gate_a_source_formula_contract",
      followUpPlanningAction:
        "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection_contract"
    });
  });

  it("records current wall archetype coverage with evidence owners", () => {
    expect(WALL_ARCHETYPE_COVERAGE_INVENTORY.map((entry) => entry.id)).toEqual([
      "verified_catalog_and_exact_wall_rows",
      "single_leaf_masonry_exact_anchor",
      "heavy_core_concrete_lined_massive_wall",
      "timber_stud_double_board_wall",
      "clt_wall_laminated_single_leaf",
      "preset_and_live_route_card_wall_coverage"
    ]);

    expect(
      WALL_ARCHETYPE_COVERAGE_INVENTORY.every(
        (entry) => entry.runtimeRetuneEligibleInGateA === false
      )
    ).toBe(true);

    for (const path of allEvidenceOwnerPaths()) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps low-confidence, formula, and screening wall surfaces unpromoted", () => {
    expect(COMMON_WALL_COMBINATION_POSTURE.map((entry) => entry.id)).toEqual([
      "unmatched_single_leaf_concrete_masonry_dense_aac",
      "wall_heavy_core_concrete_lined_massive",
      "wall_timber_stud_double_board",
      "wall_clt_single_leaf",
      "generic_double_leaf_stud_cavity"
    ]);
    expect(
      COMMON_WALL_COMBINATION_POSTURE.every(
        (entry) => entry.currentPromotionStatus === "not_promoted"
      )
    ).toBe(true);
    expect(COMMON_WALL_COMBINATION_POSTURE.filter((entry) => entry.selectedForNextGate)).toEqual([
      {
        id: "unmatched_single_leaf_concrete_masonry_dense_aac",
        currentPromotionStatus: "not_promoted",
        currentRisk:
          "coverage_gap_until_formula_coefficients_and_precedence_are_pinned",
        selectedForNextGate: true
      }
    ]);
  });

  it("pins the next candidate order and the selected Gate B prerequisites", () => {
    expect(WALL_CANDIDATE_ORDER.map((candidate) => candidate.id)).toEqual([
      "wall_single_leaf_mass_law_calibration_v1",
      "wall_double_leaf_sharp_davy_scoping_v1",
      "wall_clt_wall_formula_or_source_tightening_v1",
      "wall_timber_stud_bounded_confidence_tightening_v1",
      "wall_source_catalog_acquisition_v1"
    ]);

    const selected = WALL_CANDIDATE_ORDER.find((candidate) => candidate.selectedNow);
    expect(selected?.id).toBe("wall_single_leaf_mass_law_calibration_v1");
    expect(selected?.requiredGateBPrerequisites).toEqual([
      "positive_matrix_for_unmatched_single_leaf_concrete_masonry_dense_aac",
      "negative_matrix_for_catalog_exact_lsf_resilient_stud_double_leaf_and_lined_massive_heavy_core",
      "precedence_matrix_exact_and_lab_fallback_before_formula_lane",
      "source_formula_coefficient_contract_before_runtime_value_change",
      "ui_route_card_matrix_if_output_support_confidence_or_values_move"
    ]);
  });

  it("requires hostile-input, reorder, invariant, and unsupported-output guards before runtime work", () => {
    expect(WALL_RUNTIME_GUARDRAILS.map((guard) => guard.id)).toEqual([
      "raw_wall_hostile_many_layer_and_fail_closed_inputs",
      "wall_reorder_invariance",
      "wall_physical_invariants",
      "wall_field_output_completeness_and_missing_input_honesty",
      "all_caller_invalid_thickness_fail_closed"
    ]);
  });
});
