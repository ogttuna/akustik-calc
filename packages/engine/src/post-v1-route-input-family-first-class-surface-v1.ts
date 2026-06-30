import {
  AcousticInputCompletenessSchema,
  type AcousticInputCompleteness,
  type AcousticInputFieldId,
  type AcousticInputRouteFamily,
  type AirborneContext,
  type ExactImpactSource,
  type ImpactFieldContext,
  type RequestedOutputId
} from "@dynecho/shared";

import { IMPACT_RATING_FREQS_THIRD } from "./impact-iso717";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_PLAN =
  "post_v1_route_input_family_first_class_surface_v1_plan";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_STATUS =
  "post_v1_route_input_family_first_class_surface_v1_landed_input_surface_selected_post_v1_industry_grade_golden_scenario_matrix_v1";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_CANDIDATE_ID =
  "post_v1_route_input_family_first_class_surface_v1";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_ACTION =
  "post_v1_industry_grade_golden_scenario_matrix_v1_plan";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-industry-grade-golden-scenario-matrix-v1-contract.test.ts";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_INDUSTRY_GRADE_GOLDEN_SCENARIO_MATRIX_V1_PLAN_2026-06-30.md";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_SELECTED_NEXT_LABEL =
  "post-V1 industry-grade golden scenario matrix V1";

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_SURFACE_V1_COUNTERS = {
  firstClassRouteFamiliesCaptured: 6,
  frontendImplementationFilesTouched: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  requiredPhysicalInputsCaptured: 6,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  unsupportedBoundariesProtected: 8
} as const;

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_ROUTE_FAMILIES = [
  "ceiling_roof_suspended_ceiling_route_boundary",
  "ceiling_airborne_plenum",
  "roof_airborne",
  "opening_facade_indoor",
  "opening_facade_outdoor_indoor_oitc",
  "floor_astm_iic_aiic_impact_rating",
  "field_building_flanking_context"
] as const satisfies readonly AcousticInputRouteFamily[];

export const POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES = [
  "no OITC from ISO 717-1 or ASTM E413 indoor curves",
  "no OITC from scalar Rw or STC",
  "no OITC from NISR/ISR source-report aliases without same outdoor-indoor basis",
  "no indoor DnT,w or Dn,w copied into outdoor-indoor facade OITC",
  "no IIC/AIIC from ISO Ln,w or DeltaLw",
  "no ceiling impact inferred from airborne ceiling boards",
  "no roof/facade route from indoor partition context",
  "no source-row proximity substitution without exact or bounded same-family evidence"
] as const;

type RouteFamilyDefinition = {
  readonly conditionalFields?: readonly AcousticInputFieldId[];
  readonly id: string;
  readonly notes: readonly string[];
  readonly requiredFields: readonly AcousticInputFieldId[];
  readonly routeFamily: AcousticInputRouteFamily;
  readonly targetOutputs: readonly RequestedOutputId[];
};

export type PostV1RouteInputFamilyFirstClassSurfaceInput = {
  readonly airborneContext?: AirborneContext | null;
  readonly exactImpactSource?: ExactImpactSource | null;
  readonly impactFieldContext?: ImpactFieldContext | null;
  readonly targetOutputs: readonly RequestedOutputId[];
};

export type PostV1RouteInputFamilyFirstClassSurfaceResult = {
  readonly inputCompletenessSet: readonly AcousticInputCompleteness[];
  readonly missingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly routeFamilies: readonly AcousticInputRouteFamily[];
  readonly runtimeValueMovement: false;
  readonly status: "complete" | "needs_input" | "unsupported";
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
  readonly unsupportedOutputs: readonly RequestedOutputId[];
};

