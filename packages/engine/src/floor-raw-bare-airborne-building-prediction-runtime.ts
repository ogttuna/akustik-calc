import type { RequestedOutputId } from "@dynecho/shared";

export const FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BASIS =
  "post_v1_floor_raw_bare_airborne_building_prediction_runtime_adapter" as const;

export const FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID =
  "floor.raw_bare_floor_airborne.building_prediction_adapter" as const;

export const FLOOR_RAW_BARE_AIRBORNE_BUILDING_PREDICTION_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
