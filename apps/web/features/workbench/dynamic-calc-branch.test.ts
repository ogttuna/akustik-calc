import type { AirborneContext, AssemblyCalculation, FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";

function evaluatePreset(presetId: PresetId) {
  const preset = getPresetById(presetId);
  const targetOutputs =
    preset.studyMode === "floor"
      ? (["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const)
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

function evaluateFloorRows(id: string, rows: Array<{ floorRole: FloorRole; materialId: string; thicknessMm: string }>) {
  return evaluateScenario({
    id,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"]
  });
}

const FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
} as const satisfies AirborneContext;

const WALL_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

function evaluateWallRows(id: string, rows: Array<{ materialId: string; thicknessMm: string }>) {
  return evaluateScenario({
    airborneContext: FIELD_CONTEXT,
    calculator: "dynamic",
    id,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
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

describe("getDynamicCalcBranchSummary", () => {
  it("surfaces the published family topology for the guided heavy floor sample", () => {
    const scenario = evaluatePreset("heavy_concrete_impact_floor");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Heavy floating floor");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Published family estimate is active through Published family blend · reinforced concrete.");
    expect(summary.detail).toContain("Published heavy-concrete upper-treatment estimate");
  });

  it("surfaces exact floor-family mode when a curated exact preset lands", () => {
    const scenario = evaluatePreset("dataholz_clt_dry_exact");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Exact floor family");
    expect(summary.tone).toBe("ready");
    expect(summary.detail).toContain("Dataholz GDMTXN01 | CLT floor | dry screed | no lining");
    expect(summary.detail).toContain("Dry floating floor topology");
  });

  it("keeps the steel suspended sample on the upstream low-confidence lane", () => {
    const scenario = evaluatePreset("steel_suspended_fallback");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Suspended ceiling only");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Low-confidence fallback · lightweight steel is active.");
    expect(summary.detail).toContain("Final published-family fallback");
  });

  it("keeps support-form-unspecified lightweight steel bounds explicit as crossover support", () => {
    const scenario = evaluatePreset("ubiq_steel_300_unspecified_bound");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Combined upper and lower system");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Bound family estimate is active through");
    expect(summary.detail).toContain("support form is still open");
    expect(summary.detail).toContain("open-web / rolled steel");
  });

  it("surfaces timber bare-floor low-confidence fallback as a broad lane that still needs a ceiling package", () => {
    const scenario = evaluatePreset("timber_bare_impact_only_fallback");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(summary.value).toBe("Bare floor");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Low-confidence fallback · timber frame / joist is active.");
    expect(summary.detail).toContain("same low-confidence lane");
    expect(summary.detail).toContain("ceiling package");
    expect(summary.detail).toContain("narrower Knauf corridor");
  });

  it("keeps reinforced-concrete combined low-confidence summaries explicit about mixed-row proxy airborne companions", () => {
    const summary = getDynamicCalcBranchSummary({
      result: buildReinforcedConcreteLowConfidenceResult(),
      studyMode: "floor"
    });

    expect(summary.value).toBe("Combined upper and lower system");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Low-confidence fallback · reinforced concrete is active.");
    expect(summary.detail).toContain("mixed nearby-row concrete lane");
    expect(summary.detail).toContain("proxy airborne companions");
  });

  it("keeps the preset-only Dataholz integrated dry CLT row on the published combined-family summary instead of surfacing exact floor family wording", () => {
    const scenario = evaluateFloorRows("gdmtxa04a-boundary", [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "12.5" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "50" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: "60" },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "65" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "160" }
    ]);

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "floor"
    });

    expect(scenario.result?.floorSystemMatch).toBeNull();
    expect(summary.value).toBe("Combined upper and lower system");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toContain("Published family estimate is active through Published family blend · mass-timber CLT.");
    expect(summary.detail).toContain("predictor mass timber clt dataholz dry estimate");
  });

  it("keeps wall screening explicit when no dynamic airborne family has locked yet", () => {
    const scenario = evaluatePreset("concrete_wall");

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(summary.value).toBe("Screening seed");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("seed cavity-screening path");
  });

  it("surfaces ambiguous wall family boundaries as protected corridor holds in the primary route summary", () => {
    const scenario = evaluateWallRows("aac-boundary-summary", [
      { materialId: "ytong_aac_d700", thicknessMm: "100" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ]);

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(scenario.result?.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(scenario.result?.dynamicAirborneTrace?.familyDecisionSelectedBelowRunnerUp).toBe(true);
    expect(summary.value).toBe("Lined Massive Wall");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Mass Law anchor is active with lined massive blend+reinforcement monotonic floor+family boundary hold.");
    expect(summary.detail).toContain("ambiguous boundary with Double Leaf");
    expect(summary.detail).toContain("protected corridor hold");
  });

  it("surfaces narrow wall family boundaries as held but not settled corridors in the primary route summary", () => {
    const scenario = evaluateWallRows("aac-narrow-summary", [
      { materialId: "ytong_aac_d700", thicknessMm: "120" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "diamond_board", thicknessMm: "12.5" }
    ]);

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(scenario.result?.dynamicAirborneTrace?.familyDecisionClass).toBe("narrow");
    expect(scenario.result?.dynamicAirborneTrace?.familyDecisionSelectedBelowRunnerUp).toBeUndefined();
    expect(summary.value).toBe("Lined Massive Wall");
    expect(summary.tone).toBe("warning");
    expect(summary.detail).toContain("Mass Law anchor is active with lined massive blend+reinforcement monotonic floor+family boundary hold.");
    expect(summary.detail).toContain("narrow boundary with Double Leaf");
    expect(summary.detail).toContain("conservative family-boundary hold is active");
    expect(summary.detail).not.toContain("protected corridor hold");
  });

  it("keeps settled wall family summaries compact when no boundary signal is active", () => {
    const scenario = evaluateWallRows("aac-clear-summary", [
      { materialId: "ytong_aac_d700", thicknessMm: "160" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ]);

    const summary = getDynamicCalcBranchSummary({
      result: scenario.result,
      studyMode: "wall"
    });

    expect(scenario.result?.dynamicAirborneTrace?.familyDecisionClass).toBeUndefined();
    expect(summary.value).toBe("Lined Massive Wall");
    expect(summary.tone).toBe("neutral");
    expect(summary.detail).toBe("Mass Law anchor is active with lined massive blend.");
    expect(summary.detail).not.toContain("boundary");
    expect(summary.detail).not.toContain("hold");
  });
});
