import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
  POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_COUNTERS,
  POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
  POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS,
  summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterOwnerGateEQ
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq";

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_es_plan" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts" as const;

export const POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate ES" as const;

export const POST_V1_GATE_ER_PLAN_DOC_PATH =
  POST_V1_GATE_EQ_SELECTED_RUNTIME_PLAN_DOC_PATH;

export const POST_V1_GATE_ER_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_ER_COUNTERS = {
  fieldBuildingRequestShapesWidened: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 1,
  newCalculableRequestShapes: 3,
  runtimeBasisPromotions: 2,
  runtimeCorrectedLayerTemplates: 1,
  runtimeCorrectedRequestShapes: 3,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 6,
  sourceRowsImported: 0
} as const;

const DIRECT_FIXED_DOUBLE_LEAF_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_DOUBLE_LEAF_TOPOLOGY: NonNullable<AirborneContext["wallTopology"]> = {
  cavity1AbsorptionClass: "none",
  cavity1DepthMm: 45,
  cavity1FillCoverage: "empty",
  cavity1LayerIndices: [1],
  sideALeafLayerIndices: [0],
  sideBLeafLayerIndices: [2],
  supportTopology: "direct_fixed",
  topologyMode: "double_leaf_framed"
};

const DIRECT_FIXED_LAB_CONTEXT = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: DIRECT_FIXED_DOUBLE_LEAF_TOPOLOGY
} satisfies AirborneContext;

const DIRECT_FIXED_FIELD_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} satisfies AirborneContext;

const DIRECT_FIXED_FIELD_MISSING_RT60_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomVolumeM3: 50
} satisfies AirborneContext;

const DIRECT_FIXED_FIELD_MISSING_SUPPORT_SPACING_CONTEXT = {
  ...DIRECT_FIXED_FIELD_CONTEXT,
  studSpacingMm: undefined
} satisfies AirborneContext;

const DIRECT_FIXED_BUILDING_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50,
  sourceRoomVolumeM3: 45
} satisfies AirborneContext;

export type PostV1GateERRuntimeEvidence = {
  readonly buildingBasisMethod: string | null | undefined;
  readonly buildingMetrics: {
    readonly Dnw: number | null | undefined;
    readonly DnTw: number | null | undefined;
    readonly RwPrime: number | null | undefined;
  };
  readonly buildingRuntimeValueMovement: boolean | undefined;
  readonly buildingSelectedCandidateId: string | undefined;
  readonly buildingSupportedOutputs: readonly RequestedOutputId[];
  readonly buildingUnsupportedOutputs: readonly RequestedOutputId[];
  readonly fieldBasisMethod: string | null | undefined;
  readonly fieldMetrics: {
    readonly Dnw: number | null | undefined;
    readonly DnTw: number | null | undefined;
    readonly RwPrime: number | null | undefined;
  };
  readonly fieldRuntimeValueMovement: boolean | undefined;
  readonly fieldSelectedCandidateId: string | undefined;
  readonly fieldSupportedOutputs: readonly RequestedOutputId[];
  readonly fieldUnsupportedOutputs: readonly RequestedOutputId[];
  readonly labBasisMethod: string | null | undefined;
  readonly labMetrics: {
    readonly C: number | null | undefined;
    readonly Ctr: number | null | undefined;
    readonly Rw: number | null | undefined;
    readonly STC: number | null | undefined;
  };
  readonly labSelectedCandidateId: string | undefined;
  readonly missingFieldRt60BasisMethod: string | null | undefined;
  readonly missingFieldRt60MissingPhysicalInputs: readonly string[];
  readonly missingFieldRt60SelectedCandidateId: string | undefined;
  readonly missingSupportSpacingBasisMethod: string | null | undefined;
  readonly missingSupportSpacingMissingPhysicalInputs: readonly string[];
  readonly missingSupportSpacingSelectedCandidateId: string | undefined;
};

export type PostV1GateERSummary = {
  readonly counters: typeof POST_V1_GATE_ER_COUNTERS;
  readonly landedGate:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE;
  readonly ownerIds: readonly [
    typeof POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
    typeof POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID
  ];
  readonly ownerLedgers: typeof POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS;
  readonly planDocPath: typeof POST_V1_GATE_ER_PLAN_DOC_PATH;
  readonly previousGateEQ: {
    readonly counters: typeof POST_V1_GATE_EQ_COUNTERS;
    readonly landedGate:
      typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE;
    readonly selectedNextAction:
      typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTION_STATUS;
  };
  readonly runtimeEvidence: PostV1GateERRuntimeEvidence;
  readonly selectedNextAction:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_ER_TARGET_OUTPUTS;
};

