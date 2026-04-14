import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type SourceGapCardSnapshot = {
  cards: Record<TargetOutput, CardSnapshot>;
  estimateBasis: string | null;
  estimateKind: string | null;
  impactBasis: string | null;
  matchId: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type SourceGapCase = {
  expected: SourceGapCardSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

type TargetOutput = (typeof FIELD_OUTPUTS)[number];

const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

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

const FAIL_CLOSED_CARDS: Pick<
  Record<TargetOutput, CardSnapshot>,
  "Rw" | "Ln,w" | "Ln,w+CI" | "L'n,w" | "L'nT,w" | "L'nT,50"
> = {
  Rw: { status: "unsupported", value: "Not ready" },
  "Ln,w": { status: "unsupported", value: "Not ready" },
  "Ln,w+CI": { status: "unsupported", value: "Not ready" },
  "L'n,w": { status: "needs_input", value: "Not ready" },
  "L'nT,w": { status: "needs_input", value: "Not ready" },
  "L'nT,50": { status: "needs_input", value: "Not ready" }
};

const FAIL_CLOSED_UNSUPPORTED: readonly RequestedOutputId[] = [
  "Rw",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const CASES: readonly SourceGapCase[] = [
  {
    id: "tuas-c11c-wet-stack-deferred",
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: "30" },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    expected: {
      cards: {
        ...FAIL_CLOSED_CARDS,
        "R'w": { status: "live", value: "47 dB" },
        "DnT,w": { status: "live", value: "50 dB" }
      },
      estimateBasis: null,
      estimateKind: null,
      impactBasis: null,
      matchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_UNSUPPORTED
    }
  },
  {
    id: "dataholz-gdmtxa04a-estimate-only",
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
    ],
    expected: {
      cards: {
        Rw: { status: "live", value: "65 dB" },
        "R'w": { status: "live", value: "48 dB" },
        "DnT,w": { status: "live", value: "51 dB" },
        "Ln,w": { status: "live", value: "47 dB" },
        "Ln,w+CI": { status: "live", value: "49 dB" },
        "L'n,w": { status: "live", value: "49 dB" },
        "L'nT,w": { status: "live", value: "46.6 dB" },
        "L'nT,50": { status: "live", value: "49 dB" }
      },
      estimateBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      estimateKind: "family_general",
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      matchId: null,
      supported: FIELD_OUTPUTS,
      unsupported: []
    }
  },
  {
    id: "raw-bare-open-web-impact-deferred",
    rows: [{ materialId: "open_web_steel_floor", thicknessMm: "300" }],
    expected: {
      cards: {
        ...FAIL_CLOSED_CARDS,
        "R'w": { status: "live", value: "70 dB" },
        "DnT,w": { status: "live", value: "73 dB" }
      },
      estimateBasis: null,
      estimateKind: null,
      impactBasis: null,
      matchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_UNSUPPORTED
    }
  },
  {
    id: "raw-bare-open-box-impact-deferred",
    rows: [{ materialId: "open_box_timber_slab", thicknessMm: "220" }],
    expected: {
      cards: {
        ...FAIL_CLOSED_CARDS,
        "R'w": { status: "live", value: "35 dB" },
        "DnT,w": { status: "live", value: "38 dB" }
      },
      estimateBasis: null,
      estimateKind: null,
      impactBasis: null,
      matchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_UNSUPPORTED
    }
  },
  {
    id: "helper-only-timber-impact-deferred",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "timber_joist_floor", thicknessMm: "250" }
    ],
    expected: {
      cards: {
        ...FAIL_CLOSED_CARDS,
        "R'w": { status: "live", value: "42 dB" },
        "DnT,w": { status: "live", value: "45 dB" }
      },
      estimateBasis: null,
      estimateKind: null,
      impactBasis: null,
      matchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_UNSUPPORTED
    }
  },
  {
    id: "helper-only-open-web-impact-deferred",
    rows: [
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "rockwool", thicknessMm: "90" },
      { materialId: "gypsum_board", thicknessMm: "13" },
      { materialId: "open_web_steel_floor", thicknessMm: "300" }
    ],
    expected: {
      cards: {
        ...FAIL_CLOSED_CARDS,
        "R'w": { status: "live", value: "71 dB" },
        "DnT,w": { status: "live", value: "74 dB" }
      },
      estimateBasis: null,
      estimateKind: null,
      impactBasis: null,
      matchId: null,
      supported: ["R'w", "DnT,w"],
      unsupported: FAIL_CLOSED_UNSUPPORTED
    }
  }
];

function snapshot(testCase: SourceGapCase): SourceGapCardSnapshot {
  const evaluated = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id: testCase.id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  });

  expect(evaluated.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    cards: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as SourceGapCardSnapshot["cards"],
    estimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("remaining source-gap workbench posture matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });
});
