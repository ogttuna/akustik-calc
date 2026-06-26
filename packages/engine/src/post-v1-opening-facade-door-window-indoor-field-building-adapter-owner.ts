import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";

import type {
  PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_PLAN =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_STATUS =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_landed_runtime_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_METHOD =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING =
  "Opening/facade door/window indoor field/building adapter owner active: complete indoor partition door/window/facade requests may use the owned opening/leak field/building runtime corridor, while outdoor-indoor facade/OITC, missing frequency input, and impact aliases remain blocked.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts";

const FIELD_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w"
]);

export type PostV1OpeningFacadeDoorWindowIndoorFieldBuildingAdapterRequest = {
  readonly airborneContext: AirborneContext;
  readonly fieldBuildingTargetOutputs: readonly RequestedOutputId[];
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING;
};

function finitePositive(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function requestedFieldBuildingOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => FIELD_BUILDING_OUTPUTS.has(output));
}

function hasCompleteFieldContext(airborneContext: AirborneContext | null | undefined): boolean {
  return (
    airborneContext?.contextMode === "field_between_rooms" &&
    finitePositive(airborneContext.panelWidthMm) &&
    finitePositive(airborneContext.panelHeightMm) &&
    finitePositive(airborneContext.receivingRoomVolumeM3) &&
    finitePositive(airborneContext.receivingRoomRt60S)
  );
}

function hasCompleteBuildingContext(airborneContext: AirborneContext | null | undefined): boolean {
  return (
    airborneContext?.contextMode === "building_prediction" &&
    hasCompleteFieldContext({
      ...airborneContext,
      contextMode: "field_between_rooms"
    }) &&
    finitePositive(airborneContext.sourceRoomVolumeM3) &&
    finitePositive(airborneContext.junctionCouplingLengthM) &&
    airborneContext.flankingJunctionClass !== undefined &&
    airborneContext.flankingJunctionClass !== "unknown" &&
    airborneContext.conservativeFlankingAssumption !== undefined &&
    airborneContext.conservativeFlankingAssumption !== "unknown" &&
    airborneContext.buildingPredictionOutputBasis !== undefined &&
    airborneContext.buildingPredictionOutputBasis !== "unknown"
  );
}

export function maybeBuildPostV1OpeningFacadeDoorWindowIndoorFieldBuildingAdapterRequest(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly frequencyInputBoundary?: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowIndoorFieldBuildingAdapterRequest | null {
  const boundary = input.frequencyInputBoundary;
  const fieldBuildingTargetOutputs = requestedFieldBuildingOutputs(input.targetOutputs);
  const isCompleteContext =
    hasCompleteFieldContext(input.airborneContext) ||
    hasCompleteBuildingContext(input.airborneContext);

  if (
    !boundary ||
    boundary.missingPhysicalInputs.length > 0 ||
    boundary.shouldSuppressOpeningLeakRuntime ||
    boundary.status !== "unsupported_boundary" ||
    input.airborneContext?.facadeOutdoorContext !== "indoor_partition" ||
    !isCompleteContext ||
    fieldBuildingTargetOutputs.length === 0
  ) {
    return null;
  }

  return {
    airborneContext: input.airborneContext,
    fieldBuildingTargetOutputs,
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_WARNING
  };
}
