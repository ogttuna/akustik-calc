import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildWorkbenchResponseCurveFigures } from "./response-curve-model";

function buildFixture(overrides: Partial<AssemblyCalculation> = {}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500, 1000, 2000],
      transmissionLossDb: [45, 52, 59, 64, 68]
    },
    impact: {
      LnW: 53,
      availableOutputs: ["Ln,w"],
      basis: "exact_source_band_curve_iso7172",
      confidence: {
        level: "high",
        provenance: "exact_band_curve",
        score: 0.98,
        summary: "Exact impact source."
      },
      notes: ["Fixture note."],
      scope: "exact_band_curve",
      trace: {
        activeSeriesId: "standardized",
        series: [
          {
            curve: {
              frequenciesHz: [50, 63, 80, 100, 125],
              levelsDb: [60, 59, 58, 57, 56]
            },
            id: "source",
            label: "Exact lab band curve"
          },
          {
            curve: {
              frequenciesHz: [50, 63, 80, 100, 125],
              levelsDb: [56, 55, 54, 53, 52]
            },
            id: "field",
            label: "Derived field continuation"
          },
          {
            curve: {
              frequenciesHz: [50, 63, 80, 100, 125],
              levelsDb: [54, 53, 52, 51, 50]
            },
            id: "standardized",
            label: "Standardized field continuation"
          }
        ]
      }
    },
    layers: [],
    metrics: {
      airGapCount: 0,
      estimatedCDb: -1,
      estimatedCtrDb: -4,
      estimatedRwDb: 58,
      estimatedStc: 57,
      insulationCount: 0,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 320,
      totalThicknessMm: 188
    },
    ok: true,
    ratings: {
      iso717: {
        C: -1,
        Ctr: -4,
        Rw: 58,
        composite: "Rw 58 (-1;-4)",
        descriptor: "Rw"
      }
    },
    supportedImpactOutputs: ["Ln,w"],
    supportedTargetOutputs: ["Rw", "Ln,w"],
    targetOutputs: ["Rw", "Ln,w"],
    unsupportedImpactOutputs: [],
    unsupportedTargetOutputs: [],
    warnings: [],
    ...overrides
  } as AssemblyCalculation;
}

describe("response curve model", () => {
  it("builds both airborne and impact figures when real impact traces are available", () => {
    const figures = buildWorkbenchResponseCurveFigures(buildFixture());

    expect(figures.map((figure) => figure.id)).toEqual(["airborne", "impact"]);
    expect(figures[0]).toEqual(
      expect.objectContaining({
        direction: "higher_better",
        title: "Airborne response curve"
      })
    );
    expect(figures[1]).toEqual(
      expect.objectContaining({
        activeSeriesId: "standardized",
        direction: "lower_better",
        title: "Impact response curve"
      })
    );
    expect(figures[1]?.series.map((series) => series.id)).toEqual(["source", "field", "standardized"]);
  });

  it("omits the impact figure on weighted-only impact lanes", () => {
    const figures = buildWorkbenchResponseCurveFigures(
      buildFixture({
        impact: {
          LnW: 58,
          availableOutputs: ["Ln,w"],
          basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
          confidence: {
            level: "medium",
            provenance: "formula_estimate_narrow_scope",
            score: 0.74,
            summary: "Weighted-only lane."
          },
          notes: ["Fixture note."],
          scope: "narrow_heavy_concrete_only"
        }
      })
    );

    expect(figures.map((figure) => figure.id)).toEqual(["airborne"]);
  });
});
