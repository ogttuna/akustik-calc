import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const WALL_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const FLOOR_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const FLOOR_IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const WALL_STUDY_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "concrete", thicknessMm: "100" }
];

const UBIQ_OPEN_WEB_FIELD_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

function evaluateWallScenario(id: string, rows: readonly Omit<LayerDraft, "id">[]) {
  return evaluateScenario({
    id,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });
}

function evaluateFloorFieldScenario(id: string, rows: readonly Omit<LayerDraft, "id">[]) {
  return evaluateScenario({
    id,
    impactFieldContext: FLOOR_IMPACT_FIELD_CONTEXT,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: FLOOR_FIELD_OUTPUTS
  });
}

function contiguousSplitPairs(totalMm: number): Array<[string, string]> {
  return Array.from({ length: totalMm - 1 }, (_, index) => {
    const first = index + 1;
    return [String(first), String(totalMm - first)];
  });
}

function splitRow(
  rows: readonly Omit<LayerDraft, "id">[],
  rowIndex: number,
  firstThicknessMm: string,
  secondThicknessMm: string
): Omit<LayerDraft, "id">[] {
  const row = rows[rowIndex];

  return [
    ...rows.slice(0, rowIndex),
    { ...row, thicknessMm: firstThicknessMm },
    { ...row, thicknessMm: secondThicknessMm },
    ...rows.slice(rowIndex + 1)
  ];
}

function wallSnapshot(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>) {
  return {
    c: result.metrics.estimatedCDb,
    ctr: result.metrics.estimatedCtrDb,
    rw: result.metrics.estimatedRwDb,
    stc: result.metrics.estimatedStc,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function floorFieldSnapshot(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>) {
  return {
    exactId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

describe("complex stack audit", () => {
  it("keeps the wall study stable across every contiguous split of the 50 mm mineral wool row", () => {
    const baselineScenario = evaluateWallScenario("wall-study-baseline", WALL_STUDY_ROWS);

    expect(baselineScenario.result).not.toBeNull();
    const baselineSnapshot = wallSnapshot(baselineScenario.result!);

    for (const [firstThicknessMm, secondThicknessMm] of contiguousSplitPairs(50)) {
      const scenario = evaluateWallScenario(
        `wall-study-${firstThicknessMm}-${secondThicknessMm}`,
        splitRow(WALL_STUDY_ROWS, 1, firstThicknessMm, secondThicknessMm)
      );

      expect(scenario.result, `wall study ${firstThicknessMm}+${secondThicknessMm} should still resolve`).not.toBeNull();
      expect(
        wallSnapshot(scenario.result!),
        `wall study ${firstThicknessMm}+${secondThicknessMm} should keep the same acoustic snapshot`
      ).toEqual(baselineSnapshot);
    }
  });

  it("keeps the UBIQ open-web local-guide field route stable across every contiguous split of the 145 mm ceiling fill", () => {
    const baselineScenario = evaluateFloorFieldScenario("ubiq-open-web-field-baseline", UBIQ_OPEN_WEB_FIELD_ROWS);

    expect(baselineScenario.result).not.toBeNull();
    const baselineSnapshot = floorFieldSnapshot(baselineScenario.result!);

    for (const [firstThicknessMm, secondThicknessMm] of contiguousSplitPairs(145)) {
      const scenario = evaluateFloorFieldScenario(
        `ubiq-open-web-field-${firstThicknessMm}-${secondThicknessMm}`,
        splitRow(UBIQ_OPEN_WEB_FIELD_ROWS, 3, firstThicknessMm, secondThicknessMm)
      );

      expect(
        scenario.result,
        `UBIQ open-web field ${firstThicknessMm}+${secondThicknessMm} should still resolve`
      ).not.toBeNull();
      expect(
        floorFieldSnapshot(scenario.result!),
        `UBIQ open-web field ${firstThicknessMm}+${secondThicknessMm} should keep the same field snapshot`
      ).toEqual(baselineSnapshot);
    }
  });
});
