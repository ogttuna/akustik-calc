import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneFamily,
  RequestedOutputId,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { VerifiedAirborneAnchorResult } from "./airborne-verified-catalog";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD =
  "post_v1_wall_british_gypsum_exact_lab_field_building_direct_curve";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_field_building_adapter_owner";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_SELECTED_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_SELECTED_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_RUNTIME_METHOD =
  "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_runtime";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_SELECTED_CANDIDATE_ID =
  "wall.british_gypsum_exact_lab_calculated_lab_companion_owner";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_ADAPTER_WARNING =
  "British Gypsum exact lab field/building adapter active: DynEcho used the exact A046005/A046006 element-lab Rw row as the direct separating-element curve before applying the owned Gate I / Gate AR adapter. lab values must not be copied into field/building outputs.";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING =
  "British Gypsum exact lab A-weighted field/building owner active: DynEcho used the same exact A046005/A046006 lab Rw direct curve and calculated A-weighted field/building companions through the owned Gate I / Gate AR route. Dn,A and DnT,A are calculated route values, not copied lab evidence.";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_WARNING =
  "British Gypsum exact lab building DnT,A,k characteristic owner active: DynEcho derived DnT,A,k from the owned exact-lab Gate AR building DnT,A value, receiving-room volume, partition area with the 7 m2 minimum, and T0=0.5 s; it did not alias lab values or copy DnT,A blindly.";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_WARNING =
  "British Gypsum exact lab calculated companion owner active: DynEcho used the exact A046005/A046006 Rw row as the measured anchor and calculated STC/C/Ctr from the selected dynamic transmission-loss curve; the source row is not treated as measuring unreported companion metrics.";

export const POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_SOURCE_IDS = [
  "british_gypsum_a046005_timber_rb1_2x12p5_soundbloc_50apr_lab_2026",
  "british_gypsum_a046006_timber_rb2_2x12p5_soundbloc_50apr_lab_2026"
] as const;

const SOURCE_ID_SET = new Set<string>(POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_SOURCE_IDS);
const MIXED_LAB_COMPANION_OUTPUTS = new Set<RequestedOutputId>(["Rw", "STC", "C", "Ctr"]);
const MIXED_LAB_SPECTRUM_COMPANIONS = new Set<RequestedOutputId>(["STC", "C", "Ctr"]);

type VerifiedAirborneCatalogMatchLike = {
  readonly id: string;
  readonly label: string;
  readonly metricLabel: string;
  readonly metricValue?: number;
  readonly sourceMode: "field" | "lab";
};

export function isPostV1WallBritishGypsumExactLabFieldBuildingSourceId(
  sourceId: string | null | undefined
): boolean {
  return typeof sourceId === "string" && SOURCE_ID_SET.has(sourceId);
}

function isElementLabContext(context: AirborneContext | null | undefined): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function isExactRwPlusCalculatedCompanionRequest(targetOutputs: readonly RequestedOutputId[]): boolean {
  if (targetOutputs.length === 0 || !targetOutputs.includes("Rw")) {
    return false;
  }

  if (!targetOutputs.some((output) => MIXED_LAB_SPECTRUM_COMPANIONS.has(output))) {
    return false;
  }

  return targetOutputs.every((output) => MIXED_LAB_COMPANION_OUTPUTS.has(output));
}

