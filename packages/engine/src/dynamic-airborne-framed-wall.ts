// Framed wall summaries + types carved out of `dynamic-airborne.ts`
// during `dynamic_airborne_split_refactor_v1` commit 14. This module
// owns the board system + framing evidence + double-stud signature
// + heavy-unframed-cavity risk + multileaf-order-sensitivity +
// premium single-board candidate + family-decision-boundary
// summarizers that feed the framed wall calibration logic.
//
// The estimator that consumes these (`estimateStudWallTargetRw`)
// moves in a later commit — this one lifts only the summaries and
// their types so the call surface area stays tight.
//
// Split rationale:
// - The summarize* functions reference each other heavily, so
//   carving them together keeps the call graph local to the module.
// - Every external dependency already lives in a carved module
//   (family-detection predicates, cavity-topology helpers, shared
//   types in helpers.ts). No new coupling introduced.

import type {
  DynamicAirborneFamily,
  DynamicAirborneFamilyDecisionClass,
  ResolvedLayer
} from "@dynecho/shared";

import {
  classifyLayerRole,
  detectLeafCoreLayout,
  materialText,
  summarizeAirborneTopology
} from "./airborne-topology";
import {
  describePrimaryCavity,
  summarizeSingleLeafMasonryProfile
} from "./dynamic-airborne-cavity-topology";
import {
  hasExplicitFramingHint,
  isBoardLikeLayer,
  isEnhancedBoardLayer,
  type DynamicFramingHint
} from "./dynamic-airborne-family-detection";
import { normalizeBoundarySignal } from "./dynamic-airborne-helpers";
import { clamp, ksRound1 } from "./math";

export type BoardTier = "single_board" | "double_board" | "triple_board" | "mixed_board";

export type FramedBoardSystemSummary = {
  acousticBoardFraction: number;
  averageBoardsPerLeaf: number;
  boardLayerCount: number;
  boardTier: BoardTier;
  leftLeafBoardCount: number;
  primaryGapLayerCount: number;
  rightLeafBoardCount: number;
  securityBoardCount: number;
};

export type DoubleStudSignature = {
  averageBoardsPerLeaf: number;
  deepStudCavity: boolean;
  fillFraction: number;
  independentTrack: boolean;
  likelyDoubleStud: boolean;
  splitGapSignature: boolean;
};

export type FramingEvidenceSummary = {
  boardLayerCount: number;
  boardMassFraction: number;
  boardDominantFramedMorphology: boolean;
  explicitHint: boolean;
  explicitHintOnly: boolean;
  maxLeafMassKgM2: number;
  minLeafMassKgM2: number;
  studEligible: boolean;
  supportEvidence: boolean;
};

export type HeavyUnframedCavityRiskSummary = {
  allowedLiftDb: number;
  applies: boolean;
  boardMassFraction: number;
  maxLeafMassKgM2: number;
  minLeafMassKgM2: number;
};

export type MultileafOrderSensitivitySummary = {
  boardInsertedTripleLeaf: boolean;
  hasOrderSensitiveMultileaf: boolean;
  innerLeafCount: number;
  lightInnerLeaf: boolean;
};

export type FamilyDecisionBoundarySummary = {
  decisionClass: DynamicAirborneFamilyDecisionClass;
  margin: number | null;
  multiplePlausibleFamilies: boolean;
  selectedBelowRunnerUp: boolean;
  runnerUpFamily: DynamicAirborneFamily | null;
  runnerUpScore: number | null;
  secondaryRunnerUpFamily: DynamicAirborneFamily | null;
  secondaryRunnerUpScore: number | null;
  selectedScore: number | null;
};

