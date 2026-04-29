import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type Readiness = {
  metricContextMapped: boolean;
  negativeBoundariesExecutable: boolean;
  pairedEngineTestsNamed: boolean;
  pairedWebTestsNamed: boolean;
  runtimeImportReadyNow: boolean;
  topologyMappingComplete: boolean;
  toleranceOwnerNamed: boolean;
};

type SourcePackCandidate = {
  allowedNextAction:
    | "no_runtime_clt_mass_timber_wall_source_pack_extraction_v1"
    | "hold_runtime_until_direct_live_stack_row_or_bounded_formula_tolerance_owner"
    | "hold_runtime_until_local_formula_inputs_and_single_number_tolerance_owner"
    | "hold_runtime_until_topology_delta_matrix_proves_exact_or_bounded_floor_family"
    | "hold_screening_until_wall_specific_lined_heavy_source_or_bounded_lining_rule"
    | "keep_fail_closed_until_new_source_evidence_satisfies_old_blocker";
  blockers: readonly string[];
  currentPosture: string;
  existingEvidenceOwners: readonly string[];
  externalSourcePointers: readonly string[];
  firstMissingRequirement: string;
  id: string;
  rank: number;
  readiness: Readiness;
  runtimeBehaviorChange: false;
  selectedForNoRuntimeExtraction: boolean;
  userVisibleRisk: string;
};

const SOURCE_PACK_READINESS_DIMENSIONS = [
  "topologyMappingComplete",
  "metricContextMapped",
  "toleranceOwnerNamed",
  "negativeBoundariesExecutable",
  "pairedEngineTestsNamed",
  "pairedWebTestsNamed",
  "runtimeImportReadyNow"
] as const;

