import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";

const UI_VISIBLE_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const COMPLETE_UI_BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 12,
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50,
  sourceRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
} as const satisfies AirborneContext;

function calculateUiBuilding(targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(UI_VISIBLE_DOUBLE_LEAF_STACK, {
    airborneContext: COMPLETE_UI_BUILDING_CONTEXT,
    calculator: "dynamic",
    targetOutputs
  });
}

describe("building prediction lab companion output support", () => {
  it("keeps Rw live when the UI requests only Rw from a complete building-prediction wall", () => {
    const result = calculateUiBuilding(["Rw"]);

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      airborneIsoDescriptor: "R'w",
      estimatedDnTwDb: 41,
      estimatedRwDb: 38,
      estimatedRwPrimeDb: 38
    });
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("shows lab companions beside building outputs without copying them into building metrics", () => {
    const result = calculateUiBuilding(["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"]);

    expect(result.supportedTargetOutputs).toEqual(["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedCtrDb: -6,
      estimatedDnTwDb: 41,
      estimatedRwDb: 38,
      estimatedRwPrimeDb: 38,
      estimatedStc: 38
    });
  });
});
