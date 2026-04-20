import { isDeepStrictEqual } from "node:util";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type CombinedCltEvidenceSnapshot = {
  ci: number | null;
  estimateCandidateIds: readonly string[] | null;
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

type CombinedCltEvidenceCase = {
  expected: CombinedCltEvidenceSnapshot;
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

const CASES: readonly CombinedCltEvidenceCase[] = [
  {
    id: "exact c4c combined anchor stays on the exact mixed field continuation",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      ci: 2,
      estimateCandidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: "tuas_c4c_clt260_measured_2026",
      floorSystemRatingsBasis: "open_measured_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 40,
      lPrimeNTw: 24,
      lPrimeNW: 26,
      lnW: 24,
      lnWPlusCI: 26,
      rw: 74,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "visible c5c combined proxy stays predictor-backed without pretending exact local evidence",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      ci: 4,
      estimateCandidateIds: ["tuas_c5c_clt260_measured_2026"],
      floorSystemEstimateBasis: "predictor_mass_timber_clt_dry_interaction_estimate",
      floorSystemEstimateKind: "family_general",
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "predictor_mass_timber_clt_dry_interaction_estimate",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 44,
      lPrimeNTw: 38,
      lPrimeNW: 40,
      lnW: 38,
      lnWPlusCI: 42,
      rw: 75,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "under-described local combined shape stays fail-closed for impact outputs",
    layers: [
      { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 13 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 4 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 220 }
    ],
    expected: {
      ci: null,
      estimateCandidateIds: null,
      floorSystemEstimateBasis: null,
      floorSystemEstimateKind: null,
      floorSystemMatchId: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      lnW: null,
      lnWPlusCI: null,
      rw: 49,
      supported: ["Rw"],
      unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  }
] as const;

function snapshot(layers: readonly LayerInput[]): CombinedCltEvidenceSnapshot {
  const result = calculateAssembly(layers, {
    impactFieldContext: FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });

  return {
    ci: result.impact?.CI ?? null,
    estimateCandidateIds: result.impact?.estimateCandidateIds ?? null,
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

describe("clt local combined interaction evidence matrix", () => {
  it("pins the first explicit local combined evidence triad without reopening under-described shapes", () => {
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
