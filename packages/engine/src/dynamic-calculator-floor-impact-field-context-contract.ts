import type {
  AcousticInputFieldId,
  AirborneContext,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";

import {
  buildGateVFloorImpactDynamicStiffnessContract
} from "./dynamic-calculator-floor-impact-dynamic-stiffness-contract";
import {
  type DynamicCalculatorFloorImpactContext
} from "./dynamic-calculator-route-input-topology";
import { getDefaultMaterialCatalog } from "./material-catalog";

export type GateYFloorImpactFieldContextScenarioId =
  | "gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency"
  | "gate_y_missing_context_mode_needs_input"
  | "gate_y_missing_partition_area_needs_input"
  | "gate_y_missing_receiving_room_volume_needs_input"
  | "gate_y_missing_receiving_room_rt60_needs_input"
  | "gate_y_missing_impact_field_context_needs_input"
  | "gate_y_missing_flanking_or_k_policy_needs_input"
  | "gate_y_missing_lab_dynamic_stiffness_anchor_needs_input";

export type GateYFloorImpactFieldAdapterId =
  | "ISO_717_2_Lprime_nw_field_impact"
  | "ISO_717_2_Lprime_nT_w_standardized_field_impact"
  | "ISO_717_2_Lprime_nT_50_low_frequency_field_impact";

export type GateYFloorImpactFieldContextStatus =
  | "blocked_low_frequency_owner"
  | "needs_input"
  | "not_requested"
  | "ready_for_runtime_gate";

export type GateYFloorImpactFieldAdapterBoundary = {
  adapterId: GateYFloorImpactFieldAdapterId;
  blockedOutputs: readonly RequestedOutputId[];
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  outputBasis:
    | "field_impact_apparent"
    | "field_impact_low_frequency_standardized"
    | "field_impact_standardized";
  requestedOutputs: readonly RequestedOutputId[];
  requiredOwnerInputs: readonly string[];
  requiredPhysicalInputs: readonly AcousticInputFieldId[];
  status: GateYFloorImpactFieldContextStatus;
};

export type GateYFloorImpactFieldContextAssessment = {
  adapterBoundaries: readonly GateYFloorImpactFieldAdapterBoundary[];
  blockedOutputs: readonly RequestedOutputId[];
  currentRuntimeBoundary: {
    fieldOnlyRequestsStillBlockedBeforeGateZ: boolean;
    labAnchoredMixedRequestsCanReachExistingFieldSupplement: boolean;
    selectedNextGateMustOwnFieldOnlyRuntimeAndVisibleParity: boolean;
  };
  id: GateYFloorImpactFieldContextScenarioId;
  missingOwnerInputs: readonly string[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  readyOutputs: readonly RequestedOutputId[];
  requestedOutputs: readonly RequestedOutputId[];
  runtimePromotionAllowedInGateY: false;
  sourceRowsRequiredForRuntimeSelection: false;
  status: GateYFloorImpactFieldContextStatus;
};

export type GateYFloorImpactFieldContextInput = {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext;
  impactFieldContext?: ImpactFieldContext;
  layers: readonly LayerInput[];
  lowFrequencyImpactOwnerAvailable?: boolean;
  scenarioId: GateYFloorImpactFieldContextScenarioId;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateYFloorImpactFieldContextContract = {
  adapterOwner: "ISO_717_2_floor_impact_field_context_adapter_boundary";
  currentRuntimeBoundary: GateYFloorImpactFieldContextAssessment["currentRuntimeBoundary"];
  landedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator";
  numericRuntimeBehaviorChange: false;
  previousLandedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary";
  requiredContextInputs: readonly AcousticInputFieldId[];
  requiredOwnerInputs: readonly string[];
  runtimePromotionAllowedInGateY: false;
  scenarioPack: readonly GateYFloorImpactFieldContextAssessment[];
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1";
  selectedNextAction: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator";
  selectedNextFile: "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts";
  selectionStatus: "gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z";
  sourceRowsRequiredForRuntimeSelection: false;
};

const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const READY_FIELD_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const LAB_ANCHOR_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const BASE_LAB_ANCHOR_FIELDS = [
  "baseSlabOrFloor",
  "toppingOrFloatingLayer",
  "resilientLayerDynamicStiffnessMNm3",
  "loadBasisKgM2"
] as const satisfies readonly AcousticInputFieldId[];

const FIELD_CONTEXT_FIELDS = [
  "contextMode",
  "partitionAreaM2",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "impactFieldContext"
] as const satisfies readonly AcousticInputFieldId[];

const REQUIRED_OWNER_INPUTS = [
  "labImpactAnchorLnWOrDeltaLw",
  "impactFieldContext.fieldKDb_or_guideMassRatio_or_direct_flanking_paths",
  "flankingPathOrJunctionPolicy",
  "lowFrequencyImpactSpectrumOrCI50_2500Owner"
] as const;

const HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID = "gate_y_resilient_underlay_missing_dynamic";

const HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
  { floorRole: "resilient_layer", materialId: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: "screed", thicknessMm: 30 },
  { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
] as const satisfies readonly LayerInput[];

const COMPLETE_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const COMPLETE_AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 5000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const COMPLETE_IMPACT_FIELD_CONTEXT = {
  enableSmallRoomEstimate: true,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

function catalogWithMissingDynamicStiffnessUnderlay(): readonly MaterialDefinition[] {
  const catalog = getDefaultMaterialCatalog();
  const base = catalog.find((material) => material.id === "generic_resilient_underlay_s30");

  if (!base) {
    throw new Error("Gate Y field-context contract requires the generic resilient underlay material.");
  }

  return [
    ...catalog,
    {
      ...base,
      id: MISSING_DYNAMIC_STIFFNESS_UNDERLAY_ID,
      impact: {},
      name: "Gate Y resilient underlay without dynamic stiffness"
    }
  ];
}

function unique<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function requestedFieldOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) =>
    FIELD_IMPACT_OUTPUTS.includes(output as (typeof FIELD_IMPACT_OUTPUTS)[number])
  );
}

function missingLabAnchorFields(input: GateYFloorImpactFieldContextInput): AcousticInputFieldId[] {
  const contract = buildGateVFloorImpactDynamicStiffnessContract({
    catalog: input.catalog ?? getDefaultMaterialCatalog(),
    floorImpactContext: input.floorImpactContext,
    layers: input.layers,
    targetOutputs: LAB_ANCHOR_OUTPUTS
  });
  const labBoundary = contract.adapterBoundaries.find(
    (boundary) => boundary.adapterId === "ISO_717_2_Lnw_DeltaLw"
  );

  return labBoundary ? [...labBoundary.missingPhysicalInputs] : [...BASE_LAB_ANCHOR_FIELDS];
}

function hasPartitionArea(context: AirborneContext | undefined): boolean {
  return Boolean(
    typeof context?.panelHeightMm === "number" &&
      context.panelHeightMm > 0 &&
      typeof context?.panelWidthMm === "number" &&
      context.panelWidthMm > 0
  );
}

function missingFieldContextFields(input: GateYFloorImpactFieldContextInput): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];
  const context = input.airborneContext;

  if (!context?.contextMode || context.contextMode === "element_lab") {
    missing.push("contextMode");
  }

  if (!hasPartitionArea(context)) {
    missing.push("partitionAreaM2");
  }

  if (!(typeof context?.receivingRoomVolumeM3 === "number" && context.receivingRoomVolumeM3 > 0)) {
    missing.push("receivingRoomVolumeM3");
  }

  if (!(typeof context?.receivingRoomRt60S === "number" && context.receivingRoomRt60S > 0)) {
    missing.push("receivingRoomRt60S");
  }

  if (!hasImpactFieldContext(input.impactFieldContext)) {
    missing.push("impactFieldContext");
  }

  return unique(missing);
}

