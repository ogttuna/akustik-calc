import { describe, expect, it } from "vitest";

import { prependRecommendedMaterialGroup } from "./material-picker-recommendations";
import { buildWorkbenchMaterialCatalog } from "./workbench-materials";

const TEST_MATERIAL_IDS = [
  "generic_resilient_underlay",
  "getzner_afm_33",
  "regupol_sonus_curve_8",
  "acoustic_mount_clip",
  "genieclip_rst",
  "furring_channel",
  "concrete",
  "screed",
  "ceramic_tile"
] as const;

const TEST_MATERIALS = buildWorkbenchMaterialCatalog([]).filter((material) =>
  TEST_MATERIAL_IDS.includes(material.id as (typeof TEST_MATERIAL_IDS)[number])
);

describe("material picker recommendations", () => {
  it("prepends resilient-layer recommendations for resilient rows", () => {
    const groups = prependRecommendedMaterialGroup({
      floorRole: "resilient_layer",
      groups: [{ label: "All materials", materials: TEST_MATERIALS }],
      materials: TEST_MATERIALS,
      selectedMaterialId: "getzner_afm_33",
      studyMode: "floor"
    });

    expect(groups[0]?.label).toBe("Recommended for Resilient layer");
    expect(groups[0]?.materials.map((material) => material.id)).toEqual([
      "generic_resilient_underlay",
      "regupol_sonus_curve_8",
      "getzner_afm_33"
    ]);
    expect(groups[1]?.materials.some((material) => material.id === "getzner_afm_33")).toBe(false);
  });

  it("prepends ceiling-side recommendations for ceiling cavity rows", () => {
    const groups = prependRecommendedMaterialGroup({
      floorRole: "ceiling_cavity",
      groups: [{ label: "All materials", materials: TEST_MATERIALS }],
      materials: TEST_MATERIALS,
      selectedMaterialId: "acoustic_mount_clip",
      studyMode: "floor"
    });

    expect(groups[0]?.label).toBe("Recommended for Ceiling cavity");
    expect(groups[0]?.materials.map((material) => material.id)).toEqual([
      "acoustic_mount_clip",
      "genieclip_rst",
      "furring_channel"
    ]);
    expect(groups[1]?.materials.some((material) => material.id === "acoustic_mount_clip")).toBe(false);
  });

  it("keeps wall-mode groups unchanged", () => {
    const groups = prependRecommendedMaterialGroup({
      floorRole: "resilient_layer",
      groups: [{ label: "All materials", materials: TEST_MATERIALS }],
      materials: TEST_MATERIALS,
      selectedMaterialId: "getzner_afm_33",
      studyMode: "wall"
    });

    expect(groups).toEqual([{ label: "All materials", materials: TEST_MATERIALS }]);
  });
});
