import { describe, expect, it } from "vitest";

import {
  collectScenarioInputWarnings,
  getLayerThicknessGuidanceHint,
  getLayerThicknessSanityWarning
} from "./input-sanity";

describe("input sanity", () => {
  it("shows material-aware thickness guidance for known layers", () => {
    expect(
      getLayerThicknessGuidanceHint({
        floorRole: "floating_screed",
        materialId: "screed"
      })
    ).toBe("Typical band 25 to 90 mm for Mineral Screed in the floating screed role.");
  });

  it("falls back to floor-role guidance when the material is unknown", () => {
    expect(
      getLayerThicknessGuidanceHint({
        floorRole: "resilient_layer",
        materialId: "unknown_material"
      })
    ).toBe("Typical band 2 to 40 mm for resilient layer rows.");
  });

  it("warns against out-of-band material thicknesses with role-aware copy", () => {
    expect(
      getLayerThicknessSanityWarning(
        {
          floorRole: "base_structure",
          materialId: "concrete",
          thicknessMm: "20"
        },
        3
      )
    ).toBe(
      "Layer 3 thickness 20 mm is outside the guided sanity band of 80 to 250 mm for Concrete in the base structure role. Check units, role assignment, or split the build-up into separate layers if needed."
    );
  });

  it("uses normalized layer packages for thickness warnings so split screed rows do not spam false warnings", () => {
    const warnings = collectScenarioInputWarnings({
      materials: [
        {
          category: "mass",
          densityKgM3: 2000,
          id: "screed",
          name: "Mineral Screed",
          tags: ["screed"]
        }
      ],
      normalizedLayers: [{ floorRole: "floating_screed", materialId: "screed", thicknessMm: 80 }],
      rows: Array.from({ length: 10 }, (_, index) => ({
        floorRole: "floating_screed" as const,
        id: `s-${index + 1}`,
        materialId: "screed",
        thicknessMm: "8"
      })),
      studyMode: "floor",
      targetOutputs: []
    });

    expect(warnings).toEqual([]);
  });

  it("emits a single grouped thickness warning when a split live package lands out of band", () => {
    const warnings = collectScenarioInputWarnings({
      materials: [
        {
          category: "mass",
          densityKgM3: 2000,
          id: "screed",
          name: "Mineral Screed",
          tags: ["screed"]
        }
      ],
      normalizedLayers: [{ floorRole: "floating_screed", materialId: "screed", thicknessMm: 100 }],
      rows: Array.from({ length: 10 }, (_, index) => ({
        floorRole: "floating_screed" as const,
        id: `s-${index + 1}`,
        materialId: "screed",
        thicknessMm: "10"
      })),
      studyMode: "floor",
      targetOutputs: []
    });

    expect(warnings).toEqual([
      "Layer 1 thickness 100 mm is outside the guided sanity band of 25 to 90 mm for Mineral Screed in the floating screed role. Check units, role assignment, or split the build-up into separate layers if needed."
    ]);
  });
});
