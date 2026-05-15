import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  assessCompanyInternalOpeningLeakAWeightedAdapter,
  buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS,
  type CompanyInternalOpeningLeakAWeightedAdapterStatus,
  type CompanyInternalOpeningLeakAWeightedOwnerInput
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_landed_no_runtime_selected_runtime_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_runtime_corridor_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL =
  "opening/leak Dn,A / DnT,A spectrum-adapter runtime corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_source_absent_formula_corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB = -0.8;
export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB = 1;

export type CompanyInternalOpeningLeakAWeightedFormulaAdapterBasis =
  | "building_prediction"
  | "field_apparent";

export type CompanyInternalOpeningLeakAWeightedFormulaMetricId = "Dn,A" | "DnT,A";
export type CompanyInternalOpeningLeakAWeightedFormulaBaseMetricId = "Dn,w" | "DnT,w";

export type CompanyInternalOpeningLeakAWeightedFormulaTerm = {
  basis: "owned_formula_term" | "source_absent_formula_design_term";
  description: string;
  requiredInputs: readonly string[];
  runtimeOwnedInGate: false;
  termId: string;
};

export type CompanyInternalOpeningLeakAWeightedFormulaBudgetTerm = {
  basis: "inherited_base_runtime_budget" | "source_absent_formula_design_budget";
  db: number;
  termId: string;
};

export type CompanyInternalOpeningLeakAWeightedFormulaBudget = {
  adapterBudgetDb: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB;
  baseErrorBudgetDb:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB;
  metricId: CompanyInternalOpeningLeakAWeightedFormulaMetricId;
  notMeasuredEvidence: true;
  terms: readonly CompanyInternalOpeningLeakAWeightedFormulaBudgetTerm[];
  totalBudgetDb: number;
};

export type CompanyInternalOpeningLeakAWeightedFormulaCandidate = {
  adapterBasis: CompanyInternalOpeningLeakAWeightedFormulaAdapterBasis;
  basisId: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS;
  baseMetricId: CompanyInternalOpeningLeakAWeightedFormulaBaseMetricId;
  baseRuntimeMethod:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD;
  baseValueDb: number;
  corridorStatus: "formula_corridor_defined_runtime_gate_required";
  designCorridorEstimateDb: number;
  exactAWeightedSourceRowsRemainPrecedence: true;
  formulaTerms: readonly CompanyInternalOpeningLeakAWeightedFormulaTerm[];
  metricId: CompanyInternalOpeningLeakAWeightedFormulaMetricId;
  ownedAdapterDb: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB;
  proposedRuntimeEstimateDb: null;
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedInGate: false;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceBudget: CompanyInternalOpeningLeakAWeightedFormulaBudget;
};

