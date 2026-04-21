import type {
  AirborneContext,
  AssemblyRatings,
  DynamicAirborneConfidenceClass,
  DynamicAirborneFamilyDecisionClass,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  buildRatingsFromCurve,
  buildCalibratedMassLawCurve
} from "./curve-rating";
import {
  calculateAirborneCalculatorResult,
  buildPanelProperties,
  estimateCriticalFrequency,
  finitePanelRadiationEfficiency
} from "./airborne-calculator";
import {
  anchorCurveToComputedMetric,
  anchorCurveToMetric,
  blendDelegateCurves,
  buildScreeningDelegate,
  computeContextMetric,
  computeMicroGapEquivalenceMetric,
  DYNAMIC_AIR_DENSITY,
  DYNAMIC_SOUND_SPEED,
  getDelegateLabel,
  interpolateLinear,
  interpolateRwSeries,
  normalizeBoundarySignal,
  octaveBandWindowWeight,
  octaveGaussianDip,
  shiftCurve,
  smoothstep01,
  type DelegateBlend,
  type DelegateCurve,
  type DynamicAirborneOptions,
  type DynamicAirborneResult
} from "./dynamic-airborne-helpers";
import {
  hasExplicitFramingHint,
  isAacLikeLayer,
  isBoardLikeLayer,
  isCelconAircreteLayer,
  isCelconFinishedAircreteBuildUp,
  isEnhancedBoardLayer,
  isHeluzClayLayer,
  isMasonryCoreLayer,
  isMasonryLikeLayer,
  isNonHomogeneousMasonryRiskLayer,
  isPlasterLikeLayer,
  isPorothermClayLayer,
  isResilientFramingHint,
  isSilicateMasonryLayer,
  isYtongCellenbetonblokBuildUp,
  isYtongCellenbetonblokLayer,
  isYtongMassiefG2300Layer,
  isYtongSeparatiePaneelBuildUp,
  isYtongSeparatiePaneelLayer,
  normalizeFramingHint,
  type DynamicFramingHint
} from "./dynamic-airborne-family-detection";
import { applyMasonryDavyConservativeCap } from "./dynamic-airborne-davy-masonry";
import {
  buildInterpolatedTemplateCurve,
  getMixedPlainModerateFamilyAndTemplateId,
  getMixedPlainModerateTemplateProfile,
  getMixedPlainPremiumFamilyAndTemplateId,
  interpolateTemplateDbByFill,
  MIXED_PLAIN_MODERATE_LAB_TARGET_RW,
  MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ,
  MIXED_PLAIN_PREMIUM_LAB_TARGET_RW,
  type MixedPlainModerateTemplateFill,
  type MixedPlainModerateTemplateId,
  type MixedPlainModerateTemplateProfile,
  type MixedPlainPremiumTemplateId
} from "./dynamic-airborne-mixed-plain-templates";
import {
  buildMicroGapFillOnlyEquivalentLayers,
  buildNarrowGapContactEquivalentLayers,
  buildReducedThicknessVariant,
  compareReinforcementCandidatePriority,
  describePrimaryCavity,
  findOuterLeafReinforcementCandidateIndex,
  isMicroGapHighFillEquivalentCavity,
  summarizePrimaryCavitySegments,
  summarizeSingleLeafMasonryProfile,
  trimOuterCompliantLayers,
  type PrimaryCavitySegmentSummary
} from "./dynamic-airborne-cavity-topology";
import {
  estimateStudWallTargetRw,
  isPlainGypsumFilledSingleBoardCandidate,
  summarizeDoubleStudSignature,
  summarizeFamilyDecisionBoundary,
  summarizeFramedBoardSystem,
  summarizeFramingEvidence,
  summarizeHeavyUnframedCavityRisk,
  summarizeMultileafOrderSensitivity,
  summarizePremiumSingleBoardFramedCandidate,
  type BoardTier,
  type DoubleStudSignature,
  type FamilyDecisionBoundarySummary,
  type FramedBoardSystemSummary,
  type FramingEvidenceSummary,
  type HeavyUnframedCavityRiskSummary,
  type MultileafOrderSensitivitySummary
} from "./dynamic-airborne-framed-wall";
import {
  estimateAacMassiveTargetRw,
  estimateCelconFinishedAircreteTargetRw,
  estimateHeluzPlasteredClayTargetRw,
  estimatePorothermPlasteredTargetRw,
  estimateSilicateMasonryTargetRw,
  estimateUnfinishedAircreteTargetRw,
  estimateYtongCellenbetonblokTargetRw,
  estimateYtongMassiefG2300TargetRw,
  estimateYtongSeparatiePaneelTargetRw
} from "./dynamic-airborne-masonry-calibration";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import {
  MIXED_PLAIN_MODERATE_FIELD_TEMPLATES,
  type MixedPlainModerateFieldTemplateFamily
} from "./mixed-plain-moderate-field-templates";
import {
  MIXED_PLAIN_PREMIUM_FIELD_TEMPLATES,
  type MixedPlainPremiumFieldTemplateFamily
} from "./mixed-plain-premium-field-templates";
import {
  detectFireRatedFilledSingleBoardFamily,
  getFireRatedFilledSingleBoardProfile,
  FIRE_RATED_FILLED_SINGLE_BOARD_LAB_TARGET_RW
} from "./fire-rated-filled-single-board-corridor";
import {
  detectSecurityFilledSingleBoardFamily,
  getSecurityFilledSingleBoardProfile,
  SECURITY_FILLED_SINGLE_BOARD_LAB_TARGET_RW
} from "./security-filled-single-board-corridor";
import {
  detectSymmetricEnhancedFilledSingleBoardFamily,
  getSymmetricEnhancedFilledSingleBoardProfile,
  SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW
} from "./symmetric-enhanced-filled-single-board-corridor";
import {
  detectMixedEnhancedFilledSingleBoardFamily,
  getMixedEnhancedFilledSingleBoardProfile,
  MIXED_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW
} from "./mixed-enhanced-filled-single-board-corridor";
import { calculateLayerTotals, classifyLayerRole, detectLeafCoreLayout, materialText, summarizeAirborneTopology } from "./airborne-topology";
import { clamp, ksRound1, log10Safe } from "./math";
import { estimateRwDb } from "./estimate-rw";

const FAMILY_LABELS: Record<DynamicAirborneFamily, string> = {
  double_leaf: "Double Leaf",
  double_stud_system: "Double Frame / Double Stud",
  laminated_single_leaf: "Laminated Single Leaf",
  lined_massive_wall: "Lined Massive Wall",
  masonry_nonhomogeneous: "Non-Homogeneous Masonry",
  multileaf_multicavity: "Multi-Leaf / Multi-Cavity",
  rigid_massive_wall: "Rigid Massive Wall",
  single_leaf_panel: "Single Leaf Panel",
  stud_wall_system: "Stud Wall Surrogate"
};


function applySingleLeafMasonryMonotonicFloor(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];
  const guardDepth = options.singleLeafMasonryFloorGuardDepth ?? 0;

  if (options.disableSingleLeafMasonryFloor || guardDepth >= 6) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (topology.visibleLeafCount !== 1 || topology.cavityCount > 0 || topology.hasStudLikeSupport) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (
    layers.some((layer) => isHeluzClayLayer(layer)) ||
    isCelconFinishedAircreteBuildUp(layers) ||
    isYtongSeparatiePaneelBuildUp(layers) ||
    isYtongCellenbetonblokBuildUp(layers)
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const candidateIndexes = layers
    .map((layer, index) => ({ index, layer }))
    .filter(({ layer }) => isMasonryCoreLayer(layer) && layer.thicknessMm >= 40)
    .sort((left, right) => right.layer.surfaceMassKgM2 - left.layer.surfaceMassKgM2)
    .map((entry) => entry.index);

  if (!candidateIndexes.length) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const currentMetric = computeContextMetric(curve, options.airborneContext);
  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  let floorMetric = Number.NEGATIVE_INFINITY;
  const siblingMetrics: string[] = [];

  for (const index of candidateIndexes) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    for (const stepMm of [10, 20, 40]) {
      const nextThicknessMm = layer.thicknessMm - stepMm;
      if (nextThicknessMm < 20) {
        continue;
      }

      const variantLayers = buildReducedThicknessVariant(layers, index, nextThicknessMm);
      const variantResult = calculateDynamicAirborneResult(variantLayers, {
        ...options,
        disableSingleLeafMasonryFloor: true,
        singleLeafMasonryFloorGuardDepth: guardDepth + 1,
        screeningEstimatedRwDb: estimateRwDb(variantLayers)
      });
      const variantMetric = computeContextMetric(variantResult.curve, options.airborneContext);

      if (typeof variantMetric === "number" && Number.isFinite(variantMetric)) {
        floorMetric = Math.max(floorMetric, variantMetric);
        siblingMetrics.push(`${Math.round(nextThicknessMm)} mm -> ${variantMetric.toFixed(1)} dB`);
      }
    }
  }

  if (!(Number.isFinite(floorMetric) && floorMetric > currentMetric + 1e-6)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const targetMetric = Math.min(
    floorMetric,
    currentMetric + (options.airborneContext?.contextMode === "element_lab" ? 6 : 5)
  );
  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);

  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `Single-leaf non-homogeneous masonry was floored against thinner sibling variants to avoid a non-physical thickness dip (target ${targetMetric.toFixed(1)} dB${siblingMetrics.length ? `; siblings: ${siblingMetrics.join(", ")}` : ""}).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "single_leaf_masonry_floor",
    targetMetric
  };
}

function applyNarrowHeavyDoubleLeafGapCap(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];
  const guardDepth = options.narrowHeavyDoubleLeafGapGuardDepth ?? 0;

  if (options.disableNarrowHeavyDoubleLeafGapGuard || guardDepth >= 6) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    topology.hasPorousFill ||
    topology.hasStudLikeSupport
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const cavity = describePrimaryCavity(layers);
  const gapMm = Math.max(cavity.gapThicknessMm, 0);
  if (!(gapMm > 0 && gapMm <= 15)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const leafMassesKgM2 = topology.visibleLeafMassesKgM2.filter((value) => value > 0);
  const lightestLeafMassKgM2 = Math.min(...leafMassesKgM2);
  const totalMassKgM2 = topology.surfaceMassKgM2;
  const hasMasonrySignal = layers.some(isMasonryLikeLayer);
  const hasAacLike = layers.some(isAacLikeLayer);
  const masonryHeavy =
    hasMasonrySignal &&
    totalMassKgM2 >= 100 &&
    Number.isFinite(lightestLeafMassKgM2) &&
    lightestLeafMassKgM2 >= 30;
  const compositeHeavy =
    totalMassKgM2 >= 120 &&
    Number.isFinite(lightestLeafMassKgM2) &&
    lightestLeafMassKgM2 >= 35 &&
    topology.originalSolidLayerCount >= 4;

  if (!masonryHeavy && !compositeHeavy) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const equivalentLayers = buildNarrowGapContactEquivalentLayers(layers);
  if (equivalentLayers.length === layers.length) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const equivalentResult = calculateDynamicAirborneResult(equivalentLayers, {
    ...options,
    disableNarrowHeavyDoubleLeafGapGuard: true,
    narrowHeavyDoubleLeafGapGuardDepth: guardDepth + 1,
    screeningEstimatedRwDb: estimateRwDb(equivalentLayers)
  });
  const equivalentMetric = computeContextMetric(equivalentResult.curve, options.airborneContext);
  const currentMetric = computeContextMetric(curve, options.airborneContext);

  if (
    !(typeof equivalentMetric === "number" && Number.isFinite(equivalentMetric)) ||
    !(typeof currentMetric === "number" && Number.isFinite(currentMetric))
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  let maxIncrementDb = 2.5 + (0.25 * gapMm);
  if (!hasAacLike && totalMassKgM2 >= 180) {
    maxIncrementDb += 0.75;
  }
  maxIncrementDb = clamp(maxIncrementDb, hasAacLike ? 4.0 : 4.5, hasAacLike ? 5.5 : 6.5);

  const targetMetric = ksRound1(equivalentMetric + maxIncrementDb);
  if (!(currentMetric > targetMetric + 1e-6)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric
    };
  }

  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);
  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `A very narrow heavy gap was capped against the contact-equivalent wall because the separated double-leaf path exceeded the no-gap sibling by more than the allowed gain band (contact-equivalent ${equivalentMetric.toFixed(1)} dB, target ${targetMetric.toFixed(1)} dB, gap ${gapMm.toFixed(1)} mm).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "narrow_heavy_gap_cap",
    targetMetric
  };
}

