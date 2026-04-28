import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const SCIENCEDIRECT_GYPSUM_BLOCK_URL = "https://www.sciencedirect.com/science/article/abs/pii/S2352710221001091";
const NRC_GYPSUM_BOARD_DATA_URL =
  "https://nrc-publications.canada.ca/eng/view/object/?id=04ac8069-a5d2-4038-8787-da064b073e7f";
const DAVY_2009_BUILDING_ACOUSTICS_URL = "https://journals.sagepub.com/doi/10.1260/135101009788066546";
const DAVY_2010_DOUBLE_LEAF_MODEL_URL =
  "https://www.researchgate.net/publication/41410830_The_improvement_of_a_simple_theoretical_model_for_the_prediction_of_the_sound_insulation_of_double_leaf_walls";
const SCIENTIFIC_REPORTS_STUD_TYPE_URL = "https://www.nature.com/articles/s41598-024-82403-w";

type CandidateStatus =
  | "direct_family_adjacent_material"
  | "formula_tolerance_candidate"
  | "data_reservoir_needs_row_extraction"
  | "adjacent_context_only"
  | "negative_boundary";

type GateANoStudCandidate = {
  candidateStatus: CandidateStatus;
  id: string;
  missingBeforeRuntimeMovement: readonly string[];
  reportedEvidence: string;
  requiredEvidenceComplete: boolean;
  runtimeMovementAllowedNow: boolean;
  selectedForGateB: boolean;
  sourceLabel: string;
  sourceLocator: string;
  targetFamily: "empty_no_stud_double_leaf" | "porous_no_stud_double_leaf" | "both_no_stud_double_leaf";
  topologyFit:
    | "direct_no_stud_family_but_not_live_material"
    | "formula_scope_candidate"
    | "row_archive_not_extracted"
    | "framed_or_stud_context_only";
};

const WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A = {
  landedGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
  previousClosedSlice: "wall_source_catalog_acquisition_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  routeCardWorkRequiredNow: false,
  selectedGateBAction:
    "gate_b_formula_tolerance_and_direct_row_feasibility_audit_no_runtime",
  sliceId: "wall_no_stud_double_leaf_source_research_v1",
  status: "no_runtime_source_and_formula_tolerance_inventory_landed"
} as const;

const CURRENT_LIVE_NO_STUD_ROUTE_POSTURE = [
  {
    id: "empty_double_leaf_aac_gap_gypsum_current_route",
    currentSourcePosture: "formula_owned_no_stack_source",
    fieldRwPrime: 46,
    labRw: 48,
    layers: ["80 mm AAC D700", "50 mm air gap", "12.5 mm gypsum board"],
    requiredUnlock: "direct_same_stack_row_or_named_no_stud_formula_tolerance_owner",
    routeStrategy: "double_leaf_empty_cavity_delegate"
  },
  {
    id: "porous_double_leaf_gypsum_wool_gap_gypsum_current_route",
    currentSourcePosture: "formula_owned_no_stack_source",
    fieldRwPrime: 41,
    labRw: 43,
    layers: ["12.5 mm gypsum board", "50 mm rockwool", "25 mm air gap", "12.5 mm gypsum board"],
    requiredUnlock: "direct_same_stack_row_or_named_no_stud_formula_tolerance_owner",
    routeStrategy: "double_leaf_porous_fill_corrected"
  }
] as const;

