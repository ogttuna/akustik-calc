import { ksRound1, log10Safe } from "./math";

export const IMPACT_RATING_FREQS_THIRD = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
export const IMPACT_RATING_OFFSETS_THIRD = [2, 2, 2, 2, 2, 2, 1, 0, -1, -2, -3, -6, -9, -12, -15, -18];
export const IMPACT_RATING_FREQS_OCTAVE = [125, 250, 500, 1000, 2000];
export const IMPACT_RATING_OFFSETS_OCTAVE = [2, 2, 0, -3, -16];
export const IMPACT_CI_FREQS_THIRD = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];
export const IMPACT_CI_FREQS_OCTAVE = [125, 250, 500, 1000, 2000];
export const IMPACT_CI50_2500_FREQS_THIRD = [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500];
export const IMPACT_REFERENCE_HEAVY_FLOOR_FREQS = [100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
export const IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS = [67, 67.5, 68, 68.5, 69, 69.5, 70, 70.5, 71, 71.5, 72, 72, 72, 72, 72, 72];

export function pickNominalImpactBandValues(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[],
  targetsHz: readonly number[]
): number[] {
  const byFrequency = new Map<number, number>();

  for (let index = 0; index < frequenciesHz.length; index += 1) {
    const frequency = frequenciesHz[index];
    const value = levelsDb[index];

    if (Number.isFinite(frequency) && Number.isFinite(value)) {
      byFrequency.set(frequency, value);
    }
  }

  const picked = targetsHz.map((frequency) => byFrequency.get(frequency));

  if (picked.some((value) => !Number.isFinite(value))) {
    return [];
  }

  return picked as number[];
}

function computeImpactContourRating(
  testValues: readonly number[],
  offsets: readonly number[],
  sumLimitDb: number
): number {
  if (testValues.length !== offsets.length) {
    return Number.NaN;
  }

  for (let rating = 0; rating <= 120; rating += 1) {
    const exceedanceSum = testValues.reduce((sum, value, index) => {
      return sum + Math.max(0, value - (rating + offsets[index]));
    }, 0);

    if (exceedanceSum <= sumLimitDb) {
      return rating;
    }
  }

  return Number.NaN;
}

export function computeImpactWeightedRating(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[]
): { bandSet: string; value: number } {
  const oneThirdValues = pickNominalImpactBandValues(frequenciesHz, levelsDb, IMPACT_RATING_FREQS_THIRD);
  if (oneThirdValues.length === IMPACT_RATING_FREQS_THIRD.length) {
    return {
      bandSet: "one_third_octave_100_3150",
      value: computeImpactContourRating(oneThirdValues, IMPACT_RATING_OFFSETS_THIRD, 32)
    };
  }

  const octaveValues = pickNominalImpactBandValues(frequenciesHz, levelsDb, IMPACT_RATING_FREQS_OCTAVE);
  if (octaveValues.length === IMPACT_RATING_FREQS_OCTAVE.length) {
    return {
      bandSet: "octave_125_2000",
      value: computeImpactContourRating(octaveValues, IMPACT_RATING_OFFSETS_OCTAVE, 10)
    };
  }

  return {
    bandSet: "",
    value: Number.NaN
  };
}

function computeImpactSpectrumAdaptationTermFromValues(
  measuredValues: readonly number[],
  weightedValue: number
): number {
  if (!Number.isFinite(weightedValue) || measuredValues.length === 0) {
    return Number.NaN;
  }

  const energeticSum = measuredValues.reduce((sum, value) => sum + Math.pow(10, ksRound1(value) / 10), 0);
  if (!(energeticSum > 0)) {
    return Number.NaN;
  }

  const overallLevel = Math.round(10 * log10Safe(energeticSum));
  return overallLevel - Math.round(weightedValue) - 15;
}

export function computeImpactSpectrumAdaptationTerms(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[],
  weightedValue: number
): {
  ci: number;
  ci50_2500: number;
  ci50_2500BandSet: string;
  ciBandSet: string;
} {
  if (!Number.isFinite(weightedValue)) {
    return {
      ci: Number.NaN,
      ci50_2500: Number.NaN,
      ci50_2500BandSet: "",
      ciBandSet: ""
    };
  }

  const oneThirdCiValues = pickNominalImpactBandValues(frequenciesHz, levelsDb, IMPACT_CI_FREQS_THIRD);
  if (oneThirdCiValues.length === IMPACT_CI_FREQS_THIRD.length) {
    const oneThirdCi50Values = pickNominalImpactBandValues(frequenciesHz, levelsDb, IMPACT_CI50_2500_FREQS_THIRD);

    return {
      ci: computeImpactSpectrumAdaptationTermFromValues(oneThirdCiValues, weightedValue),
      ci50_2500:
        oneThirdCi50Values.length === IMPACT_CI50_2500_FREQS_THIRD.length
          ? computeImpactSpectrumAdaptationTermFromValues(oneThirdCi50Values, weightedValue)
          : Number.NaN,
      ci50_2500BandSet:
        oneThirdCi50Values.length === IMPACT_CI50_2500_FREQS_THIRD.length ? "one_third_octave_50_2500" : "",
      ciBandSet: "one_third_octave_100_2500"
    };
  }

  const octaveCiValues = pickNominalImpactBandValues(frequenciesHz, levelsDb, IMPACT_CI_FREQS_OCTAVE);
  if (octaveCiValues.length === IMPACT_CI_FREQS_OCTAVE.length) {
    return {
      ci: computeImpactSpectrumAdaptationTermFromValues(octaveCiValues, weightedValue),
      ci50_2500: Number.NaN,
      ci50_2500BandSet: "",
      ciBandSet: "octave_125_2000"
    };
  }

  return {
    ci: Number.NaN,
    ci50_2500: Number.NaN,
    ci50_2500BandSet: "",
    ciBandSet: ""
  };
}
