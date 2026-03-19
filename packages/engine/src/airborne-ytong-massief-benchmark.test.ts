import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

type BenchmarkCase = {
  expectedDnTAk: number;
  airborneContext: AirborneContext;
  expectedRw: number;
  id: string;
  layers: LayerInput[];
  source: string;
};

const XELLA_NL_YTONG_MASSIEFBLOKKEN_URL =
  "https://storefrontapi.commerce.xella.com/occ/v2/nl/catalogs/nlContentCatalog/versions/Online/xellamedia/TD_Ytong_Massiefblokken.pdf";

const LAB_MASONRY_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

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
  expectedDnTAk: number,
  layers: readonly (readonly [string, number])[]
): BenchmarkCase {
  return {
    airborneContext: LAB_MASONRY_CONTEXT,
    expectedDnTAk,
    expectedRw,
    id,
    layers: layers.map(([materialId, thicknessMm]) => ({ materialId, thicknessMm })),
    source: XELLA_NL_YTONG_MASSIEFBLOKKEN_URL
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
  benchmarkCase("xella_nl_ytong_massief_g2_300_240_lab_2026", 46, 33, [["skim_plaster", 3], ["ytong_massief_g2_300", 240], ["skim_plaster", 3]]),
  benchmarkCase("xella_nl_ytong_massief_g2_300_300_lab_2026", 49, 35, [["skim_plaster", 3], ["ytong_massief_g2_300", 300], ["skim_plaster", 3]]),
  benchmarkCase("xella_nl_ytong_massief_g2_300_365_lab_2026", 51, 37, [["skim_plaster", 3], ["ytong_massief_g2_300", 365], ["skim_plaster", 3]])
];

describe("airborne Ytong Massief benchmark", () => {
  it("keeps the low-density Ytong Massief G2/300 lane inside the official Rw corridor", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const resolvedLayers = resolveLayers(testCase.layers);
      const dynamic = calculateDynamicAirborneResult(resolvedLayers, {
        airborneContext: testCase.airborneContext,
        screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
      });
      const absoluteError = Math.abs(dynamic.rw - testCase.expectedRw);

      expect(dynamic.trace.detectedFamily, testCase.id).toBe("masonry_nonhomogeneous");
      expect(dynamic.trace.strategy, testCase.id).toContain("ytong_massief_g2_300_calibration");
      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.5);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });

  it("keeps the final calculator result on the same official corridor", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.airborneContext,
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });
      const absoluteError = Math.abs(result.ratings.iso717.Rw - testCase.expectedRw);

      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.5);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });

  it("carries the published approximate DnT,A,k companions separately from the live local DnT,A proxy", () => {
    BENCHMARK_CASES.forEach((testCase) => {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: ["R'w", "DnT,w", "DnT,A"]
      });
      const companionDnTAk = result.ratings.field?.DnTAk;

      expect(companionDnTAk, `${testCase.id} (${testCase.source})`).toBe(testCase.expectedDnTAk);
      expect(result.ratings.field?.basis ?? "", testCase.id).toContain("official_approximate_field_companion");
      expect(
        result.warnings.some((warning: string) => /official approximate airborne field companion available/i.test(warning)),
        testCase.id
      ).toBe(true);
      expect(typeof result.ratings.field?.DnTA, `${testCase.id} (${testCase.source})`).toBe("number");
    });
  });
});
