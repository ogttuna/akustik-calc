import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceCurveDigitizationQc,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS
} from "./wall-triple-leaf-source-curve-digitization-qc";
import { WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ } from "./wall-triple-leaf-source-pack";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2B_HANDOFF.md"
] as const;

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const COMPLETE_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

describe("wall triple-leaf source curve digitization QC Gate G2B", () => {
  it("lands reproducible curve digitization QC no-runtime and selects Gate G3 calibration fit", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g3_calibration_fit_and_negative_boundary_proof",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts",
      sourceOwnedCalibrationPass: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("records fixed-render provenance and locked Figure 4 / Figure 5 axis calibration", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS).toHaveLength(2);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS.map((calibration) => calibration.figureId)).toEqual([
      "figure_4",
      "figure_5"
    ]);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS[0]).toMatchObject({
      axisStatus: "axis_locked",
      plotBoxPx: { bottom: 648, left: 195, right: 716, top: 180 },
      sourcePdfSha256: "e38ef3f18e7c4a0be3f7b2e011587a83c4da071ee69f11c28e217d67be88c1d8",
      yAxis: { maxDb: 90, minDb: 0 }
    });
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS[1]).toMatchObject({
      axisStatus: "axis_locked",
      plotBoxPx: { bottom: 1355, left: 195, right: 716, top: 887 },
      yAxis: { maxDb: 5, minDb: -20 }
    });
    expect(
      WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS.every(
        (calibration) =>
          calibration.renderCommand ===
          "pdftoppm -png -f 4 -l 4 -r 180 tmp/pdfs/nrc-2024-triple-leaf.pdf tmp/pdfs/nrc-2024-page"
      )
    ).toBe(true);
  });

  it("turns every NRC 2024 Figure 4 graph row into a bounded one-third-octave TL vector", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => row.assemblyId)).toEqual([
      "nrc_2024_base_type_c_double_stud",
      "nrc_2024_assembly_a_internal_board",
      "nrc_2024_assembly_b_internal_board",
      "nrc_2024_assembly_c_one_side_insulation",
      "nrc_2024_assembly_d_internal_board"
    ]);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => row.sourceFamilyFitSplit)).toEqual([
      "baseline_only",
      "calibration",
      "calibration",
      "separate_fill_regime_context",
      "holdout"
    ]);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => row.reportedStc)).toEqual([
      64, 64, 60, 57, 65
    ]);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => row.derivedStc)).toEqual([
      64, 64, 60, 57, 65
    ]);
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => row.derivedRw)).toEqual([
      63, 58, 49, 51, 55
    ]);

    for (const row of WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS) {
      expect(row.bandGridHz).toEqual(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ);
      expect(row.figure4TransmissionLossDb).toHaveLength(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ.length);
      expect(row.digitizationStatus).toBe("digitized_qc_passed");
      expect(row.digitizationUncertaintyDb).toBe(2);
      expect(row.materialMapping.localMappingStatus).toBe("source_family_only_after_qc");
      expect(row.runtimeImportReadyNow).toBe(false);
      expect(row.stcCheckDeltaDb).toBe(0);
    }
  });

  it("cross-checks Figure 5 deltas against Figure 4 assembly minus base curves", () => {
    const byAssembly = new Map(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row) => [row.assemblyId, row]));

    expect(byAssembly.get("nrc_2024_assembly_a_internal_board")?.figure5DeltaCrossCheckMaxAbsDb).toBe(0);
    expect(byAssembly.get("nrc_2024_assembly_b_internal_board")?.figure5DeltaCrossCheckMaxAbsDb).toBe(0);
    expect(byAssembly.get("nrc_2024_assembly_c_one_side_insulation")?.figure5DeltaCrossCheckMaxAbsDb).toBe(0);
    expect(byAssembly.get("nrc_2024_assembly_d_internal_board")?.figure5DeltaCrossCheckMaxAbsDb).toBe(0);

    expect(byAssembly.get("nrc_2024_assembly_b_internal_board")?.figure5DeltaDb?.[3]).toBe(-17);
    expect(byAssembly.get("nrc_2024_assembly_c_one_side_insulation")?.figure5DeltaDb?.[18]).toBe(-15);
  });

  it("passes source-curve QC for Gate G3 while keeping runtime blocked", () => {
    const evaluation = evaluateWallTripleLeafSourceCurveDigitizationQc();

    expect(evaluation).toMatchObject({
      acceptedNumericRowCount: 5,
      axisCalibrationPassed: true,
      blockers: [],
      calibrationRowCount: 2,
      holdoutRowCount: 1,
      maxDeltaCrossCheckErrorDb: 0,
      maxStcCheckDeltaDb: 0,
      qcPassed: true,
      runtimeImportReadyNow: false,
      separateFillRegimeRowCount: 1,
      sourceOwnedCurveRowsReadyForGateG3: true
    });
    expect(evaluation.runtimeBlockers).toEqual([
      "gate_g3_solver_fit_not_run",
      "local_material_mapping_not_owned_for_user_stack",
      "paired_engine_web_visible_runtime_tests_not_written"
    ]);
    expect(evaluation.selectedNextFile).toBe("packages/engine/src/wall-triple-leaf-calibration-fit-gate-g3.test.ts");
  });

  it("fails QC if an axis is missing, STC cannot be reconciled, or Figure 5 deltas drift outside uncertainty", () => {
    const badRows = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS.map((row, index) =>
      index === 1
        ? {
            ...row,
            figure5DeltaCrossCheckMaxAbsDb: 3,
            stcCheckDeltaDb: 2
          }
        : row
    );
    const evaluation = evaluateWallTripleLeafSourceCurveDigitizationQc({
      axisCalibrations: [WALL_TRIPLE_LEAF_SOURCE_CURVE_AXIS_CALIBRATIONS[0]],
      rows: badRows
    });

    expect(evaluation.qcPassed).toBe(false);
    expect(evaluation.sourceOwnedCurveRowsReadyForGateG3).toBe(false);
    expect(evaluation.blockers).toEqual(
      expect.arrayContaining([
        "axis_calibration_not_locked",
        "not_all_nrc_2024_rows_have_qc_passed_band_vectors",
        "fewer_than_two_internal_board_calibration_rows_survived_qc",
        "digitized_stc_mismatch_exceeds_1_db",
        "figure_5_delta_cross_check_exceeds_declared_uncertainty"
      ])
    );
  });

  it("keeps the live dynamic calculator on the existing low-confidence screening branch", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
  });

  it("keeps active docs aligned with Gate G2B and the selected Gate G3 calibration fit", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_GATE_G2B.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G2B - Reproducible Curve Digitization QC");
    expect(plan).toContain("Gate G3 - Calibration Fit and Negative-Boundary Proof");
    expect(plan).toContain("Figure 5 deltas against `assemblyTL - baseTL`");
  });
});
