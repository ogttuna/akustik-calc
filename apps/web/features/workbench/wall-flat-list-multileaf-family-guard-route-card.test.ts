import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { evaluateScenario } from "./scenario-analysis";
import { addOutputCardPosture, buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const SPLIT_ROCKWOOL_SWAPPED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const CLASSIC_SWAPPED_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ORDINARY_DOUBLE_LEAF_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

function rowsWithIds(rows: readonly Omit<LayerDraft, "id">[], prefix: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${prefix}-${index + 1}`
  }));
}

function evaluateWall(input: {
  airborneContext: AirborneContext;
  id: string;
  outputs: readonly RequestedOutputId[];
  rows: readonly Omit<LayerDraft, "id">[];
}) {
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows: rowsWithIds(input.rows, input.id),
    source: "current",
    studyMode: "wall",
    targetOutputs: input.outputs
  });

  expect(scenario.result, `${input.id} result`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  return scenario.result;
}

function outputCard(output: RequestedOutputId, result: NonNullable<ReturnType<typeof evaluateWall>>) {
  return addOutputCardPosture(buildOutputCard({ output, result, studyMode: "wall" }), {
    result,
    studyMode: "wall"
  });
}

describe("wall flat-list multileaf family guard route-card Gate E", () => {
  it("shows guarded flat-list rockwool as fail-closed multileaf screening rather than exact or double-leaf", () => {
    const result = evaluateWall({
      airborneContext: LAB_CONTEXT,
      id: "guarded-split-rockwool-route",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_SWAPPED_ROWS
    });
    const branch = getDynamicCalcBranchSummary({ result, studyMode: "wall" });
    const rwCard = outputCard("Rw", result);

    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(branch).toMatchObject({
      tone: "warning",
      value: "Multi-Leaf / Multi-Cavity"
    });
    expect(branch.detail).toContain("multileaf screening blend fail closed until grouped topology");
    expect(rwCard).toMatchObject({
      postureLabel: "Airborne screening lane",
      status: "live",
      value: "42 dB"
    });
    expect(rwCard.postureDetail).toContain("No exact wall source row is active");
    expect(result.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning))).toBe(false);
  });

  it("keeps R'w and DnT,w as field continuation on guarded flat-list walls", () => {
    const result = evaluateWall({
      airborneContext: FIELD_CONTEXT,
      id: "guarded-split-rockwool-field-route",
      outputs: WALL_FIELD_OUTPUTS,
      rows: SPLIT_ROCKWOOL_SWAPPED_ROWS
    });
    const rwPrime = outputCard("R'w", result);
    const dnTw = outputCard("DnT,w", result);

    expect(result.dynamicAirborneTrace?.strategy).toBe(
      "multileaf_screening_blend_fail_closed_until_grouped_topology"
    );
    expect(rwPrime).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "40 dB"
    });
    expect(dnTw).toMatchObject({
      postureLabel: "Field continuation",
      status: "live",
      value: "41 dB"
    });
    expect(rwPrime.postureDetail).toContain("not being framed as an independent exact source row");
    expect(dnTw.postureDetail).toContain("not being framed as an independent exact source row");
    expect(result.warnings.some((warning: string) => /Curated exact airborne lab match active/i.test(warning))).toBe(false);
  });

  it("also guards ordinary classic flat-list swaps and leaves ordinary double-leaf visible as double-leaf", () => {
    const guardedClassic = evaluateWall({
      airborneContext: LAB_CONTEXT,
      id: "guarded-classic-route",
      outputs: WALL_LAB_OUTPUTS,
      rows: CLASSIC_SWAPPED_ROWS
    });
    const ordinaryDoubleLeaf = evaluateWall({
      airborneContext: LAB_CONTEXT,
      id: "ordinary-double-leaf-route",
      outputs: WALL_LAB_OUTPUTS,
      rows: ORDINARY_DOUBLE_LEAF_ROWS
    });

    expect(guardedClassic.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(outputCard("Rw", guardedClassic)).toMatchObject({
      postureLabel: "Airborne screening lane",
      value: "33 dB"
    });
    expect(ordinaryDoubleLeaf.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: "double_leaf_porous_fill_delegate"
    });
    expect(getDynamicCalcBranchSummary({ result: ordinaryDoubleLeaf, studyMode: "wall" })).toMatchObject({
      tone: "neutral",
      value: "Double Leaf"
    });
  });
});
