import { describe, expect, it } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { getTargetOutputCorridor, getTargetOutputStatus } from "./target-output-status";
import type { AssemblyCalculation } from "@dynecho/shared";

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

function buildReinforcedConcreteLowConfidenceResult(): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [52, 60, 67]
    },
    dynamicImpactTrace: {
      detectedSupportFamily: "reinforced_concrete",
      estimateTier: "low_confidence",
      estimateTierLabel: "Low-confidence fallback · reinforced concrete",
      selectedLabel: "Low-confidence fallback · reinforced concrete",
      selectionKindLabel: "Low-confidence fallback",
      systemType: "combined_upper_lower_system",
      systemTypeLabel: "Combined upper and lower system"
    } as AssemblyCalculation["dynamicImpactTrace"],
    floorSystemEstimate: {
      kind: "low_confidence"
    } as AssemblyCalculation["floorSystemEstimate"],
    floorSystemRatings: {
      Rw: 65.9,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr",
      basis: "predictor_floor_system_low_confidence_estimate"
    },
    impact: {
      basis: "predictor_floor_system_low_confidence_estimate",
      LnW: 50
    } as AssemblyCalculation["impact"],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -2,
      estimatedCtrDb: -8.9,
      estimatedRwDb: 65.9,
      estimatedStc: 65,
      insulationCount: 1,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 410,
      totalThicknessMm: 446
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 66 (-2;-9)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
    unsupportedTargetOutputs: [],
    warnings: []
  } as AssemblyCalculation;
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

  it("keeps bound-only field carry-over explicit on L'n,w and L'nT,w once K and room volume are present while companion Rw stays live", () => {
    const preset = getPresetById("ubiq_open_web_300_bound");
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "building_prediction",
        panelHeightMm: 3000,
        panelWidthMm: 4200,
        receivingRoomVolumeM3: 55
      },
      id: `${preset.id}-field-bound-status`,
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      name: preset.label,
      rows: preset.rows.map((row, index) => ({ ...row, id: `${preset.id}-${index + 1}` })),
      source: "current",
      studyMode: "floor",
      targetOutputs: ["Ln,w", "L'n,w", "L'nT,w", "Rw", "DnT,w"]
    });

    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result: scenario.result
    });
    const lPrimeNwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "L'n,w",
      result: scenario.result
    });
    const lPrimeNTwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "L'nT,w",
      result: scenario.result
    });
    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });

    expect(lnwStatus.kind).toBe("engine_bound");
    expect(lnwStatus.label).toBe("Bound support");
    expect(lPrimeNwStatus.kind).toBe("engine_bound");
    expect(lPrimeNwStatus.note).toContain("conservative bound");
    expect(lPrimeNTwStatus.kind).toBe("engine_bound");
    expect(lPrimeNTwStatus.note).toContain("conservative bound");
    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("curated floor-family companions");
  });

  it("keeps timber bare-floor low-confidence outputs explicit while withholding unsupported Ctr", () => {
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
    expect(ctrStatus.kind).toBe("unavailable");
    expect(ctrStatus.note).toContain("keeping this requested output explicit instead of inventing a number");
    expect(ciStatus.kind).toBe("engine_live");
    expect(ciStatus.label).toBe("Family estimate");
    expect(ciStatus.note).toContain("supported guide lane");
  });

  it("keeps reinforced-concrete low-confidence combined outputs explicit as mixed-row proxies", () => {
    const result = buildReinforcedConcreteLowConfidenceResult();

    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result
    });
    const ctrStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ctr",
      result
    });
    const lnwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Ln,w",
      result
    });
    const rwCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "Rw",
      result
    });
    const lnwCorridor = getTargetOutputCorridor({
      guideResult: null,
      output: "Ln,w",
      result
    });

    expect(rwStatus.kind).toBe("engine_live");
    expect(rwStatus.note).toContain("Proxy airborne companion");
    expect(rwStatus.note).toContain("narrow same-stack family claim");
    expect(ctrStatus.kind).toBe("engine_live");
    expect(ctrStatus.note).toContain("Proxy traffic-noise companion");
    expect(lnwStatus.kind).toBe("engine_live");
    expect(lnwStatus.note).toContain("mixed nearby-row concrete lane");
    expect(rwCorridor.detail).toContain("Proxy airborne companion");
    expect(lnwCorridor.detail).toContain("mixed nearby-row concrete lane");
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

  it("keeps wall-side Rw unavailable once the airborne route is explicitly apparent", () => {
    const scenario = evaluateScenario({
      airborneContext: {
        contextMode: "building_prediction",
        panelHeightMm: 3000,
        panelWidthMm: 4200,
        receivingRoomRt60S: 0.7,
        receivingRoomVolumeM3: 55
      },
      id: "wall-building-route",
      name: "Wall building route",
      rows: FIELD_WALL_ROWS,
      source: "current",
      studyMode: "wall",
      targetOutputs: ["Rw", "R'w", "Dn,w", "DnT,w"]
    });

    const rwStatus = getTargetOutputStatus({
      guideResult: null,
      output: "Rw",
      result: scenario.result
    });
    const rwPrimeStatus = getTargetOutputStatus({
      guideResult: null,
      output: "R'w",
      result: scenario.result
    });

    expect(rwStatus.kind).toBe("unavailable");
    expect(rwStatus.label).toBe("Unavailable on current path");
    expect(rwPrimeStatus.kind).toBe("engine_live");
    expect(rwPrimeStatus.label).toBe("Apparent field");
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
