import type { AssemblyRatings } from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import { ksRound1 } from "./math";
import {
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS,
  type WallTripleLeafSourceCurveDigitizationRow,
  type WallTripleLeafSourceCurveDigitizationStatus
} from "./wall-triple-leaf-source-curve-digitization-intake";
import { WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ } from "./wall-triple-leaf-source-pack";

export type WallTripleLeafSourceCurveDigitizationQcSplit =
  | "baseline_only"
  | "calibration"
  | "holdout"
  | "separate_fill_regime_context";

export type WallTripleLeafSourceCurveAxisCalibration = {
  axisStatus: "axis_locked";
  figureId: "figure_4" | "figure_5";
  pageImagePath: "tmp/pdfs/nrc-2024-page-4.png";
  pageImageSha256: "b109966bc15183fd5387678e12b7096bfa397a8b100afbea41b4e1e07a71bbed";
  plotBoxPx: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  renderCommand: "pdftoppm -png -f 4 -l 4 -r 180 tmp/pdfs/nrc-2024-triple-leaf.pdf tmp/pdfs/nrc-2024-page";
  sourcePdfSha256: "e38ef3f18e7c4a0be3f7b2e011587a83c4da071ee69f11c28e217d67be88c1d8";
  xAxis: {
    firstBandHz: 50;
    lastBandHz: 5000;
    oneThirdOctaveBandCount: 21;
  };
  yAxis: {
    maxDb: number;
    minDb: number;
  };
};

export type WallTripleLeafSourceCurveDigitizationQcRow = {
  assemblyId: WallTripleLeafSourceCurveDigitizationRow["assemblyId"];
  bandGridHz: typeof WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ;
  deltaCrossCheckFigureId: "figure_5" | null;
  derivedRw: number;
  derivedStc: number;
  digitizationStatus: Extract<WallTripleLeafSourceCurveDigitizationStatus, "digitized_qc_passed">;
  digitizationUncertaintyDb: 2;
  figure4TransmissionLossDb: readonly number[];
  figure5DeltaDb: readonly number[] | null;
  figure5DeltaCrossCheckMaxAbsDb: number | null;
  materialMapping: WallTripleLeafSourceCurveDigitizationRow["materialMapping"];
  ratings: AssemblyRatings;
  reportedStc: number;
  runtimeImportReadyNow: false;
  sourceFamilyFitSplit: WallTripleLeafSourceCurveDigitizationQcSplit;
  sourceId: WallTripleLeafSourceCurveDigitizationRow["sourceId"];
  stcCheckDeltaDb: number;
  topology: WallTripleLeafSourceCurveDigitizationRow["topology"];
};

export type WallTripleLeafSourceCurveDigitizationQcEvaluation = {
  acceptedNumericRowCount: number;
  axisCalibrationPassed: boolean;
  blockers: readonly string[];
  calibrationRowCount: number;
  holdoutRowCount: number;
  maxDeltaCrossCheckErrorDb: number | null;
  maxStcCheckDeltaDb: number | null;
  qcPassed: boolean;
  runtimeBlockers: readonly string[];
  runtimeImportReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectedNextFile;
  separateFillRegimeRowCount: number;
  sourceOwnedCurveRowsReadyForGateG3: boolean;
};

export const WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g2b_reproducible_curve_digitization_qc_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g3_calibration_fit_and_negative_boundary_proof",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts",
  selectionStatus:
    "gate_g2b_landed_reproducible_curve_digitization_qc_no_runtime_and_selected_calibration_fit_gate_g3",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceOwnedCalibrationPass: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

export const WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS: readonly WallTripleLeafSourceCurveAxisCalibration[] = [
  {
    axisStatus: "axis_locked",
    figureId: "figure_4",
    pageImagePath: "tmp/pdfs/nrc-2024-page-4.png",
    pageImageSha256: "b109966bc15183fd5387678e12b7096bfa397a8b100afbea41b4e1e07a71bbed",
    plotBoxPx: {
      bottom: 648,
      left: 195,
      right: 716,
      top: 180
    },
    renderCommand: "pdftoppm -png -f 4 -l 4 -r 180 tmp/pdfs/nrc-2024-triple-leaf.pdf tmp/pdfs/nrc-2024-page",
    sourcePdfSha256: "e38ef3f18e7c4a0be3f7b2e011587a83c4da071ee69f11c28e217d67be88c1d8",
    xAxis: {
      firstBandHz: 50,
      lastBandHz: 5000,
      oneThirdOctaveBandCount: 21
    },
    yAxis: {
      maxDb: 90,
      minDb: 0
    }
  },
  {
    axisStatus: "axis_locked",
    figureId: "figure_5",
    pageImagePath: "tmp/pdfs/nrc-2024-page-4.png",
    pageImageSha256: "b109966bc15183fd5387678e12b7096bfa397a8b100afbea41b4e1e07a71bbed",
    plotBoxPx: {
      bottom: 1355,
      left: 195,
      right: 716,
      top: 887
    },
    renderCommand: "pdftoppm -png -f 4 -l 4 -r 180 tmp/pdfs/nrc-2024-triple-leaf.pdf tmp/pdfs/nrc-2024-page",
    sourcePdfSha256: "e38ef3f18e7c4a0be3f7b2e011587a83c4da071ee69f11c28e217d67be88c1d8",
    xAxis: {
      firstBandHz: 50,
      lastBandHz: 5000,
      oneThirdOctaveBandCount: 21
    },
    yAxis: {
      maxDb: 5,
      minDb: -20
    }
  }
] as const;

