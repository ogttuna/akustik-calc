import { describe, expect, it } from "vitest";

import type { AssemblyCalculation, EstimateRequest } from "@dynecho/shared";

import {
  buildVerifiedCalculatedAnchorCapturePackage,
  estimateRequestsEqualForVerifiedCalculatedCapture,
  getVerifiedCalculatedMetricBasis
} from "./calculator-workbench";
import { WORKBENCH_V2_DEFAULT_CONTEXT } from "./workbench-v2-project-snapshot";

const REQUEST = {
  airborneContext: {
    contextMode: "building_prediction"
  },
  calculator: "dynamic",
  layers: [
    {
      materialId: "gypsum_board",
      thicknessMm: 12.5
    }
  ],
  materialCatalog: [],
  targetOutputs: ["Rw", "STC", "DnT,w"]
} as const satisfies EstimateRequest;

const RESULT = {
  airborneBasis: {
    assumptions: ["test calculated route"],
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 2,
    kind: "airborne_physics_prediction",
    method: "test_verified_capture_route",
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    requiredInputs: [],
    toleranceClass: "uncalibrated_prediction"
  },
  calculatorId: "dynamic",
  impact: null,
  metrics: {
    airGapCount: 0,
    estimatedCDb: -1,
    estimatedCtrDb: -5,
    estimatedDnTwDb: 49,
    estimatedRwDb: 52,
    estimatedStc: 51,
    insulationCount: 0,
    method: "dynamic",
    surfaceMassKgM2: 22,
    totalThicknessMm: 12.5
  },
  ratings: {
    astmE413: {
      STC: 51
    },
    field: {
      DnTw: 49
    },
    iso717: {
      C: -1,
      Ctr: -5,
      Rw: 52
    }
  },
  supportedImpactOutputs: [],
  supportedTargetOutputs: ["Rw", "STC", "DnT,w"],
  targetOutputs: ["Rw", "STC", "DnT,w"],
  unsupportedImpactOutputs: [],
  unsupportedTargetOutputs: [],
  warnings: []
} as unknown as AssemblyCalculation;

describe("verified calculated anchor capture helpers", () => {
  it("maps output metrics to stored basis without aliasing field/building values to lab Rw", () => {
    expect(getVerifiedCalculatedMetricBasis("Rw", WORKBENCH_V2_DEFAULT_CONTEXT)).toBe("airborne_lab");
    expect(
      getVerifiedCalculatedMetricBasis("DnT,w", {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "field_between_rooms"
      })
    ).toBe("airborne_field");
    expect(
      getVerifiedCalculatedMetricBasis("DnT,w", {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction"
      })
    ).toBe("airborne_building_prediction");
    expect(getVerifiedCalculatedMetricBasis("DeltaLw", WORKBENCH_V2_DEFAULT_CONTEXT)).toBe("impact_lab");
    expect(getVerifiedCalculatedMetricBasis("L'n,w", WORKBENCH_V2_DEFAULT_CONTEXT)).toBe("impact_field");
  });

  it("builds a structured package from current live supported outputs only", () => {
    const capture = buildVerifiedCalculatedAnchorCapturePackage({
      context: {
        ...WORKBENCH_V2_DEFAULT_CONTEXT,
        airborneMode: "building_prediction"
      },
      currentRequest: REQUEST,
      mode: "wall",
      result: RESULT,
      selectedOutputs: ["Rw", "STC", "DnT,w"]
    });

    expect(capture.status).toBe("ready");
    if (capture.status === "ready") {
      expect(capture.package.requestContext.mode).toBe("wall");
      expect(capture.package.requestContext.targetOutputs).toEqual(["Rw", "STC", "DnT,w"]);
      expect(capture.package.resultBasisTrace.airborneBasis?.method).toBe("test_verified_capture_route");
      expect(capture.package.values).toEqual([
        expect.objectContaining({ metric: "Rw", metricBasis: "airborne_lab", valueDb: 52 }),
        expect.objectContaining({ metric: "STC", metricBasis: "airborne_lab", valueDb: 51 }),
        expect.objectContaining({ metric: "DnT,w", metricBasis: "airborne_building_prediction", valueDb: 49 })
      ]);
    }
  });

  it("blocks capture when selected outputs no longer match the request that produced the result", () => {
    expect(estimateRequestsEqualForVerifiedCalculatedCapture(REQUEST, { ...REQUEST })).toBe(true);
    expect(
      estimateRequestsEqualForVerifiedCalculatedCapture(REQUEST, {
        ...REQUEST,
        targetOutputs: ["Rw"]
      })
    ).toBe(false);
  });

  it("returns blocked when no selected output has a live supported value", () => {
    const capture = buildVerifiedCalculatedAnchorCapturePackage({
      context: WORKBENCH_V2_DEFAULT_CONTEXT,
      currentRequest: {
        ...REQUEST,
        targetOutputs: ["C"]
      },
      mode: "wall",
      result: {
        ...RESULT,
        supportedTargetOutputs: [],
        targetOutputs: ["C"],
        unsupportedTargetOutputs: ["C"]
      } as unknown as AssemblyCalculation,
      selectedOutputs: ["C"]
    });

    expect(capture).toEqual({
      reason: "no_live_values",
      status: "blocked"
    });
  });
});
