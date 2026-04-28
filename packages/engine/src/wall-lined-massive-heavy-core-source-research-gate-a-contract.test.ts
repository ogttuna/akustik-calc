import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

type EvidenceFit =
  | "current_screening_route"
  | "missing_wall_specific_source_rows"
  | "floor_only_concrete_ceiling_rows"
  | "manufacturer_lining_adjacent_context"
  | "formula_framework_without_local_tolerance"
  | "selector_and_deep_hybrid_stability_boundaries"
  | "workbench_screening_preset_surface"
  | "closed_gate_b_baseline";

type SourceCandidate = {
  evidenceFit: EvidenceFit;
  id: string;
  missingBeforeRuntimeMovement: readonly string[];
  rowIds: readonly string[];
  runtimeMovementAllowedNow: false;
  selectedForGateBNow: boolean;
  selectedForGateCNow: boolean;
  topologyFit:
    | "current_live_stack"
    | "wall_source_missing"
    | "floor_system_not_wall"
    | "adjacent_wall_lining_context"
    | "formula_without_bounded_tolerance"
    | "stability_guard_not_source_truth"
    | "visible_preset_not_source_truth"
    | "frozen_prior_audit";
};

const WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A = {
  landedGate: "gate_a_lined_massive_heavy_core_source_and_lining_rule_inventory",
  previousClosedSlice: "wall_clt_wall_source_research_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  sliceId: "wall_lined_massive_heavy_core_source_research_v1",
  status: "no_runtime_source_and_bounded_lining_rule_inventory_landed"
} as const;

const CURRENT_LIVE_LINED_MASSIVE_ROUTE_POSTURE = {
  currentEvidenceTier: "screening",
  currentRuntimePosture: {
    confidence: "medium",
    dynamicFamily: "lined_massive_wall",
    fieldDnTADb: 54.9,
    fieldDnTwDb: 56,
    fieldRwPrimeDb: 55,
    labRwDb: 57,
    strategy: "lined_massive_blend"
  },
  generatedCaseId: "wall-screening-concrete",
  requiredUnlock: "wall_specific_lined_massive_source_row_or_named_bounded_lining_rule"
} as const;

const KNAUF_CONCRETE_FLOOR_ROW_IDS = [
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
  "knauf_cc60_1a_concrete150_carpet_lab_2026",
  "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
] as const;

