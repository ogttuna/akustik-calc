import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

type DynamicResult = ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>;

type CloseoutSnapshot = {
  candidateIds: readonly string[] | null;
  companionDeltaLwFromAnnexC: boolean;
  floorRatingsBasis: string | null;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  impactDeltaLw: number | null;
  impactLnW: number | null;
  metricBasisDeltaLw: string | null;
  metricBasisLnW: string | null;
  noteMentionsLowConfidenceFallback: boolean;
  noteMentionsNearbyRowRankingSupport: boolean;
  noteMentionsPublishedFamily: boolean;
  noteMentionsProxyAirborneHonesty: boolean;
  rawEstimateNotesMentionNearbyPublishedLineage: boolean;
  rawEstimateNotesMentionCuratedLineage: boolean;
  rawImpactNotesMentionLowConfidenceFallbackRecord: boolean;
  rawImpactNotesMentionPublishedFamilyRecord: boolean;
  rw: number | null;
  rwCtr: number | null;
  supportedTargetOutputs: readonly string[];
  unsupportedTargetOutputs: readonly string[];
};

type CloseoutCase = {
  evaluate: () => DynamicResult;
  expected: CloseoutSnapshot;
  id: string;
};

function snapshot(result: DynamicResult): CloseoutSnapshot {
  const notes = result.impactSupport?.notes ?? [];
  const rawImpactNotes = result.impact?.notes ?? [];
  const rawEstimateNotes = result.floorSystemEstimate?.notes ?? [];

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    companionDeltaLwFromAnnexC: notes.some((note: string) => /same-stack Annex C style DeltaLw companion/i.test(note)),
    floorRatingsBasis: result.floorSystemRatings?.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    impactDeltaLw: result.impact?.DeltaLw ?? null,
    impactLnW: result.impact?.LnW ?? null,
    metricBasisDeltaLw: result.impact?.metricBasis?.DeltaLw ?? null,
    metricBasisLnW: result.impact?.metricBasis?.LnW ?? null,
    noteMentionsLowConfidenceFallback: notes.some(
      (note: string) => /Published floor-system low-confidence fallback is active: reinforced concrete/i.test(note)
    ),
    noteMentionsNearbyRowRankingSupport: notes.some(
      (note: string) => /Nearby-row ranking stays elastic-ceiling first, rigid-ceiling second/i.test(note)
    ),
    noteMentionsPublishedFamily: notes.some(
      (note: string) => /Published floor-system family estimate is active: reinforced concrete/i.test(note)
    ),
    noteMentionsProxyAirborneHonesty: notes.some(
      (note: string) => /proxy airborne companions from mixed nearby concrete rows/i.test(note)
    ),
    rawEstimateNotesMentionNearbyPublishedLineage: rawEstimateNotes.some(
      (note: string) => /Nearby published lineage:/i.test(note)
    ),
    rawEstimateNotesMentionCuratedLineage: rawEstimateNotes.some((note: string) => /Curated lineage:/i.test(note)),
    rawImpactNotesMentionLowConfidenceFallbackRecord: rawImpactNotes.some(
      (note: string) =>
        /This remains a low-confidence fallback built from nearby published rows, not a narrow published-family claim or an exact lab record\./i.test(
          note
        )
    ),
    rawImpactNotesMentionPublishedFamilyRecord: rawImpactNotes.some(
      (note: string) => /This remains a labeled published-family estimate, not an exact lab record\./i.test(note)
    ),
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

const CASES: readonly CloseoutCase[] = [
  {
    id: "bare reinforced concrete remains formula-owned",
    evaluate: () =>
      calculateAssembly([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }], {
        targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      impactDeltaLw: null,
      impactLnW: 74.5,
      metricBasisDeltaLw: null,
      metricBasisLnW: "predictor_bare_massive_floor_iso12354_annexc_estimate",
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 57,
      rwCtr: 50.8,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "heavy floating laminate stack remains formula-owned",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
          { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      impactDeltaLw: 6,
      impactLnW: 65.8,
      metricBasisDeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      metricBasisLnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 60,
      rwCtr: 53.6,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "published heavy-concrete wet package keeps LnW on family with DeltaLw companion on formula",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: ["regupol_curve8_concrete_tile_lab_2026"],
      companionDeltaLwFromAnnexC: true,
      floorRatingsBasis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      floorSystemEstimateKind: "family_general",
      impactBasis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      impactDeltaLw: 24.3,
      impactLnW: 50,
      metricBasisDeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      metricBasisLnW: "predictor_heavy_concrete_published_upper_treatment_estimate",
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: true,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 58,
      rwCtr: -6.7,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "combined wet elastic ceiling parks impact until reinforced-concrete formula owners are complete",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 65 },
          { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: null,
      impactDeltaLw: null,
      impactLnW: null,
      metricBasisDeltaLw: null,
      metricBasisLnW: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 61,
      rwCtr: 55,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
    }
  },
  {
    id: "carpet archetype parks impact until reinforced-concrete formula owners are complete",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 165,
            densityKgM3: 2400
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "carpet_with_foam_underlay",
            thicknessMm: 11,
            densityKgM3: 320
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 110,
            cavityFillThicknessMm: 60,
            boardLayerCount: 2,
            boardThicknessMm: 13,
            boardMaterialClass: "firestop_board"
          }
        },
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: null,
      impactDeltaLw: null,
      impactLnW: null,
      metricBasisDeltaLw: null,
      metricBasisLnW: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 59,
      rwCtr: 53.2,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    }
  },
  {
    id: "carpet plus extra generic underlay parks impact until reinforced-concrete formula owners are complete",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 165,
            densityKgM3: 2400
          },
          resilientLayer: {
            thicknessMm: 5
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "carpet_with_foam_underlay",
            thicknessMm: 11,
            densityKgM3: 320
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 110,
            cavityFillThicknessMm: 60,
            boardLayerCount: 2,
            boardThicknessMm: 13,
            boardMaterialClass: "firestop_board"
          }
        },
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: null,
      impactDeltaLw: null,
      impactLnW: null,
      metricBasisDeltaLw: null,
      metricBasisLnW: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 59,
      rwCtr: 53.2,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    }
  },
  {
    id: "timber-underlay archetype keeps airborne screening but parks impact owners",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 165 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 5 },
          { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: 18 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 110 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 60 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 }
        ],
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: null,
      impactDeltaLw: null,
      impactLnW: null,
      metricBasisDeltaLw: null,
      metricBasisLnW: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 60,
      rwCtr: 53.5,
      supportedTargetOutputs: ["Rw", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
    }
  },
  {
    id: "vinyl plus elastic ceiling parks the old low-confidence branch",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 180,
            densityKgM3: 2400
          },
          resilientLayer: {
            thicknessMm: 8,
            dynamicStiffnessMNm3: 35
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "vinyl_flooring",
            thicknessMm: 3,
            densityKgM3: 1400
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        targetOutputs: ["Rw", "Ctr", "Ln,w"]
      }),
    expected: {
      candidateIds: null,
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorSystemEstimateKind: null,
      impactBasis: null,
      impactDeltaLw: null,
      impactLnW: null,
      metricBasisDeltaLw: null,
      metricBasisLnW: null,
      noteMentionsLowConfidenceFallback: false,
      noteMentionsNearbyRowRankingSupport: false,
      noteMentionsPublishedFamily: false,
      noteMentionsProxyAirborneHonesty: false,
      rawEstimateNotesMentionNearbyPublishedLineage: false,
      rawEstimateNotesMentionCuratedLineage: false,
      rawImpactNotesMentionLowConfidenceFallbackRecord: false,
      rawImpactNotesMentionPublishedFamilyRecord: false,
      rw: 60,
      rwCtr: 53.8,
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["Rw", "Ctr", "Ln,w"]
    }
  }
];

describe("reinforced concrete formula vs family closeout audit", () => {
  for (const auditCase of CASES) {
    it(auditCase.id, () => {
      expect(snapshot(auditCase.evaluate())).toEqual(auditCase.expected);
    });
  }
});
