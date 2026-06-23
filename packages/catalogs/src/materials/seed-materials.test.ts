import { MaterialDefinitionSchema } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  MATERIAL_CATALOG_SEED,
  MATERIAL_SOURCE_NOTE,
  materialCatalogById
} from "./seed-materials";

const PUBLIC_SOURCE_IDS = [
  "gyproc_wallboard_ten_12_5",
  "gyproc_soundbloc_12_5",
  "gyproc_soundbloc_15",
  "gyproc_habito_12_5",
  "gyproc_fireline_12_5",
  "knauf_pro_hd_12_5",
  "knauf_pro_hd_15",
  "knauf_soundshield_plus_12_5",
  "knauf_soundshield_plus_15",
  "quietrock_510",
  "quietrock_530",
  "fermacell_gypsum_fibreboard_1150",
  "fiber_cement_board_1290",
  "osb_3_640",
  "stora_enso_clt_490",
  "hh_celcon_solar_460",
  "hh_celcon_standard_600",
  "hh_celcon_high_strength_730",
  "tecsound_sy_35",
  "tecsound_sy_50",
  "tecsound_sy_70",
  "tecsound_sy_100",
  "rockwool_rwa45",
  "rockwool_rw3",
  "rockwool_rw4",
  "rockwool_rw5",
  "rockwool_rw6",
  "rockwool_afb_40",
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
  "regupol_sound_12",
  "regupol_sound_15",
  "regupol_sound_17",
  "regupol_sound_47",
  "regupol_comfort_8",
  "regupol_comfort_12",
  "regupol_sound_and_drain_22",
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
    expect(materialCatalogById.gyproc_soundbloc_12_5?.densityKgM3).toBe(824);
    expect(materialCatalogById.gyproc_soundbloc_15?.densityKgM3).toBe(867);
    expect(materialCatalogById.gyproc_habito_12_5?.densityKgM3).toBe(936);
    expect(materialCatalogById.gyproc_fireline_12_5?.densityKgM3).toBe(776);
    expect(materialCatalogById.knauf_pro_hd_12_5?.densityKgM3).toBe(992);
    expect(materialCatalogById.knauf_soundshield_plus_12_5?.densityKgM3).toBe(920);
    expect(materialCatalogById.knauf_soundshield_plus_15?.densityKgM3).toBe(887);
    expect(materialCatalogById.quietrock_510?.densityKgM3).toBe(819);
    expect(materialCatalogById.quietrock_530?.densityKgM3).toBe(884);
    expect(materialCatalogById.tecsound_sy_70?.densityKgM3).toBe(2000);
    expect(materialCatalogById.stora_enso_clt_490?.densityKgM3).toBe(490);
    expect(materialCatalogById.hh_celcon_standard_600?.densityKgM3).toBe(600);
    expect(materialCatalogById.rockwool_rw4?.acoustic?.flowResistivityPaSM2).toBe(42000);
    expect(materialCatalogById.rockwool_afb_40?.densityKgM3).toBe(40);
    expect(materialCatalogById.owens_corning_703?.densityKgM3).toBe(48);
    expect(materialCatalogById.basotect_melamine_foam?.densityKgM3).toBe(9);
    expect(materialCatalogById.eps_100_insulation_board?.densityKgM3).toBe(20);
    expect(materialCatalogById.regupol_sound_15?.impact?.dynamicStiffnessMNm3).toBe(6);
    expect(materialCatalogById.regupol_comfort_8?.impact?.dynamicStiffnessMNm3).toBe(15);
    expect(materialCatalogById.regupol_sound_and_drain_22?.impact?.dynamicStiffnessMNm3).toBe(21);
    expect(materialCatalogById.scanrubber_825_underlay?.impact?.dynamicStiffnessMNm3).toBe(37);
  });

  it("keeps new product-specific materials directly usable for layer surface-mass calculation", () => {
    const boardSurfaceMass = (materialCatalogById.gyproc_soundbloc_12_5!.densityKgM3 * 12.5) / 1000;
    const membraneSurfaceMass = (materialCatalogById.tecsound_sy_70!.densityKgM3 * 3.5) / 1000;
    const cltSurfaceMass = (materialCatalogById.stora_enso_clt_490!.densityKgM3 * 120) / 1000;

    expect(Number(boardSurfaceMass.toFixed(1))).toBe(10.3);
    expect(Number(membraneSurfaceMass.toFixed(1))).toBe(7);
    expect(Number(cltSurfaceMass.toFixed(1))).toBe(58.8);
  });
});
