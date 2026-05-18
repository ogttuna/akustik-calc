import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RockwoolAssemblyFamily = "ESS" | "ISS" | "IWS";

type RockwoolProduct = "AFB" | "Cavityrock" | "Comfortbatt";

type RockwoolSourceRow = {
  assemblyNumber: string;
  family: RockwoolAssemblyFamily;
  finishMaterial: string;
  firstMissingPrerequisite: string;
  metricContext: "stc_only" | "stc_oitc";
  oitc: number | null;
  product: RockwoolProduct | readonly RockwoolProduct[];
  productThickness: string;
  protectedBoundary: string;
  reportNumber: string | null;
  resilientOrExteriorMounting: string | null;
  sourceLocator: string;
  spacing: string;
  stc: number;
  studOrFrame: string;
};

const ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  status:
    "rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_URL =
  "https://www.rockwool.com/siteassets/o2-rockwool/documentation/technical-guides/commercial/acoustic-wall-assemblies-catalog-techincal-guide.pdf";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const ROCKWOOL_SOURCE_ROWS: readonly RockwoolSourceRow[] = [
  {
    assemblyNumber: "ISS-00",
    family: "ISS",
    finishMaterial: "5/8 in gypsum",
    firstMissingPrerequisite:
      "stc_oitc_metric_policy_exact_steel_stud_topology_material_mapping_tolerance_owner_and_paired_visible_tests",
    metricContext: "stc_oitc",
    oitc: 28,
    product: "AFB",
    productThickness: "1.5 in",
    protectedBoundary:
      "iss_00_is_single_steel_stud_stc_oitc_context_not_uris_2006_two_cavity_triple_leaf_runtime_truth",
    reportNumber: "J2247-13-303-11-R0",
    resilientOrExteriorMounting: null,
    sourceLocator: "ROCKWOOL Acoustic Wall Assemblies Catalog p.3 / summary card",
    spacing: "16 in oc",
    stc: 43,
    studOrFrame: "2 1/2 in steel stud"
  },
  {
    assemblyNumber: "ISS-22",
    family: "ISS",
    finishMaterial: "1/2 in gypsum, 2x 1/2 in gypsum on single side",
    firstMissingPrerequisite:
      "asymmetric_board_leaf_policy_stc_metric_rejection_or_conversion_and_steel_stud_mapping_tolerance_owner",
    metricContext: "stc_only",
    oitc: null,
    product: "AFB",
    productThickness: "1.5 in",
    protectedBoundary:
      "iss_22_asymmetric_single_stud_row_must_not_promote_double_leaf_or_triple_leaf_without_side_asymmetry_inputs",
    reportNumber: "RAL-TL90-186",
    resilientOrExteriorMounting: null,
    sourceLocator: "ROCKWOOL Acoustic Wall Assemblies Catalog p.17 / ISS-22 card",
    spacing: "24 in oc",
    stc: 50,
    studOrFrame: "2 1/2 in steel stud"
  },
  {
    assemblyNumber: "ISS-39",
    family: "ISS",
    finishMaterial: "2x 5/8 in gypsum",
    firstMissingPrerequisite:
      "double_board_steel_stud_column_mapping_stc_metric_policy_afb_alias_decision_and_visible_tests",
    metricContext: "stc_only",
    oitc: null,
    product: "AFB",
    productThickness: "3 in",
    protectedBoundary:
      "iss_39_high_stc_single_frame_row_does_not_replace_live_knauf_or_triple_leaf_source_families_without_mapping",
    reportNumber: "RAL-TL96-268",
    resilientOrExteriorMounting: null,
    sourceLocator: "ROCKWOOL Acoustic Wall Assemblies Catalog p.23 / ISS-39 card",
    spacing: "24 in oc",
    stc: 57,
    studOrFrame: "3 5/8 in steel stud"
  },
  {
    assemblyNumber: "IWS-04",
    family: "IWS",
    finishMaterial: "2x 5/8 in gypsum",
    firstMissingPrerequisite:
      "wood_stud_single_frame_source_mapping_report_number_completion_stc_oitc_metric_policy_and_timber_anchor_precedence",
    metricContext: "stc_oitc",
    oitc: 32,
    product: "AFB",
    productThickness: "3 in",
    protectedBoundary:
      "iws_04_single_wood_stud_row_must_not_reopen_british_gypsum_a046006_or_generic_timber_routes_without_mapping",
    reportNumber: null,
    resilientOrExteriorMounting: "single stud wall configuration",
    sourceLocator: "ROCKWOOL Acoustic Wall Assemblies Catalog p.25 / IWS-04 card",
    spacing: "16 in oc",
    stc: 40,
    studOrFrame: "2 x 4 wood stud"
  },
  {
    assemblyNumber: "ESS-05",
    family: "ESS",
    finishMaterial: "5/8 in gypsum, 5/8 in gypsum sheathing with air barrier",
    firstMissingPrerequisite:
      "exterior_wall_stc_oitc_metric_policy_comfortbatt_cavityrock_alias_decision_z_girt_cladding_and_air_barrier_mapping",
    metricContext: "stc_oitc",
    oitc: 32,
    product: ["Comfortbatt", "Cavityrock"],
    productThickness: "3.5 in batt plus 2 in continuous insulation",
    protectedBoundary:
      "ess_05_exterior_envelope_row_does_not_promote_interior_wall_floor_masonry_or_triple_leaf_routes",
    reportNumber: "H5383.03-113-11-R0",
    resilientOrExteriorMounting: "Cavityrock on Z-girts, no cladding",
    sourceLocator: "ROCKWOOL Acoustic Wall Assemblies Catalog p.37 / ESS-05 card",
    spacing: "16 in oc",
    stc: 49,
    studOrFrame: "3 5/8 in steel stud"
  }
] as const;

