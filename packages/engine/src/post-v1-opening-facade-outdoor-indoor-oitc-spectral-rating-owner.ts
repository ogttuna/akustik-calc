import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type RatingAdapterBasis,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  ASTM_E1332_OITC_BAND_SET,
  ASTM_E1332_OITC_BANDS_HZ,
  type AstmE1332OitcResult
} from "./oitc-rating";
import type {
  GateSOpeningLeakCompositeRuntimeResult
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { ratingsFromOwnedCurve } from "./spectral-rating";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_STATUS =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_landed_runtime_basis_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_SELECTED_CANDIDATE_ID =
  "opening.facade_outdoor_indoor_oitc_spectral_rating_owner";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_WARNING =
  "Opening/facade outdoor-indoor OITC spectral rating owner active: OITC is rated with ASTM E1332 from the calculated outdoor-indoor 80-4000 Hz composite transmission-loss curve; Rw, STC, NISR/ISR, indoor DnT,w, and source-report scalar values remain separate bases.";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-coverage-refresh-contract.test.ts";

export const POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_REQUIRED_INPUTS = [
  "facadeOutdoorContext=outdoor_indoor_facade",
  "frequencyBandSet=one_third_octave_80_4000",
  "hostWallAreaM2",
  "openingAreaM2",
  "openingCount",
  "openingElementTransmissionLossCurve",
  "openingElementType",
  "openingSealLeakageClass"
] as const;

export type PostV1OpeningFacadeOutdoorIndoorOitcSpectralRatingOwnerResult = {
  readonly basis: AirborneResultBasis;
  readonly estimatedOitcDb?: number;
  readonly rating: AstmE1332OitcResult | null;
  readonly ratingAdapterBasis?: RatingAdapterBasis;
  readonly status: "needs_input" | "runtime_promoted";
  readonly supportedOutputs: readonly RequestedOutputId[];
  readonly warning: string;
};

const OITC_OUTPUTS = new Set<RequestedOutputId>(["OITC"]);

function unique(items: readonly string[]): string[] {
  return [...new Set(items)];
}

function requestedOitc(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => OITC_OUTPUTS.has(output));
}

function isOutdoorIndoorFacadeContext(context?: AirborneContext | null): boolean {
  return context?.facadeOutdoorContext === "outdoor_indoor_facade";
}

function missingOitcInputs(context?: AirborneContext | null): string[] {
  const missing: string[] = [];
  const openings = context?.openingLeakElements ?? [];

  if (!isOutdoorIndoorFacadeContext(context)) {
    missing.push("facadeOutdoorContext=outdoor_indoor_facade");
  }
  if (context?.frequencyBandSet === undefined) {
    missing.push("frequencyBandSet=one_third_octave_80_4000");
  }
  if (typeof context?.hostWallAreaM2 !== "number" || !Number.isFinite(context.hostWallAreaM2) || context.hostWallAreaM2 <= 0) {
    missing.push("hostWallAreaM2");
  }
  if (openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingCount",
      "openingElementTransmissionLossCurve",
      "openingElementType",
      "openingSealLeakageClass"
    );
  }

  for (const opening of openings) {
    if (typeof opening.areaM2 !== "number" || !Number.isFinite(opening.areaM2) || opening.areaM2 <= 0) {
      missing.push("openingAreaM2");
    }
    if (typeof opening.count !== "number" || !Number.isInteger(opening.count) || opening.count <= 0) {
      missing.push("openingCount");
    }
    if (!opening.elementTransmissionLossCurve) {
      missing.push("openingElementTransmissionLossCurve");
    }
    if (opening.elementType === undefined || opening.elementType === "unknown") {
      missing.push("openingElementType");
    }
    if (opening.sealLeakageClass === undefined || opening.sealLeakageClass === "unknown") {
      missing.push("openingSealLeakageClass");
    }
  }

  return unique(missing);
}

