import { describe, expect, it } from "vitest";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "@dynecho/engine";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

type WallOutputId = (typeof WALL_OUTPUTS)[number];

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type PairContextCase = {
  branchDetail: string;
  cards: Record<WallOutputId, CardSnapshot>;
  context: AirborneContext;
  ids: readonly [string, string];
  pairId: string;
  warningPattern: RegExp;
};

const SIDE_COUNT_ROWS = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
  (entry): entry is WallTimberLightweightOfficialSourceRow =>
    entry.kind === "official_row" &&
    entry.classificationReasonCode === "resilient_bar_side_count_not_explicitly_modeled"
);

const CASES: readonly PairContextCase[] = [
  {
    pairId: "knauf_rb1_vs_rb2_lab",
    ids: [
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "live", value: "57 dB" },
      "R'w": { status: "needs_input", value: "Not ready" },
      "Dn,w": { status: "needs_input", value: "Not ready" },
      "Dn,A": { status: "needs_input", value: "Not ready" },
      "DnT,w": { status: "needs_input", value: "Not ready" },
      "DnT,A": { status: "needs_input", value: "Not ready" },
      STC: { status: "live", value: "57 dB" },
      C: { status: "live", value: "-1.5 dB" },
      Ctr: { status: "live", value: "-6.6 dB" }
    }
  },
  {
    pairId: "knauf_rb1_vs_rb2_field",
    ids: [
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration+reinforcement monotonic floor. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "55 dB" },
      "Dn,w": { status: "live", value: "54 dB" },
      "Dn,A": { status: "live", value: "53.1 dB" },
      "DnT,w": { status: "needs_input", value: "Not ready" },
      "DnT,A": { status: "needs_input", value: "Not ready" },
      STC: { status: "live", value: "55 dB" },
      C: { status: "live", value: "-0.9 dB" },
      Ctr: { status: "live", value: "-6 dB" }
    }
  },
  {
    pairId: "knauf_rb1_vs_rb2_building",
    ids: [
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55,
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration+reinforcement monotonic floor. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "55 dB" },
      "Dn,w": { status: "live", value: "54 dB" },
      "Dn,A": { status: "live", value: "53.1 dB" },
      "DnT,w": { status: "live", value: "57 dB" },
      "DnT,A": { status: "live", value: "55.6 dB" },
      STC: { status: "live", value: "55 dB" },
      C: { status: "live", value: "-0.9 dB" },
      Ctr: { status: "live", value: "-6 dB" }
    }
  },
  {
    pairId: "british_gypsum_rb1_vs_rb2_lab",
    ids: [
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "live", value: "56 dB" },
      "R'w": { status: "needs_input", value: "Not ready" },
      "Dn,w": { status: "needs_input", value: "Not ready" },
      "Dn,A": { status: "needs_input", value: "Not ready" },
      "DnT,w": { status: "needs_input", value: "Not ready" },
      "DnT,A": { status: "needs_input", value: "Not ready" },
      STC: { status: "live", value: "56 dB" },
      C: { status: "live", value: "-0.6 dB" },
      Ctr: { status: "live", value: "-5.4 dB" }
    }
  },
  {
    pairId: "british_gypsum_rb1_vs_rb2_field",
    ids: [
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "50 dB" },
      "Dn,w": { status: "live", value: "49 dB" },
      "Dn,A": { status: "live", value: "48 dB" },
      "DnT,w": { status: "needs_input", value: "Not ready" },
      "DnT,A": { status: "needs_input", value: "Not ready" },
      STC: { status: "live", value: "50 dB" },
      C: { status: "live", value: "-1 dB" },
      Ctr: { status: "live", value: "-5.8 dB" }
    }
  },
  {
    pairId: "british_gypsum_rb1_vs_rb2_building",
    ids: [
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ],
    context: {
      airtightness: "good",
      connectionType: "resilient_channel",
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55,
      studSpacingMm: 600,
      studType: "resilient_stud"
    },
    branchDetail:
      "Mass Law anchor is active with stud surrogate blend+framed wall calibration. Stud Wall Surrogate is on an ambiguous boundary with Double Leaf, and a conservative family-boundary hold is active.",
    warningPattern: /No curated exact floor-system landed/i,
    cards: {
      Rw: { status: "unsupported", value: "Not ready" },
      "R'w": { status: "live", value: "50 dB" },
      "Dn,w": { status: "live", value: "49 dB" },
      "Dn,A": { status: "live", value: "48 dB" },
      "DnT,w": { status: "live", value: "51 dB" },
      "DnT,A": { status: "live", value: "50.5 dB" },
      STC: { status: "live", value: "50 dB" },
      C: { status: "live", value: "-1 dB" },
      Ctr: { status: "live", value: "-5.8 dB" }
    }
  }
] as const;

function findRow(id: string): WallTimberLightweightOfficialSourceRow {
  const row = SIDE_COUNT_ROWS.find((entry) => entry.id === id);

  expect(row, `${id} row`).toBeDefined();

  if (!row) {
    throw new Error(`Missing side-count row ${id}`);
  }

  return row;
}

function evaluateRow(rowId: string, context: AirborneContext) {
  const row = findRow(rowId);
  const scenario = evaluateScenario({
    airborneContext: context,
    calculator: "dynamic",
    id: `${row.id}-${context.contextMode}`,
    name: row.label,
    rows: row.layers.map((layer, index) => ({
      id: `${row.id}-${index + 1}`,
      materialId: layer.materialId,
      thicknessMm: String(layer.thicknessMm)
    })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  const result = scenario.result;

  expect(result, `${rowId} result`).not.toBeNull();

  if (!result) {
    throw new Error(`${rowId} did not evaluate`);
  }

  return {
    branch: getDynamicCalcBranchSummary({
      result,
      studyMode: "wall"
    }),
    cards: Object.fromEntries(
      WALL_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "wall"
        });

        return [
          output,
          {
            status: card.status,
            value: card.value
          }
        ];
      })
    ) as Record<WallOutputId, CardSnapshot>,
    warnings: scenario.warnings
  };
}

describe("wall resilient-bar side-count route/card matrix", () => {
  it.each(CASES)(
    "$pairId keeps one-side and both-sides resilient rows on the same current route/card surface",
    (testCase) => {
      const left = evaluateRow(testCase.ids[0], testCase.context);
      const right = evaluateRow(testCase.ids[1], testCase.context);

      expect(left.branch.value, `${testCase.pairId} branch value`).toBe("Stud Wall Surrogate");
      expect(left.branch.tone, `${testCase.pairId} branch tone`).toBe("warning");
      expect(left.branch.detail, `${testCase.pairId} branch detail`).toBe(testCase.branchDetail);
      expect(right.branch, `${testCase.pairId} pair branch equality`).toEqual(left.branch);

      for (const [output, expected] of Object.entries(testCase.cards) as Array<[WallOutputId, CardSnapshot]>) {
        expect(left.cards[output], `${testCase.pairId} ${output}`).toEqual(expected);
        expect(right.cards[output], `${testCase.pairId} ${output} pair equality`).toEqual(expected);
      }

      expect(left.warnings.some((warning) => testCase.warningPattern.test(warning)), `${testCase.pairId} warning`).toBe(true);
      expect(right.warnings.some((warning) => testCase.warningPattern.test(warning)), `${testCase.pairId} pair warning`).toBe(true);
    }
  );
});
