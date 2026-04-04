import { describe, expect, it } from "vitest";

import type { FloorSystemAirborneRatings, ImpactBoundCalculation, ImpactCalculation, RequestedOutputId } from "@dynecho/shared";

import { analyzeTargetOutputSupport } from "./target-output-support";

function impact(
  availableOutputs: readonly RequestedOutputId[],
  overrides: Partial<ImpactCalculation> = {}
): ImpactCalculation {
  return {
    availableOutputs: [...availableOutputs],
    basis: "predictor_floor_system_family_general_estimate",
    confidence: {
      level: "medium",
      provenance: "published_family_estimate",
      summary: "test"
    },
    frequenciesHz: [100, 125, 160],
    labOrField: "lab",
    levelsDb: [60, 58, 56],
    LnW: 55,
    ...overrides
  } as ImpactCalculation;
}

function lowerBound(overrides: Partial<ImpactBoundCalculation>): ImpactBoundCalculation {
  return {
    basis: "official_floor_system_bound_support",
    labOrField: "lab",
    LnWUpperBound: 58,
    ...overrides
  } as ImpactBoundCalculation;
}

function carrier(overrides: Partial<FloorSystemAirborneRatings> = {}): FloorSystemAirborneRatings {
  return {
    Rw: 60,
    RwCtr: -5,
    RwCtrSemantic: "ctr_term",
    ...overrides
  };
}

describe("target output support contract", () => {
  it("supports only the live and companion metrics that are explicitly available on the current lane", () => {
    const result = analyzeTargetOutputSupport({
      floorCarrier: carrier(),
      impact: impact(["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]),
      lowerBoundImpact: null,
      targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "IIC"]
    });

    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedTargetOutputs).toEqual(["CI,50-2500", "DeltaLw", "IIC"]);
    expect(result.supportedImpactOutputs).toEqual(["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(result.unsupportedImpactOutputs).toEqual(["CI,50-2500", "DeltaLw", "IIC"]);
  });

  it("treats conservative lower-bound metrics as support only when the caller opts in", () => {
    const input = {
      impact: null,
      lowerBoundImpact: lowerBound({
        DeltaLwLowerBound: 19,
        LPrimeNTwUpperBound: 57,
        LPrimeNWUpperBound: 59
      }),
      targetOutputs: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"] as const
    };

    const assemblyStyle = analyzeTargetOutputSupport(input);
    const impactOnlyStyle = analyzeTargetOutputSupport({
      ...input,
      countBoundSupportAsSupported: false
    });

    expect(assemblyStyle.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]);
    expect(assemblyStyle.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(impactOnlyStyle.supportedTargetOutputs).toEqual([]);
    expect(impactOnlyStyle.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]);
  });

  it("keeps impact-only style carrier support separate from conservative bound impact support", () => {
    const result = analyzeTargetOutputSupport({
      countBoundSupportAsSupported: false,
      floorCarrier: carrier(),
      impact: null,
      lowerBoundImpact: lowerBound({
        DeltaLwLowerBound: 19
      }),
      targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    });

    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(result.supportedImpactOutputs).toEqual([]);
    expect(result.unsupportedImpactOutputs).toEqual(["Ln,w", "DeltaLw"]);
  });

  it("does not expose lab Rw when the active airborne descriptor is already R'w", () => {
    const result = analyzeTargetOutputSupport({
      impact: null,
      lowerBoundImpact: null,
      metrics: {
        airborneIsoDescriptor: "R'w",
        estimatedRwDb: 55
      },
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(result.supportedTargetOutputs).toEqual(["R'w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "DnT,w"]);
  });
});
