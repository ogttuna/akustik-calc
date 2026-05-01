import { describe, expect, it } from "vitest";

import { AirborneContextSchema, type AirborneContext, type LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafTopologyReadiness,
  REQUIRED_WALL_TRIPLE_LEAF_TOPOLOGY_FIELDS,
  WALL_TRIPLE_LEAF_IMPLEMENTATION_BLOCKERS
} from "./wall-triple-leaf-topology-readiness";

const WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B = {
  apiShapeChange: true,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_topology_input_model_and_missing_field_policy",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_source_calibrated_triple_leaf_solver",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts",
  selectedPlanningSurface: "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  selectionStatus:
    "landed_wall_triple_leaf_topology_input_contract_no_numeric_promotion_and_selected_source_calibrated_solver_gate_c",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceReadyRuntimePackAvailable: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

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

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

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

const PARTIAL_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    topologyMode: "grouped_triple_leaf"
  }
};

function calculateDynamicWall(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
}

function expectWarning(result: ReturnType<typeof calculateDynamicWall>, fragment: string) {
  expect(result.warnings.some((warning) => warning.includes(fragment)), `missing warning: ${fragment}`).toBe(true);
}

describe("wall triple-leaf accuracy recovery Gate B", () => {
  it("adds a generic grouped wall topology input contract to airborne context", () => {
    expect(() => AirborneContextSchema.parse(COMPLETE_TRIPLE_LEAF_CONTEXT)).not.toThrow();
    expect(AirborneContextSchema.parse(COMPLETE_TRIPLE_LEAF_CONTEXT).wallTopology).toMatchObject({
      internalLeafCoupling: "independent",
      sideALeafLayerIndices: [0, 1, 2],
      sideBLeafLayerIndices: [6, 7, 8],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    });
  });

  it("fails closed on detected triple-leaf walls when topology groups are absent", () => {
    const result = calculateDynamicWall(SPLIT_ROCKWOOL_STACK, LAB_CONTEXT);
    const readiness = evaluateWallTripleLeafTopologyReadiness({
      airborneContext: LAB_CONTEXT,
      cavityCount: result.dynamicAirborneTrace?.cavityCount ?? 0,
      detectedFamily: result.dynamicAirborneTrace?.detectedFamily ?? "single_leaf_panel",
      visibleLeafCount: result.dynamicAirborneTrace?.visibleLeafCount ?? 0
    });

    expect(result.metrics.estimatedRwDb).toBe(41);
    expect(result.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(readiness).toEqual({
      applies: true,
      implementationBlockers: WALL_TRIPLE_LEAF_IMPLEMENTATION_BLOCKERS,
      missingTopologyFields: REQUIRED_WALL_TRIPLE_LEAF_TOPOLOGY_FIELDS,
      readyForExactTripleLeafCalculation: false
    });
    expectWarning(result, "Triple-leaf exact calculation needs grouped wall topology");
    expectWarning(result, "side A leaf layer group");
    expectWarning(result, "internal leaf coupling/bridge class");
  });

  it("keeps the contract generic by accepting complete topology but blocking numeric promotion until Gate C", () => {
    const result = calculateDynamicWall(SPLIT_ROCKWOOL_STACK, COMPLETE_TRIPLE_LEAF_CONTEXT);
    const readiness = evaluateWallTripleLeafTopologyReadiness({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      cavityCount: result.dynamicAirborneTrace?.cavityCount ?? 0,
      detectedFamily: result.dynamicAirborneTrace?.detectedFamily ?? "single_leaf_panel",
      visibleLeafCount: result.dynamicAirborneTrace?.visibleLeafCount ?? 0
    });

    expect(result.metrics.estimatedRwDb).toBe(41);
    expect(result.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
    expect(readiness).toEqual({
      applies: true,
      implementationBlockers: WALL_TRIPLE_LEAF_IMPLEMENTATION_BLOCKERS,
      missingTopologyFields: [],
      readyForExactTripleLeafCalculation: false
    });
    expectWarning(result, "source-calibrated triple-leaf solver");
    expectWarning(result, "tolerance owner");
  });

  it("reports only the missing grouped fields when partial topology is supplied", () => {
    const result = calculateDynamicWall(SPLIT_ROCKWOOL_STACK, PARTIAL_TRIPLE_LEAF_CONTEXT);
    const readiness = evaluateWallTripleLeafTopologyReadiness({
      airborneContext: PARTIAL_TRIPLE_LEAF_CONTEXT,
      cavityCount: result.dynamicAirborneTrace?.cavityCount ?? 0,
      detectedFamily: result.dynamicAirborneTrace?.detectedFamily ?? "single_leaf_panel",
      visibleLeafCount: result.dynamicAirborneTrace?.visibleLeafCount ?? 0
    });

    expect(readiness.missingTopologyFields).toEqual([
      "cavity_1_depth_fill_and_absorption_group",
      "internal_leaf_coupling_or_bridge_class",
      "cavity_2_depth_fill_and_absorption_group",
      "side_b_leaf_layer_group",
      "support_topology"
    ]);
  });

  it("does not force ordinary double-leaf walls through the triple-leaf recovery path", () => {
    const result = calculateDynamicWall(ADJACENT_ROCKWOOL_STACK, LAB_CONTEXT);
    const readiness = evaluateWallTripleLeafTopologyReadiness({
      airborneContext: LAB_CONTEXT,
      cavityCount: result.dynamicAirborneTrace?.cavityCount ?? 0,
      detectedFamily: result.dynamicAirborneTrace?.detectedFamily ?? "single_leaf_panel",
      visibleLeafCount: result.dynamicAirborneTrace?.visibleLeafCount ?? 0
    });

    expect(result.metrics.estimatedRwDb).toBe(51);
    expect(result.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(readiness).toEqual({
      applies: false,
      implementationBlockers: [],
      missingTopologyFields: [],
      readyForExactTripleLeafCalculation: false
    });
  });

  it("selects the source-calibrated solver gate without promoting the current blend", () => {
    expect(WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_B).toMatchObject({
      apiShapeChange: true,
      numericRuntimeBehaviorChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_c_source_calibrated_triple_leaf_solver",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-accuracy-recovery-gate-c-contract.test.ts",
      selectionStatus:
        "landed_wall_triple_leaf_topology_input_contract_no_numeric_promotion_and_selected_source_calibrated_solver_gate_c"
    });
  });
});