export function summarizeFramedBoardSystem(layers: readonly ResolvedLayer[]): FramedBoardSystemSummary {
  let leftLeafBoardCount = 0;
  let rightLeafBoardCount = 0;
  let cavityStarted = false;
  let boardLayerCount = 0;
  let enhancedBoardCount = 0;
  let primaryGapLayerCount = 0;
  let securityBoardCount = 0;

  for (const layer of layers) {
    const role = classifyLayerRole(layer);

    if ((role.isGap || role.isPorous) && (leftLeafBoardCount > 0 || cavityStarted)) {
      cavityStarted = true;
      if (role.isGap) {
        primaryGapLayerCount += 1;
      }
      continue;
    }

    if (!role.isSolidLeaf || !isBoardLikeLayer(layer)) {
      continue;
    }

    if (cavityStarted) {
      rightLeafBoardCount += 1;
    } else {
      leftLeafBoardCount += 1;
    }

    boardLayerCount += 1;
    if (layer.material.id === "security_board" || /security_board|\bakv\b|security board/i.test(materialText(layer))) {
      securityBoardCount += 1;
    }
    if (isEnhancedBoardLayer(layer)) {
      enhancedBoardCount += 1;
    }
  }

  const averageBoardsPerLeaf = (leftLeafBoardCount + rightLeafBoardCount) / 2;
  const boardTier =
    leftLeafBoardCount === rightLeafBoardCount
      ? leftLeafBoardCount <= 1
        ? "single_board"
        : leftLeafBoardCount === 2
          ? "double_board"
          : "triple_board"
      : "mixed_board";

  return {
    acousticBoardFraction: boardLayerCount > 0 ? enhancedBoardCount / boardLayerCount : 0,
    averageBoardsPerLeaf: ksRound1(averageBoardsPerLeaf),
    boardLayerCount,
    boardTier,
    leftLeafBoardCount,
    primaryGapLayerCount,
    rightLeafBoardCount,
    securityBoardCount
  };
}

export function summarizeFramingEvidence(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  framingHint: DynamicFramingHint
): FramingEvidenceSummary {
  const explicitHint = hasExplicitFramingHint(framingHint);
  const supportEvidence = topology.hasStudLikeSupport;
  const boardSystem = summarizeFramedBoardSystem(layers);
  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  const totalSolidMassKgM2 = solidLayers.reduce((sum, layer) => sum + layer.surfaceMassKgM2, 0);
  const boardMassKgM2 = solidLayers.reduce(
    (sum, layer) => sum + (isBoardLikeLayer(layer) ? layer.surfaceMassKgM2 : 0),
    0
  );
  const boardMassFraction = totalSolidMassKgM2 > 0 ? ksRound1(boardMassKgM2 / totalSolidMassKgM2) : 0;
  const masonryProfile = summarizeSingleLeafMasonryProfile(layers);
  const leafMassesKgM2 = topology.visibleLeafMassesKgM2.filter((value) => value > 0);
  const maxLeafMassKgM2 = leafMassesKgM2.length ? Math.max(...leafMassesKgM2) : 0;
  const minLeafMassKgM2 = leafMassesKgM2.length ? Math.min(...leafMassesKgM2) : 0;
  const boardDominantFramedMorphology =
    topology.visibleLeafCount === 2 &&
    topology.cavityCount === 1 &&
    boardSystem.leftLeafBoardCount >= 1 &&
    boardSystem.rightLeafBoardCount >= 1 &&
    boardSystem.boardLayerCount >= 2 &&
    boardMassFraction >= 0.55 &&
    masonryProfile.masonryMassRatio < 0.35 &&
    maxLeafMassKgM2 <= 80 &&
    topology.surfaceMassKgM2 <= 110;

  return {
    boardLayerCount: boardSystem.boardLayerCount,
    boardMassFraction,
    boardDominantFramedMorphology,
    explicitHint,
    explicitHintOnly: explicitHint && !supportEvidence,
    maxLeafMassKgM2: ksRound1(maxLeafMassKgM2),
    minLeafMassKgM2: ksRound1(minLeafMassKgM2),
    studEligible: supportEvidence || (explicitHint && boardDominantFramedMorphology),
    supportEvidence
  };
}

