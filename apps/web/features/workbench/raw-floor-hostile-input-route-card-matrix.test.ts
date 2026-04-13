import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteCardSnapshot = {
  basis: string | null;
  cards: Record<(typeof FIELD_OUTPUTS)[number], CardSnapshot>;
  candidateIds: readonly string[] | null;
  dnTwDb: number | null;
  floorRw: number | null;
  kind: string | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  layerCount: number;
  lnW: number | null;
  rwDb: number | null;
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
    id: "long-split-terminal-concrete-helper",
    rows: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: "6.25" })),
      ...Array.from({ length: 3 }, () => ({ materialId: "rockwool", thicknessMm: "30" })),
      ...Array.from({ length: 3 }, () => ({ materialId: "furring_channel", thicknessMm: "12" })),
      { materialId: "concrete", thicknessMm: "160" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      cards: {
        Rw: { status: "live", value: "57 dB" },
        "R'w": { status: "live", value: "57 dB" },
        "DnT,w": { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "72.7 dB" },
        "L'n,w": { status: "live", value: "74.7 dB" },
        "L'nT,w": { status: "live", value: "72.3 dB" }
      },
      dnTwDb: 60,
      floorRw: 57,
      kind: null,
      lPrimeNTw: 72.3,
      lPrimeNW: 74.7,
      layerCount: 11,
      lnW: 72.7,
      rwDb: 57.1,
      rwPrimeDb: 57,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: []
    }
  },
  {
    id: "same-materials-concrete-not-terminal",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "concrete", thicknessMm: "160" },
      { materialId: "furring_channel", thicknessMm: "18" },
      { materialId: "rockwool", thicknessMm: "45" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "57 dB" },
        "DnT,w": { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "73.1 dB" },
        "L'n,w": { status: "live", value: "75.1 dB" },
        "L'nT,w": { status: "live", value: "72.7 dB" }
      },
      dnTwDb: 60,
      floorRw: 57,
      kind: null,
      lPrimeNTw: 72.7,
      lPrimeNW: 75.1,
      layerCount: 7,
      lnW: 73.1,
      rwDb: 57.1,
      rwPrimeDb: 57,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"]
    }
  },
  {
    id: "long-open-web-helper-negative",
    rows: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: "6.5" })),
      ...Array.from({ length: 4 }, () => ({ materialId: "rockwool", thicknessMm: "25" })),
      ...Array.from({ length: 4 }, () => ({ materialId: "furring_channel", thicknessMm: "10" })),
      { materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "71 dB" },
        "DnT,w": { status: "live", value: "74 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      dnTwDb: 74,
      floorRw: 71,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      layerCount: 13,
      lnW: null,
      rwDb: 71.7,
      rwPrimeDb: 71,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "fragmented-clt-lower-only-negative",
    rows: [
      ...Array.from({ length: 4 }, () => ({ materialId: "gypsum_board", thicknessMm: "6.5" })),
      ...Array.from({ length: 4 }, () => ({ materialId: "rockwool", thicknessMm: "25" })),
      ...Array.from({ length: 2 }, () => ({ materialId: "resilient_stud_ceiling", thicknessMm: "12.5" })),
      { materialId: "clt_panel", thicknessMm: "260" }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "39 dB" },
        "DnT,w": { status: "live", value: "42 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      dnTwDb: 42,
      floorRw: 39,
      kind: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      layerCount: 11,
      lnW: null,
      rwDb: 39.3,
      rwPrimeDb: 39,
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
    candidateIds: scenario.result.impact?.estimateCandidateIds ?? null,
    cards: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as RouteCardSnapshot["cards"],
    dnTwDb: scenario.result.metrics.estimatedDnTwDb ?? null,
    floorRw: scenario.result.floorSystemRatings?.Rw ?? null,
    kind: scenario.result.floorSystemEstimate?.kind ?? null,
    lPrimeNTw: scenario.result.impact?.LPrimeNTw ?? null,
    lPrimeNW: scenario.result.impact?.LPrimeNW ?? null,
    layerCount: testCase.rows.length,
    lnW: scenario.result.impact?.LnW ?? null,
    rwDb: scenario.result.metrics.estimatedRwDb ?? null,
    rwPrimeDb: scenario.result.metrics.estimatedRwPrimeDb ?? null,
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

describe("raw floor hostile-input route/card matrix", () => {
  it("keeps output cards aligned with long split, reordered, and weak-carrier raw stack answers", () => {
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
