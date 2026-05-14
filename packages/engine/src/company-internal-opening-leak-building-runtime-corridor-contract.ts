import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS
} from "./company-internal-opening-leak-building-adapter-owner-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS = [
  "R'w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const OPENING = {
  areaM2: 1.8,
  count: 1,
  elementRwDb: 32,
  id: "door-01",
  origin: "catalogued",
  ratingBasis: "rw_single_number",
  sealLeakageClass: "average"
} as const satisfies NonNullable<AirborneContext["openingLeakElements"]>[number];

export const COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  hostWallAreaM2: 12,
  openingLeakFieldBuildingAdapterBoundary: true,
  openingLeakElements: [OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
} as const satisfies AirborneContext;

export const COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT = {
  ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

type CompanyInternalOpeningLeakRuntimeProbe = {
  basisId: string | null;
  computedDnADb: number | null;
  computedDnTADb: number | null;
  computedDnTwDb: number | null;
  computedDnWDb: number | null;
  computedRwDb: number | null;
  computedRwPrimeDb: number | null;
  errorBudgetDb: number | null;
  origin: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warningMatched: boolean;
};

export type CompanyInternalOpeningLeakBuildingRuntimeCorridorContract = {
  buildingRuntimeProbe: CompanyInternalOpeningLeakRuntimeProbe;
  boundaryAbsentProbe: CompanyInternalOpeningLeakRuntimeProbe;
  fieldRuntimeProbe: CompanyInternalOpeningLeakRuntimeProbe;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE;
  labRuntimeProbe: CompanyInternalOpeningLeakRuntimeProbe;
  newNumericFieldBuildingRuntimeMovement: true;
  previousOwnerLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE;
  previousOwnerSelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION;
  previousOwnerSelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE;
  previousOwnerSelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  tolerancePins: {
    building: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB;
    field: typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB;
    labOpening: 6;
  };
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildProbe(input: {
  airborneContext: AirborneContext;
  requestedMetrics: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakRuntimeProbe {
  const result = calculateAssembly(HOST_WALL, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.requestedMetrics
  });

  return {
    basisId: result.airborneBasis?.method ?? null,
    computedDnADb: numberOrNull(result.metrics.estimatedDnADb),
    computedDnTADb: numberOrNull(result.metrics.estimatedDnTADb),
    computedDnTwDb: numberOrNull(result.metrics.estimatedDnTwDb),
    computedDnWDb: numberOrNull(result.metrics.estimatedDnWDb),
    computedRwDb: numberOrNull(result.metrics.estimatedRwDb),
    computedRwPrimeDb: numberOrNull(result.metrics.estimatedRwPrimeDb),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    origin: result.airborneBasis?.origin ?? null,
    requestedMetrics: input.requestedMetrics,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warningMatched: result.warnings.some((warning: string) =>
      /Opening\/leak field\/building runtime corridor active/i.test(warning)
    )
  };
}

export function buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract():
  CompanyInternalOpeningLeakBuildingRuntimeCorridorContract {
  const boundaryAbsentContext: AirborneContext = {
    ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
    openingLeakFieldBuildingAdapterBoundary: undefined
  };

  return {
    boundaryAbsentProbe: buildProbe({
      airborneContext: boundaryAbsentContext,
      requestedMetrics: ["R'w", "DnT,w"]
    }),
    buildingRuntimeProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS
    }),
    fieldRuntimeProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS
    }),
    labRuntimeProbe: buildProbe({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [OPENING]
      },
      requestedMetrics: ["Rw", "STC", "R'w", "DnT,w"]
    }),
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
    newNumericFieldBuildingRuntimeMovement: true,
    previousOwnerLandedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
    previousOwnerSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
    previousOwnerSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
    previousOwnerSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    tolerancePins: {
      building: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
      field: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
      labOpening: 6
    }
  };
}

export function assertCompanyInternalOpeningLeakBuildingRuntimeCorridorContract(
  contract: CompanyInternalOpeningLeakBuildingRuntimeCorridorContract =
    buildCompanyInternalOpeningLeakBuildingRuntimeCorridorContract()
): void {
  if (contract.labRuntimeProbe.basisId !== GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD) {
    throw new Error("Opening/leak lab runtime basis moved while landing the field/building corridor.");
  }

  if (
    contract.fieldRuntimeProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD ||
    contract.fieldRuntimeProbe.computedRwPrimeDb !== 36.4 ||
    contract.fieldRuntimeProbe.computedDnTwDb !== 36.9
  ) {
    throw new Error("Opening/leak field runtime corridor did not promote the expected field values.");
  }

  if (
    contract.buildingRuntimeProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ||
    contract.buildingRuntimeProbe.computedRwPrimeDb !== 31.6 ||
    contract.buildingRuntimeProbe.computedDnTwDb !== 32.1
  ) {
    throw new Error("Opening/leak building runtime corridor did not promote the expected building values.");
  }
}