export function buildPostV1GateERRuntimeEvidence(): PostV1GateERRuntimeEvidence {
  const lab = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  });
  const field = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
  });
  const building = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_BUILDING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
  });
  const missingFieldRt60 = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_FIELD_MISSING_RT60_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
  });
  const missingSupportSpacing = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_FIELD_MISSING_SUPPORT_SPACING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
  });

  return {
    buildingBasisMethod: building.airborneBasis?.method,
    buildingMetrics: {
      Dnw: building.metrics.estimatedDnWDb,
      DnTw: building.metrics.estimatedDnTwDb,
      RwPrime: building.metrics.estimatedRwPrimeDb
    },
    buildingRuntimeValueMovement: building.airborneCandidateResolution?.runtimeValueMovement,
    buildingSelectedCandidateId: building.airborneCandidateResolution?.selectedCandidateId,
    buildingSupportedOutputs: [...building.supportedTargetOutputs],
    buildingUnsupportedOutputs: [...building.unsupportedTargetOutputs],
    fieldBasisMethod: field.airborneBasis?.method,
    fieldMetrics: {
      Dnw: field.metrics.estimatedDnWDb,
      DnTw: field.metrics.estimatedDnTwDb,
      RwPrime: field.metrics.estimatedRwPrimeDb
    },
    fieldRuntimeValueMovement: field.airborneCandidateResolution?.runtimeValueMovement,
    fieldSelectedCandidateId: field.airborneCandidateResolution?.selectedCandidateId,
    fieldSupportedOutputs: [...field.supportedTargetOutputs],
    fieldUnsupportedOutputs: [...field.unsupportedTargetOutputs],
    labBasisMethod: lab.airborneBasis?.method,
    labMetrics: {
      C: lab.metrics.estimatedCDb,
      Ctr: lab.metrics.estimatedCtrDb,
      Rw: lab.metrics.estimatedRwDb,
      STC: lab.metrics.estimatedStc
    },
    labSelectedCandidateId: lab.airborneCandidateResolution?.selectedCandidateId,
    missingFieldRt60BasisMethod: missingFieldRt60.airborneBasis?.method,
    missingFieldRt60MissingPhysicalInputs: [
      ...(missingFieldRt60.airborneBasis?.missingPhysicalInputs ?? [])
    ],
    missingFieldRt60SelectedCandidateId: missingFieldRt60.airborneCandidateResolution?.selectedCandidateId,
    missingSupportSpacingBasisMethod: missingSupportSpacing.airborneBasis?.method,
    missingSupportSpacingMissingPhysicalInputs: [
      ...(missingSupportSpacing.airborneBasis?.missingPhysicalInputs ?? [])
    ],
    missingSupportSpacingSelectedCandidateId: missingSupportSpacing.airborneCandidateResolution?.selectedCandidateId
  };
}

export function summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterRuntimeGateER():
  PostV1GateERSummary {
  if (
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE
  ) {
    throw new Error("Gate ER can only land after Gate EQ selects the direct-fixed field/building adapter runtime.");
  }

  const previousGateEQ = summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterOwnerGateEQ();
  const runtimeEvidence = buildPostV1GateERRuntimeEvidence();

  if (
    runtimeEvidence.fieldBasisMethod !== GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD ||
    runtimeEvidence.buildingBasisMethod !== GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  ) {
    throw new Error("Gate ER must connect the Gate EO direct-fixed curve to Gate I and Gate AR before landing.");
  }

  return {
    counters: POST_V1_GATE_ER_COUNTERS,
    landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
    ownerIds: [
      POST_V1_GATE_EQ_FIELD_ADAPTER_OWNER_ID,
      POST_V1_GATE_EQ_BUILDING_ADAPTER_OWNER_ID
    ],
    ownerLedgers: POST_V1_GATE_EQ_ADAPTER_OWNER_LEDGERS,
    planDocPath: POST_V1_GATE_ER_PLAN_DOC_PATH,
    previousGateEQ: {
      counters: previousGateEQ.counters,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_OWNER_GATE_EQ_LANDED_GATE,
      selectedNextAction: previousGateEQ.selectedNextAction,
      selectedNextFile: previousGateEQ.selectedNextFile,
      selectionStatus: previousGateEQ.selectionStatus
    },
    runtimeEvidence,
    selectedNextAction:
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_ER_TARGET_OUTPUTS
  };
}

export const POST_V1_GATE_ER_RUNTIME_ASSERTIONS = {
  buildingExpectedBasisMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  buildingExpectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  buildingExpectedMetrics: {
    Dnw: 24,
    DnTw: 27,
    RwPrime: 23
  },
  fieldExpectedBasisMethod: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  fieldExpectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  fieldExpectedMetrics: {
    Dnw: 24,
    DnTw: 27,
    RwPrime: 23
  },
  labExpectedBasisMethod: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  labExpectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  labExpectedMetrics: {
    C: -1.2,
    Ctr: -5.9,
    Rw: 31,
    STC: 31
  },
  missingFieldRt60ExpectedCandidateId: "candidate_dynamic_needs_input",
  missingSupportSpacingExpectedCandidateId: "candidate_dynamic_needs_input"
} as const;
