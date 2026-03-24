import type {
  BoundFloorSystem,
  ExactFloorSystem,
  FloorSystemEstimateResult,
  ImpactCatalogMatchResult,
  ImpactPredictorInput,
  ImpactSupportingElementFamily,
  ResolvedLayer
} from "@dynecho/shared";
import { inferImpactSupportingElementFamilyFromMaterial } from "./structural-material-classification";

const MATERIAL_ID_TO_SUPPORTING_FAMILY: Record<string, ImpactSupportingElementFamily> = {
  clt_panel: "mass_timber_clt",
  composite_panel: "composite_panel",
  composite_panel_floor: "composite_panel",
  concrete: "reinforced_concrete",
  engineered_timber_structural: "timber_joists",
  hollow_core_plank: "hollow_core",
  hollow_core_slab: "hollow_core",
  open_box_timber_slab: "open_box_timber",
  open_web_steel_floor: "steel_joists",
  open_web_steel_joist: "steel_joists",
  steel_joist_floor: "steel_joists",
  timber_frame_floor: "timber_joists"
};

const STRUCTURAL_SUPPORT_TYPE_TO_FAMILY: Record<
  NonNullable<ImpactPredictorInput["structuralSupportType"]>,
  ImpactSupportingElementFamily
> = {
  composite_panel: "composite_panel",
  hollow_core: "hollow_core",
  mass_timber_clt: "mass_timber_clt",
  open_box_timber: "open_box_timber",
  reinforced_concrete: "reinforced_concrete",
  steel_joists: "steel_joists",
  timber_joists: "timber_joists"
};

function supportingFamilyFromMaterialIds(materialIds: readonly string[] | undefined): ImpactSupportingElementFamily | null {
  if (!materialIds?.length) {
    return null;
  }

  for (const materialId of materialIds) {
    const family = MATERIAL_ID_TO_SUPPORTING_FAMILY[materialId];
    if (family) {
      return family;
    }
  }

  return null;
}

function supportingFamilyFromStructuralFamilyLabel(label: string | null | undefined): ImpactSupportingElementFamily | null {
  if (!label) {
    return null;
  }

  const normalized = label.trim().toLowerCase();

  if (normalized.includes("reinforced concrete")) return "reinforced_concrete";
  if (normalized.includes("hollow core")) return "hollow_core";
  if (normalized.includes("open box timber")) return "open_box_timber";
  if (normalized.includes("mass-timber clt") || normalized.includes("mass timber clt")) return "mass_timber_clt";
  if (normalized.includes("lightweight steel") || normalized.includes("steel")) return "steel_joists";
  if (normalized.includes("composite panel")) return "composite_panel";
  if (normalized.includes("timber frame") || normalized.includes("timber joist")) return "timber_joists";

  return null;
}

export function inferImpactSupportingElementFamilyFromLayers(
  layers: readonly ResolvedLayer[] | null | undefined
): ImpactSupportingElementFamily | null {
  const baseStructure = layers?.find((layer) => layer.floorRole === "base_structure");
  return (
    inferImpactSupportingElementFamilyFromMaterial(baseStructure?.material) ??
    supportingFamilyFromMaterialIds(baseStructure ? [baseStructure.material.id] : undefined)
  );
}

export function inferImpactSupportingElementFamilyFromExactFloorSystem(
  system: ExactFloorSystem | BoundFloorSystem | null | undefined
): ImpactSupportingElementFamily | null {
  return supportingFamilyFromMaterialIds(system?.match.baseStructure?.materialIds);
}

export function inferImpactSupportingElementFamilyFromFloorSystemEstimate(
  estimate: FloorSystemEstimateResult | null | undefined
): ImpactSupportingElementFamily | null {
  const sourceFamily = estimate?.sourceSystems.find((system) => system.match.baseStructure?.materialIds?.length);
  return (
    supportingFamilyFromMaterialIds(sourceFamily?.match.baseStructure?.materialIds) ??
    supportingFamilyFromStructuralFamilyLabel(estimate?.structuralFamily)
  );
}

export function inferImpactSupportingElementFamilyFromImpactCatalogMatch(
  match: ImpactCatalogMatchResult | null | undefined
): ImpactSupportingElementFamily | null {
  return supportingFamilyFromMaterialIds(match?.catalog.match.baseStructure?.materialIds);
}

export function inferImpactSupportingElementFamilyFromPredictorInput(
  predictorInput: ImpactPredictorInput | null | undefined
): ImpactSupportingElementFamily | null {
  if (!predictorInput?.structuralSupportType) {
    return null;
  }

  return STRUCTURAL_SUPPORT_TYPE_TO_FAMILY[predictorInput.structuralSupportType] ?? null;
}