export function buildPostV1WallBritishGypsumExactLabFieldBuildingDirectCurveBasis(input: {
  readonly family?: DynamicAirborneFamily;
  readonly result: VerifiedAirborneAnchorResult;
  readonly transmissionLossCurve: TransmissionLossCurve;
}): AirborneResultBasis | null {
  const match = input.result.match;
  if (
    !input.result.applied ||
    !match ||
    !isPostV1WallBritishGypsumExactLabFieldBuildingSourceId(match.id) ||
    match.sourceMode !== "lab" ||
    match.metricLabel !== "Rw"
  ) {
    return null;
  }

  return {
    exactSourceId: match.id,
    assumptions: [
      `exact British Gypsum ${match.id.includes("a046005") ? "A046005" : "A046006"} lab Rw row owns the direct separating-element base before field/building adaptation`,
      "the source row is a single-number lab Rw anchor, so DynEcho calibrates the direct calculated curve rather than claiming a measured frequency spectrum",
      "Gate I / Gate AR must calculate R'w, Dn,w, Dn,A, DnT,w, DnT,A, and DnT,A,k from explicit room, partition-area, spectrum-adapter, and flanking context",
      "lab values must not be copied into field/building outputs",
      "ASTM/OITC, impact aliases, legacy auto side-count, and nearby British Gypsum rows remain outside this owner"
    ],
    calculationStandard: "engine_bounded_estimate",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 7,
    family: input.family ?? "stud_wall_system",
    frequencyBands: {
      bandSet: "post_v1_wall_british_gypsum_exact_lab_field_building_direct_curve",
      frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    measurementStandard: "ISO 10140-2",
    method: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_FIELD_BUILDING_DIRECT_CURVE_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      `exactBritishGypsumSourceRow:${match.id}`,
      "resilientBarSideCount:one_side_or_both_sides",
      "britishGypsumExactLabRwDirectCurve",
      "fieldBuildingAWeightedCompanionAdapter:DnA_DnTA",
      "buildingCharacteristicAdapter:DnTAk",
      "GateI_or_GateAR_field_building_adapter_owner"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

export function maybeBuildPostV1WallBritishGypsumExactLabCalculatedLabCompanionBasis(input: {
  readonly airborneContext?: AirborneContext | null;
  readonly dynamicFamily?: DynamicAirborneFamily | null;
  readonly sourceMatch?: VerifiedAirborneCatalogMatchLike | null;
  readonly strategy?: string | null;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly transmissionLossCurve?: TransmissionLossCurve | null;
}): AirborneResultBasis | null {
  if (
    input.dynamicFamily !== "stud_wall_system" ||
    !isElementLabContext(input.airborneContext) ||
    !isExactRwPlusCalculatedCompanionRequest(input.targetOutputs) ||
    !isPostV1WallBritishGypsumExactLabFieldBuildingSourceId(input.sourceMatch?.id) ||
    input.sourceMatch?.sourceMode !== "lab" ||
    input.sourceMatch.metricLabel !== "Rw" ||
    typeof input.sourceMatch.metricValue !== "number" ||
    !Number.isFinite(input.sourceMatch.metricValue)
  ) {
    return null;
  }

  return {
    assumptions: [
      `Exact British Gypsum source ${input.sourceMatch.id} owns Rw ${input.sourceMatch.metricValue.toFixed(1)} dB for this lab stack.`,
      "STC, C, and Ctr remain calculated from the selected dynamic transmission-loss curve and rating adapters.",
      "The mixed answer is not promoted to measured_exact_full_stack because the source row does not report every requested companion metric.",
      "Field and building outputs remain separate route owners; lab Rw is not relabelled as R'w, Dn,w, Dn,A, DnT,w, DnT,A, or DnT,A,k.",
      `current dynamic strategy remains ${input.strategy ?? "stud_surrogate_blend+framed_wall_calibration"}`
    ],
    calculationStandard: "engine_double_leaf_cavity",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: 7,
    exactSourceId: input.sourceMatch.id,
    family: "stud_wall_system",
    frequencyBands:
      input.transmissionLossCurve && input.transmissionLossCurve.frequenciesHz.length > 0
        ? {
            bandSet: "post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_curve",
            frequenciesHz: [...input.transmissionLossCurve.frequenciesHz]
          }
        : undefined,
    kind: "airborne_physics_prediction",
    measurementStandard: "source_report",
    method: POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      "exactBritishGypsumSourceRow:Rw",
      "calculatedTransmissionLossCurve",
      "ISO717-1 C/Ctr rating adapter",
      "ASTM E413 STC rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}
