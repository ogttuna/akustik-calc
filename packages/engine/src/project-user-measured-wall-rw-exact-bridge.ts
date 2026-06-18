import {
  ActiveProjectUserMeasuredWallRwAnchorSchema,
  buildProjectUserMeasuredWallRwAnchorFingerprint,
  type AirborneContext,
  type AirborneResultBasis,
  type MaterialDefinition,
  type ProjectUserMeasuredWallConstructionSnapshot,
  type ProjectUserMeasuredWallRwAnchor,
  type RequestedOutputId,
  type ResolvedLayer
} from "@dynecho/shared";

export const POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD =
  "post_v1_project_user_measured_wall_rw_exact_bridge";
export const POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_SELECTED_CANDIDATE_ID =
  "candidate_blocked_rockwool_exact_source";
export const POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX =
  "Project/user measured wall Rw exact anchor active";

type WallLayerRole = NonNullable<ProjectUserMeasuredWallConstructionSnapshot["layers"][number]["role"]>;
type WallLayerSide = NonNullable<ProjectUserMeasuredWallConstructionSnapshot["layers"][number]["side"]>;
type WallSupportTopology = ProjectUserMeasuredWallConstructionSnapshot["wallContext"]["supportTopology"];
type WallTopology = ProjectUserMeasuredWallConstructionSnapshot["wallContext"]["wallTopology"];

export type ProjectUserMeasuredWallRwExactBridgeMatch = {
  readonly id: string;
  readonly label: string;
  readonly metricLabel: "Rw";
  readonly metricValue: number;
  readonly sourceMode: "lab";
};

export type ProjectUserMeasuredWallRwExactBridgeResult = {
  readonly anchor?: ProjectUserMeasuredWallRwAnchor;
  readonly applied: boolean;
  readonly basis?: AirborneResultBasis;
  readonly match?: ProjectUserMeasuredWallRwExactBridgeMatch;
  readonly requestFingerprint?: string;
  readonly warnings: readonly string[];
};

function inferLayerRole(layer: ResolvedLayer): WallLayerRole {
  if (layer.material.category === "gap" || layer.material.acoustic?.behavior === "air_cavity") {
    return "cavity";
  }

  if (layer.material.category === "insulation" || layer.material.acoustic?.behavior === "porous_absorber") {
    return "absorber";
  }

  if (layer.material.category === "support" || layer.material.acoustic?.behavior === "structural_bridge") {
    return "support";
  }

  if (
    layer.material.category === "finish" ||
    layer.material.acoustic?.behavior === "panel_leaf" ||
    layer.material.acoustic?.behavior === "limp_mass_membrane"
  ) {
    return "board";
  }

  return "leaf";
}

function layerIndexIn(indices: readonly number[] | undefined, index: number): boolean {
  return Boolean(indices?.includes(index));
}

function inferLayerSide(input: {
  context: AirborneContext | null | undefined;
  index: number;
  role: WallLayerRole;
}): WallLayerSide | undefined {
  const topology = input.context?.wallTopology;
  if (!topology) {
    return input.role === "absorber" || input.role === "cavity" || input.role === "support"
      ? "cavity"
      : undefined;
  }

  if (layerIndexIn(topology.sideALeafLayerIndices, input.index)) {
    return "side_a";
  }

  if (layerIndexIn(topology.sideBLeafLayerIndices, input.index)) {
    return "side_b";
  }

  if (
    layerIndexIn(topology.cavity1LayerIndices, input.index) ||
    layerIndexIn(topology.cavity2LayerIndices, input.index) ||
    input.role === "absorber" ||
    input.role === "cavity" ||
    input.role === "support"
  ) {
    return "cavity";
  }

  return undefined;
}

