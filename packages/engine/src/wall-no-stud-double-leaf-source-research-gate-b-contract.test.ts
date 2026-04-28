import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const DAVY_2009_BUILDING_ACOUSTICS_URL = "https://journals.sagepub.com/doi/10.1260/135101009788066546";
const DAVY_2010_DOUBLE_LEAF_MODEL_URL =
  "https://www.researchgate.net/publication/41410830_The_improvement_of_a_simple_theoretical_model_for_the_prediction_of_the_sound_insulation_of_double_leaf_walls";
const NRC_GYPSUM_BOARD_DATA_URL =
  "https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f";
const SCIENCEDIRECT_GYPSUM_BLOCK_URL = "https://www.sciencedirect.com/science/article/abs/pii/S2352710221001091";

type FormulaToleranceFeasibility = {
  boundedLocalRwToleranceReady: boolean;
  currentRwPrime: number;
  currentRw: number;
  id: string;
  liveRouteStrategy: string;
  missingBeforeRuntimeMovement: readonly string[];
  publishedScopeFit: "relevant_cavity_wall_scope";
  sourceLocator: string;
  targetRoute: "empty_no_stud_double_leaf" | "porous_no_stud_double_leaf";
};

type DirectRowFeasibility = {
  directRowImportReady: boolean;
  id: string;
  missingBeforeRuntimeMovement: readonly string[];
  rowExtractionStatus: "not_extracted" | "extracted_adjacent_material_only";
  sourceLocator: string;
  topologyFit:
    | "archive_needs_no_stud_no_rail_no_coupling_row_proof"
    | "direct_family_adjacent_material_not_live_stack";
};

const WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B = {
  landedGate: "gate_b_formula_tolerance_and_direct_row_feasibility_audit",
  previousGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  selectedGateCAction:
    "gate_c_close_no_stud_double_leaf_source_research_no_runtime_and_select_next_accuracy_slice",
  sliceId: "wall_no_stud_double_leaf_source_research_v1",
  status: "no_runtime_no_bounded_formula_tolerance_or_direct_row_ready"
} as const;

const CURRENT_LIVE_NO_STUD_ROUTE_POSTURE = [
  {
    id: "empty_double_leaf_aac_gap_gypsum_current_route",
    currentSourcePosture: "formula_owned_no_stack_source",
    fieldRwPrime: 46,
    labRw: 48,
    layers: ["80 mm AAC D700", "50 mm air gap", "12.5 mm gypsum board"],
    routeStrategy: "double_leaf_empty_cavity_delegate"
  },
  {
    id: "porous_double_leaf_gypsum_wool_gap_gypsum_current_route",
    currentSourcePosture: "formula_owned_no_stack_source",
    fieldRwPrime: 41,
    labRw: 43,
    layers: ["12.5 mm gypsum board", "50 mm rockwool", "25 mm air gap", "12.5 mm gypsum board"],
    routeStrategy: "double_leaf_porous_fill_corrected"
  }
] as const;

const FORMULA_TOLERANCE_ACCEPTANCE_CRITERIA = [
  "published_scope_covers_no_stud_no_coupling_empty_and_absorber_filled_cavity_walls",
  "local_formula_inputs_are_derived_for_each_current_live_route",
  "frequency_band_model_fit_is_translated_to_single_number_rw_tolerance",
  "current_outputs_are_compared_against_that_tolerance",
  "field_metric_translation_for_r_w_prime_dnt_and_dn_outputs_is_explicitly_bounded",
  "negative_boundaries_for_stud_framed_floor_triple_leaf_and_lined_massive_contexts_are_executable",
  "paired_engine_value_tests_and_web_route_card_tests_are_ready_before_visible_movement"
] as const;

