import type { ExactImpactSource, ImpactCalculation, RequestedOutputId } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildExactImpactFromSource } from "./impact-exact";
import {
  IMPACT_RATING_FREQS_THIRD,
  IMPACT_RATING_OFFSETS_THIRD
} from "./impact-iso717";
import { createImpactMetricBasis } from "./impact-metric-basis";
import { buildImpactTraceFromExactSource } from "./impact-trace";
import { ksRound1 } from "./math";
import { pickRequiredFrequencyCoverage } from "./rating-band-coverage";

export const ASTM_E989_IMPACT_RATING_BASIS = "astm_e989_impact_rating_metric_schema_adapter_bridge";
export const ASTM_E989_AIIC_METRIC_BASIS = "astm_e989_aiic_metric_schema_adapter_bridge";
export const ASTM_E989_IIC_METRIC_BASIS = "astm_e989_iic_metric_schema_adapter_bridge";
export const ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID = "floor.astm_e989_impact_rating.contour_runtime";

export const ASTM_E989_CONTOUR_SUM_DEFICIENCY_LIMIT_DB = 32;
export const ASTM_E989_CONTOUR_SINGLE_BAND_DEFICIENCY_LIMIT_DB = 8;
export const ASTM_E989_RATING_REFERENCE_OFFSET_DB = 110;

export type AstmE989ImpactRatingResult = {
  readonly bandSet: "one_third_octave_100_3150";
  readonly contourLevelAt500HzDb: number;
  readonly maxDeficiencyDb: number;
  readonly rating: number;
  readonly sumDeficiencyDb: number;
};

function normalizedStandardMethod(source: ExactImpactSource): string {
  return (source.standardMethod ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isAstmE989ImpactRatingSource(source: ExactImpactSource): boolean {
  const normalized = normalizedStandardMethod(source);
  const labOrField = source.labOrField ?? "lab";

  if (labOrField === "field") {
    return normalized.includes("ASTME1007") || normalized.includes("E1007");
  }

  return normalized.includes("ASTME492") || normalized.includes("E492");
}

function pickCompleteAstmOneThirdOctaveValues(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[]
): number[] {
  const coverage = pickRequiredFrequencyCoverage({
    frequenciesHz,
    requiredFrequenciesHz: IMPACT_RATING_FREQS_THIRD,
    valuesDb: levelsDb
  });

  return coverage.status === "complete" ? [...coverage.samplesDb] : [];
}

export function computeAstmE989ImpactRating(
  frequenciesHz: readonly number[],
  levelsDb: readonly number[]
): AstmE989ImpactRatingResult | null {
  const values = pickCompleteAstmOneThirdOctaveValues(frequenciesHz, levelsDb);
  if (values.length !== IMPACT_RATING_FREQS_THIRD.length) {
    return null;
  }

  for (let contourLevelAt500HzDb = 0; contourLevelAt500HzDb <= 120; contourLevelAt500HzDb += 1) {
    const deficiencies = values.map((value, index) =>
      Math.max(0, value - (contourLevelAt500HzDb + IMPACT_RATING_OFFSETS_THIRD[index]))
    );
    const sumDeficiencyDb = deficiencies.reduce((sum, value) => sum + value, 0);
    const maxDeficiencyDb = Math.max(...deficiencies);

    if (
      sumDeficiencyDb <= ASTM_E989_CONTOUR_SUM_DEFICIENCY_LIMIT_DB &&
      maxDeficiencyDb <= ASTM_E989_CONTOUR_SINGLE_BAND_DEFICIENCY_LIMIT_DB
    ) {
      return {
        bandSet: "one_third_octave_100_3150",
        contourLevelAt500HzDb,
        maxDeficiencyDb: ksRound1(maxDeficiencyDb),
        rating: ASTM_E989_RATING_REFERENCE_OFFSET_DB - contourLevelAt500HzDb,
        sumDeficiencyDb: ksRound1(sumDeficiencyDb)
      };
    }
  }

  return null;
}

export function buildAstmE989ImpactFromSource(source: ExactImpactSource): ImpactCalculation | null {
  if (!isAstmE989ImpactRatingSource(source)) {
    return null;
  }

  const ratingResult = computeAstmE989ImpactRating(source.frequenciesHz, source.levelsDb);
  if (!ratingResult || !Number.isFinite(ratingResult.rating) || ratingResult.rating <= 0) {
    return null;
  }

  const labOrField = source.labOrField ?? "lab";
  const isField = labOrField === "field";
  const metric: Extract<RequestedOutputId, "AIIC" | "IIC"> = isField ? "AIIC" : "IIC";
  const roundedRating = Math.round(ratingResult.rating);
  const availableOutputs: RequestedOutputId[] = [metric];
  const metricBasis = createImpactMetricBasis({
    AIIC: isField ? ASTM_E989_AIIC_METRIC_BASIS : undefined,
    IIC: isField ? undefined : ASTM_E989_IIC_METRIC_BASIS
  });

  return {
    AIIC: isField ? roundedRating : undefined,
    IIC: isField ? undefined : roundedRating,
    availableOutputs,
    bandSet: ratingResult.bandSet,
    basis: ASTM_E989_IMPACT_RATING_BASIS,
    confidence: getImpactConfidenceForBasis(ASTM_E989_IMPACT_RATING_BASIS),
    labOrField,
    metricBasis,
    notes: [
      `${isField ? "Field" : "Lab"} ASTM impact bands matched the one-third-octave 100..3150 Hz rating grid.`,
      `${metric} was calculated with the ASTM E989 contour bridge as ${ASTM_E989_RATING_REFERENCE_OFFSET_DB} minus the ${ratingResult.contourLevelAt500HzDb} dB contour level at 500 Hz.`,
      `Contour deficiencies summed to ${ratingResult.sumDeficiencyDb} dB with a ${ratingResult.maxDeficiencyDb} dB maximum single-band deficiency.`
    ],
    scope: "exact_band_curve",
    standardMethod: source.standardMethod,
    trace: buildImpactTraceFromExactSource(source)
  };
}

export function buildOwnedImpactFromExactSource(source: ExactImpactSource): ImpactCalculation | null {
  if (isAstmE989ImpactRatingSource(source)) {
    return buildAstmE989ImpactFromSource(source);
  }

  return buildExactImpactFromSource(source);
}
