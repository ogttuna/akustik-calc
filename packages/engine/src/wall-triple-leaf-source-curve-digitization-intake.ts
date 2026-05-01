import { WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ } from "./wall-triple-leaf-source-pack";

export type WallTripleLeafSourceCurveDigitizationStatus =
  | "pending_reproducible_graph_digitization"
  | "digitized_qc_passed"
  | "rejected_graph_quality_or_identity";

export type WallTripleLeafSourceCurveCalibrationRole =
  | "baseline_only"
  | "candidate_calibration_or_holdout_after_qc"
  | "separate_fill_regime_candidate_after_qc";

export type WallTripleLeafSourceCurveTopology = {
  cavity1: string;
  cavity2: string;
  internalLeaf: string;
  internalLeafCoupling: string;
  sourceShortCode: string;
  supportTopology: string;
};

export type WallTripleLeafSourceCurveMaterialMapping = {
  localMappingStatus: "blocked_until_qc_and_material_map" | "source_family_only_after_qc";
  missingLocalMaterials: readonly string[];
  sourceMaterials: readonly string[];
};

export type WallTripleLeafSourceCurveDigitizationRow = {
  assemblyId:
    | "nrc_2024_base_type_c_double_stud"
    | "nrc_2024_assembly_a_internal_board"
    | "nrc_2024_assembly_b_internal_board"
    | "nrc_2024_assembly_c_one_side_insulation"
    | "nrc_2024_assembly_d_internal_board";
  bandGridHz: readonly number[];
  calibrationRole: WallTripleLeafSourceCurveCalibrationRole;
  curveId: string;
  deltaCrossCheckFigureId: "figure_5" | null;
  derivedRw: number | null;
  digitizationStatus: WallTripleLeafSourceCurveDigitizationStatus;
  digitizationUncertaintyDb: number | null;
  figureId: "figure_4";
  materialMapping: WallTripleLeafSourceCurveMaterialMapping;
  reportedStc: number;
  runtimeImportReadyNow: false;
  sourceId: "nrc_2024_internal_gypsum_double_stud";
  sourceLocator: string;
  topology: WallTripleLeafSourceCurveTopology;
  transmissionLossDb: readonly number[] | null;
};

export type WallTripleLeafSourceCurveDigitizationEvaluation = {
  acceptedNumericRowCount: number;
  blockers: readonly string[];
  candidateInternalBoardRowCount: number;
  graphRowCount: number;
  holdoutExecutableNow: false;
  qcPassed: false;
  runtimeImportReadyNow: false;
  selectedNextAction: typeof WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectedNextAction;
  selectedNextFile: typeof WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectedNextFile;
};

export const WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2 = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_g2_source_curve_digitization_intake_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportReadyNow: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_g2b_reproducible_curve_digitization_qc",
  selectedNextFile: "packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts",
  selectionStatus:
    "gate_g2_landed_source_curve_digitization_intake_no_runtime_and_selected_reproducible_digitization_qc",
  sliceId: "wall_triple_leaf_accuracy_recovery_v1",
  sourceOwnedCalibrationPass: false,
  supportPromotion: false,
  workbenchInputBehaviorChange: false
} as const;

const COMMON_SOURCE_MATERIALS = [
  "12.7 mm Type C gypsum board, 9.80 kg/m2",
  "18 gauge 92.1 mm steel studs at 610 mm centers",
  "92.1 mm glass-fiber batt where present",
  "25.4 mm spacing between internal gypsum board and adjacent stud row"
] as const;

const MISSING_LOCAL_MATERIALS = [
  "local Type C gypsum board mapping",
  "local glass-fiber to rockwool mapping",
  "local MLV mapping absent from NRC source family",
  "local gypsum plaster mapping absent from NRC source family"
] as const;

function materialMapping(): WallTripleLeafSourceCurveMaterialMapping {
  return {
    localMappingStatus: "blocked_until_qc_and_material_map",
    missingLocalMaterials: MISSING_LOCAL_MATERIALS,
    sourceMaterials: COMMON_SOURCE_MATERIALS
  };
}

function topology(input: {
  cavity1: string;
  cavity2: string;
  internalLeaf: string;
  internalLeafCoupling?: string;
  sourceShortCode: string;
}): WallTripleLeafSourceCurveTopology {
  return {
    cavity1: input.cavity1,
    cavity2: input.cavity2,
    internalLeaf: input.internalLeaf,
    internalLeafCoupling:
      input.internalLeafCoupling ??
      "12.7 mm Type C gypsum board installed inside the double-stud cavity; exact local bridge/coupling class still requires source-to-local mapping",
    sourceShortCode: input.sourceShortCode,
    supportTopology: "double 18 gauge 92.1 mm steel studs at 610 mm centers with 25.4 mm gap between stud rows"
  };
}

function pendingRow(
  input: Omit<
    WallTripleLeafSourceCurveDigitizationRow,
    | "bandGridHz"
    | "derivedRw"
    | "digitizationStatus"
    | "digitizationUncertaintyDb"
    | "figureId"
    | "materialMapping"
    | "runtimeImportReadyNow"
    | "sourceId"
    | "sourceLocator"
    | "transmissionLossDb"
  >
): WallTripleLeafSourceCurveDigitizationRow {
  return {
    ...input,
    bandGridHz: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ,
    derivedRw: null,
    digitizationStatus: "pending_reproducible_graph_digitization",
    digitizationUncertaintyDb: null,
    figureId: "figure_4",
    materialMapping: materialMapping(),
    runtimeImportReadyNow: false,
    sourceId: "nrc_2024_internal_gypsum_double_stud",
    sourceLocator:
      "Mahn, Skoda, Cunha 2024, Table 1 assemblies A-D, Figure 4 absolute TL curves, Figure 5 delta curves",
    transmissionLossDb: null
  };
}

