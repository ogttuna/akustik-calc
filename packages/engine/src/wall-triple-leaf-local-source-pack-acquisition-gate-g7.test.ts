import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafLocalSourcePackAcquisition,
  WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7,
  WALL_TRIPLE_LEAF_ORDER_TOPOLOGY_RISK_REGISTER
} from "./wall-triple-leaf-local-source-pack-acquisition";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G7_HANDOFF.md"
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

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

function calculateDynamicWall(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
}

function swapAdjacent(stack: readonly LayerInput[], leftIndex: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[leftIndex], swapped[leftIndex + 1]] = [swapped[leftIndex + 1]!, swapped[leftIndex]!];
  return swapped;
}

function labSnapshot(layers: readonly LayerInput[]) {
  const result = calculateDynamicWall(layers);

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb,
    strategy: result.dynamicAirborneTrace?.strategy ?? null
  };
}

describe("wall triple-leaf local source-pack acquisition Gate G7", () => {
  it("lands local source-pack intake no-runtime and selects the source-gap/order-risk register", () => {
    expect(WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g8_source_gap_and_order_risk_register",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-gap-and-order-risk-gate-g8.test.ts",
      workbenchInputBehaviorChange: false
    });
  });

  it("maps every Gate G6 requirement to an intake candidate while keeping every candidate blocked", () => {
    const evaluation = evaluateWallTripleLeafLocalSourcePackAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });

    expect(evaluation.requirementIntakes.map((intake) => `${intake.requirement.priority}:${intake.requirement.id}`)).toEqual([
      "1:local_type_c_board_product_mapping",
      "2:rockwool_absorber_equivalence_or_measured_row",
      "3:local_50mm_rockwool_cavity_source_row",
      "4:mlv_limp_mass_triple_leaf_effect_model",
      "5:gypsum_plaster_face_finish_effect_model",
      "6:support_gauge_depth_and_spacing_mapping"
    ]);
    expect(evaluation.requirementIntakes.every((intake) => intake.selectedForGateG8)).toBe(true);
    expect(evaluation.requirementIntakes.every((intake) => !intake.sourcePackReady)).toBe(true);
    expect(evaluation.requirementIntakes.flatMap((intake) => intake.candidates).every((candidate) => !candidate.usableForRuntime)).toBe(true);
    expect(evaluation.sourcePackReadyForMappingTolerance).toBe(false);
    expect(evaluation.usableRuntimeCandidateCount).toBe(0);
  });

  it("records the missing source evidence that still blocks rockwool, local 50 mm cavities, MLV, and plaster", () => {
    const evaluation = evaluateWallTripleLeafLocalSourcePackAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const candidates = evaluation.requirementIntakes.flatMap((intake) => intake.candidates);

    expect(candidates.map((candidate) => `${candidate.requirementId}:${candidate.status}`)).toEqual([
      "local_type_c_board_product_mapping:blocked_needs_local_product_datasheet",
      "rockwool_absorber_equivalence_or_measured_row:blocked_adjacent_reference_only",
      "rockwool_absorber_equivalence_or_measured_row:blocked_needs_direct_measured_or_digitized_row",
      "local_50mm_rockwool_cavity_source_row:blocked_adjacent_reference_only",
      "local_50mm_rockwool_cavity_source_row:blocked_needs_direct_measured_or_digitized_row",
      "mlv_limp_mass_triple_leaf_effect_model:blocked_needs_bounded_effect_source",
      "gypsum_plaster_face_finish_effect_model:blocked_needs_bounded_effect_source",
      "support_gauge_depth_and_spacing_mapping:blocked_needs_topology_input_owner"
    ]);
    expect(candidates.some((candidate) => candidate.blocker.includes("50 mm two-cavity rockwool"))).toBe(true);
    expect(candidates.some((candidate) => candidate.blocker.includes("flow-resistivity/density"))).toBe(true);
    expect(candidates.some((candidate) => candidate.blocker.includes("limp-mass delta model"))).toBe(true);
    expect(candidates.some((candidate) => candidate.blocker.includes("gypsum plaster"))).toBe(true);
  });

  it("preserves the live split-rockwool result until the intake gaps are closed", () => {
    const evaluation = evaluateWallTripleLeafLocalSourcePackAcquisition({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(liveResult.dynamicAirborneTrace?.confidenceClass).toBe("low");
  });

  it("pins rockwool-like sibling route flips as source-gap/order-risk findings", () => {
    const userAdjacent = labSnapshot(ADJACENT_ROCKWOOL_STACK);
    const userSplit = labSnapshot(swapAdjacent(ADJACENT_ROCKWOOL_STACK, 2));
    const classicTripleLeaf = labSnapshot([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const classicSwapped = labSnapshot([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]);
    const heavyMultileaf = labSnapshot([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ]);
    const heavySwapped = labSnapshot([
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ]);

    expect(userAdjacent).toMatchObject({
      family: "double_leaf",
      rw: 51,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(userSplit).toMatchObject({ family: "multileaf_multicavity", rw: 41, strategy: "multileaf_screening_blend" });
    expect((userAdjacent.rw ?? 0) - (userSplit.rw ?? 0)).toBe(10);
    expect(classicTripleLeaf).toMatchObject({ family: "multileaf_multicavity", rw: 32 });
    expect(classicSwapped).toMatchObject({
      family: "double_leaf",
      rw: 44,
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect((classicSwapped.rw ?? 0) - (classicTripleLeaf.rw ?? 0)).toBe(12);
    expect(heavyMultileaf).toMatchObject({ family: "multileaf_multicavity", rw: 39 });
    expect(heavySwapped).toMatchObject({ family: "lined_massive_wall", rw: 49 });
    expect((heavySwapped.rw ?? 0) - (heavyMultileaf.rw ?? 0)).toBeGreaterThanOrEqual(10);
  });

  it("documents the broader order/topology risk register without converting it into runtime movement", () => {
    expect(WALL_TRIPLE_LEAF_ORDER_TOPOLOGY_RISK_REGISTER.map((risk) => risk.id)).toEqual([
      "triple_leaf_double_leaf_route_flip",
      "heavy_multileaf_lined_massive_boundary_flip",
      "masonry_lined_massive_swap_flip",
      "duplicate_stack_family_flip",
      "raw_floor_order_role_inference_sensitivity"
    ]);
    expect(
      WALL_TRIPLE_LEAF_ORDER_TOPOLOGY_RISK_REGISTER.filter((risk) => risk.currentPosture === "new_gate_g7_watch_item").map(
        (risk) => risk.id
      )
    ).toEqual(["triple_leaf_double_leaf_route_flip", "duplicate_stack_family_flip"]);
    expect(WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.runtimeImportSelectedNow).toBe(false);
  });

  it("keeps active docs aligned with Gate G7, Gate G8, and the sibling risk register", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_LOCAL_SOURCE_PACK_ACQUISITION_GATE_G7.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G7 - Local Source-Pack Acquisition Intake");
    expect(plan).toContain("Gate G8 - Source Gap and Order-Risk Register");
    expect(plan).toContain("triple_leaf_double_leaf_route_flip");
    expect(plan).toContain("duplicate_stack_family_flip");
  });
});
