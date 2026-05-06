import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type MetricValue = number | { max: number; min: number };

type UsgSourceFamily = "floor_ceiling_levelrock" | "wall_partition_steel_framed";

type UsgSourceRow = {
  blockedTargetOutputs: readonly string[];
  classification: "needs_gate_b_mapping_tolerance_decision";
  family: UsgSourceFamily;
  firstMissingRequirement: string;
  id: string;
  importDisposition: "no_runtime_import";
  localMappingStatus:
    | "blocked_levelrock_srm_srb_i_joist_truss_mapping_missing"
    | "blocked_sheetrock_thermafiber_steel_stud_rc_channel_mapping_missing";
  metricContext: "stc_iic" | "stc_test_number";
  pairedEngineTestsBeforeNewRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  protectedBoundary: string;
  reportedMetrics: {
    iic?: MetricValue;
    stc: MetricValue;
    testNumber?: string;
  };
  sourceLocator: string;
  topologySummary: string;
};

const USG_ACOUSTICAL_ASSEMBLIES_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "usg_acoustical_assemblies_source_pack_extraction_v1",
  status: "usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
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
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const USG_SOURCE_ROWS: readonly UsgSourceRow[] = [
  {
    blockedTargetOutputs: ["Ln,w", "field_floor_outputs_until_metric_policy_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "map_i_joist_srm25_carpet_levelrock_floor_ceiling_topology_stc_iic_metric_policy_material_tolerance_and_visible_tests_before_import",
    id: "LEVELROCK_I_JOIST_SRM25_CARPET",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_levelrock_srm_srb_i_joist_truss_mapping_missing",
    metricContext: "stc_iic",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_i_joist_srm25_carpet_floor_value_or_rejection_pin",
      "engine_usg_i_joist_srm25_carpet_rejects_wall_and_generated_floor_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_i_joist_srm25_carpet_route_card_source_context",
      "web_usg_i_joist_srm25_carpet_report_keeps_metric_context_explicit"
    ],
    protectedBoundary: "usg_levelrock_i_joist_carpet_iic_stc_row_is_floor_ceiling_context_only",
    reportedMetrics: { iic: 77, stc: 65 },
    sourceLocator: "USG SA200 p.12 / LEVELROCK Sound Isolation System table",
    topologySummary: "I-Joist with SRM-25 Sound Reduction Mat and carpet finish"
  },
  {
    blockedTargetOutputs: ["Ln,w", "field_floor_outputs_until_metric_policy_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "map_i_joist_srm25_sheet_vinyl_range_metrics_and_levelrock_floor_ceiling_topology_before_import_or_explicit_rejection",
    id: "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_levelrock_srm_srb_i_joist_truss_mapping_missing",
    metricContext: "stc_iic",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_i_joist_srm25_sheet_vinyl_range_value_or_rejection_pin",
      "engine_usg_i_joist_srm25_sheet_vinyl_rejects_single_value_collapse"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_i_joist_srm25_sheet_vinyl_range_context",
      "web_usg_i_joist_srm25_sheet_vinyl_report_blocks_exact_value_copy"
    ],
    protectedBoundary: "usg_levelrock_range_metrics_do_not_become_single_exact_dyn_echo_values",
    reportedMetrics: { iic: { max: 58, min: 55 }, stc: { max: 64, min: 60 } },
    sourceLocator: "USG SA200 p.12 / LEVELROCK Sound Isolation System table",
    topologySummary: "I-Joist with SRM-25 Sound Reduction Mat and sheet vinyl finish"
  },
  {
    blockedTargetOutputs: ["Ln,w", "field_floor_outputs_until_metric_policy_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "map_i_joist_srb_wood_laminate_floor_ceiling_topology_and_srb_material_before_using_iic_stc_context",
    id: "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_levelrock_srm_srb_i_joist_truss_mapping_missing",
    metricContext: "stc_iic",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_i_joist_srb_wood_laminate_value_or_rejection_pin",
      "engine_usg_i_joist_srb_wood_laminate_rejects_srm25_substitution"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_i_joist_srb_wood_laminate_route_card_source_context",
      "web_usg_i_joist_srb_wood_laminate_report_keeps_srb_material_explicit"
    ],
    protectedBoundary: "usg_srb_board_rows_do_not_substitute_for_srm25_mat_rows",
    reportedMetrics: { iic: 61, stc: 65 },
    sourceLocator: "USG SA200 p.12 / LEVELROCK Sound Isolation System table",
    topologySummary: "I-Joist with SRB Sound Reduction Board and wood laminate finish"
  },
  {
    blockedTargetOutputs: ["Ln,w", "field_floor_outputs_until_metric_policy_owner_exists"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "floor_ceiling_levelrock",
    firstMissingRequirement:
      "map_truss_srm25_ceramic_tile_topology_and_metric_policy_before_any_floor_import_or_generated_floor_promotion",
    id: "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_levelrock_srm_srb_i_joist_truss_mapping_missing",
    metricContext: "stc_iic",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_truss_srm25_ceramic_tile_value_or_rejection_pin",
      "engine_usg_truss_srm25_ceramic_tile_rejects_i_joist_substitution"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_truss_srm25_ceramic_tile_route_card_source_context",
      "web_usg_truss_srm25_ceramic_tile_report_keeps_truss_context_explicit"
    ],
    protectedBoundary: "usg_truss_rows_do_not_substitute_for_i_joist_or_open_web_generated_floor_routes",
    reportedMetrics: { iic: 56, stc: 61 },
    sourceLocator: "USG SA200 p.12 / LEVELROCK Sound Isolation System table",
    topologySummary: "Truss with SRM-25 Sound Reduction Mat and ceramic tile finish"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "wall_partition_steel_framed",
    firstMissingRequirement:
      "map_sheetrock_firecode_panel_steel_stud_spacing_and_stc_test_number_to_live_wall_topology_or_explicitly_reject",
    id: "USG_STEEL_FRAMED_A1",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_sheetrock_thermafiber_steel_stud_rc_channel_mapping_missing",
    metricContext: "stc_test_number",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_steel_framed_a1_wall_value_or_rejection_pin",
      "engine_usg_steel_framed_a1_rejects_knauf_lsf_anchor_replacement"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_steel_framed_a1_route_card_source_context",
      "web_usg_steel_framed_a1_report_blocks_field_output_promotion"
    ],
    protectedBoundary: "usg_a1_stc_row_does_not_override_existing_lsf_or_generic_wall_routes",
    reportedMetrics: { stc: 40, testNumber: "USG-860808" },
    sourceLocator: "USG SA200 p.14 / Partitions Steel Framed A-1",
    topologySummary:
      "5/8 in Sheetrock Firecode Core gypsum panels on 3-5/8 in 25 gauge steel studs at 24 in oc"
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    classification: "needs_gate_b_mapping_tolerance_decision",
    family: "wall_partition_steel_framed",
    firstMissingRequirement:
      "map_sheetrock_firecode_c_thermafiber_safb_rc_channel_one_side_and_stc_test_number_before_lsf_wall_import",
    id: "USG_STEEL_FRAMED_A8",
    importDisposition: "no_runtime_import",
    localMappingStatus: "blocked_sheetrock_thermafiber_steel_stud_rc_channel_mapping_missing",
    metricContext: "stc_test_number",
    pairedEngineTestsBeforeNewRuntime: [
      "engine_usg_steel_framed_a8_wall_value_or_rejection_pin",
      "engine_usg_steel_framed_a8_rejects_rockwool_triple_leaf_and_knauf_substitution"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_usg_steel_framed_a8_route_card_source_context",
      "web_usg_steel_framed_a8_report_blocks_resilient_channel_overread"
    ],
    protectedBoundary: "usg_a8_resilient_channel_wall_row_does_not_promote_triple_leaf_or_near_source_lsf_routes",
    reportedMetrics: { stc: 58, testNumber: "RAL-TL-83-215" },
    sourceLocator: "USG SA200 p.15 / Partitions Steel Framed A-8",
    topologySummary:
      "1/2 in Sheetrock Firecode C Core gypsum panels, 3-5/8 in 20 gauge studs, 3 in Thermafiber SAFB, RC-1 channel one side"
  }
] as const;

