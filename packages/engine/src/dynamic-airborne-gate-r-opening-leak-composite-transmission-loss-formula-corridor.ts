import type {
  AcousticInputFieldId,
  AirborneContext,
  AirborneOpeningLeakElement,
  AirborneOpeningRatingBasis,
  AirborneOpeningSealLeakageClass,
  RequestedOutputId
} from "@dynecho/shared";

import {
  buildGateQOpeningLeakCompositeAssessment,
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
  GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
  GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract";

export const GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN =
  "gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan";

export const GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS =
  "gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s";

export const GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION =
  "gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan";

export const GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts";

export const GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS =
  "area_energy_composite_transmission_loss_source_absent_formula_corridor";

export const GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB = 6;

export const GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS = [
  "hostWallRwCandidateOwner",
  "areaWeightedTransmissionCoefficientFormulaOwner",
  "openingRatingBasisPolicyOwner",
  "sealLeakagePenaltyTableOwner",
  "compositeUncertaintyBudgetOwner"
] as const;

export const GATE_R_OPENING_LEAK_COMPOSITE_CONDITIONAL_FORMULA_OWNER_INPUTS = [
  "sourceAbsentOpeningValueBudgetOwner"
] as const;

export type GateROpeningLeakCompositeHostWallRatingBasis =
  | "dynamic_family_candidate"
  | "exact_source_row"
  | "calibrated_source_anchor"
  | "unknown";

export type GateROpeningLeakCompositeScenarioId =
  | "gate_r_complete_average_seal_formula_corridor_defined"
  | "gate_r_missing_gate_q_physical_fields_blocked"
  | "gate_r_missing_formula_owner_blocked"
  | "gate_r_stc_only_opening_basis_blocked"
  | "gate_r_source_absent_opening_without_budget_owner_blocked"
  | "gate_r_building_prediction_outputs_blocked"
  | "gate_r_safe_reordered_openings_invariant";

export type GateROpeningLeakCompositeCorridorStatus =
  | "blocked_basis_alias"
  | "blocked_invalid_opening_input"
  | "blocked_missing_formula_input"
  | "blocked_missing_formula_owner"
  | "blocked_missing_physical_input"
  | "blocked_source_absent_opening_budget_owner"
  | "formula_corridor_defined_runtime_gate_required"
  | "not_element_lab_context"
  | "not_opening_route";

export type GateROpeningLeakCompositeFormulaOwnerInputs = {
  areaWeightedTransmissionCoefficientFormulaOwner?: boolean;
  compositeAreaTransmissionLossEnergyFormulaOwner?: boolean;
  compositeUncertaintyBudgetOwner?: boolean;
  hostWallCandidateBoundaryOwner?: boolean;
  hostWallRwCandidateOwner?: boolean;
  openingLeakagePenaltyFormulaOwner?: boolean;
  openingOriginPolicyOwner?: boolean;
  openingRatingBasisPolicyOwner?: boolean;
  sealLeakagePenaltyTableOwner?: boolean;
  sourceAbsentOpeningValueBudgetOwner?: boolean;
};

export type GateROpeningLeakCompositeFormulaInput = {
  airborneContext?: AirborneContext;
  hostWallRatingBasis?: GateROpeningLeakCompositeHostWallRatingBasis;
  hostWallRwDb?: number;
  openingRouteRequested?: boolean;
  owners?: GateROpeningLeakCompositeFormulaOwnerInputs;
  scenarioId: GateROpeningLeakCompositeScenarioId;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateROpeningLeakCompositeFormulaTerm = {
  basis: "owned_formula_term" | "source_absent_formula_design_term";
  description: string;
  requiredInputs: readonly string[];
  runtimeOwnedInGateR: false;
  termId: string;
};

export type GateROpeningLeakCompositeToleranceTerm = {
  basis: "source_absent_formula_design_budget";
  db: number;
  termId: string;
};

export type GateROpeningLeakCompositeToleranceBudget = {
  metricId: "Rw";
  notMeasuredEvidence: true;
  terms: readonly GateROpeningLeakCompositeToleranceTerm[];
  toleranceDb: typeof GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB;
  totalBudgetDb: typeof GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB;
};

export type GateROpeningLeakCompositeOpeningContribution = {
  areaM2: number;
  count: number;
  effectiveAreaM2: number;
  effectiveRwDb: number;
  id: string;
  leakagePenaltyDb: number;
  origin: NonNullable<AirborneOpeningLeakElement["origin"]>;
  ratingBasis: NonNullable<AirborneOpeningLeakElement["ratingBasis"]>;
  sealLeakageClass: NonNullable<AirborneOpeningLeakElement["sealLeakageClass"]>;
  transmissionCoefficient: number;
};

export type GateROpeningLeakCompositeAssessment = {
  affectedFormulaOutputs: readonly RequestedOutputId[];
  basisId: typeof GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS;
  blockedOutputs: readonly RequestedOutputId[];
  designCorridorEstimateDb: number | null;
  effectiveOpeningAreaM2: number | null;
  exactMeasuredRowsRemainPrecedence: true;
  formulaTerms: readonly GateROpeningLeakCompositeFormulaTerm[];
  hostNetWallAreaM2: number | null;
  hostWallRatingBasis: GateROpeningLeakCompositeHostWallRatingBasis | null;
  hostWallRwDb: number | null;
  hostileInputBoundaries: readonly string[];
  id: GateROpeningLeakCompositeScenarioId;
  missingFormulaInputs: readonly string[];
  missingFormulaOwnerInputs: readonly string[];
  missingInputContractOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  normalizedOpeningKeys: readonly string[];
  openingAreaRatio: number | null;
  openingContributions: readonly GateROpeningLeakCompositeOpeningContribution[];
  proposedRuntimeEstimateDb: null;
  requiredFormulaOwnerInputs: typeof GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS;
  requiredInputContractOwnerInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateR: false;
  runtimeValueMovement: false;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateROpeningLeakCompositeCorridorStatus;
  toleranceBudget: GateROpeningLeakCompositeToleranceBudget;
};

export type GateROpeningLeakCompositeSealDecisionRow = {
  designCorridorEstimateDb: number;
  effectiveOpeningRwDb: number;
  leakagePenaltyDb: number;
  sealLeakageClass: Exclude<AirborneOpeningSealLeakageClass, "unknown">;
};

export type GateROpeningLeakCompositeNegativeBoundary = {
  expectedDesignCorridorEstimateDb: null;
  reason: string;
  status: Exclude<
    GateROpeningLeakCompositeCorridorStatus,
    "formula_corridor_defined_runtime_gate_required"
  >;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateROpeningLeakCompositeFormulaCorridorContract = {
  basisAliasBlocked: {
    buildingPredictionMetrics: true;
    fieldRuntimeMetrics: true;
    stcOpeningBasisWithoutRwAdapter: true;
  };
  candidateFormulaAssessment: GateROpeningLeakCompositeAssessment;
  exactMeasuredRowsRemainPrecedence: true;
  landedGate: typeof GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN;
  negativeBoundaries: readonly GateROpeningLeakCompositeNegativeBoundary[];
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN;
  previousSelectionStatus: typeof GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS;
  runtimePromotionAllowedInGateR: false;
  runtimeValueMovement: false;
  sealLeakageDecisionTable: readonly GateROpeningLeakCompositeSealDecisionRow[];
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS;
  sourceRowsRequiredForFormulaDesign: false;
  sourceRowsRequiredForRuntimeSelection: false;
};

const GATE_R_LAB_FORMULA_OUTPUTS = new Set<RequestedOutputId>(["Rw"]);

const GATE_R_BLOCKED_OPENING_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "STC"
]);

const COMPLETE_OPENING_CONTEXT = {
  contextMode: "element_lab",
  hostWallAreaM2: 12,
  openingLeakElements: [
    {
      areaM2: 1.8,
      count: 1,
      elementRwDb: 32,
      id: "door-01",
      origin: "catalogued",
      ratingBasis: "rw_single_number",
      sealLeakageClass: "average"
    }
  ]
} as const satisfies AirborneContext;

const COMPLETE_OWNER_INPUTS = {
  areaWeightedTransmissionCoefficientFormulaOwner: true,
  compositeAreaTransmissionLossEnergyFormulaOwner: true,
  compositeUncertaintyBudgetOwner: true,
  hostWallCandidateBoundaryOwner: true,
  hostWallRwCandidateOwner: true,
  openingLeakagePenaltyFormulaOwner: true,
  openingOriginPolicyOwner: true,
  openingRatingBasisPolicyOwner: true,
  sealLeakagePenaltyTableOwner: true,
  sourceAbsentOpeningValueBudgetOwner: true
} as const satisfies GateROpeningLeakCompositeFormulaOwnerInputs;

const FORMULA_TERMS: readonly GateROpeningLeakCompositeFormulaTerm[] = [
  {
    basis: "owned_formula_term",
    description:
      "Host wall Rw must come from the selected host-wall candidate or exact host assembly; an opening row cannot replace the host wall.",
    requiredInputs: ["hostWallRwDb", "hostWallRatingBasis", "hostWallCandidateBoundaryOwner"],
    runtimeOwnedInGateR: false,
    termId: "host_wall_candidate_transmission_coefficient"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "Composite transmission loss is defined as an area-weighted sum of transmission coefficients before converting back to dB.",
    requiredInputs: ["hostWallAreaM2", "openingAreaM2", "openingCount", "openingElementRwDb"],
    runtimeOwnedInGateR: false,
    termId: "area_weighted_transmission_coefficient_sum"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "Opening leakage uses an explicit seal class penalty; sealed, average, leaky, and open-gap cases are not guessed from good/poor defaults.",
    requiredInputs: ["openingSealLeakageClass", "sealLeakagePenaltyTableOwner"],
    runtimeOwnedInGateR: false,
    termId: "opening_seal_leakage_penalty"
  },
  {
    basis: "owned_formula_term",
    description:
      "Opening element rating basis must be Rw/ISO lab compatible; STC-only inputs stay blocked until an explicit adapter owns that conversion.",
    requiredInputs: ["openingRatingBasis", "openingRatingBasisPolicyOwner"],
    runtimeOwnedInGateR: false,
    termId: "opening_rating_basis_policy"
  },
  {
    basis: "source_absent_formula_design_term",
    description:
      "The composite estimate remains a source-absent design corridor with a visible uncertainty budget, not a measured source row.",
    requiredInputs: ["compositeUncertaintyBudgetOwner"],
    runtimeOwnedInGateR: false,
    termId: "source_absent_composite_uncertainty_budget"
  }
] as const;

const TOLERANCE_TERMS = [
  {
    basis: "source_absent_formula_design_budget",
    db: 1.5,
    termId: "host_wall_candidate_residual"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.2,
    termId: "opening_single_number_basis_simplification"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.4,
    termId: "seal_leakage_penalty_surrogate"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 0.8,
    termId: "area_measurement_precision"
  },
  {
    basis: "source_absent_formula_design_budget",
    db: 1.1,
    termId: "same_stack_opening_holdout_absence"
  }
] as const satisfies readonly GateROpeningLeakCompositeToleranceTerm[];

const TOLERANCE_BUDGET = {
  metricId: "Rw",
  notMeasuredEvidence: true,
  terms: TOLERANCE_TERMS,
  toleranceDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB,
  totalBudgetDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB
} as const satisfies GateROpeningLeakCompositeToleranceBudget;

function positive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function positiveInteger(value: number | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundThree(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function requestedFormulaOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => GATE_R_LAB_FORMULA_OUTPUTS.has(output));
}

function blockedOpeningOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => GATE_R_BLOCKED_OPENING_OUTPUTS.has(output));
}

