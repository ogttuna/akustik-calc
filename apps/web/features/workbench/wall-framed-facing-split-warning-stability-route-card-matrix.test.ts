import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

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

const LSF_FIELD_CONTEXT: AirborneContext = {
  connectionType: "line_connection",
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const LSF_DOUBLE_BOARD_ROWS: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
];

const EXPECTED_FIELD_CARDS: Record<WallOutputId, CardSnapshot> = {
  Rw: { status: "unsupported", value: "Not ready" },
  "R'w": { status: "live", value: "51 dB" },
  "Dn,w": { status: "live", value: "51 dB" },
  "Dn,A": { status: "live", value: "49.6 dB" },
  "DnT,w": { status: "live", value: "52 dB" },
  "DnT,A": { status: "live", value: "51.1 dB" },
  STC: { status: "live", value: "51 dB" },
  C: { status: "live", value: "-1.4 dB" },
  Ctr: { status: "live", value: "-6.4 dB" }
};

const MONOTONIC_FLOOR_WARNING =
  "A framed reinforcement monotonic floor was applied because one-face board reinforcement unexpectedly scored below its lighter sibling variant.";
const GUIDED_SANITY_WARNING_PATTERN = /outside the guided sanity band/i;

function toDraftRows(rows: readonly LayerInput[], id: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`,
    thicknessMm: String(row.thicknessMm)
  }));
}

function splitBoardRow(rows: readonly LayerInput[], rowIndex: number): LayerInput[] {
  const row = rows[rowIndex];

  if (!row) {
    throw new Error(`Cannot split missing LSF row ${rowIndex}.`);
  }

  return [
    ...rows.slice(0, rowIndex),
    { ...row, thicknessMm: row.thicknessMm / 2 },
    { ...row, thicknessMm: row.thicknessMm / 2 },
    ...rows.slice(rowIndex + 1)
  ];
}

function evaluateLsfRoute(rows: readonly LayerInput[], id: string) {
  const scenario = evaluateScenario({
    airborneContext: LSF_FIELD_CONTEXT,
    calculator: "dynamic",
    id,
    name: id,
    rows: toDraftRows(rows, id),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });

  expect(scenario.result, `${id} result`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  return {
    cards: Object.fromEntries(
      WALL_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result: scenario.result,
          studyMode: "wall"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as Record<WallOutputId, CardSnapshot>,
    result: scenario.result,
    warnings: scenario.warnings
  };
}

function acousticWarnings(warnings: readonly string[]): readonly string[] {
  return warnings.filter((warning) => !GUIDED_SANITY_WARNING_PATTERN.test(warning));
}

describe("wall framed facing split warning stability route-card matrix", () => {
  it("keeps the visible LSF field cards and acoustic warnings stable when a facing board is split", () => {
    const baseline = evaluateLsfRoute(LSF_DOUBLE_BOARD_ROWS, "lsf-baseline");
    const split = evaluateLsfRoute(splitBoardRow(LSF_DOUBLE_BOARD_ROWS, 0), "lsf-split-leading-board");

    expect(baseline.cards).toEqual(EXPECTED_FIELD_CARDS);
    expect(split.cards).toEqual(EXPECTED_FIELD_CARDS);
    expect(split.cards).toEqual(baseline.cards);

    expect(baseline.result.supportedTargetOutputs).toEqual([
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "STC",
      "C",
      "Ctr"
    ]);
    expect(split.result.supportedTargetOutputs).toEqual(baseline.result.supportedTargetOutputs);
    expect(split.result.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(split.result.dynamicAirborneTrace?.strategy).toBe(
      "stud_surrogate_blend+framed_wall_calibration"
    );
    expect(split.result.dynamicAirborneTrace?.originalSolidLayerCount).toBe(5);

    expect(acousticWarnings(split.warnings)).toEqual(acousticWarnings(baseline.warnings));
    expect(split.warnings.some((warning) => /Acoustic Gypsum Board/i.test(warning))).toBe(true);
    expect(split.warnings).not.toContain(MONOTONIC_FLOOR_WARNING);
  });
});