const AIRBORNE_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];
const OPENING_INDOOR_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const ROUTE_FAMILY_DEFINITIONS = [
  {
    id: "post_v1_ceiling_roof_suspended_ceiling_route_boundary_inputs",
    notes: [
      "Ambiguous ceiling, roof, and suspended-ceiling stacks need explicit route intent before any family value can publish."
    ],
    requiredFields: [
      "routeIntent",
      "roofOrCeilingMountingContext",
      "suspendedCeilingAirborneOrImpactIntent",
      "hangerOrSupportCouplingClass"
    ],
    routeFamily: "ceiling_roof_suspended_ceiling_route_boundary",
    targetOutputs: [
      ...AIRBORNE_LAB_OUTPUTS,
      ...FIELD_BUILDING_OUTPUTS,
      "Ln,w",
      "DeltaLw"
    ]
  },
  {
    id: "post_v1_ceiling_airborne_plenum_inputs",
    notes: [
      "Ceiling plenum airborne formulas require explicit plenum depth, leaf mass, absorber properties, and hanger/support coupling."
    ],
    requiredFields: [
      "routeIntent",
      "roofOrCeilingMountingContext",
      "suspendedCeilingAirborneOrImpactIntent",
      "leafGrouping",
      "panelSurfaceMassKgM2",
      "cavityDepthMm",
      "absorberFlowResistivityPaSM2",
      "absorberThicknessMm",
      "hangerOrSupportCouplingClass"
    ],
    routeFamily: "ceiling_airborne_plenum",
    targetOutputs: [...AIRBORNE_LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    id: "post_v1_roof_airborne_inputs",
    notes: [
      "Roof/facade airborne routes stay separate from indoor ceiling plenum and wall partition routes."
    ],
    requiredFields: [
      "routeIntent",
      "roofOrCeilingMountingContext",
      "frequencyBandSet",
      "surfaceMassKgM2",
      "cavityDepthMm"
    ],
    routeFamily: "roof_airborne",
    targetOutputs: [...AIRBORNE_LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS]
  },
  {
    id: "post_v1_opening_facade_indoor_inputs",
    notes: [
      "Indoor opening/facade element routes need opening area-energy context and rating basis before field/building companions can publish."
    ],
    requiredFields: [
      "facadeOutdoorOrRoomNormalizationContext",
      "hostWallAreaM2",
      "openingAreaM2",
      "openingCount",
      "openingElementType",
      "openingRatingBasis",
      "openingSealLeakageClass"
    ],
    routeFamily: "opening_facade_indoor",
    targetOutputs: [...OPENING_INDOOR_OUTPUTS]
  },
  {
    id: "post_v1_opening_facade_outdoor_indoor_oitc_inputs",
    notes: [
      "Outdoor-indoor facade OITC is an ASTM E1332 spectral route, not an Rw/STC/NISR alias."
    ],
    requiredFields: [
      "facadeOutdoorOrRoomNormalizationContext",
      "frequencyBandSet",
      "hostWallAreaM2",
      "openingAreaM2",
      "openingCount",
      "openingElementTransmissionLossCurve",
      "openingElementType",
      "openingSealLeakageClass"
    ],
    routeFamily: "opening_facade_outdoor_indoor_oitc",
    targetOutputs: [...OITC_OUTPUTS]
  },
  {
    conditionalFields: ["impactFieldContext"],
    id: "post_v1_floor_astm_iic_aiic_impact_rating_inputs",
    notes: [
      "ASTM IIC/AIIC needs an explicit ASTM E492/E1007 plus E989 band basis; ISO Ln,w and DeltaLw are not aliases."
    ],
    requiredFields: ["frequencyBandSet"],
    routeFamily: "floor_astm_iic_aiic_impact_rating",
    targetOutputs: [...IMPACT_ASTM_OUTPUTS]
  },
  {
    id: "post_v1_field_building_flanking_context_inputs",
    notes: [
      "Field and building metrics need area, room, reverberation, and flanking/junction context before lab values can promote."
    ],
    requiredFields: [
      "contextMode",
      "partitionAreaM2",
      "sourceRoomVolumeM3",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S",
      "flankingJunctionClass",
      "conservativeFlankingAssumption",
      "junctionCouplingLengthM",
      "buildingPredictionOutputBasis"
    ],
    routeFamily: "field_building_flanking_context",
    targetOutputs: [...FIELD_BUILDING_OUTPUTS, "L'n,w", "L'nT,w"]
  }
] as const satisfies readonly RouteFamilyDefinition[];

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function hasPositiveNumber(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isUnknownOrMissing(value: string | null | undefined): boolean {
  return value === undefined || value === null || value === "" || value === "unknown";
}

function containsTargetOutput(
  requested: readonly RequestedOutputId[],
  candidates: readonly RequestedOutputId[]
): boolean {
  return requested.length === 0 || requested.some((output) => candidates.includes(output));
}

function hasExactImpactBands(source: ExactImpactSource | null | undefined): boolean {
  if (!source) {
    return false;
  }

  const available = new Set(source.frequenciesHz);
  return IMPACT_RATING_FREQS_THIRD.every((frequency) => available.has(frequency));
}

function hasAstmE989StandardMethod(source: ExactImpactSource | null | undefined): boolean {
  return /ASTM\s+E(?:492|1007)\s*\/\s*ASTM\s+E989/iu.test(source?.standardMethod ?? "");
}

function missingCeilingRouteBoundary(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (isUnknownOrMissing(context?.routeIntent)) {
    missing.push("routeIntent");
  }
  if (isUnknownOrMissing(context?.roofOrCeilingMountingContext)) {
    missing.push("roofOrCeilingMountingContext");
  }
  if (isUnknownOrMissing(context?.suspendedCeilingAirborneOrImpactIntent)) {
    missing.push("suspendedCeilingAirborneOrImpactIntent");
  }
  if (isUnknownOrMissing(context?.hangerOrSupportCouplingClass)) {
    missing.push("hangerOrSupportCouplingClass");
  }

  return missing;
}

function missingCeilingPlenum(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const plenum = context?.ceilingPlenum;
  const missing: AcousticInputFieldId[] = [
    ...missingCeilingRouteBoundary(context)
  ];

  if (isUnknownOrMissing(plenum?.leafGrouping)) {
    missing.push("leafGrouping");
  }
  if (!hasPositiveNumber(plenum?.leafSurfaceMassKgM2)) {
    missing.push("panelSurfaceMassKgM2");
  }
  if (!hasPositiveNumber(plenum?.cavityOrPlenumDepthMm)) {
    missing.push("cavityDepthMm");
  }
  if (!hasPositiveNumber(plenum?.absorberFlowResistivityPaSM2)) {
    missing.push("absorberFlowResistivityPaSM2");
  }
  if (!hasPositiveNumber(plenum?.absorberThicknessMm)) {
    missing.push("absorberThicknessMm");
  }
  if (isUnknownOrMissing(plenum?.supportCouplingOrHangerClass ?? context?.hangerOrSupportCouplingClass)) {
    missing.push("hangerOrSupportCouplingClass");
  }

  return unique(missing);
}

function missingRoofAirborne(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (context?.routeIntent !== "roof_airborne") {
    missing.push("routeIntent");
  }
  if (
    context?.roofOrCeilingMountingContext !== "roof_or_facade_element" &&
    context?.roofOrCeilingMountingContext !== "ceiling_lining_below_roof"
  ) {
    missing.push("roofOrCeilingMountingContext");
  }
  if (context?.frequencyBandSet === undefined) {
    missing.push("frequencyBandSet");
  }
  if (!hasPositiveNumber(context?.hostWallAreaM2)) {
    missing.push("surfaceMassKgM2");
  }
  if (!hasPositiveNumber(context?.ceilingPlenum?.cavityOrPlenumDepthMm)) {
    missing.push("cavityDepthMm");
  }

  return unique(missing);
}

function missingOpeningIndoor(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];
  const openings = context?.openingLeakElements ?? [];

  if (context?.facadeOutdoorContext !== "indoor_partition") {
    missing.push("facadeOutdoorOrRoomNormalizationContext");
  }
  if (!hasPositiveNumber(context?.hostWallAreaM2)) {
    missing.push("hostWallAreaM2");
  }
  if (openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingCount",
      "openingElementType",
      "openingRatingBasis",
      "openingSealLeakageClass"
    );
  }

  for (const opening of openings) {
    if (!hasPositiveNumber(opening.areaM2)) {
      missing.push("openingAreaM2");
    }
    if (!hasPositiveNumber(opening.count)) {
      missing.push("openingCount");
    }
    if (isUnknownOrMissing(opening.elementType)) {
      missing.push("openingElementType");
    }
    if (isUnknownOrMissing(opening.ratingBasis)) {
      missing.push("openingRatingBasis");
    }
    if (isUnknownOrMissing(opening.sealLeakageClass)) {
      missing.push("openingSealLeakageClass");
    }
  }

  return unique(missing);
}

