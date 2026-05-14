import type { ImpactCalculation, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling L'nT,50 low-frequency runtime corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_TARGET_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ONLY_TARGET_OUTPUTS = [
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS = [
  "IIC",
  "AIIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS = [
  "impactFieldContext",
  "receivingRoomVolumeM3",
  "lowFrequencyImpactSpectrumOrCI50_2500Owner",
  "lnt50MetricBasisOwner",
  "lnt50SourceAbsentErrorBudgetOwner"
] as const;

export type CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerInput =
  typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS[number];

export type CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe = {
  basisId: ImpactCalculation["basis"] | null;
  budgetMetricIds: readonly string[];
  deltaLw: number | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  metricBasisLPrimeNT50: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalSteelSuspendedCeilingLowFrequencyExactFieldPacketProbe = {
  basisId: ImpactCalculation["basis"] | null;
  lPrimeNT50: number | null;
  metricBasisLPrimeNT50: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract = {
  allowedOwnerRoutes: readonly [
    "field_volume_plus_ci50_2500",
    "local_guide_lnwci_plus_k_plus_hd",
    "exact_field_band_curve"
  ];
  aliasBoundaryProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  completeFieldProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  exactFieldPacketProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyExactFieldPacketProbe;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE;
  labLnWDeltaLwRuntimeRemainsFrozen: true;
  lnt50OnlyProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  newNumericLnt50RuntimeMovement: false;
  ownerInputs: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS;
  previousMatrixV3LandedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE;
  previousMatrixV3SelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION;
  previousMatrixV3SelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE;
  previousMatrixV3SelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  steelDeltaLwRuntimeBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  steelDeltaLwTolerancePins: {
    deltaLw: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    lnW: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
  };
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function budgetMetricIds(impact: ImpactCalculation | null | undefined): readonly string[] {
  return (impact?.errorBudgets ?? []).map((budget) => budget.metricId);
}

function buildRuntimeProbe(
  targetOutputs: readonly RequestedOutputId[]
): CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs
  });
  const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactFieldContext: { fieldKDb: 3, receivingRoomVolumeM3: 60 },
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs
  });

  return {
    basisId: result.impact?.basis ?? null,
    budgetMetricIds: budgetMetricIds(result.impact),
    deltaLw: numberOrNull(result.impact?.DeltaLw),
    lnW: numberOrNull(result.impact?.LnW),
    lPrimeNT50: numberOrNull(result.impact?.LPrimeNT50),
    lPrimeNTw: numberOrNull(result.impact?.LPrimeNTw),
    lPrimeNW: numberOrNull(result.impact?.LPrimeNW),
    metricBasisLPrimeNT50: result.impact?.metricBasis?.LPrimeNT50 ?? null,
    requestedMetrics: targetOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function buildExactFieldPacketProbe(): CompanyInternalSteelSuspendedCeilingLowFrequencyExactFieldPacketProbe {
  const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
    exactImpactSource: {
      frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      labOrField: "field",
      levelsDb: [63, 62, 61, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46],
      standardMethod: "ISO 16283-2"
    },
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ONLY_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    lPrimeNT50: numberOrNull(result.impact?.LPrimeNT50),
    metricBasisLPrimeNT50: result.impact?.metricBasis?.LPrimeNT50 ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract():
  CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50OwnerContract {
  return {
    allowedOwnerRoutes: [
      "field_volume_plus_ci50_2500",
      "local_guide_lnwci_plus_k_plus_hd",
      "exact_field_band_curve"
    ],
    aliasBoundaryProbe:
      buildRuntimeProbe(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ALIAS_TARGET_OUTPUTS),
    completeFieldProbe:
      buildRuntimeProbe(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_TARGET_OUTPUTS),
    exactFieldPacketProbe: buildExactFieldPacketProbe(),
    labLnWDeltaLwRuntimeRemainsFrozen: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
    lnt50OnlyProbe:
      buildRuntimeProbe(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_ONLY_TARGET_OUTPUTS),
    newNumericLnt50RuntimeMovement: false,
    ownerInputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_INPUTS,
    previousMatrixV3LandedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
    previousMatrixV3SelectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
    previousMatrixV3SelectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
    previousMatrixV3SelectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    steelDeltaLwRuntimeBasis: STEEL_FLOOR_FORMULA_BASIS,
    steelDeltaLwTolerancePins: {
      deltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      lnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
    }
  };
}
