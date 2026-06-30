import {
  RatingAdapterBasisSchema,
  type AssemblyRatings,
  type RatingAdapterBasis,
  type RequestedOutputId,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve, type CurveRatingContext } from "./curve-rating";
import {
  ASTM_E1332_OITC_BAND_SET,
  ASTM_E1332_OITC_BANDS_HZ,
  computeAstmE1332OitcFromCurve,
  type AstmE1332OitcResult
} from "./oitc-rating";
import {
  computeAstmE989ImpactRating,
  type AstmE989ImpactRatingResult
} from "./impact-astm-e989";
import {
  IMPACT_RATING_FREQS_THIRD
} from "./impact-iso717";
import { pickRequiredFrequencyCoverage } from "./rating-band-coverage";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_PLAN =
  "post_v1_spectral_rating_backbone_v1_plan";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_STATUS =
  "post_v1_spectral_rating_backbone_v1_landed_support_selected_post_v1_route_input_family_first_class_surface_v1";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_CANDIDATE_ID =
  "post_v1_spectral_rating_backbone_v1";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_ACTION =
  "post_v1_route_input_family_first_class_surface_v1_plan";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-route-input-family-first-class-surface-v1-contract.test.ts";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN_2026-06-29.md";

export const POST_V1_SPECTRAL_RATING_BACKBONE_V1_SELECTED_NEXT_LABEL =
  "post-V1 route/input family first-class surface V1";

export type OwnedCurveRatingProcedure =
  | "airborne_iso7171_astm_e413_from_transmission_loss_curve"
  | "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve"
  | "astm_e989_iic_aiic_from_impact_level_curve";

export type OwnedCurveBlockedOutput = {
  readonly output: RequestedOutputId;
  readonly reason: string;
};

export type OwnedCurveRatingResult = {
  readonly astmE1332?: AstmE1332OitcResult;
  readonly astmE989?: AstmE989ImpactRatingResult;
  readonly blockedOutputs: readonly OwnedCurveBlockedOutput[];
  readonly missingPhysicalInputs: readonly string[];
  readonly procedure: OwnedCurveRatingProcedure;
  readonly ratingAdapterBasisSet: readonly RatingAdapterBasis[];
  readonly ratings?: AssemblyRatings;
  readonly status: "needs_input" | "rated";
  readonly supportedOutputs: readonly RequestedOutputId[];
};

type AirborneCurveInput = {
  readonly context?: CurveRatingContext | null;
  readonly curve: TransmissionLossCurve | null | undefined;
  readonly procedure: "airborne_iso7171_astm_e413_from_transmission_loss_curve";
  readonly requestedOutputs?: readonly RequestedOutputId[];
};

type OitcCurveInput = {
  readonly curve: TransmissionLossCurve | null | undefined;
  readonly procedure: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve";
  readonly requestedOutputs?: readonly RequestedOutputId[];
  readonly requiredContextInputs?: readonly string[];
};

type ImpactCurveInput = {
  readonly frequenciesHz: readonly number[];
  readonly levelsDb: readonly number[];
  readonly procedure: "astm_e989_iic_aiic_from_impact_level_curve";
  readonly requestedOutputs?: readonly RequestedOutputId[];
  readonly sourceContext: "field" | "lab";
};

export type RatingsFromOwnedCurveInput = AirborneCurveInput | OitcCurveInput | ImpactCurveInput;

const AIRBORNE_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_LAB_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_FIELD_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];

function requestedOrDefault(
  requestedOutputs: readonly RequestedOutputId[] | undefined,
  supportedOutputs: readonly RequestedOutputId[]
): readonly RequestedOutputId[] {
  return requestedOutputs && requestedOutputs.length > 0 ? requestedOutputs : supportedOutputs;
}

function partitionRequestedOutputs(input: {
  readonly requestedOutputs?: readonly RequestedOutputId[];
  readonly unsupportedReason: string;
  readonly validOutputs: readonly RequestedOutputId[];
}): {
  readonly blockedOutputs: readonly OwnedCurveBlockedOutput[];
  readonly supportedOutputs: readonly RequestedOutputId[];
} {
  const valid = new Set<RequestedOutputId>(input.validOutputs);
  const requested = requestedOrDefault(input.requestedOutputs, input.validOutputs);

  return {
    blockedOutputs: requested
      .filter((output) => !valid.has(output))
      .map((output) => ({
        output,
        reason: input.unsupportedReason
      })),
    supportedOutputs: requested.filter((output) => valid.has(output))
  };
}

