import type { ImpactCalculation, ResolvedLayer } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import { ksRound1, log10Safe, round1 } from "./math";
import { inferStructuralSupportTypeFromMaterial } from "./structural-material-classification";

const IMPACT_LOAD_ROLES = new Set(["floating_screed", "upper_fill", "floor_covering"]);

function isHeavyConcreteBase(layer: ResolvedLayer): boolean {
  return (
    inferStructuralSupportTypeFromMaterial(layer.material) === "reinforced_concrete" ||
    layer.material.tags.includes("heavy-base")
  );
}

function isResilientSeparator(layer: ResolvedLayer): boolean {
  return Number.isFinite(layer.material.impact?.dynamicStiffnessMNm3);
}

function computeBareMassiveFloorLnWEstimate(surfaceMassKgM2: number): number {
  return 164 - (35 * log10Safe(surfaceMassKgM2));
}

function computeFloatingFloorDeltaLwEstimate(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return (13 * log10Safe(loadSurfaceMassKgM2)) - (14.2 * log10Safe(dynamicStiffnessMNm3)) + 20.8;
}

function computeFloatingFloorResonanceHz(loadSurfaceMassKgM2: number, dynamicStiffnessMNm3: number): number {
  return 160 * Math.sqrt(dynamicStiffnessMNm3 / loadSurfaceMassKgM2);
}

function isMassBearingImpactLayer(layer: ResolvedLayer): boolean {
  return layer.material.category !== "gap" && layer.material.category !== "insulation" && layer.material.category !== "support";
}

function findBaseIndex(layers: readonly ResolvedLayer[]): number {
  const roleIndex = layers.findLastIndex((layer) => layer.floorRole === "base_structure");
  return roleIndex >= 0 ? roleIndex : layers.length - 1;
}

function findResilientIndex(layersAboveBase: readonly ResolvedLayer[]): number {
  const roleIndex = layersAboveBase.findLastIndex((layer) => layer.floorRole === "resilient_layer");
  if (roleIndex >= 0) {
    return roleIndex;
  }

  return layersAboveBase.findLastIndex((layer) => isResilientSeparator(layer));
}

function resolveLoadLayers(
  layersAboveBase: readonly ResolvedLayer[],
  resilientIndex: number
): ResolvedLayer[] {
  const explicitLoadLayers = layersAboveBase.filter((layer, index) => {
    if (index >= resilientIndex || !layer.floorRole) {
      return false;
    }

    return IMPACT_LOAD_ROLES.has(layer.floorRole);
  });

  if (explicitLoadLayers.length > 0) {
    return explicitLoadLayers.filter((layer) => isMassBearingImpactLayer(layer));
  }

  return layersAboveBase.slice(0, resilientIndex).filter((layer) => isMassBearingImpactLayer(layer));
}

