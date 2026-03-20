import { describe, expect, it } from "vitest";

import {
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
});