function hasImpactFieldContext(context: ImpactFieldContext | undefined): boolean {
  return Boolean(
    context &&
      (
        typeof context.fieldKDb === "number" ||
        typeof context.guideMassRatio === "number" ||
        typeof context.directPathOffsetDb === "number" ||
        (Array.isArray(context.flankingPaths) && context.flankingPaths.length > 0)
      ) &&
      typeof context.receivingRoomVolumeM3 === "number" &&
      context.receivingRoomVolumeM3 > 0
  );
}

function hasFlankingOrKPolicy(context: ImpactFieldContext | undefined): boolean {
  const hasGuideK = typeof context?.fieldKDb === "number" || typeof context?.guideMassRatio === "number";
  const hasDirectFlanking =
    Array.isArray(context?.flankingPaths) &&
    context.flankingPaths.length > 0 &&
    (typeof context.fieldKDb === "number" || typeof context.directPathOffsetDb === "number");

  return Boolean(hasGuideK || hasDirectFlanking);
}

function missingOwnerInputs(input: GateYFloorImpactFieldContextInput): string[] {
  const missing: string[] = [];

  if (missingLabAnchorFields(input).length > 0) {
    missing.push("labImpactAnchorLnWOrDeltaLw");
  }

  if (!hasFlankingOrKPolicy(input.impactFieldContext)) {
    missing.push(
      "impactFieldContext.fieldKDb_or_guideMassRatio_or_direct_flanking_paths",
      "flankingPathOrJunctionPolicy"
    );
  }

  if (
    input.targetOutputs.includes("L'nT,50") &&
    input.lowFrequencyImpactOwnerAvailable !== true
  ) {
    missing.push("lowFrequencyImpactSpectrumOrCI50_2500Owner");
  }

  return unique(missing);
}

