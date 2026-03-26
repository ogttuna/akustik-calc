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

  it("warns when ceiling-side support is present without any ceiling board to activate it", () => {
    const warnings = collectScenarioInputWarnings({
      materials: [
        {
          category: "finish",
          densityKgM3: 2000,
          id: "ceramic_tile",
          name: "Ceramic Tile",
          tags: ["floor-finish"]
        },
        {
          category: "mass",
          densityKgM3: 2000,
          id: "screed",
          name: "Mineral Screed",
          tags: ["screed"]
        },
        {
          category: "support",
          densityKgM3: 0,
          id: "acoustic_mount_clip",
          name: "Acoustic Mount Clip",
          tags: ["support", "ceiling-support", "clip"]
        },
        {
          category: "mass",
          densityKgM3: 2400,
          id: "concrete",
          name: "Concrete",
          tags: ["structural"]
        }
      ],
      normalizedLayers: [
        { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
        { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
        { floorRole: "ceiling_cavity", materialId: "acoustic_mount_clip", thicknessMm: 20 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
      ],
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: "ceramic_tile", thicknessMm: "8" },
        { floorRole: "floating_screed", id: "b", materialId: "screed", thicknessMm: "50" },
        { floorRole: "ceiling_cavity", id: "c", materialId: "acoustic_mount_clip", thicknessMm: "20" },
        { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: "150" }
      ],
      studyMode: "floor",
      targetOutputs: []
    });

    expect(warnings).toContain(
      "Ceiling-side support or fill layers are present without any ceiling board. DynEcho keeps the lower-treatment lane inactive, so these products may not change the result until at least one ceiling board is added."
    );
  });

  it("warns when plaster-like wall finishes are assigned to the floor covering role", () => {
    const warnings = collectScenarioInputWarnings({
      materials: [
        {
          category: "finish",
          densityKgM3: 1700,
          id: "cement_plaster",
          name: "Cement Plaster",
          tags: ["plaster", "render", "masonry-finish"]
        },
        {
          category: "mass",
          densityKgM3: 2400,
          id: "concrete",
          name: "Concrete",
          tags: ["structural"]
        }
      ],
      normalizedLayers: [
        { floorRole: "floor_covering", materialId: "cement_plaster", thicknessMm: 4 },
        { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
      ],
      rows: [
        { floorRole: "floor_covering", id: "a", materialId: "cement_plaster", thicknessMm: "4" },
        { floorRole: "base_structure", id: "b", materialId: "concrete", thicknessMm: "180" }
      ],
      studyMode: "floor",
      targetOutputs: []
    });

    expect(warnings).toContain(
      "Cement Plaster is tagged as a plaster or masonry finish but is currently assigned to the floor covering role. DynEcho will keep the run live, but this is not treated like a validated trafficable floor cover. Recheck the role assignment or switch to a tested floor build-up before trusting impact outputs."
    );
  });

  it("raises a screening-only warning when a plaster-like floor covering is used without any base structure", () => {
    const warnings = collectScenarioInputWarnings({
      materials: [
        {
          category: "finish",
          densityKgM3: 1700,
          id: "cement_plaster",
          name: "Cement Plaster",
          tags: ["plaster", "render", "masonry-finish"]
        }
      ],
      normalizedLayers: [{ floorRole: "floor_covering", materialId: "cement_plaster", thicknessMm: 4 }],
      rows: [{ floorRole: "floor_covering", id: "a", materialId: "cement_plaster", thicknessMm: "4" }],
      studyMode: "floor",
      targetOutputs: []
    });

    expect(warnings).toContain(
      "Cement Plaster is tagged as a plaster or masonry finish but is currently assigned to the floor covering role with no base structure in the stack. DynEcho will keep the run live as a broad screening estimate only; add the structural floor or switch to a tested floor-cover path before trusting impact outputs."
    );
  });
});
