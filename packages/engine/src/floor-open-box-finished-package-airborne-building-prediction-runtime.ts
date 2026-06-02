import type { RequestedOutputId } from "@dynecho/shared";

export const FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS =
  "post_v1_floor_open_box_finished_package_airborne_building_prediction_runtime_adapter" as const;

export const FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID =
  "floor.open_box_timber_finished_package.airborne_building_prediction_adapter" as const;

export const FLOOR_OPEN_BOX_FINISHED_PACKAGE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
