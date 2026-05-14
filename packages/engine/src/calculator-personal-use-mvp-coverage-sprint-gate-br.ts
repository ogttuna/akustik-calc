import type { AcousticInputFieldId, ImpactOnlyCalculation, RequestedOutputId } from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import { GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT } from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  buildPersonalUseMvpCoverageSprintGateBQContract,
  buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
  rankPersonalUseMvpCoverageSprintGateBRLanes,
  summarizePersonalUseMvpCoverageSprintGateBQ
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bq";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE =
  "gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS =
  "gate_br_personal_use_mvp_floor_impact_astm_iic_aiic_adapter_contract_landed_no_runtime_selected_runtime_corridor_gate_bs";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION =
  "gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL =
  "floor-impact ASTM IIC/AIIC runtime corridor";

export type PersonalUseMvpCoverageSprintGateBRAdapterBasis =
  | "astm_field_aiic"
  | "astm_lab_iic"
  | "building_prediction"
  | "iso_field_impact"
  | "iso_lab_impact";

export type PersonalUseMvpCoverageSprintGateBRAdapterStatus =
  | "blocked_basis_alias"
  | "needs_input"
  | "ready_for_runtime_corridor"
  | "runtime_owner_missing"
  | "unsupported_basis";

export type PersonalUseMvpCoverageSprintGateBROwnerInput =
  | "astmE492NormalizedImpactCurveOwner"
  | "astmE989AiicApparentRatingOwner"
  | "astmE989IicContourRatingOwner"
  | "astmE1007OrFieldImpactCurveOwner"
  | "astmFieldImpactUncertaintyBudgetOwner"
  | "astmImpactUncertaintyBudgetOwner"
  | "exactAstmSourcePrecedenceOwner"
  | "fieldApparentNonAliasBoundaryOwner"
  | "isoLnWDeltaLwNonAliasBoundaryOwner"
  | "visibleSurfaceParityOwner";

