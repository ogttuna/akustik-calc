import { MATERIAL_CATALOG_SEED, materialCatalogById } from "@dynecho/catalogs";
import type { MaterialDefinition } from "@dynecho/shared";

const MATERIAL_ID_ALIASES: Record<string, string> = {
  aac_d700: "ytong_aac_d700",
  aac_g5_800: "ytong_g5_800",
  cement_render: "cement_plaster",
  celcon_dense_finish: "celcon_dense_plaster",
  celcon_dense_plaster_13: "celcon_dense_plaster",
  celcon_high: "celcon_high_strength",
  celcon_lightweight_finish: "celcon_lwt_plaster",
  celcon_lightweight_plaster_13: "celcon_lwt_plaster",
  celcon_lwt_finish: "celcon_lwt_plaster",
  celcon_lwt_plaster_13: "celcon_lwt_plaster",
  celcon_solar: "celcon_solar_grade",
  celcon_standard: "celcon_standard_grade",
  dense_gypsum_plaster: "dense_plaster",
  db: "diamond_board",
  db_board: "diamond_board",
  diamant: "diamond_board",
  diamant_board: "diamond_board",
  diamond: "diamond_board",
  engineered_timber_structural: "timber_joist_floor",
  eps_acoustic_underlay: "eps_underlay",
  fire_board: "firestop_board",
  gypsum: "gypsum_board",
  gypsum_fiberboard: "dry_floating_gypsum_fiberboard",
  heluz_14_brousena: "heluz_14_brushed",
  heluz_aku_11_5: "heluz_aku_115",
  heluz_aku_20: "heluz_aku_200_p15",
  heluz_aku_30_33_3: "heluz_aku_300_333_p20",
  heluz_aku_30_333: "heluz_aku_300_333_p20",
  lime_cement_plaster: "lime_cement_plaster_1700",
  lightweight_render: "lightweight_plaster",
  mw_t_10_impact_layer: "generic_resilient_underlay",
  mw_t_40_impact_layer: "mw_t_impact_layer_s40",
  open_web_steel_joist: "open_web_steel_floor",
  particleboard_flooring: "inex_floor_panel",
  plaster_cement: "cement_plaster",
  plaster_dense: "dense_plaster",
  plaster_lightweight: "lightweight_plaster",
  plaster_lime_cement_1300: "lime_cement_plaster_1300",
  plaster_lime_cement_1700: "lime_cement_plaster_1700",
  plaster_lime_cement_1780: "lime_cement_plaster_1780",
  porotherm_100: "porotherm_pls_100",
  porotherm_140: "porotherm_pls_140",
  porotherm_190: "porotherm_pls_190",
  porotherm_clay_block_100: "porotherm_pls_100",
  porotherm_clay_block_140: "porotherm_pls_140",
  porotherm_clay_block_190: "porotherm_pls_190",
  pumice_bims_block: "pumice_block",
  rubber_sheet: "generic_resilient_underlay",
  security: "security_board",
  skim_coat_plaster: "skim_plaster",
  silicate_block: "silka_cs_block",
  silent: "silentboard",
  silka_block: "silka_cs_block",
  sand_lime_block: "silka_cs_block",
  calcium_silicate_block: "silka_cs_block",
  solid_wood: "timber_joist_floor",
  soundbloc_board: "acoustic_gypsum_board",
  steel_deck_composite: "composite_steel_deck",
  ytong_d700: "ytong_aac_d700",
  ytong_g4_600: "ytong_separatiepaneel_aac_4_600",
  ytong_g2_300: "ytong_massief_g2_300",
  ytong_g5_800_panel: "ytong_g5_800",
  ytong_aac_4_600: "ytong_separatiepaneel_aac_4_600",
  ytong_aac_5_750: "ytong_separatiepaneel_aac_5_750",
  ytong_block_g4_600: "ytong_cellenbetonblok_g4_600",
  ytong_block_g5_800: "ytong_cellenbetonblok_g5_800",
  ytong_cellenbetonblok_4_600: "ytong_cellenbetonblok_g4_600",
  ytong_cellenbetonblok_5_800: "ytong_cellenbetonblok_g5_800",
  ytong_separatiepaneel_4_600: "ytong_separatiepaneel_aac_4_600",
  ytong_separatiepaneel_5_750: "ytong_separatiepaneel_aac_5_750"
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
