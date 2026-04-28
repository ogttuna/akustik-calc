import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ImportReadiness = "bounded_existing_rows" | "needs_research" | "reject_adjacent_context";

type SourceTarget = {
  currentEvidenceOwners: readonly string[];
  directSourceRowsPresent: boolean;
  family: string;
  id: string;
  importReadiness: ImportReadiness;
  minimumUnlock: readonly string[];
  runtimeMovementAllowedNow: false;
  sourceLocators: readonly string[];
};

const WALL_SOURCE_CATALOG_GATE_A = {
  sliceId: "wall_source_catalog_acquisition_v1",
  landedGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
  previousClosedSlice: "wall_double_leaf_source_evidence_acquisition_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  status: "no_runtime_source_target_inventory_landed",
  selectedGateBAction: "gate_b_source_pack_readiness_closeout_or_first_direct_import_pack"
} as const;

const REQUIRED_ROW_METADATA = [
  "source_label",
  "source_url_or_local_path",
  "page_table_or_row_locator",
  "retrieval_date",
  "exact_layer_order",
  "layer_thicknesses",
  "material_names",
  "density_or_surface_mass",
  "mounting_and_coupling",
  "cavity_depth_and_fill",
  "stud_type_spacing_and_side_count_when_relevant",
  "reported_metric_context_and_tolerance",
  "local_material_mapping_confidence",
  "precedence_impact_exact_bound_family_formula_or_screening",
  "paired_engine_value_test_before_runtime_movement",
  "paired_web_route_card_test_before_visible_movement"
] as const;

const WALL_SOURCE_TARGETS: readonly SourceTarget[] = [
  {
    id: "manufacturer_framed_wall_system_rows",
    family: "w111_w112_w115_w119_and_adjacent_manufacturer_framed_systems",
    importReadiness: "bounded_existing_rows",
    directSourceRowsPresent: true,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "knauf_nl_system_tables_pdf_2026-04-28",
      "knauf_quietstud_pdf_2026-04-28",
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "packages/engine/src/airborne-verified-catalog.ts"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts",
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "packages/engine/src/airborne-verified-catalog.ts"
    ],
    minimumUnlock: [
      "new_rows_must_include_layer_mounting_and_metric_locator_metadata",
      "current_w111_w112_w115_w119_fit_rows_must_remain_within_existing_tolerances",
      "adjacent_manufacturer_rows_must_not_override_exact_verified_catalog_precedence"
    ]
  },
  {
    id: "no_stud_empty_or_porous_double_leaf_rows",
    family: "empty_or_porous_double_leaf_without_studs",
    importReadiness: "needs_research",
    directSourceRowsPresent: false,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "davy_double_leaf_abstract_formula_context_2026-04-28",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts"
    ],
    minimumUnlock: [
      "direct_no_stud_stack_row_or_named_formula_tolerance_owner",
      "empty_and_porous_cavity_cases_must_be_separated",
      "stud_or_framed_benchmark_rows_must_not_promote_no_stud_runtime_values"
    ]
  },
  {
    id: "timber_double_board_stud_rows",
    family: "timber_double_board_stud_wall_systems",
    importReadiness: "needs_research",
    directSourceRowsPresent: false,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "packages/engine/src/wall-timber-lightweight-source-corpus.ts",
      "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/wall-timber-lightweight-source-corpus.ts",
      "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts"
    ],
    minimumUnlock: [
      "matching_double_board_row_with_board_count_cavity_fill_and_stud_coupling",
      "resilient_side_count_must_be_explicit_when_resilient_mounting_is_present",
      "single_board_timber_rows_must_not_promote_double_board_live_stacks"
    ]
  },
  {
    id: "clt_wall_assembly_rows",
    family: "wall_specific_clt_or_laminated_single_leaf_assemblies",
    importReadiness: "needs_research",
    directSourceRowsPresent: false,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts"
    ],
    minimumUnlock: [
      "wall_specific_clt_row_or_documented_laminated_leaf_formula_tolerance",
      "floor_clt_rows_must_remain_floor_source_truth_only",
      "field_and_lab_metric_context_must_be_explicit_before_confidence_movement"
    ]
  },
  {
    id: "lined_massive_heavy_core_concrete_rows",
    family: "lined_massive_and_heavy_core_concrete_wall_systems",
    importReadiness: "needs_research",
    directSourceRowsPresent: false,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "docs/calculator/SOURCE_GAP_LEDGER.md"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "docs/calculator/SOURCE_GAP_LEDGER.md"
    ],
    minimumUnlock: [
      "source_row_or_bounded_family_rule_for_lining_topology",
      "heavy_core_screening_must_not_be_relabelled_as_formula_owned_without_tolerance",
      "renovation_lining_rows_must_pin_side_order_and_decoupling"
    ]
  },
  {
    id: "floor_or_product_delta_adjacent_rows",
    family: "adjacent_floor_impact_or_product_delta_context",
    importReadiness: "reject_adjacent_context",
    directSourceRowsPresent: false,
    runtimeMovementAllowedNow: false,
    sourceLocators: [
      "docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md",
      "docs/calculator/SOURCE_GAP_LEDGER.md"
    ],
    currentEvidenceOwners: [
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
      "packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts"
    ],
    minimumUnlock: [
      "never_import_as_wall_source_truth",
      "can_only_explain_why_a_wall_family_remains_blocked",
      "requires_a_new_wall_specific_row_before_any_wall_runtime_movement"
    ]
  }
] as const;

