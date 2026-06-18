import type {
  AirborneResultBasis,
  DynamicAirborneFamily,
  TransmissionLossCurve
} from "@dynecho/shared";

export const POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD =
  "post_v1_wall_advanced_wall_source_absent_field_building_direct_curve";

export const POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID =
  "wall.advanced_wall_source_absent_field_building_adapter_owner";

export const POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_ADAPTER_WARNING =
  "Advanced-wall source-absent field/building adapter active: DynEcho used the Gate AY direct TL curve before applying the owned Gate I / Gate AR adapter. Lab Rw, STC, C, and Ctr are not relabelled as R'w, Dn,w, Dn,A, DnT,w, or DnT,A.";

export const POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_WARNING =
  "Advanced-wall source-absent lab-companion basis-integrity active: DynEcho published lab Rw, STC, C, and Ctr from the Gate AY lab basis while field/building outputs stayed on Gate I / Gate AR.";

export function buildAdvancedWallSourceAbsentFieldBuildingDirectCurveBasis(input: {
  readonly family?: DynamicAirborneFamily;
  readonly sourceBasis: AirborneResultBasis;
  readonly transmissionLossCurve: TransmissionLossCurve;
}): AirborneResultBasis {
  return {
    assumptions: [
      "Gate AY advanced-wall source-absent runtime owns the direct separating-element curve before field/building adaptation.",
      "Gate I / Gate AR must calculate field/building outputs from explicit room, area, and flanking context.",
      "Lab Rw, STC, C, and Ctr are not relabelled as R'w, Dn,w, Dn,A, DnT,w, or DnT,A.",
      "Missing advanced-wall physical inputs, missing field/building context, exact-source precedence, existing owned delegates, impact metrics, OITC, and source crawling stay outside this owner.",
      ...input.sourceBasis.assumptions
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: input.sourceBasis.curveBasis,
    errorBudgetDb: Math.max(input.sourceBasis.errorBudgetDb ?? 8, 9),
    family: input.family ?? input.sourceBasis.family,
    frequencyBands: {
      bandSet: "post_v1_wall_advanced_wall_source_absent_field_building_direct_curve",
      frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    measurementStandard: input.sourceBasis.measurementStandard,
    method: POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [...(input.sourceBasis.missingSourceEvidence ?? [])],
    origin: "family_physics_prediction",
    propertyDefaults: [...input.sourceBasis.propertyDefaults],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...input.sourceBasis.requiredInputs,
      "advancedWall.wallSolverIntent=advanced_source_absent_wall",
      "GateAYAdvancedWallDirectTransmissionLossCurve",
      "advancedWall.fieldBuildingAdapterBoundary",
      "advancedWall.sourceAbsentErrorBudgetOwner",
      "GateI_or_GateAR_field_building_adapter_owner"
    ],
    toleranceClass: input.sourceBasis.toleranceClass
  };
}
