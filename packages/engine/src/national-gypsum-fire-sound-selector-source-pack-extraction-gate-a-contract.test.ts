import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NationalGypsumSourceFamily =
  | "area_separation_wall"
  | "roof_ceiling_negative_boundary"
  | "shaftwall"
  | "steel_partition";

type NationalGypsumMetricContext = "stc_na_negative_boundary" | "stc_test_report_locator";

type NationalGypsumSourceRow = {
  accessibility: "Both Sides" | "N/A" | "One Side";
  acousticTestReportLocatorVisible: boolean;
  blockedTargetOutputs: readonly string[];
  buildSummary: string;
  exactReportPayloadCaptured: false;
  family: NationalGypsumSourceFamily;
  fireRating: string;
  firstMissingRequirement: string;
  framing: string;
  id: string;
  importDisposition: "no_runtime_import";
  insulation: string;
  localMappingStatus:
    | "blocked_fire_shield_soundbreak_shaftliner_glass_fiber_and_rc_channel_mapping_missing"
    | "blocked_roof_ceiling_optional_insulation_and_resilient_channel_negative_boundary"
    | "blocked_shaftwall_or_area_separation_topology_mapping_missing";
  metricContext: NationalGypsumMetricContext;
  pairedEngineTestsBeforeRuntime: readonly string[];
  pairedWebTestsBeforeVisibleMovement: readonly string[];
  protectedBoundary: string;
  sourceLocator: string;
  sourceUrl: string;
  stc: number | "N/A";
  studGauge: string | null;
  studSize: string;
  studSpacing: string;
  ulDesign: string;
};

const NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts",
  sliceId: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  status:
    "national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const SELECTOR_URL = "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies";
const PRESS_RELEASE_URL =
  "https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector";
