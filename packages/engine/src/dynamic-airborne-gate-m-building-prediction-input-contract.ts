import type {
  AcousticInputFieldId,
  AirborneContext,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
  type DynamicCalculatorRouteInputTopologyAssessment
} from "./dynamic-calculator-route-input-topology";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN =
  "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS =
  "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_landed_no_runtime_selected_runtime_adapter_gate_n";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION =
  "gate_n_personal_use_mvp_airborne_building_prediction_runtime_adapter_plan";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-n-airborne-building-prediction-runtime-adapter-contract.test.ts";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_RUNTIME_BOUNDARY_WARNING =
  "Airborne building-prediction inputs are complete, but the ISO 12354-1 flanking/runtime adapter is not promoted yet. DAC keeps R'w/DnT,w building results parked instead of reusing Gate I field budgets or lab values.";

export type GateMAirborneBuildingPredictionScenarioId =
  | "gate_m_complete_owner_set_ready_for_runtime_gate"
  | "gate_m_complete_physical_inputs_missing_runtime_owner"
  | "gate_m_missing_source_room_geometry_needs_input"
  | "gate_m_missing_flanking_assumption_needs_input"
  | "gate_m_missing_junction_length_and_output_basis_needs_input"
  | "gate_m_field_between_rooms_stays_out_of_building_contract";

export type GateMAirborneBuildingPredictionBoundaryId =
  | "ISO_12354_1_airborne_building_apparent_metric_boundary"
  | "ISO_12354_1_airborne_building_standardized_metric_boundary";

export type GateMAirborneBuildingPredictionStatus =
  | "blocked_runtime_owner"
  | "needs_input"
  | "not_requested"
  | "ready_for_runtime_gate";

export type GateMAirborneBuildingPredictionRuntimeOwners = {
  apparentBuildingMetricBasisOwner?: boolean;
  iso12354FlankingAdapterOwner?: boolean;
  junctionCouplingLengthOwner?: boolean;
  standardizedBuildingMetricBasisOwner?: boolean;
};

export type GateMAirborneBuildingPredictionBoundary = {
  adapterId: GateMAirborneBuildingPredictionBoundaryId;
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  outputBasis: "building_apparent" | "building_standardized";
  requestedOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  runtimePromotionAllowedInGateM: false;
  status: GateMAirborneBuildingPredictionStatus;
};

export type GateMAirborneBuildingPredictionAssessment = {
  adapterBoundaries: readonly GateMAirborneBuildingPredictionBoundary[];
  blockedOutputs: readonly RequestedOutputId[];
  id: GateMAirborneBuildingPredictionScenarioId;
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requestedOutputs: readonly RequestedOutputId[];
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimePromotionAllowedInGateM: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateMAirborneBuildingPredictionStatus;
};

