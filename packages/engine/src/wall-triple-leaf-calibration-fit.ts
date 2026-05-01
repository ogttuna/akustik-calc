import { ksRound1, log10Safe } from "./math";
import {
  evaluateWallTripleLeafCalibrationAccuracy,
  type WallTripleLeafCalibrationAccuracyEvaluation,
  type WallTripleLeafCalibrationPrediction
} from "./wall-triple-leaf-calibration-regime";
import {
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS,
  WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS,
  type WallTripleLeafSourceCorpusClassification,
  type WallTripleLeafSourceCorpusReasonCode
} from "./wall-triple-leaf-source-corpus";
import {
  evaluateWallTripleLeafSourceCurveDigitizationQc,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS,
  type WallTripleLeafSourceCurveDigitizationQcRow
} from "./wall-triple-leaf-source-curve-digitization-qc";

export type WallTripleLeafCalibrationFitParameterId =
  | "base_type_c_derived_rw_db"
  | "single_internal_board_full_fill_rw_penalty_db"
  | "receiving_face_second_type_c_board_lift_db"
  | "second_internal_type_c_board_mass_lift_db"
  | "low_frequency_dip_feature_band_hz";

export type WallTripleLeafCalibrationFitParameter = {
  fitUsage:
    | "source_baseline_anchor"
    | "calibration_row_fit"
    | "physical_mass_prior"
    | "calibration_dip_feature";
  id: WallTripleLeafCalibrationFitParameterId;
  sourceRows: readonly WallTripleLeafSourceCurveDigitizationQcRow["assemblyId"][];
  unit: "dB" | "Hz";
  value: number;
};

export type WallTripleLeafCalibrationFitPrediction = WallTripleLeafCalibrationPrediction & {
  assemblyId: WallTripleLeafSourceCurveDigitizationQcRow["assemblyId"];
  measuredRw: number;
  predictedRw: number;
  rowUsedForParameterFit: boolean;
  sourceFamilyFitSplit: Extract<WallTripleLeafSourceCurveDigitizationQcRow["sourceFamilyFitSplit"], "calibration" | "holdout">;
};

export type WallTripleLeafCalibrationFitSplitEvaluation = {
  blockers: readonly string[];
  maxAbsErrorDb: number | null;
  maxDipBandDistance: number | null;
  meanAbsErrorDb: number | null;
  passed: boolean;
  rowCount: number;
  split: "calibration" | "holdout";
};

export type WallTripleLeafNegativeBoundaryProof = {
  blockers: readonly string[];
  passed: boolean;
  protectedNegativeBoundaryCount: number;
  protectedReasonCodes: readonly WallTripleLeafSourceCorpusReasonCode[];
  protectedSourceIds: readonly string[];
};

export type WallTripleLeafCalibrationFitEvaluation = {
  blockers: readonly string[];
  calibrationAccuracy: WallTripleLeafCalibrationFitSplitEvaluation;
  combinedGateGAccuracy: WallTripleLeafCalibrationAccuracyEvaluation;
  fitParameters: readonly WallTripleLeafCalibrationFitParameter[];
  holdoutAccuracy: WallTripleLeafCalibrationFitSplitEvaluation;
  localMaterialMappingBlockers: readonly string[];
  negativeBoundaryProof: WallTripleLeafNegativeBoundaryProof;
  predictions: readonly WallTripleLeafCalibrationFitPrediction[];
  qcPassed: boolean;
  runtimeBlockers: readonly string[];
  runtimeEligibleNow: false;
  runtimeImportReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectedNextFile;
  sourceFamilyCalibrationPass: boolean;
  sourceFamilyMappingStatus: "nrc_2024_steel_stud_type_c_glass_fiber_family_only";
};

export const WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g3_calibration_fit_and_negative_boundary_proof_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g4_local_material_mapping_and_runtime_eligibility_decision",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts",
  selectionStatus:
    "gate_g3_passed_nrc_2024_source_family_calibration_holdout_and_negative_boundaries_no_runtime_selected_local_mapping_gate_g4",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceOwnedCalibrationPass: true,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_NEGATIVE_REASON_CODES: readonly WallTripleLeafSourceCorpusReasonCode[] = [
  "ordinary_wall_baseline_without_internal_leaf",
  "lined_masonry_adjacent_boundary_only",
  "ordinary_double_leaf_exact_row_not_triple_leaf",
  "simple_stud_wall_without_internal_leaf",
  "one_side_lining_or_lined_masonry_not_triple_leaf",
  "missing_band_curves_or_exact_topology",
  "floor_or_impact_row_not_wall_airborne",
  "field_only_without_lab_element_curve"
] as const;

