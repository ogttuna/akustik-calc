import type {
  AirborneContext,
  AirborneResultBasis,
  DynamicAirborneConfidenceClass,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

import type { AirborneTopologySummary } from "./airborne-topology";
import type { DynamicAirborneOptions } from "./dynamic-airborne-helpers";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";
import { GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS } from "./dynamic-calculator-route-input-topology";

export const GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD =
  "gate_ar_airborne_building_prediction_all_owner_runtime_corridor";

export const GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID =
  "candidate_airborne_building_prediction_all_owner_family_physics_prediction";

export const GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING =
  "Airborne building-prediction runtime corridor is active from the owned direct curve, explicit flanking/junction context, room standardization, and the Gate AQ +/-9 dB source-absent uncertainty budget. It is not measured building evidence.";

const METHOD_LABEL_BY_DELEGATE: Record<DynamicAirborneDelegateMethod, string> = {
  kurtovic: "kurtovic_cremer_single_leaf_coincidence_delegate",
  ks_rw_calibrated: "ks_massive_wall_reference_curve_delegate",
  mass_law: "surface_mass_law_delegate",
  screening_mass_law_curve_seed_v3: "screening_mass_law_curve_seed_v3_delegate",
  sharp: "sharp_single_leaf_panel_coincidence_delegate",
  triple_leaf_two_cavity_frequency_solver: "triple_leaf_two_cavity_frequency_solver"
};

type CompleteGateARBuildingPredictionContext = AirborneContext & {
  buildingPredictionOutputBasis: "apparent" | "apparent_and_standardized" | "standardized";
  conservativeFlankingAssumption: "multi_path_conservative" | "single_conservative_path" | "worst_case_screening";
  contextMode: "building_prediction";
  flankingJunctionClass:
    | "isolated_junction"
    | "lightweight_junction"
    | "mixed_junction"
    | "rigid_cross_junction"
    | "rigid_t_junction";
  junctionCouplingLengthM: number;
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
  sourceRoomVolumeM3: number;
};

function isPositiveFinite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasOpeningLeakAdapterFields(context: AirborneContext | null | undefined): boolean {
  return (
    isPositiveFinite(context?.hostWallAreaM2) ||
    (Array.isArray(context?.openingLeakElements) && context.openingLeakElements.length > 0)
  );
}

export function hasCompleteGateARBuildingPredictionContext(
  context: AirborneContext | null | undefined
): context is CompleteGateARBuildingPredictionContext {
  return (
    context?.contextMode === "building_prediction" &&
    context.flankingJunctionClass !== undefined &&
    context.flankingJunctionClass !== "unknown" &&
    context.conservativeFlankingAssumption !== undefined &&
    context.conservativeFlankingAssumption !== "unknown" &&
    context.buildingPredictionOutputBasis !== undefined &&
    context.buildingPredictionOutputBasis !== "unknown" &&
    isPositiveFinite(context.panelWidthMm) &&
    isPositiveFinite(context.panelHeightMm) &&
    isPositiveFinite(context.sourceRoomVolumeM3) &&
    isPositiveFinite(context.receivingRoomVolumeM3) &&
    isPositiveFinite(context.receivingRoomRt60S) &&
    isPositiveFinite(context.junctionCouplingLengthM) &&
    !hasOpeningLeakAdapterFields(context)
  );
}

function confidenceNote(confidenceClass: DynamicAirborneConfidenceClass): string {
  if (confidenceClass === "high") {
    return "direct family curve confidence is high, but building flanking still keeps the source-absent Gate AQ budget visible";
  }

  if (confidenceClass === "medium") {
    return "direct family curve confidence is medium, so the Gate AQ budget remains the controlling reliability label";
  }

  return "direct family curve confidence is low, so the Gate AQ budget must be treated as screening-grade until holdouts exist";
}

export function maybeBuildGateARAirborneBuildingPredictionRuntimeBasis(input: {
  confidenceClass: DynamicAirborneConfidenceClass;
  curve: TransmissionLossCurve;
  family: DynamicAirborneFamily;
  layers: readonly ResolvedLayer[];
  options: DynamicAirborneOptions;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
  topology: AirborneTopologySummary;
}): AirborneResultBasis | null {
  const context = input.options.airborneContext;
  if (!hasCompleteGateARBuildingPredictionContext(context)) {
    return null;
  }

  const partitionAreaM2 = (context.panelWidthMm * context.panelHeightMm) / 1_000_000;

  return {
    assumptions: [
      "building-prediction output is computed only from explicit building_prediction context",
      "direct separating-element curve comes from the selected dynamic airborne family solver",
      "flanking/junction contribution is represented by the explicit conservative flanking assumption, named junction class, coupling length, and the existing path-energy overlay",
      "room standardization owns partition area, source-room volume, receiving-room volume, and receiving-room RT60 instead of borrowing Gate I field context",
      `Gate AQ +/-${GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB} dB uncertainty budget remains source-absent and not measured evidence`,
      `${confidenceNote(input.confidenceClass)}`,
      `building context uses ${partitionAreaM2.toFixed(2)} m2 partition area, ${context.sourceRoomVolumeM3.toFixed(1)} m3 source-room volume, ${context.receivingRoomVolumeM3.toFixed(1)} m3 receiving-room volume, ${context.receivingRoomRt60S.toFixed(2)} s RT60, ${context.flankingJunctionClass}, ${context.conservativeFlankingAssumption}, and ${context.junctionCouplingLengthM.toFixed(2)} m coupling length`,
      `current dynamic strategy remains ${input.strategy}`
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
    family: input.family,
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    },
    kind: "airborne_physics_prediction",
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [
      "same_building_source_owned_RwPrime_DnTw_holdouts_absent"
    ],
    origin: "family_physics_prediction",
    propertyDefaults: [],
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS,
      "ISO_12354_1_direct_separating_element_frequency_curve_owner",
      "ISO_12354_1_flanking_path_transmission_terms_owner",
      "ISO_12354_1_junction_vibration_reduction_index_owner",
      "ISO_12354_1_room_absorption_normalization_owner",
      "buildingPredictionUncertaintyBudgetOwner",
      `selectedDelegateCurve:${METHOD_LABEL_BY_DELEGATE[input.selectedMethod]}`,
      "ISO717-1 rating adapter"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}
