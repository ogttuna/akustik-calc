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
  finitePanelRadiationEfficiency,
  getAirborneCalculatorLabel,
  type ComparableAirborneCalculatorId
} from "./airborne-calculator";
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

type DynamicAirborneResult = {
  curve: TransmissionLossCurve;
  id: "dynamic";
  label: string;
  ratings: AssemblyRatings;
  rw: number;
  trace: DynamicAirborneTrace;
  warnings: string[];
};

type DynamicAirborneOptions = {
  disableFramedReinforcementMonotonicFloor?: boolean;
  disableFamilyBoundaryHold?: boolean;
  airborneContext?: AirborneContext | null;
  disableMasonryDavyCap?: boolean;
  disableLinedMassiveMasonryFloor?: boolean;
  disableNarrowHeavyDoubleLeafGapGuard?: boolean;
  disableSingleLeafMasonryFloor?: boolean;
  forcedFamily?: DynamicAirborneFamily | null;
  framedReinforcementMonotonicGuardDepth?: number;
  frequenciesHz?: readonly number[];
  linedMassiveMasonryFloorGuardDepth?: number;
  narrowHeavyDoubleLeafGapGuardDepth?: number;
  singleLeafMasonryFloorGuardDepth?: number;
  screeningEstimatedRwDb: number;
};

type DelegateCurve = {
  curve: TransmissionLossCurve;
  label: string;
  method: DynamicAirborneDelegateMethod;
  rw: number;
};

type DelegateBlend = {
  adjustmentsDb: number;
  delegates: Array<{ method: DynamicAirborneDelegateMethod; weight: number }>;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
};

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

const MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ = [
  63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000
] as const;

const MIXED_PLAIN_MODERATE_LAB_TARGET_RW = {
  acoustic: {
    resilient: {
      35: 47,
      42: 47,
      50: 48,
      60: 50
    },
    steel: {
      35: 42,
      42: 45,
      50: 44,
      60: 45
    }
  },
  fire: {
    resilient: {
      35: 46,
      42: 46,
      50: 47,
      60: 49
    },
    steel: {
      35: 41,
      42: 43,
      50: 43,
      60: 44
    }
  },
  firestop: {
    resilient: {
      35: 46,
      42: 46,
      50: 47,
      60: 49
    },
    steel: {
      35: 41,
      42: 43,
      50: 43,
      60: 44
    }
  }
} as const;

const MIXED_PLAIN_PREMIUM_LAB_TARGET_RW = {
  diamond: {
    resilient: {
      35: 48,
      42: 48,
      50: 49,
      60: 50
    },
    steel: {
      35: 43,
      42: 45,
      50: 45,
      60: 46
    }
  },
  silent: {
    resilient: {
      35: 47,
      42: 48,
      50: 50,
      60: 50
    },
    steel: {
      35: 44,
      42: 44,
      50: 45,
      60: 47
    }
  }
} as const;

function getDelegateLabel(method: DynamicAirborneDelegateMethod): string {
  if (method === "screening_mass_law_curve_seed_v3") {
    return "Screening Seed";
  }

  return getAirborneCalculatorLabel(method as ComparableAirborneCalculatorId);
}

function buildScreeningDelegate(
  surfaceMassKgM2: number,
  screeningEstimatedRwDb: number,
  frequenciesHz: readonly number[]
): DelegateCurve {
  const curve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb, frequenciesHz);

  return {
    curve: {
      frequenciesHz: [...curve.frequenciesHz],
      transmissionLossDb: [...curve.transmissionLossDb]
    },
    label: getDelegateLabel("screening_mass_law_curve_seed_v3"),
    method: "screening_mass_law_curve_seed_v3",
    rw: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb).iso717.Rw
  };
}

function blendDelegateCurves(
  delegates: readonly DelegateCurve[],
  blend: DelegateBlend
): TransmissionLossCurve {
  const weights = new Map(blend.delegates.map((entry) => [entry.method, entry.weight]));
  const reference = delegates[0];
  const totalWeight = Math.max(
    blend.delegates.reduce((sum, entry) => sum + entry.weight, 0),
    1e-9
  );
  const transmissionLossDb = reference.curve.frequenciesHz.map((_, index) => {
    let blendedValue = 0;

    for (const delegate of delegates) {
      const weight = weights.get(delegate.method) ?? 0;
      blendedValue += delegate.curve.transmissionLossDb[index] * weight;
    }

    return clamp((blendedValue / totalWeight) + blend.adjustmentsDb, 0, 95);
  });

  return {
    frequenciesHz: [...reference.curve.frequenciesHz],
    transmissionLossDb
  };
}

type MixedPlainModerateTemplateProfile = "resilient" | "steel";
type MixedPlainModerateTemplateFill = 35 | 42 | 50 | 60;
type MixedPlainModerateTemplateId = "mixed_plain_acoustic_filled" | "mixed_plain_fire_filled" | "mixed_plain_firestop_filled";
type MixedPlainPremiumTemplateId = "mixed_plain_diamond_filled" | "mixed_plain_silent_filled";

function getMixedPlainModerateFamilyAndTemplateId(candidate: {
  mixedPlainAcousticFilled: boolean;
  mixedPlainFireFilled: boolean;
  mixedPlainFirestopFilled: boolean;
}): { family: MixedPlainModerateFieldTemplateFamily; templateId: MixedPlainModerateTemplateId } | null {
  if (candidate.mixedPlainAcousticFilled) {
    return {
      family: "acoustic",
      templateId: "mixed_plain_acoustic_filled"
    };
  }

  if (candidate.mixedPlainFirestopFilled) {
    return {
      family: "firestop",
      templateId: "mixed_plain_firestop_filled"
    };
  }

  if (candidate.mixedPlainFireFilled) {
    return {
      family: "fire",
      templateId: "mixed_plain_fire_filled"
    };
  }

  return null;
}

function getMixedPlainPremiumFamilyAndTemplateId(candidate: {
  mixedPlainDiamondFilled: boolean;
  mixedPlainSilentFilled: boolean;
}): { family: MixedPlainPremiumFieldTemplateFamily; templateId: MixedPlainPremiumTemplateId } | null {
  if (candidate.mixedPlainDiamondFilled) {
    return {
      family: "diamond",
      templateId: "mixed_plain_diamond_filled"
    };
  }

  if (candidate.mixedPlainSilentFilled) {
    return {
      family: "silent",
      templateId: "mixed_plain_silent_filled"
    };
  }

  return null;
}

function getMixedPlainModerateTemplateProfile(context?: AirborneContext | null): MixedPlainModerateTemplateProfile {
  if (context?.connectionType === "resilient_channel" || context?.studType === "resilient_stud") {
    return "resilient";
  }

  return "steel";
}

function interpolateTemplateDbByFill(
  templatesByFill: Record<MixedPlainModerateTemplateFill, readonly number[]>,
  fillThicknessMm: number
): number[] {
  const anchors = [35, 42, 50, 60] as const;
  const clampedFill = clamp(fillThicknessMm, anchors[0], anchors[anchors.length - 1]);

  if (clampedFill <= anchors[0]) {
    return [...templatesByFill[anchors[0]]];
  }

  if (clampedFill >= anchors[anchors.length - 1]) {
    return [...templatesByFill[anchors[anchors.length - 1]]];
  }

  for (let index = 0; index < anchors.length - 1; index += 1) {
    const leftFill = anchors[index];
    const rightFill = anchors[index + 1];

    if (clampedFill < leftFill || clampedFill > rightFill) {
      continue;
    }

    if (clampedFill === leftFill) {
      return [...templatesByFill[leftFill]];
    }

    if (clampedFill === rightFill) {
      return [...templatesByFill[rightFill]];
    }

    const position = (clampedFill - leftFill) / (rightFill - leftFill);
    return templatesByFill[leftFill].map((leftValue, valueIndex) =>
      clamp(leftValue + ((templatesByFill[rightFill][valueIndex] - leftValue) * position), 0, 95)
    );
  }

  return [...templatesByFill[anchors[anchors.length - 1]]];
}

function buildInterpolatedTemplateCurve(
  curve: TransmissionLossCurve,
  fillThicknessMm: number,
  templatesByFill: Record<MixedPlainModerateTemplateFill, readonly number[]>
): TransmissionLossCurve | null {
  if (curve.frequenciesHz.length !== MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ.length) {
    return null;
  }

  for (let index = 0; index < MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ.length; index += 1) {
    if (curve.frequenciesHz[index] !== MIXED_PLAIN_PREMIUM_FIELD_TEMPLATE_FREQUENCIES_HZ[index]) {
      return null;
    }
  }

  return {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: interpolateTemplateDbByFill(templatesByFill, fillThicknessMm)
  };
}

