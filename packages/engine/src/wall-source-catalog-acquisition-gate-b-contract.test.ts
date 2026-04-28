import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ReadinessStatus =
  | "already_reconciled_no_new_import"
  | "blocked_direct_source_missing"
  | "blocked_live_topology_missing"
  | "blocked_wall_specific_source_missing"
  | "blocked_lining_rule_missing"
  | "rejected_not_wall_source_truth";

type SourcePackReadiness = {
  directRowsPresent: boolean;
  evidenceOwners: readonly string[];
  gateATargetId: string;
  id: string;
  missingBeforeImport: readonly string[];
  newRuntimeImportReady: boolean;
  pairedEngineValueTestsReady: boolean;
  pairedWebRouteCardTestsReady: boolean;
  protectedBoundariesPinned: boolean;
  requiredMetadataComplete: boolean;
  sourceToleranceOwnerNamed: boolean;
  status: ReadinessStatus;
};

const WALL_SOURCE_CATALOG_GATE_B = {
  sliceId: "wall_source_catalog_acquisition_v1",
  landedGate: "gate_b_no_runtime_source_pack_readiness_closeout",
  previousGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  status: "no_runtime_no_direct_import_pack_ready",
  selectedGateCAction: "gate_c_close_source_catalog_no_runtime_and_select_next_accuracy_slice"
} as const;

const DIRECT_IMPORT_ACCEPTANCE_CRITERIA = [
  "direct_wall_source_row_matches_live_or_generated_topology",
  "source_label_url_page_table_or_row_locator_is_complete",
  "exact_layer_order_thickness_material_and_density_or_surface_mass_are_complete",
  "mounting_cavity_fill_stud_spacing_coupling_and_side_count_are_complete_when_relevant",
  "reported_metric_context_and_tolerance_owner_are_named",
  "exact_bound_family_formula_or_screening_precedence_impact_is_pinned",
  "negative_boundaries_for_adjacent_rows_are_executable",
  "paired_engine_value_tests_and_web_route_card_tests_are_ready_before_visible_movement"
] as const;