export type GateMAirborneBuildingPredictionInput = {
  airborneContext?: AirborneContext;
  layers: readonly LayerInput[];
  runtimeOwners?: GateMAirborneBuildingPredictionRuntimeOwners;
  scenarioId: GateMAirborneBuildingPredictionScenarioId;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateMAirborneBuildingPredictionContract = {
  landedGate: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan";
  requiredOwnerInputs: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS;
  requiredPhysicalInputs: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS;
  runtimePromotionAllowedInGateM: false;
  scenarioPack: readonly GateMAirborneBuildingPredictionAssessment[];
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE;
  selectionStatus: typeof GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

const APPARENT_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["R'w", "Dn,w", "Dn,A"]);
const STANDARDIZED_BUILDING_OUTPUTS = new Set<RequestedOutputId>(["DnT,w", "DnT,A", "DnT,A,k"]);
const APPARENT_OWNER_INPUTS = [
  "ISO_12354_1_flanking_transmission_adapter_owner",
  "junctionCouplingLengthOwner",
  "apparentBuildingMetricBasisOwner"
] as const;
const STANDARDIZED_OWNER_INPUTS = [
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

const COMPLETE_RUNTIME_OWNERS = {
  apparentBuildingMetricBasisOwner: true,
  iso12354FlankingAdapterOwner: true,
  junctionCouplingLengthOwner: true,
  standardizedBuildingMetricBasisOwner: true
} as const satisfies GateMAirborneBuildingPredictionRuntimeOwners;

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

function ownerIsPresent(
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

function missingOwners(
  requiredOwners: readonly string[],
  owners: GateMAirborneBuildingPredictionRuntimeOwners | undefined
): string[] {
  return requiredOwners.filter((owner) => !ownerIsPresent(owners, owner));
}

function boundaryStatus(input: {
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
}): GateMAirborneBuildingPredictionStatus {
  if (input.requestedOutputs.length === 0) {
    return "not_requested";
  }

  if (input.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (input.missingOwnerInputs.length > 0) {
    return "blocked_runtime_owner";
  }

  return "ready_for_runtime_gate";
}

function buildBoundary(input: {
  adapterId: GateMAirborneBuildingPredictionBoundaryId;
  outputBasis: GateMAirborneBuildingPredictionBoundary["outputBasis"];
  requestedOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly string[];
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimeOwners?: GateMAirborneBuildingPredictionRuntimeOwners;
}): GateMAirborneBuildingPredictionBoundary {
  const missingPhysicalInputs =
    input.requestedOutputs.length > 0 ? [...input.routeInputAssessment.missingPhysicalInputs] : [];
  const missingOwnerInputs =
    input.requestedOutputs.length > 0 ? missingOwners(input.requiredOwnerInputs, input.runtimeOwners) : [];

  return {
    adapterId: input.adapterId,
    missingOwnerInputs,
    missingPhysicalInputs,
    outputBasis: input.outputBasis,
    requestedOutputs: [...input.requestedOutputs],
    requiredOwnerInputs: [...input.requiredOwnerInputs],
    requiredPhysicalInputs: [...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS],
    runtimePromotionAllowedInGateM: false,
    status: boundaryStatus({
      missingOwnerInputs,
      missingPhysicalInputs,
      requestedOutputs: input.requestedOutputs
    })
  };
}

function statusFrom(
  boundaries: readonly GateMAirborneBuildingPredictionBoundary[]
): GateMAirborneBuildingPredictionStatus {
  const active = boundaries.filter((boundary) => boundary.requestedOutputs.length > 0);

  if (active.length === 0) {
    return "not_requested";
  }

  if (active.some((boundary) => boundary.status === "needs_input")) {
    return "needs_input";
  }

  if (active.some((boundary) => boundary.status === "blocked_runtime_owner")) {
    return "blocked_runtime_owner";
  }

  return "ready_for_runtime_gate";
}

export function buildGateMAirborneBuildingPredictionAssessment(
  input: GateMAirborneBuildingPredictionInput
): GateMAirborneBuildingPredictionAssessment {
  const routeInputAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: input.airborneContext,
    layers: input.layers,
    route: "wall",
    targetOutputs: input.targetOutputs
  });
  const apparentOutputs = outputsIn(input.targetOutputs, APPARENT_BUILDING_OUTPUTS);
  const standardizedOutputs = outputsIn(input.targetOutputs, STANDARDIZED_BUILDING_OUTPUTS);
  const adapterBoundaries = [
    buildBoundary({
      adapterId: "ISO_12354_1_airborne_building_apparent_metric_boundary",
      outputBasis: "building_apparent",
      requestedOutputs: apparentOutputs,
      requiredOwnerInputs: APPARENT_OWNER_INPUTS,
      routeInputAssessment,
      runtimeOwners: input.runtimeOwners
    }),
    buildBoundary({
      adapterId: "ISO_12354_1_airborne_building_standardized_metric_boundary",
      outputBasis: "building_standardized",
      requestedOutputs: standardizedOutputs,
      requiredOwnerInputs: STANDARDIZED_OWNER_INPUTS,
      routeInputAssessment,
      runtimeOwners: input.runtimeOwners
    })
  ] as const satisfies readonly GateMAirborneBuildingPredictionBoundary[];
  const status = statusFrom(adapterBoundaries);
  const missingPhysicalInputs = unique(adapterBoundaries.flatMap((boundary) => boundary.missingPhysicalInputs));
  const missingOwnerInputs = unique(adapterBoundaries.flatMap((boundary) => boundary.missingOwnerInputs));
  const readyOutputs =
    status === "ready_for_runtime_gate"
      ? [...apparentOutputs, ...standardizedOutputs]
      : [];
  const blockedOutputs =
    status === "ready_for_runtime_gate"
      ? []
      : [...apparentOutputs, ...standardizedOutputs];

  return {
    adapterBoundaries,
    blockedOutputs,
    id: input.scenarioId,
    missingOwnerInputs,
    missingPhysicalInputs,
    readyOutputs,
    requestedOutputs: [...input.targetOutputs],
    routeInputAssessment,
    runtimePromotionAllowedInGateM: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status
  };
}

export function buildGateMAirborneBuildingPredictionScenarioPack(): readonly GateMAirborneBuildingPredictionAssessment[] {
  return [
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_RUNTIME_OWNERS,
      scenarioId: "gate_m_complete_owner_set_ready_for_runtime_gate",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      scenarioId: "gate_m_complete_physical_inputs_missing_runtime_owner",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        sourceRoomVolumeM3: undefined
      },
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_RUNTIME_OWNERS,
      scenarioId: "gate_m_missing_source_room_geometry_needs_input",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        conservativeFlankingAssumption: "unknown",
        flankingJunctionClass: "unknown"
      },
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_RUNTIME_OWNERS,
      scenarioId: "gate_m_missing_flanking_assumption_needs_input",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        buildingPredictionOutputBasis: "unknown",
        junctionCouplingLengthM: undefined
      },
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_RUNTIME_OWNERS,
      scenarioId: "gate_m_missing_junction_length_and_output_basis_needs_input",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildGateMAirborneBuildingPredictionAssessment({
      airborneContext: {
        ...COMPLETE_BUILDING_CONTEXT,
        contextMode: "field_between_rooms"
      },
      layers: LINED_MASSIVE_WALL,
      runtimeOwners: COMPLETE_RUNTIME_OWNERS,
      scenarioId: "gate_m_field_between_rooms_stays_out_of_building_contract",
      targetOutputs: ["Rw", "STC"]
    })
  ];
}

export function buildGateMAirborneBuildingPredictionContract(): GateMAirborneBuildingPredictionContract {
  return {
    landedGate: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_PLAN,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
    requiredOwnerInputs: GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS,
    requiredPhysicalInputs: GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
    runtimePromotionAllowedInGateM: false,
    scenarioPack: buildGateMAirborneBuildingPredictionScenarioPack(),
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_M_AIRBORNE_BUILDING_PREDICTION_SELECTED_NEXT_FILE,
    selectionStatus: GATE_M_AIRBORNE_BUILDING_PREDICTION_INPUT_CONTRACT_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}
