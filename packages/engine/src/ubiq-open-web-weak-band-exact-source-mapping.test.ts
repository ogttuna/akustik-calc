import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const UBIQ_SYSTEM_TABLE_URL = "https://www.ubiq.au/wp-content/uploads/2023/02/INEX-FLOOR-FLOOR-FIRE-ACOUSTIC.pdf";

type WeakBandExactCase = {
  boardCount: 2 | 3;
  boardThicknessMm: 13 | 16;
  expectedId: string;
  expectedLnW: number;
  expectedLnWPlusCI: number;
  expectedRw: number;
  expectedRwCtr: number;
  finish: "bare" | "carpet" | "timber";
  inexFloorMm: 16 | 19;
  joistMm: 200 | 300 | 400;
};

const WEAK_BAND_CASES: readonly WeakBandExactCase[] = [
  {
    boardCount: 2,
    boardThicknessMm: 13,
    expectedId: "ubiq_fl23_open_web_steel_300_19mm_timber_underlay_exact_lab_2026",
    expectedLnW: 71,
    expectedLnWPlusCI: 70,
    expectedRw: 51,
    expectedRwCtr: 44,
    finish: "timber",
    inexFloorMm: 19,
    joistMm: 300
  },
  {
    boardCount: 2,
    boardThicknessMm: 16,
    expectedId: "ubiq_fl25_open_web_steel_400_19mm_timber_underlay_exact_lab_2026",
    expectedLnW: 71,
    expectedLnWPlusCI: 70,
    expectedRw: 53,
    expectedRwCtr: 46,
    finish: "timber",
    inexFloorMm: 19,
    joistMm: 400
  },
  {
    boardCount: 3,
    boardThicknessMm: 16,
    expectedId: "ubiq_fl27_open_web_steel_200_16mm_bare_exact_lab_2026",
    expectedLnW: 76,
    expectedLnWPlusCI: 77,
    expectedRw: 53,
    expectedRwCtr: 45,
    finish: "bare",
    inexFloorMm: 16,
    joistMm: 200
  },
  {
    boardCount: 3,
    boardThicknessMm: 16,
    expectedId: "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026",
    expectedLnW: 63,
    expectedLnWPlusCI: 62,
    expectedRw: 55,
    expectedRwCtr: 48,
    finish: "carpet",
    inexFloorMm: 19,
    joistMm: 400
  }
] as const;

function floorCoveringFor(finish: WeakBandExactCase["finish"]): LayerInput | null {
  switch (finish) {
    case "bare":
      return null;
    case "carpet":
      return {
        floorRole: "floor_covering",
        materialId: "carpet_with_foam_underlay",
        thicknessMm: 15
      };
    case "timber":
      return {
        floorRole: "floor_covering",
        materialId: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      };
  }
}

function buildWeakBandLayers(testCase: WeakBandExactCase): LayerInput[] {
  const floorCovering = floorCoveringFor(testCase.finish);

  return [
    ...(floorCovering ? [floorCovering] : []),
    {
      floorRole: "floating_screed",
      materialId: "inex_floor_panel",
      thicknessMm: testCase.inexFloorMm
    },
    {
      floorRole: "base_structure",
      materialId: "open_web_steel_floor",
      thicknessMm: testCase.joistMm
    },
    ...Array.from({ length: testCase.boardCount }, () => ({
      floorRole: "ceiling_board" as const,
      materialId: "firestop_board",
      thicknessMm: testCase.boardThicknessMm
    }))
  ];
}

describe("UBIQ open-web weak-band exact source mapping", () => {
  it("imports the complete FL-23/25/27 weak-band source table as exact-only correction rows", () => {
    const weakBandRows = EXACT_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id));

    expect(weakBandRows).toHaveLength(54);
    expect(BOUND_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id))).toEqual([]);
    expect(new Set(weakBandRows.map((system) => system.sourceUrl))).toEqual(new Set([UBIQ_SYSTEM_TABLE_URL]));
    expect(new Set(weakBandRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));
    expect(new Set(weakBandRows.map((system) => system.airborneRatings.RwCtrSemantic))).toEqual(new Set(["rw_plus_ctr"]));
  });

  it("lands representative weak-band stacks on their exact official rows and published ratings", () => {
    for (const testCase of WEAK_BAND_CASES) {
      const result = calculateAssembly(buildWeakBandLayers(testCase));

      expect(result.floorSystemMatch?.system.id).toBe(testCase.expectedId);
      expect(result.impact?.basis).toBe("official_floor_system_exact_match");
      expect(result.impact?.LnW).toBe(testCase.expectedLnW);
      expect(result.impact?.LnWPlusCI).toBe(testCase.expectedLnWPlusCI);
      expect(result.impact?.CI).toBe(testCase.expectedLnWPlusCI - testCase.expectedLnW);
      expect(result.floorSystemMatch?.system.airborneRatings.Rw).toBe(testCase.expectedRw);
      expect(result.floorSystemMatch?.system.airborneRatings.RwCtr).toBe(testCase.expectedRwCtr);
      expect(result.floorSystemMatch?.system.sourceUrl).toBe(UBIQ_SYSTEM_TABLE_URL);
    }
  });

  it("keeps weak-band correction rows out of nearby-family recommendations when the stack is not exact", () => {
    const result = calculateAssembly([
      {
        floorRole: "floor_covering",
        materialId: "engineered_timber_with_acoustic_underlay",
        thicknessMm: 20
      },
      {
        floorRole: "floating_screed",
        materialId: "inex_floor_panel",
        thicknessMm: 19
      },
      {
        floorRole: "base_structure",
        materialId: "open_web_steel_floor",
        thicknessMm: 250
      },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
    ]);

    expect(result.floorSystemMatch).toBeNull();
    expect(
      result.floorSystemRecommendations.map(
        (recommendation: { system: { id: string } }) => recommendation.system.id
      )
    ).not.toContainEqual(expect.stringMatching(/^ubiq_fl(?:23|25|27)_open_web_steel_/u));
  });
});
