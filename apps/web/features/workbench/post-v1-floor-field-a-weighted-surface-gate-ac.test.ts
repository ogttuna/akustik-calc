import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { FLOOR_OUTPUT_PRESET_BUILDING, FLOOR_OUTPUT_PRESET_FIELD } from "./simple-workbench-constants";
import { pickPrimaryOutputCard } from "./simple-workbench-output-cards";
import {
  addOutputCardPosture,
  buildOutputCard,
  type OutputCardModel
} from "./simple-workbench-output-model";

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const COMPLETE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

function evaluateFloorPreset(
  presetId: PresetId,
  outputs: readonly RequestedOutputId[],
  airborneContext: AirborneContext
) {
  const preset = getPresetById(presetId);
  const result = evaluateScenario({
    airborneContext,
    id: `${preset.id}-gate-ac`,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-gate-ac-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: outputs
  }).result;

  expect(result, `${preset.id} should evaluate`).not.toBeNull();
  if (!result) {
    throw new Error(`${preset.id} did not evaluate.`);
  }

  return {
    cards: new Map(
      outputs.map((output) => [
        output,
        addOutputCardPosture(
          buildOutputCard({
            output,
            result,
            studyMode: "floor"
          }),
          { result, studyMode: "floor" }
        )
      ])
    ),
    result
  };
}

function expectLiveCard(cards: Map<RequestedOutputId, OutputCardModel>, output: RequestedOutputId, value: string) {
  const card = cards.get(output);
  expect(card?.status, output).toBe("live");
  expect(card?.value, output).toBe(value);
}

describe("post-V1 floor field A-weighted surface Gate AC web", () => {
  it("adds floor field A-weighted airborne outputs to automatic field and building presets", () => {
    expect(FLOOR_OUTPUT_PRESET_FIELD).toEqual([
      "Ln,w",
      "DeltaLw",
      "Ln,w+CI",
      "Rw",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "L'n,w"
    ]);
    expect(FLOOR_OUTPUT_PRESET_BUILDING).toEqual([
      "Ln,w",
      "DeltaLw",
      "Ln,w+CI",
      "Rw",
      "R'w",
      "Dn,w",
      "Dn,A",
      "DnT,w",
      "DnT,A",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
  });

  it("shows complete heavy-concrete floor Dn,A and DnT,A cards on the automatic building preset", () => {
    const { cards, result } = evaluateFloorPreset(
      "heavy_concrete_impact_floor",
      FLOOR_OUTPUT_PRESET_BUILDING,
      BUILDING_CONTEXT
    );

    expect(result.supportedTargetOutputs).toEqual(expect.arrayContaining(["Dn,w", "Dn,A", "DnT,w", "DnT,A"]));
    expectLiveCard(cards, "Dn,w", "57 dB");
    expectLiveCard(cards, "Dn,A", "56.1 dB");
    expectLiveCard(cards, "DnT,w", "60 dB");
    expectLiveCard(cards, "DnT,A", "58.6 dB");
  });

  it("shows complete lightweight-steel floor Dn,A and DnT,A cards on the automatic field preset", () => {
    const { cards, result } = evaluateFloorPreset(
      "steel_suspended_fallback",
      FLOOR_OUTPUT_PRESET_FIELD,
      COMPLETE_FIELD_CONTEXT
    );

    expect(result.supportedTargetOutputs).toEqual(expect.arrayContaining(["Dn,w", "Dn,A", "DnT,w", "DnT,A"]));
    expectLiveCard(cards, "Dn,w", "69 dB");
    expectLiveCard(cards, "Dn,A", "68.1 dB");
    expectLiveCard(cards, "DnT,w", "72 dB");
    expectLiveCard(cards, "DnT,A", "70.6 dB");
  });

  it("keeps A-weighted floor cards eligible as primary outputs when they are the only requested field results", () => {
    const { cards } = evaluateFloorPreset("heavy_concrete_impact_floor", ["Dn,A", "DnT,A"], BUILDING_CONTEXT);
    const primary = pickPrimaryOutputCard([cards.get("Dn,A")!, cards.get("DnT,A")!], "floor");

    expect(primary?.label).toBe("DnT,A");
    expect(primary?.value).toBe("58.6 dB");
  });
});
