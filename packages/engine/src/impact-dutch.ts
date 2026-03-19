import { ksRound1, log10Safe } from "./math";

const DUTCH_IMPACT_OCTAVE_FREQS = [125, 250, 500, 1000, 2000] as const;
const DUTCH_IMPACT_WEIGHTING_DB = -15;

function areSameFrequencies(left: readonly number[], right: readonly number[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function supportsDutchLnTAFromBands(frequenciesHz: readonly number[]): boolean {
  return areSameFrequencies(frequenciesHz, DUTCH_IMPACT_OCTAVE_FREQS);
}

export function computeDutchLnTAFromBands(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[]
): number {
  if (!supportsDutchLnTAFromBands(frequenciesHz) || frequenciesHz.length !== levelsDb.length) {
    return Number.NaN;
  }

  const energeticSum = levelsDb.reduce((sum, value) => {
    if (!Number.isFinite(value)) {
      return Number.NaN;
    }

    return sum + Math.pow(10, value / 10);
  }, 0);

  if (!(energeticSum > 0) || !Number.isFinite(energeticSum)) {
    return Number.NaN;
  }

  return ksRound1(10 * log10Safe(energeticSum) + DUTCH_IMPACT_WEIGHTING_DB);
}
