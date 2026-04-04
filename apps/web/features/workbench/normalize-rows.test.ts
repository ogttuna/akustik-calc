import { describe, expect, it } from "vitest";

import { normalizeRows } from "./normalize-rows";
import { buildCustomMaterialDefinition, createEmptyCustomMaterialDraft } from "./workbench-materials";

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

  it("rebuilds simple topside floor packages into deterministic solver order before coalescing", () => {
    const normalized = normalizeRows([
      { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "floating_screed", id: "c1", materialId: "screed", thicknessMm: "25" },
      { floorRole: "floating_screed", id: "c2", materialId: "screed", thicknessMm: "25" },
      { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.layers).toEqual([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);
  });

  it("collapses adjacent rows that share the same effective dynamic stiffness override", () => {
    const normalized = normalizeRows([
      { floorRole: "resilient_layer", id: "a", materialId: "generic_resilient_underlay", thicknessMm: "4", dynamicStiffnessMNm3: "35" },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "4", dynamicStiffnessMNm3: "35" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.runtimeMaterials).toHaveLength(1);
    expect(normalized.layers).toEqual([
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay__dyn_35", thicknessMm: 8 }
    ]);
  });

  it("builds a runtime override material when a listed dynamic stiffness value is changed manually", () => {
    const normalized = normalizeRows([
      { floorRole: "resilient_layer", id: "a", materialId: "mw_t_impact_layer_s40", thicknessMm: "30", dynamicStiffnessMNm3: "20" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.runtimeMaterials).toHaveLength(1);
    expect(normalized.runtimeMaterials[0]?.impact?.dynamicStiffnessMNm3).toBe(20);
    expect(normalized.layers).toEqual([{ floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40__dyn_20", thicknessMm: 30 }]);
  });

  it("builds a runtime override material when a listed density value is changed manually", () => {
    const normalized = normalizeRows([
      { floorRole: "floating_screed", id: "a", materialId: "screed", thicknessMm: "50", densityKgM3: "1400" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.runtimeMaterials).toHaveLength(1);
    expect(normalized.runtimeMaterials[0]?.densityKgM3).toBe(1400);
    expect(normalized.layers).toEqual([{ floorRole: "floating_screed", materialId: "screed__rho_1400", thicknessMm: 50 }]);
  });

  it("collapses adjacent rows that share the same effective density override", () => {
    const normalized = normalizeRows([
      { floorRole: "floating_screed", id: "a", materialId: "screed", thicknessMm: "40", densityKgM3: "1800" },
      { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "60", densityKgM3: "1800" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.runtimeMaterials).toHaveLength(1);
    expect(normalized.runtimeMaterials[0]?.densityKgM3).toBe(1800);
    expect(normalized.layers).toEqual([{ floorRole: "floating_screed", materialId: "screed__rho_1800", thicknessMm: 100 }]);
  });

  it("warns and falls back to the catalog material when the dynamic stiffness override is invalid", () => {
    const normalized = normalizeRows([
      { floorRole: "resilient_layer", id: "a", materialId: "generic_resilient_underlay", thicknessMm: "8", dynamicStiffnessMNm3: "abc" }
    ]);

    expect(normalized.warnings).toContain(
      "Layer 1 has an invalid dynamic stiffness override. Enter a positive MN/m³ value or leave it blank."
    );
    expect(normalized.runtimeMaterials).toEqual([]);
    expect(normalized.layers).toEqual([
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 }
    ]);
  });

  it("warns and falls back to the catalog material when the density override is invalid", () => {
    const normalized = normalizeRows([
      { floorRole: "floating_screed", id: "a", materialId: "screed", thicknessMm: "50", densityKgM3: "0" }
    ]);

    expect(normalized.warnings).toContain(
      "Layer 1 has an invalid density override. Enter a non-negative kg/m³ value, use zero only for gap or support layers, or leave it blank."
    );
    expect(normalized.runtimeMaterials).toEqual([]);
    expect(normalized.layers).toEqual([{ floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }]);
  });

  it("accepts comma-decimal thickness instead of dropping an otherwise valid live row", () => {
    const normalized = normalizeRows([
      { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8,0" },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure", id: "c", materialId: "concrete", thicknessMm: "150" }
    ]);

    expect(normalized.warnings).toEqual([]);
    expect(normalized.layers).toEqual([
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);
  });

  it("drops zero-thickness rows instead of inventing a malformed solver layer", () => {
    const normalized = normalizeRows([
      { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "0" },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure", id: "c", materialId: "concrete", thicknessMm: "150" }
    ]);

    expect(normalized.warnings).toContain("Layer 1 is missing a valid thickness.");
    expect(normalized.layers).toEqual([
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ]);
  });

  it("resolves custom materials and still builds runtime override materials for them", () => {
    const customMaterial = buildCustomMaterialDefinition({
      draft: {
        ...createEmptyCustomMaterialDraft(),
        category: "support",
        densityKgM3: "680",
        dynamicStiffnessMNm3: "18",
        name: "Custom resilient mat"
      },
      existingMaterials: []
    });

    const normalized = normalizeRows(
      [
        {
          dynamicStiffnessMNm3: "35",
          floorRole: "resilient_layer",
          id: "a",
          materialId: customMaterial.id,
          thicknessMm: "6"
        }
      ],
      [customMaterial]
    );

    expect(normalized.warnings).toEqual([]);
    expect(normalized.runtimeMaterials).toHaveLength(1);
    expect(normalized.runtimeMaterials[0]?.impact?.dynamicStiffnessMNm3).toBe(35);
    expect(normalized.layers).toEqual([
      { floorRole: "resilient_layer", materialId: `${customMaterial.id}__dyn_35`, thicknessMm: 6 }
    ]);
  });
});
