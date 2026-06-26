import type {
  AcousticInputFieldId,
  AirborneContext,
  AirborneOpeningLeakElement,
  TransmissionLossCurve,
  RequestedOutputId
} from "@dynecho/shared";

import {
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
  GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS
} from "./dynamic-airborne-gate-p-building-prediction-runtime-corridor";

export const GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN =
  "gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan";

export const GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS =
  "gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r";

export const GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION =
  "gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan";

export const GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts";

export const GATE_Q_OPENING_LEAK_COMPOSITE_NO_RUNTIME_WARNING =
  "Opening/leak composite transmission-loss inputs are owned, but the area-energy formula corridor is not promoted yet. DAC keeps host wall values unchanged instead of guessing door/window/leak penalties.";

export const GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS = [
  "hostWallAreaM2",
  "openingAreaM2",
  "openingElementRwDb",
  "openingRatingBasis",
  "openingSealLeakageClass",
  "openingCount",
  "openingOrigin"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS = [
  "hostWallCandidateBoundaryOwner",
  "compositeAreaTransmissionLossEnergyFormulaOwner",
  "openingLeakagePenaltyFormulaOwner",
  "openingOriginPolicyOwner"
] as const;

export type GateQOpeningLeakCompositeStatus =
  | "invalid_input"
  | "needs_input"
  | "not_requested"
  | "ready_for_formula_corridor";

export type GateQOpeningLeakCompositeScenarioId =
  | "gate_q_complete_input_ready_for_formula_corridor"
  | "gate_q_missing_host_wall_and_opening_fields_needs_input"
  | "gate_q_unknown_rating_and_seal_needs_input"
  | "gate_q_excessive_opening_area_invalid"
  | "gate_q_duplicate_openings_invalid"
  | "gate_q_not_requested_for_plain_host_wall";

export type GateQOpeningLeakCompositeOwnerInputs = {
  compositeAreaTransmissionLossEnergyFormulaOwner?: boolean;
  hostWallCandidateBoundaryOwner?: boolean;
  openingLeakagePenaltyFormulaOwner?: boolean;
  openingOriginPolicyOwner?: boolean;
};

export type GateQOpeningLeakCompositeInput = {
  airborneContext?: AirborneContext;
  openingRouteRequested?: boolean;
  owners?: GateQOpeningLeakCompositeOwnerInputs;
  scenarioId: GateQOpeningLeakCompositeScenarioId;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateQOpeningLeakCompositeAssessment = {
  blockedOutputs: readonly RequestedOutputId[];
  effectiveOpeningAreaM2: number | null;
  hostileInputBoundaries: readonly string[];
  id: GateQOpeningLeakCompositeScenarioId;
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  normalizedOpeningKeys: readonly string[];
  openingCount: number;
  requestedOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateQ: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateQOpeningLeakCompositeStatus;
};

export type GateQOpeningLeakCompositeContract = {
  basisBoundariesPreserved: {
    doorOrWindowRowsDoNotReplaceHostWall: true;
    hostWallCandidatePrecedence: true;
    labFieldBuildingSeparation: true;
    leakagePenaltyRequiresExplicitSealInput: true;
  };
  landedGate: typeof GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN;
  noRuntimeWarning: typeof GATE_Q_OPENING_LEAK_COMPOSITE_NO_RUNTIME_WARNING;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN;
  previousSelectionStatus: typeof GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS;
  requiredOwnerInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS;
  routeCardValueChange: false;
  runtimePromotionAllowedInGateQ: false;
  scenarioPack: readonly GateQOpeningLeakCompositeAssessment[];
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  workbenchInputBehaviorChange: false;
};

const OPENING_AFFECTED_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
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

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function positive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function positiveInteger(value: number | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function usableCurve(curve: TransmissionLossCurve | undefined): boolean {
  return Boolean(
    curve &&
      curve.frequenciesHz.length > 0 &&
      curve.frequenciesHz.length === curve.transmissionLossDb.length &&
      curve.frequenciesHz.every((frequency) => Number.isFinite(frequency) && frequency > 0) &&
      curve.transmissionLossDb.every((value) => Number.isFinite(value))
  );
}

function known(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown";
}

function openingRouteRequested(input: GateQOpeningLeakCompositeInput): boolean {
  return input.openingRouteRequested === true ||
    typeof input.airborneContext?.hostWallAreaM2 === "number" ||
    (input.airborneContext?.openingLeakElements?.length ?? 0) > 0;
}

function requestedOpeningOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => OPENING_AFFECTED_OUTPUTS.has(output));
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

function effectiveOpeningArea(openings: readonly AirborneOpeningLeakElement[]): number | null {
  let total = 0;

  for (const opening of openings) {
    const areaM2 = opening.areaM2;
    const count = opening.count;

    if (!positive(areaM2) || !positiveInteger(count)) {
      return null;
    }

    total += areaM2 * count;
  }

  return Math.round(total * 1000) / 1000;
}

function duplicateBoundaries(openings: readonly AirborneOpeningLeakElement[]): string[] {
  const ids = openings.map((opening) => opening.id).filter((id): id is string => typeof id === "string");
  const signatures = normalizedOpeningKeys(openings);
  const boundaries: string[] = [];

  if (new Set(ids).size !== ids.length) {
    boundaries.push("duplicateOpeningId");
  }

  if (new Set(signatures).size !== signatures.length) {
    boundaries.push("duplicateOpeningSignature");
  }

  return boundaries;
}

function missingPhysicalInputs(input: GateQOpeningLeakCompositeInput): AcousticInputFieldId[] {
  if (!openingRouteRequested(input) || requestedOpeningOutputs(input.targetOutputs).length === 0) {
    return [];
  }

  const missing: AcousticInputFieldId[] = [];
  const context = input.airborneContext;
  const openings = context?.openingLeakElements ?? [];

  if (!positive(context?.hostWallAreaM2)) {
    missing.push("hostWallAreaM2");
  }

  if (openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingElementRwDb",
      "openingRatingBasis",
      "openingSealLeakageClass",
      "openingCount",
      "openingOrigin"
    );
  }

  for (const opening of openings) {
    if (!positive(opening.areaM2)) {
      missing.push("openingAreaM2");
    }
    if (!positive(opening.elementRwDb) && !usableCurve(opening.elementTransmissionLossCurve)) {
      missing.push("openingElementRwDb");
    }
    if (!known(opening.ratingBasis)) {
      missing.push("openingRatingBasis");
    }
    if (!known(opening.sealLeakageClass)) {
      missing.push("openingSealLeakageClass");
    }
    if (!positiveInteger(opening.count)) {
      missing.push("openingCount");
    }
    if (!known(opening.origin)) {
      missing.push("openingOrigin");
    }
  }

  return unique(missing);
}

function hostileBoundaries(input: GateQOpeningLeakCompositeInput): string[] {
  if (!openingRouteRequested(input) || requestedOpeningOutputs(input.targetOutputs).length === 0) {
    return [];
  }

  const context = input.airborneContext;
  const openings = context?.openingLeakElements ?? [];
  const boundaries = duplicateBoundaries(openings);

  if (openings.some((opening) => typeof opening.areaM2 === "number" && opening.areaM2 <= 0)) {
    boundaries.push("nonPositiveOpeningArea");
  }

  if (openings.some((opening) => typeof opening.count === "number" && opening.count <= 0)) {
    boundaries.push("nonPositiveOpeningCount");
  }

  const totalArea = effectiveOpeningArea(openings);
  if (positive(context?.hostWallAreaM2) && totalArea !== null && totalArea > (context?.hostWallAreaM2 ?? 0)) {
    boundaries.push("openingAreaExceedsHostWallArea");
  }

  return unique(boundaries);
}

function missingOwnerInputs(owners: GateQOpeningLeakCompositeOwnerInputs | undefined): string[] {
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

function assessmentStatus(input: {
  hostileInputBoundaries: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
  routeRequested: boolean;
}): GateQOpeningLeakCompositeStatus {
  if (!input.routeRequested || input.requestedOutputs.length === 0) {
    return "not_requested";
  }

  if (input.hostileInputBoundaries.length > 0) {
    return "invalid_input";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  return "ready_for_formula_corridor";
}

export function buildGateQOpeningLeakCompositeAssessment(
  input: GateQOpeningLeakCompositeInput
): GateQOpeningLeakCompositeAssessment {
  const requestedOutputs = requestedOpeningOutputs(input.targetOutputs);
  const routeRequested = openingRouteRequested(input);
  const openings = input.airborneContext?.openingLeakElements ?? [];
  const missing = missingPhysicalInputs(input);
  const hostile = hostileBoundaries(input);
  const status = assessmentStatus({
    hostileInputBoundaries: hostile,
    missingPhysicalInputs: missing,
    requestedOutputs,
    routeRequested
  });

  return {
    blockedOutputs: status === "not_requested" ? [] : requestedOutputs,
    effectiveOpeningAreaM2: effectiveOpeningArea(openings),
    hostileInputBoundaries: hostile,
    id: input.scenarioId,
    missingOwnerInputs: status === "ready_for_formula_corridor" ? missingOwnerInputs(input.owners) : [],
    missingPhysicalInputs: missing,
    normalizedOpeningKeys: normalizedOpeningKeys(openings),
    openingCount: openings.length,
    requestedOutputs,
    requiredOwnerInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateQ: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status
  };
}

export function buildGateQOpeningLeakCompositeInputContract(): GateQOpeningLeakCompositeContract {
  const scenarioPack = [
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: COMPLETE_OPENING_CONTEXT,
      openingRouteRequested: true,
      scenarioId: "gate_q_complete_input_ready_for_formula_corridor",
      targetOutputs: ["Rw", "STC", "R'w", "DnT,w"]
    }),
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: { contextMode: "element_lab" },
      openingRouteRequested: true,
      scenarioId: "gate_q_missing_host_wall_and_opening_fields_needs_input",
      targetOutputs: ["Rw", "STC"]
    }),
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1.2,
            count: 1,
            elementRwDb: 30,
            id: "window-unknown",
            origin: "source_absent",
            ratingBasis: "unknown",
            sealLeakageClass: "unknown"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_unknown_rating_and_seal_needs_input",
      targetOutputs: ["Rw"]
    }),
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 2,
        openingLeakElements: [
          {
            areaM2: 3,
            count: 1,
            elementRwDb: 30,
            id: "too-large",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_excessive_opening_area_invalid",
      targetOutputs: ["Rw"]
    }),
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: {
        contextMode: "element_lab",
        hostWallAreaM2: 12,
        openingLeakElements: [
          {
            areaM2: 1,
            count: 1,
            elementRwDb: 32,
            id: "door-dup",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          },
          {
            areaM2: 1,
            count: 1,
            elementRwDb: 32,
            id: "door-dup",
            origin: "catalogued",
            ratingBasis: "rw_single_number",
            sealLeakageClass: "average"
          }
        ]
      },
      openingRouteRequested: true,
      scenarioId: "gate_q_duplicate_openings_invalid",
      targetOutputs: ["Rw"]
    }),
    buildGateQOpeningLeakCompositeAssessment({
      airborneContext: { contextMode: "element_lab" },
      scenarioId: "gate_q_not_requested_for_plain_host_wall",
      targetOutputs: ["Rw", "STC"]
    })
  ] as const;

  return {
    basisBoundariesPreserved: {
      doorOrWindowRowsDoNotReplaceHostWall: true,
      hostWallCandidatePrecedence: true,
      labFieldBuildingSeparation: true,
      leakagePenaltyRequiresExplicitSealInput: true
    },
    landedGate: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_PLAN,
    noRuntimeWarning: GATE_Q_OPENING_LEAK_COMPOSITE_NO_RUNTIME_WARNING,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_PLAN,
    previousSelectionStatus: GATE_P_AIRBORNE_BUILDING_PREDICTION_RUNTIME_CORRIDOR_STATUS,
    requiredOwnerInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_Q_OPENING_LEAK_COMPOSITE_REQUIRED_PHYSICAL_INPUTS,
    routeCardValueChange: false,
    runtimePromotionAllowedInGateQ: false,
    scenarioPack,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_Q_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
    selectionStatus: GATE_Q_OPENING_LEAK_COMPOSITE_INPUT_CONTRACT_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    workbenchInputBehaviorChange: false
  };
}
