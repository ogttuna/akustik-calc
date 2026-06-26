import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneResultBasis,
  type AirborneOpeningLeakElement,
  type RequestedOutputId,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
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

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_METHOD =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner";

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
  hostCurve?: TransmissionLossCurve | null;
  hostWallRatingBasis: GateROpeningLeakCompositeHostWallRatingBasis;
  hostWallRwDb: number;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateSOpeningLeakCompositeRuntimeResult = {
  assessment: GateROpeningLeakCompositeAssessment;
  basis: AirborneResultBasis | null;
  blockedOutputs: readonly RequestedOutputId[];
  compositeCurve: TransmissionLossCurve | null;
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

function uniqueStrings(outputs: readonly string[]): string[] {
  return [...new Set(outputs)];
}

function roundOne(value: number): number {
  return Math.round(value * 10) / 10;
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

function positive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function positiveInteger(value: number | undefined): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function transmissionCoefficient(db: number): number {
  return 10 ** (-db / 10);
}

function usableCurve(curve: TransmissionLossCurve | null | undefined): curve is TransmissionLossCurve {
  return Boolean(
    curve &&
      curve.frequenciesHz.length > 0 &&
      curve.frequenciesHz.length === curve.transmissionLossDb.length &&
      curve.frequenciesHz.every((frequency) => Number.isFinite(frequency) && frequency > 0) &&
      curve.transmissionLossDb.every((value) => Number.isFinite(value))
  );
}

function sameFrequencies(
  left: TransmissionLossCurve,
  right: TransmissionLossCurve
): boolean {
  return left.frequenciesHz.length === right.frequenciesHz.length &&
    left.frequenciesHz.every((frequency, index) => frequency === right.frequenciesHz[index]);
}

function leakagePenaltyDb(
  opening: AirborneOpeningLeakElement
): number | null {
  switch (opening.sealLeakageClass) {
    case "sealed":
      return 0;
    case "average":
      return 2;
    case "leaky":
      return 6;
    case "open_gap":
      return 12;
    case "unknown":
    case undefined:
      return null;
  }
}

function buildSpectralCompositeCurve(input: {
  airborneContext?: AirborneContext | null;
  hostCurve?: TransmissionLossCurve | null;
}): TransmissionLossCurve | null {
  const hostCurve = input.hostCurve;
  const context = input.airborneContext;
  const openings = context?.openingLeakElements ?? [];

  if (!usableCurve(hostCurve) || !positive(context?.hostWallAreaM2) || openings.length === 0) {
    return null;
  }

  const hostWallAreaM2 = context.hostWallAreaM2;
  const openingContributions: Array<{
    readonly areaM2: number;
    readonly count: number;
    readonly curve: TransmissionLossCurve;
    readonly leakagePenaltyDb: number;
  }> = [];
  let effectiveOpeningAreaM2 = 0;

  for (const opening of openings) {
    const penaltyDb = leakagePenaltyDb(opening);

    if (
      !positive(opening.areaM2) ||
      !positiveInteger(opening.count) ||
      !usableCurve(opening.elementTransmissionLossCurve) ||
      !sameFrequencies(hostCurve, opening.elementTransmissionLossCurve) ||
      penaltyDb === null
    ) {
      return null;
    }

    effectiveOpeningAreaM2 += opening.areaM2 * opening.count;
    openingContributions.push({
      areaM2: opening.areaM2,
      count: opening.count,
      curve: opening.elementTransmissionLossCurve,
      leakagePenaltyDb: penaltyDb
    });
  }

  if (!(effectiveOpeningAreaM2 > 0) || effectiveOpeningAreaM2 > hostWallAreaM2) {
    return null;
  }

  const hostNetWallAreaM2 = hostWallAreaM2 - effectiveOpeningAreaM2;
  const transmissionLossDb = hostCurve.frequenciesHz.map((_, frequencyIndex) => {
    const hostTauArea = hostNetWallAreaM2 * transmissionCoefficient(hostCurve.transmissionLossDb[frequencyIndex]);
    const openingTauArea = openingContributions.reduce((total, opening) => {
      const bandTlDb = opening.curve.transmissionLossDb[frequencyIndex] - opening.leakagePenaltyDb;
      return total + (opening.areaM2 * opening.count * transmissionCoefficient(bandTlDb));
    }, 0);
    const totalTau = (hostTauArea + openingTauArea) / hostWallAreaM2;

    return roundOne(-10 * Math.log10(totalTau));
  });

  return {
    frequenciesHz: [...hostCurve.frequenciesHz],
    transmissionLossDb
  };
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
  compositeCurve?: TransmissionLossCurve | null;
}): AirborneResultBasis | null {
  const assessment = input.assessment;

  if (assessment.status === "not_opening_route" || assessment.status === "not_element_lab_context") {
    return null;
  }

  if (assessment.status === "formula_corridor_defined_runtime_gate_required") {
    if (input.compositeCurve) {
      return AirborneResultBasisSchema.parse({
        assumptions: [
          "Composite lab Rw/STC/C/Ctr are rated from the area-energy opening transmission-loss curve calculated band-by-band.",
          "Opening element frequency curves are formula inputs only; they do not replace the selected host-wall candidate.",
          "Field, building, outdoor-indoor facade, OITC, scalar STC alias, and impact outputs remain unsupported until separately owned adapters exist."
        ],
        calculationStandard: "ISO 12354-1",
        curveBasis: "calculated_frequency_curve",
        errorBudgetDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB,
        kind: "airborne_physics_prediction",
        measurementStandard: "none",
        method: POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        missingSourceEvidence: [
          "source-owned same-stack opening/facade door/window frequency-curve holdout rows"
        ],
        origin: "family_physics_prediction",
        ratingStandard: "ISO 717-1",
        requiredInputs: [
          "hostWallTransmissionLossCurve",
          "hostWallAreaM2",
          "openingAreaM2",
          "openingCount",
          "openingElementTransmissionLossCurve",
          "openingRatingBasis",
          "openingSealLeakageClass",
          "openingOrigin"
        ],
        toleranceClass: "uncalibrated_prediction"
      });
    }

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

  const formulaTargetOutputs =
    input.targetOutputs.includes("STC") && !input.targetOutputs.includes("Rw")
      ? [...input.targetOutputs, "Rw" as const]
      : input.targetOutputs;
  const assessment = buildGateROpeningLeakCompositeFormulaAssessment({
    airborneContext: input.airborneContext ?? undefined,
    hostWallRatingBasis: input.hostWallRatingBasis,
    hostWallRwDb: input.hostWallRwDb,
    openingRouteRequested: true,
    owners: RUNTIME_OWNER_INPUTS,
    scenarioId: scenarioIdForRuntime(input.airborneContext),
    targetOutputs: formulaTargetOutputs
  });
  const status = runtimeStatus(assessment.status);
  const compositeCurve =
    status === "runtime_corridor_promoted"
      ? buildSpectralCompositeCurve({
          airborneContext: input.airborneContext,
          hostCurve: input.hostCurve
        })
      : null;
  const compositeRatings = compositeCurve
    ? buildRatingsFromCurve(compositeCurve.frequenciesHz, compositeCurve.transmissionLossDb, {
        contextMode: "element_lab"
      })
    : null;
  const runtimeRwDb =
    status === "runtime_corridor_promoted"
      ? compositeRatings?.iso717.Rw ?? assessment.designCorridorEstimateDb
      : null;

  return {
    assessment,
    basis: buildRuntimeBasis({ assessment, compositeCurve }),
    blockedOutputs: blockedOutputsForStatus({
      assessment,
      targetOutputs: input.targetOutputs
    }),
    compositeCurve,
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