function openingRouteRequested(input: GateROpeningLeakCompositeFormulaInput): boolean {
  return input.openingRouteRequested === true ||
    typeof input.airborneContext?.hostWallAreaM2 === "number" ||
    (input.airborneContext?.openingLeakElements?.length ?? 0) > 0;
}

function openingSignature(opening: AirborneOpeningLeakElement): string {
  return [
    opening.id ?? "no-id",
    opening.areaM2 ?? "no-area",
    opening.count ?? "no-count",
    opening.elementRwDb ?? "no-rw",
    opening.ratingBasis ?? "no-rating-basis",
    opening.sealLeakageClass ?? "no-seal-class",
    opening.origin ?? "no-origin"
  ].join("|");
}

function normalizedOpeningKeys(openings: readonly AirborneOpeningLeakElement[]): string[] {
  return openings.map(openingSignature).sort((left, right) => left.localeCompare(right));
}

function leakagePenaltyDb(sealLeakageClass: AirborneOpeningSealLeakageClass): number | null {
  switch (sealLeakageClass) {
    case "sealed":
      return 0;
    case "average":
      return 2;
    case "leaky":
      return 6;
    case "open_gap":
      return 12;
    case "unknown":
      return null;
  }
}

function isRwCompatibleOpeningBasis(
  ratingBasis: AirborneOpeningRatingBasis | undefined
): ratingBasis is Exclude<AirborneOpeningRatingBasis, "unknown" | "stc_single_number"> {
  return ratingBasis === "rw_single_number" ||
    ratingBasis === "iso_717_1_curve" ||
    ratingBasis === "catalog_row" ||
    ratingBasis === "measured_lab";
}

