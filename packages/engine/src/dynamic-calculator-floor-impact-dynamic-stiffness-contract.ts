import type {
  AcousticInputCompleteness,
  AcousticInputFieldId,
  AirborneContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import type {
  DynamicCalculatorFloorImpactContext,
  DynamicCalculatorRouteInputTopologyAssessment
} from "./dynamic-calculator-route-input-topology";
import {
  normalizeDynamicCalculatorTopologyInput,
  type DynamicCalculatorTopologyNormalizationResult
} from "./dynamic-calculator-topology-normalizer";
import { getDefaultMaterialCatalog } from "./material-catalog";

export type GateVFloorImpactDynamicStiffnessScenarioId =
  | "gate_v_complete_heavy_floating_floor_dynamic_stiffness_ready"
  | "gate_v_field_impact_without_room_context_needs_input"
  | "gate_v_iic_aiic_rating_adapter_stays_unsupported"
  | "gate_v_manual_dynamic_stiffness_can_fill_missing_catalog_property"
  | "gate_v_missing_dynamic_stiffness_needs_input"
  | "gate_v_missing_load_basis_needs_input"
  | "gate_v_role_defined_floor_reorder_stays_stable";

export type GateVFloorImpactAdapterId =
  | "ASTM_E989_IIC_AIIC"
  | "field_impact_context"
  | "ISO_717_2_Lnw_DeltaLw";

export type GateVFloorImpactAdapterStatus =
  | "needs_input"
  | "not_requested"
  | "ready"
  | "unsupported";

export type GateVFloorImpactContractStatus =
  | "needs_input"
  | "partial_ready_unsupported_adapter"
  | "ready_for_runtime_gate"
  | "unsupported_adapter";

export type GateVFloorImpactAdapterBoundary = {
  adapterId: GateVFloorImpactAdapterId;
  metricBasis: string;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  requestedOutputs: readonly RequestedOutputId[];
  requiredOwnersBeforeRuntime: readonly string[];
  status: GateVFloorImpactAdapterStatus;
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type GateVFloorImpactDynamicStiffnessContract = {
  adapterBoundaries: readonly GateVFloorImpactAdapterBoundary[];
  fieldOutputAliasBlocked: true;
  inputCompleteness: AcousticInputCompleteness | null;
  landedGate: "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator";
  metricBasisBoundaries: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  normalizedTopology: DynamicCalculatorTopologyNormalizationResult;
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure";
  requiredBeforeRuntimePromotion: readonly AcousticInputFieldId[];
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimePromotionAllowed: false;
  runtimeValueMovement: false;
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts";
  selectionStatus: "gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w";
  sourceRowsRequiredForInputContract: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateVFloorImpactContractStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type GateVFloorImpactDynamicStiffnessScenarioPackEntry = {
  contract: GateVFloorImpactDynamicStiffnessContract;
  description: string;
  expectedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  expectedStatus: GateVFloorImpactContractStatus;
  id: GateVFloorImpactDynamicStiffnessScenarioId;
};

export type GateVFloorImpactDynamicStiffnessContractInput = {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext;
  layers: readonly LayerInput[];
  maxLayerCount?: number;
  previousLayers?: readonly LayerInput[];
  sourceEvidenceAvailable?: boolean;
  targetOutputs: readonly RequestedOutputId[];
};

const REQUIRED_BEFORE_RUNTIME_PROMOTION = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const satisfies readonly AcousticInputFieldId[];

const FIELD_IMPACT_CONTEXT_FIELDS = [
  "contextMode",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S"
] as const satisfies readonly AcousticInputFieldId[];

const ISO_717_2_LAB_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "DeltaLw"]);
const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);
const ASTM_E989_OUTPUTS = new Set<RequestedOutputId>(["AIIC", "HIIC", "IIC", "LIIC"]);

const DEFAULT_HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const DEFAULT_LOAD_CONTEXT = {
  loadBasisKgM2: 100
} as const satisfies DynamicCalculatorFloorImpactContext;

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function outputsIn(
  targetOutputs: readonly RequestedOutputId[],
  outputSet: ReadonlySet<RequestedOutputId>
): RequestedOutputId[] {
  return targetOutputs.filter((output) => outputSet.has(output));
}

function missingFrom(
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment,
  fields: readonly AcousticInputFieldId[]
): AcousticInputFieldId[] {
  const missing = new Set(routeInputAssessment.missingPhysicalInputs);
  return fields.filter((field) => missing.has(field));
}

function floatingFloorCompleteness(
  assessment: DynamicCalculatorRouteInputTopologyAssessment
): AcousticInputCompleteness | null {
  return (
    assessment.inputCompletenessSet.find(
      (entry) => entry.routeFamily === "floating_floor_impact"
    ) ?? null
  );
}

