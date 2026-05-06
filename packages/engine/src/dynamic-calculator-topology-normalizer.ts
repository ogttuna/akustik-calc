import {
  LayerInputSchema,
  type AirborneContext,
  type LayerInput,
  type MaterialDefinition,
  type RequestedOutputId
} from "@dynecho/shared";

import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  type DynamicCalculatorFloorImpactContext,
  type DynamicCalculatorRoute,
  type DynamicCalculatorRouteInputTopologyAssessment
} from "./dynamic-calculator-route-input-topology";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

export type DynamicCalculatorTopologyNormalizationStatus =
  | "unchanged"
  | "normalized"
  | "needs_input"
  | "unsupported_hostile_input";

export type DynamicCalculatorTopologyNormalizationActionKind =
  | "coalesced_contiguous_same_role_material"
  | "normalized_role_defined_floor_order"
  | "preserved_order_meaningful"
  | "blocked_ambiguous_multicavity_auto_grouping"
  | "blocked_unsafe_multicavity_reorder"
  | "blocked_hostile_layer_input";

export type DynamicCalculatorTopologyNormalizationAction = {
  actionId: string;
  detail: string;
  kind: DynamicCalculatorTopologyNormalizationActionKind;
  sourceLayerIndices: readonly number[];
  targetLayerIndex?: number;
};

export type DynamicCalculatorTopologyNormalizationBlockerCode =
  | "ambiguous_multicavity_flat_list"
  | "empty_layer_stack"
  | "excessive_layer_count"
  | "invalid_layer_schema"
  | "unsafe_multicavity_reorder";

export type DynamicCalculatorTopologyNormalizationBlocker = {
  code: DynamicCalculatorTopologyNormalizationBlockerCode;
  detail: string;
  layerIndices: readonly number[];
};

export type DynamicCalculatorTopologyNormalizerInput = {
  airborneContext?: AirborneContext;
  catalog?: readonly MaterialDefinition[];
  floorImpactContext?: DynamicCalculatorFloorImpactContext;
  layers: readonly LayerInput[];
  maxLayerCount?: number;
  previousLayers?: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  targetOutputs: readonly RequestedOutputId[];
};

export type DynamicCalculatorTopologyNormalizationResult = {
  actions: readonly DynamicCalculatorTopologyNormalizationAction[];
  blockers: readonly DynamicCalculatorTopologyNormalizationBlocker[];
  designGradePromotionAllowed: false;
  normalizedLayers: readonly LayerInput[];
  route: DynamicCalculatorRoute;
  routeInputAssessment: DynamicCalculatorRouteInputTopologyAssessment;
  runtimeValueMovement: false;
  safeReorderApplied: boolean;
  status: DynamicCalculatorTopologyNormalizationStatus;
  topologyAutoGrouped: false;
  unsafeReorderBlocked: boolean;
};

const DEFAULT_MAX_LAYER_COUNT = 64;
const MAX_REASONABLE_THICKNESS_MM = 1000;
const WALL_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const FLOOR_ROLE_ORDER = new Map<LayerInput["floorRole"], number>([
  ["base_structure", 0],
  ["resilient_layer", 1],
  ["floating_screed", 2],
  ["upper_fill", 3],
  ["floor_covering", 4],
  ["ceiling_cavity", 5],
  ["ceiling_fill", 6],
  ["ceiling_board", 7]
]);

