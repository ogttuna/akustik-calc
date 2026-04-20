import { isDeepStrictEqual } from "node:util";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type ProvenanceSnapshot = {
  boundFloorSystemMatchId: string | null;
  calculatorId: string | null;
  candidateIds: readonly string[] | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  method: string;
  supported: readonly RequestedOutputId[];
  supportedImpact: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  unsupportedImpact: readonly RequestedOutputId[];
  values: {
    c: number | null;
    ctr: number | null;
    dnA: number | null;
    dnTADb: number | null;
    dnTwDb: number | null;
    dnW: number | null;
    lPrimeNTw: number | null;
    lPrimeNW: number | null;
    lnW: number | null;
    rw: number | null;
    rwDb: number | null;
    rwPrimeDb: number | null;
    stc: number | null;
  };
};

type ProvenanceCase = {
  expected: ProvenanceSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];
const IMPACT_SUPPORTED: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const COMMON_FORMULA_PROVENANCE = {
  boundFloorSystemMatchId: null,
  calculatorId: null,
  candidateIds: null,
  floorSystemEstimateBasis: null,
  floorSystemEstimateKind: null,
  floorSystemMatchId: null,
  floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lowerBoundBasis: null,
  method: "screening_mass_law_curve_seed_v3",
  supportedImpact: IMPACT_SUPPORTED,
  unsupportedImpact: []
} as const;

const CASES: readonly ProvenanceCase[] = [
  {
    id: "split full helper package keeps the same formula provenance",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 40 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "furring_channel", thicknessMm: 18 },
      { materialId: "concrete", thicknessMm: 160 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -0.7,
        ctr: -5.4,
        dnA: 56.8,
        dnTADb: 59.2,
        dnTwDb: 60,
        dnW: 58,
        lPrimeNTw: 72.3,
        lPrimeNW: 74.7,
        lnW: 72.7,
        rw: 57,
        rwDb: 57.1,
        rwPrimeDb: 57,
        stc: 57
      }
    }
  },
  {
    id: "split board and fill helper keeps the same formula provenance",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 15 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 60 },
      { materialId: "rockwool", thicknessMm: 30 },
      { materialId: "concrete", thicknessMm: 180 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -0.7,
        ctr: -5.4,
        dnA: 57.8,
        dnTADb: 60.2,
        dnTwDb: 61,
        dnW: 59,
        lPrimeNTw: 70.6,
        lPrimeNW: 73,
        lnW: 71,
        rw: 58,
        rwDb: 58.1,
        rwPrimeDb: 58,
        stc: 58
      }
    }
  },
  {
    id: "split board and cavity helper keeps the same formula provenance",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "furring_channel", thicknessMm: 20 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "furring_channel", thicknessMm: 20 },
      { materialId: "concrete", thicknessMm: 140 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -1,
        ctr: -5.7,
        dnA: 54.5,
        dnTADb: 56.9,
        dnTwDb: 58,
        dnW: 56,
        lPrimeNTw: 74.2,
        lPrimeNW: 76.6,
        lnW: 74.6,
        rw: 55,
        rwDb: 55,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "top finish after split helper lane keeps formula provenance while rw stays shut",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 160 },
      { materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      values: {
        c: -1.5,
        ctr: -6.2,
        dnA: 57,
        dnTADb: 59.4,
        dnTwDb: 61,
        dnW: 58,
        lPrimeNTw: 72.7,
        lPrimeNW: 75.1,
        lnW: 73.1,
        rw: 58,
        rwDb: 57.2,
        rwPrimeDb: 58,
        stc: 58
      }
    }
  },
  {
    id: "wall-like concrete hybrid keeps the same formula provenance while rw stays shut",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "concrete", thicknessMm: 120 },
      { materialId: "rockwool", thicknessMm: 45 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      ...COMMON_FORMULA_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      values: {
        c: -1.3,
        ctr: -6,
        dnA: 53.2,
        dnTADb: 55.6,
        dnTwDb: 57,
        dnW: 54,
        lPrimeNTw: 77,
        lPrimeNW: 79.4,
        lnW: 77.4,
        rw: 54,
        rwDb: 53.9,
        rwPrimeDb: 54,
        stc: 54
      }
    }
  },
  {
    id: "steel joist helper-heavy carrier stays outside the concrete provenance lane",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "steel_joist_floor", thicknessMm: 250 }
    ],
    expected: {
      boundFloorSystemMatchId: null,
      calculatorId: null,
      candidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: null,
      lowerBoundBasis: null,
      method: "screening_mass_law_curve_seed_v3",
      supported: ["R'w", "DnT,w"],
      supportedImpact: [],
      unsupported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedImpact: ["Ln,w", "L'n,w", "L'nT,w"],
      values: {
        c: -0.9,
        ctr: -5.6,
        dnA: 69.6,
        dnTADb: 72,
        dnTwDb: 73,
        dnW: 71,
        lPrimeNTw: null,
        lPrimeNW: null,
        lnW: null,
        rw: 70,
        rwDb: 70.2,
        rwPrimeDb: 70,
        stc: 70
      }
    }
  }
];

function snapshot(layers: readonly LayerInput[]): ProvenanceSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: FIELD_OUTPUTS
  });

  return {
    boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
    calculatorId: result.calculatorId ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: result.floorSystemRatings?.basis ?? null,
    impactBasis: result.impact?.basis ?? null,
    lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
    method: result.metrics.method,
    supported: result.supportedTargetOutputs,
    supportedImpact: result.supportedImpactOutputs,
    unsupported: result.unsupportedTargetOutputs,
    unsupportedImpact: result.unsupportedImpactOutputs,
    values: {
      c: result.metrics.estimatedCDb ?? null,
      ctr: result.metrics.estimatedCtrDb ?? null,
      dnA: result.metrics.estimatedDnADb ?? null,
      dnTADb: result.metrics.estimatedDnTADb ?? null,
      dnTwDb: result.metrics.estimatedDnTwDb ?? null,
      dnW: result.metrics.estimatedDnWDb ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
      lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      rwDb: result.metrics.estimatedRwDb ?? null,
      rwPrimeDb: result.metrics.estimatedRwPrimeDb ?? null,
      stc: result.metrics.estimatedStc ?? null
    }
  };
}

describe("raw terminal concrete helper split topology origin matrix", () => {
  it("pins provenance for the second defended split-helper widening cut", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase.layers);

      if (!isDeepStrictEqual(actual, testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