function missingOpeningOitc(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];
  const openings = context?.openingLeakElements ?? [];

  if (context?.facadeOutdoorContext !== "outdoor_indoor_facade") {
    missing.push("facadeOutdoorOrRoomNormalizationContext");
  }
  if (context?.frequencyBandSet !== "one_third_octave_80_4000") {
    missing.push("frequencyBandSet");
  }
  if (!hasPositiveNumber(context?.hostWallAreaM2)) {
    missing.push("hostWallAreaM2");
  }
  if (openings.length === 0) {
    missing.push(
      "openingAreaM2",
      "openingCount",
      "openingElementTransmissionLossCurve",
      "openingElementType",
      "openingSealLeakageClass"
    );
  }

  for (const opening of openings) {
    if (!hasPositiveNumber(opening.areaM2)) {
      missing.push("openingAreaM2");
    }
    if (!hasPositiveNumber(opening.count)) {
      missing.push("openingCount");
    }
    if (!opening.elementTransmissionLossCurve) {
      missing.push("openingElementTransmissionLossCurve");
    }
    if (isUnknownOrMissing(opening.elementType)) {
      missing.push("openingElementType");
    }
    if (isUnknownOrMissing(opening.sealLeakageClass)) {
      missing.push("openingSealLeakageClass");
    }
  }

  return unique(missing);
}

