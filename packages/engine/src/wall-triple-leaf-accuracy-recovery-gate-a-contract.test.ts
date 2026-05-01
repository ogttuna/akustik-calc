import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  currentMultileafAnswerAcceptedForInternalAccuracy: false,
  evidencePromotion: false,
  landedGate: "gate_a_user_pdf_repro_and_missing_topology_contract",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_topology_input_model_and_missing_field_policy",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  selectionStatus:
    "selected_wall_triple_leaf_accuracy_recovery_v1_after_user_pdf_repro_showed_current_multileaf_blend_is_not_a_validated_calculation",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_TRIPLE_LEAF_TOPOLOGY_INPUTS = [
  "side_a_leaf_layer_group",
  "cavity_1_depth_fill_and_absorption_group",
  "internal_leaf_layer_group",
  "internal_leaf_coupling_or_bridge_class",
  "cavity_2_depth_fill_and_absorption_group",
  "side_b_leaf_layer_group",
  "stud_or_frame_support_topology",
  "metric_policy_lab_field_or_building_prediction",
  "source_tolerance_owner",
  "paired_engine_and_web_visible_tests"
] as const;

const ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
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

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const FIELD_CONTEXT_WITH_FRAMING_METADATA: AirborneContext = {
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

function calculateDynamicWall(
  layers: readonly LayerInput[],
  airborneContext: AirborneContext,
  targetOutputs: readonly RequestedOutputId[]
) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectFragment(items: readonly string[], fragment: string, label: string) {
  expect(items.some((item) => item.includes(fragment)), `${label} should include ${fragment}`).toBe(true);
}

describe("wall triple-leaf accuracy recovery Gate A", () => {
  it("pins the user PDF repro as an accuracy defect instead of a validated calculation", () => {
    const adjacentLab = calculateDynamicWall(ADJACENT_ROCKWOOL_STACK, LAB_CONTEXT, ["Rw"]);
    const splitLab = calculateDynamicWall(SPLIT_ROCKWOOL_STACK, LAB_CONTEXT, ["Rw"]);

    expect({
      confidence: adjacentLab.dynamicAirborneTrace?.confidenceClass,
      family: adjacentLab.dynamicAirborneTrace?.detectedFamily,
      rw: adjacentLab.metrics.estimatedRwDb,
      strategy: adjacentLab.dynamicAirborneTrace?.strategy,
      visibleLeafCount: adjacentLab.dynamicAirborneTrace?.visibleLeafCount
    }).toEqual({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate",
      visibleLeafCount: 2
    });

    expect({
      cavityCount: splitLab.dynamicAirborneTrace?.cavityCount,
      confidence: splitLab.dynamicAirborneTrace?.confidenceClass,
      family: splitLab.dynamicAirborneTrace?.detectedFamily,
      rw: splitLab.metrics.estimatedRwDb,
      selectedMethod: splitLab.dynamicAirborneTrace?.selectedMethod,
      solverSpreadRwDb: splitLab.dynamicAirborneTrace?.solverSpreadRwDb,
      strategy: splitLab.dynamicAirborneTrace?.strategy,
      visibleLeafCount: splitLab.dynamicAirborneTrace?.visibleLeafCount
    }).toEqual({
      cavityCount: 2,
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      selectedMethod: "screening_mass_law_curve_seed_v3",
      solverSpreadRwDb: 18,
      strategy: "multileaf_screening_blend",
      visibleLeafCount: 3
    });

    expect(adjacentLab.metrics.estimatedRwDb - splitLab.metrics.estimatedRwDb).toBe(10);
    expectFragment(splitLab.warnings, "not a premium multi-cavity solver", "split-stack solver warning");
    expectFragment(splitLab.warnings, "triple-leaf partition", "split-stack triple-leaf warning");
  });

  it("proves the existing stud fields do not provide the missing triple-leaf topology", () => {
    const field = calculateDynamicWall(SPLIT_ROCKWOOL_STACK, FIELD_CONTEXT_WITH_FRAMING_METADATA, [
      "R'w",
      "DnT,w"
    ]);

    expect({
      cavityCount: field.dynamicAirborneTrace?.cavityCount,
      confidence: field.dynamicAirborneTrace?.confidenceClass,
      dnTw: field.metrics.estimatedDnTwDb,
      family: field.dynamicAirborneTrace?.detectedFamily,
      rwPrime: field.metrics.estimatedRwPrimeDb,
      strategy: field.dynamicAirborneTrace?.strategy,
      visibleLeafCount: field.dynamicAirborneTrace?.visibleLeafCount
    }).toEqual({
      cavityCount: 2,
      confidence: "low",
      dnTw: 36,
      family: "multileaf_multicavity",
      rwPrime: 34,
      strategy: "multileaf_screening_blend",
      visibleLeafCount: 3
    });

    expectFragment(
      field.warnings,
      "Explicit framed-wall metadata was not allowed to force the stud-wall lane",
      "framed metadata guard"
    );
    expectFragment(field.warnings, "not a premium multi-cavity solver", "field multileaf warning");
  });

  it("selects a topology-input recovery slice before any numeric promotion", () => {
    expect(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A).toMatchObject({
      apiShapeChange: false,
      currentMultileafAnswerAcceptedForInternalAccuracy: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_b_topology_input_model_and_missing_field_policy",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-b-contract.test.ts",
      sliceId: "wall_triple_leaf_accuracy_recovery_v1"
    });
    expect(REQUIRED_TRIPLE_LEAF_TOPOLOGY_INPUTS).toEqual([
      "side_a_leaf_layer_group",
      "cavity_1_depth_fill_and_absorption_group",
      "internal_leaf_layer_group",
      "internal_leaf_coupling_or_bridge_class",
      "cavity_2_depth_fill_and_absorption_group",
      "side_b_leaf_layer_group",
      "stud_or_frame_support_topology",
      "metric_policy_lab_field_or_building_prediction",
      "source_tolerance_owner",
      "paired_engine_and_web_visible_tests"
    ]);
  });

  it("keeps the docs aligned with the urgent recovery slice", () => {
    const activeDocs = [
      "AGENTS.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"
    ] as const;

    for (const relativePath of activeDocs) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      expect(readFileSync(absolutePath, "utf8")).toContain(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A.sliceId);
    }

    const gateACheckpoint = join(
      REPO_ROOT,
      "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A_HANDOFF.md"
    );
    expect(existsSync(gateACheckpoint), "Gate A checkpoint should exist").toBe(true);
    expect(readFileSync(gateACheckpoint, "utf8")).toContain(
      WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_A.selectionStatus
    );
  });
});
