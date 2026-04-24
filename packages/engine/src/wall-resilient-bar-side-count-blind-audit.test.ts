import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

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

const RESILIENT_SIDE_COUNT_ROWS = WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
  (entry): entry is WallTimberLightweightOfficialSourceRow =>
    entry.kind === "official_row" &&
    entry.classificationReasonCode === "resilient_bar_side_count_not_explicitly_modeled"
);

type ContextExpectation = {
  c: number;
  ctr: number;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  rw: number;
  rwPrime: number | null;
  strategy: string;
};

type PairCase = {
  expectedOfficialDeltaDb: number;
  expectedOutputs: {
    building: ContextExpectation;
    field: ContextExpectation;
    lab: ContextExpectation;
  };
  ids: readonly [string, string];
  pairId: string;
};

const CONTEXTS: Record<keyof PairCase["expectedOutputs"], AirborneContext> = {
  lab: {
    airtightness: "good",
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    studSpacingMm: 600,
    studType: "resilient_stud"
  },
  field: {
    airtightness: "good",
    connectionType: "resilient_channel",
    contextMode: "field_between_rooms",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    studSpacingMm: 600,
    studType: "resilient_stud"
  },
  building: {
    airtightness: "good",
    connectionType: "resilient_channel",
    contextMode: "building_prediction",
    panelHeightMm: 3000,
    panelWidthMm: 4200,
    receivingRoomRt60S: 0.7,
    receivingRoomVolumeM3: 55,
    studSpacingMm: 600,
    studType: "resilient_stud"
  }
};

const PAIR_CASES: readonly PairCase[] = [
  {
    pairId: "knauf_89mm_soundshield_plus_resilient_pair",
    ids: [
      "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
      "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026"
    ],
    expectedOfficialDeltaDb: 3,
    expectedOutputs: {
      lab: {
        c: -1.5,
        ctr: -6.6,
        dnA: null,
        dnTA: null,
        dnTw: null,
        dnW: null,
        rw: 57,
        rwPrime: null,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      field: {
        c: -0.9,
        ctr: -6,
        dnA: 53.1,
        dnTA: null,
        dnTw: null,
        dnW: 54,
        rw: 55,
        rwPrime: 55,
        strategy: "stud_surrogate_blend+framed_wall_calibration+reinforcement_monotonic_floor"
      },
      building: {
        c: -0.9,
        ctr: -6,
        dnA: 53.1,
        dnTA: 55.6,
        dnTw: 57,
        dnW: 54,
        rw: 55,
        rwPrime: 55,
        strategy: "stud_surrogate_blend+framed_wall_calibration+reinforcement_monotonic_floor"
      }
    }
  },
  {
    pairId: "british_gypsum_soundbloc_resilient_pair",
    ids: [
      "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
      "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
    ],
    expectedOfficialDeltaDb: 3,
    expectedOutputs: {
      lab: {
        c: -0.6,
        ctr: -5.4,
        dnA: null,
        dnTA: null,
        dnTw: null,
        dnW: null,
        rw: 56,
        rwPrime: null,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      field: {
        c: -1,
        ctr: -5.8,
        dnA: 48,
        dnTA: null,
        dnTw: null,
        dnW: 49,
        rw: 50,
        rwPrime: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      },
      building: {
        c: -1,
        ctr: -5.8,
        dnA: 48,
        dnTA: 50.5,
        dnTw: 51,
        dnW: 49,
        rw: 50,
        rwPrime: 50,
        strategy: "stud_surrogate_blend+framed_wall_calibration"
      }
    }
  }
] as const;

function findRow(id: string): WallTimberLightweightOfficialSourceRow {
  const row = RESILIENT_SIDE_COUNT_ROWS.find((entry) => entry.id === id);

  expect(row, `${id} corpus row`).toBeDefined();

  if (!row) {
    throw new Error(`Missing resilient side-count corpus row ${id}`);
  }

  return row;
}

function hasExactLayerSignature(left: readonly LayerInput[], right: readonly LayerInput[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (layer, index) =>
        layer.materialId === right[index]?.materialId &&
        layer.thicknessMm === right[index]?.thicknessMm
    )
  );
}

function evaluateWall(layers: readonly LayerInput[], airborneContext: AirborneContext) {
  const result = calculateAssembly(layers, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs: WALL_OUTPUTS
  });

  return {
    c: result.ratings.iso717?.C ?? null,
    ctr: result.ratings.iso717?.Ctr ?? null,
    dnA: result.ratings.field?.DnA ?? null,
    dnTA: result.ratings.field?.DnTA ?? null,
    dnTw: result.ratings.field?.DnTw ?? null,
    dnW: result.ratings.field?.DnW ?? null,
    rw: result.ratings.iso717?.Rw ?? null,
    rwPrime: result.ratings.field?.RwPrime ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    warnings: [...result.warnings],
    notes: [...(result.dynamicAirborneTrace?.notes ?? [])]
  };
}

