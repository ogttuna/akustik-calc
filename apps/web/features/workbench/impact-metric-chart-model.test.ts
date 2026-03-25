import type { ImpactCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildImpactMetricChartPoints } from "./impact-metric-chart-model";

function buildImpactFixture(overrides: Partial<ImpactCalculation> = {}): ImpactCalculation {
  return {
    LnW: 58,
    availableOutputs: ["Ln,w"],
    basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
    confidence: {
      level: "medium",
      provenance: "formula_estimate_narrow_scope",
      score: 0.74,
      summary: "Fixture confidence summary."
    },
    notes: ["Fixture note."],
    scope: "narrow_heavy_concrete_only",
    ...overrides
  };
}

describe("impact metric chart model", () => {
  it("builds the weighted impact trajectory in reference-to-field order", () => {
    const points = buildImpactMetricChartPoints(
      buildImpactFixture({
        LPrimeNT50: 56,
        LPrimeNTw: 54,
        LPrimeNW: 52,
        LnW: 58,
        LnWPlusCI: 60,
        bareReferenceLnW: 78,
        treatedReferenceLnW: 63
      })
    );

    expect(points.map((point) => point.id)).toEqual([
      "bare_reference_lnw",
      "treated_reference_lnw",
      "lnw",
      "lnw_plus_ci",
      "lprimenw",
      "lprimentw",
      "lpriment50"
    ]);
    expect(points.map((point) => point.value)).toEqual([78, 63, 58, 60, 52, 54, 56]);
  });

  it("skips unavailable stages without breaking the remaining order", () => {
    const points = buildImpactMetricChartPoints(
      buildImpactFixture({
        LPrimeNTw: 61,
        LPrimeNW: undefined,
        LnW: undefined,
        LnWPlusCI: undefined,
        bareReferenceLnW: undefined,
        labOrField: "field",
        treatedReferenceLnW: undefined
      })
    );

    expect(points).toEqual([
      expect.objectContaining({
        id: "lprimentw",
        kind: "standardized",
        label: "L'nT,w",
        value: 61
      })
    ]);
  });

  it("returns an empty series when no impact result is active", () => {
    expect(buildImpactMetricChartPoints(null)).toEqual([]);
  });
});
