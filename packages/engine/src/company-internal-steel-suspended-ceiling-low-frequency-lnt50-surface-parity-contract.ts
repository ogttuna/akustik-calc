import type {
  ImpactCalculation,
  ImpactErrorBudget,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract";
import {
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
} from "./impact-field-adapter-error-budget";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "company-internal matrix v4 refresh after steel L'nT,50 surface parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

type CompanyInternalSteelSuspendedCeilingLnt50SurfaceParityBudgetPin = {
  estimate: number;
  max: number;
  metricId: string;
  min: number;
  notMeasuredEvidence: boolean;
  origin: string;
  termIds: readonly string[];
  toleranceDb: number;
  totalBudgetDb: number;
};

export type CompanyInternalSteelSuspendedCeilingLnt50SurfaceParitySnapshot = {
  basis: ImpactCalculation["basis"];
  budgetPins: readonly CompanyInternalSteelSuspendedCeilingLnt50SurfaceParityBudgetPin[];
  ci50_2500: -1;
  deltaLw: 22.4;
  fieldKDb: 3;
  lPrimeNT50: 50.8;
  lPrimeNT50MetricBasis: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500";
  lPrimeNTw: 51.8;
  lPrimeNTwMetricBasis: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume";
  lPrimeNW: 54.6;
  lPrimeNWMetricBasis: "estimated_field_lprimenw_from_lnw_plus_k";
  lnW: 51.6;
  receivingRoomVolumeM3: 60;
  referenceFloorType: typeof STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE;
  selectedLabel: "Lightweight-steel suspended-ceiling DeltaLw formula corridor";
  supportFormulaNotes: readonly string[];
  supportedTargetOutputs: readonly ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"];
  unsupportedTargetOutputs: readonly ["IIC", "AIIC"];
};

export type CompanyInternalSteelSuspendedCeilingLnt50SurfaceParityContract = {
  apiSurfaceParityRequired: true;
  cardReportSurfaceParityRequired: true;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE;
  previousRuntimeLandedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE;
  previousRuntimeSelectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  previousRuntimeSelectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  previousRuntimeSelectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS;
  runtimeMovedAtSurfaceParity: false;
  runtimeSnapshot: CompanyInternalSteelSuspendedCeilingLnt50SurfaceParitySnapshot;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS;
  tolerancePins: {
    deltaLw: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    lnW: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    lPrimeNT50: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB;
    lPrimeNTw: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB;
    lPrimeNW: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB;
  };
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

function buildBudgetPins(
  budgets: readonly ImpactErrorBudget[] | undefined
): CompanyInternalSteelSuspendedCeilingLnt50SurfaceParityBudgetPin[] {
  return (budgets ?? []).map((budget) => ({
    estimate: budget.estimate,
    max: budget.max,
    metricId: budget.metricId,
    min: budget.min,
    notMeasuredEvidence: budget.notMeasuredEvidence,
    origin: budget.origin,
    termIds: budget.terms.map((term) => term.termId),
    toleranceDb: budget.toleranceDb,
    totalBudgetDb: budget.totalBudgetDb
  }));
}

function toleranceFor(budgets: readonly ImpactErrorBudget[] | undefined, metricId: RequestedOutputId): number | undefined {
  return budgets?.find((budget) => budget.metricId === metricId)?.toleranceDb;
}

export function buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50SurfaceParityContract():
  CompanyInternalSteelSuspendedCeilingLnt50SurfaceParityContract {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_TARGET_OUTPUTS
  });
  const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactFieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_TARGET_OUTPUTS
  });
  const impact = result.impact;

  return {
    apiSurfaceParityRequired: true,
    cardReportSurfaceParityRequired: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_LANDED_GATE,
    previousRuntimeLandedGate:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
    previousRuntimeSelectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    previousRuntimeSelectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    previousRuntimeSelectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS,
    runtimeMovedAtSurfaceParity: false,
    runtimeSnapshot: {
      basis: impact?.basis ?? STEEL_FLOOR_FORMULA_BASIS,
      budgetPins: buildBudgetPins(impact?.errorBudgets),
      ci50_2500: impact?.CI50_2500 as -1,
      deltaLw: impact?.DeltaLw as 22.4,
      fieldKDb: impact?.fieldEstimateKCorrectionDb as 3,
      lnW: impact?.LnW as 51.6,
      lPrimeNT50: impact?.LPrimeNT50 as 50.8,
      lPrimeNT50MetricBasis:
        impact?.metricBasis?.LPrimeNT50 as "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
      lPrimeNTw: impact?.LPrimeNTw as 51.8,
      lPrimeNTwMetricBasis:
        impact?.metricBasis?.LPrimeNTw as "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
      lPrimeNW: impact?.LPrimeNW as 54.6,
      lPrimeNWMetricBasis:
        impact?.metricBasis?.LPrimeNW as "estimated_field_lprimenw_from_lnw_plus_k",
      receivingRoomVolumeM3:
        COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT.receivingRoomVolumeM3 as 60,
      referenceFloorType:
        impact?.referenceFloorType as typeof STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE,
      selectedLabel: result.dynamicImpactTrace?.selectedLabel as
        "Lightweight-steel suspended-ceiling DeltaLw formula corridor",
      supportFormulaNotes: result.impactSupport?.formulaNotes ?? [],
      supportedTargetOutputs: result.supportedTargetOutputs as readonly ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupportedTargetOutputs: result.unsupportedTargetOutputs as readonly ["IIC", "AIIC"]
    },
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_SURFACE_PARITY_SELECTION_STATUS,
    tolerancePins: {
      deltaLw: toleranceFor(impact?.errorBudgets, "DeltaLw") as typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      lnW: toleranceFor(impact?.errorBudgets, "Ln,w") as typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      lPrimeNT50:
        toleranceFor(impact?.errorBudgets, "L'nT,50") as typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
      lPrimeNTw:
        toleranceFor(impact?.errorBudgets, "L'nT,w") as typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
      lPrimeNW:
        toleranceFor(impact?.errorBudgets, "L'n,w") as typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
    },
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
