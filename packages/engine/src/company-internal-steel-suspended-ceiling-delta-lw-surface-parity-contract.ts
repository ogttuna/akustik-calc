import type { ImpactErrorBudget, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  buildSteelFloorFormulaPredictorInputFromSurface
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "company-internal matrix v3 refresh after steel DeltaLw surface parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS = [
  ...COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS,
  "IIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export type CompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParitySnapshot = {
  basis: typeof STEEL_FLOOR_FORMULA_BASIS;
  deltaLw: 22.4;
  deltaLwToleranceDb: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
  lnW: 51.6;
  lnWToleranceDb: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
  referenceFloorType: typeof STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE;
  selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor";
  supportedTargetOutputs: readonly ["Ln,w", "DeltaLw"];
  unsupportedTargetOutputs: readonly ["IIC", "L'nT,50"];
};

export type CompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParityContract = {
  apiSurfaceParityRequired: true;
  cardReportSurfaceParityRequired: true;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE;
  previousRuntimeSelectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  previousRuntimeSelectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  previousRuntimeSelectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS;
  previousRuntimeLandedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE;
  runtimeMovedAtSurfaceParity: false;
  runtimeSnapshot: CompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParitySnapshot;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS;
  visibleSurfaceTargets: readonly [
    "output_cards",
    "corridor_dossier",
    "local_saved_replay",
    "server_snapshot_replay",
    "calculator_api_payload",
    "impact_only_api_payload",
    "markdown_report"
  ];
};

function toleranceFor(
  budgets: readonly ImpactErrorBudget[] | undefined,
  metricId: RequestedOutputId
): number | undefined {
  return budgets?.find((budget) => budget.metricId === metricId)?.toleranceDb;
}

export function buildCompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParityContract():
  CompanyInternalSteelSuspendedCeilingDeltaLwSurfaceParityContract {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS
  });
  const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_TARGET_OUTPUTS
  });
  const impact = result.impact;

  return {
    apiSurfaceParityRequired: true,
    cardReportSurfaceParityRequired: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_LANDED_GATE,
    previousRuntimeLandedGate:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_LANDED_GATE,
    previousRuntimeSelectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    previousRuntimeSelectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    previousRuntimeSelectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_CORRIDOR_SELECTION_STATUS,
    runtimeMovedAtSurfaceParity: false,
    runtimeSnapshot: {
      basis: impact?.basis as typeof STEEL_FLOOR_FORMULA_BASIS,
      deltaLw: impact?.DeltaLw as 22.4,
      deltaLwToleranceDb:
        toleranceFor(impact?.errorBudgets, "DeltaLw") as typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      lnW: impact?.LnW as 51.6,
      lnWToleranceDb:
        toleranceFor(impact?.errorBudgets, "Ln,w") as typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      referenceFloorType:
        impact?.referenceFloorType as typeof STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE,
      selectedLabel: result.dynamicImpactTrace?.selectedLabel as
        "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
      supportedTargetOutputs: result.supportedTargetOutputs as readonly ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: result.unsupportedTargetOutputs as readonly ["IIC", "L'nT,50"]
    },
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_SURFACE_PARITY_SELECTION_STATUS,
    visibleSurfaceTargets: [
      "output_cards",
      "corridor_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]
  };
}
