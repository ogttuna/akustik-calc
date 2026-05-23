import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  ResolvedLayer,
  RequestedOutputId
} from "@dynecho/shared";

import { classifyLayerRole, materialText } from "./airborne-topology";
import {
  hasExplicitFramingHint,
  isBoardLikeLayer,
  isMasonryCoreLayer,
  type DynamicFramingHint
} from "./dynamic-airborne-family-detection";
import type { DynamicAirborneOptions, DynamicAirborneResult } from "./dynamic-airborne-helpers";

export const FLAT_LIST_MULTILEAF_GUARD_STRATEGY =
  "double_leaf_porous_fill_delegate+flat_list_adjacent_swap_numeric_hold_until_grouped_topology";

export const FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD =
  "wall_flat_list_adjacent_swap_double_leaf_numeric_guard_lab_runtime";

export const FLAT_LIST_MULTILEAF_GUARD_LAB_SELECTED_CANDIDATE_ID =
  "wall.flat_list_adjacent_swap.double_leaf_numeric_guard";

export const FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD =
  "wall_flat_list_adjacent_swap_double_leaf_numeric_guard_field_adapter_runtime";

export const FLAT_LIST_MULTILEAF_GUARD_FIELD_SELECTED_CANDIDATE_ID =
  "wall.flat_list_adjacent_swap.field_context_adapter";

export type FlatListMultileafGuardProbe = {
  candidateStacks: readonly (readonly ResolvedLayer[])[];
  rejectionReasons: readonly string[];
};

export type FlatListMultileafGuardSnapshot = {
  family: DynamicAirborneFamily;
  rw: number;
};

export type FlatListMultileafGuardAssessment = {
  applies: boolean;
  maxAdjacentRwDeltaDb: number;
  probeCount: number;
};

export type FlatListMultileafGuardOutputBasis = "building_prediction" | "element_lab" | "field_apparent";

const MAX_FLAT_LIST_GUARD_LAYER_COUNT = 9;
const MIN_GUARD_DELTA_DB = 8;

function isCompliantLayer(layer: ResolvedLayer): boolean {
  const role = classifyLayerRole(layer);
  if (role.isGap || role.isPorous) {
    return true;
  }

  return /rockwool|mineral|glass|wool|fiber|fibre|insulation|air_gap|air|gap|cavity/.test(materialText(layer));
}

function hasGroupedTripleLeafTopology(airborneContext?: AirborneContext | null): boolean {
  return airborneContext?.wallTopology?.topologyMode === "grouped_triple_leaf";
}

export function isFlatListMultileafGuardStrategy(strategy?: string | null): boolean {
  return strategy === FLAT_LIST_MULTILEAF_GUARD_STRATEGY;
}

export function buildFlatListMultileafGuardAirborneBasis(input: {
  family?: DynamicAirborneFamily;
  outputBasis: FlatListMultileafGuardOutputBasis;
  targetOutputs: readonly RequestedOutputId[];
}): AirborneResultBasis | null {
  if (input.outputBasis === "building_prediction") {
    return null;
  }

  const fieldApparent = input.outputBasis === "field_apparent";
  const method = fieldApparent
    ? FLAT_LIST_MULTILEAF_GUARD_FIELD_RUNTIME_METHOD
    : FLAT_LIST_MULTILEAF_GUARD_LAB_RUNTIME_METHOD;
  const requestedOutputs = input.targetOutputs.length > 0 ? input.targetOutputs.join(", ") : "default wall outputs";

  return {
    assumptions: fieldApparent
      ? [
          "flat-list adjacent-swap guard kept the current double-leaf numeric lane because adjacent reorder probes would otherwise apply an unowned multileaf penalty",
          "field/apparent values are calculated from explicit field_between_rooms context and the guarded lab-family curve",
          "lab Rw/STC is not relabelled as R'w/DnT,w; the field adapter owns only the requested apparent outputs",
          "grouped triple-leaf topology is still required before the multileaf penalty can be treated as physical"
        ]
      : [
          "flat-list adjacent-swap guard kept the current double-leaf numeric lane because adjacent reorder probes would otherwise apply an unowned multileaf penalty",
          "this is a source-absent guarded calculation, not a measured exact row",
          "grouped triple-leaf topology is still required before the multileaf penalty can be treated as physical"
        ],
    calculationStandard: fieldApparent ? "ISO 12354-1" : "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: fieldApparent ? 10 : 8,
    family: input.family ?? "double_leaf",
    kind: "airborne_physics_prediction",
    method,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "same_stack_flat_list_guard_holdout_absent",
      "grouped_topology_required_before_multileaf_penalty"
    ],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: fieldApparent
      ? [
          "route=wall",
          "flatListAdjacentSwapSensitivityProbe",
          "guardedDoubleLeafNumericLane",
          "fieldContext.contextMode=field_between_rooms",
          "fieldContext.partitionAreaM2_or_panelWidthHeight",
          "fieldContext.receivingRoomVolumeM3",
          "fieldContext.receivingRoomRt60S",
          `requestedOutputs=${requestedOutputs}`
        ]
      : [
          "route=wall",
          "flatListAdjacentSwapSensitivityProbe",
          "guardedDoubleLeafNumericLane",
          "groupedTripleLeafNegativeBoundary",
          "ISO717_1_Rw_C_Ctr_adapter",
          "ASTM_E413_STC_adapter",
          `requestedOutputs=${requestedOutputs}`
        ],
    toleranceClass: "uncalibrated_prediction"
  };
}

function hasExplicitFramingOrTrack(framingHint: DynamicFramingHint): boolean {
  return (
    hasExplicitFramingHint(framingHint) ||
    framingHint.sharedTrack === "independent" ||
    framingHint.sharedTrack === "shared"
  );
}