describe("wall resilient-bar side-count blind audit", () => {
  it("keeps the current model side-count-blind across the source-backed RB1/RB2 timber pairs", () => {
    expect(RESILIENT_SIDE_COUNT_ROWS).toHaveLength(4);

    for (const pair of PAIR_CASES) {
      const left = findRow(pair.ids[0]);
      const right = findRow(pair.ids[1]);

      expect(hasExactLayerSignature(left.layers, right.layers), `${pair.pairId} layer signature`).toBe(true);
      expect(left.airborneContext, `${pair.pairId} context signature`).toEqual(right.airborneContext);
      expect(Math.abs(left.expectedRw - right.expectedRw), `${pair.pairId} official delta`).toBe(
        pair.expectedOfficialDeltaDb
      );

      for (const contextId of Object.keys(pair.expectedOutputs) as Array<keyof PairCase["expectedOutputs"]>) {
        const expected = pair.expectedOutputs[contextId];
        const leftEval = evaluateWall(left.layers, CONTEXTS[contextId]);
        const rightEval = evaluateWall(right.layers, CONTEXTS[contextId]);

        expect(leftEval, `${pair.pairId} ${contextId} pair equality`).toEqual(rightEval);

        expect(leftEval.rw, `${pair.pairId} ${contextId} rw`).toBe(expected.rw);
        expect(leftEval.rwPrime, `${pair.pairId} ${contextId} rwPrime`).toBe(expected.rwPrime);
        expect(leftEval.dnW, `${pair.pairId} ${contextId} dnW`).toBe(expected.dnW);
        expect(leftEval.dnA, `${pair.pairId} ${contextId} dnA`).toBe(expected.dnA);
        expect(leftEval.dnTw, `${pair.pairId} ${contextId} dnTw`).toBe(expected.dnTw);
        expect(leftEval.dnTA, `${pair.pairId} ${contextId} dnTA`).toBe(expected.dnTA);
        expect(leftEval.c, `${pair.pairId} ${contextId} C`).toBe(expected.c);
        expect(leftEval.ctr, `${pair.pairId} ${contextId} Ctr`).toBe(expected.ctr);
        expect(leftEval.strategy, `${pair.pairId} ${contextId} strategy`).toBe(expected.strategy);
        expect(
          leftEval.notes.some((note) => /Resilient stud\/channel metadata activated/i.test(note)),
          `${pair.pairId} ${contextId} resilient note`
        ).toBe(true);
        expect(
          leftEval.notes.some((note) => /boundary is ambiguous: Stud Wall Surrogate is only 0\.1 score points ahead of Double Leaf/i.test(note)),
          `${pair.pairId} ${contextId} ambiguous boundary note`
        ).toBe(true);
        expect(
          leftEval.warnings.some((warning) => /No curated exact floor-system landed/i.test(warning)),
          `${pair.pairId} ${contextId} no exact warning`
        ).toBe(true);
      }
    }
  });

  it("keeps the side-count-blocked rows explicit in the corpus classification surface", () => {
    expect(
      RESILIENT_SIDE_COUNT_ROWS.map((row) => ({
        classification: row.classification,
        expectedRw: row.expectedRw,
        id: row.id,
        reason: row.classificationReasonCode,
        topology: row.topology
      }))
    ).toEqual([
      {
        classification: "secondary_benchmark",
        expectedRw: 56,
        id: "knauf_gb_en_tp_89_38_rb1_2x15_soundshield_plus_90_fill_lab_2026",
        reason: "resilient_bar_side_count_not_explicitly_modeled",
        topology: "timber_resilient_bar_one_side_double_board"
      },
      {
        classification: "secondary_benchmark",
        expectedRw: 59,
        id: "knauf_gb_en_tp_89_38_rb2_2x15_soundshield_plus_90_fill_lab_2026",
        reason: "resilient_bar_side_count_not_explicitly_modeled",
        topology: "timber_resilient_bar_both_sides_double_board"
      },
      {
        classification: "secondary_benchmark",
        expectedRw: 55,
        id: "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
        reason: "resilient_bar_side_count_not_explicitly_modeled",
        topology: "timber_resilient_bar_one_side_double_board"
      },
      {
        classification: "secondary_benchmark",
        expectedRw: 58,
        id: "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026",
        reason: "resilient_bar_side_count_not_explicitly_modeled",
        topology: "timber_resilient_bar_both_sides_double_board"
      }
    ]);
  });
});
