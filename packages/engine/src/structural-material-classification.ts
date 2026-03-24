import type {
  ImpactPredictorInput,
  ImpactSupportingElementFamily,
  MaterialDefinition
} from "@dynecho/shared";

function buildSearchText(material: Pick<MaterialDefinition, "id" | "name" | "tags">): string {
  return [material.id, material.name, ...(material.tags ?? [])]
    .filter((value) => value && value.trim().length > 0)
    .join(" ")
    .toLowerCase();
}

export function inferStructuralSupportTypeFromMaterial(
  material: Pick<MaterialDefinition, "id" | "name" | "tags">
): ImpactPredictorInput["structuralSupportType"] | undefined {
  switch (material.id) {
    case "concrete":
      return "reinforced_concrete";
    case "hollow_core_plank":
    case "hollow_core_slab":
      return "hollow_core";
    case "open_web_steel_floor":
    case "open_web_steel_joist":
    case "steel_joist_floor":
    case "lightweight_steel_floor":
      return "steel_joists";
    case "timber_frame_floor":
    case "timber_joist_floor":
    case "engineered_timber_structural":
    case "solid_wood":
      return "timber_joists";
    case "open_box_timber_slab":
      return "open_box_timber";
    case "clt_panel":
      return "mass_timber_clt";
    case "composite_steel_deck":
    case "composite_panel":
    case "composite_panel_floor":
    case "steel_deck_composite":
      return "composite_panel";
  }

  const searchText = buildSearchText(material);

  if (/hollow[\s_-]*core|precast/.test(searchText)) {
    return "hollow_core";
  }

  if (/\bclt\b|cross[\s_-]*laminated/.test(searchText)) {
    return "mass_timber_clt";
  }

  if (/open[\s_-]*box/.test(searchText)) {
    return "open_box_timber";
  }

  if (/composite|steel[\s_-]*deck|deck[\s_-]*composite/.test(searchText)) {
    return "composite_panel";
  }

  if (/open[\s_-]*web|steel[\s_-]*joist|lightweight[\s_-]*steel|metal[\s_-]*deck/.test(searchText)) {
    return "steel_joists";
  }

  if (/timber[\s_-]*(frame|joist)|wood[\s_-]*joist|engineered[\s_-]*timber|solid[\s_-]*wood/.test(searchText)) {
    return "timber_joists";
  }

  if (/reinforced[\s_-]*concrete|\bheavy[\s_-]*base\b|\bconcrete\b|\brc\b/.test(searchText)) {
    return "reinforced_concrete";
  }

  return undefined;
}

export function inferBaseSlabMaterialClassFromMaterial(
  material: Pick<MaterialDefinition, "id" | "name" | "tags">
): NonNullable<ImpactPredictorInput["baseSlab"]>["materialClass"] | undefined {
  const supportType = inferStructuralSupportTypeFromMaterial(material);
  const searchText = buildSearchText(material);

  switch (supportType) {
    case "reinforced_concrete":
      return "heavy_concrete";
    case "hollow_core":
      return "hollow_core_plank";
    case "open_box_timber":
      return "open_box_timber_slab";
    case "mass_timber_clt":
      return "clt_panel";
    case "composite_panel":
      return "composite_panel";
    case "timber_joists":
      return /timber[\s_-]*frame/.test(searchText) ? "timber_frame_floor" : "timber_joist_floor";
    default:
      return undefined;
  }
}

export function inferSupportFormFromMaterial(
  material: Pick<MaterialDefinition, "id" | "name" | "tags">
): ImpactPredictorInput["supportForm"] | undefined {
  const supportType = inferStructuralSupportTypeFromMaterial(material);
  const searchText = buildSearchText(material);

  if (supportType === "steel_joists") {
    if (/open[\s_-]*web|rolled/.test(searchText)) {
      return "open_web_or_rolled";
    }

    if (/joist|purlin/.test(searchText)) {
      return "joist_or_purlin";
    }
  }

  return undefined;
}

export function inferImpactSupportingElementFamilyFromMaterial(
  material: Pick<MaterialDefinition, "id" | "name" | "tags"> | null | undefined
): ImpactSupportingElementFamily | null {
  if (!material) {
    return null;
  }

  switch (inferStructuralSupportTypeFromMaterial(material)) {
    case "reinforced_concrete":
      return "reinforced_concrete";
    case "hollow_core":
      return "hollow_core";
    case "steel_joists":
      return "steel_joists";
    case "timber_joists":
      return "timber_joists";
    case "open_box_timber":
      return "open_box_timber";
    case "mass_timber_clt":
      return "mass_timber_clt";
    case "composite_panel":
      return "composite_panel";
    default:
      return null;
  }
}
