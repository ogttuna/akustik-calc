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

type CertainTeedCloseoutEvidence = {
  closeoutPosture:
    | "blocked_nrc_astc_field_flanking_context"
    | "blocked_silentfx_u309_product_stc_context"
    | "blocked_silentfx_u465_product_stc_context";
  firstMissingRequirement: string;
  newRuntimeImportReadyNow: false;
  protectedBoundary: string;
  rowId: string;
};

const POST_CERTAINTEED_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v15",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_certainteed_closeout",
  selectionStatus:
    "closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row",
  sliceId: "post_certainteed_silentfx_nrc_astc_source_pack_extraction_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts",
  "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts",
  "packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const GATE_B_CLOSEOUT_EVIDENCE: readonly CertainTeedCloseoutEvidence[] = [
  {
    closeoutPosture: "blocked_nrc_astc_field_flanking_context",
    firstMissingRequirement:
      "nrc_certainteed_astc_high_rise_examples_need_example_level_rights_safe_payload_direct_flanking_split_policy_astc_to_rw_or_explicit_rejection_policy_silentfx_typex_certainteed_typex_25_gauge_steel_stud_mapping_tolerance_owner_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs",
    rowId: "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018"
  },
  {
    closeoutPosture: "blocked_silentfx_u465_product_stc_context",
    firstMissingRequirement:
      "ctg_2481_u465_stc57_still_needs_rights_safe_current_pdf_payload_full_ul_u465_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_lsf_anchor_precedence_tests_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes",
    rowId: "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE"
  },
  {
    closeoutPosture: "blocked_silentfx_u309_product_stc_context",
    firstMissingRequirement:
      "ctg_2481_u309_stc51_still_needs_rights_safe_current_pdf_payload_full_ul_u309_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_runtime_value_or_rejection_pin_and_visible_tests",
    newRuntimeImportReadyNow: false,
    protectedBoundary:
      "certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs",
    rowId: "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly CloseoutCandidate[] = [
  {
    id: "certainteed_runtime_import_support_confidence_or_visible_promotion",
    reason:
      "gate_b_found_no_certainteed_or_nrc_row_with_direct_lab_rw_or_dntw_metric_policy_rights_safe_current_payload_exact_live_topology_material_alias_mapping_tolerance_owner_negative_boundaries_and_paired_engine_web_visible_tests",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts"
  },
  {
    id: "calculator_source_gap_revalidation_v15",
    reason:
      "after_certainteed_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_ga600_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_split_rockwool_defect_remains_the_priority_correctness_problem_but_gate_t_paused_the_uris_2006_source_lane_until_a_rights_safe_source_packet_with_curve_data_rating_derivation_uncertainty_and_chain_of_custody_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "gypsum_association_ga600_direct_import",
    reason:
      "ga600_remains_authoritative_context_but_cannot_be_selected_for_direct_runtime_import_until_current_rights_safe_row_payloads_metric_policy_exact_design_mapping_material_alias_tolerance_owner_negative_boundaries_and_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "direct_new_manufacturer_source_pack_without_rerank",
    reason:
      "remaining_official_or_near_source_surfaces_need_a_fresh_post_certainteed_rerank_against_closed_us_rows_and_the_paused_triple_leaf_source_lane_before_another_narrow_extraction_slice_is_selected",
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

const SELECTED_V15_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
  requiredArtifacts: [
    "certainteed_gate_a_gate_b_gate_c_closeout_summary",
    "certainteed_astc_stc_onesource_material_alias_and_family_boundary_blockers",
    "paused_uris_2006_triple_leaf_source_packet_lane_status",
    "closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
    "gypsum_association_ga600_remaining_official_locator_rerank_after_certainteed",
    "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
    "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts"
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

describe("post CertainTeed SilentFX NRC ASTC source-pack extraction Gate C next-slice selection contract", () => {
  it("closes the CertainTeed source-pack extraction slice without runtime or visible-surface movement", () => {
    expect(POST_CERTAINTEED_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "certainteed_silentfx_nrc_astc_source_pack_extraction_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_mapping_tolerance_decision_no_runtime",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v15",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_certainteed_closeout",
      selectionStatus:
        "closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row",
      sliceId: "post_certainteed_silentfx_nrc_astc_source_pack_extraction_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses Gate B CertainTeed row decisions as closeout evidence, not import permission", () => {
    expect(GATE_B_CLOSEOUT_EVIDENCE.map((row) => row.rowId)).toEqual([
      "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018",
      "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE",
      "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
    ]);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.newRuntimeImportReadyNow === false)).toBe(true);
    expect(GATE_B_CLOSEOUT_EVIDENCE.every((row) => row.firstMissingRequirement.length > 170)).toBe(true);
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018"
      )
    ).toMatchObject({ closeoutPosture: "blocked_nrc_astc_field_flanking_context" });
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE"
      )?.firstMissingRequirement
    ).toContain("lsf_anchor_precedence_tests");
  });

  it("keeps ASTC, product STC, OneSource payload gaps, and split-rockwool fail-closed", () => {
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
        (row) => row.rowId === "NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018"
      )?.firstMissingRequirement
    ).toContain("direct_flanking_split_policy");
    expect(
      GATE_B_CLOSEOUT_EVIDENCE.find(
        (row) => row.rowId === "CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE"
      )?.firstMissingRequirement
    ).toContain("runtime_value_or_rejection_pin");
  });

  it("selects source-gap revalidation v15 before runtime, direct GA600 import, direct source extraction, pilot, or productization work", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v15",
        reason:
          "after_certainteed_gate_b_and_gate_c_close_no_runtime_the_next_honest_accuracy_step_is_to_rerank_the_paused_uris_2006_triple_leaf_lane_closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_rows_ga600_remaining_official_locators_clt_floor_no_stud_lined_heavy_and_historical_blockers_before_any_runtime_or_visible_promotion",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("defines the selected v15 Gate A scope before any runtime or visible movement", () => {
    expect(SELECTED_V15_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout",
      requiredArtifacts: [
        "certainteed_gate_a_gate_b_gate_c_closeout_summary",
        "certainteed_astc_stc_onesource_material_alias_and_family_boundary_blockers",
        "paused_uris_2006_triple_leaf_source_packet_lane_status",
        "closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh",
        "gypsum_association_ga600_remaining_official_locator_rerank_after_certainteed",
        "clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank",
        "runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on v15 as the next no-runtime source-gap revalidation", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md"),
      readRepoFile(SELECTED_V15_NEXT_SLICE_SCOPE.selectedPlanningSurface)
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_CERTAINTEED_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_CERTAINTEED_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_CERTAINTEED_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("certainteed_gate_b_found_no_runtime_ready_row_selected_closeout");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
    }
  });

  it("keeps the frozen-surface and validation contract explicit", () => {
    const gateCCheckpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-03_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(gateCCheckpoint).toContain(surface);
    }

    expect(gateCCheckpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(gateCCheckpoint).toContain("pnpm calculator:gate:current");
    expect(gateCCheckpoint).toContain("git diff --check");
  });
});
