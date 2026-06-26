import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type TransmissionLossCurve,
  type RequestedOutputId
} from "@dynecho/shared";

import type {
  PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_STATUS =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_landed_input_boundary_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING =
  "Opening/facade door/window acoustic-rating input boundary active: complete door/window/facade routes require openingElementRwDb before Gate S, lab companions, or field/building opening leakage adapters can publish Rw/STC/C/Ctr/R'w/Dn values.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS = [
  "openingElementRwDb"
] as const;

type PostV1OpeningFacadeDoorWindowAcousticRatingInputBoundaryStatus =
  | "needs_input"
  | "not_requested";

export type PostV1OpeningFacadeDoorWindowAcousticRatingInputBoundaryResult = {
  readonly basis: AirborneResultBasis;
  readonly blockedOutputs: readonly RequestedOutputId[];
  readonly missingPhysicalInputs: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS;
  readonly requiredPhysicalInputs: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS;
  readonly shouldSuppressFieldBuildingRuntime: boolean;
  readonly shouldSuppressOpeningLeakRuntime: boolean;
  readonly status: PostV1OpeningFacadeDoorWindowAcousticRatingInputBoundaryStatus;
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING;
};

const AFFECTED_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);

function positive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function requestedAffectedOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => AFFECTED_OUTPUTS.has(output));
}

function isUsableCurve(curve: TransmissionLossCurve | undefined): boolean {
  return Boolean(
    curve &&
      curve.frequenciesHz.length > 0 &&
      curve.frequenciesHz.length === curve.transmissionLossDb.length &&
      curve.frequenciesHz.every((frequency) => Number.isFinite(frequency) && frequency > 0) &&
      curve.transmissionLossDb.every((value) => Number.isFinite(value))
  );
}

function hasOpeningMissingAcousticRating(airborneContext: AirborneContext | null | undefined): boolean {
  return (airborneContext?.openingLeakElements ?? []).some((opening) =>
    !positive(opening.elementRwDb) && !isUsableCurve(opening.elementTransmissionLossCurve)
  );
}

function buildNeedsInputBasis(blockedOutputs: readonly RequestedOutputId[]): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Door/window/facade opening leakage routes need the acoustic rating of each opening element before the composite area-energy formula can run.",
      "DynEcho does not reuse host-wall values, generic door/window labels, or field/building adapters when openingElementRwDb is missing."
    ],
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    method: POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_METHOD,
    missingPhysicalInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS
    ],
    origin: "needs_input",
    requiredInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS,
      `blockedOutputs:${blockedOutputs.join(",")}`
    ]
  });
}

export function maybeBuildPostV1OpeningFacadeDoorWindowAcousticRatingInputBoundary(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly frequencyInputBoundary?: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowAcousticRatingInputBoundaryResult | null {
  const frequencyBoundary = input.frequencyInputBoundary;
  if (
    !frequencyBoundary ||
    frequencyBoundary.status === "not_requested" ||
    frequencyBoundary.missingPhysicalInputs.length > 0 ||
    !hasOpeningMissingAcousticRating(input.airborneContext)
  ) {
    return null;
  }

  const blockedOutputs = requestedAffectedOutputs(input.targetOutputs);
  if (blockedOutputs.length === 0) {
    return null;
  }

  return {
    basis: buildNeedsInputBasis(blockedOutputs),
    blockedOutputs,
    missingPhysicalInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS
    ],
    requiredPhysicalInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_REQUIRED_INPUTS
    ],
    shouldSuppressFieldBuildingRuntime: true,
    shouldSuppressOpeningLeakRuntime: true,
    status: "needs_input",
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_WARNING
  };
}