const SOURCE_FAMILY_COVERAGE = {
  extractedFamilies: ["floor_ceiling_levelrock", "wall_partition_steel_framed"],
  sourceAccess: {
    author: "United States Gypsum Company",
    pages: 40,
    pdfTitle: "USG Acoustical Assemblies Brochure (English) - SA200",
    sourceUrl: SOURCE_URL
  },
  sourcePages: [
    "p.5_STC_definition",
    "p.6_substitution_warning",
    "p.12_levelrock_sound_isolation_system_table",
    "p.14_to_p15_steel_framed_partition_rows"
  ],
  sourceRowsInclude:
    "framing_sound_barrier_floor_finish_iic_stc_for_levelrock_and_description_stc_test_number_fire_rating_reference_for_wall_partitions"
} as const;

const METRIC_POLICY = {
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directIicToLnwEquivalenceOwned: false,
  directLnwImportSelectedNow: false,
  directRwImportSelectedNow: false,
  directStcToRwEquivalenceOwned: false,
  rangeMetricCollapseAllowed: false,
  sourceMetrics: ["STC", "IIC", "test_number", "UL_design", "ARL_index"],
  sourcePacketStillMissing: [
    "one_third_octave_airborne_transmission_loss_curves",
    "impact_spectrum_or_iso_lnw_derivation",
    "iso_717_rw_lnw_policy",
    "tolerance_owner"
  ]
} as const;

