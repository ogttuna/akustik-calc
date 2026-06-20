import {
  AcousticInputCompletenessSchema,
  type AcousticInputAppliedDefault,
  type AcousticInputCompleteness,
  type AcousticInputFieldId,
  type AcousticInputRequirement,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

export type GateQDoubleLeafFrameBridgeClass =
  | "direct_fixed_bridge"
  | "independent_frame"
  | "resilient_bridge"
  | "shared_stud_bridge"
  | "twin_frame_bridge"
  | "unknown";

export type GateQDoubleLeafFramedBridgePromptSource =
  | "material_property"
  | "wall_topology";

export type GateQDoubleLeafFramedBridgePrompt = {
  detail: string;
  fieldId: AcousticInputFieldId;
  label: string;
  promptId: string;
  source: GateQDoubleLeafFramedBridgePromptSource;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateQDoubleLeafFramedBridgeBenchmarkScenarioId =
  | "gate_q_double_leaf_direct_fixed_bridge_negative"
  | "gate_q_double_leaf_explicit_independent_absorbed_cavity"
  | "gate_q_double_leaf_missing_bridge_and_spacing_needs_input"
  | "gate_q_double_leaf_resilient_bridge_side_count_needs_input"
  | "gate_q_multicavity_flat_list_stays_out_of_double_leaf";

export type GateQDoubleLeafFramedBridgeInputContract = {
  benchmarkScenarioIds: readonly GateQDoubleLeafFramedBridgeBenchmarkScenarioId[];
  bridgeClass: GateQDoubleLeafFrameBridgeClass;
  inputCompleteness: AcousticInputCompleteness;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  negativeScenarioIds: readonly GateQDoubleLeafFramedBridgeBenchmarkScenarioId[];
  positiveScenarioIds: readonly GateQDoubleLeafFramedBridgeBenchmarkScenarioId[];
  prompts: readonly GateQDoubleLeafFramedBridgePrompt[];
  requiredBeforeRuntimePromotion: readonly AcousticInputFieldId[];
  runtimePromotionAllowed: false;
  runtimeValueMovement: false;
  sourceAbsenceBlocksOnlyExactOrCalibration: true;
  sourceRowsRequiredForInputContract: false;
  targetOutputs: readonly RequestedOutputId[];
};

export type GateQDoubleLeafFramedBridgeScenarioPackEntry = {
  contract: GateQDoubleLeafFramedBridgeInputContract;
  description: string;
  expectedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  expectedStatus: AcousticInputCompleteness["status"];
  id: GateQDoubleLeafFramedBridgeBenchmarkScenarioId;
  includedInDoubleLeafRuntimePromotion: false;
};

type RequirementSpec = {
  detail: string;
  fieldId: AcousticInputFieldId;
  isMissing: boolean;
  label: string;
  requirementType: AcousticInputRequirement["requirementType"];
  source: GateQDoubleLeafFramedBridgePromptSource;
};

const WALL_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_BEFORE_RUNTIME_PROMOTION = [
  "sideALeafGroup",
  "cavity1DepthMm",
  "sideBLeafGroup",
  "frameBridgeClass",
  "supportTopology",
  "supportSpacingMm"
] as const satisfies readonly AcousticInputFieldId[];

const CONDITIONAL_BEFORE_RUNTIME_PROMOTION = [
  "resilientBarSideCount",
  "cavity1FillCoverage",
  "absorberClass"
] as const satisfies readonly AcousticInputFieldId[];

const OPTIONAL_PRECISION_FIELDS = [
  "flowResistivityPaSM2",
  "absorberClass",
  "porousFillCoverage",
  "porousFillThicknessMm",
  "lossFactor"
] as const satisfies readonly AcousticInputFieldId[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function resolveLayerMaterial(
  layer: LayerInput | ResolvedLayer,
  catalog: readonly MaterialDefinition[]
): MaterialDefinition | null {
  if ("material" in layer && layer.material.id === layer.materialId) {
    return layer.material;
  }

  try {
    return resolveMaterial(layer.materialId, catalog);
  } catch {
    return null;
  }
}

function isPorousFillLayer(layer: LayerInput, catalog: readonly MaterialDefinition[]): boolean {
  const material = resolveLayerMaterial(layer, catalog);
  return (
    material?.acoustic?.behavior === "porous_absorber" ||
    material?.category === "insulation" ||
    (material?.tags ?? []).some((tag) => /cavity-fill|porous/u.test(tag))
  );
}

function isCavityLayer(layer: LayerInput, catalog: readonly MaterialDefinition[]): boolean {
  const material = resolveLayerMaterial(layer, catalog);
  return (
    material?.acoustic?.behavior === "air_cavity" ||
    (material?.tags ?? []).some((tag) => tag === "cavity")
  );
}

function hasPorousFill(layers: readonly LayerInput[], catalog: readonly MaterialDefinition[]): boolean {
  return layers.some((layer) => isPorousFillLayer(layer, catalog));
}

function hasCavityOrPorousLayer(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  return layers.some((layer) => isCavityLayer(layer, catalog) || isPorousFillLayer(layer, catalog));
}

function positiveFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

export function resolveGateQDoubleLeafFramedBridgeCavityDepthMm(
  context: AirborneContext | null | undefined
): number | null {
  const topologyDepth = positiveFiniteNumber(context?.wallTopology?.cavity1DepthMm);
  const advancedDepth = positiveFiniteNumber(context?.advancedWall?.cavities?.[0]?.depthMm);

  return topologyDepth ?? advancedDepth;
}

function hasPositiveCavityDepth(context: AirborneContext | undefined): boolean {
  return resolveGateQDoubleLeafFramedBridgeCavityDepthMm(context) !== null;
}

function hasExplicitEmptyCavity(topology: AirborneContext["wallTopology"] | undefined): boolean {
  return topology?.cavity1FillCoverage === "empty" && topology.cavity1AbsorptionClass === "none";
}

function hasContextOwnedPorousCavityInput(context: AirborneContext | undefined): boolean {
  const topology = context?.wallTopology;
  const primaryCavity = context?.advancedWall?.cavities?.[0];
  return Boolean(
    topology?.cavity1AbsorptionClass === "porous_absorptive" &&
      (topology.cavity1FillCoverage === "full" || topology.cavity1FillCoverage === "partial") &&
      typeof primaryCavity?.absorberFlowResistivityPaSM2 === "number" &&
      Number.isFinite(primaryCavity.absorberFlowResistivityPaSM2) &&
      primaryCavity.absorberFlowResistivityPaSM2 > 0
  );
}

function hasEngineeringFlowDefault(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  return layers.some((layer) => {
    const material = resolveLayerMaterial(layer, catalog);
    return (
      material?.acoustic?.behavior === "porous_absorber" &&
      typeof material.acoustic.flowResistivityPaSM2 === "number" &&
      material.acoustic.propertySourceStatus === "engineering_default"
    );
  });
}

function needsPorousFlowResistivityInput(input: {
  context: AirborneContext | undefined;
  layers: readonly LayerInput[];
  catalog: readonly MaterialDefinition[];
}): boolean {
  const topology = input.context?.wallTopology;
  if (
    topology?.cavity1AbsorptionClass !== "porous_absorptive" ||
    (topology.cavity1FillCoverage !== "full" && topology.cavity1FillCoverage !== "partial")
  ) {
    return false;
  }

  if (hasContextOwnedPorousCavityInput(input.context)) {
    return false;
  }

  return input.layers.some((layer) => {
    const material = resolveLayerMaterial(layer, input.catalog);
    if (material?.acoustic?.behavior !== "porous_absorber") {
      return false;
    }

    const hasNumericFlow =
      typeof material.acoustic.flowResistivityPaSM2 === "number" &&
      Number.isFinite(material.acoustic.flowResistivityPaSM2) &&
      material.acoustic.flowResistivityPaSM2 > 0;
    if (hasNumericFlow) {
      return false;
    }

    return (
      material.acoustic.propertySourceStatus === "user_supplied" ||
      material.acoustic.propertySourceStatus === "unknown" ||
      material.acoustic.propertySourceStatus === undefined
    );
  });
}

export function classifyGateQDoubleLeafFrameBridge(
  context: AirborneContext | undefined
): GateQDoubleLeafFrameBridgeClass {
  const supportTopology = context?.wallTopology?.supportTopology;

  if (supportTopology === "direct_fixed" || context?.connectionType === "direct_fix") {
    return "direct_fixed_bridge";
  }

  if (
    supportTopology === "resilient_channel" ||
    context?.connectionType === "resilient_channel" ||
    context?.studType === "resilient_stud"
  ) {
    return "resilient_bridge";
  }

  if (
    supportTopology === "single_shared_stud" ||
    context?.sharedTrack === "shared" ||
    context?.connectionType === "line_connection" ||
    context?.connectionType === "point_connection" ||
    context?.connectionType === "mixed_connection"
  ) {
    return "shared_stud_bridge";
  }

  if (supportTopology === "twin_frame") {
    return "twin_frame_bridge";
  }

  if (supportTopology === "independent_frames" || context?.sharedTrack === "independent") {
    return "independent_frame";
  }

  return "unknown";
}

function addPrompt(
  prompts: GateQDoubleLeafFramedBridgePrompt[],
  prompt: GateQDoubleLeafFramedBridgePrompt
): void {
  if (!prompts.some((entry) => entry.promptId === prompt.promptId)) {
    prompts.push(prompt);
  }
}

function buildRequirement(
  spec: RequirementSpec,
  targetOutputs: readonly RequestedOutputId[]
): AcousticInputRequirement {
  return {
    defaultPolicy: spec.requirementType === "optional_precision_input" ? "documented_precision_default" : "no_default",
    fieldId: spec.fieldId,
    label: spec.label,
    missingBehavior:
      spec.requirementType === "optional_precision_input" ? "widen_uncertainty" : "needs_input",
    notes: [spec.detail],
    requirementType: spec.requirementType,
    targetOutputs: [...targetOutputs],
    uncertaintyEffect:
      spec.requirementType === "optional_precision_input" ? "widen_error_budget" : "none"
  };
}

function promptFor(
  spec: RequirementSpec,
  targetOutputs: readonly RequestedOutputId[]
): GateQDoubleLeafFramedBridgePrompt {
  return {
    detail: spec.detail,
    fieldId: spec.fieldId,
    label: spec.label,
    promptId: `gate_q_double_leaf_${spec.fieldId}`,
    source: spec.source,
    targetOutputs
  };
}

export function buildGateQDoubleLeafFramedBridgeInputContract(input: {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  sourceEvidenceAvailable?: boolean;
  targetOutputs?: readonly RequestedOutputId[];
}): GateQDoubleLeafFramedBridgeInputContract {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const targetOutputs = input.targetOutputs ?? WALL_AIRBORNE_OUTPUTS;
  const topology = input.airborneContext?.wallTopology;
  const bridgeClass = classifyGateQDoubleLeafFrameBridge(input.airborneContext);
  const prompts: GateQDoubleLeafFramedBridgePrompt[] = [];
  const missing: AcousticInputFieldId[] = [];
  const requiresResilientSideCount = bridgeClass === "resilient_bridge";
  const hasPorousCavityFill = hasPorousFill(input.layers, catalog);
  const hasVisibleCavityOrPorousLayer = hasCavityOrPorousLayer(input.layers, catalog);
  const hasExplicitCavityDepth = hasPositiveCavityDepth(input.airborneContext);
  const hasContextOwnedPorousCavity = hasContextOwnedPorousCavityInput(input.airborneContext);
  const usesEngineeringFlowDefault = hasEngineeringFlowDefault(input.layers, catalog);
  const needsPorousFlowInput = needsPorousFlowResistivityInput({
    catalog,
    context: input.airborneContext,
    layers: input.layers
  });
  const requirements: RequirementSpec[] = [
    {
      detail: "Group the source-side leaf before a double-leaf/framed solver can own mass-air-mass resonance.",
      fieldId: "sideALeafGroup",
      isMissing: !topology?.sideALeafLayerIndices,
      label: "Side A leaf group",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail:
        "Enter a positive cavity depth in millimetres between the leaves; advanced cavity depth is used only when topology depth is omitted.",
      fieldId: "cavity1DepthMm",
      isMissing: !hasExplicitCavityDepth,
      label: "Cavity depth",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail: "Group the receiving-side leaf before the double-leaf/framed route can leave screening posture.",
      fieldId: "sideBLeafGroup",
      isMissing: !topology?.sideBLeafLayerIndices,
      label: "Side B leaf group",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail:
        "Select whether the leaves are independent, twin-frame, shared-stud, resiliently bridged, or direct-fixed.",
      fieldId: "frameBridgeClass",
      isMissing: bridgeClass === "unknown",
      label: "Frame bridge class",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail: "Select the support topology so bridge coupling is explicit.",
      fieldId: "supportTopology",
      isMissing: !topology?.supportTopology || topology.supportTopology === "unknown",
      label: "Support topology",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail: "Enter support or stud spacing in millimetres for the bridge-coupling model.",
      fieldId: "supportSpacingMm",
      isMissing:
        typeof input.airborneContext?.studSpacingMm !== "number" ||
        !Number.isFinite(input.airborneContext.studSpacingMm) ||
        input.airborneContext.studSpacingMm <= 0,
      label: "Support/stud spacing",
      requirementType: "required_physical_input",
      source: "wall_topology"
    },
    {
      detail: "Enter whether resilient bars/channels are on one side or both sides before resilient bridge promotion.",
      fieldId: "resilientBarSideCount",
      isMissing:
        requiresResilientSideCount &&
        (!input.airborneContext?.resilientBarSideCount ||
          input.airborneContext.resilientBarSideCount === "auto"),
      label: "Resilient side count",
      requirementType: "conditional_physical_input",
      source: "wall_topology"
    },
    {
      detail:
        "When no visible cavity or porous-fill layer is present, classify the context-only cavity as empty before the solver can treat the typed depth as physical.",
      fieldId: "cavity1FillCoverage",
      isMissing:
        hasExplicitCavityDepth &&
        !hasVisibleCavityOrPorousLayer &&
        !hasExplicitEmptyCavity(topology) &&
        !hasContextOwnedPorousCavity,
      label: "Cavity fill coverage",
      requirementType: "conditional_physical_input",
      source: "wall_topology"
    },
    {
      detail:
        "When no visible cavity or porous-fill layer is present, classify the context-only cavity absorption as none before the solver can apply zero porous damping.",
      fieldId: "absorberClass",
      isMissing:
        hasExplicitCavityDepth &&
        !hasVisibleCavityOrPorousLayer &&
        !hasExplicitEmptyCavity(topology) &&
        !hasContextOwnedPorousCavity,
      label: "Cavity absorption class",
      requirementType: "conditional_physical_input",
      source: "wall_topology"
    },
    {
      detail:
        "Enter the porous absorber flow resistivity, or explicitly adopt an engineering-default material value before the solver applies porous damping.",
      fieldId: "flowResistivityPaSM2",
      isMissing: needsPorousFlowInput,
      label: "Porous fill flow resistivity",
      requirementType: "conditional_physical_input",
      source: "material_property"
    }
  ];

  for (const requirement of requirements) {
    if (!requirement.isMissing) {
      continue;
    }

    missing.push(requirement.fieldId);
    addPrompt(prompts, promptFor(requirement, targetOutputs));
  }

  const appliedDefaults: AcousticInputAppliedDefault[] =
    hasPorousCavityFill && usesEngineeringFlowDefault
      ? [
          {
            fieldId: "flowResistivityPaSM2",
            reason:
              "Porous cavity fill uses an engineering-default flow resistivity until a product-specific value is entered.",
            uncertaintyEffect: "widen_error_budget"
          }
        ]
      : [];
  const missingSourceEvidence =
    input.sourceEvidenceAvailable === true ? [] : ["exact_full_stack_source_absent"];
  const status =
    missing.length > 0 ? "needs_input" : appliedDefaults.length > 0 ? "complete_with_defaults" : "complete";
  const inputCompleteness = AcousticInputCompletenessSchema.parse({
    appliedDefaults,
    conditionalFields: unique([...CONDITIONAL_BEFORE_RUNTIME_PROMOTION, "flowResistivityPaSM2"]),
    id: "gate_q_double_leaf_framed_bridge_route_inputs",
    missingPhysicalInputs: unique(missing),
    missingSourceEvidence,
    notes: [
      "Gate Q owns the double-leaf/framed input contract only; runtime values stay unchanged.",
      "Source absence blocks exact or calibrated promotion only, not source-absent solver development."
    ],
    optionalPrecisionFields: [...OPTIONAL_PRECISION_FIELDS],
    requiredFields: [...REQUIRED_BEFORE_RUNTIME_PROMOTION],
    requirements: [
      ...requirements.map((requirement) => buildRequirement(requirement, targetOutputs)),
      ...OPTIONAL_PRECISION_FIELDS.map((fieldId): AcousticInputRequirement => ({
        defaultPolicy: "documented_precision_default",
        fieldId,
        label: fieldId,
        missingBehavior: "widen_uncertainty",
        notes: ["Optional precision field for double-leaf/framed bridge error-budget tightening."],
        requirementType: "optional_precision_input",
        targetOutputs: [...targetOutputs],
        uncertaintyEffect: "widen_error_budget"
      }))
    ],
    routeFamily: "double_leaf_framed_airborne",
    status,
    targetOutputs: [...targetOutputs]
  });

  return {
    benchmarkScenarioIds: [
      "gate_q_double_leaf_explicit_independent_absorbed_cavity",
      "gate_q_double_leaf_missing_bridge_and_spacing_needs_input",
      "gate_q_double_leaf_resilient_bridge_side_count_needs_input",
      "gate_q_double_leaf_direct_fixed_bridge_negative",
      "gate_q_multicavity_flat_list_stays_out_of_double_leaf"
    ],
    bridgeClass,
    inputCompleteness,
    missingPhysicalInputs: inputCompleteness.missingPhysicalInputs,
    negativeScenarioIds: [
      "gate_q_double_leaf_direct_fixed_bridge_negative",
      "gate_q_multicavity_flat_list_stays_out_of_double_leaf"
    ],
    positiveScenarioIds: [
      "gate_q_double_leaf_explicit_independent_absorbed_cavity",
      "gate_q_double_leaf_missing_bridge_and_spacing_needs_input",
      "gate_q_double_leaf_resilient_bridge_side_count_needs_input"
    ],
    prompts,
    requiredBeforeRuntimePromotion: [...REQUIRED_BEFORE_RUNTIME_PROMOTION],
    runtimePromotionAllowed: false,
    runtimeValueMovement: false,
    sourceAbsenceBlocksOnlyExactOrCalibration: true,
    sourceRowsRequiredForInputContract: false,
    targetOutputs
  };
}

export function buildGateQDoubleLeafFramedBridgeScenarioPack(): readonly GateQDoubleLeafFramedBridgeScenarioPackEntry[] {
  const completeIndependentLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 90 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const completeIndependentContext: AirborneContext = {
    airtightness: "good",
    contextMode: "element_lab",
    sharedTrack: "independent",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "independent_frames",
      topologyMode: "double_leaf_framed"
    }
  };
  const missingBridgeContext: AirborneContext = {
    contextMode: "element_lab",
    wallTopology: {
      topologyMode: "double_leaf_framed"
    }
  };
  const resilientContextMissingSideCount: AirborneContext = {
    connectionType: "resilient_channel",
    contextMode: "element_lab",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 75,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "resilient_channel",
      topologyMode: "double_leaf_framed"
    }
  };
  const directFixedContext: AirborneContext = {
    connectionType: "direct_fix",
    contextMode: "element_lab",
    studSpacingMm: 400,
    wallTopology: {
      cavity1AbsorptionClass: "none",
      cavity1DepthMm: 45,
      cavity1FillCoverage: "empty",
      cavity1LayerIndices: [1],
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [2],
      supportTopology: "direct_fixed",
      topologyMode: "double_leaf_framed"
    }
  };
  const directFixedLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 45 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const multicavityLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const entries: readonly {
    context: AirborneContext;
    description: string;
    expectedMissingPhysicalInputs: readonly AcousticInputFieldId[];
    expectedStatus: AcousticInputCompleteness["status"];
    id: GateQDoubleLeafFramedBridgeBenchmarkScenarioId;
    layers: readonly LayerInput[];
  }[] = [
    {
      context: completeIndependentContext,
      description: "Explicit independent absorbed double-leaf wall is input-complete with flow-resistivity default uncertainty.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "complete_with_defaults",
      id: "gate_q_double_leaf_explicit_independent_absorbed_cavity",
      layers: completeIndependentLayers
    },
    {
      context: missingBridgeContext,
      description: "A double-leaf/framed route with no grouping, bridge class, or spacing asks for exact physical inputs.",
      expectedMissingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      expectedStatus: "needs_input",
      id: "gate_q_double_leaf_missing_bridge_and_spacing_needs_input",
      layers: completeIndependentLayers
    },
    {
      context: resilientContextMissingSideCount,
      description: "A resilient bridge with unknown side count stays needs_input instead of guessing one-side or two-side behavior.",
      expectedMissingPhysicalInputs: ["resilientBarSideCount"],
      expectedStatus: "needs_input",
      id: "gate_q_double_leaf_resilient_bridge_side_count_needs_input",
      layers: completeIndependentLayers
    },
    {
      context: directFixedContext,
      description: "Direct-fixed leaves are input-complete but remain a negative bridge class for later runtime promotion.",
      expectedMissingPhysicalInputs: [],
      expectedStatus: "complete",
      id: "gate_q_double_leaf_direct_fixed_bridge_negative",
      layers: directFixedLayers
    },
    {
      context: missingBridgeContext,
      description: "A multi-cavity flat list is tracked as a nearby negative, not promoted by the double-leaf contract.",
      expectedMissingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      expectedStatus: "needs_input",
      id: "gate_q_multicavity_flat_list_stays_out_of_double_leaf",
      layers: multicavityLayers
    }
  ];

  return entries.map((entry) => {
    const contract = buildGateQDoubleLeafFramedBridgeInputContract({
      airborneContext: entry.context,
      layers: entry.layers,
      targetOutputs: WALL_AIRBORNE_OUTPUTS
    });

    return {
      contract,
      description: entry.description,
      expectedMissingPhysicalInputs: entry.expectedMissingPhysicalInputs,
      expectedStatus: entry.expectedStatus,
      id: entry.id,
      includedInDoubleLeafRuntimePromotion: false
    };
  });
}
