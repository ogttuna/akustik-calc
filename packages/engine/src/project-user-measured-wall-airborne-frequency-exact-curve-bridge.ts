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
import { round1 } from "./math";
import { buildProjectUserMeasuredWallRwRequestSnapshot } from "./project-user-measured-wall-rw-exact-bridge";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD =
  "post_v1_project_user_measured_wall_airborne_frequency_exact_curve_bridge";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_SELECTED_CANDIDATE_ID =
  "candidate_blocked_rockwool_exact_source";
export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX =
  "Project/user measured wall airborne frequency exact curve active";
export const PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_METRIC_LABEL =
  "lab_airborne_frequency_curve";

type LabAirborneCurveOutput = Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">;

export type ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeMatch = {
  readonly id: string;
  readonly label: string;
  readonly metricLabel: typeof PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_METRIC_LABEL;
  readonly metricValue?: number;
  readonly sourceMode: "lab";
};

export type ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeResult = {
  readonly anchor?: ProjectUserMeasuredWallAirborneFrequencyAnchor;
  readonly applied: boolean;
  readonly basis?: AirborneResultBasis;
  readonly curve?: TransmissionLossCurve;
  readonly match?: ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeMatch;
  readonly requestFingerprint?: string;
  readonly unsupportedOutputs: readonly RequestedOutputId[];
  readonly values: Partial<Record<LabAirborneCurveOutput, number>>;
  readonly warnings: readonly string[];
};

const LAB_AIRBORNE_CURVE_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "STC"]);

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

