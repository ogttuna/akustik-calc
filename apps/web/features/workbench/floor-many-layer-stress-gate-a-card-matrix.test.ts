import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  cards: Record<(typeof TARGET_OUTPUTS)[number], CardSnapshot>;
  layerCount: number;
  origin: {
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    impactBasis: string | null;
    ratingsBasis: string | null;
  };
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

function repeatRows(count: number, row: Omit<LayerDraft, "id">): Array<Omit<LayerDraft, "id">> {
  return Array.from({ length: count }, () => ({ ...row }));
}

function makeUbiqExactSplitRows(): Array<Omit<LayerDraft, "id">> {
  return [
    ...repeatRows(12, { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "4" }),
    ...repeatRows(10, { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "14.5" }),
    ...repeatRows(10, {
      floorRole: "ceiling_cavity",
      materialId: "ubiq_resilient_ceiling",
      thicknessMm: "6.5"
    }),
    ...repeatRows(8, {
      floorRole: "floor_covering",
      materialId: "engineered_timber_with_acoustic_underlay",
      thicknessMm: "2.5"
    }),
    ...repeatRows(8, { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "2.375" }),
    ...repeatRows(5, { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "40" })
  ];
}

function makeRawTerminalConcreteHelperRows(): Array<Omit<LayerDraft, "id">> {
  return [
    ...repeatRows(20, { materialId: "gypsum_board", thicknessMm: "1.25" }),
    ...repeatRows(20, { materialId: "rockwool", thicknessMm: "4.5" }),
    ...repeatRows(12, { materialId: "furring_channel", thicknessMm: "3" }),
    { materialId: "concrete", thicknessMm: "160" }
  ];
}

function makeRawOpenWebImpactBlockedRows(): Array<Omit<LayerDraft, "id">> {
  return [
    ...repeatRows(20, { materialId: "gypsum_board", thicknessMm: "1.3" }),
    ...repeatRows(20, { materialId: "rockwool", thicknessMm: "5" }),
    ...repeatRows(12, { materialId: "furring_channel", thicknessMm: "3.333" }),
    { materialId: "open_web_steel_floor", thicknessMm: "300" }
  ];
}

function snapshot(testCase: RouteCase): RouteSnapshot {
  const scenario = evaluateScenario({
    airborneContext: BUILDING_CONTEXT,
    id: testCase.id,
    impactFieldContext: BUILDING_IMPACT_CONTEXT,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  return {
    cards: Object.fromEntries(
      TARGET_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as RouteSnapshot["cards"],
    layerCount: testCase.rows.length,
    origin: {
      estimateKind: scenario.result.floorSystemEstimate?.kind ?? null,
      floorSystemMatchId: scenario.result.floorSystemMatch?.system.id ?? null,
      impactBasis: scenario.result.impact?.basis ?? null,
      ratingsBasis: scenario.result.floorSystemRatings?.basis ?? null
    },
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

const CASES: readonly RouteCase[] = [
  {
    id: "53-layer UBIQ split exact stack",
    rows: makeUbiqExactSplitRows(),
    expected: {
      cards: {
        Rw: { status: "live", value: "63 dB" },
        "R'w": { status: "live", value: "68 dB" },
        "Dn,w": { status: "live", value: "67 dB" },
        "Dn,A": { status: "live", value: "66 dB" },
        "DnT,w": { status: "live", value: "70 dB" },
        "DnT,A": { status: "live", value: "68.5 dB" },
        "Ln,w": { status: "live", value: "52 dB" },
        "Ln,w+CI": { status: "live", value: "51 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "live", value: "55 dB" },
        "L'nT,w": { status: "live", value: "52.2 dB" },
        "L'nT,50": { status: "live", value: "52 dB" },
        Ctr: { status: "live", value: "-6 dB" }
      },
      layerCount: 53,
      origin: {
        estimateKind: null,
        floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        impactBasis: "mixed_exact_plus_estimated_local_guide",
        ratingsBasis: "official_floor_system_exact_match"
      },
      supported: [
        "Rw",
        "R'w",
        "Dn,w",
        "Dn,A",
        "DnT,w",
        "DnT,A",
        "Ln,w",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50",
        "Ctr"
      ],
      unsupported: ["DeltaLw"]
    }
  },
  {
    id: "53-layer raw terminal concrete helper stack",
    rows: makeRawTerminalConcreteHelperRows(),
    expected: {
      cards: {
        Rw: { status: "live", value: "57 dB" },
        "R'w": { status: "live", value: "57 dB" },
        "Dn,w": { status: "live", value: "56 dB" },
        "Dn,A": { status: "live", value: "55.3 dB" },
        "DnT,w": { status: "live", value: "59 dB" },
        "DnT,A": { status: "live", value: "57.8 dB" },
        "Ln,w": { status: "live", value: "72.7 dB" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" },
        DeltaLw: { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "live", value: "75.7 dB" },
        "L'nT,w": { status: "live", value: "72.9 dB" },
        "L'nT,50": { status: "unsupported", value: "Not ready" },
        Ctr: { status: "live", value: "-5.4 dB" }
      },
      layerCount: 53,
      origin: {
        estimateKind: null,
        floorSystemMatchId: null,
        impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
        ratingsBasis: "screening_mass_law_curve_seed_v3"
      },
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
      unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    }
  },
  {
    id: "53-layer raw open-web impact-blocked stack",
    rows: makeRawOpenWebImpactBlockedRows(),
    expected: {
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "71 dB" },
        "Dn,w": { status: "live", value: "70 dB" },
        "Dn,A": { status: "live", value: "69.2 dB" },
        "DnT,w": { status: "live", value: "73 dB" },
        "DnT,A": { status: "live", value: "71.7 dB" },
        "Ln,w": { status: "unsupported", value: "Not ready" },
        "Ln,w+CI": { status: "unsupported", value: "Not ready" },
        DeltaLw: { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "needs_input", value: "Not ready" },
        "L'nT,w": { status: "needs_input", value: "Not ready" },
        "L'nT,50": { status: "needs_input", value: "Not ready" },
        Ctr: { status: "live", value: "-5.6 dB" }
      },
      layerCount: 53,
      origin: {
        estimateKind: null,
        floorSystemMatchId: null,
        impactBasis: null,
        ratingsBasis: "screening_mass_law_curve_seed_v3"
      },
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
      unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  }
];

describe("floor many-layer stress Gate A route/card matrix", () => {
  it("keeps 50+ layer floor output cards aligned with engine support and fail-closed states", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (actual.layerCount < 50) {
        failures.push(`${testCase.id}: expected a 50+ layer route/card stress stack, got ${actual.layerCount}`);
      }

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
