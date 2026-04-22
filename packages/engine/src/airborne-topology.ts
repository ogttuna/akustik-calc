import type { ResolvedLayer } from "@dynecho/shared";

import { ksRound1 } from "./math";

export type LayerTotals = {
  gapLayerCount: number;
  layerCount: number;
  solidLayerCount: number;
  surfaceMassKgM2: number;
  totalGapThicknessMm: number;
  totalSolidThicknessMm: number;
  totalThicknessMm: number;
};

export type LayerRole = {
  densityKgM3: number;
  isGap: boolean;
  isPorous: boolean;
  isSolidLeaf: boolean;
  thicknessMm: number;
};

export type CollapsedLeafLayout = {
  collapsedLayers: ResolvedLayer[];
  compliantCoreThicknessMm: number;
  hasCompliantCore: boolean;
  solidLeafCount: number;
  solidLeafIndexes: number[];
};

export type AirborneTopologySummary = {
  cavityCount: number;
  hasPorousFill: boolean;
  hasStudLikeSupport: boolean;
  originalSolidLayerCount: number;
  porousLayerCount: number;
  supportLayerCount: number;
  surfaceMassKgM2: number;
  totalGapThicknessMm: number;
  totalSolidThicknessMm: number;
  totalThicknessMm: number;
  visibleLeafCount: number;
  visibleLeafMassRatio?: number;
  visibleLeafMassesKgM2: number[];
  weightedSolidDensityKgM3: number;
};

// Canonicalize a layer sequence by merging consecutive layers
// that share `material.id`. Mass and thickness are preserved —
// the coalesced layer keeps the first fragment's `material`
// reference (and therefore id / role / tags) while summing
// `thicknessMm` + `surfaceMassKgM2` across the run.
//
// Used as a normalization pre-step on both sides of any
// "does this input stack equal that reference stack" check
// (verified catalog match, calibration gates, etc.) so
// torture-matrix variants that split a same-material run into
// halves stay on-lane. Symmetric application on both sides is
// mandatory: coalescing only the input would make a legitimate
// 6-layer catalog reference like `[gyp, gyp, air, fill, gyp, gyp]`
// mismatch its own split forms.
//
// Non-adjacent same-material layers (separated by a gap, a
// porous fill, or any layer with a different id) are NOT
// merged — multi-leaf topology detection downstream stays
// intact.
export function coalesceAdjacentSameMaterialLayers(
  layers: readonly ResolvedLayer[]
): readonly ResolvedLayer[] {
  if (layers.length < 2) {
    return layers;
  }

  const coalesced: ResolvedLayer[] = [];
  let pendingFragments: ResolvedLayer[] = [];

  const flushPending = (): void => {
    if (pendingFragments.length === 0) {
      return;
    }
    if (pendingFragments.length === 1) {
      coalesced.push(pendingFragments[0]);
    } else {
      const head = pendingFragments[0];
      const totalThicknessMm = pendingFragments.reduce((sum, layer) => sum + layer.thicknessMm, 0);
      const totalSurfaceMassKgM2 = pendingFragments.reduce(
        (sum, layer) => sum + layer.surfaceMassKgM2,
        0
      );
      coalesced.push({
        ...head,
        surfaceMassKgM2: totalSurfaceMassKgM2,
        thicknessMm: totalThicknessMm
      });
    }
    pendingFragments = [];
  };

  for (const layer of layers) {
    const previousFragment = pendingFragments.at(-1);
    if (previousFragment && previousFragment.material.id === layer.material.id) {
      pendingFragments.push(layer);
      continue;
    }
    flushPending();
    pendingFragments.push(layer);
  }
  flushPending();

  return coalesced;
}

