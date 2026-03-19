import type { AirborneContext, ResolvedLayer } from "@dynecho/shared";

import { clamp } from "./math";

export type SymmetricEnhancedFilledSingleBoardFamily = "acoustic" | "diamond" | "silent";
export type SymmetricEnhancedFilledSingleBoardProfile = "resilient" | "steel";

export const SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW = {
  acoustic: {
    resilient: { 35: 48, 42: 49, 50: 49, 60: 51 },
    steel: { 35: 43, 42: 46, 50: 46, 60: 47 }
  },
  diamond: {
    resilient: { 35: 50, 42: 51, 50: 51, 60: 52 },
    steel: { 35: 46, 42: 47, 50: 49, 60: 49 }
  },
  silent: {
    resilient: { 35: 49, 42: 50, 50: 51, 60: 51 },
    steel: { 35: 46, 42: 46, 50: 48, 60: 49 }
  }
} as const;

export const SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME = {
  acoustic: {
    resilient: { 35: 46, 42: 46, 50: 47, 60: 49 },
    steel: { 35: 31, 42: 33, 50: 33, 60: 35 }
  },
  diamond: {
    resilient: { 35: 47, 42: 49, 50: 49, 60: 50 },
    steel: { 35: 34, 42: 35, 50: 37, 60: 37 }
  },
  silent: {
    resilient: { 35: 46, 42: 48, 50: 48, 60: 49 },
    steel: { 35: 34, 42: 34, 50: 36, 60: 37 }
  }
} as const;

function getFamilyForLayer(layer: ResolvedLayer): SymmetricEnhancedFilledSingleBoardFamily | null {
  if (layer.material.id === "acoustic_gypsum_board") return "acoustic";
  if (layer.material.id === "diamond_board") return "diamond";
  if (layer.material.id === "silentboard") return "silent";
  return null;
}

function isNominalSingleBoardThickness(family: SymmetricEnhancedFilledSingleBoardFamily, thicknessMm: number): boolean {
  if (family === "diamond") {
    return thicknessMm >= 17 && thicknessMm <= 19;
  }

  return thicknessMm >= 12 && thicknessMm <= 15.5;
}

export function getSymmetricEnhancedFilledSingleBoardProfile(
  context?: AirborneContext | null
): SymmetricEnhancedFilledSingleBoardProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function detectSymmetricEnhancedFilledSingleBoardFamily(
  layers: readonly ResolvedLayer[]
): { family: SymmetricEnhancedFilledSingleBoardFamily; fillThicknessMm: number } | null {
  if (layers.length !== 3) {
    return null;
  }

  const [leftLayer, cavityLayer, rightLayer] = layers;
  if (!leftLayer || !cavityLayer || !rightLayer) {
    return null;
  }

  if (cavityLayer.material.id !== "rockwool") {
    return null;
  }

  if (cavityLayer.thicknessMm < 35 || cavityLayer.thicknessMm > 60) {
    return null;
  }

  const leftFamily = getFamilyForLayer(leftLayer);
  const rightFamily = getFamilyForLayer(rightLayer);
  if (!leftFamily || leftFamily !== rightFamily) {
    return null;
  }

  if (
    !isNominalSingleBoardThickness(leftFamily, leftLayer.thicknessMm) ||
    !isNominalSingleBoardThickness(rightFamily, rightLayer.thicknessMm)
  ) {
    return null;
  }

  return {
    family: leftFamily,
    fillThicknessMm: clamp(cavityLayer.thicknessMm, 35, 60)
  };
}