export function summarizePremiumSingleBoardFramedCandidate(
  layers: readonly ResolvedLayer[],
  boardSystem: FramedBoardSystemSummary,
  cavity: ReturnType<typeof describePrimaryCavity>,
  topology: ReturnType<typeof summarizeAirborneTopology>
): {
  asymmetricFilledPremium: boolean;
  hasDiamondLikeBoard: boolean;
  hasFirestopLikeBoard: boolean;
  hasFireLikeBoard: boolean;
  hasSilentboardLikeBoard: boolean;
  lowMassFireRatedFilledPremium: boolean;
  lowMassEmptyEnhanced: boolean;
  lowMassFilledEnhanced: boolean;
  mixedSecurityEnhancedFilled: boolean;
  mixedPlainAcousticFilled: boolean;
  mixedPlainDiamondFilled: boolean;
  mixedPlainFireFilled: boolean;
  mixedPlainFirestopFilled: boolean;
  mixedPlainSilentFilled: boolean;
  mixedAcousticPremiumFilled: boolean;
  mixedAcousticSilentFilled: boolean;
  silentboardHeavyFilledPremium: boolean;
  qualifies: boolean;
  symmetricPremium: boolean;
} {
  const boardLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf && isBoardLikeLayer(layer));
  const hasDiamondLikeBoard = boardLayers.some(
    (layer) => layer.material.id === "diamond_board" || /\bdiamond\b|\bdiamant\b/i.test(layer.material.name)
  );
  const hasFireLikeBoard = boardLayers.some((layer) =>
    layer.material.id === "fire_board" ||
    layer.material.id === "firestop_board" ||
    /\bfire(?:stop)?\b/i.test(layer.material.name)
  );
  const hasFirestopLikeBoard = boardLayers.some((layer) =>
    layer.material.id === "firestop_board" || /\bfirestop\b/i.test(layer.material.name)
  );
  const hasSilentboardLikeBoard = boardLayers.some(
    (layer) => layer.material.id === "silentboard" || /silentboard|silent[_ ]board/i.test(layer.material.name)
  );
  const hasAcousticGypsumLikeBoard = boardLayers.some(
    (layer) =>
      layer.material.id === "acoustic_gypsum_board" ||
      /\bacoustic(?:[_ ]gypsum)?\b/i.test(layer.material.name)
  );
  const hasPlainGypsumBoard = boardLayers.some((layer) => layer.material.id === "gypsum_board");
  const symmetricPremium =
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 0.5;
  const asymmetricFilledPremium =
    cavity.porousThicknessMm > 0 &&
    boardSystem.leftLeafBoardCount >= 1 &&
    boardSystem.rightLeafBoardCount >= 1 &&
    Math.max(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount) <= 2 &&
    Math.min(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount) === 1 &&
    boardSystem.leftLeafBoardCount !== boardSystem.rightLeafBoardCount &&
    (hasDiamondLikeBoard || topology.surfaceMassKgM2 >= 45) &&
    boardSystem.acousticBoardFraction >= 0.66;
  const lowMassEmptyEnhanced =
    cavity.porousThicknessMm <= 0 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 0.5 &&
    topology.surfaceMassKgM2 >= 25 &&
    topology.surfaceMassKgM2 < 32;
  const lowMassFilledEnhanced =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 0.5 &&
    !hasPlainGypsumBoard &&
    topology.surfaceMassKgM2 >= 25 &&
    topology.surfaceMassKgM2 < 35;
  const lowMassFireRatedFilledPremium =
    lowMassFilledEnhanced &&
    hasFireLikeBoard;
  const mixedSecurityEnhancedFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 42 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.securityBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 1 &&
    !hasAcousticGypsumLikeBoard &&
    (hasDiamondLikeBoard || hasSilentboardLikeBoard) &&
    topology.surfaceMassKgM2 >= 29 &&
    topology.surfaceMassKgM2 <= 31.5;
  const mixedPlainDiamondFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.acousticBoardFraction >= 0.45 &&
    boardSystem.acousticBoardFraction <= 0.55 &&
    hasPlainGypsumBoard &&
    !hasAcousticGypsumLikeBoard &&
    hasDiamondLikeBoard &&
    !hasSilentboardLikeBoard &&
    topology.surfaceMassKgM2 >= 29 &&
    topology.surfaceMassKgM2 <= 32.5;
  const mixedPlainAcousticFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.acousticBoardFraction >= 0.45 &&
    boardSystem.acousticBoardFraction <= 0.55 &&
    hasPlainGypsumBoard &&
    hasAcousticGypsumLikeBoard &&
    !hasDiamondLikeBoard &&
    !hasSilentboardLikeBoard &&
    !hasFireLikeBoard &&
    topology.surfaceMassKgM2 >= 27 &&
    topology.surfaceMassKgM2 <= 29.2;
  const mixedPlainFireFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.acousticBoardFraction >= 0.45 &&
    boardSystem.acousticBoardFraction <= 0.55 &&
    hasPlainGypsumBoard &&
    hasFireLikeBoard &&
    !hasFirestopLikeBoard &&
    !hasAcousticGypsumLikeBoard &&
    !hasDiamondLikeBoard &&
    !hasSilentboardLikeBoard &&
    topology.surfaceMassKgM2 >= 25 &&
    topology.surfaceMassKgM2 <= 26.8;
  const mixedPlainFirestopFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.acousticBoardFraction >= 0.45 &&
    boardSystem.acousticBoardFraction <= 0.55 &&
    hasPlainGypsumBoard &&
    hasFirestopLikeBoard &&
    !hasAcousticGypsumLikeBoard &&
    !hasDiamondLikeBoard &&
    !hasSilentboardLikeBoard &&
    topology.surfaceMassKgM2 >= 25 &&
    topology.surfaceMassKgM2 <= 26.8;
  const mixedPlainSilentFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardLayers.length === 2 &&
    boardSystem.acousticBoardFraction >= 0.45 &&
    boardSystem.acousticBoardFraction <= 0.55 &&
    hasPlainGypsumBoard &&
    !hasAcousticGypsumLikeBoard &&
    hasSilentboardLikeBoard &&
    !hasDiamondLikeBoard &&
    topology.surfaceMassKgM2 >= 29 &&
    topology.surfaceMassKgM2 <= 32.5;
  const mixedAcousticPremiumFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 1 &&
    hasAcousticGypsumLikeBoard &&
    hasDiamondLikeBoard &&
    topology.surfaceMassKgM2 >= 35 &&
    topology.surfaceMassKgM2 < 38;
  const mixedAcousticSilentFilled =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 1 &&
    hasAcousticGypsumLikeBoard &&
    hasSilentboardLikeBoard &&
    topology.surfaceMassKgM2 >= 35 &&
    topology.surfaceMassKgM2 < 38;
  const silentboardHeavyFilledPremium =
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction >= 0.85 &&
    hasSilentboardLikeBoard &&
    !hasAcousticGypsumLikeBoard &&
    topology.surfaceMassKgM2 >= 38 &&
    topology.surfaceMassKgM2 <= 40.5;
  const highMassSymmetricPremium =
    symmetricPremium &&
    (cavity.porousThicknessMm <= 0 ? topology.surfaceMassKgM2 >= 32 : topology.surfaceMassKgM2 >= 38);

  return {
    asymmetricFilledPremium,
    hasDiamondLikeBoard,
    hasFirestopLikeBoard,
    hasFireLikeBoard,
    hasSilentboardLikeBoard,
    lowMassFireRatedFilledPremium,
    lowMassEmptyEnhanced,
    lowMassFilledEnhanced,
    mixedSecurityEnhancedFilled,
    mixedPlainAcousticFilled,
    mixedPlainDiamondFilled,
    mixedPlainFireFilled,
    mixedPlainFirestopFilled,
    mixedPlainSilentFilled,
    mixedAcousticPremiumFilled,
    mixedAcousticSilentFilled,
    silentboardHeavyFilledPremium,
    qualifies:
      topology.visibleLeafCount === 2 &&
      topology.cavityCount === 1 &&
      (boardSystem.securityBoardCount === 0 || mixedSecurityEnhancedFilled) &&
      boardSystem.primaryGapLayerCount < 2 &&
      (
        highMassSymmetricPremium ||
        asymmetricFilledPremium ||
        lowMassEmptyEnhanced ||
        lowMassFilledEnhanced ||
        mixedSecurityEnhancedFilled ||
        mixedPlainAcousticFilled ||
        mixedPlainDiamondFilled ||
        mixedPlainFireFilled ||
        mixedPlainFirestopFilled ||
        mixedPlainSilentFilled ||
        mixedAcousticPremiumFilled ||
        mixedAcousticSilentFilled ||
        silentboardHeavyFilledPremium
      ),
    symmetricPremium
  };
}

