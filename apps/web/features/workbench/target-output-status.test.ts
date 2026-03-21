import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { getTargetOutputCorridor, getTargetOutputStatus } from "./target-output-status";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const targetOutputs =
    preset.studyMode === "floor"
      ? (["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"] as const)
      : (["Rw", "R'w", "DnT,w", "Dn,w", "STC", "C", "Ctr"] as const);

  return evaluateScenario({
    id: preset.id,
    name: preset.label,
    rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
    source: "current",
    studyMode: preset.studyMode,
    targetOutputs
  });
}

const FIELD_WALL_ROWS = [
  { id: "wall-1", materialId: "gypsum_board", thicknessMm: "12.5" },
  { id: "wall-2", materialId: "air_gap", thicknessMm: "75" },
  { id: "wall-3", materialId: "rockwool", thicknessMm: "75" },
  { id: "wall-4", materialId: "gypsum_board", thicknessMm: "12.5" }
] as const;

describe("getTargetOutputStatus", () => {
  it("keeps lightweight-steel crossover bounds explicit on both impact and airborne companion cards", () => {
    const scenario = evaluatePreset("ubiq_steel_300_unspecified_bound");

    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    });
    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });

    expect(lnwStatus.kind).toBe("engine_bound");
    expect(lnwStatus.label).toBe("Crossover bound");
    expect(lnwStatus.note).toContain("carrier is open");
    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("carrier stays unspecified");
  });

  it("keeps converged lightweight-steel bound interpolation off the crossover label", () => {
    const scenario = evaluatePreset("ubiq_steel_200_unspecified_bound");

    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    });
    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });

    expect(lnwStatus.kind).toBe("engine_bound");
    expect(lnwStatus.label).toBe("Bound support");
    expect(lnwStatus.note).not.toContain("carrier is open");
    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).not.toContain("carrier stays unspecified");
  });

  it("keeps timber bare-floor low-confidence airborne outputs explicit on the same published-family fallback lane", () => {
    const scenario = evaluatePreset("timber_bare_impact_only_fallback");

    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });
    const ctrStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ctr",
      result: scenario.result
    });
    const ciStatus = getTargetOutputStatus({
      guideResult: null,
      output: "CI",
      result: scenario.result
    });

    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("same low-confidence published-family fallback");
    expect(ctrStatus.kind).toBe("engine_live");
    expect(ctrStatus.note).toContain("same low-confidence published-family fallback");
    expect(ciStatus.kind).toBe("engine_live");
    expect(ciStatus.label).toBe("Family estimate");
    expect(ciStatus.note).toContain("supported guide lane");
  });

  it("keeps apparent field airborne outputs explicit while geometry-gated outputs stay parked", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms"
      },
      id: "wall-field-route",
      name: "Wall field route",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["R'w", "Dn,w", "DnT,w"]
    });

    const rwPrimeStatus = getTargetOutputStatus({
      guideResult: null,
      output: "R'w",
      result: scenario.result
    });
    const dnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Dn,w",
      result: scenario.result
    });
    const dntwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,w",
      result: scenario.result
    });
    const rwPrimeCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "R'w",
      result: scenario.result
    });

    expect(rwPrimeStatus.kind).toBe("engine_live");
    expect(rwPrimeStatus.label).toBe("Apparent field");
    expect(rwPrimeStatus.note).toContain("Room-to-room field route is active");
    expect(dnwStatus.kind).toBe("pending_input");
    expect(dnwStatus.label).toBe("Need partition geometry");
    expect(dnwStatus.note).toContain("partition width and height");
    expect(dntwStatus.kind).toBe("pending_input");
    expect(dntwStatus.label).toBe("Need partition geometry");
    expect(rwPrimeCorridor.laneLabel).toBe("Field airborne lane");
    expect(rwPrimeCorridor.modeLabel).toBe("Room-to-room field");
  });

  it("separates room-volume blockers from geometry blockers on standardized airborne outputs", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "field_between_rooms",
        panelHeightMm: 2800,
        panelWidthMm: 3000
      },
      id: "wall-field-geometry-only",
      name: "Wall field geometry only",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["Dn,w", "DnT,w", "DnT,A"]
    });

    const dnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Dn,w",
      result: scenario.result
    });
    const dntwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,w",
      result: scenario.result
    });
    const dntaStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,A",
      result: scenario.result
    });

    expect(dnwStatus.kind).toBe("engine_live");
    expect(dnwStatus.label).toBe("Area-normalized");
    expect(dnwStatus.note).toContain("partition area only");
    expect(dntwStatus.kind).toBe("pending_input");
    expect(dntwStatus.label).toBe("Need room volume");
    expect(dntwStatus.note).toContain("receiving-room volume");
    expect(dntaStatus.label).toBe("Need room volume");
  });

  it("keeps DnT,A,k source companions explicit on the field airborne lane", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        airtightness: "good",
        contextMode: "field_between_rooms"
      },
      id: "wall-dntak-companion",
      name: "Wall DnTAk companion",
      rows: [
        { id: "aac-1", materialId: "skim_plaster", thicknessMm: "3" },
        { id: "aac-2", materialId: "ytong_separatiepaneel_aac_5_750", thicknessMm: "100" },
        { id: "aac-3", materialId: "skim_plaster", thicknessMm: "3" }
      ],
      source: "current",
      studyMode: "wall",
      targetOutputs: ["DnT,A,k", "DnT,A"]
    });

    const dnTAkStatus = getTargetOutputStatus({
      guideResult: null,
      output: "DnT,A,k",
      result: scenario.result
    });
    const dnTAkCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "DnT,A,k",
      result: scenario.result
    });

    expect(dnTAkStatus.kind).toBe("engine_live");
    expect(dnTAkStatus.label).toBe("Source companion");
    expect(dnTAkStatus.note).toMatch(/official approximate field companion/i);
    expect(dnTAkCorridor.laneLabel).toBe("Field airborne lane");
    expect(dnTAkCorridor.detail).toMatch(/official approximate field companion/i);
  });
});
