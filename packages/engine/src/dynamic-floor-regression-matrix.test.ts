import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

type DynamicResult = ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>;

type RouteSnapshot = {
  boundFloorSystemEstimateKind: string | null;
  boundFloorSystemMatchId: string | null;
  catalogId: string | null;
  estimateTier: string | null;
  evidenceTier: string | null;
  floorRatingsBasis: string | null;
  floorRw: number | null;
  floorRwCtr: number | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  impactBasis: string | null;
  impactCI: number | null;
  impactCI50_2500: number | null;
  impactDeltaLw: number | null;
  impactLnW: number | null;
  impactLnWPlusCI: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lowerBoundBasis: string | null;
  lowerBoundDeltaLw: number | null;
  lowerBoundLPrimeNTw: number | null;
  lowerBoundLPrimeNW: number | null;
  lowerBoundLnW: number | null;
  selectionKind: string | null;
  sourceMode: string | null;
  supportedImpactOutputs: readonly string[];
  supportedTargetOutputs: readonly string[];
  systemType: string | null;
  unsupportedImpactOutputs: readonly string[];
  unsupportedTargetOutputs: readonly string[];
};

type MatrixCase = {
  evaluate: () => DynamicResult;
  expected: RouteSnapshot;
  id: string;
};

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

function routeSnapshot(result: DynamicResult): RouteSnapshot {
  const value = result as DynamicResult & {
    sourceMode?: string;
  };

  return {
    boundFloorSystemEstimateKind: value.boundFloorSystemEstimate?.kind ?? null,
    boundFloorSystemMatchId: value.boundFloorSystemMatch?.system.id ?? null,
    catalogId: value.impactCatalogMatch?.catalog.id ?? null,
    estimateTier: value.dynamicImpactTrace?.estimateTier ?? null,
    evidenceTier: value.dynamicImpactTrace?.evidenceTier ?? null,
    floorRatingsBasis: value.floorSystemRatings?.basis ?? null,
    floorRw: value.floorSystemRatings?.Rw ?? value.floorCarrier?.Rw ?? null,
    floorRwCtr: value.floorSystemRatings?.RwCtr ?? value.floorCarrier?.RwCtr ?? null,
    floorSystemEstimateBasis: value.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: value.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: value.floorSystemMatch?.system.id ?? null,
    impactBasis: value.impact?.basis ?? null,
    impactCI: value.impact?.CI ?? null,
    impactCI50_2500: value.impact?.CI50_2500 ?? null,
    impactDeltaLw: value.impact?.DeltaLw ?? null,
    impactLnW: value.impact?.LnW ?? null,
    impactLnWPlusCI: value.impact?.LnWPlusCI ?? null,
    lPrimeNT50: value.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: value.impact?.LPrimeNTw ?? null,
    lPrimeNW: value.impact?.LPrimeNW ?? null,
    lowerBoundBasis: value.lowerBoundImpact?.basis ?? null,
    lowerBoundDeltaLw: value.lowerBoundImpact?.DeltaLwLowerBound ?? null,
    lowerBoundLPrimeNTw: value.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lowerBoundLPrimeNW: value.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lowerBoundLnW: value.lowerBoundImpact?.LnWUpperBound ?? null,
    selectionKind: value.dynamicImpactTrace?.selectionKind ?? null,
    sourceMode: value.sourceMode ?? null,
    supportedImpactOutputs: value.supportedImpactOutputs,
    supportedTargetOutputs: value.supportedTargetOutputs,
    systemType: value.dynamicImpactTrace?.systemType ?? null,
    unsupportedImpactOutputs: value.unsupportedImpactOutputs,
    unsupportedTargetOutputs: value.unsupportedTargetOutputs
  };
}