function describePrimaryCavity(layers: readonly ResolvedLayer[]): {
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

type DynamicFramingHint = {
  connectionType: AirborneContext["connectionType"];
  sharedTrack: AirborneContext["sharedTrack"];
  studSpacingMm?: number;
  studType: AirborneContext["studType"];
};

type BoardTier = "single_board" | "double_board" | "triple_board" | "mixed_board";

type FramedBoardSystemSummary = {
  acousticBoardFraction: number;
  averageBoardsPerLeaf: number;
  boardLayerCount: number;
  boardTier: BoardTier;
  leftLeafBoardCount: number;
  primaryGapLayerCount: number;
  rightLeafBoardCount: number;
  securityBoardCount: number;
};

type PrimaryCavitySegmentSummary = {
  cavityEnd: number;
  cavityStart: number;
  gapSegmentCount: number;
  gapThicknessMm: number;
  porousSegmentCount: number;
  porousTemplate: ResolvedLayer | null;
  porousThicknessMm: number;
  totalThicknessMm: number;
};

type DoubleStudSignature = {
  averageBoardsPerLeaf: number;
  deepStudCavity: boolean;
  fillFraction: number;
  independentTrack: boolean;
  likelyDoubleStud: boolean;
  splitGapSignature: boolean;
};

type FramingEvidenceSummary = {
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

type HeavyUnframedCavityRiskSummary = {
  allowedLiftDb: number;
  applies: boolean;
  boardMassFraction: number;
  maxLeafMassKgM2: number;
  minLeafMassKgM2: number;
};

type MultileafOrderSensitivitySummary = {
  boardInsertedTripleLeaf: boolean;
  hasOrderSensitiveMultileaf: boolean;
  innerLeafCount: number;
  lightInnerLeaf: boolean;
};

type FamilyDecisionBoundarySummary = {
  decisionClass: DynamicAirborneFamilyDecisionClass;
  margin: number | null;
  multiplePlausibleFamilies: boolean;
  runnerUpFamily: DynamicAirborneFamily | null;
  runnerUpScore: number | null;
  secondaryRunnerUpFamily: DynamicAirborneFamily | null;
  secondaryRunnerUpScore: number | null;
  selectedScore: number | null;
};

function normalizeFramingHint(airborneContext?: AirborneContext | null): DynamicFramingHint {
  return {
    connectionType: airborneContext?.connectionType ?? "auto",
    sharedTrack: airborneContext?.sharedTrack ?? "unknown",
    studSpacingMm:
      typeof airborneContext?.studSpacingMm === "number" &&
      Number.isFinite(airborneContext.studSpacingMm) &&
      airborneContext.studSpacingMm > 0
        ? airborneContext.studSpacingMm
        : undefined,
    studType: airborneContext?.studType ?? "auto"
  };
}

function hasExplicitFramingHint(framingHint: DynamicFramingHint): boolean {
  return (
    framingHint.connectionType !== "auto" ||
    framingHint.studType !== "auto" ||
    typeof framingHint.studSpacingMm === "number"
  );
}

function isResilientFramingHint(framingHint: DynamicFramingHint): boolean {
  return framingHint.connectionType === "resilient_channel" || framingHint.studType === "resilient_stud";
}

function isBoardLikeLayer(layer: ResolvedLayer): boolean {
  if (!classifyLayerRole(layer).isSolidLeaf) {
    return false;
  }

  return /gypsum|board|plasterboard|firestop|impactstop|acoustic|security|soundbloc/i.test(materialText(layer));
}

function isEnhancedBoardLayer(layer: ResolvedLayer): boolean {
  return /firestop|impactstop|acoustic|security|soundbloc|diamond|diamant|silentboard|silent[_ ]board/i.test(materialText(layer));
}

function summarizeFramedBoardSystem(layers: readonly ResolvedLayer[]): FramedBoardSystemSummary {
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

function summarizeFramingEvidence(
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

function summarizePremiumSingleBoardFramedCandidate(
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

function isPlainGypsumFilledSingleBoardCandidate(
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

function summarizeDoubleStudSignature(
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

function summarizeHeavyUnframedCavityRisk(
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

function summarizeMultileafOrderSensitivity(
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

function normalizeBoundarySignal(value: number, start: number, end: number): number {
  if (!(Number.isFinite(value) && Number.isFinite(start) && Number.isFinite(end)) || end <= start) {
    return 0;
  }

  return clamp((value - start) / (end - start), 0, 1);
}

function summarizeFamilyDecisionBoundary(
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

  const scoredFamilies: Array<{ family: DynamicAirborneFamily; score: number }> = [
    { family: "double_leaf", score: doubleLeafScore },
    { family: "lined_massive_wall", score: linedMassiveScore },
    { family: "stud_wall_system", score: studScore },
    { family: "double_stud_system", score: doubleStudScore }
  ]
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
    runnerUpFamily: runnerUp?.family ?? null,
    runnerUpScore: runnerUp?.score ?? null,
    secondaryRunnerUpFamily: secondaryRunnerUp?.family ?? null,
    secondaryRunnerUpScore: secondaryRunnerUp?.score ?? null,
    selectedScore: selected?.score ?? null
  };
}

function summarizePrimaryCavitySegments(layers: readonly ResolvedLayer[]): PrimaryCavitySegmentSummary | null {
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

function compareReinforcementCandidatePriority(left: ResolvedLayer, right: ResolvedLayer): number {
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

function findOuterLeafReinforcementCandidateIndex(
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

function isMicroGapHighFillEquivalentCavity(
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

function buildMicroGapFillOnlyEquivalentLayers(
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

function shiftCurve(curve: TransmissionLossCurve, shiftDb: number): TransmissionLossCurve {
  return {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: curve.transmissionLossDb.map((value) => clamp(value + shiftDb, 0, 95))
  };
}

function interpolateLinear(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x2 - x1) < 1e-9) {
    return y1;
  }

  const t = clamp((x - x1) / (x2 - x1), 0, 1);
  return y1 + (t * (y2 - y1));
}

function interpolateRwSeries(thicknessMm: number, points: readonly { thicknessMm: number; rw: number }[]): number {
  if (points.length === 0) {
    return 0;
  }

  if (points.length === 1) {
    return points[0]?.rw ?? 0;
  }

  const first = points[0];
  const second = points[1];
  const last = points[points.length - 1];
  const penultimate = points[points.length - 2];

  if (!first || !second || !last || !penultimate) {
    return points[0]?.rw ?? 0;
  }

  if (thicknessMm <= first.thicknessMm) {
    return interpolateLinear(thicknessMm, first.thicknessMm, first.rw, second.thicknessMm, second.rw);
  }

  for (let index = 1; index < points.length; index += 1) {
    const next = points[index];
    const previous = points[index - 1];

    if (!next || !previous) {
      continue;
    }

    if (thicknessMm <= next.thicknessMm) {
      return interpolateLinear(thicknessMm, previous.thicknessMm, previous.rw, next.thicknessMm, next.rw);
    }
  }

  return interpolateLinear(thicknessMm, penultimate.thicknessMm, penultimate.rw, last.thicknessMm, last.rw);
}

function isMasonryLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /masonry|concrete|aac|gazbeton|ytong|brick|block|stone|lime|limestone|granit|mermer|plaster|render|stucco|cement|pumice|bims|hollow|silicate|mortar/.test(
    materialText(layer)
  );
}

function isPlasterLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /plaster|render|stucco|mortar|cement_plaster|skim_plaster|lime_plaster|gypsum_plaster/.test(
    materialText(layer)
  );
}

function isAacLikeLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /aac|gazbeton|autoclaved|ytong|aircrete|porenbeton|hebel/.test(materialText(layer));
}

function isSilicateMasonryLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /silicate|calcium-silicate|sand-lime|silka/.test(materialText(layer));
}

function isPorothermClayLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /porotherm|wienerberger/.test(materialText(layer));
}

function isHeluzClayLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /heluz/.test(materialText(layer));
}

function isYtongMassiefG2300Layer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return layer.material.id === "ytong_massief_g2_300" || /ytong.*massief|g2\/300/.test(materialText(layer));
}

function isYtongSeparatiePaneelLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /^(ytong_separatiepaneel_aac_4_600|ytong_separatiepaneel_aac_5_750)$/.test(layer.material.id);
}

function isYtongSeparatiePaneelBuildUp(layers: readonly ResolvedLayer[]): boolean {
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

function isYtongCellenbetonblokLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /^(ytong_cellenbetonblok_g4_600|ytong_cellenbetonblok_g5_800)$/.test(layer.material.id);
}

function isYtongCellenbetonblokBuildUp(layers: readonly ResolvedLayer[]): boolean {
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

function isCelconAircreteLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf || layer.material.category !== "mass") {
    return false;
  }

  return /^(celcon_solar_grade|celcon_standard_grade|celcon_high_strength)$/.test(layer.material.id);
}

function isCelconFinishedAircreteBuildUp(layers: readonly ResolvedLayer[]): boolean {
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

function isMasonryCoreLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf || layer.material.category !== "mass") {
    return false;
  }

  return /aac|gazbeton|ytong|aircrete|autoclaved|pumice|bims|block|brick|masonry|silicate|stone|concrete/.test(
    materialText(layer)
  );
}

function isNonHomogeneousMasonryRiskLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (!role.isSolidLeaf) {
    return false;
  }

  return /aac|gazbeton|ytong|hebel|hollow|pumice|bims|brick|block|silicate|mortar/.test(materialText(layer));
}

