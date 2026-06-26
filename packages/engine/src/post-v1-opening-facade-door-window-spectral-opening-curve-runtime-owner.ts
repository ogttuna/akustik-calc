import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import type {
  GateSOpeningLeakCompositeRuntimeResult
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { round1 } from "./math";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_STATUS =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_landed_runtime_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_METHOD =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING =
  "Opening/facade door/window spectral opening-curve runtime owner active: lab Rw/STC/C/Ctr are rated from the area-energy composite transmission-loss curve; field/building, outdoor-indoor facade, OITC, scalar STC aliases, and impact outputs remain separately bounded.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";

const LAB_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "STC"]);

export type PostV1OpeningFacadeDoorWindowSpectralOpeningCurveRuntime = {
  readonly estimatedCDb?: number;
  readonly estimatedCtrDb?: number;
  readonly estimatedRwDb?: number;
  readonly estimatedStcDb?: number;
  readonly supportedOutputs: readonly RequestedOutputId[];
  readonly warning: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING;
};

function isElementLabContext(context?: AirborneContext | null): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

export function maybeBuildPostV1OpeningFacadeDoorWindowSpectralOpeningCurveRuntime(
  input: {
    readonly airborneContext?: AirborneContext | null;
    readonly gateSRuntime?: GateSOpeningLeakCompositeRuntimeResult | null;
    readonly targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowSpectralOpeningCurveRuntime | null {
  const gateSRuntime = input.gateSRuntime;

  if (
    !isElementLabContext(input.airborneContext) ||
    !gateSRuntime ||
    gateSRuntime.status !== "runtime_corridor_promoted" ||
    !gateSRuntime.compositeCurve ||
    !input.targetOutputs.some((output) => LAB_OUTPUTS.has(output))
  ) {
    return null;
  }

  const ratings = buildRatingsFromCurve(
    gateSRuntime.compositeCurve.frequenciesHz,
    gateSRuntime.compositeCurve.transmissionLossDb,
    { contextMode: "element_lab" }
  );
  const estimatedCDb = round1(ratings.iso717.C);
  const estimatedCtrDb = round1(ratings.iso717.Ctr);
  const estimatedRwDb = ratings.iso717.Rw;
  const estimatedStcDb = ratings.astmE413.STC;
  const supportedOutputs = input.targetOutputs.filter((output) => {
    switch (output) {
      case "C":
        return Number.isFinite(estimatedCDb);
      case "Ctr":
        return Number.isFinite(estimatedCtrDb);
      case "Rw":
        return Number.isFinite(estimatedRwDb);
      case "STC":
        return Number.isFinite(estimatedStcDb);
      default:
        return false;
    }
  });

  if (supportedOutputs.length === 0) {
    return null;
  }

  return {
    estimatedCDb,
    estimatedCtrDb,
    estimatedRwDb,
    estimatedStcDb,
    supportedOutputs,
    warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_WARNING
  };
}