function hasStcOnlyOpeningBasis(openings: readonly AirborneOpeningLeakElement[]): boolean {
  return openings.some((opening) => opening.ratingBasis === "stc_single_number");
}

function hasSourceAbsentOpening(openings: readonly AirborneOpeningLeakElement[]): boolean {
  return openings.some((opening) => opening.origin === "source_absent");
}

function missingFormulaInputs(input: GateROpeningLeakCompositeFormulaInput): string[] {
  const missing: string[] = [];

  if (!positive(input.hostWallRwDb)) {
    missing.push("hostWallRwDb");
  }

  if (!input.hostWallRatingBasis || input.hostWallRatingBasis === "unknown") {
    missing.push("hostWallRatingBasis");
  }

  return missing;
}

function missingInputContractOwnerInputs(
  owners: GateROpeningLeakCompositeFormulaOwnerInputs | undefined
): string[] {
  return GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS.filter((owner) => {
    switch (owner) {
      case "hostWallCandidateBoundaryOwner":
        return owners?.hostWallCandidateBoundaryOwner !== true;
      case "compositeAreaTransmissionLossEnergyFormulaOwner":
        return owners?.compositeAreaTransmissionLossEnergyFormulaOwner !== true;
      case "openingLeakagePenaltyFormulaOwner":
        return owners?.openingLeakagePenaltyFormulaOwner !== true;
      case "openingOriginPolicyOwner":
        return owners?.openingOriginPolicyOwner !== true;
      default:
        return true;
    }
  });
}