function missingAstmImpact(input: PostV1RouteInputFamilyFirstClassSurfaceInput): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (!hasAstmE989StandardMethod(input.exactImpactSource) || !hasExactImpactBands(input.exactImpactSource)) {
    missing.push("frequencyBandSet");
  }
  if (
    input.targetOutputs.includes("AIIC") &&
    input.exactImpactSource?.labOrField !== "field" &&
    !input.impactFieldContext
  ) {
    missing.push("impactFieldContext");
  }

  return unique(missing);
}

function missingFieldBuilding(context: AirborneContext | null | undefined): AcousticInputFieldId[] {
  const missing: AcousticInputFieldId[] = [];

  if (context?.contextMode !== "field_between_rooms" && context?.contextMode !== "building_prediction") {
    missing.push("contextMode");
  }
  if (!(hasPositiveNumber(context?.hostWallAreaM2) || (hasPositiveNumber(context?.panelWidthMm) && hasPositiveNumber(context?.panelHeightMm)))) {
    missing.push("partitionAreaM2");
  }
  if (!hasPositiveNumber(context?.sourceRoomVolumeM3)) {
    missing.push("sourceRoomVolumeM3");
  }
  if (!hasPositiveNumber(context?.receivingRoomVolumeM3)) {
    missing.push("receivingRoomVolumeM3");
  }
  if (!hasPositiveNumber(context?.receivingRoomRt60S)) {
    missing.push("receivingRoomRt60S");
  }
  if (isUnknownOrMissing(context?.flankingJunctionClass)) {
    missing.push("flankingJunctionClass");
  }
  if (isUnknownOrMissing(context?.conservativeFlankingAssumption)) {
    missing.push("conservativeFlankingAssumption");
  }
  if (!hasPositiveNumber(context?.junctionCouplingLengthM)) {
    missing.push("junctionCouplingLengthM");
  }
  if (isUnknownOrMissing(context?.buildingPredictionOutputBasis)) {
    missing.push("buildingPredictionOutputBasis");
  }

  return unique(missing);
}

