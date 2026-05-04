import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type UsgGateBDecision = "block_immediate_runtime_import" | "keep_context_only";

type UsgGateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "floor_not_live_exact_floor_catalog_topology"
    | "floor_range_metric_no_single_value_mapping"
    | "floor_srb_not_srm25_material_substitution"
    | "floor_truss_not_i_joist_or_generated_floor_truth"
    | "steel_partition_a1_not_existing_lsf_anchor"
    | "steel_partition_a8_resilient_channel_not_live_lsf_or_triple_leaf";
  family: "floor_ceiling_levelrock" | "wall_partition_steel_framed";
  firstMissingRequirement: string;
  gateBDecision: UsgGateBDecision;
  localMaterialMapping:
    | "blocked_i_joist_srm25_carpet_levelrock_topology_mapping_missing"
    | "blocked_i_joist_srm25_sheet_vinyl_range_and_topology_mapping_missing"
    | "blocked_i_joist_srb_wood_laminate_srb_material_mapping_missing"
    | "blocked_truss_srm25_ceramic_tile_truss_role_mapping_missing"
    | "blocked_sheetrock_firecode_steel_stud_spacing_and_test_number_mapping_missing"
    | "blocked_sheetrock_firecode_c_thermafiber_safb_rc_channel_mapping_missing";
  metricOwner:
    | "stc_iic_without_iso_rw_lnw_owner"
    | "stc_iic_range_without_single_value_policy"
    | "stc_test_number_without_iso_rw_curve_owner"
    | "stc_test_number_without_field_owner_and_resilient_channel_policy";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  rowId: string;
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  toleranceOwnerNamed: false;
};

type UsgMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "source_stc" | "source_iic" | "source_range" | "source_test_number" | "field_outputs";
  runtimeOutputReadyNow: false;
};