function missingFormulaOwnerInputs(
  input: GateROpeningLeakCompositeFormulaInput,
  openings: readonly AirborneOpeningLeakElement[]
): string[] {
  const owners = input.owners;
  const missing: string[] = GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS.filter((owner) => {
    switch (owner) {
      case "hostWallRwCandidateOwner":
        return owners?.hostWallRwCandidateOwner !== true;
      case "areaWeightedTransmissionCoefficientFormulaOwner":
        return owners?.areaWeightedTransmissionCoefficientFormulaOwner !== true;
      case "openingRatingBasisPolicyOwner":
        return owners?.openingRatingBasisPolicyOwner !== true;
      case "sealLeakagePenaltyTableOwner":
        return owners?.sealLeakagePenaltyTableOwner !== true;
      case "compositeUncertaintyBudgetOwner":
        return owners?.compositeUncertaintyBudgetOwner !== true;
      default:
        return true;
    }
  });

  if (hasSourceAbsentOpening(openings) && owners?.sourceAbsentOpeningValueBudgetOwner !== true) {
    missing.push("sourceAbsentOpeningValueBudgetOwner");
  }

  return missing;
}

function transmissionCoefficient(db: number): number {
  return 10 ** (-db / 10);
}

function buildOpeningContributions(
  openings: readonly AirborneOpeningLeakElement[]
): GateROpeningLeakCompositeOpeningContribution[] {
  return openings.map((opening, index) => {
    const penaltyDb = leakagePenaltyDb(opening.sealLeakageClass ?? "unknown");
    const effectiveRwDb = (opening.elementRwDb ?? 0) - (penaltyDb ?? 0);
    const areaM2 = opening.areaM2 ?? 0;
    const count = opening.count ?? 0;

    return {
      areaM2,
      count,
      effectiveAreaM2: roundThree(areaM2 * count),
      effectiveRwDb: roundOne(effectiveRwDb),
      id: opening.id ?? `opening-${String(index + 1)}`,
      leakagePenaltyDb: penaltyDb ?? 0,
      origin: opening.origin ?? "unknown",
      ratingBasis: opening.ratingBasis ?? "unknown",
      sealLeakageClass: opening.sealLeakageClass ?? "unknown",
      transmissionCoefficient: Number(transmissionCoefficient(effectiveRwDb).toPrecision(6))
    };
  });
}

