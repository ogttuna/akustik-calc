import type { MaterialCategory, ResolvedLayer } from "@dynecho/shared";

import { clamp, log10, round1 } from "./math";

type LayerAnalysis = {
  airGapCount: number;
  leafSurfaceMassesKgM2: number[];
  solidLayerCount: number;
  totalSurfaceMassKgM2: number;
  weightedSolidDensityKgM3: number;
};

function isSolidCategory(category: MaterialCategory): boolean {
  return category === "mass" || category === "finish";
}

function analyzeLayers(layers: readonly ResolvedLayer[]): LayerAnalysis {
  let currentLeafSurfaceMassKgM2 = 0;
  let solidSurfaceMassKgM2 = 0;
  let weightedDensityAccumulator = 0;
  let solidLayerCount = 0;
  const leafSurfaceMassesKgM2: number[] = [];

  for (const layer of layers) {
    if (layer.material.category === "gap") {
      if (currentLeafSurfaceMassKgM2 > 0) {
        leafSurfaceMassesKgM2.push(currentLeafSurfaceMassKgM2);
        currentLeafSurfaceMassKgM2 = 0;
      }

      continue;
    }

    if (!isSolidCategory(layer.material.category)) {
      continue;
    }

    solidLayerCount += 1;
    currentLeafSurfaceMassKgM2 += layer.surfaceMassKgM2;
    solidSurfaceMassKgM2 += layer.surfaceMassKgM2;
    weightedDensityAccumulator += layer.material.densityKgM3 * layer.surfaceMassKgM2;
  }

  if (currentLeafSurfaceMassKgM2 > 0) {
    leafSurfaceMassesKgM2.push(currentLeafSurfaceMassKgM2);
  }

  return {
    airGapCount: layers.filter((layer) => layer.material.category === "gap").length,
    leafSurfaceMassesKgM2,
    solidLayerCount,
    totalSurfaceMassKgM2: layers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0),
    weightedSolidDensityKgM3:
      solidSurfaceMassKgM2 > 0 ? weightedDensityAccumulator / solidSurfaceMassKgM2 : 0
  };
}

function lightweightPenaltyDb(analysis: LayerAnalysis): number {
  const density = analysis.weightedSolidDensityKgM3;
  let penalty = 0;

  if (density < 550) {
    penalty += 8;
  } else if (density < 800) {
    penalty += 5;
  } else if (density < 1_200) {
    penalty += 3.5;
  } else if (density < 1_600) {
    penalty += 1.5;
  }

  if (analysis.totalSurfaceMassKgM2 < 20) {
    penalty += 1.5;
  } else if (analysis.totalSurfaceMassKgM2 < 40) {
    penalty += 0.5;
  }

  return penalty;
}

function cavityPenaltyDb(
  layers: readonly ResolvedLayer[],
  analysis: LayerAnalysis
): number {
  if (analysis.airGapCount === 0 || analysis.leafSurfaceMassesKgM2.length < 2) {
    return 0;
  }

  const minLeafMassKgM2 = Math.min(...analysis.leafSurfaceMassesKgM2);
  const maxLeafMassKgM2 = Math.max(...analysis.leafSurfaceMassesKgM2);
  const balanceRatio = minLeafMassKgM2 / Math.max(maxLeafMassKgM2, 1e-6);
  const hasInsulation = layers.some((layer) => layer.material.category === "insulation");
  let penalty = 0;

  if (minLeafMassKgM2 < 15) {
    penalty += 4.5;
  } else if (minLeafMassKgM2 < 40) {
    penalty += 3;
  } else if (minLeafMassKgM2 < 80) {
    penalty += 2;
  } else {
    penalty += 1;
  }

  if (balanceRatio > 0.6) {
    penalty += 1;
  }

  if (maxLeafMassKgM2 > 150) {
    penalty -= 2;
  } else if (maxLeafMassKgM2 > 90) {
    penalty -= 0.5;
  }

  if (hasInsulation) {
    penalty -= 0.5;
  }

  return Math.max(0, penalty);
}

function heavyCompositeBonusDb(analysis: LayerAnalysis): number {
  if (analysis.airGapCount > 0 || analysis.solidLayerCount < 2) {
    return 0;
  }

  if (analysis.totalSurfaceMassKgM2 >= 400 && analysis.weightedSolidDensityKgM3 >= 1_800) {
    return 1.5;
  }

  if (analysis.totalSurfaceMassKgM2 >= 280 && analysis.weightedSolidDensityKgM3 >= 1_600) {
    return 0.5;
  }

  return 0;
}

export function estimateRwDb(layers: readonly ResolvedLayer[]): number {
  const analysis = analyzeLayers(layers);
  const baseRating = (19 * log10(Math.max(analysis.totalSurfaceMassKgM2, 1))) + 8;
  const rating =
    baseRating -
    lightweightPenaltyDb(analysis) -
    cavityPenaltyDb(layers, analysis) +
    heavyCompositeBonusDb(analysis);

  return round1(clamp(rating, 18, 82));
}

export function buildEstimateWarnings(
  layers: readonly ResolvedLayer[],
  calculatorLabel?: string
): string[] {
  const analysis = analyzeLayers(layers);
  const warnings =
    typeof calculatorLabel === "string" && calculatorLabel.length > 0
      ? [
          `Airborne estimate is using the ${calculatorLabel} path instead of the screening seed.`,
          "The selected airborne lane is local to this repo; higher-order family solvers and broader comparison envelopes are still being expanded."
        ]
      : [
          "Screening estimate only. This result is coming from the local calibrated seed lane.",
          "Derived C, Ctr, and STC values are currently built from a calibrated mass-law curve anchored to the screening Rw estimate."
        ];

  if (analysis.airGapCount > 0) {
    warnings.push(
      calculatorLabel
        ? "Cavity assemblies are running on a selected local airborne lane; topology-specific dynamic branches are still maturing."
        : "Cavity assemblies are currently screened with a conservative local heuristic."
    );
  }

  if (analysis.weightedSolidDensityKgM3 > 0 && analysis.weightedSolidDensityKgM3 < 1_400) {
    warnings.push(
      calculatorLabel
        ? "Lightweight assemblies still need broader local family coverage before the selected airborne lane can be treated as the highest-confidence path."
        : "Lightweight assemblies remain less reliable than dense mineral constructions in the current seed engine."
    );
  }

  return warnings;
}