function missingForDefinition(
  definition: RouteFamilyDefinition,
  input: PostV1RouteInputFamilyFirstClassSurfaceInput
): readonly AcousticInputFieldId[] {
  switch (definition.routeFamily) {
    case "ceiling_roof_suspended_ceiling_route_boundary":
      return missingCeilingRouteBoundary(input.airborneContext);
    case "ceiling_airborne_plenum":
      return missingCeilingPlenum(input.airborneContext);
    case "roof_airborne":
      return missingRoofAirborne(input.airborneContext);
    case "opening_facade_indoor":
      return missingOpeningIndoor(input.airborneContext);
    case "opening_facade_outdoor_indoor_oitc":
      return missingOpeningOitc(input.airborneContext);
    case "floor_astm_iic_aiic_impact_rating":
      return missingAstmImpact(input);
    case "field_building_flanking_context":
      return missingFieldBuilding(input.airborneContext);
    default:
      return [];
  }
}

function buildCompleteness(
  definition: RouteFamilyDefinition,
  missingPhysicalInputs: readonly AcousticInputFieldId[],
  targetOutputs: readonly RequestedOutputId[]
): AcousticInputCompleteness {
  const filteredTargetOutputs = targetOutputs.filter((output) =>
    definition.targetOutputs.includes(output)
  );
  const effectiveTargetOutputs = filteredTargetOutputs.length > 0
    ? filteredTargetOutputs
    : definition.targetOutputs;

  return AcousticInputCompletenessSchema.parse({
    conditionalFields: [...(definition.conditionalFields ?? [])],
    id: definition.id,
    missingPhysicalInputs: [...missingPhysicalInputs],
    notes: [...definition.notes],
    requiredFields: [...definition.requiredFields],
    routeFamily: definition.routeFamily,
    status: missingPhysicalInputs.length > 0 ? "needs_input" : "complete",
    targetOutputs: [...effectiveTargetOutputs]
  });
}

function unsupportedOutputsFor(input: PostV1RouteInputFamilyFirstClassSurfaceInput): RequestedOutputId[] {
  const unsupported = new Set<RequestedOutputId>();

  for (const output of input.targetOutputs) {
    if (["NISR", "ISR", "LIIC", "LIR", "HIIC"].includes(output)) {
      unsupported.add(output);
    }
  }

  if (input.targetOutputs.includes("OITC") && input.airborneContext?.facadeOutdoorContext === "indoor_partition") {
    unsupported.add("OITC");
  }

  const hasNonAstmImpactSource =
    input.exactImpactSource !== undefined &&
    input.exactImpactSource !== null &&
    !hasAstmE989StandardMethod(input.exactImpactSource);
  if (hasNonAstmImpactSource) {
    for (const output of IMPACT_ASTM_OUTPUTS) {
      if (input.targetOutputs.includes(output)) {
        unsupported.add(output);
      }
    }
  }

  return [...unsupported];
}

export function buildPostV1RouteInputFamilyFirstClassSurface(
  input: PostV1RouteInputFamilyFirstClassSurfaceInput
): PostV1RouteInputFamilyFirstClassSurfaceResult {
  const activeDefinitions = ROUTE_FAMILY_DEFINITIONS.filter((definition) =>
    containsTargetOutput(input.targetOutputs, definition.targetOutputs)
  );
  const inputCompletenessSet = activeDefinitions.map((definition) =>
    buildCompleteness(definition, missingForDefinition(definition, input), input.targetOutputs)
  );
  const missingPhysicalInputs = unique(
    inputCompletenessSet.flatMap((entry) => entry.missingPhysicalInputs)
  );
  const unsupportedOutputs = unsupportedOutputsFor(input);
  const status =
    unsupportedOutputs.length === input.targetOutputs.length && input.targetOutputs.length > 0
      ? "unsupported"
      : missingPhysicalInputs.length > 0
        ? "needs_input"
        : "complete";

  return {
    inputCompletenessSet,
    missingPhysicalInputs,
    routeFamilies: unique(inputCompletenessSet.map((entry) => entry.routeFamily)),
    runtimeValueMovement: false,
    status,
    targetOutputs: [...input.targetOutputs],
    unsupportedBoundaries: [...POST_V1_ROUTE_INPUT_FAMILY_FIRST_CLASS_UNSUPPORTED_BOUNDARIES],
    unsupportedOutputs
  };
}
