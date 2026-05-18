import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GpSourceFamily =
  | "area_separation_wall"
  | "exterior_sheathing_wall"
  | "interior_steel_partition"
  | "shaftwall_stairwell";

type GpMetricContext = "stc_range_test_reference" | "stc_single_test_reference";

type GpSourceRow = {
  actualDirectoryOrTestReportRequired: true;
  blockedTargetOutputs: readonly string[];
  buildSummary: string;
  designReferences: readonly string[];
  exactDirectoryPayloadCaptured: false;
  exactReportPayloadCaptured: false;
  family: GpSourceFamily;
  fireRating: string;
  firstMissingRequirement: string;
  id: string;
  importDisposition: "no_runtime_import";
  localMappingStatus:
    | "blocked_area_separation_shaftliner_and_adjacent_framing_mapping_missing"
    | "blocked_densglass_exterior_sheathing_mapping_missing"
    | "blocked_toughrock_fireguard_and_insulation_mapping_missing";
  metricContext: GpMetricContext;
  pairedEngineTestsBeforeRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  protectedBoundary: string;
  soundReport: string;
  sourceLocator: string;
  sourceUrl: string;
  stc: number | `${number}-${number}`;
};

const GEORGIA_PACIFIC_FIRE_SOUND_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  status: "georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const ASSEMBLIES_URL = "https://www.buildgp.com/resources/assemblies";
const FIRE_SAFETY_URL = "https://www.buildgp.com/product-fire-safety-and-use-information";
const TOUGHROCK_TECH_GUIDE_URL = "https://www.buildgp.com/wp-content/uploads/2018/10/Toughrock-Technical-guide.pdf";
const DENSGLASS_TECH_GUIDE_URL =
  "https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Technical-Guide.pdf";
