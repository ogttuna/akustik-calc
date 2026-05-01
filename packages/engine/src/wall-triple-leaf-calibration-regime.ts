import { ksRound1 } from "./math";
import {
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS,
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS,
  type WallTripleLeafSourceCorpusClassification,
  type WallTripleLeafSourceCorpusLane
} from "./wall-triple-leaf-source-corpus";
import { WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ } from "./wall-triple-leaf-frequency-solver";

export type WallTripleLeafCalibrationCorpusRole =
  | "blocked_calibration_candidate"
  | "baseline_negative_boundary_only"
  | "qualitative_only"
  | "solver_context_only"
  | "adjacent_boundary_only"
  | "rejection_only";

export type WallTripleLeafCalibrationCorpusDecision = {
  calibrationExecutableNow: boolean;
  corpusLane: WallTripleLeafSourceCorpusLane;
  holdoutExecutableNow: boolean;
  missingOwners: readonly string[];
  negativeBoundaryProtected: boolean;
  role: WallTripleLeafCalibrationCorpusRole;
  sourceId: string;
};

export type WallTripleLeafCalibrationCorpusEvaluation = {
  blockers: readonly string[];
  calibrationExecutableNow: boolean;
  calibrationRowCount: number;
  decisions: readonly WallTripleLeafCalibrationCorpusDecision[];
  holdoutExecutableNow: boolean;
  holdoutRowCount: number;
  protectedNegativeBoundaryCount: number;
};

export type WallTripleLeafCalibrationPrediction = {
  measuredDipBandHz: number;
  measuredRw: number;
  predictedDipBandHz: number;
  predictedRw: number;
  rowId: string;
  sourceOwned: boolean;
  split: "calibration" | "holdout";
};

export type WallTripleLeafCalibrationAccuracyEvaluation = {
  blockers: readonly string[];
  holdoutRowCount: number;
  maxAbsErrorDb: number | null;
  maxDipBandDistance: number | null;
  meanAbsErrorDb: number | null;
  passed: boolean;
  rowCount: number;
};

export type WallTripleLeafCalibrationGateEvaluation = {
  accuracy: WallTripleLeafCalibrationAccuracyEvaluation;
  blockers: readonly string[];
  corpus: WallTripleLeafCalibrationCorpusEvaluation;
  runtimeEligibleNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectedNextFile;
  sourceOwnedCalibrationPass: false;
};

export const WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE = {
  maxAbsErrorDb: 4,
  maxDipBandDistance: 1,
  maxMeanAbsErrorDb: 2,
  requiredCalibrationRowCount: 2,
  requiredHoldoutRowCount: 1
} as const;

export const WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g_calibration_holdout_regime_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g2_source_curve_digitization_intake",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts",
  selectionStatus:
    "gate_g_defined_calibration_holdout_regime_no_runtime_and_selected_source_curve_digitization_intake",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceOwnedCalibrationPass: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

function getRole(classification: WallTripleLeafSourceCorpusClassification): WallTripleLeafCalibrationCorpusRole {
  switch (classification.corpusLane) {
    case "triple_leaf_calibration_candidate":
      return "blocked_calibration_candidate";
    case "baseline_negative_boundary":
      return "baseline_negative_boundary_only";
    case "qualitative_blocked":
      return "qualitative_only";
    case "solver_model_context":
      return "solver_context_only";
    case "adjacent_negative_boundary":
      return "adjacent_boundary_only";
    case "rejection_only":
      return "rejection_only";
  }
}

function isNegativeBoundaryRole(role: WallTripleLeafCalibrationCorpusRole): boolean {
  return (
    role === "baseline_negative_boundary_only" ||
    role === "adjacent_boundary_only" ||
    role === "rejection_only"
  );
}

