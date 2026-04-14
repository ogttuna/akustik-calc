import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const UBIQ_CARPET_BOUND_ID = "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026";
const UBIQ_CARPET_BOUND_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
];
const UBIQ_CARPET_STACK = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
] as const;

const UBIQ_OFFICIAL_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

describe("combined Ln,w+CI bound surface", () => {
  it("imports UBIQ supported-band carpet rows as bound-only combined impact data", () => {
    const carpetExactRows = EXACT_FLOOR_SYSTEMS.filter(
      (system) => /^ubiq_fl(?:24|26|28)_open_web_steel_/u.test(system.id) && system.id.includes("carpet")
    );
    const carpetBoundRows = BOUND_FLOOR_SYSTEMS.filter((system) =>
      /^ubiq_fl(?:24|26|28)_open_web_steel_.*_carpet_lnw_plus_ci_bound_lab_2026$/u.test(system.id)
    );

    expect(carpetExactRows).toHaveLength(0);
    expect(carpetBoundRows).toHaveLength(18);
    expect(new Set(carpetBoundRows.map((system) => system.impactBounds.LnWPlusCIUpperBound))).toEqual(new Set([45]));
    expect(new Set(carpetBoundRows.map((system) => system.impactBounds.LnWUpperBound))).toEqual(new Set([undefined]));
    expect(new Set(carpetBoundRows.map((system) => system.sourceUrl ?? ""))).toEqual(
      new Set([UBIQ_OFFICIAL_SYSTEM_TABLE_URL])
    );
  });

  it("supports Ln,w+CI from a combined bound without exposing split Ln,w or CI", () => {
    const result = calculateAssembly(UBIQ_CARPET_STACK, {
      targetOutputs: UBIQ_CARPET_BOUND_OUTPUTS
    });

    expect(result.floorSystemMatch).toBeNull();
    expect(result.boundFloorSystemMatch?.system.id).toBe(UBIQ_CARPET_BOUND_ID);
    expect(result.impact).toBeNull();
    expect(result.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(result.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(result.lowerBoundImpact?.LnWUpperBound).toBeUndefined();
    expect(result.lowerBoundImpact?.notes.join(" ")).toContain("Ln,w+CI stays at or below 45 dB");
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "L'n,w", "L'nT,w"]);
  });

  it("does not derive field-side upper bounds from a combined Ln,w+CI-only source", () => {
    const result = calculateAssembly(UBIQ_CARPET_STACK, {
      impactFieldContext: {
        fieldKDb: 2,
        receivingRoomVolumeM3: 50
      },
      targetOutputs: UBIQ_CARPET_BOUND_OUTPUTS
    });

    expect(result.boundFloorSystemMatch?.system.id).toBe(UBIQ_CARPET_BOUND_ID);
    expect(result.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(result.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(result.lowerBoundImpact?.LPrimeNWUpperBound).toBeUndefined();
    expect(result.lowerBoundImpact?.LPrimeNTwUpperBound).toBeUndefined();
    expect(result.supportedTargetOutputs).toEqual(["Rw", "Ln,w+CI"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Ln,w", "CI", "L'n,w", "L'nT,w"]);
  });
});
