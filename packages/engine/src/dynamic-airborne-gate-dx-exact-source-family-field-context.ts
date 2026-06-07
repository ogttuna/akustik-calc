import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

export const GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD =
  "gate_dx_exact_source_family_calculated_field_context_runtime";

export const GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_exact_source_family_calculated_field_context";

export const GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_WARNING =
  "Exact-source wall family field request uses the calculated dynamic curve plus explicit field context; lab Rw is not relabelled as R'w, Dn,w, or DnT,w.";

const FIELD_CONTEXT_OUTPUTS = new Set<RequestedOutputId>([
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w"
]);

type CompleteFieldContext = AirborneContext & {
  contextMode: "field_between_rooms";
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
};

function hasCompleteFieldContext(
  context: AirborneContext | null | undefined
): context is CompleteFieldContext {
  return (
    context?.contextMode === "field_between_rooms" &&
    typeof context.panelWidthMm === "number" &&
    context.panelWidthMm > 0 &&
    typeof context.panelHeightMm === "number" &&
    context.panelHeightMm > 0 &&
    typeof context.receivingRoomVolumeM3 === "number" &&
    context.receivingRoomVolumeM3 > 0 &&
    typeof context.receivingRoomRt60S === "number" &&
    context.receivingRoomRt60S > 0
  );
}

function isFieldOnlyRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  return (
    targetOutputs.length > 0 &&
    targetOutputs.some((output) => FIELD_CONTEXT_OUTPUTS.has(output)) &&
    targetOutputs.every((output) => FIELD_CONTEXT_OUTPUTS.has(output))
  );
}

function familyRoute(input: {
  readonly context: AirborneContext;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly strategy?: string | null;
}): "lsf_knauf" | "masonry_porotherm" | null {
  if (
    input.dynamicFamily === "masonry_nonhomogeneous" &&
    input.strategy?.includes("porotherm_plastered_calibration")
  ) {
    return "masonry_porotherm";
  }

  if (
    input.dynamicFamily === "stud_wall_system" &&
    input.context.studType === "light_steel_stud" &&
    input.strategy?.includes("framed_wall_calibration")
  ) {
    return "lsf_knauf";
  }

  return null;
}

function frequencyBandsFrom(
  curve: TransmissionLossCurve | null | undefined
): AirborneResultBasis["frequencyBands"] {
  return curve && curve.frequenciesHz.length > 0
    ? {
        bandSet: "dynamic_airborne_delegate_grid",
        frequenciesHz: [...curve.frequenciesHz]
      }
    : undefined;
}

export function maybeBuildGateDXExactSourceFamilyFieldContextBasis(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly sourceAnchorApplied: boolean;
  readonly strategy?: string | null;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly transmissionLossCurve?: TransmissionLossCurve | null;
}): AirborneResultBasis | null {
  if (
    input.sourceAnchorApplied ||
    !hasCompleteFieldContext(input.airborneContext) ||
    !isFieldOnlyRequest(input.targetOutputs)
  ) {
    return null;
  }

  const route = familyRoute({
    context: input.airborneContext,
    dynamicFamily: input.dynamicFamily,
    strategy: input.strategy
  });

  if (!route) {
    return null;
  }

  const partitionAreaM2 = input.airborneContext.panelWidthMm * input.airborneContext.panelHeightMm / 1_000_000;
  const routeInputs =
    route === "lsf_knauf"
      ? [
          "airborneContext.studType:light_steel_stud",
          "airborneContext.connectionType:line_connection",
          "airborneContext.studSpacingMm"
        ]
      : [
          "visibleNonhomogeneousMasonryCore",
          "visiblePlasterFacingLayers"
        ];

  return {
    assumptions: [
      "field/apparent output is computed from the selected dynamic wall-family curve plus explicit field_between_rooms context.",
      "The Rw-only lab exact source for this family is not treated as a measured field source and is not relabelled as R'w, Dn,w, or DnT,w.",
      "If an explicit compatible lab-anchor field delta is available, that anchored route keeps precedence over this calculated field companion.",
      `field context uses ${partitionAreaM2.toFixed(2)} m2 partition area, ${input.airborneContext.receivingRoomVolumeM3.toFixed(1)} m3 receiving-room volume, and ${input.airborneContext.receivingRoomRt60S.toFixed(2)} s RT60.`,
      `current dynamic strategy remains ${input.strategy ?? "dynamic_wall_family_field_context"}`
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 10,
    family: input.dynamicFamily ?? undefined,
    frequencyBands: frequencyBandsFrom(input.transmissionLossCurve),
    kind: "airborne_physics_prediction",
    method: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: ["same_basis_field_source_absent"],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...routeInputs,
      "calculatedTransmissionLossCurve",
      "fieldContext.contextMode:field_between_rooms",
      "fieldContext.partitionAreaM2_or_panelWidthHeight",
      "fieldContext.receivingRoomVolumeM3",
      "fieldContext.receivingRoomRt60S",
      "fieldMetricAdapter:R'w/Dn,w/DnT,w"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}
