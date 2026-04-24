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
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
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

function moveLastToFirst<T>(items: readonly T[]): T[] {
  return [items[items.length - 1]!, ...items.slice(0, -1)];
}

function rotateLeft<T>(items: readonly T[]): T[] {
  return [...items.slice(1), items[0]!];
}

function makeUbiqExactRows(): Array<Omit<LayerDraft, "id">> {
  return [
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
    { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
    { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
    { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
    { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
    { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
    { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "200" }
  ];
}

function makeDataholzExactRows(): Array<Omit<LayerDraft, "id">> {
  return [
    { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
    { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
    { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
    { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
  ];
}

function makeRawTerminalConcreteHelperRows(): Array<Omit<LayerDraft, "id">> {
  return [
    { materialId: "gypsum_board", thicknessMm: "13" },
    { materialId: "rockwool", thicknessMm: "90" },
    { materialId: "furring_channel", thicknessMm: "28" },
    { materialId: "concrete", thicknessMm: "150" }
  ];
}

function makeRawOpenWebImpactBlockedRows(): Array<Omit<LayerDraft, "id">> {
  return [
    { materialId: "gypsum_board", thicknessMm: "13" },
    { materialId: "rockwool", thicknessMm: "90" },
    { materialId: "furring_channel", thicknessMm: "28" },
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

const UBIQ_EXACT_EXPECTED: RouteSnapshot = {
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
};

const DATAHOLZ_EXACT_EXPECTED: RouteSnapshot = {
  cards: {
    Rw: { status: "live", value: "62 dB" },
    "R'w": { status: "live", value: "46 dB" },
    "Dn,w": { status: "live", value: "45 dB" },
    "Dn,A": { status: "live", value: "43.7 dB" },
    "DnT,w": { status: "live", value: "47 dB" },
    "DnT,A": { status: "live", value: "46.2 dB" },
    "Ln,w": { status: "live", value: "50 dB" },
    "Ln,w+CI": { status: "live", value: "49 dB" },
    DeltaLw: { status: "unsupported", value: "Not ready" },
    "L'n,w": { status: "live", value: "53 dB" },
    "L'nT,w": { status: "live", value: "50.2 dB" },
    "L'nT,50": { status: "live", value: "50 dB" },
    Ctr: { status: "unsupported", value: "Not ready" }
  },
  origin: {
    estimateKind: null,
    floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
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
    "L'nT,50"
  ],
  unsupported: ["DeltaLw", "Ctr"]
};

const RAW_CONCRETE_BASELINE_EXPECTED: RouteSnapshot = {
  cards: {
    Rw: { status: "live", value: "55 dB" },
    "R'w": { status: "live", value: "55 dB" },
    "Dn,w": { status: "live", value: "54 dB" },
    "Dn,A": { status: "live", value: "52.8 dB" },
    "DnT,w": { status: "live", value: "56 dB" },
    "DnT,A": { status: "live", value: "55.3 dB" },
    "Ln,w": { status: "live", value: "74.1 dB" },
    "Ln,w+CI": { status: "unsupported", value: "Not ready" },
    DeltaLw: { status: "unsupported", value: "Not ready" },
    "L'n,w": { status: "live", value: "77.1 dB" },
    "L'nT,w": { status: "live", value: "74.3 dB" },
    "L'nT,50": { status: "needs_input", value: "Not ready" },
    Ctr: { status: "live", value: "-5.9 dB" }
  },
  origin: {
    estimateKind: null,
    floorSystemMatchId: null,
    impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
    ratingsBasis: "screening_mass_law_curve_seed_v3"
  },
  supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
};

const RAW_CONCRETE_BASE_FIRST_EXPECTED: RouteSnapshot = {
  ...RAW_CONCRETE_BASELINE_EXPECTED,
  cards: {
    ...RAW_CONCRETE_BASELINE_EXPECTED.cards,
    Rw: { status: "unsupported", value: "Not ready" },
    "Ln,w": { status: "live", value: "74.5 dB" },
    "L'n,w": { status: "live", value: "77.5 dB" },
    "L'nT,w": { status: "live", value: "74.7 dB" }
  },
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
  unsupported: ["Rw", "Ln,w+CI", "DeltaLw", "L'nT,50"]
};

const RAW_OPEN_WEB_BLOCKED_EXPECTED: RouteSnapshot = {
  cards: {
    Rw: { status: "unsupported", value: "Not ready" },
    "R'w": { status: "live", value: "71 dB" },
    "Dn,w": { status: "live", value: "70 dB" },
    "Dn,A": { status: "live", value: "69 dB" },
    "DnT,w": { status: "live", value: "73 dB" },
    "DnT,A": { status: "live", value: "71.5 dB" },
    "Ln,w": { status: "unsupported", value: "Not ready" },
    "Ln,w+CI": { status: "unsupported", value: "Not ready" },
    DeltaLw: { status: "unsupported", value: "Not ready" },
    "L'n,w": { status: "needs_input", value: "Not ready" },
    "L'nT,w": { status: "needs_input", value: "Not ready" },
    "L'nT,50": { status: "needs_input", value: "Not ready" },
    Ctr: { status: "live", value: "-5.7 dB" }
  },
  origin: {
    estimateKind: null,
    floorSystemMatchId: null,
    impactBasis: null,
    ratingsBasis: "screening_mass_law_curve_seed_v3"
  },
  supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
  unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
};

const UBIQ_EXACT_ROWS = makeUbiqExactRows();
const DATAHOLZ_EXACT_ROWS = makeDataholzExactRows();
const RAW_CONCRETE_ROWS = makeRawTerminalConcreteHelperRows();
const RAW_OPEN_WEB_ROWS = makeRawOpenWebImpactBlockedRows();

const CASES: readonly RouteCase[] = [
  {
    id: "UBIQ exact baseline",
    rows: UBIQ_EXACT_ROWS,
    expected: UBIQ_EXACT_EXPECTED
  },
  {
    id: "UBIQ exact base structure moved first",
    rows: moveLastToFirst(UBIQ_EXACT_ROWS),
    expected: UBIQ_EXACT_EXPECTED
  },
  {
    id: "Dataholz CLT exact baseline",
    rows: DATAHOLZ_EXACT_ROWS,
    expected: DATAHOLZ_EXACT_EXPECTED
  },
  {
    id: "Dataholz CLT exact rotated order",
    rows: rotateLeft(DATAHOLZ_EXACT_ROWS),
    expected: DATAHOLZ_EXACT_EXPECTED
  },
  {
    id: "raw terminal concrete helper baseline",
    rows: RAW_CONCRETE_ROWS,
    expected: RAW_CONCRETE_BASELINE_EXPECTED
  },
  {
    id: "raw terminal concrete helper base moved first",
    rows: moveLastToFirst(RAW_CONCRETE_ROWS),
    expected: RAW_CONCRETE_BASE_FIRST_EXPECTED
  },
  {
    id: "raw open-web impact-blocked baseline",
    rows: RAW_OPEN_WEB_ROWS,
    expected: RAW_OPEN_WEB_BLOCKED_EXPECTED
  },
  {
    id: "raw open-web impact-blocked reversed order",
    rows: [...RAW_OPEN_WEB_ROWS].reverse(),
    expected: RAW_OPEN_WEB_BLOCKED_EXPECTED
  }
];

describe("floor layer-order edit stability Gate A route/card matrix", () => {
  it("keeps reordered floor cards aligned with exact, support-change, and fail-closed engine posture", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }

      for (const output of actual.supported) {
        const card = actual.cards[output];
        if (!card || card.value === "Not ready") {
          failures.push(`${testCase.id}: ${output} is supported but card is not live-ready`);
        }
      }

      for (const output of actual.unsupported) {
        const card = actual.cards[output];
        if (card?.status === "live" || card?.status === "bound") {
          failures.push(`${testCase.id}: ${output} is unsupported but card leaked ${card.status}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