function needsInputResult(
  procedure: OwnedCurveRatingProcedure,
  missingPhysicalInputs: readonly string[],
  requestedOutputs: readonly RequestedOutputId[] | undefined,
  validOutputs: readonly RequestedOutputId[],
  unsupportedReason: string
): OwnedCurveRatingResult {
  const partitioned = partitionRequestedOutputs({
    requestedOutputs,
    unsupportedReason,
    validOutputs
  });

  return {
    blockedOutputs: partitioned.blockedOutputs,
    missingPhysicalInputs,
    procedure,
    ratingAdapterBasisSet: [],
    status: "needs_input",
    supportedOutputs: []
  };
}

export function buildAstmE1332OitcRatingAdapterBasis(
  requiredContextInputs: readonly string[] = []
): RatingAdapterBasis {
  return RatingAdapterBasisSchema.parse({
    adapterId: "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve",
    aliasBlocks: [
      {
        fromMetricId: "Rw",
        reason: "Rw is an ISO 717-1 indoor/lab-style rating and cannot be copied into outdoor-indoor OITC.",
        toMetricId: "OITC"
      },
      {
        fromMetricId: "STC",
        reason: "STC is an ASTM E413 contour rating and cannot be copied into ASTM E1332 OITC.",
        toMetricId: "OITC"
      },
      {
        fromMetricId: "NISR",
        reason: "NISR/ISR require their own outdoor-indoor reporting basis and are not OITC aliases.",
        toMetricId: "OITC"
      },
      {
        fromMetricId: "DnT,w",
        reason: "Indoor standardized level difference is not the outdoor-indoor OITC rating basis.",
        toMetricId: "OITC"
      }
    ],
    contextBasis: "building_prediction",
    implementationStatus: "runtime_adapter",
    inputBasis: "outdoor_indoor_transmission_loss_curve",
    metricFamily: "airborne",
    metricId: "OITC",
    notes: [
      "ASTM E1332 OITC is calculated from the 80-4000 Hz outdoor-indoor transmission-loss curve and reference transportation spectrum.",
      "This adapter does not import source rows and does not alias Rw/STC/NISR/ISR into OITC."
    ],
    ratingStandard: "ASTM E1332",
    requiredContextInputs: [...requiredContextInputs],
    sourceMetricIds: []
  });
}

function rateAirborneCurve(input: AirborneCurveInput): OwnedCurveRatingResult {
  if (!input.curve) {
    return needsInputResult(
      input.procedure,
      ["airborneTransmissionLossCurve"],
      input.requestedOutputs,
      AIRBORNE_LAB_OUTPUTS,
      "Only ISO 717-1 / ASTM E413 airborne lab companions are valid for this owned transmission-loss curve."
    );
  }

  const ratings = buildRatingsFromCurve(input.curve.frequenciesHz, input.curve.transmissionLossDb, input.context);
  const partitioned = partitionRequestedOutputs({
    requestedOutputs: input.requestedOutputs,
    unsupportedReason:
      "This airborne transmission-loss curve can derive ISO 717-1 Rw/C/Ctr and ASTM E413 STC only; OITC and impact outputs need their own basis.",
    validOutputs: AIRBORNE_LAB_OUTPUTS
  });

  return {
    blockedOutputs: partitioned.blockedOutputs,
    missingPhysicalInputs: [],
    procedure: input.procedure,
    ratingAdapterBasisSet: [],
    ratings,
    status: "rated",
    supportedOutputs: partitioned.supportedOutputs
  };
}

