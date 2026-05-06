import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NationalGypsumGateBDecision = "block_immediate_runtime_import" | "keep_context_only";

type NationalGypsumGateBRowDecision = {
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "steel_partition_v438_adjacent_to_lsf_not_same_anchor"
    | "shaftwall_w419_not_live_wall_topology"
    | "load_bearing_w469_not_existing_lsf_anchor"
    | "area_separation_w454_not_simple_wall_or_triple_leaf_topology"
    | "roof_ceiling_p540_stc_na_negative_boundary";
  family: "area_separation_wall" | "roof_ceiling" | "shaftwall" | "steel_partition";
  firstMissingRequirement: string;
  gateBDecision: NationalGypsumGateBDecision;
  localMaterialMapping:
    | "blocked_fire_shield_glass_fiber_resilient_channel_and_stud_mapping_missing"
    | "blocked_shaftliner_soundbreak_ct_stud_and_one_side_access_mapping_missing"
    | "blocked_soundbreak_fire_shield_load_bearing_stud_and_rc_channel_mapping_missing"
    | "blocked_h_stud_shaftliner_fire_shield_c_wood_stud_side_frames_mapping_missing"
    | "blocked_roof_truss_optional_insulation_resilient_channel_and_stc_na_metric_mapping_missing";
  metricOwner:
    | "stc_report_locator_without_iso_rw_curve_owner"
    | "stc_report_locator_without_field_owner_or_soundbreak_policy"
    | "stc_na_without_runtime_acoustic_metric";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  rowId: string;
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  toleranceOwnerNamed: false;
};

type NationalGypsumMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "source_stc" | "report_locator" | "stc_na" | "field_outputs";
  runtimeOutputReadyNow: false;
};

