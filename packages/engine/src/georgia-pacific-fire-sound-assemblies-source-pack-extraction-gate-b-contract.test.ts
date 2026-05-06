import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GpGateBDecision = "block_immediate_runtime_import" | "keep_context_only";

type GpGateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "interior_ul_u465_adjacent_to_lsf_not_same_anchor"
    | "interior_ul_u411_stc_range_not_single_rw"
    | "area_separation_gp_wa_120_04_not_simple_or_triple_leaf"
    | "exterior_sheathing_ul_u305_u337_not_interior_wall"
    | "exterior_sheathing_ul_u425_not_lsf_or_lined_masonry"
    | "shaftliner_ul_v473_not_simple_wall";
  family: "area_separation_wall" | "exterior_sheathing_wall" | "interior_steel_partition" | "shaftwall";
  firstMissingRequirement: string;
  gateBDecision: GpGateBDecision;
  localMaterialMapping:
    | "blocked_toughrock_fireguard_type_x_and_insulation_mapping_missing"
    | "blocked_shaftliner_h_stud_airspace_and_adjacent_wall_mapping_missing"
    | "blocked_densglass_exterior_sheathing_weather_side_mapping_missing"
    | "blocked_shaftliner_ct_ch_i_stud_resilient_channel_and_glass_fiber_mapping_missing";
  metricOwner:
    | "stc_range_without_iso_rw_curve_owner"
    | "stc_single_without_source_curve_or_metric_owner"
    | "sound_report_locator_without_full_band_payload"
    | "field_outputs_without_iso_12354_overlay_owner";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  rowId: string;
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  toleranceOwnerNamed: false;
};

type GpMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "stc_range" | "stc_single" | "sound_report_locator" | "field_outputs";
  runtimeOutputReadyNow: false;
};

