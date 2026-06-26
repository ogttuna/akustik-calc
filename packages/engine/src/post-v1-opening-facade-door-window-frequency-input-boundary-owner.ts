import {
  AirborneResultBasisSchema,
  type AirborneContext,
  type AirborneOpeningLeakElement,
  type AirborneResultBasis,
  type RequestedOutputId
} from "@dynecho/shared";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_PLAN =
  "post_v1_opening_facade_door_window_frequency_input_boundary_owner_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_STATUS =
  "post_v1_opening_facade_door_window_frequency_input_boundary_owner_landed_input_boundary_selected_coverage_refresh";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD =
  "post_v1_opening_facade_door_window_frequency_input_boundary_owner";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING =
  "Opening/facade door/window frequency-input boundary active: door, window, facade, and exterior-opening claims require explicit area, element type, frequency or rating basis, seal/leakage class, and facade/outdoor or room-normalization context before DynEcho widens beyond the owned Gate S/Gate AH element-lab route.";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS = [
  "hostWallAreaM2",
  "openingAreaM2",
  "openingElementType",
  "openingFrequencyBandsOrRatingBasis",
  "openingSealLeakageClass",
  "facadeOutdoorOrRoomNormalizationContext"
] as const;

export const POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES = [
  "genericDoorWindowFacadeScalarAlias",
  "labToFieldOrBuildingCopy",
  "oitcWithoutOutdoorIndoorSpectrumAdapter",
  "astmIsoMetricAlias",
  "impactMetricFallback",
  "broadSourceCrawl",
  "areaFreeCompositeTransmissionLoss",
  "targetOutputWidening"
] as const;

export type PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryStatus =
  | "complete_element_lab_route_preserved"
  | "needs_input"
  | "not_requested"
  | "unsupported_boundary";

export type PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult = {
  adjacentUnsupportedMetrics: readonly string[];
  basis: AirborneResultBasis | null;
  blockedOutputs: readonly RequestedOutputId[];
  missingPhysicalInputs: readonly string[];
  requiredPhysicalInputs: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS;
  shouldSuppressFieldBuildingRuntime: boolean;
  shouldSuppressOpeningLeakRuntime: boolean;
  status: PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryStatus;
  unsupportedBoundaries: typeof POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES;
  warning: string | null;
};

const FIELD_BUILDING_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "OITC",
  "R'w"
]);

const OPENING_FACADE_AFFECTED_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "OITC",
  "R'w",
  "Rw",
  "STC"
]);

function unique(items: readonly string[]): string[] {
  return [...new Set(items)];
}

function positive(value: number | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function known(value: string | undefined): boolean {
  return typeof value === "string" && value !== "unknown";
}

function isBoundaryRequested(airborneContext: AirborneContext | null | undefined): boolean {
  return airborneContext?.openingFacadeBoundaryIntent === "door_window_facade_frequency_input_boundary" ||
    airborneContext?.facadeOutdoorContext !== undefined ||
    (airborneContext?.openingLeakElements ?? []).some((opening) =>
      opening.elementType !== undefined || opening.frequencyBandSet !== undefined
    );
}

function hasFrequencyOrRatingBasis(opening: AirborneOpeningLeakElement): boolean {
  return opening.frequencyBandSet === "third_octave_100_3150" || known(opening.ratingBasis);
}

function missingPhysicalInputs(
  airborneContext: AirborneContext | null | undefined
): string[] {
  const missing: string[] = [];
  const openings = airborneContext?.openingLeakElements ?? [];

  if (!positive(airborneContext?.hostWallAreaM2)) {
    missing.push("hostWallAreaM2");
  }

  if (openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingElementType",
      "openingFrequencyBandsOrRatingBasis",
      "openingSealLeakageClass"
    );
  }

  for (const opening of openings) {
    if (!positive(opening.areaM2)) {
      missing.push("openingAreaM2");
    }
    if (!known(opening.elementType)) {
      missing.push("openingElementType");
    }
    if (!hasFrequencyOrRatingBasis(opening)) {
      missing.push("openingFrequencyBandsOrRatingBasis");
    }
    if (!known(opening.sealLeakageClass)) {
      missing.push("openingSealLeakageClass");
    }
  }

  if (!known(airborneContext?.facadeOutdoorContext)) {
    missing.push("facadeOutdoorOrRoomNormalizationContext");
  }

  return unique(missing);
}

function requestedAffectedOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => OPENING_FACADE_AFFECTED_OUTPUTS.has(output));
}

function requestedUnsupportedOutputs(targetOutputs: readonly RequestedOutputId[]): RequestedOutputId[] {
  return targetOutputs.filter((output) => FIELD_BUILDING_OUTPUTS.has(output));
}

function buildNeedsInputBasis(missing: readonly string[]): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "Door, window, facade, and exterior-opening requests are blocked until the explicit frequency-input boundary fields are present.",
      "DynEcho does not infer facade/window/door coverage from generic opening labels, nearby scalar ratings, or host-wall values."
    ],
    curveBasis: "no_curve",
    kind: "airborne_needs_input",
    method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
    missingPhysicalInputs: [...missing],
    origin: "needs_input",
    requiredInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS
    ]
  });
}

function buildUnsupportedBasis(blockedOutputs: readonly RequestedOutputId[]): AirborneResultBasis {
  return AirborneResultBasisSchema.parse({
    assumptions: [
      "The opening/facade door/window boundary owns required input capture only; field/building facade prediction and OITC-like outdoor-indoor ratings need separate adapters.",
      "Gate S/Gate AH element-lab Rw/STC can remain live for complete lab requests, but field/building and outdoor-indoor facade outputs are not promoted by this owner."
    ],
    curveBasis: "no_curve",
    kind: "airborne_unsupported",
    method: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_METHOD,
    missingPhysicalInputs: [],
    origin: "unsupported",
    requiredInputs: [
      ...POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
      `unsupportedOutputs:${blockedOutputs.join(",")}`
    ]
  });
}

export function maybeBuildPostV1OpeningFacadeDoorWindowFrequencyInputBoundary(
  input: {
    airborneContext?: AirborneContext | null;
    targetOutputs: readonly RequestedOutputId[];
  }
): PostV1OpeningFacadeDoorWindowFrequencyInputBoundaryResult | null {
  if (!isBoundaryRequested(input.airborneContext)) {
    return null;
  }

  const affectedOutputs = requestedAffectedOutputs(input.targetOutputs);
  const missing = missingPhysicalInputs(input.airborneContext);

  if (missing.length > 0) {
    return {
      adjacentUnsupportedMetrics: ["OITC"],
      basis: buildNeedsInputBasis(missing),
      blockedOutputs: affectedOutputs,
      missingPhysicalInputs: missing,
      requiredPhysicalInputs:
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
      shouldSuppressFieldBuildingRuntime: true,
      shouldSuppressOpeningLeakRuntime: true,
      status: "needs_input",
      unsupportedBoundaries:
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES,
      warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
    };
  }

  const unsupportedOutputs = requestedUnsupportedOutputs(input.targetOutputs);
  const outdoorFacadeUnsupported =
    input.airborneContext?.facadeOutdoorContext === "outdoor_indoor_facade";

  if (unsupportedOutputs.length > 0 || outdoorFacadeUnsupported) {
    const blockedOutputs = unsupportedOutputs.length > 0 ? unsupportedOutputs : affectedOutputs;

    return {
      adjacentUnsupportedMetrics: ["OITC"],
      basis: buildUnsupportedBasis(blockedOutputs),
      blockedOutputs,
      missingPhysicalInputs: [],
      requiredPhysicalInputs:
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
      shouldSuppressFieldBuildingRuntime: true,
      shouldSuppressOpeningLeakRuntime: outdoorFacadeUnsupported,
      status: "unsupported_boundary",
      unsupportedBoundaries:
        POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES,
      warning: POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_OWNER_WARNING
    };
  }

  return {
    adjacentUnsupportedMetrics: ["OITC"],
    basis: null,
    blockedOutputs: [],
    missingPhysicalInputs: [],
    requiredPhysicalInputs:
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_REQUIRED_INPUTS,
    shouldSuppressFieldBuildingRuntime: false,
    shouldSuppressOpeningLeakRuntime: false,
    status: "complete_element_lab_route_preserved",
    unsupportedBoundaries:
      POST_V1_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_UNSUPPORTED_BOUNDARIES,
    warning: null
  };
}
