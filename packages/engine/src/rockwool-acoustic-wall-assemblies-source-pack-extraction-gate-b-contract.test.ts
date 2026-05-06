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
import { WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS } from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type RockwoolGateBDecision =
  | "block_immediate_runtime_import"
  | "keep_context_only"
  | "keep_exterior_envelope_context_only";

type RockwoolRowDecision = {
  assemblyNumber: string;
  blockedTargetOutputs: readonly string[];
  currentImplementationFit:
    | "adjacent_to_existing_steel_stud_exact_anchor_not_same_row"
    | "asymmetric_single_stud_not_live_topology"
    | "high_stc_single_frame_not_current_lsf_or_triple_leaf_truth"
    | "single_wood_stud_not_existing_timber_exact_anchor"
    | "exterior_envelope_not_interior_wall_runtime_route";
  firstMissingRequirement: string;
  gateBDecision: RockwoolGateBDecision;
  localMaterialMapping:
    | "blocked_afb_to_local_rockwool_and_glass_fiber_mapping_missing"
    | "blocked_asymmetric_board_afb_and_stc_policy_missing"
    | "blocked_double_board_afb_column_metric_and_anchor_precedence_missing"
    | "blocked_wood_stud_afb_report_metric_and_timber_anchor_precedence_missing"
    | "blocked_comfortbatt_cavityrock_z_girt_air_barrier_and_cladding_mapping_missing";
  metricOwner:
    | "stc_only_without_iso_rw_or_curve_owner"
    | "stc_oitc_without_iso_rw_or_field_owner";
  protectedBoundary: string;
  requiredEngineTestsBeforeRuntime: readonly string[];
  requiredWebTestsBeforeRuntimeIfVisible: readonly string[];
  runtimeImportReadyNow: false;
  selectedRuntimeImportNow: false;
  toleranceOwnerNamed: false;
};

type RockwoolMetricDecision = {
  blockedTargets: readonly string[];
  firstMissingRequirement: string;
  metricContext: "source_stc" | "source_stc_oitc" | "field_or_building_outputs";
  runtimeOutputReadyNow: false;
};