function canComputeDesignCorridor(input: {
  context: AirborneContext | undefined;
  hostWallRwDb: number | undefined;
  openings: readonly AirborneOpeningLeakElement[];
}): boolean {
  if (!positive(input.context?.hostWallAreaM2) || !positive(input.hostWallRwDb)) {
    return false;
  }

  for (const opening of input.openings) {
    if (
      !positive(opening.areaM2) ||
      !positiveInteger(opening.count) ||
      !positive(opening.elementRwDb) ||
      !isRwCompatibleOpeningBasis(opening.ratingBasis) ||
      leakagePenaltyDb(opening.sealLeakageClass ?? "unknown") === null
    ) {
      return false;
    }
  }

  const effectiveOpeningAreaM2 = input.openings.reduce(
    (total, opening) => total + (opening.areaM2 ?? 0) * (opening.count ?? 0),
    0
  );

  return effectiveOpeningAreaM2 > 0 && effectiveOpeningAreaM2 <= (input.context?.hostWallAreaM2 ?? 0);
}

function computeDesignCorridor(input: {
  context: AirborneContext;
  hostWallRwDb: number;
  openings: readonly AirborneOpeningLeakElement[];
}): {
  designCorridorEstimateDb: number;
  effectiveOpeningAreaM2: number;
  hostNetWallAreaM2: number;
  openingAreaRatio: number;
  openingContributions: readonly GateROpeningLeakCompositeOpeningContribution[];
} {
  const hostWallAreaM2 = input.context.hostWallAreaM2 ?? 0;
  const openingContributions = buildOpeningContributions(input.openings);
  const effectiveOpeningAreaM2 = roundThree(
    openingContributions.reduce((total, opening) => total + opening.effectiveAreaM2, 0)
  );
  const hostNetWallAreaM2 = roundThree(hostWallAreaM2 - effectiveOpeningAreaM2);
  const hostTransmissionCoefficient = transmissionCoefficient(input.hostWallRwDb);
  const openingTauAreaSum = openingContributions.reduce((total, opening) => {
    return total + opening.effectiveAreaM2 * opening.transmissionCoefficient;
  }, 0);
  const totalTransmissionCoefficient =
    ((hostNetWallAreaM2 * hostTransmissionCoefficient) + openingTauAreaSum) / hostWallAreaM2;

  return {
    designCorridorEstimateDb: roundOne(-10 * Math.log10(totalTransmissionCoefficient)),
    effectiveOpeningAreaM2,
    hostNetWallAreaM2,
    openingAreaRatio: roundThree(effectiveOpeningAreaM2 / hostWallAreaM2),
    openingContributions
  };
}

