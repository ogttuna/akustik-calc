import type {
  AirborneContext,
  AirborneResultBasis,
  AssemblyRatings,
  DynamicAirborneFamily,
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
  "Compatible measured-anchor delta active: DynEcho used the exact Rw source row as the base assembly and applied a bounded exterior added-board mass delta. STC, C, and Ctr stay unsupported unless a separate owner exists.";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING =
  "Compatible anchor-delta field/building adapter active: DynEcho used the measured-anchor direct curve plus bounded exterior board delta before applying the owned Gate I / Gate AR field-building adapter. Lab Rw is not relabelled as R'w, Dn,w, or DnT,w.";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING =
  "Compatible anchor-delta A-weighted field/building owner active: DynEcho used the same shifted direct curve and calculated ISO 717 C adapter term with the owned Gate I / Gate AR route. Field Dn,A / DnT,A and building Dn,A / DnT,A are calculated route values.";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD =
  "post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID =
  "wall.compatible_anchor_delta.calculated_lab_companions";

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING =
  "Compatible anchor-delta lab companion owner active: DynEcho rated STC, C, and Ctr from the shifted direct curve; the Knauf source row still owns Rw only and is not treated as measured companion evidence.";

type VerifiedAirborneCatalogMatch = NonNullable<ReturnType<typeof findVerifiedAirborneAssemblyMatch>>;

export const POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID = "knauf_lab_416889_primary_2026";
const MIXED_LAB_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);
const MIXED_LAB_SPECTRUM_COMPANIONS = new Set<RequestedOutputId>(["STC", "C", "Ctr"]);

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
  removedLayers?: readonly {
    materialId: string;
    side: "input_end" | "input_start";
    surfaceMassKgM2: number;
    thicknessMm: number;
  }[];
  warnings: string[];
};

function wallLabOutputsRequested(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) => output === "Rw" || output === "STC" || output === "C" || output === "Ctr");
}

function isElementLabContext(context: AirborneContext | null | undefined): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function isRwPlusCalculatedLabCompanionRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  if (targetOutputs.length === 0 || !targetOutputs.includes("Rw")) {
    return false;
  }

  if (!targetOutputs.some((output) => MIXED_LAB_SPECTRUM_COMPANIONS.has(output))) {
    return false;
  }

  return targetOutputs.every((output) => MIXED_LAB_COMPANION_OUTPUTS.has(output));
}

function wallFieldBuildingOutputsRequested(targetOutputs: readonly RequestedOutputId[]): boolean {
  return targetOutputs.some((output) =>
    output === "R'w" ||
    output === "Dn,w" ||
    output === "Dn,A" ||
    output === "DnT,w" ||
    output === "DnT,A"
  );
}

