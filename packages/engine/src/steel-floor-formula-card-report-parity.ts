import type { RequestedOutputId } from "@dynecho/shared";

import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export type GateAESteelFloorFormulaCardReportParityContract = {
  cardOutputs: readonly RequestedOutputId[];
  formulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  landedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan";
  paritySurfaces: readonly string[];
  previousLandedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan";
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_af_steel_floor_formula_input_surface_plan";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts";
  selectionStatus: "gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af";
  sourceRowsRequiredForRuntimeSelection: false;
  tolerance: {
    DeltaLwDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    LnWDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
  };
};

export function buildGateAESteelFloorFormulaCardReportParityContract(): GateAESteelFloorFormulaCardReportParityContract {
  return {
    cardOutputs: ["Ln,w", "DeltaLw"],
    formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    landedGate: "gate_ae_steel_floor_formula_card_and_report_parity_plan",
    paritySurfaces: [
      "packages/engine/src/dynamic-impact.ts",
      "packages/engine/src/impact-support.ts",
      "packages/engine/src/impact-validation-regime.ts",
      "apps/web/features/workbench/steel-floor-formula-corridor-view.ts",
      "apps/web/features/workbench/impact-lane-view.ts",
      "apps/web/features/workbench/simple-workbench-output-model.ts",
      "apps/web/features/workbench/simple-workbench-output-posture.ts",
      "apps/web/features/workbench/validation-regime.ts",
      "apps/web/features/workbench/steel-floor-formula-card-report-parity.test.ts",
      "docs/calculator/CHECKPOINT_2026-05-07_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_AE_HANDOFF.md"
    ],
    previousLandedGate: "gate_ad_steel_floor_impact_formula_numeric_corridor_plan",
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_af_steel_floor_formula_input_surface_plan",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-af-steel-floor-formula-input-surface-contract.test.ts",
    selectionStatus: "gate_ae_steel_formula_card_report_parity_landed_selected_input_surface_gate_af",
    sourceRowsRequiredForRuntimeSelection: false,
    tolerance: {
      DeltaLwDb: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      LnWDb: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}
