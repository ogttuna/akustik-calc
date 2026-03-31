import type { ImpactPredictorInput, ResolvedLayer } from "@dynecho/shared";

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
