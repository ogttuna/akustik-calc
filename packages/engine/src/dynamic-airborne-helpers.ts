// Pure helpers carved out of `dynamic-airborne.ts` during
// `dynamic_airborne_split_refactor_v1` commit 1. This file owns the
// material-family-agnostic curve math, spectrum-weight utilities,
// physical constants, and delegate blending — everything with no
// family-specific knowledge. `dynamic-airborne.ts` re-imports these
// names so callers see zero behaviour change.
//
// Split rationale:
// - Keeps the remaining `dynamic-airborne.ts` composition + family
//   logic smaller and more focused.
// - Lets the upcoming family-detection and predictor-scoring carves
//   import from a single well-bounded helpers module without
//   circular imports (helpers depend on nothing family-specific).

import type {
  AirborneContext,
  AssemblyRatings,
  DynamicAirborneDelegateMethod,
  DynamicAirborneFamily,
  DynamicAirborneTrace,
  ResolvedLayer,
  TransmissionLossCurve
} from "@dynecho/shared";

// Shared types for the dynamic-airborne split. Live here (not in
// `dynamic-airborne.ts`) so the remaining composition file and every
// future carved module can import from one side without circular
// dependencies.

export type DynamicAirborneResult = {
  curve: TransmissionLossCurve;
  id: "dynamic";
  label: string;
  ratings: AssemblyRatings;
  rw: number;
  trace: DynamicAirborneTrace;
  warnings: string[];
};

export type DynamicAirborneOptions = {
  disableFramedReinforcementMonotonicFloor?: boolean;
  disableFamilyBoundaryHold?: boolean;
  airborneContext?: AirborneContext | null;
  disableMasonryDavyCap?: boolean;
  disableLinedMassiveMasonryFloor?: boolean;
  disableNarrowHeavyDoubleLeafGapGuard?: boolean;
  disableSingleLeafMasonryFloor?: boolean;
  forcedFamily?: DynamicAirborneFamily | null;
  framedReinforcementMonotonicGuardDepth?: number;
  frequenciesHz?: readonly number[];
  linedMassiveMasonryFloorGuardDepth?: number;
  narrowHeavyDoubleLeafGapGuardDepth?: number;
  singleLeafMasonryFloorGuardDepth?: number;
  screeningEstimatedRwDb: number;
};

export type DynamicAirborneComposer = (
  layers: readonly ResolvedLayer[],
  options: DynamicAirborneOptions
) => DynamicAirborneResult;

import {
  buildRatingsFromCurve,
  buildCalibratedMassLawCurve
} from "./curve-rating";
import {
  getAirborneCalculatorLabel,
  type ComparableAirborneCalculatorId
} from "./airborne-calculator";
import { clamp } from "./math";

export type DelegateCurve = {
  curve: TransmissionLossCurve;
  label: string;
  method: DynamicAirborneDelegateMethod;
  rw: number;
};

export type DelegateBlend = {
  adjustmentsDb: number;
  delegates: Array<{ method: DynamicAirborneDelegateMethod; weight: number }>;
  selectedMethod: DynamicAirborneDelegateMethod;
  strategy: string;
};

// Physical constants — lifted verbatim from the pre-split file so
// future predictor-scoring helpers can import from a single module.
export const DYNAMIC_SOUND_SPEED = 343;
export const DYNAMIC_AIR_DENSITY = 1.21;

export function shiftCurve(curve: TransmissionLossCurve, shiftDb: number): TransmissionLossCurve {
  return {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: curve.transmissionLossDb.map((value) => clamp(value + shiftDb, 0, 95))
  };
}

export function interpolateLinear(
  x: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  if (!Number.isFinite(x1) || !Number.isFinite(x2) || Math.abs(x2 - x1) < 1e-9) {
    return y1;
  }

  const t = clamp((x - x1) / (x2 - x1), 0, 1);
  return y1 + (t * (y2 - y1));
}

export function interpolateRwSeries(
  thicknessMm: number,
  points: readonly { thicknessMm: number; rw: number }[]
): number {
  if (points.length === 0) {
    return 0;
  }

  if (points.length === 1) {
    return points[0]?.rw ?? 0;
  }

  const first = points[0];
  const second = points[1];
  const last = points[points.length - 1];
  const penultimate = points[points.length - 2];

  if (!first || !second || !last || !penultimate) {
    return points[0]?.rw ?? 0;
  }

  if (thicknessMm <= first.thicknessMm) {
    return interpolateLinear(thicknessMm, first.thicknessMm, first.rw, second.thicknessMm, second.rw);
  }

  for (let index = 1; index < points.length; index += 1) {
    const next = points[index];
    const previous = points[index - 1];

    if (!next || !previous) {
      continue;
    }

    if (thicknessMm <= next.thicknessMm) {
      return interpolateLinear(thicknessMm, previous.thicknessMm, previous.rw, next.thicknessMm, next.rw);
    }
  }

  return interpolateLinear(thicknessMm, penultimate.thicknessMm, penultimate.rw, last.thicknessMm, last.rw);
}

export function smoothstep01(value: number): number {
  const t = clamp(value, 0, 1);
  return (t * t) * (3 - (2 * t));
}

export function octaveBandWindowWeight(
  freqHz: number,
  startHz: number,
  endHz: number,
  transitionOctaves = 0.3
): number {
  const frequency = Math.max(freqHz, 1e-9);
  const start = Math.max(startHz, 1e-9);
  const end = Math.max(endHz, start + 1e-6);
  const transition = clamp(transitionOctaves, 0.05, 1.5);
  const left = smoothstep01((Math.log2(frequency / start) + transition) / (2 * transition));
  const right = smoothstep01((Math.log2(end / frequency) + transition) / (2 * transition));

  return clamp(Math.min(left, right), 0, 1);
}

