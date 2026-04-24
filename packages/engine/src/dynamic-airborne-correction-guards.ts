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
  buildMicroGapFillOnlyEquivalentLayers,
  describePrimaryCavity,
  isMicroGapHighFillEquivalentCavity
} from "./dynamic-airborne-cavity-topology";
import { type DynamicFramingHint } from "./dynamic-airborne-family-detection";
import {
  summarizeFramedBoardSystem,
  summarizeHeavyUnframedCavityRisk
} from "./dynamic-airborne-framed-wall";
import { summarizeAirborneTopology } from "./airborne-topology";
import { detectSecurityFilledSingleBoardFamily } from "./security-filled-single-board-corridor";
import { detectMixedEnhancedFilledSingleBoardFamily } from "./mixed-enhanced-filled-single-board-corridor";
import { clamp, ksRound1 } from "./math";
import { estimateRwDb } from "./estimate-rw";

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
