import type {
  AcousticInputFieldId,
  AirborneContext,
  ImpactCalculation,
  ImpactFieldContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS
} from "./company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract";
import {
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
  FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
} from "./impact-field-adapter-error-budget";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  type SteelFloorFormulaInputSurfaceStatus
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling L'nT,50 card/report/API parity";

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_TARGET_OUTPUTS = [
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS = [
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ALIAS_TARGET_OUTPUTS = [
  "IIC",
  "AIIC",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT = {
  ci50_2500Db: -1,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 60
} as const satisfies AirborneContext;

type CompanyInternalSteelSuspendedCeilingLowFrequencyBudgetPin = {
  estimate: number;
  max: number;
  metricId: string;
  min: number;
  origin: string;
  termIds: readonly string[];
  toleranceDb: number;
  totalBudgetDb: number;
};

export type CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe = {
  basisId: ImpactCalculation["basis"] | null;
  budgetPins: readonly CompanyInternalSteelSuspendedCeilingLowFrequencyBudgetPin[];
  ci50_2500: number | null;
  deltaLw: number | null;
  formulaStatus: SteelFloorFormulaInputSurfaceStatus;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  metricBasisLPrimeNT50: string | null;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
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

export type CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract = {
  aliasBoundaryProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  completeRuntimeProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  dynamicCalculatorRuntimeProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  exactFieldPacketProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyExactFieldPacketProbe;
  landedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE;
  labLnWDeltaLwRuntimeRemainsFrozen: true;
  lnt50OnlyProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  missingLowFrequencyOwnerProbe: CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe;
  newNumericLnt50RuntimeMovement: true;
  previousOwnerLandedGate: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE;
  previousOwnerSelectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION;
  previousOwnerSelectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE;
  previousOwnerSelectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  tolerancePins: {
    deltaLw: typeof STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB;
    lnW: typeof STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB;
    lPrimeNT50: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB;
    lPrimeNTw: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB;
    lPrimeNW: typeof FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB;
  };
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function buildBudgetPins(impact: ImpactCalculation | null | undefined):
  CompanyInternalSteelSuspendedCeilingLowFrequencyBudgetPin[] {
  return (impact?.errorBudgets ?? []).map((budget) => ({
    estimate: budget.estimate,
    max: budget.max,
    metricId: budget.metricId,
    min: budget.min,
    origin: budget.origin,
    termIds: budget.terms.map((term) => term.termId),
    toleranceDb: budget.toleranceDb,
    totalBudgetDb: budget.totalBudgetDb
  }));
}

function buildRuntimeProbe(input: {
  calculator?: "dynamic";
  fieldContext?: ImpactFieldContext | null;
  layers?: readonly LayerInput[];
  requestedMetrics: readonly RequestedOutputId[];
}): CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeProbe {
  const layers = input.layers ?? COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS;
  const surfaceResult = buildSteelFloorFormulaPredictorInputFromSurface({
    layers,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: input.requestedMetrics
  });
  const result = calculateAssembly(layers, {
    ...(input.calculator === "dynamic"
      ? {
          airborneContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_AIRBORNE_FIELD_CONTEXT,
          calculator: "dynamic" as const,
          floorImpactContext: {
            loadBasisKgM2: 64,
            resilientLayerDynamicStiffnessMNm3: 35
          }
        }
      : {}),
    impactFieldContext: input.fieldContext,
    impactPredictorInput: surfaceResult.impactPredictorInput,
    targetOutputs: input.requestedMetrics
  });

  return {
    basisId: result.impact?.basis ?? null,
    budgetPins: buildBudgetPins(result.impact),
    ci50_2500: numberOrNull(result.impact?.CI50_2500),
    deltaLw: numberOrNull(result.impact?.DeltaLw),
    formulaStatus: surfaceResult.status,
    lnW: numberOrNull(result.impact?.LnW),
    lPrimeNT50: numberOrNull(result.impact?.LPrimeNT50),
    lPrimeNTw: numberOrNull(result.impact?.LPrimeNTw),
    lPrimeNW: numberOrNull(result.impact?.LPrimeNW),
    metricBasisLPrimeNT50: result.impact?.metricBasis?.LPrimeNT50 ?? null,
    missingPhysicalInputs: surfaceResult.missingPhysicalInputs,
    requestedMetrics: input.requestedMetrics,
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
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS
  });

  return {
    basisId: result.impact?.basis ?? null,
    lPrimeNT50: numberOrNull(result.impact?.LPrimeNT50),
    metricBasisLPrimeNT50: result.impact?.metricBasis?.LPrimeNT50 ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract():
  CompanyInternalSteelSuspendedCeilingLowFrequencyLnt50RuntimeCorridorContract {
  return {
    aliasBoundaryProbe: buildRuntimeProbe({
      fieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ALIAS_TARGET_OUTPUTS
    }),
    completeRuntimeProbe: buildRuntimeProbe({
      fieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_TARGET_OUTPUTS
    }),
    dynamicCalculatorRuntimeProbe: buildRuntimeProbe({
      calculator: "dynamic",
      fieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS
    }),
    exactFieldPacketProbe: buildExactFieldPacketProbe(),
    labLnWDeltaLwRuntimeRemainsFrozen: true,
    landedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_LANDED_GATE,
    lnt50OnlyProbe: buildRuntimeProbe({
      fieldContext: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_ONLY_TARGET_OUTPUTS
    }),
    missingLowFrequencyOwnerProbe: buildRuntimeProbe({
      fieldContext: {
        fieldKDb: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT.fieldKDb,
        receivingRoomVolumeM3:
          COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_FIELD_CONTEXT.receivingRoomVolumeM3
      },
      requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_TARGET_OUTPUTS
    }),
    newNumericLnt50RuntimeMovement: true,
    previousOwnerLandedGate: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_LANDED_GATE,
    previousOwnerSelectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_ACTION,
    previousOwnerSelectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTED_NEXT_FILE,
    previousOwnerSelectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_OWNER_SELECTION_STATUS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus:
      COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_LOW_FREQUENCY_LNT50_RUNTIME_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    tolerancePins: {
      deltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
      lnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
      lPrimeNT50: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_50_TOLERANCE_DB,
      lPrimeNTw: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NT_W_TOLERANCE_DB,
      lPrimeNW: FLOOR_IMPACT_FIELD_ADAPTER_LPRIME_NW_TOLERANCE_DB
    }
  };
}
