import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type TraceSnapshot = {
  candidateIds: readonly string[] | null;
  exactMatchId: string | null;
  estimateFitPercent: number | null;
  estimateKind: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  ratingsBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type TraceCase = {
  expected: TraceSnapshot;
  id: string;
  impactFieldContext?: ImpactFieldContext;
  layers: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
  warningIncludes: readonly RegExp[];
};

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 6 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 7 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 40 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 60 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 3 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 5 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 1 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 2 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 20 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 15 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 15 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 20 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 25 },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 25 },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
];

const EXACT_LAB: TraceSnapshot = {
  candidateIds: null,
  exactMatchId: "tuas_r5b_open_box_timber_measured_2026",
  estimateFitPercent: null,
  estimateKind: null,
  impactBasis: "open_measured_floor_system_exact_match",
  lPrimeNT50: null,
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: 44,
  lnWPlusCI: 44,
  ratingsBasis: "open_measured_floor_system_exact_match",
  rw: 75,
  supported: ["Rw", "Ln,w", "Ln,w+CI"],
  unsupported: ["DeltaLw"]
};

const EXACT_FIELD: TraceSnapshot = {
  candidateIds: null,
  exactMatchId: "tuas_r5b_open_box_timber_measured_2026",
  estimateFitPercent: null,
  estimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
  lPrimeNT50: 46.6,
  lPrimeNTw: 43.6,
  lPrimeNW: 46,
  lnW: 44,
  lnWPlusCI: 44,
  ratingsBasis: "open_measured_floor_system_exact_match",
  rw: 75,
  supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const DISJOINT_LAB: TraceSnapshot = {
  candidateIds: [
    "tuas_r5a_open_box_timber_measured_2026",
    "tuas_r3b_open_box_timber_measured_2026",
    "tuas_r3a_open_box_timber_measured_2026"
  ],
  exactMatchId: null,
  estimateFitPercent: 54,
  estimateKind: "family_general",
  impactBasis: "predictor_floor_system_family_general_estimate",
  lPrimeNT50: null,
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: 56.3,
  lnWPlusCI: 57.7,
  ratingsBasis: "predictor_floor_system_family_general_estimate",
  rw: 63.8,
  supported: ["Rw", "Ln,w", "Ln,w+CI"],
  unsupported: ["DeltaLw"]
};

const DISJOINT_FIELD: TraceSnapshot = {
  candidateIds: [
    "tuas_r5a_open_box_timber_measured_2026",
    "tuas_r3b_open_box_timber_measured_2026",
    "tuas_r3a_open_box_timber_measured_2026"
  ],
  exactMatchId: null,
  estimateFitPercent: 54,
  estimateKind: "family_general",
  impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
  lPrimeNT50: 58.8,
  lPrimeNTw: 55.9,
  lPrimeNW: 58.3,
  lnW: 56.3,
  lnWPlusCI: 57.7,
  ratingsBasis: "predictor_floor_system_family_general_estimate",
  rw: 63.8,
  supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const CASES: readonly TraceCase[] = [
  {
    id: "r5b-fragmented-source-lab",
    layers: OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS,
    targetOutputs: LAB_OUTPUTS,
    expected: EXACT_LAB,
    warningIncludes: [/curated exact floor-system match active: TUAS R5b/i]
  },
  {
    id: "r5b-fragmented-source-field",
    impactFieldContext: FIELD_CONTEXT,
    layers: OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS,
    targetOutputs: FIELD_OUTPUTS,
    expected: EXACT_FIELD,
    warningIncludes: [/curated exact floor-system match active: TUAS R5b/i, /live field-side supplement is active/i]
  },
  {
    id: "r5b-disjoint-upper-fill-lab",
    layers: OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS,
    targetOutputs: LAB_OUTPUTS,
    expected: DISJOINT_LAB,
    warningIncludes: [/single-entry floor roles are duplicated: upper fill x2/i, /family general at 54% fit/i]
  },
  {
    id: "r5b-disjoint-upper-fill-field",
    impactFieldContext: FIELD_CONTEXT,
    layers: OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS,
    targetOutputs: FIELD_OUTPUTS,
    expected: DISJOINT_FIELD,
    warningIncludes: [/single-entry floor roles are duplicated: upper fill x2/i, /family general at 54% fit/i]
  }
];

function snapshot(testCase: TraceCase): TraceSnapshot {
  const result = calculateAssembly(testCase.layers, {
    impactFieldContext: testCase.impactFieldContext,
    targetOutputs: testCase.targetOutputs
  });

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    estimateFitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    ratingsBasis: result.floorSystemRatings?.basis ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("open-box dry package fragmentation trace matrix", () => {
  it("pins R5b fragmented exact input and disjoint upper-fill fallback with lab and field answers", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = calculateAssembly(testCase.layers, {
        impactFieldContext: testCase.impactFieldContext,
        targetOutputs: testCase.targetOutputs
      });
      const actual = snapshot(testCase);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }

      for (const pattern of testCase.warningIncludes) {
        if (!result.warnings.some((warning: string) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