const SOURCE_RESEARCH_CANDIDATES: readonly GateANoStudCandidate[] = [
  {
    candidateStatus: "direct_family_adjacent_material",
    id: "gypsum_block_air_cavity_double_wall_direct_family",
    missingBeforeRuntimeMovement: [
      "official_full_row_table_values_and_frequency_bands_not_extracted_into_repo",
      "local_material_mapping_is_gypsum_block_not_current_aac_or_gypsum_board_leaf",
      "density_surface_mass_and_air_chamber_variants_need_row_level_mapping",
      "paired_engine_value_and_route_card_tests_not_ready"
    ],
    reportedEvidence:
      "standardized_lab_tests_include_double_gypsum_block_walls_with_air_chambers_and_weighted_sound_reduction_index",
    requiredEvidenceComplete: false,
    runtimeMovementAllowedNow: false,
    selectedForGateB: false,
    sourceLabel: "Journal of Building Engineering 2021 gypsum block single/double wall laboratory study",
    sourceLocator: SCIENCEDIRECT_GYPSUM_BLOCK_URL,
    targetFamily: "empty_no_stud_double_leaf",
    topologyFit: "direct_no_stud_family_but_not_live_material"
  },
  {
    candidateStatus: "direct_family_adjacent_material",
    id: "gypsum_block_absorbent_double_wall_direct_family",
    missingBeforeRuntimeMovement: [
      "glass_wool_vs_pet_wool_row_values_need_full_table_extraction",
      "local_material_mapping_is_gypsum_block_not_current_gypsum_board_leaf",
      "absorber_thickness_and_cavity_geometry_need_row_level_mapping",
      "paired_engine_value_and_route_card_tests_not_ready"
    ],
    reportedEvidence:
      "standardized_lab_tests_include_double_gypsum_block_walls_with_acoustic_absorbent_material_and_rw_calculation",
    requiredEvidenceComplete: false,
    runtimeMovementAllowedNow: false,
    selectedForGateB: false,
    sourceLabel: "Journal of Building Engineering 2021 gypsum block double wall absorbent variants",
    sourceLocator: SCIENCEDIRECT_GYPSUM_BLOCK_URL,
    targetFamily: "porous_no_stud_double_leaf",
    topologyFit: "direct_no_stud_family_but_not_live_material"
  },
  {
    candidateStatus: "formula_tolerance_candidate",
    id: "davy_sharp_no_stud_formula_tolerance_candidate",
    missingBeforeRuntimeMovement: [
      "derive_or_reference_the_exact_local_formula_inputs_for_empty_and_porous_live_routes",
      "translate_frequency_band_model_fit_statistics_into_a_single_number_rw_tolerance_rule",
      "prove_current_empty_and_porous_outputs_fit_or_fail_the_candidate_tolerance",
      "pin_negative_boundaries_for_stud_framed_triple_leaf_lined_massive_and_floor_contexts",
      "paired_engine_value_and_route_card_tests_not_ready"
    ],
    reportedEvidence:
      "Davy extends Sharp cavity-wall modelling to cavities with and without absorption and compares the double-leaf model against experimental data",
    requiredEvidenceComplete: false,
    runtimeMovementAllowedNow: false,
    selectedForGateB: true,
    sourceLabel: "Davy 2009 Building Acoustics plus Davy 2010 JASA double-leaf model",
    sourceLocator: `${DAVY_2009_BUILDING_ACOUSTICS_URL} and ${DAVY_2010_DOUBLE_LEAF_MODEL_URL}`,
    targetFamily: "both_no_stud_double_leaf",
    topologyFit: "formula_scope_candidate"
  },
  {
    candidateStatus: "data_reservoir_needs_row_extraction",
    id: "nrc_gypsum_board_wall_transmission_loss_archive",
    missingBeforeRuntimeMovement: [
      "extract_row_level_wall_specs_from_the_368_page_report",
      "prove_any_candidate_row_has_no_stud_no_rail_no_coupling_metadata",
      "map_extracted_rows_to_current_live_material_ids_and_cavity_geometry",
      "paired_engine_value_and_route_card_tests_not_ready"
    ],
    reportedEvidence:
      "NRC archive provides detailed one_third_octave_transmission_loss_data_and_construction_details_for_350_gypsum_board_wall_specimens",
    requiredEvidenceComplete: false,
    runtimeMovementAllowedNow: false,
    selectedForGateB: true,
    sourceLabel: "NRC Canada IRC-IR-761 gypsum board wall transmission loss data",
    sourceLocator: NRC_GYPSUM_BOARD_DATA_URL,
    targetFamily: "both_no_stud_double_leaf",
    topologyFit: "row_archive_not_extracted"
  },
  {
    candidateStatus: "adjacent_context_only",
    id: "scientific_reports_stud_type_double_leaf_context",
    missingBeforeRuntimeMovement: [
      "study_scope_is_stud_configurations_not_no_stud_free_cavity_rows",
      "structural_bridge_path_must_remain_a_protected_boundary",
      "not_a_direct_source_for_current_no_stud_routes"
    ],
    reportedEvidence:
      "study models wood_steel_and_acoustical_stud_double_leaf_walls_and_identifies_stud_bridge_effects",
    requiredEvidenceComplete: false,
    runtimeMovementAllowedNow: false,
    selectedForGateB: false,
    sourceLabel: "Scientific Reports 2024 lightweight double-leaf wall stud-type study",
    sourceLocator: SCIENTIFIC_REPORTS_STUD_TYPE_URL,
    targetFamily: "both_no_stud_double_leaf",
    topologyFit: "framed_or_stud_context_only"
  }
] as const;