const ROCKWOOL_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  sliceId: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  status: "rockwool_gate_b_found_no_runtime_ready_row_selected_closeout",
  supportPromotion: false,
  targetNextGateFile:
    "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
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
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const GATE_B_ROW_DECISIONS: readonly RockwoolRowDecision[] = [
  {
    assemblyNumber: "ISS-00",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "OITC", "STC"],
    currentImplementationFit: "adjacent_to_existing_steel_stud_exact_anchor_not_same_row",
    firstMissingRequirement:
      "iss_00_needs_stc_oitc_metric_policy_2p5in_steel_stud_afb_1p5in_material_mapping_tolerance_and_visible_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_afb_to_local_rockwool_and_glass_fiber_mapping_missing",
    metricOwner: "stc_oitc_without_iso_rw_or_field_owner",
    protectedBoundary:
      "iss_00_single_steel_stud_stc_oitc_row_does_not_replace_knauf_lsf_or_uris_2006_triple_leaf_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_iss_00_exact_value_or_rejection_pin",
      "engine_iss_00_rejects_knauf_lsf_and_uris_2006_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_iss_00_route_card_stc_oitc_context",
      "web_iss_00_report_keeps_field_outputs_source_gated"
    ],
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    assemblyNumber: "ISS-22",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC"],
    currentImplementationFit: "asymmetric_single_stud_not_live_topology",
    firstMissingRequirement:
      "iss_22_needs_asymmetric_leaf_inputs_stc_metric_rejection_or_conversion_afb_mapping_and_row_specific_tolerance_owner",
    gateBDecision: "keep_context_only",
    localMaterialMapping: "blocked_asymmetric_board_afb_and_stc_policy_missing",
    metricOwner: "stc_only_without_iso_rw_or_curve_owner",
    protectedBoundary:
      "iss_22_asymmetric_board_row_does_not_promote_symmetric_double_leaf_or_triple_leaf_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_iss_22_asymmetric_leaf_value_or_rejection_pin",
      "engine_iss_22_rejects_symmetric_stud_and_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_iss_22_route_card_asymmetric_source_context",
      "web_iss_22_report_keeps_metric_policy_explicit"
    ],
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    assemblyNumber: "ISS-39",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "STC"],
    currentImplementationFit: "high_stc_single_frame_not_current_lsf_or_triple_leaf_truth",
    firstMissingRequirement:
      "iss_39_needs_3p625in_steel_stud_24oc_double_board_afb_3in_mapping_stc_policy_tolerance_and_anchor_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_double_board_afb_column_metric_and_anchor_precedence_missing",
    metricOwner: "stc_only_without_iso_rw_or_curve_owner",
    protectedBoundary:
      "iss_39_high_stc_single_frame_row_does_not_override_knauf_lsf_or_nrc_uris_triple_leaf_source_families",
    requiredEngineTestsBeforeRuntime: [
      "engine_iss_39_exact_value_or_rejection_pin",
      "engine_iss_39_rejects_knauf_lsf_nrc_and_uris_triple_leaf_substitution"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_iss_39_route_card_high_stc_context_only",
      "web_iss_39_report_rejects_confidence_promotion"
    ],
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    assemblyNumber: "IWS-04",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "OITC", "STC"],
    currentImplementationFit: "single_wood_stud_not_existing_timber_exact_anchor",
    firstMissingRequirement:
      "iws_04_needs_report_number_completion_wood_stud_afb_mapping_stc_oitc_policy_and_british_gypsum_a046006_precedence_tests",
    gateBDecision: "block_immediate_runtime_import",
    localMaterialMapping: "blocked_wood_stud_afb_report_metric_and_timber_anchor_precedence_missing",
    metricOwner: "stc_oitc_without_iso_rw_or_field_owner",
    protectedBoundary:
      "iws_04_single_wood_stud_row_does_not_reopen_a046006_or_generic_timber_double_board_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_iws_04_exact_value_or_rejection_pin",
      "engine_iws_04_rejects_a046006_and_generic_timber_route_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_iws_04_route_card_wood_stud_context",
      "web_iws_04_report_keeps_existing_timber_anchor_precedence"
    ],
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  },
  {
    assemblyNumber: "ESS-05",
    blockedTargetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "OITC", "STC"],
    currentImplementationFit: "exterior_envelope_not_interior_wall_runtime_route",
    firstMissingRequirement:
      "ess_05_needs_exterior_envelope_topology_z_girt_air_barrier_cladding_comfortbatt_cavityrock_metric_policy_and_tolerance_owner",
    gateBDecision: "keep_exterior_envelope_context_only",
    localMaterialMapping: "blocked_comfortbatt_cavityrock_z_girt_air_barrier_and_cladding_mapping_missing",
    metricOwner: "stc_oitc_without_iso_rw_or_field_owner",
    protectedBoundary:
      "ess_05_exterior_envelope_row_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes",
    requiredEngineTestsBeforeRuntime: [
      "engine_ess_05_exterior_envelope_value_or_rejection_pin",
      "engine_ess_05_rejects_interior_wall_floor_masonry_and_triple_leaf_promotion"
    ],
    requiredWebTestsBeforeRuntimeIfVisible: [
      "web_ess_05_route_card_exterior_envelope_context",
      "web_ess_05_report_keeps_interior_wall_outputs_source_gated"
    ],
    runtimeImportReadyNow: false,
    selectedRuntimeImportNow: false,
    toleranceOwnerNamed: false
  }
] as const;

const METRIC_DECISIONS: readonly RockwoolMetricDecision[] = [
  {
    blockedTargets: ["Rw", "STC_as_DynEcho_value", "runtime_import_until_curve_owner_exists"],
    firstMissingRequirement:
      "rockwool_catalog_stc_values_need_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves",
    metricContext: "source_stc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["OITC", "Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "field_proxy_outputs"],
    firstMissingRequirement:
      "rockwool_catalog_oitc_values_are_not_dyn_echo_airborne_outputs_and_do_not_supply_room_flanking_or_field_normalisation",
    metricContext: "source_stc_oitc",
    runtimeOutputReadyNow: false
  },
  {
    blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
    firstMissingRequirement:
      "catalog_rows_do_not_supply_field_or_building_context_iso_12354_overlay_or_visible_output_policy",
    metricContext: "field_or_building_outputs",
    runtimeOutputReadyNow: false
  }
] as const;

