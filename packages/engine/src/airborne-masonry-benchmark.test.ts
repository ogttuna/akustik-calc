import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

type BenchmarkCase = {
  airborneContext: AirborneContext;
  expectedRw: number;
  id: string;
  layers: LayerInput[];
  rawDynamicToleranceDb: number;
  source: string;
};

const XELLA_MODULAR_BUILDING_SYSTEM_URL =
  "https://storefrontapi.commerce.xella.com/occ/v2/uk/catalogs/ukContentCatalog/versions/Online/xellamedia/Xella-Modular-building-system.pdf";
const XELLA_NL_YTONG_MASSIEFBLOKKEN_URL =
  "https://storefrontapi.commerce.xella.com/occ/v2/nl/catalogs/nlContentCatalog/versions/Online/xellamedia/TD_Ytong_Massiefblokken.pdf";
const XELLA_NL_YTONG_SEPARATIEPANELEN_URL =
  "https://storefrontapi.commerce.xella.com/medias/TD-Ytong-Separatiepanelen.pdf?context=bWFzdGVyfHJvb3R8MzA0NzU3fGFwcGxpY2F0aW9uL3BkZnxhR1k1TDJnMFpTODVNVGsxTURjM05UWTJORGswTDFSRVgxbDBiMjVuWDFObGNHRnlZWFJwWlhCaGJtVnNaVzR1Y0dSbXw0ZDFjMDMxMDZhZTYxM2IzZDFiNDYwY2U3YjIyMmZlODk4OWQzZWFhMGQ4M2IwNWY5MDQxMTdkM2Y1ODFjYjAx";
const XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL =
  "https://storefrontapi.commerce.xella.com/medias/sys_master/root/h95/h69/9155108896798/TD_Ytong_Cellenbetonblokken1022/TD-Ytong-Cellenbetonblokken1022.pdf";
const XELLA_SILKA_CS_BLOCKS_URL =
  "https://storefrontapi.commerce.xella.com/medias/sys_master/root/ha1/h68/9149259120670/Silka_CSBlocks/Silka-CSBlocks.pdf";
const YTONG_D700_125_URL = "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-125-10-rw-44-db";
const YTONG_D700_150_URL = "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-150-10-rw-47-db";
const YTONG_D700_200_URL = "https://www.bimobject.com/en/xella-ytong/product/ytong-internal-wall-10-200-10-rw-50-db";
const WIENERBERGER_POROTHERM_GUIDE_URL =
  "https://www.wienerberger.co.uk/content/dam/wienerberger/united-kingdom/marketing/documents-magazines/technical/UK_MKT_DOC_TEC_WAL_POR_WB_BPG_Lucideon_Report_001.pdf";
const HELUZ_14_BROUSENA_URL = "https://www.heluz.cz/files/22145_10-Technicky-list-CZ.pdf";
const HELUZ_AKU_115_URL = "https://www.heluz.cz/files/21113_00-Technicky-list-CZ.pdf";
const HELUZ_AKU_20_P15_URL = "https://www.heluz.cz/files/21203_00-Technicky-list-CZ.pdf";
const HELUZ_AKU_30_333_P20_URL = "https://www.heluz.cz/files/21304_00-Technicky-list-CZ.pdf";

const LAB_MASONRY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const MATERIAL_CATALOG = getDefaultMaterialCatalog();

function buildLayers(entries: readonly (readonly [string, number])[]): LayerInput[] {
  return entries.map(([materialId, thicknessMm]) => ({
    materialId,
    thicknessMm
  }));
}

function benchmarkCase(
  id: string,
  source: string,
  expectedRw: number,
  rawDynamicToleranceDb: number,
  layers: readonly (readonly [string, number])[]
): BenchmarkCase {
  return {
    airborneContext: LAB_MASONRY_CONTEXT,
    expectedRw,
    id,
    layers: buildLayers(layers),
    rawDynamicToleranceDb,
    source
  };
}

function resolveLayers(layers: readonly LayerInput[]): ResolvedLayer[] {
  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, MATERIAL_CATALOG);

    return {
      ...layer,
      material,
      surfaceMassKgM2: (material.densityKgM3 * layer.thicknessMm) / 1000
    };
  });
}

function computeMae(errors: readonly number[]): number {
  return errors.reduce((sum, error) => sum + error, 0) / Math.max(errors.length, 1);
}