function summarizeSingleLeafMasonryProfile(layers: readonly ResolvedLayer[]): {
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

function trimOuterCompliantLayers(layers: readonly ResolvedLayer[]): {
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

function computeContextMetric(curve: TransmissionLossCurve, context?: AirborneContext | null): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);

  if (context?.contextMode && context.contextMode !== "element_lab") {
    return ratings.field?.DnTw ?? ratings.iso717.RwPrime ?? ratings.iso717.Rw;
  }

  return ratings.iso717.Rw;
}

function anchorCurveToMetric(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context?: AirborneContext | null
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  return anchorCurveToComputedMetric(curve, targetMetric, context, (candidateCurve) => computeContextMetric(candidateCurve, context));
}

function anchorCurveToComputedMetric(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context: AirborneContext | null | undefined,
  computeMetric: (curve: TransmissionLossCurve) => number | null
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let currentCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  let currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  const sourceValues = [...currentCurve.transmissionLossDb];

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const currentMetric = computeMetric(currentCurve);
    if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
      return {
        applied: false,
        curve: {
          frequenciesHz: [...curve.frequenciesHz],
          transmissionLossDb: [...curve.transmissionLossDb]
        },
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context)
      };
    }

    const delta = targetMetric - currentMetric;
    if (Math.abs(delta) < 0.05) {
      break;
    }

    currentCurve = shiftCurve(currentCurve, delta);
    currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  }

  return {
    applied: currentCurve.transmissionLossDb.some((value, index) => Math.abs(value - sourceValues[index]) > 1e-6),
    curve: currentCurve,
    ratings: currentRatings
  };
}

function computeMicroGapEquivalenceMetric(
  curve: TransmissionLossCurve,
  context?: AirborneContext | null
): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);

  if (context?.contextMode && context.contextMode !== "element_lab") {
    return ratings.field?.RwPrime ?? ratings.iso717.RwPrime ?? ratings.field?.DnTw ?? ratings.iso717.Rw;
  }

  return ratings.iso717.Rw;
}

const DYNAMIC_SOUND_SPEED = 343;
const DYNAMIC_AIR_DENSITY = 1.21;

type MasonryDavyProfile = {
  bandEndHz: number;
  bandStartHz: number;
  centerHz: number;
  coreDensity: number;
  depthDb: number;
  fcRaw: number;
  fcSigmaOctaves: number;
  hasAacCore: boolean;
  lowDensityBandPenaltyDb: number;
  lowDensityGlobalPenaltyDb: number;
  masonryMassRatio: number;
  transitionOctaves: number;
};

function smoothstep01(value: number): number {
  const t = clamp(value, 0, 1);
  return (t * t) * (3 - (2 * t));
}

function octaveBandWindowWeight(freqHz: number, startHz: number, endHz: number, transitionOctaves = 0.3): number {
  const frequency = Math.max(freqHz, 1e-9);
  const start = Math.max(startHz, 1e-9);
  const end = Math.max(endHz, start + 1e-6);
  const transition = clamp(transitionOctaves, 0.05, 1.5);
  const left = smoothstep01((Math.log2(frequency / start) + transition) / (2 * transition));
  const right = smoothstep01((Math.log2(end / frequency) + transition) / (2 * transition));

  return clamp(Math.min(left, right), 0, 1);
}

function octaveGaussianDip(freqHz: number, centerHz: number, depthDb: number, sigmaOctaves = 0.25): number {
  const frequency = Math.max(freqHz, 1e-9);
  const center = Math.max(centerHz, 1e-9);
  const depth = Math.max(depthDb, 0);
  const sigma = Math.max(sigmaOctaves, 0.05);

  if (!(depth > 0)) {
    return 0;
  }

  const x = Math.log2(frequency / center);
  return depth * Math.exp(-0.5 * Math.pow(x / sigma, 2));
}

function buildMasonryDavyProfile(
  layers: readonly ResolvedLayer[],
  panel: ReturnType<typeof buildPanelProperties>
): MasonryDavyProfile | null {
  const solids = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (!solids.length) {
    return null;
  }

  const masses = solids.map((layer) => Math.max(layer.surfaceMassKgM2, 0));
  const totalMass = masses.reduce((sum, mass) => sum + mass, 0);
  if (!(totalMass > 0)) {
    return null;
  }

  const masonryMass = solids.reduce(
    (sum, layer, index) => sum + (isMasonryLikeLayer(layer) ? masses[index]! : 0),
    0
  );
  const masonryMassRatio = masonryMass / totalMass;
  if (!(masonryMassRatio >= 0.7)) {
    return null;
  }

  const masonryEntries = solids
    .map((layer, index) => ({ layer, mass: masses[index]! }))
    .filter((entry) => isMasonryLikeLayer(entry.layer) && entry.mass > 0);
  const coreEntries = masonryEntries.filter((entry) => !isPlasterLikeLayer(entry.layer));
  const corePool = coreEntries.length ? coreEntries : masonryEntries;
  const coreMass = corePool.reduce((sum, entry) => sum + entry.mass, 0);
  if (!(coreMass > 0)) {
    return null;
  }

  const coreDensity =
    corePool.reduce((sum, entry) => sum + (entry.mass * entry.layer.material.densityKgM3), 0) / coreMass;
  const hasAacCore = corePool.some((entry) => isAacLikeLayer(entry.layer));
  if (!hasAacCore) {
    return null;
  }

  const fcRaw = Math.max(estimateCriticalFrequency(panel), 40);
  const bandStartHz = 500;
  const bandEndHz = 2000;
  const centerHz = clamp(fcRaw * 3.6, bandStartHz, bandEndHz);
  const depthDb = clamp(
    4.8 +
      (1.2 * clamp((220 - panel.mass) / 160, 0, 1)) +
      (0.8 * clamp((0.03 - panel.damping) / 0.03, 0, 1)),
    0,
    12
  );
  const lowDensityFactor = clamp((680 - coreDensity) / 80, 0, 1);

  return {
    bandEndHz,
    bandStartHz,
    centerHz,
    coreDensity,
    depthDb,
    fcRaw,
    fcSigmaOctaves: 0.38,
    hasAacCore,
    lowDensityBandPenaltyDb: 6 * lowDensityFactor,
    lowDensityGlobalPenaltyDb: 1 * lowDensityFactor,
    masonryMassRatio,
    transitionOctaves: 0.4
  };
}