const NATIONAL_GYPSUM_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  status: "national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const SOURCE_URLS = [
  "https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/v438-u465-358-20eq-m24-rc1",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w419-u499-212-25ga-ct-sb",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w469-358-16ga-metalstuds-16oc-rc1-sb",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w454-3hr-1xinsul",
  "https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/p540-steel-truss-roof-58c"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly NationalGypsumGateBRowDecision[] = [
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC_as_Rw"],
    currentImplementationFit: "steel_partition_v438_adjacent_to_lsf_not_same_anchor",
    family: "steel_partition",
    firstMissingRequirement:
      "national_gypsum_v438_needs_acoustical_report_payload_or_curve_metric_owner_fire_shield_glass_fiber_resilient_channel_mapping_tolerance_and_lsf_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_fire_shield_glass_fiber_resilient_channel_and_stud_mapping_missing",
    metricOwner: "stc_report_locator_without_iso_rw_curve_owner",
    protectedBoundary:
      "national_gypsum_v438_gate_b_stc50_does_not_replace_knauf_lsf_or_generic_steel_partition_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_national_gypsum_v438_value_or_rejection_pin",
      "engine_national_gypsum_v438_rejects_lsf_usg_knauf_and_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_national_gypsum_v438_route_card_source_context",
      "web_national_gypsum_v438_report_blocks_stc_to_rw_copy"
    ],
    rowId: "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "shaftwall_as_generic_wall"],
    currentImplementationFit: "shaftwall_w419_not_live_wall_topology",
    family: "shaftwall",
    firstMissingRequirement:
      "national_gypsum_w419_needs_shaftwall_ct_stud_exp_shaftliner_soundbreak_glass_fiber_one_side_access_mapping_metric_policy_tolerance_and_visible_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_shaftliner_soundbreak_ct_stud_and_one_side_access_mapping_missing",
    metricOwner: "stc_report_locator_without_field_owner_or_soundbreak_policy",
    protectedBoundary:
      "national_gypsum_w419_gate_b_shaftwall_stc44_does_not_promote_generic_wall_lsf_or_lined_masonry_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w419_value_or_rejection_pin",
      "engine_national_gypsum_w419_rejects_generic_wall_lsf_and_lined_masonry_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_national_gypsum_w419_shaftwall_context",
      "web_national_gypsum_w419_report_blocks_generic_wall_promotion"
    ],
    rowId: "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "load_bearing_as_non_load_bearing_lsf"],
    currentImplementationFit: "load_bearing_w469_not_existing_lsf_anchor",
    family: "steel_partition",
    firstMissingRequirement:
      "national_gypsum_w469_needs_load_bearing_16ga_stud_soundbreak_fire_shield_glass_fiber_resilient_channel_mapping_metric_policy_tolerance_and_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_soundbreak_fire_shield_load_bearing_stud_and_rc_channel_mapping_missing",
    metricOwner: "stc_report_locator_without_field_owner_or_soundbreak_policy",
    protectedBoundary:
      "national_gypsum_w469_gate_b_load_bearing_stc51_does_not_replace_existing_non_load_bearing_lsf_anchors",
    requiredEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w469_value_or_rejection_pin",
      "engine_national_gypsum_w469_rejects_non_load_bearing_lsf_and_soundbreak_false_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_national_gypsum_w469_load_bearing_context",
      "web_national_gypsum_w469_report_blocks_lsf_anchor_replacement"
    ],
    rowId: "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "area_separation_as_triple_leaf"],
    currentImplementationFit: "area_separation_w454_not_simple_wall_or_triple_leaf_topology",
    family: "area_separation_wall",
    firstMissingRequirement:
      "national_gypsum_w454_needs_h_stud_shaftliner_fire_shield_c_dual_wood_side_frame_area_separation_topology_metric_policy_tolerance_and_triple_leaf_negative_tests",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_h_stud_shaftliner_fire_shield_c_wood_stud_side_frames_mapping_missing",
    metricOwner: "stc_report_locator_without_iso_rw_curve_owner",
    protectedBoundary:
      "national_gypsum_w454_gate_b_area_separation_wall_does_not_promote_simple_stud_no_stud_or_triple_leaf_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_national_gypsum_w454_value_or_rejection_pin",
      "engine_national_gypsum_w454_rejects_simple_wall_no_stud_and_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_national_gypsum_w454_area_separation_context",
      "web_national_gypsum_w454_report_blocks_triple_leaf_promotion"
    ],
    rowId: "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    blockedTargetOutputs: ["Ln,w", "Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "floor_wall_or_roof_runtime_import"],
    currentImplementationFit: "roof_ceiling_p540_stc_na_negative_boundary",
    family: "roof_ceiling",
    firstMissingRequirement:
      "national_gypsum_p540_has_stc_na_and_roof_ceiling_topology_so_it_needs_actual_acoustic_metric_roof_floor_mapping_tolerance_and_negative_tests_before_any_runtime_use",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_roof_truss_optional_insulation_resilient_channel_and_stc_na_metric_mapping_missing",
    metricOwner: "stc_na_without_runtime_acoustic_metric",
    protectedBoundary:
      "national_gypsum_p540_gate_b_stc_na_roof_ceiling_row_remains_negative_boundary_for_floor_wall_and_impact_outputs",
    requiredEngineTestsBeforeRuntime: [
      "engine_national_gypsum_p540_stc_na_value_or_rejection_pin",
      "engine_national_gypsum_p540_rejects_floor_wall_roof_and_impact_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_national_gypsum_p540_stc_na_context",
      "web_national_gypsum_p540_report_blocks_runtime_metric_copy"
    ],
    rowId: "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA",
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly NationalGypsumMetricDecision[] = [
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
    firstMissingRequirement:
      "national_gypsum_stc_values_need_explicit_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves",
    metricContext: "source_stc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["evidence_tier_promotion", "runtime_import_without_downloaded_report_payload"],
    firstMissingRequirement:
      "national_gypsum_report_locators_identify_rows_but_do_not_supply_graph_payload_curve_digitization_tolerance_or_chain_of_custody",
    metricContext: "report_locator",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["Rw", "Ln,w", "floor_wall_or_roof_acoustic_outputs"],
    firstMissingRequirement:
      "national_gypsum_stc_na_rows_are_negative_boundaries_until_a_source_metric_and_topology_owner_exist",
    metricContext: "stc_na",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "national_gypsum_selector_rows_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
    metricContext: "field_outputs",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "fire_shield_does_not_coalesce_with_generic_gypsum_or_type_c_without_source_tolerance_owner",
  "soundbreak_xp_fire_shield_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping",
  "exp_shaftliner_does_not_coalesce_with_generic_gypsum_board_or_masonry_lining",
  "glass_fiber_does_not_coalesce_with_local_rockwool_afb_or_generic_mineral_wool",
  "resilient_channel_one_side_does_not_coalesce_with_generic_resilient_bar_or_independent_frame",
  "ct_stud_h_stud_load_bearing_stud_wood_side_frame_and_roof_truss_roles_must_not_coalesce"
] as const;

