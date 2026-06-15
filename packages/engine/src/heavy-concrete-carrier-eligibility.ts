import type { ImpactPredictorInput, MaterialDefinition, ResolvedLayer } from "@dynecho/shared";

export const MIN_HEAVY_CONCRETE_CARRIER_DENSITY_KG_M3 = 2000;

export function isHeavyConcreteCarrierDensityEligible(densityKgM3: number | null | undefined): boolean {
  return typeof densityKgM3 !== "number" || densityKgM3 >= MIN_HEAVY_CONCRETE_CARRIER_DENSITY_KG_M3;
}

export function isPredictorHeavyConcreteCarrierEligible(
  baseSlab: ImpactPredictorInput["baseSlab"] | null | undefined
): boolean {
  if (!baseSlab) {
    return false;
  }

  if (typeof baseSlab.densityKgM3 === "number") {
    return isHeavyConcreteCarrierDensityEligible(baseSlab.densityKgM3);
  }

  const materialClass = (baseSlab.materialClass || "").trim().toLowerCase();
  return materialClass === "concrete" || materialClass === "heavy_concrete";
}

export function isResolvedHeavyConcreteCarrierEligible(
  baseLayer: Pick<ResolvedLayer, "material"> | null | undefined
): boolean {
  if (!baseLayer) {
    return false;
  }

  if (typeof baseLayer.material.densityKgM3 === "number") {
    return isHeavyConcreteCarrierDensityEligible(baseLayer.material.densityKgM3);
  }

  return baseLayer.material.id === "concrete" || baseLayer.material.id === "heavy_concrete";
}

function materialSearchText(material: Pick<MaterialDefinition, "id" | "name" | "tags">): string {
  return [material.id, material.name, ...(material.tags ?? [])]
    .filter((value) => value && value.trim().length > 0)
    .join(" ")
    .toLowerCase();
}

export function isLightweightConcreteCarrierMaterial(
  material: Pick<MaterialDefinition, "densityKgM3" | "id" | "name" | "tags">
): boolean {
  if (material.id === "lightweight_concrete") {
    return true;
  }

  const searchText = materialSearchText(material);
  const hasConcreteSignal = /concrete|reinforced[\s_-]*concrete|\brc\b/.test(searchText);
  if (!hasConcreteSignal) {
    return false;
  }

  const hasLightweightFamilySignal =
    /light[\s_-]*weight|aerated|aircrete|gazbeton|porenbeton/.test(searchText);
  const hasLowDensitySignal = /low[\s_-]*density/.test(searchText);
  const densityAllowsLowDensityClassification =
    typeof material.densityKgM3 !== "number" ||
    !isHeavyConcreteCarrierDensityEligible(material.densityKgM3);

  return hasLightweightFamilySignal || (hasLowDensitySignal && densityAllowsLowDensityClassification);
}