const GATE_A_DECISION = {
  directImportReadyNow: false,
  selectedDirectRowImportSliceNow: false,
  selectedFormulaToleranceAudit: true,
  selectedRowExtractionAudit: true,
  closeoutReason:
    "direct_family_rows_are_adjacent_material_or_unextracted_and_davy_sharp_formula_scope_needs_gate_b_fit_audit_before_any_runtime_movement",
  nextRequiredGate: "gate_b_formula_tolerance_and_direct_row_feasibility_audit_no_runtime",
  runtimePosture:
    "keep_current_empty_and_porous_no_stud_double_leaf_values_formula_owned_until_gate_b_names_a_bounded_tolerance_or_direct_row"
} as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "w111_w112_w115_w119_framed_rows_do_not_promote_no_stud_values",
  "scientific_reports_stud_type_rows_do_not_collapse_into_no_stud_routes",
  "nrc_rows_require_explicit_no_stud_no_rail_no_coupling_proof_before_import",
  "gypsum_block_double_wall_rows_do_not_map_to_aac_or_gypsum_board_live_stacks_without_material_mapping",
  "floor_clt_floor_impact_product_delta_report_and_triple_leaf_rows_remain_rejected",
  "runtime_values_support_confidence_evidence_text_and_route_card_copy_remain_frozen_during_gate_a"
] as const;