function getRow(
  rows: readonly WallTripleLeafSourceCurveDigitizationQcRow[],
  assemblyId: WallTripleLeafSourceCurveDigitizationQcRow["assemblyId"]
): WallTripleLeafSourceCurveDigitizationQcRow {
  const row = rows.find((candidate) => candidate.assemblyId === assemblyId);

  if (!row) {
    throw new Error(`Missing Gate G3 source row ${assemblyId}`);
  }

  return row;
}

function countInternalTypeCBoards(row: WallTripleLeafSourceCurveDigitizationQcRow): number {
  if (row.topology.internalLeaf === "none") {
    return 0;
  }

  return row.topology.internalLeaf.startsWith("two ") ? 2 : 1;
}

function countReceivingFaceTypeCBoards(row: WallTripleLeafSourceCurveDigitizationQcRow): number {
  const parts = row.topology.sourceShortCode.split("_");
  const lastStudIndex = parts.findLastIndex((part) => part.startsWith("SS92"));

  if (lastStudIndex < 0) {
    return 0;
  }

  return parts.slice(lastStudIndex + 1).filter((part) => part === "GC12").length;
}

function getMeasuredLowFrequencyDipBandHz(row: WallTripleLeafSourceCurveDigitizationQcRow): number {
  const deltas = row.figure5DeltaDb;

  if (!deltas) {
    return 0;
  }

  let bestIndex = 0;
  let bestValue = Number.POSITIVE_INFINITY;

  for (let index = 0; index < deltas.length; index += 1) {
    const bandHz = row.bandGridHz[index];
    const value = deltas[index];

    if (typeof bandHz !== "number" || bandHz > 250 || typeof value !== "number") {
      continue;
    }

    if (value < bestValue) {
      bestValue = value;
      bestIndex = index;
    }
  }

  return row.bandGridHz[bestIndex] ?? 0;
}

function median(values: readonly number[]): number {
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);

  return sorted[middle] ?? 0;
}

function evaluatePredictionSplit(
  split: "calibration" | "holdout",
  predictions: readonly WallTripleLeafCalibrationFitPrediction[]
): WallTripleLeafCalibrationFitSplitEvaluation {
  const rows = predictions.filter((prediction) => prediction.split === split);
  const errors = rows.map((prediction) => Math.abs(prediction.predictedRw - prediction.measuredRw));
  const dipBandDistances = rows.map((prediction) =>
    Math.abs(prediction.predictedDipBandHz - prediction.measuredDipBandHz)
  );
  const meanAbsErrorDb =
    errors.length > 0 ? ksRound1(errors.reduce((sum, value) => sum + value, 0) / errors.length) : null;
  const maxAbsErrorDb = errors.length > 0 ? ksRound1(Math.max(...errors)) : null;
  const maxDipBandDistance = dipBandDistances.length > 0 ? Math.max(...dipBandDistances) : null;
  const blockers = [
    ...(rows.length === 0 ? [`no_${split}_rows_available_for_gate_g3_fit`] : []),
    ...(typeof meanAbsErrorDb === "number" && meanAbsErrorDb > 2 ? [`${split}_mean_abs_error_exceeds_2_db`] : []),
    ...(typeof maxAbsErrorDb === "number" && maxAbsErrorDb > 4 ? [`${split}_max_abs_error_exceeds_4_db`] : []),
    ...(typeof maxDipBandDistance === "number" && maxDipBandDistance > 80
      ? [`${split}_dip_band_distance_exceeds_one_neighbor`]
      : [])
  ];

  return {
    blockers,
    maxAbsErrorDb,
    maxDipBandDistance,
    meanAbsErrorDb,
    passed: blockers.length === 0,
    rowCount: rows.length,
    split
  };
}

