import {
  ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema,
  buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint,
  type AirborneContext,
  type AirborneResultBasis,
  type ProjectUserMeasuredWallAirborneFrequencyAnchor,
  type RequestedOutputId,
  type ResolvedLayer,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import { clamp, round1 } from "./math";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD =
  "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_compatible_delta_owner";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX =
  "Project/user measured wall airborne frequency compatible-delta active";
export const PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_METRIC_LABEL =
  "lab_airborne_frequency_curve_compatible_delta";

type LabAirborneCurveOutput = Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">;
type RemovedLayerSide = "input_end" | "input_start";
type RatingResult = ReturnType<typeof buildRatingsFromCurve>;

export type ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaMatch = {
  readonly id: string;
  readonly label: string;
  readonly metricLabel: typeof PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_METRIC_LABEL;
  readonly metricValue?: number;
  readonly sourceMode: "lab";
};

export type ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaResult = {
  readonly anchor?: ProjectUserMeasuredWallAirborneFrequencyAnchor;
  readonly applied: boolean;
  readonly basis?: AirborneResultBasis;
  readonly calculatedDeltaDb?: number;
  readonly curve?: TransmissionLossCurve;
  readonly match?: ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaMatch;
  readonly predictedRwDb?: number;
  readonly reducedRequestFingerprint?: string;
  readonly removedLayers: readonly {
    readonly materialId: string;
    readonly side: RemovedLayerSide;
    readonly surfaceMassKgM2: number;
    readonly thicknessMm: number;
  }[];
  readonly unsupportedOutputs: readonly RequestedOutputId[];
  readonly values: Partial<Record<LabAirborneCurveOutput, number>>;
  readonly warnings: readonly string[];
};

const LAB_AIRBORNE_CURVE_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "STC"]);
const TOPOLOGY_LAYER_INDEX_KEYS = [
  "sideALeafLayerIndices",
  "cavity1LayerIndices",
  "internalLeafLayerIndices",
  "cavity2LayerIndices",
  "sideBLeafLayerIndices"
] as const;

function requestedLabAirborneCurveOutputs(targetOutputs: readonly RequestedOutputId[]): LabAirborneCurveOutput[] {
  return targetOutputs.filter((output): output is LabAirborneCurveOutput =>
    LAB_AIRBORNE_CURVE_OUTPUTS.has(output)
  );
}

