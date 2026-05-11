import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  buildGateROpeningLeakCompositeFormulaAssessment,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
  GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
  GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB,
  type GateROpeningLeakCompositeAssessment,
  type GateROpeningLeakCompositeCorridorStatus,
  type GateROpeningLeakCompositeFormulaOwnerInputs,
  type GateROpeningLeakCompositeHostWallRatingBasis,
  type GateROpeningLeakCompositeScenarioId
} from "./dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor";

export const GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN =
  "gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan";

export const GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS =
  "gate_s_personal_use_mvp_opening_leak_composite_runtime_corridor_landed_selected_surface_parity_gate_t";

export const GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION =
  "gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan";

export const GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts";

export const GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD =
  "gate_s_opening_leak_composite_area_energy_runtime_corridor";

export const GATE_S_OPENING_LEAK_COMPOSITE_SUPPORT_LABEL =
  "Opening/leak composite runtime corridor";

export const GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING =
  "Opening/leak composite runtime corridor active: lab Rw uses the selected host-wall candidate, area-weighted opening transmission, explicit seal/leakage penalty, and a +/-6 dB source-absent budget. STC, field, and building outputs stay unsupported without owned adapters.";

export type GateSOpeningLeakCompositeRuntimeStatus =
  | "blocked_basis_alias"
  | "blocked_context_alias"
  | "blocked_hostile_input"
  | "blocked_missing_input"
  | "blocked_source_absent_opening_budget_owner"
  | "not_requested"
  | "runtime_corridor_promoted";

export type GateSOpeningLeakCompositeRuntimeInput = {
  airborneContext?: AirborneContext | null;
  hostWallRatingBasis: GateROpeningLeakCompositeHostWallRatingBasis;
  hostWallRwDb: number;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateSOpeningLeakCompositeRuntimeResult = {
  assessment: GateROpeningLeakCompositeAssessment;
  basis: AirborneResultBasis | null;
  blockedOutputs: readonly RequestedOutputId[];
  runtimeRwDb: number | null;
  status: GateSOpeningLeakCompositeRuntimeStatus;
  supportLabel: typeof GATE_S_OPENING_LEAK_COMPOSITE_SUPPORT_LABEL;
  warning: string | null;
};

export type GateSOpeningLeakCompositeRuntimeCorridorContract = {
  activeRuntimeAssessment: GateSOpeningLeakCompositeRuntimeResult;
  blockedOutputBasis: {
    buildingPredictionMetrics: true;
    fieldRuntimeMetrics: true;
    stcOpeningBasisWithoutRwAdapter: true;
  };
  landedGate: typeof GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN;
  numericRuntimeBehaviorChange: true;
  previousLandedGate: typeof GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN;
  previousSelectionStatus: typeof GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS;
  runtimeMethod: typeof GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD;
  runtimeValueMovement: true;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  toleranceDb: typeof GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB;
};

const RUNTIME_OWNER_INPUTS = {
  areaWeightedTransmissionCoefficientFormulaOwner: true,
  compositeAreaTransmissionLossEnergyFormulaOwner: true,
  compositeUncertaintyBudgetOwner: true,
  hostWallCandidateBoundaryOwner: true,
  hostWallRwCandidateOwner: true,
  openingLeakagePenaltyFormulaOwner: true,
  openingOriginPolicyOwner: true,
  openingRatingBasisPolicyOwner: true,
  sealLeakagePenaltyTableOwner: true,
  sourceAbsentOpeningValueBudgetOwner: false
} as const satisfies GateROpeningLeakCompositeFormulaOwnerInputs;

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

const RUNTIME_ALLOWED_OUTPUTS = new Set<RequestedOutputId>(["Rw"]);

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

function uniqueOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return [...new Set(outputs)];
}

function uniqueStrings(outputs: readonly string[]): string[] {
  return [...new Set(outputs)];
}

function routeRequested(airborneContext: AirborneContext | null | undefined): boolean {
  return typeof airborneContext?.hostWallAreaM2 === "number" ||
    (airborneContext?.openingLeakElements?.length ?? 0) > 0;
}

function requestedOpeningOutputs(outputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return outputs.filter((output) => OPENING_AFFECTED_OUTPUTS.has(output));
}

