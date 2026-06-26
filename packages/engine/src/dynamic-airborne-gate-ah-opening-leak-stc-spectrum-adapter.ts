import {
  RatingAdapterBasisSchema,
  type AirborneContext,
  type RatingAdapterBasis,
  type RequestedOutputId,
  type TransmissionLossCurve
} from "@dynecho/shared";

import { buildRatingsFromCurve } from "./curve-rating";
import {
  GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB
} from "./dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor";
import {
  GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
  type GateSOpeningLeakCompositeRuntimeResult
} from "./dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor";
import { clamp, round1 } from "./math";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN =
  "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS =
  "gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION =
  "gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_RUNTIME_METHOD =
  "gate_ah_opening_leak_stc_spectrum_adapter_runtime";

export const GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING =
  "Opening/leak STC spectrum adapter active: lab STC is re-rated with ASTM E413 from the host-wall transmission-loss spectrum shifted by the Gate S area-energy opening loss. It is source-absent, uses the same +/-6 dB opening/leak budget, and does not alias field or building outputs.";

export type GateAHOpeningLeakStcSpectrumAdapterResult = {
  ratingAdapterBasis: RatingAdapterBasis;
  runtimeStcDb: number;
  rwLossDb: number;
  shiftedCurve: TransmissionLossCurve;
  warning: typeof GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING;
};

function isElementLabContext(context?: AirborneContext | null): boolean {
  return !context?.contextMode || context.contextMode === "element_lab";
}

function buildShiftedCurve(input: {
  compositeCurve?: TransmissionLossCurve | null;
  hostCurve: TransmissionLossCurve;
  rwLossDb: number;
}): TransmissionLossCurve {
  if (input.compositeCurve) {
    return {
      frequenciesHz: [...input.compositeCurve.frequenciesHz],
      transmissionLossDb: [...input.compositeCurve.transmissionLossDb]
    };
  }

  return {
    frequenciesHz: [...input.hostCurve.frequenciesHz],
    transmissionLossDb: input.hostCurve.transmissionLossDb.map((value) =>
      round1(clamp(value - input.rwLossDb, 0, 95))
    )
  };
}

function buildStcAdapterBasis(): RatingAdapterBasis {
  return RatingAdapterBasisSchema.parse({
    adapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
    aliasBlocks: [
      {
        fromMetricId: "Rw",
        reason:
          "Gate AH does not copy the opening/leak composite Rw into STC; it re-rates a shifted transmission-loss spectrum with the ASTM E413 contour.",
        toMetricId: "STC"
      },
      {
        fromMetricId: "DnT,w",
        reason:
          "Gate AH owns only element-lab STC. Field and building metrics still require their own apparent or standardized context owners.",
        toMetricId: "STC"
      }
    ],
    contextBasis: "element_lab",
    implementationStatus: "runtime_adapter",
    inputBasis: "airborne_transmission_loss_curve",
    metricFamily: "airborne",
    metricId: "STC",
    notes: [
      "Gate S remains the opening/leak composite Rw owner.",
      "Gate AH applies the Gate S Rw loss to the selected host-wall frequency curve, then runs the ASTM E413 STC contour.",
      "The adapter is source-absent and cannot promote source rows, field metrics, or building prediction metrics."
    ],
    ratingStandard: "ASTM E413",
    requiredContextInputs: [
      "hostWallAreaM2",
      "openingLeakElements",
      "hostWallTransmissionLossCurve",
      "GateSOpeningLeakCompositeRwLossDb"
    ],
    sourceMetricIds: ["Rw"]
  });
}

export function maybeBuildGateAHOpeningLeakStcSpectrumAdapter(input: {
  airborneContext?: AirborneContext | null;
  gateSRuntime?: GateSOpeningLeakCompositeRuntimeResult | null;
  hostCurve: TransmissionLossCurve;
  hostWallRwDb: number;
  targetOutputs: readonly RequestedOutputId[];
}): GateAHOpeningLeakStcSpectrumAdapterResult | null {
  const gateSRuntime = input.gateSRuntime;
  if (
    !gateSRuntime ||
    gateSRuntime.status !== "runtime_corridor_promoted" ||
    !input.targetOutputs.includes("STC") ||
    !isElementLabContext(input.airborneContext) ||
    typeof gateSRuntime.runtimeRwDb !== "number" ||
    !Number.isFinite(gateSRuntime.runtimeRwDb) ||
    !Number.isFinite(input.hostWallRwDb)
  ) {
    return null;
  }

  const rwLossDb = round1(input.hostWallRwDb - gateSRuntime.runtimeRwDb);
  if (!(rwLossDb > 0)) {
    return null;
  }

  const shiftedCurve = buildShiftedCurve({
    compositeCurve: gateSRuntime.compositeCurve,
    hostCurve: input.hostCurve,
    rwLossDb
  });
  const shiftedRatings = buildRatingsFromCurve(
    shiftedCurve.frequenciesHz,
    shiftedCurve.transmissionLossDb,
    { contextMode: "element_lab" }
  );

  return {
    ratingAdapterBasis: buildStcAdapterBasis(),
    runtimeStcDb: shiftedRatings.astmE413.STC,
    rwLossDb,
    shiftedCurve,
    warning: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_WARNING
  };
}

export function buildGateAHOpeningLeakStcSpectrumAdapterContract() {
  return {
    landedGate: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_PLAN,
    numericRuntimeBehaviorChange: true,
    previousRuntimeMethod: GATE_S_OPENING_LEAK_COMPOSITE_RUNTIME_METHOD,
    ratingAdapterId: "astm_e413_stc_from_airborne_transmission_loss_curve",
    ratingAdapterRuntimeMethod: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_RUNTIME_METHOD,
    selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
    selectedNextAction: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
    selectedNextFile: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
    selectionStatus: GATE_AH_OPENING_LEAK_STC_SPECTRUM_ADAPTER_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    toleranceDb: GATE_R_OPENING_LEAK_COMPOSITE_TOLERANCE_DB
  } as const;
}
