import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";

import type {
  PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_STATUS =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_landed_runtime_basis_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_METHOD =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING =
  "Opening/facade door/window lab-companion owner active: complete indoor field/building requests keep Rw/STC on the owned Gate S/Gate AH element-lab route while facade field/building, outdoor-indoor, OITC, and impact outputs remain blocked until separately owned adapters exist.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";

const LAB_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC"]);

export type PostV1OpeningFacadeDoorWindowBuildingLabCompanionRequest = {
  readonly airborneContext: AirborneContext;
  readonly labTargetOutputs: readonly RequestedOutputId[];
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING;
};

function isFieldOrBuildingContext(airborneContext: AirborneContext | null | undefined): boolean {
  return airborneContext?.contextMode === "field_between_rooms" ||
    airborneContext?.contextMode === "building_prediction";
}

function requestedLabCompanionOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => LAB_COMPANION_OUTPUTS.has(output));
}

export function maybeBuildPostV1OpeningFacadeDoorWindowBuildingLabCompanionRequest(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly frequencyInputBoundary?: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowBuildingLabCompanionRequest | null {
  const boundary = input.frequencyInputBoundary;
  const labTargetOutputs = requestedLabCompanionOutputs(input.targetOutputs);

  if (
    !boundary ||
    boundary.missingPhysicalInputs.length > 0 ||
    boundary.shouldSuppressOpeningLeakRuntime ||
    input.airborneContext?.facadeOutdoorContext === "outdoor_indoor_facade" ||
    !isFieldOrBuildingContext(input.airborneContext) ||
    labTargetOutputs.length === 0 ||
    (
      boundary.status !== "complete_element_lab_route_preserved" &&
      boundary.status !== "unsupported_boundary"
    )
  ) {
    return null;
  }

  return {
    airborneContext: {
      ...input.airborneContext,
      buildingPredictionOutputBasis: undefined,
      conservativeFlankingAssumption: undefined,
      contextMode: "element_lab",
      flankingJunctionClass: undefined,
      junctionCouplingLengthM: undefined,
      openingLeakFieldBuildingAdapterBoundary: undefined,
      sourceRoomVolumeM3: undefined
    },
    labTargetOutputs,
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
  };
}