const GEORGIA_PACIFIC_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  status: "georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_URLS = [
  "https://www.buildgp.com/resources/assemblies",
  "https://www.buildgp.com/product-fire-safety-and-use-information",
  "https://www.buildgp.com/wp-content/uploads/2018/10/Toughrock-Technical-guide.pdf",
  "https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Technical-Guide.pdf",
  "https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Shaftliner-shaftwell-stairwell-systems-technical-guide.pdf?x98189="
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly GpGateBRowDecision[] = [
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_range_as_single_Rw"],
    currentImplementationFit: "interior_ul_u465_adjacent_to_lsf_not_same_anchor",
    family: "interior_steel_partition",
    firstMissingRequirement:
      "gp_toughrock_ul_u465_needs_actual_ul_ga_or_ral_payload_full_band_metric_policy_toughrock_fireguard_type_x_mineral_fiber_stud_mapping_tolerance_owner_and_lsf_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_toughrock_fireguard_type_x_and_insulation_mapping_missing",
    metricOwner: "stc_range_without_iso_rw_curve_owner",
    protectedBoundary: "gp_toughrock_ul_u465_gate_b_stc_range_does_not_replace_lsf_anchor_or_timber_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_ul_u465_value_or_rejection_pin",
      "engine_gp_toughrock_ul_u465_blocks_lsf_anchor_and_timber_route_replacement"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_toughrock_ul_u465_route_card_context",
      "web_gp_toughrock_ul_u465_report_keeps_stc_range_context_explicit"
    ],
    rowId: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_range_as_single_Rw"],
    currentImplementationFit: "interior_ul_u411_stc_range_not_single_rw",
    family: "interior_steel_partition",
    firstMissingRequirement:
      "gp_toughrock_ul_u411_needs_actual_ul_ga_or_ral_payload_precise_board_fastener_and_fiberglass_mapping_metric_policy_tolerance_owner_and_paired_visible_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_toughrock_fireguard_type_x_and_insulation_mapping_missing",
    metricOwner: "stc_range_without_iso_rw_curve_owner",
    protectedBoundary: "gp_toughrock_ul_u411_gate_b_stc_range_does_not_promote_dyn_echo_rw_or_field_outputs",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_ul_u411_value_or_rejection_pin",
      "engine_gp_toughrock_ul_u411_blocks_stc_range_to_single_rw_conversion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_toughrock_ul_u411_route_card_context",
      "web_gp_toughrock_ul_u411_report_blocks_field_output_promotion"
    ],
    rowId: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "area_separation_as_triple_leaf"],
    currentImplementationFit: "area_separation_gp_wa_120_04_not_simple_or_triple_leaf",
    family: "area_separation_wall",
    firstMissingRequirement:
      "gp_toughrock_gp_wa_120_04_needs_actual_directory_or_ral_payload_h_stud_shaftliner_airspace_adjacent_wall_topology_mapping_metric_policy_tolerance_owner_and_triple_leaf_negative_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_shaftliner_h_stud_airspace_and_adjacent_wall_mapping_missing",
    metricOwner: "stc_single_without_source_curve_or_metric_owner",
    protectedBoundary:
      "gp_toughrock_gp_wa_120_04_gate_b_area_separation_stc66_does_not_promote_simple_double_leaf_or_triple_leaf_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_gp_wa_120_04_value_or_rejection_pin",
      "engine_gp_toughrock_gp_wa_120_04_rejects_simple_double_leaf_no_stud_and_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_toughrock_gp_wa_120_04_area_separation_route_card_context",
      "web_gp_toughrock_gp_wa_120_04_report_blocks_simple_wall_promotion"
    ],
    rowId: "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "exterior_sheathing_as_interior_wall"],
    currentImplementationFit: "exterior_sheathing_ul_u305_u337_not_interior_wall",
    family: "exterior_sheathing_wall",
    firstMissingRequirement:
      "gp_densglass_ul_u305_u337_needs_actual_ul_whi_ga_or_report_payload_exterior_sheathing_weather_side_context_metric_policy_tolerance_owner_and_visible_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_densglass_exterior_sheathing_weather_side_mapping_missing",
    metricOwner: "stc_range_without_iso_rw_curve_owner",
    protectedBoundary:
      "gp_densglass_ul_u305_u337_gate_b_exterior_sheathing_stc30_34_does_not_promote_generic_interior_wall_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_densglass_ul_u305_u337_value_or_rejection_pin",
      "engine_gp_densglass_ul_u305_u337_rejects_generic_interior_wall_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_densglass_ul_u305_u337_exterior_sheathing_route_card_context",
      "web_gp_densglass_ul_u305_u337_report_keeps_exterior_context_explicit"
    ],
    rowId: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "exterior_sheathing_as_lsf_or_lined_masonry"],
    currentImplementationFit: "exterior_sheathing_ul_u425_not_lsf_or_lined_masonry",
    family: "exterior_sheathing_wall",
    firstMissingRequirement:
      "gp_densglass_ul_u425_needs_actual_ul_ga_or_irc_report_payload_exterior_side_mapping_steel_stud_insulation_metric_policy_tolerance_owner_and_lsf_lined_masonry_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_densglass_exterior_sheathing_weather_side_mapping_missing",
    metricOwner: "stc_range_without_iso_rw_curve_owner",
    protectedBoundary:
      "gp_densglass_ul_u425_gate_b_exterior_sheathing_stc55_59_does_not_replace_lsf_or_lined_masonry_anchors",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_densglass_ul_u425_value_or_rejection_pin",
      "engine_gp_densglass_ul_u425_blocks_lsf_or_lined_masonry_override"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_densglass_ul_u425_route_card_lab_context",
      "web_gp_densglass_ul_u425_report_blocks_field_output_promotion"
    ],
    rowId: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "shaftwall_as_generic_wall"],
    currentImplementationFit: "shaftliner_ul_v473_not_simple_wall",
    family: "shaftwall",
    firstMissingRequirement:
      "gp_densglass_shaftliner_ul_v473_needs_actual_ul_whi_or_ral_payload_shaftwall_one_side_access_ct_ch_i_stud_resilient_channel_glass_fiber_mapping_metric_policy_tolerance_owner_and_visible_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_shaftliner_ct_ch_i_stud_resilient_channel_and_glass_fiber_mapping_missing",
    metricOwner: "stc_single_without_source_curve_or_metric_owner",
    protectedBoundary: "gp_densglass_shaftliner_ul_v473_gate_b_stc48_remains_shaftwall_context_only",
    requiredEngineTestsBeforeRuntime: [
      "engine_gp_densglass_shaftliner_ul_v473_value_or_rejection_pin",
      "engine_gp_densglass_shaftliner_ul_v473_rejects_simple_wall_or_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_gp_densglass_shaftliner_ul_v473_route_card_context",
      "web_gp_densglass_shaftliner_ul_v473_report_keeps_shaftwall_context_explicit"
    ],
    rowId: "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly GpMetricDecision[] = [
  {
    blockedTargets: ["Rw", "STC_range_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
    firstMissingRequirement:
      "georgia_pacific_stc_ranges_need_explicit_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
    metricContext: "stc_range",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "evidence_promotion_without_metric_owner"],
    firstMissingRequirement:
      "georgia_pacific_single_stc_values_need_source_metric_policy_and_tolerance_owner_before_any_dyn_echo_rw_or_support_promotion",
    metricContext: "stc_single",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["evidence_tier_promotion", "runtime_import_without_report_payload_or_digitized_curve"],
    firstMissingRequirement:
      "georgia_pacific_sound_report_numbers_identify_context_rows_but_do_not_supply_full_band_payload_digitization_qc_or_chain_of_custody",
    metricContext: "sound_report_locator",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "georgia_pacific_rows_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
    metricContext: "field_outputs",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "densglass_exterior_sheathing_does_not_coalesce_with_generic_interior_gypsum_board_without_source_tolerance_owner",
  "toughrock_fireguard_x_does_not_coalesce_with_generic_gypsum_type_c_or_soundbreak_without_exact_mapping",
  "toughrock_or_densglass_shaftliner_does_not_coalesce_with_generic_gypsum_leaf_or_lined_masonry_board",
  "soundbreak_near_source_context_does_not_coalesce_with_gp_toughrock_local_mlv_or_damped_leaf_without_mapping",
  "glass_fiber_or_mineral_fiber_does_not_coalesce_with_local_rockwool_afb_or_generic_mineral_wool",
  "resilient_channel_h_stud_ct_ch_i_stud_exterior_sheathing_and_area_separation_roles_must_not_coalesce"
] as const;

