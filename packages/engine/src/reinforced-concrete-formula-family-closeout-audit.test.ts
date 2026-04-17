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
  noteMentionsPublishedFamily: boolean;
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
    noteMentionsPublishedFamily: notes.some(
      (note: string) => /Published floor-system family estimate is active: reinforced concrete/i.test(note)
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
      noteMentionsPublishedFamily: false,
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
      noteMentionsPublishedFamily: false,
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
      noteMentionsPublishedFamily: true,
      rw: 58,
      rwCtr: -6.7,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "combined wet elastic ceiling keeps family LnW with Annex C DeltaLw companion",
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
      candidateIds: ["euracoustics_f2_elastic_ceiling_concrete_lab_2026"],
      companionDeltaLwFromAnnexC: true,
      floorRatingsBasis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      floorSystemEstimateKind: "family_general",
      impactBasis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      impactDeltaLw: 26.7,
      impactLnW: 43,
      metricBasisDeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      metricBasisLnW: "predictor_heavy_concrete_published_upper_treatment_estimate",
      noteMentionsPublishedFamily: true,
      rw: 77,
      rwCtr: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "timber-underlay archetype keeps DeltaLw unsupported",
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
      candidateIds: ["knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"],
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "predictor_floor_system_family_archetype_estimate",
      floorSystemEstimateKind: "family_archetype",
      impactBasis: "predictor_floor_system_family_archetype_estimate",
      impactDeltaLw: null,
      impactLnW: 51,
      metricBasisDeltaLw: null,
      metricBasisLnW: "predictor_floor_system_family_archetype_estimate",
      noteMentionsPublishedFamily: true,
      rw: 63,
      rwCtr: 57,
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "vinyl plus elastic ceiling remains low-confidence",
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
      candidateIds: [
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
        "knauf_cc60_1a_concrete150_carpet_lab_2026",
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "euracoustics_f0_bare_concrete_lab_2026",
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
      ],
      companionDeltaLwFromAnnexC: false,
      floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      impactDeltaLw: null,
      impactLnW: 50,
      metricBasisDeltaLw: null,
      metricBasisLnW: "predictor_floor_system_low_confidence_estimate",
      noteMentionsPublishedFamily: true,
      rw: 65.9,
      rwCtr: 57,
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
      unsupportedTargetOutputs: []
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