const DENSGLASS_SHAFTLINER_GUIDE_URL =
  "https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Shaftliner-shaftwell-stairwell-systems-technical-guide.pdf?x98189=";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GP_SOURCE_ROWS: readonly GpSourceRow[] = [
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "5/8 in ToughRock Fireguard X each side of 3-5/8 in steel studs at 24 in oc, mineral fiber in stud space",
    designReferences: ["UL U465", "ULC W415", "cUL U465", "GA WP 1081"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "interior_steel_partition",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "toughrock_ul_u465_stc_45_49_needs_actual_directory_or_ral_report_payload_full_metric_policy_toughrock_mineral_fiber_stud_mapping_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    id: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_toughrock_fireguard_and_insulation_mapping_missing",
    metricContext: "stc_range_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_ul_u465_value_or_rejection_pin",
      "engine_gp_toughrock_ul_u465_rejects_existing_lsf_anchor_replacement"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_toughrock_ul_u465_route_card_context",
      "web_gp_toughrock_ul_u465_report_keeps_stc_range_context_explicit"
    ],
    protectedBoundary: "gp_toughrock_ul_u465_stc_range_is_not_a_dyn_echo_rw_or_lsf_anchor_replacement",
    soundReport: "RAL TL99-103",
    sourceLocator: "ToughRock Technical Guide / interior wall / UL U465 / GA WP 1081",
    sourceUrl: TOUGHROCK_TECH_GUIDE_URL,
    stc: "45-49"
  },
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "two layers 5/8 in ToughRock Fireguard X each side of 3-5/8 in steel studs, fiberglass in stud space",
    designReferences: ["UL U411", "cUL U411", "GA WP 15241"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "interior_steel_partition",
    fireRating: "2 Hour",
    firstMissingRequirement:
      "toughrock_ul_u411_stc_55_59_needs_actual_directory_or_report_payload_precise_layer_fastener_and_insulation_mapping_metric_owner_tolerance_owner_and_paired_visible_tests",
    id: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_toughrock_fireguard_and_insulation_mapping_missing",
    metricContext: "stc_range_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_ul_u411_value_or_rejection_pin",
      "engine_gp_toughrock_ul_u411_blocks_stc_range_to_single_rw_conversion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_toughrock_ul_u411_route_card_context",
      "web_gp_toughrock_ul_u411_report_blocks_field_output_promotion"
    ],
    protectedBoundary: "gp_toughrock_ul_u411_stc_range_does_not_promote_dyn_echo_rw_or_field_outputs",
    soundReport: "RAL TL09-331",
    sourceLocator: "ToughRock Technical Guide / interior wall / UL U411 / GA WP 15241",
    sourceUrl: TOUGHROCK_TECH_GUIDE_URL,
    stc: "55-59"
  },
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "two layers 1 in ToughRock Shaftliner in H-studs with 3/4 in air space both sides and adjacent framed walls",
    designReferences: ["UL U375", "GP/WA 120-04", "cUL U375", "UL U373"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "area_separation_wall",
    fireRating: "2 Hour",
    firstMissingRequirement:
      "toughrock_gp_wa_120_04_area_separation_needs_h_stud_shaftliner_airspace_adjacent_wall_mapping_actual_ral_report_payload_metric_policy_tolerance_owner_and_negative_boundaries",
    id: "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_area_separation_shaftliner_and_adjacent_framing_mapping_missing",
    metricContext: "stc_single_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_toughrock_gp_wa_120_04_value_or_rejection_pin",
      "engine_gp_toughrock_gp_wa_120_04_rejects_triple_leaf_and_no_stud_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_toughrock_gp_wa_120_04_area_separation_route_card_context",
      "web_gp_toughrock_gp_wa_120_04_report_blocks_simple_wall_promotion"
    ],
    protectedBoundary: "gp_toughrock_area_separation_stc66_is_not_simple_double_leaf_or_triple_leaf_truth",
    soundReport: "RAL TL 10-291",
    sourceLocator: "ToughRock Technical Guide / area separation wall / GP/WA 120-04",
    sourceUrl: TOUGHROCK_TECH_GUIDE_URL,
    stc: 66
  },
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "5/8 in DensGlass Fireguard sheathing exterior and interior gypsum board on 2x4 wood studs",
    designReferences: ["UL U305", "U337", "WHI 495-0702", "GA WP 8130"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "exterior_sheathing_wall",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "densglass_ul_u305_u337_stc_30_34_needs_actual_directory_or_or_report_payload_exterior_sheathing_mapping_weather_side_context_metric_policy_tolerance_owner_and_visible_tests",
    id: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_densglass_exterior_sheathing_mapping_missing",
    metricContext: "stc_range_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_densglass_ul_u305_value_or_rejection_pin",
      "engine_gp_densglass_ul_u305_rejects_generic_interior_wall_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_densglass_ul_u305_exterior_sheathing_route_card_context",
      "web_gp_densglass_ul_u305_report_keeps_exterior_context_explicit"
    ],
    protectedBoundary: "gp_densglass_exterior_sheathing_stc_30_34_does_not_promote_generic_interior_wall_routes",
    soundReport: "OR 64-8",
    sourceLocator: "DensGlass Technical Guide / fire-rated assemblies / UL U305 U337 / GA WP 8130",
    sourceUrl: DENSGLASS_TECH_GUIDE_URL,
    stc: "30-34"
  },
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "DensGlass Fireguard sheathing exterior steel-framed two-hour wall with interior gypsum layers and insulation",
    designReferences: ["UL U425", "cUL U425", "GA WP 1716", "GA WP 8203"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "exterior_sheathing_wall",
    fireRating: "2 Hour",
    firstMissingRequirement:
      "densglass_ul_u425_stc_55_59_needs_actual_directory_or_irc_report_payload_exterior_side_mapping_steel_stud_and_insulation_mapping_metric_policy_tolerance_owner_and_visible_tests",
    id: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_densglass_exterior_sheathing_mapping_missing",
    metricContext: "stc_range_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_densglass_ul_u425_value_or_rejection_pin",
      "engine_gp_densglass_ul_u425_blocks_lined_masonry_or_lsf_override"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_densglass_ul_u425_route_card_lab_context",
      "web_gp_densglass_ul_u425_report_blocks_field_output_promotion"
    ],
    protectedBoundary: "gp_densglass_ul_u425_stc_range_does_not_replace_existing_lsf_or_lined_masonry_anchors",
    soundReport: "IRC IR 761",
    sourceLocator: "DensGlass Technical Guide / fire-rated assemblies / UL U425 / GA WP 8203",
    sourceUrl: DENSGLASS_TECH_GUIDE_URL,
    stc: "55-59"
  },
  {
    actualDirectoryOrTestReportRequired: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "UL V473 one-hour shaftwall with 2-1/2 in C-T/C-H/I studs, 1-1/2 in glass fiber, and resilient channel variant",
    designReferences: ["UL V473", "WHI GP/WA 60/01"],
    exactDirectoryPayloadCaptured: false,
    exactReportPayloadCaptured: false,
    family: "shaftwall_stairwell",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "densglass_shaftliner_ul_v473_stc48_needs_actual_ul_or_whi_listing_and_ral_report_payload_shaftwall_one_side_access_resilient_channel_mapping_glass_fiber_mapping_metric_policy_tolerance_owner_and_visible_tests",
    id: "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_area_separation_shaftliner_and_adjacent_framing_mapping_missing",
    metricContext: "stc_single_test_reference",
    pairedEngineTestsBeforeRuntime: [
      "engine_gp_densglass_shaftliner_ul_v473_value_or_rejection_pin",
      "engine_gp_densglass_shaftliner_ul_v473_rejects_simple_wall_or_triple_leaf_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_gp_densglass_shaftliner_ul_v473_route_card_context",
      "web_gp_densglass_shaftliner_ul_v473_report_keeps_shaftwall_context_explicit"
    ],
    protectedBoundary: "gp_densglass_shaftliner_ul_v473_stc48_is_shaftwall_context_only",
    soundReport: "RAL TL09-363",
    sourceLocator: "DensGlass Shaftliner Guide / Sound Chart / UL V473 - 1 hr / WHI GP/WA 60/01",
    sourceUrl: DENSGLASS_SHAFTLINER_GUIDE_URL,
    stc: 48
  }
] as const;

