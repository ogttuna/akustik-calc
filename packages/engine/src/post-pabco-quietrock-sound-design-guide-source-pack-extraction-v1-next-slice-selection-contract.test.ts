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

type PabcoCloseoutEvidence = {
  closeoutPosture:
    | "blocked_indexed_multilayer_quietrock_530_context"
    | "blocked_steel_stud_54mil_high_stc_context"
    | "blocked_steel_stud_68mil_resilient_channel_context"
    | "blocked_wood_stud_2x6_quietrock_530_context"
    | "blocked_wood_stud_resilient_channel_quietrock_es_context"
    | "blocked_wood_stud_single_cavity_quietrock_es_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  rowId: string;
};

const POST_PABCO_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v14",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_pabco_closeout",
  selectionStatus:
    "closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_pabco_quietrock_sound_design_guide_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly PabcoCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_wood_stud_single_cavity_quietrock_es_context",
    firstMissingRequirement:
      "pabco_pgd_w_646_16_still_lacks_downloaded_summary_report_payload_or_source_curve_metric_owner_quietrock_es_pabco_type_x_glass_fiber_mapping_tolerance_owner_and_timber_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes",
    rowId: "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730"
  },
  {
    closeoutPosture: "blocked_wood_stud_resilient_channel_quietrock_es_context",
    firstMissingRequirement:
      "pabco_pgd_w_445_16_still_lacks_summary_report_payload_resilient_channel_side_policy_quietrock_es_type_x_glass_fiber_mapping_metric_owner_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar",
    rowId: "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745"
  },
  {
    closeoutPosture: "blocked_indexed_multilayer_quietrock_530_context",
    firstMissingRequirement:
      "pabco_pgd_w_449_24_still_lacks_fresh_live_row_or_summary_report_payload_quietrock_530_multilayer_material_mapping_nrc_tla_locator_policy_metric_owner_tolerance_owner_and_triple_leaf_negative_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion",
    rowId: "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035"
  },
  {
    closeoutPosture: "blocked_steel_stud_68mil_resilient_channel_context",
    firstMissingRequirement:
      "pabco_pgd_68_534_16_still_lacks_summary_report_payload_68_mil_steel_stud_gauge_mapping_resilient_channel_side_policy_quietrock_es_type_x_glass_fiber_metric_owner_tolerance_owner_and_lsf_anchor_precedence_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors",
    rowId: "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611"
  },
  {
    closeoutPosture: "blocked_steel_stud_54mil_high_stc_context",
    firstMissingRequirement:
      "pabco_pgd_546_407_16_still_lacks_summary_report_payload_54_mil_6in_steel_stud_resilient_channel_double_type_x_mapping_stc_metric_policy_field_output_rejection_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors",
    rowId: "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358"
  },
  {
    closeoutPosture: "blocked_wood_stud_2x6_quietrock_530_context",
    firstMissingRequirement:
      "pabco_pgd_w6_467_24_still_lacks_summary_report_payload_quietrock_530_or_530rf_material_mapping_2x6_24oc_wood_stud_mapping_metric_policy_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary: "pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route",
    rowId: "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "pabco_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_pabco_quietrock_row_with_downloaded_payload_source_owned_curve_or_metric_policy_exact_live_topology_material_alias_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v14",
    reason:
      "after_pabco_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_certainteed_silentfx_nrc_astc_ga600_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_defect_remains_the_priority_correctness_problem_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_rating_derivation_uncertainty_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "certainteed_silentfx_nrc_astc_direct_extraction",
    reason:
      "certainteed_silentfx_and_nrc_astc_context_is_ranked_nearby_but_needs_post_pabco_rerank_to_separate_astc_field_flanking_context_from_lab_runtime_rows_metric_policy_and_visible_test_ownership",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md"
  },
  {
    id: "gypsum_association_ga600_direct_import",
    reason:
      "ga_600_2024_remains_authoritative_context_but_not_runtime_import_without_rights_safe_current_row_payloads_metric_policy_material_mapping_tolerance_owner_and_paired_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md"
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

const SELECTED_V14_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
  requiredArtifacts: [
    "pabco_gate_a_gate_b_gate_c_closeout_summary",
    "pabco_quietrock_stc_report_locator_material_alias_and_family_boundary_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "certainteed_silentfx_nrc_astc_ga600_and_remaining_official_locator_rerank_after_pabco",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts"
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

describe("post PABCO QuietRock Sound Design Guide source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the PABCO source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_PABCO_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "pabco_quietrock_sound_design_guide_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v14",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_pabco_closeout",
      selectionStatus:
        "closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_pabco_quietrock_sound_design_guide_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B PABCO row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.rowId)).toEqual([
      "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730",
      "PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745",
      "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035",
      "PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611",
      "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358",
      "PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 140)).toBe(true);
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035"
      )
    ).toMatchObject({ closeoutPosture: "blocked_indexed_multilayer_quietrock_530_context" });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358"
      )?.protectedBoundary
    ).toContain("field_outputs");
  });

  it("keeps STC/report context and the split-rockwool answer fail-closed", () => {
    const splitRockwool = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(splitRockwool.metrics.estimatedRwDb).toBe(41);
    expect(splitRockwool.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(splitRockwool.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(
      NEXT_SLICE_SELECTION_MATRIX.find((candidate) => candidate.id === "wall_triple_leaf_uris_2006_runtime_reopen")
    ).toMatchObject({
      runtimeEligibleNow: false,
      selectedNext: false
    });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730"
      )?.firstMissingRequirement
    ).toContain("metric_owner");
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035"
      )?.firstMissingRequirement
    ).toContain("triple_leaf_negative_tests");
  });

  it("selects source-gap revalidation v14 before runtime, direct source extraction, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v14",
        reason:
          "after_pabco_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_certainteed_silentfx_nrc_astc_ga600_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("defines the selected v14 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V14_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout",
      requiredArtifacts: [
        "pabco_gate_a_gate_b_gate_c_closeout_summary",
        "pabco_quietrock_stc_report_locator_material_alias_and_family_boundary_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "certainteed_silentfx_nrc_astc_ga600_and_remaining_official_locator_rerank_after_pabco",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v14 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V14_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_PABCO_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_PABCO_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_PABCO_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("pabco_gate_b_found_no_runtime_ready_row_selected_closeout");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
