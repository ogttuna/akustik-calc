import { isDeepStrictEqual } from "node:util";
import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type RouteCardSnapshot = {
  basis: string | null;
  cards: Partial<Record<RequestedOutputId, { status: string; value: string }>>;
  dnTwDb: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  matchId: string | null;
  rw: number | null;
  rwPrimeDb: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteCardSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

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

const CASES: readonly RouteCase[] = [
  {
    id: "board-cavity-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "board-fill-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "mixed-order-helper-concrete",
    rows: [
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.7,
      lPrimeNW: 76.1,
      lnW: 74.1,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "disjoint-board-fill-board-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "73.6 dB" },
        "L'n,w": { status: "live", value: "75.6 dB" },
        "L'nT,w": { status: "live", value: "73.2 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 73.2,
      lPrimeNW: 75.6,
      lnW: 73.6,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  }
];

function snapshot(testCase: RouteCase): RouteCardSnapshot {
  const scenario = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id: testCase.id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  return {
    basis: scenario.result.impact?.basis ?? null,
    cards: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as Partial<Record<RequestedOutputId, { status: string; value: string }>>,
    dnTwDb: scenario.result.metrics.estimatedDnTwDb ?? null,
    kind: scenario.result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: scenario.result.impact?.LPrimeNTw ?? null,
    lPrimeNW: scenario.result.impact?.LPrimeNW ?? null,
    lnW: scenario.result.impact?.LnW ?? null,
    matchId: scenario.result.floorSystemMatch?.system.id ?? null,
    rw: scenario.result.floorSystemRatings?.Rw ?? null,
    rwPrimeDb: scenario.result.metrics.estimatedRwPrimeDb ?? null,
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

describe("raw terminal concrete helper partial-order route card matrix", () => {
  it("pins the workbench route/card surface for the third defended widening cut", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (!isDeepStrictEqual(actual, testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