function emptyComputedValues(): Pick<
  GateROpeningLeakCompositeAssessment,
  "designCorridorEstimateDb" |
  "effectiveOpeningAreaM2" |
  "hostNetWallAreaM2" |
  "openingAreaRatio" |
  "openingContributions"
> {
  return {
    designCorridorEstimateDb: null,
    effectiveOpeningAreaM2: null,
    hostNetWallAreaM2: null,
    openingAreaRatio: null,
    openingContributions: []
  };
}

export function buildGateROpeningLeakCompositeFormulaAssessment(
  input: GateROpeningLeakCompositeFormulaInput
): GateROpeningLeakCompositeAssessment {
  const affectedFormulaOutputs = requestedFormulaOutputs(input.targetOutputs);
  const blockedOutputs = blockedOpeningOutputs(input.targetOutputs);
  const openings = input.airborneContext?.openingLeakElements ?? [];
  const qAssessment = buildGateQOpeningLeakCompositeAssessment({
    airborneContext: input.airborneContext,
    openingRouteRequested: input.openingRouteRequested,
    owners: input.owners,
    scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
    targetOutputs: input.targetOutputs
  });
  const routeRequested = openingRouteRequested(input);
  const formulaInputsMissing = missingFormulaInputs(input);
  const inputContractOwnersMissing = missingInputContractOwnerInputs(input.owners);
  const formulaOwnersMissing = missingFormulaOwnerInputs(input, openings);
  const sourceAbsentBudgetMissing =
    hasSourceAbsentOpening(openings) &&
    input.owners?.sourceAbsentOpeningValueBudgetOwner !== true;
  const commonAssessment = {
    affectedFormulaOutputs,
    basisId: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
    blockedOutputs,
    exactMeasuredRowsRemainPrecedence: true,
    formulaTerms: FORMULA_TERMS,
    hostWallRatingBasis: input.hostWallRatingBasis ?? null,
    hostWallRwDb: positive(input.hostWallRwDb) ? input.hostWallRwDb : null,
    hostileInputBoundaries: qAssessment.hostileInputBoundaries,
    id: input.scenarioId,
    missingFormulaInputs: formulaInputsMissing,
    missingFormulaOwnerInputs: [...inputContractOwnersMissing, ...formulaOwnersMissing],
    missingInputContractOwnerInputs: inputContractOwnersMissing,
    missingPhysicalInputs: qAssessment.missingPhysicalInputs,
    normalizedOpeningKeys: normalizedOpeningKeys(openings),
    proposedRuntimeEstimateDb: null,
    requiredFormulaOwnerInputs: GATE_R_OPENING_LEAK_COMPOSITE_REQUIRED_FORMULA_OWNER_INPUTS,
    requiredInputContractOwnerInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateR: false,
    runtimeValueMovement: false,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceBudget: TOLERANCE_BUDGET
  } as const;

  if (!routeRequested) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "not_opening_route"
    };
  }

  if (input.airborneContext?.contextMode !== "element_lab") {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "not_element_lab_context"
    };
  }

  if (qAssessment.status === "invalid_input") {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_invalid_opening_input"
    };
  }

  if (qAssessment.status === "needs_input") {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_missing_physical_input"
    };
  }

  if (affectedFormulaOutputs.length === 0 || hasStcOnlyOpeningBasis(openings)) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_basis_alias"
    };
  }

  if (formulaInputsMissing.length > 0) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_missing_formula_input"
    };
  }

  if (sourceAbsentBudgetMissing) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_source_absent_opening_budget_owner"
    };
  }

  if (inputContractOwnersMissing.length > 0 || formulaOwnersMissing.length > 0) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_missing_formula_owner"
    };
  }

  const context = input.airborneContext;
  const hostWallRwDb = input.hostWallRwDb;

  if (!context || !positive(hostWallRwDb) || !canComputeDesignCorridor({
    context,
    hostWallRwDb,
    openings
  })) {
    return {
      ...commonAssessment,
      ...emptyComputedValues(),
      status: "blocked_missing_formula_input"
    };
  }

  return {
    ...commonAssessment,
    ...computeDesignCorridor({
      context,
      hostWallRwDb,
      openings
    }),
    status: "formula_corridor_defined_runtime_gate_required"
  };
}