const PROTECTED_BOUNDARIES = [
  "national_gypsum_gate_b_source_rows_are_not_runtime_import_approval",
  "national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs",
  "national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv",
  "national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool",
  "national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes",
  "national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors",
  "national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: [
    "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
    "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
    "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
    "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
    "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
  ],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

describe("National Gypsum Fire & Sound Selector source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(NATIONAL_GYPSUM_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      status: "national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted National Gypsum row out of runtime import with row-specific blockers", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.rowId)).toEqual(GATE_B_DECISION.rowsKeptContextOnly);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 120)).toBe(true);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: [
        "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
        "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
        "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
        "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
        "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
      ],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("blocks steel partition rows from replacing existing LSF anchors or triple-leaf behavior", () => {
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
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.family === "steel_partition").map((row) => row.currentImplementationFit)).toEqual([
      "steel_partition_v438_adjacent_to_lsf_not_same_anchor",
      "load_bearing_w469_not_existing_lsf_anchor"
    ]);
    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("keeps shaftwall, area-separation, and roof-ceiling rows as family-boundary context only", () => {
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.family !== "steel_partition").map((row) => row.currentImplementationFit)).toEqual([
      "shaftwall_w419_not_live_wall_topology",
      "area_separation_w454_not_simple_wall_or_triple_leaf_topology",
      "roof_ceiling_p540_stc_na_negative_boundary"
    ]);
    expect(GATE_B_ROW_DECISIONS.find((row) => row.rowId.includes("P540"))?.metricOwner).toBe(
      "stc_na_without_runtime_acoustic_metric"
    );
    expect(PROTECTED_BOUNDARIES).toContain(
      "national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes"
    );
    expect(PROTECTED_BOUNDARIES).toContain(
      "national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result"
    );
  });

  it("blocks STC, report-locator, STC N/A, and field-output over-read into DynEcho metrics", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_Rw", "runtime_import_until_curve_owner_exists"],
        firstMissingRequirement:
          "national_gypsum_stc_values_need_explicit_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves",
        metricContext: "source_stc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["evidence_tier_promotion", "runtime_import_without_downloaded_report_payload"],
        firstMissingRequirement:
          "national_gypsum_report_locators_identify_rows_but_do_not_supply_graph_payload_curve_digitization_tolerance_or_chain_of_custody",
        metricContext: "report_locator",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["Rw", "Ln,w", "floor_wall_or_roof_acoustic_outputs"],
        firstMissingRequirement:
          "national_gypsum_stc_na_rows_are_negative_boundaries_until_a_source_metric_and_topology_owner_exist",
        metricContext: "stc_na",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "national_gypsum_selector_rows_do_not_supply_field_building_context_iso_12354_overlay_room_geometry_or_visible_output_policy",
        metricContext: "field_outputs",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs"
    );
  });

  it("requires material alias ownership and paired tests before future visible or runtime movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "fire_shield_does_not_coalesce_with_generic_gypsum_or_type_c_without_source_tolerance_owner",
      "soundbreak_xp_fire_shield_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping",
      "exp_shaftliner_does_not_coalesce_with_generic_gypsum_board_or_masonry_lining",
      "glass_fiber_does_not_coalesce_with_local_rockwool_afb_or_generic_mineral_wool",
      "resilient_channel_one_side_does_not_coalesce_with_generic_resilient_bar_or_independent_frame",
      "ct_stud_h_stud_load_bearing_stud_wood_side_frame_and_roof_truss_roles_must_not_coalesce"
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

    expect(docs).toContain(NATIONAL_GYPSUM_GATE_B.sliceId);
    expect(docs).toContain(NATIONAL_GYPSUM_GATE_B.status);
    expect(docs).toContain(NATIONAL_GYPSUM_GATE_B.selectedNextAction);
    expect(docs).toContain(NATIONAL_GYPSUM_GATE_B.targetNextGateFile);

    for (const sourceUrl of SOURCE_URLS) {
      expect(docs, sourceUrl).toContain(sourceUrl);
    }

    for (const row of GATE_B_ROW_DECISIONS) {
      expect(docs, row.rowId).toContain(row.rowId);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const boundary of PROTECTED_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