const V438_RC1_URL =
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/v438-u465-358-20eq-m24-rc1";
const W419_URL = "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w419-u499-212-25ga-ct-sb";
const W469_URL =
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w469-358-16ga-metalstuds-16oc-rc1-sb";
const W454_URL = "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w454-3hr-1xinsul";
const P540_URL = "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/p540-steel-truss-roof-58c";

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const NATIONAL_GYPSUM_SOURCE_ROWS: readonly NationalGypsumSourceRow[] = [
  {
    accessibility: "Both Sides",
    acousticTestReportLocatorVisible: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "20 gauge EQ 3-5/8 in steel studs at 24 in oc, 3-1/2 in glass fiber, Fire-Shield board side 1, Fire-Shield board on 1/2 in resilient channels side 2",
    exactReportPayloadCaptured: false,
    family: "steel_partition",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "v438_rc1_needs_acoustical_test_report_payload_curve_or_metric_policy_fire_shield_glass_fiber_resilient_channel_mapping_tolerance_owner_negative_boundaries_and_paired_visible_tests",
    framing: "Steel",
    id: "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
    importDisposition: "no_runtime_import",
    insulation: "Glass Fiber",
    localMappingStatus: "blocked_fire_shield_soundbreak_shaftliner_glass_fiber_and_rc_channel_mapping_missing",
    metricContext: "stc_test_report_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_national_gypsum_v438_rc1_value_or_rejection_pin",
      "engine_national_gypsum_v438_rc1_rejects_usg_knauf_and_triple_leaf_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_national_gypsum_v438_rc1_route_card_source_context",
      "web_national_gypsum_v438_rc1_report_keeps_stc_context_explicit"
    ],
    protectedBoundary:
      "national_gypsum_v438_rc1_stc50_is_steel_partition_context_only_not_lsf_runtime_replacement",
    sourceLocator: "National Gypsum Fire & Sound Selector / V438, U465 / 20EQ M24 RC1",
    sourceUrl: V438_RC1_URL,
    stc: 50,
    studGauge: "20 Gauge EQ",
    studSize: "3-5/8 in",
    studSpacing: "24 in oc",
    ulDesign: "V438, U465"
  },
  {
    accessibility: "One Side",
    acousticTestReportLocatorVisible: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "25 gauge 2-1/2 in CT studs at 24 in oc, 1-1/2 in glass fiber, eXP Shaftliner side 1, SoundBreak XP Fire-Shield side 2",
    exactReportPayloadCaptured: false,
    family: "shaftwall",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "w419_needs_shaftwall_ct_stud_shaftliner_soundbreak_xp_material_mapping_stc_metric_policy_tolerance_owner_and_visible_tests_before_any_wall_import",
    framing: "Steel - Non-Load-Bearing Walls",
    id: "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
    importDisposition: "no_runtime_import",
    insulation: "Glass Fiber",
    localMappingStatus: "blocked_shaftwall_or_area_separation_topology_mapping_missing",
    metricContext: "stc_test_report_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w419_shaftwall_value_or_rejection_pin",
      "engine_national_gypsum_w419_rejects_generic_steel_stud_and_soundbreak_coalescing"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_national_gypsum_w419_shaftwall_route_card_context",
      "web_national_gypsum_w419_report_blocks_field_output_promotion"
    ],
    protectedBoundary:
      "national_gypsum_w419_shaftwall_stc44_does_not_promote_generic_wall_or_double_leaf_routes",
    sourceLocator: "National Gypsum Fire & Sound Selector / W419, U499 / 25ga CT SoundBreak",
    sourceUrl: W419_URL,
    stc: 44,
    studGauge: "25 Gauge",
    studSize: "2-1/2 in",
    studSpacing: "24 in oc",
    ulDesign: "W419, U499"
  },
  {
    accessibility: "Both Sides",
    acousticTestReportLocatorVisible: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "16 gauge 3-5/8 in load-bearing steel studs at 16 in oc, 3-1/2 in glass fiber, SoundBreak XP Fire-Shield side 1, Fire-Shield board on 1/2 in resilient channels side 2",
    exactReportPayloadCaptured: false,
    family: "steel_partition",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "w469_needs_load_bearing_stud_mapping_soundbreak_fire_shield_glass_fiber_rc_channel_metric_policy_report_payload_tolerance_and_visible_tests",
    framing: "Steel - Load-Bearing Walls",
    id: "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
    importDisposition: "no_runtime_import",
    insulation: "Glass Fiber",
    localMappingStatus: "blocked_fire_shield_soundbreak_shaftliner_glass_fiber_and_rc_channel_mapping_missing",
    metricContext: "stc_test_report_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w469_value_or_rejection_pin",
      "engine_national_gypsum_w469_does_not_replace_existing_lsf_or_usg_rows"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_national_gypsum_w469_route_card_lab_context",
      "web_national_gypsum_w469_report_keeps_load_bearing_context_explicit"
    ],
    protectedBoundary:
      "national_gypsum_w469_load_bearing_stc51_must_not_replace_non_load_bearing_lsf_anchors",
    sourceLocator: "National Gypsum Fire & Sound Selector / W469 / 16ga RC1 SoundBreak",
    sourceUrl: W469_URL,
    stc: 51,
    studGauge: "16 Gauge",
    studSize: "3-5/8 in",
    studSpacing: "16 in oc",
    ulDesign: "W469"
  },
  {
    accessibility: "Both Sides",
    acousticTestReportLocatorVisible: true,
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "2 layers of 1 in eXP Shaftliner or Shaftliner XP between 2 in H-studs at 24 in oc, 5/8 in Fire-Shield C each side, 2x4 wood studs each side, glass fiber one side",
    exactReportPayloadCaptured: false,
    family: "area_separation_wall",
    fireRating: "3 Hour",
    firstMissingRequirement:
      "w454_needs_area_separation_h_stud_shaftliner_wood_stud_dual_frame_mapping_metric_policy_tolerance_owner_and_negative_boundaries",
    framing: "Steel - Non-Load-Bearing Walls",
    id: "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
    importDisposition: "no_runtime_import",
    insulation: "Glass Fiber",
    localMappingStatus: "blocked_shaftwall_or_area_separation_topology_mapping_missing",
    metricContext: "stc_test_report_locator",
    pairedEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w454_value_or_rejection_pin",
      "engine_national_gypsum_w454_rejects_triple_leaf_and_no_stud_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_national_gypsum_w454_route_card_area_separation_context",
      "web_national_gypsum_w454_report_blocks_simple_wall_promotion"
    ],
    protectedBoundary:
      "national_gypsum_w454_area_separation_wall_is_not_simple_stud_wall_or_triple_leaf_truth",
    sourceLocator: "National Gypsum Fire & Sound Selector / W454 / 3hr 1x insulation",
    sourceUrl: W454_URL,
    stc: 43,
    studGauge: null,
    studSize: "2 in H-stud plus 2x4 wood studs",
    studSpacing: "24 in oc H-studs and 16 in oc wood studs",
    ulDesign: "W454"
  },
  {
    accessibility: "N/A",
    acousticTestReportLocatorVisible: false,
    blockedTargetOutputs: ["Ln,w", "Rw", "R'w", "Dn,w", "DnT,w", "DnT,A"],
    buildSummary:
      "prefabricated light gauge steel trusses at 24 in oc, optional insulation, roofing over metal deck, Fire-Shield C ceiling on resilient channels",
    exactReportPayloadCaptured: false,
    family: "roof_ceiling_negative_boundary",
    fireRating: "1 Hour",
    firstMissingRequirement:
      "p540_has_stc_na_and_roof_ceiling_topology_so_it_can_only_be_negative_boundary_until_sound_metric_and_floor_roof_mapping_exist",
    framing: "Steel truss roof-ceiling",
    id: "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA",
    importDisposition: "no_runtime_import",
    insulation: "Optional",
    localMappingStatus: "blocked_roof_ceiling_optional_insulation_and_resilient_channel_negative_boundary",
    metricContext: "stc_na_negative_boundary",
    pairedEngineTestsBeforeRuntime: [
      "engine_national_gypsum_p540_stc_na_negative_boundary",
      "engine_national_gypsum_p540_rejects_floor_wall_or_generated_floor_promotion"
    ],
    pairedWebTestsBeforeVisibleMovement: [
      "web_national_gypsum_p540_stc_na_route_card_context",
      "web_national_gypsum_p540_report_keeps_no_runtime_metric"
    ],
    protectedBoundary:
      "national_gypsum_p540_stc_na_roof_ceiling_row_does_not_promote_floor_wall_or_impact_outputs",
    sourceLocator: "National Gypsum Fire & Sound Selector / P540 / steel truss roof 5/8C",
    sourceUrl: P540_URL,
    stc: "N/A",
    studGauge: null,
    studSize: "N/A",
    studSpacing: "N/A",
    ulDesign: "P540"
  }
] as const;

