import { MaterialDefinitionSchema } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  MATERIAL_CATALOG_SEED,
  MATERIAL_SOURCE_NOTE,
  materialCatalogById
} from "./seed-materials";

const PUBLIC_SOURCE_IDS = [
  "gyproc_wallboard_ten_12_5",
  "knauf_pro_hd_12_5",
  "knauf_pro_hd_15",
  "fermacell_gypsum_fibreboard_1150",
  "fiber_cement_board_1290",
  "osb_3_640",
  "rockwool_rwa45",
  "rockwool_rw3",
  "rockwool_rw4",
  "rockwool_rw5",
  "rockwool_rw6",
  "owens_corning_703",
  "owens_corning_705",
  "knauf_acoustic_roll_034",
  "basotect_melamine_foam",
  "eps_70_insulation_board",
  "eps_100_insulation_board",
  "eps_150_insulation_board",
  "xps_foam_board_40",
  "pir_board_30",
  "cork_underlay_184",
  "scanrubber_825_underlay"
] as const;

describe("material seed catalog", () => {
  it("keeps every seed material schema-valid and id-unique", () => {
    const ids = new Set<string>();

    for (const material of MATERIAL_CATALOG_SEED) {
      expect(MaterialDefinitionSchema.safeParse(material).success, material.id).toBe(true);
      expect(ids.has(material.id), material.id).toBe(false);
      ids.add(material.id);
      expect(materialCatalogById[material.id]).toBe(material);
    }

    expect(ids.size).toBe(MATERIAL_CATALOG_SEED.length);
  });

  it("includes public-source material rows with explicit provenance notes", () => {
    expect(MATERIAL_SOURCE_NOTE).toContain("public-source material rows");

    for (const id of PUBLIC_SOURCE_IDS) {
      const material = materialCatalogById[id];
      expect(material, id).toBeDefined();
      expect(material.tags).toContain("public-source");
      expect(material.notes, id).toMatch(/Public-source seed|Public-source density seed/u);
    }
  });

  it("seeds public board, porous absorber, foam, and underlay values used by natural-language stack drafting", () => {
    expect(materialCatalogById.gyproc_wallboard_ten_12_5?.densityKgM3).toBe(808);
    expect(materialCatalogById.knauf_pro_hd_12_5?.densityKgM3).toBe(992);
    expect(materialCatalogById.rockwool_rw4?.acoustic?.flowResistivityPaSM2).toBe(42000);
    expect(materialCatalogById.owens_corning_703?.densityKgM3).toBe(48);
    expect(materialCatalogById.basotect_melamine_foam?.densityKgM3).toBe(9);
    expect(materialCatalogById.eps_100_insulation_board?.densityKgM3).toBe(20);
    expect(materialCatalogById.scanrubber_825_underlay?.impact?.dynamicStiffnessMNm3).toBe(37);
  });
});
