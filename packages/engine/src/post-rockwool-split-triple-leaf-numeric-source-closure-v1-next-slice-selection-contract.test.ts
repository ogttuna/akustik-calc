import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C
} from "./rockwool-split-triple-leaf-numeric-source-closure";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type NextSliceCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeEligibleNow: false;
  selectedNext: boolean;
  targetFile: string;
};

const REQUIRED_CLOSEOUT_SURFACES = [
  "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts",
  "packages/engine/src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts",
  "apps/web/features/workbench/rockwool-split-triple-leaf-numeric-source-closure-gate-b-visible.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
] as const;

const ROCKWOOL_SPLIT_NUMERIC_CLOSURE_GATE_C_SUMMARY = {
  adjacentRecoveredValue: "Rw 51 / R'w 49 / DnT,w 51",
  artifact: "rockwool_split_numeric_closure_gate_c_summary",
  exactSplitRuntimeFixedNow: false,
  flatListSplitDiagnosticValue: "Rw 41 / R'w 39 / DnT,w 40",
  flatListSplitOutputsWithheld: true,
  groupedRockwoolScreeningStillLive: true,
  runtimeSourceEvidenceCreatedByCloseout: false,
  sliceClosed: true
} as const;

const FLAT_LIST_SPLIT_OUTPUT_WITHHOLD_CARRY_FORWARD = {
  artifact: "flat_list_split_output_withhold_carry_forward",
  exactOutputTargetsWithheldUntil: "grouped_topology_or_source_owned_calibrated_model",
  supportedTargetOutputsForFlatListSplit: [],
  unsupportedTargetOutputsForFlatListSplit: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"],
  warning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
} as const;

const SELECTED_V26_SCOPE = {
  artifact: "selected_gate_a_source_gap_revalidation_v26_with_target_file",
  firstGate: "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
  requiredArtifacts: [
    "rockwool_split_numeric_closure_gate_c_summary",
    "flat_list_split_output_withhold_carry_forward",
    "adjacent_rockwool_51_49_51_carry_forward",
    "grouped_rockwool_screening_source_blocker_status",
    "remaining_accuracy_gap_order_after_rockwool_closeout",
    "selected_gate_a_source_gap_revalidation_v26_with_target_file"
  ],
  runtimeBehaviorChange: false,
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
  targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts"
} as const;