function buildAdapterBoundaries(input: {
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  targetOutputs: readonly RequestedOutputId[];
}): readonly GateVFloorImpactAdapterBoundary[] {
  const labOutputs = outputsIn(input.targetOutputs, ISO_717_2_LAB_IMPACT_OUTPUTS);
  const fieldOutputs = outputsIn(input.targetOutputs, FIELD_IMPACT_OUTPUTS);
  const astmOutputs = outputsIn(input.targetOutputs, ASTM_E989_OUTPUTS);
  const floorMissing = missingFrom(
    input.routeInputAssessment,
    REQUIRED_BEFORE_RUNTIME_PROMOTION
  );
  const fieldMissing = unique([
    ...floorMissing,
    ...missingFrom(input.routeInputAssessment, FIELD_IMPACT_CONTEXT_FIELDS)
  ]);

  return [
    {
      adapterId: "ISO_717_2_Lnw_DeltaLw",
      metricBasis: "ISO 717-2 lab impact rating for Ln,w and DeltaLw; no ASTM IIC aliasing.",
      missingPhysicalInputs: labOutputs.length > 0 ? floorMissing : [],
      requestedOutputs: labOutputs,
      requiredOwnersBeforeRuntime: [
        "ISO_12354_2_dynamic_stiffness_predictor",
        "ISO7172LnwAdapter"
      ],
      status:
        labOutputs.length === 0 ? "not_requested" : floorMissing.length > 0 ? "needs_input" : "ready",
      unsupportedOutputs: []
    },
    {
      adapterId: "field_impact_context",
      metricBasis:
        "Field/apparent impact outputs require room area, receiving volume, RT60, and context basis before using lab impact predictions.",
      missingPhysicalInputs: fieldOutputs.length > 0 ? fieldMissing : [],
      requestedOutputs: fieldOutputs,
      requiredOwnersBeforeRuntime: ["fieldImpactContextBoundary", "labToFieldImpactBasisDeltaOwner"],
      status:
        fieldOutputs.length === 0
          ? "not_requested"
          : fieldMissing.length > 0
            ? "needs_input"
            : "ready",
      unsupportedOutputs: []
    },
    {
      adapterId: "ASTM_E989_IIC_AIIC",
      metricBasis:
        "ASTM E989 IIC/AIIC is a separate rating route and remains blocked until the adapter owner is executable.",
      missingPhysicalInputs: [],
      requestedOutputs: astmOutputs,
      requiredOwnersBeforeRuntime: ["ASTME989IICAdapterBoundary"],
      status: astmOutputs.length === 0 ? "not_requested" : "unsupported",
      unsupportedOutputs: astmOutputs
    }
  ];
}

function statusFrom(input: {
  normalizedTopology: DynamicCalculatorTopologyNormalizationResult;
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  targetOutputs: readonly RequestedOutputId[];
}): GateVFloorImpactContractStatus {
  const supportedImpactOutputs = input.targetOutputs.filter(
    (output) => ISO_717_2_LAB_IMPACT_OUTPUTS.has(output) || FIELD_IMPACT_OUTPUTS.has(output)
  );
  const unsupportedOutputs = outputsIn(input.targetOutputs, ASTM_E989_OUTPUTS);

  if (supportedImpactOutputs.length === 0 && unsupportedOutputs.length > 0) {
    return "unsupported_adapter";
  }

  if (input.normalizedTopology.blockers.length > 0) {
    return "needs_input";
  }

  if (input.routeInputAssessment.missingPhysicalInputs.length > 0) {
    return "needs_input";
  }

  if (unsupportedOutputs.length > 0) {
    return "partial_ready_unsupported_adapter";
  }

  return "ready_for_runtime_gate";
}

export function buildGateVFloorImpactDynamicStiffnessContract(
  input: GateVFloorImpactDynamicStiffnessContractInput
): GateVFloorImpactDynamicStiffnessContract {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const normalizedTopology = normalizeDynamicCalculatorTopologyInput({
    airborneContext: input.airborneContext,
    catalog,
    floorImpactContext: input.floorImpactContext,
    layers: input.layers,
    maxLayerCount: input.maxLayerCount,
    previousLayers: input.previousLayers,
    route: "floor",
    targetOutputs: input.targetOutputs
  });
  const routeInputAssessment = normalizedTopology.routeInputAssessment;
  const unsupportedOutputs = outputsIn(input.targetOutputs, ASTM_E989_OUTPUTS);

  return {
    adapterBoundaries: buildAdapterBoundaries({
      routeInputAssessment,
      targetOutputs: input.targetOutputs
    }),
    fieldOutputAliasBlocked: true,
    inputCompleteness: floatingFloorCompleteness(routeInputAssessment),
    landedGate: "gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator",
    metricBasisBoundaries: [
      "Ln,w and DeltaLw stay ISO 717-2 lab impact outputs backed by the floor-impact predictor.",
      "L'n,w, L'nT,w, L'nT,50, and LnT,A require explicit field/apparent context before any value promotion.",
      "IIC and AIIC are ASTM E989 ratings and cannot be inferred by relabeling Ln,w."
    ],
    missingPhysicalInputs: routeInputAssessment.missingPhysicalInputs,
    normalizedTopology,
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure",
    requiredBeforeRuntimePromotion: REQUIRED_BEFORE_RUNTIME_PROMOTION,
    routeInputAssessment,
    runtimePromotionAllowed: false,
    runtimeValueMovement: false,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_w_promote_floor_impact_dynamic_stiffness_runtime_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts",
    selectionStatus:
      "gate_v_floor_impact_dynamic_stiffness_contract_landed_no_runtime_selected_floor_impact_runtime_gate_w",
    sourceRowsRequiredForInputContract: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status: statusFrom({
      normalizedTopology,
      routeInputAssessment,
      targetOutputs: input.targetOutputs
    }),
    targetOutputs: input.targetOutputs,
    unsupportedOutputs
  };
}

