import type { AirborneContextMode, AssemblyRatings, FieldAirborneRating, TransmissionLossCurve } from "@dynecho/shared";

import { clamp, ksRound1, log10, log10Safe } from "./math";

const RW_FREQS = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
const RW_OFFSETS = [-19, -16, -13, -10, -7, -4, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
const STC_FREQS = [125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000];
const STC_OFFSETS = [-16, -13, -10, -7, -4, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ISO_SPECTRUM_C = [-29, -26, -23, -21, -19, -17, -15, -13, -12, -11, -10, -9, -9, -9, -9, -9];
const ISO_SPECTRUM_CTR = [-20, -20, -18, -16, -14, -12, -10, -9, -8, -9, -10, -11, -13, -15, -17, -19];
export const TL_PLOT_FREQS = [63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000];
const REFERENCE_ABSORPTION_AREA_M2 = 10;
const REFERENCE_REVERB_TIME_S = 0.5;
const SABINE_COEFFICIENT = 0.16;

export type CurveRatingContext = {
  contextMode?: AirborneContextMode | null;
  panelHeightMm?: number | null;
  panelWidthMm?: number | null;
  receivingRoomRt60S?: number | null;
  receivingRoomVolumeM3?: number | null;
};

export function sortUniqueFrequencies(frequencies: readonly number[]): number[] {
  return Array.from(new Set(frequencies.filter((entry) => Number.isFinite(entry) && entry > 0))).sort(
    (left, right) => left - right
  );
}

function sampleLogCurve(
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[],
  targetsHz: readonly number[]
): number[] {
  if (frequenciesHz.length === 0 || frequenciesHz.length !== transmissionLossDb.length) {
    return [];
  }

  const points = frequenciesHz
    .map((frequencyHz, index) => ({
      frequencyHz,
      valueDb: transmissionLossDb[index]
    }))
    .filter((point) => point.frequencyHz > 0 && Number.isFinite(point.valueDb))
    .sort((left, right) => left.frequencyHz - right.frequencyHz);

  if (points.length === 0) {
    return [];
  }

  return targetsHz.map((targetHz) => {
    if (targetHz <= points[0].frequencyHz) {
      return points[0].valueDb;
    }

    if (targetHz >= points[points.length - 1].frequencyHz) {
      return points[points.length - 1].valueDb;
    }

    for (let index = 0; index < points.length - 1; index += 1) {
      const left = points[index];
      const right = points[index + 1];

      if (targetHz < left.frequencyHz || targetHz > right.frequencyHz) {
        continue;
      }

      const position =
        (log10(targetHz) - log10(left.frequencyHz)) /
        (log10(right.frequencyHz) - log10(left.frequencyHz));

      return left.valueDb + (position * (right.valueDb - left.valueDb));
    }

    return points[points.length - 1].valueDb;
  });
}

function contourRating(testValues: readonly number[], offsets: readonly number[]): number {
  if (testValues.length !== offsets.length) {
    return 0;
  }

  let best = 0;

  for (let rating = 20; rating <= 85; rating += 1) {
    const deficits = offsets.map((offset, index) => Math.max(0, (rating + offset) - testValues[index]));
    const deficitSum = deficits.reduce((sum, value) => sum + value, 0);
    const deficitMax = deficits.reduce((max, value) => Math.max(max, value), 0);

    if (deficitSum <= 32 && deficitMax <= 8) {
      best = rating;
    }
  }

  return best;
}

function computeWeightedApparentReduction(
  samples: readonly number[],
  referenceSpectrum: readonly number[]
): number {
  if (samples.length !== referenceSpectrum.length) {
    return 0;
  }

  const sourceEnergy = referenceSpectrum.reduce((sum, value) => sum + Math.pow(10, value / 10), 0);

  if (!(sourceEnergy > 0)) {
    return 0;
  }

  const transmittedEnergy = samples.reduce(
    (sum, value, index) => sum + Math.pow(10, ((referenceSpectrum[index] - value) / 10)),
    0
  );

  if (!(transmittedEnergy > 0)) {
    return 95;
  }

  return -10 * log10Safe(transmittedEnergy / sourceEnergy);
}

function applyCurveOffset(valuesDb: readonly number[], offsetDb: number): number[] {
  if (!Number.isFinite(offsetDb) || Math.abs(offsetDb) < 1e-9) {
    return [...valuesDb];
  }

  return valuesDb.map((valueDb) => clamp(valueDb + offsetDb, 0, 95));
}

function getPanelAreaM2(context?: CurveRatingContext | null): number | null {
  const panelWidthMm = context?.panelWidthMm;
  const panelHeightMm = context?.panelHeightMm;

  if (
    typeof panelWidthMm !== "number" ||
    typeof panelHeightMm !== "number" ||
    !Number.isFinite(panelWidthMm) ||
    !Number.isFinite(panelHeightMm) ||
    !(panelWidthMm > 0) ||
    !(panelHeightMm > 0)
  ) {
    return null;
  }

  return (panelWidthMm * panelHeightMm) / 1_000_000;
}

function computeEquivalentAbsorptionArea(context?: CurveRatingContext | null): {
  absorptionAreaM2Sabine: number | null;
  available: boolean;
} {
  const receivingRoomVolumeM3 = context?.receivingRoomVolumeM3;
  const receivingRoomRt60S = context?.receivingRoomRt60S;

  if (
    typeof receivingRoomVolumeM3 !== "number" ||
    typeof receivingRoomRt60S !== "number" ||
    !Number.isFinite(receivingRoomVolumeM3) ||
    !Number.isFinite(receivingRoomRt60S) ||
    !(receivingRoomVolumeM3 > 0) ||
    !(receivingRoomRt60S > 0)
  ) {
    return {
      absorptionAreaM2Sabine: null,
      available: false
    };
  }

  const absorptionAreaM2Sabine = ksRound1((SABINE_COEFFICIENT * receivingRoomVolumeM3) / Math.max(receivingRoomRt60S, 1e-6));

  return {
    absorptionAreaM2Sabine,
    available: absorptionAreaM2Sabine > 0
  };
}

function buildFieldAirborneRatings(
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[],
  context?: CurveRatingContext | null
): FieldAirborneRating {
  const rwPrime = computeRwFromCurve(frequenciesHz, transmissionLossDb);
  const c = computeSpectrumAdaptationTerm(frequenciesHz, transmissionLossDb, ISO_SPECTRUM_C);
  const ctr = computeSpectrumAdaptationTerm(frequenciesHz, transmissionLossDb, ISO_SPECTRUM_CTR);
  const partitionAreaM2 = getPanelAreaM2(context);
  const receivingRoomVolumeM3 =
    typeof context?.receivingRoomVolumeM3 === "number" && Number.isFinite(context.receivingRoomVolumeM3) && context.receivingRoomVolumeM3 > 0
      ? context.receivingRoomVolumeM3
      : null;
  const field: FieldAirborneRating = {
    basis: "apparent_curve_overlay",
    C: c,
    Ctr: ctr,
    compositePrime: `${rwPrime} (${c >= 0 ? "+" : ""}${c};${ctr >= 0 ? "+" : ""}${ctr})`,
    estimated: true,
    RwPrime: rwPrime
  };

  if (!(partitionAreaM2 && partitionAreaM2 > 0 && receivingRoomVolumeM3 && receivingRoomVolumeM3 > 0)) {
    field.geometryMissing = true;
    field.geometryNeeded = ["panelWidthMm", "panelHeightMm", "receivingRoomVolumeM3"].filter((key) => {
      if (key === "receivingRoomVolumeM3") {
        return !(receivingRoomVolumeM3 && receivingRoomVolumeM3 > 0);
      }

      if (key === "panelWidthMm") {
        return !(typeof context?.panelWidthMm === "number" && context.panelWidthMm > 0);
      }

      return !(typeof context?.panelHeightMm === "number" && context.panelHeightMm > 0);
    });
  } else {
    const normalizationDb = ksRound1(
      10 * log10Safe(((SABINE_COEFFICIENT / REFERENCE_REVERB_TIME_S) * receivingRoomVolumeM3) / partitionAreaM2)
    );
    const dntCurveDb = applyCurveOffset(transmissionLossDb, normalizationDb);
    const dnTw = computeRwFromCurve(frequenciesHz, dntCurveDb);
    const dnTC = computeSpectrumAdaptationTerm(frequenciesHz, dntCurveDb, ISO_SPECTRUM_C);
    const dnTCtr = computeSpectrumAdaptationTerm(frequenciesHz, dntCurveDb, ISO_SPECTRUM_CTR);

    field.DnTw = dnTw;
    field.DnTC = dnTC;
    field.DnTCtr = dnTCtr;
    field.DnTA = ksRound1(dnTw + dnTC);
    field.normalizationDb = normalizationDb;
    field.partitionAreaM2 = ksRound1(partitionAreaM2);
    field.receivingRoomVolumeM3 = ksRound1(receivingRoomVolumeM3);
    field.basis = "apparent_curve_overlay + 10log10(0.32V/S)";
  }

  if (partitionAreaM2 && partitionAreaM2 > 0) {
    const dnOffsetDb = ksRound1(10 * log10Safe(REFERENCE_ABSORPTION_AREA_M2 / partitionAreaM2));
    const dnCurveDb = applyCurveOffset(transmissionLossDb, dnOffsetDb);
    const dnW = computeRwFromCurve(frequenciesHz, dnCurveDb);
    const dnC = computeSpectrumAdaptationTerm(frequenciesHz, dnCurveDb, ISO_SPECTRUM_C);
    const dnCtr = computeSpectrumAdaptationTerm(frequenciesHz, dnCurveDb, ISO_SPECTRUM_CTR);

    field.DnW = dnW;
    field.DnC = dnC;
    field.DnCtr = dnCtr;
    field.DnA = ksRound1(dnW + dnC);
    field.partitionAreaM2 = ksRound1(partitionAreaM2);
    field.dnOffsetDb = dnOffsetDb;
    field.dnBasis = "apparent_curve_overlay + 10log10(A0/S)";

    const absorptionInfo = computeEquivalentAbsorptionArea(context);
    if (absorptionInfo.available && absorptionInfo.absorptionAreaM2Sabine && absorptionInfo.absorptionAreaM2Sabine > 0) {
      field.absorptionAreaM2Sabine = absorptionInfo.absorptionAreaM2Sabine;
      if (typeof context?.receivingRoomRt60S === "number" && context.receivingRoomRt60S > 0) {
        field.receivingRoomRt60S = ksRound1(context.receivingRoomRt60S);
      }
      field.levelDifferenceOffsetDb = ksRound1(
        10 * log10Safe(absorptionInfo.absorptionAreaM2Sabine / partitionAreaM2)
      );
    } else if (!(typeof context?.receivingRoomRt60S === "number" && context.receivingRoomRt60S > 0)) {
      field.absorptionDataMissing = true;
      field.absorptionDataNeeded = ["receivingRoomRt60S", "receivingRoomVolumeM3"];
    }
  } else {
    field.absorptionDataMissing = true;
    field.absorptionDataNeeded = ["panelWidthMm", "panelHeightMm"];
  }

  return field;
}

export function computeRwFromCurve(frequenciesHz: readonly number[], transmissionLossDb: readonly number[]): number {
  const samples = sampleLogCurve(frequenciesHz, transmissionLossDb, RW_FREQS);

  if (samples.length !== RW_FREQS.length) {
    return 0;
  }

  return contourRating(samples, RW_OFFSETS);
}

export function computeStcFromCurve(frequenciesHz: readonly number[], transmissionLossDb: readonly number[]): number {
  const samples = sampleLogCurve(frequenciesHz, transmissionLossDb, STC_FREQS);

  if (samples.length !== STC_FREQS.length) {
    return 0;
  }

  return contourRating(samples, STC_OFFSETS);
}

function computeSpectrumAdaptationTerm(
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[],
  referenceSpectrum: readonly number[]
): number {
  const samples = sampleLogCurve(frequenciesHz, transmissionLossDb, RW_FREQS);

  if (samples.length !== RW_FREQS.length || referenceSpectrum.length !== RW_FREQS.length) {
    return 0;
  }

  const rw = contourRating(samples, RW_OFFSETS);
  const apparentReduction = computeWeightedApparentReduction(samples, referenceSpectrum);

  return ksRound1(apparentReduction - rw);
}

export function massLawTransmissionLoss(frequencyHz: number, surfaceMassKgM2: number): number {
  if (!(frequencyHz > 0) || !(surfaceMassKgM2 > 0)) {
    return 0;
  }

  return (20 * log10(frequencyHz * surfaceMassKgM2)) - 48;
}

export function buildCalibratedMassLawCurve(
  surfaceMassKgM2: number,
  targetRwDb: number,
  frequenciesHz: readonly number[] = TL_PLOT_FREQS
): TransmissionLossCurve & { baseRw: number; shift: number } {
  const sortedFrequenciesHz = sortUniqueFrequencies(frequenciesHz);
  const baseValuesDb = sortedFrequenciesHz.map((frequencyHz) =>
    massLawTransmissionLoss(frequencyHz, surfaceMassKgM2)
  );
  const baseRw = computeRwFromCurve(sortedFrequenciesHz, baseValuesDb);
  const shift = targetRwDb - baseRw;
  const transmissionLossDb = baseValuesDb.map((valueDb) => clamp(valueDb + shift, 0, 95));

  return {
    baseRw,
    frequenciesHz: sortedFrequenciesHz,
    shift,
    transmissionLossDb
  };
}

export function buildRatingsFromCurve(
  frequenciesHz: readonly number[],
  transmissionLossDb: readonly number[],
  context?: CurveRatingContext | null
): AssemblyRatings {
  const rw = computeRwFromCurve(frequenciesHz, transmissionLossDb);
  const c = computeSpectrumAdaptationTerm(frequenciesHz, transmissionLossDb, ISO_SPECTRUM_C);
  const ctr = computeSpectrumAdaptationTerm(frequenciesHz, transmissionLossDb, ISO_SPECTRUM_CTR);
  const stc = computeStcFromCurve(frequenciesHz, transmissionLossDb);
  const contextMode = context?.contextMode ?? "element_lab";
  const apparentMode = contextMode !== "element_lab";
  const field = apparentMode ? buildFieldAirborneRatings(frequenciesHz, transmissionLossDb, context) : undefined;

  return {
    astmE413: {
      ...(apparentMode
        ? {
            ASTC: stc,
            basis: "apparent_curve",
            estimated: true
          }
        : {}),
      STC: stc
    },
    ...(field ? { field } : {}),
    iso717: {
      C: c,
      Ctr: ctr,
      Rw: rw,
      ...(apparentMode ? { RwPrime: rw, apparent: true } : {}),
      composite: `${rw} (${c >= 0 ? "+" : ""}${c};${ctr >= 0 ? "+" : ""}${ctr})`,
      descriptor: apparentMode ? "R'w" : "Rw"
    }
  };
}
