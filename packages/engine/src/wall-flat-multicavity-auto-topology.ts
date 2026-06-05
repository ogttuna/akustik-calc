import type {
  AirborneContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId,
  WallTopology
} from "@dynecho/shared";

import { resolveMaterial } from "./material-catalog";

const WALL_LAB_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);
const WALL_FIELD_OUTPUTS = new Set<RequestedOutputId>([
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
]);

type ClassifiedLayer = {
  readonly index: number;
  readonly kind: "cavity" | "leaf";
  readonly layer: LayerInput;
};

type Segment = {
  readonly indices: number[];
  readonly kind: "cavity" | "leaf";
};

function hasWallLabRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => WALL_LAB_OUTPUTS.has(output));
}

function hasWallFieldRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => WALL_FIELD_OUTPUTS.has(output));
}

function materialForLayer(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): MaterialDefinition | null {
  try {
    return resolveMaterial(layer.materialId, catalog);
  } catch {
    return null;
  }
}

function isAirCavityLayer(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): boolean {
  const material = materialForLayer(layer, catalog);
  return Boolean(
    material?.acoustic?.behavior === "air_cavity" ||
      material?.tags.some((tag) => tag === "cavity")
  );
}

function isPorousCavityFillLayer(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): boolean {
  const material = materialForLayer(layer, catalog);
  return Boolean(
    material?.acoustic?.behavior === "porous_absorber" ||
      material?.category === "insulation" ||
      material?.tags.some((tag) => /cavity-fill|porous/u.test(tag))
  );
}

function isLeafLayer(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): boolean {
  const material = materialForLayer(layer, catalog);
  if (!material) {
    return false;
  }

  return Boolean(
    material.category === "mass" ||
      material.acoustic?.behavior === "panel_leaf" ||
      material.acoustic?.behavior === "limp_mass_membrane" ||
      material.tags.some((tag) => /board|membrane|barrier|plaster|masonry/u.test(tag))
  );
}

function classifyLayer(
  layer: LayerInput,
  index: number,
  catalog: readonly MaterialDefinition[]
): ClassifiedLayer | null {
  if (isAirCavityLayer(layer, catalog) || isPorousCavityFillLayer(layer, catalog)) {
    return { index, kind: "cavity", layer };
  }

  if (isLeafLayer(layer, catalog)) {
    return { index, kind: "leaf", layer };
  }

  return null;
}

function segmentClassifiedLayers(classified: readonly ClassifiedLayer[]): Segment[] {
  const segments: Segment[] = [];

  for (const entry of classified) {
    const previous = segments.at(-1);
    if (previous?.kind === entry.kind) {
      previous.indices.push(entry.index);
      continue;
    }

    segments.push({
      indices: [entry.index],
      kind: entry.kind
    });
  }

  return segments;
}

function segmentThicknessMm(segment: Segment, layers: readonly LayerInput[]): number {
  return segment.indices.reduce((sum, index) => sum + (layers[index]?.thicknessMm ?? 0), 0);
}

function segmentHasAir(segment: Segment, layers: readonly LayerInput[], catalog: readonly MaterialDefinition[]): boolean {
  return segment.indices.some((index) => {
    const layer = layers[index];
    return Boolean(layer && isAirCavityLayer(layer, catalog));
  });
}

function segmentHasPorousFill(
  segment: Segment,
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): boolean {
  return segment.indices.some((index) => {
    const layer = layers[index];
    return Boolean(layer && isPorousCavityFillLayer(layer, catalog));
  });
}

function contextAllowsAutoTopology(
  context: AirborneContext | null,
  allowedTopologyModes: readonly NonNullable<WallTopology["topologyMode"]>[]
): boolean {
  const topology = context?.wallTopology;
  if (!topology) {
    return true;
  }

  const topologyMode = topology.topologyMode;
  if (
    topologyMode &&
    topologyMode !== "auto" &&
    !allowedTopologyModes.includes(topologyMode)
  ) {
    return false;
  }

  const explicitTopologyFields = [
    topology.cavity1LayerIndices,
    topology.cavity2LayerIndices,
    topology.internalLeafLayerIndices,
    topology.sideALeafLayerIndices,
    topology.sideBLeafLayerIndices,
    topology.cavity1DepthMm,
    topology.cavity2DepthMm,
    topology.internalLeafCoupling
  ];

  return explicitTopologyFields.every((field) => field === undefined);
}