const USG_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "usg_acoustical_assemblies_source_pack_extraction_v1",
  status: "usg_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_URL =
  "https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly UsgGateBRowDecision[] = [
  {
    blockedTargetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "field_floor_outputs"],
    currentImplementationFit: "floor_not_live_exact_floor_catalog_topology",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "levelrock_i_joist_srm25_carpet_needs_levelrock_underlayment_i_joist_carpet_floor_finish_iic_stc_metric_policy_tolerance_and_visible_tests_before_import",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_i_joist_srm25_carpet_levelrock_topology_mapping_missing",
    metricOwner: "stc_iic_without_iso_rw_lnw_owner",
    protectedBoundary:
      "levelrock_i_joist_srm25_carpet_row_does_not_promote_exact_floor_or_wall_outputs_without_mapping_tolerance",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_levelrock_i_joist_srm25_carpet_value_or_rejection_pin",
      "engine_usg_levelrock_i_joist_srm25_carpet_rejects_wall_and_generated_floor_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_levelrock_i_joist_srm25_carpet_route_card_source_context",
      "web_usg_levelrock_i_joist_srm25_carpet_report_keeps_iic_stc_context_explicit"
    ],
    rowId: "LEVELROCK_I_JOIST_SRM25_CARPET",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "Ln,w", "range_collapse", "field_floor_outputs"],
    currentImplementationFit: "floor_range_metric_no_single_value_mapping",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "levelrock_i_joist_srm25_sheet_vinyl_needs_range_policy_floor_finish_topology_iic_stc_metric_owner_and_tolerance_before_exact_value_import",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_i_joist_srm25_sheet_vinyl_range_and_topology_mapping_missing",
    metricOwner: "stc_iic_range_without_single_value_policy",
    protectedBoundary:
      "levelrock_i_joist_srm25_sheet_vinyl_range_row_does_not_collapse_to_single_exact_dyn_echo_value",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_levelrock_i_joist_srm25_sheet_vinyl_range_value_or_rejection_pin",
      "engine_usg_levelrock_i_joist_srm25_sheet_vinyl_rejects_single_value_collapse"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_levelrock_i_joist_srm25_sheet_vinyl_range_context",
      "web_usg_levelrock_i_joist_srm25_sheet_vinyl_report_blocks_exact_value_copy"
    ],
    rowId: "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Ln,w", "SRB_as_SRM25", "generic_resilient_layer"],
    currentImplementationFit: "floor_srb_not_srm25_material_substitution",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "levelrock_i_joist_srb_wood_laminate_needs_srb_board_material_identity_i_joist_floor_finish_metric_policy_and_tolerance_owner_before_import",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_i_joist_srb_wood_laminate_srb_material_mapping_missing",
    metricOwner: "stc_iic_without_iso_rw_lnw_owner",
    protectedBoundary:
      "levelrock_i_joist_srb_wood_laminate_row_does_not_substitute_for_srm25_mat_or_generic_resilient_floor_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_levelrock_i_joist_srb_wood_laminate_value_or_rejection_pin",
      "engine_usg_levelrock_i_joist_srb_wood_laminate_rejects_srm25_and_generic_resilient_substitution"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_levelrock_i_joist_srb_wood_laminate_route_card_source_context",
      "web_usg_levelrock_i_joist_srb_wood_laminate_report_keeps_srb_material_explicit"
    ],
    rowId: "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Ln,w", "truss_as_i_joist", "generated_floor_promotion"],
    currentImplementationFit: "floor_truss_not_i_joist_or_generated_floor_truth",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "levelrock_truss_srm25_ceramic_tile_needs_truss_specific_topology_tile_finish_metric_policy_tolerance_and_generated_floor_negative_tests_before_import",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_truss_srm25_ceramic_tile_truss_role_mapping_missing",
    metricOwner: "stc_iic_without_iso_rw_lnw_owner",
    protectedBoundary:
      "levelrock_truss_srm25_ceramic_tile_row_does_not_substitute_for_i_joist_open_web_or_generated_floor_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_levelrock_truss_srm25_ceramic_tile_value_or_rejection_pin",
      "engine_usg_levelrock_truss_srm25_ceramic_tile_rejects_i_joist_open_web_and_generated_floor_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_levelrock_truss_srm25_ceramic_tile_route_card_source_context",
      "web_usg_levelrock_truss_srm25_ceramic_tile_report_keeps_truss_context_explicit"
    ],
    rowId: "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_Rw"],
    currentImplementationFit: "steel_partition_a1_not_existing_lsf_anchor",
    family: "wall_partition_steel_framed",
    firstMissingRequirement:
      "usg_steel_framed_a1_needs_sheetrock_firecode_steel_stud_gauge_spacing_stc_to_rw_policy_curve_owner_tolerance_and_lsf_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_sheetrock_firecode_steel_stud_spacing_and_test_number_mapping_missing",
    metricOwner: "stc_test_number_without_iso_rw_curve_owner",
    protectedBoundary:
      "usg_steel_framed_a1_stc_row_does_not_override_existing_lsf_anchor_or_generic_wall_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_steel_framed_a1_value_or_rejection_pin",
      "engine_usg_steel_framed_a1_rejects_knauf_lsf_and_generic_wall_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_steel_framed_a1_route_card_source_context",
      "web_usg_steel_framed_a1_report_blocks_stc_to_rw_overread"
    ],
    rowId: "USG_STEEL_FRAMED_A1",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_Rw"],
    currentImplementationFit: "steel_partition_a8_resilient_channel_not_live_lsf_or_triple_leaf",
    family: "wall_partition_steel_framed",
    firstMissingRequirement:
      "usg_steel_framed_a8_needs_sheetrock_firecode_c_thermafiber_safb_rc_channel_one_side_mapping_stc_curve_policy_tolerance_and_triple_leaf_negative_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_sheetrock_firecode_c_thermafiber_safb_rc_channel_mapping_missing",
    metricOwner: "stc_test_number_without_field_owner_and_resilient_channel_policy",
    protectedBoundary:
      "usg_steel_framed_a8_resilient_channel_row_does_not_promote_triple_leaf_near_source_lsf_or_rockwool_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_usg_steel_framed_a8_value_or_rejection_pin",
      "engine_usg_steel_framed_a8_rejects_triple_leaf_near_source_lsf_and_rockwool_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_usg_steel_framed_a8_route_card_source_context",
      "web_usg_steel_framed_a8_report_blocks_resilient_channel_and_field_output_overread"
    ],
    rowId: "USG_STEEL_FRAMED_A8",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly UsgMetricDecision[] = [
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
    firstMissingRequirement:
      "usg_stc_values_need_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime",
    metricContext: "source_stc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["Ln,w", "L'n,w", "L'nT,w", "field_floor_outputs"],
    firstMissingRequirement:
      "usg_iic_values_are_not_dyn_echo_lnw_values_without_impact_spectrum_or_iso_lnw_derivation_and_field_normalisation_policy",
    metricContext: "source_iic",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["single_exact_value", "support_confidence_promotion", "proposal_exact_copy"],
    firstMissingRequirement:
      "usg_range_rows_need_range_policy_or_explicit_rejection_before_any_single_value_copy_to_engine_or_report",
    metricContext: "source_range",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["evidence_tier_promotion", "runtime_import_without_curve_payload"],
    firstMissingRequirement:
      "usg_test_numbers_identify_source_rows_but_do_not_supply_curve_payload_metric_conversion_or_tolerance_owner",
    metricContext: "source_test_number",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "usg_sa200_rows_do_not_supply_field_or_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
    metricContext: "field_outputs",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "levelrock_does_not_coalesce_with_generic_floor_underlayment_without_source_tolerance_owner",
  "srm25_mat_does_not_coalesce_with_srb_board_or_generic_resilient_layer",
  "i_joist_truss_and_open_web_roles_must_not_coalesce_without_topology_owner",
  "sheetrock_firecode_does_not_coalesce_with_generic_gypsum_or_knauf_british_gypsum_board_rows_without_mapping",
  "thermafiber_safb_does_not_coalesce_with_rockwool_afb_glass_fiber_or_generic_mineral_wool",
  "rc_channel_one_side_does_not_coalesce_with_generic_resilient_bar_or_double_leaf_independent_frame"
] as const;

