import type { MaterialDefinition, ResolvedLayer } from "@dynecho/shared";

import {
  isHeavyConcreteCarrierDensityEligible,
  isLightweightConcreteCarrierMaterial
} from "./heavy-concrete-carrier-eligibility";
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

export type FloorBaseStructureEligibilityOptions = {
  allowContextOwnedHeavyConcreteBase?: boolean;
};

export function isMaterialEligibleFloorBaseStructure(
  material: Pick<MaterialDefinition, "category" | "densityKgM3" | "id" | "name" | "tags">,
  options: FloorBaseStructureEligibilityOptions = {}
): boolean {
  if (material.category !== "mass") {
    return false;
  }

  const structuralSupportType = inferStructuralSupportTypeFromMaterial(material);
  if (!structuralSupportType) {
    return false;
  }

  if (STRUCTURAL_FLOOR_BASE_MATERIAL_IDS.has(material.id) || material.tags.includes("structural")) {
    return true;
  }

  if (
    structuralSupportType === "reinforced_concrete" &&
    isLightweightConcreteCarrierMaterial(material)
  ) {
    return true;
  }

  if (!options.allowContextOwnedHeavyConcreteBase) {
    return false;
  }

  const normalizedTags = new Set(material.tags.map((tag) => tag.trim().toLowerCase()));
  const hasOwnedHeavyConcreteSignal =
    normalizedTags.has("concrete") ||
    normalizedTags.has("reinforced_concrete") ||
    normalizedTags.has("heavy-base") ||
    normalizedTags.has("heavy_base");

  return Boolean(
    structuralSupportType === "reinforced_concrete" &&
      hasOwnedHeavyConcreteSignal &&
      typeof material.densityKgM3 === "number" &&
      isHeavyConcreteCarrierDensityEligible(material.densityKgM3)
  );
}

export function hasInvalidExplicitFloorBaseStructure(
  layers: readonly Pick<ResolvedLayer, "floorRole" | "material">[],
  options: FloorBaseStructureEligibilityOptions = {}
): boolean {
  return layers.some(
    (layer) => layer.floorRole === "base_structure" && !isMaterialEligibleFloorBaseStructure(layer.material, options)
  );
}
