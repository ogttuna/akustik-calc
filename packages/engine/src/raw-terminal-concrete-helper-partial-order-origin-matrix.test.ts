import { isDeepStrictEqual } from "node:util";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type ProvenanceSnapshot = {
  boundFloorSystemMatchId: string | null;
  calculatorId: string | null;
  candidateIds: readonly string[] | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  method: string;
  supported: readonly RequestedOutputId[];
  supportedImpact: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  unsupportedImpact: readonly RequestedOutputId[];
  values: {
    c: number | null;
    ctr: number | null;
    dnA: number | null;
    dnTADb: number | null;
    dnTwDb: number | null;
    dnW: number | null;
    lPrimeNTw: number | null;
    lPrimeNW: number | null;
    lnW: number | null;
    rw: number | null;
    rwDb: number | null;
    rwPrimeDb: number | null;
    stc: number | null;
  };
};

type ProvenanceCase = {
  expected: ProvenanceSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];
const IMPACT_SUPPORTED: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const COMMON_FORMULA_PROVENANCE = {
  boundFloorSystemMatchId: null,
  calculatorId: null,
  candidateIds: null,
  floorSystemEstimateBasis: null,
  floorSystemEstimateKind: null,
  floorSystemMatchId: null,
  floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lowerBoundBasis: null,
  method: "screening_mass_law_curve_seed_v3",
  supportedImpact: IMPACT_SUPPORTED,
  unsupportedImpact: []
} as const;

const CASES: readonly ProvenanceCase[] = [
  {
    id: "board and cavity helper keeps the same formula provenance surface",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -1.4,
        ctr: -6.1,
        dnA: 54.1,
        dnTADb: 56.5,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.3,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "board and fill helper keeps the same formula provenance surface",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -1.2,
        ctr: -5.9,
        dnA: 54.3,
        dnTADb: 56.7,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.4,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "mixed-order helper package keeps the same formula provenance surface",
    layers: [
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -1.2,
        ctr: -5.9,
        dnA: 54.3,
        dnTADb: 56.7,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.4,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "disjoint board-fill-board helper keeps the same formula provenance surface",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -0.8,
        ctr: -5.5,
        dnA: 54.7,
        dnTADb: 57.1,
        dnTwDb: 58,
        dnW: 56,
        lPrimeNTw: 73.2,
        lPrimeNW: 75.6,
        lnW: 73.6,
        rw: 55,
        rwDb: 55.6,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  }
];

function snapshot(layers: readonly LayerInput[]): ProvenanceSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    calculatorId: result.calculatorId ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: result.floorSystemRatings?.basis ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    method: result.metrics.method,
    supported: result.supportedTargetOutputs,
    supportedImpact: result.supportedImpactOutputs,
    unsupported: result.unsupportedTargetOutputs,
    unsupportedImpact: result.unsupportedImpactOutputs,
    values: {
      c: result.metrics.estimatedCDb ?? null,
      ctr: result.metrics.estimatedCtrDb ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTADb: result.metrics.estimatedDnTADb ?? null,
      dnTwDb: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
      stc: result.metrics.estimatedStc ?? null
    }
  };
}

describe("raw terminal concrete helper partial-order origin matrix", () => {
  it("pins provenance for the third defended widening cut across partial and order-sensitive helper topologies", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase.layers);

      if (!isDeepStrictEqual(actual, testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
