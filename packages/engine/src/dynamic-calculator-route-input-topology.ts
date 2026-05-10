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
import { validateWallTripleLeafLayerGroups } from "./wall-triple-leaf-topology-readiness";

export type DynamicCalculatorRoute = "wall" | "floor";
export type DynamicCalculatorOutputBasis = "element_lab" | "field_apparent" | "building_prediction";
export type DynamicCalculatorRouteInputStatus =
  | "complete"
  | "complete_with_defaults"
  | "needs_input"
  | "unsupported";

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS = [
  "contextMode",
  "partitionAreaM2",
  "sourceRoomVolumeM3",
  "receivingRoomVolumeM3",
  "receivingRoomRt60S",
  "flankingJunctionClass",
  "conservativeFlankingAssumption",
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const satisfies readonly AcousticInputFieldId[];

export const GATE_M_AIRBORNE_BUILDING_PREDICTION_OWNER_INPUTS = [
  "ISO_12354_1_flanking_transmission_adapter_owner",
  "junctionCouplingLengthOwner",
  "apparentBuildingMetricBasisOwner",
  "standardizedBuildingMetricBasisOwner"
] as const;

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

function hasExplicitLinedMassiveWallTopology(context: AirborneContext | undefined): boolean {
  return context?.wallTopology?.topologyMode === "lined_massive_wall";
}

function hasExplicitMassTimberPanelTopology(context: AirborneContext | undefined): boolean {
  return context?.wallTopology?.topologyMode === "mass_timber_panel";
}

function hasKnownTopologyValue(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function isValidLayerGroup(indices: readonly number[] | undefined, layerCount: number): boolean {
  return Array.isArray(indices) &&
    indices.length > 0 &&
    indices.every((index) => Number.isInteger(index) && index >= 0 && index < layerCount);
}

function hasDisjointLayerGroups(groups: readonly (readonly number[] | undefined)[]): boolean {
  const seen = new Set<number>();

  for (const group of groups) {
    if (!Array.isArray(group)) {
      continue;
    }

    for (const index of group) {
      if (seen.has(index)) {
        return false;
      }

      seen.add(index);
    }
  }

  return true;
}

function hasMassTimberLayer(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  return layers.some((layer) => {
    const material = resolveLayerMaterial(layer, catalog);
    if (!material) {
      return false;
    }

    const tags = material.tags.map((tag) => tag.toLowerCase());
    return (
      material.acoustic?.behavior === "mass_timber" ||
      tags.includes("mass-timber") ||
      tags.includes("clt")
    );
  });
}

function massTimberLayersHaveDensity(
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  return layers
    .filter((layer) => {
      const material = resolveLayerMaterial(layer, catalog);
      return material?.acoustic?.behavior === "mass_timber" || material?.tags.includes("mass-timber");
    })
    .every((layer) => {
      const material = resolveLayerMaterial(layer, catalog);
      return typeof material?.densityKgM3 === "number" && material.densityKgM3 > 0;
    });
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
  const groupedMode = topology?.topologyMode === "grouped_triple_leaf";
  const layerGroupValidation = groupedMode
    ? validateWallTripleLeafLayerGroups({
        layerCount: input.layers.length,
        topology
      })
    : null;
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
      detail: "Grouped leaf and cavity layer ownership must be non-overlapping and inside the current layer list.",
      fieldId: "leafGrouping",
      isMissing: Boolean(layerGroupValidation && !layerGroupValidation.valid),
      label: "Valid grouped layer ownership"
    },
    {
      detail: "Enter the first cavity depth in millimetres.",
      fieldId: "cavity1DepthMm",
      isMissing: typeof topology?.cavity1DepthMm !== "number",
      label: "Cavity 1 depth"
    },
    {
      detail: "Select whether the first cavity is empty, partially filled, or fully filled.",
      fieldId: "cavity1FillCoverage",
      isMissing: groupedMode && (!topology?.cavity1FillCoverage || topology.cavity1FillCoverage === "unknown"),
      label: "Cavity 1 fill coverage"
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
      detail: "Select whether the second cavity is empty, partially filled, or fully filled.",
      fieldId: "cavity2FillCoverage",
      isMissing: groupedMode && (!topology?.cavity2FillCoverage || topology.cavity2FillCoverage === "unknown"),
      label: "Cavity 2 fill coverage"
    },
    {
      detail: "Classify the cavity absorption before the multi-cavity solver can treat the fill as physical.",
      fieldId: "absorberClass",
      isMissing:
        groupedMode &&
        (!topology?.cavity1AbsorptionClass ||
          topology.cavity1AbsorptionClass === "unknown" ||
          !topology.cavity2AbsorptionClass ||
          topology.cavity2AbsorptionClass === "unknown"),
      label: "Cavity absorption class"
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
    conditionalFields: ["cavity1FillCoverage", "cavity2FillCoverage", "absorberClass"],
    id: "gate_k_triple_leaf_multicavity_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    optionalPrecisionFields: ["flowResistivityPaSM2"],
    requiredFields: [
      "leafGrouping",
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
  const requiresBuildingPredictionOwner = input.outputBasis === "building_prediction";

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

  if (requiresBuildingPredictionOwner) {
    if (typeof context?.sourceRoomVolumeM3 !== "number") {
      missing.push("sourceRoomVolumeM3");
      addPrompt(
        input.prompts,
        makePrompt({
          detail:
            "Enter source-room volume or an equivalent owned source-room geometry basis before building prediction can leave the field boundary.",
          fieldId: "sourceRoomVolumeM3",
          label: "Source-room volume",
          source: "field_context",
          targetOutputs: input.targetOutputs
        })
      );
    }

    if (!context?.flankingJunctionClass || context.flankingJunctionClass === "unknown") {
      missing.push("flankingJunctionClass");
      addPrompt(
        input.prompts,
        makePrompt({
          detail:
            "Building prediction needs a named flanking/junction owner before it can leave the room-to-room field boundary.",
          fieldId: "flankingJunctionClass",
          label: "Flanking junction class",
          source: "field_context",
          targetOutputs: input.targetOutputs
        })
      );
    }

    if (!context?.conservativeFlankingAssumption || context.conservativeFlankingAssumption === "unknown") {
      missing.push("conservativeFlankingAssumption");
      addPrompt(
        input.prompts,
        makePrompt({
          detail:
            "Choose an explicit conservative flanking assumption before any building-prediction output is promoted.",
          fieldId: "conservativeFlankingAssumption",
          label: "Conservative flanking assumption",
          source: "field_context",
          targetOutputs: input.targetOutputs
        })
      );
    }

    if (typeof context?.junctionCouplingLengthM !== "number") {
      missing.push("junctionCouplingLengthM");
      addPrompt(
        input.prompts,
        makePrompt({
          detail:
            "Enter the owned junction coupling length or equivalent path-length basis before any ISO 12354-1 building adapter can be selected.",
          fieldId: "junctionCouplingLengthM",
          label: "Junction coupling length",
          source: "field_context",
          targetOutputs: input.targetOutputs
        })
      );
    }

    if (!context?.buildingPredictionOutputBasis || context.buildingPredictionOutputBasis === "unknown") {
      missing.push("buildingPredictionOutputBasis");
      addPrompt(
        input.prompts,
        makePrompt({
          detail:
            "Choose whether the building prediction owns apparent, standardized, or apparent-and-standardized output basis before cards/API/report can show it as ready.",
          fieldId: "buildingPredictionOutputBasis",
          label: "Building output basis",
          source: "output_basis",
          targetOutputs: input.targetOutputs
        })
      );
    }
  }

  const requiredFields: AcousticInputFieldId[] = requiresBuildingPredictionOwner
    ? [...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS]
    : requiresStandardizedField
    ? ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"]
    : ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3"];

  return buildInputCompleteness({
    conditionalFields: [
      "impactFieldContext"
    ],
    id: requiresBuildingPredictionOwner
      ? "gate_m_building_prediction_airborne_context_route_inputs"
      : "gate_k_field_building_context_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    requiredFields,
    routeFamily: requiresBuildingPredictionOwner
      ? "building_prediction_airborne_context"
      : "field_apparent_output_context",
    targetOutputs: input.targetOutputs
  });
}

function addLinedMassiveWallContract(input: {
  catalog: readonly MaterialDefinition[];
  context: AirborneContext | undefined;
  layers: readonly LayerInput[];
  missingSourceEvidence: readonly string[];
  prompts: DynamicCalculatorRouteInputPrompt[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const topology = input.context?.wallTopology;
  const layerCount = input.layers.length;
  const missing: AcousticInputFieldId[] = [];
  const groupsAreValid =
    isValidLayerGroup(topology?.sideALeafLayerIndices, layerCount) &&
    isValidLayerGroup(topology?.cavity1LayerIndices, layerCount) &&
    isValidLayerGroup(topology?.sideBLeafLayerIndices, layerCount) &&
    hasDisjointLayerGroups([
      topology?.sideALeafLayerIndices,
      topology?.cavity1LayerIndices,
      topology?.sideBLeafLayerIndices
    ]);
  const requirements: readonly {
    detail: string;
    fieldId: AcousticInputFieldId;
    isMissing: boolean;
    label: string;
  }[] = [
    {
      detail: "Group the light lining leaf before the lined massive-wall formula corridor can promote.",
      fieldId: "sideALeafGroup",
      isMissing: !topology?.sideALeafLayerIndices,
      label: "Lining leaf group"
    },
    {
      detail: "Group the cavity or porous-fill layers between the lining and heavy base.",
      fieldId: "cavityDepthMm",
      isMissing: !topology?.cavity1LayerIndices,
      label: "Lined-wall cavity group"
    },
    {
      detail: "Lining, cavity, and heavy-base groups must be non-overlapping and inside the current layer list.",
      fieldId: "leafGrouping",
      isMissing: !groupsAreValid,
      label: "Valid lined-wall group ownership"
    },
    {
      detail: "Enter the lined-wall cavity depth in millimetres.",
      fieldId: "cavity1DepthMm",
      isMissing: typeof topology?.cavity1DepthMm !== "number",
      label: "Lined-wall cavity depth"
    },
    {
      detail: "Select whether the lined-wall cavity is empty, partially filled, or fully filled.",
      fieldId: "cavity1FillCoverage",
      isMissing: !topology?.cavity1FillCoverage || topology.cavity1FillCoverage === "unknown",
      label: "Lined-wall fill coverage"
    },
    {
      detail: "Classify the lined-wall cavity absorption before family physics can leave screening.",
      fieldId: "absorberClass",
      isMissing: !topology?.cavity1AbsorptionClass || topology.cavity1AbsorptionClass === "unknown",
      label: "Lined-wall absorber class"
    },
    {
      detail: "Group the heavy masonry or concrete base leaf.",
      fieldId: "sideBLeafGroup",
      isMissing: !topology?.sideBLeafLayerIndices,
      label: "Heavy base leaf group"
    },
    {
      detail: "Select whether the lining is direct-fixed, resilient, or otherwise supported.",
      fieldId: "supportTopology",
      isMissing: !hasKnownTopologyValue(topology?.supportTopology),
      label: "Lined-wall support topology"
    }
  ];

  for (const requirement of requirements) {
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
              "Porous lined-wall fill uses the catalog engineering flow-resistivity default until product-specific data is entered.",
            uncertaintyEffect: "widen_error_budget"
          }
        ]
      : [],
    conditionalFields: ["cavity1FillCoverage", "absorberClass"],
    id: "gate_h_lined_massive_wall_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    optionalPrecisionFields: ["flowResistivityPaSM2"],
    requiredFields: [
      "leafGrouping",
      "sideALeafGroup",
      "cavity1DepthMm",
      "cavity1FillCoverage",
      "absorberClass",
      "sideBLeafGroup",
      "supportTopology"
    ],
    routeFamily: "lined_massive_airborne",
    targetOutputs: input.targetOutputs
  });
}

function addMassTimberPanelWallContract(input: {
  catalog: readonly MaterialDefinition[];
  layers: readonly LayerInput[];
  missingSourceEvidence: readonly string[];
  prompts: DynamicCalculatorRouteInputPrompt[];
  targetOutputs: readonly RequestedOutputId[];
}): AcousticInputCompleteness {
  const missing: AcousticInputFieldId[] = [];
  const hasMassTimber = hasMassTimberLayer(input.layers, input.catalog);
  const hasDensity = hasMassTimber && massTimberLayersHaveDensity(input.layers, input.catalog);
  const requirements: readonly {
    detail: string;
    fieldId: AcousticInputFieldId;
    isMissing: boolean;
    label: string;
  }[] = [
    {
      detail: "Select a CLT or mass-timber panel material before the mass-timber wall route can promote.",
      fieldId: "materialClass",
      isMissing: !hasMassTimber,
      label: "Mass-timber material class"
    },
    {
      detail: "The mass-timber wall route needs a positive panel thickness.",
      fieldId: "thicknessMm",
      isMissing: !input.layers.some((layer) => layer.thicknessMm > 0),
      label: "Mass-timber panel thickness"
    },
    {
      detail: "Mass-timber density must be known before surface mass and the panel delegate curve are trusted.",
      fieldId: "densityKgM3",
      isMissing: !hasDensity,
      label: "Mass-timber panel density"
    }
  ];

  for (const requirement of requirements) {
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
        source: "material_property",
        targetOutputs: input.targetOutputs
      })
    );
  }

  const usesEngineeringAcousticProperties = input.layers.some((layer) => {
    const material = resolveLayerMaterial(layer, input.catalog);
    return (
      material?.acoustic?.behavior === "mass_timber" &&
      material.acoustic.propertySourceStatus === "engineering_default"
    );
  });

  return buildInputCompleteness({
    appliedDefaults: usesEngineeringAcousticProperties
      ? [
          {
            fieldId: "youngModulusPa",
            reason:
              "CLT orthotropic stiffness is still represented by the catalog engineering default in Gate H.",
            uncertaintyEffect: "widen_error_budget"
          },
          {
            fieldId: "lossFactor",
            reason:
              "CLT loss factor is still represented by the catalog engineering default in Gate H.",
            uncertaintyEffect: "widen_error_budget"
          }
        ]
      : [],
    conditionalFields: ["youngModulusPa", "lossFactor"],
    id: "gate_h_mass_timber_wall_route_inputs",
    missingPhysicalInputs: missing,
    missingSourceEvidence: input.missingSourceEvidence,
    optionalPrecisionFields: ["youngModulusPa", "lossFactor"],
    requiredFields: ["materialClass", "densityKgM3", "thicknessMm", "surfaceMassKgM2"],
    routeFamily: "mass_timber_airborne",
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
    const needsLinedMassiveWallTopology =
      !needsGroupedTopology &&
      !needsDoubleLeafFramedTopology &&
      hasExplicitLinedMassiveWallTopology(input.airborneContext);
    const needsMassTimberPanelTopology =
      !needsGroupedTopology &&
      !needsDoubleLeafFramedTopology &&
      !needsLinedMassiveWallTopology &&
      hasExplicitMassTimberPanelTopology(input.airborneContext);

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

    if (needsLinedMassiveWallTopology) {
      inputCompletenessSet.push(
        addLinedMassiveWallContract({
          catalog,
          context: input.airborneContext,
          layers: input.layers,
          missingSourceEvidence,
          prompts,
          targetOutputs: supportedRequestedOutputs.length > 0 ? supportedRequestedOutputs : WALL_AIRBORNE_OUTPUTS
        })
      );
    }

    if (needsMassTimberPanelTopology) {
      inputCompletenessSet.push(
        addMassTimberPanelWallContract({
          catalog,
          layers: input.layers,
          missingSourceEvidence,
          prompts,
          targetOutputs: supportedRequestedOutputs.length > 0 ? supportedRequestedOutputs : WALL_AIRBORNE_OUTPUTS
        })
      );
    }

    if (
      outputBasis !== "element_lab" ||
      input.targetOutputs.some((output) => FIELD_OR_APPARENT_OUTPUTS.has(output))
    ) {
      const fieldContextTargetOutputs =
        outputBasis === "building_prediction"
          ? input.targetOutputs
          : input.targetOutputs.filter((output) =>
              FIELD_CONTEXT_OUTPUTS.includes(output as (typeof FIELD_CONTEXT_OUTPUTS)[number])
            );

      inputCompletenessSet.push(
        addFieldContextContract({
          context: input.airborneContext,
          missingSourceEvidence,
          outputBasis,
          prompts,
          targetOutputs: fieldContextTargetOutputs
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
      const fieldContextTargetOutputs =
        outputBasis === "building_prediction"
          ? input.targetOutputs
          : input.targetOutputs.filter((output) =>
              FIELD_CONTEXT_OUTPUTS.includes(output as (typeof FIELD_CONTEXT_OUTPUTS)[number])
            );

      inputCompletenessSet.push(
        addFieldContextContract({
          context: input.airborneContext,
          missingSourceEvidence,
          outputBasis,
          prompts,
          targetOutputs: fieldContextTargetOutputs
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
      outputBasis === "building_prediction"
        ? "Gate M defines building-prediction input ownership, but runtime building values stay parked until a later ISO 12354-1 adapter gate."
        : "This Gate K contract is no-runtime and does not move calculator values."
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
