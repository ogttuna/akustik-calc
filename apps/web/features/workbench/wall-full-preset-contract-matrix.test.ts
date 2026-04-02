import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId, WORKBENCH_PRESETS } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"];

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

function evaluateWallPreset(presetId: PresetId, airborneContext: AirborneContext | null) {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${preset.id}-${index + 1}`
  }));

  const result = evaluateScenario({
    airborneContext,
    id: `${preset.id}-${airborneContext?.contextMode ?? "lab"}`,
    impactFieldContext: null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  }).result;

  return new Map(
    WALL_OUTPUTS.map((output) => [
      output,
      buildOutputCard({
        output,
        result,
        studyMode: "wall"
      })
    ])
  );
}

describe("wall full preset contract matrix", () => {
  it("keeps every wall preset aligned across lab, field, and building contexts", () => {
    const failures: string[] = [];

    for (const preset of WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "wall")) {
      const labCards = evaluateWallPreset(preset.id, null);
      const fieldCards = evaluateWallPreset(preset.id, FIELD_CONTEXT);
      const buildingCards = evaluateWallPreset(preset.id, BUILDING_CONTEXT);

      const labLiveOutputs: RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
      const labParkedOutputs: RequestedOutputId[] = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"];
      const fieldLiveOutputs: RequestedOutputId[] = ["Rw", "R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"];
      const fieldParkedOutputs: RequestedOutputId[] = ["DnT,w", "DnT,A"];

      for (const output of labLiveOutputs) {
        if (labCards.get(output)?.status !== "live") {
          failures.push(`${preset.id}: expected ${output} to stay live in lab mode`);
        }
      }

      for (const output of labParkedOutputs) {
        if (labCards.get(output)?.status !== "needs_input") {
          failures.push(`${preset.id}: expected ${output} to stay parked in lab mode`);
        }
      }

      for (const output of fieldLiveOutputs) {
        if (fieldCards.get(output)?.status !== "live") {
          failures.push(`${preset.id}: expected ${output} to stay live on the room-to-room field route`);
        }
      }

      for (const output of fieldParkedOutputs) {
        if (fieldCards.get(output)?.status !== "needs_input") {
          failures.push(`${preset.id}: expected ${output} to keep waiting for room volume on the field route`);
        }
      }

      for (const output of WALL_OUTPUTS) {
        if (buildingCards.get(output)?.status !== "live") {
          failures.push(`${preset.id}: expected ${output} to stay live on the building route`);
        }

        const card = buildingCards.get(output)!;
        if (/not ready/i.test(card.value)) {
          failures.push(`${preset.id}: ${output} should not show Not ready on the building route`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
