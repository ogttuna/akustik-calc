// Cavity topology + layer-variant builders carved out of
// `dynamic-airborne.ts` during `dynamic_airborne_split_refactor_v1`
// commit 6. This module owns the helpers that describe the primary
// cavity between the outer leaves of a framed wall, detect micro-
// gap-high-fill equivalents, and build layer variants (reduced
// thickness, narrow-gap contact equivalent, micro-gap fill-only
// equivalent) that downstream calibration functions feed into the
// dynamic airborne predictor.
//
// Split rationale:
// - The masonry calibration and framed-wall calibration lanes both
//   import `describePrimaryCavity` and `summarizePrimaryCavitySegments`.
//   Placing these shared cavity helpers in a dedicated module before
//   the two big calibration carves removes the circular-import risk.
// - None of these helpers depends on family-specific predicates —
//   they operate on `ResolvedLayer` + `classifyLayerRole` /
//   `detectLeafCoreLayout` alone — so the module sits below the
//   family-detection module in the import graph.

import type { ResolvedLayer } from "@dynecho/shared";

import {
  classifyLayerRole,
  detectLeafCoreLayout,
  materialText,
  summarizeAirborneTopology
} from "./airborne-topology";
import {
  isAacLikeLayer,
  isBoardLikeLayer,
  isEnhancedBoardLayer,
  isMasonryCoreLayer,
  isMasonryLikeLayer,
  isNonHomogeneousMasonryRiskLayer,
  isPlasterLikeLayer
} from "./dynamic-airborne-family-detection";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { clamp, ksRound1 } from "./math";

export type PrimaryCavitySegmentSummary = {
  cavityEnd: number;
  cavityStart: number;
  gapSegmentCount: number;
  gapThicknessMm: number;
  porousSegmentCount: number;
  porousTemplate: ResolvedLayer | null;
  porousThicknessMm: number;
  totalThicknessMm: number;
};

// Aggregate the gap + porous thickness between the two outer solid
// leaves of a double-leaf wall. Returns zeros when the layer stack
// does not present exactly two leaves (the single-leaf + multi-leaf
// cases are handled by other summarizers).
export function describePrimaryCavity(layers: readonly ResolvedLayer[]): {
  coreThicknessMm: number;
  gapThicknessMm: number;
  porousThicknessMm: number;
} {
  const layout = detectLeafCoreLayout(layers);

  if (layout.solidLeafIndexes.length !== 2) {
    return {
      coreThicknessMm: 0,
      gapThicknessMm: 0,
      porousThicknessMm: 0
    };
  }

  const start = layout.solidLeafIndexes[0];
  const end = layout.solidLeafIndexes[1];
  let gapThicknessMm = 0;
  let porousThicknessMm = 0;

  for (let index = start + 1; index < end; index += 1) {
    const layer = layout.collapsedLayers[index];
    const text = materialText(layer);
    if (layer.material.category === "gap") {
      gapThicknessMm += layer.thicknessMm;
      continue;
    }

    if (layer.material.category === "insulation" || /rockwool|glasswool|wool|porous|fill/.test(text)) {
      porousThicknessMm += layer.thicknessMm;
    }
  }

  return {
    coreThicknessMm: ksRound1(gapThicknessMm + porousThicknessMm),
    gapThicknessMm: ksRound1(gapThicknessMm),
    porousThicknessMm: ksRound1(porousThicknessMm)
  };
}