const NEGATIVE_BOUNDARIES = [
  "exact_verified_catalog_rows_keep_precedence_over_new_adjacent_or_family_rows",
  "bounded_framed_rows_do_not_unlock_generic_no_stud_double_leaf_or_porous_double_leaf",
  "single_board_timber_rows_do_not_unlock_double_board_timber_live_stacks",
  "resilient_rows_require_explicit_side_count_before_promotion",
  "floor_clt_floor_impact_and_product_delta_rows_are_not_wall_source_truth",
  "heavy_core_concrete_and_lined_massive_walls_remain_screening_until_source_row_or_bounded_rule_exists",
  "route_card_support_confidence_evidence_and_missing_input_copy_must_not_move_without_paired_web_tests"
] as const;

const GATE_B_DECISION = {
  directRuntimeImportReadyNow: false,
  reason:
    "only_existing_bounded_framed_rows_are_direct;_every_other_common_wall_target_lacks_direct_rows_or_named_formula_tolerance",
  nextRequiredGate: "gate_b_no_runtime_source_pack_readiness_closeout",
  maySelectImportSliceAfterGateBOnlyIf:
    "a_direct_row_pack_has_complete_metadata_tolerance_negative_boundaries_and_paired_engine_plus_web_tests"
} as const;

describe("wall source catalog acquisition Gate A contract", () => {
  it("lands Gate A as a no-runtime source-target inventory", () => {
    expect(WALL_SOURCE_CATALOG_GATE_A).toEqual({
      sliceId: "wall_source_catalog_acquisition_v1",
      landedGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
      previousClosedSlice: "wall_double_leaf_source_evidence_acquisition_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      status: "no_runtime_source_target_inventory_landed",
      selectedGateBAction: "gate_b_source_pack_readiness_closeout_or_first_direct_import_pack"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("requires complete row metadata before any future source import can move values", () => {
    expect(REQUIRED_ROW_METADATA).toEqual([
      "source_label",
      "source_url_or_local_path",
      "page_table_or_row_locator",
      "retrieval_date",
      "exact_layer_order",
      "layer_thicknesses",
      "material_names",
      "density_or_surface_mass",
      "mounting_and_coupling",
      "cavity_depth_and_fill",
      "stud_type_spacing_and_side_count_when_relevant",
      "reported_metric_context_and_tolerance",
      "local_material_mapping_confidence",
      "precedence_impact_exact_bound_family_formula_or_screening",
      "paired_engine_value_test_before_runtime_movement",
      "paired_web_route_card_test_before_visible_movement"
    ]);
    expect(new Set(REQUIRED_ROW_METADATA).size).toBe(REQUIRED_ROW_METADATA.length);
  });

  it("classifies source target families without authorizing runtime movement", () => {
    expect(WALL_SOURCE_TARGETS.map((target) => target.id)).toEqual([
      "manufacturer_framed_wall_system_rows",
      "no_stud_empty_or_porous_double_leaf_rows",
      "timber_double_board_stud_rows",
      "clt_wall_assembly_rows",
      "lined_massive_heavy_core_concrete_rows",
      "floor_or_product_delta_adjacent_rows"
    ]);
    expect(WALL_SOURCE_TARGETS.every((target) => target.runtimeMovementAllowedNow === false)).toBe(true);
    expect(WALL_SOURCE_TARGETS.filter((target) => target.importReadiness === "bounded_existing_rows")).toHaveLength(1);
    expect(WALL_SOURCE_TARGETS.filter((target) => target.importReadiness === "needs_research")).toHaveLength(4);
    expect(WALL_SOURCE_TARGETS.filter((target) => target.importReadiness === "reject_adjacent_context")).toHaveLength(1);
  });

  it("keeps every target tied to local evidence owners and explicit unlock criteria", () => {
    for (const target of WALL_SOURCE_TARGETS) {
      expect(target.sourceLocators.length, target.id).toBeGreaterThanOrEqual(2);
      expect(target.currentEvidenceOwners.length, target.id).toBeGreaterThanOrEqual(2);
      expect(target.minimumUnlock.length, target.id).toBeGreaterThanOrEqual(3);

      for (const owner of target.currentEvidenceOwners) {
        expect(existsSync(join(REPO_ROOT, owner)), `${target.id} owner ${owner}`).toBe(true);
      }
    }

    expect(WALL_SOURCE_TARGETS.filter((target) => target.directSourceRowsPresent)).toEqual([
      expect.objectContaining({
        id: "manufacturer_framed_wall_system_rows",
        importReadiness: "bounded_existing_rows"
      })
    ]);
  });

  it("pins negative boundaries against adjacent-source leakage", () => {
    expect(NEGATIVE_BOUNDARIES).toEqual([
      "exact_verified_catalog_rows_keep_precedence_over_new_adjacent_or_family_rows",
      "bounded_framed_rows_do_not_unlock_generic_no_stud_double_leaf_or_porous_double_leaf",
      "single_board_timber_rows_do_not_unlock_double_board_timber_live_stacks",
      "resilient_rows_require_explicit_side_count_before_promotion",
      "floor_clt_floor_impact_and_product_delta_rows_are_not_wall_source_truth",
      "heavy_core_concrete_and_lined_massive_walls_remain_screening_until_source_row_or_bounded_rule_exists",
      "route_card_support_confidence_evidence_and_missing_input_copy_must_not_move_without_paired_web_tests"
    ]);
  });

  it("selects a no-runtime Gate B readiness closeout unless a direct row pack becomes complete", () => {
    expect(GATE_B_DECISION).toEqual({
      directRuntimeImportReadyNow: false,
      reason:
        "only_existing_bounded_framed_rows_are_direct;_every_other_common_wall_target_lacks_direct_rows_or_named_formula_tolerance",
      nextRequiredGate: "gate_b_no_runtime_source_pack_readiness_closeout",
      maySelectImportSliceAfterGateBOnlyIf:
        "a_direct_row_pack_has_complete_metadata_tolerance_negative_boundaries_and_paired_engine_plus_web_tests"
    });
  });
});
