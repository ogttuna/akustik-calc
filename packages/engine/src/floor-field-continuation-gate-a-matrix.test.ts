import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type ContextKind = "building" | "field" | "lab";

type OriginSnapshot = {
  boundFloorSystemMatchId: string | null;
  candidateIds: readonly string[] | null;
  floorRatingsBasis: string | null;
  floorSystemMatchId: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  systemEstimateKind: string | null;
};

type ContinuationValues = {
  deltaLw: number | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  rwDb: number | null;
  rwPrimeDb: number | null;
};

type ContextSnapshot = {
  origin: OriginSnapshot;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: ContinuationValues;
};

type GateACase = {
  expected: Record<ContextKind, ContextSnapshot>;
  id: string;
  layers: readonly LayerInput[];
};

const FLOOR_CONTINUATION_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const UBIQ_EXACT_OPEN_WEB_200_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
];

const KNAUF_ACOUSTIC_TIMBER_EXACT_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "base_structure", materialId: "timber_joist_floor", thicknessMm: 240 }
];

const DATAHOLZ_CLT_DRY_EXACT_LAYERS: readonly LayerInput[] = [
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 30 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
];

const REINFORCED_CONCRETE_LOW_CONFIDENCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
];

const RAW_TERMINAL_CONCRETE_HELPER_LAYERS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "concrete", thicknessMm: 160 }
];

const RAW_BARE_OPEN_WEB_BLOCKED_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

function makeOrigin(input: OriginSnapshot): OriginSnapshot {
  return input;
}

function snapshot(layers: readonly LayerInput[], context: ContextKind): ContextSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: context === "lab" ? null : context === "field" ? FIELD_CONTEXT : BUILDING_CONTEXT,
    impactFieldContext: context === "building" ? BUILDING_IMPACT_CONTEXT : null,
    targetOutputs: FLOOR_CONTINUATION_OUTPUTS
  });

  return {
    origin: {
      boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
      candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
      floorRatingsBasis: result.floorSystemRatings?.basis ?? null,
      floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
      impactBasis: result.impact?.basis ?? null,
      lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
      systemEstimateKind: result.floorSystemEstimate?.kind ?? null
    },
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    values: {
      deltaLw: result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTA: result.metrics.estimatedDnTADb ?? null,
      dnTw: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null
    }
  };
}