const GP_RESOURCE_SURFACE_COVERAGE = {
  actualDirectoryOrTestReportRequiredForCompleteInformation: true,
  dynamicRowsVisibleOnStaticAssembliesPage: false,
  fireSafetyUsePageRequiredForCautionContext: true,
  officialPlanningPage: true,
  pageStatesPlanningPurposeOnly: true,
  pageStatesShouldNotBeUsedForConstruction: true,
  stcRatingMayNotApplyToAllProductsListed: true,
  technicalGuideRowsCaptured: GP_SOURCE_ROWS.length
} as const;

const GP_METRIC_POLICY = {
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directRwImportSelectedNow: false,
  directStcRangeToSingleRwEquivalenceOwned: false,
  directStcToRwEquivalenceOwned: false,
  fullBandCurvesCaptured: false,
  sourceMetrics: ["STC", "fire_rating", "UL_ULC_GA_WHI_design_reference", "test_reference"],
  stcRangesStayRangesUntilMappingGate: true,
  toleranceOwnerNamed: false
} as const;

const GP_MATERIAL_AND_TOPOLOGY_POLICY = [
  {
    aliasDecision: "blocked_densglass_exterior_sheathing_is_not_generic_interior_gypsum_board",
    localInput: "gypsum_board",
    sourceMaterial: "DensGlass Fireguard Sheathing"
  },
  {
    aliasDecision: "blocked_toughrock_fireguard_x_needs_type_x_type_c_and_thickness_mapping",
    localInput: "gypsum_board",
    sourceMaterial: "ToughRock Fireguard X"
  },
  {
    aliasDecision: "blocked_toughrock_or_densglass_shaftliner_is_not_generic_gypsum_leaf",
    localInput: "gypsum_board",
    sourceMaterial: "ToughRock or DensGlass Shaftliner"
  },
  {
    aliasDecision: "blocked_soundbreak_is_near_source_context_not_gp_toughrock_or_local_mlv",
    localInput: "gypsum_board_or_mlv",
    sourceMaterial: "SoundBreak acoustic board from nearby sources"
  },
  {
    aliasDecision: "blocked_glass_fiber_or_mineral_fiber_does_not_equal_local_rockwool",
    localInput: "rockwool",
    sourceMaterial: "glass fiber or mineral fiber"
  },
  {
    aliasDecision: "blocked_resilient_channel_h_stud_ct_ch_i_stud_and_exterior_sheathing_roles_must_not_coalesce",
    localInput: "resilient_bar_or_generic_steel_stud",
    sourceMaterial: "resilient channel, H-stud, C-T/C-H/I stud, exterior sheathing"
  }
] as const;

