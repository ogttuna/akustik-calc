import type { AirborneContext, DynamicAirborneFamily, ResolvedLayer } from "@dynecho/shared";

import { classifyLayerRole, materialText } from "./airborne-topology";
import {
  hasExplicitFramingHint,
  isBoardLikeLayer,
  isMasonryCoreLayer,
  type DynamicFramingHint
} from "./dynamic-airborne-family-detection";
import type { DynamicAirborneOptions, DynamicAirborneResult } from "./dynamic-airborne-helpers";

export const FLAT_LIST_MULTILEAF_GUARD_STRATEGY =
  "multileaf_screening_blend_fail_closed_until_grouped_topology";

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

  const guarded = calculate(layers, {
    ...options,
    disableFlatListMultileafFamilyGuard: true,
    forcedFamily: "multileaf_multicavity"
  });
  const guardNote =
    `Flat-list adjacent-swap sensitivity guard held this wall on multi-leaf screening because nearby board/fill swaps flip between double-leaf and multi-leaf families with a ${flatListGuard.maxAdjacentRwDeltaDb.toFixed(1)} dB Rw spread.`;

  return {
    ...guarded,
    trace: {
      ...guarded.trace,
      confidenceClass: "low",
      confidenceScore: Math.min(guarded.trace.confidenceScore, 0.49),
      notes: [guardNote, ...guarded.trace.notes],
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    },
    warnings: [
      `${guardNote} DynEcho keeps this as fail-closed screening until grouped topology and source validation are available.`,
      ...guarded.warnings
    ]
  };
}