const BENCHMARK_CASES: BenchmarkCase[] = [
  benchmarkCase(
    "xella_silka_cs_100_official_2026",
    XELLA_SILKA_CS_BLOCKS_URL,
    43,
    2.5,
    [["silka_cs_block", 100]]
  ),
  benchmarkCase(
    "xella_silka_cs_150_official_2026",
    XELLA_SILKA_CS_BLOCKS_URL,
    50,
    2.5,
    [["silka_cs_block", 150]]
  ),
  benchmarkCase(
    "xella_silka_cs_175_official_2026",
    XELLA_SILKA_CS_BLOCKS_URL,
    52,
    2.5,
    [["silka_cs_block", 175]]
  ),
  benchmarkCase(
    "xella_silka_cs_214_official_2026",
    XELLA_SILKA_CS_BLOCKS_URL,
    55,
    2.5,
    [["silka_cs_block", 214]]
  ),
  benchmarkCase(
    "xella_ytong_g5_800_100_skim4_primary_2026",
    XELLA_MODULAR_BUILDING_SYSTEM_URL,
    40,
    2.5,
    [["skim_plaster", 4], ["ytong_g5_800", 100], ["skim_plaster", 4]]
  ),
  benchmarkCase(
    "xella_nl_ytong_massief_g2_300_240_skim3_lab_2026",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    46,
    1,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 240], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_massief_g2_300_300_skim3_lab_2026",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    49,
    1,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 300], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_massief_g2_300_365_skim3_lab_2026",
    XELLA_NL_YTONG_MASSIEFBLOKKEN_URL,
    51,
    1,
    [["skim_plaster", 3], ["ytong_massief_g2_300", 365], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_sep_aac_4_600_70_skim3_lab_2026",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    34,
    1,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 70], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_sep_aac_4_600_100_skim3_lab_2026",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    34,
    1,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_4_600", 100], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_sep_aac_5_750_100_skim3_lab_2026",
    XELLA_NL_YTONG_SEPARATIEPANELEN_URL,
    37,
    1,
    [["skim_plaster", 3], ["ytong_separatiepaneel_aac_5_750", 100], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_70_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    33,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 70], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_100_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    37,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 100], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_150_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    43,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 150], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_200_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    44,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 200], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_240_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    48,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 240], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g4_600_300_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    49,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g4_600", 300], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_nl_ytong_cellenbetonblok_g5_800_100_skim3_lab_2026",
    XELLA_NL_YTONG_CELLENBETONBLOKKEN_URL,
    39,
    1,
    [["skim_plaster", 3], ["ytong_cellenbetonblok_g5_800", 100], ["skim_plaster", 3]]
  ),
  benchmarkCase(
    "xella_ytong_d700_125_plaster10_official_2026",
    YTONG_D700_125_URL,
    44,
    2.5,
    [["cement_plaster", 10], ["ytong_aac_d700", 125], ["cement_plaster", 10]]
  ),
  benchmarkCase(
    "xella_ytong_d700_150_plaster10_official_2026",
    YTONG_D700_150_URL,
    47,
    2.5,
    [["cement_plaster", 10], ["ytong_aac_d700", 150], ["cement_plaster", 10]]
  ),
  benchmarkCase(
    "xella_ytong_d700_200_plaster10_official_2026",
    YTONG_D700_200_URL,
    50,
    2.5,
    [["cement_plaster", 10], ["ytong_aac_d700", 200], ["cement_plaster", 10]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_100_dense_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    43,
    1,
    [["dense_plaster", 13], ["porotherm_pls_100", 100], ["dense_plaster", 13]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_140_dense_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    44,
    1,
    [["dense_plaster", 13], ["porotherm_pls_140", 140], ["dense_plaster", 13]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_190_dense_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    48,
    1,
    [["dense_plaster", 13], ["porotherm_pls_190", 190], ["dense_plaster", 13]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_100_light_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    40,
    1,
    [["lightweight_plaster", 13], ["porotherm_pls_100", 100], ["lightweight_plaster", 13]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_140_light_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    41,
    1,
    [["lightweight_plaster", 13], ["porotherm_pls_140", 140], ["lightweight_plaster", 13]]
  ),
  benchmarkCase(
    "wienerberger_porotherm_190_light_plaster_primary_2026",
    WIENERBERGER_POROTHERM_GUIDE_URL,
    46,
    1,
    [["lightweight_plaster", 13], ["porotherm_pls_190", 190], ["lightweight_plaster", 13]]
  ),
  benchmarkCase(
    "heluz_14_brousena_lab_2026",
    HELUZ_14_BROUSENA_URL,
    41,
    1,
    [["lime_cement_plaster_1300", 15], ["heluz_14_brushed", 140], ["lime_cement_plaster_1300", 15]]
  ),
  benchmarkCase(
    "heluz_aku_115_lab_2026",
    HELUZ_AKU_115_URL,
    47,
    1,
    [["lime_cement_plaster_1700", 15], ["heluz_aku_115", 115], ["lime_cement_plaster_1700", 15]]
  ),
  benchmarkCase(
    "heluz_aku_200_p15_lab_2026",
    HELUZ_AKU_20_P15_URL,
    53,
    1,
    [["lime_cement_plaster_1780", 17], ["heluz_aku_200_p15", 200], ["lime_cement_plaster_1780", 17]]
  ),
  benchmarkCase(
    "heluz_aku_300_333_p20_lab_2026",
    HELUZ_AKU_30_333_P20_URL,
    56,
    1,
    [["lime_cement_plaster_1700", 15], ["heluz_aku_300_333_p20", 300], ["lime_cement_plaster_1700", 15]]
  )
];

describe("airborne masonry benchmark", () => {
  it("locks the official Xella/Ytong, Silka, Porotherm and HELUZ lab rows to curated exact anchors", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.airborneContext,
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });
      const predictedRw = result.ratings.iso717.Rw;
      const absoluteError = Math.abs(predictedRw - testCase.expectedRw);

      expect(predictedRw, testCase.id).toBe(testCase.expectedRw);

      return absoluteError;
    });

    expect(computeMae(errors)).toBe(0);
    expect(Math.max(...errors)).toBe(0);
  });

  it("keeps the raw dynamic masonry lane inside a tight pre-anchor envelope", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const resolvedLayers = resolveLayers(testCase.layers);
      const dynamic = calculateDynamicAirborneResult(resolvedLayers, {
        airborneContext: testCase.airborneContext,
        screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
      });
      const absoluteError = Math.abs(dynamic.rw - testCase.expectedRw);

      expect(dynamic.trace.detectedFamily, testCase.id).toBe("masonry_nonhomogeneous");
      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(testCase.rawDynamicToleranceDb);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(1.5);
    expect(Math.max(...errors)).toBeLessThanOrEqual(2.5);
  });
});
