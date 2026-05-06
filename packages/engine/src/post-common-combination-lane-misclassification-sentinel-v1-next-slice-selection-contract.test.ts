import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type CloseoutFinding = {
  currentPosture: string;
  id: string;
  nextOwner: "calculator_source_gap_revalidation_v18";
  protectedBoundary: string;
  runtimeImportReadyNow: false;
  sourceValidatedNow: false;
};

type NextSliceCandidate = {
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "common_combination_lane_misclassification_sentinel_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  gateCNumericRuntimeBehaviorChange: false,
  latestLandedGate: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
  latestLandedStatus: "common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice",
  nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeCandidateReadyNow: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v18",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
  selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_common_combination_sentinel",
  selectionStatus:
    "closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18",
  sliceId: "post_common_combination_lane_misclassification_sentinel_v1_next_slice_selection",
  sourceReadyAccuracyPackAvailable: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts",
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts",
  "packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts",
  "packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const CLOSED_SENTINEL_FINDINGS: readonly CloseoutFinding[] = [
  {
    currentPosture: "grouped_split_rockwool_rw_41_low_confidence_screening_not_source_validated",
    id: "split_rockwool_grouped_rw41_blocked_source_packet",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "paused_waiting_rights_safe_source_packet",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "flat_split_rockwool_swap_guard_green_low_confidence_multileaf_rw_42",
    id: "split_rockwool_flat_swap_fail_closed_guard_green",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "multileaf_screening_blend_fail_closed_until_grouped_topology",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "classic_framed_adjacent_swap_guard_green_low_confidence_multileaf_rw_33",
    id: "classic_framed_adjacent_swap_fail_closed_guard_green",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "aac_board_fill_gap_lined_massive_boundary_remains_documented_fail_closed_risk",
    id: "aac_board_fill_gap_lined_massive_boundary_documented_fail_closed",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "masonry_lined_massive_boundary_drift",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "raw_floor_parity_and_prompt_rows_remain_guarded_without_arbitrary_reorder_claim",
    id: "raw_floor_role_inference_guard_carry_forward",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  },
  {
    currentPosture: "near_source_field_alias_hostile_input_and_digitization_rows_remain_documented_context_only",
    id: "standing_lane_misclassification_monitoring_mandate_carries_forward",
    nextOwner: "calculator_source_gap_revalidation_v18",
    protectedBoundary: "note_test_document_or_easy_fix",
    runtimeImportReadyNow: false,
    sourceValidatedNow: false
  }
] as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    id: "calculator_source_gap_revalidation_v18",
    reason:
      "after_gate_b_reprobed_the_common_combination_sentinel_matrix_and_found_no_small_bounded_fix_or_source_ready_runtime_candidate_the_next_honest_accuracy_step_is_to_rerank_the_source_accuracy_backlog_against_the_new_sentinel_posture_guard_green_split_rockwool_and_classic_swaps_documented_lined_massive_boundary_raw_floor_role_prompt_near_source_field_output_hostile_input_and_curve_provenance_risks_before_any_import_or_value_retune",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts"
  },
  {
    id: "wall_triple_leaf_uris_2006_runtime_reopen",
    reason:
      "the_original_rockwool_triple_leaf_accuracy_problem_remains_high_priority_but_gate_t_still_blocks_exact_runtime_reopen_until_a_rights_safe_uris_2006_source_packet_or_equivalent_source_owned_curve_payload_exists",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    id: "direct_common_combination_runtime_fix",
    reason:
      "gate_b_found_guard_green_or_documented_fail_closed_watch_rows_but_no_small_bounded_fix_ready_now_so_direct_runtime_movement_would_blur_screening_values_and_field_output_posture_without_a_new_exact_topology_source_or_tolerance_owner",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    id: "closed_manufacturer_source_import",
    reason:
      "closed_knauf_british_gypsum_rockwool_usg_national_gypsum_georgia_pacific_pabco_and_certainteed_contexts_still_lack_exact_live_topology_metric_material_mapping_tolerance_negative_boundary_and_paired_visible_test_ownership",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
  },
  {
    id: "productization_or_report_polish",
    reason:
      "productization_remains_important_but_user_priority_is_calculation_correctness_and_common_stack_lane_honesty_so_source_gap_revalidation_stays_ahead_while_runtime_candidates_are_absent",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const SELECTED_V18_NEXT_SLICE_SCOPE = {
  firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
  requiredArtifacts: [
    "common_combination_gate_b_reprobe_summary",
    "sentinel_guard_green_and_fail_closed_boundary_carry_forward",
    "post_sentinel_source_ready_runtime_candidate_rerank",
    "rockwool_uris_2006_source_packet_status",
    "floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status",
    "selected_next_slice_with_target_gate_file_and_validation_scope"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts"
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

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const WALL_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FLOOR_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactFloorSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function exactFloorLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactFloorSystem(id).match, mode);
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function labSnapshot(layers: readonly LayerInput[], context: AirborneContext = WALL_LAB_CONTEXT) {
  const result = calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    strategy: result.dynamicAirborneTrace?.strategy,
    warnings: result.warnings.join("\n")
  };
}

function floorSnapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, { targetOutputs: FLOOR_OUTPUTS });

  return {
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lnW: result.impact?.LnW ?? null,
    rw: result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("post common-combination lane-misclassification sentinel Gate C next-slice selection contract", () => {
  it("closes the sentinel no-runtime and selects source-gap revalidation v18", () => {
    expect(POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "common_combination_lane_misclassification_sentinel_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate: "gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime",
      latestLandedStatus: "common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice",
      nextExecutionAction: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v18",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
      selectedRouteFamily: "calculator_source_accuracy_gap_revalidation_after_common_combination_sentinel",
      selectionStatus:
        "closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18",
      sliceId: "post_common_combination_lane_misclassification_sentinel_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses live sentinel behavior as closeout evidence, not source or value approval", () => {
    const splitGrouped = labSnapshot(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const splitSwapped = labSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const classicSwapped = labSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));
    const heavyBoundary = labSnapshot(swap(HEAVY_MULTILEAF_STACK, 1, 2));
    const rawOpenBox = floorSnapshot(exactFloorLayers("tuas_r5b_open_box_timber_measured_2026", "raw"));
    const rawCltPrompt = floorSnapshot(exactFloorLayers("tuas_x4_clt140_measured_2026", "raw"));

    expect(splitGrouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(splitSwapped).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(splitSwapped.warnings).toContain("Flat-list adjacent-swap sensitivity guard");
    expect(classicSwapped).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 44,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(heavyBoundary).toMatchObject({
      confidence: "low",
      family: "lined_massive_wall",
      rw: 49,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(rawOpenBox).toMatchObject({
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      impactBasis: "open_measured_floor_system_exact_match",
      lnW: 44,
      rw: 75,
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(rawOpenBox.warnings).toContain("does not claim arbitrary raw floor reorder value invariance");
    expect(rawCltPrompt).toMatchObject({
      floorSystemMatchId: null,
      impactBasis: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(rawCltPrompt.warnings).toContain("Floor roles needed before impact output promotion");
    expect(CLOSED_SENTINEL_FINDINGS.every((finding) => finding.runtimeImportReadyNow === false)).toBe(true);
    expect(CLOSED_SENTINEL_FINDINGS.every((finding) => finding.sourceValidatedNow === false)).toBe(true);
  });

  it("selects v18 revalidation before reopening Uris, direct sentinel fixes, source import, or productization", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        id: "calculator_source_gap_revalidation_v18",
        reason:
          "after_gate_b_reprobed_the_common_combination_sentinel_matrix_and_found_no_small_bounded_fix_or_source_ready_runtime_candidate_the_next_honest_accuracy_step_is_to_rerank_the_source_accuracy_backlog_against_the_new_sentinel_posture_guard_green_split_rockwool_and_classic_swaps_documented_lined_massive_boundary_raw_floor_role_prompt_near_source_field_output_hostile_input_and_curve_provenance_risks_before_any_import_or_value_retune",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 130)).toBe(true);
  });

  it("defines the selected v18 Gate A scope before source import or exact promotion", () => {
    expect(SELECTED_V18_NEXT_SLICE_SCOPE).toEqual({
      firstGate: "gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout",
      requiredArtifacts: [
        "common_combination_gate_b_reprobe_summary",
        "sentinel_guard_green_and_fail_closed_boundary_carry_forward",
        "post_sentinel_source_ready_runtime_candidate_rerank",
        "rockwool_uris_2006_source_packet_status",
        "floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status",
        "selected_next_slice_with_target_gate_file_and_validation_scope"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned on Gate C closeout and v18 selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md"),
      readRepoFile("docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT.closedImplementationSlice);
      expect(doc).toContain(POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT.selectedImplementationSlice);
      expect(doc).toContain(POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT.targetFirstGateFile);
      expect(doc).toContain(POST_COMMON_COMBINATION_LANE_SENTINEL_GATE_C_CLOSEOUT.selectionStatus);
      expect(doc).toContain("gate_b_reprobe_findings");
      expect(doc).toContain("split_rockwool_grouped_rw41_blocked_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
      expect(doc).toContain("raw_floor_role_inference");
    }
  });

  it("keeps validation and frozen-surface requirements explicit", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md"
    );

    for (const surface of FROZEN_SURFACES) {
      expect(checkpoint).toContain(surface);
    }

    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
