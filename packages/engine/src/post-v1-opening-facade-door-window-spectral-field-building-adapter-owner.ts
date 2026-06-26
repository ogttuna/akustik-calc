import type { AirborneContext, RequestedOutputId, TransmissionLossCurve } from "@dynecho/shared";

import type {
  PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_PLAN =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_STATUS =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_WARNING =
  "Opening/facade door/window spectral field/building adapter owner active: complete indoor partition field/building requests may adapt the calculated opening transmission-loss curve through explicit flanking and room-normalization inputs; outdoor-indoor facade/OITC and impact aliases remain blocked.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts";

const FIELD_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w"
]);

export type PostV1OpeningFacadeDoorWindowSpectralFieldBuildingAdapterRequest = {
  readonly airborneContext: AirborneContext;
  readonly fieldBuildingTargetOutputs: readonly RequestedOutputId[];
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_WARNING;
};

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function requestedFieldBuildingOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => FIELD_BUILDING_OUTPUTS.has(output));
}

function usableCurve(curve: TransmissionLossCurve | undefined): curve is TransmissionLossCurve {
  return Boolean(
    curve &&
      curve.frequenciesHz.length > 0 &&
      curve.frequenciesHz.length === curve.transmissionLossDb.length &&
      curve.frequenciesHz.every((frequency) => Number.isFinite(frequency) && frequency > 0) &&
      curve.transmissionLossDb.every((value) => Number.isFinite(value))
  );
}

function hasCurveOpeningElement(airborneContext: AirborneContext | null | undefined): boolean {
  return (airborneContext?.openingLeakElements ?? []).some((opening) =>
    !finitePositive(opening.elementRwDb) &&
      opening.ratingBasis === "iso_717_1_curve" &&
      usableCurve(opening.elementTransmissionLossCurve)
  );
}

export function maybeBuildPostV1OpeningFacadeDoorWindowSpectralFieldBuildingAdapterRequest(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly frequencyInputBoundary?: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowSpectralFieldBuildingAdapterRequest | null {
  const boundary = input.frequencyInputBoundary;
  const fieldBuildingTargetOutputs = requestedFieldBuildingOutputs(input.targetOutputs);

  if (
    !boundary ||
    boundary.missingPhysicalInputs.length > 0 ||
    boundary.shouldSuppressOpeningLeakRuntime ||
    boundary.status !== "unsupported_boundary" ||
    input.airborneContext?.facadeOutdoorContext !== "indoor_partition" ||
    !hasCurveOpeningElement(input.airborneContext) ||
    fieldBuildingTargetOutputs.length === 0
  ) {
    return null;
  }

  return {
    airborneContext: input.airborneContext,
    fieldBuildingTargetOutputs,
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_WARNING
  };
}