function buildMasonryDavyCremerCurve(
  frequenciesHz: readonly number[],
  panel: ReturnType<typeof buildPanelProperties>,
  profile: MasonryDavyProfile
): number[] {
  const mass = Math.max(panel.mass, 1e-9);
  const fc = Math.max(profile.fcRaw, 40);
  const etaIntBase = clamp(panel.damping, 0.001, 0.45);
  const sigmaNScale = 0.944;
  const sigmaCBase = 0.356;
  const sigmaCSlope = 0.525;
  const etaIScale = 1.0;
  const etaEdgeDen = 814;
  const etaRScale = 1.25;
  const shearCorrection = 0.94;

  return frequenciesHz.map((frequencyHz) => {
    const frequency = Math.max(frequencyHz, 1e-9);
    const omega = 2 * Math.PI * frequency;
    const k = omega / DYNAMIC_SOUND_SPEED;
    const sigmaN = clamp(finitePanelRadiationEfficiency(frequency, 2.7, 4.0) * sigmaNScale, 0.05, 1.4);
    const sigmaC = clamp(sigmaCBase + (sigmaCSlope * sigmaN), 0.1, 2.2);
    const etaI = clamp(etaIntBase * etaIScale, 0.001, 0.6);
    const etaE = mass / (etaEdgeDen * Math.sqrt(Math.max(frequency, 1)));
    const etaR = (sigmaN * DYNAMIC_AIR_DENSITY) / (Math.max(k, 1e-9) * mass);
    const etaTotal = clamp(etaI + etaE + (2 * etaRScale * etaR), 0.002, 0.95);
    const zM = (Math.PI * frequency * mass) / (DYNAMIC_AIR_DENSITY * DYNAMIC_SOUND_SPEED);
    const r = frequency / fc;
    const denom = Math.max(sigmaC + (zM * etaTotal), 1e-9);
    const atanTerm =
      Math.atan((2 * zM) / denom) -
      Math.atan((2 * zM * (1 - r)) / denom);
    const tauR =
      shearCorrection *
      ((sigmaC * sigmaC) / (2 * Math.max(zM * r, 1e-9) * denom)) *
      atanTerm;
    const tauN = (2 * sigmaN) / Math.max(zM * zM, 1e-12);

    let tau = frequency < fc ? (tauR + tauN) : tauR;
    tau = clamp(tau, 1e-12, 1);

    let transmissionLossDb = -10 * log10Safe(tau);
    transmissionLossDb -= octaveGaussianDip(frequency, profile.centerHz, profile.depthDb, profile.fcSigmaOctaves);
    transmissionLossDb -=
      profile.lowDensityBandPenaltyDb *
      octaveBandWindowWeight(frequency, profile.bandStartHz, profile.bandEndHz, profile.transitionOctaves);
    transmissionLossDb -= profile.lowDensityGlobalPenaltyDb;

    return clamp(transmissionLossDb, 0, 95);
  });
}

function applyMasonryDavyConservativeCap(
  curve: TransmissionLossCurve,
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  options: DynamicAirborneOptions,
  genericMasonryLaneActive: boolean
): {
  applied: boolean;
  curve: TransmissionLossCurve;
  notes: string[];
  ratings: AssemblyRatings;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    options.disableMasonryDavyCap ||
    !genericMasonryLaneActive ||
    topology.visibleLeafCount !== 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const panel = buildPanelProperties(layers, calculateLayerTotals(layers));
  if (!panel.valid) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const profile = buildMasonryDavyProfile(layers, panel);
  if (!profile) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const davyCurveDb = buildMasonryDavyCremerCurve(curve.frequenciesHz, panel, profile);
  const cappedTransmissionLossDb = curve.transmissionLossDb.map((value, index) =>
    Math.min(value, davyCurveDb[index] ?? value)
  );
  const maxReductionDb = cappedTransmissionLossDb.reduce(
    (maxReduction, value, index) => Math.max(maxReduction, curve.transmissionLossDb[index]! - value),
    0
  );

  if (!(maxReductionDb >= 0.25)) {
    return {
      applied: false,
      curve,
      notes,
      ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, options.airborneContext),
      strategySuffix: null,
      targetRw: null
    };
  }

  const cappedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: cappedTransmissionLossDb
  };
  const ratings = buildRatingsFromCurve(cappedCurve.frequenciesHz, cappedCurve.transmissionLossDb, options.airborneContext);

  notes.push(
    `A Davy/Cremer-style masonry coincidence cap reduced the generic single-leaf AAC lane around ${Math.round(profile.centerHz)} Hz (core density ${profile.coreDensity.toFixed(0)} kg/m3, max reduction ${maxReductionDb.toFixed(1)} dB).`
  );

  return {
    applied: true,
    curve: cappedCurve,
    notes,
    ratings,
    strategySuffix: "masonry_davy_cap",
    targetRw: ratings.iso717.Rw
  };
}

