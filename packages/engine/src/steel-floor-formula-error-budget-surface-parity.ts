import type { RequestedOutputId } from "@dynecho/shared";

import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts";

export const GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "gate_ap_steel_floor_formula_error_budget_hostile_input_plan";

export type GateAOSteelFloorFormulaErrorBudgetSurfaceParityContract = {
  readonly budgetMetricIds: readonly ["Ln,w", "DeltaLw"];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly landedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan";
  readonly noBudgetCases: readonly ["exact_source_precedence", "needs_input", "unsafe_topology"];
  readonly paritySurfaces: readonly string[];
  readonly previousLandedGate: "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan";
  readonly requiredPayloadFields: readonly string[];
  readonly runtimeValueMovement: false;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap";
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly tolerance: {
    readonly DeltaLwDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly LnWDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
  };
};

export function buildGateAOSteelFloorFormulaErrorBudgetSurfaceParityContract():
  GateAOSteelFloorFormulaErrorBudgetSurfaceParityContract {
  return {
    budgetMetricIds: ["Ln,w", "DeltaLw"],
    exactMeasuredRowsRemainPrecedence: true,
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    landedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
    noBudgetCases: ["exact_source_precedence", "needs_input", "unsafe_topology"],
    paritySurfaces: [
      "packages/shared/src/domain/impact.ts",
      "packages/engine/src/steel-floor-impact-formula-corridor.ts",
      "packages/engine/src/steel-floor-formula-source-absent-uncertainty.ts",
      "packages/engine/src/impact-support.ts",
      "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
      "apps/web/features/workbench/simple-workbench-output-model.ts",
      "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
      "apps/web/features/workbench/simple-workbench-method-dossier.ts",
      "apps/web/features/workbench/compose-workbench-report.ts",
      "apps/web/features/workbench/steel-floor-formula-error-budget-surface-parity.test.ts",
      "apps/web/app/api/estimate/route.ts",
      "apps/web/app/api/impact-only/route.ts",
      "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AO_HANDOFF.md"
    ],
    previousLandedGate:
      "gate_an_steel_floor_formula_source_absent_uncertainty_and_error_budget_plan",
    requiredPayloadFields: [
      "metricId",
      "estimate",
      "min",
      "max",
      "toleranceDb",
      "totalBudgetDb",
      "terms",
      "origin",
      "notMeasuredEvidence"
    ],
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AO_STEEL_FLOOR_FORMULA_ERROR_BUDGET_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap",
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: ["Ln,w", "DeltaLw"],
    tolerance: {
      DeltaLwDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      LnWDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}
