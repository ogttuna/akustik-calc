import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildResultAnswerChartLanes } from "./result-answer-chart-model";

function buildFixture(overrides: Partial<AssemblyCalculation> = {}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [40, 50, 60]
    },
    impact: {
      LnW: 54,
      availableOutputs: ["Ln,w"],
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      confidence: {
        level: "medium",
        provenance: "formula_estimate_narrow_scope",
        score: 0.73,
        summary: "Fixture confidence."
      },
      notes: ["Fixture note."],
      scope: "narrow_heavy_concrete_only"
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

describe("result answer chart model", () => {
  it("builds airborne and impact lanes with brief targets", () => {
    const lanes = buildResultAnswerChartLanes({
      result: buildFixture({
        impact: {
          LnW: 54,
          DeltaLw: 22,
          availableOutputs: ["Ln,w", "DeltaLw"],
          basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
          confidence: {
            level: "medium",
            provenance: "formula_estimate_narrow_scope",
            score: 0.73,
            summary: "Fixture confidence."
          },
          notes: ["Fixture note."],
          scope: "narrow_heavy_concrete_only"
        }
      }),
      targetLnwDb: "53",
      targetRwDb: "52"
    });

    expect(lanes.map((lane) => lane.id)).toEqual(["airborne", "impact"]);
    expect(lanes[0]).toEqual(
      expect.objectContaining({
        direction: "higher_better",
        label: "Rw estimate",
        target: 52,
        value: 58
      })
    );
    expect(lanes[1]).toEqual(
      expect.objectContaining({
        direction: "lower_better",
        label: "Ln,w",
        target: 53,
        value: 54
      })
    );
    expect(lanes[1]?.companions).toContainEqual({ label: "DeltaLw", valueLabel: "22 dB" });
  });

  it("prefers field-side weighted impact output when it is the active answer", () => {
    const lanes = buildResultAnswerChartLanes({
      result: buildFixture({
        impact: {
          LPrimeNT50: 51,
          LPrimeNTw: 49,
          availableOutputs: ["L'nT,w", "L'nT,50"],
          basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
          confidence: {
            level: "medium",
            provenance: "published_family_estimate",
            score: 0.66,
            summary: "Fixture confidence."
          },
          labOrField: "field",
          notes: ["Fixture note."],
          scope: "family_estimate"
        }
      }),
      targetLnwDb: "50",
      targetRwDb: ""
    });

    expect(lanes[1]).toEqual(
      expect.objectContaining({
        label: "L'nT,w",
        target: 50,
        value: 49
      })
    );
    expect(lanes[1]?.companions).toContainEqual({ label: "L'nT,50", valueLabel: "51 dB" });
  });

  it("returns only the airborne lane when no impact answer is active", () => {
    const lanes = buildResultAnswerChartLanes({
      result: buildFixture({
        impact: null,
        lowerBoundImpact: null
      }),
      targetLnwDb: "53",
      targetRwDb: "52"
    });

    expect(lanes.map((lane) => lane.id)).toEqual(["airborne"]);
  });
});
