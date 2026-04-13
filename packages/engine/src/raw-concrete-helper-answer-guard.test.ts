import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type AnswerSnapshot = {
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

type AnswerCase = {
  expected: AnswerSnapshot;
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

const CASES: readonly AnswerCase[] = [
  {
    id: "split full ceiling helper over terminal concrete",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "concrete", thicknessMm: 160 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 60,
      kind: null,
      lPrimeNTw: 72.3,
      lPrimeNW: 74.7,
      lnW: 72.7,
      matchId: null,
      rw: 57,
      rwDb: 57.1,
      rwPrimeDb: 57,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "split board and fill helper over thicker terminal concrete",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "rockwool", thicknessMm: 30 },
      { materialId: "concrete", thicknessMm: 180 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 61,
      kind: null,
      lPrimeNTw: 70.6,
      lPrimeNW: 73,
      lnW: 71,
      matchId: null,
      rw: 58,
      rwDb: 58.1,
      rwPrimeDb: 58,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "split board and cavity helper over thinner terminal concrete",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "furring_channel", thicknessMm: 20 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "furring_channel", thicknessMm: 20 },
      { materialId: "concrete", thicknessMm: 140 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 74.2,
      lPrimeNW: 76.6,
      lnW: 74.6,
      matchId: null,
      rw: 55,
      rwDb: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "top finish after terminal concrete withholds field companion Rw",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 160 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 61,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      lnW: 73.1,
      matchId: null,
      rw: 58,
      rwDb: 57.2,
      rwPrimeDb: 58,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "wall-like heavy concrete hybrid does not reopen field companion Rw",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "concrete", thicknessMm: 120 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 57,
      kind: null,
      lPrimeNTw: 77,
      lPrimeNW: 79.4,
      lnW: 77.4,
      matchId: null,
      rw: 54,
      rwDb: 53.9,
      rwPrimeDb: 54,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "steel joist helper-heavy raw carrier stays impact fail-closed",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "steel_joist_floor", thicknessMm: 250 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      dnTwDb: 73,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      matchId: null,
      rw: 70,
      rwDb: 70.2,
      rwPrimeDb: 70,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  }
];

function snapshot(layers: readonly LayerInput[]): AnswerSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
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

describe("raw concrete helper answer guard", () => {
  it("pins answer snapshots for the narrow terminal-concrete helper corridor and adjacent negatives", () => {
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