const SELECTOR_SURFACE_COVERAGE = {
  acousticTestReportsAdvertised: true,
  accessibleStaticSelectorPageHasOnlySurfaceTitle: true,
  downloadableReportPayloadCapturedNow: false,
  examplesNamedByNationalGypsum: ["V438", "W419"],
  publishedLaunchDate: "2025-01-30",
  selectorClaimsNearlyUlDesigns: 350,
  sourceUrls: [PRESS_RELEASE_URL, SELECTOR_URL]
} as const;

const METRIC_POLICY = {
  blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
  directIicToLnwEquivalenceOwned: false,
  directRwImportSelectedNow: false,
  directStcToRwEquivalenceOwned: false,
  fullBandCurvesCaptured: false,
  reportPdfLocatorIsNotCurvePayload: true,
  sourceMetrics: ["STC", "IIC_context_for_floor_ceiling_only", "ASTM_E90_context", "UL_design", "fire_rating"],
  stcNaRowsStayNegativeBoundary: true,
  toleranceOwnerNamed: false
} as const;

const MATERIAL_AND_TOPOLOGY_POLICY = [
  {
    aliasDecision: "blocked_fire_shield_product_mapping_and_type_c_policy_missing",
    localInput: "gypsum_board",
    sourceMaterial: "Gold Bond Fire-Shield Gypsum Board"
  },
  {
    aliasDecision: "blocked_acoustical_board_not_generic_gypsum_or_mlv",
    localInput: "gypsum_board_or_mlv",
    sourceMaterial: "Gold Bond SoundBreak XP Fire-Shield"
  },
  {
    aliasDecision: "blocked_shaftliner_not_generic_gypsum_leaf",
    localInput: "gypsum_board",
    sourceMaterial: "Gold Bond eXP Shaftliner"
  },
  {
    aliasDecision: "blocked_glass_fiber_does_not_equal_local_rockwool",
    localInput: "rockwool",
    sourceMaterial: "Glass Fiber"
  },
  {
    aliasDecision: "blocked_resilient_channel_not_generic_resilient_bar_without_side_and_spacing_owner",
    localInput: "resilient_bar",
    sourceMaterial: "1/2 in resilient channel"
  },
  {
    aliasDecision: "blocked_ct_h_stud_load_bearing_and_roof_truss_roles_must_not_coalesce",
    localInput: "generic_steel_stud_or_floor_truss",
    sourceMaterial: "CT_stud_H_stud_load_bearing_steel_stud_roof_truss"
  }
] as const;

