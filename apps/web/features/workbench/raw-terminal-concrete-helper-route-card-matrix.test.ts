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
    id: "furring-full-helper-concrete-baseline",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
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
    id: "resilient-stud-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "resilient_stud_ceiling", thicknessMm: "25" },
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
    id: "rigid-hanger-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { materialId: "concrete", thicknessMm: "160" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "56 dB" },
        "R'w": { status: "live", value: "56 dB" },
        "DnT,w": { status: "live", value: "59 dB" },
        "Ln,w": { status: "live", value: "73.1 dB" },
        "L'n,w": { status: "live", value: "75.1 dB" },
        "L'nT,w": { status: "live", value: "72.7 dB" }
      },
      dnTwDb: 59,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      lnW: 73.1,
      matchId: null,
      rw: 56,
      rwPrimeDb: 56,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "resilient-channel-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "100" },
      { materialId: "resilient_channel", thicknessMm: "27" },
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
    id: "clip-board-cavity-helper-concrete",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "16" },
      { materialId: "genieclip_rst", thicknessMm: "16" },
      { materialId: "concrete", thicknessMm: "200" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "live", value: "59 dB" },
        "R'w": { status: "live", value: "59 dB" },
        "DnT,w": { status: "live", value: "62 dB" },
        "Ln,w": { status: "live", value: "69.7 dB" },
        "L'n,w": { status: "live", value: "71.7 dB" },
        "L'nT,w": { status: "live", value: "69.3 dB" }
      },
      dnTwDb: 62,
      kind: null,
      lPrimeNTw: 69.3,
      lPrimeNW: 71.7,
      lnW: 69.7,
      matchId: null,
      rw: 59,
      rwPrimeDb: 59,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "board-only-concrete-lower-treatment-negative",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
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
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "helper-without-board-concrete-negative",
    rows: [
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.5 dB" },
        "L'n,w": { status: "live", value: "76.5 dB" },
        "L'nT,w": { status: "live", value: "74.1 dB" }
      },
      dnTwDb: 58,
      kind: null,
      lPrimeNTw: 74.1,
      lPrimeNW: 76.5,
      lnW: 74.5,
      matchId: null,
      rw: 55,
      rwPrimeDb: 55,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
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

describe("raw terminal concrete helper route-card matrix", () => {
  it("keeps helper-family route cards aligned with the first defended widening cut", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