// Walk a layer stack and describe the primary cavity as contiguous
// gap / porous segments. Returns null when no cavity is detectable
// (single leaf, misformed stack).
export function summarizePrimaryCavitySegments(
  layers: readonly ResolvedLayer[]
): PrimaryCavitySegmentSummary | null {
  let sawLeftLeaf = false;
  let cavityStart = -1;
  let cavityEnd = -1;
  let gapSegmentCount = 0;
  let porousSegmentCount = 0;
  let gapThicknessMm = 0;
  let porousThicknessMm = 0;
  let porousTemplate: ResolvedLayer | null = null;
  let previousKind: "gap" | "porous" | null = null;

  for (let index = 0; index < layers.length; index += 1) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    const role = classifyLayerRole(layer);

    if (!sawLeftLeaf) {
      if (role.isSolidLeaf) {
        sawLeftLeaf = true;
      }
      continue;
    }

    if (cavityStart < 0) {
      if (role.isSolidLeaf) {
        continue;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      cavityStart = index;
    }

    if (cavityStart >= 0 && cavityEnd < 0) {
      if (role.isSolidLeaf) {
        cavityEnd = index - 1;
        break;
      }

      if (!(role.isGap || role.isPorous)) {
        return null;
      }

      if (role.isGap) {
        gapThicknessMm += layer.thicknessMm;
        if (previousKind !== "gap") {
          gapSegmentCount += 1;
          previousKind = "gap";
        }
      } else if (role.isPorous) {
        porousThicknessMm += layer.thicknessMm;
        if (!porousTemplate) {
          porousTemplate = { ...layer, material: { ...layer.material } };
        }
        if (previousKind !== "porous") {
          porousSegmentCount += 1;
          previousKind = "porous";
        }
      }
    }
  }

  if (cavityStart < 0) {
    return null;
  }

  if (cavityEnd < cavityStart) {
    cavityEnd = layers.length - 1;
  }

  if (!(cavityEnd >= cavityStart)) {
    return null;
  }

  const totalThicknessMm = gapThicknessMm + porousThicknessMm;
  if (!(totalThicknessMm > 0)) {
    return null;
  }

  return {
    cavityEnd,
    cavityStart,
    gapSegmentCount,
    gapThicknessMm: ksRound1(gapThicknessMm),
    porousSegmentCount,
    porousTemplate,
    porousThicknessMm: ksRound1(porousThicknessMm),
    totalThicknessMm: ksRound1(totalThicknessMm)
  };
}

// True when the cavity is overwhelmingly porous-filled with a thin
// gap (<=12 mm) — the predictor treats these as fill-only equivalents
// to avoid overreacting to the thin gap layer.
export function isMicroGapHighFillEquivalentCavity(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>
): boolean {
  if (topology.visibleLeafCount !== 2 || topology.cavityCount !== 1 || !topology.hasPorousFill) {
    return false;
  }

  const cavity = summarizePrimaryCavitySegments(layers);
  if (!cavity) {
    return false;
  }

  const fillFraction = cavity.totalThicknessMm > 0
    ? clamp(cavity.porousThicknessMm / cavity.totalThicknessMm, 0, 1)
    : 0;

  return (
    cavity.gapSegmentCount === 1 &&
    cavity.porousSegmentCount === 1 &&
    cavity.gapThicknessMm > 0 &&
    cavity.gapThicknessMm <= 12 &&
    fillFraction >= 0.82
  );
}

// Replace a micro-gap-high-fill cavity with a single equivalent
// porous layer whose thickness equals the combined cavity thickness.
// Used by the predictor to compare such stacks against an idealized
// fill-only cavity baseline.
export function buildMicroGapFillOnlyEquivalentLayers(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>
): ResolvedLayer[] | null {
  if (!isMicroGapHighFillEquivalentCavity(layers, topology)) {
    return null;
  }

  const cavity = summarizePrimaryCavitySegments(layers);
  if (!cavity?.porousTemplate) {
    return null;
  }

  return [
    ...layers.slice(0, cavity.cavityStart).map((layer) => ({ ...layer, material: { ...layer.material } })),
    {
      ...cavity.porousTemplate,
      thicknessMm: cavity.totalThicknessMm,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(
        { thicknessMm: cavity.totalThicknessMm },
        cavity.porousTemplate.material
      )
    },
    ...layers.slice(cavity.cavityEnd + 1).map((layer) => ({ ...layer, material: { ...layer.material } }))
  ];
}

