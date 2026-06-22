import {
  ActiveProjectUserVerifiedCalculatedAnchorSchema,
  buildProjectUserVerifiedCalculatedAnchorFingerprint,
  type AirborneResultBasis,
  type ProjectUserVerifiedCalculatedAnchor,
  type ProjectUserVerifiedCalculatedAnchorRequestContext,
  type ProjectUserVerifiedCalculatedAnchorValue,
  type RequestedOutputId
} from "@dynecho/shared";

import { round1 } from "./math";

export const POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD =
  "post_v1_project_user_verified_calculated_exact_bridge";
export const POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_WARNING_PREFIX =
  "Project/user verified calculated exact anchor active";

type UserVerifiedCalculatedExactLabOutput = Extract<RequestedOutputId, "C" | "Ctr" | "Rw" | "STC">;

export type ProjectUserVerifiedCalculatedExactBridgeMatch = {
  readonly anchorKind: "user_verified_calculated_result";
  readonly id: string;
  readonly label: string;
  readonly metricLabels: readonly UserVerifiedCalculatedExactLabOutput[];
};

export type ProjectUserVerifiedCalculatedExactBridgeResult = {
  readonly anchor?: ProjectUserVerifiedCalculatedAnchor;
  readonly applied: boolean;
  readonly basis?: AirborneResultBasis;
  readonly match?: ProjectUserVerifiedCalculatedExactBridgeMatch;
  readonly requestFingerprint?: string;
  readonly unsupportedOutputs: readonly RequestedOutputId[];
  readonly values: Partial<Record<UserVerifiedCalculatedExactLabOutput, number>>;
  readonly warnings: readonly string[];
};

const USER_VERIFIED_CALCULATED_LAB_OUTPUTS = new Set<RequestedOutputId>(["C", "Ctr", "Rw", "STC"]);

function buildNoApplyResult(
  input: Partial<Pick<ProjectUserVerifiedCalculatedExactBridgeResult, "unsupportedOutputs" | "warnings">> = {}
): ProjectUserVerifiedCalculatedExactBridgeResult {
  return {
    applied: false,
    unsupportedOutputs: input.unsupportedOutputs ?? [],
    values: {},
    warnings: input.warnings ?? []
  };
}

function requestedLabOutputs(targetOutputs: readonly RequestedOutputId[]): UserVerifiedCalculatedExactLabOutput[] {
  return targetOutputs.filter((output): output is UserVerifiedCalculatedExactLabOutput =>
    USER_VERIFIED_CALCULATED_LAB_OUTPUTS.has(output)
  );
}

function isElementLabWallRequest(input: {
  readonly requestContext: ProjectUserVerifiedCalculatedAnchorRequestContext;
  readonly targetOutputs: readonly RequestedOutputId[];
}): boolean {
  const labOutputs = requestedLabOutputs(input.targetOutputs);

  return (
    input.requestContext.mode === "wall" &&
    labOutputs.length > 0 &&
    labOutputs.length === input.targetOutputs.length &&
    (
      !input.requestContext.airborneContext?.contextMode ||
      input.requestContext.airborneContext.contextMode === "element_lab"
    )
  );
}

function valueForOutput(
  anchor: ProjectUserVerifiedCalculatedAnchor,
  output: UserVerifiedCalculatedExactLabOutput
): ProjectUserVerifiedCalculatedAnchorValue | undefined {
  return anchor.values.find((value) =>
    value.metric === output &&
    value.metricBasis === "airborne_lab" &&
    value.provenance.outputStatus === "supported" &&
    anchor.resultBasisTrace.supportedTargetOutputs.includes(output)
  );
}

function buildExactBasis(input: {
  readonly anchor: ProjectUserVerifiedCalculatedAnchor;
  readonly requestFingerprint: string;
  readonly supportedOutputs: readonly UserVerifiedCalculatedExactLabOutput[];
}): AirborneResultBasis {
  return {
    anchorSourceId: input.anchor.id,
    assumptions: [
      "user-verified calculated anchor fingerprint exactly matches the current element-lab wall request",
      "DynEcho publishes only the stored user-confirmed calculated output values on their stored metric basis",
      "measured/source provenance, field/building adapters, impact aliases, compatible deltas, and unstored companion outputs stay outside this exact owner"
    ],
    curveBasis: "calculated_single_number_estimate",
    kind: "airborne_user_verified_calculated_exact",
    measurementStandard: "none",
    method: POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "user_verified_calculated_exact",
    propertyDefaults: [],
    ratingStandard: "none",
    requiredInputs: [
      "airborneUserVerifiedCalculatedAnchors",
      "canonicalUserVerifiedCalculatedFingerprint",
      ...input.supportedOutputs.map((output) => `targetOutput:${output}`)
    ],
    toleranceClass: "user_verified_calculated_exact"
  };
}