export function evaluateWallTripleLeafCalibrationCorpus(
  classifications: readonly WallTripleLeafSourceCorpusClassification[] = [
    ...WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS,
    ...WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS
  ]
): WallTripleLeafCalibrationCorpusEvaluation {
  const decisions = classifications.map((classification): WallTripleLeafCalibrationCorpusDecision => {
    const role = getRole(classification);

    return {
      calibrationExecutableNow: false,
      corpusLane: classification.corpusLane,
      holdoutExecutableNow: false,
      missingOwners: classification.requiredBeforeCalibration,
      negativeBoundaryProtected: isNegativeBoundaryRole(role),
      role,
      sourceId: classification.sourceId
    };
  });
  const calibrationRowCount = decisions.filter((decision) => decision.calibrationExecutableNow).length;
  const holdoutRowCount = decisions.filter((decision) => decision.holdoutExecutableNow).length;
  const protectedNegativeBoundaryCount = decisions.filter((decision) => decision.negativeBoundaryProtected).length;
  const blockers = [
    ...(calibrationRowCount < WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.requiredCalibrationRowCount
      ? ["no_digitized_triple_leaf_source_rows"]
      : []),
    ...(holdoutRowCount < WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.requiredHoldoutRowCount
      ? ["no_source_owned_holdout_rows"]
      : [])
  ];

  return {
    blockers,
    calibrationExecutableNow: blockers.length === 0,
    calibrationRowCount,
    decisions,
    holdoutExecutableNow: holdoutRowCount >= WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.requiredHoldoutRowCount,
    holdoutRowCount,
    protectedNegativeBoundaryCount
  };
}

function nearestBandIndex(frequencyHz: number): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ.length; index += 1) {
    const bandHz = WALL_TRIPLE_LEAF_FREQUENCY_SOLVER_BANDS_HZ[index];
    if (typeof bandHz !== "number") {
      continue;
    }

    const distance = Math.abs(bandHz - frequencyHz);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }

  return bestIndex;
}

export function evaluateWallTripleLeafCalibrationAccuracy(
  predictions: readonly WallTripleLeafCalibrationPrediction[]
): WallTripleLeafCalibrationAccuracyEvaluation {
  const blockers: string[] = [];
  const sourceOwnedRows = predictions.filter((prediction) => prediction.sourceOwned);
  const calibrationRowCount = sourceOwnedRows.filter((prediction) => prediction.split === "calibration").length;
  const holdoutRowCount = sourceOwnedRows.filter((prediction) => prediction.split === "holdout").length;

  if (sourceOwnedRows.length !== predictions.length) {
    blockers.push("all_calibration_rows_must_be_source_owned");
  }

  if (calibrationRowCount < WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.requiredCalibrationRowCount) {
    blockers.push("insufficient_source_owned_calibration_rows");
  }

  if (holdoutRowCount < WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.requiredHoldoutRowCount) {
    blockers.push("insufficient_source_owned_holdout_rows");
  }

  const errors = sourceOwnedRows.map((prediction) => Math.abs(prediction.predictedRw - prediction.measuredRw));
  const dipBandDistances = sourceOwnedRows.map((prediction) =>
    Math.abs(nearestBandIndex(prediction.predictedDipBandHz) - nearestBandIndex(prediction.measuredDipBandHz))
  );
  const meanAbsErrorDb =
    errors.length > 0 ? ksRound1(errors.reduce((sum, value) => sum + value, 0) / errors.length) : null;
  const maxAbsErrorDb = errors.length > 0 ? ksRound1(Math.max(...errors)) : null;
  const maxDipBandDistance = dipBandDistances.length > 0 ? Math.max(...dipBandDistances) : null;

  if (
    typeof meanAbsErrorDb === "number" &&
    meanAbsErrorDb > WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.maxMeanAbsErrorDb
  ) {
    blockers.push("mean_abs_error_exceeds_2_db");
  }

  if (typeof maxAbsErrorDb === "number" && maxAbsErrorDb > WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.maxAbsErrorDb) {
    blockers.push("max_abs_error_exceeds_4_db");
  }

  if (
    typeof maxDipBandDistance === "number" &&
    maxDipBandDistance > WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE.maxDipBandDistance
  ) {
    blockers.push("dip_band_distance_exceeds_one_third_octave_neighbor");
  }

  return {
    blockers,
    holdoutRowCount,
    maxAbsErrorDb,
    maxDipBandDistance,
    meanAbsErrorDb,
    passed: blockers.length === 0,
    rowCount: sourceOwnedRows.length
  };
}

export function evaluateWallTripleLeafCalibrationGate(input?: {
  predictions?: readonly WallTripleLeafCalibrationPrediction[];
}): WallTripleLeafCalibrationGateEvaluation {
  const corpus = evaluateWallTripleLeafCalibrationCorpus();
  const accuracy = evaluateWallTripleLeafCalibrationAccuracy(input?.predictions ?? []);
  const blockers = Array.from(new Set([...corpus.blockers, ...accuracy.blockers]));

  return {
    accuracy,
    blockers,
    corpus,
    runtimeEligibleNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectedNextFile,
    sourceOwnedCalibrationPass: false
  };
}