function hasExactOitcBandSet(context?: AirborneContext | null): boolean {
  if (context?.frequencyBandSet !== ASTM_E1332_OITC_BAND_SET) {
    return false;
  }

  const openings = context.openingLeakElements ?? [];
  return openings.length > 0 && openings.every((opening) => opening.frequencyBandSet === ASTM_E1332_OITC_BAND_SET);
}

export function maybeBuildPostV1OpeningFacadeOutdoorIndoorOitcSpectralRatingGateSContext(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): AirborneContext | null {
  const context = input.airborneContext;
  if (
    !requestedOitc(input.targetOutputs) ||
    !isOutdoorIndoorFacadeContext(context) ||
    !hasExactOitcBandSet(context)
  ) {
    return null;
  }

  return {
    ...context,
    contextMode: "element_lab"
  };
}

function buildNeedsInputBasis(missingPhysicalInputs: readonly string[]): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "OITC requires the ASTM E1332 outdoor-indoor 80-4000 Hz band set; DynEcho does not infer it from ISO 717-1 or STC curves.",
      "Missing OITC physical inputs stop the route instead of copying Rw, STC, NISR/ISR, or indoor partition metrics."
    ],
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    method: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD,
    missingPhysicalInputs: [...missingPhysicalInputs],
    origin: "needs_input",
    requiredInputs: [...POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_REQUIRED_INPUTS]
  });
}

function buildRuntimeBasis(): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "OITC is rated from the calculated outdoor-indoor composite transmission-loss curve with the ASTM E1332 reference spectrum.",
      "The same area-energy opening/facade composite curve is used as a formula input; it is not a measured source row.",
      "Rw, STC, NISR/ISR, indoor DnT,w, field/building ISO metrics, and source-report scalar OITC rows remain separate bases."
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    frequencyBands: {
      bandSet: ASTM_E1332_OITC_BAND_SET,
      frequenciesHz: [...ASTM_E1332_OITC_BANDS_HZ]
    },
    kind: "airborne_physics_prediction",
    measurementStandard: "none",
    method: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "source-owned same-stack outdoor-indoor OITC holdout rows for the calculated facade/opening composite route"
    ],
    origin: "family_physics_prediction",
    ratingStandard: "ASTM E1332",
    requiredInputs: [...POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_REQUIRED_INPUTS],
    toleranceClass: "uncalibrated_prediction"
  });
}

export function maybeBuildPostV1OpeningFacadeOutdoorIndoorOitcSpectralRatingOwner(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly gateSRuntime?: GateSOpeningLeakCompositeRuntimeResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeOutdoorIndoorOitcSpectralRatingOwnerResult | null {
  if (!requestedOitc(input.targetOutputs) || !isOutdoorIndoorFacadeContext(input.airborneContext)) {
    return null;
  }

  const missing = missingOitcInputs(input.airborneContext);
  if (missing.length > 0) {
    return {
      basis: buildNeedsInputBasis(missing),
      rating: null,
      status: "needs_input",
      supportedOutputs: [],
      warning: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_WARNING
    };
  }

  if (!hasExactOitcBandSet(input.airborneContext)) {
    return null;
  }

  if (
    !input.gateSRuntime ||
    input.gateSRuntime.status !== "runtime_corridor_promoted" ||
    !input.gateSRuntime.compositeCurve
  ) {
    return null;
  }

  const ownedRating = ratingsFromOwnedCurve({
    curve: input.gateSRuntime.compositeCurve,
    procedure: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
    requestedOutputs: input.targetOutputs,
    requiredContextInputs: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_REQUIRED_INPUTS
  });
  if (ownedRating.status !== "rated" || !ownedRating.astmE1332) {
    return null;
  }
  const rating = ownedRating.astmE1332;

  return {
    basis: buildRuntimeBasis(),
    estimatedOitcDb: rating.OITC,
    rating,
    ratingAdapterBasis: ownedRating.ratingAdapterBasisSet.find((basis) => basis.metricId === "OITC"),
    status: "runtime_promoted",
    supportedOutputs: ownedRating.supportedOutputs,
    warning: POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_WARNING
  };
}
