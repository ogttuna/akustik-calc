import { isDeepStrictEqual } from "node:util";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type ExactCombinedAnchorSnapshot = {
  ci: number | null;
  floorSystemEstimateBasis: string | null;
  floorSystemEstimateKind: string | null;
  floorSystemMatchId: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type ExactCombinedAnchorCase = {
  expected: ExactCombinedAnchorSnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
} as const;

const CASES: readonly ExactCombinedAnchorCase[] = [
  {
    id: "c2c lower-ceiling combined anchor stays exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      ci: 4,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "tuas_c2c_clt260_measured_2026",
      floorSystemRatingsBasis: "open_measured_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 44,
      lPrimeNTw: 35,
      lPrimeNW: 37,
      lnW: 35,
      lnWPlusCI: 39,
      rw: 70,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "c3c staged combined anchor stays exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      ci: 2,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "tuas_c3c_clt260_measured_2026",
      floorSystemRatingsBasis: "open_measured_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 43,
      lPrimeNTw: 27,
      lPrimeNW: 29,
      lnW: 27,
      lnWPlusCI: 29,
      rw: 73,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "c7c wet combined anchor stays exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      ci: 5,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "tuas_c7c_clt260_measured_2026",
      floorSystemRatingsBasis: "open_measured_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 44,
      lPrimeNTw: 30,
      lPrimeNW: 32,
      lnW: 30,
      lnWPlusCI: 35,
      rw: 75,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  }
] as const;

function snapshot(layers: readonly LayerInput[]): ExactCombinedAnchorSnapshot {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    ci: result.impact?.CI ?? null,
    floorSystemEstimateBasis: result.floorSystemEstimate?.impact.basis ?? null,
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    floorSystemRatingsBasis: result.floorSystemRatings?.basis ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("clt local combined exact anchor pack", () => {
  it("pins the remaining exact combined anchors on the same local evidence surface", () => {
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
