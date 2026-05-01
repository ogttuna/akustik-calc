import type { AirborneContext, DynamicAirborneFamily } from "@dynecho/shared";

export type WallTripleLeafTopologyFieldId =
  | "side_a_leaf_layer_group"
  | "cavity_1_depth_fill_and_absorption_group"
  | "internal_leaf_layer_group"
  | "internal_leaf_coupling_or_bridge_class"
  | "cavity_2_depth_fill_and_absorption_group"
  | "side_b_leaf_layer_group"
  | "support_topology";

export type WallTripleLeafImplementationBlockerId =
  | "source_calibrated_triple_leaf_solver"
  | "source_tolerance_owner"
  | "paired_engine_and_web_visible_tests";

export type WallTripleLeafTopologyReadiness = {
  applies: boolean;
  implementationBlockers: readonly WallTripleLeafImplementationBlockerId[];
  missingTopologyFields: readonly WallTripleLeafTopologyFieldId[];
  readyForExactTripleLeafCalculation: boolean;
};

export const REQUIRED_WALL_TRIPLE_LEAF_TOPOLOGY_FIELDS: readonly WallTripleLeafTopologyFieldId[] = [
  "side_a_leaf_layer_group",
  "cavity_1_depth_fill_and_absorption_group",
  "internal_leaf_layer_group",
  "internal_leaf_coupling_or_bridge_class",
  "cavity_2_depth_fill_and_absorption_group",
  "side_b_leaf_layer_group",
  "support_topology"
] as const;

export const WALL_TRIPLE_LEAF_TOPOLOGY_FIELD_LABELS: Record<WallTripleLeafTopologyFieldId, string> = {
  cavity_1_depth_fill_and_absorption_group: "cavity 1 depth/fill/absorption",
  cavity_2_depth_fill_and_absorption_group: "cavity 2 depth/fill/absorption",
  internal_leaf_coupling_or_bridge_class: "internal leaf coupling/bridge class",
  internal_leaf_layer_group: "internal leaf layer group",
  side_a_leaf_layer_group: "side A leaf layer group",
  side_b_leaf_layer_group: "side B leaf layer group",
  support_topology: "support topology"
};

export const WALL_TRIPLE_LEAF_IMPLEMENTATION_BLOCKERS: readonly WallTripleLeafImplementationBlockerId[] = [
  "source_calibrated_triple_leaf_solver",
  "source_tolerance_owner",
  "paired_engine_and_web_visible_tests"
] as const;

const CAVITY_1_FIELDS = [
  "cavity1LayerIndices",
  "cavity1DepthMm",
  "cavity1FillCoverage",
  "cavity1AbsorptionClass"
] as const;

const CAVITY_2_FIELDS = [
  "cavity2LayerIndices",
  "cavity2DepthMm",
  "cavity2FillCoverage",
  "cavity2AbsorptionClass"
] as const;

function hasLayerGroup(value: readonly number[] | undefined): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasKnownToken(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown" && value !== "auto";
}

function hasPositiveNumber(value: number | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasCompleteCavity(
  topology: NonNullable<AirborneContext["wallTopology"]> | undefined,
  fields: typeof CAVITY_1_FIELDS | typeof CAVITY_2_FIELDS
): boolean {
  if (!topology) {
    return false;
  }

  const [layerIndicesField, depthField, fillField, absorptionField] = fields;
  return (
    hasLayerGroup(topology[layerIndicesField]) &&
    hasPositiveNumber(topology[depthField]) &&
    hasKnownToken(topology[fillField]) &&
    hasKnownToken(topology[absorptionField])
  );
}

export function evaluateWallTripleLeafTopologyReadiness(input: {
  airborneContext?: AirborneContext | null;
  cavityCount: number;
  detectedFamily: DynamicAirborneFamily;
  visibleLeafCount: number;
}): WallTripleLeafTopologyReadiness {
  const applies =
    input.detectedFamily === "multileaf_multicavity" &&
    input.visibleLeafCount >= 3 &&
    input.cavityCount >= 2;

  if (!applies) {
    return {
      applies: false,
      implementationBlockers: [],
      missingTopologyFields: [],
      readyForExactTripleLeafCalculation: false
    };
  }

  const topology = input.airborneContext?.wallTopology;
  const groupedMode = topology?.topologyMode === "grouped_triple_leaf";
  const missingTopologyFields: WallTripleLeafTopologyFieldId[] = [];

  if (!groupedMode || !hasLayerGroup(topology?.sideALeafLayerIndices)) {
    missingTopologyFields.push("side_a_leaf_layer_group");
  }

  if (!groupedMode || !hasCompleteCavity(topology, CAVITY_1_FIELDS)) {
    missingTopologyFields.push("cavity_1_depth_fill_and_absorption_group");
  }

  if (!groupedMode || !hasLayerGroup(topology?.internalLeafLayerIndices)) {
    missingTopologyFields.push("internal_leaf_layer_group");
  }

  if (!groupedMode || !hasKnownToken(topology?.internalLeafCoupling)) {
    missingTopologyFields.push("internal_leaf_coupling_or_bridge_class");
  }

  if (!groupedMode || !hasCompleteCavity(topology, CAVITY_2_FIELDS)) {
    missingTopologyFields.push("cavity_2_depth_fill_and_absorption_group");
  }

  if (!groupedMode || !hasLayerGroup(topology?.sideBLeafLayerIndices)) {
    missingTopologyFields.push("side_b_leaf_layer_group");
  }

  if (!groupedMode || !hasKnownToken(topology?.supportTopology)) {
    missingTopologyFields.push("support_topology");
  }

  return {
    applies: true,
    implementationBlockers: WALL_TRIPLE_LEAF_IMPLEMENTATION_BLOCKERS,
    missingTopologyFields,
    readyForExactTripleLeafCalculation: false
  };
}
