import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildSimpleWorkbenchCorridorDossier } from "./simple-workbench-corridor-dossier";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);

  return evaluateScenario({
    id: preset.id,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
    source: "current",
    studyMode: preset.studyMode,
    targetOutputs: preset.studyMode === "floor" ? ["Rw", "Ln,w", "L'n,w", "L'nT,w"] : ["Rw", "R'w", "DnT,w"]
  });
}

describe("simple workbench corridor dossier", () => {
  it("packages active family, benchmark mode, tolerance, and field continuation for a guided floor route", () => {
    const preset = getPresetById("heavy_concrete_impact_floor");
    const scenario = evaluatePreset("heavy_concrete_impact_floor");
    const dossier = buildSimpleWorkbenchCorridorDossier(scenario.result, preset.studyMode);

    expect(dossier.headline).toContain("Family-specific estimate");
    expect(dossier.headline).toContain("reinforced concrete");
    expect(dossier.headline).toContain("lab-side only");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Active family", value: "reinforced concrete" }),
        expect.objectContaining({ label: "Benchmark mode", value: "Family-specific estimate" }),
        expect.objectContaining({ label: "Tolerance band", value: "0 dB" }),
        expect.objectContaining({ label: "Field continuation", value: "Lab-side only" })
      ])
    );
  });

  it("switches to airborne-lane semantics for wall field routes", () => {
    const preset = getPresetById("concrete_wall");
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3000,
        receivingRoomVolumeM3: 42
      },
      id: preset.id,
      name: preset.label,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      source: "current",
      studyMode: preset.studyMode,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });
    const dossier = buildSimpleWorkbenchCorridorDossier(scenario.result, preset.studyMode);

    expect(dossier.headline).toContain("active wall validation posture");
    expect(dossier.headline).toContain("field-side airborne chain");
    expect(dossier.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Airborne lane" }),
        expect.objectContaining({ label: "Route posture" }),
        expect.objectContaining({ label: "Solver spread" }),
        expect.objectContaining({ label: "Field route", value: "Room-to-room field" })
      ])
    );
    expect(dossier.cards.find((card) => card.label === "Active family")).toBeUndefined();
  });

  it("keeps wall corridor dossiers explicit when the current selector sits on a protected boundary hold", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        airtightness: "good",
        panelHeightMm: 2700,
        panelWidthMm: 3000,
        receivingRoomRt60S: 0.5,
        receivingRoomVolumeM3: 30,
        sharedTrack: "independent"
      },
      calculator: "dynamic",
      id: "corridor-aac-boundary",
      name: "corridor-aac-boundary",
      rows: [
        { id: "corridor-aac-boundary-1", materialId: "ytong_aac_d700", thicknessMm: "100" },
        { id: "corridor-aac-boundary-2", materialId: "air_gap", thicknessMm: "50" },
        { id: "corridor-aac-boundary-3", materialId: "gypsum_board", thicknessMm: "12.5" }
      ],
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    });
    const dossier = buildSimpleWorkbenchCorridorDossier(scenario.result, "wall");

    expect(dossier.cards.find((card) => card.label === "Route posture")?.detail).toContain(
      "ambiguous boundary with Double Leaf"
    );
    expect(dossier.cards.find((card) => card.label === "Route posture")?.detail).toContain("protected corridor hold");
    expect(dossier.cards.find((card) => card.label === "Solver spread")?.value).toBe("26 dB");
  });

  it("stays explicit when no live result is attached yet", () => {
    const dossier = buildSimpleWorkbenchCorridorDossier(null, "floor");

    expect(dossier.cards.find((card) => card.label === "Active family")?.value).toBe("Waiting for supported route");
    expect(dossier.cards.find((card) => card.label === "Benchmark mode")?.value).toBe("No benchmark mode");
    expect(dossier.headline).toContain("No validation corridor is attached yet");
  });
});
