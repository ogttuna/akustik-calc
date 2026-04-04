import { describe, expect, it } from "vitest";

import { buildWorkbenchMaterialCatalog } from "./workbench-materials";
import { buildSolverDisplayLayers } from "./simple-workbench-utils";

describe("simple workbench solver display layers", () => {
  const materials = buildWorkbenchMaterialCatalog([]);

  it("renders simple heavy-floor packages in deterministic solver order", () => {
    const layers = buildSolverDisplayLayers(
      [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "c", materialId: "screed", thicknessMm: "50" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      materials
    );

    expect(
      layers.map((layer) => ({
        floorRole: layer.floorRole,
        materialId: layer.material.id,
        sourceRowIds: layer.sourceRowIds,
        thicknessLabel: layer.thicknessLabel
      }))
    ).toEqual([
      {
        floorRole: "floor_covering",
        materialId: "ceramic_tile",
        sourceRowIds: ["a"],
        thicknessLabel: "8 mm"
      },
      {
        floorRole: "floating_screed",
        materialId: "screed",
        sourceRowIds: ["c"],
        thicknessLabel: "50 mm"
      },
      {
        floorRole: "resilient_layer",
        materialId: "generic_resilient_underlay",
        sourceRowIds: ["b"],
        thicknessLabel: "8 mm"
      },
      {
        floorRole: "base_structure",
        materialId: "concrete",
        sourceRowIds: ["d"],
        thicknessLabel: "150 mm"
      }
    ]);
  });

  it("keeps collapsed solver layers linked to every contributing live row", () => {
    const layers = buildSolverDisplayLayers(
      [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "c1", materialId: "screed", thicknessMm: "25" },
        { floorRole: "floating_screed", id: "c2", materialId: "screed", thicknessMm: "25" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      materials
    );

    expect(layers[1]).toMatchObject({
      floorRole: "floating_screed",
      sourceRowIds: ["c1", "c2"],
      thicknessLabel: "50 mm"
    });
  });
});