function inferExplicitWallSupportTopology(
  context: AirborneContext | null
): NonNullable<WallTopology["supportTopology"]> | null {
  const explicit = context?.wallTopology?.supportTopology;
  if (!explicit || explicit === "unknown" || explicit === "direct_fixed") {
    return null;
  }

  return explicit;
}

function segmentFillCoverage(
  segment: Segment,
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): NonNullable<WallTopology["cavity1FillCoverage"]> {
  const hasAir = segmentHasAir(segment, layers, catalog);
  const hasPorous = segmentHasPorousFill(segment, layers, catalog);

  if (hasAir && hasPorous) {
    return "partial";
  }

  if (hasPorous) {
    return "full";
  }

  if (hasAir) {
    return "empty";
  }

  return "unknown";
}

function segmentAbsorptionClass(
  segment: Segment,
  layers: readonly LayerInput[],
  catalog: readonly MaterialDefinition[]
): NonNullable<WallTopology["cavity1AbsorptionClass"]> {
  return segmentHasPorousFill(segment, layers, catalog) ? "porous_absorptive" : "none";
}

export function inferSafeFlatWallMulticavityAutoTopology(input: {
  readonly catalog: readonly MaterialDefinition[];
  readonly context: AirborneContext | null;
  readonly layers: readonly LayerInput[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): WallTopology | null {
  const contextMode = input.context?.contextMode ?? "element_lab";
  const isElementLabRequest = contextMode === "element_lab" && hasWallLabRequest(input.targetOutputs);
  const isFieldContextRequest =
    contextMode === "field_between_rooms" &&
    (hasWallFieldRequest(input.targetOutputs) || hasWallLabRequest(input.targetOutputs));
  const isBuildingPredictionRequest =
    contextMode === "building_prediction" && hasWallFieldRequest(input.targetOutputs);
  if (
    (!isElementLabRequest && !isFieldContextRequest && !isBuildingPredictionRequest) ||
    !contextAllowsAutoTopology(input.context, ["grouped_triple_leaf", "flat_layer_order"])
  ) {
    return null;
  }

  const classified = input.layers.map((layer, index) => classifyLayer(layer, index, input.catalog));
  if (classified.some((entry) => entry === null)) {
    return null;
  }

  const segments = segmentClassifiedLayers(classified as ClassifiedLayer[]);
  if (
    segments.length !== 5 ||
    segments[0]?.kind !== "leaf" ||
    segments[1]?.kind !== "cavity" ||
    segments[2]?.kind !== "leaf" ||
    segments[3]?.kind !== "cavity" ||
    segments[4]?.kind !== "leaf"
  ) {
    return null;
  }

  const [sideA, cavity1, internalLeaf, cavity2, sideB] = segments as [
    Segment,
    Segment,
    Segment,
    Segment,
    Segment
  ];
  const cavity1DepthMm = segmentThicknessMm(cavity1, input.layers);
  const cavity2DepthMm = segmentThicknessMm(cavity2, input.layers);
  const cavity1HasAir = segmentHasAir(cavity1, input.layers, input.catalog);
  const cavity2HasAir = segmentHasAir(cavity2, input.layers, input.catalog);
  const cavity1HasPorousFill = segmentHasPorousFill(cavity1, input.layers, input.catalog);
  const cavity2HasPorousFill = segmentHasPorousFill(cavity2, input.layers, input.catalog);
  const explicitSupportTopology = inferExplicitWallSupportTopology(input.context);
  const isExplicitFlatLayerOrder =
    input.context?.wallTopology?.topologyMode === "flat_layer_order";
  const hasExplicitAirGapTopology =
    cavity1HasAir && cavity2HasAir && cavity1HasPorousFill && cavity2HasPorousFill;
  const hasExplicitSupportBackedPorousTopology = Boolean(
    explicitSupportTopology && cavity1HasPorousFill && cavity2HasPorousFill
  );

  if (
    cavity1DepthMm < 25 ||
    cavity1DepthMm > 220 ||
    cavity2DepthMm < 25 ||
    cavity2DepthMm > 220 ||
    (isExplicitFlatLayerOrder && !explicitSupportTopology) ||
    (!hasExplicitAirGapTopology && !hasExplicitSupportBackedPorousTopology) ||
    (isFieldContextRequest && !hasExplicitSupportBackedPorousTopology)
  ) {
    return null;
  }

  return {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm,
    cavity1FillCoverage: segmentFillCoverage(cavity1, input.layers, input.catalog),
    cavity1LayerIndices: [...cavity1.indices],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm,
    cavity2FillCoverage: segmentFillCoverage(cavity2, input.layers, input.catalog),
    cavity2LayerIndices: [...cavity2.indices],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [...internalLeaf.indices],
    sideALeafLayerIndices: [...sideA.indices],
    sideBLeafLayerIndices: [...sideB.indices],
    supportTopology: explicitSupportTopology ?? "independent_frames",
    topologyMode: "grouped_triple_leaf"
  };
}

export function inferSafeFlatWallDoubleLeafAutoTopology(input: {
  readonly catalog: readonly MaterialDefinition[];
  readonly context: AirborneContext | null;
  readonly layers: readonly LayerInput[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): WallTopology | null {
  const contextMode = input.context?.contextMode ?? "element_lab";
  const isElementLabRequest = contextMode === "element_lab" && hasWallLabRequest(input.targetOutputs);
  const isFieldContextRequest =
    contextMode === "field_between_rooms" &&
    (hasWallFieldRequest(input.targetOutputs) || hasWallLabRequest(input.targetOutputs));
  const isBuildingPredictionRequest =
    contextMode === "building_prediction" && hasWallFieldRequest(input.targetOutputs);
  if (
    (!isElementLabRequest && !isFieldContextRequest && !isBuildingPredictionRequest) ||
    !contextAllowsAutoTopology(input.context, ["double_leaf_framed", "flat_layer_order"])
  ) {
    return null;
  }

  const supportTopology = inferExplicitWallSupportTopology(input.context);
  if (
    !supportTopology ||
    typeof input.context?.studSpacingMm !== "number" ||
    !Number.isFinite(input.context.studSpacingMm) ||
    input.context.studSpacingMm <= 0
  ) {
    return null;
  }

  const classified = input.layers.map((layer, index) => classifyLayer(layer, index, input.catalog));
  if (classified.some((entry) => entry === null)) {
    return null;
  }

  const segments = segmentClassifiedLayers(classified as ClassifiedLayer[]);
  if (
    segments.length !== 3 ||
    segments[0]?.kind !== "leaf" ||
    segments[1]?.kind !== "cavity" ||
    segments[2]?.kind !== "leaf"
  ) {
    return null;
  }

  const [sideA, cavity1, sideB] = segments as [Segment, Segment, Segment];
  const cavity1DepthMm = segmentThicknessMm(cavity1, input.layers);
  const fillCoverage = segmentFillCoverage(cavity1, input.layers, input.catalog);

  if (
    cavity1DepthMm < 25 ||
    cavity1DepthMm > 220 ||
    fillCoverage === "unknown"
  ) {
    return null;
  }

  return {
    cavity1AbsorptionClass: segmentAbsorptionClass(cavity1, input.layers, input.catalog),
    cavity1DepthMm,
    cavity1FillCoverage: fillCoverage,
    cavity1LayerIndices: [...cavity1.indices],
    sideALeafLayerIndices: [...sideA.indices],
    sideBLeafLayerIndices: [...sideB.indices],
    supportTopology,
    topologyMode: "double_leaf_framed"
  };
}

export function inferSafeFlatWallAutoTopology(input: {
  readonly catalog: readonly MaterialDefinition[];
  readonly context: AirborneContext | null;
  readonly layers: readonly LayerInput[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): WallTopology | null {
  return (
    inferSafeFlatWallMulticavityAutoTopology(input) ??
    inferSafeFlatWallDoubleLeafAutoTopology(input)
  );
}