export type PersonalUseMvpCoverageSprintGateBROwnerGroup = {
  adapterBasis: Extract<PersonalUseMvpCoverageSprintGateBRAdapterBasis, "astm_field_aiic" | "astm_lab_iic">;
  id: "astm_field_aiic_adapter_owners" | "astm_lab_iic_adapter_owners";
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBRAssessmentInput = {
  adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis;
  id: string;
  providedOwnerInputs?: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  providedPhysicalInputs?: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBRAssessment = {
  adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis;
  blockedOutputs: readonly RequestedOutputId[];
  id: string;
  isoLnWOrDeltaLwAliasAllowed: false;
  missingOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedAtGateBR: false;
  status: PersonalUseMvpCoverageSprintGateBRAdapterStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot = {
  aiicDb: null;
  iicDb: null;
  impactBasisPresentButNotAstm: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
  warningIncludesUnsupportedAstmOutputs: boolean;
};

export type PersonalUseMvpCoverageSprintGateBSLaneId =
  | "astm_iic_aiic_runtime_corridor"
  | "astm_iic_aiic_surface_parity"
  | "broad_astm_source_crawl"
  | "field_aiic_low_frequency_companion_contract"
  | "iso_floor_impact_reopen";

export type PersonalUseMvpCoverageSprintGateBSLaneCandidate = {
  broadSourceCrawl: boolean;
  id: PersonalUseMvpCoverageSprintGateBSLaneId;
  reason: string;
  runtimeMovementAllowedAtGateBR: false;
  score: number;
  selected: boolean;
  sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBRContract = {
  aiicAliasedToFieldImpact: false;
  astmImpactRuntimePromoted: false;
  exactAstmSourcePrecedenceRequired: true;
  fieldOrBuildingMetricsAliasedToAstm: false;
  iicAliasedToIsoLnWOrDeltaLw: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE;
  noRuntimeValueMovement: true;
  ownerGroups: readonly PersonalUseMvpCoverageSprintGateBROwnerGroup[];
  previousGateBQ: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE;
    selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL;
    selectedNextLane: "floor_impact_astm_iic_aiic_adapter_contract";
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS;
  };
  runtimeBoundarySnapshot: PersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot;
  scenarioPack: readonly PersonalUseMvpCoverageSprintGateBRAssessment[];
  selectedImplementationSlice:
    "personal_use_mvp_coverage_sprint_after_gate_bq_floor_impact_astm_iic_aiic_adapter_contract";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const ASTM_IIC_OUTPUTS = ["IIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_AIIC_OUTPUTS = ["AIIC"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

export const GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS = [
  "outputBasis",
  "frequencyBandSet",
  "exactSourcePrecedenceCheck"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS = [
  "outputBasis",
  "frequencyBandSet",
  "impactFieldContext",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "exactSourcePrecedenceCheck"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS = [
  "astmE492NormalizedImpactCurveOwner",
  "astmE989IicContourRatingOwner",
  "astmImpactUncertaintyBudgetOwner",
  "exactAstmSourcePrecedenceOwner",
  "isoLnWDeltaLwNonAliasBoundaryOwner",
  "visibleSurfaceParityOwner"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];

export const GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS = [
  "astmE1007OrFieldImpactCurveOwner",
  "astmE989AiicApparentRatingOwner",
  "astmFieldImpactUncertaintyBudgetOwner",
  "exactAstmSourcePrecedenceOwner",
  "fieldApparentNonAliasBoundaryOwner",
  "visibleSurfaceParityOwner"
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];

const LAB_IIC_OWNER_GROUP = {
  adapterBasis: "astm_lab_iic",
  id: "astm_lab_iic_adapter_owners",
  requiredOwnerInputs: GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS,
  requiredPhysicalInputs: GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS,
  targetOutputs: ASTM_IIC_OUTPUTS
} as const satisfies PersonalUseMvpCoverageSprintGateBROwnerGroup;

const FIELD_AIIC_OWNER_GROUP = {
  adapterBasis: "astm_field_aiic",
  id: "astm_field_aiic_adapter_owners",
  requiredOwnerInputs: GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS,
  requiredPhysicalInputs: GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS,
  targetOutputs: ASTM_AIIC_OUTPUTS
} as const satisfies PersonalUseMvpCoverageSprintGateBROwnerGroup;

const GATE_BS_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_runtime_corridor",
    reason:
      "Gate BR has separated lab IIC and field AIIC owners, so the next useful step is to test whether a runtime corridor can promote only from owned ASTM impact bands without ISO Ln,w aliasing.",
    runtimeMovementAllowedAtGateBR: false,
    score: 3.6,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_iic_aiic_surface_parity",
    reason:
      "Surface parity is required if runtime promotes, but adapter ownership must first prove whether any runtime corridor can safely exist.",
    runtimeMovementAllowedAtGateBR: false,
    score: 2.4,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "field_aiic_low_frequency_companion_contract",
    reason:
      "Low-frequency ASTM companions are valuable, but they should follow the base IIC/AIIC adapter contract and not define the first ASTM lane.",
    runtimeMovementAllowedAtGateBR: false,
    score: 1.1,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "iso_floor_impact_reopen",
    reason:
      "Current ISO floor-impact lanes already have formula support or explicit needs-input boundaries, so reopening them is lower ROI than resolving the ASTM adapter gap.",
    runtimeMovementAllowedAtGateBR: false,
    score: 0.8,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: true,
    id: "broad_astm_source_crawl",
    reason:
      "ASTM source rows can become exact overrides later, but broad crawling still would not define source-absent IIC/AIIC behavior.",
    runtimeMovementAllowedAtGateBR: false,
    score: 0.3,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBSLaneCandidate[];

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function ownerGroupFor(
  adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis
): PersonalUseMvpCoverageSprintGateBROwnerGroup | null {
  if (adapterBasis === "astm_lab_iic") {
    return LAB_IIC_OWNER_GROUP;
  }

  if (adapterBasis === "astm_field_aiic") {
    return FIELD_AIIC_OWNER_GROUP;
  }

  return null;
}

function missingPhysicalInputs(input: {
  group: PersonalUseMvpCoverageSprintGateBROwnerGroup;
  providedPhysicalInputs: readonly AcousticInputFieldId[];
}): AcousticInputFieldId[] {
  return input.group.requiredPhysicalInputs.filter(
    (fieldId) => !input.providedPhysicalInputs.includes(fieldId)
  );
}

function missingOwnerInputs(input: {
  providedOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  requiredOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
}): PersonalUseMvpCoverageSprintGateBROwnerInput[] {
  return input.requiredOwnerInputs.filter((owner) => !input.providedOwnerInputs.includes(owner));
}

function hasOnlyGroupOutputs(input: {
  group: PersonalUseMvpCoverageSprintGateBROwnerGroup;
  targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return input.targetOutputs.every((output) => input.group.targetOutputs.includes(output));
}

function aliasBlockedBasis(adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis): boolean {
  return adapterBasis === "iso_lab_impact" || adapterBasis === "iso_field_impact";
}

function unsupportedOutputsFor(input: {
  group: PersonalUseMvpCoverageSprintGateBROwnerGroup;
  status: PersonalUseMvpCoverageSprintGateBRAdapterStatus;
  targetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  if (
    input.status === "blocked_basis_alias" ||
    input.status === "runtime_owner_missing" ||
    input.status === "unsupported_basis"
  ) {
    return [...input.targetOutputs];
  }

  return input.targetOutputs.filter((output) => !input.group.targetOutputs.includes(output));
}

function assessmentStatus(input: {
  adapterBasis: PersonalUseMvpCoverageSprintGateBRAdapterBasis;
  group: PersonalUseMvpCoverageSprintGateBROwnerGroup | null;
  missingOwnerInputs: readonly PersonalUseMvpCoverageSprintGateBROwnerInput[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  targetOutputs: readonly RequestedOutputId[];
}): PersonalUseMvpCoverageSprintGateBRAdapterStatus {
  if (aliasBlockedBasis(input.adapterBasis)) {
    return "blocked_basis_alias";
  }

  if (!input.group || !hasOnlyGroupOutputs({ group: input.group, targetOutputs: input.targetOutputs })) {
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

export function buildPersonalUseMvpCoverageSprintGateBROwnerGroups():
  readonly PersonalUseMvpCoverageSprintGateBROwnerGroup[] {
  return [LAB_IIC_OWNER_GROUP, FIELD_AIIC_OWNER_GROUP];
}

export function assessPersonalUseMvpCoverageSprintGateBRAdapter(
  input: PersonalUseMvpCoverageSprintGateBRAssessmentInput
): PersonalUseMvpCoverageSprintGateBRAssessment {
  const group = ownerGroupFor(input.adapterBasis);
  const targetOutputs = unique(input.targetOutputs);
  const physicalMissing = group
    ? missingPhysicalInputs({
      group,
      providedPhysicalInputs: input.providedPhysicalInputs ?? []
    })
    : [];
  const ownerMissing = group
    ? missingOwnerInputs({
      providedOwnerInputs: input.providedOwnerInputs ?? [],
      requiredOwnerInputs: group.requiredOwnerInputs
    })
    : [];
  const status = assessmentStatus({
    adapterBasis: input.adapterBasis,
    group,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    targetOutputs
  });
  const readyOutputs = status === "ready_for_runtime_corridor" ? targetOutputs : [];
  const blockedOutputs = status === "needs_input" ? targetOutputs : [];
  const unsupportedOutputs = group
    ? unsupportedOutputsFor({ group, status, targetOutputs })
    : targetOutputs;

  return {
    adapterBasis: input.adapterBasis,
    blockedOutputs,
    id: input.id,
    isoLnWOrDeltaLwAliasAllowed: false,
    missingOwnerInputs: ownerMissing,
    missingPhysicalInputs: physicalMissing,
    readyOutputs,
    requiredOwnerInputs: group?.requiredOwnerInputs ?? [],
    requiredPhysicalInputs: group?.requiredPhysicalInputs ?? [],
    runtimePromotionAllowedAtGateBR: false,
    status,
    targetOutputs,
    unsupportedOutputs
  };
}

export function buildPersonalUseMvpCoverageSprintGateBRScenarioPack():
  readonly PersonalUseMvpCoverageSprintGateBRAssessment[] {
  return [
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "astm_lab_iic",
      id: "gate_br_complete_lab_iic_ready_for_gate_bs_runtime_corridor",
      providedOwnerInputs: GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS,
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "astm_lab_iic",
      id: "gate_br_lab_iic_missing_frequency_bands_needs_input",
      providedOwnerInputs: GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "frequencyBandSet"
      ),
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "astm_lab_iic",
      id: "gate_br_lab_iic_missing_rating_owner_runtime_owner_missing",
      providedOwnerInputs: GATE_BR_ASTM_LAB_IIC_OWNER_INPUTS.filter(
        (owner) => owner !== "astmE989IicContourRatingOwner"
      ),
      providedPhysicalInputs: GATE_BR_ASTM_LAB_IIC_PHYSICAL_INPUTS,
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "astm_field_aiic",
      id: "gate_br_complete_field_aiic_ready_for_gate_bs_runtime_corridor",
      providedOwnerInputs: GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS,
      targetOutputs: ASTM_AIIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "astm_field_aiic",
      id: "gate_br_field_aiic_missing_rt60_needs_input",
      providedOwnerInputs: GATE_BR_ASTM_FIELD_AIIC_OWNER_INPUTS,
      providedPhysicalInputs: GATE_BR_ASTM_FIELD_AIIC_PHYSICAL_INPUTS.filter(
        (fieldId) => fieldId !== "receivingRoomRt60S"
      ),
      targetOutputs: ASTM_AIIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "iso_lab_impact",
      id: "gate_br_iso_lnw_delta_lw_not_iic_alias",
      targetOutputs: ASTM_IIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "iso_field_impact",
      id: "gate_br_iso_field_lprime_not_aiic_alias",
      targetOutputs: ASTM_AIIC_OUTPUTS
    }),
    assessPersonalUseMvpCoverageSprintGateBRAdapter({
      adapterBasis: "building_prediction",
      id: "gate_br_building_prediction_not_astm_aiic_alias",
      targetOutputs: ASTM_IMPACT_OUTPUTS
    })
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation():
  ImpactOnlyCalculation {
  return calculateImpactOnly([], {
    impactPredictorInput: GATE_BO_REINFORCED_CONCRETE_COMPLETE_INPUT,
    targetOutputs: ASTM_IMPACT_OUTPUTS
  });
}

export function buildPersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot():
  PersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot {
  const result = buildPersonalUseMvpCoverageSprintGateBRCurrentBoundaryCalculation();

  return {
    aiicDb: null,
    iicDb: null,
    impactBasisPresentButNotAstm: result.impact?.basis ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs,
    warningIncludesUnsupportedAstmOutputs: result.warnings.some(
      (warning: string) => warning.includes("IIC") && warning.includes("AIIC")
    )
  };
}

export function rankPersonalUseMvpCoverageSprintGateBSLanes():
  readonly PersonalUseMvpCoverageSprintGateBSLaneCandidate[] {
  return GATE_BS_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBRContract():
  PersonalUseMvpCoverageSprintGateBRContract {
  const gateBQ = buildPersonalUseMvpCoverageSprintGateBQContract();
  const gateBQMatrix = buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix();
  const gateBQSummary = summarizePersonalUseMvpCoverageSprintGateBQ(gateBQMatrix);
  const gateBRLaneSelection = rankPersonalUseMvpCoverageSprintGateBRLanes(gateBQMatrix);

  if (
    gateBQ.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE ||
    gateBQSummary.selectedGateBRLane !== "floor_impact_astm_iic_aiic_adapter_contract" ||
    gateBRLaneSelection.selectedCandidate.id !== "floor_impact_astm_iic_aiic_adapter_contract"
  ) {
    throw new Error("Gate BR can only land after Gate BQ selects the floor-impact ASTM IIC/AIIC adapter contract.");
  }

  return {
    aiicAliasedToFieldImpact: false,
    astmImpactRuntimePromoted: false,
    exactAstmSourcePrecedenceRequired: true,
    fieldOrBuildingMetricsAliasedToAstm: false,
    iicAliasedToIsoLnWOrDeltaLw: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerGroups: buildPersonalUseMvpCoverageSprintGateBROwnerGroups(),
    previousGateBQ: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_FILE,
      selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_LABEL,
      selectedNextLane: "floor_impact_astm_iic_aiic_adapter_contract",
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS
    },
    runtimeBoundarySnapshot: buildPersonalUseMvpCoverageSprintGateBRRuntimeBoundarySnapshot(),
    scenarioPack: buildPersonalUseMvpCoverageSprintGateBRScenarioPack(),
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bq_floor_impact_astm_iic_aiic_adapter_contract",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BR_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