const SOURCE_PACK_CANDIDATES: readonly SourcePackCandidate[] = [
  {
    id: "clt_mass_timber_wall",
    rank: 1,
    currentPosture: "formula_owned_medium_confidence_source_gated",
    userVisibleRisk:
      "medium_confidence_formula_estimate_can_be_mistaken_for_source_backed_mass_timber_wall_result",
    existingEvidenceOwners: [
      "packages/engine/src/wall-clt-wall-source-research-gate-a-contract.test.ts",
      "packages/engine/src/post-wall-clt-wall-source-research-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/dataholz-clt-source-truth-audit.test.ts"
    ],
    externalSourcePointers: [
      "woodworks_acoustically_tested_mass_timber_assemblies_pdf_single_clt_nlt_and_double_clt_wall_tables",
      "woodworks_mass_timber_fire_and_acoustic_database_living_report_pointer",
      "nrc_mass_timber_report_archive_e38fb723_6a4c_4a78_9e47_5a73c92c448f",
      "nrc_nlt_addendum_9e3b39be_e0ed_415b_9649_3e7ec228f52c"
    ],
    firstMissingRequirement:
      "extract_exact_wall_table_or_report_row_and_map_stc_astc_context_to_or_reject_for_iso_rw_outputs",
    blockers: [
      "table_groups_are_source_reservoirs_not_import_rows_until_exact_assembly_locators_are_extracted",
      "stc_astc_iic_context_must_not_be_treated_as_dyn_echo_iso_rw_field_truth_without_mapping",
      "dataholz_floor_clt_rows_remain_floor_only_source_truth",
      "paired_engine_and_web_tests_are_named_for_extraction_but_not_ready_for_visible_value_movement"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: true,
      pairedWebTestsNamed: true,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "no_runtime_clt_mass_timber_wall_source_pack_extraction_v1",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: true
  },
  {
    id: "timber_double_board_stud_wall",
    rank: 2,
    currentPosture: "formula_owned_low_confidence_source_gated",
    userVisibleRisk:
      "low_confidence_formula_route_can_look_more_precise_than_the_missing_live_double_board_source_row_allows",
    existingEvidenceOwners: [
      "packages/engine/src/wall-timber-double-board-source-research-gate-a-contract.test.ts",
      "packages/engine/src/post-wall-timber-double-board-source-research-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-corpus-contract.test.ts"
    ],
    externalSourcePointers: [
      "knauf_uk_drywall_systems_performance_guide_april_2026",
      "knauf_au_systems_plus_october_2025"
    ],
    firstMissingRequirement: "direct_live_double_board_timber_stack_row_or_bounded_formula_tolerance_owner",
    blockers: [
      "adjacent_resilient_bar_rows_do_not_match_side_count_board_fill_or_direct_connection_shape",
      "single_board_and_secondary_double_board_context_cannot_promote_the_live_generated_stack",
      "web_route_card_tests_are_required_before_any_visible_support_or_confidence_wording_changes"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "hold_runtime_until_direct_live_stack_row_or_bounded_formula_tolerance_owner",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: false
  },
  {
    id: "no_stud_double_leaf_wall",
    rank: 3,
    currentPosture: "formula_owned_source_blocked",
    userVisibleRisk:
      "formula_owned_no_stud_or_no_rail_double_leaf_outputs_need_clear_tolerance_before_any_retune",
    existingEvidenceOwners: [
      "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts",
      "packages/engine/src/post-wall-no-stud-double-leaf-source-research-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts"
    ],
    externalSourcePointers: ["davy_sharp_formula_scope", "nrc_mass_timber_report_archive_context_only"],
    firstMissingRequirement: "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_tolerance_owner",
    blockers: [
      "current_sources_do_not_name_no_stud_no_rail_direct_row_mapping",
      "local_davy_sharp_single_number_tolerance_owner_is_not_ready",
      "mass_timber_report_context_does_not_supply_this_double_leaf_wall_import"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "hold_runtime_until_local_formula_inputs_and_single_number_tolerance_owner",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: false
  },
  {
    id: "generated_floor_fallback",
    rank: 4,
    currentPosture: "low_confidence_screening",
    userVisibleRisk:
      "generated_steel_floor_fallback_can_overstate_accuracy_when_exact_deck_ceiling_or_support_topology_is_missing",
    existingEvidenceOwners: [
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
      "packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts",
      "packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts"
    ],
    externalSourcePointers: ["ubiq_inex_floor_fire_acoustic_tables", "pliteq_exact_or_bound_floor_rows"],
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
    blockers: [
      "generated_fallback_lacks_the_exact_inex_deck_covering_ceiling_and_support_topology",
      "raw_open_web_and_open_box_impact_behaviour_remains_fail_closed",
      "ln_t_50_remains_unsupported_for_the_generated_steel_floor_fallback"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "hold_runtime_until_topology_delta_matrix_proves_exact_or_bounded_floor_family",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: false
  },
  {
    id: "lined_massive_heavy_core_wall",
    rank: 5,
    currentPosture: "screening_no_wall_source_or_bounded_lining_rule",
    userVisibleRisk:
      "screening_lined_heavy_wall_outputs_need_wall_specific_lining_sources_before_confidence_or_value_movement",
    existingEvidenceOwners: [
      "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
      "packages/engine/src/post-wall-lined-massive-heavy-core-source-research-v1-next-slice-selection-contract.test.ts",
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts"
    ],
    externalSourcePointers: [
      "knauf_uk_lining_context_adjacent_only",
      "knauf_au_systems_plus_lining_context_adjacent_only"
    ],
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule",
    blockers: [
      "floor_only_or_adjacent_lining_context_is_not_wall_source_truth",
      "side_order_decoupling_and_mounting_metadata_are_not_import_ready",
      "screening_to_formula_transition_tolerance_owner_is_missing"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "hold_screening_until_wall_specific_lined_heavy_source_or_bounded_lining_rule",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: false
  },
  {
    id: "historical_blocked_families",
    rank: 6,
    currentPosture: "closed_fail_closed",
    userVisibleRisk:
      "previously_rejected_exact_imports_must_not_reopen_from_nearby_green_tests_or_adjacent_source_context",
    existingEvidenceOwners: [
      "packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts",
      "packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts",
      "packages/engine/src/raw-bare-open-web-open-box-source-evidence-rerank-contract.test.ts",
      "packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts"
    ],
    externalSourcePointers: [],
    firstMissingRequirement: "new_source_evidence_for_gdmtxa04a_c11c_or_true_bare_carrier_impact_behavior",
    blockers: [
      "gdmtxa04a_still_needs_source_equivalent_composite_dry_screed_modeling",
      "c11c_still_needs_raw_spectrum_or_correction_evidence",
      "raw_bare_open_box_open_web_rows_still_describe_packaged_systems_not_true_bare_carriers"
    ],
    readiness: {
      topologyMappingComplete: false,
      metricContextMapped: false,
      toleranceOwnerNamed: false,
      negativeBoundariesExecutable: true,
      pairedEngineTestsNamed: false,
      pairedWebTestsNamed: false,
      runtimeImportReadyNow: false
    },
    allowedNextAction: "keep_fail_closed_until_new_source_evidence_satisfies_old_blocker",
    runtimeBehaviorChange: false,
    selectedForNoRuntimeExtraction: false
  }
] as const;

const GATE_A_DECISION = {
  landedGate: "gate_a_source_pack_readiness_rank_no_runtime",
  nextSliceCandidate: "clt_mass_timber_wall_source_pack_extraction_v1",
  reason:
    "clt_mass_timber_has_the_strongest_current_wall_side_source_reservoir_but_only_for_no_runtime_row_metric_extraction",
  runtimeBehaviorChange: false,
  runtimeImportSelectedNow: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
  supportConfidenceEvidencePromotion: false,
  targetFirstGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts"
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md",
  "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "no_candidate_can_set_runtimeImportReadyNow_true_in_gate_a",
  "clt_mass_timber_extraction_is_not_clt_wall_runtime_import_or_confidence_promotion",
  "stc_astc_iic_rows_do_not_become_iso_rw_or_field_r_prime_w_truth_without_explicit_mapping",
  "dataholz_floor_clt_rows_do_not_promote_wall_clt_truth",
  "timber_double_board_no_stud_double_leaf_floor_fallback_lined_heavy_and_historical_blocks_remain_runtime_blocked",
  "support_confidence_evidence_api_route_card_and_output_card_surfaces_remain_frozen"
] as const;

function runtimeReady(candidate: SourcePackCandidate): boolean {
  return SOURCE_PACK_READINESS_DIMENSIONS.every((dimension) => candidate.readiness[dimension]);
}

describe("calculator source-pack readiness triage Gate A contract", () => {
  it("lands Gate A as a no-runtime source-pack readiness ranking contract", () => {
    expect(GATE_A_DECISION).toEqual({
      landedGate: "gate_a_source_pack_readiness_rank_no_runtime",
      nextSliceCandidate: "clt_mass_timber_wall_source_pack_extraction_v1",
      reason:
        "clt_mass_timber_has_the_strongest_current_wall_side_source_reservoir_but_only_for_no_runtime_row_metric_extraction",
      runtimeBehaviorChange: false,
      runtimeImportSelectedNow: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md",
      supportConfidenceEvidencePromotion: false,
      targetFirstGateFile: "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts"
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the readiness dimensions explicit and import-gated", () => {
    expect(SOURCE_PACK_READINESS_DIMENSIONS).toEqual([
      "topologyMappingComplete",
      "metricContextMapped",
      "toleranceOwnerNamed",
      "negativeBoundariesExecutable",
      "pairedEngineTestsNamed",
      "pairedWebTestsNamed",
      "runtimeImportReadyNow"
    ]);
    expect(new Set(SOURCE_PACK_READINESS_DIMENSIONS).size).toBe(SOURCE_PACK_READINESS_DIMENSIONS.length);
  });

  it("classifies every candidate once and keeps every runtime import blocked", () => {
    expect(SOURCE_PACK_CANDIDATES.map((candidate) => candidate.id)).toEqual([
      "clt_mass_timber_wall",
      "timber_double_board_stud_wall",
      "no_stud_double_leaf_wall",
      "generated_floor_fallback",
      "lined_massive_heavy_core_wall",
      "historical_blocked_families"
    ]);
    expect(SOURCE_PACK_CANDIDATES.map((candidate) => candidate.rank)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(new Set(SOURCE_PACK_CANDIDATES.map((candidate) => candidate.id)).size).toBe(
      SOURCE_PACK_CANDIDATES.length
    );
    expect(SOURCE_PACK_CANDIDATES.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);
    expect(SOURCE_PACK_CANDIDATES.every((candidate) => candidate.readiness.runtimeImportReadyNow === false)).toBe(
      true
    );
    expect(SOURCE_PACK_CANDIDATES.every((candidate) => runtimeReady(candidate) === false)).toBe(true);
    expect(SOURCE_PACK_CANDIDATES.every((candidate) => candidate.firstMissingRequirement.length > 40)).toBe(true);
  });

  it("selects CLT / mass-timber only for no-runtime row and metric extraction", () => {
    const selected = SOURCE_PACK_CANDIDATES.filter((candidate) => candidate.selectedForNoRuntimeExtraction);

    expect(selected).toHaveLength(1);
    expect(selected[0]).toMatchObject({
      allowedNextAction: "no_runtime_clt_mass_timber_wall_source_pack_extraction_v1",
      id: "clt_mass_timber_wall",
      rank: 1,
      readiness: {
        metricContextMapped: false,
        runtimeImportReadyNow: false,
        topologyMappingComplete: false,
        toleranceOwnerNamed: false
      }
    });
    expect(selected[0].externalSourcePointers).toEqual([
      "woodworks_acoustically_tested_mass_timber_assemblies_pdf_single_clt_nlt_and_double_clt_wall_tables",
      "woodworks_mass_timber_fire_and_acoustic_database_living_report_pointer",
      "nrc_mass_timber_report_archive_e38fb723_6a4c_4a78_9e47_5a73c92c448f",
      "nrc_nlt_addendum_9e3b39be_e0ed_415b_9649_3e7ec228f52c"
    ]);
    expect(selected[0].blockers).toContain(
      "stc_astc_iic_context_must_not_be_treated_as_dyn_echo_iso_rw_field_truth_without_mapping"
    );
  });

  it("keeps non-selected candidates blocked with their first missing requirement named", () => {
    const nonSelected = SOURCE_PACK_CANDIDATES.filter((candidate) => !candidate.selectedForNoRuntimeExtraction);

    expect(nonSelected.map((candidate) => [candidate.id, candidate.allowedNextAction])).toEqual([
      [
        "timber_double_board_stud_wall",
        "hold_runtime_until_direct_live_stack_row_or_bounded_formula_tolerance_owner"
      ],
      [
        "no_stud_double_leaf_wall",
        "hold_runtime_until_local_formula_inputs_and_single_number_tolerance_owner"
      ],
      [
        "generated_floor_fallback",
        "hold_runtime_until_topology_delta_matrix_proves_exact_or_bounded_floor_family"
      ],
      [
        "lined_massive_heavy_core_wall",
        "hold_screening_until_wall_specific_lined_heavy_source_or_bounded_lining_rule"
      ],
      ["historical_blocked_families", "keep_fail_closed_until_new_source_evidence_satisfies_old_blocker"]
    ]);
    expect(nonSelected.every((candidate) => candidate.blockers.length >= 3)).toBe(true);
    expect(nonSelected.every((candidate) => candidate.readiness.negativeBoundariesExecutable)).toBe(true);
  });

  it("defines the next slice target while preserving all source-gated boundaries", () => {
    expect(GATE_A_DECISION.runtimeImportSelectedNow).toBe(false);
    expect(GATE_A_DECISION.supportConfidenceEvidencePromotion).toBe(false);
    expect(GATE_A_DECISION.targetFirstGateFile).toBe(
      "packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-a-contract.test.ts"
    );
    expect(GATE_A_DECISION.selectedPlanningSurface).toBe(
      "docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md"
    );
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "no_candidate_can_set_runtimeImportReadyNow_true_in_gate_a",
      "clt_mass_timber_extraction_is_not_clt_wall_runtime_import_or_confidence_promotion",
      "stc_astc_iic_rows_do_not_become_iso_rw_or_field_r_prime_w_truth_without_explicit_mapping",
      "dataholz_floor_clt_rows_do_not_promote_wall_clt_truth",
      "timber_double_board_no_stud_double_leaf_floor_fallback_lined_heavy_and_historical_blocks_remain_runtime_blocked",
      "support_confidence_evidence_api_route_card_and_output_card_surfaces_remain_frozen"
    ]);
  });
});
