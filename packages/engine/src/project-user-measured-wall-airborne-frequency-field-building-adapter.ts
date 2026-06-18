import type {
  AirborneResultBasis,
  DynamicAirborneFamily,
  TransmissionLossCurve
} from "@dynecho/shared";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD =
  "post_v1_project_user_measured_wall_airborne_frequency_field_building_direct_curve";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID =
  "project_user_measured_wall_airborne_frequency_field_building_adapter_owner";

export const POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_ADAPTER_WARNING =
  "Project/user measured wall airborne frequency field/building adapter active: DynEcho used the exact or compatible measured direct TL curve before applying the owned Gate I / Gate AR adapter. Lab Rw, STC, C, and Ctr are not relabelled as R'w, Dn,w, Dn,A, DnT,w, or DnT,A.";

export type ProjectUserMeasuredWallAirborneFrequencyFieldBuildingSourceKind =
  | "compatible_delta"
  | "exact_full_stack";

export function buildProjectUserMeasuredWallAirborneFrequencyFieldBuildingDirectCurveBasis(input: {
  readonly family?: DynamicAirborneFamily;
  readonly sourceBasis: AirborneResultBasis;
  readonly sourceKind: ProjectUserMeasuredWallAirborneFrequencyFieldBuildingSourceKind;
  readonly sourceLabel?: string;
  readonly transmissionLossCurve: TransmissionLossCurve;
}): AirborneResultBasis {
  const sourceDescription = input.sourceKind === "exact_full_stack"
    ? "exact full-stack measured TL curve"
    : "compatible exterior-board measured TL curve plus bounded delta";
  const sourceId =
    input.sourceBasis.exactSourceId ??
    input.sourceBasis.anchorSourceId;
  const sourceIdInput = sourceId
    ? [`projectUserMeasuredFrequencySourceId:${sourceId}`]
    : [];

  return {
    ...(input.sourceBasis.anchorSourceId ? { anchorSourceId: input.sourceBasis.anchorSourceId } : {}),
    ...(input.sourceBasis.exactSourceId ? { exactSourceId: input.sourceBasis.exactSourceId } : {}),
    assumptions: [
      `project/user measured wall airborne frequency ${sourceDescription} owns the direct separating-element curve before field/building adaptation`,
      "Gate I / Gate AR must calculate field/building outputs from explicit room, area, and flanking context",
      "lab Rw, STC, C, and Ctr are not relabelled as R'w, Dn,w, Dn,A, DnT,w, or DnT,A",
      "scalar Rw anchors, impact metrics, OITC, missing context, ambiguous anchors, and non-board compatible-delta changes stay outside this owner",
      `source curve label: ${input.sourceLabel ?? sourceId ?? "active project/user measured frequency curve"}`,
      ...input.sourceBasis.assumptions
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: input.sourceBasis.curveBasis,
    errorBudgetDb: input.sourceKind === "exact_full_stack" ? 7 : 8,
    family: input.family ?? input.sourceBasis.family,
    frequencyBands: {
      bandSet: "post_v1_project_user_measured_wall_airborne_frequency_field_building_direct_curve",
      frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    measurementStandard: input.sourceBasis.measurementStandard,
    method: POST_V1_PROJECT_USER_MEASURED_WALL_AIRBORNE_FREQUENCY_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...input.sourceBasis.requiredInputs,
      ...sourceIdInput,
      `projectUserMeasuredFrequencyFieldBuildingSource:${input.sourceKind}`,
      "projectUserMeasuredFrequencyDirectTransmissionLossCurve",
      "GateI_or_GateAR_field_building_adapter_owner"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}
