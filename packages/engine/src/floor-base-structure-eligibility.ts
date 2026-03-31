import type { MaterialDefinition, ResolvedLayer } from "@dynecho/shared";

import { inferStructuralSupportTypeFromMaterial } from "./structural-material-classification";

const STRUCTURAL_FLOOR_BASE_MATERIAL_IDS = new Set([
  "clt_panel",
  "composite_panel",
  "composite_panel_floor",
  "composite_steel_deck",
  "concrete",
  "heavy_concrete",
  "hollow_core_plank",
  "hollow_core_slab",
  "lightweight_concrete",
  "lightweight_steel_floor",
  "open_box_timber_slab",
  "open_web_steel_floor",
  "open_web_steel_joist",
  "steel_deck_composite",
  "steel_joist_floor",
  "timber_frame_floor",
  "timber_joist_floor"
]);

export function isMaterialEligibleFloorBaseStructure(
  material: Pick<MaterialDefinition, "category" | "id" | "name" | "tags">
): boolean {
  if (material.category !== "mass") {
    return false;
  }

  if (!inferStructuralSupportTypeFromMaterial(material)) {
    return false;
  }

  return STRUCTURAL_FLOOR_BASE_MATERIAL_IDS.has(material.id) || material.tags.includes("structural");
}

export function hasInvalidExplicitFloorBaseStructure(
  layers: readonly Pick<ResolvedLayer, "floorRole" | "material">[]
): boolean {
  return layers.some(
    (layer) => layer.floorRole === "base_structure" && !isMaterialEligibleFloorBaseStructure(layer.material)
  );
}
