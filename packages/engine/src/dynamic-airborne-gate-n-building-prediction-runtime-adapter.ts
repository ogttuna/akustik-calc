import type {
  AcousticInputFieldId,
  AirborneContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import {
  buildGateMAirborneBuildingPredictionAssessment,
  type GateMAirborneBuildingPredictionRuntimeOwners
} from "./dynamic-airborne-gate-m-building-prediction-input-contract";
import {
  GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
  type DynamicCalculatorRouteInputTopologyAssessment
} from "./dynamic-calculator-route-input-topology";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN =
  "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS =
  "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_landed_no_runtime_selected_formula_corridor_gate_o";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION =
  "gate_o_personal_use_mvp_airborne_building_prediction_formula_corridor_plan";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-o-airborne-building-prediction-formula-corridor-contract.test.ts";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_METHOD =
  "dynamic_calculator_building_prediction_runtime_adapter_owner_missing";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_WARNING =
  "Airborne building-prediction runtime adapter is scoped, but ISO 12354-1 flanking formula terms are not owned yet. DAC keeps R'w/DnT,w building results parked instead of reusing Gate I field budgets or lab values.";

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS = [
  "ISO_12354_1_direct_separating_element_frequency_curve_owner",
  "ISO_12354_1_flanking_path_transmission_terms_owner",
  "ISO_12354_1_junction_vibration_reduction_index_owner",
  "ISO_12354_1_room_absorption_normalization_owner",
  "buildingPredictionUncertaintyBudgetOwner"
] as const;

export const GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS = [
  ...GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
  ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
] as const;

export type GateNAirborneBuildingPredictionScenarioId =
  | "gate_n_complete_gate_m_owner_set_missing_formula_owner"
  | "gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor"
  | "gate_n_missing_source_room_geometry_needs_input"
  | "gate_n_missing_gate_m_metric_basis_owner"
  | "gate_n_field_between_rooms_stays_out_of_building_runtime_adapter";

export type GateNAirborneBuildingPredictionBoundaryId =
  | "ISO_12354_1_airborne_building_apparent_runtime_adapter"
  | "ISO_12354_1_airborne_building_standardized_runtime_adapter";

export type GateNAirborneBuildingPredictionStatus =
  | "blocked_adapter_owner"
  | "blocked_formula_owner"
  | "needs_input"
  | "not_requested"
  | "ready_for_formula_corridor";

export type GateNAirborneBuildingPredictionFormulaOwners = {
  buildingPredictionUncertaintyBudgetOwner?: boolean;
  directSeparatingElementFrequencyCurveOwner?: boolean;
  flankingPathTransmissionTermsOwner?: boolean;
  junctionVibrationReductionIndexOwner?: boolean;
  roomAbsorptionNormalizationOwner?: boolean;
};

export type GateNAirborneBuildingPredictionBoundary = {
  adapterId: GateNAirborneBuildingPredictionBoundaryId;
  formulaCorridorPromotionRequiresGateO: true;
  missingAdapterOwnerInputs: readonly string[];
  missingFormulaOwnerInputs: readonly string[];
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  outputBasis: "building_apparent" | "building_standardized";
  requestedOutputs: readonly RequestedOutputId[];
  requiredAdapterOwnerInputs: readonly string[];
  requiredFormulaOwnerInputs: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS;
  requiredOwnerInputs: readonly string[];
  requiredPhysicalInputs: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateN: false;
  status: GateNAirborneBuildingPredictionStatus;
};

export type GateNAirborneBuildingPredictionAssessment = {
  adapterBoundaries: readonly GateNAirborneBuildingPredictionBoundary[];
  blockedOutputs: readonly RequestedOutputId[];
  formulaCorridorPromotionRequiresGateO: true;
  id: GateNAirborneBuildingPredictionScenarioId;
  missingAdapterOwnerInputs: readonly string[];
  missingFormulaOwnerInputs: readonly string[];
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requestedOutputs: readonly RequestedOutputId[];
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimePromotionAllowedInGateN: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateNAirborneBuildingPredictionStatus;
};

export type GateNAirborneBuildingPredictionInput = {
  airborneContext?: AirborneContext;
  formulaOwners?: GateNAirborneBuildingPredictionFormulaOwners;
  layers: readonly LayerInput[];
  runtimeOwners?: GateMAirborneBuildingPredictionRuntimeOwners;
  scenarioId: GateNAirborneBuildingPredictionScenarioId;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateNAirborneBuildingPredictionContract = {
  formulaCorridorPromotionRequiresGateO: true;
  landedGate: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan";
  requiredFormulaOwnerInputs: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS;
  requiredOwnerInputs: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateN: false;
  scenarioPack: readonly GateNAirborneBuildingPredictionAssessment[];
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const APPARENT_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A"]);
const STANDARDIZED_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A", "DnT,A,k"]);
const APPARENT_ADAPTER_OWNER_INPUTS = [
  "ISO_12354_1_flanking_transmission_adapter_owner",
  "junctionCouplingLengthOwner",
  "apparentBuildingMetricBasisOwner"
] as const;
const STANDARDIZED_ADAPTER_OWNER_INPUTS = [
  "ISO_12354_1_flanking_transmission_adapter_owner",
  "junctionCouplingLengthOwner",
  "standardizedBuildingMetricBasisOwner"
] as const;

const COMPLETE_BUILDING_CONTEXT = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
} as const satisfies AirborneContext;

const COMPLETE_GATE_M_RUNTIME_OWNERS = {
  apparentBuildingMetricBasisOwner: true,
  iso12354FlankingAdapterOwner: true,
  junctionCouplingLengthOwner: true,
  standardizedBuildingMetricBasisOwner: true
} as const satisfies GateMAirborneBuildingPredictionRuntimeOwners;

const COMPLETE_FORMULA_OWNERS = {
  buildingPredictionUncertaintyBudgetOwner: true,
  directSeparatingElementFrequencyCurveOwner: true,
  flankingPathTransmissionTermsOwner: true,
  junctionVibrationReductionIndexOwner: true,
  roomAbsorptionNormalizationOwner: true
} as const satisfies GateNAirborneBuildingPredictionFormulaOwners;

const LINED_MASSIVE_WALL = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

function unique<T extends string>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function outputsIn(
  outputs: readonly RequestedOutputId[],
  set: ReadonlySet<RequestedOutputId>
): RequestedOutputId[] {
  return outputs.filter((output) => set.has(output));
}

function adapterOwnerIsPresent(
  owners: GateMAirborneBuildingPredictionRuntimeOwners | undefined,
  owner: string
): boolean {
  switch (owner) {
    case "ISO_12354_1_flanking_transmission_adapter_owner":
      return owners?.iso12354FlankingAdapterOwner === true;
    case "junctionCouplingLengthOwner":
      return owners?.junctionCouplingLengthOwner === true;
    case "apparentBuildingMetricBasisOwner":
      return owners?.apparentBuildingMetricBasisOwner === true;
    case "standardizedBuildingMetricBasisOwner":
      return owners?.standardizedBuildingMetricBasisOwner === true;
    default:
      return false;
  }
}

function formulaOwnerIsPresent(
  owners: GateNAirborneBuildingPredictionFormulaOwners | undefined,
  owner: string
): boolean {
  switch (owner) {
    case "ISO_12354_1_direct_separating_element_frequency_curve_owner":
      return owners?.directSeparatingElementFrequencyCurveOwner === true;
    case "ISO_12354_1_flanking_path_transmission_terms_owner":
      return owners?.flankingPathTransmissionTermsOwner === true;
    case "ISO_12354_1_junction_vibration_reduction_index_owner":
      return owners?.junctionVibrationReductionIndexOwner === true;
    case "ISO_12354_1_room_absorption_normalization_owner":
      return owners?.roomAbsorptionNormalizationOwner === true;
    case "buildingPredictionUncertaintyBudgetOwner":
      return owners?.buildingPredictionUncertaintyBudgetOwner === true;
    default:
      return false;
  }
}

function boundaryStatus(input: {
  missingAdapterOwnerInputs: readonly string[];
  missingFormulaOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
}): GateNAirborneBuildingPredictionStatus {
  if (input.requestedOutputs.length === 0) {
    return "not_requested";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (input.missingAdapterOwnerInputs.length > 0) {
    return "blocked_adapter_owner";
  }

  if (input.missingFormulaOwnerInputs.length > 0) {
    return "blocked_formula_owner";
  }

  return "ready_for_formula_corridor";
}

function buildBoundary(input: {
  adapterId: GateNAirborneBuildingPredictionBoundaryId;
  outputBasis: GateNAirborneBuildingPredictionBoundary["outputBasis"];
  requestedOutputs: readonly RequestedOutputId[];
  requiredAdapterOwnerInputs: readonly string[];
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimeOwners?: GateMAirborneBuildingPredictionRuntimeOwners;
  formulaOwners?: GateNAirborneBuildingPredictionFormulaOwners;
}): GateNAirborneBuildingPredictionBoundary {
  const missingPhysicalInputs =
    input.requestedOutputs.length > 0 ? [...input.routeInputAssessment.missingPhysicalInputs] : [];
  const missingAdapterOwnerInputs =
    input.requestedOutputs.length > 0
      ? input.requiredAdapterOwnerInputs.filter(
          (owner) => !adapterOwnerIsPresent(input.runtimeOwners, owner)
        )
      : [];
  const missingFormulaOwnerInputs =
    input.requestedOutputs.length > 0
      ? GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS.filter(
          (owner) => !formulaOwnerIsPresent(input.formulaOwners, owner)
        )
      : [];
  const requiredOwnerInputs = unique([
    ...input.requiredAdapterOwnerInputs,
    ...GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS
  ]);
  const missingOwnerInputs = unique([
    ...missingAdapterOwnerInputs,
    ...missingFormulaOwnerInputs
  ]);

  return {
    adapterId: input.adapterId,
    formulaCorridorPromotionRequiresGateO: true,
    missingAdapterOwnerInputs,
    missingFormulaOwnerInputs,
    missingOwnerInputs,
    missingPhysicalInputs,
    outputBasis: input.outputBasis,
    requestedOutputs: [...input.requestedOutputs],
    requiredAdapterOwnerInputs: [...input.requiredAdapterOwnerInputs],
    requiredFormulaOwnerInputs: GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
    requiredOwnerInputs,
    requiredPhysicalInputs: GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateN: false,
    status: boundaryStatus({
      missingAdapterOwnerInputs,
      missingFormulaOwnerInputs,
      missingPhysicalInputs,
      requestedOutputs: input.requestedOutputs
    })
  };
}

function statusFrom(
  boundaries: readonly GateNAirborneBuildingPredictionBoundary[]
): GateNAirborneBuildingPredictionStatus {
  const active = boundaries.filter((boundary) => boundary.requestedOutputs.length > 0);

  if (active.length === 0) {
    return "not_requested";
  }

  if (active.some((boundary) => boundary.status === "needs_input")) {
    return "needs_input";
  }

  if (active.some((boundary) => boundary.status === "blocked_adapter_owner")) {
    return "blocked_adapter_owner";
  }

  if (active.some((boundary) => boundary.status === "blocked_formula_owner")) {
    return "blocked_formula_owner";
  }

  return "ready_for_formula_corridor";
}

export function buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment(
  input: GateNAirborneBuildingPredictionInput
): GateNAirborneBuildingPredictionAssessment {
  const gateMAssessment = buildGateMAirborneBuildingPredictionAssessment({
    airborneContext: input.airborneContext,
    layers: input.layers,
    runtimeOwners: input.runtimeOwners,
    scenarioId: "gate_m_complete_physical_inputs_missing_runtime_owner",
    targetOutputs: input.targetOutputs
  });
  const isBuildingPrediction = gateMAssessment.routeInputAssessment.outputBasis === "building_prediction";
  const apparentOutputs = isBuildingPrediction ? outputsIn(input.targetOutputs, APPARENT_BUILDING_OUTPUTS) : [];
  const standardizedOutputs = isBuildingPrediction
    ? outputsIn(input.targetOutputs, STANDARDIZED_BUILDING_OUTPUTS)
    : [];
  const adapterBoundaries = [
    buildBoundary({
      adapterId: "ISO_12354_1_airborne_building_apparent_runtime_adapter",
      formulaOwners: input.formulaOwners,
      outputBasis: "building_apparent",
      requestedOutputs: apparentOutputs,
      requiredAdapterOwnerInputs: APPARENT_ADAPTER_OWNER_INPUTS,
      routeInputAssessment: gateMAssessment.routeInputAssessment,
      runtimeOwners: input.runtimeOwners
    }),
    buildBoundary({
      adapterId: "ISO_12354_1_airborne_building_standardized_runtime_adapter",
      formulaOwners: input.formulaOwners,
      outputBasis: "building_standardized",
      requestedOutputs: standardizedOutputs,
      requiredAdapterOwnerInputs: STANDARDIZED_ADAPTER_OWNER_INPUTS,
      routeInputAssessment: gateMAssessment.routeInputAssessment,
      runtimeOwners: input.runtimeOwners
    })
  ] as const satisfies readonly GateNAirborneBuildingPredictionBoundary[];
  const status = statusFrom(adapterBoundaries);
  const missingPhysicalInputs = unique(adapterBoundaries.flatMap((boundary) => boundary.missingPhysicalInputs));
  const missingAdapterOwnerInputs = unique(
    adapterBoundaries.flatMap((boundary) => boundary.missingAdapterOwnerInputs)
  );
  const missingFormulaOwnerInputs = unique(
    adapterBoundaries.flatMap((boundary) => boundary.missingFormulaOwnerInputs)
  );
  const missingOwnerInputs = unique(adapterBoundaries.flatMap((boundary) => boundary.missingOwnerInputs));
  const requestedBuildingOutputs = [...apparentOutputs, ...standardizedOutputs];
  const readyOutputs = status === "ready_for_formula_corridor" ? requestedBuildingOutputs : [];
  const blockedOutputs = status === "ready_for_formula_corridor" ? [] : requestedBuildingOutputs;

  return {
    adapterBoundaries,
    blockedOutputs,
    formulaCorridorPromotionRequiresGateO: true,
    id: input.scenarioId,
    missingAdapterOwnerInputs,
    missingFormulaOwnerInputs,
    missingOwnerInputs,
    missingPhysicalInputs,
    readyOutputs,
    requestedOutputs: [...input.targetOutputs],
    routeInputAssessment: gateMAssessment.routeInputAssessment,
    runtimePromotionAllowedInGateN: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status
  };
}

export function buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack(): readonly GateNAirborneBuildingPredictionAssessment[] {
  return [
    buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_complete_gate_m_owner_set_missing_formula_owner",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      formulaOwners: COMPLETE_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_complete_formula_owner_set_ready_for_gate_o_formula_corridor",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        sourceRoomVolumeM3: undefined
      },
      formulaOwners: COMPLETE_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_missing_source_room_geometry_needs_input",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      formulaOwners: COMPLETE_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: {
        iso12354FlankingAdapterOwner: true,
        junctionCouplingLengthOwner: true
      },
      scenarioId: "gate_n_missing_gate_m_metric_basis_owner",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateNAirborneBuildingPredictionRuntimeAdapterAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        contextMode: "field_between_rooms"
      },
      formulaOwners: COMPLETE_FORMULA_OWNERS,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_GATE_M_RUNTIME_OWNERS,
      scenarioId: "gate_n_field_between_rooms_stays_out_of_building_runtime_adapter",
      targetOutputs: ["R'w", "DnT,w"]
    })
  ];
}

export function buildGateNAirborneBuildingPredictionRuntimeAdapterContract(): GateNAirborneBuildingPredictionContract {
  return {
    formulaCorridorPromotionRequiresGateO: true,
    landedGate: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_PLAN,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
    requiredFormulaOwnerInputs: GATE_N_AIRBORNE_BUILDING_PREDICTION_FORMULA_OWNER_INPUTS,
    requiredOwnerInputs: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateN: false,
    scenarioPack: buildGateNAirborneBuildingPredictionRuntimeAdapterScenarioPack(),
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_N_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
    selectionStatus: GATE_N_AIRBORNE_BUILDING_PREDICTION_RUNTIME_ADAPTER_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
