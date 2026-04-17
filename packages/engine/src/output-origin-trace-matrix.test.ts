import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type OriginKind =
  | "bound_only_source"
  | "dynamic_airborne_formula"
  | "exact_floor_source"
  | "field_airborne_needs_geometry"
  | "formula_screening_with_field_impact"
  | "source_family_estimate"
  | "unsupported_impact_fail_closed";

type OriginSnapshot = {
  boundFloorSystemMatchId: string | null;
  calculatorId: string | null;
  candidateIds: readonly string[] | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  method: string;
  origin: OriginKind;
  supported: readonly RequestedOutputId[];
  supportedImpact: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  unsupportedImpact: readonly RequestedOutputId[];
  values: {
    c: number | null;
    ctr: number | null;
    dnA: number | null;
    dnTADb: number | null;
    dnTwDb: number | null;
    dnW: number | null;
    lPrimeNTw: number | null;
    lPrimeNW: number | null;
    lnW: number | null;
    rw: number | null;
    rwDb: number | null;
    rwPrimeDb: number | null;
    stc: number | null;
  };
};

type OriginCase = {
  airborneContext?: AirborneContext | null;
  calculator?: "dynamic" | null;
  expected: OriginSnapshot;
  id: string;
  impactFieldContext?: ImpactFieldContext | null;
  layers: readonly LayerInput[];
  origin: OriginKind;
  targetOutputs: readonly RequestedOutputId[];
};

const FLOOR_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50", "Ctr"] as const;
const RAW_FIELD_OUTPUTS = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"] as const;
const BOUND_FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI"] as const;
const WALL_OUTPUTS = ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"] as const;

const AIRBORNE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const AIRBORNE_PARTIAL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const RAW_AIRBORNE_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

const RAW_IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const EXACT_DRY_CLT_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 },
  { floorRole: "resilient_layer", materialId: "mw_t_40_impact_layer", thicknessMm: 30 },
  { floorRole: "upper_fill", materialId: "elastic_bonded_fill", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 }
];

const DATAHOLZ_GDMTXA04A_VISIBLE_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
];

const RAW_CONCRETE_HELPER_LAYERS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "concrete", thicknessMm: 160 }
];

const UBIQ_BOUND_OPEN_WEB_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const STEEL_JOIST_FAIL_CLOSED_LAYERS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 13 },
  { materialId: "steel_joist_floor", thicknessMm: 250 }
];

