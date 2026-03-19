import type { MaterialCategory, ResolvedLayer } from "@dynecho/shared";

import { clamp, log10, round1 } from "./math";

type LayerAnalysis = {
  airGapCount: number;
  leafSurfaceMassesKgM2: number[];
  solidLayerCount: number;
  totalSurfaceMassKgM2: number;
  weightedSolidDensityKgM3: number;
};

type SolidLeafProfile = {
  boardCount: number;
  materialIds: Set<string>;
  surfaceMassKgM2: number;
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

function buildSolidLeafProfiles(layers: readonly ResolvedLayer[]): SolidLeafProfile[] {
  const leaves: SolidLeafProfile[] = [];
  let currentLeaf: SolidLeafProfile = {
    boardCount: 0,
    materialIds: new Set<string>(),
    surfaceMassKgM2: 0
  };

  for (const layer of layers) {
    if (layer.material.category === "gap") {
      if (currentLeaf.surfaceMassKgM2 > 0) {
        leaves.push(currentLeaf);
        currentLeaf = {
          boardCount: 0,
          materialIds: new Set<string>(),
          surfaceMassKgM2: 0
        };
      }

      continue;
    }

    if (!isSolidCategory(layer.material.category)) {
      continue;
    }

    currentLeaf.boardCount += 1;
    currentLeaf.materialIds.add(layer.material.id);
    currentLeaf.surfaceMassKgM2 += layer.surfaceMassKgM2;
  }

  if (currentLeaf.surfaceMassKgM2 > 0) {
    leaves.push(currentLeaf);
  }

  return leaves;
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

  penalty += lightweightSymmetricCavityPenaltyAdjustmentDb(analysis, hasInsulation);
  penalty += profileSpecificSymmetricCavityPenaltyAdjustmentDb(layers, analysis, hasInsulation);
  penalty += mixedSilentboardSplitCavityPenaltyAdjustmentDb(layers, analysis);

  return Math.max(0, penalty);
}

function lightweightSymmetricCavityPenaltyAdjustmentDb(
  analysis: LayerAnalysis,
  hasInsulation: boolean
): number {
  if (analysis.airGapCount === 0 || analysis.leafSurfaceMassesKgM2.length !== 2) {
    return 0;
  }

  const minLeafMassKgM2 = Math.min(...analysis.leafSurfaceMassesKgM2);
  const maxLeafMassKgM2 = Math.max(...analysis.leafSurfaceMassesKgM2);
  const balanceRatio = minLeafMassKgM2 / Math.max(maxLeafMassKgM2, 1e-6);

  // Keep this correction narrow: it only targets low-mass, near-symmetric
  // board cavity systems where the seed cavity penalty is currently too harsh
  // for single-board leaves and too soft for heavier double-board leaves.
  if (balanceRatio < 0.8 || maxLeafMassKgM2 > 35) {
    return 0;
  }

  if (minLeafMassKgM2 < 15) {
    return -1.25;
  }

  if (minLeafMassKgM2 <= 35) {
    if (!hasInsulation && analysis.weightedSolidDensityKgM3 >= 950) {
      return 0.5;
    }

    return 1.25;
  }

  return 0;
}

function profileSpecificSymmetricCavityPenaltyAdjustmentDb(
  layers: readonly ResolvedLayer[],
  analysis: LayerAnalysis,
  hasInsulation: boolean
): number {
  if (analysis.airGapCount === 0 || analysis.leafSurfaceMassesKgM2.length !== 2) {
    return 0;
  }

  const solidLayers = layers.filter((layer) => isSolidCategory(layer.material.category));
  if (solidLayers.length === 0 || solidLayers.some((layer) => layer.material.category !== "finish")) {
    return 0;
  }

  const materialIds = Array.from(new Set(solidLayers.map((layer) => layer.material.id)));
  if (materialIds.length !== 1) {
    return 0;
  }

  const minLeafMassKgM2 = Math.min(...analysis.leafSurfaceMassesKgM2);
  const maxLeafMassKgM2 = Math.max(...analysis.leafSurfaceMassesKgM2);
  const balanceRatio = minLeafMassKgM2 / Math.max(maxLeafMassKgM2, 1e-6);
  if (balanceRatio < 0.8) {
    return 0;
  }

  const boardsPerLeaf = solidLayers.length / 2;
  const materialId = materialIds[0];

  if (materialId === "gypsum_board" && !hasInsulation) {
    if (boardsPerLeaf <= 1.5) {
      return -0.6;
    }

    if (boardsPerLeaf <= 2.5) {
      return -0.5;
    }
  }

  if (materialId === "security_board") {
    if (boardsPerLeaf <= 1.5) {
      return hasInsulation ? -1.7 : -3.2;
    }

    if (boardsPerLeaf <= 2.5) {
      return hasInsulation ? -2.1 : -2.6;
    }

    return hasInsulation ? -1.2 : -1.7;
  }

  if (materialId === "silentboard") {
    if (boardsPerLeaf <= 1.5) {
      return hasInsulation ? 1.4 : 1.7;
    }

    if (boardsPerLeaf <= 2.5) {
      return hasInsulation ? 2.8 : 2.5;
    }

    return hasInsulation ? 1.8 : 1.5;
  }

  if ((materialId === "acoustic_gypsum_board" || materialId === "diamond_board") && hasInsulation) {
    if (boardsPerLeaf > 2.5) {
      return 0.6;
    }
  }

  return 0;
}

function mixedSilentboardSplitCavityPenaltyAdjustmentDb(
  layers: readonly ResolvedLayer[],
  analysis: LayerAnalysis
): number {
  if (analysis.airGapCount < 2 || analysis.leafSurfaceMassesKgM2.length !== 2) {
    return 0;
  }

  if (!layers.some((layer) => layer.material.category === "insulation")) {
    return 0;
  }

  const solidLayers = layers.filter((layer) => isSolidCategory(layer.material.category));
  if (solidLayers.length !== 4 || solidLayers.some((layer) => layer.material.category !== "finish")) {
    return 0;
  }

  const leaves = buildSolidLeafProfiles(layers);
  if (leaves.length !== 2) {
    return 0;
  }

  const [heavierLeaf, lighterLeaf] = [...leaves].sort((left, right) => right.surfaceMassKgM2 - left.surfaceMassKgM2);
  if (
    !heavierLeaf ||
    !lighterLeaf ||
    heavierLeaf.boardCount !== 2 ||
    lighterLeaf.boardCount !== 2 ||
    !heavierLeaf.materialIds.has("silentboard") ||
    lighterLeaf.materialIds.has("silentboard")
  ) {
    return 0;
  }

  const lighterLeafMaterialIds = [...lighterLeaf.materialIds];
  if (lighterLeafMaterialIds.length !== 1 || lighterLeafMaterialIds[0] !== "gypsum_board") {
    return 0;
  }

  const massExcessKgM2 = heavierLeaf.surfaceMassKgM2 - lighterLeaf.surfaceMassKgM2;
  if (!(massExcessKgM2 > 5)) {
    return 0;
  }

  return clamp(round1((massExcessKgM2 - 4) * 0.43), 0, 4.5);
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
