import type {
  AssemblyRatings,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import {
  buildCalibratedMassLawCurve,
  buildRatingsFromCurve
} from "./curve-rating";
import {
  anchorCurveToMetric,
  anchorCurveToComputedMetric,
  computeContextMetric,
  computeMicroGapEquivalenceMetric,
  octaveBandWindowWeight,
  shiftCurve,
  type DynamicAirborneComposer,
  type DynamicAirborneOptions
} from "./dynamic-airborne-helpers";
import {
  buildNarrowGapContactEquivalentLayers,
  buildMicroGapFillOnlyEquivalentLayers,
  buildReducedThicknessVariant,
  describePrimaryCavity,
  isMicroGapHighFillEquivalentCavity
} from "./dynamic-airborne-cavity-topology";
import {
  isAacLikeLayer,
  isCelconFinishedAircreteBuildUp,
  isHeluzClayLayer,
  isMasonryCoreLayer,
  isMasonryLikeLayer,
  isYtongCellenbetonblokBuildUp,
  isYtongSeparatiePaneelBuildUp,
  type DynamicFramingHint
} from "./dynamic-airborne-family-detection";
import {
  buildInterpolatedTemplateCurve,
  getMixedPlainModerateFamilyAndTemplateId,
  getMixedPlainModerateTemplateProfile,
  getMixedPlainPremiumFamilyAndTemplateId,
  interpolateTemplateDbByFill,
  MIXED_PLAIN_MODERATE_LAB_TARGET_RW,
  type MixedPlainModerateTemplateId
} from "./dynamic-airborne-mixed-plain-templates";
import {
  isPlainGypsumFilledSingleBoardCandidate,
  summarizeFramedBoardSystem,
  summarizeHeavyUnframedCavityRisk,
  summarizePremiumSingleBoardFramedCandidate
} from "./dynamic-airborne-framed-wall";
import { summarizeAirborneTopology } from "./airborne-topology";
import { detectFireRatedFilledSingleBoardFamily } from "./fire-rated-filled-single-board-corridor";
import { detectSecurityFilledSingleBoardFamily } from "./security-filled-single-board-corridor";
import { detectMixedEnhancedFilledSingleBoardFamily } from "./mixed-enhanced-filled-single-board-corridor";
import { detectSymmetricEnhancedFilledSingleBoardFamily } from "./symmetric-enhanced-filled-single-board-corridor";
import { MIXED_PLAIN_MODERATE_FIELD_TEMPLATES } from "./mixed-plain-moderate-field-templates";
import { MIXED_PLAIN_PREMIUM_FIELD_TEMPLATES } from "./mixed-plain-premium-field-templates";
import { clamp, ksRound1 } from "./math";
import { estimateRwDb } from "./estimate-rw";

export function applySingleLeafMasonryMonotonicFloor(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions,
  composer: DynamicAirborneComposer
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
      const variantResult = composer(variantLayers, {
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

export function applyNarrowHeavyDoubleLeafGapCap(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions,
  composer: DynamicAirborneComposer
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

  const equivalentResult = composer(equivalentLayers, {
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

export function applyHeavyUnframedCavityScreeningCap(
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

export function applyMixedSecurityBoardDoubleStudFieldTrim(
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

export function applyHighFillSingleBoardStudFieldLift(
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

export function applyMixedBoardEmptyCavityFieldMidbandLift(
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

export function applyMixedPremiumSplitFieldLift(
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

export function applyDiamondHybridResilientFieldMidbandTrim(
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

export function applyMixedPlainModerateSingleBoardLabTemplate(
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

export function applyPremiumSingleBoardFieldCorrection(
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

export function applyMicroGapFillEquivalenceGuard(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions,
  composer: DynamicAirborneComposer
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

  const equivalentResult = composer(equivalentLayers, {
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