function wallAnchorDeltaOutputsRequested(targetOutputs: readonly RequestedOutputId[]): boolean {
  return wallLabOutputsRequested(targetOutputs) || wallFieldBuildingOutputsRequested(targetOutputs);
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
  removedLayers: readonly {
    index: number;
    side: "input_end" | "input_start";
  }[];
}): PostV1WallCompatibleAnchorDeltaResult | null {
  const uniqueRemovedLayerIndices = new Set(input.removedLayers.map((layer) => layer.index));
  if (uniqueRemovedLayerIndices.size !== input.removedLayers.length) {
    return null;
  }

  const removedLayers = input.removedLayers.map((layer) => {
    const removedLayer = input.layers[layer.index];
    return removedLayer && isCompatibleAddedBoardLayer(removedLayer)
      ? {
          layer: removedLayer,
          side: layer.side
        }
      : null;
  });
  if (removedLayers.some((layer) => layer === null)) {
    return null;
  }

  const reducedLayers = input.layers.filter((_, index) => !uniqueRemovedLayerIndices.has(index));
  const match = findVerifiedAirborneAssemblyMatch(reducedLayers, input.context);
  if (!match || match.sourceMode !== "lab" || match.metricLabel !== "Rw") {
    return null;
  }

  const addedMassBySide = new Map<"input_end" | "input_start", number>();
  for (const removedLayer of removedLayers) {
    if (!removedLayer) {
      return null;
    }
    addedMassBySide.set(
      removedLayer.side,
      (addedMassBySide.get(removedLayer.side) ?? 0) + removedLayer.layer.surfaceMassKgM2
    );
  }

  let calculatedDeltaDb = 0;
  let firstAnchorSideSurfaceMassKgM2 = 0;

  for (const [side, addedMassKgM2] of addedMassBySide) {
    const anchorSideSurfaceMassKgM2 = contiguousLeafSurfaceMass(reducedLayers, side);
    if (anchorSideSurfaceMassKgM2 <= 0) {
      return null;
    }

    if (firstAnchorSideSurfaceMassKgM2 <= 0) {
      firstAnchorSideSurfaceMassKgM2 = anchorSideSurfaceMassKgM2;
    }

    const rawMassLawDeltaDb = 20 * Math.log10(
      (anchorSideSurfaceMassKgM2 + addedMassKgM2) / anchorSideSurfaceMassKgM2
    );
    calculatedDeltaDb += Math.round(clamp(rawMassLawDeltaDb * 0.65, 0.5, 3));
  }

  calculatedDeltaDb = Math.round(clamp(calculatedDeltaDb, 0.5, 5));
  const predictedRwDb = round1(match.metricValue + calculatedDeltaDb);
  const shifted = shiftCurveToRw(input.curve, predictedRwDb, input.context);
  const removedLayerPins = removedLayers
    .filter((removedLayer): removedLayer is NonNullable<typeof removedLayer> => Boolean(removedLayer))
    .map((removedLayer) => ({
      materialId: removedLayer.layer.material.id,
      side: removedLayer.side,
      surfaceMassKgM2: round1(removedLayer.layer.surfaceMassKgM2),
      thicknessMm: round1(removedLayer.layer.thicknessMm)
    }));

  return {
    applied: true,
    anchorSideSurfaceMassKgM2: firstAnchorSideSurfaceMassKgM2,
    calculatedDeltaDb,
    curve: shifted.curve,
    match,
    predictedRwDb,
    ratings: shifted.ratings,
    removedLayer: removedLayerPins[0],
    removedLayers: removedLayerPins,
    warnings: [POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING]
  };
}