export type CompanyInternalOpeningLeakAWeightedFormulaNegativeBoundary = {
  adapterBasis: string;
  expectedDesignCorridorEstimateDb: null;
  missingOwnerInputs?: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  missingPhysicalInputs?: readonly AcousticInputFieldId[];
  reason: string;
  scenarioStatus: CompanyInternalOpeningLeakAWeightedAdapterStatus | "exact_precedence_reserved";
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs?: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAWeightedFormulaCorridorContract = {
  adapterDb: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB;
  basisAliasBlocked: {
    astmIicAiic: true;
    buildingDnA: true;
    labRwOrStc: true;
  };
  candidateFormulaCorridors: readonly CompanyInternalOpeningLeakAWeightedFormulaCandidate[];
  currentRuntimeValueMovement: false;
  exactAWeightedSourceRowsRemainPrecedence: true;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE;
  negativeBoundaries: readonly CompanyInternalOpeningLeakAWeightedFormulaNegativeBoundary[];
  previousOwnerLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE;
  previousOwnerSelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION;
  previousOwnerSelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE;
  previousOwnerSelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS;
  runtimePromotionAllowedInGate: false;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

const FORMULA_TERMS: readonly CompanyInternalOpeningLeakAWeightedFormulaTerm[] = [
  {
    basis: "owned_formula_term",
    description:
      "A-weighted companions start from the same opening/leak field or building base value that already owns its context, not from lab Rw or STC.",
    requiredInputs: ["sameRouteBaseRuntime", "targetMetricBasis"],
    runtimeOwnedInGate: false,
    termId: "same_route_base_weighted_level"
  },
  {
    basis: "owned_formula_term",
    description:
      "The ISO 717 C or equivalent A-weighted adapter must be owned for this opening/leak route before Dn,A or DnT,A can promote.",
    requiredInputs: ["iso717COrAWeightedSpectrumAdapterOwner", "frequencyBandSet"],
    runtimeOwnedInGate: false,
    termId: "iso_717_c_or_a_weighted_adapter"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "The current C adapter is a bounded single-number adapter over the owned third-octave band set, not measured A-weighted evidence.",
    requiredInputs: ["frequencyBandSet", "sameRouteOpeningLeakAWeightedSpectrumCurveOwner"],
    runtimeOwnedInGate: false,
    termId: "owned_third_octave_band_set"
  },
  {
    basis: "owned_formula_term",
    description:
      "A future exact same-basis A-weighted opening/leak packet must remain above this formula corridor in candidate precedence.",
    requiredInputs: ["exactAWeightedOpeningPacketPrecedenceOwner"],
    runtimeOwnedInGate: false,
    termId: "exact_a_weighted_packet_precedence"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "The adapter adds its own explicit budget term on top of the existing field/building opening/leak budget.",
    requiredInputs: ["aWeightedOpeningLeakUncertaintyBudgetOwner"],
    runtimeOwnedInGate: false,
    termId: "a_weighted_adapter_uncertainty_budget"
  }
] as const;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function buildBudget(input: {
  baseErrorBudgetDb:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB;
  metricId: CompanyInternalOpeningLeakAWeightedFormulaMetricId;
}): CompanyInternalOpeningLeakAWeightedFormulaBudget {
  return {
    adapterBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
    baseErrorBudgetDb: input.baseErrorBudgetDb,
    metricId: input.metricId,
    notMeasuredEvidence: true,
    terms: [
      {
        basis: "inherited_base_runtime_budget",
        db: input.baseErrorBudgetDb,
        termId: "opening_leak_field_building_base_runtime_budget"
      },
      {
        basis: "source_absent_formula_design_budget",
        db: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB,
        termId: "a_weighted_single_number_adapter_surrogate"
      }
    ],
    totalBudgetDb: input.baseErrorBudgetDb + COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_BUDGET_DB
  };
}

function buildCandidate(input: {
  adapterBasis: CompanyInternalOpeningLeakAWeightedFormulaAdapterBasis;
  baseErrorBudgetDb:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB;
  baseMetricId: CompanyInternalOpeningLeakAWeightedFormulaBaseMetricId;
  baseRuntimeMethod:
    | typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD
    | typeof COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD;
  baseValueDb: number;
  metricId: CompanyInternalOpeningLeakAWeightedFormulaMetricId;
  requiredOwnerInputs: readonly CompanyInternalOpeningLeakAWeightedOwnerInput[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
}): CompanyInternalOpeningLeakAWeightedFormulaCandidate {
  return {
    adapterBasis: input.adapterBasis,
    basisId: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_BASIS,
    baseMetricId: input.baseMetricId,
    baseRuntimeMethod: input.baseRuntimeMethod,
    baseValueDb: input.baseValueDb,
    corridorStatus: "formula_corridor_defined_runtime_gate_required",
    designCorridorEstimateDb: round1(
      input.baseValueDb + COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB
    ),
    exactAWeightedSourceRowsRemainPrecedence: true,
    formulaTerms: FORMULA_TERMS,
    metricId: input.metricId,
    ownedAdapterDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
    proposedRuntimeEstimateDb: null,
    requiredOwnerInputs: input.requiredOwnerInputs,
    requiredPhysicalInputs: input.requiredPhysicalInputs,
    runtimePromotionAllowedInGate: false,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceBudget: buildBudget({
      baseErrorBudgetDb: input.baseErrorBudgetDb,
      metricId: input.metricId
    })
  };
}

function negativeFromAssessment(input: {
  id: string;
  reason: string;
}): CompanyInternalOpeningLeakAWeightedFormulaNegativeBoundary {
  const ownerContract = buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract();
  const assessment = ownerContract.scenarioPack.find((scenario) => scenario.id === input.id);

  if (!assessment) {
    throw new Error(`Missing A-weighted owner assessment ${input.id}.`);
  }

  return {
    adapterBasis: assessment.adapterBasis,
    expectedDesignCorridorEstimateDb: null,
    missingOwnerInputs: assessment.missingOwnerInputs,
    missingPhysicalInputs: assessment.missingPhysicalInputs,
    reason: input.reason,
    scenarioStatus: assessment.status,
    targetOutputs: assessment.targetOutputs,
    unsupportedOutputs: assessment.unsupportedOutputs
  };
}

export function buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract():
  CompanyInternalOpeningLeakAWeightedFormulaCorridorContract {
  const ownerContract = buildCompanyInternalOpeningLeakAWeightedAdapterOwnerContract();

  if (
    ownerContract.selectedNextAction !==
    COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE
  ) {
    throw new Error("Opening/leak A-weighted formula corridor can only land after the owner contract selects it.");
  }

  const fieldProbe = ownerContract.currentRuntimeProbes.fieldAWeightedProbe;
  const buildingProbe = ownerContract.currentRuntimeProbes.buildingAWeightedProbe;

  if (
    !finiteNumber(fieldProbe.computedDnWDb) ||
    !finiteNumber(fieldProbe.computedDnTwDb) ||
    !finiteNumber(buildingProbe.computedDnTwDb)
  ) {
    throw new Error("Opening/leak A-weighted formula corridor is missing same-route base values.");
  }

  const missingFrequencyBandSet = assessCompanyInternalOpeningLeakAWeightedAdapter({
    adapterBasis: "field_apparent",
    id: "company_internal_opening_leak_field_a_weighted_missing_frequency_band_set",
    providedOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
    providedPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS.filter(
      (fieldId) => fieldId !== "frequencyBandSet"
    ),
    targetOutputs: ["DnT,A"]
  });

  return {
    adapterDb: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_DB,
    basisAliasBlocked: {
      astmIicAiic: true,
      buildingDnA: true,
      labRwOrStc: true
    },
    candidateFormulaCorridors: [
      buildCandidate({
        adapterBasis: "field_apparent",
        baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
        baseMetricId: "Dn,w",
        baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
        baseValueDb: fieldProbe.computedDnWDb,
        metricId: "Dn,A",
        requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
        requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
      }),
      buildCandidate({
        adapterBasis: "field_apparent",
        baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB,
        baseMetricId: "DnT,w",
        baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
        baseValueDb: fieldProbe.computedDnTwDb,
        metricId: "DnT,A",
        requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_OWNER_INPUTS,
        requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_PHYSICAL_INPUTS
      }),
      buildCandidate({
        adapterBasis: "building_prediction",
        baseErrorBudgetDb: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
        baseMetricId: "DnT,w",
        baseRuntimeMethod: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
        baseValueDb: buildingProbe.computedDnTwDb,
        metricId: "DnT,A",
        requiredOwnerInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_OWNER_INPUTS,
        requiredPhysicalInputs: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_PHYSICAL_INPUTS
      })
    ],
    currentRuntimeValueMovement: false,
    exactAWeightedSourceRowsRemainPrecedence: true,
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_LANDED_GATE,
    negativeBoundaries: [
      {
        adapterBasis: missingFrequencyBandSet.adapterBasis,
        expectedDesignCorridorEstimateDb: null,
        missingPhysicalInputs: missingFrequencyBandSet.missingPhysicalInputs,
        reason: "The formula corridor must not run without the owned opening/leak A-weighted frequency-band set.",
        scenarioStatus: missingFrequencyBandSet.status,
        targetOutputs: missingFrequencyBandSet.targetOutputs
      },
      negativeFromAssessment({
        id: "company_internal_opening_leak_field_a_weighted_missing_spectrum_owner",
        reason: "A same-route opening/leak A-weighted spectrum curve owner is required before using the C adapter."
      }),
      negativeFromAssessment({
        id: "company_internal_opening_leak_building_dna_stays_out_of_building_owner",
        reason: "Building opening/leak Dn,A remains unsupported because the current building route owns only R'w and DnT,w."
      }),
      negativeFromAssessment({
        id: "company_internal_opening_leak_lab_rw_stc_not_a_weighted_alias",
        reason: "Lab Rw/STC cannot be relabelled as field/building Dn,A or DnT,A."
      }),
      negativeFromAssessment({
        id: "company_internal_opening_leak_astm_iic_aiic_not_airborne_a_weighted_adapter",
        reason: "ASTM IIC/AIIC impact outputs are outside the airborne A-weighted adapter route."
      }),
      {
        adapterBasis: "exact_source_row",
        expectedDesignCorridorEstimateDb: null,
        reason: "A true same-basis exact A-weighted opening/leak packet would outrank this formula, but no such row is promoted in this gate.",
        scenarioStatus: "exact_precedence_reserved",
        targetOutputs: ["Dn,A", "DnT,A"]
      }
    ],
    previousOwnerLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_LANDED_GATE,
    previousOwnerSelectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_ACTION,
    previousOwnerSelectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTED_NEXT_FILE,
    previousOwnerSelectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_ADAPTER_OWNER_SELECTION_STATUS,
    runtimePromotionAllowedInGate: false,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FORMULA_CORRIDOR_SELECTION_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function assertCompanyInternalOpeningLeakAWeightedFormulaCorridorContract(
  contract: CompanyInternalOpeningLeakAWeightedFormulaCorridorContract =
    buildCompanyInternalOpeningLeakAWeightedFormulaCorridorContract()
): void {
  const candidateByKey = new Map(
    contract.candidateFormulaCorridors.map((candidate) => [
      `${candidate.adapterBasis}:${candidate.metricId}`,
      candidate
    ])
  );

  if (
    candidateByKey.get("field_apparent:Dn,A")?.designCorridorEstimateDb !== 35.9 ||
    candidateByKey.get("field_apparent:DnT,A")?.designCorridorEstimateDb !== 36.1 ||
    candidateByKey.get("building_prediction:DnT,A")?.designCorridorEstimateDb !== 31.3
  ) {
    throw new Error("Opening/leak A-weighted formula corridor pins moved.");
  }

  if (
    contract.runtimePromotionAllowedInGate ||
    contract.currentRuntimeValueMovement ||
    contract.candidateFormulaCorridors.some((candidate) => candidate.proposedRuntimeEstimateDb !== null)
  ) {
    throw new Error("Opening/leak A-weighted formula corridor promoted runtime too early.");
  }

  if (
    contract.candidateFormulaCorridors.some(
      (candidate) => candidate.requiredPhysicalInputs.includes("frequencyBandSet") === false
    )
  ) {
    throw new Error("Opening/leak A-weighted formula corridor lost the frequencyBandSet input owner.");
  }
}