const FAMILY_BOUNDARY_DECISIONS = [
  "interior_steel_partition_rows_do_not_replace_existing_lsf_timber_or_triple_leaf_routes",
  "exterior_sheathing_wall_rows_do_not_promote_generic_interior_wall_or_lined_masonry_routes",
  "area_separation_wall_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes",
  "shaftwall_stairwell_rows_do_not_promote_simple_wall_lsf_or_lined_masonry_routes",
  "floor_ceiling_roof_context_from_gp_resources_does_not_promote_lnw_or_impact_outputs"
] as const;

const PROTECTED_BOUNDARIES = [
  "georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import",
  "georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval",
  "georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
  "georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance",
  "georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes",
  "georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors",
  "georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: [
    "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
    "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
    "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
    "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
    "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
    "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
  ],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

describe("Georgia-Pacific Fire & Sound Assemblies source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(GEORGIA_PACIFIC_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
      status: "georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted Georgia-Pacific row out of runtime import with row-specific blockers", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.rowId)).toEqual(GATE_B_DECISION.rowsKeptContextOnly);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 130)).toBe(true);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: [
        "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
        "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
        "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
        "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
        "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
        "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("blocks row-family promotion across LSF, lined masonry, shaftwall, area-separation, and triple-leaf routes", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.currentImplementationFit)).toEqual([
      "interior_ul_u465_adjacent_to_lsf_not_same_anchor",
      "interior_ul_u411_stc_range_not_single_rw",
      "area_separation_gp_wa_120_04_not_simple_or_triple_leaf",
      "exterior_sheathing_ul_u305_u337_not_interior_wall",
      "exterior_sheathing_ul_u425_not_lsf_or_lined_masonry",
      "shaftliner_ul_v473_not_simple_wall"
    ]);
    expect(FAMILY_BOUNDARY_DECISIONS).toEqual([
      "interior_steel_partition_rows_do_not_replace_existing_lsf_timber_or_triple_leaf_routes",
      "exterior_sheathing_wall_rows_do_not_promote_generic_interior_wall_or_lined_masonry_routes",
      "area_separation_wall_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes",
      "shaftwall_stairwell_rows_do_not_promote_simple_wall_lsf_or_lined_masonry_routes",
      "floor_ceiling_roof_context_from_gp_resources_does_not_promote_lnw_or_impact_outputs"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes"
    );
  });

  it("blocks STC ranges, single STC values, report locators, and field-output leakage into DynEcho metrics", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "STC_range_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
        firstMissingRequirement:
          "georgia_pacific_stc_ranges_need_explicit_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves_before_runtime_use",
        metricContext: "stc_range",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "evidence_promotion_without_metric_owner"],
        firstMissingRequirement:
          "georgia_pacific_single_stc_values_need_source_metric_policy_and_tolerance_owner_before_any_dyn_echo_rw_or_support_promotion",
        metricContext: "stc_single",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["evidence_tier_promotion", "runtime_import_without_report_payload_or_digitized_curve"],
        firstMissingRequirement:
          "georgia_pacific_sound_report_numbers_identify_context_rows_but_do_not_supply_full_band_payload_digitization_qc_or_chain_of_custody",
        metricContext: "sound_report_locator",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "georgia_pacific_rows_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
        metricContext: "field_outputs",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs"
    );
  });

  it("requires material alias ownership and paired tests before future visible or runtime movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "densglass_exterior_sheathing_does_not_coalesce_with_generic_interior_gypsum_board_without_source_tolerance_owner",
      "toughrock_fireguard_x_does_not_coalesce_with_generic_gypsum_type_c_or_soundbreak_without_exact_mapping",
      "toughrock_or_densglass_shaftliner_does_not_coalesce_with_generic_gypsum_leaf_or_lined_masonry_board",
      "soundbreak_near_source_context_does_not_coalesce_with_gp_toughrock_local_mlv_or_damped_leaf_without_mapping",
      "glass_fiber_or_mineral_fiber_does_not_coalesce_with_local_rockwool_afb_or_generic_mineral_wool",
      "resilient_channel_h_stud_ct_ch_i_stud_exterior_sheathing_and_area_separation_roles_must_not_coalesce"
    ]);
    expect(
      GATE_B_ROW_DECISIONS.every(
        (row) =>
          row.requiredEngineTestsBeforeRuntime.length === 2 &&
          row.requiredWebTestsBeforeRuntimeIfVisible.length === 2
      )
    ).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance"
    );
  });

  it("keeps the original split-rockwool defect and all runtime-visible surfaces frozen", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(PROTECTED_BOUNDARIES).toContain(
      "georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result"
    );
    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(GEORGIA_PACIFIC_GATE_B.numericRuntimeBehaviorChange).toBe(false);
    expect(GEORGIA_PACIFIC_GATE_B.runtimeWidening).toBe(false);
    expect(FROZEN_SURFACES).toEqual([
      "runtime",
      "support",
      "confidence",
      "evidence",
      "API",
      "route-card",
      "output-card",
      "proposal/report",
      "workbench-input"
    ]);
  });

  it("keeps active docs aligned on Gate C closeout as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(GEORGIA_PACIFIC_GATE_B.sliceId);
    expect(docs).toContain(GEORGIA_PACIFIC_GATE_B.status);
    expect(docs).toContain(GEORGIA_PACIFIC_GATE_B.selectedNextAction);
    expect(docs).toContain(GEORGIA_PACIFIC_GATE_B.targetNextGateFile);

    for (const sourceUrl of SOURCE_URLS) {
      expect(docs, sourceUrl).toContain(sourceUrl);
    }

    for (const row of GATE_B_ROW_DECISIONS) {
      expect(docs, row.rowId).toContain(row.rowId);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const boundary of [...PROTECTED_BOUNDARIES, ...FAMILY_BOUNDARY_DECISIONS]) {
      expect(docs, boundary).toContain(boundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