function blockedOutputsForStatus(input: {
  assessment: GateROpeningLeakCompositeAssessment;
  targetOutputs: readonly RequestedOutputId[];
}): RequestedOutputId[] {
  const requestedOutputs = requestedOpeningOutputs(input.targetOutputs);

  if (input.assessment.status === "not_opening_route") {
    return [];
  }

  if (input.assessment.status === "formula_corridor_defined_runtime_gate_required") {
    return requestedOutputs.filter((output) => !RUNTIME_ALLOWED_OUTPUTS.has(output));
  }

  return requestedOutputs;
}

function runtimeStatus(status: GateROpeningLeakCompositeCorridorStatus): GateSOpeningLeakCompositeRuntimeStatus {
  switch (status) {
    case "formula_corridor_defined_runtime_gate_required":
      return "runtime_corridor_promoted";
    case "not_opening_route":
      return "not_requested";
    case "not_element_lab_context":
      return "blocked_context_alias";
    case "blocked_basis_alias":
      return "blocked_basis_alias";
    case "blocked_invalid_opening_input":
      return "blocked_hostile_input";
    case "blocked_source_absent_opening_budget_owner":
      return "blocked_source_absent_opening_budget_owner";
    case "blocked_missing_formula_input":
    case "blocked_missing_formula_owner":
    case "blocked_missing_physical_input":
      return "blocked_missing_input";
  }
}

function scenarioIdForRuntime(
  airborneContext: AirborneContext | null | undefined
): GateROpeningLeakCompositeScenarioId {
  if (airborneContext?.contextMode && airborneContext.contextMode !== "element_lab") {
    return "gate_r_building_prediction_outputs_blocked";
  }

  return "gate_r_missing_gate_q_physical_fields_blocked";
}

function buildRuntimeBasis(input: {
  assessment: GateROpeningLeakCompositeAssessment;
}): AirborneResultBasis | null {
  const assessment = input.assessment;

  if (assessment.status === "not_opening_route" || assessment.status === "not_element_lab_context") {
    return null;
  }

  if (assessment.status === "formula_corridor_defined_runtime_gate_required") {
    return AirborneResultBasisSchema.parse({
      assumptions: [
        "Composite lab Rw is calculated by summing host-wall and opening transmission coefficients by area before converting back to dB.",
        "Opening element rows are formula terms only; they do not replace the selected host-wall candidate.",
        "Opening ratings must be Rw / ISO 717-1 lab compatible. STC, field, and building outputs remain unsupported until separately owned adapters exist."
      ],
      calculationStandard: "ISO 12354-1",
      curveBasis: "calculated_single_number_estimate",
      errorBudgetDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB,
      kind: "airborne_physics_prediction",
      measurementStandard: "none",
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      missingSourceEvidence: [
        "source-owned same-stack opening/leak lab Rw holdout rows for the composite formula corridor"
      ],
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      requiredInputs: [
        "hostWallRwDb",
        "hostWallRatingBasis",
        ...assessment.requiredPhysicalInputs
      ],
      toleranceClass: "uncalibrated_prediction"
    });
  }

  if (assessment.missingPhysicalInputs.length > 0 || assessment.missingFormulaInputs.length > 0) {
    return AirborneResultBasisSchema.parse({
      assumptions: [
        "Opening/leak composite Rw is blocked until every physical opening term is explicit; host-wall-only Rw is not a valid answer for a requested opening route."
      ],
      curveBasis: "no_curve",
      kind: "airborne_needs_input",
      method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
      missingPhysicalInputs: uniqueStrings([
        ...assessment.missingPhysicalInputs,
        ...assessment.missingFormulaInputs
      ]),
      origin: "needs_input",
      requiredInputs: [
        "hostWallRwDb",
        "hostWallRatingBasis",
        ...assessment.requiredPhysicalInputs
      ]
    });
  }

  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Opening/leak composite runtime is blocked because this route would alias basis, use hostile opening input, or rely on source-absent opening values without an owned budget."
    ],
    curveBasis: "no_curve",
    kind: "airborne_unsupported",
    method: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: [
      "hostWallRwDb",
      "hostWallRatingBasis",
      ...assessment.requiredPhysicalInputs
    ]
  });
}

