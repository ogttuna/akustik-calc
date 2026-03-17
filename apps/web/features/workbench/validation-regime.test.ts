import { describe, expect, it } from "vitest";

import {
  formatValidationFamilyBenchmarkMix,
  getValidationFamilyModeRows,
  IMPACT_VALIDATION_FAMILY_MATRIX
} from "./validation-regime";

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

    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("7 exact · 4 estimate · 2 low confidence · 3 bound");
    expect(rows.find((row) => row.id === "official_floor_system_bound")?.caseCount).toBe(2);
    expect(rows.find((row) => row.id === "family_specific_bound_estimate")?.caseCount).toBe(1);
    expect(rows.find((row) => row.id === "low_confidence_estimate")?.caseCount).toBe(2);
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
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("3 exact · 7 estimate · 5 field");
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_specific_estimate")?.caseCount).toBe(5);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_general_estimate")?.caseCount).toBe(1);
  });

  it("keeps the open-box timber mix aligned with both TUAS archetype ladders", () => {
    const family = IMPACT_VALIDATION_FAMILY_MATRIX.find((entry) => entry.id === "open_box_timber");

    expect(family).toBeTruthy();
    expect(formatValidationFamilyBenchmarkMix(family!)).toBe("2 estimate · 2 field");
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "family_archetype_estimate")?.caseCount).toBe(2);
    expect(getValidationFamilyModeRows(family!).find((row) => row.id === "field_standardized_volume_estimate")?.caseCount).toBe(2);
  });
});
