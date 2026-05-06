import {
  AcousticInputCompletenessSchema,
  type AcousticInputCompleteness,
  type AcousticInputFieldId,
  type AcousticInputRouteFamily,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";
import { buildGateQDoubleLeafFramedBridgeInputContract } from "./dynamic-calculator-double-leaf-framed-bridge-input-contract";

export type DynamicCalculatorRoute = "wall" | "floor";
export type DynamicCalculatorOutputBasis = "element_lab" | "field_apparent" | "building_prediction";
export type DynamicCalculatorRouteInputStatus =
  | "complete"
  | "complete_with_defaults"
  | "needs_input"
  | "unsupported";

export type DynamicCalculatorPromptSource =
  | "field_context"
  | "floor_role"
  | "material_property"
  | "output_basis"
  | "route"
  | "wall_topology";

export type DynamicCalculatorRouteInputPrompt = {
  detail: string;
  fieldId: AcousticInputFieldId;
  label: string;
  promptId: string;
  source: DynamicCalculatorPromptSource;
  targetOutputs: readonly RequestedOutputId[];
};

export type DynamicCalculatorFloorImpactContext = {
  loadBasisKgM2?: number;
  resilientLayerDynamicStiffnessMNm3?: number;
};

export type DynamicCalculatorRouteInputTopologyAssessment = {
  inputCompletenessSet: readonly AcousticInputCompleteness[];
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  missingSourceEvidence: readonly string[];
  notes: readonly string[];
  outputBasis: DynamicCalculatorOutputBasis;
  prompts: readonly DynamicCalculatorRouteInputPrompt[];
  route: DynamicCalculatorRoute;
  routeFamilies: readonly AcousticInputRouteFamily[];
  runtimeValueMovement: false;
  sourceAbsenceBlocksOnlyExactOrCalibration: true;
  sourceCatalogQueueOnly: false;
  status: DynamicCalculatorRouteInputStatus;
  targetOutputs: readonly RequestedOutputId[];
  unsupportedOutputs: readonly RequestedOutputId[];
};

export type DynamicCalculatorRouteInputTopologyInput = {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext;
  layers: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  sourceEvidenceAvailable?: boolean;
  targetOutputs: readonly RequestedOutputId[];
};

const FIELD_OR_APPARENT_OUTPUTS = new Set<RequestedOutputId>([
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);

const FLOATING_OR_FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>([
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
]);

const UNSUPPORTED_RUNTIME_OUTPUTS = new Set<RequestedOutputId>([
  "AIIC",
  "HIIC",
  "IIC",
  "ISR",
  "LIIC",
  "LIR",
  "NISR"
]);

const WALL_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_CONTEXT_OUTPUTS = [
  "R'w",
  "DnT,w",
  "DnT,A",
  "DnT,A,k",
  "Dn,w",
  "Dn,A",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "LnT,A"
] as const satisfies readonly RequestedOutputId[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function resolveLayerMaterial(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): MaterialDefinition | null {
  try {
    return resolveMaterial(layer.materialId, catalog);
  } catch {
    return null;
  }
}

function materialBehavior(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): string | undefined {
  return resolveLayerMaterial(layer, catalog)?.acoustic?.behavior;
}

function materialTags(layer: LayerInput, catalog: readonly MaterialDefinition[]): readonly string[] {
  return resolveLayerMaterial(layer, catalog)?.tags ?? [];
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
  return (
    materialBehavior(layer, catalog) === "air_cavity" ||
    materialTags(layer, catalog).some((tag) => tag === "cavity")
  );
}

function isLeafLikeLayer(layer: LayerInput, catalog: readonly MaterialDefinition[]): boolean {
  const material = resolveLayerMaterial(layer, catalog);
  if (!material) {
    return false;
  }

  return (
    material.category === "mass" ||
    material.acoustic?.behavior === "panel_leaf" ||
    material.acoustic?.behavior === "limp_mass_membrane" ||
    material.tags.some((tag) => /board|membrane|barrier|plaster|masonry/u.test(tag))
  );
}

function hasGroupedTripleLeafTopology(context: AirborneContext | undefined): boolean {
  return context?.wallTopology?.topologyMode === "grouped_triple_leaf";
}

function hasExplicitDoubleLeafFramedTopology(context: AirborneContext | undefined): boolean {
  return context?.wallTopology?.topologyMode === "double_leaf_framed";
}

function looksLikeMultiCavityWall(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  const leafLikeCount = layers.filter((layer) => isLeafLikeLayer(layer, catalog)).length;
  const cavityLikeCount = layers.filter(
    (layer) => isCavityLayer(layer, catalog) || isPorousFillLayer(layer, catalog)
  ).length;

  return leafLikeCount >= 4 && cavityLikeCount >= 2;
}

function inferOutputBasis(
  targetOutputs: readonly RequestedOutputId[],
  context: AirborneContext | undefined
): DynamicCalculatorOutputBasis {
  if (context?.contextMode === "building_prediction") {
    return "building_prediction";
  }

  if (
    context?.contextMode === "field_between_rooms" ||
    targetOutputs.some((output) => FIELD_OR_APPARENT_OUTPUTS.has(output))
  ) {
    return "field_apparent";
  }

  return "element_lab";
}

function addPrompt(
  prompts: DynamicCalculatorRouteInputPrompt[],
  prompt: DynamicCalculatorRouteInputPrompt
): void {
  if (!prompts.some((entry) => entry.promptId === prompt.promptId)) {
    prompts.push(prompt);
  }
}

function makePrompt(input: {
  detail: string;
  fieldId: AcousticInputFieldId;
  label: string;
  promptId?: string;
  source: DynamicCalculatorPromptSource;
  targetOutputs: readonly RequestedOutputId[];
}): DynamicCalculatorRouteInputPrompt {
  return {
    detail: input.detail,
    fieldId: input.fieldId,
    label: input.label,
    promptId: input.promptId ?? input.fieldId,
    source: input.source,
    targetOutputs: input.targetOutputs
  };
}

function buildInputCompleteness(input: {
  appliedDefaults?: AcousticInputCompleteness["appliedDefaults"];
  conditionalFields?: readonly AcousticInputFieldId[];
  id: string;
  missingPhysicalInputs?: readonly AcousticInputFieldId[];
  missingSourceEvidence?: readonly string[];
  optionalPrecisionFields?: readonly AcousticInputFieldId[];
  requiredFields?: readonly AcousticInputFieldId[];
  routeFamily: AcousticInputRouteFamily;
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const appliedDefaults = [...(input.appliedDefaults ?? [])];
  const missingPhysicalInputs = unique(input.missingPhysicalInputs ?? []);
  const missingSourceEvidence = [...(input.missingSourceEvidence ?? [])];
  const optionalPrecisionFields = [...(input.optionalPrecisionFields ?? [])];
  const status =
    missingPhysicalInputs.length > 0
      ? "needs_input"
      : appliedDefaults.length > 0
        ? "complete_with_defaults"
        : "complete";

  return AcousticInputCompletenessSchema.parse({
    appliedDefaults,
    conditionalFields: [...(input.conditionalFields ?? [])],
    id: input.id,
    missingPhysicalInputs,
    missingSourceEvidence,
    optionalPrecisionFields,
    requiredFields: [...(input.requiredFields ?? [])],
    routeFamily: input.routeFamily,
    status,
    targetOutputs: [...input.targetOutputs]
  });
}

function addGroupedWallTopologyContract(input: {
  catalog: readonly MaterialDefinition[];
  context: AirborneContext | undefined;
  layers: readonly LayerInput[];
  missingSourceEvidence: readonly string[];
  prompts: DynamicCalculatorRouteInputPrompt[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const topology = input.context?.wallTopology;
  const missing: AcousticInputFieldId[] = [];
  const groupedRequirements: readonly {
    detail: string;
    fieldId: AcousticInputFieldId;
    isMissing: boolean;
    label: string;
  }[] = [
    {
      detail: "Group the layers that form the source-side leaf before a multi-cavity solver can run.",
      fieldId: "sideALeafGroup",
      isMissing: !topology?.sideALeafLayerIndices,
      label: "Side A leaf group"
    },
    {
      detail: "Enter the first cavity depth in millimetres.",
      fieldId: "cavity1DepthMm",
      isMissing: typeof topology?.cavity1DepthMm !== "number",
      label: "Cavity 1 depth"
    },
    {
      detail: "Group the internal leaf separately from both outer leaves.",
      fieldId: "internalLeafGroup",
      isMissing: !topology?.internalLeafLayerIndices,
      label: "Internal leaf group"
    },
    {
      detail: "Tell the solver whether the internal leaf is independent, attached, or bridged.",
      fieldId: "internalLeafCoupling",
      isMissing: !topology?.internalLeafCoupling || topology.internalLeafCoupling === "unknown",
      label: "Internal leaf coupling"
    },
    {
      detail: "Enter the second cavity depth in millimetres.",
      fieldId: "cavity2DepthMm",
      isMissing: typeof topology?.cavity2DepthMm !== "number",
      label: "Cavity 2 depth"
    },
    {
      detail: "Group the receiving-side leaf before the stack can leave screening posture.",
      fieldId: "sideBLeafGroup",
      isMissing: !topology?.sideBLeafLayerIndices,
      label: "Side B leaf group"
    },
    {
      detail: "Select the support topology so frame/bridge coupling is explicit.",
      fieldId: "supportTopology",
      isMissing: !topology?.supportTopology || topology.supportTopology === "unknown",
      label: "Support topology"
    }
  ];

  for (const requirement of groupedRequirements) {
    if (!requirement.isMissing) {
      continue;
    }

    missing.push(requirement.fieldId);
    addPrompt(
      input.prompts,
      makePrompt({
        detail: requirement.detail,
        fieldId: requirement.fieldId,
        label: requirement.label,
        source: "wall_topology",
        targetOutputs: input.targetOutputs
      })
    );
  }

  const hasEngineeringFlowDefault = input.layers.some((layer) => {
    const material = resolveLayerMaterial(layer, input.catalog);
    return (
      material?.acoustic?.behavior === "porous_absorber" &&
      typeof material.acoustic.flowResistivityPaSM2 === "number" &&
      material.acoustic.propertySourceStatus === "engineering_default"
    );
  });

  return buildInputCompleteness({
    appliedDefaults: hasEngineeringFlowDefault
      ? [
          {
            fieldId: "flowResistivityPaSM2",
            reason:
              "Porous-fill flow resistivity is available only as an engineering default until product-specific data is entered.",
            uncertaintyEffect: "widen_error_budget"
          }
        ]
      : [],
    conditionalFields: ["cavity1FillCoverage", "cavity2FillCoverage"],
    id: "gate_k_triple_leaf_multicavity_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    optionalPrecisionFields: ["cavity1FillCoverage", "cavity2FillCoverage", "flowResistivityPaSM2"],
    requiredFields: [
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ],
    routeFamily: "triple_leaf_multicavity_airborne",
    targetOutputs: input.targetOutputs
  });
}

function addFieldContextContract(input: {
  context: AirborneContext | undefined;
  missingSourceEvidence: readonly string[];
  outputBasis: DynamicCalculatorOutputBasis;
  prompts: DynamicCalculatorRouteInputPrompt[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const missing: AcousticInputFieldId[] = [];
  const context = input.context;
  const requiresStandardizedField = input.targetOutputs.some((output) =>
    ["DnT,w", "DnT,A", "DnT,A,k", "L'nT,w", "L'nT,50", "LnT,A"].includes(output)
  );

  if (!context?.contextMode || context.contextMode === "element_lab") {
    missing.push("contextMode");
    addPrompt(
      input.prompts,
      makePrompt({
        detail: "Choose field/apparent or building-prediction context before field outputs are shown.",
        fieldId: "contextMode",
        label: "Output basis",
        source: "output_basis",
        targetOutputs: input.targetOutputs
      })
    );
  }

  if (!(typeof context?.panelWidthMm === "number" && typeof context?.panelHeightMm === "number")) {
    missing.push("partitionAreaM2");
    addPrompt(
      input.prompts,
      makePrompt({
        detail: "Enter partition area, or width and height, for apparent/standardized field outputs.",
        fieldId: "partitionAreaM2",
        label: "Partition area",
        source: "field_context",
        targetOutputs: input.targetOutputs
      })
    );
  }

  if (typeof context?.receivingRoomVolumeM3 !== "number") {
    missing.push("receivingRoomVolumeM3");
    addPrompt(
      input.prompts,
      makePrompt({
        detail: "Enter receiving-room volume before standardized field results can be calculated.",
        fieldId: "receivingRoomVolumeM3",
        label: "Receiving-room volume",
        source: "field_context",
        targetOutputs: input.targetOutputs
      })
    );
  }

  if (requiresStandardizedField && typeof context?.receivingRoomRt60S !== "number") {
    missing.push("receivingRoomRt60S");
    addPrompt(
      input.prompts,
      makePrompt({
        detail: "Enter receiving-room reverberation time for DnT/LnT style outputs.",
        fieldId: "receivingRoomRt60S",
        label: "Receiving-room RT60",
        source: "field_context",
        targetOutputs: input.targetOutputs
      })
    );
  }

  if (
    input.outputBasis === "building_prediction" &&
    (!context?.junctionQuality || context.junctionQuality === "unknown")
  ) {
    missing.push("flankingJunctionClass");
    addPrompt(
      input.prompts,
      makePrompt({
        detail: "Enter junction/flanking quality or choose an explicit conservative flanking assumption.",
        fieldId: "flankingJunctionClass",
        label: "Flanking junction class",
        source: "field_context",
        targetOutputs: input.targetOutputs
      })
    );
  }

  return buildInputCompleteness({
    conditionalFields: [
      "receivingRoomRt60S",
      "sourceRoomVolumeM3",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "impactFieldContext"
    ],
    id: "gate_k_field_building_context_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    requiredFields: ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3"],
    routeFamily: "field_apparent_output_context",
    targetOutputs: input.targetOutputs
  });
}

function hasFloorRole(layers: readonly LayerInput[], role: LayerInput["floorRole"]): boolean {
  return layers.some((layer) => layer.floorRole === role);
}

function resilientLayerHasDynamicStiffness(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[],
  floorImpactContext: DynamicCalculatorFloorImpactContext | undefined
): boolean {
  if (typeof floorImpactContext?.resilientLayerDynamicStiffnessMNm3 === "number") {
    return floorImpactContext.resilientLayerDynamicStiffnessMNm3 > 0;
  }

  return layers
    .filter((layer) => layer.floorRole === "resilient_layer")
    .some((layer) => {
      const material = resolveLayerMaterial(layer, catalog);
      return typeof material?.impact?.dynamicStiffnessMNm3 === "number";
    });
}

function hasPositiveLoadBasis(floorImpactContext: DynamicCalculatorFloorImpactContext | undefined): boolean {
  return typeof floorImpactContext?.loadBasisKgM2 === "number" && floorImpactContext.loadBasisKgM2 > 0;
}

function addFloatingFloorContract(input: {
  catalog: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext;
  layers: readonly LayerInput[];
  missingSourceEvidence: readonly string[];
  prompts: DynamicCalculatorRouteInputPrompt[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const missing: AcousticInputFieldId[] = [];
  const checks: readonly {
    detail: string;
    fieldId: AcousticInputFieldId;
    isMissing: boolean;
    label: string;
    source: DynamicCalculatorPromptSource;
  }[] = [
    {
      detail: "Assign the base slab or structural floor role.",
      fieldId: "baseSlabOrFloor",
      isMissing: !hasFloorRole(input.layers, "base_structure"),
      label: "Base slab/floor role",
      source: "floor_role"
    },
    {
      detail: "Assign the topping/floating layer role before floating-floor impact outputs are promoted.",
      fieldId: "toppingOrFloatingLayer",
      isMissing: !hasFloorRole(input.layers, "floating_screed"),
      label: "Topping/floating layer role",
      source: "floor_role"
    },
    {
      detail: "Enter or select resilient-layer dynamic stiffness in MN/m3.",
      fieldId: "resilientLayerDynamicStiffnessMNm3",
      isMissing: !resilientLayerHasDynamicStiffness(
        input.layers,
        input.catalog,
        input.floorImpactContext
      ),
      label: "Resilient-layer dynamic stiffness",
      source: "material_property"
    },
    {
      detail: "Enter the load basis for the floating layer before high-accuracy impact prediction.",
      fieldId: "loadBasisKgM2",
      isMissing: !hasPositiveLoadBasis(input.floorImpactContext),
      label: "Floating-floor load basis",
      source: "floor_role"
    }
  ];

  for (const check of checks) {
    if (!check.isMissing) {
      continue;
    }

    missing.push(check.fieldId);
    addPrompt(
      input.prompts,
      makePrompt({
        detail: check.detail,
        fieldId: check.fieldId,
        label: check.label,
        source: check.source,
        targetOutputs: input.targetOutputs
      })
    );
  }

  return buildInputCompleteness({
    conditionalFields: ["ceilingOrLowerAssembly"],
    id: "gate_k_floating_floor_impact_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    requiredFields: [
      "baseSlabOrFloor",
      "toppingOrFloatingLayer",
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2"
    ],
    routeFamily: "floating_floor_impact",
    targetOutputs: input.targetOutputs
  });
}

function buildUnsupportedCompleteness(
  unsupportedOutputs: readonly RequestedOutputId[]
): AcousticInputCompleteness | null {
  if (unsupportedOutputs.length === 0) {
    return null;
  }

  return AcousticInputCompletenessSchema.parse({
    id: "gate_k_unsupported_runtime_rating_adapter",
    routeFamily: "floating_floor_impact",
    status: "unsupported",
    targetOutputs: [...unsupportedOutputs]
  });
}

export function buildDynamicCalculatorRouteInputTopologyAssessment(
  input: DynamicCalculatorRouteInputTopologyInput
): DynamicCalculatorRouteInputTopologyAssessment {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const outputBasis = inferOutputBasis(input.targetOutputs, input.airborneContext);
  const prompts: DynamicCalculatorRouteInputPrompt[] = [];
  const unsupportedOutputs = input.targetOutputs.filter((output) =>
    UNSUPPORTED_RUNTIME_OUTPUTS.has(output)
  );
  const supportedRequestedOutputs = input.targetOutputs.filter(
    (output) => !UNSUPPORTED_RUNTIME_OUTPUTS.has(output)
  );
  const missingSourceEvidence =
    input.sourceEvidenceAvailable === true ? [] : ["exact_full_stack_source_absent"];
  const inputCompletenessSet: AcousticInputCompleteness[] = [];

  if (input.route === "wall") {
    const needsGroupedTopology =
      hasGroupedTripleLeafTopology(input.airborneContext) ||
      looksLikeMultiCavityWall(input.layers, catalog);
    const needsDoubleLeafFramedTopology =
      !needsGroupedTopology && hasExplicitDoubleLeafFramedTopology(input.airborneContext);

    if (needsGroupedTopology) {
      inputCompletenessSet.push(
        addGroupedWallTopologyContract({
          catalog,
          context: input.airborneContext,
          layers: input.layers,
          missingSourceEvidence,
          prompts,
          targetOutputs: supportedRequestedOutputs.length > 0 ? supportedRequestedOutputs : WALL_AIRBORNE_OUTPUTS
        })
      );
    }

    if (needsDoubleLeafFramedTopology) {
      const doubleLeafContract = buildGateQDoubleLeafFramedBridgeInputContract({
        airborneContext: input.airborneContext,
        catalog,
        layers: input.layers,
        sourceEvidenceAvailable: input.sourceEvidenceAvailable,
        targetOutputs: supportedRequestedOutputs.length > 0 ? supportedRequestedOutputs : WALL_AIRBORNE_OUTPUTS
      });

      inputCompletenessSet.push(doubleLeafContract.inputCompleteness);
      for (const prompt of doubleLeafContract.prompts) {
        addPrompt(prompts, prompt);
      }
    }

    if (
      outputBasis !== "element_lab" ||
      input.targetOutputs.some((output) => FIELD_OR_APPARENT_OUTPUTS.has(output))
    ) {
      inputCompletenessSet.push(
        addFieldContextContract({
          context: input.airborneContext,
          missingSourceEvidence,
          outputBasis,
          prompts,
          targetOutputs: input.targetOutputs.filter((output) =>
            FIELD_CONTEXT_OUTPUTS.includes(output as (typeof FIELD_CONTEXT_OUTPUTS)[number])
          )
        })
      );
    }
  }

  if (input.route === "floor") {
    const hasResilientFloatingFloor = hasFloorRole(input.layers, "resilient_layer");
    const requiresFloatingFloor =
      input.targetOutputs.some((output) => FLOATING_OR_FIELD_IMPACT_OUTPUTS.has(output)) ||
      (hasResilientFloatingFloor &&
        input.targetOutputs.some((output) => output === "DeltaLw" || output === "Ln,w"));

    if (requiresFloatingFloor) {
      inputCompletenessSet.push(
        addFloatingFloorContract({
          catalog,
          floorImpactContext: input.floorImpactContext,
          layers: input.layers,
          missingSourceEvidence,
          prompts,
          targetOutputs: input.targetOutputs.filter((output) =>
            ["DeltaLw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50", "LnT,A"].includes(output)
          )
        })
      );
    }

    if (
      outputBasis !== "element_lab" ||
      input.targetOutputs.some((output) => FIELD_OR_APPARENT_OUTPUTS.has(output))
    ) {
      inputCompletenessSet.push(
        addFieldContextContract({
          context: input.airborneContext,
          missingSourceEvidence,
          outputBasis,
          prompts,
          targetOutputs: input.targetOutputs.filter((output) =>
            FIELD_CONTEXT_OUTPUTS.includes(output as (typeof FIELD_CONTEXT_OUTPUTS)[number])
          )
        })
      );
    }
  }

  const unsupportedCompleteness = buildUnsupportedCompleteness(unsupportedOutputs);
  if (unsupportedCompleteness) {
    inputCompletenessSet.push(unsupportedCompleteness);
  }

  const missingPhysicalInputs = unique(prompts.map((prompt) => prompt.fieldId));
  const routeFamilies = unique(inputCompletenessSet.map((entry) => entry.routeFamily));
  const status =
    unsupportedOutputs.length === input.targetOutputs.length
      ? "unsupported"
      : missingPhysicalInputs.length > 0
        ? "needs_input"
        : inputCompletenessSet.some((entry) => entry.status === "complete_with_defaults")
          ? "complete_with_defaults"
          : "complete";

  return {
    inputCompletenessSet,
    missingPhysicalInputs,
    missingSourceEvidence,
    notes: [
      "Source absence blocks exact or calibrated-source promotion only; it does not become a physical-input prompt.",
      "This Gate K contract is no-runtime and does not move calculator values."
    ],
    outputBasis,
    prompts,
    route: input.route,
    routeFamilies,
    runtimeValueMovement: false,
    sourceAbsenceBlocksOnlyExactOrCalibration: true,
    sourceCatalogQueueOnly: false,
    status,
    targetOutputs: input.targetOutputs,
    unsupportedOutputs
  };
}

export function buildGateKRouteInputTopologyScenarioPack(): readonly DynamicCalculatorRouteInputTopologyAssessment[] {
  const wallLabContext: AirborneContext = {
    airtightness: "good",
    contextMode: "element_lab"
  };
  const groupedWallContext: AirborneContext = {
    ...wallLabContext,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 50,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [3],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: 50,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [5],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [4],
      sideALeafLayerIndices: [0, 1, 2],
      sideBLeafLayerIndices: [6, 7, 8],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
  const groupedWallLayers: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 4 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 50 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "gypsum_plaster", thicknessMm: 10 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const aconLikeWallLayers: readonly LayerInput[] = [
    { materialId: "gypsum_plaster", thicknessMm: 3 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 2 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "air_gap", thicknessMm: 20 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 30 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 2 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "gypsum_plaster", thicknessMm: 3 }
  ];
  const floatingFloorLayers: readonly LayerInput[] = [
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
  ];

  return [
    buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: groupedWallContext,
      layers: groupedWallLayers,
      route: "wall",
      targetOutputs: WALL_AIRBORNE_OUTPUTS
    }),
    buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: wallLabContext,
      layers: aconLikeWallLayers,
      route: "wall",
      targetOutputs: WALL_AIRBORNE_OUTPUTS
    }),
    buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: { contextMode: "field_between_rooms" },
      layers: groupedWallLayers,
      route: "wall",
      targetOutputs: ["R'w", "DnT,w"]
    }),
    buildDynamicCalculatorRouteInputTopologyAssessment({
      layers: floatingFloorLayers,
      route: "floor",
      targetOutputs: ["DeltaLw", "L'n,w", "L'nT,w"]
    }),
    buildDynamicCalculatorRouteInputTopologyAssessment({
      layers: floatingFloorLayers,
      route: "floor",
      targetOutputs: ["IIC", "AIIC"]
    })
  ];
}
