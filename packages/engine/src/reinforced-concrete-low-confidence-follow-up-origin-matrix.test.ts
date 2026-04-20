import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

type DynamicResult = ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>;

type OriginSnapshot = {
  candidateIds: readonly string[] | null;
  confidenceLevel: string | null;
  confidenceProvenance: string | null;
  confidenceScore: number | null;
  estimateKind: string | null;
  fitPercent: number | null;
  formulaNotesMentionAnnexC: boolean;
  formulaNotesMentionBareFloorPath: boolean;
  formulaNotesMentionFloatingBranch: boolean;
  impactBasis: string | null;
  implementedFormulaEstimate: boolean | null;
  implementedLowConfidenceEstimate: boolean | null;
  inputMode: string | null;
  noteMentionsLowConfidenceFallback: boolean;
  noteMentionsNearbyRowRanking: boolean;
  noteMentionsProxyAirborneCompanions: boolean;
  readyForPlannedSolver: boolean | null;
  supported: readonly string[];
  unsupported: readonly string[];
  warningMentionsProxyAirborne: boolean;
  warningMentionsPublishedLowConfidenceFit: boolean;
  warningMentionsUnsupportedRwCtr: boolean;
  warningMentionsVisibleDerivedTopology: boolean;
  warningMentionsWithheldClosestCandidate: boolean;
};

type OriginCase = {
  evaluate: () => DynamicResult;
  expected: OriginSnapshot;
  id: string;
};

function snapshot(result: DynamicResult): OriginSnapshot {
  const impactSupportNotes = result.impactSupport?.notes ?? [];
  const formulaNotes = result.impactSupport?.formulaNotes ?? [];
  const warnings = result.warnings ?? [];

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    confidenceLevel: result.impact?.confidence?.level ?? null,
    confidenceProvenance: result.impact?.confidence?.provenance ?? null,
    confidenceScore: result.impact?.confidence?.score ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    formulaNotesMentionAnnexC: formulaNotes.some((note: string) => /Annex C style estimate/i.test(note)),
    formulaNotesMentionBareFloorPath: formulaNotes.some((note: string) =>
      /Heavy bare-floor path follows 164 - 35 log10/i.test(note)
    ),
    formulaNotesMentionFloatingBranch: formulaNotes.some((note: string) =>
      /Floating-floor branch applies 13 log10/i.test(note)
    ),
    impactBasis: result.impact?.basis ?? null,
    implementedFormulaEstimate: result.impactPredictorStatus?.implementedFormulaEstimate ?? null,
    implementedLowConfidenceEstimate: result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? null,
    inputMode: result.impactPredictorStatus?.inputMode ?? null,
    noteMentionsLowConfidenceFallback: impactSupportNotes.some((note: string) =>
      /Published floor-system low-confidence fallback is active: reinforced concrete/i.test(note)
    ),
    noteMentionsNearbyRowRanking: impactSupportNotes.some((note: string) =>
      /Nearby-row ranking stays elastic-ceiling first, rigid-ceiling second/i.test(note)
    ),
    noteMentionsProxyAirborneCompanions: impactSupportNotes.some((note: string) =>
      /proxy airborne companions from mixed nearby concrete rows/i.test(note)
    ),
    readyForPlannedSolver: result.impactPredictorStatus?.readyForPlannedSolver ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warningMentionsProxyAirborne: warnings.some((warning: string) =>
      /low-confidence reinforced-concrete fallback is active with proxy airborne companions/i.test(warning)
    ),
    warningMentionsPublishedLowConfidenceFit: warnings.some((warning: string) =>
      /Published low-confidence fallback active: reinforced concrete at 29% fit/i.test(warning)
    ),
    warningMentionsUnsupportedRwCtr: warnings.some((warning: string) =>
      /Unsupported target outputs: Rw, Ctr/i.test(warning)
    ),
    warningMentionsVisibleDerivedTopology: warnings.some((warning: string) =>
      /Impact predictor topology was derived from visible floor-role layers/i.test(warning)
    ),
    warningMentionsWithheldClosestCandidate: warnings.some((warning: string) =>
      /withheld the closest candidate label because it drifted outside the defended same-family route/i.test(warning)
    )
  };
}

const LOW_CONFIDENCE_CANDIDATE_IDS = [
  "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
] as const;