export function estimateImpactFromLayers(layers: readonly ResolvedLayer[]): ImpactCalculation | null {
  if (layers.length === 0) {
    return null;
  }

  const baseIndex = findBaseIndex(layers);
  const baseLayer = layers[baseIndex];
  if (!baseLayer || !isHeavyConcreteBase(baseLayer)) {
    return null;
  }

  const layersAboveBase = layers.slice(0, baseIndex);
  const layersParticipatingInBareEstimate = layers.slice(0, baseIndex + 1);
  const resilientIndex = findResilientIndex(layersAboveBase);

  if (resilientIndex === -1) {
    const baseSurfaceMassKgM2 = round1(
      layersParticipatingInBareEstimate.reduce((sum, layer) => {
        if (!isMassBearingImpactLayer(layer)) {
          return sum;
        }

        return sum + layer.surfaceMassKgM2;
      }, 0)
    );

    if (!(baseSurfaceMassKgM2 > 0)) {
      return null;
    }

    const bareReferenceLnW = ksRound1(computeBareMassiveFloorLnWEstimate(baseSurfaceMassKgM2));

    return {
      LnW: bareReferenceLnW,
      availableOutputs: ["Ln,w"],
      bareReferenceLnW,
      baseSurfaceMassKgM2,
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      confidence: getImpactConfidenceForBasis("predictor_heavy_bare_floor_iso12354_annexc_estimate"),
      metricBasis: buildUniformImpactMetricBasis(
        {
          LnW: bareReferenceLnW
        },
        "predictor_bare_massive_floor_iso12354_annexc_estimate"
      ),
      notes: [
        "Ln,w is using the narrow heavy-floor estimate path only.",
        `Bare heavy floor estimate used Ln,w ≈ 164 - 35 log10(m'), with m' = ${baseSurfaceMassKgM2} kg/m².`
      ],
      scope: "narrow_heavy_concrete_only"
    };
  }

  if (resilientIndex !== layersAboveBase.length - 1) {
    return null;
  }

  const resilientLayer = layersAboveBase[resilientIndex];
  const dynamicStiffnessMNm3 = resilientLayer.material.impact?.dynamicStiffnessMNm3;

  if (!(dynamicStiffnessMNm3 && dynamicStiffnessMNm3 > 0)) {
    return null;
  }

  const loadLayers = resolveLoadLayers(layersAboveBase, resilientIndex);

  if (loadLayers.length === 0) {
    return null;
  }

  const floatingScreedSurfaceMassKgM2 = round1(
    loadLayers.reduce((sum, layer) => sum + (layer.material.category === "mass" ? layer.surfaceMassKgM2 : 0), 0)
  );
  const floorCoveringSurfaceMassKgM2 = round1(
    loadLayers.reduce((sum, layer) => sum + (layer.material.category === "finish" ? layer.surfaceMassKgM2 : 0), 0)
  );
  const floatingLoadSurfaceMassKgM2 = round1(floatingScreedSurfaceMassKgM2 + floorCoveringSurfaceMassKgM2);
  const baseSurfaceMassKgM2 = round1(baseLayer.surfaceMassKgM2);

  if (!(floatingLoadSurfaceMassKgM2 > 0) || !(baseSurfaceMassKgM2 > 0)) {
    return null;
  }

  const bareReferenceLnW = computeBareMassiveFloorLnWEstimate(baseSurfaceMassKgM2);
  const deltaLw = computeFloatingFloorDeltaLwEstimate(floatingLoadSurfaceMassKgM2, dynamicStiffnessMNm3);
  const predictorResonanceHz = computeFloatingFloorResonanceHz(floatingLoadSurfaceMassKgM2, dynamicStiffnessMNm3);

  if (!Number.isFinite(bareReferenceLnW) || !Number.isFinite(deltaLw) || !Number.isFinite(predictorResonanceHz)) {
    return null;
  }

  const roundedBareReferenceLnW = ksRound1(bareReferenceLnW);
  const roundedDeltaLw = ksRound1(deltaLw);

  return {
    LnW: ksRound1(bareReferenceLnW - deltaLw),
    DeltaLw: roundedDeltaLw,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bareReferenceLnW: roundedBareReferenceLnW,
    baseSurfaceMassKgM2,
    basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
    confidence: getImpactConfidenceForBasis("predictor_heavy_floating_floor_iso12354_annexc_estimate"),
    metricBasis: buildUniformImpactMetricBasis(
      {
        DeltaLw: roundedDeltaLw,
        LnW: ksRound1(bareReferenceLnW - deltaLw)
      },
      "predictor_heavy_floating_floor_iso12354_annexc_estimate"
    ),
    floatingLoadSurfaceMassKgM2,
    floatingScreedSurfaceMassKgM2: floatingScreedSurfaceMassKgM2 > 0 ? floatingScreedSurfaceMassKgM2 : undefined,
    floorCoveringSurfaceMassKgM2: floorCoveringSurfaceMassKgM2 > 0 ? floorCoveringSurfaceMassKgM2 : undefined,
    notes: [
      "Ln,w and DeltaLw are using the narrow heavy-concrete floating-floor estimate path only.",
      `Heavy floating-floor estimate used DeltaLw ≈ 13 log10(m'load) - 14.2 log10(s') + 20.8, with m'load = ${floatingLoadSurfaceMassKgM2} kg/m² and s' = ${ksRound1(dynamicStiffnessMNm3)} MN/m³.`,
      `Resonance check used f0 ≈ 160 * sqrt(s'/m'load) = ${ksRound1(predictorResonanceHz)} Hz.`
    ],
    predictorResonanceHz: ksRound1(predictorResonanceHz),
    resilientDynamicStiffnessMNm3: ksRound1(dynamicStiffnessMNm3),
    scope: "narrow_heavy_concrete_only"
  };
}