const PROTECTED_NEGATIVE_BOUNDARIES = [
  "national_gypsum_selector_surface_does_not_count_as_runtime_ready_row_without_report_payload",
  "national_gypsum_stc_rows_do_not_directly_promote_dyn_echo_rw_or_field_outputs",
  "national_gypsum_wall_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors",
  "national_gypsum_glass_fiber_does_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "national_gypsum_soundbreak_fire_shield_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv_without_mapping",
  "national_gypsum_roof_ceiling_or_stc_na_rows_do_not_promote_floor_wall_or_triple_leaf_routes",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_A_DECISION = {
  rowsNeedingGateBMappingOrCloseout: [
    "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
    "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
    "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
    "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
    "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
  ],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
  selectedNextFile:
    "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts"
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

describe("National Gypsum Fire & Sound Selector source-pack extraction Gate A contract", () => {
  it("lands Gate A as no-runtime selector row extraction and selects Gate B mapping", () => {
    expect(NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts",
      sliceId: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      status:
        "national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("extracts representative selector rows with UL design, topology, STC, and report locator context", () => {
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.map((row) => row.id)).toEqual([
      "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
      "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
      "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
      "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
      "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
    ]);
    expect(new Set(NATIONAL_GYPSUM_SOURCE_ROWS.map((row) => row.family))).toEqual(
      new Set<NationalGypsumSourceFamily>([
        "area_separation_wall",
        "roof_ceiling_negative_boundary",
        "shaftwall",
        "steel_partition"
      ])
    );
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.map((row) => row.stc)).toEqual([50, 44, 51, 43, "N/A"]);
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.filter((row) => row.metricContext === "stc_test_report_locator")).toHaveLength(4);
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.every((row) => row.sourceUrl.startsWith("https://www.nationalgypsum.com/"))).toBe(
      true
    );
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.every((row) => row.exactReportPayloadCaptured === false)).toBe(true);
    expect(NATIONAL_GYPSUM_SOURCE_ROWS.every((row) => row.firstMissingRequirement.length > 95)).toBe(true);
  });

  it("keeps selector/report/STC context out of DynEcho runtime metrics", () => {
    expect(SELECTOR_SURFACE_COVERAGE).toEqual({
      acousticTestReportsAdvertised: true,
      accessibleStaticSelectorPageHasOnlySurfaceTitle: true,
      downloadableReportPayloadCapturedNow: false,
      examplesNamedByNationalGypsum: ["V438", "W419"],
      publishedLaunchDate: "2025-01-30",
      selectorClaimsNearlyUlDesigns: 350,
      sourceUrls: [PRESS_RELEASE_URL, SELECTOR_URL]
    });
    expect(METRIC_POLICY).toEqual({
      blockedFieldOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      directIicToLnwEquivalenceOwned: false,
      directRwImportSelectedNow: false,
      directStcToRwEquivalenceOwned: false,
      fullBandCurvesCaptured: false,
      reportPdfLocatorIsNotCurvePayload: true,
      sourceMetrics: ["STC", "IIC_context_for_floor_ceiling_only", "ASTM_E90_context", "UL_design", "fire_rating"],
      stcNaRowsStayNegativeBoundary: true,
      toleranceOwnerNamed: false
    });
  });

  it("blocks material and topology coalescing across Gold Bond, SoundBreak, glass fiber, resilient channel, and shaftwall roles", () => {
    expect(MATERIAL_AND_TOPOLOGY_POLICY.map((entry) => `${entry.sourceMaterial}:${entry.localInput}`)).toEqual([
      "Gold Bond Fire-Shield Gypsum Board:gypsum_board",
      "Gold Bond SoundBreak XP Fire-Shield:gypsum_board_or_mlv",
      "Gold Bond eXP Shaftliner:gypsum_board",
      "Glass Fiber:rockwool",
      "1/2 in resilient channel:resilient_bar",
      "CT_stud_H_stud_load_bearing_steel_stud_roof_truss:generic_steel_stud_or_floor_truss"
    ]);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.every((entry) => entry.aliasDecision.startsWith("blocked"))).toBe(true);
    expect(MATERIAL_AND_TOPOLOGY_POLICY.join("\n")).not.toContain("runtime_exact");
  });

  it("protects the original split-rockwool defect and National Gypsum near-source boundaries", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_A_DECISION).toEqual({
      rowsNeedingGateBMappingOrCloseout: [
        "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
        "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
        "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
        "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
        "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_mapping_tolerance_decision_no_runtime",
      selectedNextFile:
        "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts"
    });
    expect(PROTECTED_NEGATIVE_BOUNDARIES).toHaveLength(7);
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("does_not_count_as_runtime_ready_row");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("do_not_directly_promote_dyn_echo_rw");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("does_not_fix_the_uris_2006_split_rockwool");
    expect(PROTECTED_NEGATIVE_BOUNDARIES.join("\n")).toContain("stc_na_rows_do_not_promote");
    expect(liveResult.metrics.estimatedRwDb).toBe(50);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps active docs aligned on Gate B as the next no-runtime action", () => {
    const docs = REQUIRED_DOCS.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A.sliceId);
    expect(docs).toContain(NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A.status);
    expect(docs).toContain(NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A.selectedNextAction);
    expect(docs).toContain(NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_GATE_A.selectedNextFile);
    expect(docs).toContain(PRESS_RELEASE_URL);
    expect(docs).toContain(SELECTOR_URL);

    for (const row of NATIONAL_GYPSUM_SOURCE_ROWS) {
      expect(docs, row.id).toContain(row.id);
      expect(docs, row.sourceUrl).toContain(row.sourceUrl);
    }

    for (const boundary of PROTECTED_NEGATIVE_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }
  });
});