// Return a shallow copy of `layers` with the layer at `replaceIndex`
// rebuilt at `nextThicknessMm`. Surface mass recalculated from the
// material density × new thickness so downstream mass-law math sees
// consistent inputs.
export function buildReducedThicknessVariant(
  layers: readonly ResolvedLayer[],
  replaceIndex: number,
  nextThicknessMm: number
): ResolvedLayer[] {
  return layers.map((layer, index) => {
    if (index !== replaceIndex) {
      return {
        ...layer,
        material: { ...layer.material }
      };
    }

    return {
      ...layer,
      material: { ...layer.material },
      surfaceMassKgM2: (layer.material.densityKgM3 * nextThicknessMm) / 1000,
      thicknessMm: nextThicknessMm
    };
  });
}

// Drop every gap layer — the masonry narrow-gap guard uses this to
// produce a contact-equivalent stack where the leaves sit directly
// against each other.
export function buildNarrowGapContactEquivalentLayers(
  layers: readonly ResolvedLayer[]
): ResolvedLayer[] {
  return layers
    .filter((layer) => !classifyLayerRole(layer).isGap)
    .map((layer) => ({
      ...layer,
      material: { ...layer.material }
    }));
}
export function compareReinforcementCandidatePriority(left: ResolvedLayer, right: ResolvedLayer): number {
  const enhancedDelta = Number(isEnhancedBoardLayer(right)) - Number(isEnhancedBoardLayer(left));
  if (enhancedDelta !== 0) {
    return enhancedDelta;
  }

  const surfaceMassDelta = right.surfaceMassKgM2 - left.surfaceMassKgM2;
  if (Math.abs(surfaceMassDelta) > 1e-6) {
    return surfaceMassDelta;
  }

  const thicknessDelta = right.thicknessMm - left.thicknessMm;
  if (Math.abs(thicknessDelta) > 1e-6) {
    return thicknessDelta;
  }

  const densityDelta = right.material.densityKgM3 - left.material.densityKgM3;
  if (Math.abs(densityDelta) > 1e-6) {
    return densityDelta;
  }

  const idCompare = left.material.id.localeCompare(right.material.id);
  if (idCompare !== 0) {
    return -idCompare;
  }

  return -left.material.name.localeCompare(right.material.name);
}

export function findOuterLeafReinforcementCandidateIndex(
  layers: readonly ResolvedLayer[],
  side: "leading" | "trailing"
): number | null {
  const indexes =
    side === "leading"
      ? Array.from({ length: layers.length }, (_, index) => index)
      : Array.from({ length: layers.length }, (_, offset) => layers.length - 1 - offset);
  let bestIndex: number | null = null;
  let bestLayer: ResolvedLayer | null = null;

  for (const index of indexes) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    const role = classifyLayerRole(layer);
    if (!role.isSolidLeaf) {
      break;
    }

    if (!isBoardLikeLayer(layer)) {
      continue;
    }

    if (!bestLayer || compareReinforcementCandidatePriority(bestLayer, layer) > 0) {
      bestLayer = layer;
      bestIndex = index;
    }
  }

  return bestIndex;
}

const FRAMED_SPLIT_BOARD_FRAGMENT_MAX_THICKNESS_MM = 9;
const FRAMED_SPLIT_BOARD_FRAGMENT_PAIR_MAX_THICKNESS_MM = 16;

export function hasOuterLeafSplitBoardFragments(
  layers: readonly ResolvedLayer[],
  side: "leading" | "trailing"
): boolean {
  const indexes =
    side === "leading"
      ? Array.from({ length: layers.length }, (_, index) => index)
      : Array.from({ length: layers.length }, (_, offset) => layers.length - 1 - offset);
  let previousBoard: ResolvedLayer | null = null;

  for (const index of indexes) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    if (!classifyLayerRole(layer).isSolidLeaf) {
      break;
    }

    if (!isBoardLikeLayer(layer)) {
      previousBoard = null;
      continue;
    }

    if (
      previousBoard &&
      previousBoard.material.id === layer.material.id &&
      Math.min(previousBoard.thicknessMm, layer.thicknessMm) <= FRAMED_SPLIT_BOARD_FRAGMENT_MAX_THICKNESS_MM &&
      previousBoard.thicknessMm + layer.thicknessMm <= FRAMED_SPLIT_BOARD_FRAGMENT_PAIR_MAX_THICKNESS_MM
    ) {
      return true;
    }

    previousBoard = layer;
  }

  return false;
}

