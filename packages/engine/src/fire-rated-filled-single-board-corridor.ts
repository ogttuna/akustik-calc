import type { AirborneContext, ResolvedLayer } from "@dynecho/shared";

import { clamp } from "./math";

export type FireRatedFilledSingleBoardFamily =
  | "fire_fire"
  | "fire_firestop"
  | "firestop_firestop";

export type FireRatedFilledSingleBoardProfile = "resilient" | "steel";

export const FIRE_RATED_FILLED_SINGLE_BOARD_LAB_TARGET_RW = {
  fire_fire: {
    resilient: { 35: 46, 42: 48, 50: 48, 60: 49 },
    steel: { 35: 42, 42: 43, 50: 45, 60: 45 }
  },
  fire_firestop: {
    resilient: { 35: 46, 42: 48, 50: 48, 60: 49 },
    steel: { 35: 42, 42: 44, 50: 45, 60: 46 }
  },
  firestop_firestop: {
    resilient: { 35: 47, 42: 48, 50: 48, 60: 50 },
    steel: { 35: 42, 42: 43, 50: 44, 60: 45 }
  }
} as const;

export const FIRE_RATED_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME = {
  fire_fire: {
    resilient: { 35: 44, 42: 46, 50: 45, 60: 47 },
    steel: { 35: 30, 42: 31, 50: 33, 60: 33 }
  },
  fire_firestop: {
    resilient: { 35: 44, 42: 46, 50: 45, 60: 47 },
    steel: { 35: 30, 42: 31, 50: 33, 60: 34 }
  },
  firestop_firestop: {
    resilient: { 35: 44, 42: 46, 50: 46, 60: 47 },
    steel: { 35: 30, 42: 31, 50: 32, 60: 33 }
  }
} as const;

function isFireRatedBoardLayer(layer: ResolvedLayer): boolean {
  return (
    layer.materialId === "fire_board" ||
    layer.materialId === "firestop_board" ||
    /\bfire(?:stop)?\b/i.test(`${layer.materialId} ${layer.material.name}`.toLowerCase())
  );
}

function isNominalSingleBoardThickness(thicknessMm: number): boolean {
  return thicknessMm >= 12 && thicknessMm <= 15.5;
}

export function getFireRatedFilledSingleBoardProfile(
  context?: AirborneContext | null
): FireRatedFilledSingleBoardProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function detectFireRatedFilledSingleBoardFamily(
  layers: readonly ResolvedLayer[]
): { family: FireRatedFilledSingleBoardFamily; fillThicknessMm: number } | null {
  if (layers.length !== 3) {
    return null;
  }

  const [leftLayer, cavityLayer, rightLayer] = layers;
  if (!leftLayer || !cavityLayer || !rightLayer) {
    return null;
  }

  if (!(isFireRatedBoardLayer(leftLayer) && isFireRatedBoardLayer(rightLayer))) {
    return null;
  }

  if (!(isNominalSingleBoardThickness(leftLayer.thicknessMm) && isNominalSingleBoardThickness(rightLayer.thicknessMm))) {
    return null;
  }

  if (cavityLayer.materialId !== "rockwool") {
    return null;
  }

  if (cavityLayer.thicknessMm < 35 || cavityLayer.thicknessMm > 60) {
    return null;
  }

  const firestopCount = [leftLayer, rightLayer].filter((layer) => layer.materialId === "firestop_board").length;
  const family: FireRatedFilledSingleBoardFamily =
    firestopCount >= 2
      ? "firestop_firestop"
      : firestopCount === 1
        ? "fire_firestop"
        : "fire_fire";

  return {
    family,
    fillThicknessMm: clamp(cavityLayer.thicknessMm, 35, 60)
  };
}
