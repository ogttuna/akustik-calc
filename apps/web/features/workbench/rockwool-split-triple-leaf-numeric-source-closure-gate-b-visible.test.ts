import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getGuidedTopologyGap } from "./guided-topology-gap";
import {
  ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD
} from "./rockwool-triple-leaf-screening-policy-copy";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard, type BaseOutputCardModel } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const GROUPED_TRIPLE_LEAF_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const SPLIT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const ADJACENT_ROCKWOOL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "mlv", thicknessMm: "4" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_plaster", thicknessMm: "10" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

function withIds(rows: readonly Omit<LayerDraft, "id">[], scenarioId: string): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${scenarioId}-${index + 1}`
  }));
}

function evaluate(input: {
  airborneContext: AirborneContext;
  id: string;
  outputs: readonly RequestedOutputId[];
  rows: readonly Omit<LayerDraft, "id">[];
}) {
  const rows = withIds(input.rows, input.id);
  const scenario = evaluateScenario({
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    id: input.id,
    name: input.id,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: input.outputs
  });

  expect(scenario.result, `${input.id} should evaluate`).not.toBeNull();

  if (!scenario.result) {
    throw new Error(`${input.id} did not evaluate.`);
  }

  const cards = new Map(
    input.outputs.map((output) => [
      output,
      buildOutputCard({
        output,
        result: scenario.result,
        studyMode: "wall"
      })
    ])
  );

  return {
    cards,
    result: scenario.result,
    rows,
    topologyGap: getGuidedTopologyGap({
      result: scenario.result,
      rows,
      studyMode: "wall"
    }),
    warnings: scenario.warnings
  };
}

function card(cards: ReadonlyMap<RequestedOutputId, BaseOutputCardModel>, output: RequestedOutputId): BaseOutputCardModel {
  const model = cards.get(output);

  if (!model) {
    throw new Error(`Missing ${output} card`);
  }

  return model;
}

describe("Rockwool split triple-leaf numeric source closure Gate B visible guard", () => {
  it("shows flat-list split/internal Rockwool outputs as not ready instead of live Rw 41", () => {
    const snapshot = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "gate-b-rockwool-split-flat-lab",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    expect(snapshot.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(snapshot.result.metrics.estimatedRwDb).toBe(41);
    expect(snapshot.result.supportedTargetOutputs).toEqual([]);
    expect(snapshot.result.unsupportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(card(snapshot.cards, "Rw")).toMatchObject({
      detail: ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD,
      status: "unsupported",
      value: "Not ready"
    });
    expect(card(snapshot.cards, "STC")).toMatchObject({
      detail: ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD,
      status: "unsupported",
      value: "Not ready"
    });
    expect(snapshot.topologyGap).toMatchObject({ value: "Grouped topology missing" });
    expect(snapshot.warnings.join("\n")).toContain("Rockwool split/internal gypsum-leaf flat-list outputs were withheld");
  });

  it("withholds flat-list split/internal field outputs from visible output cards", () => {
    const snapshot = evaluate({
      airborneContext: WALL_FIELD_CONTEXT,
      id: "gate-b-rockwool-split-flat-field",
      outputs: WALL_FIELD_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    expect(snapshot.result.metrics).toMatchObject({
      estimatedDnTwDb: 40,
      estimatedRwPrimeDb: 39
    });
    expect(snapshot.result.supportedTargetOutputs).toEqual([]);
    expect(snapshot.result.unsupportedTargetOutputs).toEqual([...WALL_FIELD_OUTPUTS]);
    expect(card(snapshot.cards, "R'w")).toMatchObject({
      detail: ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD,
      status: "unsupported",
      value: "Not ready"
    });
    expect(card(snapshot.cards, "DnT,w")).toMatchObject({
      detail: ROCKWOOL_SPLIT_TRIPLE_LEAF_OUTPUT_WITHHELD_GUARD,
      status: "unsupported",
      value: "Not ready"
    });
  });

  it("keeps adjacent and grouped Rockwool surfaces on their separate guarded lanes", () => {
    const adjacent = evaluate({
      airborneContext: WALL_LAB_CONTEXT,
      id: "gate-b-rockwool-adjacent-flat-lab",
      outputs: WALL_LAB_OUTPUTS,
      rows: ADJACENT_ROCKWOOL_ROWS
    });
    const grouped = evaluate({
      airborneContext: GROUPED_TRIPLE_LEAF_LAB_CONTEXT,
      id: "gate-b-rockwool-split-grouped-lab",
      outputs: WALL_LAB_OUTPUTS,
      rows: SPLIT_ROCKWOOL_ROWS
    });

    expect(adjacent.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "double_leaf",
      strategy: "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology"
    });
    expect(card(adjacent.cards, "Rw")).toMatchObject({
      status: "live",
      value: "51 dB"
    });
    expect(adjacent.result.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);

    expect(grouped.result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "low",
      detectedFamily: "multileaf_multicavity",
      strategy: "multileaf_screening_blend"
    });
    expect(card(grouped.cards, "Rw")).toMatchObject({
      detail: ROCKWOOL_GROUPED_TRIPLE_LEAF_SCREENING_ONLY_GUARD,
      status: "live",
      value: "41 dB"
    });
    expect(grouped.result.supportedTargetOutputs).toEqual([...WALL_LAB_OUTPUTS]);
    expect(grouped.topologyGap).toMatchObject({ value: "Source validation blocked" });
  });
});
