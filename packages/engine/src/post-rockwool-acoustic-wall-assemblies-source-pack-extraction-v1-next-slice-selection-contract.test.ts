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

type RockwoolCloseoutEvidence = {
  assemblyNumber: string;
  closeoutPosture:
    | "blocked_single_steel_stud_context"
    | "blocked_asymmetric_steel_stud_context"
    | "blocked_high_stc_single_frame_context"
    | "blocked_single_wood_stud_context"
    | "blocked_exterior_envelope_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
};

const POST_ROCKWOOL_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v10",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_rockwool_closeout",
  selectionStatus:
    "closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_rockwool_acoustic_wall_assemblies_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-rockwool-acoustic-wall-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-02_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_ROCKWOOL_ACOUSTIC_WALL_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly RockwoolCloseoutEvidence[] = [
  {
    assemblyNumber: "ISS-00",
    closeoutPosture: "blocked_single_steel_stud_context",
    firstMissingRequirement:
      "iss_00_still_lacks_stc_oitc_metric_policy_2p5in_steel_stud_afb_1p5in_mapping_tolerance_and_knauf_uris_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "iss_00_remains_context_only_and_does_not_replace_knauf_lsf_or_uris_2006_triple_leaf_routes"
  },
  {
    assemblyNumber: "ISS-22",
    closeoutPosture: "blocked_asymmetric_steel_stud_context",
    firstMissingRequirement:
      "iss_22_still_lacks_asymmetric_leaf_inputs_stc_metric_policy_afb_mapping_row_tolerance_and_symmetric_route_rejection_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "iss_22_remains_asymmetric_context_only_and_does_not_promote_symmetric_double_leaf_or_triple_leaf_routes"
  },
  {
    assemblyNumber: "ISS-39",
    closeoutPosture: "blocked_high_stc_single_frame_context",
    firstMissingRequirement:
      "iss_39_still_lacks_exact_3p625in_stud_24oc_double_board_afb_3in_mapping_stc_policy_tolerance_and_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "iss_39_high_stc_single_frame_context_does_not_override_knauf_lsf_nrc_or_uris_triple_leaf_families"
  },
  {
    assemblyNumber: "IWS-04",
    closeoutPosture: "blocked_single_wood_stud_context",
    firstMissingRequirement:
      "iws_04_still_lacks_report_number_completion_wood_stud_afb_mapping_stc_oitc_policy_tolerance_and_a046006_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "iws_04_remains_context_only_and_does_not_reopen_a046006_or_generic_timber_routes"
  },
  {
    assemblyNumber: "ESS-05",
    closeoutPosture: "blocked_exterior_envelope_context",
    firstMissingRequirement:
      "ess_05_still_lacks_exterior_envelope_z_girt_air_barrier_cladding_comfortbatt_cavityrock_metric_policy_tolerance_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "ess_05_remains_exterior_envelope_context_and_does_not_promote_interior_wall_floor_masonry_lined_heavy_or_triple_leaf_routes"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "rockwool_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_rockwool_catalog_row_with_exact_live_topology_metric_owner_material_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/rockwool-acoustic-wall-assemblies-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_reorder_defect_remains_real_but_gate_t_paused_the_uris_2006_lane_until_a_rights_safe_source_packet_with_curve_payload_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "calculator_source_gap_revalidation_v10",
    reason:
      "after_rockwool_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_remaining_post_british_gypsum_locators_paused_uris_lane_closed_british_gypsum_and_knauf_rows_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts"
  },
  {
    id: "usg_national_gypsum_georgia_pacific_direct_extraction",
    reason:
      "the_post_british_gypsum_acquisition_gate_left_these_as_lower_ranked_nearby_locators_and_the_project_needs_a_fresh_v10_rerank_before_selecting_another_source_pack",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_POST_BRITISH_GYPSUM_SOURCE_ACQUISITION_V1_PLAN.md"
  },
  {
    id: "internal_pilot_or_productization_only_work",
    reason:
      "controlled_internal_use_and_productization_do_not_increase_source_readiness_or_calculation_accuracy_while_the_user_priority_is_correctness_and_coverage",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V10_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
  requiredArtifacts: [
    "rockwool_gate_a_gate_b_gate_c_closeout_summary",
    "rockwool_iss_iws_ess_row_boundaries_and_material_alias_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "remaining_post_british_gypsum_source_locator_rerank",
    "closed_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts"
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

describe("post ROCKWOOL Acoustic Wall Assemblies source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the ROCKWOOL source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_ROCKWOOL_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "rockwool_acoustic_wall_assemblies_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v10",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_rockwool_closeout",
      selectionStatus:
        "closed_rockwool_acoustic_wall_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v10_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_rockwool_acoustic_wall_assemblies_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B ROCKWOOL row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.assemblyNumber)).toEqual([
      "ISS-00",
      "ISS-22",
      "ISS-39",
      "IWS-04",
      "ESS-05"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 100)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.assemblyNumber === "ISS-39")).toMatchObject({
      closeoutPosture: "blocked_high_stc_single_frame_context"
    });
    expect(GATE_B_CLOSEOUT_EVIDENCE.find((row) => row.assemblyNumber === "ESS-05")?.protectedBoundary).toContain(
      "exterior_envelope"
    );
  });

  it("keeps the original split-rockwool triple-leaf answer fail-closed instead of source-validating it", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(splitRockwool.metrics.estimatedRwDb).toBe(53);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("broad_accuracy_wall_multileaf_triple_leaf_local_substitution_runtime_corridor");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "wall_triple_leaf_uris_2006_runtime_reopen")).toMatchObject({
      runtimeEligibleNow: false,
      selectedNext: false
    });
  });

  it("selects source-gap revalidation v10 before runtime, direct source-pack extraction, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v10",
        reason:
          "after_rockwool_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_remaining_post_british_gypsum_locators_paused_uris_lane_closed_british_gypsum_and_knauf_rows_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 100)).toBe(true);
  });

  it("defines the selected v10 revalidation scope without importing rows", () => {
    expect(SELECTED_V10_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_rockwool_source_pack_closeout",
      requiredArtifacts: [
        "rockwool_gate_a_gate_b_gate_c_closeout_summary",
        "rockwool_iss_iws_ess_row_boundaries_and_material_alias_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "remaining_post_british_gypsum_source_locator_rerank",
        "closed_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V10_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v10-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on the v10 next-slice selection and frozen surfaces", () => {
    const docs = REQUIRED_CLOSEOUT_SURFACES.map((path) => readRepoFile(path)).join("\n");

    expect(docs).toContain(POST_ROCKWOOL_GATE_C_CLOSEOUT.closedImplementationSlice);
    expect(docs).toContain(POST_ROCKWOOL_GATE_C_CLOSEOUT.selectionStatus);
    expect(docs).toContain(POST_ROCKWOOL_GATE_C_CLOSEOUT.selectedImplementationSlice);
    expect(docs).toContain(POST_ROCKWOOL_GATE_C_CLOSEOUT.nextExecutionAction);
    expect(docs).toContain(POST_ROCKWOOL_GATE_C_CLOSEOUT.targetFirstGateFile);

    for (const row of GATE_B_CLOSEOUT_EVIDENCE) {
      expect(docs, row.assemblyNumber).toContain(row.assemblyNumber);
      expect(docs, row.protectedBoundary).toContain(row.protectedBoundary);
    }

    for (const surface of FROZEN_SURFACES) {
      expect(docs, surface).toContain(surface);
    }
  });
});
