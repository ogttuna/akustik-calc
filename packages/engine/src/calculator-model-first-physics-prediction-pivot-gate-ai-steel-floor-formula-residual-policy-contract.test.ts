import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildGateAHSteelFloorFormulaAccuracyBenchmarkContract } from "./steel-floor-formula-accuracy-benchmark";
import {
  buildGateAISteelFloorFormulaResidualPolicyContract,
  evaluateSteelFloorFormulaResidualMetricPolicy
} from "./steel-floor-formula-residual-policy";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_GATE_AI_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AI_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("calculator model-first physics prediction pivot Gate AI", () => {
  it("lands executable residual policy and selects Gate AJ negative-boundary plus DeltaLw intake", () => {
    expect(buildGateAISteelFloorFormulaResidualPolicyContract()).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: "gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan",
      overallDecision: "hold_current_corridor",
      previousLandedGate: "gate_ah_steel_floor_formula_accuracy_benchmark_expansion_plan",
      runtimeRetuneAllowedNow: false,
      runtimeValueMovement: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan",
      selectedNextFile:
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aj-steel-floor-formula-negative-boundary-and-delta-lw-holdout-contract.test.ts",
      selectionStatus:
        "gate_ai_steel_floor_formula_residual_policy_landed_selected_negative_boundary_delta_lw_gate_aj",
      sourceRowsAreCalibrationEvidenceNotProduct: true
    });
  });

  it("holds current steel-floor formula corridor for the Gate AH evidence set", () => {
    const policy = buildGateAISteelFloorFormulaResidualPolicyContract();
    const [lnWPolicy, deltaLwPolicy] = policy.metricPolicies;

    expect(lnWPolicy).toMatchObject({
      currentToleranceDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      decision: "hold",
      maxAbsoluteResidualDb: 0.6,
      meanAbsoluteResidualDb: 0.4,
      metricId: "Ln,w",
      residualCaseCount: 3,
      retuneAllowedNow: false,
      runtimeValueMovement: false,
      threshold: {
        requiredHoldoutCount: 6,
        requiredPairedNegativeBoundaryCount: 4
      }
    });
    expect(lnWPolicy?.blockers).toEqual(
      expect.arrayContaining([
        "holdout_count_below_policy_threshold",
        "paired_negative_boundaries_missing",
        "open_web_formula_inputs_not_source_owned",
        "field_and_building_basis_owners_missing"
      ])
    );

    expect(deltaLwPolicy).toMatchObject({
      currentToleranceDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      decision: "hold",
      maxAbsoluteResidualDb: null,
      meanAbsoluteResidualDb: null,
      metricId: "DeltaLw",
      residualCaseCount: 0,
      retuneAllowedNow: false,
      threshold: {
        requiredHoldoutCount: 3,
        requiredPairedNegativeBoundaryCount: 4
      }
    });
    expect(deltaLwPolicy?.blockers).toEqual(
      expect.arrayContaining([
        "delta_lw_measured_holdouts_missing",
        "source_owned_metric_holdouts_missing",
        "paired_negative_boundaries_missing"
      ])
    );
  });

  it("expresses hold, tighten, widen, and retune-candidate decisions as policy, not ad hoc prose", () => {
    const common = {
      currentToleranceDb: 4,
      fieldAndBuildingBasisOwnersPresent: true,
      metricId: "Ln,w" as const,
      openWebFormulaInputsSourceOwned: true,
      pairedNegativeBoundaryCount: 4,
      requiredHoldoutCount: 6,
      requiredPairedNegativeBoundaryCount: 4,
      sourceOwnedMetricHoldoutsPresent: true
    };

    expect(evaluateSteelFloorFormulaResidualMetricPolicy({
      ...common,
      maxAbsoluteResidualDb: 1.2,
      meanAbsoluteResidualDb: 0.7,
      residualCaseCount: 5,
      sourceOwnedCorrectionAvailable: false
    }).decision).toBe("hold");
    expect(evaluateSteelFloorFormulaResidualMetricPolicy({
      ...common,
      maxAbsoluteResidualDb: 1.2,
      meanAbsoluteResidualDb: 0.7,
      residualCaseCount: 6,
      sourceOwnedCorrectionAvailable: false
    }).decision).toBe("tighten");
    expect(evaluateSteelFloorFormulaResidualMetricPolicy({
      ...common,
      fieldAndBuildingBasisOwnersPresent: false,
      maxAbsoluteResidualDb: 6.5,
      meanAbsoluteResidualDb: 4.2,
      residualCaseCount: 6,
      sourceOwnedCorrectionAvailable: false
    }).decision).toBe("widen");
    expect(evaluateSteelFloorFormulaResidualMetricPolicy({
      ...common,
      maxAbsoluteResidualDb: 6.5,
      meanAbsoluteResidualDb: 4.2,
      residualCaseCount: 6,
      sourceOwnedCorrectionAvailable: true
    }).decision).toBe("retune_candidate");
  });

  it("keeps UBIQ open-web exact rows as anchors until formula-input ownership and negatives exist", () => {
    const policy = buildGateAISteelFloorFormulaResidualPolicyContract();

    expect(policy.openWebAnchorPolicy).toMatchObject({
      anchorRowCount: 36,
      anchorUsePolicy: "calibration_anchor_only_until_formula_inputs_are_source_owned",
      residualPromotionAllowedNow: false
    });
    expect(policy.openWebAnchorPolicy.blockers).toEqual([
      "open_web_formula_inputs_not_source_owned",
      "source_owned_metric_holdouts_missing",
      "paired_negative_boundaries_missing"
    ]);
    expect(buildGateAHSteelFloorFormulaAccuracyBenchmarkContract().sourceAnchorInventory).toEqual({
      pliteqSteelJoistHoldoutRows: 3,
      ubiqOpenWebExactAnchorRows: 36
    });
  });

  it("keeps current docs and runner pointed at Gate AI after landing", () => {
    for (const path of CURRENT_GATE_AI_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);

      expect(content).toContain("gate_ai_steel_floor_formula_residual_policy_and_calibration_readiness_plan");
      expect(content).toContain(
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts"
      );
      expect(content).toContain("gate_aj_steel_floor_formula_negative_boundaries_and_delta_lw_holdout_intake_plan");
    }

    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/calculator-model-first-physics-prediction-pivot-gate-ai-steel-floor-formula-residual-policy-contract.test.ts"
    );
  });
});
