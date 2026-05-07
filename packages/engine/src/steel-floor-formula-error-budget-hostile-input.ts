import type { RequestedOutputId } from "@dynecho/shared";

import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aq-steel-floor-formula-error-budget-calibration-readiness-contract.test.ts";

export const GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_ACTION =
  "gate_aq_steel_floor_formula_error_budget_calibration_readiness_plan";

export type GateAPSteelFloorFormulaErrorBudgetHostileInputContract = {
  readonly budgetMetricIds: readonly ["Ln,w", "DeltaLw"];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly fieldOutputBudgetMetricAliasesForbidden: readonly ["L'n,w", "L'nT,w"];
  readonly formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly hostileInputCases: readonly [
    "complete_source_absent_formula",
    "safe_reorder",
    "saved_api_replay",
    "missing_physical_input",
    "duplicate_ambiguous_base_structure",
    "exact_source_precedence",
    "field_output_request"
  ];
  readonly landedGate: "gate_ap_steel_floor_formula_error_budget_hostile_input_plan";
  readonly noBudgetCases: readonly [
    "missing_physical_input",
    "duplicate_ambiguous_base_structure",
    "exact_source_precedence"
  ];
  readonly previousLandedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan";
  readonly runtimeValueMovement: false;
  readonly selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  readonly selectedNextAction: typeof GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_FILE;
  readonly selectionStatus: "gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq";
  readonly stableBudgetCases: readonly [
    "complete_source_absent_formula",
    "safe_reorder",
    "saved_api_replay"
  ];
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly tolerance: {
    readonly DeltaLwDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    readonly LnWDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
  };
};

export function buildGateAPSteelFloorFormulaErrorBudgetHostileInputContract():
  GateAPSteelFloorFormulaErrorBudgetHostileInputContract {
  return {
    budgetMetricIds: ["Ln,w", "DeltaLw"],
    exactMeasuredRowsRemainPrecedence: true,
    fieldOutputBudgetMetricAliasesForbidden: ["L'n,w", "L'nT,w"],
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    hostileInputCases: [
      "complete_source_absent_formula",
      "safe_reorder",
      "saved_api_replay",
      "missing_physical_input",
      "duplicate_ambiguous_base_structure",
      "exact_source_precedence",
      "field_output_request"
    ],
    landedGate: "gate_ap_steel_floor_formula_error_budget_hostile_input_plan",
    noBudgetCases: [
      "missing_physical_input",
      "duplicate_ambiguous_base_structure",
      "exact_source_precedence"
    ],
    previousLandedGate: "gate_ao_steel_floor_formula_error_budget_surface_parity_plan",
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction:
      GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_ACTION,
    selectedNextFile:
      GATE_AP_STEEL_FLOOR_FORMULA_ERROR_BUDGET_HOSTILE_INPUT_SELECTED_NEXT_FILE,
    selectionStatus:
      "gate_ap_error_budget_hostile_input_landed_no_runtime_selected_calibration_readiness_gate_aq",
    stableBudgetCases: [
      "complete_source_absent_formula",
      "safe_reorder",
      "saved_api_replay"
    ],
    targetOutputs: ["Ln,w", "DeltaLw"],
    tolerance: {
      DeltaLwDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      LnWDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}