function applyHeavyUnframedCavityScreeningCap(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  family: DynamicAirborneFamily,
  framingHint: DynamicFramingHint,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];

  if (family !== "double_leaf" && family !== "multileaf_multicavity") {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const risk = summarizeHeavyUnframedCavityRisk(layers, topology, framingHint);
  if (!risk.applies) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const currentMetric = computeContextMetric(curve, options.airborneContext);
  const screeningCurve = buildCalibratedMassLawCurve(topology.surfaceMassKgM2, options.screeningEstimatedRwDb);
  const screeningMetric = computeContextMetric(screeningCurve, options.airborneContext);

  if (
    !(typeof currentMetric === "number" && Number.isFinite(currentMetric)) ||
    !(typeof screeningMetric === "number" && Number.isFinite(screeningMetric))
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const targetMetric = ksRound1(screeningMetric + risk.allowedLiftDb);
  if (!(currentMetric > targetMetric + 1e-6)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric
    };
  }

  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);
  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `A heavy unframed ${family === "multileaf_multicavity" ? "multi-cavity" : "cavity"} wall was capped against the screening corridor because the selected family lane was outrunning a conservative mass-based anchor by more than the allowed gain band (screening ${screeningMetric.toFixed(1)} dB, target ${targetMetric.toFixed(1)} dB, max leaf ${risk.maxLeafMassKgM2.toFixed(1)} kg/m2, board fraction ${risk.boardMassFraction.toFixed(2)}).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "heavy_unframed_cavity_cap",
    targetMetric
  };
}

function applyLinedMassiveMasonryMonotonicFloor(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];
  const guardDepth = options.linedMassiveMasonryFloorGuardDepth ?? 0;

  if (options.disableLinedMassiveMasonryFloor || guardDepth >= 6) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const lightestLeafMassKgM2 = Math.min(...topology.visibleLeafMassesKgM2.filter((value) => value > 0));
  const dominantLeafMassKgM2 = Math.max(...topology.visibleLeafMassesKgM2, 0);

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    topology.hasStudLikeSupport ||
    !Number.isFinite(lightestLeafMassKgM2) ||
    !(lightestLeafMassKgM2 > 0 && lightestLeafMassKgM2 <= 20) ||
    !(dominantLeafMassKgM2 >= 45) ||
    !((topology.visibleLeafMassRatio ?? 1) >= 2.4)
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const candidateIndexes = layers
    .map((layer, index) => ({ index, layer }))
    .filter(({ layer }) => isMasonryCoreLayer(layer) && layer.thicknessMm >= 60)
    .sort((left, right) => right.layer.surfaceMassKgM2 - left.layer.surfaceMassKgM2)
    .map((entry) => entry.index);

  if (!candidateIndexes.length) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const currentMetric = computeContextMetric(curve, options.airborneContext);
  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
      strategySuffix: null,
      targetMetric: null
    };
  }

  let floorMetric = Number.NEGATIVE_INFINITY;
  const siblingMetrics: string[] = [];

  for (const index of candidateIndexes) {
    const layer = layers[index];
    if (!layer) {
      continue;
    }

    for (const stepMm of [10, 20, 40]) {
      const nextThicknessMm = layer.thicknessMm - stepMm;
      if (nextThicknessMm < 40) {
        continue;
      }

      const variantLayers = buildReducedThicknessVariant(layers, index, nextThicknessMm);
      const variantResult = calculateDynamicAirborneResult(variantLayers, {
        ...options,
        disableLinedMassiveMasonryFloor: true,
        linedMassiveMasonryFloorGuardDepth: guardDepth + 1,
        screeningEstimatedRwDb: estimateRwDb(variantLayers)
      });
      const variantMetric = computeContextMetric(variantResult.curve, options.airborneContext);

      if (typeof variantMetric === "number" && Number.isFinite(variantMetric)) {
        floorMetric = Math.max(floorMetric, variantMetric);
        siblingMetrics.push(`${Math.round(nextThicknessMm)} mm -> ${variantMetric.toFixed(1)} dB`);
      }
    }
  }

  if (!(Number.isFinite(floorMetric) && floorMetric > currentMetric + 1e-6)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const targetMetric = Math.min(floorMetric, currentMetric + (options.airborneContext?.contextMode === "element_lab" ? 8 : 7));
  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);

  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `Masonry-backed lined-massive result was floored against thinner sibling variants to avoid a non-physical family-transition drop (target ${targetMetric.toFixed(1)} dB${siblingMetrics.length ? `; siblings: ${siblingMetrics.join(", ")}` : ""}).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "reinforcement_monotonic_floor",
    targetMetric
  };
}

function applyMixedSecurityBoardDoubleStudFieldTrim(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  trimDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";

  if (contextMode === "element_lab") {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      trimDb: 0
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    boardSystem.boardTier !== "double_board" ||
    boardSystem.boardLayerCount !== 4 ||
    boardSystem.securityBoardCount !== 1 ||
    !(boardSystem.acousticBoardFraction > 0 && boardSystem.acousticBoardFraction < 0.5) ||
    boardSystem.primaryGapLayerCount < 2 ||
    cavity.coreThicknessMm < 140 ||
    cavity.porousThicknessMm <= 0 ||
    !(topology.surfaceMassKgM2 <= 42.5) ||
    !((topology.visibleLeafMassRatio ?? 1) >= 1.05)
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      trimDb: 0
    };
  }

  const trimDb = 0.7;
  const trimmedCurve = shiftCurve(curve, -trimDb);
  const ratings = buildRatingsFromCurve(trimmedCurve.frequenciesHz, trimmedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    "A mixed security-board double-stud field trim reduced the surrogate slightly because this light asymmetrical split-cavity stack was otherwise over-scoring against the framed-wall holdout corridor."
  );

  return {
    applied: true,
    curve: trimmedCurve,
    notes,
    ratings,
    strategySuffix: "mixed_security_board_double_stud_field_trim",
    trimDb
  };
}

