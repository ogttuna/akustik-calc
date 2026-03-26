import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import type { LayerDraft } from "./workbench-store";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w"];

const DATAHOLZ_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: "60" },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: "30" },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "140" }
];

const OPEN_BOX_DRY_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "50" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const UBIQ_STEEL_300_EXACT_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

function evaluateFloorScenario(input: {
  id: string;
  impactFieldContext?: Parameters<typeof evaluateScenario>[0]["impactFieldContext"];
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return evaluateScenario({
    id: input.id,
    impactFieldContext: input.impactFieldContext,
    name: input.id,
    rows: input.rows.map((row, index) => ({ ...row, id: `${input.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: input.targetOutputs
  });
}

function resultSnapshot(result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>) {
  return {
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
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

function stripGuidedSanityWarnings(warnings: readonly string[]) {
  return warnings.filter((warning) => !/outside the guided sanity band|missing a valid thickness/i.test(warning));
}

function assertStableAcrossContiguousSplits(input: {
  baselineId: string;
  impactFieldContext?: Parameters<typeof evaluateScenario>[0]["impactFieldContext"];
  rowIndex: number;
  rows: readonly Omit<LayerDraft, "id">[];
  splitPairs: readonly [string, string][];
  targetOutputs: readonly RequestedOutputId[];
}) {
  const baselineScenario = evaluateFloorScenario({
    id: input.baselineId,
    impactFieldContext: input.impactFieldContext,
    rows: input.rows,
    targetOutputs: input.targetOutputs
  });

  expect(baselineScenario.result).not.toBeNull();
  const baselineSnapshot = resultSnapshot(baselineScenario.result!);

  for (const [firstThicknessMm, secondThicknessMm] of input.splitPairs) {
    const scenario = evaluateFloorScenario({
      id: `${input.baselineId}-${firstThicknessMm}-${secondThicknessMm}`,
      impactFieldContext: input.impactFieldContext,
      rows: splitRow(input.rows, input.rowIndex, firstThicknessMm, secondThicknessMm),
      targetOutputs: input.targetOutputs
    });

    expect(scenario.result, `${input.baselineId} ${firstThicknessMm}+${secondThicknessMm} should still resolve`).not.toBeNull();
    expect(resultSnapshot(scenario.result!), `${input.baselineId} ${firstThicknessMm}+${secondThicknessMm} should stay numerically stable`).toEqual(
      baselineSnapshot
    );
    expect(
      stripGuidedSanityWarnings(scenario.warnings),
      `${input.baselineId} ${firstThicknessMm}+${secondThicknessMm} should keep the same non-sanity warning contract`
    ).toEqual(stripGuidedSanityWarnings(baselineScenario.warnings));
  }
}

describe("guided floor stack invariance", () => {
  it("keeps the Dataholz dry CLT exact row stable across every contiguous split of the 25 mm walking layer", () => {
    assertStableAcrossContiguousSplits({
      baselineId: "dataholz-dry-floor-cover",
      rowIndex: 0,
      rows: DATAHOLZ_DRY_EXACT_ROWS,
      splitPairs: contiguousSplitPairs(25),
      targetOutputs: LAB_OUTPUTS
    });
  });

  it("keeps the Dataholz dry CLT local-guide field route stable across every contiguous split of the 60 mm upper fill", () => {
    assertStableAcrossContiguousSplits({
      baselineId: "dataholz-dry-field-upper-fill",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      rowIndex: 1,
      rows: DATAHOLZ_DRY_EXACT_ROWS,
      splitPairs: contiguousSplitPairs(60),
      targetOutputs: FIELD_OUTPUTS
    });
  });

  it("keeps the TUAS open-box dry exact row stable across every contiguous split of the 50 mm upper fill", () => {
    assertStableAcrossContiguousSplits({
      baselineId: "open-box-dry-upper-fill",
      rowIndex: 6,
      rows: OPEN_BOX_DRY_EXACT_ROWS,
      splitPairs: contiguousSplitPairs(50),
      targetOutputs: LAB_OUTPUTS
    });
  });

  it("keeps the TUAS open-box dry field route stable across every contiguous split of the 50 mm upper fill", () => {
    assertStableAcrossContiguousSplits({
      baselineId: "open-box-dry-field-upper-fill",
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 55
      },
      rowIndex: 6,
      rows: OPEN_BOX_DRY_EXACT_ROWS,
      splitPairs: contiguousSplitPairs(50),
      targetOutputs: FIELD_OUTPUTS
    });
  });

  it("keeps the curated UBIQ open-web steel exact row stable across every contiguous split of the 19 mm INEX panel", () => {
    assertStableAcrossContiguousSplits({
      baselineId: "ubiq-inex-panel",
      rowIndex: 6,
      rows: UBIQ_STEEL_300_EXACT_ROWS,
      splitPairs: contiguousSplitPairs(19),
      targetOutputs: LAB_OUTPUTS
    });
  });
});
