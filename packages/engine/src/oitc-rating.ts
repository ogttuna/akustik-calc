import type { AstmE1332Rating, TransmissionLossCurve } from "@dynecho/shared";

import { pickRequiredFrequencyCoverage } from "./rating-band-coverage";

export const ASTM_E1332_OITC_BANDS_HZ = [
  80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
  2000, 2500, 3150, 4000
] as const;

const ASTM_E1332_REFERENCE_SOURCE_SPECTRUM_DB = [
  103, 102, 101, 98, 97, 95, 94, 93, 93, 91, 90, 89, 89, 88, 88, 87, 85, 84
] as const;

const ASTM_E1332_A_WEIGHTING_DB = [
  -22.5, -19.1, -16.1, -13.4, -10.9, -8.6, -6.6, -4.8, -3.2, -1.9, -0.8, 0,
  0.6, 1.0, 1.2, 1.3, 1.2, 1.0
] as const;

export const ASTM_E1332_OITC_BAND_SET = "one_third_octave_80_4000" as const;
export const ASTM_E1332_REFERENCE_OUTDOOR_A_WEIGHTED_LEVEL_DB = 100.13;

export type AstmE1332OitcResult = AstmE1332Rating & {
  readonly indoorAWeightedLevelDb: number;
  readonly outdoorAWeightedLevelDb: typeof ASTM_E1332_REFERENCE_OUTDOOR_A_WEIGHTED_LEVEL_DB;
};

function energySum(valuesDb: readonly number[]): number {
  return valuesDb.reduce((sum, value) => sum + (10 ** (value / 10)), 0);
}

function energyToDb(energy: number): number | null {
  if (!(energy > 0) || !Number.isFinite(energy)) {
    return null;
  }

  return 10 * Math.log10(energy);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeAstmE1332OitcFromCurve(
  curve: TransmissionLossCurve | null | undefined
): AstmE1332OitcResult | null {
  if (!curve) {
    return null;
  }

  const coverage = pickRequiredFrequencyCoverage({
    frequenciesHz: curve.frequenciesHz,
    requiredFrequenciesHz: ASTM_E1332_OITC_BANDS_HZ,
    valuesDb: curve.transmissionLossDb
  });
  if (coverage.status !== "complete") {
    return null;
  }

  const indoorSpectrumDb = ASTM_E1332_REFERENCE_SOURCE_SPECTRUM_DB.map((sourceLevel, index) =>
    sourceLevel - coverage.samplesDb[index] + ASTM_E1332_A_WEIGHTING_DB[index]
  );
  const indoorAWeightedLevelDb = energyToDb(energySum(indoorSpectrumDb));

  if (indoorAWeightedLevelDb === null) {
    return null;
  }

  return {
    OITC: Math.round(ASTM_E1332_REFERENCE_OUTDOOR_A_WEIGHTED_LEVEL_DB - indoorAWeightedLevelDb),
    bandSet: ASTM_E1332_OITC_BAND_SET,
    basis: "ASTM E1332 reference outdoor spectrum minus calculated outdoor-indoor transmission-loss curve",
    estimated: true,
    indoorAWeightedLevelDb: round2(indoorAWeightedLevelDb),
    outdoorAWeightedLevelDb: ASTM_E1332_REFERENCE_OUTDOOR_A_WEIGHTED_LEVEL_DB
  };
}