function catalogWithMissingGenericUnderlayDynamicStiffness(): readonly MaterialDefinition[] {
  return getDefaultMaterialCatalog().map((material) => {
    if (material.id !== "generic_resilient_underlay_s30") {
      return material;
    }

    return {
      ...material,
      impact: {}
    };
  });
}

export function buildGateVFloorImpactDynamicStiffnessScenarioPack(): readonly GateVFloorImpactDynamicStiffnessScenarioPackEntry[] {
  const missingStiffnessCatalog = catalogWithMissingGenericUnderlayDynamicStiffness();
  const reorderedLayers = [
    DEFAULT_HEAVY_FLOATING_FLOOR_STACK[3],
    DEFAULT_HEAVY_FLOATING_FLOOR_STACK[1],
    DEFAULT_HEAVY_FLOATING_FLOOR_STACK[0],
    DEFAULT_HEAVY_FLOATING_FLOOR_STACK[2]
  ] as const satisfies readonly LayerInput[];

  return [
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        floorImpactContext: DEFAULT_LOAD_CONTEXT,
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
      description:
        "Complete heavy floating-floor lab impact input can advance to the next runtime gate without needing a source row.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_runtime_gate",
      id: "gate_v_complete_heavy_floating_floor_dynamic_stiffness_ready"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        catalog: missingStiffnessCatalog,
        floorImpactContext: DEFAULT_LOAD_CONTEXT,
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
      description:
        "Missing resilient-layer dynamic stiffness is a targeted needs_input posture, not a source-catalog backlog item.",
      expectedMissingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      expectedStatus: "needs_input",
      id: "gate_v_missing_dynamic_stiffness_needs_input"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        floorImpactContext: {
          resilientLayerDynamicStiffnessMNm3: 30
        },
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
      description:
        "Missing load basis blocks high-accuracy impact promotion even when dynamic stiffness is known.",
      expectedMissingPhysicalInputs: ["loadBasisKgM2"],
      expectedStatus: "needs_input",
      id: "gate_v_missing_load_basis_needs_input"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        airborneContext: { contextMode: "element_lab" },
        floorImpactContext: DEFAULT_LOAD_CONTEXT,
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["L'n,w", "L'nT,w"]
      }),
      description:
        "Field impact outputs stay separate from lab Ln,w and ask for room/context inputs.",
      expectedMissingPhysicalInputs: [
        "contextMode",
        "partitionAreaM2",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S"
      ],
      expectedStatus: "needs_input",
      id: "gate_v_field_impact_without_room_context_needs_input"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        floorImpactContext: DEFAULT_LOAD_CONTEXT,
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "IIC", "AIIC"]
      }),
      description:
        "Lab Ln,w readiness can coexist with explicit unsupported ASTM rating outputs without aliasing.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "partial_ready_unsupported_adapter",
      id: "gate_v_iic_aiic_rating_adapter_stays_unsupported"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        catalog: missingStiffnessCatalog,
        floorImpactContext: {
          loadBasisKgM2: 100,
          resilientLayerDynamicStiffnessMNm3: 30
        },
        layers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
      description:
        "User-entered dynamic stiffness can fill a missing catalog property while preserving the same physics route.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_runtime_gate",
      id: "gate_v_manual_dynamic_stiffness_can_fill_missing_catalog_property"
    },
    {
      contract: buildGateVFloorImpactDynamicStiffnessContract({
        floorImpactContext: DEFAULT_LOAD_CONTEXT,
        layers: reorderedLayers,
        previousLayers: DEFAULT_HEAVY_FLOATING_FLOOR_STACK,
        targetOutputs: ["Ln,w", "DeltaLw"]
      }),
      description:
        "Role-defined floor layer reorders normalize safely and do not create runtime value movement.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "ready_for_runtime_gate",
      id: "gate_v_role_defined_floor_reorder_stays_stable"
    }
  ];
}
