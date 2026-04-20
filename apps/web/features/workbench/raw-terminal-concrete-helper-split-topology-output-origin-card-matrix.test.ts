import { isDeepStrictEqual } from "node:util";
import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: string;
  value: string;
};

type RouteSnapshot = {
  boundFloorSystemMatchId: string | null;
  calculatorId: string | null;
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
  candidateIds: readonly string[] | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteSnapshot;
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

const COMMON_ROUTE_PROVENANCE = {
  boundFloorSystemMatchId: null,
  calculatorId: null,
  candidateIds: null,
  floorSystemEstimateBasis: null,
  floorSystemEstimateKind: null,
  floorSystemMatchId: null,
  floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lowerBoundBasis: null
} as const;

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
      ...COMMON_ROUTE_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "57 dB" },
        "R'w": { status: "live", value: "57 dB" },
        "DnT,w": { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "72.7 dB" },
        "L'n,w": { status: "live", value: "74.7 dB" },
        "L'nT,w": { status: "live", value: "72.3 dB" }
      }
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
      ...COMMON_ROUTE_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "58 dB" },
        "R'w": { status: "live", value: "58 dB" },
        "DnT,w": { status: "live", value: "61 dB" },
        "Ln,w": { status: "live", value: "71 dB" },
        "L'n,w": { status: "live", value: "73 dB" },
        "L'nT,w": { status: "live", value: "70.6 dB" }
      }
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
      ...COMMON_ROUTE_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.6 dB" },
        "L'n,w": { status: "live", value: "76.6 dB" },
        "L'nT,w": { status: "live", value: "74.2 dB" }
      }
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
      ...COMMON_ROUTE_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "58 dB" },
        "DnT,w": { status: "live", value: "61 dB" },
        "Ln,w": { status: "live", value: "73.1 dB" },
        "L'n,w": { status: "live", value: "75.1 dB" },
        "L'nT,w": { status: "live", value: "72.7 dB" }
      }
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
      ...COMMON_ROUTE_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "54 dB" },
        "DnT,w": { status: "live", value: "57 dB" },
        "Ln,w": { status: "live", value: "77.4 dB" },
        "L'n,w": { status: "live", value: "79.4 dB" },
        "L'nT,w": { status: "live", value: "77 dB" }
      }
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
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "70 dB" },
        "DnT,w": { status: "live", value: "73 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" }
      },
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: null,
      lowerBoundBasis: null,
      supported: ["R'w", "DnT,w"],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  }
];

function snapshot(testCase: RouteCase): RouteSnapshot {
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
    boundFloorSystemMatchId: scenario.result.boundFloorSystemMatch?.system.id ?? null,
    calculatorId: scenario.result.calculatorId ?? null,
    cards: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as Partial<Record<RequestedOutputId, CardSnapshot>>,
    candidateIds: scenario.result.impact?.estimateCandidateIds ?? scenario.result.floorSystemEstimate?.candidateIds ?? null,
    floorSystemEstimateBasis: scenario.result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: scenario.result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: scenario.result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: scenario.result.floorSystemRatings?.basis ?? null,
    impactBasis: scenario.result.impact?.basis ?? null,
    lowerBoundBasis: scenario.result.lowerBoundImpact?.basis ?? null,
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

describe("raw terminal concrete helper split topology output origin card matrix", () => {
  it("pins workbench provenance for the second defended split-helper widening cut", () => {
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