const DAVY_SHARP_FORMULA_FEASIBILITY: readonly FormulaToleranceFeasibility[] = [
  {
    id: "davy_sharp_empty_no_stud_route_feasibility",
    boundedLocalRwToleranceReady: false,
    currentRwPrime: 46,
    currentRw: 48,
    liveRouteStrategy: "double_leaf_empty_cavity_delegate",
    missingBeforeRuntimeMovement: [
      "derive_the_current_aac_gap_gypsum_formula_inputs_from_the_published_model",
      "translate_frequency_band_fit_statistics_to_a_local_single_number_rw_tolerance",
      "prove_current_empty_route_rw_and_r_w_prime_fit_or_fail_that_tolerance",
      "pin_field_metric_translation_before_any_dnt_or_dn_visible_movement"
    ],
    publishedScopeFit: "relevant_cavity_wall_scope",
    sourceLocator: `${DAVY_2009_BUILDING_ACOUSTICS_URL} and ${DAVY_2010_DOUBLE_LEAF_MODEL_URL}`,
    targetRoute: "empty_no_stud_double_leaf"
  },
  {
    id: "davy_sharp_porous_no_stud_route_feasibility",
    boundedLocalRwToleranceReady: false,
    currentRwPrime: 41,
    currentRw: 43,
    liveRouteStrategy: "double_leaf_porous_fill_corrected",
    missingBeforeRuntimeMovement: [
      "derive_the_current_gypsum_wool_gap_gypsum_formula_inputs_from_the_published_model",
      "translate_absorber_or_porosity_model_assumptions_to_the_live_rockwool_and_air_gap_stack",
      "translate_frequency_band_fit_statistics_to_a_local_single_number_rw_tolerance",
      "prove_current_porous_route_rw_and_r_w_prime_fit_or_fail_that_tolerance"
    ],
    publishedScopeFit: "relevant_cavity_wall_scope",
    sourceLocator: `${DAVY_2009_BUILDING_ACOUSTICS_URL} and ${DAVY_2010_DOUBLE_LEAF_MODEL_URL}`,
    targetRoute: "porous_no_stud_double_leaf"
  }
] as const;