const PROTECTED_BOUNDARIES = [
  "usg_gate_b_source_rows_are_not_runtime_import_approval",
  "usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs",
  "usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes",
  "usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance",
  "usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors",
  "usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar",
  "usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: [
    "LEVELROCK_I_JOIST_SRM25_CARPET",
    "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
    "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
    "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
    "USG_STEEL_FRAMED_A1",
    "USG_STEEL_FRAMED_A8"
  ],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
} as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("USG Acoustical Assemblies source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(USG_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "usg_acoustical_assemblies_source_pack_extraction_v1",
      status: "usg_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted USG row out of runtime import with row-specific blockers", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.rowId)).toEqual([
      "LEVELROCK_I_JOIST_SRM25_CARPET",
      "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
      "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
      "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
      "USG_STEEL_FRAMED_A1",
      "USG_STEEL_FRAMED_A8"
    ]);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 100)).toBe(true);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: [
        "LEVELROCK_I_JOIST_SRM25_CARPET",
        "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
        "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
        "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
        "USG_STEEL_FRAMED_A1",
        "USG_STEEL_FRAMED_A8"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("blocks Levelrock floor rows from exact floor catalog and generated-floor promotion", () => {
    const levelrockCatalogRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      /(levelrock|srm-25|sound reduction mat|sound reduction board)/iu.test(JSON.stringify(system))
    );
    const floorRows = GATE_B_ROW_DECISIONS.filter((row) => row.family === "floor_ceiling_levelrock");

    expect(levelrockCatalogRows).toEqual([]);
    expect(floorRows.map((row) => row.currentImplementationFit)).toEqual([
      "floor_not_live_exact_floor_catalog_topology",
      "floor_range_metric_no_single_value_mapping",
      "floor_srb_not_srm25_material_substitution",
      "floor_truss_not_i_joist_or_generated_floor_truth"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes"
    );
    expect(PROTECTED_BOUNDARIES).toContain(
      "usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance"
    );
  });

  it("blocks USG steel partition rows from replacing existing LSF or triple-leaf behavior", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const lsfLab = calculateAssembly(lsf.rows, lsf.labOptions);
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(findVerifiedAirborneAssemblyMatch(lsfLab.layers, lsf.labOptions?.airborneContext)?.id).toBe(
      "knauf_lab_416889_primary_2026"
    );
    expect(resultSnapshot(lsfLab)).toMatchObject({ c: -1.5, ctr: -6.4, rw: 55, rwDb: 55, stc: 55 });
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.family === "wall_partition_steel_framed").map((row) => row.currentImplementationFit)).toEqual([
      "steel_partition_a1_not_existing_lsf_anchor",
      "steel_partition_a8_resilient_channel_not_live_lsf_or_triple_leaf"
    ]);
    expect(splitRockwool.metrics.estimatedRwDb).toBe(41);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("low");
  });

  it("blocks STC/IIC/range/test-number over-read into DynEcho runtime metrics", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
        firstMissingRequirement:
          "usg_stc_values_need_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime",
        metricContext: "source_stc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["Ln,w", "L'n,w", "L'nT,w", "field_floor_outputs"],
        firstMissingRequirement:
          "usg_iic_values_are_not_dyn_echo_lnw_values_without_impact_spectrum_or_iso_lnw_derivation_and_field_normalisation_policy",
        metricContext: "source_iic",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["single_exact_value", "support_confidence_promotion", "proposal_exact_copy"],
        firstMissingRequirement:
          "usg_range_rows_need_range_policy_or_explicit_rejection_before_any_single_value_copy_to_engine_or_report",
        metricContext: "source_range",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["evidence_tier_promotion", "runtime_import_without_curve_payload"],
        firstMissingRequirement:
          "usg_test_numbers_identify_source_rows_but_do_not_supply_curve_payload_metric_conversion_or_tolerance_owner",
        metricContext: "source_test_number",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "usg_sa200_rows_do_not_supply_field_or_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
        metricContext: "field_outputs",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs"
    );
  });

  it("requires material alias ownership and paired tests before any future visible or runtime movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "levelrock_does_not_coalesce_with_generic_floor_underlayment_without_source_tolerance_owner",
      "srm25_mat_does_not_coalesce_with_srb_board_or_generic_resilient_layer",
      "i_joist_truss_and_open_web_roles_must_not_coalesce_without_topology_owner",
      "sheetrock_firecode_does_not_coalesce_with_generic_gypsum_or_knauf_british_gypsum_board_rows_without_mapping",
      "thermafiber_safb_does_not_coalesce_with_rockwool_afb_glass_fiber_or_generic_mineral_wool",
      "rc_channel_one_side_does_not_coalesce_with_generic_resilient_bar_or_double_leaf_independent_frame"
    ]);
    expect(
      GATE_B_ROW_DECISIONS.every(
        (row) =>
          row.requiredEngineTestsBeforeRuntime.length === 2 &&
          row.requiredWebTestsBeforeRuntimeIfVisible.length === 2
      )
    ).toBe(true);
    expect(
      GATE_B_ROW_DECISIONS.flatMap((row) => row.requiredEngineTestsBeforeRuntime).every((name) =>
        name.startsWith("engine_")
      )
    ).toBe(true);
    expect(
      GATE_B_ROW_DECISIONS.flatMap((row) => row.requiredWebTestsBeforeRuntimeIfVisible).every((name) =>
        name.startsWith("web_")
      )
    ).toBe(true);
  });

  it("keeps active docs aligned on Gate C closeout as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(USG_GATE_B.sliceId);
    expect(docs).toContain(USG_GATE_B.status);
    expect(docs).toContain(USG_GATE_B.selectedNextAction);
    expect(docs).toContain(USG_GATE_B.targetNextGateFile);
    expect(docs).toContain(SOURCE_URL);

    for (const row of GATE_B_ROW_DECISIONS) {
      expect(docs, row.rowId).toContain(row.rowId);
    }

    for (const boundary of PROTECTED_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
