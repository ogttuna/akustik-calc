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
import { maybeBuildGateHLinedMasonryCltWallBasis } from "./dynamic-airborne-gate-h-lined-masonry-clt";

export const GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD =
  "gate_i_airborne_field_apparent_context_adapter_runtime";

export const GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID =
  "candidate_airborne_field_context_family_physics_prediction";

export const GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING =
  "Airborne field/apparent context family prediction is active from an owned lab-family route plus explicit receiving-room context. It is not a measured field row and must keep its field uncertainty separate from lab Rw/STC.";

type CompleteGateIFieldContext = AirborneContext & {
  contextMode: "field_between_rooms";
  panelHeightMm: number;
  panelWidthMm: number;
  receivingRoomRt60S: number;
  receivingRoomVolumeM3: number;
};

function hasCompleteFieldContext(
  context: AirborneContext | null | undefined
): context is CompleteGateIFieldContext {
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

function buildGateIFieldBasis(input: {
  baseBasis: AirborneResultBasis;
  context: AirborneContext;
  family?: DynamicAirborneFamily;
  frequencyBands?: AirborneResultBasis["frequencyBands"];
}): AirborneResultBasis {
  const baseAssumptions = input.baseBasis.assumptions.filter(
    (assumption) => !/field\/apparent outputs remain outside/i.test(assumption)
  );
  const baseErrorBudgetDb =
    typeof input.baseBasis.errorBudgetDb === "number" && Number.isFinite(input.baseBasis.errorBudgetDb)
      ? input.baseBasis.errorBudgetDb
      : 6;

  return {
    ...input.baseBasis,
    assumptions: [
      "field/apparent output is computed only from explicit field_between_rooms context",
      "lab Rw/STC is not relabelled as R'w/DnT,w; the field metric adapter owns this output basis",
      "building-prediction and flanking outputs remain blocked until junction/flanking ownership lands",
      `field context uses ${((input.context.panelWidthMm ?? 0) * (input.context.panelHeightMm ?? 0) / 1_000_000).toFixed(2)} m2 partition area, ${input.context.receivingRoomVolumeM3?.toFixed(1)} m3 receiving-room volume, and ${input.context.receivingRoomRt60S?.toFixed(2)} s RT60`,
      `base lab-family method remains ${input.baseBasis.method}`,
      ...baseAssumptions
    ],
    calculationStandard: "ISO 12354-1",
    curveBasis: "calculated_frequency_curve",
    errorBudgetDb: Math.max(baseErrorBudgetDb + 2, 7),
    family: input.family ?? input.baseBasis.family,
    frequencyBands: input.frequencyBands ?? input.baseBasis.frequencyBands,
    kind: "airborne_physics_prediction",
    method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    missingSourceEvidence: [],
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1",
    requiredInputs: [
      ...input.baseBasis.requiredInputs,
      "fieldContext.contextMode:field_between_rooms",
      "fieldContext.partitionAreaM2_or_panelWidthHeight",
      "fieldContext.receivingRoomVolumeM3",
      "fieldContext.receivingRoomRt60S",
      "fieldMetricAdapter:R'w/DnT,w"
    ],
    toleranceClass: "uncalibrated_prediction"
  };
}

export function maybeBuildGateIAirborneFieldContextBasisFromBase(input: {
  baseBasis: AirborneResultBasis;
  context: AirborneContext | null | undefined;
  family?: DynamicAirborneFamily;
  frequencyBands?: AirborneResultBasis["frequencyBands"];
}): AirborneResultBasis | null {
  if (input.baseBasis.origin !== "family_physics_prediction" || !hasCompleteFieldContext(input.context)) {
    return null;
  }

  return buildGateIFieldBasis({
    baseBasis: input.baseBasis,
    context: input.context,
    family: input.family,
    frequencyBands: input.frequencyBands
  });
}

export function maybeBuildGateIAirborneFieldContextBasis(input: {
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
  if (!hasCompleteFieldContext(context)) {
    return null;
  }

  const baseBasis = maybeBuildGateHLinedMasonryCltWallBasis({
    confidenceClass: input.confidenceClass,
    curve: input.curve,
    family: input.family,
    layers: input.layers,
    options: {
      ...input.options,
      airborneContext: {
        ...(context ?? {}),
        contextMode: "element_lab"
      }
    },
    selectedMethod: input.selectedMethod,
    strategy: input.strategy,
    topology: input.topology
  });

  if (!baseBasis) {
    return null;
  }

  return buildGateIFieldBasis({
    baseBasis,
    context,
    family: input.family,
    frequencyBands: {
      bandSet: "dynamic_airborne_delegate_grid",
      frequenciesHz: [...input.curve.frequenciesHz]
    }
  });
}
