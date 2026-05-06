import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CloseoutCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

type NationalGypsumCloseoutEvidence = {
  closeoutPosture:
    | "blocked_area_separation_context"
    | "blocked_load_bearing_steel_partition_context"
    | "blocked_roof_ceiling_stc_na_context"
    | "blocked_shaftwall_context"
    | "blocked_steel_partition_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  rowId: string;
};

const POST_NATIONAL_GYPSUM_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v12",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_national_gypsum_closeout",
  selectionStatus:
    "closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_national_gypsum_fire_sound_selector_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly NationalGypsumCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_steel_partition_context",
    firstMissingRequirement:
      "national_gypsum_v438_still_lacks_acoustical_report_payload_or_curve_metric_owner_fire_shield_glass_fiber_resilient_channel_mapping_tolerance_and_lsf_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "national_gypsum_v438_gate_b_stc50_does_not_replace_knauf_lsf_or_generic_steel_partition_routes",
    rowId: "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50"
  },
  {
    closeoutPosture: "blocked_shaftwall_context",
    firstMissingRequirement:
      "national_gypsum_w419_still_lacks_shaftwall_ct_stud_exp_shaftliner_soundbreak_glass_fiber_one_side_access_mapping_metric_policy_tolerance_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "national_gypsum_w419_gate_b_shaftwall_stc44_does_not_promote_generic_wall_lsf_or_lined_masonry_routes",
    rowId: "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44"
  },
  {
    closeoutPosture: "blocked_load_bearing_steel_partition_context",
    firstMissingRequirement:
      "national_gypsum_w469_still_lacks_load_bearing_16ga_stud_soundbreak_fire_shield_glass_fiber_resilient_channel_mapping_metric_policy_tolerance_and_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "national_gypsum_w469_gate_b_load_bearing_stc51_does_not_replace_existing_non_load_bearing_lsf_anchors",
    rowId: "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51"
  },
  {
    closeoutPosture: "blocked_area_separation_context",
    firstMissingRequirement:
      "national_gypsum_w454_still_lacks_h_stud_shaftliner_fire_shield_c_dual_wood_side_frame_area_separation_topology_metric_policy_tolerance_and_triple_leaf_negative_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "national_gypsum_w454_gate_b_area_separation_wall_does_not_promote_simple_stud_no_stud_or_triple_leaf_routes",
    rowId: "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43"
  },
  {
    closeoutPosture: "blocked_roof_ceiling_stc_na_context",
    firstMissingRequirement:
      "national_gypsum_p540_still_has_stc_na_and_roof_ceiling_topology_so_actual_acoustic_metric_roof_floor_mapping_tolerance_and_negative_tests_are_required_before_any_runtime_use",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "national_gypsum_p540_gate_b_stc_na_roof_ceiling_row_remains_negative_boundary_for_floor_wall_and_impact_outputs",
    rowId: "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "national_gypsum_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_national_gypsum_selector_row_with_exact_report_payload_one_third_octave_curve_metric_owner_live_topology_material_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v12",
    reason:
      "after_national_gypsum_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_georgia_pacific_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_defect_remains_important_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_rating_derivation_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "georgia_pacific_direct_extraction",
    reason:
      "georgia_pacific_is_still_a_nearby_official_locator_but_needs_a_fresh_post_national_gypsum_rerank_against_closed_selector_rows_and_the_paused_triple_leaf_source_lane_before_a_narrow_extraction_slice_is_selected",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled_internal_use_and_productization_remain_lower_priority_than_accuracy_revalidation_while_no_new_source_ready_runtime_pack_or_operator_defect_has_appeared",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V12_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
  requiredArtifacts: [
    "national_gypsum_gate_a_gate_b_gate_c_closeout_summary",
    "national_gypsum_stc_report_locator_stc_na_and_material_alias_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "georgia_pacific_remaining_official_locator_and_other_source_acquisition_rerank",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts"
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

describe("post National Gypsum Fire & Sound Selector source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the National Gypsum source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_NATIONAL_GYPSUM_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "national_gypsum_fire_sound_selector_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v12",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_national_gypsum_closeout",
      selectionStatus:
        "closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_national_gypsum_fire_sound_selector_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B National Gypsum row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.rowId)).toEqual([
      "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50",
      "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44",
      "NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51",
      "NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43",
      "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 125)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44")).toMatchObject({
      closeoutPosture: "blocked_shaftwall_context"
    });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA")
        ?.protectedBoundary
    ).toContain("stc_na_roof_ceiling");
  });

  it("keeps STC/report/STC-N-A context and the split-rockwool answer fail-closed", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(splitRockwool.metrics.estimatedRwDb).toBe(50);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("triple_leaf_two_cavity_frequency_solver_family_physics_prediction");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(
      NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "wall_triple_leaf_uris_2006_runtime_reopen")
    ).toMatchObject({
      runtimeEligibleNow: false,
      selectedNext: false
    });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50")
        ?.firstMissingRequirement
    ).toContain("curve_metric_owner");
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA")
        ?.firstMissingRequirement
    ).toContain("stc_na");
  });

  it("selects source-gap revalidation v12 before runtime, direct Georgia-Pacific extraction, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v12",
        reason:
          "after_national_gypsum_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_georgia_pacific_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 115)).toBe(true);
  });

  it("defines the selected v12 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V12_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout",
      requiredArtifacts: [
        "national_gypsum_gate_a_gate_b_gate_c_closeout_summary",
        "national_gypsum_stc_report_locator_stc_na_and_material_alias_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "georgia_pacific_remaining_official_locator_and_other_source_acquisition_rerank",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V12_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v12 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V12_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_NATIONAL_GYPSUM_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_NATIONAL_GYPSUM_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_NATIONAL_GYPSUM_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-02_NATIONAL_GYPSUM_FIRE_SOUND_SELECTOR_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain("pnpm --filter @dynecho/engine exec vitest run src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1");
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