export function isPlainGypsumFilledSingleBoardCandidate(
  layers: readonly ResolvedLayer[],
  boardSystem: FramedBoardSystemSummary,
  cavity: ReturnType<typeof describePrimaryCavity>,
  topology: ReturnType<typeof summarizeAirborneTopology>
): boolean {
  const boardLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf && isBoardLikeLayer(layer));

  return (
    topology.visibleLeafCount === 2 &&
    topology.cavityCount === 1 &&
    cavity.porousThicknessMm > 0 &&
    cavity.coreThicknessMm >= 35 &&
    cavity.coreThicknessMm <= 60 &&
    boardSystem.leftLeafBoardCount === 1 &&
    boardSystem.rightLeafBoardCount === 1 &&
    boardSystem.acousticBoardFraction < 0.25 &&
    topology.surfaceMassKgM2 >= 26 &&
    topology.surfaceMassKgM2 <= 29 &&
    boardLayers.length === 2 &&
    boardLayers.every((layer) => layer.material.id === "gypsum_board")
  );
}

export function summarizeDoubleStudSignature(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  framingHint: DynamicFramingHint
): DoubleStudSignature {
  const cavity = describePrimaryCavity(layers);
  const boardSystem = summarizeFramedBoardSystem(layers);
  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);
  const fillFraction = cavity.coreThicknessMm > 0
    ? clamp(cavity.porousThicknessMm / cavity.coreThicknessMm, 0, 1)
    : 0;
  const splitGapSignature = boardSystem.primaryGapLayerCount >= 2 && cavity.porousThicknessMm > 0;
  const independentTrack = framingHint.sharedTrack === "independent";
  const deepStudCavity = cavity.coreThicknessMm >= 190;
  const likelyStud =
    topology.visibleLeafCount === 2 &&
    topology.cavityCount === 1 &&
    framingEvidence.studEligible;
  const singleBoardIndependentTwinFrame =
    boardSystem.averageBoardsPerLeaf >= 0.9 &&
    boardSystem.averageBoardsPerLeaf < 1.6 &&
    deepStudCavity &&
    splitGapSignature &&
    independentTrack &&
    fillFraction >= 0.35;
  const likelyDoubleStud =
    likelyStud &&
    deepStudCavity &&
    splitGapSignature &&
    independentTrack &&
    (boardSystem.averageBoardsPerLeaf >= 1.6 || singleBoardIndependentTwinFrame);

  return {
    averageBoardsPerLeaf: boardSystem.averageBoardsPerLeaf,
    deepStudCavity,
    fillFraction: ksRound1(fillFraction),
    independentTrack,
    likelyDoubleStud,
    splitGapSignature
  };
}

