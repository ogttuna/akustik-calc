import type { FloorRole, ResolvedLayer } from "@dynecho/shared";

const STEEL_IMPACT_ROUTE_ROLES = new Set<FloorRole>([
  "ceiling_board",
  "ceiling_cavity",
  "ceiling_fill",
  "floating_screed",
  "floor_covering",
  "resilient_layer",
  "upper_fill"
]);

export type FloorFamilySourceGuard = {
  guardId: "generic_lightweight_steel_floor_support_form_needs_input";
  missingPhysicalInputs: readonly string[];
  warning: string;
};

const GENERIC_LIGHTWEIGHT_STEEL_MISSING_INPUTS = [
  "steelSupportForm(open_web_or_rolled|joist_or_purlin)",
  "steelCarrierDepthAndSpacing",
  "upperImpactPackageDynamicStiffnessOrMatchingSourceRow",
  "lowerCeilingIsolationSupportForm"
] as const;

function hasGenericLightweightSteelBase(layers: readonly ResolvedLayer[]): boolean {
  return layers.some(
    (layer) => layer.floorRole === "base_structure" && layer.material.id === "lightweight_steel_floor"
  );
}

function hasSteelImpactRoutePackage(layers: readonly ResolvedLayer[]): boolean {
  return layers.some((layer) => Boolean(layer.floorRole && STEEL_IMPACT_ROUTE_ROLES.has(layer.floorRole)));
}

export function getFloorFamilySourceGuard(
  layers: readonly ResolvedLayer[]
): FloorFamilySourceGuard | null {
  if (!hasGenericLightweightSteelBase(layers) || !hasSteelImpactRoutePackage(layers)) {
    return null;
  }

  return {
    guardId: "generic_lightweight_steel_floor_support_form_needs_input",
    missingPhysicalInputs: GENERIC_LIGHTWEIGHT_STEEL_MISSING_INPUTS,
    warning:
      "Generic lightweight-steel floor impact route needs steel support form (open_web_or_rolled or joist_or_purlin), carrier depth/spacing, upper impact package dynamic stiffness or a matching source row, and lower ceiling isolation before DynEcho can calculate Ln,w. DynEcho did not borrow UBIQ or Pliteq steel rows from a different or unspecified steel support form."
  };
}

export function shouldWithholdFloorFamilyEstimateForSourceGuard(
  layers: readonly ResolvedLayer[]
): boolean {
  return Boolean(getFloorFamilySourceGuard(layers));
}
