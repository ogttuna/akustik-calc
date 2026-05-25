import type {
  AirborneContext,
  AssemblyRatings,
  RequestedOutputId,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { buildRatingsFromCurve } from "./curve-rating";
import { clamp, round1 } from "./math";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD =
  "exact_subassembly_source_plus_calculated_delta";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID =
  "wall.compatible_anchor_delta.extra_board_on_verified_lsf";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING =
  "Compatible measured-anchor delta active: DynEcho used the exact Rw source row as the base assembly and applied a bounded same-side added-board mass delta. STC, C, and Ctr stay unsupported unless a separate owner exists.";

type VerifiedAirborneCatalogMatch = NonNullable<ReturnType<typeof findVerifiedAirborneAssemblyMatch>>;

export type PostV1WallCompatibleAnchorDeltaResult = {
  applied: boolean;
  anchorSideSurfaceMassKgM2?: number;
  calculatedDeltaDb?: number;
  curve: TransmissionLossCurve;
  match: VerifiedAirborneCatalogMatch | null;
  predictedRwDb?: number;
  ratings: AssemblyRatings;
  removedLayer?: {
    materialId: string;
    side: "input_end" | "input_start";
    surfaceMassKgM2: number;
    thicknessMm: number;
  };
  warnings: string[];
};

function wallLabOutputsRequested(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => output === "Rw" || output === "STC" || output === "C" || output === "Ctr");
}

function isCompatibleAddedBoardLayer(layer: ResolvedLayer): boolean {
  return Boolean(
    layer.material.category === "finish" &&
      layer.material.tags.includes("board") &&
      layer.material.acoustic?.behavior === "panel_leaf" &&
      layer.thicknessMm >= 9 &&
      layer.thicknessMm <= 16 &&
      layer.surfaceMassKgM2 >= 6
  );
}

function contiguousLeafSurfaceMass(
  layers: readonly ResolvedLayer[],
  side: "input_end" | "input_start"
): number {
  const ordered = side === "input_start" ? layers : [...layers].reverse();
  let mass = 0;

  for (const layer of ordered) {
    if (layer.material.category === "gap" || layer.material.category === "insulation") {
      break;
    }

    if (layer.material.acoustic?.behavior !== "panel_leaf" && !layer.material.tags.includes("board")) {
      break;
    }

    mass += layer.surfaceMassKgM2;
  }

  return round1(mass);
}

function shiftCurveToRw(
  curve: TransmissionLossCurve,
  targetRwDb: number,
  context: AirborneContext | null | undefined
): { curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let shiftedCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  let shiftedRatings = buildRatingsFromCurve(
    shiftedCurve.frequenciesHz,
    shiftedCurve.transmissionLossDb,
    context
  );

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const delta = targetRwDb - shiftedRatings.iso717.Rw;
    if (Math.abs(delta) < 0.05) {
      break;
    }

    shiftedCurve = {
      frequenciesHz: [...shiftedCurve.frequenciesHz],
      transmissionLossDb: shiftedCurve.transmissionLossDb.map((value) => clamp(value + delta, 0, 95))
    };
    shiftedRatings = buildRatingsFromCurve(
      shiftedCurve.frequenciesHz,
      shiftedCurve.transmissionLossDb,
      context
    );
  }

  return {
    curve: shiftedCurve,
    ratings: shiftedRatings
  };
}

function buildCandidate(input: {
  context: AirborneContext | null | undefined;
  curve: TransmissionLossCurve;
  layers: readonly ResolvedLayer[];
  removeIndex: number;
  side: "input_end" | "input_start";
}): PostV1WallCompatibleAnchorDeltaResult | null {
  const removedLayer = input.layers[input.removeIndex];
  if (!removedLayer || !isCompatibleAddedBoardLayer(removedLayer)) {
    return null;
  }

  const reducedLayers = input.layers.filter((_, index) => index !== input.removeIndex);
  const match = findVerifiedAirborneAssemblyMatch(reducedLayers, input.context);
  if (!match || match.sourceMode !== "lab" || match.metricLabel !== "Rw") {
    return null;
  }

  const anchorSideSurfaceMassKgM2 = contiguousLeafSurfaceMass(reducedLayers, input.side);
  if (anchorSideSurfaceMassKgM2 <= 0) {
    return null;
  }

  const rawMassLawDeltaDb = 20 * Math.log10(
    (anchorSideSurfaceMassKgM2 + removedLayer.surfaceMassKgM2) / anchorSideSurfaceMassKgM2
  );
  const calculatedDeltaDb = Math.round(clamp(rawMassLawDeltaDb * 0.65, 0.5, 3));
  const predictedRwDb = round1(match.metricValue + calculatedDeltaDb);
  const shifted = shiftCurveToRw(input.curve, predictedRwDb, input.context);

  return {
    applied: true,
    anchorSideSurfaceMassKgM2,
    calculatedDeltaDb,
    curve: shifted.curve,
    match,
    predictedRwDb,
    ratings: shifted.ratings,
    removedLayer: {
      materialId: removedLayer.material.id,
      side: input.side,
      surfaceMassKgM2: round1(removedLayer.surfaceMassKgM2),
      thicknessMm: round1(removedLayer.thicknessMm)
    },
    warnings: [POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING]
  };
}

export function maybeBuildPostV1WallCompatibleAnchorDelta(input: {
  context?: AirborneContext | null;
  curve: TransmissionLossCurve;
  exactFullStackApplied: boolean;
  layers: readonly ResolvedLayer[];
  ratings: AssemblyRatings;
  targetOutputs: readonly RequestedOutputId[];
}): PostV1WallCompatibleAnchorDeltaResult {
  if (
    input.exactFullStackApplied ||
    input.context?.contextMode !== "element_lab" ||
    !wallLabOutputsRequested(input.targetOutputs) ||
    input.layers.some((layer) => Boolean(layer.floorRole)) ||
    input.layers.length < 2
  ) {
    return {
      applied: false,
      curve: input.curve,
      match: null,
      ratings: input.ratings,
      warnings: []
    };
  }

  const candidates = [
    buildCandidate({
      context: input.context,
      curve: input.curve,
      layers: input.layers,
      removeIndex: 0,
      side: "input_start"
    }),
    buildCandidate({
      context: input.context,
      curve: input.curve,
      layers: input.layers,
      removeIndex: input.layers.length - 1,
      side: "input_end"
    })
  ].filter((candidate): candidate is PostV1WallCompatibleAnchorDeltaResult => Boolean(candidate));

  return candidates[0] ?? {
    applied: false,
    curve: input.curve,
    match: null,
    ratings: input.ratings,
    warnings: []
  };
}
