import type { AirborneContext, ResolvedLayer } from "@dynecho/shared";

import { classifyLayerRole, detectLeafCoreLayout } from "./airborne-topology";
import { clamp } from "./math";

export type SecurityFilledSingleBoardFamily =
  | "acoustic"
  | "diamond"
  | "fire"
  | "firestop"
  | "plain"
  | "security"
  | "silent";

export type SecurityFilledSingleBoardProfile = "resilient" | "steel";
export type SecurityFilledSingleBoardFill = 35 | 42 | 50 | 60;

export const SECURITY_FILLED_SINGLE_BOARD_LAB_TARGET_RW = {
  acoustic: {
    resilient: { 35: 46, 42: 48, 50: 48, 60: 49 },
    steel: { 35: 42, 42: 44, 50: 45, 60: 46 }
  },
  diamond: {
    resilient: { 35: 47, 42: 49, 50: 49, 60: 50 },
    steel: { 35: 43, 42: 44, 50: 46, 60: 46 }
  },
  fire: {
    resilient: { 35: 45, 42: 47, 50: 47, 60: 48 },
    steel: { 35: 42, 42: 42, 50: 45, 60: 45 }
  },
  firestop: {
    resilient: { 35: 45, 42: 47, 50: 47, 60: 48 },
    steel: { 35: 42, 42: 43, 50: 45, 60: 45 }
  },
  plain: {
    resilient: { 35: 44, 42: 45, 50: 46, 60: 47 },
    steel: { 35: 40, 42: 42, 50: 43, 60: 44 }
  },
  security: {
    resilient: { 35: 44, 42: 45, 50: 46, 60: 47 },
    steel: { 35: 41, 42: 41, 50: 43, 60: 44 }
  },
  silent: {
    resilient: { 35: 48, 42: 47, 50: 49, 60: 50 },
    steel: { 35: 43, 42: 45, 50: 45, 60: 47 }
  }
} as const;

export const SECURITY_FILLED_SINGLE_BOARD_FIELD_TARGET_RW_PRIME = {
  acoustic: {
    resilient: { 35: 44, 42: 45, 50: 45, 60: 46 },
    steel: { 35: 30, 42: 31, 50: 33, 60: 34 }
  },
  diamond: {
    resilient: { 35: 45, 42: 47, 50: 46, 60: 47 },
    steel: { 35: 31, 42: 32, 50: 34, 60: 34 }
  },
  fire: {
    resilient: { 35: 43, 42: 44, 50: 44, 60: 45 },
    steel: { 35: 29, 42: 29, 50: 32, 60: 32 }
  },
  firestop: {
    resilient: { 35: 43, 42: 45, 50: 45, 60: 46 },
    steel: { 35: 29, 42: 30, 50: 32, 60: 32 }
  },
  plain: {
    resilient: { 35: 42, 42: 43, 50: 43, 60: 45 },
    steel: { 35: 27, 42: 29, 50: 30, 60: 31 }
  },
  security: {
    resilient: { 35: 41, 42: 43, 50: 43, 60: 44 },
    steel: { 35: 28, 42: 28, 50: 30, 60: 32 }
  },
  silent: {
    resilient: { 35: 45, 42: 45, 50: 46, 60: 48 },
    steel: { 35: 31, 42: 33, 50: 33, 60: 35 }
  }
} as const;

function isBoardLikeLayer(layer: ResolvedLayer): boolean {
  if (!classifyLayerRole(layer).isSolidLeaf) {
    return false;
  }

  return /gypsum|board|plasterboard|firestop|impactstop|acoustic|security|soundbloc|diamond|silentboard|silent[_ ]board/i.test(
    `${layer.material.id} ${layer.material.name}`.toLowerCase()
  );
}

function getBoardFamily(materialId: string): SecurityFilledSingleBoardFamily | null {
  if (materialId === "security_board") return "security";
  if (materialId === "gypsum_board") return "plain";
  if (materialId === "acoustic_gypsum_board") return "acoustic";
  if (materialId === "fire_board") return "fire";
  if (materialId === "firestop_board") return "firestop";
  if (materialId === "diamond_board") return "diamond";
  if (materialId === "silentboard") return "silent";
  return null;
}

export function getSecurityFilledSingleBoardProfile(
  context?: AirborneContext | null
): SecurityFilledSingleBoardProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

export function detectSecurityFilledSingleBoardFamily(
  layers: readonly ResolvedLayer[]
): { family: SecurityFilledSingleBoardFamily; fillThicknessMm: number } | null {
  if (layers.length !== 3) {
    return null;
  }

  const layout = detectLeafCoreLayout(layers);
  if (layout.solidLeafIndexes.length !== 2) {
    return null;
  }

  const boardLayers = layers.filter(isBoardLikeLayer);
  if (boardLayers.length !== 2) {
    return null;
  }

  const securityBoardCount = boardLayers.filter((layer) => layer.material.id === "security_board").length;
  if (!(securityBoardCount >= 1)) {
    return null;
  }

  const cavityLayers = layers.slice(layout.solidLeafIndexes[0] + 1, layout.solidLeafIndexes[1]);
  if (cavityLayers.length !== 1) {
    return null;
  }

  const [cavityLayer] = cavityLayers;
  if (cavityLayer.material.id !== "rockwool") {
    return null;
  }

  const fillThicknessMm = clamp(cavityLayer.thicknessMm, 35, 60);
  const otherBoard = boardLayers.find((layer) => layer.material.id !== "security_board");
  const family = getBoardFamily(otherBoard?.material.id ?? "security_board");
  if (!family) {
    return null;
  }

  return {
    family,
    fillThicknessMm
  };
}
