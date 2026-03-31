import type { AssemblyCalculation } from "@dynecho/shared";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ImpactTracePanel } from "./impact-trace-panel";

function buildFixture(overrides: Partial<AssemblyCalculation> = {}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [40, 50, 60]
    },
    impact: null,
    impactPredictorStatus: {
      active: true,
      futureSupportedTargetOutputs: [],
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      notes: [],
      readyForPlannedSolver: true,
      warnings: []
    },
    layers: [],
    metrics: {
      airGapCount: 0,
      estimatedCDb: -1,
      estimatedCtrDb: -4,
      estimatedRwDb: 41,
      estimatedStc: 41,
      insulationCount: 0,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 85,
      totalThicknessMm: 100
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 41 (-1;-4)",
        descriptor: "Rw"
      }
    },
    floorSystemRatings: {
      Rw: 41,
      RwCtr: 34.8,
      RwCtrSemantic: "rw_plus_ctr",
      basis: "screening_mass_law_curve_seed_v3"
    },
    supportedImpactOutputs: [],
    supportedTargetOutputs: [],
    targetOutputs: ["Rw", "Ln,w"],
    unsupportedImpactOutputs: ["Ln,w"],
    unsupportedTargetOutputs: ["Rw", "Ln,w"],
    warnings: [],
    ...overrides
  } as AssemblyCalculation;
}

describe("impact trace panel", () => {
  it("renders lane-less fail-closed floor results without assuming a field continuation object", () => {
    const html = renderToStaticMarkup(<ImpactTracePanel result={buildFixture()} />);

    expect(html).toContain("Predictor status and evidence trace");
    expect(html).not.toContain("Field continuation");
  });
});
