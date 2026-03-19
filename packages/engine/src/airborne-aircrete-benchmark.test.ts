import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

type BenchmarkCase = {
  expectedRw: number;
  id: string;
  layers: LayerInput[];
};

const HH_CELCON_SOUND_INDEX_URL =
  "https://www.hhcelcon.co.uk/media/1543/TSD55%20Sound%20Reduction%20Index%2C%20Rw%20%28Apr%202016%29.pdf";

const LAB_CONTEXT: AirborneContext = {
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
  { id: "celcon_solar_75", expectedRw: 33.6, layers: buildLayers([["celcon_solar_grade", 75]]) },
  { id: "celcon_standard_75", expectedRw: 36.1, layers: buildLayers([["celcon_standard_grade", 75]]) },
  { id: "celcon_high_75", expectedRw: 38.1, layers: buildLayers([["celcon_high_strength", 75]]) },
  { id: "celcon_solar_100", expectedRw: 37.0, layers: buildLayers([["celcon_solar_grade", 100]]) },
  { id: "celcon_standard_100", expectedRw: 39.6, layers: buildLayers([["celcon_standard_grade", 100]]) },
  { id: "celcon_high_100", expectedRw: 41.5, layers: buildLayers([["celcon_high_strength", 100]]) },
  { id: "celcon_solar_150", expectedRw: 41.9, layers: buildLayers([["celcon_solar_grade", 150]]) },
  { id: "celcon_standard_150", expectedRw: 44.4, layers: buildLayers([["celcon_standard_grade", 150]]) },
  { id: "celcon_high_150", expectedRw: 46.4, layers: buildLayers([["celcon_high_strength", 150]]) },
  { id: "celcon_solar_215", expectedRw: 46.2, layers: buildLayers([["celcon_solar_grade", 215]]) },
  { id: "celcon_standard_215", expectedRw: 48.8, layers: buildLayers([["celcon_standard_grade", 215]]) },
  { id: "celcon_high_215", expectedRw: 50.7, layers: buildLayers([["celcon_high_strength", 215]]) }
];

describe("airborne aircrete benchmark", () => {
  it("tracks the official H+H Celcon unfinished-aircrete Rw table tightly", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const resolvedLayers = resolveLayers(testCase.layers);
      const dynamic = calculateDynamicAirborneResult(resolvedLayers, {
        airborneContext: LAB_CONTEXT,
        screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
      });
      const absoluteError = Math.abs(dynamic.rw - testCase.expectedRw);

      expect(dynamic.trace.detectedFamily, testCase.id).toBe("masonry_nonhomogeneous");
      expect(dynamic.trace.strategy, testCase.id).toContain("aircrete_unfinished_calibration");
      expect(absoluteError, `${testCase.id} (${HH_CELCON_SOUND_INDEX_URL})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.5);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });
});