const MATERIAL_ALIAS_DECISIONS = [
  "afb_does_not_coalesce_with_local_rockwool_without_density_flow_resistivity_thickness_and_source_family_owner",
  "afb_does_not_coalesce_with_glass_fiber_or_generic_mineral_wool",
  "comfortbatt_is_not_generic_interior_cavity_absorber_truth",
  "cavityrock_is_continuous_exterior_board_context_not_cavity_batt_truth",
  "rockwool_catalog_rows_do_not_override_nrc_2024_glass_fiber_or_uris_2006_rockwool_source_lane"
] as const;

const PROTECTED_BOUNDARIES = [
  "rockwool_gate_b_source_rows_are_not_runtime_import_approval",
  "rockwool_gate_b_stc_oitc_report_numbers_do_not_promote_iso_rw_or_field_outputs",
  "rockwool_gate_b_afb_comfortbatt_cavityrock_do_not_coalesce_with_local_rockwool_glass_fiber_or_generic_mineral_wool",
  "rockwool_gate_b_iss_rows_do_not_override_knauf_lsf_or_nrc_uris_triple_leaf_lanes",
  "rockwool_gate_b_iws_04_does_not_reopen_a046006_or_generic_timber_routes",
  "rockwool_gate_b_ess_05_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes",
  "runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen"
] as const;

