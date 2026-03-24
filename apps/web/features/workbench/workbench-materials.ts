import { MATERIAL_CATALOG_SEED, materialCatalogById } from "@dynecho/catalogs";
import type { MaterialCategory, MaterialDefinition } from "@dynecho/shared";

export const CUSTOM_WORKBENCH_MATERIAL_TAG = "custom-workbench-material";

export const CUSTOM_MATERIAL_CATEGORY_OPTIONS: readonly { label: string; value: MaterialCategory }[] = [
  { label: "Mass / structural", value: "mass" },
  { label: "Finish / covering", value: "finish" },
  { label: "Insulation / fill", value: "insulation" },
  { label: "Gap / cavity", value: "gap" },
  { label: "Support / resilient", value: "support" }
];

export type CustomMaterialDraft = {
  category: MaterialCategory;
  densityKgM3: string;
  dynamicStiffnessMNm3: string;
  name: string;
  notes: string;
};

export type CustomMaterialDraftErrors = Partial<Record<keyof CustomMaterialDraft, string>>;

function compactNoteLines(...values: Array<string | undefined>): string | undefined {
  const compacted = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value && value.length > 0));

  return compacted.length > 0 ? compacted.join(" ") : undefined;
}

function normalizeSlugPart(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/gu, "")
    .replace(/[_\s-]+/gu, "_")
    .replace(/^_+|_+$/gu, "");
}

function deriveNameTags(name: string): string[] {
  const normalizedName = name.trim().toLowerCase();
  const baseTags = normalizedName
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/[\s-]+/u)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2)
    .map((part) => part.replace(/[^\p{L}\p{N}_]/gu, "_"));

  if (/(board|gypsum|plasterboard|panel)/iu.test(normalizedName)) {
    baseTags.push("board");
  }

  if (/(plaster|render)/iu.test(normalizedName)) {
    baseTags.push("plaster");
  }

  if (/(underlay|mat|resilient|rubber|acoustic mat)/iu.test(normalizedName)) {
    baseTags.push("resilient");
  }

  if (/(air gap|cavity|void)/iu.test(normalizedName)) {
    baseTags.push("cavity");
  }

  if (/(wool|insulation|fiber|mineral wool|glass wool)/iu.test(normalizedName)) {
    baseTags.push("cavity-fill");
  }

  if (/(concrete|clt|slab|deck|joist|beam|plank|structural|timber frame|timber joist)/iu.test(normalizedName)) {
    baseTags.push("structural");
  }

  return Array.from(new Set(baseTags));
}

export function createEmptyCustomMaterialDraft(): CustomMaterialDraft {
  return {
    category: "mass",
    densityKgM3: "",
    dynamicStiffnessMNm3: "",
    name: "",
    notes: ""
  };
}

export function isCustomWorkbenchMaterial(material: Pick<MaterialDefinition, "tags"> | null | undefined): boolean {
  return Boolean(material?.tags?.includes(CUSTOM_WORKBENCH_MATERIAL_TAG));
}

export function getWorkbenchMaterialById(
  materialId: string,
  customMaterials: readonly MaterialDefinition[] = []
): MaterialDefinition | undefined {
  return customMaterials.find((material) => material.id === materialId) ?? materialCatalogById[materialId];
}

export function buildWorkbenchMaterialCatalog(
  customMaterials: readonly MaterialDefinition[] = []
): MaterialDefinition[] {
  const byId = new Map<string, MaterialDefinition>();

  for (const material of customMaterials) {
    byId.set(material.id, material);
  }

  for (const material of MATERIAL_CATALOG_SEED) {
    if (!byId.has(material.id)) {
      byId.set(material.id, material);
    }
  }

  return Array.from(byId.values());
}

export function validateCustomMaterialDraft(
  draft: CustomMaterialDraft,
  existingMaterials: readonly MaterialDefinition[]
): CustomMaterialDraftErrors {
  const errors: CustomMaterialDraftErrors = {};
  const normalizedName = draft.name.trim();

  if (normalizedName.length === 0) {
    errors.name = "Material name is required.";
  } else {
    const normalizedComparison = normalizedName.toLocaleLowerCase("en-US");
    const duplicate = existingMaterials.find((material) => material.name.trim().toLocaleLowerCase("en-US") === normalizedComparison);
    if (duplicate) {
      errors.name = "A material with this name already exists in the current catalog.";
    }
  }

  if (draft.densityKgM3.trim().length === 0) {
    errors.densityKgM3 = "Density is required.";
  } else {
    const densityKgM3 = Number(draft.densityKgM3);
    if (!Number.isFinite(densityKgM3) || densityKgM3 < 0) {
      errors.densityKgM3 = "Density must be zero or greater in kg/m³.";
    } else if (densityKgM3 === 0 && draft.category !== "gap" && draft.category !== "support") {
      errors.densityKgM3 = "Use a density greater than zero unless this is a true gap or support layer.";
    }
  }

  if (draft.dynamicStiffnessMNm3.trim().length > 0) {
    const dynamicStiffnessMNm3 = Number(draft.dynamicStiffnessMNm3);
    if (!Number.isFinite(dynamicStiffnessMNm3) || dynamicStiffnessMNm3 <= 0) {
      errors.dynamicStiffnessMNm3 = "Dynamic stiffness must be a positive MN/m³ value.";
    }
  }

  return errors;
}

function buildCustomMaterialId(name: string, existingMaterials: readonly MaterialDefinition[]): string {
  const base = `custom_${normalizeSlugPart(name) || "material"}`;
  if (!existingMaterials.some((material) => material.id === base)) {
    return base;
  }

  let index = 2;
  while (existingMaterials.some((material) => material.id === `${base}_${index}`)) {
    index += 1;
  }

  return `${base}_${index}`;
}