export function materialText(layer: ResolvedLayer): string {
  return [
    layer.material.id,
    layer.material.name,
    layer.material.category,
    ...(layer.material.tags ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function isPorousLayer(layer: ResolvedLayer): boolean {
  if (layer.material.category === "insulation") {
    return true;
  }

  return layer.material.tags.some((tag) => /porous|cavity-fill|fill|rockwool|glasswool|wool/.test(tag.toLowerCase()));
}

export function classifyLayerRole(layer: ResolvedLayer): LayerRole {
  const thicknessMm = Math.max(layer.thicknessMm, 0);
  const densityKgM3 = Math.max(layer.material.densityKgM3, 0);
  const isPorous = isPorousLayer(layer);
  const isGap = layer.material.category === "gap" || (!(layer.surfaceMassKgM2 > 0) && !isPorous);
  const isSolidLeaf = !isGap && !isPorous && thicknessMm > 0 && layer.surfaceMassKgM2 > 0;

  return {
    densityKgM3,
    isGap,
    isPorous,
    isSolidLeaf,
    thicknessMm
  };
}

export function calculateLayerTotals(layers: readonly ResolvedLayer[]): LayerTotals {
  let totalThicknessMm = 0;
  let totalSolidThicknessMm = 0;
  let surfaceMassKgM2 = 0;
  let layerCount = 0;
  let solidLayerCount = 0;
  let gapLayerCount = 0;
  let totalGapThicknessMm = 0;

  for (const layer of layers) {
    const role = classifyLayerRole(layer);
    if (!(role.thicknessMm > 0)) {
      continue;
    }

    totalThicknessMm += role.thicknessMm;
    layerCount += 1;

    if (role.isGap) {
      gapLayerCount += 1;
      totalGapThicknessMm += role.thicknessMm;
      continue;
    }

    totalSolidThicknessMm += role.thicknessMm;
    surfaceMassKgM2 += layer.surfaceMassKgM2;

    if (role.isSolidLeaf) {
      solidLayerCount += 1;
    }
  }

  return {
    gapLayerCount,
    layerCount,
    solidLayerCount,
    surfaceMassKgM2: ksRound1(surfaceMassKgM2),
    totalGapThicknessMm: ksRound1(totalGapThicknessMm),
    totalSolidThicknessMm: ksRound1(totalSolidThicknessMm),
    totalThicknessMm: ksRound1(totalThicknessMm)
  };
}

function mergeContiguousSolidLeafGroup(groupLayers: readonly ResolvedLayer[]): ResolvedLayer | null {
  if (groupLayers.length === 0) {
    return null;
  }

  if (groupLayers.length === 1) {
    return { ...groupLayers[0] };
  }

  const totalThicknessMm = groupLayers.reduce((sum, layer) => sum + layer.thicknessMm, 0);
  const totalSurfaceMassKgM2 = groupLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0);

  if (!(totalThicknessMm > 0) || !(totalSurfaceMassKgM2 > 0)) {
    return { ...groupLayers[groupLayers.length - 1] };
  }

  const lastLayer = groupLayers[groupLayers.length - 1];
  return {
    ...lastLayer,
    material: {
      ...lastLayer.material,
      densityKgM3: totalSurfaceMassKgM2 / (totalThicknessMm / 1000),
      id:
        groupLayers.every((layer) => layer.material.id === groupLayers[0]?.material.id)
          ? groupLayers[0]?.material.id
          : "composite_leaf",
      name:
        groupLayers.every((layer) => layer.material.name === groupLayers[0]?.material.name)
          ? groupLayers[0]?.material.name
          : groupLayers.map((layer) => layer.material.name).join(" + ")
    },
    surfaceMassKgM2: totalSurfaceMassKgM2,
    thicknessMm: totalThicknessMm
  };
}

export function collapseContiguousSolidLeafLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] {
  const collapsed: ResolvedLayer[] = [];
  let solidGroup: ResolvedLayer[] = [];

  function flushSolidGroup() {
    if (solidGroup.length === 0) {
      return;
    }

    const merged = mergeContiguousSolidLeafGroup(solidGroup);
    if (merged) {
      collapsed.push(merged);
    }
    solidGroup = [];
  }

  for (const layer of layers) {
    if (classifyLayerRole(layer).isSolidLeaf) {
      solidGroup.push(layer);
      continue;
    }

    flushSolidGroup();
    collapsed.push({ ...layer });
  }

  flushSolidGroup();
  return collapsed;
}

export function detectLeafCoreLayout(layers: readonly ResolvedLayer[]): CollapsedLeafLayout {
  const collapsedLayers = collapseContiguousSolidLeafLayers(layers);
  const solidLeafIndexes: number[] = [];

  collapsedLayers.forEach((layer, index) => {
    if (classifyLayerRole(layer).isSolidLeaf) {
      solidLeafIndexes.push(index);
    }
  });

  if (solidLeafIndexes.length < 2) {
    return {
      collapsedLayers,
      compliantCoreThicknessMm: 0,
      hasCompliantCore: false,
      solidLeafCount: solidLeafIndexes.length,
      solidLeafIndexes
    };
  }

  const firstLeafIndex = solidLeafIndexes[0];
  const lastLeafIndex = solidLeafIndexes[solidLeafIndexes.length - 1];
  let compliantCoreThicknessMm = 0;
  let hasCompliantCore = false;

  for (let index = firstLeafIndex + 1; index < lastLeafIndex; index += 1) {
    const role = classifyLayerRole(collapsedLayers[index]);
    if (!role.isGap && !role.isPorous) {
      continue;
    }

    if (!(role.thicknessMm > 0)) {
      continue;
    }

    compliantCoreThicknessMm += role.thicknessMm;
    hasCompliantCore = true;
  }

  return {
    collapsedLayers,
    compliantCoreThicknessMm: ksRound1(compliantCoreThicknessMm),
    hasCompliantCore,
    solidLeafCount: solidLeafIndexes.length,
    solidLeafIndexes
  };
}

function countCavities(layout: CollapsedLeafLayout): number {
  if (layout.solidLeafIndexes.length < 2) {
    return 0;
  }

  let cavityCount = 0;

  for (let pairIndex = 0; pairIndex < layout.solidLeafIndexes.length - 1; pairIndex += 1) {
    const start = layout.solidLeafIndexes[pairIndex];
    const end = layout.solidLeafIndexes[pairIndex + 1];
    const hasCompliantZone = layout.collapsedLayers
      .slice(start + 1, end)
      .some((layer) => {
        const role = classifyLayerRole(layer);
        return role.thicknessMm > 0 && (role.isGap || role.isPorous);
      });

    if (hasCompliantZone) {
      cavityCount += 1;
    }
  }

  return cavityCount;
}

export function summarizeAirborneTopology(layers: readonly ResolvedLayer[]): AirborneTopologySummary {
  const totals = calculateLayerTotals(layers);
  const layout = detectLeafCoreLayout(layers);
  const originalSolidLayerCount = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf).length;
  const porousLayerCount = layers.filter((layer) => classifyLayerRole(layer).isPorous).length;
  const supportLayerCount = layers.filter((layer) => {
    const text = materialText(layer);
    return layer.material.category === "support" || /(stud|channel|clip|hanger|support)/.test(text);
  }).length;
  const visibleLeafMassesKgM2 = layout.solidLeafIndexes.map(
    (index) => ksRound1(layout.collapsedLayers[index]?.surfaceMassKgM2 ?? 0)
  );
  const minLeafMass = Math.min(...visibleLeafMassesKgM2.filter((value) => value > 0));
  const maxLeafMass = Math.max(...visibleLeafMassesKgM2.filter((value) => value > 0));
  const weightedSolidDensityKgM3 =
    totals.totalSolidThicknessMm > 0 ? totals.surfaceMassKgM2 / (totals.totalSolidThicknessMm / 1000) : 0;

  return {
    cavityCount: countCavities(layout),
    hasPorousFill: porousLayerCount > 0,
    hasStudLikeSupport: supportLayerCount > 0,
    originalSolidLayerCount,
    porousLayerCount,
    supportLayerCount,
    surfaceMassKgM2: totals.surfaceMassKgM2,
    totalGapThicknessMm: totals.totalGapThicknessMm,
    totalSolidThicknessMm: totals.totalSolidThicknessMm,
    totalThicknessMm: totals.totalThicknessMm,
    visibleLeafCount: layout.solidLeafCount,
    visibleLeafMassRatio:
      Number.isFinite(minLeafMass) && Number.isFinite(maxLeafMass) && minLeafMass > 0
        ? ksRound1(maxLeafMass / minLeafMass)
        : undefined,
    visibleLeafMassesKgM2,
    weightedSolidDensityKgM3: ksRound1(weightedSolidDensityKgM3)
  };
}