const CASES: readonly OriginCase[] = [
  {
    id: "explicit predictor input keeps reinforced concrete on the published-family low-confidence provenance surface",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        } as never,
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
      confidenceLevel: "low",
      confidenceProvenance: "published_family_estimate",
      confidenceScore: 0.54,
      estimateKind: "low_confidence",
      fitPercent: 29,
      formulaNotesMentionAnnexC: false,
      formulaNotesMentionBareFloorPath: false,
      formulaNotesMentionFloatingBranch: false,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: true,
      inputMode: "explicit_predictor_input",
      noteMentionsLowConfidenceFallback: true,
      noteMentionsNearbyRowRanking: true,
      noteMentionsProxyAirborneCompanions: true,
      readyForPlannedSolver: false,
      supported: ["Rw", "Ctr", "Ln,w"],
      unsupported: ["DeltaLw"],
      warningMentionsProxyAirborne: true,
      warningMentionsPublishedLowConfidenceFit: false,
      warningMentionsUnsupportedRwCtr: false,
      warningMentionsVisibleDerivedTopology: false,
      warningMentionsWithheldClosestCandidate: false
    }
  },
  {
    id: "visible-derived reinforced concrete keeps the same low-confidence provenance with explicit derived-topology honesty",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
          { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
          { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
        ] as never,
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
      confidenceLevel: "low",
      confidenceProvenance: "published_family_estimate",
      confidenceScore: 0.54,
      estimateKind: "low_confidence",
      fitPercent: 29,
      formulaNotesMentionAnnexC: false,
      formulaNotesMentionBareFloorPath: false,
      formulaNotesMentionFloatingBranch: false,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: true,
      inputMode: "derived_from_visible_layers",
      noteMentionsLowConfidenceFallback: true,
      noteMentionsNearbyRowRanking: true,
      noteMentionsProxyAirborneCompanions: true,
      readyForPlannedSolver: false,
      supported: ["Rw", "Ctr", "Ln,w"],
      unsupported: ["DeltaLw"],
      warningMentionsProxyAirborne: true,
      warningMentionsPublishedLowConfidenceFit: true,
      warningMentionsUnsupportedRwCtr: false,
      warningMentionsVisibleDerivedTopology: true,
      warningMentionsWithheldClosestCandidate: false
    }
  },
  {
    id: "expanded-board boundary keeps reinforced concrete on a narrow bare-floor formula provenance instead of low-confidence fallback",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
          { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
          { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 }
        ] as never,
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      confidenceLevel: "medium",
      confidenceProvenance: "formula_estimate_narrow_scope",
      confidenceScore: 0.68,
      estimateKind: null,
      fitPercent: null,
      formulaNotesMentionAnnexC: true,
      formulaNotesMentionBareFloorPath: true,
      formulaNotesMentionFloatingBranch: false,
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      inputMode: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRanking: false,
      noteMentionsProxyAirborneCompanions: false,
      readyForPlannedSolver: false,
      supported: ["Rw", "Ctr", "Ln,w"],
      unsupported: ["DeltaLw"],
      warningMentionsProxyAirborne: false,
      warningMentionsPublishedLowConfidenceFit: false,
      warningMentionsUnsupportedRwCtr: false,
      warningMentionsVisibleDerivedTopology: false,
      warningMentionsWithheldClosestCandidate: true
    }
  },
  {
    id: "upper-only heavy floating formula keeps explicit formula provenance and delta-lw support outside the reinforced follow-up lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "heavy_floating_floor",
          referenceFloorType: "heavy_standard",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 }
        } as never,
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      confidenceLevel: "medium",
      confidenceProvenance: "formula_estimate_narrow_scope",
      confidenceScore: 0.74,
      estimateKind: null,
      fitPercent: null,
      formulaNotesMentionAnnexC: true,
      formulaNotesMentionBareFloorPath: true,
      formulaNotesMentionFloatingBranch: true,
      impactBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      inputMode: "explicit_predictor_input",
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRanking: false,
      noteMentionsProxyAirborneCompanions: false,
      readyForPlannedSolver: true,
      supported: ["Ln,w", "DeltaLw"],
      unsupported: ["Rw", "Ctr"],
      warningMentionsProxyAirborne: false,
      warningMentionsPublishedLowConfidenceFit: false,
      warningMentionsUnsupportedRwCtr: true,
      warningMentionsVisibleDerivedTopology: false,
      warningMentionsWithheldClosestCandidate: false
    }
  }
] as const;

describe("reinforced concrete low-confidence follow-up origin matrix", () => {
  it.each(CASES)("$id", ({ evaluate, expected }) => {
    expect(snapshot(evaluate())).toEqual(expected);
  });

  it("keeps the reinforced follow-up provenance surface distinct from nearby formula-owned concrete corridors", () => {
    const explicitPredictor = snapshot(CASES[0].evaluate());
    const visibleDerived = snapshot(CASES[1].evaluate());
    const expandedBoardBoundary = snapshot(CASES[2].evaluate());
    const heavyFloatingFormula = snapshot(CASES[3].evaluate());

    expect(explicitPredictor.confidenceProvenance).toBe("published_family_estimate");
    expect(visibleDerived.confidenceProvenance).toBe("published_family_estimate");
    expect(visibleDerived.warningMentionsVisibleDerivedTopology).toBe(true);

    expect(expandedBoardBoundary.confidenceProvenance).toBe("formula_estimate_narrow_scope");
    expect(expandedBoardBoundary.warningMentionsWithheldClosestCandidate).toBe(true);

    expect(heavyFloatingFormula.confidenceProvenance).toBe("formula_estimate_narrow_scope");
    expect(heavyFloatingFormula.formulaNotesMentionFloatingBranch).toBe(true);
    expect(heavyFloatingFormula.readyForPlannedSolver).toBe(true);
  });
});
