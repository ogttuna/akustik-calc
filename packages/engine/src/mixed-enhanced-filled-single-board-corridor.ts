import type { AirborneContext, ResolvedLayer } from "@dynecho/shared";

import { clamp } from "./math";

export type MixedEnhancedFilledSingleBoardFamily =
  | "acoustic_diamond"
  | "acoustic_fire"
  | "acoustic_firestop"
  | "acoustic_silent"
  | "diamond_fire"
  | "diamond_firestop"
  | "diamond_silent"
  | "fire_silent"
  | "firestop_silent";

export type MixedEnhancedFilledSingleBoardProfile = "resilient" | "steel";

export const MIXED_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW = {
  acoustic_diamond: {
    resilient: { 35: 49, 42: 50, 50: 50, 60: 52 },
    steel: { 35: 45, 42: 46, 50: 47, 60: 48 }
  },
  acoustic_fire: {
    resilient: { 35: 47, 42: 48, 50: 49, 60: 50 },
    steel: { 35: 43, 42: 44, 50: 45, 60: 46 }
  },
  acoustic_firestop: {
    resilient: { 35: 47, 42: 48, 50: 49, 60: 50 },
    steel: { 35: 43, 42: 45, 50: 45, 60: 46 }
  },
  acoustic_silent: {
    resilient: { 35: 49, 42: 49, 50: 51, 60: 51 },
    steel: { 35: 45, 42: 46, 50: 46, 60: 48 }
  },
  diamond_fire: {
    resilient: { 35: 48, 42: 50, 50: 50, 60: 51 },
    steel: { 35: 44, 42: 45, 50: 47, 60: 47 }
  },
  diamond_firestop: {
    resilient: { 35: 48, 42: 50, 50: 50, 60: 51 },
    steel: { 35: 44, 42: 45, 50: 47, 60: 47 }
  },
  diamond_silent: {
    resilient: { 35: 50, 42: 50, 50: 51, 60: 53 },
    steel: { 35: 45, 42: 47, 50: 47, 60: 49 }
  },
  fire_silent: {
    resilient: { 35: 49, 42: 48, 50: 50, 60: 51 },
    steel: { 35: 44, 42: 45, 50: 45, 60: 47 }
  },
  firestop_silent: {
    resilient: { 35: 49, 42: 48, 50: 50, 60: 51 },
    steel: { 35: 45, 42: 46, 50: 46, 60: 48 }
  }
} as const;

export const MIXED_ENHANCED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME = {
  acoustic_diamond: {
    resilient: { 35: 46, 42: 48, 50: 48, 60: 49 },
    steel: { 35: 33, 42: 34, 50: 35, 60: 36 }
  },
  acoustic_fire: {
    resilient: { 35: 45, 42: 46, 50: 46, 60: 48 },
    steel: { 35: 30, 42: 32, 50: 33, 60: 34 }
  },
  acoustic_firestop: {
    resilient: { 35: 45, 42: 46, 50: 46, 60: 48 },
    steel: { 35: 31, 42: 33, 50: 33, 60: 34 }
  },
  acoustic_silent: {
    resilient: { 35: 47, 42: 47, 50: 48, 60: 49 },
    steel: { 35: 33, 42: 33, 50: 34, 60: 36 }
  },
  diamond_fire: {
    resilient: { 35: 46, 42: 48, 50: 47, 60: 48 },
    steel: { 35: 32, 42: 33, 50: 35, 60: 35 }
  },
  diamond_firestop: {
    resilient: { 35: 46, 42: 48, 50: 47, 60: 49 },
    steel: { 35: 32, 42: 33, 50: 34, 60: 35 }
  },
  diamond_silent: {
    resilient: { 35: 48, 42: 48, 50: 49, 60: 50 },
    steel: { 35: 33, 42: 35, 50: 35, 60: 37 }
  },
  fire_silent: {
    resilient: { 35: 46, 42: 46, 50: 47, 60: 49 },
    steel: { 35: 31, 42: 33, 50: 33, 60: 35 }
  },
  firestop_silent: {
    resilient: { 35: 46, 42: 46, 50: 47, 60: 49 },
    steel: { 35: 33, 42: 34, 50: 34, 60: 36 }
  }
} as const;

function isNominalThickness(materialId: string, thicknessMm: number): boolean {
  switch (materialId) {
    case "diamond_board":
      return thicknessMm >= 16 && thicknessMm <= 19.5;
    case "silentboard":
      return thicknessMm >= 12 && thicknessMm <= 13.5;
    case "acoustic_gypsum_board":
    case "fire_board":
    case "firestop_board":
      return thicknessMm >= 12 && thicknessMm <= 15.5;
    default:
      return false;
  }
}

function canonicalFamilyKey(leftId: string, rightId: string): MixedEnhancedFilledSingleBoardFamily | null {
  const key = [leftId, rightId].sort().join("+");
  switch (key) {
    case "acoustic_gypsum_board+diamond_board":
      return "acoustic_diamond";
    case "acoustic_gypsum_board+fire_board":
      return "acoustic_fire";
    case "acoustic_gypsum_board+firestop_board":
      return "acoustic_firestop";
    case "acoustic_gypsum_board+silentboard":
      return "acoustic_silent";
    case "diamond_board+fire_board":
      return "diamond_fire";
    case "diamond_board+firestop_board":
      return "diamond_firestop";
    case "diamond_board+silentboard":
      return "diamond_silent";
    case "fire_board+silentboard":
      return "fire_silent";
    case "firestop_board+silentboard":
      return "firestop_silent";
    default:
      return null;
  }
}

export function getMixedEnhancedFilledSingleBoardProfile(
  context?: AirborneContext | null
): MixedEnhancedFilledSingleBoardProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function detectMixedEnhancedFilledSingleBoardFamily(
  layers: readonly ResolvedLayer[]
): { family: MixedEnhancedFilledSingleBoardFamily; fillThicknessMm: number } | null {
  if (layers.length !== 3) {
    return null;
  }

  const [leftLayer, cavityLayer, rightLayer] = layers;
  if (!leftLayer || !cavityLayer || !rightLayer) {
    return null;
  }

  if (cavityLayer.materialId !== "rockwool" || cavityLayer.thicknessMm < 35 || cavityLayer.thicknessMm > 60) {
    return null;
  }

  if (
    !isNominalThickness(leftLayer.materialId, leftLayer.thicknessMm) ||
    !isNominalThickness(rightLayer.materialId, rightLayer.thicknessMm)
  ) {
    return null;
  }

  const family = canonicalFamilyKey(leftLayer.materialId, rightLayer.materialId);
  if (!family) {
    return null;
  }

  return {
    family,
    fillThicknessMm: clamp(cavityLayer.thicknessMm, 35, 60)
  };
}
