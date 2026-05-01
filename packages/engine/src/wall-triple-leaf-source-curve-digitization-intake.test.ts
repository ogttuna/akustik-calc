import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  evaluateWallTripleLeafSourceCurveDigitizationIntake,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2,
  WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS,
  type WallTripleLeafSourceCurveDigitizationRow
} from "./wall-triple-leaf-source-curve-digitization-intake";
import { WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ } from "./wall-triple-leaf-source-pack";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-04-30_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_GATE_G2_HANDOFF.md"
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

function makeQcPassedRows(): readonly WallTripleLeafSourceCurveDigitizationRow[] {
  return WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS.map((row, rowIndex) => ({
    ...row,
    derivedRw: row.reportedStc - (rowIndex === 2 ? 1 : 0),
    digitizationStatus: "digitized_qc_passed",
    digitizationUncertaintyDb: 1.5,
    materialMapping: {
      ...row.materialMapping,
      localMappingStatus: "source_family_only_after_qc"
    },
    transmissionLossDb: WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ.map((frequencyHz, bandIndex) =>
      Math.min(86, 18 + bandIndex * 3 + (frequencyHz >= 1000 ? 4 : 0))
    )
  }));
}

describe("wall triple-leaf source curve digitization intake Gate G2", () => {
  it("lands source-curve intake no-runtime and selects reproducible digitization QC", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2).toMatchObject({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      numericRuntimeBehaviorChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_g2b_reproducible_curve_digitization_qc",
      selectedNextFile: "packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts",
      sourceOwnedCalibrationPass: false,
      workbenchInputBehaviorChange: false
    });
  });

  it("pins the NRC 2024 Figure 4 and Figure 5 graph rows without pretending they are numeric source data", () => {
    expect(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS.map((row) => `${row.assemblyId}:${row.reportedStc}`)).toEqual([
      "nrc_2024_base_type_c_double_stud:64",
      "nrc_2024_assembly_a_internal_board:64",
      "nrc_2024_assembly_b_internal_board:60",
      "nrc_2024_assembly_c_one_side_insulation:57",
      "nrc_2024_assembly_d_internal_board:65"
    ]);

    for (const row of WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS) {
      expect(row.sourceId).toBe("nrc_2024_internal_gypsum_double_stud");
      expect(row.figureId).toBe("figure_4");
      expect(row.bandGridHz).toEqual(WALL_TRIPLE_LEAF_BAND_GRID_50_TO_5000_HZ);
      expect(row.digitizationStatus).toBe("pending_reproducible_graph_digitization");
      expect(row.transmissionLossDb).toBeNull();
      expect(row.derivedRw).toBeNull();
      expect(row.digitizationUncertaintyDb).toBeNull();
      expect(row.runtimeImportReadyNow).toBe(false);
      expect(row.sourceLocator).toContain("Figure 4 absolute TL curves");
    }
  });

  it("requires Figure 5 delta cross-checks for every internal-board row", () => {
    const internalBoardRows = WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS.filter(
      (row) => row.calibrationRole !== "baseline_only"
    );

    expect(internalBoardRows).toHaveLength(4);
    expect(internalBoardRows.every((row) => row.deltaCrossCheckFigureId === "figure_5")).toBe(true);
    expect(internalBoardRows.map((row) => row.curveId)).toEqual([
      "assembly_a_stc_64",
      "assembly_b_stc_60",
      "assembly_c_stc_57",
      "assembly_d_stc_65"
    ]);
  });

  it("keeps topology and material mapping explicit before any source-family calibration", () => {
    const byAssembly = new Map(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS.map((row) => [row.assemblyId, row]));

    expect(byAssembly.get("nrc_2024_base_type_c_double_stud")?.topology.internalLeaf).toBe("none");
    expect(byAssembly.get("nrc_2024_assembly_a_internal_board")?.topology.internalLeaf).toContain("one 12.7 mm Type C");
    expect(byAssembly.get("nrc_2024_assembly_c_one_side_insulation")?.calibrationRole).toBe(
      "separate_fill_regime_candidate_after_qc"
    );
    expect(byAssembly.get("nrc_2024_assembly_c_one_side_insulation")?.topology.cavity1).toContain(
      "without glass-fiber batt"
    );

    for (const row of WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_ROWS) {
      expect(row.materialMapping.localMappingStatus).toBe("blocked_until_qc_and_material_map");
      expect(row.materialMapping.sourceMaterials).toEqual(
        expect.arrayContaining([
          "12.7 mm Type C gypsum board, 9.80 kg/m2",
          "92.1 mm glass-fiber batt where present"
        ])
      );
      expect(row.materialMapping.missingLocalMaterials).toEqual(
        expect.arrayContaining([
          "local glass-fiber to rockwool mapping",
          "local MLV mapping absent from NRC source family",
          "local gypsum plaster mapping absent from NRC source family"
        ])
      );
    }
  });

  it("blocks calibration/runtime until per-band TL vectors, derived Rw, uncertainty, and local mapping are owned", () => {
    const evaluation = evaluateWallTripleLeafSourceCurveDigitizationIntake();

    expect(evaluation).toMatchObject({
      acceptedNumericRowCount: 0,
      candidateInternalBoardRowCount: 4,
      graphRowCount: 5,
      holdoutExecutableNow: false,
      qcPassed: false,
      runtimeImportReadyNow: false
    });
    expect(evaluation.blockers).toEqual([
      "no_nrc_2024_graph_row_has_digitized_band_vector",
      "insufficient_internal_board_rows_for_fit",
      "no_source_owned_holdout_split",
      "local_material_mapping_not_owned_for_user_stack"
    ]);
    expect(evaluation.selectedNextFile).toBe("packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.test.ts");
  });

  it("still refuses runtime movement even with synthetic QC-passed rows because Gate G2 is intake-only", () => {
    const evaluation = evaluateWallTripleLeafSourceCurveDigitizationIntake(makeQcPassedRows());
    const liveResult = calculateAssembly(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(evaluation.acceptedNumericRowCount).toBe(5);
    expect(evaluation.blockers).toEqual([]);
    expect(evaluation.qcPassed).toBe(false);
    expect(evaluation.runtimeImportReadyNow).toBe(false);
    expect(liveResult.metrics.estimatedRwDb).toBe(41);
    expect(liveResult.dynamicAirborneTrace?.strategy).toBe("multileaf_screening_blend");
  });

  it("keeps active docs aligned with Gate G2 and the selected reproducible digitization QC gate", () => {
    for (const relativePath of REQUIRED_DOCS) {
      const absolutePath = join(REPO_ROOT, relativePath);
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true);
      const contents = readFileSync(absolutePath, "utf8");
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectionStatus);
      expect(contents).toContain(WALL_TRIPLE_LEAF_SOURCE_CURVE_DIGITIZATION_GATE_G2.selectedNextFile);
    }

    const plan = readFileSync(join(REPO_ROOT, "docs/calculator/SLICE_WALL_TRIPLE_LEAF_ACCURACY_RECOVERY_PLAN.md"), "utf8");
    expect(plan).toContain("Gate G2 - Source Curve Digitization Intake");
    expect(plan).toContain("Gate G2B - Reproducible Curve Digitization QC");
    expect(plan).toContain("Figure 5 deltas against `assemblyTL - baseTL`");
  });
});
