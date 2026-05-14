import type { AcousticInputFieldId, AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV5Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL =
  "opening/leak Dn,A / DnT,A spectrum-adapter formula corridor";

export type CompanyInternalOpeningLeakAWeightedAdapterBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";

export type CompanyInternalOpeningLeakAWeightedAdapterStatus =
  | "adapter_owner_missing"
  | "needs_input"
  | "not_requested"
  | "ready_for_formula_corridor"
  | "unsupported_basis";

export type CompanyInternalOpeningLeakAWeightedOwnerInput =
  | "aWeightedOpeningLeakUncertaintyBudgetOwner"
  | "buildingDnTACompanionPolicyOwner"
  | "buildingOpeningLeakAWeightedSpectrumCurveOwner"
  | "exactAWeightedOpeningPacketPrecedenceOwner"
  | "fieldDnACompanionPolicyOwner"
  | "fieldOpeningLeakAWeightedSpectrumCurveOwner"
  | "iso717COrAWeightedSpectrumAdapterOwner"
  | "labRwStcAliasGuardOwner"
  | "standardizedDnTACompanionPolicyOwner";

export type CompanyInternalOpeningLeakAWeightedOwnerGroup = {
  adapterBasis: Extract<CompanyInternalOpeningLeakAWeightedAdapterBasis, "building_prediction" | "field_apparent">;
  baseRuntimeMethod:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD;
  baseRuntimeOutputsRequired: readonly RequestedOutputId[];
  id:
    | "building_prediction_opening_leak_a_weighted_spectrum_adapter_owners"
    | "field_apparent_opening_leak_a_weighted_spectrum_adapter_owners";
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAWeightedAssessmentInput = {
  adapterBasis: CompanyInternalOpeningLeakAWeightedAdapterBasis;
  id: string;
  providedOwnerInputs?: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  providedPhysicalInputs?: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAWeightedAssessment = {
  adapterBasis: CompanyInternalOpeningLeakAWeightedAdapterBasis;
  blockedOutputs: readonly RequestedOutputId[];
  id: string;
  labRwOrStcAliasAllowed: false;
  missingOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedAtGate: false;
  status: CompanyInternalOpeningLeakAWeightedAdapterStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

type CompanyInternalOpeningLeakAWeightedProbe = {
  basisId: string | null;
  cAdapterDb: number | null;
  computedDnADb: number | null;
  computedDnTADb: number | null;
  computedDnTwDb: number | null;
  computedDnWDb: number | null;
  computedRwPrimeDb: number | null;
  errorBudgetDb: number | null;
  origin: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warningMatched: boolean;
};

export type CompanyInternalOpeningLeakAWeightedAdapterOwnerContract = {
  aWeightedRuntimePromoted: false;
  currentRuntimeProbes: {
    buildingAWeightedProbe: CompanyInternalOpeningLeakAWeightedProbe;
    fieldAWeightedProbe: CompanyInternalOpeningLeakAWeightedProbe;
  };
  exactAWeightedSourceRowsRemainPrecedence: true;
  fieldAndBuildingAWeightedOwnersSeparated: true;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE;
  labRwOrStcAliasedToAWeighted: false;
  noRuntimeValueMovement: true;
  ownerGroups: readonly CompanyInternalOpeningLeakAWeightedOwnerGroup[];
  previousMatrixV5: {
    landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE;
    selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE;
    selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS;
  };
  scenarioPack: readonly CompanyInternalOpeningLeakAWeightedAssessment[];
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const OPENING_LEAK_A_WEIGHTED_COMMON_PHYSICAL_INPUTS = [
  "contextMode",
  "hostWallAreaM2",
  "openingAreaM2",
  "openingElementRwDb",
  "openingRatingBasis",
  "openingSealLeakageClass",
  "openingCount",
  "openingOrigin",
  "frequencyBandSet"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS = [
  ...OPENING_LEAK_A_WEIGHTED_COMMON_PHYSICAL_INPUTS,
  "panelWidthMm",
  "panelHeightMm",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS = [
  ...COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS,
  "sourceRoomVolumeM3",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS = [
  "fieldOpeningLeakAWeightedSpectrumCurveOwner",
  "iso717COrAWeightedSpectrumAdapterOwner",
  "fieldDnACompanionPolicyOwner",
  "standardizedDnTACompanionPolicyOwner",
  "aWeightedOpeningLeakUncertaintyBudgetOwner",
  "exactAWeightedOpeningPacketPrecedenceOwner",
  "labRwStcAliasGuardOwner"
] as const satisfies readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS = [
  "buildingOpeningLeakAWeightedSpectrumCurveOwner",
  "iso717COrAWeightedSpectrumAdapterOwner",
  "buildingDnTACompanionPolicyOwner",
  "standardizedDnTACompanionPolicyOwner",
  "aWeightedOpeningLeakUncertaintyBudgetOwner",
  "exactAWeightedOpeningPacketPrecedenceOwner",
  "labRwStcAliasGuardOwner"
] as const satisfies readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];

const FIELD_OWNER_GROUP = {
  adapterBasis: "field_apparent",
  baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  baseRuntimeOutputsRequired: ["Dn,w", "DnT,w"],
  id: "field_apparent_opening_leak_a_weighted_spectrum_adapter_owners",
  requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
  requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS,
  targetOutputs: ["Dn,A", "DnT,A"]
} as const satisfies CompanyInternalOpeningLeakAWeightedOwnerGroup;

const BUILDING_OWNER_GROUP = {
  adapterBasis: "building_prediction",
  baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  baseRuntimeOutputsRequired: ["DnT,w"],
  id: "building_prediction_opening_leak_a_weighted_spectrum_adapter_owners",
  requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
  requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
  targetOutputs: ["DnT,A"]
} as const satisfies CompanyInternalOpeningLeakAWeightedOwnerGroup;

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function ownerGroupFor(
  adapterBasis: CompanyInternalOpeningLeakAWeightedAdapterBasis
): CompanyInternalOpeningLeakAWeightedOwnerGroup | null {
  if (adapterBasis === "field_apparent") {
    return FIELD_OWNER_GROUP;
  }

  if (adapterBasis === "building_prediction") {
    return BUILDING_OWNER_GROUP;
  }

  return null;
}

function missingPhysicalInputs(input: {
  group: CompanyInternalOpeningLeakAWeightedOwnerGroup;
  providedPhysicalInputs: readonly AcousticInputFieldId[];
}): AcousticInputFieldId[] {
  return input.group.requiredPhysicalInputs.filter(
    (fieldId) => !input.providedPhysicalInputs.includes(fieldId)
  );
}

function missingOwnerInputs(input: {
  group: CompanyInternalOpeningLeakAWeightedOwnerGroup;
  providedOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
}): CompanyInternalOpeningLeakAWeightedOwnerInput[] {
  return input.group.requiredOwnerInputs.filter(
    (owner) => !input.providedOwnerInputs.includes(owner)
  );
}

function requestedGroupOutputs(input: {
  group: CompanyInternalOpeningLeakAWeightedOwnerGroup;
  targetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  return input.targetOutputs.filter((output) => input.group.targetOutputs.includes(output));
}

function assessmentStatus(input: {
  group: CompanyInternalOpeningLeakAWeightedOwnerGroup | null;
  missingOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakAWeightedAdapterStatus {
  if (input.targetOutputs.length === 0) {
    return "not_requested";
  }

  if (!input.group || input.requestedOutputs.length === 0) {
    return "unsupported_basis";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (input.missingOwnerInputs.length > 0) {
    return "adapter_owner_missing";
  }

  return "ready_for_formula_corridor";
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildProbe(input: {
  airborneContext: AirborneContext;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakAWeightedProbe {
  const result = calculateAssembly(HOST_WALL, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });

  return {
    basisId: result.airborneBasis?.method ?? null,
    cAdapterDb: numberOrNull(result.metrics.estimatedCDb),
    computedDnADb: numberOrNull(result.metrics.estimatedDnADb),
    computedDnTADb: numberOrNull(result.metrics.estimatedDnTADb),
    computedDnTwDb: numberOrNull(result.metrics.estimatedDnTwDb),
    computedDnWDb: numberOrNull(result.metrics.estimatedDnWDb),
    computedRwPrimeDb: numberOrNull(result.metrics.estimatedRwPrimeDb),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    origin: result.airborneBasis?.origin ?? null,
    requestedMetrics: input.targetOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warningMatched: result.warnings.some((warning: string) =>
      /Opening\/leak field\/building runtime corridor active/i.test(warning)
    )
  };
}

export function buildCompanyInternalOpeningLeakAWeightedOwnerGroups():
  readonly CompanyInternalOpeningLeakAWeightedOwnerGroup[] {
  return [FIELD_OWNER_GROUP, BUILDING_OWNER_GROUP];
}

export function assessCompanyInternalOpeningLeakAWeightedAdapter(
  input: CompanyInternalOpeningLeakAWeightedAssessmentInput
): CompanyInternalOpeningLeakAWeightedAssessment {
  const group = ownerGroupFor(input.adapterBasis);
  const targetOutputs = unique(input.targetOutputs);
  const groupOutputs = group ? requestedGroupOutputs({ group, targetOutputs }) : [];
  const physicalMissing = group
    ? missingPhysicalInputs({
      group,
      providedPhysicalInputs: input.providedPhysicalInputs ?? []
    })
    : [];
  const ownerMissing = group
    ? missingOwnerInputs({
      group,
      providedOwnerInputs: input.providedOwnerInputs ?? []
    })
    : [];
  const status = assessmentStatus({
    group,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    requestedOutputs: groupOutputs,
    targetOutputs
  });
  const unsupportedOutputs = group
    ? targetOutputs.filter((output) => !group.targetOutputs.includes(output))
    : targetOutputs;
  const blockedOutputs =
    status === "adapter_owner_missing" || status === "needs_input"
      ? groupOutputs
      : [];
  const readyOutputs = status === "ready_for_formula_corridor" ? groupOutputs : [];

  return {
    adapterBasis: input.adapterBasis,
    blockedOutputs,
    id: input.id,
    labRwOrStcAliasAllowed: false,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    readyOutputs,
    requiredOwnerInputs: group?.requiredOwnerInputs ?? [],
    requiredPhysicalInputs: group?.requiredPhysicalInputs ?? [],
    runtimePromotionAllowedAtGate: false,
    status,
    targetOutputs,
    unsupportedOutputs
  };
}

export function buildCompanyInternalOpeningLeakAWeightedScenarioPack():
  readonly CompanyInternalOpeningLeakAWeightedAssessment[] {
  return [
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_a_weighted_complete_ready_for_formula_corridor",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS,
      targetOutputs: ["Dn,A", "DnT,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_a_weighted_missing_spectrum_owner",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS.filter(
        (owner) => owner !== "fieldOpeningLeakAWeightedSpectrumCurveOwner"
      ),
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS,
      targetOutputs: ["Dn,A", "DnT,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_a_weighted_missing_frequency_band_set",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "frequencyBandSet"
      ),
      targetOutputs: ["DnT,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "building_prediction",
      id: "company_internal_opening_leak_building_dnta_complete_ready_for_formula_corridor",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
      targetOutputs: ["DnT,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "building_prediction",
      id: "company_internal_opening_leak_building_dna_stays_out_of_building_owner",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
      targetOutputs: ["Dn,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "element_lab",
      id: "company_internal_opening_leak_lab_rw_stc_not_a_weighted_alias",
      targetOutputs: ["Rw", "STC", "Dn,A", "DnT,A"]
    }),
    assessCompanyInternalOpeningLeakAWeightedAdapter({
      adapterBasis: "astm_rating_boundary",
      id: "company_internal_opening_leak_astm_iic_aiic_not_airborne_a_weighted_adapter",
      targetOutputs: ["IIC", "AIIC"]
    })
  ];
}

export function buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract():
  CompanyInternalOpeningLeakAWeightedAdapterOwnerContract {
  const matrixV5 = buildCompanyInternalCalculationGradeMainlineMatrixV5Contract();

  if (matrixV5.selectedNextAction !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE) {
    throw new Error("Opening/leak A-weighted owner contract can only land after Matrix V5 selects it.");
  }

  return {
    aWeightedRuntimePromoted: false,
    currentRuntimeProbes: {
      buildingAWeightedProbe: buildProbe({
        airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
        targetOutputs: ["DnT,A", "Dn,A"]
      }),
      fieldAWeightedProbe: buildProbe({
        airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
        targetOutputs: ["Dn,A", "DnT,A"]
      })
    },
    exactAWeightedSourceRowsRemainPrecedence: true,
    fieldAndBuildingAWeightedOwnersSeparated: true,
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
    labRwOrStcAliasedToAWeighted: false,
    noRuntimeValueMovement: true,
    ownerGroups: buildCompanyInternalOpeningLeakAWeightedOwnerGroups(),
    previousMatrixV5: {
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS
    },
    scenarioPack: buildCompanyInternalOpeningLeakAWeightedScenarioPack(),
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function assertCompanyInternalOpeningLeakAWeightedAdapterOwnerContract(
  contract: CompanyInternalOpeningLeakAWeightedAdapterOwnerContract =
    buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract()
): void {
  const { buildingAWeightedProbe, fieldAWeightedProbe } = contract.currentRuntimeProbes;

  if (
    fieldAWeightedProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD ||
    fieldAWeightedProbe.computedDnWDb !== 36.7 ||
    fieldAWeightedProbe.computedDnTwDb !== 36.9 ||
    fieldAWeightedProbe.computedDnADb !== null ||
    fieldAWeightedProbe.computedDnTADb !== null ||
    fieldAWeightedProbe.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB ||
    fieldAWeightedProbe.supportedTargetOutputs.length > 0
  ) {
    throw new Error("Opening/leak field A-weighted owner contract moved runtime values or promoted A-weighted outputs.");
  }

  if (
    buildingAWeightedProbe.basisId !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ||
    buildingAWeightedProbe.computedRwPrimeDb !== 31.6 ||
    buildingAWeightedProbe.computedDnTwDb !== 32.1 ||
    buildingAWeightedProbe.computedDnADb !== null ||
    buildingAWeightedProbe.computedDnTADb !== null ||
    buildingAWeightedProbe.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB ||
    buildingAWeightedProbe.supportedTargetOutputs.length > 0
  ) {
    throw new Error("Opening/leak building A-weighted owner contract moved runtime values or promoted A-weighted outputs.");
  }
}
