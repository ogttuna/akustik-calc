import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildGateAHSteelFloorFormulaAccuracyBenchmarkContract,
  buildSteelFloorFormulaAccuracyBenchmarkCases,
  evaluateSteelFloorFormulaAccuracyBenchmarkCase
} from "./steel-floor-formula-accuracy-benchmark";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_GATE_AH_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AH_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AH", () => {
  it("lands the steel-floor formula accuracy benchmark matrix and selects Gate AI residual policy", () => {
    expect(buildGateAHSteelFloorFormulaAccuracyBenchmarkContract()).toMatchObject({
      allResidualsWithinCurrentTolerance: true,
      deltaLwResidualCaseCount: 0,
      exactMeasuredRowsRemainPrecedence: true,
      formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
      landedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
      lnWResidualCaseCount: 3,
      maxAbsoluteLnWResidualDb: 0.6,
      meanAbsoluteLnWResidualDb: 0.4,
      previousLandedGate: "gate_ag_steel_floor_formula_input_surface_acceptance_revalidation_plan",
      residualEvidenceScope: "limited_same_family_lab_holdouts",
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts",
      selectionStatus:
        "gate_ah_steel_floor_formula_accuracy_benchmark_landed_selected_residual_policy_gate_ai",
      sourceAnchorInventory: {
        pliteqSteelJoistHoldoutRows: 3,
        ubiqOpenWebExactAnchorRows: 36
      },
      sourceRowsAreCalibrationEvidenceNotProduct: true,
      toleranceDecision: {
        decision: "keep_current_corridor_until_larger_holdout_set",
        deltaLwToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
        lnWToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
      }
    });
  });

  it("compares only same-family lab holdouts where explicit formula inputs are owned", () => {
    const residuals = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract().benchmarkCases.filter(
      (entry) => entry.residualEligible
    );

    expect(residuals.map((entry) => ({
      actualLnW: entry.actualLnW,
      error: entry.absoluteLnWErrorDb,
      id: entry.id,
      predictedLnW: entry.predictedLnW,
      sourceId: entry.sourceId,
      withinTolerance: entry.withinCurrentLnWTolerance
    }))).toEqual([
      {
        actualLnW: 58,
        error: 0.3,
        id: "gate_ah_pliteq_rst02_vinyl_same_family_holdout",
        predictedLnW: 58.3,
        sourceId: "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
        withinTolerance: true
      },
      {
        actualLnW: 60,
        error: 0.3,
        id: "gate_ah_pliteq_rst12_porcelain_same_family_holdout",
        predictedLnW: 60.3,
        sourceId: "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
        withinTolerance: true
      },
      {
        actualLnW: 57,
        error: 0.6,
        id: "gate_ah_pliteq_rst02_wood_same_family_holdout",
        predictedLnW: 57.6,
        sourceId: "pliteq_steel_joist_250_rst02_wood_lab_2026",
        withinTolerance: true
      }
    ]);
    expect(residuals.every((entry) => entry.predictedImpact?.basis === STEEL_FLOOR_FORMULA_BASIS)).toBe(true);
    expect(residuals.every((entry) => entry.actualDeltaLw === undefined)).toBe(true);
  });

  it("keeps exact source rows as anchors when formula inputs or metric scope are missing", () => {
    const anchors = buildGateAHSteelFloorFormulaAccuracyBenchmarkContract().benchmarkCases.filter(
      (entry) => entry.caseRole === "exact_source_anchor_only"
    );

    expect(anchors).toHaveLength(2);
    expect(anchors.map((entry) => entry.id)).toEqual([
      "ubiq_fl24_open_web_steel_200_16mm_bare_exact_lab_2026_anchor_only",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026_anchor_only"
    ]);
    expect(anchors.every((entry) => entry.predictedImpact === null)).toBe(true);
    expect(anchors[0]?.residualBlockers).toEqual([
      "missing_carrier_spacing",
      "missing_load_basis",
      "missing_resilient_dynamic_stiffness",
      "missing_lower_isolation_support_class",
      "not_upper_resilient_formula_topology"
    ]);
    expect(anchors[1]?.residualBlockers).toEqual([
      "missing_carrier_spacing",
      "missing_load_basis",
      "missing_resilient_dynamic_stiffness",
      "missing_lower_isolation_support_class"
    ]);
  });

  it("keeps the source-absent design reference as a runtime reference, not a measured residual", () => {
    const designReference = buildSteelFloorFormulaAccuracyBenchmarkCases()
      .map(evaluateSteelFloorFormulaAccuracyBenchmarkCase)
      .find((entry) => entry.id === "gate_ah_open_web_steel_formula_design_reference");

    expect(designReference?.actualLnW).toBeUndefined();
    expect(designReference).toMatchObject({
      anchorUsePolicy: "runtime_design_reference",
      caseRole: "source_absent_design_case",
      predictedDeltaLw: 22.4,
      predictedLnW: 55.6,
      residualEligible: false,
      sourceId: null
    });
  });

  it("keeps current docs and runner pointed at Gate AH after landing", () => {
    for (const path of CURRENT_GATE_AH_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);

      expect(content).toContain("gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts"
      );
      expect(content).toContain("gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ah-steel-floor-formula-accuracy-benchmark-contract.test.ts"
    );
  });
});
