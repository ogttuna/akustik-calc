import {
  POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS
} from "./post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_METHOD =
  "post_v1_ceiling_multileaf_airborne_plenum_element_lab_formula_owner";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_element_lab_formula_owner";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_WARNING =
  "Post-V1 ceiling multileaf/plenum element-lab formula owner is active for complete ceiling-only plenum airborne stacks. Values are source-absent physics predictions with explicit leaf mass, plenum depth, absorber, and support-coupling inputs; exact same-stack rows still win first.";

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_ERROR_BUDGET_DB = 7;

export const POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_REQUIRED_INPUTS = [
  ...POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS,
  "route=ceiling",
  "ceilingOnlyLayerRoles",
  "airborneContext.contextMode=element_lab",
  "airborneContext.ceilingPlenum.leafGrouping",
  "airborneContext.ceilingPlenum.leafSurfaceMassKgM2",
  "airborneContext.ceilingPlenum.cavityOrPlenumDepthMm",
  "airborneContext.ceilingPlenum.absorberThicknessMm",
  "airborneContext.ceilingPlenum.absorberFlowResistivityPaSM2",
  "airborneContext.ceilingPlenum.supportCouplingOrHangerClass",
  "iso717AirborneRatingAdapter"
] as const;
