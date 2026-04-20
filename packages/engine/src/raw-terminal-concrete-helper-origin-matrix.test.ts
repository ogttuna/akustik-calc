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

const COMMON_PROVENANCE = {
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

const COMMON_POSITIVE_VALUES = {
  c: -1.2,
  ctr: -5.9
} as const;

const CASES: readonly ProvenanceCase[] = [
  {
    id: "furring full helper concrete baseline stays formula-owned",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        ...COMMON_POSITIVE_VALUES,
        dnA: 54.3,
        dnTADb: 56.7,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.4,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "resilient stud helper concrete stays on the same provenance surface",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        ...COMMON_POSITIVE_VALUES,
        dnA: 54.3,
        dnTADb: 56.7,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.4,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "rigid hanger helper concrete keeps the same formula provenance",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { materialId: "concrete", thicknessMm: 160 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        ...COMMON_POSITIVE_VALUES,
        dnA: 55.3,
        dnTADb: 57.7,
        dnTwDb: 59,
        dnW: 56,
        lPrimeNTw: 72.7,
        lPrimeNW: 75.1,
        lnW: 73.1,
        rw: 56,
        rwDb: 55.9,
        rwPrimeDb: 56,
        stc: 56
      }
    }
  },
  {
    id: "resilient channel helper concrete keeps the same formula provenance",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "rockwool", thicknessMm: 100 },
      { materialId: "resilient_channel", thicknessMm: 27 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        ...COMMON_POSITIVE_VALUES,
        dnA: 54.3,
        dnTADb: 56.7,
        dnTwDb: 58,
        dnW: 56,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.4,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "clip plus board cavity helper concrete stays formula-owned",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 16 },
      { materialId: "genieclip_rst", thicknessMm: 16 },
      { materialId: "concrete", thicknessMm: 200 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        c: -1.5,
        ctr: -6.2,
        dnA: 58,
        dnTADb: 60.4,
        dnTwDb: 62,
        dnW: 59,
        lPrimeNTw: 69.3,
        lPrimeNW: 71.7,
        lnW: 69.7,
        rw: 59,
        rwDb: 58.7,
        rwPrimeDb: 59,
        stc: 59
      }
    }
  },
  {
    id: "board only concrete lower treatment keeps formula provenance while rw stays shut",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 13 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      values: {
        c: -1.4,
        ctr: -6.1,
        dnA: 54.1,
        dnTADb: 56.5,
        dnTwDb: 58,
        dnW: 55,
        lPrimeNTw: 73.7,
        lPrimeNW: 76.1,
        lnW: 74.1,
        rw: 55,
        rwDb: 55.3,
        rwPrimeDb: 55,
        stc: 55
      }
    }
  },
  {
    id: "helper without board keeps formula provenance while rw stays shut",
    layers: [
      { materialId: "rockwool", thicknessMm: 90 },
      { materialId: "furring_channel", thicknessMm: 28 },
      { materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      ...COMMON_PROVENANCE,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["Rw"],
      values: {
        c: -1.1,
        ctr: -5.9,
        dnA: 54.4,
        dnTADb: 56.8,
        dnTwDb: 58,
        dnW: 56,
        lPrimeNTw: 74.1,
        lPrimeNW: 76.5,
        lnW: 74.5,
        rw: 55,
        rwDb: 54.7,
        rwPrimeDb: 55,
        stc: 55
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

  // The engine does not surface a separate origin enum here; the basis/match/support
  // fields are the honest provenance surface for this guarded formula lane.
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

describe("raw terminal concrete helper origin matrix", () => {
  it("pins the provenance surface for the first helper-family widening cut and its nearby negatives", () => {
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
