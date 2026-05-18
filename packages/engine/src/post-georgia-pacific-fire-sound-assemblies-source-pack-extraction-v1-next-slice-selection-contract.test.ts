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

type GeorgiaPacificCloseoutEvidence = {
  closeoutPosture:
    | "blocked_area_separation_context"
    | "blocked_exterior_sheathing_context"
    | "blocked_interior_steel_partition_context"
    | "blocked_shaftwall_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  rowId: string;
};

const POST_GEORGIA_PACIFIC_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v13",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_georgia_pacific_closeout",
  selectionStatus:
    "closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly GeorgiaPacificCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_interior_steel_partition_context",
    firstMissingRequirement:
      "gp_toughrock_ul_u465_still_lacks_actual_ul_ga_or_ral_payload_full_band_metric_policy_toughrock_fireguard_type_x_mineral_fiber_stud_mapping_tolerance_owner_and_lsf_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "gp_toughrock_ul_u465_gate_b_stc_range_does_not_replace_lsf_anchor_or_timber_routes",
    rowId: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103"
  },
  {
    closeoutPosture: "blocked_interior_steel_partition_context",
    firstMissingRequirement:
      "gp_toughrock_ul_u411_still_lacks_actual_ul_ga_or_ral_payload_precise_board_fastener_and_fiberglass_mapping_metric_policy_tolerance_owner_and_paired_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "gp_toughrock_ul_u411_gate_b_stc_range_does_not_promote_dyn_echo_rw_or_field_outputs",
    rowId: "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331"
  },
  {
    closeoutPosture: "blocked_area_separation_context",
    firstMissingRequirement:
      "gp_toughrock_gp_wa_120_04_still_lacks_actual_directory_or_ral_payload_h_stud_shaftliner_airspace_adjacent_wall_topology_mapping_metric_policy_tolerance_owner_and_triple_leaf_negative_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "gp_toughrock_gp_wa_120_04_gate_b_area_separation_stc66_does_not_promote_simple_double_leaf_or_triple_leaf_routes",
    rowId: "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291"
  },
  {
    closeoutPosture: "blocked_exterior_sheathing_context",
    firstMissingRequirement:
      "gp_densglass_ul_u305_u337_still_lacks_actual_ul_whi_ga_or_report_payload_exterior_sheathing_weather_side_context_metric_policy_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "gp_densglass_ul_u305_u337_gate_b_exterior_sheathing_stc30_34_does_not_promote_generic_interior_wall_routes",
    rowId: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8"
  },
  {
    closeoutPosture: "blocked_exterior_sheathing_context",
    firstMissingRequirement:
      "gp_densglass_ul_u425_still_lacks_actual_ul_ga_or_irc_report_payload_exterior_side_mapping_steel_stud_insulation_metric_policy_tolerance_owner_and_lsf_lined_masonry_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "gp_densglass_ul_u425_gate_b_exterior_sheathing_stc55_59_does_not_replace_lsf_or_lined_masonry_anchors",
    rowId: "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761"
  },
  {
    closeoutPosture: "blocked_shaftwall_context",
    firstMissingRequirement:
      "gp_densglass_shaftliner_ul_v473_still_lacks_actual_ul_whi_or_ral_payload_shaftwall_one_side_access_ct_ch_i_stud_resilient_channel_glass_fiber_mapping_metric_policy_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "gp_densglass_shaftliner_ul_v473_gate_b_stc48_remains_shaftwall_context_only",
    rowId: "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "georgia_pacific_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_georgia_pacific_row_with_actual_directory_or_test_report_payload_source_owned_curve_or_metric_policy_exact_live_topology_material_alias_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v13",
    reason:
      "after_georgia_pacific_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_defect_remains_important_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_rating_derivation_uncertainty_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "direct_new_source_pack_without_rerank",
    reason:
      "remaining_official_or_near_source_surfaces_need_a_fresh_post_georgia_pacific_rerank_against_closed_gp_rows_and_the_paused_triple_leaf_source_lane_before_a_narrow_extraction_slice_is_selected",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
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

const SELECTED_V13_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
  requiredArtifacts: [
    "georgia_pacific_gate_a_gate_b_gate_c_closeout_summary",
    "georgia_pacific_stc_range_sound_report_material_alias_and_family_boundary_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "remaining_official_locator_and_source_acquisition_rerank_after_georgia_pacific",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts"
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

describe("post Georgia-Pacific Fire & Sound Assemblies source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the Georgia-Pacific source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_GEORGIA_PACIFIC_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v13",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_georgia_pacific_closeout",
      selectionStatus:
        "closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B Georgia-Pacific row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.rowId)).toEqual([
      "GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103",
      "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331",
      "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291",
      "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8",
      "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761",
      "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 135)).toBe(true);
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291"
      )
    ).toMatchObject({ closeoutPosture: "blocked_area_separation_context" });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363"
      )?.protectedBoundary
    ).toContain("shaftwall_context_only");
  });

  it("keeps STC/range/report context and the split-rockwool answer fail-closed", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(splitRockwool.metrics.estimatedRwDb).toBe(53);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(
      NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "wall_triple_leaf_uris_2006_runtime_reopen")
    ).toMatchObject({
      runtimeEligibleNow: false,
      selectedNext: false
    });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331"
      )?.firstMissingRequirement
    ).toContain("metric_policy");
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8"
      )?.firstMissingRequirement
    ).toContain("exterior_sheathing");
  });

  it("selects source-gap revalidation v13 before runtime, direct source extraction, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v13",
        reason:
          "after_georgia_pacific_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("defines the selected v13 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V13_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout",
      requiredArtifacts: [
        "georgia_pacific_gate_a_gate_b_gate_c_closeout_summary",
        "georgia_pacific_stc_range_sound_report_material_alias_and_family_boundary_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "remaining_official_locator_and_source_acquisition_rerank_after_georgia_pacific",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v13 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V13_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_GEORGIA_PACIFIC_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_GEORGIA_PACIFIC_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_GEORGIA_PACIFIC_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-02_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