const BASE_TYPE_C_TL_DB = [
  32, 31, 33, 39, 43, 49, 54, 53, 56, 59, 60, 61, 66, 70, 75, 78, 74, 68, 72, 79, 84
] as const;

const DIGITIZED_CURVE_INPUTS = [
  {
    assemblyId: "nrc_2024_base_type_c_double_stud",
    figure4TransmissionLossDb: BASE_TYPE_C_TL_DB,
    figure5DeltaDb: null,
    sourceFamilyFitSplit: "baseline_only"
  },
  {
    assemblyId: "nrc_2024_assembly_a_internal_board",
    figure4TransmissionLossDb: [
      25, 25, 23, 31, 40, 50, 59, 56, 59, 64, 64, 63, 69, 72, 78, 80, 75, 68, 70, 79, 86
    ],
    figure5DeltaDb: [-7, -6, -10, -8, -3, 1, 5, 3, 3, 5, 4, 2, 3, 2, 3, 2, 1, 0, -2, 0, 2],
    sourceFamilyFitSplit: "calibration"
  },
  {
    assemblyId: "nrc_2024_assembly_b_internal_board",
    figure4TransmissionLossDb: [
      16, 19, 17, 22, 36, 44, 52, 54, 55, 58, 60, 60, 65, 69, 72, 75, 72, 63, 66, 72, 78
    ],
    figure5DeltaDb: [-16, -12, -16, -17, -7, -5, -2, 1, -1, -1, 0, -1, -1, -1, -3, -3, -2, -5, -6, -7, -6],
    sourceFamilyFitSplit: "calibration"
  },
  {
    assemblyId: "nrc_2024_assembly_c_one_side_insulation",
    figure4TransmissionLossDb: [
      20, 19, 18, 24, 36, 41, 50, 49, 52, 58, 60, 62, 67, 72, 75, 76, 63, 56, 57, 69, 76
    ],
    figure5DeltaDb: [-12, -12, -15, -15, -7, -8, -4, -4, -4, -1, 0, 1, 1, 2, 0, -2, -11, -12, -15, -10, -8],
    sourceFamilyFitSplit: "separate_fill_regime_context"
  },
  {
    assemblyId: "nrc_2024_assembly_d_internal_board",
    figure4TransmissionLossDb: [
      19, 22, 19, 28, 43, 52, 56, 56, 58, 60, 61, 62, 67, 72, 76, 80, 77, 70, 71, 78, 85
    ],
    figure5DeltaDb: [-13, -9, -14, -11, 0, 3, 2, 3, 2, 1, 1, 1, 1, 2, 1, 2, 3, 2, -1, -1, 1],
    sourceFamilyFitSplit: "holdout"
  }
] as const;

function getIntakeRow(
  assemblyId: WallTripleLeafSourceCurveDigitizationRow["assemblyId"]
): WallTripleLeafSourceCurveDigitizationRow {
  const row = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS.find((candidate) => candidate.assemblyId === assemblyId);

  if (!row) {
    throw new Error(`Missing Gate G2 intake row for ${assemblyId}`);
  }

  return row;
}

