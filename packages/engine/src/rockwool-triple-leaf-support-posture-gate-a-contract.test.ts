import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  evaluateRockwoolTripleLeafSupportPosture,
  ROCKWOOL_TRIPLE_LEAF_FIELD_SCREENING_OUTPUTS,
  ROCKWOOL_TRIPLE_LEAF_LAB_SCREENING_OUTPUTS
} from "./rockwool-triple-leaf-support-posture";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_kept_source_required_rockwool_screening_supported_not_exact",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  selectedImplementationSlice: "calculator_source_gap_revalidation_v25",
  selectedNextAction: "gate_a_revalidate_source_gap_order_after_rockwool_support_posture",
  selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md",
  selectionStatus:
    "gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25",
  sliceId: "rockwool_triple_leaf_support_posture_v1",
  sourceBackedExactRuntimeSelectedNow: false,
  supportPromotion: false,
  unsupportedExactOutputPostureSelectedNow: false,
  visibleCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-triple-leaf-support-posture.ts",
  "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts",
  "packages/engine/src/rockwool-triple-leaf-source-required-boundary.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-screening-policy-copy.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_V1_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const ROCKWOOL_SUPPORT_SEMANTICS_DECISION = {
  apiSupportMeaning: "finite_screening_metric_available_not_source_backed_exact",
  artifact: "rockwool_support_semantics_decision",
  exactDesignGradeAllowedNow: false,
  separateScreeningPreviewPathAvailableNow: false,
  shouldMoveToUnsupportedWithoutPreviewNow: false,
  unsupportedWouldHideCurrentDiagnosticValue: true
} as const;

const ROCKWOOL_SCREENING_SUPPORTED_VALUES_NOT_EXACT = {
  artifact: "rockwool_screening_supported_values_not_exact",
  fieldDnTw: 36,
  fieldRwPrime: 34,
  flatListAdjacentSwapRw: 51,
  groupedRw: 41,
  groupedStc: 41,
  sourceValidatedExactNow: false
} as const;

const ROCKWOOL_POSTURE_SURFACE_MAP = {
  apiSurface: "supportedTargetOutputs_retains_finite_screening_metrics",
  artifact: "rockwool_posture_surface_map",
  engineSurface: "source_required_runtime_warning_and_low_confidence_trace",
  fieldSurface: "field_outputs_continue_from_screening_basis_not_design_grade",
  outputSurface: "rockwool_screening_only_warning_posture",
  proposalSurface: "rockwool_screening_only_coverage_copy",
  routeSurface: "multileaf_screening_blend_warning_context"
} as const;

const ROCKWOOL_UNSUPPORTED_WITHOUT_PREVIEW_REJECTED = {
  artifact: "rockwool_unsupported_without_preview_rejected",
  reason:
    "unsupportedTargetOutputs currently renders Not ready and would remove the only useful Rw41 screening diagnostic unless a separate screening-preview path is added first",
  rejectedNow: true,
  requiredBeforeUnsupportedExactPosture: [
    "machine_readable_exact_vs_screening_support_semantics",
    "separate_screening_preview_value_channel",
    "paired_visible_output_and_proposal_copy",
    "hostile_import_and_flat_list_negative_boundaries"
  ]
} as const;

const SOURCE_GAP_REVALIDATION_V25_SELECTED = {
  artifact: "source_gap_revalidation_v25_selected",
  selectedNextSlice: "calculator_source_gap_revalidation_v25",
  selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts",
  selectedReason:
    "rockwool_exact_runtime_is_source_blocked_and_support_posture_is_now_explicit_so_the_next_correct_step_is_to_re-rank_remaining_accuracy_gaps_before_more_runtime_work"
} as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
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

const GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT: AirborneContext = {
  ...GROUPED_SPLIT_ROCKWOOL_CONTEXT,
  connectionType: "line_connection",
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

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
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });
  const posture = evaluateRockwoolTripleLeafSupportPosture(result);

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily,
    posture,
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("Rockwool triple-leaf support posture Gate A contract", () => {
  it("lands Gate A with screening-supported semantics and selects V25 source-gap revalidation", () => {
    expect(ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_kept_source_required_rockwool_screening_supported_not_exact",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      selectedImplementationSlice: "calculator_source_gap_revalidation_v25",
      selectedNextAction: "gate_a_revalidate_source_gap_order_after_rockwool_support_posture",
      selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md",
      selectionStatus:
        "gate_a_kept_rockwool_source_required_values_screening_supported_no_runtime_selected_source_gap_revalidation_v25",
      sliceId: "rockwool_triple_leaf_support_posture_v1",
      sourceBackedExactRuntimeSelectedNow: false,
      supportPromotion: false,
      unsupportedExactOutputPostureSelectedNow: false,
      visibleCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps grouped Rockwool lab outputs supported only as screening values", () => {
    const grouped = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: ROCKWOOL_TRIPLE_LEAF_LAB_SCREENING_OUTPUTS
    });

    expect(ROCKWOOL_SUPPORT_SEMANTICS_DECISION).toEqual({
      apiSupportMeaning: "finite_screening_metric_available_not_source_backed_exact",
      artifact: "rockwool_support_semantics_decision",
      exactDesignGradeAllowedNow: false,
      separateScreeningPreviewPathAvailableNow: false,
      shouldMoveToUnsupportedWithoutPreviewNow: false,
      unsupportedWouldHideCurrentDiagnosticValue: true
    });
    expect(grouped).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });
    expect(grouped.posture).toMatchObject({
      applies: false,
      exactDesignGradeAllowed: false,
      outputSupportChangeRequiredNow: false,
      postureId: "not_rockwool_triple_leaf",
      screeningPreviewRequiredIfUnsupportedSelected: false,
      supportSemantics: "not_applicable",
      unsupportedWithoutSeparatePreviewAllowed: false
    });
    expect(grouped.posture.sourceRequiredBlockers).toEqual([]);
    expect(grouped.warnings).toContain("not measured exact or source-validated");
  });

  it("keeps flat-list adjacent swaps on the double-leaf numeric lane and field outputs as screening continuations", () => {
    const flatSwap = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: swap(SPLIT_ROCKWOOL_STACK, 3, 4),
      outputs: ROCKWOOL_TRIPLE_LEAF_LAB_SCREENING_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_FIELD_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: ROCKWOOL_TRIPLE_LEAF_FIELD_SCREENING_OUTPUTS
    });

    expect(ROCKWOOL_SCREENING_SUPPORTED_VALUES_NOT_EXACT).toEqual({
      artifact: "rockwool_screening_supported_values_not_exact",
      fieldDnTw: 36,
      fieldRwPrime: 34,
      flatListAdjacentSwapRw: 51,
      groupedRw: 41,
      groupedStc: 41,
      sourceValidatedExactNow: false
    });
    expect(flatSwap).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: []
    });
    expect(flatSwap.posture).toMatchObject({
      postureId: "not_rockwool_triple_leaf",
      supportSemantics: "not_applicable",
      unsupportedWithoutSeparatePreviewAllowed: false
    });
    expect(field).toMatchObject({
      confidence: "medium",
      dnTw: 50,
      family: "multileaf_multicavity",
      rwPrime: 49,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["R'w", "DnT,w"],
      unsupported: []
    });
    expect(field.posture).toMatchObject({
      exactDesignGradeAllowed: false,
      postureId: "not_rockwool_triple_leaf",
      supportSemantics: "not_applicable"
    });
  });

  it("rejects unsupported output posture until a separate screening preview path exists", () => {
    expect(ROCKWOOL_UNSUPPORTED_WITHOUT_PREVIEW_REJECTED).toEqual({
      artifact: "rockwool_unsupported_without_preview_rejected",
      reason:
        "unsupportedTargetOutputs currently renders Not ready and would remove the only useful Rw41 screening diagnostic unless a separate screening-preview path is added first",
      rejectedNow: true,
      requiredBeforeUnsupportedExactPosture: [
        "machine_readable_exact_vs_screening_support_semantics",
        "separate_screening_preview_value_channel",
        "paired_visible_output_and_proposal_copy",
        "hostile_import_and_flat_list_negative_boundaries"
      ]
    });
    expect(ROCKWOOL_POSTURE_SURFACE_MAP).toEqual({
      apiSurface: "supportedTargetOutputs_retains_finite_screening_metrics",
      artifact: "rockwool_posture_surface_map",
      engineSurface: "source_required_runtime_warning_and_low_confidence_trace",
      fieldSurface: "field_outputs_continue_from_screening_basis_not_design_grade",
      outputSurface: "rockwool_screening_only_warning_posture",
      proposalSurface: "rockwool_screening_only_coverage_copy",
      routeSurface: "multileaf_screening_blend_warning_context"
    });
  });

  it("keeps docs and current-gate runner aligned with the support posture decision", () => {
    const docs = REQUIRED_ALIGNED_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of [
      ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A.selectionStatus,
      ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A.selectedImplementationSlice,
      ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A.selectedNextAction,
      ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A.selectedNextFile,
      ROCKWOOL_TRIPLE_LEAF_SUPPORT_POSTURE_GATE_A.selectedPlanningSurface,
      ROCKWOOL_SUPPORT_SEMANTICS_DECISION.artifact,
      ROCKWOOL_SCREENING_SUPPORTED_VALUES_NOT_EXACT.artifact,
      ROCKWOOL_POSTURE_SURFACE_MAP.artifact,
      ROCKWOOL_UNSUPPORTED_WITHOUT_PREVIEW_REJECTED.artifact,
      SOURCE_GAP_REVALIDATION_V25_SELECTED.artifact
    ]) {
      expect(docs, token).toContain(token);
    }

    expect(SOURCE_GAP_REVALIDATION_V25_SELECTED).toEqual({
      artifact: "source_gap_revalidation_v25_selected",
      selectedNextSlice: "calculator_source_gap_revalidation_v25",
      selectedNextFile: "packages/engine/src/calculator-source-gap-revalidation-v25-gate-a-contract.test.ts",
      selectedReason:
        "rockwool_exact_runtime_is_source_blocked_and_support_posture_is_now_explicit_so_the_next_correct_step_is_to_re-rank_remaining_accuracy_gaps_before_more_runtime_work"
    });

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/rockwool-triple-leaf-support-posture-gate-a-contract.test.ts");
  });
});
