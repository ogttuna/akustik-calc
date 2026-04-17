import { describe, expect, it } from "vitest";

import {
  buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet,
  deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics
} from "./reinforced-concrete-combined-vinyl-elastic-ceiling-estimate";

describe("reinforced concrete combined vinyl elastic ceiling ranking", () => {
  it("keeps same-ceiling nearby rows ahead of the timber-underlay row for the low-confidence lane", () => {
    const metrics = deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 180,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 8,
        dynamicStiffnessMNm3: 35
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3,
        densityKgM3: 1400
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16,
        boardMaterialClass: "firestop_board"
      }
    });

    expect(metrics).not.toBeNull();

    const lowConfidenceCandidateSet = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(
      metrics!.candidateScore,
      {
        boardThicknessMm: 16,
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100
      }
    );

    expect(lowConfidenceCandidateSet.candidateIds).toEqual([
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
    expect(lowConfidenceCandidateSet.candidateScores).toEqual([5, 5.5, 7.8]);
  });

  it("keeps the low-confidence nearby-row fallback on the same order with an explicit uncertainty penalty", () => {
    const metrics = deriveReinforcedConcreteCombinedVinylElasticCeilingMetrics({
      structuralSupportType: "reinforced_concrete",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        materialClass: "heavy_concrete",
        thicknessMm: 180,
        densityKgM3: 2400
      },
      resilientLayer: {
        thicknessMm: 8,
        dynamicStiffnessMNm3: 35
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3,
        densityKgM3: 1400
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    });

    expect(metrics).not.toBeNull();

    const lowConfidenceCandidateSet = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(
      metrics!.candidateScore,
      {
        boardThicknessMm: 16,
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100
      }
    );

    expect(lowConfidenceCandidateSet.candidateIds).toEqual([
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
    ]);
    expect(lowConfidenceCandidateSet.candidateScores).toEqual([5, 5.5, 7.8]);
  });

  it("keeps the same-ceiling row as the best-scored nearby row across the fallback ordering", () => {
    const baseCandidateScore = 4.1;
    const lowConfidenceCandidateSet = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(
      baseCandidateScore,
      {
        boardThicknessMm: 16,
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100
      }
    );

    expect(lowConfidenceCandidateSet.candidateScores[0]).toBeLessThan(lowConfidenceCandidateSet.candidateScores[1]!);
    expect(lowConfidenceCandidateSet.candidateScores[1]).toBeLessThan(lowConfidenceCandidateSet.candidateScores[2]!);
  });

  it("increases the timber-underlay fallback penalty as the ceiling geometry drifts farther away", () => {
    const baseCandidateScore = 2.5;
    const shallower = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(baseCandidateScore, {
      boardThicknessMm: 15,
      cavityDepthMm: 100,
      cavityFillThicknessMm: 85
    });
    const baseline = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(baseCandidateScore, {
      boardThicknessMm: 16,
      cavityDepthMm: 120,
      cavityFillThicknessMm: 100
    });
    const deeper = buildReinforcedConcreteCombinedVinylElasticCeilingLowConfidenceCandidateSet(baseCandidateScore, {
      boardThicknessMm: 18,
      cavityDepthMm: 140,
      cavityFillThicknessMm: 120
    });

    expect(shallower.candidateScores.slice(0, 2)).toEqual([5, 5.5]);
    expect(baseline.candidateScores.slice(0, 2)).toEqual([5, 5.5]);
    expect(deeper.candidateScores.slice(0, 2)).toEqual([5, 5.5]);

    expect(shallower.candidateScores[2]).toBe(7.5);
    expect(baseline.candidateScores[2]).toBe(7.8);
    expect(deeper.candidateScores[2]).toBe(8.2);
  });
});