export const WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS: readonly WallTripleLeafSourceCurveDigitizationRow[] = [
  pendingRow({
    assemblyId: "nrc_2024_base_type_c_double_stud",
    calibrationRole: "baseline_only",
    curveId: "base_wall_2gc_stc_64",
    deltaCrossCheckFigureId: null,
    reportedStc: 64,
    topology: topology({
      cavity1: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      cavity2: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      internalLeaf: "none",
      internalLeafCoupling: "not_applicable_baseline_double_stud",
      sourceShortCode: "Base Wall - 2GC - STC 64"
    })
  }),
  pendingRow({
    assemblyId: "nrc_2024_assembly_a_internal_board",
    calibrationRole: "candidate_calibration_or_holdout_after_qc",
    curveId: "assembly_a_stc_64",
    deltaCrossCheckFigureId: "figure_5",
    reportedStc: 64,
    topology: topology({
      cavity1: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt plus 25.4 mm air gap to internal board",
      cavity2: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      internalLeaf: "one 12.7 mm Type C gypsum board inside the wall cavity",
      sourceShortCode: "GC12_SS92(610)_GFB92_AIR25_GC12_GFB92_SS92(610)_GC12_GC12"
    })
  }),
  pendingRow({
    assemblyId: "nrc_2024_assembly_b_internal_board",
    calibrationRole: "candidate_calibration_or_holdout_after_qc",
    curveId: "assembly_b_stc_60",
    deltaCrossCheckFigureId: "figure_5",
    reportedStc: 60,
    topology: topology({
      cavity1: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt plus 25.4 mm air gap to internal board",
      cavity2: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      internalLeaf: "one 12.7 mm Type C gypsum board inside the wall cavity",
      sourceShortCode: "GC12_SS92(610)_GFB92_AIR25_GC12_GFB92_SS92(610)_GC12"
    })
  }),
  pendingRow({
    assemblyId: "nrc_2024_assembly_c_one_side_insulation",
    calibrationRole: "separate_fill_regime_candidate_after_qc",
    curveId: "assembly_c_stc_57",
    deltaCrossCheckFigureId: "figure_5",
    reportedStc: 57,
    topology: topology({
      cavity1: "92.1 mm steel-stud cavity without glass-fiber batt on one side of the wall",
      cavity2: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      internalLeaf: "two 12.7 mm Type C gypsum board layers inside the wall cavity",
      sourceShortCode: "GC12_SS92(610)_AIR25_GC12_GC12_GFB92_SS92(610)_GC12"
    })
  }),
  pendingRow({
    assemblyId: "nrc_2024_assembly_d_internal_board",
    calibrationRole: "candidate_calibration_or_holdout_after_qc",
    curveId: "assembly_d_stc_65",
    deltaCrossCheckFigureId: "figure_5",
    reportedStc: 65,
    topology: topology({
      cavity1: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt plus 25.4 mm air gap to internal board",
      cavity2: "92.1 mm steel-stud cavity with 92.1 mm glass-fiber batt",
      internalLeaf: "two 12.7 mm Type C gypsum board layers inside the wall cavity",
      sourceShortCode: "GC12_SS92(610)_GFB92_AIR25_GC12_GC12_GFB92_SS92(610)_GC12"
    })
  })
] as const;

export function evaluateWallTripleLeafSourceCurveDigitizationIntake(
  rows: readonly WallTripleLeafSourceCurveDigitizationRow[] = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS
): WallTripleLeafSourceCurveDigitizationEvaluation {
  const acceptedNumericRows = rows.filter(
    (row) =>
      row.digitizationStatus === "digitized_qc_passed" &&
      Array.isArray(row.transmissionLossDb) &&
      row.transmissionLossDb.length === row.bandGridHz.length &&
      typeof row.derivedRw === "number" &&
      typeof row.digitizationUncertaintyDb === "number"
  );
  const candidateInternalBoardRows = rows.filter((row) => row.calibrationRole !== "baseline_only");
  const hasDeltaCrossCheckRows = candidateInternalBoardRows.every((row) => row.deltaCrossCheckFigureId === "figure_5");
  const blockers = [
    ...(acceptedNumericRows.length < 3 ? ["no_nrc_2024_graph_row_has_digitized_band_vector"] : []),
    ...(!hasDeltaCrossCheckRows ? ["figure_5_delta_cross_check_missing"] : []),
    ...(acceptedNumericRows.length < 3 ? ["insufficient_internal_board_rows_for_fit"] : []),
    ...(acceptedNumericRows.length < 4 ? ["no_source_owned_holdout_split"] : []),
    ...(
      rows.some((row) => row.materialMapping.localMappingStatus !== "source_family_only_after_qc")
        ? ["local_material_mapping_not_owned_for_user_stack"]
        : []
    )
  ];

  return {
    acceptedNumericRowCount: acceptedNumericRows.length,
    blockers,
    candidateInternalBoardRowCount: candidateInternalBoardRows.length,
    graphRowCount: rows.length,
    holdoutExecutableNow: false,
    qcPassed: false,
    runtimeImportReadyNow: false,
    selectedNextAction: WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectedNextAction,
    selectedNextFile: WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectedNextFile
  };
}