const EXACT_LAB_FIELD_UNSUPPORTED = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const FIELD_WITHOUT_VOLUME_UNSUPPORTED = [
  "DnT,w",
  "DnT,A",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const LOW_CONFIDENCE_CANDIDATE_IDS = [
  "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
] as const;

const CASES: readonly GateACase[] = [
  {
    id: "ubiq exact supported-band open-web row",
    layers: UBIQ_EXACT_OPEN_WEB_200_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ln,w+CI", "Ctr"],
        unsupported: EXACT_LAB_FIELD_UNSUPPORTED,
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 52,
          lnWPlusCI: 51,
          rw: 63,
          rwDb: 70.7,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ln,w+CI", "Ctr"],
        unsupported: FIELD_WITHOUT_VOLUME_UNSUPPORTED,
        values: {
          deltaLw: null,
          dnA: 66,
          dnTA: null,
          dnTw: null,
          dnW: 67,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 52,
          lnWPlusCI: 51,
          rw: 63,
          rwDb: 68.7,
          rwPrimeDb: 68
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_local_guide",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        unsupported: ["DeltaLw"],
        values: {
          deltaLw: null,
          dnA: 66,
          dnTA: 68.5,
          dnTw: 70,
          dnW: 67,
          lPrimeNT50: 52,
          lPrimeNTw: 52.2,
          lPrimeNW: 55,
          lnW: 52,
          lnWPlusCI: 51,
          rw: 63,
          rwDb: 68.7,
          rwPrimeDb: 68
        }
      }
    }
  },
  {
    id: "knauf acoustic timber exact row",
    layers: KNAUF_ACOUSTIC_TIMBER_EXACT_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 61,
          lnWPlusCI: null,
          rw: 60,
          rwDb: 45.9,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 42,
          dnTA: null,
          dnTw: null,
          dnW: 43,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 61,
          lnWPlusCI: null,
          rw: 60,
          rwDb: 43.9,
          rwPrimeDb: 44
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "knauf_ct120_1c_timber_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 42,
          dnTA: 44.5,
          dnTw: 46,
          dnW: 43,
          lPrimeNT50: null,
          lPrimeNTw: 61.2,
          lPrimeNW: 64,
          lnW: 61,
          lnWPlusCI: null,
          rw: 60,
          rwDb: 43.9,
          rwPrimeDb: 44
        }
      }
    }
  },
  {
    id: "dataholz CLT dry exact row",
    layers: DATAHOLZ_CLT_DRY_EXACT_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ln,w+CI"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 50,
          lnWPlusCI: 49,
          rw: 62,
          rwDb: 47.5,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "official_floor_system_exact_match",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ln,w+CI"],
        unsupported: ["DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
        values: {
          deltaLw: null,
          dnA: 43.7,
          dnTA: null,
          dnTw: null,
          dnW: 45,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 50,
          lnWPlusCI: 49,
          rw: 62,
          rwDb: 45.5,
          rwPrimeDb: 46
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "official_floor_system_exact_match",
          floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
          impactBasis: "mixed_exact_plus_estimated_local_guide",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
        unsupported: ["DeltaLw", "Ctr"],
        values: {
          deltaLw: null,
          dnA: 43.7,
          dnTA: 46.2,
          dnTw: 47,
          dnW: 45,
          lPrimeNT50: 50,
          lPrimeNTw: 50.2,
          lPrimeNW: 53,
          lnW: 50,
          lnWPlusCI: 49,
          rw: 62,
          rwDb: 45.5,
          rwPrimeDb: 46
        }
      }
    }
  },
  {
    id: "reinforced concrete low-confidence formula row",
    layers: REINFORCED_CONCRETE_LOW_CONFIDENCE_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "predictor_floor_system_low_confidence_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 50,
          lnWPlusCI: null,
          rw: 65.9,
          rwDb: 60.3,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "predictor_floor_system_low_confidence_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 55.7,
          dnTA: null,
          dnTw: null,
          dnW: 57,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 50,
          lnWPlusCI: null,
          rw: 65.9,
          rwDb: 58.3,
          rwPrimeDb: 58
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
          floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
          floorSystemMatchId: null,
          impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: "low_confidence"
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 55.7,
          dnTA: 58.2,
          dnTw: 59,
          dnW: 57,
          lPrimeNT50: null,
          lPrimeNTw: 50.2,
          lPrimeNW: 53,
          lnW: 50,
          lnWPlusCI: null,
          rw: 65.9,
          rwDb: 58.3,
          rwPrimeDb: 58
        }
      }
    }
  },
  {
    id: "raw terminal concrete helper row",
    layers: RAW_TERMINAL_CONCRETE_HELPER_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ln,w", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 72.7,
          lnWPlusCI: null,
          rw: 59,
          rwDb: 59.1,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ctr"],
        unsupported: ["DnT,w", "DnT,A", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 55.3,
          dnTA: null,
          dnTw: null,
          dnW: 56,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: 72.7,
          lnWPlusCI: null,
          rw: 57,
          rwDb: 57.1,
          rwPrimeDb: 57
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
        unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 55.3,
          dnTA: 57.8,
          dnTw: 59,
          dnW: 56,
          lPrimeNT50: null,
          lPrimeNTw: 72.9,
          lPrimeNW: 75.7,
          lnW: 72.7,
          lnWPlusCI: null,
          rw: 57,
          rwDb: 57.1,
          rwPrimeDb: 57
        }
      }
    }
  },
  {
    id: "raw bare open-web blocked impact representative",
    layers: RAW_BARE_OPEN_WEB_BLOCKED_LAYERS,
    expected: {
      lab: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["Rw", "Ctr"],
        unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: null,
          dnTA: null,
          dnTw: null,
          dnW: null,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: null,
          lnWPlusCI: null,
          rw: 72,
          rwDb: 72.1,
          rwPrimeDb: null
        }
      },
      field: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["R'w", "Dn,w", "Dn,A", "Ctr"],
        unsupported: ["Rw", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 67.5,
          dnTA: null,
          dnTw: null,
          dnW: 69,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: null,
          lnWPlusCI: null,
          rw: 70,
          rwDb: 70.1,
          rwPrimeDb: 70
        }
      },
      building: {
        origin: makeOrigin({
          boundFloorSystemMatchId: null,
          candidateIds: null,
          floorRatingsBasis: "screening_mass_law_curve_seed_v3",
          floorSystemMatchId: null,
          impactBasis: null,
          lowerBoundBasis: null,
          systemEstimateKind: null
        }),
        supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ctr"],
        unsupported: ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
        values: {
          deltaLw: null,
          dnA: 67.5,
          dnTA: 70,
          dnTw: 71,
          dnW: 69,
          lPrimeNT50: null,
          lPrimeNTw: null,
          lPrimeNW: null,
          lnW: null,
          lnWPlusCI: null,
          rw: 70,
          rwDb: 70.1,
          rwPrimeDb: 70
        }
      }
    }
  }
];

describe("floor field continuation Gate A matrix", () => {
  it("pins lab, field, and building continuation origins, support, and values before any runtime widening", () => {
    for (const testCase of CASES) {
      for (const context of ["lab", "field", "building"] as const) {
        expect(snapshot(testCase.layers, context), `${testCase.id} ${context}`).toEqual(testCase.expected[context]);
      }
    }
  });

  it("keeps the missing-input progression explicit for field airborne and field impact outputs", () => {
    for (const testCase of CASES) {
      const lab = snapshot(testCase.layers, "lab");
      const field = snapshot(testCase.layers, "field");
      const building = snapshot(testCase.layers, "building");

      expect(lab.unsupported).toEqual(expect.arrayContaining(["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]));
      expect(field.supported).toEqual(expect.arrayContaining(["R'w", "Dn,w", "Dn,A"]));
      expect(field.unsupported).toEqual(expect.arrayContaining(["DnT,w", "DnT,A"]));

      if (building.supported.includes("Ln,w")) {
        expect(building.supported).toEqual(expect.arrayContaining(["L'n,w", "L'nT,w"]));
      } else {
        expect(building.unsupported).toEqual(expect.arrayContaining(["Ln,w", "L'n,w", "L'nT,w"]));
      }
    }
  });
});
