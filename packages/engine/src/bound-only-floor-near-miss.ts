import type { FloorRole, ResolvedLayer } from "@dynecho/shared";

const UPPER_ROLES: readonly FloorRole[] = ["floating_screed", "floor_covering", "resilient_layer", "upper_fill"];
const LOWER_ROLES: readonly FloorRole[] = ["ceiling_board", "ceiling_cavity", "ceiling_fill"];

export function hasBoundOnlyUbiqOpenWebCarpetCombinedProfile(layers: readonly ResolvedLayer[]): boolean {
  const hasUpper = layers.some((layer) => layer.floorRole !== undefined && UPPER_ROLES.includes(layer.floorRole));
  const hasLower = layers.some((layer) => layer.floorRole !== undefined && LOWER_ROLES.includes(layer.floorRole));

  return (
    hasUpper &&
    hasLower &&
    layers.some(
      (layer) => layer.floorRole === "base_structure" && layer.material.id === "open_web_steel_floor"
    ) &&
    layers.some(
      (layer) =>
        layer.floorRole === "floor_covering" &&
        layer.material.id === "carpet_with_foam_underlay"
    )
  );
}
