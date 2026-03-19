import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateDynamicAirborneResult } from "./dynamic-airborne";
import { estimateRwDb } from "./estimate-rw";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

type BenchmarkCase = {
  airborneContext: AirborneContext;
  expectedRw: number;
  finishId: "celcon_dense_plaster" | "celcon_lwt_plaster";
  gradeId: "celcon_high_strength" | "celcon_solar_grade" | "celcon_standard_grade";
  id: string;
  layers: LayerInput[];
  source: string;
  thicknessMm: number;
};

const HH_CELCON_SOUND_INDEX_URL =
  "https://www.hhcelcon.co.uk/media/1543/TSD55%20Sound%20Reduction%20Index%2C%20Rw%20%28Apr%202016%29.pdf";

const LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const MATERIAL_CATALOG = getDefaultMaterialCatalog();

const OFFICIAL_ROWS = [
  {
    thicknessMm: 75,
    celcon_lwt_plaster: {
      celcon_high_strength: 41.4,
      celcon_solar_grade: 38.2,
      celcon_standard_grade: 40.0
    },
    celcon_dense_plaster: {
      celcon_high_strength: 45.0,
      celcon_solar_grade: 42.6,
      celcon_standard_grade: 43.9
    }
  },
  {
    thicknessMm: 100,
    celcon_lwt_plaster: {
      celcon_high_strength: 44.1,
      celcon_solar_grade: 40.6,
      celcon_standard_grade: 42.6
    },
    celcon_dense_plaster: {
      celcon_high_strength: 47.0,
      celcon_solar_grade: 44.4,
      celcon_standard_grade: 45.8
    }
  },
  {
    thicknessMm: 140,
    celcon_lwt_plaster: {
      celcon_high_strength: 47.5,
      celcon_solar_grade: 43.8,
      celcon_standard_grade: 45.8
    },
    celcon_dense_plaster: {
      celcon_high_strength: 49.7,
      celcon_solar_grade: 46.7,
      celcon_standard_grade: 48.4
    }
  },
  {
    thicknessMm: 150,
    celcon_lwt_plaster: {
      celcon_high_strength: 48.2,
      celcon_solar_grade: 44.4,
      celcon_standard_grade: 46.5
    },
    celcon_dense_plaster: {
      celcon_high_strength: 50.3,
      celcon_solar_grade: 47.3,
      celcon_standard_grade: 49.0
    }
  },
  {
    thicknessMm: 215,
    celcon_lwt_plaster: {
      celcon_high_strength: 52.0,
      celcon_solar_grade: 48.0,
      celcon_standard_grade: 50.3
    },
    celcon_dense_plaster: {
      celcon_high_strength: 53.6,
      celcon_solar_grade: 50.2,
      celcon_standard_grade: 52.1
    }
  },
  {
    thicknessMm: 275,
    celcon_lwt_plaster: {
      celcon_high_strength: 54.7,
      celcon_solar_grade: 50.6,
      celcon_standard_grade: 52.9
    },
    celcon_dense_plaster: {
      celcon_high_strength: 56.0,
      celcon_solar_grade: 52.4,
      celcon_standard_grade: 54.4
    }
  },
  {
    thicknessMm: 300,
    celcon_lwt_plaster: {
      celcon_high_strength: 55.7,
      celcon_solar_grade: 51.6,
      celcon_standard_grade: 53.9
    },
    celcon_dense_plaster: {
      celcon_high_strength: 56.9,
      celcon_solar_grade: 53.2,
      celcon_standard_grade: 55.3
    }
  },
  {
    thicknessMm: 355,
    celcon_lwt_plaster: {
      celcon_high_strength: 57.6,
      celcon_solar_grade: 53.4,
      celcon_standard_grade: 55.7
    },
    celcon_dense_plaster: {
      celcon_high_strength: 58.6,
      celcon_solar_grade: 54.8,
      celcon_standard_grade: 56.9
    }
  }
] as const;

const BENCHMARK_CASES: BenchmarkCase[] = OFFICIAL_ROWS.flatMap((row) =>
  (Object.entries(row) as [string, unknown][])
    .filter(([key]) => key === "celcon_lwt_plaster" || key === "celcon_dense_plaster")
    .flatMap(([finishId, values]) =>
      Object.entries(values as Record<string, number>).map(([gradeId, expectedRw]) => ({
        airborneContext: LAB_CONTEXT,
        expectedRw,
        finishId: finishId as BenchmarkCase["finishId"],
        gradeId: gradeId as BenchmarkCase["gradeId"],
        id: `hh_celcon_${gradeId}_${finishId}_${row.thicknessMm}_lab_2026`,
        layers: [
          { materialId: finishId, thicknessMm: 13 },
          { materialId: gradeId, thicknessMm: row.thicknessMm },
          { materialId: finishId, thicknessMm: 13 }
        ],
        source: HH_CELCON_SOUND_INDEX_URL,
        thicknessMm: row.thicknessMm
      }))
    )
);

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

describe("airborne Celcon finished benchmark", () => {
  it("keeps the official H+H Celcon finished-aircrete rows inside a tight raw dynamic corridor", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const resolvedLayers = resolveLayers(testCase.layers);
      const dynamic = calculateDynamicAirborneResult(resolvedLayers, {
        airborneContext: testCase.airborneContext,
        screeningEstimatedRwDb: estimateRwDb(resolvedLayers)
      });
      const absoluteError = Number(Math.abs(dynamic.rw - testCase.expectedRw).toFixed(3));

      expect(dynamic.trace.detectedFamily, testCase.id).toBe("masonry_nonhomogeneous");
      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.35);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });

  it("keeps the final calculator result on the same official Celcon corridor", () => {
    const errors = BENCHMARK_CASES.map((testCase) => {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.airborneContext,
        calculator: "dynamic",
        targetOutputs: ["Rw"]
      });
      const absoluteError = Number(Math.abs(result.ratings.iso717.Rw - testCase.expectedRw).toFixed(3));

      expect(absoluteError, `${testCase.id} (${testCase.source})`).toBeLessThanOrEqual(1);

      return absoluteError;
    });

    expect(computeMae(errors)).toBeLessThanOrEqual(0.35);
    expect(Math.max(...errors)).toBeLessThanOrEqual(1);
  });
});
