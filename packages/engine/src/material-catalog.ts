import { MATERIAL_CATALOG_SEED, materialCatalogById } from "@dynecho/catalogs";
import type { MaterialDefinition } from "@dynecho/shared";

const MATERIAL_ID_ALIASES: Record<string, string> = {
  engineered_timber_structural: "timber_joist_floor",
  eps_acoustic_underlay: "eps_underlay",
  gypsum_fiberboard: "dry_floating_gypsum_fiberboard",
  mw_t_10_impact_layer: "generic_resilient_underlay",
  mw_t_40_impact_layer: "mw_t_impact_layer_s40",
  open_web_steel_joist: "open_web_steel_floor",
  particleboard_flooring: "inex_floor_panel",
  rubber_sheet: "generic_resilient_underlay",
  solid_wood: "timber_joist_floor",
  steel_deck_composite: "composite_steel_deck"
};

export function getDefaultMaterialCatalog(): readonly MaterialDefinition[] {
  return MATERIAL_CATALOG_SEED;
}

export function resolveMaterial(
  materialId: string,
  catalog: readonly MaterialDefinition[] = MATERIAL_CATALOG_SEED
): MaterialDefinition {
  const canonicalMaterialId = MATERIAL_ID_ALIASES[materialId] ?? materialId;

  if (catalog === MATERIAL_CATALOG_SEED && materialCatalogById[canonicalMaterialId]) {
    return materialCatalogById[canonicalMaterialId];
  }

  const hit = catalog.find((entry) => entry.id === canonicalMaterialId);
  if (!hit) {
    throw new Error(`Unknown material: ${materialId}`);
  }

  return hit;
}