const SOURCE_PACK_READINESS: readonly SourcePackReadiness[] = [
  {
    id: "manufacturer_framed_existing_bounded_pack",
    gateATargetId: "manufacturer_framed_wall_system_rows",
    status: "already_reconciled_no_new_import",
    directRowsPresent: true,
    requiredMetadataComplete: true,
    sourceToleranceOwnerNamed: true,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: true,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts",
      "packages/engine/src/airborne-framed-wall-benchmark.test.ts",
      "packages/engine/src/airborne-verified-catalog.ts"
    ],
    missingBeforeImport: [
      "no_new_runtime_value_needed_because_current_w111_w112_w115_w119_rows_already_fit",
      "adjacent_manufacturer_rows_need_their_own_complete_row_pack_before_import",
      "web_route_card_tests_are_required_before_any_visible_support_confidence_or_evidence_text_change"
    ]
  },
  {
    id: "no_stud_empty_or_porous_double_leaf_pack",
    gateATargetId: "no_stud_empty_or_porous_double_leaf_rows",
    status: "blocked_direct_source_missing",
    directRowsPresent: false,
    requiredMetadataComplete: false,
    sourceToleranceOwnerNamed: false,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: false,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts",
      "packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts"
    ],
    missingBeforeImport: [
      "direct_no_stud_stack_source_row",
      "empty_vs_porous_no_stud_family_separation",
      "named_formula_tolerance_owner_or_bounded_family_rule",
      "paired_engine_and_route_card_tests"
    ]
  },
  {
    id: "timber_double_board_stud_pack",
    gateATargetId: "timber_double_board_stud_rows",
    status: "blocked_live_topology_missing",
    directRowsPresent: false,
    requiredMetadataComplete: false,
    sourceToleranceOwnerNamed: false,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: false,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/wall-timber-lightweight-source-corpus.ts",
      "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts"
    ],
    missingBeforeImport: [
      "matching_double_board_row_for_the_live_material_fill_and_cavity_topology",
      "explicit_stud_coupling_spacing_and_resilient_side_count_when_present",
      "source_tolerance_or_bounded_family_rule",
      "paired_engine_and_route_card_tests"
    ]
  },
  {
    id: "clt_wall_specific_pack",
    gateATargetId: "clt_wall_assembly_rows",
    status: "blocked_wall_specific_source_missing",
    directRowsPresent: false,
    requiredMetadataComplete: false,
    sourceToleranceOwnerNamed: false,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: false,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts"
    ],
    missingBeforeImport: [
      "wall_specific_clt_source_row_or_laminated_leaf_formula_tolerance",
      "lab_or_field_metric_context_for_wall_not_floor",
      "floor_clt_source_truth_exclusion_tests",
      "paired_engine_and_route_card_tests"
    ]
  },
  {
    id: "lined_massive_heavy_core_concrete_pack",
    gateATargetId: "lined_massive_heavy_core_concrete_rows",
    status: "blocked_lining_rule_missing",
    directRowsPresent: false,
    requiredMetadataComplete: false,
    sourceToleranceOwnerNamed: false,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: false,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "docs/calculator/SOURCE_GAP_LEDGER.md"
    ],
    missingBeforeImport: [
      "source_row_or_bounded_family_rule_for_the_lining_topology",
      "side_order_and_decoupling_metadata",
      "screening_to_formula_transition_tolerance_owner",
      "paired_engine_and_route_card_tests"
    ]
  },
  {
    id: "floor_or_product_delta_adjacent_pack",
    gateATargetId: "floor_or_product_delta_adjacent_rows",
    status: "rejected_not_wall_source_truth",
    directRowsPresent: false,
    requiredMetadataComplete: false,
    sourceToleranceOwnerNamed: false,
    protectedBoundariesPinned: true,
    pairedEngineValueTestsReady: false,
    pairedWebRouteCardTestsReady: false,
    newRuntimeImportReady: false,
    evidenceOwners: [
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
      "packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts"
    ],
    missingBeforeImport: [
      "not_eligible_for_wall_import",
      "requires_new_wall_specific_source_row",
      "must_remain_context_only_for_gap_explanation"
    ]
  }
] as const;

const GATE_B_CLOSEOUT_DECISION = {
  directRuntimeImportReadyNow: false,
  selectedImportSliceNow: false,
  closeoutReason:
    "manufacturer_framed_rows_already_fit_and_every_other_common_wall_source_pack_lacks_direct_wall_rows_or_named_tolerance_owner",
  nextRequiredGate: "gate_c_close_source_catalog_no_runtime_and_select_next_accuracy_slice",
  routeCardWorkRequiredNow: false,
  runtimePosture:
    "freeze_values_confidence_support_evidence_and_visible_copy_until_a_complete_direct_row_pack_exists"
} as const;

function importCriteriaSatisfied(pack: SourcePackReadiness): boolean {
  return (
    pack.directRowsPresent &&
    pack.requiredMetadataComplete &&
    pack.sourceToleranceOwnerNamed &&
    pack.protectedBoundariesPinned &&
    pack.pairedEngineValueTestsReady &&
    pack.pairedWebRouteCardTestsReady &&
    pack.newRuntimeImportReady
  );
}

