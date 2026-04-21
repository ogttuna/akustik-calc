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
  it("keeps every wall preset aligned across lab, apparent-field, and building contexts", () => {
    const failures: string[] = [];

    // Note: prior to 2026-04-21, `concrete_wall` had C suppressed in every
    // context due to a floor-carrier fallthrough bug (reorder-invariance
    // finding). After the fix in `packages/engine/src/target-output-support.ts`,
    // C falls back to the curve-rating estimate when the floor carrier has
    // no declared C and its semantic is not `ctr_term`. All four wall presets
    // now expose C as a live lab output.
    //
    // The screening-vs-benchmark distinction still matters for `Rw`
    // availability in field/building contexts: screening-only walls
    // (`concrete_wall`) keep Rw live in field/building; benchmark-backed
    // walls switch to R'w and mark Rw unsupported.
    for (const preset of WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "wall")) {
      const labCards = evaluateWallPreset(preset.id, null);
      const fieldCards = evaluateWallPreset(preset.id, FIELD_CONTEXT);
      const buildingCards = evaluateWallPreset(preset.id, BUILDING_CONTEXT);
      const isScreeningConcreteWall = preset.id === "concrete_wall";

      // C is now universally live in lab mode across every wall preset.
      // The screening split only persists on the Rw vs R'w axis in field
      // and building contexts.
      const labLiveOutputs: RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
      const labParkedOutputs: RequestedOutputId[] = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"];
      const labUnavailableOutputs: RequestedOutputId[] = [];
      const fieldLiveOutputs: RequestedOutputId[] = isScreeningConcreteWall
        ? ["Rw", "R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"]
        : ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"];
      const fieldParkedOutputs: RequestedOutputId[] = ["DnT,w", "DnT,A"];
      const fieldUnavailableOutputs: RequestedOutputId[] = isScreeningConcreteWall ? [] : ["Rw"];
      const buildingLiveOutputs: RequestedOutputId[] = isScreeningConcreteWall
        ? ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"]
        : ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"];
      const buildingUnavailableOutputs: RequestedOutputId[] = isScreeningConcreteWall ? [] : ["Rw"];

      for (const output of labLiveOutputs) {
        if (labCards.get(output)?.status !== "live") {
          failures.push(`${preset.id}: expected ${output} to stay live in lab mode`);
        }
      }

      for (const output of labUnavailableOutputs) {
        if (labCards.get(output)?.status !== "unsupported") {
          failures.push(`${preset.id}: expected ${output} to stay unsupported in lab mode`);
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

      for (const output of fieldUnavailableOutputs) {
        const card = fieldCards.get(output)!;
        if (card.status !== "unsupported") {
          failures.push(`${preset.id}: expected ${output} to stay explicit on the apparent field route`);
        }
      }

      for (const output of buildingLiveOutputs) {
        if (buildingCards.get(output)?.status !== "live") {
          failures.push(`${preset.id}: expected ${output} to stay live on the building route`);
        }

        const card = buildingCards.get(output)!;
        if (/not ready/i.test(card.value)) {
          failures.push(`${preset.id}: ${output} should not show Not ready on the building route`);
        }
      }

      for (const output of buildingUnavailableOutputs) {
        const card = buildingCards.get(output)!;
        if (card.status !== "unsupported") {
          failures.push(`${preset.id}: expected ${output} to stay explicit on the building route`);
        }

        if (!/not ready/i.test(card.value)) {
          failures.push(`${preset.id}: ${output} should stay explicit instead of showing a fabricated building value`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