const GP_FAMILY_BOUNDARY_MATRIX = [
  {
    blockedPromotion: "do_not_promote_to_floor_lnw_or_impact_outputs",
    sourceFamily: "interior wall",
    targetRouteFamilies: ["wall_lsf_context_only", "wall_timber_context_only"]
  },
  {
    blockedPromotion: "do_not_promote_to_generic_interior_wall_or_lined_masonry",
    sourceFamily: "exterior sheathing wall",
    targetRouteFamilies: ["exterior_wall_context_only"]
  },
  {
    blockedPromotion: "do_not_promote_to_simple_double_leaf_no_stud_or_triple_leaf",
    sourceFamily: "area separation wall",
    targetRouteFamilies: ["area_separation_context_only"]
  },
  {
    blockedPromotion: "do_not_promote_to_simple_stud_wall_or_lined_masonry",
    sourceFamily: "shaftwall stairwell",
    targetRouteFamilies: ["shaftwall_context_only"]
  },
  {
    blockedPromotion: "do_not_cross_promote_roof_or_ceiling_context_into_wall_or_floor_outputs",
    sourceFamily: "roof ceiling resource context",
    targetRouteFamilies: ["roof_ceiling_context_only"]
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row",
  "actual_directory_or_test_report_information_is_required_before_complete_use",
  "gp_context_does_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors",
  "georgia_pacific_stc_context_does_not_promote_dyn_echo_rw_or_field_outputs",
  "gp_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance",
  "gp_wall_floor_ceiling_roof_context_does_not_cross_promote_route_families",
  "georgia_pacific_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const ROW_BOUNDARIES = [
  "gp_toughrock_interior_stc_range_rows_do_not_replace_existing_lsf_or_timber_routes",
  "gp_densglass_exterior_sheathing_rows_do_not_promote_generic_interior_wall_or_lined_masonry",
  "gp_shaftliner_area_separation_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes",
  "gp_sound_report_numbers_are_locators_not_full_band_curves",
  "gp_stc_ranges_are_not_single_rw_values"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMappingOrCloseout: GP_SOURCE_ROWS.map((row) => row.id),
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts"
} as const;

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

describe("Georgia-Pacific Fire & Sound Assemblies source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source row extraction and selects Gate B mapping", () => {
    expect(GEORGIA_PACIFIC_FIRE_SOUND_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
      status: "georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts representative GP source rows with design references, STC context, and report locators", () => {
    expect(GP_SOURCE_ROWS.map((row) => row.id)).toEqual([
      "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
      "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
      "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
      "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
      "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
      "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
    ]);
    expect(new Set(GP_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<GpSourceFamily>([
        "area_separation_wall",
        "exterior_sheathing_wall",
        "interior_steel_partition",
        "shaftwall_stairwell"
      ])
    );
    expect(GP_SOURCE_ROWS.map((row) => row.stc)).toEqual(["45-49", "55-59", 66, "30-34", "55-59", 48]);
    expect(GP_SOURCE_ROWS.filter((row) => row.metricContext === "stc_range_test_reference")).toHaveLength(4);
    expect(GP_SOURCE_ROWS.every((row) => row.sourceUrl.startsWith("https://www.buildgp.com/"))).toBe(true);
    expect(GP_SOURCE_ROWS.every((row) => row.exactReportPayloadCaptured === false)).toBe(true);
    expect(GP_SOURCE_ROWS.every((row) => row.exactDirectoryPayloadCaptured === false)).toBe(true);
    expect(GP_SOURCE_ROWS.every((row) => row.actualDirectoryOrTestReportRequired === true)).toBe(true);
  });

  it("keeps the official planning page and technical guides as source context until actual reports are captured", () => {
    expect(GP_RESOURCE_SURFACE_COVERAGE).toEqual({
      actualDirectoryOrTestReportRequiredForCompleteInformation: true,
      dynamicRowsVisibleOnStaticAssembliesPage: false,
      fireSafetyUsePageRequiredForCautionContext: true,
      officialPlanningPage: true,
      pageStatesPlanningPurposeOnly: true,
      pageStatesShouldNotBeUsedForConstruction: true,
      stcRatingMayNotApplyToAllProductsListed: true,
      technicalGuideRowsCaptured: 6
    });
    expect([ASSEMBLIES_URL, FIRE_SAFETY_URL, TOUGHROCK_TECH_GUIDE_URL, DENSGLASS_TECH_GUIDE_URL]).toSatisfy(
      (urls: readonly string[]) => urls.every((url) => url.startsWith("https://www.buildgp.com/"))
    );
    expect(GP_SOURCE_ROWS.every((row) => row.firstMissingRequirement.includes("actual"))).toBe(true);
  });

  it("blocks STC and STC ranges from becoming DynEcho Rw or field outputs", () => {
    expect(GP_METRIC_POLICY).toEqual({
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directRwImportSelectedNow: false,
      directStcRangeToSingleRwEquivalenceOwned: false,
      directStcToRwEquivalenceOwned: false,
      fullBandCurvesCaptured: false,
      sourceMetrics: ["STC", "fire_rating", "UL_ULC_GA_WHI_design_reference", "test_reference"],
      stcRangesStayRangesUntilMappingGate: true,
      toleranceOwnerNamed: false
    });
    expect(GP_SOURCE_ROWS.map((row) => row.soundReport)).toEqual([
      "RAL TL99-103",
      "RAL TL09-331",
      "RAL TL 10-291",
      "OR 64-8",
      "IRC IR 761",
      "RAL TL09-363"
    ]);
    expect(GP_SOURCE_ROWS.some((row) => typeof row.stc === "string" && row.stc.includes("-"))).toBe(true);
  });

  it("blocks material and topology coalescing across DensGlass, ToughRock, SoundBreak, generic gypsum, and insulation roles", () => {
    expect(GP_MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => `${entry.sourceMaterial}:${entry.localInput}`)).toEqual([
      "DensGlass Fireguard Sheathing:gypsum_board",
      "ToughRock Fireguard X:gypsum_board",
      "ToughRock or DensGlass Shaftliner:gypsum_board",
      "SoundBreak acoustic board from nearby sources:gypsum_board_or_mlv",
      "glass fiber or mineral fiber:rockwool",
      "resilient channel, H-stud, C-T/C-H/I stud, exterior sheathing:resilient_bar_or_generic_steel_stud"
    ]);
    expect(GP_MATERIAL_AND_TOPOLOGY_POLICY.every((entry) => entry.aliasDecision.startsWith("blocked"))).toBe(true);
    expect(GP_MATERIAL_AND_TOPOLOGY_POLICY.join("\n")).not.toContain("runtime_exact");
  });

  it("holds wall, floor, ceiling, roof, shaftwall, and area-separation family boundaries", () => {
    expect(GP_FAMILY_BOUNDARY_MATRIX).toHaveLength(5);
    expect(GP_FAMILY_BOUNDARY_MATRIX.map((entry) => entry.blockedPromotion)).toEqual([
      "do_not_promote_to_floor_lnw_or_impact_outputs",
      "do_not_promote_to_generic_interior_wall_or_lined_masonry",
      "do_not_promote_to_simple_double_leaf_no_stud_or_triple_leaf",
      "do_not_promote_to_simple_stud_wall_or_lined_masonry",
      "do_not_cross_promote_roof_or_ceiling_context_into_wall_or_floor_outputs"
    ]);
    expect(GP_FAMILY_BOUNDARY_MATRIX.flatMap((entry) => entry.targetRouteFamilies)).not.toContain(
      "runtime_import_ready"
    );
  });

  it("protects the original split-rockwool defect and closed near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMappingOrCloseout: [
        "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
        "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
        "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
        "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
        "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
        "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(8);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("does_not_count_as_a_runtime_ready_stc_source_row");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("does_not_promote_dyn_echo_rw");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain(
      "georgia_pacific_rows_do_not_fix_the_uris_2006_split_rockwool"
    );
    expect(ROW_BOUNDARIES.join("\n")).toContain("gp_stc_ranges_are_not_single_rw_values");
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(GEORGIA_PACIFIC_FIRE_SOUND_GATE_A.sliceId);
    expect(docs).toContain(GEORGIA_PACIFIC_FIRE_SOUND_GATE_A.status);
    expect(docs).toContain(GEORGIA_PACIFIC_FIRE_SOUND_GATE_A.selectedNextAction);
    expect(docs).toContain(GEORGIA_PACIFIC_FIRE_SOUND_GATE_A.selectedNextFile);
    expect(docs).toContain(ASSEMBLIES_URL);
    expect(docs).toContain(TOUGHROCK_TECH_GUIDE_URL);
    expect(docs).toContain(DENSGLASS_TECH_GUIDE_URL);
    expect(docs).toContain(DENSGLASS_SHAFTLINER_GUIDE_URL);

    for (const row of GP_SOURCE_ROWS) {
      expect(docs, row.id).toContain(row.id);
      expect(docs, row.sourceUrl).toContain(row.sourceUrl);
    }

    for (const boundary of [...PROTECTED_NEGATIVE_BOUNDARIES, ...ROW_BOUNDARIES]) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