const CASES: readonly MatrixCase[] = [
  {
    id: "assembly exact floor-system lane",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
          { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
          { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: null,
      evidenceTier: "exact",
      floorRatingsBasis: "open_measured_floor_system_exact_match",
      floorRw: 38,
      floorRwCtr: 37.242344245020725,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "tuas_x2_clt140_measured_2026",
      impactBasis: "open_measured_floor_system_exact_match",
      impactCI: 2,
      impactCI50_2500: 3,
      impactDeltaLw: null,
      impactLnW: 61,
      impactLnWPlusCI: 63,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "exact_floor_system",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      systemType: "bare_floor",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "assembly bound floor-system lane",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
          { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
          { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
          { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
        ],
        {
          impactFieldContext: FIELD_CONTEXT,
          targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "IIC"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: "ubiq_fl33_open_web_steel_300_lab_2026",
      catalogId: null,
      estimateTier: null,
      evidenceTier: "bound",
      floorRatingsBasis: "official_floor_system_bound_support",
      floorRw: 63,
      floorRwCtr: 58,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: null,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: 51,
      lowerBoundLPrimeNW: 53,
      lowerBoundLnW: 51,
      selectionKind: "bound_floor_system",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w", "L'n,w", "L'nT,w"],
      supportedTargetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      systemType: "combined_upper_lower_system",
      unsupportedImpactOutputs: ["IIC"],
      unsupportedTargetOutputs: ["IIC"]
    }
  },
  {
    id: "assembly official catalog exact lane",
    evaluate: () =>
      calculateAssembly(
        [
          { materialId: "gypsum_board", thicknessMm: 12.5 },
          { materialId: "air_gap", thicknessMm: 90 },
          { materialId: "glasswool", thicknessMm: 90 },
          { materialId: "gypsum_board", thicknessMm: 12.5 }
        ],
        {
          calculator: "dynamic",
          impactPredictorInput: {
            impactSystemType: "heavy_floating_floor",
            referenceFloorType: "heavy_standard",
            baseSlab: {
              materialClass: "heavy_concrete",
              thicknessMm: 150,
              densityKgM3: 2400
            },
            resilientLayer: {
              productId: "regupol_sonus_curve_8",
              thicknessMm: 8
            },
            floatingScreed: {
              materialClass: "generic_screed",
              thicknessMm: 30,
              densityKgM3: 2000
            },
            floorCovering: {
              mode: "material_layer",
              materialClass: "ceramic_tile",
              thicknessMm: 8,
              densityKgM3: 2000
            }
          },
          targetOutputs: ["Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: "regupol_sonus_curve_8_tile_match_2026",
      estimateTier: null,
      evidenceTier: "exact",
      floorRatingsBasis: "predictor_catalog_exact_match_official",
      floorRw: 60,
      floorRwCtr: 53.7,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: "predictor_catalog_exact_match_official",
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: 26,
      impactLnW: 50,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "official_catalog",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w", "DeltaLw"],
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      systemType: "heavy_floating_floor",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "assembly narrow formula lane",
    evaluate: () =>
      calculateAssembly([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }], {
        targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: null,
      evidenceTier: "estimate",
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      floorRw: 57,
      floorRwCtr: 50.8,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 74.5,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "formula_estimate",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Rw", "Ln,w"],
      systemType: "bare_floor",
      unsupportedImpactOutputs: ["DeltaLw"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "assembly family archetype estimate lane",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
          { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
          { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
          { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
          { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 220 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "family_archetype",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_family_archetype_estimate",
      floorRw: 62.5,
      floorRwCtr: -11.4,
      floorSystemEstimateBasis: "predictor_floor_system_family_archetype_estimate",
      floorSystemEstimateKind: "family_archetype",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_family_archetype_estimate",
      impactCI: 2,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 57.9,
      impactLnWPlusCI: 59.9,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Rw", "Ln,w"],
      systemType: "combined_upper_lower_system",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "assembly family general estimate lane",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
          { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
          { floorRole: "base_structure", materialId: "lightweight_concrete", thicknessMm: 150 }
        ],
        {
          targetOutputs: ["Rw", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "family_general",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_family_general_estimate",
      floorRw: 53,
      floorRwCtr: 47.5,
      floorSystemEstimateBasis: "predictor_floor_system_family_general_estimate",
      floorSystemEstimateKind: "family_general",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_family_general_estimate",
      impactCI: 2,
      impactCI50_2500: 5,
      impactDeltaLw: null,
      impactLnW: 64.3,
      impactLnWPlusCI: 49,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Rw", "Ln,w"],
      systemType: "heavy_floating_floor",
      unsupportedImpactOutputs: ["DeltaLw"],
      unsupportedTargetOutputs: ["DeltaLw"]
    }
  },
  {
    id: "assembly low-confidence estimate lane",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 9 },
          { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
        ],
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
        }
      ),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
      floorRw: 51.6,
      floorRwCtr: 31.1,
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      impactCI: 2,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 61.3,
      impactLnWPlusCI: 63.3,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: null,
      supportedImpactOutputs: ["Ln,w", "CI", "Ln,w+CI"],
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      systemType: "bare_floor",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "impact-only exact floor-system lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactFieldContext: FIELD_CONTEXT,
        officialFloorSystemId: "dataholz_gdrnxa11a_timber_frame_lab_2026",
        targetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: null,
      evidenceTier: "exact",
      floorRatingsBasis: "official_floor_system_exact_match",
      floorRw: 83,
      floorRwCtr: -17,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "dataholz_gdrnxa11a_timber_frame_lab_2026",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      impactCI: 2,
      impactCI50_2500: 14,
      impactDeltaLw: null,
      impactLnW: 42,
      impactLnWPlusCI: 44,
      lPrimeNT50: 56,
      lPrimeNTw: 42,
      lPrimeNW: 44,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "exact_floor_system",
      sourceMode: "official_floor_system",
      supportedImpactOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      supportedTargetOutputs: ["Rw", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      systemType: null,
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "impact-only bound floor-system lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactFieldContext: FIELD_CONTEXT,
        officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
        targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: "ubiq_fl32_steel_200_lab_2026",
      catalogId: null,
      estimateTier: null,
      evidenceTier: "bound",
      floorRatingsBasis: "official_floor_system_bound_support",
      floorRw: 62,
      floorRwCtr: 56,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: null,
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: null,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: 53,
      lowerBoundLPrimeNW: 55,
      lowerBoundLnW: 53,
      selectionKind: "bound_floor_system",
      sourceMode: "official_floor_system",
      supportedImpactOutputs: [],
      supportedTargetOutputs: ["Rw"],
      systemType: null,
      unsupportedImpactOutputs: ["Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: ["Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "impact-only official catalog exact lane",
    evaluate: () =>
      calculateImpactOnly([], {
        officialImpactCatalogId: "regupol_sonus_curve_8_tile_match_2026",
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: "regupol_sonus_curve_8_tile_match_2026",
      estimateTier: null,
      evidenceTier: "exact",
      floorRatingsBasis: null,
      floorRw: null,
      floorRwCtr: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: "predictor_catalog_exact_match_official",
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: 26,
      impactLnW: 50,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "official_catalog",
      sourceMode: "official_product_catalog",
      supportedImpactOutputs: ["Ln,w", "DeltaLw"],
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      systemType: null,
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "impact-only narrow formula lane",
    evaluate: () =>
      calculateImpactOnly([{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }], {
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: null,
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_heavy_concrete_floor_airborne_companion_estimate",
      floorRw: 57,
      floorRwCtr: 50.8,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 74.5,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "formula_estimate",
      sourceMode: "visible_stack",
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Ln,w"],
      systemType: "bare_floor",
      unsupportedImpactOutputs: ["DeltaLw"],
      unsupportedTargetOutputs: ["Rw", "Ctr", "DeltaLw"]
    }
  },
  {
    id: "impact-only family archetype estimate lane",
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
            materialClass: "engineered_timber_with_acoustic_underlay",
            thicknessMm: 18,
            densityKgM3: 900
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
        targetOutputs: ["Ln,w", "Rw", "Ctr"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "family_archetype",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_family_archetype_estimate",
      floorRw: 63,
      floorRwCtr: 57,
      floorSystemEstimateBasis: "predictor_floor_system_family_archetype_estimate",
      floorSystemEstimateKind: "family_archetype",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_family_archetype_estimate",
      impactCI: null,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 51,
      impactLnWPlusCI: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: "predictor_input",
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Ln,w", "Rw", "Ctr"],
      systemType: "combined_upper_lower_system",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "impact-only family general estimate lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "heavy_floating_floor",
          referenceFloorType: "heavy_standard",
          baseSlab: {
            materialClass: "heavy_concrete",
            thicknessMm: 150,
            densityKgM3: 1200
          },
          resilientLayer: {
            dynamicStiffnessMNm3: 10,
            thicknessMm: 8
          },
          floatingScreed: {
            materialClass: "generic_screed",
            thicknessMm: 50,
            densityKgM3: 2000
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "ceramic_tile",
            thicknessMm: 8,
            densityKgM3: 2000
          }
        },
        targetOutputs: ["Ln,w", "Rw"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "family_general",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_family_general_estimate",
      floorRw: 53,
      floorRwCtr: 47.5,
      floorSystemEstimateBasis: "predictor_floor_system_family_general_estimate",
      floorSystemEstimateKind: "family_general",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_family_general_estimate",
      impactCI: 2,
      impactCI50_2500: 5,
      impactDeltaLw: null,
      impactLnW: 64.3,
      impactLnWPlusCI: 49,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: "predictor_input",
      supportedImpactOutputs: ["Ln,w"],
      supportedTargetOutputs: ["Ln,w", "Rw"],
      systemType: "heavy_floating_floor",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "impact-only low-confidence estimate lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "timber_joists",
          impactSystemType: "bare_floor",
          baseSlab: {
            thicknessMm: 240
          },
          floorCovering: {
            mode: "material_layer",
            materialClass: "laminate_flooring",
            thicknessMm: 9,
            densityKgM3: 850
          }
        },
        targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"]
      }),
    expected: {
      boundFloorSystemEstimateKind: null,
      boundFloorSystemMatchId: null,
      catalogId: null,
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
      floorRw: 51.6,
      floorRwCtr: 31.1,
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      floorSystemMatchId: null,
      impactBasis: "predictor_floor_system_low_confidence_estimate",
      impactCI: 2,
      impactCI50_2500: null,
      impactDeltaLw: null,
      impactLnW: 61.3,
      impactLnWPlusCI: 63.3,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lowerBoundBasis: null,
      lowerBoundDeltaLw: null,
      lowerBoundLPrimeNTw: null,
      lowerBoundLPrimeNW: null,
      lowerBoundLnW: null,
      selectionKind: "family_estimate",
      sourceMode: "predictor_input",
      supportedImpactOutputs: ["Ln,w", "CI", "Ln,w+CI"],
      supportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
      systemType: "bare_floor",
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: []
    }
  }
];

describe("dynamic floor regression matrix", () => {
  it.each(CASES)("$id", ({ evaluate, expected }) => {
    expect(routeSnapshot(evaluate())).toEqual(expected);
  });

  it("keeps conservative bound support intentionally different on assembly and impact-only surfaces", () => {
    const assembly = routeSnapshot(
      calculateAssembly(
        [
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
          { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
          { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
          { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
        ],
        {
          impactFieldContext: FIELD_CONTEXT,
          targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
        }
      )
    );
    const impactOnly = routeSnapshot(
      calculateImpactOnly([], {
        impactFieldContext: FIELD_CONTEXT,
        officialFloorSystemId: "ubiq_fl32_steel_200_lab_2026",
        targetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
      })
    );

    expect(assembly.selectionKind).toBe("bound_floor_system");
    expect(impactOnly.selectionKind).toBe("bound_floor_system");
    expect(assembly.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(impactOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(assembly.unsupportedTargetOutputs).toEqual([]);
    expect(impactOnly.unsupportedTargetOutputs).toEqual(["Ln,w", "L'n,w", "L'nT,w"]);
  });
});