const MATERIAL_AND_TOPOLOGY_POLICY = [
  {
    aliasDecision: "blocked_until_material_stack_and_thickness_owner_exists",
    localInput: "generic_floor_underlayment",
    sourceMaterial: "LEVELROCK"
  },
  {
    aliasDecision: "blocked_mat_not_board_and_not_generic_resilient_layer",
    localInput: "resilient_mat",
    sourceMaterial: "SRM-25"
  },
  {
    aliasDecision: "blocked_board_not_mat_and_not_generic_resilient_layer",
    localInput: "resilient_board",
    sourceMaterial: "SRB"
  },
  {
    aliasDecision: "blocked_truss_i_joist_open_web_roles_must_not_coalesce",
    localInput: "generic_joist_or_open_web",
    sourceMaterial: "I-Joist_or_Truss"
  },
  {
    aliasDecision: "blocked_sheetrock_firecode_and_generic_gypsum_require_mapping_tolerance",
    localInput: "gypsum_board",
    sourceMaterial: "SHEETROCK_FIRECODE"
  },
  {
    aliasDecision: "blocked_thermafiber_safb_not_rockwool_or_generic_mineral_wool_truth",
    localInput: "rockwool",
    sourceMaterial: "THERMAFIBER_SAFB"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "usg_stc_iic_rows_do_not_directly_promote_dyn_echo_rw_lnw_or_field_outputs",
  "usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth",
  "usg_levelrock_srm_srb_i_joist_truss_rows_do_not_promote_generated_floor_without_mapping_tolerance",
  "usg_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors",
  "usg_sheetrock_thermafiber_rows_do_not_coalesce_with_generic_gypsum_rockwool_or_glass_fiber_without_mapping",
  "usg_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMapping: [
    "LEVELROCK_I_JOIST_SRM25_CARPET",
    "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
    "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
    "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
    "USG_STEEL_FRAMED_A1",
    "USG_STEEL_FRAMED_A8"
  ],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts"
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

describe("USG Acoustical Assemblies source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source row extraction and selects Gate B mapping", () => {
    expect(USG_ACOUSTICAL_ASSEMBLIES_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "usg_acoustical_assemblies_source_pack_extraction_v1",
      status: "usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts representative floor/ceiling and wall partition source rows with topology and metrics", () => {
    expect(USG_SOURCE_ROWS.map((row) => row.id)).toEqual([
      "LEVELROCK_I_JOIST_SRM25_CARPET",
      "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
      "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
      "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
      "USG_STEEL_FRAMED_A1",
      "USG_STEEL_FRAMED_A8"
    ]);
    expect(new Set(USG_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<UsgSourceFamily>(["floor_ceiling_levelrock", "wall_partition_steel_framed"])
    );
    expect(USG_SOURCE_ROWS.map((row) => row.reportedMetrics.stc)).toEqual([
      65,
      { max: 64, min: 60 },
      65,
      61,
      40,
      58
    ]);
    expect(USG_SOURCE_ROWS.filter((row) => row.metricContext === "stc_iic")).toHaveLength(4);
    expect(USG_SOURCE_ROWS.filter((row) => row.metricContext === "stc_test_number")).toHaveLength(2);
    expect(USG_SOURCE_ROWS.every((row) => row.sourceLocator.includes("USG SA200"))).toBe(true);
    expect(USG_SOURCE_ROWS.every((row) => row.firstMissingRequirement.length > 90)).toBe(true);
  });

  it("keeps STC/IIC/range/test-number source metrics out of DynEcho runtime metrics", () => {
    expect(SOURCE_FAMILY_COVERAGE).toEqual({
      extractedFamilies: ["floor_ceiling_levelrock", "wall_partition_steel_framed"],
      sourceAccess: {
        author: "United States Gypsum Company",
        pages: 40,
        pdfTitle: "USG Acoustical Assemblies Brochure (English) - SA200",
        sourceUrl: SOURCE_URL
      },
      sourcePages: [
        "p.5_STC_definition",
        "p.6_substitution_warning",
        "p.12_levelrock_sound_isolation_system_table",
        "p.14_to_p15_steel_framed_partition_rows"
      ],
      sourceRowsInclude:
        "framing_sound_barrier_floor_finish_iic_stc_for_levelrock_and_description_stc_test_number_fire_rating_reference_for_wall_partitions"
    });
    expect(METRIC_POLICY).toEqual({
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directIicToLnwEquivalenceOwned: false,
      directLnwImportSelectedNow: false,
      directRwImportSelectedNow: false,
      directStcToRwEquivalenceOwned: false,
      rangeMetricCollapseAllowed: false,
      sourceMetrics: ["STC", "IIC", "test_number", "UL_design", "ARL_index"],
      sourcePacketStillMissing: [
        "one_third_octave_airborne_transmission_loss_curves",
        "impact_spectrum_or_iso_lnw_derivation",
        "iso_717_rw_lnw_policy",
        "tolerance_owner"
      ]
    });
  });

  it("blocks material and topology coalescing across Levelrock, Sheetrock, Thermafiber, joist, and truss roles", () => {
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => `${entry.sourceMaterial}:${entry.localInput}`)).toEqual([
      "LEVELROCK:generic_floor_underlayment",
      "SRM-25:resilient_mat",
      "SRB:resilient_board",
      "I-Joist_or_Truss:generic_joist_or_open_web",
      "SHEETROCK_FIRECODE:gypsum_board",
      "THERMAFIBER_SAFB:rockwool"
    ]);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.every((entry) => entry.aliasDecision.startsWith("blocked"))).toBe(true);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.join("\n")).not.toContain("runtime_exact");
  });

  it("protects the split-rockwool defect and all USG near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMapping: [
        "LEVELROCK_I_JOIST_SRM25_CARPET",
        "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
        "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
        "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
        "USG_STEEL_FRAMED_A1",
        "USG_STEEL_FRAMED_A8"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(7);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_directly_promote_dyn_echo_rw_lnw");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_become_wall_or_triple_leaf_truth");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_fix_the_uris_2006_split_rockwool");
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(USG_ACOUSTICAL_ASSEMBLIES_GATE_A.sliceId);
    expect(docs).toContain(USG_ACOUSTICAL_ASSEMBLIES_GATE_A.status);
    expect(docs).toContain(USG_ACOUSTICAL_ASSEMBLIES_GATE_A.selectedNextAction);
    expect(docs).toContain(USG_ACOUSTICAL_ASSEMBLIES_GATE_A.selectedNextFile);
    expect(docs).toContain(SOURCE_URL);

    for (const row of USG_SOURCE_ROWS) {
      expect(docs, row.id).toContain(row.id);
    }

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
