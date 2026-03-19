import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

type BenchmarkCase = {
  expectedDnTA: number;
  expectedRw: number;
  id: string;
  layers: LayerInput[];
  source: string;
};

const XELLA_NL_YTONG_SEPARATIEPANELEN_URL =
  "https://storefrontapi.commerce.xella.com/medias/TD-Ytong-Separatiepanelen.pdf?context=bWFzdGVyfHJvb3R8MzA0NzU3fGFwcGxpY2F0aW9uL3BkZnxhR1k1TDJnMFpTODVNVGsxTURjM05UWTJORGswTDFSRVgxbDBiMjVuWDFObGNHRnlZWFJwWlhCaGJtVnNaVzR1Y0dSbXw0ZDFjMDMxMDZhZTYxM2IzZDFiNDYwY2U3YjIyMmZlODk4OWQzZWFhMGQ4M2IwNWY5MDQxMTdkM2Y1ODFjYjAx";

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  electricalBoxes: "none",
  junctionQuality: "good",
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  penetrationState: "none",
  perimeterSeal: "good",
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const MATERIAL_CATALOG = getDefaultMaterialCatalog();

function benchmarkCase(
  id: string,
  expectedRw: number,
  expectedDnTA: number,
  layers: readonly (readonly [string, number])[]
): BenchmarkCase {
  return {
    expectedDnTA,
    expectedRw,
    id,
    layers: layers.map(([materialId, thicknessMm]) => ({ materialId, thicknessMm })),
    source: XELLA_NL_YTONG_SEPARATIEPANELEN_URL
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
  benchmarkCase("xella_nl_ytong_sep_aac_4_600_70_field_proxy_2026", 34, 28, [
    ["skim_plaster", 3],
    ["ytong_separatiepaneel_aac_4_600", 70],
    ["skim_plaster", 3]
  ]),
  benchmarkCase("xella_nl_ytong_sep_aac_4_600_100_field_proxy_2026", 34, 28, [
    ["skim_plaster", 3],
    ["ytong_separatiepaneel_aac_4_600", 100],
    ["skim_plaster", 3]
  ]),
  benchmarkCase("xella_nl_ytong_sep_aac_5_750_100_field_proxy_2026", 37, 33, [
    ["skim_plaster", 3],
    ["ytong_separatiepaneel_aac_5_750", 100],
    ["skim_plaster", 3]
  ])
];

describe("airborne Ytong separatiepanelen benchmark", () => {
  it("keeps the raw dynamic prefab AAC lane on the published lab corridor", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const resolvedLayers = resolveLayers(testCase.layers);
      const dynamic = calculateDynamicAirborneResult(resolvedLayers, {
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        },
        screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
      });
      const absoluteError = Math.abs(dynamic.rw - testCase.expectedRw);

      expect(dynamic.trace.detectedFamily, testCase.id).toBe("masonry_nonhomogeneous");
      expect(dynamic.trace.strategy, testCase.id).toContain("ytong_separatiepanelen_calibration");
      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.5);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });

  it("carries the published approximate DnT,A,k companions separately from the live local DnT,A proxy", () => {
    BENCHMARK_CASES.forEach((testCase) => {
      const lab = calculateAssembly(testCase.layers, {
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        },
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });
      const result = calculateAssembly(testCase.layers, {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w", "DnT,A"]
      });
      const companionDnTAk = result.ratings.field?.DnTAk;

      expect(lab.ratings.iso717.Rw, testCase.id).toBe(testCase.expectedRw);
      expect(companionDnTAk, `${testCase.id} (${testCase.source})`).toBe(testCase.expectedDnTA);
      expect(result.ratings.field?.basis ?? "", testCase.id).toContain("official_approximate_field_companion");
      expect(
        result.warnings.some((warning: string) => /official approximate airborne field companion available/i.test(warning)),
        testCase.id
      ).toBe(true);
      expect(typeof result.ratings.field?.DnTA, `${testCase.id} (${testCase.source})`).toBe("number");
    });
  });
});
