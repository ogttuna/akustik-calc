import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type AnswerSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  dnTwDb: number | null;
  floorRw: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  layerCount: number;
  lnW: number | null;
  matchId: string | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type HostileInputCase = {
  expected: AnswerSnapshot;
  id: string;
  layers: readonly LayerInput[];
  warningIncludes?: readonly RegExp[];
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

const CASES: readonly HostileInputCase[] = [
  {
    id: "long-split-terminal-concrete-helper",
    layers: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: 6.25 })),
      ...Array.from({ length: 3 }, () => ({ materialId: "rockwool", thicknessMm: 30 })),
      ...Array.from({ length: 3 }, () => ({ materialId: "furring_channel", thicknessMm: 12 })),
      { materialId: "concrete", thicknessMm: 160 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 60,
      floorRw: 57,
      kind: null,
      lPrimeNTw: 72.3,
      lPrimeNW: 74.7,
      layerCount: 11,
      lnW: 72.7,
      matchId: null,
      rwDb: 57.1,
      rwPrimeDb: 57,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    },
    warningIncludes: [/no curated exact floor-system landed/i, /field-side supplement is active/i]
  },
  {
    id: "same-materials-concrete-not-terminal",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "concrete", thicknessMm: 160 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      dnTwDb: 60,
      floorRw: 57,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      layerCount: 7,
      lnW: 73.1,
      matchId: null,
      rwDb: 57.1,
      rwPrimeDb: 57,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    },
    warningIncludes: [/unsupported target outputs: Rw/i, /single-entry floor roles are duplicated/i]
  },
  {
    id: "long-open-web-helper-negative",
    layers: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: 6.5 })),
      ...Array.from({ length: 4 }, () => ({ materialId: "rockwool", thicknessMm: 25 })),
      ...Array.from({ length: 4 }, () => ({ materialId: "furring_channel", thicknessMm: 10 })),
      { materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      dnTwDb: 74,
      floorRw: 71,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      layerCount: 13,
      lnW: null,
      matchId: null,
      rwDb: 71.7,
      rwPrimeDb: 71,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    },
    warningIncludes: [/impact sound outputs are not available/i, /withheld the closest candidate label/i]
  },
  {
    id: "fragmented-clt-lower-only-negative",
    layers: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: 6.5 })),
      ...Array.from({ length: 4 }, () => ({ materialId: "rockwool", thicknessMm: 25 })),
      ...Array.from({ length: 2 }, () => ({ materialId: "resilient_stud_ceiling", thicknessMm: 12.5 })),
      { materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      dnTwDb: 42,
      floorRw: 39,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      layerCount: 11,
      lnW: null,
      matchId: null,
      rwDb: 39.3,
      rwPrimeDb: 39,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    },
    warningIncludes: [/lightweight assemblies remain less reliable/i, /impact sound outputs are not available/i]
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
    floorRw: result.floorSystemRatings?.Rw ?? null,
    kind: result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    layerCount: layers.length,
    lnW: result.impact?.LnW ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rwDb: result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("raw floor hostile-input answer matrix", () => {
  it("pins numeric answers and fail-closed support for long split, reordered, and weak-carrier raw stacks", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: FIELD_OUTPUTS
      });
      const actual = snapshot(testCase.layers);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }

      for (const pattern of testCase.warningIncludes ?? []) {
        if (!result.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
