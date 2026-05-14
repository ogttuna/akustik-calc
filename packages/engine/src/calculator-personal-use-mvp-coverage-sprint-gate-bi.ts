import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBHLandingContract,
  buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBILanes,
  summarizePersonalUseMvpCoverageSprintGateBH
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bh";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE =
  "gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS =
  "gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_landed_no_runtime_selected_field_building_runtime_corridor_gate_bj";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION =
  "gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL =
  "floor-impact field/building runtime corridor";

export type PersonalUseMvpCoverageSprintGateBIAdapterBasis =
  | "astm_rating_boundary"
  | "building_prediction"
  | "element_lab"
  | "field_apparent";

export type PersonalUseMvpCoverageSprintGateBIAdapterStatus =
  | "blocked_low_frequency_owner"
  | "needs_input"
  | "not_requested"
  | "ready_for_runtime_corridor"
  | "runtime_owner_missing"
  | "unsupported_basis";

export type PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput =
  | "buildingFlankingPathEnergyOwner"
  | "buildingPredictionUncertaintyBudgetOwner"
  | "directSeparatingFloorImpactCurveOwner"
  | "fieldCorrectionKOrDirectFlankingOwner"
  | "fieldImpactUncertaintyBudgetOwner"
  | "fieldNormalizationBasisOwner"
  | "impactFlankingOrJunctionPolicyOwner"
  | "junctionVibrationReductionOrKijOwner"
  | "labImpactAnchorLnWOrDeltaLw"
  | "lowFrequencyImpactSpectrumOrCI50_2500Owner"
  | "roomAbsorptionNormalizationOwner";

