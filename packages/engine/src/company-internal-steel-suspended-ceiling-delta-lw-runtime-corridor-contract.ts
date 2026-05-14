import type {
  AcousticInputFieldId,
  ImpactCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurface,
  type SteelFloorFormulaInputSurfaceStatus
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_landed_selected_surface_parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling DeltaLw card/report/API parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS = [
  { floorRole: "floating_screed", materialId: "cement_board", thicknessMm: 18 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 5 },
  ...GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS
] as const satisfies readonly LayerInput[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE = {
  ...GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  loadBasisKgM2: 64,
  resilientLayerDynamicStiffnessMNm3: 35
} as const satisfies SteelFloorFormulaInputSurface;

export type CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeProbe = {
  bareReferenceLnW: number | null;
  basisId: string | null;
  deltaLw: number | null;
  deltaLwToleranceDb: number | null;
  formulaStatus: SteelFloorFormulaInputSurfaceStatus;
  impactSystemType: string | null;
  lnW: number | null;
  lnWToleranceDb: number | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  targetOutputMissingPhysicalInputs: Partial<Record<RequestedOutputId, readonly AcousticInputFieldId[]>>;
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract = {
  astmFieldBuildingAndLowFrequencyStayBlocked: true;
  completeRuntimeProbe: CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeProbe;
  exactSourcePrecedenceRemainsFirst: true;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE;
  missingToppingProbe: CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeProbe;
  missingUpperPackageProbe: CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeProbe;
  newNumericDeltaLwRuntimeMovement: true;
  previousMatrixV2SelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION;
  previousMatrixV2SelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE;
  previousMatrixV2SelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  suspendedCeilingBareReferenceBasis: typeof STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS;
  runtimeFormulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
};

function toleranceFor(
  impact: ImpactCalculation | null | undefined,
  metricId: RequestedOutputId
): number | null {
  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId)?.toleranceDb ?? null;
}

function buildRuntimeProbe(input: {
  layers: readonly LayerInput[];
  requestedMetrics: readonly RequestedOutputId[];
  surface: SteelFloorFormulaInputSurface;
}): CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeProbe {
  const surfaceResult = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: input.layers,
    surface: input.surface,
    targetOutputs: input.requestedMetrics
  });
  const result = calculateAssembly(input.layers, {
    impactPredictorInput: surfaceResult.impactPredictorInput,
    targetOutputs: input.requestedMetrics
  });
  const impact = result.impact;

  return {
    bareReferenceLnW: typeof impact?.bareReferenceLnW === "number" ? impact.bareReferenceLnW : null,
    basisId: impact?.basis ?? surfaceResult.formulaBasis,
    deltaLw: typeof impact?.DeltaLw === "number" ? impact.DeltaLw : null,
    deltaLwToleranceDb: toleranceFor(impact, "DeltaLw"),
    formulaStatus: surfaceResult.status,
    impactSystemType: surfaceResult.impactPredictorInput?.impactSystemType ?? null,
    lnW: typeof impact?.LnW === "number" ? impact.LnW : null,
    lnWToleranceDb: toleranceFor(impact, "Ln,w"),
    missingPhysicalInputs: surfaceResult.missingPhysicalInputs,
    requestedMetrics: input.requestedMetrics,
    supportedTargetOutputs: result.supportedTargetOutputs,
    targetOutputMissingPhysicalInputs: surfaceResult.targetOutputMissingPhysicalInputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract():
  CompanyInternalSteelSuspendedCeilingDeltaLwRuntimeCorridorContract {
  return {
    astmFieldBuildingAndLowFrequencyStayBlocked: true,
    completeRuntimeProbe: buildRuntimeProbe({
      layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
    }),
    exactSourcePrecedenceRemainsFirst: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
    missingToppingProbe: buildRuntimeProbe({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS,
      surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
    }),
    missingUpperPackageProbe: buildRuntimeProbe({
      layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS,
      surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE
    }),
    newNumericDeltaLwRuntimeMovement: true,
    previousMatrixV2SelectedNextAction:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
    previousMatrixV2SelectedNextFile:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
    previousMatrixV2SelectionStatus:
      COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS,
    runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    suspendedCeilingBareReferenceBasis: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS
  };
}