const DIRECT_ROW_FEASIBILITY: readonly DirectRowFeasibility[] = [
  {
    id: "nrc_gypsum_board_archive_direct_row_feasibility",
    directRowImportReady: false,
    missingBeforeRuntimeMovement: [
      "extract_row_level_wall_specs_from_the_archive",
      "prove_no_stud_no_rail_no_mechanical_coupling_for_any_candidate_row",
      "map_leaf_material_surface_mass_cavity_depth_and_absorber_metadata_to_live_routes",
      "name_metric_context_tolerance_owner_and_negative_boundaries_for_import"
    ],
    rowExtractionStatus: "not_extracted",
    sourceLocator: NRC_GYPSUM_BOARD_DATA_URL,
    topologyFit: "archive_needs_no_stud_no_rail_no_coupling_row_proof"
  },
  {
    id: "gypsum_block_air_cavity_double_wall_feasibility",
    directRowImportReady: false,
    missingBeforeRuntimeMovement: [
      "extract_exact_air_chamber_row_values_and_frequency_bands",
      "resolve_gypsum_block_to_live_aac_or_gypsum_board_material_mapping",
      "pin_density_surface_mass_and_cavity_geometry_for_the_live_route"
    ],
    rowExtractionStatus: "extracted_adjacent_material_only",
    sourceLocator: SCIENCEDIRECT_GYPSUM_BLOCK_URL,
    topologyFit: "direct_family_adjacent_material_not_live_stack"
  },
  {
    id: "gypsum_block_absorbent_double_wall_feasibility",
    directRowImportReady: false,
    missingBeforeRuntimeMovement: [
      "extract_exact_absorbent_row_values_and_frequency_bands",
      "resolve_absorber_material_metadata_against_live_rockwool_stack",
      "resolve_gypsum_block_to_live_gypsum_board_material_mapping"
    ],
    rowExtractionStatus: "extracted_adjacent_material_only",
    sourceLocator: SCIENCEDIRECT_GYPSUM_BLOCK_URL,
    topologyFit: "direct_family_adjacent_material_not_live_stack"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "w111_w112_w115_w119_framed_rows_do_not_promote_no_stud_values",
  "scientific_reports_stud_type_rows_do_not_collapse_into_no_stud_routes",
  "nrc_rows_require_explicit_no_stud_no_rail_no_coupling_proof_before_import",
  "gypsum_block_double_wall_rows_do_not_map_to_live_aac_or_gypsum_board_stacks_without_material_mapping",
  "davy_sharp_model_scope_does_not_change_values_without_local_formula_inputs_and_tolerance_translation",
  "floor_clt_floor_impact_product_delta_report_and_triple_leaf_rows_remain_rejected",
  "runtime_values_support_confidence_evidence_text_and_route_card_copy_remain_frozen_during_gate_b"
] as const;

const GATE_B_DECISION = {
  boundedFormulaToleranceReadyNow: false,
  directRowImportReadyNow: false,
  selectedRuntimeImportSliceNow: false,
  closeoutReason:
    "davy_sharp_is_relevant_but_not_yet_a_local_single_number_tolerance_and_nrc_has_no_extracted_no_stud_row_mapping",
  nextRequiredGate: "gate_c_close_no_stud_double_leaf_source_research_no_runtime_and_select_next_accuracy_slice",
  runtimePosture:
    "keep_current_empty_and_porous_no_stud_double_leaf_values_formula_owned_until_a_direct_row_or_bounded_formula_tolerance_is_complete"
} as const;

function formulaToleranceReady(candidate: FormulaToleranceFeasibility): boolean {
  return candidate.boundedLocalRwToleranceReady && candidate.missingBeforeRuntimeMovement.length === 0;
}

function directRowReady(candidate: DirectRowFeasibility): boolean {
  return candidate.directRowImportReady && candidate.missingBeforeRuntimeMovement.length === 0;
}

describe("wall no-stud double-leaf source research Gate B contract", () => {
  it("lands Gate B as a no-runtime feasibility audit", () => {
    expect(WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B).toEqual({
      landedGate: "gate_b_formula_tolerance_and_direct_row_feasibility_audit",
      previousGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      selectedGateCAction:
        "gate_c_close_no_stud_double_leaf_source_research_no_runtime_and_select_next_accuracy_slice",
      sliceId: "wall_no_stud_double_leaf_source_research_v1",
      status: "no_runtime_no_bounded_formula_tolerance_or_direct_row_ready"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_B_HANDOFF.md",
      "packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the formula tolerance acceptance criteria stricter than source relevance", () => {
    expect(FORMULA_TOLERANCE_ACCEPTANCE_CRITERIA).toEqual([
      "published_scope_covers_no_stud_no_coupling_empty_and_absorber_filled_cavity_walls",
      "local_formula_inputs_are_derived_for_each_current_live_route",
      "frequency_band_model_fit_is_translated_to_single_number_rw_tolerance",
      "current_outputs_are_compared_against_that_tolerance",
      "field_metric_translation_for_r_w_prime_dnt_and_dn_outputs_is_explicitly_bounded",
      "negative_boundaries_for_stud_framed_floor_triple_leaf_and_lined_massive_contexts_are_executable",
      "paired_engine_value_tests_and_web_route_card_tests_are_ready_before_visible_movement"
    ]);
    expect(new Set(FORMULA_TOLERANCE_ACCEPTANCE_CRITERIA).size).toBe(
      FORMULA_TOLERANCE_ACCEPTANCE_CRITERIA.length
    );
  });

  it("rejects Davy/Sharp as a runtime tolerance owner until local route tolerances are derived", () => {
    expect(DAVY_SHARP_FORMULA_FEASIBILITY.map((candidate) => candidate.targetRoute)).toEqual([
      "empty_no_stud_double_leaf",
      "porous_no_stud_double_leaf"
    ]);

    expect(DAVY_SHARP_FORMULA_FEASIBILITY.every((candidate) => candidate.publishedScopeFit === "relevant_cavity_wall_scope")).toBe(
      true
    );
    expect(DAVY_SHARP_FORMULA_FEASIBILITY.filter(formulaToleranceReady)).toEqual([]);

    for (const candidate of DAVY_SHARP_FORMULA_FEASIBILITY) {
      expect(candidate.boundedLocalRwToleranceReady).toBe(false);
      expect(candidate.missingBeforeRuntimeMovement).toContain(
        "translate_frequency_band_fit_statistics_to_a_local_single_number_rw_tolerance"
      );
      expect(candidate.currentRw).toBeGreaterThan(candidate.currentRwPrime);
    }
  });

  it("rejects NRC and gypsum-block candidates as direct imports until row and topology proof exists", () => {
    expect(DIRECT_ROW_FEASIBILITY.filter(directRowReady)).toEqual([]);
    expect(DIRECT_ROW_FEASIBILITY.map((candidate) => [candidate.id, candidate.topologyFit])).toEqual([
      [
        "nrc_gypsum_board_archive_direct_row_feasibility",
        "archive_needs_no_stud_no_rail_no_coupling_row_proof"
      ],
      ["gypsum_block_air_cavity_double_wall_feasibility", "direct_family_adjacent_material_not_live_stack"],
      ["gypsum_block_absorbent_double_wall_feasibility", "direct_family_adjacent_material_not_live_stack"]
    ]);

    const nrcArchive = DIRECT_ROW_FEASIBILITY[0];
    expect(nrcArchive.rowExtractionStatus).toBe("not_extracted");
    expect(nrcArchive.missingBeforeRuntimeMovement).toContain(
      "prove_no_stud_no_rail_no_mechanical_coupling_for_any_candidate_row"
    );
  });

  it("keeps current no-stud route values and negative boundaries frozen during Gate B", () => {
    expect(CURRENT_LIVE_NO_STUD_ROUTE_POSTURE).toEqual([
      {
        id: "empty_double_leaf_aac_gap_gypsum_current_route",
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrime: 46,
        labRw: 48,
        layers: ["80 mm AAC D700", "50 mm air gap", "12.5 mm gypsum board"],
        routeStrategy: "double_leaf_empty_cavity_delegate"
      },
      {
        id: "porous_double_leaf_gypsum_wool_gap_gypsum_current_route",
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrime: 41,
        labRw: 43,
        layers: ["12.5 mm gypsum board", "50 mm rockwool", "25 mm air gap", "12.5 mm gypsum board"],
        routeStrategy: "double_leaf_porous_fill_corrected"
      }
    ]);

    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "w111_w112_w115_w119_framed_rows_do_not_promote_no_stud_values",
      "scientific_reports_stud_type_rows_do_not_collapse_into_no_stud_routes",
      "nrc_rows_require_explicit_no_stud_no_rail_no_coupling_proof_before_import",
      "gypsum_block_double_wall_rows_do_not_map_to_live_aac_or_gypsum_board_stacks_without_material_mapping",
      "davy_sharp_model_scope_does_not_change_values_without_local_formula_inputs_and_tolerance_translation",
      "floor_clt_floor_impact_product_delta_report_and_triple_leaf_rows_remain_rejected",
      "runtime_values_support_confidence_evidence_text_and_route_card_copy_remain_frozen_during_gate_b"
    ]);
  });

  it("selects Gate C closeout instead of a runtime import, retune, or route-card move", () => {
    expect(GATE_B_DECISION).toEqual({
      boundedFormulaToleranceReadyNow: false,
      directRowImportReadyNow: false,
      selectedRuntimeImportSliceNow: false,
      closeoutReason:
        "davy_sharp_is_relevant_but_not_yet_a_local_single_number_tolerance_and_nrc_has_no_extracted_no_stud_row_mapping",
      nextRequiredGate: "gate_c_close_no_stud_double_leaf_source_research_no_runtime_and_select_next_accuracy_slice",
      runtimePosture:
        "keep_current_empty_and_porous_no_stud_double_leaf_values_formula_owned_until_a_direct_row_or_bounded_formula_tolerance_is_complete"
    });
  });
});