export function buildGateROpeningLeakCompositeSealDecisionTable(): readonly GateROpeningLeakCompositeSealDecisionRow[] {
  const baseContext = {
    contextMode: "element_lab",
    hostWallAreaM2: 12
  } as const satisfies AirborneContext;

  return (["sealed", "average", "leaky", "open_gap"] as const).map((sealLeakageClass) => {
    const context: AirborneContext = {
      ...baseContext,
      openingLeakElements: [
        {
          areaM2: 1.2,
          count: 1,
          elementRwDb: 34,
          id: `decision-${sealLeakageClass}`,
          origin: "catalogued",
          ratingBasis: "rw_single_number",
          sealLeakageClass
        }
      ]
    };
    const assessment = buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: context,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_complete_average_seal_formula_corridor_defined",
      targetOutputs: ["Rw"]
    });
    const penaltyDb = leakagePenaltyDb(sealLeakageClass) ?? 0;

    return {
      designCorridorEstimateDb: assessment.designCorridorEstimateDb ?? 0,
      effectiveOpeningRwDb: 34 - penaltyDb,
      leakagePenaltyDb: penaltyDb,
      sealLeakageClass
    };
  });
}

export function buildGateROpeningLeakCompositeFormulaCorridorContract(): GateROpeningLeakCompositeFormulaCorridorContract {
  return {
    basisAliasBlocked: {
      buildingPredictionMetrics: true,
      fieldRuntimeMetrics: true,
      stcOpeningBasisWithoutRwAdapter: true
    },
    candidateFormulaAssessment: buildGateROpeningLeakCompositeFormulaAssessment({
      airborneContext: COMPLETE_OPENING_CONTEXT,
      hostWallRatingBasis: "dynamic_family_candidate",
      hostWallRwDb: 55,
      openingRouteRequested: true,
      owners: COMPLETE_OWNER_INPUTS,
      scenarioId: "gate_r_complete_average_seal_formula_corridor_defined",
      targetOutputs: ["Rw", "STC"]
    }),
    exactMeasuredRowsRemainPrecedence: true,
    landedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
    negativeBoundaries: [
      {
        expectedDesignCorridorEstimateDb: null,
        reason: "Gate Q physical opening fields still own needs_input before any formula can run.",
        status: "blocked_missing_physical_input",
        targetOutputs: ["Rw"]
      },
      {
        expectedDesignCorridorEstimateDb: null,
        reason: "Formula owners must be explicit because opening penalties and source-absent budgets are design terms.",
        status: "blocked_missing_formula_owner",
        targetOutputs: ["Rw"]
      },
      {
        expectedDesignCorridorEstimateDb: null,
        reason: "STC-only opening rows cannot be treated as Rw inputs without a future adapter.",
        status: "blocked_basis_alias",
        targetOutputs: ["Rw"]
      },
      {
        expectedDesignCorridorEstimateDb: null,
        reason: "Source-absent opening element values need an explicit uncertainty budget owner.",
        status: "blocked_source_absent_opening_budget_owner",
        targetOutputs: ["Rw"]
      },
      {
        expectedDesignCorridorEstimateDb: null,
        reason: "Building-prediction and field metrics need separate field/building routes; lab composite Rw is not copied.",
        status: "not_element_lab_context",
        targetOutputs: ["R'w", "DnT,w"]
      }
    ],
    numericRuntimeBehaviorChange: false,
    previousLandedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
    previousSelectionStatus: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
    runtimePromotionAllowedInGateR: false,
    runtimeValueMovement: false,
    sealLeakageDecisionTable: buildGateROpeningLeakCompositeSealDecisionTable(),
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_R_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
    selectionStatus: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
    sourceRowsRequiredForFormulaDesign: false,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
