import {
  buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix,
  summarizePersonalUseMvpCoverageSprintGateAA
} from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-af";
import {
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";
import {
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS
} from "./steel-floor-formula-input-surface";
import {
  MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
  TIMBER_JOIST_DELTA_LW_FORMULA_BASIS
} from "./timber-clt-floor-impact-delta-lw-runtime-corridor";
import {
  TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS,
  TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS
} from "./timber-clt-delta-lw-input-surface";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE =
  "gate_ag_personal_use_mvp_floor_formula_surface_polish_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS =
  "gate_ag_personal_use_mvp_floor_formula_surface_polish_landed_selected_opening_leak_stc_spectrum_adapter_gate_ah";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION =
  "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan";

const GATE_AG_FLOOR_POLISH_REQUIRED_ROWS = [
  "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
  "floor.lightweight_steel_formula_missing_spacing.needs_input",
  "floor.heavy_concrete_floating_floor_safe_reorder.lab"
] as const;

export const GATE_AG_FLOOR_FORMULA_SURFACE_POLISH_RUNTIME_PINS = {
  cltDeltaLw: {
    basis: MASS_TIMBER_CLT_DELTA_LW_FORMULA_BASIS,
    DeltaLw: 22.6,
    LnW: 50
  },
  heavyConcreteSafeReorder: {
    basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
    DeltaLw: 32.6,
    LnW: 39.2
  },
  steel: {
    basis: STEEL_FLOOR_FORMULA_BASIS,
    DeltaLw: 22.4,
    LnW: 55.6
  },
  timberDeltaLw: {
    basis: TIMBER_JOIST_DELTA_LW_FORMULA_BASIS,
    DeltaLw: 25.2,
    LnW: 51
  }
} as const;

export type PersonalUseMvpCoverageSprintGateAGSummary = {
  apiShapeChange: false;
  gateAAMatrixRows: 40;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE;
  noRuntimeValueMovement: true;
  polishedFloorFormulaRows: typeof GATE_AG_FLOOR_POLISH_REQUIRED_ROWS;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  steelInputFields: typeof STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS;
  steelInputLabels: typeof STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS;
  timberCltInputFields: typeof TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS;
  timberCltInputLabels: typeof TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS;
  runtimePins: typeof GATE_AG_FLOOR_FORMULA_SURFACE_POLISH_RUNTIME_PINS;
  workbenchPromptCopyChange: true;
};

export function summarizePersonalUseMvpCoverageSprintGateAG(): PersonalUseMvpCoverageSprintGateAGSummary {
  const matrix = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
  const gateAASummary = summarizePersonalUseMvpCoverageSprintGateAA(matrix);
  const rowIds = new Set(matrix.map((row) => row.id));
  const missingRows = GATE_AG_FLOOR_POLISH_REQUIRED_ROWS.filter((rowId) => !rowIds.has(rowId));

  if (gateAASummary.rowCount !== 40) {
    throw new Error(`Personal-use MVP Coverage Sprint Gate AG expected 40 matrix rows, got ${gateAASummary.rowCount}.`);
  }

  if (missingRows.length > 0) {
    throw new Error(`Personal-use MVP Coverage Sprint Gate AG is missing matrix rows: ${missingRows.join(", ")}`);
  }

  return {
    apiShapeChange: false,
    gateAAMatrixRows: 40,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_LANDED_GATE,
    noRuntimeValueMovement: true,
    polishedFloorFormulaRows: GATE_AG_FLOOR_POLISH_REQUIRED_ROWS,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AF_SELECTION_STATUS,
    runtimePins: GATE_AG_FLOOR_FORMULA_SURFACE_POLISH_RUNTIME_PINS,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AG_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    steelInputFields: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
    steelInputLabels: STEEL_FLOOR_FORMULA_INPUT_SURFACE_LABELS,
    timberCltInputFields: TIMBER_CLT_DELTA_LW_INPUT_SURFACE_FIELDS,
    timberCltInputLabels: TIMBER_CLT_DELTA_LW_INPUT_SURFACE_LABELS,
    workbenchPromptCopyChange: true
  };
}
