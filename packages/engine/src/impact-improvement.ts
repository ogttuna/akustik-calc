import type { ExactImpactImprovementSource, ImpactCalculation } from "@dynecho/shared";

import { getImpactConfidenceForBasis } from "./impact-confidence";
import { buildUniformImpactMetricBasis } from "./impact-metric-basis";
import {
  computeImpactWeightedRating,
  IMPACT_REFERENCE_HEAVY_FLOOR_FREQS,
  IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS,
  pickNominalImpactBandValues
} from "./impact-iso717";
import { ksRound1 } from "./math";

export function buildExactImpactImprovementReference(source: ExactImpactImprovementSource): ImpactCalculation | null {
  if (source.referenceFloorType !== "heavy_standard") {
    return null;
  }

  const improvementCurve = pickNominalImpactBandValues(
    source.frequenciesHz,
    source.improvementDb,
    IMPACT_REFERENCE_HEAVY_FLOOR_FREQS
  );
  if (improvementCurve.length !== IMPACT_REFERENCE_HEAVY_FLOOR_FREQS.length) {
    return null;
  }

  const treatedReferenceLevels = IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS.map((value, index) =>
    ksRound1(value - improvementCurve[index])
  );
  const bareWeighted = computeImpactWeightedRating(IMPACT_REFERENCE_HEAVY_FLOOR_FREQS, IMPACT_REFERENCE_HEAVY_FLOOR_LEVELS);
  const treatedWeighted = computeImpactWeightedRating(IMPACT_REFERENCE_HEAVY_FLOOR_FREQS, treatedReferenceLevels);

  if (!Number.isFinite(bareWeighted.value) || !Number.isFinite(treatedWeighted.value)) {
    return null;
  }

  const bareReferenceLnW = ksRound1(bareWeighted.value);
  const treatedReferenceLnW = ksRound1(treatedWeighted.value);
  const deltaLw = ksRound1(bareReferenceLnW - treatedReferenceLnW);
  const metricBasis = buildUniformImpactMetricBasis(
    {
      DeltaLw: deltaLw,
      LnW: treatedReferenceLnW
    },
    "exact_source_improvement_curve_iso7172"
  );

  return {
    DeltaLw: deltaLw,
    LnW: treatedReferenceLnW,
    availableOutputs: ["Ln,w", "DeltaLw"],
    bandSet: "one_third_octave_100_3150",
    bareReferenceLnW,
    basis: "exact_source_improvement_curve_iso7172",
    confidence: getImpactConfidenceForBasis("exact_source_improvement_curve_iso7172"),
    labOrField: "lab",
    metricBasis,
    notes: [
      "DeltaLw was computed as Ln,w(reference floor) - Ln,w(treated reference floor) on the ISO 717-2 heavy reference floor.",
      "The carried Ln,w here is the treated heavy-reference result, not a live assembly predictor result."
    ],
    referenceFloorType: "heavy_standard",
    scope: "exact_improvement_reference_floor",
    standardMethod: source.standardMethod,
    treatedReferenceLnW
  };
}