const SOURCE_FAMILY_COVERAGE = {
  extractedFamilies: ["ISS", "IWS", "ESS"],
  catalogReportedFamilyRanges: {
    ESS: "STC 43-52",
    ISS: "STC 40-57",
    IWS: "STC 36-66"
  },
  officialGuideSaysRowsInclude:
    "component_descriptions_stc_oitc_r_values_if_available_rockwool_test_number_and_rockwool_products",
  sourceAccessGap:
    "transmission_loss_curve_data_requires_follow_up_with_rockwool_technical_services_or_other_source_packet_before_dyn_echo_runtime_calibration"
} as const;

const METRIC_POLICY = {
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directRwImportSelectedNow: false,
  directStcToRwEquivalenceOwned: false,
  oitcImportSelectedNow: false,
  reportNumberIsCurvePacket: false,
  sourceMetrics: ["STC", "OITC", "test_report_number"],
  sourcePacketStillMissing: ["one_third_octave_transmission_loss_curves", "iso_717_rw_derivation", "tolerance_owner"]
} as const;

const MATERIAL_ALIAS_POLICY = [
  {
    aliasDecision: "context_only_until_density_flow_resistivity_thickness_and_source_family_owner_exist",
    localInput: "rockwool",
    sourceProduct: "AFB"
  },
  {
    aliasDecision: "context_only_exterior_batt_not_generic_interior_absorber",
    localInput: "rockwool",
    sourceProduct: "Comfortbatt"
  },
  {
    aliasDecision: "context_only_continuous_exterior_board_not_cavity_batt",
    localInput: "rockwool",
    sourceProduct: "Cavityrock"
  },
  {
    aliasDecision: "blocked_no_global_absorber_coalescing",
    localInput: "glass_fiber",
    sourceProduct: "AFB"
  },
  {
    aliasDecision: "blocked_no_generic_mineral_wool_runtime_equivalence",
    localInput: "generic_mineral_wool",
    sourceProduct: "AFB"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "rockwool_acoustic_catalog_stc_oitc_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "rockwool_afb_comfortbatt_cavityrock_do_not_coalesce_with_glass_fiber_or_generic_mineral_wool_without_mapping_tolerance",
  "rockwool_single_stud_iss_iws_rows_do_not_replace_nrc_2024_internal_board_glass_fiber_triple_leaf_comparator",
  "rockwool_catalog_rows_do_not_reopen_closed_british_gypsum_or_knauf_rows_without_new_gate_b_mapping",
  "rockwool_catalog_rows_do_not_promote_floor_only_generated_floor_masonry_lined_heavy_or_no_stud_routes",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMapping: ["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts"
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

describe("ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime source row extraction and selects Gate B mapping", () => {
    expect(ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      status:
        "rockwool_acoustic_wall_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts representative ISS, IWS, and ESS row locators with topology and metrics", () => {
    expect(ROCKWOOL_SOURCE_ROWS.map((row) => row.assemblyNumber)).toEqual([
      "ISS-00",
      "ISS-22",
      "ISS-39",
      "IWS-04",
      "ESS-05"
    ]);
    expect(new Set(ROCKWOOL_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<RockwoolAssemblyFamily>(["ISS", "IWS", "ESS"])
    );
    expect(ROCKWOOL_SOURCE_ROWS.map((row) => row.stc)).toEqual([43, 50, 57, 40, 49]);
    expect(ROCKWOOL_SOURCE_ROWS.map((row) => row.oitc)).toEqual([28, null, null, 32, 32]);
    expect(ROCKWOOL_SOURCE_ROWS.every((row) => row.sourceLocator.includes("ROCKWOOL Acoustic Wall Assemblies Catalog"))).toBe(
      true
    );
    expect(ROCKWOOL_SOURCE_ROWS.every((row) => row.firstMissingPrerequisite.length > 80)).toBe(true);
  });

  it("keeps STC/OITC/report-number source metrics out of DynEcho runtime metrics", () => {
    expect(SOURCE_FAMILY_COVERAGE).toEqual({
      extractedFamilies: ["ISS", "IWS", "ESS"],
      catalogReportedFamilyRanges: {
        ESS: "STC 43-52",
        ISS: "STC 40-57",
        IWS: "STC 36-66"
      },
      officialGuideSaysRowsInclude:
        "component_descriptions_stc_oitc_r_values_if_available_rockwool_test_number_and_rockwool_products",
      sourceAccessGap:
        "transmission_loss_curve_data_requires_follow_up_with_rockwool_technical_services_or_other_source_packet_before_dyn_echo_runtime_calibration"
    });
    expect(METRIC_POLICY).toEqual({
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directRwImportSelectedNow: false,
      directStcToRwEquivalenceOwned: false,
      oitcImportSelectedNow: false,
      reportNumberIsCurvePacket: false,
      sourceMetrics: ["STC", "OITC", "test_report_number"],
      sourcePacketStillMissing: ["one_third_octave_transmission_loss_curves", "iso_717_rw_derivation", "tolerance_owner"]
    });
  });

  it("blocks local material aliasing between ROCKWOOL products, local rockwool, mineral wool, and glass-fiber", () => {
    expect(MATERIAL_ALIAS_POLICY.map((entry) => `${entry.sourceProduct}:${entry.localInput}:${entry.aliasDecision}`)).toEqual([
      "AFB:rockwool:context_only_until_density_flow_resistivity_thickness_and_source_family_owner_exist",
      "Comfortbatt:rockwool:context_only_exterior_batt_not_generic_interior_absorber",
      "Cavityrock:rockwool:context_only_continuous_exterior_board_not_cavity_batt",
      "AFB:glass_fiber:blocked_no_global_absorber_coalescing",
      "AFB:generic_mineral_wool:blocked_no_generic_mineral_wool_runtime_equivalence"
    ]);
    expect(MATERIAL_ALIAS_POLICY.every((entry) => !entry.aliasDecision.includes("runtime_exact"))).toBe(true);
  });

  it("protects the original split-rockwool defect and other near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMapping: ["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(6);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_fix_the_uris_2006_split_rockwool");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_coalesce_with_glass_fiber");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_promote_floor_only_generated_floor_masonry");
    expect(liveResult.metrics.estimatedRwDb).toBe(53);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A.sliceId);
    expect(docs).toContain(ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A.status);
    expect(docs).toContain(ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A.selectedNextAction);
    expect(docs).toContain(ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_GATE_A.selectedNextFile);
    expect(docs).toContain(SOURCE_URL);

    for (const row of ROCKWOOL_SOURCE_ROWS) {
      expect(docs, row.assemblyNumber).toContain(row.assemblyNumber);
    }

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