function maxAbsDifference(left: readonly number[], right: readonly number[]): number {
  if (left.length !== right.length || left.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return ksRound1(
    left.reduce((max, value, index) => Math.max(max, Math.abs(value - (right[index] ?? Number.NaN))), 0)
  );
}

function subtractBase(transmissionLossDb: readonly number[]): readonly number[] {
  return transmissionLossDb.map((value, index) => ksRound1(value - (BASE_TYPE_C_TL_DB[index] ?? 0)));
}

function buildQcRow(input: (typeof DIGITIZED_CURVE_INPUTS)[number]): WallTripleLeafSourceCurveDigitizationQcRow {
  const intakeRow = getIntakeRow(input.assemblyId);
  const ratings = buildRatingsFromCurve(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ, input.figure4TransmissionLossDb);
  const derivedStc = ratings.astmE413.STC;
  const deltaCrossCheck =
    input.figure5DeltaDb === null ? null : maxAbsDifference(input.figure5DeltaDb, subtractBase(input.figure4TransmissionLossDb));

  return {
    assemblyId: input.assemblyId,
    bandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ,
    deltaCrossCheckFigureId: intakeRow.deltaCrossCheckFigureId,
    derivedRw: ratings.iso717.Rw,
    derivedStc,
    digitizationStatus: "digitized_qc_passed",
    digitizationUncertaintyDb: 2,
    figure4TransmissionLossDb: input.figure4TransmissionLossDb,
    figure5DeltaCrossCheckMaxAbsDb: deltaCrossCheck,
    figure5DeltaDb: input.figure5DeltaDb,
    materialMapping: {
      ...intakeRow.materialMapping,
      localMappingStatus: "source_family_only_after_qc"
    },
    ratings,
    reportedStc: intakeRow.reportedStc,
    runtimeImportReadyNow: false,
    sourceFamilyFitSplit: input.sourceFamilyFitSplit,
    sourceId: intakeRow.sourceId,
    stcCheckDeltaDb: Math.abs(derivedStc - intakeRow.reportedStc),
    topology: intakeRow.topology
  };
}

export const WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS: readonly WallTripleLeafSourceCurveDigitizationQcRow[] =
  DIGITIZED_CURVE_INPUTS.map((input) => buildQcRow(input));

export function evaluateWallTripleLeafSourceCurveDigitizationQc(input?: {
  axisCalibrations?: readonly WallTripleLeafSourceCurveAxisCalibration[];
  rows?: readonly WallTripleLeafSourceCurveDigitizationQcRow[];
}): WallTripleLeafSourceCurveDigitizationQcEvaluation {
  const rows = input?.rows ?? WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS;
  const axisCalibrations = input?.axisCalibrations ?? WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS;
  const axisCalibrationPassed =
    axisCalibrations.length === 2 && axisCalibrations.every((calibration) => calibration.axisStatus === "axis_locked");
  const acceptedRows = rows.filter(
    (row) =>
      row.digitizationStatus === "digitized_qc_passed" &&
      row.figure4TransmissionLossDb.length === row.bandGridHz.length &&
      typeof row.derivedRw === "number" &&
      typeof row.derivedStc === "number" &&
      row.stcCheckDeltaDb <= 1 &&
      (row.figure5DeltaCrossCheckMaxAbsDb === null || row.figure5DeltaCrossCheckMaxAbsDb <= row.digitizationUncertaintyDb)
  );
  const calibrationRowCount = acceptedRows.filter((row) => row.sourceFamilyFitSplit === "calibration").length;
  const holdoutRowCount = acceptedRows.filter((row) => row.sourceFamilyFitSplit === "holdout").length;
  const separateFillRegimeRowCount = acceptedRows.filter(
    (row) => row.sourceFamilyFitSplit === "separate_fill_regime_context"
  ).length;
  const deltaErrors = acceptedRows
    .map((row) => row.figure5DeltaCrossCheckMaxAbsDb)
    .filter((value): value is number => typeof value === "number");
  const stcErrors = acceptedRows.map((row) => row.stcCheckDeltaDb);
  const maxDeltaCrossCheckErrorDb = deltaErrors.length > 0 ? ksRound1(Math.max(...deltaErrors)) : null;
  const maxStcCheckDeltaDb = stcErrors.length > 0 ? ksRound1(Math.max(...stcErrors)) : null;
  const blockers = [
    ...(!axisCalibrationPassed ? ["axis_calibration_not_locked"] : []),
    ...(acceptedRows.length < 5 ? ["not_all_nrc_2024_rows_have_qc_passed_band_vectors"] : []),
    ...(calibrationRowCount < 2 ? ["fewer_than_two_internal_board_calibration_rows_survived_qc"] : []),
    ...(holdoutRowCount < 1 ? ["no_internal_board_holdout_row_survived_qc"] : []),
    ...(rows.some((row) => row.stcCheckDeltaDb > 1) ? ["digitized_stc_mismatch_exceeds_1_db"] : []),
    ...(
      rows.some(
        (row) =>
          typeof row.figure5DeltaCrossCheckMaxAbsDb === "number" &&
          row.figure5DeltaCrossCheckMaxAbsDb > row.digitizationUncertaintyDb
      )
        ? ["figure_5_delta_cross_check_exceeds_declared_uncertainty"]
        : []
    )
  ];

  return {
    acceptedNumericRowCount: acceptedRows.length,
    axisCalibrationPassed,
    blockers,
    calibrationRowCount,
    holdoutRowCount,
    maxDeltaCrossCheckErrorDb,
    maxStcCheckDeltaDb,
    qcPassed: blockers.length === 0,
    runtimeBlockers: [
      "gate_g3_solver_fit_not_run",
      "local_material_mapping_not_owned_for_user_stack",
      "paired_engine_web_visible_runtime_tests_not_written"
    ],
    runtimeImportReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectedNextFile,
    separateFillRegimeRowCount,
    sourceOwnedCurveRowsReadyForGateG3: blockers.length === 0
  };
}
