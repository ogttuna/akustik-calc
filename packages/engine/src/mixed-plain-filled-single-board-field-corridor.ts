import type { AirborneContext, ResolvedLayer } from "@dynecho/shared";

import { clamp } from "./math";

export type MixedPlainFilledSingleBoardFamily =
  | "acoustic"
  | "diamond"
  | "fire"
  | "firestop"
  | "silent";

export type MixedPlainFilledSingleBoardProfile = "resilient" | "steel";

export const MIXED_PLAIN_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME = {
  acoustic: {
    resilient: { 35: 45, 42: 45, 50: 46, 60: 47 },
    steel: { 35: 30, 42: 32, 50: 32, 60: 34 }
  },
  diamond: {
    resilient: { 35: 45, 42: 46, 50: 47, 60: 48 },
    steel: { 35: 30, 42: 32, 50: 33, 60: 34 }
  },
  fire: {
    resilient: { 35: 43, 42: 43, 50: 44, 60: 46 },
    steel: { 35: 27, 42: 30, 50: 29, 60: 31 }
  },
  firestop: {
    resilient: { 35: 44, 42: 44, 50: 45, 60: 46 },
    steel: { 35: 29, 42: 29, 50: 30, 60: 32 }
  },
  silent: {
    resilient: { 35: 45, 42: 45, 50: 47, 60: 47 },
    steel: { 35: 32.5, 42: 31.5, 50: 32.5, 60: 35.5 }
  }
} as const;

function isNominalGypsumThickness(thicknessMm: number): boolean {
  return thicknessMm >= 12 && thicknessMm <= 15.5;
}

function getMixedPlainFamily(layer: ResolvedLayer): MixedPlainFilledSingleBoardFamily | null {
  switch (layer.materialId) {
    case "acoustic_gypsum_board":
      return "acoustic";
    case "diamond_board":
      return "diamond";
    case "fire_board":
      return "fire";
    case "firestop_board":
      return "firestop";
    case "silentboard":
      return "silent";
    default:
      return null;
  }
}

export function getMixedPlainFilledSingleBoardProfile(
  context?: AirborneContext | null
): MixedPlainFilledSingleBoardProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function detectMixedPlainFilledSingleBoardFamily(
  layers: readonly ResolvedLayer[]
): { family: MixedPlainFilledSingleBoardFamily; fillThicknessMm: number } | null {
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

  const leftIsPlain = leftLayer.materialId === "gypsum_board" && isNominalGypsumThickness(leftLayer.thicknessMm);
  const rightIsPlain = rightLayer.materialId === "gypsum_board" && isNominalGypsumThickness(rightLayer.thicknessMm);
  if (leftIsPlain === rightIsPlain) {
    return null;
  }

  const otherLayer = leftIsPlain ? rightLayer : leftLayer;
  const family = getMixedPlainFamily(otherLayer);
  if (!family) {
    return null;
  }

  return {
    family,
    fillThicknessMm: clamp(cavityLayer.thicknessMm, 35, 60)
  };
}
