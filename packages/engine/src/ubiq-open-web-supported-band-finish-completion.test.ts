import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const SUPPORTED_BAND_ID_PATTERN = /^ubiq_fl(?:24|26|28)_open_web_steel_/u;

function supportedRows() {
  return EXACT_FLOOR_SYSTEMS.filter((system) => SUPPORTED_BAND_ID_PATTERN.test(system.id));
}

function requireExactRow(id: string) {
  const row = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

  if (!row) {
    throw new Error(`Missing UBIQ supported-band exact row: ${id}`);
  }

  return row;
}

describe("UBIQ open-web supported resilient-band finish completion", () => {
  it("imports official bare/timber exact rows and keeps the carpet <=45 lane as combined bound data", () => {
    const rows = supportedRows();
    const bareRows = rows.filter((system) => system.id.includes("_bare_"));
    const timberRows = rows.filter((system) => !system.id.includes("_bare_"));
    const carpetExactRows = rows.filter((system) => system.id.includes("carpet"));
    const carpetBoundRows = BOUND_FLOOR_SYSTEMS.filter(
      (system) => SUPPORTED_BAND_ID_PATTERN.test(system.id) && system.label.toLowerCase().includes("carpet")
    );

    expect(rows).toHaveLength(36);
    expect(bareRows).toHaveLength(18);
    expect(timberRows).toHaveLength(18);
    expect(carpetExactRows).toHaveLength(0);
    expect(carpetBoundRows).toHaveLength(18);
    expect(new Set(carpetBoundRows.map((system) => system.impactBounds.LnWPlusCIUpperBound))).toEqual(new Set([45]));
    expect(new Set(carpetBoundRows.map((system) => system.impactBounds.LnWUpperBound))).toEqual(new Set([undefined]));
    expect(new Set(rows.map((system) => system.sourceLabel))).toEqual(new Set(["UBIQ official system table PDF"]));
    expect(new Set(rows.map((system) => system.airborneRatings.RwCtrSemantic))).toEqual(new Set(["rw_plus_ctr"]));
    expect(new Set(bareRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));
    expect(new Set(rows.filter((system) => system.id.startsWith("ubiq_fl24_")).map((system) => system.familyEstimateEligible))).toEqual(
      new Set([false])
    );
  });

  it("keeps representative bare INEX supported-band values pinned to the official table", () => {
    const fl24Bare = requireExactRow("ubiq_fl24_open_web_steel_300_19mm_bare_exact_lab_2026");
    const fl26Bare = requireExactRow("ubiq_fl26_open_web_steel_200_16mm_bare_exact_lab_2026");
    const fl28Bare = requireExactRow("ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026");

    expect(fl24Bare.impactRatings).toMatchObject({ LnW: 62, CI: -2, LnWPlusCI: 60 });
    expect(fl24Bare.airborneRatings).toMatchObject({ Rw: 61, RwCtr: 55, RwCtrSemantic: "rw_plus_ctr" });
    expect(fl26Bare.impactRatings).toMatchObject({ LnW: 62, CI: -1, LnWPlusCI: 61 });
    expect(fl26Bare.airborneRatings).toMatchObject({ Rw: 60, RwCtr: 53, RwCtrSemantic: "rw_plus_ctr" });
    expect(fl28Bare.impactRatings).toMatchObject({ LnW: 58, CI: -2, LnWPlusCI: 56 });
    expect(fl28Bare.airborneRatings).toMatchObject({ Rw: 64, RwCtr: 59, RwCtrSemantic: "rw_plus_ctr" });
  });

  it("matches a bare supported-band stack exactly and routes a carpet stack to the combined bound lane", () => {
    const bareResult = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 400 }
    ]);
    const carpetResult = calculateAssembly([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: 12 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ]);

    expect(bareResult.floorSystemMatch?.system.id).toBe("ubiq_fl28_open_web_steel_400_19mm_bare_exact_lab_2026");
    expect(bareResult.floorSystemMatch?.impact.LnW).toBe(58);
    expect(bareResult.floorSystemMatch?.impact.LnWPlusCI).toBe(56);
    expect(bareResult.floorSystemMatch?.system.airborneRatings.Rw).toBe(64);
    expect(carpetResult.floorSystemMatch).toBeNull();
    expect(carpetResult.boundFloorSystemMatch?.system.id).toBe(
      "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026"
    );
    expect(carpetResult.impact).toBeNull();
    expect(carpetResult.lowerBoundImpact?.basis).toBe("official_floor_system_bound_support");
    expect(carpetResult.lowerBoundImpact?.LnWPlusCIUpperBound).toBe(45);
    expect(carpetResult.lowerBoundImpact?.LnWUpperBound).toBeUndefined();
    expect(carpetResult.lowerBoundImpact?.LPrimeNWUpperBound).toBeUndefined();
    expect(carpetResult.boundFloorSystemMatch?.system.airborneRatings).toMatchObject({
      Rw: 64,
      RwCtr: 59,
      RwCtrSemantic: "rw_plus_ctr"
    });
  });
});
