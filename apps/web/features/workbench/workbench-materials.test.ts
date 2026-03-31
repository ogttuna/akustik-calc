import { describe, expect, it } from "vitest";

import {
  defaultThicknessForMaterialInRole,
  getWorkbenchMaterialById,
  resolveThicknessForMaterialChange
} from "./workbench-materials";

function requireMaterial(materialId: string) {
  const material = getWorkbenchMaterialById(materialId);

  if (!material) {
    throw new Error(`Missing material ${materialId}`);
  }

  return material;
}

describe("workbench material defaults", () => {
  it("clamps replace-base defaults into the guided structural band", () => {
    expect(defaultThicknessForMaterialInRole(requireMaterial("hollow_core_plank"), "base_structure")).toBe("120");
    expect(defaultThicknessForMaterialInRole(requireMaterial("steel_joist_floor"), "base_structure")).toBe("180");
    expect(defaultThicknessForMaterialInRole(requireMaterial("lightweight_steel_floor"), "base_structure")).toBe("160");
    expect(defaultThicknessForMaterialInRole(requireMaterial("composite_steel_deck"), "base_structure")).toBe("120");
    expect(defaultThicknessForMaterialInRole(requireMaterial("open_box_timber_slab"), "base_structure")).toBe("350");
  });

  it("keeps in-band structural defaults unchanged", () => {
    expect(defaultThicknessForMaterialInRole(requireMaterial("concrete"), "base_structure")).toBe("150");
    expect(defaultThicknessForMaterialInRole(requireMaterial("clt_panel"), "base_structure")).toBe("140");
    expect(defaultThicknessForMaterialInRole(requireMaterial("timber_joist_floor"), "base_structure")).toBe("240");
  });

  it("updates draft thickness when the current thickness still matches the previous material default", () => {
    expect(
      resolveThicknessForMaterialChange({
        currentThicknessMm: "4",
        nextFloorRole: "base_structure",
        nextMaterial: requireMaterial("steel_joist_floor"),
        previousDefaultThicknessMm: "4",
        previousFloorRole: "floor_covering",
        previousMaterial: requireMaterial("vinyl_flooring")
      })
    ).toBe("180");
  });

  it("preserves manual draft thickness overrides on material change", () => {
    expect(
      resolveThicknessForMaterialChange({
        currentThicknessMm: "210",
        nextFloorRole: "base_structure",
        nextMaterial: requireMaterial("steel_joist_floor"),
        previousFloorRole: "floor_covering",
        previousMaterial: requireMaterial("vinyl_flooring")
      })
    ).toBe("210");
  });
});