function buildParameters(rows: readonly WallTripleLeafSourceCurveDigitizationQcRow[]): readonly WallTripleLeafCalibrationFitParameter[] {
  const baseline = getRow(rows, "nrc_2024_base_type_c_double_stud");
  const assemblyA = getRow(rows, "nrc_2024_assembly_a_internal_board");
  const assemblyB = getRow(rows, "nrc_2024_assembly_b_internal_board");
  const calibrationDipBands = [assemblyA, assemblyB].map(getMeasuredLowFrequencyDipBandHz);

  return [
    {
      fitUsage: "source_baseline_anchor",
      id: "base_type_c_derived_rw_db",
      sourceRows: [baseline.assemblyId],
      unit: "dB",
      value: baseline.derivedRw
    },
    {
      fitUsage: "calibration_row_fit",
      id: "single_internal_board_full_fill_rw_penalty_db",
      sourceRows: [assemblyB.assemblyId, baseline.assemblyId],
      unit: "dB",
      value: ksRound1(baseline.derivedRw - assemblyB.derivedRw)
    },
    {
      fitUsage: "calibration_row_fit",
      id: "receiving_face_second_type_c_board_lift_db",
      sourceRows: [assemblyA.assemblyId, assemblyB.assemblyId],
      unit: "dB",
      value: ksRound1(assemblyA.derivedRw - assemblyB.derivedRw)
    },
    {
      fitUsage: "physical_mass_prior",
      id: "second_internal_type_c_board_mass_lift_db",
      sourceRows: [],
      unit: "dB",
      value: ksRound1(20 * log10Safe(2))
    },
    {
      fitUsage: "calibration_dip_feature",
      id: "low_frequency_dip_feature_band_hz",
      sourceRows: [assemblyA.assemblyId, assemblyB.assemblyId],
      unit: "Hz",
      value: median(calibrationDipBands)
    }
  ] as const;
}

function parameterValue(
  parameters: readonly WallTripleLeafCalibrationFitParameter[],
  id: WallTripleLeafCalibrationFitParameterId
): number {
  const parameter = parameters.find((candidate) => candidate.id === id);

  if (!parameter) {
    throw new Error(`Missing Gate G3 fit parameter ${id}`);
  }

  return parameter.value;
}

function predictRw(
  row: WallTripleLeafSourceCurveDigitizationQcRow,
  parameters: readonly WallTripleLeafCalibrationFitParameter[]
): number {
  const baseRw = parameterValue(parameters, "base_type_c_derived_rw_db");
  const singleInternalPenaltyDb = parameterValue(parameters, "single_internal_board_full_fill_rw_penalty_db");
  const receivingFaceSecondBoardLiftDb = parameterValue(parameters, "receiving_face_second_type_c_board_lift_db");
  const secondInternalBoardMassLiftDb = parameterValue(parameters, "second_internal_type_c_board_mass_lift_db");
  const internalBoardCount = countInternalTypeCBoards(row);
  const receivingFaceBoardCount = countReceivingFaceTypeCBoards(row);

  return ksRound1(
    baseRw -
      singleInternalPenaltyDb +
      Math.max(0, receivingFaceBoardCount - 1) * receivingFaceSecondBoardLiftDb +
      Math.max(0, internalBoardCount - 1) * secondInternalBoardMassLiftDb
  );
}

function predictDipBandHz(row: WallTripleLeafSourceCurveDigitizationQcRow): number {
  const internalBoardCount = countInternalTypeCBoards(row);
  const receivingFaceBoardCount = countReceivingFaceTypeCBoards(row);

  if (internalBoardCount > 1 || receivingFaceBoardCount > 1) {
    return 80;
  }

  return 100;
}

export function buildWallTripleLeafCalibrationFitPredictions(input?: {
  rows?: readonly WallTripleLeafSourceCurveDigitizationQcRow[];
}): readonly WallTripleLeafCalibrationFitPrediction[] {
  const rows = input?.rows ?? WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS;
  const parameters = buildParameters(rows);

  return rows
    .filter(
      (
        row
      ): row is WallTripleLeafSourceCurveDigitizationQcRow & {
        sourceFamilyFitSplit: "calibration" | "holdout";
      } => row.sourceFamilyFitSplit === "calibration" || row.sourceFamilyFitSplit === "holdout"
    )
    .map((row) => {
      const measuredDipBandHz = getMeasuredLowFrequencyDipBandHz(row);

      return {
        assemblyId: row.assemblyId,
        measuredDipBandHz,
        measuredRw: row.derivedRw,
        predictedDipBandHz: predictDipBandHz(row),
        predictedRw: predictRw(row, parameters),
        rowId: row.assemblyId,
        rowUsedForParameterFit: row.sourceFamilyFitSplit === "calibration",
        sourceFamilyFitSplit: row.sourceFamilyFitSplit,
        sourceOwned: true,
        split: row.sourceFamilyFitSplit
      };
    });
}