function inferWallTopology(input: {
  context: AirborneContext | null | undefined;
  resolvedLayers: readonly ResolvedLayer[];
}): WallTopology {
  switch (input.context?.wallTopology?.topologyMode) {
    case "double_leaf_framed":
      return "framed_double_leaf";
    case "lined_massive_wall":
    case "flat_layer_order":
      return input.resolvedLayers.some((layer) => layer.material.category === "gap")
        ? "double_leaf"
        : "single_leaf";
    case "mass_timber_panel":
      return "mass_timber";
    case "grouped_triple_leaf":
      return "unknown";
    default:
      break;
  }

  if (input.resolvedLayers.some((layer) => layer.material.category === "support")) {
    return "framed_double_leaf";
  }

  if (input.resolvedLayers.some((layer) => layer.material.category === "gap")) {
    return "double_leaf";
  }

  return "unknown";
}

function inferSupportTopology(context: AirborneContext | null | undefined): WallSupportTopology {
  if (context?.connectionType === "resilient_channel") {
    return "resilient_bar";
  }

  switch (context?.wallTopology?.supportTopology) {
    case "independent_frames":
      return "independent_frame";
    case "resilient_channel":
      return "resilient_bar";
    case "direct_fixed":
      return "none";
    default:
      break;
  }

  switch (context?.studType) {
    case "light_steel_stud":
      return "steel_stud";
    case "wood_stud":
      return "timber_stud";
    case "resilient_stud":
      return "resilient_bar";
    default:
      return "unknown";
  }
}

function uniqueCalculationMaterials(resolvedLayers: readonly ResolvedLayer[]): MaterialDefinition[] {
  const byId = new Map<string, MaterialDefinition>();

  for (const layer of resolvedLayers) {
    if (!byId.has(layer.material.id)) {
      byId.set(layer.material.id, layer.material);
    }
  }

  return [...byId.values()];
}

function inferCavityFillMaterialId(input: {
  context: AirborneContext | null | undefined;
  resolvedLayers: readonly ResolvedLayer[];
}): string | undefined {
  const cavity1LayerIndices = input.context?.wallTopology?.cavity1LayerIndices ?? [];
  const indexedCavityFill = cavity1LayerIndices
    .map((index) => input.resolvedLayers[index])
    .find((layer) => layer?.material.category === "insulation");

  return indexedCavityFill?.material.id ??
    input.resolvedLayers.find((layer) => layer.material.category === "insulation")?.material.id;
}

export function buildProjectUserMeasuredWallRwRequestSnapshot(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly resolvedLayers: readonly ResolvedLayer[];
}): ProjectUserMeasuredWallConstructionSnapshot {
  return {
    layers: input.resolvedLayers.map((layer, index) => {
      const role = inferLayerRole(layer);

      return {
        materialId: layer.material.id,
        role,
        side: inferLayerSide({
          context: input.airborneContext,
          index,
          role
        }),
        thicknessMm: layer.thicknessMm
      };
    }),
    materialCatalog: uniqueCalculationMaterials(input.resolvedLayers),
    materialVisualOverrides: [],
    wallContext: {
      cavityDepthMm: input.airborneContext?.wallTopology?.cavity1DepthMm,
      cavityFillMaterialId: inferCavityFillMaterialId({
        context: input.airborneContext,
        resolvedLayers: input.resolvedLayers
      }),
      supportSpacingMm: input.airborneContext?.studSpacingMm,
      supportTopology: inferSupportTopology(input.airborneContext),
      wallTopology: inferWallTopology({
        context: input.airborneContext,
        resolvedLayers: input.resolvedLayers
      })
    }
  };
}

function isRwOnlyLabRequest(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly targetOutputs: readonly RequestedOutputId[];
}): boolean {
  return (
    input.targetOutputs.length === 1 &&
    input.targetOutputs[0] === "Rw" &&
    (!input.airborneContext?.contextMode || input.airborneContext.contextMode === "element_lab")
  );
}

function measurementStandardForBasis(anchor: ProjectUserMeasuredWallRwAnchor): AirborneResultBasis["measurementStandard"] {
  return anchor.measurementMethodStandard === "source_report_unknown"
    ? "source_report"
    : anchor.measurementMethodStandard;
}

