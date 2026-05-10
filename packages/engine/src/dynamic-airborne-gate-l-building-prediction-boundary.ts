import type { AcousticInputFieldId } from "@dynecho/shared";

export const GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_PLAN =
  "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan";

export const GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_STATUS =
  "gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m";

export const GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS = [
  "flankingJunctionClass",
  "conservativeFlankingAssumption"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING =
  "Airborne building-prediction route is parked until flanking/junction ownership and a conservative flanking assumption are explicit. DAC will not reuse Gate I room-to-room field budgets, selected candidates, or lab values as building-prediction evidence.";
