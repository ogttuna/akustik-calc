import { describe, expect, it } from "vitest";

import { normalizeRows } from "./normalize-rows";

describe("normalizeRows", () => {
  it("collapses adjacent live rows with the same material and floor role into one solver layer", () => {
    const normalized = normalizeRows([
      { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "60" },
      { floorRole: "floating_screed", id: "c", materialId: "screed", thicknessMm: "40" },
      { floorRole: "resilient_layer", id: "d", materialId: "generic_resilient_underlay", thicknessMm: "8" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.layers).toEqual([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 100 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 }
    ]);
  });

  it("does not collapse adjacent rows when the physical role changes", () => {
    const normalized = normalizeRows([
      { floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: "120" },
      { floorRole: "floating_screed", id: "b", materialId: "concrete", thicknessMm: "40" }
    ]);

    expect(normalized.layers).toEqual([
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 120 },
      { floorRole: "floating_screed", materialId: "concrete", thicknessMm: 40 }
    ]);
  });

  it("keeps repeated board plies explicit for exact-family style stacks", () => {
    const normalized = normalizeRows([
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: "16" },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: "145" }
    ]);

    expect(normalized.layers).toEqual([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 }
    ]);
  });

  it("collapses matching live rows even when a parked blank row sat between them in the editor", () => {
    const normalized = normalizeRows([
      { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "60" },
      { floorRole: "upper_fill", id: "gap", materialId: "generic_fill", thicknessMm: "" },
      { floorRole: "floating_screed", id: "c", materialId: "screed", thicknessMm: "40" },
      { floorRole: "resilient_layer", id: "d", materialId: "generic_resilient_underlay", thicknessMm: "8" }
    ]);

    expect(normalized.warnings).toContain("Layer 3 is missing a valid thickness.");
    expect(normalized.layers).toEqual([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 100 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 }
    ]);
  });
});
