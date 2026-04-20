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
    id: "split-full-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "40" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "concrete", thicknessMm: "160" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "57 dB" },
        "R'w": { status: "live", value: "57 dB" },
        "DnT,w": { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "72.7 dB" },
        "L'n,w": { status: "live", value: "74.7 dB" },
        "L'nT,w": { status: "live", value: "72.3 dB" }
      },
      dnTwDb: 60,
      kind: null,
      lPrimeNTw: 72.3,
      lPrimeNW: 74.7,
      lnW: 72.7,
      matchId: null,
      rw: 57,
      rwPrimeDb: 57,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "split-board-fill-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "15" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "60" },
      { materialId: "rockwool", thicknessMm: "30" },
      { materialId: "concrete", thicknessMm: "180" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "58 dB" },
        "R'w": { status: "live", value: "58 dB" },
        "DnT,w": { status: "live", value: "61 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "L'n,w": { status: "live", value: "73 dB" },
        "L'nT,w": { status: "live", value: "70.6 dB" }
      },
      dnTwDb: 61,
      kind: null,
      lPrimeNTw: 70.6,
      lPrimeNW: 73,
      lnW: 71,
      matchId: null,
      rw: 58,
      rwPrimeDb: 58,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "split-board-cavity-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "furring_channel", thicknessMm: "20" },
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "furring_channel", thicknessMm: "20" },
      { materialId: "concrete", thicknessMm: "140" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.6 dB" },
        "L'n,w": { status: "live", value: "76.6 dB" },
        "L'nT,w": { status: "live", value: "74.2 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 74.2,
      lPrimeNW: 76.6,
      lnW: 74.6,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "top-finish-after-split-helper-negative",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "160" },
      { materialId: "ceramic_tile", thicknessMm: "8" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "58 dB" },
        "DnT,w": { status: "live", value: "61 dB" },
        "Ln,w": { status: "live", value: "73.1 dB" },
        "L'n,w": { status: "live", value: "75.1 dB" },
        "L'nT,w": { status: "live", value: "72.7 dB" }
      },
      dnTwDb: 61,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      lnW: 73.1,
      matchId: null,
      rw: 58,
      rwPrimeDb: 58,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "wall-like-concrete-hybrid-negative",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "concrete", thicknessMm: "120" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "54 dB" },
        "DnT,w": { status: "live", value: "57 dB" },
        "Ln,w": { status: "live", value: "77.4 dB" },
        "L'n,w": { status: "live", value: "79.4 dB" },
        "L'nT,w": { status: "live", value: "77 dB" }
      },
      dnTwDb: 57,
      kind: null,
      lPrimeNTw: 77,
      lPrimeNW: 79.4,
      lnW: 77.4,
      matchId: null,
      rw: 54,
      rwPrimeDb: 54,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "steel-joist-helper-heavy-negative",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "steel_joist_floor", thicknessMm: "250" }
    ],
    expected: {
      basis: null,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "70 dB" },
        "DnT,w": { status: "live", value: "73 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      dnTwDb: 73,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      matchId: null,
      rw: 70,
      rwPrimeDb: 70,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
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

describe("raw terminal concrete helper split topology route card matrix", () => {
  it("pins the second widening cut on the workbench route/card surface", () => {
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
