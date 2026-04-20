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

const FULL_LIVE_SUPPORT = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const;
const NO_RW_SUPPORT = ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const;

const CASES: readonly RouteCase[] = [
  {
    id: "furring full helper concrete baseline keeps live formula cards",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: FULL_LIVE_SUPPORT,
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      }
    }
  },
  {
    id: "resilient stud helper concrete keeps the same live formula cards",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "resilient_stud_ceiling", thicknessMm: "25" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: FULL_LIVE_SUPPORT,
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      }
    }
  },
  {
    id: "rigid hanger helper concrete keeps the same live formula cards",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "12.5" },
      { materialId: "rockwool", thicknessMm: "50" },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { materialId: "concrete", thicknessMm: "160" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: FULL_LIVE_SUPPORT,
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "56 dB" },
        "R'w": { status: "live", value: "56 dB" },
        "DnT,w": { status: "live", value: "59 dB" },
        "Ln,w": { status: "live", value: "73.1 dB" },
        "L'n,w": { status: "live", value: "75.1 dB" },
        "L'nT,w": { status: "live", value: "72.7 dB" }
      }
    }
  },
  {
    id: "resilient channel helper concrete keeps the same live formula cards",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "100" },
      { materialId: "resilient_channel", thicknessMm: "27" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: FULL_LIVE_SUPPORT,
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "55 dB" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      }
    }
  },
  {
    id: "clip plus board cavity helper concrete keeps the same live formula cards",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "16" },
      { materialId: "genieclip_rst", thicknessMm: "16" },
      { materialId: "concrete", thicknessMm: "200" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: FULL_LIVE_SUPPORT,
      unsupported: [],
      cards: {
        Rw: { status: "live", value: "59 dB" },
        "R'w": { status: "live", value: "59 dB" },
        "DnT,w": { status: "live", value: "62 dB" },
        "Ln,w": { status: "live", value: "69.7 dB" },
        "L'n,w": { status: "live", value: "71.7 dB" },
        "L'nT,w": { status: "live", value: "69.3 dB" }
      }
    }
  },
  {
    id: "board only concrete lower treatment keeps provenance but leaves rw unsupported",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: NO_RW_SUPPORT,
      unsupported: ["Rw"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.1 dB" },
        "L'n,w": { status: "live", value: "76.1 dB" },
        "L'nT,w": { status: "live", value: "73.7 dB" }
      }
    }
  },
  {
    id: "helper without board keeps provenance but leaves rw unsupported",
    rows: [
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "furring_channel", thicknessMm: "28" },
      { materialId: "concrete", thicknessMm: "150" }
    ],
    expected: {
      ...COMMON_ROUTE_PROVENANCE,
      supported: NO_RW_SUPPORT,
      unsupported: ["Rw"],
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "55 dB" },
        "DnT,w": { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "74.5 dB" },
        "L'n,w": { status: "live", value: "76.5 dB" },
        "L'nT,w": { status: "live", value: "74.1 dB" }
      }
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
    candidateIds: scenario.result.impact?.estimateCandidateIds ?? scenario.result.floorSystemEstimate?.candidateIds ?? null,
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

describe("raw terminal concrete helper output origin card matrix", () => {
  it("pins the workbench provenance/card surface for the first helper-family widening cut", () => {
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
