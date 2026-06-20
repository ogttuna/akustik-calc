import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS } from "./layer-combination-resolver-single-leaf-mass-law-banded-runtime-constants";

const SINGLE_LEAF_CONCRETE_STACK = [
  { materialId: "concrete", thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

function calculateField(targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(SINGLE_LEAF_CONCRETE_STACK, {
    airborneContext: COMPLETE_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs
  });
}

describe("field lab companion output support", () => {
  it("keeps Rw live when a complete single-leaf field request has a direct lab curve", () => {
    const result = calculateField(["Rw"]);

    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      airborneIsoDescriptor: "R'w",
      estimatedDnTwDb: 56,
      estimatedRwDb: 53,
      estimatedRwPrimeDb: 53
    });
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: LAYER_COMBINATION_RESOLVER_SINGLE_LEAF_MASS_LAW_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
  });

  it("shows Rw beside field outputs without copying lab Rw into a different metric", () => {
    const result = calculateField(["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"]);

    expect(result.supportedTargetOutputs).toEqual(["R'w", "Rw", "STC", "C", "Ctr", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -0.9,
      estimatedCtrDb: -5.6,
      estimatedDnTwDb: 56,
      estimatedRwDb: 53,
      estimatedRwPrimeDb: 53,
      estimatedStc: 53
    });
  });
});