function ratingStandardForBasis(anchor: ProjectUserMeasuredWallRwAnchor): AirborneResultBasis["ratingStandard"] {
  return anchor.ratingStandard === "source_report_unknown"
    ? "source_report"
    : anchor.ratingStandard;
}

function buildExactBridgeBasis(input: {
  readonly anchor: ProjectUserMeasuredWallRwAnchor;
  readonly requestFingerprint: string;
}): AirborneResultBasis {
  return {
    assumptions: [
      "project/user measured wall Rw anchor fingerprint exactly matches the current element-lab wall request",
      "this owner publishes only the measured lab Rw single-number rating; STC, C, Ctr, field, building, and impact aliases stay outside this exact source"
    ],
    curveBasis: "source_single_number_rating",
    exactSourceId: input.anchor.id,
    kind: "airborne_measured_exact",
    measurementStandard: measurementStandardForBasis(input.anchor),
    method: POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: ratingStandardForBasis(input.anchor),
    requiredInputs: [
      "airborneMeasuredSourceAnchors",
      "canonicalWallRwFingerprint",
      "targetOutput:Rw"
    ],
    toleranceClass: "exact_source"
  };
}

export function maybeBuildProjectUserMeasuredWallRwExactBridge(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly anchors?: readonly ProjectUserMeasuredWallRwAnchor[] | null;
  readonly compatibleAnchorDeltaAlreadyApplied: boolean;
  readonly exactFullStackAlreadyApplied: boolean;
  readonly resolvedLayers: readonly ResolvedLayer[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): ProjectUserMeasuredWallRwExactBridgeResult {
  if (
    !input.anchors?.length ||
    input.exactFullStackAlreadyApplied ||
    input.compatibleAnchorDeltaAlreadyApplied ||
    !isRwOnlyLabRequest({
      airborneContext: input.airborneContext,
      targetOutputs: input.targetOutputs
    })
  ) {
    return {
      applied: false,
      warnings: []
    };
  }

  const snapshot = buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.airborneContext,
    resolvedLayers: input.resolvedLayers
  });
  const matches = input.anchors
    .map((anchor) => ActiveProjectUserMeasuredWallRwAnchorSchema.safeParse(anchor))
    .filter((parsed): parsed is { success: true; data: ProjectUserMeasuredWallRwAnchor } => parsed.success)
    .map((parsed) => {
      const requestFingerprint = buildProjectUserMeasuredWallRwAnchorFingerprint({
        measurementMethodStandard: parsed.data.measurementMethodStandard,
        ratingStandard: parsed.data.ratingStandard,
        snapshot
      });

      return {
        anchor: parsed.data,
        requestFingerprint
      };
    })
    .filter(({ anchor, requestFingerprint }) => anchor.fingerprint === requestFingerprint);

  if (matches.length !== 1) {
    return {
      applied: false,
      warnings: matches.length > 1
        ? [
            "Project/user measured wall Rw exact bridge found multiple active anchors with the same request fingerprint; DynEcho ignored them until the conflict is resolved."
          ]
        : []
    };
  }

  const { anchor, requestFingerprint } = matches[0];
  const basis = buildExactBridgeBasis({
    anchor,
    requestFingerprint
  });

  return {
    anchor,
    applied: true,
    basis,
    match: {
      id: anchor.id,
      label: anchor.sourceLabel,
      metricLabel: "Rw",
      metricValue: anchor.valueDb,
      sourceMode: "lab"
    },
    requestFingerprint,
    warnings: [
      `${POST_V1_PROJECT_USER_MEASURED_WALL_RW_EXACT_BRIDGE_WARNING_PREFIX}: ${anchor.sourceLabel} matched ${requestFingerprint}; DynEcho used lab Rw ${anchor.valueDb} dB only for Rw.`
    ]
  };
}