// Map a raw signal onto [0, 1] via a two-sided linear ramp between
// `start` and `end`. Returns 0 for malformed inputs or reversed
// ranges so callers do not need to defend against NaN / Infinity
// propagation. The family-decision-boundary summarizer composes
// several of these to blend heavy / light / asymmetric signals
// into a single class assignment.
export function normalizeBoundarySignal(value: number, start: number, end: number): number {
  if (!(Number.isFinite(value) && Number.isFinite(start) && Number.isFinite(end)) || end <= start) {
    return 0;
  }

  return clamp((value - start) / (end - start), 0, 1);
}

export function octaveGaussianDip(
  freqHz: number,
  centerHz: number,
  depthDb: number,
  sigmaOctaves = 0.25
): number {
  const frequency = Math.max(freqHz, 1e-9);
  const center = Math.max(centerHz, 1e-9);
  const depth = Math.max(depthDb, 0);
  const sigma = Math.max(sigmaOctaves, 0.05);

  if (!(depth > 0)) {
    return 0;
  }

  const x = Math.log2(frequency / center);
  return depth * Math.exp(-0.5 * Math.pow(x / sigma, 2));
}

export function computeContextMetric(
  curve: TransmissionLossCurve,
  context?: AirborneContext | null
): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);

  if (context?.contextMode && context.contextMode !== "element_lab") {
    return ratings.field?.DnTw ?? ratings.iso717.RwPrime ?? ratings.iso717.Rw;
  }

  return ratings.iso717.Rw;
}

export function anchorCurveToComputedMetric(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context: AirborneContext | null | undefined,
  computeMetric: (curve: TransmissionLossCurve) => number | null
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  let currentCurve: TransmissionLossCurve = {
    frequenciesHz: [...curve.frequenciesHz],
    transmissionLossDb: [...curve.transmissionLossDb]
  };
  let currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  const sourceValues = [...currentCurve.transmissionLossDb];

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const currentMetric = computeMetric(currentCurve);
    if (!(typeof currentMetric === "number" && Number.isFinite(currentMetric))) {
      return {
        applied: false,
        curve: {
          frequenciesHz: [...curve.frequenciesHz],
          transmissionLossDb: [...curve.transmissionLossDb]
        },
        ratings: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context)
      };
    }

    const delta = targetMetric - currentMetric;
    if (Math.abs(delta) < 0.05) {
      break;
    }

    currentCurve = shiftCurve(currentCurve, delta);
    currentRatings = buildRatingsFromCurve(currentCurve.frequenciesHz, currentCurve.transmissionLossDb, context);
  }

  return {
    applied: currentCurve.transmissionLossDb.some((value, index) => Math.abs(value - sourceValues[index]) > 1e-6),
    curve: currentCurve,
    ratings: currentRatings
  };
}

export function anchorCurveToMetric(
  curve: TransmissionLossCurve,
  targetMetric: number,
  context?: AirborneContext | null
): { applied: boolean; curve: TransmissionLossCurve; ratings: AssemblyRatings } {
  return anchorCurveToComputedMetric(curve, targetMetric, context, (candidateCurve) =>
    computeContextMetric(candidateCurve, context)
  );
}

export function computeMicroGapEquivalenceMetric(
  curve: TransmissionLossCurve,
  context?: AirborneContext | null
): number | null {
  const ratings = buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb, context);

  if (context?.contextMode && context.contextMode !== "element_lab") {
    return ratings.field?.RwPrime ?? ratings.iso717.RwPrime ?? ratings.field?.DnTw ?? ratings.iso717.Rw;
  }

  return ratings.iso717.Rw;
}

export function getDelegateLabel(method: DynamicAirborneDelegateMethod): string {
  if (method === "screening_mass_law_curve_seed_v3") {
    return "Screening Seed";
  }

  return getAirborneCalculatorLabel(method as ComparableAirborneCalculatorId);
}

export function buildScreeningDelegate(
  surfaceMassKgM2: number,
  screeningEstimatedRwDb: number,
  frequenciesHz: readonly number[]
): DelegateCurve {
  const curve = buildCalibratedMassLawCurve(surfaceMassKgM2, screeningEstimatedRwDb, frequenciesHz);

  return {
    curve: {
      frequenciesHz: [...curve.frequenciesHz],
      transmissionLossDb: [...curve.transmissionLossDb]
    },
    label: getDelegateLabel("screening_mass_law_curve_seed_v3"),
    method: "screening_mass_law_curve_seed_v3",
    rw: buildRatingsFromCurve(curve.frequenciesHz, curve.transmissionLossDb).iso717.Rw
  };
}

export function blendDelegateCurves(
  delegates: readonly DelegateCurve[],
  blend: DelegateBlend
): TransmissionLossCurve {
  const weights = new Map(blend.delegates.map((entry) => [entry.method, entry.weight]));
  const reference = delegates[0];
  const totalWeight = Math.max(
    blend.delegates.reduce((sum, entry) => sum + entry.weight, 0),
    1e-9
  );
  const transmissionLossDb = reference.curve.frequenciesHz.map((_, index) => {
    let blendedValue = 0;

    for (const delegate of delegates) {
      const weight = weights.get(delegate.method) ?? 0;
      blendedValue += delegate.curve.transmissionLossDb[index] * weight;
    }

    return clamp((blendedValue / totalWeight) + blend.adjustmentsDb, 0, 95);
  });

  return {
    frequenciesHz: [...reference.curve.frequenciesHz],
    transmissionLossDb
  };
}
