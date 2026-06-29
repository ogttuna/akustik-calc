import {
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS
} from "./post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_field_context_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_building_prediction_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_field_building_adapter_owner";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_field_context_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_building_prediction_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_RUNTIME_CANDIDATE_ID =
  "candidate_post_v1_ceiling_multileaf_airborne_plenum_field_context_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_RUNTIME_CANDIDATE_ID =
  "candidate_post_v1_ceiling_multileaf_airborne_plenum_building_prediction_adapter";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_WARNING =
  "Post-V1 ceiling multileaf/plenum field/building adapter owner is active for complete ceiling-only plenum airborne stacks. Field and building values are calculated from the owned plenum direct-transmission formula plus explicit room and flanking context; lab values are not copied into apparent or standardized outputs.";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ERROR_BUDGET_DB = 9;

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_CONTEXT_REQUIRED_INPUTS = [
  ...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS,
  "route=ceiling",
  "ceilingOnlyLayerRoles",
  "airborneContext.contextMode=field_between_rooms",
  "airborneContext.ceilingPlenum.leafGrouping",
  "airborneContext.ceilingPlenum.leafSurfaceMassKgM2",
  "airborneContext.ceilingPlenum.cavityOrPlenumDepthMm",
  "airborneContext.ceilingPlenum.absorberThicknessMm",
  "airborneContext.ceilingPlenum.absorberFlowResistivityPaSM2",
  "airborneContext.ceilingPlenum.supportCouplingOrHangerClass",
  "airborneContext.panelWidthHeight",
  "airborneContext.receivingRoomVolumeM3",
  "airborneContext.receivingRoomRt60S",
  "ownedCeilingMultileafPlenumDirectLabFormula"
] as const;

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_BUILDING_PREDICTION_REQUIRED_INPUTS = [
  ...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS,
  "route=ceiling",
  "ceilingOnlyLayerRoles",
  "airborneContext.contextMode=building_prediction",
  "airborneContext.ceilingPlenum.leafGrouping",
  "airborneContext.ceilingPlenum.leafSurfaceMassKgM2",
  "airborneContext.ceilingPlenum.cavityOrPlenumDepthMm",
  "airborneContext.ceilingPlenum.absorberThicknessMm",
  "airborneContext.ceilingPlenum.absorberFlowResistivityPaSM2",
  "airborneContext.ceilingPlenum.supportCouplingOrHangerClass",
  "airborneContext.panelWidthHeight",
  "airborneContext.sourceRoomVolumeM3",
  "airborneContext.receivingRoomVolumeM3",
  "airborneContext.receivingRoomRt60S",
  "airborneContext.flankingJunctionClass",
  "airborneContext.conservativeFlankingAssumption",
  "airborneContext.junctionCouplingLengthM",
  "ownedCeilingMultileafPlenumDirectLabFormula"
] as const;