export function evaluateWallTripleLeafNegativeBoundaries(input?: {
  classifications?: readonly WallTripleLeafSourceCorpusClassification[];
}): WallTripleLeafNegativeBoundaryProof {
  const classifications = input?.classifications ?? [
    ...WALL_TRIPLE_LEAF_SOURCE_CORPUS_CLASSIFICATIONS,
    ...WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS
  ];
  const protectedClassifications = classifications.filter(
    (classification) => !classification.calibrationLaneEligible && !classification.exactEvidenceEligible
  );
  const protectedReasonCodes = Array.from(
    new Set(protectedClassifications.map((classification) => classification.reasonCode))
  );
  const missingReasonCodes = REQUIRED_NEGATIVE_REASON_CODES.filter((reasonCode) => !protectedReasonCodes.includes(reasonCode));
  const leakedRuntimeOrExactRows = classifications.filter(
    (classification) => classification.directRuntimeReadyNow || classification.exactEvidenceEligible
  );
  const blockers = [
    ...missingReasonCodes.map((reasonCode) => `negative_boundary_missing_${reasonCode}`),
    ...(leakedRuntimeOrExactRows.length > 0 ? ["negative_boundary_row_leaked_into_runtime_or_exact_evidence"] : [])
  ];

  return {
    blockers,
    passed: blockers.length === 0,
    protectedNegativeBoundaryCount: protectedClassifications.length,
    protectedReasonCodes,
    protectedSourceIds: protectedClassifications.map((classification) => classification.sourceId)
  };
}

export function evaluateWallTripleLeafCalibrationFit(input?: {
  negativeClassifications?: readonly WallTripleLeafSourceCorpusClassification[];
  predictions?: readonly WallTripleLeafCalibrationFitPrediction[];
  rows?: readonly WallTripleLeafSourceCurveDigitizationQcRow[];
}): WallTripleLeafCalibrationFitEvaluation {
  const rows = input?.rows ?? WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS;
  const qc = evaluateWallTripleLeafSourceCurveDigitizationQc({ rows });
  const fitParameters = buildParameters(rows);
  const predictions = input?.predictions ?? buildWallTripleLeafCalibrationFitPredictions({ rows });
  const calibrationAccuracy = evaluatePredictionSplit("calibration", predictions);
  const holdoutAccuracy = evaluatePredictionSplit("holdout", predictions);
  const combinedGateGAccuracy = evaluateWallTripleLeafCalibrationAccuracy(predictions);
  const negativeBoundaryProof = evaluateWallTripleLeafNegativeBoundaries({
    classifications: input?.negativeClassifications
  });
  const localMaterialMappingBlockers = Array.from(
    new Set(rows.flatMap((row) => row.materialMapping.missingLocalMaterials))
  );
  const sourceFamilyCalibrationPass =
    qc.qcPassed &&
    calibrationAccuracy.passed &&
    holdoutAccuracy.passed &&
    combinedGateGAccuracy.passed &&
    negativeBoundaryProof.passed;
  const runtimeBlockers = [
    ...(!sourceFamilyCalibrationPass ? ["gate_g3_source_family_calibration_or_holdout_failed"] : []),
    "local_material_mapping_not_owned_for_user_stack",
    "paired_engine_web_visible_runtime_tests_not_written",
    "gate_h_engine_integration_fail_closed_not_landed"
  ];

  return {
    blockers: [
      ...qc.blockers,
      ...calibrationAccuracy.blockers,
      ...holdoutAccuracy.blockers,
      ...combinedGateGAccuracy.blockers,
      ...negativeBoundaryProof.blockers
    ],
    calibrationAccuracy,
    combinedGateGAccuracy,
    fitParameters,
    holdoutAccuracy,
    localMaterialMappingBlockers,
    negativeBoundaryProof,
    predictions,
    qcPassed: qc.qcPassed,
    runtimeBlockers,
    runtimeEligibleNow: false,
    runtimeImportReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectedNextFile,
    sourceFamilyCalibrationPass,
    sourceFamilyMappingStatus: "nrc_2024_steel_stud_type_c_glass_fiber_family_only"
  };
}
