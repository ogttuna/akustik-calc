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

type UsgCloseoutEvidence = {
  closeoutPosture:
    | "blocked_floor_levelrock_context"
    | "blocked_floor_range_context"
    | "blocked_floor_srb_context"
    | "blocked_floor_truss_context"
    | "blocked_steel_partition_context"
    | "blocked_resilient_channel_partition_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  rowId: string;
};

const POST_USG_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v11",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_usg_closeout",
  selectionStatus:
    "closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_usg_acoustical_assemblies_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly UsgCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_floor_levelrock_context",
    firstMissingRequirement:
      "levelrock_i_joist_srm25_carpet_still_lacks_levelrock_i_joist_carpet_floor_finish_iic_stc_metric_policy_tolerance_and_paired_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "levelrock_i_joist_srm25_carpet_remains_context_only_and_does_not_promote_exact_floor_generated_floor_or_wall_outputs",
    rowId: "LEVELROCK_I_JOIST_SRM25_CARPET"
  },
  {
    closeoutPosture: "blocked_floor_range_context",
    firstMissingRequirement:
      "levelrock_i_joist_srm25_sheet_vinyl_still_lacks_range_policy_floor_finish_topology_iic_stc_metric_owner_tolerance_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "levelrock_i_joist_srm25_sheet_vinyl_range_remains_context_only_and_does_not_collapse_to_a_single_exact_dyn_echo_value",
    rowId: "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL"
  },
  {
    closeoutPosture: "blocked_floor_srb_context",
    firstMissingRequirement:
      "levelrock_i_joist_srb_wood_laminate_still_lacks_srb_board_material_mapping_i_joist_floor_topology_metric_policy_tolerance_and_substitution_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "levelrock_i_joist_srb_wood_laminate_remains_context_only_and_does_not_substitute_for_srm25_or_generic_resilient_floor_routes",
    rowId: "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE"
  },
  {
    closeoutPosture: "blocked_floor_truss_context",
    firstMissingRequirement:
      "levelrock_truss_srm25_ceramic_tile_still_lacks_truss_specific_topology_ceramic_finish_metric_policy_tolerance_and_generated_floor_negative_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "levelrock_truss_srm25_ceramic_tile_remains_context_only_and_does_not_substitute_for_i_joist_open_web_or_generated_floor_routes",
    rowId: "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE"
  },
  {
    closeoutPosture: "blocked_steel_partition_context",
    firstMissingRequirement:
      "usg_steel_framed_a1_still_lacks_sheetrock_firecode_steel_stud_gauge_spacing_stc_to_rw_curve_owner_tolerance_and_lsf_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "usg_steel_framed_a1_remains_context_only_and_does_not_override_existing_lsf_knauf_british_gypsum_or_generic_wall_routes",
    rowId: "USG_STEEL_FRAMED_A1"
  },
  {
    closeoutPosture: "blocked_resilient_channel_partition_context",
    firstMissingRequirement:
      "usg_steel_framed_a8_still_lacks_sheetrock_firecode_c_thermafiber_safb_rc_channel_one_side_mapping_stc_curve_policy_tolerance_and_triple_leaf_negative_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "usg_steel_framed_a8_remains_context_only_and_does_not_promote_resilient_channel_lsf_triple_leaf_or_rockwool_routes",
    rowId: "USG_STEEL_FRAMED_A8"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "usg_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_usg_sa200_row_with_complete_live_topology_metric_owner_material_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v11",
    reason:
      "after_usg_gate_b_closed_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_usg_rockwool_british_gypsum_knauf_rows_national_gypsum_georgia_pacific_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_defect_remains_important_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "national_gypsum_or_georgia_pacific_direct_extraction",
    reason:
      "these_remaining_locator_surfaces_are_promising_but_need_a_fresh_post_usg_rerank_against_closed_usg_rows_and_the_paused_triple_leaf_source_lane_before_a_narrow_extraction_slice_is_selected",
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

const SELECTED_V11_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
  requiredArtifacts: [
    "usg_gate_a_gate_b_gate_c_closeout_summary",
    "usg_levelrock_steel_partition_stc_iic_range_and_alias_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "national_gypsum_georgia_pacific_and_remaining_post_british_gypsum_locator_rerank",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts"
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

describe("post USG Acoustical Assemblies source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the USG source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_USG_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "usg_acoustical_assemblies_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v11",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_usg_closeout",
      selectionStatus:
        "closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_usg_acoustical_assemblies_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B USG row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.rowId)).toEqual([
      "LEVELROCK_I_JOIST_SRM25_CARPET",
      "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL",
      "LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE",
      "LEVELROCK_TRUSS_SRM25_CERAMIC_TILE",
      "USG_STEEL_FRAMED_A1",
      "USG_STEEL_FRAMED_A8"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 110)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "LEVELROCK_I_JOIST_SRM25_SHEET_VINYL")).toMatchObject({
      closeoutPosture: "blocked_floor_range_context"
    });
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "USG_STEEL_FRAMED_A8")?.protectedBoundary).toContain(
      "resilient_channel"
    );
  });

  it("keeps STC/IIC/range/test-number context and the split-rockwool answer fail-closed", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(splitRockwool.metrics.estimatedRwDb).toBe(41);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "wall_triple_leaf_uris_2006_runtime_reopen")).toMatchObject({
      runtimeEligibleNow: false,
      selectedNext: false
    });
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "USG_STEEL_FRAMED_A1")?.firstMissingRequirement).toContain(
      "stc_to_rw"
    );
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.rowId === "LEVELROCK_I_JOIST_SRM25_CARPET")?.firstMissingRequirement).toContain(
      "iic_stc"
    );
  });

  it("selects source-gap revalidation v11 before runtime, direct National/GP extraction, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v11",
        reason:
          "after_usg_gate_b_closed_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_usg_rockwool_british_gypsum_knauf_rows_national_gypsum_georgia_pacific_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 110)).toBe(true);
  });

  it("defines the selected v11 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V11_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout",
      requiredArtifacts: [
        "usg_gate_a_gate_b_gate_c_closeout_summary",
        "usg_levelrock_steel_partition_stc_iic_range_and_alias_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "national_gypsum_georgia_pacific_and_remaining_post_british_gypsum_locator_rerank",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V11_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v11 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V11_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_USG_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_USG_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_USG_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("usg_gate_b_found_no_runtime_ready_row_selected_closeout");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-02_USG_ACOUSTICAL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain("pnpm --filter @dynecho/engine exec vitest run src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1");
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