function makeAction(input: {
  detail: string;
  kind: DynamicCalculatorTopologyNormalizationActionKind;
  sourceLayerIndices: readonly number[];
  targetLayerIndex?: number;
}): DynamicCalculatorTopologyNormalizationAction {
  return {
    actionId: `${input.kind}:${input.sourceLayerIndices.join("-")}`,
    detail: input.detail,
    kind: input.kind,
    sourceLayerIndices: input.sourceLayerIndices,
    targetLayerIndex: input.targetLayerIndex
  };
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

function layerBehavior(
  layer: LayerInput,
  catalog: readonly MaterialDefinition[]
): string | undefined {
  return resolveLayerMaterial(layer, catalog)?.acoustic?.behavior;
}

function layerTags(layer: LayerInput, catalog: readonly MaterialDefinition[]): readonly string[] {
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
    layerBehavior(layer, catalog) === "air_cavity" ||
    layerTags(layer, catalog).some((tag) => tag === "cavity")
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

function hasGroupedTripleLeafTopology(context: AirborneContext | undefined): boolean {
  return context?.wallTopology?.topologyMode === "grouped_triple_leaf";
}

function layerIdentity(layer: LayerInput): string {
  return `${layer.floorRole ?? ""}|${layer.materialId}|${String(layer.thicknessMm)}`;
}

function hasSameLayerMultiset(
  left: readonly LayerInput[],
  right: readonly LayerInput[]
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return [...left].map(layerIdentity).sort().join("\n") ===
    [...right].map(layerIdentity).sort().join("\n");
}

function hasSameLayerOrder(left: readonly LayerInput[], right: readonly LayerInput[]): boolean {
  return left.map(layerIdentity).join("\n") === right.map(layerIdentity).join("\n");
}

function validateLayers(
  layers: readonly LayerInput[],
  maxLayerCount: number
): DynamicCalculatorTopologyNormalizationBlocker[] {
  const blockers: DynamicCalculatorTopologyNormalizationBlocker[] = [];

  if (layers.length === 0) {
    blockers.push({
      code: "empty_layer_stack",
      detail: "At least one layer is required before the Dynamic Calculator can assess topology.",
      layerIndices: []
    });
  }

  if (layers.length > maxLayerCount) {
    blockers.push({
      code: "excessive_layer_count",
      detail: `Layer stack has ${String(layers.length)} layers; group or simplify before design-grade assessment.`,
      layerIndices: layers.map((_, index) => index)
    });
  }

  for (const [index, layer] of layers.entries()) {
    const parsed = LayerInputSchema.safeParse(layer);
    if (!parsed.success || layer.thicknessMm > MAX_REASONABLE_THICKNESS_MM) {
      blockers.push({
        code: "invalid_layer_schema",
        detail:
          "Layer thickness and material fields must be finite, positive, and within a physically reasonable calculator range.",
        layerIndices: [index]
      });
    }
  }

  return blockers;
}

function normalizeRoleDefinedFloor(
  layers: readonly LayerInput[]
): {
  actions: DynamicCalculatorTopologyNormalizationAction[];
  normalizedLayers: LayerInput[];
  safeReorderApplied: boolean;
} {
  if (!layers.every((layer) => layer.floorRole)) {
    return {
      actions: [],
      normalizedLayers: [...layers],
      safeReorderApplied: false
    };
  }

  const withOriginalIndex = layers.map((layer, originalIndex) => ({ layer, originalIndex }));
  const sorted = [...withOriginalIndex].sort((left, right) => {
    const leftRoleOrder = FLOOR_ROLE_ORDER.get(left.layer.floorRole) ?? Number.MAX_SAFE_INTEGER;
    const rightRoleOrder = FLOOR_ROLE_ORDER.get(right.layer.floorRole) ?? Number.MAX_SAFE_INTEGER;
    return leftRoleOrder - rightRoleOrder || left.originalIndex - right.originalIndex;
  });
  const safeReorderApplied = sorted.some(
    (entry, sortedIndex) => entry.originalIndex !== sortedIndex
  );
  const actions: DynamicCalculatorTopologyNormalizationAction[] = [];

  if (safeReorderApplied) {
    actions.push(
      makeAction({
        detail:
          "Role-defined floor layers were put into canonical role order; roles, not UI row order, define the physical placement.",
        kind: "normalized_role_defined_floor_order",
        sourceLayerIndices: sorted.map((entry) => entry.originalIndex)
      })
    );
  }

  const normalizedLayers: LayerInput[] = [];
  let pending: { indices: number[]; layer: LayerInput } | null = null;
  const flush = (): void => {
    if (!pending) {
      return;
    }

    const targetLayerIndex = normalizedLayers.length;
    normalizedLayers.push(pending.layer);
    if (pending.indices.length > 1) {
      actions.push(
        makeAction({
          detail:
            "Contiguous floor layers with the same role and material were coalesced because the role-defined physics is invariant to the split.",
          kind: "coalesced_contiguous_same_role_material",
          sourceLayerIndices: pending.indices,
          targetLayerIndex
        })
      );
    }

    pending = null;
  };

  for (const entry of sorted) {
    const current = entry.layer;
    if (
      pending &&
      pending.layer.floorRole === current.floorRole &&
      pending.layer.materialId === current.materialId
    ) {
      const pendingLayer: LayerInput = pending.layer;
      pending = {
        indices: [...pending.indices, entry.originalIndex],
        layer: {
          ...pendingLayer,
          thicknessMm: pendingLayer.thicknessMm + current.thicknessMm
        }
      };
      continue;
    }

    flush();
    pending = {
      indices: [entry.originalIndex],
      layer: { ...current }
    };
  }

  flush();

  return {
    actions,
    normalizedLayers,
    safeReorderApplied
  };
}

function statusFrom(input: {
  blockers: readonly DynamicCalculatorTopologyNormalizationBlocker[];
  normalized: boolean;
}): DynamicCalculatorTopologyNormalizationStatus {
  if (input.blockers.some((blocker) => blocker.code === "invalid_layer_schema")) {
    return "unsupported_hostile_input";
  }

  if (input.blockers.length > 0) {
    return "needs_input";
  }

  return input.normalized ? "normalized" : "unchanged";
}

export function normalizeDynamicCalculatorTopologyInput(
  input: DynamicCalculatorTopologyNormalizerInput
): DynamicCalculatorTopologyNormalizationResult {
  const catalog = input.catalog ?? getDefaultMaterialCatalog();
  const maxLayerCount = input.maxLayerCount ?? DEFAULT_MAX_LAYER_COUNT;
  const actions: DynamicCalculatorTopologyNormalizationAction[] = [];
  const blockers = validateLayers(input.layers, maxLayerCount);
  const currentLooksLikeMulticavityWall =
    input.route === "wall" &&
    (hasGroupedTripleLeafTopology(input.airborneContext) ||
      looksLikeMultiCavityWall(input.layers, catalog));
  const previousLooksLikeMulticavityWall =
    input.route === "wall" &&
    input.previousLayers !== undefined &&
    looksLikeMultiCavityWall(input.previousLayers, catalog);

  let unsafeReorderBlocked = false;
  if (
    input.route === "wall" &&
    input.previousLayers &&
    (currentLooksLikeMulticavityWall || previousLooksLikeMulticavityWall) &&
    hasSameLayerMultiset(input.layers, input.previousLayers) &&
    !hasSameLayerOrder(input.layers, input.previousLayers)
  ) {
    unsafeReorderBlocked = true;
    blockers.push({
      code: "unsafe_multicavity_reorder",
      detail:
        "Multi-cavity wall layer order changed while the material multiset stayed the same; require explicit grouped topology before treating this as safe.",
      layerIndices: input.layers.map((_, index) => index)
    });
    actions.push(
      makeAction({
        detail:
          "Multi-cavity wall order is acoustically meaningful, so the normalizer preserves the user order and records a blocker.",
        kind: "blocked_unsafe_multicavity_reorder",
        sourceLayerIndices: input.layers.map((_, index) => index)
      })
    );
  }

  let normalizedLayers = [...input.layers];
  let safeReorderApplied = false;

  if (input.route === "floor" && blockers.length === 0) {
    const floorNormalization = normalizeRoleDefinedFloor(input.layers);
    normalizedLayers = floorNormalization.normalizedLayers;
    actions.push(...floorNormalization.actions);
    safeReorderApplied = floorNormalization.safeReorderApplied;
  }

  if (input.route === "wall" && currentLooksLikeMulticavityWall) {
    actions.push(
      makeAction({
        detail:
          "Multi-cavity wall leaf/cavity order is meaningful; Gate L never coalesces or reorders it implicitly.",
        kind: "preserved_order_meaningful",
        sourceLayerIndices: input.layers.map((_, index) => index)
      })
    );
  }

  if (
    input.route === "wall" &&
    currentLooksLikeMulticavityWall &&
    !hasGroupedTripleLeafTopology(input.airborneContext)
  ) {
    blockers.push({
      code: "ambiguous_multicavity_flat_list",
      detail:
        "Flat multi-cavity wall layers cannot be auto-grouped safely; request side leaves, internal leaf, cavities, and support topology.",
      layerIndices: input.layers.map((_, index) => index)
    });
    actions.push(
      makeAction({
        detail:
          "Ambiguous flat multi-cavity input is passed to the route/input contract instead of being auto-grouped.",
        kind: "blocked_ambiguous_multicavity_auto_grouping",
        sourceLayerIndices: input.layers.map((_, index) => index)
      })
    );
  }

  if (blockers.some((blocker) => blocker.code === "invalid_layer_schema")) {
    actions.push(
      makeAction({
        detail:
          "Hostile layer input is blocked before normalization so invalid values cannot promote to a design-grade answer.",
        kind: "blocked_hostile_layer_input",
        sourceLayerIndices: blockers.flatMap((blocker) => blocker.layerIndices)
      })
    );
  }

  const routeInputAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
    airborneContext: input.airborneContext,
    catalog,
    floorImpactContext: input.floorImpactContext,
    layers: normalizedLayers,
    route: input.route,
    targetOutputs: input.targetOutputs.length > 0 ? input.targetOutputs : WALL_AIRBORNE_OUTPUTS
  });
  const normalized = actions.some(
    (action) =>
      action.kind === "coalesced_contiguous_same_role_material" ||
      action.kind === "normalized_role_defined_floor_order"
  );

  return {
    actions,
    blockers,
    designGradePromotionAllowed: false,
    normalizedLayers,
    route: input.route,
    routeInputAssessment,
    runtimeValueMovement: false,
    safeReorderApplied,
    status: statusFrom({ blockers, normalized }),
    topologyAutoGrouped: false,
    unsafeReorderBlocked
  };
}