describe("wall no-stud double-leaf source research Gate A contract", () => {
  it("lands Gate A as a no-runtime source and formula-tolerance inventory", () => {
    expect(WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A).toEqual({
      landedGate: "gate_a_direct_no_stud_double_leaf_source_research_and_tolerance_inventory",
      previousClosedSlice: "wall_source_catalog_acquisition_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      routeCardWorkRequiredNow: false,
      selectedGateBAction:
        "gate_b_formula_tolerance_and_direct_row_feasibility_audit_no_runtime",
      sliceId: "wall_no_stud_double_leaf_source_research_v1",
      status: "no_runtime_source_and_formula_tolerance_inventory_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the two current live no-stud routes formula-owned until a direct row or tolerance owner is complete", () => {
    expect(CURRENT_LIVE_NO_STUD_ROUTE_POSTURE).toEqual([
      {
        id: "empty_double_leaf_aac_gap_gypsum_current_route",
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrime: 46,
        labRw: 48,
        layers: ["80 mm AAC D700", "50 mm air gap", "12.5 mm gypsum board"],
        requiredUnlock: "direct_same_stack_row_or_named_no_stud_formula_tolerance_owner",
        routeStrategy: "double_leaf_empty_cavity_delegate"
      },
      {
        id: "porous_double_leaf_gypsum_wool_gap_gypsum_current_route",
        currentSourcePosture: "formula_owned_no_stack_source",
        fieldRwPrime: 41,
        labRw: 43,
        layers: ["12.5 mm gypsum board", "50 mm rockwool", "25 mm air gap", "12.5 mm gypsum board"],
        requiredUnlock: "direct_same_stack_row_or_named_no_stud_formula_tolerance_owner",
        routeStrategy: "double_leaf_porous_fill_corrected"
      }
    ]);

    expect(CURRENT_LIVE_NO_STUD_ROUTE_POSTURE.every((route) => route.currentSourcePosture.includes("formula_owned"))).toBe(
      true
    );
  });

  it("classifies direct no-stud family rows as useful but not import-ready for the live routes", () => {
    const directFamilyCandidates = SOURCE_RESEARCH_CANDIDATES.filter(
      (candidate) => candidate.candidateStatus === "direct_family_adjacent_material"
    );

    expect(directFamilyCandidates.map((candidate) => candidate.id)).toEqual([
      "gypsum_block_air_cavity_double_wall_direct_family",
      "gypsum_block_absorbent_double_wall_direct_family"
    ]);

    for (const candidate of directFamilyCandidates) {
      expect(candidate.topologyFit).toBe("direct_no_stud_family_but_not_live_material");
      expect(candidate.runtimeMovementAllowedNow).toBe(false);
      expect(candidate.requiredEvidenceComplete).toBe(false);
      expect(candidate.missingBeforeRuntimeMovement).toContain("paired_engine_value_and_route_card_tests_not_ready");
    }
  });

  it("selects Davy/Sharp formula tolerance and NRC row extraction for Gate B without moving runtime", () => {
    const selectedCandidates = SOURCE_RESEARCH_CANDIDATES.filter((candidate) => candidate.selectedForGateB);

    expect(selectedCandidates.map((candidate) => candidate.id)).toEqual([
      "davy_sharp_no_stud_formula_tolerance_candidate",
      "nrc_gypsum_board_wall_transmission_loss_archive"
    ]);

    expect(selectedCandidates.every((candidate) => candidate.runtimeMovementAllowedNow === false)).toBe(true);
    expect(selectedCandidates.every((candidate) => candidate.requiredEvidenceComplete === false)).toBe(true);
    expect(GATE_A_DECISION).toEqual({
      directImportReadyNow: false,
      selectedDirectRowImportSliceNow: false,
      selectedFormulaToleranceAudit: true,
      selectedRowExtractionAudit: true,
      closeoutReason:
        "direct_family_rows_are_adjacent_material_or_unextracted_and_davy_sharp_formula_scope_needs_gate_b_fit_audit_before_any_runtime_movement",
      nextRequiredGate: "gate_b_formula_tolerance_and_direct_row_feasibility_audit_no_runtime",
      runtimePosture:
        "keep_current_empty_and_porous_no_stud_double_leaf_values_formula_owned_until_gate_b_names_a_bounded_tolerance_or_direct_row"
    });
  });

  it("rejects adjacent framed/stud context as a no-stud import unlock", () => {
    const adjacentStudy = SOURCE_RESEARCH_CANDIDATES.find(
      (candidate) => candidate.id === "scientific_reports_stud_type_double_leaf_context"
    );

    expect(adjacentStudy).toMatchObject({
      candidateStatus: "adjacent_context_only",
      runtimeMovementAllowedNow: false,
      selectedForGateB: false,
      topologyFit: "framed_or_stud_context_only"
    });
    expect(adjacentStudy?.missingBeforeRuntimeMovement).toContain(
      "study_scope_is_stud_configurations_not_no_stud_free_cavity_rows"
    );
  });

  it("keeps negative boundaries and visible behavior fail-closed during Gate A", () => {
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toEqual([
      "w111_w112_w115_w119_framed_rows_do_not_promote_no_stud_values",
      "scientific_reports_stud_type_rows_do_not_collapse_into_no_stud_routes",
      "nrc_rows_require_explicit_no_stud_no_rail_no_coupling_proof_before_import",
      "gypsum_block_double_wall_rows_do_not_map_to_aac_or_gypsum_board_live_stacks_without_material_mapping",
      "floor_clt_floor_impact_product_delta_report_and_triple_leaf_rows_remain_rejected",
      "runtime_values_support_confidence_evidence_text_and_route_card_copy_remain_frozen_during_gate_a"
    ]);

    expect(WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A.runtimeBehaviorChange).toBe(false);
    expect(WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A.routeCardWorkRequiredNow).toBe(false);
  });
});