function outputReady(
  output: RequestedOutputId,
  input: GateYFloorImpactFieldContextInput,
  physicalMissing: readonly AcousticInputFieldId[],
  ownerMissing: readonly string[]
): boolean {
  if (!READY_FIELD_OUTPUTS.includes(output as (typeof READY_FIELD_OUTPUTS)[number])) {
    return input.lowFrequencyImpactOwnerAvailable === true && output === "L'nT,50";
  }

  const nonLowFrequencyOwnerMissing = ownerMissing.filter(
    (owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner"
  );

  return physicalMissing.length === 0 && nonLowFrequencyOwnerMissing.length === 0;
}

function buildAdapterBoundary(input: {
  adapterId: GateYFloorImpactFieldAdapterId;
  assessmentInput: GateYFloorImpactFieldContextInput;
  output: RequestedOutputId;
  outputBasis: GateYFloorImpactFieldAdapterBoundary["outputBasis"];
  physicalMissing: readonly AcousticInputFieldId[];
  ownerMissing: readonly string[];
}): GateYFloorImpactFieldAdapterBoundary {
  const requested = input.assessmentInput.targetOutputs.includes(input.output);
  if (!requested) {
    return {
      adapterId: input.adapterId,
      blockedOutputs: [],
      missingOwnerInputs: [],
      missingPhysicalInputs: [],
      outputBasis: input.outputBasis,
      requestedOutputs: [],
      requiredOwnerInputs: REQUIRED_OWNER_INPUTS,
      requiredPhysicalInputs: [...BASE_LAB_ANCHOR_FIELDS, ...FIELD_CONTEXT_FIELDS],
      status: "not_requested"
    };
  }

  const isLowFrequency = input.output === "L'nT,50";
  const lowFrequencyBlocked =
    isLowFrequency &&
    input.assessmentInput.lowFrequencyImpactOwnerAvailable !== true &&
    input.physicalMissing.length === 0 &&
    input.ownerMissing.every((owner) => owner === "lowFrequencyImpactSpectrumOrCI50_2500Owner");
  const ready = outputReady(
    input.output,
    input.assessmentInput,
    input.physicalMissing,
    input.ownerMissing
  );

  return {
    adapterId: input.adapterId,
    blockedOutputs: lowFrequencyBlocked ? [input.output] : [],
    missingOwnerInputs: input.ownerMissing,
    missingPhysicalInputs: input.physicalMissing,
    outputBasis: input.outputBasis,
    requestedOutputs: [input.output],
    requiredOwnerInputs: REQUIRED_OWNER_INPUTS,
    requiredPhysicalInputs: [...BASE_LAB_ANCHOR_FIELDS, ...FIELD_CONTEXT_FIELDS],
    status: ready
      ? "ready_for_runtime_gate"
      : lowFrequencyBlocked
        ? "blocked_low_frequency_owner"
        : "needs_input"
  };
}

export function buildGateYFloorImpactFieldContextAssessment(
  input: GateYFloorImpactFieldContextInput
): GateYFloorImpactFieldContextAssessment {
  const fieldOutputs = requestedFieldOutputs(input.targetOutputs);
  const physicalMissing =
    fieldOutputs.length > 0
      ? unique([
          ...missingLabAnchorFields(input),
          ...missingFieldContextFields(input)
        ])
      : [];
  const ownersMissing = fieldOutputs.length > 0 ? missingOwnerInputs(input) : [];
  const adapterBoundaries: GateYFloorImpactFieldAdapterBoundary[] = [
    buildAdapterBoundary({
      adapterId: "ISO_717_2_Lprime_nw_field_impact",
      assessmentInput: input,
      output: "L'n,w",
      outputBasis: "field_impact_apparent",
      ownerMissing: ownersMissing.filter((owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner"),
      physicalMissing
    }),
    buildAdapterBoundary({
      adapterId: "ISO_717_2_Lprime_nT_w_standardized_field_impact",
      assessmentInput: input,
      output: "L'nT,w",
      outputBasis: "field_impact_standardized",
      ownerMissing: ownersMissing.filter((owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner"),
      physicalMissing
    }),
    buildAdapterBoundary({
      adapterId: "ISO_717_2_Lprime_nT_50_low_frequency_field_impact",
      assessmentInput: input,
      output: "L'nT,50",
      outputBasis: "field_impact_low_frequency_standardized",
      ownerMissing: ownersMissing,
      physicalMissing
    })
  ];
  const blockedOutputs = unique(adapterBoundaries.flatMap((boundary) => boundary.blockedOutputs));
  const readyOutputs = fieldOutputs.filter((output) =>
    outputReady(output, input, physicalMissing, ownersMissing)
  );
  const status =
    fieldOutputs.length === 0
      ? "not_requested"
      : physicalMissing.length > 0 ||
          ownersMissing.some((owner) => owner !== "lowFrequencyImpactSpectrumOrCI50_2500Owner")
        ? "needs_input"
        : readyOutputs.length > 0
          ? "ready_for_runtime_gate"
          : "blocked_low_frequency_owner";

  return {
    adapterBoundaries,
    blockedOutputs,
    currentRuntimeBoundary: {
      fieldOnlyRequestsStillBlockedBeforeGateZ: true,
      labAnchoredMixedRequestsCanReachExistingFieldSupplement: true,
      selectedNextGateMustOwnFieldOnlyRuntimeAndVisibleParity: true
    },
    id: input.scenarioId,
    missingOwnerInputs: ownersMissing,
    missingPhysicalInputs: physicalMissing,
    readyOutputs,
    requestedOutputs: fieldOutputs,
    runtimePromotionAllowedInGateY: false,
    sourceRowsRequiredForRuntimeSelection: false,
    status
  };
}

export function buildGateYFloorImpactFieldContextScenarioPack(): readonly GateYFloorImpactFieldContextAssessment[] {
  return [
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_complete_lab_anchor_and_field_context_ready_except_low_frequency",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: {
        ...COMPLETE_AIRBORNE_FIELD_CONTEXT,
        contextMode: undefined
      },
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_context_mode_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: {
        ...COMPLETE_AIRBORNE_FIELD_CONTEXT,
        panelHeightMm: undefined,
        panelWidthMm: undefined
      },
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_partition_area_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: {
        ...COMPLETE_AIRBORNE_FIELD_CONTEXT,
        receivingRoomVolumeM3: undefined
      },
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_receiving_room_volume_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: {
        ...COMPLETE_AIRBORNE_FIELD_CONTEXT,
        receivingRoomRt60S: undefined
      },
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_receiving_room_rt60_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_impact_field_context_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: {
        receivingRoomVolumeM3: 55
      },
      layers: HEAVY_FLOATING_FLOOR_STACK,
      scenarioId: "gate_y_missing_flanking_or_k_policy_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    }),
    buildGateYFloorImpactFieldContextAssessment({
      airborneContext: COMPLETE_AIRBORNE_FIELD_CONTEXT,
      catalog: catalogWithMissingDynamicStiffnessUnderlay(),
      floorImpactContext: {
        loadBasisKgM2: 76
      },
      impactFieldContext: COMPLETE_IMPACT_FIELD_CONTEXT,
      layers: HEAVY_FLOATING_FLOOR_STACK_MISSING_DYNAMIC,
      scenarioId: "gate_y_missing_lab_dynamic_stiffness_anchor_needs_input",
      targetOutputs: FIELD_IMPACT_OUTPUTS
    })
  ];
}

export function buildGateYFloorImpactFieldContextContract(): GateYFloorImpactFieldContextContract {
  return {
    adapterOwner: "ISO_717_2_floor_impact_field_context_adapter_boundary",
    currentRuntimeBoundary: {
      fieldOnlyRequestsStillBlockedBeforeGateZ: true,
      labAnchoredMixedRequestsCanReachExistingFieldSupplement: true,
      selectedNextGateMustOwnFieldOnlyRuntimeAndVisibleParity: true
    },
    landedGate: "gate_y_define_floor_impact_field_context_boundary_for_dynamic_calculator",
    numericRuntimeBehaviorChange: false,
    previousLandedGate: "gate_x_select_next_dynamic_calculator_solver_or_field_context_boundary",
    requiredContextInputs: FIELD_CONTEXT_FIELDS,
    requiredOwnerInputs: REQUIRED_OWNER_INPUTS,
    runtimePromotionAllowedInGateY: false,
    scenarioPack: buildGateYFloorImpactFieldContextScenarioPack(),
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: "gate_z_promote_floor_impact_field_context_runtime_for_dynamic_calculator",
    selectedNextFile:
      "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-z-floor-impact-field-runtime-contract.test.ts",
    selectionStatus:
      "gate_y_floor_impact_field_context_contract_landed_no_runtime_selected_field_runtime_gate_z",
    sourceRowsRequiredForRuntimeSelection: false
  };
}