const NEXT_SLICE_SELECTION_MATRIX: readonly NextSliceCandidate[] = [
  {
    firstMissingRequirement: "fresh_source_gap_rerank_after_split_output_withhold_closeout",
    id: "calculator_source_gap_revalidation_v26",
    reason:
      "the_rockwool_adjacent_numeric_regression_is_fixed_and_the_flat_list_split_internal_leaf_outputs_are_now_withheld_so_the_next_honest_accuracy_step_is_to_rerank_remaining_wall_floor_source_gaps_and_select_a_runtime_or_data_accuracy_slice_instead_of_more_confidence_or_copy_only_work",
    runtimeEligibleNow: false,
    selectedNext: true,
    targetFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_with_topology_material_metric_tolerance_owners",
    id: "direct_rockwool_split_internal_leaf_exact_runtime_fix",
    reason:
      "the_user_visible_rockwool_split_problem_is_still_not_exact_but_direct_runtime_fix_remains_blocked_until_grouped_topology_or_a_source_owned_calibrated_model_material_mapping_metric_context_tolerance_negative_boundaries_and_paired_visible_tests_exist",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "new_authorized_or_rights_safe_uris_2006_numeric_packet",
    id: "repeat_uris_packet_acquisition_without_new_packet",
    reason:
      "uris_2006_and_related_triple_panel_sources_remain useful model context but no new rights_safe_source_owned_curve_payload_was_created_by_gate_c_so_repeating_acquisition_without_new_packet_would_not_improve_numeric_correctness",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_PLAN.md"
  },
  {
    firstMissingRequirement: "post_v26_selected_accuracy_slice_and_full_opening_validation",
    id: "company_internal_high_accuracy_opening",
    reason:
      "opening_the_calculator_as_high_accuracy_internal_tooling_still_depends_on_v26_selecting_and_closing_the_next_accuracy_gap_plus_current_gate_and_broad_validation_not_on_this_closeout_test_alone",
    runtimeEligibleNow: false,
    selectedNext: false,
    targetFile: "docs/calculator/CURRENT_STATE.md"
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const GROUPED_TRIPLE_LEAF_LAB_CONTEXT: AirborneContext = {
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

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const PDF_LIKE_ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const PDF_LIKE_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function wallResult(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });
}

describe("post Rockwool split triple-leaf numeric source closure Gate C next-slice selection", () => {
  it("closes the split numeric closure and selects source-gap revalidation V26", () => {
    expect(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "rockwool_split_triple_leaf_numeric_source_closure_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      gateCNumericRuntimeBehaviorChange: false,
      latestLandedGate:
        "gate_b_withheld_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
      latestLandedStatus:
        "gate_b_withheld_flat_list_split_internal_leaf_supported_outputs_selected_closeout",
      nextExecutionAction:
        "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportValueChange: false,
      routeCardValueChange: false,
      runtimeCandidateReadyNow: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v26",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
      selectedRouteFamily:
        "calculator_source_accuracy_gap_revalidation_after_rockwool_split_numeric_closure",
      selectionStatus:
        "closed_rockwool_split_triple_leaf_numeric_source_closure_selected_source_gap_revalidation_v26",
      sliceId: "post_rockwool_split_triple_leaf_numeric_source_closure_v1_next_slice_selection",
      sourceReadyAccuracyPackAvailable: false,
      supportDemotion: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts",
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_CLOSEOUT_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves flat-list split withholding, adjacent recovery, and grouped screening boundaries", () => {
    const splitLab = wallResult({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const splitField = wallResult({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const adjacentField = wallResult({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const grouped = wallResult({
      airborneContext: GROUPED_TRIPLE_LEAF_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(ROCKWOOL_SPLIT_NUMERIC_CLOSURE_GATE_C_SUMMARY).toEqual({
      adjacentRecoveredValue: "Rw 51 / R'w 49 / DnT,w 51",
      artifact: "rockwool_split_numeric_closure_gate_c_summary",
      exactSplitRuntimeFixedNow: false,
      flatListSplitDiagnosticValue: "Rw 41 / R'w 39 / DnT,w 40",
      flatListSplitOutputsWithheld: true,
      groupedRockwoolScreeningStillLive: true,
      runtimeSourceEvidenceCreatedByCloseout: false,
      sliceClosed: true
    });
    expect(FLAT_LIST_SPLIT_OUTPUT_WITHHOLD_CARRY_FORWARD).toEqual({
      artifact: "flat_list_split_output_withhold_carry_forward",
      exactOutputTargetsWithheldUntil: "grouped_topology_or_source_owned_calibrated_model",
      supportedTargetOutputsForFlatListSplit: [],
      unsupportedTargetOutputsForFlatListSplit: ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"],
      warning: ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING
    });

    expect(splitLab.metrics).toMatchObject({ estimatedRwDb: 41, estimatedStc: 41 });
    expect(splitLab.supportedTargetOutputs).toEqual([]);
    expect(splitLab.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(splitLab.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);

    expect(splitField.metrics).toMatchObject({ estimatedDnTwDb: 40, estimatedRwPrimeDb: 39 });
    expect(splitField.supportedTargetOutputs).toEqual([]);
    expect(splitField.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(splitField.warnings).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);

    expect(adjacentField.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(adjacentField.metrics).toMatchObject({ estimatedDnTwDb: 51, estimatedRwPrimeDb: 49 });
    expect(adjacentField.supportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);

    expect(grouped.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "multileaf_multicavity",
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction"
    });
    expect(grouped.metrics).toMatchObject({ estimatedRwDb: 50, estimatedStc: 55 });
    expect(grouped.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(grouped.warnings.join("\n")).toContain("family physics prediction");
    expect(grouped.warnings).not.toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_EXACT_OUTPUT_WITHHOLD_WARNING);
  });

  it("selects V26 revalidation before direct exact import, repeated Uris acquisition, or opening", () => {
    expect(NEXT_SLICE_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "fresh_source_gap_rerank_after_split_output_withhold_closeout",
        id: "calculator_source_gap_revalidation_v26",
        reason:
          "the_rockwool_adjacent_numeric_regression_is_fixed_and_the_flat_list_split_internal_leaf_outputs_are_now_withheld_so_the_next_honest_accuracy_step_is_to_rerank_remaining_wall_floor_source_gaps_and_select_a_runtime_or_data_accuracy_slice_instead_of_more_confidence_or_copy_only_work",
        runtimeEligibleNow: false,
        selectedNext: true,
        targetFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.runtimeEligibleNow === false)).toBe(true);
    expect(NEXT_SLICE_SELECTION_MATRIX.every((candidate) => candidate.reason.length > 120)).toBe(true);
  });

  it("defines the selected V26 scope as an accuracy re-rank, not a confidence or copy-only pass", () => {
    expect(SELECTED_V26_SCOPE).toEqual({
      artifact: "selected_gate_a_source_gap_revalidation_v26_with_target_file",
      firstGate: "gate_a_revalidate_source_gap_order_after_rockwool_split_numeric_closure_closeout",
      requiredArtifacts: [
        "rockwool_split_numeric_closure_gate_c_summary",
        "flat_list_split_output_withhold_carry_forward",
        "adjacent_rockwool_51_49_51_carry_forward",
        "grouped_rockwool_screening_source_blocker_status",
        "remaining_accuracy_gap_order_after_rockwool_closeout",
        "selected_gate_a_source_gap_revalidation_v26_with_target_file"
      ],
      runtimeBehaviorChange: false,
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V26_PLAN.md",
      targetFirstGateFile: "packages/engine/src/calculator-source-gap-revalidation-v26-gate-a-contract.test.ts"
    });
  });

  it("keeps active docs aligned with Gate C closeout and V26 selection", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C.selectionStatus);
      expect(contents).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C.selectedImplementationSlice);
      expect(contents).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C.targetFirstGateFile);
      expect(contents).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C.selectedPlanningSurface);
      expect(contents).toContain("rockwool_split_numeric_closure_gate_c_summary");
      expect(contents).toContain("flat_list_split_output_withhold_carry_forward");
      expect(contents).toContain("adjacent_rockwool_51_49_51_carry_forward");
      expect(contents).toContain("grouped_rockwool_screening_source_blocker_status");
      expect(contents).toContain("remaining_accuracy_gap_order_after_rockwool_closeout");
      expect(contents).toContain("selected_gate_a_source_gap_revalidation_v26_with_target_file");
    }
  });

  it("keeps validation and runner requirements explicit", () => {
    const checkpoint = readRepoFile(
      "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_C_CLOSEOUT_HANDOFF.md"
    );
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts"
    );
    expect(checkpoint).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts --maxWorkers=1"
    );
    expect(checkpoint).toContain("pnpm calculator:gate:current");
    expect(checkpoint).toContain("git diff --check");
  });
});
