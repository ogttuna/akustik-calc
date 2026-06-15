import type { LayerInput, MaterialDefinition } from "@dynecho/shared";

import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { resolveMaterial } from "./material-catalog";

const FLOATING_FLOOR_LOAD_BASIS_ROLES = new Set<LayerInput["floorRole"]>([
  "floor_covering",
  "floating_screed",
  "upper_fill"
]);

function hasUserMaterialSignal(input: {
  catalog: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): boolean {
  for (const layer of input.layers) {
    let material: MaterialDefinition;
    try {
      material = resolveMaterial(layer.materialId, input.catalog);
    } catch {
      return false;
    }

    if (
      material.acoustic?.propertySourceStatus === "user_supplied" ||
      material.tags.includes("custom") ||
      material.id.startsWith("custom_")
    ) {
      return true;
    }
  }

  return false;
}

function roundLoadBasisKgM2(value: number): number {
  return Number(value.toFixed(1));
}

export function resolveVisibleFloatingFloorLoadBasisKgM2(input: {
  catalog: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
}): number | undefined {
  if (
    !input.layers.some((layer) => layer.floorRole === "resilient_layer") ||
    !input.layers.some((layer) => layer.floorRole === "floating_screed")
  ) {
    return undefined;
  }

  if (!hasUserMaterialSignal(input)) {
    return undefined;
  }

  let loadBasisKgM2 = 0;
  let loadLayerCount = 0;

  for (const layer of input.layers) {
    if (!FLOATING_FLOOR_LOAD_BASIS_ROLES.has(layer.floorRole)) {
      continue;
    }

    let material: MaterialDefinition;
    try {
      material = resolveMaterial(layer.materialId, input.catalog);
    } catch {
      return undefined;
    }

    const layerSurfaceMassKgM2 = computeLayerSurfaceMassKgM2(layer, material);
    if (!Number.isFinite(layerSurfaceMassKgM2) || layerSurfaceMassKgM2 <= 0) {
      return undefined;
    }

    loadBasisKgM2 += layerSurfaceMassKgM2;
    loadLayerCount += 1;
  }

  if (loadLayerCount === 0 || loadBasisKgM2 <= 0) {
    return undefined;
  }

  return roundLoadBasisKgM2(loadBasisKgM2);
}
