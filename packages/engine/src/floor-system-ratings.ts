import {
  type FloorSystemAirborneRatings,
  type FloorSystemBoundEstimateResult,
  type FloorSystemBoundMatchResult,
  type FloorSystemEstimateResult,
  type FloorSystemMatchResult,
  type FloorSystemRatings,
  type FloorSystemRatingsBasis,
  type ImpactBoundCalculation,
  type ImpactCalculation,
  type ResolvedLayer
} from "@dynecho/shared";

import { buildCalibratedMassLawCurve, buildRatingsFromCurve } from "./curve-rating";
import { estimateRwDb } from "./estimate-rw";
import { round1 } from "./math";

type BuildFloorSystemRatingsInput = {
  boundFloorSystemEstimate?: FloorSystemBoundEstimateResult | null;
  boundFloorSystemMatch?: FloorSystemBoundMatchResult | null;
  floorCarrier?: FloorSystemAirborneRatings | null;
  floorSystemEstimate?: FloorSystemEstimateResult | null;
  floorSystemMatch?: FloorSystemMatchResult | null;
  impact?: ImpactCalculation | null;
  lowerBoundImpact?: ImpactBoundCalculation | null;
  screeningBasis?: FloorSystemRatingsBasis | null;
  screeningLayers?: readonly ResolvedLayer[];
  screeningRwDb?: number | null;
  screeningRwPlusCtrDb?: number | null;
};

const HEAVY_COMPANION_BASES = new Set<ImpactCalculation["basis"]>([
  "predictor_explicit_delta_heavy_reference_derived",
  "predictor_heavy_bare_floor_iso12354_annexc_estimate",
  "predictor_heavy_floating_floor_iso12354_annexc_estimate",
  "predictor_heavy_concrete_published_upper_treatment_estimate"
]);

const HEAVY_REFERENCE_COMPANION_RATINGS: FloorSystemAirborneRatings = {
  Rw: 58,
  RwCtr: -7.3,
  RwCtrSemantic: "ctr_term"
};

function pickCompanionBasis(
  impact: ImpactCalculation | null | undefined,
  lowerBoundImpact: ImpactBoundCalculation | null | undefined
): FloorSystemRatingsBasis {
  if (impact && HEAVY_COMPANION_BASES.has(impact.basis)) {
    return "predictor_heavy_concrete_floor_airborne_companion_estimate";
  }

  return impact?.basis ?? lowerBoundImpact?.basis ?? "screening_mass_law_curve_seed_v3";
}

function buildScreeningRatingsFromLayers(
  layers: readonly ResolvedLayer[] | undefined,
  basis: FloorSystemRatingsBasis
): FloorSystemRatings | null {
  if (!layers || layers.length === 0) {
    return null;
  }

  const surfaceMassKgM2 = round1(layers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0));
  const estimatedRwDb = estimateRwDb(layers);
  if (!Number.isFinite(estimatedRwDb) || estimatedRwDb <= 0) {
    return null;
  }
  const curve = buildCalibratedMassLawCurve(surfaceMassKgM2, estimatedRwDb);
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  if (!Number.isFinite(ratings.iso717.Rw) || ratings.iso717.Rw <= 0) {
    return null;
  }

  return {
    Rw: ratings.iso717.Rw,
    RwCtr: round1(ratings.iso717.Rw + ratings.iso717.Ctr),
    RwCtrSemantic: "rw_plus_ctr",
    basis
  };
}

function attachBasis(
  ratings: FloorSystemAirborneRatings,
  basis: FloorSystemRatingsBasis
): FloorSystemRatings {
  return {
    ...ratings,
    basis
  };
}

export function buildFloorSystemRatings(input: BuildFloorSystemRatingsInput): FloorSystemRatings | null {
  if (input.floorSystemMatch) {
    return attachBasis(input.floorSystemMatch.system.airborneRatings, input.floorSystemMatch.impact.basis);
  }

  if (input.floorSystemEstimate) {
    return attachBasis(input.floorSystemEstimate.airborneRatings, input.floorSystemEstimate.impact.basis);
  }

  if (input.boundFloorSystemMatch) {
    return attachBasis(input.boundFloorSystemMatch.system.airborneRatings, input.boundFloorSystemMatch.lowerBoundImpact.basis);
  }

  if (input.boundFloorSystemEstimate) {
    return attachBasis(input.boundFloorSystemEstimate.airborneRatings, input.boundFloorSystemEstimate.lowerBoundImpact.basis);
  }

  if (input.floorCarrier) {
    return attachBasis(input.floorCarrier, pickCompanionBasis(input.impact, input.lowerBoundImpact));
  }

  if (input.impact?.basis === "predictor_explicit_delta_heavy_reference_derived") {
    return attachBasis(HEAVY_REFERENCE_COMPANION_RATINGS, "predictor_heavy_concrete_floor_airborne_companion_estimate");
  }

  if (typeof input.screeningRwDb === "number" && Number.isFinite(input.screeningRwDb)) {
    if (input.screeningRwDb <= 0) {
      return null;
    }

    return {
      Rw: input.screeningRwDb,
      RwCtr:
        typeof input.screeningRwPlusCtrDb === "number" && Number.isFinite(input.screeningRwPlusCtrDb)
          ? input.screeningRwPlusCtrDb
          : undefined,
      RwCtrSemantic:
        typeof input.screeningRwPlusCtrDb === "number" && Number.isFinite(input.screeningRwPlusCtrDb)
          ? "rw_plus_ctr"
          : undefined,
      basis: input.screeningBasis ?? pickCompanionBasis(input.impact, input.lowerBoundImpact)
    };
  }

  return buildScreeningRatingsFromLayers(
    input.screeningLayers,
    input.screeningBasis ?? pickCompanionBasis(input.impact, input.lowerBoundImpact)
  );
}