export function buildGateLTopologyNormalizerScenarioPack(): readonly DynamicCalculatorTopologyNormalizationResult[] {
  const floorSplitAndReordered: readonly LayerInput[] = [
    { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 90 },
    { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 4 },
    { floorRole: "base_structure", materialId: "concrete", thicknessMm: 90 },
    { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 }
  ];
  const flatMulticavityWall: readonly LayerInput[] = [
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "mlv", thicknessMm: 2 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "air_gap", thicknessMm: 20 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 30 },
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "rockwool", thicknessMm: 80 },
    { materialId: "gypsum_board", thicknessMm: 12.5 }
  ];
  const hostileThickness = [
    { materialId: "concrete", thicknessMm: Number.POSITIVE_INFINITY as number }
  ] as readonly LayerInput[];

  return [
    normalizeDynamicCalculatorTopologyInput({
      layers: floorSplitAndReordered,
      route: "floor",
      targetOutputs: ["Rw", "Ln,w"]
    }),
    normalizeDynamicCalculatorTopologyInput({
      airborneContext: { contextMode: "element_lab" },
      layers: flatMulticavityWall,
      route: "wall",
      targetOutputs: WALL_AIRBORNE_OUTPUTS
    }),
    normalizeDynamicCalculatorTopologyInput({
      layers: hostileThickness,
      route: "floor",
      targetOutputs: ["Rw"]
    })
  ];
}
