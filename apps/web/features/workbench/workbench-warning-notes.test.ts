import type { AssemblyCalculation } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  buildWorkbenchWarningNotes
} from "./workbench-warning-notes";
import {
  REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
} from "./reinforced-concrete-low-confidence-floor-lane";

function buildReinforcedConcreteLowConfidenceResult(): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [52, 60, 67]
    },
    dynamicImpactTrace: {
      detectedSupportFamily: "reinforced_concrete",
      estimateTier: "low_confidence",
      systemType: "combined_upper_lower_system"
    } as AssemblyCalculation["dynamicImpactTrace"],
    floorSystemEstimate: {
      kind: "low_confidence"
    } as AssemblyCalculation["floorSystemEstimate"],
    floorSystemRatings: {
      Rw: 65.9,
      RwCtr: 57,
      RwCtrSemantic: "rw_plus_ctr",
      basis: "predictor_floor_system_low_confidence_estimate"
    },
    impact: {
      basis: "predictor_floor_system_low_confidence_estimate",
      LnW: 50
    } as AssemblyCalculation["impact"],
    layers: [],
    metrics: {
      airGapCount: 1,
      estimatedCDb: -2,
      estimatedCtrDb: -8.9,
      estimatedRwDb: 65.9,
      estimatedStc: 65,
      insulationCount: 1,
      method: "screening_mass_law_curve_seed_v3",
      surfaceMassKgM2: 410,
      totalThicknessMm: 446
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 66 (-2;-9)",
        descriptor: "Rw"
      }
    },
    supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
    unsupportedTargetOutputs: [],
    warnings: []
  } as AssemblyCalculation;
}

describe("buildWorkbenchWarningNotes", () => {
  it("normalizes reinforced-concrete low-confidence proxy-airborne warnings into a concrete-specific family note", () => {
    const notes = buildWorkbenchWarningNotes(buildReinforcedConcreteLowConfidenceResult(), [
      "Published low-confidence fallback active: reinforced concrete at 29% fit.",
      "Low-confidence reinforced-concrete fallback is active with proxy airborne companions. Ln,w stays on the mixed nearby-row fallback, while airborne companions remain proxy values instead of a narrow same-stack family claim."
    ]);

    expect(notes).toContain(REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE);
    expect(notes).not.toContain("Published low-confidence fallback active: reinforced concrete at 29% fit.");
    expect(
      notes.some((note) => /proxy airborne companions/i.test(note) && note !== REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE)
    ).toBe(false);
  });
});
