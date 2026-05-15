import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_landed_selected_surface_parity";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL =
  "opening/leak Dn,A / DnT,A card/report/API parity";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_RUNTIME_TARGET_OUTPUTS = [
  "Dn,A",
  "DnT,A",
  "Dn,w",
  "DnT,w",
  "R'w"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_RUNTIME_TARGET_OUTPUTS = [
  "DnT,A",
  "DnT,w",
  "R'w",
  "Dn,A"
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

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT = {
  ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
} as const satisfies AirborneContext;

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT = {
  ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
} as const satisfies AirborneContext;

type CompanyInternalOpeningLeakAWeightedRuntimeProbe = {
  basisId: string | null;
  computedDnADb: number | null;
  computedDnTADb: number | null;
  computedDnTwDb: number | null;
  computedDnWDb: number | null;
  computedRwDb: number | null;
  computedRwPrimeDb: number | null;
  errorBudgetDb: number | null;
  frequencyBandSet: string | null;
  origin: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  selectedCandidateId: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warningMatched: boolean;
  warningMissingFrequencyBandSetMatched: boolean;
};

export type CompanyInternalOpeningLeakAWeightedRuntimeCorridorContract = {
  adapterBudgetDb: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB;
  adapterDb: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB;
  basisAliasBlocked: {
    astmIicAiic: true;
    buildingDnA: true;
    labRwOrStc: true;
  };
  buildingDnAUnsupportedProbe: CompanyInternalOpeningLeakAWeightedRuntimeProbe;
  buildingRuntimeProbe: CompanyInternalOpeningLeakAWeightedRuntimeProbe;
  exactAWeightedSourceRowsRemainPrecedence: true;
  fieldRuntimeProbe: CompanyInternalOpeningLeakAWeightedRuntimeProbe;
  labAliasProbe: CompanyInternalOpeningLeakAWeightedRuntimeProbe;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE;
  missingFrequencyBandSetProbe: CompanyInternalOpeningLeakAWeightedRuntimeProbe;
  newNumericAWeightedRuntimeMovement: true;
  previousFormulaLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE;
  previousFormulaSelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  previousFormulaSelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  previousFormulaSelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS;
  requiredOwnerInputs: {
    building: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS;
    field: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS;
  };
  requiredPhysicalInputs: {
    building: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS;
    field: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS;
  };
  runtimePromotionAllowedInGate: true;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  tolerancePins: {
    buildingAWeighted: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB;
    fieldAWeighted: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB;
  };
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildProbe(input: {
  airborneContext: AirborneContext;
  requestedMetrics: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakAWeightedRuntimeProbe {
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
    frequencyBandSet: result.airborneBasis?.frequencyBands?.bandSet ?? null,
    origin: result.airborneBasis?.origin ?? null,
    requestedMetrics: input.requestedMetrics,
    selectedCandidateId: result.airborneCandidateResolution?.selectedCandidateId ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warningMatched: result.warnings.some((warning: string) =>
      /Opening\/leak A-weighted runtime corridor active/i.test(warning)
    ),
    warningMissingFrequencyBandSetMatched: result.warnings.some((warning: string) =>
      /frequencyBandSet/i.test(warning)
    )
  };
}

export function buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract():
  CompanyInternalOpeningLeakAWeightedRuntimeCorridorContract {
  return {
    adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
    adapterDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingDnA: true,
      labRwOrStc: true
    },
    buildingDnAUnsupportedProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
      requestedMetrics: ["Dn,A"]
    }),
    buildingRuntimeProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_RUNTIME_TARGET_OUTPUTS
    }),
    exactAWeightedSourceRowsRemainPrecedence: true,
    fieldRuntimeProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT,
      requestedMetrics: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_RUNTIME_TARGET_OUTPUTS
    }),
    labAliasProbe: buildProbe({
      airborneContext: {
        contextMode: "element_lab",
        frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
        hostWallAreaM2: 12,
        openingLeakElements: [OPENING]
      },
      requestedMetrics: ["Rw", "STC", "Dn,A", "DnT,A"]
    }),
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
    missingFrequencyBandSetProbe: buildProbe({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
      requestedMetrics: ["Dn,A", "DnT,A"]
    }),
    newNumericAWeightedRuntimeMovement: true,
    previousFormulaLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
    previousFormulaSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    previousFormulaSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    previousFormulaSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS,
    requiredOwnerInputs: {
      building: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
      field: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS
    },
    requiredPhysicalInputs: {
      building: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
      field: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
    },
    runtimePromotionAllowedInGate: true,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    tolerancePins: {
      buildingAWeighted: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
      fieldAWeighted: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB
    }
  };
}

export function assertCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract(
  contract: CompanyInternalOpeningLeakAWeightedRuntimeCorridorContract =
    buildCompanyInternalOpeningLeakAWeightedRuntimeCorridorContract()
): void {
  if (contract.previousFormulaSelectedNextAction !== contract.landedGate) {
    throw new Error("Opening/leak A-weighted runtime did not consume the selected formula corridor.");
  }

  if (
    contract.fieldRuntimeProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD ||
    contract.fieldRuntimeProbe.computedDnADb !== 35.9 ||
    contract.fieldRuntimeProbe.computedDnTADb !== 36.1 ||
    contract.fieldRuntimeProbe.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB
  ) {
    throw new Error("Opening/leak field A-weighted runtime corridor did not promote the expected values.");
  }

  if (
    contract.buildingRuntimeProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD ||
    contract.buildingRuntimeProbe.computedDnTADb !== 31.3 ||
    contract.buildingRuntimeProbe.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB
  ) {
    throw new Error("Opening/leak building A-weighted runtime corridor did not promote the expected values.");
  }

  if (
    contract.missingFrequencyBandSetProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD ||
    contract.missingFrequencyBandSetProbe.computedDnADb !== null ||
    contract.missingFrequencyBandSetProbe.computedDnTADb !== null ||
    contract.missingFrequencyBandSetProbe.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
  ) {
    throw new Error("Opening/leak A-weighted missing-frequency boundary promoted runtime too early.");
  }

  if (
    contract.labAliasProbe.basisId !== GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD ||
    contract.labAliasProbe.computedDnADb !== null ||
    contract.labAliasProbe.computedDnTADb !== null
  ) {
    throw new Error("Opening/leak A-weighted runtime aliased lab Rw/STC into field/building metrics.");
  }

  if (
    contract.fieldRuntimeProbe.selectedCandidateId !==
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID ||
    contract.buildingRuntimeProbe.selectedCandidateId !==
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
  ) {
    throw new Error("Opening/leak A-weighted runtime did not select the dedicated candidate id.");
  }
}
