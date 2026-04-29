import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

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

type GateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "adjacent_to_existing_steel_stud_exact_catalog_not_the_same_row"
    | "direct_timber_double_board_candidate_not_live_stack"
    | "one_side_lined_negative_boundary"
    | "staggered_timber_adjacent_context_only"
    | "twin_timber_asymmetric_double_leaf_not_live_route"
    | "lined_masonry_candidate_not_live_lined_massive_stack"
    | "aac_discontinuous_panel_adjacent_context_only";
  exactColumnSelected: boolean;
  firstMissingRequirement: string;
  gateBDecision:
    | "block_immediate_runtime_import"
    | "keep_negative_boundary"
    | "keep_adjacent_context_only";
  localMaterialMapping:
    | "medium_but_requires_wallboard_acoustic_roll_and_stud_gauge_policy"
    | "medium_but_requires_sheetrock_one_and_ki75g11_policy"
    | "low_one_side_lined_not_a_two_sided_wall_stack"
    | "low_fiberock_and_staggered_stud_not_live_vocab"
    | "low_fiberock_twin_frame_gap_and_side_asymmetry_not_live_vocab"
    | "low_substrate_mass_furring_coupling_and_sheetrock_mapping_missing"
    | "low_aac_density_gap_and_discontinuous_frame_mapping_missing";
  metricOwner:
    | "lab_rw_only"
    | "lab_rw_plus_rw_ctr_without_field_owner"
    | "context_only_metric";
  nextAllowedTrack:
    | "roadmap_steel_stud_lab_row_reconciliation"
    | "roadmap_timber_double_board_exact_column_and_tolerance_research"
    | "none_one_side_lined_remains_negative_boundary"
    | "roadmap_staggered_timber_topology_research"
    | "roadmap_twin_timber_double_leaf_topology_research"
    | "roadmap_lined_masonry_substrate_and_coupling_research"
    | "roadmap_aac_panel_gap_topology_research";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  runtimeImportReadyNow: false;
  systemCode: string;
  toleranceOwnerNamed: boolean;
};

type MetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "source_lab_rw" | "source_lab_rw_plus_ctr" | "field_or_building_outputs";
  metricOwnerNamed: boolean;
  runtimeOutputReadyNow: false;
};

const KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  previousGate: "gate_a_extract_knauf_wall_systems_table_locators_no_runtime",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "knauf_wall_systems_source_pack_extraction_v1",
  status: "no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
  "docs/calculator/SOURCE_GAP_LEDGER.md",
  "docs/calculator/SLICE_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-04-29_KNAUF_WALL_SYSTEMS_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly GateBRowDecision[] = [
  {
    systemCode: "EN-PC-50-055-6-2-12.5-WB-25",
    gateBDecision: "block_immediate_runtime_import",
    currentImplementationFit: "adjacent_to_existing_steel_stud_exact_catalog_not_the_same_row",
    exactColumnSelected: true,
    metricOwner: "lab_rw_only",
    toleranceOwnerNamed: false,
    localMaterialMapping: "medium_but_requires_wallboard_acoustic_roll_and_stud_gauge_policy",
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "steel_stud_row_has_lab_rw_but_still_needs_wallboard_acoustic_roll_stud_gauge_equivalence_and_a_row_specific_tolerance_owner_before_import",
    nextAllowedTrack: "roadmap_steel_stud_lab_row_reconciliation",
    protectedBoundary:
      "uk_steel_stud_rows_do_not_promote_timber_double_board_or_masonry_lining_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_knauf_uk_steel_stud_exact_lab_rw_value_pin",
      "engine_knauf_uk_steel_stud_rejects_timber_masonry_and_field_proxy_outputs"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_knauf_uk_steel_stud_route_card_lab_rw_context",
      "web_knauf_uk_steel_stud_report_evidence_context_without_confidence_promotion"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "TO120.1A",
    gateBDecision: "keep_negative_boundary",
    currentImplementationFit: "one_side_lined_negative_boundary",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "low_one_side_lined_not_a_two_sided_wall_stack",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "one_side_lined_timber_row_does_not_represent_current_two_sided_wall_outputs_or_the_direct_timber_double_board_route",
    nextAllowedTrack: "none_one_side_lined_remains_negative_boundary",
    protectedBoundary:
      "one_side_lined_timber_rows_must_not_be_used_as_two_sided_wall_truth",
    requiredEngineTestsBeforeRuntime: [
      "engine_reject_one_side_lined_timber_as_two_sided_wall_source",
      "engine_keep_timber_double_board_formula_owned_when_only_to120_context_exists"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_one_side_lined_timber_context_only_copy",
      "web_timber_route_card_rejects_to120_confidence_promotion"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "TB.5A",
    gateBDecision: "block_immediate_runtime_import",
    currentImplementationFit: "direct_timber_double_board_candidate_not_live_stack",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "medium_but_requires_sheetrock_one_and_ki75g11_policy",
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "tb5a_needs_exact_stud_depth_column_selection_sheetrock_one_to_local_board_mapping_ki75g11_mapping_and_timber_double_board_tolerance_owner",
    nextAllowedTrack: "roadmap_timber_double_board_exact_column_and_tolerance_research",
    protectedBoundary:
      "timber_double_board_candidate_must_not_import_before_exact_column_and_tolerance_mapping",
    requiredEngineTestsBeforeRuntime: [
      "engine_tb5a_exact_column_lab_rw_value_pin_or_explicit_rejection",
      "engine_tb5a_rejects_live_gypsum_rockwool_air_gap_stack_without_mapping"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_tb5a_route_card_metric_context",
      "web_tb5a_report_keeps_field_outputs_source_gated"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "TSF120.1A",
    gateBDecision: "keep_adjacent_context_only",
    currentImplementationFit: "staggered_timber_adjacent_context_only",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "low_fiberock_and_staggered_stud_not_live_vocab",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "staggered_stud_topology_fiberock_board_mapping_and_column_selection_are_not_current_live_timber_stud_route_inputs",
    nextAllowedTrack: "roadmap_staggered_timber_topology_research",
    protectedBoundary:
      "staggered_stud_rows_do_not_widen_current_simple_timber_stud_routes_without_new_topology",
    requiredEngineTestsBeforeRuntime: [
      "engine_staggered_timber_family_boundary_contract",
      "engine_staggered_timber_rejects_simple_direct_stud_route_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_staggered_timber_source_context_only_card",
      "web_staggered_timber_report_rejects_simple_route_promotion"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "TTF30.2A",
    gateBDecision: "block_immediate_runtime_import",
    currentImplementationFit: "twin_timber_asymmetric_double_leaf_not_live_route",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "low_fiberock_twin_frame_gap_and_side_asymmetry_not_live_vocab",
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "ttf302a_needs_twin_frame_gap_side_asymmetry_fiberock_mapping_and_double_leaf_tolerance_owner_before_any_no_stud_or_timber_route_movement",
    nextAllowedTrack: "roadmap_twin_timber_double_leaf_topology_research",
    protectedBoundary:
      "twin_timber_stud_rows_do_not_reopen_no_stud_double_leaf_or_raw_open_box_without_topology_mapping",
    requiredEngineTestsBeforeRuntime: [
      "engine_ttf302a_twin_timber_value_or_rejection_contract",
      "engine_ttf302a_keeps_no_stud_and_raw_open_box_routes_closed"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_twin_timber_route_card_context_only",
      "web_twin_timber_report_rejects_no_stud_promotion"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "MWI.2A",
    gateBDecision: "block_immediate_runtime_import",
    currentImplementationFit: "lined_masonry_candidate_not_live_lined_massive_stack",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "low_substrate_mass_furring_coupling_and_sheetrock_mapping_missing",
    blockedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "mwi2a_needs_concrete_panel_or_core_filled_block_mass_furring_cavity_coupling_sheetrock_mapping_and_lined_masonry_tolerance_owner",
    nextAllowedTrack: "roadmap_lined_masonry_substrate_and_coupling_research",
    protectedBoundary:
      "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
    requiredEngineTestsBeforeRuntime: [
      "engine_mwi2a_lined_masonry_substrate_mapping_or_rejection",
      "engine_mwi2a_keeps_wall_screening_concrete_without_source_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_mwi2a_route_card_source_context",
      "web_mwi2a_report_keeps_lined_heavy_wall_screening_honesty"
    ],
    runtimeImportReadyNow: false
  },
  {
    systemCode: "AAC.1A",
    gateBDecision: "keep_adjacent_context_only",
    currentImplementationFit: "aac_discontinuous_panel_adjacent_context_only",
    exactColumnSelected: false,
    metricOwner: "lab_rw_plus_rw_ctr_without_field_owner",
    toleranceOwnerNamed: false,
    localMaterialMapping: "low_aac_density_gap_and_discontinuous_frame_mapping_missing",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "C", "Ctr"],
    firstMissingRequirement:
      "aac1a_density_gap_discontinuous_steel_frame_and_panel_mapping_do_not_match_current_generic_aac_or_lined_masonry_routes",
    nextAllowedTrack: "roadmap_aac_panel_gap_topology_research",
    protectedBoundary:
      "aac_upgrade_rows_do_not_promote_generic_aac_or_lined_heavy_routes_without_exact_panel_gap_mapping",
    requiredEngineTestsBeforeRuntime: [
      "engine_aac_panel_gap_negative_boundary",
      "engine_aac1a_rejects_generic_aac_and_lined_heavy_route_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_aac_upgrade_context_only_visibility",
      "web_aac_upgrade_report_rejects_generic_aac_promotion"
    ],
    runtimeImportReadyNow: false
  }
] as const;

const METRIC_DECISIONS: readonly MetricDecision[] = [
  {
    metricContext: "source_lab_rw",
    metricOwnerNamed: true,
    runtimeOutputReadyNow: false,
    blockedTargets: ["runtime_import_until_topology_and_tolerance_owner_exist"],
    firstMissingRequirement:
      "lab_rw_is_named_but_cannot_move_runtime_until_row_topology_material_mapping_and_tolerance_are_complete"
  },
  {
    metricContext: "source_lab_rw_plus_ctr",
    metricOwnerNamed: true,
    runtimeOutputReadyNow: false,
    blockedTargets: ["C", "Ctr", "STC", "field_proxy_outputs"],
    firstMissingRequirement:
      "rw_plus_ctr_is_a_reported_sum_not_a_standalone_dyn_echo_ctr_or_field_metric_policy"
  },
  {
    metricContext: "field_or_building_outputs",
    metricOwnerNamed: false,
    runtimeOutputReadyNow: false,
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "knauf_gate_a_rows_are_lab_or_system_table_context_and_do_not_supply_dyn_echo_field_normalisation_room_context_or_flanking_owner"
  }
] as const;

const PROTECTED_BOUNDARIES = [
  "source_locators_are_not_runtime_import_approval",
  "uk_steel_stud_rows_do_not_promote_timber_double_board_routes",
  "one_side_lined_timber_rows_do_not_become_two_sided_wall_truth",
  "staggered_and_twin_timber_topologies_do_not_reopen_no_stud_or_raw_open_box_routes",
  "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
  "aac_panel_upgrade_rows_do_not_promote_generic_aac_routes_without_exact_panel_gap_mapping",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Knauf wall systems source-pack extraction Gate B contract", () => {
  it("lands Gate B as a no-runtime mapping and tolerance decision", () => {
    expect(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      previousGate: "gate_a_extract_knauf_wall_systems_table_locators_no_runtime",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "knauf_wall_systems_source_pack_extraction_v1",
      status: "no_knauf_locator_row_has_complete_topology_metric_tolerance_and_visible_test_ownership",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-knauf-wall-systems-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted row out of immediate runtime import with a first missing requirement", () => {
    expect(GATE_B_ROW_DECISIONS.map((decision) => decision.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TO120.1A",
      "TB.5A",
      "TSF120.1A",
      "TTF30.2A",
      "MWI.2A",
      "AAC.1A"
    ]);
    expect(GATE_B_ROW_DECISIONS.every((decision) => decision.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((decision) => decision.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((decision) => decision.firstMissingRequirement.length > 80)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.filter((decision) => decision.gateBDecision === "block_immediate_runtime_import").map((decision) => decision.systemCode)).toEqual([
      "EN-PC-50-055-6-2-12.5-WB-25",
      "TB.5A",
      "TTF30.2A",
      "MWI.2A"
    ]);
    expect(GATE_B_ROW_DECISIONS.filter((decision) => decision.gateBDecision === "keep_adjacent_context_only").map((decision) => decision.systemCode)).toEqual([
      "TSF120.1A",
      "AAC.1A"
    ]);
    expect(GATE_B_ROW_DECISIONS.filter((decision) => decision.gateBDecision === "keep_negative_boundary").map((decision) => decision.systemCode)).toEqual([
      "TO120.1A"
    ]);
  });

  it("blocks metric over-read from lab Rw/Rw+Ctr into field outputs or derived C/Ctr policy", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        metricContext: "source_lab_rw",
        metricOwnerNamed: true,
        runtimeOutputReadyNow: false,
        blockedTargets: ["runtime_import_until_topology_and_tolerance_owner_exist"],
        firstMissingRequirement:
          "lab_rw_is_named_but_cannot_move_runtime_until_row_topology_material_mapping_and_tolerance_are_complete"
      },
      {
        metricContext: "source_lab_rw_plus_ctr",
        metricOwnerNamed: true,
        runtimeOutputReadyNow: false,
        blockedTargets: ["C", "Ctr", "STC", "field_proxy_outputs"],
        firstMissingRequirement:
          "rw_plus_ctr_is_a_reported_sum_not_a_standalone_dyn_echo_ctr_or_field_metric_policy"
      },
      {
        metricContext: "field_or_building_outputs",
        metricOwnerNamed: false,
        runtimeOutputReadyNow: false,
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "knauf_gate_a_rows_are_lab_or_system_table_context_and_do_not_supply_dyn_echo_field_normalisation_room_context_or_flanking_owner"
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
  });

  it("pins live implementation comparison so Gate B does not silently replace current anchors", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const timber = generatedCase("wall-timber-stud");
    const linedMassive = generatedCase("wall-screening-concrete");
    const lsfLab = calculateAssembly(lsf.rows, lsf.labOptions);
    const lsfField = calculateAssembly(lsf.rows, lsf.fieldOptions);
    const timberLab = calculateAssembly(timber.rows, timber.labOptions);
    const timberField = calculateAssembly(timber.rows, timber.fieldOptions);
    const linedLab = calculateAssembly(linedMassive.rows, linedMassive.labOptions);
    const linedField = calculateAssembly(linedMassive.rows, linedMassive.fieldOptions);

    expect(findVerifiedAirborneAssemblyMatch(lsfLab.layers, lsf.labOptions?.airborneContext)?.id).toBe(
      "knauf_lab_416889_primary_2026"
    );
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(lsfField.layers, lsf.fieldOptions?.airborneContext))
      .toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(timberLab.layers, timber.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(timberField.layers, timber.fieldOptions?.airborneContext))
      .toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(linedLab.layers, linedMassive.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(linedField.layers, linedMassive.fieldOptions?.airborneContext))
      .toBeNull();

    expect(resultSnapshot(lsfLab)).toMatchObject({ c: -1.5, ctr: -6.4, rw: 55, rwDb: 55, stc: 55 });
    expect(resultSnapshot(lsfField)).toMatchObject({ dnTA: 51.1, dnTw: 52, rw: 51, rwPrimeDb: 51, stc: 51 });
    expect(resultSnapshot(timberLab)).toMatchObject({ c: 0.5, ctr: -4.2, rw: 50, rwDb: 50, stc: 50 });
    expect(resultSnapshot(timberField)).toMatchObject({ dnTA: 43.9, dnTw: 43, rw: 42, rwPrimeDb: 42, stc: 42 });
    expect(resultSnapshot(linedLab)).toMatchObject({ c: -1.6, ctr: -6.5, rw: 57, rwDb: 57, stc: 57 });
    expect(resultSnapshot(linedField)).toMatchObject({ dnTA: 54.9, dnTw: 56, rw: 55, rwPrimeDb: 55, stc: 55 });
  });

  it("requires paired engine and web tests before any future visible or runtime movement", () => {
    expect(
      GATE_B_ROW_DECISIONS.every(
        (decision) =>
          decision.requiredEngineTestsBeforeRuntime.length === 2 &&
          decision.requiredWebTestsBeforeRuntimeIfVisible.length === 2
      )
    ).toBe(true);
    expect(
      GATE_B_ROW_DECISIONS.flatMap((decision) => decision.requiredEngineTestsBeforeRuntime).every((testName) =>
        testName.startsWith("engine_")
      )
    ).toBe(true);
    expect(
      GATE_B_ROW_DECISIONS.flatMap((decision) => decision.requiredWebTestsBeforeRuntimeIfVisible).every((testName) =>
        testName.startsWith("web_")
      )
    ).toBe(true);
  });

  it("selects Gate C closeout and preserves active negative boundaries", () => {
    expect(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_B.selectedNextAction).toBe(
      "gate_c_closeout_and_next_slice_selection_no_runtime"
    );
    expect(GATE_B_ROW_DECISIONS.map((decision) => decision.protectedBoundary)).toEqual([
      "uk_steel_stud_rows_do_not_promote_timber_double_board_or_masonry_lining_routes",
      "one_side_lined_timber_rows_must_not_be_used_as_two_sided_wall_truth",
      "timber_double_board_candidate_must_not_import_before_exact_column_and_tolerance_mapping",
      "staggered_stud_rows_do_not_widen_current_simple_timber_stud_routes_without_new_topology",
      "twin_timber_stud_rows_do_not_reopen_no_stud_double_leaf_or_raw_open_box_without_topology_mapping",
      "masonry_upgrade_rows_do_not_promote_lined_heavy_wall_without_substrate_and_coupling_mapping",
      "aac_upgrade_rows_do_not_promote_generic_aac_or_lined_heavy_routes_without_exact_panel_gap_mapping"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
    );
  });

  it("keeps active docs aligned on the Gate B result and Gate C next file", () => {
    const docs = REQUIRED_PLANNING_SURFACES.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain("knauf_wall_systems_source_pack_extraction_v1");
    expect(docs).toContain("Gate B");
    expect(docs).toContain(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_B.targetNextGateFile);
    expect(docs).toContain(KNAUF_WALL_SYSTEMS_SOURCE_PACK_GATE_B.status);

    for (const boundary of PROTECTED_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