const SOURCE_CANDIDATES: readonly SourceCandidate[] = [
  {
    evidenceFit: "current_screening_route",
    id: "current_wall_screening_concrete_generated_route",
    missingBeforeRuntimeMovement: [
      "no_verified_airborne_exact_match",
      "no_verified_lab_fallback_match",
      "no_direct_wall_source_row_for_gypsum_board_rockwool_air_gap_concrete_stack",
      "current_lined_massive_blend_has_no_named_topology_specific_single_number_tolerance_owner"
    ],
    rowIds: ["wall-screening-concrete"],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "current_live_stack"
  },
  {
    evidenceFit: "missing_wall_specific_source_rows",
    id: "wall_specific_lined_concrete_or_heavy_masonry_source_rows",
    missingBeforeRuntimeMovement: [
      "no_current_catalog_row_has_wall_scope_plus_lining_cavity_absorber_mounting_and_metric_context",
      "no_source_label_page_table_row_locator_for_the_live_wall_stack",
      "no_paired_engine_value_or_web_route_card_tests_named_for_import"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "wall_source_missing"
  },
  {
    evidenceFit: "floor_only_concrete_ceiling_rows",
    id: "knauf_cc60_concrete_floor_rows",
    missingBeforeRuntimeMovement: [
      "rows_are_floor_system_source_truth_with_floor_covering_and_ceiling_roles",
      "floor_impact_lnw_and_floor_airborne_ratings_do_not_supply_wall_lining_rw_tolerance",
      "floor_ceiling_mounting_roles_do_not_match_a_wall_lining_source_row"
    ],
    rowIds: KNAUF_CONCRETE_FLOOR_ROW_IDS,
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "floor_system_not_wall"
  },
  {
    evidenceFit: "manufacturer_lining_adjacent_context",
    id: "gyproc_or_manufacturer_wall_lining_family_candidates",
    missingBeforeRuntimeMovement: [
      "current_repo_has_family_candidate_context_but_no_imported_wall_lining_row_for_the_live_stack",
      "side_order_mounting_coupling_and_boundary_metadata_are_not_complete_for_runtime_import",
      "source_tolerance_owner_and_negative_boundaries_are_not_named"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "adjacent_wall_lining_context"
  },
  {
    evidenceFit: "formula_framework_without_local_tolerance",
    id: "iso_sharp_davy_and_lined_massive_formula_context",
    missingBeforeRuntimeMovement: [
      "iso_12354_and_iso_717_define_estimation_or_rating_frameworks_not_this_stack_single_number_row",
      "davy_or_sharp_context_is_relevant_but_not_translated_to_a_local_lined_massive_wall_rw_tolerance",
      "local_formula_components_are_parts_of_the_screening_solver_not_a_named_bounded_family_rule"
    ],
    rowIds: [],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "formula_without_bounded_tolerance"
  },
  {
    evidenceFit: "selector_and_deep_hybrid_stability_boundaries",
    id: "selector_value_pins_and_deep_hybrid_heavy_core_rows",
    missingBeforeRuntimeMovement: [
      "value_pins_are_drift_guards_not_source_rows",
      "deep_hybrid_rows_are_stability_boundaries_not_direct_wall_lining_imports",
      "nearby_green_tests_do_not_name_a_runtime_tolerance_owner"
    ],
    rowIds: [
      "wall.deep_hybrid_heavy_core.building",
      "dynamic_airborne_wall_selector_value_pins"
    ],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "stability_guard_not_source_truth"
  },
  {
    evidenceFit: "workbench_screening_preset_surface",
    id: "concrete_wall_workbench_preset",
    missingBeforeRuntimeMovement: [
      "preset_is_a_user_visible_screening_surface_not_a_source_row",
      "preset_values_are_lower_than_the_generated_route_and_do_not_define_import_tolerance",
      "visible_copy_changes_require_paired_web_route_card_tests"
    ],
    rowIds: ["concrete_wall"],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "visible_preset_not_source_truth"
  },
  {
    evidenceFit: "closed_gate_b_baseline",
    id: "wall_heavy_core_concrete_gate_b_v1_prior_audit",
    missingBeforeRuntimeMovement: [
      "prior_gate_b_closed_no_runtime_and_must_not_be_reopened_from_this_gate_alone",
      "screening_to_formula_transition_still_needs_new_source_or_bounded_lining_rule",
      "old_personal_use_slice_is_baseline_context_not_active_runtime_scope"
    ],
    rowIds: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md"
    ],
    runtimeMovementAllowedNow: false,
    selectedForGateBNow: false,
    selectedForGateCNow: true,
    topologyFit: "frozen_prior_audit"
  }
] as const;

const GATE_A_DECISION = {
  directImportReadyNow: false,
  formulaToleranceGateReadyNow: false,
  noRuntimeCloseoutReadyNow: true,
  nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
  runtimePosture:
    "keep_lined_massive_heavy_core_route_screening_until_wall_specific_source_row_or_bounded_lining_rule_exists",
  selectedDirectImportNow: false,
  selectedFormulaToleranceGateNow: false
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "knauf_cc60_floor_rows_do_not_promote_wall_lined_massive_truth",
  "concrete_wall_workbench_preset_does_not_promote_source_truth_or_formula_tolerance",
  "selector_value_pins_and_deep_hybrid_rows_do_not_authorize_runtime_retune",
  "old_heavy_core_gate_b_closeout_remains_baseline_context_not_active_runtime_scope",
  "clt_timber_no_stud_double_leaf_and_blocked_floor_sources_do_not_reopen_from_this_gate",
  "runtime_values_support_confidence_evidence_text_warnings_api_and_route_card_copy_remain_frozen_during_gate_a"
] as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("wall lined massive / heavy-core source research Gate A contract", () => {
  it("lands Gate A as a no-runtime source and bounded lining-rule inventory", () => {
    expect(WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A).toEqual({
      landedGate: "gate_a_lined_massive_heavy_core_source_and_lining_rule_inventory",
      previousClosedSlice: "wall_clt_wall_source_research_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      selectedNextAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sliceId: "wall_lined_massive_heavy_core_source_research_v1",
      status: "no_runtime_source_and_bounded_lining_rule_inventory_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_LINED_MASSIVE_HEAVY_CORE_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the current generated lined massive / heavy-core route without changing math", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(CURRENT_LIVE_LINED_MASSIVE_ROUTE_POSTURE).toEqual({
      currentEvidenceTier: "screening",
      currentRuntimePosture: {
        confidence: "medium",
        dynamicFamily: "lined_massive_wall",
        fieldDnTADb: 54.9,
        fieldDnTwDb: 56,
        fieldRwPrimeDb: 55,
        labRwDb: 57,
        strategy: "lined_massive_blend"
      },
      generatedCaseId: "wall-screening-concrete",
      requiredUnlock: "wall_specific_lined_massive_source_row_or_named_bounded_lining_rule"
    });

    expect(testCase.studyMode).toBe("wall");
    expect(labSnapshot.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "lined_massive_wall",
      selectedMethod: "mass_law",
      strategy: "lined_massive_blend"
    });

    expect(labSnapshot).toMatchObject({
      c: -1.6,
      ctr: -6.5,
      dynamicFamily: "lined_massive_wall",
      rw: 57,
      rwDb: 57,
      stc: 57
    });
    expect(fieldSnapshot).toMatchObject({
      c: -1.6,
      ctr: -6.3,
      dnTA: 54.9,
      dnTw: 56,
      dnW: 55,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwDb: 55,
      rwPrimeDb: 55,
      stc: 55
    });

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, testCase.fieldOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions?.airborneContext))
      .toBeNull();
    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
  });

  it("keeps concrete floor-system rows floor-only and outside wall lining truth", () => {
    const concreteFloorRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      KNAUF_CONCRETE_FLOOR_ROW_IDS.includes(
        system.id as (typeof KNAUF_CONCRETE_FLOOR_ROW_IDS)[number]
      )
    );
    const sourceCandidate = SOURCE_CANDIDATES.find((candidate) => candidate.id === "knauf_cc60_concrete_floor_rows");
    const field = calculateAssembly(
      generatedCase("wall-screening-concrete").rows,
      generatedCase("wall-screening-concrete").fieldOptions
    );

    expect(concreteFloorRows.map((row) => row.id)).toEqual([...KNAUF_CONCRETE_FLOOR_ROW_IDS]);
    expect(concreteFloorRows.map((row) => row.sourceLabel)).toEqual([
      "Knauf AU official system table",
      "Knauf AU official system table",
      "Knauf AU official system table"
    ]);
    expect(concreteFloorRows.map((row) => row.impactRatings.LnW)).toEqual([51, 31, 45]);
    expect(concreteFloorRows.map((row) => row.airborneRatings.Rw)).toEqual([63, 63, 69]);
    expect(sourceCandidate).toMatchObject({
      evidenceFit: "floor_only_concrete_ceiling_rows",
      runtimeMovementAllowedNow: false,
      selectedForGateBNow: false,
      selectedForGateCNow: true,
      topologyFit: "floor_system_not_wall"
    });
    expect(sourceCandidate?.missingBeforeRuntimeMovement).toEqual([
      "rows_are_floor_system_source_truth_with_floor_covering_and_ceiling_roles",
      "floor_impact_lnw_and_floor_airborne_ratings_do_not_supply_wall_lining_rw_tolerance",
      "floor_ceiling_mounting_roles_do_not_match_a_wall_lining_source_row"
    ]);
    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
  });

  it("classifies source, formula, preset, selector, and prior-audit evidence without selecting runtime movement", () => {
    expect(SOURCE_CANDIDATES).toHaveLength(8);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateBNow === false)).toBe(true);
    expect(SOURCE_CANDIDATES.every((candidate) => candidate.selectedForGateCNow === true)).toBe(true);

    expect(SOURCE_CANDIDATES.map((candidate) => candidate.evidenceFit)).toEqual([
      "current_screening_route",
      "missing_wall_specific_source_rows",
      "floor_only_concrete_ceiling_rows",
      "manufacturer_lining_adjacent_context",
      "formula_framework_without_local_tolerance",
      "selector_and_deep_hybrid_stability_boundaries",
      "workbench_screening_preset_surface",
      "closed_gate_b_baseline"
    ]);
    expect(SOURCE_CANDIDATES.find((candidate) => candidate.id === "iso_sharp_davy_and_lined_massive_formula_context"))
      .toMatchObject({
        topologyFit: "formula_without_bounded_tolerance",
        missingBeforeRuntimeMovement: [
          "iso_12354_and_iso_717_define_estimation_or_rating_frameworks_not_this_stack_single_number_row",
          "davy_or_sharp_context_is_relevant_but_not_translated_to_a_local_lined_massive_wall_rw_tolerance",
          "local_formula_components_are_parts_of_the_screening_solver_not_a_named_bounded_family_rule"
        ]
      });
    expect(SOURCE_CANDIDATES.find((candidate) => candidate.id === "selector_value_pins_and_deep_hybrid_heavy_core_rows"))
      .toMatchObject({
        topologyFit: "stability_guard_not_source_truth",
        rowIds: [
          "wall.deep_hybrid_heavy_core.building",
          "dynamic_airborne_wall_selector_value_pins"
        ]
      });

    for (const path of [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
      "packages/engine/src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts",
      "apps/web/features/workbench/dynamic-route-deep-hybrid-swap-heavy-core.test.ts",
      "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("selects Gate C no-runtime closeout and protects all negative boundaries", () => {
    expect(GATE_A_DECISION).toEqual({
      directImportReadyNow: false,
      formulaToleranceGateReadyNow: false,
      noRuntimeCloseoutReadyNow: true,
      nextRequiredGate: "gate_c_no_runtime_closeout_and_next_slice_selection",
      runtimePosture:
        "keep_lined_massive_heavy_core_route_screening_until_wall_specific_source_row_or_bounded_lining_rule_exists",
      selectedDirectImportNow: false,
      selectedFormulaToleranceGateNow: false
    });

    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "knauf_cc60_floor_rows_do_not_promote_wall_lined_massive_truth",
      "concrete_wall_workbench_preset_does_not_promote_source_truth_or_formula_tolerance",
      "selector_value_pins_and_deep_hybrid_rows_do_not_authorize_runtime_retune",
      "old_heavy_core_gate_b_closeout_remains_baseline_context_not_active_runtime_scope",
      "clt_timber_no_stud_double_leaf_and_blocked_floor_sources_do_not_reopen_from_this_gate",
      "runtime_values_support_confidence_evidence_text_warnings_api_and_route_card_copy_remain_frozen_during_gate_a"
    ]);
  });
});