const GATE_B_DECISION = {
  rowsKeptContextOnly: ["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"],
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
  targetNextGateFile:
    "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
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

describe("ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate B contract", () => {
  it("lands Gate B as no-runtime mapping / tolerance decision and selects Gate C closeout", () => {
    expect(ROCKWOOL_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_extract_rockwool_acoustic_wall_assemblies_rows_without_runtime_import",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      sliceId: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      status: "rockwool_gate_b_found_no_runtime_ready_row_selected_closeout",
      supportPromotion: false,
      targetNextGateFile:
        "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps every extracted ROCKWOOL row out of runtime import with a row-specific blocker", () => {
    expect(GATE_B_ROW_DECISIONS.map((row) => row.assemblyNumber)).toEqual([
      "ISS-00",
      "ISS-22",
      "ISS-39",
      "IWS-04",
      "ESS-05"
    ]);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.runtimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.selectedRuntimeImportNow === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.toleranceOwnerNamed === false)).toBe(true);
    expect(GATE_B_ROW_DECISIONS.every((row) => row.firstMissingRequirement.length > 95)).toBe(true);
    expect(GATE_B_DECISION).toEqual({
      rowsKeptContextOnly: ["ISS-00", "ISS-22", "ISS-39", "IWS-04", "ESS-05"],
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_closeout_and_next_slice_selection_no_runtime",
      targetNextGateFile:
        "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts"
    });
  });

  it("blocks ISS steel-stud rows from replacing the existing Knauf LSF anchor or triple-leaf lanes", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const lsfLab = calculateAssembly(lsf.rows, lsf.labOptions);

    expect(findVerifiedAirborneAssemblyMatch(lsfLab.layers, lsf.labOptions?.airborneContext)?.id).toBe(
      "knauf_lab_416889_primary_2026"
    );
    expect(resultSnapshot(lsfLab)).toMatchObject({ c: -1.5, ctr: -6.4, rw: 55, rwDb: 55, stc: 55 });
    expect(GATE_B_ROW_DECISIONS.filter((row) => row.assemblyNumber.startsWith("ISS")).map((row) => row.currentImplementationFit)).toEqual([
      "adjacent_to_existing_steel_stud_exact_anchor_not_same_row",
      "asymmetric_single_stud_not_live_topology",
      "high_stc_single_frame_not_current_lsf_or_triple_leaf_truth"
    ]);
    expect(PROTECTED_BOUNDARIES).toContain(
      "rockwool_gate_b_iss_rows_do_not_override_knauf_lsf_or_nrc_uris_triple_leaf_lanes"
    );
  });

  it("keeps IWS-04 from reopening the existing timber anchor or generic timber route", () => {
    const timber = generatedCase("wall-timber-stud");
    const timberLab = calculateAssembly(timber.rows, timber.labOptions);
    const a046006 = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.find(
      (entry) => entry.id === "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    );

    expect(GATE_B_ROW_DECISIONS.find((row) => row.assemblyNumber === "IWS-04")).toMatchObject({
      currentImplementationFit: "single_wood_stud_not_existing_timber_exact_anchor",
      localMaterialMapping: "blocked_wood_stud_afb_report_metric_and_timber_anchor_precedence_missing",
      toleranceOwnerNamed: false
    });
    expect(resultSnapshot(timberLab)).toMatchObject({ c: 0.5, ctr: -4.2, rw: 50, rwDb: 50, stc: 50 });
    expect(a046006).toMatchObject({
      classification: "exact_import_landed",
      expectedRw: 58,
      toleranceDb: 3
    });
    expect(PROTECTED_BOUNDARIES).toContain(
      "rockwool_gate_b_iws_04_does_not_reopen_a046006_or_generic_timber_routes"
    );
  });

  it("keeps ESS-05 exterior envelope context out of interior wall, floor, masonry, and triple-leaf routes", () => {
    const linedMassive = generatedCase("wall-screening-concrete");
    const linedLab = calculateAssembly(linedMassive.rows, linedMassive.labOptions);
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(GATE_B_ROW_DECISIONS.find((row) => row.assemblyNumber === "ESS-05")).toMatchObject({
      currentImplementationFit: "exterior_envelope_not_interior_wall_runtime_route",
      gateBDecision: "keep_exterior_envelope_context_only",
      localMaterialMapping: "blocked_comfortbatt_cavityrock_z_girt_air_barrier_and_cladding_mapping_missing"
    });
    expect(resultSnapshot(linedLab)).toMatchObject({ c: -1.6, ctr: -6.5, rw: 57, rwDb: 57, stc: 57 });
    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
  });

  it("blocks STC/OITC/report-number over-read into DynEcho Rw, field outputs, or spectrum policy", () => {
    expect(METRIC_DECISIONS).toEqual([
      {
        blockedTargets: ["Rw", "STC_as_DynEcho_value", "runtime_import_until_curve_owner_exists"],
        firstMissingRequirement:
          "rockwool_catalog_stc_values_need_metric_rejection_or_iso_717_rw_derivation_from_source_owned_one_third_octave_curves",
        metricContext: "source_stc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["OITC", "Rw", "R'w", "Dn,w", "DnT,w", "DnT,A", "field_proxy_outputs"],
        firstMissingRequirement:
          "rockwool_catalog_oitc_values_are_not_dyn_echo_airborne_outputs_and_do_not_supply_room_flanking_or_field_normalisation",
        metricContext: "source_stc_oitc",
        runtimeOutputReadyNow: false
      },
      {
        blockedTargets: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
        firstMissingRequirement:
          "catalog_rows_do_not_supply_field_or_building_context_iso_12354_overlay_or_visible_output_policy",
        metricContext: "field_or_building_outputs",
        runtimeOutputReadyNow: false
      }
    ]);
    expect(METRIC_DECISIONS.every((decision) => decision.runtimeOutputReadyNow === false)).toBe(true);
    expect(PROTECTED_BOUNDARIES).toContain(
      "rockwool_gate_b_stc_oitc_report_numbers_do_not_promote_iso_rw_or_field_outputs"
    );
  });

  it("requires material alias ownership and paired tests before any future visible or runtime movement", () => {
    expect(MATERIAL_ALIAS_DECISIONS).toEqual([
      "afb_does_not_coalesce_with_local_rockwool_without_density_flow_resistivity_thickness_and_source_family_owner",
      "afb_does_not_coalesce_with_glass_fiber_or_generic_mineral_wool",
      "comfortbatt_is_not_generic_interior_cavity_absorber_truth",
      "cavityrock_is_continuous_exterior_board_context_not_cavity_batt_truth",
      "rockwool_catalog_rows_do_not_override_nrc_2024_glass_fiber_or_uris_2006_rockwool_source_lane"
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

    expect(docs).toContain(ROCKWOOL_GATE_B.sliceId);
    expect(docs).toContain(ROCKWOOL_GATE_B.status);
    expect(docs).toContain(ROCKWOOL_GATE_B.selectedNextAction);
    expect(docs).toContain(ROCKWOOL_GATE_B.targetNextGateFile);
    expect(docs).toContain(SOURCE_URL);

    for (const row of GATE_B_ROW_DECISIONS) {
      expect(docs, row.assemblyNumber).toContain(row.assemblyNumber);
    }

    for (const boundary of PROTECTED_BOUNDARIES) {
      expect(docs, boundary).toContain(boundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
