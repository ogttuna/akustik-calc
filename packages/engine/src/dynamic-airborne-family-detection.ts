// Material-family predicates carved out of `dynamic-airborne.ts`
// during `dynamic_airborne_split_refactor_v1` commit 2. These
// helpers classify a single layer (or a small stack) into a
// material family based on the catalog id and materialText regex
// signatures — no curve math, no context normalization, no
// family-level calibration logic.
//
// Split rationale:
// - The predicates are the most isolated piece of family-detection
//   logic and the easiest clean carve. They are consumed both by
//   the remaining family-detection summarizers in
//   `dynamic-airborne.ts` and by the single-leaf masonry +
//   calibration functions that will move in later commits.
// - Placing them in a standalone file with zero curve-math
//   dependencies avoids circular imports between the family-
//   detection side and the predictor-scoring side of the split.

import type { ResolvedLayer } from "@dynecho/shared";

import { classifyLayerRole, materialText } from "./airborne-topology";

export function isMasonryLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /masonry|concrete|aac|gazbeton|ytong|brick|block|stone|lime|limestone|granit|mermer|plaster|render|stucco|cement|pumice|bims|hollow|silicate|mortar/.test(
    materialText(layer)
  );
}

export function isPlasterLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /plaster|render|stucco|mortar|cement_plaster|skim_plaster|lime_plaster|gypsum_plaster/.test(
    materialText(layer)
  );
}

export function isAacLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /aac|gazbeton|autoclaved|ytong|aircrete|porenbeton|hebel/.test(materialText(layer));
}

export function isSilicateMasonryLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /silicate|calcium-silicate|sand-lime|silka/.test(materialText(layer));
}

export function isPorothermClayLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /porotherm|wienerberger/.test(materialText(layer));
}

export function isHeluzClayLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /heluz/.test(materialText(layer));
}

export function isYtongMassiefG2300Layer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return layer.material.id === "ytong_massief_g2_300" || /ytong.*massief|g2\/300/.test(materialText(layer));
}

export function isYtongSeparatiePaneelLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /^(ytong_separatiepaneel_aac_4_600|ytong_separatiepaneel_aac_5_750)$/.test(layer.material.id);
}

export function isYtongSeparatiePaneelBuildUp(layers: readonly ResolvedLayer[]): boolean {
  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return false;
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return false;
  }

  return (
    isYtongSeparatiePaneelLayer(coreLayer) &&
    leftLayer.material.id === rightLayer.material.id &&
    isPlasterLikeLayer(leftLayer) &&
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) <= 0.6 &&
    leftLayer.thicknessMm <= 6
  );
}

export function isYtongCellenbetonblokLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /^(ytong_cellenbetonblok_g4_600|ytong_cellenbetonblok_g5_800)$/.test(layer.material.id);
}

export function isYtongCellenbetonblokBuildUp(layers: readonly ResolvedLayer[]): boolean {
  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return false;
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return false;
  }

  return (
    isYtongCellenbetonblokLayer(coreLayer) &&
    leftLayer.material.id === rightLayer.material.id &&
    isPlasterLikeLayer(leftLayer) &&
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) <= 0.6 &&
    leftLayer.thicknessMm <= 6
  );
}

export function isCelconAircreteLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf || layer.material.category !== "mass") {
    return false;
  }

  return /^(celcon_solar_grade|celcon_standard_grade|celcon_high_strength)$/.test(layer.material.id);
}

export function isCelconFinishedAircreteBuildUp(layers: readonly ResolvedLayer[]): boolean {
  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return false;
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return false;
  }

  return (
    isCelconAircreteLayer(coreLayer) &&
    leftLayer.material.id === rightLayer.material.id &&
    (leftLayer.material.id === "celcon_lwt_plaster" || leftLayer.material.id === "celcon_dense_plaster") &&
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) <= 0.6 &&
    Math.abs(leftLayer.thicknessMm - 13) <= 0.6
  );
}

export function isMasonryCoreLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf || layer.material.category !== "mass") {
    return false;
  }

  return /aac|gazbeton|ytong|aircrete|autoclaved|pumice|bims|block|brick|masonry|silicate|stone|concrete/.test(
    materialText(layer)
  );
}

export function isNonHomogeneousMasonryRiskLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /aac|gazbeton|ytong|hebel|hollow|pumice|bims|brick|block|silicate|mortar/.test(materialText(layer));
}