function isElementLabCurveRequest(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly targetOutputs: readonly RequestedOutputId[];
}): boolean {
  const requestedLabOutputs = requestedLabAirborneCurveOutputs(input.targetOutputs);

  return (
    requestedLabOutputs.length > 0 &&
    requestedLabOutputs.length === input.targetOutputs.length &&
    (!input.airborneContext?.contextMode || input.airborneContext.contextMode === "element_lab")
  );
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
  side: RemovedLayerSide
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

function sortFrequencyCurve(anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor): TransmissionLossCurve {
  const sortedBands = [...anchor.frequencyBands.values].sort((left, right) =>
    left.frequencyHz - right.frequencyHz
  );

  return {
    frequenciesHz: sortedBands.map((band) => band.frequencyHz),
    transmissionLossDb: sortedBands.map((band) => band.transmissionLossDb)
  };
}

function shiftCurveToRw(
  curve: TransmissionLossCurve,
  targetRwDb: number,
  context: AirborneContext | null | undefined
): { curve: TransmissionLossCurve; ratings: RatingResult } {
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

function measurementStandardForBasis(
  anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor
): AirborneResultBasis["measurementStandard"] {
  return anchor.measurementMethodStandard === "source_report_unknown"
    ? "source_report"
    : anchor.measurementMethodStandard;
}

function ratingStandardForBasis(
  anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor
): AirborneResultBasis["ratingStandard"] | undefined {
  const concreteStandards = anchor.ratingStandards.filter((standard) =>
    standard !== "source_report_unknown"
  );

  if (concreteStandards.length === 1) {
    return concreteStandards[0];
  }

  if (concreteStandards.length === 0 && anchor.ratingStandards.length === 1) {
    return "source_report";
  }

  return undefined;
}

function hasRequiredRatingStandard(
  anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor,
  output: LabAirborneCurveOutput
): boolean {
  switch (output) {
    case "C":
    case "Ctr":
    case "Rw":
      return anchor.ratingStandards.includes("ISO 717-1");
    case "STC":
      return anchor.ratingStandards.includes("ASTM E413");
  }
}

function ratingValueForOutput(input: {
  readonly output: LabAirborneCurveOutput;
  readonly ratings: RatingResult;
}): number | undefined {
  switch (input.output) {
    case "C":
      return input.ratings.iso717.C;
    case "Ctr":
      return input.ratings.iso717.Ctr;
    case "Rw":
      return input.ratings.iso717.Rw;
    case "STC":
      return input.ratings.astmE413.STC;
  }
}

function adjustedLayerIndices(
  indices: readonly number[] | undefined,
  removedIndices: ReadonlySet<number>
): number[] | undefined {
  if (!indices) {
    return undefined;
  }

  const adjusted = indices
    .filter((index) => !removedIndices.has(index))
    .map((index) => index - [...removedIndices].filter((removedIndex) => removedIndex < index).length);

  return adjusted.length > 0 ? adjusted : undefined;
}

function buildReducedContext(input: {
  readonly context?: AirborneContext | null;
  readonly removedIndices: ReadonlySet<number>;
}): AirborneContext | null {
  const topology = input.context?.wallTopology;
  if (!input.context || !topology) {
    return null;
  }

  const adjustedTopology = { ...topology };
  for (const key of TOPOLOGY_LAYER_INDEX_KEYS) {
    adjustedTopology[key] = adjustedLayerIndices(topology[key], input.removedIndices);
  }

  if (!adjustedTopology.sideALeafLayerIndices || !adjustedTopology.sideBLeafLayerIndices) {
    return null;
  }

  return {
    ...input.context,
    wallTopology: adjustedTopology
  };
}

function buildCandidate(input: {
  readonly context?: AirborneContext | null;
  readonly layers: readonly ResolvedLayer[];
  readonly removedLayers: readonly {
    readonly index: number;
    readonly side: RemovedLayerSide;
  }[];
}): {
  readonly addedMassBySide: ReadonlyMap<RemovedLayerSide, number>;
  readonly reducedContext: AirborneContext;
  readonly reducedLayers: readonly ResolvedLayer[];
  readonly removedLayerPins: readonly {
    readonly materialId: string;
    readonly side: RemovedLayerSide;
    readonly surfaceMassKgM2: number;
    readonly thicknessMm: number;
  }[];
} | null {
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
  const reducedContext = buildReducedContext({
    context: input.context,
    removedIndices: uniqueRemovedLayerIndices
  });
  if (!reducedContext) {
    return null;
  }

  const addedMassBySide = new Map<RemovedLayerSide, number>();
  const removedLayerPins = removedLayers
    .filter((removedLayer): removedLayer is NonNullable<typeof removedLayer> => Boolean(removedLayer))
    .map((removedLayer) => {
      addedMassBySide.set(
        removedLayer.side,
        (addedMassBySide.get(removedLayer.side) ?? 0) + removedLayer.layer.surfaceMassKgM2
      );

      return {
        materialId: removedLayer.layer.material.id,
        side: removedLayer.side,
        surfaceMassKgM2: round1(removedLayer.layer.surfaceMassKgM2),
        thicknessMm: round1(removedLayer.layer.thicknessMm)
      };
    });

  return {
    addedMassBySide,
    reducedContext,
    reducedLayers,
    removedLayerPins
  };
}

function buildCompatibleDeltaBasis(input: {
  readonly anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor;
  readonly calculatedDeltaDb: number;
  readonly predictedRwDb: number;
  readonly reducedRequestFingerprint: string;
  readonly removedLayers: readonly {
    readonly materialId: string;
    readonly side: RemovedLayerSide;
    readonly surfaceMassKgM2: number;
    readonly thicknessMm: number;
  }[];
  readonly shiftedCurve: TransmissionLossCurve;
  readonly supportedOutputs: readonly LabAirborneCurveOutput[];
}): AirborneResultBasis {
  const removedLayerSummary = input.removedLayers
    .map((layer) =>
      `${layer.side}:${layer.materialId}:${layer.thicknessMm}mm:${layer.surfaceMassKgM2}kg/m2`
    )
    .join(", ");

  return {
    anchorSourceId: input.anchor.id,
    assumptions: [
      "project/user measured wall airborne frequency anchor matches the reduced stack after removing only compatible exterior board layer changes",
      `bounded exterior board delta ${input.calculatedDeltaDb} dB from ${removedLayerSummary} sets the calculated curve to Rw ${input.predictedRwDb} dB`,
      "lab Rw, STC, C, and Ctr are derived from the shifted transmission-loss curve only when the anchor declares the required rating standard",
      "field, building, impact, OITC, scalar Rw aliases, source crawling, and non-board construction changes stay outside this owner",
      `reduced-stack fingerprint ${input.reducedRequestFingerprint}`
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 6,
    family: "stud_wall_system",
    frequencyBands: {
      bandSet: "post_v1_project_user_measured_wall_airborne_frequency_compatible_delta_curve",
      frequenciesHz: [...input.shiftedCurve.frequenciesHz]
    },
    kind: "airborne_anchored_delta",
    measurementStandard: measurementStandardForBasis(input.anchor),
    method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_subassembly_plus_calculated_delta",
    propertyDefaults: [],
    ratingStandard: ratingStandardForBasis(input.anchor),
    requiredInputs: [
      "airborneMeasuredFrequencySourceAnchors",
      "canonicalReducedWallAirborneFrequencyFingerprint",
      "compatibleExteriorBoardDelta",
      "boundedAddedBoardMassDelta",
      "explicitWallTopologyLayerIndices",
      ...input.supportedOutputs.map((output) => `targetOutput:${output}`)
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

function buildNoApplyResult(
  input: Partial<
    Pick<
      ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaResult,
      "removedLayers" | "unsupportedOutputs" | "warnings"
    >
  > = {}
): ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaResult {
  return {
    applied: false,
    removedLayers: input.removedLayers ?? [],
    unsupportedOutputs: input.unsupportedOutputs ?? [],
    values: {},
    warnings: input.warnings ?? []
  };
}

export function maybeBuildProjectUserMeasuredWallAirborneFrequencyCompatibleDelta(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly anchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
  readonly compatibleAnchorDeltaAlreadyApplied: boolean;
  readonly exactFullStackAlreadyApplied: boolean;
  readonly resolvedLayers: readonly ResolvedLayer[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): ProjectUserMeasuredWallAirborneFrequencyCompatibleDeltaResult {
  const requestedOutputs = requestedLabAirborneCurveOutputs(input.targetOutputs);

  if (
    !input.anchors?.length ||
    input.exactFullStackAlreadyApplied ||
    input.compatibleAnchorDeltaAlreadyApplied ||
    input.resolvedLayers.length < 2 ||
    !isElementLabCurveRequest({
      airborneContext: input.airborneContext,
      targetOutputs: input.targetOutputs
    })
  ) {
    return buildNoApplyResult();
  }

  const candidates = [
    buildCandidate({
      context: input.airborneContext,
      layers: input.resolvedLayers,
      removedLayers: [{ index: 0, side: "input_start" }]
    }),
    buildCandidate({
      context: input.airborneContext,
      layers: input.resolvedLayers,
      removedLayers: [{ index: input.resolvedLayers.length - 1, side: "input_end" }]
    }),
    buildCandidate({
      context: input.airborneContext,
      layers: input.resolvedLayers,
      removedLayers: [
        { index: 0, side: "input_start" },
        { index: input.resolvedLayers.length - 1, side: "input_end" }
      ]
    })
  ].filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));

  for (const candidate of candidates) {
    const reducedSnapshot = buildProjectUserMeasuredWallRwRequestSnapshot({
      airborneContext: candidate.reducedContext,
      resolvedLayers: candidate.reducedLayers
    });
    const matches = input.anchors
      .map((anchor) => ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(anchor))
      .filter((parsed): parsed is { success: true; data: ProjectUserMeasuredWallAirborneFrequencyAnchor } => parsed.success)
      .map((parsed) => {
        const reducedRequestFingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
          curveBasis: parsed.data.curveBasis,
          frequencyBands: parsed.data.frequencyBands,
          inputBasis: parsed.data.inputBasis,
          measurementMethodStandard: parsed.data.measurementMethodStandard,
          metricBasis: parsed.data.metricBasis,
          metricFamily: parsed.data.metricFamily,
          ratingStandards: parsed.data.ratingStandards,
          snapshot: reducedSnapshot,
          sourceMode: parsed.data.sourceMode === "lab" ? parsed.data.sourceMode : undefined
        });

        return {
          anchor: parsed.data,
          reducedRequestFingerprint
        };
      })
      .filter(({ anchor, reducedRequestFingerprint }) => anchor.fingerprint === reducedRequestFingerprint);

    if (matches.length > 1) {
      return buildNoApplyResult({
        removedLayers: candidate.removedLayerPins,
        unsupportedOutputs: requestedOutputs,
        warnings: [
          "Project/user measured wall airborne frequency compatible-delta found multiple active reduced-stack anchors for the same element-lab wall request; DynEcho kept the requested lab outputs unsupported until the conflict is resolved."
        ]
      });
    }

    if (matches.length !== 1) {
      continue;
    }

    const { anchor, reducedRequestFingerprint } = matches[0];
    const anchorCurve = sortFrequencyCurve(anchor);
    const anchorRatings = buildRatingsFromCurve(anchorCurve.frequenciesHz, anchorCurve.transmissionLossDb);
    let calculatedDeltaDb = 0;

    for (const [side, addedMassKgM2] of candidate.addedMassBySide) {
      const anchorSideSurfaceMassKgM2 = contiguousLeafSurfaceMass(candidate.reducedLayers, side);
      if (anchorSideSurfaceMassKgM2 <= 0) {
        return buildNoApplyResult();
      }

      const rawMassLawDeltaDb = 20 * Math.log10(
        (anchorSideSurfaceMassKgM2 + addedMassKgM2) / anchorSideSurfaceMassKgM2
      );
      calculatedDeltaDb += Math.round(clamp(rawMassLawDeltaDb * 0.65, 0.5, 3));
    }

    calculatedDeltaDb = Math.round(clamp(calculatedDeltaDb, 0.5, 5));
    const predictedRwDb = round1(anchorRatings.iso717.Rw + calculatedDeltaDb);
    const shifted = shiftCurveToRw(anchorCurve, predictedRwDb, candidate.reducedContext);
    const unsupportedOutputs: RequestedOutputId[] = [];
    const supportedOutputs: LabAirborneCurveOutput[] = [];
    const values: Partial<Record<LabAirborneCurveOutput, number>> = {};

    for (const output of requestedOutputs) {
      const value = ratingValueForOutput({ output, ratings: shifted.ratings });

      if (
        hasRequiredRatingStandard(anchor, output) &&
        typeof value === "number" &&
        Number.isFinite(value)
      ) {
        supportedOutputs.push(output);
        values[output] = round1(value);
      } else {
        unsupportedOutputs.push(output);
      }
    }

    const missingStandardWarning = unsupportedOutputs.length > 0
      ? `Project/user measured wall airborne frequency compatible-delta matched ${anchor.sourceLabel}, but ${unsupportedOutputs.join(", ")} stayed unsupported because the anchor does not declare the required rating standard basis.`
      : null;

    if (supportedOutputs.length === 0) {
      return buildNoApplyResult({
        removedLayers: candidate.removedLayerPins,
        unsupportedOutputs,
        warnings: missingStandardWarning ? [missingStandardWarning] : []
      });
    }

    const basis = buildCompatibleDeltaBasis({
      anchor,
      calculatedDeltaDb,
      predictedRwDb,
      reducedRequestFingerprint,
      removedLayers: candidate.removedLayerPins,
      shiftedCurve: shifted.curve,
      supportedOutputs
    });
    const publishedValues = supportedOutputs
      .map((output) => `${output} ${values[output]} dB`)
      .join(", ");

    return {
      anchor,
      applied: true,
      basis,
      calculatedDeltaDb,
      curve: shifted.curve,
      match: {
        id: anchor.id,
        label: anchor.sourceLabel,
        metricLabel: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_METRIC_LABEL,
        metricValue: values.Rw,
        sourceMode: "lab"
      },
      predictedRwDb,
      reducedRequestFingerprint,
      removedLayers: candidate.removedLayerPins,
      unsupportedOutputs,
      values,
      warnings: [
        `${POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_COMPATIBLE_DELTA_WARNING_PREFIX}: ${anchor.sourceLabel} matched reduced stack ${reducedRequestFingerprint}; DynEcho applied a bounded ${calculatedDeltaDb} dB exterior-board delta and rated the calculated lab TL curve as ${publishedValues}.`,
        ...(missingStandardWarning ? [missingStandardWarning] : [])
      ]
    };
  }

  return buildNoApplyResult();
}