function rateOitcCurve(input: OitcCurveInput): OwnedCurveRatingResult {
  const curve = input.curve;
  if (!curve) {
    return needsInputResult(
      input.procedure,
      ["outdoorIndoorTransmissionLossCurve"],
      input.requestedOutputs,
      OITC_OUTPUTS,
      "OITC requires ASTM E1332 outdoor-indoor transmission-loss curve ownership."
    );
  }

  const coverage = pickRequiredFrequencyCoverage({
    frequenciesHz: curve.frequenciesHz,
    requiredFrequenciesHz: ASTM_E1332_OITC_BANDS_HZ,
    valuesDb: curve.transmissionLossDb
  });
  if (coverage.status !== "complete") {
    return needsInputResult(
      input.procedure,
      [
        `frequencyBandSet=${ASTM_E1332_OITC_BAND_SET}`,
        ...coverage.missingFrequenciesHz.map((frequency) => `frequencyHz=${frequency}`)
      ],
      input.requestedOutputs,
      OITC_OUTPUTS,
      "OITC requires the ASTM E1332 80-4000 Hz outdoor-indoor band coverage."
    );
  }

  const astmE1332 = computeAstmE1332OitcFromCurve(curve);
  if (!astmE1332) {
    return needsInputResult(
      input.procedure,
      [`frequencyBandSet=${ASTM_E1332_OITC_BAND_SET}`],
      input.requestedOutputs,
      OITC_OUTPUTS,
      "OITC requires ASTM E1332 outdoor-indoor band coverage."
    );
  }

  const partitioned = partitionRequestedOutputs({
    requestedOutputs: input.requestedOutputs,
    unsupportedReason:
      "ASTM E1332 OITC is the only valid output from this outdoor-indoor rating procedure; Rw, STC, NISR/ISR, indoor DnT,w, and impact outputs are separate bases.",
    validOutputs: OITC_OUTPUTS
  });

  return {
    astmE1332,
    blockedOutputs: partitioned.blockedOutputs,
    missingPhysicalInputs: [],
    procedure: input.procedure,
    ratingAdapterBasisSet: [buildAstmE1332OitcRatingAdapterBasis(input.requiredContextInputs)],
    status: "rated",
    supportedOutputs: partitioned.supportedOutputs
  };
}

function rateImpactCurve(input: ImpactCurveInput): OwnedCurveRatingResult {
  const validOutputs = input.sourceContext === "field" ? IMPACT_FIELD_OUTPUTS : IMPACT_LAB_OUTPUTS;
  const coverage = pickRequiredFrequencyCoverage({
    frequenciesHz: input.frequenciesHz,
    requiredFrequenciesHz: IMPACT_RATING_FREQS_THIRD,
    valuesDb: input.levelsDb
  });
  if (coverage.status !== "complete") {
    return needsInputResult(
      input.procedure,
      [
        "frequencyBandSet=one_third_octave_100_3150",
        ...coverage.missingFrequenciesHz.map((frequency) => `frequencyHz=${frequency}`)
      ],
      input.requestedOutputs,
      validOutputs,
      "ASTM E989 IIC/AIIC requires the complete one-third-octave 100-3150 Hz impact level curve."
    );
  }

  const astmE989 = computeAstmE989ImpactRating(input.frequenciesHz, input.levelsDb);
  if (!astmE989) {
    return needsInputResult(
      input.procedure,
      ["frequencyBandSet=one_third_octave_100_3150"],
      input.requestedOutputs,
      validOutputs,
      "ASTM E989 IIC/AIIC requires a valid impact level curve."
    );
  }

  const partitioned = partitionRequestedOutputs({
    requestedOutputs: input.requestedOutputs,
    unsupportedReason:
      "ASTM E989 can derive IIC/AIIC only; ISO Ln,w, DeltaLw, and airborne ratings are separate bases.",
    validOutputs
  });

  return {
    astmE989,
    blockedOutputs: partitioned.blockedOutputs,
    missingPhysicalInputs: [],
    procedure: input.procedure,
    ratingAdapterBasisSet: [],
    status: "rated",
    supportedOutputs: partitioned.supportedOutputs
  };
}

export function ratingsFromOwnedCurve(input: RatingsFromOwnedCurveInput): OwnedCurveRatingResult {
  switch (input.procedure) {
    case "airborne_iso7171_astm_e413_from_transmission_loss_curve":
      return rateAirborneCurve(input);
    case "astm_e1332_oitc_from_outdoor_indoor_transmission_loss_curve":
      return rateOitcCurve(input);
    case "astm_e989_iic_aiic_from_impact_level_curve":
      return rateImpactCurve(input);
  }
}
