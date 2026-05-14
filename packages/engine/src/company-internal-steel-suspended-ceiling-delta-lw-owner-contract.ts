import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_delta_lw_owner_contract_landed_selected_airborne_building_prediction_runtime_terms";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION =
  "company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_LABEL =
  "airborne building-prediction runtime terms owner contract";

const DELTA_LW_ONLY_OUTPUTS = ["DeltaLw"] as const satisfies readonly RequestedOutputId[];
const MIXED_LNW_DELTA_LW_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

export type CompanyInternalSteelSuspendedCeilingDeltaLwOwnerRuntimeProbe = {
  basisId: string | null;
  deltaLw: number | null;
  lnW: number | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract = {
  deltaLwOnlyProbe: CompanyInternalSteelSuspendedCeilingDeltaLwOwnerRuntimeProbe;
  exactSourcePrecedenceRemainsFirst: true;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_LANDED_GATE;
  mixedLnWDeltaLwProbe: CompanyInternalSteelSuspendedCeilingDeltaLwOwnerRuntimeProbe;
  newNumericDeltaLwRuntimeMovement: false;
  perOutputDeltaLwMissingInputs: typeof STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS;
  previousMatrixRefreshSelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  previousMatrixRefreshSelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  previousMatrixRefreshSelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  suspendedCeilingFormulaBasis: typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS;
};

function buildProbe(targetOutputs: readonly RequestedOutputId[]): CompanyInternalSteelSuspendedCeilingDeltaLwOwnerRuntimeProbe {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
    surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
    targetOutputs
  });
  const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs
  });

  return {
    basisId: result.impact?.basis ?? surface.formulaBasis,
    deltaLw: typeof result.impact?.DeltaLw === "number" ? result.impact.DeltaLw : null,
    lnW: typeof result.impact?.LnW === "number" ? result.impact.LnW : null,
    missingPhysicalInputs: surface.targetOutputMissingPhysicalInputs.DeltaLw ?? [],
    requestedMetrics: targetOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract():
  CompanyInternalSteelSuspendedCeilingDeltaLwOwnerContract {
  return {
    deltaLwOnlyProbe: buildProbe(DELTA_LW_ONLY_OUTPUTS),
    exactSourcePrecedenceRemainsFirst: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_LANDED_GATE,
    mixedLnWDeltaLwProbe: buildProbe(MIXED_LNW_DELTA_LW_OUTPUTS),
    newNumericDeltaLwRuntimeMovement: false,
    perOutputDeltaLwMissingInputs: STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS,
    previousMatrixRefreshSelectedNextAction:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    previousMatrixRefreshSelectedNextFile:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    previousMatrixRefreshSelectionStatus:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    suspendedCeilingFormulaBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
  };
}