function swapAdjacent(layers: readonly ResolvedLayer[], index: number): readonly ResolvedLayer[] {
  const swapped = [...layers];
  [swapped[index], swapped[index + 1]] = [swapped[index + 1]!, swapped[index]!];
  return swapped;
}

export function buildFlatListMultileafGuardProbe(input: {
  airborneContext?: AirborneContext | null;
  framingHint: DynamicFramingHint;
  layers: readonly ResolvedLayer[];
}): FlatListMultileafGuardProbe {
  const { airborneContext, framingHint, layers } = input;
  const rejectionReasons: string[] = [];

  if (layers.some((layer) => Boolean(layer.floorRole))) {
    rejectionReasons.push("known_floor_exact_row_negative_boundary");
  }

  if (hasGroupedTripleLeafTopology(airborneContext)) {
    rejectionReasons.push("grouped_triple_leaf_topology_negative_boundary");
  }

  if (hasExplicitFramingOrTrack(framingHint)) {
    rejectionReasons.push("simple_stud_negative_boundary");
  }

  if (layers.length > MAX_FLAT_LIST_GUARD_LAYER_COUNT) {
    rejectionReasons.push("duplicate_many_layer_finite_output_negative_boundary");
  }

  if (layers.some(isMasonryCoreLayer)) {
    rejectionReasons.push("lined_massive_boundary_hold_negative_boundary");
  }

  if (layers.filter(isBoardLikeLayer).length < 3 || layers.filter(isCompliantLayer).length < 1) {
    rejectionReasons.push("ordinary_double_leaf_negative_boundary");
  }

  if (rejectionReasons.length > 0) {
    return {
      candidateStacks: [],
      rejectionReasons
    };
  }

  const candidateStacks: ResolvedLayer[][] = [];
  for (let index = 0; index < layers.length - 1; index += 1) {
    const current = layers[index]!;
    const next = layers[index + 1]!;
    if (
      (isBoardLikeLayer(current) && isCompliantLayer(next)) ||
      (isCompliantLayer(current) && isBoardLikeLayer(next))
    ) {
      candidateStacks.push([...swapAdjacent(layers, index)]);
    }
  }

  return {
    candidateStacks,
    rejectionReasons
  };
}

export function assessFlatListMultileafGuard(input: {
  current: FlatListMultileafGuardSnapshot;
  probes: readonly FlatListMultileafGuardSnapshot[];
}): FlatListMultileafGuardAssessment {
  const { current, probes } = input;
  const families = new Set<DynamicAirborneFamily>([current.family, ...probes.map((probe) => probe.family)]);
  const maxAdjacentRwDeltaDb = Math.max(
    0,
    ...probes.map((probe) => Math.abs(probe.rw - current.rw))
  );

  return {
    applies:
      current.family === "double_leaf" &&
      families.has("multileaf_multicavity") &&
      maxAdjacentRwDeltaDb >= MIN_GUARD_DELTA_DB,
    maxAdjacentRwDeltaDb,
    probeCount: probes.length
  };
}

export function applyFlatListMultileafFamilyGuard(input: {
  calculate: (layers: readonly ResolvedLayer[], options: DynamicAirborneOptions) => DynamicAirborneResult;
  estimateScreeningRw: (layers: readonly ResolvedLayer[]) => number;
  family: DynamicAirborneFamily;
  framingHint: DynamicFramingHint;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
}): DynamicAirborneResult | null {
  const { calculate, estimateScreeningRw, family, framingHint, layers, options } = input;

  if (options.disableFlatListMultileafFamilyGuard || options.forcedFamily || family !== "double_leaf") {
    return null;
  }

  const flatListGuardProbe = buildFlatListMultileafGuardProbe({
    airborneContext: options.airborneContext,
    framingHint,
    layers
  });

  if (flatListGuardProbe.candidateStacks.length < 1) {
    return null;
  }

  const unguardedCurrent = calculate(layers, {
    ...options,
    disableFlatListMultileafFamilyGuard: true
  });
  const probeSnapshots = flatListGuardProbe.candidateStacks.map((candidateLayers) => {
    const probe = calculate(candidateLayers, {
      ...options,
      disableFlatListMultileafFamilyGuard: true,
      screeningEstimatedRwDb: estimateScreeningRw(candidateLayers)
    });

    return {
      family: probe.trace.detectedFamily,
      rw: probe.rw
    };
  });
  const flatListGuard = assessFlatListMultileafGuard({
    current: {
      family: unguardedCurrent.trace.detectedFamily,
      rw: unguardedCurrent.rw
    },
    probes: probeSnapshots
  });

  if (!flatListGuard.applies) {
    return null;
  }

  const guardNote =
    `Flat-list adjacent-swap sensitivity guard kept the current double-leaf numeric lane because nearby board/fill swaps flip between double-leaf and multi-leaf families with a ${flatListGuard.maxAdjacentRwDeltaDb.toFixed(1)} dB Rw spread.`;

  return {
    ...unguardedCurrent,
    trace: {
      ...unguardedCurrent.trace,
      notes: [guardNote, ...unguardedCurrent.trace.notes],
      strategy:
        unguardedCurrent.trace.strategy === "double_leaf_porous_fill_delegate"
          ? FLAT_LIST_MULTILEAF_GUARD_STRATEGY
          : `${unguardedCurrent.trace.strategy}+flat_list_adjacent_swap_numeric_hold_until_grouped_topology`
    },
    warnings: [
      `${guardNote} DynEcho did not apply the multi-leaf penalty from a flat-list reorder alone; provide grouped triple-leaf topology before treating the penalty as physical.`,
      ...unguardedCurrent.warnings
    ]
  };
}
