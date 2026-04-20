import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type RawHelperVariantCase = {
  expected: {
    basis: string | null;
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

const CASES: readonly RawHelperVariantCase[] = [
  {
    id: "furring full helper concrete baseline",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
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
    id: "resilient stud helper stays inside defended concrete lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
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
    id: "rigid hanger helper stays inside defended concrete lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { materialId: "concrete", thicknessMm: 160 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      dnTwDb: 59,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      lnW: 73.1,
      matchId: null,
      rw: 56,
      rwDb: 55.9,
      rwPrimeDb: 56,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "resilient channel helper stays inside defended concrete lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_channel", thicknessMm: 27 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
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
    id: "clip plus board cavity helper stays inside defended concrete lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 16 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "concrete", thicknessMm: 200 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      dnTwDb: 62,
      kind: null,
      lPrimeNTw: 69.3,
      lPrimeNW: 71.7,
      lnW: 69.7,
      matchId: null,
      rw: 59,
      rwDb: 58.7,
      rwPrimeDb: 59,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "board only concrete lower treatment keeps companion rw closed",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwDb: 55.3,
      rwPrimeDb: 55,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "helper without board keeps companion rw closed",
    layers: [
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 74.1,
      lPrimeNW: 76.5,
      lnW: 74.5,
      matchId: null,
      rw: 55,
      rwDb: 54.7,
      rwPrimeDb: 55,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  }
];

function snapshot(layers: readonly LayerInput[]) {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    basis: result.impact?.basis ?? null,
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

describe("raw terminal concrete helper widening matrix", () => {
  it("pins the first defended helper-family widening cut without drifting outside the concrete lane", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase.layers);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