const WALL_DYNAMIC_LAYERS: readonly LayerInput[] = [
  { materialId: "concrete", thicknessMm: 160 },
  { materialId: "rockwool", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const CASES: readonly OriginCase[] = [
  {
    id: "exact floor source owns floor companions and impact, while live airborne screening stays separate",
    layers: EXACT_DRY_CLT_LAYERS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    origin: "exact_floor_source",
    targetOutputs: FLOOR_FIELD_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "dataholz_gdmtxn01_dry_clt_lab_2026",
      floorSystemRatingsBasis: "official_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lowerBoundBasis: null,
      method: "screening_mass_law_curve_seed_v3",
      origin: "exact_floor_source",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      supportedImpact: ["Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      unsupported: ["R'w", "DnT,w", "Ctr"],
      unsupportedImpact: [],
      values: {
        c: -1.4,
        ctr: -6.2,
        dnA: null,
        dnTADb: null,
        dnTwDb: null,
        dnW: null,
        lPrimeNTw: 50,
        lPrimeNW: 52,
        lnW: 50,
        rw: 62,
        rwDb: 47.5,
        rwPrimeDb: null,
        stc: 48
      }
    }
  },
  {
    id: "source-family estimate keeps GDMTXA04A visible route estimate-backed instead of exact",
    layers: DATAHOLZ_GDMTXA04A_VISIBLE_LAYERS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    origin: "source_family_estimate",
    targetOutputs: FLOOR_FIELD_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
      floorSystemEstimateBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      floorSystemEstimateKind: "family_general",
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      impactBasis: "mixed_predicted_plus_estimated_local_guide",
      lowerBoundBasis: null,
      method: "screening_mass_law_curve_seed_v3",
      origin: "source_family_estimate",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      supportedImpact: ["Ln,w", "L'n,w", "L'nT,w", "Ln,w+CI", "L'nT,50"],
      unsupported: ["R'w", "DnT,w", "Ctr"],
      unsupportedImpact: [],
      values: {
        c: -0.8,
        ctr: -5.7,
        dnA: null,
        dnTADb: null,
        dnTwDb: null,
        dnW: null,
        lPrimeNTw: 49,
        lPrimeNW: 51,
        lnW: 49,
        rw: 65,
        rwDb: 50.2,
        rwPrimeDb: null,
        stc: 50
      }
    }
  },
  {
    id: "raw terminal concrete helper is formula/predictor-backed with live field cards",
    layers: RAW_CONCRETE_HELPER_LAYERS,
    airborneContext: RAW_AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: RAW_IMPACT_FIELD_CONTEXT,
    origin: "formula_screening_with_field_impact",
    targetOutputs: RAW_FIELD_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lowerBoundBasis: null,
      method: "screening_mass_law_curve_seed_v3",
      origin: "formula_screening_with_field_impact",
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      supportedImpact: ["Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      unsupportedImpact: [],
      values: {
        c: -0.7,
        ctr: -5.4,
        dnA: 56.8,
        dnTADb: 59.2,
        dnTwDb: 60,
        dnW: 58,
        lPrimeNTw: 72.3,
        lPrimeNW: 74.7,
        lnW: 72.7,
        rw: 57,
        rwDb: 57.1,
        rwPrimeDb: 57,
        stc: 57
      }
    }
  },
  {
    id: "bound-only floor row exposes conservative upper bounds without exact impact",
    layers: UBIQ_BOUND_OPEN_WEB_LAYERS,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    origin: "bound_only_source",
    targetOutputs: BOUND_FIELD_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: "ubiq_fl33_open_web_steel_300_lab_2026",
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "official_floor_system_bound_support",
      impactBasis: null,
      lowerBoundBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      method: "screening_mass_law_curve_seed_v3",
      origin: "bound_only_source",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      supportedImpact: ["Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Ln,w+CI"],
      unsupportedImpact: ["Ln,w+CI"],
      values: {
        c: -1.6,
        ctr: -6.5,
        dnA: null,
        dnTADb: null,
        dnTwDb: null,
        dnW: null,
        lPrimeNTw: 51,
        lPrimeNW: 53,
        lnW: 51,
        rw: 63,
        rwDb: 73.8,
        rwPrimeDb: null,
        stc: 74
      }
    }
  },
  {
    id: "dynamic wall airborne route owns apparent and level-difference outputs",
    layers: WALL_DYNAMIC_LAYERS,
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    calculator: "dynamic",
    origin: "dynamic_airborne_formula",
    targetOutputs: WALL_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: "dynamic",
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lowerBoundBasis: null,
      method: "dynamic",
      origin: "dynamic_airborne_formula",
      supported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"],
      supportedImpact: [],
      unsupported: ["Rw"],
      unsupportedImpact: [],
      values: {
        c: -1.1,
        ctr: -5.8,
        dnA: 56.9,
        dnTADb: 59.4,
        dnTwDb: 61,
        dnW: 58,
        lPrimeNTw: null,
        lPrimeNW: null,
        lnW: 73.5,
        rw: 59,
        rwDb: 59,
        rwPrimeDb: 59,
        stc: 59
      }
    }
  },
  {
    id: "field airborne route keeps DnT outputs unsupported until volume is available",
    layers: WALL_DYNAMIC_LAYERS,
    airborneContext: AIRBORNE_PARTIAL_FIELD_CONTEXT,
    calculator: "dynamic",
    origin: "field_airborne_needs_geometry",
    targetOutputs: WALL_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: "dynamic",
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      lowerBoundBasis: null,
      method: "dynamic",
      origin: "field_airborne_needs_geometry",
      supported: ["R'w", "Dn,w", "Dn,A", "STC", "C", "Ctr"],
      supportedImpact: [],
      unsupported: ["Rw", "DnT,w", "DnT,A"],
      unsupportedImpact: [],
      values: {
        c: -1.1,
        ctr: -5.8,
        dnA: 56.9,
        dnTADb: null,
        dnTwDb: null,
        dnW: 58,
        lPrimeNTw: null,
        lPrimeNW: null,
        lnW: 73.5,
        rw: 59,
        rwDb: 59,
        rwPrimeDb: 59,
        stc: 59
      }
    }
  },
  {
    id: "unsupported impact corridor stays explicit while field airborne outputs remain live",
    layers: STEEL_JOIST_FAIL_CLOSED_LAYERS,
    airborneContext: RAW_AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: RAW_IMPACT_FIELD_CONTEXT,
    origin: "unsupported_impact_fail_closed",
    targetOutputs: RAW_FIELD_OUTPUTS,
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: null,
      lowerBoundBasis: null,
      method: "screening_mass_law_curve_seed_v3",
      origin: "unsupported_impact_fail_closed",
      supported: ["R'w", "DnT,w"],
      supportedImpact: [],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedImpact: ["Ln,w", "L'n,w", "L'nT,w"],
      values: {
        c: -0.9,
        ctr: -5.6,
        dnA: 69.6,
        dnTADb: 72,
        dnTwDb: 73,
        dnW: 71,
        lPrimeNTw: null,
        lPrimeNW: null,
        lnW: null,
        rw: 70,
        rwDb: 70.2,
        rwPrimeDb: 70,
        stc: 70
      }
    }
  }
];

function snapshot(testCase: OriginCase): OriginSnapshot {
  const result = calculateAssembly(testCase.layers, {
    airborneContext: testCase.airborneContext ?? null,
    calculator: testCase.calculator ?? null,
    impactFieldContext: testCase.impactFieldContext ?? null,
    targetOutputs: testCase.targetOutputs
  });

  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    calculatorId: result.calculatorId ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: result.floorSystemRatings?.basis ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    method: result.metrics.method,
    origin: testCase.origin,
    supported: result.supportedTargetOutputs,
    supportedImpact: result.supportedImpactOutputs,
    unsupported: result.unsupportedTargetOutputs,
    unsupportedImpact: result.unsupportedImpactOutputs,
    values: {
      c: result.metrics.estimatedCDb ?? null,
      ctr: result.metrics.estimatedCtrDb ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTADb: result.metrics.estimatedDnTADb ?? null,
      dnTwDb: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
      stc: result.metrics.estimatedStc ?? null
    }
  };
}

describe("output origin trace matrix", () => {
  it("pins representative answer origins before any new solver widening", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
