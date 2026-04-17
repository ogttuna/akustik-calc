import type { ImpactPredictorInput } from "@dynecho/shared";

import { clamp } from "./math";
import { normalizePredictorToken } from "./predictor-family-estimate-shared";

export type ReinforcedConcreteCombinedVinylElasticCeilingMetrics = {
  candidateScore: number;
  lnW: number;
  rw: number;
};

export type ReinforcedConcreteCombinedVinylElasticCeilingCandidateTier =
  | "family_general"
  | "low_confidence";

export type ReinforcedConcreteCombinedVinylElasticCeilingCandidateSet = {
  candidateIds: readonly string[];
  candidateScores: readonly number[];
};

type ReinforcedConcreteCombinedVinylElasticCeilingGeometry = {
  boardThicknessMm: number;
  cavityDepthMm: number;
  cavityFillThicknessMm: number;
};

export const REINFORCED_CONCRETE_COMBINED_VINYL_ELASTIC_CEILING_CANDIDATE_IDS = [
  "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
] as const;

const REINFORCED_CONCRETE_COMBINED_VINYL_ELASTIC_CEILING_SCORE_OFFSETS = {
  family_general: [0, 0.4, 1.2],
  low_confidence: [2.5, 3.0, 4.7]
} as const satisfies Record<
  ReinforcedConcreteCombinedVinylElasticCeilingCandidateTier,
  readonly [number, number, number]
>;

const KNAUF_TIMBER_UNDERLAY_REFERENCE: ReinforcedConcreteCombinedVinylElasticCeilingGeometry = {
  boardThicknessMm: 13,
  cavityDepthMm: 100,
  cavityFillThicknessMm: 50
};

function thicknessNear(value: number | undefined, target: number, tolerance = 3): boolean {
  return typeof value === "number" && Math.abs(value - target) <= tolerance;
}

function calculateCandidateScore(value: number, target: number, scale: number): number {
  return Math.abs(value - target) / scale;
}

function calculateTimberUnderlayTopologyPenalty(
  geometry: ReinforcedConcreteCombinedVinylElasticCeilingGeometry | null | undefined
): number {
  if (!geometry) {
    return 0;
  }

  const cavityPenalty = calculateCandidateScore(
    geometry.cavityDepthMm,
    KNAUF_TIMBER_UNDERLAY_REFERENCE.cavityDepthMm,
    50
  );
  const fillPenalty = calculateCandidateScore(
    geometry.cavityFillThicknessMm,
    KNAUF_TIMBER_UNDERLAY_REFERENCE.cavityFillThicknessMm,
    50
  );
  const boardPenalty = calculateCandidateScore(
    geometry.boardThicknessMm,
    KNAUF_TIMBER_UNDERLAY_REFERENCE.boardThicknessMm,
    6
  );

  return Number((((cavityPenalty + fillPenalty + boardPenalty) / 3)).toFixed(1));
}

export function buildReinforcedConcreteCombinedVinylElasticCeilingCandidateSet(
  baseCandidateScore: number,
  tier: ReinforcedConcreteCombinedVinylElasticCeilingCandidateTier,
  geometry?: ReinforcedConcreteCombinedVinylElasticCeilingGeometry
): ReinforcedConcreteCombinedVinylElasticCeilingCandidateSet {
  const scoreOffsets = REINFORCED_CONCRETE_COMBINED_VINYL_ELASTIC_CEILING_SCORE_OFFSETS[tier];
  const lowConfidenceTopologyPenalty =
    tier === "low_confidence" ? calculateTimberUnderlayTopologyPenalty(geometry) : 0;

  return {
    // Keep same-ceiling nearby rows ahead of the timber-underlay archetype so
    // the low-confidence branch does not imply a narrower family match than it
    // really has.
    candidateIds: REINFORCED_CONCRETE_COMBINED_VINYL_ELASTIC_CEILING_CANDIDATE_IDS,
    candidateScores: scoreOffsets.map((offset, index) =>
      baseCandidateScore + offset + (index === 2 ? lowConfidenceTopologyPenalty : 0)
    )
  };
}

