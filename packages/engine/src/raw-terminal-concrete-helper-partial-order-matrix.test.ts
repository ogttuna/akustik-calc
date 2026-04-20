import { isDeepStrictEqual } from "node:util";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type PartialOrderSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  dnTwDb: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  matchId: string | null;
  rw: number | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type PartialOrderCase = {
  expected: PartialOrderSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

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

const CASES: readonly PartialOrderCase[] = [
  {
    id: "board and cavity helper on terminal concrete stays inside the defended lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwDb: 55.3,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "board and fill helper on terminal concrete stays inside the defended lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwDb: 55.4,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "mixed-order helper package stays inside the same concrete lane",
    layers: [
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwDb: 55.4,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "disjoint board-fill-board helper package stays inside the concrete lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.2,
      lPrimeNW: 75.6,
      lnW: 73.6,
      matchId: null,
      rw: 55,
      rwDb: 55.6,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  }
];

function snapshot(layers: readonly LayerInput[]): PartialOrderSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    dnTwDb: result.metrics.estimatedDnTwDb ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("raw terminal concrete helper partial-order matrix", () => {
  it("pins the third defended widening cut across partial and order-sensitive helper topologies", () => {
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
