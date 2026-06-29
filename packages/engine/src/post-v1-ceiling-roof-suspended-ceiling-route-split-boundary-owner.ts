export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_SELECTED_CANDIDATE_ID =
  "ceiling.roof_suspended_ceiling_route_split_boundary_owner";

export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_NEEDS_INPUT_METHOD =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_missing_route_context";

export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_METHOD =
  "post_v1_ceiling_roof_suspended_ceiling_route_split_boundary_unsupported_route_family";

export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_REQUIRED_INPUTS = [
  "airborneContext.routeIntent",
  "airborneContext.roofOrCeilingMountingContext",
  "airborneContext.suspendedCeilingAirborneOrImpactIntent",
  "airborneContext.hangerOrSupportCouplingClass"
] as const;

export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_WARNING =
  "Post-V1 ceiling roof/suspended-ceiling route split boundary owner is active for ambiguous ceiling/roof/suspended-ceiling stacks. DynEcho requires explicit route intent, mounting context, suspended-ceiling airborne-vs-impact intent, and hanger/support coupling before publishing ceiling airborne, roof, or floor-impact family values.";

export const POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_UNSUPPORTED_WARNING =
  "Post-V1 ceiling roof/suspended-ceiling route split boundary blocked a wrong-family request. Roof/facade, suspended-ceiling lower-treatment impact, OITC, and ASTM aliases require their own physically owned route instead of borrowing ceiling airborne plenum values.";
