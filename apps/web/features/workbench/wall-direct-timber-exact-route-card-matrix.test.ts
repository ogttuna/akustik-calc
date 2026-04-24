import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

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

type ExactWallCase = {
  context: AirborneContext;
  expected: {
    c: number | null;
    cards: Record<WallOutputId, CardSnapshot>;
    ctr: number | null;
    dnA: number | null;
    dnTA: number | null;
    dnTw: number | null;
    dnW: number | null;
    rw: number | null;
    rwPrime: number | null;
    supported: readonly RequestedOutputId[];
    unsupported: readonly RequestedOutputId[];
  };
  id: string;
  label: string;
  rows: readonly LayerInput[];
  warningPattern: RegExp;
};

function evaluateExactWallCase(testCase: ExactWallCase) {
  const scenario = evaluateScenario({
    airborneContext: testCase.context,
    calculator: "dynamic",
    id: testCase.id,
    name: testCase.label,
    rows: testCase.rows.map((row, index) => ({
      ...row,
      thicknessMm: String(row.thicknessMm),
      id: `${testCase.id}-${index + 1}`
    })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  const result = scenario.result;

  expect(result, `${testCase.id} result`).not.toBeNull();

  if (!result) {
    throw new Error(`${testCase.id} did not evaluate`);
  }

  return {
    branch: getDynamicCalcBranchSummary({
      result,
      studyMode: "wall"
    }),
    cards: new Map(
      WALL_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "wall"
        })
      ])
    ),
    result,
    warnings: [
      ...new Set([...(scenario.warnings ?? []), ...((result.warnings as readonly string[] | undefined) ?? [])])
    ]
  };
}

const CASES: readonly ExactWallCase[] = [
  {
    id: "direct35-lab",
    label: "Knauf direct timber exact 35 lab",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 63 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -0.6,
      cards: {
        Rw: { status: "live", value: "35 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "Dn,w": { status: "needs_input", value: "Not ready" },
        "Dn,A": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "35 dB" },
        C: { status: "live", value: "-0.6 dB" },
        Ctr: { status: "live", value: "-4.6 dB" }
      },
      ctr: -4.6,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      rw: 35,
      rwPrime: null,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    },
    warningPattern:
      /Curated exact airborne lab match active: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, no insulation/i
  },
  {
    id: "direct35-field",
    label: "Knauf direct timber exact 35 field",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 63 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -0.1,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "28 dB" },
        "Dn,w": { status: "live", value: "27 dB" },
        "Dn,A": { status: "live", value: "26.9 dB" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "28 dB" },
        C: { status: "live", value: "-0.1 dB" },
        Ctr: { status: "live", value: "-3.9 dB" }
      },
      ctr: -3.9,
      dnA: 26.9,
      dnTA: null,
      dnTw: null,
      dnW: 27,
      rw: 28,
      rwPrime: 28,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    },
    warningPattern:
      /Curated airborne lab fallback active in field context: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, no insulation/i
  },
  {
    id: "direct35-building",
    label: "Knauf direct timber exact 35 building",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 63 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55,
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -0.1,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "28 dB" },
        "Dn,w": { status: "live", value: "27 dB" },
        "Dn,A": { status: "live", value: "26.9 dB" },
        "DnT,w": { status: "live", value: "30 dB" },
        "DnT,A": { status: "live", value: "29.4 dB" },
        STC: { status: "live", value: "28 dB" },
        C: { status: "live", value: "-0.1 dB" },
        Ctr: { status: "live", value: "-3.9 dB" }
      },
      ctr: -3.9,
      dnA: 26.9,
      dnTA: 29.4,
      dnTw: 30,
      dnW: 27,
      rw: 28,
      rwPrime: 28,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    },
    warningPattern:
      /Curated airborne lab fallback active in field context: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, no insulation/i
  },
  {
    id: "direct42-lab",
    label: "Knauf direct timber exact 42 lab",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 13 },
      { materialId: "glasswool", thicknessMm: 50 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "element_lab",
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -0.6,
      cards: {
        Rw: { status: "live", value: "42 dB" },
        "R'w": { status: "needs_input", value: "Not ready" },
        "Dn,w": { status: "needs_input", value: "Not ready" },
        "Dn,A": { status: "needs_input", value: "Not ready" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "42 dB" },
        C: { status: "live", value: "-0.6 dB" },
        Ctr: { status: "live", value: "-5.4 dB" }
      },
      ctr: -5.4,
      dnA: null,
      dnTA: null,
      dnTw: null,
      dnW: null,
      rw: 42,
      rwPrime: null,
      supported: ["Rw", "STC", "C", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    },
    warningPattern:
      /Curated exact airborne lab match active: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, 50 mm cavity insulation/i
  },
  {
    id: "direct42-field",
    label: "Knauf direct timber exact 42 field",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 13 },
      { materialId: "glasswool", thicknessMm: 50 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "field_between_rooms",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -1.1,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "36 dB" },
        "Dn,w": { status: "live", value: "35 dB" },
        "Dn,A": { status: "live", value: "33.9 dB" },
        "DnT,w": { status: "needs_input", value: "Not ready" },
        "DnT,A": { status: "needs_input", value: "Not ready" },
        STC: { status: "live", value: "36 dB" },
        C: { status: "live", value: "-1.1 dB" },
        Ctr: { status: "live", value: "-5.9 dB" }
      },
      ctr: -5.9,
      dnA: 33.9,
      dnTA: null,
      dnTw: null,
      dnW: 35,
      rw: 36,
      rwPrime: 36,
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      unsupported: ["Rw", "DnT,w", "DnT,A"]
    },
    warningPattern:
      /Curated airborne lab fallback active in field context: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, 50 mm cavity insulation/i
  },
  {
    id: "direct42-building",
    label: "Knauf direct timber exact 42 building",
    rows: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 13 },
      { materialId: "glasswool", thicknessMm: 50 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    context: {
      airtightness: "good",
      connectionType: "line_connection",
      contextMode: "building_prediction",
      panelHeightMm: 3000,
      panelWidthMm: 4200,
      receivingRoomRt60S: 0.7,
      receivingRoomVolumeM3: 55,
      studSpacingMm: 600,
      studType: "wood_stud"
    },
    expected: {
      c: -1.1,
      cards: {
        Rw: { status: "unsupported", value: "Not ready" },
        "R'w": { status: "live", value: "36 dB" },
        "Dn,w": { status: "live", value: "35 dB" },
        "Dn,A": { status: "live", value: "33.9 dB" },
        "DnT,w": { status: "live", value: "37 dB" },
        "DnT,A": { status: "live", value: "36.4 dB" },
        STC: { status: "live", value: "36 dB" },
        C: { status: "live", value: "-1.1 dB" },
        Ctr: { status: "live", value: "-5.9 dB" }
      },
      ctr: -5.9,
      dnA: 33.9,
      dnTA: 36.4,
      dnTw: 37,
      dnW: 35,
      rw: 36,
      rwPrime: 36,
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      unsupported: ["Rw"]
    },
    warningPattern:
      /Curated airborne lab fallback active in field context: Knauf GB EN timber partition 63x38, 1x12\.5 Wallboard each side, 50 mm cavity insulation/i
  }
] as const;