function sortFrequencyCurve(anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor): TransmissionLossCurve {
  const sortedBands = [...anchor.frequencyBands.values].sort((left, right) =>
    left.frequencyHz - right.frequencyHz
  );

  return {
    frequenciesHz: sortedBands.map((band) => band.frequencyHz),
    transmissionLossDb: sortedBands.map((band) => band.transmissionLossDb)
  };
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
  readonly ratings: ReturnType<typeof buildRatingsFromCurve>;
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

function buildExactCurveBasis(input: {
  readonly anchor: ProjectUserMeasuredWallAirborneFrequencyAnchor;
  readonly requestFingerprint: string;
  readonly supportedOutputs: readonly LabAirborneCurveOutput[];
}): AirborneResultBasis {
  return {
    assumptions: [
      "project/user measured wall airborne frequency anchor fingerprint exactly matches the current element-lab wall request",
      "lab Rw, STC, C, and Ctr are derived from the measured transmission-loss curve only when the anchor declares the required rating standard",
      "field, building, impact, scalar Rw aliases, compatible deltas, and near-match construction reuse stay outside this exact curve owner"
    ],
    curveBasis: "measured_frequency_curve",
    exactSourceId: input.anchor.id,
    frequencyBands: {
      bandSet: input.anchor.frequencyBands.bandSet,
      frequenciesHz: sortFrequencyCurve(input.anchor).frequenciesHz
    },
    kind: "airborne_measured_exact",
    measurementStandard: measurementStandardForBasis(input.anchor),
    method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "measured_exact_full_stack",
    propertyDefaults: [],
    ratingStandard: ratingStandardForBasis(input.anchor),
    requiredInputs: [
      "airborneMeasuredFrequencySourceAnchors",
      "canonicalWallAirborneFrequencyFingerprint",
      ...input.supportedOutputs.map((output) => `targetOutput:${output}`)
    ],
    toleranceClass: "exact_source"
  };
}

function buildNoApplyResult(
  input: Partial<Pick<ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeResult, "unsupportedOutputs" | "warnings">> = {}
): ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeResult {
  return {
    applied: false,
    unsupportedOutputs: input.unsupportedOutputs ?? [],
    values: {},
    warnings: input.warnings ?? []
  };
}

export function maybeBuildProjectUserMeasuredWallAirborneFrequencyExactCurveBridge(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly anchors?: readonly ProjectUserMeasuredWallAirborneFrequencyAnchor[] | null;
  readonly compatibleAnchorDeltaAlreadyApplied: boolean;
  readonly exactFullStackAlreadyApplied: boolean;
  readonly resolvedLayers: readonly ResolvedLayer[];
  readonly targetOutputs: readonly RequestedOutputId[];
}): ProjectUserMeasuredWallAirborneFrequencyExactCurveBridgeResult {
  const requestedOutputs = requestedLabAirborneCurveOutputs(input.targetOutputs);

  if (
    !input.anchors?.length ||
    input.exactFullStackAlreadyApplied ||
    input.compatibleAnchorDeltaAlreadyApplied ||
    !isElementLabCurveRequest({
      airborneContext: input.airborneContext,
      targetOutputs: input.targetOutputs
    })
  ) {
    return buildNoApplyResult();
  }

  const snapshot = buildProjectUserMeasuredWallRwRequestSnapshot({
    airborneContext: input.airborneContext,
    resolvedLayers: input.resolvedLayers
  });
  const matches = input.anchors
    .map((anchor) => ActiveProjectUserMeasuredWallAirborneFrequencyAnchorSchema.safeParse(anchor))
    .filter((parsed): parsed is { success: true; data: ProjectUserMeasuredWallAirborneFrequencyAnchor } => parsed.success)
    .map((parsed) => {
      const requestFingerprint = buildProjectUserMeasuredWallAirborneFrequencyAnchorFingerprint({
        curveBasis: parsed.data.curveBasis,
        frequencyBands: parsed.data.frequencyBands,
        inputBasis: parsed.data.inputBasis,
        measurementMethodStandard: parsed.data.measurementMethodStandard,
        metricBasis: parsed.data.metricBasis,
        metricFamily: parsed.data.metricFamily,
        ratingStandards: parsed.data.ratingStandards,
        snapshot,
        sourceMode: parsed.data.sourceMode === "lab" ? parsed.data.sourceMode : undefined
      });

      return {
        anchor: parsed.data,
        requestFingerprint
      };
    })
    .filter(({ anchor, requestFingerprint }) => anchor.fingerprint === requestFingerprint);

  if (matches.length !== 1) {
    return buildNoApplyResult({
      unsupportedOutputs: matches.length > 1 ? requestedOutputs : [],
      warnings: matches.length > 1
        ? [
            "Project/user measured wall airborne frequency exact curve bridge found multiple active anchors for the same element-lab wall request; DynEcho kept the requested lab outputs unsupported until the conflict is resolved."
          ]
        : []
    });
  }

  const { anchor, requestFingerprint } = matches[0];
  const curve = sortFrequencyCurve(anchor);
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb);
  const unsupportedOutputs: RequestedOutputId[] = [];
  const supportedOutputs: LabAirborneCurveOutput[] = [];
  const values: Partial<Record<LabAirborneCurveOutput, number>> = {};

  for (const output of requestedOutputs) {
    const value = ratingValueForOutput({ output, ratings });

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
    ? `Project/user measured wall airborne frequency exact curve matched ${anchor.sourceLabel}, but ${unsupportedOutputs.join(", ")} stayed unsupported because the anchor does not declare the required rating standard basis.`
    : null;

  if (supportedOutputs.length === 0) {
    return buildNoApplyResult({
      unsupportedOutputs,
      warnings: missingStandardWarning ? [missingStandardWarning] : []
    });
  }

  const basis = buildExactCurveBasis({
    anchor,
    requestFingerprint,
    supportedOutputs
  });
  const publishedValues = supportedOutputs
    .map((output) => `${output} ${values[output]} dB`)
    .join(", ");

  return {
    anchor,
    applied: true,
    basis,
    curve,
    match: {
      id: anchor.id,
      label: anchor.sourceLabel,
      metricLabel: PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_METRIC_LABEL,
      metricValue: values.Rw,
      sourceMode: "lab"
    },
    requestFingerprint,
    unsupportedOutputs,
    values,
    warnings: [
      `${POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_EXACT_CURVE_BRIDGE_WARNING_PREFIX}: ${anchor.sourceLabel} matched ${requestFingerprint}; DynEcho rated the measured lab TL curve as ${publishedValues}.`,
      ...(missingStandardWarning ? [missingStandardWarning] : [])
    ]
  };
}