function buildReducedThicknessVariant(
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

function estimateStudWallTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  framingHint: DynamicFramingHint,
  family: DynamicAirborneFamily,
  currentRw: number
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];
  const cavity = describePrimaryCavity(layers);
  const boardSystem = summarizeFramedBoardSystem(layers);
  const framingEvidence = summarizeFramingEvidence(layers, topology, framingHint);

  if (
    topology.visibleLeafCount !== 2 ||
    topology.cavityCount !== 1 ||
    !framingEvidence.studEligible
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const cavityDepthMm = Math.max(cavity.coreThicknessMm, 0);
  const fillFraction = cavityDepthMm > 0 ? clamp(cavity.porousThicknessMm / cavityDepthMm, 0, 1) : 0;
  const hasFill = cavity.porousThicknessMm > 0;
  const isResilient = isResilientFramingHint(framingHint);
  const premiumSingleBoardCandidate = summarizePremiumSingleBoardFramedCandidate(layers, boardSystem, cavity, topology);
  const hasAcousticGypsumLikeBoard = layers.some((layer) =>
    classifyLayerRole(layer).isSolidLeaf &&
    isBoardLikeLayer(layer) &&
    (
      layer.material.id === "acoustic_gypsum_board" ||
      /\bacoustic(?:[_ ]gypsum)?\b/i.test(layer.material.name)
    )
  );
  const plainGypsumFilledSingleBoard = isPlainGypsumFilledSingleBoardCandidate(
    layers,
    boardSystem,
    cavity,
    topology
  );
  const fireRatedFilledSingleBoardFamily = detectFireRatedFilledSingleBoardFamily(layers);
  const securityFilledSingleBoardFamily = detectSecurityFilledSingleBoardFamily(layers);
  const symmetricEnhancedFilledSingleBoardFamily = detectSymmetricEnhancedFilledSingleBoardFamily(layers);
  const mixedEnhancedFilledSingleBoardFamily = detectMixedEnhancedFilledSingleBoardFamily(layers);
  const targetBoardTier = boardSystem.boardTier === "mixed_board"
    ? boardSystem.averageBoardsPerLeaf < 2
      ? "single_board"
      : boardSystem.averageBoardsPerLeaf < 3
        ? "double_board"
        : "triple_board"
    : boardSystem.boardTier;

  let targetRw =
    targetBoardTier === "single_board"
      ? 34
      : targetBoardTier === "double_board"
        ? 42
        : 48;

  if (targetBoardTier === "single_board") {
    targetRw += clamp((cavityDepthMm - 75) * 0.08, 0, 4.5);
    if (hasFill) {
      targetRw += 5 + (4 * fillFraction);
    }

    if (plainGypsumFilledSingleBoard) {
      targetRw = isResilient
        ? 47 + clamp((cavityDepthMm - 35) * 0.12, 0, 3)
        : 42 + clamp((cavityDepthMm - 35) * 0.12, 0, 3);
      notes.push(
        "A plain gypsum filled single-board corridor was selected because light gypsum + mineral-wool framed walls were still missing the upstream lab split between steel and resilient support types."
      );
    }

    if (securityFilledSingleBoardFamily) {
      const profile = getSecurityFilledSingleBoardProfile(
        isResilient
          ? { connectionType: "resilient_channel", studType: "resilient_stud" }
          : { connectionType: "line_connection", studType: "light_steel_stud" }
      );
      const fillAnchors = SECURITY_FILLED_SINGLE_BOARD_LAB_TARGET_RW[securityFilledSingleBoardFamily.family][profile];
      targetRw = ksRound1(
        interpolateTemplateDbByFill(
          {
            35: [fillAnchors[35]],
            42: [fillAnchors[42]],
            50: [fillAnchors[50]],
            60: [fillAnchors[60]]
          },
          cavityDepthMm
        )[0]
      );
      notes.push(
        `A security-board filled single-board corridor was selected because ${securityFilledSingleBoardFamily.family} + security framed walls were materially misreading the upstream lab corridor.`
      );
    }

    if (symmetricEnhancedFilledSingleBoardFamily) {
      const profile = getSymmetricEnhancedFilledSingleBoardProfile(
        isResilient
          ? { connectionType: "resilient_channel", studType: "resilient_stud" }
          : { connectionType: "line_connection", studType: "light_steel_stud" }
      );
      const fillAnchors =
        SYMMETRIC_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW[symmetricEnhancedFilledSingleBoardFamily.family][profile];
      targetRw = ksRound1(
        interpolateTemplateDbByFill(
          {
            35: [fillAnchors[35]],
            42: [fillAnchors[42]],
            50: [fillAnchors[50]],
            60: [fillAnchors[60]]
          },
          cavityDepthMm
        )[0]
      );
      notes.push(
        `A symmetric enhanced filled single-board corridor was selected because ${symmetricEnhancedFilledSingleBoardFamily.family} + ${symmetricEnhancedFilledSingleBoardFamily.family} framed walls were materially misreading the upstream lab corridor.`
      );
    }

    if (
      hasFill &&
      cavityDepthMm >= 70 &&
      cavityDepthMm <= 85 &&
      fillFraction >= 0.45 &&
      boardSystem.acousticBoardFraction < 0.25 &&
      boardSystem.primaryGapLayerCount < 2
    ) {
      const compactFillLiftDb = 0.7;
      targetRw += compactFillLiftDb;
      notes.push(
        `A compact filled single-board lift added ${compactFillLiftDb.toFixed(1)} dB because the shallow W111-style framed corridor was still slightly under-reading published mineral-wool variants.`
      );
    }

    if (
      premiumSingleBoardCandidate.qualifies &&
      !securityFilledSingleBoardFamily &&
      !symmetricEnhancedFilledSingleBoardFamily
    ) {
      if (fireRatedFilledSingleBoardFamily) {
        const profile = getFireRatedFilledSingleBoardProfile(
          isResilient
            ? { connectionType: "resilient_channel", studType: "resilient_stud" }
            : { connectionType: "line_connection", studType: "light_steel_stud" }
        );
        const fillAnchors = FIRE_RATED_FILLED_SINGLE_BOARD_LAB_TARGET_RW[fireRatedFilledSingleBoardFamily.family][profile];
        targetRw = ksRound1(
          interpolateTemplateDbByFill(
            {
              35: [fillAnchors[35]],
              42: [fillAnchors[42]],
              50: [fillAnchors[50]],
              60: [fillAnchors[60]]
            },
            cavityDepthMm
          )[0]
        );
        notes.push(
          "A fire-rated filled single-board corridor was selected because the generic low-mass enhanced lane was materially misreading fire/firestop framed walls against the upstream lab corridor."
        );
      } else if (premiumSingleBoardCandidate.mixedSecurityEnhancedFilled && !securityFilledSingleBoardFamily) {
        targetRw =
          44.4 +
          (premiumSingleBoardCandidate.hasSilentboardLikeBoard ? 0.5 : 0) +
          clamp((cavityDepthMm - 42) * 0.16, 0, 1.4);
        notes.push(
          "A mixed security-board filled single-board corridor was selected because the generic framed single-board lane was still under-reading premium + security hybrids against the upstream lane."
        );
      } else if (premiumSingleBoardCandidate.mixedPlainDiamondFilled || premiumSingleBoardCandidate.mixedPlainSilentFilled) {
        const premiumFamilyInfo = getMixedPlainPremiumFamilyAndTemplateId(premiumSingleBoardCandidate);
        const premiumProfile = isResilient ? "resilient" : "steel";
        const fillAnchors =
          premiumFamilyInfo === null
            ? null
            : MIXED_PLAIN_PREMIUM_LAB_TARGET_RW[premiumFamilyInfo.family][premiumProfile];
        targetRw = fillAnchors === null
          ? targetRw
          : ksRound1(
              interpolateTemplateDbByFill(
                {
                  35: [fillAnchors[35]],
                  42: [fillAnchors[42]],
                  50: [fillAnchors[50]],
                  60: [fillAnchors[60]]
                },
                cavityDepthMm
              )[0]
            );
        notes.push(
          premiumSingleBoardCandidate.mixedPlainSilentFilled
            ? "A mixed plain-gypsum + silentboard filled single-board corridor was selected because the previous shared premium lane was materially misreading this hybrid wall against the upstream lab corridor."
            : "A mixed plain-gypsum + diamond filled single-board corridor was selected because the previous shared premium lane was materially misreading this hybrid wall against the upstream lab corridor."
        );
      } else if (mixedEnhancedFilledSingleBoardFamily) {
        const profile = getMixedEnhancedFilledSingleBoardProfile(
          isResilient
            ? { connectionType: "resilient_channel", studType: "resilient_stud" }
            : { connectionType: "line_connection", studType: "light_steel_stud" }
        );
        const fillAnchors =
          MIXED_ENHANCED_FILLED_SINGLE_BOARD_LAB_TARGET_RW[mixedEnhancedFilledSingleBoardFamily.family][profile];
        targetRw = ksRound1(
          interpolateTemplateDbByFill(
            {
              35: [fillAnchors[35]],
              42: [fillAnchors[42]],
              50: [fillAnchors[50]],
              60: [fillAnchors[60]]
            },
            cavityDepthMm
          )[0]
        );
        notes.push(
          "A mixed enhanced filled single-board corridor was selected because resilient and premium framed hybrids were still materially misreading the upstream lab corridor."
        );
      } else if (premiumSingleBoardCandidate.mixedAcousticPremiumFilled && isResilient) {
        targetRw = 45 + clamp((cavityDepthMm - 35) * 0.12, 0, 3);
        notes.push(
          "A mixed acoustic-gypsum + diamond filled resilient corridor was selected because the generic resilient premium lift was still substantially over-reading this hybrid framed wall against the upstream lane."
        );
      } else if (premiumSingleBoardCandidate.mixedAcousticSilentFilled && isResilient) {
        targetRw = 45 + clamp((cavityDepthMm - 42) * 0.15, 0, 3);
        notes.push(
          "A mixed acoustic-gypsum + silentboard filled resilient corridor was selected because the generic resilient premium lift was still substantially over-reading this hybrid framed wall against the upstream lane."
        );
      } else if (premiumSingleBoardCandidate.lowMassFireRatedFilledPremium && isResilient && !fireRatedFilledSingleBoardFamily) {
        if (premiumSingleBoardCandidate.hasDiamondLikeBoard || premiumSingleBoardCandidate.hasSilentboardLikeBoard) {
          targetRw =
            44 +
            clamp((cavityDepthMm - 35) * 0.12, 0, 3) +
            (premiumSingleBoardCandidate.hasFirestopLikeBoard ? 0.5 : 0);
        } else if (hasAcousticGypsumLikeBoard) {
          targetRw =
            42 +
            clamp((cavityDepthMm - 35) * 0.10, 0, 2.5) +
            (premiumSingleBoardCandidate.hasFirestopLikeBoard ? 0.5 : 0);
        } else {
          targetRw =
            40 +
            clamp((cavityDepthMm - 35) * 0.12, 0, 3) +
            (premiumSingleBoardCandidate.hasFirestopLikeBoard ? 0.5 : 0);
        }
        notes.push(
          "A fire-rated low-mass filled resilient corridor was selected because the generic resilient premium lift was still substantially over-reading fire/firestop hybrid framed walls against the upstream lane."
        );
      } else if (
        !fireRatedFilledSingleBoardFamily &&
        !securityFilledSingleBoardFamily &&
        (
          premiumSingleBoardCandidate.lowMassFilledEnhanced ||
          premiumSingleBoardCandidate.mixedAcousticPremiumFilled ||
          premiumSingleBoardCandidate.mixedAcousticSilentFilled
        )
      ) {
        let premiumSingleBoardLiftDb = 0;

        if (premiumSingleBoardCandidate.mixedAcousticSilentFilled) {
          premiumSingleBoardLiftDb = isResilient
            ? 6 + clamp((cavityDepthMm - 42) * 0.05, 0, 1)
            : 2 + clamp((cavityDepthMm - 35) * 0.08, 0, 2);
        } else {
          const shallowFilledDepthLiftDb = clamp((cavityDepthMm - 38) * 0.12, 0, 3.2);
          const premiumHighBoardBoost =
            premiumSingleBoardCandidate.hasDiamondLikeBoard || premiumSingleBoardCandidate.hasSilentboardLikeBoard
              ? 1.0
              : 0;
          premiumSingleBoardLiftDb =
            shallowFilledDepthLiftDb +
            premiumHighBoardBoost;

          if (premiumSingleBoardCandidate.mixedAcousticPremiumFilled && !isResilient) {
            premiumSingleBoardLiftDb += 1.5;
          }

          if (isResilient) {
            premiumSingleBoardLiftDb +=
              4 +
              clamp((cavityDepthMm - 35) * 0.08, 0, 2) +
              premiumHighBoardBoost;
          }
        }

        if (premiumSingleBoardLiftDb > 0) {
          targetRw += premiumSingleBoardLiftDb;
          notes.push(
            `A low-mass filled premium single-board lift added ${premiumSingleBoardLiftDb.toFixed(1)} dB because shallow enhanced mineral-filled framed cavities were still under-reading the upstream corridor.`
          );
        }
      } else if (premiumSingleBoardCandidate.silentboardHeavyFilledPremium) {
        targetRw =
          (premiumSingleBoardCandidate.hasDiamondLikeBoard ? 45 : 45.5) +
          clamp((cavityDepthMm - 35) * 0.16, 0, 4);
        notes.push(
          "A silentboard-heavy filled premium single-board corridor was selected because the generic heavy enhanced-board lift was still over-reading mixed silentboard framed walls against the upstream corridor."
        );
      } else if (premiumSingleBoardCandidate.lowMassEmptyEnhanced) {
        const premiumSingleBoardLiftDb =
          (premiumSingleBoardCandidate.hasDiamondLikeBoard ? 9 : 7) +
          (isResilient ? 1 : 0);
        targetRw += premiumSingleBoardLiftDb;
        notes.push(
          `A low-mass empty premium single-board lift added ${premiumSingleBoardLiftDb.toFixed(1)} dB because light fire/diamond framed cavities were still under-reading the upstream empty-cavity corridor.`
        );
      } else {
        let premiumSingleBoardLiftDb = clamp((topology.surfaceMassKgM2 - 38) * 0.12, 0, 4);

        if (boardSystem.acousticBoardFraction >= 0.66) {
          premiumSingleBoardLiftDb += 2;
        } else if (boardSystem.acousticBoardFraction >= 0.33) {
          premiumSingleBoardLiftDb += 1;
        }

        if (premiumSingleBoardCandidate.asymmetricFilledPremium) {
          premiumSingleBoardLiftDb += 1.5;
        }

        premiumSingleBoardLiftDb += hasFill ? 4 : 8;

        if (isResilient) {
          premiumSingleBoardLiftDb += hasFill ? 2.5 : 1.5;
        }

        targetRw += premiumSingleBoardLiftDb;
        notes.push(
          `A premium single-board framed lift added ${premiumSingleBoardLiftDb.toFixed(1)} dB because heavy 1x1 and 1x2 enhanced-board cavities were still under-reading the upstream silentboard/diamond corridor.`
        );
      }
    }
  } else if (targetBoardTier === "double_board") {
    if (isResilient) {
      targetRw = 49;
      targetRw += clamp((cavityDepthMm - 90) * 0.05, 0, 1.2);
      if (hasFill) {
        targetRw += 4 + (4 * fillFraction);
      }
    } else {
      targetRw += clamp((cavityDepthMm - 100) * 0.06, 0, 3.5);
      if (hasFill) {
        targetRw += 6 + (5 * fillFraction);
      }
      if (boardSystem.acousticBoardFraction >= 0.5) {
        targetRw += hasFill ? 6.5 : 1.5;
      }
      if (boardSystem.primaryGapLayerCount >= 2 && hasFill) {
        targetRw += 7.5;
      }

      if (
        hasFill &&
        cavityDepthMm >= 100 &&
        fillFraction <= 0.6 &&
        boardSystem.acousticBoardFraction < 0.25 &&
        boardSystem.primaryGapLayerCount < 2
      ) {
        const deepLightlyFilledTrimDb = clamp(0.5 + ((cavityDepthMm - 100) * 0.034), 0.5, 2.2);
        targetRw -= deepLightlyFilledTrimDb;
        notes.push(
          `A deep lightly filled single-cavity double-board trim softened the generic framed corridor by ${deepLightlyFilledTrimDb.toFixed(1)} dB because published W112-style holdouts rise more slowly with cavity depth.`
        );
      }
    }
  } else {
    targetRw += clamp((cavityDepthMm - 125) * 0.06, 0, 3.5);
    if (hasFill) {
      targetRw += 6 + (5 * fillFraction);
    }
    if (boardSystem.acousticBoardFraction >= 0.5) {
      targetRw += 7.5;
    }
    if (isResilient) {
      targetRw += 4.5;
    }

    if (
      hasFill &&
      cavityDepthMm >= 140 &&
      fillFraction <= 0.45 &&
      boardSystem.acousticBoardFraction >= 0.5 &&
      boardSystem.primaryGapLayerCount < 2
    ) {
      const highSpecAcousticLiftDb = 0.5;
      targetRw += highSpecAcousticLiftDb;
      notes.push(
        `A high-spec acoustic triple-board lift added ${highSpecAcousticLiftDb.toFixed(1)} dB because the current corridor was still under-reading published W113-style deep mineral-filled variants.`
      );
    }
  }

  if (framingHint.studType === "wood_stud") {
    targetRw -= targetBoardTier === "single_board" ? 0.8 : 0.5;
  } else if (framingHint.studType === "light_steel_stud") {
    targetRw += targetBoardTier === "single_board" ? 0 : 0.3;
  }

  const heavierLeafBoards = Math.max(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount);
  const lighterLeafBoards = Math.min(boardSystem.leftLeafBoardCount, boardSystem.rightLeafBoardCount);
  const leafMassRatio = topology.visibleLeafMassRatio ?? 1;

  if (
    !isResilient &&
    boardSystem.boardTier === "mixed_board" &&
    hasFill &&
    boardSystem.primaryGapLayerCount >= 2 &&
    boardSystem.acousticBoardFraction >= 0.85 &&
    heavierLeafBoards === 2 &&
    lighterLeafBoards === 1 &&
    fillFraction >= 0.3 &&
    fillFraction <= 0.75 &&
    leafMassRatio >= 1.8
  ) {
    const premiumMixedSplitLiftDb = clamp(5 + ((leafMassRatio - 1.8) * 7), 5, 9.5);
    targetRw += premiumMixedSplitLiftDb;
    notes.push(
      `A premium mixed-board split-cavity lift added ${premiumMixedSplitLiftDb.toFixed(1)} dB because 1x2 enhanced-board framed walls were still under-reading the upstream corridor.`
    );
  }

  if (
    !isResilient &&
    boardSystem.boardTier === "mixed_board" &&
    hasFill &&
    boardSystem.primaryGapLayerCount >= 2 &&
    boardSystem.acousticBoardFraction >= 0.5 &&
    heavierLeafBoards >= 3 &&
    lighterLeafBoards === 1 &&
    leafMassRatio >= 1.5
  ) {
    const asymmetricPremiumSplitTrimDb = clamp(9 + ((leafMassRatio - 1.5) * 8), 9, 18);
    targetRw -= asymmetricPremiumSplitTrimDb;
    notes.push(
      `An asymmetrical premium split-cavity trim removed ${asymmetricPremiumSplitTrimDb.toFixed(1)} dB because 1x3 framed walls were otherwise over-scoring against the upstream corridor.`
    );
  }

  if (framingHint.connectionType === "point_connection") {
    targetRw -= 0.6;
  } else if (framingHint.connectionType === "direct_fix") {
    targetRw -= 1.2;
  }

  if (typeof framingHint.studSpacingMm === "number") {
    if (framingHint.studSpacingMm <= 450) {
      targetRw -= 0.6;
    } else if (framingHint.studSpacingMm >= 600) {
      targetRw += 0.2;
    }
  }

  targetRw = ksRound1(clamp(targetRw, 28, 72));
  const shiftDb = ksRound1(targetRw - currentRw);
  const laneLabel = family === "double_stud_system" ? "double-stud lane" : "stud-wall lane";
  const strategySuffix = family === "double_stud_system" ? "double_stud_calibration" : "framed_wall_calibration";

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Explicit framed-wall metadata moved the ${laneLabel} onto the ${targetBoardTier.replace("_", " ")} calibration corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  if (boardSystem.primaryGapLayerCount >= 2 && hasFill) {
    notes.push(
      family === "double_stud_system"
        ? "Split-cavity framing was detected between the two leaves, so the double-stud corridor was lifted above a plain single-cavity partition."
        : "Split-cavity framing was detected between the two leaves, so the stud-wall corridor was lifted above a plain single-cavity partition."
    );
  }

  if (isResilient) {
    notes.push("Resilient stud/channel metadata activated the higher decoupling corridor instead of the generic cavity-wall surrogate.");
  }

  return {
    notes,
    shiftDb,
    strategySuffix,
    targetRw
  };
}

function estimateAacMassiveTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  screeningEstimatedRwDb: number,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];
  const text = layers.map(materialText).join(" ");

  if (
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport ||
    !/aac|gazbeton|ytong|aircrete|autoclaved/.test(text)
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  let offsetDb = 0;

  if (surfaceMassKgM2 <= 86.8) {
    offsetDb = -2.5;
  } else if (surfaceMassKgM2 < 121.5) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 86.8, -2.5, 121.5, 0);
  } else if (surfaceMassKgM2 < 139) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 121.5, 0, 139, 2);
  } else if (surfaceMassKgM2 < 174) {
    offsetDb = interpolateLinear(surfaceMassKgM2, 139, 2, 174, 3);
  } else {
    offsetDb = 3;
  }

  const targetRw = ksRound1(clamp(screeningEstimatedRwDb + offsetDb, 28, 68));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official AAC masonry references moved the ${family === "masonry_nonhomogeneous" ? "single-leaf masonry" : "rigid-wall"} lane onto a low-density Ytong/Xella corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "aac_massive_calibration",
    targetRw
  };
}

function estimateSilicateMasonryTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (
    solidLayers.length === 0 ||
    solidLayers.some((layer) => isPlasterLikeLayer(layer)) ||
    !solidLayers.every((layer) => isSilicateMasonryLayer(layer))
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  const points = [
    { surfaceMassKgM2: 175.3, rw: 43 },
    { surfaceMassKgM2: 262.9, rw: 50 },
    { surfaceMassKgM2: 306.7, rw: 52 },
    { surfaceMassKgM2: 375.1, rw: 55 }
  ] as const;

  let targetRw: number = points[0].rw;
  if (surfaceMassKgM2 <= points[0].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      120,
      39,
      points[0].surfaceMassKgM2,
      points[0].rw
    );
  } else if (surfaceMassKgM2 < points[1].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[0].surfaceMassKgM2,
      points[0].rw,
      points[1].surfaceMassKgM2,
      points[1].rw
    );
  } else if (surfaceMassKgM2 < points[2].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[1].surfaceMassKgM2,
      points[1].rw,
      points[2].surfaceMassKgM2,
      points[2].rw
    );
  } else if (surfaceMassKgM2 < points[3].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[2].surfaceMassKgM2,
      points[2].rw,
      points[3].surfaceMassKgM2,
      points[3].rw
    );
  } else {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[3].surfaceMassKgM2,
      points[3].rw,
      470,
      59
    );
  }

  targetRw = ksRound1(clamp(targetRw, 39, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Silka references moved the single-leaf silicate masonry lane onto a dense calcium-silicate corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "silicate_masonry_calibration",
    targetRw
  };
}

function estimateUnfinishedAircreteTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (
    solidLayers.length === 0 ||
    solidLayers.some((layer) => isPlasterLikeLayer(layer)) ||
    !solidLayers.every((layer) => isAacLikeLayer(layer))
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  if (!(surfaceMassKgM2 > 0)) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp((27.7 * Math.log10(surfaceMassKgM2)) - 11.6, 28, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official H+H Celcon unfinished-aircrete guidance moved the bare aircrete lane onto the published mass-law corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "aircrete_unfinished_calibration",
    targetRw
  };
}

function estimatePorothermPlasteredTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isPorothermClayLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const finishMaterialId = leftLayer.material.id;
  const surfaceMassKgM2 = topology.surfaceMassKgM2;
  let points: readonly { rw: number; surfaceMassKgM2: number }[] | null = null;
  let finishLabel = "";

  if (finishMaterialId === "dense_plaster") {
    points = [
      { surfaceMassKgM2: 149.0, rw: 43 },
      { surfaceMassKgM2: 172.9, rw: 44 },
      { surfaceMassKgM2: 215.5, rw: 48 }
    ];
    finishLabel = "13 mm dense plaster";
  } else if (finishMaterialId === "lightweight_plaster") {
    points = [
      { surfaceMassKgM2: 118.6, rw: 40 },
      { surfaceMassKgM2: 142.6, rw: 41 },
      { surfaceMassKgM2: 185.1, rw: 46 }
    ];
    finishLabel = "13 mm lightweight plaster";
  }

  if (!points) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  let targetRw = points[0].rw;
  if (surfaceMassKgM2 <= points[0].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      Math.max(points[0].surfaceMassKgM2 - 35, 80),
      points[0].rw - 3,
      points[0].surfaceMassKgM2,
      points[0].rw
    );
  } else if (surfaceMassKgM2 < points[1].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[0].surfaceMassKgM2,
      points[0].rw,
      points[1].surfaceMassKgM2,
      points[1].rw
    );
  } else if (surfaceMassKgM2 < points[2].surfaceMassKgM2) {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[1].surfaceMassKgM2,
      points[1].rw,
      points[2].surfaceMassKgM2,
      points[2].rw
    );
  } else {
    targetRw = interpolateLinear(
      surfaceMassKgM2,
      points[2].surfaceMassKgM2,
      points[2].rw,
      points[2].surfaceMassKgM2 + 60,
      points[2].rw + 4
    );
  }

  targetRw = ksRound1(clamp(targetRw, 36, 58));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Wienerberger Porotherm guidance moved the perforated-clay single-leaf lane onto the published ${finishLabel} declaration corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "porotherm_plastered_calibration",
    targetRw
  };
}

function estimateHeluzPlasteredClayTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isHeluzClayLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !/^lime_cement_plaster_/.test(leftLayer.material.id)
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const exactTargets: Record<string, { coreThicknessMm: number; finishId: string; finishThicknessMm: number; rw: number }> = {
    heluz_14_brushed: { coreThicknessMm: 140, finishId: "lime_cement_plaster_1300", finishThicknessMm: 15, rw: 41 },
    heluz_aku_115: { coreThicknessMm: 115, finishId: "lime_cement_plaster_1700", finishThicknessMm: 15, rw: 47 },
    heluz_aku_200_p15: { coreThicknessMm: 200, finishId: "lime_cement_plaster_1780", finishThicknessMm: 17, rw: 53 },
    heluz_aku_300_333_p20: { coreThicknessMm: 300, finishId: "lime_cement_plaster_1700", finishThicknessMm: 15, rw: 56 }
  };
  const exactTarget = exactTargets[coreLayer.material.id];

  if (
    !exactTarget ||
    leftLayer.material.id !== exactTarget.finishId ||
    Math.abs(leftLayer.thicknessMm - exactTarget.finishThicknessMm) > 0.6 ||
    Math.abs(coreLayer.thicknessMm - exactTarget.coreThicknessMm) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(exactTarget.rw, 37, 58));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official HELUZ measured lab rows moved the plastered hollow-clay masonry lane onto a HELUZ-specific corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "heluz_plastered_clay_calibration",
    targetRw
  };
}

function estimateYtongMassiefG2300TargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongMassiefG2300Layer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const points = [
    { thicknessMm: 240, rw: 46 },
    { thicknessMm: 300, rw: 49 },
    { thicknessMm: 365, rw: 51 }
  ] as const;
  let targetRw: number = points[0].rw;

  if (coreLayer.thicknessMm <= points[0].thicknessMm) {
    targetRw = interpolateLinear(coreLayer.thicknessMm, 180, 42, points[0].thicknessMm, points[0].rw);
  } else if (coreLayer.thicknessMm < points[1].thicknessMm) {
    targetRw = interpolateLinear(
      coreLayer.thicknessMm,
      points[0].thicknessMm,
      points[0].rw,
      points[1].thicknessMm,
      points[1].rw
    );
  } else if (coreLayer.thicknessMm < points[2].thicknessMm) {
    targetRw = interpolateLinear(
      coreLayer.thicknessMm,
      points[1].thicknessMm,
      points[1].rw,
      points[2].thicknessMm,
      points[2].rw
    );
  } else {
    targetRw = interpolateLinear(coreLayer.thicknessMm, points[2].thicknessMm, points[2].rw, 420, 52.5);
  }

  targetRw = ksRound1(clamp(targetRw, 42, 53));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Nederland Ytong Massiefblokken guidance moved the low-density AAC thin-plaster lane onto the published G2/300 corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_massief_g2_300_calibration",
    targetRw
  };
}

function estimateYtongSeparatiePaneelTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongSeparatiePaneelLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const exactTargets: Record<string, readonly { thicknessMm: number; rw: number }[]> = {
    ytong_separatiepaneel_aac_4_600: [
      { thicknessMm: 70, rw: 34 },
      { thicknessMm: 100, rw: 34 }
    ],
    ytong_separatiepaneel_aac_5_750: [{ thicknessMm: 100, rw: 37 }]
  };
  const points = exactTargets[coreLayer.material.id];
  const exactPoint = points?.find((entry) => Math.abs(entry.thicknessMm - coreLayer.thicknessMm) <= 0.6);

  if (!exactPoint) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(exactPoint.rw, 32, 40));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official Xella Nederland separatiepanelen guidance moved the prefab AAC thin-plaster lane onto the published ${coreLayer.material.name} corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_separatiepanelen_calibration",
    targetRw
  };
}

function estimateYtongCellenbetonblokTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isYtongCellenbetonblokLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    !isPlasterLikeLayer(leftLayer) ||
    leftLayer.thicknessMm > 6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const officialRwByCore: Record<string, readonly { thicknessMm: number; rw: number }[]> = {
    ytong_cellenbetonblok_g4_600: [
      { thicknessMm: 70, rw: 33 },
      { thicknessMm: 100, rw: 37 },
      { thicknessMm: 150, rw: 43 },
      { thicknessMm: 200, rw: 44 },
      { thicknessMm: 240, rw: 48 },
      { thicknessMm: 300, rw: 49 }
    ],
    ytong_cellenbetonblok_g5_800: [{ thicknessMm: 100, rw: 39 }]
  };

  const points = officialRwByCore[coreLayer.material.id];
  if (!points?.length) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw =
    points.length === 1
      ? points[0]!.rw
      : interpolateRwSeries(coreLayer.thicknessMm, points);
  const roundedTargetRw = ksRound1(clamp(targetRw, 32, 50));
  const shiftDb = ksRound1(roundedTargetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: roundedTargetRw
    };
  }

  notes.push(
    `Official Xella Nederland cellenbetonblokken guidance moved the AAC block thin-plaster lane onto the published ${coreLayer.material.name} corridor (target Rw ${roundedTargetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "ytong_cellenbetonblokken_calibration",
    targetRw: roundedTargetRw
  };
}

function estimateCelconFinishedAircreteTargetRw(
  layers: readonly ResolvedLayer[],
  topology: ReturnType<typeof summarizeAirborneTopology>,
  currentRw: number,
  family: DynamicAirborneFamily
): {
  notes: string[];
  shiftDb: number;
  strategySuffix: string | null;
  targetRw: number | null;
} {
  const notes: string[] = [];

  if (
    family !== "masonry_nonhomogeneous" ||
    topology.visibleLeafCount > 1 ||
    topology.cavityCount > 0 ||
    topology.hasStudLikeSupport
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const solidLayers = layers.filter((layer) => classifyLayerRole(layer).isSolidLeaf);
  if (solidLayers.length !== 3) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const [leftLayer, coreLayer, rightLayer] = solidLayers;
  if (!leftLayer || !coreLayer || !rightLayer) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  if (
    !isCelconAircreteLayer(coreLayer) ||
    leftLayer.material.id !== rightLayer.material.id ||
    Math.abs(leftLayer.thicknessMm - rightLayer.thicknessMm) > 0.6 ||
    Math.abs(leftLayer.thicknessMm - 13) > 0.6
  ) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const finishMaterialId = leftLayer.material.id;
  const finishLabel =
    finishMaterialId === "celcon_lwt_plaster"
      ? "13 mm lightweight plaster"
      : finishMaterialId === "celcon_dense_plaster"
        ? "13 mm dense plaster"
        : null;

  const officialRwByFinish: Record<string, Record<string, readonly { thicknessMm: number; rw: number }[]>> = {
    celcon_lwt_plaster: {
      celcon_solar_grade: [
        { thicknessMm: 75, rw: 38.2 },
        { thicknessMm: 100, rw: 40.6 },
        { thicknessMm: 140, rw: 43.8 },
        { thicknessMm: 150, rw: 44.4 },
        { thicknessMm: 215, rw: 48.0 },
        { thicknessMm: 275, rw: 50.6 },
        { thicknessMm: 300, rw: 51.6 },
        { thicknessMm: 355, rw: 53.4 }
      ],
      celcon_standard_grade: [
        { thicknessMm: 75, rw: 40.0 },
        { thicknessMm: 100, rw: 42.6 },
        { thicknessMm: 140, rw: 45.8 },
        { thicknessMm: 150, rw: 46.5 },
        { thicknessMm: 215, rw: 50.3 },
        { thicknessMm: 275, rw: 52.9 },
        { thicknessMm: 300, rw: 53.9 },
        { thicknessMm: 355, rw: 55.7 }
      ],
      celcon_high_strength: [
        { thicknessMm: 75, rw: 41.4 },
        { thicknessMm: 100, rw: 44.1 },
        { thicknessMm: 140, rw: 47.5 },
        { thicknessMm: 150, rw: 48.2 },
        { thicknessMm: 215, rw: 52.0 },
        { thicknessMm: 275, rw: 54.7 },
        { thicknessMm: 300, rw: 55.7 },
        { thicknessMm: 355, rw: 57.6 }
      ]
    },
    celcon_dense_plaster: {
      celcon_solar_grade: [
        { thicknessMm: 75, rw: 42.6 },
        { thicknessMm: 100, rw: 44.4 },
        { thicknessMm: 140, rw: 46.7 },
        { thicknessMm: 150, rw: 47.3 },
        { thicknessMm: 215, rw: 50.2 },
        { thicknessMm: 275, rw: 52.4 },
        { thicknessMm: 300, rw: 53.2 },
        { thicknessMm: 355, rw: 54.8 }
      ],
      celcon_standard_grade: [
        { thicknessMm: 75, rw: 43.9 },
        { thicknessMm: 100, rw: 45.8 },
        { thicknessMm: 140, rw: 48.4 },
        { thicknessMm: 150, rw: 49.0 },
        { thicknessMm: 215, rw: 52.1 },
        { thicknessMm: 275, rw: 54.4 },
        { thicknessMm: 300, rw: 55.3 },
        { thicknessMm: 355, rw: 56.9 }
      ],
      celcon_high_strength: [
        { thicknessMm: 75, rw: 45.0 },
        { thicknessMm: 100, rw: 47.0 },
        { thicknessMm: 140, rw: 49.7 },
        { thicknessMm: 150, rw: 50.3 },
        { thicknessMm: 215, rw: 53.6 },
        { thicknessMm: 275, rw: 56.0 },
        { thicknessMm: 300, rw: 56.9 },
        { thicknessMm: 355, rw: 58.6 }
      ]
    }
  };

  const points = officialRwByFinish[finishMaterialId]?.[coreLayer.material.id];
  if (!finishLabel || !points?.length) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw: null
    };
  }

  const targetRw = ksRound1(clamp(interpolateRwSeries(coreLayer.thicknessMm, points), 36, 60));
  const shiftDb = ksRound1(targetRw - currentRw);

  if (Math.abs(shiftDb) < 0.2) {
    return {
      notes,
      shiftDb: 0,
      strategySuffix: null,
      targetRw
    };
  }

  notes.push(
    `Official H+H Celcon finished-aircrete guidance moved the ${finishLabel} lane onto the published ${coreLayer.material.name} corridor (target Rw ${targetRw.toFixed(1)} dB).`
  );

  return {
    notes,
    shiftDb,
    strategySuffix: "celcon_finished_aircrete_calibration",
    targetRw
  };
}

function buildNarrowGapContactEquivalentLayers(layers: readonly ResolvedLayer[]): ResolvedLayer[] {
  return layers
    .filter((layer) => !classifyLayerRole(layer).isGap)
    .map((layer) => ({
      ...layer,
      material: { ...layer.material }
    }));
}

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
  const maxTrimDb = boundary.decisionClass === "ambiguous" ? 2 : 1.5;
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
    `An ambiguity hold trimmed ${FAMILY_LABELS[selectedFamily]} against the nearby ${FAMILY_LABELS[boundary.runnerUpFamily]} corridor because the current two-leaf family boundary was ${boundary.decisionClass} (runner-up ${runnerUpMetric.toFixed(1)} dB, ceiling ${boundaryCeiling.toFixed(1)} dB, target ${targetMetric.toFixed(1)} dB, current ${currentMetric.toFixed(1)} dB).`
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
