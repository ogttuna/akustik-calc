import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildWallTripleLeafCalibrationFitPredictions,
  evaluateWallTripleLeafCalibrationFit,
  evaluateWallTripleLeafNegativeBoundaries,
  WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3
} from "./wall-triple-leaf-calibration-fit";
import { WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS } from "./wall-triple-leaf-source-corpus";
import { WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS } from "./wall-triple-leaf-source-curve-digitization-qc";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-01_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G3_HANDOFF.md"
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

describe("wall triple-leaf calibration fit Gate G3", () => {
  it("lands source-family calibration fit and negative-boundary proof no-runtime", () => {
    expect(WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g4_local_material_mapping_and_runtime_eligibility_decision",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-local-material-mapping-gate-g4.test.ts",
      sourceOwnedCalibrationPass: true,
      workbenchInputBehaviorChange: false
    });
  });

  it("uses only low-dimensional physical/source-family parameters for the NRC 2024 fit", () => {
    const evaluation = evaluateWallTripleLeafCalibrationFit();

    expect(evaluation.fitParameters).toHaveLength(5);
    expect(evaluation.fitParameters.map((parameter) => `${parameter.id}:${parameter.value}${parameter.unit}`)).toEqual([
      "base_type_c_derived_rw_db:63dB",
      "single_internal_board_full_fill_rw_penalty_db:14dB",
      "receiving_face_second_type_c_board_lift_db:9dB",
      "second_internal_type_c_board_mass_lift_db:6dB",
      "low_frequency_dip_feature_band_hz:100Hz"
    ]);
    expect(evaluation.fitParameters.map((parameter) => parameter.fitUsage)).toEqual([
      "source_baseline_anchor",
      "calibration_row_fit",
      "calibration_row_fit",
      "physical_mass_prior",
      "calibration_dip_feature"
    ]);
    expect(
      evaluation.fitParameters.every((parameter) =>
        parameter.sourceRows.every((sourceRow) => sourceRow.startsWith("nrc_2024_"))
      )
    ).toBe(true);
  });

  it("predicts calibration rows and the holdout row without using the holdout as a fitted parameter", () => {
    const predictions = buildWallTripleLeafCalibrationFitPredictions();

    expect(predictions.map((prediction) => prediction.assemblyId)).toEqual([
      "nrc_2024_assembly_a_internal_board",
      "nrc_2024_assembly_b_internal_board",
      "nrc_2024_assembly_d_internal_board"
    ]);
    expect(predictions.map((prediction) => `${prediction.assemblyId}:${prediction.measuredRw}->${prediction.predictedRw}`)).toEqual([
      "nrc_2024_assembly_a_internal_board:58->58",
      "nrc_2024_assembly_b_internal_board:49->49",
      "nrc_2024_assembly_d_internal_board:55->55"
    ]);
    expect(predictions.map((prediction) => `${prediction.assemblyId}:${prediction.measuredDipBandHz}->${prediction.predictedDipBandHz}`)).toEqual([
      "nrc_2024_assembly_a_internal_board:80->80",
      "nrc_2024_assembly_b_internal_board:100->100",
      "nrc_2024_assembly_d_internal_board:80->80"
    ]);
    expect(predictions.filter((prediction) => prediction.rowUsedForParameterFit).map((prediction) => prediction.assemblyId)).toEqual([
      "nrc_2024_assembly_a_internal_board",
      "nrc_2024_assembly_b_internal_board"
    ]);
    expect(predictions.find((prediction) => prediction.assemblyId === "nrc_2024_assembly_d_internal_board")?.split).toBe(
      "holdout"
    );
    expect(predictions.some((prediction) => prediction.assemblyId === "nrc_2024_assembly_c_one_side_insulation")).toBe(
      false
    );
  });

  it("passes Gate G tolerance for calibration, holdout, and combined source-family accuracy while blocking runtime", () => {
    const evaluation = evaluateWallTripleLeafCalibrationFit();

    expect(evaluation).toMatchObject({
      blockers: [],
      qcPassed: true,
      runtimeEligibleNow: false,
      runtimeImportReadyNow: false,
      sourceFamilyCalibrationPass: true,
      sourceFamilyMappingStatus: "nrc_2024_steel_stud_type_c_glass_fiber_family_only"
    });
    expect(evaluation.calibrationAccuracy).toMatchObject({
      blockers: [],
      maxAbsErrorDb: 0,
      maxDipBandDistance: 0,
      meanAbsErrorDb: 0,
      passed: true,
      rowCount: 2
    });
    expect(evaluation.holdoutAccuracy).toMatchObject({
      blockers: [],
      maxAbsErrorDb: 0,
      maxDipBandDistance: 0,
      meanAbsErrorDb: 0,
      passed: true,
      rowCount: 1
    });
    expect(evaluation.combinedGateGAccuracy).toMatchObject({
      blockers: [],
      holdoutRowCount: 1,
      maxAbsErrorDb: 0,
      maxDipBandDistance: 0,
      meanAbsErrorDb: 0,
      passed: true,
      rowCount: 3
    });
    expect(evaluation.runtimeBlockers).toEqual([
      "local_material_mapping_not_owned_for_user_stack",
      "paired_engine_web_visible_runtime_tests_not_written",
      "gate_h_engine_integration_fail_closed_not_landed"
    ]);
    expect(evaluation.localMaterialMappingBlockers).toEqual(
      expect.arrayContaining([
        "local glass-fiber to rockwool mapping",
        "local MLV mapping absent from NRC source family",
        "local gypsum plaster mapping absent from NRC source family"
      ])
    );
  });

  it("protects ordinary double-leaf, simple-stud, lined-masonry, floor, and field-only negatives from the calibrated lane", () => {
    const proof = evaluateWallTripleLeafNegativeBoundaries();

    expect(proof.passed).toBe(true);
    expect(proof.blockers).toEqual([]);
    expect(proof.protectedNegativeBoundaryCount).toBeGreaterThanOrEqual(10);
    expect(proof.protectedReasonCodes).toEqual(
      expect.arrayContaining([
        "ordinary_wall_baseline_without_internal_leaf",
        "lined_masonry_adjacent_boundary_only",
        "ordinary_double_leaf_exact_row_not_triple_leaf",
        "simple_stud_wall_without_internal_leaf",
        "one_side_lining_or_lined_masonry_not_triple_leaf",
        "missing_band_curves_or_exact_topology",
        "floor_or_impact_row_not_wall_airborne",
        "field_only_without_lab_element_curve"
      ])
    );
    expect(proof.protectedSourceIds).toEqual(
      expect.arrayContaining([
        "nrc_1998_gypsum_board_walls_tl_data",
        "warnock_1998_concrete_block_attached_drywall",
        "negative_ordinary_double_leaf_exact_row",
        "negative_simple_stud_without_internal_leaf",
        "negative_lined_masonry_or_one_side_lining",
        "negative_floor_or_impact_row",
        "negative_field_only_without_lab_curve"
      ])
    );
  });

  it("fails closed if the holdout drifts or a required negative boundary is missing", () => {
    const badPredictions = buildWallTripleLeafCalibrationFitPredictions().map((prediction) =>
      prediction.split === "holdout"
        ? {
            ...prediction,
            predictedDipBandHz: 500,
            predictedRw: prediction.predictedRw - 7
          }
        : prediction
    );
    const evaluation = evaluateWallTripleLeafCalibrationFit({
      negativeClassifications: WALL_TRIPLE_LEAF_SOURCE_CORPUS_NEGATIVE_CLASSIFICATIONS.filter(
        (entry) => entry.reasonCode !== "floor_or_impact_row_not_wall_airborne"
      ),
      predictions: badPredictions,
      rows: WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_QC_ROWS
    });

    expect(evaluation.sourceFamilyCalibrationPass).toBe(false);
    expect(evaluation.holdoutAccuracy.passed).toBe(false);
    expect(evaluation.combinedGateGAccuracy.passed).toBe(false);
    expect(evaluation.negativeBoundaryProof.passed).toBe(false);
    expect(evaluation.blockers).toEqual(
      expect.arrayContaining([
        "holdout_max_abs_error_exceeds_4_db",
        "holdout_dip_band_distance_exceeds_one_neighbor",
        "max_abs_error_exceeds_4_db",
        "dip_band_distance_exceeds_one_third_octave_neighbor",
        "negative_boundary_missing_floor_or_impact_row_not_wall_airborne"
      ])
    );
    expect(evaluation.runtimeBlockers).toContain("gate_g3_source_family_calibration_or_holdout_failed");
  });

  it("keeps the live user split-rockwool stack on the existing low-confidence screening branch", () => {
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
  });

  it("keeps active docs aligned with Gate G3 and the selected local material mapping gate", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_CALIBRATION_FIT_GATE_G3.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G3 - Calibration Fit and Negative-Boundary Proof");
    expect(plan).toContain("Gate G4 - Local Material Mapping and Runtime Eligibility Decision");
    expect(plan).toContain("NRC-like source family only");
  });
});