function applyFramedReinforcementMonotonicFloor(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  family: DynamicAirborneFamily,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];
  const guardDepth = options.framedReinforcementMonotonicGuardDepth ?? 0;

  if (
    options.disableFramedReinforcementMonotonicFloor ||
    guardDepth >= 6 ||
    (family !== "stud_wall_system" && family !== "double_stud_system")
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const contextMode = options.airborneContext?.contextMode ?? "element_lab";
  if (!/^(element_lab|field_between_rooms|building_prediction)$/.test(contextMode)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (topology.visibleLeafCount !== 2 || topology.cavityCount !== 1) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);

  if (
    boardSystem.boardLayerCount < 3
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const candidateIndexes: number[] = [];
  const leadingCandidateIndex = findOuterLeafReinforcementCandidateIndex(layers, "leading");
  const trailingCandidateIndex = findOuterLeafReinforcementCandidateIndex(layers, "trailing");

  if (leadingCandidateIndex !== null) {
    candidateIndexes.push(leadingCandidateIndex);
  }
  if (trailingCandidateIndex !== null && trailingCandidateIndex !== leadingCandidateIndex) {
    candidateIndexes.push(trailingCandidateIndex);
  }

  if (!candidateIndexes.length) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const currentMetric = computeContextMetric(curve, options.airborneContext);
  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  let floorMetric = Number.NEGATIVE_INFINITY;
  const siblingMetrics: string[] = [];

  for (const candidateIndex of candidateIndexes) {
    const variantLayers = layers.filter((_, index) => index !== candidateIndex);
    const variantTopology = summarizeAirborneTopology(variantLayers);

    if (variantTopology.visibleLeafCount !== topology.visibleLeafCount || variantTopology.cavityCount !== topology.cavityCount) {
      continue;
    }

    const variantResult = calculateDynamicAirborneResult(variantLayers, {
      ...options,
      framedReinforcementMonotonicGuardDepth: guardDepth + 1,
      screeningEstimatedRwDb: estimateRwDb(variantLayers)
    });
    const variantMetric = computeContextMetric(variantResult.curve, options.airborneContext);

    if (
      variantResult.trace.detectedFamily === family &&
      typeof variantMetric === "number" &&
      Number.isFinite(variantMetric)
    ) {
      floorMetric = Math.max(floorMetric, variantMetric);
      siblingMetrics.push(`remove layer ${candidateIndex + 1} -> ${variantMetric.toFixed(1)} dB`);
    }
  }

  if (!(Number.isFinite(floorMetric) && floorMetric > currentMetric + 1e-6)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const targetMetric = Math.min(
    floorMetric,
    currentMetric + (contextMode === "element_lab" ? 4 : 5)
  );
  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);

  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `A framed reinforcement monotonic floor was applied because one-face board reinforcement unexpectedly scored below its lighter sibling variant (target ${targetMetric.toFixed(1)} dB${siblingMetrics.length ? `; siblings: ${siblingMetrics.join(", ")}` : ""}).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "reinforcement_monotonic_floor",
    targetMetric
  };
}

function applyHighFillSingleBoardStudFieldLift(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  liftDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";

  if (contextMode === "element_lab") {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);
  const fillFraction = cavity.coreThicknessMm > 0 ? clamp(cavity.porousThicknessMm / cavity.coreThicknessMm, 0, 1) : 0;

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    boardSystem.boardTier !== "single_board" ||
    boardSystem.primaryGapLayerCount >= 2 ||
    boardSystem.acousticBoardFraction >= 0.25 ||
    boardSystem.securityBoardCount > 0 ||
    !(topology.surfaceMassKgM2 <= 24) ||
    cavity.coreThicknessMm < 120 ||
    cavity.coreThicknessMm > 140 ||
    fillFraction < 0.62 ||
    options.airborneContext?.sharedTrack !== "independent" ||
    options.airborneContext?.studType !== "light_steel_stud"
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const liftDb = 0.6;
  const liftedCurve = shiftCurve(curve, liftDb);
  const ratings = buildRatingsFromCurve(liftedCurve.frequenciesHz, liftedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    "A high-fill single-board stud field lift nudged the surrogate upward because this deeper independent W111-style cavity was still slightly under-scoring on the field side."
  );

  return {
    applied: true,
    curve: liftedCurve,
    notes,
    ratings,
    strategySuffix: "high_fill_single_board_stud_field_lift",
    liftDb
  };
}

function applyMixedBoardEmptyCavityFieldMidbandLift(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  liftDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";

  if (contextMode === "element_lab") {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);
  const studType = options.airborneContext?.studType ?? "auto";
  const connectionType = options.airborneContext?.connectionType ?? "auto";

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    boardSystem.boardTier !== "mixed_board" ||
    boardSystem.boardLayerCount !== 5 ||
    boardSystem.primaryGapLayerCount !== 1 ||
    boardSystem.acousticBoardFraction >= 0.25 ||
    boardSystem.securityBoardCount > 0 ||
    cavity.gapThicknessMm < 45 ||
    cavity.gapThicknessMm > 55 ||
    cavity.porousThicknessMm > 0 ||
    !(topology.surfaceMassKgM2 >= 45 && topology.surfaceMassKgM2 <= 65) ||
    !(
      studType === "light_steel_stud" ||
      studType === "resilient_stud"
    ) ||
    !(
      connectionType === "line_connection" ||
      connectionType === "resilient_channel"
    )
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const liftDb = 0.5;
  const liftedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: curve.transmissionLossDb.map((value, index) => {
      const weight = octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 100, 1600, 0.45);
      return clamp(value + (liftDb * weight), 0, 95);
    })
  };
  const ratings = buildRatingsFromCurve(liftedCurve.frequenciesHz, liftedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    "A mixed-board empty-cavity field midband lift was applied because asymmetric five-board gypsum framed walls were still under-reading R'w and DnT,w on the field side after the lab corridor had already stabilized."
  );

  return {
    applied: true,
    curve: liftedCurve,
    notes,
    ratings,
    strategySuffix: "mixed_board_empty_cavity_field_midband_lift",
    liftDb
  };
}

function applyMixedPremiumSplitFieldLift(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  liftDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";

  if (contextMode === "element_lab") {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);
  const heavierLeafBoards = Math.max(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount);
  const lighterLeafBoards = Math.min(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount);
  const leafMassRatio = topology.visibleLeafMassRatio ?? 1;

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    boardSystem.boardTier !== "mixed_board" ||
    boardSystem.securityBoardCount > 0 ||
    boardSystem.primaryGapLayerCount < 2 ||
    cavity.porousThicknessMm <= 0 ||
    boardSystem.acousticBoardFraction < 0.5 ||
    options.airborneContext?.studType !== "light_steel_stud" ||
    options.airborneContext?.connectionType !== "line_connection" ||
    options.airborneContext?.sharedTrack !== "independent" ||
    lighterLeafBoards !== 1 ||
    leafMassRatio < 1.8
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  let liftDb = 0;
  if (heavierLeafBoards === 2 && boardSystem.acousticBoardFraction >= 0.85) {
    liftDb = 5.5;
  } else if (heavierLeafBoards >= 3) {
    liftDb = 7;
  }

  if (!(liftDb > 0)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      liftDb: 0
    };
  }

  const liftedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: curve.transmissionLossDb.map((value, index) => {
      const weight = octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 100, 2000, 0.55);
      return clamp(value + (liftDb * weight), 0, 95);
    })
  };
  const ratings = buildRatingsFromCurve(liftedCurve.frequenciesHz, liftedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    "A mixed premium split-cavity field lift was applied because asymmetrical enhanced-board framed walls were still under-reading R'w and DnT,w on the field side after the lab corridor had been corrected."
  );

  return {
    applied: true,
    curve: liftedCurve,
    notes,
    ratings,
    strategySuffix: "mixed_premium_split_field_lift",
    liftDb
  };
}

function applyDiamondHybridResilientFieldMidbandTrim(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  trimDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";
  const isResilient =
    options.airborneContext?.connectionType === "resilient_channel" ||
    options.airborneContext?.studType === "resilient_stud";

  if (contextMode === "element_lab" || !isResilient) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      trimDb: 0
    };
  }

  const mixedEnhancedFamily = detectMixedEnhancedFilledSingleBoardFamily(layers);
  const securityFamily = detectSecurityFilledSingleBoardFamily(layers);
  const fillThicknessMm = mixedEnhancedFamily?.fillThicknessMm ?? securityFamily?.fillThicknessMm ?? null;
  const familyKey =
    mixedEnhancedFamily?.family ??
    (securityFamily?.family === "diamond" ? "diamond_security" : null);

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    !fillThicknessMm ||
    fillThicknessMm < 39 ||
    fillThicknessMm > 45 ||
    !(
      familyKey === "diamond_fire" ||
      familyKey === "diamond_firestop" ||
      familyKey === "diamond_security"
    )
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      trimDb: 0
    };
  }

  const trimDb =
    familyKey === "diamond_security"
      ? 2.2
      : 2.6;
  const trimmedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: curve.transmissionLossDb.map((value, index) => {
      const weight = octaveBandWindowWeight(curve.frequenciesHz[index] ?? 0, 500, 3150, 0.4);
      return clamp(value - (trimDb * weight), 0, 95);
    })
  };
  const ratings = buildRatingsFromCurve(trimmedCurve.frequenciesHz, trimmedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    "A narrow resilient diamond-hybrid high-band trim was applied because certain 42 mm premium mineral-filled framed hybrids were still over-reading DnT,A against the upstream field corridor after the main single-board corridor had already aligned R'w."
  );

  return {
    applied: true,
    curve: trimmedCurve,
    notes,
    ratings,
    strategySuffix: "diamond_hybrid_resilient_field_midband_trim",
    trimDb
  };
}

function applyMixedPlainModerateSingleBoardLabTemplate(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  templateContext: "field" | "lab" | null;
  templateId: MixedPlainModerateTemplateId | null;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";
  const fieldLikeContext = contextMode === "field_between_rooms" || contextMode === "building_prediction";

  if (contextMode !== "element_lab" && !fieldLikeContext) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      templateContext: null,
      templateId: null
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);
  const premiumSingleBoardCandidate = summarizePremiumSingleBoardFramedCandidate(layers, boardSystem, cavity, topology);
  const familyInfo = getMixedPlainModerateFamilyAndTemplateId(premiumSingleBoardCandidate);

  if (!familyInfo) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      templateContext: null,
      templateId: null
    };
  }

  const profile = getMixedPlainModerateTemplateProfile(options.airborneContext);
  const templateId = familyInfo.templateId;
  const family = familyInfo.family;

  if (contextMode === "element_lab") {
    const fillAnchors = MIXED_PLAIN_MODERATE_LAB_TARGET_RW[family][profile];
    const labTargetRw = ksRound1(
      interpolateTemplateDbByFill(
        {
          35: [fillAnchors[35]],
          42: [fillAnchors[42]],
          50: [fillAnchors[50]],
          60: [fillAnchors[60]]
        },
        cavity.coreThicknessMm
      )[0]
    );
    const currentRw = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext).iso717.Rw;
    const shiftDb = labTargetRw - currentRw;

    if (Math.abs(shiftDb) < 0.2) {
      return {
        applied: false,
        curve,
        notes,
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
        strategySuffix: null,
        templateContext: null,
        templateId: null
      };
    }

    const shiftedCurve = {
      frequenciesHz: [...curve.frequenciesHz],
      transmissionLossDb: curve.transmissionLossDb.map((valueDb) => clamp(valueDb + shiftDb, 0, 95))
    };
    const ratings = buildRatingsFromCurve(
      shiftedCurve.frequenciesHz,
      shiftedCurve.transmissionLossDb,
      options.airborneContext
    );

    notes.push(
      templateId === "mixed_plain_acoustic_filled"
        ? "A mixed plain-gypsum + acoustic-gypsum filled single-board lab target was applied because the previous moderate hybrid lane was materially under-scoring this wall against the upstream lab corridor."
        : templateId === "mixed_plain_firestop_filled"
          ? "A mixed plain-gypsum + firestop filled single-board lab target was applied because the previous moderate fire-rated hybrid lane was materially under-scoring this wall against the upstream lab corridor."
          : "A mixed plain-gypsum + fire-board filled single-board lab target was applied because the previous moderate fire-rated hybrid lane was materially under-scoring this wall against the upstream lab corridor."
    );

    return {
      applied: true,
      curve: shiftedCurve,
      notes,
      ratings,
      strategySuffix: "mixed_plain_moderate_lab_target",
      templateContext: "lab",
      templateId
    };
  }

  const fieldTemplatesByProfile = MIXED_PLAIN_MODERATE_FIELD_TEMPLATES[family][profile];
  const templatedCurve = buildInterpolatedTemplateCurve(curve, cavity.coreThicknessMm, fieldTemplatesByProfile);

  if (!templatedCurve) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      templateContext: null,
      templateId: null
    };
  }

  const ratings = buildRatingsFromCurve(
    templatedCurve.frequenciesHz,
    templatedCurve.transmissionLossDb,
    options.airborneContext
  );
  notes.push(
    templateId === "mixed_plain_acoustic_filled"
      ? "A mixed plain-gypsum + acoustic-gypsum filled single-board field template was applied because the moderate hybrid field lane was materially over-reading this wall against the upstream field corridor."
      : templateId === "mixed_plain_firestop_filled"
        ? "A mixed plain-gypsum + firestop filled single-board field template was applied because the moderate fire-rated field lane was materially over-reading this wall against the upstream field corridor."
        : "A mixed plain-gypsum + fire-board filled single-board field template was applied because the moderate fire-rated field lane was materially over-reading this wall against the upstream field corridor."
  );

  return {
    applied: true,
    curve: templatedCurve,
    notes,
    ratings,
    strategySuffix: "mixed_plain_moderate_field_template",
    templateContext: "field",
    templateId
  };
}

function applyPremiumSingleBoardFieldCorrection(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  correctionMode:
    | "mixed_plain_diamond_filled"
    | "mixed_plain_silent_filled"
    | "low_mass_empty_enhanced"
    | "low_mass_filled_enhanced"
    | "plain_gypsum_filled"
    | "silentboard_heavy_filled"
    | "standard"
    | null;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  shiftDb: number;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";

  if (contextMode === "element_lab") {
    return {
      applied: false,
      curve,
      correctionMode: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      shiftDb: 0
    };
  }

  const boardSystem = summarizeFramedBoardSystem(layers);
  const cavity = describePrimaryCavity(layers);
  const premiumSingleBoardCandidate = summarizePremiumSingleBoardFramedCandidate(layers, boardSystem, cavity, topology);
  const securityFilledSingleBoardFamily = detectSecurityFilledSingleBoardFamily(layers);
  const symmetricEnhancedFilledSingleBoardFamily = detectSymmetricEnhancedFilledSingleBoardFamily(layers);
  const plainGypsumFilledSingleBoard = isPlainGypsumFilledSingleBoardCandidate(
    layers,
    boardSystem,
    cavity,
    topology
  );
  const singleBoardLike =
    boardSystem.boardTier === "single_board" ||
    (boardSystem.boardTier === "mixed_board" && boardSystem.averageBoardsPerLeaf < 2);
  const isResilient =
    options.airborneContext?.connectionType === "resilient_channel" ||
    options.airborneContext?.studType === "resilient_stud";

  if (
    !singleBoardLike ||
    securityFilledSingleBoardFamily ||
    symmetricEnhancedFilledSingleBoardFamily ||
    detectFireRatedFilledSingleBoardFamily(layers) ||
    (!premiumSingleBoardCandidate.qualifies && !plainGypsumFilledSingleBoard)
  ) {
    return {
      applied: false,
      curve,
      correctionMode: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      shiftDb: 0
    };
  }

  if (
    premiumSingleBoardCandidate.mixedPlainAcousticFilled ||
    premiumSingleBoardCandidate.mixedPlainFireFilled ||
    premiumSingleBoardCandidate.mixedPlainFirestopFilled
  ) {
    return {
      applied: false,
      curve,
      correctionMode: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      shiftDb: 0
    };
  }

  if (
    premiumSingleBoardCandidate.mixedPlainDiamondFilled ||
    premiumSingleBoardCandidate.mixedPlainSilentFilled
  ) {
    const premiumFamilyInfo = getMixedPlainPremiumFamilyAndTemplateId(premiumSingleBoardCandidate);
    const profile = getMixedPlainModerateTemplateProfile(options.airborneContext);
    const templatedCurve =
      premiumFamilyInfo === null
        ? null
        : buildInterpolatedTemplateCurve(
            curve,
            cavity.coreThicknessMm,
            MIXED_PLAIN_PREMIUM_FIELD_TEMPLATES[premiumFamilyInfo.family][profile]
          );

    if (templatedCurve) {
      const ratings = buildRatingsFromCurve(
        templatedCurve.frequenciesHz,
        templatedCurve.transmissionLossDb,
        options.airborneContext
      );

      notes.push(
        premiumSingleBoardCandidate.mixedPlainSilentFilled
          ? "A mixed plain-gypsum + silentboard filled single-board field template was applied because the previous shared premium field lane was materially misreading the steel versus resilient corridor for this hybrid wall."
          : "A mixed plain-gypsum + diamond filled single-board field template was applied because the previous shared premium field lane was materially misreading the steel versus resilient corridor for this hybrid wall."
      );

      return {
        applied: true,
        curve: templatedCurve,
        correctionMode: premiumSingleBoardCandidate.mixedPlainSilentFilled
          ? "mixed_plain_silent_filled"
          : "mixed_plain_diamond_filled",
        notes,
        ratings,
        strategySuffix: "mixed_plain_premium_field_template",
        shiftDb: 0
      };
    }
  }

  let shiftDb = 0;
  if (plainGypsumFilledSingleBoard) {
    if (isResilient) {
      shiftDb = 4.4 - clamp((cavity.coreThicknessMm - 35) * 0.04, 0, 1.1);
    } else {
      shiftDb = -(4.8 - clamp((cavity.coreThicknessMm - 35) * 0.04, 0, 1.1));
    }
  } else if (premiumSingleBoardCandidate.silentboardHeavyFilledPremium) {
    if (isResilient) {
      shiftDb =
        6.1 +
        (premiumSingleBoardCandidate.hasDiamondLikeBoard ? 0.4 : 0) -
        clamp((cavity.coreThicknessMm - 35) * 0.03, 0, 0.9);
    } else {
      shiftDb = -(4.0 - clamp((cavity.coreThicknessMm - 35) * 0.05, 0, 1.2));
    }
  } else if (
    !detectFireRatedFilledSingleBoardFamily(layers) &&
    !detectSecurityFilledSingleBoardFamily(layers) &&
    (
      premiumSingleBoardCandidate.lowMassFilledEnhanced ||
      premiumSingleBoardCandidate.mixedAcousticPremiumFilled ||
      premiumSingleBoardCandidate.mixedAcousticSilentFilled
    )
  ) {
    if (premiumSingleBoardCandidate.mixedAcousticSilentFilled) {
      if (isResilient) {
        shiftDb =
          4.4 +
          clamp((cavity.coreThicknessMm - 35) * 0.02, 0, 0.8);
      } else {
        shiftDb = -(
          4.6 +
          clamp((cavity.coreThicknessMm - 35) * 0.03, 0, 0.5)
        );
      }
    } else {
      const premiumHighBoardBoost =
        premiumSingleBoardCandidate.hasDiamondLikeBoard || premiumSingleBoardCandidate.hasSilentboardLikeBoard
          ? 1
          : 0;
      if (isResilient) {
        shiftDb =
          2.2 +
          (premiumHighBoardBoost > 0 ? 0.4 : 0) +
          clamp((cavity.coreThicknessMm - 35) * 0.04, 0, 1.2);
      } else {
        shiftDb = -(
          3.8 +
          (premiumHighBoardBoost > 0 ? 0.3 : 0) -
          clamp((cavity.coreThicknessMm - 35) * 0.05, 0, 1.2)
        );
      }
    }
  } else if (premiumSingleBoardCandidate.lowMassEmptyEnhanced) {
    if (isResilient) {
      shiftDb = premiumSingleBoardCandidate.hasDiamondLikeBoard ? 2.5 : 3;
    } else {
      shiftDb = premiumSingleBoardCandidate.hasDiamondLikeBoard ? -3 : -2.5;
    }
  } else if (isResilient) {
    shiftDb = cavity.porousThicknessMm > 0 ? 6.5 : 3;
  } else if (cavity.porousThicknessMm > 0 && boardSystem.acousticBoardFraction >= 0.5) {
    shiftDb = -4;
  } else if (cavity.porousThicknessMm <= 0 && boardSystem.acousticBoardFraction >= 0.5) {
    shiftDb = -1;
  }

  if (!(Math.abs(shiftDb) >= 0.2)) {
    return {
      applied: false,
      curve,
      correctionMode: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      shiftDb: 0
    };
  }

  const correctedCurve = shiftCurve(curve, shiftDb);
  const ratings = buildRatingsFromCurve(correctedCurve.frequenciesHz, correctedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    plainGypsumFilledSingleBoard
      ? (shiftDb > 0
          ? "A resilient plain gypsum filled single-board field lift was applied because light gypsum + mineral-wool framed walls were still under-reading the upstream field corridor."
          : "A plain gypsum filled single-board field trim was applied because light gypsum + mineral-wool framed walls were still over-reading the upstream steel-stud field corridor.")
      : premiumSingleBoardCandidate.silentboardHeavyFilledPremium
      ? (shiftDb > 0
          ? "A resilient silentboard-heavy filled premium field lift was applied because heavy silentboard framed cavities were still slightly under-reading the upstream field corridor."
          : "A silentboard-heavy filled premium field trim was applied because mixed silentboard framed cavities were still over-reading the upstream steel-stud field corridor.")
      : (
        !detectFireRatedFilledSingleBoardFamily(layers) &&
        !detectSecurityFilledSingleBoardFamily(layers) &&
        (
          premiumSingleBoardCandidate.lowMassFilledEnhanced ||
          premiumSingleBoardCandidate.mixedAcousticPremiumFilled ||
          premiumSingleBoardCandidate.mixedAcousticSilentFilled
        )
      )
      ? (shiftDb > 0
          ? "A resilient low-mass filled premium single-board field lift was applied because shallow enhanced mineral-filled cavities were still under-reading the upstream field corridor."
          : "A low-mass filled premium single-board field trim was applied because shallow enhanced mineral-filled cavities were otherwise over-carrying the lab lift on the steel-stud field side.")
      : premiumSingleBoardCandidate.lowMassEmptyEnhanced
      ? (shiftDb > 0
          ? "A resilient low-mass premium single-board field lift was applied because light fire/diamond empty cavities were still under-reading the upstream field corridor."
          : "A low-mass premium single-board field trim was applied because light fire/diamond empty cavities were otherwise over-carrying the lab lift on the steel-stud field side.")
      : (shiftDb > 0
          ? "A resilient premium single-board field lift was applied because heavy 1x1 and 1x2 enhanced-board cavities were still under-reading the upstream field corridor."
          : "A premium single-board field trim was applied because heavy enhanced-board cavities were over-carrying the lab lift on the steel-stud field side.")
  );

  return {
    applied: true,
    curve: correctedCurve,
    correctionMode:
      plainGypsumFilledSingleBoard
        ? "plain_gypsum_filled"
        : premiumSingleBoardCandidate.silentboardHeavyFilledPremium
          ? "silentboard_heavy_filled"
        : (
          !detectFireRatedFilledSingleBoardFamily(layers) &&
          !detectSecurityFilledSingleBoardFamily(layers) &&
          (
            premiumSingleBoardCandidate.lowMassFilledEnhanced ||
            premiumSingleBoardCandidate.mixedAcousticPremiumFilled ||
            premiumSingleBoardCandidate.mixedAcousticSilentFilled
          )
        )
        ? "low_mass_filled_enhanced"
        : premiumSingleBoardCandidate.lowMassEmptyEnhanced
          ? "low_mass_empty_enhanced"
          : "standard",
    notes,
    ratings,
    strategySuffix: "premium_single_board_field_correction",
    shiftDb
  };
}

function applyMicroGapFillEquivalenceGuard(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];
  const contextMode = options.airborneContext?.contextMode ?? "element_lab";
  const boardSystem = summarizeFramedBoardSystem(layers);

  if (boardSystem.boardTier !== "single_board" || !isMicroGapHighFillEquivalentCavity(layers, topology)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const equivalentLayers = buildMicroGapFillOnlyEquivalentLayers(layers, topology);
  if (!equivalentLayers?.length) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const equivalentResult = calculateDynamicAirborneResult(equivalentLayers, {
    ...options,
    screeningEstimatedRwDb: estimateRwDb(equivalentLayers)
  });
  const equivalentMetric = computeMicroGapEquivalenceMetric(equivalentResult.curve, options.airborneContext);
  const currentMetric = computeMicroGapEquivalenceMetric(curve, options.airborneContext);

  if (
    !(typeof equivalentMetric === "number" && Number.isFinite(equivalentMetric)) ||
    !(typeof currentMetric === "number" && Number.isFinite(currentMetric))
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const maxDriftDb = contextMode === "element_lab" ? 2 : 3;
  const lowerBound = equivalentMetric - maxDriftDb;
  const upperBound = equivalentMetric + maxDriftDb;

  if (currentMetric >= lowerBound - 1e-6 && currentMetric <= upperBound + 1e-6) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetMetric: null
    };
  }

  const targetMetric = clamp(currentMetric, lowerBound, upperBound);
  const anchored = anchorCurveToComputedMetric(
    curve,
    targetMetric,
    options.airborneContext,
    (candidateCurve) => computeMicroGapEquivalenceMetric(candidateCurve, options.airborneContext)
  );

  if (!anchored.applied) {
    return {
      applied: false,
      curve,
      notes,
      ratings: anchored.ratings,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `A very small explicit air gap inside a mostly filled framed cavity was kept within the fill-only equivalent corridor (target ${targetMetric.toFixed(1)} dB; fill-only equivalent ${equivalentMetric.toFixed(1)} dB, current ${currentMetric.toFixed(1)} dB).`
  );

  return {
    applied: true,
    curve: anchored.curve,
    notes,
    ratings: anchored.ratings,
    strategySuffix: "micro_gap_fill_equivalence_guard",
    targetMetric
  };
}

function applyAmbiguousFamilyBoundaryHold(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  selectedFamily: DynamicAirborneFamily,
  boundary: FamilyDecisionBoundarySummary,
  options: DynamicAirborneOptions
): {
  allowedLeadDb: number | null;
  applied: boolean;
  boundaryCeilingDb: number | null;
  curve: TransmissionLossCurve;
  currentMetricDb: number | null;
  notes: string[];
  ratings: AssemblyRatings;
  runnerUpMetric: number | null;
  strategySuffix: string | null;
  targetMetric: number | null;
} {
  const notes: string[] = [];

  if (
    options.disableFamilyBoundaryHold ||
    !boundary.runnerUpFamily ||
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1
  ) {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric: null,
      strategySuffix: null,
      targetMetric: null
    };
  }

  const familyPair = [selectedFamily, boundary.runnerUpFamily].sort().join("|");
  // Keep the hold tightly scoped until MorphologyV2 exists; broader suppression would risk flattening true multi-leaf behavior.
  if (familyPair !== ["double_leaf", "lined_massive_wall"].sort().join("|")) {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric: null,
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (boundary.decisionClass !== "narrow" && boundary.decisionClass !== "ambiguous") {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: null,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric: null,
      strategySuffix: null,
      targetMetric: null
    };
  }

  const currentMetric = computeContextMetric(curve, options.airborneContext);
  if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: currentMetric,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric: null,
      strategySuffix: null,
      targetMetric: null
    };
  }

  const runnerUpResult = calculateDynamicAirborneResult(layers, {
    ...options,
    disableFamilyBoundaryHold: true,
    forcedFamily: boundary.runnerUpFamily,
    screeningEstimatedRwDb: options.screeningEstimatedRwDb
  });
  const runnerUpMetric = computeContextMetric(runnerUpResult.curve, options.airborneContext);

  if (!(typeof runnerUpMetric === "number" && Number.isFinite(runnerUpMetric))) {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: currentMetric,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric: null,
      strategySuffix: null,
      targetMetric: null
    };
  }

  if (!(currentMetric > runnerUpMetric + 1e-6)) {
    return {
      allowedLeadDb: null,
      applied: false,
      boundaryCeilingDb: null,
      curve,
      currentMetricDb: currentMetric,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric,
      strategySuffix: null,
      targetMetric: null
    };
  }

  const allowedLeadDb = boundary.decisionClass === "ambiguous" ? 4 : 5;
  const baseMaxTrimDb = boundary.decisionClass === "ambiguous" ? 2 : 1.5;
  const maxTrimDb = baseMaxTrimDb + (boundary.selectedBelowRunnerUp ? 1 : 0);
  const boundaryCeiling = runnerUpMetric + allowedLeadDb;

  if (!(currentMetric > boundaryCeiling + 1e-6)) {
    return {
      allowedLeadDb,
      applied: false,
      boundaryCeilingDb: boundaryCeiling,
      curve,
      currentMetricDb: currentMetric,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      runnerUpMetric,
      strategySuffix: null,
      targetMetric: boundaryCeiling
    };
  }

  const targetMetric = ksRound1(Math.max(boundaryCeiling, currentMetric - maxTrimDb));

  const anchored = anchorCurveToMetric(curve, targetMetric, options.airborneContext);
  if (!anchored.applied) {
    return {
      allowedLeadDb,
      applied: false,
      boundaryCeilingDb: boundaryCeiling,
      curve,
      currentMetricDb: currentMetric,
      notes,
      ratings: anchored.ratings,
      runnerUpMetric,
      strategySuffix: null,
      targetMetric
    };
  }

  notes.push(
    `An ambiguity hold trimmed ${FAMILY_LABELS[selectedFamily]} against the nearby ${FAMILY_LABELS[boundary.runnerUpFamily]} corridor because the current two-leaf family boundary was ${boundary.decisionClass} (runner-up ${runnerUpMetric.toFixed(1)} dB, ceiling ${boundaryCeiling.toFixed(1)} dB, target ${targetMetric.toFixed(1)} dB, current ${currentMetric.toFixed(1)} dB${boundary.selectedBelowRunnerUp ? `, conflict trim bonus ${(maxTrimDb - baseMaxTrimDb).toFixed(1)} dB` : ""}).`
  );

  return {
    allowedLeadDb,
    applied: true,
    boundaryCeilingDb: boundaryCeiling,
    curve: anchored.curve,
    currentMetricDb: currentMetric,
    notes,
    ratings: anchored.ratings,
    runnerUpMetric,
    strategySuffix: "family_boundary_hold",
    targetMetric
  };
}

function detectDynamicFamily(
  layers: readonly ResolvedLayer[],
  framingHint: DynamicFramingHint
): {
  family: DynamicAirborneFamily;
  notes: string[];
} {
  const topology = summarizeAirborneTopology(layers);
  const text = layers.map(materialText).join(" ");
  const dominantLeafMassKgM2 = Math.max(...topology.visibleLeafMassesKgM2, 0);
  const lightestLeafMassKgM2 = Math.min(...topology.visibleLeafMassesKgM2.filter((value) => value > 0));
  const asymmetry = topology.visibleLeafMassRatio ?? 1;
  const masonryProfile = summarizeSingleLeafMasonryProfile(layers);
  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);
  const notes: string[] = [];

  if (topology.visibleLeafCount <= 1) {
    const hasMassiveMineralSignal =
      /concrete|brick|block|masonry|stone|heavy-base|aac|gazbeton|ytong|aircrete|pumice|bims/.test(text) ||
      (topology.surfaceMassKgM2 >= 70 && topology.weightedSolidDensityKgM3 >= 650);

    if (
      masonryProfile.hasNonHomogeneousMasonryRisk &&
      masonryProfile.masonryMassRatio >= 0.55 &&
      topology.cavityCount === 0
    ) {
      notes.push(
        masonryProfile.hasPlasterLike
          ? "A cavity-free masonry/AAC core with plaster or mortar layering risk was detected, so the selector keeps the wall on the non-homogeneous masonry lane."
          : "A cavity-free AAC/block/silicate masonry leaf was detected, so the selector keeps the wall on the non-homogeneous masonry lane instead of the dense rigid-wall surrogate."
      );
      return { family: "masonry_nonhomogeneous", notes };
    }

    if (topology.originalSolidLayerCount >= 2) {
      if (hasMassiveMineralSignal) {
        notes.push(
          "Contiguous mineral finish plus masonry/AAC layers were collapsed into one visible leaf, so the selector keeps the wall on the rigid massive-wall lane instead of a laminated board surrogate."
        );
        return { family: "rigid_massive_wall", notes };
      }

      notes.push("Contiguous solid layers were collapsed into one visible leaf, so the topology is treated as a laminated single-leaf panel.");
      return { family: "laminated_single_leaf", notes };
    }

    if (hasMassiveMineralSignal || (topology.surfaceMassKgM2 >= 140 && topology.weightedSolidDensityKgM3 >= 1200)) {
      notes.push("Single heavy mineral leaf detected, so the rigid massive-wall family is preferred over lightweight panel surrogates.");
      return { family: "rigid_massive_wall", notes };
    }

    notes.push("Single lightweight or timber leaf detected; the selector will stay on a panel-family surrogate.");
    return { family: "single_leaf_panel", notes };
  }

  if (topology.visibleLeafCount >= 3 || topology.cavityCount >= 2) {
    notes.push("More than two visible leaves or more than one cavity was detected, so the selector falls back to a multi-leaf blend.");
    return { family: "multileaf_multicavity", notes };
  }

  const doubleStudSignature = summarizeDoubleStudSignature(layers, topology, framingHint);

  if (doubleStudSignature.likelyDoubleStud) {
    notes.push(
      `A deep split-cavity framed wall with independent-track metadata and ${doubleStudSignature.averageBoardsPerLeaf.toFixed(1)} boards per leaf was detected, so the selector promotes the wall from the generic stud surrogate onto the double-stud lane.`
    );
    return { family: "double_stud_system", notes };
  }

  if (framingEvidence.studEligible) {
    notes.push(
      framingEvidence.supportEvidence
        ? "Support or channel-like layers exist inside the separator, so the selector treats the wall as a stud-wall surrogate."
        : "Explicit framed metadata matched a board-dominant two-leaf cavity, so the selector allows the wall onto the stud-wall surrogate lane."
    );
    return { family: "stud_wall_system", notes };
  }

  if (
    dominantLeafMassKgM2 >= 70 &&
    Number.isFinite(lightestLeafMassKgM2) &&
    lightestLeafMassKgM2 <= 20 &&
    asymmetry >= 4 &&
    !framingEvidence.studEligible
  ) {
    notes.push("A dominant heavy leaf plus a very light lining leaf indicates a lined massive-wall topology.");
    return { family: "lined_massive_wall", notes };
  }

  notes.push("Two visible leaves around one compliant core were detected, so the selector uses the double-leaf family.");
  return { family: "double_leaf", notes };
}

function chooseBlend(
  family: DynamicAirborneFamily,
  layers: readonly ResolvedLayer[],
  framingHint: DynamicFramingHint
): { blend: DelegateBlend; notes: string[] } {
  const topology = summarizeAirborneTopology(layers);
  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);
  const text = layers.map(materialText).join(" ");
  const cavity = describePrimaryCavity(layers);
  const notes: string[] = [];

  if (family === "rigid_massive_wall") {
    notes.push("The rigid-wall path averages KS mass calibration with the Sharp coincidence-aware panel curve to avoid pure mass-law overstatement.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "ks_rw_calibrated", weight: 0.5 },
          { method: "sharp", weight: 0.5 }
        ],
        selectedMethod: "ks_rw_calibrated",
        strategy: "rigid_massive_blend"
      },
      notes
    };
  }

  if (family === "masonry_nonhomogeneous") {
    notes.push("Single-leaf AAC/block/plastered masonry stays on a Sharp-led conservative blend so the lane does not over-credit it like a dense homogeneous wall.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "sharp", weight: 0.55 },
          { method: "screening_mass_law_curve_seed_v3", weight: 0.3 },
          { method: "ks_rw_calibrated", weight: 0.15 }
        ],
        selectedMethod: "sharp",
        strategy: "masonry_nonhomogeneous_blend"
      },
      notes
    };
  }

  if (family === "single_leaf_panel") {
    if (/clt|timber|wood|mass-timber/.test(text)) {
      notes.push("Timber-like single leaves are blended between mass-law and Sharp so the selector keeps coincidence losses without collapsing to a brittle lightweight-panel curve.");
      return {
        blend: {
          adjustmentsDb: 0,
          delegates: [
            { method: "mass_law", weight: 0.5 },
            { method: "sharp", weight: 0.5 }
          ],
          selectedMethod: "sharp",
          strategy: "timber_panel_blend"
        },
        notes
      };
    }

    notes.push("Light single-leaf boards stay on the Sharp path because it best tracks coincidence-controlled behavior in the current local solver set.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [{ method: "sharp", weight: 1 }],
        selectedMethod: "sharp",
        strategy: "single_leaf_sharp_delegate"
      },
      notes
    };
  }

  if (family === "laminated_single_leaf") {
    notes.push("Bonded or contiguous layers stay on the Sharp panel curve until an explicit laminated-leaf solver lands.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [{ method: "sharp", weight: 1 }],
        selectedMethod: "sharp",
        strategy: "laminated_leaf_sharp_delegate"
      },
      notes
    };
  }

  if (family === "lined_massive_wall") {
    notes.push("Lined massive walls lean on the cavity-aware mass-law lane, but the screening seed trims it back to avoid over-crediting thin linings.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "mass_law", weight: 0.75 },
          { method: "screening_mass_law_curve_seed_v3", weight: 0.25 }
        ],
        selectedMethod: "mass_law",
        strategy: "lined_massive_blend"
      },
      notes
    };
  }

  if (family === "multileaf_multicavity") {
    notes.push("Multi-cavity walls are currently blended between the screening seed and Sharp to stay conservative while preserving some panel-frequency structure.");
    return {
      blend: {
        adjustmentsDb: 0,
        delegates: [
          { method: "screening_mass_law_curve_seed_v3", weight: 0.6 },
          { method: "sharp", weight: 0.4 }
        ],
        selectedMethod: "screening_mass_law_curve_seed_v3",
        strategy: "multileaf_screening_blend"
      },
      notes
    };
  }

  if (family === "double_stud_system") {
    notes.push(
      "Deep split-cavity independent framed walls currently reuse the calibrated stud-derived delegate blend, but the family stays separate so reporting and confidence no longer collapse them into generic single-frame stud partitions."
    );
    return {
      blend: {
        adjustmentsDb: 1,
        delegates: [
          { method: "mass_law", weight: 0.6 },
          { method: "sharp", weight: 0.4 }
        ],
        selectedMethod: "mass_law",
        strategy: "double_stud_surrogate_blend"
      },
      notes
    };
  }

  if (family === "stud_wall_system") {
    notes.push(
      framingEvidence.explicitHintOnly
        ? "Explicit framed-wall metadata matched a board-dominant framed morphology, so the stud-wall lane now calibrates a framed partition corridor instead of falling back to a plain cavity-wall guess."
        : "Stud-like support layers are still handled through a surrogate blend because an explicit stud-compliance model has not landed locally yet."
    );
    return {
      blend: {
        adjustmentsDb: 1,
        delegates: [
          { method: "mass_law", weight: 0.6 },
          { method: "sharp", weight: 0.4 }
        ],
        selectedMethod: "mass_law",
        strategy: "stud_surrogate_blend"
      },
      notes
    };
  }

  let adjustmentsDb = 0;
  if (!topology.hasPorousFill) {
    notes.push("Empty or mostly empty cavities stay on the cavity-aware mass-law delegate with a small lift; blending against Sharp was over-crediting the local empty-cavity cases.");
    return {
      blend: {
        adjustmentsDb: 1,
        delegates: [{ method: "mass_law", weight: 1 }],
        selectedMethod: "mass_law",
        strategy: "double_leaf_empty_cavity_delegate"
      },
      notes
    };
  }

  const fillFraction = cavity.coreThicknessMm > 0 ? cavity.porousThicknessMm / cavity.coreThicknessMm : 0;
  const residualGapMm = cavity.gapThicknessMm;

  adjustmentsDb = 1;
  if (
    fillFraction >= 0.65 &&
    fillFraction <= 0.85 &&
    residualGapMm >= 15 &&
    residualGapMm <= 40 &&
    (topology.visibleLeafMassRatio ?? 99) <= 1.6 &&
    Math.max(...topology.visibleLeafMassesKgM2, 0) <= 18
  ) {
    adjustmentsDb = 4;
    notes.push("Partly filled symmetric lightweight cavity triggered an extra resonance-region lift because the current local delegates under-read this topology.");
  } else {
    notes.push("Porous cavity fill stays on the mass-law delegate with a modest lift until a dedicated double-leaf cavity solver is added.");
  }

  return {
    blend: {
      adjustmentsDb,
      delegates: [{ method: "mass_law", weight: 1 }],
      selectedMethod: "mass_law",
      strategy: adjustmentsDb > 1 ? "double_leaf_porous_fill_corrected" : "double_leaf_porous_fill_delegate"
    },
    notes
  };
}

function classifyConfidence(score: number): DynamicAirborneConfidenceClass {
  if (score >= 0.78) {
    return "high";
  }

  if (score >= 0.58) {
    return "medium";
  }

  return "low";
}

function buildConfidenceScore(
  family: DynamicAirborneFamily,
  topology: ReturnType<typeof summarizeAirborneTopology>,
  solverSpreadRwDb: number,
  adjustmentDb: number,
  options?: {
    familyDecisionClass?: DynamicAirborneFamilyDecisionClass;
    heavyUnframedCavity?: boolean;
    hintOnlyFramingSuppressed?: boolean;
    multiplePlausibleFamilies?: boolean;
    orderSensitiveMultileaf?: boolean;
    selectionConflict?: boolean;
    trimmedOuterLayers?: boolean;
  }
): number {
  let score =
    family === "rigid_massive_wall"
      ? 0.84
      : family === "masonry_nonhomogeneous"
        ? 0.76
      : family === "single_leaf_panel"
        ? 0.72
        : family === "laminated_single_leaf"
          ? 0.68
          : family === "double_leaf"
            ? 0.69
            : family === "double_stud_system"
              ? 0.7
            : family === "lined_massive_wall"
              ? 0.78
              : family === "stud_wall_system"
                ? 0.52
                : 0.56;

  if (topology.surfaceMassKgM2 >= 120 && family !== "multileaf_multicavity") {
    score += 0.03;
  }

  if (topology.hasPorousFill && family === "double_leaf") {
    score += 0.02;
  }

  if (topology.hasStudLikeSupport) {
    score -= 0.08;
  }

  if (topology.visibleLeafMassRatio && topology.visibleLeafMassRatio > 8 && family !== "lined_massive_wall") {
    score -= 0.05;
  }

  if (solverSpreadRwDb >= 12) {
    score -= 0.12;
  } else if (solverSpreadRwDb >= 8) {
    score -= 0.07;
  } else if (solverSpreadRwDb <= 4) {
    score += 0.03;
  }

  if (adjustmentDb >= 3) {
    score -= 0.08;
  }

  if (options?.heavyUnframedCavity) {
    score -= 0.1;
  }

  if (options?.hintOnlyFramingSuppressed) {
    score -= 0.06;
  }

  if (options?.trimmedOuterLayers) {
    score -= 0.04;
  }

  if (options?.orderSensitiveMultileaf) {
    score -= 0.08;
  }

  if (options?.multiplePlausibleFamilies) {
    score -= 0.04;
  }

  if (options?.selectionConflict) {
    score -= 0.03;
  }

  if (options?.familyDecisionClass === "narrow") {
    score -= 0.03;
  } else if (options?.familyDecisionClass === "ambiguous") {
    score -= 0.05;
  }

  return ksRound1(clamp(score, 0.35, 0.92));
}

export function calculateDynamicAirborneResult(
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
): DynamicAirborneResult {
  const trimmedOuterSpan = trimOuterCompliantLayers(layers);
  const analysisLayers = trimmedOuterSpan.layers;
  const topology = summarizeAirborneTopology(analysisLayers);
  const framingHint = normalizeFramingHint(options.airborneContext);
  const framingEvidence = summarizeFramingEvidence(analysisLayers, topology, framingHint);
  const heavyUnframedCavityRisk = summarizeHeavyUnframedCavityRisk(analysisLayers, topology, framingHint);
  const multileafOrderSensitivity = summarizeMultileafOrderSensitivity(analysisLayers, topology);
  const family =
    options.forcedFamily
      ? { family: options.forcedFamily, notes: [] as string[] }
      : detectDynamicFamily(analysisLayers, framingHint);
  const familyDecisionBoundary = summarizeFamilyDecisionBoundary(
    analysisLayers,
    topology,
    framingHint,
    family.family
  );
  const blendSelection = chooseBlend(family.family, analysisLayers, framingHint);
  const effectiveScreeningEstimatedRwDb = trimmedOuterSpan.trimmed
    ? estimateRwDb(analysisLayers)
    : options.screeningEstimatedRwDb;
  const calculatorDelegates = [
    calculateAirborneCalculatorResult("ks_rw_calibrated", analysisLayers, options.frequenciesHz),
    calculateAirborneCalculatorResult("mass_law", analysisLayers, options.frequenciesHz),
    calculateAirborneCalculatorResult("sharp", analysisLayers, options.frequenciesHz),
    calculateAirborneCalculatorResult("kurtovic", analysisLayers, options.frequenciesHz)
  ];
  const resolvedFrequenciesHz = calculatorDelegates[0]?.curve.frequenciesHz ?? options.frequenciesHz ?? [];

  const delegates: DelegateCurve[] = [
    buildScreeningDelegate(topology.surfaceMassKgM2, effectiveScreeningEstimatedRwDb, resolvedFrequenciesHz),
    ...calculatorDelegates
  ].map((delegate) => ({
    curve: delegate.curve,
    label: getDelegateLabel(
      "method" in delegate ? delegate.method : (delegate.id as DynamicAirborneDelegateMethod)
    ),
    method: "method" in delegate ? delegate.method : (delegate.id as DynamicAirborneDelegateMethod),
    rw: delegate.rw
  }));

  let dynamicCurve = blendDelegateCurves(delegates, blendSelection.blend);
  let ratings = buildRatingsFromCurve(dynamicCurve.frequenciesHz, dynamicCurve.transmissionLossDb);
  const framedWallCalibration =
    family.family === "stud_wall_system" || family.family === "double_stud_system"
      ? estimateStudWallTargetRw(analysisLayers, topology, framingHint, family.family, ratings.iso717.Rw)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const aacMassiveCalibration =
    family.family === "rigid_massive_wall" || family.family === "masonry_nonhomogeneous"
      ? estimateAacMassiveTargetRw(
          analysisLayers,
          topology,
          effectiveScreeningEstimatedRwDb,
          ratings.iso717.Rw,
          family.family
        )
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const silicateMasonryCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateSilicateMasonryTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const porothermPlasteredCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimatePorothermPlasteredTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const heluzPlasteredClayCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateHeluzPlasteredClayTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const ytongMassiefG2300Calibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateYtongMassiefG2300TargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const ytongSeparatiePaneelCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateYtongSeparatiePaneelTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const ytongCellenbetonblokCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateYtongCellenbetonblokTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const celconFinishedAircreteCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateCelconFinishedAircreteTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const unfinishedAircreteCalibration =
    family.family === "masonry_nonhomogeneous"
      ? estimateUnfinishedAircreteTargetRw(analysisLayers, topology, ratings.iso717.Rw, family.family)
      : { notes: [] as string[], shiftDb: 0, strategySuffix: null as string | null, targetRw: null as number | null };
  const familyCalibration =
    framedWallCalibration.targetRw !== null
      ? framedWallCalibration
      : silicateMasonryCalibration.targetRw !== null
        ? silicateMasonryCalibration
        : porothermPlasteredCalibration.targetRw !== null
          ? porothermPlasteredCalibration
          : heluzPlasteredClayCalibration.targetRw !== null
            ? heluzPlasteredClayCalibration
            : ytongMassiefG2300Calibration.targetRw !== null
              ? ytongMassiefG2300Calibration
              : ytongSeparatiePaneelCalibration.targetRw !== null
                ? ytongSeparatiePaneelCalibration
                : ytongCellenbetonblokCalibration.targetRw !== null
                  ? ytongCellenbetonblokCalibration
                  : celconFinishedAircreteCalibration.targetRw !== null
                    ? celconFinishedAircreteCalibration
                    : unfinishedAircreteCalibration.targetRw !== null
                      ? unfinishedAircreteCalibration
                      : aacMassiveCalibration;

  if (familyCalibration.strategySuffix && Math.abs(familyCalibration.shiftDb) >= 0.2) {
    dynamicCurve = shiftCurve(dynamicCurve, familyCalibration.shiftDb);
    ratings = buildRatingsFromCurve(dynamicCurve.frequenciesHz, dynamicCurve.transmissionLossDb);
  }
  const masonryDavyCap =
    family.family === "masonry_nonhomogeneous"
      ? applyMasonryDavyConservativeCap(dynamicCurve, analysisLayers, topology, options, familyCalibration === aacMassiveCalibration)
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetRw: null as number | null
        };

  if (masonryDavyCap.applied) {
    dynamicCurve = masonryDavyCap.curve;
    ratings = masonryDavyCap.ratings;
  }
  const linedMassiveMonotonicFloor =
    family.family === "lined_massive_wall"
      ? applyLinedMassiveMasonryMonotonicFloor(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetMetric: null as number | null
        };

  if (linedMassiveMonotonicFloor.applied) {
    dynamicCurve = linedMassiveMonotonicFloor.curve;
    ratings = linedMassiveMonotonicFloor.ratings;
  }

  const singleLeafMasonryFloor =
    family.family === "masonry_nonhomogeneous"
      ? applySingleLeafMasonryMonotonicFloor(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetMetric: null as number | null
        };

  if (singleLeafMasonryFloor.applied) {
    dynamicCurve = singleLeafMasonryFloor.curve;
    ratings = singleLeafMasonryFloor.ratings;
  }

  const narrowHeavyGapCap =
    family.family === "double_leaf"
      ? applyNarrowHeavyDoubleLeafGapCap(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetMetric: null as number | null
        };

  if (narrowHeavyGapCap.applied) {
    dynamicCurve = narrowHeavyGapCap.curve;
    ratings = narrowHeavyGapCap.ratings;
  }

  const heavyUnframedCavityCap = applyHeavyUnframedCavityScreeningCap(
    dynamicCurve,
    analysisLayers,
    topology,
    family.family,
    framingHint,
    {
      ...options,
      screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
    }
  );

  if (heavyUnframedCavityCap.applied) {
    dynamicCurve = heavyUnframedCavityCap.curve;
    ratings = heavyUnframedCavityCap.ratings;
  }

  const securityBoardDoubleStudFieldTrim =
    family.family === "double_stud_system"
      ? applyMixedSecurityBoardDoubleStudFieldTrim(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          trimDb: 0
        };

  if (securityBoardDoubleStudFieldTrim.applied) {
    dynamicCurve = securityBoardDoubleStudFieldTrim.curve;
    ratings = securityBoardDoubleStudFieldTrim.ratings;
  }

  const highFillSingleBoardStudFieldLift =
    family.family === "stud_wall_system"
      ? applyHighFillSingleBoardStudFieldLift(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          liftDb: 0
        };

  if (highFillSingleBoardStudFieldLift.applied) {
    dynamicCurve = highFillSingleBoardStudFieldLift.curve;
    ratings = highFillSingleBoardStudFieldLift.ratings;
  }

  const mixedBoardEmptyCavityFieldMidbandLift =
    family.family === "stud_wall_system"
      ? applyMixedBoardEmptyCavityFieldMidbandLift(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          liftDb: 0
        };

  if (mixedBoardEmptyCavityFieldMidbandLift.applied) {
    dynamicCurve = mixedBoardEmptyCavityFieldMidbandLift.curve;
    ratings = mixedBoardEmptyCavityFieldMidbandLift.ratings;
  }

  const mixedPremiumSplitFieldLift =
    family.family === "stud_wall_system"
      ? applyMixedPremiumSplitFieldLift(dynamicCurve, analysisLayers, topology, options)
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          liftDb: 0
        };

  if (mixedPremiumSplitFieldLift.applied) {
    dynamicCurve = mixedPremiumSplitFieldLift.curve;
    ratings = mixedPremiumSplitFieldLift.ratings;
  }

  const mixedPlainModerateSingleBoardLabTemplate =
    family.family === "stud_wall_system"
      ? applyMixedPlainModerateSingleBoardLabTemplate(dynamicCurve, analysisLayers, topology, options)
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          templateContext: null as "field" | "lab" | null,
          templateId: null as "mixed_plain_acoustic_filled" | "mixed_plain_fire_filled" | "mixed_plain_firestop_filled" | null
        };

  if (mixedPlainModerateSingleBoardLabTemplate.applied) {
    dynamicCurve = mixedPlainModerateSingleBoardLabTemplate.curve;
    ratings = mixedPlainModerateSingleBoardLabTemplate.ratings;
  }

  const premiumSingleBoardFieldCorrection =
    family.family === "stud_wall_system"
      ? applyPremiumSingleBoardFieldCorrection(dynamicCurve, analysisLayers, topology, options)
      : {
          applied: false,
          curve: dynamicCurve,
          correctionMode: null as "low_mass_empty_enhanced" | "low_mass_filled_enhanced" | "standard" | null,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          shiftDb: 0
        };

  if (premiumSingleBoardFieldCorrection.applied) {
    dynamicCurve = premiumSingleBoardFieldCorrection.curve;
    ratings = premiumSingleBoardFieldCorrection.ratings;
  }

  const diamondHybridResilientFieldMidbandTrim =
    family.family === "stud_wall_system"
      ? applyDiamondHybridResilientFieldMidbandTrim(dynamicCurve, analysisLayers, topology, options)
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          trimDb: 0
        };

  if (diamondHybridResilientFieldMidbandTrim.applied) {
    dynamicCurve = diamondHybridResilientFieldMidbandTrim.curve;
    ratings = diamondHybridResilientFieldMidbandTrim.ratings;
  }

  const framedReinforcementMonotonicFloor =
    family.family === "stud_wall_system" || family.family === "double_stud_system"
      ? applyFramedReinforcementMonotonicFloor(dynamicCurve, analysisLayers, topology, family.family, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetMetric: null as number | null
        };

  if (framedReinforcementMonotonicFloor.applied) {
    dynamicCurve = framedReinforcementMonotonicFloor.curve;
    ratings = framedReinforcementMonotonicFloor.ratings;
  }

  const microGapFillEquivalenceGuard =
    family.family === "stud_wall_system"
      ? applyMicroGapFillEquivalenceGuard(dynamicCurve, analysisLayers, topology, {
          ...options,
          screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
        })
      : {
          applied: false,
          curve: dynamicCurve,
          notes: [] as string[],
          ratings,
          strategySuffix: null as string | null,
          targetMetric: null as number | null
        };

  if (microGapFillEquivalenceGuard.applied) {
    dynamicCurve = microGapFillEquivalenceGuard.curve;
    ratings = microGapFillEquivalenceGuard.ratings;
  }

  const familyBoundaryHold = applyAmbiguousFamilyBoundaryHold(
    dynamicCurve,
    analysisLayers,
    topology,
    family.family,
    familyDecisionBoundary,
    {
      ...options,
      screeningEstimatedRwDb: effectiveScreeningEstimatedRwDb
    }
  );

  if (familyBoundaryHold.applied) {
    dynamicCurve = familyBoundaryHold.curve;
    ratings = familyBoundaryHold.ratings;
  }

  const rwValues = delegates
    .map((delegate) => delegate.rw)
    .filter((value) => Number.isFinite(value) && value > 0);
  const solverSpreadRwDb =
    rwValues.length > 1 ? ksRound1(Math.max(...rwValues) - Math.min(...rwValues)) : 0;
  const confidenceScore = buildConfidenceScore(
    family.family,
    topology,
    solverSpreadRwDb,
    blendSelection.blend.adjustmentsDb,
    {
      familyDecisionClass: familyDecisionBoundary.decisionClass,
      heavyUnframedCavity: heavyUnframedCavityRisk.applies,
      hintOnlyFramingSuppressed: framingEvidence.explicitHintOnly && !framingEvidence.studEligible,
      multiplePlausibleFamilies: familyDecisionBoundary.multiplePlausibleFamilies,
      orderSensitiveMultileaf: multileafOrderSensitivity.hasOrderSensitiveMultileaf,
      selectionConflict: familyDecisionBoundary.selectedBelowRunnerUp,
      trimmedOuterLayers: trimmedOuterSpan.trimmed
    }
  );
  const confidenceClass = classifyConfidence(confidenceScore);
  const warnings: string[] = [];
  const selectedCandidate = delegates.find((delegate) => delegate.method === blendSelection.blend.selectedMethod);
  const strategy = [
    blendSelection.blend.strategy,
    familyCalibration.strategySuffix,
    masonryDavyCap.strategySuffix,
    linedMassiveMonotonicFloor.strategySuffix,
    singleLeafMasonryFloor.strategySuffix,
    narrowHeavyGapCap.strategySuffix,
    heavyUnframedCavityCap.strategySuffix,
    securityBoardDoubleStudFieldTrim.strategySuffix,
    highFillSingleBoardStudFieldLift.strategySuffix,
    mixedBoardEmptyCavityFieldMidbandLift.strategySuffix,
    mixedPremiumSplitFieldLift.strategySuffix,
    mixedPlainModerateSingleBoardLabTemplate.strategySuffix,
    premiumSingleBoardFieldCorrection.strategySuffix,
    framedReinforcementMonotonicFloor.strategySuffix,
    microGapFillEquivalenceGuard.strategySuffix,
    familyBoundaryHold.strategySuffix
  ]
    .filter((token): token is string => typeof token === "string" && token.length > 0)
    .join("+");

  if (family.family === "stud_wall_system" || family.family === "double_stud_system") {
    warnings.push(
      family.family === "double_stud_system"
        ? "Deep split-cavity framed-wall metadata is active on the dynamic airborne lane. The result is currently being held inside a calibrated double-stud corridor rather than the generic stud-wall surrogate."
        : framingEvidence.explicitHintOnly
          ? "Explicit framed-wall metadata is active on the dynamic airborne lane, but only because the visible morphology still looks like a board-dominant framed cavity."
          : "Stud-like support layers are being evaluated through a surrogate dynamic branch until explicit stud-compliance inputs and models are added locally."
    );
  }

  if (family.family === "multileaf_multicavity") {
    warnings.push(
      "Multi-leaf airborne selection is currently a conservative family blend, not a premium multi-cavity solver."
    );
  }

  if (blendSelection.blend.adjustmentsDb >= 3) {
    warnings.push(
      "A cavity-correction lift was applied because the current local delegate set underestimates this partially filled lightweight double-leaf topology."
    );
  }

  if (confidenceClass === "low") {
    warnings.push(
      "Dynamic airborne confidence is low on this topology; small layer or support changes may move the best-fit family and result."
    );
  }

  if (selectedCandidate && Math.abs(ratings.iso717.Rw - selectedCandidate.rw) >= 3) {
    warnings.push(
      "The dynamic family blend moved materially away from its anchor delegate, so treat the result as a family-level estimate rather than a single-formula output."
    );
  }

  if (linedMassiveMonotonicFloor.applied) {
    warnings.push(
      "A masonry-backed lined-massive monotonic floor was applied because a thicker heavy base unexpectedly scored below thinner sibling variants."
    );
  }

  if (masonryDavyCap.applied) {
    warnings.push(
      "A Davy/Cremer-style masonry cap was applied because the generic single-leaf AAC lane was still over-crediting the coincidence region."
    );
  }

  if (singleLeafMasonryFloor.applied) {
    warnings.push(
      "A single-leaf masonry thickness floor was applied because a thicker non-homogeneous masonry variant unexpectedly scored below thinner sibling variants."
    );
  }

  if (narrowHeavyGapCap.applied) {
    warnings.push(
      "A very narrow air gap between heavy composite leaves was capped against the contact-equivalent wall because the decoupled double-leaf branch was overpredicting this low-clearance cavity."
    );
  }

  if (framingEvidence.explicitHintOnly && !framingEvidence.studEligible) {
    warnings.push(
      "Explicit framed-wall metadata was not allowed to force the stud-wall lane because the visible leaves do not look like a board-dominant framed partition."
    );
  }

  if (heavyUnframedCavityCap.applied) {
    warnings.push(
      "A heavy unframed cavity cap was applied because the selected cavity-wall family was outrunning a conservative mass-based corridor on a heavy composite topology."
    );
  }

  if (multileafOrderSensitivity.boardInsertedTripleLeaf) {
    warnings.push(
      "A lightweight internal leaf sits between two compliant cavities, creating a triple-leaf partition. Small reorder changes can legitimately move the result materially, so this assembly should stay order-sensitive."
    );
  } else if (multileafOrderSensitivity.hasOrderSensitiveMultileaf) {
    warnings.push(
      "More than two visible leaves and more than one cavity were detected. This multi-leaf partition is intentionally order-sensitive, so small layer moves can legitimately change the result."
    );
  }

  if (
    familyDecisionBoundary.decisionClass !== "clear" &&
    familyDecisionBoundary.runnerUpFamily
  ) {
    warnings.push(
      familyDecisionBoundary.decisionClass === "ambiguous"
        ? `The current family read sits near the boundary between ${FAMILY_LABELS[family.family]} and ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]}. Small thickness or support changes can switch the lane even when the assembly still looks broadly similar.`
        : `The current family read is still somewhat close to ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]}, so nearby thickness or support changes can still move the lane selection.`
    );
  }

  if (
    familyDecisionBoundary.multiplePlausibleFamilies &&
    familyDecisionBoundary.runnerUpFamily &&
    familyDecisionBoundary.secondaryRunnerUpFamily
  ) {
    warnings.push(
      `More than one nearby family remains plausible on this two-leaf boundary: after ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]}, the ${FAMILY_LABELS[familyDecisionBoundary.secondaryRunnerUpFamily]} corridor is also still close enough that small support or lining changes can reshuffle the lane selection.`
    );
  }

  if (
    familyDecisionBoundary.selectedBelowRunnerUp &&
    familyDecisionBoundary.runnerUpFamily
  ) {
    warnings.push(
      `The hard family detector stayed on ${FAMILY_LABELS[family.family]}, but the nearby boundary scoring currently leans slightly toward ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]}. Treat this as a mixed-boundary estimate rather than a settled lane.`
    );
  }

  if (securityBoardDoubleStudFieldTrim.applied) {
    warnings.push(
      "A mixed security-board double-stud field trim was applied because the current split-cavity framed-wall surrogate was still slightly optimistic on the field side."
    );
  }

  if (highFillSingleBoardStudFieldLift.applied) {
    warnings.push(
      "A high-fill single-board stud field lift was applied because the current independent framed-wall surrogate was still slightly pessimistic on the field side."
    );
  }

  if (mixedBoardEmptyCavityFieldMidbandLift.applied) {
    warnings.push(
      "A mixed-board empty-cavity field midband lift was applied because asymmetric five-board gypsum framed walls were still slightly under-scoring R'w and DnT,w on the field side."
    );
  }

  if (mixedPremiumSplitFieldLift.applied) {
    warnings.push(
      "A mixed premium split-cavity field lift was applied because asymmetrical enhanced-board framed walls were still under-scoring R'w and DnT,w on the field side."
    );
  }

  if (mixedPlainModerateSingleBoardLabTemplate.applied) {
    warnings.push(
      mixedPlainModerateSingleBoardLabTemplate.templateContext === "field"
        ? mixedPlainModerateSingleBoardLabTemplate.templateId === "mixed_plain_acoustic_filled"
          ? "A mixed plain-gypsum + acoustic-gypsum filled single-board field template was applied because the moderate hybrid field lane was materially over-scoring this wall."
          : mixedPlainModerateSingleBoardLabTemplate.templateId === "mixed_plain_firestop_filled"
            ? "A mixed plain-gypsum + firestop filled single-board field template was applied because the moderate fire-rated field lane was materially over-scoring this wall."
            : "A mixed plain-gypsum + fire-board filled single-board field template was applied because the moderate fire-rated field lane was materially over-scoring this wall."
        : mixedPlainModerateSingleBoardLabTemplate.templateId === "mixed_plain_acoustic_filled"
          ? "A mixed plain-gypsum + acoustic-gypsum filled single-board lab target was applied because the previous moderate hybrid lane was materially under-scoring this wall."
          : mixedPlainModerateSingleBoardLabTemplate.templateId === "mixed_plain_firestop_filled"
            ? "A mixed plain-gypsum + firestop filled single-board lab target was applied because the previous moderate fire-rated lane was materially under-scoring this wall."
            : "A mixed plain-gypsum + fire-board filled single-board lab target was applied because the previous moderate fire-rated lane was materially under-scoring this wall."
    );
  }

  if (premiumSingleBoardFieldCorrection.applied) {
    warnings.push(
      premiumSingleBoardFieldCorrection.correctionMode === "plain_gypsum_filled"
        ? (premiumSingleBoardFieldCorrection.shiftDb > 0
            ? "A resilient plain gypsum filled single-board field lift was applied because light gypsum + mineral-wool framed walls were still under-scoring on the field side."
            : "A plain gypsum filled single-board field trim was applied because light gypsum + mineral-wool framed walls were still over-scoring on the steel-stud field side.")
        : premiumSingleBoardFieldCorrection.correctionMode === "mixed_plain_diamond_filled"
          ? "A mixed plain-gypsum + diamond filled single-board field template was applied because the previous shared premium field lane was materially misreading the steel versus resilient corridor."
        : premiumSingleBoardFieldCorrection.correctionMode === "mixed_plain_silent_filled"
          ? "A mixed plain-gypsum + silentboard filled single-board field template was applied because the previous shared premium field lane was materially misreading the steel versus resilient corridor."
        : premiumSingleBoardFieldCorrection.correctionMode === "silentboard_heavy_filled"
          ? (premiumSingleBoardFieldCorrection.shiftDb > 0
              ? "A resilient silentboard-heavy filled premium field lift was applied because heavy silentboard framed cavities were still under-scoring on the field side."
              : "A silentboard-heavy filled premium field trim was applied because mixed silentboard framed cavities were still over-scoring on the steel-stud field side.")
        : premiumSingleBoardFieldCorrection.correctionMode === "low_mass_empty_enhanced"
        ? (premiumSingleBoardFieldCorrection.shiftDb > 0
            ? "A resilient low-mass premium single-board field lift was applied because light fire/diamond empty cavities were still under-scoring on the field side."
            : "A low-mass premium single-board field trim was applied because light fire/diamond empty cavities were still over-scoring on the steel-stud field side.")
        : premiumSingleBoardFieldCorrection.correctionMode === "low_mass_filled_enhanced"
          ? (premiumSingleBoardFieldCorrection.shiftDb > 0
              ? "A resilient low-mass filled premium single-board field lift was applied because shallow enhanced mineral-filled cavities were still under-scoring on the field side."
              : "A low-mass filled premium single-board field trim was applied because shallow enhanced mineral-filled cavities were still over-scoring on the steel-stud field side.")
          : (premiumSingleBoardFieldCorrection.shiftDb > 0
              ? "A resilient premium single-board field lift was applied because heavy 1x1 and 1x2 enhanced-board cavities were still under-scoring on the field side."
              : "A premium single-board field trim was applied because heavy enhanced-board cavities were still over-scoring on the steel-stud field side.")
    );
  }

  if (framedReinforcementMonotonicFloor.applied) {
    warnings.push(
      "A framed reinforcement monotonic floor was applied because one-face board reinforcement unexpectedly scored below its lighter sibling variant."
    );
  }

  if (microGapFillEquivalenceGuard.applied) {
    warnings.push(
      "A very small explicit air gap inside a mostly filled framed cavity was kept within the fill-only equivalent corridor to avoid topology-sensitive drift."
    );
  }

  if (familyBoundaryHold.applied) {
    warnings.push(
      `A conservative family-boundary hold was applied because the current ${FAMILY_LABELS[family.family]} result was still outrunning the nearby ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily ?? family.family]} corridor on a ${familyDecisionBoundary.decisionClass} two-leaf boundary.`
    );
  }

  if (trimmedOuterSpan.trimmed) {
    warnings.push(
      "Outer porous/gap/support layers outside the outermost solid leaves were excluded from the dynamic airborne span."
    );
  }

  const trace: DynamicAirborneTrace = {
    adjustmentDb: blendSelection.blend.adjustmentsDb,
    candidateMethods: delegates.map((delegate) => ({
      label: delegate.label,
      method: delegate.method,
      rwDb: delegate.rw,
      selected: delegate.method === blendSelection.blend.selectedMethod
    })),
    cavityCount: topology.cavityCount,
    confidenceClass,
    confidenceScore,
    detectedFamily: family.family,
    detectedFamilyLabel: FAMILY_LABELS[family.family],
    familyBoundaryHoldAllowedLeadDb: familyBoundaryHold.allowedLeadDb ?? undefined,
    familyBoundaryHoldApplied: familyBoundaryHold.applied || undefined,
    familyBoundaryHoldBoundaryCeilingDb: familyBoundaryHold.boundaryCeilingDb ?? undefined,
    familyDecisionClass:
      familyDecisionBoundary.decisionClass === "clear" ? undefined : familyDecisionBoundary.decisionClass,
    familyDecisionMargin:
      familyDecisionBoundary.decisionClass === "clear"
        ? undefined
        : familyDecisionBoundary.margin ?? undefined,
    familyDecisionMultiplePlausibleFamilies:
      familyDecisionBoundary.multiplePlausibleFamilies || undefined,
    familyDecisionSelectedBelowRunnerUp:
      familyDecisionBoundary.selectedBelowRunnerUp || undefined,
    familyBoundaryHoldCurrentMetricDb: familyBoundaryHold.currentMetricDb ?? undefined,
    familyBoundaryHoldRunnerUpMetricDb: familyBoundaryHold.runnerUpMetric ?? undefined,
    familyBoundaryHoldTargetMetricDb: familyBoundaryHold.targetMetric ?? undefined,
    hasPorousFill: topology.hasPorousFill,
    hasStudLikeSupport: topology.hasStudLikeSupport,
    notes: [
      ...(trimmedOuterSpan.trimmed
        ? [
            `Outer compliant layers outside the outermost solid leaves were removed from the dynamic span (${trimmedOuterSpan.trimmedLeadingCount} leading, ${trimmedOuterSpan.trimmedTrailingCount} trailing).`
          ]
        : []),
      ...family.notes,
      ...(familyDecisionBoundary.decisionClass !== "clear" && familyDecisionBoundary.runnerUpFamily
        ? [
            familyDecisionBoundary.decisionClass === "ambiguous"
              ? `The current family boundary is ambiguous: ${FAMILY_LABELS[family.family]} is only ${familyDecisionBoundary.margin?.toFixed(1) ?? "0.0"} score points ahead of ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]}.`
              : `The current family boundary is narrow: ${FAMILY_LABELS[family.family]} stays ahead of ${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]} by ${familyDecisionBoundary.margin?.toFixed(1) ?? "0.0"} score points.`
          ]
        : []),
      ...(familyDecisionBoundary.multiplePlausibleFamilies && familyDecisionBoundary.secondaryRunnerUpFamily
        ? [
            `A second nearby family also remains plausible on this boundary: ${FAMILY_LABELS[familyDecisionBoundary.secondaryRunnerUpFamily]} trails ${FAMILY_LABELS[family.family]} by ${ksRound1(Math.max((familyDecisionBoundary.selectedScore ?? 0) - (familyDecisionBoundary.secondaryRunnerUpScore ?? 0), 0)).toFixed(1)} score points.`
          ]
        : []),
      ...(familyDecisionBoundary.selectedBelowRunnerUp && familyDecisionBoundary.runnerUpFamily
        ? [
            `${FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily]} is currently scoring slightly above ${FAMILY_LABELS[family.family]} on the boundary surface, so the chosen family should be read as a protected corridor hold rather than a clean selector win.`
          ]
        : []),
      ...(multileafOrderSensitivity.boardInsertedTripleLeaf
        ? [
            `A lightweight internal leaf is sitting between two compliant cavities (${multileafOrderSensitivity.innerLeafCount} inner leaf${multileafOrderSensitivity.innerLeafCount === 1 ? "" : "ves"}), so the topology is a triple-leaf partition rather than a stable two-leaf cavity wall.`
          ]
        : multileafOrderSensitivity.hasOrderSensitiveMultileaf
          ? [
              `The detected multi-leaf topology has ${topology.visibleLeafCount} visible leaves and ${topology.cavityCount} cavities, so the assembly remains intentionally order-sensitive.`
            ]
          : []),
      ...blendSelection.notes,
      ...framedWallCalibration.notes,
      ...aacMassiveCalibration.notes,
      ...silicateMasonryCalibration.notes,
      ...porothermPlasteredCalibration.notes,
      ...heluzPlasteredClayCalibration.notes,
      ...ytongMassiefG2300Calibration.notes,
      ...celconFinishedAircreteCalibration.notes,
      ...unfinishedAircreteCalibration.notes,
      ...masonryDavyCap.notes,
      ...linedMassiveMonotonicFloor.notes,
      ...singleLeafMasonryFloor.notes,
      ...narrowHeavyGapCap.notes,
      ...heavyUnframedCavityCap.notes,
      ...securityBoardDoubleStudFieldTrim.notes,
      ...highFillSingleBoardStudFieldLift.notes,
      ...mixedBoardEmptyCavityFieldMidbandLift.notes,
      ...mixedPremiumSplitFieldLift.notes,
      ...mixedPlainModerateSingleBoardLabTemplate.notes,
      ...premiumSingleBoardFieldCorrection.notes,
      ...framedReinforcementMonotonicFloor.notes,
      ...microGapFillEquivalenceGuard.notes,
      ...familyBoundaryHold.notes
    ],
    originalSolidLayerCount: topology.originalSolidLayerCount,
    porousLayerCount: topology.porousLayerCount,
    runnerUpFamily:
      familyDecisionBoundary.decisionClass === "clear"
        ? undefined
        : familyDecisionBoundary.runnerUpFamily ?? undefined,
    runnerUpFamilyLabel:
      familyDecisionBoundary.decisionClass === "clear" || !familyDecisionBoundary.runnerUpFamily
        ? undefined
        : FAMILY_LABELS[familyDecisionBoundary.runnerUpFamily],
    runnerUpFamilyScore:
      familyDecisionBoundary.decisionClass === "clear"
        ? undefined
        : familyDecisionBoundary.runnerUpScore ?? undefined,
    secondaryRunnerUpFamily:
      !familyDecisionBoundary.multiplePlausibleFamilies
        ? undefined
        : familyDecisionBoundary.secondaryRunnerUpFamily ?? undefined,
    secondaryRunnerUpFamilyLabel:
      !familyDecisionBoundary.multiplePlausibleFamilies || !familyDecisionBoundary.secondaryRunnerUpFamily
        ? undefined
        : FAMILY_LABELS[familyDecisionBoundary.secondaryRunnerUpFamily],
    secondaryRunnerUpFamilyScore:
      !familyDecisionBoundary.multiplePlausibleFamilies
        ? undefined
        : familyDecisionBoundary.secondaryRunnerUpScore ?? undefined,
    selectedLabel: getDelegateLabel(blendSelection.blend.selectedMethod),
    selectedFamilyScore: familyDecisionBoundary.selectedScore ?? undefined,
    selectedMethod: blendSelection.blend.selectedMethod,
    solverSpreadRwDb,
    strategy,
    supportLayerCount: topology.supportLayerCount,
    surfaceMassKgM2: topology.surfaceMassKgM2,
    totalGapThicknessMm: topology.totalGapThicknessMm,
    trimmedOuterLeadingCount: trimmedOuterSpan.trimmed ? trimmedOuterSpan.trimmedLeadingCount : undefined,
    trimmedOuterLayersApplied: trimmedOuterSpan.trimmed || undefined,
    trimmedOuterTrailingCount: trimmedOuterSpan.trimmed ? trimmedOuterSpan.trimmedTrailingCount : undefined,
    visibleLeafCount: topology.visibleLeafCount,
    visibleLeafMassRatio: topology.visibleLeafMassRatio
  };

  return {
    curve: dynamicCurve,
    id: "dynamic",
    label: "Dynamic Topology",
    ratings,
    rw: ratings.iso717.Rw,
    trace,
    warnings
  };
}
