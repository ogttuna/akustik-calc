import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: true,
  evidencePromotion: false,
  landedGate: "gate_a_rockwool_flat_list_numeric_recovery_after_user_correctness_clarification",
  numericRuntimeBehaviorChange: true,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: true,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop",
  selectedNextFile: "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts",
  selectionStatus:
    "v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure",
  sliceId: "calculator_source_gap_revalidation_v25",
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const ROCKWOOL_ADJACENT_FLAT_LIST_NUMERIC_RECOVERY = {
  adjacentPdfLikeFieldAfterFix: "R'w 49 / DnT,w 51",
  adjacentPdfLikeLabAfterFix: "Rw 51",
  adjacentStrategyAfterFix: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
  artifact: "rockwool_adjacent_flat_list_numeric_recovery",
  priorBadGuardedCorridor: "multileaf_screening_blend_fail_closed_until_grouped_topology",
  priorBadGuardedValue: "Rw 42 / R'w 40 / DnT,w 41",
  userCorrectnessClarification:
    "confidence and support posture are secondary; the adjacent Rockwool flat-list value must not be pulled into the multileaf penalty without grouped topology"
} as const;

const ROCKWOOL_SPLIT_INTERNAL_LEAF_REMAINS_NUMERIC_OPEN = {
  artifact: "rockwool_split_internal_leaf_remains_numeric_open",
  groupedOrPhysicalSplitCurrentValue: "Rw 41 / R'w 39 / DnT,w 40",
  currentStrategy: "multileaf_screening_blend",
  exactNumericClosedNow: false,
  nextClosureNeeded:
    "decide whether the split internal gypsum leaf is a real physical triple-leaf penalty requiring source/topology ownership, or a flat-list intent ambiguity that should stop for topology input"
} as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

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

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    dnTA: result.metrics.estimatedDnTADb,
    dnTw: result.metrics.estimatedDnTwDb,
    dnW: result.metrics.estimatedDnWDb,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    rwPrime: result.metrics.estimatedRwPrimeDb,
    stc: result.metrics.estimatedStc,
    strategy: result.dynamicAirborneTrace?.strategy,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

describe("calculator source-gap revalidation V25 Gate A", () => {
  it("lands V25 as a numeric correctness correction, not another confidence-only posture pass", () => {
    expect(CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: true,
      evidencePromotion: false,
      landedGate: "gate_a_rockwool_flat_list_numeric_recovery_after_user_correctness_clarification",
      numericRuntimeBehaviorChange: true,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: true,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_a_decide_split_internal_leaf_numeric_model_or_topology_required_stop",
      selectedNextFile: "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts",
      selectionStatus:
        "v25_fixed_adjacent_rockwool_flat_list_numeric_hold_selected_split_internal_leaf_numeric_source_closure",
      sliceId: "calculator_source_gap_revalidation_v25",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("restores the adjacent Rockwool PDF-like stack to the double-leaf numeric corridor", () => {
    const lab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(ROCKWOOL_ADJACENT_FLAT_LIST_NUMERIC_RECOVERY).toEqual({
      adjacentPdfLikeFieldAfterFix: "R'w 49 / DnT,w 51",
      adjacentPdfLikeLabAfterFix: "Rw 51",
      adjacentStrategyAfterFix: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      artifact: "rockwool_adjacent_flat_list_numeric_recovery",
      priorBadGuardedCorridor: "multileaf_screening_blend_fail_closed_until_grouped_topology",
      priorBadGuardedValue: "Rw 42 / R'w 40 / DnT,w 41",
      userCorrectnessClarification:
        "confidence and support posture are secondary; the adjacent Rockwool flat-list value must not be pulled into the multileaf penalty without grouped topology"
    });
    expect(lab).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["Rw", "STC", "C", "Ctr"]
    });
    expect(field).toMatchObject({
      confidence: "medium",
      dnTA: 48.8,
      dnTw: 51,
      dnW: 49,
      family: "double_leaf",
      rwPrime: 49,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY,
      supported: ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"]
    });
    expect(field.warnings).toContain("kept the current double-leaf numeric lane");
  });

  it("keeps the physical split/internal-leaf value open as the next numeric correctness closure", () => {
    const lab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const field = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });

    expect(ROCKWOOL_SPLIT_INTERNAL_LEAF_REMAINS_NUMERIC_OPEN).toEqual({
      artifact: "rockwool_split_internal_leaf_remains_numeric_open",
      groupedOrPhysicalSplitCurrentValue: "Rw 41 / R'w 39 / DnT,w 40",
      currentStrategy: "multileaf_screening_blend",
      exactNumericClosedNow: false,
      nextClosureNeeded:
        "decide whether the split internal gypsum leaf is a real physical triple-leaf penalty requiring source/topology ownership, or a flat-list intent ambiguity that should stop for topology input"
    });
    expect(lab).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      stc: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(field).toMatchObject({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
  });

  it("keeps active docs aligned with the numeric recovery and next split-internal-leaf closure", () => {
    const requiredFiles = [
      "AGENTS.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_PLAN.md",
      "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md",
      "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A_HANDOFF.md"
    ] as const;

    for (const path of requiredFiles) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const docs = requiredFiles.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain("rockwool_adjacent_flat_list_numeric_recovery");
      expect(doc).toContain("R'w 49");
      expect(doc).toContain("DnT,w 51");
      expect(doc).toContain("rockwool_split_internal_leaf_remains_numeric_open");
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A.selectedNextFile);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A.selectedNextAction);
      expect(doc).toContain(CALCULATOR_SOURCE_GAP_REVALIDATION_V25_GATE_A.selectionStatus);
    }
  });
});