function runtimeWarning(input: {
  assessment: GateROpeningLeakCompositeAssessment;
  status: GateSOpeningLeakCompositeRuntimeStatus;
}): string | null {
  const { assessment, status } = input;

  switch (status) {
    case "runtime_corridor_promoted":
      return GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_WARNING;
    case "blocked_missing_input": {
      const missing = uniqueStrings([
        ...assessment.missingPhysicalInputs,
        ...assessment.missingFormulaInputs,
        ...assessment.missingFormulaOwnerInputs
      ]);
      return `Opening/leak composite runtime is waiting for ${missing.join(", ")} before promoting lab Rw from the area-energy formula corridor.`;
    }
    case "blocked_basis_alias":
      return "Opening/leak composite runtime is blocked because STC-only opening ratings cannot be aliased to ISO 717-1 Rw without an owned adapter.";
    case "blocked_context_alias":
      return "Opening/leak composite runtime is blocked for field/building outputs; the Gate S corridor only owns element-lab Rw and does not alias it to R'w or DnT,w.";
    case "blocked_hostile_input":
      return `Opening/leak composite runtime is blocked by hostile opening input (${assessment.hostileInputBoundaries.join(", ")}).`;
    case "blocked_source_absent_opening_budget_owner":
      return "Opening/leak composite runtime is blocked because source-absent opening values require sourceAbsentOpeningValueBudgetOwner before promotion.";
    case "not_requested":
      return null;
  }
}

export function maybeBuildGateSOpeningLeakCompositeRuntimeCorridor(
  input: GateSOpeningLeakCompositeRuntimeInput
): GateSOpeningLeakCompositeRuntimeResult | null {
  if (!routeRequested(input.airborneContext)) {
    return null;
  }

  const assessment = buildGateROpeningLeakCompositeFormulaAssessment({
    airborneContext: input.airborneContext ?? undefined,
    hostWallRatingBasis: input.hostWallRatingBasis,
    hostWallRwDb: input.hostWallRwDb,
    openingRouteRequested: true,
    owners: RUNTIME_OWNER_INPUTS,
    scenarioId: scenarioIdForRuntime(input.airborneContext),
    targetOutputs: input.targetOutputs
  });
  const status = runtimeStatus(assessment.status);
  const runtimeRwDb =
    status === "runtime_corridor_promoted" ? assessment.designCorridorEstimateDb : null;

  return {
    assessment,
    basis: buildRuntimeBasis({ assessment }),
    blockedOutputs: blockedOutputsForStatus({
      assessment,
      targetOutputs: input.targetOutputs
    }),
    runtimeRwDb,
    status,
    supportLabel: GATE_S_OPENING_LEAK_COMPOSITE_SUPPORT_LABEL,
    warning: runtimeWarning({ assessment, status })
  };
}

export function buildGateSOpeningLeakCompositeRuntimeCorridorContract():
  GateSOpeningLeakCompositeRuntimeCorridorContract {
  const activeRuntimeAssessment = maybeBuildGateSOpeningLeakCompositeRuntimeCorridor({
    airborneContext: COMPLETE_OPENING_CONTEXT,
    hostWallRatingBasis: "dynamic_family_candidate",
    hostWallRwDb: 55,
    targetOutputs: ["Rw", "STC"]
  });

  if (!activeRuntimeAssessment) {
    throw new Error("Gate S opening/leak composite runtime fixture must be requested");
  }

  return {
    activeRuntimeAssessment,
    blockedOutputBasis: {
      buildingPredictionMetrics: true,
      fieldRuntimeMetrics: true,
      stcOpeningBasisWithoutRwAdapter: true
    },
    landedGate: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_PLAN,
    numericRuntimeBehaviorChange: true,
    previousLandedGate: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_PLAN,
    previousSelectionStatus: GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_CORRIDOR_STATUS,
    runtimeMethod: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
    runtimeValueMovement: true,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_S_OPENING_LEAK_COMPOSITE_SELECTED_NEXT_FILE,
    selectionStatus: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_CORRIDOR_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB
  };
}

export { GATE_R_OPENING_LEAK_COMPOSITE_FORMULA_BASIS };