export function buildCustomMaterialDefinition(input: {
  draft: CustomMaterialDraft;
  existingMaterials: readonly MaterialDefinition[];
}): MaterialDefinition {
  const name = input.draft.name.trim();
  const densityKgM3 = Number(input.draft.densityKgM3);
  const dynamicStiffnessMNm3 =
    input.draft.dynamicStiffnessMNm3.trim().length > 0 ? Number(input.draft.dynamicStiffnessMNm3) : undefined;
  const tags = Array.from(
    new Set([
      CUSTOM_WORKBENCH_MATERIAL_TAG,
      input.draft.category,
      ...deriveNameTags(name),
      ...(typeof dynamicStiffnessMNm3 === "number" ? ["resilient"] : [])
    ])
  );

  return {
    category: input.draft.category,
    densityKgM3,
    id: buildCustomMaterialId(name, input.existingMaterials),
    impact: typeof dynamicStiffnessMNm3 === "number" ? { dynamicStiffnessMNm3 } : undefined,
    name,
    notes: compactNoteLines(input.draft.notes, "Local custom workbench material."),
    tags
  };
}

export function defaultThicknessForMaterial(material: MaterialDefinition): string {
  if (material.id === "generic_resilient_underlay") {
    return "8";
  }

  if (material.id === "mw_t_impact_layer") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s35") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s40") {
    return "30";
  }

  if (material.id === "mw_t_impact_layer_s6") {
    return "40";
  }

  if (material.id === "wf_t_impact_layer_s102") {
    return "10";
  }

  if (material.id === "eps_underlay") {
    return "3";
  }

  if (material.id === "regupol_sonus_curve_8") {
    return "8";
  }

  if (material.id === "regupol_sonus_multi_4_5") {
    return "4.5";
  }

  if (
    material.id === "getzner_afm_21" ||
    material.id === "getzner_afm_23" ||
    material.id === "getzner_afm_26" ||
    material.id === "getzner_afm_29" ||
    material.id === "getzner_afm_33" ||
    material.id === "getzner_afm_35"
  ) {
    return "8";
  }

  if (material.id === "engineered_timber_flooring") {
    return "15";
  }

  if (material.id === "engineered_timber_with_acoustic_underlay") {
    return "20";
  }

  if (material.id === "dry_floating_gypsum_fiberboard") {
    return "25";
  }

  if (material.id === "inex_floor_panel") {
    return "19";
  }

  if (material.id === "carpet_with_foam_underlay") {
    return "11";
  }

  if (material.id === "impactstop_board") {
    return "13";
  }

  if (material.id === "firestop_board") {
    return "16";
  }

  if (material.id === "fire_board") {
    return "20";
  }

  if (material.id === "sheetrock_one") {
    return "10";
  }

  if (material.id === "cement_board") {
    return "12.5";
  }

  if (material.id === "furring_channel") {
    return "28";
  }

  if (material.id === "ceramic_tile") {
    return "8";
  }

  if (material.id === "porcelain_tile") {
    return "10";
  }

  if (material.id === "laminate_flooring") {
    return "8";
  }

  if (material.id === "clt_panel") {
    return "140";
  }

  if (material.id === "concrete") {
    return "150";
  }

  if (material.id === "lightweight_concrete") {
    return "140";
  }

  if (material.id === "heavy_concrete") {
    return "180";
  }

  if (material.id === "solid_brick") {
    return "100";
  }

  if (material.id === "hollow_brick") {
    return "140";
  }

  if (material.id === "aac") {
    return "100";
  }

  if (material.id === "timber_frame_floor") {
    return "220";
  }

  if (material.id === "timber_joist_floor") {
    return "240";
  }

  if (material.id === "open_box_timber_slab") {
    return "370";
  }

  if (material.id === "open_web_steel_floor") {
    return "200";
  }

  if (material.id === "generic_fill") {
    return "40";
  }

  if (material.id === "anhydrite_screed") {
    return "60";
  }

  if (material.id === "bonded_chippings") {
    return "60";
  }

  if (material.id === "non_bonded_chippings") {
    return "120";
  }

  if (material.id === "elastic_bonded_fill") {
    return "60";
  }

  if (material.id === "resilient_channel") {
    return "27";
  }

  if (material.id === "acoustic_hanger_ceiling") {
    return "95";
  }

  if (material.id === "resilient_stud_ceiling") {
    return "25";
  }

  if (material.id === "ubiq_resilient_ceiling") {
    return "65";
  }

  if (material.id === "particleboard_flooring") {
    return "22";
  }

  if (material.id === "osb") {
    return "18";
  }

  if (material.id === "plywood") {
    return "18";
  }

  if (material.id === "mlv") {
    return "5";
  }

  if (material.id === "bitumen_membrane") {
    return "4";
  }

  if (material.id === "high_density_rockwool") {
    return "50";
  }

  if (material.id === "glasswool_board") {
    return "50";
  }

  if (material.id === "cellulose_fill") {
    return "100";
  }

  if (material.id === "wood_wool_panel") {
    return "25";
  }

  if (material.id === "pet_felt") {
    return "12";
  }

  if (material.id === "acoustic_mount_clip") {
    return "60";
  }

  if (material.id === "spring_hanger_track") {
    return "100";
  }

  if (material.id === "gypsum_plaster" || material.id === "lime_plaster") {
    return "15";
  }

  switch (material.category) {
    case "gap":
      return "50";
    case "insulation":
      return "50";
    case "finish":
      return "12.5";
    case "support":
      return "10";
    case "mass":
    default:
      return "100";
  }
}