export function buildPostV1WallCompatibleAnchorDeltaDirectCurveBasis(input: {
  family?: DynamicAirborneFamily;
  result: PostV1WallCompatibleAnchorDeltaResult;
}): AirborneResultBasis {
  const anchorSourceId = input.result.match?.id;
  const removedLayers = input.result.removedLayers ?? (input.result.removedLayer ? [input.result.removedLayer] : []);
  const removedLayerSummary = removedLayers.length
    ? removedLayers
        .map((layer) =>
          `${layer.side}:${layer.materialId}:${layer.thicknessMm}mm:${layer.surfaceMassKgM2}kg/m2`
        )
        .join(", ")
    : "unspecified exterior board delta";

  return {
    ...(anchorSourceId ? { anchorSourceId } : {}),
    assumptions: [
      "compatible measured-anchor delta owns only the direct separating-element Rw curve before any field/building adapter is applied",
      "field/building outputs must be produced by Gate I / Gate AR from this direct curve; lab Rw is not relabelled",
      `bounded exterior board delta ${input.result.calculatedDeltaDb ?? 0} dB from ${removedLayerSummary}`,
      "STC, C, Ctr, Dn,A, DnT,A, and ASTM outputs remain outside this owner"
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 5,
    family: input.family ?? "stud_wall_system",
    frequencyBands: {
      bandSet: "post_v1_wall_compatible_anchor_delta_direct_curve",
      frequenciesHz: [...input.result.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "exactReducedStackSourceRow",
      "compatibleExteriorBoardDelta",
      "boundedAddedBoardMassDelta",
      "GateI_or_GateAR_field_building_adapter_owner"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

export function maybeBuildPostV1WallCompatibleAnchorDeltaLabCompanionBasis(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly result: PostV1WallCompatibleAnchorDeltaResult;
  readonly strategy?: string | null;
  readonly targetOutputs: readonly RequestedOutputId[];
}): AirborneResultBasis | null {
  const match = input.result.match;
  const removedLayers = input.result.removedLayers ?? (input.result.removedLayer ? [input.result.removedLayer] : []);
  const removedSides = new Set(removedLayers.map((layer) => layer.side));
  const hasStartExteriorBoardDelta = removedSides.has("input_start");
  const hasEndExteriorBoardDelta = removedSides.has("input_end");
  const hasOneSideExteriorBoardDelta =
    removedLayers.length === 1 &&
    removedSides.size === 1 &&
    (hasStartExteriorBoardDelta || hasEndExteriorBoardDelta);
  const hasPairedExteriorBoardDelta =
    removedLayers.length === 2 &&
    removedSides.size === 2 &&
    hasStartExteriorBoardDelta &&
    hasEndExteriorBoardDelta;

  if (
    input.dynamicFamily !== "stud_wall_system" ||
    !input.result.applied ||
    (!hasOneSideExteriorBoardDelta && !hasPairedExteriorBoardDelta) ||
    !isElementLabContext(input.airborneContext) ||
    !isRwPlusCalculatedLabCompanionRequest(input.targetOutputs) ||
    match?.id !== POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID ||
    match.sourceMode !== "lab" ||
    match.metricLabel !== "Rw" ||
    typeof match.metricValue !== "number" ||
    !Number.isFinite(match.metricValue) ||
    typeof input.result.predictedRwDb !== "number" ||
    !Number.isFinite(input.result.predictedRwDb)
  ) {
    return null;
  }

  const exteriorDeltaScope = hasOneSideExteriorBoardDelta
    ? "one-side exterior-board delta"
    : "paired exterior-board delta";

  return {
    anchorSourceId: match.id,
    assumptions: [
      `Compatible reduced-stack source ${match.id} owns Rw ${match.metricValue.toFixed(1)} dB before the bounded exterior-board delta.`,
      `Bounded ${exteriorDeltaScope} ${input.result.calculatedDeltaDb ?? 0} dB sets the direct curve to Rw ${input.result.predictedRwDb.toFixed(1)} dB.`,
      "STC, C, and Ctr are calculated from that shifted direct transmission-loss curve and the rating adapters.",
      "The mixed answer is not promoted as measured companion evidence because the source row reports Rw only.",
      "Field, building, A-weighted, and ASTM impact outputs remain separate route owners.",
      `current dynamic strategy remains ${input.strategy ?? "stud_surrogate_blend+framed_wall_calibration"}`
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    family: "stud_wall_system",
    frequencyBands:
      input.result.curve.frequenciesHz.length > 0
        ? {
            bandSet: "post_v1_wall_compatible_anchor_delta_lab_companion_curve",
            frequenciesHz: [...input.result.curve.frequenciesHz]
          }
        : undefined,
    kind: "airborne_physics_prediction",
    measurementStandard: "source_report",
    method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "exactReducedStackSourceRow:Rw",
      "compatibleExteriorBoardDelta",
      hasOneSideExteriorBoardDelta ? "oneSideCompatibleExteriorBoardDelta" : "pairedCompatibleExteriorBoardDelta",
      "calculatedTransmissionLossCurve",
      "ISO717-1 C/Ctr rating adapter",
      "ASTM E413 STC rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
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
    !wallAnchorDeltaOutputsRequested(input.targetOutputs) ||
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
      removedLayers: [{ index: 0, side: "input_start" }]
    }),
    buildCandidate({
      context: input.context,
      curve: input.curve,
      layers: input.layers,
      removedLayers: [{ index: input.layers.length - 1, side: "input_end" }]
    }),
    buildCandidate({
      context: input.context,
      curve: input.curve,
      layers: input.layers,
      removedLayers: [
        { index: 0, side: "input_start" },
        { index: input.layers.length - 1, side: "input_end" }
      ]
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