describe("wall source catalog acquisition Gate B contract", () => {
  it("lands Gate B as a no-runtime source-pack readiness closeout", () => {
    expect(WALL_SOURCE_CATALOG_GATE_B).toEqual({
      sliceId: "wall_source_catalog_acquisition_v1",
      landedGate: "gate_b_no_runtime_source_pack_readiness_closeout",
      previousGate: "gate_a_wall_source_catalog_target_inventory_and_import_acceptance_rules",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      status: "no_runtime_no_direct_import_pack_ready",
      selectedGateCAction: "gate_c_close_source_catalog_no_runtime_and_select_next_accuracy_slice"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md",
      "packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the direct import acceptance criteria explicit and complete", () => {
    expect(DIRECT_IMPORT_ACCEPTANCE_CRITERIA).toEqual([
      "direct_wall_source_row_matches_live_or_generated_topology",
      "source_label_url_page_table_or_row_locator_is_complete",
      "exact_layer_order_thickness_material_and_density_or_surface_mass_are_complete",
      "mounting_cavity_fill_stud_spacing_coupling_and_side_count_are_complete_when_relevant",
      "reported_metric_context_and_tolerance_owner_are_named",
      "exact_bound_family_formula_or_screening_precedence_impact_is_pinned",
      "negative_boundaries_for_adjacent_rows_are_executable",
      "paired_engine_value_tests_and_web_route_card_tests_are_ready_before_visible_movement"
    ]);
    expect(new Set(DIRECT_IMPORT_ACCEPTANCE_CRITERIA).size).toBe(DIRECT_IMPORT_ACCEPTANCE_CRITERIA.length);
  });

  it("classifies every Gate A source target at source-pack readiness level", () => {
    expect(SOURCE_PACK_READINESS.map((pack) => [pack.gateATargetId, pack.status])).toEqual([
      ["manufacturer_framed_wall_system_rows", "already_reconciled_no_new_import"],
      ["no_stud_empty_or_porous_double_leaf_rows", "blocked_direct_source_missing"],
      ["timber_double_board_stud_rows", "blocked_live_topology_missing"],
      ["clt_wall_assembly_rows", "blocked_wall_specific_source_missing"],
      ["lined_massive_heavy_core_concrete_rows", "blocked_lining_rule_missing"],
      ["floor_or_product_delta_adjacent_rows", "rejected_not_wall_source_truth"]
    ]);
    expect(SOURCE_PACK_READINESS.every((pack) => pack.protectedBoundariesPinned)).toBe(true);
    expect(SOURCE_PACK_READINESS.every((pack) => pack.newRuntimeImportReady === false)).toBe(true);
  });

  it("does not select any direct runtime import pack", () => {
    expect(SOURCE_PACK_READINESS.filter(importCriteriaSatisfied)).toEqual([]);
    expect(SOURCE_PACK_READINESS.filter((pack) => pack.directRowsPresent)).toEqual([
      expect.objectContaining({
        id: "manufacturer_framed_existing_bounded_pack",
        newRuntimeImportReady: false,
        status: "already_reconciled_no_new_import"
      })
    ]);
    expect(SOURCE_PACK_READINESS.every((pack) => pack.pairedWebRouteCardTestsReady === false)).toBe(true);
  });

  it("keeps every blocked or rejected pack tied to missing evidence and local evidence owners", () => {
    for (const pack of SOURCE_PACK_READINESS) {
      expect(pack.evidenceOwners.length, pack.id).toBeGreaterThanOrEqual(2);
      expect(pack.missingBeforeImport.length, pack.id).toBeGreaterThanOrEqual(3);

      for (const owner of pack.evidenceOwners) {
        expect(existsSync(join(REPO_ROOT, owner)), `${pack.id} owner ${owner}`).toBe(true);
      }
    }

    expect(
      SOURCE_PACK_READINESS.filter((pack) => pack.status !== "already_reconciled_no_new_import").every(
        (pack) =>
          pack.directRowsPresent === false &&
          pack.requiredMetadataComplete === false &&
          pack.sourceToleranceOwnerNamed === false
      )
    ).toBe(true);
  });

  it("selects Gate C closeout instead of a runtime import or route-card move", () => {
    expect(GATE_B_CLOSEOUT_DECISION).toEqual({
      directRuntimeImportReadyNow: false,
      selectedImportSliceNow: false,
      closeoutReason:
        "manufacturer_framed_rows_already_fit_and_every_other_common_wall_source_pack_lacks_direct_wall_rows_or_named_tolerance_owner",
      nextRequiredGate: "gate_c_close_source_catalog_no_runtime_and_select_next_accuracy_slice",
      routeCardWorkRequiredNow: false,
      runtimePosture:
        "freeze_values_confidence_support_evidence_and_visible_copy_until_a_complete_direct_row_pack_exists"
    });
  });
});
