import type { AcousticInputFieldId, AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildCompanyInternalCalculationGradeMainlineMatrixV4Contract,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
  COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS
} from "./company-internal-calculation-grade-mainline-matrix";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING } from "./dynamic-airborne-gate-n-building-prediction-runtime-adapter";
import { GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE =
  "company_internal_opening_leak_building_adapter_owner_contract_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS =
  "company_internal_opening_leak_building_adapter_owner_contract_landed_no_runtime_selected_runtime_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_building_runtime_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL =
  "opening/leak field/building runtime corridor";

export type CompanyInternalOpeningLeakAdapterBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";

export type CompanyInternalOpeningLeakAdapterStatus =
  | "needs_input"
  | "not_requested"
  | "ready_for_runtime_corridor"
  | "runtime_owner_missing"
  | "unsupported_basis";

export type CompanyInternalOpeningLeakAdapterRuntimeOwnerInput =
  | "buildingDirectOpeningLeakCompositeCurveOwner"
  | "buildingJunctionVibrationReductionOwner"
  | "buildingOpeningLeakFlankingPathEnergyOwner"
  | "buildingRoomAbsorptionStandardizationOwner"
  | "exactFieldOrBuildingOpeningPacketPrecedenceOwner"
  | "fieldFlankingPenaltyOwner"
  | "fieldOpeningLeakCompositeCurveOwner"
  | "fieldRoomNormalizationOwner"
  | "labOpeningLeakCompositeRwOrCurveOwner"
  | "openingLeakBuildingUncertaintyBudgetOwner"
  | "openingLeakFieldUncertaintyBudgetOwner";

export type CompanyInternalOpeningLeakAdapterOwnerGroup = {
  adapterBasis: Extract<CompanyInternalOpeningLeakAdapterBasis, "building_prediction" | "field_apparent">;
  id: "building_prediction_opening_leak_adapter_owners" | "field_apparent_opening_leak_adapter_owners";
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAdapterAssessmentInput = {
  adapterBasis: CompanyInternalOpeningLeakAdapterBasis;
  id: string;
  providedOwnerInputs?: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
  providedPhysicalInputs?: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAdapterAssessment = {
  adapterBasis: CompanyInternalOpeningLeakAdapterBasis;
  blockedOutputs: readonly RequestedOutputId[];
  id: string;
  labOpeningRwAliasAllowed: false;
  missingOwnerInputs: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedAtGate: false;
  status: CompanyInternalOpeningLeakAdapterStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakRuntimeProbe = {
  basisId: string | null;
  computedDnTwDb: number | null;
  computedRwDb: number | null;
  computedRwPrimeDb: number | null;
  computedStc: number | null;
  errorBudgetDb: number | null;
  openingAliasWarningPresent: boolean;
  origin: string | null;
  requestedMetrics: readonly RequestedOutputId[];
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakBuildingAdapterOwnerContract = {
  buildingPredictionRuntimePromoted: false;
  currentRuntimeProbes: {
    buildingOpeningProbe: CompanyInternalOpeningLeakRuntimeProbe;
    fieldOpeningProbe: CompanyInternalOpeningLeakRuntimeProbe;
    labOpeningProbe: CompanyInternalOpeningLeakRuntimeProbe;
  };
  fieldAndBuildingOwnersSeparated: true;
  labOpeningRwAliasedToFieldOrBuilding: false;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerGroups: readonly CompanyInternalOpeningLeakAdapterOwnerGroup[];
  previousMatrixV4: {
    landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE;
    selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL;
    selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS;
  };
  scenarioPack: readonly CompanyInternalOpeningLeakAdapterAssessment[];
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const OPENING_LEAK_FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const OPENING_LEAK_BUILDING_OUTPUTS = [
  "R'w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const COMPANY_INTERNAL_OPENING_LEAK_COMMON_PHYSICAL_INPUTS = [
  "contextMode",
  "hostWallAreaM2",
  "openingAreaM2",
  "openingElementRwDb",
  "openingRatingBasis",
  "openingSealLeakageClass",
  "openingCount",
  "openingOrigin"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS = [
  ...COMPANY_INTERNAL_OPENING_LEAK_COMMON_PHYSICAL_INPUTS,
  "panelWidthMm",
  "panelHeightMm",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS = [
  ...COMPANY_INTERNAL_OPENING_LEAK_COMMON_PHYSICAL_INPUTS,
  "panelWidthMm",
  "panelHeightMm",
  "sourceRoomVolumeM3",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const satisfies readonly AcousticInputFieldId[];

export const COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS = [
  "labOpeningLeakCompositeRwOrCurveOwner",
  "fieldOpeningLeakCompositeCurveOwner",
  "fieldFlankingPenaltyOwner",
  "fieldRoomNormalizationOwner",
  "openingLeakFieldUncertaintyBudgetOwner",
  "exactFieldOrBuildingOpeningPacketPrecedenceOwner"
] as const satisfies readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS = [
  "labOpeningLeakCompositeRwOrCurveOwner",
  "buildingDirectOpeningLeakCompositeCurveOwner",
  "buildingOpeningLeakFlankingPathEnergyOwner",
  "buildingJunctionVibrationReductionOwner",
  "buildingRoomAbsorptionStandardizationOwner",
  "openingLeakBuildingUncertaintyBudgetOwner",
  "exactFieldOrBuildingOpeningPacketPrecedenceOwner"
] as const satisfies readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];

const FIELD_OWNER_GROUP = {
  adapterBasis: "field_apparent",
  id: "field_apparent_opening_leak_adapter_owners",
  requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS,
  requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS,
  targetOutputs: OPENING_LEAK_FIELD_OUTPUTS
} as const satisfies CompanyInternalOpeningLeakAdapterOwnerGroup;

const BUILDING_OWNER_GROUP = {
  adapterBasis: "building_prediction",
  id: "building_prediction_opening_leak_adapter_owners",
  requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS,
  requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS,
  targetOutputs: OPENING_LEAK_BUILDING_OUTPUTS
} as const satisfies CompanyInternalOpeningLeakAdapterOwnerGroup;

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

const LAB_OPENING_CONTEXT = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [OPENING]
} as const satisfies AirborneContext;

const FIELD_OPENING_CONTEXT = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  hostWallAreaM2: 12,
  openingLeakElements: [OPENING],
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
} as const satisfies AirborneContext;

const BUILDING_OPENING_CONTEXT = {
  ...FIELD_OPENING_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function ownerGroupFor(
  adapterBasis: CompanyInternalOpeningLeakAdapterBasis
): CompanyInternalOpeningLeakAdapterOwnerGroup | null {
  if (adapterBasis === "field_apparent") {
    return FIELD_OWNER_GROUP;
  }

  if (adapterBasis === "building_prediction") {
    return BUILDING_OWNER_GROUP;
  }

  return null;
}

function missingPhysicalInputs(input: {
  group: CompanyInternalOpeningLeakAdapterOwnerGroup;
  providedPhysicalInputs: readonly AcousticInputFieldId[];
}): AcousticInputFieldId[] {
  return input.group.requiredPhysicalInputs.filter(
    (fieldId) => !input.providedPhysicalInputs.includes(fieldId)
  );
}

function missingOwnerInputs(input: {
  group: CompanyInternalOpeningLeakAdapterOwnerGroup;
  providedOwnerInputs: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
}): CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[] {
  return input.group.requiredOwnerInputs.filter(
    (owner) => !input.providedOwnerInputs.includes(owner)
  );
}

function requestedGroupOutputs(input: {
  group: CompanyInternalOpeningLeakAdapterOwnerGroup;
  targetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  return input.targetOutputs.filter((output) => input.group.targetOutputs.includes(output));
}

function assessmentStatus(input: {
  group: CompanyInternalOpeningLeakAdapterOwnerGroup | null;
  missingOwnerInputs: readonly CompanyInternalOpeningLeakAdapterRuntimeOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakAdapterStatus {
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
    return "runtime_owner_missing";
  }

  return "ready_for_runtime_corridor";
}

function round1(value: number | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildProbe(input: {
  airborneContext: AirborneContext;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakRuntimeProbe {
  const result = calculateAssembly(HOST_WALL, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });

  return {
    basisId: result.airborneBasis?.method ?? null,
    computedDnTwDb: round1(result.metrics.estimatedDnTwDb),
    computedRwDb: round1(result.metrics.estimatedRwDb),
    computedRwPrimeDb: round1(result.metrics.estimatedRwPrimeDb),
    computedStc: round1(result.metrics.estimatedStc),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    openingAliasWarningPresent: result.warnings.some((warning: string) =>
      /Opening\/leak composite runtime is blocked for field\/building outputs/i.test(warning)
    ),
    origin: result.airborneBasis?.origin ?? null,
    requestedMetrics: input.targetOutputs,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalOpeningLeakAdapterOwnerGroups():
  readonly CompanyInternalOpeningLeakAdapterOwnerGroup[] {
  return [FIELD_OWNER_GROUP, BUILDING_OWNER_GROUP];
}

export function assessCompanyInternalOpeningLeakAdapter(
  input: CompanyInternalOpeningLeakAdapterAssessmentInput
): CompanyInternalOpeningLeakAdapterAssessment {
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
    status === "needs_input" || status === "runtime_owner_missing"
      ? groupOutputs
      : [];
  const readyOutputs = status === "ready_for_runtime_corridor" ? groupOutputs : [];

  return {
    adapterBasis: input.adapterBasis,
    blockedOutputs,
    id: input.id,
    labOpeningRwAliasAllowed: false,
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

export function buildCompanyInternalOpeningLeakAdapterScenarioPack():
  readonly CompanyInternalOpeningLeakAdapterAssessment[] {
  return [
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_complete_ready_for_runtime_corridor",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS,
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_runtime_owners_missing",
      providedOwnerInputs: ["labOpeningLeakCompositeRwOrCurveOwner"],
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS,
      targetOutputs: ["R'w", "DnT,w"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "field_apparent",
      id: "company_internal_opening_leak_field_missing_rt60_needs_input",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_FIELD_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "receivingRoomRt60S"
      ),
      targetOutputs: ["R'w", "DnT,w"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "building_prediction",
      id: "company_internal_opening_leak_building_complete_ready_for_runtime_corridor",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS,
      targetOutputs: ["R'w", "DnT,w"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "building_prediction",
      id: "company_internal_opening_leak_building_missing_flanking_class_needs_input",
      providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_OWNER_INPUTS,
      providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "flankingJunctionClass"
      ),
      targetOutputs: ["R'w", "DnT,w"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "element_lab",
      id: "company_internal_opening_leak_lab_rw_stc_stays_out_of_field_building_adapter",
      targetOutputs: ["Rw", "STC"]
    }),
    assessCompanyInternalOpeningLeakAdapter({
      adapterBasis: "astm_rating_boundary",
      id: "company_internal_opening_leak_astm_iic_aiic_not_airborne_adapter",
      targetOutputs: ["IIC", "AIIC"]
    })
  ];
}

export function buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract():
  CompanyInternalOpeningLeakBuildingAdapterOwnerContract {
  const matrixV4 = buildCompanyInternalCalculationGradeMainlineMatrixV4Contract();

  if (matrixV4.selectedNextAction !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE) {
    throw new Error("Opening/leak adapter owner contract can only land after Matrix V4 selects it.");
  }

  return {
    buildingPredictionRuntimePromoted: false,
    currentRuntimeProbes: {
      buildingOpeningProbe: buildProbe({
        airborneContext: BUILDING_OPENING_CONTEXT,
        targetOutputs: ["R'w", "DnT,w"]
      }),
      fieldOpeningProbe: buildProbe({
        airborneContext: FIELD_OPENING_CONTEXT,
        targetOutputs: ["R'w", "DnT,w"]
      }),
      labOpeningProbe: buildProbe({
        airborneContext: LAB_OPENING_CONTEXT,
        targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
      })
    },
    fieldAndBuildingOwnersSeparated: true,
    labOpeningRwAliasedToFieldOrBuilding: false,
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerGroups: buildCompanyInternalOpeningLeakAdapterOwnerGroups(),
    previousMatrixV4: {
      landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
      selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
      selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
      selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
      selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS
    },
    scenarioPack: buildCompanyInternalOpeningLeakAdapterScenarioPack(),
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_ADAPTER_OWNER_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function assertCompanyInternalOpeningLeakBuildingAdapterOwnerContract(
  contract: CompanyInternalOpeningLeakBuildingAdapterOwnerContract =
    buildCompanyInternalOpeningLeakBuildingAdapterOwnerContract()
): void {
  const { buildingOpeningProbe, fieldOpeningProbe, labOpeningProbe } = contract.currentRuntimeProbes;

  if (
    labOpeningProbe.computedRwDb !== 38.2 ||
    labOpeningProbe.computedStc !== 39 ||
    labOpeningProbe.basisId !== GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD
  ) {
    throw new Error("Opening/leak lab Rw/STC runtime moved while landing the adapter owner contract.");
  }

  if (
    fieldOpeningProbe.supportedTargetOutputs.length > 0 ||
    fieldOpeningProbe.basisId !== GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD ||
    fieldOpeningProbe.openingAliasWarningPresent !== true
  ) {
    throw new Error("Opening/leak field request must remain blocked until the dedicated field adapter runtime lands.");
  }

  if (
    buildingOpeningProbe.supportedTargetOutputs.length > 0 ||
    buildingOpeningProbe.origin !== "unsupported" ||
    buildingOpeningProbe.openingAliasWarningPresent !== true
  ) {
    throw new Error("Opening/leak building request must remain unsupported until the dedicated building adapter runtime lands.");
  }

  if (!GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING.includes("building-prediction runtime adapter")) {
    throw new Error("Opening/leak building owner contract lost the existing building-prediction boundary warning.");
  }
}
