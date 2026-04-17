import { describe, expect, it } from "vitest";

import {
  describeImpactValidationPosture,
  describeAirborneValidationPosture,
  formatValidationFamilyBenchmarkMix,
  getAirborneBoundaryPosture,
  getValidationCoverageSnapshotRows,
  getValidationHardeningTasks,
  getValidationFamilyModeRows,
  IMPACT_VALIDATION_FAMILY_MATRIX
} from "./validation-regime";
import { evaluateScenario } from "./scenario-analysis";
import type { AssemblyCalculation } from "@dynecho/shared";

const FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
} as const;

function evaluateWall(id: string, rows: Array<{ materialId: string; thicknessMm: string }>) {
  return evaluateScenario({
    airborneContext: FIELD_CONTEXT,
    calculator: "dynamic",
    id,
    name: id,
    rows: rows.map((row, index) => ({ ...row, id: `${id}-${index + 1}` })),
    source: "current",
    studyMode: "wall",
    targetOutputs: ["R'w", "DnT,w"]
  });
}

function buildReinforcedConcreteLowConfidenceResult(): AssemblyCalculation {
  return {
    dynamicImpactTrace: {
      detectedSupportFamily: "reinforced_concrete",
      estimateTier: "low_confidence",
      estimateTierLabel: "Low-confidence fallback · reinforced concrete",
      fitPercent: 29,
      systemType: "combined_upper_lower_system"
    } as AssemblyCalculation["dynamicImpactTrace"],
    floorSystemEstimate: {
      fitPercent: 29,
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

describe("validation regime helpers", () => {
  it("formats the active family benchmark mix with posture totals", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "reinforced_concrete");

    expect(family).toBeTruthy();
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("4 exact · 3 estimate · 1 low confidence · 1 bound · 3 field");
  });

  it("surfaces family mode rows with benchmark counts for bound-heavy families", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "lightweight_steel");

    expect(family).toBeTruthy();

    const rows = getValidationFamilyModeRows(family!);

    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("8 exact · 4 estimate · 1 low confidence · 3 bound");
    expect(rows.find((row) => row.id === "official_floor_system_bound")?.caseCount).toBe(2);
    expect(rows.find((row) => row.id === "family_specific_bound_estimate")?.caseCount).toBe(1);
    expect(rows.find((row) => row.id === "family_general_estimate")?.caseCount).toBe(2);
    expect(rows.find((row) => row.id === "low_confidence_estimate")?.caseCount).toBe(1);
    expect(rows.find((row) => row.id === "official_floor_system")?.label).toMatch(/official floor-system exact/i);
  });

  it("keeps the timber-frame mix aligned with the published dry-family estimate ladder", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "timber_frame");

    expect(family).toBeTruthy();
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("13 exact · 4 estimate · 2 low confidence");
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_archetype_estimate")?.caseCount).toBe(2);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_general_estimate")?.caseCount).toBe(2);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "low_confidence_estimate")?.caseCount).toBe(2);
  });

  it("tracks the broader dry CLT blend separately from the family-specific CLT lanes", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "mass_timber_clt");

    expect(family).toBeTruthy();
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe(
      "3 exact · 5 estimate · 1 low confidence · 5 field · 1 unsupported"
    );
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_specific_estimate")?.caseCount).toBe(4);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "low_confidence_estimate")?.caseCount).toBe(1);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "unsupported_gap")?.caseCount).toBe(1);
  });

  it("keeps the open-box timber mix aligned with both TUAS archetype ladders", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "open_box_timber");

    expect(family).toBeTruthy();
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("2 estimate · 2 field");
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_archetype_estimate")?.caseCount).toBe(2);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "field_standardized_volume_estimate")?.caseCount).toBe(2);
  });

  it("builds a coverage snapshot row that flags the remaining timber fallback while releasing composite from staged field-only status", () => {
    const rows = getValidationCoverageSnapshotRows();
    const timberRow = rows.find((row) => row.id === "timber_frame");
    const compositeRow = rows.find((row) => row.id === "composite_panel");

    expect(timberRow).toBeTruthy();
    expect(timberRow?.focusLabel).toBe("Remaining low-confidence lane");
    expect(timberRow?.benchmarkMix).toBe("13 exact · 4 estimate · 2 low confidence");

    expect(compositeRow).toBeTruthy();
    expect(compositeRow?.focusLabel).toBe("Remaining low-confidence lane");
  });

  it("derives next hardening tasks directly from the current family matrix", () => {
    const tasks = getValidationHardeningTasks();

    expect(tasks.find((task) => task.id === "retire-low-confidence")?.familyLabels).toContain("timber frame / joist families");
    expect(tasks.find((task) => task.id === "close-unsupported-gaps")?.familyLabels).toContain("mass timber CLT");
    expect(tasks.find((task) => task.id === "expand-field-continuation")).toBeUndefined();
    expect(tasks.find((task) => task.id === "replace-bound-corridors")?.familyLabels).toContain(
      "lightweight steel / open-web joists"
    );
  });

  it("surfaces protected corridor holds on the defended ambiguous wall boundary", () => {
    const scenario = evaluateWall("validation-aac-boundary", [
      { materialId: "ytong_aac_d700", thicknessMm: "100" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ]);
    const trace = scenario.result?.dynamicAirborneTrace;

    const boundaryPosture = getAirborneBoundaryPosture(trace);
    const validationPosture = describeAirborneValidationPosture(scenario.result);

    expect(boundaryPosture?.label).toBe("Ambiguous boundary with Double Leaf · protected corridor hold");
    expect(boundaryPosture?.detail).toContain("ambiguous boundary with Double Leaf");
    expect(boundaryPosture?.detail).toContain("protected corridor hold");
    expect(validationPosture.detail).toContain("ambiguous boundary with Double Leaf");
    expect(validationPosture.detail).toContain("protected corridor hold");
  });

  it("keeps settled wall selectors free of boundary posture when the corridor is clear", () => {
    const scenario = evaluateWall("validation-aac-clear", [
      { materialId: "ytong_aac_d700", thicknessMm: "160" },
      { materialId: "air_gap", thicknessMm: "50" },
      { materialId: "gypsum_board", thicknessMm: "12.5" }
    ]);
    const trace = scenario.result?.dynamicAirborneTrace;

    expect(getAirborneBoundaryPosture(trace)).toBeNull();
    expect(describeAirborneValidationPosture(scenario.result).detail).not.toContain("boundary");
    expect(describeAirborneValidationPosture(scenario.result).detail).not.toContain("hold");
  });

  it("keeps reinforced-concrete low-confidence impact posture explicit as a 29% mixed-row fallback", () => {
    const posture = describeImpactValidationPosture(buildReinforcedConcreteLowConfidenceResult());

    expect(posture.posture).toBe("low_confidence");
    expect(posture.label).toBe("Low-confidence fallback · reinforced concrete");
    expect(posture.detail).toContain("reinforced-concrete mixed-row fallback");
    expect(posture.detail).toContain("29% fit inside the active low-confidence ceiling");
    expect(posture.detail).toContain("mixed nearby-row concrete lane");
  });
});