export type PersonalUseMvpCoverageSprintGateBIOwnerGroup = {
  adapterBasis: Extract<PersonalUseMvpCoverageSprintGateBIAdapterBasis, "building_prediction" | "field_apparent">;
  id: "building_prediction_impact_adapter_owners" | "field_apparent_impact_adapter_owners";
  lowFrequencyOwnerRequiredFor: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBIAssessmentInput = {
  adapterBasis: PersonalUseMvpCoverageSprintGateBIAdapterBasis;
  id: string;
  providedOwnerInputs?: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  providedPhysicalInputs?: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBIAssessment = {
  adapterBasis: PersonalUseMvpCoverageSprintGateBIAdapterBasis;
  blockedOutputs: readonly RequestedOutputId[];
  id: string;
  labBudgetAliasAllowed: false;
  missingOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedAtGateBI: false;
  status: PersonalUseMvpCoverageSprintGateBIAdapterStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBIContract = {
  astmImpactAdapterAdded: false;
  buildingPredictionRuntimePromoted: false;
  companyInternalCalculationGradeNextLane: true;
  currentFieldRowsPreserved: {
    lPrimeNWDb: 53;
    lPrimeNT50Db: 49;
    lPrimeNTwDb: 50.6;
  };
  fieldAndBuildingOwnersSeparated: true;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE;
  labBudgetAliasedToFieldOrBuilding: false;
  noRuntimeValueMovement: true;
  ownerGroups: readonly PersonalUseMvpCoverageSprintGateBIOwnerGroup[];
  previousGateBH: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE;
    selectedNextLane: "floor_impact_field_building_adapter_contract";
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS;
  };
  scenarioPack: readonly PersonalUseMvpCoverageSprintGateBIAssessment[];
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bh_floor_impact_field_building_adapter_contract";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const FIELD_TARGET_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const BUILDING_TARGET_OUTPUTS = ["L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const LOW_FREQUENCY_OUTPUTS = ["L'nT,50"] as const satisfies readonly RequestedOutputId[];

export const GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS = [
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "impactFieldContext"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS = [
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis",
  "impactFieldContext"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_BI_FIELD_APPARENT_OWNER_INPUTS = [
  "labImpactAnchorLnWOrDeltaLw",
  "fieldCorrectionKOrDirectFlankingOwner",
  "impactFlankingOrJunctionPolicyOwner",
  "fieldNormalizationBasisOwner",
  "fieldImpactUncertaintyBudgetOwner",
  "lowFrequencyImpactSpectrumOrCI50_2500Owner"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];

export const GATE_BI_BUILDING_PREDICTION_OWNER_INPUTS = [
  "directSeparatingFloorImpactCurveOwner",
  "buildingFlankingPathEnergyOwner",
  "junctionVibrationReductionOrKijOwner",
  "roomAbsorptionNormalizationOwner",
  "buildingPredictionUncertaintyBudgetOwner",
  "lowFrequencyImpactSpectrumOrCI50_2500Owner"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];

const FIELD_OWNER_GROUP = {
  adapterBasis: "field_apparent",
  id: "field_apparent_impact_adapter_owners",
  lowFrequencyOwnerRequiredFor: LOW_FREQUENCY_OUTPUTS,
  requiredOwnerInputs: GATE_BI_FIELD_APPARENT_OWNER_INPUTS,
  requiredPhysicalInputs: GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS,
  targetOutputs: FIELD_TARGET_OUTPUTS
} as const satisfies PersonalUseMvpCoverageSprintGateBIOwnerGroup;

const BUILDING_OWNER_GROUP = {
  adapterBasis: "building_prediction",
  id: "building_prediction_impact_adapter_owners",
  lowFrequencyOwnerRequiredFor: LOW_FREQUENCY_OUTPUTS,
  requiredOwnerInputs: GATE_BI_BUILDING_PREDICTION_OWNER_INPUTS,
  requiredPhysicalInputs: GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS,
  targetOutputs: BUILDING_TARGET_OUTPUTS
} as const satisfies PersonalUseMvpCoverageSprintGateBIOwnerGroup;

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function includesAny<T extends string>(haystack: readonly T[], needles: readonly T[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

function ownerGroupFor(
  adapterBasis: PersonalUseMvpCoverageSprintGateBIAdapterBasis
): PersonalUseMvpCoverageSprintGateBIOwnerGroup | null {
  if (adapterBasis === "field_apparent") {
    return FIELD_OWNER_GROUP;
  }

  if (adapterBasis === "building_prediction") {
    return BUILDING_OWNER_GROUP;
  }

  return null;
}

function missingPhysicalInputs(input: {
  group: PersonalUseMvpCoverageSprintGateBIOwnerGroup;
  providedPhysicalInputs: readonly AcousticInputFieldId[];
}): AcousticInputFieldId[] {
  return input.group.requiredPhysicalInputs.filter(
    (fieldId) => !input.providedPhysicalInputs.includes(fieldId)
  );
}

function requiredOwnerInputsFor(input: {
  group: PersonalUseMvpCoverageSprintGateBIOwnerGroup;
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[] {
  const lowFrequencyRequested = includesAny(input.targetOutputs, LOW_FREQUENCY_OUTPUTS);
  return input.group.requiredOwnerInputs.filter(
    (owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner" || lowFrequencyRequested
  );
}

function missingOwnerInputs(input: {
  providedOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
}): PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[] {
  return input.requiredOwnerInputs.filter((owner) => !input.providedOwnerInputs.includes(owner));
}

function assessmentStatus(input: {
  adapterBasis: PersonalUseMvpCoverageSprintGateBIAdapterBasis;
  missingOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBIRuntimeOwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBIAdapterStatus {
  if (
    input.adapterBasis === "astm_rating_boundary" ||
    input.adapterBasis === "element_lab" ||
    includesAny(input.targetOutputs, ASTM_IMPACT_OUTPUTS) ||
    includesAny(input.targetOutputs, LAB_IMPACT_OUTPUTS)
  ) {
    return "unsupported_basis";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (
    input.missingOwnerInputs.length === 1 &&
    input.missingOwnerInputs[0] === "lowFrequencyImpactSpectrumOrCI50_2500Owner"
  ) {
    return "blocked_low_frequency_owner";
  }

  if (input.adapterBasis === "building_prediction" || input.missingOwnerInputs.length > 0) {
    return input.missingOwnerInputs.length > 0
      ? "runtime_owner_missing"
      : "ready_for_runtime_corridor";
  }

  return "ready_for_runtime_corridor";
}

export function buildPersonalUseMvpCoverageSprintGateBIOwnerGroups():
  readonly PersonalUseMvpCoverageSprintGateBIOwnerGroup[] {
  return [FIELD_OWNER_GROUP, BUILDING_OWNER_GROUP];
}

export function assessPersonalUseMvpCoverageSprintGateBIAdapter(
  input: PersonalUseMvpCoverageSprintGateBIAssessmentInput
): PersonalUseMvpCoverageSprintGateBIAssessment {
  const group = ownerGroupFor(input.adapterBasis);
  const targetOutputs = unique(input.targetOutputs);

  if (!group) {
    return {
      adapterBasis: input.adapterBasis,
      blockedOutputs: [],
      id: input.id,
      labBudgetAliasAllowed: false,
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      readyOutputs: [],
      requiredOwnerInputs: [],
      requiredPhysicalInputs: [],
      runtimePromotionAllowedAtGateBI: false,
      status: "unsupported_basis",
      targetOutputs,
      unsupportedOutputs: targetOutputs
    };
  }

  const physicalMissing = missingPhysicalInputs({
    group,
    providedPhysicalInputs: input.providedPhysicalInputs ?? []
  });
  const requiredOwners = requiredOwnerInputsFor({
    group,
    targetOutputs
  });
  const ownerMissing = missingOwnerInputs({
    providedOwnerInputs: input.providedOwnerInputs ?? [],
    requiredOwnerInputs: requiredOwners
  });
  const status = assessmentStatus({
    adapterBasis: input.adapterBasis,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    targetOutputs
  });
  const readyOutputs = status === "ready_for_runtime_corridor"
    ? targetOutputs.filter((output) => !LOW_FREQUENCY_OUTPUTS.includes(output as (typeof LOW_FREQUENCY_OUTPUTS)[number]))
    : [];
  const blockedOutputs = status === "blocked_low_frequency_owner"
    ? targetOutputs.filter((output) => LOW_FREQUENCY_OUTPUTS.includes(output as (typeof LOW_FREQUENCY_OUTPUTS)[number]))
    : [];
  const unsupportedOutputs =
    status === "unsupported_basis" || status === "runtime_owner_missing" ? targetOutputs : [];

  return {
    adapterBasis: input.adapterBasis,
    blockedOutputs,
    id: input.id,
    labBudgetAliasAllowed: false,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    readyOutputs,
    requiredOwnerInputs: requiredOwners,
    requiredPhysicalInputs: group.requiredPhysicalInputs,
    runtimePromotionAllowedAtGateBI: false,
    status,
    targetOutputs,
    unsupportedOutputs
  };
}

export function buildPersonalUseMvpCoverageSprintGateBIScenarioPack():
  readonly PersonalUseMvpCoverageSprintGateBIAssessment[] {
  return [
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "field_apparent",
      id: "gate_bi_complete_field_apparent_ready_for_gate_bj_runtime_corridor",
      providedOwnerInputs: GATE_BI_FIELD_APPARENT_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS,
      targetOutputs: ["L'n,w", "L'nT,w"]
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "field_apparent",
      id: "gate_bi_field_low_frequency_owner_missing",
      providedOwnerInputs: GATE_BI_FIELD_APPARENT_OWNER_INPUTS.filter(
        (owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner"
      ),
      providedPhysicalInputs: GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS,
      targetOutputs: ["L'nT,50"]
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "field_apparent",
      id: "gate_bi_field_missing_separating_area_needs_input",
      providedOwnerInputs: GATE_BI_FIELD_APPARENT_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BI_FIELD_APPARENT_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "partitionAreaM2"
      ),
      targetOutputs: ["L'n,w", "L'nT,w"]
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "building_prediction",
      id: "gate_bi_building_complete_physical_context_runtime_owners_missing",
      providedOwnerInputs: [],
      providedPhysicalInputs: GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS,
      targetOutputs: ["L'nT,w", "L'nT,50"]
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "building_prediction",
      id: "gate_bi_building_missing_junction_coupling_needs_input",
      providedOwnerInputs: GATE_BI_BUILDING_PREDICTION_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BI_BUILDING_PREDICTION_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "junctionCouplingLengthM"
      ),
      targetOutputs: ["L'nT,w"]
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "astm_rating_boundary",
      id: "gate_bi_astm_iic_aiic_remains_unsupported",
      targetOutputs: ASTM_IMPACT_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBIAdapter({
      adapterBasis: "element_lab",
      id: "gate_bi_lab_lnw_delta_lw_budget_not_field_building_alias",
      targetOutputs: LAB_IMPACT_OUTPUTS
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBIContract():
  PersonalUseMvpCoverageSprintGateBIContract {
  const gateBH = buildPersonalUseMvpCoverageSprintGateBHLandingContract();
  const gateBHRows = buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix();
  const gateBHSummary = summarizePersonalUseMvpCoverageSprintGateBH(gateBHRows);
  const selectedLane = rankPersonalUseMvpCoverageSprintGateBILanes(gateBHRows).find(
    (candidate) => candidate.selected
  );

  if (
    gateBH.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE ||
    gateBHSummary.selectedGateBILane !== "floor_impact_field_building_adapter_contract" ||
    selectedLane?.id !== "floor_impact_field_building_adapter_contract"
  ) {
    throw new Error("Gate BI can only land after Gate BH selects the floor-impact field/building adapter contract.");
  }

  return {
    astmImpactAdapterAdded: false,
    buildingPredictionRuntimePromoted: false,
    companyInternalCalculationGradeNextLane: true,
    currentFieldRowsPreserved: {
      lPrimeNT50Db: 49,
      lPrimeNTwDb: 50.6,
      lPrimeNWDb: 53
    },
    fieldAndBuildingOwnersSeparated: true,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_LANDED_GATE,
    labBudgetAliasedToFieldOrBuilding: false,
    noRuntimeValueMovement: true,
    ownerGroups: buildPersonalUseMvpCoverageSprintGateBIOwnerGroups(),
    previousGateBH: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
      selectedNextLane: "floor_impact_field_building_adapter_contract",
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS
    },
    scenarioPack: buildPersonalUseMvpCoverageSprintGateBIScenarioPack(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bh_floor_impact_field_building_adapter_contract",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BI_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