describe("wall direct timber exact route card matrix", () => {
  it.each(CASES)("$id keeps the exact warning/fallback surface and output cards pinned", (testCase) => {
    const evaluated = evaluateExactWallCase(testCase);

    expect(evaluated.result.calculatorId, `${testCase.id} calculator`).toBe("dynamic");
    expect(evaluated.result.ratings.iso717?.Rw ?? null, `${testCase.id} Rw`).toBe(testCase.expected.rw);
    expect(
      evaluated.result.ratings.field?.RwPrime ??
        (evaluated.result.ratings.iso717 as { RwPrime?: number } | undefined)?.RwPrime ??
        null,
      `${testCase.id} R'w`
    ).toBe(testCase.expected.rwPrime);
    expect(evaluated.result.ratings.field?.DnW ?? null, `${testCase.id} Dn,w`).toBe(testCase.expected.dnW);
    expect(evaluated.result.ratings.field?.DnA ?? null, `${testCase.id} Dn,A`).toBe(testCase.expected.dnA);
    expect(evaluated.result.ratings.field?.DnTw ?? null, `${testCase.id} DnT,w`).toBe(testCase.expected.dnTw);
    expect(evaluated.result.ratings.field?.DnTA ?? null, `${testCase.id} DnT,A`).toBe(testCase.expected.dnTA);
    expect(evaluated.result.ratings.iso717?.C ?? null, `${testCase.id} C`).toBe(testCase.expected.c);
    expect(evaluated.result.ratings.iso717?.Ctr ?? null, `${testCase.id} Ctr`).toBe(testCase.expected.ctr);
    expect(evaluated.result.supportedTargetOutputs, `${testCase.id} supported`).toEqual(testCase.expected.supported);
    expect(evaluated.result.unsupportedTargetOutputs, `${testCase.id} unsupported`).toEqual(testCase.expected.unsupported);

    expect(evaluated.branch.value, `${testCase.id} branch value`).toBe("Stud Wall Surrogate");
    expect(evaluated.branch.tone, `${testCase.id} branch tone`).toBe("warning");
    expect(evaluated.branch.detail, `${testCase.id} branch detail`).toMatch(
      /Mass Law anchor is active with stud surrogate blend\+framed wall calibration/i
    );

    expect(
      evaluated.warnings.some((warning) => testCase.warningPattern.test(warning)),
      `${testCase.id} exact warning`
    ).toBe(true);

    for (const output of WALL_OUTPUTS) {
      expect(
        evaluated.cards.get(output),
        `${testCase.id} ${output} card`
      ).toMatchObject(testCase.expected.cards[output]);
    }
  });
});