export function summarizeSingleLeafMasonryProfile(layers: readonly ResolvedLayer[]): {
  hasAacLike: boolean;
  hasMasonryLike: boolean;
  hasNonHomogeneousMasonryRisk: boolean;
  hasPlasterLike: boolean;
  masonryCoreMassRatio: number;
  masonryMassRatio: number;
} {
  let totalSolidMassKgM2 = 0;
  let masonryCoreMassKgM2 = 0;
  let masonryLikeMassKgM2 = 0;
  let hasAacLike = false;
  let hasMasonryLike = false;
  let hasNonHomogeneousMasonryRisk = false;
  let hasPlasterLike = false;

  for (const layer of layers) {
    const role = classifyLayerRole(layer);
    if (!role.isSolidLeaf || !(layer.surfaceMassKgM2 > 0)) {
      continue;
    }

    totalSolidMassKgM2 += layer.surfaceMassKgM2;

    if (isMasonryLikeLayer(layer)) {
      masonryLikeMassKgM2 += layer.surfaceMassKgM2;
      hasMasonryLike = true;
    }

    if (isMasonryCoreLayer(layer)) {
      masonryCoreMassKgM2 += layer.surfaceMassKgM2;
    }

    if (isAacLikeLayer(layer)) {
      hasAacLike = true;
    }

    if (isNonHomogeneousMasonryRiskLayer(layer)) {
      hasNonHomogeneousMasonryRisk = true;
    }

    if (isPlasterLikeLayer(layer)) {
      hasPlasterLike = true;
    }
  }

  return {
    hasAacLike,
    hasMasonryLike,
    hasNonHomogeneousMasonryRisk,
    hasPlasterLike,
    masonryCoreMassRatio:
      totalSolidMassKgM2 > 0 ? ksRound1(masonryCoreMassKgM2 / totalSolidMassKgM2) : 0,
    masonryMassRatio:
      totalSolidMassKgM2 > 0 ? ksRound1(masonryLikeMassKgM2 / totalSolidMassKgM2) : 0
  };
}

export function trimOuterCompliantLayers(layers: readonly ResolvedLayer[]): {
  layers: ResolvedLayer[];
  trimmed: boolean;
  trimmedLeadingCount: number;
  trimmedTrailingCount: number;
} {
  let firstSolidIndex = -1;
  let lastSolidIndex = -1;

  for (let index = 0; index < layers.length; index += 1) {
    if (classifyLayerRole(layers[index]!).isSolidLeaf) {
      firstSolidIndex = index;
      break;
    }
  }

  for (let index = layers.length - 1; index >= 0; index -= 1) {
    if (classifyLayerRole(layers[index]!).isSolidLeaf) {
      lastSolidIndex = index;
      break;
    }
  }

  if (firstSolidIndex < 0 || lastSolidIndex < firstSolidIndex) {
    return {
      layers: layers.map((layer) => ({ ...layer, material: { ...layer.material } })),
      trimmed: false,
      trimmedLeadingCount: 0,
      trimmedTrailingCount: 0
    };
  }

  const trimmedLeadingCount = firstSolidIndex;
  const trimmedTrailingCount = Math.max(layers.length - 1 - lastSolidIndex, 0);

  return {
    layers: layers
      .slice(firstSolidIndex, lastSolidIndex + 1)
      .map((layer) => ({ ...layer, material: { ...layer.material } })),
    trimmed: trimmedLeadingCount > 0 || trimmedTrailingCount > 0,
    trimmedLeadingCount,
    trimmedTrailingCount
  };
}