export function deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics(
  input: ImpactPredictorInput
): ReinforcedConcreteCombinedVinylElasticCeilingMetrics | null {
  if (
    input.structuralSupportType !== "reinforced_concrete" ||
    input.impactSystemType !== "combined_upper_lower_system" ||
    input.lowerTreatment?.type !== "suspended_ceiling_elastic_hanger" ||
    normalizePredictorToken(input.floorCovering?.materialClass) !== "vinyl_flooring"
  ) {
    return null;
  }

  const baseThicknessMm = input.baseSlab?.thicknessMm;
  const resilientThicknessMm = input.resilientLayer?.thicknessMm;
  const floorCoveringThicknessMm = input.floorCovering?.thicknessMm;
  const cavityDepthMm = input.lowerTreatment.cavityDepthMm;
  const cavityFillThicknessMm = input.lowerTreatment.cavityFillThicknessMm;
  const boardThicknessMm = input.lowerTreatment.boardThicknessMm;
  const boardLayerCount = input.lowerTreatment.boardLayerCount;

  if (
    !(typeof baseThicknessMm === "number" && baseThicknessMm >= 140 && baseThicknessMm <= 190) ||
    !(typeof resilientThicknessMm === "number" && resilientThicknessMm > 0) ||
    !(typeof floorCoveringThicknessMm === "number" && floorCoveringThicknessMm > 0) ||
    !(typeof cavityDepthMm === "number" && cavityDepthMm > 0) ||
    !(typeof cavityFillThicknessMm === "number" && cavityFillThicknessMm >= 0) ||
    !(typeof boardThicknessMm === "number" && boardThicknessMm > 0) ||
    boardLayerCount !== 2
  ) {
    return null;
  }

  if (input.floatingScreed?.materialClass || input.upperFill?.materialClass) {
    return null;
  }

  if (
    !thicknessNear(resilientThicknessMm, 8, 4) ||
    !thicknessNear(floorCoveringThicknessMm, 3, 2) ||
    !thicknessNear(cavityDepthMm, 120, 30) ||
    !thicknessNear(cavityFillThicknessMm, 100, 35) ||
    !thicknessNear(boardThicknessMm, 16, 3)
  ) {
    return null;
  }

  const baseThicknessDelta = clamp((baseThicknessMm - 150) / 30, -1, 1);
  const upperPackageFactor = clamp(((resilientThicknessMm / 8) + (floorCoveringThicknessMm / 3)) / 2, 0.75, 1.3);
  const ceilingFactor = clamp(
    ((cavityDepthMm / 120) + (Math.min(cavityFillThicknessMm, cavityDepthMm) / 100) + (boardThicknessMm / 16)) / 3,
    0.75,
    1.25
  );

  const lnW = 50.6 - (0.6 * baseThicknessDelta) - (0.8 * (upperPackageFactor - 1)) - (0.8 * (ceilingFactor - 1));
  const rw = 64.9 + baseThicknessDelta + (0.6 * (ceilingFactor - 1)) - (0.2 * (upperPackageFactor - 1));
  const candidateScore =
    1.5 +
    calculateCandidateScore(baseThicknessMm, 150, 30) +
    calculateCandidateScore(resilientThicknessMm, 8, 4) +
    calculateCandidateScore(floorCoveringThicknessMm, 3, 2) +
    calculateCandidateScore(cavityDepthMm, 120, 30) +
    calculateCandidateScore(cavityFillThicknessMm, 100, 35) +
    calculateCandidateScore(boardThicknessMm, 16, 3);

  return {
    candidateScore,
    lnW: Number(lnW.toFixed(1)),
    rw: Number(rw.toFixed(1))
  };
}