export function summarizeHeavyUnframedCavityRisk(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  framingHint: DynamicFramingHint
): HeavyUnframedCavityRiskSummary {
  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);
  const masonryProfile = summarizeSingleLeafMasonryProfile(layers);
  const leafMassesKgM2 = topology.visibleLeafMassesKgM2.filter((value) => value > 0);
  const maxLeafMassKgM2 = leafMassesKgM2.length ? Math.max(...leafMassesKgM2) : 0;
  const minLeafMassKgM2 = leafMassesKgM2.length ? Math.min(...leafMassesKgM2) : 0;
  const heavyLeafSignal =
    maxLeafMassKgM2 >= 70 ||
    (
      Number.isFinite(minLeafMassKgM2) &&
      minLeafMassKgM2 >= 35 &&
      topology.surfaceMassKgM2 >= 110
    );
  const compositeSignal =
    topology.originalSolidLayerCount >= 3 ||
    masonryProfile.masonryMassRatio >= 0.45;
  const applies =
    topology.visibleLeafCount >= 2 &&
    topology.cavityCount >= 1 &&
    !framingEvidence.studEligible &&
    framingEvidence.boardMassFraction < 0.45 &&
    heavyLeafSignal &&
    compositeSignal;

  let allowedLiftDb = 2.5;
  if (topology.hasPorousFill) {
    allowedLiftDb += (topology.visibleLeafMassRatio ?? 99) <= 1.8 ? 1.5 : 1.0;
  }
  if (topology.cavityCount >= 2) {
    allowedLiftDb += 0.5;
  }
  if ((topology.visibleLeafMassRatio ?? 99) <= 1.6 && minLeafMassKgM2 >= 60) {
    allowedLiftDb += 1.0;
  }

  return {
    allowedLiftDb: ksRound1(clamp(allowedLiftDb, 2.5, 5.5)),
    applies,
    boardMassFraction: framingEvidence.boardMassFraction,
    maxLeafMassKgM2: ksRound1(maxLeafMassKgM2),
    minLeafMassKgM2: ksRound1(minLeafMassKgM2)
  };
}

