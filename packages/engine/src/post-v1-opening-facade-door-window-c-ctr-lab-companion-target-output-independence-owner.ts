import type { AirborneContext, RequestedOutputId, TransmissionLossCurve } from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import type {
  GateSOpeningLeakCompositeRuntimeResult
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { clamp, round1 } from "./math";
import type {
  PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult
} from "./post-v1-opening-facade-door-window-frequency-input-boundary-owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_STATUS =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_landed_runtime_basis_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_METHOD =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING =
  "Opening/facade door/window C/Ctr lab-companion owner active: complete indoor field/building requests keep C/Ctr on the owned Gate S shifted ISO 717-1 lab spectrum route while field/building metrics, outdoor-indoor facade/OITC, scalar STC aliases, and impact outputs remain separately bounded.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";

const LAB_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr"]);

export type PostV1OpeningFacadeDoorWindowCCtrLabCompanionRequest = {
  readonly airborneContext: AirborneContext;
  readonly labTargetOutputs: readonly RequestedOutputId[];
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING;
};

export type PostV1OpeningFacadeDoorWindowCCtrLabCompanionRuntime = {
  readonly estimatedCDb?: number;
  readonly estimatedCtrDb?: number;
  readonly rwLossDb: number;
  readonly shiftedCurve: TransmissionLossCurve;
  readonly supportedOutputs: readonly RequestedOutputId[];
};

function isFieldOrBuildingContext(airborneContext: AirborneContext | null | undefined): boolean {
  return airborneContext?.contextMode === "field_between_rooms" ||
    airborneContext?.contextMode === "building_prediction";
}

function requestedLabCompanionOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => LAB_COMPANION_OUTPUTS.has(output));
}

function buildShiftedCurve(input: {
  readonly compositeCurve?: TransmissionLossCurve | null;
  readonly hostCurve: TransmissionLossCurve;
  readonly rwLossDb: number;
}): TransmissionLossCurve {
  if (input.compositeCurve) {
    return {
      frequenciesHz: [...input.compositeCurve.frequenciesHz],
      transmissionLossDb: [...input.compositeCurve.transmissionLossDb]
    };
  }

  return {
    frequenciesHz: [...input.hostCurve.frequenciesHz],
    transmissionLossDb: input.hostCurve.transmissionLossDb.map((value) =>
      round1(clamp(value - input.rwLossDb, 0, 95))
    )
  };
}

export function maybeBuildPostV1OpeningFacadeDoorWindowCCtrLabCompanionRequest(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly frequencyInputBoundary?: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowCCtrLabCompanionRequest | null {
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
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_WARNING
  };
}

export function maybeBuildPostV1OpeningFacadeDoorWindowCCtrLabCompanionRuntime(
  input: {
    readonly gateSRuntime?: GateSOpeningLeakCompositeRuntimeResult | null;
    readonly hostCurve: TransmissionLossCurve;
    readonly hostWallRwDb: number;
    readonly request?: PostV1OpeningFacadeDoorWindowCCtrLabCompanionRequest | null;
  }
): PostV1OpeningFacadeDoorWindowCCtrLabCompanionRuntime | null {
  const gateSRuntime = input.gateSRuntime;
  if (
    !input.request ||
    !gateSRuntime ||
    gateSRuntime.status !== "runtime_corridor_promoted" ||
    typeof gateSRuntime.runtimeRwDb !== "number" ||
    !Number.isFinite(gateSRuntime.runtimeRwDb) ||
    !Number.isFinite(input.hostWallRwDb)
  ) {
    return null;
  }

  const rwLossDb = round1(input.hostWallRwDb - gateSRuntime.runtimeRwDb);
  if (!(rwLossDb > 0)) {
    return null;
  }

  const shiftedCurve = buildShiftedCurve({
    compositeCurve: gateSRuntime.compositeCurve,
    hostCurve: input.hostCurve,
    rwLossDb
  });
  const shiftedRatings = buildRatingsFromCurve(
    shiftedCurve.frequenciesHz,
    shiftedCurve.transmissionLossDb,
    { contextMode: "element_lab" }
  );
  const estimatedCDb = round1(shiftedRatings.iso717.C);
  const estimatedCtrDb = round1(shiftedRatings.iso717.Ctr);
  const supportedOutputs = input.request.labTargetOutputs.filter((output) =>
    output === "C"
      ? Number.isFinite(estimatedCDb)
      : output === "Ctr"
      ? Number.isFinite(estimatedCtrDb)
      : false
  );

  if (supportedOutputs.length === 0) {
    return null;
  }

  return {
    estimatedCDb,
    estimatedCtrDb,
    rwLossDb,
    shiftedCurve,
    supportedOutputs
  };
}