// Agent coordination, 2026-06-22:
// This bridge is intentionally standalone until D1c wires it into
// calculateAssembly. Do not route it through measured/source anchor lanes.
export function maybeBuildProjectUserVerifiedCalculatedExactBridge(input: {
  readonly anchors?: readonly ProjectUserVerifiedCalculatedAnchor[] | null;
  readonly compatibleAnchorDeltaAlreadyApplied: boolean;
  readonly exactFullStackAlreadyApplied: boolean;
  readonly requestContext?: ProjectUserVerifiedCalculatedAnchorRequestContext | null;
  readonly targetOutputs: readonly RequestedOutputId[];
}): ProjectUserVerifiedCalculatedExactBridgeResult {
  if (
    !input.anchors?.length ||
    !input.requestContext ||
    input.exactFullStackAlreadyApplied ||
    input.compatibleAnchorDeltaAlreadyApplied ||
    !isElementLabWallRequest({
      requestContext: input.requestContext,
      targetOutputs: input.targetOutputs
    })
  ) {
    return buildNoApplyResult();
  }

  const requestFingerprint = buildProjectUserVerifiedCalculatedAnchorFingerprint({
    requestContext: input.requestContext
  });
  const matches = input.anchors
    .map((anchor) => ActiveProjectUserVerifiedCalculatedAnchorSchema.safeParse(anchor))
    .filter((parsed): parsed is { success: true; data: ProjectUserVerifiedCalculatedAnchor } => parsed.success)
    .map((parsed) => parsed.data)
    .filter((anchor) => anchor.fingerprint === requestFingerprint);
  const requestedOutputs = requestedLabOutputs(input.targetOutputs);

  if (matches.length !== 1) {
    return buildNoApplyResult({
      unsupportedOutputs: matches.length > 1 ? requestedOutputs : [],
      warnings: matches.length > 1
        ? [
            "Project/user verified calculated exact bridge found multiple active anchors for the same element-lab wall request; DynEcho kept the requested lab outputs unsupported until the conflict is resolved."
          ]
        : []
    });
  }

  const anchor = matches[0]!;
  const unsupportedOutputs: RequestedOutputId[] = [];
  const supportedOutputs: UserVerifiedCalculatedExactLabOutput[] = [];
  const values: Partial<Record<UserVerifiedCalculatedExactLabOutput, number>> = {};

  for (const output of requestedOutputs) {
    const storedValue = valueForOutput(anchor, output);

    if (storedValue && Number.isFinite(storedValue.valueDb)) {
      supportedOutputs.push(output);
      values[output] = round1(storedValue.valueDb);
    } else {
      unsupportedOutputs.push(output);
    }
  }

  if (supportedOutputs.length === 0) {
    return buildNoApplyResult({
      unsupportedOutputs,
      warnings: [
        `Project/user verified calculated exact bridge matched ${anchor.name}, but none of the requested lab outputs were stored on the anchor.`
      ]
    });
  }

  const basis = buildExactBasis({
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
    match: {
      anchorKind: "user_verified_calculated_result",
      id: anchor.id,
      label: anchor.name,
      metricLabels: supportedOutputs
    },
    requestFingerprint,
    unsupportedOutputs,
    values,
    warnings: [
      `${POST_V1_PROJECT_USER_VERIFIED_CALCULATED_EXACT_BRIDGE_WARNING_PREFIX}: ${anchor.name} matched ${requestFingerprint}; DynEcho used stored user-verified calculated values ${publishedValues}.`,
      ...(unsupportedOutputs.length > 0
        ? [
            `Project/user verified calculated exact bridge matched ${anchor.name}, but ${unsupportedOutputs.join(", ")} stayed outside the exact answer because those outputs were not stored with airborne_lab basis.`
          ]
        : [])
    ]
  };
}
