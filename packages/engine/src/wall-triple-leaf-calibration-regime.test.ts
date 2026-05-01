import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafCalibrationAccuracy,
  evaluateWallTripleLeafCalibrationCorpus,
  evaluateWallTripleLeafCalibrationGate,
  WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G,
  WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE,
  type WallTripleLeafCalibrationPrediction
} from "./wall-triple-leaf-calibration-regime";
import { solveWallTripleLeafFrequencyBands } from "./wall-triple-leaf-frequency-solver";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G_HANDOFF.md"
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

const PASSING_SOURCE_ROWS: readonly WallTripleLeafCalibrationPrediction[] = [
  {
    measuredDipBandHz: 100,
    measuredRw: 61,
    predictedDipBandHz: 100,
    predictedRw: 60,
    rowId: "calibration_row_a",
    sourceOwned: true,
    split: "calibration"
  },
  {
    measuredDipBandHz: 100,
    measuredRw: 58,
    predictedDipBandHz: 125,
    predictedRw: 56,
    rowId: "calibration_row_b",
    sourceOwned: true,
    split: "calibration"
  },
  {
    measuredDipBandHz: 250,
    measuredRw: 63,
    predictedDipBandHz: 250,
    predictedRw: 64,
    rowId: "holdout_row_a",
    sourceOwned: true,
    split: "holdout"
  }
];

describe("wall triple-leaf calibration regime Gate G", () => {
  it("lands calibration and holdout tolerance no-runtime and selects source curve digitization intake", () => {
    expect(WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g2_source_curve_digitization_intake",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts",
      sourceOwnedCalibrationPass: false,
      workbenchInputBehaviorChange: false
    });
    expect(WALL_TRIPLE_LEAF_CALIBRATION_TOLERANCE).toEqual({
      maxAbsErrorDb: 4,
      maxDipBandDistance: 1,
      maxMeanAbsErrorDb: 2,
      requiredCalibrationRowCount: 2,
      requiredHoldoutRowCount: 1
    });
  });

  it("keeps the current source corpus blocked from calibration and protects negatives", () => {
    const corpus = evaluateWallTripleLeafCalibrationCorpus();
    const nrc2024 = corpus.decisions.find((decision) => decision.sourceId === "nrc_2024_internal_gypsum_double_stud");
    const nrc1998 = corpus.decisions.find((decision) => decision.sourceId === "nrc_1998_gypsum_board_walls_tl_data");
    const ordinaryDoubleLeafNegative = corpus.decisions.find(
      (decision) => decision.sourceId === "negative_ordinary_double_leaf_exact_row"
    );

    expect(corpus.calibrationExecutableNow).toBe(false);
    expect(corpus.holdoutExecutableNow).toBe(false);
    expect(corpus.calibrationRowCount).toBe(0);
    expect(corpus.holdoutRowCount).toBe(0);
    expect(corpus.blockers).toEqual(["no_digitized_triple_leaf_source_rows", "no_source_owned_holdout_rows"]);
    expect(corpus.protectedNegativeBoundaryCount).toBeGreaterThanOrEqual(7);

    expect(nrc2024).toMatchObject({
      calibrationExecutableNow: false,
      corpusLane: "triple_leaf_calibration_candidate",
      holdoutExecutableNow: false,
      role: "blocked_calibration_candidate"
    });
    expect(nrc2024?.missingOwners).toEqual(
      expect.arrayContaining([
        "digitized_one_third_octave_transmission_loss_curve_owner",
        "local_material_mapping",
        "calibration_holdout_tolerance_owner"
      ])
    );

    expect(nrc1998).toMatchObject({
      negativeBoundaryProtected: true,
      role: "baseline_negative_boundary_only"
    });
    expect(ordinaryDoubleLeafNegative).toMatchObject({
      negativeBoundaryProtected: true,
      role: "rejection_only"
    });
  });

  it("passes only when source-owned calibration and holdout rows meet MAE, max-error, and dip-band thresholds", () => {
    const accuracy = evaluateWallTripleLeafCalibrationAccuracy(PASSING_SOURCE_ROWS);

    expect(accuracy).toMatchObject({
      blockers: [],
      holdoutRowCount: 1,
      maxAbsErrorDb: 2,
      maxDipBandDistance: 1,
      meanAbsErrorDb: 1.3,
      passed: true,
      rowCount: 3
    });
  });

  it("fails when rows are not source-owned, holdouts are absent, or the error corridor is missed", () => {
    const accuracy = evaluateWallTripleLeafCalibrationAccuracy([
      {
        measuredDipBandHz: 100,
        measuredRw: 60,
        predictedDipBandHz: 1000,
        predictedRw: 50,
        rowId: "bad_calibration_a",
        sourceOwned: true,
        split: "calibration"
      },
      {
        measuredDipBandHz: 125,
        measuredRw: 59,
        predictedDipBandHz: 1250,
        predictedRw: 53,
        rowId: "bad_calibration_b",
        sourceOwned: true,
        split: "calibration"
      },
      {
        measuredDipBandHz: 250,
        measuredRw: 63,
        predictedDipBandHz: 250,
        predictedRw: 63,
        rowId: "unowned_holdout",
        sourceOwned: false,
        split: "holdout"
      }
    ]);

    expect(accuracy.passed).toBe(false);
    expect(accuracy.blockers).toEqual(
      expect.arrayContaining([
        "all_calibration_rows_must_be_source_owned",
        "insufficient_source_owned_holdout_rows",
        "mean_abs_error_exceeds_2_db",
        "max_abs_error_exceeds_4_db",
        "dip_band_distance_exceeds_one_third_octave_neighbor"
      ])
    );
    expect(accuracy.rowCount).toBe(2);
    expect(accuracy.holdoutRowCount).toBe(0);
  });

  it("keeps runtime blocked even when the Gate F solver can produce a curve", () => {
    const solver = solveWallTripleLeafFrequencyBands({
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK
    });
    const gate = evaluateWallTripleLeafCalibrationGate({
      predictions: PASSING_SOURCE_ROWS
    });
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(solver.calculationBlocked).toBe(false);
    expect(solver.runtimeEligible).toBe(false);
    expect(solver.sourceOwned).toBe(false);
    expect(gate.accuracy.passed).toBe(true);
    expect(gate.runtimeEligibleNow).toBe(false);
    expect(gate.sourceOwnedCalibrationPass).toBe(false);
    expect(gate.blockers).toEqual(["no_digitized_triple_leaf_source_rows", "no_source_owned_holdout_rows"]);
    expect(gate.selectedNextFile).toBe("packages/engine/src/wall-triple-leaf-source-curve-digitization-intake.test.ts");

    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
  });

  it("keeps active docs aligned with Gate G and the selected source curve digitization gate", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_CALIBRATION_REGIME_GATE_G.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G - Calibration and Holdout Tolerance");
    expect(plan).toContain("Gate G2 - Source Curve Digitization Intake");
    expect(plan).toContain("MAE <= 2 dB and max error <= 4 dB");
  });
});