export function summarizeMultileafOrderSensitivity(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>
): MultileafOrderSensitivitySummary {
  const layout = detectLeafCoreLayout(layers);
  const innerLeafIndexes = layout.solidLeafIndexes.slice(1, -1);
  const innerLeaves = innerLeafIndexes
    .map((index) => layout.collapsedLayers[index])
    .filter((layer): layer is ResolvedLayer => Boolean(layer));
  const lightInnerLeaf = innerLeaves.some((layer) => layer.surfaceMassKgM2 <= 25);
  const boardInsertedTripleLeaf =
    topology.visibleLeafCount === 3 &&
    topology.cavityCount === 2 &&
    innerLeaves.some((layer) => isBoardLikeLayer(layer) || layer.surfaceMassKgM2 <= 25);

  return {
    boardInsertedTripleLeaf,
    hasOrderSensitiveMultileaf: topology.visibleLeafCount >= 3 && topology.cavityCount >= 2,
    innerLeafCount: innerLeaves.length,
    lightInnerLeaf
  };
}

export function summarizeFamilyDecisionBoundary(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  framingHint: DynamicFramingHint,
  selectedFamily: DynamicAirborneFamily
): FamilyDecisionBoundarySummary {
  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    (selectedFamily !== "double_leaf" &&
      selectedFamily !== "lined_massive_wall" &&
      selectedFamily !== "stud_wall_system" &&
      selectedFamily !== "double_stud_system")
  ) {
    return {
      decisionClass: "clear",
      margin: null,
      multiplePlausibleFamilies: false,
      selectedBelowRunnerUp: false,
      runnerUpFamily: null,
      runnerUpScore: null,
      secondaryRunnerUpFamily: null,
      secondaryRunnerUpScore: null,
      selectedScore: null
    };
  }

  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);
  const doubleStudSignature = summarizeDoubleStudSignature(layers, topology, framingHint);
  const masonryProfile = summarizeSingleLeafMasonryProfile(layers);
  const dominantLeafMassKgM2 = Math.max(...topology.visibleLeafMassesKgM2, 0);
  const lightestLeafMassKgM2 = Math.min(...topology.visibleLeafMassesKgM2.filter((value) => value > 0));
  const asymmetry = topology.visibleLeafMassRatio ?? 1;
  const heavyDominantSignal = normalizeBoundarySignal(dominantLeafMassKgM2, 70, 100);
  const lightLiningSignal = 1 - normalizeBoundarySignal(lightestLeafMassKgM2, 12, 25);
  const asymmetrySignal = normalizeBoundarySignal(asymmetry, 4, 8);
  const balancedMassSignal = 1 - normalizeBoundarySignal(dominantLeafMassKgM2, 70, 120);
  const balancedLeafSignal = normalizeBoundarySignal(lightestLeafMassKgM2, 10, 25);
  const symmetrySignal = 1 - normalizeBoundarySignal(asymmetry, 2.5, 8);
  const boardDominanceSignal = normalizeBoundarySignal(framingEvidence.boardMassFraction, 0.45, 0.75);
  const masonrySignal = normalizeBoundarySignal(masonryProfile.masonryMassRatio, 0.3, 0.7);

  const doubleLeafScore = clamp(
    0.22 +
      (topology.hasPorousFill ? 0.1 : 0.06) +
      0.18 * symmetrySignal +
      0.2 * balancedMassSignal +
      0.12 * balancedLeafSignal +
      (framingEvidence.studEligible ? -0.15 : 0.05) +
      (dominantLeafMassKgM2 >= 70 && lightestLeafMassKgM2 <= 20 ? -0.08 : 0),
    0,
    0.98
  );
  const linedMassiveScore = clamp(
    (dominantLeafMassKgM2 >= 70 ? 0.15 : 0) +
      0.38 * heavyDominantSignal +
      0.17 * lightLiningSignal +
      0.08 * asymmetrySignal +
      0.12 * masonrySignal +
      (framingEvidence.studEligible ? -0.15 : 0),
    0,
    0.98
  );
  const studScore = clamp(
    (framingEvidence.supportEvidence ? 0.6 : framingEvidence.studEligible ? 0.45 : 0) +
      0.18 * boardDominanceSignal +
      (framingEvidence.boardDominantFramedMorphology ? 0.12 : 0) +
      (doubleStudSignature.likelyDoubleStud ? -0.18 : 0) +
      (dominantLeafMassKgM2 >= 70 ? -0.12 : 0),
    0,
    0.98
  );
  const doubleStudScore = clamp(
    (doubleStudSignature.likelyDoubleStud ? 0.82 : 0) +
      (doubleStudSignature.independentTrack ? 0.08 : 0) +
      (doubleStudSignature.splitGapSignature ? 0.05 : 0),
    0,
    0.98
  );

  const scoredFamilyCandidates: Array<{ family: DynamicAirborneFamily; score: number }> = [
    { family: "double_leaf", score: doubleLeafScore },
    { family: "lined_massive_wall", score: linedMassiveScore },
    { family: "stud_wall_system", score: studScore },
    { family: "double_stud_system", score: doubleStudScore }
  ];

  const scoredFamilies = scoredFamilyCandidates
    .filter((entry) => entry.score >= 0.15 || entry.family === selectedFamily)
    .sort((left, right) => right.score - left.score);

  const selected = scoredFamilies.find((entry) => entry.family === selectedFamily) ?? null;
  const alternateFamilies = scoredFamilies.filter((entry) => entry.family !== selectedFamily);
  const runnerUp = alternateFamilies[0] ?? null;
  const secondaryRunnerUp = alternateFamilies[1] ?? null;
  const margin =
    selected && runnerUp ? ksRound1(Math.max(selected.score - runnerUp.score, 0)) : null;
  const selectedToSecondaryMargin =
    selected && secondaryRunnerUp ? ksRound1(Math.max(selected.score - secondaryRunnerUp.score, 0)) : null;
  const selectedBelowRunnerUp = Boolean(selected && runnerUp && runnerUp.score > selected.score + 1e-9);

  let decisionClass: DynamicAirborneFamilyDecisionClass = "clear";
  if (selected && runnerUp && runnerUp.score >= 0.3) {
    if (selected.score < runnerUp.score || (margin !== null && margin <= 0.1)) {
      decisionClass = "ambiguous";
    } else if (margin !== null && margin <= 0.2) {
      decisionClass = "narrow";
    }
  }

  const multiplePlausibleFamilies = Boolean(
    selected &&
      runnerUp &&
      secondaryRunnerUp &&
      runnerUp.score >= 0.3 &&
      secondaryRunnerUp.score >= 0.28 &&
      selectedToSecondaryMargin !== null &&
      selectedToSecondaryMargin <= 0.22
  );

  return {
    decisionClass,
    margin,
    multiplePlausibleFamilies,
    selectedBelowRunnerUp,
    runnerUpFamily: runnerUp?.family ?? null,
    runnerUpScore: runnerUp?.score ?? null,
    secondaryRunnerUpFamily: secondaryRunnerUp?.family ?? null,
    secondaryRunnerUpScore: secondaryRunnerUp?.score ?? null,
    selectedScore: selected?.score ?? null
  };
}

